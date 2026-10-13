/**
 * Daily Editorial Hub - Main Application Script (Resourceful Edition)
 * Features:
 * - Multi-source Live RSS Fetching & Instant Refresh (The Indian Express, The Hindu, LiveMint, The Guardian, Nature, arXiv)
 * - 360° Analytical Dimensions Matrix (Economic, Governance, Social, Global)
 * - Actionable Way Forward & Policy Solutions
 * - Interactive 3D Vocabulary Flashcards with Spaced Repetition (Mastered vs. Review)
 * - Daily 5-Question MCQ Mock Quiz with Instant Scoring & Explanations
 * - In-App Personal Study Notes (auto-saved per article in localStorage)
 * - One-Click Markdown / Notion Exporter & Clean PDF/Print Handout
 * - Exam Knowledge Vault (Constitutional Articles, Landmark Judgments, Economic Terms)
 * - Web Speech API Text-to-Speech Audio Player with Adjustable Speeds
 * - Bookmarks, Date Navigator, Reader Modes (System, Light, Dark, Sepia Paper)
 */

// Predefined Monitored RSS Feeds
const DEFAULT_FEEDS = [
  {
    name: 'The Indian Express',
    url: 'https://indianexpress.com/section/opinion/editorials/feed/',
    category: 'Polity & Governance',
    icon: '📰',
    tone: 'Analytical'
  },
  {
    name: 'The Hindu',
    url: 'https://www.thehindu.com/opinion/editorial/feeder/default.rss',
    category: 'National Affairs',
    icon: '🇮🇳',
    tone: 'Balanced / Formal'
  },
  {
    name: 'LiveMint',
    url: 'https://www.livemint.com/rss/opinion',
    category: 'Economy & Banking',
    icon: '📊',
    tone: 'Economic / Analytical'
  },
  {
    name: 'The Guardian',
    url: 'https://www.theguardian.com/tone/editorials/rss',
    category: 'Global Affairs',
    icon: '🌍',
    tone: 'Progressive / Critical'
  },
  {
    name: 'Nature Research',
    url: 'https://www.nature.com/nature.rss',
    category: 'Science & Tech Digest',
    icon: '🔬',
    tone: 'Scientific / Peer-Reviewed'
  },
  {
    name: 'arXiv AI & CS',
    url: 'https://rss.arxiv.org/rss/cs.AI',
    category: 'Tech & AI Research',
    icon: '🤖',
    tone: 'Academic / Technical'
  },
  {
    name: 'News On AIR (Akashvani)',
    url: 'https://newsonair.gov.in/category/national/',
    category: 'National Affairs',
    icon: '🎙️',
    tone: 'Official / Public Broadcaster'
  }
];

// High-frequency Editorial & Academic Vocabulary Database
const VOCAB_DATABASE = {
  "exacerbate": { def: "To make a problem, bad situation, or negative feeling worse", pos: "Verb", synonyms: ["aggravate", "worsen", "inflame"], antonyms: ["alleviate", "ameliorate"] },
  "ameliorate": { def: "To make something bad or unsatisfactory better", pos: "Verb", synonyms: ["improve", "enhance", "better"], antonyms: ["worsen", "deteriorate"] },
  "contentious": { def: "Causing or likely to cause an argument; controversial", pos: "Adjective", synonyms: ["disputed", "controversial", "debated"], antonyms: ["uncontroversial", "peaceful"] },
  "pragmatic": { def: "Dealing with things sensibly and realistically based on practical considerations", pos: "Adjective", synonyms: ["practical", "sensible", "hardheaded"], antonyms: ["idealistic", "impractical"] },
  "imperative": { def: "Of vital importance; crucial or an essential priority", pos: "Adjective / Noun", synonyms: ["vital", "essential", "crucial"], antonyms: ["optional", "negligible"] },
  "tenuous": { def: "Very weak or slight; insubstantial", pos: "Adjective", synonyms: ["flimsy", "fragile", "shaky"], antonyms: ["strong", "robust", "firm"] },
  "scrutiny": { def: "Critical observation or thorough examination", pos: "Noun", synonyms: ["inspection", "examination", "audit"], antonyms: ["neglect", "glance"] },
  "unprecedented": { def: "Never done or known before", pos: "Adjective", synonyms: ["unparalleled", "novel", "groundbreaking"], antonyms: ["common", "customary"] },
  "bipartisan": { def: "Involving agreement or cooperation between opposing political parties", pos: "Adjective", synonyms: ["two-party", "coalition", "non-partisan"], antonyms: ["partisan", "sectarian"] },
  "fiscal": { def: "Relating to government revenue, taxes, and public spending", pos: "Adjective", synonyms: ["monetary", "financial", "budgetary"], antonyms: [] },
  "paradigm": { def: "A typical example or pattern of something; a framework of ideas", pos: "Noun", synonyms: ["model", "archetype", "framework"], antonyms: [] },
  "complacency": { def: "A feeling of smug or uncritical self-satisfaction with current conditions", pos: "Noun", synonyms: ["smugness", "self-satisfaction", "inertia"], antonyms: ["vigilance", "alertness"] },
  "disparity": { def: "A great difference or inequality", pos: "Noun", synonyms: ["imbalance", "discrepancy", "gap"], antonyms: ["parity", "equality", "similarity"] },
  "judicious": { def: "Having, showing, or done with good judgment or sense", pos: "Adjective", synonyms: ["prudent", "wise", "discreet"], antonyms: ["foolish", "imprudent", "rash"] },
  "calamitous": { def: "Catastrophic or disastrous", pos: "Adjective", synonyms: ["disastrous", "ruinous", "dire"], antonyms: ["beneficial", "advantageous"] },
  "ubiquitous": { def: "Present, appearing, or found everywhere", pos: "Adjective", synonyms: ["omnipresent", "pervasive", "everywhere"], antonyms: ["rare", "scarce"] },
  "mitigate": { def: "Make less severe, serious, or painful", pos: "Verb", synonyms: ["alleviate", "reduce", "diminish"], antonyms: ["aggravate", "intensify"] },
  "conundrum": { def: "A confusing and difficult problem or dilemma", pos: "Noun", synonyms: ["dilemma", "puzzle", "quandary"], antonyms: ["solution", "clarity"] },
  "sovereignty": { def: "Supreme authority; self-governing authority of a state", pos: "Noun", synonyms: ["autonomy", "independence", "self-governance"], antonyms: ["dependence", "subjugation"] },
  "resilience": { def: "The capacity to recover quickly from difficulties; systemic toughness", pos: "Noun", synonyms: ["toughness", "adaptability", "endurance"], antonyms: ["fragility", "vulnerability"] },
  "substantive": { def: "Having a firm basis in reality; meaningful, considerable", pos: "Adjective", synonyms: ["significant", "meaningful", "tangible"], antonyms: ["trivial", "inconsequential"] },
  "benchmark": { def: "A standard or point of reference against which things may be compared", pos: "Noun / Verb", synonyms: ["standard", "criterion", "gauge"], antonyms: [] },
  "equitable": { def: "Fair, impartial, and just to all parties", pos: "Adjective", synonyms: ["fair", "just", "unbiased"], antonyms: ["unfair", "inequitable", "biased"] },
  "stagnation": { def: "Prolonged period of little or no growth or progress", pos: "Noun", synonyms: ["slump", "downturn", "inactivity"], antonyms: ["growth", "boom", "vitality"] },
  "rigorous": { def: "Extremely thorough, exhaustive, and exacting", pos: "Adjective", synonyms: ["meticulous", "exacting", "stringent"], antonyms: ["lax", "careless", "superficial"] },
  "equilibrium": { def: "A state in which opposing forces or influences are balanced", pos: "Noun", synonyms: ["balance", "stability", "symmetry"], antonyms: ["imbalance", "instability"] }
};

// Application State
const state = {
  articles: [],
  filteredArticles: [],
  availableDates: [],
  selectedDate: null,
  selectedSource: 'all',
  selectedCategory: 'all',
  selectedGS: 'all',
  searchQuery: '',
  isFetchingLive: false,
  customFeeds: JSON.parse(localStorage.getItem('editorial-custom-feeds') || '[]'),
  bookmarks: new Set(JSON.parse(localStorage.getItem('editorial-bookmarks') || '[]')),
  masteredWords: new Set(JSON.parse(localStorage.getItem('editorial-mastered-words') || '[]')),
  currentArticle: null,
  streak: {
    current: 1,
    lastActiveDate: '',
    targets: {
      readCount: 0,
      flashcardsCount: 0,
      quizCompleted: false,
      answersCount: 0
    }
  },
  writingStudio: {
    timerInterval: null,
    totalSeconds: 420,
    remainingSeconds: 420,
    isRunning: false,
    targetWords: 150,
    currentQuestion: '',
    currentArticleId: '',
    currentArticleTitle: '',
    startTime: null,
    wordCount: 0
  },
  flashcards: {
    cards: [],
    filteredCards: [],
    currentIndex: 0,
    activeFilter: 'all'
  },
  quiz: {
    questions: [],
    currentIndex: 0,
    score: 0,
    answered: false
  },
  preferences: {
    theme: localStorage.getItem('editorial-theme') || 'system',
    font: localStorage.getItem('reader-font') || 'serif',
    size: localStorage.getItem('reader-size') || 'md',
    speechSpeed: parseFloat(localStorage.getItem('speech-speed') || '1.0')
  },
  tts: {
    synth: window.speechSynthesis || null,
    utterance: null,
    isSpeaking: false,
    isPaused: false
  },
  ca: {
    items: [],
    filteredItems: [],
    factCapsules: {},
    activeSubTab: 'vault',
    selectedCategory: 'all',
    selectedScope: 'all',
    selectedExam: 'all',
    selectedSource: 'all',
    searchQuery: '',
    activeCapsuleTab: 'appointments',
    quiz: {
      questions: [],
      currentIndex: 0,
      score: 0,
      answered: false,
      selectedOption: null
    },
    currentDetailItem: null,
    tts: {
      isSpeaking: false,
      utterance: null
    }
  }
};

// DOM Elements
const dom = {
  grid: document.getElementById('editorials-grid'),
  loading: document.getElementById('loading-spinner'),
  empty: document.getElementById('empty-state'),
  searchInput: document.getElementById('search-input'),
  clearSearchBtn: document.getElementById('clear-search-btn'),
  statCount: document.getElementById('stat-count'),
  statVocab: document.getElementById('stat-vocab'),
  statTime: document.getElementById('stat-time'),
  dateLabel: document.getElementById('current-date-label'),
  datePicker: document.getElementById('date-picker-input'),
  prevDateBtn: document.getElementById('prev-date-btn'),
  nextDateBtn: document.getElementById('next-date-btn'),
  todayBtn: document.getElementById('today-btn'),
  allDatesBtn: document.getElementById('all-dates-btn'),
  sourceFilters: document.getElementById('source-filters'),
  categoryFilters: document.getElementById('category-filters'),
  resultsCount: document.getElementById('results-count'),
  viewTitle: document.getElementById('view-title'),
  activeFiltersBar: document.getElementById('active-filters-bar'),
  activeFilterText: document.getElementById('active-filter-text'),
  resetFiltersBtn: document.getElementById('reset-filters-btn'),
  emptyResetBtn: document.getElementById('empty-reset-btn'),
  bookmarkBadge: document.getElementById('bookmark-badge'),
  bookmarksBtn: document.getElementById('bookmarks-btn'),
  bookmarksModal: document.getElementById('bookmarks-modal'),
  bookmarksList: document.getElementById('bookmarks-list'),
  closeBookmarksModal: document.getElementById('close-bookmarks-modal'),
  closeBookmarksBtn: document.getElementById('close-bookmarks-btn'),
  clearAllBookmarksBtn: document.getElementById('clear-all-bookmarks-btn'),
  vocabModalToggle: document.getElementById('vocab-bank-toggle'),
  vocabModal: document.getElementById('vocab-modal'),
  vocabDeckContainer: document.getElementById('vocab-deck-container'),
  closeVocabModal: document.getElementById('close-vocab-modal'),
  vocabModalDone: document.getElementById('vocab-modal-done'),
  openFlashcardsFromVocabBtn: document.getElementById('open-flashcards-from-vocab-btn'),
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  themeMenu: document.getElementById('theme-menu'),
  readerSettingsBtn: document.getElementById('reader-settings-btn'),
  settingsModal: document.getElementById('settings-modal'),
  closeSettingsModal: document.getElementById('close-settings-modal'),
  saveSettingsBtn: document.getElementById('save-settings-btn'),
  randomPickBtn: document.getElementById('random-pick-btn'),
  lastUpdatedText: document.getElementById('last-updated-text'),
  toast: document.getElementById('toast'),

  // Hub Tabs
  tabEditorials: document.getElementById('tab-editorials'),
  tabCA: document.getElementById('tab-ca'),
  tabFlashcards: document.getElementById('tab-flashcards'),
  tabQuiz: document.getElementById('tab-quiz'),
  tabVault: document.getElementById('tab-vault'),

  // View Containers
  editorialsViewContainer: document.getElementById('editorials-view-container'),
  caViewContainer: document.getElementById('current-affairs-view-container'),

  // Current Affairs 360° DOM Elements
  caStatTotal: document.getElementById('ca-stat-total'),
  caStatVault: document.getElementById('ca-stat-vault'),
  caStatDaily: document.getElementById('ca-stat-daily'),
  caStatCapsules: document.getElementById('ca-stat-capsules'),
  caSyncLiveBtn: document.getElementById('ca-sync-live-btn'),
  caSyncSpinner: document.getElementById('ca-sync-spinner'),
  caSyncLabel: document.getElementById('ca-sync-label'),
  caExportBtn: document.getElementById('ca-export-btn'),
  caPrintBtn: document.getElementById('ca-print-btn'),
  caUpdatePill: document.getElementById('ca-update-pill'),

  caSubtabVault: document.getElementById('ca-subtab-vault'),
  caSubtabDaily: document.getElementById('ca-subtab-daily'),
  caSubtabCapsules: document.getElementById('ca-subtab-capsules'),
  caSubtabQuiz: document.getElementById('ca-subtab-quiz'),

  caDossierPane: document.getElementById('ca-dossier-pane'),
  caCapsulesPane: document.getElementById('ca-capsules-pane'),
  caQuizPane: document.getElementById('ca-quiz-pane'),
  caFilterSection: document.getElementById('ca-filter-section'),

  caSearchInput: document.getElementById('ca-search-input'),
  caClearSearchBtn: document.getElementById('ca-clear-search-btn'),
  caSourceFilters: document.getElementById('ca-source-filters'),
  caScopeFilters: document.getElementById('ca-scope-filters'),
  caExamFilters: document.getElementById('ca-exam-filters'),
  caCategoryFilters: document.getElementById('ca-category-filters'),
  caActiveFiltersBar: document.getElementById('ca-active-filters-bar'),
  caActiveFilterText: document.getElementById('ca-active-filter-text'),
  caResetFiltersBtn: document.getElementById('ca-reset-filters-btn'),
  caEmptyResetBtn: document.getElementById('ca-empty-reset-btn'),

  caViewTitle: document.getElementById('ca-view-title'),
  caResultsCount: document.getElementById('ca-results-count'),
  caLoadingSpinner: document.getElementById('ca-loading-spinner'),
  caEmptyState: document.getElementById('ca-empty-state'),
  caGrid: document.getElementById('ca-grid'),

  caCapsulesContainer: document.getElementById('ca-capsules-container'),
  caQuizCardWrapper: document.getElementById('ca-quiz-card-wrapper'),

  caDetailModal: document.getElementById('ca-detail-modal'),
  closeCaDetailModal: document.getElementById('close-ca-detail-modal'),
  caDetailCatBadge: document.getElementById('ca-detail-cat-badge'),
  caDetailScopeBadge: document.getElementById('ca-detail-scope-badge'),
  caDetailDate: document.getElementById('ca-detail-date'),
  caDetailTitle: document.getElementById('ca-detail-title'),
  caDetailTtsBtn: document.getElementById('ca-detail-tts-btn'),
  caDetailTtsStop: document.getElementById('ca-detail-tts-stop'),
  caTtsIcon: document.getElementById('ca-tts-icon'),
  caTtsLabel: document.getElementById('ca-tts-label'),
  caDetailSource: document.getElementById('ca-detail-source'),
  caDetailCrux: document.getElementById('ca-detail-crux'),
  caDetailTakeaways: document.getElementById('ca-detail-takeaways'),
  caDetailAgency: document.getElementById('ca-detail-agency'),
  caDetailStatute: document.getElementById('ca-detail-statute'),
  caDetailLocation: document.getElementById('ca-detail-location'),
  caDetailFacts: document.getElementById('ca-detail-facts'),
  caDetailMcqBox: document.getElementById('ca-detail-mcq-box'),
  caDetailNotesInput: document.getElementById('ca-detail-notes-input'),
  caNotesStatus: document.getElementById('ca-notes-status'),
  caDetailExportMd: document.getElementById('ca-detail-export-md'),
  caDetailSourceLink: document.getElementById('ca-detail-source-link'),

  // RSS Manager Elements
  refreshFeedsBtn: document.getElementById('refresh-feeds-btn'),
  refreshSpinnerIcon: document.getElementById('refresh-spinner-icon'),
  refreshLabel: document.getElementById('refresh-label'),
  liveStatusPill: document.getElementById('live-status-pill'),
  liveStatusText: document.getElementById('live-status-text'),
  rssManagerBtn: document.getElementById('rss-manager-btn'),
  rssModal: document.getElementById('rss-modal'),
  closeRssModal: document.getElementById('close-rss-modal'),
  rssModalDone: document.getElementById('rss-modal-done'),
  modalFetchAllBtn: document.getElementById('modal-fetch-all-btn'),
  modalSpinnerIcon: document.getElementById('modal-spinner-icon'),
  rssFeedList: document.getElementById('rss-feed-list'),
  customFeedName: document.getElementById('custom-feed-name'),
  customFeedUrl: document.getElementById('custom-feed-url'),
  customFeedCat: document.getElementById('custom-feed-cat'),
  addCustomFeedBtn: document.getElementById('add-custom-feed-btn'),

  // Flashcards Modal Elements
  flashcardModal: document.getElementById('flashcard-modal'),
  closeFlashcardModal: document.getElementById('close-flashcard-modal'),
  fcTotalCount: document.getElementById('fc-total-count'),
  fcLearningCount: document.getElementById('fc-learning-count'),
  fcMasteredCount: document.getElementById('fc-mastered-count'),
  fcProgressLabel: document.getElementById('fc-progress-label'),
  fcProgressBar: document.getElementById('fc-progress-bar'),
  flashcardScene: document.getElementById('flashcard-scene'),
  flashcardCard: document.getElementById('flashcard-card'),
  fcFrontWord: document.getElementById('fc-front-word'),
  fcFrontPos: document.getElementById('fc-front-pos'),
  fcFrontExample: document.getElementById('fc-front-example'),
  fcBackPos: document.getElementById('fc-back-pos'),
  fcBackDef: document.getElementById('fc-back-def'),
  fcBackSynonyms: document.getElementById('fc-back-synonyms'),
  fcBackAntonyms: document.getElementById('fc-back-antonyms'),
  fcPrevBtn: document.getElementById('fc-prev-btn'),
  fcNextBtn: document.getElementById('fc-next-btn'),
  fcMarkReviewBtn: document.getElementById('fc-mark-review-btn'),
  fcMarkMasterBtn: document.getElementById('fc-mark-master-btn'),
  fcCounterText: document.getElementById('fc-counter-text'),

  // Quiz Modal Elements
  quizModal: document.getElementById('quiz-modal'),
  closeQuizModal: document.getElementById('close-quiz-modal'),
  quizActiveView: document.getElementById('quiz-active-view'),
  quizSummaryView: document.getElementById('quiz-summary-view'),
  quizQNum: document.getElementById('quiz-q-num'),
  quizScorePill: document.getElementById('quiz-score-pill'),
  quizQuestionText: document.getElementById('quiz-question-text'),
  quizOptionsList: document.getElementById('quiz-options-list'),
  quizExplanationBox: document.getElementById('quiz-explanation-box'),
  quizExplBadge: document.getElementById('quiz-expl-badge'),
  quizExplanationText: document.getElementById('quiz-explanation-text'),
  quizNextBtn: document.getElementById('quiz-next-btn'),
  resultsScoreDisplay: document.getElementById('results-score-display'),
  resultsFeedbackText: document.getElementById('results-feedback-text'),
  retakeQuizBtn: document.getElementById('retake-quiz-btn'),

  // Knowledge Vault Elements
  knowledgeVaultModal: document.getElementById('knowledge-vault-modal'),
  closeVaultModal: document.getElementById('close-vault-modal'),
  vaultModalDone: document.getElementById('vault-modal-done'),

  // Reader Modal Elements
  readerModal: document.getElementById('reader-modal'),
  readerCloseBtn: document.getElementById('reader-close-btn'),
  readerBackBottomBtn: document.getElementById('reader-back-bottom-btn'),
  readerSourceBadge: document.getElementById('reader-source-badge'),
  readerDate: document.getElementById('reader-date'),
  readerCatTag: document.getElementById('reader-cat-tag'),
  readerToneTag: document.getElementById('reader-tone-tag'),
  readerTimeTag: document.getElementById('reader-time-tag'),
  readerTitle: document.getElementById('reader-title'),
  readerSourceName: document.getElementById('reader-source-name'),
  readerExternalLink: document.getElementById('reader-external-link'),
  readerBottomLink: document.getElementById('reader-bottom-link'),
  readerCrux: document.getElementById('reader-crux'),
  readerTakeawaysList: document.getElementById('reader-takeaways-list'),
  readerDimensionsGrid: document.getElementById('reader-dimensions-grid'),
  readerWayForwardList: document.getElementById('reader-way-forward-list'),
  readerVocabGrid: document.getElementById('reader-vocab-grid'),
  readerRelevanceTag: document.getElementById('reader-relevance-tag'),
  readerQuestionText: document.getElementById('reader-question-text'),
  readerNotesInput: document.getElementById('reader-notes-input'),
  notesStatusBadge: document.getElementById('notes-status-badge'),
  readerBodyParagraphs: document.getElementById('reader-body-paragraphs'),
  readerQuizSection: document.getElementById('reader-quiz-section'),
  readerQuizCard: document.getElementById('reader-quiz-card'),
  readerBookmarkBtn: document.getElementById('reader-bookmark-btn'),
  readerExportBtn: document.getElementById('reader-export-btn'),
  readerPrintBtn: document.getElementById('reader-print-btn'),
  readerShareBtn: document.getElementById('reader-share-btn'),
  readerFontToggle: document.getElementById('reader-font-toggle'),
  copyQuestionBtn: document.getElementById('copy-question-btn'),

  // Audio / TTS
  ttsPlayBtn: document.getElementById('tts-play-btn'),
  ttsStopBtn: document.getElementById('tts-stop-btn'),
  ttsIcon: document.getElementById('tts-icon'),
  ttsLabel: document.getElementById('tts-label'),
  ttsSpeedBadge: document.getElementById('tts-speed-badge'),

  // Streak & Habit Tracker Elements
  streakTrackerBtn: document.getElementById('streak-tracker-btn'),
  streakCountBadge: document.getElementById('streak-count-badge'),
  streakModal: document.getElementById('streak-modal'),
  closeStreakModal: document.getElementById('close-streak-modal'),
  streakModalDone: document.getElementById('streak-modal-done'),
  resetStreakBtn: document.getElementById('reset-streak-btn'),
  streakHeroDays: document.getElementById('streak-hero-days'),
  streakProgressPct: document.getElementById('streak-progress-pct'),
  streakProgressBar: document.getElementById('streak-progress-bar'),
  streakMotivationalTitle: document.getElementById('streak-motivational-title'),
  streakMotivationalMsg: document.getElementById('streak-motivational-msg'),
  goalReadItem: document.getElementById('goal-read-item'),
  goalReadIcon: document.getElementById('goal-read-icon'),
  goalReadCount: document.getElementById('goal-read-count'),
  goalFlashcardItem: document.getElementById('goal-flashcard-item'),
  goalFlashcardIcon: document.getElementById('goal-flashcard-icon'),
  goalFlashcardCount: document.getElementById('goal-flashcard-count'),
  goalQuizItem: document.getElementById('goal-quiz-item'),
  goalQuizIcon: document.getElementById('goal-quiz-icon'),
  goalQuizCount: document.getElementById('goal-quiz-count'),
  goalWritingItem: document.getElementById('goal-writing-item'),
  goalWritingIcon: document.getElementById('goal-writing-icon'),
  goalWritingCount: document.getElementById('goal-writing-count'),

  // Answer Writing Studio Elements
  tabWriting: document.getElementById('tab-writing'),
  openWritingStudioBtn: document.getElementById('open-writing-studio-btn'),
  writingStudioModal: document.getElementById('writing-studio-modal'),
  closeWritingModal: document.getElementById('close-writing-modal'),
  writingArticleRef: document.getElementById('writing-article-ref'),
  writingTimerClock: document.getElementById('writing-timer-clock'),
  writingTimerToggleBtn: document.getElementById('writing-timer-toggle-btn'),
  writingTimerResetBtn: document.getElementById('writing-timer-reset-btn'),
  writingQuestionDisplay: document.getElementById('writing-question-display'),
  writingEditorInput: document.getElementById('writing-editor-input'),
  writingWordCount: document.getElementById('writing-word-count'),
  writingTargetWords: document.getElementById('writing-target-words'),
  writingWpmCount: document.getElementById('writing-wpm-count'),
  writingSaveStatus: document.getElementById('writing-save-status'),
  writingInsertFrameworkBtn: document.getElementById('writing-insert-framework-btn'),
  writingClearBtn: document.getElementById('writing-clear-btn'),
  writingCopyBtn: document.getElementById('writing-copy-btn'),
  writingExportBtn: document.getElementById('writing-export-btn'),
  writingSaveDoneBtn: document.getElementById('writing-save-done-btn'),

  // Dual Comparison Elements
  tabCompare: document.getElementById('tab-compare'),
  compareModalBtn: document.getElementById('compare-modal-btn'),
  compareModal: document.getElementById('compare-modal'),
  closeCompareModal: document.getElementById('close-compare-modal'),
  compareModalDone: document.getElementById('compare-modal-done'),
  compareSelectLeft: document.getElementById('compare-select-left'),
  compareSelectRight: document.getElementById('compare-select-right'),
  compareColLeft: document.getElementById('compare-col-left'),
  compareColRight: document.getElementById('compare-col-right'),
  syncScrollToggle: document.getElementById('sync-scroll-toggle'),

  // Mind Map Elements
  readerMindmapSection: document.getElementById('reader-mindmap-section'),
  readerMindmapContainer: document.getElementById('reader-mindmap-container'),
  toggleMindmapLayoutBtn: document.getElementById('toggle-mindmap-layout-btn'),

  // Highlight Toolbar
  highlightToolbar: document.getElementById('highlight-toolbar'),

  // GS Filters
  gsFilters: document.getElementById('gs-filters')
};

