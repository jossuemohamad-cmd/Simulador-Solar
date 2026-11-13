/**
 * LECASU — Portal de Administração do Catálogo Fotovoltaico
 * Autenticação segura via API Backend (cookie HttpOnly) com fallback local,
 * sincronização em tempo real com o servidor e gestão CRUD de equipamentos.
 */

const CatalogLib = window.LecasuCatalog;
const STORAGE_KEY_PRODUCTS = CatalogLib.STORAGE_KEY_PRODUCTS;
const STORAGE_KEY_AUTH = 'lecasu_admin_auth_session';
const STORAGE_KEY_CREDENTIALS = 'lecasu_admin_credentials_v2';
const LEGACY_STORAGE_KEY_CREDENTIALS = 'lecasu_admin_credentials';

// Hash SHA-256 apenas para fallback offline/estático (nunca expõe texto limpo)
const DEFAULT_FALLBACK_HASH = 'ff58ef9f4a4a3e25620f5a36b3a406c86e01f308e8386acba229c6b48798ea16';
const LEGACY_FALLBACK_HASH = '56c3131214fb7fe070884f793628b64eaa545e0b0a3581a51f2afdd07cfb82f5';

const getProductImage = CatalogLib.getProductImage;
const ensureProductImages = CatalogLib.ensureProductImages;
const sanitizeImageUrl = CatalogLib.sanitizeImageUrl;
const escapeHtml = CatalogLib.escapeHtml;
const inferNominalVoltage = CatalogLib.inferNominalVoltage;
const inferCategoryGroup = CatalogLib.inferCategoryGroup;

// Estado da Aplicação
let adminProducts = loadLocalProductsFallback();
let activeCategory = 'inverters';
let activeSubFilter = 'all';
let activeBrandFilter = 'all';
let activeVoltageFilter = 'all';
let activeGroupFilter = 'all';
let filterQuery = '';
let isBackendAvailable = null; // null = ainda não detetado; true/false após /api/auth/me
let currentUploadedImageDataUrl = ''; // Armazena em memória o data:image/ da foto carregada no modal

const $ = (id) => document.getElementById(id);
const money = (n) => new Intl.NumberFormat('pt-MZ', { maximumFractionDigits: 0 }).format(n) + ' MT';

/**
 * Exibe notificação moderna e elegante (Toast) no canto superior direito
 * Substituto profissional para o window.alert() nativo do navegador
 */
function showToast(message, type = 'info', durationMs = 4000) {
  const container = $('toast-container');
  if (!container) {
    console.log(`[${type.toUpperCase()}] ${message}`);
    return;
  }

  const toast = document.createElement('div');
  toast.className = `toast-card toast-${type}`;
  toast.setAttribute('role', 'alert');

  let iconSvg = '';
  let defaultTitle = '';
  if (type === 'success') {
    defaultTitle = 'Sucesso';
    iconSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
  } else if (type === 'error') {
    defaultTitle = 'Atenção / Erro';
    iconSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  } else if (type === 'warning') {
    defaultTitle = 'Aviso';
    iconSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
  } else {
    defaultTitle = 'Informação';
    iconSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
  }

  const cleanMsg = String(message || '').replace(/^[✓✔]\s*/, '');

  toast.innerHTML = `
    <div class="toast-icon-wrap">${iconSvg}</div>
    <div class="toast-content">
      <div class="toast-title">${defaultTitle}</div>
      <div class="toast-message">${escapeHtml(cleanMsg)}</div>
    </div>
    <button type="button" class="toast-close-btn" aria-label="Fechar">&times;</button>
  `;

  const closeToast = () => {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 250);
  };

  const closeBtn = toast.querySelector('.toast-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeToast);

  container.appendChild(toast);

  if (durationMs > 0) {
    setTimeout(closeToast, durationMs);
  }
}
window.showToast = showToast;

/**
 * Exibe diálogo de confirmação moderno e executivo
 * Substituto profissional para o window.confirm() nativo do navegador
 * @returns {Promise<boolean>}
 */
function showConfirmDialog(options = {}) {
  return new Promise((resolve) => {
    const modal = $('confirm-modal');
    if (!modal) {
      const ok = window.confirm(options.message || 'Confirmar ação?');
      resolve(ok);
      return;
    }

    const titleEl = $('confirm-modal-title');
    const msgEl = $('confirm-modal-message');
    const iconEl = $('confirm-modal-icon');
    const btnCancel = $('confirm-modal-cancel');
    const btnOk = $('confirm-modal-ok');

    const title = options.title || 'Confirmar Ação';
    const message = options.message || 'Pretende continuar com esta ação?';
    const confirmText = options.confirmText || 'Confirmar';
    const cancelText = options.cancelText || 'Cancelar';
    const isDanger = Boolean(options.isDanger);

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    if (btnOk) {
      btnOk.textContent = confirmText;
      btnOk.className = isDanger ? 'btn-danger-confirm' : 'btn-primary';
    }
    if (btnCancel) btnCancel.textContent = cancelText;

    if (iconEl) {
      iconEl.className = 'confirm-modal-icon-badge' + (isDanger ? ' danger' : '');
      iconEl.innerHTML = isDanger
        ? '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'
        : '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
    }

    modal.hidden = false;

    const cleanup = (result) => {
      modal.hidden = true;
      if (btnOk) btnOk.removeEventListener('click', onOk);
      if (btnCancel) btnCancel.removeEventListener('click', onCancel);
      modal.removeEventListener('click', onBackdrop);
      resolve(result);
    };

    const onOk = () => cleanup(true);
    const onCancel = () => cleanup(false);
    const onBackdrop = (e) => {
      if (e.target === modal) cleanup(false);
    };

    if (btnOk) btnOk.addEventListener('click', onOk, { once: true });
    if (btnCancel) btnCancel.addEventListener('click', onCancel, { once: true });
    modal.addEventListener('click', onBackdrop);
  });
}
window.showConfirmDialog = showConfirmDialog;

/**
 * Calcula SHA-256 em hex (Web Crypto com fallback puro JS para contextos HTTP não-HTTPS)
 */
async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(String(text || ''));
  if (window.crypto && window.crypto.subtle) {
    const buf = await window.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return pureJsSha256(bytes);
}

function pureJsSha256(bytes) {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const l = bytes.length;
  const bitLenHi = Math.floor((l * 8) / 0x100000000);
  const bitLenLo = (l * 8) >>> 0;
  const totalLen = Math.ceil((l + 9) / 64) * 64;
  const padded = new Uint8Array(totalLen);
  padded.set(bytes);
  padded[l] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(totalLen - 8, bitLenHi, false);
  view.setUint32(totalLen - 4, bitLenLo, false);

  const w = new Uint32Array(64);
  const rotr = (n, x) => (x >>> n) | (x << (32 - n));

  for (let off = 0; off < totalLen; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(off + i * 4, false);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(7, w[i - 15]) ^ rotr(18, w[i - 15]) ^ (w[i - 15] >>> 3);
      const s1 = rotr(17, w[i - 2]) ^ rotr(19, w[i - 2]) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ ((~e) & g);
      const temp1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + temp1) >>> 0;
      d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
    }
    H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
  }
  return H.map((v) => v.toString(16).padStart(8, '0')).join('');
}

/* ========================================================
   CAMADA DE COMUNICAÇÃO COM O BACKEND + FALLBACK LOCAL
   ======================================================== */

function getFallbackCredentials() {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY_CREDENTIALS);
    const raw = localStorage.getItem(STORAGE_KEY_CREDENTIALS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.passwordHash) return parsed;
    }
  } catch {}
  const def = {
    username: 'admin@lecasu.co.mz',
    alias: 'admin',
    passwordHash: DEFAULT_FALLBACK_HASH,
    name: 'Administrador LECASU'
  };
  try {
    localStorage.setItem(STORAGE_KEY_CREDENTIALS, JSON.stringify(def));
  } catch {}
  return def;
}

