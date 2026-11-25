import type {
  ComponentCategoryId,
  DifficultyLevel,
  ElectronicComponent,
  Locale,
  SearchSuggestion,
  SortOption,
} from '../types/electronics';

export interface CatalogFilterOptions {
  query: string;
  category: ComponentCategoryId | 'all';
  difficulty: DifficultyLevel | 'all';
  sort?: SortOption;
  locale?: Locale;
}

const DIFFICULTY_RANK: Record<DifficultyLevel, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

export function getComponentName(component: ElectronicComponent, locale: Locale): string {
  if (locale === 'en') return component.nameEn;
  if (locale === 'fr') return component.nameFr;
  return component.nameAr;
}

/**
 * Normalizes Arabic, English, and French text so search handles diacritics,
 * alef/teh marbuta variations, accents, and punctuation seamlessly.
 */
export function normalizeSearchText(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Strip Latin accents (é -> e, à -> a)
    .replace(/[\u064B-\u065F\u0670]/g, '') // Strip Arabic tashkeel/diacritics
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}\s+-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  const curr = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) {
      prev[j] = curr[j];
    }
  }
  return prev[b.length];
}

function getFuzzyTokenMatchScore(queryToken: string, candidateWords: string[]): number {
  if (queryToken.length < 3) return 0;
  const maxEdits = queryToken.length >= 7 ? 2 : 1;
  let bestScore = 0;

  for (const word of candidateWords) {
    if (word.length < 3) continue;
    if (Math.abs(word.length - queryToken.length) > maxEdits) continue;
    const dist = levenshteinDistance(queryToken, word);
    if (dist <= maxEdits) {
      const score = dist === 1 ? 26 : 16;
      if (score > bestScore) bestScore = score;
    }
  }
  return bestScore;
}

export function scoreComponentMatch(
  item: ElectronicComponent,
  rawQuery: string
): { score: number; matchedFuzzy: boolean } {
  const query = normalizeSearchText(rawQuery);
  if (!query) return { score: 1, matchedFuzzy: false };

  const primaryNames = [
    normalizeSearchText(item.nameAr),
    normalizeSearchText(item.nameEn),
    normalizeSearchText(item.nameFr),
    normalizeSearchText(item.id.replace(/-/g, ' ')),
    normalizeSearchText(item.symbolCode),
  ];

  const altNamesList = [
    ...item.altNames.ar,
    ...item.altNames.en,
    ...item.altNames.fr,
  ].map(normalizeSearchText);

  const bodyText = normalizeSearchText(
    [
      item.shortDesc.ar,
      item.shortDesc.en,
      item.shortDesc.fr,
      item.definition.ar,
      item.definition.en,
      item.definition.fr,
      item.functionDesc.ar,
      item.functionDesc.en,
      item.functionDesc.fr,
      item.packageType,
      ...item.applications.ar,
      ...item.applications.en,
      ...item.applications.fr,
    ].join(' ')
  );

  // 1. Direct phrase match checks (highest priority)
  for (const name of primaryNames) {
    if (!name) continue;
    if (name === query) return { score: 120, matchedFuzzy: false };
    if (name.startsWith(query)) return { score: 100, matchedFuzzy: false };
    if (name.includes(query)) return { score: 85, matchedFuzzy: false };
  }

  for (const alt of altNamesList) {
    if (!alt) continue;
    if (alt === query) return { score: 92, matchedFuzzy: false };
    if (alt.startsWith(query)) return { score: 80, matchedFuzzy: false };
    if (alt.includes(query)) return { score: 70, matchedFuzzy: false };
  }

  if (bodyText.includes(query)) {
    return { score: 50, matchedFuzzy: false };
  }

  // 2. Tokenized partial & typo-tolerant fuzzy matching
  const queryTokens = query.split(' ').filter(Boolean);
  const nameAndAltWords = [...primaryNames, ...altNamesList]
    .join(' ')
    .split(' ')
    .filter(Boolean);
  const allSearchableText = [...primaryNames, ...altNamesList, bodyText].join(' ');

  let totalScore = 0;
  let matchedFuzzy = false;

  for (const token of queryTokens) {
    if (nameAndAltWords.some((w) => w.startsWith(token))) {
      totalScore += 45;
      continue;
    }
    if (allSearchableText.includes(token)) {
      totalScore += 32;
      continue;
    }
    const fuzzyScore = getFuzzyTokenMatchScore(token, nameAndAltWords);
    if (fuzzyScore > 0) {
      totalScore += fuzzyScore;
      matchedFuzzy = true;
      continue;
    }
    // One token did not match even fuzzily
    return { score: 0, matchedFuzzy: false };
  }

  return { score: totalScore, matchedFuzzy };
}

