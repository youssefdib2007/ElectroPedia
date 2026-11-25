import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  ExternalLink,
  Eye,
  Flame,
  Layers,
  RotateCcw,
  Shuffle,
  Sparkles,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { COMPONENT_CATEGORIES, ELECTRONIC_COMPONENTS } from '../data/componentsData';
import { useI18n } from '../i18n/I18nContext';
import type {
  ComponentCategoryId,
  DifficultyLevel,
  ElectronicComponent,
  FlashcardDeckFilter,
  FlashcardFrontMode,
  FlashcardProgressMap,
  FlashcardRating,
} from '../types/electronics';
import {
  computeFlashcardStats,
  computeNextReview,
  filterFlashcards,
  previewIntervals,
  shuffleDeckIds,
  toggleFlashcardDifficult,
  toggleFlashcardSaved,
} from '../utils/flashcardEngine';
import {
  appendLearningLog,
  clearFlashcardProgress,
  loadFlashcardProgress,
  saveFlashcardProgress,
} from '../utils/storage';
import { ComponentArtwork } from './ComponentArtwork';
import { OptimizedImage } from './OptimizedImage';

interface FlashcardsDeckProps {
  onSelectComponent: (component: ElectronicComponent) => void;
}

export function FlashcardsDeck({ onSelectComponent }: FlashcardsDeckProps) {
  const { locale, dir, t } = useI18n();

  const [progress, setProgress] = useState<FlashcardProgressMap>({});
  const [progressLoaded, setProgressLoaded] = useState(false);

  const [frontMode, setFrontMode] = useState<FlashcardFrontMode>('mixed');
  const [deckFilter, setDeckFilter] = useState<FlashcardDeckFilter>('all');
  const [category, setCategory] = useState<ComponentCategoryId | 'all'>('all');
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [shuffledOrder, setShuffledOrder] = useState<string[] | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    let active = true;
    loadFlashcardProgress().then((loaded) => {
      if (!active) return;
      setProgress(loaded);
      setProgressLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const updateProgress = useCallback(
    (updater: (prev: FlashcardProgressMap) => FlashcardProgressMap) => {
      setProgress((prev) => {
        const next = updater(prev);
        void saveFlashcardProgress(next);
        return next;
      });
    },
    []
  );

  const filteredComponents = useMemo(
    () =>
      filterFlashcards(ELECTRONIC_COMPONENTS, {
        category,
        difficulty,
        deckFilter,
        progress,
      }),
    [category, difficulty, deckFilter, progress]
  );

  const deck = useMemo(() => {
    if (!shuffledOrder) return filteredComponents;
    const rank = new Map<string, number>();
    shuffledOrder.forEach((id, idx) => rank.set(id, idx));
    return [...filteredComponents].sort((a, b) => {
      const ra = rank.get(a.id) ?? 9999;
      const rb = rank.get(b.id) ?? 9999;
      return ra - rb;
    });
  }, [filteredComponents, shuffledOrder]);

  useEffect(() => {
    if (currentIndex >= deck.length && deck.length > 0) {
      setCurrentIndex(0);
    }
  }, [deck.length, currentIndex]);

  const currentCard = deck[currentIndex] ?? null;
  const cardState = currentCard ? progress[currentCard.id] : undefined;

  const stats = useMemo(
    () => computeFlashcardStats(ELECTRONIC_COMPONENTS, progress),
    [progress]
  );

  const intervalPreviews = useMemo(
    () => (currentCard ? previewIntervals(cardState, currentCard.id) : null),
    [currentCard, cardState]
  );

  const effectiveFrontMode: 'photo' | 'schematic' = useMemo(() => {
    if (frontMode === 'photo') return 'photo';
    if (frontMode === 'schematic') return 'schematic';
    return currentIndex % 2 === 0 ? 'photo' : 'schematic';
  }, [frontMode, currentIndex]);

  const handleFlip = useCallback(() => {
    if (!currentCard) return;
    setIsFlipped((prev) => !prev);
  }, [currentCard]);

  const handleNext = useCallback(() => {
    if (deck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  }, [deck.length]);

  const handlePrev = useCallback(() => {
    if (deck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  }, [deck.length]);

  const handleShuffle = () => {
    const ids = shuffleDeckIds(ELECTRONIC_COMPONENTS.map((c) => c.id));
    setShuffledOrder(ids);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleResetOrder = () => {
    setShuffledOrder(null);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleToggleSaved = () => {
    if (!currentCard) return;
    const cardId = currentCard.id;
    updateProgress((prev) => toggleFlashcardSaved(prev, cardId));
  };

  const handleToggleDifficult = () => {
    if (!currentCard) return;
    const cardId = currentCard.id;
    updateProgress((prev) => toggleFlashcardDifficult(prev, cardId));
  };

  const handleRate = (rating: FlashcardRating) => {
    if (!currentCard) return;
    const cardId = currentCard.id;
    updateProgress((prev) => ({
      ...prev,
      [cardId]: computeNextReview(prev[cardId], cardId, rating),
    }));

    void appendLearningLog({
      id: `fc-${cardId}-${Date.now()}`,
      type: 'flashcard',
      label: {
        ar: `مراجعة بطاقة: ${currentCard.nameAr} (${rating})`,
        en: `Reviewed flashcard: ${currentCard.nameEn} (${rating})`,
        fr: `Carte révisée : ${currentCard.nameFr} (${rating})`,
      },
      detail: cardId,
      timestamp: Date.now(),
    });

    setIsFlipped(false);
    if (deck.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % deck.length);
    }
  };

  const handleResetProgress = () => {
    setProgress({});
    void clearFlashcardProgress();
    setDeckFilter('all');
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (dir === 'rtl') handlePrev();
        else handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (dir === 'rtl') handleNext();
        else handlePrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dir, handleFlip, handleNext, handlePrev]);

  const formatIntervalLabel = (days: number) => {
    if (days <= 0) return t.flashcards.dueNowLabel;
    if (days === 1) return `1 ${t.flashcards.daySuffix}`;
    return `${days} ${t.flashcards.daysSuffix}`;
  };

  const eyebrowClass =
    locale === 'ar'
      ? 'text-xs font-bold text-[#2563EB] dark:text-[#00BFFF]'
      : 'font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider';

  const currentCatLabel = currentCard
    ? COMPONENT_CATEGORIES.find((c) => c.id === currentCard.category)?.label[locale] ?? ''
    : '';

  const deckProgressPct =
    deck.length > 0 ? Math.round(((currentIndex + 1) / deck.length) * 100) : 0;

  return (
    <div className="space-y-6" data-testid="flashcards-workspace">
      {/* Header + Stats Strip */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className={eyebrowClass}>{t.flashcards.eyebrow}</p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            {t.flashcards.title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 max-w-2xl">
            {t.flashcards.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5">
          <span>
            {t.flashcards.statsTotal}:{' '}
            <strong className="font-mono-tech text-slate-900 dark:text-white">{stats.totalCards}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {t.flashcards.statsReviewed}:{' '}
            <strong className="font-mono-tech text-[#2563EB] dark:text-[#00BFFF]" data-testid="fc-stat-reviewed">
              {stats.reviewedCount}
            </strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {t.flashcards.statsMastered}:{' '}
            <strong className="font-mono-tech text-emerald-600 dark:text-[#22C55E]" data-testid="fc-stat-mastered">
              {stats.masteredCount}
            </strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {t.flashcards.statsDifficult}:{' '}
            <strong className="font-mono-tech text-amber-600 dark:text-[#F59E0B]" data-testid="fc-stat-difficult">
              {stats.difficultCount}
            </strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {t.flashcards.statsSaved}:{' '}
            <strong className="font-mono-tech text-slate-900 dark:text-white" data-testid="fc-stat-saved">
              {stats.savedCount}
            </strong>
          </span>
        </div>
      </div>

      {/* Filters & Deck Controls Bar */}
      <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Category Filter */}
          <div className="lg:col-span-3">
            <label
              htmlFor="fc-category"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              {t.flashcards.categoryLabel}
            </label>
            <select
              id="fc-category"
              data-testid="fc-category-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as ComponentCategoryId | 'all');
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className="w-full h-10 px-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
            >
              <option value="all">{t.encyclopedia.allCategories}</option>
              {COMPONENT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label[locale]}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="lg:col-span-2">
            <label
              htmlFor="fc-difficulty"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5"
            >
              {t.flashcards.levelLabel}
            </label>
            <select
              id="fc-difficulty"
              data-testid="fc-difficulty-select"
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value as DifficultyLevel | 'all');
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className="w-full h-10 px-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
            >
              <option value="all">{t.encyclopedia.allLevels}</option>
              <option value="beginner">{t.difficulty.beginner}</option>
              <option value="intermediate">{t.difficulty.intermediate}</option>
              <option value="advanced">{t.difficulty.advanced}</option>
            </select>
          </div>

          {/* Front Face Mode */}
          <div className="lg:col-span-4">
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              {t.flashcards.frontModeLabel}
            </span>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700">
              {(
                [
                  { id: 'mixed', label: t.flashcards.modeMixed },
                  { id: 'photo', label: t.flashcards.modePhoto },
                  { id: 'schematic', label: t.flashcards.modeSymbol },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  data-testid={`fc-mode-${m.id}`}
                  onClick={() => {
                    setFrontMode(m.id);
                    setIsFlipped(false);
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    frontMode === m.id
                      ? 'bg-[#2563EB] text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Shuffle & Reset */}
          <div className="lg:col-span-3 flex items-end gap-2">
            <button
              type="button"
              data-testid="fc-shuffle-btn"
              onClick={shuffledOrder ? handleResetOrder : handleShuffle}
              className={`flex-1 h-10 px-3 rounded-lg border text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                shuffledOrder
                  ? 'bg-[#2563EB]/10 border-[#2563EB] text-[#2563EB] dark:text-[#00BFFF]'
                  : 'bg-[#F8FAFC] dark:bg-[#0F172A] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#2563EB]'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">
                {shuffledOrder ? t.flashcards.resetOrderBtn : t.flashcards.shuffleBtn}
              </span>
            </button>
            <button
              type="button"
              data-testid="fc-reset-progress-btn"
              onClick={handleResetProgress}
              aria-label={t.flashcards.resetProgressBtn}
              title={t.flashcards.resetProgressBtn}
              className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 hover:text-[#EF4444] hover:border-[#EF4444] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">{t.flashcards.resetProgressBtn}</span>
            </button>
          </div>
        </div>

        {/* Deck Study Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={t.flashcards.deckFilterLabel}>
            {(
              [
                { id: 'all', label: t.flashcards.filterAll, count: stats.totalCards },
                { id: 'due', label: t.flashcards.filterDue, count: stats.dueCount },
                { id: 'difficult', label: t.flashcards.filterDifficult, count: stats.difficultCount },
                { id: 'saved', label: t.flashcards.filterSaved, count: stats.savedCount },
              ] as const
            ).map((tab) => {
              const active = deckFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  data-testid={`fc-filter-${tab.id}`}
                  onClick={() => {
                    setDeckFilter(tab.id);
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`font-mono-tech text-[11px] ${active ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    ({tab.count})
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {t.flashcards.keyboardHint}
          </p>
        </div>
      </div>

      {/* Main Flashcard Stage */}
      {!progressLoaded ? (
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center text-sm text-slate-500 dark:text-slate-400">
          {t.states.loadingTitle}
        </div>
      ) : !currentCard ? (
        <div
          data-testid="fc-empty-state"
          className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center space-y-4"
        >
          <Layers className="w-10 h-10 mx-auto text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            {t.flashcards.emptyDeckTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            {t.flashcards.emptyDeckSubtitle}
          </p>
          <button
            type="button"
            onClick={() => {
              setDeckFilter('all');
              setCategory('all');
              setDifficulty('all');
              setCurrentIndex(0);
            }}
            className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            {t.flashcards.showAllBtn}
          </button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Card Progress Header */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 font-mono-tech font-bold text-[#2563EB] dark:text-[#00BFFF]" data-testid="fc-card-counter">
                <span>
                  {currentIndex + 1} / {deck.length}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-600 dark:text-slate-300 font-sans font-semibold">
                  {currentCatLabel}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500 dark:text-slate-400 font-sans font-normal">
                  {t.difficulty[currentCard.difficulty]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-testid="fc-toggle-difficult"
                  onClick={handleToggleDifficult}
                  aria-pressed={Boolean(cardState?.isDifficult)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                    cardState?.isDifficult
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-[#F59E0B] text-amber-700 dark:text-amber-300'
                      : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#F59E0B]'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{cardState?.isDifficult ? t.flashcards.difficultTag : t.flashcards.markDifficultBtn}</span>
                </button>

                <button
                  type="button"
                  data-testid="fc-toggle-saved"
                  onClick={handleToggleSaved}
                  aria-pressed={Boolean(cardState?.isSaved)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                    cardState?.isSaved
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-[#2563EB] dark:border-[#00BFFF] text-[#2563EB] dark:text-[#00BFFF]'
                      : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-[#2563EB]'
                  }`}
                >
                  <Bookmark
                    className={`w-3.5 h-3.5 shrink-0 ${cardState?.isSaved ? 'fill-current' : ''}`}
                    aria-hidden="true"
                  />
                  <span>{cardState?.isSaved ? t.flashcards.savedCardBtn : t.flashcards.saveCardBtn}</span>
                </button>
              </div>
            </div>

            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={deckProgressPct}
              className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden"
            >
              <div
                className="h-full bg-[#2563EB] dark:bg-[#00BFFF] transition-all duration-300"
                style={{ width: `${deckProgressPct}%` }}
              />
            </div>
          </div>

          {/* 3D Flip Card */}
          <div className="[perspective:1400px]">
            <div
              data-testid="flashcard-3d-inner"
              data-flipped={isFlipped ? 'true' : 'false'}
              className={`relative w-full min-h-[390px] sm:min-h-[420px] transition-transform duration-500 [transform-style:preserve-3d] ${
                isFlipped ? '[transform:rotateY(180deg)]' : ''
              }`}
            >
              {/* FRONT FACE: Component Photo or Electrical Symbol ONLY */}
              <div
                aria-hidden={isFlipped}
                className={`absolute inset-0 [backface-visibility:hidden] bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-8 flex flex-col justify-between shadow-xs ${
                  isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    {effectiveFrontMode === 'photo'
                      ? t.flashcards.modePhoto
                      : t.flashcards.modeSymbol}
                  </span>
                  <span className="font-mono-tech" dir="ltr">
                    {effectiveFrontMode === 'schematic' ? 'IEC / IEEE' : `#${currentIndex + 1}`}
                  </span>
                </div>

                <button
                  type="button"
                  data-testid="flashcard-flip-front"
                  onClick={handleFlip}
                  className="my-4 flex-1 flex flex-col items-center justify-center gap-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 p-4 sm:p-6 hover:border-[#2563EB] dark:hover:border-[#00BFFF] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB]"
                >
                  {effectiveFrontMode === 'photo' ? (
                    <div className="w-full max-w-sm h-52 sm:h-60 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900">
                      <OptimizedImage
                        src={currentCard.imageUrl}
                        alt={t.flashcards.modePhoto}
                        priority
                        className="w-full h-full object-cover"
                        fallback={
                          <div className="w-full h-full p-4 flex items-center justify-center">
                            <ComponentArtwork artworkId={currentCard.artworkId} mode="physical" />
                          </div>
                        }
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-xs h-52 sm:h-60 blueprint-grid rounded-lg border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-center">
                      <ComponentArtwork
                        artworkId={currentCard.artworkId}
                        mode="schematic"
                        className="w-full h-full"
                      />
                    </div>
                  )}

                  <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                    {effectiveFrontMode === 'photo'
                      ? t.flashcards.frontHintPhoto
                      : t.flashcards.frontHintSymbol}
                  </span>
                </button>

                <div className="flex justify-center">
                  <button
                    type="button"
                    data-testid="fc-flip-btn"
                    onClick={handleFlip}
                    className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" aria-hidden="true" />
                    <span>{t.flashcards.flipToBack}</span>
                  </button>
                </div>
              </div>

              {/* BACK FACE: Arabic, English, French names + Function + Short Explanation */}
              <div
                aria-hidden={!isFlipped}
                className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white dark:bg-[#1E293B] border border-[#2563EB]/40 dark:border-[#00BFFF]/40 rounded-2xl p-5 sm:p-7 flex flex-col justify-between gap-4 shadow-xs overflow-y-auto ${
                  !isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-mono-tech text-xs font-bold text-[#2563EB] dark:text-[#00BFFF]" dir="ltr">
                    {currentCard.symbolCode} · {currentCard.packageType}
                  </span>
                  <button
                    type="button"
                    data-testid="fc-flip-back-btn"
                    onClick={handleFlip}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#00BFFF] underline underline-offset-4 cursor-pointer"
                  >
                    {t.flashcards.flipToFront}
                  </button>
                </div>

                {/* Trilingual Nomenclature */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 p-3">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {t.flashcards.backNameAr}
                    </p>
                    <p className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5" dir="rtl">
                      {currentCard.nameAr}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 p-3">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {t.flashcards.backNameEn}
                    </p>
                    <p className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5" dir="ltr">
                      {currentCard.nameEn}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 p-3">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {t.flashcards.backNameFr}
                    </p>
                    <p className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5" dir="ltr">
                      {currentCard.nameFr}
                    </p>
                  </div>
                </div>

                {/* Function & Short Explanation */}
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="text-xs font-bold text-[#2563EB] dark:text-[#00BFFF]">
                      {t.flashcards.backFunction}
                    </p>
                    <p className="text-sm text-slate-800 dark:text-slate-100 leading-relaxed mt-1">
                      {currentCard.functionDesc[locale]}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {t.flashcards.backSummary}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                      {currentCard.shortDesc[locale]}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => onSelectComponent(currentCard)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] hover:underline cursor-pointer"
                  >
                    <span>{t.flashcards.openDetailsBtn}</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <div className="w-20 h-11 rounded-md border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0F172A] p-1 flex items-center justify-center">
                    <ComponentArtwork artworkId={currentCard.artworkId} mode="schematic" className="w-full h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Spaced Repetition Rating Bar (Always accessible, highlighted when flipped) */}
          <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 space-y-3">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 text-center">
              {t.flashcards.srsPrompt}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {intervalPreviews && (
                <>
                  <button
                    type="button"
                    data-testid="fc-rate-again"
                    onClick={() => handleRate('again')}
                    className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 hover:border-[#EF4444] text-rose-700 dark:text-rose-300 flex flex-col items-center gap-0.5 transition-colors cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-1 text-xs font-bold">
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      {t.flashcards.rateAgain}
                    </span>
                    <span className="font-mono-tech text-[11px] opacity-80">
                      {formatIntervalLabel(intervalPreviews.again)}
                    </span>
                  </button>

                  <button
                    type="button"
                    data-testid="fc-rate-hard"
                    onClick={() => handleRate('hard')}
                    className="p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 hover:border-[#F59E0B] text-amber-800 dark:text-amber-300 flex flex-col items-center gap-0.5 transition-colors cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-1 text-xs font-bold">
                      <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                      {t.flashcards.rateHard}
                    </span>
                    <span className="font-mono-tech text-[11px] opacity-80">
                      {formatIntervalLabel(intervalPreviews.hard)}
                    </span>
                  </button>

                  <button
                    type="button"
                    data-testid="fc-rate-good"
                    onClick={() => handleRate('good')}
                    className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 hover:border-[#2563EB] text-[#2563EB] dark:text-[#00BFFF] flex flex-col items-center gap-0.5 transition-colors cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-1 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      {t.flashcards.rateGood}
                    </span>
                    <span className="font-mono-tech text-[11px] opacity-80">
                      {formatIntervalLabel(intervalPreviews.good)}
                    </span>
                  </button>

                  <button
                    type="button"
                    data-testid="fc-rate-easy"
                    onClick={() => handleRate('easy')}
                    className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/30 hover:border-[#22C55E] text-emerald-700 dark:text-emerald-300 flex flex-col items-center gap-0.5 transition-colors cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-1 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                      {t.flashcards.rateEasy}
                    </span>
                    <span className="font-mono-tech text-[11px] opacity-80">
                      {formatIntervalLabel(intervalPreviews.easy)}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Prev / Next Deck Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              data-testid="fc-prev-btn"
              onClick={handlePrev}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] hover:border-[#2563EB] text-sm font-semibold text-slate-800 dark:text-slate-100 inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              {dir === 'rtl' ? (
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              )}
              <span>{t.flashcards.prevBtn}</span>
            </button>

            <span className="font-mono-tech text-xs text-slate-500 dark:text-slate-400">
              {currentIndex + 1} / {deck.length}
            </span>

            <button
              type="button"
              data-testid="fc-next-btn"
              onClick={handleNext}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] hover:border-[#2563EB] text-sm font-semibold text-slate-800 dark:text-slate-100 inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>{t.flashcards.nextBtn}</span>
              {dir === 'rtl' ? (
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
