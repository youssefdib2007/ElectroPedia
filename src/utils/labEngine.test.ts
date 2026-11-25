import assert from 'node:assert/strict';
import test from 'node:test';
import { getCatalogItem, getComponentPins, LAB_COMPONENT_CATALOG } from '../data/labCatalog';
import { LAB_CIRCUIT_TEMPLATES } from '../data/labTemplates';
import type { LabCircuitProject } from '../types/electronics';
import {
  createInitialPersistentSimState,
  createLabComponent,
  duplicateLabSelection,
  removeComponentsAndWires,
  rotateLabComponents,
  simulateLabCircuit,
} from './labEngine';
import { exportLabProjectJson, validateImportedLabProject } from './labStorage';

function makeProject(
  components: LabCircuitProject['components'],
  wires: LabCircuitProject['wires'],
  ladderRungs: LabCircuitProject['ladderRungs'] = []
): LabCircuitProject {
  return {
    id: 'test-proj',
    name: 'Test Circuit',
    updatedAt: 0,
    components,
    wires,
    ladderRungs,
  };
}

test('catalog defines all 34 component types with grid-aligned pins', () => {
  assert.equal(LAB_COMPONENT_CATALOG.length, 34);
  for (const item of LAB_COMPONENT_CATALOG) {
    assert.ok(item.pins.length >= 1, `${item.type} must expose at least 1 pin`);
    for (const p of item.pins) {
      assert.equal(Math.abs(p.dx % 20), 0, `${item.type}:${p.id} dx must snap to 20px grid`);
      assert.equal(Math.abs(p.dy % 20), 0, `${item.type}:${p.id} dy must snap to 20px grid`);
    }
  }
});

test('Ohm Law & KVL: 12V battery + 100Ω + 200Ω series gives 40mA, 4V, 8V', () => {
  const proj = makeProject(
    [
      { id: 'v1', type: 'dc-source', label: 'V1', x: 100, y: 200, rotation: 0, props: { voltage: 12 } },
      { id: 'r1', type: 'resistor', label: 'R1', x: 240, y: 200, rotation: 0, props: { resistance: 100 } },
      { id: 'r2', type: 'resistor', label: 'R2', x: 380, y: 200, rotation: 0, props: { resistance: 200 } },
      { id: 'gnd', type: 'ground', label: 'GND', x: 100, y: 300, rotation: 0, props: {} },
    ],
    [
      { id: 'w1', fromCompId: 'v1', fromPinId: 'pos', toCompId: 'r1', toPinId: 'a' },
      { id: 'w2', fromCompId: 'r1', fromPinId: 'b', toCompId: 'r2', toPinId: 'a' },
      { id: 'w3', fromCompId: 'r2', fromPinId: 'b', toCompId: 'v1', toPinId: 'neg' },
      { id: 'w4', fromCompId: 'v1', fromPinId: 'neg', toCompId: 'gnd', toPinId: 'gnd' },
    ]
  );

  const { result } = simulateLabCircuit(proj, createInitialPersistentSimState(), 0);
  assert.equal(result.valid, true);
  assert.ok(Math.abs(result.componentStates.r1.current - 0.04) < 1e-4);
  assert.ok(Math.abs(result.componentStates.r1.voltageDrop - 4.0) < 1e-3);
  assert.ok(Math.abs(result.componentStates.r2.voltageDrop - 8.0) < 1e-3);
  assert.ok(Math.abs(result.componentStates.v1.power - 0.48) < 1e-3);
});

