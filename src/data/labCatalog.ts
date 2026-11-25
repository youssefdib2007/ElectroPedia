import type {
  LabComponentCategory,
  LabComponentInstance,
  LabComponentProps,
  LabComponentType,
  LabPinSpec,
  LocalizedText,
} from '../types/electronics';

export interface LabCatalogItem {
  type: LabComponentType;
  category: LabComponentCategory;
  code: string;
  name: LocalizedText;
  description: LocalizedText;
  modelNote: LocalizedText;
  encyclopediaId?: string;
  pins: LabPinSpec[];
  defaultProps: LabComponentProps;
}

export const LAB_GRID_SIZE = 20;

export const LAB_CATEGORIES: { id: LabComponentCategory; label: LocalizedText }[] = [
  { id: 'sources', label: { ar: 'مصادر التغذية', en: 'Power Sources', fr: 'Sources' } },
  { id: 'electrical', label: { ar: 'القطع الكهربائية والحماية', en: 'Electrical & Protection', fr: 'Électrique & Protection' } },
  { id: 'industrial', label: { ar: 'التحكم الصناعي والمحركات', en: 'Industrial & Motors', fr: 'Industriel & Moteurs' } },
  { id: 'electronics', label: { ar: 'الإلكترونيات والمنطق', en: 'Electronics & Logic', fr: 'Électronique & Logique' } },
  { id: 'instruments', label: { ar: 'أجهزة القياس', en: 'Instruments', fr: 'Instruments' } },
];

