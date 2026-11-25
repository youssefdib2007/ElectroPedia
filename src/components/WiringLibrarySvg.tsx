interface WiringLibrarySvgProps {
  svgId: string;
  className?: string;
}

const INK = 'var(--schematic-ink)';
const ACCENT = 'var(--schematic-accent)';
const CTRL = 'var(--schematic-ctrl)';
const EARTH = 'var(--schematic-earth)';
const MUTED = 'var(--schematic-muted)';

export function WiringLibrarySvg({ svgId, className = 'w-full h-full' }: WiringLibrarySvgProps) {
  const renderDiagram = () => {
    switch (svgId) {
      case 'lighting_simple':
        return (
          <g stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Supply rails */}
            <text x="26" y="48" fill="#EF4444" stroke="none" fontSize="12" fontWeight="700" fontFamily="monospace">L (230V)</text>
            <text x="26" y="196" fill={ACCENT} stroke="none" fontSize="12" fontWeight="700" fontFamily="monospace">N (0V)</text>
            <text x="26" y="226" fill={EARTH} stroke="none" fontSize="12" fontWeight="700" fontFamily="monospace">PE</text>

            {/* Phase line -> MCB B10A -> Switch S1 -> Lamp */}
            <line x1="90" y1="44" x2="140" y2="44" stroke="#EF4444" />
            <rect x="140" y="28" width="54" height="32" rx="4" stroke={ACCENT} />
            <text x="167" y="48" textAnchor="middle" fill={INK} stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">B10A</text>
            <line x1="194" y1="44" x2="260" y2="44" stroke="#EF4444" />

            {/* Switch S1 */}
            <rect x="260" y="24" width="84" height="42" rx="5" stroke={MUTED} strokeDasharray="4 3" />
            <circle cx="278" cy="44" r="4" fill={ACCENT} stroke={ACCENT} />
            <line x1="281" y1="42" x2="322" y2="29" stroke={ACCENT} strokeWidth="2.6" />
            <circle cx="326" cy="44" r="4" />
            <text x="302" y="80" textAnchor="middle" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">S1 (COM → L1)</text>

            {/* Switched live to Lamp */}
            <polyline points="330,44 430,44 430,86" stroke="#F59E0B" />
            <circle cx="430" cy="116" r="28" stroke={ACCENT} strokeWidth="2.5" />
            <line x1="412" y1="98" x2="448" y2="134" stroke={ACCENT} />
            <line x1="448" y1="98" x2="412" y2="134" stroke={ACCENT} />
            <text x="472" y="120" fill={INK} stroke="none" fontSize="12" fontWeight="700" fontFamily="monospace">EL (LED)</text>

            {/* Direct Neutral */}
            <polyline points="90,192 430,192 430,144" stroke={ACCENT} />
            {/* PE */}
            <polyline points="90,222 430,222 430,158" stroke={EARTH} strokeDasharray="5 3" />
          </g>
        );

      case 'lighting_two_way':
        return (
          <g stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <text x="20" y="54" fill="#EF4444" stroke="none" fontSize="12" fontWeight="700" fontFamily="monospace">L</text>
            <text x="20" y="198" fill={ACCENT} stroke="none" fontSize="12" fontWeight="700" fontFamily="monospace">N</text>

            {/* MCB */}
            <line x1="42" y1="50" x2="72" y2="50" stroke="#EF4444" />
            <rect x="72" y="36" width="44" height="28" rx="3" stroke={ACCENT} />
            <text x="94" y="54" textAnchor="middle" fill={INK} stroke="none" fontSize="10" fontFamily="monospace">B10A</text>
            <line x1="116" y1="50" x2="152" y2="50" stroke="#EF4444" />

            {/* Switch 1 */}
            <rect x="142" y="24" width="90" height="84" rx="5" stroke={MUTED} strokeDasharray="4 3" />
            <text x="187" y="122" textAnchor="middle" fill={INK} stroke="none" fontSize="10" fontFamily="monospace">Switch 1 (COM)</text>
            <circle cx="158" cy="50" r="3.5" fill={ACCENT} />
            <line x1="160" y1="49" x2="212" y2="40" stroke={ACCENT} strokeWidth="2.5" />
            <circle cx="216" cy="40" r="3.5" />
            <circle cx="216" cy="88" r="3.5" />

            {/* Travelers */}
            <line x1="220" y1="40" x2="320" y2="40" stroke={CTRL} />
            <line x1="220" y1="88" x2="320" y2="88" stroke="#F59E0B" />
            <text x="270" y="32" textAnchor="middle" fill={CTRL} stroke="none" fontSize="10" fontFamily="monospace">Traveler 1</text>
            <text x="270" y="102" textAnchor="middle" fill="#F59E0B" stroke="none" fontSize="10" fontFamily="monospace">Traveler 2</text>

            {/* Switch 2 */}
            <rect x="308" y="24" width="90" height="84" rx="5" stroke={MUTED} strokeDasharray="4 3" />
            <text x="353" y="122" textAnchor="middle" fill={INK} stroke="none" fontSize="10" fontFamily="monospace">Switch 2 (COM)</text>
            <circle cx="324" cy="40" r="3.5" />
            <circle cx="324" cy="88" r="3.5" />
            <circle cx="382" cy="64" r="3.5" fill={ACCENT} />
            <line x1="380" y1="63" x2="328" y2="41" stroke={ACCENT} strokeWidth="2.5" />

            {/* Lamp */}
            <polyline points="386,64 468,64 468,94" stroke="#EF4444" />
            <circle cx="468" cy="120" r="24" stroke={ACCENT} strokeWidth="2.5" />
            <line x1="452" y1="104" x2="484" y2="136" stroke={ACCENT} />
            <line x1="484" y1="104" x2="452" y2="136" stroke={ACCENT} />
            <polyline points="42,194 468,194 468,144" stroke={ACCENT} />
          </g>
        );

      case 'series_parallel':
        return (
          <g stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round">
            {/* Left Box: Series */}
            <rect x="18" y="18" width="240" height="206" rx="8" stroke={MUTED} strokeDasharray="4 3" />
            <text x="138" y="38" textAnchor="middle" fill={ACCENT} stroke="none" fontSize="12" fontWeight="700" fontFamily="monospace">SERIES: I = const · R = R1 + R2</text>
            <polyline points="56,110 56,66 90,66" />
            <rect x="90" y="56" width="44" height="20" stroke={ACCENT} />
            <text x="112" y="70" textAnchor="middle" fill={INK} stroke="none" fontSize="10" fontFamily="monospace">R1</text>
            <line x1="134" y1="66" x2="156" y2="66" />
            <rect x="156" y="56" width="44" height="20" stroke={ACCENT} />
            <text x="178" y="70" textAnchor="middle" fill={INK} stroke="none" fontSize="10" fontFamily="monospace">R2</text>
            <polyline points="200,66 226,66 226,184 56,184 56,144" />
            <line x1="42" y1="112" x2="70" y2="112" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="48" y1="124" x2="64" y2="124" stroke={INK} strokeWidth="4" />
            <text x="140" y="206" textAnchor="middle" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">Vtotal = V1 + V2</text>

            {/* Right Box: Parallel */}
            <rect x="282" y="18" width="240" height="206" rx="8" stroke={MUTED} strokeDasharray="4 3" />
            <text x="402" y="38" textAnchor="middle" fill={CTRL} stroke="none" fontSize="12" fontWeight="700" fontFamily="monospace">PARALLEL: V = const · I = I1 + I2</text>
            <polyline points="316,110 316,64 484,64" />
            <polyline points="316,144 316,184 484,184" />
            <line x1="302" y1="112" x2="330" y2="112" stroke={CTRL} strokeWidth="2.6" />
            <line x1="308" y1="124" x2="324" y2="124" stroke={INK} strokeWidth="4" />
            {/* Branch 1 */}
            <line x1="392" y1="64" x2="392" y2="100" />
            <rect x="382" y="100" width="20" height="46" stroke={CTRL} />
            <text x="372" y="128" textAnchor="end" fill={INK} stroke="none" fontSize="10" fontFamily="monospace">R1</text>
            <line x1="392" y1="146" x2="392" y2="184" />
            {/* Branch 2 */}
            <line x1="468" y1="64" x2="468" y2="100" />
            <rect x="458" y="100" width="20" height="46" stroke={CTRL} />
            <text x="448" y="128" textAnchor="end" fill={INK} stroke="none" fontSize="10" fontFamily="monospace">R2</text>
            <line x1="468" y1="146" x2="468" y2="184" />
            <text x="402" y="206" textAnchor="middle" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">1/Req = 1/R1 + 1/R2</text>
          </g>
        );

      case 'dc_regulated_psu':
        return (
          <g stroke={INK} strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <text x="20" y="62" fill="#EF4444" stroke="none" fontSize="10" fontFamily="monospace">230V AC</text>
            <rect x="64" y="48" width="32" height="16" stroke={ACCENT} />
            <line x1="50" y1="56" x2="108" y2="56" />
            <text x="80" y="42" textAnchor="middle" fill={MUTED} stroke="none" fontSize="9" fontFamily="monospace">FU</text>

            {/* Transformer */}
            <circle cx="132" cy="84" r="22" stroke={ACCENT} />
            <circle cx="158" cy="84" r="22" stroke={ACCENT} />
            <line x1="108" y1="56" x2="118" y2="68" />
            <line x1="50" y1="114" x2="118" y2="102" />
            <line x1="176" y1="68" x2="216" y2="68" />
            <line x1="176" y1="102" x2="216" y2="102" />

            {/* Bridge Rectifier block */}
            <rect x="216" y="48" width="70" height="72" rx="6" stroke={ACCENT} />
            <text x="251" y="79" textAnchor="middle" fill={INK} stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">BRIDGE</text>
            <text x="251" y="96" textAnchor="middle" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">D1–D4</text>

            {/* Filter Cap + 7805 */}
            <line x1="286" y1="62" x2="496" y2="62" stroke="#EF4444" />
            <line x1="286" y1="168" x2="496" y2="168" stroke={INK} />
            <line x1="286" y1="106" x2="314" y2="168" stroke={INK} />

            {/* C1 Bulk */}
            <line x1="330" y1="62" x2="330" y2="106" />
            <line x1="316" y1="106" x2="344" y2="106" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="316" y1="118" x2="344" y2="118" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="330" y1="118" x2="330" y2="168" />
            <text x="348" y="114" fill={MUTED} stroke="none" fontSize="9" fontFamily="monospace">C1 1000µF</text>

            {/* 7805 Regulator */}
            <rect x="382" y="46" width="66" height="44" rx="4" stroke={CTRL} strokeWidth="2.4" />
            <text x="415" y="72" textAnchor="middle" fill={INK} stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">LM7805</text>
            <line x1="415" y1="90" x2="415" y2="168" />
            <text x="424" y="132" fill={MUTED} stroke="none" fontSize="9" fontFamily="monospace">GND</text>

            {/* Output rail */}
            <text x="498" y="66" fill="#22C55E" stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">+5V DC</text>
            <text x="498" y="172" fill={MUTED} stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">0V GND</text>
          </g>
        );

      case 'control_latch':
        return (
          <g stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round">
            {/* Top rail 24V / L and bottom rail 0V / N */}
            <line x1="40" y1="26" x2="490" y2="26" stroke="#EF4444" />
            <line x1="40" y1="212" x2="490" y2="212" stroke={ACCENT} />
            <text x="48" y="20" fill="#EF4444" stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">+24V / L1</text>
            <text x="48" y="228" fill={ACCENT} stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">0V / N</text>

            {/* Main rung down left */}
            <line x1="130" y1="26" x2="130" y2="46" />
            {/* F1 OL 95-96 NC */}
            <line x1="130" y1="46" x2="150" y2="46" />
            <line x1="130" y1="46" x2="130" y2="76" stroke={CTRL} />
            <text x="158" y="64" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">F1 (95–96 NC)</text>

            {/* S0 STOP NC */}
            <line x1="130" y1="76" x2="130" y2="106" stroke="#EF4444" />
            <text x="158" y="96" fill="#EF4444" stroke="none" fontSize="10" fontFamily="monospace">S0 STOP (11–12 NC)</text>

            {/* Parallel branch: S1 START (NO) & KM1 (13-14 NO) */}
            <line x1="130" y1="106" x2="130" y2="122" />
            <line x1="130" y1="122" x2="230" y2="122" />
            <line x1="130" y1="122" x2="130" y2="132" />
            <line x1="130" y1="132" x2="112" y2="154" stroke="#22C55E" strokeWidth="2.6" />
            <text x="64" y="146" fill="#22C55E" stroke="none" fontSize="10" fontFamily="monospace">S1 START</text>
            <line x1="130" y1="154" x2="130" y2="164" />

            {/* Latch branch KM1 13-14 */}
            <line x1="230" y1="122" x2="230" y2="132" />
            <line x1="230" y1="132" x2="212" y2="154" stroke={ACCENT} strokeWidth="2.6" />
            <text x="242" y="146" fill={ACCENT} stroke="none" fontSize="10" fontFamily="monospace">KM1 (13–14 Latch)</text>
            <line x1="230" y1="154" x2="230" y2="164" />
            <line x1="130" y1="164" x2="230" y2="164" />

            {/* Coil KM1 A1-A2 */}
            <line x1="130" y1="164" x2="130" y2="174" />
            <rect x="106" y="174" width="48" height="24" rx="3" stroke={CTRL} strokeWidth="2.4" />
            <text x="130" y="190" textAnchor="middle" fill={INK} stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">KM1</text>
            <line x1="130" y1="198" x2="130" y2="212" />
            <text x="164" y="190" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">A1–A2</text>
          </g>
        );

      case 'relay_flyback':
        return (
          <g stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* DC Control side */}
            <text x="24" y="34" fill={ACCENT} stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">+12V DC</text>
            <line x1="80" y1="30" x2="210" y2="30" stroke="#EF4444" />
            {/* Coil + Flyback Diode */}
            <rect x="128" y="64" width="38" height="54" rx="4" stroke={CTRL} strokeWidth="2.4" />
            <text x="147" y="95" textAnchor="middle" fill={INK} stroke="none" fontSize="10" fontWeight="700" fontFamily="monospace">KA1</text>
            <line x1="147" y1="30" x2="147" y2="64" />
            <line x1="147" y1="118" x2="147" y2="156" />

            {/* Flyback Diode 1N4007 across coil (pointing UP) */}
            <line x1="147" y1="46" x2="210" y2="46" />
            <line x1="147" y1="134" x2="210" y2="134" />
            <line x1="210" y1="46" x2="210" y2="134" />
            <polygon points="198,98 222,98 210,78" fill="none" stroke={ACCENT} strokeWidth="2.4" />
            <line x1="196" y1="78" x2="224" y2="78" stroke={ACCENT} strokeWidth="2.8" />
            <text x="228" y="94" fill={ACCENT} stroke="none" fontSize="10" fontFamily="monospace">1N4007</text>

            {/* NPN Transistor Q1 */}
            <circle cx="147" cy="176" r="18" stroke={MUTED} />
            <line x1="94" y1="176" x2="140" y2="176" />
            <line x1="140" y1="164" x2="140" y2="188" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="147" y1="194" x2="147" y2="218" />
            <text x="28" y="180" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">GPIO → 1kΩ</text>
            <text x="147" y="232" textAnchor="middle" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">GND</text>

            {/* Isolation Barrier & AC Load Contacts */}
            <line x1="298" y1="20" x2="298" y2="224" stroke={MUTED} strokeDasharray="5 5" />
            <text x="314" y="34" fill="#EF4444" stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">230V AC ISOLATED LOAD</text>
            <line x1="330" y1="76" x2="378" y2="76" stroke="#EF4444" />
            <circle cx="382" cy="76" r="4" fill={ACCENT} />
            <line x1="386" y1="74" x2="430" y2="54" stroke={ACCENT} strokeWidth="2.6" />
            <circle cx="434" cy="76" r="4" />
            <polyline points="438,76 476,76 476,112" stroke="#EF4444" />
            <circle cx="476" cy="136" r="22" stroke={ACCENT} />
            <line x1="462" y1="122" x2="490" y2="150" stroke={ACCENT} />
            <line x1="490" y1="122" x2="462" y2="150" stroke={ACCENT} />
            <line x1="476" y1="158" x2="476" y2="204" stroke={ACCENT} />
            <line x1="330" y1="204" x2="476" y2="204" stroke={ACCENT} />
          </g>
        );

      case 'contactor_industrial':
        return (
          <g stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round">
            {/* 3-phase power L1 L2 L3 */}
            <text x="58" y="24" fill="#EF4444" stroke="none" fontSize="10" fontFamily="monospace">L1</text>
            <text x="98" y="24" fill="#F59E0B" stroke="none" fontSize="10" fontFamily="monospace">L2</text>
            <text x="138" y="24" fill={ACCENT} stroke="none" fontSize="10" fontFamily="monospace">L3</text>
            <line x1="64" y1="30" x2="64" y2="70" stroke="#EF4444" />
            <line x1="104" y1="30" x2="104" y2="70" stroke="#F59E0B" />
            <line x1="144" y1="30" x2="144" y2="70" stroke={ACCENT} />

            {/* 3-pole QF1 */}
            <rect x="44" y="64" width="120" height="32" rx="4" stroke={ACCENT} />
            <text x="104" y="84" textAnchor="middle" fill={INK} stroke="none" fontSize="10" fontWeight="700" fontFamily="monospace">QF1 3P MCB</text>
            <line x1="64" y1="96" x2="64" y2="122" />
            <line x1="104" y1="96" x2="104" y2="122" />
            <line x1="144" y1="96" x2="144" y2="122" />

            {/* KM1 Main Poles */}
            <rect x="44" y="122" width="120" height="44" rx="4" stroke={CTRL} />
            <text x="104" y="148" textAnchor="middle" fill={INK} stroke="none" fontSize="10" fontWeight="700" fontFamily="monospace">KM1 (1-2 / 3-4 / 5-6)</text>
            <line x1="64" y1="166" x2="64" y2="210" />
            <line x1="104" y1="166" x2="104" y2="210" />
            <line x1="144" y1="166" x2="144" y2="210" />
            <text x="104" y="226" textAnchor="middle" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">T1 · T2 · T3 TO 3~ LOAD</text>

            {/* Control circuit with E-Stop on right */}
            <line x1="250" y1="24" x2="490" y2="24" stroke="#EF4444" />
            <line x1="250" y1="212" x2="490" y2="212" stroke={ACCENT} />
            <line x1="340" y1="24" x2="340" y2="54" />
            <rect x="316" y="54" width="48" height="22" rx="3" stroke={ACCENT} />
            <text x="340" y="69" textAnchor="middle" fill={INK} stroke="none" fontSize="9" fontFamily="monospace">C2A</text>
            <line x1="340" y1="76" x2="340" y2="112" stroke="#EF4444" />
            <text x="376" y="102" fill="#EF4444" stroke="none" fontSize="10" fontFamily="monospace">E-STOP NC</text>
            <line x1="340" y1="112" x2="340" y2="152" />
            <rect x="316" y="152" width="48" height="28" rx="3" stroke={CTRL} strokeWidth="2.4" />
            <text x="340" y="170" textAnchor="middle" fill={INK} stroke="none" fontSize="10" fontWeight="700" fontFamily="monospace">KM1</text>
            <line x1="340" y1="180" x2="340" y2="212" />
            <line x1="164" y1="144" x2="316" y2="166" stroke={MUTED} strokeDasharray="4 4" />
          </g>
        );

      case 'motor_dol':
        return (
          <g stroke={INK} strokeWidth="2.1" fill="none" strokeLinecap="round">
            {/* Power Section */}
            <text x="95" y="20" textAnchor="middle" fill={ACCENT} stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">POWER CIRCUIT (400V 3~)</text>
            <line x1="56" y1="30" x2="56" y2="146" stroke="#EF4444" />
            <line x1="96" y1="30" x2="96" y2="146" stroke="#F59E0B" />
            <line x1="136" y1="30" x2="136" y2="146" stroke={ACCENT} />
            <rect x="40" y="42" width="112" height="24" rx="3" stroke={ACCENT} fill="none" />
            <text x="96" y="58" textAnchor="middle" fill={INK} stroke="none" fontSize="10" fontFamily="monospace">Q1 Breaker</text>
            <rect x="40" y="78" width="112" height="26" rx="3" stroke={CTRL} fill="none" />
            <text x="96" y="95" textAnchor="middle" fill={INK} stroke="none" fontSize="10" fontFamily="monospace">KM1 Contactor</text>
            <rect x="40" y="116" width="112" height="24" rx="3" stroke="#F59E0B" fill="none" />
            <text x="96" y="132" textAnchor="middle" fill={INK} stroke="none" fontSize="10" fontFamily="monospace">F1 Overload</text>

            {/* 3-phase Motor */}
            <circle cx="96" cy="184" r="30" stroke={ACCENT} strokeWidth="2.6" />
            <text x="96" y="183" textAnchor="middle" fill={INK} stroke="none" fontSize="14" fontWeight="700" fontFamily="monospace">M1</text>
            <text x="96" y="200" textAnchor="middle" fill={ACCENT} stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">3~</text>
            <line x1="126" y1="184" x2="162" y2="184" stroke={EARTH} />
            <text x="172" y="188" fill={EARTH} stroke="none" fontSize="10" fontWeight="700" fontFamily="monospace">PE</text>

            {/* Control Section */}
            <line x1="230" y1="16" x2="230" y2="226" stroke={MUTED} strokeDasharray="4 4" />
            <text x="380" y="20" textAnchor="middle" fill={CTRL} stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">CONTROL CIRCUIT</text>
            <line x1="256" y1="36" x2="496" y2="36" stroke="#EF4444" />
            <line x1="256" y1="216" x2="496" y2="216" stroke={ACCENT} />
            <line x1="320" y1="36" x2="320" y2="170" />
            <text x="336" y="64" fill="#F59E0B" stroke="none" fontSize="10" fontFamily="monospace">F1 (95–96 NC)</text>
            <text x="336" y="96" fill="#EF4444" stroke="none" fontSize="10" fontFamily="monospace">S0 STOP (NC)</text>
            <line x1="320" y1="114" x2="420" y2="114" />
            <text x="336" y="136" fill="#22C55E" stroke="none" fontSize="10" fontFamily="monospace">S1 START</text>
            <line x1="420" y1="114" x2="420" y2="154" />
            <line x1="320" y1="154" x2="420" y2="154" />
            <text x="430" y="136" fill={ACCENT} stroke="none" fontSize="10" fontFamily="monospace">KM1 13–14</text>
            <rect x="296" y="170" width="48" height="26" rx="3" stroke={CTRL} />
            <text x="320" y="187" textAnchor="middle" fill={INK} stroke="none" fontSize="10" fontWeight="700" fontFamily="monospace">KM1</text>
            <line x1="320" y1="196" x2="320" y2="216" />
          </g>
        );

      case 'motor_fwd_rev':
        return (
          <g stroke={INK} strokeWidth="2.1" fill="none" strokeLinecap="round">
            <text x="112" y="20" textAnchor="middle" fill={ACCENT} stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">PHASE REVERSAL (L1 ↔ L3)</text>
            <line x1="56" y1="32" x2="56" y2="146" stroke="#EF4444" />
            <line x1="104" y1="32" x2="104" y2="146" stroke="#F59E0B" />
            <line x1="152" y1="32" x2="152" y2="146" stroke={ACCENT} />
            <rect x="42" y="54" width="124" height="28" rx="3" stroke="#22C55E" />
            <text x="104" y="72" textAnchor="middle" fill="#22C55E" stroke="none" fontSize="10" fontWeight="700" fontFamily="monospace">KM1 (FWD)</text>
            <rect x="42" y="98" width="124" height="28" rx="3" stroke="#F59E0B" />
            <text x="104" y="116" textAnchor="middle" fill="#F59E0B" stroke="none" fontSize="10" fontWeight="700" fontFamily="monospace">KM2 (REV L1↔L3)</text>
            <circle cx="104" cy="182" r="28" stroke={ACCENT} strokeWidth="2.5" />
            <text x="104" y="187" textAnchor="middle" fill={INK} stroke="none" fontSize="13" fontWeight="700" fontFamily="monospace">M 3~</text>

            {/* Crossed NC Interlock Control */}
            <line x1="226" y1="16" x2="226" y2="226" stroke={MUTED} strokeDasharray="4 4" />
            <text x="380" y="20" textAnchor="middle" fill={CTRL} stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">NC ELECTRICAL INTERLOCK</text>
            <line x1="248" y1="38" x2="500" y2="38" stroke="#EF4444" />
            <line x1="248" y1="214" x2="500" y2="214" stroke={ACCENT} />
            {/* Branch 1 */}
            <line x1="316" y1="38" x2="316" y2="164" />
            <text x="326" y="74" fill="#22C55E" stroke="none" fontSize="9" fontFamily="monospace">S1 FWD</text>
            <text x="326" y="114" fill="#EF4444" stroke="none" fontSize="9" fontFamily="monospace">KM2 (21–22 NC)</text>
            <rect x="292" y="164" width="48" height="24" rx="3" stroke="#22C55E" />
            <text x="316" y="180" textAnchor="middle" fill={INK} stroke="none" fontSize="10" fontFamily="monospace">KM1</text>
            <line x1="316" y1="188" x2="316" y2="214" />

            {/* Branch 2 */}
            <line x1="444" y1="38" x2="444" y2="164" />
            <text x="454" y="74" fill="#F59E0B" stroke="none" fontSize="9" fontFamily="monospace">S2 REV</text>
            <text x="454" y="114" fill="#EF4444" stroke="none" fontSize="9" fontFamily="monospace">KM1 (21–22 NC)</text>
            <rect x="420" y="164" width="48" height="24" rx="3" stroke="#F59E0B" />
            <text x="444" y="180" textAnchor="middle" fill={INK} stroke="none" fontSize="10" fontFamily="monospace">KM2</text>
            <line x1="444" y1="188" x2="444" y2="214" />
          </g>
        );

      case 'electronics_led':
        return (
          <g stroke={INK} strokeWidth="2.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <text x="44" y="48" fill="#EF4444" stroke="none" fontSize="12" fontWeight="700" fontFamily="monospace">+Vs (5V / 12V)</text>
            <polyline points="80,104 80,62 150,62" stroke="#EF4444" />
            <line x1="60" y1="104" x2="100" y2="104" stroke={ACCENT} strokeWidth="2.5" />
            <line x1="70" y1="118" x2="90" y2="118" stroke={INK} strokeWidth="4" />
            <polyline points="80,118 80,178 420,178 420,136" stroke={INK} />

            {/* Resistor */}
            <rect x="150" y="48" width="84" height="28" rx="2" stroke={ACCENT} strokeWidth="2.5" />
            <text x="192" y="66" textAnchor="middle" fill={INK} stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">R1 330Ω</text>
            <text x="192" y="34" textAnchor="middle" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">R = (Vs − Vf) / If</text>

            <line x1="234" y1="62" x2="420" y2="62" />
            <line x1="420" y1="62" x2="420" y2="96" />
            <polygon points="400,96 440,96 420,132" stroke="#22C55E" strokeWidth="2.5" />
            <line x1="398" y1="132" x2="442" y2="132" stroke="#22C55E" strokeWidth="3" />
            <line x1="448" y1="100" x2="468" y2="82" stroke={CTRL} />
            <polyline points="460,82 468,82 468,90" stroke={CTRL} />
            <text x="454" y="118" fill={INK} stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">LED (A→K)</text>
          </g>
        );

      case 'electronics_mosfet':
      default:
        return (
          <g stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* MCU Box */}
            <rect x="28" y="88" width="96" height="86" rx="6" stroke={CTRL} strokeWidth="2.4" />
            <text x="76" y="128" textAnchor="middle" fill={INK} stroke="none" fontSize="12" fontWeight="700" fontFamily="monospace">MCU</text>
            <text x="76" y="148" textAnchor="middle" fill={MUTED} stroke="none" fontSize="10" fontFamily="monospace">PWM Pin</text>

            {/* Gate resistor Rg + Pull-down Rpd */}
            <line x1="124" y1="132" x2="162" y2="132" />
            <rect x="162" y="122" width="56" height="20" stroke={ACCENT} />
            <text x="190" y="136" textAnchor="middle" fill={INK} stroke="none" fontSize="9" fontFamily="monospace">Rg 220Ω</text>
            <line x1="218" y1="132" x2="294" y2="132" />

            <line x1="242" y1="132" x2="242" y2="152" />
            <rect x="233" y="152" width="18" height="38" stroke={MUTED} />
            <text x="206" y="176" textAnchor="end" fill={MUTED} stroke="none" fontSize="9" fontFamily="monospace">Rpd 10kΩ</text>
            <line x1="242" y1="190" x2="242" y2="210" />

            {/* MOSFET Q1 */}
            <circle cx="326" cy="132" r="32" stroke={MUTED} strokeWidth="1.6" />
            <line x1="308" y1="112" x2="308" y2="148" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="316" y1="112" x2="316" y2="122" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="316" y1="127" x2="316" y2="137" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="316" y1="142" x2="316" y2="152" stroke={ACCENT} strokeWidth="2.6" />
            <line x1="316" y1="146" x2="342" y2="146" />
            <line x1="342" y1="146" x2="342" y2="210" />
            <line x1="316" y1="116" x2="342" y2="116" />

            {/* Load + Flyback D1 + +12/24V */}
            <line x1="342" y1="116" x2="342" y2="88" />
            <rect x="326" y="46" width="32" height="42" rx="4" stroke={ACCENT} />
            <text x="342" y="71" textAnchor="middle" fill={INK} stroke="none" fontSize="10" fontWeight="700" fontFamily="monospace">LOAD</text>
            <line x1="342" y1="46" x2="342" y2="26" />
            <line x1="304" y1="26" x2="454" y2="26" stroke="#EF4444" />
            <text x="464" y="30" fill="#EF4444" stroke="none" fontSize="11" fontWeight="700" fontFamily="monospace">+12V/24V</text>

            {/* Flyback Diode across Load */}
            <line x1="342" y1="88" x2="404" y2="88" />
            <line x1="404" y1="88" x2="404" y2="26" />
            <polygon points="392,66 416,66 404,48" stroke={ACCENT} />
            <line x1="390" y1="48" x2="418" y2="48" stroke={ACCENT} strokeWidth="2.6" />
            <text x="424" y="64" fill={MUTED} stroke="none" fontSize="9" fontFamily="monospace">D1 Flyback</text>

            {/* Common GND Rail */}
            <line x1="76" y1="174" x2="76" y2="210" />
            <line x1="76" y1="210" x2="454" y2="210" stroke={INK} />
            <text x="464" y="214" fill={MUTED} stroke="none" fontSize="10" fontWeight="700" fontFamily="monospace">COMMON GND</text>
          </g>
        );
    }
  };

  return (
    <div dir="ltr" className={className}>
      <svg viewBox="0 0 540 245" className="w-full h-full" aria-hidden="true">
        {renderDiagram()}
      </svg>
    </div>
  );
}
