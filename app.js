/**
 * LECASU — Simulador Solar Fotovoltaico Residencial & Comercial (PWA Ready)
 * Dimensionamento técnico, gestão de catálogo de equipamentos (Admin) e proposta formal.
 */

// Biblioteca de Ícones SVG
const ICONS = {
  led: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2v1"/><path d="M12 7a5 5 0 0 0-5 5c0 2.5 1.5 3.5 2 5h6c.5-1.5 2-2.5 2-5a5 5 0 0 0-5-5z"/></svg>`,
  tv: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="13" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>`,
  fridge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="5" y1="10" x2="19" y2="10"/><line x1="9" y1="5" x2="9" y2="7"/><line x1="9" y1="13" x2="9" y2="16"/></svg>`,
  freezer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/></svg>`,
  fan: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c-2.5-3-2.5-6.5-1-8 2-2 6 2 4.5 4.5"/><path d="M12 12c3-2.5 6.5-2.5 8-1 2 2-2 6-4.5 4.5"/><path d="M12 12c2.5 3 2.5 6.5 1 8-2 2-6-2-4.5-4.5"/><path d="M12 12c-3 2.5-6.5 2.5-8 1-2-2 2-6 4.5-4.5"/><circle cx="12" cy="12" r="2"/></svg>`,
  laptop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/></svg>`,
  desktop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  wifi: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
  security: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="3"/></svg>`,
  ac: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="9" rx="2"/><line x1="6" y1="8" x2="8" y2="8"/><path d="M6 16c1 1 2 1 3 0s2-1 3 0 2 1 3 0"/><path d="M6 20c1 1 2 1 3 0s2-1 3 0 2 1 3 0"/></svg>`,
  pump: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
  borehole: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="m17 7-5-5-5 5"/><circle cx="12" cy="17" r="4"/><path d="M12 15v4"/></svg>`,
  washing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><circle cx="12" cy="13" r="2"/><line x1="8" y1="6" x2="8.01" y2="6"/><line x1="11" y1="6" x2="13" y2="6"/></svg>`,
  microwave: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><rect x="5" y="8" width="10" height="8" rx="1"/><circle cx="18" cy="9" r="1"/><circle cx="18" cy="12" r="1"/><line x1="17" y1="15" x2="19" y2="15"/></svg>`,
  iron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17h18c-1-5-4-9-9-9H5c-1.1 0-2 .9-2 2v7z"/><line x1="5" y1="8" x2="5" y2="4"/><line x1="5" y1="4" x2="15" y2="4"/></svg>`,
  kettle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`,
  waterheater: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="6"/><line x1="10" y1="7" x2="14" y2="7"/><circle cx="12" cy="14" r="2"/></svg>`,
  custom: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  solar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="12" rx="1"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="15"/><line x1="15" y1="3" x2="15" y2="15"/><line x1="6" y1="19" x2="18" y2="19"/><line x1="12" y1="15" x2="12" y2="19"/></svg>`,
  inverter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>`,
  battery: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="12" rx="2"/><line x1="22" y1="11" x2="22" y2="15"/><line x1="7" y1="11" x2="7" y2="15"/><line x1="11" y1="11" x2="11" y2="15"/></svg>`,
  cash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M14.8 9A2 2 0 0 0 13 8h-2a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4h-2a2 2 0 0 1-1.8-1"/><path d="M12 6v2m0 8v2"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
};

// Catálogo Base de Aparelhos Domésticos e Comerciais (Formato: [icone, nome, potenciaW, horasDia, fatorUso, essencialPadrao])
const catalog = [
  ['led', 'Lâmpada LED', 10, 5, 1, true],
  ['tv', 'Televisão', 100, 5, 1, true],
  ['fridge', 'Geleira', 150, 24, 0.35, true],
  ['freezer', 'Congelador', 200, 24, 0.35, true],
  ['fan', 'Ventoinha', 60, 8, 1, true],
  ['laptop', 'Computador portátil', 65, 6, 1, true],
  ['wifi', 'Router Wi-Fi', 15, 24, 1, true],
  ['security', 'CCTV & Cerca Elétrica', 80, 24, 1, true],
  ['desktop', 'Computador de Escritório', 200, 6, 1, true],
  ['ac', 'Ar condicionado', 1200, 8, 1, false],
  ['pump', 'Bomba de água', 750, 1, 1, false],
  ['borehole', 'Bomba de Furo Submersa', 1500, 1.5, 1, false],
  ['washing', 'Máquina de lavar', 500, 1, 1, false],
  ['microwave', 'Micro-ondas', 1200, 0.5, 1, false],
  ['iron', 'Ferro de engomar', 1800, 0.5, 1, false],
  ['kettle', 'Chaleira', 2000, 0.25, 1, false],
  ['waterheater', 'Termoacumulador / Geyser', 1500, 2, 0.7, false]
];

/* ========================================================
   CATÁLOGO DE EQUIPAMENTOS (SINCRONIZADO COM O SERVIDOR)
   ======================================================== */
const CatalogLib = window.LecasuCatalog;
const STORAGE_KEY_PRODUCTS = CatalogLib.STORAGE_KEY_PRODUCTS;
const getProductImage = CatalogLib.getProductImage;
const ensureProductImages = CatalogLib.ensureProductImages;
const sanitizeImageUrl = CatalogLib.sanitizeImageUrl;
const escapeHtml = CatalogLib.escapeHtml;

function loadAdminProducts() {
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
    console.warn('Erro ao carregar catálogo local:', e);
  }

  if (!result) {
    result = CatalogLib.cloneDefaults();
  }

  if (typeof CatalogLib.migrateAndApplyCustomImages === 'function') {
    CatalogLib.migrateAndApplyCustomImages(result, localStorage);
  }

  try {
    localStorage.removeItem('lecasu_admin_products_v1');
    localStorage.removeItem('lecasu_admin_products_v2');
    localStorage.removeItem('lecasu_admin_products_v3');
    localStorage.removeItem('lecasu_admin_products_v4');
  } catch {}

  saveAdminProductsData(result);
  return result;
}

function saveAdminProductsData(data) {
  try {
    if (typeof CatalogLib.migrateAndApplyCustomImages === 'function') {
      CatalogLib.migrateAndApplyCustomImages(data, localStorage);
    }
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(data));
  } catch {}
}

/**
 * Busca o catálogo oficial publicado pelo Admin no backend Node.js
 */
async function syncCatalogFromServer() {
  try {
    const res = await fetch('/api/products', { cache: 'no-store' });
    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('application/json')) {
      const data = await res.json();
      if (
        data &&
        Array.isArray(data.panels) && data.panels.length > 0 &&
        Array.isArray(data.inverters) && data.inverters.length > 0 &&
        Array.isArray(data.batteries) && data.batteries.length > 0
      ) {
        ensureProductImages(data);

        // Preservar fotos Base64 armazenadas localmente — o servidor pode não ter
        // as imagens personalizadas se forem grandes demais para o JSON remoto
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
        saveAdminProductsData(data);
        update();
      }
    }
  } catch {}
}

// Catálogo carregado (inicializa imediato via cache/padrão e sincroniza via API)
let adminProducts = loadAdminProducts();

// Seleções personalizadas do cliente na Etapa 3
const userSelections = {
  panelId: null,
  inverterId: null,
  batteryId: null
};

/* ========================================================
   PERSISTÊNCIA DA SESSÃO DO SIMULADOR (Evita perder dados ao dar refresh)
   ======================================================== */
const STORAGE_KEY_SESSION = 'lecasu_simulation_session_v1';

function saveSimulationSession() {
  try {
    const sessionData = {
      chosen: Array.from(chosen.entries()),
      clientName: ($('client-name') && $('client-name').value) || '',
      clientPhone: ($('client-phone') && $('client-phone').value) || '',
      location: ($('location') && $('location').value) || '',
      projectType: ($('project-type') && $('project-type').value) || 'Residência',
      backupHours: ($('backup') && $('backup').value) || '4',
      userSelections: userSelections,
      currentStep: currentStep,
      customCatalog: catalog.filter((item) => item[0] === 'custom')
    };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionData));
  } catch (e) {
    console.warn('Erro ao guardar sessão:', e);
  }
}

function loadSimulationSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!raw) return 0;
    const data = JSON.parse(raw);

    // 1. Restaurar aparelhos personalizados do catálogo
    if (Array.isArray(data.customCatalog)) {
      data.customCatalog.forEach((cItem) => {
        const exists = catalog.some((x) => x[0] === 'custom' && x[1] === cItem[1]);
        if (!exists) catalog.push(cItem);
      });
    }

    // 2. Restaurar Map chosen
    if (Array.isArray(data.chosen) && data.chosen.length > 0) {
      chosen.clear();
      data.chosen.forEach(([key, val]) => {
        chosen.set(Number(key), val);
      });
    }

    // 3. Restaurar campos do formulário
    if ($('client-name') && data.clientName) $('client-name').value = data.clientName;
    if ($('client-phone') && data.clientPhone) $('client-phone').value = data.clientPhone;
    if ($('location') && data.location) $('location').value = data.location;
    if ($('project-type') && data.projectType) $('project-type').value = data.projectType;
    if ($('backup') && data.backupHours) $('backup').value = data.backupHours;

    // 4. Restaurar seleções do cliente com validação contra produtos obsoletos
    if (data.userSelections) {
      userSelections.panelId = data.userSelections.panelId || null;
      userSelections.inverterId = data.userSelections.inverterId || null;
      userSelections.batteryId = data.userSelections.batteryId || null;

      const obsoletePanels = ['p_jinko_570', 'p_canadian_550', 'p_ja_580', 'p_longi_540'];
      if (obsoletePanels.includes(userSelections.panelId)) {
        userSelections.panelId = 'p_jinko_tiger_neo_600_bdv';
      }
      const obsoleteInverters = ['inv_deye_5k', 'inv_deye_6k', 'inv_deye_8k', 'inv_deye_10k', 'inv_deye_12k', 'inv_growatt_5k', 'inv_victron_15k', 'inv_huawei_20k'];
      if (obsoleteInverters.includes(userSelections.inverterId)) {
        userSelections.inverterId = 'inv_deye_12k_3ph_lv';
      }
      const obsoleteBatteries = ['bat_deye_512', 'bat_pylon_48', 'bat_dyness_48', 'bat_deye_1024', 'bat_pylon_35k', 'bat_byd_10k', 'bat_tesla_14k'];
      if (obsoleteBatteries.includes(userSelections.batteryId)) {
        userSelections.batteryId = 'bat_deye_rw_m61_lv';
      }
    }

    // Retorna o passo salvo se houver aparelhos seleccionados
    if (chosen.size > 0 && typeof data.currentStep === 'number' && data.currentStep >= 0 && data.currentStep <= 2) {
      return data.currentStep;
    }
    return 0;
  } catch (e) {
    console.warn('Erro ao restaurar sessão anterior:', e);
    return 0;
  }
}

function resetSimulation() {
  if (chosen.size > 0 || ($('client-name') && $('client-name').value.trim())) {
    if (!confirm('Deseja iniciar uma Nova Simulação e limpar todos os aparelhos e dados preenchidos?')) {
      return;
    }
  }
  localStorage.removeItem(STORAGE_KEY_SESSION);
  chosen.clear();
  if ($('client-name')) $('client-name').value = '';
  if ($('client-phone')) $('client-phone').value = '';
  if ($('location')) $('location').value = '';
  if ($('project-type')) $('project-type').value = 'Residência';
  if ($('backup')) $('backup').value = '4';
  userSelections.panelId = null;
  userSelections.inverterId = null;
  userSelections.batteryId = null;
  currentStep = 0;
  render();
  go(0);
}

// Estado da Aplicação
const chosen = new Map();
let currentStep = 0;
let searchQuery = '';

// Utilitários de Selecção e Formatação
const $ = (id) => document.getElementById(id);
const fmt = (n) => new Intl.NumberFormat('pt-MZ', { maximumFractionDigits: 1 }).format(n);
const money = (n) => new Intl.NumberFormat('pt-MZ', { maximumFractionDigits: 0 }).format(n) + ' MT';

/**
 * Formata capacidade elétrica
 */
function formatPower(w) {
  if (w >= 1000) {
    const kw = (w / 1000).toFixed(1).replace('.0', '').replace('.', ',');
    return `${w} W (${kw} kW)`;
  }
  return `${w} W`;
}

/**
 * Normaliza strings para busca sem acentos
 */
function normalizeStr(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Alterna a selecção de um item do catálogo (Toggle)
 */
function toggleItem(i) {
  if (chosen.has(i)) {
    chosen.delete(i);
  } else {
    const item = catalog[i];
    chosen.set(i, {
      iconKey: item[0],
      name: item[1],
      w: item[2],
      h: item[3],
      f: item[4],
      q: 1,
      essential: item[5] !== undefined ? Boolean(item[5]) : true
    });
  }
  hideValidationError(0);
  render();
}

/**
 * Altera propriedades de uma carga
 */
function change(i, key, value) {
  const item = chosen.get(i);
  if (!item) return;

  if (key === 'essential') {
    item[key] = Boolean(value);
  } else {
    const num = Number(value) || 0;
    if (key === 'q') item.q = Math.max(1, Math.min(100, Math.round(num)));
    else if (key === 'h') item.h = Math.max(0.1, Math.min(24, num));
    else if (key === 'w') item.w = Math.max(1, Math.min(50000, num));
  }
  render();
}

/**
 * Remove um aparelho da lista
 */
function remove(i) {
  chosen.delete(i);
  render();
}

/**
 * Filtro de pesquisa no catálogo
 */
function filterCatalog(query) {
  searchQuery = normalizeStr(query);
  const clearBtn = $('search-clear-btn');
  if (clearBtn) {
    clearBtn.hidden = !query || query.trim() === '';
  }
  renderCatalog();
}

/**
 * Limpa o campo de pesquisa
 */
function clearSearch() {
  const input = $('catalog-search');
  if (input) {
    input.value = '';
    filterCatalog('');
    input.focus();
  }
}

/**
 * Renderiza os cards compactos do catálogo
 */
function renderCatalog() {
  const grid = $('catalog');
  grid.replaceChildren();

  let visibleCount = 0;

  catalog.forEach((item, i) => {
    const normName = normalizeStr(item[1]);
    const matches = !searchQuery || normName.includes(searchQuery);

    if (matches) {
      visibleCount++;
      const isSelected = chosen.has(i);

      const tile = document.createElement('div');
      tile.className = 'tile' + (isSelected ? ' selected' : '');
      tile.setAttribute('role', 'button');
      tile.setAttribute('tabindex', '0');
      tile.setAttribute('aria-pressed', isSelected ? 'true' : 'false');

      const iconBox = document.createElement('div');
      iconBox.className = 'tile-icon-box';
      iconBox.innerHTML = ICONS[item[0]] || ICONS.custom;

      const info = document.createElement('div');
      info.className = 'tile-info';

      const title = document.createElement('span');
      title.className = 'tile-name';
      title.textContent = item[1];
      title.title = item[1];

      const cap = document.createElement('span');
      cap.className = 'tile-cap';
      cap.textContent = formatPower(item[2]);

      info.append(title, cap);

      const checkIndicator = document.createElement('div');
      checkIndicator.className = 'tile-check-indicator';
      checkIndicator.innerHTML = ICONS.check;

      tile.append(iconBox, info, checkIndicator);

      tile.onclick = () => toggleItem(i);
      tile.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleItem(i);
        }
      };

      grid.append(tile);
    }
  });

  const countBadge = $('catalog-count');
  if (countBadge) {
    countBadge.textContent = `${visibleCount} ${visibleCount === 1 ? 'aparelho' : 'aparelhos'}`;
  }

  if (visibleCount === 0) {
    const empty = document.createElement('div');
    empty.style.gridColumn = '1 / -1';
    empty.style.textAlign = 'center';
    empty.style.padding = '20px 14px';
    empty.style.background = 'var(--surface-alt)';
    empty.style.borderRadius = 'var(--radius-md)';
    empty.style.border = '1px dashed var(--line)';
    empty.style.fontSize = '12.5px';
    empty.style.color = 'var(--muted)';

    const rawSearch = ($('catalog-search') && $('catalog-search').value.trim()) || searchQuery;
    const msg = document.createElement('div');
    msg.innerHTML = `Nenhum equipamento padrão encontrado com o termo "<strong>${escapeHtml(rawSearch)}</strong>".`;

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn btn-secondary btn-sm';
    addBtn.style.marginTop = '8px';
    addBtn.textContent = `+ Adicionar "${rawSearch}" como aparelho personalizado`;
    addBtn.addEventListener('click', () => openCustomModal(rawSearch));

    empty.append(msg, addBtn);
    grid.append(empty);
  }
}

/**
 * Renderiza a lista de aparelhos seleccionados
 */
function renderLoadsList() {
  const loadsContainer = $('loads');
  loadsContainer.replaceChildren();

  const countBadge = $('loads-count-badge');
  if (countBadge) {
    countBadge.textContent = chosen.size;
  }

  if (chosen.size === 0) {
    const placeholder = document.createElement('div');
    placeholder.style.padding = '14px 12px';
    placeholder.style.textAlign = 'center';
    placeholder.style.color = 'var(--muted)';
    placeholder.style.fontSize = '12px';
    placeholder.style.background = 'var(--surface-alt)';
    placeholder.style.borderRadius = 'var(--radius-md)';
    placeholder.style.border = '1px dashed var(--line)';
    placeholder.textContent = 'Nenhum aparelho seleccionado. Clique nos cartões acima para incluir no dimensionamento.';
    loadsContainer.append(placeholder);
    return;
  }

  chosen.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'load-item';

    const header = document.createElement('div');
    header.className = 'load-item-header';

    const titleContainer = document.createElement('div');
    titleContainer.className = 'load-item-title';

    const iconSpan = document.createElement('span');
    iconSpan.className = 'load-icon';
    iconSpan.innerHTML = ICONS[item.iconKey] || ICONS.custom;

    const nameText = document.createElement('span');
    nameText.textContent = item.name;

    titleContainer.append(iconSpan, nameText);

    const btnRem = document.createElement('button');
    btnRem.type = 'button';
    btnRem.className = 'btn-remove';
    btnRem.innerHTML = `${ICONS.trash} Remover`;
    btnRem.onclick = () => remove(i);

    header.append(titleContainer, btnRem);
    row.append(header);

    const fields = document.createElement('div');
    fields.className = 'fields-grid';

    const fieldConfig = [
      ['q', 'Quantidade', 1, 100, 1],
      ['w', 'Potência (W)', 1, 50000, 1],
      ['h', 'Horas / dia', 0.1, 24, 0.25]
    ];

    fieldConfig.forEach(([key, labelText, min, max, step]) => {
      const label = document.createElement('label');
      label.textContent = labelText;

      const input = document.createElement('input');
      input.type = 'number';
      input.min = min;
      input.max = max;
      input.step = step;
      input.value = item[key];
      input.onchange = () => change(i, key, input.value);

      label.append(input);
      fields.append(label);
    });

    row.append(fields);

    const checkLabel = document.createElement('label');
    checkLabel.className = 'checkbox-label';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.essential;
    checkbox.onchange = () => change(i, 'essential', checkbox.checked);

    checkLabel.append(checkbox, document.createTextNode(' Manter ligado com bateria durante cortes da EDM'));
    row.append(checkLabel);

    if (item.f < 1) {
      const note = document.createElement('div');
      note.className = 'small';
      note.style.marginTop = '4px';
      note.style.color = '#8a5b28';
      note.textContent = 'ℹ Refrigeração: cálculo considera ciclo de compressor de 35%.';
      row.append(note);
    }

    loadsContainer.append(row);
  });
}

/**
 * Renderiza interface completa
 */
function render() {
  renderCatalog();
  renderLoadsList();
  update();
}

/**
 * Totais técnicos de cargas
 */
function totals() {
  let e = 0; // Consumo diário total (kWh/dia)
  let p = 0; // Potência nominal ligada (kW)
  let b = 0; // Cargas essenciais médias por hora (kW)
  let q = 0; // Quantidade de aparelhos
  let essentialCount = 0;

  chosen.forEach((x) => {
    const energy = (x.q * x.w * x.h * x.f) / 1000;
    e += energy;
    p += (x.q * x.w) / 1000;
    if (x.essential) {
      b += energy / 24;
      essentialCount += x.q;
    }
    q += x.q;
  });

  const batteryCoveragePercent = q > 0 ? Math.round((essentialCount / q) * 100) : 0;

  return { e, p, b, q, essentialCount, batteryCoveragePercent };
}

/**
 * Recupera o modelo de painel selecionado pelo cliente
 */
function getSelectedPanel() {
  const list = adminProducts.panels;
  if (!list || list.length === 0) {
    return {
      id: 'p_jinko_tiger_neo_600_bdv',
      name: 'Jinko Tiger Neo N-Type Bifacial 600W (JKM600N-66HL4M-BDV)',
      power: 600,
      price: 8000,
      extra: 'Bifacial Vidro Duplo (Dual Glass)'
    };
  }
  return list.find((p) => p.id === userSelections.panelId) || list[0];
}

/**
 * Encontra o inversor tecnicamente recomendado (mínimo que cobre a carga com folga)
 */
function getRecommendedInverter(reqKw) {
  const list = adminProducts.inverters;
  if (!list || list.length === 0) {
    return {
      id: 'inv_deye_5k_1ph',
      name: 'Deye Híbrido 5 kW (1ph · LV-48)',
      power: 5,
      price: 90000,
      voltageType: 'LV',
      phase: '1ph'
    };
  }
  const sorted = [...list].sort((a, b) => a.power - b.power);
  const found = sorted.find((inv) => inv.power >= reqKw);
  return found || sorted[sorted.length - 1];
}

/**
 * Recupera o inversor selecionado pelo cliente ou o recomendado
 */
function getSelectedInverter(reqKw) {
  const list = adminProducts.inverters;
  if (!list || list.length === 0) {
    return {
      id: 'inv_deye_5k_1ph',
      name: 'Deye Híbrido 5 kW (1ph · LV-48)',
      power: 5,
      price: 90000,
      voltageType: 'LV',
      phase: '1ph'
    };
  }
  if (userSelections.inverterId) {
    const found = list.find((inv) => inv.id === userSelections.inverterId);
    if (found) return found;
  }
  return getRecommendedInverter(reqKw);
}

/**
 * Recupera o modelo de bateria selecionado pelo cliente com garantia de compatibilidade com o inversor
 */
function getSelectedBattery(selectedInverter) {
  const list = adminProducts.batteries;
  if (!list || list.length === 0) {
    return {
      id: 'bat_deye_rw_m61_lv',
      name: 'DEYE Low Voltage Lithium Battery 5.12 kWh (51.2V)',
      capacity: 5.12,
      price: 98000,
      voltageType: 'LV'
    };
  }

  const targetVoltage = (selectedInverter && selectedInverter.voltageType) ? selectedInverter.voltageType : 'LV';
  const compatList = list.filter((b) => (b.voltageType || 'LV') === targetVoltage);
  const effectivePool = compatList.length > 0 ? compatList : list;

  if (userSelections.batteryId) {
    const found = effectivePool.find((b) => b.id === userSelections.batteryId);
    if (found) return found;
  }

  // Se a bateria anteriormente selecionada for incompatível com o inversor, troca para a primeira compatível
  const defaultCompat = effectivePool[0];
  userSelections.batteryId = defaultCompat.id;
  return defaultCompat;
}

function getBackupHours() {
  const el = $('backup');
  if (!el || el.value === '' || el.value === null || el.value === undefined) return 4;
  const val = Number(el.value);
  return Number.isFinite(val) && val >= 0 ? val : 4;
}

/**
 * Dimensionamento Solar e Orçamento Ilustrativo Técnico Dinâmico
 */
function calculate() {
  const t = totals();

  // Premissas técnicas Moçambique:
  // 4.8 HSP (Horas de Sol Pleno diárias)
  // Rendimento global do sistema (PR): 76%
  const hsp = 4.8;
  const pr = 0.76;

  // 1. Módulos Fotovoltaicos:
  const selectedPanel = getSelectedPanel();
  const panelKw = (selectedPanel.power || 570) / 1000;
  const dailyGenPerPanel = panelKw * hsp * pr;
  const panels = t.e > 0 ? Math.ceil(t.e / dailyGenPerPanel) : 0;
  const pv = panels * panelKw;
  const panelsCost = panels * (selectedPanel.price || 7500);

  // 2. Inversor Híbrido:
  // Dimensionado com 25% de margem para picos de motores
  const requiredInverterKw = t.p * 1.25;
  const selectedInverter = getSelectedInverter(requiredInverterKw);
  const invUnitPower = selectedInverter.power || 5;
  const invQty = t.p > 0 ? Math.max(1, Math.ceil(requiredInverterKw / invUnitPower)) : 0;
  const invPowerTotal = invQty * invUnitPower;
  const invCost = invQty * (selectedInverter.price || 90000);

  // 3. Banco de Baterias LiFePO4 (Compatível com o Inversor Selecionado):
  const backupHours = getBackupHours();
  const selectedBattery = getSelectedBattery(selectedInverter);
  const batUnitCap = selectedBattery.capacity || 5.12;
  const requiredStorage = t.b * backupHours;
  const batteries = (t.b > 0 && backupHours > 0)
    ? Math.ceil(requiredStorage / (0.90 * 0.92) / batUnitCap)
    : 0;
  const batKwhTotal = batteries * batUnitCap;
  const batCost = batteries * (selectedBattery.price || 98000);

  // 4. Custos e Componentes Orçados:
  const items = [];
  if (panels > 0) {
    items.push([`Módulos Fotovoltaicos · ${panels} × ${selectedPanel.name}`, panelsCost]);
  } else {
    items.push([`Módulos Fotovoltaicos · Nenhum módulo seleccionado`, 0]);
  }

  if (invQty > 0) {
    items.push([`Inversor Híbrido Inteligente · ${invQty} × ${selectedInverter.name}`, invCost]);
  } else {
    items.push([`Inversor Híbrido · Nenhum inversor seleccionado`, 0]);
  }

  if (batteries > 0) {
    items.push([`Banco de Armazenamento BESS · ${batteries} × ${selectedBattery.name}`, batCost]);
  } else {
    items.push([`Banco de Baterias · Sem acumuladores (Apenas Solar Direto)`, 0]);
  }

  const equipCost = panelsCost + invCost + batCost;
  const bosCost = equipCost > 0 ? equipCost * 0.22 : 0; // Estruturas alumínio, cablagem CC/CA e proteções DPS
  const installCost = equipCost > 0 ? (equipCost + bosCost) * 0.12 : 0; // Engenharia, montagem, parametrização e comissionamento

  items.push(
    ['Estruturas de fixação em alumínio, cablagem e protecções CC/CA', bosCost],
    ['Engenharia, instalação, parametrização e comissionamento', installCost]
  );

  const total = equipCost + bosCost + installCost;
  const monthlyGenKwh = Math.round(pv * hsp * pr * 30);
  const monthlySavingsMzn = Math.round(monthlyGenKwh * 10.5); // Tarifa média de energia EDM Moçambique ~10.5 MT/kWh
  const co2AvoidedTonYear = Number(((monthlyGenKwh * 12 * 0.82) / 1000).toFixed(1)); // Fator de emissão da rede ~0.82 kg CO2/kWh

  return {
    ...t,
    panels,
    inv: invPowerTotal,
    invQty,
    batteries,
    pv,
    bat: batKwhTotal,
    selectedPanel,
    selectedInverter,
    selectedBattery,
    items,
    total,
    monthlyGenKwh,
    monthlySavingsMzn,
    co2AvoidedTonYear,
    backupHours
  };
}

/**
 * Atualiza dropdowns de equipamentos cadastrados na Etapa 3 com optgroups organizados
 */
function populateProductSelectors(r) {
  const panelSel = $('select-panel');
  const invSel = $('select-inverter');
  const batSel = $('select-battery');

  if (!panelSel || !invSel || !batSel) return;

  // 1. Painéis - Gama Oficial Jinko Tiger Neo N-Type Bifacial (Dual Glass) (Sem exibição de preços individuais)
  panelSel.replaceChildren();

  const panelGroups = [
    {
      label: '✨ Módulos N-Type Bifaciais Dual Glass — Jinko Tiger Neo (600W a 625W)',
      items: adminProducts.panels
    }
  ];

  panelGroups.forEach((grp) => {
    if (grp.items.length === 0) return;
    const optgroup = document.createElement('optgroup');
    optgroup.label = grp.label;

    grp.items.forEach((p) => {
      const opt = document.createElement('option');
      opt.value = p.id;
      // Oculta o preço no produto, exibindo apenas especificações técnicas
      opt.textContent = `${p.name} · ${p.power} Wp`;
      opt.dataset.image = p.image || getProductImage('panels', p);
      if (p.id === r.selectedPanel.id) opt.selected = true;
      optgroup.append(opt);
    });

    panelSel.append(optgroup);
  });

  if ($('img-panel-thumb')) {
    $('img-panel-thumb').src = r.selectedPanel.image || getProductImage('panels', r.selectedPanel);
  }
  if ($('badge-panel-qty')) $('badge-panel-qty').textContent = `${r.panels} un.`;
  if ($('badge-panel-tech')) {
    const isBifacial = r.selectedPanel.panelType === 'bifacial_dual_glass' || (r.selectedPanel.extra || '').toLowerCase().includes('bifacial') || (r.selectedPanel.name || '').toLowerCase().includes('bifacial');
    $('badge-panel-tech').textContent = isBifacial ? 'N-Type Dual Glass' : 'Tier 1 Mono';
    $('badge-panel-tech').className = 'tech-pill' + (isBifacial ? ' hv' : '');
  }

  // 2. Inversores - Agrupados por Tensão e Fases (LV 1ph, Split-Phase, LV 3ph, HV 900V All-in-One) (Sem preços no produto)
  invSel.replaceChildren();

  const invGroups = [
    { label: '🔹 Inversores Baixa Tensão (LV ~48V) — 1ph Monofásicos', items: adminProducts.inverters.filter((i) => (i.voltageType || 'LV') === 'LV' && i.phase === '1ph') },
    { label: '🔹 Inversores Baixa Tensão (LV ~48V) — Split-Phase (Bifásicos)', items: adminProducts.inverters.filter((i) => (i.voltageType || 'LV') === 'LV' && i.phase === 'split') },
    { label: '🔹 Inversores Baixa Tensão (LV ~48V) — 3ph Trifásicos', items: adminProducts.inverters.filter((i) => (i.voltageType || 'LV') === 'LV' && i.phase === '3ph') },
    { label: '⚡ Inversores & Controladores Alta Tensão (HV ~900V) — Sigenergy All-in-One (3ph)', items: adminProducts.inverters.filter((i) => i.voltageType === 'HV') },
    { label: '⚡ Outros Inversores Híbridos', items: adminProducts.inverters.filter((i) => !((i.voltageType || 'LV') === 'LV' && ['1ph', 'split', '3ph'].includes(i.phase)) && i.voltageType !== 'HV') }
  ];

  invGroups.forEach((grp) => {
    if (grp.items.length === 0) return;
    const optgroup = document.createElement('optgroup');
    optgroup.label = grp.label;

    grp.items.forEach((inv) => {
      const opt = document.createElement('option');
      opt.value = inv.id;
      // Oculta o preço no produto
      opt.textContent = `${inv.name} · ${inv.power} kW`;
      opt.dataset.image = inv.image || getProductImage('inverters', inv);
      if (inv.id === r.selectedInverter.id) opt.selected = true;
      optgroup.append(opt);
    });

    invSel.append(optgroup);
  });

  if ($('img-inv-thumb')) {
    $('img-inv-thumb').src = r.selectedInverter.image || getProductImage('inverters', r.selectedInverter);
  }
  if ($('badge-inverter-qty')) $('badge-inverter-qty').textContent = `${r.invQty} un.`;
  if ($('badge-inv-type')) {
    const badgeEl = $('badge-inv-type');
    if (r.selectedInverter.voltageType === 'HV') {
      badgeEl.textContent = 'HV · 900V · 3ph';
      badgeEl.className = 'tech-pill hv';
    } else {
      const ph = r.selectedInverter.phase === '1ph' ? '1ph' : (r.selectedInverter.phase === 'split' ? 'Split' : '3ph');
      badgeEl.textContent = `LV · 48V · ${ph}`;
      badgeEl.className = 'tech-pill';
    }
  }

  // 3. Baterias - Agrupadas por Tensão e Linha Modular (LV 51.2V, HV Sigenergy, HV Livoltek BHF) (Sem preços no produto)
  batSel.replaceChildren();

  const batGroups = [
    { label: '🔹 Baterias Baixa Tensão (LV ~51.2V / 48V)', items: adminProducts.batteries.filter((b) => (b.voltageType || 'LV') === 'LV') },
    { label: '⚡ Baterias Alta Tensão (HV) — Linha Modular Sigenergy (300-900V)', items: adminProducts.batteries.filter((b) => b.voltageType === 'HV' && (b.subcategory === 'sigen_hv' || (b.brand || '').toLowerCase().includes('sigen'))) },
    { label: '⚡ Baterias Alta Tensão (HV) — Linha Torre Livoltek BHF (10 a 61 kWh)', items: adminProducts.batteries.filter((b) => b.voltageType === 'HV' && (b.subcategory === 'livoltek_bhf' || (b.brand || '').toLowerCase().includes('livoltek'))) },
    { label: '⚡ Baterias Alta Tensão (HV) — Outras Linhas', items: adminProducts.batteries.filter((b) => b.voltageType === 'HV' && b.subcategory !== 'sigen_hv' && b.subcategory !== 'livoltek_bhf' && !(b.brand || '').toLowerCase().includes('sigen') && !(b.brand || '').toLowerCase().includes('livoltek')) }
  ];

  batGroups.forEach((grp) => {
    if (grp.items.length === 0) return;
    const optgroup = document.createElement('optgroup');
    optgroup.label = grp.label;

    grp.items.forEach((b) => {
      const opt = document.createElement('option');
      opt.value = b.id;
      // Oculta o preço no produto
      opt.textContent = `${b.name} · ${b.capacity} kWh`;
      opt.dataset.image = b.image || getProductImage('batteries', b);
      if (b.id === r.selectedBattery.id) opt.selected = true;
      optgroup.append(opt);
    });

    batSel.append(optgroup);
  });

  if ($('img-bat-thumb')) {
    $('img-bat-thumb').src = r.selectedBattery.image || getProductImage('batteries', r.selectedBattery);
  }
  if ($('badge-battery-qty')) $('badge-battery-qty').textContent = `${r.batteries} un.`;
  if ($('badge-bat-compat')) {
    const badgeBat = $('badge-bat-compat');
    if (r.selectedInverter.voltageType === 'HV') {
      badgeBat.textContent = 'Compatível HV (All-in-One)';
      badgeBat.className = 'tech-pill compat';
    } else {
      badgeBat.textContent = 'Compatível LV (48V)';
      badgeBat.className = 'tech-pill compat';
    }
  }

  // Sincroniza e renderiza os seletores visuais modernos com excelente padding e acabamento
  syncCustomDropdown('select-panel', 'panel');
  syncCustomDropdown('select-inverter', 'inverter');
  syncCustomDropdown('select-battery', 'battery');
}

/**
 * Transforma e sincroniza um <select> nativo num seletor visual moderno com bom padding
 */
function syncCustomDropdown(selectId, category) {
  const sel = $(selectId);
  if (!sel) return;

  // Oculta o select nativo visualmente, mantendo a árvore e sincronização
  sel.style.display = 'none';

  let wrapper = sel.parentNode.querySelector(`.custom-select-wrapper[data-for="${selectId}"]`);
  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';
    wrapper.setAttribute('data-for', selectId);

    wrapper.innerHTML = `
      <button type="button" class="custom-select-trigger" aria-haspopup="listbox" aria-expanded="false">
        <span class="custom-select-label">-</span>
        <svg class="custom-select-chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <div class="custom-select-menu" role="listbox" hidden></div>
    `;

    sel.parentNode.insertBefore(wrapper, sel.nextSibling);

    const trigger = wrapper.querySelector('.custom-select-trigger');
    const menu = wrapper.querySelector('.custom-select-menu');

    menu.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isCurrentlyOpen = !menu.hidden;
      closeAllCustomDropdowns();
      if (!isCurrentlyOpen) {
        menu.hidden = false;
        trigger.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  }

  const triggerLabel = wrapper.querySelector('.custom-select-label');
  const menu = wrapper.querySelector('.custom-select-menu');

  // Atualiza label do trigger com o item atualmente selecionado
  const selectedOpt = sel.options[sel.selectedIndex] || sel.options[0];
  if (selectedOpt) {
    triggerLabel.textContent = selectedOpt.textContent;
  }

  // Reconstrói os itens do menu a partir dos optgroups e options
  menu.replaceChildren();

  Array.from(sel.children).forEach((node) => {
    if (node.tagName.toLowerCase() === 'optgroup') {
      const header = document.createElement('div');
      header.className = 'custom-select-group-header';
      header.textContent = node.label;
      menu.append(header);

      Array.from(node.children).forEach((opt) => {
        addCustomOptionItem(menu, sel, opt, category, triggerLabel);
      });
    } else if (node.tagName.toLowerCase() === 'option') {
      addCustomOptionItem(menu, sel, node, category, triggerLabel);
    }
  });
}

function addCustomOptionItem(menu, sel, opt, category, triggerLabel) {
  const item = document.createElement('div');
  const isSelected = opt.selected;
  item.className = 'custom-select-item' + (isSelected ? ' selected' : '');
  item.setAttribute('data-value', opt.value);

  // Obtém imagem do produto via dataset do option ou busca no catálogo adminProducts
  let imgUrl = (opt.dataset && opt.dataset.image) || '';
  if (!imgUrl) {
    const catPlural = category === 'panel' ? 'panels' : (category === 'inverter' ? 'inverters' : (category === 'battery' ? 'batteries' : category));
    const prodList = (adminProducts && adminProducts[catPlural]) || [];
    const prod = prodList.find((p) => p.id === opt.value);
    if (prod) {
      imgUrl = prod.image || getProductImage(catPlural, prod);
    }
  }

  const cleanImg = imgUrl ? sanitizeImageUrl(imgUrl, '') : '';
  const thumbHtml = cleanImg ? `
    <div class="custom-select-item-thumb">
      <img src="${cleanImg}" alt="" loading="lazy">
    </div>
  ` : '';

  item.innerHTML = `
    ${thumbHtml}
    <span class="custom-select-item-text">${escapeHtml(opt.textContent)}</span>
    ${isSelected ? '<svg class="custom-select-item-check" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
  `;

  item.addEventListener('click', (e) => {
    e.stopPropagation();
    sel.value = opt.value;
    triggerLabel.textContent = opt.textContent;
    closeAllCustomDropdowns();
    onSelectProduct(category, opt.value);
  });

  menu.append(item);
}

function closeAllCustomDropdowns() {
  document.querySelectorAll('.custom-select-menu').forEach((m) => {
    m.hidden = true;
  });
  document.querySelectorAll('.custom-select-trigger').forEach((t) => {
    t.classList.remove('active');
    t.setAttribute('aria-expanded', 'false');
  });
}

// Fecha menus ao clicar fora ou ao pressionar Escape
window.addEventListener('click', () => {
  closeAllCustomDropdowns();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllCustomDropdowns();
  }
});

/**
 * Callback quando o cliente altera um produto no dropdown da Etapa 3
 */
function onSelectProduct(category, productId) {
  if (category === 'panel') {
    userSelections.panelId = productId;
  } else if (category === 'inverter') {
    userSelections.inverterId = productId;
    
    // Compatibilidade automática: ajusta bateria para a tensão correspondente do inversor
    const chosenInv = adminProducts.inverters.find((i) => i.id === productId);
    if (chosenInv) {
      const currentBat = adminProducts.batteries.find((b) => b.id === userSelections.batteryId);
      if (!currentBat || currentBat.voltageType !== chosenInv.voltageType) {
        const compatBat = adminProducts.batteries.find((b) => b.voltageType === chosenInv.voltageType);
        if (compatBat) userSelections.batteryId = compatBat.id;
      }
    }
  } else if (category === 'battery') {
    userSelections.batteryId = productId;
  }
  update();
}

/**
 * Actualiza contadores, painel lateral ao vivo e barra mobile em tempo real
 */
function update() {
  const r = calculate();

  // Métricas básicas de carga
  $('count').textContent = r.q;
  $('energy').textContent = fmt(r.e) + ' kWh';
  $('power').textContent = fmt(r.p) + ' kW';

  // Preview dos dados do cliente
  const clientName = ($('client-name') && $('client-name').value.trim()) || 'A definir';
  const location = ($('location') && $('location').value.trim()) || 'Moçambique';
  const projType = ($('project-type') && $('project-type').value) || 'Residência';

  if ($('sum-client-name')) $('sum-client-name').textContent = clientName;
  if ($('sum-location')) $('sum-location').textContent = location;
  if ($('sum-type')) $('sum-type').textContent = projType;

  // Apenas exibe o orçamento final e equipamentos definitivos na Etapa 3 (currentStep === 2)
  const isFinalStep = (currentStep === 2);

  // Painel de Engenharia ao Vivo (Live Spec Box)
  if ($('side-pv')) {
    if (isFinalStep) {
      $('side-pv').textContent = r.pv > 0 ? `${fmt(r.pv)} kWp (${r.panels} painéis)` : '0 kWp (0 painéis)';
    } else {
      $('side-pv').textContent = r.q > 0 ? `${r.panels} painéis (estimado)` : 'Defina na Etapa 01';
    }
  }
  if ($('side-inv')) {
    if (isFinalStep) {
      $('side-inv').textContent = `${r.inv} kW Híbrido`;
    } else {
      $('side-inv').textContent = r.p > 0 ? `~${r.inv} kW (estimado)` : 'Defina na Etapa 01';
    }
  }
  if ($('side-bat')) {
    if (isFinalStep) {
      $('side-bat').textContent = r.batteries > 0 ? `${fmt(r.bat)} kWh (${r.batteries} mod.)` : 'Sem baterias (Autoconsumo)';
    } else {
      $('side-bat').textContent = 'Defina no Passo 02';
    }
  }
  if ($('side-gen-monthly')) {
    if (isFinalStep) {
      $('side-gen-monthly').textContent = `~${fmt(r.monthlyGenKwh)} kWh/mês`;
    } else {
      $('side-gen-monthly').textContent = '0 kWh/mês';
    }
  }
  if ($('side-savings-monthly')) {
    $('side-savings-monthly').textContent = isFinalStep ? `~${money(r.monthlySavingsMzn)}/mês` : '0 MT/mês';
  }
  if ($('side-co2-annual')) {
    $('side-co2-annual').textContent = isFinalStep ? `${r.co2AvoidedTonYear} ton CO₂/ano` : '0 ton/ano';
  }

  // Destaque do Orçamento em Tempo Real:
  // IMPORTANTE: Mostra zeros nas Etapas 01 e 02 (0 MT); mostra os valores reais na Etapa 03!
  const sideTotalEl = $('side-total-cost');
  const sideTermsEl = document.querySelector('.summary-budget-highlight .budget-terms');
  const mobTotalEl = $('mob-total-cost');
  const mobPvInvEl = $('mob-pv-inv');

  const subtotal = r.total;
  const iva = Math.round(subtotal * 0.16);
  const totalComIva = subtotal + iva;

  if (isFinalStep) {
    // Na Etapa 3: Exibe o valor real exato calculado com IVA incluído
    const totalComIvaText = money(totalComIva);
    if (sideTotalEl) {
      sideTotalEl.textContent = totalComIvaText;
      sideTotalEl.style.fontSize = '24px';
      sideTotalEl.style.color = '#ffffff';
    }
    if ($('side-subtotal')) $('side-subtotal').textContent = money(subtotal);
    if ($('side-iva')) $('side-iva').textContent = money(iva);
    if ($('side-total-iva')) $('side-total-iva').textContent = totalComIvaText;

    if (sideTermsEl) {
      sideTermsEl.textContent = 'Estimativa preliminar (±20%) · Inclui 16% de IVA';
    }
    if (mobTotalEl) {
      mobTotalEl.textContent = totalComIvaText;
    }
    if (mobPvInvEl) {
      mobPvInvEl.textContent = `${fmt(r.pv)} kWp · ${r.inv} kW · IVA inc.`;
    }
  } else {
    // Nas Etapas 01 e 02: Mostra zeros, e não palavras!
    if (sideTotalEl) {
      sideTotalEl.textContent = '0 MT';
      sideTotalEl.style.fontSize = '24px';
      sideTotalEl.style.color = '#ffffff';
    }
    if ($('side-subtotal')) $('side-subtotal').textContent = '0 MT';
    if ($('side-iva')) $('side-iva').textContent = '0 MT';
    if ($('side-total-iva')) $('side-total-iva').textContent = '0 MT';

    if (sideTermsEl) {
      sideTermsEl.textContent = 'Estimativa preliminar (±20%) · Inclui 16% de IVA';
    }
    if (mobTotalEl) {
      mobTotalEl.textContent = '0 MT';
    }
    if (mobPvInvEl) {
      mobPvInvEl.textContent = `${r.q} aparelhos seleccionados`;
    }
  }

  // Barra de Cargas de Bateria
  if ($('side-bat-coverage')) {
    $('side-bat-coverage').textContent = `${r.batteryCoveragePercent}% das cargas`;
  }
  if ($('side-bat-fill')) {
    $('side-bat-fill').style.width = `${r.batteryCoveragePercent}%`;
  }

  if (isFinalStep) {
    populateProductSelectors(r);
    result(r);
  }

  // Salva o estado atual da simulação para não perder dados ao recarregar a página
  saveSimulationSession();
}

/**
 * Validação dos campos do Passo 1
 */
function validateStep1Fields() {
  const nameInput = $('client-name');
  const phoneInput = $('client-phone');
  const locInput = $('location');

  let valid = true;

  if (nameInput) {
    const isNameOk = nameInput.value.trim().length >= 2;
    nameInput.classList.toggle('has-error', !isNameOk);
    $('client-name-error').hidden = isNameOk;
    if (!isNameOk) valid = false;
  }

  if (phoneInput) {
    const isPhoneOk = phoneInput.value.trim().length >= 5;
    phoneInput.classList.toggle('has-error', !isPhoneOk);
    $('client-phone-error').hidden = isPhoneOk;
    if (!isPhoneOk) valid = false;
  }

  if (locInput) {
    const isLocOk = locInput.value.trim().length >= 2;
    locInput.classList.toggle('has-error', !isLocOk);
    $('location-error').hidden = isLocOk;
    if (!isLocOk) valid = false;
  }

  if (valid) {
    hideValidationError(1);
  }
  update();
  return valid;
}

/**
 * Define cidade a partir dos botões chips
 */
function setLocation(cityName) {
  const locInput = $('location');
  if (locInput) {
    locInput.value = cityName;
    validateStep1Fields();
  }
}

/**
 * Rola até o painel lateral em telas móveis
 */
function toggleMobileSummaryModal() {
  const panel = document.querySelector('.summary-panel');
  if (panel) {
    panel.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Exibe banner de erro de validação
 */
function showValidationError(stepIndex, msg) {
  const banner = $('val-step' + stepIndex);
  const text = $('val-step' + stepIndex + '-text');
  if (banner && text) {
    text.textContent = msg;
    banner.hidden = false;
    banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/**
 * Esconde banner de erro
 */
function hideValidationError(stepIndex) {
  const banner = $('val-step' + stepIndex);
  if (banner) banner.hidden = true;
}

/**
 * Tentativa de navegação direta pelas abas superiores
 */
function tryGo(targetStep) {
  if (targetStep === currentStep) return;
  if (targetStep < currentStep) {
    go(targetStep);
    return;
  }
  if (currentStep === 0) {
    const t = totals();
    if (chosen.size === 0 || t.e <= 0 || t.p <= 0) {
      showValidationError(0, 'Seleccione pelo menos um aparelho antes de avançar.');
      return;
    }
    if (targetStep === 2) {
      if (!validateStep1Fields()) {
        go(1);
        showValidationError(1, 'Por favor, preencha os dados do cliente e localidade.');
        return;
      }
    }
  }
  if (currentStep === 1 && targetStep === 2) {
    if (!validateStep1Fields()) {
      showValidationError(1, 'Por favor, preencha os campos obrigatórios assinalados.');
      return;
    }
  }
  go(targetStep);
}

/**
 * Transição de passos com validação rigorosa
 */
function go(n) {
  const t = totals();

  if (currentStep === 0 && n > 0) {
    if (chosen.size === 0) {
      showValidationError(0, 'Por favor, seleccione pelo menos um aparelho no catálogo antes de continuar.');
      return;
    }
    if (t.e <= 0 || t.p <= 0) {
      showValidationError(0, 'Os aparelhos seleccionados devem ter potência e horas superiores a zero.');
      return;
    }
    hideValidationError(0);
  }

  if (currentStep === 1 && n === 2) {
    const ok = validateStep1Fields();
    if (!ok) {
      showValidationError(1, 'Por favor, preencha o Nome do Cliente, Contacto e Local do Projecto.');
      return;
    }
    hideValidationError(1);
  }

  currentStep = n;

  for (let i = 0; i < 3; i++) {
    const stepEl = $('step' + i);
    const pillEl = $('s' + i);
    const actionEl = $('actions-step' + i);
    if (stepEl) stepEl.hidden = i !== n;
    if (pillEl) pillEl.className = 'step-pill' + (i === n ? ' active' : '');
    if (actionEl) actionEl.style.display = i === n ? 'flex' : 'none';
  }

  update();

  const scrollArea = document.querySelector('.content-scroll');
  if (scrollArea) {
    scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function computeProposalCode(clientName, location, projType) {
  const year = new Date().getFullYear();
  const seed = `${clientName}|${location}|${projType}`;
  const hash = seed.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
  const codeSuffix = String((Math.abs(hash) % 9000) + 1000);
  return `LEC-${year}-${codeSuffix}`;
}

function buildQuoteSummaryText(r, clientName, clientPhone, location, projType, backupHours, subtotal, iva, totalComIva) {
  const loadsSummary = [...chosen.values()]
    .map((x) => `• ${x.q} × ${x.name}: ${x.w} W, ${x.h} h/dia (${x.essential && backupHours > 0 ? 'com bateria' : 'sem bateria'})`)
    .join('\n');

  return [
    '☀️ *PROPOSTA SOLAR PRELIMINAR — LECASU*',
    '------------------------------------------',
    `👤 *Cliente:* ${clientName}`,
    `📱 *Contacto:* ${clientPhone}`,
    `📍 *Local:* ${location}`,
    `🏢 *Tipo:* ${projType}`,
    `⏱️ *Autonomia:* ${backupHours > 0 ? `${backupHours} horas em corte da EDM` : 'Sem baterias (Solar Direto / Autoconsumo)'}`,
    '',
    '⚡ *EQUIPAMENTOS SELECIONADOS NO CATÁLOGO:*',
    `• Painéis Solares: ${r.panels} × ${r.selectedPanel.name} (${fmt(r.pv)} kWp)`,
    `• Inversor Híbrido: ${r.invQty} × ${r.selectedInverter.name} (${r.inv} kW)`,
    `• Baterias LiFePO4: ${r.batteries > 0 ? `${r.batteries} × ${r.selectedBattery.name} (${fmt(r.bat)} kWh)` : 'Sem acumuladores (Solar Direto)'}`,
    `• Consumo Diário Estimado: ${fmt(r.e)} kWh/dia`,
    `• Potência Total Ligada: ${fmt(r.p)} kW`,
    '',
    `🌱 *Geração Estimada:* ~${fmt(r.monthlyGenKwh)} kWh/mês`,
    `💡 *Poupança Est. EDM:* ~${money(r.monthlySavingsMzn)}/mês (~${money(r.monthlySavingsMzn * 12)}/ano)`,
    `🌍 *Redução de CO₂:* ~${r.co2AvoidedTonYear} ton CO₂/ano`,
    '',
    `💰 *Subtotal (Sem IVA):* ${money(subtotal)}`,
    `🏛️ *IVA Legal (16%):* ${money(iva)}`,
    `✨ *INVESTIMENTO TOTAL (Com IVA 16%):* ${money(totalComIva)}`,
    '',
    '📋 *Cargas Seleccionadas:*',
    loadsSummary,
    '',
    'LECASU — Energy & Engineering Solutions · Matola-Rio · info@lecasu.co.mz'
  ].join('\n');
}

function submitQuoteToBackend(channel) {
  try {
    const r = calculate();
    const clientName = ($('client-name') && $('client-name').value.trim()) || 'Cliente LECASU';
    const clientPhone = ($('client-phone') && $('client-phone').value.trim()) || '';
    const location = ($('location') && $('location').value.trim()) || 'Moçambique';
    const projType = ($('project-type') && $('project-type').value) || 'Residência';
    const backupHours = typeof r.backupHours === 'number' ? r.backupHours : getBackupHours();
    const totalWithIvaMzn = r.total + Math.round(r.total * 0.16);

    fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        code: computeProposalCode(clientName, location, projType),
        clientName,
        clientPhone,
        location,
        projectType: projType,
        backupHours,
        pvKwp: Number(r.pv.toFixed(2)),
        invKw: Number(r.inv.toFixed(2)),
        batKwh: Number(r.bat.toFixed(2)),
        totalWithIvaMzn,
        channel
      })
    }).catch(() => {});
  } catch {}
}

/**
 * Gera os dados da etapa final e preenche a Folha A4
 */
function result(calcResult) {
  const r = calcResult || calculate();
  const clientName = ($('client-name') && $('client-name').value.trim()) || 'Cliente LECASU';
  const clientPhone = ($('client-phone') && $('client-phone').value.trim()) || 'Não informado';
  const location = ($('location') && $('location').value.trim()) || 'Moçambique';
  const projType = ($('project-type') && $('project-type').value) || 'Residência';
  const backupHours = typeof r.backupHours === 'number' ? r.backupHours : getBackupHours();

  // Cálculos Oficiais do Orçamento com IVA 16% (Taxa Legal de Moçambique)
  const subtotal = r.total;
  const iva = Math.round(subtotal * 0.16);
  const totalComIva = subtotal + iva;

  // Tabela de Orçamento na Tela com discriminação de IVA
  const quoteBody = $('quote');
  quoteBody.replaceChildren();

  const allItems = [
    ...r.items,
    ['Subtotal dos Equipamentos e Instalação (Sem IVA)', subtotal, 'subtotal'],
    ['IVA — Imposto sobre o Valor Acrescentado (16%)', iva, 'iva'],
    ['TOTAL FINAL DO SISTEMA (Com IVA 16% Incluído)', totalComIva, 'total-final']
  ];

  allItems.forEach(([name, price, type]) => {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    const tdPrice = document.createElement('td');

    tdName.textContent = name;
    tdPrice.textContent = money(price);
    tdPrice.style.textAlign = 'right';

    if (type === 'total-final') {
      tr.style.fontWeight = '800';
      tr.style.fontSize = '14px';
      tr.style.background = '#fff7ed';
      tdPrice.style.color = '#ea580c';
    } else if (type === 'subtotal') {
      tr.style.fontWeight = '700';
      tr.style.borderTop = '2px solid var(--line-strong)';
      tr.style.background = '#f8fafc';
    } else if (type === 'iva') {
      tr.style.fontWeight = '600';
      tr.style.color = '#c2410c';
      tr.style.background = '#f8fafc';
    }

    tr.append(tdName, tdPrice);
    quoteBody.append(tr);
  });

  // Aviso de grande porte
  const limitEl = $('limit');
  if (limitEl) {
    limitEl.hidden = r.inv <= 20 && r.pv <= 20;
  }

  // Preenchimento da FOLHA A4 PARA IMPRESSÃO
  const now = new Date();
  const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  if ($('print-date')) $('print-date').textContent = dateFormatted;
  if ($('print-prop-code')) {
    $('print-prop-code').textContent = computeProposalCode(clientName, location, projType);
  }
  if ($('print-client-name')) $('print-client-name').textContent = clientName;
  if ($('print-client-phone')) $('print-client-phone').textContent = clientPhone;
  if ($('print-location')) $('print-location').textContent = location;
  if ($('print-project-type')) $('print-project-type').textContent = projType;

  if ($('print-pv')) $('print-pv').textContent = `${fmt(r.pv)} kWp`;
  if ($('print-panels')) $('print-panels').textContent = `${r.panels} × ${r.selectedPanel.name}`;
  if ($('print-inv')) $('print-inv').textContent = `${r.inv} kW`;
  if ($('print-inv-model')) $('print-inv-model').textContent = `${r.invQty} × ${r.selectedInverter.name}`;
  if ($('print-bat')) $('print-bat').textContent = `${fmt(r.bat)} kWh`;
  if ($('print-bat-modules')) {
    $('print-bat-modules').textContent = r.batteries > 0 ? `${r.batteries} × ${r.selectedBattery.name}` : 'Sem baterias (Autoconsumo)';
  }
  if ($('print-backup')) {
    $('print-backup').textContent = backupHours > 0 ? `${backupHours} horas de autonomia` : 'Sem baterias (Solar Direto)';
  }
  if ($('print-gen-monthly')) $('print-gen-monthly').textContent = `~${fmt(r.monthlyGenKwh)} kWh/mês`;
  if ($('print-savings-monthly')) $('print-savings-monthly').textContent = `~${money(r.monthlySavingsMzn)}/mês`;
  if ($('print-co2')) $('print-co2').textContent = `${r.co2AvoidedTonYear} ton CO₂/ano`;

  const printQuoteTbody = $('print-quote-tbody');
  if (printQuoteTbody) {
    printQuoteTbody.replaceChildren();
    allItems.forEach(([name, price, type]) => {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      const td2 = document.createElement('td');
      td1.textContent = name;
      td2.textContent = money(price);
      td2.style.textAlign = 'right';
      if (type === 'total-final') {
        tr.style.fontWeight = 'bold';
        tr.style.fontSize = '11pt';
        tr.style.background = '#e2ebd8';
      } else if (type === 'subtotal' || type === 'iva') {
        tr.style.fontWeight = 'bold';
        tr.style.background = '#f5f7f3';
      }
      tr.append(td1, td2);
      printQuoteTbody.append(tr);
    });
  }

  const textSummary = buildQuoteSummaryText(r, clientName, clientPhone, location, projType, backupHours, subtotal, iva, totalComIva);

  // Link WhatsApp
  const whatsappBtn = $('whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(textSummary)}`;
  }

  // Link E-mail
  const contactBtn = $('contact');
  if (contactBtn) {
    contactBtn.href = `mailto:info@lecasu.co.mz?subject=${encodeURIComponent(`Pedido de Proposta Técnica — ${clientName} (${location})`)}&body=${encodeURIComponent(textSummary)}`;
  }
}

