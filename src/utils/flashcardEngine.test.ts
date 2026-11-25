import assert from 'node:assert/strict';
import test from 'node:test';
import { ELECTRONIC_COMPONENTS } from '../data/componentsData';
import type { FlashcardProgressMap } from '../types/electronics';
import {
  computeFlashcardStats,
  computeNextReview,
  DAY_MS,
  filterFlashcards,
  previewIntervals,
  shuffleDeckIds,
  toggleFlashcardDifficult,
  toggleFlashcardSaved,
} from './flashcardEngine';

test('computeNextReview implements SM-2 progression and difficult flag accurately', () => {
  const now = 1_700_000_000_000;

  // First rating: Good -> 1 day, not difficult
  const s1 = computeNextReview(undefined, 'resistors', 'good', now);
  assert.equal(s1.repetitions, 1);
  assert.equal(s1.intervalDays, 1);
  assert.equal(s1.isDifficult, false);
  assert.equal(s1.nextReviewAt, now + 1 * DAY_MS);

  // Second rating: Good -> 3 days
  const s2 = computeNextReview(s1, 'resistors', 'good', now + DAY_MS);
  assert.equal(s2.repetitions, 2);
  assert.equal(s2.intervalDays, 3);
  assert.equal(s2.isDifficult, false);

  // Third rating: Good -> round(3 * 2.5) = 8 days
  const s3 = computeNextReview(s2, 'resistors', 'good', now + 4 * DAY_MS);
  assert.equal(s3.repetitions, 3);
  assert.equal(s3.intervalDays, 8);

  // Rating Again resets repetitions and marks difficult
  const sAgain = computeNextReview(s3, 'resistors', 'again', now + 12 * DAY_MS);
  assert.equal(sAgain.repetitions, 0);
  assert.equal(sAgain.intervalDays, 0);
  assert.equal(sAgain.isDifficult, true);
  assert.ok(sAgain.easeFactor < s3.easeFactor);

  // Rating Easy marks not difficult and gives 4 days on fresh card
  const sEasy = computeNextReview(undefined, 'mosfets', 'easy', now);
  assert.equal(sEasy.repetitions, 1);
  assert.equal(sEasy.intervalDays, 4);
  assert.equal(sEasy.isDifficult, false);

  const previews = previewIntervals(s1, 'resistors', now);
  assert.equal(previews.again, 0);
  assert.ok(previews.good >= 3);
  assert.ok(previews.easy >= 7);
});

test('filterFlashcards filters by category, difficulty, due, difficult, and saved flags', () => {
  const now = 1_700_000_000_000;
  let progress: FlashcardProgressMap = {};
  progress = toggleFlashcardSaved(progress, 'resistors');
  progress = toggleFlashcardDifficult(progress, 'mosfets');
  progress['resistors'] = computeNextReview(progress['resistors'], 'resistors', 'good', now);

  const savedOnly = filterFlashcards(ELECTRONIC_COMPONENTS, {
    category: 'all',
    difficulty: 'all',
    deckFilter: 'saved',
    progress,
    now,
  });
  assert.deepEqual(
    savedOnly.map((c) => c.id),
    ['resistors']
  );

  const difficultOnly = filterFlashcards(ELECTRONIC_COMPONENTS, {
    category: 'all',
    difficulty: 'all',
    deckFilter: 'difficult',
    progress,
    now,
  });
  assert.deepEqual(
    difficultOnly.map((c) => c.id),
    ['mosfets']
  );

  // resistors is scheduled for +1 day, so it should NOT be due immediately at `now`
  const dueNow = filterFlashcards(ELECTRONIC_COMPONENTS, {
    category: 'electronics',
    difficulty: 'all',
    deckFilter: 'due',
    progress,
    now,
  });
  assert.ok(!dueNow.some((c) => c.id === 'resistors'));
  assert.ok(dueNow.some((c) => c.id === 'mosfets'));

  // Two days later resistors becomes due again
  const dueLater = filterFlashcards(ELECTRONIC_COMPONENTS, {
    category: 'electronics',
    difficulty: 'all',
    deckFilter: 'due',
    progress,
    now: now + 2 * DAY_MS,
  });
  assert.ok(dueLater.some((c) => c.id === 'resistors'));
});

test('shuffleDeckIds and computeFlashcardStats summarize full 69-card deck accurately', () => {
  const now = 1_700_000_000_000;
  const ids = ELECTRONIC_COMPONENTS.slice(0, 10).map((c) => c.id);
  let seed = 11;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  const shuffled = shuffleDeckIds(ids, rng);
  assert.equal(shuffled.length, ids.length);
  assert.deepEqual([...shuffled].sort(), [...ids].sort());
  assert.notDeepEqual(shuffled, ids);

  let progress: FlashcardProgressMap = {};
  const r1 = computeNextReview(undefined, 'resistors', 'good', now);
  progress['resistors'] = computeNextReview(r1, 'resistors', 'good', now + DAY_MS); // repetitions=2 -> mastered
  progress['mosfets'] = computeNextReview(undefined, 'mosfets', 'again', now); // difficult
  progress = toggleFlashcardSaved(progress, 'plc');

  const stats = computeFlashcardStats(ELECTRONIC_COMPONENTS, progress, now);
  assert.equal(stats.totalCards, 69);
  assert.equal(stats.reviewedCount, 2);
  assert.equal(stats.masteredCount, 1);
  assert.equal(stats.difficultCount, 1);
  assert.equal(stats.savedCount, 1);
  assert.equal(stats.dueCount, 67);

  // After 15 minutes, the 'again' card (10 min retry) becomes due again
  const statsLater = computeFlashcardStats(ELECTRONIC_COMPONENTS, progress, now + 15 * 60 * 1000);
  assert.equal(statsLater.dueCount, 68);
});
