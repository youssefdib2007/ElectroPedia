import assert from 'node:assert/strict';
import test from 'node:test';
import { COMPONENT_CATEGORIES, ELECTRONIC_COMPONENTS } from '../data/componentsData';
import type { QuizConfig, QuizQuestionType } from '../types/electronics';
import { computeQuizStats, generateQuizQuestions, gradeQuizAnswer, shuffleArray } from './quizEngine';

function createSeededRng(seed = 42): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

test('generateQuizQuestions produces requested count across all 8 formats when questionType is all', () => {
  const config: QuizConfig = {
    category: 'all',
    difficulty: 'all',
    questionCount: 20,
    questionType: 'all',
  };

  const questions = generateQuizQuestions(ELECTRONIC_COMPONENTS, config, createSeededRng(10));
  assert.equal(questions.length, 20);

  const typesSeen = new Set<QuizQuestionType>(questions.map((q) => q.type));
  assert.ok(typesSeen.has('mcq-photo'));
  assert.ok(typesSeen.has('mcq-symbol'));
  assert.ok(typesSeen.has('mcq-function'));
  assert.ok(typesSeen.has('true-false'));
  assert.ok(typesSeen.has('match-images'));
  assert.ok(typesSeen.has('match-trilingual'));
  assert.ok(typesSeen.has('mcq-calculation'));
  assert.ok(typesSeen.has('mcq-safety'));

  for (const q of questions) {
    assert.ok(q.prompt.ar.length > 0 && q.prompt.en.length > 0 && q.prompt.fr.length > 0);
    assert.ok(
      q.explanation.ar.length > 0 && q.explanation.en.length > 0 && q.explanation.fr.length > 0
    );
  }
});

test('generateQuizQuestions supports every category and difficulty filter', () => {
  for (const cat of COMPONENT_CATEGORIES) {
    const qs = generateQuizQuestions(
      ELECTRONIC_COMPONENTS,
      { category: cat.id, difficulty: 'all', questionCount: 10, questionType: 'all' },
      createSeededRng(7)
    );
    assert.ok(qs.length >= 5, `Expected >=5 questions for category ${cat.id}, got ${qs.length}`);
  }

  for (const diff of ['beginner', 'intermediate', 'advanced'] as const) {
    const qs = generateQuizQuestions(
      ELECTRONIC_COMPONENTS,
      { category: 'all', difficulty: diff, questionCount: 10, questionType: 'all' },
      createSeededRng(99)
    );
    assert.ok(qs.length >= 5, `Expected >=5 questions for difficulty ${diff}`);
    assert.ok(qs.every((q) => q.difficulty === diff));
  }
});

test('generateQuizQuestions supports dedicated type filters including calculations and safety', () => {
  const calcs = generateQuizQuestions(
    ELECTRONIC_COMPONENTS,
    { category: 'all', difficulty: 'all', questionCount: 15, questionType: 'mcq-calculation' },
    createSeededRng(3)
  );
  assert.ok(calcs.length >= 10);
  assert.ok(calcs.every((q) => q.type === 'mcq-calculation'));

  const safety = generateQuizQuestions(
    ELECTRONIC_COMPONENTS,
    { category: 'all', difficulty: 'all', questionCount: 15, questionType: 'mcq-safety' },
    createSeededRng(4)
  );
  assert.ok(safety.length >= 10);
  assert.ok(safety.every((q) => q.type === 'mcq-safety'));

  const imgMatch = generateQuizQuestions(
    ELECTRONIC_COMPONENTS,
    { category: 'all', difficulty: 'all', questionCount: 5, questionType: 'match-images' },
    createSeededRng(5)
  );
  assert.ok(imgMatch.length >= 1);
  assert.ok((imgMatch[0].imagePairs?.length ?? 0) >= 3);
  for (const q of imgMatch) {
    if (!q.useUniqueArtwork) {
      const urls = new Set(q.imagePairs!.map((p) => p.imageUrl));
      assert.equal(urls.size, q.imagePairs!.length, 'Expected distinct studio photos per match-images card');
    }
  }

  const triMatch = generateQuizQuestions(
    ELECTRONIC_COMPONENTS,
    { category: 'residential', difficulty: 'all', questionCount: 5, questionType: 'match-trilingual' },
    createSeededRng(6)
  );
  assert.ok(triMatch.length >= 1);
  assert.equal(triMatch[0].trilingualRows?.length, 3);
});

