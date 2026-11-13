/**
 * LECASU — Catálogo Padrão Compartilhado & Utilitários de Equipamentos
 * Fonte única de verdade para o Servidor Node.js, MySQL, Portal do Cliente e Portal Admin.
 * Atualizado: 2026-11-13 — Imagens reais dos equipamentos e categorização estruturada
 * por Categoria | Marca | Tensão Nominal.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LecasuCatalog = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  const STORAGE_KEY_PRODUCTS = 'lecasu_admin_products_v5';
  const STORAGE_KEY_CUSTOM_IMAGES = 'lecasu_custom_images_v1';

  // Apenas IDs muito antigos (v1) que foram descontinuados há muito tempo
  const OBSOLETE_PRODUCT_IDS = [
    'p_jinko_570', 'p_canadian_550', 'p_ja_580', 'p_longi_540',
    'inv_deye_5k', 'inv_deye_6k', 'inv_deye_8k', 'inv_deye_10k', 'inv_deye_12k',
    'inv_growatt_5k', 'inv_victron_15k', 'inv_huawei_20k',
    'bat_deye_512', 'bat_pylon_48', 'bat_dyness_48', 'bat_deye_1024',
    'bat_pylon_35k', 'bat_byd_10k', 'bat_tesla_14k'
  ];

  // ============================================================
  // CATÁLOGO OFICIAL LECASU LDA — Organizado por Categoria, Marca e Tensão Nominal
  // ============================================================
  const DEFAULT_PRODUCTS = {

    // ─────────────────────────────────────────────────────────
    // PAINÉIS SOLARES
    // ─────────────────────────────────────────────────────────
    panels: [
      {
        id: 'p_jinko_tiger_neo_600_bdv',
        sku: 'JKM600N-66HL4M-BDV',
        name: 'Painel Solar Jinko Tiger Neo N-Type Bifacial 600W',
        categoryGroup: 'Painéis Solares N-Type Bifaciais (Dual Glass)',
        brand: 'Jinko Solar',
        nominalVoltage: '40.16V Vmp / 48.28V Voc (Máx. 1500V DC)',
        panelType: 'bifacial_dual_glass',
        power: 600,
        price: 8000,
        image: 'img/products/panel-jinko.png',
        extra: ''
      },
      {
        id: 'p_jinko_tiger_neo_605_bdv',
        sku: 'JKM605N-66HL4M-BDV',
        name: 'Painel Solar Jinko Tiger Neo N-Type Bifacial 605W',
        categoryGroup: 'Painéis Solares N-Type Bifaciais (Dual Glass)',
        brand: 'Jinko Solar',
        nominalVoltage: '40.31V Vmp / 48.48V Voc (Máx. 1500V DC)',
        panelType: 'bifacial_dual_glass',
        power: 605,
        price: 8100,
        image: 'img/products/panel-jinko.png',
        extra: ''
      },
      {
        id: 'p_jinko_tiger_neo_610_bdv',
        sku: 'JKM610N-66HL4M-BDV',
        name: 'Painel Solar Jinko Tiger Neo N-Type Bifacial 610W',
        categoryGroup: 'Painéis Solares N-Type Bifaciais (Dual Glass)',
        brand: 'Jinko Solar',
        nominalVoltage: '40.46V Vmp / 48.68V Voc (Máx. 1500V DC)',
        panelType: 'bifacial_dual_glass',
        power: 610,
        price: 8200,
        image: 'img/products/panel-jinko.png',
        extra: ''
      },
      {
        id: 'p_jinko_tiger_neo_615_bdv',
        sku: 'JKM615N-66HL4M-BDV',
        name: 'Painel Solar Jinko Tiger Neo N-Type Bifacial 615W',
        categoryGroup: 'Painéis Solares N-Type Bifaciais (Dual Glass)',
        brand: 'Jinko Solar',
        nominalVoltage: '40.60V Vmp / 48.88V Voc (Máx. 1500V DC)',
        panelType: 'bifacial_dual_glass',
        power: 615,
        price: 8300,
        image: 'img/products/panel-jinko.png',
        extra: ''
      },
      {
        id: 'p_jinko_tiger_neo_620_bdv',
        sku: 'JKM620N-66HL4M-BDV',
        name: 'Painel Solar Jinko Tiger Neo N-Type Bifacial 620W',
        categoryGroup: 'Painéis Solares N-Type Bifaciais (Dual Glass)',
        brand: 'Jinko Solar',
        nominalVoltage: '40.74V Vmp / 49.08V Voc (Máx. 1500V DC)',
        panelType: 'bifacial_dual_glass',
        power: 620,
        price: 9996,
        image: 'img/products/panel-jinko.png',
        extra: ''
      },
      {
        id: 'p_jinko_tiger_neo_625_bdv',
        sku: 'JKM625N-66HL4M-BDV',
        name: 'Painel Solar Jinko Tiger Neo N-Type Bifacial 625W',
        categoryGroup: 'Painéis Solares N-Type Bifaciais (Dual Glass)',
        brand: 'Jinko Solar',
        nominalVoltage: '40.88V Vmp / 49.28V Voc (Máx. 1500V DC)',
        panelType: 'bifacial_dual_glass',
        power: 625,
        price: 8500,
        image: 'img/products/panel-jinko.png',
        extra: ''
      },
      {
        id: 'PV-CAN-460-001',
        sku: 'PV-CAN-620-001',
        name: 'Painel Solar Canadian Solar 460Wp (HiKu6 Mono PERC)',
        categoryGroup: 'Painéis Solares Monocristalinos PERC',
        brand: 'Canadian Solar',
        nominalVoltage: '41.6V Vmp / 49.6V Voc (Máx. 1500V DC)',
        panelType: 'monofacial',
        power: 460,
        price: 7662,
        image: 'img/products/panel-canadian.png',
        extra: ''
      }
    ],

    // ─────────────────────────────────────────────────────────
    // INVERSORES HÍBRIDOS & CONTROLADORES
    // ─────────────────────────────────────────────────────────
    inverters: [
      // ── Deye — Baixa Tensão (LV) ──
      {
        id: 'inv_deye_5k_1ph',
        sku: 'DEYE-INV-HIB-5KW-1PH-LV',
        name: 'Deye Híbrido 5 kW 1ph LV-48',
        categoryGroup: 'Inversores Híbridos Baixa Tensão (LV)',
        brand: 'Deye',
        nominalVoltage: '48V (LV)',
        voltageType: 'LV',
        phase: '1ph',
        power: 5,
        price: 98366,
        image: 'img/products/inv-deye.png',
        extra: ''
      },
      {
        id: 'INV-DEY-8K-002',
        sku: 'DEYE-INV-HIB-8KW-1PH-LV',
        name: 'Deye Híbrido 8 kW 1ph LV-48',
        categoryGroup: 'Inversores Híbridos Baixa Tensão (LV)',
        brand: 'Deye',
        nominalVoltage: '48V (LV)',
        voltageType: 'LV',
        phase: '1ph',
        power: 8,
        price: 151553,
        image: 'img/products/inv-deye.png',
        extra: ''
      },
      {
        id: 'inv_deye_12k_3ph_lv',
        sku: 'DEYE-INV-HIB-12KW-3PH-LV',
        name: 'Deye Híbrido 12 kW 3ph LV-48',
        categoryGroup: 'Inversores Híbridos Baixa Tensão (LV)',
        brand: 'Deye',
        nominalVoltage: '48V (LV)',
        voltageType: 'LV',
        phase: '3ph',
        power: 12,
        price: 236438,
        image: 'img/products/inv-deye.png',
        extra: ''
      },
      {
        id: 'inv_deye_20k_3ph_lv',
        sku: 'DEYE-INV-HIB-20KW-3PH-LV',
        name: 'Deye Híbrido 20 kW 3ph LV-48',
        categoryGroup: 'Inversores Híbridos Baixa Tensão (LV)',
        brand: 'Deye',
        nominalVoltage: '48V (LV)',
        voltageType: 'LV',
        phase: '3ph',
        power: 20,
        price: 355703,
        image: 'img/products/inv-deye.png',
        extra: ''
      },

      // ── LIVOLTEK — Baixa Tensão (LV) ──
      {
        id: 'inv_livoltek_6k_split',
        sku: 'LIV-INV-SP-6KW-LV',
        name: 'LIVOLTEK Split-Phase 6 kW 2/3 MPPT LV-48',
        categoryGroup: 'Inversores Híbridos Baixa Tensão (LV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '48V (LV)',
        voltageType: 'LV',
        phase: 'split',
        power: 6,
        price: 115000,
        image: 'img/products/inv-livoltek.png',
        extra: ''
      },
      {
        id: 'inv_livoltek_12k_split',
        sku: 'LIV-INV-SP-12KW-LV',
        name: 'LIVOLTEK Split-Phase 12 kW 2/3 MPPT LV-48',
        categoryGroup: 'Inversores Híbridos Baixa Tensão (LV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '48V (LV)',
        voltageType: 'LV',
        phase: 'split',
        power: 12,
        price: 195000,
        image: 'img/products/inv-livoltek.png',
        extra: ''
      },
      {
        id: 'inv_livoltek_5k_3ph',
        sku: 'LIV-INV-3PH-5KW-LV',
        name: 'LIVOLTEK Three-Phase Híbrido 5 kW 2 MPPT LV-48',
        categoryGroup: 'Inversores Híbridos Baixa Tensão (LV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '48V (LV)',
        voltageType: 'LV',
        phase: '3ph',
        power: 5,
        price: 110000,
        image: 'img/products/inv-livoltek.png',
        extra: ''
      },
      {
        id: 'inv_livoltek_12k_3ph',
        sku: 'LIV-INV-3PH-12KW-LV',
        name: 'LIVOLTEK Three-Phase Híbrido 12 kW 2 MPPT LV-48',
        categoryGroup: 'Inversores Híbridos Baixa Tensão (LV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '48V (LV)',
        voltageType: 'LV',
        phase: '3ph',
        power: 12,
        price: 198000,
        image: 'img/products/inv-livoltek.png',
        extra: ''
      },
      {
        id: 'inv_livoltek_16k_3ph',
        sku: 'LIV-INV-3PH-16KW-LV',
        name: 'LIVOLTEK Three-Phase Híbrido 16 kW 2/3 MPPT LV-48',
        categoryGroup: 'Inversores Híbridos Baixa Tensão (LV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '48V (LV)',
        voltageType: 'LV',
        phase: '3ph',
        power: 16,
        price: 235000,
        image: 'img/products/inv-livoltek.png',
        extra: ''
      },

      // ── MEGATRON & ANERN — Baixa Tensão (LV) ──
      {
        id: 'INV-ANE-3K-001',
        sku: 'INV-ANE-3K-001',
        name: 'ANERN Inversor Off-Grid 3 kW 1ph LV',
        categoryGroup: 'Inversores Híbridos Baixa Tensão (LV)',
        brand: 'ANERN',
        nominalVoltage: '48V (LV)',
        voltageType: 'LV',
        phase: '1ph',
        power: 3,
        price: 12760,
        image: 'img/products/inv-anern.png',
        extra: ''
      },
      {
        id: 'INV-MEG-3K-001',
        sku: 'INV-MEG-3K-001',
        name: 'Inversor Híbrido MEGATRON 3 kW 1ph LV-48',
        categoryGroup: 'Inversores Híbridos Baixa Tensão (LV)',
        brand: 'MEGATRON',
        nominalVoltage: '48V (LV)',
        voltageType: 'LV',
        phase: '1ph',
        power: 3,
        price: 24935,
        image: 'img/products/inv-megatron.png',
        extra: ''
      },
      {
        id: 'inv_megatron_5k_lv',
        sku: 'INV-MEG-5K-001',
        name: 'Inversor Híbrido MEGATRON 5 kW 1ph LV-48',
        categoryGroup: 'Inversores Híbridos Baixa Tensão (LV)',
        brand: 'MEGATRON',
        nominalVoltage: '48V (LV)',
        voltageType: 'LV',
        phase: '1ph',
        power: 5,
        price: 48829,
        image: 'img/products/inv-megatron.png',
        extra: ''
      },
      {
        id: 'inv_megatron_12k_lv',
        sku: 'INV-MEG-12K-002',
        name: 'Inversor Híbrido MEGATRON 12 kW 3ph LV-48',
        categoryGroup: 'Inversores Híbridos Baixa Tensão (LV)',
        brand: 'MEGATRON',
        nominalVoltage: '48V (LV)',
        voltageType: 'LV',
        phase: '3ph',
        power: 12,
        price: 85451,
        image: 'img/products/inv-megatron.png',
        extra: ''
      },

      // ── Sigenergy — Controladores e Inversores Alta Tensão (HV) ──
      {
        id: 'inv_sigen_5k_3ph_hv',
        sku: 'SIG-EC-5KW-3PH-HV',
        name: 'Sigen Energy Controller All-in-one 5 kW Three Phase HV-900',
        categoryGroup: 'Controladores e Inversores Alta Tensão (HV)',
        brand: 'Sigenergy',
        nominalVoltage: '900V (HV)',
        voltageType: 'HV',
        phase: '3ph',
        power: 5,
        price: 155000,
        image: 'img/products/inv-sigen.png',
        extra: ''
      },
      {
        id: 'inv_sigen_6k_3ph_hv',
        sku: 'SIG-EC-6KW-3PH-HV',
        name: 'Sigen Energy Controller All-in-one 6 kW Three Phase HV-900',
        categoryGroup: 'Controladores e Inversores Alta Tensão (HV)',
        brand: 'Sigenergy',
        nominalVoltage: '900V (HV)',
        voltageType: 'HV',
        phase: '3ph',
        power: 6,
        price: 170000,
        image: 'img/products/inv-sigen.png',
        extra: ''
      },
      {
        id: 'inv_sigen_10k_3ph_hv',
        sku: 'SIG-EC-10KW-3PH-HV',
        name: 'Sigen Energy Controller All-in-one 10 kW Three Phase HV-900',
        categoryGroup: 'Controladores e Inversores Alta Tensão (HV)',
        brand: 'Sigenergy',
        nominalVoltage: '900V (HV)',
        voltageType: 'HV',
        phase: '3ph',
        power: 10,
        price: 215000,
        image: 'img/products/inv-sigen.png',
        extra: ''
      },
      {
        id: 'inv_sigen_15k_3ph_hv',
        sku: 'SIG-EC-15KW-3PH-HV',
        name: 'Sigen Energy Controller All-in-one 15 kW Three Phase HV-900',
        categoryGroup: 'Controladores e Inversores Alta Tensão (HV)',
        brand: 'Sigenergy',
        nominalVoltage: '900V (HV)',
        voltageType: 'HV',
        phase: '3ph',
        power: 15,
        price: 265000,
        image: 'img/products/inv-sigen.png',
        extra: ''
      },
      {
        id: 'inv_sigen_20k_3ph_hv',
        sku: 'SIG-EC-20KW-3PH-HV',
        name: 'Sigen Energy Controller All-in-one 20 kW Three Phase HV-900',
        categoryGroup: 'Controladores e Inversores Alta Tensão (HV)',
        brand: 'Sigenergy',
        nominalVoltage: '900V (HV)',
        voltageType: 'HV',
        phase: '3ph',
        power: 20,
        price: 310000,
        image: 'img/products/inv-sigen.png',
        extra: ''
      },
      {
        id: 'inv_sigen_25k_3ph_hv',
        sku: 'SIG-EC-25KW-3PH-HV',
        name: 'Sigen Energy Controller All-in-one 25 kW Three Phase HV-900',
        categoryGroup: 'Controladores e Inversores Alta Tensão (HV)',
        brand: 'Sigenergy',
        nominalVoltage: '900V (HV)',
        voltageType: 'HV',
        phase: '3ph',
        power: 25,
        price: 360000,
        image: 'img/products/inv-sigen.png',
        extra: ''
      },

      // ── Deye & LIVOLTEK — Alta Tensão (HV) ──
      {
        id: 'INV-DEY-30K-005',
        sku: 'INV-DEY-30K-005',
        name: 'Deye Híbrido 30 kW 3ph HV',
        categoryGroup: 'Controladores e Inversores Alta Tensão (HV)',
        brand: 'Deye',
        nominalVoltage: '900V (HV)',
        voltageType: 'HV',
        phase: '3ph',
        power: 30,
        price: 381753,
        image: 'img/products/inv-deye.png',
        extra: ''
      },
      {
        id: 'INV-DEY-50K-006',
        sku: 'INV-DEY-50K-006',
        name: 'Deye Híbrido 50 kW 3ph HV',
        categoryGroup: 'Controladores e Inversores Alta Tensão (HV)',
        brand: 'Deye',
        nominalVoltage: '900V (HV)',
        voltageType: 'HV',
        phase: '3ph',
        power: 50,
        price: 520863,
        image: 'img/products/inv-deye.png',
        extra: ''
      },
      {
        id: 'INV-DEY-100K-007',
        sku: 'INV-DEY-100K-007',
        name: 'Deye Híbrido 100 kW 3ph HV',
        categoryGroup: 'Controladores e Inversores Alta Tensão (HV)',
        brand: 'Deye',
        nominalVoltage: '900V (HV)',
        voltageType: 'HV',
        phase: '3ph',
        power: 100,
        price: 1095030,
        image: 'img/products/inv-deye.png',
        extra: ''
      },
      {
        id: 'INV-LIV-12K-002',
        sku: 'INV-LIV-12K-002',
        name: 'LIVOLTEK HP4 Inversor Híbrido 12 kW 3ph HV',
        categoryGroup: 'Controladores e Inversores Alta Tensão (HV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '900V (HV)',
        voltageType: 'HV',
        phase: '3ph',
        power: 12,
        price: 233625,
        image: 'img/products/inv-livoltek.png',
        extra: ''
      },
      {
        id: 'INV-LIV-30K-001',
        sku: 'INV-LIV-30K-001',
        name: 'LIVOLTEK HP3 Inversor Híbrido 30 kW 3ph HV',
        categoryGroup: 'Controladores e Inversores Alta Tensão (HV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '900V (HV)',
        voltageType: 'HV',
        phase: '3ph',
        power: 30,
        price: 109626,
        image: 'img/products/inv-livoltek.png',
        extra: ''
      }
    ],

    // ─────────────────────────────────────────────────────────
    // BATERIAS & ARMAZENAMENTO (BESS)
    // ─────────────────────────────────────────────────────────
    batteries: [
      // ── Baixa Tensão (LV) ──
      {
        id: 'bat_deye_512_lv',
        sku: 'DEYE-BAT-LFP-5.12KWH-LV',
        name: 'Deye Battery LiFePO4 100Ah 5.12 kWh 51.2V-LV',
        categoryGroup: 'Baterias de Baixa Tensão (LV)',
        brand: 'Deye',
        nominalVoltage: '51.2V (LV)',
        voltageType: 'LV',
        subcategory: 'lv_rack',
        capacity: 5.12,
        price: 111434,
        image: 'img/products/bat-deye.jpg',
        extra: ''
      },
      {
        id: 'bat_deye_rw_m61_lv',
        sku: 'BAT-DEY-5120-001',
        name: 'DEYE Low Voltage Lithium Battery RW-M6.1 5.12 kWh 51.2V',
        categoryGroup: 'Baterias de Baixa Tensão (LV)',
        brand: 'Deye',
        nominalVoltage: '51.2V (LV)',
        voltageType: 'LV',
        subcategory: 'lv_rack',
        capacity: 5.12,
        price: 111434,
        image: 'img/products/bat-deye.jpg',
        extra: ''
      },
      {
        id: 'bat_megatron_512_lv',
        sku: 'BAT-MEG-5120-001',
        name: 'Bateria MEGATRON LiFePO4 100Ah 5.12 kWh 51.2V-LV',
        categoryGroup: 'Baterias de Baixa Tensão (LV)',
        brand: 'MEGATRON',
        nominalVoltage: '51.2V (LV)',
        voltageType: 'LV',
        subcategory: 'megatron_lv',
        capacity: 5.12,
        price: 83396,
        image: 'img/products/bat-megatron.jpg',
        extra: ''
      },
      {
        id: 'bat_megatron_16k_lv',
        sku: 'BAT-MEG-1680-002',
        name: 'Bateria MEGATRON LiFePO4 280Ah 16.80 kWh 51.2V-LV',
        categoryGroup: 'Baterias de Baixa Tensão (LV)',
        brand: 'MEGATRON',
        nominalVoltage: '51.2V (LV)',
        voltageType: 'LV',
        subcategory: 'megatron_lv',
        capacity: 16.8,
        price: 179013,
        image: 'img/products/bat-megatron.jpg',
        extra: ''
      },
      {
        id: 'BAT-DYN-5120-001',
        sku: 'BAT-DYN-5120-001',
        name: 'Bateria Dyness LiFePO4 5.12 kWh LV',
        categoryGroup: 'Baterias de Baixa Tensão (LV)',
        brand: 'DYNESS',
        nominalVoltage: '51.2V (LV)',
        voltageType: 'LV',
        subcategory: 'lv_rack',
        capacity: 5.12,
        price: 99931,
        image: 'img/products/bat-dyness.png',
        extra: ''
      },
      {
        id: 'BAT-HZS-12-200-001',
        sku: 'BAT-HZS-12/200-001',
        name: 'Bateria de Gel HZ Solar 12V 200Ah (2.4 kWh LV)',
        categoryGroup: 'Baterias de Baixa Tensão (LV)',
        brand: 'HZ Solar',
        nominalVoltage: '12V (LV)',
        voltageType: 'LV',
        subcategory: 'lv_rack',
        capacity: 2.4,
        price: 20305,
        image: 'img/products/bat-hz-gel.webp',
        extra: ''
      },

      // ── Alta Tensão (HV) — Sigenergy ──
      {
        id: 'bat_sigen_5k_hv',
        sku: 'SIG-BAT-5.0KWH-HV',
        name: 'Sigen Battery 5.0 kWh 300-900-HV',
        categoryGroup: 'Baterias de Alta Tensão (HV)',
        brand: 'Sigenergy',
        nominalVoltage: '300-900V (HV)',
        voltageType: 'HV',
        subcategory: 'sigen_hv',
        capacity: 5.0,
        price: 115000,
        image: 'img/products/bat-sigen.webp',
        extra: ''
      },
      {
        id: 'bat_sigen_6k_hv',
        sku: 'SIG-BAT-6.0KWH-HV',
        name: 'Sigen Battery 6.0 kWh 300-900-HV',
        categoryGroup: 'Baterias de Alta Tensão (HV)',
        brand: 'Sigenergy',
        nominalVoltage: '300-900V (HV)',
        voltageType: 'HV',
        subcategory: 'sigen_hv',
        capacity: 6.0,
        price: 135000,
        image: 'img/products/bat-sigen.webp',
        extra: ''
      },
      {
        id: 'bat_sigen_8k_hv',
        sku: 'SIG-BAT-8.0KWH-HV',
        name: 'Sigen Battery 8.0 kWh 300-900-HV',
        categoryGroup: 'Baterias de Alta Tensão (HV)',
        brand: 'Sigenergy',
        nominalVoltage: '300-900V (HV)',
        voltageType: 'HV',
        subcategory: 'sigen_hv',
        capacity: 8.0,
        price: 175000,
        image: 'img/products/bat-sigen.webp',
        extra: ''
      },
      {
        id: 'bat_sigen_10k_hv',
        sku: 'SIG-BAT-10.0KWH-HV',
        name: 'Sigen Battery 10.0 kWh 300-900-HV',
        categoryGroup: 'Baterias de Alta Tensão (HV)',
        brand: 'Sigenergy',
        nominalVoltage: '300-900V (HV)',
        voltageType: 'HV',
        subcategory: 'sigen_hv',
        capacity: 10.0,
        price: 215000,
        image: 'img/products/bat-sigen.webp',
        extra: ''
      },

      // ── Alta Tensão (HV) — LIVOLTEK BHF ──
      {
        id: 'BAT-LIV-5020-001',
        sku: 'BAT-LIV-5020-001',
        name: 'Bateria LIVOLTEK BHF Li-ion HV IP65 5.0 kWh',
        categoryGroup: 'Baterias de Alta Tensão (HV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '102.4V (HV)',
        voltageType: 'HV',
        subcategory: 'livoltek_bhf',
        capacity: 5.0,
        price: 62350,
        image: 'img/products/bat-livoltek-bhf.webp',
        extra: ''
      },
      {
        id: 'BHF-HV-CB-IP65',
        sku: 'BHF HV ControlBox IP65',
        name: 'LIVOLTEK HV Battery Control Box (BHF HV ControlBox IP65)',
        categoryGroup: 'Baterias de Alta Tensão (HV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '102.4V-614.4V (HV)',
        voltageType: 'HV',
        subcategory: 'livoltek_bhf',
        capacity: 0.1,
        price: 85645,
        image: 'img/products/bat-livoltek-bhf.webp',
        extra: ''
      },
      {
        id: 'bat_livoltek_bhf_e10',
        sku: 'LIV-BAT-BHF-E10-HV',
        name: 'LIVOLTEK High-Voltage Residential Battery BHF-E10 10.2 kWh 102.4V-HV',
        categoryGroup: 'Baterias de Alta Tensão (HV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '102.4V (HV)',
        voltageType: 'HV',
        subcategory: 'livoltek_bhf',
        capacity: 10.2,
        price: 215000,
        image: 'img/products/bat-livoltek-bhf.webp',
        extra: ''
      },
      {
        id: 'bat_livoltek_bhf_e15',
        sku: 'LIV-BAT-BHF-E15-HV',
        name: 'LIVOLTEK High-Voltage Residential Battery BHF-E15 15.4 kWh 153.6V-HV',
        categoryGroup: 'Baterias de Alta Tensão (HV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '153.6V (HV)',
        voltageType: 'HV',
        subcategory: 'livoltek_bhf',
        capacity: 15.4,
        price: 295000,
        image: 'img/products/bat-livoltek-bhf.webp',
        extra: ''
      },
      {
        id: 'bat_livoltek_bhf_e20',
        sku: 'LIV-BAT-BHF-E20-HV',
        name: 'LIVOLTEK High-Voltage Residential Battery BHF-E20 20.5 kWh 204.8V-HV',
        categoryGroup: 'Baterias de Alta Tensão (HV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '204.8V (HV)',
        voltageType: 'HV',
        subcategory: 'livoltek_bhf',
        capacity: 20.5,
        price: 375000,
        image: 'img/products/bat-livoltek-bhf.webp',
        extra: ''
      },
      {
        id: 'bat_livoltek_bhf_e25',
        sku: 'LIV-BAT-BHF-E25-HV',
        name: 'LIVOLTEK High-Voltage Residential Battery BHF-E25 25.6 kWh 256V-HV',
        categoryGroup: 'Baterias de Alta Tensão (HV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '256V (HV)',
        voltageType: 'HV',
        subcategory: 'livoltek_bhf',
        capacity: 25.6,
        price: 450000,
        image: 'img/products/bat-livoltek-bhf.webp',
        extra: ''
      },
      {
        id: 'bat_livoltek_bhf_e30',
        sku: 'LIV-BAT-BHF-E30-HV',
        name: 'LIVOLTEK High-Voltage Residential Battery BHF-E30 30.7 kWh 307.2V-HV',
        categoryGroup: 'Baterias de Alta Tensão (HV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '307.2V (HV)',
        voltageType: 'HV',
        subcategory: 'livoltek_bhf',
        capacity: 30.7,
        price: 520000,
        image: 'img/products/bat-livoltek-bhf.webp',
        extra: ''
      },
      {
        id: 'bat_livoltek_bhf_e35',
        sku: 'LIV-BAT-BHF-E35-HV',
        name: 'LIVOLTEK High-Voltage Residential Battery BHF-E35 35.8 kWh 358.4V-HV',
        categoryGroup: 'Baterias de Alta Tensão (HV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '358.4V (HV)',
        voltageType: 'HV',
        subcategory: 'livoltek_bhf',
        capacity: 35.8,
        price: 590000,
        image: 'img/products/bat-livoltek-bhf.webp',
        extra: ''
      },
      {
        id: 'bat_livoltek_bhf_e40',
        sku: 'LIV-BAT-BHF-E40-HV',
        name: 'LIVOLTEK High-Voltage Residential Battery BHF-E40 41.0 kWh 409.6V-HV',
        categoryGroup: 'Baterias de Alta Tensão (HV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '409.6V (HV)',
        voltageType: 'HV',
        subcategory: 'livoltek_bhf',
        capacity: 41.0,
        price: 660000,
        image: 'img/products/bat-livoltek-bhf.webp',
        extra: ''
      },
      {
        id: 'bat_livoltek_bhf_e45',
        sku: 'LIV-BAT-BHF-E45-HV',
        name: 'LIVOLTEK High-Voltage Residential Battery BHF-E45 46.1 kWh 460.8V-HV',
        categoryGroup: 'Baterias de Alta Tensão (HV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '460.8V (HV)',
        voltageType: 'HV',
        subcategory: 'livoltek_bhf',
        capacity: 46.1,
        price: 730000,
        image: 'img/products/bat-livoltek-bhf.webp',
        extra: ''
      },
      {
        id: 'bat_livoltek_bhf_e50',
        sku: 'LIV-BAT-BHF-E50-HV',
        name: 'LIVOLTEK High-Voltage Residential Battery BHF-E50 51.2 kWh 512.0V-HV',
        categoryGroup: 'Baterias de Alta Tensão (HV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '512.0V (HV)',
        voltageType: 'HV',
        subcategory: 'livoltek_bhf',
        capacity: 51.2,
        price: 800000,
        image: 'img/products/bat-livoltek-bhf.webp',
        extra: ''
      },
      {
        id: 'bat_livoltek_bhf_e55',
        sku: 'LIV-BAT-BHF-E55-HV',
        name: 'LIVOLTEK High-Voltage Residential Battery BHF-E55 56.3 kWh 563.2V-HV',
        categoryGroup: 'Baterias de Alta Tensão (HV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '563.2V (HV)',
        voltageType: 'HV',
        subcategory: 'livoltek_bhf',
        capacity: 56.3,
        price: 870000,
        image: 'img/products/bat-livoltek-bhf.webp',
        extra: ''
      },
      {
        id: 'bat_livoltek_bhf_e60',
        sku: 'LIV-BAT-BHF-E60-HV',
        name: 'LIVOLTEK High-Voltage Residential Battery BHF-E60 61.4 kWh 614.4V-HV',
        categoryGroup: 'Baterias de Alta Tensão (HV)',
        brand: 'LIVOLTEK',
        nominalVoltage: '614.4V (HV)',
        voltageType: 'HV',
        subcategory: 'livoltek_bhf',
        capacity: 61.4,
        price: 940000,
        image: 'img/products/bat-livoltek-bhf.webp',
        extra: ''
      }
    ]
  };

  function buildDefaultIndex() {
    const map = {};
    ['panels', 'inverters', 'batteries'].forEach((cat) => {
      map[cat] = {};
      (DEFAULT_PRODUCTS[cat] || []).forEach((item) => {
        map[cat][item.id] = item;
      });
    });
    return map;
  }

  function inferNominalVoltage(category, item) {
    if (item && item.nominalVoltage) return item.nominalVoltage;
    const name = ((item && item.name) || '').toLowerCase();
    const brand = ((item && item.brand) || '').toLowerCase();

    if (category === 'panels') {
      if (name.includes('600')) return '40.16V Vmp / 48.28V Voc (Máx. 1500V DC)';
      if (name.includes('605')) return '40.31V Vmp / 48.48V Voc (Máx. 1500V DC)';
      if (name.includes('610')) return '40.46V Vmp / 48.68V Voc (Máx. 1500V DC)';
      if (name.includes('615')) return '40.60V Vmp / 48.88V Voc (Máx. 1500V DC)';
      if (name.includes('620')) return '40.74V Vmp / 49.08V Voc (Máx. 1500V DC)';
      if (name.includes('625')) return '40.88V Vmp / 49.28V Voc (Máx. 1500V DC)';
      return '41.6V Vmp / 49.6V Voc (Máx. 1500V DC)';
    }
    if (category === 'inverters') {
      return (item && item.voltageType === 'HV') ? '900V (HV)' : '48V (LV)';
    }
    if (category === 'batteries') {
      if (item && item.voltageType === 'HV') {
        if (brand.includes('sigen') || name.includes('sigen')) return '300-900V (HV)';
        const matchV = (item.name || '').match(/(\d+(?:\.\d+)?)V/i);
        if (matchV) return `${matchV[1]}V (HV)`;
        return '102.4V (HV)';
      }
      if (name.includes('12v') || brand.includes('hz')) return '12V (LV)';
      return '51.2V (LV)';
    }
    return '';
  }

  function inferCategoryGroup(category, item) {
    if (item && item.categoryGroup) return item.categoryGroup;
    const name = ((item && item.name) || '').toLowerCase();
    if (category === 'panels') {
      const isBifacial = (item && item.panelType === 'bifacial_dual_glass') || name.includes('bifacial');
      return isBifacial
        ? 'Painéis Solares N-Type Bifaciais (Dual Glass)'
        : 'Painéis Solares Monocristalinos PERC';
    }
    if (category === 'inverters') {
      return (item && item.voltageType === 'HV')
        ? 'Controladores e Inversores Alta Tensão (HV)'
        : 'Inversores Híbridos Baixa Tensão (LV)';
    }
    if (category === 'batteries') {
      return (item && item.voltageType === 'HV')
        ? 'Baterias de Alta Tensão (HV)'
        : 'Baterias de Baixa Tensão (LV)';
    }
    return '';
  }

  function getProductImage(category, item) {
    if (item && item.image && !String(item.image).toLowerCase().endsWith('.svg')) {
      return item.image;
    }
    const name = ((item && item.name) || '').toLowerCase();
    const brand = ((item && item.brand) || '').toLowerCase();

    if (category === 'panels' || (item && item.power > 100 && !item.voltageType)) {
      if (name.includes('canadian') || brand.includes('canadian')) return 'img/products/panel-canadian.png';
      return 'img/products/panel-jinko.png';
    }

    if (category === 'inverters' || (item && item.voltageType && !item.capacity)) {
      if (name.includes('megatron') || brand.includes('megatron')) return 'img/products/inv-megatron.png';
      if (name.includes('sigen') || brand.includes('sigen')) return 'img/products/inv-sigen.png';
      if (name.includes('livoltek') || brand.includes('livoltek')) return 'img/products/inv-livoltek.png';
      if (name.includes('anern') || brand.includes('anern')) return 'img/products/inv-anern.png';
      return 'img/products/inv-deye.png';
    }

    if (category === 'batteries' || (item && item.capacity)) {
      if (name.includes('megatron') || brand.includes('megatron')) return 'img/products/bat-megatron.jpg';
      if (name.includes('sigen') || brand.includes('sigen')) return 'img/products/bat-sigen.webp';
      if (name.includes('livoltek') || brand.includes('livoltek')) return 'img/products/bat-livoltek-bhf.webp';
      if (name.includes('dyness') || brand.includes('dyness')) return 'img/products/bat-dyness.png';
      if (name.includes('hz') || brand.includes('hz') || name.includes('gel')) return 'img/products/bat-hz-gel.webp';
      return 'img/products/bat-deye.jpg';
    }

    return 'img/products/panel-jinko.png';
  }

  function ensureProductImages(productsObj) {
    let changed = false;
    if (!productsObj) return changed;
    const defIndex = buildDefaultIndex();

    ['panels', 'inverters', 'batteries'].forEach((cat) => {
      if (!Array.isArray(productsObj[cat])) return;
      productsObj[cat].forEach((item) => {
        if (!item) return;
        const def = defIndex[cat][item.id];

        if (!item.image || String(item.image).toLowerCase().endsWith('.svg')) {
          item.image = (def && def.image) ? def.image : getProductImage(cat, item);
          changed = true;
        }
        if (def) {
          if (def.sku && item.sku !== def.sku) {
            item.sku = def.sku;
            changed = true;
          }
          if (def.categoryGroup && item.categoryGroup !== def.categoryGroup) {
            item.categoryGroup = def.categoryGroup;
            changed = true;
          }
          if (def.nominalVoltage && item.nominalVoltage !== def.nominalVoltage) {
            item.nominalVoltage = def.nominalVoltage;
            changed = true;
          }
          if (def.name && item.name !== def.name && !item._customName) {
            item.name = def.name;
            changed = true;
          }
        } else {
          if (!item.categoryGroup) {
            item.categoryGroup = inferCategoryGroup(cat, item);
            changed = true;
          }
          if (!item.nominalVoltage) {
            item.nominalVoltage = inferNominalVoltage(cat, item);
            changed = true;
          }
        }
      });
    });
    return changed;
  }

  function cloneDefaults() {
    const cloned = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    ensureProductImages(cloned);
    return cloned;
  }

  function sanitizeImageUrl(url, fallback) {
    if (!url) return fallback || 'img/products/panel-jinko.png';
    const clean = String(url).trim();
    if (!clean) return fallback || 'img/products/panel-jinko.png';
    // Fotos enviadas via upload (data:image/...)
    if (clean.startsWith('data:image/') && !/[<>"']/.test(clean)) {
      return clean;
    }
    // Caminhos relativos de assets locais (reais, sem .svg fictício)
    if (/^img\/products\/[a-zA-Z0-9._-]+\.(png|jpe?g|webp)$/i.test(clean)) {
      return clean;
    }
    // URLs HTTP/HTTPS externas
    if (/^https?:\/\/[^\s"'<>]+$/i.test(clean)) {
      return clean;
    }
    return fallback || 'img/products/panel-jinko.png';
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
   * Remove apenas IDs obsoletos de versões legadas e migra imagens/metadados para o formato real.
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

  /**
   * Extrai e preserva imagens personalizadas (Base64 data:image/) de versões antigas do localStorage
   * e do mapa dedicado lecasu_custom_images_v1, aplicando-as ao catálogo actual.
   */
  function migrateAndApplyCustomImages(catalog, storageObj) {
    if (!catalog || !storageObj) return catalog;
    let customMap = {};
    try {
      const rawMap = storageObj.getItem(STORAGE_KEY_CUSTOM_IMAGES);
      if (rawMap) {
        const parsedMap = JSON.parse(rawMap);
        if (parsedMap && typeof parsedMap === 'object') customMap = parsedMap;
      }
    } catch {}

    const legacyKeys = [
      'lecasu_admin_products_v1',
      'lecasu_admin_products_v2',
      'lecasu_admin_products_v3',
      'lecasu_admin_products_v4',
      STORAGE_KEY_PRODUCTS
    ];

    legacyKeys.forEach((key) => {
      try {
        const raw = storageObj.getItem(key);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        ['panels', 'inverters', 'batteries'].forEach((cat) => {
          if (!Array.isArray(parsed[cat])) return;
          parsed[cat].forEach((item) => {
            if (item && item.id && item.image && String(item.image).startsWith('data:image/')) {
              customMap[item.id] = item.image;
            }
          });
        });
      } catch {}
    });

    // Atualiza o mapa persistente de imagens personalizadas
    ['panels', 'inverters', 'batteries'].forEach((cat) => {
      if (!Array.isArray(catalog[cat])) return;
      catalog[cat].forEach((item) => {
        if (!item || !item.id) return;
        if (item.image && String(item.image).startsWith('data:image/')) {
          customMap[item.id] = item.image;
        } else if (customMap[item.id]) {
          item.image = customMap[item.id];
        }
      });
    });

    try {
      storageObj.setItem(STORAGE_KEY_CUSTOM_IMAGES, JSON.stringify(customMap));
    } catch {}

    return catalog;
  }

  return {
    STORAGE_KEY_PRODUCTS,
    STORAGE_KEY_CUSTOM_IMAGES,
    OBSOLETE_PRODUCT_IDS,
    DEFAULT_PRODUCTS,
    getProductImage,
    ensureProductImages,
    inferNominalVoltage,
    inferCategoryGroup,
    cloneDefaults,
    sanitizeImageUrl,
    escapeHtml,
    stripLegacyObsoleteProducts,
    migrateAndApplyCustomImages
  };
}));
