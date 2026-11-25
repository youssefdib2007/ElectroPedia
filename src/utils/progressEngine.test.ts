import assert from 'node:assert/strict';
import test from 'node:test';
import { ELECTRONIC_COMPONENTS } from '../data/componentsData';
import { GLOSSARY_ENTRIES } from '../data/glossaryData';
import { ELECTRICAL_SYMBOLS, SYMBOL_DOMAINS } from '../data/symbolsData';
import { WIRING_LIBRARY_CATEGORIES, WIRING_LIBRARY_ITEMS } from '../data/wiringLibraryData';
import type { FlashcardProgressMap, QuizResultSummary } from '../types/electronics';
import {
  computeRealProgressStats,
  filterAndSortGlossary,
  filterSymbols,
  getGlossaryAlphabet,
} from './progressEngine';
import { validateImportedStudyData } from './storage';

test('symbols library covers all 9 domains and valid linked components', () => {
  assert.equal(SYMBOL_DOMAINS.length, 9);
  assert.ok(ELECTRICAL_SYMBOLS.length >= 35);
  const compIds = new Set(ELECTRONIC_COMPONENTS.map((c) => c.id));
  const domainSet = new Set(SYMBOL_DOMAINS.map((d) => d.id));

  for (const sym of ELECTRICAL_SYMBOLS) {
    assert.ok(domainSet.has(sym.domain), `Unknown symbol domain: ${sym.domain}`);
    assert.ok(sym.name.ar && sym.name.en && sym.name.fr, `${sym.id} missing localized name`);
    assert.ok(sym.functionDesc.ar && sym.functionDesc.en && sym.functionDesc.fr, `${sym.id} missing function`);
    assert.ok(sym.iecCode.length > 0, `${sym.id} missing IEC code`);
    if (sym.linkedComponentId) {
      assert.ok(
        compIds.has(sym.linkedComponentId),
        `Symbol ${sym.id} references missing component ${sym.linkedComponentId}`
      );
    }
  }

  for (const dom of SYMBOL_DOMAINS) {
    assert.ok(
      ELECTRICAL_SYMBOLS.some((s) => s.domain === dom.id),
      `Symbol domain ${dom.id} has zero symbols`
    );
  }
});

test('wiring diagrams library covers all 8 categories and valid component references', () => {
  assert.equal(WIRING_LIBRARY_CATEGORIES.length, 8);
  assert.ok(WIRING_LIBRARY_ITEMS.length >= 8);
  const compIds = new Set(ELECTRONIC_COMPONENTS.map((c) => c.id));
  const catSet = new Set(WIRING_LIBRARY_CATEGORIES.map((c) => c.id));

  for (const item of WIRING_LIBRARY_ITEMS) {
    assert.ok(catSet.has(item.category), `Unknown wiring category: ${item.category}`);
    assert.ok(item.title.ar && item.title.en && item.title.fr, `${item.id} missing localized title`);
    assert.ok(item.componentsUsed.length >= 2, `${item.id} needs >= 2 componentsUsed`);
    assert.ok(item.safetyPrecautions.length >= 1, `${item.id} needs safetyPrecautions`);
    for (const ref of item.componentsUsed) {
      if (ref.componentId) {
        assert.ok(
          compIds.has(ref.componentId),
          `Wiring ${item.id} references missing component ${ref.componentId}`
        );
      }
    }
  }

  for (const cat of WIRING_LIBRARY_CATEGORIES) {
    assert.ok(
      WIRING_LIBRARY_ITEMS.some((w) => w.category === cat.id),
      `Wiring category ${cat.id} has zero diagrams`
    );
  }
});

test('glossary entries are trilingual and reference valid catalog components', () => {
  assert.ok(GLOSSARY_ENTRIES.length >= 25);
  const compIds = new Set(ELECTRONIC_COMPONENTS.map((c) => c.id));

  for (const entry of GLOSSARY_ENTRIES) {
    assert.ok(entry.term.ar && entry.term.en && entry.term.fr, `${entry.id} missing term`);
    assert.ok(
      entry.definition.ar && entry.definition.en && entry.definition.fr,
      `${entry.id} missing definition`
    );
    for (const cid of entry.relatedComponentIds) {
      assert.ok(compIds.has(cid), `Glossary ${entry.id} references unknown component ${cid}`);
    }
  }
});

test('filterSymbols searches across Arabic, English, French, IEC and ANSI codes', () => {
  const byIec = filterSymbols(ELECTRICAL_SYMBOLS, 'all', 'S00227');
  assert.ok(byIec.some((s) => s.id === 'sym-light-switch'));

  const byAnsi = filterSymbols(ELECTRICAL_SYMBOLS, 'electronics', 'IEEE Std 315 Zigzag');
  assert.ok(byAnsi.some((s) => s.id === 'sym-resistor'));

  const byArabic = filterSymbols(ELECTRICAL_SYMBOLS, 'earthing', 'تأريض');
  assert.ok(byArabic.length >= 1);
});

