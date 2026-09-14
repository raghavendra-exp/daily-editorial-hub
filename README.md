# 📰 Daily Editorial Hub

A sleek, modern, distraction-free web application to read and study daily editorials from premier national and international newspapers (*The Indian Express*, *The Hindu*, *The Guardian*) and research papers (*arXiv AI & CS*), complete with **30-second crux summaries**, **vocabulary booster cards**, **exam & analytical relevance**, **Text-to-Speech audio reader**, and **automated daily GitHub Actions updates for GitHub Pages**.

---

## ✨ Features

- 🗞️ **Multi-Source Coverage**:
  - **The Indian Express** (Editorials & Opinions)
  - **The Hindu** (Lead Editorials & Analysis)
  - **The Guardian** (Global View & Editorial Commentary)
  - **arXiv AI & CS** (Cutting-edge research paper digests)
- 💡 **Smart Digest Format**:
  - **⚡ 30-Second Crux**: The core thesis in a single digestible sentence.
  - **✦ Key Takeaways**: 3 structured analytical bullet points per editorial.
  - **📖 Vocabulary Booster**: High-yield words with definitions, parts of speech, synonyms, antonyms, and context sentences.
  - **🎯 Exam / Policy Angle**: GS Paper tags (GS-2 Polity, GS-3 Economy/Tech, etc.) and analytical essay questions.
  - **📋 Practice Question Copy**: One-click copy for answer writing practice.
- 🎧 **Audio Reader (Text-to-Speech)**:
  - Hands-free listening for commutes with Play, Pause, Resume, and adjustable speech speeds (0.8x, 1.0x, 1.2x, 1.5x).
- 🎨 **Reader Modes & Customization**:
  - **Themes**: System, Light, Dark, and warm Sepia ("Paper") reading modes with no flash of unstyled content (FOUC).
  - **Typography**: Merriweather (Serif), Inter (Sans), or JetBrains (Monospace), with adjustable font sizes.
- ⭐ **Offline Bookmarks**:
  - Save favorite articles and vocabulary for offline revision via browser `localStorage`.
- 🔍 **Instant Search & Filters**:
  - Real-time search across headlines, summaries, full text, and vocabulary.
  - Filter by Publication or Topic (*Polity & Governance*, *Economy & Banking*, *Global Affairs*, *Tech & AI*, *Environment*).
  - Date navigation and historical archives.
- 🤖 **100% Automated on GitHub Pages**:
  - A scheduled GitHub Actions workflow automatically fetches new editorials every morning, updates the dataset, and publishes the site with **zero hosting cost** and **zero manual maintenance**.

---

## 🚀 Live Local Preview

You can run and test the website immediately on your computer:

```bash
cd C:\.........\daily-editorial-hub

# Start a local static HTTP server (using Python)
python -m http.server 8000
```

Now open **http://localhost:8000** in your browser.

---

## 🌐 Deploy to GitHub Pages (Step-by-Step Guide)

### Step 1: Initialize Git and Create a GitHub Repository
1. Go to [GitHub](https://github.com) and click **New Repository**.
2. Name the repository (e.g. `daily-editorial-hub`). Keep it **Public** (required for free GitHub Pages).
3. In your local terminal, navigate to the project directory and push:

```bash
cd C:\...........\daily-editorial-hub

git init
git add .
git commit -m "Initial commit: Daily Editorial Hub"
git branch -M main

# Replace with your actual GitHub repository URL:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/daily-editorial-hub.git
git push -u origin main
```

---

### Step 2: Enable GitHub Pages & GitHub Actions

1. In your GitHub repository, navigate to **Settings** → **Pages** (in the left sidebar).
2. Under **Build and deployment** → **Source**, select:
   - **GitHub Actions** *(Recommended - uses the included `.github/workflows/daily-fetch.yml`)*
3. Next, navigate to **Settings** → **Actions** → **General**:
   - Scroll down to **Workflow permissions**.
   - Select **Read and write permissions** (this allows the bot to commit daily updated editorials into `data/editorials.json`).
   - Click **Save**.

---

### Step 3: Trigger the First Automated Build

1. Go to the **Actions** tab in your GitHub repository.
2. Select the **Daily Editorial Fetch & GitHub Pages Deploy** workflow on the left.
3. Click **Run workflow** → **Run workflow**.
4. In ~60 seconds, the workflow will run `scripts/fetch_editorials.py`, commit the latest data, and publish your live website!
5. Your website will be live at:
   ```
   https://<YOUR_GITHUB_USERNAME>.github.io/daily-editorial-hub/
   ```

---

## ⏰ Automated Daily Schedule

The workflow `.github/workflows/daily-fetch.yml` is pre-configured with cron:

```yaml
on:
  schedule:
    # Runs at 01:00 UTC (6:30 AM IST) every morning
    - cron: '0 1 * * *'
  workflow_dispatch: # Allows manual one-click refresh
```

Every morning at 6:30 AM IST, GitHub Actions will:
1. Pull the freshest editorials from RSS feeds.
2. Enrich them with vocabulary, takeaways, and questions.
3. Commit the updated `data/editorials.json` to the repo.
4. Auto-deploy the latest version to your GitHub Pages site.

---

## 🛠️ Adding More Feeds or Custom Publications

To add more newspapers or research repositories, open [`scripts/fetch_editorials.py`](file:///C:/Users/ragha/.gemini/antigravity/scratch/daily-editorial-hub/scripts/fetch_editorials.py) and add an entry to `FEED_CONFIGS`:

```python
FEED_CONFIGS.append({
    "source": "LiveMint",
    "category": "Economy & Banking",
    "url": "https://www.livemint.com/rss/opinion",
    "icon": "📊",
    "bias": "Business / Analytical",
    "type": "Newspaper Editorial"
})
```

You can also test manual data updates anytime by running:
```bash
python scripts/fetch_editorials.py
```

---

## 📁 Project Structure

```
daily-editorial-hub/
├── .github/
│   └── workflows/
│       └── daily-fetch.yml     # Automated daily cron & GitHub Pages deployment
├── css/
│   └── styles.css              # Modern responsive CSS (System, Dark, Light, Sepia)
├── js/
│   └── app.js                  # Frontend app: search, filters, TTS, vocab, bookmarks
├── data/
│   └── editorials.json         # Editorial dataset updated daily
├── scripts/
│   └── fetch_editorials.py     # Python feed parser, cleaner & vocab extractor
├── index.html                  # Semantic, accessible HTML5 single-page application
└── README.md                   # Setup & deployment guide
```

---

## 📜 License
MIT License. Content copyright remains with respective publishers (The Indian Express, The Hindu, The Guardian, and arXiv authors).
