import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  Info,
  Plus,
  RotateCcw,
  Search,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import type {
  CalculatorCategoryGroup,
  CalculatorId,
  CalculatorOutput,
  LocalizedText,
} from '../types/electronics';
import {
  calculateBatteryCapacity,
  calculateCableSize,
  calculateCapacitor,
  calculateElectricalPower,
  calculateElectricityCost,
  calculateEnergyConsumption,
  calculateMotorPower,
  calculateOhmsLaw,
  calculateParallelResistance,
  calculatePowerFactor,
  calculateResistorColorCode,
  calculateSeriesResistance,
  calculateSolarPanel,
  calculateThreePhasePower,
  calculateTransformer,
  calculateUnitConversion,
  calculateVoltageDivider,
  calculateVoltageDrop,
  CALCULATORS_LIST,
  CONVERTER_UNITS,
  type CapMode,
  type CapUnit,
  type ConverterQuantity,
  type CurrentUnit,
  type OhmSolveMode,
  type PowerCalcMode,
  type ResistanceUnit,
  RESISTOR_COLOR_SPECS,
  type ResistorBandColor,
  type ResistorEntry,
  type VoltageUnit,
} from '../utils/calculatorsEngine';
import { CalculatorDiagram } from './CalculatorDiagram';

function parseInputNum(raw: string): number {
  if (raw.trim() === '') return Number.NaN;
  return Number(raw);
}

interface CalcLabels {
  ar: string;
  en: string;
  fr: string;
}

const L = (ar: string, en: string, fr: string): CalcLabels => ({ ar, en, fr });

