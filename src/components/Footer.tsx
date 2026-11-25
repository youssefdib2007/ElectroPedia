import { useI18n } from '../i18n/I18nContext';
import type { AppPageId, AppRoute } from '../types/electronics';
import { buildRouteHash } from '../utils/routes';

interface FooterProps {
  onNavigate?: (route: AppRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t } = useI18n();

  const links: { page: AppPageId; label: string }[] = [
    { page: 'home', label: t.nav.home },
    { page: 'components', label: t.nav.components },
    { page: 'virtual-lab', label: t.nav.virtualLab },
    { page: 'categories', label: t.nav.categories },
    { page: 'symbols', label: t.nav.symbols },
    { page: 'wiring-diagrams', label: t.nav.wiringDiagrams },
    { page: 'glossary', label: t.nav.glossary },
    { page: 'favorites', label: t.nav.favorites },
    { page: 'progress', label: t.nav.progress },
    { page: 'flashcards', label: t.nav.flashcards },
    { page: 'calculators', label: t.nav.calculators },
    { page: 'quizzes', label: t.nav.quiz },
    { page: 'electronics', label: t.nav.electronics },
    { page: 'electrical-tools', label: t.nav.electricalTools },
    { page: 'safety', label: t.nav.safety },
    { page: 'about', label: t.nav.about },
    { page: 'contact', label: t.nav.contact },
  ];

  return (
    <footer className="bg-white dark:bg-[#0F172A] border-t border-slate-200 dark:border-slate-800 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <p className="font-display text-lg font-extrabold text-slate-900 dark:text-white" dir="ltr">
            ElectroPedia
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {t.footer.tagline} ·{' '}
            <span className="font-mono-tech text-[#2563EB] dark:text-[#00BFFF]" dir="ltr">
              Explore. Learn. Connect.
            </span>
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300"
        >
          {links.map((link) => (
            <a
              key={link.page}
              href={buildRouteHash({ page: link.page })}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate({ page: link.page });
                }
              }}
              className="hover:text-[#2563EB] dark:hover:text-[#00BFFF] hover:underline underline-offset-4"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-tech text-xs hover:text-[#2563EB] dark:hover:text-[#00BFFF] hover:underline underline-offset-4"
            dir="ltr"
          >
            sitemap.xml
          </a>
        </nav>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t.footer.freeAccess}
        </p>
      </div>
    </footer>
  );
}