/**
 * Initialize Application
 */
async function init() {
  applySavedPreferences();
  initStudyStreak();
  registerServiceWorker();
  initTextHighlighter();
  setupEventListeners();
  updateBookmarkBadge();
  renderRssFeedsManager();
  await loadEditorialData();
  await loadCurrentAffairsData();
  handleUrlHashRouting();
}

/**
 * Fetch and load initial JSON data from data/editorials.json and merge local live cache
 */
async function loadEditorialData() {
  dom.loading.style.display = 'block';
  dom.grid.innerHTML = '';
  
  try {
    const res = await fetch('data/editorials.json');
    let baseArticles = [];
    if (res.ok) {
      const data = await res.json();
      baseArticles = data.articles || [];
      if (data.last_updated && dom.lastUpdatedText) {
        dom.lastUpdatedText.textContent = `Dataset: Updated ${data.last_updated}`;
      }
    }

    const liveCache = JSON.parse(localStorage.getItem('editorial-live-cache') || '[]');
    const existingIds = new Set(baseArticles.map(a => a.id));
    const existingUrls = new Set(baseArticles.map(a => a.url).filter(Boolean));

    const merged = [...liveCache.filter(a => !existingIds.has(a.id) && !existingUrls.has(a.url)), ...baseArticles];
    state.articles = merged;

    refreshDateList();
    applyFilters();
    buildFlashcardDeck();
  } catch (err) {
    console.error('Error loading editorials data:', err);
    dom.empty.style.display = 'block';
  } finally {
    dom.loading.style.display = 'none';
  }
}

function refreshDateList() {
  const dateSet = new Set(state.articles.map(a => a.date).filter(Boolean));
  state.availableDates = Array.from(dateSet).sort().reverse();

  if (state.availableDates.length > 0 && !state.selectedDate) {
    state.selectedDate = state.availableDates[0];
  }
}

/**
 * Live RSS Fetcher: Queries live RSS feeds in real-time
 */
