/**
 * LECASU — Catálogo Padrão Compartilhado & Utilitários Técnicos
 * Fonte única de verdade para o Servidor Node.js, Simulador do Cliente e Portal Admin.
 * Atualizado: 2026-11-13 — Preços reais aplicados conforme lista oficial LECASU LDA
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LecasuCatalog = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  const STORAGE_KEY_PRODUCTS = 'lecasu_admin_products_v4';

  const OBSOLETE_PRODUCT_IDS = [
    'p_jinko_570', 'p_canadian_550', 'p_ja_580', 'p_longi_540',
    'inv_deye_5k', 'inv_deye_6k', 'inv_deye_8k', 'inv_deye_10k', 'inv_deye_12k',
    'inv_growatt_5k', 'inv_victron_15k', 'inv_huawei_20k',
    'bat_deye_512', 'bat_pylon_48', 'bat_dyness_48', 'bat_deye_1024',
    'bat_pylon_35k', 'bat_byd_10k', 'bat_tesla_14k',
    // IDs antigos substituídos pelos códigos SKU oficiais
    'p_jinko_tiger_neo_600_bdv', 'p_jinko_tiger_neo_605_bdv', 'p_jinko_tiger_neo_610_bdv',
    'p_jinko_tiger_neo_615_bdv', 'p_jinko_tiger_neo_620_bdv', 'p_jinko_tiger_neo_625_bdv',
    'inv_megatron_5k_lv', 'inv_deye_5k_1ph', 'inv_livoltek_6k_split', 'inv_livoltek_12k_split',
    'inv_megatron_12k_lv', 'inv_deye_12k_3ph_lv', 'inv_deye_20k_3ph_lv',
    'inv_livoltek_5k_3ph', 'inv_livoltek_12k_3ph', 'inv_livoltek_16k_3ph',
    'inv_sigen_5k_3ph_hv', 'inv_sigen_6k_3ph_hv', 'inv_sigen_10k_3ph_hv',
    'inv_sigen_15k_3ph_hv', 'inv_sigen_20k_3ph_hv', 'inv_sigen_25k_3ph_hv',
    'bat_megatron_512_lv', 'bat_megatron_16k_lv', 'bat_deye_512_lv', 'bat_deye_rw_m61_lv',
    'bat_sigen_5k_hv', 'bat_sigen_6k_hv', 'bat_sigen_8k_hv', 'bat_sigen_10k_hv',
    'bat_livoltek_bhf_e10', 'bat_livoltek_bhf_e15', 'bat_livoltek_bhf_e20', 'bat_livoltek_bhf_e25',
    'bat_livoltek_bhf_e30', 'bat_livoltek_bhf_e35', 'bat_livoltek_bhf_e40',
    'bat_livoltek_bhf_e45', 'bat_livoltek_bhf_e50', 'bat_livoltek_bhf_e55', 'bat_livoltek_bhf_e60'
  ];

  // ============================================================
  // CATÁLOGO OFICIAL LECASU LDA — Lista de Preços Atualizada
  // Preços incluem IVA 16% (PVP com IVA MT) conforme tabela oficial
  // SKU/Código conforme sistema interno LECASU
  // ============================================================
  const DEFAULT_PRODUCTS = {

    // ─────────────────────────────────────────────────────────
    // PAINÉIS SOLARES
    // ─────────────────────────────────────────────────────────
    panels: [
      {
        id: 'PV-JINKO-620-001',
        name: 'Painel Solar Jinko Tiger Neo 620Wp (N-Type Bifacial)',
        brand: 'Jinko Solar',
        series: 'Tiger Neo N-Type',
        panelType: 'bifacial_dual_glass',
        cellTech: 'Monocristalino N-Type (SMBB / Half-Cut)',
        cells: '132 células (2x66)',
        power: 620,
        price: 9996,
        efficiency: '22.96%',
        vMax: '1500 V DC',
        dimensions: '2382 × 1134 × 30 mm',
        weight: '32.4 kg',
        warranty: '12 anos produto / 30 anos linear',
        image: 'img/products/panel-jinko.svg',
        extra: 'SKU: PV-JINKO-620-001 · Bifacial Vidro Duplo · Efic. 22.96% · N-Type · 1500V · IVA incl.'
      },
      {
        id: 'PV-CAN-460-001',
        name: 'Painel Solar Canadian Solar 460Wp (HiKu6 Mono PERC)',
        brand: 'Canadian Solar',
        series: 'HiKu6 CS6W-MS',
        panelType: 'monofacial',
        cellTech: 'Monocristalino PERC (Half-Cut)',
        cells: '144 células (6×24)',
        power: 460,
        price: 7662,
        efficiency: '21.4%',
        vMax: '1500 V DC',
        dimensions: '2108 × 1048 × 35 mm',
        weight: '24.9 kg',
        warranty: '12 anos produto / 25 anos linear',
        image: 'img/products/panel-canadian.svg',
        extra: 'SKU: PV-CAN-620-001 / PV-CAN-460-001 · Mono PERC Half-Cut · Efic. 21.4% · 1500V · IVA incl.'
      }
    ],

    // ─────────────────────────────────────────────────────────
    // INVERSORES HÍBRIDOS & OFF-GRID
    // Ordenados por: Marca → Tensão (LV → HV) → Potência crescente
    // ─────────────────────────────────────────────────────────
    inverters: [
      // ── ANERN — Off-Grid ──
      {
        id: 'INV-ANE-3K-001',
        name: 'ANERN Inversor Off-Grid 3 kW LV (1ph)',
        brand: 'ANERN',
        voltageType: 'LV',
        phase: '1ph',
        power: 3,
        price: 12760,
        image: 'img/products/inv-deye-lv.svg',
        extra: 'SKU: INV-ANE-3K-001 · Off-Grid 3 kW · Monofásico · Baixa Tensão LV · IVA incl.'
      },

      // ── DEYE — Baixa Tensão LV ──
      {
        id: 'INV-DEY-5K-001',
        name: 'DEYE Inversor Híbrido 5 kW LV (1ph)',
        brand: 'Deye',
        voltageType: 'LV',
        phase: '1ph',
        power: 5,
        price: 98366,
        image: 'img/products/inv-deye-lv.svg',
        extra: 'SKU: INV-DEY-5K-001 · Híbrido 5 kW · Monofásico · LV 48V · Dual MPPT · IVA incl.'
      },
      {
        id: 'INV-DEY-8K-002',
        name: 'DEYE Inversor Híbrido 8 kW LV (1ph)',
        brand: 'Deye',
        voltageType: 'LV',
        phase: '1ph',
        power: 8,
        price: 151553,
        image: 'img/products/inv-deye-lv.svg',
        extra: 'SKU: INV-DEY-8K-002 · Híbrido 8 kW · Monofásico · LV 48V · Dual MPPT · IVA incl.'
      },
      {
        id: 'INV-DEY-12K-003',
        name: 'DEYE Inversor Híbrido 12 kW LV (3ph)',
        brand: 'Deye',
        voltageType: 'LV',
        phase: '3ph',
        power: 12,
        price: 236438,
        image: 'img/products/inv-deye-lv.svg',
        extra: 'SKU: INV-DEY-12K-003 · Híbrido 12 kW · Trifásico · LV 48V · Paralelizável · IVA incl.'
      },
      {
        id: 'INV-DEY-20K-004',
        name: 'DEYE Inversor Híbrido 20 kW LV (3ph)',
        brand: 'Deye',
        voltageType: 'LV',
        phase: '3ph',
        power: 20,
        price: 355703,
        image: 'img/products/inv-deye-lv.svg',
        extra: 'SKU: INV-DEY-20K-004 · Híbrido 20 kW · Trifásico · LV 48V · Paralelizável · IVA incl.'
      },

      // ── DEYE — Alta Tensão HV ──
      {
        id: 'INV-DEY-30K-005',
        name: 'DEYE Inversor Híbrido 30 kW HV (3ph)',
        brand: 'Deye',
        voltageType: 'HV',
        phase: '3ph',
        power: 30,
        price: 381753,
        image: 'img/products/inv-deye-lv.svg',
        extra: 'SKU: INV-DEY-30K-005 · Híbrido 30 kW · Trifásico · HV Alta Tensão · IVA incl.'
      },
      {
        id: 'INV-DEY-50K-006',
        name: 'DEYE Inversor Híbrido 50 kW HV (3ph)',
        brand: 'Deye',
        voltageType: 'HV',
        phase: '3ph',
        power: 50,
        price: 520863,
        image: 'img/products/inv-deye-lv.svg',
        extra: 'SKU: INV-DEY-50K-006 · Híbrido 50 kW · Trifásico · HV Alta Tensão · IVA incl.'
      },
      {
        id: 'INV-DEY-100K-007',
        name: 'DEYE Inversor Híbrido 100 kW HV (3ph)',
        brand: 'Deye',
        voltageType: 'HV',
        phase: '3ph',
        power: 100,
        price: 1095030,
        image: 'img/products/inv-deye-lv.svg',
        extra: 'SKU: INV-DEY-100K-007 · Híbrido 100 kW · Trifásico · HV Alta Tensão · IVA incl.'
      },

      // ── LIVOLTEK — Alta Tensão HV ──
      {
        id: 'INV-LIV-12K-002',
        name: 'LIVOLTEK HP4 Inversor Híbrido 12 kW HV (3ph)',
        brand: 'LIVOLTEK',
        voltageType: 'HV',
        phase: '3ph',
        power: 12,
        price: 233625,
        image: 'img/products/inv-livoltek-lv.svg',
        extra: 'SKU: INV-LIV-12K-002 · HP4 Híbrido 12 kW · Trifásico · HV Alta Tensão · IVA incl.'
      },
      {
        id: 'INV-LIV-30K-001',
        name: 'LIVOLTEK HP3 Inversor Híbrido 30 kW HV (3ph)',
        brand: 'LIVOLTEK',
        voltageType: 'HV',
        phase: '3ph',
        power: 30,
        price: 109626,
        image: 'img/products/inv-livoltek-lv.svg',
        extra: 'SKU: INV-LIV-30K-001 · HP3 Híbrido 30 kW · Trifásico · HV Alta Tensão · IVA incl.'
      },

      // ── MEGATRON — Baixa Tensão LV ──
      {
        id: 'INV-MEG-3K-001',
        name: 'MEGATRON Inversor Híbrido 3 kW LV (1ph)',
        brand: 'MEGATRON',
        voltageType: 'LV',
        phase: '1ph',
        power: 3,
        price: 24935,
        image: 'img/products/inv-megatron-lv.svg',
        extra: 'SKU: INV-MEG-3K-001 · Híbrido 3 kW · Monofásico · LV 48V · IVA incl.'
      },
      {
        id: 'INV-MEG-5K-001',
        name: 'MEGATRON Inversor Híbrido 5 kW LV (1ph)',
        brand: 'MEGATRON',
        voltageType: 'LV',
        phase: '1ph',
        power: 5,
        price: 48829,
        image: 'img/products/inv-megatron-lv.svg',
        extra: 'SKU: INV-MEG-5K-001 · Híbrido 5 kW · Monofásico · LV 48V · IVA incl.'
      },
      {
        id: 'INV-MEG-12K-002',
        name: 'MEGATRON Inversor Híbrido 12 kW LV (3ph)',
        brand: 'MEGATRON',
        voltageType: 'LV',
        phase: '3ph',
        power: 12,
        price: 85451,
        image: 'img/products/inv-megatron-lv.svg',
        extra: 'SKU: INV-MEG-12K-002 · Híbrido 12 kW · Trifásico · LV 48V · IVA incl.'
      }
    ],

    // ─────────────────────────────────────────────────────────
    // BATERIAS & ARMAZENAMENTO DE ENERGIA (BESS)
    // Ordenadas por: Tensão (LV → HV) → Marca → Capacidade crescente
    // ─────────────────────────────────────────────────────────
    batteries: [
      // ── Baterias Baixa Tensão (LV) ──
      {
        id: 'BAT-HZS-12-200-001',
        name: 'HZ Solar Bateria Gel 12V 200Ah (2.4 kWh LV)',
        brand: 'HZ Solar',
        voltageType: 'LV',
        subcategory: 'lv_rack',
        capacity: 2.4,
        price: 20305,
        image: 'img/products/bat-deye-lv.svg',
        extra: 'SKU: BAT-HZS-12/200-001 · Gel 12V 200Ah · Ciclo Profundo · Uso Solar · IVA incl.'
      },
      {
        id: 'BAT-MEG-5120-001',
        name: 'MEGATRON Bateria LiFePO4 5.12 kWh (51.2V LV)',
        brand: 'MEGATRON',
        voltageType: 'LV',
        subcategory: 'megatron_lv',
        capacity: 5.12,
        price: 83396,
        image: 'img/products/bat-megatron-lv.svg',
        extra: 'SKU: BAT-MEG-5120-001 · LiFePO4 Mural/Rack · 51.2V 100Ah · 6000+ Ciclos · IVA incl.'
      },
      {
        id: 'BAT-MEG-1680-002',
        name: 'MEGATRON Bateria LiFePO4 16.80 kWh (51.2V LV)',
        brand: 'MEGATRON',
        voltageType: 'LV',
        subcategory: 'megatron_lv',
        capacity: 16.8,
        price: 179013,
        image: 'img/products/bat-megatron-lv.svg',
        extra: 'SKU: BAT-MEG-1680-002 · LiFePO4 Alta Capacidade · 51.2V 280Ah · 6000+ Ciclos · IVA incl.'
      },
      {
        id: 'BAT-DEY-5120-001',
        name: 'DEYE Bateria LiFePO4 5.12 kWh (51.2V LV)',
        brand: 'Deye',
        voltageType: 'LV',
        subcategory: 'lv_rack',
        capacity: 5.12,
        price: 111434,
        image: 'img/products/bat-deye-lv.svg',
        extra: 'SKU: BAT-DEY-5120-001 · LiFePO4 Mural/Rack · 51.2V 100Ah · 6000+ Ciclos · IVA incl.'
      },
      {
        id: 'BAT-DYN-5120-001',
        name: 'DYNESS Bateria LiFePO4 5.12 kWh (LV)',
        brand: 'DYNESS',
        voltageType: 'LV',
        subcategory: 'lv_rack',
        capacity: 5.12,
        price: 99931,
        image: 'img/products/bat-deye-lv.svg',
        extra: 'SKU: BAT-DYN-5120-001 · LiFePO4 · 5.12 kWh LV · Modular Rack · IVA incl.'
      },

      // ── Baterias Alta Tensão (HV) ──
      {
        id: 'BAT-LIV-5020-001',
        name: 'LIVOLTEK BHF Bateria Li-Ion HV IP65 (5.0 kWh)',
        brand: 'LIVOLTEK',
        voltageType: 'HV',
        subcategory: 'livoltek_bhf',
        capacity: 5.0,
        price: 62350,
        image: 'img/products/bat-livoltek-bhf.svg',
        extra: 'SKU: BAT-LIV-5020-001 · Li-Ion HV IP65 · BHF Series · Alta Tensão · IVA incl.'
      },
      {
        id: 'BHF-HV-CB-IP65',
        name: 'LIVOLTEK BHF HV Battery Control Box IP65',
        brand: 'LIVOLTEK',
        voltageType: 'HV',
        subcategory: 'livoltek_bhf',
        capacity: 0.1,
        price: 85645,
        image: 'img/products/bat-livoltek-bhf.svg',
        extra: 'SKU: BHF HV ControlBox IP65 · Quadro Elétrico HV · Caixa de Controlo Bateria · IVA incl.'
      }
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
    if (!url) return fallback || '';
    const clean = String(url).trim();
    if (!clean) return fallback || '';
    // Suporte robusto para fotos enviadas via upload (data:image/...)
    if (clean.startsWith('data:image/') && !/[<>"']/.test(clean)) {
      return clean;
    }
    // Caminhos relativos de assets locais
    if (/^img\/products\/[a-zA-Z0-9._-]+\.(svg|png|jpe?g|webp)$/i.test(clean)) {
      return clean;
    }
    // URLs HTTP/HTTPS externas
    if (/^https?:\/\/[^\s"'<>]+$/i.test(clean)) {
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
