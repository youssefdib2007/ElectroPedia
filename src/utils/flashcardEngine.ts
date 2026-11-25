import type {
  ComponentCategoryId,
  DifficultyLevel,
  ElectronicComponent,
  FlashcardCardState,
  FlashcardDeckFilter,
  FlashcardProgressMap,
  FlashcardRating,
} from '../types/electronics';

export const DAY_MS = 24 * 60 * 60 * 1000;
const TEN_MINUTES_MS = 10 * 60 * 1000;

export function createDefaultCardState(componentId: string): FlashcardCardState {
  return {
    componentId,
    repetitions: 0,
    intervalDays: 0,
    easeFactor: 2.5,
    nextReviewAt: 0,
    lastReviewedAt: null,
    isDifficult: false,
    isSaved: false,
  };
}

/**
 * SM-2 Spaced Repetition transition.
 * - again: resets repetitions, schedules 10 min retry, marks difficult
 * - hard: short interval boost, slightly reduces ease factor, marks difficult
 * - good: standard SM-2 progression (1d -> 3d -> round(prev * EF)), clears difficult flag
 * - easy: boosted progression (4d -> round(prev * EF * 1.3)), increases ease factor, clears difficult
 */
export function computeNextReview(
  prev: FlashcardCardState | undefined,
  componentId: string,
  rating: FlashcardRating,
  now = Date.now()
): FlashcardCardState {
  const base = prev ? { ...prev } : createDefaultCardState(componentId);

  let repetitions = base.repetitions;
  let intervalDays = base.intervalDays;
  let easeFactor = base.easeFactor;
  let isDifficult = base.isDifficult;
  let nextReviewAt = now;

  switch (rating) {
    case 'again': {
      repetitions = 0;
      intervalDays = 0;
      easeFactor = Math.max(1.3, Number((easeFactor - 0.2).toFixed(2)));
      isDifficult = true;
      nextReviewAt = now + TEN_MINUTES_MS;
      break;
    }
    case 'hard': {
      repetitions = Math.max(1, repetitions);
      intervalDays = repetitions <= 1 && intervalDays === 0 ? 1 : Math.max(1, Math.round(intervalDays * 1.2));
      easeFactor = Math.max(1.3, Number((easeFactor - 0.15).toFixed(2)));
      isDifficult = true;
      nextReviewAt = now + intervalDays * DAY_MS;
      break;
    }
    case 'good': {
      repetitions = repetitions + 1;
      if (repetitions === 1) {
        intervalDays = 1;
      } else if (repetitions === 2) {
        intervalDays = 3;
      } else {
        intervalDays = Math.max(4, Math.round(intervalDays * easeFactor));
      }
      isDifficult = false;
      nextReviewAt = now + intervalDays * DAY_MS;
      break;
    }
    case 'easy': {
      repetitions = repetitions + 1;
      if (repetitions === 1) {
        intervalDays = 4;
      } else if (repetitions === 2) {
        intervalDays = 7;
      } else {
        intervalDays = Math.max(7, Math.round(intervalDays * easeFactor * 1.3));
      }
      easeFactor = Math.min(2.8, Number((easeFactor + 0.15).toFixed(2)));
      isDifficult = false;
      nextReviewAt = now + intervalDays * DAY_MS;
      break;
    }
  }

  return {
    ...base,
    componentId,
    repetitions,
    intervalDays,
    easeFactor,
    nextReviewAt,
    lastReviewedAt: now,
    isDifficult,
    lastRating: rating,
  };
}

export function previewIntervals(
  prev: FlashcardCardState | undefined,
  componentId: string,
  now = Date.now()
): Record<FlashcardRating, number> {
  return {
    again: computeNextReview(prev, componentId, 'again', now).intervalDays,
    hard: computeNextReview(prev, componentId, 'hard', now).intervalDays,
    good: computeNextReview(prev, componentId, 'good', now).intervalDays,
    easy: computeNextReview(prev, componentId, 'easy', now).intervalDays,
  };
}

export function toggleFlashcardSaved(
  progress: FlashcardProgressMap,
  componentId: string
): FlashcardProgressMap {
  const existing = progress[componentId] ?? createDefaultCardState(componentId);
  return {
    ...progress,
    [componentId]: {
      ...existing,
      isSaved: !existing.isSaved,
    },
  };
}

export function toggleFlashcardDifficult(
  progress: FlashcardProgressMap,
  componentId: string
): FlashcardProgressMap {
  const existing = progress[componentId] ?? createDefaultCardState(componentId);
  return {
    ...progress,
    [componentId]: {
      ...existing,
      isDifficult: !existing.isDifficult,
    },
  };
}

export function isCardDue(state: FlashcardCardState | undefined, now = Date.now()): boolean {
  if (!state || state.lastReviewedAt === null) return true;
  return state.nextReviewAt <= now;
}

export interface FlashcardFilterOptions {
  category: ComponentCategoryId | 'all';
  difficulty: DifficultyLevel | 'all';
  deckFilter: FlashcardDeckFilter;
  progress: FlashcardProgressMap;
  now?: number;
}

export function filterFlashcards(
  components: ElectronicComponent[],
  options: FlashcardFilterOptions
): ElectronicComponent[] {
  const now = options.now ?? Date.now();
  return components.filter((comp) => {
    if (options.category !== 'all' && comp.category !== options.category) return false;
    if (options.difficulty !== 'all' && comp.difficulty !== options.difficulty) return false;

    const state = options.progress[comp.id];
    switch (options.deckFilter) {
      case 'due':
        return isCardDue(state, now);
      case 'difficult':
        return Boolean(state?.isDifficult);
      case 'saved':
        return Boolean(state?.isSaved);
      case 'all':
      default:
        return true;
    }
  });
}

export function shuffleDeckIds(ids: string[], rng: () => number = Math.random): string[] {
  const copy = [...ids];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export interface FlashcardStats {
  totalCards: number;
  reviewedCount: number;
  masteredCount: number;
  difficultCount: number;
  savedCount: number;
  dueCount: number;
}

export function computeFlashcardStats(
  components: ElectronicComponent[],
  progress: FlashcardProgressMap,
  now = Date.now()
): FlashcardStats {
  let reviewedCount = 0;
  let masteredCount = 0;
  let difficultCount = 0;
  let savedCount = 0;
  let dueCount = 0;

  for (const comp of components) {
    const state = progress[comp.id];
    if (state?.lastReviewedAt !== null && state?.lastReviewedAt !== undefined) {
      reviewedCount++;
    }
    if (state && state.repetitions >= 2 && !state.isDifficult) {
      masteredCount++;
    }
    if (state?.isDifficult) {
      difficultCount++;
    }
    if (state?.isSaved) {
      savedCount++;
    }
    if (isCardDue(state, now)) {
      dueCount++;
    }
  }

  return {
    totalCards: components.length,
    reviewedCount,
    masteredCount,
    difficultCount,
    savedCount,
    dueCount,
  };
}
