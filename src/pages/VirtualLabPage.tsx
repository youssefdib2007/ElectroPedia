import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { LabCanvas } from '../components/lab/LabCanvas';
import { LabComponentPalette } from '../components/lab/LabComponentPalette';
import {
  LabClearConfirmModal,
  LabLadderModal,
  LabProjectsModal,
  LabTemplatesModal,
} from '../components/lab/LabModals';
import { LabRightPanel } from '../components/lab/LabRightPanel';
import { LabToolbar } from '../components/lab/LabToolbar';
import { LAB_CIRCUIT_TEMPLATES } from '../data/labTemplates';
import { MESSAGES } from '../i18n/messages';
import type {
  LabCircuitProject,
  LabCircuitTemplate,
  LabComponentInstance,
  LabComponentProps,
  LabComponentType,
  LabLadderRung,
  LabSimulationResult,
  LabWire,
  Locale,
} from '../types/electronics';
import {
  createInitialPersistentSimState,
  createLabComponent,
  duplicateLabSelection,
  nextLabId,
  removeComponentsAndWires,
  rotateLabComponents,
  simulateLabCircuit,
  type LabPersistentSimState,
} from '../utils/labEngine';
import {
  deleteLabProject,
  exportLabProjectJson,
  getActiveLabProjectId,
  listLabProjects,
  saveLabProject,
  setActiveLabProjectId,
  validateImportedLabProject,
} from '../utils/labStorage';
import type { SimWorkerRequest, SimWorkerResponse } from '../workers/simWorker';

interface VirtualLabPageProps {
  locale: Locale;
  onInspectEncyclopediaComponent?: (componentId: string) => void;
}

function buildStarterProject(): LabCircuitProject {
  const tpl = LAB_CIRCUIT_TEMPLATES[0];
  return {
    id: 'proj-starter-battery-lamp',
    name: tpl.title.en,
    description: tpl.objective.en,
    updatedAt: Date.now(),
    components: tpl.components.map((c) => ({ ...c, props: { ...c.props } })),
    wires: tpl.wires.map((w) => ({ ...w })),
    ladderRungs: tpl.ladderRungs ? tpl.ladderRungs.map((r) => ({ ...r })) : [],
  };
}

