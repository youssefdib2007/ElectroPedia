import {
  Award,
  BookOpen,
  Calculator,
  CheckCircle2,
  History,
  Image as ImageIcon,
  Languages,
  Play,
  RotateCcw,
  Settings2,
  ShieldAlert,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { COMPONENT_CATEGORIES, ELECTRONIC_COMPONENTS } from '../data/componentsData';
import { useI18n } from '../i18n/I18nContext';
import type {
  ComponentCategoryId,
  DifficultyLevel,
  QuizAnswerRecord,
  QuizConfig,
  QuizQuestionItem,
  QuizResultSummary,
  QuizTypeFilter,
  QuizUserAnswer,
} from '../types/electronics';
import { computeQuizStats, generateQuizQuestions, gradeQuizAnswer } from '../utils/quizEngine';
import {
  appendLearningLog,
  clearQuizHistory,
  loadQuizHistory,
  saveQuizResultToHistory,
} from '../utils/storage';
import { ComponentArtwork } from './ComponentArtwork';
import { OptimizedImage } from './OptimizedImage';
import { EmptyState } from './StateFeedback';

interface QuizEngineProps {
  onOpenFullPage?: () => void;
  showFullHeader?: boolean;
}

type QuizPhase = 'setup' | 'playing' | 'results';

const QUESTION_COUNTS = [5, 10, 15, 20];

const TYPE_FILTER_OPTIONS: QuizTypeFilter[] = [
  'all',
  'mcq',
  'mcq-photo',
  'mcq-symbol',
  'mcq-function',
  'true-false',
  'match-images',
  'match-trilingual',
  'mcq-calculation',
  'mcq-safety',
];

export function QuizEngine({ onOpenFullPage, showFullHeader = false }: QuizEngineProps) {
  const { locale, t } = useI18n();

  const [phase, setPhase] = useState<QuizPhase>('setup');
  const [config, setConfig] = useState<QuizConfig>({
    category: 'all',
    difficulty: 'all',
    questionCount: 10,
    questionType: 'all',
  });

  const [questions, setQuestions] = useState<QuizQuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [records, setRecords] = useState<QuizAnswerRecord[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<QuizAnswerRecord | null>(null);

  // Interactive matching states for active question
  const [activeImagePairId, setActiveImagePairId] = useState<string | null>(null);
  const [imageMapping, setImageMapping] = useState<Record<string, string>>({});
  const [trilingualMapping, setTrilingualMapping] = useState<
    Record<string, { first: string; second: string }>
  >({});

  // Local persistent quiz history
  const [history, setHistory] = useState<QuizResultSummary[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    loadQuizHistory().then((rows) => {
      if (!active) return;
      setHistory(rows);
      setHistoryLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const availablePoolCount = useMemo(
    () => generateQuizQuestions(ELECTRONIC_COMPONENTS, { ...config, questionCount: 500 }).length,
    [config]
  );

  const stats = useMemo(() => computeQuizStats(history), [history]);

  const currentQuestion = questions[currentIndex];
  const score = useMemo(() => records.filter((r) => r.isCorrect).length, [records]);

  const resetQuestionInputs = () => {
    setCurrentFeedback(null);
    setActiveImagePairId(null);
    setImageMapping({});
    setTrilingualMapping({});
  };

  const startNewQuiz = (overrideConfig?: QuizConfig) => {
    const activeConfig = overrideConfig ?? config;
    const generated = generateQuizQuestions(ELECTRONIC_COMPONENTS, activeConfig);
    if (generated.length === 0) return;

    setQuestions(generated);
    setCurrentIndex(0);
    setRecords([]);
    resetQuestionInputs();
    setPhase('playing');
  };

  const commitAnswer = (userAnswer: QuizUserAnswer) => {
    if (!currentQuestion || currentFeedback) return;
    const graded = gradeQuizAnswer(currentQuestion, userAnswer, locale);
    setCurrentFeedback(graded);
    setRecords((prev) => [...prev, graded]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      resetQuestionInputs();
    } else {
      const total = questions.length;
      const finalScore = records.filter((r) => r.isCorrect).length;
      const percentage = total > 0 ? Math.round((finalScore / total) * 100) : 0;

      const summary: QuizResultSummary = {
        id: `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        completedAt: new Date().toISOString(),
        score: finalScore,
        total,
        percentage,
        category: config.category,
        difficulty: config.difficulty,
        questionType: config.questionType,
      };

      void saveQuizResultToHistory(summary).then((updated) => {
        setHistory(updated);
      });
      const catMeta = COMPONENT_CATEGORIES.find((c) => c.id === config.category);
      void appendLearningLog({
        id: `log-${summary.id}`,
        type: 'quiz',
        label: {
          ar: `اختبار (${catMeta ? catMeta.label.ar : 'الكل'}): ${finalScore}/${total} (${percentage}%)`,
          en: `Quiz (${catMeta ? catMeta.label.en : 'All'}): ${finalScore}/${total} (${percentage}%)`,
          fr: `Quiz (${catMeta ? catMeta.label.fr : 'Tout'}) : ${finalScore}/${total} (${percentage}%)`,
        },
        detail: summary.id,
        timestamp: Date.now(),
      });
      setPhase('results');
    }
  };

  const handleClearHistory = () => {
    void clearQuizHistory().then(() => {
      setHistory([]);
    });
  };

  useEffect(() => {
    if (!currentFeedback) {
      setTrilingualMapping({});
    }
  }, [locale, currentFeedback]);

  useEffect(() => {
    if (
      phase === 'playing' &&
      currentQuestion?.type === 'match-images' &&
      currentQuestion.imagePairs &&
      currentQuestion.imagePairs.length > 0 &&
      !activeImagePairId &&
      Object.keys(imageMapping).length === 0
    ) {
      setActiveImagePairId(currentQuestion.imagePairs[0].id);
    }
  }, [phase, currentQuestion, activeImagePairId, imageMapping]);

  const handleAssignImagePair = (componentId: string) => {
    if (!activeImagePairId || currentFeedback) return;
    const next = { ...imageMapping };
    for (const key of Object.keys(next)) {
      if (next[key] === componentId) {
        delete next[key];
      }
    }
    next[activeImagePairId] = componentId;
    setImageMapping(next);

    const pairs = currentQuestion?.imagePairs ?? [];
    const nextUnpaired = pairs.find((p) => !next[p.id]);
    setActiveImagePairId(nextUnpaired ? nextUnpaired.id : null);
  };

  const getCategoryLabel = (catId: ComponentCategoryId | 'all') => {
    if (catId === 'all') return t.encyclopedia.allCategories;
    return COMPONENT_CATEGORIES.find((c) => c.id === catId)?.label[locale] ?? catId;
  };

  const getQuestionModeLabel = (q: QuizQuestionItem) => {
    switch (q.type) {
      case 'mcq-photo':
        return t.quiz.modePhysical;
      case 'mcq-symbol':
        return t.quiz.modeSchematic;
      case 'mcq-function':
        return t.quiz.modeFunction;
      case 'mcq-calculation':
        return t.quiz.modeFormula;
      case 'mcq-safety':
        return t.quiz.modeSafety;
      case 'match-images':
        return t.quiz.modeMatchImg;
      case 'match-trilingual':
        return t.quiz.modeMatchTri;
      case 'true-false':
        return t.quiz.modeTrueFalse;
    }
  };

  // Trilingual target language metadata for matching rows
  const trilingualTargets = useMemo(() => {
    if (locale === 'ar') {
      return {
        anchorLabel: 'العربية',
        firstKey: 'en' as const,
        secondKey: 'fr' as const,
        firstTitle: 'English',
        secondTitle: 'Français',
      };
    }
    if (locale === 'en') {
      return {
        anchorLabel: 'English',
        firstKey: 'ar' as const,
        secondKey: 'fr' as const,
        firstTitle: 'العربية',
        secondTitle: 'Français',
      };
    }
    return {
      anchorLabel: 'Français',
      firstKey: 'ar' as const,
      secondKey: 'en' as const,
      firstTitle: 'العربية',
      secondTitle: 'English',
    };
  }, [locale]);

  const progressPercentage =
    questions.length > 0 ? Math.round((records.length / questions.length) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p
            className={
              locale === 'ar'
                ? 'text-xs font-bold text-[#2563EB] dark:text-[#00BFFF]'
                : 'font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider'
            }
          >
            {t.quiz.eyebrow}
          </p>
          {showFullHeader ? (
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              {t.quiz.title}
            </h1>
          ) : (
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {t.quiz.title}
            </h2>
          )}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
            {t.quiz.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 px-3.5 py-2 rounded-lg bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-xs sm:text-sm">
            <span className="text-slate-600 dark:text-slate-300">
              {t.quiz.bestLabel}{' '}
              <strong data-testid="quiz-best-pct" className="font-mono-tech text-[#2563EB] dark:text-[#00BFFF]" dir="ltr">
                {stats.bestPercentage}%
              </strong>
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-slate-600 dark:text-slate-300">
              {t.quiz.attemptsLabel}{' '}
              <strong data-testid="quiz-attempts-count" className="font-mono-tech text-slate-900 dark:text-white" dir="ltr">
                {stats.totalAttempts}
              </strong>
            </span>
          </div>

          {onOpenFullPage && (
            <button
              type="button"
              onClick={onOpenFullPage}
              className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {t.quiz.openFullQuiz}
            </button>
          )}
        </div>
      </div>

      {/* STAGE 1: CONFIGURATOR */}
      {phase === 'setup' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Quiz Settings Card */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-700/70 pb-4">
              <div className="flex items-center gap-2.5">
                <Settings2 className="w-5 h-5 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {t.quiz.setupTitle}
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t.quiz.availableCountLabel}{' '}
                <strong className="font-mono-tech text-slate-900 dark:text-white" dir="ltr">
                  {availablePoolCount}
                </strong>
              </span>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label
                htmlFor="quiz-category-select"
                className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                {t.quiz.categoryLabel}
              </label>
              <select
                id="quiz-category-select"
                data-testid="quiz-category-select"
                value={config.category}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    category: e.target.value as ComponentCategoryId | 'all',
                  }))
                }
                className="w-full h-11 px-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:border-[#2563EB] focus:outline-none"
              >
                <option value="all">{t.encyclopedia.allCategories}</option>
                {COMPONENT_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label[locale]}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty & Count Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Difficulty Level */}
              <div className="space-y-2">
                <span className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {t.quiz.difficultyLabel}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => {
                    const active = config.difficulty === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        data-testid={`quiz-diff-${lvl}`}
                        onClick={() => setConfig((prev) => ({ ...prev, difficulty: lvl }))}
                        className={`px-3 py-2.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#2563EB] border-[#2563EB] text-white'
                            : 'bg-[#F8FAFC] dark:bg-[#0F172A] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#2563EB]'
                        }`}
                      >
                        {lvl === 'all' ? t.encyclopedia.allLevels : t.difficulty[lvl]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question Count */}
              <div className="space-y-2">
                <span className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {t.quiz.questionCountLabel}
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {QUESTION_COUNTS.map((cnt) => {
                    const active = config.questionCount === cnt;
                    return (
                      <button
                        key={cnt}
                        type="button"
                        data-testid={`quiz-count-${cnt}`}
                        onClick={() => setConfig((prev) => ({ ...prev, questionCount: cnt }))}
                        className={`py-2.5 rounded-lg border font-mono-tech text-sm font-bold transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#2563EB] border-[#2563EB] text-white'
                            : 'bg-[#F8FAFC] dark:bg-[#0F172A] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#2563EB]'
                        }`}
                      >
                        {cnt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Question Type Filter */}
            <div className="space-y-2">
              <label
                htmlFor="quiz-type-select"
                className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"
              >
                {t.quiz.questionTypeLabel}
              </label>
              <select
                id="quiz-type-select"
                data-testid="quiz-type-select"
                value={config.questionType}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    questionType: e.target.value as QuizTypeFilter,
                  }))
                }
                className="w-full h-11 px-3.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:border-[#2563EB] focus:outline-none"
              >
                {TYPE_FILTER_OPTIONS.map((typeKey) => (
                  <option key={typeKey} value={typeKey}>
                    {t.quiz.typeLabels[typeKey]}
                  </option>
                ))}
              </select>
            </div>

            {availablePoolCount === 0 ? (
              <EmptyState
                title={t.quiz.noQuestionsTitle}
                subtitle={t.quiz.noQuestionsSubtitle}
                actionLabel={t.quiz.resetSetupBtn}
                onAction={() =>
                  setConfig({
                    category: 'all',
                    difficulty: 'all',
                    questionCount: 10,
                    questionType: 'all',
                  })
                }
              />
            ) : (
              <button
                type="button"
                data-testid="quiz-start-btn"
                onClick={() => startNewQuiz()}
                className="w-full py-3.5 px-6 bg-[#2563EB] hover:bg-blue-700 text-white text-sm sm:text-base font-bold rounded-xl inline-flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4" aria-hidden="true" />
                <span>
                  {t.quiz.startQuizBtn} (
                  {Math.min(config.questionCount, availablePoolCount)})
                </span>
              </button>
            )}
          </div>

          {/* Local Quiz History Panel */}
          <div className="lg:col-span-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl p-6 space-y-5">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-700/70 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
                  <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {t.quiz.historyTitle}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t.quiz.historySubtitle}
                </p>
              </div>
              {history.length > 0 && (
                <button
                  type="button"
                  data-testid="quiz-clear-history"
                  onClick={handleClearHistory}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.quiz.clearHistoryBtn}</span>
                </button>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.quiz.attemptsLabel.replace(':', '')}
                </p>
                <p className="font-mono-tech text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {stats.totalAttempts}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.quiz.bestLabel.replace(':', '')}
                </p>
                <p className="font-mono-tech text-lg font-bold text-[#2563EB] dark:text-[#00BFFF] mt-0.5">
                  {stats.bestPercentage}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.quiz.averageLabel.replace(':', '')}
                </p>
                <p className="font-mono-tech text-lg font-bold text-emerald-600 dark:text-[#22C55E] mt-0.5">
                  {stats.averagePercentage}%
                </p>
              </div>
            </div>

            {/* History List */}
            {!historyLoaded ? (
              <div className="py-8 text-center text-xs text-slate-500">{t.states.loadingTitle}</div>
            ) : history.length === 0 ? (
              <div className="py-8 px-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-dashed border-slate-200 dark:border-slate-700 text-center">
                <Award className="w-7 h-7 text-slate-400 mx-auto mb-2" aria-hidden="true" />
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t.quiz.historyEmpty}
                </p>
              </div>
            ) : (
              <ul
                data-testid="quiz-history-list"
                className="space-y-2.5 max-h-72 overflow-y-auto pe-1"
              >
                {history.slice(0, 8).map((entry) => {
                  const dateLabel = new Date(entry.completedAt).toLocaleDateString(
                    locale === 'ar' ? 'ar-LB' : locale === 'fr' ? 'fr-FR' : 'en-US',
                    { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                  );
                  const good = entry.percentage >= 70;
                  return (
                    <li
                      key={entry.id}
                      className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {getCategoryLabel(entry.category)} ·{' '}
                          {entry.difficulty === 'all'
                            ? t.encyclopedia.allLevels
                            : t.difficulty[entry.difficulty]}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {dateLabel} · {t.quiz.typeLabels[entry.questionType]}
                        </p>
                      </div>
                      <div className="text-end shrink-0" dir="ltr">
                        <span
                          className={`font-mono-tech text-sm font-bold ${
                            good
                              ? 'text-emerald-600 dark:text-[#22C55E]'
                              : 'text-amber-600 dark:text-[#F59E0B]'
                          }`}
                        >
                          {entry.score}/{entry.total} ({entry.percentage}%)
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* STAGE 2: ACTIVE QUESTION RUNNER */}
      {phase === 'playing' && currentQuestion && (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl p-5 sm:p-8 space-y-6">
          {/* Progress Header */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex flex-wrap items-center gap-2 text-slate-600 dark:text-slate-300">
                <span className="font-mono-tech font-bold text-[#2563EB] dark:text-[#00BFFF]">
                  {t.quiz.questionPrefix} {currentIndex + 1} {t.quiz.ofWord} {questions.length}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {getQuestionModeLabel(currentQuestion)}
                </span>
                <span aria-hidden="true">·</span>
                <span>{t.difficulty[currentQuestion.difficulty]}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-600 dark:text-slate-300">
                  {t.quiz.scoreLabel}{' '}
                  <strong
                    data-testid="quiz-live-score"
                    className="font-mono-tech text-slate-900 dark:text-white"
                    dir="ltr"
                  >
                    {score} / {questions.length}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => setPhase('setup')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline underline-offset-4 cursor-pointer"
                >
                  {t.quiz.newQuizBtn}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div
              role="progressbar"
              aria-label={`${t.quiz.questionPrefix} ${currentIndex + 1} ${t.quiz.ofWord} ${questions.length}`}
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              data-testid="quiz-progress-bar"
              className="w-full h-2.5 bg-slate-100 dark:bg-[#0F172A] rounded-full overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              <div
                className="h-full bg-[#2563EB] dark:bg-[#00BFFF] transition-all duration-300"
                style={{ width: `${Math.max(4, progressPercentage)}%` }}
              />
            </div>
          </div>

          {/* Question Body */}
          {currentQuestion.type === 'match-images' && currentQuestion.imagePairs ? (
            /* INTERACTIVE PHOTO-TO-NAME MATCHING */
            <div className="space-y-5">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {currentQuestion.prompt[locale]}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {t.quiz.matchPhotoHint}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Photos Column */}
                <div className="lg:col-span-7 grid grid-cols-2 gap-2.5 sm:gap-3.5">
                  {currentQuestion.imagePairs.map((pair, idx) => {
                    const pairedCompId = imageMapping[pair.id];
                    const pairedOption = currentQuestion.shuffledImageOptions?.find(
                      (o) => o.id === pairedCompId
                    );
                    const isSelectedForPairing = activeImagePairId === pair.id;
                    const pairCorrect = currentFeedback && pairedCompId === pair.componentId;
                    const pairWrong = currentFeedback && pairedCompId !== pair.componentId;

                    return (
                      <button
                        key={pair.id}
                        type="button"
                        disabled={Boolean(currentFeedback)}
                        data-testid={`match-photo-${idx}`}
                        onClick={() => setActiveImagePairId(pair.id)}
                        className={`text-start rounded-xl border p-3 transition-colors cursor-pointer disabled:cursor-default ${
                          pairCorrect
                            ? 'border-emerald-500 bg-emerald-50/70 dark:bg-[#22C55E]/15'
                            : pairWrong
                              ? 'border-rose-500 bg-rose-50/70 dark:bg-[#EF4444]/15'
                              : isSelectedForPairing
                                ? 'border-[#2563EB] dark:border-[#00BFFF] bg-blue-50/60 dark:bg-slate-800 ring-2 ring-[#2563EB]/30'
                                : 'border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0F172A] hover:border-[#2563EB]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-mono-tech text-xs font-bold text-[#2563EB] dark:text-[#00BFFF]">
                            #{idx + 1}
                          </span>
                          {pairedOption ? (
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                              → {pairedOption.label[locale]}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              {t.quiz.selectOptionPlaceholder}
                            </span>
                          )}
                        </div>
                        <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700">
                          {currentQuestion.useUniqueArtwork ? (
                            <div className="w-full h-full p-2.5">
                              <ComponentArtwork artworkId={pair.artworkId} mode="physical" />
                            </div>
                          ) : (
                            <OptimizedImage
                              src={pair.imageUrl}
                              alt={`Component #${idx + 1}`}
                              priority
                              className="w-full h-full object-cover"
                              fallback={
                                <div className="w-full h-full p-3">
                                  <ComponentArtwork artworkId={pair.artworkId} mode="physical" />
                                </div>
                              }
                            />
                          )}
                        </div>
                        {pairWrong && (
                          <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 mt-2">
                            {t.quiz.colCorrectAnswer}: {pair.label[locale]}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Names Column */}
                <div className="lg:col-span-5 space-y-2.5">
                  {(currentQuestion.shuffledImageOptions ?? []).map((opt) => {
                    const pairedPhotoIdx = (currentQuestion.imagePairs ?? []).findIndex(
                      (p) => imageMapping[p.id] === opt.id
                    );
                    const isAlreadyUsed = pairedPhotoIdx !== -1;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={Boolean(currentFeedback) || !activeImagePairId}
                        data-testid={`match-name-${opt.id}`}
                        onClick={() => handleAssignImagePair(opt.id)}
                        className={`w-full px-4 py-3.5 rounded-xl border text-start flex items-center justify-between gap-3 transition-colors cursor-pointer disabled:cursor-default ${
                          isAlreadyUsed
                            ? 'bg-blue-50 dark:bg-slate-800 border-[#2563EB]/60 text-slate-900 dark:text-white'
                            : activeImagePairId
                              ? 'bg-[#F8FAFC] dark:bg-[#0F172A] border-slate-200 dark:border-slate-700 hover:border-[#2563EB] text-slate-800 dark:text-slate-100'
                              : 'bg-[#F8FAFC] dark:bg-[#0F172A] border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <span className="text-sm font-semibold">{opt.label[locale]}</span>
                        <span className="font-mono-tech text-xs text-[#2563EB] dark:text-[#00BFFF]" dir="ltr">
                          {isAlreadyUsed ? `#${pairedPhotoIdx + 1}` : opt.symbolCode}
                        </span>
                      </button>
                    );
                  })}

                  {!currentFeedback && (
                    <button
                      type="button"
                      data-testid="quiz-submit-match-btn"
                      disabled={
                        Object.keys(imageMapping).length < (currentQuestion.imagePairs?.length ?? 0)
                      }
                      onClick={() => commitAnswer({ kind: 'match-images', mapping: imageMapping })}
                      className="w-full mt-3 py-3 px-5 bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      {t.quiz.checkAnswerBtn}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : currentQuestion.type === 'match-trilingual' && currentQuestion.trilingualRows ? (
            /* INTERACTIVE TRILINGUAL AR / EN / FR MATCHING */
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] mb-1">
                  <Languages className="w-4 h-4" aria-hidden="true" />
                  <span>{t.quiz.modeMatchTri}</span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {currentQuestion.prompt[locale]}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {t.quiz.matchTrilingualHint}
                </p>
              </div>

              <div className="space-y-3">
                {currentQuestion.trilingualRows.map((row, idx) => {
                  const currentVal = trilingualMapping[row.id] ?? { first: '', second: '' };
                  const firstOptions =
                    trilingualTargets.firstKey === 'en'
                      ? currentQuestion.trilingualEnChoices ?? []
                      : currentQuestion.trilingualArChoices ?? [];
                  const secondOptions =
                    trilingualTargets.secondKey === 'fr'
                      ? currentQuestion.trilingualFrChoices ?? []
                      : currentQuestion.trilingualEnChoices ?? [];

                  const rowCorrect =
                    currentFeedback &&
                    currentVal.first === row[trilingualTargets.firstKey] &&
                    currentVal.second === row[trilingualTargets.secondKey];

                  return (
                    <div
                      key={row.id}
                      className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-12 gap-4 items-center ${
                        currentFeedback
                          ? rowCorrect
                            ? 'border-emerald-500 bg-emerald-50/70 dark:bg-[#22C55E]/15'
                            : 'border-rose-500 bg-rose-50/70 dark:bg-[#EF4444]/15'
                          : 'border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0F172A]'
                      }`}
                    >
                      <div className="md:col-span-4">
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {idx + 1} · {trilingualTargets.anchorLabel} ({row.symbolCode})
                        </p>
                        <p className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
                          {row[locale]}
                        </p>
                      </div>

                      <div className="md:col-span-4">
                        <label
                          htmlFor={`tri-first-${row.id}`}
                          className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1"
                        >
                          {trilingualTargets.firstTitle}
                        </label>
                        <select
                          id={`tri-first-${row.id}`}
                          data-testid={`tri-first-${idx}`}
                          disabled={Boolean(currentFeedback)}
                          value={currentVal.first}
                          onChange={(e) =>
                            setTrilingualMapping((prev) => ({
                              ...prev,
                              [row.id]: { ...currentVal, first: e.target.value },
                            }))
                          }
                          className="w-full h-10 px-3 rounded-lg bg-white dark:bg-[#1E293B] border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white"
                        >
                          <option value="">{t.quiz.selectOptionPlaceholder}</option>
                          {firstOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-4">
                        <label
                          htmlFor={`tri-second-${row.id}`}
                          className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1"
                        >
                          {trilingualTargets.secondTitle}
                        </label>
                        <select
                          id={`tri-second-${row.id}`}
                          data-testid={`tri-second-${idx}`}
                          disabled={Boolean(currentFeedback)}
                          value={currentVal.second}
                          onChange={(e) =>
                            setTrilingualMapping((prev) => ({
                              ...prev,
                              [row.id]: { ...currentVal, second: e.target.value },
                            }))
                          }
                          className="w-full h-10 px-3 rounded-lg bg-white dark:bg-[#1E293B] border border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white"
                        >
                          <option value="">{t.quiz.selectOptionPlaceholder}</option>
                          {secondOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      {currentFeedback && !rowCorrect && (
                        <p className="md:col-span-12 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                          {t.quiz.colCorrectAnswer}: {row[trilingualTargets.firstKey]} ·{' '}
                          {row[trilingualTargets.secondKey]}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {!currentFeedback && (
                <button
                  type="button"
                  data-testid="quiz-submit-trilingual-btn"
                  disabled={
                    !(currentQuestion.trilingualRows ?? []).every(
                      (r) =>
                        trilingualMapping[r.id]?.first && trilingualMapping[r.id]?.second
                    )
                  }
                  onClick={() =>
                    commitAnswer({ kind: 'match-trilingual', mapping: trilingualMapping })
                  }
                  className="px-6 py-3 bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  {t.quiz.checkAnswerBtn}
                </button>
              )}
            </div>
          ) : (
            /* STANDARD 2-COLUMN VISUAL STAGE + MCQ / TRUE-FALSE BODY */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-7 items-center">
              {/* Visual Clue Card */}
              <div className="md:col-span-5 bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col items-center justify-center blueprint-grid min-h-[240px]">
                {currentQuestion.type === 'mcq-photo' && currentQuestion.imageUrl ? (
                  <div className="w-full space-y-2">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{t.quiz.modePhysical}</span>
                    </div>
                    <div className="aspect-[4/3] w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B]">
                      <OptimizedImage
                        src={currentQuestion.imageUrl}
                        alt={t.quiz.modePhysical}
                        priority
                        className="w-full h-full object-cover"
                        fallback={
                          currentQuestion.artworkId ? (
                            <div className="w-full h-full p-4">
                              <ComponentArtwork
                                artworkId={currentQuestion.artworkId}
                                mode="physical"
                              />
                            </div>
                          ) : undefined
                        }
                      />
                    </div>
                  </div>
                ) : currentQuestion.visualMode === 'schematic' && currentQuestion.artworkId ? (
                  <div className="w-full flex flex-col items-center gap-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {t.quiz.modeSchematic}
                    </span>
                    <div className="w-48 h-32">
                      <ComponentArtwork
                        artworkId={currentQuestion.artworkId}
                        mode="schematic"
                      />
                    </div>
                  </div>
                ) : currentQuestion.type === 'mcq-calculation' ? (
                  <div className="text-center space-y-3 px-2">
                    <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 dark:bg-[#00BFFF]/15 text-[#2563EB] dark:text-[#00BFFF] flex items-center justify-center mx-auto">
                      <Calculator className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {t.quiz.modeFormula}
                    </p>
                    {currentQuestion.formulaText && (
                      <p
                        dir="ltr"
                        className="font-mono-tech text-xs sm:text-sm font-bold px-3 py-2 rounded-lg bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-[#00BFFF]"
                      >
                        {currentQuestion.formulaText}
                      </p>
                    )}
                  </div>
                ) : currentQuestion.type === 'mcq-safety' ? (
                  <div className="text-center space-y-3 px-3">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-[#EF4444] flex items-center justify-center mx-auto">
                      <ShieldAlert className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <p className="text-xs font-bold text-[#EF4444] dark:text-rose-400">
                      {t.quiz.modeSafety}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      LOTO · VAT · IEC 61010 · PPE
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-3 px-3">
                    {currentFeedback && currentQuestion.imageUrl ? (
                      <div className="aspect-[4/3] w-48 mx-auto rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                        <OptimizedImage
                          src={currentQuestion.imageUrl}
                          alt={currentQuestion.symbolCode ?? 'Component'}
                          priority
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <>
                        <div className="w-11 h-11 rounded-xl bg-[#2563EB]/10 dark:bg-[#00BFFF]/15 text-[#2563EB] dark:text-[#00BFFF] flex items-center justify-center mx-auto">
                          <BookOpen className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {t.quiz.functionHint}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Prompt + Options */}
              <div className="md:col-span-7 space-y-5">
                <h3
                  data-testid="quiz-question-prompt"
                  className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug"
                >
                  {currentQuestion.prompt[locale]}
                </h3>

                {currentQuestion.type === 'true-false' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { val: true, label: t.quiz.trueBtn, testId: 'quiz-tf-true' },
                      { val: false, label: t.quiz.falseBtn, testId: 'quiz-tf-false' },
                    ].map((btn) => {
                      const isCorrectOption = btn.val === currentQuestion.correctBoolean;
                      const isSelected =
                        currentFeedback?.userAnswer.kind === 'true-false' &&
                        currentFeedback.userAnswer.selectedBool === btn.val;

                      let cls =
                        'bg-[#F8FAFC] dark:bg-[#0F172A] border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-[#2563EB]';
                      if (currentFeedback) {
                        if (isCorrectOption) {
                          cls =
                            'bg-emerald-50 dark:bg-[#22C55E]/15 border-emerald-500 text-emerald-900 dark:text-emerald-200';
                        } else if (isSelected) {
                          cls =
                            'bg-rose-50 dark:bg-[#EF4444]/15 border-rose-500 text-rose-900 dark:text-rose-200';
                        } else {
                          cls =
                            'bg-[#F8FAFC] dark:bg-[#0F172A] border-slate-200 dark:border-slate-700 text-slate-400';
                        }
                      }

                      return (
                        <button
                          key={String(btn.val)}
                          type="button"
                          data-testid={btn.testId}
                          disabled={Boolean(currentFeedback)}
                          onClick={() => commitAnswer({ kind: 'true-false', selectedBool: btn.val })}
                          className={`px-5 py-4 rounded-xl border text-sm sm:text-base font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-default ${cls}`}
                        >
                          <span>{btn.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {(currentQuestion.options ?? []).map((opt, idx) => {
                      const isCorrectOption = opt.id === currentQuestion.correctOptionId;
                      const isSelected =
                        currentFeedback?.userAnswer.kind === 'mcq' &&
                        currentFeedback.userAnswer.selectedId === opt.id;

                      let cls =
                        'bg-[#F8FAFC] dark:bg-[#0F172A] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-[#2563EB] dark:hover:border-[#00BFFF] hover:bg-blue-50/50 dark:hover:bg-slate-800';

                      if (currentFeedback) {
                        if (isCorrectOption) {
                          cls =
                            'bg-emerald-50 dark:bg-[#22C55E]/15 border-emerald-500 text-emerald-900 dark:text-emerald-200';
                        } else if (isSelected) {
                          cls =
                            'bg-rose-50 dark:bg-[#EF4444]/15 border-rose-500 text-rose-900 dark:text-rose-200';
                        } else {
                          cls =
                            'bg-[#F8FAFC] dark:bg-[#0F172A] border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500';
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          data-testid={`quiz-option-${idx}`}
                          disabled={Boolean(currentFeedback)}
                          onClick={() => commitAnswer({ kind: 'mcq', selectedId: opt.id })}
                          className={`w-full text-start px-4 py-3 rounded-xl border text-sm font-medium flex items-center justify-between gap-3 transition-colors cursor-pointer disabled:cursor-default ${cls}`}
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            {currentFeedback && isCorrectOption && (
                              <CheckCircle2
                                className="w-4 h-4 text-emerald-600 dark:text-[#22C55E] shrink-0"
                                aria-hidden="true"
                              />
                            )}
                            {currentFeedback && isSelected && !isCorrectOption && (
                              <XCircle
                                className="w-4 h-4 text-rose-600 dark:text-[#EF4444] shrink-0"
                                aria-hidden="true"
                              />
                            )}
                            <span>{opt.label[locale]}</span>
                          </span>
                          {opt.subLabel && (
                            <span
                              className="font-mono-tech text-xs opacity-75 shrink-0"
                              dir="ltr"
                            >
                              {opt.subLabel}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Immediate Feedback & Explanation */}
          {currentFeedback && (
            <div className="pt-2 space-y-4 border-t border-slate-100 dark:border-slate-700/70">
              <div
                data-testid="quiz-feedback"
                className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${
                  currentFeedback.isCorrect
                    ? 'bg-emerald-50 dark:bg-[#22C55E]/15 border-emerald-200 dark:border-[#22C55E]/30 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-[#EF4444]/15 border-rose-200 dark:border-[#EF4444]/30 text-rose-900 dark:text-rose-200'
                }`}
              >
                {currentFeedback.isCorrect ? (
                  <CheckCircle2
                    className="w-5 h-5 text-emerald-700 dark:text-[#22C55E] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                ) : (
                  <XCircle
                    className="w-5 h-5 text-rose-700 dark:text-[#EF4444] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                )}
                <div className="space-y-1">
                  <p className="font-bold">
                    {currentFeedback.isCorrect ? t.quiz.correctTitle : t.quiz.wrongTitle}
                  </p>
                  <p className="leading-relaxed">{currentQuestion.explanation[locale]}</p>
                </div>
              </div>

              <button
                type="button"
                data-testid="quiz-next-btn"
                onClick={handleNext}
                className="px-6 py-3 bg-slate-900 dark:bg-[#2563EB] hover:bg-[#2563EB] dark:hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                {currentIndex + 1 < questions.length ? t.quiz.nextBtn : t.quiz.finishBtn}
              </button>
            </div>
          )}
        </div>
      )}

      {/* STAGE 3: FINAL RESULTS & DETAILED REVIEW */}
      {phase === 'results' && (
        <div className="space-y-6">
          <div
            data-testid="quiz-results-card"
            className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl p-6 sm:p-8 text-center space-y-5"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/10 dark:bg-[#00BFFF]/15 text-[#2563EB] dark:text-[#00BFFF] flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {t.quiz.finishedTitle}:{' '}
                <span className="font-mono-tech text-[#2563EB] dark:text-[#00BFFF]" dir="ltr">
                  {score} / {questions.length} (
                  {questions.length > 0 ? Math.round((score / questions.length) * 100) : 0}%)
                </span>
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                {questions.length > 0 && score / questions.length >= 0.85
                  ? t.quiz.finishedExcellent
                  : questions.length > 0 && score / questions.length >= 0.6
                    ? t.quiz.finishedGood
                    : t.quiz.finishedRetry}
              </p>
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                {t.quiz.savedNotice}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                data-testid="quiz-retry-btn"
                onClick={() => startNewQuiz()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>{t.quiz.retrySameBtn}</span>
              </button>
              <button
                type="button"
                data-testid="quiz-reconfigure-btn"
                onClick={() => setPhase('setup')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-[#2563EB] text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Settings2 className="w-4 h-4" aria-hidden="true" />
                <span>{t.quiz.newQuizBtn}</span>
              </button>
            </div>
          </div>

          {/* Full Answer Review List */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl p-6 sm:p-8 space-y-4">
            <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {t.quiz.reviewTitle}
            </h4>

            <div data-testid="quiz-review-list" className="space-y-3.5">
              {records.map((rec, idx) => (
                <div
                  key={rec.questionId}
                  className={`p-4 rounded-xl border space-y-2 ${
                    rec.isCorrect
                      ? 'bg-emerald-50/50 dark:bg-[#22C55E]/10 border-emerald-200 dark:border-[#22C55E]/30'
                      : 'bg-rose-50/50 dark:bg-[#EF4444]/10 border-rose-200 dark:border-[#EF4444]/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      <span className="font-mono-tech text-xs me-2 text-slate-500">
                        #{idx + 1}
                      </span>
                      {rec.question.prompt[locale]}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold shrink-0 ${
                        rec.isCorrect
                          ? 'text-emerald-700 dark:text-[#22C55E]'
                          : 'text-rose-700 dark:text-[#EF4444]'
                      }`}
                    >
                      {rec.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <XCircle className="w-4 h-4" aria-hidden="true" />
                      )}
                      <span>{rec.isCorrect ? t.quiz.correctTitle : t.quiz.wrongTitle}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <p className="text-slate-700 dark:text-slate-200">
                      <strong className="me-1">{t.quiz.colYourAnswer}:</strong>
                      {rec.userSummary[locale]}
                    </p>
                    {!rec.isCorrect && (
                      <p className="text-emerald-700 dark:text-emerald-300">
                        <strong className="me-1">{t.quiz.colCorrectAnswer}:</strong>
                        {rec.correctSummary[locale]}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-200/70 dark:border-slate-700/70">
                    {rec.question.explanation[locale]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Saved History Confirmation Strip */}
          {history.length > 0 && (
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <History className="w-5 h-5 text-[#2563EB] dark:text-[#00BFFF] shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {t.quiz.historyTitle}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.quiz.attemptsLabel} {stats.totalAttempts} · {t.quiz.bestLabel} {stats.bestPercentage}% · {t.quiz.averageLabel} {stats.averagePercentage}%
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPhase('setup')}
                className="text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] hover:underline cursor-pointer"
              >
                {t.quiz.newQuizBtn}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
