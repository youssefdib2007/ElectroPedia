import { ArrowLeft, ArrowRight, BookOpen, RotateCcw, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ELECTRONIC_COMPONENTS } from '../data/componentsData';
import { GLOSSARY_ENTRIES } from '../data/glossaryData';
import { useI18n } from '../i18n/I18nContext';
import { getComponentName } from '../utils/catalogFilter';
import { filterAndSortGlossary, getGlossaryAlphabet } from '../utils/progressEngine';

interface GlossaryPageProps {
  onSelectComponentId: (id: string) => void;
}

export function GlossaryPage({ onSelectComponentId }: GlossaryPageProps) {
  const { locale, dir, t } = useI18n();
  const [query, setQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | 'all'>('all');

  useEffect(() => {
    setSelectedLetter('all');
  }, [locale]);

  const alphabet = useMemo(
    () => getGlossaryAlphabet(GLOSSARY_ENTRIES, locale),
    [locale]
  );

  const entries = useMemo(
    () => filterAndSortGlossary(GLOSSARY_ENTRIES, locale, query, selectedLetter),
    [locale, query, selectedLetter]
  );

  return (
    <section
      data-testid="page-glossary"
      className="bg-[#F8FAFC] dark:bg-[#0F172A] py-10 lg:py-14 min-h-[75vh]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-2 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>{t.glossary.eyebrow}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white">
            {t.glossary.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {t.glossary.subtitle}
          </p>
        </div>

        {/* Search + Alphabet Filter */}
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
                data-testid="glossary-search-input"
                placeholder={t.glossary.searchPlaceholder}
                className="w-full h-11 ps-10 pe-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] dark:focus:border-[#00BFFF]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono-tech text-slate-600 dark:text-slate-300">
              <span>{t.glossary.countLabel}</span>
              <strong className="text-[#2563EB] dark:text-[#00BFFF]">{entries.length}</strong>
              <span className="text-slate-400">/ {GLOSSARY_ENTRIES.length}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              data-testid="glossary-letter-all"
              onClick={() => setSelectedLetter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                selectedLetter === 'all'
                  ? 'bg-[#2563EB] border-[#2563EB] text-white'
                  : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#2563EB]'
              }`}
            >
              {t.glossary.allLetters}
            </button>
            {alphabet.map((letter) => (
              <button
                key={letter}
                type="button"
                data-testid={`glossary-letter-${letter}`}
                onClick={() => setSelectedLetter(letter)}
                className={`min-w-[2.1rem] px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                  selectedLetter === letter
                    ? 'bg-[#2563EB] border-[#2563EB] text-white'
                    : 'bg-white dark:bg-[#1E293B] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#2563EB]'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Entries List */}
        {entries.length === 0 ? (
          <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-10 text-center space-y-3">
            <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {t.glossary.emptyTitle}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{t.glossary.emptySubtitle}</p>
            <div>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedLetter('all');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.glossary.resetBtn}</span>
              </button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {entries.map((entry) => {
              const relatedComps = entry.relatedComponentIds
                .map((id) => ELECTRONIC_COMPONENTS.find((c) => c.id === id))
                .filter((item): item is NonNullable<typeof item> => Boolean(item));

              return (
                <Card
                  key={entry.id}
                  data-testid="glossary-entry-card"
                  className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                        {entry.term[locale]}
                      </h2>
                      {entry.abbreviation && (
                        <span
                          dir="ltr"
                          className="px-2.5 py-0.5 rounded bg-[#2563EB]/10 dark:bg-[#00BFFF]/15 text-[#2563EB] dark:text-[#00BFFF] font-mono-tech text-xs font-bold shrink-0"
                        >
                          {entry.abbreviation}
                        </span>
                      )}
                    </div>

                    {/* Trilingual equivalents */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span dir="rtl">AR: {entry.term.ar}</span>
                      <span dir="ltr">EN: {entry.term.en}</span>
                      <span dir="ltr">FR: {entry.term.fr}</span>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {entry.definition[locale]}
                    </p>
                  </div>

                  {relatedComps.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700/70 space-y-2">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {t.glossary.relatedTitle}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {relatedComps.map((comp) => (
                          <button
                            key={comp.id}
                            type="button"
                            onClick={() => onSelectComponentId(comp.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 hover:border-[#2563EB] text-xs font-semibold text-slate-800 dark:text-slate-100 cursor-pointer transition-colors"
                          >
                            <span>{getComponentName(comp, locale)}</span>
                            {dir === 'rtl' ? (
                              <ArrowLeft className="w-3 h-3 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
                            ) : (
                              <ArrowRight className="w-3 h-3 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