/**
 * Copia o resumo completo para colar no WhatsApp ou CRM
 */
function copyTechnicalSummary() {
  const r = calculate();
  const clientName = ($('client-name') && $('client-name').value.trim()) || 'Cliente LECASU';
  const clientPhone = ($('client-phone') && $('client-phone').value.trim()) || 'Não informado';
  const location = ($('location') && $('location').value.trim()) || 'Moçambique';
  const projType = ($('project-type') && $('project-type').value) || 'Residência';
  const backupHours = typeof r.backupHours === 'number' ? r.backupHours : getBackupHours();

  const subtotal = r.total;
  const iva = Math.round(subtotal * 0.16);
  const totalComIva = subtotal + iva;

  const text = buildQuoteSummaryText(r, clientName, clientPhone, location, projType, backupHours, subtotal, iva, totalComIva);
  submitQuoteToBackend('clipboard');

  navigator.clipboard.writeText(text).then(() => {
    const feedback = $('copy-feedback');
    if (feedback) {
      feedback.hidden = false;
      setTimeout(() => {
        feedback.hidden = true;
      }, 3500);
    }
  }).catch(() => {
    alert('Resumo copiado com sucesso.');
  });
}

/* ========================================================
   SINCRONIZAÇÃO EM TEMPO REAL COM O PORTAL ADMIN (admin.html)
   ======================================================== */
