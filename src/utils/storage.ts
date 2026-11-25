import type {
  ExportedStudyData,
  FlashcardProgressMap,
  LearningActivityEntry,
  Locale,
  QuizResultSummary,
  ThemeMode,
} from '../types/electronics';

const THEME_KEY = 'electropedia_theme';
const LOCALE_KEY = 'electropedia_locale';
const BOOKMARKS_FALLBACK_KEY = 'electropedia_saved_ids';
const QUIZ_BEST_FALLBACK_KEY = 'electropedia_best_quiz';
const QUIZ_HISTORY_FALLBACK_KEY = 'electropedia_quiz_history';
const FLASHCARD_PROGRESS_FALLBACK_KEY = 'electropedia_flashcard_progress';
const STUDIED_COMPONENTS_FALLBACK_KEY = 'electropedia_studied_components';
const LEARNING_LOG_FALLBACK_KEY = 'electropedia_learning_log';

const DB_NAME = 'electropedia_db';
const DB_VERSION = 1;
const BOOKMARKS_STORE = 'bookmarks';
const PROGRESS_STORE = 'study_progress';

export function getStoredTheme(): ThemeMode {
  try {
    const val = window.localStorage.getItem(THEME_KEY);
    if (val === 'dark' || val === 'light') return val;
  } catch {
    // ignore storage errors
  }
  return 'light';
}

export function saveStoredTheme(theme: ThemeMode): void {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore storage errors
  }
}

export function applyThemeToDocument(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function getStoredLocale(): Locale {
  try {
    const val = window.localStorage.getItem(LOCALE_KEY);
    if (val === 'ar' || val === 'en' || val === 'fr') return val;
  } catch {
    // ignore storage errors
  }
  return 'ar';
}

export function saveStoredLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    // ignore storage errors
  }
}

export function applyLocaleToDocument(locale: Locale): void {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
}

