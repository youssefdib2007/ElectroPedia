import type { LocalizedText, WiringLibraryCategory, WiringLibraryItem } from '../types/electronics';

export const WIRING_LIBRARY_CATEGORIES: { id: WiringLibraryCategory; label: LocalizedText }[] = [
  { id: 'lighting', label: { ar: 'دوائر الإنارة', en: 'Lighting Circuits', fr: 'Circuits d’éclairage' } },
  { id: 'series-parallel', label: { ar: 'التوالي والتوازي', en: 'Series & Parallel', fr: 'Série et parallèle' } },
  { id: 'dc-circuits', label: { ar: 'دوائر التيار المستمر', en: 'DC Circuits', fr: 'Circuits DC' } },
  { id: 'control', label: { ar: 'دوائر التحكم', en: 'Control Circuits', fr: 'Circuits de commande' } },
  { id: 'relays', label: { ar: 'دوائر المرحلات', en: 'Relay Circuits', fr: 'Circuits à relais' } },
  { id: 'contactors', label: { ar: 'دوائر الكونتاكتورات', en: 'Contactor Circuits', fr: 'Circuits contacteurs' } },
  { id: 'motors', label: { ar: 'دوائر المحركات', en: 'Motor Circuits', fr: 'Circuits moteurs' } },
  { id: 'electronics', label: { ar: 'الدوائر الإلكترونية', en: 'Basic Electronics', fr: 'Électronique de base' } },
];

