/**
 * LECASU — Adaptador de Persistência MySQL (mysql2/promise)
 * Armazena produtos, imagens (Base64/URL), utilizadores admin e orçamentos no MySQL.
 * Quando as variáveis de ambiente MySQL não estão configuradas, o servidor usa
 * automaticamente o armazenamento em ficheiros JSON (data/*.json) como fallback.
 */

const fs = require('fs');
const path = require('path');

let mysql = null;
try {
  mysql = require('mysql2/promise');
} catch {
  mysql = null;
}

// Carregamento leve de .env local (caso exista) sem depender de pacotes externos
function loadLocalEnv() {
  try {
    const envPath = path.resolve(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) return;
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (key && process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  } catch {}
}

loadLocalEnv();

function getConnectionConfig() {
  const url = process.env.MYSQL_URL || process.env.DATABASE_URL || '';
  const useSsl = String(process.env.DB_SSL || '').toLowerCase() === 'true';

  if (url && /^mysqls?:\/\//i.test(url)) {
    return {
      uri: url,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {})
    };
  }

  const host = (process.env.DB_HOST || '').trim();
  const user = (process.env.DB_USER || '').trim();
  const database = (process.env.DB_NAME || '').trim();
  if (!host || !user || !database) {
    return null;
  }

  return {
    host,
    port: Number(process.env.DB_PORT) || 3306,
    user,
    password: process.env.DB_PASSWORD || '',
    database,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {})
  };
}

let pool = null;
let schemaReady = false;
let lastDbError = null;

function isConfigured() {
  return Boolean(mysql && getConnectionConfig());
}

async function getPool() {
  if (!mysql) return null;
  if (pool) return pool;
  const cfg = getConnectionConfig();
  if (!cfg) return null;

  pool = cfg.uri ? mysql.createPool(cfg.uri) : mysql.createPool(cfg);
  return pool;
}

