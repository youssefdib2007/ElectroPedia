import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Cable,
  Calculator,
  CheckCircle2,
  Cog,
  Cpu,
  Eye,
  Factory,
  Globe,
  GraduationCap,
  HardDrive,
  Heart,
  Home,
  Layers,
  Network,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sun,
  Wrench,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { COMPONENT_CATEGORIES, ELECTRONIC_COMPONENTS } from '../data/componentsData';
import { useI18n } from '../i18n/I18nContext';
import type {
  AppRoute,
  ComponentCategoryId,
  DifficultyLevel,
  ElectronicComponent,
} from '../types/electronics';
import { getComponentName } from '../utils/catalogFilter';
import { ComponentArtwork } from './ComponentArtwork';
import { OptimizedImage } from './OptimizedImage';

interface MainCategoriesProps {
  onSelectCategory: (category: ComponentCategoryId) => void;
}

const CATEGORY_ICONS: Record<ComponentCategoryId, typeof Cpu> = {
  residential: Home,
  industrial: Factory,
  electronics: Cpu,
  motors: Cog,
  automation: Network,
  renewable: Sun,
  tools: Wrench,
};

export function MainCategoriesSection({ onSelectCategory }: MainCategoriesProps) {
  const { locale, dir, t } = useI18n();
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <section
      id="categories"
      className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 py-14 lg:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider">
              {t.categoriesSection.eyebrow}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {t.categoriesSection.title}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md">
            {t.categoriesSection.subtitle}
          </p>
        </div>

        {/* 7 Main Encyclopedia Categories Grid */}
        <div
          data-testid="categories-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {COMPONENT_CATEGORIES.map((cat, idx) => {
            const Icon = CATEGORY_ICONS[cat.id];
            const itemCount = ELECTRONIC_COMPONENTS.filter((c) => c.category === cat.id).length;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
              >
                <button
                  type="button"
                  data-testid={`category-card-${cat.id}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className="w-full h-full text-start group cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB] rounded-xl"
                >
                  <Card className="h-full bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 hover:border-[#2563EB] dark:hover:border-[#00BFFF] ring-0 overflow-hidden transition-colors p-0 gap-0 flex flex-col">
                    <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-700 overflow-hidden">
                      {!failedImages[cat.id] ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.imageAlt[locale]}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedImages((prev) => ({ ...prev, [cat.id]: true }))
                          }
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#2563EB] dark:text-[#00BFFF]">
                          <Icon className="w-10 h-10" aria-hidden="true" />
                        </div>
                      )}
                      <div className="absolute top-3 start-3 w-9 h-9 rounded-lg bg-white/95 dark:bg-[#0F172A]/90 border border-slate-200 dark:border-slate-700 text-[#2563EB] dark:text-[#00BFFF] flex items-center justify-center shadow-xs">
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <span
                        dir="ltr"
                        className="absolute bottom-2.5 end-3 px-2 py-0.5 rounded bg-slate-950/75 text-white font-mono-tech text-[11px] font-semibold"
                      >
                        {itemCount}
                      </span>
                    </div>

                    <CardHeader className="p-5 pb-2">
                      <CardTitle className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        {cat.label[locale]}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                        {cat.summary[locale]}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 pt-2 mt-auto">
                      <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2563EB] dark:text-[#00BFFF]">
                        <span>{t.categoriesSection.browseAction}</span>
                        <ArrowRight
                          className={`w-4 h-4 transition-transform ${
                            dir === 'rtl'
                              ? 'rotate-180 group-hover:-translate-x-1'
                              : 'group-hover:translate-x-1'
                          }`}
                          aria-hidden="true"
                        />
                      </span>
                    </CardContent>
                  </Card>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface PopularComponentsProps {
  onSelectComponent: (component: ElectronicComponent) => void;
}

const FLAGSHIP_POPULAR_IDS = [
  'resistors',
  'circuit-breakers',
  'contactors',
  'mosfets',
  'three-phase-motors',
  'plc',
  'solar-panels',
  'multimeter',
  'oscilloscope',
];

export function PopularComponentsSection({ onSelectComponent }: PopularComponentsProps) {
  const { locale, t } = useI18n();
  const popularItems = FLAGSHIP_POPULAR_IDS.map((id) =>
    ELECTRONIC_COMPONENTS.find((c) => c.id === id)
  ).filter((c): c is ElectronicComponent => Boolean(c));

  return (
    <section
      id="popular"
      className="bg-[#F8FAFC] dark:bg-[#0F172A]/85 border-b border-slate-200 dark:border-slate-800 py-14 lg:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider">
              {t.popularSection.eyebrow}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {t.popularSection.title}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md">
            {t.popularSection.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularItems.map((comp) => {
            const catLabel =
              COMPONENT_CATEGORIES.find((c) => c.id === comp.category)?.label[locale] ?? '';
            return (
              <Card
                key={comp.id}
                className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 hover:border-[#2563EB] dark:hover:border-[#00BFFF] ring-0 overflow-hidden p-0 gap-0 flex flex-col justify-between transition-colors"
              >
                <button
                  type="button"
                  onClick={() => onSelectComponent(comp)}
                  className="bg-[#F8FAFC] dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-700 h-44 w-full flex items-center justify-center relative overflow-hidden cursor-pointer"
                >
                  <OptimizedImage
                    src={comp.imageUrl}
                    alt={comp.galleryImages[0]?.alt[locale] ?? getComponentName(comp, locale)}
                    className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-300"
                    fallback={
                      <div className="w-40 h-26">
                        <ComponentArtwork artworkId={comp.artworkId} mode="physical" />
                      </div>
                    }
                  />
                  <span
                    className="absolute bottom-2.5 end-3 px-2 py-0.5 rounded bg-slate-950/75 text-white font-mono-tech text-[11px]"
                    dir="ltr"
                  >
                    {comp.symbolCode}
                  </span>
                </button>

                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                      <span>{catLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{t.difficulty[comp.difficulty]}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                      {getComponentName(comp, locale)}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {comp.shortDesc[locale]}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/70 flex items-center justify-between gap-3">
                    <span
                      className="font-mono-tech text-xs text-slate-500 dark:text-slate-400 truncate"
                      dir="ltr"
                    >
                      {comp.specs[0]?.value} {comp.specs[0]?.unit ?? ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectComponent(comp)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB]"
                    >
                      <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{t.popularSection.inspectBtn}</span>
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface LearningLevelsProps {
  onSelectLevel: (difficulty: DifficultyLevel | 'all') => void;
}

export function LearningLevelsSection({ onSelectLevel }: LearningLevelsProps) {
  const { dir, t } = useI18n();

  return (
    <section
      id="levels"
      className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 py-14 lg:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider">
              {t.levelsSection.eyebrow}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {t.levelsSection.title}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md">
            {t.levelsSection.subtitle}
          </p>
        </div>

        {/* Direct Beginner / Intermediate / Advanced Filter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {(
            [
              {
                level: 'beginner',
                badge: 'Beginner · مبتدئ',
                tone: 'border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-500',
                pill: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50',
              },
              {
                level: 'intermediate',
                badge: 'Intermediate · متوسط',
                tone: 'border-amber-200 dark:border-amber-900/60 hover:border-amber-500',
                pill: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50',
              },
              {
                level: 'advanced',
                badge: 'Advanced · متقدم',
                tone: 'border-rose-200 dark:border-rose-900/60 hover:border-rose-500',
                pill: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50',
              },
            ] as const
          ).map((tier) => {
            const count = ELECTRONIC_COMPONENTS.filter((c) => c.difficulty === tier.level).length;
            return (
              <button
                key={tier.level}
                type="button"
                data-testid={`level-filter-${tier.level}`}
                onClick={() => onSelectLevel(tier.level)}
                className={`text-start bg-[#F8FAFC] dark:bg-[#1E293B] border ${tier.tone} rounded-xl p-4 flex items-center justify-between gap-3 transition-colors cursor-pointer`}
              >
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${tier.pill}`}>
                    {t.difficulty[tier.level]}
                  </span>
                  <p className="font-mono-tech text-[11px] text-slate-500 dark:text-slate-400 mt-1.5" dir="ltr">
                    {tier.badge}
                  </p>
                </div>
                <span className="font-mono-tech text-sm font-bold text-[#2563EB] dark:text-[#00BFFF]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {t.levelsSection.items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectLevel(item.filterDifficulty)}
              className="group text-start bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 hover:border-[#2563EB] dark:hover:border-[#00BFFF] rounded-xl p-5 flex flex-col justify-between gap-4 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB]"
            >
              <div>
                <p className="font-mono-tech text-[11px] font-semibold text-[#2563EB] dark:text-[#00BFFF]">
                  {item.code}
                </p>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white mt-1.5">
                  {item.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {item.audience}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  {item.focus}
                </p>
              </div>

              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF]">
                <span>{t.levelsSection.exploreTrack}</span>
                <ArrowRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    dir === 'rtl'
                      ? 'rotate-180 group-hover:-translate-x-1'
                      : 'group-hover:translate-x-1'
                  }`}
                  aria-hidden="true"
                />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const { t } = useI18n();
  const icons = [Layers, Globe, Search, HardDrive];

  return (
    <section
      id="features"
      className="bg-[#F8FAFC] dark:bg-[#0F172A]/85 border-b border-slate-200 dark:border-slate-800 py-14 lg:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider">
              {t.featuresSection.eyebrow}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {t.featuresSection.title}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md">
            {t.featuresSection.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.featuresSection.items.map((feature, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Card
                key={feature.title}
                className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 dark:bg-[#00BFFF]/15 text-[#2563EB] dark:text-[#00BFFF] flex items-center justify-center">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SafetySection() {
  const { t } = useI18n();

  return (
    <section
      id="safety"
      className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 py-14 lg:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="font-mono-tech text-xs font-semibold text-[#EF4444] dark:text-rose-400 uppercase tracking-wider">
              {t.safetySection.eyebrow}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {t.safetySection.title}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md">
            {t.safetySection.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.safetySection.rules.map((rule) => {
            const isDanger = rule.level === 'danger';
            const isWarning = rule.level === 'warning';
            const Icon = isDanger ? ShieldAlert : isWarning ? AlertTriangle : CheckCircle2;
            const toneClass = isDanger
              ? 'text-[#EF4444] dark:text-rose-400'
              : isWarning
                ? 'text-amber-600 dark:text-[#F59E0B]'
                : 'text-emerald-600 dark:text-[#22C55E]';

            return (
              <Card
                key={rule.title}
                className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 gap-3"
              >
                <div className={`inline-flex items-center gap-2 text-xs font-mono-tech font-bold ${toneClass}`}>
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{rule.levelLabel}</span>
                </div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  {rule.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rule.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface AboutPreviewProps {
  onOpenAbout: () => void;
  onOpenContact: () => void;
}

export function AboutCreatorPreviewSection({ onOpenAbout, onOpenContact }: AboutPreviewProps) {
  const { dir, t } = useI18n();

  return (
    <section
      id="about-preview"
      className="bg-[#F8FAFC] dark:bg-[#0F172A]/85 border-b border-slate-200 dark:border-slate-800 py-14 lg:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono-tech font-semibold text-[#2563EB] dark:text-[#00BFFF]">
              <GraduationCap className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{t.pages.about.creatorRoleBadge} · {t.pages.about.creatorSchool}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {t.pages.about.creatorCardTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.pages.about.creatorParagraphs[0]} {t.pages.about.creatorParagraphs[1]}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenAbout}
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>{t.nav.about}</span>
              <ArrowRight
                className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              onClick={onOpenContact}
              className="px-5 py-2.5 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-[#2563EB] text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {t.nav.contact}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StudyToolsHomeSection({
  onOpenFlashcards,
  onOpenCalculators,
  onNavigate,
}: {
  onOpenFlashcards: () => void;
  onOpenCalculators: () => void;
  onNavigate: (route: AppRoute) => void;
}) {
  const { locale, dir, t } = useI18n();

  const hubCards: {
    id: string;
    route: AppRoute;
    icon: typeof Zap;
    title: string;
    desc: string;
    tone: string;
  }[] = [
    {
      id: 'symbols',
      route: { page: 'symbols' },
      icon: Zap,
      title: t.homeHub.symbolsTitle,
      desc: t.homeHub.symbolsDesc,
      tone: 'bg-blue-500/10 text-[#2563EB] dark:text-[#00BFFF]',
    },
    {
      id: 'wiring',
      route: { page: 'wiring-diagrams' },
      icon: Cable,
      title: t.homeHub.wiringTitle,
      desc: t.homeHub.wiringDesc,
      tone: 'bg-cyan-500/10 text-cyan-600 dark:text-[#00BFFF]',
    },
    {
      id: 'glossary',
      route: { page: 'glossary' },
      icon: BookOpen,
      title: t.homeHub.glossaryTitle,
      desc: t.homeHub.glossaryDesc,
      tone: 'bg-emerald-500/10 text-emerald-600 dark:text-[#22C55E]',
    },
    {
      id: 'favorites',
      route: { page: 'favorites' },
      icon: Heart,
      title: t.homeHub.favoritesTitle,
      desc: t.homeHub.favoritesDesc,
      tone: 'bg-rose-500/10 text-[#EF4444]',
    },
    {
      id: 'progress',
      route: { page: 'progress' },
      icon: BarChart3,
      title: t.homeHub.progressTitle,
      desc: t.homeHub.progressDesc,
      tone: 'bg-amber-500/10 text-amber-600 dark:text-[#F59E0B]',
    },
    {
      id: 'safety',
      route: { page: 'safety' },
      icon: ShieldCheck,
      title: t.homeHub.safetyTitle,
      desc: t.homeHub.safetyDesc,
      tone: 'bg-rose-500/10 text-[#EF4444]',
    },
  ];

  return (
    <section
      id="study-tools"
      className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 py-14 lg:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="rounded-2xl border border-[#2563EB]/30 dark:border-[#00BFFF]/30 bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono-tech font-bold text-[#2563EB] dark:text-[#00BFFF]">
              <Cpu className="w-4 h-4" aria-hidden="true" />
              <span>{t.labWorkspace.eyebrow}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t.homeHub.virtualLabTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.homeHub.virtualLabDesc}
            </p>
          </div>
          <button
            type="button"
            data-testid="home-launch-virtual-lab"
            onClick={() => onNavigate({ page: 'virtual-lab' })}
            className="shrink-0 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-bold inline-flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <span>{t.nav.virtualLab}</span>
            <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 dark:bg-[#00BFFF]/15 text-[#2563EB] dark:text-[#00BFFF] flex items-center justify-center">
                <Layers className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {t.flashcards.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.flashcards.subtitle}
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={onOpenFlashcards}
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>{t.nav.flashcards}</span>
                <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 dark:bg-[#00BFFF]/15 text-[#2563EB] dark:text-[#00BFFF] flex items-center justify-center">
                <Calculator className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {t.calculators.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.calculators.subtitle}
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={onOpenCalculators}
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>{t.nav.calculators}</span>
                <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <p
                className={
                  locale === 'ar'
                    ? 'text-xs font-bold text-[#2563EB] dark:text-[#00BFFF]'
                    : 'font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider'
                }
              >
                {t.homeHub.eyebrow}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
                {t.homeHub.title}
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg">
              {t.homeHub.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hubCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  type="button"
                  data-testid={`home-hub-${card.id}`}
                  onClick={() => onNavigate(card.route)}
                  className="group text-start bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 hover:border-[#2563EB] dark:hover:border-[#00BFFF] rounded-xl p-5 flex items-start gap-4 transition-colors cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center ${card.tone}`}>
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-[#00BFFF] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}