async function fetchLiveRSSFeeds() {
  if (state.isFetchingLive) return;
  state.isFetchingLive = true;

  if (dom.refreshSpinnerIcon) dom.refreshSpinnerIcon.classList.add('spinning');
  if (dom.modalSpinnerIcon) dom.modalSpinnerIcon.classList.add('spinning');
  if (dom.refreshLabel) dom.refreshLabel.textContent = 'Syncing...';
  if (dom.liveStatusText) dom.liveStatusText.textContent = 'Syncing Live Feeds...';

  showToast('📡 Connecting to live newspaper RSS feeds...');

  const allFeeds = [...DEFAULT_FEEDS, ...state.customFeeds];
  let newArticlesAdded = 0;
  const existingIds = new Set(state.articles.map(a => a.id));
  const existingUrls = new Set(state.articles.map(a => a.url).filter(Boolean));
  const newItems = [];

  const promises = allFeeds.map(async (feed) => {
    try {
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status !== 'ok' || !Array.isArray(data.items)) return;

      data.items.slice(0, 8).forEach(item => {
        const rawTitle = cleanHtml(item.title || '');
        const cleanTitle = rawTitle.replace(/\s*\|\s*(?:Editorial|The Hindu|Opinion|LiveMint).*$/i, '').trim();
        const link = (item.link || '').trim();
        if (!cleanTitle || !link) return;

        const slug = `${feed.name}-${cleanTitle}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 70);
        if (existingIds.has(slug) || existingUrls.has(link)) return;

        const rawContent = cleanHtml(item.description || item.content || '');
        const dateStr = parseItemDate(item.pubDate);
        const category = deriveCategory(cleanTitle, feed.category);
        const readingTime = calculateReadingTime(rawContent.length > 200 ? rawContent : cleanTitle.repeat(10));
        const vocab = extractVocab(rawContent + ' ' + cleanTitle);
        const { takeaways, question, gsTag } = generateTakeaways(cleanTitle, rawContent, category, feed.name);
        const dimensions = generateDimensions(cleanTitle, category);
        const wayForward = generateWayForward(cleanTitle, category);
        const quiz = generateQuizObj(cleanTitle, vocab, category);

        const articleObj = {
          id: slug,
          title: cleanTitle,
          source: feed.name,
          source_type: feed.name.includes('arXiv') || feed.name.includes('Nature') ? 'Research Paper Digest' : 'Newspaper Editorial',
          icon: feed.icon || '📰',
          category: category,
          date: dateStr,
          url: link,
          reading_time: readingTime,
          tone: feed.tone || 'Analytical',
          crux: takeaways[0] || (rawContent.slice(0, 140) + '...'),
          takeaways: takeaways,
          dimensions: dimensions,
          way_forward: wayForward,
          vocabulary: vocab,
          quiz: quiz,
          practice_question: question,
          relevance_tag: gsTag,
          content: rawContent.length > 150 ? rawContent : `Analysis of "${cleanTitle}" published in ${feed.name}. Full editorial text and commentary available at original source.`
        };

        newItems.push(articleObj);
        existingIds.add(slug);
        existingUrls.add(link);
        newArticlesAdded++;
      });
    } catch (err) {
      console.warn(`Could not sync live feed for ${feed.name}:`, err);
    }
  });

  await Promise.allSettled(promises);

  if (newArticlesAdded > 0) {
    state.articles = [...newItems, ...state.articles];
    state.articles.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    const liveCache = JSON.parse(localStorage.getItem('editorial-live-cache') || '[]');
    const updatedCache = [...newItems, ...liveCache].slice(0, 70);
    localStorage.setItem('editorial-live-cache', JSON.stringify(updatedCache));

    refreshDateList();
    applyFilters();
    buildFlashcardDeck();
    showToast(`✅ Synced ${newArticlesAdded} fresh editorials from live RSS!`);
  } else {
    showToast('✨ All feeds are already up-to-date!');
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (dom.liveStatusText) {
    dom.liveStatusText.textContent = `Synced Just Now (${timeStr})`;
  }

  state.isFetchingLive = false;
  if (dom.refreshSpinnerIcon) dom.refreshSpinnerIcon.classList.remove('spinning');
  if (dom.modalSpinnerIcon) dom.modalSpinnerIcon.classList.remove('spinning');
  if (dom.refreshLabel) dom.refreshLabel.textContent = 'Refresh Feeds';
}

function deriveCategory(title, defaultCat) {
  const t = title.toLowerCase();
  if (/\b(bank|inflation|gdp|tax|trade|budget|rbi|rupee|fiscal)\b/.test(t)) return 'Economy & Banking';
  if (/\b(court|bill|election|parliament|law|governance|democracy|judge|justice)\b/.test(t)) return 'Polity & Governance';
  if (/\b(climate|green|carbon|water|flood|forest|emission|monsoon)\b/.test(t)) return 'Environment & Climate';
  if (/\b(ai|chip|quantum|tech|digital|cyber|neural|robot|computing)\b/.test(t)) return 'Tech & AI Research';
  if (/\b(science|biology|physics|cell|protein|genetics|vaccine|space)\b/.test(t)) return 'Science & Tech Digest';
  if (/\b(war|un|treaty|diplomacy|china|us|border|russia|israel|gaza|nato)\b/.test(t)) return 'Global Affairs';
  return defaultCat || 'National Affairs';
}

function parseItemDate(pubDateStr) {
  if (!pubDateStr) return new Date().toISOString().split('T')[0];
  try {
    const dt = new Date(pubDateStr);
    if (!isNaN(dt.getTime())) {
      return dt.toISOString().split('T')[0];
    }
  } catch (e) {}
  return new Date().toISOString().split('T')[0];
}

function generateTakeaways(title, content, category, source) {
  const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 25);
  let takeaways = [];
  if (sentences.length >= 3) {
    takeaways = [sentences[0] + '.', sentences[Math.floor(sentences.length / 2)] + '.', sentences[sentences.length - 1] + '.'];
  } else if (sentences.length > 0) {
    takeaways = sentences.slice(0, 3).map(s => s + '.');
  } else {
    takeaways = [
      `Examines critical policy shifts regarding ${title}.`,
      `Synthesizes structural and institutional challenges within ${category}.`,
      `Stresses the imperative for proactive governance and evidence-based interventions.`
    ];
  }

  const cleanT = title.split(':')[0].trim();
  let question = '';
  let gsTag = '';

  if (category.includes('Tech') || category.includes('AI') || category.includes('Science')) {
    question = `Critically analyze how developments in '${cleanT}' transform current technological and scientific paradigms. What ethical safeguards and regulatory frameworks are necessary?`;
    gsTag = 'GS Paper 3: Science & Technology, AI Ethics';
  } else if (category.includes('Economy')) {
    question = `Evaluate the macroeconomic stability implications highlighted in '${cleanT}'. Suggest fiscal and policy interventions to foster long-term inclusive growth.`;
    gsTag = 'GS Paper 3: Indian Economy & Macroeconomic Stability';
  } else if (category.includes('Global')) {
    question = `In light of '${cleanT}', analyze the evolving geopolitical equilibrium. How should policymakers balance national strategic autonomy with international engagements?`;
    gsTag = 'GS Paper 2: International Relations & Geopolitics';
  } else {
    question = `Discuss the constitutional and governance dimensions raised in '${cleanT}'. What institutional reforms are imperative to enhance transparency and public accountability?`;
    gsTag = 'GS Paper 2: Governance, Constitution & Public Policy';
  }

  return { takeaways, question, gsTag };
}

function generateDimensions(title, category) {
  const cleanT = title.split(':')[0].trim();
  return {
    economic: `Macroeconomic impacts, capital allocation efficiency, and fiscal viability concerning ${cleanT}.`,
    governance: `Regulatory oversight, institutional accountability, and rule-of-law adherence.`,
    social: `Distributive equity, citizen empowerment, accessibility, and public trust.`,
    global: `Multilateral commitments, trade alignments, and global benchmark comparisons.`
  };
}

function generateWayForward(title, category) {
  return [
    `Institute evidence-based consultations with technical experts and civil society before statutory rollouts.`,
    `Establish robust digital oversight and audit mechanisms to mitigate implementation bottlenecks.`,
    `Balance immediate crisis management with long-term institutional resilience.`
  ];
}

function generateQuizObj(title, vocab, category) {
  if (vocab && vocab.length > 0) {
    const v = vocab[0];
    return {
      question: `In the context of the editorial on '${title.split(':')[0]}', what is the meaning of '${v.word}'?`,
      options: [
        v.definition,
        "A formal judicial decree with nationwide authority",
        "A temporary procedural suspension of operations",
        "Total uncritical complacency with the status quo"
      ],
      answer: 0,
      explanation: `'${v.word}' (${v.pos}) means: ${v.definition}. Synonyms include ${v.synonyms.join(', ')}.`
    };
  }
  return {
    question: `What is the primary policy thrust of the editorial on '${title.split(':')[0]}'?`,
    options: [
      `Addressing structural bottlenecks and prioritizing institutional reforms`,
      `Restricting international diplomatic interactions completely`,
      `Abolishing existing administrative accountability frameworks`,
      `Halting digital transformation programs indefinitely`
    ],
    answer: 0,
    explanation: `The analysis focuses on resolving core structural challenges and instituting evidence-based reforms.`
  };
}

function extractVocab(text) {
  const found = [];
  const textLower = text.toLowerCase();
  for (const [word, details] of Object.entries(VOCAB_DATABASE)) {
    const reg = new RegExp(`\\b${word}(?:s|ed|ing|tion|ly)?\\b`, 'i');
    if (reg.test(textLower)) {
      found.push({
        word: word.charAt(0).toUpperCase() + word.slice(1),
        pos: details.pos,
        definition: details.def,
        synonyms: details.synonyms,
        antonyms: details.antonyms || [],
        example: `Effective policy intervention is necessary to ${word} systemic bottlenecks.`
      });
      if (found.length >= 4) break;
    }
  }

  if (found.length < 3) {
    const keys = Object.keys(VOCAB_DATABASE);
    const hash = Math.abs(hashCode(text));
    for (let i = 0; i < 3 - found.length; i++) {
      const w = keys[(hash + i * 5) % keys.length];
      const d = VOCAB_DATABASE[w];
      found.push({
        word: w.charAt(0).toUpperCase() + w.slice(1),
        pos: d.pos,
        definition: d.def,
        synonyms: d.synonyms,
        antonyms: d.antonyms || [],
        example: `Governance requires ${w} approaches to sustain administrative momentum.`
      });
    }
  }

  return found;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function renderRssFeedsManager() {
  if (!dom.rssFeedList) return;
  dom.rssFeedList.innerHTML = '';

  const allFeeds = [...DEFAULT_FEEDS, ...state.customFeeds];
  allFeeds.forEach((f, idx) => {
    const item = document.createElement('div');
    item.className = 'rss-feed-item';
    const isCustom = idx >= DEFAULT_FEEDS.length;

    item.innerHTML = `
      <div class="rss-feed-meta">
        <span class="rss-feed-name">${f.icon || '📰'} ${escapeHtml(f.name)}</span>
        <span class="rss-feed-url">${escapeHtml(f.url)}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="rss-feed-status">● Live</span>
        ${isCustom ? `<button class="btn-card-icon" data-custom-idx="${idx - DEFAULT_FEEDS.length}" title="Remove custom feed">✕</button>` : ''}
      </div>
    `;

    if (isCustom) {
      item.querySelector('button').addEventListener('click', () => {
        state.customFeeds.splice(idx - DEFAULT_FEEDS.length, 1);
        localStorage.setItem('editorial-custom-feeds', JSON.stringify(state.customFeeds));
        renderRssFeedsManager();
        showToast('Custom feed removed');
      });
    }

    dom.rssFeedList.appendChild(item);
  });
}

/**
 * Filter and Grid Rendering
 */
function applyFilters() {
  let filtered = [...state.articles];

  if (state.selectedDate && state.selectedDate !== 'all') {
    filtered = filtered.filter(a => a.date === state.selectedDate);
    dom.dateLabel.textContent = formatDateHuman(state.selectedDate);
  } else {
    dom.dateLabel.textContent = 'All Dates Archive';
  }

  if (state.selectedSource !== 'all') {
    filtered = filtered.filter(a => a.source === state.selectedSource);
  }

  if (state.selectedCategory !== 'all') {
    filtered = filtered.filter(a => a.category === state.selectedCategory);
  }

  if (state.selectedGS && state.selectedGS !== 'all') {
    const gsTarget = state.selectedGS.toUpperCase();
    filtered = filtered.filter(a => {
      const rel = (a.relevance_tag || '').toUpperCase();
      if (rel.includes(gsTarget)) return true;
      const cat = (a.category || '').toLowerCase();
      if (gsTarget === 'GS-1' && (cat.includes('history') || cat.includes('geography') || cat.includes('society') || cat.includes('social'))) return true;
      if (gsTarget === 'GS-2' && (cat.includes('polity') || cat.includes('governance') || cat.includes('national') || cat.includes('global') || cat.includes('international'))) return true;
      if (gsTarget === 'GS-3' && (cat.includes('economy') || cat.includes('banking') || cat.includes('science') || cat.includes('tech') || cat.includes('environment'))) return true;
      if (gsTarget === 'GS-4' && (cat.includes('ethics') || cat.includes('integrity') || cat.includes('attitude') || cat.includes('philosophy'))) return true;
      return false;
    });
  }

  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(a => {
      const inTitle = (a.title || '').toLowerCase().includes(q);
      const inCrux = (a.crux || '').toLowerCase().includes(q);
      const inContent = (a.content || '').toLowerCase().includes(q);
      const inCat = (a.category || '').toLowerCase().includes(q);
      const inSource = (a.source || '').toLowerCase().includes(q);
      const inVocab = (a.vocabulary || []).some(v => 
        (v.word || '').toLowerCase().includes(q) || 
        (v.definition || '').toLowerCase().includes(q)
      );
      return inTitle || inCrux || inContent || inCat || inSource || inVocab;
    });
  }

  state.filteredArticles = filtered;
  renderArticles();
  renderStats();
  updateFilterBarUI();
}

function renderArticles() {
  dom.grid.innerHTML = '';
  const list = state.filteredArticles;

  dom.resultsCount.textContent = `Showing ${list.length} article${list.length === 1 ? '' : 's'}`;

  if (list.length === 0) {
    dom.empty.style.display = 'block';
    return;
  }

  dom.empty.style.display = 'none';

  list.forEach(article => {
    const card = document.createElement('article');
    card.className = 'editorial-card';
    card.setAttribute('data-id', article.id);

    const isBookmarked = state.bookmarks.has(article.id);
    const vocabChips = (article.vocabulary || []).slice(0, 3).map(v => 
      `<span class="vocab-mini-chip">${escapeHtml(v.word)}</span>`
    ).join(' ');

    card.innerHTML = `
      <div class="card-header-meta">
        <span class="source-badge">${article.icon || '📰'} ${escapeHtml(article.source)}</span>
        <span class="card-time-tag">${escapeHtml(article.reading_time || '2 min read')}</span>
      </div>

      <div class="card-tags-row">
        <span class="cat-pill">${escapeHtml(article.category)}</span>
        <span class="tone-pill">${escapeHtml(article.tone || 'Analytical')}</span>
      </div>

      <h3 class="card-title">${escapeHtml(article.title)}</h3>
      
      <p class="card-crux">${escapeHtml(article.crux || '')}</p>

      ${vocabChips ? `
        <div class="card-vocab-preview">
          <span class="vocab-preview-label">Vocab:</span>
          ${vocabChips}
        </div>
      ` : ''}

      <div class="card-relevance-chip">
        <span>🎯</span> ${escapeHtml(article.relevance_tag ? article.relevance_tag.split(':')[0] : 'Exam Relevance')}
      </div>

      <div class="card-actions-row">
        <button class="btn-read-card" data-action="read" data-id="${article.id}">
          Read Editorial →
        </button>
        <button class="btn-card-icon" data-action="listen" data-id="${article.id}" title="Quick Listen">
          🎧
        </button>
        <button class="btn-card-icon ${isBookmarked ? 'active' : ''}" data-action="bookmark" data-id="${article.id}" title="Bookmark">
          ${isBookmarked ? '★' : '☆'}
        </button>
      </div>
    `;

    card.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (btn) {
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if (action === 'read') {
          openReader(id);
        } else if (action === 'listen') {
          openReader(id, true);
        } else if (action === 'bookmark') {
          toggleBookmark(id);
        }
      } else {
        openReader(article.id);
      }
    });

    dom.grid.appendChild(card);
  });
}

function renderStats() {
  const articlesToCount = state.selectedDate && state.selectedDate !== 'all'
    ? state.articles.filter(a => a.date === state.selectedDate)
    : state.articles;

  dom.statCount.textContent = articlesToCount.length;

  let totalVocab = 0;
  let totalMinutes = 0;

  articlesToCount.forEach(a => {
    totalVocab += (a.vocabulary || []).length;
    const timeMatch = (a.reading_time || '').match(/(\d+)/);
    totalMinutes += timeMatch ? parseInt(timeMatch[1], 10) : 2;
  });

  dom.statVocab.textContent = totalVocab;
  dom.statTime.textContent = `${totalMinutes} min`;
}

/**
 * Open Immersive Editorial Reader View
 */
function openReader(articleId, autoPlayAudio = false) {
  const article = state.articles.find(a => a.id === articleId);
  if (!article) return;

  state.currentArticle = article;
  window.location.hash = `article-${article.id}`;

  dom.readerSourceBadge.textContent = `${article.icon || '📰'} ${article.source}`;
  dom.readerDate.textContent = formatDateHuman(article.date);
  dom.readerCatTag.textContent = article.category;
  dom.readerToneTag.textContent = article.tone || 'Analytical';
  dom.readerTimeTag.textContent = `⏱ ${article.reading_time || '2 min read'}`;
  dom.readerTitle.textContent = article.title;
  dom.readerSourceName.textContent = article.source;
  
  dom.readerExternalLink.href = article.url || '#';
  dom.readerBottomLink.href = article.url || '#';

  dom.readerCrux.textContent = article.crux || 'Crux summary not available.';

  // 1. Takeaways
  dom.readerTakeawaysList.innerHTML = (article.takeaways || []).map(t => 
    `<li>${escapeHtml(t)}</li>`
  ).join('');

  // 2. 360° Analytical Dimensions Matrix
  const dims = article.dimensions || generateDimensions(article.title, article.category);
  dom.readerDimensionsGrid.innerHTML = `
    <div class="dim-card dim-economic">
      <div class="dim-card-header"><span>💰</span> Economic Dimension</div>
      <p class="dim-card-text">${escapeHtml(dims.economic)}</p>
    </div>
    <div class="dim-card dim-governance">
      <div class="dim-card-header"><span>⚖️</span> Governance & Policy</div>
      <p class="dim-card-text">${escapeHtml(dims.governance)}</p>
    </div>
    <div class="dim-card dim-social">
      <div class="dim-card-header"><span>👥</span> Social & Equity</div>
      <p class="dim-card-text">${escapeHtml(dims.social)}</p>
    </div>
    <div class="dim-card dim-global">
      <div class="dim-card-header"><span>🌐</span> Global & Strategic</div>
      <p class="dim-card-text">${escapeHtml(dims.global)}</p>
    </div>
  `;

  // 3. Actionable Way Forward
  const wayForward = article.way_forward || generateWayForward(article.title, article.category);
  dom.readerWayForwardList.innerHTML = wayForward.map(wf => `<li>${escapeHtml(wf)}</li>`).join('');

  // 4. Vocabulary Cards
  dom.readerVocabGrid.innerHTML = (article.vocabulary || []).map(v => `
    <div class="vocab-card">
      <div class="vocab-head">
        <span class="vocab-word">${escapeHtml(v.word)}</span>
        <span class="vocab-pos">${escapeHtml(v.pos || '')}</span>
      </div>
      <p class="vocab-def">${escapeHtml(v.definition)}</p>
      ${v.synonyms && v.synonyms.length > 0 ? `
        <div class="vocab-synonyms"><strong>Synonyms:</strong> ${escapeHtml(v.synonyms.join(', '))}</div>
      ` : ''}
      ${v.antonyms && v.antonyms.length > 0 ? `
        <div class="vocab-synonyms"><strong>Antonyms:</strong> ${escapeHtml(v.antonyms.join(', '))}</div>
      ` : ''}
      ${v.example ? `
        <div class="vocab-example">"${escapeHtml(v.example)}"</div>
      ` : ''}
    </div>
  `).join('');

  // 5. Relevance & Mains Question
  dom.readerRelevanceTag.textContent = article.relevance_tag || 'GS / Analytical Relevance';
  dom.readerQuestionText.textContent = article.practice_question || 'Evaluate the broader policy implications discussed in this editorial.';

  // 6. Personal Notes
  const savedNote = localStorage.getItem(`editorial-note-${article.id}`) || '';
  dom.readerNotesInput.value = savedNote;
  dom.notesStatusBadge.textContent = savedNote ? 'Saved locally' : 'Ready for notes';

  // 7. Full Article Discussion Body
  const content = article.content || '';
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  if (paragraphs.length > 0) {
    dom.readerBodyParagraphs.innerHTML = paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
  } else {
    dom.readerBodyParagraphs.innerHTML = `<p>${escapeHtml(content)}</p>`;
  }

  // Load saved text highlights
  loadArticleHighlights(article.id);

  // Render Visual Concept Mind Map
  renderMindMap(article);

  // Record daily study habit (reading goal)
  recordGoalAction('read', 1);

  // 8. Reader Quick Quiz Check
  const quizObj = article.quiz || generateQuizObj(article.title, article.vocabulary, article.category);
  renderInlineReaderQuiz(quizObj);

  updateReaderBookmarkIcon();

  dom.readerModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  dom.readerModal.scrollTop = 0;

  stopTTS();

  if (autoPlayAudio) {
    setTimeout(startTTS, 300);
  }
}

function renderInlineReaderQuiz(q) {
  if (!dom.readerQuizCard) return;
  dom.readerQuizCard.innerHTML = `
    <p class="reader-q-text">${escapeHtml(q.question)}</p>
    <div style="display: flex; flex-direction: column; gap: 0.5rem; margin: 0.75rem 0;">
      ${q.options.map((opt, idx) => `
        <button class="reader-opt-btn" data-idx="${idx}">${String.fromCharCode(65 + idx)}. ${escapeHtml(opt)}</button>
      `).join('')}
    </div>
    <div class="reader-q-expl" style="display: none;">
      <strong>${escapeHtml(q.explanation)}</strong>
    </div>
  `;

  const btns = dom.readerQuizCard.querySelectorAll('.reader-opt-btn');
  const explBox = dom.readerQuizCard.querySelector('.reader-q-expl');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedIdx = parseInt(btn.dataset.idx, 10);
      btns.forEach((b, i) => {
        b.disabled = true;
        if (i === q.answer) b.classList.add('correct');
        else if (i === selectedIdx && selectedIdx !== q.answer) b.classList.add('incorrect');
      });
      explBox.style.display = 'block';
    });
  });
}

function closeReader() {
  stopTTS();
  if (dom.highlightToolbar) dom.highlightToolbar.style.display = 'none';
  dom.readerModal.style.display = 'none';
  document.body.style.overflow = '';
  state.currentArticle = null;
  history.replaceState(null, null, ' ');
}

/**
 * Personal Notes Auto-save
 */
function handleNotesInput(e) {
  if (!state.currentArticle) return;
  const noteText = e.target.value;
  localStorage.setItem(`editorial-note-${state.currentArticle.id}`, noteText);
  dom.notesStatusBadge.textContent = 'Saved locally ✔';
}

/**
 * Export Editorial Study Notes to Markdown / Notion
 */
function exportArticleToMarkdown() {
  if (!state.currentArticle) return;
  const a = state.currentArticle;
  const note = localStorage.getItem(`editorial-note-${a.id}`) || 'No custom notes added.';
  const dims = a.dimensions || generateDimensions(a.title, a.category);
  const wayForward = (a.way_forward || generateWayForward(a.title, a.category)).map((w, i) => `${i + 1}. ${w}`).join('\n');
  const vocabFormatted = (a.vocabulary || []).map(v => `- **${v.word}** (${v.pos}): ${v.definition} *(Synonyms: ${v.synonyms.join(', ')})*`).join('\n');
  const takeawaysFormatted = (a.takeaways || []).map(t => `- ${t}`).join('\n');

  const markdown = `# ${a.title}
**Publication**: ${a.source} | **Date**: ${a.date} | **Category**: ${a.category}
**Relevance**: ${a.relevance_tag}
**Source URL**: ${a.url}

---

## ⚡ 30-Second Crux
> ${a.crux}

## 💡 Key Analytical Takeaways
${takeawaysFormatted}

## 🌐 360° Multi-Dimensional Analysis Matrix
- **Economic Dimension**: ${dims.economic}
- **Governance & Policy**: ${dims.governance}
- **Social & Equity**: ${dims.social}
- **Global & Geopolitics**: ${dims.global}

## 🟢 Actionable Way Forward & Policy Solutions
${wayForward}

## 📖 Daily Vocabulary & Concepts
${vocabFormatted}

## ✍️ Mains Analytical Question
*${a.practice_question}*

---

## 📝 My Personal Study Notes
${note}
`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(markdown).then(() => {
      showToast('📋 Full study note copied to clipboard (Notion / Markdown ready)!');
    });
  } else {
    showToast('Clipboard access unavailable.');
  }
}

/**
 * Print / Save as PDF Handout
 */
function printArticleHandout() {
  window.print();
}

/**
 * ==========================================================================
 * Daily Vocabulary Deck Modal Controller
 * ==========================================================================
 */
function openVocabModal() {
  renderVocabDeck();
  dom.vocabModal.style.display = 'flex';
}

function renderVocabDeck() {
  if (!dom.vocabDeckContainer) return;
  dom.vocabDeckContainer.innerHTML = '';

  const words = [];
  const seen = new Set();

  state.articles.forEach(art => {
    (art.vocabulary || []).forEach(v => {
      const key = (v.word || '').toLowerCase().trim();
      if (key && !seen.has(key)) {
        seen.add(key);
        words.push({ ...v, articleTitle: art.title });
      }
    });
  });

  // Fallback to VOCAB_DATABASE if no articles or words loaded yet
  if (words.length === 0) {
    Object.entries(VOCAB_DATABASE).forEach(([word, info]) => {
      words.push({
        word,
        pos: info.pos,
        definition: info.def,
        synonyms: info.synonyms,
        antonyms: info.antonyms,
        example: `Frequent editorial usage of ${word}.`,
        articleTitle: 'Daily Editorial Lexicon'
      });
    });
  }

  dom.vocabDeckContainer.innerHTML = words.map(w => `
    <div class="vocab-card">
      <div class="vocab-card-header">
        <h4 class="vocab-word">${escapeHtml(w.word)}</h4>
        <span class="vocab-pos">${escapeHtml(w.pos || 'Word')}</span>
      </div>
      <p class="vocab-def">${escapeHtml(w.definition || '')}</p>
      ${w.example ? `<p class="vocab-example"><em>"${escapeHtml(w.example)}"</em></p>` : ''}
      <div class="vocab-meta">
        ${w.synonyms && w.synonyms.length > 0 ? `<div><strong>Synonyms:</strong> ${escapeHtml(w.synonyms.join(', '))}</div>` : ''}
        ${w.antonyms && w.antonyms.length > 0 ? `<div><strong>Antonyms:</strong> ${escapeHtml(w.antonyms.join(', '))}</div>` : ''}
      </div>
      ${w.articleTitle ? `<div class="vocab-source-tag">From: ${escapeHtml(w.articleTitle)}</div>` : ''}
    </div>
  `).join('');
}

/**
 * ==========================================================================
 * Interactive 3D Vocabulary Flashcards Engine
 * ==========================================================================
 */
function buildFlashcardDeck() {
  const wordMap = new Map();
  state.articles.forEach(art => {
    (art.vocabulary || []).forEach(v => {
      const key = (v.word || '').toLowerCase().trim();
      if (key && !wordMap.has(key)) {
        wordMap.set(key, { ...v, articleTitle: art.title });
      }
    });
  });

  // Fallback to high-yield VOCAB_DATABASE if articles have not loaded yet
  if (wordMap.size === 0) {
    Object.entries(VOCAB_DATABASE).forEach(([word, info]) => {
      wordMap.set(word, {
        word,
        pos: info.pos,
        definition: info.def,
        synonyms: info.synonyms,
        antonyms: info.antonyms,
        example: `High-frequency editorial usage of ${word}.`,
        articleTitle: 'Daily Editorial Lexicon'
      });
    });
  }

  state.flashcards.cards = Array.from(wordMap.values());
  filterFlashcards(state.flashcards.activeFilter);
}

function filterFlashcards(filterType) {
  state.flashcards.activeFilter = filterType;
  if (filterType === 'mastered') {
    state.flashcards.filteredCards = state.flashcards.cards.filter(c => state.masteredWords.has(c.word.toLowerCase()));
  } else if (filterType === 'learning') {
    state.flashcards.filteredCards = state.flashcards.cards.filter(c => !state.masteredWords.has(c.word.toLowerCase()));
  } else {
    state.flashcards.filteredCards = [...state.flashcards.cards];
  }

  state.flashcards.currentIndex = 0;
  updateFlashcardStats();
  renderCurrentFlashcard();
}

function updateFlashcardStats() {
  const total = state.flashcards.cards.length;
  const mastered = Array.from(state.masteredWords).filter(w => state.flashcards.cards.some(c => c.word.toLowerCase() === w)).length;
  const learning = Math.max(0, total - mastered);
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

  if (dom.fcTotalCount) dom.fcTotalCount.textContent = total;
  if (dom.fcLearningCount) dom.fcLearningCount.textContent = learning;
  if (dom.fcMasteredCount) dom.fcMasteredCount.textContent = mastered;
  if (dom.fcProgressLabel) dom.fcProgressLabel.textContent = `${pct}% Mastered`;
  if (dom.fcProgressBar) dom.fcProgressBar.style.width = `${pct}%`;
}

function renderCurrentFlashcard() {
  const list = state.flashcards.filteredCards;
  if (dom.flashcardCard) dom.flashcardCard.classList.remove('is-flipped');

  if (list.length === 0) {
    dom.fcFrontWord.textContent = 'No cards found';
    dom.fcFrontPos.textContent = 'Status';
    dom.fcFrontExample.textContent = 'Select another filter above or mark words as review.';
    dom.fcCounterText.textContent = '0 of 0';
    return;
  }

  const card = list[state.flashcards.currentIndex];
  dom.fcFrontWord.textContent = card.word;
  dom.fcFrontPos.textContent = card.pos || 'Word';
  dom.fcFrontExample.textContent = card.example ? `"${card.example}"` : `Context: ${card.articleTitle}`;

  dom.fcBackPos.textContent = `${card.pos || ''} • Meaning`;
  dom.fcBackDef.textContent = card.definition;
  dom.fcBackSynonyms.textContent = (card.synonyms && card.synonyms.length > 0) ? card.synonyms.join(', ') : 'None listed';
  dom.fcBackAntonyms.textContent = (card.antonyms && card.antonyms.length > 0) ? card.antonyms.join(', ') : 'None listed';

  dom.fcCounterText.textContent = `Card ${state.flashcards.currentIndex + 1} of ${list.length}`;

  const isMastered = state.masteredWords.has(card.word.toLowerCase());
  dom.fcMarkMasterBtn.style.opacity = isMastered ? '0.7' : '1';
  dom.fcMarkMasterBtn.textContent = isMastered ? '✔ Mastered' : '⭐ Mark as Mastered';
}

function flipFlashcard() {
  if (dom.flashcardCard) {
    dom.flashcardCard.classList.toggle('is-flipped');
  }
}

function nextFlashcard() {
  if (state.flashcards.filteredCards.length === 0) return;
  state.flashcards.currentIndex = (state.flashcards.currentIndex + 1) % state.flashcards.filteredCards.length;
  renderCurrentFlashcard();
}

function prevFlashcard() {
  if (state.flashcards.filteredCards.length === 0) return;
  state.flashcards.currentIndex = (state.flashcards.currentIndex - 1 + state.flashcards.filteredCards.length) % state.flashcards.filteredCards.length;
  renderCurrentFlashcard();
}

function markFlashcardMastered() {
  const card = state.flashcards.filteredCards[state.flashcards.currentIndex];
  if (!card) return;
  state.masteredWords.add(card.word.toLowerCase());
  localStorage.setItem('editorial-mastered-words', JSON.stringify(Array.from(state.masteredWords)));
  recordGoalAction('flashcard', 1);
  updateFlashcardStats();
  showToast(`Marked "${card.word}" as Mastered! ⭐`);
  nextFlashcard();
}

function markFlashcardReview() {
  const card = state.flashcards.filteredCards[state.flashcards.currentIndex];
  if (!card) return;
  state.masteredWords.delete(card.word.toLowerCase());
  localStorage.setItem('editorial-mastered-words', JSON.stringify(Array.from(state.masteredWords)));
  recordGoalAction('flashcard', 1);
  updateFlashcardStats();
  showToast(`Marked "${card.word}" for Review 🔄`);
  nextFlashcard();
}

/**
 * ==========================================================================
 * Daily 5-Question MCQ Mock Quiz Engine
 * ==========================================================================
 */
function startDailyMockQuiz() {
  const pool = state.filteredArticles.length > 0 ? state.filteredArticles : state.articles;
  const questions = [];

  for (const art of pool) {
    if (art.quiz) {
      questions.push(art.quiz);
    } else {
      questions.push(generateQuizObj(art.title, art.vocabulary, art.category));
    }
    if (questions.length >= 5) break;
  }

  while (questions.length < 5 && state.articles.length > 0) {
    const randomArt = state.articles[Math.floor(Math.random() * state.articles.length)];
    questions.push(generateQuizObj(randomArt.title, randomArt.vocabulary, randomArt.category));
  }

  const FALLBACK_QUIZ = [
    {
      question: "Which of the following best describes the principle of 'Fiscal Federalism' as envisioned under Article 280 of the Indian Constitution?",
      options: [
        "Complete central control over all state tax collections without devolution",
        "Institutional mechanism for revenue sharing and horizontal tax distribution between Union and States",
        "Empowerment of the Reserve Bank of India to fix state budget deficits",
        "Mandatory requirement for state governments to run fiscal surpluses every quarter"
      ],
      answer: 1,
      explanation: "Article 280 establishes the Finance Commission every five years to recommend the principles of net tax revenue distribution between the Union and the States (vertical) and among the States (horizontal)."
    },
    {
      question: "In constitutional jurisprudence, which landmark Supreme Court judgment formulated the 'Basic Structure Doctrine'?",
      options: [
        "Maneka Gandhi v. Union of India (1978)",
        "Kesavananda Bharati v. State of Kerala (1973)",
        "S.R. Bommai v. Union of India (1994)",
        "Justice K.S. Puttaswamy v. Union of India (2017)"
      ],
      answer: 1,
      explanation: "The 13-judge bench in Kesavananda Bharati (1973) held that while Parliament has wide power to amend the Constitution under Article 368, it cannot alter its Basic Structure (democracy, secularism, federalism, judicial review)."
    },
    {
      question: "What is the primary objective of the Reserve Bank of India's 'Flexible Inflation Targeting' framework?",
      options: [
        "Pegging the Indian Rupee exchange rate strictly to the US Dollar",
        "Maintaining Consumer Price Index (CPI) inflation at 4% with a tolerance band of +/- 2%",
        "Eliminating the Current Account Deficit through direct export subsidies",
        "Freezing commercial bank lending rates across all retail loan categories"
      ],
      answer: 1,
      explanation: "Under the RBI Act, the Monetary Policy Committee (MPC) is mandated to keep CPI headline inflation at 4% with an upper tolerance limit of 6% and lower tolerance limit of 2%."
    },
    {
      question: "What does the editorial vocabulary term 'AMELIORATE' mean in the context of public policy?",
      options: [
        "To make a deficient or unsatisfactory condition significantly better",
        "To hasten the onset of an unavoidable macroeconomic recession",
        "To impose immediate legislative penalties without due process",
        "To delegate administrative authority to private market contractors"
      ],
      answer: 0,
      explanation: "'Ameliorate' is a verb meaning to make something bad or unsatisfactory better, often used in policy editorials regarding poverty, healthcare, or regulatory relief."
    },
    {
      question: "Under Article 21 of the Constitution, which of the following rights was explicitly recognized as a Fundamental Right in the 2017 Puttaswamy verdict?",
      options: [
        "Right to Strike in Public Utilities",
        "Right to Privacy",
        "Right to Property",
        "Right to Unregulated Commercial Broadcasting"
      ],
      answer: 1,
      explanation: "A unanimous 9-judge bench in Justice K.S. Puttaswamy (2017) declared the Right to Privacy an intrinsic part of the Right to Life and Personal Liberty under Article 21."
    }
  ];

  if (questions.length < 5) {
    for (const fq of FALLBACK_QUIZ) {
      if (!questions.some(q => q.question === fq.question)) {
        questions.push(fq);
      }
      if (questions.length >= 5) break;
    }
  }

  state.quiz.questions = questions.slice(0, 5);
  state.quiz.currentIndex = 0;
  state.quiz.score = 0;
  state.quiz.answered = false;

  dom.quizActiveView.style.display = 'block';
  dom.quizSummaryView.style.display = 'none';
  renderQuizQuestion();

  dom.quizModal.style.display = 'flex';
}

function renderQuizQuestion() {
  const q = state.quiz.questions[state.quiz.currentIndex];
  state.quiz.answered = false;

  dom.quizQNum.textContent = `Question ${state.quiz.currentIndex + 1} of ${state.quiz.questions.length}`;
  dom.quizScorePill.textContent = `Score: ${state.quiz.score} / ${state.quiz.currentIndex}`;
  dom.quizQuestionText.textContent = q.question;
  dom.quizExplanationBox.style.display = 'none';
  dom.quizNextBtn.style.display = 'none';

  dom.quizOptionsList.innerHTML = q.options.map((opt, idx) => `
    <button class="quiz-opt-btn" data-opt-idx="${idx}">
      <span class="quiz-opt-letter">${String.fromCharCode(65 + idx)}</span>
      <span>${escapeHtml(opt)}</span>
    </button>
  `).join('');

  const optBtns = dom.quizOptionsList.querySelectorAll('.quiz-opt-btn');
  optBtns.forEach(btn => {
    btn.addEventListener('click', () => handleQuizOptionClick(parseInt(btn.dataset.optIdx, 10)));
  });
}

function handleQuizOptionClick(selectedIdx) {
  if (state.quiz.answered) return;
  state.quiz.answered = true;

  const q = state.quiz.questions[state.quiz.currentIndex];
  const optBtns = dom.quizOptionsList.querySelectorAll('.quiz-opt-btn');
  const isCorrect = (selectedIdx === q.answer);

  if (isCorrect) {
    state.quiz.score++;
    dom.quizExplBadge.textContent = '✔ Correct!';
    dom.quizExplBadge.style.color = 'var(--accent-emerald)';
  } else {
    dom.quizExplBadge.textContent = '✖ Incorrect';
    dom.quizExplBadge.style.color = '#ef4444';
  }

  optBtns.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.answer) {
      btn.classList.add('correct');
    } else if (idx === selectedIdx && !isCorrect) {
      btn.classList.add('incorrect');
    }
  });

  dom.quizExplanationText.textContent = q.explanation;
  dom.quizExplanationBox.style.display = 'block';
  dom.quizNextBtn.style.display = 'inline-block';
  dom.quizNextBtn.textContent = (state.quiz.currentIndex + 1 === state.quiz.questions.length) ? 'View Final Results 🏆' : 'Next Question →';
}

function nextQuizQuestion() {
  if (state.quiz.currentIndex + 1 < state.quiz.questions.length) {
    state.quiz.currentIndex++;
    renderQuizQuestion();
  } else {
    showQuizSummary();
  }
}

function showQuizSummary() {
  dom.quizActiveView.style.display = 'none';
  dom.quizSummaryView.style.display = 'block';

  recordGoalAction('quiz');

  const total = state.quiz.questions.length;
  const score = state.quiz.score;
  const pct = Math.round((score / total) * 100);

  dom.resultsScoreDisplay.textContent = `You scored ${score} out of ${total} (${pct}%)`;

  if (pct === 100) {
    dom.resultsFeedbackText.textContent = 'Outstanding! You have thoroughly grasped today’s core editorial concepts, policy arguments, and vocabulary!';
  } else if (pct >= 60) {
    dom.resultsFeedbackText.textContent = 'Good effort! Review the vocabulary flashcards and 360° dimensions to solidify your conceptual clarity.';
  } else {
    dom.resultsFeedbackText.textContent = 'Keep practicing! Revisit the key takeaways and study notes to boost your retention.';
  }
}

/**
 * ==========================================================================
 * Exam Knowledge Vault Controller
 * ==========================================================================
 */
function openKnowledgeVault() {
  dom.knowledgeVaultModal.style.display = 'flex';
}

function switchVaultTab(tabKey) {
  const tabs = dom.knowledgeVaultModal.querySelectorAll('.vault-tab-btn');
  const contents = dom.knowledgeVaultModal.querySelectorAll('.vault-tab-content');

  tabs.forEach(t => t.classList.toggle('active', t.dataset.vaultTab === tabKey));
  contents.forEach(c => c.style.display = (c.id === `vault-tab-${tabKey}`) ? 'block' : 'none');
}

/**
 * ==========================================================================
 * Service Worker Registration (PWA & Offline Reading)
 * ==========================================================================
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => {
        console.log('Editorial Hub ServiceWorker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('ServiceWorker registration skipped:', err);
      });
  }
}

/**
 * ==========================================================================
 * Daily Study Streak & Goal Habit Tracker Engine
 * ==========================================================================
 */
function initStudyStreak() {
  const todayStr = new Date().toISOString().split('T')[0];
  const savedStreak = JSON.parse(localStorage.getItem('editorial-study-streak') || 'null');

  if (savedStreak) {
    state.streak = savedStreak;
    if (state.streak.lastActiveDate !== todayStr) {
      const last = new Date(state.streak.lastActiveDate);
      const today = new Date(todayStr);
      const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        state.streak.current = (state.streak.current || 1) + 1;
      } else if (diffDays > 1) {
        state.streak.current = 1;
      }
      state.streak.lastActiveDate = todayStr;
      state.streak.targets = {
        readCount: 0,
        flashcardsCount: 0,
        quizCompleted: false,
        answersCount: 0
      };
      saveStudyStreak();
    }
  } else {
    state.streak = {
      current: 1,
      lastActiveDate: todayStr,
      targets: {
        readCount: 0,
        flashcardsCount: 0,
        quizCompleted: false,
        answersCount: 0
      }
    };
    saveStudyStreak();
  }

  updateStreakUI();
}

function saveStudyStreak() {
  localStorage.setItem('editorial-study-streak', JSON.stringify(state.streak));
  updateStreakUI();
}

function updateStreakUI() {
  if (dom.streakCountBadge) {
    dom.streakCountBadge.textContent = `${state.streak.current || 1} ${state.streak.current === 1 ? 'Day' : 'Days'}`;
  }
}

function recordGoalAction(action, val = 1) {
  if (!state.streak || !state.streak.targets) return;

  if (action === 'read') {
    state.streak.targets.readCount = Math.min(2, (state.streak.targets.readCount || 0) + val);
  } else if (action === 'flashcard') {
    state.streak.targets.flashcardsCount = Math.min(10, (state.streak.targets.flashcardsCount || 0) + val);
  } else if (action === 'quiz') {
    state.streak.targets.quizCompleted = true;
  } else if (action === 'writing') {
    state.streak.targets.answersCount = (state.streak.targets.answersCount || 0) + val;
  }

  saveStudyStreak();
  if (dom.streakModal && dom.streakModal.style.display === 'flex') {
    renderStreakModal();
  }
}

function renderStreakModal() {
  if (!dom.streakHeroDays) return;
  dom.streakHeroDays.textContent = state.streak.current || 1;

  const t = state.streak.targets || { readCount: 0, flashcardsCount: 0, quizCompleted: false, answersCount: 0 };
  let points = 0;
  if (t.readCount >= 2) points += 25; else points += (t.readCount / 2) * 25;
  if (t.flashcardsCount >= 10) points += 25; else points += (t.flashcardsCount / 10) * 25;
  if (t.quizCompleted) points += 25;
  if (t.answersCount >= 1) points += 25;
  points = Math.round(points);

  if (dom.streakProgressPct) dom.streakProgressPct.textContent = `${points}%`;
  if (dom.streakProgressBar) dom.streakProgressBar.style.width = `${points}%`;

  if (dom.goalReadCount) dom.goalReadCount.textContent = `${t.readCount || 0} / 2`;
  if (dom.goalReadItem) dom.goalReadItem.classList.toggle('completed', (t.readCount || 0) >= 2);
  if (dom.goalReadIcon) dom.goalReadIcon.textContent = (t.readCount || 0) >= 2 ? '✔' : '⭕';

  if (dom.goalFlashcardCount) dom.goalFlashcardCount.textContent = `${t.flashcardsCount || 0} / 10`;
  if (dom.goalFlashcardItem) dom.goalFlashcardItem.classList.toggle('completed', (t.flashcardsCount || 0) >= 10);
  if (dom.goalFlashcardIcon) dom.goalFlashcardIcon.textContent = (t.flashcardsCount || 0) >= 10 ? '✔' : '⭕';

  if (dom.goalQuizCount) dom.goalQuizCount.textContent = t.quizCompleted ? 'Completed' : 'Not taken';
  if (dom.goalQuizItem) dom.goalQuizItem.classList.toggle('completed', !!t.quizCompleted);
  if (dom.goalQuizIcon) dom.goalQuizIcon.textContent = t.quizCompleted ? '✔' : '⭕';

  if (dom.goalWritingCount) dom.goalWritingCount.textContent = `${t.answersCount || 0} ${(t.answersCount || 0) === 1 ? 'draft' : 'drafts'}`;
  if (dom.goalWritingItem) dom.goalWritingItem.classList.toggle('completed', (t.answersCount || 0) >= 1);
  if (dom.goalWritingIcon) dom.goalWritingIcon.textContent = (t.answersCount || 0) >= 1 ? '✔' : '⭕';

  if (points >= 100) {
    if (dom.streakMotivationalTitle) dom.streakMotivationalTitle.textContent = '🎉 All Daily Goals Achieved!';
    if (dom.streakMotivationalMsg) dom.streakMotivationalMsg.textContent = 'Incredible dedication! You have finished today’s readings, active recall flashcards, quiz, and writing practice.';
  } else {
    if (dom.streakMotivationalTitle) dom.streakMotivationalTitle.textContent = 'Consistency is Key!';
    if (dom.streakMotivationalMsg) dom.streakMotivationalMsg.textContent = `You are ${points}% toward completing today's editorial mastery goals. Keep going!`;
  }
}

/**
 * ==========================================================================
 * Visual Concept Mind Map Generator Engine
 * ==========================================================================
 */
function renderMindMap(article) {
  if (!dom.readerMindmapContainer) return;
  dom.readerMindmapContainer.innerHTML = '';

  const title = article.title || 'Editorial Topic';
  const crux = article.crux || 'Core editorial trigger and institutional issue under discussion.';
  const takeaways = article.takeaways || [];
  const dims = article.dimensions || generateDimensions(article.title, article.category);
  const ways = article.way_forward || generateWayForward(article.title, article.category);

  const html = `
    <div class="mindmap-node-row">
      <div class="mindmap-node node-core">
        <div class="node-header">⚡ Core Central Issue / Trigger</div>
        <div class="node-title">${escapeHtml(title)}</div>
        <div class="node-body">${escapeHtml(crux)}</div>
      </div>
    </div>

    <div class="mindmap-connector-arrow">↓</div>

    <div class="mindmap-node-row">
      <div class="mindmap-node node-causes">
        <div class="node-header">🔍 Structural Context & Root Drivers</div>
        <div class="node-body">
          <ul style="padding-left: 1.1rem; margin: 0;">
            ${takeaways.map(t => `<li style="margin-bottom: 0.25rem;">${escapeHtml(t)}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="mindmap-node node-dimensions">
        <div class="node-header">🌐 360° Dimension Interlinks</div>
        <div class="node-body">
          <div style="margin-bottom: 0.35rem;"><strong>💼 Economy:</strong> ${escapeHtml(dims.economic || 'Resource allocation & public finance.')}</div>
          <div style="margin-bottom: 0.35rem;"><strong>⚖️ Governance:</strong> ${escapeHtml(dims.governance || 'Institutional accountability & checks.')}</div>
          <div><strong>👥 Society:</strong> ${escapeHtml(dims.social || 'Citizen welfare and constitutional rights.')}</div>
        </div>
      </div>
    </div>

    <div class="mindmap-connector-arrow">↓</div>

    <div class="mindmap-node-row">
      <div class="mindmap-node node-solutions">
        <div class="node-header">🟢 Actionable Solutions & Policy Way Forward</div>
        <div class="node-body">
          <ul style="padding-left: 1.1rem; margin: 0;">
            ${ways.map(w => `<li style="margin-bottom: 0.25rem;">${escapeHtml(w)}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
  `;

  dom.readerMindmapContainer.innerHTML = html;
}

/**
 * ==========================================================================
 * Timed Mains Answer Writing Studio Engine
 * ==========================================================================
 */
function openWritingStudio(questionText, articleTitle, articleId) {
  state.writingStudio.currentQuestion = questionText || (state.currentArticle ? state.currentArticle.practice_question : (dom.readerQuestionText ? dom.readerQuestionText.textContent : 'Evaluate the policy implications of current editorial developments.'));
  state.writingStudio.currentArticleTitle = articleTitle || (state.currentArticle ? state.currentArticle.title : 'General Editorial Practice');
  state.writingStudio.currentArticleId = articleId || (state.currentArticle ? state.currentArticle.id : 'general-draft');

  if (dom.writingArticleRef) {
    dom.writingArticleRef.textContent = `Drafting response for: ${state.writingStudio.currentArticleTitle}`;
  }
  if (dom.writingQuestionDisplay) {
    dom.writingQuestionDisplay.textContent = state.writingStudio.currentQuestion;
  }

  // Load saved draft
  const savedDraft = localStorage.getItem(`editorial-draft-${state.writingStudio.currentArticleId}`) || '';
  if (dom.writingEditorInput) {
    dom.writingEditorInput.value = savedDraft;
  }

  // Default preset: 7 min (150 words)
  setWritingTimerPreset(420, 150);

  updateWritingStats();
  if (dom.writingStudioModal) {
    dom.writingStudioModal.style.display = 'flex';
  }
}

function setWritingTimerPreset(seconds, words) {
  clearInterval(state.writingStudio.timerInterval);
  state.writingStudio.isRunning = false;
  state.writingStudio.totalSeconds = seconds;
  state.writingStudio.remainingSeconds = seconds;
  state.writingStudio.targetWords = words;
  state.writingStudio.startTime = null;

  if (dom.writingTimerToggleBtn) dom.writingTimerToggleBtn.textContent = '▶ Start';
  if (dom.writingTargetWords) dom.writingTargetWords.textContent = words;
  if (dom.writingTimerClock) dom.writingTimerClock.classList.remove('timer-warning');
  renderTimerClock();
}

function toggleWritingTimer() {
  if (state.writingStudio.isRunning) {
    clearInterval(state.writingStudio.timerInterval);
    state.writingStudio.isRunning = false;
    if (dom.writingTimerToggleBtn) dom.writingTimerToggleBtn.textContent = '▶ Resume';
  } else {
    state.writingStudio.isRunning = true;
    state.writingStudio.startTime = state.writingStudio.startTime || Date.now();
    if (dom.writingTimerToggleBtn) dom.writingTimerToggleBtn.textContent = '⏸ Pause';

    state.writingStudio.timerInterval = setInterval(() => {
      if (state.writingStudio.totalSeconds > 0) {
        state.writingStudio.remainingSeconds--;
        renderTimerClock();

        if (state.writingStudio.remainingSeconds <= 60 && state.writingStudio.remainingSeconds > 0) {
          if (dom.writingTimerClock) dom.writingTimerClock.classList.add('timer-warning');
        }

        if (state.writingStudio.remainingSeconds <= 0) {
          clearInterval(state.writingStudio.timerInterval);
          state.writingStudio.isRunning = false;
          if (dom.writingTimerToggleBtn) dom.writingTimerToggleBtn.textContent = 'Time Up!';
          showToast('⏰ Time is up! Review and polish your response.');
        }
      } else {
        // Stopwatch mode
        state.writingStudio.remainingSeconds++;
        renderTimerClock();
      }
      updateWritingStats();
    }, 1000);
  }
}

function resetWritingTimer() {
  clearInterval(state.writingStudio.timerInterval);
  state.writingStudio.isRunning = false;
  state.writingStudio.remainingSeconds = state.writingStudio.totalSeconds;
  if (dom.writingTimerToggleBtn) dom.writingTimerToggleBtn.textContent = '▶ Start';
  if (dom.writingTimerClock) dom.writingTimerClock.classList.remove('timer-warning');
  renderTimerClock();
}

function renderTimerClock() {
  if (!dom.writingTimerClock) return;
  const secs = state.writingStudio.remainingSeconds;
  const m = Math.floor(Math.abs(secs) / 60);
  const s = Math.abs(secs) % 60;
  dom.writingTimerClock.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function handleWritingInput() {
  updateWritingStats();
  const text = dom.writingEditorInput ? dom.writingEditorInput.value : '';
  if (state.writingStudio.currentArticleId) {
    localStorage.setItem(`editorial-draft-${state.writingStudio.currentArticleId}`, text);
  }
  if (dom.writingSaveStatus) dom.writingSaveStatus.textContent = 'Auto-saved locally';

  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  if (wordCount >= 50) {
    recordGoalAction('writing', 1);
  }
}

function updateWritingStats() {
  if (!dom.writingEditorInput) return;
  const text = dom.writingEditorInput.value.trim();
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  state.writingStudio.wordCount = words;

  if (dom.writingWordCount) dom.writingWordCount.textContent = words;

  if (state.writingStudio.startTime && state.writingStudio.isRunning) {
    const elapsedMinutes = Math.max(0.1, (Date.now() - state.writingStudio.startTime) / (1000 * 60));
    const wpm = Math.round(words / elapsedMinutes);
    if (dom.writingWpmCount) dom.writingWpmCount.textContent = wpm;
  }
}

function insertSkeletonOutline() {
  const template = `## 1. Introduction\n- Definition & Context: \n- Constitutional / Statutory Anchor: \n\n## 2. Body: Multi-Dimensional Arguments\n- Economic Aspect: \n- Governance & Institutional Bottlenecks: \n- Social Equity & Citizen Rights: \n- International / Global Benchmark: \n\n## 3. Way Forward & Recommendations\n- Policy Recommendation 1: \n- Administrative & Digital Transparency: \n- Forward-looking Constitutional Conclusion: `;

  if (!dom.writingEditorInput) return;
  if (dom.writingEditorInput.value.trim()) {
    dom.writingEditorInput.value += `\n\n${template}`;
  } else {
    dom.writingEditorInput.value = template;
  }
  handleWritingInput();
  showToast('Skeleton outline inserted! ✍️');
}

function exportWritingToMarkdown() {
  const text = dom.writingEditorInput ? dom.writingEditorInput.value : '';
  if (!text.trim()) {
    showToast('Your answer draft is empty.');
    return;
  }

  const q = state.writingStudio.currentQuestion;
  const title = state.writingStudio.currentArticleTitle;
  const words = state.writingStudio.wordCount;
  const dateStr = new Date().toISOString().split('T')[0];

  const md = `# Answer Writing Practice: ${title}\n` +
    `**Date:** ${dateStr} | **Word Count:** ${words} words\n\n` +
    `## Question:\n> ${q}\n\n` +
    `## My Response:\n\n${text}\n\n` +
    `---\n*Drafted via Daily Editorial Hub Timed Writing Studio*`;

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Answer-Draft-${dateStr}.md`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Answer exported to Markdown file! 📥');
}

function copyWritingAnswer() {
  const text = dom.writingEditorInput ? dom.writingEditorInput.value : '';
  if (!text.trim()) {
    showToast('Your answer draft is empty.');
    return;
  }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Answer copied to clipboard! 📋');
    });
  } else {
    showToast('Clipboard access unavailable.');
  }
}

/**
 * ==========================================================================
 * Dual View Multi-Perspective Comparison Engine
 * ==========================================================================
 */
function openCompareModal() {
  if (state.articles.length < 2) {
    showToast('At least 2 editorials are needed for comparative study.');
    return;
  }

  const optionsHtml = state.articles.map(art => `
    <option value="${art.id}">${escapeHtml(art.source)}: ${escapeHtml(art.title.slice(0, 50))}...</option>
  `).join('');

  if (dom.compareSelectLeft) dom.compareSelectLeft.innerHTML = optionsHtml;
  if (dom.compareSelectRight) dom.compareSelectRight.innerHTML = optionsHtml;

  if (dom.compareSelectLeft) dom.compareSelectLeft.selectedIndex = 0;
  if (dom.compareSelectRight) dom.compareSelectRight.selectedIndex = Math.min(1, state.articles.length - 1);

  renderCompareColumn(dom.compareSelectLeft.value, dom.compareColLeft);
  renderCompareColumn(dom.compareSelectRight.value, dom.compareColRight);

  if (dom.compareModal) dom.compareModal.style.display = 'flex';
}

function renderCompareColumn(articleId, container) {
  const art = state.articles.find(a => a.id === articleId);
  if (!art || !container) return;

  const dims = art.dimensions || generateDimensions(art.title, art.category);
  const wayForward = art.way_forward || generateWayForward(art.title, art.category);

  container.innerHTML = `
    <div class="compare-article-header">
      <span class="compare-source-badge">${escapeHtml(art.source)} • ${escapeHtml(art.category)}</span>
      <h3 class="compare-article-title">${escapeHtml(art.title)}</h3>
    </div>

    <div class="compare-section-card">
      <div class="compare-section-title">⚡ 30-Second Crux</div>
      <p style="margin: 0; font-size: 0.88rem; line-height: 1.5; color: var(--text-primary);">${escapeHtml(art.crux || '')}</p>
    </div>

    <div class="compare-section-card">
      <div class="compare-section-title">💡 Key Takeaways</div>
      <ul style="padding-left: 1.1rem; margin: 0; font-size: 0.85rem; line-height: 1.5; color: var(--text-secondary);">
        ${(art.takeaways || []).map(t => `<li style="margin-bottom: 0.25rem;">${escapeHtml(t)}</li>`).join('')}
      </ul>
    </div>

    <div class="compare-section-card">
      <div class="compare-section-title">🌐 360° Analytical Breakdown</div>
      <div style="font-size: 0.825rem; line-height: 1.45; color: var(--text-secondary);">
        <div style="margin-bottom: 0.35rem;"><strong>💼 Economy:</strong> ${escapeHtml(dims.economic || 'N/A')}</div>
        <div style="margin-bottom: 0.35rem;"><strong>⚖️ Governance:</strong> ${escapeHtml(dims.governance || 'N/A')}</div>
        <div><strong>👥 Social:</strong> ${escapeHtml(dims.social || 'N/A')}</div>
      </div>
    </div>

    <div class="compare-section-card">
      <div class="compare-section-title">🟢 Policy Way Forward</div>
      <ul style="padding-left: 1.1rem; margin: 0; font-size: 0.825rem; line-height: 1.45; color: var(--text-secondary);">
        ${wayForward.map(w => `<li style="margin-bottom: 0.25rem;">${escapeHtml(w)}</li>`).join('')}
      </ul>
    </div>

    <div style="text-align: right; margin-top: auto; padding-top: 0.5rem;">
      <a href="${escapeHtml(art.url)}" target="_blank" rel="noopener" style="font-size: 0.8rem; color: var(--brand-primary); font-weight: 700;">Read Full Source ↗</a>
    </div>
  `;
}

/**
 * ==========================================================================
 * Text Highlighter & Margin Annotations Engine
 * ==========================================================================
 */
function initTextHighlighter() {
  if (!dom.highlightToolbar) return;

  document.addEventListener('selectionchange', () => {
    if (!dom.readerModal || dom.readerModal.style.display !== 'flex') {
      if (dom.highlightToolbar) dom.highlightToolbar.style.display = 'none';
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !dom.readerBodyParagraphs || !dom.readerBodyParagraphs.contains(selection.anchorNode)) {
      if (dom.highlightToolbar) dom.highlightToolbar.style.display = 'none';
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width > 0) {
      dom.highlightToolbar.style.top = `${rect.top + window.scrollY - 46}px`;
      dom.highlightToolbar.style.left = `${Math.max(10, rect.left + window.scrollX + (rect.width / 2) - 100)}px`;
      dom.highlightToolbar.style.display = 'flex';
    }
  });

  dom.highlightToolbar.querySelectorAll('.hl-color-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const color = btn.dataset.hlColor;
      applyHighlightToSelection(color);
      dom.highlightToolbar.style.display = 'none';
    });
  });
}

function applyHighlightToSelection(color) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  if (color === 'clear') {
    const parentMark = selection.anchorNode.parentElement?.closest('mark');
    if (parentMark) {
      const text = parentMark.textContent;
      parentMark.replaceWith(document.createTextNode(text));
    }
  } else {
    const mark = document.createElement('mark');
    mark.className = `hl-${color}`;
    mark.textContent = range.toString();
    range.deleteContents();
    range.insertNode(mark);
  }

  selection.removeAllRanges();
  saveArticleHighlights();
  showToast('Highlight updated! 🖍️');
}

function saveArticleHighlights() {
  if (!state.currentArticle || !dom.readerBodyParagraphs) return;
  const bodyHtml = dom.readerBodyParagraphs.innerHTML;
  localStorage.setItem(`editorial-hl-${state.currentArticle.id}`, bodyHtml);
}

function loadArticleHighlights(articleId) {
  const saved = localStorage.getItem(`editorial-hl-${articleId}`);
  if (saved && dom.readerBodyParagraphs) {
    dom.readerBodyParagraphs.innerHTML = saved;
  }
}

/**
 * Text-to-Speech (TTS) Engine
 */
function startTTS() {
  if (!('speechSynthesis' in window)) {
    showToast('Text-to-Speech is not supported in this browser.');
    return;
  }

  if (state.tts.isPaused && state.tts.isSpeaking) {
    window.speechSynthesis.resume();
    state.tts.isPaused = false;
    updateTTSControls(true);
    return;
  }

  if (!state.currentArticle) return;

  window.speechSynthesis.cancel();

  const article = state.currentArticle;
  const scriptText = [
    `Editorial from ${article.source}.`,
    article.title + '.',
    '30-Second Crux: ' + article.crux,
    'Key Analytical Takeaways:',
    ...(article.takeaways || []),
    'Discussion: ' + (article.content || '')
  ].join(' \n ');

  const utterance = new SpeechSynthesisUtterance(scriptText);
  utterance.rate = state.preferences.speechSpeed;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    state.tts.isSpeaking = true;
    state.tts.isPaused = false;
    updateTTSControls(true);
  };

  utterance.onend = () => {
    state.tts.isSpeaking = false;
    state.tts.isPaused = false;
    updateTTSControls(false);
  };

  utterance.onerror = (e) => {
    console.error('TTS error:', e);
    state.tts.isSpeaking = false;
    state.tts.isPaused = false;
    updateTTSControls(false);
  };

  state.tts.utterance = utterance;
  window.speechSynthesis.speak(utterance);
}

function pauseTTS() {
  if (window.speechSynthesis && state.tts.isSpeaking) {
    window.speechSynthesis.pause();
    state.tts.isPaused = true;
    updateTTSControls(false, true);
  }
}

function stopTTS() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  state.tts.isSpeaking = false;
  state.tts.isPaused = false;
  updateTTSControls(false);
}

function updateTTSControls(speaking, paused = false) {
  if (speaking) {
    dom.ttsPlayBtn.classList.add('speaking');
    dom.ttsIcon.textContent = '⏸';
    dom.ttsLabel.textContent = 'Pause';
    dom.ttsStopBtn.style.display = 'inline-block';
  } else if (paused) {
    dom.ttsPlayBtn.classList.remove('speaking');
    dom.ttsIcon.textContent = '▶';
    dom.ttsLabel.textContent = 'Resume';
    dom.ttsStopBtn.style.display = 'inline-block';
  } else {
    dom.ttsPlayBtn.classList.remove('speaking');
    dom.ttsIcon.textContent = '▶';
    dom.ttsLabel.textContent = 'Listen';
    dom.ttsStopBtn.style.display = 'none';
  }
}

/**
 * Bookmarks management
 */
function toggleBookmark(articleId) {
  if (state.bookmarks.has(articleId)) {
    state.bookmarks.delete(articleId);
    showToast('Removed from saved bookmarks');
  } else {
    state.bookmarks.add(articleId);
    showToast('Saved to bookmarks ⭐');
  }

  localStorage.setItem('editorial-bookmarks', JSON.stringify(Array.from(state.bookmarks)));
  updateBookmarkBadge();
  updateReaderBookmarkIcon();
  renderArticles();
}

function updateBookmarkBadge() {
  dom.bookmarkBadge.textContent = state.bookmarks.size;
}

function updateReaderBookmarkIcon() {
  if (!state.currentArticle) return;
  const isBookmarked = state.bookmarks.has(state.currentArticle.id);
  dom.readerBookmarkBtn.querySelector('.bm-icon').textContent = isBookmarked ? '★' : '☆';
  dom.readerBookmarkBtn.style.color = isBookmarked ? '#f59e0b' : 'inherit';
}

function openBookmarksModal() {
  dom.bookmarksList.innerHTML = '';
  const savedArticles = state.articles.filter(a => state.bookmarks.has(a.id));

  if (savedArticles.length === 0) {
    dom.bookmarksList.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <span style="font-size: 2rem;">⭐</span>
        <p style="margin-top: 0.5rem;">No saved editorials yet.</p>
        <p style="font-size: 0.8rem;">Click the star icon on any card to save it for revision.</p>
      </div>
    `;
  } else {
    savedArticles.forEach(a => {
      const item = document.createElement('div');
      item.className = 'bookmark-item';
      item.innerHTML = `
        <div class="bm-info">
          <span class="bm-source">${escapeHtml(a.source)} • ${a.date}</span>
          <h4 class="bm-title" data-id="${a.id}">${escapeHtml(a.title)}</h4>
        </div>
        <button class="bm-del-btn" data-id="${a.id}" title="Remove bookmark">✕</button>
      `;

      item.querySelector('.bm-title').addEventListener('click', () => {
        dom.bookmarksModal.style.display = 'none';
        openReader(a.id);
      });

      item.querySelector('.bm-del-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBookmark(a.id);
        openBookmarksModal();
      });

      dom.bookmarksList.appendChild(item);
    });
  }

  dom.bookmarksModal.style.display = 'flex';
}

function updateFilterBarUI() {
  const isFiltered = state.selectedSource !== 'all' || 
                     state.selectedCategory !== 'all' || 
                     (state.selectedGS && state.selectedGS !== 'all') ||
                     state.searchQuery.trim() !== '' || 
                     (state.selectedDate && state.selectedDate !== state.availableDates[0]);

  if (isFiltered) {
    dom.activeFiltersBar.style.display = 'flex';
    const parts = [];
    if (state.selectedDate && state.selectedDate !== state.availableDates[0]) {
      parts.push(`Date: ${state.selectedDate}`);
    }
    if (state.selectedSource !== 'all') parts.push(`Source: ${state.selectedSource}`);
    if (state.selectedCategory !== 'all') parts.push(`Topic: ${state.selectedCategory}`);
    if (state.selectedGS && state.selectedGS !== 'all') parts.push(`Syllabus: ${state.selectedGS}`);
    if (state.searchQuery.trim()) parts.push(`Query: "${state.searchQuery}"`);
    dom.activeFilterText.textContent = `Filtered by: ${parts.join(' • ')}`;
  } else {
    dom.activeFiltersBar.style.display = 'none';
  }
}

function resetAllFilters() {
  state.selectedSource = 'all';
  state.selectedCategory = 'all';
  state.selectedGS = 'all';
  state.searchQuery = '';
  dom.searchInput.value = '';
  dom.clearSearchBtn.style.display = 'none';
  if (state.availableDates.length > 0) {
    state.selectedDate = state.availableDates[0];
  }

  dom.sourceFilters.querySelectorAll('.filter-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.source === 'all');
  });
  dom.categoryFilters.querySelectorAll('.filter-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.cat === 'all');
  });
  if (dom.gsFilters) {
    dom.gsFilters.querySelectorAll('.filter-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.gs === 'all');
    });
  }

  applyFilters();
}

function navigateDate(direction) {
  if (state.availableDates.length === 0) return;
  const currentIdx = state.availableDates.indexOf(state.selectedDate);
  if (currentIdx === -1) {
    state.selectedDate = state.availableDates[0];
  } else {
    const nextIdx = currentIdx + direction;
    if (nextIdx >= 0 && nextIdx < state.availableDates.length) {
      state.selectedDate = state.availableDates[nextIdx];
    }
  }
  applyFilters();
}

/**
 * Theme & Display Preferences
 */
function applySavedPreferences() {
  setTheme(state.preferences.theme, false);
  applyReaderFont(state.preferences.font);
  applyReaderSize(state.preferences.size);
  dom.ttsSpeedBadge.textContent = `${state.preferences.speechSpeed}x`;
}

function setTheme(theme, save = true) {
  state.preferences.theme = theme;
  if (save) localStorage.setItem('editorial-theme', theme);

  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme');
    document.getElementById('theme-icon').textContent = '🌓';
  } else if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.getElementById('theme-icon').textContent = '☀️';
  } else if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.getElementById('theme-icon').textContent = '🌙';
  } else if (theme === 'sepia') {
    document.documentElement.setAttribute('data-theme', 'sepia');
    document.getElementById('theme-icon').textContent = '📜';
  }

  dom.themeMenu.querySelectorAll('.dropdown-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeVal === theme);
  });
}