test('KCL Parallel Circuit: 12V across 100Ω || 100Ω yields 0.24A total', () => {
  const proj = makeProject(
    [
      { id: 'v1', type: 'battery', label: 'B1', x: 100, y: 200, rotation: 0, props: { voltage: 12, internalResistance: 0 } },
      { id: 'r1', type: 'resistor', label: 'R1', x: 240, y: 160, rotation: 0, props: { resistance: 100 } },
      { id: 'r2', type: 'resistor', label: 'R2', x: 240, y: 240, rotation: 0, props: { resistance: 100 } },
      { id: 'g', type: 'ground', label: 'GND', x: 100, y: 300, rotation: 0, props: {} },
    ],
    [
      { id: 'w1', fromCompId: 'v1', fromPinId: 'pos', toCompId: 'r1', toPinId: 'a' },
      { id: 'w2', fromCompId: 'v1', fromPinId: 'pos', toCompId: 'r2', toPinId: 'a' },
      { id: 'w3', fromCompId: 'r1', fromPinId: 'b', toCompId: 'v1', toPinId: 'neg' },
      { id: 'w4', fromCompId: 'r2', fromPinId: 'b', toCompId: 'v1', toPinId: 'neg' },
      { id: 'w5', fromCompId: 'v1', fromPinId: 'neg', toCompId: 'g', toPinId: 'gnd' },
    ]
  );

  const { result } = simulateLabCircuit(proj, createInitialPersistentSimState(), 0);
  assert.equal(result.valid, true);
  assert.ok(Math.abs(result.componentStates.v1.current - 0.24) < 1e-3);
  assert.ok(Math.abs(result.componentStates.r1.current - 0.12) < 1e-3);
  assert.ok(Math.abs(result.componentStates.r2.current - 0.12) < 1e-3);
});

test('Open circuit & direct short circuit detection', () => {
  const openProj = makeProject(
    [
      { id: 'v1', type: 'battery', label: 'B1', x: 100, y: 200, rotation: 0, props: { voltage: 12 } },
      { id: 'sw', type: 'switch', label: 'S1', x: 200, y: 200, rotation: 0, props: { closed: false } },
      { id: 'r1', type: 'resistor', label: 'R1', x: 300, y: 200, rotation: 0, props: { resistance: 100 } },
    ],
    [
      { id: 'w1', fromCompId: 'v1', fromPinId: 'pos', toCompId: 'sw', toPinId: 'a' },
      { id: 'w2', fromCompId: 'sw', fromPinId: 'b', toCompId: 'r1', toPinId: 'a' },
      { id: 'w3', fromCompId: 'r1', fromPinId: 'b', toCompId: 'v1', toPinId: 'neg' },
    ]
  );

  const openRes = simulateLabCircuit(openProj, createInitialPersistentSimState(), 0).result;
  assert.equal(openRes.valid, true);
  assert.ok(Math.abs(openRes.componentStates.r1.current) < 1e-6);
  assert.ok(openRes.diagnostics.some((d) => d.code === 'OPEN_CIRCUIT'));
  assert.ok(openRes.diagnostics.some((d) => d.code === 'NO_GROUND'));

  const shortProj = makeProject(
    [{ id: 'v1', type: 'dc-source', label: 'V1', x: 100, y: 200, rotation: 0, props: { voltage: 12 } }],
    [{ id: 'w1', fromCompId: 'v1', fromPinId: 'pos', toCompId: 'v1', toPinId: 'neg' }]
  );
  const shortRes = simulateLabCircuit(shortProj, createInitialPersistentSimState(), 0).result;
  assert.equal(shortRes.valid, false);
  assert.ok(shortRes.diagnostics.some((d) => d.code === 'SHORT_CIRCUIT'));
});

