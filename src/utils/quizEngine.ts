import {
  CALCULATION_QUIZ_QUESTIONS,
  CURATED_TRUE_FALSE_QUESTIONS,
  SAFETY_QUIZ_QUESTIONS,
} from '../data/quizQuestionsBank';
import type {
  ElectronicComponent,
  Locale,
  LocalizedText,
  QuizAnswerRecord,
  QuizConfig,
  QuizQuestionItem,
  QuizResultSummary,
  QuizTypeFilter,
  QuizUserAnswer,
} from '../types/electronics';

export function shuffleArray<T>(items: T[], rng: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getLabel(comp: ElectronicComponent): LocalizedText {
  return {
    ar: comp.nameAr,
    en: comp.nameEn,
    fr: comp.nameFr,
  };
}

function pickDistractors(
  target: ElectronicComponent,
  pool: ElectronicComponent[],
  allComponents: ElectronicComponent[],
  count: number,
  rng: () => number
): ElectronicComponent[] {
  const sameCategory = shuffleArray(
    pool.filter((c) => c.id !== target.id && c.category === target.category),
    rng
  );
  const samePool = shuffleArray(
    pool.filter((c) => c.id !== target.id && c.category !== target.category),
    rng
  );
  const fallbackAll = shuffleArray(
    allComponents.filter((c) => c.id !== target.id),
    rng
  );

  const combined: ElectronicComponent[] = [];
  const seen = new Set<string>([target.id]);

  for (const item of [...sameCategory, ...samePool, ...fallbackAll]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    combined.push(item);
    if (combined.length >= count) break;
  }

  return combined;
}

function buildPhotoQuestions(
  matchingComponents: ElectronicComponent[],
  allComponents: ElectronicComponent[],
  rng: () => number
): QuizQuestionItem[] {
  return matchingComponents.map((comp) => {
    const distractors = pickDistractors(comp, matchingComponents, allComponents, 3, rng);
    const options = shuffleArray([comp, ...distractors], rng).map((item) => ({
      id: item.id,
      label: getLabel(item),
      subLabel: item.symbolCode,
    }));

    return {
      id: `photo-${comp.id}`,
      type: 'mcq-photo',
      category: comp.category,
      difficulty: comp.difficulty,
      componentId: comp.id,
      visualMode: 'photo',
      imageUrl: comp.imageUrl,
      artworkId: comp.artworkId,
      symbolCode: comp.symbolCode,
      prompt: {
        ar: 'ما اسم القطعة الكهربائية أو الإلكترونية الظاهرة في هذه الصورة؟',
        en: 'What is the name of the electrical or electronic component shown in this photo?',
        fr: 'Quel est le nom du composant électrique ou électronique illustré sur cette photo ?',
      },
      options,
      correctOptionId: comp.id,
      explanation: {
        ar: `${comp.nameAr} (${comp.nameEn} · ${comp.symbolCode}): ${comp.shortDesc.ar}`,
        en: `${comp.nameEn} (${comp.symbolCode}): ${comp.shortDesc.en}`,
        fr: `${comp.nameFr} (${comp.symbolCode}) : ${comp.shortDesc.fr}`,
      },
    };
  });
}

function buildSymbolQuestions(
  matchingComponents: ElectronicComponent[],
  allComponents: ElectronicComponent[],
  rng: () => number
): QuizQuestionItem[] {
  return matchingComponents.map((comp) => {
    const distractors = pickDistractors(comp, matchingComponents, allComponents, 3, rng);
    const options = shuffleArray([comp, ...distractors], rng).map((item) => ({
      id: item.id,
      label: getLabel(item),
      subLabel: item.packageType,
    }));

    return {
      id: `symbol-${comp.id}`,
      type: 'mcq-symbol',
      category: comp.category,
      difficulty: comp.difficulty,
      componentId: comp.id,
      visualMode: 'schematic',
      artworkId: comp.artworkId,
      symbolCode: comp.symbolCode,
      prompt: {
        ar: `إلى أي قطعة يشير هذا الرمز الكهربائي (${comp.symbolCode})؟`,
        en: `Which component is represented by this electrical symbol (${comp.symbolCode})?`,
        fr: `Quel composant est représenté par ce symbole électrique (${comp.symbolCode}) ?`,
      },
      options,
      correctOptionId: comp.id,
      explanation: {
        ar: `الرمز ${comp.symbolCode} يمثل ${comp.nameAr}. ${comp.functionDesc.ar}`,
        en: `Symbol ${comp.symbolCode} represents ${comp.nameEn}. ${comp.functionDesc.en}`,
        fr: `Le symbole ${comp.symbolCode} correspond à ${comp.nameFr}. ${comp.functionDesc.fr}`,
      },
    };
  });
}

function buildFunctionQuestions(
  matchingComponents: ElectronicComponent[],
  allComponents: ElectronicComponent[],
  rng: () => number
): QuizQuestionItem[] {
  return matchingComponents.map((comp) => {
    const distractors = pickDistractors(comp, matchingComponents, allComponents, 3, rng);
    const options = shuffleArray([comp, ...distractors], rng).map((item) => ({
      id: item.id,
      label: getLabel(item),
      subLabel: item.symbolCode,
    }));

    return {
      id: `func-${comp.id}`,
      type: 'mcq-function',
      category: comp.category,
      difficulty: comp.difficulty,
      componentId: comp.id,
      visualMode: 'photo',
      imageUrl: comp.imageUrl,
      artworkId: comp.artworkId,
      symbolCode: comp.symbolCode,
      prompt: {
        ar: `أي قطعة تقوم بهذه الوظيفة: «${comp.shortDesc.ar}»؟`,
        en: `Which component performs this function: "${comp.shortDesc.en}"?`,
        fr: `Quel composant assure cette fonction : « ${comp.shortDesc.fr} » ?`,
      },
      options,
      correctOptionId: comp.id,
      explanation: {
        ar: `الإجابة الصحيحة هي ${comp.nameAr}: ${comp.howItWorks.ar}`,
        en: `Correct component: ${comp.nameEn}. ${comp.howItWorks.en}`,
        fr: `Réponse correcte : ${comp.nameFr}. ${comp.howItWorks.fr}`,
      },
    };
  });
}

function buildGeneratedTrueFalseQuestions(
  matchingComponents: ElectronicComponent[],
  allComponents: ElectronicComponent[],
  rng: () => number
): QuizQuestionItem[] {
  return matchingComponents.slice(0, 12).map((comp, index) => {
    const makeTrue = index % 2 === 0;
    const decoy = pickDistractors(comp, matchingComponents, allComponents, 1, rng)[0] ?? comp;
    const shownComp = makeTrue ? comp : decoy;

    return {
      id: `tf-comp-${comp.id}`,
      type: 'true-false',
      category: comp.category,
      difficulty: comp.difficulty,
      componentId: comp.id,
      visualMode: 'schematic',
      artworkId: comp.artworkId,
      symbolCode: comp.symbolCode,
      prompt: {
        ar: `صحيح أم خطأ: الرمز الكهربائي المعروض ينتمي إلى «${shownComp.nameAr}» ووظيفته: ${shownComp.shortDesc.ar}`,
        en: `True or False: The displayed symbol belongs to "${shownComp.nameEn}" whose function is: ${shownComp.shortDesc.en}`,
        fr: `Vrai ou Faux : Le symbole affiché correspond à « ${shownComp.nameFr} » dont le rôle est : ${shownComp.shortDesc.fr}`,
      },
      correctBoolean: makeTrue || shownComp.id === comp.id,
      explanation: {
        ar: `الرمز المعروض هو رمز ${comp.nameAr} (${comp.symbolCode}) — ${comp.shortDesc.ar}`,
        en: `The displayed symbol belongs to ${comp.nameEn} (${comp.symbolCode}): ${comp.shortDesc.en}`,
        fr: `Le symbole affiché appartient à ${comp.nameFr} (${comp.symbolCode}) : ${comp.shortDesc.fr}`,
      },
    };
  });
}

function buildImageMatchingQuestions(
  matchingComponents: ElectronicComponent[],
  allComponents: ElectronicComponent[],
  config: QuizConfig,
  rng: () => number
): QuizQuestionItem[] {
  const shuffled = shuffleArray(matchingComponents, rng);
  if (shuffled.length === 0) return [];

  const categoryFallback =
    config.category === 'all'
      ? allComponents
      : allComponents.filter((c) => c.category === config.category);

  const candidatePool =
    shuffled.length >= 4
      ? shuffled
      : [
          ...shuffled,
          ...shuffleArray(
            categoryFallback.filter((c) => !shuffled.some((s) => s.id === c.id)),
            rng
          ),
        ];

  if (candidatePool.length < 3) return [];

  // Partition candidates into groups with distinct imageUrls first so real photos never duplicate in one question
  const remaining = [...candidatePool];
  const distinctGroups: { slice: ElectronicComponent[]; useUniqueArtwork: boolean }[] = [];

  while (remaining.length >= 3 && distinctGroups.length < 4) {
    const picked: ElectronicComponent[] = [];
    const seenUrls = new Set<string>();

    for (let idx = 0; idx < remaining.length && picked.length < 4; idx++) {
      const item = remaining[idx];
      if (!seenUrls.has(item.imageUrl)) {
        seenUrls.add(item.imageUrl);
        picked.push(item);
      }
    }

    if (picked.length >= 3) {
      const pickedIds = new Set(picked.map((p) => p.id));
      for (let i = remaining.length - 1; i >= 0; i--) {
        if (pickedIds.has(remaining[i].id)) remaining.splice(i, 1);
      }
      distinctGroups.push({ slice: picked, useUniqueArtwork: false });
    } else {
      // Single-category pool shares studio photos: take 4 distinct components and render their unique physical artwork
      const groupSize = Math.min(4, remaining.length);
      const slice = remaining.splice(0, groupSize);
      if (slice.length >= 3) {
        distinctGroups.push({ slice, useUniqueArtwork: true });
      }
    }
  }

  return distinctGroups.map(({ slice, useUniqueArtwork }, i) => {
    const pairs = slice.map((c, idx) => ({
      id: `pair-${idx}-${c.id}`,
      componentId: c.id,
      imageUrl: c.imageUrl,
      artworkId: c.artworkId,
      label: getLabel(c),
      symbolCode: c.symbolCode,
    }));

    const shuffledOptions = shuffleArray(
      pairs.map((p) => ({
        id: p.componentId,
        label: p.label,
        symbolCode: p.symbolCode,
      })),
      rng
    );

    return {
      id: `match-img-${i}-${slice.map((s) => s.id).join('_')}`,
      type: 'match-images',
      category: config.category === 'all' ? slice[0].category : config.category,
      difficulty: config.difficulty === 'all' ? slice[0].difficulty : config.difficulty,
      imagePairs: pairs,
      useUniqueArtwork,
      shuffledImageOptions: shuffledOptions,
      prompt: {
        ar: 'طابق كل صورة قطعة مع اسمها الصحيح من القائمة المقابلة:',
        en: 'Match each component photo with its correct component name:',
        fr: 'Associez chaque photo de composant à son nom exact :',
      },
      explanation: {
        ar: pairs.map((p, idx) => `${idx + 1}. ${p.label.ar} (${p.symbolCode})`).join(' · '),
        en: pairs.map((p, idx) => `${idx + 1}. ${p.label.en} (${p.symbolCode})`).join(' · '),
        fr: pairs.map((p, idx) => `${idx + 1}. ${p.label.fr} (${p.symbolCode})`).join(' · '),
      },
    };
  });
}

function buildTrilingualMatchingQuestions(
  matchingComponents: ElectronicComponent[],
  allComponents: ElectronicComponent[],
  config: QuizConfig,
  rng: () => number
): QuizQuestionItem[] {
  const shuffled = shuffleArray(matchingComponents, rng);
  if (shuffled.length === 0) return [];

  const categoryFallback =
    config.category === 'all'
      ? allComponents
      : allComponents.filter((c) => c.category === config.category);

  const candidatePool =
    shuffled.length >= 3
      ? shuffled
      : [
          ...shuffled,
          ...shuffleArray(
            categoryFallback.filter((c) => !shuffled.some((s) => s.id === c.id)),
            rng
          ),
        ];

  if (candidatePool.length < 3) return [];

  const groupsCount = Math.max(1, Math.min(4, Math.floor(candidatePool.length / 3)));
  const questions: QuizQuestionItem[] = [];

  for (let i = 0; i < groupsCount; i++) {
    const slice = candidatePool.slice(i * 3, i * 3 + 3);
    if (slice.length < 3) break;

    const rows = slice.map((c, idx) => ({
      id: `tri-${idx}-${c.id}`,
      componentId: c.id,
      symbolCode: c.symbolCode,
      ar: c.nameAr,
      en: c.nameEn,
      fr: c.nameFr,
    }));

    questions.push({
      id: `match-tri-${i}-${slice.map((s) => s.id).join('_')}`,
      type: 'match-trilingual',
      category: config.category === 'all' ? slice[0].category : config.category,
      difficulty: config.difficulty === 'all' ? slice[0].difficulty : config.difficulty,
      trilingualRows: rows,
      trilingualArChoices: shuffleArray(rows.map((r) => r.ar), rng),
      trilingualEnChoices: shuffleArray(rows.map((r) => r.en), rng),
      trilingualFrChoices: shuffleArray(rows.map((r) => r.fr), rng),
      prompt: {
        ar: 'طابق كل مصطلح باللغات الثلاث (العربية ↔ الإنجليزية ↔ الفرنسية):',
        en: 'Match each electrical term across all three languages (Arabic, English, French):',
        fr: 'Associez chaque terme électrique dans les trois langues (Arabe, Anglais, Français) :',
      },
      explanation: {
        ar: rows.map((r) => `${r.ar} = ${r.en} = ${r.fr}`).join(' | '),
        en: rows.map((r) => `${r.en} = ${r.ar} = ${r.fr}`).join(' | '),
        fr: rows.map((r) => `${r.fr} = ${r.en} = ${r.ar}`).join(' | '),
      },
    });
  }

  return questions;
}

function filterCuratedQuestions(
  items: QuizQuestionItem[],
  config: QuizConfig,
  rng: () => number
): QuizQuestionItem[] {
  return shuffleArray(
    items.filter((q) => {
      const catOk = config.category === 'all' || q.category === 'general' || q.category === config.category;
      const diffOk = config.difficulty === 'all' || q.difficulty === config.difficulty;
      return catOk && diffOk;
    }),
    rng
  ).map((q) => ({
    ...q,
    options: q.options ? shuffleArray(q.options, rng) : undefined,
  }));
}

function matchesTypeFilter(type: QuizQuestionItem['type'], filter: QuizTypeFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'mcq') {
    return (
      type === 'mcq-photo' ||
      type === 'mcq-symbol' ||
      type === 'mcq-function' ||
      type === 'mcq-calculation' ||
      type === 'mcq-safety'
    );
  }
  return type === filter;
}