function applyReaderFont(font) {
  state.preferences.font = font;
  localStorage.setItem('reader-font', font);
  if (font === 'serif') {
    document.documentElement.style.setProperty('--reader-font', "var(--font-editorial)");
  } else if (font === 'sans') {
    document.documentElement.style.setProperty('--reader-font', "var(--font-ui)");
  } else if (font === 'mono') {
    document.documentElement.style.setProperty('--reader-font', "var(--font-mono)");
  }
  
  dom.settingsModal.querySelectorAll('.font-opt-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.font === font);
  });
}

function applyReaderSize(size) {
  state.preferences.size = size;
  localStorage.setItem('reader-size', size);
  const sizeMap = {
    sm: { size: '1rem', lh: '1.75' },
    md: { size: '1.125rem', lh: '1.85' },
    lg: { size: '1.25rem', lh: '1.9' },
    xl: { size: '1.4rem', lh: '2.0' }
  };
  const cfg = sizeMap[size] || sizeMap.md;
  document.documentElement.style.setProperty('--reader-font-size', cfg.size);
  document.documentElement.style.setProperty('--reader-line-height', cfg.lh);

  dom.settingsModal.querySelectorAll('.size-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.size === size);
  });
}

// ==========================================================================
// CURRENT AFFAIRS 360° MODULE (1-Year Master Vault & Daily Feeds)
// ==========================================================================

