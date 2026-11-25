import { MotionConfig } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { ComponentDetailPage } from './components/ComponentDetailPage';
import { EncyclopediaSection } from './components/EncyclopediaSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import {
  AboutCreatorPreviewSection,
  FeaturesSection,
  LearningLevelsSection,
  MainCategoriesSection,
  PopularComponentsSection,
  SafetySection,
  StudyToolsHomeSection,
} from './components/HomepageSections';
import { Navbar } from './components/Navbar';
import { QuizSection } from './components/QuizSection';
import { SavedDrawer } from './components/SavedDrawer';
import { SeoHead } from './components/SeoHead';
import { AppErrorBoundary } from './components/StateFeedback';
import { ELECTRONIC_COMPONENTS } from './data/componentsData';
import { I18nProvider, useI18n } from './i18n/I18nContext';
import { AboutPage } from './pages/AboutPage';
import { CalculatorsPage } from './pages/CalculatorsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ContactPage } from './pages/ContactPage';
import { DomainShowcasePage } from './pages/DomainShowcasePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { GlossaryPage } from './pages/GlossaryPage';
import { ProgressPage } from './pages/ProgressPage';
import { QuizzesPage } from './pages/QuizzesPage';
import { SafetyPage } from './pages/SafetyPage';
import { SymbolsPage } from './pages/SymbolsPage';
import { VirtualLabPage } from './pages/VirtualLabPage';
import { WiringDiagramsPage } from './pages/WiringDiagramsPage';
import type {
  AppRoute,
  ComponentCategoryId,
  DifficultyLevel,
  ElectronicComponent,
  SortOption,
  ThemeMode,
} from './types/electronics';
import { filterComponents, toggleBookmarkId } from './utils/catalogFilter';
import { buildRouteHash, parseAppRoute } from './utils/routes';
import {
  applyThemeToDocument,
  getStoredTheme,
  loadBookmarks,
  recordStudiedComponent,
  saveStoredTheme,
  syncBookmarks,
} from './utils/storage';