async function ensureSchema() {
  if (schemaReady) return true;
  const p = await getPool();
  if (!p) return false;

  try {
    await p.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(120) NOT NULL,
        sku VARCHAR(120) DEFAULT NULL,
        category ENUM('panels', 'inverters', 'batteries') NOT NULL,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(120) DEFAULT '',
        voltage_type VARCHAR(16) DEFAULT NULL,
        phase VARCHAR(24) DEFAULT NULL,
        subcategory VARCHAR(64) DEFAULT NULL,
        power_or_capacity DECIMAL(12, 3) NOT NULL DEFAULT 0,
        price DECIMAL(14, 2) NOT NULL DEFAULT 0,
        image LONGTEXT,
        extra TEXT,
        metadata_json JSON DEFAULT NULL,
        sort_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_products_category_sort (category, sort_order),
        INDEX idx_products_sku (sku),
        INDEX idx_products_brand (brand)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        username VARCHAR(120) NOT NULL,
        alias VARCHAR(64) DEFAULT 'admin',
        name VARCHAR(160) NOT NULL DEFAULT 'Administrador LECASU',
        salt VARCHAR(128) NOT NULL,
        password_hash VARCHAR(256) NOT NULL,
        updated_at VARCHAR(64) NOT NULL,
        PRIMARY KEY (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS quotes (
        id VARCHAR(80) NOT NULL,
        client_name VARCHAR(180) DEFAULT NULL,
        client_phone VARCHAR(80) DEFAULT NULL,
        client_email VARCHAR(160) DEFAULT NULL,
        total_price DECIMAL(14, 2) DEFAULT NULL,
        payload_json LONGTEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        INDEX idx_quotes_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS system_meta (
        meta_key VARCHAR(100) NOT NULL,
        meta_value TEXT,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (meta_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    schemaReady = true;
    lastDbError = null;
    return true;
  } catch (err) {
    lastDbError = err.message;
    console.warn('Aviso MySQL (ensureSchema):', err.message);
    return false;
  }
}

function rowToProduct(row) {
  let meta = {};
  if (row.metadata_json) {
    try {
      meta = typeof row.metadata_json === 'string' ? JSON.parse(row.metadata_json) : row.metadata_json;
    } catch {}
  }

  const base = {
    id: row.id,
    sku: row.sku || undefined,
    name: row.name,
    brand: row.brand || '',
    price: Number(row.price) || 0,
    image: row.image || '',
    extra: row.extra || ''
  };

  if (row.category === 'panels') {
    base.power = Number(row.power_or_capacity) || 0;
  } else if (row.category === 'inverters') {
    base.power = Number(row.power_or_capacity) || 0;
    base.voltageType = row.voltage_type || 'LV';
    base.phase = row.phase || '1ph';
  } else if (row.category === 'batteries') {
    base.capacity = Number(row.power_or_capacity) || 0;
    base.voltageType = row.voltage_type || 'LV';
    if (row.subcategory) base.subcategory = row.subcategory;
  }

  // Preserva campos técnicos opcionais (series, efficiency, dimensions, weight, warranty, etc.)
  return Object.assign({}, meta, base);
}

async function loadCatalog() {
  const ready = await ensureSchema();
  if (!ready) return null;

  try {
    const p = await getPool();
    const [rows] = await p.query(
      'SELECT * FROM products ORDER BY category ASC, sort_order ASC, name ASC'
    );
    if (!Array.isArray(rows) || rows.length === 0) {
      return null;
    }

    const catalog = { panels: [], inverters: [], batteries: [] };
    for (const row of rows) {
      if (catalog[row.category]) {
        catalog[row.category].push(rowToProduct(row));
      }
    }

    if (catalog.panels.length === 0 && catalog.inverters.length === 0 && catalog.batteries.length === 0) {
      return null;
    }

    const [metaRows] = await p.query(
      "SELECT meta_value FROM system_meta WHERE meta_key = 'catalog_updated_at' LIMIT 1"
    );
    catalog.updatedAt = (metaRows && metaRows[0] && metaRows[0].meta_value) || new Date().toISOString();
    return catalog;
  } catch (err) {
    lastDbError = err.message;
    console.warn('Aviso MySQL (loadCatalog):', err.message);
    return null;
  }
}

async function saveCatalog(catalog) {
  const ready = await ensureSchema();
  if (!ready) return false;

  const p = await getPool();
  const conn = await p.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM products');

    const insertSql = `
      INSERT INTO products (
        id, sku, category, name, brand, voltage_type, phase, subcategory,
        power_or_capacity, price, image, extra, metadata_json, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const categories = ['panels', 'inverters', 'batteries'];
    for (const cat of categories) {
      const list = Array.isArray(catalog[cat]) ? catalog[cat] : [];
      for (let idx = 0; idx < list.length; idx++) {
        const item = list[idx];
        const powerOrCap = cat === 'batteries' ? (Number(item.capacity) || 0) : (Number(item.power) || 0);

        const meta = {};
        const knownKeys = new Set([
          'id', 'sku', 'name', 'brand', 'voltageType', 'phase',
          'subcategory', 'power', 'capacity', 'price', 'image', 'extra'
        ]);
        for (const k of Object.keys(item)) {
          if (!knownKeys.has(k) && item[k] !== undefined) {
            meta[k] = item[k];
          }
        }

        await conn.query(insertSql, [
          String(item.id),
          item.sku ? String(item.sku) : null,
          cat,
          String(item.name || ''),
          String(item.brand || ''),
          item.voltageType || null,
          item.phase || null,
          item.subcategory || null,
          powerOrCap,
          Number(item.price) || 0,
          item.image || '',
          item.extra || '',
          Object.keys(meta).length > 0 ? JSON.stringify(meta) : null,
          idx
        ]);
      }
    }

    const updatedAt = catalog.updatedAt || new Date().toISOString();
    await conn.query(
      `INSERT INTO system_meta (meta_key, meta_value) VALUES ('catalog_updated_at', ?)
       ON DUPLICATE KEY UPDATE meta_value = VALUES(meta_value)`,
      [updatedAt]
    );

    await conn.commit();
    lastDbError = null;
    return true;
  } catch (err) {
    await conn.rollback();
    lastDbError = err.message;
    console.warn('Aviso MySQL (saveCatalog):', err.message);
    return false;
  } finally {
    conn.release();
  }
}

async function loadAdmin() {
  const ready = await ensureSchema();
  if (!ready) return null;

  try {
    const p = await getPool();
    const [rows] = await p.query('SELECT * FROM admin_users LIMIT 1');
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      username: r.username,
      alias: r.alias || 'admin',
      name: r.name || 'Administrador LECASU',
      salt: r.salt,
      passwordHash: r.password_hash,
      updatedAt: r.updated_at
    };
  } catch (err) {
    lastDbError = err.message;
    return null;
  }
}

async function saveAdmin(adminRec) {
  const ready = await ensureSchema();
  if (!ready) return false;

  try {
    const p = await getPool();
    await p.query(
      `INSERT INTO admin_users (username, alias, name, salt, password_hash, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         alias = VALUES(alias),
         name = VALUES(name),
         salt = VALUES(salt),
         password_hash = VALUES(password_hash),
         updated_at = VALUES(updated_at)`,
      [
        adminRec.username,
        adminRec.alias || 'admin',
        adminRec.name || 'Administrador LECASU',
        adminRec.salt,
        adminRec.passwordHash,
        adminRec.updatedAt
      ]
    );
    return true;
  } catch (err) {
    lastDbError = err.message;
    return false;
  }
}

async function loadQuotes() {
  const ready = await ensureSchema();
  if (!ready) return null;

  try {
    const p = await getPool();
    const [rows] = await p.query(
      'SELECT payload_json FROM quotes ORDER BY created_at DESC LIMIT 500'
    );
    return rows.map((r) => {
      try {
        return JSON.parse(r.payload_json);
      } catch {
        return null;
      }
    }).filter(Boolean);
  } catch (err) {
    lastDbError = err.message;
    return null;
  }
}

async function insertQuote(entry) {
  const ready = await ensureSchema();
  if (!ready) return false;

  try {
    const p = await getPool();
    const clientName = entry.clientName || (entry.client && entry.client.name) || null;
    const clientPhone = entry.clientPhone || (entry.client && entry.client.phone) || null;
    const clientEmail = entry.clientEmail || (entry.client && entry.client.email) || null;
    const totalPrice = Number(entry.totalPrice || entry.total || 0) || null;

    await p.query(
      `INSERT INTO quotes (id, client_name, client_phone, client_email, total_price, payload_json)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        String(entry.id),
        clientName ? String(clientName).slice(0, 180) : null,
        clientPhone ? String(clientPhone).slice(0, 80) : null,
        clientEmail ? String(clientEmail).slice(0, 160) : null,
        totalPrice,
        JSON.stringify(entry)
      ]
    );
    return true;
  } catch (err) {
    lastDbError = err.message;
    return false;
  }
}

function getStatus() {
  return {
    configured: isConfigured(),
    driverLoaded: Boolean(mysql),
    schemaReady,
    lastError: lastDbError
  };
}

module.exports = {
  isConfigured,
  ensureSchema,
  loadCatalog,
  saveCatalog,
  loadAdmin,
  saveAdmin,
  loadQuotes,
  insertQuote,
  getStatus
};

