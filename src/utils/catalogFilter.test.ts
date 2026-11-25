import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import {
  COMPONENT_CATEGORIES,
  ELECTRONIC_COMPONENTS,
  QUIZ_QUESTIONS,
} from '../data/componentsData';
import {
  filterComponents,
  getComponentName,
  getSearchSuggestions,
  normalizeSearchText,
  toggleBookmarkId,
} from './catalogFilter';
import { buildRouteHash, parseAppRoute } from './routes';
import { generateSitemapXml } from './sitemap';

test('catalog contains all 7 categories and exact 69 unique components', () => {
  assert.equal(COMPONENT_CATEGORIES.length, 7);
  assert.deepEqual(
    COMPONENT_CATEGORIES.map((c) => c.id),
    ['residential', 'industrial', 'electronics', 'motors', 'automation', 'renewable', 'tools']
  );

  assert.equal(ELECTRONIC_COMPONENTS.length, 69);
  const idSet = new Set(ELECTRONIC_COMPONENTS.map((c) => c.id));
  assert.equal(idSet.size, 69, 'Expected 69 unique component IDs');

  const countByCategory = Object.fromEntries(
    COMPONENT_CATEGORIES.map((cat) => [
      cat.id,
      ELECTRONIC_COMPONENTS.filter((c) => c.category === cat.id).length,
    ])
  );
  assert.deepEqual(countByCategory, {
    residential: 11,
    industrial: 10,
    electronics: 13,
    motors: 9,
    automation: 7,
    renewable: 7,
    tools: 12,
  });
});

test('every component has complete Section 8 fields, valid relatedIds, and 3D schema metadata', () => {
  const idSet = new Set(ELECTRONIC_COMPONENTS.map((c) => c.id));

  for (const item of ELECTRONIC_COMPONENTS) {
    assert.ok(item.nameAr.length > 0, `${item.id} missing nameAr`);
    assert.ok(item.nameEn.length > 0, `${item.id} missing nameEn`);
    assert.ok(item.nameFr.length > 0, `${item.id} missing nameFr`);
    assert.ok(item.altNames.ar.length > 0, `${item.id} missing altNames.ar`);
    assert.ok(item.altNames.en.length > 0, `${item.id} missing altNames.en`);
    assert.ok(item.altNames.fr.length > 0, `${item.id} missing altNames.fr`);
    assert.ok(item.imageUrl.startsWith('/src/assets/images/'), `${item.id} invalid imageUrl`);
    assert.ok(item.galleryImages.length >= 2, `${item.id} needs >= 2 gallery images`);
    assert.ok(item.definition.ar && item.definition.en && item.definition.fr, `${item.id} missing definition`);
    assert.ok(item.internalParts.ar.length > 0 && item.externalParts.ar.length > 0, `${item.id} missing parts`);
    assert.ok(item.types.length >= 2, `${item.id} missing variants`);
    assert.ok(item.pins.length >= 1, `${item.id} missing pins`);
    assert.ok(item.specs.length >= 2, `${item.id} missing specs`);
    assert.ok(item.commonFaults.ar.length > 0 && item.testingMethods.ar.length > 0, `${item.id} missing faults/testing`);
    assert.ok(item.safetyTips.ar.length > 0, `${item.id} missing safetyTips`);
    assert.ok(item.references.length > 0, `${item.id} missing references`);
    assert.ok(item.model3d.boundingBoxMm.w > 0 && item.model3d.interactiveHotspots.length >= 2, `${item.id} invalid model3d`);

    for (const relId of item.relatedIds) {
      assert.ok(idSet.has(relId), `${item.id} references unknown relatedId "${relId}"`);
      assert.notEqual(relId, item.id, `${item.id} should not reference itself`);
    }
  }
});

test('QUIZ_QUESTIONS reference valid component IDs', () => {
  const idSet = new Set(ELECTRONIC_COMPONENTS.map((c) => c.id));
  assert.ok(QUIZ_QUESTIONS.length >= 5);

  for (const q of QUIZ_QUESTIONS) {
    assert.ok(idSet.has(q.componentId), `Quiz ${q.id} unknown componentId ${q.componentId}`);
    assert.ok(idSet.has(q.correctId), `Quiz ${q.id} unknown correctId ${q.correctId}`);
    assert.ok(q.options.some((opt) => opt.id === q.correctId), `Quiz ${q.id} missing correct option`);
    for (const opt of q.options) {
      assert.ok(idSet.has(opt.id), `Quiz ${q.id} unknown option ID ${opt.id}`);
    }
  }
});