const CA_CATEGORY_ICONS = {
  "Banking & Finance": "🏦",
  "Polity & Governance": "⚖️",
  "Economy & Infrastructure": "📈",
  "Science, Tech & Defence": "🔬",
  "History, Art & Culture": "📜",
  "Sports & Games": "🏆",
  "National Affairs & Schemes": "🇮🇳",
  "International & Global Affairs": "🌍",
  "Environment & Ecology": "🌿"
};

const CAPSULE_DATA_MAP = {
  appointments: {
    key: 'appointments_heads',
    title: '👑 Constitutional & National Appointments (Past 1 Year)',
    subtitle: 'High-yield appointments frequently targeted in UPSC CSE Prelims, RBI Grade B, and SSC CGL.',
    headers: ['Designation / Office', 'Appointee / Incumbent', 'Exam Crux & Statutory Anchor', 'Date / Tenure'],
    renderRow: (item) => `
      <tr>
        <td class="cap-col-bold">${escapeHtml(item.title)}</td>
        <td class="cap-col-highlight">${escapeHtml(item.person)}</td>
        <td>${escapeHtml(item.key_detail)}</td>
        <td class="cap-col-date">${escapeHtml(item.tenure_or_date)}</td>
      </tr>
    `
  },
  military: {
    key: 'military_exercises',
    title: '⚔️ Joint Military & Defence Exercises (2024–2026)',
    subtitle: 'Bilateral and multilateral war games, air exercises, and naval drills.',
    headers: ['Exercise Name', 'Forces / Nations Involved', 'Location / Venue', 'Strategic Objectives & Focus'],
    renderRow: (item) => `
      <tr>
        <td class="cap-col-bold">${escapeHtml(item.exercise)}</td>
        <td class="cap-col-highlight">${escapeHtml(item.forces)}</td>
        <td>${escapeHtml(item.location)}</td>
        <td>${escapeHtml(item.focus)}</td>
      </tr>
    `
  },
  summits: {
    key: 'summits_themes',
    title: '🌐 Global Summits, Presidencies & Official Themes',
    subtitle: 'Multilateral conferences shaping geopolitics, trade, and climate agreements.',
    headers: ['Summit / Forum', 'Presidency / Host', 'Official Theme', 'Strategic Outcomes & Declarations'],
    renderRow: (item) => `
      <tr>
        <td class="cap-col-bold">${escapeHtml(item.summit)}</td>
        <td class="cap-col-highlight">${escapeHtml(item.presidency)}</td>
        <td><em>"${escapeHtml(item.theme)}"</em></td>
        <td>${escapeHtml(item.significance)}</td>
      </tr>
    `
  },
  heritage: {
    key: 'unesco_heritage_gi_tags',
    title: '🏛️ UNESCO World Heritage & Geographical Indications (GI)',
    subtitle: 'Newly inscribed cultural, natural, and intangible heritage sites & notable GI tags.',
    headers: ['Item / Site / Art', 'Category', 'State / Region', 'Significance & Historical Context'],
    renderRow: (item) => `
      <tr>
        <td class="cap-col-bold">${escapeHtml(item.item)}</td>
        <td><span class="cap-pill">${escapeHtml(item.category)}</span></td>
        <td class="cap-col-highlight">${escapeHtml(item.state)}</td>
        <td>${escapeHtml(item.significance)}</td>
      </tr>
    `
  },
  ramsar: {
    key: 'ramsar_sites_environment',
    title: '🦆 Ramsar Wetland Sites & Ecological Landmarks',
    subtitle: "India's network of 85 Ramsar sites and biodiversity hotspots.",
    headers: ['Wetland Site', 'State / UT', 'Ecosystem Type', 'Ecological Significance & Flagship Species'],
    renderRow: (item) => `
      <tr>
        <td class="cap-col-bold">${escapeHtml(item.site)}</td>
        <td class="cap-col-highlight">${escapeHtml(item.state)}</td>
        <td><span class="cap-pill">${escapeHtml(item.type)}</span></td>
        <td>${escapeHtml(item.key_facts)}</td>
      </tr>
    `
  },
  sports: {
    key: 'sports_champions_awards',
    title: '🥇 Major Sports Champions, Records & National Honors',
    subtitle: 'Historic milestones across Olympic, Paralympic, Chess, Cricket, and Tennis arenas.',
    headers: ['Event / Championship', 'Champion / Recipient', 'Historic Record / Milestone'],
    renderRow: (item) => `
      <tr>
        <td class="cap-col-bold">${escapeHtml(item.event)}</td>
        <td class="cap-col-highlight">${escapeHtml(item.recipient)}</td>
        <td>${escapeHtml(item.record)}</td>
      </tr>
    `
  },
  indices: {
    key: 'indices_india_rank',
    title: "📊 Global Indices, Reports & India's Ranking",
    subtitle: 'Benchmark rankings by World Bank, WIPO, UNDP, Germanwatch, and WEF.',
    headers: ['Index / Report', 'Publishing Body', "India's Rank", 'Key Drivers & Insights'],
    renderRow: (item) => `
      <tr>
        <td class="cap-col-bold">${escapeHtml(item.index_name)}</td>
        <td class="cap-col-highlight">${escapeHtml(item.publisher)}</td>
        <td><strong style="color: var(--primary); font-size: 1rem;">${escapeHtml(item.india_rank)}</strong></td>
        <td>${escapeHtml(item.score_detail)}</td>
      </tr>
    `
  }
};

