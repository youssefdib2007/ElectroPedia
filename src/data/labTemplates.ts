import type { LabCircuitTemplate } from '../types/electronics';

export const LAB_CIRCUIT_TEMPLATES: LabCircuitTemplate[] = [
  {
    id: 'battery-lamp',
    category: 'dc',
    title: {
      ar: '1. بطارية + مفتاح + مصباح + قياس',
      en: '1. Battery, Switch, Lamp & Meters',
      fr: '1. Batterie, Interrupteur, Lampe & Mesures',
    },
    objective: {
      ar: 'فهم الدائرة الكهربائية البسيطة وتأثير فتح وإغلاق المفتاح مع قياس التيار والجهد.',
      en: 'Understand a basic closed circuit, switch control, series current, and parallel voltage measurement.',
      fr: 'Comprendre un circuit simple fermé, la commande par interrupteur et les mesures série/parallèle.',
    },
    theory: {
      ar: 'عند إغلاق المفتاح يمر تيار I = V / R_lamp عبر المصباح (R = V² / P = 144 / 6 = 24Ω)، فيكون التيار 0.50A والقدرة 6.00W.',
      en: 'With switch closed, current I = V / R_lamp flows where R = V² / P = 144 / 6 = 24 Ω, yielding 0.50 A and 6.00 W.',
      fr: 'Interrupteur fermé, le courant I = U / R vaut 0,50 A (R = 24 Ω) pour une puissance de 6,00 W.',
    },
    expectedValues: [
      { ar: 'التيار عند الإغلاق: 0.50 A', en: 'Closed Current: 0.50 A', fr: 'Courant fermé : 0,50 A' },
      { ar: 'الجهد على المصباح: 12.00 V', en: 'Lamp Voltage: 12.00 V', fr: 'Tension lampe : 12,00 V' },
      { ar: 'التيار عند الفتح: 0.00 A', en: 'Open Current: 0.00 A', fr: 'Courant ouvert : 0,00 A' },
    ],
    requiredParts: [
      { ar: 'بطارية 12V', en: '12V Battery', fr: 'Batterie 12V' },
      { ar: 'مفتاح SPST', en: 'SPST Switch', fr: 'Interrupteur SPST' },
      { ar: 'مصباح 12V / 6W', en: '12V / 6W Lamp', fr: 'Lampe 12V / 6W' },
      { ar: 'أميتر + فولتميتر', en: 'Ammeter + Voltmeter', fr: 'Ampèremètre + Voltmètre' },
    ],
    components: [
      { id: 'bat1', type: 'battery', label: 'BAT1', x: 160, y: 240, rotation: 270, props: { voltage: 12, internalResistance: 0 } },
      { id: 'sw1', type: 'switch', label: 'S1', x: 280, y: 120, rotation: 0, props: { closed: true } },
      { id: 'amm1', type: 'ammeter', label: 'A1', x: 420, y: 120, rotation: 0, props: {} },
      { id: 'lamp1', type: 'lamp', label: 'EL1', x: 520, y: 240, rotation: 90, props: { ratedVoltage: 12, ratedPower: 6 } },
      { id: 'vm1', type: 'voltmeter', label: 'V1', x: 640, y: 240, rotation: 90, props: {} },
      { id: 'gnd1', type: 'ground', label: 'GND1', x: 160, y: 380, rotation: 0, props: {} },
    ],
    wires: [
      { id: 'w1', fromCompId: 'bat1', fromPinId: 'pos', toCompId: 'sw1', toPinId: 'a' },
      { id: 'w2', fromCompId: 'sw1', fromPinId: 'b', toCompId: 'amm1', toPinId: 'pos' },
      { id: 'w3', fromCompId: 'amm1', fromPinId: 'neg', toCompId: 'lamp1', toPinId: 'a' },
      { id: 'w4', fromCompId: 'lamp1', fromPinId: 'b', toCompId: 'bat1', toPinId: 'neg' },
      { id: 'w5', fromCompId: 'bat1', fromPinId: 'neg', toCompId: 'gnd1', toPinId: 'gnd' },
      { id: 'w6', fromCompId: 'vm1', fromPinId: 'pos', toCompId: 'lamp1', toPinId: 'a' },
      { id: 'w7', fromCompId: 'vm1', fromPinId: 'neg', toCompId: 'lamp1', toPinId: 'b' },
    ],
    questions: [
      {
        id: 'q1',
        prompt: {
          ar: 'ماذا يحدث لقراءة الأميتر والجهد على المصباح إذا فتحت المفتاح S1؟',
          en: 'What happens to the Ammeter and Lamp voltage when Switch S1 is opened?',
          fr: 'Qu’arrive-t-il au courant et à la tension sur la lampe si S1 est ouvert ?',
        },
        options: [
          { ar: 'ينعدم التيار (0A) وينعدم الجهد على المصباح', en: 'Current drops to 0 A and lamp voltage drops to 0 V', fr: 'Courant 0 A et tension lampe 0 V' },
          { ar: 'يرتفع التيار للضعف', en: 'Current doubles', fr: 'Le courant double' },
          { ar: 'يبقى الجهد على المصباح 12V', en: 'Lamp keeps 12 V across it', fr: 'La lampe garde 12 V' },
        ],
        correctIndex: 0,
        explanation: {
          ar: 'فتح المفتاح يقطع المسار المغلق فتصبح شدة التيار صفراً وبالتالي V = I×R = 0V على المصباح.',
          en: 'Opening S1 breaks the loop, forcing I = 0 A and V_lamp = I × R = 0 V.',
          fr: 'Ouvrir S1 coupe la boucle : I = 0 A donc U_lampe = 0 V.',
        },
      },
    ],
  },

  {
    id: 'series-resistors',
    category: 'dc',
    title: {
      ar: '2. مقاومات على التوالي (Series Circuit)',
      en: '2. Series Resistors (KVL & Ohm’s Law)',
      fr: '2. Résistances en série (Loi des mailles)',
    },
    objective: {
      ar: 'التحقق من أن التيار متساوٍ في التوصيل على التوالي وأن مجموع فروق الجهد يساوي جهد المصدر.',
      en: 'Verify equal current through series resistors and Kirchhoff’s Voltage Law (V1 + V2 = Vs).',
      fr: 'Vérifier l’égalité du courant en série et la loi des mailles (U1 + U2 = U_source).',
    },
    theory: {
      ar: 'المقاومة المكافئة R_eq = R1 + R2 = 100 + 200 = 300Ω، وبالتالي التيار I = 12 / 300 = 40 mA، والجهود 4V و 8V.',
      en: 'Equivalent resistance R_eq = 100 + 200 = 300 Ω, giving I = 12 / 300 = 40 mA, V(R1) = 4 V and V(R2) = 8 V.',
      fr: 'Résistance équivalente R_eq = 300 Ω, soit I = 40 mA, U1 = 4 V et U2 = 8 V.',
    },
    expectedValues: [
      { ar: 'التيار الكلي: 40.0 mA', en: 'Total Current: 40.0 mA', fr: 'Courant total : 40,0 mA' },
      { ar: 'جهد R1 (100Ω): 4.00 V', en: 'V(R1 100Ω): 4.00 V', fr: 'U(R1 100Ω) : 4,00 V' },
      { ar: 'جهد R2 (200Ω): 8.00 V', en: 'V(R2 200Ω): 8.00 V', fr: 'U(R2 200Ω) : 8,00 V' },
    ],
    requiredParts: [
      { ar: 'مصدر 12V DC', en: '12V DC Source', fr: 'Source 12V DC' },
      { ar: 'مقاومة 100Ω + مقاومة 200Ω', en: '100Ω + 200Ω Resistors', fr: 'Résistances 100Ω + 200Ω' },
      { ar: 'أميتر وفولتميتر', en: 'Ammeter & Voltmeters', fr: 'Ampèremètre & Voltmètres' },
    ],
    components: [
      { id: 'vdc1', type: 'dc-source', label: 'VDC1', x: 160, y: 240, rotation: 270, props: { voltage: 12 } },
      { id: 'amm1', type: 'ammeter', label: 'A1', x: 280, y: 120, rotation: 0, props: {} },
      { id: 'r1', type: 'resistor', label: 'R1', x: 420, y: 120, rotation: 0, props: { resistance: 100, ratedPower: 1 } },
      { id: 'r2', type: 'resistor', label: 'R2', x: 560, y: 240, rotation: 90, props: { resistance: 200, ratedPower: 1 } },
      { id: 'vm2', type: 'voltmeter', label: 'V2', x: 680, y: 240, rotation: 90, props: {} },
      { id: 'gnd1', type: 'ground', label: 'GND1', x: 160, y: 380, rotation: 0, props: {} },
    ],
    wires: [
      { id: 'w1', fromCompId: 'vdc1', fromPinId: 'pos', toCompId: 'amm1', toPinId: 'pos' },
      { id: 'w2', fromCompId: 'amm1', fromPinId: 'neg', toCompId: 'r1', toPinId: 'a' },
      { id: 'w3', fromCompId: 'r1', fromPinId: 'b', toCompId: 'r2', toPinId: 'a' },
      { id: 'w4', fromCompId: 'r2', fromPinId: 'b', toCompId: 'vdc1', toPinId: 'neg' },
      { id: 'w5', fromCompId: 'vdc1', fromPinId: 'neg', toCompId: 'gnd1', toPinId: 'gnd' },
      { id: 'w6', fromCompId: 'vm2', fromPinId: 'pos', toCompId: 'r2', toPinId: 'a' },
      { id: 'w7', fromCompId: 'vm2', fromPinId: 'neg', toCompId: 'r2', toPinId: 'b' },
    ],
    questions: [
      {
        id: 'q1',
        prompt: {
          ar: 'أي مقاومة في التوالي يمر بها تيار أكبر: 100Ω أم 200Ω؟',
          en: 'Which series resistor carries more current: 100 Ω or 200 Ω?',
          fr: 'Quelle résistance en série reçoit le plus grand courant ?',
        },
        options: [
          { ar: 'يمر فيهما نفس التيار تماماً (40mA)', en: 'Both carry the exact same current (40 mA)', fr: 'Elles reçoivent exactement le même courant' },
          { ar: 'المقاومة 100Ω يمر بها ضعف التيار', en: '100 Ω carries double current', fr: 'La 100 Ω reçoit le double' },
        ],
        correctIndex: 0,
        explanation: {
          ar: 'في التوصيل على التوالي يوجد مسار واحد فقط للشحنات، لذا التيار متساوٍ في جميع العناصر.',
          en: 'A single closed loop means identical current flows through every series element.',
          fr: 'Dans une boucle unique en série, le courant est identique partout.',
        },
      },
    ],
  },

  {
    id: 'parallel-resistors',
    category: 'dc',
    title: {
      ar: '3. مقاومات على التوازي (KCL)',
      en: '3. Parallel Resistors (KCL)',
      fr: '3. Résistances en parallèle (Loi des nœuds)',
    },
    objective: {
      ar: 'رؤية تفرع التيار بين الفرعين وتساوي الجهد على المقاومات المتوازية.',
      en: 'Observe current division across parallel branches while voltage remains equal.',
      fr: 'Observer la division du courant en parallèle à tension constante.',
    },
    theory: {
      ar: 'لمقاومتين 100Ω على التوازي: R_eq = 50Ω، كل فرع يمر به 120mA (0.12A) والتيار الكلي من المصدر 0.24A.',
      en: 'Two 100 Ω resistors in parallel yield R_eq = 50 Ω: 0.12 A per branch, 0.24 A total.',
      fr: 'Deux résistances de 100 Ω en parallèle donnent R_eq = 50 Ω : 0,12 A par branche, 0,24 A au total.',
    },
    expectedValues: [
      { ar: 'المقاومة المكافئة: 50.0 Ω', en: 'Equivalent R_eq: 50.0 Ω', fr: 'R_eq : 50,0 Ω' },
      { ar: 'التيار الكلي: 0.24 A', en: 'Source Current: 0.24 A', fr: 'Courant total : 0,24 A' },
      { ar: 'تيار كل فرع: 120 mA', en: 'Branch Current: 120 mA each', fr: 'Par branche : 120 mA' },
    ],
    requiredParts: [
      { ar: 'مصدر 12V DC', en: '12V DC Source', fr: 'Source 12V DC' },
      { ar: 'مقاومتان 100Ω', en: 'Two 100Ω Resistors', fr: 'Deux résistances 100Ω' },
      { ar: 'أميتر رئيسي', en: 'Main Ammeter', fr: 'Ampèremètre principal' },
    ],
    components: [
      { id: 'vdc1', type: 'dc-source', label: 'VDC1', x: 160, y: 240, rotation: 270, props: { voltage: 12 } },
      { id: 'amm1', type: 'ammeter', label: 'A_TOT', x: 280, y: 120, rotation: 0, props: {} },
      { id: 'r1', type: 'resistor', label: 'R1', x: 420, y: 240, rotation: 90, props: { resistance: 100, ratedPower: 2 } },
      { id: 'r2', type: 'resistor', label: 'R2', x: 540, y: 240, rotation: 90, props: { resistance: 100, ratedPower: 2 } },
      { id: 'gnd1', type: 'ground', label: 'GND1', x: 160, y: 380, rotation: 0, props: {} },
    ],
    wires: [
      { id: 'w1', fromCompId: 'vdc1', fromPinId: 'pos', toCompId: 'amm1', toPinId: 'pos' },
      { id: 'w2', fromCompId: 'amm1', fromPinId: 'neg', toCompId: 'r1', toPinId: 'a' },
      { id: 'w3', fromCompId: 'r1', fromPinId: 'a', toCompId: 'r2', toPinId: 'a' },
      { id: 'w4', fromCompId: 'r1', fromPinId: 'b', toCompId: 'r2', toPinId: 'b' },
      { id: 'w5', fromCompId: 'r1', fromPinId: 'b', toCompId: 'vdc1', toPinId: 'neg' },
      { id: 'w6', fromCompId: 'vdc1', fromPinId: 'neg', toCompId: 'gnd1', toPinId: 'gnd' },
    ],
    questions: [
      {
        id: 'q1',
        prompt: {
          ar: 'عند إضافة مقاومة ثالثة 100Ω على التوازي، ماذا يحدث للتيار الكلي من المصدر؟',
          en: 'If a third 100 Ω resistor is added in parallel, what happens to total source current?',
          fr: 'Si une 3e résistance de 100 Ω est ajoutée en parallèle, le courant total :',
        },
        options: [
          { ar: 'يزداد لأن المقاومة المكافئة تقل', en: 'Increases because equivalent resistance decreases', fr: 'Augmente car R_eq diminue' },
          { ar: 'ينقص للثلث', en: 'Decreases to one third', fr: 'Diminue au tiers' },
        ],
        correctIndex: 0,
        explanation: {
          ar: 'إضافة مسار توازي جديد يخفض المقاومة الكلية فيزداد التيار المسحوب حسب قانون كيرشوف للتيار.',
          en: 'Adding parallel paths reduces R_eq, increasing total current (I = I1 + I2 + I3).',
          fr: 'Ajouter une branche réduit R_eq et augmente le courant total.',
        },
      },
    ],
  },

  {
    id: 'voltage-divider',
    category: 'dc',
    title: {
      ar: '4. مقسم الجهد (Voltage Divider)',
      en: '4. Voltage Divider',
      fr: '4. Diviseur de tension',
    },
    objective: {
      ar: 'تطبيق معادلة تقسيم الجهد V_out = V_in × R2 / (R1 + R2) وتغيير القيم عملياً.',
      en: 'Apply V_out = V_in × R2 / (R1 + R2) and test variable ratios.',
      fr: 'Appliquer U_out = U_in × R2 / (R1 + R2).',
    },
    theory: {
      ar: 'عند تساوي R1 = 1kΩ و R2 = 1kΩ مع تغذية 12V يكون الجهد عند نقطة المنتصف نصف جهد الدخل تماماً (6.00V).',
      en: 'With equal resistors R1 = R2 = 1 kΩ and 12 V input, midpoint voltage equals exactly 6.00 V.',
      fr: 'Avec R1 = R2 = 1 kΩ sous 12 V, la tension médiane vaut exactement 6,00 V.',
    },
    expectedValues: [
      { ar: 'جهد الخرج V_out: 6.00 V', en: 'Output V_out: 6.00 V', fr: 'Tension sortie : 6,00 V' },
      { ar: 'تيار المقسم: 6.0 mA', en: 'Divider Current: 6.0 mA', fr: 'Courant : 6,0 mA' },
    ],
    requiredParts: [
      { ar: 'مصدر 12V', en: '12V DC Source', fr: 'Source 12V' },
      { ar: 'مقاومتان 1kΩ', en: 'Two 1kΩ Resistors', fr: 'Deux résistances 1kΩ' },
      { ar: 'فولتميتر', en: 'Voltmeter', fr: 'Voltmètre' },
    ],
    components: [
      { id: 'vdc1', type: 'dc-source', label: 'VIN', x: 180, y: 240, rotation: 270, props: { voltage: 12 } },
      { id: 'r1', type: 'resistor', label: 'R1', x: 360, y: 160, rotation: 90, props: { resistance: 1000, ratedPower: 0.5 } },
      { id: 'r2', type: 'resistor', label: 'R2', x: 360, y: 300, rotation: 90, props: { resistance: 1000, ratedPower: 0.5 } },
      { id: 'vm1', type: 'voltmeter', label: 'V_OUT', x: 520, y: 300, rotation: 90, props: {} },
      { id: 'gnd1', type: 'ground', label: 'GND', x: 180, y: 400, rotation: 0, props: {} },
    ],
    wires: [
      { id: 'w1', fromCompId: 'vdc1', fromPinId: 'pos', toCompId: 'r1', toPinId: 'a' },
      { id: 'w2', fromCompId: 'r1', fromPinId: 'b', toCompId: 'r2', toPinId: 'a' },
      { id: 'w3', fromCompId: 'r2', fromPinId: 'b', toCompId: 'vdc1', toPinId: 'neg' },
      { id: 'w4', fromCompId: 'vdc1', fromPinId: 'neg', toCompId: 'gnd1', toPinId: 'gnd' },
      { id: 'w5', fromCompId: 'vm1', fromPinId: 'pos', toCompId: 'r2', toPinId: 'a' },
      { id: 'w6', fromCompId: 'vm1', fromPinId: 'neg', toCompId: 'r2', toPinId: 'b' },
    ],
    questions: [
      {
        id: 'q1',
        prompt: {
          ar: 'إذا غيّرنا R2 لتصبح 3kΩ (مع R1=1kΩ و Vin=12V)، كم يصبح V_out؟',
          en: 'If R2 is changed to 3 kΩ (with R1=1 kΩ, Vin=12 V), what is V_out?',
          fr: 'Si R2 = 3 kΩ (R1 = 1 kΩ, Uin = 12 V), quelle est U_out ?',
        },
        options: [
          { ar: '9.00 V', en: '9.00 V', fr: '9,00 V' },
          { ar: '3.00 V', en: '3.00 V', fr: '3,00 V' },
          { ar: '6.00 V', en: '6.00 V', fr: '6,00 V' },
        ],
        correctIndex: 0,
        explanation: {
          ar: 'V_out = 12 × 3 / (1 + 3) = 9.00 V.',
          en: 'V_out = 12 × 3 / (1 + 3) = 9.00 V.',
          fr: 'U_out = 12 × 3 / (1 + 3) = 9,00 V.',
        },
      },
    ],
  },

  {
    id: 'led-resistor',
    category: 'electronics',
    title: {
      ar: '5. ثنائي LED + مقاومة حماية',
      en: '5. LED with Current-Limiting Resistor',
      fr: '5. LED avec résistance de protection',
    },
    objective: {
      ar: 'حساب قيمة مقاومة الحماية لتشغيل LED بأمان عند تيار يقارب 15mA.',
      en: 'Calculate series limiting resistance to safely bias a red LED around 15 mA.',
      fr: 'Dimensionner la résistance série pour polariser une LED vers 15 mA.',
    },
    theory: {
      ar: 'مع تغذية 5V وهبوط جهد أمامي للـ LED الأحمر Vf ≈ 1.8V ومقاومة 220Ω: التيار I ≈ (5 - 1.8) / 222 ≈ 14.4 mA.',
      en: 'With 5 V source, red LED Vf = 1.8 V, and 220 Ω resistor: I ≈ (5 − 1.8) / 222 ≈ 14.4 mA.',
      fr: 'Sous 5 V avec Vf = 1,8 V et R = 220 Ω : I ≈ 14,4 mA.',
    },
    expectedValues: [
      { ar: 'تيار الـ LED: ~14.4 mA', en: 'LED Current: ~14.4 mA', fr: 'Courant LED : ~14,4 mA' },
      { ar: 'حالة التشغيل: مضيء بأمان', en: 'Status: Safely lit', fr: 'État : Allumée sans surcharge' },
    ],
    requiredParts: [
      { ar: 'مصدر 5V DC', en: '5V DC Source', fr: 'Source 5V DC' },
      { ar: 'مقاومة 220Ω', en: '220Ω Resistor', fr: 'Résistance 220Ω' },
      { ar: 'LED أحمر + أميتر', en: 'Red LED + Ammeter', fr: 'LED rouge + Ampèremètre' },
    ],
    components: [
      { id: 'vdc1', type: 'dc-source', label: 'VCC', x: 160, y: 240, rotation: 270, props: { voltage: 5 } },
      { id: 'r1', type: 'resistor', label: 'R1', x: 320, y: 120, rotation: 0, props: { resistance: 220, ratedPower: 0.5 } },
      { id: 'amm1', type: 'ammeter', label: 'A1', x: 460, y: 120, rotation: 0, props: {} },
      { id: 'led1', type: 'led', label: 'LED1', x: 560, y: 240, rotation: 90, props: { ledColor: 'red', forwardVoltage: 1.8 } },
      { id: 'gnd1', type: 'ground', label: 'GND', x: 160, y: 380, rotation: 0, props: {} },
    ],
    wires: [
      { id: 'w1', fromCompId: 'vdc1', fromPinId: 'pos', toCompId: 'r1', toPinId: 'a' },
      { id: 'w2', fromCompId: 'r1', fromPinId: 'b', toCompId: 'amm1', toPinId: 'pos' },
      { id: 'w3', fromCompId: 'amm1', fromPinId: 'neg', toCompId: 'led1', toPinId: 'anode' },
      { id: 'w4', fromCompId: 'led1', fromPinId: 'cathode', toCompId: 'vdc1', toPinId: 'neg' },
      { id: 'w5', fromCompId: 'vdc1', fromPinId: 'neg', toCompId: 'gnd1', toPinId: 'gnd' },
    ],
    questions: [
      {
        id: 'q1',
        prompt: {
          ar: 'ماذا يحدث إذا خفضت المقاومة R1 إلى 10Ω على مصدر 5V؟',
          en: 'What happens if R1 is lowered to 10 Ω on the 5 V supply?',
          fr: 'Qu’arrive-t-il si R1 est réduite à 10 Ω sous 5 V ?',
        },
        options: [
          { ar: 'يرتفع التيار فوق 30mA ويظهر تحذير تلف الـ LED', en: 'Current surges above 30 mA triggering an LED overcurrent warning', fr: 'Surintensité > 30 mA avec alerte de surcharge' },
          { ar: 'ينطفئ الـ LED فوراً', en: 'LED turns off immediately', fr: 'La LED s’éteint' },
        ],
        correctIndex: 0,
        explanation: {
          ar: 'تجاوز التيار الآمن للـ LED (حوالي 20–30mA) يؤدي إلى احتراقه بدون مقاومة مناسبة.',
          en: 'Exceeding ~30 mA forward current overheats and damages a standard LED.',
          fr: 'Dépasser ~30 mA détruit une LED standard par échauffement.',
        },
      },
    ],
  },

  {
    id: 'rc-transient',
    category: 'electronics',
    title: {
      ar: '6. دائرة شحن المكثف RC (الزمن الثابت)',
      en: '6. RC Charging Transient & Scope',
      fr: '6. Charge transitoire RC & Oscilloscope',
    },
    objective: {
      ar: 'مراقبة منحنى شحن المكثف الأسّي على راسم الإشارة وحساب ثابت الزمن τ = R × C.',
      en: 'Observe exponential capacitor charging on the Oscilloscope and verify time constant τ = R × C.',
      fr: 'Observer la charge exponentielle sur l’oscilloscope et vérifier τ = R × C.',
    },
    theory: {
      ar: 'مع R = 1kΩ و C = 1000µF يكون τ = 1.0 ثانية. عند t = 1s يصل جهد المكثف إلى ~63.2% من جهد المصدر (6.32V)، وبعد 5τ يكتمل الشحن.',
      en: 'With R = 1 kΩ and C = 1000 µF, τ = 1.0 s. At t = 1 s, V_c reaches ~63.2% of 10 V (6.32 V).',
      fr: 'Avec R = 1 kΩ et C = 1000 µF, τ = 1,0 s. À t = 1 s, Uc ≈ 6,32 V (63,2%).',
    },
    expectedValues: [
      { ar: 'ثابت الزمن τ = 1.0 s', en: 'Time constant τ = 1.0 s', fr: 'Constante τ = 1,0 s' },
      { ar: 'عند t = 1s: V_c ≈ 6.32 V', en: 'At t = 1s: V_c ≈ 6.32 V', fr: 'À t = 1s : Uc ≈ 6,32 V' },
    ],
    requiredParts: [
      { ar: 'مصدر 10V DC', en: '10V DC Source', fr: 'Source 10V DC' },
      { ar: 'مقاومة 1kΩ + مكثف 1000µF', en: '1kΩ Resistor + 1000µF Cap', fr: 'R 1kΩ + C 1000µF' },
      { ar: 'راسم إشارة + فولتميتر', en: 'Oscilloscope + Voltmeter', fr: 'Oscilloscope + Voltmètre' },
    ],
    components: [
      { id: 'vdc1', type: 'dc-source', label: 'VS', x: 160, y: 240, rotation: 270, props: { voltage: 10 } },
      { id: 'sw1', type: 'switch', label: 'S1', x: 280, y: 120, rotation: 0, props: { closed: true } },
      { id: 'r1', type: 'resistor', label: 'R1', x: 420, y: 120, rotation: 0, props: { resistance: 1000, ratedPower: 1 } },
      { id: 'c1', type: 'capacitor', label: 'C1', x: 520, y: 240, rotation: 90, props: { capacitanceUf: 1000 } },
      { id: 'osc1', type: 'oscilloscope', label: 'OSC1', x: 660, y: 240, rotation: 0, props: {} },
      { id: 'gnd1', type: 'ground', label: 'GND', x: 160, y: 380, rotation: 0, props: {} },
    ],
    wires: [
      { id: 'w1', fromCompId: 'vdc1', fromPinId: 'pos', toCompId: 'sw1', toPinId: 'a' },
      { id: 'w2', fromCompId: 'sw1', fromPinId: 'b', toCompId: 'r1', toPinId: 'a' },
      { id: 'w3', fromCompId: 'r1', fromPinId: 'b', toCompId: 'c1', toPinId: 'pos' },
      { id: 'w4', fromCompId: 'c1', fromPinId: 'neg', toCompId: 'vdc1', toPinId: 'neg' },
      { id: 'w5', fromCompId: 'vdc1', fromPinId: 'neg', toCompId: 'gnd1', toPinId: 'gnd' },
      { id: 'w6', fromCompId: 'osc1', fromPinId: 'ch1', toCompId: 'c1', toPinId: 'pos' },
      { id: 'w7', fromCompId: 'osc1', fromPinId: 'ch2', toCompId: 'vdc1', toPinId: 'pos' },
      { id: 'w8', fromCompId: 'osc1', fromPinId: 'gnd', toCompId: 'gnd1', toPinId: 'gnd' },
    ],
    questions: [
      {
        id: 'q1',
        prompt: {
          ar: 'ما النسبة التقريبية لجهد المكثف من جهد المصدر بعد مرور ثابت زمني واحد τ؟',
          en: 'What percentage of Vs does a charging capacitor reach after one time constant τ?',
          fr: 'Quel pourcentage de Vs atteint le condensateur après τ ?',
        },
        options: [
          { ar: '63.2%', en: '63.2%', fr: '63,2 %' },
          { ar: '50.0%', en: '50.0%', fr: '50,0 %' },
          { ar: '100%', en: '100%', fr: '100 %' },
        ],
        correctIndex: 0,
        explanation: {
          ar: 'من المعادلة Vc(t) = Vs(1 - e^-t/τ): عند t = τ تصبح 1 - e^-1 ≈ 0.632 أي 63.2%.',
          en: 'From Vc(t) = Vs(1 − e^(−t/τ)), at t = τ we get 1 − e⁻¹ ≈ 63.2%.',
          fr: 'D’après Uc(t) = Us(1 − e^(−t/τ)), à t = τ on obtient 63,2 %.',
        },
      },
    ],
  },

  {
    id: 'relay-control',
    category: 'industrial',
    title: {
      ar: '7. دائرة تحكم بمرحل (Relay Control)',
      en: '7. Relay Isolated Control Circuit',
      fr: '7. Commande par relais électromagnétique',
    },
    objective: {
      ar: 'استخدام إشارة تحكم منخفضة (12V) لتشغيل حمل منفصل بجهد أعلى (24V) عبر المرحل.',
      en: 'Use a low-power 12 V control loop to switch an isolated 24 V motor load via relay KA1.',
      fr: 'Utiliser un circuit de commande 12 V pour piloter une charge 24 V via le relais KA1.',
    },
    theory: {
      ar: 'عند الضغط على الزر PB1 يصل جهد 12V إلى ملف المرحل (A1-A2) فينغلق التلامس المعزول (13-14) ويدور المحرك المربوط على مصدر 24V.',
      en: 'Closing PB1 energizes coil KA1 (A1–A2), closing isolated contact 13–14 to spin the 24 V motor.',
      fr: 'Actionner PB1 alimente la bobine KA1 (A1-A2) et ferme 13-14 pour démarrer le moteur 24 V.',
    },
    expectedValues: [
      { ar: 'تيار ملف المرحل: 60 mA', en: 'Relay Coil Current: 60 mA', fr: 'Courant bobine : 60 mA' },
      { ar: 'سرعة المحرك عند الجذب: ~1500 RPM', en: 'Motor Speed when pulled in: ~1500 RPM', fr: 'Vitesse moteur : ~1500 tr/min' },
    ],
    requiredParts: [
      { ar: 'مصدر تحكم 12V + مصدر قدرة 24V', en: '12V Control + 24V Load Sources', fr: 'Sources 12V & 24V' },
      { ar: 'زر ضاغط + مرحل + محرك 24V', en: 'Push Button + Relay + 24V Motor', fr: 'Bouton + Relais + Moteur 24V' },
    ],
    components: [
      { id: 'v12', type: 'dc-source', label: 'V_CTRL', x: 140, y: 240, rotation: 270, props: { voltage: 12 } },
      { id: 'pb1', type: 'push-button', label: 'PB1', x: 260, y: 120, rotation: 0, props: { closed: true, momentaryNC: false } },
      { id: 'ka1', type: 'relay', label: 'KA1', x: 400, y: 240, rotation: 0, props: { coilVoltage: 12, coilResistance: 200 } },
      { id: 'v24', type: 'dc-source', label: 'V_PWR', x: 560, y: 120, rotation: 0, props: { voltage: 24 } },
      { id: 'mot1', type: 'motor', label: 'M1', x: 580, y: 260, rotation: 90, props: { ratedVoltage: 24, resistance: 12 } },
      { id: 'gnd1', type: 'ground', label: 'GND', x: 140, y: 380, rotation: 0, props: {} },
    ],
    wires: [
      { id: 'w1', fromCompId: 'v12', fromPinId: 'pos', toCompId: 'pb1', toPinId: 'a' },
      { id: 'w2', fromCompId: 'pb1', fromPinId: 'b', toCompId: 'ka1', toPinId: 'a1' },
      { id: 'w3', fromCompId: 'ka1', fromPinId: 'a2', toCompId: 'v12', toPinId: 'neg' },
      { id: 'w4', fromCompId: 'v12', fromPinId: 'neg', toCompId: 'gnd1', toPinId: 'gnd' },
      { id: 'w5', fromCompId: 'v24', fromPinId: 'pos', toCompId: 'ka1', toPinId: 'no1' },
      { id: 'w6', fromCompId: 'ka1', fromPinId: 'no2', toCompId: 'mot1', toPinId: 'pos' },
      { id: 'w7', fromCompId: 'mot1', fromPinId: 'neg', toCompId: 'v24', toPinId: 'neg' },
      { id: 'w8', fromCompId: 'v24', fromPinId: 'neg', toCompId: 'gnd1', toPinId: 'gnd' },
    ],
    questions: [
      {
        id: 'q1',
        prompt: {
          ar: 'ما الفائدة الأساسية من استخدام المرحل بين دائرة التحكم 12V ودائرة الحمل 24V؟',
          en: 'Why use a relay between the 12 V control circuit and 24 V motor circuit?',
          fr: 'Quel est le rôle principal du relais entre la commande 12 V et la charge 24 V ?',
        },
        options: [
          { ar: 'العزل الكهربائي وتمكين إشارة ضعيفة من التحكم بحمل أعلى', en: 'Galvanic isolation and switching higher load power from low control power', fr: 'Isolation galvanique et commutation de puissance supérieure' },
          { ar: 'رفع التردد إلى 100Hz', en: 'Doubling AC frequency', fr: 'Doubler la fréquence' },
        ],
        correctIndex: 0,
        explanation: {
          ar: 'المرحل يوفر عزلاً كهربائياً بين الملف والتلامس ويحمي مفاتيح التحكم من تيارات الحمل العالية.',
          en: 'Relays isolate control switches from heavy load currents and higher voltages.',
          fr: 'Le relais isole le circuit de commande des courants élevés du moteur.',
        },
      },
    ],
  },

  {
    id: 'start-stop-contactor',
    category: 'industrial',
    title: {
      ar: '8. دارة تشغيل/إيقاف ذاتية التثبيت (Start/Stop Contactor)',
      en: '8. Self-Holding Start/Stop Contactor + Motor',
      fr: '8. Démarrage moteur auto-maintien Start/Stop',
    },
    objective: {
      ar: 'بناء واختبار دارة التحكم الصناعية الكلاسيكية بالتثبيت الذاتي (13-14) وحماية الأوفرلود (95-96).',
      en: 'Test classic industrial latching control (NO 13-14) with NC Stop button and thermal overload 95-96.',
      fr: 'Tester la commande industrielle par auto-maintien (13-14), bouton Arrêt NC et relais thermique 95-96.',
    },
    theory: {
      ar: 'عند إغلاق زر Start ينجذب الكونتاكتور KM1 ويغلق التلامس المساعد (13-14) بالتوازي مع Start؛ فيبقى KM1 ممسكاً حتى بعد فتح Start، ولا يفصل إلا بفتح زر Stop أو فصل 95-96.',
      en: 'Pressing Start energizes KM1, closing seal-in NO contact 13–14 in parallel with Start. KM1 stays latched until Stop (NC) opens or F1 trips.',
      fr: 'L’appui sur Marche excite KM1 et ferme 13-14 en auto-maintien jusqu’à l’ouverture d’Arrêt ou de 95-96.',
    },
    expectedValues: [
      { ar: 'التثبيت الذاتي: يعمل بعد تحرير Start', en: 'Seal-in Latch: stays ON after releasing Start', fr: 'Auto-maintien : reste actif après Marche' },
      { ar: 'زر Stop (NC): يقطع التغذية عن A1', en: 'Stop PB (NC): breaks coil A1 supply', fr: 'Arrêt (NC) : coupe la bobine A1' },
    ],
    requiredParts: [
      { ar: 'مصدر 24V + قاطع حماية MCB', en: '24V Source + MCB', fr: 'Source 24V + Disjoncteur' },
      { ar: 'زر Stop (NC) + زر Start (NO)', en: 'Stop (NC) + Start (NO)', fr: 'Boutons Arrêt (NC) + Marche (NO)' },
      { ar: 'كونتاكتور KM1 + أوفرلود F1 + محرك', en: 'Contactor KM1 + Overload F1 + Motor', fr: 'Contacteur KM1 + Thermique F1 + Moteur' },
    ],
    components: [
      { id: 'v24', type: 'dc-source', label: 'V24', x: 120, y: 260, rotation: 270, props: { voltage: 24 } },
      { id: 'qf1', type: 'circuit-breaker', label: 'QF1', x: 200, y: 100, rotation: 0, props: { ratedCurrent: 10, closed: true } },
      { id: 'stop1', type: 'push-button', label: 'STOP', x: 320, y: 100, rotation: 0, props: { closed: false, momentaryNC: true } },
      { id: 'start1', type: 'push-button', label: 'START', x: 440, y: 100, rotation: 0, props: { closed: true, momentaryNC: false } },
      { id: 'km1', type: 'contactor', label: 'KM1', x: 540, y: 220, rotation: 0, props: { coilVoltage: 24, coilResistance: 240 } },
      { id: 'f1', type: 'thermal-overload', label: 'F1', x: 380, y: 340, rotation: 0, props: { ratedCurrent: 5 } },
      { id: 'mot1', type: 'motor', label: 'M1', x: 640, y: 360, rotation: 0, props: { ratedVoltage: 24, resistance: 12 } },
      { id: 'gnd1', type: 'ground', label: 'GND', x: 120, y: 420, rotation: 0, props: {} },
    ],
    wires: [
      { id: 'w1', fromCompId: 'v24', fromPinId: 'pos', toCompId: 'qf1', toPinId: 'a' },
      { id: 'w2', fromCompId: 'qf1', fromPinId: 'b', toCompId: 'stop1', toPinId: 'a' },
      { id: 'w3', fromCompId: 'stop1', fromPinId: 'b', toCompId: 'f1', toPinId: 'nc95' },
      { id: 'w4', fromCompId: 'f1', fromPinId: 'nc96', toCompId: 'start1', toPinId: 'a' },
      { id: 'w5', fromCompId: 'start1', fromPinId: 'b', toCompId: 'km1', toPinId: 'a1' },
      // Seal-in branch 13-14 across Start button:
      { id: 'w6', fromCompId: 'f1', fromPinId: 'nc96', toCompId: 'km1', toPinId: 'no13' },
      { id: 'w7', fromCompId: 'km1', fromPinId: 'no14', toCompId: 'km1', toPinId: 'a1' },
      { id: 'w8', fromCompId: 'km1', fromPinId: 'a2', toCompId: 'v24', toPinId: 'neg' },
      // Power circuit QF1 -> KM1(L1-T1) -> F1(T1-T2) -> Motor -> Neg
      { id: 'w9', fromCompId: 'qf1', fromPinId: 'b', toCompId: 'km1', toPinId: 'l1' },
      { id: 'w10', fromCompId: 'km1', fromPinId: 't1', toCompId: 'f1', toPinId: 't1' },
      { id: 'w11', fromCompId: 'f1', fromPinId: 't2', toCompId: 'mot1', toPinId: 'pos' },
      { id: 'w12', fromCompId: 'mot1', fromPinId: 'neg', toCompId: 'v24', toPinId: 'neg' },
      { id: 'w13', fromCompId: 'v24', fromPinId: 'neg', toCompId: 'gnd1', toPinId: 'gnd' },
    ],
    questions: [
      {
        id: 'q1',
        prompt: {
          ar: 'ما وظيفة التلامس المساعد (13-14) الموصول على التوازي مع زر التشغيل Start؟',
          en: 'What is the purpose of auxiliary contact 13–14 wired in parallel with Start?',
          fr: 'Quel est le rôle du contact auxiliaire 13-14 en parallèle avec Marche ?',
        },
        options: [
          { ar: 'تأمين التثبيت الذاتي (Self-holding) لاستمرار عمل الكونتاكتور بعد ترك الزر', en: 'Self-holding latch to keep KM1 energized after Start is released', fr: 'Auto-maintien de KM1 après relâchement de Marche' },
          { ar: 'عكس اتجاه دوران المحرك', en: 'Reversing motor rotation', fr: 'Inverser le sens du moteur' },
        ],
        correctIndex: 0,
        explanation: {
          ar: 'التلامس 13-14 يمرر التيار إلى A1 بدلاً من زر Start بمجرد جذب الكونتاكتور.',
          en: 'Contact 13–14 bypasses the momentary Start button once KM1 pulls in.',
          fr: 'Le contact 13-14 maintient l’alimentation de A1 après relâchement du bouton.',
        },
      },
    ],
  },

  {
    id: 'digital-logic-and',
    category: 'digital',
    title: {
      ar: '9. بوابة منطقية رقمية AND مع LED',
      en: '9. Digital Logic Gate (AND) + LED Output',
      fr: '9. Porte logique AND avec sortie LED',
    },
    objective: {
      ar: 'اختبار جدول الحقيقة لبوابة AND بتبديل المفتاحين A و B ومراقبة خرج الـ LED.',
      en: 'Verify the AND truth table by toggling switches A and B and observing output LED.',
      fr: 'Vérifier la table de vérité de la porte AND avec les interrupteurs A et B.',
    },
    theory: {
      ar: 'تعتمد البوابة 5V للمنطق 1 و0V للمنطق 0 (عبر مقاومات سحب للأسفل 10kΩ). لا يضيء الـ LED إلا إذا كان A=1 و B=1 معاً.',
      en: 'Gate uses 10 kΩ pulldown resistors so open inputs read 0 V (Logic 0). LED lights only when A=1 AND B=1.',
      fr: 'Des résistances de rappel à la masse 10 kΩ fixent 0 V au repos. La LED s’allume uniquement si A=1 et B=1.',
    },
    expectedValues: [
      { ar: 'A=1, B=1 -> الخرج 5V (Logic 1)', en: 'A=1, B=1 -> Out 5 V (Logic 1)', fr: 'A=1, B=1 -> Sortie 5 V' },
      { ar: 'أي مدخل مفتوح -> الخرج 0V (Logic 0)', en: 'Any open input -> Out 0 V (Logic 0)', fr: 'Une entrée ouverte -> 0 V' },
    ],
    requiredParts: [
      { ar: 'مصدر 5V + مفتاحان A و B', en: '5V Supply + Switches A & B', fr: 'Alim 5V + Interrupteurs A & B' },
      { ar: 'بوابة AND + مقاومات 10kΩ و 220Ω + LED', en: 'AND Gate + 10kΩ/220Ω + LED', fr: 'Porte AND + 10kΩ/220Ω + LED' },
    ],
    components: [
      { id: 'v5', type: 'dc-source', label: 'VCC_5V', x: 120, y: 240, rotation: 270, props: { voltage: 5 } },
      { id: 'swA', type: 'switch', label: 'IN_A', x: 240, y: 160, rotation: 0, props: { closed: true } },
      { id: 'swB', type: 'switch', label: 'IN_B', x: 240, y: 280, rotation: 0, props: { closed: true } },
      { id: 'pdA', type: 'resistor', label: 'PD_A', x: 320, y: 360, rotation: 90, props: { resistance: 10000, ratedPower: 0.25 } },
      { id: 'pdB', type: 'resistor', label: 'PD_B', x: 380, y: 360, rotation: 90, props: { resistance: 10000, ratedPower: 0.25 } },
      { id: 'gate1', type: 'logic-gate', label: 'U1', x: 460, y: 220, rotation: 0, props: { gateType: 'AND' } },
      { id: 'rled', type: 'resistor', label: 'R_LED', x: 580, y: 220, rotation: 0, props: { resistance: 220, ratedPower: 0.5 } },
      { id: 'led1', type: 'led', label: 'OUT_LED', x: 680, y: 300, rotation: 90, props: { ledColor: 'green', forwardVoltage: 2.2 } },
      { id: 'gnd1', type: 'ground', label: 'GND', x: 120, y: 420, rotation: 0, props: {} },
    ],
    wires: [
      { id: 'w1', fromCompId: 'v5', fromPinId: 'pos', toCompId: 'swA', toPinId: 'a' },
      { id: 'w2', fromCompId: 'v5', fromPinId: 'pos', toCompId: 'swB', toPinId: 'a' },
      { id: 'w3', fromCompId: 'swA', fromPinId: 'b', toCompId: 'gate1', toPinId: 'inA' },
      { id: 'w4', fromCompId: 'swB', fromPinId: 'b', toCompId: 'gate1', toPinId: 'inB' },
      { id: 'w5', fromCompId: 'swA', fromPinId: 'b', toCompId: 'pdA', toPinId: 'a' },
      { id: 'w6', fromCompId: 'swB', fromPinId: 'b', toCompId: 'pdB', toPinId: 'a' },
      { id: 'w7', fromCompId: 'pdA', fromPinId: 'b', toCompId: 'gnd1', toPinId: 'gnd' },
      { id: 'w8', fromCompId: 'pdB', fromPinId: 'b', toCompId: 'gnd1', toPinId: 'gnd' },
      { id: 'w9', fromCompId: 'gate1', fromPinId: 'out', toCompId: 'rled', toPinId: 'a' },
      { id: 'w10', fromCompId: 'rled', fromPinId: 'b', toCompId: 'led1', toPinId: 'anode' },
      { id: 'w11', fromCompId: 'led1', fromPinId: 'cathode', toCompId: 'gnd1', toPinId: 'gnd' },
      { id: 'w12', fromCompId: 'v5', fromPinId: 'neg', toCompId: 'gnd1', toPinId: 'gnd' },
    ],
    questions: [
      {
        id: 'q1',
        prompt: {
          ar: 'إذا غيّرت نوع البوابة U1 إلى XOR مع A=1 و B=1، ماذا يصبح خرج الـ LED؟',
          en: 'If U1 gate type is switched to XOR while A=1 and B=1, what happens to the LED?',
          fr: 'Si U1 devient XOR avec A=1 et B=1, que fait la LED ?',
        },
        options: [
          { ar: 'ينطفئ الـ LED لأن XOR تعطي 0 عند تساوي المدخلين', en: 'LED turns OFF because XOR outputs 0 when inputs match', fr: 'Elle s’éteint car XOR donne 0 pour entrées égales' },
          { ar: 'يزداد سطوعه للضعف', en: 'Brightness doubles', fr: 'Sa luminosité double' },
        ],
        correctIndex: 0,
        explanation: {
          ar: 'بوابة XOR تعطي 1 فقط عندما يختلف المدخلان (1 و 0 أو 0 و 1).',
          en: 'XOR outputs Logic 1 exclusively when inputs differ.',
          fr: 'La porte XOR vaut 1 uniquement lorsque les entrées diffèrent.',
        },
      },
    ],
  },

  {
    id: 'ac-transformer-rectifier',
    category: 'electronics',
    title: {
      ar: '10. محول AC + مقوم نصف موجة + راسم إشارة',
      en: '10. AC Transformer + Half-Wave Rectifier',
      fr: '10. Transformateur AC + Redresseur mono-alternance',
    },
    objective: {
      ar: 'مشاهدة خفض الجهد المتردد من 230V إلى 11.5V RMS ثم تقويمه عبر الدايود على راسم الإشارة.',
      en: 'Observe 230 V AC step-down to 11.5 V RMS and half-wave diode rectification on the Scope.',
      fr: 'Observer l’abaissement 230 V -> 11,5 V RMS puis le redressement par diode sur l’oscilloscope.',
    },
    theory: {
      ar: 'بنسبة تحويل 0.05 ينخفض 230V إلى 11.5V RMS (ذروة ~16.2V)، ويمرر الدايود النصف الموجب فقط إلى الحمل 100Ω.',
      en: 'Turns ratio 0.05 steps 230 V down to 11.5 V RMS (~16.2 V peak); diode conducts positive half-cycles into 100 Ω.',
      fr: 'Le rapport 0,05 abaisse 230 V à 11,5 V RMS (~16,2 V crête) ; la diode ne laisse passer que l’alternance positive.',
    },
    expectedValues: [
      { ar: 'الجهد الثانوي RMS: ~11.5 V', en: 'Secondary RMS: ~11.5 V', fr: 'Secondaire RMS : ~11,5 V' },
      { ar: 'شكل الموجة CH2: أنصاف موجات موجبة', en: 'CH2 Scope: Half-wave positive pulses', fr: 'CH2 : Alternances positives redressées' },
    ],
    requiredParts: [
      { ar: 'مصدر AC 230V / 50Hz', en: '230V 50Hz AC Source', fr: 'Source AC 230V / 50Hz' },
      { ar: 'محول (نسبة 0.05) + دايود + مقاومة 100Ω + راسم إشارة', en: 'Transformer (0.05) + Diode + 100Ω + Scope', fr: 'Transformateur (0,05) + Diode + 100Ω + Oscilloscope' },
    ],
    components: [
      { id: 'vac1', type: 'ac-source', label: 'AC_230V', x: 100, y: 240, rotation: 270, props: { voltage: 230, frequency: 50 } },
      { id: 'tr1', type: 'transformer', label: 'TR1', x: 240, y: 240, rotation: 0, props: { turnsRatio: 0.05 } },
      { id: 'd1', type: 'diode', label: 'D1', x: 380, y: 180, rotation: 0, props: { forwardVoltage: 0.7 } },
      { id: 'rload', type: 'resistor', label: 'R_LOAD', x: 460, y: 260, rotation: 90, props: { resistance: 100, ratedPower: 5 } },
      { id: 'osc1', type: 'oscilloscope', label: 'OSC1', x: 620, y: 240, rotation: 0, props: {} },
      { id: 'gnd1', type: 'ground', label: 'GND', x: 280, y: 380, rotation: 0, props: {} },
    ],
    wires: [
      { id: 'w1', fromCompId: 'vac1', fromPinId: 'pos', toCompId: 'tr1', toPinId: 'p1' },
      { id: 'w2', fromCompId: 'vac1', fromPinId: 'neg', toCompId: 'tr1', toPinId: 'p2' },
      { id: 'w3', fromCompId: 'tr1', fromPinId: 'p2', toCompId: 'gnd1', toPinId: 'gnd' },
      { id: 'w4', fromCompId: 'tr1', fromPinId: 's1', toCompId: 'd1', toPinId: 'anode' },
      { id: 'w5', fromCompId: 'd1', fromPinId: 'cathode', toCompId: 'rload', toPinId: 'a' },
      { id: 'w6', fromCompId: 'rload', fromPinId: 'b', toCompId: 'tr1', toPinId: 's2' },
      { id: 'w7', fromCompId: 'tr1', fromPinId: 's2', toCompId: 'gnd1', toPinId: 'gnd' },
      { id: 'w8', fromCompId: 'osc1', fromPinId: 'ch1', toCompId: 'tr1', toPinId: 's1' },
      { id: 'w9', fromCompId: 'osc1', fromPinId: 'ch2', toCompId: 'rload', toPinId: 'a' },
      { id: 'w10', fromCompId: 'osc1', fromPinId: 'gnd', toCompId: 'gnd1', toPinId: 'gnd' },
    ],
    questions: [
      {
        id: 'q1',
        prompt: {
          ar: 'ما دور الدايود D1 في مخرج المحول على القناة CH2؟',
          en: 'What does Diode D1 do to the secondary AC signal seen on CH2?',
          fr: 'Quel est l’effet de la diode D1 sur le signal CH2 ?',
        },
        options: [
          { ar: 'يمرر النصف الموجب ويحجب النصف السالب (تقويم نصف موجة)', en: 'Passes positive half-cycles and blocks negative half-cycles', fr: 'Laisse passer l’alternance positive et bloque la négative' },
          { ar: 'يرفع الجهد إلى 400V', en: 'Boosts voltage to 400 V', fr: 'Élève la tension à 400 V' },
        ],
        correctIndex: 0,
        explanation: {
          ar: 'الدايود يوصل عندما يكون الأنود أعلى من الكاثود بحوالي 0.7V فقط.',
          en: 'A silicon diode conducts only during positive half-cycles above ~0.7 V.',
          fr: 'La diode ne conduit que lorsque la tension directe dépasse ~0,7 V.',
        },
      },
    ],
  },

  {
    id: 'plc-ladder-motor',
    category: 'industrial',
    title: {
      ar: '11. وحدة PLC مبرمجة بلغة Ladder لتشغيل محرك',
      en: '11. PLC Unit Ladder Start/Stop Control',
      fr: '11. Automate PLC avec programme Ladder',
    },
    objective: {
      ar: 'فهم ربط أزرار الدخل (I1, I2) بوحدة PLC وتنفيذ منطق السلم Ladder لتشغيل المخرج Q1.',
      en: 'Wire inputs I1/I2 to a PLC unit and execute deterministic Ladder rungs driving Q1 motor output.',
      fr: 'Câbler les entrées I1/I2 sur un automate PLC et piloter la sortie Q1 par programme Ladder.',
    },
    theory: {
      ar: 'السطر البرمجي: (I1 OR Q1) AND NOT(I2) -> Q1. عند تنشيط I1 يعمل المخرج Q1 ويثبت ذاتياً حتى الضغط على I2 (إيقاف).',
      en: 'Rung logic: (I1 OR Q1) AND NOT(I2) -> Q1. Activating I1 latches Q1 high (24 V) until I2 stops it.',
      fr: 'Équation : (I1 OU Q1) ET NON(I2) -> Q1. I1 active Q1 en auto-maintien jusqu’à l’impulsion sur I2.',
    },
    expectedValues: [
      { ar: 'I1 فعال -> Q1 = 24V (المحرك يعمل)', en: 'I1 active -> Q1 = 24 V (Motor ON)', fr: 'I1 actif -> Q1 = 24 V' },
      { ar: 'I2 فعال -> فصل Q1', en: 'I2 active -> Resets Q1', fr: 'I2 actif -> Arrêt Q1' },
    ],
    requiredParts: [
      { ar: 'مصدر 24V + مفتاحا دخل I1/I2', en: '24V Supply + Input Switches I1/I2', fr: 'Alim 24V + Entrées I1/I2' },
      { ar: 'وحدة PLC + محرك 24V', en: 'PLC Unit + 24V Motor', fr: 'Automate PLC + Moteur 24V' },
    ],
    components: [
      { id: 'v24', type: 'dc-source', label: 'V24', x: 120, y: 240, rotation: 270, props: { voltage: 24 } },
      { id: 'swI1', type: 'switch', label: 'I1_START', x: 260, y: 160, rotation: 0, props: { closed: true } },
      { id: 'swI2', type: 'switch', label: 'I2_STOP', x: 260, y: 280, rotation: 0, props: { closed: false } },
      { id: 'plc1', type: 'plc-unit', label: 'PLC1', x: 420, y: 220, rotation: 0, props: { voltage: 24 } },
      { id: 'mot1', type: 'motor', label: 'M1', x: 580, y: 220, rotation: 90, props: { ratedVoltage: 24, resistance: 12 } },
      { id: 'gnd1', type: 'ground', label: 'GND', x: 120, y: 380, rotation: 0, props: {} },
    ],
    wires: [
      { id: 'w1', fromCompId: 'v24', fromPinId: 'pos', toCompId: 'swI1', toPinId: 'a' },
      { id: 'w2', fromCompId: 'v24', fromPinId: 'pos', toCompId: 'swI2', toPinId: 'a' },
      { id: 'w3', fromCompId: 'swI1', fromPinId: 'b', toCompId: 'plc1', toPinId: 'i1' },
      { id: 'w4', fromCompId: 'swI2', fromPinId: 'b', toCompId: 'plc1', toPinId: 'i2' },
      { id: 'w5', fromCompId: 'plc1', fromPinId: 'q1', toCompId: 'mot1', toPinId: 'pos' },
      { id: 'w6', fromCompId: 'mot1', fromPinId: 'neg', toCompId: 'gnd1', toPinId: 'gnd' },
      { id: 'w7', fromCompId: 'plc1', fromPinId: 'com', toCompId: 'gnd1', toPinId: 'gnd' },
      { id: 'w8', fromCompId: 'v24', fromPinId: 'neg', toCompId: 'gnd1', toPinId: 'gnd' },
    ],
    ladderRungs: [
      {
        id: 'rung-1',
        comment: 'Start/Stop Self-Holding Motor Output Q1',
        input1: 'I1',
        latchInput: 'Q1',
        input2: '!I2',
        coil: 'Q1',
      },
      {
        id: 'rung-2',
        comment: 'Delayed Indicator Q2 (2s after Q1)',
        input1: 'Q1',
        coil: 'Q2',
        timerDelaySec: 2,
      },
    ],
    questions: [
      {
        id: 'q1',
        prompt: {
          ar: 'كيف يتم إيقاف المخرج Q1 في برنامج السلم أعلاه؟',
          en: 'How do you stop output Q1 in the Ladder program above?',
          fr: 'Comment arrêter la sortie Q1 dans ce programme Ladder ?',
        },
        options: [
          { ar: 'بإغلاق مفتاح I2_STOP لأن الشرط !I2 يفتح المسار', en: 'By closing switch I2_STOP because contact !I2 opens the rung', fr: 'En fermant I2_STOP car !I2 coupe la ligne' },
          { ar: 'بفتح مفتاح I1_START فقط', en: 'Just opening I1_START', fr: 'Simplement en ouvrant I1_START' },
        ],
        correctIndex: 0,
        explanation: {
          ar: 'المدخل Q1 يثبّت نفسه عبر التفرع الموازي، لذا إيقافه يتطلب تنشيط شرط !I2.',
          en: 'Q1 latches around I1, so stopping requires activating input I2 to break !I2.',
          fr: 'Q1 s’auto-maintient : il faut activer I2 pour couper le contact !I2.',
        },
      },
    ],
  },
];