test('gradeQuizAnswer accurately grades MCQ, True/False, Image Matching, and Trilingual Matching', () => {
  const qs = generateQuizQuestions(
    ELECTRONIC_COMPONENTS,
    { category: 'all', difficulty: 'all', questionCount: 20, questionType: 'all' },
    createSeededRng(10)
  );

  // MCQ grading
  const mcq = qs.find((q) => q.type === 'mcq-photo')!;
  const rightMcq = gradeQuizAnswer(mcq, { kind: 'mcq', selectedId: mcq.correctOptionId! }, 'en');
  assert.equal(rightMcq.isCorrect, true);
  const wrongMcqOpt = mcq.options!.find((o) => o.id !== mcq.correctOptionId)!;
  const wrongMcq = gradeQuizAnswer(mcq, { kind: 'mcq', selectedId: wrongMcqOpt.id }, 'en');
  assert.equal(wrongMcq.isCorrect, false);

  // True/False grading
  const tf = qs.find((q) => q.type === 'true-false')!;
  assert.equal(
    gradeQuizAnswer(tf, { kind: 'true-false', selectedBool: Boolean(tf.correctBoolean) }, 'ar')
      .isCorrect,
    true
  );
  assert.equal(
    gradeQuizAnswer(tf, { kind: 'true-false', selectedBool: !tf.correctBoolean }, 'ar').isCorrect,
    false
  );

  // Image Matching grading
  const imgQ = qs.find((q) => q.type === 'match-images')!;
  const correctImgMap = Object.fromEntries(imgQ.imagePairs!.map((p) => [p.id, p.componentId]));
  assert.equal(
    gradeQuizAnswer(imgQ, { kind: 'match-images', mapping: correctImgMap }, 'fr').isCorrect,
    true
  );
  const wrongImgMap = { ...correctImgMap, [imgQ.imagePairs![0].id]: 'wrong-id' };
  assert.equal(
    gradeQuizAnswer(imgQ, { kind: 'match-images', mapping: wrongImgMap }, 'fr').isCorrect,
    false
  );

  // Trilingual Matching grading (Arabic UI -> first=en, second=fr)
  const triQ = qs.find((q) => q.type === 'match-trilingual')!;
  const correctTriAr = Object.fromEntries(
    triQ.trilingualRows!.map((r) => [r.id, { first: r.en, second: r.fr }])
  );
  assert.equal(
    gradeQuizAnswer(triQ, { kind: 'match-trilingual', mapping: correctTriAr }, 'ar').isCorrect,
    true
  );

  // Trilingual Matching grading (English UI -> first=ar, second=fr)
  const correctTriEn = Object.fromEntries(
    triQ.trilingualRows!.map((r) => [r.id, { first: r.ar, second: r.fr }])
  );
  assert.equal(
    gradeQuizAnswer(triQ, { kind: 'match-trilingual', mapping: correctTriEn }, 'en').isCorrect,
    true
  );
});

test('shuffleArray randomizes order without dropping items and computeQuizStats summarizes history', () => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8];
  const shuffled = shuffleArray(input, createSeededRng(123));
  assert.equal(shuffled.length, input.length);
  assert.deepEqual([...shuffled].sort((a, b) => a - b), input);
  assert.notDeepEqual(shuffled, input);

  const emptyStats = computeQuizStats([]);
  assert.deepEqual(emptyStats, { totalAttempts: 0, bestPercentage: 0, averagePercentage: 0 });

  const stats = computeQuizStats([
    {
      id: '1',
      completedAt: '2026-11-25T00:00:00Z',
      score: 8,
      total: 10,
      percentage: 80,
      category: 'all',
      difficulty: 'all',
      questionType: 'all',
    },
    {
      id: '2',
      completedAt: '2026-11-25T01:00:00Z',
      score: 10,
      total: 10,
      percentage: 100,
      category: 'electronics',
      difficulty: 'beginner',
      questionType: 'mcq-calculation',
    },
  ]);
  assert.deepEqual(stats, { totalAttempts: 2, bestPercentage: 100, averagePercentage: 90 });
});
