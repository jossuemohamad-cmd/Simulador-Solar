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
const DEFAULT_FALLBACK_HASH = '56c3131214fb7fe070884f793628b64eaa545e0b0a3581a51f2afdd07cfb82f5';

const getProductImage = CatalogLib.getProductImage;
const ensureProductImages = CatalogLib.ensureProductImages;
const sanitizeImageUrl = CatalogLib.sanitizeImageUrl;
const escapeHtml = CatalogLib.escapeHtml;

// Estado da Aplicação
let adminProducts = loadLocalProductsFallback();
let activeCategory = 'inverters';
let activeSubFilter = 'all';
let filterQuery = '';
let isBackendAvailable = null; // null = ainda não detetado; true/false após /api/auth/me
let currentUploadedImageDataUrl = ''; // Armazena em memória o data:image/ da foto carregada no modal

const $ = (id) => document.getElementById(id);
const money = (n) => new Intl.NumberFormat('pt-MZ', { maximumFractionDigits: 0 }).format(n) + ' MT';

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
  try {
    localStorage.removeItem('lecasu_admin_products_v1');
    localStorage.removeItem('lecasu_admin_products_v2');
  } catch {}

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
        saveLocalProductsData(parsed);
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Erro ao carregar produtos locais:', e);
  }

  const cloned = CatalogLib.cloneDefaults();
  saveLocalProductsData(cloned);
  return cloned;
}

