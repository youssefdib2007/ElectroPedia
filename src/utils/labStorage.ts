import type {
  LabCircuitProject,
  LabComponentInstance,
  LabLadderRung,
  LabWire,
} from '../types/electronics';

const DB_NAME = 'electropedia_lab_db';
const DB_VERSION = 1;
const STORE_PROJECTS = 'projects';
const ACTIVE_PROJECT_KEY = 'electropedia_lab_active_id';
const FALLBACK_STORAGE_KEY = 'electropedia_lab_projects_v1';

function hasIndexedDb(): boolean {
  return typeof indexedDB !== 'undefined';
}

function openLabDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
        db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function readFallbackProjects(): LabCircuitProject[] {
  try {
    const raw = localStorage.getItem(FALLBACK_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFallbackProjects(projects: LabCircuitProject[]): void {
  try {
    localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // ignore storage quota errors cleanly
  }
}

export async function listLabProjects(): Promise<LabCircuitProject[]> {
  if (!hasIndexedDb()) {
    return readFallbackProjects().sort((a, b) => b.updatedAt - a.updatedAt);
  }
  try {
    const db = await openLabDb();
    return await new Promise<LabCircuitProject[]>((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readonly');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.getAll();
      req.onsuccess = () => {
        const items = (req.result as LabCircuitProject[]) ?? [];
        resolve(items.sort((a, b) => b.updatedAt - a.updatedAt));
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return readFallbackProjects().sort((a, b) => b.updatedAt - a.updatedAt);
  }
}

export async function saveLabProject(project: LabCircuitProject): Promise<void> {
  const normalized: LabCircuitProject = {
    ...project,
    updatedAt: Date.now(),
  };

  if (!hasIndexedDb()) {
    const list = readFallbackProjects().filter((p) => p.id !== normalized.id);
    list.unshift(normalized);
    writeFallbackProjects(list);
    return;
  }

  try {
    const db = await openLabDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readwrite');
      tx.objectStore(STORE_PROJECTS).put(normalized);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const list = readFallbackProjects().filter((p) => p.id !== normalized.id);
    list.unshift(normalized);
    writeFallbackProjects(list);
  }
}

export async function deleteLabProject(projectId: string): Promise<void> {
  if (!hasIndexedDb()) {
    const list = readFallbackProjects().filter((p) => p.id !== projectId);
    writeFallbackProjects(list);
    return;
  }

  try {
    const db = await openLabDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, 'readwrite');
      tx.objectStore(STORE_PROJECTS).delete(projectId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const list = readFallbackProjects().filter((p) => p.id !== projectId);
    writeFallbackProjects(list);
  }
}

export function getActiveLabProjectId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_PROJECT_KEY);
  } catch {
    return null;
  }
}

export function setActiveLabProjectId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  } catch {
    // ignore
  }
}

export function exportLabProjectJson(project: LabCircuitProject): string {
  return JSON.stringify(
    {
      format: 'electropedia-virtual-lab-v1',
      exportedAt: new Date().toISOString(),
      project,
    },
    null,
    2
  );
}

const VALID_TYPES = new Set([
  'battery',
  'dc-source',
  'ac-source',
  'current-source',
  'ground',
  'switch',
  'push-button',
  'lamp',
  'fuse',
  'circuit-breaker',
  'relay',
  'contactor',
  'transformer',
  'thermal-overload',
  'timer',
  'motor',
  'resistor',
  'potentiometer',
  'capacitor',
  'inductor',
  'diode',
  'led',
  'zener',
  'transistor',
  'mosfet',
  'logic-gate',
  'op-amp',
  'plc-unit',
  'voltmeter',
  'ammeter',
  'ohmmeter',
  'multimeter',
  'power-meter',
  'oscilloscope',
]);

export function validateImportedLabProject(
  rawJson: string
): { valid: true; project: LabCircuitProject } | { valid: false; error: string } {
  try {
    const parsed = JSON.parse(rawJson);
    const candidate = parsed?.project ?? parsed;
    if (!candidate || typeof candidate !== 'object') {
      return { valid: false, error: 'Missing project object' };
    }
    if (typeof candidate.name !== 'string' || !candidate.name.trim()) {
      return { valid: false, error: 'Project name is required' };
    }
    if (!Array.isArray(candidate.components) || !Array.isArray(candidate.wires)) {
      return { valid: false, error: 'Invalid components or wires array' };
    }

    const components: LabComponentInstance[] = [];
    for (const c of candidate.components) {
      if (
        !c ||
        typeof c.id !== 'string' ||
        typeof c.type !== 'string' ||
        !VALID_TYPES.has(c.type) ||
        typeof c.x !== 'number' ||
        typeof c.y !== 'number'
      ) {
        return { valid: false, error: `Invalid component entry (${c?.type ?? 'unknown'})` };
      }
      components.push({
        id: c.id,
        type: c.type,
        label: typeof c.label === 'string' ? c.label : c.type.toUpperCase(),
        x: c.x,
        y: c.y,
        rotation:
          c.rotation === 90 || c.rotation === 180 || c.rotation === 270 ? c.rotation : 0,
        props: c.props && typeof c.props === 'object' ? { ...c.props } : {},
      });
    }

    const compIds = new Set(components.map((c) => c.id));
    const wires: LabWire[] = [];
    for (const w of candidate.wires) {
      if (
        !w ||
        typeof w.id !== 'string' ||
        typeof w.fromCompId !== 'string' ||
        typeof w.fromPinId !== 'string' ||
        typeof w.toCompId !== 'string' ||
        typeof w.toPinId !== 'string' ||
        !compIds.has(w.fromCompId) ||
        !compIds.has(w.toCompId)
      ) {
        return { valid: false, error: 'Invalid or dangling wire reference' };
      }
      wires.push({
        id: w.id,
        fromCompId: w.fromCompId,
        fromPinId: w.fromPinId,
        toCompId: w.toCompId,
        toPinId: w.toPinId,
        color: typeof w.color === 'string' ? w.color : undefined,
      });
    }

    const ladderRungs: LabLadderRung[] = Array.isArray(candidate.ladderRungs)
      ? candidate.ladderRungs.filter(
          (r: unknown): r is LabLadderRung =>
            Boolean(r) &&
            typeof (r as LabLadderRung).id === 'string' &&
            typeof (r as LabLadderRung).input1 === 'string' &&
            ((r as LabLadderRung).coil === 'Q1' || (r as LabLadderRung).coil === 'Q2')
        )
      : [];

    return {
      valid: true,
      project: {
        id: typeof candidate.id === 'string' ? candidate.id : `proj-${Date.now().toString(36)}`,
        name: candidate.name.trim().slice(0, 80),
        description:
          typeof candidate.description === 'string' ? candidate.description : undefined,
        updatedAt: Date.now(),
        components,
        wires,
        ladderRungs,
      },
    };
  } catch {
    return { valid: false, error: 'Malformed JSON file' };
  }
}
