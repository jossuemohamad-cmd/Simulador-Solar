/**
 * LECASU — Simulador Solar Fotovoltaico Residencial & Comercial (PWA Ready)
 * Dimensionamento técnico, gestão de catálogo de equipamentos (Admin) e proposta formal.
 */

// Biblioteca de Ícones SVG Vetoriais
const ICONS = {
  led: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2v1"/><path d="M4.2 10.2l.7.7"/><path d="M19.1 10.9l.7-.7"/><path d="M12 6a5 5 0 0 0-5 5c0 2.3 1.4 3.4 2 5h6c.6-1.6 2-2.7 2-5a5 5 0 0 0-5-5z"/></svg>`,
  tv: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="13" rx="2"/><polyline points="16 2 12 6 8 2"/><line x1="8" y1="22" x2="16" y2="22"/><line x1="12" y1="19" x2="12" y2="22"/></svg>`,
  fridge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="5" y1="10" x2="19" y2="10"/><line x1="9" y1="5" x2="9" y2="7"/><line x1="9" y1="13" x2="9" y2="17"/></svg>`,
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
  solar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="12" rx="1.5"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="15"/><line x1="15" y1="3" x2="15" y2="15"/><line x1="6" y1="19" x2="18" y2="19"/><line x1="12" y1="15" x2="12" y2="19"/></svg>`,
  inverter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>`,
  battery: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="12" rx="2"/><line x1="22" y1="11" x2="22" y2="15"/><line x1="7" y1="11" x2="7" y2="15"/><line x1="11" y1="11" x2="11" y2="15"/></svg>`,
  cash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M14.8 9A2 2 0 0 0 13 8h-2a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4h-2a2 2 0 0 1-1.8-1"/><path d="M12 6v2m0 8v2"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  info: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
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
      backupHours: String(selectedBackupHours),
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
    if (!raw) {
      chosen.clear();
      return 0;
    }
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

    // 3. Restaurar campos do formulário e autonomia
    if ($('client-name') && data.clientName) $('client-name').value = data.clientName;
    if ($('client-phone') && data.clientPhone) $('client-phone').value = data.clientPhone;
    if ($('location') && data.location) $('location').value = data.location;
    if ($('project-type') && data.projectType) $('project-type').value = data.projectType;
    if (data.backupHours !== undefined) {
      const parsedH = Number(data.backupHours);
      if ([2, 4, 8, 12].includes(parsedH)) {
        selectedBackupHours = parsedH;
      }
    }

    // 4. Restaurar seleções do cliente
    if (data.userSelections) {
      userSelections.panelId = data.userSelections.panelId || null;
      userSelections.inverterId = data.userSelections.inverterId || null;
      userSelections.batteryId = data.userSelections.batteryId || null;
    }

    if (chosen.size > 0 && typeof data.currentStep === 'number' && data.currentStep >= 0 && data.currentStep <= 2) {
      return data.currentStep;
    }
    return 0;
  } catch (e) {
    console.warn('Erro ao restaurar sessão anterior:', e);
    chosen.clear();
    return 0;
  }
}

function resetSimulation() {
  localStorage.removeItem(STORAGE_KEY_SESSION);
  chosen.clear();
  if ($('client-name')) $('client-name').value = '';
  if ($('client-phone')) $('client-phone').value = '';
  if ($('location')) $('location').value = '';
  if ($('project-type')) $('project-type').value = 'Residência';
  selectedBackupHours = 4;
  syncBackupRadioUI();
  userSelections.panelId = null;
  userSelections.inverterId = null;
  userSelections.batteryId = null;
  currentStep = 0;
  render();
  go(0);
}

// Estado da Aplicação
const chosen = new Map();
const PRIMARY_APPLIANCE_INDICES = [0, 2, 1, 4]; // Lâmpada LED, Geleira, Televisão, Ventoinha
const removedPrimaryIndices = new Set();
let currentStep = 0;
let selectedBackupHours = 4;

// Utilitários de Selecção e Formatação
const $ = (id) => document.getElementById(id);
const fmt = (n) => new Intl.NumberFormat('pt-MZ', { maximumFractionDigits: 2 }).format(n);
const fmt1 = (n) => new Intl.NumberFormat('pt-MZ', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);
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
 * Lista limpa de aparelhos (Etapa 1)
 */
function renderAppliancesList() {
  const container = $('appliances-list');
  if (!container) return;
  container.replaceChildren();

  // Mostra os aparelhos principais (não removidos) + quaisquer outros adicionados pelo utilizador
  const displayIndices = PRIMARY_APPLIANCE_INDICES.filter((idx) => !removedPrimaryIndices.has(idx) || chosen.has(idx));
  chosen.forEach((_, idx) => {
    if (!displayIndices.includes(idx)) {
      displayIndices.push(idx);
    }
  });

  if (displayIndices.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'appliances-empty';
    emptyMsg.textContent = 'Nenhum aparelho na lista. Clique em "Adicionar aparelho" abaixo.';
    container.append(emptyMsg);
    return;
  }

  displayIndices.forEach((idx) => {
    const base = catalog[idx];
    if (!base) return;
    const active = chosen.get(idx);
    const qty = active ? active.q : 0;
    const hours = active ? active.h : '';

    const row = document.createElement('div');
    row.className = 'appliance-row';

    const info = document.createElement('div');
    info.className = 'appliance-info';

    const nameEl = document.createElement('span');
    nameEl.className = 'appliance-name';
    nameEl.textContent = active ? active.name : base[1];
    info.append(nameEl);

    if (qty > 0 || !PRIMARY_APPLIANCE_INDICES.includes(idx)) {
      const actionsRow = document.createElement('div');
      actionsRow.className = 'appliance-actions';

      const adjustBtn = document.createElement('button');
      adjustBtn.type = 'button';
      adjustBtn.className = 'adjust-link';
      adjustBtn.textContent = 'Ajustar';
      adjustBtn.onclick = () => openAdjustModal(idx);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'remove-link';
      removeBtn.innerHTML = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg><span>Remover</span>`;
      removeBtn.onclick = () => removeAppliance(idx);

      actionsRow.append(adjustBtn, removeBtn);
      info.append(actionsRow);
    }

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.className = 'num-input';
    qtyInput.min = '0';
    qtyInput.max = '100';
    qtyInput.step = '1';
    qtyInput.value = String(qty);
    qtyInput.setAttribute('aria-label', `Quantidade de ${base[1]}`);
    qtyInput.addEventListener('input', (e) => onApplianceQtyChange(idx, e.target.value, true));
    qtyInput.addEventListener('change', (e) => onApplianceQtyChange(idx, e.target.value, false));

    const hoursInput = document.createElement('input');
    hoursInput.type = 'number';
    hoursInput.className = 'num-input';
    hoursInput.min = '0.1';
    hoursInput.max = '24';
    hoursInput.step = '0.25';
    hoursInput.placeholder = '—';
    hoursInput.value = qty > 0 ? String(hours) : '';
    hoursInput.setAttribute('aria-label', `Horas por dia de ${base[1]}`);
    hoursInput.addEventListener('input', (e) => onApplianceHoursChange(idx, e.target.value, true));
    hoursInput.addEventListener('change', (e) => onApplianceHoursChange(idx, e.target.value, false));

    row.append(info, qtyInput, hoursInput);
    container.append(row);
  });
}