test('filterComponents returns all 69 items when filters are default', () => {
  const all = filterComponents(ELECTRONIC_COMPONENTS, {
    query: '',
    category: 'all',
    difficulty: 'all',
  });
  assert.equal(all.length, 69);
});

test('smart search matches Arabic, English, French, altNames, normalization, and minor typos', () => {
  const mosfets = filterComponents(ELECTRONIC_COMPONENTS, {
    query: 'MOSFET',
    category: 'all',
    difficulty: 'all',
  });
  assert.ok(mosfets.some((c) => c.id === 'mosfets'));

  // Arabic Teh Marbuta / Alef normalization ("مقاومه" without ta marbuta)
  assert.equal(normalizeSearchText('مقاومة أوم'), 'مقاومه اوم');
  const arabicNormMatch = filterComponents(ELECTRONIC_COMPONENTS, {
    query: 'مقاومه',
    category: 'all',
    difficulty: 'all',
  });
  assert.ok(arabicNormMatch.some((c) => c.id === 'resistors'));

  // French accent-insensitive match ("resistance" matches "Résistances")
  const frenchMatch = filterComponents(ELECTRONIC_COMPONENTS, {
    query: 'resistance',
    category: 'all',
    difficulty: 'all',
  });
  assert.ok(frenchMatch.some((c) => c.id === 'resistors'));

  const altNameMatch = filterComponents(ELECTRONIC_COMPONENTS, {
    query: 'Bootlace Ferrule',
    category: 'all',
    difficulty: 'all',
  });
  assert.ok(altNameMatch.some((c) => c.id === 'crimping-tools'));

  // Typo-tolerant fuzzy match ("resistr" -> Resistors, "multimter" -> Multimeter)
  const typoResistor = filterComponents(ELECTRONIC_COMPONENTS, {
    query: 'resistr',
    category: 'all',
    difficulty: 'all',
  });
  assert.ok(typoResistor.some((c) => c.id === 'resistors'));

  const typoMultimeter = filterComponents(ELECTRONIC_COMPONENTS, {
    query: 'multimter',
    category: 'all',
    difficulty: 'all',
  });
  assert.ok(typoMultimeter.some((c) => c.id === 'multimeter'));
});

test('getSearchSuggestions returns ranked autocomplete matches with fuzzy flag', () => {
  const exact = getSearchSuggestions(ELECTRONIC_COMPONENTS, 'plc', { limit: 4 });
  assert.ok(exact.length >= 1);
  assert.equal(exact[0].component.id, 'plc');
  assert.equal(exact[0].matchedFuzzy, false);

  const fuzzy = getSearchSuggestions(ELECTRONIC_COMPONENTS, 'mosfit', { limit: 4 });
  assert.ok(fuzzy.some((s) => s.component.id === 'mosfets' && s.matchedFuzzy));
});

test('filterComponents sorts by name and difficulty cleanly', () => {
  const diffAsc = filterComponents(ELECTRONIC_COMPONENTS, {
    query: '',
    category: 'all',
    difficulty: 'all',
    sort: 'difficulty-asc',
    locale: 'en',
  });
  assert.equal(diffAsc[0].difficulty, 'beginner');
  assert.equal(diffAsc[diffAsc.length - 1].difficulty, 'advanced');

  const diffDesc = filterComponents(ELECTRONIC_COMPONENTS, {
    query: '',
    category: 'all',
    difficulty: 'all',
    sort: 'difficulty-desc',
    locale: 'en',
  });
  assert.equal(diffDesc[0].difficulty, 'advanced');
  assert.equal(diffDesc[diffDesc.length - 1].difficulty, 'beginner');
});

test('getComponentName returns locale-appropriate component name', () => {
  const resistor = ELECTRONIC_COMPONENTS.find((c) => c.id === 'resistors')!;
  assert.equal(getComponentName(resistor, 'ar'), resistor.nameAr);
  assert.equal(getComponentName(resistor, 'en'), resistor.nameEn);
  assert.equal(getComponentName(resistor, 'fr'), resistor.nameFr);
});

test('filterComponents filters by category and difficulty cleanly', () => {
  const renewableIntermediate = filterComponents(ELECTRONIC_COMPONENTS, {
    query: '',
    category: 'renewable',
    difficulty: 'intermediate',
  });
  assert.ok(renewableIntermediate.length >= 2);
  assert.ok(
    renewableIntermediate.every(
      (c) => c.category === 'renewable' && c.difficulty === 'intermediate'
    )
  );
});

