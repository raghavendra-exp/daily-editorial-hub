/**
 * Daily Editorial Hub - Main Application Script
 * Features: Live RSS Fetching & Refresh, Feed parsing, reader view, text-to-speech audio,
 * vocabulary booster, bookmarks, live search, date navigator, and theme management.
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
    name: 'The Guardian',
    url: 'https://www.theguardian.com/tone/editorials/rss',
    category: 'Global Affairs',
    icon: '🌍',
    tone: 'Progressive / Critical'
  },
  {
    name: 'arXiv AI & CS',
    url: 'https://rss.arxiv.org/rss/cs.AI',
    category: 'Tech & AI Research',
    icon: '🔬',
    tone: 'Academic / Technical'
  }
];

// High-frequency Editorial & Academic Vocabulary Database
const VOCAB_DATABASE = {
  "exacerbate": { def: "To make a problem or negative feeling worse", pos: "Verb", synonyms: ["aggravate", "worsen", "inflame"], antonyms: ["alleviate", "ameliorate"] },
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
  "rigorous": { def: "Extremely thorough, exhaustive, and exacting", pos: "Adjective", synonyms: ["meticulous", "exacting", "stringent"], antonyms: ["lax", "careless", "superficial"] }
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
  currentArticle: null,
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

// DOM Element References
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
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  themeMenu: document.getElementById('theme-menu'),
  readerSettingsBtn: document.getElementById('reader-settings-btn'),
  settingsModal: document.getElementById('settings-modal'),
  closeSettingsModal: document.getElementById('close-settings-modal'),
  saveSettingsBtn: document.getElementById('save-settings-btn'),
  randomPickBtn: document.getElementById('random-pick-btn'),
  lastUpdatedText: document.getElementById('last-updated-text'),
  toast: document.getElementById('toast'),

  // Refresh & RSS Feeds Manager Elements
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

  // Reader Modal
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
  readerVocabGrid: document.getElementById('reader-vocab-grid'),
  readerRelevanceTag: document.getElementById('reader-relevance-tag'),
  readerQuestionText: document.getElementById('reader-question-text'),
  readerBodyParagraphs: document.getElementById('reader-body-paragraphs'),
  readerBookmarkBtn: document.getElementById('reader-bookmark-btn'),
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
 * Initialize application
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

    // Merge cached live articles fetched in this browser
    const liveCache = JSON.parse(localStorage.getItem('editorial-live-cache') || '[]');
    const existingIds = new Set(baseArticles.map(a => a.id));
    const existingUrls = new Set(baseArticles.map(a => a.url).filter(Boolean));

    const merged = [...liveCache.filter(a => !existingIds.has(a.id) && !existingUrls.has(a.url)), ...baseArticles];
    state.articles = merged;

    refreshDateList();
    applyFilters();
  } catch (err) {
    console.error('Error loading editorials data:', err);
    dom.empty.style.display = 'block';
  } finally {
    dom.loading.style.display = 'none';
  }
}

/**
 * Recalculate unique dates and default to latest
 */
function refreshDateList() {
  const dateSet = new Set(state.articles.map(a => a.date).filter(Boolean));
  state.availableDates = Array.from(dateSet).sort().reverse();

  if (state.availableDates.length > 0 && !state.selectedDate) {
    state.selectedDate = state.availableDates[0];
  }
}

/**
 * Fetch live RSS feeds directly in the browser via CORS proxy
 */
async function fetchLiveRSSFeeds() {
  if (state.isFetchingLive) return;
  state.isFetchingLive = true;

  // Visual indication: spinners
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
        const cleanTitle = rawTitle.replace(/\s*\|\s*(?:Editorial|The Hindu|Opinion).*$/i, '').trim();
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

        const articleObj = {
          id: slug,
          title: cleanTitle,
          source: feed.name,
          source_type: feed.name.includes('arXiv') ? 'Research Paper Digest' : 'Newspaper Editorial',
          icon: feed.icon || '📰',
          category: category,
          date: dateStr,
          url: link,
          reading_time: readingTime,
          tone: feed.tone || 'Analytical',
          crux: takeaways[0] || (rawContent.slice(0, 140) + '...'),
          takeaways: takeaways,
          vocabulary: vocab,
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

    // Cache newly discovered live articles in localStorage
    const liveCache = JSON.parse(localStorage.getItem('editorial-live-cache') || '[]');
    const updatedCache = [...newItems, ...liveCache].slice(0, 50); // keep up to 50
    localStorage.setItem('editorial-live-cache', JSON.stringify(updatedCache));

    refreshDateList();
    applyFilters();
    showToast(`✅ Synced ${newArticlesAdded} fresh editorials from live RSS!`);
  } else {
    showToast('✨ All feeds are already up-to-date!');
  }

  // Update live status indicator
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (dom.liveStatusText) {
    dom.liveStatusText.textContent = `Synced Just Now (${timeStr})`;
  }

  // Cleanup spinners
  state.isFetchingLive = false;
  if (dom.refreshSpinnerIcon) dom.refreshSpinnerIcon.classList.remove('spinning');
  if (dom.modalSpinnerIcon) dom.modalSpinnerIcon.classList.remove('spinning');
  if (dom.refreshLabel) dom.refreshLabel.textContent = 'Refresh Feeds';
}

