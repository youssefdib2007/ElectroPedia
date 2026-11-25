import type { ComponentArtworkId } from '../types/electronics';

interface ComponentArtworkProps {
  artworkId: ComponentArtworkId;
  mode: 'physical' | 'schematic';
  className?: string;
}

export function ComponentArtwork({ artworkId, mode, className = 'w-full h-full' }: ComponentArtworkProps) {
  if (mode === 'schematic') {
    return <SchematicSymbol artworkId={artworkId} className={className} />;
  }
  return <PhysicalShape artworkId={artworkId} className={className} />;
}

function PhysicalShape({ artworkId, className }: { artworkId: ComponentArtworkId; className: string }) {
  switch (artworkId) {
    // ── RESIDENTIAL ELECTRICITY ──
    case 'light_switch':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="58" y="18" width="84" height="84" rx="8" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
          <rect x="70" y="30" width="60" height="60" rx="5" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="74" y="34" width="52" height="52" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1="92" y1="76" x2="108" y2="76" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'socket_outlet':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="58" y="18" width="84" height="84" rx="8" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
          <circle cx="100" cy="60" r="28" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="88" cy="60" r="5" fill="#0F172A" />
          <circle cx="112" cy="60" r="5" fill="#0F172A" />
          <rect x="97" y="33" width="6" height="8" rx="1" fill="#F59E0B" />
          <rect x="97" y="79" width="6" height="8" rx="1" fill="#F59E0B" />
        </svg>
      );

    case 'lamp_led':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <path d="M72 52 A28 28 0 1 1 128 52 C128 66 116 74 114 82 L86 82 C84 74 72 66 72 52 Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
          <rect x="86" y="82" width="28" height="10" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="89" y="92" width="22" height="14" rx="2" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
          <line x1="90" y1="97" x2="110" y2="97" stroke="#475569" strokeWidth="1.5" />
          <line x1="90" y1="102" x2="110" y2="102" stroke="#475569" strokeWidth="1.5" />
          <rect x="95" y="106" width="10" height="4" rx="1" fill="#1E293B" />
          <line x1="93" y1="42" x2="93" y2="62" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          <line x1="107" y1="42" x2="107" y2="62" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'wire_conductor':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="26" y="34" width="108" height="16" rx="4" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
          <line x1="134" y1="42" x2="174" y2="42" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
          <rect x="26" y="68" width="108" height="16" rx="4" fill="#2563EB" stroke="#1E40AF" strokeWidth="1.5" />
          <line x1="134" y1="76" x2="174" y2="76" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );

    case 'power_cable':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="24" y="40" width="90" height="40" rx="6" fill="#334155" stroke="#0F172A" strokeWidth="2" />
          <rect x="114" y="44" width="38" height="10" rx="2" fill="#92400E" />
          <rect x="114" y="55" width="38" height="10" rx="2" fill="#2563EB" />
          <rect x="114" y="66" width="38" height="10" rx="2" fill="#22C55E" />
          <line x1="152" y1="49" x2="176" y2="49" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
          <line x1="152" y1="60" x2="176" y2="60" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
          <line x1="152" y1="71" x2="176" y2="71" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'mcb_breaker':
    case 'rcd_rcbo':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="64" y="12" width={artworkId === 'rcd_rcbo' ? 76 : 56} height="96" rx="5" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
          <circle cx="92" cy="24" r="5" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
          <circle cx="92" cy="96" r="5" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
          <rect x="74" y="42" width="36" height="36" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          <rect x="78" y="48" width="28" height="14" rx="2" fill={artworkId === 'rcd_rcbo' ? '#2563EB' : '#0284C7'} />
          <text x="92" y="74" textAnchor="middle" fill="#0F172A" fontSize="9" fontWeight="bold" fontFamily="monospace">
            {artworkId === 'rcd_rcbo' ? '30mA' : 'C16'}
          </text>
          {artworkId === 'rcd_rcbo' && (
            <>
              <circle cx="122" cy="54" r="7" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
              <text x="122" y="57" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">T</text>
            </>
          )}
        </svg>
      );

    case 'fuse':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="40" y="42" width="120" height="36" rx="4" fill="#E0F2FE" fillOpacity="0.6" stroke="#94A3B8" strokeWidth="2" />
          <rect x="34" y="40" width="22" height="40" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
          <rect x="144" y="40" width="22" height="40" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
          <line x1="56" y1="60" x2="144" y2="60" stroke="#64748B" strokeWidth="2.5" />
          <text x="155" y="64" textAnchor="middle" fill="#334155" fontSize="9" fontFamily="monospace">5A</text>
        </svg>
      );

    case 'distribution_board':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="42" y="14" width="116" height="92" rx="6" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
          <rect x="52" y="24" width="96" height="72" rx="3" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="56" y1="56" x2="144" y2="56" stroke="#64748B" strokeWidth="3" />
          {[62, 82, 102, 122].map((bx, i) => (
            <g key={bx}>
              <rect x={bx} y="34" width="16" height="44" rx="2" fill="#FFFFFF" stroke="#64748B" strokeWidth="1.5" />
              <rect x={bx + 3} y="48" width="10" height="8" rx="1" fill={i === 0 ? '#EF4444' : '#2563EB'} />
            </g>
          ))}
        </svg>
      );

    case 'junction_box':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="54" y="24" width="92" height="72" rx="6" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
          <circle cx="64" cy="34" r="3" fill="#475569" />
          <circle cx="136" cy="34" r="3" fill="#475569" />
          <circle cx="64" cy="86" r="3" fill="#475569" />
          <circle cx="136" cy="86" r="3" fill="#475569" />
          <circle cx="54" cy="60" r="7" fill="#334155" />
          <circle cx="146" cy="60" r="7" fill="#334155" />
          <circle cx="100" cy="24" r="7" fill="#334155" />
          <text x="100" y="64" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="bold" fontFamily="monospace">IP65</text>
        </svg>
      );

    case 'earthing_system':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="94" y="20" width="12" height="84" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          <rect x="86" y="22" width="28" height="12" rx="2" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
          <path d="M40 28 H86" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />
          <line x1="60" y1="68" x2="140" y2="68" stroke="#64748B" strokeWidth="2" strokeDasharray="4 4" />
          <polygon points="94,104 106,104 100,112" fill="#92400E" />
        </svg>
      );

    // ── INDUSTRIAL ELECTRICITY ──
    case 'contactor':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="54" y="16" width="92" height="88" rx="6" fill="#F1F5F9" stroke="#64748B" strokeWidth="2" />
          <rect x="62" y="22" width="76" height="18" rx="2" fill="#CBD5E1" />
          <circle cx="75" cy="31" r="4" fill="#475569" />
          <circle cx="100" cy="31" r="4" fill="#475569" />
          <circle cx="125" cy="31" r="4" fill="#475569" />
          <rect x="66" y="48" width="68" height="26" rx="3" fill="#1E293B" />
          <rect x="86" y="54" width="28" height="14" rx="2" fill="#0284C7" />
          <rect x="62" y="80" width="76" height="18" rx="2" fill="#CBD5E1" />
          <circle cx="75" cy="89" r="4" fill="#475569" />
          <circle cx="100" cy="89" r="4" fill="#475569" />
          <circle cx="125" cy="89" r="4" fill="#475569" />
        </svg>
      );

    case 'relay':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="68" y="84" width="6" height="22" rx="1" fill="#94A3B8" />
          <rect x="97" y="84" width="6" height="22" rx="1" fill="#94A3B8" />
          <rect x="126" y="84" width="6" height="22" rx="1" fill="#94A3B8" />
          <rect x="54" y="20" width="92" height="66" rx="6" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
          <text x="100" y="48" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">24VDC COIL</text>
          <text x="100" y="66" textAnchor="middle" fill="#E0F2FE" fontSize="10" fontFamily="monospace">10A 250VAC</text>
        </svg>
      );

    case 'thermal_overload':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="60" y="24" width="80" height="74" rx="5" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <line x1="74" y1="12" x2="74" y2="24" stroke="#D97706" strokeWidth="4" />
          <line x1="100" y1="12" x2="100" y2="24" stroke="#D97706" strokeWidth="4" />
          <line x1="126" y1="12" x2="126" y2="24" stroke="#D97706" strokeWidth="4" />
          <circle cx="84" cy="54" r="13" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
          <line x1="84" y1="45" x2="84" y2="63" stroke="#0F172A" strokeWidth="2.5" />
          <rect x="110" y="42" width="18" height="14" rx="2" fill="#2563EB" />
          <rect x="110" y="62" width="18" height="14" rx="2" fill="#EF4444" />
          <text x="100" y="90" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">LRD THERMAL</text>
        </svg>
      );

    case 'industrial_timer':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="66" y="16" width="68" height="88" rx="5" fill="#F1F5F9" stroke="#475569" strokeWidth="2" />
          <circle cx="100" cy="54" r="22" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2.5" />
          <line x1="100" y1="54" x2="112" y2="42" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          <rect x="76" y="84" width="48" height="12" rx="2" fill="#1E293B" />
          <text x="100" y="93" textAnchor="middle" fill="#00BFFF" fontSize="8" fontFamily="monospace">0.1s–10h</text>
        </svg>
      );

    case 'push_button':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="64" y="46" width="72" height="44" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <circle cx="100" cy="40" r="24" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
          <circle cx="100" cy="40" r="16" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
          <rect x="80" y="90" width="12" height="14" fill="#94A3B8" />
          <rect x="108" y="90" width="12" height="14" fill="#94A3B8" />
        </svg>
      );

    case 'selector_switch':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="64" y="54" width="72" height="40" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <circle cx="100" cy="42" r="24" fill="#334155" stroke="#64748B" strokeWidth="2" />
          <rect x="94" y="20" width="12" height="42" rx="4" fill="#F8FAFC" transform="rotate(-30 100 42)" />
        </svg>
      );

    case 'limit_switch':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="70" y="44" width="60" height="58" rx="4" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
          <rect x="88" y="28" width="24" height="18" rx="2" fill="#475569" />
          <line x1="100" y1="34" x2="142" y2="18" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
          <circle cx="144" cy="18" r="8" fill="#1E293B" stroke="#CBD5E1" strokeWidth="2" />
        </svg>
      );

    case 'motor_starter':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="58" y="14" width="84" height="92" rx="6" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
          <rect x="70" y="24" width="60" height="72" rx="4" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="100" cy="44" r="11" fill="#22C55E" />
          <circle cx="100" cy="76" r="11" fill="#EF4444" />
          <text x="100" y="48" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">I</text>
          <text x="100" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">O</text>
        </svg>
      );

    case 'terminal_block':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          {[56, 78, 100, 122].map((x, idx) => (
            <g key={x}>
              <rect
                x={x}
                y="24"
                width="20"
                height="72"
                rx="2"
                fill={idx === 2 ? '#2563EB' : idx === 3 ? '#22C55E' : '#CBD5E1'}
                stroke="#475569"
                strokeWidth="1.5"
              />
              <circle cx={x + 10} cy="40" r="4" fill="#334155" />
              <circle cx={x + 10} cy="80" r="4" fill="#334155" />
            </g>
          ))}
        </svg>
      );

    case 'industrial_sensor':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="28" y="54" width="32" height="12" rx="2" fill="#0F172A" />
          <rect x="60" y="44" width="76" height="32" rx="3" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
          <rect x="136" y="46" width="24" height="28" rx="3" fill="#2563EB" stroke="#1E40AF" strokeWidth="1.5" />
          {[76, 88, 100, 112].map((tx) => (
            <line key={tx} x1={tx} y1="44" x2={tx} y2="76" stroke="#64748B" strokeWidth="2" />
          ))}
          <circle cx="70" cy="60" r="4" fill="#F59E0B" />
        </svg>
      );

    // ── ELECTRONICS ──
    case 'resistor':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="16" y1="60" x2="54" y2="60" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
          <line x1="146" y1="60" x2="184" y2="60" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
          <path d="M52 44 L148 44 L148 76 L52 76 Z" fill="#E7C89C" stroke="#B48A5A" strokeWidth="2" />
          <rect x="65" y="42" width="8" height="36" fill="#78350F" />
          <rect x="83" y="44" width="8" height="32" fill="#1E293B" />
          <rect x="101" y="44" width="8" height="32" fill="#DC2626" />
          <rect x="125" y="42" width="8" height="36" fill="#CA8A04" />
        </svg>
      );

    case 'electrolytic_capacitor':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="84" y="76" width="5" height="34" rx="2" fill="#94A3B8" />
          <rect x="111" y="76" width="5" height="24" rx="2" fill="#94A3B8" />
          <rect x="72" y="20" width="56" height="58" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="2" />
          <ellipse cx="100" cy="20" rx="28" ry="6" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
          <rect x="108" y="24" width="14" height="53" fill="#E2E8F0" />
          <text x="90" y="54" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">470µF</text>
        </svg>
      );

    case 'inductor':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="62" y1="88" x2="62" y2="108" stroke="#B45309" strokeWidth="4" strokeLinecap="round" />
          <line x1="138" y1="88" x2="138" y2="108" stroke="#B45309" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="54" r="34" fill="none" stroke="#334155" strokeWidth="18" />
          <circle cx="100" cy="54" r="34" fill="none" stroke="#D97706" strokeWidth="20" strokeDasharray="5 4" />
        </svg>
      );

    case 'diode':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="20" y1="60" x2="60" y2="60" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
          <line x1="140" y1="60" x2="180" y2="60" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
          <rect x="60" y="40" width="80" height="40" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <rect x="118" y="40" width="12" height="40" fill="#CBD5E1" />
          <text x="88" y="64" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">1N4007</text>
        </svg>
      );

    case 'led':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="86" y="72" width="5" height="38" rx="2" fill="#94A3B8" />
          <rect x="109" y="72" width="5" height="28" rx="2" fill="#94A3B8" />
          <path d="M74 64 L74 38 A26 26 0 0 1 126 38 L126 64 Z" fill="#EF4444" fillOpacity="0.88" stroke="#B91C1C" strokeWidth="2" />
          <rect x="70" y="64" width="60" height="10" rx="2" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
        </svg>
      );

    case 'bjt_npn':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="76" y="68" width="5" height="38" rx="2" fill="#94A3B8" />
          <rect x="97.5" y="68" width="5" height="38" rx="2" fill="#94A3B8" />
          <rect x="119" y="68" width="5" height="38" rx="2" fill="#94A3B8" />
          <path d="M70 30 Q100 16 130 30 L130 68 L70 68 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <text x="100" y="52" textAnchor="middle" fill="#E2E8F0" fontSize="10" fontFamily="monospace">2N2222</text>
        </svg>
      );

    case 'mosfet':
    case 'regulator_7805':
    case 'thyristor': {
      const label =
        artworkId === 'mosfet' ? 'IRF540N' : artworkId === 'thyristor' ? 'BT136' : 'L7805CV';
      const pins =
        artworkId === 'mosfet' ? 'G   D   S' : artworkId === 'thyristor' ? 'A1 A2 G' : 'I   G   O';
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="74" y="80" width="5" height="30" rx="2" fill="#94A3B8" />
          <rect x="97.5" y="80" width="5" height="30" rx="2" fill="#94A3B8" />
          <rect x="121" y="80" width="5" height="30" rx="2" fill="#94A3B8" />
          <rect x="68" y="14" width="64" height="30" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
          <circle cx="100" cy="28" r="8" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
          <rect x="68" y="42" width="64" height="40" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <text x="100" y="60" textAnchor="middle" fill="#F8FAFC" fontSize="10" fontWeight="bold" fontFamily="monospace">{label}</text>
          <text x="100" y="74" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="monospace">{pins}</text>
        </svg>
      );
    }

    case 'timer_555':
    case 'logic_gate': {
      const chipLabel = artworkId === 'timer_555' ? 'NE555 / IC' : '74HC08';
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          {[0, 1, 2, 3].map((idx) => (
            <g key={idx}>
              <rect x={68 + idx * 20} y="20" width="7" height="14" rx="1" fill="#94A3B8" />
              <rect x={68 + idx * 20} y="86" width="7" height="14" rx="1" fill="#94A3B8" />
            </g>
          ))}
          <rect x="58" y="32" width="84" height="56" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <text x="100" y="64" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="bold" fontFamily="monospace">{chipLabel}</text>
        </svg>
      );
    }

    case 'microcontroller':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          {Array.from({ length: 10 }).map((_, idx) => (
            <g key={idx}>
              <rect x={38 + idx * 13} y="24" width="5" height="12" fill="#94A3B8" />
              <rect x={38 + idx * 13} y="84" width="5" height="12" fill="#94A3B8" />
            </g>
          ))}
          <rect x="30" y="34" width="140" height="52" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <text x="100" y="64" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="bold" fontFamily="monospace">MCU 32-BIT</text>
        </svg>
      );

    case 'pcb_board':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="28" y="20" width="144" height="80" rx="5" fill="#15803D" stroke="#166534" strokeWidth="2" />
          <circle cx="38" cy="30" r="4" fill="#F59E0B" />
          <circle cx="162" cy="30" r="4" fill="#F59E0B" />
          <circle cx="38" cy="90" r="4" fill="#F59E0B" />
          <circle cx="162" cy="90" r="4" fill="#F59E0B" />
          <rect x="76" y="42" width="48" height="36" rx="2" fill="#1E293B" />
          <polyline points="42,60 76,60" fill="none" stroke="#FCD34D" strokeWidth="2.5" />
          <polyline points="124,60 158,60" fill="none" stroke="#FCD34D" strokeWidth="2.5" />
          <polyline points="100,26 100,42" fill="none" stroke="#FCD34D" strokeWidth="2.5" />
        </svg>
      );

    // ── ELECTRIC MOTORS ──
    case 'dc_motor':
    case 'ac_motor':
    case 'single_phase_motor':
    case 'three_phase_motor':
    case 'induction_motor':
    case 'synchronous_motor': {
      const bodyColor =
        artworkId === 'three_phase_motor' || artworkId === 'induction_motor'
          ? '#334155'
          : artworkId === 'synchronous_motor'
            ? '#0369A1'
            : '#64748B';
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="148" y="54" width="32" height="12" rx="2" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
          <rect x="44" y="28" width="96" height="64" rx="8" fill={bodyColor} stroke="#1E293B" strokeWidth="2" />
          {[38, 48, 58, 68, 78].map((y) => (
            <line key={y} x1="52" y1={y} x2="128" y2={y} stroke="#94A3B8" strokeWidth="2" opacity="0.55" />
          ))}
          <rect x="74" y="16" width="36" height="14" rx="2" fill="#1E293B" />
          {artworkId === 'single_phase_motor' && (
            <rect x="80" y="92" width="28" height="14" rx="4" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
          )}
        </svg>
      );
    }

    case 'stepper_motor':
    case 'servo_motor':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="142" y="54" width="34" height="12" rx="2" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
          <rect x="52" y="24" width="88" height="72" rx="4" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <rect x="64" y="34" width="64" height="52" rx="2" fill="#334155" />
          <circle cx="96" cy="60" r="14" fill="#475569" stroke="#94A3B8" strokeWidth="1.5" />
          <line x1="32" y1="74" x2="52" y2="74" stroke="#EF4444" strokeWidth="3" />
          <line x1="32" y1="82" x2="52" y2="82" stroke="#22C55E" strokeWidth="3" />
        </svg>
      );

    case 'vfd_drive':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="62" y="14" width="76" height="92" rx="6" fill="#334155" stroke="#0F172A" strokeWidth="2" />
          <rect x="74" y="24" width="52" height="24" rx="2" fill="#0F172A" />
          <text x="100" y="40" textAnchor="middle" fill="#22C55E" fontSize="11" fontWeight="bold" fontFamily="monospace">50.0 Hz</text>
          <circle cx="88" cy="70" r="9" fill="#CBD5E1" />
          <rect x="108" y="62" width="16" height="16" rx="2" fill="#EF4444" />
          <rect x="74" y="92" width="52" height="8" rx="1" fill="#64748B" />
        </svg>
      );

    // ── AUTOMATION ──
    case 'plc_unit':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="44" y="18" width="112" height="84" rx="5" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <rect x="52" y="24" width="96" height="12" rx="2" fill="#475569" />
          <rect x="52" y="84" width="96" height="12" rx="2" fill="#475569" />
          <circle cx="66" cy="52" r="4" fill="#22C55E" />
          <circle cx="66" cy="66" r="4" fill="#F59E0B" />
          <text x="106" y="64" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="bold" fontFamily="monospace">PLC CPU</text>
        </svg>
      );

    case 'hmi_panel':
    case 'scada_topology':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="34" y="18" width="132" height="84" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <rect x="44" y="26" width="112" height="68" rx="2" fill="#0F172A" />
          <rect x="52" y="34" width="44" height="22" rx="2" fill="#2563EB" />
          <rect x="102" y="34" width="46" height="22" rx="2" fill="#22C55E" />
          <polyline points="52,82 72,70 92,76 112,62 146,72" fill="none" stroke="#00BFFF" strokeWidth="2.5" />
        </svg>
      );

    case 'sensor_module':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="34" y="26" width="132" height="62" rx="6" fill="#0369A1" stroke="#075985" strokeWidth="2" />
          <circle cx="70" cy="57" r="22" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
          <circle cx="70" cy="57" r="14" fill="#1E293B" />
          <circle cx="130" cy="57" r="22" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
          <circle cx="130" cy="57" r="14" fill="#1E293B" />
        </svg>
      );

    case 'rotary_encoder':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <circle cx="100" cy="60" r="38" fill="#CBD5E1" stroke="#475569" strokeWidth="2" />
          <circle cx="100" cy="60" r="24" fill="#334155" />
          <circle cx="100" cy="60" r="10" fill="#F8FAFC" />
          <rect x="134" y="54" width="32" height="12" rx="2" fill="#0F172A" />
        </svg>
      );

    case 'actuator_linear':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="28" y="42" width="90" height="36" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
          <rect x="118" y="52" width="54" height="16" rx="2" fill="#E2E8F0" stroke="#475569" strokeWidth="1.5" />
          <circle cx="172" cy="60" r="7" fill="#334155" />
          <rect x="40" y="34" width="14" height="8" rx="1" fill="#2563EB" />
          <rect x="92" y="34" width="14" height="8" rx="1" fill="#2563EB" />
        </svg>
      );

    case 'fieldbus_comm':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="38" y="28" width="124" height="64" rx="5" fill="#1E293B" stroke="#475569" strokeWidth="2" />
          <rect x="52" y="44" width="28" height="24" rx="2" fill="#0F172A" stroke="#00BFFF" strokeWidth="1.5" />
          <rect x="88" y="44" width="28" height="24" rx="2" fill="#0F172A" stroke="#00BFFF" strokeWidth="1.5" />
          <rect x="124" y="44" width="28" height="24" rx="2" fill="#22C55E" />
          <text x="100" y="84" textAnchor="middle" fill="#CBD5E1" fontSize="9" fontFamily="monospace">RS485 / PROFINET</text>
        </svg>
      );

    // ── RENEWABLE ENERGY ──
    case 'solar_panel':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="34" y="18" width="132" height="84" rx="4" fill="#1E3A8A" stroke="#CBD5E1" strokeWidth="4" />
          {[56, 78, 100, 122, 144].map((x) => (
            <line key={x} x1={x} y1="20" x2={x} y2="100" stroke="#93C5FD" strokeWidth="1.5" opacity="0.65" />
          ))}
          {[38, 60, 82].map((y) => (
            <line key={y} x1="36" y1={y} x2="164" y2={y} stroke="#93C5FD" strokeWidth="1.5" opacity="0.65" />
          ))}
        </svg>
      );

    case 'solar_inverter':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="52" y="16" width="96" height="88" rx="8" fill="#F8FAFC" stroke="#475569" strokeWidth="2" />
          <rect x="64" y="28" width="72" height="30" rx="3" fill="#0F172A" />
          <text x="100" y="47" textAnchor="middle" fill="#22C55E" fontSize="11" fontWeight="bold" fontFamily="monospace">230V AC</text>
          <circle cx="82" cy="78" r="5" fill="#22C55E" />
          <circle cx="100" cy="78" r="5" fill="#00BFFF" />
          <circle cx="118" cy="78" r="5" fill="#F59E0B" />
        </svg>
      );

    case 'battery_pack':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="44" y="30" width="112" height="70" rx="5" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <rect x="58" y="20" width="18" height="10" rx="2" fill="#EF4444" />
          <rect x="124" y="20" width="18" height="10" rx="2" fill="#3B82F6" />
          <text x="100" y="64" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="bold" fontFamily="monospace">LiFePO4 48V</text>
          <text x="100" y="82" textAnchor="middle" fill="#22C55E" fontSize="10" fontFamily="monospace">100Ah BMS</text>
        </svg>
      );

    case 'mppt_controller':
    case 'pwm_controller':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="48" y="18" width="104" height="84" rx="6" fill={artworkId === 'mppt_controller' ? '#1E3A8A' : '#334155'} stroke="#0F172A" strokeWidth="2" />
          <rect x="64" y="30" width="72" height="32" rx="3" fill="#E0F2FE" />
          <text x="100" y="50" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="bold" fontFamily="monospace">
            {artworkId === 'mppt_controller' ? 'MPPT 60A' : 'PWM 30A'}
          </text>
          {[62, 78, 94, 110, 126].map((cx) => (
            <circle key={cx} cx={cx} cy="86" r="4" fill="#CBD5E1" />
          ))}
        </svg>
      );

    case 'solar_spd':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="62" y="16" width="76" height="88" rx="4" fill="#334155" stroke="#0F172A" strokeWidth="2" />
          <rect x="70" y="28" width="26" height="58" rx="2" fill="#EF4444" />
          <rect x="104" y="28" width="26" height="58" rx="2" fill="#EF4444" />
          <rect x="77" y="42" width="12" height="10" fill="#22C55E" />
          <rect x="111" y="42" width="12" height="10" fill="#22C55E" />
          <text x="100" y="98" textAnchor="middle" fill="#F8FAFC" fontSize="8" fontFamily="monospace">1000V DC SPD</text>
        </svg>
      );

    case 'wind_turbine':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="100" y1="48" x2="100" y2="108" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
          <line x1="100" y1="48" x2="100" y2="14" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
          <line x1="100" y1="48" x2="68" y2="70" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
          <line x1="100" y1="48" x2="132" y2="70" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round" />
          <circle cx="100" cy="48" r="8" fill="#2563EB" stroke="#1E293B" strokeWidth="2" />
        </svg>
      );

    // ── ELECTRICAL TOOLS ──
    case 'multimeter':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="66" y="14" width="68" height="92" rx="8" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
          <rect x="74" y="22" width="52" height="24" rx="2" fill="#D1FAE5" stroke="#065F46" strokeWidth="1.5" />
          <text x="100" y="38" textAnchor="middle" fill="#064E3B" fontSize="11" fontWeight="bold" fontFamily="monospace">230.4 V</text>
          <circle cx="100" cy="68" r="16" fill="#334155" stroke="#0F172A" strokeWidth="2" />
          <line x1="100" y1="54" x2="100" y2="82" stroke="#F8FAFC" strokeWidth="3" transform="rotate(-35 100 68)" />
          <circle cx="82" cy="94" r="4" fill="#EF4444" />
          <circle cx="100" cy="94" r="4" fill="#0F172A" />
          <circle cx="118" cy="94" r="4" fill="#EF4444" />
        </svg>
      );

    case 'clamp_meter':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <path d="M84 44 C76 16, 124 16, 116 44" fill="none" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
          <rect x="74" y="42" width="52" height="64" rx="6" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
          <rect x="82" y="52" width="36" height="18" rx="2" fill="#D1FAE5" />
          <text x="100" y="65" textAnchor="middle" fill="#064E3B" fontSize="9" fontWeight="bold" fontFamily="monospace">12.4A</text>
          <circle cx="100" cy="86" r="10" fill="#334155" />
        </svg>
      );

    case 'voltage_tester':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="34" y="50" width="84" height="20" rx="4" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
          <rect x="118" y="56" width="48" height="8" rx="1" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
          <circle cx="96" cy="60" r="5" fill="#FEF08A" />
        </svg>
      );

    case 'oscilloscope':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="24" y="18" width="152" height="84" rx="6" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
          <rect x="34" y="28" width="84" height="62" rx="3" fill="#0F172A" />
          <path d="M40 60 Q54 36, 68 60 T96 60 T112 60" fill="none" stroke="#22C55E" strokeWidth="2.5" />
          <circle cx="136" cy="40" r="7" fill="#334155" />
          <circle cx="158" cy="40" r="7" fill="#334155" />
          <circle cx="136" cy="68" r="7" fill="#2563EB" />
          <circle cx="158" cy="68" r="7" fill="#F59E0B" />
        </svg>
      );

    case 'megger_tester':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="52" y="18" width="96" height="84" rx="6" fill="#F59E0B" stroke="#92400E" strokeWidth="2" />
          <rect x="62" y="28" width="76" height="32" rx="3" fill="#0F172A" />
          <text x="100" y="48" textAnchor="middle" fill="#22C55E" fontSize="11" fontWeight="bold" fontFamily="monospace">&gt;500 MΩ</text>
          <circle cx="100" cy="80" r="12" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
          <text x="100" y="83" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">TEST</text>
        </svg>
      );

    case 'screwdriver_vde':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="28" y="46" width="66" height="28" rx="8" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
          <rect x="56" y="46" width="16" height="28" fill="#F59E0B" />
          <rect x="94" y="55" width="74" height="10" rx="2" fill="#DC2626" />
          <rect x="164" y="56" width="12" height="8" fill="#CBD5E1" />
        </svg>
      );

    case 'wire_stripper':
    case 'pliers_vde':
    case 'crimping_tool':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <path d="M40 34 Q80 46, 114 54 L152 46 L152 58 L114 60" fill="none" stroke="#EF4444" strokeWidth="10" strokeLinecap="round" />
          <path d="M40 86 Q80 74, 114 66 L152 74 L152 62 L114 60" fill="none" stroke="#F59E0B" strokeWidth="10" strokeLinecap="round" />
          <circle cx="114" cy="60" r="10" fill="#475569" stroke="#1E293B" strokeWidth="2" />
        </svg>
      );

    case 'electric_drill':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="46" y="30" width="76" height="30" rx="5" fill="#2563EB" stroke="#1E40AF" strokeWidth="2" />
          <rect x="122" y="36" width="22" height="18" rx="2" fill="#334155" />
          <line x1="144" y1="45" x2="174" y2="45" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" />
          <rect x="62" y="60" width="20" height="34" rx="4" fill="#1E293B" />
          <rect x="54" y="92" width="42" height="14" rx="3" fill="#0F172A" />
        </svg>
      );

    case 'soldering_iron':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="28" y="48" width="74" height="24" rx="6" fill="#2563EB" stroke="#1E40AF" strokeWidth="2" />
          <rect x="102" y="54" width="48" height="12" rx="2" fill="#94A3B8" />
          <polygon points="150,56 176,60 150,64" fill="#CBD5E1" />
        </svg>
      );

    case 'ppe_gear':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <path d="M58 64 A42 36 0 0 1 142 64 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
          <rect x="52" y="64" width="96" height="8" rx="3" fill="#D97706" />
          <rect x="64" y="82" width="32" height="22" rx="5" fill="#EF4444" />
          <rect x="104" y="82" width="32" height="22" rx="5" fill="#EF4444" />
        </svg>
      );
  }
}

