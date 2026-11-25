import { Bookmark, ChevronDown, Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import type { AppPageId, AppRoute, Locale, ThemeMode } from '../types/electronics';
import { buildRouteHash } from '../utils/routes';

interface NavbarProps {
  theme: ThemeMode;
  activePage: AppPageId;
  onToggleTheme: () => void;
  savedCount: number;
  onOpenSaved: () => void;
  onNavigate: (route: AppRoute) => void;
}

const LOCALE_OPTIONS: { code: Locale; label: string; fullName: string }[] = [
  { code: 'ar', label: 'AR', fullName: 'العربية' },
  { code: 'en', label: 'EN', fullName: 'English' },
  { code: 'fr', label: 'FR', fullName: 'Français' },
];

export function Navbar({
  theme,
  activePage,
  onToggleTheme,
  savedCount,
  onOpenSaved,
  onNavigate,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale, t } = useI18n();

  const primaryLinks: { page: AppPageId; label: string }[] = [
    { page: 'home', label: t.nav.home },
    { page: 'components', label: t.nav.components },
    { page: 'virtual-lab', label: t.nav.virtualLab },
    { page: 'symbols', label: t.nav.symbols },
    { page: 'wiring-diagrams', label: t.nav.wiringDiagrams },
    { page: 'flashcards', label: t.nav.flashcards },
    { page: 'calculators', label: t.nav.calculators },
  ];

  const secondaryLinks: { page: AppPageId; label: string }[] = [
    { page: 'safety', label: t.nav.safety },
    { page: 'categories', label: t.nav.categories },
    { page: 'quizzes', label: t.nav.quiz },
    { page: 'glossary', label: t.nav.glossary },
    { page: 'favorites', label: t.nav.favorites },
    { page: 'progress', label: t.nav.progress },
    { page: 'electronics', label: t.nav.electronics },
    { page: 'electrical-tools', label: t.nav.electricalTools },
    { page: 'about', label: t.nav.about },
    { page: 'contact', label: t.nav.contact },
  ];

  const allMobileLinks = [...primaryLinks, ...secondaryLinks];

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    setMoreMenuOpen(false);
    setMobileMenuOpen(false);
  }, [activePage]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, page: AppPageId) => {
    e.preventDefault();
    onNavigate({ page });
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
  };

  const secondaryActive = secondaryLinks.some((l) => l.page === activePage);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Logo + Brand Wordmark */}
        <a
          href="#/"
          onClick={(e) => handleNavClick(e, 'home')}
          className="inline-flex items-center gap-2 sm:gap-2.5 shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB]"
          dir="ltr"
        >
          <svg
            viewBox="0 0 32 32"
            className="w-6 h-6 sm:w-7 sm:h-7 shrink-0"
            aria-hidden="true"
          >
            <rect
              x="2"
              y="2"
              width="28"
              height="28"
              rx="7"
              className="fill-[#2563EB] dark:fill-[#1E293B] stroke-[#2563EB] dark:stroke-[#00BFFF]"
              strokeWidth="1.5"
            />
            <path
              d="M17.5 7L10.5 17.5H15.5L14.5 25L21.5 14.5H16.5L17.5 7Z"
              className="fill-white dark:fill-[#00BFFF]"
            />
          </svg>
          <span className="font-display text-base sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            ElectroPedia
          </span>
        </a>

        {/* Zone 2: Single-line navigation links */}
        <nav
          aria-label={t.nav.home}
          className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          {primaryLinks.map((link) => {
            const isActive = activePage === link.page;
            return (
              <a
                key={link.page}
                href={buildRouteHash({ page: link.page })}
                data-testid={`nav-${link.page}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => handleNavClick(e, link.page)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2563EB] ${
                  isActive
                    ? 'text-[#2563EB] dark:text-[#00BFFF] font-semibold underline underline-offset-8 decoration-2'
                    : 'hover:text-[#2563EB] dark:hover:text-[#00BFFF] hover:underline underline-offset-8 decoration-[#2563EB] dark:decoration-[#00BFFF] decoration-2'
                }`}
              >
                {link.label}
              </a>
            );
          })}

          <div ref={moreMenuRef} className="relative shrink-0">
            <button
              type="button"
              data-testid="nav-more-btn"
              aria-expanded={moreMenuOpen}
              onClick={() => setMoreMenuOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 py-1 transition-colors cursor-pointer ${
                secondaryActive
                  ? 'text-[#2563EB] dark:text-[#00BFFF] font-semibold underline underline-offset-8 decoration-2'
                  : 'hover:text-[#2563EB] dark:hover:text-[#00BFFF]'
              }`}
            >
              <span>{t.nav.more}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {moreMenuOpen && (
              <div className="absolute top-full end-0 mt-2 w-48 rounded-xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 shadow-lg p-1.5 z-50">
                {secondaryLinks.map((link) => {
                  const isActive = activePage === link.page;
                  return (
                    <a
                      key={link.page}
                      href={buildRouteHash({ page: link.page })}
                      data-testid={`nav-${link.page}`}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={(e) => handleNavClick(e, link.page)}
                      className={`block px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#2563EB] text-white'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#0F172A]'
                      }`}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Language Switcher, Theme Switcher, Saved Button, Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Language Switcher */}
          <div
            role="group"
            aria-label={t.nav.languageLabel}
            dir="ltr"
            className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-[#1E293B] p-0.5 shrink-0"
          >
            {LOCALE_OPTIONS.map((opt) => {
              const active = locale === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLocale(opt.code)}
                  aria-label={opt.fullName}
                  aria-pressed={active}
                  data-testid={`lang-${opt.code}`}
                  className={`px-1.5 sm:px-2 py-1 text-[11px] sm:text-xs font-mono-tech font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#2563EB] text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            data-testid="theme-toggle"
            aria-label={theme === 'dark' ? t.nav.switchThemeLight : t.nav.switchThemeDark}
            className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-slate-700 dark:text-slate-200 hover:border-[#2563EB] dark:hover:border-[#00BFFF] transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-[#2563EB]"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />
            )}
          </button>

          {/* Saved List Button */}
          <button
            type="button"
            onClick={onOpenSaved}
            data-testid="saved-drawer-trigger"
            aria-label={`${t.nav.saved} (${savedCount})`}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 h-8 sm:h-9 text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
          >
            <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">{t.nav.saved}</span>
            <span className="font-mono-tech text-blue-100">({savedCount})</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={mobileMenuOpen}
            className="lg:hidden inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label={t.nav.openMenu}
          className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] px-4 py-3 grid grid-cols-2 gap-1"
        >
          {allMobileLinks.map((link) => {
            const isActive = activePage === link.page;
            return (
              <a
                key={link.page}
                href={buildRouteHash({ page: link.page })}
                aria-current={isActive ? 'page' : undefined}
                onClick={(e) => handleNavClick(e, link.page)}
                className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#1E293B] hover:text-[#2563EB] dark:hover:text-[#00BFFF]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
}