function loadLocalProductsFallback() {
  let result = null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        Array.isArray(parsed.panels) && parsed.panels.length > 0 &&
        Array.isArray(parsed.inverters) && parsed.inverters.length > 0 &&
        Array.isArray(parsed.batteries) && parsed.batteries.length > 0
      ) {
        CatalogLib.stripLegacyObsoleteProducts(parsed);
        result = parsed;
      }
    }
  } catch (e) {
    console.warn('Erro ao carregar produtos locais:', e);
  }

  if (!result) {
    result = CatalogLib.cloneDefaults();
  }

  // Migra e preserva fotos carregadas via upload antes de limpar chaves antigas
  if (typeof CatalogLib.migrateAndApplyCustomImages === 'function') {
    CatalogLib.migrateAndApplyCustomImages(result, localStorage);
  }

  try {
    localStorage.removeItem('lecasu_admin_products_v1');
    localStorage.removeItem('lecasu_admin_products_v2');
    localStorage.removeItem('lecasu_admin_products_v3');
    localStorage.removeItem('lecasu_admin_products_v4');
  } catch {}

  saveLocalProductsData(result);
  return result;
}

function saveLocalProductsData(data) {
  try {
    if (typeof CatalogLib.migrateAndApplyCustomImages === 'function') {
      CatalogLib.migrateAndApplyCustomImages(data, localStorage);
    }
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(data));
  } catch (err) {
    if (err && (err.name === 'QuotaExceededError' || err.code === 22)) {
      showToast('Limite de cache local do navegador atingido. Configure o MySQL para guardar imagens ilimitadas.', 'warning');
    }
  }
}

function updateSyncIndicator(mode, labelText) {
  const dot = $('sidebar-sync-dot');
  const txt = $('sidebar-sync-text');
  if (txt) txt.textContent = labelText;
  if (dot) {
    dot.style.background = mode === 'server' ? '#10b981' : (mode === 'error' ? '#ef4444' : '#f59e0b');
  }
}

async function fetchCatalogFromServer() {
  try {
    const res = await fetch('/api/products', { cache: 'no-store' });
    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('application/json')) {
      const data = await res.json();
      if (Array.isArray(data.panels) && Array.isArray(data.inverters) && Array.isArray(data.batteries)) {
        ensureProductImages(data);

        // IMPORTANTE: preservar fotos Base64 que estão guardadas localmente (localStorage)
        // O servidor pode não ter a foto (imagens grandes não persistem no JSON do servidor)
        // Nunca deixar que a resposta do servidor apague uma foto real carregada pelo admin
        const local = adminProducts;
        ['panels', 'inverters', 'batteries'].forEach((cat) => {
          if (!Array.isArray(data[cat]) || !Array.isArray(local[cat])) return;
          data[cat].forEach((srvItem) => {
            if (srvItem.image && srvItem.image.startsWith('data:image/')) return;
            const localItem = local[cat].find((x) => x.id === srvItem.id);
            if (localItem && localItem.image && localItem.image.startsWith('data:image/')) {
              srvItem.image = localItem.image;
            }
          });
        });

        if (typeof CatalogLib.migrateAndApplyCustomImages === 'function') {
          CatalogLib.migrateAndApplyCustomImages(data, localStorage);
        }

        adminProducts = data;
        saveLocalProductsData(data);
        updateSyncIndicator('server', 'Servidor Sincronizado');
        return true;
      }
    }
  } catch (err) {
    console.warn('Falha ao buscar catálogo do servidor:', err);
  }
  return false;
}

async function saveProducts() {
  ensureProductImages(adminProducts);
  saveLocalProductsData(adminProducts);

  if (isBackendAvailable) {
    updateSyncIndicator('server', 'A guardar no servidor...');
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminProducts)
      });
      if (res.status === 401) {
        showToast('A sua sessão administrativa expirou. Inicie sessão novamente.', 'error');
        await checkAuth();
        return false;
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        updateSyncIndicator('error', 'Erro ao sincronizar');
        showToast(errData.error || 'Erro ao guardar alterações no servidor.', 'error');
        return false;
      }
      const data = await res.json();
      if (data && data.catalog) {
        // Preserva fotos locais em Base64 para prevenir que qualquer resposta
        // com cache antigo do servidor desfaça a foto do produto
        ['panels', 'inverters', 'batteries'].forEach((cat) => {
          if (Array.isArray(data.catalog[cat]) && Array.isArray(adminProducts[cat])) {
            data.catalog[cat].forEach((srvItem) => {
              const localItem = adminProducts[cat].find((x) => x.id === srvItem.id);
              if (localItem && localItem.image && localItem.image.startsWith('data:image/')) {
                if (!srvItem.image || !srvItem.image.startsWith('data:image/')) {
                  srvItem.image = localItem.image;
                }
              }
            });
          }
        });
        adminProducts = data.catalog;
        saveLocalProductsData(adminProducts);
      }
      updateSyncIndicator('server', 'Servidor Sincronizado');
      return true;
    } catch (err) {
      updateSyncIndicator('error', 'Sem ligação ao servidor');
      showToast('Não foi possível sincronizar com o servidor: ' + err.message, 'warning');
      return false;
    }
  }

  updateSyncIndicator('local', 'Modo Local (Este Navegador)');
  return true;
}

/* ========================================================
   AUTENTICAÇÃO & SESSÃO
   ======================================================== */

function showDashboard(user) {
  const loginScreen = $('login-screen');
  const dashboard = $('admin-dashboard');
  if (loginScreen) {
    loginScreen.hidden = true;
    loginScreen.style.setProperty('display', 'none', 'important');
  }
  if (dashboard) {
    dashboard.hidden = false;
    dashboard.style.setProperty('display', 'flex', 'important');
  }

  if ($('auth-user-name')) $('auth-user-name').textContent = (user && user.name) || 'Administrador LECASU';
  if ($('auth-user-email')) $('auth-user-email').textContent = (user && user.username) || 'admin@lecasu.co.mz';

  try {
    updateKpis();
    switchCategory(activeCategory || 'inverters');
  } catch (renderErr) {
    console.error('Erro na renderização inicial do catálogo:', renderErr);
  }
}

function showLoginScreen() {
  const loginScreen = $('login-screen');
  const dashboard = $('admin-dashboard');
  if (loginScreen) {
    loginScreen.hidden = false;
    loginScreen.style.setProperty('display', 'flex', 'important');
  }
  if (dashboard) {
    dashboard.hidden = true;
    dashboard.style.setProperty('display', 'none', 'important');
  }
}

async function checkAuth() {
  const modeNote = $('login-mode-note');

  // 1. Verifica sessão real no servidor Node.js (/api/auth/me)
  try {
    const res = await fetch('/api/auth/me', { cache: 'no-store' });
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      isBackendAvailable = true;
      if (modeNote) modeNote.hidden = true;

      if (res.ok) {
        const data = await res.json();
        if (data && data.authenticated && data.user) {
          await fetchCatalogFromServer();
          showDashboard(data.user);
          return;
        }
      }
      showLoginScreen();
      return;
    }
  } catch {}

  // 2. Fallback para modo estático (sem Node.js)
  isBackendAvailable = false;
  updateSyncIndicator('local', 'Modo Local (Este Navegador)');
  if (modeNote) {
    modeNote.hidden = false;
    modeNote.textContent = 'Modo estático local detetado (sem API Node): alterações ficam guardadas apenas neste navegador.';
  }

  const session = sessionStorage.getItem(STORAGE_KEY_AUTH) || localStorage.getItem(STORAGE_KEY_AUTH);
  if (session) {
    try {
      const user = JSON.parse(session);
      if (user && user.isLoggedIn) {
        showDashboard(user);
        return;
      }
    } catch {}
  }

  showLoginScreen();
}

