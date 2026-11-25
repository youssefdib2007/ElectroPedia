import type { SymbolStandard } from '../types/electronics';

interface SymbolSvgRendererProps {
  svgKey: string;
  standard: SymbolStandard;
  className?: string;
}

const INK = 'var(--schematic-ink)';
const ACCENT = 'var(--schematic-accent)';
const CTRL = 'var(--schematic-ctrl)';
const EARTH = 'var(--schematic-earth)';
const MUTED = 'var(--schematic-muted)';

export function SymbolSvgRenderer({ svgKey, standard, className = 'w-full h-full' }: SymbolSvgRendererProps) {
  const isAnsi = standard === 'ansi';

  const renderShape = () => {
    switch (svgKey) {
      case 'light_switch':
        if (isAnsi) {
          return (
            <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="25" y1="60" x2="68" y2="60" />
              <circle cx="71" cy="60" r="4" fill={ACCENT} stroke={ACCENT} />
              <line x1="74" y1="58" x2="128" y2="34" stroke={ACCENT} strokeWidth="2.6" />
              <circle cx="131" cy="60" r="4" fill="none" stroke={INK} />
              <line x1="135" y1="60" x2="175" y2="60" />
              <text x="100" y="96" textAnchor="middle" fill={MUTED} stroke="none" fontSize="11" fontFamily="monospace">SPST</text>
            </g>
          );
        }
        return (
          <g stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="30" y1="68" x2="88" y2="68" />
            <circle cx="96" cy="68" r="8" fill="none" stroke={ACCENT} />
            <line x1="101" y1="61" x2="128" y2="28" stroke={ACCENT} />
            <line x1="128" y1="28" x2="138" y2="36" stroke={ACCENT} />
            <text x="100" y="100" textAnchor="middle" fill={MUTED} stroke="none" fontSize="11" fontFamily="monospace">IEC S1</text>
          </g>
        );

      case 'two_way_switch':
        if (isAnsi) {
          return (
            <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="60" x2="62" y2="60" />
              <circle cx="66" cy="60" r="4" fill={ACCENT} stroke={ACCENT} />
              <line x1="70" y1="58" x2="126" y2="40" stroke={ACCENT} strokeWidth="2.6" />
              <circle cx="130" cy="40" r="4" />
              <line x1="134" y1="40" x2="175" y2="40" />
              <circle cx="130" cy="80" r="4" />
              <line x1="134" y1="80" x2="175" y2="80" />
              <text x="40" y="48" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">COM</text>
            </g>
          );
        }
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="100" cy="60" r="9" stroke={ACCENT} />
            <line x1="106" y1="53" x2="132" y2="24" stroke={ACCENT} />
            <line x1="132" y1="24" x2="142" y2="31" stroke={ACCENT} />
            <line x1="94" y1="67" x2="68" y2="96" stroke={INK} />
            <line x1="68" y1="96" x2="58" y2="89" stroke={INK} />
            <text x="155" y="98" textAnchor="middle" fill={MUTED} stroke="none" fontSize="11" fontFamily="monospace">IEC S6</text>
          </g>
        );

      case 'socket_pe':
        if (isAnsi) {
          return (
            <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round">
              <circle cx="100" cy="60" r="24" stroke={ACCENT} />
              <line x1="88" y1="30" x2="88" y2="90" />
              <line x1="112" y1="30" x2="112" y2="90" />
              <line x1="100" y1="84" x2="100" y2="104" stroke={EARTH} />
              <line x1="88" y1="104" x2="112" y2="104" stroke={EARTH} />
            </g>
          );
        }
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round">
            <line x1="66" y1="74" x2="134" y2="74" stroke={EARTH} />
            <path d="M 74 74 A 26 26 0 0 1 126 74" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="100" y1="74" x2="100" y2="96" stroke={EARTH} />
            <line x1="100" y1="28" x2="100" y2="48" />
          </g>
        );

      case 'lamp':
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round">
            <line x1="25" y1="60" x2="72" y2="60" />
            <line x1="128" y1="60" x2="175" y2="60" />
            <circle cx="100" cy="60" r="28" stroke={ACCENT} strokeWidth="2.5" />
            {isAnsi ? (
              <path d="M 80 60 C 86 42, 95 42, 100 60 C 105 78, 114 78, 120 60" stroke={ACCENT} />
            ) : (
              <>
                <line x1="81" y1="41" x2="119" y2="79" stroke={ACCENT} />
                <line x1="119" y1="41" x2="81" y2="79" stroke={ACCENT} />
              </>
            )}
          </g>
        );

      case 'coil':
        if (isAnsi) {
          return (
            <g stroke={INK} strokeWidth="2.4" fill="none">
              <line x1="28" y1="60" x2="72" y2="60" />
              <line x1="128" y1="60" x2="172" y2="60" />
              <circle cx="100" cy="60" r="28" stroke={CTRL} strokeWidth="2.6" />
              <text x="100" y="65" textAnchor="middle" fill={INK} stroke="none" fontSize="13" fontWeight="700" fontFamily="monospace">KM</text>
              <text x="52" y="50" textAnchor="middle" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">A1</text>
              <text x="148" y="50" textAnchor="middle" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">A2</text>
            </g>
          );
        }
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none">
            <line x1="28" y1="60" x2="66" y2="60" />
            <line x1="134" y1="60" x2="172" y2="60" />
            <rect x="66" y="40" width="68" height="40" rx="2" stroke={CTRL} strokeWidth="2.6" />
            <text x="100" y="65" textAnchor="middle" fill={INK} stroke="none" fontSize="13" fontWeight="700" fontFamily="monospace">KM1</text>
            <text x="50" y="50" textAnchor="middle" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">A1</text>
            <text x="150" y="50" textAnchor="middle" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">A2</text>
          </g>
        );

      case 'no_contact':
        if (isAnsi) {
          return (
            <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round">
              <line x1="28" y1="60" x2="88" y2="60" />
              <line x1="88" y1="36" x2="88" y2="84" stroke={ACCENT} strokeWidth="2.8" />
              <line x1="112" y1="36" x2="112" y2="84" stroke={ACCENT} strokeWidth="2.8" />
              <line x1="112" y1="60" x2="172" y2="60" />
              <text x="100" y="102" textAnchor="middle" fill={MUTED} stroke="none" fontSize="11" fontFamily="monospace">NO (| |)</text>
            </g>
          );
        }
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round">
            <line x1="28" y1="60" x2="72" y2="60" />
            <circle cx="74" cy="60" r="3" fill={INK} />
            <line x1="74" y1="58" x2="126" y2="36" stroke={ACCENT} strokeWidth="2.6" />
            <circle cx="128" cy="60" r="3" fill={INK} />
            <line x1="128" y1="60" x2="172" y2="60" />
            <text x="66" y="46" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">13</text>
            <text x="130" y="46" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">14</text>
          </g>
        );

      case 'nc_contact':
        if (isAnsi) {
          return (
            <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round">
              <line x1="28" y1="60" x2="88" y2="60" />
              <line x1="88" y1="36" x2="88" y2="84" stroke={ACCENT} strokeWidth="2.6" />
              <line x1="112" y1="36" x2="112" y2="84" stroke={ACCENT} strokeWidth="2.6" />
              <line x1="78" y1="82" x2="122" y2="38" stroke={CTRL} strokeWidth="2.6" />
              <line x1="112" y1="60" x2="172" y2="60" />
              <text x="100" y="104" textAnchor="middle" fill={MUTED} stroke="none" fontSize="11" fontFamily="monospace">NC (|/|)</text>
            </g>
          );
        }
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round">
            <line x1="28" y1="60" x2="72" y2="60" />
            <line x1="124" y1="42" x2="124" y2="60" />
            <line x1="72" y1="60" x2="129" y2="48" stroke={CTRL} strokeWidth="2.6" />
            <line x1="124" y1="60" x2="172" y2="60" />
            <text x="66" y="46" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">11</text>
            <text x="132" y="46" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">12</text>
          </g>
        );

      case 'push_button':
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="28" y1="74" x2="72" y2="74" />
            <line x1="128" y1="74" x2="172" y2="74" />
            <line x1="74" y1="72" x2="126" y2="50" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="100" y1="26" x2="100" y2="60" strokeDasharray="4 3" stroke={CTRL} />
            <path d="M 84 26 L 84 18 L 116 18 L 116 26" stroke={CTRL} strokeWidth="2.4" />
            <text x="100" y="102" textAnchor="middle" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">START NO</text>
          </g>
        );

      case 'limit_switch':
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round">
            <line x1="28" y1="72" x2="72" y2="72" />
            <line x1="128" y1="72" x2="172" y2="72" />
            <line x1="74" y1="70" x2="124" y2="44" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="100" y1="56" x2="100" y2="30" stroke={CTRL} />
            <circle cx="100" cy="24" r="7" stroke={CTRL} fill="none" />
            <circle cx="100" cy="24" r="2" fill={CTRL} />
            <text x="100" y="102" textAnchor="middle" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">LS ROLLER</text>
          </g>
        );

      case 'resistor':
        if (isAnsi) {
          return (
            <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="60" x2="54" y2="60" />
              <polyline points="54,60 62,42 78,78 94,42 110,78 126,42 142,78 150,60" stroke={ACCENT} strokeWidth="2.6" />
              <line x1="150" y1="60" x2="178" y2="60" />
              <text x="100" y="26" textAnchor="middle" fill={MUTED} stroke="none" fontSize="11" fontFamily="monospace">R (ANSI)</text>
            </g>
          );
        }
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none">
            <line x1="22" y1="60" x2="62" y2="60" />
            <rect x="62" y="45" width="76" height="30" rx="2" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="138" y1="60" x2="178" y2="60" />
            <text x="100" y="32" textAnchor="middle" fill={MUTED} stroke="none" fontSize="11" fontFamily="monospace">R (IEC)</text>
          </g>
        );

      case 'capacitor_pol':
        return (
          <g stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round">
            <line x1="25" y1="60" x2="88" y2="60" />
            <line x1="112" y1="60" x2="175" y2="60" />
            {isAnsi ? (
              <>
                <line x1="88" y1="32" x2="88" y2="88" stroke={ACCENT} strokeWidth="3" />
                <path d="M 118 32 Q 104 60 118 88" stroke={INK} strokeWidth="3" />
              </>
            ) : (
              <>
                <rect x="82" y="32" width="8" height="56" stroke={ACCENT} fill="none" />
                <rect x="110" y="32" width="8" height="56" stroke={INK} fill={INK} />
              </>
            )}
            <text x="68" y="46" fill={ACCENT} stroke="none" fontSize="14" fontWeight="700" fontFamily="monospace">+</text>
            <text x="128" y="46" fill={MUTED} stroke="none" fontSize="14" fontWeight="700" fontFamily="monospace">−</text>
          </g>
        );

      case 'inductor':
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round">
            <line x1="22" y1="64" x2="52" y2="64" />
            <path d="M 52 64 A 12 12 0 0 1 76 64 A 12 12 0 0 1 100 64 A 12 12 0 0 1 124 64 A 12 12 0 0 1 148 64" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="148" y1="64" x2="178" y2="64" />
            {!isAnsi && <line x1="56" y1="44" x2="144" y2="44" stroke={MUTED} strokeWidth="2" />}
            <text x="100" y="96" textAnchor="middle" fill={MUTED} stroke="none" fontSize="11" fontFamily="monospace">L</text>
          </g>
        );

      case 'diode':
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="26" y1="60" x2="82" y2="60" />
            <polygon points="82,40 82,80 118,60" stroke={ACCENT} fill="none" strokeWidth="2.6" />
            <line x1="118" y1="38" x2="118" y2="82" stroke={ACCENT} strokeWidth="3" />
            <line x1="118" y1="60" x2="174" y2="60" />
            <text x="58" y="48" fill={MUTED} stroke="none" fontSize="11" fontFamily="monospace">A</text>
            <text x="136" y="48" fill={MUTED} stroke="none" fontSize="11" fontFamily="monospace">K</text>
          </g>
        );

      case 'led':
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="26" y1="68" x2="80" y2="68" />
            <polygon points="80,48 80,88 116,68" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="116" y1="46" x2="116" y2="90" stroke={ACCENT} strokeWidth="3" />
            <line x1="116" y1="68" x2="174" y2="68" />
            <line x1="108" y1="40" x2="124" y2="24" stroke={CTRL} strokeWidth="2.2" />
            <polyline points="116,24 124,24 124,32" stroke={CTRL} strokeWidth="2.2" />
            <line x1="122" y1="46" x2="138" y2="30" stroke={CTRL} strokeWidth="2.2" />
            <polyline points="130,30 138,30 138,38" stroke={CTRL} strokeWidth="2.2" />
          </g>
        );

      case 'bjt_npn':
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="104" cy="60" r="32" stroke={MUTED} strokeWidth="1.6" />
            <line x1="36" y1="60" x2="88" y2="60" />
            <line x1="88" y1="38" x2="88" y2="82" stroke={ACCENT} strokeWidth="3" />
            <line x1="88" y1="49" x2="122" y2="24" />
            <line x1="122" y1="24" x2="122" y2="12" />
            <line x1="88" y1="71" x2="122" y2="96" />
            <line x1="122" y1="96" x2="122" y2="108" />
            <polygon points="112,89 121,95 117,84" fill={ACCENT} stroke={ACCENT} />
            <text x="48" y="52" fill={MUTED} stroke="none" fontSize="11" fontFamily="monospace">B</text>
            <text x="132" y="22" fill={MUTED} stroke="none" fontSize="11" fontFamily="monospace">C</text>
            <text x="132" y="104" fill={MUTED} stroke="none" fontSize="11" fontFamily="monospace">E</text>
          </g>
        );

      case 'mosfet':
        return (
          <g stroke={INK} strokeWidth="2.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="104" cy="60" r="34" stroke={MUTED} strokeWidth="1.6" />
            <line x1="32" y1="74" x2="80" y2="74" />
            <line x1="80" y1="40" x2="80" y2="80" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="90" y1="38" x2="90" y2="49" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="90" y1="55" x2="90" y2="66" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="90" y1="72" x2="90" y2="83" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="90" y1="43" x2="122" y2="43" />
            <line x1="122" y1="43" x2="122" y2="14" />
            <line x1="90" y1="77" x2="122" y2="77" />
            <line x1="122" y1="77" x2="122" y2="106" />
            <line x1="122" y1="60" x2="94" y2="60" />
            <polygon points="94,60 103,56 103,64" fill={ACCENT} stroke={ACCENT} />
            <text x="46" y="66" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">G</text>
            <text x="132" y="24" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">D</text>
            <text x="132" y="102" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">S</text>
          </g>
        );

      case 'logic_and':
        if (isAnsi) {
          return (
            <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="30" y1="44" x2="66" y2="44" />
              <line x1="30" y1="76" x2="66" y2="76" />
              <path d="M 66 30 L 100 30 A 30 30 0 0 1 100 90 L 66 90 Z" stroke={ACCENT} strokeWidth="2.6" />
              <line x1="130" y1="60" x2="170" y2="60" />
              <text x="42" y="40" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">A</text>
              <text x="42" y="72" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">B</text>
              <text x="152" y="52" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">Y</text>
            </g>
          );
        }
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none">
            <line x1="32" y1="44" x2="68" y2="44" />
            <line x1="32" y1="76" x2="68" y2="76" />
            <rect x="68" y="28" width="64" height="64" rx="2" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="132" y1="60" x2="168" y2="60" />
            <text x="100" y="66" textAnchor="middle" fill={INK} stroke="none" fontSize="22" fontWeight="700" fontFamily="monospace">&amp;</text>
          </g>
        );

      case 'dc_motor':
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round">
            <line x1="25" y1="60" x2="66" y2="60" />
            <line x1="134" y1="60" x2="175" y2="60" />
            <circle cx="100" cy="60" r="30" stroke={ACCENT} strokeWidth="2.6" />
            {isAnsi && (
              <>
                <rect x="64" y="53" width="8" height="14" fill={CTRL} stroke={CTRL} />
                <rect x="128" y="53" width="8" height="14" fill={CTRL} stroke={CTRL} />
              </>
            )}
            <text x="100" y="60" textAnchor="middle" fill={INK} stroke="none" fontSize="18" fontWeight="700" fontFamily="monospace">M</text>
            <line x1="84" y1="70" x2="116" y2="70" stroke={ACCENT} strokeWidth="2" />
            <line x1="84" y1="76" x2="116" y2="76" stroke={ACCENT} strokeWidth="2" strokeDasharray="5 3" />
          </g>
        );

      case 'motor_3ph':
        return (
          <g stroke={INK} strokeWidth="2.3" fill="none" strokeLinecap="round">
            <line x1="80" y1="14" x2="80" y2="36" />
            <line x1="100" y1="14" x2="100" y2="34" />
            <line x1="120" y1="14" x2="120" y2="36" />
            <circle cx="100" cy="66" r="32" stroke={ACCENT} strokeWidth="2.6" />
            <text x="100" y="64" textAnchor="middle" fill={INK} stroke="none" fontSize="17" fontWeight="700" fontFamily="monospace">M</text>
            <text x="100" y="83" textAnchor="middle" fill={ACCENT} stroke="none" fontSize="12" fontWeight="700" fontFamily="monospace">3~</text>
            <line x1="132" y1="66" x2="156" y2="66" stroke={EARTH} />
            <line x1="156" y1="66" x2="156" y2="84" stroke={EARTH} />
            <line x1="145" y1="84" x2="167" y2="84" stroke={EARTH} />
            <line x1="149" y1="89" x2="163" y2="89" stroke={EARTH} />
            <text x="68" y="24" fill={MUTED} stroke="none" fontSize="9" fontFamily="monospace">U1</text>
            <text x="104" y="24" fill={MUTED} stroke="none" fontSize="9" fontFamily="monospace">V1</text>
            <text x="124" y="24" fill={MUTED} stroke="none" fontSize="9" fontFamily="monospace">W1</text>
          </g>
        );

      case 'vfd':
        return (
          <g stroke={INK} strokeWidth="2.3" fill="none" strokeLinecap="round">
            <line x1="22" y1="60" x2="54" y2="60" />
            <rect x="54" y="30" width="92" height="60" rx="4" stroke={ACCENT} strokeWidth="2.5" />
            <line x1="138" y1="30" x2="62" y2="90" stroke={MUTED} strokeWidth="1.6" />
            <line x1="146" y1="60" x2="178" y2="60" />
            <text x="74" y="54" textAnchor="middle" fill={INK} stroke="none" fontSize="13" fontWeight="700" fontFamily="monospace">~</text>
            <text x="122" y="76" textAnchor="middle" fill={ACCENT} stroke="none" fontSize="13" fontWeight="700" fontFamily="monospace">f~</text>
          </g>
        );

      case 'voltmeter':
      case 'ammeter':
      case 'wattmeter': {
        const letter = svgKey === 'voltmeter' ? 'V' : svgKey === 'ammeter' ? 'A' : 'W';
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none">
            <line x1="25" y1="60" x2="70" y2="60" />
            <line x1="130" y1="60" x2="175" y2="60" />
            <circle cx="100" cy="60" r="30" stroke={ACCENT} strokeWidth="2.6" />
            <text x="100" y="67" textAnchor="middle" fill={INK} stroke="none" fontSize="22" fontWeight="700" fontFamily="monospace">
              {letter}
            </text>
          </g>
        );
      }

      case 'oscilloscope':
        return (
          <g stroke={INK} strokeWidth="2.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="58" y="26" width="84" height="68" rx="6" stroke={ACCENT} strokeWidth="2.5" />
            <line x1="68" y1="60" x2="132" y2="60" stroke={MUTED} strokeWidth="1.2" strokeDasharray="3 3" />
            <path d="M 68 60 Q 78 34, 88 60 T 108 60 T 128 60" stroke={ACCENT} strokeWidth="2.5" />
            <line x1="24" y1="60" x2="58" y2="60" />
          </g>
        );

      case 'fuse':
        if (isAnsi) {
          return (
            <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round">
              <line x1="26" y1="60" x2="64" y2="60" />
              <circle cx="66" cy="60" r="3" fill={INK} />
              <path d="M 69 60 C 80 38, 92 38, 100 60 C 108 82, 120 82, 131 60" stroke={ACCENT} strokeWidth="2.6" />
              <circle cx="134" cy="60" r="3" fill={INK} />
              <line x1="136" y1="60" x2="174" y2="60" />
              <text x="100" y="26" textAnchor="middle" fill={MUTED} stroke="none" fontSize="11" fontFamily="monospace">FU (ANSI)</text>
            </g>
          );
        }
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none">
            <rect x="64" y="46" width="72" height="28" rx="2" stroke={ACCENT} strokeWidth="2.5" />
            <line x1="24" y1="60" x2="176" y2="60" stroke={INK} strokeWidth="2.4" />
            <text x="100" y="34" textAnchor="middle" fill={MUTED} stroke="none" fontSize="11" fontFamily="monospace">FU (IEC)</text>
          </g>
        );

      case 'mcb':
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round">
            <line x1="28" y1="60" x2="72" y2="60" />
            <line x1="126" y1="60" x2="172" y2="60" />
            {isAnsi ? (
              <path d="M 72 60 A 28 24 0 0 1 126 60" stroke={ACCENT} strokeWidth="2.8" />
            ) : (
              <>
                <line x1="72" y1="60" x2="124" y2="36" stroke={ACCENT} strokeWidth="2.6" />
                <line x1="117" y1="34" x2="127" y2="44" stroke={ACCENT} strokeWidth="2.2" />
                <line x1="127" y1="34" x2="117" y2="44" stroke={ACCENT} strokeWidth="2.2" />
              </>
            )}
            <text x="100" y="96" textAnchor="middle" fill={MUTED} stroke="none" fontSize="11" fontFamily="monospace">QF (MCB)</text>
          </g>
        );

      case 'rcd':
        return (
          <g stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round">
            <line x1="30" y1="42" x2="170" y2="42" />
            <line x1="30" y1="78" x2="170" y2="78" />
            <ellipse cx="90" cy="60" rx="10" ry="28" stroke={ACCENT} strokeWidth="2.4" />
            <line x1="100" y1="60" x2="128" y2="60" stroke={CTRL} strokeDasharray="4 3" />
            <line x1="128" y1="32" x2="128" y2="88" stroke={CTRL} strokeWidth="2.4" />
            <text x="42" y="34" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">L</text>
            <text x="42" y="70" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">N</text>
            <text x="148" y="64" fill={ACCENT} stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">30mA</text>
          </g>
        );

      case 'thermal_overload':
        return (
          <g stroke={INK} strokeWidth="2.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="28" y1="60" x2="68" y2="60" />
            {isAnsi ? (
              <path d="M 68 60 Q 78 38, 86 60 Q 94 82, 102 60 Q 110 38, 118 60 Q 126 82, 134 60" stroke={ACCENT} strokeWidth="2.6" />
            ) : (
              <>
                <rect x="68" y="45" width="64" height="30" rx="2" stroke={ACCENT} />
                <polyline points="82,45 82,60 118,60 118,75" stroke={CTRL} strokeWidth="2.4" />
              </>
            )}
            <line x1="132" y1="60" x2="172" y2="60" />
            <text x="100" y="100" textAnchor="middle" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">OL 95-96</text>
          </g>
        );

      case 'spd':
        return (
          <g stroke={INK} strokeWidth="2.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="100" y1="16" x2="100" y2="34" />
            <rect x="76" y="34" width="48" height="48" rx="3" stroke={ACCENT} strokeWidth="2.5" />
            <line x1="100" y1="42" x2="100" y2="72" stroke={CTRL} strokeWidth="2.4" />
            <polyline points="92,64 100,74 108,64" stroke={CTRL} strokeWidth="2.4" />
            <line x1="100" y1="82" x2="100" y2="96" stroke={EARTH} />
            <line x1="86" y1="96" x2="114" y2="96" stroke={EARTH} />
            <line x1="92" y1="102" x2="108" y2="102" stroke={EARTH} />
          </g>
        );

      case 'plc':
        return (
          <g stroke={INK} strokeWidth="2.2" fill="none">
            <rect x="48" y="22" width="104" height="76" rx="4" stroke={ACCENT} strokeWidth="2.5" />
            <line x1="48" y1="44" x2="152" y2="44" stroke={MUTED} />
            <text x="100" y="37" textAnchor="middle" fill={ACCENT} stroke="none" fontSize="12" fontWeight="700" fontFamily="monospace">PLC</text>
            <text x="64" y="64" fill={INK} stroke="none" fontSize="10" fontFamily="monospace">DI / AI</text>
            <text x="136" y="64" textAnchor="end" fill={CTRL} stroke="none" fontSize="10" fontFamily="monospace">DO / AO</text>
            <line x1="26" y1="60" x2="48" y2="60" />
            <line x1="26" y1="78" x2="48" y2="78" />
            <line x1="152" y1="60" x2="174" y2="60" />
            <line x1="152" y1="78" x2="174" y2="78" />
          </g>
        );

      case 'timer_on':
        return (
          <g stroke={INK} strokeWidth="2.3" fill="none">
            <line x1="24" y1="60" x2="58" y2="60" />
            <line x1="142" y1="60" x2="176" y2="60" />
            <rect x="58" y="38" width="84" height="44" rx="2" stroke={ACCENT} strokeWidth="2.5" />
            <line x1="78" y1="38" x2="78" y2="82" stroke={ACCENT} />
            <line x1="58" y1="38" x2="78" y2="82" stroke={CTRL} />
            <line x1="78" y1="38" x2="58" y2="82" stroke={CTRL} />
            <text x="110" y="65" textAnchor="middle" fill={INK} stroke="none" fontSize="13" fontWeight="700" fontFamily="monospace">KT</text>
          </g>
        );

      case 'sensor':
        return (
          <g stroke={INK} strokeWidth="2.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="100,20 144,60 100,100 56,60" stroke={ACCENT} strokeWidth="2.5" />
            <line x1="88" y1="48" x2="88" y2="72" stroke={CTRL} strokeWidth="2.5" />
            <line x1="112" y1="48" x2="112" y2="72" stroke={CTRL} strokeWidth="2.5" />
            <line x1="144" y1="60" x2="176" y2="60" />
          </g>
        );

      case 'pe_earth':
        return (
          <g stroke={EARTH} strokeWidth="2.6" fill="none" strokeLinecap="round">
            <circle cx="100" cy="64" r="34" strokeWidth="2" />
            <line x1="100" y1="36" x2="100" y2="58" />
            <line x1="76" y1="58" x2="124" y2="58" />
            <line x1="84" y1="68" x2="116" y2="68" />
            <line x1="92" y1="78" x2="108" y2="78" />
          </g>
        );

      case 'earth_general':
        return (
          <g stroke={EARTH} strokeWidth="2.6" fill="none" strokeLinecap="round">
            <line x1="100" y1="24" x2="100" y2="54" />
            <line x1="70" y1="54" x2="130" y2="54" />
            <line x1="80" y1="66" x2="120" y2="66" />
            <line x1="90" y1="78" x2="110" y2="78" />
            <line x1="96" y1="90" x2="104" y2="90" />
          </g>
        );

      case 'chassis_gnd':
        return (
          <g stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round">
            <line x1="100" y1="24" x2="100" y2="56" />
            <line x1="68" y1="56" x2="132" y2="56" stroke={ACCENT} strokeWidth="2.8" />
            <line x1="76" y1="56" x2="64" y2="82" stroke={ACCENT} />
            <line x1="100" y1="56" x2="88" y2="82" stroke={ACCENT} />
            <line x1="124" y1="56" x2="112" y2="82" stroke={ACCENT} />
          </g>
        );

      case 'dc_battery':
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round">
            <line x1="26" y1="60" x2="80" y2="60" />
            <line x1="80" y1="30" x2="80" y2="90" stroke={ACCENT} strokeWidth="2.4" />
            <line x1="94" y1="45" x2="94" y2="75" stroke={INK} strokeWidth="4.2" />
            <line x1="108" y1="30" x2="108" y2="90" stroke={ACCENT} strokeWidth="2.4" />
            <line x1="122" y1="45" x2="122" y2="75" stroke={INK} strokeWidth="4.2" />
            <line x1="122" y1="60" x2="174" y2="60" />
            <text x="64" y="42" fill={ACCENT} stroke="none" fontSize="14" fontWeight="700" fontFamily="monospace">+</text>
            <text x="132" y="42" fill={MUTED} stroke="none" fontSize="14" fontWeight="700" fontFamily="monospace">−</text>
          </g>
        );

      case 'ac_source':
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round">
            <line x1="26" y1="60" x2="70" y2="60" />
            <line x1="130" y1="60" x2="174" y2="60" />
            <circle cx="100" cy="60" r="30" stroke={ACCENT} strokeWidth="2.5" />
            <path d="M 80 60 C 86 40, 94 40, 100 60 C 106 80, 114 80, 120 60" stroke={ACCENT} strokeWidth="2.5" />
          </g>
        );

      case 'pv_cell':
        return (
          <g stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="100" cy="62" r="30" stroke={ACCENT} strokeWidth="2.4" />
            <line x1="40" y1="62" x2="92" y2="62" />
            <line x1="108" y1="62" x2="160" y2="62" />
            <line x1="92" y1="42" x2="92" y2="82" stroke={ACCENT} strokeWidth="2.4" />
            <line x1="108" y1="50" x2="108" y2="74" stroke={INK} strokeWidth="4" />
            <line x1="58" y1="22" x2="76" y2="38" stroke={CTRL} />
            <polyline points="68,38 76,38 76,30" stroke={CTRL} />
            <line x1="72" y1="14" x2="90" y2="30" stroke={CTRL} />
            <polyline points="82,30 90,30 90,22" stroke={CTRL} />
          </g>
        );

      case 'transformer':
      default:
        if (isAnsi) {
          return (
            <g stroke={INK} strokeWidth="2.3" fill="none" strokeLinecap="round">
              <line x1="30" y1="36" x2="72" y2="36" />
              <line x1="30" y1="84" x2="72" y2="84" />
              <path d="M 72 36 A 8 8 0 0 1 72 52 A 8 8 0 0 1 72 68 A 8 8 0 0 1 72 84" stroke={ACCENT} strokeWidth="2.5" />
              <line x1="96" y1="32" x2="96" y2="88" stroke={MUTED} strokeWidth="2.2" />
              <line x1="104" y1="32" x2="104" y2="88" stroke={MUTED} strokeWidth="2.2" />
              <path d="M 128 36 A 8 8 0 0 0 128 52 A 8 8 0 0 0 128 68 A 8 8 0 0 0 128 84" stroke={ACCENT} strokeWidth="2.5" />
              <line x1="128" y1="36" x2="170" y2="36" />
              <line x1="128" y1="84" x2="170" y2="84" />
            </g>
          );
        }
        return (
          <g stroke={INK} strokeWidth="2.4" fill="none">
            <line x1="28" y1="60" x2="62" y2="60" />
            <circle cx="84" cy="60" r="22" stroke={ACCENT} strokeWidth="2.5" />
            <circle cx="116" cy="60" r="22" stroke={ACCENT} strokeWidth="2.5" />
            <line x1="138" y1="60" x2="172" y2="60" />
          </g>
        );
    }
  };

  return (
    <div dir="ltr" className={className}>
      <svg viewBox="0 0 200 120" className="w-full h-full" aria-hidden="true">
        {renderShape()}
      </svg>
    </div>
  );
}