function isMasterDossier(item) {
  if (!item) return false;
  if (item.is_vault) return true;
  if (/^ca-vault-[a-z]+-\d{2}$/.test(item.id)) return true;
  if (/^ca-\d{4}-[a-z]+-\d{2}$/.test(item.id)) return true;
  return false;
}

/**
 * Fetch and load Current Affairs dataset (1-Year Master Vault + Daily Feeds)
 */
async function loadCurrentAffairsData() {
  if (dom.caLoadingSpinner) dom.caLoadingSpinner.style.display = 'block';
  if (dom.caGrid) dom.caGrid.innerHTML = '';

  try {
    const res = await fetch('data/current_affairs.json');
    let baseItems = [];
    if (res.ok) {
      const data = await res.json();
      baseItems = data.items || [];
      state.ca.factCapsules = data.fact_capsules || {};
      if (data.last_updated && dom.caUpdatePill) {
        dom.caUpdatePill.textContent = `🟢 Updated: ${data.last_updated}`;
      }
    }

    const localLiveCache = JSON.parse(localStorage.getItem('ca-live-cache') || '[]');
    const existingIds = new Set(baseItems.map(i => i.id));
    const merged = [...localLiveCache.filter(i => !existingIds.has(i.id)), ...baseItems];
    state.ca.items = merged;

    // Update hero stats
    const totalCount = state.ca.items.length;
    const vaultCount = state.ca.items.filter(isMasterDossier).length;
    const dailyCount = totalCount - vaultCount;

    if (dom.caStatTotal) dom.caStatTotal.textContent = `${totalCount}+`;
    if (dom.caStatVault) dom.caStatVault.textContent = `${vaultCount} Curated`;
    if (dom.caStatDaily) dom.caStatDaily.textContent = `${dailyCount} Feeds`;
    if (dom.caStatCapsules) dom.caStatCapsules.textContent = `7 Themes`;

    applyCAFilters();
    renderCACapsules('appointments');
    initCAQuizArena();
  } catch (err) {
    console.error('Error loading current affairs data:', err);
    if (dom.caEmptyState) dom.caEmptyState.style.display = 'block';
  } finally {
    if (dom.caLoadingSpinner) dom.caLoadingSpinner.style.display = 'none';
  }
}

/**
 * Filter current affairs by subtab, subject, scope, exam target, and search keywords
 */
function applyCAFilters() {
  let items = [...state.ca.items];

  // 1. Subnav Filter: Vault vs Daily
  if (state.ca.activeSubTab === 'vault') {
    items = items.filter(isMasterDossier);
  } else if (state.ca.activeSubTab === 'daily') {
    items = items.filter(i => !isMasterDossier(i));
  }

  // 2. Category Filter
  if (state.ca.selectedCategory !== 'all') {
    items = items.filter(i => i.category === state.ca.selectedCategory);
  }

  // 3. Scope Filter
  if (state.ca.selectedScope !== 'all') {
    items = items.filter(i => i.scope === state.ca.selectedScope || (i.scope === 'World & India' && (state.ca.selectedScope === 'India' || state.ca.selectedScope === 'World')));
  }

  // 3b. Official Source Filter
  if (state.ca.selectedSource && state.ca.selectedSource !== 'all') {
    const srcTarget = state.ca.selectedSource.toLowerCase();
    items = items.filter(i => {
      const src = (i.source || '').toLowerCase();
      const url = (i.url || '').toLowerCase();
      if (srcTarget === 'air' || srcTarget === 'newsonair') {
        return src.includes('air') || src.includes('newsonair') || url.includes('newsonair.gov.in');
      }
      if (srcTarget === 'pib') return src.includes('pib');
      if (srcTarget === 'hindu') return src.includes('hindu');
      if (srcTarget === 'express') return src.includes('express');
      if (srcTarget === 'mint') return src.includes('mint') || src.includes('economic');
      return src.includes(srcTarget);
    });
  }

  // 4. Target Exam Filter
  if (state.ca.selectedExam !== 'all') {
    const examTarget = state.ca.selectedExam.toLowerCase();
    items = items.filter(i => Array.isArray(i.exam_tags) && i.exam_tags.some(tag => tag.toLowerCase().includes(examTarget)));
  }

  // 5. Search Query Filter
  const q = state.ca.searchQuery.trim().toLowerCase();
  if (q) {
    items = items.filter(i => {
      const titleMatch = (i.title || '').toLowerCase().includes(q);
      const cruxMatch = (i.crux || '').toLowerCase().includes(q);
      const summaryMatch = (i.summary || '').toLowerCase().includes(q);
      const catMatch = (i.category || '').toLowerCase().includes(q);
      const subcatMatch = (i.subcategory || '').toLowerCase().includes(q);
      const agencyMatch = (i.prelims_pointers?.key_agency || '').toLowerCase().includes(q);
      const factsMatch = (i.prelims_pointers?.facts_to_remember || '').toLowerCase().includes(q);
      const locationMatch = (i.prelims_pointers?.location || '').toLowerCase().includes(q);
      const statuteMatch = (i.prelims_pointers?.statutory_anchor || '').toLowerCase().includes(q);
      const takeawayMatch = Array.isArray(i.takeaways) && i.takeaways.some(t => t.toLowerCase().includes(q));
      return titleMatch || cruxMatch || summaryMatch || catMatch || subcatMatch || agencyMatch || factsMatch || locationMatch || statuteMatch || takeawayMatch;
    });
  }

  state.ca.filteredItems = items;

  // Update Result Count
  if (dom.caResultsCount) {
    dom.caResultsCount.textContent = `Showing ${items.length} dossier${items.length === 1 ? '' : 's'}`;
  }

  // Update Active Filter Bar
  updateCAActiveFilterBar();

  // Render cards
  renderCACards();
}

function updateCAActiveFilterBar() {
  if (!dom.caActiveFiltersBar || !dom.caActiveFilterText) return;
  const tags = [];
  if (state.ca.selectedCategory !== 'all') tags.push(`Subject: ${state.ca.selectedCategory}`);
  if (state.ca.selectedScope !== 'all') tags.push(`Scope: ${state.ca.selectedScope}`);
  if (state.ca.selectedSource && state.ca.selectedSource !== 'all') {
    const srcMap = { air: 'News On AIR (Akashvani)', pib: 'PIB Official', hindu: 'The Hindu', express: 'Indian Express', mint: 'LiveMint/ET' };
    tags.push(`Source: ${srcMap[state.ca.selectedSource] || state.ca.selectedSource}`);
  }
  if (state.ca.selectedExam !== 'all') tags.push(`Exam: ${state.ca.selectedExam}`);
  if (state.ca.searchQuery.trim()) tags.push(`Search: "${state.ca.searchQuery.trim()}"`);

  if (tags.length > 0) {
    dom.caActiveFilterText.textContent = tags.join(' • ');
    dom.caActiveFiltersBar.style.display = 'flex';
  } else {
    dom.caActiveFiltersBar.style.display = 'none';
  }
}

/**
 * Render Current Affairs Cards in Grid
 */