function saveLocalProductsData(data) {
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(data));
  } catch {}
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
        alert('A sua sessão administrativa expirou. Inicie sessão novamente.');
        await checkAuth();
        return false;
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        updateSyncIndicator('error', 'Erro ao sincronizar');
        alert(errData.error || 'Erro ao guardar alterações no servidor.');
        return false;
      }
      const data = await res.json();
      if (data && data.catalog) {
        adminProducts = data.catalog;
        saveLocalProductsData(adminProducts);
      }
      updateSyncIndicator('server', 'Servidor Sincronizado');
      return true;
    } catch (err) {
      updateSyncIndicator('error', 'Sem ligação ao servidor');
      alert('Não foi possível sincronizar com o servidor: ' + err.message);
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
    const isPwdMatch = enteredHash === creds.passwordHash;

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
  if (!confirm('Deseja realmente terminar a sua sessão no Portal de Administração?')) {
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
    panels: 'Painéis Fotovoltaicos (Módulos)',
    inverters: 'Inversores Híbridos & Controladores',
    batteries: 'Baterias LiFePO4 & Armazenamento (BESS)',
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
      pageDescEl.textContent = 'Os equipamentos cadastrados aqui ficam automaticamente disponíveis para selecção e dimensionamento pelos clientes na Etapa 3 do simulador.';
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
  const subfilterField = $('subfilter-field-wrapper');

  if (category === 'settings') {
    if (productsView) productsView.hidden = true;
    if (settingsView) settingsView.hidden = false;
    if (searchContainer) searchContainer.hidden = true;
    if (subfiltersBar) subfiltersBar.hidden = true;
    if (subfilterField) subfilterField.hidden = true;
    if ($('current-category-count')) {
      $('current-category-count').textContent = 'Definições do Sistema';
    }
  } else {
    if (productsView) productsView.hidden = false;
    if (settingsView) settingsView.hidden = true;
    if (searchContainer) searchContainer.hidden = false;
    if (subfiltersBar) subfiltersBar.hidden = false;
    if (subfilterField) subfilterField.hidden = false;
    renderSubFilters();
    renderTable();
  }
}
window.switchCategory = switchCategory;

function renderSubFilters() {
  if (activeCategory === 'settings') return;

  const bar = $('admin-subfilters-bar');
  const select = $('admin-subfilter-select');
  if (bar) bar.replaceChildren();

  const items = adminProducts[activeCategory] || [];
  let filters = [];

  if (activeCategory === 'inverters') {
    filters = [
      { id: 'all', label: 'Todos os Inversores', count: items.length },
      { id: 'lv', label: '🔹 Baixa Tensão (LV ~48V)', count: items.filter((i) => i.voltageType === 'LV').length },
      { id: 'hv', label: '⚡ Alta Tensão (HV ~900V)', count: items.filter((i) => i.voltageType === 'HV').length },
      { id: '1ph', label: 'Monofásico (1ph)', count: items.filter((i) => i.phase === '1ph').length },
      { id: 'split', label: 'Split-Phase (Bifásico)', count: items.filter((i) => i.phase === 'split').length },
      { id: '3ph', label: 'Trifásico (3ph)', count: items.filter((i) => i.phase === '3ph').length },
      { id: 'brand_megatron', label: 'MEGATRON', count: items.filter((i) => (i.brand || '').toLowerCase().includes('megatron') || (i.name || '').toLowerCase().includes('megatron')).length },
      { id: 'brand_deye', label: 'Deye', count: items.filter((i) => (i.brand || '').toLowerCase().includes('deye') || (i.name || '').toLowerCase().includes('deye')).length },
      { id: 'brand_livoltek', label: 'LIVOLTEK', count: items.filter((i) => (i.brand || '').toLowerCase().includes('livoltek') || (i.name || '').toLowerCase().includes('livoltek')).length },
      { id: 'brand_sigen', label: 'Sigenergy (SigenStor)', count: items.filter((i) => (i.brand || '').toLowerCase().includes('sigen') || (i.name || '').toLowerCase().includes('sigen')).length }
    ];
  } else if (activeCategory === 'batteries') {
    filters = [
      { id: 'all', label: 'Todas as Baterias', count: items.length },
      { id: 'lv', label: '🔹 Baixa Tensão (LV ~51.2V)', count: items.filter((b) => b.voltageType === 'LV').length },
      { id: 'hv', label: '⚡ Alta Tensão (HV 100-900V)', count: items.filter((b) => b.voltageType === 'HV').length },
      { id: 'brand_megatron', label: 'MEGATRON LiFePO4 (5.12 / 16 kWh)', count: items.filter((b) => (b.brand || '').toLowerCase().includes('megatron') || (b.name || '').toLowerCase().includes('megatron')).length },
      { id: 'brand_deye', label: 'Deye LiFePO4', count: items.filter((b) => (b.brand || '').toLowerCase().includes('deye') || (b.name || '').toLowerCase().includes('deye')).length },
      { id: 'brand_sigen', label: 'Sigenergy Sigen Battery', count: items.filter((b) => (b.brand || '').toLowerCase().includes('sigen') || (b.name || '').toLowerCase().includes('sigen')).length },
      { id: 'brand_livoltek', label: 'LIVOLTEK Torre BHF (10 a 61 kWh)', count: items.filter((b) => (b.brand || '').toLowerCase().includes('livoltek') || (b.name || '').toLowerCase().includes('livoltek')).length }
    ];
  } else if (activeCategory === 'panels') {
    filters = [
      { id: 'all', label: 'Todos os Painéis', count: items.length },
      { id: 'bifacial', label: '✨ N-Type Bifaciais (Dual Glass)', count: items.filter((p) => p.panelType === 'bifacial_dual_glass' || (p.extra || '').toLowerCase().includes('bifacial') || (p.name || '').toLowerCase().includes('bifacial')).length },
      { id: 'p_600_610', label: '⚡ 600W – 610W', count: items.filter((p) => p.power >= 600 && p.power <= 610).length },
      { id: 'p_615_625', label: '⚡ 615W – 625W', count: items.filter((p) => p.power >= 615 && p.power <= 625).length },
      { id: 'brand_jinko', label: 'Jinko Solar (Tiger Neo)', count: items.filter((p) => (p.name || '').toLowerCase().includes('jinko') || (p.brand || '').toLowerCase().includes('jinko')).length }
    ];
  }

  if (select) {
    select.replaceChildren();
    filters.forEach((f) => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = `${f.label.replace(/^[🔹⚡✨]\s*/, '')} (${f.count})`;
      if (activeSubFilter === f.id) opt.selected = true;
      select.append(opt);
    });
  }

  if (bar) {
    filters.forEach((f) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'subfilter-chip' + (activeSubFilter === f.id ? ' active' : '');
      btn.setAttribute('data-filter-id', f.id);
      btn.innerHTML = `<span>${escapeHtml(f.label)}</span> <span class="chip-count">${f.count}</span>`;
      btn.onclick = () => {
        activeSubFilter = f.id;
        if (select) select.value = f.id;
        renderSubFilters();
        renderTable();
      };
      bar.append(btn);
    });
  }
}

