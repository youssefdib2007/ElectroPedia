import { useEffect } from 'react';
import { COMPONENT_CATEGORIES } from '../data/componentsData';
import { useI18n } from '../i18n/I18nContext';
import type { AppRoute, ElectronicComponent } from '../types/electronics';
import { getComponentName } from '../utils/catalogFilter';

interface SeoHeadProps {
  route: AppRoute;
  activeComponent?: ElectronicComponent;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function upsertJsonLd(data: Record<string, unknown>) {
  let script = document.getElementById('electropedia-jsonld') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'electropedia-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function SeoHead({ route, activeComponent }: SeoHeadProps) {
  const { locale, t } = useI18n();

  useEffect(() => {
    let title = t.meta.title;
    let description = t.meta.description;

    if (route.page === 'component-detail' && activeComponent) {
      const compName = getComponentName(activeComponent, locale);
      title = `${compName} (${activeComponent.symbolCode}) — ElectroPedia`;
      description = activeComponent.shortDesc[locale];
    } else if (route.page === 'components') {
      title = `${t.encyclopedia.title} — ElectroPedia`;
      description = t.encyclopedia.subtitle;
    } else if (route.page === 'categories') {
      const cat = route.categoryId
        ? COMPONENT_CATEGORIES.find((c) => c.id === route.categoryId)
        : undefined;
      title = cat
        ? `${cat.label[locale]} — ElectroPedia`
        : `${t.pages.categories.title} — ElectroPedia`;
      description = cat ? cat.summary[locale] : t.pages.categories.subtitle;
    } else if (route.page === 'electrical-tools') {
      title = `${t.pages.electricalTools.title} — ElectroPedia`;
      description = t.pages.electricalTools.subtitle;
    } else if (route.page === 'electronics') {
      title = `${t.pages.electronics.title} — ElectroPedia`;
      description = t.pages.electronics.subtitle;
    } else if (route.page === 'quizzes') {
      title = `${t.quiz.title} — ElectroPedia`;
      description = t.quiz.subtitle;
    } else if (route.page === 'flashcards') {
      title = `${t.flashcards.title} — ElectroPedia`;
      description = t.flashcards.subtitle;
    } else if (route.page === 'calculators') {
      title = `${t.calculators.title} — ElectroPedia`;
      description = t.calculators.subtitle;
    } else if (route.page === 'symbols') {
      title = `${t.symbols.title} — ElectroPedia`;
      description = t.symbols.subtitle;
    } else if (route.page === 'wiring-diagrams') {
      title = `${t.wiringLibrary.title} — ElectroPedia`;
      description = t.wiringLibrary.subtitle;
    } else if (route.page === 'glossary') {
      title = `${t.glossary.title} — ElectroPedia`;
      description = t.glossary.subtitle;
    } else if (route.page === 'favorites') {
      title = `${t.favorites.title} — ElectroPedia`;
      description = t.favorites.subtitle;
    } else if (route.page === 'progress') {
      title = `${t.progress.title} — ElectroPedia`;
      description = t.progress.subtitle;
    } else if (route.page === 'virtual-lab') {
      title = `${t.labWorkspace.title} — ElectroPedia`;
      description = t.labWorkspace.safetyBanner;
    } else if (route.page === 'safety') {
      title = `${t.pages.safety.title} — ElectroPedia`;
      description = t.pages.safety.subtitle;
    } else if (route.page === 'about') {
      title = `${t.pages.about.title} — ElectroPedia`;
      description = t.pages.about.subtitle;
    } else if (route.page === 'contact') {
      title = `${t.pages.contact.title} — ElectroPedia`;
      description = t.pages.contact.subtitle;
    }

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);

    const canonicalUrl = `${window.location.origin}${window.location.pathname}${window.location.hash}`;
    upsertCanonical(canonicalUrl);
    upsertMeta('property', 'og:url', canonicalUrl);

    if (route.page === 'component-detail' && activeComponent) {
      upsertJsonLd({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: getComponentName(activeComponent, locale),
        alternativeHeadline: activeComponent.nameEn,
        description: activeComponent.definition[locale],
        inLanguage: locale,
        isAccessibleForFree: true,
        publisher: {
          '@type': 'Organization',
          name: 'ElectroPedia',
        },
      });
    } else {
      upsertJsonLd({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'ElectroPedia',
        alternateName: 'Explore. Learn. Connect.',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'All',
        inLanguage: ['ar', 'en', 'fr'],
        isAccessibleForFree: true,
        description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      });
    }
  }, [route, activeComponent, locale, t]);

  return null;
}