function ElectroPediaApp() {
  const { locale, dir } = useI18n();
  const [theme, setTheme] = useState<ThemeMode>(() => getStoredTheme());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategoryId | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  const [route, setRoute] = useState<AppRoute>(() =>
    typeof window !== 'undefined'
      ? parseAppRoute(window.location.hash, window.location.pathname)
      : { page: 'home' }
  );
  const [pendingScrollSection, setPendingScrollSection] = useState<string | null>(null);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [bookmarksLoaded, setBookmarksLoaded] = useState(false);

  useEffect(() => {
    applyThemeToDocument(theme);
    saveStoredTheme(theme);
  }, [theme]);

  useEffect(() => {
    const syncFromLocation = () => {
      const parsed = parseAppRoute(window.location.hash, window.location.pathname);
      setRoute(parsed);
      if (parsed.page === 'categories' && parsed.categoryId) {
        setSelectedCategory(parsed.categoryId);
      }
      if (parsed.page !== 'home' || !parsed.sectionAnchor) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    };

    window.addEventListener('hashchange', syncFromLocation);
    window.addEventListener('popstate', syncFromLocation);
    return () => {
      window.removeEventListener('hashchange', syncFromLocation);
      window.removeEventListener('popstate', syncFromLocation);
    };
  }, []);

  useEffect(() => {
    if (route.page === 'home' && pendingScrollSection) {
      const targetId = pendingScrollSection;
      setPendingScrollSection(null);
      window.requestAnimationFrame(() => {
        if (targetId === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }, [route.page, pendingScrollSection]);

  useEffect(() => {
    let active = true;
    loadBookmarks().then((ids) => {
      if (!active) return;
      setSavedIds(ids);
      setBookmarksLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!bookmarksLoaded) return;
    void syncBookmarks(savedIds);
  }, [savedIds, bookmarksLoaded]);

  const filteredComponents = useMemo(
    () =>
      filterComponents(ELECTRONIC_COMPONENTS, {
        query: searchQuery,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        sort: sortBy,
        locale,
      }),
    [searchQuery, selectedCategory, selectedDifficulty, sortBy, locale]
  );

  const savedComponents = useMemo(
    () =>
      savedIds
        .map((id) => ELECTRONIC_COMPONENTS.find((c) => c.id === id))
        .filter((item): item is ElectronicComponent => Boolean(item)),
    [savedIds]
  );

  const activeComponent = useMemo(
    () =>
      route.page === 'component-detail' && route.componentId
        ? ELECTRONIC_COMPONENTS.find((c) => c.id === route.componentId)
        : undefined,
    [route]
  );

  useEffect(() => {
    if (route.page === 'component-detail' && activeComponent) {
      void recordStudiedComponent(activeComponent.id, {
        id: `studied-${activeComponent.id}`,
        type: 'component',
        label: {
          ar: `دراسة قطعة: ${activeComponent.nameAr}`,
          en: `Studied: ${activeComponent.nameEn}`,
          fr: `Étudié : ${activeComponent.nameFr}`,
        },
        detail: activeComponent.id,
        timestamp: Date.now(),
      });
    }
  }, [route.page, activeComponent]);

  const navigate = (nextRoute: AppRoute) => {
    if (nextRoute.page === 'categories' && nextRoute.categoryId) {
      setSelectedCategory(nextRoute.categoryId);
    }
    setRoute(nextRoute);
    const nextHash = buildRouteHash(nextRoute);
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }
    if (nextRoute.page === 'home' && nextRoute.sectionAnchor) {
      setPendingScrollSection(nextRoute.sectionAnchor);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const navigateToComponent = (id: string) => {
    navigate({ page: 'component-detail', componentId: id });
  };

  const handleDomainSelect = (category: ComponentCategoryId) => {
    setSelectedCategory(category);
    setSelectedDifficulty('all');
    setSearchQuery('');
    navigate({ page: 'categories', categoryId: category });
  };

  const handleLevelSelect = (difficulty: DifficultyLevel | 'all') => {
    setSelectedCategory('all');
    setSelectedDifficulty(difficulty);
    setSearchQuery('');
    navigate({ page: 'components' });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSortBy('relevance');
  };

  const handleToggleBookmark = (id: string) => {
    setSavedIds((prev) => toggleBookmarkId(prev, id));
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleDataChanged = () => {
    setBookmarksLoaded(false);
    void loadBookmarks().then((ids) => {
      setSavedIds(ids);
      setBookmarksLoaded(true);
    });
    setTheme(getStoredTheme());
  };

  const renderPage = () => {
    switch (route.page) {
      case 'component-detail':
        return (
          <ComponentDetailPage
            componentId={route.componentId ?? ''}
            allComponents={ELECTRONIC_COMPONENTS}
            isSaved={Boolean(route.componentId && savedIds.includes(route.componentId))}
            onToggleBookmark={handleToggleBookmark}
            onBackToCatalog={() => navigate({ page: 'components' })}
            onNavigateCategory={handleDomainSelect}
            onNavigateComponent={navigateToComponent}
          />
        );

      case 'components':
        return (
          <div data-testid="page-components">
            <EncyclopediaSection
              allComponents={ELECTRONIC_COMPONENTS}
              components={filteredComponents}
              totalCount={ELECTRONIC_COMPONENTS.length}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              selectedDifficulty={selectedDifficulty}
              sortBy={sortBy}
              savedIds={savedIds}
              onSearchChange={setSearchQuery}
              onCategoryChange={setSelectedCategory}
              onDifficultyChange={setSelectedDifficulty}
              onSortChange={setSortBy}
              onResetFilters={handleResetFilters}
              onSelectComponent={(comp) => navigateToComponent(comp.id)}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        );

      case 'categories':
        return (
          <CategoriesPage
            allComponents={ELECTRONIC_COMPONENTS}
            filteredComponents={filteredComponents}
            selectedCategory={selectedCategory}
            selectedDifficulty={selectedDifficulty}
            searchQuery={searchQuery}
            sortBy={sortBy}
            savedIds={savedIds}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              navigate(cat === 'all' ? { page: 'categories' } : { page: 'categories', categoryId: cat });
            }}
            onSearchChange={setSearchQuery}
            onDifficultyChange={setSelectedDifficulty}
            onSortChange={setSortBy}
            onResetFilters={handleResetFilters}
            onSelectComponent={(comp) => navigateToComponent(comp.id)}
            onToggleBookmark={handleToggleBookmark}
            onOpenAllComponents={() => navigate({ page: 'components' })}
          />
        );

      case 'electronics':
        return (
          <DomainShowcasePage
            domain="electronics"
            allComponents={ELECTRONIC_COMPONENTS}
            savedIds={savedIds}
            onSelectComponent={(comp) => navigateToComponent(comp.id)}
            onToggleBookmark={handleToggleBookmark}
          />
        );

      case 'electrical-tools':
        return (
          <DomainShowcasePage
            domain="tools"
            allComponents={ELECTRONIC_COMPONENTS}
            savedIds={savedIds}
            onSelectComponent={(comp) => navigateToComponent(comp.id)}
            onToggleBookmark={handleToggleBookmark}
          />
        );

      case 'flashcards':
        return <FlashcardsPage onSelectComponent={(comp) => navigateToComponent(comp.id)} />;

      case 'calculators':
        return <CalculatorsPage />;

      case 'quizzes':
        return <QuizzesPage />;

      case 'symbols':
        return <SymbolsPage onSelectComponentId={navigateToComponent} />;

      case 'wiring-diagrams':
        return <WiringDiagramsPage onSelectComponentId={navigateToComponent} />;

      case 'glossary':
        return <GlossaryPage onSelectComponentId={navigateToComponent} />;

      case 'favorites':
        return (
          <FavoritesPage
            savedComponents={savedComponents}
            savedIds={savedIds}
            onSelectComponent={(comp) => navigateToComponent(comp.id)}
            onToggleBookmark={handleToggleBookmark}
            onClearAll={() => setSavedIds([])}
            onBrowseCatalog={() => navigate({ page: 'components' })}
          />
        );

      case 'progress':
        return (
          <ProgressPage
            savedIds={savedIds}
            onDataChanged={handleDataChanged}
            onOpenQuizzes={() => navigate({ page: 'quizzes' })}
            onOpenFlashcards={() => navigate({ page: 'flashcards' })}
          />
        );

      case 'virtual-lab':
        return (
          <VirtualLabPage
            locale={locale}
            onInspectEncyclopediaComponent={navigateToComponent}
          />
        );

      case 'safety':
        return (
          <SafetyPage
            allComponents={ELECTRONIC_COMPONENTS}
            onSelectComponent={(comp) => navigateToComponent(comp.id)}
          />
        );

      case 'about':
        return (
          <AboutPage
            onBrowseComponents={() => navigate({ page: 'components' })}
            onOpenContact={() => navigate({ page: 'contact' })}
          />
        );

      case 'contact':
        return <ContactPage />;

      case 'home':
      default:
        return (
          <>
            <HeroSection
              components={ELECTRONIC_COMPONENTS}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectComponent={(comp) => navigateToComponent(comp.id)}
              onJumpToEncyclopedia={() => navigate({ page: 'components' })}
              onJumpToLevels={() => navigate({ page: 'home', sectionAnchor: 'levels' })}
            />

            <MainCategoriesSection onSelectCategory={handleDomainSelect} />

            <PopularComponentsSection
              onSelectComponent={(comp) => navigateToComponent(comp.id)}
            />

            <LearningLevelsSection onSelectLevel={handleLevelSelect} />

            <FeaturesSection />

            <SafetySection />

            <AboutCreatorPreviewSection
              onOpenAbout={() => navigate({ page: 'about' })}
              onOpenContact={() => navigate({ page: 'contact' })}
            />

            <StudyToolsHomeSection
              onOpenFlashcards={() => navigate({ page: 'flashcards' })}
              onOpenCalculators={() => navigate({ page: 'calculators' })}
              onNavigate={navigate}
            />

            <QuizSection onOpenFullPage={() => navigate({ page: 'quizzes' })} />
          </>
        );
    }
  };

  return (
    <div
      dir={dir}
      className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 transition-colors"
    >
      <SeoHead route={route} activeComponent={activeComponent} />

      <Navbar
        theme={theme}
        activePage={route.page}
        onToggleTheme={handleToggleTheme}
        savedCount={savedIds.length}
        onOpenSaved={() => setSavedDrawerOpen(true)}
        onNavigate={navigate}
      />

      <main className="flex-1">
        <AppErrorBoundary onResetHome={() => navigate({ page: 'home' })}>
          {renderPage()}
        </AppErrorBoundary>
      </main>

      <Footer onNavigate={navigate} />

      <SavedDrawer
        open={savedDrawerOpen}
        savedComponents={savedComponents}
        onClose={() => setSavedDrawerOpen(false)}
        onInspect={(comp) => navigateToComponent(comp.id)}
        onRemove={handleToggleBookmark}
        onClearAll={() => setSavedIds([])}
        onOpenFavoritesPage={() => navigate({ page: 'favorites' })}
      />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <MotionConfig reducedMotion="user">
        <ElectroPediaApp />
      </MotionConfig>
    </I18nProvider>
  );
}