export function generateQuizQuestions(
  allComponents: ElectronicComponent[],
  config: QuizConfig,
  rng: () => number = Math.random
): QuizQuestionItem[] {
  const matchingComponents = shuffleArray(
    allComponents.filter((c) => {
      const catOk = config.category === 'all' || c.category === config.category;
      const diffOk = config.difficulty === 'all' || c.difficulty === config.difficulty;
      return catOk && diffOk;
    }),
    rng
  );

  const photoQs = buildPhotoQuestions(matchingComponents, allComponents, rng);
  const symbolQs = buildSymbolQuestions(matchingComponents, allComponents, rng);
  const funcQs = buildFunctionQuestions(matchingComponents, allComponents, rng);
  const tfQs = shuffleArray(
    [
      ...filterCuratedQuestions(CURATED_TRUE_FALSE_QUESTIONS, config, rng),
      ...buildGeneratedTrueFalseQuestions(matchingComponents, allComponents, rng),
    ],
    rng
  );
  const imgMatchQs = buildImageMatchingQuestions(matchingComponents, allComponents, config, rng);
  const triMatchQs = buildTrilingualMatchingQuestions(matchingComponents, allComponents, config, rng);
  const calcQs = filterCuratedQuestions(CALCULATION_QUIZ_QUESTIONS, config, rng);
  const safetyQs = filterCuratedQuestions(SAFETY_QUIZ_QUESTIONS, config, rng);

  if (config.questionType !== 'all') {
    const filteredPool = shuffleArray(
      [
        ...photoQs,
        ...symbolQs,
        ...funcQs,
        ...tfQs,
        ...imgMatchQs,
        ...triMatchQs,
        ...calcQs,
        ...safetyQs,
      ].filter((q) => matchesTypeFilter(q.type, config.questionType)),
      rng
    );
    return filteredPool.slice(0, config.questionCount);
  }

  // Round-robin balanced interleaving across all 8 question categories so short & long quizzes include rich variety
  const buckets: QuizQuestionItem[][] = [
    photoQs,
    symbolQs,
    funcQs,
    tfQs,
    calcQs,
    safetyQs,
    imgMatchQs,
    triMatchQs,
  ];

  const cursors = buckets.map(() => 0);
  const interleaved: QuizQuestionItem[] = [];
  const usedComponentPromptIds = new Set<string>();
  let progressed = true;

  while (interleaved.length < config.questionCount && progressed) {
    progressed = false;
    for (let b = 0; b < buckets.length; b++) {
      const bucket = buckets[b];
      while (cursors[b] < bucket.length) {
        const candidate = bucket[cursors[b]];
        cursors[b]++;
        if (
          candidate.componentId &&
          usedComponentPromptIds.has(`${candidate.type}-${candidate.componentId}`)
        ) {
          continue;
        }
        if (candidate.componentId) {
          usedComponentPromptIds.add(`${candidate.type}-${candidate.componentId}`);
        }
        interleaved.push(candidate);
        progressed = true;
        break;
      }
      if (interleaved.length >= config.questionCount) break;
    }
  }

  return shuffleArray(interleaved, rng);
}

