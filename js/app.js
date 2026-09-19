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
  searchQuery: '',
  isFetchingLive: false,
  customFeeds: JSON.parse(localStorage.getItem('editorial-custom-feeds') || '[]'),
  bookmarks: new Set(JSON.parse(localStorage.getItem('editorial-bookmarks') || '[]')),
  masteredWords: new Set(JSON.parse(localStorage.getItem('editorial-mastered-words') || '[]')),
  currentArticle: null,
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
  tabFlashcards: document.getElementById('tab-flashcards'),
  tabQuiz: document.getElementById('tab-quiz'),
  tabVault: document.getElementById('tab-vault'),

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
  ttsSpeedBadge: document.getElementById('tts-speed-badge')
};

/**
 * Initialize Application
 */
async function init() {
  applySavedPreferences();
  setupEventListeners();
  updateBookmarkBadge();
  renderRssFeedsManager();
  await loadEditorialData();
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
  updateFlashcardStats();
  showToast(`Marked "${card.word}" as Mastered! ⭐`);
  nextFlashcard();
}

function markFlashcardReview() {
  const card = state.flashcards.filteredCards[state.flashcards.currentIndex];
  if (!card) return;
  state.masteredWords.delete(card.word.toLowerCase());
  localStorage.setItem('editorial-mastered-words', JSON.stringify(Array.from(state.masteredWords)));
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
    if (state.searchQuery.trim()) parts.push(`Query: "${state.searchQuery}"`);
    dom.activeFilterText.textContent = `Filtered by: ${parts.join(' • ')}`;
  } else {
    dom.activeFiltersBar.style.display = 'none';
  }
}

function resetAllFilters() {
  state.selectedSource = 'all';
  state.selectedCategory = 'all';
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

/**
 * Setup All Event Listeners
 */
function setupEventListeners() {
  function setActiveHubTab(target) {
    [dom.tabEditorials, dom.tabFlashcards, dom.tabQuiz, dom.tabVault].forEach(tab => {
      if (tab) tab.classList.toggle('active', tab.dataset.target === target);
    });
  }

  // Resource Hub Ribbon Tabs
  if (dom.tabEditorials) {
    dom.tabEditorials.addEventListener('click', () => {
      setActiveHubTab('editorials');
      if (dom.flashcardModal) dom.flashcardModal.style.display = 'none';
      if (dom.quizModal) dom.quizModal.style.display = 'none';
      if (dom.knowledgeVaultModal) dom.knowledgeVaultModal.style.display = 'none';
      if (dom.vocabModal) dom.vocabModal.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  if (dom.tabFlashcards) {
    dom.tabFlashcards.addEventListener('click', () => {
      setActiveHubTab('flashcards');
      if (dom.quizModal) dom.quizModal.style.display = 'none';
      if (dom.knowledgeVaultModal) dom.knowledgeVaultModal.style.display = 'none';
      if (dom.vocabModal) dom.vocabModal.style.display = 'none';
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
      startDailyMockQuiz();
    });
  }
  if (dom.tabVault) {
    dom.tabVault.addEventListener('click', () => {
      setActiveHubTab('vault');
      if (dom.flashcardModal) dom.flashcardModal.style.display = 'none';
      if (dom.quizModal) dom.quizModal.style.display = 'none';
      if (dom.vocabModal) dom.vocabModal.style.display = 'none';
      openKnowledgeVault();
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

  // Click outside to dismiss modal overlays
  [
    dom.flashcardModal,
    dom.quizModal,
    dom.knowledgeVaultModal,
    dom.vocabModal,
    dom.bookmarksModal,
    dom.settingsModal,
    dom.rssModal
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
      if (dom.readerModal.style.display === 'flex') closeReader();
      if (dom.bookmarksModal) dom.bookmarksModal.style.display = 'none';
      if (dom.vocabModal) dom.vocabModal.style.display = 'none';
      if (dom.settingsModal) dom.settingsModal.style.display = 'none';
      if (dom.rssModal) dom.rssModal.style.display = 'none';
      if (dom.flashcardModal) dom.flashcardModal.style.display = 'none';
      if (dom.quizModal) dom.quizModal.style.display = 'none';
      if (dom.knowledgeVaultModal) dom.knowledgeVaultModal.style.display = 'none';
    } else if (e.key === '/' && document.activeElement !== dom.searchInput && document.activeElement !== dom.readerNotesInput) {
      e.preventDefault();
      dom.searchInput.focus();
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
