import type { ElectronicComponent, QuizQuestion } from '../types/electronics';
import { COMPONENT_CATEGORIES, CATEGORY_IMAGES } from './categories';
import { RESIDENTIAL_COMPONENTS } from './catalog/residential';
import { INDUSTRIAL_COMPONENTS } from './catalog/industrial';
import { ELECTRONICS_COMPONENTS } from './catalog/electronics';
import { MOTORS_COMPONENTS } from './catalog/motors';
import { AUTOMATION_COMPONENTS } from './catalog/automation';
import { RENEWABLE_COMPONENTS } from './catalog/renewable';
import { TOOLS_COMPONENTS } from './catalog/tools';

export { COMPONENT_CATEGORIES, CATEGORY_IMAGES };

export const ELECTRONIC_COMPONENTS: ElectronicComponent[] = [
  ...RESIDENTIAL_COMPONENTS,
  ...INDUSTRIAL_COMPONENTS,
  ...ELECTRONICS_COMPONENTS,
  ...MOTORS_COMPONENTS,
  ...AUTOMATION_COMPONENTS,
  ...RENEWABLE_COMPONENTS,
  ...TOOLS_COMPONENTS,
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    componentId: 'resistors',
    mode: 'physical',
    prompt: {
      ar: 'أي عنصر إلكتروني يظهر في الشكل أعلاه ويعمل على تحديد التيار وتقسيم الجهد وفق قانون أوم؟',
      en: 'Which component shown above limits electric current and divides voltage according to Ohm’s Law?',
      fr: 'Quel composant illustré ci-dessus limite le courant et divise la tension selon la loi d’Ohm ?',
    },
    options: [
      { id: 'resistors', label: { ar: 'المقاومة الكهربائية', en: 'Resistor', fr: 'Résistance' }, subLabel: 'IEC R' },
      { id: 'inductors', label: { ar: 'الملف الكهربائي', en: 'Inductor', fr: 'Bobine' }, subLabel: 'IEC L' },
      { id: 'diodes', label: { ar: 'الدايود الموحد', en: 'PN Diode', fr: 'Diode PN' }, subLabel: 'IEC D' },
      { id: 'fuses', label: { ar: 'المصهر الزجاجي', en: 'Fuse', fr: 'Fusible' }, subLabel: 'IEC F' },
    ],
    correctId: 'resistors',
    explanation: {
      ar: 'المقاومة الثابتة تقرأ قيمتها من الحلقات الملونة وتحد التيار وفق المعادلة V = I × R لحماية المكونات.',
      en: 'Fixed resistors use IEC color bands to indicate resistance in Ohms and limit current via V = I × R.',
      fr: 'La résistance fixe utilise un code à anneaux de couleur et limite le courant selon U = R × I.',
    },
  },
  {
    id: 'q2',
    componentId: 'diodes',
    mode: 'schematic',
    prompt: {
      ar: 'إلى ماذا يشير هذا الرمز الكهربائي ذو المثلث والخط المستقيم العمودي عند الكاثود؟',
      en: 'What component does this schematic symbol (triangle pointing to a cathode bar) represent?',
      fr: 'À quel composant correspond ce symbole normalisé avec un triangle pointant vers une barre ?',
    },
    options: [
      { id: 'capacitors', label: { ar: 'المكثف الكهربائي', en: 'Capacitor', fr: 'Condensateur' }, subLabel: 'IEC C' },
      { id: 'diodes', label: { ar: 'الدايود (الصمام الثنائي)', en: 'Rectifier Diode', fr: 'Diode de redressement' }, subLabel: 'IEC D' },
      { id: 'transistors', label: { ar: 'الترانزستور ثنائي القطب', en: 'BJT Transistor', fr: 'Transistor bipolaire' }, subLabel: 'IEC Q' },
      { id: 'mosfets', label: { ar: 'الموسفت', en: 'Power MOSFET', fr: 'Transistor MOSFET' }, subLabel: 'IEC Q/M' },
    ],
    correctId: 'diodes',
    explanation: {
      ar: 'الدايود يسمح بمرور التيار من الأنود إلى الكاثود (اتجاه السهم) ويحجبه في الاتجاه المعاكس.',
      en: 'A silicon rectifier diode conducts forward from Anode to Cathode (~0.7V drop) and blocks reverse polarity.',
      fr: 'La diode laisse passer le courant de l’Anode vers la Cathode et bloque le sens inverse.',
    },
  },
  {
    id: 'q3',
    componentId: 'mosfets',
    mode: 'function',
    prompt: {
      ar: 'تحتاج للتحكم في سرعة محرك DC يسحب 15A باستخدام إشارة PWM من متحكم دقيق وبأقل فقد حرارة ممكن. ما أنسب عنصر؟',
      en: 'You need to switch a 15A DC motor using PWM from a microcontroller with minimal heat loss. Which component fits best?',
      fr: 'Vous devez piloter un moteur 15A en PWM depuis un microcontrôleur avec très peu de pertes. Quel composant choisir ?',
    },
    options: [
      { id: 'voltage-regulators', label: { ar: 'منظم الجهد الخطي', en: 'Linear Voltage Regulator', fr: 'Régulateur linéaire' }, subLabel: 'TO-220 7805' },
      { id: 'mosfets', label: { ar: 'ترانزستور الموسفت (MOSFET)', en: 'Logic-Level Power MOSFET', fr: 'Transistor MOSFET' }, subLabel: 'G / D / S' },
      { id: 'logic-gates', label: { ar: 'البوابات المنطقية', en: 'Logic Gate IC', fr: 'Porte logique' }, subLabel: 'CMOS 74HC' },
      { id: 'capacitors', label: { ar: 'المكثف السيراميكي', en: 'Ceramic Capacitor', fr: 'Condensateur céramique' }, subLabel: '100 nF' },
    ],
    correctId: 'mosfets',
    explanation: {
      ar: 'الموسفت يعمل بمقاومة توصيل بالغة الانخفاض Rds(on) بالميلي أوم، ما يجعله مثالياً لتبديل التيارات العالية بتقنية PWM.',
      en: 'Power MOSFETs feature milliohm Rds(on) resistance and voltage-driven insulated Gates ideal for high-current PWM.',
      fr: 'Le MOSFET présente une résistance Rds(on) de quelques milliohms idéale pour la commutation PWM à fort courant.',
    },
  },
  {
    id: 'q4',
    componentId: 'relays',
    mode: 'schematic',
    prompt: {
      ar: 'ما اسم المكون الذي يستخدم ملفاً مغناطيسياً (A1–A2) لفتح وإغلاق نقاط تلامس معزولة (COM / NO / NC)؟',
      en: 'Which device uses an electromagnet coil (A1–A2) to switch electrically isolated COM/NO/NC contacts?',
      fr: 'Quel composant utilise une bobine (A1–A2) pour commuter des contacts isolés COM/NO/NC ?',
    },
    options: [
      { id: 'relays', label: { ar: 'المرحل الكهرومغناطيسي (Relay)', en: 'Electromagnetic Relay', fr: 'Relais électromagnétique' }, subLabel: 'IEC K' },
      { id: 'circuit-breakers', label: { ar: 'القاطع الأوتوماتيكي MCB', en: 'Circuit Breaker (MCB)', fr: 'Disjoncteur MCB' }, subLabel: 'IEC Q' },
      { id: 'voltage-regulators', label: { ar: 'منظم الجهد', en: 'Voltage Regulator', fr: 'Régulateur de tension' }, subLabel: 'IEC REG' },
      { id: 'fuses', label: { ar: 'المصهر الكهربائي', en: 'Cartridge Fuse', fr: 'Fusible' }, subLabel: 'IEC F' },
    ],
    correctId: 'relays',
    explanation: {
      ar: 'الريليه يؤمن عزلاً كهربائياً تاماً بين ملف التحكم (5V/12V/24VDC) وحمل الجهد العالي على أطراف COM/NO/NC.',
      en: 'An electromechanical relay provides full galvanic isolation between its control coil and high-voltage load contacts.',
      fr: 'Le relais assure une isolation galvanique complète entre sa bobine de commande et ses contacts de puissance.',
    },
  },
  {
    id: 'q5',
    componentId: 'capacitors',
    mode: 'physical',
    prompt: {
      ar: 'يتميز هذا العنصر بساقين بأطوال مختلفة وشريط سالب مطبوع على جانبه لتخزين الشحنة وتنعيم الجهد. ما هو؟',
      en: 'Shown with two unequal leads and a negative stripe along its cylinder, which component smooths DC voltage ripple?',
      fr: 'Doté de deux pattes inégales et d’une bande négative latérale, quel composant lisse la tension continue ?',
    },
    options: [
      { id: 'capacitors', label: { ar: 'المكثف الكيميائي المستقطب', en: 'Electrolytic Capacitor', fr: 'Condensateur électrolytique' }, subLabel: 'µF / + −' },
      { id: 'leds', label: { ar: 'الثنائي الباعث للضوء LED', en: 'Light Emitting Diode', fr: 'Diode LED' }, subLabel: '20 mA' },
      { id: 'integrated-circuits', label: { ar: 'الدوائر المتكاملة IC', en: 'Integrated Circuit', fr: 'Circuit intégré' }, subLabel: 'DIP-8' },
      { id: 'resistors', label: { ar: 'المقاومة السلكية', en: 'Wirewound Resistor', fr: 'Résistance bobinée' }, subLabel: 'IEC R' },
    ],
    correctId: 'capacitors',
    explanation: {
      ar: 'المكثف الكيميائي مستقطب؛ يجب احترام علامة السالب (−) وجهد التحمل المكتوب على غلافه الأسطواني.',
      en: 'Electrolytic capacitors are polarized bulk storage cans—always observe the negative (−) stripe and voltage rating.',
      fr: 'Les condensateurs électrolytiques sont polarisés ; il faut respecter la bande négative (−) et la tension maximale.',
    },
  },
  {
    id: 'q6',
    componentId: 'rcd-rcbo',
    mode: 'function',
    prompt: {
      ar: 'أي جهاز حماية منزلي يكتشف تيار التسرب الأرضي (30mA) لحماية الإنسان من الصعق الكهربائي ويفصل خلال ميلي ثانية؟',
      en: 'Which residential protection device detects a 30mA earth-leakage imbalance to protect people from electric shock?',
      fr: 'Quel dispositif de protection domestique détecte une fuite à la terre de 30 mA pour protéger les personnes contre l’électrocution ?',
    },
    options: [
      { id: 'rcd-rcbo', label: { ar: 'القاطع التفاضلي RCD / RCBO', en: 'RCD / RCBO Differential Breaker', fr: 'Interrupteur / Disjoncteur différentiel' }, subLabel: 'IΔn 30 mA' },
      { id: 'fuses', label: { ar: 'المصهر الزجاجي', en: 'Glass Fuse', fr: 'Fusible verre' }, subLabel: 'IEC F' },
      { id: 'contactors', label: { ar: 'الكونتاكتور الصناعي', en: 'Industrial Contactor', fr: 'Contacteur' }, subLabel: 'AC-3' },
      { id: 'junction-boxes', label: { ar: 'علبة التفرع الكهربائية', en: 'Junction Box', fr: 'Boîte de dérivation' }, subLabel: 'IP65' },
    ],
    correctId: 'rcd-rcbo',
    explanation: {
      ar: 'القاطع التفاضلي يقارن تيار الذهاب والعودة؛ عند تسرب 30mA نحو الأرض أو جسم الإنسان يقطع التغذية فوراً.',
      en: 'RCD/RCBO monitors current balance between Line and Neutral via a toroidal transformer and trips at 30mA earth leakage.',
      fr: 'Le DDR compare en continu les courants phase/neutre et déclenche immédiatement dès 30 mA de fuite à la terre.',
    },
  },
];
