/**
 * LECASU — Servidor de Produção & API REST Nativa Node.js
 * Compatível com Servidor Node tradicional (VPS/Docker) e Vercel Serverless (/api/index.js).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const {
  cloneDefaults,
  ensureProductImages,
  sanitizeImageUrl,
  stripLegacyObsoleteProducts
} = require('../shared-catalog.js');

const DEFAULT_PORT = Number(process.env.PORT) || 5500;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Lista branca estrita de ficheiros públicos servidos por HTTP
const PUBLIC_FILES = new Set([
  '/index.html',
  '/admin.html',
  '/style.css',
  '/admin.css',
  '/app.js',
  '/admin.js',
  '/shared-catalog.js',
  '/sw.js',
  '/manifest.json',
  '/logo.png',
  '/logo-transparent.png',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png'
]);

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

function base64UrlEncode(input) {
  return Buffer.from(input).toString('base64url');
}

function base64UrlDecode(input) {
  return Buffer.from(input, 'base64url').toString('utf8');
}

function hashPassword(password, salt) {
  const usedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), usedSalt, 64).toString('hex');
  return { salt: usedSalt, passwordHash: hash };
}

function verifyPassword(password, salt, expectedHashHex) {
  if (!password || !salt || !expectedHashHex) return false;
  try {
    const derived = crypto.scryptSync(String(password), salt, 64);
    const expected = Buffer.from(expectedHashHex, 'hex');
    if (derived.length !== expected.length) return false;
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) {
      try {
        cookies[key] = decodeURIComponent(val);
      } catch {
        cookies[key] = val;
      }
    }
  });
  return cookies;
}

function readJsonBody(req, maxBytes = 2 * 1024 * 1024) {
  // Suporte caso o runtime (ex.: Vercel Serverless) já tenha feito pré-parse de req.body
  if (req.body) {
    if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
      return Promise.resolve(req.body);
    }
    if (typeof req.body === 'string') {
      try {
        return Promise.resolve(JSON.parse(req.body || '{}'));
      } catch {
        const err = new Error('JSON inválido no corpo do pedido.');
        err.statusCode = 400;
        return Promise.reject(err);
      }
    }
    if (Buffer.isBuffer(req.body)) {
      try {
        return Promise.resolve(JSON.parse(req.body.toString('utf8') || '{}'));
      } catch {
        const err = new Error('JSON inválido no corpo do pedido.');
        err.statusCode = 400;
        return Promise.reject(err);
      }
    }
  }

  // Se o stream já foi consumido pelo servidor/runtime
  if (req.readableEnded || req.complete) {
    return Promise.resolve({});
  }

  return new Promise((resolve, reject) => {
    let total = 0;
    const chunks = [];
    let settled = false;

    req.on('data', (chunk) => {
      if (settled) return;
      total += chunk.length;
      if (total > maxBytes) {
        settled = true;
        const err = new Error('Payload demasiado grande.');
        err.statusCode = 413;
        if (typeof req.destroy === 'function') req.destroy();
        reject(err);
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      if (settled) return;
      settled = true;
      const raw = Buffer.concat(chunks).toString('utf8').trim();
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        const err = new Error('JSON inválido no corpo do pedido.');
        err.statusCode = 400;
        reject(err);
      }
    });

    req.on('error', (err) => {
      if (settled) return;
      settled = true;
      err.statusCode = 400;
      reject(err);
    });
  });
}

function writeJsonAtomic(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    const tmpPath = `${filePath}.tmp.${process.pid}.${Date.now()}`;
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmpPath, filePath);
    return true;
  } catch (e) {
    console.warn('Aviso ao gravar ficheiro JSON:', e.message);
    return false;
  }
}

function resolveRootDir(customRoot) {
  if (customRoot) return path.resolve(customRoot);
  const parent = path.resolve(__dirname, '..');
  if (fs.existsSync(path.join(parent, 'index.html'))) return parent;
  if (fs.existsSync(path.join(__dirname, 'index.html'))) return __dirname;
  return process.cwd();
}

function resolveWritableDataDir(customDir, rootDir) {
  if (customDir) return path.resolve(customDir);
  if (process.env.LECASU_DATA_DIR) return path.resolve(process.env.LECASU_DATA_DIR);
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION) {
    return path.join(os.tmpdir(), 'lecasu-data');
  }
  return path.join(rootDir, 'data');
}

function sanitizeProductList(category, list) {
  if (!Array.isArray(list) || list.length === 0) return null;
  const cleanList = [];

  for (const raw of list) {
    if (!raw || typeof raw !== 'object') return null;
    const id = String(raw.id || '').trim().slice(0, 80);
    const name = String(raw.name || '').trim().slice(0, 120);
    const price = Number(raw.price);
    if (!id || !name || !Number.isFinite(price) || price <= 0) return null;

    const brand = String(raw.brand || 'Outro').trim().slice(0, 60);
    const extra = String(raw.extra || '').trim().slice(0, 140);
    const item = {
      id,
      name,
      brand,
      price,
      extra,
      image: sanitizeImageUrl(raw.image)
    };

    if (category === 'panels') {
      const power = Number(raw.power);
      if (!Number.isFinite(power) || power <= 0) return null;
      item.power = Math.round(power);
      if (raw.series) item.series = String(raw.series).slice(0, 60);
      if (raw.panelType) item.panelType = String(raw.panelType).slice(0, 40);
      if (raw.cellTech) item.cellTech = String(raw.cellTech).slice(0, 80);
      if (raw.cells) item.cells = String(raw.cells).slice(0, 40);
      if (raw.efficiency) item.efficiency = String(raw.efficiency).slice(0, 20);
      if (raw.vMax) item.vMax = String(raw.vMax).slice(0, 20);
      if (raw.dimensions) item.dimensions = String(raw.dimensions).slice(0, 50);
      if (raw.weight) item.weight = String(raw.weight).slice(0, 20);
      if (raw.warranty) item.warranty = String(raw.warranty).slice(0, 60);
    } else if (category === 'inverters') {
      const power = Number(raw.power);
      if (!Number.isFinite(power) || power <= 0) return null;
      item.power = power;
      item.voltageType = raw.voltageType === 'HV' ? 'HV' : 'LV';
      item.phase = ['1ph', 'split', '3ph'].includes(raw.phase) ? raw.phase : '3ph';
    } else if (category === 'batteries') {
      const capacity = Number(raw.capacity);
      if (!Number.isFinite(capacity) || capacity <= 0) return null;
      item.capacity = capacity;
      item.voltageType = raw.voltageType === 'HV' ? 'HV' : 'LV';
      if (raw.subcategory) item.subcategory = String(raw.subcategory).slice(0, 40);
    }

    if (!raw.image) {
      delete item.image;
    }
    cleanList.push(item);
  }

  return cleanList;
}

function createAppHandler(options = {}) {
  const ROOT = resolveRootDir(options.rootDir);
  const DATA_DIR = resolveWritableDataDir(options.dataDir, ROOT);
  const CATALOG_FILE = path.join(DATA_DIR, 'catalog.json');
  const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');
  const QUOTES_FILE = path.join(DATA_DIR, 'quotes.json');
  const SECRET_FILE = path.join(DATA_DIR, '.session_secret');

  const INITIAL_USER = (options.adminUser || process.env.ADMIN_USER || 'admin@lecasu.co.mz').trim();
  const INITIAL_ALIAS = 'admin';
  const INITIAL_PASS = options.adminPassword || process.env.ADMIN_PASSWORD || 'lecasu2026';

  const loginAttempts = new Map();
  let memoryCatalog = null;
  let memoryAdmin = null;
  let memoryQuotes = null;

  function getSessionSecret() {
    if (options.sessionSecret) return options.sessionSecret;
    if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
    try {
      if (fs.existsSync(SECRET_FILE)) {
        const existing = fs.readFileSync(SECRET_FILE, 'utf8').trim();
        if (existing.length >= 32) return existing;
      }
      if (!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        const generated = crypto.randomBytes(32).toString('hex');
        fs.writeFileSync(SECRET_FILE, generated, { encoding: 'utf8', mode: 0o600 });
        return generated;
      }
    } catch {}
    // Em ambiente serverless multi-instância sem SESSION_SECRET explícito, deriva chave consistente
    return crypto
      .createHmac('sha256', 'lecasu-serverless-session-key')
      .update(`${INITIAL_USER}|${INITIAL_PASS}|${process.env.VERCEL_PROJECT_ID || 'local'}`)
      .digest('hex');
  }

  const SESSION_SECRET = getSessionSecret();

  function getAdminRecord() {
    if (memoryAdmin) return memoryAdmin;
    try {
      const pathsToCheck = [ADMIN_FILE, path.join(ROOT, 'data', 'admin.json')];
      for (const p of pathsToCheck) {
        if (fs.existsSync(p)) {
          const parsed = JSON.parse(fs.readFileSync(p, 'utf8'));
          if (parsed && parsed.username && parsed.salt && parsed.passwordHash) {
            memoryAdmin = parsed;
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Erro ao ler admin.json:', e.message);
    }

    const { salt, passwordHash } = hashPassword(INITIAL_PASS);
    const initial = {
      username: INITIAL_USER,
      alias: INITIAL_ALIAS,
      name: 'Administrador LECASU',
      salt,
      passwordHash,
      updatedAt: 'initial'
    };
    memoryAdmin = initial;
    writeJsonAtomic(ADMIN_FILE, initial);
    return initial;
  }

  function getCatalog() {
    try {
      const pathsToCheck = [CATALOG_FILE, path.join(ROOT, 'data', 'catalog.json')];
      for (const p of pathsToCheck) {
        if (fs.existsSync(p)) {
          const parsed = JSON.parse(fs.readFileSync(p, 'utf8'));
          if (
            parsed &&
            Array.isArray(parsed.panels) && parsed.panels.length > 0 &&
            Array.isArray(parsed.inverters) && parsed.inverters.length > 0 &&
            Array.isArray(parsed.batteries) && parsed.batteries.length > 0
          ) {
            stripLegacyObsoleteProducts(parsed);
            memoryCatalog = parsed;
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Erro ao ler catalog.json:', e.message);
    }

    if (memoryCatalog) return memoryCatalog;

    const seeded = cloneDefaults();
    seeded.updatedAt = new Date().toISOString();
    memoryCatalog = seeded;
    writeJsonAtomic(CATALOG_FILE, seeded);
    return seeded;
  }

  function saveCatalogToDisk(payload) {
    const panels = sanitizeProductList('panels', payload.panels);
    const inverters = sanitizeProductList('inverters', payload.inverters);
    const batteries = sanitizeProductList('batteries', payload.batteries);
    if (!panels || !inverters || !batteries) {
      return null;
    }
    const cleanCatalog = {
      panels,
      inverters,
      batteries,
      updatedAt: new Date().toISOString()
    };
    ensureProductImages(cleanCatalog);
    memoryCatalog = cleanCatalog;
    writeJsonAtomic(CATALOG_FILE, cleanCatalog);
    return cleanCatalog;
  }

  function signSessionToken(adminRec, remember) {
    const ttlMs = remember ? 7 * 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000;
    const payload = {
      username: adminRec.username,
      name: adminRec.name || 'Administrador LECASU',
      pwdAt: adminRec.updatedAt,
      exp: Date.now() + ttlMs,
      jti: crypto.randomBytes(8).toString('hex')
    };
    const encoded = base64UrlEncode(JSON.stringify(payload));
    const sig = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
    return `${encoded}.${sig}`;
  }

  function verifySessionToken(token, adminRec) {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [encoded, sig] = parts;
    const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
    try {
      const sigBuf = Buffer.from(sig);
      const expBuf = Buffer.from(expectedSig);
      if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        return null;
      }
      const payload = JSON.parse(base64UrlDecode(encoded));
      if (!payload || typeof payload.exp !== 'number' || payload.exp < Date.now()) {
        return null;
      }
      if (payload.pwdAt !== adminRec.updatedAt) {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }

  function buildSessionCookie(req, value, maxAgeSeconds) {
    const parts = [
      `lecasu_session=${encodeURIComponent(value)}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Strict'
    ];
    if (typeof maxAgeSeconds === 'number') {
      parts.push(`Max-Age=${maxAgeSeconds}`);
    }
    const isHttps = req.headers['x-forwarded-proto'] === 'https' || (req.socket && req.socket.encrypted);
    if (isHttps) {
      parts.push('Secure');
    }
    return parts.join('; ');
  }

  function getAuthenticatedAdmin(req) {
    const cookies = parseCookies(req.headers.cookie);
    const adminRec = getAdminRecord();
    const session = verifySessionToken(cookies.lecasu_session, adminRec);
    return session ? { session, adminRec } : null;
  }

  function checkRateLimit(ip) {
    const now = Date.now();
    const rec = loginAttempts.get(ip);
    if (!rec) return { allowed: true };
    if (now > rec.resetAt) {
      loginAttempts.delete(ip);
      return { allowed: true };
    }
    if (rec.count >= 10) {
      return { allowed: false, retryAfterSec: Math.ceil((rec.resetAt - now) / 1000) };
    }
    return { allowed: true };
  }

  function recordFailedLogin(ip) {
    const now = Date.now();
    const rec = loginAttempts.get(ip);
    if (!rec || now > rec.resetAt) {
      loginAttempts.set(ip, { count: 1, resetAt: now + 5 * 60 * 1000 });
    } else {
      rec.count += 1;
    }
  }

  function sendJson(res, status, data, extraHeaders = {}) {
    const body = Buffer.from(JSON.stringify(data), 'utf8');
    res.writeHead(status, {
      ...SECURITY_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': body.length,
      'Cache-Control': 'no-store',
      ...extraHeaders
    });
    res.end(body);
  }

  function sendNotFoundHtml(res, method) {
    const html = Buffer.from(`<!doctype html>
<html lang="pt-MZ">
<head>
  <meta charset="utf-8">
  <title>404 — Página Não Encontrada | LECASU</title>
  <style>
    body { font-family: system-ui, sans-serif; text-align: center; padding: 60px 20px; background: #f8fafc; color: #1e293b; }
    .card { max-width: 460px; margin: 0 auto; background: #ffffff; padding: 36px 28px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    h2 { color: #ea580c; margin-top: 0; }
    p { color: #64748b; font-size: 14px; line-height: 1.5; }
    a { display: inline-block; margin-top: 14px; background: #ea580c; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 7px; font-weight: 600; font-size: 13px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>404 — Ficheiro Não Encontrado</h2>
    <p>O recurso que procura não está disponível ou foi movido.</p>
    <a href="/">Voltar ao Simulador</a>
  </div>
</body>
</html>`, 'utf8');
    res.writeHead(404, {
      ...SECURITY_HEADERS,
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': html.length,
      'Cache-Control': 'no-store'
    });
    if (method === 'HEAD') {
      res.end();
    } else {
      res.end(html);
    }
  }

  async function handleApi(req, res, pathname) {
    const method = (req.method || 'GET').toUpperCase();

    if (method === 'OPTIONS') {
      res.writeHead(204, {
        ...SECURITY_HEADERS,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400'
      });
      res.end();
      return;
    }

    if (pathname === '/health' && (method === 'GET' || method === 'HEAD')) {
      const payload = { ok: true, status: 'healthy', service: 'lecasu-simulador-solar', timestamp: new Date().toISOString() };
      const body = Buffer.from(JSON.stringify(payload), 'utf8');
      res.writeHead(200, {
        ...SECURITY_HEADERS,
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': body.length,
        'Cache-Control': 'no-store'
      });
      res.end(method === 'HEAD' ? undefined : body);
      return;
    }

    if (pathname === '/api/products' && method === 'GET') {
      return sendJson(res, 200, getCatalog());
    }

    if (pathname === '/api/products' && method === 'PUT') {
      const auth = getAuthenticatedAdmin(req);
      if (!auth) return sendJson(res, 401, { error: 'Sessão expirada ou não autenticada.' });
      try {
        const body = await readJsonBody(req, 10 * 1024 * 1024);
        const saved = saveCatalogToDisk(body);
        if (!saved) {
          return sendJson(res, 400, { error: 'Estrutura de catálogo inválida ou categoria vazia.' });
        }
        return sendJson(res, 200, { ok: true, catalog: saved });
      } catch (err) {
        return sendJson(res, err.statusCode || 400, { error: err.message });
      }
    }

    if (pathname === '/api/products/reset' && method === 'POST') {
      const auth = getAuthenticatedAdmin(req);
      if (!auth) return sendJson(res, 401, { error: 'Sessão expirada ou não autenticada.' });
      const reset = cloneDefaults();
      reset.updatedAt = new Date().toISOString();
      memoryCatalog = reset;
      writeJsonAtomic(CATALOG_FILE, reset);
      return sendJson(res, 200, { ok: true, catalog: reset });
    }

    if (pathname === '/api/auth/me' && method === 'GET') {
      const auth = getAuthenticatedAdmin(req);
      if (!auth) return sendJson(res, 401, { authenticated: false });
      return sendJson(res, 200, {
        authenticated: true,
        user: { username: auth.session.username, name: auth.session.name }
      });
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
      const ip = (req.headers['x-forwarded-for'] || (req.socket && req.socket.remoteAddress) || 'unknown').split(',')[0].trim();
      const rate = checkRateLimit(ip);
      if (!rate.allowed) {
        return sendJson(res, 429, {
          error: `Demasiadas tentativas de acesso. Tente novamente em ${rate.retryAfterSec}s.`
        });
      }

      try {
        const body = await readJsonBody(req, 16 * 1024);
        const enteredUser = String(body.username || '').trim().toLowerCase();
        const enteredPwd = String(body.password || '');
        const remember = Boolean(body.remember);

        const adminRec = getAdminRecord();
        const userOk =
          enteredUser === adminRec.username.toLowerCase() ||
          (adminRec.alias && enteredUser === adminRec.alias.toLowerCase());
        const pwdOk = verifyPassword(enteredPwd, adminRec.salt, adminRec.passwordHash);

        if (!userOk || !pwdOk) {
          recordFailedLogin(ip);
          return sendJson(res, 401, { error: 'Utilizador ou palavra-passe incorretos. Por favor, tente novamente.' });
        }

        loginAttempts.delete(ip);
        const token = signSessionToken(adminRec, remember);
        const cookie = buildSessionCookie(req, token, remember ? 7 * 24 * 60 * 60 : undefined);
        return sendJson(
          res,
          200,
          { ok: true, user: { username: adminRec.username, name: adminRec.name } },
          { 'Set-Cookie': cookie }
        );
      } catch (err) {
        return sendJson(res, err.statusCode || 400, { error: err.message });
      }
    }

    if (pathname === '/api/auth/logout' && method === 'POST') {
      const clearCookie = buildSessionCookie(req, '', 0);
      return sendJson(res, 200, { ok: true }, { 'Set-Cookie': clearCookie });
    }

    if (pathname === '/api/auth/password' && method === 'POST') {
      const auth = getAuthenticatedAdmin(req);
      if (!auth) return sendJson(res, 401, { error: 'Sessão expirada ou não autenticada.' });
      try {
        const body = await readJsonBody(req, 16 * 1024);
        const currentPwd = String(body.currentPassword || '');
        const newPwd = String(body.newPassword || '');

        if (!verifyPassword(currentPwd, auth.adminRec.salt, auth.adminRec.passwordHash)) {
          return sendJson(res, 400, { error: 'A palavra-passe actual introduzida está incorrecta.' });
        }
        if (newPwd.length < 6 || newPwd.length > 128) {
          return sendJson(res, 400, { error: 'A nova palavra-passe deve conter entre 6 e 128 caracteres.' });
        }

        const { salt, passwordHash } = hashPassword(newPwd);
        const updatedAdmin = {
          ...auth.adminRec,
          salt,
          passwordHash,
          updatedAt: new Date().toISOString()
        };
        memoryAdmin = updatedAdmin;
        writeJsonAtomic(ADMIN_FILE, updatedAdmin);

        const refreshedToken = signSessionToken(updatedAdmin, true);
        const cookie = buildSessionCookie(req, refreshedToken, 7 * 24 * 60 * 60);
        return sendJson(res, 200, { ok: true }, { 'Set-Cookie': cookie });
      } catch (err) {
        return sendJson(res, err.statusCode || 400, { error: err.message });
      }
    }

    if (pathname === '/api/quotes' && method === 'POST') {
      try {
        const body = await readJsonBody(req, 32 * 1024);
        const entry = {
          id: `q_${Date.now()}`,
          code: String(body.code || '').slice(0, 32),
          clientName: String(body.clientName || 'Cliente LECASU').slice(0, 100),
          clientPhone: String(body.clientPhone || '').slice(0, 40),
          location: String(body.location || '').slice(0, 100),
          projectType: String(body.projectType || '').slice(0, 60),
          backupHours: Number(body.backupHours) || 0,
          pvKwp: Number(body.pvKwp) || 0,
          invKw: Number(body.invKw) || 0,
          batKwh: Number(body.batKwh) || 0,
          totalWithIvaMzn: Number(body.totalWithIvaMzn) || 0,
          channel: String(body.channel || 'web').slice(0, 24),
          createdAt: new Date().toISOString()
        };
        let quotes = Array.isArray(memoryQuotes) ? [...memoryQuotes] : [];
        if (fs.existsSync(QUOTES_FILE)) {
          try {
            const parsed = JSON.parse(fs.readFileSync(QUOTES_FILE, 'utf8'));
            if (Array.isArray(parsed)) quotes = parsed;
          } catch {}
        }
        quotes.push(entry);
        if (quotes.length > 500) quotes = quotes.slice(-500);
        memoryQuotes = quotes;
        writeJsonAtomic(QUOTES_FILE, quotes);
        return sendJson(res, 201, { ok: true, id: entry.id });
      } catch (err) {
        return sendJson(res, err.statusCode || 400, { error: err.message });
      }
    }

    if (pathname === '/api/quotes' && method === 'GET') {
      const auth = getAuthenticatedAdmin(req);
      if (!auth) return sendJson(res, 401, { error: 'Sessão expirada ou não autenticada.' });
      let quotes = Array.isArray(memoryQuotes) ? memoryQuotes : [];
      if (fs.existsSync(QUOTES_FILE)) {
        try {
          const parsed = JSON.parse(fs.readFileSync(QUOTES_FILE, 'utf8'));
          if (Array.isArray(parsed)) quotes = parsed;
        } catch {}
      }
      return sendJson(res, 200, { quotes });
    }

    return sendJson(res, 404, { error: 'Endpoint não encontrado.' });
  }

  function isAllowedPublicPath(reqPath) {
    if (PUBLIC_FILES.has(reqPath)) return true;
    if (/^\/img\/products\/[a-zA-Z0-9._-]+$/.test(reqPath)) return true;
    return false;
  }

  function serveStatic(req, res, pathname) {
    const method = (req.method || 'GET').toUpperCase();
    if (method !== 'GET' && method !== 'HEAD') {
      res.writeHead(405, { ...SECURITY_HEADERS, 'Allow': 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('405 Método Não Permitido');
      return;
    }

    let reqPath = pathname;
    if (reqPath === '/' || reqPath === '') {
      reqPath = '/index.html';
    } else if (reqPath === '/admin' || reqPath === '/admin/') {
      reqPath = '/admin.html';
    }

    if (!isAllowedPublicPath(reqPath)) {
      return sendNotFoundHtml(res, method);
    }

    const filePath = path.resolve(ROOT, '.' + reqPath);
    const rel = path.relative(ROOT, filePath);
    if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) {
      res.writeHead(403, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('403 Proibido');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        return sendNotFoundHtml(res, method);
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const isHtml = ext === '.html';
      const isSw = reqPath === '/sw.js';

      const headers = {
        ...SECURITY_HEADERS,
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Cache-Control': isHtml || isSw
          ? 'no-cache, must-revalidate, max-age=0'
          : 'public, max-age=86400, stale-while-revalidate=604800'
      };

      res.writeHead(200, headers);
      if (method === 'HEAD') {
        res.end();
        return;
      }

      const stream = fs.createReadStream(filePath);
      stream.on('error', () => {
        if (!res.headersSent) {
          res.writeHead(500, { ...SECURITY_HEADERS, 'Content-Type': 'text/plain; charset=utf-8' });
        }
        res.end();
      });
      stream.pipe(res);
    });
  }

  return function requestHandler(req, res) {
    let rawPathname;
    try {
      const headerPath = req.headers['x-matched-path'] || req.headers['x-forwarded-uri'] || req.headers['x-real-url'];
      let target = (typeof headerPath === 'string' && headerPath.startsWith('/')) ? headerPath : (req.url || '/');
      const parsedUrl = new URL(target, 'http://localhost');
      rawPathname = decodeURIComponent(parsedUrl.pathname);

      if ((rawPathname === '/api/index.js' || rawPathname === '/api' || rawPathname === '/api/') && req.url && req.url !== rawPathname) {
        try {
          const fallbackParsed = new URL(req.url, 'http://localhost');
          if (fallbackParsed.pathname.startsWith('/api/') || fallbackParsed.pathname === '/health') {
            rawPathname = decodeURIComponent(fallbackParsed.pathname);
          }
        } catch {}
      }
    } catch {
      res.writeHead(400, { ...SECURITY_HEADERS, 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'URL malformada.' }));
      return;
    }

    if (rawPathname === '/health' || rawPathname.startsWith('/api/')) {
      handleApi(req, res, rawPathname).catch((err) => {
        console.error('Erro na execução da API:', err);
        if (!res.headersSent) {
          sendJson(res, err.statusCode || 500, { error: 'Erro interno no servidor.', detail: err.message });
        }
      });
      return;
    }

    serveStatic(req, res, rawPathname);
  };
}

function startServer(portToTry) {
  const handler = createAppHandler();
  const server = http.createServer(handler);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Porta ${portToTry} ocupada. Tentando porta ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error('Erro no servidor:', err);
    }
  });

  server.listen(portToTry, () => {
    console.log('\n======================================================');
    console.log('   ☀️  LECASU — SIMULADOR SOLAR & PORTAL ADMIN');
    console.log('======================================================');
    console.log('   Servidor local ativo com API & persistência segura!');
    console.log(`   • Simulador Cliente: http://localhost:${portToTry}/`);
    console.log(`   • Portal Admin:      http://localhost:${portToTry}/admin`);
    console.log(`   • Health Check:      http://localhost:${portToTry}/health`);
    console.log('------------------------------------------------------');
    console.log('   Pressione Ctrl + C para encerrar o servidor.');
    console.log('======================================================\n');
  });

  return server;
}

let lazyDefaultHandler = null;
function defaultHandler(req, res) {
  if (!lazyDefaultHandler) {
    lazyDefaultHandler = createAppHandler();
  }
  return lazyDefaultHandler(req, res);
}

if (require.main === module) {
  startServer(DEFAULT_PORT);
}

defaultHandler.createAppHandler = createAppHandler;
defaultHandler.startServer = startServer;
defaultHandler.hashPassword = hashPassword;
defaultHandler.verifyPassword = verifyPassword;

module.exports = defaultHandler;