function onApplianceQtyChange(idx, rawValue, liveOnly = false) {
  const q = Math.max(0, Math.min(100, Math.round(Number(rawValue) || 0)));
  const base = catalog[idx];
  if (!base) return;

  if (q === 0) {
    chosen.delete(idx);
  } else {
    const existing = chosen.get(idx);
    if (existing) {
      existing.q = q;
    } else {
      chosen.set(idx, {
        iconKey: base[0],
        name: base[1],
        w: base[2],
        h: base[3],
        f: base[4],
        q: q,
        essential: base[5] !== undefined ? Boolean(base[5]) : true
      });
    }
  }
  hideValidationError(0);
  if (liveOnly) {
    update();
  } else {
    render();
  }
}

function onApplianceHoursChange(idx, rawValue, liveOnly = false) {
  const num = Number(rawValue) || 0;
  const base = catalog[idx];
  if (!base) return;

  if (num <= 0) {
    if (!liveOnly) render();
    return;
  }

  const h = Math.max(0.1, Math.min(24, num));
  const existing = chosen.get(idx);
  if (existing) {
    existing.h = h;
  } else {
    chosen.set(idx, {
      iconKey: base[0],
      name: base[1],
      w: base[2],
      h: h,
      f: base[4],
      q: 1,
      essential: base[5] !== undefined ? Boolean(base[5]) : true
    });
  }
  hideValidationError(0);
  if (liveOnly) {
    update();
  } else {
    render();
  }
}

