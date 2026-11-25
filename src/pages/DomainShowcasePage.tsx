import { Cpu, Wrench } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ComponentCard, type CardVisualMode } from '../components/ComponentCard';
import { SmartSearchBar } from '../components/SmartSearchBar';
import { EmptyState } from '../components/StateFeedback';
import { COMPONENT_CATEGORIES } from '../data/componentsData';
import { useI18n } from '../i18n/I18nContext';
import type { DifficultyLevel, ElectronicComponent, SortOption } from '../types/electronics';
import { filterComponents } from '../utils/catalogFilter';

interface DomainShowcasePageProps {
  domain: 'electronics' | 'tools';
  allComponents: ElectronicComponent[];
  savedIds: string[];
  onSelectComponent: (comp: ElectronicComponent) => void;
  onToggleBookmark: (id: string) => void;
}

const PASSIVE_IDS = new Set(['resistors', 'capacitors', 'inductors']);
const ACTIVE_IDS = new Set(['diodes', 'leds', 'transistors', 'mosfets', 'thyristors']);

const MEASUREMENT_IDS = new Set([
  'multimeter',
  'clamp-meter',
  'voltage-tester',
  'oscilloscope',
  'insulation-resistance-tester',
]);

export function DomainShowcasePage({
  domain,
  allComponents,
  savedIds,
  onSelectComponent,
  onToggleBookmark,
}: DomainShowcasePageProps) {
  const { locale, t } = useI18n();
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [visualMode, setVisualMode] = useState<CardVisualMode>('photo');

  const categoryMeta = COMPONENT_CATEGORIES.find((c) => c.id === domain);
  const copy = domain === 'electronics' ? t.pages.electronics : t.pages.electricalTools;

  const domainComponents = useMemo(
    () => allComponents.filter((c) => c.category === domain),
    [allComponents, domain]
  );

  const filtered = useMemo(
    () =>
      filterComponents(domainComponents, {
        query,
        category: domain,
        difficulty,
        sort: sortBy,
        locale,
      }),
    [domainComponents, query, domain, difficulty, sortBy, locale]
  );

  const groups = useMemo(() => {
    if (domain === 'electronics') {
      return [
        {
          heading: t.pages.electronics.passiveHeading,
          desc: t.pages.electronics.passiveDesc,
          items: filtered.filter((c) => PASSIVE_IDS.has(c.id)),
        },
        {
          heading: t.pages.electronics.activeHeading,
          desc: t.pages.electronics.activeDesc,
          items: filtered.filter((c) => ACTIVE_IDS.has(c.id)),
        },
        {
          heading: t.pages.electronics.digitalHeading,
          desc: t.pages.electronics.digitalDesc,
          items: filtered.filter((c) => !PASSIVE_IDS.has(c.id) && !ACTIVE_IDS.has(c.id)),
        },
      ].filter((g) => g.items.length > 0);
    }

    return [
      {
        heading: t.pages.electricalTools.measurementHeading,
        desc: t.pages.electricalTools.measurementDesc,
        items: filtered.filter((c) => MEASUREMENT_IDS.has(c.id)),
      },
      {
        heading: t.pages.electricalTools.insulatedHeading,
        desc: t.pages.electricalTools.insulatedDesc,
        items: filtered.filter((c) => !MEASUREMENT_IDS.has(c.id) && c.id !== 'ppe'),
      },
      {
        heading: t.pages.electricalTools.ppeHeading,
        desc: t.pages.electricalTools.ppeDesc,
        items: filtered.filter((c) => c.id === 'ppe'),
      },
    ].filter((g) => g.items.length > 0);
  }, [domain, filtered, t]);

  const Icon = domain === 'electronics' ? Cpu : Wrench;

  return (
    <div data-testid={`page-${domain}`}>
      <section className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 py-10 lg:py-14 blueprint-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider">
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{copy.eyebrow}</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mt-1.5">
                {copy.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {copy.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-lg self-start lg:self-auto">
              {(
                [
                  { id: 'photo', label: t.encyclopedia.photoView },
                  { id: 'physical', label: t.encyclopedia.physicalView },
                  { id: 'schematic', label: t.encyclopedia.schematicView },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setVisualMode(m.id)}
                  aria-pressed={visualMode === m.id}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    visualMode === m.id
                      ? 'bg-white dark:bg-[#2563EB] text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search, Difficulty & Sort Toolbar */}
          <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-6">
              <SmartSearchBar
                id={`${domain}-search`}
                components={domainComponents}
                value={query}
                onChange={setQuery}
                onSelectComponent={onSelectComponent}
                categoryFilter={domain}
                difficultyFilter={difficulty}
                placeholder={t.encyclopedia.searchPlaceholder}
                inputClassName="h-11 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#00BFFF]"
              />
            </div>

            <div className="lg:col-span-6 flex flex-wrap items-center justify-between lg:justify-end gap-3">
              <select
                aria-label={t.encyclopedia.levelFilterLabel}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel | 'all')}
                className="h-11 px-3 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg text-xs sm:text-sm text-slate-800 dark:text-slate-100 cursor-pointer"
              >
                <option value="all">{t.encyclopedia.allLevels}</option>
                <option value="beginner">{t.difficulty.beginner}</option>
                <option value="intermediate">{t.difficulty.intermediate}</option>
                <option value="advanced">{t.difficulty.advanced}</option>
              </select>

              <select
                aria-label={t.encyclopedia.sortLabel}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-11 px-3 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg text-xs sm:text-sm text-slate-800 dark:text-slate-100 cursor-pointer"
              >
                <option value="relevance">{t.encyclopedia.sortRelevance}</option>
                <option value="name-asc">{t.encyclopedia.sortNameAsc}</option>
                <option value="name-desc">{t.encyclopedia.sortNameDesc}</option>
                <option value="difficulty-asc">{t.encyclopedia.sortDiffAsc}</option>
                <option value="difficulty-desc">{t.encyclopedia.sortDiffDesc}</option>
              </select>

              <span className="font-mono-tech text-xs text-slate-500 dark:text-slate-400">
                {t.encyclopedia.showingCount
                  .replace('{shown}', String(filtered.length))
                  .replace('{total}', String(domainComponents.length))}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFC] dark:bg-[#0F172A]/85 py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {filtered.length === 0 ? (
            <EmptyState
              onAction={() => {
                setQuery('');
                setDifficulty('all');
              }}
            />
          ) : (
            groups.map((group) => (
              <div key={group.heading} className="space-y-5">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {group.heading}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{group.desc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.items.map((comp) => (
                    <ComponentCard
                      key={comp.id}
                      component={comp}
                      categoryLabel={categoryMeta?.label[locale] ?? ''}
                      visualMode={visualMode}
                      isSaved={savedIds.includes(comp.id)}
                      onSelect={onSelectComponent}
                      onToggleBookmark={onToggleBookmark}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
