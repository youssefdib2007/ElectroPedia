import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import type { ElectronicComponent } from '../types/electronics';
import { SmartSearchBar } from './SmartSearchBar';

interface HeroSectionProps {
  components: ElectronicComponent[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectComponent: (component: ElectronicComponent) => void;
  onJumpToEncyclopedia: () => void;
  onJumpToLevels: () => void;
}

export function HeroSection({
  components,
  searchQuery,
  onSearchChange,
  onSelectComponent,
  onJumpToEncyclopedia,
  onJumpToLevels,
}: HeroSectionProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const { locale, dir, t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onJumpToEncyclopedia();
  };

  const quickTerms =
    locale === 'ar'
      ? ['المقاومة', 'MOSFET', 'PLC', 'الألواح الشمسية']
      : locale === 'fr'
        ? ['Résistance', 'MOSFET', 'PLC', 'Solaire']
        : ['Resistor', 'MOSFET', 'PLC', 'Solar'];

  return (
    <section
      id="hero"
      className="bg-[#F8FAFC] dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 blueprint-grid"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Editorial Text, Smart Central Search & Dual CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="lg:col-span-6 flex flex-col justify-between gap-7"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm font-semibold text-[#2563EB] dark:text-[#00BFFF]">
                <span className="font-mono-tech uppercase tracking-wider" dir="ltr">
                  {t.hero.slogan}
                </span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {t.hero.freeBadgeNote}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {t.hero.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {t.hero.description}
              </p>
            </div>

            {/* Smart Autocomplete Search Bar & Primary Actions */}
            <div className="space-y-4">
              <form onSubmit={handleSubmit}>
                <SmartSearchBar
                  id="hero-search"
                  components={components}
                  value={searchQuery}
                  onChange={onSearchChange}
                  onSelectComponent={onSelectComponent}
                  onSubmitSearch={onJumpToEncyclopedia}
                  placeholder={t.hero.searchPlaceholder}
                  inputClassName="h-12 bg-white dark:bg-[#1E293B] border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] dark:focus:border-[#00BFFF] focus:ring-2 focus:ring-[#2563EB]/20"
                  submitButton={
                    <button
                      type="submit"
                      className="h-12 px-5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                    >
                      <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{t.hero.exploreBtn}</span>
                    </button>
                  }
                />
              </form>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onJumpToLevels}
                  className="h-10 px-4 bg-white dark:bg-[#1E293B] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-semibold rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB]"
                >
                  <GraduationCap className="w-4 h-4 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
                  <span>{t.hero.startLearningBtn}</span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <span>{t.hero.quickSearchLabel}</span>
                  {quickTerms.map((term, idx) => (
                    <span key={term} className="inline-flex items-center gap-2">
                      {idx > 0 && <span aria-hidden="true">·</span>}
                      <button
                        type="button"
                        onClick={() => {
                          onSearchChange(term);
                          onJumpToEncyclopedia();
                        }}
                        className="text-[#2563EB] dark:text-[#00BFFF] hover:underline font-medium cursor-pointer"
                      >
                        {term}
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Studio Visual Showcase Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="lg:col-span-6"
          >
            <div className="aspect-[16/10] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-[#1E293B] relative shadow-sm">
              {!imgFailed ? (
                <img
                  src="/src/assets/images/hero_workbench_electronics_1795558394640.jpg"
                  alt="ElectroPedia electronics workbench with resistors, capacitors, microcontroller, inductor, and transistors"
                  loading="eager"
                  decoding="sync"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-100 dark:bg-[#1E293B] text-slate-600 dark:text-slate-300 text-center">
                  <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    ElectroPedia Visual Workbench
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {t.hero.caption}
                  </p>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-4 sm:p-5 text-white">
                <p className="text-xs text-slate-100 font-medium">{t.hero.caption}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
