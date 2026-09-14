/**
 * Daily Editorial Hub - Main Application Script
 * Features: Feed parsing, reader view, text-to-speech audio, vocabulary booster,
 * bookmarks, live search, date navigator, and theme management.
 */

// Application State
const state = {
  articles: [],
  filteredArticles: [],
  availableDates: [],
  selectedDate: null, // null means latest date by default
  selectedSource: 'all',
  selectedCategory: 'all',
  searchQuery: '',
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
  await loadEditorialData();
  handleUrlHashRouting();
}

/**
 * Fetch and load JSON data from data/editorials.json
 */
async function loadEditorialData() {
  dom.loading.style.display = 'block';
  dom.grid.innerHTML = '';
  
  try {
    const res = await fetch('data/editorials.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    
    state.articles = data.articles || [];
    if (data.last_updated && dom.lastUpdatedText) {
      dom.lastUpdatedText.textContent = `Dataset: Updated ${data.last_updated}`;
    }

    // Extract sorted unique dates
    const dateSet = new Set(state.articles.map(a => a.date).filter(Boolean));
    state.availableDates = Array.from(dateSet).sort().reverse();

    // Default to the latest date available
    if (state.availableDates.length > 0 && !state.selectedDate) {
      state.selectedDate = state.availableDates[0];
    }

    applyFilters();
  } catch (err) {
    console.error('Error loading editorials data:', err);
    dom.empty.style.display = 'block';
    dom.empty.querySelector('h3').textContent = 'Could not load editorials';
    dom.empty.querySelector('p').textContent = 'Please check that data/editorials.json is available.';
  } finally {
    dom.loading.style.display = 'none';
  }
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

    // Card click event delegation
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

  // Populate metadata
  dom.readerSourceBadge.textContent = `${article.icon || '📰'} ${article.source}`;
  dom.readerDate.textContent = formatDateHuman(article.date);
  dom.readerCatTag.textContent = article.category;
  dom.readerToneTag.textContent = article.tone || 'Analytical';
  dom.readerTimeTag.textContent = `⏱ ${article.reading_time || '2 min read'}`;
  dom.readerTitle.textContent = article.title;
  dom.readerSourceName.textContent = article.source;
  
  dom.readerExternalLink.href = article.url || '#';
  dom.readerBottomLink.href = article.url || '#';

  // Crux
  dom.readerCrux.textContent = article.crux || 'Crux summary not available.';

  // Takeaways
  dom.readerTakeawaysList.innerHTML = (article.takeaways || []).map(t => 
    `<li>${escapeHtml(t)}</li>`
  ).join('');

  // Vocabulary cards
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

  // Relevance & Question
  dom.readerRelevanceTag.textContent = article.relevance_tag || 'GS / Analytical Relevance';
  dom.readerQuestionText.textContent = article.practice_question || 'Evaluate the broader policy implications discussed in this editorial.';

  // Body content
  const content = article.content || '';
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  if (paragraphs.length > 0) {
    dom.readerBodyParagraphs.innerHTML = paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
  } else {
    dom.readerBodyParagraphs.innerHTML = `<p>${escapeHtml(content)}</p>`;
  }

  // Bookmark icon in reader
  updateReaderBookmarkIcon();

  // Show reader modal
  dom.readerModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  dom.readerModal.scrollTop = 0;

  // Stop any prior audio
  stopTTS();

  if (autoPlayAudio) {
    setTimeout(startTTS, 300);
  }
}

/**
 * Close Reader View
 */
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
        openBookmarksModal(); // refresh
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

  // Deduplicate vocabulary across articles
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

  // Reset pill UI
  dom.sourceFilters.querySelectorAll('.filter-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.source === 'all');
  });
  dom.categoryFilters.querySelectorAll('.filter-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.cat === 'all');
  });

  applyFilters();
}

/**
 * Date Navigation
 */
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
  // Theme
  setTheme(state.preferences.theme, false);

  // Font family
  applyReaderFont(state.preferences.font);

  // Font size
  applyReaderSize(state.preferences.size);

  // Speed
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

  // Update theme dropdown items
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
  
  // Highlight button in settings modal
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
  dom.prevDateBtn.addEventListener('click', () => navigateDate(1)); // older
  dom.nextDateBtn.addEventListener('click', () => navigateDate(-1)); // newer
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
      startTTS(); // restart with new speed
    }
  });

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (dom.readerModal.style.display === 'flex') closeReader();
      dom.bookmarksModal.style.display = 'none';
      dom.vocabModal.style.display = 'none';
      dom.settingsModal.style.display = 'none';
    } else if (e.key === '/' && document.activeElement !== dom.searchInput) {
      e.preventDefault();
      dom.searchInput.focus();
    }
  });

  // URL Hash changes
  window.addEventListener('hashchange', handleUrlHashRouting);
}

/**
 * Handle direct deep-linking via URL hash
 */
function handleUrlHashRouting() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#article-')) {
    const articleId = hash.replace('#article-', '');
    if (state.articles.some(a => a.id === articleId)) {
      openReader(articleId);
    }
  }
}

/**
 * Helper: Human readable date formatting (e.g. 14 September 2026)
 */
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

/**
 * Helper: Escape HTML strings
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Helper: Toast Notification
 */
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