export function gradeQuizAnswer(
  question: QuizQuestionItem,
  answer: QuizUserAnswer,
  locale: Locale
): QuizAnswerRecord {
  if (question.type === 'true-false' && answer.kind === 'true-false') {
    const isCorrect = answer.selectedBool === Boolean(question.correctBoolean);
    const trueText: LocalizedText = { ar: 'صحيح', en: 'True', fr: 'Vrai' };
    const falseText: LocalizedText = { ar: 'خطأ', en: 'False', fr: 'Faux' };

    return {
      questionId: question.id,
      question,
      userAnswer: answer,
      isCorrect,
      userSummary: answer.selectedBool ? trueText : falseText,
      correctSummary: question.correctBoolean ? trueText : falseText,
    };
  }

  if (question.type === 'match-images' && answer.kind === 'match-images') {
    const pairs = question.imagePairs ?? [];
    const correctCount = pairs.filter((p) => answer.mapping[p.id] === p.componentId).length;
    const isCorrect = pairs.length > 0 && correctCount === pairs.length;

    const userText = pairs
      .map((p, idx) => {
        const chosen = pairs.find((opt) => opt.componentId === answer.mapping[p.id]);
        return `${idx + 1} → ${chosen ? chosen.label[locale] : '—'}`;
      })
      .join(' · ');

    return {
      questionId: question.id,
      question,
      userAnswer: answer,
      isCorrect,
      userSummary: { ar: userText, en: userText, fr: userText },
      correctSummary: {
        ar: pairs.map((p, idx) => `${idx + 1} → ${p.label.ar}`).join(' · '),
        en: pairs.map((p, idx) => `${idx + 1} → ${p.label.en}`).join(' · '),
        fr: pairs.map((p, idx) => `${idx + 1} → ${p.label.fr}`).join(' · '),
      },
    };
  }

  if (question.type === 'match-trilingual' && answer.kind === 'match-trilingual') {
    const rows = question.trilingualRows ?? [];
    const targetKeys: [keyof typeof rows[number], keyof typeof rows[number]] =
      locale === 'ar' ? ['en', 'fr'] : locale === 'en' ? ['ar', 'fr'] : ['ar', 'en'];

    const isCorrect =
      rows.length > 0 &&
      rows.every((r) => {
        const sel = answer.mapping[r.id];
        return sel && sel.first === r[targetKeys[0]] && sel.second === r[targetKeys[1]];
      });

    const userText = rows
      .map((r) => {
        const sel = answer.mapping[r.id];
        return `${r[locale]} (${sel?.first || '—'} / ${sel?.second || '—'})`;
      })
      .join(' · ');

    const correctText = rows
      .map((r) => `${r[locale]} (${String(r[targetKeys[0]])} / ${String(r[targetKeys[1]])})`)
      .join(' · ');

    return {
      questionId: question.id,
      question,
      userAnswer: answer,
      isCorrect,
      userSummary: { ar: userText, en: userText, fr: userText },
      correctSummary: { ar: correctText, en: correctText, fr: correctText },
    };
  }

  // Standard MCQ
  const selectedId = answer.kind === 'mcq' ? answer.selectedId : '';
  const isCorrect = selectedId === question.correctOptionId;
  const userOpt = question.options?.find((o) => o.id === selectedId);
  const correctOpt = question.options?.find((o) => o.id === question.correctOptionId);

  return {
    questionId: question.id,
    question,
    userAnswer: answer,
    isCorrect,
    userSummary: userOpt?.label ?? { ar: '—', en: '—', fr: '—' },
    correctSummary: correctOpt?.label ?? { ar: '—', en: '—', fr: '—' },
  };
}

export function computeQuizStats(history: QuizResultSummary[]): {
  totalAttempts: number;
  bestPercentage: number;
  averagePercentage: number;
} {
  if (history.length === 0) {
    return { totalAttempts: 0, bestPercentage: 0, averagePercentage: 0 };
  }
  const bestPercentage = Math.max(...history.map((h) => h.percentage));
  const averagePercentage = Math.round(
    history.reduce((sum, item) => sum + item.percentage, 0) / history.length
  );
  return {
    totalAttempts: history.length,
    bestPercentage,
    averagePercentage,
  };
}
