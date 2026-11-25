import type { AudienceLevelId, DifficultyLevel, Locale } from '../types/electronics';

export interface MessagesSchema {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    categories: string;
    components: string;
    electronics: string;
    electricalTools: string;
    popular: string;
    levels: string;
    safety: string;
    encyclopedia: string;
    about: string;
    contact: string;
    lab: string;
    virtualLab: string;
    quiz: string;
    flashcards: string;
    calculators: string;
    symbols: string;
    wiringDiagrams: string;
    glossary: string;
    favorites: string;
    progress: string;
    more: string;
    saved: string;
    openMenu: string;
    closeMenu: string;
    switchThemeLight: string;
    switchThemeDark: string;
    languageLabel: string;
  };
  hero: {
    slogan: string;
    title: string;
    description: string;
    searchPlaceholder: string;
    searchLabel: string;
    exploreBtn: string;
    startLearningBtn: string;
    quickSearchLabel: string;
    caption: string;
    freeBadgeNote: string;
  };
  categoriesSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    browseAction: string;
  };
  popularSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    inspectBtn: string;
  };
  levelsSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    exploreTrack: string;
    items: {
      id: AudienceLevelId;
      code: string;
      title: string;
      audience: string;
      focus: string;
      filterDifficulty: DifficultyLevel | 'all';
    }[];
  };
  featuresSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: {
      title: string;
      description: string;
    }[];
  };
  safetySection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    rules: {
      level: 'danger' | 'warning' | 'success';
      levelLabel: string;
      title: string;
      description: string;
    }[];
  };
  encyclopedia: {
    eyebrow: string;
    title: string;
    subtitle: string;
    photoView: string;
    physicalView: string;
    schematicView: string;
    searchPlaceholder: string;
    levelFilterLabel: string;
    sortLabel: string;
    sortRelevance: string;
    sortNameAsc: string;
    sortNameDesc: string;
    sortDiffAsc: string;
    sortDiffDesc: string;
    suggestionsTitle: string;
    fuzzyHint: string;
    viewAllResults: string;
    allLevels: string;
    allCategories: string;
    showingCount: string;
    emptyTitle: string;
    emptySubtitle: string;
    resetFilters: string;
    detailsBtn: string;
    saveTooltip: string;
    removeTooltip: string;
  };
  states: {
    loadingTitle: string;
    loadingSubtitle: string;
    errorTitle: string;
    errorSubtitle: string;
    retryBtn: string;
    homeBtn: string;
  };
  pages: {
    categories: {
      eyebrow: string;
      title: string;
      subtitle: string;
      allDomainsBtn: string;
      selectedCategoryPrefix: string;
      openInComponents: string;
    };
    electronics: {
      eyebrow: string;
      title: string;
      subtitle: string;
      passiveHeading: string;
      passiveDesc: string;
      activeHeading: string;
      activeDesc: string;
      digitalHeading: string;
      digitalDesc: string;
    };
    electricalTools: {
      eyebrow: string;
      title: string;
      subtitle: string;
      measurementHeading: string;
      measurementDesc: string;
      insulatedHeading: string;
      insulatedDesc: string;
      ppeHeading: string;
      ppeDesc: string;
    };
    safety: {
      eyebrow: string;
      title: string;
      subtitle: string;
      catTitle: string;
      catRows: { cat: string; scope: string; examples: string }[];
      lotoTitle: string;
      lotoSteps: string[];
      hazardsTitle: string;
      shockThresholdsTitle: string;
      shockThresholds: { ma: string; effect: string; severity: 'safe' | 'warning' | 'danger' }[];
      faultComparisonTitle: string;
      shortCircuitVsOverload: { title: string; points: string[] }[];
      earthingTitle: string;
      earthingSystems: { code: string; desc: string }[];
      toolsPpeTitle: string;
      toolsPpePoints: string[];
      workshopTitle: string;
      workshopRules: string[];
      firstAidTitle: string;
      firstAidWarning: string;
      firstAidSteps: string[];
    };
    about: {
      eyebrow: string;
      title: string;
      subtitle: string;
      creatorCardTitle: string;
      creatorRoleBadge: string;
      creatorSchool: string;
      creatorMajor: string;
      creatorParagraphs: string[];
      missionTitle: string;
      missionItems: { title: string; desc: string }[];
      ctaBrowse: string;
      ctaContact: string;
    };
    contact: {
      eyebrow: string;
      title: string;
      subtitle: string;
      directTitle: string;
      directDesc: string;
      emailLabel: string;
      copyEmail: string;
      emailCopied: string;
      instituteLabel: string;
      instituteValue: string;
      formTitle: string;
      formDesc: string;
      nameLabel: string;
      namePlaceholder: string;
      emailFieldLabel: string;
      emailFieldPlaceholder: string;
      subjectLabel: string;
      subjectPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      sendBtn: string;
      openMailBtn: string;
      successTitle: string;
      successDesc: string;
      validationError: string;
      recentTitle: string;
      clearMessages: string;
    };
  };
  modal: {
    close: string;
    saveBtn: string;
    savedBtn: string;
    physicalShape: string;
    physicalCaption: string;
    schematicSymbol: string;
    schematicCaption: string;
    coreFunction: string;
    howItWorks: string;
    pinoutTitle: string;
    pinCol: string;
    nameCol: string;
    roleCol: string;
    specsTitle: string;
    paramCol: string;
    valueCol: string;
    applicationsTitle: string;
    safetyTitle: string;
    relatedTitle: string;
  };
  lab: {
    eyebrow: string;
    title: string;
    subtitle: string;
    tabResistor: string;
    tabOhmLed: string;
    tabRc: string;
    computedValue: string;
    rangeLabel: string;
    band1: string;
    band2: string;
    multiplier: string;
    tolerance: string;
    ohmTitle: string;
    voltageLabel: string;
    resistanceLabel: string;
    currentOut: string;
    powerOut: string;
    powerWarning: string;
    powerSafe: string;
    ledTitle: string;
    supplyV: string;
    ledVf: string;
    ledIf: string;
    ledExact: string;
    ledE12: string;
    ledPower: string;
    ledColors: { red: string; green: string; blue: string };
    rcTitle: string;
    capLabel: string;
    tauLabel: string;
    fullChargeLabel: string;
    cutoffLabel: string;
    rcCurveTitle: string;
  };
  quiz: {
    eyebrow: string;
    title: string;
    subtitle: string;
    openFullQuiz: string;
    setupTitle: string;
    categoryLabel: string;
    difficultyLabel: string;
    questionCountLabel: string;
    questionTypeLabel: string;
    typeLabels: Record<
      | 'all'
      | 'mcq'
      | 'mcq-photo'
      | 'mcq-symbol'
      | 'mcq-function'
      | 'true-false'
      | 'match-images'
      | 'match-trilingual'
      | 'mcq-calculation'
      | 'mcq-safety',
      string
    >;
    startQuizBtn: string;
    retrySameBtn: string;
    newQuizBtn: string;
    scoreLabel: string;
    bestLabel: string;
    attemptsLabel: string;
    averageLabel: string;
    accuracyLabel: string;
    finishedTitle: string;
    finishedExcellent: string;
    finishedGood: string;
    finishedRetry: string;
    savedNotice: string;
    restartBtn: string;
    modeSchematic: string;
    modePhysical: string;
    modeFunction: string;
    modeFormula: string;
    modeSafety: string;
    modeMatchImg: string;
    modeMatchTri: string;
    modeTrueFalse: string;
    questionPrefix: string;
    ofWord: string;
    correctTitle: string;
    wrongTitle: string;
    nextBtn: string;
    finishBtn: string;
    functionHint: string;
    trueBtn: string;
    falseBtn: string;
    checkAnswerBtn: string;
    matchPhotoHint: string;
    matchPhotoSelectedLabel: string;
    matchPairBtn: string;
    matchTrilingualHint: string;
    selectOptionPlaceholder: string;
    colYourAnswer: string;
    colCorrectAnswer: string;
    reviewTitle: string;
    historyTitle: string;
    historySubtitle: string;
    historyEmpty: string;
    clearHistoryBtn: string;
    noQuestionsTitle: string;
    noQuestionsSubtitle: string;
    resetSetupBtn: string;
    availableCountLabel: string;
  };
  savedDrawer: {
    title: string;
    subtitle: string;
    close: string;
    emptyTitle: string;
    emptySubtitle: string;
    totalLabel: string;
    clearAll: string;
    openFavoritesPage: string;
  };
  footer: {
    tagline: string;
    freeAccess: string;
  };
  componentPage: {
    backToCatalog: string;
    breadcrumbHome: string;
    breadcrumbEncyclopedia: string;
    trilingualTitle: string;
    altNamesLabel: string;
    copyLink: string;
    linkCopied: string;
    symbolLabel: string;
    packageLabel: string;
    galleryTitle: string;
    tabPhoto: string;
    tabPhysical: string;
    tabSymbol: string;
    tabWiring: string;
    tabAnatomy: string;
    definitionTitle: string;
    functionTitle: string;
    workingPrincipleTitle: string;
    electricalSymbolTitle: string;
    anatomyTitle: string;
    internalPartsTitle: string;
    externalPartsTitle: string;
    typesTitle: string;
    specsTitle: string;
    terminalsTitle: string;
    wiringTitle: string;
    applicationsTitle: string;
    faultsTitle: string;
    testingTitle: string;
    safetyTitle: string;
    difficultyTitle: string;
    relatedTitle: string;
    referencesTitle: string;
    model3dTitle: string;
    model3dDesc: string;
    model3dStatusReady: string;
    model3dStatusPlanned: string;
    model3dFormat: string;
    model3dDimensions: string;
    model3dHotspots: string;
    notFoundTitle: string;
    notFoundSubtitle: string;
  };
  flashcards: {
    eyebrow: string;
    title: string;
    subtitle: string;
    frontModeLabel: string;
    modePhoto: string;
    modeSymbol: string;
    modeMixed: string;
    deckFilterLabel: string;
    filterAll: string;
    filterDue: string;
    filterDifficult: string;
    filterSaved: string;
    categoryLabel: string;
    levelLabel: string;
    shuffleBtn: string;
    resetOrderBtn: string;
    resetProgressBtn: string;
    flipToBack: string;
    flipToFront: string;
    prevBtn: string;
    nextBtn: string;
    saveCardBtn: string;
    savedCardBtn: string;
    markDifficultBtn: string;
    difficultTag: string;
    openDetailsBtn: string;
    frontHintPhoto: string;
    frontHintSymbol: string;
    backNameAr: string;
    backNameEn: string;
    backNameFr: string;
    backFunction: string;
    backSummary: string;
    srsPrompt: string;
    rateAgain: string;
    rateHard: string;
    rateGood: string;
    rateEasy: string;
    dueNowLabel: string;
    daySuffix: string;
    daysSuffix: string;
    statsTotal: string;
    statsReviewed: string;
    statsMastered: string;
    statsDifficult: string;
    statsSaved: string;
    statsDue: string;
    emptyDeckTitle: string;
    emptyDeckSubtitle: string;
    showAllBtn: string;
    keyboardHint: string;
  };
  calculators: {
    eyebrow: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allGroups: string;
    groups: {
      fundamentals: string;
      circuits: string;
      installations: string;
      machines: string;
      solar: string;
      tools: string;
    };
    resetBtn: string;
    formulaTitle: string;
    resultsTitle: string;
    stepsTitle: string;
    explanationTitle: string;
    assumptionsTitle: string;
    diagramTitle: string;
    inputsTitle: string;
    validationTitle: string;
    countLabel: string;
    items: Record<
      import('../types/electronics').CalculatorId,
      { name: string; shortDesc: string }
    >;
  };
  difficulty: Record<DifficultyLevel, string>;
  symbols: {
    eyebrow: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allDomains: string;
    standardLabel: string;
    iecLabel: string;
    ansiLabel: string;
    activeStandardNote: string;
    functionLabel: string;
    trilingualLabel: string;
    viewComponentBtn: string;
    emptyTitle: string;
    emptySubtitle: string;
    resetBtn: string;
    countLabel: string;
  };
  wiringLibrary: {
    eyebrow: string;
    title: string;
    subtitle: string;
    allCategories: string;
    zoomIn: string;
    zoomOut: string;
    resetZoom: string;
    zoomLevelLabel: string;
    voltageLabel: string;
    standardLabel: string;
    explanationTitle: string;
    componentsTitle: string;
    symbolsTitle: string;
    safetyTitle: string;
    viewComponentBtn: string;
  };
  glossary: {
    eyebrow: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allLetters: string;
    relatedTitle: string;
    emptyTitle: string;
    emptySubtitle: string;
    resetBtn: string;
    countLabel: string;
  };
  favorites: {
    eyebrow: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    allLevels: string;
    photoView: string;
    physicalView: string;
    schematicView: string;
    removeBtn: string;
    clearAllBtn: string;
    clearConfirmTitle: string;
    clearConfirmDesc: string;
    confirmBtn: string;
    cancelBtn: string;
    storageNotice: string;
    emptyTitle: string;
    emptySubtitle: string;
    browseBtn: string;
    countLabel: string;
  };
  progress: {
    eyebrow: string;
    title: string;
    subtitle: string;
    deviceNoticeTitle: string;
    deviceNoticeDesc: string;
    kpiStudied: string;
    kpiStudiedSub: string;
    kpiQuizzes: string;
    kpiAvgScore: string;
    kpiSavedCards: string;
    kpiReviewCards: string;
    kpiFavorites: string;
    categoryChartTitle: string;
    difficultyChartTitle: string;
    quizTrendTitle: string;
    quizTrendEmpty: string;
    logTitle: string;
    logEmpty: string;
    dataManagementTitle: string;
    dataManagementDesc: string;
    exportBtn: string;
    importBtn: string;
    importSuccess: string;
    importError: string;
    resetBtn: string;
    resetModalTitle: string;
    resetModalDesc: string;
    resetConfirmBtn: string;
    resetCancelBtn: string;
    resetSuccess: string;
    componentsUnit: string;
    masteredLabel: string;
    openQuizBtn: string;
    openFlashcardsBtn: string;
  };
  homeHub: {
    eyebrow: string;
    title: string;
    subtitle: string;
    symbolsTitle: string;
    symbolsDesc: string;
    wiringTitle: string;
    wiringDesc: string;
    glossaryTitle: string;
    glossaryDesc: string;
    favoritesTitle: string;
    favoritesDesc: string;
    progressTitle: string;
    progressDesc: string;
    safetyTitle: string;
    safetyDesc: string;
    virtualLabTitle: string;
    virtualLabDesc: string;
  };
  labWorkspace: {
    eyebrow: string;
    title: string;
    safetyBanner: string;
    paletteTitle: string;
    searchComponents: string;
    allCategories: string;
    canvasHint: string;
    wiringHint: string;
    cancelWire: string;
    tabProperties: string;
    tabResults: string;
    tabInstruments: string;
    startSim: string;
    pauseSim: string;
    stopSim: string;
    resetSim: string;
    speedLabel: string;
    templatesBtn: string;
    projectsBtn: string;
    ladderBtn: string;
    clearBtn: string;
    undoBtn: string;
    redoBtn: string;
    copyBtn: string;
    pasteBtn: string;
    rotateBtn: string;
    deleteBtn: string;
    gridBtn: string;
    snapBtn: string;
    fitBtn: string;
    exportJsonBtn: string;
    importJsonBtn: string;
    statusRunning: string;
    statusPaused: string;
    statusStopped: string;
    statusComponents: string;
    statusWires: string;
    statusTime: string;
    statusSelected: string;
    noSelection: string;
    selectHint: string;
    openEncyclopedia: string;
    diagnosticsTitle: string;
    noDiagnostics: string;
    nodeVoltagesTitle: string;
    scopeTitle: string;
    noScopeHint: string;
    clearConfirmTitle: string;
    clearConfirmDesc: string;
    confirmBtn: string;
    cancelBtn: string;
  };
}