export const VirtualLabPage: React.FC<VirtualLabPageProps> = ({
  locale,
  onInspectEncyclopediaComponent,
}) => {
  const t = MESSAGES[locale].labWorkspace;

  const [projects, setProjects] = useState<LabCircuitProject[]>(() => [
    buildStarterProject(),
  ]);
  const [project, setProject] = useState<LabCircuitProject>(() =>
    buildStarterProject()
  );
  const [past, setPast] = useState<LabCircuitProject[]>([]);
  const [future, setFuture] = useState<LabCircuitProject[]>([]);

  const [selectedCompIds, setSelectedCompIds] = useState<string[]>([]);
  const [selectedWireIds, setSelectedWireIds] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<{
    components: LabComponentInstance[];
    wires: LabWire[];
  } | null>(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 30, y: 20 });
  const [showGrid, setShowGrid] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [rightTab, setRightTab] = useState<'properties' | 'results' | 'instruments'>('properties');

  const [simStatus, setSimStatus] = useState<'stopped' | 'running' | 'paused'>('stopped');
  const [simSpeed, setSimSpeed] = useState(1);
  const [simResult, setSimResult] = useState<LabSimulationResult | null>(null);
  const simStateRef = useRef<LabPersistentSimState>(createInitialPersistentSimState());

  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [ladderOpen, setLadderOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    tone: 'info' | 'error';
  } | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const workerReqIdRef = useRef(0);
  const projectRef = useRef(project);
  projectRef.current = project;

  // Load saved IndexedDB projects on mount
  useEffect(() => {
    let mounted = true;
    listLabProjects().then(async (saved) => {
      if (!mounted) return;
      if (saved.length > 0) {
        setProjects(saved);
        const activeId = getActiveLabProjectId();
        const found = saved.find((p) => p.id === activeId) ?? saved[0];
        setProject(found);
        setActiveLabProjectId(found.id);
      } else {
        const starter = buildStarterProject();
        await saveLabProject(starter);
        setProjects([starter]);
        setProject(starter);
        setActiveLabProjectId(starter.id);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Initialize Simulation Web Worker
  useEffect(() => {
    try {
      const worker = new Worker(
        new URL('../workers/simWorker.ts', import.meta.url),
        { type: 'module' }
      );
      worker.onmessage = (ev: MessageEvent<SimWorkerResponse>) => {
        simStateRef.current = ev.data.nextState;
        setSimResult(ev.data.result);
      };
      worker.onerror = () => {
        worker.terminate();
        workerRef.current = null;
        const { result, nextState } = simulateLabCircuit(
          projectRef.current,
          simStateRef.current,
          0
        );
        simStateRef.current = nextState;
        setSimResult(result);
      };
      workerRef.current = worker;
      return () => {
        worker.terminate();
        workerRef.current = null;
      };
    } catch {
      workerRef.current = null;
    }
  }, []);

  const executeSimStep = useCallback((proj: LabCircuitProject, dt: number) => {
    const worker = workerRef.current;
    if (worker) {
      workerReqIdRef.current += 1;
      const req: SimWorkerRequest = {
        requestId: workerReqIdRef.current,
        project: proj,
        simState: simStateRef.current,
        dt,
      };
      worker.postMessage(req);
    } else {
      const { result, nextState } = simulateLabCircuit(
        proj,
        simStateRef.current,
        dt
      );
      simStateRef.current = nextState;
      setSimResult(result);
    }
  }, []);

  const hasDynamicComponents = useMemo(
    () =>
      project.components.some(
        (c) =>
          c.type === 'capacitor' ||
          c.type === 'inductor' ||
          c.type === 'timer' ||
          c.type === 'thermal-overload' ||
          c.type === 'plc-unit'
      ),
    [project.components]
  );

  // Simulation run loop: immediate solve on start/edit; 250ms transient step for dynamic components
  useEffect(() => {
    if (simStatus !== 'running') return;
    executeSimStep(projectRef.current, 0);
    if (!hasDynamicComponents) return;
    const id = window.setInterval(() => {
      executeSimStep(projectRef.current, 0.25 * simSpeed);
    }, 250);
    return () => window.clearInterval(id);
  }, [simStatus, simSpeed, hasDynamicComponents, executeSimStep]);

  // Re-evaluate immediately when circuit changes while running
  useEffect(() => {
    if (simStatus === 'running') {
      executeSimStep(project, 0);
    }
  }, [project, simStatus, executeSimStep]);

  // Auto-save active project to IndexedDB (debounced)
  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveLabProject(project).then(() => {
        setProjects((prev) => {
          const exists = prev.some((p) => p.id === project.id);
          return exists
            ? prev.map((p) => (p.id === project.id ? project : p))
            : [project, ...prev];
        });
      });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [project]);

  const showToast = useCallback((text: string, tone: 'info' | 'error' = 'info') => {
    setToastMessage({ text, tone });
    window.setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const commitProject = useCallback(
    (updater: (prev: LabCircuitProject) => LabCircuitProject, recordHistory = true) => {
      setProject((prev) => {
        const next = updater(prev);
        if (recordHistory) {
          setPast((h) => [...h.slice(-39), prev]);
          setFuture([]);
        }
        return next;
      });
    },
    []
  );

  const handleUndo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [project, ...f]);
    setProject(previous);
  }, [past, project]);

  const handleRedo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, project]);
    setProject(next);
  }, [future, project]);

  const handleDeleteSelection = useCallback(() => {
    if (selectedCompIds.length === 0 && selectedWireIds.length === 0) return;
    commitProject((prev) =>
      removeComponentsAndWires(prev, selectedCompIds, selectedWireIds)
    );
    setSelectedCompIds([]);
    setSelectedWireIds([]);
  }, [commitProject, selectedCompIds, selectedWireIds]);

  const handleRotateSelection = useCallback(() => {
    if (selectedCompIds.length === 0) return;
    commitProject((prev) => rotateLabComponents(prev, selectedCompIds, 90));
  }, [commitProject, selectedCompIds]);

  const handleCopySelection = useCallback(() => {
    if (selectedCompIds.length === 0) return;
    const idSet = new Set(selectedCompIds);
    const comps = project.components
      .filter((c) => idSet.has(c.id))
      .map((c) => ({ ...c, props: { ...c.props } }));
    const wires = project.wires
      .filter((w) => idSet.has(w.fromCompId) && idSet.has(w.toCompId))
      .map((w) => ({ ...w }));
    setClipboard({ components: comps, wires });
  }, [project, selectedCompIds]);

  const handlePasteClipboard = useCallback(() => {
    if (!clipboard || clipboard.components.length === 0) return;
    const idMap = new Map<string, string>();
    const newComps = clipboard.components.map((c) => {
      const nid = nextLabId('cmp');
      idMap.set(c.id, nid);
      return {
        ...c,
        id: nid,
        label: `${c.label}_copy`,
        x: c.x + 40,
        y: c.y + 40,
        props: { ...c.props },
      };
    });
    const newWires = clipboard.wires
      .map((w) => {
        const nf = idMap.get(w.fromCompId);
        const nt = idMap.get(w.toCompId);
        if (!nf || !nt) return null;
        return { ...w, id: nextLabId('wire'), fromCompId: nf, toCompId: nt };
      })
      .filter((w): w is LabWire => w !== null);

    commitProject((prev) => ({
      ...prev,
      updatedAt: Date.now(),
      components: [...prev.components, ...newComps],
      wires: [...prev.wires, ...newWires],
    }));
    setSelectedCompIds(newComps.map((c) => c.id));
    setSelectedWireIds([]);
  }, [clipboard, commitProject]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopySelection();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        handlePasteClipboard();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handleDeleteSelection();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleRotateSelection();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    handleCopySelection,
    handleDeleteSelection,
    handlePasteClipboard,
    handleRedo,
    handleRotateSelection,
    handleUndo,
  ]);

  const handleAddOrDropComponent = useCallback(
    (type: LabComponentType, worldX?: number, worldY?: number) => {
      const count = project.components.filter((c) => c.type === type).length;
      const x = worldX ?? 240 + (project.components.length % 5) * 60;
      const y = worldY ?? 180 + Math.floor(project.components.length / 5) * 60;
      const comp = createLabComponent(type, x, y, count);
      commitProject((prev) => ({
        ...prev,
        updatedAt: Date.now(),
        components: [...prev.components, comp],
      }));
      setSelectedCompIds([comp.id]);
      setSelectedWireIds([]);
      setRightTab('properties');
    },
    [commitProject, project.components]
  );

  const handleMoveComponents = useCallback(
    (updates: Record<string, { x: number; y: number }>, commitHistory: boolean) => {
      if (commitHistory) {
        commitProject(
          (prev) => ({
            ...prev,
            updatedAt: Date.now(),
            components: prev.components.map((c) =>
              updates[c.id] ? { ...c, x: updates[c.id].x, y: updates[c.id].y } : c
            ),
          }),
          true
        );
      } else {
        setProject((prev) => ({
          ...prev,
          components: prev.components.map((c) =>
            updates[c.id] ? { ...c, x: updates[c.id].x, y: updates[c.id].y } : c
          ),
        }));
      }
    },
    [commitProject]
  );

  const handleCreateWire = useCallback(
    (fromCompId: string, fromPinId: string, toCompId: string, toPinId: string) => {
      const duplicate = project.wires.some(
        (w) =>
          (w.fromCompId === fromCompId &&
            w.fromPinId === fromPinId &&
            w.toCompId === toCompId &&
            w.toPinId === toPinId) ||
          (w.fromCompId === toCompId &&
            w.fromPinId === toPinId &&
            w.toCompId === fromCompId &&
            w.toPinId === fromPinId)
      );
      if (duplicate) return;

      const wire: LabWire = {
        id: nextLabId('wire'),
        fromCompId,
        fromPinId,
        toCompId,
        toPinId,
      };
      commitProject((prev) => ({
        ...prev,
        updatedAt: Date.now(),
        wires: [...prev.wires, wire],
      }));
      setSelectedWireIds([wire.id]);
      setSelectedCompIds([]);
    },
    [commitProject, project.wires]
  );

  const handleUpdateComponent = useCallback(
    (
      compId: string,
      patch: { label?: string; rotation?: 0 | 90 | 180 | 270; props?: Partial<LabComponentProps> }
    ) => {
      commitProject((prev) => ({
        ...prev,
        updatedAt: Date.now(),
        components: prev.components.map((c) => {
          if (c.id !== compId) return c;
          return {
            ...c,
            label: patch.label ?? c.label,
            rotation: patch.rotation ?? c.rotation,
            props: patch.props ? { ...c.props, ...patch.props } : c.props,
          };
        }),
      }));
    },
    [commitProject]
  );

  const handleToggleInteractive = useCallback(
    (compId: string) => {
      commitProject((prev) => ({
        ...prev,
        updatedAt: Date.now(),
        components: prev.components.map((c) =>
          c.id === compId ? { ...c, props: { ...c.props, closed: !c.props.closed } } : c
        ),
      }));
    },
    [commitProject]
  );

  const handleFitCanvas = useCallback(() => {
    if (project.components.length === 0) {
      setZoom(1);
      setPan({ x: 30, y: 20 });
      return;
    }
    const minX = Math.min(...project.components.map((c) => c.x)) - 80;
    const minY = Math.min(...project.components.map((c) => c.y)) - 80;
    setZoom(1);
    setPan({ x: Math.max(-200, 40 - minX), y: Math.max(-200, 40 - minY) });
  }, [project.components]);

  const handleLoadTemplate = useCallback(
    (tpl: LabCircuitTemplate) => {
      simStateRef.current = createInitialPersistentSimState();
      setSimStatus('stopped');
      setSimResult(null);
      const nextProj: LabCircuitProject = {
        id: nextLabId('proj'),
        name: tpl.title[locale],
        description: tpl.objective[locale],
        updatedAt: Date.now(),
        components: tpl.components.map((c) => ({ ...c, props: { ...c.props } })),
        wires: tpl.wires.map((w) => ({ ...w })),
        ladderRungs: tpl.ladderRungs ? tpl.ladderRungs.map((r) => ({ ...r })) : [],
      };
      setPast([]);
      setFuture([]);
      setProject(nextProj);
      setActiveLabProjectId(nextProj.id);
      setSelectedCompIds([]);
      setSelectedWireIds([]);
      setPan({ x: 30, y: 20 });
      setZoom(1);
    },
    [locale]
  );

  const handleResetSimulation = useCallback(() => {
    simStateRef.current = createInitialPersistentSimState();
    setSimResult(null);
    if (simStatus === 'running') {
      executeSimStep(projectRef.current, 0);
    }
  }, [executeSimStep, simStatus]);

  const handleStopSimulation = useCallback(() => {
    setSimStatus('stopped');
    simStateRef.current = createInitialPersistentSimState();
    setSimResult(null);
  }, []);

  const handleExportJson = useCallback(() => {
    const content = exportLabProjectJson(project);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/[^a-zA-Z0-9_-]+/g, '_').toLowerCase() || 'circuit'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [project]);

  const handleImportJsonFile = useCallback(
    async (file: File) => {
      const text = await file.text();
      const validated = validateImportedLabProject(text);
      if (!validated.valid) {
        showToast(validated.error, 'error');
        return;
      }
      const imported: LabCircuitProject = {
        ...validated.project,
        id: nextLabId('proj'),
      };
      simStateRef.current = createInitialPersistentSimState();
      setSimStatus('stopped');
      setSimResult(null);
      setProject(imported);
      setActiveLabProjectId(imported.id);
      await saveLabProject(imported);
      showToast(`Imported "${imported.name}"`, 'info');
    },
    [showToast]
  );

  const selectedComponent = useMemo(() => {
    if (selectedCompIds.length !== 1) return null;
    return project.components.find((c) => c.id === selectedCompIds[0]) ?? null;
  }, [project.components, selectedCompIds]);

  return (
    <main className="mx-auto max-w-[1440px] px-3 sm:px-6 py-5 space-y-4">
      {/* Page Header & Educational Safety Disclaimer */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-sky-400">
            {t.eyebrow}
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {t.title}
          </h1>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/90 dark:bg-amber-950/30 px-3.5 py-2 text-xs text-amber-800 dark:text-amber-200 max-w-2xl">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <span>{t.safetyBanner}</span>
        </div>
      </div>

      {toastMessage && (
        <div
          className={`rounded-xl border px-4 py-2.5 text-xs font-semibold ${
            toastMessage.tone === 'error'
              ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
              : 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
          }`}
        >
          {toastMessage.text}
        </div>
      )}

      {/* CAD & Simulation Toolbar */}
      <LabToolbar
        t={t}
        projectName={project.name}
        onProjectNameChange={(name) =>
          commitProject((prev) => ({ ...prev, name, updatedAt: Date.now() }), false)
        }
        simStatus={simStatus}
        simSpeed={simSpeed}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        hasSelection={selectedCompIds.length > 0 || selectedWireIds.length > 0}
        hasClipboard={Boolean(clipboard && clipboard.components.length > 0)}
        showGrid={showGrid}
        snapEnabled={snapEnabled}
        onStart={() => setSimStatus('running')}
        onPause={() => setSimStatus('paused')}
        onStop={handleStopSimulation}
        onResetSim={handleResetSimulation}
        onSpeedChange={setSimSpeed}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onCopy={handleCopySelection}
        onPaste={handlePasteClipboard}
        onRotate={handleRotateSelection}
        onDelete={handleDeleteSelection}
        onToggleGrid={() => setShowGrid((g) => !g)}
        onToggleSnap={() => setSnapEnabled((s) => !s)}
        onZoomIn={() => setZoom((z) => Math.min(2.2, Number((z + 0.15).toFixed(2))))}
        onZoomOut={() => setZoom((z) => Math.max(0.35, Number((z - 0.15).toFixed(2))))}
        onFit={handleFitCanvas}
        onOpenTemplates={() => setTemplatesOpen(true)}
        onOpenProjects={() => setProjectsOpen(true)}
        onOpenLadder={() => setLadderOpen(true)}
        onExportJson={handleExportJson}
        onImportJsonFile={handleImportJsonFile}
        onRequestClear={() => setClearConfirmOpen(true)}
      />

      {/* 3-Column Lab Workspace */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch">
        <LabComponentPalette
          locale={locale}
          title={t.paletteTitle}
          searchPlaceholder={t.searchComponents}
          allLabel={t.allCategories}
          onAddComponent={(type) => handleAddOrDropComponent(type)}
          onOpenEncyclopedia={onInspectEncyclopediaComponent}
        />

        <LabCanvas
          components={project.components}
          wires={project.wires}
          simResult={simResult}
          isRunning={simStatus !== 'stopped'}
          selectedCompIds={selectedCompIds}
          selectedWireIds={selectedWireIds}
          zoom={zoom}
          pan={pan}
          showGrid={showGrid}
          snapEnabled={snapEnabled}
          wiringHintText={t.wiringHint}
          cancelWireText={t.cancelWire}
          canvasHintText={t.canvasHint}
          onSelect={(cIds, wIds) => {
            setSelectedCompIds(cIds);
            setSelectedWireIds(wIds);
          }}
          onMoveComponents={handleMoveComponents}
          onDropNewComponent={(type, x, y) => handleAddOrDropComponent(type, x, y)}
          onCreateWire={handleCreateWire}
          onToggleInteractive={handleToggleInteractive}
          onZoomChange={setZoom}
          onPanChange={setPan}
        />

        <LabRightPanel
          locale={locale}
          t={t}
          activeTab={rightTab}
          onTabChange={setRightTab}
          selectedComponent={selectedComponent}
          components={project.components}
          simResult={simResult}
          isRunning={simStatus !== 'stopped'}
          onUpdateComponent={handleUpdateComponent}
          onOpenEncyclopedia={onInspectEncyclopediaComponent}
        />
      </div>

      {/* Status Bar */}
      <footer className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
        <div className="flex flex-wrap items-center gap-4">
          <span
            data-testid="lab-status-indicator"
            className={`font-bold ${
              simStatus === 'running'
                ? 'text-emerald-600 dark:text-emerald-400'
                : simStatus === 'paused'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-500'
            }`}
          >
            {simStatus === 'running'
              ? t.statusRunning
              : simStatus === 'paused'
              ? t.statusPaused
              : t.statusStopped}
          </span>
          <span>
            {t.statusComponents}: <strong>{project.components.length}</strong>
          </span>
          <span>
            {t.statusWires}: <strong>{project.wires.length}</strong>
          </span>
          <span>
            {t.statusTime}:{' '}
            <strong>{(simResult?.simTime ?? 0).toFixed(2)}s</strong>
          </span>
        </div>
        <div>
          {t.statusSelected}:{' '}
          <strong>
            {selectedComponent
              ? selectedComponent.label
              : selectedCompIds.length + selectedWireIds.length}
          </strong>
        </div>
      </footer>

      {/* Modals */}
      <LabTemplatesModal
        open={templatesOpen}
        locale={locale}
        onClose={() => setTemplatesOpen(false)}
        onLoadTemplate={handleLoadTemplate}
      />

      <LabProjectsModal
        open={projectsOpen}
        locale={locale}
        projects={projects}
        activeProjectId={project.id}
        onClose={() => setProjectsOpen(false)}
        onNewProject={() => {
          simStateRef.current = createInitialPersistentSimState();
          setSimStatus('stopped');
          setSimResult(null);
          const blank: LabCircuitProject = {
            id: nextLabId('proj'),
            name: locale === 'ar' ? 'مشروع جديد' : locale === 'fr' ? 'Nouveau circuit' : 'New Circuit',
            updatedAt: Date.now(),
            components: [],
            wires: [],
            ladderRungs: [],
          };
          setProject(blank);
          setActiveLabProjectId(blank.id);
          setPast([]);
          setFuture([]);
        }}
        onOpenProject={(proj) => {
          simStateRef.current = createInitialPersistentSimState();
          setSimStatus('stopped');
          setSimResult(null);
          setProject(proj);
          setActiveLabProjectId(proj.id);
          setPast([]);
          setFuture([]);
        }}
        onDuplicateProject={async (proj) => {
          const dup: LabCircuitProject = {
            ...duplicateLabSelection(proj, proj.components.map((c) => c.id), 0, 0).project,
            id: nextLabId('proj'),
            name: `${proj.name} (Copy)`,
            updatedAt: Date.now(),
          };
          await saveLabProject(dup);
          setProjects((prev) => [dup, ...prev]);
        }}
        onDeleteProject={async (projId) => {
          await deleteLabProject(projId);
          setProjects((prev) => {
            const next = prev.filter((p) => p.id !== projId);
            if (projId === project.id && next.length > 0) {
              setProject(next[0]);
              setActiveLabProjectId(next[0].id);
            }
            return next;
          });
        }}
      />

      <LabLadderModal
        open={ladderOpen}
        locale={locale}
        rungs={project.ladderRungs}
        plcInputs={simResult?.plcInputs ?? { I1: false, I2: false }}
        plcOutputs={simResult?.plcOutputs ?? { Q1: false, Q2: false }}
        onClose={() => setLadderOpen(false)}
        onChangeRungs={(nextRungs: LabLadderRung[]) =>
          commitProject((prev) => ({
            ...prev,
            updatedAt: Date.now(),
            ladderRungs: nextRungs,
          }))
        }
      />

      <LabClearConfirmModal
        open={clearConfirmOpen}
        t={t}
        onCancel={() => setClearConfirmOpen(false)}
        onConfirm={() => {
          setClearConfirmOpen(false);
          simStateRef.current = createInitialPersistentSimState();
          setSimStatus('stopped');
          setSimResult(null);
          commitProject((prev) => ({
            ...prev,
            updatedAt: Date.now(),
            components: [],
            wires: [],
          }));
          setSelectedCompIds([]);
          setSelectedWireIds([]);
        }}
      />
    </main>
  );
};
