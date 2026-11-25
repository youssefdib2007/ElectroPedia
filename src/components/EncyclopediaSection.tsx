import { useState } from 'react';
import { COMPONENT_CATEGORIES } from '../data/componentsData';
import { useI18n } from '../i18n/I18nContext';
import type {
  ComponentCategoryId,
  DifficultyLevel,
  ElectronicComponent,
  SortOption,
} from '../types/electronics';
import { ComponentCard, type CardVisualMode } from './ComponentCard';
import { SmartSearchBar } from './SmartSearchBar';
import { EmptyState } from './StateFeedback';

interface EncyclopediaSectionProps {
  allComponents: ElectronicComponent[];
  components: ElectronicComponent[];
  totalCount: number;
  searchQuery: string;
  selectedCategory: ComponentCategoryId | 'all';
  selectedDifficulty: DifficultyLevel | 'all';
  sortBy: SortOption;
  savedIds: string[];
  onSearchChange: (q: string) => void;
  onCategoryChange: (cat: ComponentCategoryId | 'all') => void;
  onDifficultyChange: (diff: DifficultyLevel | 'all') => void;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
  onSelectComponent: (component: ElectronicComponent) => void;
  onToggleBookmark: (id: string) => void;
  hideCategoryTabs?: boolean;
}

export function EncyclopediaSection({
  allComponents,
  components,
  totalCount,
  searchQuery,
  selectedCategory,
  selectedDifficulty,
  sortBy,
  savedIds,
  onSearchChange,
  onCategoryChange,
  onDifficultyChange,
  onSortChange,
  onResetFilters,
  onSelectComponent,
  onToggleBookmark,
  hideCategoryTabs = false,
}: EncyclopediaSectionProps) {
  const [globalVisualMode, setGlobalVisualMode] = useState<CardVisualMode>('photo');
  const { locale, t } = useI18n();

  const categoryMap = Object.fromEntries(
    COMPONENT_CATEGORIES.map((c) => [c.id, c.label[locale]])
  );

  const countLabel = t.encyclopedia.showingCount
    .replace('{shown}', String(components.length))
    .replace('{total}', String(totalCount));

  return (
    <section
      id="encyclopedia"
      className="bg-[#F8FAFC] dark:bg-[#0F172A]/85 border-b border-slate-200 dark:border-slate-800 py-10 lg:py-14"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & View Mode Segmented Switch */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider">
              {t.encyclopedia.eyebrow}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {t.encyclopedia.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {t.encyclopedia.subtitle}
            </p>
          </div>

          <div
            className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-lg self-start lg:self-auto"
            role="group"
            aria-label={t.encyclopedia.eyebrow}
          >
            {(
              [
                { id: 'photo', label: t.encyclopedia.photoView },
                { id: 'physical', label: t.encyclopedia.physicalView },
                { id: 'schematic', label: t.encyclopedia.schematicView },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setGlobalVisualMode(mode.id)}
                aria-pressed={globalVisualMode === mode.id}
                className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  globalVisualMode === mode.id
                    ? 'bg-white dark:bg-[#2563EB] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Smart Search, Level Filter, Sort & Category Controls */}
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 mb-8 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-6">
              <SmartSearchBar
                id="catalog-search"
                components={allComponents}
                value={searchQuery}
                onChange={onSearchChange}
                onSelectComponent={onSelectComponent}
                categoryFilter={selectedCategory}
                difficultyFilter={selectedDifficulty}
                placeholder={t.encyclopedia.searchPlaceholder}
                inputClassName="h-11 bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:bg-white dark:focus:bg-[#0F172A] focus:border-[#2563EB] dark:focus:border-[#00BFFF]"
              />
            </div>

            <div className="lg:col-span-6 flex flex-wrap items-center justify-between lg:justify-end gap-3">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="difficulty-select"
                  className="text-xs font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap"
                >
                  {t.encyclopedia.levelFilterLabel}
                </label>
                <select
                  id="difficulty-select"
                  data-testid="difficulty-select"
                  value={selectedDifficulty}
                  onChange={(e) => onDifficultyChange(e.target.value as DifficultyLevel | 'all')}
                  className="h-11 px-3 bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#00BFFF] cursor-pointer"
                >
                  <option value="all">{t.encyclopedia.allLevels}</option>
                  <option value="beginner">{t.difficulty.beginner}</option>
                  <option value="intermediate">{t.difficulty.intermediate}</option>
                  <option value="advanced">{t.difficulty.advanced}</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort-select"
                  className="text-xs font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap"
                >
                  {t.encyclopedia.sortLabel}
                </label>
                <select
                  id="sort-select"
                  data-testid="sort-select"
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value as SortOption)}
                  className="h-11 px-3 bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#00BFFF] cursor-pointer"
                >
                  <option value="relevance">{t.encyclopedia.sortRelevance}</option>
                  <option value="name-asc">{t.encyclopedia.sortNameAsc}</option>
                  <option value="name-desc">{t.encyclopedia.sortNameDesc}</option>
                  <option value="difficulty-asc">{t.encyclopedia.sortDiffAsc}</option>
                  <option value="difficulty-desc">{t.encyclopedia.sortDiffDesc}</option>
                </select>
              </div>

              <span
                data-testid="catalog-count"
                className="font-mono-tech text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap"
              >
                {countLabel}
              </span>
            </div>
          </div>

          {/* Interactive Category Tabs */}
          {!hideCategoryTabs && (
            <div
              className="flex items-center gap-2 overflow-x-auto pb-1"
              role="tablist"
              aria-label={t.categoriesSection.eyebrow}
            >
              <button
                type="button"
                role="tab"
                aria-selected={selectedCategory === 'all'}
                onClick={() => onCategoryChange('all')}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {t.encyclopedia.allCategories}
              </button>
              {COMPONENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat.id}
                  onClick={() => onCategoryChange(cat.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-slate-100 dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.label[locale]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Component Cards Grid or Empty State */}
        {components.length === 0 ? (
          <EmptyState onAction={onResetFilters} />
        ) : (
          <div
            data-testid="component-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {components.map((component) => (
              <ComponentCard
                key={component.id}
                component={component}
                categoryLabel={categoryMap[component.category] ?? ''}
                visualMode={globalVisualMode}
                isSaved={savedIds.includes(component.id)}
                onSelect={onSelectComponent}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
