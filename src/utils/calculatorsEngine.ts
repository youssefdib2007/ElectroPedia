import type {
  CalculatorCategoryGroup,
  CalculatorId,
  CalculatorOutput,
  LocalizedText,
} from '../types/electronics';

export interface CalculatorMeta {
  id: CalculatorId;
  group: CalculatorCategoryGroup;
  formulaPreview: string;
}

export const CALCULATORS_LIST: CalculatorMeta[] = [
  { id: 'ohms-law', group: 'fundamentals', formulaPreview: 'V = I × R · P = V × I' },
  { id: 'electrical-power', group: 'fundamentals', formulaPreview: 'P = V × I × cos(φ)' },
  { id: 'energy-consumption', group: 'fundamentals', formulaPreview: 'E (kWh) = P (kW) × t (h)' },
  { id: 'electricity-cost', group: 'fundamentals', formulaPreview: 'Cost = kWh × Tariff' },
  { id: 'resistor-color', group: 'circuits', formulaPreview: 'R = (D₁D₂[D₃]) × 10ⁿ ± Tol%' },
  { id: 'series-resistance', group: 'circuits', formulaPreview: 'R_eq = R₁ + R₂ + ... + Rₙ' },
  { id: 'parallel-resistance', group: 'circuits', formulaPreview: '1/R_eq = 1/R₁ + 1/R₂ + ...' },
  { id: 'capacitor', group: 'circuits', formulaPreview: 'X_c = 1 / (2πfC) · τ = R × C' },
  { id: 'voltage-divider', group: 'circuits', formulaPreview: 'V_out = V_in × R₂ / (R₁ + R₂)' },
  { id: 'voltage-drop', group: 'installations', formulaPreview: 'ΔV = k × ρ × (L / S) × I × cos(φ)' },
  { id: 'cable-size', group: 'installations', formulaPreview: 'S ≥ max(S_ampacity, S_ΔV)' },
  { id: 'transformer', group: 'machines', formulaPreview: 'V₁ / V₂ = N₁ / N₂ = I₂ / I₁' },
  { id: 'motor-power', group: 'machines', formulaPreview: 'P_mech = √3 × V × I × cos(φ) × η' },
  { id: 'three-phase-power', group: 'machines', formulaPreview: 'P = √3 × V_L × I_L × cos(φ)' },
  { id: 'power-factor', group: 'machines', formulaPreview: 'Q_c = P × (tan φ₁ − tan φ₂)' },
  { id: 'solar-panel', group: 'solar', formulaPreview: 'P_PV = E_day / (PSH × η_sys)' },
  { id: 'battery-capacity', group: 'solar', formulaPreview: 'C_Ah = (E × Days) / (V × DoD × η)' },
  { id: 'unit-converter', group: 'tools', formulaPreview: 'Scale · SI Prefixes · AWG ↔ mm²' },
];

export function formatNum(n: number, maxDecimals = 4): string {
  if (!Number.isFinite(n)) return '—';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e6 || (abs > 0 && abs < 1e-4)) {
    return n.toExponential(3);
  }
  const factor = Math.pow(10, maxDecimals);
  const rounded = Math.round(n * factor) / factor;
  return Number(rounded.toFixed(maxDecimals)).toString();
}

export function formatSiResistance(ohms: number): { value: string; unit: string } {
  if (!Number.isFinite(ohms)) return { value: '—', unit: 'Ω' };
  const abs = Math.abs(ohms);
  if (abs >= 1e6) return { value: formatNum(ohms / 1e6, 3), unit: 'MΩ' };
  if (abs >= 1e3) return { value: formatNum(ohms / 1e3, 3), unit: 'kΩ' };
  if (abs > 0 && abs < 1) return { value: formatNum(ohms * 1e3, 2), unit: 'mΩ' };
  return { value: formatNum(ohms, 3), unit: 'Ω' };
}

export function formatSiCapacitance(farads: number): { value: string; unit: string } {
  if (!Number.isFinite(farads)) return { value: '—', unit: 'F' };
  const abs = Math.abs(farads);
  if (abs >= 1e-3) return { value: formatNum(farads * 1e3, 3), unit: 'mF' };
  if (abs >= 1e-6) return { value: formatNum(farads * 1e6, 3), unit: 'µF' };
  if (abs >= 1e-9) return { value: formatNum(farads * 1e9, 3), unit: 'nF' };
  return { value: formatNum(farads * 1e12, 3), unit: 'pF' };
}

function invalidOutput(
  formula: string,
  error: LocalizedText,
  assumptions: LocalizedText[]
): CalculatorOutput {
  return {
    valid: false,
    error,
    formula,
    metrics: [],
    steps: [],
    explanation: error,
    assumptions,
  };
}

const GENERAL_DISCLAIMER: LocalizedText = {
  ar: 'تنبيه هندسي: هذه النتائج تقديرات تعليمية مبنية على معادلات مبسطة، ولا تغني عن المخططات المعتمدة أو الحسابات الهندسية الرسمية حسب المواصفات القياسية (IEC 60364 / NF C 15-100 / NEC).',
  en: 'Engineering Notice: Results are educational estimates based on simplified models and do NOT replace certified engineering calculations or official electrical codes (IEC 60364 / NF C 15-100 / NEC).',
  fr: 'Avis d’ingénierie : Ces résultats sont des estimations pédagogiques basées sur des modèles simplifiés et ne remplacent pas les notes de calcul certifiées ni les normes officielles (IEC 60364 / NF C 15-100).',
};

const PROTECTION_SIZING_DISCLAIMER: LocalizedText = {
  ar: 'تحذير سلامة هام: حسابات مقطع الكابل والقاطع استرشادية للتعليم فقط ولا تعتبر بديلاً عن التصميم الهندسي المعتمد، إذ تتطلب الشبكات الحقيقية فحص تيار القصر (Isc)، ومعاملات التجميع والحرارة، وزمن فصل الحماية (Zs).',
  en: 'Critical Safety Notice: Cable sizing and breaker estimates are for educational guidance ONLY and are NOT a substitute for certified engineering design, which requires short-circuit (Isc), grouping/ambient derating, and earth-fault loop impedance (Zs) verification.',
  fr: 'Avertissement de sécurité : Le dimensionnement de câble et de disjoncteur est purement pédagogique et ne remplace PAS une étude d’ingénierie certifiée (vérification du courant de court-circuit Isc, déclassement thermique et boucle de défaut Zs).',
};

// ───────────────────────────────────────────────────────────────────────────
// 1. Ohm's Law Calculator
// ───────────────────────────────────────────────────────────────────────────
export type OhmSolveMode = 'find-v' | 'find-i' | 'find-r' | 'find-p';
export type VoltageUnit = 'mV' | 'V' | 'kV';
export type CurrentUnit = 'mA' | 'A';
export type ResistanceUnit = 'ohm' | 'kohm' | 'mohm';

const V_SCALE: Record<VoltageUnit, number> = { mV: 1e-3, V: 1, kV: 1e3 };
const I_SCALE: Record<CurrentUnit, number> = { mA: 1e-3, A: 1 };
const R_SCALE: Record<ResistanceUnit, number> = { ohm: 1, kohm: 1e3, mohm: 1e6 };

