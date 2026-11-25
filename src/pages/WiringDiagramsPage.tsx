import {
  ArrowLeft,
  ArrowRight,
  Cable,
  Cpu,
  RotateCcw,
  ShieldAlert,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { WiringLibrarySvg } from '../components/WiringLibrarySvg';
import {
  WIRING_LIBRARY_CATEGORIES,
  WIRING_LIBRARY_ITEMS,
} from '../data/wiringLibraryData';
import { useI18n } from '../i18n/I18nContext';
import type { WiringLibraryCategory } from '../types/electronics';

interface WiringDiagramsPageProps {
  onSelectComponentId: (id: string) => void;
}

export function WiringDiagramsPage({ onSelectComponentId }: WiringDiagramsPageProps) {
  const { locale, dir, t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<WiringLibraryCategory | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string>(WIRING_LIBRARY_ITEMS[0].id);
  const [zoom, setZoom] = useState<number>(1);

  const visibleCircuits = useMemo(
    () =>
      selectedCategory === 'all'
        ? WIRING_LIBRARY_ITEMS
        : WIRING_LIBRARY_ITEMS.filter((item) => item.category === selectedCategory),
    [selectedCategory]
  );

  const activeCircuit =
    visibleCircuits.find((c) => c.id === selectedId) ?? visibleCircuits[0] ?? WIRING_LIBRARY_ITEMS[0];

  const handleCategoryChange = (cat: WiringLibraryCategory | 'all') => {
    setSelectedCategory(cat);
    const list =
      cat === 'all'
        ? WIRING_LIBRARY_ITEMS
        : WIRING_LIBRARY_ITEMS.filter((item) => item.category === cat);
    if (list.length > 0 && !list.some((item) => item.id === selectedId)) {
      setSelectedId(list[0].id);
      setZoom(1);
    }
  };

  const handleZoomIn = () => setZoom((z) => Math.min(2.5, Number((z + 0.25).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.75, Number((z - 0.25).toFixed(2))));

  return (
    <section
      data-testid="page-wiring-diagrams"
      className="bg-[#F8FAFC] dark:bg-[#0F172A] py-10 lg:py-14 min-h-[75vh]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider">
            <Cable className="w-4 h-4" aria-hidden="true" />
            <span>{t.wiringLibrary.eyebrow}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
            {t.wiringLibrary.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {t.wiringLibrary.subtitle}
          </p>
        </div>

        {/* 8-Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            data-testid="wiring-cat-all"
            onClick={() => handleCategoryChange('all')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#2563EB] border-[#2563EB] text-white'
                : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#2563EB]'
            }`}
          >
            {t.wiringLibrary.allCategories}
          </button>
          {WIRING_LIBRARY_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                data-testid={`wiring-cat-${cat.id}`}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#2563EB] border-[#2563EB] text-white'
                    : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#2563EB]'
                }`}
              >
                {cat.label[locale]}
              </button>
            );
          })}
        </div>

        {/* Master-Detail Schematic Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Circuit Selector Sidebar */}
          <div className="lg:col-span-4 space-y-2.5">
            {visibleCircuits.map((item) => {
              const active = item.id === activeCircuit.id;
              const catLabel =
                WIRING_LIBRARY_CATEGORIES.find((c) => c.id === item.category)?.label[locale] ?? '';
              return (
                <button
                  key={item.id}
                  type="button"
                  data-testid={`wiring-select-${item.id}`}
                  onClick={() => {
                    setSelectedId(item.id);
                    setZoom(1);
                  }}
                  className={`w-full text-start rounded-xl border p-4 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-sm'
                      : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-[#2563EB]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono-tech mb-1">
                    <span className={active ? 'text-blue-100' : 'text-[#2563EB] dark:text-[#00BFFF]'}>
                      {catLabel}
                    </span>
                    <span dir="ltr" className={active ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}>
                      {item.voltageRating}
                    </span>
                  </div>
                  <p className="font-display text-sm font-bold leading-snug">{item.title[locale]}</p>
                  <p
                    className={`text-xs mt-1 line-clamp-2 ${
                      active ? 'text-blue-50' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {item.summary[locale]}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Schematic Canvas + Engineering Notes */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-5 space-y-4">
              {/* Top Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {activeCircuit.title[locale]}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>
                      {t.wiringLibrary.voltageLabel}{' '}
                      <strong className="font-mono-tech text-slate-800 dark:text-slate-200" dir="ltr">
                        {activeCircuit.voltageRating}
                      </strong>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {t.wiringLibrary.standardLabel}{' '}
                      <strong className="font-mono-tech text-[#2563EB] dark:text-[#00BFFF]" dir="ltr">
                        {activeCircuit.standardRef}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Interactive Zoom Controls */}
                <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0F172A] p-1 shrink-0">
                  <button
                    type="button"
                    data-testid="wiring-zoom-out"
                    onClick={handleZoomOut}
                    aria-label={t.wiringLibrary.zoomOut}
                    disabled={zoom <= 0.75}
                    className="p-1.5 rounded-md hover:bg-white dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer"
                  >
                    <ZoomOut className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <span
                    data-testid="wiring-zoom-value"
                    dir="ltr"
                    className="px-2 font-mono-tech text-xs font-bold text-slate-800 dark:text-slate-100 min-w-[3.2rem] text-center"
                  >
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    type="button"
                    data-testid="wiring-zoom-in"
                    onClick={handleZoomIn}
                    aria-label={t.wiringLibrary.zoomIn}
                    disabled={zoom >= 2.5}
                    className="p-1.5 rounded-md hover:bg-white dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer"
                  >
                    <ZoomIn className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    data-testid="wiring-zoom-reset"
                    onClick={() => setZoom(1)}
                    aria-label={t.wiringLibrary.resetZoom}
                    className="p-1.5 rounded-md hover:bg-white dark:hover:bg-[#1E293B] text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Scrollable / Zoomable Viewport */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0F172A] blueprint-grid overflow-auto max-h-[430px] p-4">
                <div
                  style={{
                    width: `${Math.round(zoom * 100)}%`,
                    minWidth: '100%',
                  }}
                  className="mx-auto transition-[width] duration-200"
                >
                  <WiringLibrarySvg svgId={activeCircuit.svgId} className="w-full h-auto" />
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.wiringLibrary.explanationTitle}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeCircuit.explanation[locale]}
                </p>
              </div>
            </Card>

            {/* Components Used + Symbols + Safety */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-5 space-y-3">
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
                  <span>{t.wiringLibrary.componentsTitle}</span>
                </h3>
                <ul className="space-y-2">
                  {activeCircuit.componentsUsed.map((comp) => {
                    const targetId = comp.componentId;
                    return (
                      <li key={`${targetId ?? comp.name.en}-${comp.symbolCode}`}>
                        {targetId ? (
                          <button
                            type="button"
                            onClick={() => onSelectComponentId(targetId)}
                            className="w-full flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 hover:border-[#2563EB] text-start text-xs sm:text-sm cursor-pointer transition-colors"
                          >
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-900 dark:text-white block truncate">
                                {comp.name[locale]}
                              </span>
                              <span className="font-mono-tech text-[11px] text-[#2563EB] dark:text-[#00BFFF]" dir="ltr">
                                {comp.symbolCode}
                              </span>
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] shrink-0">
                              <span>{t.wiringLibrary.viewComponentBtn}</span>
                              {dir === 'rtl' ? (
                                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                              ) : (
                                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                              )}
                            </span>
                          </button>
                        ) : (
                          <div className="w-full flex items-center justify-between gap-2 p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-start text-xs sm:text-sm">
                            <div className="min-w-0">
                              <span className="font-semibold text-slate-900 dark:text-white block truncate">
                                {comp.name[locale]}
                              </span>
                              <span className="font-mono-tech text-[11px] text-[#2563EB] dark:text-[#00BFFF]" dir="ltr">
                                {comp.symbolCode}
                              </span>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/70">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
                    {t.wiringLibrary.symbolsTitle}
                  </p>
                  <div className="flex flex-wrap gap-1.5" dir="ltr">
                    {activeCircuit.symbolsUsed.map((sym) => (
                      <span
                        key={sym}
                        className="px-2.5 py-1 rounded bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 font-mono-tech text-[11px] font-semibold text-slate-700 dark:text-slate-200"
                      >
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="bg-amber-50/70 dark:bg-[#1E293B] border border-amber-200 dark:border-[#EF4444]/40 ring-0 p-5 space-y-3">
                <h3 className="font-display text-base font-bold text-amber-900 dark:text-rose-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#EF4444]" aria-hidden="true" />
                  <span>{t.wiringLibrary.safetyTitle}</span>
                </h3>
                <ul className="space-y-2.5 text-sm text-amber-950 dark:text-slate-200">
                  {activeCircuit.safetyPrecautions.map((tip) => (
                    <li key={tip.en} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#EF4444] font-bold">!</span>
                      <span>{tip[locale]}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
