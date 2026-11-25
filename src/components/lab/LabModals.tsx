import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Cpu,
  FolderOpen,
  Layers,
  Plus,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';
import { LAB_CIRCUIT_TEMPLATES } from '../../data/labTemplates';
import type { MessagesSchema } from '../../i18n/messages';
import type {
  LabCircuitProject,
  LabCircuitTemplate,
  LabLadderRung,
  Locale,
} from '../../types/electronics';

/* ── 1. Templates Modal ── */
interface TemplatesModalProps {
  open: boolean;
  locale: Locale;
  onClose: () => void;
  onLoadTemplate: (template: LabCircuitTemplate) => void;
}

export const LabTemplatesModal: React.FC<TemplatesModalProps> = ({
  open,
  locale,
  onClose,
  onLoadTemplate,
}) => {
  const [cat, setCat] = useState<'all' | 'dc' | 'electronics' | 'industrial' | 'digital'>('all');
  const [selectedId, setSelectedId] = useState<string>(LAB_CIRCUIT_TEMPLATES[0].id);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  if (!open) return null;

  const list = LAB_CIRCUIT_TEMPLATES.filter((t) => cat === 'all' || t.category === cat);
  const active = list.find((t) => t.id === selectedId) ?? list[0] ?? LAB_CIRCUIT_TEMPLATES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-6">
      <div className="w-full max-w-4xl max-h-[88vh] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 dark:text-sky-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {locale === 'ar' ? 'مكتبة التجارب الجاهزة (11 تجربة)' : locale === 'fr' ? 'Modèles pédagogiques (11 circuits)' : 'Educational Circuit Templates (11)'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-0 overflow-hidden">
          {/* Template Sidebar */}
          <div className="md:col-span-5 border-e border-slate-200 dark:border-slate-800 overflow-y-auto p-3 space-y-2.5">
            <div className="flex flex-wrap gap-1">
              {(['all', 'dc', 'electronics', 'industrial', 'digital'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase ${
                    cat === c
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              {list.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  data-testid={`lab-tpl-${tpl.id}`}
                  onClick={() => setSelectedId(tpl.id)}
                  className={`w-full text-start rounded-xl border p-2.5 transition ${
                    active.id === tpl.id
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-sky-950/40'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {tpl.title[locale]}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {tpl.objective[locale]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Template Detail + Questions */}
          <div className="md:col-span-7 overflow-y-auto p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {active.title[locale]}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {active.objective[locale]}
              </p>
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 p-3 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                {active.theory[locale]}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                <div className="text-xs font-bold mb-1.5 text-slate-800 dark:text-slate-100">
                  {locale === 'ar' ? 'القطع المطلوبة' : locale === 'fr' ? 'Composants requis' : 'Required Parts'}
                </div>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 list-disc ps-4">
                  {active.requiredParts.map((part, idx) => (
                    <li key={idx}>{part[locale]}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                <div className="text-xs font-bold mb-1.5 text-slate-800 dark:text-slate-100">
                  {locale === 'ar' ? 'القيم المتوقعة' : locale === 'fr' ? 'Valeurs attendues' : 'Expected Values'}
                </div>
                <ul className="space-y-1 text-xs font-mono text-emerald-700 dark:text-emerald-400 list-disc ps-4">
                  {active.expectedValues.map((val, idx) => (
                    <li key={idx}>{val[locale]}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interactive Self-Check Question */}
            {active.questions.map((q) => {
              const chosen = answers[`${active.id}:${q.id}`];
              const answered = chosen !== undefined;
              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-blue-200 dark:border-sky-900 bg-blue-50/40 dark:bg-sky-950/20 p-3.5 space-y-2"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {q.prompt[locale]}
                  </div>
                  <div className="space-y-1.5">
                    {q.options.map((opt, idx) => {
                      const isCorrect = idx === q.correctIndex;
                      const isPicked = chosen === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [`${active.id}:${q.id}`]: idx,
                            }))
                          }
                          className={`w-full text-start rounded-lg border px-3 py-2 text-xs font-medium flex items-center justify-between transition ${
                            !answered
                              ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500'
                              : isCorrect
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                              : isPicked
                              ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                              : 'border-slate-200 dark:border-slate-800 opacity-70'
                          }`}
                        >
                          <span>{opt[locale]}</span>
                          {answered && isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                          {answered && !isCorrect && isPicked && <XCircle className="w-4 h-4 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {answered && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                      {q.explanation[locale]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold"
          >
            {locale === 'ar' ? 'إغلاق' : locale === 'fr' ? 'Fermer' : 'Close'}
          </button>
          <button
            type="button"
            data-testid="lab-load-template-btn"
            onClick={() => {
              onLoadTemplate(active);
              onClose();
            }}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold shadow-sm"
          >
            {locale === 'ar' ? 'تحميل الدائرة في المختبر' : locale === 'fr' ? 'Charger dans le laboratoire' : 'Load Circuit into Lab'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── 2. Projects Manager Modal ── */
interface ProjectsModalProps {
  open: boolean;
  locale: Locale;
  projects: LabCircuitProject[];
  activeProjectId: string;
  onClose: () => void;
  onNewProject: () => void;
  onOpenProject: (proj: LabCircuitProject) => void;
  onDuplicateProject: (proj: LabCircuitProject) => void;
  onDeleteProject: (projId: string) => void;
}

export const LabProjectsModal: React.FC<ProjectsModalProps> = ({
  open,
  locale,
  projects,
  activeProjectId,
  onClose,
  onNewProject,
  onOpenProject,
  onDuplicateProject,
  onDeleteProject,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-6">
      <div className="w-full max-w-xl max-h-[82vh] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-blue-600 dark:text-sky-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {locale === 'ar' ? 'مشاريع المختبر (IndexedDB)' : locale === 'fr' ? 'Projets enregistrés' : 'Saved Lab Projects (IndexedDB)'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {projects.map((p) => {
            const isActive = p.id === activeProjectId;
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between gap-2 rounded-xl border p-3 ${
                  isActive
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-sky-950/30'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    onOpenProject(p);
                    onClose();
                  }}
                  className="flex-1 text-start min-w-0"
                >
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {p.components.length} parts · {p.wires.length} wires ·{' '}
                    {new Date(p.updatedAt).toLocaleString()}
                  </div>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Duplicate"
                    onClick={() => onDuplicateProject(p)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {projects.length > 1 && (
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => onDeleteProject(p.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              onNewProject();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            {locale === 'ar' ? 'مشروع فارغ جديد' : locale === 'fr' ? 'Nouveau projet vierge' : 'New Blank Project'}
          </button>
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold">
            {locale === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── 3. PLC Ladder Editor Modal ── */
interface LadderModalProps {
  open: boolean;
  locale: Locale;
  rungs: LabLadderRung[];
  plcInputs: Record<string, boolean>;
  plcOutputs: Record<string, boolean>;
  onClose: () => void;
  onChangeRungs: (nextRungs: LabLadderRung[]) => void;
}

const CONTACT_OPTIONS = ['', 'I1', '!I1', 'I2', '!I2', 'Q1', '!Q1', 'Q2', '!Q2'];

export const LabLadderModal: React.FC<LadderModalProps> = ({
  open,
  locale,
  rungs,
  plcInputs,
  plcOutputs,
  onClose,
  onChangeRungs,
}) => {
  if (!open) return null;

  const updateRung = (idx: number, patch: Partial<LabLadderRung>) => {
    const next = rungs.map((r, i) => (i === idx ? { ...r, ...patch } : r));
    onChangeRungs(next);
  };

  const addRung = () => {
    onChangeRungs([
      ...rungs,
      {
        id: `rung-${Date.now().toString(36)}`,
        comment: 'New Logic Rung',
        input1: 'I1',
        coil: 'Q1',
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-3 sm:p-6">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              PLC Ladder Editor (I1/I2 → Q1/Q2)
            </h2>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto">
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {(['I1', 'I2'] as const).map((k) => (
              <span
                key={k}
                className={`px-2.5 py-1 rounded-md font-bold ${
                  plcInputs[k] ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {k}: {plcInputs[k] ? '1' : '0'}
              </span>
            ))}
            {(['Q1', 'Q2'] as const).map((k) => (
              <span
                key={k}
                className={`px-2.5 py-1 rounded-md font-bold ${
                  plcOutputs[k] ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {k}: {plcOutputs[k] ? '24V' : '0V'}
              </span>
            ))}
          </div>

          {rungs.map((r, idx) => (
            <div key={r.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-2 bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={r.comment}
                  onChange={(e) => updateRung(idx, { comment: e.target.value })}
                  className="flex-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-semibold"
                />
                <button
                  type="button"
                  onClick={() => onChangeRungs(rungs.filter((_, i) => i !== idx))}
                  className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
                <label className="space-y-1">
                  <span className="text-[10px] text-slate-500">Contact 1</span>
                  <select
                    value={r.input1}
                    onChange={(e) => updateRung(idx, { input1: e.target.value })}
                    className="w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1"
                  >
                    {CONTACT_OPTIONS.filter(Boolean).map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] text-slate-500">OR Latch</span>
                  <select
                    value={r.latchInput ?? ''}
                    onChange={(e) => updateRung(idx, { latchInput: e.target.value || undefined })}
                    className="w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1"
                  >
                    {CONTACT_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o || '(none)'}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] text-slate-500">AND Contact 2</span>
                  <select
                    value={r.input2 ?? ''}
                    onChange={(e) => updateRung(idx, { input2: e.target.value || undefined })}
                    className="w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1"
                  >
                    {CONTACT_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o || '(none)'}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] text-slate-500">TON (s)</span>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={r.timerDelaySec ?? 0}
                    onChange={(e) => updateRung(idx, { timerDelaySec: Number(e.target.value) || 0 })}
                    className="w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] text-slate-500">Output Coil</span>
                  <select
                    value={r.coil}
                    onChange={(e) => updateRung(idx, { coil: e.target.value as 'Q1' | 'Q2' })}
                    className="w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 font-bold"
                  >
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={addRung}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            {locale === 'ar' ? 'إضافة سطر Ladder' : 'Add Rung'}
          </button>
          <button type="button" onClick={onClose} className="rounded-lg bg-blue-600 text-white px-4 py-2 text-xs font-bold">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── 4. Clear Confirmation Dialog ── */
interface ClearModalProps {
  open: boolean;
  t: MessagesSchema['labWorkspace'];
  onCancel: () => void;
  onConfirm: () => void;
}

export const LabClearConfirmModal: React.FC<ClearModalProps> = ({
  open,
  t,
  onCancel,
  onConfirm,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-2xl">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {t.clearConfirmTitle}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {t.clearConfirmDesc}
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold"
          >
            {t.cancelBtn}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-xs font-bold"
          >
            {t.confirmBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