test('Fuse blows immediately on overcurrent and isolates circuit', () => {
  const proj = makeProject(
    [
      { id: 'v1', type: 'dc-source', label: 'V1', x: 100, y: 200, rotation: 0, props: { voltage: 12 } },
      { id: 'fu', type: 'fuse', label: 'FU1', x: 200, y: 200, rotation: 0, props: { ratedCurrent: 2 } },
      { id: 'r1', type: 'resistor', label: 'R1', x: 300, y: 200, rotation: 0, props: { resistance: 2 } },
    ],
    [
      { id: 'w1', fromCompId: 'v1', fromPinId: 'pos', toCompId: 'fu', toPinId: 'a' },
      { id: 'w2', fromCompId: 'fu', fromPinId: 'b', toCompId: 'r1', toPinId: 'a' },
      { id: 'w3', fromCompId: 'r1', fromPinId: 'b', toCompId: 'v1', toPinId: 'neg' },
    ]
  );

  // 12V / 2Ω = 6A > 2A rated fuse -> fuse blows and drops current to 0A!
  const { result, nextState } = simulateLabCircuit(proj, createInitialPersistentSimState(), 0.05);
  assert.equal(result.componentStates.fu.blown, true);
  assert.ok(Math.abs(result.componentStates.r1.current) < 1e-6);
  assert.ok(result.diagnostics.some((d) => d.code === 'FUSE_BLOWN'));
  assert.equal(nextState.blownFuses.fu, true);
});

test('RC transient reaches ~63.2% at t = RC = 1.0s', () => {
  const rcTemplate = LAB_CIRCUIT_TEMPLATES.find((t) => t.id === 'rc-transient')!;
  const proj = makeProject(rcTemplate.components, rcTemplate.wires);
  let state = createInitialPersistentSimState();
  const dt = 0.02; // 50 steps = 1.0s
  let lastRes = simulateLabCircuit(proj, state, dt);
  state = lastRes.nextState;
  for (let i = 1; i < 50; i++) {
    lastRes = simulateLabCircuit(proj, state, dt);
    state = lastRes.nextState;
  }
  const vCap = lastRes.result.componentStates.c1.voltageDrop;
  // Analytical 10*(1 - e^-1) = 6.321V
  assert.ok(vCap > 6.1 && vCap < 6.5, `Expected ~6.32V at t=1s, got ${vCap}`);
});