function onSubFilterDropdownChange(val) {
  activeSubFilter = val || 'all';
  const bar = $('admin-subfilters-bar');
  if (bar) {
    const chips = bar.querySelectorAll('.subfilter-chip');
    chips.forEach((c) => {
      c.classList.toggle('active', c.getAttribute('data-filter-id') === activeSubFilter);
    });
  }
  renderTable();
}
window.onSubFilterDropdownChange = onSubFilterDropdownChange;

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
    if (filterQuery) {
      const nameMatch = (item.name || '').toLowerCase().includes(filterQuery);
      const extraMatch = (item.extra || '').toLowerCase().includes(filterQuery);
      const brandMatch = (item.brand || '').toLowerCase().includes(filterQuery);
      if (!nameMatch && !extraMatch && !brandMatch) return false;
    }

    if (activeSubFilter !== 'all') {
      if (activeSubFilter === 'lv' && item.voltageType !== 'LV') return false;
      if (activeSubFilter === 'hv' && item.voltageType !== 'HV') return false;
      if (activeSubFilter === '1ph' && item.phase !== '1ph') return false;
      if (activeSubFilter === 'split' && item.phase !== 'split') return false;
      if (activeSubFilter === '3ph' && item.phase !== '3ph') return false;
      if (activeSubFilter === 'brand_megatron' && !((item.brand || '').toLowerCase().includes('megatron') || (item.name || '').toLowerCase().includes('megatron'))) return false;
      if (activeSubFilter === 'brand_deye' && !((item.brand || '').toLowerCase().includes('deye') || (item.name || '').toLowerCase().includes('deye'))) return false;
      if (activeSubFilter === 'brand_livoltek' && !((item.brand || '').toLowerCase().includes('livoltek') || (item.name || '').toLowerCase().includes('livoltek'))) return false;
      if (activeSubFilter === 'brand_sigen' && !((item.brand || '').toLowerCase().includes('sigen') || (item.name || '').toLowerCase().includes('sigen'))) return false;
      if (activeSubFilter === 'bifacial' && !(item.panelType === 'bifacial_dual_glass' || (item.extra || '').toLowerCase().includes('bifacial') || (item.name || '').toLowerCase().includes('bifacial'))) return false;
      if (activeSubFilter === 'p_600_610' && !(item.power >= 600 && item.power <= 610)) return false;
      if (activeSubFilter === 'p_615_625' && !(item.power >= 615 && item.power <= 625)) return false;
      if (activeSubFilter === 'brand_jinko' && !((item.name || '').toLowerCase().includes('jinko') || (item.brand || '').toLowerCase().includes('jinko'))) return false;
    }

    return true;
  });

  const countPill = $('current-category-count');
  if (countPill) {
    const totalInCat = items.length;
    if (filterQuery || activeSubFilter !== 'all') {
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
    const brandBadge = item.brand ? `<span class="badge-brand">${escapeHtml(item.brand)}</span>` : '';
    const imgSrc = sanitizeImageUrl(item.image || getProductImage(activeCategory, item));
    const safeName = escapeHtml(item.name);
    const safeId = escapeHtml(item.id);

    tdName.innerHTML = `
      <div class="prod-table-item">
        <img src="${imgSrc}" alt="${safeName}" class="prod-thumb-img" onerror="this.onerror=null;this.src='img/products/panel-jinko.svg'">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 2px;">
            <span class="prod-name-title">${safeName}</span>
            ${brandBadge}
          </div>
          <small style="color: var(--muted); font-size: 11px;">ID: <code>${safeId}</code></small>
        </div>
      </div>
    `;

    const tdVoltage = document.createElement('td');
    const tags = [];
    if (activeCategory === 'panels') {
      const isBifacial = item.panelType === 'bifacial_dual_glass' || (item.extra || '').toLowerCase().includes('bifacial') || (item.name || '').toLowerCase().includes('bifacial');
      if (isBifacial) {
        tags.push(`<span class="badge-volt hv">Dual Glass Bifacial</span>`);
        tags.push(`<span class="badge-phase">N-Type SMBB</span>`);
      } else {
        tags.push(`<span class="badge-phase">Mono-PERC Tier 1</span>`);
      }
    } else {
      if (item.voltageType === 'LV') {
        tags.push(`<span class="badge-volt lv">LV · 48V/51.2V</span>`);
      } else if (item.voltageType === 'HV') {
        tags.push(`<span class="badge-volt hv">HV · Alta Tensão</span>`);
      }

      if (item.phase === '1ph') {
        tags.push(`<span class="badge-phase">1ph (Monofásico)</span>`);
      } else if (item.phase === 'split') {
        tags.push(`<span class="badge-phase">Split-Phase (Bifásico)</span>`);
      } else if (item.phase === '3ph') {
        tags.push(`<span class="badge-phase">3ph (Trifásico)</span>`);
      }
    }

    tdVoltage.innerHTML = tags.length === 0
      ? `<span style="color: var(--muted); font-size: 11px;">— Padrão Solar —</span>`
      : `<div class="tech-tags-row">${tags.join('')}</div>`;

    const tdCap = document.createElement('td');
    let capText = '';
    if (activeCategory === 'panels') {
      const effTag = item.efficiency ? `<small style="display: block; font-size: 10px; color: #047857; font-weight: 700; margin-top: 2px;">Efic. ${escapeHtml(item.efficiency)}</small>` : '';
      capText = `${escapeHtml(item.power)} Wp${effTag}`;
    } else if (activeCategory === 'inverters') {
      capText = `${escapeHtml(item.power)} kW`;
    } else {
      capText = `${escapeHtml(item.capacity)} kWh`;
    }
    tdCap.innerHTML = `<span class="prod-cap-pill">${capText}</span>`;

    const tdPrice = document.createElement('td');
    tdPrice.innerHTML = `<span class="prod-price-text">${money(item.price)}</span>`;

    const tdExtra = document.createElement('td');
    const extraParts = [];
    if (item.extra) extraParts.push(escapeHtml(item.extra));
    if (item.dimensions) extraParts.push(`Dim: ${escapeHtml(item.dimensions)}`);
    if (item.warranty) extraParts.push(`Garantia: ${escapeHtml(item.warranty)}`);
    tdExtra.innerHTML = `<span style="font-size: 11.5px; color: var(--muted); line-height: 1.35; display: block;">${extraParts.join(' · ') || '—'}</span>`;

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
    tr.append(tdName, tdVoltage, tdCap, tdPrice, tdExtra, tdActions);
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
    alert('Por favor, selecione um ficheiro de imagem válido (PNG, JPG, JPEG, WEBP ou SVG).');
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
        alert('O ficheiro SVG seleccionado parece inválido.');
        return;
      }
      try {
        const base64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));
        applyUploadedProductImage(base64, file.name, file.size);
      } catch (err) {
        alert('Erro ao processar ficheiro SVG: ' + err.message);
      }
    };
    reader.onerror = () => {
      restoreSaveBtn();
      alert('Erro ao ler o ficheiro SVG.');
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
      const maxDim = 480;
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
        dataUrl = canvas.toDataURL('image/webp', 0.88);
        if (!dataUrl || !dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/png');
        }
      } catch {
        dataUrl = canvas.toDataURL('image/png');
      }

      applyUploadedProductImage(dataUrl, file.name, Math.round(dataUrl.length * 0.75));
    };
    img.onerror = () => {
      restoreSaveBtn();
      alert('Não foi possível ler o ficheiro de imagem selecionado.');
    };
    img.src = e.target.result;
  };
  reader.onerror = () => {
    restoreSaveBtn();
    alert('Erro ao carregar o ficheiro do computador.');
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
    preview.src = sanitizeImageUrl(url, 'img/products/panel-jinko.svg');
  }
  updateLivePreview();
}
window.updateModalImagePreview = updateModalImagePreview;

