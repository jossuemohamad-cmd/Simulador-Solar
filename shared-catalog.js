/**
 * LECASU — Catálogo Padrão Compartilhado & Utilitários Técnicos
 * Fonte única de verdade para o Servidor Node.js, Simulador do Cliente e Portal Admin.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LecasuCatalog = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  const STORAGE_KEY_PRODUCTS = 'lecasu_admin_products_v3';

  const OBSOLETE_PRODUCT_IDS = [
    'p_jinko_570', 'p_canadian_550', 'p_ja_580', 'p_longi_540',
    'inv_deye_5k', 'inv_deye_6k', 'inv_deye_8k', 'inv_deye_10k', 'inv_deye_12k', 'inv_growatt_5k', 'inv_victron_15k', 'inv_huawei_20k',
    'bat_deye_512', 'bat_pylon_48', 'bat_dyness_48', 'bat_deye_1024', 'bat_pylon_35k', 'bat_byd_10k', 'bat_tesla_14k'
  ];

  const DEFAULT_PRODUCTS = {
    panels: [
      {
        id: 'p_jinko_tiger_neo_600_bdv',
        name: 'Jinko Tiger Neo N-Type Bifacial 600W (JKM600N-66HL4M-BDV)',
        brand: 'Jinko Solar',
        series: 'Tiger Neo 66HL4M-BDV',
        panelType: 'bifacial_dual_glass',
        cellTech: 'Monocristalino N-Type (SMBB / Hot 2.0)',
        cells: '132 células (2x66)',
        power: 600,
        price: 8000,
        efficiency: '22.21%',
        vMax: '1500 V DC',
        dimensions: '2382 × 1134 × 30 mm',
        weight: '32.4 kg',
        warranty: '12 anos produto / 30 anos linear',
        image: 'img/products/panel-jinko.svg',
        extra: 'Bifacial Vidro Duplo (Dual Glass) · Efic. 22.21% · 132 Células N-Type · 1500V'
      },
      {
        id: 'p_jinko_tiger_neo_605_bdv',
        name: 'Jinko Tiger Neo N-Type Bifacial 605W (JKM605N-66HL4M-BDV)',
        brand: 'Jinko Solar',
        series: 'Tiger Neo 66HL4M-BDV',
        panelType: 'bifacial_dual_glass',
        cellTech: 'Monocristalino N-Type (SMBB / Hot 2.0)',
        cells: '132 células (2x66)',
        power: 605,
        price: 8100,
        efficiency: '22.40%',
        vMax: '1500 V DC',
        dimensions: '2382 × 1134 × 30 mm',
        weight: '32.4 kg',
        warranty: '12 anos produto / 30 anos linear',
        image: 'img/products/panel-jinko.svg',
        extra: 'Bifacial Vidro Duplo (Dual Glass) · Efic. 22.40% · 132 Células N-Type · 1500V'
      },
      {
        id: 'p_jinko_tiger_neo_610_bdv',
        name: 'Jinko Tiger Neo N-Type Bifacial 610W (JKM610N-66HL4M-BDV)',
        brand: 'Jinko Solar',
        series: 'Tiger Neo 66HL4M-BDV',
        panelType: 'bifacial_dual_glass',
        cellTech: 'Monocristalino N-Type (SMBB / Hot 2.0)',
        cells: '132 células (2x66)',
        power: 610,
        price: 8200,
        efficiency: '22.58%',
        vMax: '1500 V DC',
        dimensions: '2382 × 1134 × 30 mm',
        weight: '32.4 kg',
        warranty: '12 anos produto / 30 anos linear',
        image: 'img/products/panel-jinko.svg',
        extra: 'Bifacial Vidro Duplo (Dual Glass) · Efic. 22.58% · 132 Células N-Type · 1500V'
      },
      {
        id: 'p_jinko_tiger_neo_615_bdv',
        name: 'Jinko Tiger Neo N-Type Bifacial 615W (JKM615N-66HL4M-BDV)',
        brand: 'Jinko Solar',
        series: 'Tiger Neo 66HL4M-BDV',
        panelType: 'bifacial_dual_glass',
        cellTech: 'Monocristalino N-Type (SMBB / Hot 2.0)',
        cells: '132 células (2x66)',
        power: 615,
        price: 8300,
        efficiency: '22.77%',
        vMax: '1500 V DC',
        dimensions: '2382 × 1134 × 30 mm',
        weight: '32.4 kg',
        warranty: '12 anos produto / 30 anos linear',
        image: 'img/products/panel-jinko.svg',
        extra: 'Bifacial Vidro Duplo (Dual Glass) · Efic. 22.77% · 132 Células N-Type · 1500V'
      },
      {
        id: 'p_jinko_tiger_neo_620_bdv',
        name: 'Jinko Tiger Neo N-Type Bifacial 620W (JKM620N-66HL4M-BDV)',
        brand: 'Jinko Solar',
        series: 'Tiger Neo 66HL4M-BDV',
        panelType: 'bifacial_dual_glass',
        cellTech: 'Monocristalino N-Type (SMBB / Hot 2.0)',
        cells: '132 células (2x66)',
        power: 620,
        price: 8400,
        efficiency: '22.96%',
        vMax: '1500 V DC',
        dimensions: '2382 × 1134 × 30 mm',
        weight: '32.4 kg',
        warranty: '12 anos produto / 30 anos linear',
        image: 'img/products/panel-jinko.svg',
        extra: 'Bifacial Vidro Duplo (Dual Glass) · Efic. 22.96% · 132 Células N-Type · 1500V'
      },
      {
        id: 'p_jinko_tiger_neo_625_bdv',
        name: 'Jinko Tiger Neo N-Type Bifacial 625W (JKM625N-66HL4M-BDV)',
        brand: 'Jinko Solar',
        series: 'Tiger Neo 66HL4M-BDV',
        panelType: 'bifacial_dual_glass',
        cellTech: 'Monocristalino N-Type (SMBB / Hot 2.0)',
        cells: '132 células (2x66)',
        power: 625,
        price: 8500,
        efficiency: '23.14%',
        vMax: '1500 V DC',
        dimensions: '2382 × 1134 × 30 mm',
        weight: '32.4 kg',
        warranty: '12 anos produto / 30 anos linear',
        image: 'img/products/panel-jinko.svg',
        extra: 'Bifacial Vidro Duplo (Dual Glass) · Efic. 23.14% · 132 Células N-Type · 1500V'
      }
    ],
    inverters: [
      { id: 'inv_megatron_5k_lv', name: 'Inversor Híbrido MEGATRON 5 kW (1ph · LV-48)', brand: 'MEGATRON', voltageType: 'LV', phase: '1ph', power: 5, price: 88000, image: 'img/products/inv-megatron-lv.svg', extra: 'Monofásico · Baixa Tensão 48V · Dual MPPT' },
      { id: 'inv_deye_5k_1ph', name: 'Deye Híbrido 5 kW (1ph · LV-48)', brand: 'Deye', voltageType: 'LV', phase: '1ph', power: 5, price: 90000, image: 'img/products/inv-deye-lv.svg', extra: 'Monofásico · Baixa Tensão 48V · Dual MPPT' },
      { id: 'inv_livoltek_6k_split', name: 'LIVOLTEK Split-Phase 6 kW (LV-48)', brand: 'LIVOLTEK', voltageType: 'LV', phase: 'split', power: 6, price: 115000, image: 'img/products/inv-livoltek-lv.svg', extra: 'Bifásico Split-Phase · 2/3 MPPT LV-48' },
      { id: 'inv_livoltek_12k_split', name: 'LIVOLTEK Split-Phase 12 kW (LV-48)', brand: 'LIVOLTEK', voltageType: 'LV', phase: 'split', power: 12, price: 195000, image: 'img/products/inv-livoltek-lv.svg', extra: 'Bifásico Split-Phase · 2/3 MPPT LV-48' },
      { id: 'inv_megatron_12k_lv', name: 'Inversor Híbrido MEGATRON 12 kW (3ph · LV-48)', brand: 'MEGATRON', voltageType: 'LV', phase: '3ph', power: 12, price: 195000, image: 'img/products/inv-megatron-lv.svg', extra: 'Trifásico / Split · Baixa Tensão 48V · Alta Eficiência' },
      { id: 'inv_deye_12k_3ph_lv', name: 'Deye Híbrido 12 kW (3ph · LV-48)', brand: 'Deye', voltageType: 'LV', phase: '3ph', power: 12, price: 210000, image: 'img/products/inv-deye-lv.svg', extra: 'Trifásico · Baixa Tensão 48V · Dual MPPT' },
      { id: 'inv_deye_20k_3ph_lv', name: 'Deye Híbrido 20 kW (3ph · LV-48)', brand: 'Deye', voltageType: 'LV', phase: '3ph', power: 20, price: 280000, image: 'img/products/inv-deye-lv.svg', extra: 'Trifásico · Baixa Tensão 48V · Paralelizável' },
      { id: 'inv_livoltek_5k_3ph', name: 'LIVOLTEK Three-Phase Híbrido 5 kW (LV-48)', brand: 'LIVOLTEK', voltageType: 'LV', phase: '3ph', power: 5, price: 110000, image: 'img/products/inv-livoltek-lv.svg', extra: 'Trifásico · 2 MPPT LV-48' },
      { id: 'inv_livoltek_12k_3ph', name: 'LIVOLTEK Three-Phase Híbrido 12 kW (LV-48)', brand: 'LIVOLTEK', voltageType: 'LV', phase: '3ph', power: 12, price: 198000, image: 'img/products/inv-livoltek-lv.svg', extra: 'Trifásico · 2 MPPT LV-48' },
      { id: 'inv_livoltek_16k_3ph', name: 'LIVOLTEK Three-Phase Híbrido 16 kW (LV-48)', brand: 'LIVOLTEK', voltageType: 'LV', phase: '3ph', power: 16, price: 235000, image: 'img/products/inv-livoltek-lv.svg', extra: 'Trifásico · 2/3 MPPT LV-48' },
      { id: 'inv_sigen_5k_3ph_hv', name: 'Sigen Energy Controller All-in-one 5 kW (3ph · HV-900)', brand: 'Sigenergy', voltageType: 'HV', phase: '3ph', power: 5, price: 155000, image: 'img/products/inv-sigen-hv.svg', extra: 'Trifásico · All-in-One Alta Tensão 900V' },
      { id: 'inv_sigen_6k_3ph_hv', name: 'Sigen Energy Controller All-in-one 6 kW (3ph · HV-900)', brand: 'Sigenergy', voltageType: 'HV', phase: '3ph', power: 6, price: 170000, image: 'img/products/inv-sigen-hv.svg', extra: 'Trifásico · All-in-One Alta Tensão 900V' },
      { id: 'inv_sigen_10k_3ph_hv', name: 'Sigen Energy Controller All-in-one 10 kW (3ph · HV-900)', brand: 'Sigenergy', voltageType: 'HV', phase: '3ph', power: 10, price: 215000, image: 'img/products/inv-sigen-hv.svg', extra: 'Trifásico · All-in-One Alta Tensão 900V' },
      { id: 'inv_sigen_15k_3ph_hv', name: 'Sigen Energy Controller All-in-one 15 kW (3ph · HV-900)', brand: 'Sigenergy', voltageType: 'HV', phase: '3ph', power: 15, price: 265000, image: 'img/products/inv-sigen-hv.svg', extra: 'Trifásico · All-in-One Alta Tensão 900V' },
      { id: 'inv_sigen_20k_3ph_hv', name: 'Sigen Energy Controller All-in-one 20 kW (3ph · HV-900)', brand: 'Sigenergy', voltageType: 'HV', phase: '3ph', power: 20, price: 310000, image: 'img/products/inv-sigen-hv.svg', extra: 'Trifásico · All-in-One Alta Tensão 900V' },
      { id: 'inv_sigen_25k_3ph_hv', name: 'Sigen Energy Controller All-in-one 25 kW (3ph · HV-900)', brand: 'Sigenergy', voltageType: 'HV', phase: '3ph', power: 25, price: 360000, image: 'img/products/inv-sigen-hv.svg', extra: 'Trifásico · All-in-One Alta Tensão 900V' }
    ],
    batteries: [
      { id: 'bat_megatron_512_lv', name: 'Bateria MEGATRON 100Ah 5.12 kWh (51.2V-LV)', brand: 'MEGATRON', voltageType: 'LV', subcategory: 'megatron_lv', capacity: 5.12, price: 95000, image: 'img/products/bat-megatron-lv.svg', extra: 'LiFePO4 Mural/Rack · 51.2V 100Ah (6000 Ciclos)' },
      { id: 'bat_megatron_16k_lv', name: 'Bateria MEGATRON 280Ah 16 kWh (51.2V-LV)', brand: 'MEGATRON', voltageType: 'LV', subcategory: 'megatron_lv', capacity: 16.0, price: 245000, image: 'img/products/bat-megatron-lv.svg', extra: 'LiFePO4 Alta Capacidade · 51.2V 280Ah (6000 Ciclos)' },
      { id: 'bat_deye_512_lv', name: 'Deye Battery LiFePO4 5.12 kWh (51.2V-LV)', brand: 'Deye', voltageType: 'LV', subcategory: 'lv_rack', capacity: 5.12, price: 98000, image: 'img/products/bat-deye-lv.svg', extra: 'Mural/Rack · 51.2V 100Ah (6000 Ciclos)' },
      { id: 'bat_deye_rw_m61_lv', name: 'DEYE Low Voltage Lithium Battery 5.12 kWh (51.2V)', brand: 'Deye', voltageType: 'LV', subcategory: 'lv_rack', capacity: 5.12, price: 98000, image: 'img/products/bat-deye-lv.svg', extra: 'Mural RW-M6.1 · 51.2V 100Ah' },
      { id: 'bat_sigen_5k_hv', name: 'Sigen Battery 5.0 kWh (300-900-HV)', brand: 'Sigenergy', voltageType: 'HV', subcategory: 'sigen_hv', capacity: 5.0, price: 115000, image: 'img/products/bat-sigen-hv.svg', extra: 'Módulo Modular SigenStor · 300-900V HV' },
      { id: 'bat_sigen_6k_hv', name: 'Sigen Battery 6.0 kWh (300-900-HV)', brand: 'Sigenergy', voltageType: 'HV', subcategory: 'sigen_hv', capacity: 6.0, price: 135000, image: 'img/products/bat-sigen-hv.svg', extra: 'Módulo Modular SigenStor · 300-900V HV' },
      { id: 'bat_sigen_8k_hv', name: 'Sigen Battery 8.0 kWh (300-900-HV)', brand: 'Sigenergy', voltageType: 'HV', subcategory: 'sigen_hv', capacity: 8.0, price: 175000, image: 'img/products/bat-sigen-hv.svg', extra: 'Módulo Modular SigenStor · 300-900V HV' },
      { id: 'bat_sigen_10k_hv', name: 'Sigen Battery 10.0 kWh (300-900-HV)', brand: 'Sigenergy', voltageType: 'HV', subcategory: 'sigen_hv', capacity: 10.0, price: 215000, image: 'img/products/bat-sigen-hv.svg', extra: 'Módulo Modular SigenStor · 300-900V HV' },
      { id: 'bat_livoltek_bhf_e10', name: 'LIVOLTEK High-Voltage Battery BHF-E10 · 10.2 kWh (102.4V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 10.2, price: 215000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 102.4V-HV' },
      { id: 'bat_livoltek_bhf_e15', name: 'LIVOLTEK High-Voltage Battery BHF-E15 · 15.4 kWh (153.6V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 15.4, price: 295000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 153.6V-HV' },
      { id: 'bat_livoltek_bhf_e20', name: 'LIVOLTEK High-Voltage Battery BHF-E20 · 20.5 kWh (204.8V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 20.5, price: 375000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 204.8V-HV' },
      { id: 'bat_livoltek_bhf_e25', name: 'LIVOLTEK High-Voltage Battery BHF-E25 · 25.6 kWh (256V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 25.6, price: 450000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 256V-HV' },
      { id: 'bat_livoltek_bhf_e30', name: 'LIVOLTEK High-Voltage Battery BHF-E30 · 30.7 kWh (307.2V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 30.7, price: 520000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 307.2V-HV' },
      { id: 'bat_livoltek_bhf_e35', name: 'LIVOLTEK High-Voltage Battery BHF-E35 · 35.8 kWh (358.4V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 35.8, price: 590000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 358.4V-HV' },
      { id: 'bat_livoltek_bhf_e40', name: 'LIVOLTEK High-Voltage Battery BHF-E40 · 41.0 kWh (409.6V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 41.0, price: 660000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 409.6V-HV' },
      { id: 'bat_livoltek_bhf_e45', name: 'LIVOLTEK High-Voltage Battery BHF-E45 · 46.1 kWh (460.8V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 46.1, price: 730000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 460.8V-HV' },
      { id: 'bat_livoltek_bhf_e50', name: 'LIVOLTEK High-Voltage Battery BHF-E50 · 51.2 kWh (512.0V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 51.2, price: 800000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 512.0V-HV' },
      { id: 'bat_livoltek_bhf_e55', name: 'LIVOLTEK High-Voltage Battery BHF-E55 · 56.3 kWh (563.2V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 56.3, price: 870000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 563.2V-HV' },
      { id: 'bat_livoltek_bhf_e60', name: 'LIVOLTEK High-Voltage Battery BHF-E60 · 61.4 kWh (614.4V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 61.4, price: 940000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 614.4V-HV' }
    ]
  };

  function getProductImage(category, item) {
    if (item && item.image) return item.image;
    const name = ((item && item.name) || '').toLowerCase();
    const brand = ((item && item.brand) || '').toLowerCase();

    if (category === 'panels' || (item && item.power > 100 && !item.voltageType)) {
      if (name.includes('canadian') || brand.includes('canadian')) return 'img/products/panel-canadian.svg';
      if (name.includes('ja') || brand.includes('ja')) return 'img/products/panel-ja.svg';
      if (name.includes('longi') || brand.includes('longi')) return 'img/products/panel-longi.svg';
      return 'img/products/panel-jinko.svg';
    }

    if (category === 'inverters' || (item && item.voltageType && !item.capacity)) {
      if (name.includes('megatron') || brand.includes('megatron')) return 'img/products/inv-megatron-lv.svg';
      if (name.includes('sigen') || brand.includes('sigen')) return 'img/products/inv-sigen-hv.svg';
      if (name.includes('livoltek') || brand.includes('livoltek')) return 'img/products/inv-livoltek-lv.svg';
      return 'img/products/inv-deye-lv.svg';
    }

    if (category === 'batteries' || (item && item.capacity)) {
      if (name.includes('megatron') || brand.includes('megatron')) return 'img/products/bat-megatron-lv.svg';
      if (name.includes('sigen') || brand.includes('sigen')) return 'img/products/bat-sigen-hv.svg';
      if (name.includes('livoltek') || brand.includes('livoltek')) return 'img/products/bat-livoltek-bhf.svg';
      return 'img/products/bat-deye-lv.svg';
    }

    return 'img/products/panel-jinko.svg';
  }

  function ensureProductImages(productsObj) {
    if (!productsObj) return;
    ['panels', 'inverters', 'batteries'].forEach((cat) => {
      if (Array.isArray(productsObj[cat])) {
        productsObj[cat].forEach((item) => {
          if (!item.image) {
            item.image = getProductImage(cat, item);
          }
        });
      }
    });
  }

  function cloneDefaults() {
    const cloned = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    ensureProductImages(cloned);
    return cloned;
  }

  function sanitizeImageUrl(url, fallback) {
    const clean = String(url || '').trim();
    if (!clean) return fallback || '';
    if (/^img\/products\/[a-zA-Z0-9._-]+\.(svg|png|jpe?g|webp)$/i.test(clean)) {
      return clean;
    }
    if (/^https?:\/\/[^\s"'<>]+$/i.test(clean)) {
      return clean;
    }
    if (/^data:image\/[a-zA-Z0-9.+_-]+;base64,/i.test(clean) && !/[<>"'\r\n]/.test(clean)) {
      return clean;
    }
    return fallback || 'img/products/panel-jinko.svg';
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Remove apenas IDs obsoletos de versões legadas, SEM reinserir produtos apagados pelo Admin.
   */
  function stripLegacyObsoleteProducts(parsed) {
    if (!parsed) return parsed;
    if (Array.isArray(parsed.panels)) {
      parsed.panels = parsed.panels.filter((p) => {
        if (OBSOLETE_PRODUCT_IDS.includes(p.id)) return false;
        const n = (p.name || '').toLowerCase();
        if (n.includes('570 wp') || n.includes('550 wp') || n.includes('580 wp deepblue') || n.includes('540 wp')) return false;
        return true;
      });
    }
    if (Array.isArray(parsed.inverters)) {
      parsed.inverters = parsed.inverters.filter((i) => !OBSOLETE_PRODUCT_IDS.includes(i.id));
    }
    if (Array.isArray(parsed.batteries)) {
      parsed.batteries = parsed.batteries.filter((b) => !OBSOLETE_PRODUCT_IDS.includes(b.id));
    }
    ensureProductImages(parsed);
    return parsed;
  }

  return {
    STORAGE_KEY_PRODUCTS,
    OBSOLETE_PRODUCT_IDS,
    DEFAULT_PRODUCTS,
    getProductImage,
    ensureProductImages,
    cloneDefaults,
    sanitizeImageUrl,
    escapeHtml,
    stripLegacyObsoleteProducts
  };
}));