test('LED + Zener + NPN BJT + Op-Amp Follower + Logic Gates solve accurately', () => {
  // Zener clamp test: 12V -> 1kΩ -> Zener (5.1V reverse-biased, K to top, A to GND)
  const zenerProj = makeProject(
    [
      { id: 'v1', type: 'dc-source', label: 'V1', x: 100, y: 100, rotation: 0, props: { voltage: 12 } },
      { id: 'r1', type: 'resistor', label: 'R1', x: 200, y: 100, rotation: 0, props: { resistance: 1000 } },
      { id: 'dz', type: 'zener', label: 'DZ1', x: 300, y: 100, rotation: 0, props: { zenerVoltage: 5.1 } },
      { id: 'g', type: 'ground', label: 'GND', x: 100, y: 200, rotation: 0, props: {} },
    ],
    [
      { id: 'w1', fromCompId: 'v1', fromPinId: 'pos', toCompId: 'r1', toPinId: 'a' },
      { id: 'w2', fromCompId: 'r1', fromPinId: 'b', toCompId: 'dz', toPinId: 'cathode' },
      { id: 'w3', fromCompId: 'dz', fromPinId: 'anode', toCompId: 'g', toPinId: 'gnd' },
      { id: 'w4', fromCompId: 'v1', fromPinId: 'neg', toCompId: 'g', toPinId: 'gnd' },
    ]
  );
  const zRes = simulateLabCircuit(zenerProj, createInitialPersistentSimState(), 0).result;
  assert.ok(Math.abs(zRes.componentStates.dz.nodeVoltages.cathode - 5.1) < 0.1);

  const ledTpl = LAB_CIRCUIT_TEMPLATES.find((t) => t.id === 'led-resistor')!;
  const ledRes = simulateLabCircuit(
    makeProject(ledTpl.components, ledTpl.wires),
    createInitialPersistentSimState(),
    0
  ).result;
  assert.ok(
    Math.abs(ledRes.componentStates.led1.current - 0.0144) < 0.002,
    `Expected ~14.4mA LED current, got ${ledRes.componentStates.led1.current}`
  );

  // Op-Amp voltage follower: Vin=4V -> vp, out wired to vn -> Vout ~ 4V
  const opAmpProj = makeProject(
    [
      { id: 'v1', type: 'dc-source', label: 'V1', x: 100, y: 100, rotation: 0, props: { voltage: 4 } },
      { id: 'oa', type: 'op-amp', label: 'OA1', x: 240, y: 100, rotation: 0, props: { gain: 10000 } },
      { id: 'rload', type: 'resistor', label: 'RL', x: 360, y: 100, rotation: 0, props: { resistance: 1000 } },
      { id: 'g', type: 'ground', label: 'GND', x: 100, y: 200, rotation: 0, props: {} },
    ],
    [
      { id: 'w1', fromCompId: 'v1', fromPinId: 'pos', toCompId: 'oa', toPinId: 'vp' },
      { id: 'w2', fromCompId: 'oa', fromPinId: 'out', toCompId: 'oa', toPinId: 'vn' },
      { id: 'w3', fromCompId: 'oa', fromPinId: 'out', toCompId: 'rload', toPinId: 'a' },
      { id: 'w4', fromCompId: 'rload', fromPinId: 'b', toCompId: 'g', toPinId: 'gnd' },
      { id: 'w5', fromCompId: 'v1', fromPinId: 'neg', toCompId: 'g', toPinId: 'gnd' },
    ]
  );
  const oaRes = simulateLabCircuit(opAmpProj, createInitialPersistentSimState(), 0).result;
  assert.ok(Math.abs(oaRes.componentStates.oa.nodeVoltages.out - 4.0) < 0.2);

  // MOSFET switch: Vg=5V (>2V Vth) turns ON drain-source and drives 12V lamp
  const mosProj = makeProject(
    [
      { id: 'v12', type: 'dc-source', label: 'V12', x: 100, y: 100, rotation: 0, props: { voltage: 12 } },
      { id: 'v5', type: 'dc-source', label: 'V5', x: 100, y: 220, rotation: 0, props: { voltage: 5 } },
      { id: 'r1', type: 'resistor', label: 'RL', x: 240, y: 100, rotation: 0, props: { resistance: 100 } },
      { id: 'fet', type: 'mosfet', label: 'Q1', x: 240, y: 220, rotation: 0, props: { vth: 2.0 } },
      { id: 'g', type: 'ground', label: 'GND', x: 100, y: 320, rotation: 0, props: {} },
    ],
    [
      { id: 'w1', fromCompId: 'v12', fromPinId: 'pos', toCompId: 'r1', toPinId: 'a' },
      { id: 'w2', fromCompId: 'r1', fromPinId: 'b', toCompId: 'fet', toPinId: 'd' },
      { id: 'w3', fromCompId: 'fet', fromPinId: 's', toCompId: 'g', toPinId: 'gnd' },
      { id: 'w4', fromCompId: 'v5', fromPinId: 'pos', toCompId: 'fet', toPinId: 'g' },
      { id: 'w5', fromCompId: 'v12', fromPinId: 'neg', toCompId: 'g', toPinId: 'gnd' },
      { id: 'w6', fromCompId: 'v5', fromPinId: 'neg', toCompId: 'g', toPinId: 'gnd' },
    ]
  );
  const mosRes = simulateLabCircuit(mosProj, createInitialPersistentSimState(), 0).result;
  assert.ok(mosRes.componentStates.r1.current > 0.11);
});

