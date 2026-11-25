import type { CategoryMeta } from '../types/electronics';

export const CATEGORY_IMAGES = {
  residential: '/src/assets/images/category_residential_wiring_1795560165085.jpg',
  industrial: '/src/assets/images/category_power_industrial_1795558394800.jpg',
  electronics: '/src/assets/images/category_semiconductors_1795558395519.jpg',
  motors: '/src/assets/images/category_electric_motors_1795560166684.jpg',
  automation: '/src/assets/images/category_automation_plc_1795560167058.jpg',
  renewable: '/src/assets/images/category_renewable_solar_1795560167452.jpg',
  tools: '/src/assets/images/lab_oscilloscope_bench_1795558395064.jpg',
  workbench: '/src/assets/images/hero_workbench_electronics_1795558394640.jpg',
} as const;

export const COMPONENT_CATEGORIES: CategoryMeta[] = [
  {
    id: 'residential',
    label: {
      ar: 'الكهرباء المنزلية',
      en: 'Residential Electricity',
      fr: 'Électricité résidentielle',
    },
    summary: {
      ar: 'التمديدات المنزلية، المفاتيح، المآخذ، القواطع، لوحات التوزيع، التأريض، والقواطع التفاضلية.',
      en: 'Building wiring, switches, sockets, MCBs, distribution boards, earthing, and RCD/RCBO protection.',
      fr: 'Installations domestiques : interrupteurs, prises, disjoncteurs, tableaux, terre et DDR.',
    },
    imageUrl: CATEGORY_IMAGES.residential,
    imageAlt: {
      ar: 'مكونات الكهرباء المنزلية: مفتاح إنارة ومقبس وقاطع أوتوماتيكي وأسلاك نحاسية ومصباح LED',
      en: 'Residential electrical components: light switch, grounded socket, MCB, copper cables, and LED bulb',
      fr: 'Composants électriques résidentiels : interrupteur, prise, disjoncteur, câbles et lampe LED',
    },
  },
  {
    id: 'industrial',
    label: {
      ar: 'الكهرباء الصناعية',
      en: 'Industrial Electricity',
      fr: 'Électricité industrielle',
    },
    summary: {
      ar: 'الكونتاكتورات، المرحلات الحرارية والكهرومغناطيسية، المؤقتات، أزرار التشغيل، وبادئات المحركات.',
      en: 'Contactors, relays, thermal overload protection, timers, pilot devices, and motor starters.',
      fr: 'Contacteurs, relais, relais thermiques, temporisateurs, boutons-poussoirs et démarreurs.',
    },
    imageUrl: CATEGORY_IMAGES.industrial,
    imageAlt: {
      ar: 'مكونات الكهرباء الصناعية: محول قدرة وقاطع أوتوماتيكي ومرحل تحكم',
      en: 'Industrial power hardware: transformer, DIN-rail breaker, and control relay',
      fr: 'Appareillage industriel de puissance : transformateur, disjoncteur et relais',
    },
  },
  {
    id: 'electronics',
    label: {
      ar: 'الإلكترونيات',
      en: 'Electronics',
      fr: 'Électronique',
    },
    summary: {
      ar: 'المقاومات، المكثفات، الدايودات، الترانزستورات، MOSFET، الدوائر المتكاملة، المتحكمات، وPCB.',
      en: 'Resistors, capacitors, diodes, transistors, MOSFETs, thyristors, ICs, MCUs, and PCBs.',
      fr: 'Résistances, condensateurs, diodes, transistors, MOSFET, thyristors, CI et PCB.',
    },
    imageUrl: CATEGORY_IMAGES.electronics,
    imageAlt: {
      ar: 'مكونات إلكترونية دقيقة: شرائح متكاملة وموسفت ودايودات ومصابيح LED',
      en: 'Electronic semiconductor components: ICs, power MOSFETs, diodes, and LEDs',
      fr: 'Composants électroniques : circuits intégrés, MOSFET, diodes et LED',
    },
  },
  {
    id: 'motors',
    label: {
      ar: 'المحركات الكهربائية',
      en: 'Electric Motors',
      fr: 'Moteurs électriques',
    },
    summary: {
      ar: 'محركات DC وAC، المحركات الحثية والتزامنية، محركات الخطوة والسيرفو، ومغيرات السرعة VFD.',
      en: 'DC/AC motors, single & three-phase induction motors, stepper, servo, synchronous, and VFDs.',
      fr: 'Moteurs CC et CA, monophasés, triphasés, pas-à-pas, servo, synchrones et variateurs VFD.',
    },
    imageUrl: CATEGORY_IMAGES.motors,
    imageAlt: {
      ar: 'محرك حثي ثلاثي الطور ومحرك خطوة وسيرفو ومغير سرعة VFD',
      en: 'Three-phase induction motor, stepper motor, servo motor, and VFD drive',
      fr: 'Moteur asynchrone triphasé, moteur pas-à-pas, servomoteur et variateur VFD',
    },
  },
  {
    id: 'automation',
    label: {
      ar: 'الأتمتة الصناعية',
      en: 'Automation',
      fr: 'Automatisation',
    },
    summary: {
      ar: 'وحدات PLC، شاشات HMI، أنظمة SCADA، الحساسات، المشفرات، المشغلات، وشبكات الاتصال الصناعي.',
      en: 'PLC controllers, HMI panels, SCADA systems, sensors, encoders, actuators, and fieldbus.',
      fr: 'Automates API/PLC, pupitres IHM, SCADA, capteurs, codeurs, actionneurs et bus de terrain.',
    },
    imageUrl: CATEGORY_IMAGES.automation,
    imageAlt: {
      ar: 'وحدة PLC صناعية وشاشة HMI ومشفر دوراني وحساسات تقارب على سكة DIN',
      en: 'DIN-rail PLC controller, HMI touchscreen panel, rotary encoder, and proximity sensors',
      fr: 'Automate programmable PLC, écran IHM, codeur rotatif et capteurs industriels',
    },
  },
  {
    id: 'renewable',
    label: {
      ar: 'الطاقة المتجددة',
      en: 'Renewable Energy',
      fr: 'Énergie renouvelable',
    },
    summary: {
      ar: 'الألواح الشمسية، العاكسات، البطاريات، منظمات الشحن MPPT وPWM، الحماية الشمسية، وطاقة الرياح.',
      en: 'Solar PV panels, inverters, batteries, MPPT/PWM controllers, DC protection, and wind components.',
      fr: 'Panneaux solaires, onduleurs, batteries, régulateurs MPPT/PWM, protections DC et éolien.',
    },
    imageUrl: CATEGORY_IMAGES.renewable,
    imageAlt: {
      ar: 'لوح شمسي أحادي البلورة ومنظم MPPT وبطارية LiFePO4 وأجهزة حماية DC',
      en: 'Monocrystalline solar panel, MPPT charge controller, LiFePO4 battery, and DC protection',
      fr: 'Panneau solaire monocristallin, régulateur MPPT, batterie LiFePO4 et protection DC',
    },
  },
  {
    id: 'tools',
    label: {
      ar: 'الأدوات والمعدات الكهربائية',
      en: 'Electrical Tools',
      fr: 'Outils électriques',
    },
    summary: {
      ar: 'أجهزة القياس والاختبار، الأدوات اليدوية المعزولة 1000V، كاوية اللحام، ومعدات السلامة الشخصية.',
      en: 'Multimeters, clamp meters, oscilloscopes, megohmmeters, insulated VDE tools, soldering, and PPE.',
      fr: 'Multimètres, pinces ampèremétriques, oscilloscopes, mégohmmètres, outils VDE et EPI.',
    },
    imageUrl: CATEGORY_IMAGES.tools,
    imageAlt: {
      ar: 'طاولة قياس إلكترونية تضم راسم إشارة وملتيميتر رقمي ولوحة تجارب',
      en: 'Electrical workbench with digital multimeter, oscilloscope, and diagnostic tools',
      fr: 'Banc de mesure avec oscilloscope, multimètre numérique et outillage de test',
    },
  },
];
