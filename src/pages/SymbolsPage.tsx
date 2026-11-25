import { ArrowLeft, ArrowRight, RotateCcw, Search, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { SymbolSvgRenderer } from '../components/SymbolSvgRenderer';
import { ELECTRICAL_SYMBOLS, SYMBOL_DOMAINS } from '../data/symbolsData';
import { useI18n } from '../i18n/I18nContext';
import type { SymbolDomainId, SymbolStandard } from '../types/electronics';
import { filterSymbols } from '../utils/progressEngine';

interface SymbolsPageProps {
  onSelectComponentId: (id: string) => void;
}

export function SymbolsPage({ onSelectComponentId }: SymbolsPageProps) {
  const { locale, dir, t } = useI18n();
  const [selectedDomain, setSelectedDomain] = useState<SymbolDomainId | 'all'>('all');
  const [standard, setStandard] = useState<SymbolStandard>('iec');
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => filterSymbols(ELECTRICAL_SYMBOLS, selectedDomain, query),
    [selectedDomain, query]
  );

  return (
    <section
      data-testid="page-symbols"
      className="bg-[#F8FAFC] dark:bg-[#0F172A] py-10 lg:py-14 min-h-[75vh]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider">
              <Zap className="w-4 h-4" aria-hidden="true" />
              <span>{t.symbols.eyebrow}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
              {t.symbols.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.symbols.subtitle}
            </p>
          </div>

          {/* Standard Switcher (IEC 60617 vs ANSI / IEEE Std 315) */}
          <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.symbols.standardLabel}
            </span>
            <div
              role="group"
              aria-label={t.symbols.standardLabel}
              className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] p-1"
            >
              <button
                type="button"
                data-testid="symbol-standard-iec"
                onClick={() => setStandard('iec')}
                aria-pressed={standard === 'iec'}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  standard === 'iec'
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.symbols.iecLabel}
              </button>
              <button
                type="button"
                data-testid="symbol-standard-ansi"
                onClick={() => setStandard('ansi')}
                aria-pressed={standard === 'ansi'}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  standard === 'ansi'
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.symbols.ansiLabel}
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-xl">
              <Search
                className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-testid="symbols-search-input"
                placeholder={t.symbols.searchPlaceholder}
                className="w-full h-11 ps-10 pe-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] dark:focus:border-[#00BFFF]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono-tech text-slate-600 dark:text-slate-300">
              <span>{t.symbols.countLabel}</span>
              <strong className="text-[#2563EB] dark:text-[#00BFFF]">{filtered.length}</strong>
              <span className="text-slate-400">/ {ELECTRICAL_SYMBOLS.length}</span>
            </div>
          </div>

          {/* 9-Domain Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              data-testid="symbol-domain-all"
              onClick={() => setSelectedDomain('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                selectedDomain === 'all'
                  ? 'bg-[#2563EB] border-[#2563EB] text-white'
                  : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#2563EB]'
              }`}
            >
              {t.symbols.allDomains}
            </button>
            {SYMBOL_DOMAINS.map((dom) => {
              const active = selectedDomain === dom.id;
              return (
                <button
                  key={dom.id}
                  type="button"
                  data-testid={`symbol-domain-${dom.id}`}
                  onClick={() => setSelectedDomain(dom.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#2563EB] border-[#2563EB] text-white'
                      : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#2563EB]'
                  }`}
                >
                  {dom.label[locale]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Symbol Cards Grid */}
        {filtered.length === 0 ? (
          <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-10 text-center space-y-3">
            <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {t.symbols.emptyTitle}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{t.symbols.emptySubtitle}</p>
            <div>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedDomain('all');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.symbols.resetBtn}</span>
              </button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((sym) => {
              const domainLabel =
                SYMBOL_DOMAINS.find((d) => d.id === sym.domain)?.label[locale] ?? sym.domain;
              const activeCode =
                standard === 'ansi' && sym.ansiCode ? sym.ansiCode : sym.iecCode;

              return (
                <Card
                  key={sym.id}
                  data-testid="symbol-card"
                  className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 hover:border-[#2563EB] dark:hover:border-[#00BFFF] ring-0 overflow-hidden p-0 gap-0 flex flex-col justify-between transition-colors"
                >
                  {/* Vector Schematic Box */}
                  <div className="relative bg-[#F8FAFC] dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-700 h-40 blueprint-grid flex items-center justify-center p-4">
                    <SymbolSvgRenderer
                      svgKey={sym.svgKey}
                      standard={standard}
                      className="w-48 h-28"
                    />
                    <span
                      className="absolute top-2.5 start-3 px-2 py-0.5 rounded bg-white/95 dark:bg-[#1E293B]/95 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200"
                    >
                      {domainLabel}
                    </span>
                    <span
                      dir="ltr"
                      className="absolute bottom-2.5 end-3 px-2 py-0.5 rounded bg-[#2563EB] text-white font-mono-tech text-[11px] font-semibold uppercase"
                    >
                      {standard}
                    </span>
                  </div>

                  {/* Info Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <div>
                        <p
                          dir="ltr"
                          className="font-mono-tech text-xs font-bold text-[#2563EB] dark:text-[#00BFFF] mb-1"
                        >
                          {activeCode}
                        </p>
                        <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                          {sym.name[locale]}
                        </h2>
                      </div>

                      {/* Trilingual quick strip */}
                      <div className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 space-y-1 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono-tech text-[10px] font-bold text-[#2563EB] dark:text-[#00BFFF]">AR</span>
                          <span className="text-slate-800 dark:text-slate-200 truncate" dir="rtl">{sym.name.ar}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono-tech text-[10px] font-bold text-[#2563EB] dark:text-[#00BFFF]">EN</span>
                          <span className="text-slate-700 dark:text-slate-300 truncate" dir="ltr">{sym.name.en}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono-tech text-[10px] font-bold text-[#2563EB] dark:text-[#00BFFF]">FR</span>
                          <span className="text-slate-700 dark:text-slate-300 truncate" dir="ltr">{sym.name.fr}</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        <strong className="text-slate-800 dark:text-slate-100">{t.symbols.functionLabel} </strong>
                        {sym.functionDesc[locale]}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {sym.standardNote[locale]}
                      </p>
                    </div>

                    {sym.linkedComponentId && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            if (sym.linkedComponentId) {
                              onSelectComponentId(sym.linkedComponentId);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <span>{t.symbols.viewComponentBtn}</span>
                          {dir === 'rtl' ? (
                            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                          ) : (
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