export function calculateOhmsLaw(params: {
  mode: OhmSolveMode;
  voltage: number;
  voltageUnit: VoltageUnit;
  current: number;
  currentUnit: CurrentUnit;
  resistance: number;
  resistanceUnit: ResistanceUnit;
}): CalculatorOutput {
  const formula = 'V = I × R   |   I = V / R   |   R = V / I   |   P = V × I';
  const assumptions: LocalizedText[] = [
    {
      ar: 'يفترض مقاومة خطية أومية ثابتة لا تتغير قيمتها مع الحرارة (تيار مستمر أو حمل أومي نقي).',
      en: 'Assumes a linear ohmic resistor with constant resistance regardless of temperature (DC or purely resistive AC load).',
      fr: 'Suppose une résistance linéaire constante indépendante de la température (CC ou charge purement résistive).',
    },
  ];

  const vRaw = params.voltage * V_SCALE[params.voltageUnit];
  const iRaw = params.current * I_SCALE[params.currentUnit];
  const rRaw = params.resistance * R_SCALE[params.resistanceUnit];

  let V = 0;
  let I = 0;
  let R = 0;
  let P = 0;
  const steps: LocalizedText[] = [];

  if (params.mode === 'find-v') {
    if (!Number.isFinite(iRaw) || !Number.isFinite(rRaw) || iRaw < 0 || rRaw <= 0) {
      return invalidOutput(
        formula,
        {
          ar: 'أدخل تياراً ≥ 0 ومقاومة أكبر من صفر.',
          en: 'Enter current ≥ 0 and resistance greater than zero.',
          fr: 'Saisissez un courant ≥ 0 et une résistance strictement positive.',
        },
        assumptions
      );
    }
    I = iRaw;
    R = rRaw;
    V = I * R;
    P = V * I;
    steps.push(
      {
        ar: `تحويل الوحدات: I = ${formatNum(I, 4)} A و R = ${formatNum(R, 4)} Ω`,
        en: `Convert to SI units: I = ${formatNum(I, 4)} A, R = ${formatNum(R, 4)} Ω`,
        fr: `Conversion SI : I = ${formatNum(I, 4)} A et R = ${formatNum(R, 4)} Ω`,
      },
      {
        ar: `حساب الجهد: V = I × R = ${formatNum(I, 4)} × ${formatNum(R, 4)} = ${formatNum(V, 4)} V`,
        en: `Compute Voltage: V = I × R = ${formatNum(I, 4)} × ${formatNum(R, 4)} = ${formatNum(V, 4)} V`,
        fr: `Calcul de la tension : V = I × R = ${formatNum(I, 4)} × ${formatNum(R, 4)} = ${formatNum(V, 4)} V`,
      },
      {
        ar: `حساب القدرة المبددة: P = V × I = ${formatNum(V, 4)} × ${formatNum(I, 4)} = ${formatNum(P, 4)} W`,
        en: `Compute Power: P = V × I = ${formatNum(V, 4)} × ${formatNum(I, 4)} = ${formatNum(P, 4)} W`,
        fr: `Calcul de la puissance : P = V × I = ${formatNum(V, 4)} × ${formatNum(I, 4)} = ${formatNum(P, 4)} W`,
      }
    );
  } else if (params.mode === 'find-i') {
    if (!Number.isFinite(vRaw) || !Number.isFinite(rRaw) || vRaw < 0 || rRaw <= 0) {
      return invalidOutput(
        formula,
        {
          ar: 'أدخل جهداً ≥ 0 ومقاومة أكبر من صفر لمنع القسمة على صفر.',
          en: 'Enter voltage ≥ 0 and resistance > 0 to avoid division by zero.',
          fr: 'Saisissez une tension ≥ 0 et une résistance > 0.',
        },
        assumptions
      );
    }
    V = vRaw;
    R = rRaw;
    I = V / R;
    P = V * I;
    steps.push(
      {
        ar: `تحويل الوحدات: V = ${formatNum(V, 4)} V و R = ${formatNum(R, 4)} Ω`,
        en: `Convert to SI units: V = ${formatNum(V, 4)} V, R = ${formatNum(R, 4)} Ω`,
        fr: `Conversion SI : V = ${formatNum(V, 4)} V et R = ${formatNum(R, 4)} Ω`,
      },
      {
        ar: `حساب التيار: I = V / R = ${formatNum(V, 4)} / ${formatNum(R, 4)} = ${formatNum(I, 4)} A (${formatNum(I * 1000, 2)} mA)`,
        en: `Compute Current: I = V / R = ${formatNum(V, 4)} / ${formatNum(R, 4)} = ${formatNum(I, 4)} A (${formatNum(I * 1000, 2)} mA)`,
        fr: `Calcul du courant : I = V / R = ${formatNum(V, 4)} / ${formatNum(R, 4)} = ${formatNum(I, 4)} A (${formatNum(I * 1000, 2)} mA)`,
      },
      {
        ar: `حساب القدرة: P = V × I = ${formatNum(P, 4)} W`,
        en: `Compute Power: P = V × I = ${formatNum(P, 4)} W`,
        fr: `Calcul de la puissance : P = V × I = ${formatNum(P, 4)} W`,
      }
    );
  } else if (params.mode === 'find-r') {
    if (!Number.isFinite(vRaw) || !Number.isFinite(iRaw) || vRaw < 0 || iRaw <= 0) {
      return invalidOutput(
        formula,
        {
          ar: 'أدخل جهداً ≥ 0 وتياراً أكبر من صفر لحساب المقاومة.',
          en: 'Enter voltage ≥ 0 and current > 0 to compute resistance.',
          fr: 'Saisissez une tension ≥ 0 et un courant > 0.',
        },
        assumptions
      );
    }
    V = vRaw;
    I = iRaw;
    R = V / I;
    P = V * I;
    const rFmt = formatSiResistance(R);
    steps.push(
      {
        ar: `تحويل الوحدات: V = ${formatNum(V, 4)} V و I = ${formatNum(I, 4)} A`,
        en: `Convert to SI units: V = ${formatNum(V, 4)} V, I = ${formatNum(I, 4)} A`,
        fr: `Conversion SI : V = ${formatNum(V, 4)} V et I = ${formatNum(I, 4)} A`,
      },
      {
        ar: `حساب المقاومة: R = V / I = ${formatNum(V, 4)} / ${formatNum(I, 4)} = ${rFmt.value} ${rFmt.unit}`,
        en: `Compute Resistance: R = V / I = ${formatNum(V, 4)} / ${formatNum(I, 4)} = ${rFmt.value} ${rFmt.unit}`,
        fr: `Calcul de la résistance : R = V / I = ${formatNum(V, 4)} / ${formatNum(I, 4)} = ${rFmt.value} ${rFmt.unit}`,
      },
      {
        ar: `القدرة المستهلكة: P = V × I = ${formatNum(P, 4)} W`,
        en: `Power dissipated: P = V × I = ${formatNum(P, 4)} W`,
        fr: `Puissance dissipée : P = V × I = ${formatNum(P, 4)} W`,
      }
    );
  } else {
    if (!Number.isFinite(vRaw) || !Number.isFinite(iRaw) || vRaw < 0 || iRaw <= 0) {
      return invalidOutput(
        formula,
        {
          ar: 'أدخل جهداً ≥ 0 وتياراً أكبر من صفر.',
          en: 'Enter voltage ≥ 0 and current > 0.',
          fr: 'Saisissez une tension ≥ 0 et un courant > 0.',
        },
        assumptions
      );
    }
    V = vRaw;
    I = iRaw;
    P = V * I;
    R = V / I;
    steps.push(
      {
        ar: `القدرة: P = V × I = ${formatNum(V, 4)} × ${formatNum(I, 4)} = ${formatNum(P, 4)} W`,
        en: `Power: P = V × I = ${formatNum(V, 4)} × ${formatNum(I, 4)} = ${formatNum(P, 4)} W`,
        fr: `Puissance : P = V × I = ${formatNum(V, 4)} × ${formatNum(I, 4)} = ${formatNum(P, 4)} W`,
      },
      {
        ar: `المقاومة المكافئة: R = V / I = ${formatNum(R, 4)} Ω`,
        en: `Equivalent resistance: R = V / I = ${formatNum(R, 4)} Ω`,
        fr: `Résistance équivalente : R = V / I = ${formatNum(R, 4)} Ω`,
      }
    );
  }

  const rSi = formatSiResistance(R);

  return {
    valid: true,
    formula,
    metrics: [
      { label: { ar: 'الجهد (V)', en: 'Voltage (V)', fr: 'Tension (V)' }, value: formatNum(V, 3), unit: 'V', tone: 'primary' },
      {
        label: { ar: 'التيار (I)', en: 'Current (I)', fr: 'Courant (I)' },
        value: Math.abs(I) < 1 && I > 0 ? formatNum(I * 1000, 2) : formatNum(I, 3),
        unit: Math.abs(I) < 1 && I > 0 ? 'mA' : 'A',
        tone: 'neutral',
      },
      { label: { ar: 'المقاومة (R)', en: 'Resistance (R)', fr: 'Résistance (R)' }, value: rSi.value, unit: rSi.unit, tone: 'neutral' },
      { label: { ar: 'القدرة (P)', en: 'Power (P)', fr: 'Puissance (P)' }, value: formatNum(P, 3), unit: 'W', tone: P > 1 ? 'warning' : 'success' },
    ],
    steps,
    explanation: {
      ar: 'يربط قانون أوم بين الجهد (القوة الدافعة الكهربائية)، والتيار (تدفق الشحنات)، والمقاومة (ممانعة المرور). زيادة الجهد ترفع التيار طردياً عند ثبات المقاومة.',
      en: "Ohm's Law relates voltage (electrical pressure), current (charge flow), and resistance (opposition). At constant resistance, doubling the voltage doubles the current.",
      fr: "La loi d'Ohm relie la tension, le courant et la résistance. À résistance constante, le courant est directement proportionnel à la tension.",
    },
    assumptions,
    diagramData: { V, I, R, P },
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 2. Electrical Power Calculator
// ───────────────────────────────────────────────────────────────────────────
export type PowerCalcMode = 'dc' | 'ac-single' | 'from-ir' | 'from-vr';

export function calculateElectricalPower(params: {
  mode: PowerCalcMode;
  voltage: number;
  current: number;
  resistance: number;
  powerFactor: number;
}): CalculatorOutput {
  const formula =
    params.mode === 'dc'
      ? 'P = V × I'
      : params.mode === 'ac-single'
        ? 'S = V × I   |   P = S × cos(φ)   |   Q = S × sin(φ)'
        : params.mode === 'from-ir'
          ? 'P = I² × R'
          : 'P = V² / R';

  const assumptions: LocalizedText[] = [
    {
      ar: 'للدوائر المترددة أحادية الطور، يُستخدم جهد القيمة الفعالة (RMS) ومعامل قدرة ثابت.',
      en: 'For single-phase AC, RMS voltage/current and steady-state sinusoidal waveforms are assumed.',
      fr: 'En monophasé CA, on utilise les valeurs efficaces (RMS) en régime sinusoïdal établi.',
    },
  ];

  const { voltage, current, resistance, powerFactor } = params;

  if (params.mode === 'dc') {
    if (!Number.isFinite(voltage) || !Number.isFinite(current) || voltage < 0 || current < 0) {
      return invalidOutput(
        formula,
        {
          ar: 'أدخل جهداً وتياراً موجبين.',
          en: 'Enter non-negative voltage and current.',
          fr: 'Saisissez une tension et un courant positifs.',
        },
        assumptions
      );
    }
    const P = voltage * current;
    return {
      valid: true,
      formula,
      metrics: [
        { label: { ar: 'القدرة المستمرة (P)', en: 'DC Power (P)', fr: 'Puissance CC (P)' }, value: formatNum(P, 3), unit: 'W', tone: 'primary' },
        { label: { ar: 'بالكيلوواط', en: 'In Kilowatts', fr: 'En Kilowatts' }, value: formatNum(P / 1000, 4), unit: 'kW', tone: 'neutral' },
      ],
      steps: [
        {
          ar: `P = V × I = ${formatNum(voltage, 2)} × ${formatNum(current, 2)} = ${formatNum(P, 3)} W`,
          en: `P = V × I = ${formatNum(voltage, 2)} × ${formatNum(current, 2)} = ${formatNum(P, 3)} W`,
          fr: `P = V × I = ${formatNum(voltage, 2)} × ${formatNum(current, 2)} = ${formatNum(P, 3)} W`,
        },
      ],
      explanation: {
        ar: 'في التيار المستمر (DC) يتطابق طور الجهد والتيار دائماً، لذا تساوي القدرة الفعلية حاصل ضربهما مباشرة.',
        en: 'In DC circuits there is no phase shift, so true electrical power equals voltage multiplied directly by current.',
        fr: 'En courant continu, il n’y a pas de déphasage : la puissance vaut directement V × I.',
      },
      assumptions,
    };
  }

  if (params.mode === 'ac-single') {
    if (
      !Number.isFinite(voltage) ||
      !Number.isFinite(current) ||
      !Number.isFinite(powerFactor) ||
      voltage <= 0 ||
      current < 0 ||
      powerFactor <= 0 ||
      powerFactor > 1
    ) {
      return invalidOutput(
        formula,
        {
          ar: 'تأكد من أن الجهد > 0، التيار ≥ 0، ومعامل القدرة cos(φ) بين 0.01 و 1.',
          en: 'Ensure Voltage > 0, Current ≥ 0, and Power Factor cos(φ) is between 0.01 and 1.',
          fr: 'Vérifiez : Tension > 0, Courant ≥ 0 et cos(φ) compris entre 0,01 et 1.',
        },
        assumptions
      );
    }
    const S = voltage * current;
    const P = S * powerFactor;
    const sinPhi = Math.sqrt(Math.max(0, 1 - powerFactor * powerFactor));
    const Q = S * sinPhi;
    return {
      valid: true,
      formula,
      metrics: [
        { label: { ar: 'القدرة الفعالة (P)', en: 'Active Power (P)', fr: 'Puissance active (P)' }, value: formatNum(P, 2), unit: 'W', tone: 'primary' },
        { label: { ar: 'القدرة الظاهرية (S)', en: 'Apparent Power (S)', fr: 'Puissance apparente (S)' }, value: formatNum(S, 2), unit: 'VA', tone: 'neutral' },
        { label: { ar: 'القدرة الردية (Q)', en: 'Reactive Power (Q)', fr: 'Puissance réactive (Q)' }, value: formatNum(Q, 2), unit: 'VAR', tone: 'warning' },
      ],
      steps: [
        {
          ar: `القدرة الظاهرية: S = V × I = ${formatNum(voltage, 1)} × ${formatNum(current, 2)} = ${formatNum(S, 2)} VA`,
          en: `Apparent Power: S = V × I = ${formatNum(voltage, 1)} × ${formatNum(current, 2)} = ${formatNum(S, 2)} VA`,
          fr: `Puissance apparente : S = V × I = ${formatNum(voltage, 1)} × ${formatNum(current, 2)} = ${formatNum(S, 2)} VA`,
        },
        {
          ar: `القدرة الفعالة: P = S × cos(φ) = ${formatNum(S, 2)} × ${formatNum(powerFactor, 2)} = ${formatNum(P, 2)} W`,
          en: `Active Power: P = S × cos(φ) = ${formatNum(S, 2)} × ${formatNum(powerFactor, 2)} = ${formatNum(P, 2)} W`,
          fr: `Puissance active : P = S × cos(φ) = ${formatNum(S, 2)} × ${formatNum(powerFactor, 2)} = ${formatNum(P, 2)} W`,
        },
        {
          ar: `القدرة الردية: Q = S × sin(φ) = ${formatNum(S, 2)} × ${formatNum(sinPhi, 3)} = ${formatNum(Q, 2)} VAR`,
          en: `Reactive Power: Q = S × sin(φ) = ${formatNum(S, 2)} × ${formatNum(sinPhi, 3)} = ${formatNum(Q, 2)} VAR`,
          fr: `Puissance réactive : Q = S × sin(φ) = ${formatNum(S, 2)} × ${formatNum(sinPhi, 3)} = ${formatNum(Q, 2)} VAR`,
        },
      ],
      explanation: {
        ar: 'في التيار المتردد، تمثل P الشغل المفيد بالواط، وQ القدرة المتبادلة لتشكيل المجال المغناطيسي، وS محصلتهما الهندسية.',
        en: 'In AC circuits, active power (P) performs useful work (W), reactive power (Q) sustains magnetic/electric fields (VAR), and apparent power (S) is their vector sum (VA).',
        fr: 'En CA, P effectue le travail utile (W), Q alimente les champs magnétiques (VAR) et S est leur somme vectorielle (VA).',
      },
      assumptions,
      diagramData: { P, Q, S, pf: powerFactor },
    };
  }

  if (params.mode === 'from-ir') {
    if (!Number.isFinite(current) || !Number.isFinite(resistance) || current < 0 || resistance <= 0) {
      return invalidOutput(
        formula,
        {
          ar: 'أدخل تياراً ≥ 0 ومقاومة أكبر من صفر.',
          en: 'Enter current ≥ 0 and resistance > 0.',
          fr: 'Saisissez un courant ≥ 0 et une résistance > 0.',
        },
        assumptions
      );
    }
    const P = current * current * resistance;
    const V = current * resistance;
    return {
      valid: true,
      formula,
      metrics: [
        { label: { ar: 'القدرة (P = I²R)', en: 'Power (P = I²R)', fr: 'Puissance (P = I²R)' }, value: formatNum(P, 3), unit: 'W', tone: 'primary' },
        { label: { ar: 'الجهد على المقاومة', en: 'Voltage Drop', fr: 'Chute de tension' }, value: formatNum(V, 3), unit: 'V', tone: 'neutral' },
      ],
      steps: [
        {
          ar: `P = I² × R = (${formatNum(current, 3)})² × ${formatNum(resistance, 2)} = ${formatNum(P, 3)} W`,
          en: `P = I² × R = (${formatNum(current, 3)})² × ${formatNum(resistance, 2)} = ${formatNum(P, 3)} W`,
          fr: `P = I² × R = (${formatNum(current, 3)})² × ${formatNum(resistance, 2)} = ${formatNum(P, 3)} W`,
        },
      ],
      explanation: {
        ar: 'تتناسب الحرارة المفقودة بمفعول جول طردياً مع مربع شدة التيار، لذلك يؤدي تضاعف التيار إلى تضاعف الفقد الحراري 4 مرات.',
        en: 'Joule heating scales with the square of current: doubling current increases power loss fourfold.',
        fr: 'L’effet Joule varie comme le carré du courant : doubler I multiplie la perte thermique par 4.',
      },
      assumptions,
    };
  }

  // from-vr
  if (!Number.isFinite(voltage) || !Number.isFinite(resistance) || voltage < 0 || resistance <= 0) {
    return invalidOutput(
      formula,
      {
        ar: 'أدخل جهداً ≥ 0 ومقاومة أكبر من صفر.',
        en: 'Enter voltage ≥ 0 and resistance > 0.',
        fr: 'Saisissez une tension ≥ 0 et une résistance > 0.',
      },
      assumptions
    );
  }
  const P = (voltage * voltage) / resistance;
  const I = voltage / resistance;
  return {
    valid: true,
    formula,
    metrics: [
      { label: { ar: 'القدرة (P = V²/R)', en: 'Power (P = V²/R)', fr: 'Puissance (P = V²/R)' }, value: formatNum(P, 3), unit: 'W', tone: 'primary' },
      { label: { ar: 'التيار المار', en: 'Current (I)', fr: 'Courant (I)' }, value: formatNum(I, 4), unit: 'A', tone: 'neutral' },
    ],
    steps: [
      {
        ar: `P = V² / R = (${formatNum(voltage, 2)})² / ${formatNum(resistance, 2)} = ${formatNum(P, 3)} W`,
        en: `P = V² / R = (${formatNum(voltage, 2)})² / ${formatNum(resistance, 2)} = ${formatNum(P, 3)} W`,
        fr: `P = V² / R = (${formatNum(voltage, 2)})² / ${formatNum(resistance, 2)} = ${formatNum(P, 3)} W`,
      },
    ],
    explanation: {
      ar: 'تُستخدم صيغة V²/R عند معرفة الجهد الثابت والمقاومة مباشرة مثل سخانات المقاومة أو اختيار استطاعة المقاومة (0.25W / 0.5W / 1W).',
      en: 'P = V²/R is ideal when supply voltage and load resistance are known, such as heating elements or resistor wattage ratings.',
      fr: 'P = V²/R s’utilise lorsque la tension d’alimentation et la résistance sont connues.',
    },
    assumptions,
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 3. Energy Consumption Calculator
// ───────────────────────────────────────────────────────────────────────────
export function calculateEnergyConsumption(params: {
  power: number;
  powerUnit: 'W' | 'kW';
  quantity: number;
  hoursPerDay: number;
  days: number;
}): CalculatorOutput {
  const formula = 'E (kWh) = (P_W × N × Hours / 1000) × Days';
  const assumptions: LocalizedText[] = [
    {
      ar: 'يفترض تشغيل الجهاز بقدرته الاسمية الكاملة طوال ساعات التشغيل (معامل استخدام = 1).',
      en: 'Assumes the appliance runs continuously at its full rated wattage during active hours (duty cycle = 100%).',
      fr: 'Suppose un fonctionnement continu à pleine puissance nominale durant les heures indiquées.',
    },
  ];

  if (
    !Number.isFinite(params.power) ||
    !Number.isFinite(params.quantity) ||
    !Number.isFinite(params.hoursPerDay) ||
    !Number.isFinite(params.days) ||
    params.power <= 0 ||
    params.quantity < 1 ||
    params.hoursPerDay <= 0 ||
    params.hoursPerDay > 24 ||
    params.days <= 0
  ) {
    return invalidOutput(
      formula,
      {
        ar: 'تأكد من أن القدرة > 0، والعدد ≥ 1، وساعات التشغيل بين 0 و 24 ساعة.',
        en: 'Ensure Power > 0, Quantity ≥ 1, Hours between 0 and 24, and Days > 0.',
        fr: 'Vérifiez : Puissance > 0, Quantité ≥ 1, Heures entre 0 et 24, Jours > 0.',
      },
      assumptions
    );
  }

  const powerWatts = params.powerUnit === 'kW' ? params.power * 1000 : params.power;
  const totalKw = (powerWatts * params.quantity) / 1000;
  const dailyKwh = totalKw * params.hoursPerDay;
  const dailyWh = dailyKwh * 1000;
  const periodKwh = dailyKwh * params.days;
  const annualKwh = dailyKwh * 365;

  return {
    valid: true,
    formula,
    metrics: [
      { label: { ar: 'الاستهلاك اليومي', en: 'Daily Energy', fr: 'Énergie / jour' }, value: formatNum(dailyKwh, 3), unit: 'kWh', tone: 'primary' },
      { label: { ar: 'بالواط-ساعة يومياً', en: 'Daily (Wh)', fr: 'Par jour (Wh)' }, value: formatNum(dailyWh, 1), unit: 'Wh', tone: 'neutral' },
      { label: { ar: `خلال ${params.days} يوم`, en: `Over ${params.days} days`, fr: `Sur ${params.days} jours` }, value: formatNum(periodKwh, 2), unit: 'kWh', tone: 'success' },
      { label: { ar: 'الاستهلاك السنوي', en: 'Annual Energy', fr: 'Énergie annuelle' }, value: formatNum(annualKwh, 1), unit: 'kWh/yr', tone: 'warning' },
    ],
    steps: [
      {
        ar: `القدرة الإجمالية بالكيلوواط: P = (${formatNum(powerWatts, 1)} W × ${params.quantity}) / 1000 = ${formatNum(totalKw, 3)} kW`,
        en: `Total power: P = (${formatNum(powerWatts, 1)} W × ${params.quantity}) / 1000 = ${formatNum(totalKw, 3)} kW`,
        fr: `Puissance totale : P = (${formatNum(powerWatts, 1)} W × ${params.quantity}) / 1000 = ${formatNum(totalKw, 3)} kW`,
      },
      {
        ar: `الطاقة اليومية: E_day = ${formatNum(totalKw, 3)} kW × ${formatNum(params.hoursPerDay, 2)} h = ${formatNum(dailyKwh, 3)} kWh`,
        en: `Daily energy: E_day = ${formatNum(totalKw, 3)} kW × ${formatNum(params.hoursPerDay, 2)} h = ${formatNum(dailyKwh, 3)} kWh`,
        fr: `Énergie journalière : E_jour = ${formatNum(totalKw, 3)} kW × ${formatNum(params.hoursPerDay, 2)} h = ${formatNum(dailyKwh, 3)} kWh`,
      },
      {
        ar: `للفترة (${params.days} يوم): E_period = ${formatNum(dailyKwh, 3)} × ${params.days} = ${formatNum(periodKwh, 2)} kWh`,
        en: `Period total (${params.days} d): E_period = ${formatNum(dailyKwh, 3)} × ${params.days} = ${formatNum(periodKwh, 2)} kWh`,
        fr: `Total période (${params.days} j) : E_période = ${formatNum(dailyKwh, 3)} × ${params.days} = ${formatNum(periodKwh, 2)} kWh`,
      },
    ],
    explanation: {
      ar: 'الطاقة الكهربائية هي حاصل ضرب القدرة في الزمن. تُقاس الفاتورة بالكيلوواط-ساعة (kWh) وهو ما يعادل تشغيل جهاز قدرته 1000 واط لمدة ساعة كاملة.',
      en: 'Electrical energy equals power multiplied by time. One kilowatt-hour (kWh) equals running a 1000 W appliance for 1 hour.',
      fr: 'L’énergie électrique est le produit de la puissance par la durée. 1 kWh correspond à 1000 W pendant 1 heure.',
    },
    assumptions,
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 4. Electricity Cost Calculator
// ───────────────────────────────────────────────────────────────────────────
export function calculateElectricityCost(params: {
  power: number;
  powerUnit: 'W' | 'kW';
  hoursPerDay: number;
  daysPerMonth: number;
  ratePerKwh: number;
  currency: string;
}): CalculatorOutput {
  const formula = 'Cost = (P_kW × Hours/day × Days) × Tariff_per_kWh';
  const assumptions: LocalizedText[] = [
    {
      ar: 'يفترض تعرفة ثابتة للكيلوواط-ساعة دون شرائح تصاعدية أو رسوم اشتراك ثابتة أو ضرائب إضافية.',
      en: 'Assumes a flat tariff per kWh without tiered billing brackets, fixed meter fees, or taxes.',
      fr: 'Suppose un tarif fixe par kWh sans tranches progressives, abonnement fixe ni taxes.',
    },
  ];

  if (
    !Number.isFinite(params.power) ||
    !Number.isFinite(params.hoursPerDay) ||
    !Number.isFinite(params.daysPerMonth) ||
    !Number.isFinite(params.ratePerKwh) ||
    params.power <= 0 ||
    params.hoursPerDay <= 0 ||
    params.hoursPerDay > 24 ||
    params.daysPerMonth <= 0 ||
    params.daysPerMonth > 31 ||
    params.ratePerKwh < 0
  ) {
    return invalidOutput(
      formula,
      {
        ar: 'تأكد من صحة القدرة (> 0)، والساعات (0–24)، والأيام (1–31)، والتعرفة (≥ 0).',
        en: 'Check that Power > 0, Hours (0–24), Days/month (1–31), and Rate ≥ 0.',
        fr: 'Vérifiez : Puissance > 0, Heures (0–24), Jours (1–31) et Tarif ≥ 0.',
      },
      assumptions
    );
  }

  const pKw = params.powerUnit === 'kW' ? params.power : params.power / 1000;
  const dailyKwh = pKw * params.hoursPerDay;
  const monthlyKwh = dailyKwh * params.daysPerMonth;
  const annualKwh = dailyKwh * 365;

  const dailyCost = dailyKwh * params.ratePerKwh;
  const monthlyCost = monthlyKwh * params.ratePerKwh;
  const annualCost = annualKwh * params.ratePerKwh;

  return {
    valid: true,
    formula,
    metrics: [
      { label: { ar: 'التكلفة اليومية', en: 'Daily Cost', fr: 'Coût journalier' }, value: formatNum(dailyCost, 2), unit: params.currency, tone: 'neutral' },
      { label: { ar: 'التكلفة الشهرية', en: 'Monthly Cost', fr: 'Coût mensuel' }, value: formatNum(monthlyCost, 2), unit: params.currency, tone: 'primary' },
      { label: { ar: 'التكلفة السنوية', en: 'Annual Cost', fr: 'Coût annuel' }, value: formatNum(annualCost, 2), unit: params.currency, tone: 'warning' },
      { label: { ar: 'الاستهلاك الشهري', en: 'Monthly Energy', fr: 'Énergie mensuelle' }, value: formatNum(monthlyKwh, 2), unit: 'kWh', tone: 'success' },
    ],
    steps: [
      {
        ar: `الاستهلاك اليومي: ${formatNum(pKw, 3)} kW × ${formatNum(params.hoursPerDay, 2)} h = ${formatNum(dailyKwh, 3)} kWh/day`,
        en: `Daily consumption: ${formatNum(pKw, 3)} kW × ${formatNum(params.hoursPerDay, 2)} h = ${formatNum(dailyKwh, 3)} kWh/day`,
        fr: `Consommation/jour : ${formatNum(pKw, 3)} kW × ${formatNum(params.hoursPerDay, 2)} h = ${formatNum(dailyKwh, 3)} kWh/j`,
      },
      {
        ar: `الاستهلاك الشهري: ${formatNum(dailyKwh, 3)} × ${params.daysPerMonth} = ${formatNum(monthlyKwh, 2)} kWh`,
        en: `Monthly consumption: ${formatNum(dailyKwh, 3)} × ${params.daysPerMonth} = ${formatNum(monthlyKwh, 2)} kWh`,
        fr: `Consommation/mois : ${formatNum(dailyKwh, 3)} × ${params.daysPerMonth} = ${formatNum(monthlyKwh, 2)} kWh`,
      },
      {
        ar: `التكلفة الشهرية: ${formatNum(monthlyKwh, 2)} kWh × ${formatNum(params.ratePerKwh, 3)} = ${formatNum(monthlyCost, 2)} ${params.currency}`,
        en: `Monthly cost: ${formatNum(monthlyKwh, 2)} kWh × ${formatNum(params.ratePerKwh, 3)} = ${formatNum(monthlyCost, 2)} ${params.currency}`,
        fr: `Coût mensuel : ${formatNum(monthlyKwh, 2)} kWh × ${formatNum(params.ratePerKwh, 3)} = ${formatNum(monthlyCost, 2)} ${params.currency}`,
      },
    ],
    explanation: {
      ar: 'يساعد حساب التكلفة الكهربائية في مقارنة استهلاك الأجهزة المنزلية والمعدات الصناعية وتقدير الفاتورة قبل التشغيل.',
      en: 'Electricity cost estimation helps compare appliance efficiency and forecast monthly utility expenses.',
      fr: 'Le calcul du coût électrique permet de comparer la consommation des appareils et d’estimer la facture.',
    },
    assumptions,
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 5. Resistor Color Code Calculator (4-band and 5-band)
// ───────────────────────────────────────────────────────────────────────────
export type ResistorBandColor =
  | 'black'
  | 'brown'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'violet'
  | 'grey'
  | 'white'
  | 'gold'
  | 'silver';

export const RESISTOR_COLOR_SPECS: Record<
  ResistorBandColor,
  { hex: string; digit?: number; multiplier?: number; tolerance?: number; label: LocalizedText }
> = {
  black: { hex: '#1E293B', digit: 0, multiplier: 1, label: { ar: 'أسود (0)', en: 'Black (0)', fr: 'Noir (0)' } },
  brown: { hex: '#78350F', digit: 1, multiplier: 10, tolerance: 1, label: { ar: 'بني (1)', en: 'Brown (1)', fr: 'Marron (1)' } },
  red: { hex: '#DC2626', digit: 2, multiplier: 100, tolerance: 2, label: { ar: 'أحمر (2)', en: 'Red (2)', fr: 'Rouge (2)' } },
  orange: { hex: '#EA580C', digit: 3, multiplier: 1e3, label: { ar: 'برتقالي (3)', en: 'Orange (3)', fr: 'Orange (3)' } },
  yellow: { hex: '#EAB308', digit: 4, multiplier: 1e4, label: { ar: 'أصفر (4)', en: 'Yellow (4)', fr: 'Jaune (4)' } },
  green: { hex: '#16A34A', digit: 5, multiplier: 1e5, tolerance: 0.5, label: { ar: 'أخضر (5)', en: 'Green (5)', fr: 'Vert (5)' } },
  blue: { hex: '#2563EB', digit: 6, multiplier: 1e6, tolerance: 0.25, label: { ar: 'أزرق (6)', en: 'Blue (6)', fr: 'Bleu (6)' } },
  violet: { hex: '#7C3AED', digit: 7, multiplier: 1e7, tolerance: 0.1, label: { ar: 'بنفسجي (7)', en: 'Violet (7)', fr: 'Violet (7)' } },
  grey: { hex: '#64748B', digit: 8, label: { ar: 'رمادي (8)', en: 'Grey (8)', fr: 'Gris (8)' } },
  white: { hex: '#F8FAFC', digit: 9, label: { ar: 'أبيض (9)', en: 'White (9)', fr: 'Blanc (9)' } },
  gold: { hex: '#D97706', multiplier: 0.1, tolerance: 5, label: { ar: 'ذهبي', en: 'Gold', fr: 'Or' } },
  silver: { hex: '#94A3B8', multiplier: 0.01, tolerance: 10, label: { ar: 'فضي', en: 'Silver', fr: 'Argent' } },
};

export function calculateResistorColorCode(params: {
  bands: 4 | 5;
  band1: ResistorBandColor;
  band2: ResistorBandColor;
  band3: ResistorBandColor;
  multiplier: ResistorBandColor;
  tolerance: ResistorBandColor;
}): CalculatorOutput {
  const formula =
    params.bands === 4
      ? 'R = (D₁ × 10 + D₂) × Multiplier ± Tolerance%'
      : 'R = (D₁ × 100 + D₂ × 10 + D₃) × Multiplier ± Tolerance%';

  const assumptions: LocalizedText[] = [
    {
      ar: 'مقاومات محورية قياسية وفق معيار IEC 60062. الحلقة الذهبية أو الفضية تكون غالباً هي حلقة التسامح الأخيرة.',
      en: 'Standard axial color coding per IEC 60062. Gold or silver bands typically mark the tolerance band on the right.',
      fr: 'Code couleur axial standard selon IEC 60062. L’anneau or ou argent indique généralement la tolérance.',
    },
  ];

  const d1 = RESISTOR_COLOR_SPECS[params.band1].digit;
  const d2 = RESISTOR_COLOR_SPECS[params.band2].digit;
  const d3 = RESISTOR_COLOR_SPECS[params.band3].digit;
  const mult = RESISTOR_COLOR_SPECS[params.multiplier].multiplier;
  const tol = RESISTOR_COLOR_SPECS[params.tolerance].tolerance;

  if (
    d1 === undefined ||
    d2 === undefined ||
    (params.bands === 5 && d3 === undefined) ||
    mult === undefined ||
    tol === undefined
  ) {
    return invalidOutput(
      formula,
      {
        ar: 'اختيار لون غير صالح لأحد الحلقات.',
        en: 'Invalid color selection for one of the bands.',
        fr: 'Couleur invalide sélectionnée pour un anneau.',
      },
      assumptions
    );
  }

  const baseDigits = params.bands === 4 ? d1 * 10 + d2 : d1 * 100 + d2 * 10 + (d3 ?? 0);
  const ohms = baseDigits * mult;
  const minOhms = ohms * (1 - tol / 100);
  const maxOhms = ohms * (1 + tol / 100);

  const mainFmt = formatSiResistance(ohms);
  const minFmt = formatSiResistance(minOhms);
  const maxFmt = formatSiResistance(maxOhms);

  return {
    valid: true,
    formula,
    metrics: [
      { label: { ar: 'القيمة الاسمية', en: 'Nominal Resistance', fr: 'Valeur nominale' }, value: mainFmt.value, unit: mainFmt.unit, tone: 'primary' },
      { label: { ar: 'نسبة التسامح', en: 'Tolerance', fr: 'Tolérance' }, value: `±${tol}`, unit: '%', tone: 'neutral' },
      { label: { ar: 'الحد الأدنى', en: 'Minimum', fr: 'Minimum' }, value: minFmt.value, unit: minFmt.unit, tone: 'success' },
      { label: { ar: 'الحد الأقصى', en: 'Maximum', fr: 'Maximum' }, value: maxFmt.value, unit: maxFmt.unit, tone: 'warning' },
    ],
    steps: [
      {
        ar: `الأرقام المعنوية: ${baseDigits}`,
        en: `Significant digits: ${baseDigits}`,
        fr: `Chiffres significatifs : ${baseDigits}`,
      },
      {
        ar: `الضرب في المعامل (×${mult}): ${baseDigits} × ${mult} = ${mainFmt.value} ${mainFmt.unit}`,
        en: `Multiply by multiplier (×${mult}): ${baseDigits} × ${mult} = ${mainFmt.value} ${mainFmt.unit}`,
        fr: `Multiplication (×${mult}) : ${baseDigits} × ${mult} = ${mainFmt.value} ${mainFmt.unit}`,
      },
      {
        ar: `نطاق التسامح ±${tol}%: من ${minFmt.value} ${minFmt.unit} إلى ${maxFmt.value} ${maxFmt.unit}`,
        en: `Tolerance range ±${tol}%: ${minFmt.value} ${minFmt.unit} to ${maxFmt.value} ${maxFmt.unit}`,
        fr: `Plage ±${tol}% : de ${minFmt.value} ${minFmt.unit} à ${maxFmt.value} ${maxFmt.unit}`,
      },
    ],
    explanation: {
      ar: 'تمثل الحلقات الأولى الأرقام المعنوية للمقاومة، وتحدد الحلقة قبل الأخيرة عدد الأصفار (المعامل)، بينما تبين الحلقة الأخيرة دقة التصنيع المسموحة.',
      en: 'The initial bands encode the significant digits, the next band sets the decimal multiplier, and the final band indicates manufacturing tolerance.',
      fr: 'Les premiers anneaux donnent les chiffres significatifs, l’avant-dernier le multiplicateur et le dernier la tolérance.',
    },
    assumptions,
    diagramData: {
      bands: params.bands,
      colors:
        params.bands === 4
          ? [
              RESISTOR_COLOR_SPECS[params.band1].hex,
              RESISTOR_COLOR_SPECS[params.band2].hex,
              RESISTOR_COLOR_SPECS[params.multiplier].hex,
              RESISTOR_COLOR_SPECS[params.tolerance].hex,
            ]
          : [
              RESISTOR_COLOR_SPECS[params.band1].hex,
              RESISTOR_COLOR_SPECS[params.band2].hex,
              RESISTOR_COLOR_SPECS[params.band3].hex,
              RESISTOR_COLOR_SPECS[params.multiplier].hex,
              RESISTOR_COLOR_SPECS[params.tolerance].hex,
            ],
      label: `${mainFmt.value} ${mainFmt.unit} ±${tol}%`,
    },
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 6 & 7. Series & Parallel Resistance Calculators
// ───────────────────────────────────────────────────────────────────────────
export interface ResistorEntry {
  value: number;
  unit: ResistanceUnit;
}

export function calculateSeriesResistance(params: {
  resistors: ResistorEntry[];
  sourceVoltage: number;
}): CalculatorOutput {
  const formula = 'R_eq = R₁ + R₂ + ... + Rₙ   |   I = V / R_eq';
  const assumptions: LocalizedText[] = [
    {
      ar: 'المقاومات متصلة على التوالي بحيث يمر فيها نفس شدة التيار الكهربائي.',
      en: 'Resistors are connected end-to-end in a single loop carrying identical current.',
      fr: 'Les résistances sont montées en série et parcourues par un courant identique.',
    },
  ];

  if (
    params.resistors.length < 2 ||
    params.resistors.some((r) => !Number.isFinite(r.value) || r.value <= 0) ||
    !Number.isFinite(params.sourceVoltage) ||
    params.sourceVoltage < 0
  ) {
    return invalidOutput(
      formula,
      {
        ar: 'أدخل مقاومتين على الأقل بقيم أكبر من صفر وجهد مصدر ≥ 0.',
        en: 'Enter at least 2 resistors > 0 and source voltage ≥ 0.',
        fr: 'Saisissez au moins 2 résistances > 0 et une tension ≥ 0.',
      },
      assumptions
    );
  }

  const ohmsList = params.resistors.map((r) => r.value * R_SCALE[r.unit]);
  const rEq = ohmsList.reduce((acc, v) => acc + v, 0);
  const current = params.sourceVoltage > 0 ? params.sourceVoltage / rEq : 0;
  const power = params.sourceVoltage * current;
  const rFmt = formatSiResistance(rEq);

  return {
    valid: true,
    formula,
    metrics: [
      { label: { ar: 'المقاومة المكافئة (R_eq)', en: 'Equivalent R (R_eq)', fr: 'Résistance équiv.' }, value: rFmt.value, unit: rFmt.unit, tone: 'primary' },
      { label: { ar: 'التيار الكلي (I)', en: 'Circuit Current (I)', fr: 'Courant total (I)' }, value: current < 1 && current > 0 ? formatNum(current * 1000, 2) : formatNum(current, 4), unit: current < 1 && current > 0 ? 'mA' : 'A', tone: 'success' },
      { label: { ar: 'القدرة الكلية (P)', en: 'Total Power (P)', fr: 'Puissance totale (P)' }, value: formatNum(power, 3), unit: 'W', tone: 'neutral' },
    ],
    steps: [
      {
        ar: `جمع القيم بالأوم: R_eq = ${ohmsList.map((v) => formatNum(v, 2)).join(' + ')} = ${formatNum(rEq, 2)} Ω (${rFmt.value} ${rFmt.unit})`,
        en: `Sum in ohms: R_eq = ${ohmsList.map((v) => formatNum(v, 2)).join(' + ')} = ${formatNum(rEq, 2)} Ω (${rFmt.value} ${rFmt.unit})`,
        fr: `Somme en ohms : R_eq = ${ohmsList.map((v) => formatNum(v, 2)).join(' + ')} = ${formatNum(rEq, 2)} Ω (${rFmt.value} ${rFmt.unit})`,
      },
      {
        ar: `التيار المار عند جهد ${formatNum(params.sourceVoltage, 2)} V: I = ${formatNum(params.sourceVoltage, 2)} / ${formatNum(rEq, 2)} = ${formatNum(current, 4)} A`,
        en: `Series current at ${formatNum(params.sourceVoltage, 2)} V: I = ${formatNum(params.sourceVoltage, 2)} / ${formatNum(rEq, 2)} = ${formatNum(current, 4)} A`,
        fr: `Courant série sous ${formatNum(params.sourceVoltage, 2)} V : I = ${formatNum(params.sourceVoltage, 2)} / ${formatNum(rEq, 2)} = ${formatNum(current, 4)} A`,
      },
    ],
    explanation: {
      ar: 'في التوصيل على التوالي، تزداد المقاومة الكلية لتصبح أكبر من أكبر مقاومة في المجموعة، ويتوزع الجهد على المقاومات بنسبة قيمتها.',
      en: 'In a series circuit, total resistance always exceeds the largest single resistor, while total voltage divides proportionally across each element.',
      fr: 'En série, la résistance totale s’additionne et dépasse toujours la plus grande résistance individuelle.',
    },
    assumptions,
    diagramData: { count: params.resistors.length, rEqLabel: `${rFmt.value} ${rFmt.unit}` },
  };
}

export function calculateParallelResistance(params: {
  resistors: ResistorEntry[];
  sourceVoltage: number;
}): CalculatorOutput {
  const formula = '1 / R_eq = 1 / R₁ + 1 / R₂ + ... + 1 / Rₙ';
  const assumptions: LocalizedText[] = [
    {
      ar: 'جميع المقاومات متصلة على التفرع بين نفس النقطتين ولها نفس فرق الجهد.',
      en: 'All resistors share the same two nodes and experience identical voltage across their terminals.',
      fr: 'Toutes les résistances sont en parallèle entre les mêmes nœuds sous la même tension.',
    },
  ];

  if (
    params.resistors.length < 2 ||
    params.resistors.some((r) => !Number.isFinite(r.value) || r.value <= 0) ||
    !Number.isFinite(params.sourceVoltage) ||
    params.sourceVoltage < 0
  ) {
    return invalidOutput(
      formula,
      {
        ar: 'أدخل مقاومتين على الأقل بقيم أكبر من صفر وجهد مصدر ≥ 0.',
        en: 'Enter at least 2 resistors > 0 and source voltage ≥ 0.',
        fr: 'Saisissez au moins 2 résistances > 0 et une tension ≥ 0.',
      },
      assumptions
    );
  }

  const ohmsList = params.resistors.map((r) => r.value * R_SCALE[r.unit]);
  const sumReciprocal = ohmsList.reduce((acc, v) => acc + 1 / v, 0);
  const rEq = 1 / sumReciprocal;
  const current = params.sourceVoltage > 0 ? params.sourceVoltage / rEq : 0;
  const power = params.sourceVoltage * current;
  const rFmt = formatSiResistance(rEq);

  return {
    valid: true,
    formula,
    metrics: [
      { label: { ar: 'المقاومة المكافئة (R_eq)', en: 'Equivalent R (R_eq)', fr: 'Résistance équiv.' }, value: rFmt.value, unit: rFmt.unit, tone: 'primary' },
      { label: { ar: 'التيار الكلي (I_total)', en: 'Total Current', fr: 'Courant total' }, value: current < 1 && current > 0 ? formatNum(current * 1000, 2) : formatNum(current, 4), unit: current < 1 && current > 0 ? 'mA' : 'A', tone: 'success' },
      { label: { ar: 'القدرة الكلية (P)', en: 'Total Power (P)', fr: 'Puissance totale' }, value: formatNum(power, 3), unit: 'W', tone: 'neutral' },
    ],
    steps: [
      {
        ar: `مجموع المقلوبات: Σ(1/R) = ${formatNum(sumReciprocal, 6)} S (سيمنز)`,
        en: `Sum of conductances: Σ(1/R) = ${formatNum(sumReciprocal, 6)} S`,
        fr: `Somme des conductances : Σ(1/R) = ${formatNum(sumReciprocal, 6)} S`,
      },
      {
        ar: `المقاومة المكافئة: R_eq = 1 / ${formatNum(sumReciprocal, 6)} = ${formatNum(rEq, 3)} Ω (${rFmt.value} ${rFmt.unit})`,
        en: `Equivalent resistance: R_eq = 1 / ${formatNum(sumReciprocal, 6)} = ${formatNum(rEq, 3)} Ω (${rFmt.value} ${rFmt.unit})`,
        fr: `Résistance équivalente : R_eq = 1 / ${formatNum(sumReciprocal, 6)} = ${formatNum(rEq, 3)} Ω (${rFmt.value} ${rFmt.unit})`,
      },
      {
        ar: `التيار الكلي المسحوب: I = V / R_eq = ${formatNum(current, 4)} A`,
        en: `Total supply current: I = V / R_eq = ${formatNum(current, 4)} A`,
        fr: `Courant total absorbé : I = V / R_eq = ${formatNum(current, 4)} A`,
      },
    ],
    explanation: {
      ar: 'في التوصيل على التوازي، تكون المقاومة المكافئة دائماً أصغر من أصغر مقاومة منفردة لأن التيار يجد عدة مسارات متفرعة.',
      en: 'In parallel circuits, equivalent resistance is always smaller than the smallest individual branch because current splits across multiple paths.',
      fr: 'En parallèle, la résistance équivalente est toujours inférieure à la plus petite résistance de branche.',
    },
    assumptions,
    diagramData: { count: params.resistors.length, rEqLabel: `${rFmt.value} ${rFmt.unit}` },
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 8. Capacitor Calculator (Series/Parallel, Reactance Xc, RC Time Constant)
// ───────────────────────────────────────────────────────────────────────────
export type CapMode = 'series-parallel' | 'reactance' | 'rc-time';
export type CapUnit = 'pF' | 'nF' | 'uF' | 'mF';
const C_SCALE: Record<CapUnit, number> = { pF: 1e-12, nF: 1e-9, uF: 1e-6, mF: 1e-3 };

export function calculateCapacitor(params: {
  mode: CapMode;
  capacitors: { value: number; unit: CapUnit }[];
  capacitance: number;
  capacitanceUnit: CapUnit;
  frequencyHz: number;
  resistanceOhms: number;
  voltage: number;
}): CalculatorOutput {
  if (params.mode === 'series-parallel') {
    const formula = 'C_parallel = C₁ + C₂ + ...   |   1/C_series = 1/C₁ + 1/C₂ + ...';
    const assumptions: LocalizedText[] = [
      {
        ar: 'مكثفات مثالية غير مستقطبة دون اعتبار لتيار التسرب أو فرق توزيع الجهد.',
        en: 'Assumes ideal capacitors ignoring leakage current and DC voltage-sharing resistors.',
        fr: 'Suppose des condensateurs idéaux sans courant de fuite.',
      },
    ];
    if (
      params.capacitors.length < 2 ||
      params.capacitors.some((c) => !Number.isFinite(c.value) || c.value <= 0)
    ) {
      return invalidOutput(
        formula,
        {
          ar: 'أدخل مكثفين على الأقل بسعة أكبر من صفر.',
          en: 'Enter at least 2 capacitors > 0.',
          fr: 'Saisissez au moins 2 condensateurs > 0.',
        },
        assumptions
      );
    }
    const faradsList = params.capacitors.map((c) => c.value * C_SCALE[c.unit]);
    const cPar = faradsList.reduce((acc, v) => acc + v, 0);
    const cSer = 1 / faradsList.reduce((acc, v) => acc + 1 / v, 0);
    const pFmt = formatSiCapacitance(cPar);
    const sFmt = formatSiCapacitance(cSer);
    return {
      valid: true,
      formula,
      metrics: [
        { label: { ar: 'السعة على التوازي', en: 'Parallel (C_eq)', fr: 'En parallèle' }, value: pFmt.value, unit: pFmt.unit, tone: 'primary' },
        { label: { ar: 'السعة على التوالي', en: 'Series (C_eq)', fr: 'En série' }, value: sFmt.value, unit: sFmt.unit, tone: 'success' },
      ],
      steps: [
        {
          ar: `التوازي (جمع مباشر): C_par = ${pFmt.value} ${pFmt.unit}`,
          en: `Parallel (direct sum): C_par = ${pFmt.value} ${pFmt.unit}`,
          fr: `En parallèle (somme) : C_par = ${pFmt.value} ${pFmt.unit}`,
        },
        {
          ar: `التوالي (مقلوب مجموع المقلوبات): C_ser = ${sFmt.value} ${sFmt.unit}`,
          en: `Series (reciprocal sum): C_ser = ${sFmt.value} ${sFmt.unit}`,
          fr: `En série (inverse des inverses) : C_ser = ${sFmt.value} ${sFmt.unit}`,
        },
      ],
      explanation: {
        ar: 'عكس المقاومات، تزداد سعة المكثفات عند ربطها على التوازي (لزيادة مساحة الألواح المكافئة) وتقل عند ربطها على التوالي.',
        en: 'Opposite to resistors, capacitors add directly in parallel (larger plate area) and decrease in series.',
        fr: 'À l’inverse des résistances, les capacités s’additionnent en parallèle et diminuent en série.',
      },
      assumptions,
    };
  }

  if (params.mode === 'reactance') {
    const formula = 'X_c = 1 / (2 × π × f × C)';
    const assumptions: LocalizedText[] = [
      {
        ar: 'إشارة جيبية نقية عند التردد f وبدون فقد عازل (ESR ≈ 0).',
        en: 'Assumes pure sinusoidal AC at frequency f and negligible ESR.',
        fr: 'Suppose un signal sinusoïdal pur à la fréquence f et une ESR négligeable.',
      },
    ];
    const cF = params.capacitance * C_SCALE[params.capacitanceUnit];
    if (
      !Number.isFinite(cF) ||
      !Number.isFinite(params.frequencyHz) ||
      cF <= 0 ||
      params.frequencyHz <= 0
    ) {
      return invalidOutput(
        formula,
        {
          ar: 'أدخل سعة وتردداً أكبر من صفر.',
          en: 'Enter capacitance and frequency greater than zero.',
          fr: 'Saisissez une capacité et une fréquence > 0.',
        },
        assumptions
      );
    }
    const xc = 1 / (2 * Math.PI * params.frequencyHz * cF);
    const xcFmt = formatSiResistance(xc);
    return {
      valid: true,
      formula,
      metrics: [
        { label: { ar: 'المفاعلة السعوية (X_c)', en: 'Reactance (X_c)', fr: 'Réactance (X_c)' }, value: xcFmt.value, unit: xcFmt.unit, tone: 'primary' },
      ],
      steps: [
        {
          ar: `X_c = 1 / (2π × ${formatNum(params.frequencyHz, 2)} Hz × ${cF.toExponential(2)} F) = ${xcFmt.value} ${xcFmt.unit}`,
          en: `X_c = 1 / (2π × ${formatNum(params.frequencyHz, 2)} Hz × ${cF.toExponential(2)} F) = ${xcFmt.value} ${xcFmt.unit}`,
          fr: `X_c = 1 / (2π × ${formatNum(params.frequencyHz, 2)} Hz × ${cF.toExponential(2)} F) = ${xcFmt.value} ${xcFmt.unit}`,
        },
      ],
      explanation: {
        ar: 'تقل المفاعلة السعوية كلما ارتفع التردد أو كبرت السعة، لذلك يمرر المكثف الترددات العالية ويحجب التيار المستمر (f = 0).',
        en: 'Capacitive reactance drops as frequency or capacitance rises—so capacitors block DC and pass high frequencies.',
        fr: 'La réactance capacitive diminue quand la fréquence ou la capacité augmente (bloque le CC, laisse passer les hautes fréquences).',
      },
      assumptions,
    };
  }

  // rc-time
  const formula = 'τ = R × C   |   t_full ≈ 5τ   |   E = ½ × C × V²';
  const assumptions: LocalizedText[] = [
    {
      ar: 'شحن مكثف فارغ عبر مقاومة ثابتة بمصدر جهد مستمر مثالي.',
      en: 'Assumes charging an initially discharged capacitor through constant R from an ideal DC step source.',
      fr: 'Suppose la charge d’un condensateur initialement déchargé via R sous une source CC idéale.',
    },
  ];
  const cF = params.capacitance * C_SCALE[params.capacitanceUnit];
  if (
    !Number.isFinite(cF) ||
    !Number.isFinite(params.resistanceOhms) ||
    !Number.isFinite(params.voltage) ||
    cF <= 0 ||
    params.resistanceOhms <= 0 ||
    params.voltage < 0
  ) {
    return invalidOutput(
      formula,
      {
        ar: 'أدخل مقاومة وسعة أكبر من صفر وجهداً ≥ 0.',
        en: 'Enter resistance and capacitance > 0 and voltage ≥ 0.',
        fr: 'Saisissez R > 0, C > 0 et une tension ≥ 0.',
      },
      assumptions
    );
  }

  const tauSec = params.resistanceOhms * cF;
  const fullSec = tauSec * 5;
  const fc = 1 / (2 * Math.PI * tauSec);
  const energyMj = 0.5 * cF * params.voltage * params.voltage * 1000;
  const tauDisplay =
    tauSec < 1e-3
      ? { val: formatNum(tauSec * 1e6, 2), unit: 'µs' }
      : tauSec < 1
        ? { val: formatNum(tauSec * 1e3, 2), unit: 'ms' }
        : { val: formatNum(tauSec, 3), unit: 's' };
  const fullDisplay =
    fullSec < 1e-3
      ? { val: formatNum(fullSec * 1e6, 2), unit: 'µs' }
      : fullSec < 1
        ? { val: formatNum(fullSec * 1e3, 2), unit: 'ms' }
        : { val: formatNum(fullSec, 3), unit: 's' };

  return {
    valid: true,
    formula,
    metrics: [
      { label: { ar: 'الثابت الزمني (τ)', en: 'Time Constant (τ)', fr: 'Constante (τ)' }, value: tauDisplay.val, unit: tauDisplay.unit, tone: 'primary' },
      { label: { ar: 'الشحن الكامل (5τ · 99.3%)', en: 'Full Charge (5τ)', fr: 'Charge complète (5τ)' }, value: fullDisplay.val, unit: fullDisplay.unit, tone: 'success' },
      { label: { ar: 'تردد القطع (f_c)', en: 'Cutoff Freq (f_c)', fr: 'Fréq. de coupure' }, value: fc >= 1000 ? formatNum(fc / 1000, 2) : formatNum(fc, 2), unit: fc >= 1000 ? 'kHz' : 'Hz', tone: 'neutral' },
      { label: { ar: 'الطاقة المخزنة (E)', en: 'Stored Energy', fr: 'Énergie stockée' }, value: formatNum(energyMj, 3), unit: 'mJ', tone: 'warning' },
    ],
    steps: [
      {
        ar: `الثابت الزمني: τ = R × C = ${formatNum(params.resistanceOhms, 1)} Ω × ${cF.toExponential(2)} F = ${tauDisplay.val} ${tauDisplay.unit}`,
        en: `Time constant: τ = R × C = ${formatNum(params.resistanceOhms, 1)} Ω × ${cF.toExponential(2)} F = ${tauDisplay.val} ${tauDisplay.unit}`,
        fr: `Constante de temps : τ = R × C = ${tauDisplay.val} ${tauDisplay.unit}`,
      },
      {
        ar: `يصل المكثف إلى 63.2% عند 1τ وإلى 99.3% عند 5τ = ${fullDisplay.val} ${fullDisplay.unit}`,
        en: `Capacitor reaches 63.2% at 1τ and 99.3% at 5τ = ${fullDisplay.val} ${fullDisplay.unit}`,
        fr: `Le condensateur atteint 63,2 % à 1τ et 99,3 % à 5τ = ${fullDisplay.val} ${fullDisplay.unit}`,
      },
    ],
    explanation: {
      ar: 'يحدد الثابت الزمني τ سرعة شحن وتفريغ المكثف في دوائر المؤقتات (مثل 555) ومرشحات التنعيم.',
      en: 'The RC time constant τ governs charging/discharging speed in timers (such as 555 circuits) and low-pass filters.',
      fr: 'La constante τ régit la vitesse de charge/décharge dans les temporisateurs et les filtres passe-bas.',
    },
    assumptions,
    diagramData: { tauLabel: `${tauDisplay.val} ${tauDisplay.unit}` },
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 9. Voltage Divider Calculator
// ───────────────────────────────────────────────────────────────────────────
export function calculateVoltageDivider(params: {
  vin: number;
  r1: number;
  r1Unit: ResistanceUnit;
  r2: number;
  r2Unit: ResistanceUnit;
}): CalculatorOutput {
  const formula = 'V_out = V_in × (R₂ / (R₁ + R₂))';
  const assumptions: LocalizedText[] = [
    {
      ar: 'مقسم جهد غير محمّل (Open Circuit): توصيل حمل مقاومته قريبة من R₂ سيخفض V_out فعلياً.',
      en: 'Unloaded voltage divider assumption (R_load ≫ R₂). Connecting a low-impedance load will pull V_out lower.',
      fr: 'Hypothèse à vide (R_charge ≫ R₂). Une charge de faible impédance fera chuter V_out.',
    },
  ];

  const r1Ohms = params.r1 * R_SCALE[params.r1Unit];
  const r2Ohms = params.r2 * R_SCALE[params.r2Unit];

  if (
    !Number.isFinite(params.vin) ||
    !Number.isFinite(r1Ohms) ||
    !Number.isFinite(r2Ohms) ||
    params.vin < 0 ||
    r1Ohms <= 0 ||
    r2Ohms <= 0
  ) {
    return invalidOutput(
      formula,
      {
        ar: 'أدخل جهد دخل ≥ 0 وقيمتي R₁ و R₂ أكبر من صفر.',
        en: 'Enter V_in ≥ 0 and both R₁, R₂ greater than zero.',
        fr: 'Saisissez V_in ≥ 0 et R₁, R₂ > 0.',
      },
      assumptions
    );
  }

  const totalR = r1Ohms + r2Ohms;
  const ratio = r2Ohms / totalR;
  const vOut = params.vin * ratio;
  const current = params.vin / totalR;
  const pR1 = current * current * r1Ohms;
  const pR2 = current * current * r2Ohms;

  return {
    valid: true,
    formula,
    metrics: [
      { label: { ar: 'جهد الخرج (V_out)', en: 'Output Voltage (V_out)', fr: 'Tension de sortie' }, value: formatNum(vOut, 3), unit: 'V', tone: 'primary' },
      { label: { ar: 'نسبة التقسيم', en: 'Divider Ratio', fr: 'Rapport' }, value: formatNum(ratio * 100, 1), unit: '%', tone: 'neutral' },
      { label: { ar: 'تيار المقسم', en: 'Divider Current', fr: 'Courant du pont' }, value: current < 1 ? formatNum(current * 1000, 2) : formatNum(current, 3), unit: current < 1 ? 'mA' : 'A', tone: 'success' },
      { label: { ar: 'استطاعة R₁ / R₂', en: 'Power R₁ / R₂', fr: 'Puissance R₁ / R₂' }, value: `${formatNum(pR1 * 1000, 1)} / ${formatNum(pR2 * 1000, 1)}`, unit: 'mW', tone: 'warning' },
    ],
    steps: [
      {
        ar: `المقاومة الكلية: R_total = ${formatNum(r1Ohms, 1)} + ${formatNum(r2Ohms, 1)} = ${formatNum(totalR, 1)} Ω`,
        en: `Total resistance: R_total = ${formatNum(r1Ohms, 1)} + ${formatNum(r2Ohms, 1)} = ${formatNum(totalR, 1)} Ω`,
        fr: `Résistance totale : R_total = ${formatNum(r1Ohms, 1)} + ${formatNum(r2Ohms, 1)} = ${formatNum(totalR, 1)} Ω`,
      },
      {
        ar: `جهد الخرج: V_out = ${formatNum(params.vin, 2)} × (${formatNum(r2Ohms, 1)} / ${formatNum(totalR, 1)}) = ${formatNum(vOut, 3)} V`,
        en: `Output voltage: V_out = ${formatNum(params.vin, 2)} × (${formatNum(r2Ohms, 1)} / ${formatNum(totalR, 1)}) = ${formatNum(vOut, 3)} V`,
        fr: `Tension de sortie : V_out = ${formatNum(params.vin, 2)} × (${formatNum(r2Ohms, 1)} / ${formatNum(totalR, 1)}) = ${formatNum(vOut, 3)} V`,
      },
    ],
    explanation: {
      ar: 'يُستخدم مقسم الجهد لإنتاج إشارة جهد مرجعية أو تكييف حساسات ADC للمتحكمات، ولا يُستخدم لتغذية أحمال ذات تيار عالٍ.',
      en: 'Voltage dividers scale signal or reference voltages for microcontroller ADCs and sensors—never use them as power supplies for heavy loads.',
      fr: 'Un pont diviseur adapte les signaux vers un CAN ou un capteur ; il ne doit pas alimenter une charge de puissance.',
    },
    assumptions,
    diagramData: { vin: params.vin, vOut, r1: r1Ohms, r2: r2Ohms },
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 10. Voltage Drop Calculator
// ───────────────────────────────────────────────────────────────────────────
export function calculateVoltageDrop(params: {
  phase: 'single' | 'three';
  material: 'copper' | 'aluminum';
  voltage: number;
  current: number;
  lengthMeters: number;
  crossSectionMm2: number;
  powerFactor: number;
}): CalculatorOutput {
  const formula =
    params.phase === 'single'
      ? 'ΔV = 2 × ρ × (L / S) × I × cos(φ)'
      : 'ΔV = √3 × ρ × (L / S) × I × cos(φ)';

  const rho = params.material === 'copper' ? 0.021 : 0.034; // 70°C PVC operating resistivity (Ω·mm²/m)
  const assumptions: LocalizedText[] = [
    {
      ar: `مقاومية التشغيل عند 70°C: النحاس ≈ 0.021، الألمنيوم ≈ 0.034 Ω·mm²/m، مع إهمال المفاعلة الحثية للكوابل الصغيرة (≤ 35 mm²).`,
      en: `Assumes conductor operating resistivity at 70°C (Cu ≈ 0.021, Al ≈ 0.034 Ω·mm²/m) and negligible inductive reactance for small cables.`,
      fr: `Résistivité en service à 70°C (Cu ≈ 0,021, Al ≈ 0,034 Ω·mm²/m), réactance linéique négligée pour faibles sections.`,
    },
  ];

  if (
    !Number.isFinite(params.voltage) ||
    !Number.isFinite(params.current) ||
    !Number.isFinite(params.lengthMeters) ||
    !Number.isFinite(params.crossSectionMm2) ||
    !Number.isFinite(params.powerFactor) ||
    params.voltage <= 0 ||
    params.current < 0 ||
    params.lengthMeters <= 0 ||
    params.crossSectionMm2 <= 0 ||
    params.powerFactor <= 0 ||
    params.powerFactor > 1
  ) {
    return invalidOutput(
      formula,
      {
        ar: 'تأكد من قيم الجهد (>0) والطول (>0) والمقطع (>0) ومعامل القدرة (0.01–1).',
        en: 'Ensure Voltage > 0, Length > 0, Cross-section > 0, and Power Factor in (0, 1].',
        fr: 'Vérifiez : Tension > 0, Longueur > 0, Section > 0 et cos(φ) dans ]0 ; 1].',
      },
      assumptions
    );
  }

  const k = params.phase === 'single' ? 2 : Math.sqrt(3);
  const deltaV = k * rho * (params.lengthMeters / params.crossSectionMm2) * params.current * params.powerFactor;
  const pct = (deltaV / params.voltage) * 100;
  const vLoad = Math.max(0, params.voltage - deltaV);
  const tone = pct <= 3 ? 'success' : pct <= 5 ? 'warning' : 'danger';

  const statusText: LocalizedText =
    pct <= 3
      ? { ar: 'ممتاز (≤ 3% · مناسب للإنارة)', en: 'Optimal (≤ 3% · Lighting OK)', fr: 'Optimal (≤ 3 % · Éclairage OK)' }
      : pct <= 5
        ? { ar: 'مقبول للأحمال (3%–5%)', en: 'Acceptable Power (3%–5%)', fr: 'Acceptable Force (3 %–5 %)' }
        : { ar: 'مرتفع (> 5% · زد مقطع السلك)', en: 'Excessive (> 5% · Upsize Cable)', fr: 'Excessif (> 5 % · Augmenter section)' };

  return {
    valid: true,
    formula,
    metrics: [
      { label: { ar: 'هبوط الجهد (ΔV)', en: 'Voltage Drop (ΔV)', fr: 'Chute (ΔV)' }, value: formatNum(deltaV, 2), unit: 'V', tone },
      { label: { ar: 'نسبة الهبوط', en: 'Drop %', fr: 'Chute %' }, value: formatNum(pct, 2), unit: '%', tone },
      { label: { ar: 'الجهد عند الحمل', en: 'Load Voltage', fr: 'Tension charge' }, value: formatNum(vLoad, 2), unit: 'V', tone: 'primary' },
      { label: { ar: 'تقييم IEC 60364', en: 'IEC 60364 Status', fr: 'Statut IEC 60364' }, value: statusText.en, tone },
    ],
    steps: [
      {
        ar: `معامل الدارة k = ${params.phase === 'single' ? '2 (أحادي الطور ذهاب وإياب)' : '1.732 (ثلاثي الطور √3)'}، ρ = ${rho}`,
        en: `Loop factor k = ${params.phase === 'single' ? '2 (single-phase)' : '1.732 (three-phase √3)'}, ρ = ${rho}`,
        fr: `Facteur k = ${params.phase === 'single' ? '2 (monophasé)' : '1,732 (triphasé √3)'}, ρ = ${rho}`,
      },
      {
        ar: `ΔV = ${formatNum(k, 3)} × ${rho} × (${params.lengthMeters} / ${params.crossSectionMm2}) × ${params.current} × ${params.powerFactor} = ${formatNum(deltaV, 2)} V (${formatNum(pct, 2)}%)`,
        en: `ΔV = ${formatNum(k, 3)} × ${rho} × (${params.lengthMeters} / ${params.crossSectionMm2}) × ${params.current} × ${params.powerFactor} = ${formatNum(deltaV, 2)} V (${formatNum(pct, 2)}%)`,
        fr: `ΔV = ${formatNum(k, 3)} × ${rho} × (${params.lengthMeters} / ${params.crossSectionMm2}) × ${params.current} × ${params.powerFactor} = ${formatNum(deltaV, 2)} V (${formatNum(pct, 2)}%)`,
      },
    ],
    explanation: {
      ar: 'يسبب طول الكابل ومقاومته فقداناً في الجهد؛ توصي المواصفات بألا يتجاوز هبوط الجهد 3% للإنارة و5% لبقية الدوائر.',
      en: 'Cable resistance reduces voltage reaching the load. Standards recommend keeping drop ≤ 3% for lighting and ≤ 5% for other circuits.',
      fr: 'La résistance du câble provoque une chute de tension. Les normes limitent généralement ΔV à 3 % (éclairage) et 5 % (autres usages).',
    },
    assumptions,
    engineeringDisclaimer: PROTECTION_SIZING_DISCLAIMER,
    diagramData: { pct, deltaV, vLoad, vSource: params.voltage },
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 11. Cable Size Calculator
// ───────────────────────────────────────────────────────────────────────────
const IEC_CABLE_TABLE: { mm2: number; cuConduitA: number; cuAirA: number; alConduitA: number; alAirA: number }[] = [
  { mm2: 1.5, cuConduitA: 15.5, cuAirA: 19.5, alConduitA: 12, alAirA: 15 },
  { mm2: 2.5, cuConduitA: 21, cuAirA: 27, alConduitA: 16.5, alAirA: 21 },
  { mm2: 4, cuConduitA: 28, cuAirA: 36, alConduitA: 22, alAirA: 28 },
  { mm2: 6, cuConduitA: 36, cuAirA: 46, alConduitA: 28, alAirA: 36 },
  { mm2: 10, cuConduitA: 50, cuAirA: 63, alConduitA: 39, alAirA: 49 },
  { mm2: 16, cuConduitA: 68, cuAirA: 85, alConduitA: 53, alAirA: 66 },
  { mm2: 25, cuConduitA: 89, cuAirA: 112, alConduitA: 70, alAirA: 87 },
  { mm2: 35, cuConduitA: 110, cuAirA: 138, alConduitA: 86, alAirA: 108 },
  { mm2: 50, cuConduitA: 134, cuAirA: 168, alConduitA: 104, alAirA: 131 },
  { mm2: 70, cuConduitA: 171, cuAirA: 213, alConduitA: 133, alAirA: 166 },
  { mm2: 95, cuConduitA: 207, cuAirA: 258, alConduitA: 161, alAirA: 201 },
  { mm2: 120, cuConduitA: 239, cuAirA: 299, alConduitA: 186, alAirA: 233 },
  { mm2: 150, cuConduitA: 272, cuAirA: 344, alConduitA: 212, alAirA: 268 },
  { mm2: 185, cuConduitA: 310, cuAirA: 392, alConduitA: 242, alAirA: 306 },
  { mm2: 240, cuConduitA: 364, cuAirA: 461, alConduitA: 284, alAirA: 360 },
];
const STANDARD_MCB_RATINGS = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315];

export function calculateCableSize(params: {
  phase: 'single' | 'three';
  material: 'copper' | 'aluminum';
  installation: 'conduit' | 'air';
  inputMode: 'power' | 'current';
  powerKw: number;
  current: number;
  voltage: number;
  powerFactor: number;
  lengthMeters: number;
  maxDropPct: number;
}): CalculatorOutput {
  const formula = 'S_min ≥ (k × ρ × L × I_b × cos φ) / ΔV_max   &   I_z(S) ≥ I_n ≥ I_b';
  const assumptions: LocalizedText[] = [
    {
      ar: 'مرجع مبسط لجدول IEC 60364-5-52 لكابل PVC 70°C عند حرارة محيطة 30°C ودائرة واحدة دون تجميع.',
      en: 'Simplified IEC 60364-5-52 PVC 70°C reference at 30°C ambient for a single circuit (no grouping derating).',
      fr: 'Référence simplifiée IEC 60364-5-52 PVC 70°C à 30°C ambiant pour un seul circuit sans groupement.',
    },
  ];

  if (
    !Number.isFinite(params.voltage) ||
    !Number.isFinite(params.powerFactor) ||
    !Number.isFinite(params.lengthMeters) ||
    !Number.isFinite(params.maxDropPct) ||
    params.voltage <= 0 ||
    params.powerFactor <= 0 ||
    params.powerFactor > 1 ||
    params.lengthMeters <= 0 ||
    params.maxDropPct <= 0 ||
    params.maxDropPct > 15
  ) {
    return invalidOutput(
      formula,
      {
        ar: 'تأكد من قيم الجهد (>0) والطول (>0) وهبوط الجهد (0.1–15%) ومعامل القدرة.',
        en: 'Verify Voltage > 0, Length > 0, Max Drop (0.1–15%), and Power Factor.',
        fr: 'Vérifiez : Tension > 0, Longueur > 0, Chute max (0,1–15 %) et cos(φ).',
      },
      assumptions
    );
  }

  const k = params.phase === 'single' ? 2 : Math.sqrt(3);
  const designCurrent =
    params.inputMode === 'current'
      ? params.current
      : (params.powerKw * 1000) / ((params.phase === 'single' ? 1 : Math.sqrt(3)) * params.voltage * params.powerFactor);

  if (!Number.isFinite(designCurrent) || designCurrent <= 0) {
    return invalidOutput(
      formula,
      {
        ar: 'يجب أن يكون الحمل أو التيار التصميمي أكبر من صفر.',
        en: 'Load power or design current must be greater than zero.',
        fr: 'La puissance ou le courant d’emploi doit être supérieur à zéro.',
      },
      assumptions
    );
  }

  const rho = params.material === 'copper' ? 0.021 : 0.034;
  const maxDropVolts = (params.maxDropPct / 100) * params.voltage;
  const minDropSection = (k * rho * params.lengthMeters * designCurrent * params.powerFactor) / maxDropVolts;

  const getAmpacity = (row: (typeof IEC_CABLE_TABLE)[number]) => {
    if (params.material === 'copper') {
      return params.installation === 'conduit' ? row.cuConduitA : row.cuAirA;
    }
    return params.installation === 'conduit' ? row.alConduitA : row.alAirA;
  };

  const selected =
    IEC_CABLE_TABLE.find((row) => row.mm2 >= minDropSection && getAmpacity(row) >= designCurrent) ??
    IEC_CABLE_TABLE[IEC_CABLE_TABLE.length - 1];

  const selectedAmpacity = getAmpacity(selected);
  const actualDropV = k * rho * (params.lengthMeters / selected.mm2) * designCurrent * params.powerFactor;
  const actualDropPct = (actualDropV / params.voltage) * 100;

  const suggestedMcb =
    STANDARD_MCB_RATINGS.find((rating) => rating >= designCurrent && rating <= selectedAmpacity) ??
    STANDARD_MCB_RATINGS.find((rating) => rating >= designCurrent) ??
    250;

  const overLimit = selectedAmpacity < designCurrent || actualDropPct > params.maxDropPct;

  return {
    valid: true,
    formula,
    metrics: [
      { label: { ar: 'المقطع التقديري المقترح', en: 'Estimated Cable Size', fr: 'Section estimée' }, value: `${selected.mm2}`, unit: 'mm²', tone: overLimit ? 'danger' : 'primary' },
      { label: { ar: 'التيار التصميمي (I_b)', en: 'Design Current (I_b)', fr: 'Courant d’emploi (I_b)' }, value: formatNum(designCurrent, 2), unit: 'A', tone: 'neutral' },
      { label: { ar: 'تحمل الكابل (I_z)', en: 'Cable Ampacity (I_z)', fr: 'Courant admissible (I_z)' }, value: `${selectedAmpacity}`, unit: 'A', tone: 'success' },
      { label: { ar: 'هبوط الجهد الفعلي', en: 'Actual Drop', fr: 'Chute réelle' }, value: formatNum(actualDropPct, 2), unit: '%', tone: actualDropPct <= params.maxDropPct ? 'success' : 'warning' },
      { label: { ar: 'قاطع استرشادي (I_n)', en: 'Est. Breaker (I_n)', fr: 'Calibre indicatif' }, value: `${suggestedMcb}`, unit: 'A', tone: 'neutral' },
    ],
    steps: [
      {
        ar: `تيار الحمل: I_b = ${formatNum(designCurrent, 2)} A`,
        en: `Load design current: I_b = ${formatNum(designCurrent, 2)} A`,
        fr: `Courant d’emploi : I_b = ${formatNum(designCurrent, 2)} A`,
      },
      {
        ar: `أدنى مقطع لتحقيق هبوط جهد ≤ ${params.maxDropPct}% (${formatNum(maxDropVolts, 2)} V): S_ΔV = ${formatNum(minDropSection, 2)} mm²`,
        en: `Min section for ≤ ${params.maxDropPct}% drop (${formatNum(maxDropVolts, 2)} V): S_ΔV = ${formatNum(minDropSection, 2)} mm²`,
        fr: `Section min pour chute ≤ ${params.maxDropPct} % (${formatNum(maxDropVolts, 2)} V) : S_ΔV = ${formatNum(minDropSection, 2)} mm²`,
      },
      {
        ar: `اختيار أقرب مقطع قياسي يحقق التحمل وهبوط الجهد: ${selected.mm2} mm² (I_z = ${selectedAmpacity} A, ΔV = ${formatNum(actualDropPct, 2)}%)`,
        en: `Selected standard size meeting ampacity & drop: ${selected.mm2} mm² (I_z = ${selectedAmpacity} A, ΔV = ${formatNum(actualDropPct, 2)}%)`,
        fr: `Section normalisée retenue : ${selected.mm2} mm² (I_z = ${selectedAmpacity} A, ΔV = ${formatNum(actualDropPct, 2)} %)`,
      },
    ],
    explanation: {
      ar: 'يخضع اختيار مقطع الكابل لشرطين متلازمين: القدرة على حمل التيار دون سخونة زائدة (I_z ≥ I_n ≥ I_b) والحفاظ على هبوط الجهد ضمن الحدود المسموحة.',
      en: 'Cable sizing satisfies two simultaneous constraints: thermal ampacity (I_z ≥ I_n ≥ I_b) and permissible voltage drop.',
      fr: 'Le choix d’un câble respecte deux critères : la tenue thermique (I_z ≥ I_n ≥ I_b) et la chute de tension admissible.',
    },
    assumptions,
    engineeringDisclaimer: PROTECTION_SIZING_DISCLAIMER,
    diagramData: { mm2: selected.mm2, current: designCurrent, dropPct: actualDropPct },
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 12. Transformer Calculator
// ───────────────────────────────────────────────────────────────────────────
export function calculateTransformer(params: {
  primaryVoltage: number;
  secondaryVoltage: number;
  powerKva: number;
  primaryTurns: number;
  efficiencyPct: number;
}): CalculatorOutput {
  const formula = 'a = V_p / V_s = N_p / N_s   |   I_p = S / V_p   |   I_s = S / V_s';
  const assumptions: LocalizedText[] = [
    {
      ar: 'محول أحادي الطور عند الحمل الاسمي الكامل؛ لتيار الخرج يتم ضرب القدرة بالكفاءة المقدرة.',
      en: 'Single-phase transformer at full VA rating; secondary current accounts for stated transformer efficiency.',
      fr: 'Transformateur monophasé à charge nominale ; le courant secondaire intègre le rendement saisi.',
    },
  ];

  if (
    !Number.isFinite(params.primaryVoltage) ||
    !Number.isFinite(params.secondaryVoltage) ||
    !Number.isFinite(params.powerKva) ||
    !Number.isFinite(params.primaryTurns) ||
    !Number.isFinite(params.efficiencyPct) ||
    params.primaryVoltage <= 0 ||
    params.secondaryVoltage <= 0 ||
    params.powerKva <= 0 ||
    params.primaryTurns <= 0 ||
    params.efficiencyPct <= 0 ||
    params.efficiencyPct > 100
  ) {
    return invalidOutput(
      formula,
      {
        ar: 'تأكد من أن الجهود والقدرة وعدد اللفات > 0 والكفاءة بين 1% و 100%.',
        en: 'Ensure voltages, power (kVA), and turns > 0, and efficiency in (0, 100].',
        fr: 'Vérifiez : tensions, puissance et spires > 0, rendement entre 1 et 100 %.',
      },
      assumptions
    );
  }

  const ratio = params.primaryVoltage / params.secondaryVoltage;
  const secondaryTurns = params.primaryTurns / ratio;
  const sVa = params.powerKva * 1000;
  const primaryCurrent = sVa / params.primaryVoltage;
  const secondaryCurrent = (sVa * (params.efficiencyPct / 100)) / params.secondaryVoltage;

  const txType: LocalizedText =
    ratio > 1.01
      ? { ar: 'محول خافض (Step-Down)', en: 'Step-Down', fr: 'Abaisseur' }
      : ratio < 0.99
        ? { ar: 'محول رافع (Step-Up)', en: 'Step-Up', fr: 'Élévateur' }
        : { ar: 'محول عزل 1:1 (Isolation)', en: 'Isolation 1:1', fr: 'Isolement 1:1' };

  return {
    valid: true,
    formula,
    metrics: [
      { label: { ar: 'نسبة التحويل (a)', en: 'Turns Ratio (a)', fr: 'Rapport (m)' }, value: `${formatNum(ratio, 3)}:1`, tone: 'primary' },
      { label: { ar: 'لفات الثانوي (N_s)', en: 'Secondary Turns', fr: 'Spires sec. (N_s)' }, value: formatNum(secondaryTurns, 1), tone: 'neutral' },
      { label: { ar: 'تيار الابتدائي (I_p)', en: 'Primary Current', fr: 'Courant primaire' }, value: formatNum(primaryCurrent, 2), unit: 'A', tone: 'warning' },
      { label: { ar: 'تيار الثانوي (I_s)', en: 'Secondary Current', fr: 'Courant secondaire' }, value: formatNum(secondaryCurrent, 2), unit: 'A', tone: 'success' },
      { label: { ar: 'النوع', en: 'Mode', fr: 'Type' }, value: txType.en, tone: 'neutral' },
    ],
    steps: [
      {
        ar: `نسبة التحويل: a = ${params.primaryVoltage} / ${params.secondaryVoltage} = ${formatNum(ratio, 3)}`,
        en: `Turns ratio: a = ${params.primaryVoltage} / ${params.secondaryVoltage} = ${formatNum(ratio, 3)}`,
        fr: `Rapport de transformation : a = ${params.primaryVoltage} / ${params.secondaryVoltage} = ${formatNum(ratio, 3)}`,
      },
      {
        ar: `لفات الثانوي: N_s = ${params.primaryTurns} / ${formatNum(ratio, 3)} = ${formatNum(secondaryTurns, 1)} لفة`,
        en: `Secondary turns: N_s = ${params.primaryTurns} / ${formatNum(ratio, 3)} = ${formatNum(secondaryTurns, 1)} turns`,
        fr: `Spires secondaires : N_s = ${params.primaryTurns} / ${formatNum(ratio, 3)} = ${formatNum(secondaryTurns, 1)} spires`,
      },
      {
        ar: `تيارات الملفات: I_p = ${formatNum(primaryCurrent, 2)} A، I_s = ${formatNum(secondaryCurrent, 2)} A`,
        en: `Winding currents: I_p = ${formatNum(primaryCurrent, 2)} A, I_s = ${formatNum(secondaryCurrent, 2)} A`,
        fr: `Courants d’enroulement : I_p = ${formatNum(primaryCurrent, 2)} A, I_s = ${formatNum(secondaryCurrent, 2)} A`,
      },
    ],
    explanation: {
      ar: 'يرفع المحول أو يخفض الجهد المتردد بنسبة عدد لفات الملف الابتدائي إلى الثانوي، ويتناسب التيار عكسياً مع الجهد للحفاظ على توازن القدرة.',
      en: 'A transformer steps AC voltage up or down proportionally to its turns ratio, while current scales inversely to conserve power.',
      fr: 'Le transformateur modifie la tension selon le rapport de spires ; le courant varie en sens inverse pour conserver la puissance.',
    },
    assumptions,
    diagramData: { vp: params.primaryVoltage, vs: params.secondaryVoltage, np: params.primaryTurns, ns: Math.round(secondaryTurns) },
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 13. Motor Power Calculator
// ───────────────────────────────────────────────────────────────────────────
export function calculateMotorPower(params: {
  phase: 'single' | 'three';
  solveMode: 'from-electrical' | 'from-mechanical';
  voltage: number;
  current: number;
  mechPowerKw: number;
  powerFactor: number;
  efficiencyPct: number;
  rpm: number;
}): CalculatorOutput {
  const formula =
    params.phase === 'single'
      ? 'P_in = V × I × cos(φ)   |   P_mech = P_in × η   |   T = 9550 × P_kW / n'
      : 'P_in = √3 × V_L × I_L × cos(φ)   |   P_mech = P_in × η   |   T = 9550 × P_kW / n';

  const assumptions: LocalizedText[] = [
    {
      ar: '1 حصان ميكانيكي (HP) = 0.7457 كيلوواط. يُفترض حمل مستقر وتوازن أطوار للمحركات ثلاثية الطور.',
      en: 'Uses 1 mechanical HP = 0.7457 kW and assumes balanced steady-state operation.',
      fr: 'Utilise 1 ch mécanique (HP) = 0,7457 kW en régime équilibré permanent.',
    },
  ];

  const eta = params.efficiencyPct / 100;
  if (
    !Number.isFinite(params.voltage) ||
    !Number.isFinite(params.powerFactor) ||
    !Number.isFinite(params.efficiencyPct) ||
    !Number.isFinite(params.rpm) ||
    params.voltage <= 0 ||
    params.powerFactor <= 0 ||
    params.powerFactor > 1 ||
    eta <= 0 ||
    eta > 1 ||
    params.rpm <= 0
  ) {
    return invalidOutput(
      formula,
      {
        ar: 'تأكد من الجهد (>0)، السرعة RPM (>0)، معامل القدرة (0.01–1)، والكفاءة (1–100%).',
        en: 'Ensure Voltage > 0, RPM > 0, cos(φ) in (0,1], and Efficiency in (0,100].',
        fr: 'Vérifiez : Tension > 0, tr/min > 0, cos(φ) et rendement valides.',
      },
      assumptions
    );
  }

  const phaseFactor = params.phase === 'single' ? 1 : Math.sqrt(3);
  let pInKw = 0;
  let pMechKw = 0;
  let current = 0;

  if (params.solveMode === 'from-electrical') {
    if (!Number.isFinite(params.current) || params.current <= 0) {
      return invalidOutput(
        formula,
        {
          ar: 'أدخل تيار المحرك (> 0 أمبير).',
          en: 'Enter motor current (> 0 A).',
          fr: 'Saisissez un courant moteur > 0 A.',
        },
        assumptions
      );
    }
    current = params.current;
    pInKw = (phaseFactor * params.voltage * current * params.powerFactor) / 1000;
    pMechKw = pInKw * eta;
  } else {
    if (!Number.isFinite(params.mechPowerKw) || params.mechPowerKw <= 0) {
      return invalidOutput(
        formula,
        {
          ar: 'أدخل قدرة المحرك الميكانيكية (> 0 كيلوواط).',
          en: 'Enter motor shaft power (> 0 kW).',
          fr: 'Saisissez une puissance mécanique > 0 kW.',
        },
        assumptions
      );
    }
    pMechKw = params.mechPowerKw;
    pInKw = pMechKw / eta;
    current = (pInKw * 1000) / (phaseFactor * params.voltage * params.powerFactor);
  }

  const hp = pMechKw / 0.7457;
  const sKva = pInKw / params.powerFactor;
  const torqueNm = (9550 * pMechKw) / params.rpm;

  return {
    valid: true,
    formula,
    metrics: [
      { label: { ar: 'القدرة الميكانيكية (kW)', en: 'Shaft Power (kW)', fr: 'Puissance arbre (kW)' }, value: formatNum(pMechKw, 3), unit: 'kW', tone: 'primary' },
      { label: { ar: 'القدرة بالحصان (HP)', en: 'Horsepower (HP)', fr: 'Puissance (HP)' }, value: formatNum(hp, 2), unit: 'HP', tone: 'success' },
      { label: { ar: 'تيار الحمل الكامل (FLC)', en: 'Full Load Current', fr: 'Courant nominal' }, value: formatNum(current, 2), unit: 'A', tone: 'warning' },
      { label: { ar: 'القدرة الكهربائية الداخلة', en: 'Input Power (P_in)', fr: 'Puissance absorbée' }, value: formatNum(pInKw, 3), unit: 'kW', tone: 'neutral' },
      { label: { ar: 'عزم الدوران (T)', en: 'Shaft Torque (T)', fr: 'Couple utile (T)' }, value: formatNum(torqueNm, 2), unit: 'N·m', tone: 'neutral' },
    ],
    steps: [
      {
        ar: `القدرة الكهربائية المسحوبة: P_in = ${formatNum(pInKw, 3)} kW (S = ${formatNum(sKva, 3)} kVA)`,
        en: `Electrical input power: P_in = ${formatNum(pInKw, 3)} kW (S = ${formatNum(sKva, 3)} kVA)`,
        fr: `Puissance électrique absorbée : P_in = ${formatNum(pInKw, 3)} kW (S = ${formatNum(sKva, 3)} kVA)`,
      },
      {
        ar: `القدرة الميكانيكية على المحور: P_mech = ${formatNum(pMechKw, 3)} kW = ${formatNum(hp, 2)} HP`,
        en: `Mechanical shaft output: P_mech = ${formatNum(pMechKw, 3)} kW = ${formatNum(hp, 2)} HP`,
        fr: `Puissance mécanique sur l’arbre : P_mech = ${formatNum(pMechKw, 3)} kW = ${formatNum(hp, 2)} HP`,
      },
      {
        ar: `العزم عند ${params.rpm} RPM: T = 9550 × ${formatNum(pMechKw, 3)} / ${params.rpm} = ${formatNum(torqueNm, 2)} N·m`,
        en: `Torque at ${params.rpm} RPM: T = 9550 × ${formatNum(pMechKw, 3)} / ${params.rpm} = ${formatNum(torqueNm, 2)} N·m`,
        fr: `Couple à ${params.rpm} tr/min : T = 9550 × ${formatNum(pMechKw, 3)} / ${params.rpm} = ${formatNum(torqueNm, 2)} N·m`,
      },
    ],
    explanation: {
      ar: 'تكتب لوحة بيانات المحرك القدرة الميكانيكية الخارجة على العمود، بينما تزيد القدرة الكهربائية المسحوبة من الشبكة بمقدار الفقد الحراري والمغناطيسي (÷ الكفاءة).',
      en: 'Motor nameplates state mechanical shaft output; electrical input power drawn from the grid is higher due to efficiency losses (P_in = P_mech / η).',
      fr: 'La plaque signalétique indique la puissance mécanique utile ; la puissance électrique absorbée est plus élevée selon le rendement η.',
    },
    assumptions,
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 14. Three Phase Power Calculator
// ───────────────────────────────────────────────────────────────────────────
export function calculateThreePhasePower(params: {
  lineVoltage: number;
  lineCurrent: number;
  powerFactor: number;
  connection: 'star' | 'delta';
}): CalculatorOutput {
  const formula = 'P = √3 × V_L × I_L × cos(φ)   |   S = √3 × V_L × I_L   |   Q = √3 × V_L × I_L × sin(φ)';
  const assumptions: LocalizedText[] = [
    {
      ar: 'نظام ثلاثي الطور متوازن (جهود وتيارات متساوية في الأطوار الثلاثة بزاوية 120°).',
      en: 'Assumes a balanced 3-phase system with equal phase magnitudes separated by 120°.',
      fr: 'Suppose un système triphasé équilibré (déphasage de 120° entre phases).',
    },
  ];

  if (
    !Number.isFinite(params.lineVoltage) ||
    !Number.isFinite(params.lineCurrent) ||
    !Number.isFinite(params.powerFactor) ||
    params.lineVoltage <= 0 ||
    params.lineCurrent < 0 ||
    params.powerFactor <= 0 ||
    params.powerFactor > 1
  ) {
    return invalidOutput(
      formula,
      {
        ar: 'أدخل جهد خط > 0، وتيار خط ≥ 0، ومعامل قدرة بين 0.01 و 1.',
        en: 'Enter Line Voltage > 0, Line Current ≥ 0, and cos(φ) between 0.01 and 1.',
        fr: 'Vérifiez : U_L > 0, I_L ≥ 0 et cos(φ) entre 0,01 et 1.',
      },
      assumptions
    );
  }

  const sVa = Math.sqrt(3) * params.lineVoltage * params.lineCurrent;
  const pW = sVa * params.powerFactor;
  const sinPhi = Math.sqrt(Math.max(0, 1 - params.powerFactor * params.powerFactor));
  const qVar = sVa * sinPhi;

  const vPhase = params.connection === 'star' ? params.lineVoltage / Math.sqrt(3) : params.lineVoltage;
  const iPhase = params.connection === 'star' ? params.lineCurrent : params.lineCurrent / Math.sqrt(3);

  return {
    valid: true,
    formula,
    metrics: [
      { label: { ar: 'القدرة الفعالة (P)', en: 'Active Power (P)', fr: 'Puissance active (P)' }, value: formatNum(pW / 1000, 3), unit: 'kW', tone: 'primary' },
      { label: { ar: 'القدرة الظاهرية (S)', en: 'Apparent Power (S)', fr: 'Puissance apparente (S)' }, value: formatNum(sVa / 1000, 3), unit: 'kVA', tone: 'neutral' },
      { label: { ar: 'القدرة الردية (Q)', en: 'Reactive Power (Q)', fr: 'Puissance réactive (Q)' }, value: formatNum(qVar / 1000, 3), unit: 'kVAR', tone: 'warning' },
      { label: { ar: 'جهد الطور (V_ph)', en: 'Phase Voltage', fr: 'Tension de phase' }, value: formatNum(vPhase, 1), unit: 'V', tone: 'success' },
      { label: { ar: 'تيار الطور (I_ph)', en: 'Phase Current', fr: 'Courant de phase' }, value: formatNum(iPhase, 2), unit: 'A', tone: 'neutral' },
    ],
    steps: [
      {
        ar: `القدرة الظاهرية: S = 1.732 × ${params.lineVoltage} × ${params.lineCurrent} = ${formatNum(sVa / 1000, 3)} kVA`,
        en: `Apparent Power: S = 1.732 × ${params.lineVoltage} × ${params.lineCurrent} = ${formatNum(sVa / 1000, 3)} kVA`,
        fr: `Puissance apparente : S = 1,732 × ${params.lineVoltage} × ${params.lineCurrent} = ${formatNum(sVa / 1000, 3)} kVA`,
      },
      {
        ar: `القدرة الفعالة: P = ${formatNum(sVa / 1000, 3)} × ${params.powerFactor} = ${formatNum(pW / 1000, 3)} kW`,
        en: `Active Power: P = ${formatNum(sVa / 1000, 3)} × ${params.powerFactor} = ${formatNum(pW / 1000, 3)} kW`,
        fr: `Puissance active : P = ${formatNum(sVa / 1000, 3)} × ${params.powerFactor} = ${formatNum(pW / 1000, 3)} kW`,
      },
      {
        ar:
          params.connection === 'star'
            ? `توصيل نجمة (Y): V_ph = V_L / √3 = ${formatNum(vPhase, 1)} V، و I_ph = I_L = ${formatNum(iPhase, 2)} A`
            : `توصيل مثلث (Δ): V_ph = V_L = ${formatNum(vPhase, 1)} V، و I_ph = I_L / √3 = ${formatNum(iPhase, 2)} A`,
        en:
          params.connection === 'star'
            ? `Star (Y): V_ph = V_L / √3 = ${formatNum(vPhase, 1)} V, I_ph = I_L = ${formatNum(iPhase, 2)} A`
            : `Delta (Δ): V_ph = V_L = ${formatNum(vPhase, 1)} V, I_ph = I_L / √3 = ${formatNum(iPhase, 2)} A`,
        fr:
          params.connection === 'star'
            ? `Étoile (Y) : V_ph = U_L / √3 = ${formatNum(vPhase, 1)} V, I_ph = I_L = ${formatNum(iPhase, 2)} A`
            : `Triangle (Δ) : V_ph = U_L = ${formatNum(vPhase, 1)} V, I_ph = I_L / √3 = ${formatNum(iPhase, 2)} A`,
      },
    ],
    explanation: {
      ar: 'في توصيل النجمة ينخفض الجهد على كل ملف بمقدار √3، بينما في المثلث يتلقى كل ملف جهد الخط كاملاً مما يعطي 3 أضعاف القدرة مقارنة بالنجمة لنفس الحمل.',
      en: 'Star reduces phase voltage by √3 for soft starting or neutral availability, whereas Delta applies full line voltage to each winding.',
      fr: 'En étoile, chaque enroulement reçoit U_L/√3 ; en triangle, il reçoit la tension composée U_L complète.',
    },
    assumptions,
    diagramData: { P: pW / 1000, Q: qVar / 1000, S: sVa / 1000, pf: params.powerFactor, connection: params.connection },
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 15. Power Factor & Correction Calculator
// ───────────────────────────────────────────────────────────────────────────
export function calculatePowerFactor(params: {
  activePowerKw: number;
  voltage: number;
  frequencyHz: number;
  currentPf: number;
  targetPf: number;
}): CalculatorOutput {
  const formula = 'Q_c = P × (tan φ₁ − tan φ₂)   |   C = Q_c / (2π × f × V²)';
  const assumptions: LocalizedText[] = [
    {
      ar: 'حمل حثي متأخر (Lagging PF)، وتُحسب السعة الإجمالية لمكثف التعويض التوافزي عند جهد ثابت وتردد نقي.',
      en: 'Assumes an inductive lagging load at fixed RMS voltage and fundamental sinusoidal frequency (no harmonic detuning reactor shown).',
      fr: 'Suppose une charge inductive sans harmoniques à tension et fréquence constantes.',
    },
  ];

  if (
    !Number.isFinite(params.activePowerKw) ||
    !Number.isFinite(params.voltage) ||
    !Number.isFinite(params.frequencyHz) ||
    !Number.isFinite(params.currentPf) ||
    !Number.isFinite(params.targetPf) ||
    params.activePowerKw <= 0 ||
    params.voltage <= 0 ||
    params.frequencyHz <= 0 ||
    params.currentPf <= 0 ||
    params.currentPf > 1 ||
    params.targetPf <= 0 ||
    params.targetPf > 1
  ) {
    return invalidOutput(
      formula,
      {
        ar: 'تأكد من أن القدرة والجهد والتردد > 0، ومعاملات القدرة بين 0.01 و 1.',
        en: 'Ensure Active Power, Voltage, Frequency > 0, and Power Factors in (0, 1].',
        fr: 'Vérifiez : P, Tension et Fréquence > 0, et cos(φ) dans ]0 ; 1].',
      },
      assumptions
    );
  }

  const phi1 = Math.acos(params.currentPf);
  const phi2 = Math.acos(params.targetPf);
  const q1 = params.activePowerKw * Math.tan(phi1);
  const q2 = params.activePowerKw * Math.tan(phi2);
  const qc = Math.max(0, q1 - q2);
  const s1 = params.activePowerKw / params.currentPf;
  const s2 = params.activePowerKw / params.targetPf;
  const currentReductionPct = ((s1 - s2) / s1) * 100;
  const cMicroFarads = ((qc * 1000) / (2 * Math.PI * params.frequencyHz * params.voltage * params.voltage)) * 1e6;

  return {
    valid: true,
    formula,
    metrics: [
      { label: { ar: 'بطارية المكثفات المطلوبة (Q_c)', en: 'Required Bank (Q_c)', fr: 'Compensation (Q_c)' }, value: formatNum(qc, 2), unit: 'kVAR', tone: 'primary' },
      { label: { ar: 'السعة المكافئة (C)', en: 'Capacitance (C)', fr: 'Capacité (C)' }, value: formatNum(cMicroFarads, 1), unit: 'µF', tone: 'success' },
      { label: { ar: 'القدرة الظاهرية قبل/بعد', en: 'Apparent S Before/After', fr: 'S Avant / Après' }, value: `${formatNum(s1, 1)} → ${formatNum(s2, 1)}`, unit: 'kVA', tone: 'neutral' },
      { label: { ar: 'وفر التيار على الشبكة', en: 'Current Reduction', fr: 'Réduction du courant' }, value: formatNum(Math.max(0, currentReductionPct), 1), unit: '%', tone: 'success' },
    ],
    steps: [
      {
        ar: `الزوايا: φ₁ = ${formatNum((phi1 * 180) / Math.PI, 1)}°، φ₂ = ${formatNum((phi2 * 180) / Math.PI, 1)}°`,
        en: `Phase angles: φ₁ = ${formatNum((phi1 * 180) / Math.PI, 1)}°, φ₂ = ${formatNum((phi2 * 180) / Math.PI, 1)}°`,
        fr: `Angles : φ₁ = ${formatNum((phi1 * 180) / Math.PI, 1)}°, φ₂ = ${formatNum((phi2 * 180) / Math.PI, 1)}°`,
      },
      {
        ar: `قدرة التعويض: Q_c = ${params.activePowerKw} × (${formatNum(Math.tan(phi1), 3)} − ${formatNum(Math.tan(phi2), 3)}) = ${formatNum(qc, 2)} kVAR`,
        en: `Required kVAR: Q_c = ${params.activePowerKw} × (${formatNum(Math.tan(phi1), 3)} − ${formatNum(Math.tan(phi2), 3)}) = ${formatNum(qc, 2)} kVAR`,
        fr: `Puissance réactive requise : Q_c = ${formatNum(qc, 2)} kVAR`,
      },
      {
        ar: `السعة المطلوبة عند ${params.voltage} V و ${params.frequencyHz} Hz: C = ${formatNum(cMicroFarads, 1)} µF`,
        en: `Equivalent capacitance at ${params.voltage} V / ${params.frequencyHz} Hz: C = ${formatNum(cMicroFarads, 1)} µF`,
        fr: `Capacité à ${params.voltage} V / ${params.frequencyHz} Hz : C = ${formatNum(cMicroFarads, 1)} µF`,
      },
    ],
    explanation: {
      ar: 'تحسين معامل القدرة باستخدام المكثفات يعوّض القدرة الردية للمحركات، مما يخفض التيار المسحوب ويقلل فواقد الكابلات والغرامات.',
      en: 'Power factor correction capacitors supply reactive current locally, lowering line current, transformer loading, and utility penalties.',
      fr: 'Les batteries de condensateurs compensent l’énergie réactive des moteurs, réduisant le courant en ligne et les pénalités.',
    },
    assumptions,
    diagramData: { P: params.activePowerKw, q1, q2, qc, s1, s2 },
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 16. Solar Panel Sizing Calculator
// ───────────────────────────────────────────────────────────────────────────
export function calculateSolarPanel(params: {
  dailyEnergyWh: number;
  peakSunHours: number;
  systemEfficiencyPct: number;
  panelWattPeak: number;
}): CalculatorOutput {
  const formula = 'P_PV = E_day / (PSH × η_sys)   |   N_panels = ⌈P_PV / P_panel⌉';
  const assumptions: LocalizedText[] = [
    {
      ar: 'تقدير متوسط طوال السنة باستخدام ساعات الذروة الشمسية (PSH) ومعامل فقد كلي (العاكس، الكابلات، الحرارة، الغبار).',
      en: 'Annualized daily estimate using Peak Sun Hours (PSH) and combined derating factor (inverter, wiring, heat, soiling).',
      fr: 'Estimation moyenne basée sur les heures d’ensoleillement de pointe (PSH) et les pertes globales du système.',
    },
  ];

  const eta = params.systemEfficiencyPct / 100;
  if (
    !Number.isFinite(params.dailyEnergyWh) ||
    !Number.isFinite(params.peakSunHours) ||
    !Number.isFinite(eta) ||
    !Number.isFinite(params.panelWattPeak) ||
    params.dailyEnergyWh <= 0 ||
    params.peakSunHours <= 0 ||
    params.peakSunHours > 12 ||
    eta <= 0.2 ||
    eta > 1 ||
    params.panelWattPeak <= 0
  ) {
    return invalidOutput(
      formula,
      {
        ar: 'تأكد من الطاقة اليومية (>0)، ساعات الشمس (0.1–12)، الكفاءة (21–100%)، وقدرة اللوح (>0 Wp).',
        en: 'Verify Daily Energy > 0, Peak Sun Hours (0.1–12), Efficiency (21–100%), and Panel Wattage > 0.',
        fr: 'Vérifiez : Énergie > 0, PSH (0,1–12 h), Rendement (21–100 %) et Puissance panneau > 0.',
      },
      assumptions
    );
  }

  const requiredWp = params.dailyEnergyWh / (params.peakSunHours * eta);
  const panelCount = Math.ceil(requiredWp / params.panelWattPeak);
  const installedWp = panelCount * params.panelWattPeak;
  const estDailyKwh = (installedWp * params.peakSunHours * eta) / 1000;

  return {
    valid: true,
    formula,
    metrics: [
      { label: { ar: 'عدد الألواح المطلوب', en: 'Panels Required', fr: 'Nombre de panneaux' }, value: `${panelCount}`, unit: 'pcs', tone: 'primary' },
      { label: { ar: 'القدرة المطلوبة للمصفوفة', en: 'Required Array', fr: 'Puissance requise' }, value: formatNum(requiredWp, 0), unit: 'Wp', tone: 'neutral' },
      { label: { ar: 'القدرة الفعلية المركّبة', en: 'Installed Array', fr: 'Puissance installée' }, value: formatNum(installedWp / 1000, 2), unit: 'kWp', tone: 'success' },
      { label: { ar: 'الإنتاج اليومي المتوقع', en: 'Expected Daily Yield', fr: 'Production estimée' }, value: formatNum(estDailyKwh, 2), unit: 'kWh/day', tone: 'success' },
    ],
    steps: [
      {
        ar: `القدرة الشمسية المطلوبة: P_PV = ${params.dailyEnergyWh} / (${params.peakSunHours} × ${formatNum(eta, 2)}) = ${formatNum(requiredWp, 1)} Wp`,
        en: `Required PV wattage: P_PV = ${params.dailyEnergyWh} / (${params.peakSunHours} × ${formatNum(eta, 2)}) = ${formatNum(requiredWp, 1)} Wp`,
        fr: `Puissance PV requise : P_PV = ${params.dailyEnergyWh} / (${params.peakSunHours} × ${formatNum(eta, 2)}) = ${formatNum(requiredWp, 1)} Wp`,
      },
      {
        ar: `عدد الألواح (${params.panelWattPeak} Wp): ${formatNum(requiredWp / params.panelWattPeak, 2)} → تقريب للأعلى = ${panelCount} ألواح`,
        en: `Panel count (${params.panelWattPeak} Wp each): ${formatNum(requiredWp / params.panelWattPeak, 2)} → rounded up = ${panelCount} panels`,
        fr: `Nombre de panneaux (${params.panelWattPeak} Wc) : arrondi supérieur = ${panelCount} panneaux`,
      },
    ],
    explanation: {
      ar: 'يتم تقسيم الاستهلاك اليومي على ساعات الذروة الشمسية مع التعويض عن فواقد الحرارة والعاكس والكابلات لضمان تغطية الحمل.',
      en: 'Daily energy demand is divided by Peak Sun Hours and system efficiency to size the PV array reliably despite heat and conversion losses.',
      fr: 'La demande journalière est divisée par le PSH et le rendement global pour compenser les pertes thermiques et de conversion.',
    },
    assumptions,
    engineeringDisclaimer: GENERAL_DISCLAIMER,
    diagramData: { panelCount, installedWp, estDailyKwh },
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 17. Battery Capacity Calculator
// ───────────────────────────────────────────────────────────────────────────
export function calculateBatteryCapacity(params: {
  dailyEnergyWh: number;
  autonomyDays: number;
  systemVoltage: number;
  dodPct: number;
  inverterEfficiencyPct: number;
}): CalculatorOutput {
  const formula = 'C_Ah = (E_day × Days) / (V_sys × DoD × η_inv)';
  const assumptions: LocalizedText[] = [
    {
      ar: 'معدل عمق التفريغ (DoD) يعتمد على كيمياء البطارية (50% للرصاص-حمض، و80% لبطاريات LiFePO₄ عند 25°C).',
      en: 'Recommended DoD depends on chemistry (~50% Lead-Acid, ~80% LiFePO₄ at 25°C). Cold temperatures reduce usable Ah.',
      fr: 'La profondeur de décharge dépend de la technologie (~50 % Plomb, ~80 % LiFePO₄ à 25 °C).',
    },
  ];

  const dod = params.dodPct / 100;
  const invEta = params.inverterEfficiencyPct / 100;
  if (
    !Number.isFinite(params.dailyEnergyWh) ||
    !Number.isFinite(params.autonomyDays) ||
    !Number.isFinite(params.systemVoltage) ||
    !Number.isFinite(dod) ||
    !Number.isFinite(invEta) ||
    params.dailyEnergyWh <= 0 ||
    params.autonomyDays <= 0 ||
    params.systemVoltage <= 0 ||
    dod <= 0.05 ||
    dod > 1 ||
    invEta <= 0.3 ||
    invEta > 1
  ) {
    return invalidOutput(
      formula,
      {
        ar: 'تأكد من أن الطاقة والأيام والجهد > 0، و DoD بين 10–100%، وكفاءة العاكس بين 35–100%.',
        en: 'Verify Energy, Days, and Voltage > 0, DoD (10–100%), and Inverter Efficiency (35–100%).',
        fr: 'Vérifiez : Énergie, Jours et Tension > 0, DoD (10–100 %) et Rendement (35–100 %).',
      },
      assumptions
    );
  }

  const usableWh = params.dailyEnergyWh * params.autonomyDays;
  const grossWh = usableWh / (dod * invEta);
  const requiredAh = grossWh / params.systemVoltage;

  return {
    valid: true,
    formula,
    metrics: [
      { label: { ar: 'السعة المطلوبة (Ah)', en: 'Required Capacity', fr: 'Capacité requise' }, value: formatNum(requiredAh, 1), unit: 'Ah', tone: 'primary' },
      { label: { ar: 'الطاقة الإجمالية للبنك', en: 'Gross Bank Energy', fr: 'Énergie brute' }, value: formatNum(grossWh / 1000, 2), unit: 'kWh', tone: 'neutral' },
      { label: { ar: 'الطاقة الصافية القابلة للاستخدام', en: 'Usable Energy', fr: 'Énergie utile' }, value: formatNum(usableWh / 1000, 2), unit: 'kWh', tone: 'success' },
    ],
    steps: [
      {
        ar: `الطاقة الصافية المطلوبة (${params.autonomyDays} يوم): ${params.dailyEnergyWh} × ${params.autonomyDays} = ${formatNum(usableWh, 0)} Wh`,
        en: `Required usable energy (${params.autonomyDays} days): ${params.dailyEnergyWh} × ${params.autonomyDays} = ${formatNum(usableWh, 0)} Wh`,
        fr: `Énergie utile (${params.autonomyDays} j) : ${params.dailyEnergyWh} × ${params.autonomyDays} = ${formatNum(usableWh, 0)} Wh`,
      },
      {
        ar: `الطاقة الإجمالية مع مراعاة DoD (${params.dodPct}%) وكفاءة العاكس (${params.inverterEfficiencyPct}%): ${formatNum(grossWh, 0)} Wh`,
        en: `Gross energy accounting for DoD (${params.dodPct}%) & inverter (${params.inverterEfficiencyPct}%): ${formatNum(grossWh, 0)} Wh`,
        fr: `Énergie brute avec DoD (${params.dodPct} %) et onduleur (${params.inverterEfficiencyPct} %) : ${formatNum(grossWh, 0)} Wh`,
      },
      {
        ar: `السعة بالأمبير-ساعة عند ${params.systemVoltage} V: C = ${formatNum(grossWh, 0)} / ${params.systemVoltage} = ${formatNum(requiredAh, 1)} Ah`,
        en: `Capacity at ${params.systemVoltage} V: C = ${formatNum(grossWh, 0)} / ${params.systemVoltage} = ${formatNum(requiredAh, 1)} Ah`,
        fr: `Capacité sous ${params.systemVoltage} V : C = ${formatNum(grossWh, 0)} / ${params.systemVoltage} = ${formatNum(requiredAh, 1)} Ah`,
      },
    ],
    explanation: {
      ar: 'لا يجب تفريغ البطاريات بالكامل للحفاظ على عمرها التشغيلي؛ لذا تُقسم الطاقة المطلوبة على عمق التفريغ المسموح وكفاءة العاكس.',
      en: 'To protect cycle life, batteries should not be 100% discharged; usable energy is scaled up by DoD and inverter efficiency.',
      fr: 'Pour préserver la durée de vie, on évite la décharge totale en dimensionnant selon la DoD et le rendement de l’onduleur.',
    },
    assumptions,
    engineeringDisclaimer: GENERAL_DISCLAIMER,
    diagramData: { requiredAh, voltage: params.systemVoltage, dodPct: params.dodPct },
  };
}

// ───────────────────────────────────────────────────────────────────────────
// 18. Electrical Unit Converter
// ───────────────────────────────────────────────────────────────────────────
export type ConverterQuantity =
  | 'voltage'
  | 'current'
  | 'resistance'
  | 'capacitance'
  | 'power'
  | 'energy'
  | 'frequency'
  | 'wire';

export const CONVERTER_UNITS: Record<
  ConverterQuantity,
  { id: string; label: string; toBase: (v: number) => number; fromBase: (b: number) => number }[]
> = {
  voltage: [
    { id: 'uV', label: 'µV', toBase: (v) => v * 1e-6, fromBase: (b) => b / 1e-6 },
    { id: 'mV', label: 'mV', toBase: (v) => v * 1e-3, fromBase: (b) => b / 1e-3 },
    { id: 'V', label: 'V', toBase: (v) => v, fromBase: (b) => b },
    { id: 'kV', label: 'kV', toBase: (v) => v * 1e3, fromBase: (b) => b / 1e3 },
  ],
  current: [
    { id: 'uA', label: 'µA', toBase: (v) => v * 1e-6, fromBase: (b) => b / 1e-6 },
    { id: 'mA', label: 'mA', toBase: (v) => v * 1e-3, fromBase: (b) => b / 1e-3 },
    { id: 'A', label: 'A', toBase: (v) => v, fromBase: (b) => b },
    { id: 'kA', label: 'kA', toBase: (v) => v * 1e3, fromBase: (b) => b / 1e3 },
  ],
  resistance: [
    { id: 'mOhm', label: 'mΩ', toBase: (v) => v * 1e-3, fromBase: (b) => b / 1e-3 },
    { id: 'Ohm', label: 'Ω', toBase: (v) => v, fromBase: (b) => b },
    { id: 'kOhm', label: 'kΩ', toBase: (v) => v * 1e3, fromBase: (b) => b / 1e3 },
    { id: 'MOhm', label: 'MΩ', toBase: (v) => v * 1e6, fromBase: (b) => b / 1e6 },
  ],
  capacitance: [
    { id: 'pF', label: 'pF', toBase: (v) => v * 1e-12, fromBase: (b) => b / 1e-12 },
    { id: 'nF', label: 'nF', toBase: (v) => v * 1e-9, fromBase: (b) => b / 1e-9 },
    { id: 'uF', label: 'µF', toBase: (v) => v * 1e-6, fromBase: (b) => b / 1e-6 },
    { id: 'mF', label: 'mF', toBase: (v) => v * 1e-3, fromBase: (b) => b / 1e-3 },
    { id: 'F', label: 'F', toBase: (v) => v, fromBase: (b) => b },
  ],
  power: [
    { id: 'mW', label: 'mW', toBase: (v) => v * 1e-3, fromBase: (b) => b / 1e-3 },
    { id: 'W', label: 'W', toBase: (v) => v, fromBase: (b) => b },
    { id: 'kW', label: 'kW', toBase: (v) => v * 1e3, fromBase: (b) => b / 1e3 },
    { id: 'HP', label: 'HP (745.7W)', toBase: (v) => v * 745.699872, fromBase: (b) => b / 745.699872 },
    { id: 'MW', label: 'MW', toBase: (v) => v * 1e6, fromBase: (b) => b / 1e6 },
  ],
  energy: [
    { id: 'J', label: 'J (Ws)', toBase: (v) => v, fromBase: (b) => b },
    { id: 'Wh', label: 'Wh', toBase: (v) => v * 3600, fromBase: (b) => b / 3600 },
    { id: 'kWh', label: 'kWh', toBase: (v) => v * 3.6e6, fromBase: (b) => b / 3.6e6 },
    { id: 'BTU', label: 'BTU', toBase: (v) => v * 1055.05585, fromBase: (b) => b / 1055.05585 },
  ],
  frequency: [
    { id: 'Hz', label: 'Hz', toBase: (v) => v, fromBase: (b) => b },
    { id: 'kHz', label: 'kHz', toBase: (v) => v * 1e3, fromBase: (b) => b / 1e3 },
    { id: 'MHz', label: 'MHz', toBase: (v) => v * 1e6, fromBase: (b) => b / 1e6 },
    { id: 'GHz', label: 'GHz', toBase: (v) => v * 1e9, fromBase: (b) => b / 1e9 },
  ],
  wire: [
    {
      id: 'mm2',
      label: 'mm²',
      toBase: (v) => v,
      fromBase: (b) => b,
    },
    {
      id: 'AWG',
      label: 'AWG',
      // Base unit is mm²: A = (π/4) * (0.127 * 92^((36 - AWG)/39))^2
      toBase: (awg) => {
        const d = 0.127 * Math.pow(92, (36 - awg) / 39);
        return (Math.PI / 4) * d * d;
      },
      fromBase: (mm2) => {
        const d = Math.sqrt((4 * mm2) / Math.PI);
        return 36 - (39 * Math.log(d / 0.127)) / Math.log(92);
      },
    },
  ],
};

export function calculateUnitConversion(params: {
  quantity: ConverterQuantity;
  value: number;
  fromUnit: string;
  toUnit: string;
}): CalculatorOutput {
  const formula =
    params.quantity === 'wire'
      ? 'd_mm = 0.127 × 92^((36 − AWG)/39)   |   A_mm² = (π/4) × d²'
      : 'Value_out = Value_in × (Factor_in / Factor_out)';

  const assumptions: LocalizedText[] = [
    {
      ar: 'تحويلات دقيقة حسب النظام الدولي للوحدات (SI)؛ 1 حصان ميكانيكي = 745.7 واط.',
      en: 'Exact SI prefix conversions; 1 mechanical HP = 745.7 W; AWG formula covers solid round conductors.',
      fr: 'Conversions SI exactes ; 1 HP mécanique = 745,7 W ; la formule AWG s’applique aux conducteurs ronds.',
    },
  ];

  const units = CONVERTER_UNITS[params.quantity];
  const fromDef = units.find((u) => u.id === params.fromUnit) ?? units[0];
  const toDef = units.find((u) => u.id === params.toUnit) ?? units[1] ?? units[0];

  if (!Number.isFinite(params.value) || (params.quantity === 'wire' && fromDef.id === 'mm2' && params.value <= 0)) {
    return invalidOutput(
      formula,
      {
        ar: 'أدخل قيمة عددية صالحة للتحويل (ومقطعاً > 0 عند التحويل من mm²).',
        en: 'Enter a valid numeric value (and cross-section > 0 when converting from mm²).',
        fr: 'Saisissez une valeur numérique valide (section > 0 pour mm²).',
      },
      assumptions
    );
  }

  const baseVal = fromDef.toBase(params.value);
  const converted = toDef.fromBase(baseVal);

  const metrics = [
    {
      label: { ar: `النتيجة (${toDef.label})`, en: `Converted (${toDef.label})`, fr: `Résultat (${toDef.label})` },
      value: formatNum(converted, 4),
      unit: toDef.label,
      tone: 'primary' as const,
    },
    ...units
      .filter((u) => u.id !== toDef.id)
      .slice(0, 3)
      .map((u) => ({
        label: { ar: u.label, en: u.label, fr: u.label },
        value: formatNum(u.fromBase(baseVal), 4),
        unit: u.label,
        tone: 'neutral' as const,
      })),
  ];

  return {
    valid: true,
    formula,
    metrics,
    steps: [
      {
        ar: `المدخل: ${formatNum(params.value, 4)} ${fromDef.label} = ${formatNum(baseVal, 6)} بالوحدة المرجعية`,
        en: `Input: ${formatNum(params.value, 4)} ${fromDef.label} = ${formatNum(baseVal, 6)} in base SI unit`,
        fr: `Entrée : ${formatNum(params.value, 4)} ${fromDef.label} = ${formatNum(baseVal, 6)} en unité de base SI`,
      },
      {
        ar: `التحويل إلى ${toDef.label}: ${formatNum(converted, 4)} ${toDef.label}`,
        en: `Converted to ${toDef.label}: ${formatNum(converted, 4)} ${toDef.label}`,
        fr: `Converti en ${toDef.label} : ${formatNum(converted, 4)} ${toDef.label}`,
      },
    ],
    explanation: {
      ar: 'يسمح محول الوحدات بالانتقال السريع بين البادئات الكهربائية (µ، m، k، M) وكذلك بين مقاطع الأسلاك القياسية (mm² و AWG).',
      en: 'Quickly convert across SI engineering prefixes (µ, m, k, M), mechanical horsepower, and AWG-to-mm² conductor gauges.',
      fr: 'Convertissez rapidement entre préfixes SI (µ, m, k, M), chevaux mécaniques (HP) et calibres de fils AWG / mm².',
    },
    assumptions,
  };
}