/**
 * Helper: Derive category from title
 */
function deriveCategory(title, defaultCat) {
  const t = title.toLowerCase();
  if (/\b(bank|inflation|gdp|tax|trade|budget|rbi|rupee|fiscal)\b/.test(t)) return 'Economy & Banking';
  if (/\b(court|bill|election|parliament|law|governance|democracy|judge|justice)\b/.test(t)) return 'Polity & Governance';
  if (/\b(climate|green|carbon|water|flood|forest|emission|monsoon)\b/.test(t)) return 'Environment & Climate';
  if (/\b(ai|chip|quantum|tech|digital|cyber|neural|robot|computing)\b/.test(t)) return 'Tech & AI Research';
  if (/\b(war|un|treaty|diplomacy|china|us|border|russia|israel|gaza|nato)\b/.test(t)) return 'Global Affairs';
  return defaultCat || 'National Affairs';
}

/**
 * Helper: Parse ISO or RFC date to YYYY-MM-DD
 */
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

/**
 * Helper: Synthesize takeaways and practice questions
 */
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

  if (category.includes('Tech') || category.includes('AI')) {
    question = `Critically analyze how developments in '${cleanT}' transform current technological paradigms. What ethical safeguards and regulatory frameworks are necessary?`;
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

/**
 * Helper: Extract vocabulary words
 */
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
        example: `Policymakers must demonstrate ${word} interventions in handling complex structural reforms.`
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
        example: `Effective governance requires ${w} approaches to mitigate emerging institutional bottlenecks.`
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

/**
 * Render RSS Feeds List in Modal
 */
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
 * Filter articles according to active date, source, category, and search query
 */
function applyFilters() {
  let filtered = [...state.articles];

  // 1. Date filter
  if (state.selectedDate && state.selectedDate !== 'all') {
    filtered = filtered.filter(a => a.date === state.selectedDate);
    dom.dateLabel.textContent = formatDateHuman(state.selectedDate);
  } else {
    dom.dateLabel.textContent = 'All Dates Archive';
  }

  // 2. Source filter
  if (state.selectedSource !== 'all') {
    filtered = filtered.filter(a => a.source === state.selectedSource);
  }

  // 3. Category filter
  if (state.selectedCategory !== 'all') {
    filtered = filtered.filter(a => a.category === state.selectedCategory);
  }

  // 4. Search query
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

/**
 * Render article cards to the grid
 */
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

/**
 * Update top statistics strip
 */
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
    if (timeMatch) {
      totalMinutes += parseInt(timeMatch[1], 10);
    } else {
      totalMinutes += 2;
    }
  });

  dom.statVocab.textContent = totalVocab;
  dom.statTime.textContent = `${totalMinutes} min`;
}

