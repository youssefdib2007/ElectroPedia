import React, { useRef } from 'react';
import {
  ClipboardPaste,
  Copy,
  Cpu,
  Download,
  FolderOpen,
  Grid3X3,
  Layers,
  Magnet,
  Maximize2,
  Pause,
  Play,
  Redo2,
  RotateCw,
  RotateCcw,
  Square,
  Trash2,
  Undo2,
  Upload,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { MessagesSchema } from '../../i18n/messages';

interface LabToolbarProps {
  t: MessagesSchema['labWorkspace'];
  projectName: string;
  onProjectNameChange: (name: string) => void;
  simStatus: 'stopped' | 'running' | 'paused';
  simSpeed: number;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
  hasClipboard: boolean;
  showGrid: boolean;
  snapEnabled: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onResetSim: () => void;
  onSpeedChange: (speed: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onRotate: () => void;
  onDelete: () => void;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onOpenTemplates: () => void;
  onOpenProjects: () => void;
  onOpenLadder: () => void;
  onExportJson: () => void;
  onImportJsonFile: (file: File) => void;
  onRequestClear: () => void;
}

export const LabToolbar: React.FC<LabToolbarProps> = ({
  t,
  projectName,
  onProjectNameChange,
  simStatus,
  simSpeed,
  canUndo,
  canRedo,
  hasSelection,
  hasClipboard,
  showGrid,
  snapEnabled,
  onStart,
  onPause,
  onStop,
  onResetSim,
  onSpeedChange,
  onUndo,
  onRedo,
  onCopy,
  onPaste,
  onRotate,
  onDelete,
  onToggleGrid,
  onToggleSnap,
  onZoomIn,
  onZoomOut,
  onFit,
  onOpenTemplates,
  onOpenProjects,
  onOpenLadder,
  onExportJson,
  onImportJsonFile,
  onRequestClear,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const btnCls =
    'inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition';

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 space-y-2 shadow-sm">
      {/* Row 1: Project + Modals + JSON */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            aria-label="Project Name"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            className="w-44 sm:w-56 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button type="button" data-testid="lab-btn-templates" onClick={onOpenTemplates} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-bold transition shadow-sm">
            <Layers className="w-3.5 h-3.5" />
            {t.templatesBtn}
          </button>

          <button type="button" data-testid="lab-btn-projects" onClick={onOpenProjects} className={btnCls}>
            <FolderOpen className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
            {t.projectsBtn}
          </button>

          <button type="button" data-testid="lab-btn-ladder" onClick={onOpenLadder} className={btnCls}>
            <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            {t.ladderBtn}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button type="button" onClick={onExportJson} className={btnCls}>
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.exportJsonBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={btnCls}
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.importJsonBtn}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onImportJsonFile(file);
                e.target.value = '';
              }
            }}
          />

          <button
            type="button"
            onClick={onRequestClear}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.clearBtn}</span>
          </button>
        </div>
      </div>

      {/* Row 2: Editor tools + Simulation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button type="button" data-testid="lab-btn-undo" title={t.undoBtn} disabled={!canUndo} onClick={onUndo} className={btnCls}>
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button type="button" data-testid="lab-btn-redo" title={t.redoBtn} disabled={!canRedo} onClick={onRedo} className={btnCls}>
            <Redo2 className="w-3.5 h-3.5" />
          </button>
          <button type="button" title={t.copyBtn} disabled={!hasSelection} onClick={onCopy} className={btnCls}>
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button type="button" title={t.pasteBtn} disabled={!hasClipboard} onClick={onPaste} className={btnCls}>
            <ClipboardPaste className="w-3.5 h-3.5" />
          </button>
          <button type="button" title={t.rotateBtn} disabled={!hasSelection} onClick={onRotate} className={btnCls}>
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{t.rotateBtn}</span>
          </button>
          <button
            type="button"
            title={t.deleteBtn}
            disabled={!hasSelection}
            onClick={onDelete}
            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-40 disabled:pointer-events-none transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <span className="h-5 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

          <button
            type="button"
            title={t.gridBtn}
            onClick={onToggleGrid}
            className={`${btnCls} ${showGrid ? 'border-blue-500 text-blue-600 dark:text-sky-400' : ''}`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title={t.snapBtn}
            onClick={onToggleSnap}
            className={`${btnCls} ${snapEnabled ? 'border-blue-500 text-blue-600 dark:text-sky-400' : ''}`}
          >
            <Magnet className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Zoom Out" onClick={onZoomOut} className={btnCls}>
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button type="button" title="Zoom In" onClick={onZoomIn} className={btnCls}>
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button type="button" title={t.fitBtn} onClick={onFit} className={btnCls}>
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{t.fitBtn}</span>
          </button>
        </div>

        {/* Simulation Playback Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          {simStatus !== 'running' ? (
            <button
              type="button"
              data-testid="lab-sim-start"
              onClick={onStart}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-sm transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {t.startSim}
            </button>
          ) : (
            <button
              type="button"
              data-testid="lab-sim-pause"
              onClick={onPause}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-1.5 text-xs font-bold shadow-sm transition"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              {t.pauseSim}
            </button>
          )}

          <button
            type="button"
            data-testid="lab-sim-stop"
            disabled={simStatus === 'stopped'}
            onClick={onStop}
            className={btnCls}
          >
            <Square className="w-3.5 h-3.5" />
            {t.stopSim}
          </button>

          <button
            type="button"
            data-testid="lab-sim-reset"
            onClick={onResetSim}
            className={btnCls}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t.resetSim}
          </button>

          <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 ms-1">
            <span>{t.speedLabel}:</span>
            <select
              value={simSpeed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-xs font-mono font-bold text-slate-900 dark:text-white"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={5}>5x</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};