function openAdjustModal(idx) {
  const base = catalog[idx];
  if (!base) return;
  const active = chosen.get(idx);

  if ($('adjust-index')) $('adjust-index').value = String(idx);
  if ($('adjust-modal-title')) $('adjust-modal-title').textContent = active ? active.name : base[1];
  if ($('adjust-power')) $('adjust-power').value = String(active ? active.w : base[2]);
  if ($('adjust-essential')) $('adjust-essential').checked = active ? Boolean(active.essential) : Boolean(base[5]);

  const removeBtn = $('adjust-remove-btn');
  if (removeBtn) {
    removeBtn.hidden = PRIMARY_APPLIANCE_INDICES.includes(idx);
  }

  const modal = $('adjust-modal');
  if (modal) modal.hidden = false;
}

function closeAdjustModal() {
  const modal = $('adjust-modal');
  if (modal) modal.hidden = true;
}

function saveAdjustModal(event) {
  event.preventDefault();
  const idx = Number($('adjust-index').value);
  const w = Math.max(1, Math.min(50000, Number($('adjust-power').value) || 100));
  const essential = Boolean($('adjust-essential').checked);
  const base = catalog[idx];
  if (!base) return;

  const active = chosen.get(idx);
  if (active) {
    active.w = w;
    active.essential = essential;
  } else {
    chosen.set(idx, {
      iconKey: base[0],
      name: base[1],
      w: w,
      h: base[3],
      f: base[4],
      q: 1,
      essential: essential
    });
  }

  closeAdjustModal();
  render();
}

function removeAppliance(idx) {
  chosen.delete(idx);
  if (PRIMARY_APPLIANCE_INDICES.includes(idx)) {
    removedPrimaryIndices.add(idx);
  }
  render();
}

function removeAdjustedAppliance() {
  const idx = Number($('adjust-index').value);
  closeAdjustModal();
  removeAppliance(idx);
}

/**
 * Renderiza interface completa
 */
function render() {
  renderAppliancesList();
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
  return Number.isFinite(selectedBackupHours) && selectedBackupHours >= 0 ? selectedBackupHours : 4;
}

function syncBackupRadioUI() {
  const cards = document.querySelectorAll('.radio-card');
  cards.forEach((card) => {
    const h = Number(card.getAttribute('data-hours'));
    const radio = card.querySelector('input[type="radio"]');
    const isSel = h === selectedBackupHours;
    card.classList.toggle('selected', isSel);
    if (radio) radio.checked = isSel;
  });
}