test('toggleBookmarkId adds and removes IDs without duplicates', () => {
  let list: string[] = [];
  list = toggleBookmarkId(list, 'resistors');
  assert.deepEqual(list, ['resistors']);
  list = toggleBookmarkId(list, 'mosfets');
  assert.deepEqual(list, ['mosfets', 'resistors']);
  list = toggleBookmarkId(list, 'resistors');
  assert.deepEqual(list, ['mosfets']);
});

test('routes parser supports all core and Phase 2 pages and dynamic component/category routes', () => {
  assert.deepEqual(parseAppRoute('#/'), { page: 'home' });
  assert.deepEqual(parseAppRoute('#/components'), { page: 'components' });
  assert.deepEqual(parseAppRoute('#/categories'), { page: 'categories' });
  assert.deepEqual(parseAppRoute('#/categories/motors'), { page: 'categories', categoryId: 'motors' });
  assert.deepEqual(parseAppRoute('#/component/plc'), { page: 'component-detail', componentId: 'plc' });
  assert.deepEqual(parseAppRoute('#/electrical-tools'), { page: 'electrical-tools' });
  assert.deepEqual(parseAppRoute('#/electronics'), { page: 'electronics' });
  assert.deepEqual(parseAppRoute('#/quizzes'), { page: 'quizzes' });
  assert.deepEqual(parseAppRoute('#/flashcards'), { page: 'flashcards' });
  assert.deepEqual(parseAppRoute('#/calculators'), { page: 'calculators' });
  assert.deepEqual(parseAppRoute('#/symbols'), { page: 'symbols' });
  assert.deepEqual(parseAppRoute('#/wiring-diagrams'), { page: 'wiring-diagrams' });
  assert.deepEqual(parseAppRoute('#/glossary'), { page: 'glossary' });
  assert.deepEqual(parseAppRoute('#/favorites'), { page: 'favorites' });
  assert.deepEqual(parseAppRoute('#/progress'), { page: 'progress' });
  assert.deepEqual(parseAppRoute('#/virtual-lab'), { page: 'virtual-lab' });
  assert.deepEqual(parseAppRoute('#/safety'), { page: 'safety' });
  assert.deepEqual(parseAppRoute('#/about'), { page: 'about' });
  assert.deepEqual(parseAppRoute('#/contact'), { page: 'contact' });

  assert.equal(buildRouteHash({ page: 'quizzes' }), '#/quizzes');
  assert.equal(buildRouteHash({ page: 'flashcards' }), '#/flashcards');
  assert.equal(buildRouteHash({ page: 'calculators' }), '#/calculators');
  assert.equal(buildRouteHash({ page: 'symbols' }), '#/symbols');
  assert.equal(buildRouteHash({ page: 'wiring-diagrams' }), '#/wiring-diagrams');
  assert.equal(buildRouteHash({ page: 'glossary' }), '#/glossary');
  assert.equal(buildRouteHash({ page: 'favorites' }), '#/favorites');
  assert.equal(buildRouteHash({ page: 'progress' }), '#/progress');
  assert.equal(buildRouteHash({ page: 'virtual-lab' }), '#/virtual-lab');
  assert.equal(buildRouteHash({ page: 'component-detail', componentId: 'mosfets' }), '#/component/mosfets');
  assert.equal(buildRouteHash({ page: 'categories', categoryId: 'renewable' }), '#/categories/renewable');
});

test('public/sitemap.xml covers all core pages, 7 categories, and 69 components', () => {
  const sitemapPath = path.resolve('public/sitemap.xml');
  assert.ok(fs.existsSync(sitemapPath), 'public/sitemap.xml must exist');
  const content = fs.readFileSync(sitemapPath, 'utf8');
  const expected = generateSitemapXml('https://electropedia.edu', COMPONENT_CATEGORIES, ELECTRONIC_COMPONENTS);
  assert.equal(content, expected);

  for (const cat of COMPONENT_CATEGORIES) {
    assert.ok(content.includes(`/#/categories/${cat.id}`), `Sitemap missing category ${cat.id}`);
  }
  for (const comp of ELECTRONIC_COMPONENTS) {
    assert.ok(content.includes(`/#/component/${comp.id}`), `Sitemap missing component ${comp.id}`);
  }
});
