import { BookmarkX, HardDrive, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ComponentCard, type CardVisualMode } from '../components/ComponentCard';
import { COMPONENT_CATEGORIES } from '../data/componentsData';
import { useI18n } from '../i18n/I18nContext';
import type {
  ComponentCategoryId,
  DifficultyLevel,
  ElectronicComponent,
} from '../types/electronics';
import { filterComponents } from '../utils/catalogFilter';

interface FavoritesPageProps {
  savedComponents: ElectronicComponent[];
  savedIds: string[];
  onSelectComponent: (component: ElectronicComponent) => void;
  onToggleBookmark: (id: string) => void;
  onClearAll: () => void;
  onBrowseCatalog: () => void;
}

export function FavoritesPage({
  savedComponents,
  savedIds,
  onSelectComponent,
  onToggleBookmark,
  onClearAll,
  onBrowseCatalog,
}: FavoritesPageProps) {
  const { locale, t } = useI18n();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ComponentCategoryId | 'all'>('all');
  const [difficulty, setDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [visualMode, setVisualMode] = useState<CardVisualMode>('photo');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const filteredFavorites = useMemo(
    () =>
      filterComponents(savedComponents, {
        query,
        category,
        difficulty,
        sort: 'relevance',
        locale,
      }),
    [savedComponents, query, category, difficulty, locale]
  );

  return (
    <section
      data-testid="page-favorites"
      className="bg-[#F8FAFC] dark:bg-[#0F172A] py-10 lg:py-14 min-h-[75vh]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-2 max-w-3xl">
            <p className="font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider">
              {t.favorites.eyebrow}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
              {t.favorites.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.favorites.subtitle}
            </p>
          </div>

          {savedComponents.length > 0 && (
            <button
              type="button"
              data-testid="favorites-clear-all-btn"
              onClick={() => setConfirmClearOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-[#EF4444]/40 bg-white dark:bg-[#1E293B] text-[#EF4444] hover:bg-rose-50 dark:hover:bg-[#EF4444]/10 text-xs sm:text-sm font-semibold cursor-pointer shrink-0 transition-colors"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              <span>{t.favorites.clearAllBtn}</span>
            </button>
          )}
        </div>

        {/* Local Storage Notice */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-4 py-3 flex items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <HardDrive className="w-4 h-4 text-[#2563EB] dark:text-[#00BFFF] shrink-0" aria-hidden="true" />
          <span>{t.favorites.storageNotice}</span>
        </div>

        {/* Confirm Clear All Inline Modal */}
        {confirmClearOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-fav-title"
            className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-md bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-4">
              <h2 id="clear-fav-title" className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {t.favorites.clearConfirmTitle}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">{t.favorites.clearConfirmDesc}</p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmClearOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  {t.favorites.cancelBtn}
                </button>
                <button
                  type="button"
                  data-testid="favorites-confirm-clear"
                  onClick={() => {
                    onClearAll();
                    setConfirmClearOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#EF4444] hover:bg-rose-600 text-white text-xs sm:text-sm font-semibold cursor-pointer"
                >
                  {t.favorites.confirmBtn}
                </button>
              </div>
            </Card>
          </div>
        )}

        {savedComponents.length === 0 ? (
          <Card
            data-testid="favorites-empty"
            className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-12 text-center space-y-4"
          >
            <BookmarkX className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
              {t.favorites.emptyTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              {t.favorites.emptySubtitle}
            </p>
            <div>
              <button
                type="button"
                onClick={onBrowseCatalog}
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold cursor-pointer"
              >
                {t.favorites.browseBtn}
              </button>
            </div>
          </Card>
        ) : (
          <>
            {/* Search & Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-5 relative">
                <Search
                  className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  data-testid="favorites-search-input"
                  placeholder={t.favorites.searchPlaceholder}
                  className="w-full h-10 ps-10 pe-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  aria-label={t.favorites.allCategories}
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComponentCategoryId | 'all')}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-white"
                >
                  <option value="all">{t.favorites.allCategories}</option>
                  {COMPONENT_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label[locale]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <select
                  aria-label={t.favorites.allLevels}
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel | 'all')}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-white"
                >
                  <option value="all">{t.favorites.allLevels}</option>
                  <option value="beginner">{t.difficulty.beginner}</option>
                  <option value="intermediate">{t.difficulty.intermediate}</option>
                  <option value="advanced">{t.difficulty.advanced}</option>
                </select>
              </div>

              <div className="md:col-span-2 flex items-center justify-end gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] p-1">
                {(['photo', 'physical', 'schematic'] as CardVisualMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setVisualMode(mode)}
                    className={`flex-1 py-1.5 px-2 rounded text-[11px] font-semibold transition-colors cursor-pointer truncate ${
                      visualMode === mode
                        ? 'bg-[#2563EB] text-white'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {mode === 'photo'
                      ? t.favorites.photoView
                      : mode === 'physical'
                        ? t.favorites.physicalView
                        : t.favorites.schematicView}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-mono-tech text-slate-600 dark:text-slate-300">
              {t.favorites.countLabel}{' '}
              <strong className="text-[#2563EB] dark:text-[#00BFFF]">{filteredFavorites.length}</strong>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((comp) => {
                const catLabel =
                  COMPONENT_CATEGORIES.find((c) => c.id === comp.category)?.label[locale] ?? '';
                return (
                  <ComponentCard
                    key={comp.id}
                    component={comp}
                    categoryLabel={catLabel}
                    visualMode={visualMode}
                    isSaved={savedIds.includes(comp.id)}
                    onSelect={onSelectComponent}
                    onToggleBookmark={onToggleBookmark}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