async function handleLogin(event) {
  if (event) event.preventDefault();

  const userField = $('login-username');
  const pwdField = $('login-password');
  const errorBox = $('login-error-alert');
  const submitBtn = $('btn-login-submit');
  const enteredUser = (userField && userField.value ? userField.value : '').trim();
  const enteredPwd = (pwdField && pwdField.value ? pwdField.value : '');
  const remember = $('remember-me') ? $('remember-me').checked : true;

  const showLoginError = (msg) => {
    if (errorBox) {
      errorBox.hidden = false;
      errorBox.style.display = 'block';
      errorBox.textContent = msg;
    }
    if (pwdField) {
      pwdField.focus();
      pwdField.select();
    }
  };

  if (errorBox) {
    errorBox.hidden = true;
    errorBox.style.display = 'none';
  }

  if (submitBtn) submitBtn.disabled = true;

  try {
    // Tenta login real no Backend se disponível (ou ainda não testado)
    if (isBackendAvailable !== false) {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: enteredUser, password: enteredPwd, remember })
        });
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          isBackendAvailable = true;
          const data = await res.json();
          if (!res.ok || !data.ok) {
            showLoginError(data.error || 'Utilizador ou palavra-passe incorretos.');
            return false;
          }
          await fetchCatalogFromServer();
          showDashboard(data.user);
          return false;
        }
      } catch {}
    }

    // Fallback estático local com SHA-256
    isBackendAvailable = false;
    const creds = getFallbackCredentials();
    const enteredHash = await sha256Hex(enteredPwd);
    const isUserMatch =
      enteredUser.toLowerCase() === creds.username.toLowerCase() ||
      enteredUser.toLowerCase() === (creds.alias || 'admin').toLowerCase();
    const isPwdMatch =
      enteredHash === creds.passwordHash ||
      (creds.passwordHash === LEGACY_FALLBACK_HASH && enteredHash === DEFAULT_FALLBACK_HASH) ||
      (creds.passwordHash === DEFAULT_FALLBACK_HASH && enteredHash === LEGACY_FALLBACK_HASH);

    if (!isUserMatch || !isPwdMatch) {
      showLoginError('Utilizador ou palavra-passe incorretos. Por favor, tente novamente.');
      return false;
    }

    const sessionData = {
      isLoggedIn: true,
      username: creds.username,
      name: creds.name || 'Administrador LECASU',
      loginAt: new Date().toISOString()
    };
    try {
      if (remember) {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(sessionData));
      }
    } catch {}

    showDashboard(sessionData);
    return false;
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}
window.handleLogin = handleLogin;

async function handleLogout() {
  const confirmed = await showConfirmDialog({
    title: 'Terminar Sessão',
    message: 'Deseja realmente terminar a sua sessão no Portal de Administração LECASU?',
    confirmText: 'Terminar Sessão',
    cancelText: 'Continuar no Painel',
    isDanger: true
  });
  if (!confirmed) {
    return;
  }
  if (isBackendAvailable) {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
  }
  sessionStorage.removeItem(STORAGE_KEY_AUTH);
  localStorage.removeItem(STORAGE_KEY_AUTH);
  if ($('login-password')) $('login-password').value = '';
  if ($('login-error-alert')) $('login-error-alert').hidden = true;
  await checkAuth();
  showToast('Sessão terminada com sucesso.', 'info');
}
window.handleLogout = handleLogout;

function togglePasswordVisibility() {
  const pwdInput = $('login-password');
  const eyeIcon = $('eye-icon');
  if (!pwdInput) return;

  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    if (eyeIcon) eyeIcon.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;
  } else {
    pwdInput.type = 'password';
    if (eyeIcon) eyeIcon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
  }
}
window.togglePasswordVisibility = togglePasswordVisibility;

function openRecoverPasswordModal(event) {
  if (event) event.preventDefault();
  const modal = $('recover-pwd-modal');
  if (!modal) return;

  const loginUser = ($('login-username') && $('login-username').value.trim()) || 'admin@lecasu.co.mz';
  if ($('rec-username')) $('rec-username').value = loginUser;
  if ($('rec-master-key')) $('rec-master-key').value = '';
  if ($('rec-new-pwd')) $('rec-new-pwd').value = '';
  if ($('rec-confirm-pwd')) $('rec-confirm-pwd').value = '';
  const alertBox = $('recover-pwd-alert');
  if (alertBox) {
    alertBox.hidden = true;
    alertBox.style.display = 'none';
  }

  modal.hidden = false;
  if ($('rec-master-key')) $('rec-master-key').focus();
}
window.openRecoverPasswordModal = openRecoverPasswordModal;

function closeRecoverPasswordModal() {
  const modal = $('recover-pwd-modal');
  if (modal) modal.hidden = true;
}
window.closeRecoverPasswordModal = closeRecoverPasswordModal;

async function handleRecoverPassword(event) {
  if (event) event.preventDefault();

  const userEl = $('rec-username');
  const keyEl = $('rec-master-key');
  const newEl = $('rec-new-pwd');
  const confirmEl = $('rec-confirm-pwd');
  const alertBox = $('recover-pwd-alert');
  const submitBtn = $('btn-recover-submit');

  const showRecAlert = (msg, isError) => {
    if (!alertBox) return;
    alertBox.hidden = false;
    alertBox.style.display = 'block';
    alertBox.className = isError ? 'alert-box error' : 'alert-box success';
    alertBox.textContent = msg;
  };

  const username = (userEl && userEl.value.trim()) || '';
  const masterKey = (keyEl && keyEl.value.trim()) || '';
  const newPassword = (newEl && newEl.value) || '';
  const confirmPassword = (confirmEl && confirmEl.value) || '';

  if (newPassword.length < 6) {
    showRecAlert('A nova palavra-passe deve ter pelo menos 6 caracteres.', true);
    if (newEl) newEl.focus();
    return;
  }

  if (newPassword !== confirmPassword) {
    showRecAlert('A nova palavra-passe e a confirmação não coincidem.', true);
    if (confirmEl) confirmEl.focus();
    return;
  }

  if (submitBtn) submitBtn.disabled = true;

  try {
    if (isBackendAvailable !== false) {
      try {
        const res = await fetch('/api/auth/recover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, masterKey, newPassword })
        });
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          isBackendAvailable = true;
          const data = await res.json();
          if (!res.ok || !data.ok) {
            showRecAlert(data.error || 'Chave Mestra ou utilizador inválido.', true);
            return;
          }
          closeRecoverPasswordModal();
          if ($('login-username')) $('login-username').value = username;
          if ($('login-password')) {
            $('login-password').value = '';
            $('login-password').focus();
          }
          showToast('Palavra-passe redefinida com sucesso! Inicie sessão com a nova senha.', 'success');
          return;
        }
      } catch {}
    }

    // Fallback estático local
    const creds = getFallbackCredentials();
    const userOk =
      username.toLowerCase() === creds.username.toLowerCase() ||
      username.toLowerCase() === (creds.alias || 'admin').toLowerCase();
    const keyOk = masterKey === 'LECASU-MASTER-2026' || masterKey === 'Lecasu@2026';

    if (!userOk || !keyOk) {
      showRecAlert('Utilizador ou Chave Mestra de recuperação inválida.', true);
      return;
    }

    creds.passwordHash = await sha256Hex(newPassword);
    creds.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY_CREDENTIALS, JSON.stringify(creds));
    } catch {}

    closeRecoverPasswordModal();
    if ($('login-username')) $('login-username').value = username;
    if ($('login-password')) {
      $('login-password').value = '';
      $('login-password').focus();
    }
    showToast('Palavra-passe redefinida localmente com sucesso!', 'success');
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}
window.handleRecoverPassword = handleRecoverPassword;

/* ========================================================
   GESTÃO DO DASHBOARD & KPIS
   ======================================================== */

function updateKpis() {
  const panelsCount = (adminProducts.panels || []).length;
  const invertersCount = (adminProducts.inverters || []).length;
  const batteriesCount = (adminProducts.batteries || []).length;

  if ($('kpi-panels-count')) $('kpi-panels-count').textContent = panelsCount;
  if ($('kpi-inverters-count')) $('kpi-inverters-count').textContent = invertersCount;
  if ($('kpi-batteries-count')) $('kpi-batteries-count').textContent = batteriesCount;

  const panelsBifacial = (adminProducts.panels || []).filter((p) => p.panelType === 'bifacial_dual_glass' || (p.extra || '').toLowerCase().includes('bifacial')).length;
  const panelsMono = Math.max(0, panelsCount - panelsBifacial);
  if ($('kpi-panels-sub')) $('kpi-panels-sub').textContent = `${panelsBifacial} Bifaciais · ${panelsMono} Mono`;

  const invertersLv = (adminProducts.inverters || []).filter((i) => i.voltageType === 'LV').length;
  const invertersHv = (adminProducts.inverters || []).filter((i) => i.voltageType === 'HV').length;
  if ($('kpi-inverters-sub')) $('kpi-inverters-sub').textContent = `${invertersLv} LV · ${invertersHv} HV`;

  const batLv = (adminProducts.batteries || []).filter((b) => b.voltageType === 'LV').length;
  const batHv = (adminProducts.batteries || []).filter((b) => b.voltageType === 'HV').length;
  if ($('kpi-batteries-sub')) $('kpi-batteries-sub').textContent = `${batLv} LV · ${batHv} HV`;
}

