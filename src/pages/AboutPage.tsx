import { ArrowRight, Award, BookOpen, GraduationCap, Mail, ShieldCheck, Wrench } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useI18n } from '../i18n/I18nContext';

interface AboutPageProps {
  onBrowseComponents: () => void;
  onOpenContact: () => void;
}

export function AboutPage({ onBrowseComponents, onOpenContact }: AboutPageProps) {
  const { dir, t } = useI18n();
  const icons = [BookOpen, Award, ShieldCheck];

  return (
    <div data-testid="page-about">
      <section className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 py-12 lg:py-16 blueprint-grid">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-3">
            <p className="font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider">
              {t.pages.about.eyebrow}
            </p>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {t.pages.about.title}
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {t.pages.about.subtitle}
            </p>
          </div>

          {/* Creator Story Card */}
          <Card className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 sm:p-8 lg:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    {t.pages.about.creatorCardTitle}
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-[#2563EB] dark:text-[#00BFFF]">
                    {t.pages.about.creatorSchool} · {t.pages.about.creatorMajor}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 font-mono-tech text-xs font-semibold text-slate-700 dark:text-slate-200 self-start sm:self-auto">
                <Wrench className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
                <span>{t.pages.about.creatorRoleBadge}</span>
              </span>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
              {t.pages.about.creatorParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onBrowseComponents}
                className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>{t.pages.about.ctaBrowse}</span>
                <ArrowRight
                  className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                onClick={onOpenContact}
                className="px-5 py-2.5 bg-white dark:bg-[#0F172A] border border-slate-300 dark:border-slate-700 hover:border-[#2563EB] text-slate-800 dark:text-slate-100 text-sm font-semibold rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
                <span>{t.pages.about.ctaContact}</span>
              </button>
            </div>
          </Card>

          {/* Educational Pillars */}
          <div className="space-y-5">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t.pages.about.missionTitle}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {t.pages.about.missionItems.map((item, idx) => {
                const Icon = icons[idx % icons.length];
                return (
                  <Card
                    key={item.title}
                    className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 dark:bg-[#00BFFF]/15 text-[#2563EB] dark:text-[#00BFFF] flex items-center justify-center">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