function SchematicSymbol({ artworkId, className }: { artworkId: ComponentArtworkId; className: string }) {
  const stroke = 'var(--schematic-ink)';
  const accent = 'var(--schematic-accent)';
  const ring = 'var(--schematic-ring)';

  switch (artworkId) {
    case 'light_switch':
    case 'push_button':
    case 'selector_switch':
    case 'limit_switch':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="30" y1="64" x2="72" y2="64" stroke={stroke} strokeWidth="3" />
          <circle cx="72" cy="64" r="4" fill={stroke} />
          <line x1="72" y1="64" x2="124" y2="38" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="128" cy="64" r="4" fill={stroke} />
          <line x1="128" y1="64" x2="170" y2="64" stroke={stroke} strokeWidth="3" />
          {artworkId === 'push_button' && (
            <line x1="98" y1="24" x2="98" y2="50" stroke={stroke} strokeWidth="2.5" strokeDasharray="4 3" />
          )}
        </svg>
      );

    case 'socket_outlet':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="100" y1="74" x2="100" y2="104" stroke={stroke} strokeWidth="3" />
          <path d="M62 74 A38 38 0 0 1 138 74" fill="none" stroke={accent} strokeWidth="3.5" />
          <line x1="82" y1="20" x2="82" y2="42" stroke={stroke} strokeWidth="3" />
          <line x1="118" y1="20" x2="118" y2="42" stroke={stroke} strokeWidth="3" />
          <line x1="68" y1="88" x2="132" y2="88" stroke="#22C55E" strokeWidth="2.5" />
        </svg>
      );

    case 'lamp_led':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="30" y1="60" x2="70" y2="60" stroke={stroke} strokeWidth="3" />
          <line x1="130" y1="60" x2="170" y2="60" stroke={stroke} strokeWidth="3" />
          <circle cx="100" cy="60" r="30" fill="none" stroke={accent} strokeWidth="3.5" />
          <line x1="79" y1="39" x2="121" y2="81" stroke={stroke} strokeWidth="3" />
          <line x1="121" y1="39" x2="79" y2="81" stroke={stroke} strokeWidth="3" />
        </svg>
      );

    case 'wire_conductor':
    case 'power_cable':
    case 'terminal_block':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="25" y1="45" x2="175" y2="45" stroke={accent} strokeWidth="3" />
          <line x1="25" y1="65" x2="175" y2="65" stroke={stroke} strokeWidth="3" />
          <line x1="25" y1="85" x2="175" y2="85" stroke="#22C55E" strokeWidth="3" />
          <circle cx="100" cy="45" r="5" fill={accent} />
          <circle cx="100" cy="65" r="5" fill={stroke} />
          <circle cx="100" cy="85" r="5" fill="#22C55E" />
        </svg>
      );

    case 'earthing_system':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="100" y1="20" x2="100" y2="66" stroke="#22C55E" strokeWidth="3.5" />
          <line x1="62" y1="66" x2="138" y2="66" stroke={accent} strokeWidth="4" />
          <line x1="76" y1="80" x2="124" y2="80" stroke={accent} strokeWidth="3.5" />
          <line x1="90" y1="94" x2="110" y2="94" stroke={accent} strokeWidth="3" />
        </svg>
      );

    case 'mcb_breaker':
    case 'rcd_rcbo':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="100" y1="16" x2="100" y2="42" stroke={stroke} strokeWidth="3" />
          <line x1="100" y1="42" x2="78" y2="74" stroke={accent} strokeWidth="3.5" />
          <line x1="100" y1="76" x2="100" y2="104" stroke={stroke} strokeWidth="3" />
          <path d="M94 36 L106 48 M106 36 L94 48" stroke={stroke} strokeWidth="2.5" />
          {artworkId === 'rcd_rcbo' && (
            <ellipse cx="100" cy="86" rx="22" ry="8" fill="none" stroke={ring} strokeWidth="2" />
          )}
        </svg>
      );

    case 'fuse':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="25" y1="60" x2="175" y2="60" stroke={stroke} strokeWidth="3" />
          <rect x="65" y="44" width="70" height="32" fill="none" stroke={accent} strokeWidth="3.5" />
          <text x="100" y="34" textAnchor="middle" fill={stroke} fontSize="13" fontWeight="bold" fontFamily="monospace">F</text>
        </svg>
      );

    case 'contactor':
    case 'relay':
    case 'industrial_timer':
    case 'thermal_overload':
    case 'motor_starter':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="44" y="42" width="32" height="36" fill="none" stroke={accent} strokeWidth="3" />
          <line x1="60" y1="20" x2="60" y2="42" stroke={stroke} strokeWidth="2.5" />
          <line x1="60" y1="78" x2="60" y2="100" stroke={stroke} strokeWidth="2.5" />
          <line x1="76" y1="60" x2="114" y2="60" stroke={ring} strokeWidth="2" strokeDasharray="4 3" />
          <line x1="118" y1="88" x2="118" y2="68" stroke={stroke} strokeWidth="3" />
          <line x1="118" y1="68" x2="144" y2="38" stroke={accent} strokeWidth="3.5" />
          <line x1="148" y1="22" x2="148" y2="42" stroke={stroke} strokeWidth="3" />
        </svg>
      );

    case 'resistor':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="25" y1="60" x2="60" y2="60" stroke={stroke} strokeWidth="3" />
          <polyline points="60,60 68,44 82,76 96,44 110,76 124,44 134,60" fill="none" stroke={accent} strokeWidth="3.5" />
          <line x1="134" y1="60" x2="175" y2="60" stroke={stroke} strokeWidth="3" />
        </svg>
      );

    case 'electrolytic_capacitor':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="30" y1="60" x2="90" y2="60" stroke={stroke} strokeWidth="3" />
          <line x1="90" y1="32" x2="90" y2="88" stroke={accent} strokeWidth="4" />
          <line x1="110" y1="32" x2="110" y2="88" stroke={accent} strokeWidth="4" />
          <line x1="110" y1="60" x2="170" y2="60" stroke={stroke} strokeWidth="3" />
        </svg>
      );

    case 'inductor':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="25" y1="64" x2="52" y2="64" stroke={stroke} strokeWidth="3" />
          <path d="M52 64 A12 14 0 0 1 76 64 A12 14 0 0 1 100 64 A12 14 0 0 1 124 64 A12 14 0 0 1 148 64" fill="none" stroke={accent} strokeWidth="3.5" />
          <line x1="148" y1="64" x2="175" y2="64" stroke={stroke} strokeWidth="3" />
        </svg>
      );

    case 'diode':
    case 'led':
    case 'thyristor':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="30" y1="60" x2="80" y2="60" stroke={stroke} strokeWidth="3" />
          <polygon points="80,38 80,82 120,60" fill={accent} stroke={accent} strokeWidth="2" />
          <line x1="120" y1="36" x2="120" y2="84" stroke={stroke} strokeWidth="3.5" />
          <line x1="120" y1="60" x2="170" y2="60" stroke={stroke} strokeWidth="3" />
          {artworkId === 'thyristor' && (
            <line x1="120" y1="74" x2="148" y2="96" stroke={stroke} strokeWidth="2.5" />
          )}
          {artworkId === 'led' && (
            <line x1="106" y1="32" x2="128" y2="16" stroke="#F59E0B" strokeWidth="2.5" />
          )}
        </svg>
      );

    case 'bjt_npn':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <circle cx="104" cy="60" r="34" fill="none" stroke={ring} strokeWidth="2" />
          <line x1="40" y1="60" x2="88" y2="60" stroke={stroke} strokeWidth="3" />
          <line x1="88" y1="38" x2="88" y2="82" stroke={accent} strokeWidth="4" />
          <line x1="88" y1="48" x2="122" y2="24" stroke={stroke} strokeWidth="3" />
          <line x1="88" y1="72" x2="122" y2="96" stroke={stroke} strokeWidth="3" />
          <polygon points="122,96 108,92 115,82" fill={accent} />
        </svg>
      );

    case 'mosfet':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <circle cx="104" cy="60" r="34" fill="none" stroke={ring} strokeWidth="2" />
          <line x1="40" y1="76" x2="80" y2="76" stroke={stroke} strokeWidth="3" />
          <line x1="80" y1="38" x2="80" y2="82" stroke={accent} strokeWidth="3.5" />
          <line x1="90" y1="38" x2="90" y2="82" stroke={stroke} strokeWidth="3.5" strokeDasharray="10 6" />
          <line x1="90" y1="42" x2="124" y2="42" stroke={stroke} strokeWidth="3" />
          <line x1="124" y1="22" x2="124" y2="42" stroke={stroke} strokeWidth="3" />
          <line x1="90" y1="78" x2="124" y2="78" stroke={stroke} strokeWidth="3" />
          <line x1="124" y1="78" x2="124" y2="98" stroke={stroke} strokeWidth="3" />
        </svg>
      );

    case 'logic_gate':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <path d="M68 32 H102 A28 28 0 0 1 102 88 H68 Z" fill="none" stroke={accent} strokeWidth="3.5" />
          <line x1="34" y1="46" x2="68" y2="46" stroke={stroke} strokeWidth="3" />
          <line x1="34" y1="74" x2="68" y2="74" stroke={stroke} strokeWidth="3" />
          <line x1="130" y1="60" x2="168" y2="60" stroke={stroke} strokeWidth="3" />
        </svg>
      );

    case 'dc_motor':
    case 'ac_motor':
    case 'single_phase_motor':
    case 'three_phase_motor':
    case 'stepper_motor':
    case 'servo_motor':
    case 'induction_motor':
    case 'synchronous_motor':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="30" y1="60" x2="70" y2="60" stroke={stroke} strokeWidth="3" />
          <line x1="130" y1="60" x2="170" y2="60" stroke={stroke} strokeWidth="3" />
          <circle cx="100" cy="60" r="30" fill="none" stroke={accent} strokeWidth="3.5" />
          <text x="100" y="67" textAnchor="middle" fill={stroke} fontSize="20" fontWeight="bold" fontFamily="monospace">
            {artworkId === 'three_phase_motor' || artworkId === 'induction_motor'
              ? 'M3~'
              : artworkId === 'dc_motor'
                ? 'M='
                : 'M~'}
          </text>
        </svg>
      );

    case 'solar_panel':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="64" y="28" width="72" height="64" fill="none" stroke={accent} strokeWidth="3" />
          <line x1="40" y1="48" x2="160" y2="48" stroke={stroke} strokeWidth="2.5" />
          <line x1="40" y1="72" x2="160" y2="72" stroke={stroke} strokeWidth="2.5" />
          <line x1="88" y1="28" x2="88" y2="92" stroke={ring} strokeWidth="2" />
          <line x1="112" y1="28" x2="112" y2="92" stroke={ring} strokeWidth="2" />
        </svg>
      );

    case 'battery_pack':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="30" y1="60" x2="78" y2="60" stroke={stroke} strokeWidth="3" />
          <line x1="78" y1="30" x2="78" y2="90" stroke={accent} strokeWidth="3.5" />
          <line x1="94" y1="45" x2="94" y2="75" stroke={stroke} strokeWidth="4.5" />
          <line x1="110" y1="30" x2="110" y2="90" stroke={accent} strokeWidth="3.5" />
          <line x1="126" y1="45" x2="126" y2="75" stroke={stroke} strokeWidth="4.5" />
          <line x1="126" y1="60" x2="170" y2="60" stroke={stroke} strokeWidth="3" />
        </svg>
      );

    case 'multimeter':
    case 'clamp_meter':
    case 'voltage_tester':
    case 'oscilloscope':
    case 'megger_tester':
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <line x1="30" y1="60" x2="70" y2="60" stroke={stroke} strokeWidth="3" />
          <line x1="130" y1="60" x2="170" y2="60" stroke={stroke} strokeWidth="3" />
          <circle cx="100" cy="60" r="30" fill="none" stroke={accent} strokeWidth="3.5" />
          <text x="100" y="67" textAnchor="middle" fill={stroke} fontSize="18" fontWeight="bold" fontFamily="monospace">
            {artworkId === 'clamp_meter'
              ? 'A'
              : artworkId === 'megger_tester'
                ? 'MΩ'
                : artworkId === 'oscilloscope'
                  ? '∿'
                  : 'V'}
          </text>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 200 120" className={className} aria-hidden="true">
          <rect x="56" y="24" width="88" height="72" rx="4" fill="none" stroke={accent} strokeWidth="3.5" />
          <line x1="28" y1="44" x2="56" y2="44" stroke={stroke} strokeWidth="2.5" />
          <line x1="28" y1="60" x2="56" y2="60" stroke={stroke} strokeWidth="2.5" />
          <line x1="28" y1="76" x2="56" y2="76" stroke={stroke} strokeWidth="2.5" />
          <line x1="144" y1="44" x2="172" y2="44" stroke={stroke} strokeWidth="2.5" />
          <line x1="144" y1="60" x2="172" y2="60" stroke={stroke} strokeWidth="2.5" />
          <line x1="144" y1="76" x2="172" y2="76" stroke={stroke} strokeWidth="2.5" />
          <text x="100" y="64" textAnchor="middle" fill={stroke} fontSize="12" fontWeight="bold" fontFamily="monospace">
            IEC / SYS
          </text>
        </svg>
      );
  }
}
