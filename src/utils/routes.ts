import type { AppPageId, AppRoute, ComponentCategoryId } from '../types/electronics';

const VALID_CATEGORIES: ComponentCategoryId[] = [
  'residential',
  'industrial',
  'electronics',
  'motors',
  'automation',
  'renewable',
  'tools',
];

export function isValidCategoryId(value: string): value is ComponentCategoryId {
  return VALID_CATEGORIES.includes(value as ComponentCategoryId);
}

export function buildRouteHash(route: AppRoute): string {
  switch (route.page) {
    case 'home':
      return route.sectionAnchor ? `#${route.sectionAnchor}` : '#/';
    case 'components':
      return '#/components';
    case 'categories':
      return route.categoryId
        ? `#/categories/${encodeURIComponent(route.categoryId)}`
        : '#/categories';
    case 'component-detail':
      return route.componentId
        ? `#/component/${encodeURIComponent(route.componentId)}`
        : '#/components';
    case 'electrical-tools':
      return '#/electrical-tools';
    case 'electronics':
      return '#/electronics';
    case 'quizzes':
      return '#/quizzes';
    case 'flashcards':
      return '#/flashcards';
    case 'calculators':
      return '#/calculators';
    case 'symbols':
      return '#/symbols';
    case 'wiring-diagrams':
      return '#/wiring-diagrams';
    case 'glossary':
      return '#/glossary';
    case 'favorites':
      return '#/favorites';
    case 'progress':
      return '#/progress';
    case 'virtual-lab':
      return '#/virtual-lab';
    case 'safety':
      return '#/safety';
    case 'about':
      return '#/about';
    case 'contact':
      return '#/contact';
  }
}

export function parseAppRoute(hash: string, pathname = '/'): AppRoute {
  const cleanHash = (hash || '').trim();

  if (cleanHash.startsWith('#/')) {
    const path = cleanHash.slice(1);
    return parseRoutePath(path);
  }

  // Legacy in-page section anchors (#categories, #safety, #encyclopedia, #levels, #hero)
  if (cleanHash && cleanHash.startsWith('#') && !cleanHash.startsWith('#/')) {
    const anchor = cleanHash.slice(1);
    return { page: 'home', sectionAnchor: anchor };
  }

  if (pathname && pathname !== '/' && pathname !== '/index.html') {
    const parsedFromPath = parseRoutePath(pathname);
    if (parsedFromPath.page !== 'home') {
      return parsedFromPath;
    }
  }

  return { page: 'home' };
}

function parseRoutePath(rawPath: string): AppRoute {
  const normalized = rawPath.split('?')[0].replace(/\/+$/, '') || '/';

  if (normalized === '/') return { page: 'home' };
  if (normalized === '/components') return { page: 'components' };
  if (normalized === '/categories') return { page: 'categories' };
  if (normalized === '/electrical-tools') return { page: 'electrical-tools' };
  if (normalized === '/electronics') return { page: 'electronics' };
  if (normalized === '/quizzes') return { page: 'quizzes' };
  if (normalized === '/flashcards') return { page: 'flashcards' };
  if (normalized === '/calculators') return { page: 'calculators' };
  if (normalized === '/symbols') return { page: 'symbols' };
  if (normalized === '/wiring-diagrams') return { page: 'wiring-diagrams' };
  if (normalized === '/glossary') return { page: 'glossary' };
  if (normalized === '/favorites') return { page: 'favorites' };
  if (normalized === '/progress') return { page: 'progress' };
  if (normalized === '/virtual-lab') return { page: 'virtual-lab' };
  if (normalized === '/safety') return { page: 'safety' };
  if (normalized === '/about') return { page: 'about' };
  if (normalized === '/contact') return { page: 'contact' };

  const catMatch = normalized.match(/^\/categories\/([^/]+)$/);
  if (catMatch) {
    const candidate = decodeURIComponent(catMatch[1]);
    if (isValidCategoryId(candidate)) {
      return { page: 'categories', categoryId: candidate };
    }
    return { page: 'categories' };
  }

  const compMatch = normalized.match(/^\/component\/([^/]+)$/);
  if (compMatch) {
    return { page: 'component-detail', componentId: decodeURIComponent(compMatch[1]) };
  }

  return { page: 'home' };
}

export function getPageNavActiveId(route: AppRoute): AppPageId {
  return route.page;
}