window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY_PRODUCTS) {
    adminProducts = loadAdminProducts();
    update();
  }
});

/* ========================================================
   MODAL POPUP PARA APARELHOS PERSONALIZADOS
   ======================================================== */

function openCustomModal(prefilledName = '') {
  const modal = $('custom-modal');
  const nameInput = $('custom-name');
  const powerInput = $('custom-power');
  const qtyInput = $('custom-qty');
  const hoursInput = $('custom-hours');
  const essentialCheck = $('custom-essential');
  const errorMsg = $('custom-name-error');

  if (nameInput) nameInput.value = prefilledName || '';
  if (powerInput) powerInput.value = '200';
  if (qtyInput) qtyInput.value = '1';
  if (hoursInput) hoursInput.value = '2';
  if (essentialCheck) essentialCheck.checked = true;
  if (errorMsg) errorMsg.hidden = true;

  if (modal) {
    modal.hidden = false;
    setTimeout(() => {
      if (nameInput) nameInput.focus();
    }, 50);
  }
}

function closeCustomModal() {
  const modal = $('custom-modal');
  if (modal) modal.hidden = true;
}

function handleBackdropClick(event) {
  if (event.target.id === 'custom-modal') {
    closeCustomModal();
  }
}

function saveCustomModal(event) {
  event.preventDefault();

  const nameInput = $('custom-name');
  const powerInput = $('custom-power');
  const qtyInput = $('custom-qty');
  const hoursInput = $('custom-hours');
  const essentialCheck = $('custom-essential');
  const errorMsg = $('custom-name-error');

  const name = nameInput.value.trim();
  const power = Number(powerInput.value) || 0;
  const qty = Number(qtyInput.value) || 1;
  const hours = Number(hoursInput.value) || 1;
  const essential = essentialCheck.checked;

  if (!name || name.length < 2) {
    nameInput.classList.add('has-error');
    if (errorMsg) {
      errorMsg.textContent = 'Por favor, informe o nome do aparelho.';
      errorMsg.hidden = false;
    }
    nameInput.focus();
    return;
  }

  if (power <= 0 || power > 50000) {
    powerInput.classList.add('has-error');
    powerInput.focus();
    return;
  }

  const newIndex = catalog.length;
  catalog.push(['custom', name.slice(0, 60), power, hours, 1, essential]);

  chosen.set(newIndex, {
    iconKey: 'custom',
    name: name.slice(0, 60),
    w: power,
    h: hours,
    f: 1,
    q: qty,
    essential: essential
  });

  closeCustomModal();
  clearSearch();
  hideValidationError(0);
  render();
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCustomModal();
  }
});

// Registro do Service Worker (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.log('Service Worker não registado:', err);
    });
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  const savedStep = loadSimulationSession();
  render();
  go(savedStep);
  syncCatalogFromServer();

  // Regista envio de propostas para o backend ao interagir com WhatsApp / E-mail / Impressão
  if ($('whatsapp-btn')) {
    $('whatsapp-btn').addEventListener('click', () => submitQuoteToBackend('whatsapp'));
  }
  if ($('contact')) {
    $('contact').addEventListener('click', () => submitQuoteToBackend('email'));
  }
  window.addEventListener('beforeprint', () => {
    if (currentStep === 2) submitQuoteToBackend('print_a4');
  });

  // Escuta campos do Passo 1 para persistência imediata
  ['client-name', 'client-phone', 'location'].forEach((id) => {
    const el = $(id);
    if (el) el.addEventListener('input', saveSimulationSession);
  });
  ['project-type', 'backup'].forEach((id) => {
    const el = $(id);
    if (el) el.addEventListener('change', saveSimulationSession);
  });
});
