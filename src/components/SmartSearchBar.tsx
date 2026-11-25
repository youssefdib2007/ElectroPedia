import { ArrowUpRight, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { COMPONENT_CATEGORIES } from '../data/componentsData';
import { useI18n } from '../i18n/I18nContext';
import type {
  ComponentCategoryId,
  DifficultyLevel,
  ElectronicComponent,
} from '../types/electronics';
import { getComponentName, getSearchSuggestions } from '../utils/catalogFilter';
import { ComponentArtwork } from './ComponentArtwork';
import { OptimizedImage } from './OptimizedImage';

interface SmartSearchBarProps {
  id: string;
  components: ElectronicComponent[];
  value: string;
  onChange: (value: string) => void;
  onSelectComponent: (component: ElectronicComponent) => void;
  onSubmitSearch?: () => void;
  categoryFilter?: ComponentCategoryId | 'all';
  difficultyFilter?: DifficultyLevel | 'all';
  placeholder?: string;
  inputClassName?: string;
  showClear?: boolean;
  submitButton?: React.ReactNode;
}

export function SmartSearchBar({
  id,
  components,
  value,
  onChange,
  onSelectComponent,
  onSubmitSearch,
  categoryFilter = 'all',
  difficultyFilter = 'all',
  placeholder,
  inputClassName = '',
  showClear = true,
  submitButton,
}: SmartSearchBarProps) {
  const { locale, dir, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const categoryLabels = useMemo(
    () => Object.fromEntries(COMPONENT_CATEGORIES.map((c) => [c.id, c.label[locale]])),
    [locale]
  );

  const suggestions = useMemo(
    () =>
      getSearchSuggestions(components, value, {
        category: categoryFilter,
        difficulty: difficultyFilter,
        limit: 6,
      }),
    [components, value, categoryFilter, difficultyFilter]
  );

  useEffect(() => {
    setActiveIndex(-1);
  }, [value]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const showDropdown = open && value.trim().length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault();
      setOpen(false);
      onSelectComponent(suggestions[activeIndex].component);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="relative flex-1">
          <label htmlFor={id} className="sr-only">
            {placeholder ?? t.encyclopedia.searchPlaceholder}
          </label>
          <Search
            className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${
              dir === 'rtl' ? 'right-3.5' : 'left-3.5'
            }`}
            aria-hidden="true"
          />
          <input
            id={id}
            type="text"
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls={`${id}-listbox`}
            aria-autocomplete="list"
            value={value}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder ?? t.encyclopedia.searchPlaceholder}
            className={`w-full ${
              dir === 'rtl' ? 'pr-11 pl-9' : 'pl-11 pr-9'
            } ${inputClassName}`}
          />
          {showClear && value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              aria-label={t.encyclopedia.resetFilters}
              className={`absolute top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer ${
                dir === 'rtl' ? 'left-2.5' : 'right-2.5'
              }`}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
        {submitButton}
      </div>

      {showDropdown && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          data-testid="search-suggestions-dropdown"
          className="absolute z-50 inset-x-0 mt-2 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-700/70 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span>{t.encyclopedia.suggestionsTitle}</span>
            <span className="font-mono-tech">{suggestions.length}</span>
          </div>

          {suggestions.length === 0 ? (
            <div className="px-4 py-5 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.encyclopedia.emptyTitle}
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-700/60 max-h-80 overflow-y-auto">
              {suggestions.map(({ component, matchedFuzzy }, index) => {
                const primaryName = getComponentName(component, locale);
                const secondaryName = locale === 'ar' ? component.nameEn : component.nameAr;
                const isActive = index === activeIndex;

                return (
                  <li key={component.id} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      data-testid={`suggestion-item-${component.id}`}
                      onClick={() => {
                        setOpen(false);
                        onSelectComponent(component);
                      }}
                      className={`w-full px-3.5 py-2.5 flex items-center gap-3 text-start transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-blue-50 dark:bg-slate-800'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-[#0F172A] shrink-0">
                        <OptimizedImage
                          src={component.imageUrl}
                          alt={primaryName}
                          priority
                          className="w-full h-full object-cover"
                          fallback={
                            <div className="w-full h-full p-1">
                              <ComponentArtwork artworkId={component.artworkId} mode="physical" />
                            </div>
                          }
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-display text-sm font-bold text-slate-900 dark:text-white truncate">
                            {primaryName}
                          </span>
                          {matchedFuzzy && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 shrink-0">
                              {t.encyclopedia.fuzzyHint}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="truncate">{secondaryName}</span>
                          <span aria-hidden="true">·</span>
                          <span>{categoryLabels[component.category]}</span>
                          <span aria-hidden="true">·</span>
                          <span>{t.difficulty[component.difficulty]}</span>
                        </div>
                      </div>

                      <ArrowUpRight
                        className={`w-4 h-4 text-slate-400 shrink-0 ${
                          dir === 'rtl' ? '-scale-x-100' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {onSubmitSearch && suggestions.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onSubmitSearch();
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-700 text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] hover:underline text-center cursor-pointer"
            >
              {t.encyclopedia.viewAllResults}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