function switchCategory(category) {
  activeCategory = category;
  activeSubFilter = 'all';
  activeBrandFilter = 'all';
  activeVoltageFilter = 'all';
  activeGroupFilter = 'all';

  const categories = ['panels', 'inverters', 'batteries', 'settings'];
  categories.forEach((cat) => {
    const kpi = $('kpi-card-' + cat);
    if (kpi) kpi.classList.toggle('active', cat === category);
    const navItem = $('sidebar-nav-' + cat);
    if (navItem) navItem.classList.toggle('active', cat === category);
  });

  const catSelect = $('admin-category-select');
  if (catSelect && catSelect.value !== category) {
    catSelect.value = category;
  }

  const titles = {
    panels: 'Painéis Solares (Módulos)',
    inverters: 'Inversores Híbridos & Controladores',
    batteries: 'Baterias & Armazenamento (BESS)',
    settings: 'Configurações de Acesso & Manutenção do Catálogo'
  };

  const titleEl = $('current-category-title');
  if (titleEl) {
    titleEl.textContent = titles[category] || 'Catálogo de Equipamentos';
  }

  const pageTitleEl = $('page-header-title');
  const pageDescEl = $('page-header-desc');
  if (pageTitleEl && pageDescEl) {
    if (category === 'settings') {
      pageTitleEl.textContent = 'Configurações de Acesso & Backup';
      pageDescEl.textContent = 'Altere a palavra-passe administrativa ou exporte/restaure o catálogo oficial da LECASU.';
    } else {
      pageTitleEl.textContent = 'Catálogo de Equipamentos Fotovoltaicos';
      pageDescEl.textContent = 'Os equipamentos cadastrados aqui ficam disponíveis automaticamente no portal de dimensionamento dos clientes.';
    }
  }

  const newBtnSpan = document.querySelector('.header-action-btns .btn-primary span');
  const newBtn = document.querySelector('.header-action-btns .btn-primary');
  if (newBtn && newBtnSpan) {
    if (category === 'panels') {
      newBtnSpan.textContent = 'Novo Painel';
      newBtn.style.display = 'inline-flex';
    } else if (category === 'inverters') {
      newBtnSpan.textContent = 'Novo Inversor';
      newBtn.style.display = 'inline-flex';
    } else if (category === 'batteries') {
      newBtnSpan.textContent = 'Nova Bateria';
      newBtn.style.display = 'inline-flex';
    } else {
      newBtn.style.display = 'none';
    }
  }

  const productsView = $('view-products');
  const settingsView = $('view-settings');
  const searchContainer = $('table-search-container');
  const subfiltersBar = $('admin-subfilters-bar');
  const brandFilterWrapper = $('brand-filter-wrapper');
  const voltageFilterWrapper = $('voltage-filter-wrapper');

  if (category === 'settings') {
    if (productsView) productsView.hidden = true;
    if (settingsView) settingsView.hidden = false;
    if (searchContainer) searchContainer.hidden = true;
    if (subfiltersBar) subfiltersBar.hidden = true;
    if (brandFilterWrapper) brandFilterWrapper.hidden = true;
    if (voltageFilterWrapper) voltageFilterWrapper.hidden = true;
    if ($('current-category-count')) {
      $('current-category-count').textContent = 'Definições do Sistema';
    }
  } else {
    if (productsView) productsView.hidden = false;
    if (settingsView) settingsView.hidden = true;
    if (searchContainer) searchContainer.hidden = false;
    if (subfiltersBar) subfiltersBar.hidden = false;
    if (brandFilterWrapper) brandFilterWrapper.hidden = false;
    if (voltageFilterWrapper) voltageFilterWrapper.hidden = false;
    renderSubFilters();
    renderTable();
  }
}
window.switchCategory = switchCategory;

function getItemGroupLabel(category, item) {
  return item.categoryGroup || inferCategoryGroup(category, item);
}

function getItemVoltageLabel(category, item) {
  return item.nominalVoltage || inferNominalVoltage(category, item);
}

function getCategoryChipSvg(category) {
  if (category === 'panels') {
    return '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1.5"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="9" y1="4" x2="9" y2="16"/><line x1="15" y1="4" x2="15" y2="16"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="12" y1="16" x2="12" y2="20"/></svg>';
  }
  if (category === 'inverters') {
    return '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><polyline points="8 13 11 9 13 15 16 11"/></svg>';
  }
  return '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="17" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="7" y1="10" x2="7" y2="14"/><line x1="11" y1="10" x2="11" y2="14"/></svg>';
}

function renderSubFilters() {
  if (activeCategory === 'settings') return;

  const bar = $('admin-subfilters-bar');
  const brandSelect = $('admin-brand-select');
  const voltageSelect = $('admin-voltage-select');
  if (bar) bar.replaceChildren();

  const items = adminProducts[activeCategory] || [];

  // 1. Marcas disponíveis na categoria
  const brandCounts = new Map();
  items.forEach((item) => {
    const b = (item.brand || 'Outro').trim();
    brandCounts.set(b, (brandCounts.get(b) || 0) + 1);
  });

  if (brandSelect) {
    brandSelect.replaceChildren();
    const optAll = document.createElement('option');
    optAll.value = 'all';
    optAll.textContent = `Todas as Marcas (${items.length})`;
    if (activeBrandFilter === 'all') optAll.selected = true;
    brandSelect.append(optAll);

    brandCounts.forEach((count, brand) => {
      const opt = document.createElement('option');
      opt.value = brand;
      opt.textContent = `${brand} (${count})`;
      if (activeBrandFilter === brand) opt.selected = true;
      brandSelect.append(opt);
    });
  }

  // 2. Tensões nominais disponíveis (respeitando marca selecionada)
  const itemsForVoltage = activeBrandFilter === 'all'
    ? items
    : items.filter((item) => (item.brand || 'Outro').trim() === activeBrandFilter);

  const voltageCounts = new Map();
  itemsForVoltage.forEach((item) => {
    const v = getItemVoltageLabel(activeCategory, item);
    if (!v) return;
    voltageCounts.set(v, (voltageCounts.get(v) || 0) + 1);
  });

  if (activeVoltageFilter !== 'all' && !voltageCounts.has(activeVoltageFilter)) {
    activeVoltageFilter = 'all';
  }

  if (voltageSelect) {
    voltageSelect.replaceChildren();
    const optAllV = document.createElement('option');
    optAllV.value = 'all';
    optAllV.textContent = `Todas as Tensões (${itemsForVoltage.length})`;
    if (activeVoltageFilter === 'all') optAllV.selected = true;
    voltageSelect.append(optAllV);

    voltageCounts.forEach((count, volt) => {
      const opt = document.createElement('option');
      opt.value = volt;
      opt.textContent = `${volt} (${count})`;
      if (activeVoltageFilter === volt) opt.selected = true;
      voltageSelect.append(opt);
    });
  }

  // 3. Chips rápidos organizados por Categoria | Marca | Tensão
  if (bar) {
    const chipSvg = getCategoryChipSvg(activeCategory);

    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'subfilter-chip' + (activeGroupFilter === 'all' && activeBrandFilter === 'all' && activeVoltageFilter === 'all' ? ' active' : '');
    allBtn.innerHTML = `${chipSvg} <span>Todos</span> <span class="chip-count">${items.length}</span>`;
    allBtn.onclick = () => {
      activeGroupFilter = 'all';
      activeBrandFilter = 'all';
      activeVoltageFilter = 'all';
      renderSubFilters();
      renderTable();
    };
    bar.append(allBtn);

    const groups = new Map();
    items.forEach((item) => {
      const catGrp = getItemGroupLabel(activeCategory, item);
      const brand = (item.brand || 'Outro').trim();
      const volt = getItemVoltageLabel(activeCategory, item);
      const key = `${catGrp} | ${brand} | ${volt}`;
      if (!groups.has(key)) {
        groups.set(key, { key, catGrp, brand, volt, count: 0 });
      }
      groups.get(key).count++;
    });

    groups.forEach((g) => {
      const isSelected = activeGroupFilter === g.key;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'subfilter-chip' + (isSelected ? ' active' : '');
      btn.innerHTML = `${chipSvg} <span>${escapeHtml(g.key)}</span> <span class="chip-count">${g.count}</span>`;
      btn.onclick = () => {
        if (activeGroupFilter === g.key) {
          activeGroupFilter = 'all';
          activeBrandFilter = 'all';
          activeVoltageFilter = 'all';
        } else {
          activeGroupFilter = g.key;
          activeBrandFilter = g.brand;
          activeVoltageFilter = g.volt;
        }
        renderSubFilters();
        renderTable();
      };
      bar.append(btn);
    });
  }
}