export function CalculatorsWorkspace() {
  const { locale, t } = useI18n();
  const pick = (text: LocalizedText) => text[locale];

  const [selectedId, setSelectedId] = useState<CalculatorId>('ohms-law');
  const [groupFilter, setGroupFilter] = useState<CalculatorCategoryGroup | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Ohm's Law state
  const [ohmMode, setOhmMode] = useState<OhmSolveMode>('find-i');
  const [ohmV, setOhmV] = useState('12');
  const [ohmVUnit, setOhmVUnit] = useState<VoltageUnit>('V');
  const [ohmI, setOhmI] = useState('2');
  const [ohmIUnit, setOhmIUnit] = useState<CurrentUnit>('A');
  const [ohmR, setOhmR] = useState('220');
  const [ohmRUnit, setOhmRUnit] = useState<ResistanceUnit>('ohm');

  // 2. Electrical Power state
  const [pwrMode, setPwrMode] = useState<PowerCalcMode>('ac-single');
  const [pwrV, setPwrV] = useState('230');
  const [pwrI, setPwrI] = useState('10');
  const [pwrR, setPwrR] = useState('23');
  const [pwrPf, setPwrPf] = useState('0.85');

  // 3. Energy Consumption state
  const [enPower, setEnPower] = useState('1500');
  const [enUnit, setEnUnit] = useState<'W' | 'kW'>('W');
  const [enQty, setEnQty] = useState('1');
  const [enHours, setEnHours] = useState('5');
  const [enDays, setEnDays] = useState('30');

  // 4. Electricity Cost state
  const [costPower, setCostPower] = useState('2');
  const [costUnit, setCostUnit] = useState<'W' | 'kW'>('kW');
  const [costHours, setCostHours] = useState('6');
  const [costDays, setCostDays] = useState('30');
  const [costRate, setCostRate] = useState('0.15');
  const [costCurr, setCostCurr] = useState('USD');

  // 5. Resistor Color Code state
  const [resBands, setResBands] = useState<4 | 5>(4);
  const [band1, setBand1] = useState<ResistorBandColor>('red');
  const [band2, setBand2] = useState<ResistorBandColor>('violet');
  const [band3, setBand3] = useState<ResistorBandColor>('black');
  const [bandMult, setBandMult] = useState<ResistorBandColor>('orange');
  const [bandTol, setBandTol] = useState<ResistorBandColor>('gold');

  // 6 & 7. Series & Parallel Resistance state
  const [seriesRes, setSeriesRes] = useState<{ value: string; unit: ResistanceUnit }[]>([
    { value: '100', unit: 'ohm' },
    { value: '220', unit: 'ohm' },
    { value: '470', unit: 'ohm' },
  ]);
  const [seriesVs, setSeriesVs] = useState('12');

  const [parallelRes, setParallelRes] = useState<{ value: string; unit: ResistanceUnit }[]>([
    { value: '100', unit: 'ohm' },
    { value: '100', unit: 'ohm' },
  ]);
  const [parallelVs, setParallelVs] = useState('12');

  // 8. Capacitor state
  const [capMode, setCapMode] = useState<CapMode>('rc-time');
  const [capList, setCapList] = useState<{ value: string; unit: CapUnit }[]>([
    { value: '10', unit: 'uF' },
    { value: '22', unit: 'uF' },
  ]);
  const [capVal, setCapVal] = useState('100');
  const [capUnit, setCapUnit] = useState<CapUnit>('uF');
  const [capFreq, setCapFreq] = useState('50');
  const [capRes, setCapRes] = useState('1000');
  const [capVolt, setCapVolt] = useState('12');

  // 9. Voltage Divider state
  const [vdVin, setVdVin] = useState('12');
  const [vdR1, setVdR1] = useState('10');
  const [vdR1Unit, setVdR1Unit] = useState<ResistanceUnit>('kohm');
  const [vdR2, setVdR2] = useState('4.7');
  const [vdR2Unit, setVdR2Unit] = useState<ResistanceUnit>('kohm');

  // 10. Voltage Drop state
  const [dropPhase, setDropPhase] = useState<'single' | 'three'>('single');
  const [dropMat, setDropMat] = useState<'copper' | 'aluminum'>('copper');
  const [dropV, setDropV] = useState('230');
  const [dropI, setDropI] = useState('16');
  const [dropLen, setDropLen] = useState('25');
  const [dropMm2, setDropMm2] = useState('2.5');
  const [dropPf, setDropPf] = useState('0.9');

  // 11. Cable Size state
  const [cabPhase, setCabPhase] = useState<'single' | 'three'>('single');
  const [cabMat, setCabMat] = useState<'copper' | 'aluminum'>('copper');
  const [cabInst, setCabInst] = useState<'conduit' | 'air'>('conduit');
  const [cabInputMode, setCabInputMode] = useState<'power' | 'current'>('power');
  const [cabPowerKw, setCabPowerKw] = useState('3.5');
  const [cabCurrent, setCabCurrent] = useState('16');
  const [cabV, setCabV] = useState('230');
  const [cabPf, setCabPf] = useState('0.9');
  const [cabLen, setCabLen] = useState('25');
  const [cabMaxDrop, setCabMaxDrop] = useState('3');

  // 12. Transformer state
  const [txVp, setTxVp] = useState('230');
  const [txVs, setTxVs] = useState('24');
  const [txKva, setTxKva] = useState('1');
  const [txNp, setTxNp] = useState('1000');
  const [txEff, setTxEff] = useState('95');

  // 13. Motor Power state
  const [motPhase, setMotPhase] = useState<'single' | 'three'>('three');
  const [motMode, setMotMode] = useState<'from-electrical' | 'from-mechanical'>('from-mechanical');
  const [motV, setMotV] = useState('400');
  const [motI, setMotI] = useState('10');
  const [motKw, setMotKw] = useState('5.5');
  const [motPf, setMotPf] = useState('0.85');
  const [motEff, setMotEff] = useState('89');
  const [motRpm, setMotRpm] = useState('1450');

  // 14. Three Phase Power state
  const [tpVl, setTpVl] = useState('400');
  const [tpIl, setTpIl] = useState('15');
  const [tpPf, setTpPf] = useState('0.85');
  const [tpConn, setTpConn] = useState<'star' | 'delta'>('star');

  // 15. Power Factor state
  const [pfKw, setPfKw] = useState('50');
  const [pfV, setPfV] = useState('400');
  const [pfHz, setPfHz] = useState('50');
  const [pfCur, setPfCur] = useState('0.72');
  const [pfTar, setPfTar] = useState('0.95');

  // 16. Solar Panel state
  const [solWh, setSolWh] = useState('4800');
  const [solPsh, setSolPsh] = useState('5');
  const [solEff, setSolEff] = useState('80');
  const [solPanelWp, setSolPanelWp] = useState('450');

  // 17. Battery Capacity state
  const [batWh, setBatWh] = useState('3600');
  const [batDays, setBatDays] = useState('2');
  const [batVolt, setBatVolt] = useState('24');
  const [batDod, setBatDod] = useState('80');
  const [batInvEff, setBatInvEff] = useState('92');

  // 18. Unit Converter state
  const [convQty, setConvQty] = useState<ConverterQuantity>('power');
  const [convVal, setConvVal] = useState('2.2');
  const [convFrom, setConvFrom] = useState('kW');
  const [convTo, setConvTo] = useState('W');

  const handleResetActive = () => {
    switch (selectedId) {
      case 'ohms-law':
        setOhmMode('find-i');
        setOhmV('12');
        setOhmVUnit('V');
        setOhmI('2');
        setOhmIUnit('A');
        setOhmR('220');
        setOhmRUnit('ohm');
        break;
      case 'electrical-power':
        setPwrMode('ac-single');
        setPwrV('230');
        setPwrI('10');
        setPwrR('23');
        setPwrPf('0.85');
        break;
      case 'energy-consumption':
        setEnPower('1500');
        setEnUnit('W');
        setEnQty('1');
        setEnHours('5');
        setEnDays('30');
        break;
      case 'electricity-cost':
        setCostPower('2');
        setCostUnit('kW');
        setCostHours('6');
        setCostDays('30');
        setCostRate('0.15');
        setCostCurr('USD');
        break;
      case 'resistor-color':
        setResBands(4);
        setBand1('red');
        setBand2('violet');
        setBand3('black');
        setBandMult('orange');
        setBandTol('gold');
        break;
      case 'series-resistance':
        setSeriesRes([
          { value: '100', unit: 'ohm' },
          { value: '220', unit: 'ohm' },
          { value: '470', unit: 'ohm' },
        ]);
        setSeriesVs('12');
        break;
      case 'parallel-resistance':
        setParallelRes([
          { value: '100', unit: 'ohm' },
          { value: '100', unit: 'ohm' },
        ]);
        setParallelVs('12');
        break;
      case 'capacitor':
        setCapMode('rc-time');
        setCapList([
          { value: '10', unit: 'uF' },
          { value: '22', unit: 'uF' },
        ]);
        setCapVal('100');
        setCapUnit('uF');
        setCapFreq('50');
        setCapRes('1000');
        setCapVolt('12');
        break;
      case 'voltage-divider':
        setVdVin('12');
        setVdR1('10');
        setVdR1Unit('kohm');
        setVdR2('4.7');
        setVdR2Unit('kohm');
        break;
      case 'voltage-drop':
        setDropPhase('single');
        setDropMat('copper');
        setDropV('230');
        setDropI('16');
        setDropLen('25');
        setDropMm2('2.5');
        setDropPf('0.9');
        break;
      case 'cable-size':
        setCabPhase('single');
        setCabMat('copper');
        setCabInst('conduit');
        setCabInputMode('power');
        setCabPowerKw('3.5');
        setCabCurrent('16');
        setCabV('230');
        setCabPf('0.9');
        setCabLen('25');
        setCabMaxDrop('3');
        break;
      case 'transformer':
        setTxVp('230');
        setTxVs('24');
        setTxKva('1');
        setTxNp('1000');
        setTxEff('95');
        break;
      case 'motor-power':
        setMotPhase('three');
        setMotMode('from-mechanical');
        setMotV('400');
        setMotI('10');
        setMotKw('5.5');
        setMotPf('0.85');
        setMotEff('89');
        setMotRpm('1450');
        break;
      case 'three-phase-power':
        setTpVl('400');
        setTpIl('15');
        setTpPf('0.85');
        setTpConn('star');
        break;
      case 'power-factor':
        setPfKw('50');
        setPfV('400');
        setPfHz('50');
        setPfCur('0.72');
        setPfTar('0.95');
        break;
      case 'solar-panel':
        setSolWh('4800');
        setSolPsh('5');
        setSolEff('80');
        setSolPanelWp('450');
        break;
      case 'battery-capacity':
        setBatWh('3600');
        setBatDays('2');
        setBatVolt('24');
        setBatDod('80');
        setBatInvEff('92');
        break;
      case 'unit-converter':
        setConvQty('power');
        setConvVal('2.2');
        setConvFrom('kW');
        setConvTo('W');
        break;
    }
  };

  const output: CalculatorOutput = useMemo(() => {
    switch (selectedId) {
      case 'ohms-law':
        return calculateOhmsLaw({
          mode: ohmMode,
          voltage: parseInputNum(ohmV),
          voltageUnit: ohmVUnit,
          current: parseInputNum(ohmI),
          currentUnit: ohmIUnit,
          resistance: parseInputNum(ohmR),
          resistanceUnit: ohmRUnit,
        });
      case 'electrical-power':
        return calculateElectricalPower({
          mode: pwrMode,
          voltage: parseInputNum(pwrV),
          current: parseInputNum(pwrI),
          resistance: parseInputNum(pwrR),
          powerFactor: parseInputNum(pwrPf),
        });
      case 'energy-consumption':
        return calculateEnergyConsumption({
          power: parseInputNum(enPower),
          powerUnit: enUnit,
          quantity: parseInputNum(enQty),
          hoursPerDay: parseInputNum(enHours),
          days: parseInputNum(enDays),
        });
      case 'electricity-cost':
        return calculateElectricityCost({
          power: parseInputNum(costPower),
          powerUnit: costUnit,
          hoursPerDay: parseInputNum(costHours),
          daysPerMonth: parseInputNum(costDays),
          ratePerKwh: parseInputNum(costRate),
          currency: costCurr,
        });
      case 'resistor-color':
        return calculateResistorColorCode({
          bands: resBands,
          band1,
          band2,
          band3,
          multiplier: bandMult,
          tolerance: bandTol,
        });
      case 'series-resistance':
        return calculateSeriesResistance({
          resistors: seriesRes.map((r) => ({ value: parseInputNum(r.value), unit: r.unit })) as ResistorEntry[],
          sourceVoltage: parseInputNum(seriesVs),
        });
      case 'parallel-resistance':
        return calculateParallelResistance({
          resistors: parallelRes.map((r) => ({ value: parseInputNum(r.value), unit: r.unit })) as ResistorEntry[],
          sourceVoltage: parseInputNum(parallelVs),
        });
      case 'capacitor':
        return calculateCapacitor({
          mode: capMode,
          capacitors: capList.map((c) => ({ value: parseInputNum(c.value), unit: c.unit })),
          capacitance: parseInputNum(capVal),
          capacitanceUnit: capUnit,
          frequencyHz: parseInputNum(capFreq),
          resistanceOhms: parseInputNum(capRes),
          voltage: parseInputNum(capVolt),
        });
      case 'voltage-divider':
        return calculateVoltageDivider({
          vin: parseInputNum(vdVin),
          r1: parseInputNum(vdR1),
          r1Unit: vdR1Unit,
          r2: parseInputNum(vdR2),
          r2Unit: vdR2Unit,
        });
      case 'voltage-drop':
        return calculateVoltageDrop({
          phase: dropPhase,
          material: dropMat,
          voltage: parseInputNum(dropV),
          current: parseInputNum(dropI),
          lengthMeters: parseInputNum(dropLen),
          crossSectionMm2: parseInputNum(dropMm2),
          powerFactor: parseInputNum(dropPf),
        });
      case 'cable-size':
        return calculateCableSize({
          phase: cabPhase,
          material: cabMat,
          installation: cabInst,
          inputMode: cabInputMode,
          powerKw: parseInputNum(cabPowerKw),
          current: parseInputNum(cabCurrent),
          voltage: parseInputNum(cabV),
          powerFactor: parseInputNum(cabPf),
          lengthMeters: parseInputNum(cabLen),
          maxDropPct: parseInputNum(cabMaxDrop),
        });
      case 'transformer':
        return calculateTransformer({
          primaryVoltage: parseInputNum(txVp),
          secondaryVoltage: parseInputNum(txVs),
          powerKva: parseInputNum(txKva),
          primaryTurns: parseInputNum(txNp),
          efficiencyPct: parseInputNum(txEff),
        });
      case 'motor-power':
        return calculateMotorPower({
          phase: motPhase,
          solveMode: motMode,
          voltage: parseInputNum(motV),
          current: parseInputNum(motI),
          mechPowerKw: parseInputNum(motKw),
          powerFactor: parseInputNum(motPf),
          efficiencyPct: parseInputNum(motEff),
          rpm: parseInputNum(motRpm),
        });
      case 'three-phase-power':
        return calculateThreePhasePower({
          lineVoltage: parseInputNum(tpVl),
          lineCurrent: parseInputNum(tpIl),
          powerFactor: parseInputNum(tpPf),
          connection: tpConn,
        });
      case 'power-factor':
        return calculatePowerFactor({
          activePowerKw: parseInputNum(pfKw),
          voltage: parseInputNum(pfV),
          frequencyHz: parseInputNum(pfHz),
          currentPf: parseInputNum(pfCur),
          targetPf: parseInputNum(pfTar),
        });
      case 'solar-panel':
        return calculateSolarPanel({
          dailyEnergyWh: parseInputNum(solWh),
          peakSunHours: parseInputNum(solPsh),
          systemEfficiencyPct: parseInputNum(solEff),
          panelWattPeak: parseInputNum(solPanelWp),
        });
      case 'battery-capacity':
        return calculateBatteryCapacity({
          dailyEnergyWh: parseInputNum(batWh),
          autonomyDays: parseInputNum(batDays),
          systemVoltage: parseInputNum(batVolt),
          dodPct: parseInputNum(batDod),
          inverterEfficiencyPct: parseInputNum(batInvEff),
        });
      case 'unit-converter':
        return calculateUnitConversion({
          quantity: convQty,
          value: parseInputNum(convVal),
          fromUnit: convFrom,
          toUnit: convTo,
        });
    }
  }, [
    selectedId,
    ohmMode, ohmV, ohmVUnit, ohmI, ohmIUnit, ohmR, ohmRUnit,
    pwrMode, pwrV, pwrI, pwrR, pwrPf,
    enPower, enUnit, enQty, enHours, enDays,
    costPower, costUnit, costHours, costDays, costRate, costCurr,
    resBands, band1, band2, band3, bandMult, bandTol,
    seriesRes, seriesVs,
    parallelRes, parallelVs,
    capMode, capList, capVal, capUnit, capFreq, capRes, capVolt,
    vdVin, vdR1, vdR1Unit, vdR2, vdR2Unit,
    dropPhase, dropMat, dropV, dropI, dropLen, dropMm2, dropPf,
    cabPhase, cabMat, cabInst, cabInputMode, cabPowerKw, cabCurrent, cabV, cabPf, cabLen, cabMaxDrop,
    txVp, txVs, txKva, txNp, txEff,
    motPhase, motMode, motV, motI, motKw, motPf, motEff, motRpm,
    tpVl, tpIl, tpPf, tpConn,
    pfKw, pfV, pfHz, pfCur, pfTar,
    solWh, solPsh, solEff, solPanelWp,
    batWh, batDays, batVolt, batDod, batInvEff,
    convQty, convVal, convFrom, convTo,
  ]);

  const filteredCalcs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CALCULATORS_LIST.filter((c) => {
      if (groupFilter !== 'all' && c.group !== groupFilter) return false;
      if (!q) return true;
      const meta = t.calculators.items[c.id];
      return (
        meta.name.toLowerCase().includes(q) ||
        meta.shortDesc.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    });
  }, [groupFilter, searchQuery, t]);

  const eyebrowClass =
    locale === 'ar'
      ? 'text-xs font-bold text-[#2563EB] dark:text-[#00BFFF]'
      : 'font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider';

  const inputClass =
    'w-full h-10 px-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-sm font-mono-tech text-slate-900 dark:text-white focus-visible:outline-2 focus-visible:outline-[#2563EB]';
  const selectClass =
    'h-10 px-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus-visible:outline-2 focus-visible:outline-[#2563EB]';
  const labelClass = 'block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5';

  const digitColors: ResistorBandColor[] = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white'];
  const firstDigitColors = digitColors.filter((c) => c !== 'black');
  const multColors: ResistorBandColor[] = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gold', 'silver'];
  const tolColors: ResistorBandColor[] = ['brown', 'red', 'green', 'blue', 'violet', 'gold', 'silver'];

  const renderInputs = () => {
    switch (selectedId) {
      case 'ohms-law':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700">
              {(
                [
                  { id: 'find-v', label: pick(L('حساب الجهد V', 'Find Voltage V', 'Calculer V')) },
                  { id: 'find-i', label: pick(L('حساب التيار I', 'Find Current I', 'Calculer I')) },
                  { id: 'find-r', label: pick(L('حساب المقاومة R', 'Find R', 'Calculer R')) },
                  { id: 'find-p', label: pick(L('حساب القدرة P', 'Find Power P', 'Calculer P')) },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setOhmMode(m.id)}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    ohmMode === m.id
                      ? 'bg-[#2563EB] text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ohmMode !== 'find-v' && (
                <div>
                  <label htmlFor="ohm-v" className={labelClass}>
                    {pick(L('الجهد الكهربائي (V)', 'Voltage (V)', 'Tension (V)'))}
                  </label>
                  <div className="flex gap-2">
                    <input id="ohm-v" data-testid="calc-input-v" type="number" step="any" value={ohmV} onChange={(e) => setOhmV(e.target.value)} className={inputClass} dir="ltr" />
                    <select value={ohmVUnit} onChange={(e) => setOhmVUnit(e.target.value as VoltageUnit)} className={selectClass} aria-label="Voltage unit">
                      <option value="mV">mV</option>
                      <option value="V">V</option>
                      <option value="kV">kV</option>
                    </select>
                  </div>
                </div>
              )}

              {ohmMode !== 'find-i' && ohmMode !== 'find-p' && (
                <div>
                  <label htmlFor="ohm-i" className={labelClass}>
                    {pick(L('شدة التيار (I)', 'Current (I)', 'Courant (I)'))}
                  </label>
                  <div className="flex gap-2">
                    <input id="ohm-i" data-testid="calc-input-i" type="number" step="any" value={ohmI} onChange={(e) => setOhmI(e.target.value)} className={inputClass} dir="ltr" />
                    <select value={ohmIUnit} onChange={(e) => setOhmIUnit(e.target.value as CurrentUnit)} className={selectClass} aria-label="Current unit">
                      <option value="mA">mA</option>
                      <option value="A">A</option>
                    </select>
                  </div>
                </div>
              )}

              {ohmMode === 'find-p' && (
                <div>
                  <label htmlFor="ohm-i-p" className={labelClass}>
                    {pick(L('شدة التيار (I)', 'Current (I)', 'Courant (I)'))}
                  </label>
                  <div className="flex gap-2">
                    <input id="ohm-i-p" type="number" step="any" value={ohmI} onChange={(e) => setOhmI(e.target.value)} className={inputClass} dir="ltr" />
                    <select value={ohmIUnit} onChange={(e) => setOhmIUnit(e.target.value as CurrentUnit)} className={selectClass} aria-label="Current unit">
                      <option value="mA">mA</option>
                      <option value="A">A</option>
                    </select>
                  </div>
                </div>
              )}

              {(ohmMode === 'find-v' || ohmMode === 'find-i') && (
                <div>
                  <label htmlFor="ohm-r" className={labelClass}>
                    {pick(L('المقاومة (R)', 'Resistance (R)', 'Résistance (R)'))}
                  </label>
                  <div className="flex gap-2">
                    <input id="ohm-r" data-testid="calc-input-r" type="number" step="any" value={ohmR} onChange={(e) => setOhmR(e.target.value)} className={inputClass} dir="ltr" />
                    <select value={ohmRUnit} onChange={(e) => setOhmRUnit(e.target.value as ResistanceUnit)} className={selectClass} aria-label="Resistance unit">
                      <option value="ohm">Ω</option>
                      <option value="kohm">kΩ</option>
                      <option value="mohm">MΩ</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'electrical-power':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700">
              {(
                [
                  { id: 'ac-single', label: pick(L('متردد 1-طور', 'AC 1-Phase', 'CA Monophasé')) },
                  { id: 'dc', label: pick(L('مستمر DC', 'DC (V×I)', 'CC (V×I)')) },
                  { id: 'from-ir', label: 'I² × R' },
                  { id: 'from-vr', label: 'V² / R' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPwrMode(m.id)}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold cursor-pointer ${
                    pwrMode === m.id ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {pwrMode !== 'from-ir' && (
                <div>
                  <label htmlFor="pwr-v" className={labelClass}>{pick(L('الجهد (V)', 'Voltage (V)', 'Tension (V)'))}</label>
                  <input id="pwr-v" type="number" step="any" value={pwrV} onChange={(e) => setPwrV(e.target.value)} className={inputClass} dir="ltr" />
                </div>
              )}
              {pwrMode !== 'from-vr' && (
                <div>
                  <label htmlFor="pwr-i" className={labelClass}>{pick(L('التيار (A)', 'Current (A)', 'Courant (A)'))}</label>
                  <input id="pwr-i" type="number" step="any" value={pwrI} onChange={(e) => setPwrI(e.target.value)} className={inputClass} dir="ltr" />
                </div>
              )}
              {(pwrMode === 'from-ir' || pwrMode === 'from-vr') && (
                <div>
                  <label htmlFor="pwr-r" className={labelClass}>{pick(L('المقاومة (Ω)', 'Resistance (Ω)', 'Résistance (Ω)'))}</label>
                  <input id="pwr-r" type="number" step="any" value={pwrR} onChange={(e) => setPwrR(e.target.value)} className={inputClass} dir="ltr" />
                </div>
              )}
              {pwrMode === 'ac-single' && (
                <div>
                  <label htmlFor="pwr-pf" className={labelClass}>{pick(L('معامل القدرة cos(φ)', 'Power Factor cos(φ)', 'Facteur cos(φ)'))}</label>
                  <input id="pwr-pf" type="number" step="0.01" min="0.01" max="1" value={pwrPf} onChange={(e) => setPwrPf(e.target.value)} className={inputClass} dir="ltr" />
                </div>
              )}
            </div>
          </div>
        );

      case 'energy-consumption':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="en-p" className={labelClass}>{pick(L('قدرة الجهاز', 'Appliance Power', 'Puissance'))}</label>
              <div className="flex gap-2">
                <input id="en-p" type="number" step="any" value={enPower} onChange={(e) => setEnPower(e.target.value)} className={inputClass} dir="ltr" />
                <select value={enUnit} onChange={(e) => setEnUnit(e.target.value as 'W' | 'kW')} className={selectClass}>
                  <option value="W">W</option>
                  <option value="kW">kW</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="en-q" className={labelClass}>{pick(L('عدد الأجهزة', 'Quantity', 'Quantité'))}</label>
              <input id="en-q" type="number" min="1" step="1" value={enQty} onChange={(e) => setEnQty(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="en-h" className={labelClass}>{pick(L('ساعات التشغيل / يوم', 'Hours / Day', 'Heures / jour'))}</label>
              <input id="en-h" type="number" step="any" value={enHours} onChange={(e) => setEnHours(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="en-d" className={labelClass}>{pick(L('عدد الأيام', 'Period (Days)', 'Jours'))}</label>
              <input id="en-d" type="number" min="1" step="1" value={enDays} onChange={(e) => setEnDays(e.target.value)} className={inputClass} dir="ltr" />
            </div>
          </div>
        );

      case 'electricity-cost':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="cost-p" className={labelClass}>{pick(L('القدرة', 'Power', 'Puissance'))}</label>
              <div className="flex gap-2">
                <input id="cost-p" type="number" step="any" value={costPower} onChange={(e) => setCostPower(e.target.value)} className={inputClass} dir="ltr" />
                <select value={costUnit} onChange={(e) => setCostUnit(e.target.value as 'W' | 'kW')} className={selectClass}>
                  <option value="W">W</option>
                  <option value="kW">kW</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="cost-h" className={labelClass}>{pick(L('ساعات / يوم', 'Hours / Day', 'Heures / j'))}</label>
              <input id="cost-h" type="number" step="any" value={costHours} onChange={(e) => setCostHours(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="cost-d" className={labelClass}>{pick(L('أيام / شهر', 'Days / Month', 'Jours / mois'))}</label>
              <input id="cost-d" type="number" step="1" value={costDays} onChange={(e) => setCostDays(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="cost-r" className={labelClass}>{pick(L('سعر الـ kWh', 'Tariff / kWh', 'Tarif / kWh'))}</label>
              <input id="cost-r" type="number" step="0.01" value={costRate} onChange={(e) => setCostRate(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="cost-c" className={labelClass}>{pick(L('العملة', 'Currency', 'Devise'))}</label>
              <select id="cost-c" value={costCurr} onChange={(e) => setCostCurr(e.target.value)} className={`${selectClass} w-full`}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="SAR">SAR</option>
                <option value="AED">AED</option>
                <option value="LBP">LBP</option>
              </select>
            </div>
          </div>
        );

      case 'resistor-color':
        return (
          <div className="space-y-4">
            <div className="inline-flex p-1 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 gap-1">
              {([4, 5] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setResBands(b)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                    resBands === b ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {b} {pick(L('حلقات', 'Bands', 'Anneaux'))}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label htmlFor="rc-b1" className={labelClass}>{t.lab.band1}</label>
                <select id="rc-b1" value={band1} onChange={(e) => setBand1(e.target.value as ResistorBandColor)} className={`${selectClass} w-full`}>
                  {firstDigitColors.map((c) => <option key={c} value={c}>{RESISTOR_COLOR_SPECS[c].label[locale]}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="rc-b2" className={labelClass}>{t.lab.band2}</label>
                <select id="rc-b2" value={band2} onChange={(e) => setBand2(e.target.value as ResistorBandColor)} className={`${selectClass} w-full`}>
                  {digitColors.map((c) => <option key={c} value={c}>{RESISTOR_COLOR_SPECS[c].label[locale]}</option>)}
                </select>
              </div>
              {resBands === 5 && (
                <div>
                  <label htmlFor="rc-b3" className={labelClass}>{pick(L('الحلقة 3', 'Band 3', 'Anneau 3'))}</label>
                  <select id="rc-b3" value={band3} onChange={(e) => setBand3(e.target.value as ResistorBandColor)} className={`${selectClass} w-full`}>
                    {digitColors.map((c) => <option key={c} value={c}>{RESISTOR_COLOR_SPECS[c].label[locale]}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label htmlFor="rc-mult" className={labelClass}>{t.lab.multiplier}</label>
                <select id="rc-mult" value={bandMult} onChange={(e) => setBandMult(e.target.value as ResistorBandColor)} className={`${selectClass} w-full`}>
                  {multColors.map((c) => <option key={c} value={c}>{RESISTOR_COLOR_SPECS[c].label[locale]}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="rc-tol" className={labelClass}>{t.lab.tolerance}</label>
                <select id="rc-tol" value={bandTol} onChange={(e) => setBandTol(e.target.value as ResistorBandColor)} className={`${selectClass} w-full`}>
                  {tolColors.map((c) => <option key={c} value={c}>{RESISTOR_COLOR_SPECS[c].label[locale]} (±{RESISTOR_COLOR_SPECS[c].tolerance}%)</option>)}
                </select>
              </div>
            </div>
          </div>
        );

      case 'series-resistance':
      case 'parallel-resistance': {
        const list = selectedId === 'series-resistance' ? seriesRes : parallelRes;
        const setList = selectedId === 'series-resistance' ? setSeriesRes : setParallelRes;
        const vs = selectedId === 'series-resistance' ? seriesVs : parallelVs;
        const setVs = selectedId === 'series-resistance' ? setSeriesVs : setParallelVs;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {list.map((entry, idx) => (
                <div key={idx} className="flex items-end gap-2">
                  <div className="flex-1">
                    <label htmlFor={`res-item-${idx}`} className={labelClass}>R{idx + 1}</label>
                    <div className="flex gap-1.5">
                      <input
                        id={`res-item-${idx}`}
                        type="number"
                        step="any"
                        value={entry.value}
                        onChange={(e) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], value: e.target.value };
                          setList(next);
                        }}
                        className={inputClass}
                        dir="ltr"
                      />
                      <select
                        value={entry.unit}
                        onChange={(e) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], unit: e.target.value as ResistanceUnit };
                          setList(next);
                        }}
                        className={selectClass}
                      >
                        <option value="ohm">Ω</option>
                        <option value="kohm">kΩ</option>
                        <option value="mohm">MΩ</option>
                      </select>
                    </div>
                  </div>
                  {list.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setList(list.filter((_, i) => i !== idx))}
                      aria-label={`Remove R${idx + 1}`}
                      className="h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-[#EF4444] flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              {list.length < 8 && (
                <button
                  type="button"
                  onClick={() => setList([...list, { value: '100', unit: 'ohm' }])}
                  className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0F172A] hover:border-[#2563EB] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{pick(L('إضافة مقاومة', 'Add Resistor', 'Ajouter résistance'))}</span>
                </button>
              )}
              <div className="w-48">
                <label htmlFor="res-vs" className={labelClass}>{pick(L('جهد المصدر V_s (اختياري)', 'Source Voltage V_s', 'Tension source V_s'))}</label>
                <input id="res-vs" type="number" step="any" value={vs} onChange={(e) => setVs(e.target.value)} className={inputClass} dir="ltr" />
              </div>
            </div>
          </div>
        );
      }

      case 'capacitor':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700">
              {(
                [
                  { id: 'rc-time', label: pick(L('ثابت الزمن RC (τ)', 'RC Time (τ)', 'Constante RC (τ)')) },
                  { id: 'reactance', label: pick(L('المفاعلة السعوية Xc', 'Reactance Xc', 'Réactance Xc')) },
                  { id: 'series-parallel', label: pick(L('توالي / توازي', 'Series / Parallel', 'Série / Parallèle')) },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setCapMode(m.id)}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold cursor-pointer ${
                    capMode === m.id ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {capMode === 'series-parallel' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {capList.map((c, idx) => (
                    <div key={idx} className="flex items-end gap-2">
                      <div className="flex-1">
                        <label htmlFor={`cap-${idx}`} className={labelClass}>C{idx + 1}</label>
                        <div className="flex gap-1.5">
                          <input
                            id={`cap-${idx}`}
                            type="number"
                            step="any"
                            value={c.value}
                            onChange={(e) => {
                              const next = [...capList];
                              next[idx] = { ...next[idx], value: e.target.value };
                              setCapList(next);
                            }}
                            className={inputClass}
                            dir="ltr"
                          />
                          <select
                            value={c.unit}
                            onChange={(e) => {
                              const next = [...capList];
                              next[idx] = { ...next[idx], unit: e.target.value as CapUnit };
                              setCapList(next);
                            }}
                            className={selectClass}
                          >
                            <option value="pF">pF</option>
                            <option value="nF">nF</option>
                            <option value="uF">µF</option>
                            <option value="mF">mF</option>
                          </select>
                        </div>
                      </div>
                      {capList.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setCapList(capList.filter((_, i) => i !== idx))}
                          className="h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-[#EF4444] flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {capList.length < 6 && (
                  <button
                    type="button"
                    onClick={() => setCapList([...capList, { value: '10', unit: 'uF' }])}
                    className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{pick(L('إضافة مكثف', 'Add Capacitor', 'Ajouter condensateur'))}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="cap-c" className={labelClass}>{pick(L('السعة (C)', 'Capacitance (C)', 'Capacité (C)'))}</label>
                  <div className="flex gap-2">
                    <input id="cap-c" type="number" step="any" value={capVal} onChange={(e) => setCapVal(e.target.value)} className={inputClass} dir="ltr" />
                    <select value={capUnit} onChange={(e) => setCapUnit(e.target.value as CapUnit)} className={selectClass}>
                      <option value="pF">pF</option>
                      <option value="nF">nF</option>
                      <option value="uF">µF</option>
                      <option value="mF">mF</option>
                    </select>
                  </div>
                </div>
                {capMode === 'reactance' ? (
                  <div>
                    <label htmlFor="cap-f" className={labelClass}>{pick(L('التردد (Hz)', 'Frequency (Hz)', 'Fréquence (Hz)'))}</label>
                    <input id="cap-f" type="number" step="any" value={capFreq} onChange={(e) => setCapFreq(e.target.value)} className={inputClass} dir="ltr" />
                  </div>
                ) : (
                  <>
                    <div>
                      <label htmlFor="cap-r" className={labelClass}>{pick(L('المقاومة R (Ω)', 'Resistance R (Ω)', 'Résistance R (Ω)'))}</label>
                      <input id="cap-r" type="number" step="any" value={capRes} onChange={(e) => setCapRes(e.target.value)} className={inputClass} dir="ltr" />
                    </div>
                    <div>
                      <label htmlFor="cap-v" className={labelClass}>{pick(L('جهد الشحن (V)', 'Charge Voltage (V)', 'Tension (V)'))}</label>
                      <input id="cap-v" type="number" step="any" value={capVolt} onChange={(e) => setCapVolt(e.target.value)} className={inputClass} dir="ltr" />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );

      case 'voltage-divider':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="vd-vin" className={labelClass}>{pick(L('جهد الدخل V_in (V)', 'Input Voltage V_in (V)', 'Tension V_in (V)'))}</label>
              <input id="vd-vin" type="number" step="any" value={vdVin} onChange={(e) => setVdVin(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="vd-r1" className={labelClass}>R₁</label>
              <div className="flex gap-2">
                <input id="vd-r1" type="number" step="any" value={vdR1} onChange={(e) => setVdR1(e.target.value)} className={inputClass} dir="ltr" />
                <select value={vdR1Unit} onChange={(e) => setVdR1Unit(e.target.value as ResistanceUnit)} className={selectClass}>
                  <option value="ohm">Ω</option>
                  <option value="kohm">kΩ</option>
                  <option value="mohm">MΩ</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="vd-r2" className={labelClass}>R₂</label>
              <div className="flex gap-2">
                <input id="vd-r2" type="number" step="any" value={vdR2} onChange={(e) => setVdR2(e.target.value)} className={inputClass} dir="ltr" />
                <select value={vdR2Unit} onChange={(e) => setVdR2Unit(e.target.value as ResistanceUnit)} className={selectClass}>
                  <option value="ohm">Ω</option>
                  <option value="kohm">kΩ</option>
                  <option value="mohm">MΩ</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'voltage-drop':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="vd-ph" className={labelClass}>{pick(L('الطور', 'System Phase', 'Système'))}</label>
              <select id="vd-ph" value={dropPhase} onChange={(e) => { const v = e.target.value as 'single' | 'three'; setDropPhase(v); setDropV(v === 'three' ? '400' : '230'); }} className={`${selectClass} w-full`}>
                <option value="single">{pick(L('أحادي الطور (1-Ph)', 'Single Phase', 'Monophasé'))}</option>
                <option value="three">{pick(L('ثلاثي الطور (3-Ph)', 'Three Phase', 'Triphasé'))}</option>
              </select>
            </div>
            <div>
              <label htmlFor="vd-mat" className={labelClass}>{pick(L('معدن الموصل', 'Conductor Material', 'Conducteur'))}</label>
              <select id="vd-mat" value={dropMat} onChange={(e) => setDropMat(e.target.value as 'copper' | 'aluminum')} className={`${selectClass} w-full`}>
                <option value="copper">{pick(L('نحاس (Copper)', 'Copper (Cu)', 'Cuivre (Cu)'))}</option>
                <option value="aluminum">{pick(L('ألمنيوم (Aluminum)', 'Aluminum (Al)', 'Aluminium (Al)'))}</option>
              </select>
            </div>
            <div>
              <label htmlFor="vd-v" className={labelClass}>{pick(L('الجهد (V)', 'Voltage (V)', 'Tension (V)'))}</label>
              <input id="vd-v" type="number" step="any" value={dropV} onChange={(e) => setDropV(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="vd-i" className={labelClass}>{pick(L('التيار (A)', 'Current (A)', 'Courant (A)'))}</label>
              <input id="vd-i" type="number" step="any" value={dropI} onChange={(e) => setDropI(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="vd-l" className={labelClass}>{pick(L('طول المسار L (m)', 'One-way Length (m)', 'Longueur L (m)'))}</label>
              <input id="vd-l" type="number" step="any" value={dropLen} onChange={(e) => setDropLen(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="vd-s" className={labelClass}>{pick(L('مقطع السلك (mm²)', 'Wire Size (mm²)', 'Section (mm²)'))}</label>
              <select id="vd-s" value={dropMm2} onChange={(e) => setDropMm2(e.target.value)} className={`${selectClass} w-full`} dir="ltr">
                {[1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120].map((s) => <option key={s} value={s}>{s} mm²</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="vd-pf" className={labelClass}>cos(φ)</label>
              <input id="vd-pf" type="number" step="0.01" min="0.1" max="1" value={dropPf} onChange={(e) => setDropPf(e.target.value)} className={inputClass} dir="ltr" />
            </div>
          </div>
        );

      case 'cable-size':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="cs-ph" className={labelClass}>{pick(L('النظام', 'Phase', 'Système'))}</label>
              <select id="cs-ph" value={cabPhase} onChange={(e) => { const v = e.target.value as 'single' | 'three'; setCabPhase(v); setCabV(v === 'three' ? '400' : '230'); }} className={`${selectClass} w-full`}>
                <option value="single">{pick(L('أحادي الطور', 'Single Phase', 'Monophasé'))}</option>
                <option value="three">{pick(L('ثلاثي الطور', 'Three Phase', 'Triphasé'))}</option>
              </select>
            </div>
            <div>
              <label htmlFor="cs-mat" className={labelClass}>{pick(L('الموصل', 'Material', 'Matériau'))}</label>
              <select id="cs-mat" value={cabMat} onChange={(e) => setCabMat(e.target.value as 'copper' | 'aluminum')} className={`${selectClass} w-full`}>
                <option value="copper">{pick(L('نحاس (Cu)', 'Copper (Cu)', 'Cuivre (Cu)'))}</option>
                <option value="aluminum">{pick(L('ألمنيوم (Al)', 'Aluminum (Al)', 'Aluminium (Al)'))}</option>
              </select>
            </div>
            <div>
              <label htmlFor="cs-inst" className={labelClass}>{pick(L('طريقة التمديد', 'Installation', 'Pose'))}</label>
              <select id="cs-inst" value={cabInst} onChange={(e) => setCabInst(e.target.value as 'conduit' | 'air')} className={`${selectClass} w-full`}>
                <option value="conduit">{pick(L('داخل أنبوب / جدار', 'In Conduit / Wall', 'Sous conduit / encastré'))}</option>
                <option value="air">{pick(L('حامل كوابل مفتوح', 'Open Tray / Air', 'Chemin de câbles ouvert'))}</option>
              </select>
            </div>
            <div>
              <label htmlFor="cs-imode" className={labelClass}>{pick(L('تحديد الحمل بواسطة', 'Load Input', 'Entrée charge'))}</label>
              <select id="cs-imode" value={cabInputMode} onChange={(e) => setCabInputMode(e.target.value as 'power' | 'current')} className={`${selectClass} w-full`}>
                <option value="power">{pick(L('القدرة (kW)', 'Power (kW)', 'Puissance (kW)'))}</option>
                <option value="current">{pick(L('التيار (A)', 'Current (A)', 'Courant (A)'))}</option>
              </select>
            </div>
            {cabInputMode === 'power' ? (
              <div>
                <label htmlFor="cs-kw" className={labelClass}>{pick(L('قدرة الحمل (kW)', 'Load Power (kW)', 'Puissance (kW)'))}</label>
                <input id="cs-kw" type="number" step="any" value={cabPowerKw} onChange={(e) => setCabPowerKw(e.target.value)} className={inputClass} dir="ltr" />
              </div>
            ) : (
              <div>
                <label htmlFor="cs-i" className={labelClass}>{pick(L('التيار (A)', 'Current (A)', 'Courant (A)'))}</label>
                <input id="cs-i" type="number" step="any" value={cabCurrent} onChange={(e) => setCabCurrent(e.target.value)} className={inputClass} dir="ltr" />
              </div>
            )}
            <div>
              <label htmlFor="cs-v" className={labelClass}>{pick(L('الجهد (V)', 'Voltage (V)', 'Tension (V)'))}</label>
              <input id="cs-v" type="number" step="any" value={cabV} onChange={(e) => setCabV(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="cs-l" className={labelClass}>{pick(L('الطول (m)', 'Length (m)', 'Longueur (m)'))}</label>
              <input id="cs-l" type="number" step="any" value={cabLen} onChange={(e) => setCabLen(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="cs-md" className={labelClass}>{pick(L('أقصى هبوط جهد (%)', 'Max Drop (%)', 'Chute max (%)'))}</label>
              <input id="cs-md" type="number" step="0.5" value={cabMaxDrop} onChange={(e) => setCabMaxDrop(e.target.value)} className={inputClass} dir="ltr" />
            </div>
          </div>
        );

      case 'transformer':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="tx-vp" className={labelClass}>{pick(L('جهد الابتدائي V_p (V)', 'Primary V_p (V)', 'Primaire V_p (V)'))}</label>
              <input id="tx-vp" type="number" step="any" value={txVp} onChange={(e) => setTxVp(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="tx-vs" className={labelClass}>{pick(L('جهد الثانوي V_s (V)', 'Secondary V_s (V)', 'Secondaire V_s (V)'))}</label>
              <input id="tx-vs" type="number" step="any" value={txVs} onChange={(e) => setTxVs(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="tx-kva" className={labelClass}>{pick(L('الاستطاعة (kVA)', 'Power (kVA)', 'Puissance (kVA)'))}</label>
              <input id="tx-kva" type="number" step="any" value={txKva} onChange={(e) => setTxKva(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="tx-np" className={labelClass}>{pick(L('لفات الابتدائي (N_p)', 'Primary Turns (N_p)', 'Spires prim. (N_p)'))}</label>
              <input id="tx-np" type="number" step="1" value={txNp} onChange={(e) => setTxNp(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="tx-eff" className={labelClass}>{pick(L('الكفاءة (%)', 'Efficiency (%)', 'Rendement (%)'))}</label>
              <input id="tx-eff" type="number" step="0.5" value={txEff} onChange={(e) => setTxEff(e.target.value)} className={inputClass} dir="ltr" />
            </div>
          </div>
        );

      case 'motor-power':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="mot-ph" className={labelClass}>{pick(L('نوع المحرك', 'Motor Phase', 'Alimentation'))}</label>
              <select id="mot-ph" value={motPhase} onChange={(e) => { const v = e.target.value as 'single' | 'three'; setMotPhase(v); setMotV(v === 'three' ? '400' : '230'); }} className={`${selectClass} w-full`}>
                <option value="three">{pick(L('ثلاثي الطور (3-Ph)', 'Three Phase', 'Triphasé'))}</option>
                <option value="single">{pick(L('أحادي الطور (1-Ph)', 'Single Phase', 'Monophasé'))}</option>
              </select>
            </div>
            <div>
              <label htmlFor="mot-mode" className={labelClass}>{pick(L('الحساب انطلاقاً من', 'Calculate From', 'Calcul depuis'))}</label>
              <select id="mot-mode" value={motMode} onChange={(e) => setMotMode(e.target.value as 'from-electrical' | 'from-mechanical')} className={`${selectClass} w-full`}>
                <option value="from-mechanical">{pick(L('قدرة العمود (kW) ← التيار', 'Shaft Power (kW) → Amps', 'Puissance kW → Courant'))}</option>
                <option value="from-electrical">{pick(L('التيار المقاس (A) ← القدرة', 'Measured Current (A) → Power', 'Courant A → Puissance'))}</option>
              </select>
            </div>
            {motMode === 'from-mechanical' ? (
              <div>
                <label htmlFor="mot-kw" className={labelClass}>{pick(L('القدرة الميكانيكية (kW)', 'Shaft Power (kW)', 'Puissance arbre (kW)'))}</label>
                <input id="mot-kw" type="number" step="any" value={motKw} onChange={(e) => setMotKw(e.target.value)} className={inputClass} dir="ltr" />
              </div>
            ) : (
              <div>
                <label htmlFor="mot-i" className={labelClass}>{pick(L('التيار (A)', 'Current (A)', 'Courant (A)'))}</label>
                <input id="mot-i" type="number" step="any" value={motI} onChange={(e) => setMotI(e.target.value)} className={inputClass} dir="ltr" />
              </div>
            )}
            <div>
              <label htmlFor="mot-v" className={labelClass}>{pick(L('الجهد (V)', 'Voltage (V)', 'Tension (V)'))}</label>
              <input id="mot-v" type="number" step="any" value={motV} onChange={(e) => setMotV(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="mot-pf" className={labelClass}>cos(φ)</label>
              <input id="mot-pf" type="number" step="0.01" value={motPf} onChange={(e) => setMotPf(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="mot-eff" className={labelClass}>{pick(L('الكفاءة η (%)', 'Efficiency η (%)', 'Rendement η (%)'))}</label>
              <input id="mot-eff" type="number" step="1" value={motEff} onChange={(e) => setMotEff(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="mot-rpm" className={labelClass}>{pick(L('السرعة (RPM)', 'Speed (RPM)', 'Vitesse (tr/min)'))}</label>
              <input id="mot-rpm" type="number" step="10" value={motRpm} onChange={(e) => setMotRpm(e.target.value)} className={inputClass} dir="ltr" />
            </div>
          </div>
        );

      case 'three-phase-power':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="tp-vl" className={labelClass}>{pick(L('جهد الخط V_L (V)', 'Line Voltage V_L (V)', 'Tension composée U_L (V)'))}</label>
              <input id="tp-vl" type="number" step="any" value={tpVl} onChange={(e) => setTpVl(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="tp-il" className={labelClass}>{pick(L('تيار الخط I_L (A)', 'Line Current I_L (A)', 'Courant de ligne I_L (A)'))}</label>
              <input id="tp-il" type="number" step="any" value={tpIl} onChange={(e) => setTpIl(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="tp-pf" className={labelClass}>cos(φ)</label>
              <input id="tp-pf" type="number" step="0.01" value={tpPf} onChange={(e) => setTpPf(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="tp-conn" className={labelClass}>{pick(L('التوصيل', 'Connection', 'Couplage'))}</label>
              <select id="tp-conn" value={tpConn} onChange={(e) => setTpConn(e.target.value as 'star' | 'delta')} className={`${selectClass} w-full`}>
                <option value="star">{pick(L('نجمة (Star Y)', 'Star (Y)', 'Étoile (Y)'))}</option>
                <option value="delta">{pick(L('مثلث (Delta Δ)', 'Delta (Δ)', 'Triangle (Δ)'))}</option>
              </select>
            </div>
          </div>
        );

      case 'power-factor':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="pf-kw" className={labelClass}>{pick(L('القدرة الفعالة P (kW)', 'Active Power P (kW)', 'Puissance active (kW)'))}</label>
              <input id="pf-kw" type="number" step="any" value={pfKw} onChange={(e) => setPfKw(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="pf-v" className={labelClass}>{pick(L('الجهد (V)', 'Voltage (V)', 'Tension (V)'))}</label>
              <input id="pf-v" type="number" step="any" value={pfV} onChange={(e) => setPfV(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="pf-hz" className={labelClass}>{pick(L('التردد (Hz)', 'Frequency (Hz)', 'Fréquence (Hz)'))}</label>
              <select id="pf-hz" value={pfHz} onChange={(e) => setPfHz(e.target.value)} className={`${selectClass} w-full`}>
                <option value="50">50 Hz</option>
                <option value="60">60 Hz</option>
              </select>
            </div>
            <div>
              <label htmlFor="pf-c1" className={labelClass}>{pick(L('معامل القدرة الحالي', 'Current cos(φ₁)', 'cos(φ₁) actuel'))}</label>
              <input id="pf-c1" type="number" step="0.01" value={pfCur} onChange={(e) => setPfCur(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="pf-c2" className={labelClass}>{pick(L('الهدف المطلوب', 'Target cos(φ₂)', 'cos(φ₂) cible'))}</label>
              <input id="pf-c2" type="number" step="0.01" value={pfTar} onChange={(e) => setPfTar(e.target.value)} className={inputClass} dir="ltr" />
            </div>
          </div>
        );

      case 'solar-panel':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="sol-wh" className={labelClass}>{pick(L('الاستهلاك اليومي (Wh)', 'Daily Energy (Wh/day)', 'Besoin / jour (Wh)'))}</label>
              <input id="sol-wh" type="number" step="any" value={solWh} onChange={(e) => setSolWh(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="sol-psh" className={labelClass}>{pick(L('ساعات الذروة الشمسية PSH', 'Peak Sun Hours (h)', 'Heures PSH (h/j)'))}</label>
              <input id="sol-psh" type="number" step="0.1" value={solPsh} onChange={(e) => setSolPsh(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="sol-eff" className={labelClass}>{pick(L('كفاءة النظام الكلية (%)', 'System Efficiency (%)', 'Rendement système (%)'))}</label>
              <input id="sol-eff" type="number" step="1" value={solEff} onChange={(e) => setSolEff(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="sol-wp" className={labelClass}>{pick(L('قدرة اللوح الواحد (Wp)', 'Panel Rating (Wp)', 'Puissance module (Wc)'))}</label>
              <input id="sol-wp" type="number" step="10" value={solPanelWp} onChange={(e) => setSolPanelWp(e.target.value)} className={inputClass} dir="ltr" />
            </div>
          </div>
        );

      case 'battery-capacity':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="bat-wh" className={labelClass}>{pick(L('الحمل اليومي (Wh)', 'Daily Load (Wh)', 'Charge / jour (Wh)'))}</label>
              <input id="bat-wh" type="number" step="any" value={batWh} onChange={(e) => setBatWh(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="bat-days" className={labelClass}>{pick(L('أيام الاستقلالية', 'Autonomy Days', 'Jours d’autonomie'))}</label>
              <input id="bat-days" type="number" step="1" value={batDays} onChange={(e) => setBatDays(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="bat-v" className={labelClass}>{pick(L('جهد البنك (V)', 'Bank Voltage (V)', 'Tension parc (V)'))}</label>
              <select id="bat-v" value={batVolt} onChange={(e) => setBatVolt(e.target.value)} className={`${selectClass} w-full`} dir="ltr">
                <option value="12">12 V</option>
                <option value="24">24 V</option>
                <option value="48">48 V</option>
              </select>
            </div>
            <div>
              <label htmlFor="bat-dod" className={labelClass}>{pick(L('عمق التفريغ DoD (%)', 'DoD Limit (%)', 'Profondeur DoD (%)'))}</label>
              <input id="bat-dod" type="number" step="5" value={batDod} onChange={(e) => setBatDod(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="bat-inv" className={labelClass}>{pick(L('كفاءة العاكس (%)', 'Inverter Eff. (%)', 'Rendement ond. (%)'))}</label>
              <input id="bat-inv" type="number" step="1" value={batInvEff} onChange={(e) => setBatInvEff(e.target.value)} className={inputClass} dir="ltr" />
            </div>
          </div>
        );

      case 'unit-converter': {
        const units = CONVERTER_UNITS[convQty];
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="uc-q" className={labelClass}>{pick(L('الكمية الفيزيائية', 'Quantity', 'Grandeur'))}</label>
              <select
                id="uc-q"
                value={convQty}
                onChange={(e) => {
                  const nextQ = e.target.value as ConverterQuantity;
                  setConvQty(nextQ);
                  const list = CONVERTER_UNITS[nextQ];
                  setConvFrom(list[0].id);
                  setConvTo(list[1]?.id ?? list[0].id);
                }}
                className={`${selectClass} w-full`}
              >
                <option value="voltage">{pick(L('الجهد (Voltage)', 'Voltage', 'Tension'))}</option>
                <option value="current">{pick(L('التيار (Current)', 'Current', 'Courant'))}</option>
                <option value="resistance">{pick(L('المقاومة (Resistance)', 'Resistance', 'Résistance'))}</option>
                <option value="capacitance">{pick(L('السعة (Capacitance)', 'Capacitance', 'Capacité'))}</option>
                <option value="power">{pick(L('القدرة (Power / HP)', 'Power / HP', 'Puissance / HP'))}</option>
                <option value="energy">{pick(L('الطاقة (Energy)', 'Energy', 'Énergie'))}</option>
                <option value="frequency">{pick(L('التردد (Frequency)', 'Frequency', 'Fréquence'))}</option>
                <option value="wire">{pick(L('مقطع السلك (mm² ↔ AWG)', 'Wire Gauge (mm² ↔ AWG)', 'Section câble (mm² ↔ AWG)'))}</option>
              </select>
            </div>
            <div>
              <label htmlFor="uc-val" className={labelClass}>{pick(L('القيمة', 'Value', 'Valeur'))}</label>
              <input id="uc-val" type="number" step="any" value={convVal} onChange={(e) => setConvVal(e.target.value)} className={inputClass} dir="ltr" />
            </div>
            <div>
              <label htmlFor="uc-from" className={labelClass}>{pick(L('من وحدة', 'From Unit', 'De l’unité'))}</label>
              <select id="uc-from" value={convFrom} onChange={(e) => setConvFrom(e.target.value)} className={`${selectClass} w-full`} dir="ltr">
                {units.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="uc-to" className={labelClass}>{pick(L('إلى وحدة', 'To Unit', 'Vers l’unité'))}</label>
              <select id="uc-to" value={convTo} onChange={(e) => setConvTo(e.target.value)} className={`${selectClass} w-full`} dir="ltr">
                {units.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
              </select>
            </div>
          </div>
        );
      }
    }
  };

  const activeMeta = t.calculators.items[selectedId];

  const metricToneStyle = (tone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral') => {
    switch (tone) {
      case 'primary':
        return 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 text-[#2563EB] dark:text-[#00BFFF]';
      case 'success':
        return 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-[#22C55E]';
      case 'warning':
        return 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-[#F59E0B]';
      case 'danger':
        return 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-[#EF4444] dark:text-rose-400';
      default:
        return 'bg-[#F8FAFC] dark:bg-[#0F172A] border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white';
    }
  };

  return (
    <div className="space-y-6" data-testid="calculators-workspace">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className={eyebrowClass}>{t.calculators.eyebrow}</p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {t.calculators.title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 max-w-2xl">
            {t.calculators.subtitle}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 shrink-0">
          <Calculator className="w-4 h-4 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
          <span>
            {t.calculators.countLabel}{' '}
            <strong className="font-mono-tech text-[#2563EB] dark:text-[#00BFFF]">
              {CALCULATORS_LIST.length}
            </strong>
          </span>
        </div>
      </div>

      {/* Group Tabs + Search Bar */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute top-3 start-3" aria-hidden="true" />
            <input
              type="search"
              data-testid="calc-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.calculators.searchPlaceholder}
              className="w-full h-10 ps-9 pe-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Calculator categories">
            {(
              [
                { id: 'all', label: t.calculators.allGroups },
                { id: 'fundamentals', label: t.calculators.groups.fundamentals },
                { id: 'circuits', label: t.calculators.groups.circuits },
                { id: 'installations', label: t.calculators.groups.installations },
                { id: 'machines', label: t.calculators.groups.machines },
                { id: 'solar', label: t.calculators.groups.solar },
                { id: 'tools', label: t.calculators.groups.tools },
              ] as const
            ).map((grp) => (
              <button
                key={grp.id}
                type="button"
                onClick={() => setGroupFilter(grp.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  groupFilter === grp.id
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {grp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Two-Zone Layout: Selector Sidebar + Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of 18 Calculators */}
        <aside className="lg:col-span-4 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-3 space-y-1.5 max-h-[680px] overflow-y-auto">
          {filteredCalcs.map((item) => {
            const meta = t.calculators.items[item.id];
            const active = selectedId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                data-testid={`calc-nav-${item.id}`}
                onClick={() => setSelectedId(item.id)}
                className={`w-full text-start p-3 rounded-xl border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#2563EB] border-[#2563EB] text-white'
                    : 'bg-[#F8FAFC] dark:bg-[#0F172A] border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 hover:border-[#2563EB]'
                }`}
              >
                <p className="font-display text-sm font-bold leading-snug">{meta.name}</p>
                <p className={`text-xs mt-0.5 line-clamp-1 ${active ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {meta.shortDesc}
                </p>
              </button>
            );
          })}
        </aside>

        {/* Main Workbench */}
        <div className="lg:col-span-8 space-y-5">
          {/* Active Calculator Header + Reset + Inputs */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white" data-testid="calc-active-title">
                  {activeMeta.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {activeMeta.shortDesc}
                </p>
              </div>
              <button
                type="button"
                data-testid="calc-reset-btn"
                onClick={handleResetActive}
                className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0F172A] hover:border-[#2563EB] text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.calculators.resetBtn}</span>
              </button>
            </div>

            {/* Formula Used */}
            <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 px-4 py-3">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {t.calculators.formulaTitle}
              </p>
              <p className="font-mono-tech text-xs sm:text-sm font-bold text-[#2563EB] dark:text-[#00BFFF] mt-1" dir="ltr">
                {output.formula}
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {t.calculators.inputsTitle}
              </p>
              {renderInputs()}
            </div>
          </div>

          {/* Validation Error OR Results + Steps + Diagram */}
          {!output.valid ? (
            <div
              data-testid="calc-validation-error"
              role="alert"
              className="rounded-2xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 p-5 flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-rose-800 dark:text-rose-200">
                  {t.calculators.validationTitle}
                </p>
                <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300 mt-1">
                  {output.error ? pick(output.error) : ''}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5" data-testid="calc-results-panel">
              {/* Result Metrics */}
              <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-[#22C55E]">
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  <span>{t.calculators.resultsTitle}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {output.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      data-testid={`calc-metric-${idx}`}
                      className={`rounded-xl border p-3.5 ${metricToneStyle(m.tone)}`}
                    >
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                        {pick(m.label)}
                      </p>
                      <p className="font-mono-tech text-lg sm:text-xl font-bold mt-1" dir="ltr">
                        {m.value}{' '}
                        {m.unit && <span className="text-xs font-semibold opacity-80">{m.unit}</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {output.engineeringDisclaimer && (
                <div
                  data-testid="calc-engineering-disclaimer"
                  className="rounded-xl border border-amber-300 dark:border-amber-800/70 bg-amber-50/90 dark:bg-amber-950/35 p-3.5 flex items-start gap-2.5"
                >
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-[#F59E0B] shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                    {pick(output.engineeringDisclaimer)}
                  </p>
                </div>
              )}

              {/* Calculation Steps + Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
                  <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                    {t.calculators.stepsTitle}
                  </h3>
                  <ol className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200 list-decimal list-inside">
                    {output.steps.map((st, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {pick(st)}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
                  <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                    {t.calculators.diagramTitle}
                  </h3>
                  <div className="blueprint-grid rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0F172A] p-3 flex items-center justify-center">
                    <CalculatorDiagram calculatorId={selectedId} output={output} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Simplified Explanation + Assumptions */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="space-y-1.5">
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white inline-flex items-center gap-2">
                <Info className="w-4 h-4 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
                <span>{t.calculators.explanationTitle}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {pick(output.explanation)}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <h4 className="font-display text-xs font-bold text-slate-700 dark:text-slate-200">
                {t.calculators.assumptionsTitle}
              </h4>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                {output.assumptions.map((a, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {pick(a)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
