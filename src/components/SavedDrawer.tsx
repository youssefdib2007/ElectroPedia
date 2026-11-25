import { BookmarkX, Eye, Trash2, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet';
import { useI18n } from '../i18n/I18nContext';
import type { ElectronicComponent } from '../types/electronics';
import { getComponentName } from '../utils/catalogFilter';
import { ComponentArtwork } from './ComponentArtwork';

interface SavedDrawerProps {
  open: boolean;
  savedComponents: ElectronicComponent[];
  onClose: () => void;
  onInspect: (component: ElectronicComponent) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onOpenFavoritesPage?: () => void;
}

export function SavedDrawer({
  open,
  savedComponents,
  onClose,
  onInspect,
  onRemove,
  onClearAll,
  onOpenFavoritesPage,
}: SavedDrawerProps) {
  const { locale, dir, t } = useI18n();

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <SheetContent
        side={dir === 'rtl' ? 'left' : 'right'}
        showCloseButton={false}
        dir={dir}
        className="w-full max-w-md sm:max-w-md p-0 gap-0 bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 flex flex-col"
      >
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
          <div>
            <SheetTitle className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {t.savedDrawer.title}
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.savedDrawer.subtitle}
            </SheetDescription>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.savedDrawer.close}
            className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {savedComponents.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <BookmarkX
                className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto"
                aria-hidden="true"
              />
              <p className="font-display text-base font-bold text-slate-800 dark:text-slate-100">
                {t.savedDrawer.emptyTitle}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                {t.savedDrawer.emptySubtitle}
              </p>
            </div>
          ) : (
            savedComponents.map((comp) => {
              const primaryName = getComponentName(comp, locale);
              const secondaryName = locale === 'ar' ? comp.nameEn : comp.nameAr;
              return (
                <div
                  key={comp.id}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 bg-[#F8FAFC] dark:bg-[#0F172A] flex items-center gap-3.5"
                >
                  <div className="w-16 h-12 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 shrink-0">
                    <ComponentArtwork artworkId={comp.artworkId} mode="physical" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white truncate">
                      {primaryName}
                    </h3>
                    <p
                      className={`text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 text-start ${
                        locale === 'ar' ? 'font-mono-tech' : 'font-sans'
                      }`}
                    >
                      {secondaryName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onInspect(comp);
                      }}
                      aria-label={`${t.encyclopedia.detailsBtn}: ${primaryName}`}
                      className="w-9 h-9 rounded-lg bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-[#00BFFF] hover:border-[#2563EB] flex items-center justify-center cursor-pointer"
                    >
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(comp.id)}
                      aria-label={`${t.encyclopedia.removeTooltip}: ${primaryName}`}
                      className="w-9 h-9 rounded-lg bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-[#EF4444] hover:border-[#EF4444] flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0F172A] space-y-2.5">
          {onOpenFavoritesPage && (
            <button
              type="button"
              data-testid="drawer-open-favorites"
              onClick={() => {
                onClose();
                onOpenFavoritesPage();
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              {t.savedDrawer.openFavoritesPage}
            </button>
          )}

          {savedComponents.length > 0 && (
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono-tech text-xs text-slate-600 dark:text-slate-300">
                {t.savedDrawer.totalLabel} {savedComponents.length}
              </span>
              <button
                type="button"
                onClick={onClearAll}
                className="px-4 py-2 text-xs font-semibold text-[#EF4444] hover:bg-rose-50 dark:hover:bg-[#EF4444]/10 border border-rose-200 dark:border-[#EF4444]/30 rounded-lg transition-colors cursor-pointer"
              >
                {t.savedDrawer.clearAll}
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