export const WIRING_LIBRARY_ITEMS: WiringLibraryItem[] = [
  // 1. LIGHTING
  {
    id: 'wd-single-lamp',
    category: 'lighting',
    title: {
      ar: 'دائرة إنارة بسيطة (مفتاح أحادي القطب + قاطع)',
      en: 'Single-Pole Lighting Circuit (MCB + Switch + Lamp)',
      fr: 'Circuit d’éclairage simple allumage',
    },
    summary: {
      ar: 'القطع الإلزامي على خط الطور الحار (L) مع توصيل الحيادي (N) مباشرة إلى المصباح.',
      en: 'Switches the live phase conductor (L) while routing Neutral (N) directly to the lamp.',
      fr: 'Coupure obligatoire sur la phase (L) avec raccordement direct du neutre (N) à la lampe.',
    },
    explanation: {
      ar: 'يخرج خط الطور (L) من القاطع B10A نحو دخل المفتاح (COM) ثم يعود سلك الراجع (Switched Live) إلى المصباح، بينما يتصل الحيادي (N) مباشرة بالقاعدة دون المرور بالمفتاح كي لا يبقى جهد خطير في الحاملة عند الإطفاء.',
      en: 'Phase (L) exits a 10A MCB to the switch terminal and returns via the switched live wire to the lamp center contact, while Neutral (N) connects directly to the lamp shell so no hazardous voltage remains when switched off.',
      fr: 'La phase (L) traverse un disjoncteur 10A vers l’interrupteur puis repart vers la lampe, tandis que le neutre (N) rejoint directement la douille pour garantir l’absence de tension une fois éteinte.',
    },
    voltageRating: '230V AC · 50Hz',
    standardRef: 'IEC 60364 / NF C 15-100 (1.5 mm² · 10A)',
    componentsUsed: [
      { name: { ar: 'قاطع أوتوماتيكي B10A', en: 'MCB B10A', fr: 'Disjoncteur B10A' }, symbolCode: 'QF', componentId: 'circuit-breakers' },
      { name: { ar: 'مفتاح إنارة مفرد', en: 'Single Light Switch', fr: 'Interrupteur simple' }, symbolCode: 'S1', componentId: 'light-switches' },
      { name: { ar: 'مصباح LED', en: 'LED Lamp', fr: 'Lampe LED' }, symbolCode: 'EL', componentId: 'lamps' },
    ],
    symbolsUsed: ['QF (MCB)', 'S1 (SPST)', 'EL (Lamp)', 'L / N / PE'],
    safetyPrecautions: [
      {
        ar: 'تأكد من عدم عكس الطور والحيادي؛ يجب أن يقطع المفتاح خط الطور فقط.',
        en: 'Never switch the Neutral instead of Phase — the lamp holder would remain live.',
        fr: 'Ne jamais couper le neutre à la place de la phase ; la douille resterait sous tension.',
      },
      {
        ar: 'استخدم سلك 1.5mm² محمي بقاطع 10A كحد أقصى لدوائر الإنارة القياسية.',
        en: 'Use 1.5 mm² copper wire protected by a maximum 10A MCB.',
        fr: 'Utiliser du câble cuivre 1,5 mm² protégé par un disjoncteur 10A max.',
      },
    ],
    svgId: 'lighting_simple',
  },
  {
    id: 'wd-two-way-lighting',
    category: 'lighting',
    title: {
      ar: 'دائرة إنارة دركسيون (تحكم من مكانين Va-et-Vient)',
      en: 'Two-Way Staircase Lighting (Va-et-Vient)',
      fr: 'Éclairage va-et-vient (2 interrupteurs)',
    },
    summary: {
      ar: 'تشغيل وإطفاء مصباح واحد من مدخلين مختلفين باستخدام مفتاحي تبديل وسلكي ربط.',
      en: 'Controls one light independently from two locations using two SPDT switches.',
      fr: 'Commande d’un point lumineux depuis deux endroits par deux inverseurs.',
    },
    explanation: {
      ar: 'يدخل الطور (L) إلى الطرف المشترك COM للمفتاح الأول، ويُربط المخرجان 1 و 2 بسلكي المراسلة (Travelers) مع المفتاح الثاني، بينما يخرج الطرف المشترك COM للمفتاح الثاني نحو المصباح.',
      en: 'Live (L) feeds COM on Switch 1. Terminals L1/L2 connect via two traveler wires to Switch 2, whose COM feeds the lamp.',
      fr: 'La phase alimente le commun COM du 1er interrupteur, relié par deux fils navettes au 2e interrupteur dont le commun alimente la lampe.',
    },
    voltageRating: '230V AC · 50Hz',
    standardRef: 'IEC 60364 (1.5 mm²)',
    componentsUsed: [
      { name: { ar: 'قاطع B10A', en: 'MCB B10A', fr: 'Disjoncteur B10A' }, symbolCode: 'QF', componentId: 'circuit-breakers' },
      { name: { ar: 'مفتاحا تبديل (×2)', en: 'Two-Way Switches (×2)', fr: 'Inverseurs va-et-vient (×2)' }, symbolCode: 'S1 / S2', componentId: 'light-switches' },
      { name: { ar: 'مصباح الإنارة', en: 'Lamp', fr: 'Lampe' }, symbolCode: 'EL', componentId: 'lamps' },
    ],
    symbolsUsed: ['S6 (SPDT ×2)', 'QF', 'EL', 'PE'],
    safetyPrecautions: [
      {
        ar: 'استخدم ألواناً مختلفة لأسلاك المراسلة (برتقالي/بنفسجي مثلاً) وتجنب لون الحيادي الأزرق.',
        en: 'Color-code traveler conductors distinctly and never use blue (Neutral) or green-yellow (PE).',
        fr: 'Repérer les fils navettes avec des couleurs dédiées (jamais bleu ni vert-jaune).',
      },
    ],
    svgId: 'lighting_two_way',
  },

  // 2. SERIES & PARALLEL
  {
    id: 'wd-series-parallel',
    category: 'series-parallel',
    title: {
      ar: 'مقارنة التوصيل على التوالي والتوصيل على التوازي',
      en: 'Series vs. Parallel Circuit Topology',
      fr: 'Circuits série et parallèle comparés',
    },
    summary: {
      ar: 'مقارنة توزيع الجهد والتيار والمقاومة المكافئة في الدوائر المتوالية والمتوازية.',
      en: 'Contrasts current path, voltage division, and fault behavior in series and parallel.',
      fr: 'Compare le partage de tension, de courant et l’effet d’une coupure en série vs parallèle.',
    },
    explanation: {
      ar: 'في التوصيل على التوالي يمر نفس التيار I عبر كل العناصر ويتوزع الجهد (V = V1 + V2) وإذا انقطع عنصر تتوقف الدائرة؛ أما في التوازي فيأخذ كل فرع نفس الجهد الكامل V ويتوزع التيار (I = I1 + I2) كما في المآخذ المنزلية.',
      en: 'In Series, identical current flows through every load and voltage divides (V = V1 + V2). In Parallel, every branch receives full supply voltage and currents sum (I = I1 + I2).',
      fr: 'En série, le même courant traverse chaque dipôle et les tensions s’additionnent. En parallèle, chaque branche reçoit toute la tension et les courants s’additionnent.',
    },
    voltageRating: '12V DC / 230V AC Model',
    standardRef: 'Kirchhoff KVL / KCL Fundamentals',
    componentsUsed: [
      { name: { ar: 'مقاومات / أحمال', en: 'Resistors / Loads', fr: 'Résistances / Charges' }, symbolCode: 'R1, R2', componentId: 'resistors' },
      { name: { ar: 'مصدر تغذية', en: 'Voltage Source', fr: 'Source de tension' }, symbolCode: 'V', componentId: 'batteries' },
    ],
    symbolsUsed: ['R1, R2', 'I = const (Series)', 'V = const (Parallel)'],
    safetyPrecautions: [
      {
        ar: 'توصيل الأجهزة المنزلية يتم دائماً على التوازي مع حماية كل فرع بقاطع مناسب لمنع التحميل الزائد.',
        en: 'Mains sockets and appliances are always wired in parallel; never exceed main busbar ampacity.',
        fr: 'Les prises et appareils sont toujours câblés en parallèle ; surveiller le courant total.',
      },
    ],
    svgId: 'series_parallel',
  },

  // 3. DC CIRCUITS
  {
    id: 'wd-dc-regulated-supply',
    category: 'dc-circuits',
    title: {
      ar: 'دائرة تغذية مستمرة منظمة +5V DC من المحول حتى منظم 7805',
      en: 'Regulated +5V DC Linear Power Supply (Rectifier + Filter + 7805)',
      fr: 'Alimentation continue régulée +5V DC (Pont + Filtrage + 7805)',
    },
    summary: {
      ar: 'تحويل الجهد المتردد المخفض إلى جهد مستمر ناعم ومنظم لتغذية الدوائر الرقمية.',
      en: 'Transforms, rectifies, smooths, and regulates AC input into clean +5V DC.',
      fr: 'Abaisse, redresse, lisse et régule la tension AC en +5V DC stable.',
    },
    explanation: {
      ar: 'يخفض المحول الجهد إلى 9V AC، ثم يحوله جسر الدايودات الأربع (Bridge) إلى جهد موجب نابض، وينعمه المكثف الكيميائي الكبير C1، قبل أن يثبته المنظم LM7805 عند 5.0V مع مكثفات إزالة الضوضاء Cin/Cout.',
      en: 'A step-down transformer feeds a 4-diode bridge rectifier, smoothed by bulk capacitor C1, then regulated to +5.0V by an LM7805 with bypass caps.',
      fr: 'Un transformateur abaisseur alimente un pont de 4 diodes lissé par C1 puis régulé à +5V par un LM7805 avec condensateurs de découplage.',
    },
    voltageRating: '230V AC → 9V AC → +5V DC (1A)',
    standardRef: 'IEEE / IEC Linear PSU Topology',
    componentsUsed: [
      { name: { ar: 'جسر دايودات', en: 'Bridge Rectifier D1–D4', fr: 'Pont redresseur' }, symbolCode: 'VD', componentId: 'diodes' },
      { name: { ar: 'مكثف ترشيح ومكثفات سيراميكية', en: 'Filter & Bypass Capacitors', fr: 'Condensateurs de lissage' }, symbolCode: 'C1–C3', componentId: 'capacitors' },
      { name: { ar: 'منظم الجهد 7805', en: '7805 Voltage Regulator', fr: 'Régulateur 7805' }, symbolCode: 'U1', componentId: 'voltage-regulators' },
      { name: { ar: 'مصهر حماية ابتدائي', en: 'Primary Fuse', fr: 'Fusible primaire' }, symbolCode: 'FU', componentId: 'fuses' },
    ],
    symbolsUsed: ['FU', 'TR', 'Bridge D1-D4', 'C1', 'LM7805'],
    safetyPrecautions: [
      {
        ar: 'اعزل جهة الدخل 230V جيداً وركب مصهراً على الابتدائي ومشتتاً حرارياً للمنظم 7805.',
        en: 'Always place a fuse on the 230V primary side, isolate mains traces, and mount a heatsink on the 7805.',
        fr: 'Toujours protéger le primaire 230V par fusible et monter un dissipateur sur le 7805.',
      },
    ],
    svgId: 'dc_regulated_psu',
  },

  // 4. CONTROL CIRCUITS
  {
    id: 'wd-start-stop-latch',
    category: 'control',
    title: {
      ar: 'دائرة تحكم تشغيل/إيقاف مع القفل الذاتي (Start/Stop Self-Latch)',
      en: 'Start / Stop Pushbutton Latch Control Circuit (3-Wire)',
      fr: 'Schéma de commande Marche / Arrêt avec auto-maintien',
    },
    summary: {
      ar: 'تشغيل ملف الكونتاكتور بضغطة لحظية مع استمرار التشغيل عبر التلامس المساعد 13–14.',
      en: 'Latches coil KM1 using auxiliary NO contact (13–14) wired in parallel with START.',
      fr: 'Maintient la bobine KM1 grâce au contact auxiliaire NO (13–14) en parallèle sur Marche.',
    },
    explanation: {
      ar: 'يمر تيار التحكم عبر نقطة NC للأوفرلود (95–96) ثم زر الإيقاف STOP (NC 11–12)، ثم زر التشغيل START (NO 13–14) بالتوازي مع نقطة KM1 (13–14) ليغذي الملف A1–A2. عند انقطاع الكهرباء يفقد الملف طاقته ولا يعود للعمل تلقائياً (حماية No-Volt).',
      en: 'Control supply passes through F1 OL (95–96) and STOP NC (11–12) to START NO (13–14) in parallel with KM1 (13–14), energizing coil A1–A2. Loss of power drops the latch for intrinsic No-Volt safety.',
      fr: 'Le courant traverse F1 (95–96) puis Arrêt (NC), puis Marche (NO) en parallèle avec l’auto-maintien KM1 (13–14). Toute coupure secteur désarme le circuit par sécurité.',
    },
    voltageRating: '24V DC / 230V AC Control',
    standardRef: 'IEC 60204-1 Machinery Control',
    componentsUsed: [
      { name: { ar: 'زر إيقاف أحمر (NC)', en: 'Red STOP Button (NC)', fr: 'Bouton Arrêt (NC)' }, symbolCode: 'S0', componentId: 'push-buttons' },
      { name: { ar: 'زر تشغيل أخضر (NO)', en: 'Green START Button (NO)', fr: 'Bouton Marche (NO)' }, symbolCode: 'S1', componentId: 'push-buttons' },
      { name: { ar: 'كونتاكتور (ملف وتلامس 13–14)', en: 'Contactor Coil & 13–14', fr: 'Bobine & contact KM1' }, symbolCode: 'KM1', componentId: 'contactors' },
      { name: { ar: 'تلامس الأوفرلود (95–96)', en: 'Overload NC (95–96)', fr: 'Relais thermique (95–96)' }, symbolCode: 'F1', componentId: 'thermal-overload-relays' },
    ],
    symbolsUsed: ['F1 (95-96)', 'S0 (NC)', 'S1 (NO)', 'KM1 (13-14)', 'A1-A2'],
    safetyPrecautions: [
      {
        ar: 'يجب وضع زر الإيقاف والطوارئ قبل زر التشغيل على التوالي لضمان أولوية الفصل في كل الحالات.',
        en: 'STOP / E-Stop NC contacts must always be wired in series upstream of START for failsafe shutdown.',
        fr: 'Les contacts NC d’arrêt/urgence doivent toujours être en série en amont du bouton Marche.',
      },
    ],
    svgId: 'control_latch',
  },

  // 5. RELAYS
  {
    id: 'wd-relay-flyback',
    category: 'relays',
    title: {
      ar: 'دائرة مرحل كهرومغناطيسي (12V/24V) مع دايود الحماية (Flyback Diode)',
      en: 'Electromagnetic Relay Driver with Flyback Diode Isolation',
      fr: 'Commande de relais avec diode de roue libre',
    },
    summary: {
      ar: 'قيادة حمل AC بجهد عالٍ عبر مرحل معزول مع حماية ترانزستور القيادة من نبضة الملف العكسية.',
      en: 'Switches an isolated AC load safely while protecting the DC coil transistor with 1N4007.',
      fr: 'Commute une charge AC isolée tout en protégeant la commande DC par diode 1N4007.',
    },
    explanation: {
      ar: 'يضمن المرحل عزلاً جلفانياً تاماً بين جهة التحكم DC (A1–A2) وجهة القدرة (COM / NO). يُركب دايود 1N4007 بالانحياز العكسي على طرفي الملف لتفريغ الجهد الحثي العالي (-L di/dt) لحظة إطفاء الملف.',
      en: 'The relay isolates the DC control coil from AC load contacts (COM/NO). A reverse-biased 1N4007 diode across A1–A2 clamps the inductive voltage spike when turning off.',
      fr: 'Le relais isole la bobine DC des contacts de charge AC. Une diode 1N4007 en inverse absorbe la surtension inductive à la coupure de la bobine.',
    },
    voltageRating: '12V DC Coil / 230V AC Load',
    standardRef: 'IEC 61810 Electromechanical Relays',
    componentsUsed: [
      { name: { ar: 'مرحل كهرومغناطيسي', en: 'Electromagnetic Relay', fr: 'Relais électromagnétique' }, symbolCode: 'KA1', componentId: 'relays' },
      { name: { ar: 'دايود حماية 1N4007', en: 'Flyback Diode 1N4007', fr: 'Diode de roue libre' }, symbolCode: 'VD1', componentId: 'diodes' },
      { name: { ar: 'ترانزستور قيادة NPN', en: 'NPN Driver Transistor', fr: 'Transistor NPN' }, symbolCode: 'Q1', componentId: 'transistors' },
    ],
    symbolsUsed: ['KA1 (A1/A2, COM/NO)', '1N4007 Flyback', 'Q1 NPN'],
    safetyPrecautions: [
      {
        ar: 'لا تلمس مسارات نقاط التلامس COM/NO عند وصلها بالجهد العالي ووفر مسافة عزل كافية على اللوحة.',
        en: 'Keep generous creepage/clearance spacing between DC coil traces and 230V AC load terminals.',
        fr: 'Maintenir une distance d’isolement suffisante entre la commande DC et les contacts 230V AC.',
      },
    ],
    svgId: 'relay_flyback',
  },

  // 6. CONTACTORS
  {
    id: 'wd-contactor-power-control',
    category: 'contactors',
    title: {
      ar: 'دائرة قدرة وتحكم بالكونتاكتور مع مفتاح طوارئ E-Stop ومؤقت',
      en: 'Industrial Contactor Power & E-Stop Interlocked Control',
      fr: 'Circuit puissance et commande de contacteur avec Arrêt d’Urgence',
    },
    summary: {
      ar: 'تغذية حمل صناعي ثلاثي الطور عبر تلامسات الكونتاكتور الرئيسية L1/L2/L3–T1/T2/T3.',
      en: 'Feeds a heavy 3-phase load through KM1 main poles with lockable Emergency Stop.',
      fr: 'Alimente une charge triphasée via les pôles principaux KM1 avec coupure d’urgence.',
    },
    explanation: {
      ar: 'تتغذى الأقطاب الرئيسية للكونتاكتور من قاطع ثلاثي الطور ثم تخرج نحو الحمل، بينما يتغذى ملف A1–A2 عبر قاطع تحكم مستقل C2A ومفتاح الطوارئ E-Stop.',
      en: 'Three-phase power flows via main breaker QF1 and KM1 power poles to the load, while control circuit A1–A2 runs through a dedicated 2A control MCB and mushroom E-Stop.',
      fr: 'La puissance triphasée passe par QF1 et les pôles KM1, tandis que la bobine A1–A2 est protégée par un disjoncteur 2A et l’arrêt d’urgence.',
    },
    voltageRating: '400V AC 3~ Power / 230V AC Coil',
    standardRef: 'IEC 60947-4-1',
    componentsUsed: [
      { name: { ar: 'كونتاكتور صناعي', en: 'Industrial Contactor', fr: 'Contacteur industriel' }, symbolCode: 'KM1', componentId: 'contactors' },
      { name: { ar: 'قاطع أوتوماتيكي', en: '3-Pole MCB', fr: 'Disjoncteur tripolaire' }, symbolCode: 'QF1', componentId: 'circuit-breakers' },
      { name: { ar: 'مفتاح طوارئ / أزرار', en: 'E-Stop & Push Buttons', fr: 'Arrêt d’urgence & boutons' }, symbolCode: 'S0 / S1', componentId: 'push-buttons' },
    ],
    symbolsUsed: ['QF1 3P', 'KM1 (1-2, 3-4, 5-6)', 'E-Stop NC', 'A1-A2'],
    safetyPrecautions: [
      {
        ar: 'تأكد من مطابقة جهد ملف الكونتاكتور (24V أو 230V) مع مصدر دائرة التحكم قبل التشغيل.',
        en: 'Always verify contactor coil voltage rating (24V vs 230V) before energizing control power.',
        fr: 'Toujours vérifier la tension nominale de la bobine (24V ou 230V) avant mise sous tension.',
      },
    ],
    svgId: 'contactor_industrial',
  },

  // 7. MOTORS
  {
    id: 'wd-motor-dol',
    category: 'motors',
    title: {
      ar: 'إقلاع محرك ثلاثي الطور مباشرة على الخط (DOL Motor Starter)',
      en: 'Direct-On-Line (DOL) 3-Phase Induction Motor Starter',
      fr: 'Démarrage direct (DOL) moteur asynchrone triphasé',
    },
    summary: {
      ar: 'المنظومة الصناعية القياسية لحماية وإقلاع محرك 3~ بقاطع وكونتاكتور وأوفرلود حراري.',
      en: 'Complete 3-phase power + control starter combining MCB, Contactor, Thermal Overload, and PE.',
      fr: 'Démarreur industriel complet avec disjoncteur, contacteur, relais thermique et terre PE.',
    },
    explanation: {
      ar: 'دائرة القدرة (يسار) تحمي المحرك من القصر عبر القاطع Q1، وتشغله عبر KM1، وتحميه من الحمل الزائد عبر F1 المتصل بأطراف المحرك U1/V1/W1 مع تأريض PE. دائرة التحكم (يمين) تفصل تلقائياً عند تفعيل F1 (95–96).',
      en: 'Power stage protects against short-circuits (Q1), switches motor phases (KM1), and senses overload (F1). Control circuit includes F1 NC (95–96) to trip KM1 immediately on overload.',
      fr: 'La puissance combine Q1, KM1 et le relais thermique F1 vers U1/V1/W1 avec terre PE. Le contact 95–96 de F1 coupe instantanément la bobine KM1 en cas de surcharge.',
    },
    voltageRating: '400V AC 3~ · 50Hz',
    standardRef: 'IEC 60947-4-1 / IEC 60204-1',
    componentsUsed: [
      { name: { ar: 'محرك ثلاثي الطور', en: '3-Phase Induction Motor', fr: 'Moteur triphasé' }, symbolCode: 'M1 3~', componentId: 'three-phase-motors' },
      { name: { ar: 'كونتاكتور', en: 'Contactor KM1', fr: 'Contacteur KM1' }, symbolCode: 'KM1', componentId: 'contactors' },
      { name: { ar: 'مرحل حراري أوفرلود', en: 'Thermal Overload F1', fr: 'Relais thermique F1' }, symbolCode: 'F1', componentId: 'thermal-overload-relays' },
      { name: { ar: 'بادئ حركة / قاطع', en: 'Motor Protection Breaker', fr: 'Disjoncteur moteur' }, symbolCode: 'Q1', componentId: 'motor-starters' },
    ],
    symbolsUsed: ['Q1', 'KM1', 'F1 (OL 95-96)', 'M 3~', 'PE'],
    safetyPrecautions: [
      {
        ar: 'اضبط مؤشر التيار في المرحل الحراري F1 على تيار اللوحة الاسمية للمحرك (In) تماماً.',
        en: 'Dial the thermal overload trip setting strictly to the motor nameplate full-load current (In).',
        fr: 'Régler le relais thermique exactement sur le courant nominal indiqué sur la plaque moteur.',
      },
      {
        ar: 'وصل هيكل المحرك المعدني بالتأريض الوقائي PE قبل أي تجربة تشغيل.',
        en: 'Ensure protective earth (PE) is bolted firmly to the motor frame terminal before testing.',
        fr: 'Raccorder solidement la carcasse moteur à la terre PE avant tout essai.',
      },
    ],
    svgId: 'motor_dol',
  },
  {
    id: 'wd-motor-forward-reverse',
    category: 'motors',
    title: {
      ar: 'عكس دوران محرك ثلاثي الطور مع تشابك كهربائي (Forward / Reverse)',
      en: 'Forward / Reverse 3-Phase Motor with Electrical Interlock',
      fr: 'Inversion de sens moteur triphasé avec verrouillage électrique',
    },
    summary: {
      ar: 'تبديل طورين (L1 و L3) عبر كونتاكتورين KM1 و KM2 مع منع عملهما معاً بتاتاً.',
      en: 'Swaps two supply phases via KM1/KM2 with cross-wired NC interlocks preventing phase short.',
      fr: 'Inverse deux phases via KM1/KM2 avec verrouillage croisé par contacts NC.',
    },
    explanation: {
      ar: 'يغذي KM1 الأطوار بالترتيب L1-L2-L3 بينما يعكس KM2 الطورين L1 و L3 لعكس المجال المغناطيسي الدوار. يُوصل تلامس NC (21–22) من KM2 على التوالي مع ملف KM1 والعكس لمنع حدوث تماس مباشر بين الطورين.',
      en: 'KM1 feeds U1-V1-W1 directly while KM2 swaps L1 and L3 to reverse rotor direction. Cross-wired NC contacts (KM2 21–22 in KM1 branch and vice versa) guarantee both cannot close simultaneously.',
      fr: 'KM1 alimente en ordre direct et KM2 croise deux phases. Les contacts NC croisés (21–22) interdisent la fermeture simultanée des deux contacteurs.',
    },
    voltageRating: '400V AC 3~ · Interlocked',
    standardRef: 'IEC 60947-4-1 Mechanical + Electrical Interlock',
    componentsUsed: [
      { name: { ar: 'كونتاكتور دوران يمين/يسار (×2)', en: 'Reversing Contactors KM1 & KM2', fr: 'Contacteurs KM1 & KM2' }, symbolCode: 'KM1 / KM2', componentId: 'contactors' },
      { name: { ar: 'محرك ثلاثي الطور', en: '3-Phase Motor', fr: 'Moteur triphasé' }, symbolCode: 'M 3~', componentId: 'three-phase-motors' },
      { name: { ar: 'مرحل حراري', en: 'Thermal Overload', fr: 'Relais thermique' }, symbolCode: 'F1', componentId: 'thermal-overload-relays' },
    ],
    symbolsUsed: ['KM1', 'KM2', '21-22 NC Interlock', 'M 3~'],
    safetyPrecautions: [
      {
        ar: 'استخدم التشابك الميكانيكي (Mechanical Interlock) مع التشابك الكهربائي لمنع التماس بين الطورين L1–L3.',
        en: 'Always combine mechanical interlocking with electrical NC interlocking between reversing contactors.',
        fr: 'Toujours associer un verrouillage mécanique au verrouillage électrique entre KM1 et KM2.',
      },
    ],
    svgId: 'motor_fwd_rev',
  },

  // 8. BASIC ELECTRONICS
  {
    id: 'wd-led-current-limit',
    category: 'electronics',
    title: {
      ar: 'توصيل LED مع مقاومة تحديد التيار وتقسيم الجهد',
      en: 'LED Current-Limiting Resistor & Protection Circuit',
      fr: 'Diode LED avec résistance de limitation de courant',
    },
    summary: {
      ar: 'تحديد تيار الدايود الباعث للضوء عند 15–20mA باستخدام مقاومة على التوالي.',
      en: 'Protects an LED from burnout by setting forward current via R = (Vs − Vf) / If.',
      fr: 'Protège la LED contre la destruction en fixant le courant via R = (Vs − Vf) / If.',
    },
    explanation: {
      ar: 'يمتلك الـ LED مقاومة داخلية ضئيلة جداً بعد جهد الفتح Vf (~2V)، لذا فإن وصله مباشرة بجهد 5V أو 12V يحرقه فوراً. توضع المقاومة على التوالي لحساب التيار الآمن وفق R = (Vs - Vf) / If.',
      en: 'Above forward voltage Vf (~2V), an LED conducts exponentially. A series resistor drops the excess supply voltage and limits current safely.',
      fr: 'Au-delà de Vf (~2V), le courant croît exponentiellement ; la résistance en série absorbe l’excédent de tension et limite le courant.',
    },
    voltageRating: '5V / 12V DC',
    standardRef: 'Semiconductor Basic Design',
    componentsUsed: [
      { name: { ar: 'مقاومة تحديد التيار', en: 'Series Resistor', fr: 'Résistance série' }, symbolCode: 'R1', componentId: 'resistors' },
      { name: { ar: 'ثنائي باعث للضوء LED', en: 'LED Diode', fr: 'Diode LED' }, symbolCode: 'D1', componentId: 'leds' },
    ],
    symbolsUsed: ['R1 (220Ω–1kΩ)', 'LED (A / K)', '+VCC / GND'],
    safetyPrecautions: [
      {
        ar: 'راجع القطبية (الساق الطويلة للأنود + والحافة المسطحة للكاثود −) ولا توصل LED أبداً بدون مقاومة.',
        en: 'Verify Anode (+ longer lead) vs Cathode (− flat edge) and never power an LED without series resistance.',
        fr: 'Vérifier l’Anode (+) et la Cathode (−) et ne jamais alimenter sans résistance série.',
      },
    ],
    svgId: 'electronics_led',
  },
  {
    id: 'wd-mosfet-pwm',
    category: 'electronics',
    title: {
      ar: 'دائرة قيادة حمل DC بموسفت N-Channel مع إشارة PWM',
      en: 'Low-Side N-Channel MOSFET PWM Load Driver',
      fr: 'Commande de charge DC par MOSFET canal N en PWM',
    },
    summary: {
      ar: 'التحكم في حمل عالي التيار من متحكم دقيق (5V/3.3V) مع مقاومة بوابة وسحب للأسفل.',
      en: 'Switches high-current DC loads from MCU GPIO with gate resistor and pull-down protection.',
      fr: 'Commute de forts courants DC depuis un microcontrôleur avec résistance de grille et pull-down.',
    },
    explanation: {
      ar: 'تحمي المقاومة Rg (220Ω) رجل المتحكم من تيار شحن البوابة، بينما تمنع مقاومة السحب للأسفل Rpd (10kΩ) بقاء الموسفت مفتوحاً بالخطأ عند إقلاع المتحكم، ويحمي دايود التفريغ D1 عند الأحمال الحثية كالمحركات.',
      en: 'Gate resistor Rg (220Ω) limits MCU peak current, pull-down Rpd (10kΩ) prevents floating turn-on during boot, and flyback diode D1 protects against inductive loads.',
      fr: 'Rg (220Ω) protège la sortie MCU, Rpd (10kΩ) évite une activation intempestive au démarrage et D1 protège contre les charges inductives.',
    },
    voltageRating: '5V Logic / 12–24V Load',
    standardRef: 'Power Electronics Low-Side Driver',
    componentsUsed: [
      { name: { ar: 'ترانزستور MOSFET', en: 'Logic-Level MOSFET', fr: 'MOSFET logique' }, symbolCode: 'Q1', componentId: 'mosfets' },
      { name: { ar: 'متحكم دقيق MCU', en: 'Microcontroller', fr: 'Microcontrôleur' }, symbolCode: 'U1', componentId: 'microcontrollers' },
      { name: { ar: 'مقاومات بوابة Rg & Rpd', en: 'Gate & Pull-Down Resistors', fr: 'Résistances Rg & Rpd' }, symbolCode: 'Rg / Rpd', componentId: 'resistors' },
      { name: { ar: 'دايود تفريغ حثي', en: 'Flyback Diode', fr: 'Diode de roue libre' }, symbolCode: 'D1', componentId: 'diodes' },
    ],
    symbolsUsed: ['MCU PWM', 'Rg 220Ω', 'Rpd 10kΩ', 'MOSFET G/D/S', 'D1'],
    safetyPrecautions: [
      {
        ar: 'اربط الأرضي المشترك GND بين المتحكم ومصدر تغذية الحمل؛ واستخدم موسفت Logic-Level للقيادة بجهد 5V.',
        en: 'Tie MCU GND and load power GND together, and use a Logic-Level MOSFET if gate drive is 5V/3.3V.',
        fr: 'Relier les masses GND entre logique et puissance ; utiliser un MOSFET Logic-Level sous 5V.',
      },
    ],
    svgId: 'electronics_mosfet',
  },
];