function onSelectBackup(hours) {
  selectedBackupHours = Number(hours) || 4;
  syncBackupRadioUI();
  update();
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

  // 1. Painéis - Organizados por Gama e Marca (Sem exibição de preços individuais)
  panelSel.replaceChildren();

  const panelGroups = [
    {
      label: 'Painéis Solares N-Type Bifaciais (Dual Glass) | Jinko Solar',
      items: adminProducts.panels.filter((p) => (p.brand || '').toLowerCase().includes('jinko'))
    },
    {
      label: 'Painéis Solares Monocristalinos | Outras Marcas',
      items: adminProducts.panels.filter((p) => !(p.brand || '').toLowerCase().includes('jinko'))
    }
  ];

  panelGroups.forEach((grp) => {
    if (grp.items.length === 0) return;
    const optgroup = document.createElement('optgroup');
    optgroup.label = grp.label;

    grp.items.forEach((p) => {
      const opt = document.createElement('option');
      opt.value = p.id;
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

  // 2. Inversores - Organizados por Categoria | Marca | Tensão (Sem preços no produto)
  invSel.replaceChildren();

  const invGroups = [
    { label: 'Inversores Híbridos Baixa Tensão (LV) | Deye · 48V', items: adminProducts.inverters.filter((i) => (i.voltageType || 'LV') === 'LV' && (i.brand || '').toLowerCase().includes('deye')) },
    { label: 'Inversores Híbridos Baixa Tensão (LV) | LIVOLTEK · 48V', items: adminProducts.inverters.filter((i) => (i.voltageType || 'LV') === 'LV' && (i.brand || '').toLowerCase().includes('livoltek')) },
    { label: 'Controladores e Inversores Alta Tensão (HV) | Sigenergy · 900V', items: adminProducts.inverters.filter((i) => i.voltageType === 'HV') },
    { label: 'Inversores Solares Baixa Tensão (LV) | Outras Marcas', items: adminProducts.inverters.filter((i) => (i.voltageType || 'LV') === 'LV' && !(i.brand || '').toLowerCase().includes('deye') && !(i.brand || '').toLowerCase().includes('livoltek')) }
  ];

  invGroups.forEach((grp) => {
    if (grp.items.length === 0) return;
    const optgroup = document.createElement('optgroup');
    optgroup.label = grp.label;

    grp.items.forEach((inv) => {
      const opt = document.createElement('option');
      opt.value = inv.id;
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

  // 3. Baterias - Organizadas por Categoria | Marca | Tensão Nominal (Sem preços no produto)
  batSel.replaceChildren();

  const batGroups = [
    { label: 'Baterias de Baixa Tensão (LV) | Deye · 51.2V', items: adminProducts.batteries.filter((b) => (b.voltageType || 'LV') === 'LV' && (b.brand || '').toLowerCase().includes('deye')) },
    { label: 'Baterias de Alta Tensão (HV) | Sigenergy · 300-900V', items: adminProducts.batteries.filter((b) => b.voltageType === 'HV' && (b.subcategory === 'sigen_hv' || (b.brand || '').toLowerCase().includes('sigen'))) },
    { label: 'Baterias de Alta Tensão (HV) | LIVOLTEK BHF · 102V-614V', items: adminProducts.batteries.filter((b) => b.voltageType === 'HV' && (b.subcategory === 'livoltek_bhf' || (b.brand || '').toLowerCase().includes('livoltek'))) },
    { label: 'Baterias de Baixa Tensão (LV) | Outras Marcas', items: adminProducts.batteries.filter((b) => (b.voltageType || 'LV') === 'LV' && !(b.brand || '').toLowerCase().includes('deye')) },
    { label: 'Baterias de Alta Tensão (HV) | Outras Marcas', items: adminProducts.batteries.filter((b) => b.voltageType === 'HV' && b.subcategory !== 'sigen_hv' && b.subcategory !== 'livoltek_bhf' && !(b.brand || '').toLowerCase().includes('sigen') && !(b.brand || '').toLowerCase().includes('livoltek')) }
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
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.gap = '6px';
      const hdrIcon = category === 'panel' ? ICONS.solar : (category === 'inverter' ? ICONS.inverter : ICONS.battery);
      header.innerHTML = `<span style="display:inline-flex;width:13px;height:13px;color:var(--orange-hover);flex-shrink:0;">${hdrIcon}</span><span>${escapeHtml(node.label)}</span>`;
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

  const dailySummary = $('daily-kwh-summary');
  if (dailySummary) {
    dailySummary.textContent = `${fmt1(r.e)} kWh/dia`;
  }

  if (currentStep === 2) {
    result(r);
  }

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
      showValidationError(0, 'Indique pelo menos um aparelho com quantidade e horas superiores a zero.');
      return;
    }
  }
  go(targetStep);
}

/**
 * Transição de passos
 */
function go(n) {
  const t = totals();

  if (n > 0) {
    if (chosen.size === 0 || t.e <= 0 || t.p <= 0) {
      showValidationError(0, 'Indique pelo menos um aparelho com quantidade e horas superiores a zero.');
      return;
    }
    hideValidationError(0);
  }

  currentStep = n;

  for (let i = 0; i < 3; i++) {
    const stepEl = $('step' + i);
    const pillEl = $('s' + i);
    if (stepEl) stepEl.hidden = i !== n;
    if (pillEl) pillEl.className = 'tab-btn' + (i === n ? ' active' : '');
  }

  if (n === 1) {
    syncBackupRadioUI();
  }

  update();
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
    '*PROPOSTA TÉCNICA E COMERCIAL SOLAR — LECASU*',
    '------------------------------------------',
    `*Cliente:* ${clientName}`,
    `*Contacto:* ${clientPhone}`,
    `*Local:* ${location}`,
    `*Tipo:* ${projType}`,
    `*Autonomia:* ${backupHours > 0 ? `${backupHours} horas em corte da EDM` : 'Sem baterias (Solar Direto / Autoconsumo)'}`,
    '',
    '*EQUIPAMENTOS SELECIONADOS NO CATÁLOGO:*',
    `- Painéis Solares: ${r.panels} x ${r.selectedPanel.name} (${fmt(r.pv)} kWp)`,
    `- Inversor Híbrido: ${r.invQty} x ${r.selectedInverter.name} (${r.inv} kW)`,
    `- Baterias LiFePO4: ${r.batteries > 0 ? `${r.batteries} x ${r.selectedBattery.name} (${fmt(r.bat)} kWh)` : 'Sem acumuladores (Solar Direto)'}`,
    `- Consumo Diário Estimado: ${fmt(r.e)} kWh/dia`,
    `- Potência Total Ligada: ${fmt(r.p)} kW`,
    '',
    `*Geração Estimada:* ~${fmt(r.monthlyGenKwh)} kWh/mês`,
    `*Poupança Est. EDM:* ~${money(r.monthlySavingsMzn)}/mês (~${money(r.monthlySavingsMzn * 12)}/ano)`,
    `*Redução de CO2:* ~${r.co2AvoidedTonYear} ton CO2/ano`,
    '',
    `*Subtotal (Sem IVA):* ${money(subtotal)}`,
    `*IVA Legal (16%):* ${money(iva)}`,
    `*INVESTIMENTO TOTAL (Com IVA 16%):* ${money(totalComIva)}`,
    '',
    '*Cargas Seleccionadas:*',
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

  const subtotal = r.total;
  const iva = Math.round(subtotal * 0.16);
  const totalComIva = subtotal + iva;

  // Atualiza UI do Resultado (Etapa 3) conforme layout limpo (sem nomes/marcas de equipamentos)
  if ($('result-price')) {
    $('result-price').textContent = 'Preço sob consulta';
  }
  if ($('res-panels')) {
    $('res-panels').textContent = `${r.panels} ${r.panels === 1 ? 'painel' : 'painéis'} · ${fmt(r.pv)} kWp`;
  }
  if ($('res-inverter')) {
    $('res-inverter').textContent = `${fmt(r.inv)} kW`;
  }
  if ($('res-battery')) {
    $('res-battery').textContent = r.batteries > 0 ? `${fmt(r.bat)} kWh` : 'Sem baterias';
  }

  const allItems = [
    ...r.items,
    ['Subtotal dos Equipamentos e Instalação (Sem IVA)', subtotal, 'subtotal'],
    ['IVA — Imposto sobre o Valor Acrescentado (16%)', iva, 'iva'],
    ['TOTAL FINAL DO SISTEMA (Com IVA 16% Incluído)', totalComIva, 'total-final']
  ];

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
   MODAIS PLANOS (OUTRO APARELHO & PEDIR COTAÇÃO)
   ======================================================== */
function handleModalBackdrop(event, modalId) {
  if (event.target && event.target.id === modalId) {
    event.target.hidden = true;
  }
}

function populateCatalogPicker() {
  const picker = $('catalog-picker');
  if (!picker) return;
  picker.replaceChildren();

  const customOpt = document.createElement('option');
  customOpt.value = 'custom';
  customOpt.textContent = '-- Escrever novo aparelho --';
  picker.append(customOpt);

  catalog.forEach((item, idx) => {
    if (item[0] === 'custom') return;
    const opt = document.createElement('option');
    opt.value = String(idx);
    opt.textContent = `${item[1]} (${item[2]} W)`;
    picker.append(opt);
  });
}

function onPickCatalogItem(val) {
  const nameInput = $('custom-name');
  const powerInput = $('custom-power');
  const hoursInput = $('custom-hours');
  const essentialCheck = $('custom-essential');

  if (val === 'custom') {
    if (nameInput) nameInput.value = '';
    if (powerInput) powerInput.value = '200';
    if (hoursInput) hoursInput.value = '2';
    if (essentialCheck) essentialCheck.checked = true;
    return;
  }

  const item = catalog[Number(val)];
  if (!item) return;
  if (nameInput) nameInput.value = item[1];
  if (powerInput) powerInput.value = String(item[2]);
  if (hoursInput) hoursInput.value = String(item[3]);
  if (essentialCheck) essentialCheck.checked = item[5] !== undefined ? Boolean(item[5]) : true;
}

function openCustomModal() {
  populateCatalogPicker();
  const picker = $('catalog-picker');
  if (picker && picker.options.length > 0) {
    picker.selectedIndex = 0;
    onPickCatalogItem(picker.value);
  }
  const qtyInput = $('custom-qty');
  if (qtyInput) qtyInput.value = '1';
  const modal = $('custom-modal');
  if (modal) {
    modal.hidden = false;
    setTimeout(() => {
      if ($('custom-name')) $('custom-name').focus();
    }, 50);
  }
}

function closeCustomModal() {
  const modal = $('custom-modal');
  if (modal) modal.hidden = true;
}

function saveCustomModal(event) {
  event.preventDefault();

  const picker = $('catalog-picker');
  const picked = picker ? picker.value : 'custom';
  const nameInput = $('custom-name');
  const name = ((nameInput && nameInput.value) || '').trim();
  const power = Math.max(1, Math.min(50000, Number($('custom-power').value) || 200));
  const qty = Math.max(1, Math.min(100, Math.round(Number($('custom-qty').value) || 1)));
  const hours = Math.max(0.1, Math.min(24, Number($('custom-hours').value) || 1));
  const essential = Boolean($('custom-essential').checked);

  if (!name || name.length < 2) {
    if (nameInput) nameInput.focus();
    return;
  }

  let targetIdx = -1;
  if (picked !== 'custom') {
    const idx = Number(picked);
    const base = catalog[idx];
    if (base && normalizeStr(base[1]) === normalizeStr(name)) {
      targetIdx = idx;
    }
  }
  if (targetIdx === -1) {
    targetIdx = catalog.findIndex((item) => normalizeStr(item[1]) === normalizeStr(name));
  }

  if (targetIdx !== -1) {
    removedPrimaryIndices.delete(targetIdx);
    const base = catalog[targetIdx];
    chosen.set(targetIdx, {
      iconKey: base[0],
      name: base[1],
      w: power,
      h: hours,
      f: base[4],
      q: qty,
      essential: essential
    });
  } else {
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
  }

  closeCustomModal();
  hideValidationError(0);
  render();
}

function openQuoteModal() {
  const modal = $('quote-modal');
  if (modal) {
    modal.hidden = false;
    setTimeout(() => {
      if ($('client-name')) $('client-name').focus();
    }, 50);
  }
}

function closeQuoteModal() {
  const modal = $('quote-modal');
  if (modal) modal.hidden = true;
}

function submitQuoteForm(event) {
  event.preventDefault();
  const r = calculate();
  const clientName = ($('client-name') && $('client-name').value.trim()) || 'Cliente LECASU';
  const clientPhone = ($('client-phone') && $('client-phone').value.trim()) || 'Não informado';
  const location = ($('location') && $('location').value.trim()) || 'Moçambique';
  const projType = ($('project-type') && $('project-type').value) || 'Residência';
  const backupHours = getBackupHours();
  const subtotal = r.total;
  const iva = Math.round(subtotal * 0.16);
  const totalComIva = subtotal + iva;

  saveSimulationSession();
  submitQuoteToBackend('whatsapp');
  const textSummary = buildQuoteSummaryText(r, clientName, clientPhone, location, projType, backupHours, subtotal, iva, totalComIva);
  closeQuoteModal();
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textSummary)}`, '_blank', 'noopener');
}

function sendQuoteByEmail() {
  const r = calculate();
  const clientName = ($('client-name') && $('client-name').value.trim()) || 'Cliente LECASU';
  const clientPhone = ($('client-phone') && $('client-phone').value.trim()) || 'Não informado';
  const location = ($('location') && $('location').value.trim()) || 'Moçambique';
  const projType = ($('project-type') && $('project-type').value) || 'Residência';
  const backupHours = getBackupHours();
  const subtotal = r.total;
  const iva = Math.round(subtotal * 0.16);
  const totalComIva = subtotal + iva;

  saveSimulationSession();
  submitQuoteToBackend('email');
  const textSummary = buildQuoteSummaryText(r, clientName, clientPhone, location, projType, backupHours, subtotal, iva, totalComIva);
  closeQuoteModal();
  window.location.href = `mailto:info@lecasu.co.mz?subject=${encodeURIComponent(`Pedido de Proposta Técnica — ${clientName} (${location})`)}&body=${encodeURIComponent(textSummary)}`;
}

function printProposalA4() {
  saveSimulationSession();
  result();
  submitQuoteToBackend('print_a4');
  closeQuoteModal();
  window.print();
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCustomModal();
    closeAdjustModal();
    closeQuoteModal();
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
  syncBackupRadioUI();
  render();
  go(savedStep);
  syncCatalogFromServer();

  ['client-name', 'client-phone', 'location'].forEach((id) => {
    const el = $(id);
    if (el) el.addEventListener('input', saveSimulationSession);
  });
  if ($('project-type')) {
    $('project-type').addEventListener('change', saveSimulationSession);
  }
});
