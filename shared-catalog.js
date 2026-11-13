/**
 * LECASU — Catálogo Padrão Compartilhado & Utilitários Técnicos
 * Fonte única de verdade para o Servidor Node.js, MySQL, Simulador do Cliente e Portal Admin.
 * Atualizado: 2026-11-13 — Mantém todos os produtos existentes, aplica preços reais (c/ IVA 16%)
 * e SKUs da lista oficial LECASU LDA, e adiciona os novos equipamentos da tabela.
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
  // CATÁLOGO OFICIAL LECASU LDA — Produtos Preservados + Preços Reais (c/ IVA 16%)
  // ============================================================
  const DEFAULT_PRODUCTS = {

    // ─────────────────────────────────────────────────────────
    // PAINÉIS SOLARES
    // ─────────────────────────────────────────────────────────
    panels: [
      {
        id: 'p_jinko_tiger_neo_600_bdv',
        sku: 'PV-JINKO-600',
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
        sku: 'PV-JINKO-605',
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
        sku: 'PV-JINKO-610',
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
        sku: 'PV-JINKO-615',
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
        sku: 'PV-JINKO-620-001',
        name: 'Jinko Tiger Neo N-Type Bifacial 620W (JKM620N-66HL4M-BDV)',
        brand: 'Jinko Solar',
        series: 'Tiger Neo 66HL4M-BDV',
        panelType: 'bifacial_dual_glass',
        cellTech: 'Monocristalino N-Type (SMBB / Hot 2.0)',
        cells: '132 células (2x66)',
        power: 620,
        price: 9996,
        efficiency: '22.96%',
        vMax: '1500 V DC',
        dimensions: '2382 × 1134 × 30 mm',
        weight: '32.4 kg',
        warranty: '12 anos produto / 30 anos linear',
        image: 'img/products/panel-jinko.svg',
        extra: 'SKU: PV-JINKO-620-001 · Bifacial Vidro Duplo · Efic. 22.96% · 132 Células N-Type · 1500V · IVA incl.'
      },
      {
        id: 'p_jinko_tiger_neo_625_bdv',
        sku: 'PV-JINKO-625',
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
      },
      {
        id: 'PV-CAN-460-001',
        sku: 'PV-CAN-620-001',
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
        extra: 'SKU: PV-CAN-620-001 · Mono PERC Half-Cut · Efic. 21.4% · 1500V · IVA incl.'
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
        sku: 'INV-ANE-3K-001',
        name: 'ANERN Inversor Off-Grid 3 kW LV (1ph)',
        brand: 'ANERN',
        voltageType: 'LV',
        phase: '1ph',
        power: 3,
        price: 12760,
        image: 'img/products/inv-deye-lv.svg',
        extra: 'SKU: INV-ANE-3K-001 · Off-Grid 3 kW · Monofásico · Baixa Tensão LV · IVA incl.'
      },

      // ── MEGATRON — Baixa Tensão LV ──
      {
        id: 'INV-MEG-3K-001',
        sku: 'INV-MEG-3K-001',
        name: 'Inversor Híbrido MEGATRON 3 kW (1ph · LV-48)',
        brand: 'MEGATRON',
        voltageType: 'LV',
        phase: '1ph',
        power: 3,
        price: 24935,
        image: 'img/products/inv-megatron-lv.svg',
        extra: 'SKU: INV-MEG-3K-001 · Monofásico · Baixa Tensão 48V · Híbrido LV · IVA incl.'
      },
      {
        id: 'inv_megatron_5k_lv',
        sku: 'INV-MEG-5K-001',
        name: 'Inversor Híbrido MEGATRON 5 kW (1ph · LV-48)',
        brand: 'MEGATRON',
        voltageType: 'LV',
        phase: '1ph',
        power: 5,
        price: 48829,
        image: 'img/products/inv-megatron-lv.svg',
        extra: 'SKU: INV-MEG-5K-001 · Monofásico · Baixa Tensão 48V · Dual MPPT · IVA incl.'
      },
      {
        id: 'inv_megatron_12k_lv',
        sku: 'INV-MEG-12K-002',
        name: 'Inversor Híbrido MEGATRON 12 kW (3ph · LV-48)',
        brand: 'MEGATRON',
        voltageType: 'LV',
        phase: '3ph',
        power: 12,
        price: 85451,
        image: 'img/products/inv-megatron-lv.svg',
        extra: 'SKU: INV-MEG-12K-002 · Trifásico / Split · Baixa Tensão 48V · Alta Eficiência · IVA incl.'
      },

      // ── DEYE — Baixa Tensão LV ──
      {
        id: 'inv_deye_5k_1ph',
        sku: 'INV-DEY-5K-001',
        name: 'Deye Híbrido 5 kW (1ph · LV-48)',
        brand: 'Deye',
        voltageType: 'LV',
        phase: '1ph',
        power: 5,
        price: 98366,
        image: 'img/products/inv-deye-lv.svg',
        extra: 'SKU: INV-DEY-5K-001 · Monofásico · Baixa Tensão 48V · Dual MPPT · IVA incl.'
      },
      {
        id: 'INV-DEY-8K-002',
        sku: 'INV-DEY-8K-002',
        name: 'Deye Híbrido 8 kW (1ph · LV-48)',
        brand: 'Deye',
        voltageType: 'LV',
        phase: '1ph',
        power: 8,
        price: 151553,
        image: 'img/products/inv-deye-lv.svg',
        extra: 'SKU: INV-DEY-8K-002 · Monofásico · Baixa Tensão 48V · Dual MPPT · IVA incl.'
      },
      {
        id: 'inv_deye_12k_3ph_lv',
        sku: 'INV-DEY-12K-003',
        name: 'Deye Híbrido 12 kW (3ph · LV-48)',
        brand: 'Deye',
        voltageType: 'LV',
        phase: '3ph',
        power: 12,
        price: 236438,
        image: 'img/products/inv-deye-lv.svg',
        extra: 'SKU: INV-DEY-12K-003 · Trifásico · Baixa Tensão 48V · Dual MPPT · IVA incl.'
      },
      {
        id: 'inv_deye_20k_3ph_lv',
        sku: 'INV-DEY-20K-004',
        name: 'Deye Híbrido 20 kW (3ph · LV-48)',
        brand: 'Deye',
        voltageType: 'LV',
        phase: '3ph',
        power: 20,
        price: 355703,
        image: 'img/products/inv-deye-lv.svg',
        extra: 'SKU: INV-DEY-20K-004 · Trifásico · Baixa Tensão 48V · Paralelizável · IVA incl.'
      },

      // ── DEYE — Alta Tensão HV ──
      {
        id: 'INV-DEY-30K-005',
        sku: 'INV-DEY-30K-005',
        name: 'Deye Híbrido 30 kW (3ph · HV)',
        brand: 'Deye',
        voltageType: 'HV',
        phase: '3ph',
        power: 30,
        price: 381753,
        image: 'img/products/inv-deye-lv.svg',
        extra: 'SKU: INV-DEY-30K-005 · Trifásico · Alta Tensão HV · Comercial · IVA incl.'
      },
      {
        id: 'INV-DEY-50K-006',
        sku: 'INV-DEY-50K-006',
        name: 'Deye Híbrido 50 kW (3ph · HV)',
        brand: 'Deye',
        voltageType: 'HV',
        phase: '3ph',
        power: 50,
        price: 520863,
        image: 'img/products/inv-deye-lv.svg',
        extra: 'SKU: INV-DEY-50K-006 · Trifásico · Alta Tensão HV · Industrial · IVA incl.'
      },
      {
        id: 'INV-DEY-100K-007',
        sku: 'INV-DEY-100K-007',
        name: 'Deye Híbrido 100 kW (3ph · HV)',
        brand: 'Deye',
        voltageType: 'HV',
        phase: '3ph',
        power: 100,
        price: 1095030,
        image: 'img/products/inv-deye-lv.svg',
        extra: 'SKU: INV-DEY-100K-007 · Trifásico · Alta Tensão HV · Industrial · IVA incl.'
      },

      // ── LIVOLTEK — LV & HV ──
      {
        id: 'inv_livoltek_5k_3ph',
        sku: 'INV-LIV-5K-LV',
        name: 'LIVOLTEK Three-Phase Híbrido 5 kW (LV-48)',
        brand: 'LIVOLTEK',
        voltageType: 'LV',
        phase: '3ph',
        power: 5,
        price: 110000,
        image: 'img/products/inv-livoltek-lv.svg',
        extra: 'Trifásico · 2 MPPT LV-48'
      },
      {
        id: 'inv_livoltek_6k_split',
        sku: 'INV-LIV-6K-SP',
        name: 'LIVOLTEK Split-Phase 6 kW (LV-48)',
        brand: 'LIVOLTEK',
        voltageType: 'LV',
        phase: 'split',
        power: 6,
        price: 115000,
        image: 'img/products/inv-livoltek-lv.svg',
        extra: 'Bifásico Split-Phase · 2/3 MPPT LV-48'
      },
      {
        id: 'inv_livoltek_12k_split',
        sku: 'INV-LIV-12K-SP',
        name: 'LIVOLTEK Split-Phase 12 kW (LV-48)',
        brand: 'LIVOLTEK',
        voltageType: 'LV',
        phase: 'split',
        power: 12,
        price: 195000,
        image: 'img/products/inv-livoltek-lv.svg',
        extra: 'Bifásico Split-Phase · 2/3 MPPT LV-48'
      },
      {
        id: 'inv_livoltek_12k_3ph',
        sku: 'INV-LIV-12K-LV',
        name: 'LIVOLTEK Three-Phase Híbrido 12 kW (LV-48)',
        brand: 'LIVOLTEK',
        voltageType: 'LV',
        phase: '3ph',
        power: 12,
        price: 198000,
        image: 'img/products/inv-livoltek-lv.svg',
        extra: 'Trifásico · 2 MPPT LV-48'
      },
      {
        id: 'inv_livoltek_16k_3ph',
        sku: 'INV-LIV-16K-LV',
        name: 'LIVOLTEK Three-Phase Híbrido 16 kW (LV-48)',
        brand: 'LIVOLTEK',
        voltageType: 'LV',
        phase: '3ph',
        power: 16,
        price: 235000,
        image: 'img/products/inv-livoltek-lv.svg',
        extra: 'Trifásico · 2/3 MPPT LV-48'
      },
      {
        id: 'INV-LIV-12K-002',
        sku: 'INV-LIV-12K-002',
        name: 'LIVOLTEK HP4 Inversor Híbrido 12 kW (3ph · HV)',
        brand: 'LIVOLTEK',
        voltageType: 'HV',
        phase: '3ph',
        power: 12,
        price: 233625,
        image: 'img/products/inv-livoltek-lv.svg',
        extra: 'SKU: INV-LIV-12K-002 · LIVOLTEK HP4 · Trifásico · Alta Tensão HV · IVA incl.'
      },
      {
        id: 'INV-LIV-30K-001',
        sku: 'INV-LIV-30K-001',
        name: 'LIVOLTEK HP3 Inversor Híbrido 30 kW (3ph · HV)',
        brand: 'LIVOLTEK',
        voltageType: 'HV',
        phase: '3ph',
        power: 30,
        price: 109626,
        image: 'img/products/inv-livoltek-lv.svg',
        extra: 'SKU: INV-LIV-30K-001 · LIVOLTEK HP3 · Trifásico · Alta Tensão HV · IVA incl.'
      },

      // ── SIGENERGY — Alta Tensão HV ──
      { id: 'inv_sigen_5k_3ph_hv', sku: 'SIG-INV-5K', name: 'Sigen Energy Controller All-in-one 5 kW (3ph · HV-900)', brand: 'Sigenergy', voltageType: 'HV', phase: '3ph', power: 5, price: 155000, image: 'img/products/inv-sigen-hv.svg', extra: 'Trifásico · All-in-One Alta Tensão 900V' },
      { id: 'inv_sigen_6k_3ph_hv', sku: 'SIG-INV-6K', name: 'Sigen Energy Controller All-in-one 6 kW (3ph · HV-900)', brand: 'Sigenergy', voltageType: 'HV', phase: '3ph', power: 6, price: 170000, image: 'img/products/inv-sigen-hv.svg', extra: 'Trifásico · All-in-One Alta Tensão 900V' },
      { id: 'inv_sigen_10k_3ph_hv', sku: 'SIG-INV-10K', name: 'Sigen Energy Controller All-in-one 10 kW (3ph · HV-900)', brand: 'Sigenergy', voltageType: 'HV', phase: '3ph', power: 10, price: 215000, image: 'img/products/inv-sigen-hv.svg', extra: 'Trifásico · All-in-One Alta Tensão 900V' },
      { id: 'inv_sigen_15k_3ph_hv', sku: 'SIG-INV-15K', name: 'Sigen Energy Controller All-in-one 15 kW (3ph · HV-900)', brand: 'Sigenergy', voltageType: 'HV', phase: '3ph', power: 15, price: 265000, image: 'img/products/inv-sigen-hv.svg', extra: 'Trifásico · All-in-One Alta Tensão 900V' },
      { id: 'inv_sigen_20k_3ph_hv', sku: 'SIG-INV-20K', name: 'Sigen Energy Controller All-in-one 20 kW (3ph · HV-900)', brand: 'Sigenergy', voltageType: 'HV', phase: '3ph', power: 20, price: 310000, image: 'img/products/inv-sigen-hv.svg', extra: 'Trifásico · All-in-One Alta Tensão 900V' },
      { id: 'inv_sigen_25k_3ph_hv', sku: 'SIG-INV-25K', name: 'Sigen Energy Controller All-in-one 25 kW (3ph · HV-900)', brand: 'Sigenergy', voltageType: 'HV', phase: '3ph', power: 25, price: 360000, image: 'img/products/inv-sigen-hv.svg', extra: 'Trifásico · All-in-One Alta Tensão 900V' }
    ],

    // ─────────────────────────────────────────────────────────
    // BATERIAS, ARMAZENAMENTO (BESS) & QUADROS HV
    // Ordenadas por: Tensão (LV → HV) → Marca → Capacidade crescente
    // ─────────────────────────────────────────────────────────
    batteries: [
      // ── Baixa Tensão (LV) ──
      {
        id: 'BAT-HZS-12-200-001',
        sku: 'BAT-HZS-12/200-001',
        name: 'Bateria de Gel HZ Solar 12V 200Ah (2.4 kWh LV)',
        brand: 'HZ Solar',
        voltageType: 'LV',
        subcategory: 'lv_rack',
        capacity: 2.4,
        price: 20305,
        image: 'img/products/bat-deye-lv.svg',
        extra: 'SKU: BAT-HZS-12/200-001 · Gel 12V 200Ah · Ciclo Profundo · IVA incl.'
      },
      {
        id: 'bat_megatron_512_lv',
        sku: 'BAT-MEG-5120-001',
        name: 'Bateria MEGATRON 100Ah 5.12 kWh (51.2V-LV)',
        brand: 'MEGATRON',
        voltageType: 'LV',
        subcategory: 'megatron_lv',
        capacity: 5.12,
        price: 83396,
        image: 'img/products/bat-megatron-lv.svg',
        extra: 'SKU: BAT-MEG-5120-001 · LiFePO4 Mural/Rack · 51.2V 100Ah (6000 Ciclos) · IVA incl.'
      },
      {
        id: 'bat_megatron_16k_lv',
        sku: 'BAT-MEG-1680-002',
        name: 'Bateria MEGATRON 280Ah 16.80 kWh (51.2V-LV)',
        brand: 'MEGATRON',
        voltageType: 'LV',
        subcategory: 'megatron_lv',
        capacity: 16.8,
        price: 179013,
        image: 'img/products/bat-megatron-lv.svg',
        extra: 'SKU: BAT-MEG-1680-002 · LiFePO4 Alta Capacidade · 51.2V 280Ah (6000 Ciclos) · IVA incl.'
      },
      {
        id: 'bat_deye_512_lv',
        sku: 'BAT-DEY-5120-001',
        name: 'Deye Battery LiFePO4 5.12 kWh (51.2V-LV)',
        brand: 'Deye',
        voltageType: 'LV',
        subcategory: 'lv_rack',
        capacity: 5.12,
        price: 111434,
        image: 'img/products/bat-deye-lv.svg',
        extra: 'SKU: BAT-DEY-5120-001 · Mural/Rack · 51.2V 100Ah (6000 Ciclos) · IVA incl.'
      },
      {
        id: 'bat_deye_rw_m61_lv',
        sku: 'BAT-DEY-5120-001',
        name: 'DEYE Low Voltage Lithium Battery 5.12 kWh (51.2V)',
        brand: 'Deye',
        voltageType: 'LV',
        subcategory: 'lv_rack',
        capacity: 5.12,
        price: 111434,
        image: 'img/products/bat-deye-lv.svg',
        extra: 'SKU: BAT-DEY-5120-001 · Mural RW-M6.1 · 51.2V 100Ah · IVA incl.'
      },
      {
        id: 'BAT-DYN-5120-001',
        sku: 'BAT-DYN-5120-001',
        name: 'Bateria Dyness LiFePO4 5.12 kWh (LV)',
        brand: 'DYNESS',
        voltageType: 'LV',
        subcategory: 'lv_rack',
        capacity: 5.12,
        price: 99931,
        image: 'img/products/bat-deye-lv.svg',
        extra: 'SKU: BAT-DYN-5120-001 · LiFePO4 · 5.12 kWh LV · Modular Rack · IVA incl.'
      },

      // ── Alta Tensão (HV) — Sigenergy ──
      { id: 'bat_sigen_5k_hv', sku: 'SIG-BAT-5K', name: 'Sigen Battery 5.0 kWh (300-900-HV)', brand: 'Sigenergy', voltageType: 'HV', subcategory: 'sigen_hv', capacity: 5.0, price: 115000, image: 'img/products/bat-sigen-hv.svg', extra: 'Módulo Modular SigenStor · 300-900V HV' },
      { id: 'bat_sigen_6k_hv', sku: 'SIG-BAT-6K', name: 'Sigen Battery 6.0 kWh (300-900-HV)', brand: 'Sigenergy', voltageType: 'HV', subcategory: 'sigen_hv', capacity: 6.0, price: 135000, image: 'img/products/bat-sigen-hv.svg', extra: 'Módulo Modular SigenStor · 300-900V HV' },
      { id: 'bat_sigen_8k_hv', sku: 'SIG-BAT-8K', name: 'Sigen Battery 8.0 kWh (300-900-HV)', brand: 'Sigenergy', voltageType: 'HV', subcategory: 'sigen_hv', capacity: 8.0, price: 175000, image: 'img/products/bat-sigen-hv.svg', extra: 'Módulo Modular SigenStor · 300-900V HV' },
      { id: 'bat_sigen_10k_hv', sku: 'SIG-BAT-10K', name: 'Sigen Battery 10.0 kWh (300-900-HV)', brand: 'Sigenergy', voltageType: 'HV', subcategory: 'sigen_hv', capacity: 10.0, price: 215000, image: 'img/products/bat-sigen-hv.svg', extra: 'Módulo Modular SigenStor · 300-900V HV' },

      // ── Alta Tensão (HV) — LIVOLTEK BHF & Control Box ──
      {
        id: 'BAT-LIV-5020-001',
        sku: 'BAT-LIV-5020-001',
        name: 'Bateria LIVOLTEK BHF Li-ion HV IP65 (5.0 kWh)',
        brand: 'LIVOLTEK',
        voltageType: 'HV',
        subcategory: 'livoltek_bhf',
        capacity: 5.0,
        price: 62350,
        image: 'img/products/bat-livoltek-bhf.svg',
        extra: 'SKU: BAT-LIV-5020-001 · Li-ion HV IP65 · Módulo BHF · IVA incl.'
      },
      {
        id: 'BHF-HV-CB-IP65',
        sku: 'BHF HV ControlBox IP65',
        name: 'LIVOLTEK HV Battery Control Box (BHF HV ControlBox IP65)',
        brand: 'LIVOLTEK',
        voltageType: 'HV',
        subcategory: 'livoltek_bhf',
        capacity: 0.1,
        price: 85645,
        image: 'img/products/bat-livoltek-bhf.svg',
        extra: 'SKU: BHF HV ControlBox IP65 · Quadro Elétrico HV · Controlo Bateria · IVA incl.'
      },
      { id: 'bat_livoltek_bhf_e10', sku: 'BHF-E10', name: 'LIVOLTEK High-Voltage Battery BHF-E10 · 10.2 kWh (102.4V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 10.2, price: 215000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 102.4V-HV' },
      { id: 'bat_livoltek_bhf_e15', sku: 'BHF-E15', name: 'LIVOLTEK High-Voltage Battery BHF-E15 · 15.4 kWh (153.6V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 15.4, price: 295000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 153.6V-HV' },
      { id: 'bat_livoltek_bhf_e20', sku: 'BHF-E20', name: 'LIVOLTEK High-Voltage Battery BHF-E20 · 20.5 kWh (204.8V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 20.5, price: 375000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 204.8V-HV' },
      { id: 'bat_livoltek_bhf_e25', sku: 'BHF-E25', name: 'LIVOLTEK High-Voltage Battery BHF-E25 · 25.6 kWh (256V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 25.6, price: 450000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 256V-HV' },
      { id: 'bat_livoltek_bhf_e30', sku: 'BHF-E30', name: 'LIVOLTEK High-Voltage Battery BHF-E30 · 30.7 kWh (307.2V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 30.7, price: 520000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 307.2V-HV' },
      { id: 'bat_livoltek_bhf_e35', sku: 'BHF-E35', name: 'LIVOLTEK High-Voltage Battery BHF-E35 · 35.8 kWh (358.4V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 35.8, price: 590000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 358.4V-HV' },
      { id: 'bat_livoltek_bhf_e40', sku: 'BHF-E40', name: 'LIVOLTEK High-Voltage Battery BHF-E40 · 41.0 kWh (409.6V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 41.0, price: 660000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 409.6V-HV' },
      { id: 'bat_livoltek_bhf_e45', sku: 'BHF-E45', name: 'LIVOLTEK High-Voltage Battery BHF-E45 · 46.1 kWh (460.8V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 46.1, price: 730000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 460.8V-HV' },
      { id: 'bat_livoltek_bhf_e50', sku: 'BHF-E50', name: 'LIVOLTEK High-Voltage Battery BHF-E50 · 51.2 kWh (512.0V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 51.2, price: 800000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 512.0V-HV' },
      { id: 'bat_livoltek_bhf_e55', sku: 'BHF-E55', name: 'LIVOLTEK High-Voltage Battery BHF-E55 · 56.3 kWh (563.2V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 56.3, price: 870000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 563.2V-HV' },
      { id: 'bat_livoltek_bhf_e60', sku: 'BHF-E60', name: 'LIVOLTEK High-Voltage Battery BHF-E60 · 61.4 kWh (614.4V-HV)', brand: 'LIVOLTEK', voltageType: 'HV', subcategory: 'livoltek_bhf', capacity: 61.4, price: 940000, image: 'img/products/bat-livoltek-bhf.svg', extra: 'Torre Modular BHF · 614.4V-HV' }
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
    cloneDefaults,
    sanitizeImageUrl,
    escapeHtml,
    stripLegacyObsoleteProducts,
    migrateAndApplyCustomImages
  };
}));
