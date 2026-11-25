import assert from 'node:assert/strict';
import test from 'node:test';
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
} from './calculatorsEngine';

test('all 18 requested electrical calculators are registered', () => {
  assert.equal(CALCULATORS_LIST.length, 18);
});

test('1-4 Fundamentals: Ohms Law, Electrical Power, Energy Consumption, Electricity Cost', () => {
  // 1. Ohm's Law: I = 2 A, R = 12 Ohm -> V = 24 V, P = 48 W
  const ohm = calculateOhmsLaw({
    mode: 'find-v',
    voltage: 0,
    voltageUnit: 'V',
    current: 2,
    currentUnit: 'A',
    resistance: 12,
    resistanceUnit: 'ohm',
  });
  assert.equal(ohm.valid, true);
  assert.equal(ohm.metrics[0].value, '24');
  assert.equal(ohm.metrics[3].value, '48');

  // Invalid zero resistance check
  const ohmBad = calculateOhmsLaw({
    mode: 'find-i',
    voltage: 12,
    voltageUnit: 'V',
    current: 0,
    currentUnit: 'A',
    resistance: 0,
    resistanceUnit: 'ohm',
  });
  assert.equal(ohmBad.valid, false);

  // 2. Electrical Power AC Single Phase: 230V, 10A, PF 0.8 -> S = 2300 VA, P = 1840 W, Q = 1380 VAR
  const pwr = calculateElectricalPower({
    mode: 'ac-single',
    voltage: 230,
    current: 10,
    resistance: 10,
    powerFactor: 0.8,
  });
  assert.equal(pwr.valid, true);
  assert.equal(pwr.metrics[0].value, '1840');
  assert.equal(pwr.metrics[1].value, '2300');
  assert.equal(pwr.metrics[2].value, '1380');

  // 3. Energy Consumption: 2 x 1500W heaters, 4h/day, 30 days -> 12 kWh/day, 360 kWh
  const energy = calculateEnergyConsumption({
    power: 1500,
    powerUnit: 'W',
    quantity: 2,
    hoursPerDay: 4,
    days: 30,
  });
  assert.equal(energy.valid, true);
  assert.equal(energy.metrics[0].value, '12');
  assert.equal(energy.metrics[2].value, '360');

  // 4. Electricity Cost: 2 kW, 5h/day, 30 days, $0.20/kWh -> $60/month
  const cost = calculateElectricityCost({
    power: 2,
    powerUnit: 'kW',
    hoursPerDay: 5,
    daysPerMonth: 30,
    ratePerKwh: 0.2,
    currency: 'USD',
  });
  assert.equal(cost.valid, true);
  assert.equal(cost.metrics[1].value, '60');
});

test('5-9 Circuits: Resistor Color Code, Series, Parallel, Capacitor, Voltage Divider', () => {
  // 5. 4-band Red-Violet-Orange-Gold = 27 kOhm ±5%
  const rCode = calculateResistorColorCode({
    bands: 4,
    band1: 'red',
    band2: 'violet',
    band3: 'black',
    multiplier: 'orange',
    tolerance: 'gold',
  });
  assert.equal(rCode.valid, true);
  assert.equal(rCode.metrics[0].value, '27');
  assert.equal(rCode.metrics[0].unit, 'kΩ');

  // 6. Series Resistance: 100 + 220 + 680 = 1000 Ohm = 1 kOhm, Vs=10V -> 10 mA
  const ser = calculateSeriesResistance({
    resistors: [
      { value: 100, unit: 'ohm' },
      { value: 220, unit: 'ohm' },
      { value: 680, unit: 'ohm' },
    ],
    sourceVoltage: 10,
  });
  assert.equal(ser.valid, true);
  assert.equal(ser.metrics[0].value, '1');
  assert.equal(ser.metrics[0].unit, 'kΩ');
  assert.equal(ser.metrics[1].value, '10');
  assert.equal(ser.metrics[1].unit, 'mA');

  // 7. Parallel Resistance: 100 || 100 = 50 Ohm
  const par = calculateParallelResistance({
    resistors: [
      { value: 100, unit: 'ohm' },
      { value: 100, unit: 'ohm' },
    ],
    sourceVoltage: 10,
  });
  assert.equal(par.valid, true);
  assert.equal(par.metrics[0].value, '50');
  assert.equal(par.metrics[0].unit, 'Ω');

  // 8. Capacitor RC Time Constant: R = 1000 Ohm, C = 100 uF -> tau = 0.1 s = 100 ms, 5tau = 500 ms
  const cap = calculateCapacitor({
    mode: 'rc-time',
    capacitors: [
      { value: 10, unit: 'uF' },
      { value: 10, unit: 'uF' },
    ],
    capacitance: 100,
    capacitanceUnit: 'uF',
    frequencyHz: 50,
    resistanceOhms: 1000,
    voltage: 12,
  });
  assert.equal(cap.valid, true);
  assert.equal(cap.metrics[0].value, '100');
  assert.equal(cap.metrics[0].unit, 'ms');
  assert.equal(cap.metrics[1].value, '500');

  // 9. Voltage Divider: Vin=12V, R1=1k, R2=2k -> Vout = 8V
  const vdiv = calculateVoltageDivider({
    vin: 12,
    r1: 1,
    r1Unit: 'kohm',
    r2: 2,
    r2Unit: 'kohm',
  });
  assert.equal(vdiv.valid, true);
  assert.equal(vdiv.metrics[0].value, '8');
});