function renderCACards() {
  if (!dom.caGrid) return;
  dom.caGrid.innerHTML = '';

  const items = state.ca.filteredItems;

  if (items.length === 0) {
    if (dom.caEmptyState) dom.caEmptyState.style.display = 'block';
    dom.caGrid.style.display = 'none';
    return;
  }

  if (dom.caEmptyState) dom.caEmptyState.style.display = 'none';
  dom.caGrid.style.display = 'grid';

  const frag = document.createDocumentFragment();

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'ca-card';
    card.setAttribute('data-cat', item.category);
    card.setAttribute('data-id', item.id);

    const icon = CA_CATEGORY_ICONS[item.category] || '📌';
    const scopeLabel = item.scope === 'India' ? '🇮🇳 India' : (item.scope === 'World' ? '🌍 World' : '🌐 Bilateral');
    const isMaster = isMasterDossier(item);
    const isNewsOnAir = (item.source && (item.source.includes('AIR') || item.source.includes('newsonair'))) || (item.url && item.url.includes('newsonair.gov.in'));
    const dateFormatted = formatDateHuman(item.date);

    const takeawaysHtml = Array.isArray(item.takeaways) && item.takeaways.length > 0
      ? item.takeaways.slice(0, 2).map(t => `<li>${escapeHtml(t)}</li>`).join('')
      : `<li>${escapeHtml(item.summary || item.title)}</li>`;

    const agency = item.prelims_pointers?.key_agency || '';
    const factHint = item.prelims_pointers?.facts_to_remember || item.prelims_pointers?.statutory_anchor || '';

    const examTagsHtml = Array.isArray(item.exam_tags)
      ? item.exam_tags.map(t => `<span class="ca-exam-pill">${escapeHtml(t)}</span>`).join('')
      : '<span class="ca-exam-pill">UPSC</span>';

    card.innerHTML = `
      <div class="ca-card-header">
        <div class="ca-card-badges">
          <span class="ca-cat-badge">${icon} ${escapeHtml(item.category)}</span>
          <span class="ca-scope-badge">${scopeLabel}</span>
          ${isMaster ? '<span class="ca-vault-badge">⭐ Master Archive</span>' : ''}
          ${isNewsOnAir ? '<span class="ca-air-badge">🎙️ News On AIR</span>' : ''}
        </div>
        <span class="ca-card-date">${dateFormatted}</span>
      </div>

      <h3 class="ca-card-title">${escapeHtml(item.title)}</h3>

      <div class="ca-card-crux">
        <span class="crux-icon">⚡</span>
        <p class="crux-text">${escapeHtml(item.crux || item.summary || '')}</p>
      </div>

      <div class="ca-card-takeaways">
        <div class="takeaways-label">💡 High-Yield Exam Takeaways:</div>
        <ul class="takeaways-list">
          ${takeawaysHtml}
        </ul>
      </div>

      ${factHint || agency ? `
        <div class="ca-card-prelims-box">
          <span class="prelims-tag">📌 Prelims Fact:</span>
          <span class="prelims-fact-snippet">${escapeHtml(agency ? agency + ' — ' : '')}${escapeHtml(factHint)}</span>
        </div>
      ` : ''}

      <div class="ca-card-footer">
        <div class="ca-card-exam-tags">
          ${examTagsHtml}
        </div>
        <div class="ca-card-actions">
          <button class="ca-btn-study" title="Open complete exam study dossier with notes and quiz">
            Study Dossier ↗
          </button>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      openCADetailModal(item.id);
    });

    frag.appendChild(card);
  });

  dom.caGrid.appendChild(frag);
}

/**
 * Switch Sub-Navigation View: Vault, Daily, Capsules, or Quiz
 */
function switchCASubTab(tabName) {
  state.ca.activeSubTab = tabName;

  [dom.caSubtabVault, dom.caSubtabDaily, dom.caSubtabCapsules, dom.caSubtabQuiz].forEach(btn => {
    if (btn) btn.classList.toggle('active', btn.dataset.casub === tabName);
  });

  if (tabName === 'vault') {
    if (dom.caDossierPane) dom.caDossierPane.style.display = 'block';
    if (dom.caFilterSection) dom.caFilterSection.style.display = 'block';
    if (dom.caCapsulesPane) dom.caCapsulesPane.style.display = 'none';
    if (dom.caQuizPane) dom.caQuizPane.style.display = 'none';
    if (dom.caViewTitle) dom.caViewTitle.textContent = "📚 1-Year Master Vault (Curated Exam Dossiers)";
    applyCAFilters();
  } else if (tabName === 'daily') {
    if (dom.caDossierPane) dom.caDossierPane.style.display = 'block';
    if (dom.caFilterSection) dom.caFilterSection.style.display = 'block';
    if (dom.caCapsulesPane) dom.caCapsulesPane.style.display = 'none';
    if (dom.caQuizPane) dom.caQuizPane.style.display = 'none';
    if (dom.caViewTitle) dom.caViewTitle.textContent = "📅 Daily Live News Stream (Today & Fresh Feeds)";
    applyCAFilters();
  } else if (tabName === 'capsules') {
    if (dom.caDossierPane) dom.caDossierPane.style.display = 'none';
    if (dom.caFilterSection) dom.caFilterSection.style.display = 'none';
    if (dom.caCapsulesPane) dom.caCapsulesPane.style.display = 'block';
    if (dom.caQuizPane) dom.caQuizPane.style.display = 'none';
    renderCACapsules(state.ca.activeCapsuleTab || 'appointments');
  } else if (tabName === 'quiz') {
    if (dom.caDossierPane) dom.caDossierPane.style.display = 'none';
    if (dom.caFilterSection) dom.caFilterSection.style.display = 'none';
    if (dom.caCapsulesPane) dom.caCapsulesPane.style.display = 'none';
    if (dom.caQuizPane) dom.caQuizPane.style.display = 'block';
    renderCAQuizArena();
  }
}

/**
 * Render Prelims Fact Capsules (Speed Revision Tables)
 */
function renderCACapsules(tabKey) {
  state.ca.activeCapsuleTab = tabKey;

  if (dom.caCapsulesPane) {
    dom.caCapsulesPane.querySelectorAll('.capsule-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.capstab === tabKey);
    });
  }

  const config = CAPSULE_DATA_MAP[tabKey];
  if (!config || !dom.caCapsulesContainer) return;

  const dataList = (state.ca.factCapsules && state.ca.factCapsules[config.key]) || [];

  if (dataList.length === 0) {
    dom.caCapsulesContainer.innerHTML = `
      <div class="empty-state">
        <p>No capsule records found for this section yet.</p>
      </div>
    `;
    return;
  }

  const theadHtml = config.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('');
  const tbodyHtml = dataList.map(item => config.renderRow(item)).join('');

  dom.caCapsulesContainer.innerHTML = `
    <div class="capsule-card">
      <div class="capsule-card-header">
        <h4 class="capsule-title">${config.title}</h4>
        <p class="capsule-desc">${config.subtitle}</p>
      </div>
      <div class="table-responsive">
        <table class="capsule-table">
          <thead>
            <tr>${theadHtml}</tr>
          </thead>
          <tbody>
            ${tbodyHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Initialize and render Interactive MCQ Arena
 */
function initCAQuizArena() {
  const itemsWithMcq = state.ca.items.filter(i => i.mcq && i.mcq.question && Array.isArray(i.mcq.options));
  if (itemsWithMcq.length === 0) return;

  const shuffled = [...itemsWithMcq].sort(() => 0.5 - Math.random());
  state.ca.quiz = {
    questions: shuffled.slice(0, 10),
    currentIndex: 0,
    score: 0,
    answered: false,
    selectedOption: null
  };
}

function renderCAQuizArena() {
  if (!dom.caQuizCardWrapper) return;
  const quiz = state.ca.quiz;

  if (!quiz.questions || quiz.questions.length === 0) {
    initCAQuizArena();
  }

  if (quiz.currentIndex >= quiz.questions.length) {
    const pct = Math.round((quiz.score / quiz.questions.length) * 100);
    let msg = "Keep practicing! Review the 1-Year Master Vault to strengthen fundamentals.";
    if (pct >= 80) msg = "🌟 Exceptional Prelims Mastery! Outstanding accuracy across subjects.";
    else if (pct >= 50) msg = "👍 Good performance! Revise the Fact Capsules to hit 90%+ in the real exam.";

    dom.caQuizCardWrapper.innerHTML = `
      <div class="quiz-summary-card">
        <div class="quiz-summary-icon">🏆</div>
        <h3>Prelims MCQ Arena Completed!</h3>
        <div class="quiz-score-circle">
          <span class="quiz-score-number">${quiz.score} / ${quiz.questions.length}</span>
          <span class="quiz-score-pct">${pct}% Correct</span>
        </div>
        <p class="quiz-summary-feedback">${msg}</p>
        <div class="quiz-summary-actions">
          <button id="ca-retake-quiz-btn" class="btn btn-primary">🔄 Retake Arena (Fresh Questions)</button>
          <button id="ca-review-capsules-btn" class="btn btn-secondary">⚡ Revise Fact Capsules</button>
        </div>
      </div>
    `;

    const retakeBtn = document.getElementById('ca-retake-quiz-btn');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        initCAQuizArena();
        renderCAQuizArena();
      });
    }

    const reviewCapsulesBtn = document.getElementById('ca-review-capsules-btn');
    if (reviewCapsulesBtn) {
      reviewCapsulesBtn.addEventListener('click', () => {
        switchCASubTab('capsules');
      });
    }
    return;
  }

  const currentItem = quiz.questions[quiz.currentIndex];
  const mcq = currentItem.mcq;
  const qNum = quiz.currentIndex + 1;
  const totalQ = quiz.questions.length;

  dom.caQuizCardWrapper.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-header">
        <div class="quiz-meta-left">
          <span class="quiz-q-num">Question ${qNum} of ${totalQ}</span>
          <span class="ca-cat-badge" style="margin-left: 0.5rem;">${escapeHtml(currentItem.category)}</span>
        </div>
        <span class="quiz-score-pill">Score: ${quiz.score}/${totalQ}</span>
      </div>

      <div class="quiz-question-text">${escapeHtml(mcq.question)}</div>

      <div class="quiz-options-list" id="ca-quiz-options">
        ${mcq.options.map((opt, idx) => {
          let btnClass = 'quiz-opt-btn';
          let disabled = quiz.answered ? 'disabled' : '';
          if (quiz.answered) {
            if (idx === mcq.answer) btnClass += ' correct';
            else if (idx === quiz.selectedOption) btnClass += ' incorrect';
          }
          return `
            <button class="${btnClass}" data-opt-idx="${idx}" ${disabled}>
              <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
              <span class="opt-label">${escapeHtml(opt)}</span>
            </button>
          `;
        }).join('')}
      </div>

      ${quiz.answered ? `
        <div class="quiz-explanation-box">
          <span class="quiz-expl-badge">💡 Exam Explanation & High-Yield Analysis</span>
          <p class="quiz-expl-text">${escapeHtml(mcq.explanation || 'Refer to the dossier for complete details.')}</p>
        </div>
        <div class="quiz-action-row" style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
          <button id="ca-quiz-next-btn" class="btn btn-primary">
            ${quiz.currentIndex + 1 === totalQ ? 'Finish Arena & See Score 🏆' : 'Next Question →'}
          </button>
        </div>
      ` : ''}
    </div>
  `;

  if (!quiz.answered) {
    const optButtons = dom.caQuizCardWrapper.querySelectorAll('#ca-quiz-options .quiz-opt-btn');
    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIdx = parseInt(btn.dataset.optIdx, 10);
        quiz.answered = true;
        quiz.selectedOption = selectedIdx;
        if (selectedIdx === mcq.answer) {
          quiz.score++;
        }
        renderCAQuizArena();
      });
    });
  } else {
    const nextBtn = document.getElementById('ca-quiz-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        quiz.currentIndex++;
        quiz.answered = false;
        quiz.selectedOption = null;
        renderCAQuizArena();
      });
    }
  }
}

/**
 * Open Full Current Affairs Detail & Study Drawer Modal
 */
function openCADetailModal(id) {
  const item = state.ca.items.find(i => i.id === id);
  if (!item) return;

  state.ca.currentDetailItem = item;

  if (dom.caDetailCatBadge) dom.caDetailCatBadge.textContent = item.category;
  if (dom.caDetailScopeBadge) {
    dom.caDetailScopeBadge.textContent = item.scope === 'India' ? '🇮🇳 India Focus' : (item.scope === 'World' ? '🌍 World Focus' : '🌐 Bilateral');
  }
  if (dom.caDetailDate) dom.caDetailDate.textContent = '📅 ' + formatDateHuman(item.date);
  if (dom.caDetailTitle) dom.caDetailTitle.textContent = item.title;
  if (dom.caDetailSource) dom.caDetailSource.textContent = 'Source: ' + (item.source || 'Official');

  if (dom.caDetailCrux) dom.caDetailCrux.textContent = item.crux || item.summary || '';
  if (dom.caDetailTakeaways) {
    if (Array.isArray(item.takeaways) && item.takeaways.length > 0) {
      dom.caDetailTakeaways.innerHTML = item.takeaways.map(t => `<li>${escapeHtml(t)}</li>`).join('');
    } else {
      dom.caDetailTakeaways.innerHTML = `<li>${escapeHtml(item.summary || item.title)}</li>`;
    }
  }

  if (dom.caDetailAgency) dom.caDetailAgency.textContent = item.prelims_pointers?.key_agency || 'N/A';
  if (dom.caDetailStatute) dom.caDetailStatute.textContent = item.prelims_pointers?.statutory_anchor || 'N/A';
  if (dom.caDetailLocation) dom.caDetailLocation.textContent = item.prelims_pointers?.location || 'N/A';
  if (dom.caDetailFacts) dom.caDetailFacts.textContent = item.prelims_pointers?.facts_to_remember || 'N/A';

  if (dom.caDetailMcqBox) {
    if (item.mcq && item.mcq.question && Array.isArray(item.mcq.options)) {
      renderCADetailMcq(item.mcq);
    } else {
      dom.caDetailMcqBox.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">Practice question will be generated in tomorrow\'s update.</p>';
    }
  }

  if (dom.caDetailNotesInput) {
    dom.caDetailNotesInput.value = localStorage.getItem('ca-notes-' + item.id) || '';
  }
  if (dom.caNotesStatus) dom.caNotesStatus.textContent = 'Auto-saved locally';

  if (dom.caDetailSourceLink) {
    dom.caDetailSourceLink.href = item.url || '#';
  }

  stopCADetailTts();

  if (dom.caDetailModal) dom.caDetailModal.style.display = 'flex';
}

function renderCADetailMcq(mcq) {
  if (!dom.caDetailMcqBox) return;
  let detailAnswered = false;

  dom.caDetailMcqBox.innerHTML = `
    <p class="quiz-question-text" style="font-size: 0.95rem; margin-bottom: 0.75rem;">${escapeHtml(mcq.question)}</p>
    <div class="quiz-options-list" id="modal-mcq-options">
      ${mcq.options.map((opt, idx) => `
        <button class="quiz-opt-btn" data-opt-idx="${idx}" style="padding: 0.6rem 0.85rem;">
          <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
          <span class="opt-label">${escapeHtml(opt)}</span>
        </button>
      `).join('')}
    </div>
    <div id="modal-mcq-expl" class="quiz-explanation-box" style="display: none; margin-top: 0.75rem;">
      <span class="quiz-expl-badge">💡 Analysis & Answer</span>
      <p class="quiz-expl-text" style="font-size: 0.85rem; margin-top: 0.35rem;">${escapeHtml(mcq.explanation)}</p>
    </div>
  `;

  const optButtons = dom.caDetailMcqBox.querySelectorAll('#modal-mcq-options .quiz-opt-btn');
  optButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (detailAnswered) return;
      detailAnswered = true;
      const selected = parseInt(btn.dataset.optIdx, 10);
      optButtons.forEach((b, idx) => {
        b.disabled = true;
        if (idx === mcq.answer) b.classList.add('correct');
        else if (idx === selected) b.classList.add('incorrect');
      });
      const expl = dom.caDetailMcqBox.querySelector('#modal-mcq-expl');
      if (expl) expl.style.display = 'block';
    });
  });
}

function closeCADetailModal() {
  stopCADetailTts();
  if (dom.caDetailModal) dom.caDetailModal.style.display = 'none';
  state.ca.currentDetailItem = null;
}

function handleCADetailTts() {
  const item = state.ca.currentDetailItem;
  if (!item || !window.speechSynthesis) {
    showToast('Text-to-speech is not supported on this browser.');
    return;
  }

  if (state.ca.tts.isSpeaking) {
    stopCADetailTts();
    return;
  }

  window.speechSynthesis.cancel();

  const narrationText = `${item.title}. Crux: ${item.crux || item.summary}. Key exam takeaways: ${(item.takeaways || []).join('. ')}. Key Agency: ${item.prelims_pointers?.key_agency || ''}. Prelims facts: ${item.prelims_pointers?.facts_to_remember || ''}`;

  const utterance = new SpeechSynthesisUtterance(narrationText);
  utterance.rate = state.preferences.speechSpeed || 1.0;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    state.ca.tts.isSpeaking = true;
    if (dom.caTtsIcon) dom.caTtsIcon.textContent = '⏸️';
    if (dom.caTtsLabel) dom.caTtsLabel.textContent = 'Pause Brief';
    if (dom.caDetailTtsStop) dom.caDetailTtsStop.style.display = 'inline-flex';
  };

  utterance.onend = () => {
    stopCADetailTts();
  };

  utterance.onerror = () => {
    stopCADetailTts();
  };

  state.ca.tts.utterance = utterance;
  window.speechSynthesis.speak(utterance);
}

function stopCADetailTts() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  state.ca.tts.isSpeaking = false;
  state.ca.tts.utterance = null;
  if (dom.caTtsIcon) dom.caTtsIcon.textContent = '🔊';
  if (dom.caTtsLabel) dom.caTtsLabel.textContent = 'Listen to Brief';
  if (dom.caDetailTtsStop) dom.caDetailTtsStop.style.display = 'none';
}

function exportCAMarkdown() {
  const items = state.ca.filteredItems.length > 0 ? state.ca.filteredItems : state.ca.items;
  if (!items || items.length === 0) {
    showToast('No current affairs dossiers to export.');
    return;
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  let md = `# Daily Editorial Hub • Current Affairs 360° Compendium\n`;
  md += `*Export Date: ${todayStr} | Total Exam Dossiers: ${items.length}*\n\n`;
  md += `Coverage: Banking, Polity, Economy, Science & Tech, Defence, History/Culture, Sports, National & International Events.\n\n`;
  md += `---\n\n`;

  items.forEach((item, idx) => {
    md += `## ${idx + 1}. ${item.title}\n`;
    md += `- **Date:** ${item.date} | **Category:** ${item.category} | **Scope:** ${item.scope}\n`;
    md += `- **Target Exams:** ${(item.exam_tags || []).join(', ')}\n`;
    md += `- **Source:** ${item.source || 'Official Release'} ([Link](${item.url || '#'}))\n\n`;

    md += `### ⚡ 30-Second Exam Crux\n`;
    md += `> ${item.crux || item.summary}\n\n`;

    md += `### 💡 Key Exam Takeaways\n`;
    (item.takeaways || []).forEach(t => {
      md += `- ${t}\n`;
    });
    md += `\n`;

    if (item.prelims_pointers) {
      md += `### 📌 Prelims Fact Capsule\n`;
      md += `- **Key Agency:** ${item.prelims_pointers.key_agency || 'N/A'}\n`;
      md += `- **Statutory / Constitutional Anchor:** ${item.prelims_pointers.statutory_anchor || 'N/A'}\n`;
      md += `- **Location / Scope:** ${item.prelims_pointers.location || 'N/A'}\n`;
      md += `- **Facts to Remember:** ${item.prelims_pointers.facts_to_remember || 'N/A'}\n\n`;
    }

    if (item.mcq) {
      md += `### 🎯 Prelims Practice MCQ\n`;
      md += `**Q:** ${item.mcq.question}\n\n`;
      (item.mcq.options || []).forEach((opt, oIdx) => {
        const letter = String.fromCharCode(65 + oIdx);
        const marker = oIdx === item.mcq.answer ? ' *(Correct)*' : '';
        md += `- **${letter})** ${opt}${marker}\n`;
      });
      md += `\n**Explanation:** ${item.mcq.explanation}\n\n`;
    }

    const personalNote = localStorage.getItem('ca-notes-' + item.id);
    if (personalNote) {
      md += `### 📝 My Personal Revision Notes\n`;
      md += `${personalNote}\n\n`;
    }

    md += `---\n\n`;
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Current_Affairs_Compendium_${todayStr}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Exported ${items.length} dossiers to Markdown!`);
}

function exportSingleCADossier(item) {
  if (!item) return;
  let md = `# ${item.title}\n`;
  md += `- **Date:** ${item.date} | **Category:** ${item.category} | **Scope:** ${item.scope}\n`;
  md += `- **Target Exams:** ${(item.exam_tags || []).join(', ')}\n\n`;
  md += `## ⚡ 30-Second Crux\n> ${item.crux || item.summary}\n\n`;
  md += `## 💡 Key Takeaways\n`;
  (item.takeaways || []).forEach(t => md += `- ${t}\n`);
  md += `\n## 📌 Prelims Facts\n`;
  md += `- Agency: ${item.prelims_pointers?.key_agency || 'N/A'}\n`;
  md += `- Statute: ${item.prelims_pointers?.statutory_anchor || 'N/A'}\n`;
  md += `- Facts: ${item.prelims_pointers?.facts_to_remember || 'N/A'}\n\n`;
  const note = localStorage.getItem('ca-notes-' + item.id);
  if (note) md += `## 📝 My Notes\n${note}\n\n`;

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${item.id}_Notes.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Note exported!');
}

async function syncLiveCAFeeds() {
  if (dom.caSyncSpinner) dom.caSyncSpinner.classList.add('spinning');
  if (dom.caSyncLabel) dom.caSyncLabel.textContent = 'Syncing...';

  try {
    const targetUrl = 'https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1';
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
    
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error('Proxy error');
    const data = await res.json();
    const parser = new DOMParser();
    const xml = parser.parseFromString(data.contents, 'text/xml');
    const items = Array.from(xml.querySelectorAll('item'));

    if (items.length > 0) {
      const todayStr = new Date().toISOString().slice(0, 10);
      const newDossiers = [];

      items.slice(0, 10).forEach((node, i) => {
        const title = (node.querySelector('title')?.textContent || '').trim();
        const link = (node.querySelector('link')?.textContent || '').trim();
        const desc = (node.querySelector('description')?.textContent || '').trim();

        if (title) {
          const id = `ca-${todayStr}-live-${i + 1}`;
          if (!state.ca.items.some(existing => existing.title === title)) {
            newDossiers.push({
              id,
              title,
              date: todayStr,
              category: "National Affairs & Schemes",
              subcategory: "PIB Live Feed",
              scope: "India",
              exam_tags: ["UPSC", "State PCS", "Banking", "SSC"],
              summary: desc || title,
              crux: `Official government release: ${title}. Key national update issued via Press Information Bureau.`,
              takeaways: [
                desc || "Details and guidelines issued under official government notification.",
                "High relevance for national policy and scheme monitoring."
              ],
              prelims_pointers: {
                key_agency: "Government of India / PIB",
                statutory_anchor: "Executive Notification",
                location: "New Delhi, India",
                facts_to_remember: title
              },
              mcq: {
                question: `Which ministry or government entity issued the recent briefing: "${title.slice(0, 70)}..."?`,
                options: ["Press Information Bureau (PIB)", "Reserve Bank of India", "Ministry of Finance", "NITI Aayog"],
                answer: 0,
                explanation: "Released via the official Press Information Bureau (PIB) daily dispatch."
              },
              source: "PIB Official Live",
              url: link
            });
          }
        }
      });

      if (newDossiers.length > 0) {
        const localLiveCache = JSON.parse(localStorage.getItem('ca-live-cache') || '[]');
        const updatedCache = [...newDossiers, ...localLiveCache];
        localStorage.setItem('ca-live-cache', JSON.stringify(updatedCache.slice(0, 50)));

        state.ca.items = [...newDossiers, ...state.ca.items];
        applyCAFilters();
        showToast(`Synced ${newDossiers.length} fresh current affairs updates!`);
      } else {
        showToast('All current affairs feeds are already up to date!');
      }
    } else {
      showToast('All current affairs feeds are already up to date!');
    }
  } catch (err) {
    console.warn('Live sync fallback:', err);
    showToast('Live RSS sync attempted. Datasets refreshed from cache.');
  } finally {
    if (dom.caSyncSpinner) dom.caSyncSpinner.classList.remove('spinning');
    if (dom.caSyncLabel) dom.caSyncLabel.textContent = 'Sync Live Feeds';
  }
}

function resetCAFilters() {
  state.ca.selectedCategory = 'all';
  state.ca.selectedScope = 'all';
  state.ca.selectedExam = 'all';
  state.ca.selectedSource = 'all';
  state.ca.searchQuery = '';
  if (dom.caSearchInput) dom.caSearchInput.value = '';
  if (dom.caClearSearchBtn) dom.caClearSearchBtn.style.display = 'none';

  if (dom.caCategoryFilters) {
    dom.caCategoryFilters.querySelectorAll('.filter-pill').forEach(b => {
      b.classList.toggle('active', b.dataset.cacat === 'all');
    });
  }
  if (dom.caScopeFilters) {
    dom.caScopeFilters.querySelectorAll('.filter-pill').forEach(b => {
      b.classList.toggle('active', b.dataset.cascope === 'all');
    });
  }
  if (dom.caSourceFilters) {
    dom.caSourceFilters.querySelectorAll('.filter-pill').forEach(b => {
      b.classList.toggle('active', b.dataset.casource === 'all');
    });
  }
  if (dom.caExamFilters) {
    dom.caExamFilters.querySelectorAll('.filter-pill').forEach(b => {
      b.classList.toggle('active', b.dataset.caexam === 'all');
    });
  }
  applyCAFilters();
}

/**
 * Setup All Event Listeners
 */
function setupEventListeners() {
  function setActiveHubTab(target) {
    [dom.tabEditorials, dom.tabCA, dom.tabFlashcards, dom.tabQuiz, dom.tabVault, dom.tabWriting, dom.tabCompare].forEach(tab => {
      if (tab) tab.classList.toggle('active', tab.dataset.target === target);
    });

    if (target === 'ca') {
      if (dom.editorialsViewContainer) dom.editorialsViewContainer.style.display = 'none';
      if (dom.caViewContainer) dom.caViewContainer.style.display = 'block';
    } else {
      if (dom.caViewContainer) dom.caViewContainer.style.display = 'none';
      if (dom.editorialsViewContainer) dom.editorialsViewContainer.style.display = 'block';
    }
  }

  // Resource Hub Ribbon Tabs
  if (dom.tabEditorials) {
    dom.tabEditorials.addEventListener('click', () => {
      setActiveHubTab('editorials');
      if (dom.flashcardModal) dom.flashcardModal.style.display = 'none';
      if (dom.quizModal) dom.quizModal.style.display = 'none';
      if (dom.knowledgeVaultModal) dom.knowledgeVaultModal.style.display = 'none';
      if (dom.vocabModal) dom.vocabModal.style.display = 'none';
      if (dom.writingStudioModal) dom.writingStudioModal.style.display = 'none';
      if (dom.compareModal) dom.compareModal.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  if (dom.tabCA) {
    dom.tabCA.addEventListener('click', () => {
      setActiveHubTab('ca');
      if (dom.flashcardModal) dom.flashcardModal.style.display = 'none';
      if (dom.quizModal) dom.quizModal.style.display = 'none';
      if (dom.knowledgeVaultModal) dom.knowledgeVaultModal.style.display = 'none';
      if (dom.vocabModal) dom.vocabModal.style.display = 'none';
      if (dom.writingStudioModal) dom.writingStudioModal.style.display = 'none';
      if (dom.compareModal) dom.compareModal.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  if (dom.tabFlashcards) {
    dom.tabFlashcards.addEventListener('click', () => {
      setActiveHubTab('flashcards');
      if (dom.quizModal) dom.quizModal.style.display = 'none';
      if (dom.knowledgeVaultModal) dom.knowledgeVaultModal.style.display = 'none';
      if (dom.vocabModal) dom.vocabModal.style.display = 'none';
      if (dom.writingStudioModal) dom.writingStudioModal.style.display = 'none';
      if (dom.compareModal) dom.compareModal.style.display = 'none';
      buildFlashcardDeck();
      dom.flashcardModal.style.display = 'flex';
    });
  }
  if (dom.tabQuiz) {
    dom.tabQuiz.addEventListener('click', () => {
      setActiveHubTab('quiz');
      if (dom.flashcardModal) dom.flashcardModal.style.display = 'none';
      if (dom.knowledgeVaultModal) dom.knowledgeVaultModal.style.display = 'none';
      if (dom.vocabModal) dom.vocabModal.style.display = 'none';
      if (dom.writingStudioModal) dom.writingStudioModal.style.display = 'none';
      if (dom.compareModal) dom.compareModal.style.display = 'none';
      startDailyMockQuiz();
    });
  }
  if (dom.tabVault) {
    dom.tabVault.addEventListener('click', () => {
      setActiveHubTab('vault');
      if (dom.flashcardModal) dom.flashcardModal.style.display = 'none';
      if (dom.quizModal) dom.quizModal.style.display = 'none';
      if (dom.vocabModal) dom.vocabModal.style.display = 'none';
      if (dom.writingStudioModal) dom.writingStudioModal.style.display = 'none';
      if (dom.compareModal) dom.compareModal.style.display = 'none';
      openKnowledgeVault();
    });
  }
  if (dom.tabWriting) {
    dom.tabWriting.addEventListener('click', () => {
      setActiveHubTab('writing');
      if (dom.flashcardModal) dom.flashcardModal.style.display = 'none';
      if (dom.quizModal) dom.quizModal.style.display = 'none';
      if (dom.knowledgeVaultModal) dom.knowledgeVaultModal.style.display = 'none';
      if (dom.vocabModal) dom.vocabModal.style.display = 'none';
      if (dom.compareModal) dom.compareModal.style.display = 'none';
      openWritingStudio();
    });
  }
  if (dom.tabCompare) {
    dom.tabCompare.addEventListener('click', () => {
      setActiveHubTab('compare');
      if (dom.flashcardModal) dom.flashcardModal.style.display = 'none';
      if (dom.quizModal) dom.quizModal.style.display = 'none';
      if (dom.knowledgeVaultModal) dom.knowledgeVaultModal.style.display = 'none';
      if (dom.vocabModal) dom.vocabModal.style.display = 'none';
      if (dom.writingStudioModal) dom.writingStudioModal.style.display = 'none';
      openCompareModal();
    });
  }

  // Current Affairs 360° Event Listeners
  if (dom.caSubtabVault) dom.caSubtabVault.addEventListener('click', () => switchCASubTab('vault'));
  if (dom.caSubtabDaily) dom.caSubtabDaily.addEventListener('click', () => switchCASubTab('daily'));
  if (dom.caSubtabCapsules) dom.caSubtabCapsules.addEventListener('click', () => switchCASubTab('capsules'));
  if (dom.caSubtabQuiz) dom.caSubtabQuiz.addEventListener('click', () => switchCASubTab('quiz'));

  if (dom.caSourceFilters) {
    dom.caSourceFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      dom.caSourceFilters.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.ca.selectedSource = btn.dataset.casource || 'all';
      applyCAFilters();
    });
  }

  if (dom.caScopeFilters) {
    dom.caScopeFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      dom.caScopeFilters.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.ca.selectedScope = btn.dataset.cascope || 'all';
      applyCAFilters();
    });
  }

  if (dom.caExamFilters) {
    dom.caExamFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      dom.caExamFilters.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.ca.selectedExam = btn.dataset.caexam || 'all';
      applyCAFilters();
    });
  }

  if (dom.caCategoryFilters) {
    dom.caCategoryFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      dom.caCategoryFilters.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.ca.selectedCategory = btn.dataset.cacat || 'all';
      applyCAFilters();
    });
  }

  if (dom.caSearchInput) {
    dom.caSearchInput.addEventListener('input', (e) => {
      state.ca.searchQuery = e.target.value;
      if (dom.caClearSearchBtn) {
        dom.caClearSearchBtn.style.display = state.ca.searchQuery ? 'block' : 'none';
      }
      applyCAFilters();
    });
  }

  if (dom.caClearSearchBtn) {
    dom.caClearSearchBtn.addEventListener('click', () => {
      if (dom.caSearchInput) dom.caSearchInput.value = '';
      state.ca.searchQuery = '';
      dom.caClearSearchBtn.style.display = 'none';
      applyCAFilters();
    });
  }

  if (dom.caResetFiltersBtn) dom.caResetFiltersBtn.addEventListener('click', resetCAFilters);
  if (dom.caEmptyResetBtn) dom.caEmptyResetBtn.addEventListener('click', resetCAFilters);

  if (dom.caSyncLiveBtn) dom.caSyncLiveBtn.addEventListener('click', syncLiveCAFeeds);
  if (dom.caExportBtn) dom.caExportBtn.addEventListener('click', exportCAMarkdown);
  if (dom.caPrintBtn) dom.caPrintBtn.addEventListener('click', () => window.print());

  if (dom.caCapsulesPane) {
    dom.caCapsulesPane.addEventListener('click', (e) => {
      const btn = e.target.closest('.capsule-nav-btn');
      if (!btn) return;
      renderCACapsules(btn.dataset.capstab);
    });
  }

  if (dom.closeCaDetailModal) dom.closeCaDetailModal.addEventListener('click', closeCADetailModal);
  if (dom.caDetailModal) {
    dom.caDetailModal.addEventListener('click', (e) => {
      if (e.target === dom.caDetailModal) closeCADetailModal();
    });
  }
  if (dom.caDetailTtsBtn) dom.caDetailTtsBtn.addEventListener('click', handleCADetailTts);
  if (dom.caDetailTtsStop) dom.caDetailTtsStop.addEventListener('click', stopCADetailTts);

  let caNotesSaveTimeout;
  if (dom.caDetailNotesInput) {
    dom.caDetailNotesInput.addEventListener('input', (e) => {
      if (!state.ca.currentDetailItem) return;
      if (dom.caNotesStatus) dom.caNotesStatus.textContent = 'Saving...';
      clearTimeout(caNotesSaveTimeout);
      caNotesSaveTimeout = setTimeout(() => {
        localStorage.setItem('ca-notes-' + state.ca.currentDetailItem.id, e.target.value);
        if (dom.caNotesStatus) dom.caNotesStatus.textContent = 'Auto-saved locally ✓';
      }, 300);
    });
  }

  if (dom.caDetailExportMd) {
    dom.caDetailExportMd.addEventListener('click', () => {
      if (state.ca.currentDetailItem) {
        exportSingleCADossier(state.ca.currentDetailItem);
      }
    });
  }

  // Flashcards Modal
  if (dom.closeFlashcardModal) {
    dom.closeFlashcardModal.addEventListener('click', () => {
      dom.flashcardModal.style.display = 'none';
      setActiveHubTab('editorials');
    });
  }
  if (dom.flashcardScene) {
    dom.flashcardScene.addEventListener('click', flipFlashcard);
  }
  if (dom.fcNextBtn) dom.fcNextBtn.addEventListener('click', nextFlashcard);
  if (dom.fcPrevBtn) dom.fcPrevBtn.addEventListener('click', prevFlashcard);
  if (dom.fcMarkMasterBtn) dom.fcMarkMasterBtn.addEventListener('click', markFlashcardMastered);
  if (dom.fcMarkReviewBtn) dom.fcMarkReviewBtn.addEventListener('click', markFlashcardReview);

  const fcFilterBtns = dom.flashcardModal?.querySelectorAll('.fc-filter-btn');
  fcFilterBtns?.forEach(btn => {
    btn.addEventListener('click', () => {
      fcFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterFlashcards(btn.dataset.fcFilter);
    });
  });

  // Quiz Modal
  if (dom.closeQuizModal) {
    dom.closeQuizModal.addEventListener('click', () => {
      dom.quizModal.style.display = 'none';
      setActiveHubTab('editorials');
    });
  }
  if (dom.quizNextBtn) {
    dom.quizNextBtn.addEventListener('click', nextQuizQuestion);
  }
  if (dom.retakeQuizBtn) {
    dom.retakeQuizBtn.addEventListener('click', startDailyMockQuiz);
  }

  // Knowledge Vault Modal
  if (dom.closeVaultModal) {
    dom.closeVaultModal.addEventListener('click', () => {
      dom.knowledgeVaultModal.style.display = 'none';
      setActiveHubTab('editorials');
    });
  }
  if (dom.vaultModalDone) {
    dom.vaultModalDone.addEventListener('click', () => {
      dom.knowledgeVaultModal.style.display = 'none';
      setActiveHubTab('editorials');
    });
  }
  const vaultTabBtns = dom.knowledgeVaultModal?.querySelectorAll('.vault-tab-btn');
  vaultTabBtns?.forEach(btn => {
    btn.addEventListener('click', () => switchVaultTab(btn.dataset.vaultTab));
  });

  // Personal Notes auto-save
  if (dom.readerNotesInput) {
    dom.readerNotesInput.addEventListener('input', handleNotesInput);
  }

  // Markdown & Print actions
  if (dom.readerExportBtn) {
    dom.readerExportBtn.addEventListener('click', exportArticleToMarkdown);
  }
  if (dom.readerPrintBtn) {
    dom.readerPrintBtn.addEventListener('click', printArticleHandout);
  }

  // Live Refresh Buttons
  if (dom.refreshFeedsBtn) dom.refreshFeedsBtn.addEventListener('click', fetchLiveRSSFeeds);
  if (dom.modalFetchAllBtn) dom.modalFetchAllBtn.addEventListener('click', fetchLiveRSSFeeds);

  // RSS Manager Modal
  if (dom.rssManagerBtn) {
    dom.rssManagerBtn.addEventListener('click', () => {
      renderRssFeedsManager();
      dom.rssModal.style.display = 'flex';
    });
  }
  if (dom.closeRssModal) dom.closeRssModal.addEventListener('click', () => dom.rssModal.style.display = 'none');
  if (dom.rssModalDone) dom.rssModalDone.addEventListener('click', () => dom.rssModal.style.display = 'none');

  // Add Custom Feed
  if (dom.addCustomFeedBtn) {
    dom.addCustomFeedBtn.addEventListener('click', () => {
      const name = (dom.customFeedName.value || '').trim();
      const url = (dom.customFeedUrl.value || '').trim();
      const cat = dom.customFeedCat.value;

      if (!name || !url) {
        showToast('Please enter both Publication Name and RSS Feed URL.');
        return;
      }

      state.customFeeds.push({ name, url, category: cat, icon: '📑', tone: 'Analytical' });
      localStorage.setItem('editorial-custom-feeds', JSON.stringify(state.customFeeds));
      dom.customFeedName.value = '';
      dom.customFeedUrl.value = '';
      renderRssFeedsManager();
      showToast(`Added ${name}! Syncing feed now...`);
      fetchLiveRSSFeeds();
    });
  }

  // Search
  dom.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    dom.clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
    applyFilters();
  });

  dom.clearSearchBtn.addEventListener('click', () => {
    state.searchQuery = '';
    dom.searchInput.value = '';
    dom.clearSearchBtn.style.display = 'none';
    applyFilters();
  });

  // Source Filters
  dom.sourceFilters.addEventListener('click', (e) => {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;
    dom.sourceFilters.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    state.selectedSource = pill.dataset.source;
    applyFilters();
  });

  // Category Filters
  dom.categoryFilters.addEventListener('click', (e) => {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;
    dom.categoryFilters.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    state.selectedCategory = pill.dataset.cat;
    applyFilters();
  });

  // GS Syllabus Filters
  if (dom.gsFilters) {
    dom.gsFilters.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;
      dom.gsFilters.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.selectedGS = pill.dataset.gs;
      applyFilters();
    });
  }

  // Date Navigation
  dom.prevDateBtn.addEventListener('click', () => navigateDate(1));
  dom.nextDateBtn.addEventListener('click', () => navigateDate(-1));
  dom.todayBtn.addEventListener('click', () => {
    if (state.availableDates.length > 0) {
      state.selectedDate = state.availableDates[0];
      applyFilters();
    }
  });
  dom.allDatesBtn.addEventListener('click', () => {
    state.selectedDate = 'all';
    applyFilters();
  });

  // Reset links
  dom.resetFiltersBtn.addEventListener('click', resetAllFilters);
  dom.emptyResetBtn.addEventListener('click', resetAllFilters);

  // Bookmarks
  dom.bookmarksBtn.addEventListener('click', openBookmarksModal);
  dom.closeBookmarksModal.addEventListener('click', () => dom.bookmarksModal.style.display = 'none');
  dom.closeBookmarksBtn.addEventListener('click', () => dom.bookmarksModal.style.display = 'none');
  dom.clearAllBookmarksBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all saved bookmarks?')) {
      state.bookmarks.clear();
      localStorage.removeItem('editorial-bookmarks');
      updateBookmarkBadge();
      openBookmarksModal();
      renderArticles();
    }
  });

  // Vocab Deck Modal
  if (dom.vocabModalToggle) dom.vocabModalToggle.addEventListener('click', openVocabModal);
  if (dom.closeVocabModal) dom.closeVocabModal.addEventListener('click', () => dom.vocabModal.style.display = 'none');
  if (dom.vocabModalDone) dom.vocabModalDone.addEventListener('click', () => dom.vocabModal.style.display = 'none');
  if (dom.openFlashcardsFromVocabBtn) {
    dom.openFlashcardsFromVocabBtn.addEventListener('click', () => {
      dom.vocabModal.style.display = 'none';
      setActiveHubTab('flashcards');
      buildFlashcardDeck();
      dom.flashcardModal.style.display = 'flex';
    });
  }

  // Streak & Habit Tracker Modal
  if (dom.streakTrackerBtn) {
    dom.streakTrackerBtn.addEventListener('click', () => {
      renderStreakModal();
      dom.streakModal.style.display = 'flex';
    });
  }
  if (dom.closeStreakModal) dom.closeStreakModal.addEventListener('click', () => dom.streakModal.style.display = 'none');
  if (dom.streakModalDone) dom.streakModalDone.addEventListener('click', () => dom.streakModal.style.display = 'none');
  if (dom.resetStreakBtn) {
    dom.resetStreakBtn.addEventListener('click', () => {
      if (confirm('Reset your daily habit streak counter and progress?')) {
        const todayStr = new Date().toISOString().split('T')[0];
        state.streak = {
          current: 1,
          lastActiveDate: todayStr,
          targets: { readCount: 0, flashcardsCount: 0, quizCompleted: false, answersCount: 0 }
        };
        saveStudyStreak();
        renderStreakModal();
        showToast('Daily habit targets reset.');
      }
    });
  }

  // Mains Answer Writing Studio Modal
  if (dom.openWritingStudioBtn) {
    dom.openWritingStudioBtn.addEventListener('click', () => {
      if (state.currentArticle) {
        openWritingStudio(state.currentArticle.practice_question, state.currentArticle.title, state.currentArticle.id);
      } else {
        openWritingStudio();
      }
    });
  }
  if (dom.closeWritingModal) {
    dom.closeWritingModal.addEventListener('click', () => {
      dom.writingStudioModal.style.display = 'none';
      setActiveHubTab('editorials');
    });
  }
  if (dom.writingSaveDoneBtn) {
    dom.writingSaveDoneBtn.addEventListener('click', () => {
      dom.writingStudioModal.style.display = 'none';
      setActiveHubTab('editorials');
      showToast('Answer draft saved locally! ✍️');
    });
  }
  if (dom.writingTimerToggleBtn) {
    dom.writingTimerToggleBtn.addEventListener('click', toggleWritingTimer);
  }
  if (dom.writingTimerResetBtn) {
    dom.writingTimerResetBtn.addEventListener('click', resetWritingTimer);
  }
  if (dom.writingEditorInput) {
    dom.writingEditorInput.addEventListener('input', handleWritingInput);
  }
  if (dom.writingInsertFrameworkBtn) {
    dom.writingInsertFrameworkBtn.addEventListener('click', insertSkeletonOutline);
  }
  if (dom.writingClearBtn) {
    dom.writingClearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your current draft?')) {
        dom.writingEditorInput.value = '';
        handleWritingInput();
      }
    });
  }
  if (dom.writingCopyBtn) dom.writingCopyBtn.addEventListener('click', copyWritingAnswer);
  if (dom.writingExportBtn) dom.writingExportBtn.addEventListener('click', exportWritingToMarkdown);

  if (dom.writingStudioModal) {
    dom.writingStudioModal.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        dom.writingStudioModal.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const secs = parseInt(btn.dataset.time, 10);
        const words = parseInt(btn.dataset.words, 10);
        setWritingTimerPreset(secs, words);
      });
    });
  }

  // Dual Comparison Modal
  if (dom.compareModalBtn) {
    dom.compareModalBtn.addEventListener('click', openCompareModal);
  }
  if (dom.closeCompareModal) {
    dom.closeCompareModal.addEventListener('click', () => {
      dom.compareModal.style.display = 'none';
      setActiveHubTab('editorials');
    });
  }
  if (dom.compareModalDone) {
    dom.compareModalDone.addEventListener('click', () => {
      dom.compareModal.style.display = 'none';
      setActiveHubTab('editorials');
    });
  }
  if (dom.compareSelectLeft) {
    dom.compareSelectLeft.addEventListener('change', () => {
      renderCompareColumn(dom.compareSelectLeft.value, dom.compareColLeft);
    });
  }
  if (dom.compareSelectRight) {
    dom.compareSelectRight.addEventListener('change', () => {
      renderCompareColumn(dom.compareSelectRight.value, dom.compareColRight);
    });
  }

  // Synchronized scrolling for dual comparison
  let isSyncingLeft = false;
  let isSyncingRight = false;
  if (dom.compareColLeft && dom.compareColRight) {
    dom.compareColLeft.addEventListener('scroll', () => {
      if (dom.syncScrollToggle && !dom.syncScrollToggle.checked) return;
      if (!isSyncingLeft) {
        isSyncingRight = true;
        const pct = dom.compareColLeft.scrollTop / (dom.compareColLeft.scrollHeight - dom.compareColLeft.clientHeight);
        dom.compareColRight.scrollTop = pct * (dom.compareColRight.scrollHeight - dom.compareColRight.clientHeight);
      }
      isSyncingLeft = false;
    });

    dom.compareColRight.addEventListener('scroll', () => {
      if (dom.syncScrollToggle && !dom.syncScrollToggle.checked) return;
      if (!isSyncingRight) {
        isSyncingLeft = true;
        const pct = dom.compareColRight.scrollTop / (dom.compareColRight.scrollHeight - dom.compareColRight.clientHeight);
        dom.compareColLeft.scrollTop = pct * (dom.compareColLeft.scrollHeight - dom.compareColLeft.clientHeight);
      }
      isSyncingRight = false;
    });
  }

  // Mind map layout toggle
  if (dom.toggleMindmapLayoutBtn) {
    dom.toggleMindmapLayoutBtn.addEventListener('click', () => {
      dom.readerMindmapContainer.classList.toggle('mindmap-compact');
      showToast('Toggled mind map layout view');
    });
  }

  // Click outside to dismiss modal overlays
  [
    dom.flashcardModal,
    dom.quizModal,
    dom.knowledgeVaultModal,
    dom.vocabModal,
    dom.bookmarksModal,
    dom.settingsModal,
    dom.rssModal,
    dom.streakModal,
    dom.writingStudioModal,
    dom.compareModal
  ].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
          setActiveHubTab('editorials');
        }
      });
    }
  });

  // Random Pick (Surprise Me)
  dom.randomPickBtn.addEventListener('click', () => {
    const pool = state.filteredArticles.length > 0 ? state.filteredArticles : state.articles;
    if (pool.length > 0) {
      const randomArticle = pool[Math.floor(Math.random() * pool.length)];
      openReader(randomArticle.id);
    }
  });

  // Theme Toggle Dropdown
  dom.themeToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dom.themeMenu.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    dom.themeMenu.classList.remove('show');
  });

  dom.themeMenu.addEventListener('click', (e) => {
    const item = e.target.closest('.dropdown-item');
    if (!item) return;
    setTheme(item.dataset.themeVal);
    dom.themeMenu.classList.remove('show');
  });

  // Reader Settings Modal
  dom.readerSettingsBtn.addEventListener('click', () => {
    dom.settingsModal.style.display = 'flex';
  });
  dom.closeSettingsModal.addEventListener('click', () => {
    dom.settingsModal.style.display = 'none';
  });
  dom.saveSettingsBtn.addEventListener('click', () => {
    dom.settingsModal.style.display = 'none';
  });

  dom.settingsModal.querySelectorAll('.font-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => applyReaderFont(btn.dataset.font));
  });

  dom.settingsModal.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => applyReaderSize(btn.dataset.size));
  });

  dom.settingsModal.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const speed = parseFloat(btn.dataset.speed);
      state.preferences.speechSpeed = speed;
      localStorage.setItem('speech-speed', speed.toString());
      dom.ttsSpeedBadge.textContent = `${speed}x`;
      dom.settingsModal.querySelectorAll('.speed-btn').forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  // Reader Modal Actions
  dom.readerCloseBtn.addEventListener('click', closeReader);
  dom.readerBackBottomBtn.addEventListener('click', closeReader);

  dom.readerBookmarkBtn.addEventListener('click', () => {
    if (state.currentArticle) {
      toggleBookmark(state.currentArticle.id);
    }
  });

  dom.readerShareBtn.addEventListener('click', () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied to clipboard! 📋');
      });
    } else {
      showToast('Link: ' + window.location.href);
    }
  });

  dom.readerFontToggle.addEventListener('click', () => {
    const fonts = ['serif', 'sans', 'mono'];
    const currentIdx = fonts.indexOf(state.preferences.font);
    const nextFont = fonts[(currentIdx + 1) % fonts.length];
    applyReaderFont(nextFont);
    showToast(`Font changed to ${nextFont.toUpperCase()}`);
  });

  dom.copyQuestionBtn.addEventListener('click', () => {
    const qText = dom.readerQuestionText.textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(qText).then(() => {
        showToast('Practice question copied! ✍️');
      });
    }
  });

  // Text to Speech
  dom.ttsPlayBtn.addEventListener('click', () => {
    if (state.tts.isSpeaking && !state.tts.isPaused) {
      pauseTTS();
    } else {
      startTTS();
    }
  });

  dom.ttsStopBtn.addEventListener('click', stopTTS);

  dom.ttsSpeedBadge.addEventListener('click', () => {
    const speeds = [0.8, 1.0, 1.2, 1.5];
    const currentIdx = speeds.indexOf(state.preferences.speechSpeed);
    const nextSpeed = speeds[(currentIdx + 1) % speeds.length];
    state.preferences.speechSpeed = nextSpeed;
    localStorage.setItem('speech-speed', nextSpeed.toString());
    dom.ttsSpeedBadge.textContent = `${nextSpeed}x`;
    showToast(`Speech speed: ${nextSpeed}x`);
    if (state.tts.isSpeaking) {
      startTTS();
    }
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (dom.caDetailModal && dom.caDetailModal.style.display === 'flex') closeCADetailModal();
      if (dom.readerModal.style.display === 'flex') closeReader();
      if (dom.bookmarksModal) dom.bookmarksModal.style.display = 'none';
      if (dom.vocabModal) dom.vocabModal.style.display = 'none';
      if (dom.settingsModal) dom.settingsModal.style.display = 'none';
      if (dom.rssModal) dom.rssModal.style.display = 'none';
      if (dom.flashcardModal) dom.flashcardModal.style.display = 'none';
      if (dom.quizModal) dom.quizModal.style.display = 'none';
      if (dom.knowledgeVaultModal) dom.knowledgeVaultModal.style.display = 'none';
      if (dom.streakModal) dom.streakModal.style.display = 'none';
      if (dom.writingStudioModal) dom.writingStudioModal.style.display = 'none';
      if (dom.compareModal) dom.compareModal.style.display = 'none';
    } else if (e.key === '/' && document.activeElement !== dom.searchInput && document.activeElement !== dom.readerNotesInput && document.activeElement !== dom.caSearchInput && document.activeElement !== dom.caDetailNotesInput) {
      e.preventDefault();
      if (dom.caViewContainer && dom.caViewContainer.style.display !== 'none' && dom.caSearchInput) {
        dom.caSearchInput.focus();
      } else if (dom.searchInput) {
        dom.searchInput.focus();
      }
    } else if (dom.flashcardModal && dom.flashcardModal.style.display === 'flex') {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        flipFlashcard();
      } else if (e.key === 'ArrowRight') {
        nextFlashcard();
      } else if (e.key === 'ArrowLeft') {
        prevFlashcard();
      }
    }
  });

  window.addEventListener('hashchange', handleUrlHashRouting);
}