function openDb(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(BOOKMARKS_STORE)) {
          db.createObjectStore(BOOKMARKS_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
          db.createObjectStore(PROGRESS_STORE, { keyPath: 'key' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function readFallbackBookmarks(): string[] {
  try {
    const raw = window.localStorage.getItem(BOOKMARKS_FALLBACK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function writeFallbackBookmarks(ids: string[]): void {
  try {
    window.localStorage.setItem(BOOKMARKS_FALLBACK_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export async function loadBookmarks(): Promise<string[]> {
  const db = await openDb();
  if (!db) return readFallbackBookmarks();

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(BOOKMARKS_STORE, 'readonly');
      const store = tx.objectStore(BOOKMARKS_STORE);
      const req = store.getAll();
      req.onsuccess = () => {
        const rows = (req.result as { id: string; savedAt: number }[]) ?? [];
        if (rows.length > 0) {
          rows.sort((a, b) => b.savedAt - a.savedAt);
          resolve(rows.map((r) => r.id));
        } else {
          resolve(readFallbackBookmarks());
        }
      };
      req.onerror = () => resolve(readFallbackBookmarks());
    } catch {
      resolve(readFallbackBookmarks());
    }
  });
}

export async function syncBookmarks(ids: string[]): Promise<void> {
  writeFallbackBookmarks(ids);
  const db = await openDb();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(BOOKMARKS_STORE, 'readwrite');
      const store = tx.objectStore(BOOKMARKS_STORE);
      store.clear();
      const now = Date.now();
      ids.forEach((id, idx) => {
        store.put({ id, savedAt: now - idx });
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function loadBestQuizScore(): Promise<number> {
  const fallback = (() => {
    try {
      return Number(window.localStorage.getItem(QUIZ_BEST_FALLBACK_KEY)) || 0;
    } catch {
      return 0;
    }
  })();

  const db = await openDb();
  if (!db) return fallback;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(PROGRESS_STORE, 'readonly');
      const store = tx.objectStore(PROGRESS_STORE);
      const req = store.get('best_quiz_score');
      req.onsuccess = () => {
        const val = req.result?.value;
        resolve(typeof val === 'number' ? Math.max(val, fallback) : fallback);
      };
      req.onerror = () => resolve(fallback);
    } catch {
      resolve(fallback);
    }
  });
}

export async function saveBestQuizScore(score: number): Promise<void> {
  try {
    window.localStorage.setItem(QUIZ_BEST_FALLBACK_KEY, String(score));
  } catch {
    // ignore
  }

  const db = await openDb();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(PROGRESS_STORE, 'readwrite');
      tx.objectStore(PROGRESS_STORE).put({ key: 'best_quiz_score', value: score, updatedAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

function readFallbackQuizHistory(): QuizResultSummary[] {
  try {
    const raw = window.localStorage.getItem(QUIZ_HISTORY_FALLBACK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFallbackQuizHistory(history: QuizResultSummary[]): void {
  try {
    window.localStorage.setItem(QUIZ_HISTORY_FALLBACK_KEY, JSON.stringify(history));
  } catch {
    // ignore
  }
}

export async function loadQuizHistory(): Promise<QuizResultSummary[]> {
  const fallback = readFallbackQuizHistory();
  const db = await openDb();
  if (!db) return fallback;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(PROGRESS_STORE, 'readonly');
      const req = tx.objectStore(PROGRESS_STORE).get('quiz_history');
      req.onsuccess = () => {
        const val = req.result?.value;
        if (Array.isArray(val) && val.length >= fallback.length) {
          resolve(val as QuizResultSummary[]);
        } else {
          resolve(fallback);
        }
      };
      req.onerror = () => resolve(fallback);
    } catch {
      resolve(fallback);
    }
  });
}

export async function saveQuizResultToHistory(
  summary: QuizResultSummary
): Promise<QuizResultSummary[]> {
  const existing = await loadQuizHistory();
  const updated = [summary, ...existing.filter((item) => item.id !== summary.id)].slice(0, 30);
  writeFallbackQuizHistory(updated);

  const bestPct = Math.max(...updated.map((u) => u.percentage), summary.percentage);
  void saveBestQuizScore(bestPct);

  const db = await openDb();
  if (!db) return updated;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(PROGRESS_STORE, 'readwrite');
      tx.objectStore(PROGRESS_STORE).put({
        key: 'quiz_history',
        value: updated,
        updatedAt: Date.now(),
      });
      tx.oncomplete = () => resolve(updated);
      tx.onerror = () => resolve(updated);
    } catch {
      resolve(updated);
    }
  });
}

export async function clearQuizHistory(): Promise<void> {
  writeFallbackQuizHistory([]);
  try {
    window.localStorage.setItem(QUIZ_BEST_FALLBACK_KEY, '0');
  } catch {
    // ignore
  }

  const db = await openDb();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(PROGRESS_STORE, 'readwrite');
      tx.objectStore(PROGRESS_STORE).put({ key: 'quiz_history', value: [], updatedAt: Date.now() });
      tx.objectStore(PROGRESS_STORE).put({ key: 'best_quiz_score', value: 0, updatedAt: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

function readFallbackFlashcardProgress(): FlashcardProgressMap {
  try {
    const raw = window.localStorage.getItem(FLASHCARD_PROGRESS_FALLBACK_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as FlashcardProgressMap)
      : {};
  } catch {
    return {};
  }
}

function writeFallbackFlashcardProgress(progress: FlashcardProgressMap): void {
  try {
    window.localStorage.setItem(FLASHCARD_PROGRESS_FALLBACK_KEY, JSON.stringify(progress));
  } catch {
    // ignore
  }
}

export async function loadFlashcardProgress(): Promise<FlashcardProgressMap> {
  const fallback = readFallbackFlashcardProgress();
  const db = await openDb();
  if (!db) return fallback;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(PROGRESS_STORE, 'readonly');
      const req = tx.objectStore(PROGRESS_STORE).get('flashcard_progress');
      req.onsuccess = () => {
        const val = req.result?.value;
        if (val && typeof val === 'object' && !Array.isArray(val)) {
          const merged: FlashcardProgressMap = {
            ...fallback,
            ...(val as FlashcardProgressMap),
          };
          resolve(merged);
        } else {
          resolve(fallback);
        }
      };
      req.onerror = () => resolve(fallback);
    } catch {
      resolve(fallback);
    }
  });
}

export async function saveFlashcardProgress(progress: FlashcardProgressMap): Promise<void> {
  writeFallbackFlashcardProgress(progress);
  const db = await openDb();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(PROGRESS_STORE, 'readwrite');
      tx.objectStore(PROGRESS_STORE).put({
        key: 'flashcard_progress',
        value: progress,
        updatedAt: Date.now(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function clearFlashcardProgress(): Promise<void> {
  writeFallbackFlashcardProgress({});
  const db = await openDb();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(PROGRESS_STORE, 'readwrite');
      tx.objectStore(PROGRESS_STORE).put({
        key: 'flashcard_progress',
        value: {},
        updatedAt: Date.now(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

function readFallbackStringArray(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function writeFallbackJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export async function loadStudiedComponents(): Promise<string[]> {
  const fallback = readFallbackStringArray(STUDIED_COMPONENTS_FALLBACK_KEY);
  const db = await openDb();
  if (!db) return fallback;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(PROGRESS_STORE, 'readonly');
      const req = tx.objectStore(PROGRESS_STORE).get('studied_components');
      req.onsuccess = () => {
        const val = req.result?.value;
        if (Array.isArray(val)) {
          const merged = Array.from(new Set([...(val as string[]), ...fallback]));
          resolve(merged);
        } else {
          resolve(fallback);
        }
      };
      req.onerror = () => resolve(fallback);
    } catch {
      resolve(fallback);
    }
  });
}

export async function saveStudiedComponents(ids: string[]): Promise<void> {
  const unique = Array.from(new Set(ids));
  writeFallbackJson(STUDIED_COMPONENTS_FALLBACK_KEY, unique);
  const db = await openDb();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(PROGRESS_STORE, 'readwrite');
      tx.objectStore(PROGRESS_STORE).put({
        key: 'studied_components',
        value: unique,
        updatedAt: Date.now(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function recordStudiedComponent(
  componentId: string,
  entry?: LearningActivityEntry
): Promise<string[]> {
  const existing = await loadStudiedComponents();
  const next = existing.includes(componentId) ? existing : [componentId, ...existing];
  await saveStudiedComponents(next);
  if (entry) {
    await appendLearningLog(entry);
  }
  return next;
}

function readFallbackLearningLog(): LearningActivityEntry[] {
  try {
    const raw = window.localStorage.getItem(LEARNING_LOG_FALLBACK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LearningActivityEntry[]) : [];
  } catch {
    return [];
  }
}

export async function loadLearningLog(): Promise<LearningActivityEntry[]> {
  const fallback = readFallbackLearningLog();
  const db = await openDb();
  if (!db) return fallback;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(PROGRESS_STORE, 'readonly');
      const req = tx.objectStore(PROGRESS_STORE).get('learning_log');
      req.onsuccess = () => {
        const val = req.result?.value;
        if (Array.isArray(val) && val.length >= fallback.length) {
          resolve(val as LearningActivityEntry[]);
        } else {
          resolve(fallback);
        }
      };
      req.onerror = () => resolve(fallback);
    } catch {
      resolve(fallback);
    }
  });
}

export async function saveLearningLog(entries: LearningActivityEntry[]): Promise<void> {
  const trimmed = entries.slice(0, 60);
  writeFallbackJson(LEARNING_LOG_FALLBACK_KEY, trimmed);
  const db = await openDb();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(PROGRESS_STORE, 'readwrite');
      tx.objectStore(PROGRESS_STORE).put({
        key: 'learning_log',
        value: trimmed,
        updatedAt: Date.now(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function appendLearningLog(entry: LearningActivityEntry): Promise<LearningActivityEntry[]> {
  const current = await loadLearningLog();
  const deduped =
    entry.type === 'component'
      ? current.filter((item) => !(item.type === 'component' && item.detail === entry.detail))
      : current;
  const next = [entry, ...deduped].slice(0, 60);
  await saveLearningLog(next);
  return next;
}

export async function exportAllStudyData(): Promise<ExportedStudyData> {
  const [bookmarks, quizHistory, bestQuizScore, flashcardProgress, studiedComponentIds, learningLog] =
    await Promise.all([
      loadBookmarks(),
      loadQuizHistory(),
      loadBestQuizScore(),
      loadFlashcardProgress(),
      loadStudiedComponents(),
      loadLearningLog(),
    ]);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    theme: getStoredTheme(),
    locale: getStoredLocale(),
    bookmarks,
    quizHistory,
    bestQuizScore,
    flashcardProgress,
    studiedComponentIds,
    learningLog,
  };
}

export function validateImportedStudyData(raw: unknown): ExportedStudyData | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;
  if (obj.version !== 1) return null;

  const bookmarks = Array.isArray(obj.bookmarks)
    ? obj.bookmarks.filter((x): x is string => typeof x === 'string')
    : [];
  const studiedComponentIds = Array.isArray(obj.studiedComponentIds)
    ? obj.studiedComponentIds.filter((x): x is string => typeof x === 'string')
    : [];
  const quizHistory = Array.isArray(obj.quizHistory)
    ? (obj.quizHistory.filter(
        (x) => x && typeof x === 'object' && typeof (x as QuizResultSummary).id === 'string'
      ) as QuizResultSummary[])
    : [];
  const bestQuizScore = typeof obj.bestQuizScore === 'number' ? obj.bestQuizScore : 0;
  const flashcardProgress =
    obj.flashcardProgress && typeof obj.flashcardProgress === 'object' && !Array.isArray(obj.flashcardProgress)
      ? (obj.flashcardProgress as FlashcardProgressMap)
      : {};
  const learningLog = Array.isArray(obj.learningLog)
    ? (obj.learningLog.filter(
        (x) => x && typeof x === 'object' && typeof (x as LearningActivityEntry).id === 'string'
      ) as LearningActivityEntry[])
    : [];
  const theme: ThemeMode = obj.theme === 'dark' ? 'dark' : 'light';
  const locale: Locale = obj.locale === 'en' || obj.locale === 'fr' ? obj.locale : 'ar';

  return {
    version: 1,
    exportedAt: typeof obj.exportedAt === 'string' ? obj.exportedAt : new Date().toISOString(),
    theme,
    locale,
    bookmarks,
    quizHistory,
    bestQuizScore,
    flashcardProgress,
    studiedComponentIds,
    learningLog,
  };
}

export async function importAllStudyData(data: ExportedStudyData): Promise<void> {
  await syncBookmarks(data.bookmarks);
  writeFallbackQuizHistory(data.quizHistory);
  try {
    window.localStorage.setItem(QUIZ_BEST_FALLBACK_KEY, String(data.bestQuizScore));
  } catch {
    // ignore
  }
  await saveFlashcardProgress(data.flashcardProgress);
  await saveStudiedComponents(data.studiedComponentIds);

  const importEntry: LearningActivityEntry = {
    id: `import-${Date.now()}`,
    type: 'import',
    label: {
      ar: 'استيراد نسخة احتياطية لبيانات التعلم',
      en: 'Imported local study progress backup',
      fr: 'Sauvegarde de progression importée',
    },
    timestamp: Date.now(),
  };
  await saveLearningLog([importEntry, ...data.learningLog]);

  const db = await openDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(PROGRESS_STORE, 'readwrite');
      tx.objectStore(PROGRESS_STORE).put({
        key: 'quiz_history',
        value: data.quizHistory,
        updatedAt: Date.now(),
      });
      tx.objectStore(PROGRESS_STORE).put({
        key: 'best_quiz_score',
        value: data.bestQuizScore,
        updatedAt: Date.now(),
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function resetAllStudyData(): Promise<void> {
  await Promise.all([
    syncBookmarks([]),
    clearQuizHistory(),
    clearFlashcardProgress(),
    saveStudiedComponents([]),
    saveLearningLog([]),
  ]);
}