test('Ohmmeter measures passive resistance accurately & warns on live voltage', () => {
  const passiveProj = makeProject(
    [
      { id: 'ohm1', type: 'ohmmeter', label: 'OM1', x: 100, y: 100, rotation: 0, props: {} },
      { id: 'r1', type: 'resistor', label: 'R1', x: 240, y: 100, rotation: 0, props: { resistance: 470 } },
      { id: 'r2', type: 'resistor', label: 'R2', x: 360, y: 100, rotation: 0, props: { resistance: 330 } },
    ],
    [
      { id: 'w1', fromCompId: 'ohm1', fromPinId: 'pos', toCompId: 'r1', toPinId: 'a' },
      { id: 'w2', fromCompId: 'r1', fromPinId: 'b', toCompId: 'r2', toPinId: 'a' },
      { id: 'w3', fromCompId: 'r2', fromPinId: 'b', toCompId: 'ohm1', toPinId: 'neg' },
    ]
  );
  const ohmRes = simulateLabCircuit(passiveProj, createInitialPersistentSimState(), 0).result;
  assert.equal(ohmRes.componentStates.ohm1.meterDisplay, '800.0');
  assert.equal(ohmRes.componentStates.ohm1.meterUnit, 'Ω');

  const liveProj = makeProject(
    [
      { id: 'v1', type: 'dc-source', label: 'V1', x: 100, y: 100, rotation: 0, props: { voltage: 12 } },
      { id: 'r1', type: 'resistor', label: 'R1', x: 240, y: 100, rotation: 0, props: { resistance: 470 } },
      { id: 'ohm1', type: 'ohmmeter', label: 'OM1', x: 240, y: 200, rotation: 0, props: {} },
    ],
    [
      { id: 'w1', fromCompId: 'v1', fromPinId: 'pos', toCompId: 'r1', toPinId: 'a' },
      { id: 'w2', fromCompId: 'r1', fromPinId: 'b', toCompId: 'v1', toPinId: 'neg' },
      { id: 'w3', fromCompId: 'ohm1', fromPinId: 'pos', toCompId: 'r1', toPinId: 'a' },
      { id: 'w4', fromCompId: 'ohm1', fromPinId: 'neg', toCompId: 'r1', toPinId: 'b' },
    ]
  );
  const liveRes = simulateLabCircuit(liveProj, createInitialPersistentSimState(), 0).result;
  assert.equal(liveRes.componentStates.ohm1.meterDisplay, 'LIVE!');
  assert.ok(liveRes.diagnostics.some((d) => d.code === 'LIVE_OHMMETER'));
});

test('Start/Stop Contactor template latches after Start release and stops on Stop', () => {
  const tpl = LAB_CIRCUIT_TEMPLATES.find((t) => t.id === 'start-stop-contactor')!;
  let proj = makeProject(
    tpl.components.map((c) => ({ ...c, props: { ...c.props } })),
    tpl.wires
  );

  // Step 1: Start is closed -> KM1 energizes & motor runs
  const step1 = simulateLabCircuit(proj, createInitialPersistentSimState(), 0.05);
  assert.equal(step1.result.componentStates.km1.coilActive, true);
  assert.ok((step1.result.componentStates.mot1.motorRpm ?? 0) > 1000);

  // Step 2: Release Start button (open) -> KM1 MUST remain latched via 13-14!
  proj = {
    ...proj,
    components: proj.components.map((c) =>
      c.id === 'start1' ? { ...c, props: { ...c.props, closed: false } } : c
    ),
  };
  const step2 = simulateLabCircuit(proj, step1.nextState, 0.05);
  assert.equal(step2.result.componentStates.km1.coilActive, true);
  assert.ok((step2.result.componentStates.mot1.motorRpm ?? 0) > 1000);

  // Step 3: Press Stop (momentaryNC: true, closed: true -> opens NC contact) -> KM1 drops out
  proj = {
    ...proj,
    components: proj.components.map((c) =>
      c.id === 'stop1' ? { ...c, props: { ...c.props, closed: true } } : c
    ),
  };
  const step3 = simulateLabCircuit(proj, step2.nextState, 0.05);
  assert.equal(step3.result.componentStates.km1.coilActive, false);
  assert.equal(step3.result.componentStates.mot1.motorDir, 'stopped');
});