function onBrandSelectChange(brandValue) {
  const cat = ($('form-prod-category') && $('form-prod-category').value) || activeCategory;
  const brand = (brandValue || '').toLowerCase();
  let defaultImg = '';

  if (cat === 'panels') {
    if (brand.includes('canadian')) defaultImg = 'img/products/panel-canadian.svg';
    else if (brand.includes('ja')) defaultImg = 'img/products/panel-ja.svg';
    else if (brand.includes('longi')) defaultImg = 'img/products/panel-longi.svg';
    else defaultImg = 'img/products/panel-jinko.svg';
  } else if (cat === 'inverters') {
    if (brand.includes('megatron')) defaultImg = 'img/products/inv-megatron-lv.svg';
    else if (brand.includes('livoltek')) defaultImg = 'img/products/inv-livoltek-lv.svg';
    else if (brand.includes('sigen')) defaultImg = 'img/products/inv-sigen-hv.svg';
    else defaultImg = 'img/products/inv-deye-lv.svg';
  } else if (cat === 'batteries') {
    if (brand.includes('megatron')) defaultImg = 'img/products/bat-megatron-lv.svg';
    else if (brand.includes('livoltek')) defaultImg = 'img/products/bat-livoltek-bhf.svg';
    else if (brand.includes('sigen')) defaultImg = 'img/products/bat-sigen-hv.svg';
    else defaultImg = 'img/products/bat-deye-lv.svg';
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
    alert('Por favor, preencha os campos obrigatórios com valores válidos.');
    return;
  }

  const snapshot = JSON.parse(JSON.stringify(adminProducts));
  const list = adminProducts[category];

  if (id) {
    const index = list.findIndex((x) => x.id === id);
    if (index !== -1) {
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
    }
  } else {
    const newItem = {
      id: `prod_${Date.now()}`,
      name,
      brand,
      price,
      image,
      extra
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
    alert('✓ Equipamento e imagem guardados com sucesso no catálogo!');
  } else {
    adminProducts = snapshot;
    saveLocalProductsData(adminProducts);
  }
}
window.handleSaveProduct = handleSaveProduct;

async function handleDeleteProduct(category, productId, productName) {
  const list = adminProducts[category];
  if (!list || list.length <= 1) {
    alert('Deve existir pelo menos um equipamento disponível nesta categoria para permitir os cálculos do simulador.');
    return;
  }

  if (confirm(`Tem a certeza de que pretende apagar o equipamento:\n"${productName}"?`)) {
    const snapshot = JSON.parse(JSON.stringify(adminProducts));
    adminProducts[category] = list.filter((x) => x.id !== productId);
    const ok = await saveProducts();
    if (ok) {
      updateKpis();
      if (activeCategory !== 'settings') {
        renderSubFilters();
        renderTable();
      }
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
        if (confirm(`Pretende substituir o catálogo actual por este ficheiro?\n\nEquipamentos a importar:\n• ${parsed.panels.length} Painéis\n• ${parsed.inverters.length} Inversores\n• ${parsed.batteries.length} Baterias`)) {
          ensureProductImages(parsed);
          adminProducts = parsed;
          const ok = await saveProducts();
          if (ok) {
            updateKpis();
            if (activeCategory !== 'settings') {
              renderSubFilters();
              renderTable();
            }
            alert('✓ Catálogo importado com sucesso!');
          }
        }
      } else {
        alert('O ficheiro JSON seleccionado não possui a estrutura correcta ou contém categorias vazias.');
      }
    } catch (err) {
      alert('Erro ao processar ficheiro JSON: ' + err.message);
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}
window.importCatalogJson = importCatalogJson;

async function confirmResetDefaults() {
  if (!confirm('Atenção: esta ação restaurará o catálogo oficial da LECASU com a lista completa de Inversores (Deye, LIVOLTEK, Sigenergy) e Baterias (LV e HV). Continuar?')) {
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
        alert('✓ Catálogo oficial restaurado no servidor com sucesso!');
        return;
      }
      alert(data.error || 'Erro ao restaurar catálogo no servidor.');
      return;
    } catch (err) {
      alert('Erro de ligação ao servidor: ' + err.message);
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
  alert('✓ Catálogo oficial restaurado com sucesso!');
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
    msgBox.textContent = '❌ A nova palavra-passe deve conter pelo menos 6 caracteres.';
    newPwdInput.focus();
    return;
  }

  if (newEntered !== confirmEntered) {
    msgBox.className = 'alert-box error';
    msgBox.textContent = '❌ A nova palavra-passe e a confirmação não coincidem.';
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
        msgBox.textContent = '❌ ' + (data.error || 'Erro ao atualizar palavra-passe.');
        currentPwdInput.focus();
        return;
      }
    } catch (err) {
      msgBox.className = 'alert-box error';
      msgBox.textContent = '❌ Erro de ligação ao servidor: ' + err.message;
      return;
    }
  } else {
    const creds = getFallbackCredentials();
    const enteredHash = await sha256Hex(currentEntered);
    if (enteredHash !== creds.passwordHash) {
      msgBox.className = 'alert-box error';
      msgBox.textContent = '❌ A palavra-passe actual introduzida está incorrecta.';
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
  msgBox.textContent = '✓ Palavra-passe actualizada com sucesso! Utilize a nova senha nos próximos acessos.';
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