test('10-15 Installations & Machines: Voltage Drop, Cable Size, Transformer, Motor, 3-Phase, Power Factor', () => {
  // 10. Voltage Drop: 1-ph Copper 230V, 20A, 30m, 2.5mm2, PF 1 -> 2 * 0.021 * (30/2.5) * 20 = 10.08 V (4.38%)
  const vdrop = calculateVoltageDrop({
    phase: 'single',
    material: 'copper',
    voltage: 230,
    current: 20,
    lengthMeters: 30,
    crossSectionMm2: 2.5,
    powerFactor: 1,
  });
  assert.equal(vdrop.valid, true);
  assert.equal(vdrop.metrics[0].value, '10.08');
  assert.ok(vdrop.engineeringDisclaimer);

  // 11. Cable Size: includes explicit engineering disclaimer & valid IEC size
  const cable = calculateCableSize({
    phase: 'single',
    material: 'copper',
    installation: 'conduit',
    inputMode: 'current',
    powerKw: 3.5,
    current: 16,
    voltage: 230,
    powerFactor: 0.9,
    lengthMeters: 25,
    maxDropPct: 3,
  });
  assert.equal(cable.valid, true);
  assert.ok(Number(cable.metrics[0].value) >= 2.5);
  assert.ok(cable.engineeringDisclaimer);

  // 12. Transformer: 230V -> 23V, 2.3 kVA, Np=1000 -> Ratio 10:1, Ns=100, Ip=10A
  const tx = calculateTransformer({
    primaryVoltage: 230,
    secondaryVoltage: 23,
    powerKva: 2.3,
    primaryTurns: 1000,
    efficiencyPct: 100,
  });
  assert.equal(tx.valid, true);
  assert.equal(tx.metrics[0].value, '10:1');
  assert.equal(tx.metrics[1].value, '100');
  assert.equal(tx.metrics[2].value, '10');
  assert.equal(tx.metrics[3].value, '100');

  // 13. Motor Power: 3-phase 400V, 10A, PF 0.85, Eff 90% -> Pin=5.889 kW, Pmech=5.3 kW
  const motor = calculateMotorPower({
    phase: 'three',
    solveMode: 'from-electrical',
    voltage: 400,
    current: 10,
    mechPowerKw: 5.5,
    powerFactor: 0.85,
    efficiencyPct: 90,
    rpm: 1450,
  });
  assert.equal(motor.valid, true);
  assert.ok(Math.abs(Number(motor.metrics[0].value) - 5.3) < 0.05);

  // 14. Three Phase Power: 400V, 10A, PF 0.8, Star -> P ≈ 5.543 kW, Vph ≈ 230.9 V
  const tp = calculateThreePhasePower({
    lineVoltage: 400,
    lineCurrent: 10,
    powerFactor: 0.8,
    connection: 'star',
  });
  assert.equal(tp.valid, true);
  assert.ok(Math.abs(Number(tp.metrics[0].value) - 5.543) < 0.01);
  assert.ok(Math.abs(Number(tp.metrics[3].value) - 230.9) < 0.2);

  // 15. Power Factor: 100 kW from 0.7 to 0.95 -> Qc = 100 * (tan(acos(0.7)) - tan(acos(0.95))) ≈ 69.15 kVAR
  const pf = calculatePowerFactor({
    activePowerKw: 100,
    voltage: 400,
    frequencyHz: 50,
    currentPf: 0.7,
    targetPf: 0.95,
  });
  assert.equal(pf.valid, true);
  assert.ok(Math.abs(Number(pf.metrics[0].value) - 69.15) < 0.2);
});

test('16-18 Solar, Battery Capacity, and Unit Converter', () => {
  // 16. Solar Panel: 4000 Wh/day, 5 PSH, 80% eff -> P_PV = 1000 Wp -> 400 Wp panel -> 3 panels
  const solar = calculateSolarPanel({
    dailyEnergyWh: 4000,
    peakSunHours: 5,
    systemEfficiencyPct: 80,
    panelWattPeak: 400,
  });
  assert.equal(solar.valid, true);
  assert.equal(solar.metrics[0].value, '3');
  assert.equal(solar.metrics[1].value, '1000');

  // 17. Battery Capacity: 2400 Wh/day, 2 days, 24V, DoD 80%, Inv 100% -> 4800 / (24*0.8) = 250 Ah
  const bat = calculateBatteryCapacity({
    dailyEnergyWh: 2400,
    autonomyDays: 2,
    systemVoltage: 24,
    dodPct: 80,
    inverterEfficiencyPct: 100,
  });
  assert.equal(bat.valid, true);
  assert.equal(bat.metrics[0].value, '250');

  // 18. Unit Converter: 1.5 kW -> 1500 W; Wire 14 AWG ≈ 2.08 mm²
  const convPower = calculateUnitConversion({
    quantity: 'power',
    value: 1.5,
    fromUnit: 'kW',
    toUnit: 'W',
  });
  assert.equal(convPower.valid, true);
  assert.equal(convPower.metrics[0].value, '1500');

  const convWire = calculateUnitConversion({
    quantity: 'wire',
    value: 14,
    fromUnit: 'AWG',
    toUnit: 'mm2',
  });
  assert.equal(convWire.valid, true);
  assert.ok(Math.abs(Number(convWire.metrics[0].value) - 2.08) < 0.05);
});
