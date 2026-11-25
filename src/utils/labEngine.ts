import {
  getCatalogItem,
  getComponentPins,
  snapToGrid,
} from '../data/labCatalog';
import type {
  LabCircuitProject,
  LabComponentInstance,
  LabComponentSimState,
  LabComponentType,
  LabDiagnosticMessage,
  LabLadderRung,
  LabSimulationResult,
  LabWaveformSample,
  LabWire,
} from '../types/electronics';

export interface LabPersistentSimState {
  simTime: number;
  capVoltages: Record<string, number>;
  indCurrents: Record<string, number>;
  blownFuses: Record<string, boolean>;
  trippedBreakers: Record<string, boolean>;
  thermalEnergy: Record<string, number>;
  thermalTripped: Record<string, boolean>;
  timerElapsed: Record<string, number>;
  relayStates: Record<string, boolean>;
  plcMemory: Record<string, boolean>;
  plcTimers: Record<string, number>;
  waveformHistory: LabWaveformSample[];
}

export function createInitialPersistentSimState(): LabPersistentSimState {
  return {
    simTime: 0,
    capVoltages: {},
    indCurrents: {},
    blownFuses: {},
    trippedBreakers: {},
    thermalEnergy: {},
    thermalTripped: {},
    timerElapsed: {},
    relayStates: {},
    plcMemory: {},
    plcTimers: {},
    waveformHistory: [],
  };
}

// ──────────────────────────────────────────────────────────────
// Workspace Editing & Undo/Redo Helpers
// ──────────────────────────────────────────────────────────────

