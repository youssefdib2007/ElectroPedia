import React from 'react';
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Gauge,
  Info,
  Sliders,
  XCircle,
} from 'lucide-react';
import { getCatalogItem } from '../../data/labCatalog';
import type { MessagesSchema } from '../../i18n/messages';
import type {
  LabComponentInstance,
  LabComponentProps,
  LabGateVariant,
  LabLedColor,
  LabMultimeterMode,
  LabSimulationResult,
  Locale,
} from '../../types/electronics';
import { formatEngineeringValue } from '../../utils/labEngine';

interface LabRightPanelProps {
  locale: Locale;
  t: MessagesSchema['labWorkspace'];
  activeTab: 'properties' | 'results' | 'instruments';
  onTabChange: (tab: 'properties' | 'results' | 'instruments') => void;
  selectedComponent: LabComponentInstance | null;
  components: LabComponentInstance[];
  simResult: LabSimulationResult | null;
  isRunning: boolean;
  onUpdateComponent: (
    compId: string,
    patch: { label?: string; rotation?: 0 | 90 | 180 | 270; props?: Partial<LabComponentProps> }
  ) => void;
  onOpenEncyclopedia?: (componentId: string) => void;
}

export const LabRightPanel: React.FC<LabRightPanelProps> = ({
  locale,
  t,
  activeTab,
  onTabChange,
  selectedComponent,
  components,
  simResult,
  isRunning,
  onUpdateComponent,
  onOpenEncyclopedia,
}) => {
  const spec = selectedComponent ? getCatalogItem(selectedComponent.type) : null;
  const selSim = selectedComponent
    ? simResult?.componentStates[selectedComponent.id]
    : undefined;

  const numInput = (
    label: string,
    val: number | undefined,
    fallback: number,
    step: number,
    min: number,
    onChange: (n: number) => void
  ) => (
    <label className="block space-y-1">
      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </span>
      <input
        type="number"
        step={step}
        min={min}
        value={val ?? fallback}
        onChange={(e) => {
          const parsed = Number(e.target.value);
          if (Number.isFinite(parsed)) onChange(parsed);
        }}
        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white"
      />
    </label>
  );

  const renderWaveformSvg = () => {
    const samples = simResult?.waveform ?? [];
    if (!isRunning || samples.length < 2) {
      return (
        <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-4 text-center text-xs text-slate-500 dark:text-slate-400">
          {t.noScopeHint}
        </div>
      );
    }

    const w = 300;
    const h = 140;
    const ch1Vals = samples.map((s) => s.ch1);
    const ch2Vals = samples.map((s) => s.ch2);
    const maxAbs = Math.max(
      1,
      ...ch1Vals.map((v) => Math.abs(v)),
      ...ch2Vals.map((v) => Math.abs(v))
    );

    const buildLine = (vals: number[]) =>
      vals
        .map((v, idx) => {
          const x = (idx / (vals.length - 1)) * w;
          const y = h / 2 - (v / (maxAbs * 1.15)) * (h / 2 - 10);
          return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(' ');

    return (
      <div className="space-y-2" data-testid="lab-scope-panel">
        <div className="rounded-xl border border-slate-700 bg-slate-950 p-2 overflow-hidden">
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-36">
            <line x1={0} y1={h / 2} x2={w} y2={h / 2} stroke="#334155" strokeDasharray="4 4" />
            <line x1={w / 2} y1={0} x2={w / 2} y2={h} stroke="#1e293b" strokeDasharray="4 4" />
            <path d={buildLine(ch1Vals)} fill="none" stroke="#00BFFF" strokeWidth={2} />
            <path d={buildLine(ch2Vals)} fill="none" stroke="#f59e0b" strokeWidth={1.8} />
          </svg>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono tabular-nums">
          <div className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5">
            <span className="text-sky-600 dark:text-sky-400 font-bold">CH1</span> Max:{' '}
            {Math.max(...ch1Vals).toFixed(2)}V / Min: {Math.min(...ch1Vals).toFixed(2)}V
          </div>
          <div className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5">
            <span className="text-amber-600 dark:text-amber-400 font-bold">CH2</span> Max:{' '}
            {Math.max(...ch2Vals).toFixed(2)}V / Min: {Math.min(...ch2Vals).toFixed(2)}V
          </div>
        </div>
      </div>
    );
  };

  const meterComponents = components.filter(
    (c) =>
      c.type === 'voltmeter' ||
      c.type === 'ammeter' ||
      c.type === 'ohmmeter' ||
      c.type === 'multimeter' ||
      c.type === 'power-meter'
  );

  return (
    <aside className="w-full lg:w-80 shrink-0 flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
      {/* Tabs */}
      <div className="grid grid-cols-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
        {(
          [
            { id: 'properties', label: t.tabProperties, icon: Sliders },
            { id: 'results', label: t.tabResults, icon: Activity },
            { id: 'instruments', label: t.tabInstruments, icon: Gauge },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              data-testid={`lab-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold border-b-2 transition ${
                active
                  ? 'border-blue-600 text-blue-600 dark:text-sky-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 max-h-[420px] lg:max-h-[540px] overflow-y-auto p-3.5 space-y-4">
        {/* PROPERTIES TAB */}
        {activeTab === 'properties' && (
          <>
            {!selectedComponent || !spec ? (
              <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-5 text-center space-y-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {t.noSelection}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.selectHint}
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-sky-400">
                      {spec.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {spec.name[locale]}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {spec.modelNote[locale]}
                    </p>
                  </div>
                  {spec.encyclopediaId && onOpenEncyclopedia && (
                    <button
                      type="button"
                      onClick={() => onOpenEncyclopedia(spec.encyclopediaId!)}
                      className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-blue-50 dark:bg-sky-950/60 px-2 py-1 text-[11px] font-semibold text-blue-700 dark:text-sky-300 hover:bg-blue-100"
                    >
                      <BookOpen className="w-3 h-3" />
                      {t.openEncyclopedia}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <label className="block space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      Label
                    </span>
                    <input
                      type="text"
                      value={selectedComponent.label}
                      onChange={(e) =>
                        onUpdateComponent(selectedComponent.id, { label: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      Rotation (°)
                    </span>
                    <select
                      value={selectedComponent.rotation}
                      onChange={(e) =>
                        onUpdateComponent(selectedComponent.id, {
                          rotation: Number(e.target.value) as 0 | 90 | 180 | 270,
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-mono text-slate-900 dark:text-white"
                    >
                      <option value={0}>0°</option>
                      <option value={90}>90°</option>
                      <option value={180}>180°</option>
                      <option value={270}>270°</option>
                    </select>
                  </label>
                </div>

                {/* Component-specific fields */}
                <div className="grid grid-cols-2 gap-2.5">
                  {(selectedComponent.type === 'battery' ||
                    selectedComponent.type === 'dc-source' ||
                    selectedComponent.type === 'ac-source' ||
                    selectedComponent.type === 'plc-unit') &&
                    numInput('Voltage (V)', selectedComponent.props.voltage, 12, 1, 0, (v) =>
                      onUpdateComponent(selectedComponent.id, { props: { voltage: v } })
                    )}

                  {selectedComponent.type === 'battery' &&
                    numInput(
                      'Internal R (Ω)',
                      selectedComponent.props.internalResistance,
                      0,
                      0.1,
                      0,
                      (r) =>
                        onUpdateComponent(selectedComponent.id, {
                          props: { internalResistance: r },
                        })
                    )}

                  {selectedComponent.type === 'ac-source' &&
                    numInput(
                      'Frequency (Hz)',
                      selectedComponent.props.frequency,
                      50,
                      1,
                      1,
                      (f) => onUpdateComponent(selectedComponent.id, { props: { frequency: f } })
                    )}

                  {selectedComponent.type === 'current-source' &&
                    numInput('Current (A)', selectedComponent.props.current, 0.05, 0.01, 0, (c) =>
                      onUpdateComponent(selectedComponent.id, { props: { current: c } })
                    )}

                  {(selectedComponent.type === 'resistor' ||
                    selectedComponent.type === 'potentiometer' ||
                    selectedComponent.type === 'motor') &&
                    numInput(
                      'Resistance (Ω)',
                      selectedComponent.props.resistance,
                      1000,
                      10,
                      1,
                      (r) => onUpdateComponent(selectedComponent.id, { props: { resistance: r } })
                    )}

                  {selectedComponent.type === 'potentiometer' &&
                    numInput(
                      'Wiper (%)',
                      selectedComponent.props.wiperPercent,
                      50,
                      5,
                      1,
                      (w) =>
                        onUpdateComponent(selectedComponent.id, {
                          props: { wiperPercent: Math.min(99, Math.max(1, w)) },
                        })
                    )}

                  {selectedComponent.type === 'capacitor' &&
                    numInput(
                      'Capacitance (µF)',
                      selectedComponent.props.capacitanceUf,
                      1000,
                      10,
                      0.01,
                      (c) =>
                        onUpdateComponent(selectedComponent.id, { props: { capacitanceUf: c } })
                    )}

                  {selectedComponent.type === 'inductor' &&
                    numInput(
                      'Inductance (mH)',
                      selectedComponent.props.inductanceMh,
                      100,
                      5,
                      0.1,
                      (l) =>
                        onUpdateComponent(selectedComponent.id, { props: { inductanceMh: l } })
                    )}

                  {(selectedComponent.type === 'lamp' || selectedComponent.type === 'motor') &&
                    numInput(
                      'Rated Voltage (V)',
                      selectedComponent.props.ratedVoltage,
                      12,
                      1,
                      1,
                      (rv) =>
                        onUpdateComponent(selectedComponent.id, { props: { ratedVoltage: rv } })
                    )}

                  {selectedComponent.type === 'lamp' &&
                    numInput(
                      'Rated Power (W)',
                      selectedComponent.props.ratedPower,
                      6,
                      0.5,
                      0.1,
                      (rp) => onUpdateComponent(selectedComponent.id, { props: { ratedPower: rp } })
                    )}

                  {(selectedComponent.type === 'fuse' ||
                    selectedComponent.type === 'circuit-breaker' ||
                    selectedComponent.type === 'thermal-overload') &&
                    numInput(
                      'Rated Current (A)',
                      selectedComponent.props.ratedCurrent,
                      2,
                      0.5,
                      0.1,
                      (rc) =>
                        onUpdateComponent(selectedComponent.id, { props: { ratedCurrent: rc } })
                    )}

                  {(selectedComponent.type === 'relay' ||
                    selectedComponent.type === 'contactor' ||
                    selectedComponent.type === 'timer') && (
                    <>
                      {numInput(
                        'Coil Voltage (V)',
                        selectedComponent.props.coilVoltage,
                        24,
                        1,
                        1,
                        (cv) =>
                          onUpdateComponent(selectedComponent.id, { props: { coilVoltage: cv } })
                      )}
                      {numInput(
                        'Coil R (Ω)',
                        selectedComponent.props.coilResistance,
                        200,
                        10,
                        10,
                        (cr) =>
                          onUpdateComponent(selectedComponent.id, { props: { coilResistance: cr } })
                      )}
                    </>
                  )}

                  {selectedComponent.type === 'timer' &&
                    numInput(
                      'Delay (s)',
                      selectedComponent.props.delaySeconds,
                      3,
                      0.5,
                      0.2,
                      (d) =>
                        onUpdateComponent(selectedComponent.id, { props: { delaySeconds: d } })
                    )}

                  {selectedComponent.type === 'transformer' &&
                    numInput(
                      'Turns Ratio N2/N1',
                      selectedComponent.props.turnsRatio,
                      0.1,
                      0.05,
                      0.01,
                      (tr) => onUpdateComponent(selectedComponent.id, { props: { turnsRatio: tr } })
                    )}

                  {selectedComponent.type === 'zener' &&
                    numInput(
                      'Zener Vz (V)',
                      selectedComponent.props.zenerVoltage,
                      5.1,
                      0.1,
                      1,
                      (vz) =>
                        onUpdateComponent(selectedComponent.id, { props: { zenerVoltage: vz } })
                    )}

                  {selectedComponent.type === 'transistor' &&
                    numInput('Gain β', selectedComponent.props.beta, 100, 10, 10, (b) =>
                      onUpdateComponent(selectedComponent.id, { props: { beta: b } })
                    )}

                  {selectedComponent.type === 'mosfet' &&
                    numInput('Threshold Vth (V)', selectedComponent.props.vth, 2, 0.2, 0.5, (v) =>
                      onUpdateComponent(selectedComponent.id, { props: { vth: v } })
                    )}
                </div>

                {/* Dropdowns & Toggle Controls */}
                {(selectedComponent.type === 'switch' ||
                  selectedComponent.type === 'push-button' ||
                  selectedComponent.type === 'circuit-breaker') && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateComponent(selectedComponent.id, {
                          props: { closed: !selectedComponent.props.closed },
                        })
                      }
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold text-white transition ${
                        selectedComponent.props.closed
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-amber-600 hover:bg-amber-700'
                      }`}
                    >
                      {selectedComponent.props.closed ? 'State: CLOSED / PRESSED' : 'State: OPEN / RELEASED'}
                    </button>
                    {selectedComponent.type === 'push-button' && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateComponent(selectedComponent.id, {
                            props: { momentaryNC: !selectedComponent.props.momentaryNC },
                          })
                        }
                        className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-bold"
                      >
                        {selectedComponent.props.momentaryNC ? 'Type: NC' : 'Type: NO'}
                      </button>
                    )}
                  </div>
                )}

                {selectedComponent.type === 'led' && (
                  <label className="block space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      LED Color
                    </span>
                    <select
                      value={selectedComponent.props.ledColor ?? 'red'}
                      onChange={(e) =>
                        onUpdateComponent(selectedComponent.id, {
                          props: { ledColor: e.target.value as LabLedColor },
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs"
                    >
                      <option value="red">Red (1.8V)</option>
                      <option value="yellow">Yellow (2.0V)</option>
                      <option value="green">Green (2.2V)</option>
                      <option value="blue">Blue (3.0V)</option>
                      <option value="white">White (3.0V)</option>
                    </select>
                  </label>
                )}

                {selectedComponent.type === 'logic-gate' && (
                  <label className="block space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      Gate Function
                    </span>
                    <select
                      value={selectedComponent.props.gateType ?? 'AND'}
                      onChange={(e) =>
                        onUpdateComponent(selectedComponent.id, {
                          props: { gateType: e.target.value as LabGateVariant },
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-mono font-bold"
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                      <option value="NOT">NOT</option>
                      <option value="NAND">NAND</option>
                      <option value="XOR">XOR</option>
                    </select>
                  </label>
                )}

                {selectedComponent.type === 'multimeter' && (
                  <label className="block space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      Multimeter Mode
                    </span>
                    <select
                      value={selectedComponent.props.multimeterMode ?? 'V_DC'}
                      onChange={(e) =>
                        onUpdateComponent(selectedComponent.id, {
                          props: { multimeterMode: e.target.value as LabMultimeterMode },
                        })
                      }
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-mono font-bold"
                    >
                      <option value="V_DC">V DC</option>
                      <option value="V_AC">V AC (RMS)</option>
                      <option value="I_DC">I DC (Series)</option>
                      <option value="R_OHM">Resistance Ω</option>
                    </select>
                  </label>
                )}

                {/* Live Solved Values for selected component */}
                {selSim && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      Live Telemetry
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono tabular-nums">
                      <div>
                        <span className="block text-[10px] text-slate-500">ΔV</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {formatEngineeringValue(selSim.voltageDrop, 'V')}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500">I</span>
                        <span className="font-bold text-sky-600 dark:text-sky-400">
                          {formatEngineeringValue(selSim.current, 'A')}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-500">P</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {formatEngineeringValue(selSim.power, 'W')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* RESULTS & DIAGNOSTICS TAB */}
        {activeTab === 'results' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {t.diagnosticsTitle}
              </h3>
              {!simResult || simResult.diagnostics.length === 0 ? (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 text-xs text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{t.noDiagnostics}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {simResult.diagnostics.map((d) => {
                    const isErr = d.severity === 'error';
                    const isWarn = d.severity === 'warning';
                    const Icon = isErr ? XCircle : isWarn ? AlertTriangle : Info;
                    return (
                      <div
                        key={d.id}
                        className={`flex items-start gap-2 rounded-lg border p-2.5 text-xs ${
                          isErr
                            ? 'border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                            : isWarn
                            ? 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                            : 'border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{d.message[locale]}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {t.nodeVoltagesTitle}
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {components.map((c) => {
                  const st = simResult?.componentStates[c.id];
                  if (!st) return null;
                  return (
                    <div
                      key={c.id}
                      className="flex items-center justify-between px-3 py-2 text-xs font-mono tabular-nums bg-white dark:bg-slate-900"
                    >
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {c.label}
                      </span>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="text-slate-600 dark:text-slate-300">
                          {formatEngineeringValue(st.voltageDrop, 'V')}
                        </span>
                        <span className="text-sky-600 dark:text-sky-400">
                          {formatEngineeringValue(st.current, 'A')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* INSTRUMENTS & OSCILLOSCOPE TAB */}
        {activeTab === 'instruments' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                {t.scopeTitle}
              </h3>
              {renderWaveformSvg()}
            </div>

            {meterComponents.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Virtual Meters
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {meterComponents.map((m) => {
                    const st = simResult?.componentStates[m.id];
                    return (
                      <div
                        key={m.id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-950 text-sky-400 px-3.5 py-2.5 font-mono"
                      >
                        <span className="text-xs font-bold text-slate-300">
                          {m.label} ({m.type})
                        </span>
                        <span className="text-base font-extrabold tabular-nums">
                          {isRunning && st?.meterDisplay
                            ? `${st.meterDisplay} ${st.meterUnit ?? ''}`
                            : '---'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
