import { ArrowRight, Layers } from 'lucide-react';
import { COMPONENT_CATEGORIES } from '../data/componentsData';
import { useI18n } from '../i18n/I18nContext';
import type {
  ComponentCategoryId,
  DifficultyLevel,
  ElectronicComponent,
  SortOption,
} from '../types/electronics';
import { EncyclopediaSection } from '../components/EncyclopediaSection';
import { OptimizedImage } from '../components/OptimizedImage';

interface CategoriesPageProps {
  allComponents: ElectronicComponent[];
  filteredComponents: ElectronicComponent[];
  selectedCategory: ComponentCategoryId | 'all';
  selectedDifficulty: DifficultyLevel | 'all';
  searchQuery: string;
  sortBy: SortOption;
  savedIds: string[];
  onSelectCategory: (cat: ComponentCategoryId | 'all') => void;
  onSearchChange: (q: string) => void;
  onDifficultyChange: (diff: DifficultyLevel | 'all') => void;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
  onSelectComponent: (comp: ElectronicComponent) => void;
  onToggleBookmark: (id: string) => void;
  onOpenAllComponents: () => void;
}

export function CategoriesPage({
  allComponents,
  filteredComponents,
  selectedCategory,
  selectedDifficulty,
  searchQuery,
  sortBy,
  savedIds,
  onSelectCategory,
  onSearchChange,
  onDifficultyChange,
  onSortChange,
  onResetFilters,
  onSelectComponent,
  onToggleBookmark,
  onOpenAllComponents,
}: CategoriesPageProps) {
  const { locale, dir, t } = useI18n();
  const activeCatMeta =
    selectedCategory !== 'all'
      ? COMPONENT_CATEGORIES.find((c) => c.id === selectedCategory)
      : undefined;

  return (
    <div data-testid="page-categories">
      <section className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 py-10 lg:py-14 blueprint-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider">
                {t.pages.categories.eyebrow}
              </p>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                {activeCatMeta
                  ? `${t.pages.categories.selectedCategoryPrefix} ${activeCatMeta.label[locale]}`
                  : t.pages.categories.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
                {activeCatMeta ? activeCatMeta.summary[locale] : t.pages.categories.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => onSelectCategory('all')}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold rounded-lg hover:border-[#2563EB] cursor-pointer"
                >
                  {t.pages.categories.allDomainsBtn}
                </button>
              )}
              <button
                type="button"
                onClick={onOpenAllComponents}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-4 h-4" aria-hidden="true" />
                <span>{t.pages.categories.openInComponents}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMPONENT_CATEGORIES.map((cat) => {
              const count = allComponents.filter((c) => c.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                  className={`text-start rounded-xl border overflow-hidden transition-colors cursor-pointer flex flex-col ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-[#1E293B] border-[#2563EB] dark:border-[#00BFFF] ring-2 ring-[#2563EB]/25'
                      : 'bg-[#F8FAFC] dark:bg-[#1E293B] border-slate-200 dark:border-slate-700 hover:border-[#2563EB] dark:hover:border-[#00BFFF]'
                  }`}
                >
                  <div className="relative h-28 w-full border-b border-slate-200 dark:border-slate-700">
                    <OptimizedImage
                      src={cat.imageUrl}
                      alt={cat.imageAlt[locale]}
                      className="w-full h-full object-cover"
                    />
                    <span
                      dir="ltr"
                      className="absolute bottom-2 end-2 px-2 py-0.5 rounded bg-slate-950/75 text-white font-mono-tech text-[11px] font-semibold"
                    >
                      {count}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between gap-2">
                    <div>
                      <h2 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {cat.label[locale]}
                      </h2>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {cat.summary[locale]}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF]">
                      <span>{t.categoriesSection.browseAction}</span>
                      <ArrowRight
                        className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <EncyclopediaSection
        allComponents={allComponents}
        components={filteredComponents}
        totalCount={
          selectedCategory === 'all'
            ? allComponents.length
            : allComponents.filter((c) => c.category === selectedCategory).length
        }
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedDifficulty={selectedDifficulty}
        sortBy={sortBy}
        savedIds={savedIds}
        onSearchChange={onSearchChange}
        onCategoryChange={(cat) => onSelectCategory(cat)}
        onDifficultyChange={onDifficultyChange}
        onSortChange={onSortChange}
        onResetFilters={onResetFilters}
        onSelectComponent={onSelectComponent}
        onToggleBookmark={onToggleBookmark}
        hideCategoryTabs
      />
    </div>
  );
}
