import {
  Activity,
  AlertTriangle,
  HeartPulse,
  ShieldAlert,
  ShieldCheck,
  Wrench,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SafetySection } from '../components/HomepageSections';
import { useI18n } from '../i18n/I18nContext';
import type { ElectronicComponent } from '../types/electronics';
import { getComponentName } from '../utils/catalogFilter';

interface SafetyPageProps {
  allComponents: ElectronicComponent[];
  onSelectComponent: (comp: ElectronicComponent) => void;
}

const SAFETY_COMPONENT_IDS = [
  'ppe',
  'voltage-tester',
  'rcd-rcbo',
  'earthing-systems',
  'insulation-resistance-tester',
];

export function SafetyPage({ allComponents, onSelectComponent }: SafetyPageProps) {
  const { locale, t } = useI18n();
  const relatedSafetyItems = SAFETY_COMPONENT_IDS.map((id) =>
    allComponents.find((c) => c.id === id)
  ).filter((c): c is ElectronicComponent => Boolean(c));

  return (
    <div data-testid="page-safety">
      <section className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 py-10 lg:py-14 blueprint-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 font-mono-tech text-xs font-semibold text-[#EF4444] dark:text-rose-400 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" aria-hidden="true" />
              <span>{t.pages.safety.eyebrow}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              {t.pages.safety.title}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {t.pages.safety.subtitle}
            </p>
          </div>

          {/* 1. LOTO / VAT + IEC 61010 CAT Ratings */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-6 bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="w-5 h-5 text-[#22C55E]" aria-hidden="true" />
                <h2>{t.pages.safety.lotoTitle}</h2>
              </div>
              <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                {t.pages.safety.lotoSteps.map((step) => (
                  <li
                    key={step}
                    className="p-3 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 leading-relaxed"
                  >
                    {step}
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="lg:col-span-6 bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-4">
              <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {t.pages.safety.catTitle}
              </h2>
              <div className="space-y-3">
                {t.pages.safety.catRows.map((row) => (
                  <div
                    key={row.cat}
                    className="p-3.5 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700"
                  >
                    <p className="font-mono-tech text-xs font-bold text-[#2563EB] dark:text-[#00BFFF]" dir="ltr">
                      {row.cat}
                    </p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                      {row.scope}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {row.examples}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 2. Electrical Shock Thresholds + Short Circuit vs Overload */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-6 bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Activity className="w-5 h-5 text-[#EF4444]" aria-hidden="true" />
                <h2 className="font-display text-base sm:text-lg font-bold">
                  {t.pages.safety.hazardsTitle}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {t.pages.safety.shockThresholdsTitle}
              </p>
              <div className="space-y-2.5">
                {t.pages.safety.shockThresholds.map((row) => {
                  const badgeTone =
                    row.severity === 'danger'
                      ? 'bg-[#EF4444] text-white'
                      : row.severity === 'warning'
                        ? 'bg-[#F59E0B] text-slate-950'
                        : 'bg-[#22C55E] text-white';
                  return (
                    <div
                      key={row.ma}
                      className="p-3 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 flex items-start gap-3"
                    >
                      <span
                        dir="ltr"
                        className={`px-2 py-0.5 rounded font-mono-tech text-xs font-bold shrink-0 ${badgeTone}`}
                      >
                        {row.ma}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                        {row.effect}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="lg:col-span-6 bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Zap className="w-5 h-5 text-[#F59E0B]" aria-hidden="true" />
                <h2 className="font-display text-base sm:text-lg font-bold">
                  {t.pages.safety.faultComparisonTitle}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.pages.safety.shortCircuitVsOverload.map((col, idx) => (
                  <div
                    key={col.title}
                    className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 space-y-2.5"
                  >
                    <h3
                      className={`font-display text-sm font-bold ${
                        idx === 0 ? 'text-[#EF4444]' : 'text-[#F59E0B]'
                      }`}
                    >
                      {col.title}
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {col.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-1.5">
                          <span className="font-bold text-[#2563EB] dark:text-[#00BFFF]">·</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 3. Earthing Systems + PPE / Insulated Tools + Workshop Rules */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-3">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                {t.pages.safety.earthingTitle}
              </h2>
              <div className="space-y-2.5">
                {t.pages.safety.earthingSystems.map((sys) => (
                  <div
                    key={sys.code}
                    className="p-3 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700"
                  >
                    <p className="font-mono-tech text-xs font-bold text-[#22C55E]">{sys.code}</p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {sys.desc}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-3">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
                <span>{t.pages.safety.toolsPpeTitle}</span>
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.pages.safety.toolsPpePoints.map((pt) => (
                  <li
                    key={pt}
                    className="p-3 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700"
                  >
                    {pt}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-3">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
                <span>{t.pages.safety.workshopTitle}</span>
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.pages.safety.workshopRules.map((rule) => (
                  <li
                    key={rule}
                    className="p-2.5 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 flex items-start gap-2"
                  >
                    <span className="text-[#F59E0B] font-bold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* 4. Electrical Accidents First Aid Protocol */}
          <Card
            data-testid="safety-first-aid-card"
            className="bg-rose-50/70 dark:bg-[#1E293B] border border-rose-200 dark:border-[#EF4444]/40 ring-0 p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="font-display text-lg sm:text-xl font-bold text-rose-950 dark:text-rose-300 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-[#EF4444]" aria-hidden="true" />
                <span>{t.pages.safety.firstAidTitle}</span>
              </h2>
            </div>
            <p className="p-3 rounded-lg bg-[#EF4444] text-white text-xs sm:text-sm font-bold">
              {t.pages.safety.firstAidWarning}
            </p>
            <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs sm:text-sm text-slate-800 dark:text-slate-100">
              {t.pages.safety.firstAidSteps.map((step) => (
                <li
                  key={step}
                  className="p-3.5 rounded-xl bg-white dark:bg-[#0F172A] border border-rose-200 dark:border-slate-700 leading-relaxed"
                >
                  {step}
                </li>
              ))}
            </ol>
          </Card>

          {relatedSafetyItems.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5">
              {relatedSafetyItems.map((comp) => (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => onSelectComponent(comp)}
                  className="px-3.5 py-2 rounded-lg bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 hover:border-[#2563EB] text-xs font-semibold text-slate-800 dark:text-slate-100 cursor-pointer"
                >
                  {getComponentName(comp, locale)}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <SafetySection />
    </div>
  );
}
