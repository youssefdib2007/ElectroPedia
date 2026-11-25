import type {
  ComponentCategoryId,
  DifficultyLevel,
  ElectronicComponent,
  ElectricalSymbolItem,
  FlashcardProgressMap,
  GlossaryEntry,
  Locale,
  QuizResultSummary,
  SymbolDomainId,
} from '../types/electronics';
import { normalizeSearchText } from './catalogFilter';
import { computeFlashcardStats } from './flashcardEngine';

export interface CategoryProgressItem {
  category: ComponentCategoryId;
  totalComponents: number;
  studiedCount: number;
  masteredCardsCount: number;
  percentage: number;
}

export interface DifficultyProgressItem {
  difficulty: DifficultyLevel;
  totalComponents: number;
  studiedCount: number;
  masteredCardsCount: number;
  percentage: number;
}

export interface RealProgressDashboardStats {
  totalComponents: number;
  studiedComponentsCount: number;
  studiedPercentage: number;
  completedQuizzesCount: number;
  averageQuizScore: number;
  bestQuizScore: number;
  savedFavoritesCount: number;
  savedFlashcardsCount: number;
  flashcardsNeedingReviewCount: number;
  flashcardsReviewedCount: number;
  categoryProgress: CategoryProgressItem[];
  difficultyProgress: DifficultyProgressItem[];
}

export function computeRealProgressStats(
  allComponents: ElectronicComponent[],
  studiedIds: string[],
  quizHistory: QuizResultSummary[],
  flashcardProgress: FlashcardProgressMap,
  favoriteIds: string[],
  now = Date.now()
): RealProgressDashboardStats {
  const validIds = new Set(allComponents.map((c) => c.id));
  const studiedSet = new Set(studiedIds.filter((id) => validIds.has(id)));
  const favoriteSet = new Set(favoriteIds.filter((id) => validIds.has(id)));

  const fcStats = computeFlashcardStats(allComponents, flashcardProgress, now);

  // Cards needing review = difficult cards OR previously reviewed cards that are now due
  let needingReviewCount = 0;
  for (const comp of allComponents) {
    const state = flashcardProgress[comp.id];
    if (!state) continue;
    const isDueReviewed = state.lastReviewedAt !== null && state.nextReviewAt <= now;
    if (state.isDifficult || isDueReviewed) {
      needingReviewCount += 1;
    }
  }

  const completedQuizzesCount = quizHistory.length;
  const averageQuizScore =
    completedQuizzesCount > 0
      ? Math.round(quizHistory.reduce((acc, q) => acc + q.percentage, 0) / completedQuizzesCount)
      : 0;
  const bestQuizScore =
    completedQuizzesCount > 0 ? Math.max(...quizHistory.map((q) => q.percentage)) : 0;

  const categories: ComponentCategoryId[] = [
    'residential',
    'industrial',
    'electronics',
    'motors',
    'automation',
    'renewable',
    'tools',
  ];

  const categoryProgress: CategoryProgressItem[] = categories.map((cat) => {
    const items = allComponents.filter((c) => c.category === cat);
    const studiedCount = items.filter((c) => studiedSet.has(c.id)).length;
    const masteredCardsCount = items.filter((c) => (flashcardProgress[c.id]?.repetitions ?? 0) >= 2).length;
    const percentage = items.length > 0 ? Math.round((studiedCount / items.length) * 100) : 0;
    return {
      category: cat,
      totalComponents: items.length,
      studiedCount,
      masteredCardsCount,
      percentage,
    };
  });

  const difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];
  const difficultyProgress: DifficultyProgressItem[] = difficulties.map((diff) => {
    const items = allComponents.filter((c) => c.difficulty === diff);
    const studiedCount = items.filter((c) => studiedSet.has(c.id)).length;
    const masteredCardsCount = items.filter((c) => (flashcardProgress[c.id]?.repetitions ?? 0) >= 2).length;
    const percentage = items.length > 0 ? Math.round((studiedCount / items.length) * 100) : 0;
    return {
      difficulty: diff,
      totalComponents: items.length,
      studiedCount,
      masteredCardsCount,
      percentage,
    };
  });

  const totalComponents = allComponents.length;
  const studiedComponentsCount = studiedSet.size;

  return {
    totalComponents,
    studiedComponentsCount,
    studiedPercentage: totalComponents > 0 ? Math.round((studiedComponentsCount / totalComponents) * 100) : 0,
    completedQuizzesCount,
    averageQuizScore,
    bestQuizScore,
    savedFavoritesCount: favoriteSet.size,
    savedFlashcardsCount: fcStats.savedCount,
    flashcardsNeedingReviewCount: needingReviewCount,
    flashcardsReviewedCount: fcStats.reviewedCount,
    categoryProgress,
    difficultyProgress,
  };
}

export function filterSymbols(
  symbols: ElectricalSymbolItem[],
  domain: SymbolDomainId | 'all',
  query: string
): ElectricalSymbolItem[] {
  const q = normalizeSearchText(query);
  return symbols.filter((sym) => {
    if (domain !== 'all' && sym.domain !== domain) return false;
    if (!q) return true;
    const haystack = normalizeSearchText(
      [
        sym.name.ar,
        sym.name.en,
        sym.name.fr,
        sym.iecCode,
        sym.ansiCode ?? '',
        sym.functionDesc.ar,
        sym.functionDesc.en,
        sym.functionDesc.fr,
      ].join(' ')
    );
    return haystack.includes(q);
  });
}

export function filterAndSortGlossary(
  entries: GlossaryEntry[],
  locale: Locale,
  query: string,
  letter: string | 'all'
): GlossaryEntry[] {
  const q = normalizeSearchText(query);
  const sorted = [...entries].sort((a, b) =>
    a.term[locale].localeCompare(b.term[locale], locale === 'ar' ? 'ar' : locale)
  );

  return sorted.filter((entry) => {
    if (letter !== 'all') {
      const firstChar = getGlossaryInitial(entry, locale);
      if (firstChar !== letter) return false;
    }
    if (!q) return true;
    const haystack = normalizeSearchText(
      [
        entry.abbreviation ?? '',
        entry.term.ar,
        entry.term.en,
        entry.term.fr,
        entry.definition.ar,
        entry.definition.en,
        entry.definition.fr,
      ].join(' ')
    );
    return haystack.includes(q);
  });
}

export function getGlossaryInitial(entry: GlossaryEntry, locale: Locale): string {
  const raw = entry.term[locale].trim();
  if (!raw) return '#';
  const ch = raw[0];
  if (locale === 'ar') {
    if (ch === 'أ' || ch === 'إ' || ch === 'آ') return 'ا';
    return ch;
  }
  return ch.toUpperCase();
}

export function getGlossaryAlphabet(entries: GlossaryEntry[], locale: Locale): string[] {
  const set = new Set<string>();
  for (const e of entries) {
    set.add(getGlossaryInitial(e, locale));
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, locale === 'ar' ? 'ar' : locale));
}