function handleUrlHashRouting() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#article-')) {
    const articleId = hash.replace('#article-', '');
    if (state.articles.some(a => a.id === articleId)) {
      openReader(articleId);
    }
  } else if (hash && hash.startsWith('#ca-item-')) {
    const caId = hash.replace('#ca-item-', '');
    if (state.ca && state.ca.items.some(i => i.id === caId)) {
      if (dom.tabCA) dom.tabCA.click();
      openCADetailModal(caId);
    }
  } else if (hash === '#current-affairs' || hash === '#ca') {
    if (dom.tabCA) dom.tabCA.click();
  }
}

function formatDateHuman(dateStr) {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  } catch {
    return dateStr;
  }
}

function cleanHtml(rawHtml) {
  if (!rawHtml) return '';
  const div = document.createElement('div');
  div.innerHTML = rawHtml;
  return (div.textContent || div.innerText || '').trim();
}

function calculateReadingTime(text) {
  const words = text.split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 180));
  return `${mins} min read`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

let toastTimeout;
function showToast(msg) {
  clearTimeout(toastTimeout);
  dom.toast.textContent = msg;
  dom.toast.style.display = 'block';
  toastTimeout = setTimeout(() => {
    dom.toast.style.display = 'none';
  }, 2500);
}

// Start application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
