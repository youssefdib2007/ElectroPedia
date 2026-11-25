import {
  Award,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Download,
  HardDrive,
  Heart,
  History,
  Layers,
  RotateCcw,
  Trash2,
  Upload,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { COMPONENT_CATEGORIES, ELECTRONIC_COMPONENTS } from '../data/componentsData';
import { useI18n } from '../i18n/I18nContext';
import type {
  FlashcardProgressMap,
  LearningActivityEntry,
  QuizResultSummary,
} from '../types/electronics';
import { computeRealProgressStats } from '../utils/progressEngine';
import {
  exportAllStudyData,
  importAllStudyData,
  loadFlashcardProgress,
  loadLearningLog,
  loadQuizHistory,
  loadStudiedComponents,
  resetAllStudyData,
  validateImportedStudyData,
} from '../utils/storage';

interface ProgressPageProps {
  savedIds: string[];
  onDataChanged: () => void;
  onOpenQuizzes: () => void;
  onOpenFlashcards: () => void;
}

export function ProgressPage({
  savedIds,
  onDataChanged,
  onOpenQuizzes,
  onOpenFlashcards,
}: ProgressPageProps) {
  const { locale, t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [studiedIds, setStudiedIds] = useState<string[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizResultSummary[]>([]);
  const [flashcardProgress, setFlashcardProgress] = useState<FlashcardProgressMap>({});
  const [learningLog, setLearningLog] = useState<LearningActivityEntry[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const loadSnapshot = useCallback(async () => {
    const [studied, quizzes, cards, log] = await Promise.all([
      loadStudiedComponents(),
      loadQuizHistory(),
      loadFlashcardProgress(),
      loadLearningLog(),
    ]);
    setStudiedIds(studied);
    setQuizHistory(quizzes);
    setFlashcardProgress(cards);
    setLearningLog(log);
  }, []);

  useEffect(() => {
    void loadSnapshot();
  }, [loadSnapshot]);

  const stats = useMemo(
    () =>
      computeRealProgressStats(
        ELECTRONIC_COMPONENTS,
        studiedIds,
        quizHistory,
        flashcardProgress,
        savedIds
      ),
    [studiedIds, quizHistory, flashcardProgress, savedIds]
  );

  const handleExport = async () => {
    const data = await exportAllStudyData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `electropedia-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rawText = await file.text();
      const parsed = JSON.parse(rawText);
      const validated = validateImportedStudyData(parsed);
      if (!validated) {
        setStatusMessage({ type: 'error', text: t.progress.importError });
        return;
      }
      await importAllStudyData(validated);
      await loadSnapshot();
      onDataChanged();
      setStatusMessage({ type: 'success', text: t.progress.importSuccess });
    } catch {
      setStatusMessage({ type: 'error', text: t.progress.importError });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmReset = async () => {
    await resetAllStudyData();
    await loadSnapshot();
    onDataChanged();
    setConfirmResetOpen(false);
    setStatusMessage({ type: 'success', text: t.progress.resetSuccess });
  };

  const recentQuizzes = useMemo(() => [...quizHistory].slice(0, 8).reverse(), [quizHistory]);

  return (
    <section
      data-testid="page-progress"
      className="bg-[#F8FAFC] dark:bg-[#0F172A] py-10 lg:py-14 min-h-[75vh]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider">
              <BarChart3 className="w-4 h-4" aria-hidden="true" />
              <span>{t.progress.eyebrow}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
              {t.progress.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.progress.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenQuizzes}
              className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold cursor-pointer"
            >
              {t.progress.openQuizBtn}
            </button>
            <button
              type="button"
              onClick={onOpenFlashcards}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 hover:border-[#2563EB] text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-semibold cursor-pointer"
            >
              {t.progress.openFlashcardsBtn}
            </button>
          </div>
        </div>

        {/* Device-only storage notice */}
        <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-5 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 dark:bg-[#00BFFF]/15 text-[#2563EB] dark:text-[#00BFFF] flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {t.progress.deviceNoticeTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {t.progress.deviceNoticeDesc}
            </p>
          </div>
        </Card>

        {statusMessage && (
          <div
            role="status"
            data-testid="progress-status-banner"
            className={`rounded-xl border px-4 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Real KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>{t.progress.kpiStudied}</span>
              <BookOpenCheck className="w-4 h-4 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
            </div>
            <p data-testid="kpi-studied-count" className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.studiedComponentsCount}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-tech">
              {t.progress.kpiStudiedSub.replace('{total}', String(stats.totalComponents))} · {stats.studiedPercentage}%
            </p>
          </Card>

          <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>{t.progress.kpiQuizzes}</span>
              <Award className="w-4 h-4 text-[#22C55E]" aria-hidden="true" />
            </div>
            <p data-testid="kpi-quizzes-count" className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.completedQuizzesCount}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-tech">
              {t.progress.kpiAvgScore} {stats.averageQuizScore}%
            </p>
          </Card>

          <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>{t.progress.kpiSavedCards}</span>
              <Layers className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
            </div>
            <p data-testid="kpi-saved-cards" className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.savedFlashcardsCount}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-tech">
              {t.progress.kpiReviewCards} {stats.flashcardsNeedingReviewCount}
            </p>
          </Card>

          <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>{t.progress.kpiFavorites}</span>
              <Heart className="w-4 h-4 text-[#EF4444]" aria-hidden="true" />
            </div>
            <p data-testid="kpi-favorites-count" className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.savedFavoritesCount}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-tech">
              {t.progress.masteredLabel} {stats.flashcardsReviewedCount}
            </p>
          </Card>
        </div>

        {/* Category & Difficulty Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-7 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {t.progress.categoryChartTitle}
            </h2>
            <div className="space-y-3.5">
              {stats.categoryProgress.map((item) => {
                const catLabel =
                  COMPONENT_CATEGORIES.find((c) => c.id === item.category)?.label[locale] ?? item.category;
                return (
                  <div key={item.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{catLabel}</span>
                      <span className="font-mono-tech text-xs text-slate-500 dark:text-slate-400" dir="ltr">
                        {item.studiedCount}/{item.totalComponents} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 dark:bg-[#0F172A] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#2563EB] dark:bg-[#00BFFF] transition-[width] duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="lg:col-span-5 space-y-6">
            {/* Difficulty Progress */}
            <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {t.progress.difficultyChartTitle}
              </h2>
              <div className="space-y-4">
                {stats.difficultyProgress.map((row) => {
                  const barTone =
                    row.difficulty === 'beginner'
                      ? 'bg-[#22C55E]'
                      : row.difficulty === 'intermediate'
                        ? 'bg-[#F59E0B]'
                        : 'bg-[#EF4444]';
                  return (
                    <div key={row.difficulty} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                          {t.difficulty[row.difficulty]}
                        </span>
                        <span className="font-mono-tech text-xs text-slate-500 dark:text-slate-400" dir="ltr">
                          {row.studiedCount}/{row.totalComponents} ({row.percentage}%)
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-100 dark:bg-[#0F172A] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barTone} transition-[width] duration-300`}
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Recent Quiz Trend SVG */}
            <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {t.progress.quizTrendTitle}
              </h2>
              {recentQuizzes.length === 0 ? (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t.progress.quizTrendEmpty}
                </p>
              ) : (
                <div dir="ltr" className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                  <svg viewBox="0 0 320 120" className="w-full h-28" aria-label={t.progress.quizTrendTitle}>
                    <line x1="16" y1="96" x2="304" y2="96" stroke="var(--schematic-muted)" strokeWidth="1" />
                    {recentQuizzes.map((q, idx) => {
                      const colWidth = 280 / recentQuizzes.length;
                      const barW = Math.min(24, colWidth * 0.6);
                      const x = 20 + idx * colWidth + (colWidth - barW) / 2;
                      const barH = Math.max(4, (q.percentage / 100) * 76);
                      const y = 96 - barH;
                      return (
                        <g key={q.id}>
                          <rect
                            x={x}
                            y={y}
                            width={barW}
                            height={barH}
                            rx="3"
                            fill={q.percentage >= 70 ? '#22C55E' : '#2563EB'}
                          />
                          <text
                            x={x + barW / 2}
                            y={y - 4}
                            textAnchor="middle"
                            fontSize="9"
                            fontFamily="monospace"
                            fill="var(--schematic-ink)"
                          >
                            {q.percentage}%
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Learning Log + Export / Import / Reset */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
              <span>{t.progress.logTitle}</span>
            </h2>
            {learningLog.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.progress.logEmpty}
              </p>
            ) : (
              <ul className="space-y-2.5 max-h-72 overflow-y-auto pe-1">
                {learningLog.slice(0, 15).map((entry) => (
                  <li
                    key={entry.id}
                    className="rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {entry.label[locale]}
                    </span>
                    <span dir="ltr" className="font-mono-tech text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                      {new Date(entry.timestamp).toLocaleDateString(
                        locale === 'ar' ? 'ar-LB' : locale === 'fr' ? 'fr-FR' : 'en-US'
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="lg:col-span-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {t.progress.dataManagementTitle}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.progress.dataManagementDesc}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                data-testid="progress-export-btn"
                onClick={() => void handleExport()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>{t.progress.exportBtn}</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={(e) => void handleImportFile(e)}
                className="hidden"
                data-testid="progress-import-input"
              />
              <button
                type="button"
                data-testid="progress-import-btn"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 hover:border-[#2563EB] text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" aria-hidden="true" />
                <span>{t.progress.importBtn}</span>
              </button>

              <button
                type="button"
                data-testid="progress-reset-btn"
                onClick={() => setConfirmResetOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-[#EF4444]/40 text-[#EF4444] hover:bg-rose-50 dark:hover:bg-[#EF4444]/10 text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
                <span>{t.progress.resetBtn}</span>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog for Resetting All Data */}
      {confirmResetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
          className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4"
        >
          <Card className="w-full max-w-md bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#EF4444]">
              <RotateCcw className="w-5 h-5" aria-hidden="true" />
              <h2 id="reset-modal-title" className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {t.progress.resetModalTitle}
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.progress.resetModalDesc}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                data-testid="progress-reset-cancel"
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                {t.progress.resetCancelBtn}
              </button>
              <button
                type="button"
                data-testid="progress-reset-confirm"
                onClick={() => void handleConfirmReset()}
                className="px-4 py-2 rounded-lg bg-[#EF4444] hover:bg-rose-600 text-white text-xs sm:text-sm font-semibold cursor-pointer"
              >
                {t.progress.resetConfirmBtn}
              </button>
            </div>
          </Card>
        </div>
      )}
    </section>
  );
}
