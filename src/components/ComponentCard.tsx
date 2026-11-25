import { Bookmark, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useI18n } from '../i18n/I18nContext';
import type { ElectronicComponent } from '../types/electronics';
import { getComponentName } from '../utils/catalogFilter';
import { ComponentArtwork } from './ComponentArtwork';
import { OptimizedImage } from './OptimizedImage';

export type CardVisualMode = 'photo' | 'physical' | 'schematic';

interface ComponentCardProps {
  component: ElectronicComponent;
  categoryLabel: string;
  visualMode?: CardVisualMode;
  isSaved: boolean;
  onSelect: (component: ElectronicComponent) => void;
  onToggleBookmark: (id: string) => void;
}

export function ComponentCard({
  component,
  categoryLabel,
  visualMode = 'photo',
  isSaved,
  onSelect,
  onToggleBookmark,
}: ComponentCardProps) {
  const { locale, t } = useI18n();
  const primaryName = getComponentName(component, locale);
  const secondaryName = locale === 'ar' ? component.nameEn : component.nameAr;

  const difficultyTone =
    component.difficulty === 'beginner'
      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60'
      : component.difficulty === 'intermediate'
        ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60'
        : 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/60';

  return (
    <Card
      data-testid="component-card"
      className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 hover:border-[#2563EB] dark:hover:border-[#00BFFF] ring-0 rounded-xl flex flex-col justify-between transition-colors overflow-hidden p-0 gap-0"
    >
      {/* Visual Stage */}
      <div className="relative bg-[#F8FAFC] dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-700 h-44 blueprint-grid overflow-hidden">
        <button
          type="button"
          onClick={() => onSelect(component)}
          aria-label={`${t.encyclopedia.detailsBtn}: ${primaryName}`}
          className="w-full h-full flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB]"
        >
          {visualMode === 'photo' ? (
            <OptimizedImage
              src={component.imageUrl}
              alt={component.galleryImages[0]?.alt[locale] ?? primaryName}
              className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-300"
              fallback={
                <div className="w-44 h-28 mx-auto my-auto">
                  <ComponentArtwork artworkId={component.artworkId} mode="physical" />
                </div>
              }
            />
          ) : (
            <div className="w-44 h-28 p-2">
              <ComponentArtwork artworkId={component.artworkId} mode={visualMode} />
            </div>
          )}
        </button>

        <button
          type="button"
          data-testid={`favorite-btn-${component.id}`}
          onClick={() => onToggleBookmark(component.id)}
          aria-label={`${isSaved ? t.encyclopedia.removeTooltip : t.encyclopedia.saveTooltip}: ${primaryName}`}
          aria-pressed={isSaved}
          className={`absolute top-3 start-3 w-9 h-9 rounded-lg border flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB] ${
            isSaved
              ? 'bg-[#2563EB] border-[#2563EB] text-white'
              : 'bg-white/95 dark:bg-[#1E293B]/95 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-[#00BFFF] hover:border-[#2563EB]'
          }`}
        >
          <Bookmark
            className="w-4 h-4"
            fill={isSaved ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        </button>

        <span
          className="pointer-events-none absolute bottom-2.5 end-3 px-2 py-0.5 rounded bg-slate-950/75 text-white font-mono-tech text-[11px]"
          dir="ltr"
        >
          {component.symbolCode}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {categoryLabel}
            </span>
            <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${difficultyTone}`}>
              {t.difficulty[component.difficulty]}
            </span>
          </div>

          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {primaryName}
          </h3>
          <p
            className={`text-xs text-slate-500 dark:text-slate-400 mt-0.5 text-start ${
              locale === 'ar' ? 'font-mono-tech' : 'font-sans'
            }`}
          >
            {secondaryName}
          </p>

          <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed line-clamp-3">
            {component.shortDesc[locale]}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between gap-4">
          <span
            className="font-mono-tech text-xs text-slate-500 dark:text-slate-400 truncate"
            dir="ltr"
          >
            {component.specs[0]?.value} {component.specs[0]?.unit ?? ''}
          </span>

          <button
            type="button"
            onClick={() => onSelect(component)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-[#2563EB] hover:bg-[#2563EB] dark:hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          >
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.encyclopedia.detailsBtn}</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