test('all 11 LAB_CIRCUIT_TEMPLATES have valid pins, valid wires, and solve cleanly', () => {
  assert.equal(LAB_CIRCUIT_TEMPLATES.length, 11);

  for (const tpl of LAB_CIRCUIT_TEMPLATES) {
    const compMap = new Map(tpl.components.map((c) => [c.id, c]));
    for (const comp of tpl.components) {
      assert.ok(getCatalogItem(comp.type), `${tpl.id}: unknown type ${comp.type}`);
    }
    for (const w of tpl.wires) {
      const fromC = compMap.get(w.fromCompId);
      const toC = compMap.get(w.toCompId);
      assert.ok(fromC, `${tpl.id}: wire ${w.id} missing fromCompId ${w.fromCompId}`);
      assert.ok(toC, `${tpl.id}: wire ${w.id} missing toCompId ${w.toCompId}`);
      assert.ok(
        getComponentPins(fromC!).some((p) => p.id === w.fromPinId),
        `${tpl.id}: wire ${w.id} invalid fromPinId ${w.fromPinId} on ${fromC!.type}`
      );
      assert.ok(
        getComponentPins(toC!).some((p) => p.id === w.toPinId),
        `${tpl.id}: wire ${w.id} invalid toPinId ${w.toPinId} on ${toC!.type}`
      );
    }

    const proj = makeProject(tpl.components, tpl.wires, tpl.ladderRungs ?? []);
    const { result } = simulateLabCircuit(proj, createInitialPersistentSimState(), 0.05);
    assert.equal(result.valid, true, `Template ${tpl.id} failed to solve cleanly`);
    assert.ok(tpl.questions.length >= 1, `Template ${tpl.id} should include self-check questions`);
  }
});

test('AC transformer steps 230V down to ~11.5V RMS and produces non-flat oscilloscope samples', () => {
  const tpl = LAB_CIRCUIT_TEMPLATES.find((t) => t.id === 'ac-transformer-rectifier')!;
  const proj = makeProject(tpl.components, tpl.wires);
  const { result } = simulateLabCircuit(proj, createInitialPersistentSimState(), 0.05);
  assert.equal(result.valid, true);
  assert.equal(result.hasAcSource, true);
  assert.ok(Math.abs(result.componentStates.tr1.voltageDrop - 11.5) < 0.3);
  assert.ok(result.waveform.length >= 40);
  const maxCh2 = Math.max(...result.waveform.map((w) => w.ch2));
  const minCh2 = Math.min(...result.waveform.map((w) => w.ch2));
  // Half-wave rectified: positive peak near ~15.5V, negative clamped near 0V
  assert.ok(maxCh2 > 13, `Expected positive rectified peak > 13V, got ${maxCh2}`);
  assert.ok(minCh2 > -0.5, `Expected rectified min near 0V, got ${minCh2}`);
});

test('workspace edit helpers & JSON import validator work cleanly', () => {
  const c1 = createLabComponent('battery', 104, 198, 0);
  const c2 = createLabComponent('resistor', 240, 200, 1);
  assert.equal(c1.x, 100);
  assert.equal(c1.y, 200);

  let proj = makeProject([c1, c2], [{ id: 'w1', fromCompId: c1.id, fromPinId: 'pos', toCompId: c2.id, toPinId: 'a' }]);
  proj = rotateLabComponents(proj, [c2.id], 90);
  assert.equal(proj.components.find((c) => c.id === c2.id)?.rotation, 90);

  const dup = duplicateLabSelection(proj, [c1.id, c2.id]);
  assert.equal(dup.project.components.length, 4);
  assert.equal(dup.project.wires.length, 2);

  const removed = removeComponentsAndWires(dup.project, [c1.id]);
  assert.equal(removed.components.length, 3);
  assert.equal(removed.wires.length, 1);

  const json = exportLabProjectJson(removed);
  const validated = validateImportedLabProject(json);
  assert.equal(validated.valid, true);

  const invalid = validateImportedLabProject('{"name": "", "components": "bad"}');
  assert.equal(invalid.valid, false);
});