/**
 * Open Immersive Full Editorial Reader View
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

  dom.readerTakeawaysList.innerHTML = (article.takeaways || []).map(t => 
    `<li>${escapeHtml(t)}</li>`
  ).join('');

  dom.readerVocabGrid.innerHTML = (article.vocabulary || []).map(v => `
    <div class="vocab-card">
      <div class="vocab-head">
        <span class="vocab-word">${escapeHtml(v.word)}</span>
        <span class="vocab-pos">${escapeHtml(v.pos || '')}</span>
      </div>
      <p class="vocab-def">${escapeHtml(v.definition)}</p>
      ${v.synonyms && v.synonyms.length > 0 ? `
        <div class="vocab-synonyms">
          <strong>Synonyms:</strong> ${escapeHtml(v.synonyms.join(', '))}
        </div>
      ` : ''}
      ${v.antonyms && v.antonyms.length > 0 ? `
        <div class="vocab-synonyms">
          <strong>Antonyms:</strong> ${escapeHtml(v.antonyms.join(', '))}
        </div>
      ` : ''}
      ${v.example ? `
        <div class="vocab-example">
          "${escapeHtml(v.example)}"
        </div>
      ` : ''}
    </div>
  `).join('');

  dom.readerRelevanceTag.textContent = article.relevance_tag || 'GS / Analytical Relevance';
  dom.readerQuestionText.textContent = article.practice_question || 'Evaluate the broader policy implications discussed in this editorial.';

  const content = article.content || '';
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  if (paragraphs.length > 0) {
    dom.readerBodyParagraphs.innerHTML = paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
  } else {
    dom.readerBodyParagraphs.innerHTML = `<p>${escapeHtml(content)}</p>`;
  }

  updateReaderBookmarkIcon();

  dom.readerModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  dom.readerModal.scrollTop = 0;

  stopTTS();

  if (autoPlayAudio) {
    setTimeout(startTTS, 300);
  }
}

function closeReader() {
  stopTTS();
  dom.readerModal.style.display = 'none';
  document.body.style.overflow = '';
  state.currentArticle = null;
  history.replaceState(null, null, ' ');
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
  const count = state.bookmarks.size;
  dom.bookmarkBadge.textContent = count;
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

/**
 * Daily Vocab Deck Modal
 */
function openVocabDeckModal() {
  dom.vocabDeckContainer.innerHTML = '';
  const articlesToUse = state.filteredArticles.length > 0 ? state.filteredArticles : state.articles;

  const vocabMap = new Map();
  articlesToUse.forEach(art => {
    (art.vocabulary || []).forEach(v => {
      if (!vocabMap.has(v.word.toLowerCase())) {
        vocabMap.set(v.word.toLowerCase(), { ...v, sourceTitle: art.title });
      }
    });
  });

  const vocabList = Array.from(vocabMap.values());
  if (vocabList.length === 0) {
    dom.vocabDeckContainer.innerHTML = '<p>No vocabulary words found for current selection.</p>';
  } else {
    vocabList.forEach(v => {
      const card = document.createElement('div');
      card.className = 'vocab-card';
      card.innerHTML = `
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
      `;
      dom.vocabDeckContainer.appendChild(card);
    });
  }

  dom.vocabModal.style.display = 'flex';
}

/**
 * Filter Bar UI and Reset logic
 */
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
 * Theme & Reader Preferences
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
  // Live Refresh Buttons
  if (dom.refreshFeedsBtn) {
    dom.refreshFeedsBtn.addEventListener('click', fetchLiveRSSFeeds);
  }
  if (dom.modalFetchAllBtn) {
    dom.modalFetchAllBtn.addEventListener('click', fetchLiveRSSFeeds);
  }

  // RSS Manager Modal
  if (dom.rssManagerBtn) {
    dom.rssManagerBtn.addEventListener('click', () => {
      renderRssFeedsManager();
      dom.rssModal.style.display = 'flex';
    });
  }
  if (dom.closeRssModal) {
    dom.closeRssModal.addEventListener('click', () => dom.rssModal.style.display = 'none');
  }
  if (dom.rssModalDone) {
    dom.rssModalDone.addEventListener('click', () => dom.rssModal.style.display = 'none');
  }

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

      state.customFeeds.push({
        name: name,
        url: url,
        category: cat,
        icon: '📑',
        tone: 'Analytical'
      });
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
  dom.vocabModalToggle.addEventListener('click', openVocabDeckModal);
  dom.closeVocabModal.addEventListener('click', () => dom.vocabModal.style.display = 'none');
  dom.vocabModalDone.addEventListener('click', () => dom.vocabModal.style.display = 'none');

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
      dom.bookmarksModal.style.display = 'none';
      dom.vocabModal.style.display = 'none';
      dom.settingsModal.style.display = 'none';
      if (dom.rssModal) dom.rssModal.style.display = 'none';
    } else if (e.key === '/' && document.activeElement !== dom.searchInput) {
      e.preventDefault();
      dom.searchInput.focus();
    }
  });

  // URL Hash changes
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
document.addEventListener('DOMContentLoaded', init);