export function sortComponents(
  components: ElectronicComponent[],
  sortBy: SortOption,
  locale: Locale = 'ar',
  relevanceScores?: Map<string, number>
): ElectronicComponent[] {
  const list = [...components];
  switch (sortBy) {
    case 'name-asc':
      return list.sort((a, b) =>
        getComponentName(a, locale).localeCompare(getComponentName(b, locale), locale)
      );
    case 'name-desc':
      return list.sort((a, b) =>
        getComponentName(b, locale).localeCompare(getComponentName(a, locale), locale)
      );
    case 'difficulty-asc':
      return list.sort((a, b) => {
        const diff = DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty];
        return diff !== 0
          ? diff
          : getComponentName(a, locale).localeCompare(getComponentName(b, locale), locale);
      });
    case 'difficulty-desc':
      return list.sort((a, b) => {
        const diff = DIFFICULTY_RANK[b.difficulty] - DIFFICULTY_RANK[a.difficulty];
        return diff !== 0
          ? diff
          : getComponentName(a, locale).localeCompare(getComponentName(b, locale), locale);
      });
    case 'relevance':
    default:
      if (!relevanceScores) return list;
      return list.sort((a, b) => {
        const scoreDiff = (relevanceScores.get(b.id) ?? 0) - (relevanceScores.get(a.id) ?? 0);
        if (scoreDiff !== 0) return scoreDiff;
        return getComponentName(a, locale).localeCompare(getComponentName(b, locale), locale);
      });
  }
}

export function filterComponents(
  components: ElectronicComponent[],
  options: CatalogFilterOptions
): ElectronicComponent[] {
  const hasQuery = Boolean(normalizeSearchText(options.query));
  const relevanceScores = new Map<string, number>();

  const filtered = components.filter((item) => {
    if (options.category !== 'all' && item.category !== options.category) {
      return false;
    }
    if (options.difficulty !== 'all' && item.difficulty !== options.difficulty) {
      return false;
    }
    if (!hasQuery) {
      return true;
    }
    const { score } = scoreComponentMatch(item, options.query);
    if (score > 0) {
      relevanceScores.set(item.id, score);
      return true;
    }
    return false;
  });

  const sortBy = options.sort ?? (hasQuery ? 'relevance' : 'relevance');
  if (!hasQuery && sortBy === 'relevance') {
    return filtered;
  }

  return sortComponents(
    filtered,
    sortBy,
    options.locale ?? 'ar',
    hasQuery ? relevanceScores : undefined
  );
}

export function getSearchSuggestions(
  components: ElectronicComponent[],
  query: string,
  options?: {
    category?: ComponentCategoryId | 'all';
    difficulty?: DifficultyLevel | 'all';
    limit?: number;
  }
): SearchSuggestion[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];

  const category = options?.category ?? 'all';
  const difficulty = options?.difficulty ?? 'all';
  const limit = options?.limit ?? 6;

  const suggestions: SearchSuggestion[] = [];
  for (const component of components) {
    if (category !== 'all' && component.category !== category) continue;
    if (difficulty !== 'all' && component.difficulty !== difficulty) continue;
    const { score, matchedFuzzy } = scoreComponentMatch(component, normalized);
    if (score > 0) {
      suggestions.push({ component, score, matchedFuzzy });
    }
  }

  suggestions.sort((a, b) => b.score - a.score);
  return suggestions.slice(0, limit);
}

export function toggleBookmarkId(currentIds: string[], targetId: string): string[] {
  if (currentIds.includes(targetId)) {
    return currentIds.filter((id) => id !== targetId);
  }
  return [targetId, ...currentIds];
}