test('filterAndSortGlossary supports alphabetical filtering and abbreviation lookup', () => {
  const lettersEn = getGlossaryAlphabet(GLOSSARY_ENTRIES, 'en');
  assert.ok(lettersEn.includes('O'));
  assert.ok(lettersEn.includes('R'));

  const rcdMatches = filterAndSortGlossary(GLOSSARY_ENTRIES, 'en', 'RCD', 'all');
  assert.ok(rcdMatches.some((e) => (e.abbreviation ?? '').includes('RCD')));

  const letterA = filterAndSortGlossary(GLOSSARY_ENTRIES, 'en', '', 'A');
  assert.ok(letterA.length >= 1);
  assert.ok(letterA.every((e) => e.term.en.toUpperCase().startsWith('A')));
});

test('computeRealProgressStats returns zero baseline on fresh local state and accurate stats when studied', () => {
  const fresh = computeRealProgressStats(ELECTRONIC_COMPONENTS, [], [], {}, []);
  assert.equal(fresh.totalComponents, 69);
  assert.equal(fresh.studiedComponentsCount, 0);
  assert.equal(fresh.studiedPercentage, 0);
  assert.equal(fresh.completedQuizzesCount, 0);
  assert.equal(fresh.averageQuizScore, 0);
  assert.equal(fresh.bestQuizScore, 0);
  assert.equal(fresh.savedFavoritesCount, 0);
  assert.equal(fresh.savedFlashcardsCount, 0);
  assert.equal(fresh.flashcardsNeedingReviewCount, 0);
  assert.ok(fresh.categoryProgress.every((c) => c.studiedCount === 0 && c.percentage === 0));
  assert.ok(fresh.difficultyProgress.every((d) => d.studiedCount === 0 && d.percentage === 0));

  const now = 1_750_000_000_000;
  const quizHistory: QuizResultSummary[] = [
    {
      id: 'q1',
      completedAt: new Date(now).toISOString(),
      score: 8,
      total: 10,
      percentage: 80,
      category: 'electronics',
      difficulty: 'beginner',
      questionType: 'all',
    },
    {
      id: 'q2',
      completedAt: new Date(now - 1000).toISOString(),
      score: 10,
      total: 10,
      percentage: 100,
      category: 'all',
      difficulty: 'all',
      questionType: 'mcq',
    },
  ];

  const fcProgress: FlashcardProgressMap = {
    resistors: {
      componentId: 'resistors',
      repetitions: 3,
      intervalDays: 6,
      easeFactor: 2.5,
      nextReviewAt: now + 86_400_000,
      lastReviewedAt: now - 1000,
      isDifficult: false,
      isSaved: true,
      lastRating: 'good',
    },
    mosfets: {
      componentId: 'mosfets',
      repetitions: 0,
      intervalDays: 0,
      easeFactor: 2.2,
      nextReviewAt: now - 1000,
      lastReviewedAt: now - 5000,
      isDifficult: true,
      isSaved: false,
      lastRating: 'again',
    },
  };

  const active = computeRealProgressStats(
    ELECTRONIC_COMPONENTS,
    ['resistors', 'light-switches', 'unknown-ignored'],
    quizHistory,
    fcProgress,
    ['resistors', 'plc'],
    now
  );

  assert.equal(active.studiedComponentsCount, 2);
  assert.equal(active.completedQuizzesCount, 2);
  assert.equal(active.averageQuizScore, 90);
  assert.equal(active.bestQuizScore, 100);
  assert.equal(active.savedFavoritesCount, 2);
  assert.equal(active.savedFlashcardsCount, 1);
  assert.equal(active.flashcardsNeedingReviewCount, 1);
  assert.equal(active.flashcardsReviewedCount, 2);

  const electronicsCat = active.categoryProgress.find((c) => c.category === 'electronics');
  assert.equal(electronicsCat?.studiedCount, 1);
  assert.equal(electronicsCat?.masteredCardsCount, 1);
});

test('validateImportedStudyData validates schema cleanly', () => {
  assert.equal(validateImportedStudyData(null), null);
  assert.equal(validateImportedStudyData({ version: 99 }), null);
  assert.equal(validateImportedStudyData([]), null);

  const valid = validateImportedStudyData({
    version: 1,
    theme: 'dark',
    locale: 'fr',
    bookmarks: ['resistors', 123],
    studiedComponentIds: ['plc'],
    quizHistory: [{ id: 'q1', score: 5, total: 5, percentage: 100 }],
    bestQuizScore: 100,
    flashcardProgress: {},
    learningLog: [],
  });

  assert.ok(valid);
  assert.equal(valid.theme, 'dark');
  assert.equal(valid.locale, 'fr');
  assert.deepEqual(valid.bookmarks, ['resistors']);
  assert.deepEqual(valid.studiedComponentIds, ['plc']);
  assert.equal(valid.quizHistory.length, 1);
});
