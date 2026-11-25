import type { WiringDiagramId } from '../types/electronics';

interface WiringDiagramArtworkProps {
  diagramId: WiringDiagramId;
  className?: string;
}

export function WiringDiagramArtwork({
  diagramId,
  className = 'w-full h-full',
}: WiringDiagramArtworkProps) {
  const ink = 'var(--schematic-ink)';
  const accent = 'var(--schematic-accent)';
  const ring = 'var(--schematic-ring)';
  const muted = 'var(--schematic-muted)';
  const ctrlText = 'var(--schematic-ctrl)';
  const earthText = 'var(--schematic-earth)';
  const live = '#EF4444';
  const neutral = '#3B82F6';
  const earth = '#22C55E';
  const ctrl = '#F59E0B';

  switch (diagramId) {
    case 'lighting_switch_circuit':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          <text x="20" y="34" fill={live} fontSize="11" fontWeight="bold" fontFamily="monospace">L (230V AC)</text>
          <text x="20" y="138" fill={neutral} fontSize="11" fontWeight="bold" fontFamily="monospace">N</text>
          <text x="20" y="162" fill={earthText} fontSize="11" fontWeight="bold" fontFamily="monospace">PE</text>

          {/* L -> MCB -> Switch -> Lamp */}
          <line x1="95" y1="30" x2="128" y2="30" stroke={live} strokeWidth="3" />
          <rect x="128" y="18" width="42" height="24" rx="3" fill="none" stroke={ink} strokeWidth="2" />
          <text x="149" y="34" textAnchor="middle" fill={ink} fontSize="10" fontFamily="monospace">MCB</text>
          <line x1="170" y1="30" x2="205" y2="30" stroke={live} strokeWidth="3" />

          {/* Switch */}
          <circle cx="205" cy="30" r="4" fill={live} />
          <line x1="205" y1="30" x2="236" y2="16" stroke={ctrl} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="242" cy="30" r="4" fill={live} />
          <text x="223" y="54" textAnchor="middle" fill={ink} fontSize="10" fontFamily="monospace">S1 (Switch)</text>

          <polyline points="242,30 305,30 305,72" fill="none" stroke={ctrl} strokeWidth="3" />

          {/* Lamp */}
          <circle cx="305" cy="92" r="20" fill="none" stroke={accent} strokeWidth="3" />
          <line x1="291" y1="78" x2="319" y2="106" stroke={accent} strokeWidth="2.5" />
          <line x1="319" y1="78" x2="291" y2="106" stroke={accent} strokeWidth="2.5" />
          <text x="334" y="96" fill={ink} fontSize="10" fontFamily="monospace">LAMP</text>

          {/* Neutral & Earth */}
          <polyline points="305,112 305,134 45,134" fill="none" stroke={neutral} strokeWidth="3" />
          <line x1="45" y1="158" x2="275" y2="158" stroke={earth} strokeWidth="2.5" strokeDasharray="6 4" />
        </svg>
      );

    case 'socket_rcd_earthing':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          <text x="16" y="38" fill={live} fontSize="11" fontWeight="bold" fontFamily="monospace">L</text>
          <text x="16" y="88" fill={neutral} fontSize="11" fontWeight="bold" fontFamily="monospace">N</text>
          <text x="16" y="146" fill={earthText} fontSize="11" fontWeight="bold" fontFamily="monospace">PE</text>

          <line x1="36" y1="34" x2="90" y2="34" stroke={live} strokeWidth="3" />
          <line x1="36" y1="84" x2="90" y2="84" stroke={neutral} strokeWidth="3" />

          {/* RCD Block */}
          <rect x="90" y="20" width="90" height="80" rx="5" fill="none" stroke={accent} strokeWidth="2.5" />
          <text x="135" y="48" textAnchor="middle" fill={ink} fontSize="11" fontWeight="bold" fontFamily="monospace">RCD 30mA</text>
          <text x="135" y="66" textAnchor="middle" fill={muted} fontSize="10" fontFamily="monospace">IΔn Core</text>

          <line x1="180" y1="34" x2="255" y2="34" stroke={live} strokeWidth="3" />
          <line x1="180" y1="84" x2="255" y2="84" stroke={neutral} strokeWidth="3" />
          <line x1="36" y1="142" x2="280" y2="142" stroke={earth} strokeWidth="3" />
          <line x1="280" y1="142" x2="280" y2="108" stroke={earth} strokeWidth="3" />

          {/* Socket */}
          <rect x="242" y="20" width="76" height="90" rx="10" fill="none" stroke={ink} strokeWidth="2.5" />
          <circle cx="264" cy="58" r="6" fill={live} />
          <circle cx="296" cy="58" r="6" fill={neutral} />
          <circle cx="280" cy="86" r="5" fill={earthText} />
          <text x="280" y="126" textAnchor="middle" fill={ink} fontSize="10" fontFamily="monospace">SOCKET L/N/PE</text>
        </svg>
      );

    case 'distribution_mcb_rcd':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          <rect x="24" y="16" width="70" height="148" rx="4" fill="none" stroke={ink} strokeWidth="2" />
          <text x="59" y="38" textAnchor="middle" fill={ink} fontSize="10" fontWeight="bold" fontFamily="monospace">MAIN</text>
          <text x="59" y="54" textAnchor="middle" fill={accent} fontSize="10" fontFamily="monospace">40A/30mA</text>
          <text x="59" y="70" textAnchor="middle" fill={muted} fontSize="10" fontFamily="monospace">RCD</text>

          {/* Busbar */}
          <line x1="94" y1="45" x2="320" y2="45" stroke={live} strokeWidth="4" />
          <line x1="94" y1="145" x2="320" y2="145" stroke={neutral} strokeWidth="3" />

          {[140, 210, 280].map((x, idx) => (
            <g key={x}>
              <line x1={x} y1="45" x2={x} y2="66" stroke={live} strokeWidth="2.5" />
              <rect x={x - 22} y="66" width="44" height="50" rx="3" fill="none" stroke={accent} strokeWidth="2" />
              <text x={x} y="88" textAnchor="middle" fill={ink} fontSize="10" fontWeight="bold" fontFamily="monospace">
                {idx === 0 ? 'B10A' : idx === 1 ? 'C16A' : 'C20A'}
              </text>
              <text x={x} y="104" textAnchor="middle" fill={muted} fontSize="8" fontFamily="monospace">
                {idx === 0 ? 'LIGHT' : idx === 1 ? 'PLUGS' : 'HVAC'}
              </text>
              <line x1={x} y1="116" x2={x} y2="132" stroke={live} strokeWidth="2.5" />
            </g>
          ))}
        </svg>
      );

    case 'motor_dol_contactor':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          <text x="18" y="30" fill={ink} fontSize="10" fontWeight="bold" fontFamily="monospace">L1 L2 L3</text>
          {[32, 54, 76].map((x, i) => (
            <g key={x}>
              <line x1={x} y1="38" x2={x} y2="64" stroke={live} strokeWidth="2.5" />
              <line x1={x} y1="90" x2={x} y2="112" stroke={ink} strokeWidth="2.5" />
              <line x1={x} y1="132" x2={x} y2="152" stroke={ink} strokeWidth="2.5" />
              <circle cx={x} cy="64" r="2.5" fill={ink} />
              <line x1={x} y1="64" x2={x - 7} y2="88" stroke={accent} strokeWidth="2.5" />
              <text x={x} y="166" textAnchor="middle" fill={muted} fontSize="9" fontFamily="monospace">
                {['U1', 'V1', 'W1'][i]}
              </text>
            </g>
          ))}
          <rect x="20" y="54" width="68" height="42" rx="4" fill="none" stroke={ring} strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="96" y="78" fill={ink} fontSize="9" fontFamily="monospace">KM1</text>

          <rect x="20" y="110" width="68" height="24" rx="3" fill="none" stroke={ctrl} strokeWidth="2" />
          <text x="108" y="125" fill={ctrlText} fontSize="9" fontFamily="monospace">F1 (OL)</text>

          {/* Control Circuit Right */}
          <line x1="168" y1="26" x2="335" y2="26" stroke={ctrl} strokeWidth="2.5" />
          <rect x="182" y="16" width="38" height="20" rx="3" fill="none" stroke="#EF4444" strokeWidth="2" />
          <text x="201" y="30" textAnchor="middle" fill={ink} fontSize="9" fontFamily="monospace">STOP</text>
          <rect x="234" y="16" width="42" height="20" rx="3" fill="none" stroke="#22C55E" strokeWidth="2" />
          <text x="255" y="30" textAnchor="middle" fill={ink} fontSize="9" fontFamily="monospace">START</text>
          <polyline points="232,26 232,58 278,58 278,26" fill="none" stroke={accent} strokeWidth="2" />
          <text x="255" y="70" textAnchor="middle" fill={accent} fontSize="8" fontFamily="monospace">KM1 13-14</text>

          <polyline points="310,26 310,88" fill="none" stroke={ctrl} strokeWidth="2.5" />
          <rect x="292" y="88" width="36" height="32" rx="2" fill="none" stroke={accent} strokeWidth="2.5" />
          <text x="310" y="108" textAnchor="middle" fill={ink} fontSize="9" fontFamily="monospace">A1/A2</text>
          <line x1="310" y1="120" x2="310" y2="152" stroke={neutral} strokeWidth="2.5" />
          <text x="310" y="165" textAnchor="middle" fill={neutral} fontSize="9" fontFamily="monospace">N / 24V-</text>
        </svg>
      );

    case 'relay_control_coil':
    case 'timer_on_delay':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          <text x="24" y="42" fill={ctrlText} fontSize="11" fontWeight="bold" fontFamily="monospace">+VDC / A1</text>
          <line x1="88" y1="38" x2="132" y2="38" stroke={ctrl} strokeWidth="2.5" />
          <rect x="132" y="24" width="54" height="58" rx="4" fill="none" stroke={accent} strokeWidth="2.5" />
          <text x="159" y="54" textAnchor="middle" fill={ink} fontSize="11" fontWeight="bold" fontFamily="monospace">
            {diagramId === 'timer_on_delay' ? 'KT (t)' : 'COIL'}
          </text>
          <text x="159" y="70" textAnchor="middle" fill={muted} fontSize="9" fontFamily="monospace">A1 / A2</text>
          <line x1="159" y1="82" x2="159" y2="128" stroke={neutral} strokeWidth="2.5" />
          <text x="159" y="144" textAnchor="middle" fill={neutral} fontSize="10" fontFamily="monospace">GND / A2</text>

          {/* Flyback */}
          <line x1="108" y1="38" x2="108" y2="100" stroke={ring} strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="108" y1="100" x2="159" y2="100" stroke={ring} strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Load Contact Side */}
          <line x1="186" y1="52" x2="236" y2="52" stroke={ring} strokeWidth="2" strokeDasharray="4 3" />
          <line x1="242" y1="126" x2="242" y2="78" stroke={live} strokeWidth="3" />
          <line x1="242" y1="78" x2="278" y2="42" stroke={accent} strokeWidth="3" />
          <line x1="286" y1="26" x2="286" y2="52" stroke={live} strokeWidth="3" />
          <text x="298" y="42" fill={ink} fontSize="10" fontFamily="monospace">NO (14)</text>
          <text x="252" y="138" fill={ink} fontSize="10" fontFamily="monospace">COM (11)</text>
        </svg>
      );

    case 'resistor_led_divider':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          <text x="32" y="42" fill={live} fontSize="11" fontWeight="bold" fontFamily="monospace">VCC (+5V)</text>
          <line x1="95" y1="38" x2="132" y2="38" stroke={live} strokeWidth="3" />
          <polyline points="132,38 140,26 152,50 164,26 176,50 188,26 196,38" fill="none" stroke={accent} strokeWidth="3" />
          <text x="164" y="68" textAnchor="middle" fill={ink} fontSize="10" fontFamily="monospace">R = (Vs-Vf)/If</text>
          <line x1="196" y1="38" x2="256" y2="38" stroke={live} strokeWidth="3" />
          <line x1="256" y1="38" x2="256" y2="72" stroke={live} strokeWidth="3" />
          <polygon points="240,72 272,72 256,102" fill={ctrlText} />
          <line x1="238" y1="102" x2="274" y2="102" stroke={ink} strokeWidth="3" />
          <line x1="256" y1="102" x2="256" y2="142" stroke={neutral} strokeWidth="3" />
          <line x1="236" y1="142" x2="276" y2="142" stroke={ink} strokeWidth="3" />
          <line x1="244" y1="148" x2="268" y2="148" stroke={ink} strokeWidth="2.5" />
          <text x="292" y="92" fill={ink} fontSize="10" fontFamily="monospace">LED</text>
          <text x="256" y="165" textAnchor="middle" fill={ink} fontSize="10" fontFamily="monospace">GND (0V)</text>
        </svg>
      );

    case 'capacitor_rc_filter':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          <text x="34" y="48" fill={ctrlText} fontSize="11" fontWeight="bold" fontFamily="monospace">Vin (AC/PWM)</text>
          <line x1="112" y1="44" x2="142" y2="44" stroke={ctrl} strokeWidth="3" />
          <rect x="142" y="34" width="54" height="20" fill="none" stroke={accent} strokeWidth="2.5" />
          <text x="169" y="25" textAnchor="middle" fill={ink} fontSize="10" fontFamily="monospace">R / L</text>
          <line x1="196" y1="44" x2="296" y2="44" stroke={accent} strokeWidth="3" />
          <text x="306" y="48" fill={accent} fontSize="11" fontWeight="bold" fontFamily="monospace">Vout</text>

          <line x1="238" y1="44" x2="238" y2="86" stroke={accent} strokeWidth="3" />
          <line x1="216" y1="86" x2="260" y2="86" stroke={ink} strokeWidth="3.5" />
          <line x1="216" y1="98" x2="260" y2="98" stroke={ink} strokeWidth="3.5" />
          <line x1="238" y1="98" x2="238" y2="140" stroke={neutral} strokeWidth="3" />
          <line x1="218" y1="140" x2="258" y2="140" stroke={ink} strokeWidth="3" />
          <text x="275" y="96" fill={ink} fontSize="10" fontFamily="monospace">C (fc = 1/2πRC)</text>
          <text x="238" y="160" textAnchor="middle" fill={ink} fontSize="10" fontFamily="monospace">GND</text>
        </svg>
      );

    case 'diode_bridge_rectifier':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          <text x="20" y="94" fill={ctrlText} fontSize="11" fontWeight="bold" fontFamily="monospace">AC IN (~)</text>
          <line x1="82" y1="90" x2="122" y2="90" stroke={ctrl} strokeWidth="3" />
          <polygon points="168,36 214,90 168,144 122,90" fill="none" stroke={accent} strokeWidth="3" />
          <text x="168" y="28" textAnchor="middle" fill={live} fontSize="12" fontWeight="bold">+DC</text>
          <text x="168" y="162" textAnchor="middle" fill={neutral} fontSize="12" fontWeight="bold">−GND</text>
          <line x1="168" y1="36" x2="288" y2="36" stroke={live} strokeWidth="3" />
          <line x1="168" y1="144" x2="288" y2="144" stroke={neutral} strokeWidth="3" />

          {/* Filter Cap */}
          <line x1="242" y1="36" x2="242" y2="78" stroke={live} strokeWidth="2.5" />
          <line x1="226" y1="78" x2="258" y2="78" stroke={ink} strokeWidth="3" />
          <line x1="226" y1="90" x2="258" y2="90" stroke={ink} strokeWidth="3" />
          <line x1="242" y1="90" x2="242" y2="144" stroke={neutral} strokeWidth="2.5" />
          <text x="266" y="88" fill={ink} fontSize="10" fontFamily="monospace">C Filter</text>
          <text x="296" y="40" fill={live} fontSize="10" fontFamily="monospace">V+</text>
          <text x="296" y="148" fill={neutral} fontSize="10" fontFamily="monospace">0V</text>
        </svg>
      );

    case 'mosfet_low_side_driver':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          <text x="18" y="108" fill={ctrlText} fontSize="10" fontWeight="bold" fontFamily="monospace">PWM / SIG</text>
          <line x1="80" y1="104" x2="112" y2="104" stroke={ctrl} strokeWidth="3" />
          <rect x="112" y="96" width="38" height="16" fill="none" stroke={ink} strokeWidth="2" />
          <text x="131" y="88" textAnchor="middle" fill={ink} fontSize="9" fontFamily="monospace">Rg 220Ω</text>
          <line x1="150" y1="104" x2="196" y2="104" stroke={ctrl} strokeWidth="3" />

          {/* Transistor / MOSFET Block */}
          <circle cx="222" cy="104" r="28" fill="none" stroke={accent} strokeWidth="2.5" />
          <text x="222" y="108" textAnchor="middle" fill={ink} fontSize="10" fontWeight="bold" fontFamily="monospace">Q1</text>

          {/* Load above Drain */}
          <line x1="222" y1="24" x2="222" y2="42" stroke={live} strokeWidth="3" />
          <rect x="196" y="42" width="52" height="24" rx="3" fill="none" stroke={live} strokeWidth="2" />
          <text x="222" y="58" textAnchor="middle" fill={ink} fontSize="9" fontFamily="monospace">LOAD</text>
          <line x1="222" y1="66" x2="222" y2="76" stroke={ink} strokeWidth="3" />

          <line x1="222" y1="132" x2="222" y2="156" stroke={neutral} strokeWidth="3" />
          <text x="222" y="170" textAnchor="middle" fill={neutral} fontSize="10" fontFamily="monospace">GND</text>
          <text x="222" y="16" textAnchor="middle" fill={live} fontSize="10" fontFamily="monospace">+V Supply</text>
        </svg>
      );

    case 'voltage_regulator_7805':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          <text x="18" y="46" fill={live} fontSize="10" fontWeight="bold" fontFamily="monospace">VIN (7-24V)</text>
          <line x1="88" y1="42" x2="146" y2="42" stroke={live} strokeWidth="3" />
          <rect x="146" y="24" width="76" height="54" rx="4" fill="none" stroke={accent} strokeWidth="2.5" />
          <text x="184" y="48" textAnchor="middle" fill={ink} fontSize="11" fontWeight="bold" fontFamily="monospace">7805 / REG</text>
          <text x="184" y="64" textAnchor="middle" fill={muted} fontSize="9" fontFamily="monospace">IN  GND  OUT</text>
          <line x1="222" y1="42" x2="306" y2="42" stroke={earth} strokeWidth="3" />
          <text x="312" y="46" fill={earthText} fontSize="10" fontWeight="bold" fontFamily="monospace">+5V</text>

          {/* Input & Output Caps */}
          <line x1="115" y1="42" x2="115" y2="140" stroke={ring} strokeWidth="2" strokeDasharray="3 3" />
          <line x1="264" y1="42" x2="264" y2="140" stroke={ring} strokeWidth="2" strokeDasharray="3 3" />
          <line x1="184" y1="78" x2="184" y2="140" stroke={neutral} strokeWidth="3" />
          <line x1="80" y1="140" x2="290" y2="140" stroke={neutral} strokeWidth="3" />
          <text x="184" y="160" textAnchor="middle" fill={neutral} fontSize="10" fontFamily="monospace">COMMON GND (Cin 0.33µF / Cout 0.1µF)</text>
        </svg>
      );

    case 'mcu_gpio_sensor':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          <rect x="34" y="28" width="110" height="124" rx="6" fill="none" stroke={accent} strokeWidth="2.5" />
          <text x="89" y="54" textAnchor="middle" fill={ink} fontSize="11" fontWeight="bold" fontFamily="monospace">MCU / IC</text>
          <text x="128" y="68" textAnchor="end" fill={live} fontSize="9" fontFamily="monospace">5V / 3.3V</text>
          <text x="128" y="96" textAnchor="end" fill={ctrlText} fontSize="9" fontFamily="monospace">GPIO / ADC</text>
          <text x="128" y="124" textAnchor="end" fill={neutral} fontSize="9" fontFamily="monospace">GND</text>

          <line x1="144" y1="64" x2="226" y2="64" stroke={live} strokeWidth="2.5" />
          <line x1="144" y1="92" x2="226" y2="92" stroke={ctrl} strokeWidth="2.5" />
          <line x1="144" y1="120" x2="226" y2="120" stroke={neutral} strokeWidth="2.5" />

          <rect x="226" y="42" width="102" height="96" rx="6" fill="none" stroke={ink} strokeWidth="2.5" />
          <text x="277" y="88" textAnchor="middle" fill={ink} fontSize="10" fontWeight="bold" fontFamily="monospace">SENSOR /</text>
          <text x="277" y="104" textAnchor="middle" fill={muted} fontSize="9" fontFamily="monospace">LOGIC MODULE</text>
        </svg>
      );

    case 'vfd_three_phase_motor':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          <text x="16" y="58" fill={live} fontSize="10" fontWeight="bold" fontFamily="monospace">1Φ / 3Φ</text>
          <text x="16" y="74" fill={live} fontSize="10" fontFamily="monospace">L1 L2 (L3)</text>
          <line x1="74" y1="54" x2="112" y2="54" stroke={live} strokeWidth="2.5" />
          <line x1="74" y1="74" x2="112" y2="74" stroke={live} strokeWidth="2.5" />
          <line x1="74" y1="94" x2="112" y2="94" stroke={live} strokeWidth="2.5" />

          <rect x="112" y="28" width="104" height="106" rx="5" fill="none" stroke={accent} strokeWidth="2.5" />
          <text x="164" y="64" textAnchor="middle" fill={ink} fontSize="12" fontWeight="bold" fontFamily="monospace">VFD DRIVE</text>
          <text x="164" y="84" textAnchor="middle" fill={ctrlText} fontSize="10" fontFamily="monospace">PWM 0–400Hz</text>
          <text x="164" y="104" textAnchor="middle" fill={muted} fontSize="9" fontFamily="monospace">U   V   W</text>

          <line x1="216" y1="58" x2="262" y2="58" stroke={ctrl} strokeWidth="2.5" />
          <line x1="216" y1="78" x2="262" y2="78" stroke={ctrl} strokeWidth="2.5" />
          <line x1="216" y1="98" x2="262" y2="98" stroke={ctrl} strokeWidth="2.5" />

          <circle cx="294" cy="78" r="32" fill="none" stroke={ink} strokeWidth="3" />
          <text x="294" y="82" textAnchor="middle" fill={ink} fontSize="13" fontWeight="bold" fontFamily="monospace">M 3~</text>
          <line x1="164" y1="134" x2="294" y2="134" stroke={earth} strokeWidth="2.5" strokeDasharray="5 3" />
          <line x1="294" y1="110" x2="294" y2="134" stroke={earth} strokeWidth="2.5" />
          <text x="228" y="152" textAnchor="middle" fill={earthText} fontSize="9" fontFamily="monospace">PE Shield Ground</text>
        </svg>
      );

    case 'stepper_driver_coil':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          <rect x="28" y="34" width="94" height="112" rx="5" fill="none" stroke={ink} strokeWidth="2.5" />
          <text x="75" y="74" textAnchor="middle" fill={ink} fontSize="10" fontWeight="bold" fontFamily="monospace">DRIVER</text>
          <text x="75" y="92" textAnchor="middle" fill={ctrlText} fontSize="9" fontFamily="monospace">STEP / DIR</text>
          <text x="75" y="110" textAnchor="middle" fill={muted} fontSize="9" fontFamily="monospace">ENCODER FB</text>

          <line x1="122" y1="54" x2="228" y2="54" stroke={live} strokeWidth="2.5" />
          <line x1="122" y1="76" x2="228" y2="76" stroke={ctrl} strokeWidth="2.5" />
          <line x1="122" y1="104" x2="228" y2="104" stroke={neutral} strokeWidth="2.5" />
          <line x1="122" y1="126" x2="228" y2="126" stroke={earth} strokeWidth="2.5" />

          <text x="175" y="47" textAnchor="middle" fill={ink} fontSize="9" fontFamily="monospace">A+ / A−   B+ / B−</text>

          <circle cx="272" cy="90" r="42" fill="none" stroke={accent} strokeWidth="3" />
          <text x="272" y="88" textAnchor="middle" fill={ink} fontSize="11" fontWeight="bold" fontFamily="monospace">STEPPER</text>
          <text x="272" y="104" textAnchor="middle" fill={muted} fontSize="9" fontFamily="monospace">OR SERVO</text>
        </svg>
      );

    case 'plc_io_wiring':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          {/* Input Side */}
          <rect x="20" y="32" width="76" height="44" rx="4" fill="none" stroke={ctrl} strokeWidth="2" />
          <text x="58" y="58" textAnchor="middle" fill={ink} fontSize="9" fontFamily="monospace">SENSOR 24V</text>
          <line x1="96" y1="54" x2="132" y2="54" stroke={ctrl} strokeWidth="2.5" />

          <rect x="132" y="22" width="96" height="136" rx="6" fill="none" stroke={accent} strokeWidth="3" />
          <text x="180" y="52" textAnchor="middle" fill={ink} fontSize="12" fontWeight="bold" fontFamily="monospace">PLC CPU</text>
          <text x="180" y="72" textAnchor="middle" fill={ctrlText} fontSize="9" fontFamily="monospace">DI: I0.0 .. I0.7</text>
          <text x="180" y="92" textAnchor="middle" fill={earthText} fontSize="9" fontFamily="monospace">DO: Q0.0 .. Q0.5</text>
          <text x="180" y="114" textAnchor="middle" fill={muted} fontSize="9" fontFamily="monospace">24V DC / L+ M</text>

          {/* Output Side */}
          <line x1="228" y1="88" x2="264" y2="88" stroke={earth} strokeWidth="2.5" />
          <rect x="264" y="64" width="76" height="48" rx="4" fill="none" stroke={earth} strokeWidth="2" />
          <text x="302" y="86" textAnchor="middle" fill={ink} fontSize="9" fontFamily="monospace">ACTUATOR</text>
          <text x="302" y="100" textAnchor="middle" fill={muted} fontSize="8" fontFamily="monospace">VALVE / COIL</text>
        </svg>
      );

    case 'scada_fieldbus_network':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          <rect x="24" y="24" width="84" height="48" rx="4" fill="none" stroke={accent} strokeWidth="2.5" />
          <text x="66" y="52" textAnchor="middle" fill={ink} fontSize="10" fontWeight="bold" fontFamily="monospace">SCADA / HMI</text>

          <rect x="140" y="24" width="84" height="48" rx="4" fill="none" stroke={ink} strokeWidth="2.5" />
          <text x="182" y="52" textAnchor="middle" fill={ink} fontSize="10" fontWeight="bold" fontFamily="monospace">SWITCH / GW</text>

          <rect x="256" y="24" width="84" height="48" rx="4" fill="none" stroke={ctrl} strokeWidth="2.5" />
          <text x="298" y="52" textAnchor="middle" fill={ink} fontSize="10" fontWeight="bold" fontFamily="monospace">PLC MASTER</text>

          <line x1="108" y1="48" x2="140" y2="48" stroke={accent} strokeWidth="2.5" />
          <line x1="224" y1="48" x2="256" y2="48" stroke={accent} strokeWidth="2.5" />

          {/* RS485 Bus */}
          <line x1="60" y1="115" x2="310" y2="115" stroke={ctrl} strokeWidth="3" />
          <line x1="298" y1="72" x2="298" y2="115" stroke={ctrl} strokeWidth="2.5" />
          <text x="180" y="105" textAnchor="middle" fill={ctrlText} fontSize="9" fontFamily="monospace">RS-485 Modbus / PROFINET Bus (120Ω Term)</text>
          {[75, 165, 255].map((x, idx) => (
            <g key={x}>
              <line x1={x} y1="115" x2={x} y2="132" stroke={ctrl} strokeWidth="2" />
              <rect x={x - 30} y="132" width="60" height="28" rx="3" fill="none" stroke={ring} strokeWidth="2" />
              <text x={x} y="150" textAnchor="middle" fill={ink} fontSize="9" fontFamily="monospace">
                NODE #{idx + 1}
              </text>
            </g>
          ))}
        </svg>
      );

    case 'solar_mppt_inverter_battery':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          <rect x="16" y="34" width="66" height="58" rx="4" fill="none" stroke={accent} strokeWidth="2.5" />
          <text x="49" y="60" textAnchor="middle" fill={ink} fontSize="10" fontWeight="bold" fontFamily="monospace">PV ARRAY</text>
          <text x="49" y="76" textAnchor="middle" fill={ctrlText} fontSize="8" fontFamily="monospace">+DC / −DC</text>

          <line x1="82" y1="63" x2="118" y2="63" stroke={live} strokeWidth="3" />
          <rect x="118" y="34" width="84" height="58" rx="4" fill="none" stroke={ctrl} strokeWidth="2.5" />
          <text x="160" y="60" textAnchor="middle" fill={ink} fontSize="10" fontWeight="bold" fontFamily="monospace">MPPT / PWM</text>
          <text x="160" y="76" textAnchor="middle" fill={muted} fontSize="8" fontFamily="monospace">CHARGE CTRL</text>

          <line x1="160" y1="92" x2="160" y2="124" stroke={earth} strokeWidth="3" />
          <rect x="118" y="124" width="84" height="36" rx="4" fill="none" stroke={earth} strokeWidth="2.5" />
          <text x="160" y="146" textAnchor="middle" fill={ink} fontSize="10" fontWeight="bold" fontFamily="monospace">BATTERY 24/48V</text>

          <line x1="202" y1="63" x2="246" y2="63" stroke={live} strokeWidth="3" />
          <rect x="246" y="34" width="96" height="58" rx="4" fill="none" stroke={ink} strokeWidth="2.5" />
          <text x="294" y="58" textAnchor="middle" fill={ink} fontSize="10" fontWeight="bold" fontFamily="monospace">INVERTER</text>
          <text x="294" y="74" textAnchor="middle" fill={accent} fontSize="9" fontFamily="monospace">DC → 230V AC</text>
        </svg>
      );

    case 'solar_dc_protection':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          <text x="18" y="42" fill={live} fontSize="10" fontWeight="bold" fontFamily="monospace">PV +</text>
          <text x="18" y="102" fill={neutral} fontSize="10" fontWeight="bold" fontFamily="monospace">PV −</text>
          <line x1="54" y1="38" x2="108" y2="38" stroke={live} strokeWidth="3" />
          <line x1="54" y1="98" x2="108" y2="98" stroke={neutral} strokeWidth="3" />

          <rect x="108" y="24" width="60" height="88" rx="4" fill="none" stroke={ctrl} strokeWidth="2" />
          <text x="138" y="72" textAnchor="middle" fill={ink} fontSize="9" fontWeight="bold" fontFamily="monospace">DC FUSE</text>
          <line x1="168" y1="38" x2="210" y2="38" stroke={live} strokeWidth="3" />
          <line x1="168" y1="98" x2="210" y2="98" stroke={neutral} strokeWidth="3" />

          {/* DC SPD + DC MCB */}
          <rect x="210" y="24" width="68" height="88" rx="4" fill="none" stroke={accent} strokeWidth="2.5" />
          <text x="244" y="64" textAnchor="middle" fill={ink} fontSize="9" fontWeight="bold" fontFamily="monospace">DC SPD</text>
          <text x="244" y="80" textAnchor="middle" fill={muted} fontSize="8" fontFamily="monospace">&amp; DC MCB</text>
          <line x1="244" y1="112" x2="244" y2="152" stroke={earth} strokeWidth="3" />
          <text x="244" y="166" textAnchor="middle" fill={earthText} fontSize="9" fontFamily="monospace">EARTHING PE</text>

          <line x1="278" y1="38" x2="335" y2="38" stroke={live} strokeWidth="3" />
          <line x1="278" y1="98" x2="335" y2="98" stroke={neutral} strokeWidth="3" />
          <text x="316" y="28" fill={ink} fontSize="9" fontFamily="monospace">TO MPPT</text>
        </svg>
      );

    case 'multimeter_measurement':
    case 'clamp_meter_measurement':
    case 'oscilloscope_probe_test':
    case 'megger_insulation_test':
      return (
        <svg viewBox="0 0 360 180" className={className} aria-hidden="true">
          <rect x="34" y="28" width="96" height="114" rx="8" fill="none" stroke={accent} strokeWidth="2.5" />
          <text x="82" y="60" textAnchor="middle" fill={ink} fontSize="10" fontWeight="bold" fontFamily="monospace">
            {diagramId === 'oscilloscope_probe_test'
              ? 'SCOPE CH1'
              : diagramId === 'megger_insulation_test'
                ? 'MEGGER 500V'
                : diagramId === 'clamp_meter_measurement'
                  ? 'CLAMP CT'
                  : 'DMM / TESTER'}
          </text>
          <text x="82" y="84" textAnchor="middle" fill={ctrlText} fontSize="9" fontFamily="monospace">
            {diagramId === 'multimeter_measurement'
              ? 'V: PARALLEL | A: SERIES'
              : diagramId === 'clamp_meter_measurement'
                ? '1 WIRE ONLY'
                : diagramId === 'oscilloscope_probe_test'
                  ? '10x PROBE + GND'
                  : 'POWER OFF (LOTO)'}
          </text>
          <line x1="130" y1="54" x2="226" y2="54" stroke={live} strokeWidth="3" />
          <line x1="130" y1="116" x2="226" y2="116" stroke={neutral} strokeWidth="3" />
          <rect x="226" y="42" width="100" height="86" rx="6" fill="none" stroke={ink} strokeWidth="2.5" />
          <text x="276" y="88" textAnchor="middle" fill={ink} fontSize="10" fontWeight="bold" fontFamily="monospace">DUT / CIRCUIT</text>
        </svg>
      );
  }
}
