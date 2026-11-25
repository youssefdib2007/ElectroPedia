import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bookmark,
  Box,
  Cable,
  Check,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Image as ImageIcon,
  Layers,
  Link2,
  ShieldAlert,
  Wrench,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { COMPONENT_CATEGORIES } from '../data/componentsData';
import { useI18n } from '../i18n/I18nContext';
import type { ComponentCategoryId, ElectronicComponent } from '../types/electronics';
import { getComponentName } from '../utils/catalogFilter';
import { ComponentArtwork } from './ComponentArtwork';
import { WiringDiagramArtwork } from './WiringDiagramArtwork';

type GalleryTab = 'photo' | 'physical' | 'symbol' | 'wiring' | 'anatomy';

interface ComponentDetailPageProps {
  componentId: string;
  allComponents: ElectronicComponent[];
  isSaved: boolean;
  onToggleBookmark: (id: string) => void;
  onBackToCatalog: () => void;
  onNavigateCategory: (category: ComponentCategoryId) => void;
  onNavigateComponent: (id: string) => void;
}

export function ComponentDetailPage({
  componentId,
  allComponents,
  isSaved,
  onToggleBookmark,
  onBackToCatalog,
  onNavigateCategory,
  onNavigateComponent,
}: ComponentDetailPageProps) {
  const { locale, dir, t } = useI18n();
  const [activeTab, setActiveTab] = useState<GalleryTab>('photo');
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  const component = allComponents.find((c) => c.id === componentId);

  useEffect(() => {
    setActiveTab('photo');
    setSelectedPhotoIdx(0);
    setCopiedLink(false);
  }, [componentId]);

  if (!component) {
    return (
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl p-10 space-y-4">
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {t.componentPage.notFoundTitle}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            {t.componentPage.notFoundSubtitle}
          </p>
          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {dir === 'rtl' ? (
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            )}
            <span>{t.componentPage.backToCatalog}</span>
          </button>
        </div>
      </section>
    );
  }

  const categoryMeta = COMPONENT_CATEGORIES.find((c) => c.id === component.category);
  const categoryLabel = categoryMeta?.label[locale] ?? component.category;
  const primaryName = getComponentName(component, locale);
  const galleryItems = component.galleryImages.length
    ? component.galleryImages
    : [
        {
          id: `${component.id}-fallback`,
          url: component.imageUrl,
          caption: { ar: component.nameAr, en: component.nameEn, fr: component.nameFr },
          alt: { ar: component.nameAr, en: component.nameEn, fr: component.nameFr },
        },
      ];
  const currentPhoto = galleryItems[selectedPhotoIdx] ?? galleryItems[0];
  const relatedComponents = component.relatedIds
    .map((id) => allComponents.find((c) => c.id === id))
    .filter((item): item is ElectronicComponent => Boolean(item));

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setCopiedLink(false);
    }
  };

  const galleryTabs: { id: GalleryTab; label: string; icon: typeof ImageIcon }[] = [
    { id: 'photo', label: t.componentPage.tabPhoto, icon: ImageIcon },
    { id: 'physical', label: t.componentPage.tabPhysical, icon: Box },
    { id: 'symbol', label: t.componentPage.tabSymbol, icon: Zap },
    { id: 'wiring', label: t.componentPage.tabWiring, icon: Cable },
    { id: 'anatomy', label: t.componentPage.tabAnatomy, icon: Layers },
  ];

  const difficultyTone =
    component.difficulty === 'beginner'
      ? 'text-emerald-700 dark:text-[#22C55E] bg-emerald-50 dark:bg-[#22C55E]/10 border-emerald-200 dark:border-[#22C55E]/30'
      : component.difficulty === 'intermediate'
        ? 'text-amber-700 dark:text-[#F59E0B] bg-amber-50 dark:bg-[#F59E0B]/10 border-amber-200 dark:border-[#F59E0B]/30'
        : 'text-rose-700 dark:text-[#EF4444] bg-rose-50 dark:bg-[#EF4444]/10 border-rose-200 dark:border-[#EF4444]/30';

  return (
    <article
      data-testid="component-detail-page"
      className="bg-[#F8FAFC] dark:bg-[#0F172A] pb-16"
    >
      {/* Top Breadcrumb & Quick Actions Bar */}
      <div className="bg-white dark:bg-[#1E293B] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={onBackToCatalog}
              className="inline-flex items-center gap-1.5 font-semibold text-[#2563EB] dark:text-[#00BFFF] hover:underline cursor-pointer"
            >
              {dir === 'rtl' ? (
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              )}
              <span>{t.componentPage.backToCatalog}</span>
            </button>
            <ChevronRight className={`w-4 h-4 text-slate-400 ${dir === 'rtl' ? 'rotate-180' : ''}`} aria-hidden="true" />
            <button
              type="button"
              onClick={() => onNavigateCategory(component.category)}
              className="hover:text-[#2563EB] dark:hover:text-[#00BFFF] hover:underline cursor-pointer"
            >
              {categoryLabel}
            </button>
            <ChevronRight className={`w-4 h-4 text-slate-400 ${dir === 'rtl' ? 'rotate-180' : ''}`} aria-hidden="true" />
            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[220px] sm:max-w-none">
              {primaryName}
            </span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] text-slate-700 dark:text-slate-200 hover:border-[#2563EB] dark:hover:border-[#00BFFF] transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-[#22C55E]" aria-hidden="true" />
              ) : (
                <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{copiedLink ? t.componentPage.linkCopied : t.componentPage.copyLink}</span>
            </button>

            <button
              type="button"
              data-testid="detail-favorite-btn"
              onClick={() => onToggleBookmark(component.id)}
              aria-pressed={isSaved}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#2563EB] border-[#2563EB] text-white'
                  : 'bg-white dark:bg-[#0F172A] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-[#2563EB]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} aria-hidden="true" />
              <span>{isSaved ? t.modal.savedBtn : t.modal.saveBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Hero Header + Interactive Multi-Tab Visual Gallery */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Identity & Trilingual Naming Card */}
          <Card className="lg:col-span-5 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF]">
                {categoryLabel}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${difficultyTone}`}>
                {t.componentPage.difficultyTitle}: {t.difficulty[component.difficulty]}
              </span>
            </div>

            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {primaryName}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                {component.shortDesc[locale]}
              </p>
            </div>

            {/* Trilingual Names Grid */}
            <div className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2.5">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t.componentPage.trilingualTitle}
              </p>
              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono-tech text-[11px] font-bold text-[#2563EB] dark:text-[#00BFFF] shrink-0">AR</span>
                  <span className="font-sans font-semibold text-slate-900 dark:text-white text-end" dir="rtl">
                    {component.nameAr}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono-tech text-[11px] font-bold text-[#2563EB] dark:text-[#00BFFF] shrink-0">EN</span>
                  <span className="font-sans font-medium text-slate-700 dark:text-slate-200 text-end" dir="ltr">
                    {component.nameEn}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono-tech text-[11px] font-bold text-[#2563EB] dark:text-[#00BFFF] shrink-0">FR</span>
                  <span className="font-sans font-medium text-slate-700 dark:text-slate-200 text-end" dir="ltr">
                    {component.nameFr}
                  </span>
                </div>
              </div>

              {component.altNames[locale]?.length > 0 && (
                <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700/80">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    {t.componentPage.altNamesLabel}
                  </p>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {component.altNames[locale].map((alt) => (
                      <li key={alt} className="flex items-start gap-2">
                        <span className="text-[#2563EB] dark:text-[#00BFFF] font-bold">·</span>
                        <span>{alt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Technical Quick Metadata */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                <span className="text-slate-500 dark:text-slate-400 block">{t.componentPage.symbolLabel}</span>
                <strong className="font-mono-tech text-slate-900 dark:text-white mt-0.5 block" dir="ltr">
                  {component.symbolCode}
                </strong>
              </div>
              <div className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                <span className="text-slate-500 dark:text-slate-400 block">{t.componentPage.packageLabel}</span>
                <strong className="font-mono-tech text-slate-900 dark:text-white mt-0.5 block truncate" dir="ltr">
                  {component.packageType}
                </strong>
              </div>
            </div>
          </Card>

          {/* Interactive Visual Gallery Stage */}
          <Card className="lg:col-span-7 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                {t.componentPage.galleryTitle}
              </h2>

              <div
                role="tablist"
                aria-label={t.componentPage.galleryTitle}
                className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                {galleryTabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                        active
                          ? 'bg-[#2563EB] text-white'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stage Content */}
            {activeTab === 'photo' && (
              <div className="space-y-3">
                <div className="aspect-[16/10] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-[#0F172A] relative">
                  {!failedUrls[currentPhoto.url] ? (
                    <img
                      src={currentPhoto.url}
                      alt={currentPhoto.alt[locale]}
                      loading="eager"
                      decoding="sync"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedUrls((prev) => ({ ...prev, [currentPhoto.url]: true }))
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-8 blueprint-grid">
                      <div className="w-56 h-36">
                        <ComponentArtwork artworkId={component.artworkId} mode="physical" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent p-4">
                    <p className="text-xs sm:text-sm font-medium text-white">
                      {currentPhoto.caption[locale]}
                    </p>
                  </div>
                </div>

                {galleryItems.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                    {galleryItems.map((media, idx) => (
                      <button
                        key={media.id}
                        type="button"
                        onClick={() => setSelectedPhotoIdx(idx)}
                        className={`w-28 h-16 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-colors ${
                          selectedPhotoIdx === idx
                            ? 'border-[#2563EB] dark:border-[#00BFFF]'
                            : 'border-slate-200 dark:border-slate-700 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={media.url}
                          alt={media.alt[locale]}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'physical' && (
              <div className="aspect-[16/10] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0F172A] blueprint-grid flex flex-col items-center justify-center p-6">
                <div className="w-72 h-44">
                  <ComponentArtwork artworkId={component.artworkId} mode="physical" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 font-mono-tech" dir="ltr">
                  {component.packageType}
                </p>
              </div>
            )}

            {activeTab === 'symbol' && (
              <div className="aspect-[16/10] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0F172A] blueprint-grid flex flex-col items-center justify-center p-6">
                <div className="w-72 h-44">
                  <ComponentArtwork artworkId={component.artworkId} mode="schematic" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-4">
                  {t.modal.schematicCaption} ·{' '}
                  <span className="font-mono-tech font-bold text-[#2563EB] dark:text-[#00BFFF]" dir="ltr">
                    {component.symbolCode}
                  </span>
                </p>
              </div>
            )}

            {activeTab === 'wiring' && (
              <div className="space-y-3">
                <div className="aspect-[16/10] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0F172A] blueprint-grid flex items-center justify-center p-4">
                  <div className="w-full h-full max-w-xl">
                    <WiringDiagramArtwork diagramId={component.wiringDiagramId} />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {component.wiringCaption[locale]}
                </p>
              </div>
            )}

            {activeTab === 'anatomy' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                <div>
                  <h3 className="text-sm font-bold text-[#2563EB] dark:text-[#00BFFF] mb-2.5">
                    {t.componentPage.internalPartsTitle}
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {component.internalParts[locale].map((part) => (
                      <li key={part} className="flex items-start gap-2">
                        <span className="text-[#2563EB] dark:text-[#00BFFF] font-bold">•</span>
                        <span>{part}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2.5">
                    {t.componentPage.externalPartsTitle}
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {component.externalParts[locale].map((part) => (
                      <li key={part} className="flex items-start gap-2">
                        <span className="text-[#22C55E] font-bold">•</span>
                        <span>{part}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* Definition, Core Function, Working Principle & Electrical Symbol */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-5 space-y-2">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
                <span>{t.componentPage.definitionTitle}</span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {component.definition[locale]}
              </p>
            </Card>

            <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-5 space-y-2">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
                <span>{t.componentPage.functionTitle}</span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {component.functionDesc[locale]}
              </p>
            </Card>

            <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-5 space-y-2">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
                <span>{t.componentPage.workingPrincipleTitle}</span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {component.howItWorks[locale]}
              </p>
            </Card>
          </div>

          <Card className="lg:col-span-4 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-5 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                {t.componentPage.electricalSymbolTitle}
              </h2>
              <span className="font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF]" dir="ltr">
                {component.symbolCode}
              </span>
            </div>
            <div className="h-32 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 blueprint-grid p-3 flex items-center justify-center">
              <div className="w-40 h-24">
                <ComponentArtwork artworkId={component.artworkId} mode="schematic" />
              </div>
            </div>
          </Card>
        </section>

        {/* Internal & External Parts + Types/Variants */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
              <span>{t.componentPage.anatomyTitle}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <h3 className="text-xs font-bold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider mb-2">
                  {t.componentPage.internalPartsTitle}
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {component.internalParts[locale].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-[#2563EB] dark:text-[#00BFFF] font-bold">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  {t.componentPage.externalPartsTitle}
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {component.externalParts[locale].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-[#22C55E] font-bold">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {t.componentPage.typesTitle}
            </h2>
            <div className="space-y-3">
              {component.types.map((variant) => (
                <div
                  key={variant.name.en}
                  className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg p-4"
                >
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {variant.name[locale]}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {variant.specNote[locale]}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Technical Specifications & Connection Terminals */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {t.componentPage.specsTitle}
            </h2>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full text-xs sm:text-sm text-start">
                <thead className="bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-start">{t.modal.paramCol}</th>
                    <th className="px-4 py-3 font-semibold text-start">{t.modal.valueCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {component.specs.map((spec) => (
                    <tr key={spec.label.en}>
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                        {spec.label[locale]}
                      </td>
                      <td className="px-4 py-3 font-mono-tech text-slate-700 dark:text-slate-200" dir="ltr">
                        {spec.value} {spec.unit ?? ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {t.componentPage.terminalsTitle}
            </h2>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <table className="w-full text-xs sm:text-sm text-start">
                <thead className="bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-start">{t.modal.pinCol}</th>
                    <th className="px-4 py-3 font-semibold text-start">{t.modal.nameCol}</th>
                    <th className="px-4 py-3 font-semibold text-start">{t.modal.roleCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {component.pins.map((pin) => (
                    <tr key={pin.pin}>
                      <td className="px-4 py-3 font-mono-tech font-bold text-[#2563EB] dark:text-[#00BFFF]" dir="ltr">
                        {pin.pin}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">
                        {pin.name[locale]}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {pin.role[locale]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Educational Wiring Diagram */}
        <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cable className="w-5 h-5 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
              <span>{t.componentPage.wiringTitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {component.wiringCaption[locale]}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-[#F8FAFC] dark:bg-[#0F172A] blueprint-grid p-4 sm:p-6 flex items-center justify-center">
            <div className="w-full max-w-3xl h-64 sm:h-72">
              <WiringDiagramArtwork diagramId={component.wiringDiagramId} />
            </div>
          </div>
        </Card>

        {/* Practical Applications, Common Faults, Safe Testing, Safety Precautions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-3">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" aria-hidden="true" />
              <span>{t.componentPage.applicationsTitle}</span>
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {component.applications[locale].map((app) => (
                <li key={app} className="flex items-start gap-2">
                  <span className="text-[#22C55E] font-bold">•</span>
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-3">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
              <span>{t.componentPage.faultsTitle}</span>
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {component.commonFaults[locale].map((fault) => (
                <li key={fault} className="flex items-start gap-2">
                  <span className="text-[#F59E0B] font-bold">•</span>
                  <span>{fault}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-3">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
              <span>{t.componentPage.testingTitle}</span>
            </h2>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {component.testingMethods[locale].map((step) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="text-[#2563EB] dark:text-[#00BFFF] font-bold">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="bg-amber-50/70 dark:bg-[#1E293B] border border-amber-200 dark:border-[#EF4444]/40 ring-0 p-6 space-y-3">
            <h2 className="font-display text-base font-bold text-amber-900 dark:text-rose-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#EF4444]" aria-hidden="true" />
              <span>{t.componentPage.safetyTitle}</span>
            </h2>
            <ul className="space-y-2 text-sm text-amber-950 dark:text-slate-200">
              {component.safetyTips[locale].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="text-[#EF4444] font-bold">!</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Authoritative References & 3D Architecture Readiness */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-3">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
              {t.componentPage.referencesTitle}
            </h2>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {component.references.map((ref) => (
                <li
                  key={ref.title}
                  className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{ref.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{ref.source}</p>
                  </div>
                  {ref.standardCode && (
                    <span className="font-mono-tech text-xs font-bold text-[#2563EB] dark:text-[#00BFFF]" dir="ltr">
                      {ref.standardCode}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="lg:col-span-6 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
                <span>{t.componentPage.model3dTitle}</span>
              </h2>
              <span className="font-mono-tech text-[11px] font-semibold text-[#2563EB] dark:text-[#00BFFF]">
                {component.model3d.status === 'ready'
                  ? t.componentPage.model3dStatusReady
                  : t.componentPage.model3dStatusPlanned}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {t.componentPage.model3dDesc}
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                <span className="text-slate-500 dark:text-slate-400 block">{t.componentPage.model3dFormat}</span>
                <strong className="font-mono-tech text-slate-900 dark:text-white mt-0.5 block" dir="ltr">
                  .{component.model3d.format.toUpperCase()} · {component.model3d.lodLevels.join('/')}
                </strong>
              </div>
              <div className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                <span className="text-slate-500 dark:text-slate-400 block">{t.componentPage.model3dDimensions}</span>
                <strong className="font-mono-tech text-slate-900 dark:text-white mt-0.5 block" dir="ltr">
                  {component.model3d.boundingBoxMm.w} × {component.model3d.boundingBoxMm.h} × {component.model3d.boundingBoxMm.d}
                </strong>
              </div>
            </div>
            <div className="bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-xs">
              <span className="text-slate-500 dark:text-slate-400 block mb-1.5">
                {t.componentPage.model3dHotspots}
              </span>
              <div className="flex flex-wrap gap-2">
                {component.model3d.interactiveHotspots.map((hs) => (
                  <span
                    key={hs.id}
                    className="px-2.5 py-1 rounded bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium"
                  >
                    {hs.label[locale]}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Related Components */}
        {relatedComponents.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {t.componentPage.relatedTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedComponents.map((rel) => {
                const relPrimary = getComponentName(rel, locale);
                const relSecondary = locale === 'ar' ? rel.nameEn : rel.nameAr;
                return (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => onNavigateComponent(rel.id)}
                    className="text-start bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 hover:border-[#2563EB] dark:hover:border-[#00BFFF] rounded-xl p-4 flex items-center gap-3.5 transition-colors cursor-pointer group"
                  >
                    <div className="w-16 h-12 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 p-1.5 shrink-0">
                      <ComponentArtwork artworkId={rel.artworkId} mode="physical" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#2563EB] dark:group-hover:text-[#00BFFF]">
                        {relPrimary}
                      </p>
                      <p
                        className={`text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 ${
                          locale === 'ar' ? 'font-mono-tech' : 'font-sans'
                        }`}
                      >
                        {relSecondary}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
