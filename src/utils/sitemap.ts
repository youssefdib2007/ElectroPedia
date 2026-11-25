import type { CategoryMeta, ElectronicComponent } from '../types/electronics';

export const STATIC_PAGES = [
  '/',
  '/#/components',
  '/#/categories',
  '/#/electronics',
  '/#/electrical-tools',
  '/#/quizzes',
  '/#/flashcards',
  '/#/calculators',
  '/#/symbols',
  '/#/wiring-diagrams',
  '/#/glossary',
  '/#/favorites',
  '/#/progress',
  '/#/virtual-lab',
  '/#/safety',
  '/#/about',
  '/#/contact',
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateSitemapXml(
  baseUrl: string,
  categories: CategoryMeta[],
  components: ElectronicComponent[],
  lastmod = '2026-11-24'
): string {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const urls: { loc: string; priority: string; changefreq: string }[] = [
    ...STATIC_PAGES.map((path, index) => ({
      loc: `${normalizedBase}${path}`,
      priority: index === 0 ? '1.0' : '0.9',
      changefreq: 'weekly',
    })),
    ...categories.map((cat) => ({
      loc: `${normalizedBase}/#/categories/${encodeURIComponent(cat.id)}`,
      priority: '0.8',
      changefreq: 'weekly',
    })),
    ...components.map((comp) => ({
      loc: `${normalizedBase}/#/component/${encodeURIComponent(comp.id)}`,
      priority: '0.8',
      changefreq: 'monthly',
    })),
  ];

  const entries = urls
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}