function onBrandFilterChange(val) {
  activeBrandFilter = val || 'all';
  activeGroupFilter = 'all';
  renderSubFilters();
  renderTable();
}
window.onBrandFilterChange = onBrandFilterChange;

function onVoltageFilterChange(val) {
  activeVoltageFilter = val || 'all';
  activeGroupFilter = 'all';
  renderSubFilters();
  renderTable();
}
window.onVoltageFilterChange = onVoltageFilterChange;

function handleTableSearch(query) {
  filterQuery = (query || '').toLowerCase().trim();
  renderTable();
}
window.handleTableSearch = handleTableSearch;

function renderTable() {
  if (activeCategory === 'settings') return;

  const tbody = $('products-table-tbody');
  if (!tbody) return;
  tbody.replaceChildren();

  const items = adminProducts[activeCategory] || [];

  const filtered = items.filter((item) => {
    const itemBrand = (item.brand || 'Outro').trim();
    const itemVoltage = getItemVoltageLabel(activeCategory, item);
    const itemGroup = getItemGroupLabel(activeCategory, item);

    if (filterQuery) {
      const idMatch = (item.id || '').toLowerCase().includes(filterQuery);
      const skuMatch = (item.sku || '').toLowerCase().includes(filterQuery);
      const nameMatch = (item.name || '').toLowerCase().includes(filterQuery);
      const brandMatch = itemBrand.toLowerCase().includes(filterQuery);
      const voltMatch = itemVoltage.toLowerCase().includes(filterQuery);
      const grpMatch = itemGroup.toLowerCase().includes(filterQuery);
      if (!idMatch && !skuMatch && !nameMatch && !brandMatch && !voltMatch && !grpMatch) return false;
    }

    if (activeBrandFilter !== 'all' && itemBrand !== activeBrandFilter) return false;
    if (activeVoltageFilter !== 'all' && itemVoltage !== activeVoltageFilter) return false;
    if (activeGroupFilter !== 'all' && `${itemGroup} | ${itemBrand} | ${itemVoltage}` !== activeGroupFilter) return false;

    return true;
  });

  const countPill = $('current-category-count');
  if (countPill) {
    const totalInCat = items.length;
    if (filterQuery || activeBrandFilter !== 'all' || activeVoltageFilter !== 'all' || activeGroupFilter !== 'all') {
      countPill.textContent = `${filtered.length} de ${totalInCat} equipamentos (filtrados)`;
    } else {
      countPill.textContent = `${totalInCat} ${totalInCat === 1 ? 'equipamento ativo' : 'equipamentos ativos'}`;
    }
  }

  if (filtered.length === 0) {
    const tr = document.createElement('tr');
    const queryNote = filterQuery ? ` para a pesquisa "<strong>${escapeHtml(filterQuery)}</strong>"` : '';
    tr.innerHTML = `
      <td colspan="6" style="text-align: center; padding: 36px 18px; color: var(--muted);">
        <div>Nenhum equipamento encontrado com os filtros selecionados${queryNote}.</div>
        <button type="button" class="btn-primary btn-sm" style="margin-top: 12px;" onclick="openNewProductModal()">
          + Cadastrar Novo Equipamento
        </button>
      </td>
    `;
    tbody.append(tr);
    return;
  }

  filtered.forEach((item) => {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    const defaultFallback = getProductImage(activeCategory, item);
    const imgSrc = sanitizeImageUrl(item.image, defaultFallback);
    const safeName = escapeHtml(item.name);
    const safeSku = escapeHtml(item.sku || item.id);
    const itemGroup = getItemGroupLabel(activeCategory, item);
    const itemVoltage = getItemVoltageLabel(activeCategory, item);

    tdName.innerHTML = `
      <div class="prod-table-item">
        <img src="${imgSrc}" alt="${safeName}" class="prod-thumb-img" onerror="this.onerror=null;this.src='${defaultFallback}'">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 2px;">
            <span class="prod-name-title">${safeName}</span>
          </div>
          <small style="color: var(--muted); font-size: 11px;"><code>${safeSku}</code></small>
        </div>
      </div>
    `;

    const tdGroupBrand = document.createElement('td');
    const tags = [];
    if (item.brand) {
      tags.push(`<span class="badge-brand">${escapeHtml(item.brand)}</span>`);
    }
    if (itemGroup) {
      tags.push(`<span class="badge-phase">${escapeHtml(itemGroup)}</span>`);
    }
    if (activeCategory === 'inverters' && item.phase) {
      const phLabel = item.phase === '1ph' ? 'Monofásico (1ph)' : (item.phase === 'split' ? 'Split-Phase' : 'Trifásico (3ph)');
      tags.push(`<span class="badge-phase">${phLabel}</span>`);
    }
    tdGroupBrand.innerHTML = `<div class="tech-tags-row">${tags.join('')}</div>`;

    const tdVoltage = document.createElement('td');
    const isHv = item.voltageType === 'HV' || itemVoltage.includes('(HV)');
    tdVoltage.innerHTML = `<span class="badge-volt ${isHv ? 'hv' : 'lv'}">${escapeHtml(itemVoltage)}</span>`;

    const tdCap = document.createElement('td');
    let capText = '';
    if (activeCategory === 'panels') {
      capText = `${escapeHtml(item.power)} Wp`;
    } else if (activeCategory === 'inverters') {
      capText = `${escapeHtml(item.power)} kW`;
    } else {
      capText = `${escapeHtml(item.capacity)} kWh`;
    }
    tdCap.innerHTML = `<span class="prod-cap-pill">${capText}</span>`;

    const tdPrice = document.createElement('td');
    tdPrice.innerHTML = `<span class="prod-price-text">${money(item.price)}</span>`;

    const tdActions = document.createElement('td');
    tdActions.style.textAlign = 'right';

    const actionDiv = document.createElement('div');
    actionDiv.className = 'action-btns-group';

    const btnEdit = document.createElement('button');
    btnEdit.type = 'button';
    btnEdit.className = 'btn-table-action';
    btnEdit.title = 'Editar equipamento';
    btnEdit.innerHTML = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Editar`;
    btnEdit.onclick = () => openEditProductModal(activeCategory, item.id);
    actionDiv.append(btnEdit);

    if (items.length > 1) {
      const btnDel = document.createElement('button');
      btnDel.type = 'button';
      btnDel.className = 'btn-table-action delete';
      btnDel.title = 'Remover equipamento';
      btnDel.innerHTML = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Apagar`;
      btnDel.onclick = () => handleDeleteProduct(activeCategory, item.id, item.name);
      actionDiv.append(btnDel);
    }

    tdActions.append(actionDiv);
    tr.append(tdName, tdGroupBrand, tdVoltage, tdCap, tdPrice, tdActions);
    tbody.append(tr);
  });
}

/* ========================================================
   MODAL DE CADASTRO / EDIÇÃO DE EQUIPAMENTOS
   ======================================================== */

function openNewProductModal() {
  const cat = activeCategory === 'settings' ? 'inverters' : activeCategory;

  $('form-prod-id').value = '';
  $('form-prod-category').value = cat;
  $('form-prod-name').value = '';
  $('form-prod-capacity').value = '';
  $('form-prod-price').value = '';
  $('form-prod-extra').value = '';

  // Reinicia marca, tensão e fase para evitar herdar estado residual de edições anteriores
  if ($('form-prod-brand')) {
    $('form-prod-brand').value = cat === 'panels' ? 'Jinko Solar' : 'MEGATRON';
  }
  if ($('form-prod-voltage-type')) {
    $('form-prod-voltage-type').value = 'LV';
  }
  if ($('form-prod-phase')) {
    $('form-prod-phase').value = '1ph';
  }

  currentUploadedImageDataUrl = '';
  const brandVal = $('form-prod-brand') ? $('form-prod-brand').value : '';
  const defaultImg = getProductImage(cat, { brand: brandVal });
  if ($('form-prod-image')) $('form-prod-image').value = defaultImg;
  if ($('form-prod-image-preset')) $('form-prod-image-preset').value = defaultImg;
  if ($('form-img-preview')) $('form-img-preview').src = defaultImg;

  // Reset do estado de upload no modal
  if ($('upload-file-status')) $('upload-file-status').hidden = true;
  if ($('form-prod-image-file')) $('form-prod-image-file').value = '';
  const advPanel = $('adv-img-panel');
  if (advPanel) advPanel.style.display = 'none';
  const advText = $('adv-img-toggle-text');
  if (advText) advText.textContent = '+ Usar Imagens Predefinidas LECASU ou URL';

  $('modal-prod-title').textContent = 'Cadastrar Novo Equipamento';
  setupModalLabels(cat);

  const modal = $('product-modal');
  modal.hidden = false;
  $('form-prod-name').focus();
  updateLivePreview();
}
window.openNewProductModal = openNewProductModal;