let uidCounter = 1;
export function nextLabId(prefix: string): string {
  uidCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${uidCounter}`;
}

export function createLabComponent(
  type: LabComponentType,
  x: number,
  y: number,
  existingCount = 0
): LabComponentInstance {
  const spec = getCatalogItem(type);
  return {
    id: nextLabId('cmp'),
    type,
    label: `${spec.code}${existingCount + 1}`,
    x: snapToGrid(x),
    y: snapToGrid(y),
    rotation: 0,
    props: { ...spec.defaultProps },
  };
}

export function removeComponentsAndWires(
  project: LabCircuitProject,
  compIds: string[],
  wireIds: string[] = []
): LabCircuitProject {
  const compSet = new Set(compIds);
  const wireSet = new Set(wireIds);
  return {
    ...project,
    updatedAt: Date.now(),
    components: project.components.filter((c) => !compSet.has(c.id)),
    wires: project.wires.filter(
      (w) =>
        !wireSet.has(w.id) &&
        !compSet.has(w.fromCompId) &&
        !compSet.has(w.toCompId)
    ),
  };
}

export function duplicateLabSelection(
  project: LabCircuitProject,
  selectedCompIds: string[],
  offsetX = 40,
  offsetY = 40
): { project: LabCircuitProject; newCompIds: string[] } {
  const selectedSet = new Set(selectedCompIds);
  const idMap = new Map<string, string>();
  const clonedComponents: LabComponentInstance[] = [];

  for (const comp of project.components) {
    if (!selectedSet.has(comp.id)) continue;
    const newId = nextLabId('cmp');
    idMap.set(comp.id, newId);
    clonedComponents.push({
      ...comp,
      id: newId,
      label: `${comp.label}_copy`,
      x: snapToGrid(comp.x + offsetX),
      y: snapToGrid(comp.y + offsetY),
      props: { ...comp.props },
    });
  }

  const clonedWires: LabWire[] = [];
  for (const wire of project.wires) {
    const newFrom = idMap.get(wire.fromCompId);
    const newTo = idMap.get(wire.toCompId);
    if (newFrom && newTo) {
      clonedWires.push({
        ...wire,
        id: nextLabId('wire'),
        fromCompId: newFrom,
        toCompId: newTo,
      });
    }
  }

  return {
    project: {
      ...project,
      updatedAt: Date.now(),
      components: [...project.components, ...clonedComponents],
      wires: [...project.wires, ...clonedWires],
    },
    newCompIds: Array.from(idMap.values()),
  };
}

export function rotateLabComponents(
  project: LabCircuitProject,
  compIds: string[],
  deltaDeg: 90 | -90 = 90
): LabCircuitProject {
  const idSet = new Set(compIds);
  return {
    ...project,
    updatedAt: Date.now(),
    components: project.components.map((c) => {
      if (!idSet.has(c.id)) return c;
      const nextRot = (((c.rotation + deltaDeg) % 360) + 360) % 360;
      return {
        ...c,
        rotation: nextRot as 0 | 90 | 180 | 270,
      };
    }),
  };
}

// ──────────────────────────────────────────────────────────────
// Linear Solver (Gaussian Elimination with Partial Pivoting)
// ──────────────────────────────────────────────────────────────

function solveLinearSystem(A: number[][], b: number[]): number[] | null {
  const n = b.length;
  if (n === 0) return [];
  const M = A.map((row, idx) => [...row, b[idx]]);

  for (let col = 0; col < n; col++) {
    let pivotRow = col;
    let maxVal = Math.abs(M[col][col]);
    for (let r = col + 1; r < n; r++) {
      const val = Math.abs(M[r][col]);
      if (val > maxVal) {
        maxVal = val;
        pivotRow = r;
      }
    }

    if (maxVal < 1e-12 || !Number.isFinite(maxVal)) {
      return null;
    }

    if (pivotRow !== col) {
      const tmp = M[col];
      M[col] = M[pivotRow];
      M[pivotRow] = tmp;
    }

    const pivot = M[col][col];
    for (let r = col + 1; r < n; r++) {
      const factor = M[r][col] / pivot;
      if (factor === 0) continue;
      for (let c = col; c <= n; c++) {
        M[r][c] -= factor * M[col][c];
      }
    }
  }

  const x = new Array<number>(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    let sum = M[r][n];
    for (let c = r + 1; c < n; c++) {
      sum -= M[r][c] * x[c];
    }
    const val = sum / M[r][r];
    if (!Number.isFinite(val)) return null;
    x[r] = val;
  }

  return x;
}

// ──────────────────────────────────────────────────────────────
// Union-Find Node Extraction
// ──────────────────────────────────────────────────────────────

class DisjointSet {
  private parent = new Map<string, string>();

  add(key: string): void {
    if (!this.parent.has(key)) this.parent.set(key, key);
  }

  find(key: string): string {
    this.add(key);
    let root = key;
    while (this.parent.get(root) !== root) {
      root = this.parent.get(root)!;
    }
    let curr = key;
    while (curr !== root) {
      const nxt = this.parent.get(curr)!;
      this.parent.set(curr, root);
      curr = nxt;
    }
    return root;
  }

  union(a: string, b: string): void {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra !== rb) this.parent.set(rb, ra);
  }
}

function pinKey(compId: string, pinId: string): string {
  return `${compId}:${pinId}`;
}

export function getLedForwardVoltage(comp: LabComponentInstance): number {
  if (typeof comp.props.forwardVoltage === 'number' && comp.props.forwardVoltage > 0) {
    return comp.props.forwardVoltage;
  }
  switch (comp.props.ledColor) {
    case 'blue':
    case 'white':
      return 3.0;
    case 'green':
      return 2.2;
    case 'yellow':
      return 2.0;
    case 'red':
    default:
      return 1.8;
  }
}

export function formatEngineeringValue(val: number, unit: string): string {
  if (!Number.isFinite(val)) return `0 ${unit}`;
  const abs = Math.abs(val);
  if (abs === 0) return `0.00 ${unit}`;
  if (abs >= 1e6) return `${(val / 1e6).toFixed(2)} M${unit}`;
  if (abs >= 1e3) return `${(val / 1e3).toFixed(2)} k${unit}`;
  if (abs >= 1) return `${val.toFixed(2)} ${unit}`;
  if (abs >= 1e-3) return `${(val * 1e3).toFixed(1)} m${unit}`;
  return `${(val * 1e6).toFixed(1)} µ${unit}`;
}

// ──────────────────────────────────────────────────────────────
// PLC Ladder Scan Evaluation
// ──────────────────────────────────────────────────────────────

function evaluateLadderContact(
  token: string | undefined,
  inputs: Record<string, boolean>,
  outputs: Record<string, boolean>
): boolean {
  if (!token) return true;
  const negated = token.startsWith('!');
  const symbol = negated ? token.slice(1) : token;
  let state = false;
  if (symbol === 'I1' || symbol === 'I2') {
    state = Boolean(inputs[symbol]);
  } else if (symbol === 'Q1' || symbol === 'Q2') {
    state = Boolean(outputs[symbol]);
  }
  return negated ? !state : state;
}

export function evaluatePlcLadder(
  rungs: LabLadderRung[],
  inputs: Record<string, boolean>,
  prevMemory: Record<string, boolean>,
  prevTimers: Record<string, number>,
  dt: number
): {
  outputs: Record<string, boolean>;
  nextMemory: Record<string, boolean>;
  nextTimers: Record<string, number>;
} {
  const outputs: Record<string, boolean> = {
    Q1: Boolean(prevMemory.Q1),
    Q2: Boolean(prevMemory.Q2),
  };
  const nextTimers: Record<string, number> = { ...prevTimers };

  for (const rung of rungs) {
    const c1 = evaluateLadderContact(rung.input1, inputs, outputs);
    const latch = rung.latchInput
      ? evaluateLadderContact(rung.latchInput, inputs, outputs)
      : false;
    const branch = c1 || latch;
    const c2 = evaluateLadderContact(rung.input2, inputs, outputs);
    const rungPower = branch && c2;

    if (rung.timerDelaySec && rung.timerDelaySec > 0) {
      if (rungPower) {
        const elapsed = (prevTimers[rung.id] ?? 0) + Math.max(dt, 0);
        nextTimers[rung.id] = elapsed;
        outputs[rung.coil] = elapsed >= rung.timerDelaySec;
      } else {
        nextTimers[rung.id] = 0;
        outputs[rung.coil] = false;
      }
    } else {
      outputs[rung.coil] = rungPower;
    }
  }

  return {
    outputs,
    nextMemory: { Q1: outputs.Q1, Q2: outputs.Q2 },
    nextTimers,
  };
}

// ──────────────────────────────────────────────────────────────
// Main Circuit Simulation Engine (MNA + Nonlinear + Transient)
// ──────────────────────────────────────────────────────────────

interface SolvePassOptions {
  project: LabCircuitProject;
  state: LabPersistentSimState;
  dt: number;
  instantaneousTime?: number;
  useInstantaneousAc?: boolean;
  forceDeenergizedOhmProbeId?: string;
}

interface InternalSolveOutput {
  valid: boolean;
  nodeVoltages: Record<string, number>;
  pinToNode: Record<string, string>;
  branchCurrents: Record<string, number>;
  coilActiveMap: Record<string, boolean>;
  relayClosedMap: Record<string, boolean>;
  plcInputs: Record<string, boolean>;
  plcOutputs: Record<string, boolean>;
  shortDetected: boolean;
  singularDetected: boolean;
  hasAcSource: boolean;
  hasGround: boolean;
  frequency: number;
}

function runMnaPass(opts: SolvePassOptions): InternalSolveOutput {
  const { project, state, dt, instantaneousTime, useInstantaneousAc, forceDeenergizedOhmProbeId } =
    opts;
  const dsu = new DisjointSet();
  const validPinKeys = new Set<string>();

  for (const comp of project.components) {
    for (const pin of getComponentPins(comp)) {
      const k = pinKey(comp.id, pin.id);
      validPinKeys.add(k);
      dsu.add(k);
    }
  }

  for (const wire of project.wires) {
    const a = pinKey(wire.fromCompId, wire.fromPinId);
    const b = pinKey(wire.toCompId, wire.toPinId);
    if (validPinKeys.has(a) && validPinKeys.has(b)) {
      dsu.union(a, b);
    }
  }

  // Merge all explicit ground components into node 0
  const groundComps = project.components.filter((c) => c.type === 'ground');
  const hasExplicitGround = groundComps.length > 0;
  for (let i = 1; i < groundComps.length; i++) {
    dsu.union(pinKey(groundComps[0].id, 'gnd'), pinKey(groundComps[i].id, 'gnd'));
  }

  let groundRoot: string | null = hasExplicitGround
    ? dsu.find(pinKey(groundComps[0].id, 'gnd'))
    : null;

  if (!groundRoot) {
    const firstSource = project.components.find(
      (c) =>
        c.type === 'battery' ||
        c.type === 'dc-source' ||
        c.type === 'ac-source' ||
        c.type === 'current-source'
    );
    if (firstSource) {
      groundRoot = dsu.find(pinKey(firstSource.id, 'neg'));
    } else if (project.components.length > 0) {
      const firstPins = getComponentPins(project.components[0]);
      if (firstPins.length > 0) {
        groundRoot = dsu.find(pinKey(project.components[0].id, firstPins[0].id));
      }
    }
  }

  const rootToNodeId = new Map<string, string>();
  const nonGroundNodes: string[] = [];
  const pinToNode: Record<string, string> = {};

  for (const pk of validPinKeys) {
    const r = dsu.find(pk);
    if (groundRoot && r === groundRoot) {
      rootToNodeId.set(r, '0');
      pinToNode[pk] = '0';
    } else {
      let nodeId = rootToNodeId.get(r);
      if (!nodeId) {
        nodeId = `N${nonGroundNodes.length + 1}`;
        rootToNodeId.set(r, nodeId);
        nonGroundNodes.push(nodeId);
      }
      pinToNode[pk] = nodeId;
    }
  }

  const nodeIndex = new Map<string, number>();
  nonGroundNodes.forEach((nId, idx) => nodeIndex.set(nId, idx));

  const acSources = project.components.filter((c) => c.type === 'ac-source');
  const hasAcSource = acSources.length > 0;
  const frequency = acSources[0]?.props.frequency ?? 50;

  // Track nonlinear/relay states across iterations
  const diodeOn = new Map<string, boolean>();
  const zenerMode = new Map<string, 'off' | 'fwd' | 'rev'>();
  const relayClosedMap: Record<string, boolean> = {};
  const coilActiveMap: Record<string, boolean> = {};
  const bjtBaseOn = new Map<string, boolean>();
  const bjtIc = new Map<string, number>();
  const bjtSat = new Map<string, boolean>();
  const mosfetOn = new Map<string, boolean>();
  const opAmpOut = new Map<string, number>();
  const gateOut = new Map<string, 0 | 1>();

  for (const comp of project.components) {
    if (comp.type === 'relay' || comp.type === 'contactor') {
      relayClosedMap[comp.id] = Boolean(state.relayStates[comp.id]);
    } else if (comp.type === 'timer') {
      const delay = comp.props.delaySeconds ?? 3;
      relayClosedMap[comp.id] = (state.timerElapsed[comp.id] ?? 0) >= delay;
    }
  }

  let plcInputs: Record<string, boolean> = { I1: false, I2: false };
  let plcOutputs: Record<string, boolean> = {
    Q1: Boolean(state.plcMemory.Q1),
    Q2: Boolean(state.plcMemory.Q2),
  };

  // Pre-check zero-ohm direct voltage source short (node(pos) === node(neg))
  if (!forceDeenergizedOhmProbeId) {
    for (const comp of project.components) {
      if (
        comp.type === 'dc-source' ||
        comp.type === 'ac-source' ||
        (comp.type === 'battery' && (comp.props.internalResistance ?? 0) <= 0)
      ) {
        const nPos = pinToNode[pinKey(comp.id, 'pos')];
        const nNeg = pinToNode[pinKey(comp.id, 'neg')];
        const vMag = comp.props.voltage ?? (comp.type === 'ac-source' ? 230 : 12);
        if (nPos && nPos === nNeg && Math.abs(vMag) > 0) {
          return {
            valid: false,
            nodeVoltages: { '0': 0 },
            pinToNode,
            branchCurrents: {},
            coilActiveMap,
            relayClosedMap,
            plcInputs,
            plcOutputs,
            shortDetected: true,
            singularDetected: false,
            hasAcSource,
            hasGround: hasExplicitGround,
            frequency,
          };
        }
      }
    }
  }

  let finalNodeVoltages: Record<string, number> = { '0': 0 };
  let finalBranchCurrents: Record<string, number> = {};
  let singularDetected = false;

  const numNodes = nonGroundNodes.length;
  const maxIter = 16;

  for (let iter = 0; iter < maxIter; iter++) {
    // Count extra auxiliary variables (voltage sources + transformers + ammeters/wattmeter)
    interface AuxSource {
      key: string;
      compId: string;
      kind: 'vsource' | 'transformer' | 'current-sense';
      nPos: string;
      nNeg: string;
      nSecPos?: string;
      nSecNeg?: string;
      ratio?: number;
      voltage?: number;
    }
    const auxSources: AuxSource[] = [];

    for (const comp of project.components) {
      if (forceDeenergizedOhmProbeId) {
        // In ohmmeter test mode, voltage sources become short/0V (disabled) and current sources open
        if (
          comp.type === 'battery' ||
          comp.type === 'dc-source' ||
          comp.type === 'ac-source'
        ) {
          const rInt = comp.type === 'battery' ? (comp.props.internalResistance ?? 0) : 0;
          if (rInt <= 0) {
            auxSources.push({
              key: comp.id,
              compId: comp.id,
              kind: 'vsource',
              nPos: pinToNode[pinKey(comp.id, 'pos')],
              nNeg: pinToNode[pinKey(comp.id, 'neg')],
              voltage: 0,
            });
          }
        }
        continue;
      }

      if (comp.type === 'dc-source') {
        auxSources.push({
          key: comp.id,
          compId: comp.id,
          kind: 'vsource',
          nPos: pinToNode[pinKey(comp.id, 'pos')],
          nNeg: pinToNode[pinKey(comp.id, 'neg')],
          voltage: comp.props.voltage ?? 12,
        });
      } else if (comp.type === 'battery') {
        const rInt = comp.props.internalResistance ?? 0;
        if (rInt <= 0) {
          auxSources.push({
            key: comp.id,
            compId: comp.id,
            kind: 'vsource',
            nPos: pinToNode[pinKey(comp.id, 'pos')],
            nNeg: pinToNode[pinKey(comp.id, 'neg')],
            voltage: comp.props.voltage ?? 12,
          });
        }
      } else if (comp.type === 'ac-source') {
        const vRms = comp.props.voltage ?? 230;
        const f = comp.props.frequency ?? 50;
        const val = useInstantaneousAc
          ? vRms * Math.SQRT2 * Math.sin(2 * Math.PI * f * (instantaneousTime ?? 0))
          : vRms;
        auxSources.push({
          key: comp.id,
          compId: comp.id,
          kind: 'vsource',
          nPos: pinToNode[pinKey(comp.id, 'pos')],
          nNeg: pinToNode[pinKey(comp.id, 'neg')],
          voltage: val,
        });
      } else if (comp.type === 'transformer') {
        const nP1 = pinToNode[pinKey(comp.id, 'p1')];
        const nP2 = pinToNode[pinKey(comp.id, 'p2')];
        const nS1 = pinToNode[pinKey(comp.id, 's1')];
        const nS2 = pinToNode[pinKey(comp.id, 's2')];
        if (hasAcSource && nP1 !== nP2 && nS1 !== nS2) {
          auxSources.push({
            key: comp.id,
            compId: comp.id,
            kind: 'transformer',
            nPos: nP1,
            nNeg: nP2,
            nSecPos: nS1,
            nSecNeg: nS2,
            ratio: comp.props.turnsRatio ?? 0.1,
          });
        }
      }
    }

    const dim = numNodes + auxSources.length;
    if (dim === 0) {
      return {
        valid: true,
        nodeVoltages: { '0': 0 },
        pinToNode,
        branchCurrents: {},
        coilActiveMap,
        relayClosedMap,
        plcInputs,
        plcOutputs,
        shortDetected: false,
        singularDetected: false,
        hasAcSource,
        hasGround: hasExplicitGround,
        frequency,
      };
    }

    const A = Array.from({ length: dim }, () => new Array<number>(dim).fill(0));
    const b = new Array<number>(dim).fill(0);

    const stampG = (nA: string, nB: string, g: number) => {
      if (nA === nB || g === 0) return;
      const ia = nodeIndex.get(nA);
      const ib = nodeIndex.get(nB);
      if (ia !== undefined) A[ia][ia] += g;
      if (ib !== undefined) A[ib][ib] += g;
      if (ia !== undefined && ib !== undefined) {
        A[ia][ib] -= g;
        A[ib][ia] -= g;
      }
    };

    const stampI = (fromNode: string, toNode: string, current: number) => {
      if (fromNode === toNode || current === 0) return;
      const iFrom = nodeIndex.get(fromNode);
      const iTo = nodeIndex.get(toNode);
      // Current leaves fromNode (rhs -= current) and enters toNode (rhs += current)
      if (iFrom !== undefined) b[iFrom] -= current;
      if (iTo !== undefined) b[iTo] += current;
    };

    // Tiny leakage conductance from every node to ground to prevent floating subgraphs from becoming singular
    for (let i = 0; i < numNodes; i++) {
      A[i][i] += 1e-11;
    }

    // Stamp auxiliary sources
    auxSources.forEach((src, idx) => {
      const k = numNodes + idx;
      if (src.kind === 'vsource') {
        const ip = nodeIndex.get(src.nPos);
        const ineg = nodeIndex.get(src.nNeg);
        if (ip !== undefined) {
          A[ip][k] += 1;
          A[k][ip] += 1;
        }
        if (ineg !== undefined) {
          A[ineg][k] -= 1;
          A[k][ineg] -= 1;
        }
        b[k] = src.voltage ?? 0;
      } else if (src.kind === 'transformer') {
        const ratio = src.ratio ?? 0.1;
        const ip1 = nodeIndex.get(src.nPos);
        const ip2 = nodeIndex.get(src.nNeg);
        const is1 = nodeIndex.get(src.nSecPos!);
        const is2 = nodeIndex.get(src.nSecNeg!);
        // -n*V(p1) + n*V(p2) + V(s1) - V(s2) = 0
        if (ip1 !== undefined) {
          A[ip1][k] -= ratio;
          A[k][ip1] -= ratio;
        }
        if (ip2 !== undefined) {
          A[ip2][k] += ratio;
          A[k][ip2] += ratio;
        }
        if (is1 !== undefined) {
          A[is1][k] += 1;
          A[k][is1] += 1;
        }
        if (is2 !== undefined) {
          A[is2][k] -= 1;
          A[k][is2] -= 1;
        }
        b[k] = 0;
      }
    });

    // Stamp all circuit elements
    for (const comp of project.components) {
      switch (comp.type) {
        case 'battery': {
          const rInt = comp.props.internalResistance ?? 0;
          if (rInt > 0) {
            const nPos = pinToNode[pinKey(comp.id, 'pos')];
            const nNeg = pinToNode[pinKey(comp.id, 'neg')];
            const g = 1 / rInt;
            const v = forceDeenergizedOhmProbeId ? 0 : comp.props.voltage ?? 12;
            stampG(nPos, nNeg, g);
            // Norton equivalent: current source v/rInt from neg to pos
            stampI(nNeg, nPos, v * g);
          }
          break;
        }
        case 'current-source': {
          if (!forceDeenergizedOhmProbeId) {
            const nPos = pinToNode[pinKey(comp.id, 'pos')];
            const nNeg = pinToNode[pinKey(comp.id, 'neg')];
            stampI(nNeg, nPos, comp.props.current ?? 0.05);
          }
          break;
        }
        case 'resistor': {
          const r = Math.max(0.01, comp.props.resistance ?? 1000);
          stampG(
            pinToNode[pinKey(comp.id, 'a')],
            pinToNode[pinKey(comp.id, 'b')],
            1 / r
          );
          break;
        }
        case 'potentiometer': {
          const totalR = Math.max(1, comp.props.resistance ?? 10000);
          const pct = Math.min(99, Math.max(1, comp.props.wiperPercent ?? 50)) / 100;
          const r1 = totalR * pct;
          const r2 = totalR * (1 - pct);
          const n1 = pinToNode[pinKey(comp.id, 't1')];
          const nw = pinToNode[pinKey(comp.id, 'wiper')];
          const n2 = pinToNode[pinKey(comp.id, 't2')];
          stampG(n1, nw, 1 / r1);
          stampG(nw, n2, 1 / r2);
          break;
        }
        case 'lamp': {
          const vRated = Math.max(0.1, comp.props.ratedVoltage ?? 12);
          const pRated = Math.max(0.01, comp.props.ratedPower ?? 6);
          const rLamp = (vRated * vRated) / pRated;
          stampG(
            pinToNode[pinKey(comp.id, 'a')],
            pinToNode[pinKey(comp.id, 'b')],
            1 / rLamp
          );
          break;
        }
        case 'motor': {
          const rMotor = Math.max(0.5, comp.props.resistance ?? 12);
          stampG(
            pinToNode[pinKey(comp.id, 'pos')],
            pinToNode[pinKey(comp.id, 'neg')],
            1 / rMotor
          );
          break;
        }
        case 'switch': {
          const isClosed = Boolean(comp.props.closed);
          stampG(
            pinToNode[pinKey(comp.id, 'a')],
            pinToNode[pinKey(comp.id, 'b')],
            isClosed ? 100 : 1e-10
          );
          break;
        }
        case 'push-button': {
          const isClosed = comp.props.momentaryNC
            ? !comp.props.closed
            : Boolean(comp.props.closed);
          stampG(
            pinToNode[pinKey(comp.id, 'a')],
            pinToNode[pinKey(comp.id, 'b')],
            isClosed ? 100 : 1e-10
          );
          break;
        }
        case 'fuse': {
          const blown = Boolean(state.blownFuses[comp.id]);
          stampG(
            pinToNode[pinKey(comp.id, 'a')],
            pinToNode[pinKey(comp.id, 'b')],
            blown ? 1e-10 : 100
          );
          break;
        }
        case 'circuit-breaker': {
          const closed = Boolean(comp.props.closed ?? true) && !state.trippedBreakers[comp.id];
          stampG(
            pinToNode[pinKey(comp.id, 'a')],
            pinToNode[pinKey(comp.id, 'b')],
            closed ? 100 : 1e-10
          );
          break;
        }
        case 'thermal-overload': {
          const tripped = Boolean(state.thermalTripped[comp.id]);
          stampG(
            pinToNode[pinKey(comp.id, 't1')],
            pinToNode[pinKey(comp.id, 't2')],
            100 // 0.01Ω current path
          );
          stampG(
            pinToNode[pinKey(comp.id, 'nc95')],
            pinToNode[pinKey(comp.id, 'nc96')],
            tripped ? 1e-10 : 100
          );
          break;
        }
        case 'relay': {
          const rCoil = Math.max(10, comp.props.coilResistance ?? 200);
          stampG(
            pinToNode[pinKey(comp.id, 'a1')],
            pinToNode[pinKey(comp.id, 'a2')],
            1 / rCoil
          );
          const contactClosed = Boolean(relayClosedMap[comp.id]);
          stampG(
            pinToNode[pinKey(comp.id, 'no1')],
            pinToNode[pinKey(comp.id, 'no2')],
            contactClosed ? 100 : 1e-10
          );
          break;
        }
        case 'contactor': {
          const rCoil = Math.max(10, comp.props.coilResistance ?? 240);
          stampG(
            pinToNode[pinKey(comp.id, 'a1')],
            pinToNode[pinKey(comp.id, 'a2')],
            1 / rCoil
          );
          const active = Boolean(relayClosedMap[comp.id]);
          // Main pole L1-T1
          stampG(
            pinToNode[pinKey(comp.id, 'l1')],
            pinToNode[pinKey(comp.id, 't1')],
            active ? 100 : 1e-10
          );
          // Aux NO 13-14
          stampG(
            pinToNode[pinKey(comp.id, 'no13')],
            pinToNode[pinKey(comp.id, 'no14')],
            active ? 100 : 1e-10
          );
          // Aux NC 21-22
          stampG(
            pinToNode[pinKey(comp.id, 'nc21')],
            pinToNode[pinKey(comp.id, 'nc22')],
            active ? 1e-10 : 100
          );
          break;
        }
        case 'timer': {
          const rCoil = Math.max(10, comp.props.coilResistance ?? 400);
          stampG(
            pinToNode[pinKey(comp.id, 'a1')],
            pinToNode[pinKey(comp.id, 'a2')],
            1 / rCoil
          );
          const contactClosed = Boolean(relayClosedMap[comp.id]);
          stampG(
            pinToNode[pinKey(comp.id, 't17')],
            pinToNode[pinKey(comp.id, 't18')],
            contactClosed ? 100 : 1e-10
          );
          break;
        }
        case 'transformer': {
          if (!hasAcSource) {
            // In DC steady state, primary winding has low coil resistance and secondary produces 0V
            stampG(
              pinToNode[pinKey(comp.id, 'p1')],
              pinToNode[pinKey(comp.id, 'p2')],
              0.2 // 5Ω winding resistance
            );
            stampG(
              pinToNode[pinKey(comp.id, 's1')],
              pinToNode[pinKey(comp.id, 's2')],
              0.2
            );
          }
          break;
        }
        case 'capacitor': {
          const cF = Math.max(1e-9, (comp.props.capacitanceUf ?? 1000) * 1e-6);
          const nPos = pinToNode[pinKey(comp.id, 'pos')];
          const nNeg = pinToNode[pinKey(comp.id, 'neg')];
          if (dt > 0) {
            // Backward Euler companion model: G = C/dt, I_eq = G * V_prev
            const gEq = cF / dt;
            const vPrev = state.capVoltages[comp.id] ?? 0;
            stampG(nPos, nNeg, gEq);
            stampI(nNeg, nPos, gEq * vPrev);
          } else if (hasAcSource && !useInstantaneousAc) {
            const gAc = 2 * Math.PI * frequency * cF;
            stampG(nPos, nNeg, Math.max(1e-9, gAc));
          } else {
            stampG(nPos, nNeg, 1e-10);
          }
          break;
        }
        case 'inductor': {
          const lH = Math.max(1e-6, (comp.props.inductanceMh ?? 100) * 1e-3);
          const nA = pinToNode[pinKey(comp.id, 'a')];
          const nB = pinToNode[pinKey(comp.id, 'b')];
          if (dt > 0) {
            const gL = dt / lH;
            const iPrev = state.indCurrents[comp.id] ?? 0;
            stampG(nA, nB, gL);
            stampI(nA, nB, iPrev);
          } else if (hasAcSource && !useInstantaneousAc) {
            const xL = Math.max(0.05, 2 * Math.PI * frequency * lH);
            stampG(nA, nB, 1 / xL);
          } else {
            stampG(nA, nB, 20); // 0.05Ω DC winding resistance
          }
          break;
        }
        case 'diode': {
          const nA = pinToNode[pinKey(comp.id, 'anode')];
          const nK = pinToNode[pinKey(comp.id, 'cathode')];
          const vf = comp.props.forwardVoltage ?? 0.7;
          if (diodeOn.get(comp.id)) {
            const g = 5; // 0.2Ω on-resistance
            stampG(nA, nK, g);
            // V(a) - V(k) = vf + I*0.2 => b[a] += g*vf, b[k] -= g*vf
            stampI(nK, nA, g * vf);
          } else {
            stampG(nA, nK, 1e-10);
          }
          break;
        }
        case 'led': {
          const nA = pinToNode[pinKey(comp.id, 'anode')];
          const nK = pinToNode[pinKey(comp.id, 'cathode')];
          const vf = getLedForwardVoltage(comp);
          if (diodeOn.get(comp.id)) {
            const g = 0.5; // 2Ω series resistance
            stampG(nA, nK, g);
            stampI(nK, nA, g * vf);
          } else {
            stampG(nA, nK, 1e-10);
          }
          break;
        }
        case 'zener': {
          const nA = pinToNode[pinKey(comp.id, 'anode')];
          const nK = pinToNode[pinKey(comp.id, 'cathode')];
          const vf = comp.props.forwardVoltage ?? 0.7;
          const vz = comp.props.zenerVoltage ?? 5.1;
          const mode = zenerMode.get(comp.id) ?? 'off';
          if (mode === 'fwd') {
            const g = 1;
            stampG(nA, nK, g);
            stampI(nK, nA, g * vf);
          } else if (mode === 'rev') {
            // Clamp V(K) - V(A) = vz => b[K] += g*vz, b[A] -= g*vz
            const g = 1; // 1Ω zener dynamic impedance
            stampG(nA, nK, g);
            stampI(nA, nK, g * vz);
          } else {
            stampG(nA, nK, 1e-10);
          }
          break;
        }
        case 'transistor': {
          const nB = pinToNode[pinKey(comp.id, 'b')];
          const nC = pinToNode[pinKey(comp.id, 'c')];
          const nE = pinToNode[pinKey(comp.id, 'e')];
          if (bjtBaseOn.get(comp.id)) {
            const gBe = 0.1; // 10Ω dynamic BE resistance
            stampG(nB, nE, gBe);
            stampI(nE, nB, gBe * 0.7);
            if (bjtSat.get(comp.id)) {
              // Vce saturated near 0.2V
              const gSat = 1;
              stampG(nC, nE, gSat);
              stampI(nE, nC, gSat * 0.2);
            } else {
              const ic = bjtIc.get(comp.id) ?? 0;
              stampI(nC, nE, ic);
              stampG(nC, nE, 1e-7);
            }
          } else {
            stampG(nB, nE, 1e-10);
            stampG(nC, nE, 1e-10);
          }
          break;
        }
        case 'mosfet': {
          const nD = pinToNode[pinKey(comp.id, 'd')];
          const nS = pinToNode[pinKey(comp.id, 's')];
          const isOn = Boolean(mosfetOn.get(comp.id));
          stampG(nD, nS, isOn ? 5 : 1e-10);
          break;
        }
        case 'op-amp': {
          const nOut = pinToNode[pinKey(comp.id, 'out')];
          const vOut = opAmpOut.get(comp.id) ?? 0;
          const gOut = 0.1; // 10Ω output stage
          stampG(nOut, '0', gOut);
          stampI('0', nOut, gOut * vOut);
          break;
        }
        case 'logic-gate': {
          const nOut = pinToNode[pinKey(comp.id, 'out')];
          const bit = gateOut.get(comp.id) ?? 0;
          const vOut = bit === 1 ? 5 : 0;
          const gOut = 0.02; // 50Ω output impedance
          stampG(nOut, '0', gOut);
          stampI('0', nOut, gOut * vOut);
          break;
        }
        case 'plc-unit': {
          const nCom = pinToNode[pinKey(comp.id, 'com')];
          const nI1 = pinToNode[pinKey(comp.id, 'i1')];
          const nI2 = pinToNode[pinKey(comp.id, 'i2')];
          const nQ1 = pinToNode[pinKey(comp.id, 'q1')];
          const nQ2 = pinToNode[pinKey(comp.id, 'q2')];
          // Input optocouplers 2.4kΩ to COM
          stampG(nI1, nCom, 1 / 2400);
          stampG(nI2, nCom, 1 / 2400);
          if (!forceDeenergizedOhmProbeId) {
            const vSupply = comp.props.voltage ?? 24;
            const gOut = 1; // 1Ω relay output stage
            stampG(nQ1, nCom, plcOutputs.Q1 ? gOut : 1e-4);
            if (plcOutputs.Q1) stampI(nCom, nQ1, gOut * vSupply);
            stampG(nQ2, nCom, plcOutputs.Q2 ? gOut : 1e-4);
            if (plcOutputs.Q2) stampI(nCom, nQ2, gOut * vSupply);
          }
          break;
        }
        case 'voltmeter': {
          stampG(
            pinToNode[pinKey(comp.id, 'pos')],
            pinToNode[pinKey(comp.id, 'neg')],
            1e-7 // 10 MΩ
          );
          break;
        }
        case 'ammeter': {
          stampG(
            pinToNode[pinKey(comp.id, 'pos')],
            pinToNode[pinKey(comp.id, 'neg')],
            100 // 0.01 Ω shunt
          );
          break;
        }
        case 'ohmmeter': {
          const nPos = pinToNode[pinKey(comp.id, 'pos')];
          const nNeg = pinToNode[pinKey(comp.id, 'neg')];
          if (forceDeenergizedOhmProbeId === comp.id) {
            // Inject 1 mA test current from neg->pos inside meter (out of pos into circuit)
            stampI(nNeg, nPos, 0.001);
            // Anchor neg probe slightly if completely isolated
            stampG(nNeg, '0', 1e-11);
          } else {
            stampG(nPos, nNeg, 1e-10);
          }
          break;
        }
        case 'multimeter': {
          const nPos = pinToNode[pinKey(comp.id, 'pos')];
          const nNeg = pinToNode[pinKey(comp.id, 'neg')];
          const mode = comp.props.multimeterMode ?? 'V_DC';
          if (mode === 'I_DC') {
            stampG(nPos, nNeg, 100);
          } else if (mode === 'R_OHM' && forceDeenergizedOhmProbeId === comp.id) {
            stampI(nNeg, nPos, 0.001);
          } else {
            stampG(nPos, nNeg, 1e-7);
          }
          break;
        }
        case 'power-meter': {
          stampG(
            pinToNode[pinKey(comp.id, 'in')],
            pinToNode[pinKey(comp.id, 'out')],
            100 // 0.01Ω current coil
          );
          stampG(
            pinToNode[pinKey(comp.id, 'in')],
            pinToNode[pinKey(comp.id, 'ref')],
            1e-7 // 10MΩ voltage sense
          );
          break;
        }
        case 'oscilloscope': {
          const nGnd = pinToNode[pinKey(comp.id, 'gnd')];
          stampG(pinToNode[pinKey(comp.id, 'ch1')], nGnd, 1e-7);
          stampG(pinToNode[pinKey(comp.id, 'ch2')], nGnd, 1e-7);
          break;
        }
        case 'ground':
        default:
          break;
      }
    }

    const sol = solveLinearSystem(A, b);
    if (!sol) {
      singularDetected = true;
      break;
    }

    const nodeVoltages: Record<string, number> = { '0': 0 };
    nonGroundNodes.forEach((nId, idx) => {
      nodeVoltages[nId] = sol[idx];
    });

    // Compute auxiliary branch currents
    const auxCurrents: Record<string, number> = {};
    auxSources.forEach((src, idx) => {
      auxCurrents[src.key] = sol[numNodes + idx];
    });

    // Check nonlinear device state updates
    let stateChanged = false;
    const vOf = (compId: string, pId: string) =>
      nodeVoltages[pinToNode[pinKey(compId, pId)] ?? '0'] ?? 0;

    for (const comp of project.components) {
      if (comp.type === 'diode' || comp.type === 'led') {
        const vd = vOf(comp.id, 'anode') - vOf(comp.id, 'cathode');
        const vf = comp.type === 'led' ? getLedForwardVoltage(comp) : comp.props.forwardVoltage ?? 0.7;
        const wasOn = Boolean(diodeOn.get(comp.id));
        const shouldOn = wasOn ? vd >= vf - 0.05 : vd >= vf;
        if (shouldOn !== wasOn) {
          diodeOn.set(comp.id, shouldOn);
          stateChanged = true;
        }
      } else if (comp.type === 'zener') {
        const vak = vOf(comp.id, 'anode') - vOf(comp.id, 'cathode');
        const vf = comp.props.forwardVoltage ?? 0.7;
        const vz = comp.props.zenerVoltage ?? 5.1;
        const prev = zenerMode.get(comp.id) ?? 'off';
        let next: 'off' | 'fwd' | 'rev' = 'off';
        if (vak >= (prev === 'fwd' ? vf - 0.05 : vf)) next = 'fwd';
        else if (-vak >= (prev === 'rev' ? vz - 0.05 : vz)) next = 'rev';
        if (next !== prev) {
          zenerMode.set(comp.id, next);
          stateChanged = true;
        }
      } else if (comp.type === 'transistor') {
        const vbe = vOf(comp.id, 'b') - vOf(comp.id, 'e');
        const vce = vOf(comp.id, 'c') - vOf(comp.id, 'e');
        const wasOn = Boolean(bjtBaseOn.get(comp.id));
        const shouldOn = wasOn ? vbe >= 0.62 : vbe >= 0.68;
        if (shouldOn !== wasOn) {
          bjtBaseOn.set(comp.id, shouldOn);
          stateChanged = true;
        }
        if (shouldOn) {
          const ib = Math.max(0, (vbe - 0.7) / 10);
          const beta = comp.props.beta ?? 100;
          const targetIc = Math.min(2, beta * ib);
          const prevIc = bjtIc.get(comp.id) ?? 0;
          const wasSat = Boolean(bjtSat.get(comp.id));
          const shouldSat = targetIc > 1e-4 && vce <= 0.25;
          if (shouldSat !== wasSat) {
            bjtSat.set(comp.id, shouldSat);
            stateChanged = true;
          }
          const dampedIc = 0.5 * targetIc + 0.5 * prevIc;
          if (Math.abs(dampedIc - prevIc) > 1e-4) {
            bjtIc.set(comp.id, dampedIc);
            stateChanged = true;
          }
        } else if (bjtSat.get(comp.id)) {
          bjtSat.set(comp.id, false);
          bjtIc.set(comp.id, 0);
          stateChanged = true;
        }
      } else if (comp.type === 'mosfet') {
        const vgs = vOf(comp.id, 'g') - vOf(comp.id, 's');
        const vth = comp.props.vth ?? 2.0;
        const wasOn = Boolean(mosfetOn.get(comp.id));
        const shouldOn = vgs >= vth;
        if (shouldOn !== wasOn) {
          mosfetOn.set(comp.id, shouldOn);
          stateChanged = true;
        }
      } else if (comp.type === 'op-amp') {
        const gain = comp.props.gain ?? 10000;
        const vDiff = vOf(comp.id, 'vp') - vOf(comp.id, 'vn');
        const rawTarget = Math.max(-12, Math.min(12, gain * vDiff));
        const prev = opAmpOut.get(comp.id) ?? 0;
        const damped = 0.45 * rawTarget + 0.55 * prev;
        if (Math.abs(damped - prev) > 0.01) {
          opAmpOut.set(comp.id, damped);
          stateChanged = true;
        }
      } else if (comp.type === 'logic-gate') {
        const gType = comp.props.gateType ?? 'AND';
        const a = vOf(comp.id, 'inA') >= 2.5 ? 1 : 0;
        const bIn = gType === 'NOT' ? 0 : vOf(comp.id, 'inB') >= 2.5 ? 1 : 0;
        let y: 0 | 1 = 0;
        if (gType === 'AND') y = a && bIn ? 1 : 0;
        else if (gType === 'OR') y = a || bIn ? 1 : 0;
        else if (gType === 'NOT') y = a ? 0 : 1;
        else if (gType === 'NAND') y = a && bIn ? 0 : 1;
        else if (gType === 'XOR') y = a !== bIn ? 1 : 0;
        if ((gateOut.get(comp.id) ?? 0) !== y) {
          gateOut.set(comp.id, y);
          stateChanged = true;
        }
      } else if (comp.type === 'relay' || comp.type === 'contactor' || comp.type === 'timer') {
        const vCoil = Math.abs(vOf(comp.id, 'a1') - vOf(comp.id, 'a2'));
        const rated = comp.props.coilVoltage ?? (comp.type === 'relay' ? 12 : 24);
        const energized = vCoil >= 0.75 * rated;
        coilActiveMap[comp.id] = energized;
        if (comp.type === 'relay' || comp.type === 'contactor') {
          if (relayClosedMap[comp.id] !== energized) {
            relayClosedMap[comp.id] = energized;
            stateChanged = true;
          }
        }
      } else if (comp.type === 'plc-unit' && !forceDeenergizedOhmProbeId) {
        const vI1 = Math.abs(vOf(comp.id, 'i1') - vOf(comp.id, 'com'));
        const vI2 = Math.abs(vOf(comp.id, 'i2') - vOf(comp.id, 'com'));
        const nextInputs = { I1: vI1 >= 10, I2: vI2 >= 10 };
        const scan = evaluatePlcLadder(
          project.ladderRungs,
          nextInputs,
          plcOutputs,
          state.plcTimers,
          0
        );
        if (
          nextInputs.I1 !== plcInputs.I1 ||
          nextInputs.I2 !== plcInputs.I2 ||
          scan.outputs.Q1 !== plcOutputs.Q1 ||
          scan.outputs.Q2 !== plcOutputs.Q2
        ) {
          plcInputs = nextInputs;
          plcOutputs = scan.outputs;
          stateChanged = true;
        }
      }
    }

    finalNodeVoltages = nodeVoltages;

    // Record branch currents for this converged/final iteration
    finalBranchCurrents = {};
    for (const comp of project.components) {
      const vA = (p: string) => finalNodeVoltages[pinToNode[pinKey(comp.id, p)] ?? '0'] ?? 0;
      switch (comp.type) {
        case 'dc-source':
        case 'ac-source': {
          finalBranchCurrents[comp.id] = -(auxCurrents[comp.id] ?? 0);
          break;
        }
        case 'battery': {
          const rInt = comp.props.internalResistance ?? 0;
          if (rInt <= 0) {
            finalBranchCurrents[comp.id] = -(auxCurrents[comp.id] ?? 0);
          } else {
            const vDiff = vA('pos') - vA('neg');
            finalBranchCurrents[comp.id] = ((comp.props.voltage ?? 12) - vDiff) / rInt;
          }
          break;
        }
        case 'current-source': {
          finalBranchCurrents[comp.id] = comp.props.current ?? 0.05;
          break;
        }
        case 'resistor': {
          const r = Math.max(0.01, comp.props.resistance ?? 1000);
          finalBranchCurrents[comp.id] = (vA('a') - vA('b')) / r;
          break;
        }
        case 'potentiometer': {
          const totalR = Math.max(1, comp.props.resistance ?? 10000);
          const pct = Math.min(99, Math.max(1, comp.props.wiperPercent ?? 50)) / 100;
          finalBranchCurrents[comp.id] = (vA('t1') - vA('wiper')) / (totalR * pct);
          break;
        }
        case 'lamp': {
          const vR = Math.max(0.1, comp.props.ratedVoltage ?? 12);
          const pR = Math.max(0.01, comp.props.ratedPower ?? 6);
          finalBranchCurrents[comp.id] = (vA('a') - vA('b')) / ((vR * vR) / pR);
          break;
        }
        case 'motor': {
          const rM = Math.max(0.5, comp.props.resistance ?? 12);
          finalBranchCurrents[comp.id] = (vA('pos') - vA('neg')) / rM;
          break;
        }
        case 'switch': {
          finalBranchCurrents[comp.id] = comp.props.closed
            ? (vA('a') - vA('b')) * 100
            : 0;
          break;
        }
        case 'push-button': {
          const closed = comp.props.momentaryNC ? !comp.props.closed : Boolean(comp.props.closed);
          finalBranchCurrents[comp.id] = closed ? (vA('a') - vA('b')) * 100 : 0;
          break;
        }
        case 'fuse': {
          finalBranchCurrents[comp.id] = state.blownFuses[comp.id]
            ? 0
            : (vA('a') - vA('b')) * 100;
          break;
        }
        case 'circuit-breaker': {
          const closed = Boolean(comp.props.closed ?? true) && !state.trippedBreakers[comp.id];
          finalBranchCurrents[comp.id] = closed ? (vA('a') - vA('b')) * 100 : 0;
          break;
        }
        case 'thermal-overload': {
          finalBranchCurrents[comp.id] = (vA('t1') - vA('t2')) * 100;
          break;
        }
        case 'contactor': {
          finalBranchCurrents[comp.id] = relayClosedMap[comp.id]
            ? (vA('l1') - vA('t1')) * 100
            : 0;
          break;
        }
        case 'relay': {
          finalBranchCurrents[comp.id] = relayClosedMap[comp.id]
            ? (vA('no1') - vA('no2')) * 100
            : 0;
          break;
        }
        case 'timer': {
          finalBranchCurrents[comp.id] = relayClosedMap[comp.id]
            ? (vA('t17') - vA('t18')) * 100
            : 0;
          break;
        }
        case 'transformer': {
          if (hasAcSource && auxCurrents[comp.id] !== undefined) {
            finalBranchCurrents[comp.id] = -auxCurrents[comp.id];
          } else {
            finalBranchCurrents[comp.id] = (vA('s1') - vA('s2')) * 0.2;
          }
          break;
        }
        case 'capacitor': {
          const cF = Math.max(1e-9, (comp.props.capacitanceUf ?? 1000) * 1e-6);
          const vc = vA('pos') - vA('neg');
          if (dt > 0) {
            const vPrev = state.capVoltages[comp.id] ?? 0;
            finalBranchCurrents[comp.id] = (cF / dt) * (vc - vPrev);
          } else if (hasAcSource && !useInstantaneousAc) {
            finalBranchCurrents[comp.id] = vc * 2 * Math.PI * frequency * cF;
          } else {
            finalBranchCurrents[comp.id] = 0;
          }
          break;
        }
        case 'inductor': {
          const lH = Math.max(1e-6, (comp.props.inductanceMh ?? 100) * 1e-3);
          const vl = vA('a') - vA('b');
          if (dt > 0) {
            finalBranchCurrents[comp.id] = (state.indCurrents[comp.id] ?? 0) + (dt / lH) * vl;
          } else if (hasAcSource && !useInstantaneousAc) {
            finalBranchCurrents[comp.id] = vl / Math.max(0.05, 2 * Math.PI * frequency * lH);
          } else {
            finalBranchCurrents[comp.id] = vl * 20;
          }
          break;
        }
        case 'diode': {
          const vf = comp.props.forwardVoltage ?? 0.7;
          const vd = vA('anode') - vA('cathode');
          finalBranchCurrents[comp.id] = diodeOn.get(comp.id) ? Math.max(0, (vd - vf) * 5) : 0;
          break;
        }
        case 'led': {
          const vf = getLedForwardVoltage(comp);
          const vd = vA('anode') - vA('cathode');
          finalBranchCurrents[comp.id] = diodeOn.get(comp.id) ? Math.max(0, (vd - vf) * 0.5) : 0;
          break;
        }
        case 'zener': {
          const mode = zenerMode.get(comp.id) ?? 'off';
          const vak = vA('anode') - vA('cathode');
          const vf = comp.props.forwardVoltage ?? 0.7;
          const vz = comp.props.zenerVoltage ?? 5.1;
          if (mode === 'fwd') finalBranchCurrents[comp.id] = Math.max(0, vak - vf);
          else if (mode === 'rev') finalBranchCurrents[comp.id] = Math.min(0, vak + vz);
          else finalBranchCurrents[comp.id] = 0;
          break;
        }
        case 'transistor': {
          if (!bjtBaseOn.get(comp.id)) {
            finalBranchCurrents[comp.id] = 0;
          } else if (bjtSat.get(comp.id)) {
            finalBranchCurrents[comp.id] = Math.max(0, vA('c') - vA('e') - 0.2);
          } else {
            finalBranchCurrents[comp.id] = bjtIc.get(comp.id) ?? 0;
          }
          break;
        }
        case 'mosfet': {
          finalBranchCurrents[comp.id] = mosfetOn.get(comp.id)
            ? (vA('d') - vA('s')) * 5
            : 0;
          break;
        }
        case 'ammeter':
        case 'multimeter':
          finalBranchCurrents[comp.id] = (vA('pos') - vA('neg')) * 100;
          break;
        case 'power-meter':
          finalBranchCurrents[comp.id] = (vA('in') - vA('out')) * 100;
          break;
        default:
          finalBranchCurrents[comp.id] = 0;
          break;
      }
    }

    if (!stateChanged) break;
  }

  return {
    valid: !singularDetected,
    nodeVoltages: finalNodeVoltages,
    pinToNode,
    branchCurrents: finalBranchCurrents,
    coilActiveMap,
    relayClosedMap,
    plcInputs,
    plcOutputs,
    shortDetected: false,
    singularDetected,
    hasAcSource,
    hasGround: hasExplicitGround,
    frequency,
  };
}

export function simulateLabCircuit(
  project: LabCircuitProject,
  prevState: LabPersistentSimState,
  dt = 0
): { result: LabSimulationResult; nextState: LabPersistentSimState } {
  const nextState: LabPersistentSimState = {
    simTime: prevState.simTime + Math.max(0, dt),
    capVoltages: { ...prevState.capVoltages },
    indCurrents: { ...prevState.indCurrents },
    blownFuses: { ...prevState.blownFuses },
    trippedBreakers: { ...prevState.trippedBreakers },
    thermalEnergy: { ...prevState.thermalEnergy },
    thermalTripped: { ...prevState.thermalTripped },
    timerElapsed: { ...prevState.timerElapsed },
    relayStates: { ...prevState.relayStates },
    plcMemory: { ...prevState.plcMemory },
    plcTimers: { ...prevState.plcTimers },
    waveformHistory: [...prevState.waveformHistory],
  };

  const diagnostics: LabDiagnosticMessage[] = [];
  let pass = runMnaPass({ project, state: nextState, dt });

  // Update protection devices (Fuse, Breaker, Thermal Overload) and re-solve if any opened!
  let protectionTripped = false;
  if (pass.valid) {
    for (const comp of project.components) {
      const iAbs = Math.abs(pass.branchCurrents[comp.id] ?? 0);
      if (comp.type === 'fuse' && !nextState.blownFuses[comp.id]) {
        const rated = comp.props.ratedCurrent ?? 2;
        if (iAbs > rated * 1.01) {
          nextState.blownFuses[comp.id] = true;
          protectionTripped = true;
          diagnostics.push({
            id: `diag-fuse-${comp.id}`,
            severity: 'error',
            code: 'FUSE_BLOWN',
            componentId: comp.id,
            message: {
              ar: `انصهر المصهر ${comp.label} لأن التيار (${iAbs.toFixed(2)}A) تجاوز الحد المقنن (${rated}A).`,
              en: `Fuse ${comp.label} blew because current (${iAbs.toFixed(2)}A) exceeded ${rated}A.`,
              fr: `Le fusible ${comp.label} a fondu (${iAbs.toFixed(2)}A > ${rated}A).`,
            },
          });
        }
      } else if (comp.type === 'circuit-breaker' && !nextState.trippedBreakers[comp.id]) {
        const rated = comp.props.ratedCurrent ?? 10;
        if (iAbs > rated * 1.45) {
          nextState.trippedBreakers[comp.id] = true;
          protectionTripped = true;
          diagnostics.push({
            id: `diag-mcb-${comp.id}`,
            severity: 'error',
            code: 'BREAKER_TRIPPED',
            componentId: comp.id,
            message: {
              ar: `فصل القاطع ${comp.label} لحماية الدائرة من تيار زائد (${iAbs.toFixed(2)}A).`,
              en: `Breaker ${comp.label} tripped on overcurrent (${iAbs.toFixed(2)}A).`,
              fr: `Le disjoncteur ${comp.label} a déclenché (${iAbs.toFixed(2)}A).`,
            },
          });
        }
      } else if (comp.type === 'thermal-overload' && !nextState.thermalTripped[comp.id]) {
        const rated = comp.props.ratedCurrent ?? 3;
        if (iAbs > rated * 1.15 && dt > 0) {
          const ratio = iAbs / rated;
          const prevE = nextState.thermalEnergy[comp.id] ?? 0;
          const nextE = prevE + dt * 0.6 * (ratio * ratio - 1);
          nextState.thermalEnergy[comp.id] = nextE;
          if (nextE >= 1.0) {
            nextState.thermalTripped[comp.id] = true;
            protectionTripped = true;
            diagnostics.push({
              id: `diag-th-${comp.id}`,
              severity: 'warning',
              code: 'THERMAL_TRIP',
              componentId: comp.id,
              message: {
                ar: `فصل المرحل الحراري ${comp.label} تلامس (95-96) بسبب استمرار زيادة الحمل.`,
                en: `Thermal overload ${comp.label} tripped contact 95-96 on sustained overload.`,
                fr: `Le relais thermique ${comp.label} a ouvert 95-96 suite à une surcharge.`,
              },
            });
          }
        } else if (dt > 0) {
          nextState.thermalEnergy[comp.id] = Math.max(
            0,
            (nextState.thermalEnergy[comp.id] ?? 0) - dt * 0.25
          );
        }
      }
    }
  }

  // Re-solve with tripped fuse/breaker/overload open
  if (protectionTripped) {
    pass = runMnaPass({ project, state: nextState, dt });
  }

  // Commit time-domain states (capacitor voltages, inductor currents, timers, relays, PLC)
  if (pass.valid) {
    const vOf = (compId: string, pId: string) =>
      pass.nodeVoltages[pass.pinToNode[pinKey(compId, pId)] ?? '0'] ?? 0;

    for (const comp of project.components) {
      if (comp.type === 'capacitor' && dt > 0) {
        nextState.capVoltages[comp.id] = vOf(comp.id, 'pos') - vOf(comp.id, 'neg');
      } else if (comp.type === 'inductor' && dt > 0) {
        nextState.indCurrents[comp.id] = pass.branchCurrents[comp.id] ?? 0;
      } else if (comp.type === 'relay' || comp.type === 'contactor') {
        nextState.relayStates[comp.id] = Boolean(pass.coilActiveMap[comp.id]);
      } else if (comp.type === 'timer') {
        if (pass.coilActiveMap[comp.id]) {
          nextState.timerElapsed[comp.id] =
            (nextState.timerElapsed[comp.id] ?? 0) + Math.max(0, dt);
        } else {
          nextState.timerElapsed[comp.id] = 0;
        }
      } else if (comp.type === 'plc-unit') {
        const scan = evaluatePlcLadder(
          project.ladderRungs,
          pass.plcInputs,
          nextState.plcMemory,
          nextState.plcTimers,
          dt
        );
        nextState.plcMemory = scan.nextMemory;
        nextState.plcTimers = scan.nextTimers;
      }
    }
  }

  // Also flag already blown/tripped protections as persistent diagnostics
  for (const comp of project.components) {
    if (
      comp.type === 'fuse' &&
      nextState.blownFuses[comp.id] &&
      !diagnostics.some((d) => d.componentId === comp.id)
    ) {
      diagnostics.push({
        id: `diag-fuse-persist-${comp.id}`,
        severity: 'error',
        code: 'FUSE_BLOWN',
        componentId: comp.id,
        message: {
          ar: `المصهر ${comp.label} منصهر حالياً — اضغط Reset لاستبداله.`,
          en: `Fuse ${comp.label} is blown — press Reset to replace it.`,
          fr: `Fusible ${comp.label} fondu — appuyez sur Reset pour le remplacer.`,
        },
      });
    }
    if (
      comp.type === 'circuit-breaker' &&
      nextState.trippedBreakers[comp.id] &&
      !diagnostics.some((d) => d.componentId === comp.id)
    ) {
      diagnostics.push({
        id: `diag-mcb-persist-${comp.id}`,
        severity: 'error',
        code: 'BREAKER_TRIPPED',
        componentId: comp.id,
        message: {
          ar: `القاطع ${comp.label} مفصول تلقائياً — اضغط Reset لإعادة التوصيل.`,
          en: `Breaker ${comp.label} is tripped — press Reset to re-arm.`,
          fr: `Disjoncteur ${comp.label} déclenché — appuyez sur Reset.`,
        },
      });
    }
  }

  if (pass.shortDetected) {
    diagnostics.push({
      id: 'diag-short',
      severity: 'error',
      code: 'SHORT_CIRCUIT',
      message: {
        ar: 'تم رصد قصر كهربائي مباشر (Short Circuit) على أطراف المصدر! افصل القصر أو أضف حملاً أو مصهراً.',
        en: 'Direct Short Circuit detected across voltage source terminals! Insert a load or fuse.',
        fr: 'Court-circuit direct détecté aux bornes de la source ! Ajoutez une charge ou un fusible.',
      },
    });
  } else if (pass.singularDetected) {
    diagnostics.push({
      id: 'diag-unsolvable',
      severity: 'error',
      code: 'UNSOLVABLE',
      message: {
        ar: 'تعذر حل الدائرة (قد يوجد مصدران مختلفا الجهد موصلان على التوازي مباشرة أو عقدة غير قابلة للحل).',
        en: 'Circuit cannot be solved (check for conflicting parallel voltage sources or shorted loops).',
        fr: 'Circuit impossible à résoudre (sources de tension en conflit ou boucle en court-circuit).',
      },
    });
  }

  // Diagnostic: missing explicit ground when sources exist
  const hasSource = project.components.some(
    (c) =>
      c.type === 'battery' ||
      c.type === 'dc-source' ||
      c.type === 'ac-source' ||
      c.type === 'current-source'
  );
  if (hasSource && !pass.hasGround && project.components.length > 0) {
    diagnostics.push({
      id: 'diag-noground',
      severity: 'info',
      code: 'NO_GROUND',
      message: {
        ar: 'لا يوجد عنصر أرضي (GND) صريح؛ تم اعتماد القطب السالب للمصدر كمرجع 0V تلقائياً.',
        en: 'No explicit Ground (0V) symbol placed; source negative terminal auto-referenced to 0V.',
        fr: 'Aucune masse (GND) explicite ; la borne négative de la source sert de référence 0V.',
      },
    });
  }

  // Diagnostic: DC Transformer
  if (
    hasSource &&
    !pass.hasAcSource &&
    project.components.some((c) => c.type === 'transformer')
  ) {
    diagnostics.push({
      id: 'diag-dc-tr',
      severity: 'warning',
      code: 'DC_TRANSFORMER',
      message: {
        ar: 'المحول الكهربائي لا ينقل الجهد المستمر DC الثابت؛ استبدل المصدر بمصدر AC لملاحظة التحويل.',
        en: 'Transformers do not step steady DC voltage; use an AC Source for transformer operation.',
        fr: 'Un transformateur ne fonctionne pas en régime DC permanent ; utilisez une source AC.',
      },
    });
  }

  // Build per-component simulation states + Ohmmeter checks
  const componentStates: Record<string, LabComponentSimState> = {};
  let totalBranchActive = false;

  for (const comp of project.components) {
    const pins = getComponentPins(comp);
    const nodeVoltages: Record<string, number> = {};
    for (const p of pins) {
      nodeVoltages[p.id] = pass.nodeVoltages[pass.pinToNode[pinKey(comp.id, p.id)] ?? '0'] ?? 0;
    }

    const iBranch = pass.branchCurrents[comp.id] ?? 0;
    if (Math.abs(iBranch) > 1e-5) totalBranchActive = true;

    let voltageDrop = 0;
    if (pins.length >= 2) {
      voltageDrop = (nodeVoltages[pins[0].id] ?? 0) - (nodeVoltages[pins[1].id] ?? 0);
    }

    // Specific voltage drop & power computation
    if (
      comp.type === 'battery' ||
      comp.type === 'dc-source' ||
      comp.type === 'ac-source' ||
      comp.type === 'current-source'
    ) {
      voltageDrop = (nodeVoltages.pos ?? 0) - (nodeVoltages.neg ?? 0);
      if (Math.abs(iBranch) > 50 && !protectionTripped) {
        diagnostics.push({
          id: `diag-highcurr-${comp.id}`,
          severity: 'warning',
          code: 'OVER_CURRENT',
          componentId: comp.id,
          message: {
            ar: `تيار مرتفع جداً (${Math.abs(iBranch).toFixed(1)}A) في المصدر ${comp.label} — تحقق من عدم وجود قصر جزئي.`,
            en: `Very high current (${Math.abs(iBranch).toFixed(1)}A) on ${comp.label} — check for short path.`,
            fr: `Courant très élevé (${Math.abs(iBranch).toFixed(1)}A) sur ${comp.label}.`,
          },
        });
      }
    } else if (comp.type === 'transformer') {
      voltageDrop = (nodeVoltages.s1 ?? 0) - (nodeVoltages.s2 ?? 0);
    } else if (comp.type === 'potentiometer') {
      voltageDrop = (nodeVoltages.t1 ?? 0) - (nodeVoltages.t2 ?? 0);
    } else if (comp.type === 'diode' || comp.type === 'led' || comp.type === 'zener') {
      voltageDrop = (nodeVoltages.anode ?? 0) - (nodeVoltages.cathode ?? 0);
    } else if (comp.type === 'transistor') {
      voltageDrop = (nodeVoltages.c ?? 0) - (nodeVoltages.e ?? 0);
    } else if (comp.type === 'mosfet') {
      voltageDrop = (nodeVoltages.d ?? 0) - (nodeVoltages.s ?? 0);
    } else if (comp.type === 'logic-gate') {
      voltageDrop = nodeVoltages.out ?? 0;
    } else if (comp.type === 'op-amp') {
      voltageDrop = nodeVoltages.out ?? 0;
    }

    const power = Math.abs(voltageDrop * iBranch);

    // Overload / Overvoltage warnings
    let brightness = 0;
    let overloaded = false;
    let motorRpm: number | undefined;
    let motorDir: 'fwd' | 'rev' | 'stopped' | undefined;
    let meterDisplay: string | undefined;
    let meterUnit: string | undefined;
    let logicOut: 0 | 1 | undefined;

    if (comp.type === 'lamp') {
      const pRated = Math.max(0.01, comp.props.ratedPower ?? 6);
      const vRated = Math.max(0.1, comp.props.ratedVoltage ?? 12);
      brightness = Math.min(1.25, Math.sqrt(power / pRated));
      if (Math.abs(voltageDrop) > vRated * 1.25) {
        overloaded = true;
        diagnostics.push({
          id: `diag-lamp-${comp.id}`,
          severity: 'warning',
          code: 'OVERLOAD',
          componentId: comp.id,
          message: {
            ar: `الجهد على المصباح ${comp.label} (${Math.abs(voltageDrop).toFixed(1)}V) أعلى من جهده الاسمي (${vRated}V)!`,
            en: `Lamp ${comp.label} voltage (${Math.abs(voltageDrop).toFixed(1)}V) exceeds rated ${vRated}V!`,
            fr: `Tension sur la lampe ${comp.label} (${Math.abs(voltageDrop).toFixed(1)}V) > ${vRated}V !`,
          },
        });
      }
    } else if (comp.type === 'led') {
      brightness = iBranch > 0.0005 ? Math.min(1, iBranch / 0.02) : 0;
      if (iBranch > 0.03) {
        overloaded = true;
        diagnostics.push({
          id: `diag-led-${comp.id}`,
          severity: 'warning',
          code: 'OVER_CURRENT',
          componentId: comp.id,
          message: {
            ar: `تيار الـ LED ${comp.label} مرتفع (${(iBranch * 1000).toFixed(1)}mA > 30mA)؛ أضف مقاومة حماية على التوالي.`,
            en: `LED ${comp.label} overcurrent (${(iBranch * 1000).toFixed(1)}mA > 30mA); add a series resistor.`,
            fr: `Surintensité LED ${comp.label} (${(iBranch * 1000).toFixed(1)}mA > 30mA) ; ajoutez une résistance.`,
          },
        });
      }
    } else if (comp.type === 'resistor') {
      const pMax = comp.props.ratedPower ?? 0.5;
      if (power > pMax * 1.1) {
        overloaded = true;
        diagnostics.push({
          id: `diag-res-${comp.id}`,
          severity: 'warning',
          code: 'OVERLOAD',
          componentId: comp.id,
          message: {
            ar: `القدرة المبددة في المقاومة ${comp.label} (${power.toFixed(2)}W) تتجاوز قدرتها الاسمية (${pMax}W).`,
            en: `Resistor ${comp.label} dissipation (${power.toFixed(2)}W) exceeds rating (${pMax}W).`,
            fr: `Dissipation de ${comp.label} (${power.toFixed(2)}W) supérieure à ${pMax}W.`,
          },
        });
      }
    } else if (comp.type === 'motor') {
      const vRated = Math.max(1, comp.props.ratedVoltage ?? 12);
      const ratio = Math.min(1.4, Math.abs(voltageDrop) / vRated);
      motorRpm = Math.round(ratio * 1500);
      if (Math.abs(voltageDrop) < 0.5) motorDir = 'stopped';
      else if (pass.hasAcSource) motorDir = 'fwd';
      else motorDir = voltageDrop >= 0 ? 'fwd' : 'rev';
    } else if (comp.type === 'logic-gate') {
      logicOut = (nodeVoltages.out ?? 0) >= 2.5 ? 1 : 0;
    } else if (comp.type === 'voltmeter') {
      const v = (nodeVoltages.pos ?? 0) - (nodeVoltages.neg ?? 0);
      meterDisplay = `${v.toFixed(2)}`;
      meterUnit = pass.hasAcSource ? 'V~' : 'V';
    } else if (comp.type === 'ammeter') {
      const i = (nodeVoltages.pos ?? 0) - (nodeVoltages.neg ?? 0);
      const amps = i * 100;
      if (Math.abs(amps) < 1 && Math.abs(amps) > 0) {
        meterDisplay = `${(amps * 1000).toFixed(1)}`;
        meterUnit = 'mA';
      } else {
        meterDisplay = `${amps.toFixed(2)}`;
        meterUnit = 'A';
      }
    } else if (
      comp.type === 'ohmmeter' ||
      (comp.type === 'multimeter' && comp.props.multimeterMode === 'R_OHM')
    ) {
      const nPos = pass.pinToNode[pinKey(comp.id, 'pos')] ?? '0';
      const nNeg = pass.pinToNode[pinKey(comp.id, 'neg')] ?? '0';
      const liveVoltage =
        hasSource &&
        (Math.abs(pass.nodeVoltages[nPos] ?? 0) > 0.05 ||
          Math.abs(pass.nodeVoltages[nNeg] ?? 0) > 0.05);
      if (liveVoltage) {
        meterDisplay = 'LIVE!';
        meterUnit = '⚠';
        diagnostics.push({
          id: `diag-ohm-${comp.id}`,
          severity: 'warning',
          code: 'LIVE_OHMMETER',
          componentId: comp.id,
          message: {
            ar: `تحذير: الأوميتر ${comp.label} متصل بدائرة حية تحت الجهد! افصل التغذية قبل قياس المقاومة.`,
            en: `Warning: Ohmmeter ${comp.label} is connected to a live energized circuit! Disconnect power first.`,
            fr: `Attention : ohmmètre ${comp.label} branché sous tension ! Coupez l'alimentation.`,
          },
        });
      } else if (nPos === nNeg) {
        meterDisplay = '0.00';
        meterUnit = 'Ω';
      } else {
        const ohmPass = runMnaPass({
          project,
          state: nextState,
          dt: 0,
          forceDeenergizedOhmProbeId: comp.id,
        });
        const vP = ohmPass.nodeVoltages[ohmPass.pinToNode[pinKey(comp.id, 'pos')] ?? '0'] ?? 0;
        const vN = ohmPass.nodeVoltages[ohmPass.pinToNode[pinKey(comp.id, 'neg')] ?? '0'] ?? 0;
        const rEq = Math.abs(vP - vN) / 0.001;
        if (!ohmPass.valid || rEq > 1e7) {
          meterDisplay = 'OL';
          meterUnit = 'Ω';
        } else if (rEq >= 1000) {
          meterDisplay = (rEq / 1000).toFixed(2);
          meterUnit = 'kΩ';
        } else {
          meterDisplay = rEq.toFixed(1);
          meterUnit = 'Ω';
        }
      }
    } else if (comp.type === 'multimeter') {
      const mode = comp.props.multimeterMode ?? 'V_DC';
      if (mode === 'I_DC') {
        const amps = ((nodeVoltages.pos ?? 0) - (nodeVoltages.neg ?? 0)) * 100;
        meterDisplay = Math.abs(amps) < 1 ? `${(amps * 1000).toFixed(1)}` : `${amps.toFixed(2)}`;
        meterUnit = Math.abs(amps) < 1 ? 'mA' : 'A';
      } else {
        const v = (nodeVoltages.pos ?? 0) - (nodeVoltages.neg ?? 0);
        meterDisplay = `${v.toFixed(2)}`;
        meterUnit = mode === 'V_AC' ? 'V~' : 'V';
      }
    } else if (comp.type === 'power-meter') {
      const iP = ((nodeVoltages.in ?? 0) - (nodeVoltages.out ?? 0)) * 100;
      const vP = (nodeVoltages.in ?? 0) - (nodeVoltages.ref ?? 0);
      const watts = Math.abs(vP * iP);
      meterDisplay = watts >= 100 ? watts.toFixed(1) : watts.toFixed(2);
      meterUnit = 'W';
    }

    const delaySec = comp.props.delaySeconds ?? 3;
    componentStates[comp.id] = {
      componentId: comp.id,
      voltageDrop,
      current: iBranch,
      power,
      nodeVoltages,
      energized: Math.abs(iBranch) > 1e-4 || Math.abs(voltageDrop) > 0.1,
      brightness,
      blown: Boolean(nextState.blownFuses[comp.id]),
      tripped:
        Boolean(nextState.trippedBreakers[comp.id]) ||
        Boolean(nextState.thermalTripped[comp.id]),
      coilActive: Boolean(pass.coilActiveMap[comp.id]),
      timerRemaining:
        comp.type === 'timer'
          ? Math.max(0, delaySec - (nextState.timerElapsed[comp.id] ?? 0))
          : undefined,
      motorRpm,
      motorDir,
      overloaded,
      meterDisplay,
      meterUnit,
      logicOut,
    };
  }

  // Open Circuit helpful diagnostic if sources exist, no errors, and virtually zero branch current
  if (
    hasSource &&
    pass.valid &&
    !totalBranchActive &&
    diagnostics.every((d) => d.severity !== 'error')
  ) {
    diagnostics.push({
      id: 'diag-open-circuit',
      severity: 'info',
      code: 'OPEN_CIRCUIT',
      message: {
        ar: 'الدائرة مفتوحة حالياً (لا يوجد مسار تيار مغلق أو أحد المفاتيح/الأزرار مفتوح).',
        en: 'Open Circuit: no current path is closed (check open switches or unwired pins).',
        fr: 'Circuit ouvert : aucun courant ne circule (vérifiez les interrupteurs ou connexions).',
      },
    });
  }

  // Real Oscilloscope Waveform Generation (Physical Instantaneous AC Sweep OR Transient Time History)
  let waveform: LabWaveformSample[] = [];
  const scope = project.components.find((c) => c.type === 'oscilloscope');
  if (pass.valid) {
    const firstSource = project.components.find(
      (c) => c.type === 'ac-source' || c.type === 'dc-source' || c.type === 'battery'
    );
    const ch1Pin = scope
      ? pinKey(scope.id, 'ch1')
      : firstSource
      ? pinKey(firstSource.id, 'pos')
      : null;
    const ch2Pin = scope ? pinKey(scope.id, 'ch2') : null;
    const gndPin = scope ? pinKey(scope.id, 'gnd') : null;

    const getV = (nodeMap: Record<string, number>, pk: string | null) => {
      if (!pk) return 0;
      const vTarget = nodeMap[pass.pinToNode[pk] ?? '0'] ?? 0;
      const vRef = gndPin ? nodeMap[pass.pinToNode[gndPin] ?? '0'] ?? 0 : 0;
      return vTarget - vRef;
    };

    if (pass.hasAcSource) {
      // Solve 48 real instantaneous points across 2 AC cycles!
      const nSamples = 48;
      const totalWindow = 2 / Math.max(1, pass.frequency);
      const stepDt = totalWindow / nSamples;
      let acSimState: LabPersistentSimState = {
        ...nextState,
        capVoltages: {},
        indCurrents: {},
      };
      for (let s = 0; s <= nSamples; s++) {
        const tSample = s * stepDt;
        const acPass = runMnaPass({
          project,
          state: acSimState,
          dt: stepDt,
          instantaneousTime: tSample,
          useInstantaneousAc: true,
        });
        for (const c of project.components) {
          if (c.type === 'capacitor') {
            const vp = acPass.nodeVoltages[acPass.pinToNode[pinKey(c.id, 'pos')] ?? '0'] ?? 0;
            const vn = acPass.nodeVoltages[acPass.pinToNode[pinKey(c.id, 'neg')] ?? '0'] ?? 0;
            acSimState.capVoltages[c.id] = vp - vn;
          }
        }
        const v1 = getV(acPass.nodeVoltages, ch1Pin);
        const v2 = getV(acPass.nodeVoltages, ch2Pin);
        waveform.push({ t: tSample, ch1: v1, ch2: v2 });
      }
    } else {
      const v1 = getV(pass.nodeVoltages, ch1Pin);
      const v2 = getV(pass.nodeVoltages, ch2Pin);
      nextState.waveformHistory.push({ t: nextState.simTime, ch1: v1, ch2: v2 });
      if (nextState.waveformHistory.length > 90) {
        nextState.waveformHistory = nextState.waveformHistory.slice(-90);
      }
      waveform = nextState.waveformHistory;
    }
  }

  // Compute approximate wire current magnitude from connected component pins
  const wireCurrents: Record<string, number> = {};
  for (const wire of project.wires) {
    const iFrom = Math.abs(pass.branchCurrents[wire.fromCompId] ?? 0);
    const iTo = Math.abs(pass.branchCurrents[wire.toCompId] ?? 0);
    // Use the smaller non-zero current if both pins carry branch currents, else max
    wireCurrents[wire.id] = iFrom > 0 && iTo > 0 ? Math.min(iFrom, iTo) : Math.max(iFrom, iTo);
  }

  return {
    result: {
      valid: pass.valid && !pass.shortDetected,
      simTime: nextState.simTime,
      hasAcSource: pass.hasAcSource,
      hasGround: pass.hasGround,
      frequency: pass.frequency,
      nodeVoltages: pass.nodeVoltages,
      pinToNode: pass.pinToNode,
      componentStates,
      wireCurrents,
      diagnostics,
      waveform,
      plcInputs: pass.plcInputs,
      plcOutputs: pass.plcOutputs,
    },
    nextState,
  };
}