export const LAB_COMPONENT_CATALOG: LabCatalogItem[] = [
  // ── 1. SOURCES ──
  {
    type: 'battery',
    category: 'sources',
    code: 'BAT',
    name: { ar: 'بطارية DC', en: 'DC Battery', fr: 'Batterie DC' },
    description: {
      ar: 'مصدر جهد مستمر ثابت مع مقاومة داخلية قابلة للضبط.',
      en: 'Constant DC voltage battery with configurable internal resistance.',
      fr: 'Source de tension continue avec résistance interne réglable.',
    },
    modelNote: {
      ar: 'نموذج مصدر جهد مستمر مثالي أو بمقاومة داخلية ثابتة.',
      en: 'Ideal DC voltage source or series internal resistance model.',
      fr: 'Modèle de source de tension continue idéale ou avec résistance interne.',
    },
    encyclopediaId: 'batteries',
    pins: [
      { id: 'pos', label: '+', dx: 40, dy: 0 },
      { id: 'neg', label: '−', dx: -40, dy: 0 },
    ],
    defaultProps: { voltage: 12, internalResistance: 0 },
  },
  {
    type: 'dc-source',
    category: 'sources',
    code: 'VDC',
    name: { ar: 'مصدر جهد مستمر', en: 'DC Voltage Source', fr: 'Source de tension DC' },
    description: {
      ar: 'مغذّي مختبري ثابت الجهد (5V / 12V / 24V).',
      en: 'Regulated DC bench power supply (5V / 12V / 24V).',
      fr: 'Alimentation stabilisée continue (5V / 12V / 24V).',
    },
    modelNote: {
      ar: 'مصدر جهد مستمر منظم ضمن تحليل العقد MNA.',
      en: 'Regulated DC source solved via Modified Nodal Analysis.',
      fr: 'Source continue régulée résolue par analyse nodale modifiée.',
    },
    encyclopediaId: 'voltage-regulators',
    pins: [
      { id: 'pos', label: '+', dx: 40, dy: 0 },
      { id: 'neg', label: '−', dx: -40, dy: 0 },
    ],
    defaultProps: { voltage: 12 },
  },
  {
    type: 'ac-source',
    category: 'sources',
    code: 'VAC',
    name: { ar: 'مصدر جهد متردد AC', en: 'AC Voltage Source', fr: 'Source AC' },
    description: {
      ar: 'مصدر موجة جيبية مترددة بجهد RMS وتردد قابل للتعديل.',
      en: 'Sinusoidal AC voltage source with adjustable RMS voltage and frequency.',
      fr: 'Source sinusoïdale alternative avec tension efficace et fréquence réglables.',
    },
    modelNote: {
      ar: 'يحسب القيم الفعالة RMS والموجة اللحظية في راسم الإشارة (أحادي الطور).',
      en: 'Computes single-phase RMS steady state and instantaneous sine waveforms.',
      fr: 'Calcule le régime efficace RMS et les formes d’onde instantanées.',
    },
    encyclopediaId: 'inverters',
    pins: [
      { id: 'pos', label: 'L', dx: 40, dy: 0 },
      { id: 'neg', label: 'N', dx: -40, dy: 0 },
    ],
    defaultProps: { voltage: 230, frequency: 50 },
  },
  {
    type: 'current-source',
    category: 'sources',
    code: 'IDC',
    name: { ar: 'مصدر تيار ثابت', en: 'DC Current Source', fr: 'Source de courant DC' },
    description: {
      ar: 'يحقن تياراً مستمراً ثابتاً من السالب نحو الموجب.',
      en: 'Injects constant DC current into the connected branch.',
      fr: 'Injecte un courant continu constant dans la branche.',
    },
    modelNote: {
      ar: 'مصدر تيار مستقل مثالي؛ يتطلب مساراً مغلقاً غير مفتوح.',
      en: 'Ideal independent current source; requires a closed return path.',
      fr: 'Source de courant idéale nécessitant un chemin de retour fermé.',
    },
    pins: [
      { id: 'pos', label: '+', dx: 40, dy: 0 },
      { id: 'neg', label: '−', dx: -40, dy: 0 },
    ],
    defaultProps: { current: 0.05 },
  },
  {
    type: 'ground',
    category: 'sources',
    code: 'GND',
    name: { ar: 'أرضي مرجعي (0V)', en: 'Ground Reference (0V)', fr: 'Masse / Terre (0V)' },
    description: {
      ar: 'نقطة الجهد المرجعية (0 فولت) لربط الدوائر وأجهزة القياس.',
      en: 'Zero-volt circuit reference node shared across all ground points.',
      fr: 'Nœud de référence 0 V partagé dans le circuit.',
    },
    modelNote: {
      ar: 'يربط العقدة بالجهد المرجعي 0V.',
      en: 'Clamps connected node to 0 V solver reference.',
      fr: 'Fixe le potentiel du nœud à 0 V.',
    },
    encyclopediaId: 'earthing-systems',
    pins: [{ id: 'gnd', label: '0V', dx: 0, dy: -20 }],
    defaultProps: {},
  },

  // ── 2. ELECTRICAL & PROTECTION ──
  {
    type: 'switch',
    category: 'electrical',
    code: 'S',
    name: { ar: 'مفتاح كهربائي (Switch)', en: 'Toggle Switch (SPST)', fr: 'Interrupteur' },
    description: {
      ar: 'مفتاح أحادي القطب يُفتح ويُغلق بنقرة مزدوجة أو من لوحة الخصائص.',
      en: 'Single-pole toggle switch; double-click or toggle from Properties.',
      fr: 'Interrupteur unipolaire actionnable par double-clic ou panneau.',
    },
    modelNote: {
      ar: 'مقاومة توصيل 0.01Ω عند الإغلاق وعزل 1GΩ عند الفتح.',
      en: '0.01 Ω closed contact resistance; open circuit when opened.',
      fr: '0,01 Ω fermé ; circuit ouvert lorsqu’il est ouvert.',
    },
    encyclopediaId: 'light-switches',
    pins: [
      { id: 'a', label: '1', dx: -40, dy: 0 },
      { id: 'b', label: '2', dx: 40, dy: 0 },
    ],
    defaultProps: { closed: true },
  },
  {
    type: 'push-button',
    category: 'electrical',
    code: 'PB',
    name: { ar: 'زر ضاغط (Push Button)', en: 'Push Button (NO/NC)', fr: 'Bouton-poussoir' },
    description: {
      ar: 'زر تشغيل (NO) أو إيقاف (NC) تفاعلي لدارات التحكم الصناعية.',
      en: 'Interactive NO or NC push button for Start/Stop control circuits.',
      fr: 'Bouton-poussoir NO ou NC interactif pour commande Start/Stop.',
    },
    modelNote: {
      ar: 'يعمل لحظياً بالضغط أو بالتثبيت الاختياري أثناء تجربة دوائر التحكم.',
      en: 'Supports momentary press or toggle actuation in control circuits.',
      fr: 'Commande momentanée ou maintenue pour essais de commande.',
    },
    encyclopediaId: 'push-buttons',
    pins: [
      { id: 'a', label: '1', dx: -40, dy: 0 },
      { id: 'b', label: '2', dx: 40, dy: 0 },
    ],
    defaultProps: { closed: false, momentaryNC: false },
  },
  {
    type: 'lamp',
    category: 'electrical',
    code: 'EL',
    name: { ar: 'مصباح كهربائي', en: 'Incandescent / LED Lamp', fr: 'Lampe' },
    description: {
      ar: 'يتوهج طردياً مع القدرة الفعلية ويحذّر عند تجاوز الجهد الاسمي.',
      en: 'Glows proportionally to dissipated power and warns on overvoltage.',
      fr: 'S’illumine selon la puissance réelle et avertit en cas de surtension.',
    },
    modelNote: {
      ar: 'يُنمذج بمقاومة مكافئة R = V² / P استناداً للقيم الاسمية.',
      en: 'Modeled via nominal resistance R = V_rated² / P_rated.',
      fr: 'Modélisée par une résistance équivalente R = U² / P.',
    },
    encyclopediaId: 'lamps',
    pins: [
      { id: 'a', label: '1', dx: -40, dy: 0 },
      { id: 'b', label: '2', dx: 40, dy: 0 },
    ],
    defaultProps: { ratedVoltage: 12, ratedPower: 6 },
  },
  {
    type: 'fuse',
    category: 'electrical',
    code: 'FU',
    name: { ar: 'مصهر (فيوز)', en: 'Fuse', fr: 'Fusible' },
    description: {
      ar: 'ينصهر ويفتح الدائرة تلقائياً إذا تجاوز التيار القيمة المقننة.',
      en: 'Melts open automatically when branch current exceeds rated current.',
      fr: 'Fond et ouvre le circuit automatiquement en cas de surintensité.',
    },
    modelNote: {
      ar: 'فصل فوري عند |I| > I_rated (يعاد ضبطه عند Reset).',
      en: 'Instantaneous trip when |I| > I_rated (reset via Simulation Reset).',
      fr: 'Fusion instantanée dès |I| > I_nom (réarmement via Reset).',
    },
    encyclopediaId: 'fuses',
    pins: [
      { id: 'a', label: '1', dx: -40, dy: 0 },
      { id: 'b', label: '2', dx: 40, dy: 0 },
    ],
    defaultProps: { ratedCurrent: 2 },
  },
  {
    type: 'circuit-breaker',
    category: 'electrical',
    code: 'QF',
    name: { ar: 'قاطع أوتوماتيكي (MCB)', en: 'Circuit Breaker (MCB)', fr: 'Disjoncteur (MCB)' },
    description: {
      ar: 'قاطع حماية قابل لإعادة التوصيل يفصل عند الحمل الزائد أو القصر.',
      en: 'Resettable breaker tripping automatically on overload or short circuit.',
      fr: 'Disjoncteur réarmable déclenchant sur surcharge ou court-circuit.',
    },
    modelNote: {
      ar: 'يفصل تلقائياً عند تجاوز 1.45× من التيار المقنن أو القصر.',
      en: 'Trips automatically above 1.45× rated current or on short circuit.',
      fr: 'Déclenche au-delà de 1,45× le courant nominal ou court-circuit.',
    },
    encyclopediaId: 'circuit-breakers',
    pins: [
      { id: 'a', label: '1', dx: -40, dy: 0 },
      { id: 'b', label: '2', dx: 40, dy: 0 },
    ],
    defaultProps: { ratedCurrent: 10, closed: true },
  },

  // ── 3. INDUSTRIAL & MOTORS ──
  {
    type: 'relay',
    category: 'industrial',
    code: 'KA',
    name: { ar: 'مرحل كهرومغناطيسي (Relay)', en: 'Electromagnetic Relay', fr: 'Relais électromagnétique' },
    description: {
      ar: 'ملف تحكم (A1-A2) يشغّل تلامساً مفتوحاً (13-14) لعزل وتضخيم التحكم.',
      en: 'Control coil (A1-A2) actuates isolated NO output contact (13-14).',
      fr: 'Bobine (A1-A2) commandant un contact NO isolé (13-14).',
    },
    modelNote: {
      ar: 'يغلق التلامس عندما يتجاوز جهد الملف 75% من الجهد الاسمي.',
      en: 'Pull-in occurs when |V_coil| >= 75% of rated coil voltage.',
      fr: 'Le contact se ferme dès |U_bobine| >= 75% de la tension nominale.',
    },
    encyclopediaId: 'relays',
    pins: [
      { id: 'a1', label: 'A1', dx: -40, dy: -20 },
      { id: 'a2', label: 'A2', dx: -40, dy: 20 },
      { id: 'no1', label: '13', dx: 40, dy: -20 },
      { id: 'no2', label: '14', dx: 40, dy: 20 },
    ],
    defaultProps: { coilVoltage: 12, coilResistance: 200 },
  },
  {
    type: 'contactor',
    category: 'industrial',
    code: 'KM',
    name: { ar: 'كونتاكتور صناعي (Contactor)', en: 'Industrial Contactor (KM)', fr: 'Contacteur (KM)' },
    description: {
      ar: 'ملف (A1-A2)، قطب قدرة رئيسي (1-2)، تلامس مساعد NO (13-14) وتلامس تشابك NC (21-22).',
      en: 'Coil (A1-A2), main pole (1-2), NO holding contact (13-14), and NC interlock (21-22).',
      fr: 'Bobine (A1-A2), pôle puissance (1-2), contact NO (13-14) et verrouillage NC (21-22).',
    },
    modelNote: {
      ar: 'نموذج تحكم صناعي أحادي الخط (ملف + أقطاب) لدوائر Start/Stop والتشابك.',
      en: 'Educational single-pole/auxiliary contactor logic model for Start/Stop & interlocking.',
      fr: 'Modèle pédagogique unipolaire + auxiliaires pour marche/arrêt et verrouillage.',
    },
    encyclopediaId: 'contactors',
    pins: [
      { id: 'a1', label: 'A1', dx: -60, dy: -20 },
      { id: 'a2', label: 'A2', dx: -60, dy: 20 },
      { id: 'l1', label: 'L1', dx: -20, dy: -40 },
      { id: 't1', label: 'T1', dx: -20, dy: 40 },
      { id: 'no13', label: '13', dx: 20, dy: -40 },
      { id: 'no14', label: '14', dx: 20, dy: 40 },
      { id: 'nc21', label: '21', dx: 60, dy: -40 },
      { id: 'nc22', label: '22', dx: 60, dy: 40 },
    ],
    defaultProps: { coilVoltage: 24, coilResistance: 240 },
  },
  {
    type: 'timer',
    category: 'industrial',
    code: 'KT',
    name: { ar: 'مؤقت تأخير التشغيل (Timer)', en: 'On-Delay Timer Relay (KT)', fr: 'Relais temporisé (KT)' },
    description: {
      ar: 'يغلق تلامسه المؤقت (17-18) بعد انقضاء زمن التأخير المحدد.',
      en: 'Closes timed NO contact (17-18) after delay elapses while coil stays energized.',
      fr: 'Ferme le contact temporisé (17-18) après la durée programmée.',
    },
    modelNote: {
      ar: 'مؤقت تأخير زمني (TON) مرتبط بالوقت الفعلي للمحاكاة.',
      en: 'Time-domain On-Delay (TON) timer synchronized to simulation clock.',
      fr: 'Temporisateur travail (TON) synchronisé sur l’horloge de simulation.',
    },
    encyclopediaId: 'timers',
    pins: [
      { id: 'a1', label: 'A1', dx: -40, dy: -20 },
      { id: 'a2', label: 'A2', dx: -40, dy: 20 },
      { id: 't17', label: '17', dx: 40, dy: -20 },
      { id: 't18', label: '18', dx: 40, dy: 20 },
    ],
    defaultProps: { coilVoltage: 24, coilResistance: 400, delaySeconds: 3 },
  },
  {
    type: 'thermal-overload',
    category: 'industrial',
    code: 'F1',
    name: { ar: 'مرحل حراري أوفرلود', en: 'Thermal Overload Relay', fr: 'Relais thermique' },
    description: {
      ar: 'يراقب تيار المحرك (T1-T2) ويفتح تلامس الحماية (95-96) عند زيادة الحمل.',
      en: 'Monitors motor branch current (T1-T2) and trips NC contact (95-96) on overload.',
      fr: 'Surveille le courant moteur (T1-T2) et ouvre le contact NC (95-96) en surcharge.',
    },
    modelNote: {
      ar: 'يفصل عند استمرار تجاوز التيار المضبوط (أكثر من 1.15× I_set).',
      en: 'Trips when sustained branch current exceeds 1.15× rated setting.',
      fr: 'Déclenche si le courant dépasse durablement 1,15× le réglage.',
    },
    encyclopediaId: 'thermal-overload-relays',
    pins: [
      { id: 't1', label: 'T1', dx: -40, dy: -20 },
      { id: 't2', label: 'T2', dx: 40, dy: -20 },
      { id: 'nc95', label: '95', dx: -40, dy: 20 },
      { id: 'nc96', label: '96', dx: 40, dy: 20 },
    ],
    defaultProps: { ratedCurrent: 3 },
  },
  {
    type: 'transformer',
    category: 'industrial',
    code: 'TR',
    name: { ar: 'محول كهربائي AC', en: 'AC Transformer', fr: 'Transformateur AC' },
    description: {
      ar: 'يرفع أو يخفض الجهد المتردد وفق نسبة التحويل (N2/N1).',
      en: 'Steps AC voltage up or down according to turns ratio (N2/N1).',
      fr: 'Élève ou abaisse la tension alternative selon le rapport N2/N1.',
    },
    modelNote: {
      ar: 'محول خطي مثالي في التغذية المترددة؛ يخرج 0V عند التغذية بجهد DC مستمر.',
      en: 'Ideal linear AC transformer model; produces 0V under steady DC excitation.',
      fr: 'Transformateur linéaire idéal en AC ; sortie nulle en régime DC permanent.',
    },
    pins: [
      { id: 'p1', label: 'P1', dx: -40, dy: -20 },
      { id: 'p2', label: 'P2', dx: -40, dy: 20 },
      { id: 's1', label: 'S1', dx: 40, dy: -20 },
      { id: 's2', label: 'S2', dx: 40, dy: 20 },
    ],
    defaultProps: { turnsRatio: 0.1 },
  },
  {
    type: 'motor',
    category: 'industrial',
    code: 'M',
    name: { ar: 'محرك كهربائي', en: 'Electric Motor', fr: 'Moteur électrique' },
    description: {
      ar: 'يعرض السرعة التقديرية (RPM) واتجاه الدوران (أمامي/عكسي) والقدرة الكهربائية.',
      en: 'Displays estimated speed (RPM), rotation direction (FWD/REV), and input power.',
      fr: 'Affiche la vitesse estimée (tr/min), le sens de rotation et la puissance.',
    },
    modelNote: {
      ar: 'نموذج حمل كهربائي ميكانيكي مبسط (مقاومة ملف مكافئة + اتجاه قطبية DC).',
      en: 'Simplified behavioral electromechanical load model (not FEA).',
      fr: 'Modèle électromécanique comportemental simplifié.',
    },
    encyclopediaId: 'dc-motors',
    pins: [
      { id: 'pos', label: '+', dx: -40, dy: 0 },
      { id: 'neg', label: '−', dx: 40, dy: 0 },
    ],
    defaultProps: { ratedVoltage: 12, resistance: 12 },
  },
  {
    type: 'plc-unit',
    category: 'industrial',
    code: 'PLC',
    name: { ar: 'وحدة PLC (Ladder)', en: 'PLC Unit (Ladder)', fr: 'Automate PLC (Ladder)' },
    description: {
      ar: 'مدخلان رقميان (I1, I2) ومخرجان (Q1, Q2) قابلة للبرمجة بلغة السلم Ladder.',
      en: '2 digital inputs (I1, I2) and 2 relay outputs (Q1, Q2) driven by Ladder rungs.',
      fr: '2 entrées (I1, I2) et 2 sorties (Q1, Q2) pilotées par programme Ladder.',
    },
    modelNote: {
      ar: 'ينفذ دورة مسح Ladder حتمية مع ذاكرة تثبيت ومؤقت، ويغذي المخرج بـ 24V أو 0V.',
      en: 'Executes deterministic Ladder scan cycle (XIC/XIO/Latch/TON) driving 24V/0V outputs.',
      fr: 'Exécute un cycle Ladder déterministe pilotant les sorties 24V/0V.',
    },
    encyclopediaId: 'plc',
    pins: [
      { id: 'i1', label: 'I1', dx: -60, dy: -20 },
      { id: 'i2', label: 'I2', dx: -60, dy: 20 },
      { id: 'com', label: 'COM', dx: 0, dy: 40 },
      { id: 'q1', label: 'Q1', dx: 60, dy: -20 },
      { id: 'q2', label: 'Q2', dx: 60, dy: 20 },
    ],
    defaultProps: { voltage: 24 },
  },

  // ── 4. ELECTRONICS & LOGIC ──
  {
    type: 'resistor',
    category: 'electronics',
    code: 'R',
    name: { ar: 'مقاومة ثابتة', en: 'Fixed Resistor', fr: 'Résistance' },
    description: {
      ar: 'عنصر خطي يقاوم التيار وفق قانون أوم V = I × R مع حساب القدرة بالواط.',
      en: 'Linear resistor obeying Ohm’s Law (V = I × R) with power dissipation check.',
      fr: 'Résistance linéaire suivant la loi d’Ohm (U = R × I).',
    },
    modelNote: {
      ar: 'مقاومة خطية مثالية ضمن المصفوفة العقدية MNA.',
      en: 'Exact linear conductance stamp in MNA matrix.',
      fr: 'Conductance linéaire exacte dans la matrice MNA.',
    },
    encyclopediaId: 'resistors',
    pins: [
      { id: 'a', label: '1', dx: -40, dy: 0 },
      { id: 'b', label: '2', dx: 40, dy: 0 },
    ],
    defaultProps: { resistance: 1000, ratedPower: 0.5 },
  },
  {
    type: 'potentiometer',
    category: 'electronics',
    code: 'POT',
    name: { ar: 'مقاومة متغيرة (Potentiometer)', en: 'Variable Resistor / Pot', fr: 'Potentiomètre' },
    description: {
      ar: 'مقسم جهد ثلاثي الأطراف بسبة منزلقة قابلة للتعديل من 1% إلى 99%.',
      en: '3-terminal variable resistor with adjustable wiper position (1%–99%).',
      fr: 'Résistance variable à 3 bornes avec curseur réglable (1%–99%).',
    },
    modelNote: {
      ar: 'ينقسم إلى مقاومتين متسلسلتين R1 + R2 عند طرف المنزلقة W.',
      en: 'Modeled as two series resistances R1 and R2 meeting at wiper pin W.',
      fr: 'Modélisé par deux résistances R1 et R2 au curseur W.',
    },
    encyclopediaId: 'resistors',
    pins: [
      { id: 't1', label: '1', dx: -40, dy: 0 },
      { id: 'wiper', label: 'W', dx: 0, dy: -40 },
      { id: 't2', label: '2', dx: 40, dy: 0 },
    ],
    defaultProps: { resistance: 10000, wiperPercent: 50 },
  },
  {
    type: 'capacitor',
    category: 'electronics',
    code: 'C',
    name: { ar: 'مكثف كهربائي', en: 'Capacitor', fr: 'Condensateur' },
    description: {
      ar: 'يخزن الشحنة الكهربائية ويظهر منحنى الشحن/التفريغ RC مع الزمن.',
      en: 'Stores electric charge and simulates time-domain RC charging & AC reactance.',
      fr: 'Stocke la charge électrique et simule le régime transitoire RC et AC.',
    },
    modelNote: {
      ar: 'نموذج التكامل الزمني Backward Euler في الدوائر العابرة وممانعة Xc في AC.',
      en: 'Backward-Euler transient companion model + capacitive reactance in AC.',
      fr: 'Modèle d’intégration Backward-Euler en transitoire et réactance Xc en AC.',
    },
    encyclopediaId: 'capacitors',
    pins: [
      { id: 'pos', label: '+', dx: -40, dy: 0 },
      { id: 'neg', label: '−', dx: 40, dy: 0 },
    ],
    defaultProps: { capacitanceUf: 1000 },
  },
  {
    type: 'inductor',
    category: 'electronics',
    code: 'L',
    name: { ar: 'ملف / محث كهربائي', en: 'Inductor', fr: 'Inductance / Bobine' },
    description: {
      ar: 'يخزن الطاقة المغناطيسية ويقاوم التغير السريع في شدة التيار.',
      en: 'Stores magnetic energy and opposes rapid current change (di/dt).',
      fr: 'Stocke l’énergie magnétique et s’oppose aux variations di/dt.',
    },
    modelNote: {
      ar: 'نموذج Backward Euler في الحالة العابرة وقصر منخفض المقاومة في DC المستقر.',
      en: 'Backward-Euler companion model in transient steps; low-R path in steady DC.',
      fr: 'Modèle Backward-Euler en transitoire ; faible résistance en DC permanent.',
    },
    encyclopediaId: 'inductors',
    pins: [
      { id: 'a', label: '1', dx: -40, dy: 0 },
      { id: 'b', label: '2', dx: 40, dy: 0 },
    ],
    defaultProps: { inductanceMh: 100 },
  },
  {
    type: 'diode',
    category: 'electronics',
    code: 'D',
    name: { ar: 'دايود موحد (PN Diode)', en: 'Rectifier Diode', fr: 'Diode de redressement' },
    description: {
      ar: 'يمرر التيار من الأنود (A) إلى الكاثود (K) بهبوط جهد أمامي ~0.7V.',
      en: 'Conducts from Anode (A) to Cathode (K) above ~0.7V forward threshold.',
      fr: 'Conduit de l’Anode (A) vers la Cathode (K) au-delà de ~0,7V.',
    },
    modelNote: {
      ar: 'نموذج توصيل مقطعي متقارب بالحل التكراري (Vf = 0.7V).',
      en: 'Iterative piecewise-linear conduction model (Vf = 0.7 V).',
      fr: 'Modèle linéaire par morceaux itératif (Vf = 0,7 V).',
    },
    encyclopediaId: 'diodes',
    pins: [
      { id: 'anode', label: 'A', dx: -40, dy: 0 },
      { id: 'cathode', label: 'K', dx: 40, dy: 0 },
    ],
    defaultProps: { forwardVoltage: 0.7 },
  },
  {
    type: 'led',
    category: 'electronics',
    code: 'LED',
    name: { ar: 'ثنائي باعث للضوء (LED)', en: 'Light-Emitting Diode (LED)', fr: 'Diode LED' },
    description: {
      ar: 'يضيء باللون المختار عند مرور تيار أمامي ويحذر إذا فاق 30mA بدون مقاومة.',
      en: 'Emits colored light on forward current; warns if current exceeds 30 mA.',
      fr: 'S’allume en polarisation directe et alerte au-delà de 30 mA.',
    },
    modelNote: {
      ar: 'جهد أمامي حسب اللون (1.8V–3.2V) وسطوع متناسب مع شدة التيار.',
      en: 'Color-dependent forward voltage (1.8–3.2V) and proportional brightness.',
      fr: 'Seuil direct selon la couleur (1,8–3,2V) et luminosité proportionnelle.',
    },
    encyclopediaId: 'leds',
    pins: [
      { id: 'anode', label: 'A', dx: -40, dy: 0 },
      { id: 'cathode', label: 'K', dx: 40, dy: 0 },
    ],
    defaultProps: { ledColor: 'red', forwardVoltage: 2.0 },
  },
  {
    type: 'zener',
    category: 'electronics',
    code: 'DZ',
    name: { ar: 'دايود زينر (Zener Diode)', en: 'Zener Diode', fr: 'Diode Zener' },
    description: {
      ar: 'يثبّت الجهد عند جهد الانهيار العكسي Vz عند انحيازه عكسياً مع مقاومة حماية.',
      en: 'Clamps reverse voltage at rated Vz when reverse-biased via a series resistor.',
      fr: 'Stabilise la tension en inverse à sa valeur Zener Vz.',
    },
    modelNote: {
      ar: 'يوصل أمامياً عند 0.7V ويثبت عكسياً عند Vz المضبوط.',
      en: 'Forward drop 0.7V; reverse avalanche clamp at configurable Vz.',
      fr: 'Seuil direct 0,7V ; écrêtage inverse à Vz réglable.',
    },
    encyclopediaId: 'diodes',
    pins: [
      { id: 'anode', label: 'A', dx: -40, dy: 0 },
      { id: 'cathode', label: 'K', dx: 40, dy: 0 },
    ],
    defaultProps: { zenerVoltage: 5.1, forwardVoltage: 0.7 },
  },
  {
    type: 'transistor',
    category: 'electronics',
    code: 'Q',
    name: { ar: 'ترانزستور ثنائي القطب NPN', en: 'NPN BJT Transistor', fr: 'Transistor NPN BJT' },
    description: {
      ar: 'يتحكم تيار القاعدة (B) بتيار المجمع (C-E) بمعامل تكبير β.',
      en: 'Base current (B) controls collector-emitter conduction with gain β.',
      fr: 'Le courant de base (B) pilote la conduction collecteur-émetteur (gain β).',
    },
    modelNote: {
      ar: 'نموذج توصيل مقطعي: وصلة B-E بجهد 0.7V وتيار مجمع Ic = min(β·Ib, تشبع).',
      en: 'Piecewise BJT model (Vbe = 0.7V, gain β, Vce_sat clamping).',
      fr: 'Modèle BJT par morceaux (Vbe = 0,7V, gain β, saturation).',
    },
    encyclopediaId: 'transistors',
    pins: [
      { id: 'b', label: 'B', dx: -40, dy: 0 },
      { id: 'c', label: 'C', dx: 20, dy: -40 },
      { id: 'e', label: 'E', dx: 20, dy: 40 },
    ],
    defaultProps: { beta: 100 },
  },
  {
    type: 'mosfet',
    category: 'electronics',
    code: 'FET',
    name: { ar: 'موسفت N-Channel MOSFET', en: 'N-Channel MOSFET', fr: 'MOSFET canal N' },
    description: {
      ar: 'مفتاح إلكتروني يُقاد بجهد البوابة (Vgs >= Vth) بمقاومة تشغيل منخفضة.',
      en: 'Voltage-driven semiconductor switch turning ON when Vgs >= Vth.',
      fr: 'Interrupteur commandé en tension activé lorsque Vgs >= Vth.',
    },
    modelNote: {
      ar: 'بوابة معزولة عالية الممانعة، وقناة D-S بمقاومة تشغيل منخفضة عند تجاوز العتبة.',
      en: 'High-impedance insulated gate; low Rds(on) above threshold Vth.',
      fr: 'Grille isolée haute impédance ; faible Rds(on) au-delà de Vth.',
    },
    encyclopediaId: 'mosfets',
    pins: [
      { id: 'g', label: 'G', dx: -40, dy: 0 },
      { id: 'd', label: 'D', dx: 20, dy: -40 },
      { id: 's', label: 'S', dx: 20, dy: 40 },
    ],
    defaultProps: { vth: 2.0 },
  },
  {
    type: 'logic-gate',
    category: 'electronics',
    code: 'GATE',
    name: { ar: 'بوابة منطقية رقمية', en: 'Digital Logic Gate', fr: 'Porte logique' },
    description: {
      ar: 'بوابات AND / OR / NOT / NAND / XOR بمستويات منطق 0V و 5V.',
      en: 'Selectable AND / OR / NOT / NAND / XOR digital logic gate (0V / 5V).',
      fr: 'Porte logique AND / OR / NOT / NAND / XOR (niveaux 0V / 5V).',
    },
    modelNote: {
      ar: 'تعتبر ≥ 2.5V مستوى منطق 1 وتخرج 5V (أو 0V) قياساً للأرضي.',
      en: 'Inputs >= 2.5V register Logic 1; drives 5V/0V output relative to Ground.',
      fr: 'Entrées >= 2,5V vues comme 1 logique ; sortie 5V/0V par rapport à la masse.',
    },
    encyclopediaId: 'logic-gates',
    pins: [
      { id: 'inA', label: 'A', dx: -40, dy: -20 },
      { id: 'inB', label: 'B', dx: -40, dy: 20 },
      { id: 'out', label: 'Y', dx: 40, dy: 0 },
    ],
    defaultProps: { gateType: 'AND' },
  },
  {
    type: 'op-amp',
    category: 'electronics',
    code: 'OA',
    name: { ar: 'مضخم عمليات (Op-Amp)', en: 'Operational Amplifier', fr: 'Amplificateur opérationnel' },
    description: {
      ar: 'مضخم تفاضلي بمدخل غير عاكس (+) ومدخل عاكس (−) ومخرج محدد بـ ±12V.',
      en: 'Differential amplifier (+, −, OUT) supporting followers, amplifiers & comparators.',
      fr: 'Amplificateur différentiel (+, −, OUT) saturé à ±12V.',
    },
    modelNote: {
      ar: 'كسب حلقة مفتوحة عالٍ (10,000) مع تغذية داخلية ±12V افتراضية.',
      en: 'High open-loop gain (1e4) with internal ±12V rail clamping.',
      fr: 'Gain boucle ouverte élevé (1e4) avec limitation interne ±12V.',
    },
    encyclopediaId: 'integrated-circuits',
    pins: [
      { id: 'vp', label: '+', dx: -40, dy: -20 },
      { id: 'vn', label: '−', dx: -40, dy: 20 },
      { id: 'out', label: 'OUT', dx: 40, dy: 0 },
    ],
    defaultProps: { gain: 10000 },
  },

  // ── 5. VIRTUAL MEASURING INSTRUMENTS ──
  {
    type: 'voltmeter',
    category: 'instruments',
    code: 'V',
    name: { ar: 'فولتميتر (Voltmeter)', en: 'Voltmeter', fr: 'Voltmètre' },
    description: {
      ar: 'يُوصل على التوازي مع العنصر لقياس فرق الجهد بدقة بمقاومة داخلية 10MΩ.',
      en: 'Connected in parallel across nodes to measure voltage (10 MΩ input Z).',
      fr: 'Branché en parallèle pour mesurer la tension (10 MΩ).',
    },
    modelNote: {
      ar: 'مقاومة دخل 10MΩ لا تحمّل الدائرة؛ يقرأ فرق الجهد مباشرة من الحل العقدي.',
      en: '10 MΩ input impedance; reads exact solved node voltage difference.',
      fr: 'Impédance d’entrée 10 MΩ ; mesure directe depuis la solution nodale.',
    },
    encyclopediaId: 'multimeter',
    pins: [
      { id: 'pos', label: '+', dx: -40, dy: 0 },
      { id: 'neg', label: '−', dx: 40, dy: 0 },
    ],
    defaultProps: {},
  },
  {
    type: 'ammeter',
    category: 'instruments',
    code: 'A',
    name: { ar: 'أميتر (Ammeter)', en: 'Ammeter', fr: 'Ampèremètre' },
    description: {
      ar: 'يُوصل على التوالي داخل الفرع لقياس شدة التيار الكهربائي بالامبير/ميلي أمبير.',
      en: 'Connected in series in a branch to measure real branch current (0.01 Ω shunt).',
      fr: 'Branché en série dans la branche pour mesurer le courant (shunt 0,01 Ω).',
    },
    modelNote: {
      ar: 'تحذير: توصيله على التوازي مع المصدر مباشرة يسبب تيار قصر عالٍ.',
      en: 'Shunt resistance 0.01 Ω; never wire directly across a voltage source!',
      fr: 'Shunt 0,01 Ω ; ne jamais brancher en parallèle sur une source !',
    },
    encyclopediaId: 'clamp-meter',
    pins: [
      { id: 'pos', label: '+', dx: -40, dy: 0 },
      { id: 'neg', label: '−', dx: 40, dy: 0 },
    ],
    defaultProps: {},
  },
  {
    type: 'ohmmeter',
    category: 'instruments',
    code: 'Ω',
    name: { ar: 'أوميتر (Ohmmeter)', en: 'Ohmmeter', fr: 'Ohmmètre' },
    description: {
      ar: 'يقيس المقاومة المكافئة للدائرة المفصولة عن التغذية (يحذر عند وجود جهد حي).',
      en: 'Measures equivalent passive resistance on de-energized circuits (warns if live).',
      fr: 'Mesure la résistance équivalente hors tension (alerte si sous tension).',
    },
    modelNote: {
      ar: 'يحقن تيار اختبار داخلي لحساب المقاومة المكافئة بشرط انعدام الجهد الخارجي.',
      en: 'Computes Thévenin resistance across probes; requires de-energized branch.',
      fr: 'Calcule la résistance équivalente hors source active.',
    },
    encyclopediaId: 'multimeter',
    pins: [
      { id: 'pos', label: '+', dx: -40, dy: 0 },
      { id: 'neg', label: '−', dx: 40, dy: 0 },
    ],
    defaultProps: {},
  },
  {
    type: 'multimeter',
    category: 'instruments',
    code: 'DMM',
    name: { ar: 'ملتيميتر رقمي (Multimeter)', en: 'Digital Multimeter', fr: 'Multimètre numérique' },
    description: {
      ar: 'جهاز قياس متعدد الأوضاع (جهد مستمر/متردد، تيار، مقاومة).',
      en: 'Multi-mode instrument supporting V DC, V AC, I DC, and Resistance Ω.',
      fr: 'Appareil multimode (V DC, V AC, I DC, Résistance Ω).',
    },
    modelNote: {
      ar: 'يتبع قواعد التوصيل الحقيقية لكل وضع: توازي للجهد/الأوم وتوالي للتيار.',
      en: 'Applies true parallel (V/Ω) or series shunt (I) electrical model per mode.',
      fr: 'Applique le modèle réel parallèle (V/Ω) ou série (I) selon le calibre.',
    },
    encyclopediaId: 'multimeter',
    pins: [
      { id: 'pos', label: '+', dx: -40, dy: 0 },
      { id: 'neg', label: '−', dx: 40, dy: 0 },
    ],
    defaultProps: { multimeterMode: 'V_DC' },
  },
  {
    type: 'power-meter',
    category: 'instruments',
    code: 'W',
    name: { ar: 'مقياس القدرة (Wattmeter)', en: 'Power Meter (Wattmeter)', fr: 'Wattmètre' },
    description: {
      ar: 'يقيس القدرة الكهربائية الحقيقية بالواط عبر ملف تيار توالي وملف جهد توازي.',
      en: 'Measures true electrical power (W) via series current & parallel voltage sense.',
      fr: 'Mesure la puissance active (W) via voie courant série et tension parallèle.',
    },
    modelNote: {
      ar: 'أطراف (IN-OUT) تمرر التيار والطرف المرجعي (N) يقرأ الجهد لحساب P = V × I.',
      en: 'Current path IN→OUT multiplied by voltage V(IN)−V(N) yields P = V × I.',
      fr: 'Le courant IN→OUT multiplié par la tension U(IN)−U(N) donne P = U × I.',
    },
    pins: [
      { id: 'in', label: 'IN', dx: -40, dy: -20 },
      { id: 'out', label: 'OUT', dx: 40, dy: -20 },
      { id: 'ref', label: 'N', dx: 0, dy: 40 },
    ],
    defaultProps: {},
  },
  {
    type: 'oscilloscope',
    category: 'instruments',
    code: 'OSC',
    name: { ar: 'راسم إشارة (Oscilloscope)', en: '2-Ch Oscilloscope', fr: 'Oscilloscope 2 voies' },
    description: {
      ar: 'يرسم الموجات الزمنية الحقيقية للقناتين CH1 و CH2 قياساً للأرضي.',
      en: 'Plots real-time transient & AC waveforms on CH1 and CH2 relative to GND.',
      fr: 'Trace les courbes temporelles réelles CH1 et CH2 par rapport à GND.',
    },
    modelNote: {
      ar: 'يتصل بطرفي CH1 و CH2 مع المرجع GND ويعرض الموجة في لوحة القياس.',
      en: 'Plots actual transient/AC solver time series in the Scope panel.',
      fr: 'Affiche la série temporelle calculée dans le panneau Oscilloscope.',
    },
    encyclopediaId: 'oscilloscope',
    pins: [
      { id: 'ch1', label: 'CH1', dx: -40, dy: -20 },
      { id: 'ch2', label: 'CH2', dx: -40, dy: 20 },
      { id: 'gnd', label: 'GND', dx: 40, dy: 0 },
    ],
    defaultProps: {},
  },
];

export function getCatalogItem(type: LabComponentType): LabCatalogItem {
  const found = LAB_COMPONENT_CATALOG.find((item) => item.type === type);
  if (!found) {
    throw new Error(`Unknown lab component type: ${type}`);
  }
  return found;
}

export function getComponentPins(comp: LabComponentInstance): LabPinSpec[] {
  const base = getCatalogItem(comp.type).pins;
  if (comp.type === 'logic-gate' && comp.props.gateType === 'NOT') {
    return [
      { id: 'inA', label: 'A', dx: -40, dy: 0 },
      { id: 'out', label: 'Y', dx: 40, dy: 0 },
    ];
  }
  return base;
}

export function snapToGrid(value: number, grid = LAB_GRID_SIZE): number {
  return Math.round(value / grid) * grid;
}

export function getPinWorldPosition(
  comp: LabComponentInstance,
  pin: LabPinSpec
): { x: number; y: number } {
  const rad = (comp.rotation * Math.PI) / 180;
  const cos = Math.round(Math.cos(rad));
  const sin = Math.round(Math.sin(rad));
  return {
    x: comp.x + pin.dx * cos - pin.dy * sin,
    y: comp.y + pin.dx * sin + pin.dy * cos,
  };
}