function openEditProductModal(category, productId) {
  const item = (adminProducts[category] || []).find((x) => x.id === productId);
  if (!item) return;

  $('form-prod-id').value = item.id;
  $('form-prod-category').value = category;
  $('form-prod-name').value = item.name;

  const cap = category === 'batteries' ? item.capacity : item.power;
  $('form-prod-capacity').value = cap;
  $('form-prod-price').value = item.price;
  $('form-prod-extra').value = item.extra || '';

  const prodImg = sanitizeImageUrl(item.image || getProductImage(category, item));
  currentUploadedImageDataUrl = (prodImg && prodImg.startsWith('data:image/')) ? prodImg : '';
  if ($('form-prod-image')) $('form-prod-image').value = prodImg;
  if ($('form-prod-image-preset')) $('form-prod-image-preset').value = prodImg;
  if ($('form-img-preview')) $('form-img-preview').src = prodImg;

  // Estado do componente de upload para o produto existente
  if ($('form-prod-image-file')) $('form-prod-image-file').value = '';
  const statusBox = $('upload-file-status');
  const nameEl = $('upload-file-name');
  if (statusBox && nameEl) {
    if (prodImg && prodImg.startsWith('data:image/')) {
      nameEl.textContent = 'Imagem personalizada em base64';
      statusBox.hidden = false;
    } else {
      statusBox.hidden = true;
    }
  }
  const advPanel = $('adv-img-panel');
  if (advPanel) advPanel.style.display = 'none';
  const advText = $('adv-img-toggle-text');
  if (advText) advText.textContent = '+ Usar Imagens Predefinidas LECASU ou URL';

  if ($('form-prod-brand')) $('form-prod-brand').value = item.brand || 'Outro';
  if ($('form-prod-voltage-type')) $('form-prod-voltage-type').value = item.voltageType || 'LV';
  if ($('form-prod-phase')) $('form-prod-phase').value = item.phase || '3ph';

  $('modal-prod-title').textContent = 'Editar Equipamento';
  setupModalLabels(category);

  const modal = $('product-modal');
  modal.hidden = false;
  $('form-prod-name').focus();
  updateLivePreview();
}

function handleProductImageFileSelect(fileInput) {
  const file = fileInput && fileInput.files && fileInput.files[0];
  if (!file) return;
  processProductImageFile(file);
}
window.handleProductImageFileSelect = handleProductImageFileSelect;

function processProductImageFile(file) {
  if (!file || (!file.type.startsWith('image/') && !file.name.toLowerCase().endsWith('.svg'))) {
    showToast('Por favor, selecione um ficheiro de imagem válido (PNG, JPG, JPEG, WEBP ou SVG).', 'warning');
    return;
  }

  const btnSave = $('btn-save-prod');
  const originalSaveHtml = btnSave ? btnSave.innerHTML : '';
  if (btnSave) {
    btnSave.disabled = true;
    btnSave.textContent = 'A processar imagem...';
  }

  const restoreSaveBtn = () => {
    if (btnSave) {
      btnSave.disabled = false;
      btnSave.innerHTML = originalSaveHtml;
    }
  };

  // Ficheiros SVG: validar sintaxe e codificar em Data URL
  if (file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      restoreSaveBtn();
      const svgText = String(e.target.result || '');
      if (!svgText.includes('<svg')) {
        showToast('O ficheiro SVG seleccionado parece inválido.', 'error');
        return;
      }
      try {
        const base64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));
        applyUploadedProductImage(base64, file.name, file.size);
      } catch (err) {
        showToast('Erro ao processar ficheiro SVG: ' + err.message, 'error');
      }
    };
    reader.onerror = () => {
      restoreSaveBtn();
      showToast('Erro ao ler o ficheiro SVG.', 'error');
    };
    reader.readAsText(file);
    return;
  }

  // Imagens Raster (PNG, JPG, WEBP): converter e redimensionar no Canvas para máxima leveza
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      restoreSaveBtn();
      const maxDim = 360;
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(width, 1);
      canvas.height = Math.max(height, 1);
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let dataUrl;
      try {
        dataUrl = canvas.toDataURL('image/webp', 0.80);
        if (!dataUrl || !dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', 0.80);
        }
      } catch {
        dataUrl = canvas.toDataURL('image/jpeg', 0.80);
      }

      applyUploadedProductImage(dataUrl, file.name, Math.round(dataUrl.length * 0.75));
    };
    img.onerror = () => {
      restoreSaveBtn();
      showToast('Não foi possível ler o ficheiro de imagem selecionado.', 'error');
    };
    img.src = e.target.result;
  };
  reader.onerror = () => {
    restoreSaveBtn();
    showToast('Erro ao carregar o ficheiro do computador.', 'error');
  };
  reader.readAsDataURL(file);
}

function applyUploadedProductImage(dataUrl, fileName, approxSizeBytes) {
  currentUploadedImageDataUrl = dataUrl;
  if ($('form-prod-image')) $('form-prod-image').value = dataUrl;
  if ($('form-img-preview')) $('form-img-preview').src = dataUrl;

  const statusBox = $('upload-file-status');
  const nameEl = $('upload-file-name');
  if (statusBox && nameEl) {
    const sizeKb = approxSizeBytes ? Math.round(approxSizeBytes / 1024) : 0;
    const cleanName = String(fileName || 'imagem').split(/[/\\]/).pop();
    nameEl.textContent = `${cleanName} (${sizeKb > 0 ? sizeKb + ' KB' : 'Carregado'})`;
    statusBox.hidden = false;
  }
  updateLivePreview();
}

function resetProductImageToDefault() {
  const cat = ($('form-prod-category') && $('form-prod-category').value) || activeCategory;
  currentUploadedImageDataUrl = '';
  const brandVal = $('form-prod-brand') ? $('form-prod-brand').value : '';
  const defaultImg = getProductImage(cat, { brand: brandVal });

  if ($('form-prod-image')) $('form-prod-image').value = defaultImg;
  if ($('form-prod-image-preset')) $('form-prod-image-preset').value = defaultImg;
  if ($('form-img-preview')) $('form-img-preview').src = defaultImg;

  const statusBox = $('upload-file-status');
  if (statusBox) statusBox.hidden = true;
  if ($('form-prod-image-file')) $('form-prod-image-file').value = '';

  updateLivePreview();
}
window.resetProductImageToDefault = resetProductImageToDefault;

function toggleAdvancedImageOptions() {
  const panel = $('adv-img-panel');
  const text = $('adv-img-toggle-text');
  if (!panel) return;
  const isHidden = panel.style.display === 'none';
  panel.style.display = isHidden ? 'block' : 'none';
  if (text) {
    text.textContent = isHidden ? '− Ocultar Biblioteca de Imagens / URL' : '+ Usar Imagens Predefinidas LECASU ou URL';
  }
}
window.toggleAdvancedImageOptions = toggleAdvancedImageOptions;

function initImageDropzone() {
  const dropzone = $('image-upload-dropzone');
  if (!dropzone) return;

  ['dragenter', 'dragover'].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-over');
    }, false);
  });

  ['dragleave', 'drop'].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-over');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt && dt.files;
    if (files && files.length > 0) {
      processProductImageFile(files[0]);
    }
  }, false);
}

function onSelectImagePreset(url) {
  if (!url) return;
  if ($('form-prod-image')) $('form-prod-image').value = url;
  if ($('form-img-preview')) $('form-img-preview').src = sanitizeImageUrl(url);
  const statusBox = $('upload-file-status');
  if (statusBox) statusBox.hidden = true;
  updateLivePreview();
}
window.onSelectImagePreset = onSelectImagePreset;

function updateModalImagePreview(url) {
  const preview = $('form-img-preview');
  if (preview) {
    preview.src = sanitizeImageUrl(url, 'img/products/panel-jinko.png');
  }
  updateLivePreview();
}
window.updateModalImagePreview = updateModalImagePreview;

