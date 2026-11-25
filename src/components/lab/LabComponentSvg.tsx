import React from 'react';
import type {
  LabComponentInstance,
  LabComponentSimState,
} from '../../types/electronics';

interface LabComponentSvgProps {
  comp: LabComponentInstance;
  simState?: LabComponentSimState;
  isRunning: boolean;
  isSelected: boolean;
}

const LED_HEX: Record<string, string> = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#38bdf8',
  yellow: '#facc15',
  white: '#f8fafc',
};

function renderValueSubtitle(comp: LabComponentInstance): string {
  switch (comp.type) {
    case 'battery':
    case 'dc-source':
      return `${comp.props.voltage ?? 12}V`;
    case 'ac-source':
      return `${comp.props.voltage ?? 230}V ${comp.props.frequency ?? 50}Hz`;
    case 'current-source':
      return `${((comp.props.current ?? 0.05) * 1000).toFixed(0)}mA`;
    case 'resistor': {
      const r = comp.props.resistance ?? 1000;
      return r >= 1000 ? `${(r / 1000).toFixed(r % 1000 === 0 ? 0 : 1)}kΩ` : `${r}Ω`;
    }
    case 'potentiometer':
      return `${comp.props.wiperPercent ?? 50}%`;
    case 'capacitor':
      return `${comp.props.capacitanceUf ?? 1000}µF`;
    case 'inductor':
      return `${comp.props.inductanceMh ?? 100}mH`;
    case 'lamp':
      return `${comp.props.ratedVoltage ?? 12}V/${comp.props.ratedPower ?? 6}W`;
    case 'fuse':
    case 'circuit-breaker':
    case 'thermal-overload':
      return `${comp.props.ratedCurrent ?? 2}A`;
    case 'transformer':
      return `×${comp.props.turnsRatio ?? 0.1}`;
    case 'timer':
      return `${comp.props.delaySeconds ?? 3}s`;
    case 'logic-gate':
      return comp.props.gateType ?? 'AND';
    case 'zener':
      return `${comp.props.zenerVoltage ?? 5.1}V`;
    default:
      return '';
  }
}