export const MESSAGES: Record<Locale, MessagesSchema> = {
  ar: {
    meta: {
      title: 'ElectroPedia — موسوعتك الشاملة في عالم الكهرباء والإلكترونيات',
      description: 'موسوعتك الشاملة في عالم الكهرباء والإلكترونيات — مجانية وبدون تسجيل حساب.',
    },
    nav: {
      home: 'الرئيسية',
      categories: 'التصنيفات',
      components: 'القطع',
      electronics: 'الإلكترونيات',
      electricalTools: 'الأدوات',
      levels: 'المستويات',
      safety: 'السلامة',
      encyclopedia: 'الموسوعة',
      popular: 'القطع الشائعة',
      about: 'من نحن',
      contact: 'تواصل معنا',
      lab: 'المختبر',
      virtualLab: 'المختبر الافتراضي',
      quiz: 'الاختبار',
      flashcards: 'البطاقات',
      calculators: 'الحاسبات',
      symbols: 'الرموز',
      wiringDiagrams: 'مخططات التوصيل',
      glossary: 'القاموس',
      favorites: 'المفضلة',
      progress: 'تقدمي',
      more: 'المزيد',
      saved: 'المفضلة',
      openMenu: 'فتح القائمة',
      closeMenu: 'إغلاق القائمة',
      switchThemeLight: 'التبديل للوضع الفاتح',
      switchThemeDark: 'التبديل للوضع الداكن',
      languageLabel: 'تغيير اللغة',
    },
    hero: {
      slogan: 'Explore. Learn. Connect.',
      title: 'اكتشف عالم الكهرباء والإلكترونيات',
      description:
        'موسوعتك الشاملة للتعرف على أشكال القطع الكهربائية والإلكترونية الحقيقية، رموزها التخطيطية، وظائفها العملية، ومواصفاتها القياسية من المستوى الأساسي حتى الهندسة المتقدمة — مجاناً وبدون تسجيل حساب.',
      searchPlaceholder: 'ابحث باسم القطعة أو الرمز...',
      searchLabel: 'ابحث عن قطعة كهربائية أو إلكترونية',
      exploreBtn: 'استكشف الموسوعة',
      startLearningBtn: 'ابدأ التعلم',
      quickSearchLabel: 'بحث سريع:',
      caption: 'التعرف البصري على المكونات · الأشكال الواقعية والرموز الهندسية',
      freeBadgeNote: 'وصول مجاني بالكامل · بدون إنشاء حساب',
    },
    categoriesSection: {
      eyebrow: 'التصنيفات الرئيسية',
      title: 'مجالات الكهرباء والإلكترونيات الأساسية',
      subtitle: 'اختر أي مجال لاستعراض القطع المصنفة تحته ومعرفة أشكالها ووظائفها ومواصفاتها.',
      browseAction: 'استعراض التصنيف',
    },
    popularSection: {
      eyebrow: 'القطع الكهربائية الشائعة',
      title: 'مكونات أساسية في كل دائرة ومشروع',
      subtitle: 'القطع الأكثر استخداماً في المختبرات واللوحات الكهربائية للبدء بالتعرف عليها فوراً.',
      inspectBtn: 'عرض المواصفات',
    },
    levelsSection: {
      eyebrow: 'مستويات التعلم',
      title: 'مسارات مناسبة لكل مستوى دراسي ومهني',
      subtitle: 'سواء كنت تبدأ خطواتك الأولى أو تعمل في الميدان الصناعي، اختر مستواك للوصول للمحتوى الأنسب لك.',
      exploreTrack: 'عرض محتوى المستوى',
      items: [
        {
          id: 'beginners',
          code: '01 · المستوى التأسيسي',
          title: 'المبتدئون',
          audience: 'الهواة والمبتدئون في الإلكترونيات',
          focus: 'التمييز البصري بين المقاومات والمكثفات والدايودات والـ LED واستخدام لوحة التجارب.',
          filterDifficulty: 'beginner',
        },
        {
          id: 'bp_bt',
          code: '02 · التعليم المهني والتقني',
          title: 'طلاب BP و BT',
          audience: 'التأهيل المهني والبكالوريا التقنية',
          focus: 'أجهزة الحماية والربط الكهربائي، المرحلات، المحولات، القواطع الأوتوماتيكية، وقراءة المخططات.',
          filterDifficulty: 'beginner',
        },
        {
          id: 'ts_lt',
          code: '03 · التقني العالي والإجازة',
          title: 'طلاب TS و LT',
          audience: 'التقني السامي والإجازة التقنية',
          focus: 'تحليل دوائر أشباه الموصلات، مؤقت 555، مضخمات العمليات، والكونتاكتورات الصناعية.',
          filterDifficulty: 'intermediate',
        },
        {
          id: 'engineering',
          code: '04 · التعليم الجامعي',
          title: 'طلاب الهندسة',
          audience: 'كليات الهندسة الكهربائية والإلكترونية',
          focus: 'تصميم أنظمة القدرة، الترانزستورات MOSFET، المتحكمات الدقيقة، وحسابات التردد و RC.',
          filterDifficulty: 'intermediate',
        },
        {
          id: 'professionals',
          code: '05 · الممارسة الميدانية',
          title: 'الكهربائيون والفنيون المحترفون',
          audience: 'مهندسو الصيانة والفنيون الميدانيون',
          focus: 'مرجع سريع لتوزيع الأطراف (Pinout)، تيارات القطع، العزل الضوئي، وقواعد السلامة المهنية.',
          filterDifficulty: 'all',
        },
      ],
    },
    featuresSection: {
      eyebrow: 'مميزات الموقع',
      title: 'أدوات تعلم عملية مصممة للفهم السريع',
      subtitle: 'كل ما تحتاجه للدراسة والمراجعة في مكان واحد وبدون قيود أو اشتراكات.',
      items: [
        {
          title: 'مقارنة الشكل الواقعي والرمز',
          description: 'عرض متزامن للشكل الفيزيائي للقطعة مع رمزها القياسي في المخططات لتفهم التطابق بين الورق والواقع.',
        },
        {
          title: 'محتوى ثلاثي اللغات AR / EN / FR',
          description: 'تبديل فوري بين العربية والإنجليزية والفرنسية لمواكبة المصطلحات الأكاديمية وكتالوجات المصانع.',
        },
        {
          title: 'محرك بحث ذكي وتصفية متقدمة',
          description: 'بحث ثلاثي اللغات يدعم الأسماء البديلة والأخطاء الإملائية البسيطة والاقتراحات الفورية بالصور.',
        },
        {
          title: 'حفظ محلي بدون تسجيل حساب',
          description: 'تحفظ اختياراتك ومراجعاتك تلقائياً عبر IndexedDB و LocalStorage لتعمل بسلاسة في أي وقت.',
        },
      ],
    },
    safetySection: {
      eyebrow: 'قسم السلامة المهنية',
      title: 'قواعد السلامة الكهربائية قبل لمس أي دائرة',
      subtitle: 'الاحتراف يبدأ بالسلامة: التزم بهذه الضوابط الأساسية في المختبر والورشة والميدان.',
      rules: [
        {
          level: 'danger',
          levelLabel: 'إلزامي · خطر صدمة',
          title: 'افصل المصدر وتأكد بالقياس قبل العمل',
          description: 'لا تفترض أن القاطع مفصول؛ تحقق دائماً باستخدام جهاز القياس (Multimeter) وتطبيق إجراءات العزل (LOTO).',
        },
        {
          level: 'danger',
          levelLabel: 'تحذير · جهد مخزن',
          title: 'فرغ المكثفات الكبيرة قبل الفحص',
          description: 'تحتفظ مكثفات مزودات الطاقة بجهد خطير حتى بعد فصل الكهرباء؛ فرغها بمقاومة مناسبة قبل لمس الأرجل.',
        },
        {
          level: 'warning',
          levelLabel: 'وقاية · حمل حراري',
          title: 'تحقق من قدرة الواط وتيار القطع',
          description: 'استخدام مقاومة أو سلك أو قاطع بقدرة أقل من تيار الحمل يسبب سخونة مفرطة وقد يؤدي إلى حريق كهربائي.',
        },
        {
          level: 'warning',
          levelLabel: 'حماية · عزل شخصي',
          title: 'ارتدِ معدات الوقاية العازلة (PPE)',
          description: 'استخدم القفازات والأحذية العازلة والأدوات ذات المقابض المعزولة والمصنفة للجهد عند العمل في اللوحات.',
        },
        {
          level: 'success',
          levelLabel: 'ممارسة آمنة',
          title: 'راجع القطبية وترتيب الأطراف (Pinout)',
          description: 'تحقق من الساق الموجبة والسالبة في المكثفات والدايودات ومنظمات الجهد قبل تشغيل التغذية.',
        },
        {
          level: 'success',
          levelLabel: 'حماية الدائرة',
          title: 'اعتمد المصاهر والقواطع التفاضلية',
          description: 'ضع مصهراً مناسباً أو قاطعاً أوتوماتيكياً لحماية المعدات والأشخاص من تيارات القصر والتسريب الأرضي.',
        },
      ],
    },
    encyclopedia: {
      eyebrow: 'الموسوعة الكاملة',
      title: 'موسوعة القطع الكهربائية والإلكترونية',
      subtitle: 'تصفح جميع المكونات بصورها الواقعية ورموزها القياسية، واستخدم البحث الذكي أو التصفية حسب التصنيف والمستوى.',
      photoView: 'الصور الحقيقية',
      physicalView: 'الشكل الهندسي',
      schematicView: 'الرمز التخطيطي',
      searchPlaceholder: 'ابحث باسم القطعة، الاسم البديل، أو الرمز...',
      levelFilterLabel: 'المستوى:',
      sortLabel: 'الترتيب:',
      sortRelevance: 'الأكثر صلة',
      sortNameAsc: 'الاسم (أ ← ي)',
      sortNameDesc: 'الاسم (ي ← أ)',
      sortDiffAsc: 'المستوى (مبتدئ ← متقدم)',
      sortDiffDesc: 'المستوى (متقدم ← مبتدئ)',
      suggestionsTitle: 'اقتراحات البحث الذكي',
      fuzzyHint: 'تطابق تقريبي',
      viewAllResults: 'عرض جميع النتائج في الموسوعة',
      allLevels: 'جميع المستويات',
      allCategories: 'الكل',
      showingCount: 'عرض {shown} من {total}',
      emptyTitle: 'لم يتم العثور على قطع مطابقة لبحثك',
      emptySubtitle: 'جرب كلمة بحث أخرى أو أعد ضبط الفلاتر لعرض جميع المكونات.',
      resetFilters: 'إعادة ضبط الفلاتر',
      detailsBtn: 'التفاصيل والمواصفات',
      saveTooltip: 'حفظ في المحفوظات',
      removeTooltip: 'إزالة من المحفوظات',
    },
    states: {
      loadingTitle: 'جاري تجهيز البيانات التعليمية...',
      loadingSubtitle: 'يتم الآن تحميل بطاقات القطع والمواصفات القياسية.',
      errorTitle: 'حدث خطأ غير متوقع أثناء عرض الصفحة',
      errorSubtitle: 'يمكنك إعادة المحاولة أو العودة إلى الصفحة الرئيسية لمتابعة التعلم.',
      retryBtn: 'إعادة المحاولة',
      homeBtn: 'العودة للرئيسية',
    },
    pages: {
      categories: {
        eyebrow: 'تصنيفات الموسوعة',
        title: 'جميع مجالات الكهرباء والإلكترونيات',
        subtitle: 'استعرض التصنيفات السبعة الرئيسية وتعمّق مباشرة في القطع المصنفة ضمن كل مجال.',
        allDomainsBtn: 'عرض كل التصنيفات',
        selectedCategoryPrefix: 'تصفح مجال:',
        openInComponents: 'فتح في صفحة القطع الكاملة',
      },
      electronics: {
        eyebrow: 'قسم الإلكترونيات',
        title: 'المكونات الإلكترونية وأشباه الموصلات',
        subtitle: 'من المقاومات والمكثفات السلبية إلى الدايودات والترانزستورات والمتحكمات الدقيقة ولوحات PCB.',
        passiveHeading: 'العناصر السلبية (Passive)',
        passiveDesc: 'المقاومات، المكثفات، والملفات الأساسية لتنظيم التيار والجهد والترشيح.',
        activeHeading: 'أشباه الموصلات والقدرة',
        activeDesc: 'الدايودات، الـ LED، الترانزستورات BJT، الموسفت MOSFET، والثايرستورات.',
        digitalHeading: 'الدوائر المتكاملة والتحكم',
        digitalDesc: 'منظمات الجهد، البوابات المنطقية، المتحكمات الدقيقة، ولوحات الدوائر المطبوعة.',
      },
      electricalTools: {
        eyebrow: 'قسم الأدوات والمعدات',
        title: 'أجهزة القياس والأدوات الكهربائية المعزولة',
        subtitle: 'تعرّف على أجهزة الفحص والقياس (CAT III / CAT IV)، الأدوات اليدوية المعزولة 1000V، ومعدات السلامة PPE.',
        measurementHeading: 'أجهزة القياس والاختبار',
        measurementDesc: 'الملتيميتر، بنسة الأمبير، فاحص الجهد VAT، راسم الإشارة، وفاحص العزل الميغر.',
        insulatedHeading: 'الأدوات اليدوية والتركيب',
        insulatedDesc: 'مفكات VDE المعزولة، قشارة الأسلاك، الزرديات، مكابس الكبس، المثقاب، وكاوية اللحام.',
        ppeHeading: 'معدات الحماية الشخصية',
        ppeDesc: 'القفازات العازلة Class 00/0، الخوذات، والنظارات الواقية للعمل الميداني الآمن.',
      },
      safety: {
        eyebrow: 'السلامة المهنية الكهربائية',
        title: 'دليل السلامة المهنية والوقاية في الورش والمواقع',
        subtitle: 'مبادئ العزل الكهربائي، خطوات التأمين LOTO، فئات أجهزة القياس CAT، ومعدات الحماية الإلزامية.',
        catTitle: 'فئات أمان أجهزة القياس (IEC 61010)',
        catRows: [
          { cat: 'CAT II', scope: 'الأحمال المنزلية والمآخذ الجدارية والأجهزة المحمولة', examples: 'اختبار مآخذ 230V وأجهزة المختبر' },
          { cat: 'CAT III', scope: 'توزيع المباني ولوحات القواطع الفرعية والإنارة والمحركات الثلاثية', examples: 'لوحات التوزيع والمفاتيح الرئيسية' },
          { cat: 'CAT IV', scope: 'مصدر التغذية الرئيسي والعدادات والكابلات الأرضية والهوائية', examples: 'مداخل المحولات ولوحات الخدمة الرئيسية' },
        ],
        lotoTitle: 'الخطوات الخمس للعمل الكهربائي الآمن (LOTO & VAT)',
        lotoSteps: [
          '1. الفصل الكامل للدائرة عن مصدر التغذية من القاطع الرئيسي.',
          '2. تأمين القاطع بقفل وبطاقة تحذير (Lockout / Tagout) لمنع إعادة التشغيل.',
          '3. التحقق القاطع من غياب الجهد عبر فاحص ثنائي القطب (VAT) قبل وبعد الاختبار على مصدر حي معروف.',
          '4. تفريغ المكثفات الكبيرة وتأريض الأجزاء الموصلة عند الضرورة.',
          '5. ارتداء القفازات المعزولة Class 0 واستخدام أدوات VDE 1000V المعتمدة.',
        ],
        hazardsTitle: 'المخاطر الكهربائية وعتبات الصعق وفق IEC 60479-1 (تيار متردد 50/60Hz)',
        shockThresholdsTitle: 'التلامس المباشر (لمس طور حي) مقابل التلامس غير المباشر (لمس هيكل معدني مكهرب)',
        shockThresholds: [
          { ma: '1–5 mA', effect: 'إحساس خفيف بالوخز مع بقاء القدرة على ترك الموصل بأمان.', severity: 'safe' },
          { ma: '10–15 mA', effect: 'عتبة عدم الإفلات (Let-Go Threshold): انقباض عضلي يمنع إفلات السلك.', severity: 'warning' },
          { ma: '30 mA', effect: 'عتبة فصل القاطع التفاضلي (RCD) لحماية الأرواح قبل خطر توقف التنفس.', severity: 'warning' },
          { ma: '50–100+ mA', effect: 'الرجفان البطيني للقلب (Ventricular Fibrillation) وخطر السكتة القلبية الفورية.', severity: 'danger' },
        ],
        faultComparisonTitle: 'الفرق بين القصر الكهربائي (Short Circuit) والحمل الزائد (Overload)',
        shortCircuitVsOverload: [
          {
            title: 'القصر الكهربائي (Short Circuit)',
            points: [
              'تلامس مباشر منخفض المقاومة بين الطور والحيادي أو بين طورين.',
              'تيار لحظي هائل (مئات إلى آلاف الأمبيرات) وقوس كهربائي وحرارة فورية.',
              'يفصله الجزء المغناطيسي في MCB أو المصهر خلال أجزاء من الألف من الثانية.',
            ],
          },
          {
            title: 'الحمل الزائد (Overload)',
            points: [
              'تشغيل أجهزة أكثر من قدرة السلك أو المحرك لفترة زمنية ممتدة.',
              'ارتفاع تدريجي في الحرارة يؤدي لتشقق العزل واحتراق الملفات.',
              'يفصله الشريط ثنائي المعدن الحراري في MCB أو المرحل الحراري F1.',
            ],
          },
        ],
        earthingTitle: 'أنظمة التأريض الوقائي (TT / TN / IT)',
        earthingSystems: [
          { code: 'نظام TT', desc: 'تأريض نقطة حيادي المحول وتأريض مستقل لهياكل المبنى؛ إلزامي معه قاطع تفاضلي RCD 30mA.' },
          { code: 'نظام TN-S / TN-C-S', desc: 'ربط الهياكل المعدنية بالموصل الواقي PE المتصل مباشرة بتأريض المحول لتأمين فصل القاطع فور حدوث قصر أرضي.' },
          { code: 'نظام IT', desc: 'حيادي معزول عن الأرضي؛ لا يفصل عند أول عطل أرضي وتستخدم في غرف العمليات والمصانع الحرجة مع مراقب عزل.' },
        ],
        toolsPpeTitle: 'الأدوات المعزولة 1000V ومعدات الوقاية الشخصية (PPE)',
        toolsPpePoints: [
          'أدوات يدوية معتمدة وفق IEC 60900 بعزل ثنائي الطبقة يتحمل 1000V AC مع حافة أمان تمنع انزلاق اليد.',
          'قفازات عازلة Class 00 (500V) أو Class 0 (1000V) مع فحص الهواء قبل كل استخدام.',
          'خوذة عازلة Class E وواقي وجه من القوس الكهربائي وأحذية غير موصلة (EH) بدون مسامير مكشوفة.',
        ],
        workshopTitle: 'قواعد السلامة داخل المختبر والورشة المهنية',
        workshopRules: [
          'حافظ على جفاف الأرضية وطاولة العمل؛ الرطوبة تخفض مقاومة الجسم أضعافاً.',
          'انزع الساعات والخواتم والأساور المعدنية تماماً قبل العمل قرب اللوحات.',
          'اعمل بيد واحدة عند القياس على دوائر حية لعدم إغلاق مسار التيار عبر القلب.',
          'تأكد من سلامة الكوابل ومجسات الفحص وعدم وجود نحاس مكشوف قبل التشغيل.',
        ],
        firstAidTitle: 'الإسعافات الأولية لحوادث الصعق الكهربائي (ERC / OSHA)',
        firstAidWarning: 'لا تلمس المصاب بيديك العاريتين ما دام متصلاً بمصدر الكهرباء؛ قد تصعق أنت أيضاً!',
        firstAidSteps: [
          '1. افصل الكهرباء فوراً من القاطع الرئيسي أو انزع الفيشة، أو أبعد السلك بأداة جافة غير موصلة (خشب جاف أو بلاستيك) عند الجهد المنخفض فقط.',
          '2. اتصل بالإسعاف والطوارئ فوراً مع تحديد مكان الحادث ونوع الجهد (منخفض أو متوسط/عالٍ — في الجهد العالي ابقَ بعيداً واطلب شركة الكهرباء).',
          '3. بعد التأكد التام من الأمان وانقطاع التيار، افحص الوعي والتنفس لدى المصاب.',
          '4. إذا لم يكن يتنفس بشكل طبيعي، ابدأ الإنعاش القلبي الرئوي (CPR) فوراً واستخدم مزيل الرجفان الآلي (AED) إن توفر.',
          '5. للحروق الكهربائية: برّد المنطقة بماء جارٍ نظيف ولا تضع مراهم أو تزل الملابس الملتصقة، وتابع العلامات الحيوية حتى وصول الطوارئ.',
        ],
      },
      about: {
        eyebrow: 'حول المشروع والمنشئ',
        title: 'قصة ElectroPedia ورؤية تعليمية من قلب التعليم المهني',
        subtitle: 'مبادرة طلابية مجانية تربط المصطلحات العربية والإنجليزية والفرنسية لخدمة طلاب الكهرباء والإلكترونيات.',
        creatorCardTitle: 'حول منشئ الموقع',
        creatorRoleBadge: 'طالب تعليم مهني وتقني · BT2',
        creatorSchool: 'معهد جبل محسن الفني',
        creatorMajor: 'اختصاص الكهرباء المنزلية — السنة الثانية (BT2)',
        creatorParagraphs: [
          'أنا طالب في التعليم المهني والتقني، أدرس اختصاص الكهرباء المنزلية في السنة الثانية BT2 في معهد جبل محسن الفني.',
          'أنشأت فكرة ElectroPedia لمساعدة الطلاب على التعرف على القطع الكهربائية والإلكترونية وفهم وظائفها ومصطلحاتها باللغات الثلاث (العربية والإنجليزية والفرنسية).',
          'هدفي هو تطوير مهاراتي واكتساب الخبرة العملية وتأسيس مشروع كهربائي خاص بي مستقبلاً.',
        ],
        missionTitle: 'ركائز المنصة التعليمية',
        missionItems: [
          { title: 'موسوعة مرئية مجانية 100%', desc: 'متاحة للجميع بدون إنشاء حساب أو اشتراك لتسهيل المراجعة في المدرسة والورشة.' },
          { title: 'ثلاث لغات بتطابق علمي', desc: 'ربط التسميات المتداولة في الورش بالمصطلحات الأكاديمية في المنهاج اللبناني والدولي.' },
          { title: 'السلامة المهنية أولاً', desc: 'تخصيص قسم واضح للأعطال الشائعة وطرق الفحص الآمن واحتياطات العمل الكهربائي.' },
        ],
        ctaBrowse: 'استعراض الموسوعة',
        ctaContact: 'تواصل مع المنشئ',
      },
      contact: {
        eyebrow: 'تواصل معنا',
        title: 'اقتراحات، تصحيحات علمية، أو تواصل دراسي',
        subtitle: 'يسعدنا استقبال ملاحظات الطلاب والأساتذة والفنيين لتطوير محتوى ElectroPedia وإضافة قطع جديدة.',
        directTitle: 'معلومات التواصل المباشر',
        directDesc: 'يمكنك المراسلة عبر البريد الإلكتروني أو استخدام النموذج لإرسال رسالتك مباشرة.',
        emailLabel: 'البريد الإلكتروني',
        copyEmail: 'نسخ البريد',
        emailCopied: 'تم نسخ البريد',
        instituteLabel: 'المعهد والاختصاص',
        instituteValue: 'معهد جبل محسن الفني · الكهرباء المنزلية (BT2)',
        formTitle: 'أرسل رسالة أو اقتراح قطعة جديدة',
        formDesc: 'تحفظ رسائلك محلياً في متصفحك مع خيار فتح تطبيق البريد الإلكتروني لإرسالها فوراً.',
        nameLabel: 'الاسم الكامل',
        namePlaceholder: 'مثال: أحمد علي',
        emailFieldLabel: 'البريد الإلكتروني',
        emailFieldPlaceholder: 'name@example.com',
        subjectLabel: 'الموضوع',
        subjectPlaceholder: 'اقتراح إضافة قطعة أو ملاحظة تعليمية',
        messageLabel: 'نص الرسالة',
        messagePlaceholder: 'اكتب استفسارك أو اسم القطعة التي تقترح إضافتها...',
        sendBtn: 'حفظ وإعداد الإرسال',
        openMailBtn: 'إرسال عبر البريد الإلكتروني',
        successTitle: 'تم حفظ الرسالة وتجهيزها بنجاح',
        successDesc: 'يمكنك الآن الضغط على زر الإرسال عبر البريد الإلكتروني لإيصالها مباشرة.',
        validationError: 'يرجى تعبئة الاسم والبريد الإلكتروني الصحيح ونص الرسالة.',
        recentTitle: 'الرسائل المحفوظة محلياً',
        clearMessages: 'مسح السجل',
      },
    },
    modal: {
      close: 'إغلاق',
      saveBtn: 'حفظ للمراجعة',
      savedBtn: 'محفوظ',
      physicalShape: 'الشكل الفيزيائي',
      physicalCaption: 'المظهر الواقعي للقطعة في الدوائر',
      schematicSymbol: 'الرمز التخطيطي الهندسي',
      schematicCaption: 'الرمز المستخدم في المخططات الكهربائية',
      coreFunction: 'الوظيفة الأساسية',
      howItWorks: 'مبدأ العمل',
      pinoutTitle: 'توزيع الأطراف (Pinout)',
      pinCol: 'الطرف',
      nameCol: 'الاسم',
      roleCol: 'الدور',
      specsTitle: 'المواصفات الكهربائية القياسية',
      paramCol: 'المعامل',
      valueCol: 'القيمة والوحدة',
      applicationsTitle: 'تطبيقات عملية شائعة',
      safetyTitle: 'نصائح وتحذيرات هندسية',
      relatedTitle: 'مكونات ذات صلة للدراسة المتتابعة',
    },
    lab: {
      eyebrow: 'المختبر التفاعلي',
      title: 'الحاسبات والأدوات الهندسية التفاعلية',
      subtitle: 'اقرأ ألوان المقاومات، احسب مقاومة الـ LED، واستكشف منحنى شحن المكثف RC عملياً.',
      tabResistor: 'ألوان المقاومات',
      tabOhmLed: 'قانون أوم و LED',
      tabRc: 'دائرة الشحن RC',
      computedValue: 'القيمة المحسوبة',
      rangeLabel: 'النطاق:',
      band1: 'الحلقة الأولى (الرقم الأول)',
      band2: 'الحلقة الثانية (الرقم الثاني)',
      multiplier: 'الحلقة الثالثة (المضاعف)',
      tolerance: 'الحلقة الرابعة (نسبة الدقة)',
      ohmTitle: 'حاسبة قانون أوم والقدرة',
      voltageLabel: 'الجهد الكهربائي (V)',
      resistanceLabel: 'قيمة المقاومة (Ω)',
      currentOut: 'التيار المار (I)',
      powerOut: 'القدرة المبددة (P)',
      powerWarning: 'تحذير: القدرة تتجاوز 250mW — استخدم مقاومة 0.5W أو 1W.',
      powerSafe: 'آمن لمقاومة قياسية بقدرة 0.25W (ربع واط).',
      ledTitle: 'حاسبة مقاومة حماية الـ LED',
      supplyV: 'جهد المصدر (V)',
      ledVf: 'جهد الـ LED (Vf)',
      ledIf: 'التيار المطلوب (mA)',
      ledExact: 'القيمة الحسابية الدقيقة:',
      ledE12: 'أقرب قيمة تجارية قياسية (E12):',
      ledPower: 'القدرة المبددة على المقاومة:',
      ledColors: { red: 'أحمر/أصفر (2.0V)', green: 'أخضر (2.2V)', blue: 'أزرق/أبيض (3.2V)' },
      rcTitle: 'ثابت الزمن RC ومنحنى الشحن',
      capLabel: 'سعة المكثف (C)',
      tauLabel: 'ثابت الزمن τ',
      fullChargeLabel: 'الشحن الكامل 5τ',
      cutoffLabel: 'تردد القطع fc',
      rcCurveTitle: 'منحنى شحن المكثف الأسي (0 إلى 5τ)',
    },
    quiz: {
      eyebrow: 'الاختبارات التفاعلية التعليمية',
      title: 'اختبر معرفتك الكهربائية والإلكترونية',
      subtitle: 'اختبارات شاملة بترتيب عشوائي تشمل الصور، الرموز، الوظائف، المطابقة ثلاثية اللغات، الحسابات، والسلامة المهنية.',
      openFullQuiz: 'فتح صفحة الاختبارات الكاملة',
      setupTitle: 'إعداد الاختبار المخصص',
      categoryLabel: 'التصنيف',
      difficultyLabel: 'مستوى الصعوبة',
      questionCountLabel: 'عدد الأسئلة',
      questionTypeLabel: 'نوع الأسئلة',
      typeLabels: {
        all: 'شامل (جميع الأنواع)',
        mcq: 'اختيار من متعدد (MCQ)',
        'mcq-photo': 'تحديد القطعة من صورتها',
        'mcq-symbol': 'تحديد القطعة من رمزها',
        'mcq-function': 'تحديد وظيفة القطعة',
        'true-false': 'صح أو خطأ (True / False)',
        'match-images': 'مطابقة الصور مع الأسماء',
        'match-trilingual': 'مطابقة المصطلحات (AR / EN / FR)',
        'mcq-calculation': 'الحسابات الكهربائية',
        'mcq-safety': 'السلامة المهنية',
      },
      startQuizBtn: 'ابدأ الاختبار الآن',
      retrySameBtn: 'إعادة الاختبار (أسئلة عشوائية جديدة)',
      newQuizBtn: 'تغيير إعدادات الاختبار',
      scoreLabel: 'النتيجة:',
      bestLabel: 'أفضل نسبة:',
      attemptsLabel: 'المحاولات:',
      averageLabel: 'المعدل:',
      accuracyLabel: 'الدقة',
      finishedTitle: 'النتيجة النهائية للاختبار',
      finishedExcellent: 'أداء ممتاز ومتفوق! تحكمك في القطع والرموز والحسابات والسلامة عالي جداً.',
      finishedGood: 'أداء جيد جداً! مراجعة سريعة للأخطاء الموضحة ستوصلك إلى الإتقان الكامل.',
      finishedRetry: 'بداية مشجعة! استعن بشرح الإجابات وراجع بطاقات الموسوعة ثم أعد الاختبار.',
      savedNotice: 'تم حفظ نتيجتك تلقائياً في السجل المحلي (IndexedDB / LocalStorage).',
      restartBtn: 'إعادة الاختبار',
      modeSchematic: 'الرمز الكهربائي القياسي',
      modePhysical: 'الصورة الواقعية للقطعة',
      modeFunction: 'وظيفة القطعة ومبدأ عملها',
      modeFormula: 'الحسابات الكهربائية',
      modeSafety: 'السلامة المهنية',
      modeMatchImg: 'مطابقة الصور مع الأسماء',
      modeMatchTri: 'مطابقة المصطلحات باللغات الثلاث',
      modeTrueFalse: 'صح أو خطأ',
      questionPrefix: 'سؤال',
      ofWord: 'من',
      correctTitle: 'إجابة صحيحة!',
      wrongTitle: 'إجابة غير صحيحة',
      nextBtn: 'السؤال التالي',
      finishBtn: 'عرض النتيجة النهائية',
      functionHint: 'حدد القطعة اعتماداً على الوصف الوظيفي',
      trueBtn: 'صحيح (True)',
      falseBtn: 'خطأ (False)',
      checkAnswerBtn: 'تحقق من الإجابة',
      matchPhotoHint: 'اختر صورة من اليمين ثم اضغط على الاسم المطابق لها في القائمة المقابلة:',
      matchPhotoSelectedLabel: 'صورة محددة للربط:',
      matchPairBtn: 'ربط',
      matchTrilingualHint: 'اختر المقابل الإنجليزي والفرنسي الصحيح لكل مصطلح:',
      selectOptionPlaceholder: 'اختر المطابق...',
      colYourAnswer: 'إجابتك',
      colCorrectAnswer: 'الإجابة الصحيحة',
      reviewTitle: 'مراجعة الإجابات التفصيلية والشرح',
      historyTitle: 'سجل النتائج المحفوظة محلياً',
      historySubtitle: 'تحفظ نتائجك تلقائياً في متصفحك بدون الحاجة لتسجيل حساب.',
      historyEmpty: 'لم تكمل أي اختبار بعد. أكمل اختبارك الأول لتوثيق تقدمك هنا.',
      clearHistoryBtn: 'مسح السجل',
      noQuestionsTitle: 'لا توجد أسئلة مطابقة لهذا الفلتر الدقيق',
      noQuestionsSubtitle: 'جرب اختيار «جميع الأنواع» أو «كل التصنيفات» لعرض المزيد من الأسئلة.',
      resetSetupBtn: 'إعادة ضبط الإعدادات',
      availableCountLabel: 'المتاح في البنك:',
    },
    savedDrawer: {
      title: 'قائمة المفضلة والمراجعة',
      subtitle: 'محفوظة محلياً في متصفحك (IndexedDB) بدون تسجيل حساب',
      close: 'إغلاق المفضلة',
      emptyTitle: 'لا توجد قطع في المفضلة بعد',
      emptySubtitle: 'اضغط على أيقونة الحفظ في أي بطاقة لإضافتها إلى المفضلة.',
      totalLabel: 'المجموع:',
      clearAll: 'مسح القائمة',
      openFavoritesPage: 'فتح صفحة المفضلة الكاملة',
    },
    footer: {
      tagline: 'موسوعتك الشاملة في عالم الكهرباء والإلكترونيات',
      freeAccess: 'منصة تعليمية مجانية بالكامل · بدون تسجيل حساب',
    },
    componentPage: {
      backToCatalog: 'العودة إلى الموسوعة',
      breadcrumbHome: 'الرئيسية',
      breadcrumbEncyclopedia: 'الموسوعة',
      trilingualTitle: 'التسميات باللغات الثلاث والأسماء البديلة',
      altNamesLabel: 'أسماء بديلة وشائعة:',
      copyLink: 'نسخ رابط الصفحة',
      linkCopied: 'تم النسخ',
      symbolLabel: 'الرمز القياسي',
      packageLabel: 'التغليف / الهيكل',
      galleryTitle: 'معرض الصور والرسومات التخطيطية',
      tabPhoto: 'صورة واقعية',
      tabPhysical: 'الشكل الهندسي',
      tabSymbol: 'الرمز الكهربائي',
      tabWiring: 'مخطط التوصيل',
      tabAnatomy: 'الأجزاء والبنية',
      definitionTitle: 'التعريف العلمي',
      functionTitle: 'الوظيفة الأساسية',
      workingPrincipleTitle: 'مبدأ العمل',
      electricalSymbolTitle: 'الرمز الكهربائي القياسي',
      anatomyTitle: 'الأجزاء الداخلية والخارجية',
      internalPartsTitle: 'الأجزاء الداخلية',
      externalPartsTitle: 'الأجزاء الخارجية',
      typesTitle: 'الأنواع والتصنيفات الشائعة',
      specsTitle: 'المواصفات التقنية القياسية',
      terminalsTitle: 'أطراف التوصيل (Terminals / Pinout)',
      wiringTitle: 'مخطط التوصيل التعليمي',
      applicationsTitle: 'الاستخدامات العملية',
      faultsTitle: 'الأعطال الشائعة',
      testingTitle: 'طرق الفحص الآمنة',
      safetyTitle: 'احتياطات السلامة المهنية',
      difficultyTitle: 'مستوى الصعوبة',
      relatedTitle: 'القطع ذات الصلة',
      referencesTitle: 'المصادر والمراجع القياسية',
      model3dTitle: 'جاهزية النماذج ثلاثية الأبعاد (3D Architecture)',
      model3dDesc: 'بنية بيانات قياسية مهيأة لدعم استعراض وتدوير النماذج ثلاثية الأبعاد التفاعلية مستقبلاً.',
      model3dStatusReady: 'جاهز للربط',
      model3dStatusPlanned: 'مهيأ هيكلياً (GLB/glTF)',
      model3dFormat: 'الصيغة المدعومة',
      model3dDimensions: 'الأبعاد المرجعية (mm)',
      model3dHotspots: 'نقاط الفحص التفاعلية 3D',
      notFoundTitle: 'لم يتم العثور على صفحة القطعة المطلوبة',
      notFoundSubtitle: 'قد يكون الرابط غير مكتمل. يمكنك العودة لاستعراض جميع قطع الموسوعة.',
    },
    flashcards: {
      eyebrow: 'البطاقات التعليمية والتكرار المتباعد',
      title: 'بطاقات المراجعة التفاعلية',
      subtitle: 'اختبر ذاكرتك في التعرف على القطع من صورها أو رموزها الكهربائية مع حفظ التقدم والمراجعة الذكية.',
      frontModeLabel: 'محتوى الوجه الأول',
      modePhoto: 'صورة القطعة',
      modeSymbol: 'الرمز الكهربائي',
      modeMixed: 'متنوع (صورة / رمز)',
      deckFilterLabel: 'نطاق المراجعة',
      filterAll: 'كل البطاقات',
      filterDue: 'المستحقة الآن',
      filterDifficult: 'البطاقات الصعبة',
      filterSaved: 'المحفوظة',
      categoryLabel: 'التصنيف',
      levelLabel: 'المستوى',
      shuffleBtn: 'خلط عشوائي',
      resetOrderBtn: 'ترتيب قياسي',
      resetProgressBtn: 'تصفير التقدم',
      flipToBack: 'اقلب البطاقة للإجابة',
      flipToFront: 'العودة للوجه الأول',
      prevBtn: 'السابقة',
      nextBtn: 'التالية',
      saveCardBtn: 'حفظ البطاقة',
      savedCardBtn: 'بطاقة محفوظة',
      markDifficultBtn: 'تعليم كصعبة',
      difficultTag: 'تحتاج مراجعة',
      openDetailsBtn: 'فتح صفحة القطعة الكاملة',
      frontHintPhoto: 'اضغط لقلب البطاقة والتحقق من الاسم والوظيفة',
      frontHintSymbol: 'تعرّف على القطعة من رمزها القياسي ثم اقلب البطاقة',
      backNameAr: 'الاسم بالعربية',
      backNameEn: 'الاسم بالإنجليزية',
      backNameFr: 'الاسم بالفرنسية',
      backFunction: 'الوظيفة الأساسية',
      backSummary: 'شرح مختصر',
      srsPrompt: 'قيّم مدى تذكرك لجدولة المراجعة الذكية (Spaced Repetition):',
      rateAgain: 'أعد فوراً',
      rateHard: 'صعبة',
      rateGood: 'جيدة',
      rateEasy: 'سهلة',
      dueNowLabel: 'مستحقة الآن',
      daySuffix: 'يوم',
      daysSuffix: 'أيام',
      statsTotal: 'إجمالي البطاقات',
      statsReviewed: 'تمت مراجعتها',
      statsMastered: 'متقنة',
      statsDifficult: 'صعبة',
      statsSaved: 'محفوظة',
      statsDue: 'مستحقة',
      emptyDeckTitle: 'لا توجد بطاقات مطابقة لهذا الفلتر',
      emptyDeckSubtitle: 'جرب عرض جميع البطاقات أو تغيير التصنيف والمستوى المحدد.',
      showAllBtn: 'عرض كل البطاقات',
      keyboardHint: 'اختصارات لوحة المفاتيح: مسافة للقلب · الأسهم للتنقل',
    },
    calculators: {
      eyebrow: 'المختبر الحسابي الهندسي',
      title: 'الحاسبات الكهربائية التفاعلية',
      subtitle: '18 حاسبة عملية دقيقة مع القوانين وخطوات الحل والرسومات التوضيحية والافتراضات القياسية.',
      searchPlaceholder: 'ابحث عن حاسبة (أوم، كابل، محول، شمسية...)...',
      allGroups: 'جميع الحاسبات (18)',
      groups: {
        fundamentals: 'الأساسيات والطاقة',
        circuits: 'الدوائر والمقاومات',
        installations: 'التمديدات وهبوط الجهد',
        machines: 'المحولات والمحركات والثلاثي الطور',
        solar: 'الطاقة الشمسية والبطاريات',
        tools: 'تحويل الوحدات',
      },
      resetBtn: 'إعادة الضبط',
      formulaTitle: 'القانون المستخدم',
      resultsTitle: 'النتائج المحسوبة',
      stepsTitle: 'خطوات الحساب التفصيلية',
      explanationTitle: 'الشرح المبسط',
      assumptionsTitle: 'الافتراضات والقيود',
      diagramTitle: 'الرسم التوضيحي التفاعلي',
      inputsTitle: 'معطيات الحساب',
      validationTitle: 'تحقق من المدخلات',
      countLabel: 'حاسبة متاحة:',
      items: {
        'ohms-law': { name: 'حاسبة قانون أوم', shortDesc: 'حساب الجهد والتيار والمقاومة والقدرة' },
        'electrical-power': { name: 'حاسبة القدرة الكهربائية', shortDesc: 'القدرة المستمرة والمترددة P و S و Q' },
        'energy-consumption': { name: 'حاسبة استهلاك الطاقة', shortDesc: 'الاستهلاك اليومي والشهري والسنوي بالكيلوواط-ساعة' },
        'electricity-cost': { name: 'حاسبة تكلفة الكهرباء', shortDesc: 'تقدير قيمة الفاتورة حسب التعرفة وساعات التشغيل' },
        'resistor-color': { name: 'حاسبة ألوان المقاومات', shortDesc: 'قراءة المقاومة 4 و 5 حلقات مع التسامح' },
        'series-resistance': { name: 'حاسبة المقاومات على التوالي', shortDesc: 'جمع المقاومات وتيار الدارة المتوالية' },
        'parallel-resistance': { name: 'حاسبة المقاومات على التوازي', shortDesc: 'المقاومة المكافئة والتيار الكلي للتوازي' },
        'capacitor': { name: 'حاسبة المكثفات', shortDesc: 'التوالي/التوازي، المفاعلة Xc، وثابت الزمن RC' },
        'voltage-divider': { name: 'حاسبة مقسم الجهد', shortDesc: 'حساب جهد الخرج ونسبة التقسيم وتيار الدارة' },
        'voltage-drop': { name: 'حاسبة هبوط الجهد', shortDesc: 'فقد الجهد في الكوابل أحادية وثلاثية الطور' },
        'cable-size': { name: 'حاسبة مقطع السلك', shortDesc: 'تقدير مقطع الكابل والقاطع الاسترشادي' },
        'transformer': { name: 'حاسبة المحول الكهربائي', shortDesc: 'نسبة التحويل، عدد اللفات، وتيارات الملفين' },
        'motor-power': { name: 'حاسبة قدرة المحرك', shortDesc: 'العلاقة بين kW و HP وتيار الحمل الكامل والعزم' },
        'three-phase-power': { name: 'حاسبة القدرة ثلاثية الطور', shortDesc: 'الحمل المتوازن وتوصيل النجمة Y والمثلث Δ' },
        'power-factor': { name: 'حاسبة معامل القدرة', shortDesc: 'حساب cos(φ) ومكثفات تحسين معامل القدرة kVAR' },
        'solar-panel': { name: 'حاسبة الألواح الشمسية', shortDesc: 'تقدير قدرة المصفوفة وعدد الألواح المطلوب' },
        'battery-capacity': { name: 'حاسبة سعة البطاريات', shortDesc: 'حساب الأمبير-ساعة Ah مع أيام الاستقلالية و DoD' },
        'unit-converter': { name: 'محول الوحدات الكهربائية', shortDesc: 'التحويل بين SI ومقاطع الأسلاك AWG و mm²' },
      },
    },
    difficulty: {
      beginner: 'مبتدئ',
      intermediate: 'متوسط',
      advanced: 'متقدم',
    },
    symbols: {
      eyebrow: 'مكتبة الرموز القياسية SVG',
      title: 'مكتبة الرموز الكهربائية والإلكترونية',
      subtitle: 'استعرض الرموز القياسية بالرسم الهندسي الدقيق عبر 9 مجالات مع المقارنة بين معياري IEC 60617 و ANSI/IEEE Std 315.',
      searchPlaceholder: 'ابحث باسم الرمز أو الكود (MCB, IEC, NPN...)...',
      allDomains: 'جميع المجالات (9)',
      standardLabel: 'المعيار النشط:',
      iecLabel: 'IEC 60617 (الدولي)',
      ansiLabel: 'ANSI / IEEE Std 315',
      activeStandardNote: 'المعيار المعروض حالياً:',
      functionLabel: 'الوظيفة:',
      trilingualLabel: 'الأسماء باللغات الثلاث:',
      viewComponentBtn: 'القطعة المرتبطة',
      emptyTitle: 'لا توجد رموز مطابقة للبحث',
      emptySubtitle: 'جرّب تغيير المجال أو البحث بكلمة أخرى.',
      resetBtn: 'إعادة ضبط البحث',
      countLabel: 'الرموز المعروضة:',
    },
    wiringLibrary: {
      eyebrow: 'المخططات التنفيذية التعليمية',
      title: 'مكتبة مخططات التوصيل الكهربائية',
      subtitle: 'مخططات واضحة وقابلة للتكبير عبر 8 مجالات عملية مع الشرح الهندسي وقائمة القطع والرموز واحتياطات السلامة.',
      allCategories: 'كل الدوائر',
      zoomIn: 'تكبير',
      zoomOut: 'تصغير',
      resetZoom: 'ضبط 100%',
      zoomLevelLabel: 'التكبير:',
      voltageLabel: 'الجهد المرجعي:',
      standardLabel: 'المرجع التقني:',
      explanationTitle: 'شرح مبدأ العمل والتوصيل',
      componentsTitle: 'القطع المستخدمة في الدائرة',
      symbolsTitle: 'الرموز القياسية في المخطط',
      safetyTitle: 'احتياطات السلامة قبل التجربة',
      viewComponentBtn: 'فتح البطاقة',
    },
    glossary: {
      eyebrow: 'المرجع المصطلحي ثلاثي اللغات',
      title: 'قاموس المصطلحات والاختصارات الكهربائية',
      subtitle: 'تعريفات دقيقة والاختصارات الهندسية الشائعة بالعربية والإنجليزية والفرنسية مع روابط مباشرة للقطع ذات الصلة.',
      searchPlaceholder: 'ابحث عن مصطلح أو اختصار (MCB, LOTO, PWM...)...',
      allLetters: 'الكل',
      relatedTitle: 'القطع المرتبطة:',
      emptyTitle: 'لم يتم العثور على مصطلح مطابق',
      emptySubtitle: 'جرب البحث بحرف أو كلمة مختلفة.',
      resetBtn: 'إظهار كل المصطلحات',
      countLabel: 'عدد المصطلحات:',
    },
    favorites: {
      eyebrow: 'مكتبة الطالب المحلية',
      title: 'المفضلة والقطع المحفوظة',
      subtitle: 'تصفح جميع القطع التي حفظتها للمراجعة مع البحث الفوري والتصفية حسب التصنيف والمستوى.',
      searchPlaceholder: 'ابحث داخل المفضلة...',
      allCategories: 'جميع التصنيفات',
      allLevels: 'كل المستويات',
      photoView: 'الصور الحقيقية',
      physicalView: 'الشكل الهندسي',
      schematicView: 'الرمز التخطيطي',
      removeBtn: 'إزالة',
      clearAllBtn: 'حذف كل المفضلة',
      clearConfirmTitle: 'تأكيد إفراغ المفضلة',
      clearConfirmDesc: 'هل أنت متأكد من إزالة جميع القطع المحفوظة من قائمة المفضلة على هذا الجهاز؟',
      confirmBtn: 'نعم، إفراغ القائمة',
      cancelBtn: 'إلغاء',
      storageNotice: 'تُحفظ المفضلة محلياً في هذا المتصفح فقط عبر IndexedDB و LocalStorage بدون الحاجة لحساب.',
      emptyTitle: 'قائمة المفضلة فارغة حالياً',
      emptySubtitle: 'تصفح موسوعة القطع واضغط على زر الحفظ في أي قطعة لإضافتها هنا ومراجعتها لاحقاً.',
      browseBtn: 'تصفح موسوعة القطع',
      countLabel: 'القطع في المفضلة:',
    },
    progress: {
      eyebrow: 'لوحة متابعة الأداء الفعلي',
      title: 'تقدمي الدراسي وإدارة البيانات',
      subtitle: 'إحصائيات حقيقية 100% محسوبة فقط من القطع التي درستها، الاختبارات التي أكملتها، وبطاقات المراجعة على هذا الجهاز.',
      deviceNoticeTitle: 'تخزين محلي خاص بهذا الجهاز والمتصفح فقط',
      deviceNoticeDesc: 'يعمل الموقع بدون حسابات؛ كل بيانات التقدم والمفضلة والاختبارات محفوظة محلياً عبر IndexedDB و LocalStorage. استخدم خيار التصدير لحفظ نسخة احتياطية أو نقلها لجهاز آخر.',
      kpiStudied: 'القطع المدروسة',
      kpiStudiedSub: 'من أصل {total} قطعة',
      kpiQuizzes: 'الاختبارات المكتملة',
      kpiAvgScore: 'معدل الدرجات:',
      kpiSavedCards: 'البطاقات المحفوظة',
      kpiReviewCards: 'تحتاج مراجعة:',
      kpiFavorites: 'المفضلة:',
      categoryChartTitle: 'التقدم الفعلي حسب التصنيف (7 مجالات)',
      difficultyChartTitle: 'التقدم الفعلي حسب مستوى الصعوبة',
      quizTrendTitle: 'منحنى نتائج الاختبارات الأخيرة',
      quizTrendEmpty: 'لم تكمل أي اختبار بعد. أنجز اختبارك الأول لتظهر نتائجك الحقيقية هنا.',
      logTitle: 'سجل النشاط الدراسي الحقيقي',
      logEmpty: 'لا يوجد نشاط مسجل بعد — افتح أي قطعة أو أنجز اختباراً أو راجع بطاقة لتبدأ التسجيل التلقائي.',
      dataManagementTitle: 'إدارة النسخ الاحتياطي وتصفير البيانات',
      dataManagementDesc: 'صدّر جميع بيانات تعلمك كملف JSON أو استعد نسخة سابقة أو أعد التصفير الكامل.',
      exportBtn: 'تصدير البيانات (JSON)',
      importBtn: 'استيراد البيانات (JSON)',
      importSuccess: 'تم استيراد النسخة الاحتياطية وتحديث بيانات التعلم بنجاح.',
      importError: 'ملف غير صالح: تأكد من اختيار ملف JSON مصدّر من ElectroPedia.',
      resetBtn: 'إعادة ضبط جميع البيانات',
      resetModalTitle: 'تأكيد حذف جميع بيانات التعلم',
      resetModalDesc: 'سيتم حذف المفضلة وسجل الاختبارات وتقدم البطاقات والقطع المدروسة من هذا المتصفح نهائياً. هل تريد المتابعة؟',
      resetConfirmBtn: 'نعم، احذف جميع البيانات',
      resetCancelBtn: 'إلغاء',
      resetSuccess: 'تم مسح جميع بيانات التعلم المحلية وإعادة التقدم إلى الصفر.',
      componentsUnit: 'قطعة',
      masteredLabel: 'متقنة بالبطاقات:',
      openQuizBtn: 'بدء اختبار جديد',
      openFlashcardsBtn: 'فتح البطاقات التعليمية',
    },
    homeHub: {
      eyebrow: 'أدوات التعلم والتدريب (المرحلة الثانية)',
      title: 'بيئة دراسية متكاملة للرموز والمخططات والحسابات',
      subtitle: 'انتقل مباشرة إلى الأدوات التفاعلية المصممة لمساعدة طلاب الكهرباء والإلكترونيات في الدراسة والورشة.',
      symbolsTitle: 'مكتبة الرموز الكهربائية',
      symbolsDesc: '39 رمزاً قياسياً بالرسم المتجهي SVG وفق معياري IEC 60617 و ANSI/IEEE عبر 9 مجالات.',
      wiringTitle: 'مكتبة مخططات التوصيل',
      wiringDesc: 'مخططات عملية قابلة للتكبير لدوائر الإنارة والتحكم والمحركات مع قائمة القطع والسلامة.',
      glossaryTitle: 'قاموس المصطلحات الثلاثي',
      glossaryDesc: 'تعريفات دقيقة واختصارات كهربائية (AC/DC/MCB/RCD/LOTO/VAT) بالعربية والإنجليزية والفرنسية.',
      favoritesTitle: 'المفضلة المحفوظة',
      favoritesDesc: 'وصول سريع إلى جميع القطع التي أضفتها للمراجعة مع بحث وتصفية كاملة.',
      progressTitle: 'تقدمي الدراسي والنسخ الاحتياطي',
      progressDesc: 'تابع إنجازك الحقيقي حسب التصنيف والمستوى مع تصدير واستيراد البيانات محلياً.',
      safetyTitle: 'دليل السلامة والإسعافات الأولية',
      safetyDesc: 'عتبات الصعق، القصر والحمل الزائد، أنظمة التأريض، LOTO، وإسعاف الحوادث الكهربائية.',
      virtualLabTitle: 'المختبر الكهربائي الافتراضي (المرحلة الثالثة)',
      virtualLabDesc: 'محاكي دوائر كهربائية وإلكترونية وتحكم صناعي مع MNA حقيقية وأجهزة قياس وراسم إشارة وPLC.',
    },
    labWorkspace: {
      eyebrow: 'المرحلة الثالثة — ElectroPedia Virtual Lab',
      title: 'مختبر محاكاة الدوائر الكهربائية والإلكترونية والتحكم',
      safetyBanner: 'تنبيه تعليمي: حسابات المختبر تستند إلى نماذج هندسية مبسطة لأغراض التدريب؛ نتائج المحاكاة لا تضمن سلامة الدوائر الحقيقية.',
      paletteTitle: 'مكتبة القطع (34)',
      searchComponents: 'ابحث عن قطعة أو رمز...',
      allCategories: 'الكل',
      canvasHint: 'اسحب قطعة أو انقر عليها لإضافتها. انقر بين الدبابيس لتوصيل سلك. انقر مرتين على المفتاح للتبديل.',
      wiringHint: 'جاري توصيل سلك — اختر الدبوس الثاني أو اضغط Esc للإلغاء',
      cancelWire: 'إلغاء السلك',
      tabProperties: 'الخصائص',
      tabResults: 'النتائج',
      tabInstruments: 'القياسات',
      startSim: 'تشغيل',
      pauseSim: 'إيقاف مؤقت',
      stopSim: 'إيقاف',
      resetSim: 'إعادة ضبط',
      speedLabel: 'السرعة',
      templatesBtn: 'تجارب جاهزة',
      projectsBtn: 'المشاريع',
      ladderBtn: 'PLC Ladder',
      clearBtn: 'مسح الكل',
      undoBtn: 'تراجع',
      redoBtn: 'إعادة',
      copyBtn: 'نسخ',
      pasteBtn: 'لصق',
      rotateBtn: 'تدوير 90°',
      deleteBtn: 'حذف',
      gridBtn: 'الشبكة',
      snapBtn: 'المحاذاة',
      fitBtn: 'ملاءمة',
      exportJsonBtn: 'تصدير JSON',
      importJsonBtn: 'استيراد JSON',
      statusRunning: 'قيد المحاكاة',
      statusPaused: 'متوقف مؤقتاً',
      statusStopped: 'متوقف',
      statusComponents: 'القطع',
      statusWires: 'الأسلاك',
      statusTime: 'الزمن',
      statusSelected: 'المحدد',
      noSelection: 'لم يتم تحديد أي قطعة أو سلك.',
      selectHint: 'انقر على أي عنصر لتعديل قيمه أو فحص جهده وتياره وقدرته الحقيقية.',
      openEncyclopedia: 'فتح في الموسوعة',
      diagnosticsTitle: 'التشخيص والأخطاء الكهربائية',
      noDiagnostics: 'لا توجد أخطاء أو تحذيرات — الدائرة مستقرة.',
      nodeVoltagesTitle: 'جهود العقد والقيم اللحظية',
      scopeTitle: 'راسم الإشارة ثنائي القناة (CH1 / CH2)',
      noScopeHint: 'أضف عنصر Oscilloscope أو مصدراً متردداً/عابراً لمشاهدة الموجة الفعلية.',
      clearConfirmTitle: 'مسح لوحة العمل بالكامل؟',
      clearConfirmDesc: 'سيتم حذف جميع القطع والأسلاك في المشروع الحالي (يمكنك التراجع عبر زر Undo).',
      confirmBtn: 'تأكيد المسح',
      cancelBtn: 'إلغاء',
    },
  },
  en: {
    meta: {
      title: 'ElectroPedia — Your Comprehensive Encyclopedia of Electricity & Electronics',
      description: 'Explore. Learn. Connect. Free visual guide to electrical and electronic components.',
    },
    nav: {
      home: 'Home',
      categories: 'Categories',
      components: 'Components',
      electronics: 'Electronics',
      electricalTools: 'Tools',
      levels: 'Levels',
      safety: 'Safety',
      encyclopedia: 'Encyclopedia',
      popular: 'Popular',
      about: 'About',
      contact: 'Contact',
      lab: 'Lab',
      virtualLab: 'Virtual Lab',
      quiz: 'Quiz',
      flashcards: 'Flashcards',
      calculators: 'Calculators',
      symbols: 'Symbols',
      wiringDiagrams: 'Wiring Diagrams',
      glossary: 'Glossary',
      favorites: 'Favorites',
      progress: 'Progress',
      more: 'More',
      saved: 'Favorites',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      switchThemeLight: 'Switch to light mode',
      switchThemeDark: 'Switch to dark mode',
      languageLabel: 'Select language',
    },
    hero: {
      slogan: 'Explore. Learn. Connect.',
      title: 'Discover the World of Electricity & Electronics',
      description:
        'A visual educational encyclopedia built for students, technicians, and engineers to master real component shapes, schematic symbols, functions, pinouts, and technical ratings — 100% free with no account required.',
      searchPlaceholder: 'Search component name or symbol...',
      searchLabel: 'Search electrical or electronic components',
      exploreBtn: 'Explore Encyclopedia',
      startLearningBtn: 'Start Learning',
      quickSearchLabel: 'Quick search:',
      caption: 'Visual Component Identification · Physical Shapes & Schematic Symbols',
      freeBadgeNote: '100% Free Access · No Sign-up Required',
    },
    categoriesSection: {
      eyebrow: 'Main Categories',
      title: 'Core Domains of Electricity & Electronics',
      subtitle: 'Choose any engineering domain to browse its components, physical profiles, and specifications.',
      browseAction: 'Browse Category',
    },
    popularSection: {
      eyebrow: 'Popular Components',
      title: 'Essential Parts Found in Every Circuit',
      subtitle: 'Start with the most frequently used components in laboratories and industrial panels.',
      inspectBtn: 'View Specs',
    },
    levelsSection: {
      eyebrow: 'Learning Levels',
      title: 'Structured Paths for Every Academic & Technical Level',
      subtitle: 'From beginners and vocational tracks (BP/BT, TS/LT) to university engineering and field technicians.',
      exploreTrack: 'Filter by Level',
      items: [
        {
          id: 'beginners',
          code: '01 · Foundation',
          title: 'Beginners',
          audience: 'Hobbyists & First-Time Learners',
          focus: 'Recognizing resistors, capacitors, diodes, LEDs, and safe breadboard prototyping.',
          filterDifficulty: 'beginner',
        },
        {
          id: 'bp_bt',
          code: '02 · Vocational & Technical',
          title: 'BP & BT Students',
          audience: 'Brevet Professionnel & Baccalauréat Technique',
          focus: 'Protective fuses, relays, step-down transformers, MCB breakers, and basic wiring diagrams.',
          filterDifficulty: 'beginner',
        },
        {
          id: 'ts_lt',
          code: '03 · Higher Technician',
          title: 'TS & LT Students',
          audience: 'Technicien Supérieur & Licence Technique',
          focus: 'Semiconductor analysis, 555 timers, Op-Amps, and industrial AC contactors.',
          filterDifficulty: 'intermediate',
        },
        {
          id: 'engineering',
          code: '04 · University Track',
          title: 'Engineering Students',
          audience: 'Electrical & Electronics Engineering',
          focus: 'Power switching with MOSFETs, microcontroller interfacing, RC timing, and frequency response.',
          filterDifficulty: 'intermediate',
        },
        {
          id: 'professionals',
          code: '05 · Field Reference',
          title: 'Electricians & Technicians',
          audience: 'Maintenance Engineers & Field Specialists',
          focus: 'Rapid lookup for pinouts, breaking capacities, optoisolation, and workplace electrical safety.',
          filterDifficulty: 'all',
        },
      ],
    },
    featuresSection: {
      eyebrow: 'Platform Features',
      title: 'Practical Learning Tools Built for Clarity',
      subtitle: 'Everything needed for visual recognition, study revision, and circuit calculation without sign-up walls.',
      items: [
        {
          title: 'Physical Shape & Symbol Pairing',
          description: 'Inspect real-world component geometry side-by-side with standardized IEC/IEEE schematic symbols.',
        },
        {
          title: 'Full AR / EN / FR Localization',
          description: 'Switch seamlessly between Arabic (RTL), English, and French technical terminology anytime.',
        },
        {
          title: 'Smart Trilingual & Typo-Tolerant Search',
          description: 'Search across AR/EN/FR names, aliases, and symbols with live image suggestions and multi-criteria sorting.',
        },
        {
          title: 'Offline-Ready Local Persistence',
          description: 'Study bookmarks and quiz progress persist automatically via IndexedDB and LocalStorage.',
        },
      ],
    },
    safetySection: {
      eyebrow: 'Occupational Safety',
      title: 'Electrical Safety Rules Before Touching Any Circuit',
      subtitle: 'Professional engineering starts with safety: follow these essential lab and field protocols.',
      rules: [
        {
          level: 'danger',
          levelLabel: 'CRITICAL · SHOCK HAZARD',
          title: 'Isolate & Verify Dead Before Working',
          description: 'Never assume a circuit is off; verify zero voltage with a rated multimeter and apply Lockout/Tagout (LOTO).',
        },
        {
          level: 'danger',
          levelLabel: 'DANGER · STORED CHARGE',
          title: 'Discharge Large Capacitors Safely',
          description: 'Power-supply electrolytic capacitors retain hazardous voltage after power-off; discharge via a bleed resistor.',
        },
        {
          level: 'warning',
          levelLabel: 'WARNING · THERMAL LOAD',
          title: 'Verify Wattage & Current Ratings',
          description: 'Undersized resistors, conductors, or breakers overheat rapidly and create fire hazards under load.',
        },
        {
          level: 'warning',
          levelLabel: 'PPE · INSULATION',
          title: 'Wear Rated Personal Protective Equipment',
          description: 'Use insulated gloves, dielectric footwear, and voltage-rated hand tools when servicing live panels.',
        },
        {
          level: 'success',
          levelLabel: 'SAFE PRACTICE',
          title: 'Verify Polarity & Pinout Orientation',
          description: 'Double-check anode/cathode markings, IC notches, and regulator pinouts prior to energizing.',
        },
        {
          level: 'success',
          levelLabel: 'CIRCUIT PROTECTION',
          title: 'Always Include Fuses & RCD/MCB Protection',
          description: 'Protect both circuits and operators with properly sized fuses and residual-current circuit breakers.',
        },
      ],
    },
    encyclopedia: {
      eyebrow: 'Full Encyclopedia',
      title: 'Electrical & Electronic Components Catalog',
      subtitle: 'Browse real component photos and schematic symbols, use smart search, and filter by category or level.',
      photoView: 'Real Photos',
      physicalView: 'Geometry',
      schematicView: 'Symbol',
      searchPlaceholder: 'Search by name, alias, function, or symbol...',
      levelFilterLabel: 'Level:',
      sortLabel: 'Sort:',
      sortRelevance: 'Relevance',
      sortNameAsc: 'Name (A–Z)',
      sortNameDesc: 'Name (Z–A)',
      sortDiffAsc: 'Level (Beginner → Advanced)',
      sortDiffDesc: 'Level (Advanced → Beginner)',
      suggestionsTitle: 'Smart Search Suggestions',
      fuzzyHint: 'Close match',
      viewAllResults: 'View all matching results',
      allLevels: 'All Levels',
      allCategories: 'All',
      showingCount: 'Showing {shown} of {total}',
      emptyTitle: 'No matching components found',
      emptySubtitle: 'Try a simpler search query or reset filters to browse the entire encyclopedia.',
      resetFilters: 'Reset Filters',
      detailsBtn: 'Details & Specs',
      saveTooltip: 'Save to study list',
      removeTooltip: 'Remove from study list',
    },
    states: {
      loadingTitle: 'Loading educational catalog...',
      loadingSubtitle: 'Preparing technical sheets and component imagery.',
      errorTitle: 'Something went wrong while rendering this view',
      errorSubtitle: 'Please retry or return to the homepage to continue exploring.',
      retryBtn: 'Try Again',
      homeBtn: 'Back to Home',
    },
    pages: {
      categories: {
        eyebrow: 'Encyclopedia Domains',
        title: 'All 7 Electrical & Electronics Categories',
        subtitle: 'Explore each engineering domain and jump straight into its standardized components.',
        allDomainsBtn: 'Show All Categories',
        selectedCategoryPrefix: 'Domain:',
        openInComponents: 'Open in Full Catalog',
      },
      electronics: {
        eyebrow: 'Electronics Domain',
        title: 'Electronic Components & Semiconductors',
        subtitle: 'From passive resistors, capacitors, and inductors to MOSFETs, thyristors, ICs, microcontrollers, and PCBs.',
        passiveHeading: 'Passive Elements',
        passiveDesc: 'Resistors, capacitors, and inductors for current limiting, energy storage, and filtering.',
        activeHeading: 'Semiconductors & Power Switching',
        activeDesc: 'Diodes, LEDs, BJT transistors, MOSFETs, and thyristors/TRIACs.',
        digitalHeading: 'Integrated Circuits & Embedded',
        digitalDesc: 'Voltage regulators, logic gates, microcontrollers, and printed circuit boards.',
      },
      electricalTools: {
        eyebrow: 'Electrical Tools Domain',
        title: 'Test Instruments, Insulated Hand Tools & PPE',
        subtitle: 'Explore CAT-rated meters, IEC 60900 1000V insulated tools, workshop equipment, and arc/shock PPE.',
        measurementHeading: 'Measurement & Diagnostics',
        measurementDesc: 'Digital multimeters, clamp meters, two-pole voltage testers, oscilloscopes, and insulation testers.',
        insulatedHeading: 'VDE Hand Tools & Assembly',
        insulatedDesc: '1000V insulated screwdrivers, wire strippers, pliers, crimping tools, drills, and soldering stations.',
        ppeHeading: 'Personal Protective Equipment',
        ppeDesc: 'Class 00/0 dielectric gloves, insulated helmets, and face shields for safe field work.',
      },
      safety: {
        eyebrow: 'Occupational Safety',
        title: 'Electrical Safety Standards & Field Protocols',
        subtitle: 'Lockout/Tagout (LOTO) steps, IEC 61010 CAT measurement categories, and personal protective equipment.',
        catTitle: 'Measurement Category Safety Ratings (IEC 61010)',
        catRows: [
          { cat: 'CAT II', scope: 'Single-phase plug-in receptacles and portable appliances', examples: '230V wall outlets and benchtop equipment' },
          { cat: 'CAT III', scope: 'Building distribution boards, feeders, lighting circuits, and 3-phase motors', examples: 'Main/sub-distribution panels and fixed machinery' },
          { cat: 'CAT IV', scope: 'Utility service entrance, main meters, and underground/overhead feeders', examples: 'Primary supply cables and utility transformers' },
        ],
        lotoTitle: '5 Essential Steps for Dead Working (LOTO & VAT)',
        lotoSteps: [
          '1. Completely disconnect the circuit from all power sources at the isolator/breaker.',
          '2. Secure the isolating device with a personal Lockout padlock and warning Tag.',
          '3. Verify absence of voltage (VAT) with a two-pole tester before and after checking a known live source.',
          '4. Safely discharge power capacitors and apply temporary earthing/short-circuiting where required.',
          '5. Wear Class 0 dielectric gloves and use IEC 60900 1000V insulated tools.',
        ],
        hazardsTitle: 'Electrical Hazards & Current Effects (IEC 60479-1 AC 50/60Hz)',
        shockThresholdsTitle: 'Direct Contact (live conductor) vs. Indirect Contact (energized metal chassis)',
        shockThresholds: [
          { ma: '1–5 mA', effect: 'Threshold of perception; mild tingling, able to let go safely.', severity: 'safe' },
          { ma: '10–15 mA', effect: 'Let-Go Threshold: involuntary muscle contraction prevents releasing grip.', severity: 'warning' },
          { ma: '30 mA', effect: 'RCD / GFCI life-protection trip threshold before respiratory paralysis.', severity: 'warning' },
          { ma: '50–100+ mA', effect: 'Ventricular fibrillation and rapid risk of fatal cardiac arrest.', severity: 'danger' },
        ],
        faultComparisonTitle: 'Short Circuit vs. Electrical Overload',
        shortCircuitVsOverload: [
          {
            title: 'Short Circuit',
            points: [
              'Low-impedance fault between Phase & Neutral or between two Phases.',
              'Massive instantaneous current surge causing intense arc flash and fire risk.',
              'Cleared within milliseconds by the magnetic trip coil of an MCB or fast fuse.',
            ],
          },
          {
            title: 'Overload',
            points: [
              'Sustained load current exceeding cable or motor ampacity rating.',
              'Gradual conductor heating that degrades insulation and burns windings.',
              'Cleared by bimetallic thermal elements inside an MCB or thermal overload relay.',
            ],
          },
        ],
        earthingTitle: 'Earthing & Grounding Systems (TT / TN / IT)',
        earthingSystems: [
          { code: 'TT System', desc: 'Transformer neutral and installation frames earthed independently; requires 30 mA RCD protection.' },
          { code: 'TN-S / TN-C-S', desc: 'Metallic enclosures bonded via PE directly back to source star point so faults become fast short-circuits.' },
          { code: 'IT System', desc: 'Isolated neutral; continues running on first earth fault (hospitals/critical plants) with insulation monitoring.' },
        ],
        toolsPpeTitle: 'IEC 60900 1000V Insulated Tools & Personal Protective Equipment (PPE)',
        toolsPpePoints: [
          'Dual-layer 1000V AC VDE tools with finger guards preventing slips onto live metal shafts.',
          'Class 00 (500V) or Class 0 (1000V) dielectric gloves air-tested before every shift.',
          'Class E insulated helmet, arc-rated face shield, and Electrical Hazard (EH) dielectric boots.',
        ],
        workshopTitle: 'Lab & Workshop Safety Rules',
        workshopRules: [
          'Keep floors and workbenches completely dry; moisture drops skin resistance dramatically.',
          'Remove rings, metal watch straps, and necklaces before approaching open panels.',
          'Apply the one-hand rule during live voltage measurements to avoid chest current paths.',
          'Inspect test probes and insulation jackets for cuts or exposed copper before use.',
        ],
        firstAidTitle: 'Electrical Accident First Aid Protocol (ERC / OSHA)',
        firstAidWarning: 'NEVER touch an electrocuted victim with bare hands while they remain connected to a live source!',
        firstAidSteps: [
          '1. Cut power immediately at the main breaker or unplug; on low voltage only, separate the wire with a dry non-conductive object (dry wood/plastic).',
          '2. Call Emergency Services immediately specifying location and voltage level (for high-voltage lines, stay clear and call the utility).',
          '3. Once the area is verified electrically safe, check responsiveness and normal breathing.',
          '4. If not breathing normally, begin CPR immediately and apply an AED if available.',
          '5. Cool electrical burns with clean running water without applying ointments or pulling stuck clothing, and monitor until paramedics arrive.',
        ],
      },
      about: {
        eyebrow: 'About ElectroPedia & Creator',
        title: 'A Vocational Student’s Initiative for Electrical & Electronics Learners',
        subtitle: 'Built free without accounts to connect Arabic, English, and French technical terminology.',
        creatorCardTitle: 'About the Creator',
        creatorRoleBadge: 'Vocational & Technical Student · BT2',
        creatorSchool: 'Jabal Mohsen Technical Institute',
        creatorMajor: 'Residential Electricity — 2nd Year (BT2)',
        creatorParagraphs: [
          'I am a vocational and technical education student studying Residential Electricity in my second year (BT2) at Jabal Mohsen Technical Institute.',
          'I created the ElectroPedia concept to help students recognize electrical and electronic components and understand their functions and terminology across Arabic, English, and French.',
          'My goal is to sharpen my skills, gain hands-on practical experience, and establish my own electrical business in the future.',
        ],
        missionTitle: 'Core Pillars',
        missionItems: [
          { title: '100% Free & Open Access', desc: 'No sign-up walls or fees so students can revise anytime in workshops or classrooms.' },
          { title: 'Trilingual Technical Bridge', desc: 'Connects workshop terms with international IEC/IEEE standards in AR, EN, and FR.' },
          { title: 'Safety-First Engineering', desc: 'Every component sheet highlights common faults, safe testing procedures, and PPE precautions.' },
        ],
        ctaBrowse: 'Explore Encyclopedia',
        ctaContact: 'Contact Creator',
      },
      contact: {
        eyebrow: 'Contact Us',
        title: 'Feedback, Suggestions & Academic Collaboration',
        subtitle: 'Share component requests, technical corrections, or learning feedback to help grow ElectroPedia.',
        directTitle: 'Direct Contact Details',
        directDesc: 'Reach out directly via email or prepare your message using the form below.',
        emailLabel: 'Email Address',
        copyEmail: 'Copy Email',
        emailCopied: 'Copied',
        instituteLabel: 'Institute & Track',
        instituteValue: 'Jabal Mohsen Technical Institute · Residential Electricity (BT2)',
        formTitle: 'Send Feedback or Suggest a Component',
        formDesc: 'Saves a local draft in your browser and prepares a direct mailto message.',
        nameLabel: 'Full Name',
        namePlaceholder: 'e.g. Youssef Dib',
        emailFieldLabel: 'Your Email',
        emailFieldPlaceholder: 'name@example.com',
        subjectLabel: 'Subject',
        subjectPlaceholder: 'Component request or educational note',
        messageLabel: 'Message',
        messagePlaceholder: 'Write your message or suggest a component to document...',
        sendBtn: 'Save & Prepare Message',
        openMailBtn: 'Send via Email App',
        successTitle: 'Message saved and ready to send',
        successDesc: 'Click the Email App button below to deliver your message directly.',
        validationError: 'Please enter your name, a valid email address, and a message.',
        recentTitle: 'Saved Inquiries',
        clearMessages: 'Clear History',
      },
    },
    modal: {
      close: 'Close',
      saveBtn: 'Save for Study',
      savedBtn: 'Saved',
      physicalShape: 'Physical Shape',
      physicalCaption: 'Real-world component package appearance',
      schematicSymbol: 'Schematic Symbol',
      schematicCaption: 'Standard symbol used in circuit diagrams',
      coreFunction: 'Core Function',
      howItWorks: 'How It Works',
      pinoutTitle: 'Pinout & Terminals',
      pinCol: 'Pin',
      nameCol: 'Name',
      roleCol: 'Role',
      specsTitle: 'Standard Electrical Specifications',
      paramCol: 'Parameter',
      valueCol: 'Value & Unit',
      applicationsTitle: 'Common Practical Applications',
      safetyTitle: 'Engineering Tips & Warnings',
      relatedTitle: 'Related Components',
    },
    lab: {
      eyebrow: 'Interactive Lab',
      title: 'Engineering Calculators & Simulators',
      subtitle: 'Decode resistor color bands, compute Ohm’s Law and LED series resistors, and inspect RC charge curves.',
      tabResistor: 'Resistor Colors',
      tabOhmLed: "Ohm's Law & LED",
      tabRc: 'RC Time Constant',
      computedValue: 'Calculated Value',
      rangeLabel: 'Range:',
      band1: '1st Band (1st Digit)',
      band2: '2nd Band (2nd Digit)',
      multiplier: '3rd Band (Multiplier)',
      tolerance: '4th Band (Tolerance)',
      ohmTitle: "Ohm's Law & Power Calculator",
      voltageLabel: 'Voltage (V)',
      resistanceLabel: 'Resistance (Ω)',
      currentOut: 'Current (I)',
      powerOut: 'Power Dissipated (P)',
      powerWarning: 'Warning: Exceeds 250mW — use a 0.5W or 1W rated resistor.',
      powerSafe: 'Safe for a standard 0.25W (quarter-watt) resistor.',
      ledTitle: 'LED Series Resistor Calculator',
      supplyV: 'Supply (Vs)',
      ledVf: 'LED Drop (Vf)',
      ledIf: 'Current (mA)',
      ledExact: 'Exact Calculated Value:',
      ledE12: 'Nearest Standard E12 Value:',
      ledPower: 'Resistor Power Dissipation:',
      ledColors: { red: 'Red/Yellow (2.0V)', green: 'Green (2.2V)', blue: 'Blue/White (3.2V)' },
      rcTitle: 'RC Time Constant & Charge Curve',
      capLabel: 'Capacitance (C)',
      tauLabel: 'Time Constant τ',
      fullChargeLabel: 'Full Charge 5τ',
      cutoffLabel: 'Cutoff Freq fc',
      rcCurveTitle: 'Exponential Capacitor Charge Curve (0 to 5τ)',
    },
    quiz: {
      eyebrow: 'Interactive Educational Quizzes',
      title: 'Test Your Electrical & Electronics Knowledge',
      subtitle: 'Randomized practice tests covering component photos, symbols, functions, trilingual matching, electrical math, and safety.',
      openFullQuiz: 'Open Full Quiz System',
      setupTitle: 'Configure Your Custom Quiz',
      categoryLabel: 'Category',
      difficultyLabel: 'Difficulty Level',
      questionCountLabel: 'Number of Questions',
      questionTypeLabel: 'Question Format',
      typeLabels: {
        all: 'Mixed (All Question Types)',
        mcq: 'Multiple Choice (MCQ)',
        'mcq-photo': 'Identify Component from Photo',
        'mcq-symbol': 'Identify Component from Symbol',
        'mcq-function': 'Identify Component Function',
        'true-false': 'True or False',
        'match-images': 'Match Photos with Names',
        'match-trilingual': 'Match Terms (AR / EN / FR)',
        'mcq-calculation': 'Electrical Calculations',
        'mcq-safety': 'Occupational Safety',
      },
      startQuizBtn: 'Start Quiz',
      retrySameBtn: 'Retake Quiz (New Shuffle)',
      newQuizBtn: 'Change Quiz Settings',
      scoreLabel: 'Score:',
      bestLabel: 'Best Score:',
      attemptsLabel: 'Attempts:',
      averageLabel: 'Average:',
      accuracyLabel: 'Accuracy',
      finishedTitle: 'Final Quiz Results',
      finishedExcellent: 'Outstanding mastery across component identification, math, and electrical safety!',
      finishedGood: 'Well done! Review any missed explanations below to reach 100% precision.',
      finishedRetry: 'Great start! Study the answer explanations and catalog sheets, then try another round.',
      savedNotice: 'Your score has been saved locally in your browser (IndexedDB / LocalStorage).',
      restartBtn: 'Restart Quiz',
      modeSchematic: 'Standard Schematic Symbol',
      modePhysical: 'Real Component Photo',
      modeFunction: 'Component Function',
      modeFormula: 'Electrical Calculation',
      modeSafety: 'Occupational Safety',
      modeMatchImg: 'Photo-to-Name Matching',
      modeMatchTri: 'Trilingual Term Matching',
      modeTrueFalse: 'True or False',
      questionPrefix: 'Question',
      ofWord: 'of',
      correctTitle: 'Correct Answer!',
      wrongTitle: 'Incorrect Answer',
      nextBtn: 'Next Question',
      finishBtn: 'View Final Results',
      functionHint: 'Identify the component from its functional description',
      trueBtn: 'True',
      falseBtn: 'False',
      checkAnswerBtn: 'Check Answer',
      matchPhotoHint: 'Select a photo card, then click the matching component name:',
      matchPhotoSelectedLabel: 'Selected photo to pair:',
      matchPairBtn: 'Pair',
      matchTrilingualHint: 'Match each electrical term with its exact equivalents in the other two languages:',
      selectOptionPlaceholder: 'Select match...',
      colYourAnswer: 'Your Answer',
      colCorrectAnswer: 'Correct Answer',
      reviewTitle: 'Answer Review & Detailed Explanations',
      historyTitle: 'Saved Quiz Results History',
      historySubtitle: 'Automatically saved locally in your browser with no account needed.',
      historyEmpty: 'No completed quizzes yet. Finish your first quiz to track your progress here.',
      clearHistoryBtn: 'Clear History',
      noQuestionsTitle: 'No questions match this narrow filter combination',
      noQuestionsSubtitle: 'Try selecting "Mixed (All Question Types)" or "All Categories" to expand the question pool.',
      resetSetupBtn: 'Reset Settings',
      availableCountLabel: 'Available in bank:',
    },
    savedDrawer: {
      title: 'Favorites & Study List',
      subtitle: 'Stored locally in your browser (IndexedDB) — no login required',
      close: 'Close favorites',
      emptyTitle: 'No favorite components yet',
      emptySubtitle: 'Click the bookmark icon on any component card to add it to your favorites.',
      totalLabel: 'Total:',
      clearAll: 'Clear All',
      openFavoritesPage: 'Open Full Favorites Page',
    },
    footer: {
      tagline: 'Your Comprehensive Encyclopedia of Electricity & Electronics',
      freeAccess: '100% Free Educational Platform · No Account Required',
    },
    componentPage: {
      backToCatalog: 'Back to Encyclopedia',
      breadcrumbHome: 'Home',
      breadcrumbEncyclopedia: 'Encyclopedia',
      trilingualTitle: 'Trilingual Nomenclature & Alternative Names',
      altNamesLabel: 'Alternative & field names:',
      copyLink: 'Copy Page Link',
      linkCopied: 'Copied',
      galleryTitle: 'Visual Gallery & Engineering Diagrams',
      tabPhoto: 'Studio Photo',
      tabPhysical: 'Physical View',
      tabSymbol: 'Electrical Symbol',
      tabWiring: 'Wiring Diagram',
      tabAnatomy: 'Internal / External',
      definitionTitle: 'Definition',
      functionTitle: 'Core Function',
      workingPrincipleTitle: 'Working Principle',
      electricalSymbolTitle: 'Standard Electrical Symbol',
      anatomyTitle: 'Internal & External Parts',
      internalPartsTitle: 'Internal Parts',
      externalPartsTitle: 'External Parts',
      typesTitle: 'Common Types & Variants',
      specsTitle: 'Technical Specifications',
      terminalsTitle: 'Connection Terminals & Pinout',
      wiringTitle: 'Educational Wiring Diagram',
      applicationsTitle: 'Practical Applications',
      faultsTitle: 'Common Faults',
      testingTitle: 'Safe Testing Methods',
      safetyTitle: 'Safety Precautions',
      difficultyTitle: 'Difficulty Level',
      relatedTitle: 'Related Components',
      referencesTitle: 'Authoritative Sources & References',
      model3dTitle: 'Future 3D Model Data Architecture',
      model3dDesc: 'Structured spatial schema prepared for interactive GLB/glTF 3D viewer integration.',
      model3dStatusReady: 'Model Ready',
      model3dStatusPlanned: 'Schema Ready (GLB/glTF)',
      model3dFormat: 'Target Format',
      model3dDimensions: 'Reference Bounding Box (mm)',
      model3dHotspots: 'Planned 3D Interactive Hotspots',
      notFoundTitle: 'Component page not found',
      notFoundSubtitle: 'The requested component route does not exist. Return to browse the full encyclopedia.',
      symbolLabel: 'Symbol Code',
      packageLabel: 'Package / Frame',
    },
    flashcards: {
      eyebrow: 'Spaced Repetition Study Deck',
      title: 'Interactive Component Flashcards',
      subtitle: 'Master visual recognition and electrical symbols across 3 languages with smart Spaced Repetition tracking.',
      frontModeLabel: 'Front Face Mode',
      modePhoto: 'Component Photo',
      modeSymbol: 'Electrical Symbol',
      modeMixed: 'Mixed (Photo / Symbol)',
      deckFilterLabel: 'Study Filter',
      filterAll: 'All Cards',
      filterDue: 'Due Now',
      filterDifficult: 'Difficult Cards',
      filterSaved: 'Saved Cards',
      categoryLabel: 'Category',
      levelLabel: 'Level',
      shuffleBtn: 'Shuffle',
      resetOrderBtn: 'Default Order',
      resetProgressBtn: 'Reset Progress',
      flipToBack: 'Flip Card',
      flipToFront: 'Show Front',
      prevBtn: 'Previous',
      nextBtn: 'Next',
      saveCardBtn: 'Save Card',
      savedCardBtn: 'Saved',
      markDifficultBtn: 'Mark Difficult',
      difficultTag: 'Needs Review',
      openDetailsBtn: 'Open Full Component Page',
      frontHintPhoto: 'Click card to reveal trilingual names & function',
      frontHintSymbol: 'Identify this standard symbol, then flip to verify',
      backNameAr: 'Arabic Name',
      backNameEn: 'English Name',
      backNameFr: 'French Name',
      backFunction: 'Core Function',
      backSummary: 'Brief Explanation',
      srsPrompt: 'Rate your recall to schedule the next Spaced Repetition interval:',
      rateAgain: 'Again',
      rateHard: 'Hard',
      rateGood: 'Good',
      rateEasy: 'Easy',
      dueNowLabel: '< 10 min',
      daySuffix: 'day',
      daysSuffix: 'days',
      statsTotal: 'Total Cards',
      statsReviewed: 'Reviewed',
      statsMastered: 'Mastered',
      statsDifficult: 'Difficult',
      statsSaved: 'Saved',
      statsDue: 'Due',
      emptyDeckTitle: 'No flashcards match this filter',
      emptyDeckSubtitle: 'Switch to All Cards or adjust the selected category and level.',
      showAllBtn: 'Show All Cards',
      keyboardHint: 'Shortcuts: Space to flip · Left/Right arrows to navigate',
    },
    calculators: {
      eyebrow: 'Electrical Engineering Bench',
      title: 'Interactive Electrical Calculators',
      subtitle: '18 verified calculators with formulas, live step-by-step math, diagrams, assumptions, and input validation.',
      searchPlaceholder: 'Search calculators (Ohm, Cable, Solar, Motor...)...',
      allGroups: 'All Calculators (18)',
      groups: {
        fundamentals: 'Fundamentals & Energy',
        circuits: 'Circuits & Components',
        installations: 'Wiring & Voltage Drop',
        machines: 'Transformers, Motors & 3-Phase',
        solar: 'Solar PV & Batteries',
        tools: 'Unit Converter',
      },
      resetBtn: 'Reset',
      formulaTitle: 'Formula Used',
      resultsTitle: 'Computed Result',
      stepsTitle: 'Calculation Steps',
      explanationTitle: 'Simplified Explanation',
      assumptionsTitle: 'Assumptions & Limitations',
      diagramTitle: 'Illustrative Diagram',
      inputsTitle: 'Input Parameters',
      validationTitle: 'Input Validation',
      countLabel: 'Calculators available:',
      items: {
        'ohms-law': { name: "Ohm's Law Calculator", shortDesc: 'Solve Voltage, Current, Resistance & Power' },
        'electrical-power': { name: 'Electrical Power Calculator', shortDesc: 'DC & AC Active (P), Apparent (S), Reactive (Q)' },
        'energy-consumption': { name: 'Energy Consumption Calculator', shortDesc: 'Daily, periodic, and annual kWh usage' },
        'electricity-cost': { name: 'Electricity Cost Calculator', shortDesc: 'Estimate daily, monthly & yearly billing' },
        'resistor-color': { name: 'Resistor Color Code Calculator', shortDesc: '4-band & 5-band color decoder + range' },
        'series-resistance': { name: 'Series Resistance Calculator', shortDesc: 'Total resistance, current & drops in series' },
        'parallel-resistance': { name: 'Parallel Resistance Calculator', shortDesc: 'Equivalent resistance & total branch current' },
        'capacitor': { name: 'Capacitor Calculator', shortDesc: 'Series/Parallel, Reactance Xc & RC constant τ' },
        'voltage-divider': { name: 'Voltage Divider Calculator', shortDesc: 'Output voltage, ratio & resistor dissipation' },
        'voltage-drop': { name: 'Voltage Drop Calculator', shortDesc: '1-phase & 3-phase cable drop & IEC limits' },
        'cable-size': { name: 'Cable Size Calculator', shortDesc: 'Educational cable cross-section & breaker check' },
        'transformer': { name: 'Transformer Calculator', shortDesc: 'Turns ratio, primary/secondary turns & currents' },
        'motor-power': { name: 'Motor Power Calculator', shortDesc: 'kW, HP, full-load current & shaft torque' },
        'three-phase-power': { name: 'Three Phase Power Calculator', shortDesc: 'Balanced Star (Y) & Delta (Δ) P, S, Q values' },
        'power-factor': { name: 'Power Factor Calculator', shortDesc: 'cos(φ) & capacitor bank correction kVAR / µF' },
        'solar-panel': { name: 'Solar Panel Calculator', shortDesc: 'Required PV array Wp & panel quantity' },
        'battery-capacity': { name: 'Battery Capacity Calculator', shortDesc: 'Ah capacity with autonomy days & DoD%' },
        'unit-converter': { name: 'Unit Converter', shortDesc: 'SI electrical prefixes, HP & AWG ↔ mm²' },
      },
    },
    difficulty: {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
    },
    symbols: {
      eyebrow: 'Vector Symbol Reference (SVG)',
      title: 'Electrical & Electronic Symbols Library',
      subtitle: 'Inspect crisp SVG schematic symbols across 9 engineering domains comparing IEC 60617 and ANSI/IEEE Std 315 standards.',
      searchPlaceholder: 'Search symbol name or standard code (MCB, IEC, NPN...)...',
      allDomains: 'All Domains (9)',
      standardLabel: 'Active Standard:',
      iecLabel: 'IEC 60617 (International)',
      ansiLabel: 'ANSI / IEEE Std 315',
      activeStandardNote: 'Currently displaying:',
      functionLabel: 'Function:',
      trilingualLabel: 'Trilingual Terms:',
      viewComponentBtn: 'Linked Component',
      emptyTitle: 'No symbols match your filter',
      emptySubtitle: 'Try selecting a different domain or clearing your search.',
      resetBtn: 'Reset Filter',
      countLabel: 'Symbols shown:',
    },
    wiringLibrary: {
      eyebrow: 'Interactive Circuit Schematics',
      title: 'Wiring Diagrams Library',
      subtitle: 'Technically reviewed, zoomable SVG wiring diagrams across 8 categories with component lists, symbol legends, and safety checks.',
      allCategories: 'All Circuits',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      resetZoom: 'Reset 100%',
      zoomLevelLabel: 'Zoom:',
      voltageLabel: 'Rated Voltage:',
      standardLabel: 'Standard Ref:',
      explanationTitle: 'Circuit Operation & Wiring Notes',
      componentsTitle: 'Components Used',
      symbolsTitle: 'Schematic Symbols Used',
      safetyTitle: 'Safety Precautions',
      viewComponentBtn: 'View Component',
    },
    glossary: {
      eyebrow: 'Trilingual Technical Glossary',
      title: 'Electrical & Electronics Terms & Abbreviations',
      subtitle: 'Clear definitions and industry abbreviations in Arabic, English, and French with direct links to related components.',
      searchPlaceholder: 'Search term or abbreviation (MCB, LOTO, PWM...)...',
      allLetters: 'All',
      relatedTitle: 'Related Components:',
      emptyTitle: 'No glossary terms matched your search',
      emptySubtitle: 'Try another keyword or reset the letter filter.',
      resetBtn: 'Show All Terms',
      countLabel: 'Terms count:',
    },
    favorites: {
      eyebrow: 'Personal Local Study Library',
      title: 'Saved Favorites',
      subtitle: 'Review all bookmarked components stored on this device with search, category, and difficulty filtering.',
      searchPlaceholder: 'Search inside favorites...',
      allCategories: 'All Categories',
      allLevels: 'All Levels',
      photoView: 'Real Photos',
      physicalView: 'Geometry',
      schematicView: 'Symbol',
      removeBtn: 'Remove',
      clearAllBtn: 'Clear All Favorites',
      clearConfirmTitle: 'Confirm Clear Favorites',
      clearConfirmDesc: 'Remove every saved component from your local favorites list on this device?',
      confirmBtn: 'Yes, Clear Favorites',
      cancelBtn: 'Cancel',
      storageNotice: 'Favorites are saved locally in this browser via IndexedDB and LocalStorage — no account required.',
      emptyTitle: 'Your favorites list is empty',
      emptySubtitle: 'Browse the encyclopedia and click the Save button on any component to keep it here for revision.',
      browseBtn: 'Browse Components',
      countLabel: 'Saved favorites:',
    },
    progress: {
      eyebrow: 'Real Student Performance Analytics',
      title: 'Learning Progress & Data Management',
      subtitle: '100% real statistics computed solely from components you studied, quizzes you finished, and flashcards you reviewed on this device.',
      deviceNoticeTitle: 'Local Device & Browser Storage Only',
      deviceNoticeDesc: 'ElectroPedia requires no login; your studied items, quiz scores, flashcards, and favorites are stored locally in this browser. Export JSON anytime to back up or move devices.',
      kpiStudied: 'Components Studied',
      kpiStudiedSub: 'of {total} total',
      kpiQuizzes: 'Completed Quizzes',
      kpiAvgScore: 'Average Score:',
      kpiSavedCards: 'Saved Flashcards',
      kpiReviewCards: 'Needs Review:',
      kpiFavorites: 'Favorites:',
      categoryChartTitle: 'Progress by Category (7 Domains)',
      difficultyChartTitle: 'Progress by Difficulty Level',
      quizTrendTitle: 'Recent Quiz Scores Trend',
      quizTrendEmpty: 'No completed quizzes yet. Finish a quiz to plot your real score progression.',
      logTitle: 'Real Learning Activity Log',
      logEmpty: 'No recorded activity yet — study a component sheet, finish a quiz, or review a flashcard.',
      dataManagementTitle: 'Backup & Data Portability',
      dataManagementDesc: 'Export your complete study progress to JSON, restore from a previous backup, or reset local data.',
      exportBtn: 'Export Data (JSON)',
      importBtn: 'Import Data (JSON)',
      importSuccess: 'Backup imported and local study progress restored successfully.',
      importError: 'Invalid backup file. Please select a valid ElectroPedia JSON export.',
      resetBtn: 'Reset All Data',
      resetModalTitle: 'Confirm Full Data Reset',
      resetModalDesc: 'This permanently deletes your favorites, quiz history, flashcard progress, and studied components from this browser. Continue?',
      resetConfirmBtn: 'Yes, Delete All Data',
      resetCancelBtn: 'Cancel',
      resetSuccess: 'All local study data has been cleared and progress reset to zero.',
      componentsUnit: 'items',
      masteredLabel: 'Mastered flashcards:',
      openQuizBtn: 'Take a Quiz',
      openFlashcardsBtn: 'Study Flashcards',
    },
    homeHub: {
      eyebrow: 'Phase 2 Learning Toolkit',
      title: 'Complete Study Hub for Symbols, Schematics & Calculations',
      subtitle: 'Jump straight into interactive electrical symbols, zoomable wiring diagrams, trilingual glossary, favorites, and real progress tracking.',
      symbolsTitle: 'Electrical Symbols Library',
      symbolsDesc: '39 crisp SVG schematic symbols across 9 domains with IEC 60617 and ANSI/IEEE Std 315 standards.',
      wiringTitle: 'Wiring Diagrams Library',
      wiringDesc: 'Zoomable circuit schematics for lighting, controls, relays, contactors, and motors with safety notes.',
      glossaryTitle: 'Trilingual Glossary',
      glossaryDesc: 'Clear definitions and industry abbreviations (AC, MCB, RCD, LOTO, VAT, PWM) in AR, EN, and FR.',
      favoritesTitle: 'Saved Favorites',
      favoritesDesc: 'Dedicated library of your saved components with instant search, filters, and visual toggles.',
      progressTitle: 'Learning Progress & Backup',
      progressDesc: 'Real local analytics by category and level plus JSON export, import, and reset controls.',
      safetyTitle: 'Occupational Safety & First Aid',
      safetyDesc: 'Shock thresholds, short-circuit vs overload, TT/TN/IT earthing, LOTO/VAT, and emergency first aid.',
      virtualLabTitle: 'Virtual Electrical & Electronics Lab',
      virtualLabDesc: 'Interactive MNA circuit simulator with 34 components, meters, oscilloscope, industrial contactors, and PLC Ladder.',
    },
    labWorkspace: {
      eyebrow: 'Phase 3 — ElectroPedia Virtual Lab',
      title: 'Virtual Electrical, Electronics & Control Lab',
      safetyBanner: 'Educational Notice: Circuit calculations use simplified engineering models for training; simulation outputs do not guarantee real-world circuit safety.',
      paletteTitle: 'Components (34)',
      searchComponents: 'Search component or code...',
      allCategories: 'All',
      canvasHint: 'Drag or click a component to place. Click pin-to-pin to wire. Double-click switches to toggle.',
      wiringHint: 'Wiring in progress — click destination pin or press Esc to cancel',
      cancelWire: 'Cancel Wire',
      tabProperties: 'Properties',
      tabResults: 'Results',
      tabInstruments: 'Instruments',
      startSim: 'Start',
      pauseSim: 'Pause',
      stopSim: 'Stop',
      resetSim: 'Reset',
      speedLabel: 'Speed',
      templatesBtn: 'Templates',
      projectsBtn: 'Projects',
      ladderBtn: 'PLC Ladder',
      clearBtn: 'Clear',
      undoBtn: 'Undo',
      redoBtn: 'Redo',
      copyBtn: 'Copy',
      pasteBtn: 'Paste',
      rotateBtn: 'Rotate 90°',
      deleteBtn: 'Delete',
      gridBtn: 'Grid',
      snapBtn: 'Snap',
      fitBtn: 'Fit',
      exportJsonBtn: 'Export JSON',
      importJsonBtn: 'Import JSON',
      statusRunning: 'Running',
      statusPaused: 'Paused',
      statusStopped: 'Stopped',
      statusComponents: 'Parts',
      statusWires: 'Wires',
      statusTime: 'Time',
      statusSelected: 'Selected',
      noSelection: 'No component or wire selected.',
      selectHint: 'Click any component to edit values or inspect real node voltage, current, and power.',
      openEncyclopedia: 'View in Encyclopedia',
      diagnosticsTitle: 'Circuit Diagnostics & Faults',
      noDiagnostics: 'No errors or warnings — circuit solved cleanly.',
      nodeVoltagesTitle: 'Solved Branch & Node Readings',
      scopeTitle: 'Dual-Channel Oscilloscope (CH1 / CH2)',
      noScopeHint: 'Place an Oscilloscope or AC/transient circuit to plot real-time solver curves.',
      clearConfirmTitle: 'Clear entire workspace?',
      clearConfirmDesc: 'This removes all components and wires from the active canvas (you can still Undo).',
      confirmBtn: 'Clear Canvas',
      cancelBtn: 'Cancel',
    },
  },
  fr: {
    meta: {
      title: 'ElectroPedia — Votre encyclopédie complète d’électricité et d’électronique',
      description: 'Explore. Learn. Connect. Guide visuel gratuit des composants électriques et électroniques.',
    },
    nav: {
      home: 'Accueil',
      categories: 'Catégories',
      components: 'Composants',
      electronics: 'Électronique',
      electricalTools: 'Outillage',
      levels: 'Niveaux',
      safety: 'Sécurité',
      encyclopedia: 'Encyclopédie',
      popular: 'Populaires',
      about: 'À propos',
      contact: 'Contact',
      lab: 'Laboratoire',
      virtualLab: 'Labo Virtuel',
      quiz: 'Quiz',
      flashcards: 'Cartes',
      calculators: 'Calculatrices',
      symbols: 'Symboles',
      wiringDiagrams: 'Schémas',
      glossary: 'Glossaire',
      favorites: 'Favoris',
      progress: 'Progression',
      more: 'Plus',
      saved: 'Favoris',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
      switchThemeLight: 'Passer au mode clair',
      switchThemeDark: 'Passer au mode sombre',
      languageLabel: 'Changer de langue',
    },
    hero: {
      slogan: 'Explore. Learn. Connect.',
      title: 'Découvrez le monde de l’électricité et de l’électronique',
      description:
        'Une encyclopédie visuelle conçue pour les étudiants, techniciens et ingénieurs afin d’identifier les formes réelles des composants, leurs symboles normalisés, leurs fonctions et leurs caractéristiques — gratuitement et sans inscription.',
      searchPlaceholder: 'Rechercher un composant ou symbole...',
      searchLabel: 'Rechercher un composant électrique ou électronique',
      exploreBtn: 'Explorer l’encyclopédie',
      startLearningBtn: 'Commencer à apprendre',
      quickSearchLabel: 'Recherche rapide :',
      caption: 'Identification visuelle · Formes physiques et symboles normalisés',
      freeBadgeNote: 'Accès 100% gratuit · Sans création de compte',
    },
    categoriesSection: {
      eyebrow: 'Catégories principales',
      title: 'Domaines fondamentaux de l’électricité et de l’électronique',
      subtitle: 'Sélectionnez un domaine pour explorer ses composants, leurs boîtiers et leurs spécifications.',
      browseAction: 'Explorer la catégorie',
    },
    popularSection: {
      eyebrow: 'Composants courants',
      title: 'Les éléments essentiels de chaque circuit',
      subtitle: 'Commencez par les composants les plus utilisés en laboratoire et dans les armoires industrielles.',
      inspectBtn: 'Voir les détails',
    },
    levelsSection: {
      eyebrow: 'Niveaux d’apprentissage',
      title: 'Des parcours adaptés à chaque niveau scolaire et professionnel',
      subtitle: 'Des débutants et filières professionnelles (BP/BT, TS/LT) aux élèves ingénieurs et techniciens.',
      exploreTrack: 'Filtrer par niveau',
      items: [
        {
          id: 'beginners',
          code: '01 · Fondamentaux',
          title: 'Débutants',
          audience: 'Initiation et découverte pratique',
          focus: 'Reconnaître résistances, condensateurs, diodes, LED et câbler sur plaque d’essai.',
          filterDifficulty: 'beginner',
        },
        {
          id: 'bp_bt',
          code: '02 · Enseignement technique',
          title: 'Étudiants BP & BT',
          audience: 'Brevet Professionnel & Baccalauréat Technique',
          focus: 'Fusibles, relais, transformateurs abaisseurs, disjoncteurs MCB et schémas de câblage.',
          filterDifficulty: 'beginner',
        },
        {
          id: 'ts_lt',
          code: '03 · Technicien supérieur',
          title: 'Étudiants TS & LT',
          audience: 'Technicien Supérieur & Licence Technique',
          focus: 'Analyse des semi-conducteurs, NE555, amplificateurs opérationnels et contacteurs AC.',
          filterDifficulty: 'intermediate',
        },
        {
          id: 'engineering',
          code: '04 · Cycle ingénieur',
          title: 'Étudiants en ingénierie',
          audience: 'Écoles d’ingénieurs en génie électrique',
          focus: 'Commutation de puissance MOSFET, microcontrôleurs, constante RC et réponse fréquentielle.',
          filterDifficulty: 'intermediate',
        },
        {
          id: 'professionals',
          code: '05 · Pratique terrain',
          title: 'Électriciens & Techniciens',
          audience: 'Techniciens de maintenance et installateurs',
          focus: 'Référence rapide pour le brochage (Pinout), pouvoirs de coupure, optocoupleurs et sécurité.',
          filterDifficulty: 'all',
        },
      ],
    },
    featuresSection: {
      eyebrow: 'Atouts de la plateforme',
      title: 'Des outils pédagogiques pensés pour l’efficacité',
      subtitle: 'Tout le nécessaire pour réviser, calculer et identifier les composants librement.',
      items: [
        {
          title: 'Forme réelle et symbole normalisé',
          description: 'Visualisez côte à côte l’aspect réel du boîtier et le symbole utilisé dans les schémas.',
        },
        {
          title: 'Interface trilingue AR / EN / FR',
          description: 'Basculez instantanément entre l’arabe (RTL), l’anglais et le français selon vos cours.',
        },
        {
          title: 'Recherche intelligente et tolérante',
          description: 'Recherche trilingue avec synonymes, tolérance aux fautes de frappe, suggestions visuelles et tri multi-critères.',
        },
        {
          title: 'Sauvegarde locale sans compte',
          description: 'Vos favoris et scores sont enregistrés localement via IndexedDB et LocalStorage.',
        },
      ],
    },
    safetySection: {
      eyebrow: 'Sécurité professionnelle',
      title: 'Règles de sécurité électrique avant toute intervention',
      subtitle: 'La maîtrise technique commence par la sécurité en atelier, laboratoire et chantier.',
      rules: [
        {
          level: 'danger',
          levelLabel: 'CRITIQUE · ÉLECTROCUTION',
          title: 'Consigner et vérifier l’absence de tension (VAT)',
          description: 'Ne supposez jamais qu’un circuit est coupé ; mesurez systématiquement avec un appareil certifié.',
        },
        {
          level: 'danger',
          levelLabel: 'DANGER · CHARGE RÉSIDUELLE',
          title: 'Décharger les condensateurs de puissance',
          description: 'Les condensateurs d’alimentation conservent une tension dangereuse hors secteur ; déchargez-les via une résistance.',
        },
        {
          level: 'warning',
          levelLabel: 'ATTENTION · SURCHAUFFE',
          title: 'Respecter la puissance (W) et le calibre (A)',
          description: 'Une résistance ou un conducteur sous-dimensionné chauffe rapidement et présente un risque d’incendie.',
        },
        {
          level: 'warning',
          levelLabel: 'EPI · ISOLATION',
          title: 'Porter les équipements de protection isolants',
          description: 'Utilisez des gants isolants, chaussures diélectriques et outils isolés 1000V en armoire électrique.',
        },
        {
          level: 'success',
          levelLabel: 'BONNE PRATIQUE',
          title: 'Contrôler la polarité et le brochage',
          description: 'Vérifiez anode/cathode, encoche des circuits intégrés et broches des régulateurs avant mise sous tension.',
        },
        {
          level: 'success',
          levelLabel: 'PROTECTION',
          title: 'Intégrer fusibles et protections différentielles',
          description: 'Protégez personnes et matériels par des disjoncteurs MCB/DDR et fusibles adaptés.',
        },
      ],
    },
    encyclopedia: {
      eyebrow: 'Encyclopédie complète',
      title: 'Catalogue des composants électriques et électroniques',
      subtitle: 'Consultez les photos réelles et symboles normalisés, recherchez avec tolérance aux fautes et filtrez par niveau.',
      photoView: 'Photos réelles',
      physicalView: 'Vue physique',
      schematicView: 'Symbole',
      searchPlaceholder: 'Rechercher par nom, synonyme ou symbole...',
      levelFilterLabel: 'Niveau :',
      sortLabel: 'Trier :',
      sortRelevance: 'Pertinence',
      sortNameAsc: 'Nom (A–Z)',
      sortNameDesc: 'Nom (Z–A)',
      sortDiffAsc: 'Niveau (Débutant → Avancé)',
      sortDiffDesc: 'Niveau (Avancé → Débutant)',
      suggestionsTitle: 'Suggestions intelligentes',
      fuzzyHint: 'Correspondance proche',
      viewAllResults: 'Voir tous les résultats',
      allLevels: 'Tous les niveaux',
      allCategories: 'Tous',
      showingCount: 'Affichage de {shown} sur {total}',
      emptyTitle: 'Aucun composant correspondant trouvé',
      emptySubtitle: 'Essayez un autre mot-clé ou réinitialisez les filtres.',
      resetFilters: 'Réinitialiser les filtres',
      detailsBtn: 'Détails & specs',
      saveTooltip: 'Ajouter aux favoris',
      removeTooltip: 'Retirer des favoris',
    },
    states: {
      loadingTitle: 'Chargement du catalogue technique...',
      loadingSubtitle: 'Préparation des fiches et des visuels normalisés.',
      errorTitle: 'Une erreur est survenue lors de l’affichage',
      errorSubtitle: 'Veuillez réessayer ou revenir à la page d’accueil.',
      retryBtn: 'Réessayer',
      homeBtn: 'Retour à l’accueil',
    },
    pages: {
      categories: {
        eyebrow: 'Domaines de l’encyclopédie',
        title: 'Les 7 catégories d’électricité et d’électronique',
        subtitle: 'Sélectionnez un domaine technique pour parcourir l’ensemble de ses composants.',
        allDomainsBtn: 'Toutes les catégories',
        selectedCategoryPrefix: 'Domaine :',
        openInComponents: 'Ouvrir dans le catalogue complet',
      },
      electronics: {
        eyebrow: 'Domaine Électronique',
        title: 'Composants électroniques et semi-conducteurs',
        subtitle: 'Des composants passifs aux transistors MOSFET, thyristors, circuits intégrés, microcontrôleurs et PCB.',
        passiveHeading: 'Composants passifs',
        passiveDesc: 'Résistances, condensateurs et inductances pour limitation, stockage et filtrage.',
        activeHeading: 'Semi-conducteurs et puissance',
        activeDesc: 'Diodes, LED, transistors bipolaires BJT, MOSFET et thyristors/TRIAC.',
        digitalHeading: 'Circuits intégrés et embarqué',
        digitalDesc: 'Régulateurs de tension, portes logiques, microcontrôleurs et circuits imprimés.',
      },
      electricalTools: {
        eyebrow: 'Domaine Outillage',
        title: 'Appareils de mesure, outillage isolé 1000V et EPI',
        subtitle: 'Découvrez les multimètres CAT III/IV, outils isolés IEC 60900 et équipements de protection individuelle.',
        measurementHeading: 'Mesure et diagnostic',
        measurementDesc: 'Multimètres numériques, pinces ampèremétriques, VAT, oscilloscopes et mégohmmètres.',
        insulatedHeading: 'Outils isolés et câblage',
        insulatedDesc: 'Tournevis VDE, pinces à dénuder, pinces à sertir, perceuses et stations de soudage.',
        ppeHeading: 'Équipements de protection (EPI)',
        ppeDesc: 'Gants isolants Classe 00/0, casques diélectriques et visières anti-arc.',
      },
      safety: {
        eyebrow: 'Sécurité professionnelle',
        title: 'Normes de sécurité électrique et procédures terrain',
        subtitle: 'Consignation LOTO, catégories de mesure IEC 61010 et équipements de protection obligatoires.',
        catTitle: 'Catégories de sécurité des appareils (IEC 61010)',
        catRows: [
          { cat: 'CAT II', scope: 'Prises domestiques monophasées et appareils portables', examples: 'Prises 230V et bancs de test' },
          { cat: 'CAT III', scope: 'Tableaux de distribution, éclairage fixe et moteurs triphasés', examples: 'Armoires divisionnaires et machines' },
          { cat: 'CAT IV', scope: 'Origine de l’installation, compteurs et lignes extérieures', examples: 'Arrivées secteur et transformateurs' },
        ],
        lotoTitle: 'Les 5 étapes de consignation électrique (LOTO & VAT)',
        lotoSteps: [
          '1. Séparer complètement le circuit de toute source de tension.',
          '2. Condamner l’appareil de coupure par cadenas et pancarte (LOTO).',
          '3. Vérifier l’absence de tension (VAT) avant et après test sur source connue.',
          '4. Décharger les condensateurs et mettre à la terre si nécessaire.',
          '5. Porter les gants isolants Classe 0 et utiliser des outils isolés 1000V.',
        ],
        hazardsTitle: 'Risques électriques et seuils physiologiques (IEC 60479-1 · 50/60 Hz)',
        shockThresholdsTitle: 'Contact direct (conducteur nu) vs Contact indirect (masse mise sous tension)',
        shockThresholds: [
          { ma: '1–5 mA', effect: 'Seuil de perception : léger picotement sans danger immédiat.', severity: 'safe' },
          { ma: '10–15 mA', effect: 'Seuil de non-lâcher : contraction musculaire bloquant la main sur le conducteur.', severity: 'warning' },
          { ma: '30 mA', effect: 'Seuil de déclenchement du différentiel DDR 30 mA pour protéger la vie.', severity: 'warning' },
          { ma: '50–100+ mA', effect: 'Fibrillation ventriculaire cardiaque et risque d’arrêt cardiaque immédiat.', severity: 'danger' },
        ],
        faultComparisonTitle: 'Différence entre Court-Circuit et Surcharge',
        shortCircuitVsOverload: [
          {
            title: 'Court-circuit',
            points: [
              'Contact franc entre Phase et Neutre ou entre deux Phases.',
              'Surintensité extrême instantanée générant un arc électrique destructeur.',
              'Coupé en quelques millisecondes par le déclencheur magnétique ou le fusible.',
            ],
          },
          {
            title: 'Surcharge électrique',
            points: [
              'Courant prolongé supérieur au calibre du câble ou du moteur.',
              'Échauffement progressif dégradant les isolants et les bobinages.',
              'Coupé par le bilame thermique du disjoncteur ou du relais thermique F1.',
            ],
          },
        ],
        earthingTitle: 'Schémas de liaison à la terre (TT / TN / IT)',
        earthingSystems: [
          { code: 'Schéma TT', desc: 'Neutre du transformateur et masses à la terre séparées ; coupure obligatoire par DDR 30 mA.' },
          { code: 'Schéma TN-S / TN-C-S', desc: 'Masses reliées au neutre via PE pour déclencher immédiatement le disjoncteur sur court-circuit.' },
          { code: 'Schéma IT', desc: 'Neutre isolé ; continuité de service au 1er défaut (hôpitaux, sites critiques) avec contrôleur d’isolement.' },
        ],
        toolsPpeTitle: 'Outils isolés IEC 60900 (1000V) et Équipements de Protection (EPI)',
        toolsPpePoints: [
          'Outils VDE double isolation 1000V AC avec garde anti-glissement.',
          'Gants isolants Classe 00 (500V) ou Classe 0 (1000V) contrôlés par gonflage avant usage.',
          'Casque isolant Classe E, écran facial anti-arc et chaussures diélectriques.',
        ],
        workshopTitle: 'Règles de sécurité en atelier et laboratoire',
        workshopRules: [
          'Maintenir le sol et l’établi secs ; l’humidité réduit fortement la résistance du corps.',
          'Retirer bagues, montres métalliques et bracelets avant toute intervention.',
          'Appliquer la règle d’une seule main lors des mesures sous tension.',
          'Vérifier l’état des cordons et pointes de touche avant chaque mesure.',
        ],
        firstAidTitle: 'Premiers secours en cas d’accident électrique (ERC / OSHA)',
        firstAidWarning: 'NE TOUCHEZ JAMAIS la victime à mains nues tant qu’elle reste en contact avec le courant !',
        firstAidSteps: [
          '1. Couper immédiatement le courant au disjoncteur ou débrancher ; en basse tension uniquement, écarter le fil avec un objet sec et isolant (bois sec ou plastique).',
          '2. Alerter les secours d’urgence en précisant l’adresse et le niveau de tension (en haute tension, rester à distance et appeler le distributeur).',
          '3. Une fois la zone totalement hors danger électrique, vérifier la conscience et la respiration.',
          '4. En l’absence de respiration normale, débuter immédiatement le massage cardiaque (RCP) et utiliser un DAE/AED si disponible.',
          '5. Refroidir les brûlures électriques à l’eau claire sans pommade ni retrait des vêtements collés et surveiller jusqu’à l’arrivée des secours.',
        ],
      },
      about: {
        eyebrow: 'À propos d’ElectroPedia',
        title: 'Une initiative issue de l’enseignement professionnel et technique',
        subtitle: 'Plateforme gratuite et sans compte reliant les termes arabes, anglais et français.',
        creatorCardTitle: 'À propos du créateur',
        creatorRoleBadge: 'Étudiant technique · BT2',
        creatorSchool: 'Institut Technique de Jabal Mohsen',
        creatorMajor: 'Électricité du Bâtiment — 2e année (BT2)',
        creatorParagraphs: [
          'Je suis étudiant en enseignement professionnel et technique, en 2e année de spécialité Électricité domestique (BT2) à l’Institut Technique de Jabal Mohsen.',
          'J’ai créé l’idée d’ElectroPedia pour aider les étudiants à reconnaître les composants électriques et électroniques et à comprendre leurs fonctions et leur terminologie en trois langues (arabe, anglais et français).',
          'Mon objectif est de développer mes compétences, d’acquérir une expérience pratique et de fonder à l’avenir ma propre entreprise d’électricité.',
        ],
        missionTitle: 'Nos piliers pédagogiques',
        missionItems: [
          { title: 'Accès 100% gratuit sans inscription', desc: 'Consultable librement en cours, en atelier ou sur chantier.' },
          { title: 'Passerelle trilingue AR / EN / FR', desc: 'Relie le vocabulaire d’atelier aux normes internationales IEC/IEEE.' },
          { title: 'La sécurité avant tout', desc: 'Chaque fiche inclut les pannes courantes, contrôles sûrs et précautions EPI.' },
        ],
        ctaBrowse: 'Explorer l’encyclopédie',
        ctaContact: 'Contacter le créateur',
      },
      contact: {
        eyebrow: 'Contact',
        title: 'Suggestions, corrections et échanges pédagogiques',
        subtitle: 'Partagez vos idées ou proposez de nouveaux composants pour enrichir ElectroPedia.',
        directTitle: 'Coordonnées directes',
        directDesc: 'Écrivez directement par e-mail ou préparez votre message via le formulaire.',
        emailLabel: 'Adresse e-mail',
        copyEmail: 'Copier l’e-mail',
        emailCopied: 'Copié',
        instituteLabel: 'Institut et filière',
        instituteValue: 'Institut Technique de Jabal Mohsen · Électricité Domestique (BT2)',
        formTitle: 'Envoyer un message ou suggérer un composant',
        formDesc: 'Enregistre un brouillon local et prépare un e-mail direct.',
        nameLabel: 'Nom complet',
        namePlaceholder: 'Ex. Youssef Dib',
        emailFieldLabel: 'Votre e-mail',
        emailFieldPlaceholder: 'nom@exemple.com',
        subjectLabel: 'Objet',
        subjectPlaceholder: 'Suggestion de composant ou remarque',
        messageLabel: 'Message',
        messagePlaceholder: 'Rédigez votre message ou le composant souhaité...',
        sendBtn: 'Enregistrer et préparer',
        openMailBtn: 'Envoyer par e-mail',
        successTitle: 'Message enregistré et prêt à être envoyé',
        successDesc: 'Cliquez sur le bouton e-mail ci-dessous pour l’expédier.',
        validationError: 'Veuillez saisir votre nom, un e-mail valide et un message.',
        recentTitle: 'Messages enregistrés localement',
        clearMessages: 'Effacer',
      },
    },
    modal: {
      close: 'Fermer',
      saveBtn: 'Enregistrer',
      savedBtn: 'Enregistré',
      physicalShape: 'Forme physique',
      physicalCaption: 'Aspect réel du boîtier dans un circuit',
      schematicSymbol: 'Symbole normalisé',
      schematicCaption: 'Représentation standard dans les schémas',
      coreFunction: 'Fonction principale',
      howItWorks: 'Principe de fonctionnement',
      pinoutTitle: 'Brochage des bornes (Pinout)',
      pinCol: 'Broche',
      nameCol: 'Nom',
      roleCol: 'Rôle',
      specsTitle: 'Spécifications électriques standard',
      paramCol: 'Paramètre',
      valueCol: 'Valeur et unité',
      applicationsTitle: 'Applications pratiques courantes',
      safetyTitle: 'Conseils et précautions techniques',
      relatedTitle: 'Composants associés',
    },
    lab: {
      eyebrow: 'Laboratoire interactif',
      title: 'Calculateurs et simulateurs d’ingénierie',
      subtitle: 'Décodez les bagues de couleur, dimensionnez une LED et visualisez la charge d’un circuit RC.',
      tabResistor: 'Code couleurs',
      tabOhmLed: "Loi d'Ohm & LED",
      tabRc: 'Circuit RC',
      computedValue: 'Valeur calculée',
      rangeLabel: 'Plage :',
      band1: '1re bande (1er chiffre)',
      band2: '2e bande (2e chiffre)',
      multiplier: '3e bande (Multiplicateur)',
      tolerance: '4e bande (Tolérance)',
      ohmTitle: "Calculateur Loi d'Ohm & Puissance",
      voltageLabel: 'Tension (V)',
      resistanceLabel: 'Résistance (Ω)',
      currentOut: 'Courant (I)',
      powerOut: 'Puissance dissipée (P)',
      powerWarning: 'Attention : dépasse 250 mW — utilisez une résistance 0.5 W ou 1 W.',
      powerSafe: 'Sûr pour une résistance standard de 0.25 W.',
      ledTitle: 'Calculateur de résistance pour LED',
      supplyV: 'Source (Vs)',
      ledVf: 'Tension LED (Vf)',
      ledIf: 'Courant (mA)',
      ledExact: 'Valeur calculée exacte :',
      ledE12: 'Valeur standard E12 la plus proche :',
      ledPower: 'Puissance dissipée :',
      ledColors: { red: 'Rouge/Jaune (2.0V)', green: 'Vert (2.2V)', blue: 'Bleu/Blanc (3.2V)' },
      rcTitle: 'Constante de temps RC et charge',
      capLabel: 'Capacité (C)',
      tauLabel: 'Constante τ',
      fullChargeLabel: 'Charge complète 5τ',
      cutoffLabel: 'Fréq. coupure fc',
      rcCurveTitle: 'Courbe exponentielle de charge (0 à 5τ)',
    },
    quiz: {
      eyebrow: 'Quiz pédagogiques interactifs',
      title: 'Testez vos connaissances en électricité et électronique',
      subtitle: 'Évaluations aléatoires couvrant photos, symboles, fonctions, correspondances trilingues, calculs et sécurité.',
      openFullQuiz: 'Ouvrir la page complète des quiz',
      setupTitle: 'Configurer votre quiz personnalisé',
      categoryLabel: 'Catégorie',
      difficultyLabel: 'Niveau de difficulté',
      questionCountLabel: 'Nombre de questions',
      questionTypeLabel: 'Format des questions',
      typeLabels: {
        all: 'Mixte (tous les formats)',
        mcq: 'Choix multiple (QCM)',
        'mcq-photo': 'Identifier par la photo',
        'mcq-symbol': 'Identifier par le symbole',
        'mcq-function': 'Identifier la fonction',
        'true-false': 'Vrai ou Faux',
        'match-images': 'Associer photos et noms',
        'match-trilingual': 'Associer les termes (AR / EN / FR)',
        'mcq-calculation': 'Calculs électriques',
        'mcq-safety': 'Sécurité professionnelle',
      },
      startQuizBtn: 'Démarrer le quiz',
      retrySameBtn: 'Recommencer (nouvel ordre aléatoire)',
      newQuizBtn: 'Modifier les paramètres',
      scoreLabel: 'Score :',
      bestLabel: 'Meilleur :',
      attemptsLabel: 'Essais :',
      averageLabel: 'Moyenne :',
      accuracyLabel: 'Précision',
      finishedTitle: 'Résultat final du quiz',
      finishedExcellent: 'Maîtrise remarquable des composants, symboles, calculs et règles de sécurité !',
      finishedGood: 'Très bon travail ! Relisez les explications ci-dessous pour viser les 100 %.',
      finishedRetry: 'Bon début ! Consultez les explications et les fiches techniques avant de réessayer.',
      savedNotice: 'Votre résultat est enregistré localement dans votre navigateur (IndexedDB / LocalStorage).',
      restartBtn: 'Recommencer le quiz',
      modeSchematic: 'Symbole électrique normalisé',
      modePhysical: 'Photo réelle du composant',
      modeFunction: 'Fonction du composant',
      modeFormula: 'Calcul électrique',
      modeSafety: 'Sécurité professionnelle',
      modeMatchImg: 'Association photos / noms',
      modeMatchTri: 'Association trilingue',
      modeTrueFalse: 'Vrai ou Faux',
      questionPrefix: 'Question',
      ofWord: 'sur',
      correctTitle: 'Bonne réponse !',
      wrongTitle: 'Réponse incorrecte',
      nextBtn: 'Question suivante',
      finishBtn: 'Voir le résultat final',
      functionHint: 'Identifiez le composant à partir de sa description',
      trueBtn: 'Vrai',
      falseBtn: 'Faux',
      checkAnswerBtn: 'Vérifier la réponse',
      matchPhotoHint: 'Sélectionnez une photo puis cliquez sur le nom correspondant :',
      matchPhotoSelectedLabel: 'Photo sélectionnée :',
      matchPairBtn: 'Associer',
      matchTrilingualHint: 'Associez chaque terme à ses équivalents exacts dans les deux autres langues :',
      selectOptionPlaceholder: 'Choisir...',
      colYourAnswer: 'Votre réponse',
      colCorrectAnswer: 'Bonne réponse',
      reviewTitle: 'Révision détaillée des réponses et explications',
      historyTitle: 'Historique local des résultats',
      historySubtitle: 'Sauvegardé localement sans création de compte.',
      historyEmpty: 'Aucun quiz terminé pour le moment. Terminez un test pour suivre votre progression.',
      clearHistoryBtn: 'Effacer l’historique',
      noQuestionsTitle: 'Aucune question pour cette combinaison exacte de filtres',
      noQuestionsSubtitle: 'Choisissez « Mixte » ou « Toutes les catégories » pour élargir la banque de questions.',
      resetSetupBtn: 'Réinitialiser',
      availableCountLabel: 'Disponibles :',
    },
    savedDrawer: {
      title: 'Favoris et liste d’étude',
      subtitle: 'Sauvegardée localement (IndexedDB) sans inscription',
      close: 'Fermer les favoris',
      emptyTitle: 'Aucun composant favori pour l’instant',
      emptySubtitle: 'Cliquez sur l’icône de signet d’une carte pour l’ajouter à vos favoris.',
      totalLabel: 'Total :',
      clearAll: 'Tout effacer',
      openFavoritesPage: 'Ouvrir la page complète des favoris',
    },
    footer: {
      tagline: 'Votre encyclopédie complète d’électricité et d’électronique',
      freeAccess: 'Plateforme éducative 100% gratuite · Sans compte requis',
    },
    componentPage: {
      backToCatalog: 'Retour à l’encyclopédie',
      breadcrumbHome: 'Accueil',
      breadcrumbEncyclopedia: 'Encyclopédie',
      trilingualTitle: 'Nomenclature trilingue et synonymes',
      altNamesLabel: 'Autres appellations :',
      copyLink: 'Copier le lien',
      linkCopied: 'Copié',
      galleryTitle: 'Galerie visuelle et schémas techniques',
      tabPhoto: 'Photo studio',
      tabPhysical: 'Vue physique',
      tabSymbol: 'Symbole électrique',
      tabWiring: 'Schéma de câblage',
      tabAnatomy: 'Anatomie interne',
      definitionTitle: 'Définition',
      functionTitle: 'Fonction principale',
      workingPrincipleTitle: 'Principe de fonctionnement',
      electricalSymbolTitle: 'Symbole électrique normalisé',
      anatomyTitle: 'Parties internes et externes',
      internalPartsTitle: 'Parties internes',
      externalPartsTitle: 'Parties externes',
      typesTitle: 'Types et variantes courants',
      specsTitle: 'Spécifications techniques',
      terminalsTitle: 'Bornes de raccordement et brochage',
      wiringTitle: 'Schéma de câblage pédagogique',
      applicationsTitle: 'Applications pratiques',
      faultsTitle: 'Pannes fréquentes',
      testingTitle: 'Méthodes de contrôle sûres',
      safetyTitle: 'Précautions de sécurité',
      difficultyTitle: 'Niveau de difficulté',
      relatedTitle: 'Composants associés',
      referencesTitle: 'Sources et normes de référence',
      model3dTitle: 'Architecture prête pour la 3D',
      model3dDesc: 'Structure de métadonnées prête pour l’intégration future de modèles interactifs GLB/glTF.',
      model3dStatusReady: 'Prêt',
      model3dStatusPlanned: 'Schéma prêt (GLB/glTF)',
      model3dFormat: 'Format cible',
      model3dDimensions: 'Encombrement de référence (mm)',
      model3dHotspots: 'Points d’intérêt 3D prévus',
      notFoundTitle: 'Fiche composant introuvable',
      notFoundSubtitle: 'L’identifiant demandé n’existe pas. Revenez à l’encyclopédie pour parcourir le catalogue.',
      symbolLabel: 'Code symbole',
      packageLabel: 'Boîtier / Format',
    },
    flashcards: {
      eyebrow: 'Révision par répétition espacée',
      title: 'Cartes mémoire interactives',
      subtitle: 'Maîtrisez les composants visuels et symboles normalisés en 3 langues grâce à la répétition espacée.',
      frontModeLabel: 'Contenu du recto',
      modePhoto: 'Photo réelle',
      modeSymbol: 'Symbole électrique',
      modeMixed: 'Mixte (Photo / Symbole)',
      deckFilterLabel: 'Filtre du paquet',
      filterAll: 'Toutes les cartes',
      filterDue: 'À réviser',
      filterDifficult: 'Cartes difficiles',
      filterSaved: 'Enregistrées',
      categoryLabel: 'Catégorie',
      levelLabel: 'Niveau',
      shuffleBtn: 'Mélanger',
      resetOrderBtn: 'Ordre initial',
      resetProgressBtn: 'Réinitialiser',
      flipToBack: 'Retourner la carte',
      flipToFront: 'Voir le recto',
      prevBtn: 'Précédente',
      nextBtn: 'Suivante',
      saveCardBtn: 'Enregistrer',
      savedCardBtn: 'Enregistrée',
      markDifficultBtn: 'Marquer difficile',
      difficultTag: 'À revoir',
      openDetailsBtn: 'Ouvrir la fiche complète',
      frontHintPhoto: 'Cliquez pour révéler les noms trilingues et la fonction',
      frontHintSymbol: 'Identifiez ce symbole normalisé puis retournez la carte',
      backNameAr: 'Nom en arabe',
      backNameEn: 'Nom en anglais',
      backNameFr: 'Nom en français',
      backFunction: 'Fonction principale',
      backSummary: 'Explication brève',
      srsPrompt: 'Évaluez votre rappel pour planifier la prochaine révision :',
      rateAgain: 'À revoir',
      rateHard: 'Difficile',
      rateGood: 'Bien',
      rateEasy: 'Facile',
      dueNowLabel: '< 10 min',
      daySuffix: 'jour',
      daysSuffix: 'jours',
      statsTotal: 'Total cartes',
      statsReviewed: 'Révisées',
      statsMastered: 'Maîtrisées',
      statsDifficult: 'Difficiles',
      statsSaved: 'Favoris',
      statsDue: 'À faire',
      emptyDeckTitle: 'Aucune carte ne correspond à ce filtre',
      emptyDeckSubtitle: 'Affichez toutes les cartes ou modifiez la catégorie et le niveau.',
      showAllBtn: 'Tout afficher',
      keyboardHint: 'Raccourcis : Espace pour retourner · Flèches pour naviguer',
    },
    calculators: {
      eyebrow: 'Laboratoire de calcul électrique',
      title: 'Calculatrices électriques interactives',
      subtitle: '18 calculatrices vérifiées avec formules, étapes détaillées, schémas, hypothèses et validation des entrées.',
      searchPlaceholder: 'Rechercher une calculatrice (Ohm, Câble, Solaire...)...',
      allGroups: 'Toutes (18)',
      groups: {
        fundamentals: 'Bases et énergie',
        circuits: 'Circuits et composants',
        installations: 'Câblage et chute de tension',
        machines: 'Transformateurs, moteurs et triphasé',
        solar: 'Solaire PV et batteries',
        tools: 'Convertisseur d’unités',
      },
      resetBtn: 'Réinitialiser',
      formulaTitle: 'Formule utilisée',
      resultsTitle: 'Résultats calculés',
      stepsTitle: 'Étapes de calcul',
      explanationTitle: 'Explication simplifiée',
      assumptionsTitle: 'Hypothèses et limites',
      diagramTitle: 'Schéma illustratif',
      inputsTitle: 'Paramètres d’entrée',
      validationTitle: 'Vérifiez vos saisies',
      countLabel: 'Calculatrices disponibles :',
      items: {
        'ohms-law': { name: "Calculatrice Loi d'Ohm", shortDesc: 'Tension, courant, résistance et puissance' },
        'electrical-power': { name: 'Calculatrice Puissance électrique', shortDesc: 'CC et CA monophasé (P, S, Q)' },
        'energy-consumption': { name: 'Calculatrice Consommation d’énergie', shortDesc: 'Consommation quotidienne, mensuelle et annuelle' },
        'electricity-cost': { name: 'Calculatrice Coût d’électricité', shortDesc: 'Estimation de facture selon le tarif kWh' },
        'resistor-color': { name: 'Code couleur des résistances', shortDesc: 'Décodeur 4 et 5 anneaux avec tolérance' },
        'series-resistance': { name: 'Résistances en série', shortDesc: 'Résistance totale, courant et puissance' },
        'parallel-resistance': { name: 'Résistances en parallèle', shortDesc: 'Résistance équivalente et courant total' },
        'capacitor': { name: 'Calculatrice Condensateur', shortDesc: 'Série/parallèle, réactance Xc et constante τ' },
        'voltage-divider': { name: 'Pont diviseur de tension', shortDesc: 'Tension de sortie, rapport et dissipation' },
        'voltage-drop': { name: 'Calculatrice Chute de tension', shortDesc: 'Monophasé et triphasé selon limites IEC' },
        'cable-size': { name: 'Calculatrice Section de câble', shortDesc: 'Estimation pédagogique de section et calibre' },
        'transformer': { name: 'Calculatrice Transformateur', shortDesc: 'Rapport de transformation, spires et courants' },
        'motor-power': { name: 'Calculatrice Puissance moteur', shortDesc: 'kW, HP, courant nominal et couple arbre' },
        'three-phase-power': { name: 'Calculatrice Puissance triphasée', shortDesc: 'Étoile (Y) et Triangle (Δ) équilibrés' },
        'power-factor': { name: 'Calculatrice Facteur de puissance', shortDesc: 'cos(φ) et batterie de condensateurs kVAR / µF' },
        'solar-panel': { name: 'Calculatrice Panneaux solaires', shortDesc: 'Puissance crête PV et nombre de modules' },
        'battery-capacity': { name: 'Calculatrice Capacité batterie', shortDesc: 'Capacité Ah selon autonomie et DoD %' },
        'unit-converter': { name: 'Convertisseur d’unités électriques', shortDesc: 'Préfixes SI, HP et section AWG ↔ mm²' },
      },
    },
    difficulty: {
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé',
    },
    symbols: {
      eyebrow: 'Bibliothèque vectorielle SVG',
      title: 'Bibliothèque des symboles électriques et électroniques',
      subtitle: 'Explorez des symboles normalisés nets sur 9 domaines techniques en comparant IEC 60617 et ANSI/IEEE Std 315.',
      searchPlaceholder: 'Rechercher un symbole ou code (MCB, IEC, NPN...)...',
      allDomains: 'Tous les domaines (9)',
      standardLabel: 'Norme active :',
      iecLabel: 'IEC 60617 (Internationale)',
      ansiLabel: 'ANSI / IEEE Std 315',
      activeStandardNote: 'Norme affichée :',
      functionLabel: 'Fonction :',
      trilingualLabel: 'Noms trilingues :',
      viewComponentBtn: 'Composant associé',
      emptyTitle: 'Aucun symbole ne correspond à votre recherche',
      emptySubtitle: 'Essayez un autre domaine ou effacez le filtre.',
      resetBtn: 'Réinitialiser',
      countLabel: 'Symboles affichés :',
    },
    wiringLibrary: {
      eyebrow: 'Schémas électriques pédagogiques',
      title: 'Bibliothèque des schémas de câblage',
      subtitle: 'Schémas SVG zoomables et vérifiés techniquement dans 8 catégories avec liste de composants, symboles et sécurité.',
      allCategories: 'Tous les schémas',
      zoomIn: 'Zoom +',
      zoomOut: 'Zoom -',
      resetZoom: 'Réinitialiser 100%',
      zoomLevelLabel: 'Zoom :',
      voltageLabel: 'Tension nominale :',
      standardLabel: 'Référence :',
      explanationTitle: 'Principe de fonctionnement et câblage',
      componentsTitle: 'Composants utilisés',
      symbolsTitle: 'Symboles présents sur le schéma',
      safetyTitle: 'Précautions de sécurité',
      viewComponentBtn: 'Voir la fiche',
    },
    glossary: {
      eyebrow: 'Lexique technique trilingue',
      title: 'Glossaire électrique et abréviations',
      subtitle: 'Définitions précises et acronymes courants en arabe, anglais et français avec liens directs vers les composants.',
      searchPlaceholder: 'Rechercher un terme ou acronyme (MCB, LOTO, PWM...)...',
      allLetters: 'Tous',
      relatedTitle: 'Composants associés :',
      emptyTitle: 'Aucun terme trouvé',
      emptySubtitle: 'Modifiez votre recherche ou le filtre alphabétique.',
      resetBtn: 'Afficher tout le glossaire',
      countLabel: 'Nombre de termes :',
    },
    favorites: {
      eyebrow: 'Bibliothèque locale de révision',
      title: 'Mes Favoris',
      subtitle: 'Retrouvez tous vos composants enregistrés avec recherche instantanée et filtres par catégorie et niveau.',
      searchPlaceholder: 'Rechercher dans les favoris...',
      allCategories: 'Toutes les catégories',
      allLevels: 'Tous les niveaux',
      photoView: 'Photos réelles',
      physicalView: 'Vue physique',
      schematicView: 'Symbole',
      removeBtn: 'Retirer',
      clearAllBtn: 'Vider tous les favoris',
      clearConfirmTitle: 'Confirmer la suppression des favoris',
      clearConfirmDesc: 'Voulez-vous vraiment retirer tous les composants de votre liste de favoris locale ?',
      confirmBtn: 'Oui, tout vider',
      cancelBtn: 'Annuler',
      storageNotice: 'Les favoris sont sauvegardés localement dans ce navigateur via IndexedDB et LocalStorage, sans compte.',
      emptyTitle: 'Votre liste de favoris est vide',
      emptySubtitle: 'Parcourez l’encyclopédie et cliquez sur le bouton d’enregistrement pour ajouter des composants ici.',
      browseBtn: 'Explorer les composants',
      countLabel: 'Composants favoris :',
    },
    progress: {
      eyebrow: 'Suivi réel d’apprentissage',
      title: 'Ma Progression & Gestion des Données',
      subtitle: 'Statistiques 100% réelles calculées uniquement depuis vos fiches étudiées, vos quiz terminés et vos cartes révisées sur cet appareil.',
      deviceNoticeTitle: 'Stockage local sur cet appareil et ce navigateur uniquement',
      deviceNoticeDesc: 'Sans création de compte : votre progression et vos favoris restent sur cet appareil via IndexedDB et LocalStorage. Exportez en JSON pour sauvegarder ou transférer.',
      kpiStudied: 'Composants étudiés',
      kpiStudiedSub: 'sur {total} fiches',
      kpiQuizzes: 'Quiz terminés',
      kpiAvgScore: 'Score moyen :',
      kpiSavedCards: 'Cartes favorites',
      kpiReviewCards: 'À réviser :',
      kpiFavorites: 'Favoris :',
      categoryChartTitle: 'Progression par catégorie (7 domaines)',
      difficultyChartTitle: 'Progression par niveau de difficulté',
      quizTrendTitle: 'Évolution des scores aux quiz',
      quizTrendEmpty: 'Aucun quiz terminé pour l’instant. Passez un premier test pour suivre vos scores réels.',
      logTitle: 'Journal réel d’activité',
      logEmpty: 'Aucune activité enregistrée — consultez une fiche composant, terminez un quiz ou révisez une carte.',
      dataManagementTitle: 'Sauvegarde et portabilité des données',
      dataManagementDesc: 'Exportez toutes vos données en JSON, importez une sauvegarde ou réinitialisez le stockage local.',
      exportBtn: 'Exporter les données (JSON)',
      importBtn: 'Importer des données (JSON)',
      importSuccess: 'Sauvegarde importée et progression restaurée avec succès.',
      importError: 'Fichier invalide. Veuillez choisir un export JSON généré par ElectroPedia.',
      resetBtn: 'Réinitialiser toutes les données',
      resetModalTitle: 'Confirmer la réinitialisation complète',
      resetModalDesc: 'Cela supprimera définitivement vos favoris, résultats de quiz, progression des cartes et fiches étudiées de ce navigateur. Continuer ?',
      resetConfirmBtn: 'Oui, tout supprimer',
      resetCancelBtn: 'Annuler',
      resetSuccess: 'Toutes les données locales ont été effacées et la progression remise à zéro.',
      componentsUnit: 'fiches',
      masteredLabel: 'Cartes maîtrisées :',
      openQuizBtn: 'Lancer un quiz',
      openFlashcardsBtn: 'Ouvrir les cartes',
    },
    homeHub: {
      eyebrow: 'Outils pédagogiques (Phase 2)',
      title: 'Espace complet de symboles, schémas et révision',
      subtitle: 'Accédez directement aux symboles normalisés, schémas zoomables, glossaire trilingue, favoris et suivi de progression.',
      symbolsTitle: 'Bibliothèque de symboles',
      symbolsDesc: '39 symboles vectoriels SVG sur 9 domaines comparant les normes IEC 60617 et ANSI/IEEE Std 315.',
      wiringTitle: 'Bibliothèque de schémas',
      wiringDesc: 'Schémas zoomables d’éclairage, commande, relais et moteurs avec composants et sécurité.',
      glossaryTitle: 'Glossaire trilingue',
      glossaryDesc: 'Définitions et abréviations (AC, MCB, RCD, LOTO, VAT, PWM) en arabe, anglais et français.',
      favoritesTitle: 'Favoris enregistrés',
      favoritesDesc: 'Page dédiée à vos composants favoris avec recherche et filtres complets.',
      progressTitle: 'Progression et sauvegarde',
      progressDesc: 'Statistiques réelles par domaine et niveau avec export, import et réinitialisation.',
      safetyTitle: 'Sécurité et premiers secours',
      safetyDesc: 'Seuils d’électrocution, court-circuit vs surcharge, régimes TT/TN/IT, LOTO et secourisme.',
      virtualLabTitle: 'Laboratoire Électrique Virtuel',
      virtualLabDesc: 'Simulateur de circuits MNA avec 34 composants, multimètres, oscilloscope, contacteurs et automate PLC.',
    },
    labWorkspace: {
      eyebrow: 'Phase 3 — ElectroPedia Virtual Lab',
      title: 'Laboratoire Virtuel d’Électricité, Électronique & Commande',
      safetyBanner: 'Avertissement pédagogique : modèles d’ingénierie simplifiés pour la formation ; la simulation ne garantit pas la sécurité d’un montage réel.',
      paletteTitle: 'Composants (34)',
      searchComponents: 'Chercher un composant...',
      allCategories: 'Tous',
      canvasHint: 'Glissez ou cliquez pour placer. Cliquez entre deux bornes pour câbler. Double-clic sur interrupteur.',
      wiringHint: 'Câblage en cours — choisissez la borne cible ou Esc pour annuler',
      cancelWire: 'Annuler fil',
      tabProperties: 'Propriétés',
      tabResults: 'Résultats',
      tabInstruments: 'Instruments',
      startSim: 'Démarrer',
      pauseSim: 'Pause',
      stopSim: 'Arrêt',
      resetSim: 'Réarmer',
      speedLabel: 'Vitesse',
      templatesBtn: 'Modèles',
      projectsBtn: 'Projets',
      ladderBtn: 'PLC Ladder',
      clearBtn: 'Effacer',
      undoBtn: 'Annuler',
      redoBtn: 'Rétablir',
      copyBtn: 'Copier',
      pasteBtn: 'Coller',
      rotateBtn: 'Pivoter 90°',
      deleteBtn: 'Supprimer',
      gridBtn: 'Grille',
      snapBtn: 'Aligner',
      fitBtn: 'Ajuster',
      exportJsonBtn: 'Exporter JSON',
      importJsonBtn: 'Importer JSON',
      statusRunning: 'En cours',
      statusPaused: 'En pause',
      statusStopped: 'Arrêté',
      statusComponents: 'Pièces',
      statusWires: 'Fils',
      statusTime: 'Temps',
      statusSelected: 'Sélection',
      noSelection: 'Aucun composant ou fil sélectionné.',
      selectHint: 'Cliquez sur un composant pour modifier ses paramètres et voir tension, courant et puissance.',
      openEncyclopedia: 'Voir l’encyclopédie',
      diagnosticsTitle: 'Diagnostics & Défauts',
      noDiagnostics: 'Aucune erreur ni alerte — circuit résolu.',
      nodeVoltagesTitle: 'Mesures nodales et branches',
      scopeTitle: 'Oscilloscope 2 voies (CH1 / CH2)',
      noScopeHint: 'Ajoutez un oscilloscope ou un circuit AC/transitoire pour afficher la courbe.',
      clearConfirmTitle: 'Vider tout l’espace de travail ?',
      clearConfirmDesc: 'Tous les composants et fils actuels seront supprimés (annulable via Annuler).',
      confirmBtn: 'Tout effacer',
      cancelBtn: 'Annuler',
    },
  },
};
