import type { CalculatorId, CalculatorOutput } from '../types/electronics';

interface CalculatorDiagramProps {
  calculatorId: CalculatorId;
  output: CalculatorOutput;
}

export function CalculatorDiagram({ calculatorId, output }: CalculatorDiagramProps) {
  const data = output.diagramData ?? {};

  switch (calculatorId) {
    case 'ohms-law': {
      const v = typeof data.V === 'number' ? data.V.toFixed(1) : 'V';
      const i = typeof data.I === 'number' ? data.I.toFixed(2) : 'I';
      const r = typeof data.R === 'number' ? data.R.toFixed(1) : 'R';
      return (
        <svg viewBox="0 0 320 150" className="w-full h-40" aria-hidden="true">
          <polygon
            points="160,16 74,132 246,132"
            fill="none"
            stroke="var(--schematic-accent)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line x1="115" y1="78" x2="205" y2="78" stroke="var(--schematic-ink)" strokeWidth="2" />
          <line x1="160" y1="78" x2="160" y2="132" stroke="var(--schematic-ink)" strokeWidth="2" />
          <text x="160" y="60" textAnchor="middle" fill="var(--schematic-accent)" fontSize="15" fontWeight="bold" fontFamily="monospace">
            V = {v}V
          </text>
          <text x="128" y="114" textAnchor="middle" fill="var(--schematic-ink)" fontSize="13" fontWeight="bold" fontFamily="monospace">
            I = {i}A
          </text>
          <text x="195" y="114" textAnchor="middle" fill="var(--schematic-ink)" fontSize="13" fontWeight="bold" fontFamily="monospace">
            R = {r}Ω
          </text>
        </svg>
      );
    }

    case 'resistor-color': {
      const colors = Array.isArray(data.colors) ? (data.colors as string[]) : ['#DC2626', '#7C3AED', '#EA580C', '#D97706'];
      const label = typeof data.label === 'string' ? data.label : '27 kΩ ±5%';
      const isFive = colors.length === 5;
      const bandPositions = isFive ? [102, 124, 146, 174, 212] : [108, 134, 168, 212];
      return (
        <svg viewBox="0 0 320 130" className="w-full h-36" aria-hidden="true">
          <line x1="20" y1="54" x2="80" y2="54" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
          <line x1="240" y1="54" x2="300" y2="54" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
          <path
            d="M78,34 C78,28 92,28 102,32 L218,32 C228,28 242,28 242,34 L242,74 C242,80 228,80 218,76 L102,76 C92,80 78,80 78,74 Z"
            fill="#E7C99B"
            stroke="#92400E"
            strokeWidth="2"
          />
          {colors.map((hex, idx) => (
            <rect
              key={`${idx}-${hex}`}
              x={bandPositions[idx] ?? 108 + idx * 24}
              y="31"
              width="12"
              height="46"
              rx="1.5"
              fill={hex}
              stroke="#0F172A"
              strokeWidth="0.8"
            />
          ))}
          <text x="160" y="112" textAnchor="middle" fill="var(--schematic-accent)" fontSize="14" fontWeight="bold" fontFamily="monospace">
            {label}
          </text>
        </svg>
      );
    }

    case 'series-resistance': {
      const label = typeof data.rEqLabel === 'string' ? data.rEqLabel : 'R_eq';
      return (
        <svg viewBox="0 0 320 130" className="w-full h-36" aria-hidden="true">
          <line x1="22" y1="62" x2="54" y2="62" stroke="var(--schematic-ink)" strokeWidth="2.5" />
          <rect x="54" y="48" width="46" height="28" rx="3" fill="none" stroke="var(--schematic-accent)" strokeWidth="2.2" />
          <text x="77" y="66" textAnchor="middle" fill="var(--schematic-ink)" fontSize="11" fontFamily="monospace">R₁</text>
          <line x1="100" y1="62" x2="132" y2="62" stroke="var(--schematic-ink)" strokeWidth="2.5" />
          <rect x="132" y="48" width="46" height="28" rx="3" fill="none" stroke="var(--schematic-accent)" strokeWidth="2.2" />
          <text x="155" y="66" textAnchor="middle" fill="var(--schematic-ink)" fontSize="11" fontFamily="monospace">R₂</text>
          <line x1="178" y1="62" x2="210" y2="62" stroke="var(--schematic-ink)" strokeWidth="2.5" />
          <rect x="210" y="48" width="46" height="28" rx="3" fill="none" stroke="var(--schematic-accent)" strokeWidth="2.2" />
          <text x="233" y="66" textAnchor="middle" fill="var(--schematic-ink)" fontSize="11" fontFamily="monospace">Rₙ</text>
          <line x1="256" y1="62" x2="298" y2="62" stroke="var(--schematic-ink)" strokeWidth="2.5" />
          <text x="160" y="108" textAnchor="middle" fill="var(--schematic-accent)" fontSize="13" fontWeight="bold" fontFamily="monospace">
            R_eq = {label}
          </text>
        </svg>
      );
    }

    case 'parallel-resistance': {
      const label = typeof data.rEqLabel === 'string' ? data.rEqLabel : 'R_eq';
      return (
        <svg viewBox="0 0 320 140" className="w-full h-36" aria-hidden="true">
          <line x1="30" y1="70" x2="80" y2="70" stroke="var(--schematic-ink)" strokeWidth="2.5" />
          <line x1="240" y1="70" x2="290" y2="70" stroke="var(--schematic-ink)" strokeWidth="2.5" />
          <line x1="80" y1="28" x2="80" y2="112" stroke="var(--schematic-ink)" strokeWidth="2.5" />
          <line x1="240" y1="28" x2="240" y2="112" stroke="var(--schematic-ink)" strokeWidth="2.5" />
          {[28, 70, 112].map((y, idx) => (
            <g key={y}>
              <line x1="80" y1={y} x2="128" y2={y} stroke="var(--schematic-ink)" strokeWidth="2" />
              <rect x="128" y={y - 11} width="64" height="22" rx="3" fill="none" stroke="var(--schematic-accent)" strokeWidth="2" />
              <text x="160" y={y + 4} textAnchor="middle" fill="var(--schematic-ink)" fontSize="11" fontFamily="monospace">
                {idx === 2 ? 'Rₙ' : `R${idx + 1}`}
              </text>
              <line x1="192" y1={y} x2="240" y2={y} stroke="var(--schematic-ink)" strokeWidth="2" />
            </g>
          ))}
          <text x="160" y="135" textAnchor="middle" fill="var(--schematic-accent)" fontSize="12" fontWeight="bold" fontFamily="monospace">
            R_eq = {label}
          </text>
        </svg>
      );
    }

    case 'voltage-divider': {
      const vin = typeof data.vin === 'number' ? data.vin.toFixed(1) : 'Vin';
      const vOut = typeof data.vOut === 'number' ? data.vOut.toFixed(2) : 'Vout';
      return (
        <svg viewBox="0 0 320 155" className="w-full h-40" aria-hidden="true">
          <circle cx="96" cy="20" r="4" fill="var(--schematic-accent)" />
          <text x="78" y="24" textAnchor="end" fill="var(--schematic-ink)" fontSize="11" fontFamily="monospace">Vin={vin}V</text>
          <line x1="96" y1="24" x2="96" y2="38" stroke="var(--schematic-ink)" strokeWidth="2" />
          <rect x="82" y="38" width="28" height="32" rx="3" fill="none" stroke="var(--schematic-accent)" strokeWidth="2" />
          <text x="96" y="58" textAnchor="middle" fill="var(--schematic-ink)" fontSize="11" fontFamily="monospace">R₁</text>
          <line x1="96" y1="70" x2="96" y2="90" stroke="var(--schematic-ink)" strokeWidth="2" />
          <line x1="96" y1="80" x2="210" y2="80" stroke="var(--schematic-accent)" strokeWidth="2.5" />
          <circle cx="210" cy="80" r="4" fill="var(--schematic-accent)" />
          <text x="220" y="84" fill="var(--schematic-accent)" fontSize="12" fontWeight="bold" fontFamily="monospace">Vout={vOut}V</text>
          <rect x="82" y="90" width="28" height="32" rx="3" fill="none" stroke="var(--schematic-accent)" strokeWidth="2" />
          <text x="96" y="110" textAnchor="middle" fill="var(--schematic-ink)" fontSize="11" fontFamily="monospace">R₂</text>
          <line x1="96" y1="122" x2="96" y2="138" stroke="var(--schematic-ink)" strokeWidth="2" />
          <line x1="80" y1="138" x2="112" y2="138" stroke="var(--schematic-ink)" strokeWidth="2.5" />
          <line x1="86" y1="143" x2="106" y2="143" stroke="var(--schematic-ink)" strokeWidth="2" />
        </svg>
      );
    }

    case 'capacitor': {
      const tauLabel = typeof data.tauLabel === 'string' ? data.tauLabel : 'τ = RC';
      return (
        <svg viewBox="0 0 320 145" className="w-full h-36" aria-hidden="true">
          <line x1="40" y1="120" x2="290" y2="120" stroke="var(--schematic-muted)" strokeWidth="1.5" />
          <line x1="40" y1="20" x2="40" y2="120" stroke="var(--schematic-muted)" strokeWidth="1.5" />
          <line x1="40" y1="26" x2="285" y2="26" stroke="var(--schematic-muted)" strokeWidth="1" strokeDasharray="4 4" />
          <path
            d="M40,120 C80,60 140,34 285,27"
            fill="none"
            stroke="var(--schematic-accent)"
            strokeWidth="3"
          />
          <circle cx="90" cy="61" r="4" fill="#22C55E" />
          <line x1="90" y1="61" x2="90" y2="120" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="3 3" />
          <text x="94" y="112" fill="#22C55E" fontSize="10" fontFamily="monospace">1τ (63.2%)</text>
          <text x="250" y="42" fill="var(--schematic-ink)" fontSize="10" fontFamily="monospace">5τ (99.3%)</text>
          <text x="165" y="136" textAnchor="middle" fill="var(--schematic-accent)" fontSize="11" fontWeight="bold" fontFamily="monospace">
            {tauLabel}
          </text>
        </svg>
      );
    }

    case 'voltage-drop':
    case 'cable-size': {
      const pct = typeof data.pct === 'number' ? data.pct : typeof data.dropPct === 'number' ? data.dropPct : 2.5;
      const barColor = pct <= 3 ? '#22C55E' : pct <= 5 ? '#F59E0B' : '#EF4444';
      const clampedW = Math.min(200, Math.max(12, pct * 22));
      return (
        <svg viewBox="0 0 320 135" className="w-full h-36" aria-hidden="true">
          <rect x="20" y="24" width="60" height="40" rx="6" fill="none" stroke="var(--schematic-accent)" strokeWidth="2" />
          <text x="50" y="48" textAnchor="middle" fill="var(--schematic-ink)" fontSize="11" fontFamily="monospace">SOURCE</text>
          <line x1="80" y1="44" x2="236" y2="44" stroke="var(--schematic-ink)" strokeWidth="3.5" />
          <text x="158" y="34" textAnchor="middle" fill="var(--schematic-muted)" fontSize="10" fontFamily="monospace">L (m) · S (mm²)</text>
          <rect x="236" y="24" width="64" height="40" rx="6" fill="none" stroke={barColor} strokeWidth="2" />
          <text x="268" y="48" textAnchor="middle" fill="var(--schematic-ink)" fontSize="11" fontFamily="monospace">LOAD</text>
          <rect x="60" y="88" width="200" height="14" rx="7" fill="var(--schematic-ring)" fillOpacity="0.35" />
          <rect x="60" y="88" width={clampedW} height="14" rx="7" fill={barColor} />
          <text x="160" y="122" textAnchor="middle" fill={barColor} fontSize="12" fontWeight="bold" fontFamily="monospace">
            ΔV = {pct.toFixed(2)}%
          </text>
        </svg>
      );
    }

    case 'transformer': {
      const vp = typeof data.vp === 'number' ? data.vp : 230;
      const vs = typeof data.vs === 'number' ? data.vs : 24;
      return (
        <svg viewBox="0 0 320 140" className="w-full h-36" aria-hidden="true">
          <path d="M90,28 C108,28 108,46 90,46 C108,46 108,64 90,64 C108,64 108,82 90,82 C108,82 108,100 90,100" fill="none" stroke="var(--schematic-accent)" strokeWidth="2.8" />
          <line x1="154" y1="22" x2="154" y2="106" stroke="var(--schematic-ink)" strokeWidth="3" />
          <line x1="164" y1="22" x2="164" y2="106" stroke="var(--schematic-ink)" strokeWidth="3" />
          <path d="M228,36 C210,36 210,56 228,56 C210,56 210,76 228,76 C210,76 210,96 228,96" fill="none" stroke="#22C55E" strokeWidth="2.8" />
          <text x="58" y="68" textAnchor="middle" fill="var(--schematic-accent)" fontSize="12" fontWeight="bold" fontFamily="monospace">{vp}V</text>
          <text x="262" y="68" textAnchor="middle" fill="#22C55E" fontSize="12" fontWeight="bold" fontFamily="monospace">{vs}V</text>
          <text x="160" y="128" textAnchor="middle" fill="var(--schematic-muted)" fontSize="11" fontFamily="monospace">Vp / Vs = Np / Ns</text>
        </svg>
      );
    }

    case 'electrical-power':
    case 'three-phase-power':
    case 'power-factor': {
      const p = typeof data.P === 'number' ? data.P.toFixed(1) : 'P';
      const q = typeof data.Q === 'number' ? data.Q.toFixed(1) : typeof data.q1 === 'number' ? data.q1.toFixed(1) : 'Q';
      const s = typeof data.S === 'number' ? data.S.toFixed(1) : typeof data.s1 === 'number' ? data.s1.toFixed(1) : 'S';
      return (
        <svg viewBox="0 0 320 145" className="w-full h-36" aria-hidden="true">
          <polygon
            points="60,115 245,115 245,28"
            fill="none"
            stroke="var(--schematic-accent)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <text x="152" y="132" textAnchor="middle" fill="#22C55E" fontSize="12" fontWeight="bold" fontFamily="monospace">
            P = {p}
          </text>
          <text x="255" y="75" fill="#F59E0B" fontSize="12" fontWeight="bold" fontFamily="monospace">
            Q = {q}
          </text>
          <text x="135" y="62" textAnchor="middle" fill="var(--schematic-accent)" fontSize="12" fontWeight="bold" fontFamily="monospace">
            S = {s}
          </text>
        </svg>
      );
    }

    case 'solar-panel':
    case 'battery-capacity': {
      return (
        <svg viewBox="0 0 320 135" className="w-full h-36" aria-hidden="true">
          <rect x="20" y="34" width="66" height="50" rx="5" fill="#1E3A8A" stroke="var(--schematic-accent)" strokeWidth="2" />
          <line x1="42" y1="34" x2="42" y2="84" stroke="#60A5FA" strokeWidth="1" />
          <line x1="64" y1="34" x2="64" y2="84" stroke="#60A5FA" strokeWidth="1" />
          <line x1="20" y1="59" x2="86" y2="59" stroke="#60A5FA" strokeWidth="1" />
          <text x="53" y="102" textAnchor="middle" fill="var(--schematic-ink)" fontSize="10" fontFamily="monospace">PV ARRAY</text>
          <line x1="86" y1="59" x2="124" y2="59" stroke="var(--schematic-accent)" strokeWidth="2.5" />
          <rect x="124" y="38" width="72" height="42" rx="5" fill="none" stroke="#F59E0B" strokeWidth="2" />
          <text x="160" y="63" textAnchor="middle" fill="var(--schematic-ink)" fontSize="10" fontWeight="bold" fontFamily="monospace">MPPT / INV</text>
          <line x1="196" y1="59" x2="234" y2="59" stroke="#22C55E" strokeWidth="2.5" />
          <rect x="234" y="36" width="64" height="46" rx="5" fill="none" stroke="#22C55E" strokeWidth="2" />
          <text x="266" y="63" textAnchor="middle" fill="#22C55E" fontSize="11" fontWeight="bold" fontFamily="monospace">BATT Ah</text>
        </svg>
      );
    }

    default:
      return (
        <svg viewBox="0 0 320 120" className="w-full h-32" aria-hidden="true">
          <rect x="30" y="22" width="260" height="76" rx="8" fill="none" stroke="var(--schematic-accent)" strokeWidth="2" strokeDasharray="5 4" />
          <text x="160" y="56" textAnchor="middle" fill="var(--schematic-accent)" fontSize="13" fontWeight="bold" fontFamily="monospace">
            {output.formula.split('|')[0].trim()}
          </text>
          <text x="160" y="80" textAnchor="middle" fill="var(--schematic-muted)" fontSize="11" fontFamily="monospace">
            SI Engineering Verified Model
          </text>
        </svg>
      );
  }
}