export const LabComponentSvg: React.FC<LabComponentSvgProps> = ({
  comp,
  simState,
  isRunning,
  isSelected,
}) => {
  const strokeMain = isSelected ? '#00BFFF' : 'currentColor';
  const bright = isRunning ? Math.min(1.2, Math.max(0, simState?.brightness ?? 0)) : 0;
  const blown = Boolean(simState?.blown);
  const tripped = Boolean(simState?.tripped);
  const coilActive = isRunning && Boolean(simState?.coilActive);
  const overloaded = isRunning && Boolean(simState?.overloaded);

  const renderShape = () => {
    switch (comp.type) {
      case 'battery':
        return (
          <g>
            <line x1={-40} y1={0} x2={-12} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={-12} y1={-10} x2={-12} y2={10} stroke={strokeMain} strokeWidth={3.5} />
            <line x1={-2} y1={-18} x2={-2} y2={18} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={6} y1={-10} x2={6} y2={10} stroke={strokeMain} strokeWidth={3.5} />
            <line x1={16} y1={-18} x2={16} y2={18} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={16} y1={0} x2={40} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <text x={24} y={-12} fontSize={11} fontWeight={700} fill="#ef4444">+</text>
            <text x={-26} y={-12} fontSize={11} fontWeight={700} fill="#3b82f6">−</text>
          </g>
        );
      case 'dc-source':
      case 'ac-source':
      case 'current-source':
        return (
          <g>
            <line x1={-40} y1={0} x2={-22} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={22} y1={0} x2={40} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <circle cx={0} cy={0} r={22} fill="var(--lab-node-bg, #0f172a)" stroke={strokeMain} strokeWidth={2.5} />
            {comp.type === 'ac-source' ? (
              <path d="M -11 0 Q -5.5 -10 0 0 T 11 0" fill="none" stroke="#00BFFF" strokeWidth={2.5} />
            ) : comp.type === 'current-source' ? (
              <path d="M -10 0 L 10 0 M 4 -5 L 10 0 L 4 5" fill="none" stroke="#22c55e" strokeWidth={2.5} />
            ) : (
              <>
                <line x1={-8} y1={-4} x2={8} y2={-4} stroke="#22c55e" strokeWidth={2.5} />
                <line x1={-8} y1={4} x2={8} y2={4} stroke="#22c55e" strokeWidth={1.8} strokeDasharray="3 3" />
              </>
            )}
            <text x={24} y={-10} fontSize={10} fontWeight={700} fill="#ef4444">
              {comp.type === 'ac-source' ? 'L' : '+'}
            </text>
          </g>
        );
      case 'ground':
        return (
          <g>
            <line x1={0} y1={-20} x2={0} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={-16} y1={0} x2={16} y2={0} stroke="#22c55e" strokeWidth={3} />
            <line x1={-10} y1={7} x2={10} y2={7} stroke="#22c55e" strokeWidth={2.5} />
            <line x1={-4} y1={14} x2={4} y2={14} stroke="#22c55e" strokeWidth={2} />
          </g>
        );
      case 'switch': {
        const closed = Boolean(comp.props.closed);
        return (
          <g>
            <line x1={-40} y1={0} x2={-16} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={16} y1={0} x2={40} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <circle cx={-16} cy={0} r={3.5} fill={strokeMain} />
            <circle cx={16} cy={0} r={3.5} fill={strokeMain} />
            <line
              x1={-16}
              y1={0}
              x2={closed ? 16 : 12}
              y2={closed ? 0 : -18}
              stroke={closed ? '#22c55e' : '#f59e0b'}
              strokeWidth={3}
              strokeLinecap="round"
            />
          </g>
        );
      }
      case 'push-button': {
        const closed = comp.props.momentaryNC ? !comp.props.closed : Boolean(comp.props.closed);
        return (
          <g>
            <line x1={-40} y1={0} x2={-16} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={16} y1={0} x2={40} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <circle cx={-16} cy={0} r={3.5} fill={strokeMain} />
            <circle cx={16} cy={0} r={3.5} fill={strokeMain} />
            <line
              x1={-16}
              y1={closed ? -2 : -13}
              x2={16}
              y2={closed ? -2 : -13}
              stroke={closed ? '#22c55e' : '#f59e0b'}
              strokeWidth={3}
            />
            <line x1={0} y1={closed ? -2 : -13} x2={0} y2={-24} stroke={strokeMain} strokeWidth={2} />
            <line x1={-10} y1={-24} x2={10} y2={-24} stroke={comp.props.momentaryNC ? '#ef4444' : '#2563eb'} strokeWidth={3.5} />
          </g>
        );
      }
      case 'lamp':
        return (
          <g>
            <line x1={-40} y1={0} x2={-20} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={20} y1={0} x2={40} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            {bright > 0.03 && (
              <circle
                cx={0}
                cy={0}
                r={26 + bright * 10}
                fill={overloaded ? '#ef4444' : '#facc15'}
                opacity={Math.min(0.45, bright * 0.35)}
              />
            )}
            <circle
              cx={0}
              cy={0}
              r={20}
              fill={bright > 0.03 ? (overloaded ? '#fca5a5' : '#fef08a') : 'var(--lab-node-bg, #0f172a)'}
              fillOpacity={bright > 0.03 ? Math.min(0.95, 0.25 + bright * 0.7) : 1}
              stroke={overloaded ? '#ef4444' : bright > 0.03 ? '#f59e0b' : strokeMain}
              strokeWidth={2.5}
            />
            <line x1={-13} y1={-13} x2={13} y2={13} stroke={strokeMain} strokeWidth={2} />
            <line x1={-13} y1={13} x2={13} y2={-13} stroke={strokeMain} strokeWidth={2} />
          </g>
        );
      case 'fuse':
        return (
          <g>
            <line x1={-40} y1={0} x2={-22} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={22} y1={0} x2={40} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <rect
              x={-22}
              y={-10}
              width={44}
              height={20}
              rx={3}
              fill="var(--lab-node-bg, #0f172a)"
              stroke={blown ? '#ef4444' : strokeMain}
              strokeWidth={2.2}
            />
            {blown ? (
              <g stroke="#ef4444" strokeWidth={2.2}>
                <line x1={-18} y1={0} x2={-4} y2={-5} />
                <line x1={4} y1={5} x2={18} y2={0} />
              </g>
            ) : (
              <line x1={-22} y1={0} x2={22} y2={0} stroke="#22c55e" strokeWidth={2} />
            )}
          </g>
        );
      case 'circuit-breaker': {
        const closed = Boolean(comp.props.closed ?? true) && !tripped;
        return (
          <g>
            <line x1={-40} y1={0} x2={-16} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={16} y1={0} x2={40} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <rect
              x={-20}
              y={-18}
              width={40}
              height={36}
              rx={5}
              fill="var(--lab-node-bg, #0f172a)"
              stroke={tripped ? '#ef4444' : strokeMain}
              strokeWidth={2}
            />
            <line
              x1={-14}
              y1={4}
              x2={closed ? 14 : 8}
              y2={closed ? 4 : -10}
              stroke={tripped ? '#ef4444' : closed ? '#22c55e' : '#f59e0b'}
              strokeWidth={3}
            />
          </g>
        );
      }
      case 'relay':
        return (
          <g>
            <rect
              x={-36}
              y={-32}
              width={72}
              height={64}
              rx={6}
              fill="var(--lab-node-bg, #0f172a)"
              stroke={coilActive ? '#22c55e' : strokeMain}
              strokeWidth={2}
            />
            <rect
              x={-24}
              y={-18}
              width={18}
              height={36}
              fill={coilActive ? '#22c55e33' : 'none'}
              stroke={coilActive ? '#22c55e' : strokeMain}
              strokeWidth={1.8}
            />
            <line x1={-24} y1={-18} x2={-6} y2={18} stroke={coilActive ? '#22c55e' : strokeMain} strokeWidth={1.5} />
            <line x1={-40} y1={-20} x2={-24} y2={-20} stroke={strokeMain} strokeWidth={2} />
            <line x1={-40} y1={20} x2={-24} y2={20} stroke={strokeMain} strokeWidth={2} />
            <line x1={40} y1={-20} x2={18} y2={-20} stroke={strokeMain} strokeWidth={2} />
            <line x1={40} y1={20} x2={18} y2={20} stroke={strokeMain} strokeWidth={2} />
            <line
              x1={18}
              y1={20}
              x2={coilActive ? 18 : 6}
              y2={coilActive ? -20 : -14}
              stroke={coilActive ? '#22c55e' : '#f59e0b'}
              strokeWidth={2.5}
            />
          </g>
        );
      case 'contactor':
        return (
          <g>
            <rect
              x={-60}
              y={-40}
              width={120}
              height={80}
              rx={6}
              fill="var(--lab-node-bg, #0f172a)"
              stroke={coilActive ? '#22c55e' : strokeMain}
              strokeWidth={2.2}
            />
            <rect
              x={-48}
              y={-18}
              width={20}
              height={36}
              fill={coilActive ? '#22c55e33' : 'none'}
              stroke={coilActive ? '#22c55e' : strokeMain}
              strokeWidth={1.8}
            />
            <line x1={-60} y1={-20} x2={-48} y2={-20} stroke={strokeMain} strokeWidth={2} />
            <line x1={-60} y1={20} x2={-48} y2={20} stroke={strokeMain} strokeWidth={2} />
            {/* Main pole L1-T1 */}
            <line x1={-20} y1={-40} x2={-20} y2={-16} stroke={strokeMain} strokeWidth={2} />
            <line x1={-20} y1={40} x2={-20} y2={16} stroke={strokeMain} strokeWidth={2} />
            <line x1={-20} y1={16} x2={coilActive ? -20 : -10} y2={-16} stroke={coilActive ? '#22c55e' : '#f59e0b'} strokeWidth={2.5} />
            {/* Aux NO 13-14 */}
            <line x1={20} y1={-40} x2={20} y2={-16} stroke={strokeMain} strokeWidth={2} />
            <line x1={20} y1={40} x2={20} y2={16} stroke={strokeMain} strokeWidth={2} />
            <line x1={20} y1={16} x2={coilActive ? 20 : 30} y2={-16} stroke={coilActive ? '#22c55e' : '#f59e0b'} strokeWidth={2} />
            {/* Aux NC 21-22 */}
            <line x1={60} y1={-40} x2={60} y2={-16} stroke={strokeMain} strokeWidth={2} />
            <line x1={60} y1={40} x2={60} y2={16} stroke={strokeMain} strokeWidth={2} />
            <line x1={60} y1={16} x2={coilActive ? 48 : 60} y2={-16} stroke={coilActive ? '#ef4444' : '#22c55e'} strokeWidth={2} />
          </g>
        );
      case 'timer':
        return (
          <g>
            <rect
              x={-38}
              y={-32}
              width={76}
              height={64}
              rx={6}
              fill="var(--lab-node-bg, #0f172a)"
              stroke={coilActive ? '#00BFFF' : strokeMain}
              strokeWidth={2}
            />
            <circle cx={-8} cy={0} r={12} fill="none" stroke={coilActive ? '#00BFFF' : strokeMain} strokeWidth={1.8} />
            <line x1={-8} y1={0} x2={-8} y2={-7} stroke="#00BFFF" strokeWidth={1.8} />
            <line x1={-8} y1={0} x2={-3} y2={4} stroke="#00BFFF" strokeWidth={1.8} />
            <line x1={-40} y1={-20} x2={-38} y2={-20} stroke={strokeMain} strokeWidth={2} />
            <line x1={-40} y1={20} x2={-38} y2={20} stroke={strokeMain} strokeWidth={2} />
            <line x1={40} y1={-20} x2={18} y2={-20} stroke={strokeMain} strokeWidth={2} />
            <line x1={40} y1={20} x2={18} y2={20} stroke={strokeMain} strokeWidth={2} />
            {typeof simState?.timerRemaining === 'number' && coilActive && (
              <text x={22} y={5} fontSize={10} fontWeight={700} fill="#00BFFF" textAnchor="middle">
                {simState.timerRemaining.toFixed(1)}s
              </text>
            )}
          </g>
        );
      case 'thermal-overload':
        return (
          <g>
            <rect
              x={-40}
              y={-32}
              width={80}
              height={64}
              rx={6}
              fill="var(--lab-node-bg, #0f172a)"
              stroke={tripped ? '#ef4444' : strokeMain}
              strokeWidth={2}
            />
            <path d="M -24 -20 L -8 -20 L -8 -12 L 8 -12 L 8 -20 L 24 -20" fill="none" stroke="#f59e0b" strokeWidth={2} />
            <line x1={-24} y1={20} x2={24} y2={20} stroke={tripped ? '#ef4444' : '#22c55e'} strokeWidth={2.5} strokeDasharray={tripped ? '4 4' : undefined} />
          </g>
        );
      case 'transformer':
        return (
          <g>
            <line x1={-40} y1={-20} x2={-18} y2={-20} stroke={strokeMain} strokeWidth={2} />
            <line x1={-40} y1={20} x2={-18} y2={20} stroke={strokeMain} strokeWidth={2} />
            <path d="M -18 -20 Q -6 -13 -18 -6 Q -6 0 -18 6 Q -6 13 -18 20" fill="none" stroke={strokeMain} strokeWidth={2.2} />
            <line x1={-3} y1={-24} x2={-3} y2={24} stroke="#00BFFF" strokeWidth={2} />
            <line x1={3} y1={-24} x2={3} y2={24} stroke="#00BFFF" strokeWidth={2} />
            <path d="M 18 -20 Q 6 -13 18 -6 Q 6 0 18 6 Q 6 13 18 20" fill="none" stroke={strokeMain} strokeWidth={2.2} />
            <line x1={18} y1={-20} x2={40} y2={-20} stroke={strokeMain} strokeWidth={2} />
            <line x1={18} y1={20} x2={40} y2={20} stroke={strokeMain} strokeWidth={2} />
          </g>
        );
      case 'motor': {
        const rpm = isRunning ? simState?.motorRpm ?? 0 : 0;
        const spinning = rpm > 30;
        return (
          <g>
            <line x1={-40} y1={0} x2={-22} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={22} y1={0} x2={40} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <circle
              cx={0}
              cy={0}
              r={22}
              fill="var(--lab-node-bg, #0f172a)"
              stroke={spinning ? '#22c55e' : strokeMain}
              strokeWidth={2.5}
            />
            <text
              x={0}
              y={5}
              transform={`rotate(${-comp.rotation})`}
              textAnchor="middle"
              fontSize={14}
              fontWeight={800}
              fill={spinning ? '#22c55e' : strokeMain}
            >
              M
            </text>
            {spinning && (
              <text
                x={0}
                y={35}
                transform={`rotate(${-comp.rotation})`}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill="#00BFFF"
              >
                {rpm} RPM {simState?.motorDir === 'rev' ? '↺' : '↻'}
              </text>
            )}
          </g>
        );
      }
      case 'plc-unit':
        return (
          <g>
            <rect
              x={-60}
              y={-36}
              width={120}
              height={76}
              rx={6}
              fill="var(--lab-node-bg, #0f172a)"
              stroke={strokeMain}
              strokeWidth={2.2}
            />
            <text x={0} y={-14} textAnchor="middle" fontSize={12} fontWeight={800} fill="#00BFFF">
              PLC
            </text>
            <text x={0} y={4} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.8}>
              LADDER CPU
            </text>
            <circle cx={-30} cy={18} r={4} fill={simState?.energized ? '#22c55e' : '#475569'} />
            <circle cx={30} cy={18} r={4} fill={isRunning ? '#00BFFF' : '#475569'} />
          </g>
        );
      case 'resistor':
        return (
          <g>
            <line x1={-40} y1={0} x2={-22} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={22} y1={0} x2={40} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <rect
              x={-22}
              y={-9}
              width={44}
              height={18}
              rx={2}
              fill="var(--lab-node-bg, #0f172a)"
              stroke={overloaded ? '#ef4444' : strokeMain}
              strokeWidth={2.2}
            />
          </g>
        );
      case 'potentiometer':
        return (
          <g>
            <line x1={-40} y1={0} x2={-22} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={22} y1={0} x2={40} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <rect x={-22} y={-9} width={44} height={18} rx={2} fill="var(--lab-node-bg, #0f172a)" stroke={strokeMain} strokeWidth={2.2} />
            <line x1={0} y1={-40} x2={0} y2={-13} stroke="#00BFFF" strokeWidth={2.2} />
            <polygon points="-5,-16 5,-16 0,-9" fill="#00BFFF" />
          </g>
        );
      case 'capacitor':
        return (
          <g>
            <line x1={-40} y1={0} x2={-5} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={5} y1={0} x2={40} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={-5} y1={-16} x2={-5} y2={16} stroke={strokeMain} strokeWidth={3} />
            <line x1={5} y1={-16} x2={5} y2={16} stroke={strokeMain} strokeWidth={3} />
            <text x={-18} y={-12} fontSize={10} fontWeight={700} fill="#ef4444">+</text>
          </g>
        );
      case 'inductor':
        return (
          <g>
            <line x1={-40} y1={0} x2={-24} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={24} y1={0} x2={40} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <path
              d="M -24 0 Q -18 -14 -12 0 Q -6 -14 0 0 Q 6 -14 12 0 Q 18 -14 24 0"
              fill="none"
              stroke={strokeMain}
              strokeWidth={2.5}
            />
          </g>
        );
      case 'diode':
      case 'led':
      case 'zener': {
        const ledHex = LED_HEX[comp.props.ledColor ?? 'red'] ?? '#ef4444';
        return (
          <g>
            <line x1={-40} y1={0} x2={-12} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={12} y1={0} x2={40} y2={0} stroke={strokeMain} strokeWidth={2.5} />
            {comp.type === 'led' && bright > 0.05 && (
              <circle cx={0} cy={0} r={24} fill={ledHex} opacity={Math.min(0.45, bright * 0.4)} />
            )}
            <polygon
              points="-12,-12 -12,12 12,0"
              fill={comp.type === 'led' && bright > 0.05 ? ledHex : 'none'}
              stroke={comp.type === 'led' ? ledHex : strokeMain}
              strokeWidth={2.2}
            />
            {comp.type === 'zener' ? (
              <polyline points="16,-13 12,-10 12,10 8,13" fill="none" stroke={strokeMain} strokeWidth={2.5} />
            ) : (
              <line x1={12} y1={-12} x2={12} y2={12} stroke={strokeMain} strokeWidth={2.5} />
            )}
            {comp.type === 'led' && (
              <g stroke={ledHex} strokeWidth={1.8}>
                <line x1={4} y1={-16} x2={13} y2={-25} />
                <line x1={12} y1={-14} x2={21} y2={-23} />
              </g>
            )}
          </g>
        );
      }
      case 'transistor':
        return (
          <g>
            <circle cx={6} cy={0} r={24} fill="var(--lab-node-bg, #0f172a)" stroke={strokeMain} strokeWidth={2} />
            <line x1={-40} y1={0} x2={-4} y2={0} stroke={strokeMain} strokeWidth={2.2} />
            <line x1={-4} y1={-12} x2={-4} y2={12} stroke={strokeMain} strokeWidth={3} />
            <line x1={-4} y1={-6} x2={20} y2={-20} stroke={strokeMain} strokeWidth={2.2} />
            <line x1={20} y1={-20} x2={20} y2={-40} stroke={strokeMain} strokeWidth={2.2} />
            <line x1={-4} y1={6} x2={20} y2={20} stroke={strokeMain} strokeWidth={2.2} />
            <line x1={20} y1={20} x2={20} y2={40} stroke={strokeMain} strokeWidth={2.2} />
            <polygon points="10,16 17,18 14,11" fill="#00BFFF" />
          </g>
        );
      case 'mosfet':
        return (
          <g>
            <circle cx={6} cy={0} r={24} fill="var(--lab-node-bg, #0f172a)" stroke={strokeMain} strokeWidth={2} />
            <line x1={-40} y1={0} x2={-8} y2={0} stroke={strokeMain} strokeWidth={2.2} />
            <line x1={-8} y1={-14} x2={-8} y2={14} stroke="#00BFFF" strokeWidth={2.5} />
            <line x1={-1} y1={-15} x2={-1} y2={-6} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={-1} y1={-4} x2={-1} y2={4} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={-1} y1={6} x2={-1} y2={15} stroke={strokeMain} strokeWidth={2.5} />
            <line x1={-1} y1={-11} x2={20} y2={-11} stroke={strokeMain} strokeWidth={2} />
            <line x1={20} y1={-11} x2={20} y2={-40} stroke={strokeMain} strokeWidth={2} />
            <line x1={-1} y1={11} x2={20} y2={11} stroke={strokeMain} strokeWidth={2} />
            <line x1={20} y1={11} x2={20} y2={40} stroke={strokeMain} strokeWidth={2} />
          </g>
        );
      case 'logic-gate':
        return (
          <g>
            <rect x={-26} y={-24} width={52} height={48} rx={8} fill="var(--lab-node-bg, #0f172a)" stroke={strokeMain} strokeWidth={2.2} />
            <line x1={-40} y1={comp.props.gateType === 'NOT' ? 0 : -20} x2={-26} y2={comp.props.gateType === 'NOT' ? 0 : -20} stroke={strokeMain} strokeWidth={2} />
            {comp.props.gateType !== 'NOT' && <line x1={-40} y1={20} x2={-26} y2={20} stroke={strokeMain} strokeWidth={2} />}
            <line x1={26} y1={0} x2={40} y2={0} stroke={strokeMain} strokeWidth={2} />
            <text x={0} y={4} textAnchor="middle" fontSize={11} fontWeight={800} fill="#00BFFF">
              {comp.props.gateType ?? 'AND'}
            </text>
            {isRunning && (
              <circle cx={19} cy={-16} r={4} fill={simState?.logicOut ? '#22c55e' : '#64748b'} />
            )}
          </g>
        );
      case 'op-amp':
        return (
          <g>
            <polygon points="-28,-28 -28,28 28,0" fill="var(--lab-node-bg, #0f172a)" stroke={strokeMain} strokeWidth={2.2} />
            <line x1={-40} y1={-20} x2={-28} y2={-20} stroke={strokeMain} strokeWidth={2} />
            <line x1={-40} y1={20} x2={-28} y2={20} stroke={strokeMain} strokeWidth={2} />
            <line x1={28} y1={0} x2={40} y2={0} stroke={strokeMain} strokeWidth={2} />
            <text x={-20} y={-15} fontSize={12} fontWeight={700} fill="#22c55e">+</text>
            <text x={-20} y={24} fontSize={13} fontWeight={700} fill="#ef4444">−</text>
          </g>
        );
      case 'voltmeter':
      case 'ammeter':
      case 'ohmmeter':
      case 'multimeter': {
        const badge =
          comp.type === 'voltmeter'
            ? 'V'
            : comp.type === 'ammeter'
            ? 'A'
            : comp.type === 'ohmmeter'
            ? 'Ω'
            : 'DMM';
        const valText = simState?.meterDisplay ? `${simState.meterDisplay}${simState.meterUnit ?? ''}` : badge;
        return (
          <g>
            <line x1={-40} y1={0} x2={-26} y2={0} stroke={strokeMain} strokeWidth={2.2} />
            <line x1={26} y1={0} x2={40} y2={0} stroke={strokeMain} strokeWidth={2.2} />
            <circle cx={0} cy={0} r={26} fill="var(--lab-node-bg, #0f172a)" stroke="#00BFFF" strokeWidth={2.2} />
            <text
              x={0}
              y={4}
              transform={`rotate(${-comp.rotation})`}
              textAnchor="middle"
              fontSize={simState?.meterDisplay ? 10 : 13}
              fontWeight={800}
              fill="#00BFFF"
            >
              {valText}
            </text>
          </g>
        );
      }
      case 'power-meter': {
        const valText = simState?.meterDisplay ? `${simState.meterDisplay}W` : 'W';
        return (
          <g>
            <rect x={-30} y={-28} width={60} height={56} rx={6} fill="var(--lab-node-bg, #0f172a)" stroke="#f59e0b" strokeWidth={2.2} />
            <line x1={-40} y1={-20} x2={-30} y2={-20} stroke={strokeMain} strokeWidth={2} />
            <line x1={30} y1={-20} x2={40} y2={-20} stroke={strokeMain} strokeWidth={2} />
            <line x1={0} y1={28} x2={0} y2={40} stroke={strokeMain} strokeWidth={2} />
            <text
              x={0}
              y={4}
              transform={`rotate(${-comp.rotation})`}
              textAnchor="middle"
              fontSize={11}
              fontWeight={800}
              fill="#f59e0b"
            >
              {valText}
            </text>
          </g>
        );
      }
      case 'oscilloscope':
        return (
          <g>
            <rect x={-34} y={-28} width={68} height={56} rx={6} fill="#0b1220" stroke="#00BFFF" strokeWidth={2.2} />
            <line x1={-40} y1={-20} x2={-34} y2={-20} stroke={strokeMain} strokeWidth={2} />
            <line x1={-40} y1={20} x2={-34} y2={20} stroke={strokeMain} strokeWidth={2} />
            <line x1={34} y1={0} x2={40} y2={0} stroke={strokeMain} strokeWidth={2} />
            <path d="M -24 4 Q -16 -14 -8 4 T 8 4 T 24 4" fill="none" stroke="#22c55e" strokeWidth={2} />
            <text x={0} y={-14} textAnchor="middle" fontSize={8} fontWeight={700} fill="#00BFFF">
              SCOPE
            </text>
          </g>
        );
      default:
        return <circle cx={0} cy={0} r={18} stroke={strokeMain} strokeWidth={2} />;
    }
  };

  const subtitle = renderValueSubtitle(comp);
  const isVertical = comp.rotation === 90 || comp.rotation === 270;
  const isGround = comp.type === 'ground';

  return (
    <g>
      <g transform={`rotate(${comp.rotation})`}>{renderShape()}</g>
      <text
        x={isVertical ? 34 : 0}
        y={isGround ? 28 : isVertical ? -4 : -32}
        textAnchor={isVertical ? 'start' : 'middle'}
        fontSize={11}
        fontWeight={700}
        className="fill-slate-800 dark:fill-slate-100 select-none pointer-events-none"
      >
        {comp.label}
      </text>
      {subtitle && (
        <text
          x={isVertical ? 34 : 0}
          y={isVertical ? 11 : 42}
          textAnchor={isVertical ? 'start' : 'middle'}
          fontSize={10}
          fontWeight={600}
          className="fill-slate-500 dark:fill-slate-400 select-none pointer-events-none"
        >
          {subtitle}
        </text>
      )}
    </g>
  );
};