function onBrandSelectChange(brandValue) {
  // Se o utilizador já carregou uma foto personalizada, NÃO sobrescreve com a imagem padrão da marca
  if (currentUploadedImageDataUrl) return;
  const currentImg = $('form-prod-image') ? $('form-prod-image').value.trim() : '';
  if (currentImg && currentImg.startsWith('data:image/')) return;

  const cat = ($('form-prod-category') && $('form-prod-category').value) || activeCategory;
  const brand = (brandValue || '').toLowerCase();
  let defaultImg = '';

  if (cat === 'panels') {
    if (brand.includes('canadian')) defaultImg = 'img/products/panel-canadian.png';
    else defaultImg = 'img/products/panel-jinko.png';
  } else if (cat === 'inverters') {
    if (brand.includes('megatron')) defaultImg = 'img/products/inv-megatron.png';
    else if (brand.includes('livoltek')) defaultImg = 'img/products/inv-livoltek.png';
    else if (brand.includes('sigen')) defaultImg = 'img/products/inv-sigen.png';
    else if (brand.includes('anern')) defaultImg = 'img/products/inv-anern.png';
    else defaultImg = 'img/products/inv-deye.png';
  } else if (cat === 'batteries') {
    if (brand.includes('megatron')) defaultImg = 'img/products/bat-megatron.jpg';
    else if (brand.includes('livoltek')) defaultImg = 'img/products/bat-livoltek-bhf.webp';
    else if (brand.includes('sigen')) defaultImg = 'img/products/bat-sigen.webp';
    else if (brand.includes('dyness')) defaultImg = 'img/products/bat-dyness.png';
    else if (brand.includes('hz')) defaultImg = 'img/products/bat-hz-gel.webp';
    else defaultImg = 'img/products/bat-deye.jpg';
  }

  if (defaultImg) {
    if ($('form-prod-image')) $('form-prod-image').value = defaultImg;
    if ($('form-prod-image-preset')) $('form-prod-image-preset').value = defaultImg;
    if ($('form-img-preview')) $('form-img-preview').src = defaultImg;
  }
}
window.onBrandSelectChange = onBrandSelectChange;

function setupModalLabels(cat) {
  const subLabel = $('modal-prod-sub');
  const capLabel = $('lbl-form-capacity');
  const capInput = $('form-prod-capacity');
  const nameInput = $('form-prod-name');
  const priceInput = $('form-prod-price');

  const grpVolt = $('grp-voltage-type');
  const grpPhase = $('grp-phase');

  if (cat === 'panels') {
    subLabel.textContent = 'Módulo Fotovoltaico (Painel)';
    capLabel.textContent = 'Potência Nominal (Wp) *';
    capInput.placeholder = 'Ex.: 605';
    capInput.step = 'any';
    capInput.min = '1';
    nameInput.placeholder = 'Ex.: Jinko Tiger Neo Bifacial 605W';
    priceInput.placeholder = 'Ex.: 8100';
    priceInput.step = 'any';
    priceInput.min = '0';
    if (grpVolt) grpVolt.style.display = 'none';
    if (grpPhase) grpPhase.style.display = 'none';
  } else if (cat === 'inverters') {
    subLabel.textContent = 'Inversor Híbrido & Controlador';
    capLabel.textContent = 'Potência Nominal (kW) *';
    capInput.placeholder = 'Ex.: 5, 12, 20 ou 25';
    capInput.step = 'any';
    capInput.min = '0.1';
    nameInput.placeholder = 'Ex.: Deye Híbrido 12 kW (3ph · LV-48)';
    priceInput.placeholder = 'Ex.: 210000';
    priceInput.step = 'any';
    priceInput.min = '0';
    if (grpVolt) grpVolt.style.display = 'flex';
    if (grpPhase) grpPhase.style.display = 'flex';
  } else if (cat === 'batteries') {
    subLabel.textContent = 'Bateria & Sistema de Armazenamento (BESS)';
    capLabel.textContent = 'Capacidade Útil (kWh) *';
    capInput.placeholder = 'Ex.: 5.12, 10.2 ou 20.5';
    capInput.step = 'any';
    capInput.min = '0.1';
    nameInput.placeholder = 'Ex.: Deye Battery LiFePO4 5.12 kWh (51.2V-LV)';
    priceInput.placeholder = 'Ex.: 98000';
    priceInput.step = 'any';
    priceInput.min = '0';
    if (grpVolt) grpVolt.style.display = 'flex';
    if (grpPhase) grpPhase.style.display = 'none';
  }
}

function updateLivePreview() {
  const name = ($('form-prod-name') && $('form-prod-name').value.trim()) || 'Nome do Modelo';
  const cap = ($('form-prod-capacity') && $('form-prod-capacity').value) || '0';
  const price = Number($('form-prod-price') && $('form-prod-price').value) || 0;
  const cat = ($('form-prod-category') && $('form-prod-category').value) || activeCategory;

  let unit = 'Wp';
  if (cat === 'inverters') unit = 'kW';
  else if (cat === 'batteries') unit = 'kWh';

  const preview = $('live-preview-select');
  if (preview) {
    const rawImg = ($('form-prod-image') && $('form-prod-image').value) || getProductImage(cat);
    const safeSrc = sanitizeImageUrl(rawImg, getProductImage(cat));
    preview.innerHTML = `
      <div style="display: inline-flex; align-items: center; gap: 8px;">
        <img src="${safeSrc}" alt="" style="width: 26px; height: 26px; object-fit: contain; border-radius: 4px; border: 1px solid var(--line); background: #ffffff; padding: 2px; flex-shrink: 0;">
        <span>${escapeHtml(name)} · ${escapeHtml(cap)} ${unit} (${money(price)})</span>
      </div>
    `;
  }
}

['form-prod-name', 'form-prod-capacity', 'form-prod-price'].forEach((id) => {
  const el = $(id);
  if (el) el.addEventListener('input', updateLivePreview);
});

function closeProductModal() {
  const modal = $('product-modal');
  if (modal) modal.hidden = true;
}
window.closeProductModal = closeProductModal;

function handleProductModalBackdrop(event) {
  if (event.target.id === 'product-modal') {
    closeProductModal();
  }
}
window.handleProductModalBackdrop = handleProductModalBackdrop;

async function handleSaveProduct(event) {
  event.preventDefault();

  const id = $('form-prod-id').value;
  const category = $('form-prod-category').value;
  const name = $('form-prod-name').value.trim();
  const cap = parseFloat($('form-prod-capacity').value) || 0;
  const price = parseFloat($('form-prod-price').value) || 0;
  const extra = $('form-prod-extra').value.trim();

  const brand = $('form-prod-brand') ? $('form-prod-brand').value : 'Deye';
  const voltageType = $('form-prod-voltage-type') ? $('form-prod-voltage-type').value : 'LV';
  const phase = $('form-prod-phase') ? $('form-prod-phase').value : '3ph';
  const rawImg = currentUploadedImageDataUrl || ($('form-prod-image') && $('form-prod-image').value.trim()) || getProductImage(category, { name, brand, voltageType });
  const image = sanitizeImageUrl(rawImg, getProductImage(category, { name, brand, voltageType }));

  if (!name || cap <= 0 || price <= 0) {
    showToast('Por favor, preencha os campos obrigatórios com valores válidos.', 'warning');
    return;
  }

  const snapshot = JSON.parse(JSON.stringify(adminProducts));
  const list = adminProducts[category];

  if (id) {
    const index = list.findIndex((x) => x.id === id);
    if (index !== -1) {
      if (list[index].name !== name) {
        list[index]._customName = true;
      }
      list[index].name = name;
      list[index].brand = brand;
      list[index].price = price;
      list[index].extra = extra;
      list[index].image = image;
      if (category === 'inverters') {
        list[index].power = cap;
        list[index].voltageType = voltageType;
        list[index].phase = phase;
      } else if (category === 'batteries') {
        list[index].capacity = cap;
        list[index].voltageType = voltageType;
        if (!list[index].subcategory) {
          if (voltageType === 'HV') {
            list[index].subcategory = brand.toLowerCase().includes('sigen') ? 'sigen_hv' : (brand.toLowerCase().includes('livoltek') ? 'livoltek_bhf' : 'sigen_hv');
          } else {
            list[index].subcategory = brand.toLowerCase().includes('megatron') ? 'megatron_lv' : 'lv_rack';
          }
        }
      } else {
        list[index].power = Math.round(cap);
      }
      list[index].categoryGroup = inferCategoryGroup(category, list[index]);
      list[index].nominalVoltage = inferNominalVoltage(category, list[index]);
    }
  } else {
    const newItem = {
      id: `prod_${Date.now()}`,
      name,
      brand,
      price,
      image,
      extra,
      _customName: true
    };
    if (category === 'inverters') {
      newItem.power = cap;
      newItem.voltageType = voltageType;
      newItem.phase = phase;
    } else if (category === 'batteries') {
      newItem.capacity = cap;
      newItem.voltageType = voltageType;
      if (voltageType === 'HV') {
        newItem.subcategory = brand.toLowerCase().includes('sigen') ? 'sigen_hv' : (brand.toLowerCase().includes('livoltek') ? 'livoltek_bhf' : 'sigen_hv');
      } else {
        newItem.subcategory = brand.toLowerCase().includes('megatron') ? 'megatron_lv' : 'lv_rack';
      }
    } else {
      newItem.power = Math.round(cap);
    }
    newItem.categoryGroup = inferCategoryGroup(category, newItem);
    newItem.nominalVoltage = inferNominalVoltage(category, newItem);
    list.push(newItem);
  }

  const ok = await saveProducts();
  if (ok) {
    closeProductModal();
    updateKpis();
    if (activeCategory !== 'settings') {
      renderSubFilters();
      renderTable();
    }
    showToast('Equipamento e imagem guardados com sucesso no catálogo!', 'success');
  } else {
    adminProducts = snapshot;
    saveLocalProductsData(adminProducts);
  }
}
window.handleSaveProduct = handleSaveProduct;

async function handleDeleteProduct(category, productId, productName) {
  const list = adminProducts[category];
  if (!list || list.length <= 1) {
    showToast('Deve existir pelo menos um equipamento disponível nesta categoria para permitir os cálculos de dimensionamento.', 'warning');
    return;
  }

  const confirmed = await showConfirmDialog({
    title: 'Apagar Equipamento',
    message: `Tem a certeza de que pretende apagar o equipamento:\n"${productName}"?`,
    confirmText: 'Apagar Equipamento',
    isDanger: true
  });

  if (confirmed) {
    const snapshot = JSON.parse(JSON.stringify(adminProducts));
    adminProducts[category] = list.filter((x) => x.id !== productId);
    const ok = await saveProducts();
    if (ok) {
      updateKpis();
      if (activeCategory !== 'settings') {
        renderSubFilters();
        renderTable();
      }
      showToast('Equipamento removido com sucesso.', 'info');
    } else {
      adminProducts = snapshot;
      saveLocalProductsData(adminProducts);
    }
  }
}

/* ========================================================
   BACKUP, RESTAURO & EXPORTAÇÃO
   ======================================================== */

function exportCatalogJson() {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(adminProducts, null, 2));
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const fileName = `lecasu_catalogo_equipamentos_${dateStr}.json`;

  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', fileName);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
window.exportCatalogJson = exportCatalogJson;

function importCatalogJson(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function (e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (
        parsed &&
        Array.isArray(parsed.panels) && parsed.panels.length > 0 &&
        Array.isArray(parsed.inverters) && parsed.inverters.length > 0 &&
        Array.isArray(parsed.batteries) && parsed.batteries.length > 0
      ) {
        const confirmed = await showConfirmDialog({
          title: 'Importar Catálogo',
          message: `Pretende substituir o catálogo actual por este ficheiro?\n\nEquipamentos a importar:\n• ${parsed.panels.length} Painéis\n• ${parsed.inverters.length} Inversores\n• ${parsed.batteries.length} Baterias`,
          confirmText: 'Importar Ficheiro'
        });
        if (confirmed) {
          ensureProductImages(parsed);
          adminProducts = parsed;
          const ok = await saveProducts();
          if (ok) {
            updateKpis();
            if (activeCategory !== 'settings') {
              renderSubFilters();
              renderTable();
            }
            showToast('Catálogo importado com sucesso!', 'success');
          }
        }
      } else {
        showToast('O ficheiro JSON seleccionado não possui a estrutura correcta ou contém categorias vazias.', 'error');
      }
    } catch (err) {
      showToast('Erro ao processar ficheiro JSON: ' + err.message, 'error');
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}
window.importCatalogJson = importCatalogJson;

async function confirmResetDefaults() {
  const confirmed = await showConfirmDialog({
    title: 'Restaurar Catálogo Oficial',
    message: 'Atenção: esta ação restaurará o catálogo oficial da LECASU com a lista completa de Inversores (Deye, LIVOLTEK, Sigenergy) e Baterias (LV e HV). Deseja continuar?',
    confirmText: 'Restaurar Catálogo',
    isDanger: true
  });
  if (!confirmed) {
    return;
  }

  if (isBackendAvailable) {
    try {
      const res = await fetch('/api/products/reset', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data && data.catalog) {
        adminProducts = data.catalog;
        saveLocalProductsData(adminProducts);
        updateKpis();
        if (activeCategory !== 'settings') {
          renderSubFilters();
          renderTable();
        }
        showToast('Catálogo oficial restaurado no servidor com sucesso!', 'success');
        return;
      }
      showToast(data.error || 'Erro ao restaurar catálogo no servidor.', 'error');
      return;
    } catch (err) {
      showToast('Erro de ligação ao servidor: ' + err.message, 'error');
      return;
    }
  }

  adminProducts = CatalogLib.cloneDefaults();
  await saveProducts();
  updateKpis();
  if (activeCategory !== 'settings') {
    renderSubFilters();
    renderTable();
  }
  showToast('Catálogo oficial restaurado com sucesso!', 'success');
}
window.confirmResetDefaults = confirmResetDefaults;

async function handleChangePassword(event) {
  if (event) event.preventDefault();

  const currentPwdInput = $('cfg-current-pwd');
  const newPwdInput = $('cfg-new-pwd');
  const confirmPwdInput = $('cfg-confirm-pwd');
  const msgBox = $('pwd-change-msg');

  if (!currentPwdInput || !newPwdInput || !confirmPwdInput || !msgBox) return;

  const currentEntered = currentPwdInput.value;
  const newEntered = newPwdInput.value;
  const confirmEntered = confirmPwdInput.value;

  msgBox.hidden = false;

  if (newEntered.length < 6) {
    msgBox.className = 'alert-box error';
    msgBox.textContent = 'A nova palavra-passe deve conter pelo menos 6 caracteres.';
    newPwdInput.focus();
    return;
  }

  if (newEntered !== confirmEntered) {
    msgBox.className = 'alert-box error';
    msgBox.textContent = 'A nova palavra-passe e a confirmação não coincidem.';
    confirmPwdInput.focus();
    return;
  }

  if (isBackendAvailable) {
    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentEntered, newPassword: newEntered })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        msgBox.className = 'alert-box error';
        msgBox.textContent = data.error || 'Erro ao atualizar palavra-passe.';
        currentPwdInput.focus();
        return;
      }
    } catch (err) {
      msgBox.className = 'alert-box error';
      msgBox.textContent = 'Erro de ligação ao servidor: ' + err.message;
      return;
    }
  } else {
    const creds = getFallbackCredentials();
    const enteredHash = await sha256Hex(currentEntered);
    if (enteredHash !== creds.passwordHash) {
      msgBox.className = 'alert-box error';
      msgBox.textContent = 'A palavra-passe actual introduzida está incorrecta.';
      currentPwdInput.focus();
      return;
    }

    creds.passwordHash = await sha256Hex(newEntered);
    creds.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY_CREDENTIALS, JSON.stringify(creds));
    } catch {}
  }

  msgBox.className = 'alert-box success';
  msgBox.textContent = 'Palavra-passe actualizada com sucesso! Utilize a nova senha nos próximos acessos.';
  currentPwdInput.value = '';
  newPwdInput.value = '';
  confirmPwdInput.value = '';

  setTimeout(() => {
    msgBox.hidden = true;
  }, 6000);
}
window.handleChangePassword = handleChangePassword;

/* ========================================================
   INICIALIZAÇÃO
   ======================================================== */
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductModal();
    closeRecoverPasswordModal();
  }
});

function initAdmin() {
  const loginForm = $('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  initImageDropzone();
  checkAuth();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdmin);
} else {
  initAdmin();
}
