#!/usr/bin/env python3
"""
Daily Editorial & Paper Fetcher
Fetches RSS feeds from top newspapers (The Indian Express, The Hindu, The Guardian,
Financial Express) and research repositories (arXiv), extracts content, generates
key takeaways, detects vocabulary, and updates data/editorials.json.
"""

import os
import re
import json
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
import html

# Predefined high-frequency editorial & academic vocabulary dictionary
VOCAB_DATABASE = {
    "exacerbate": {"def": "To make a problem, bad situation, or negative feeling worse", "pos": "Verb", "synonyms": ["aggravate", "worsen", "inflame"], "antonyms": ["alleviate", "ameliorate"]},
    "ameliorate": {"def": "To make something bad or unsatisfactory better", "pos": "Verb", "synonyms": ["improve", "enhance", "better"], "antonyms": ["worsen", "deteriorate"]},
    "contentious": {"def": "Causing or likely to cause an argument; controversial", "pos": "Adjective", "synonyms": ["disputed", "controversial", "debated"], "antonyms": ["uncontroversial", "peaceful"]},
    "pragmatic": {"def": "Dealing with things sensibly and realistically based on practical considerations", "pos": "Adjective", "synonyms": ["practical", "sensible", "hardheaded"], "antonyms": ["idealistic", "impractical"]},
    "imperative": {"def": "Of vital importance; crucial or an essential thing", "pos": "Adjective / Noun", "synonyms": ["vital", "essential", "crucial"], "antonyms": ["optional", "negligible"]},
    "tenuous": {"def": "Very weak or slight; insubstantial", "pos": "Adjective", "synonyms": ["flimsy", "fragile", "shaky"], "antonyms": ["strong", "robust", "firm"]},
    "scrutiny": {"def": "Critical observation or examination", "pos": "Noun", "synonyms": ["inspection", "examination", "audit"], "antonyms": ["neglect", "glance"]},
    "unprecedented": {"def": "Never done or known before", "pos": "Adjective", "synonyms": ["unparalleled", "novel", "groundbreaking"], "antonyms": ["common", "customary"]},
    "bipartisan": {"def": "Involving the agreement or cooperation of two political parties that usually oppose each other", "pos": "Adjective", "synonyms": ["two-party", "coalition", "non-partisan"], "antonyms": ["partisan", "sectarian"]},
    "fiscal": {"def": "Relating to government revenue, especially taxes and public spending", "pos": "Adjective", "synonyms": ["monetary", "financial", "budgetary"], "antonyms": []},
    "paradigm": {"def": "A typical example or pattern of something; a distinct set of concepts", "pos": "Noun", "synonyms": ["model", "archetype", "framework"], "antonyms": []},
    "complacency": {"def": "A feeling of smug or uncritical satisfaction with oneself or achievements", "pos": "Noun", "synonyms": ["smugness", "self-satisfaction", "inertia"], "antonyms": ["vigilance", "alertness"]},
    "disparity": {"def": "A great difference or inequality", "pos": "Noun", "synonyms": ["imbalance", "discrepancy", "gap"], "antonyms": ["parity", "equality", "similarity"]},
    "judicious": {"def": "Having, showing, or done with good judgment or sense", "pos": "Adjective", "synonyms": ["prudent", "wise", "discreet"], "antonyms": ["foolish", "imprudent", "rash"]},
    "calamitous": {"def": "Catastrophic or disastrous", "pos": "Adjective", "synonyms": ["disastrous", "ruinous", "dire"], "antonyms": ["beneficial", "advantageous"]},
    "ubiquitous": {"def": "Present, appearing, or found everywhere", "pos": "Adjective", "synonyms": ["omnipresent", "pervasive", "everywhere"], "antonyms": ["rare", "scarce"]},
    "mitigate": {"def": "Make less severe, serious, or painful", "pos": "Verb", "synonyms": ["alleviate", "reduce", "diminish"], "antonyms": ["aggravate", "intensify"]},
    "conundrum": {"def": "A confusing and difficult problem or question", "pos": "Noun", "synonyms": ["dilemma", "puzzle", "quandary"], "antonyms": ["solution", "clarity"]},
    "sovereignty": {"def": "Supreme power or authority; the authority of a state to govern itself", "pos": "Noun", "synonyms": ["autonomy", "independence", "self-governance"], "antonyms": ["dependence", "subjugation"]},
    "vulnerability": {"def": "The quality or state of being exposed to the possibility of being attacked or harmed", "pos": "Noun", "synonyms": ["susceptibility", "fragility", "weakness"], "antonyms": ["resilience", "invulnerability"]},
    "resilience": {"def": "The capacity to withstand or to recover quickly from difficulties; toughness", "pos": "Noun", "synonyms": ["toughness", "adaptability", "endurance"], "antonyms": ["fragility", "vulnerability"]},
    "deterrence": {"def": "The action of discouraging an action or event through instilling doubt or fear", "pos": "Noun", "synonyms": ["prevention", "discouragement", "disincentive"], "antonyms": ["encouragement", "incitement"]},
    "substantive": {"def": "Having a firm basis in reality and being therefore important, meaningful, or considerable", "pos": "Adjective", "synonyms": ["significant", "meaningful", "tangible"], "antonyms": ["trivial", "inconsequential"]},
    "hegemony": {"def": "Leadership or dominance, especially by one state or social group over others", "pos": "Noun", "synonyms": ["dominance", "supremacy", "ascendancy"], "antonyms": ["subordination", "equality"]},
    "proactive": {"def": "Creating or controlling a situation rather than just responding to it after it has happened", "pos": "Adjective", "synonyms": ["enterprising", "forward-looking", "preventative"], "antonyms": ["reactive", "passive"]},
    "benchmark": {"def": "A standard or point of reference against which things may be compared", "pos": "Noun / Verb", "synonyms": ["standard", "criterion", "gauge"], "antonyms": []},
    "adversary": {"def": "One's opponent in a contest, conflict, or dispute", "pos": "Noun", "synonyms": ["rival", "opponent", "nemesis"], "antonyms": ["ally", "supporter"]},
    "equitable": {"def": "Fair and impartial", "pos": "Adjective", "synonyms": ["fair", "just", "unbiased"], "antonyms": ["unfair", "inequitable", "biased"]},
    "stagnation": {"def": "Lack of activity, growth, or development", "pos": "Noun", "synonyms": ["slump", "downturn", "inactivity"], "antonyms": ["growth", "boom", "vitality"]},
    "rigorous": {"def": "Extremely thorough, exhaustive, or accurate", "pos": "Adjective", "synonyms": ["meticulous", "exacting", "stringent"], "antonyms": ["lax", "careless", "superficial"]},
    "institutional": {"def": "Relating to an established organization, law, or custom", "pos": "Adjective", "synonyms": ["formal", "established", "systemic"], "antonyms": ["individual", "informal"]},
    "consensus": {"def": "A general agreement among a group of people", "pos": "Noun", "synonyms": ["accord", "harmony", "unity"], "antonyms": ["discord", "disagreement"]}
}

FEED_CONFIGS = [
    {
        "source": "The Indian Express",
        "category": "Polity & Governance",
        "url": "https://indianexpress.com/section/opinion/editorials/feed/",
        "icon": "📰",
        "bias": "Analytical",
        "type": "Newspaper Editorial"
    },
    {
        "source": "The Guardian",
        "category": "Global Affairs",
        "url": "https://www.theguardian.com/tone/editorials/rss",
        "icon": "🌍",
        "bias": "Progressive / Critical",
        "type": "Newspaper Editorial"
    },
    {
        "source": "The Hindu",
        "category": "National Affairs",
        "url": "https://www.thehindu.com/opinion/editorial/feeder/default.rss",
        "icon": "🇮🇳",
        "bias": "Balanced / Formal",
        "type": "Newspaper Editorial"
    },
    {
        "source": "arXiv AI & CS",
        "category": "Tech & AI Research",
        "url": "https://rss.arxiv.org/rss/cs.AI",
        "icon": "🔬",
        "bias": "Academic / Technical",
        "type": "Research Paper Digest"
    }
]

def clean_html(raw_html):
    """Clean HTML tags and decode entities."""
    if not raw_html:
        return ""
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, ' ', raw_html)
    cleantext = html.unescape(cleantext)
    cleantext = re.sub(r'\s+', ' ', cleantext).strip()
    return cleantext

def find_first(element, tag_names):
    """Safely find first element among multiple tag names without triggering len(elem) check."""
    for tag in tag_names:
        found = element.find(tag)
        if found is not None:
            return found
    return None

def get_text(element, tag_names):
    """Safely extract text from first matching child."""
    found = find_first(element, tag_names)
    if found is not None and found.text:
        return clean_html(found.text)
    return ""

def calculate_reading_time(text):
    """Estimate reading time in minutes (assuming 180 WPM)."""
    words = len(text.split())
    minutes = max(1, round(words / 180))
    return f"{minutes} min read"

def extract_vocab(text):
    """Find words from vocabulary database present in text, or pick top thematic words."""
    found = []
    text_lower = text.lower()
    for word, details in VOCAB_DATABASE.items():
        pattern = r'\b' + re.escape(word) + r'(?:s|ed|ing|tion|ly)?\b'
        if re.search(pattern, text_lower):
            sentences = re.split(r'[.!?]+', text)
            ctx_sentence = ""
            for s in sentences:
                if re.search(pattern, s.lower()):
                    ctx_sentence = s.strip() + "."
                    break
            found.append({
                "word": word.capitalize(),
                "pos": details["pos"],
                "definition": details["def"],
                "synonyms": details["synonyms"],
                "antonyms": details.get("antonyms", []),
                "example": ctx_sentence if ctx_sentence else f"The policy is intended to {word} systemic outcomes."
            })
            if len(found) >= 5:
                break
                
    # Fallback to ensure every editorial has at least 3 curated learning words
    if len(found) < 3:
        backup_keys = list(VOCAB_DATABASE.keys())
        # Pick deterministically using hash of text
        idx_seed = abs(hash(text))
        for i in range(3 - len(found)):
            w = backup_keys[(idx_seed + i * 7) % len(backup_keys)]
            d = VOCAB_DATABASE[w]
            found.append({
                "word": w.capitalize(),
                "pos": d["pos"],
                "definition": d["def"],
                "synonyms": d["synonyms"],
                "antonyms": d.get("antonyms", []),
                "example": f"Policymakers must demonstrate {w} interventions in dealing with complex structural shifts."
            })
            
    return found

def generate_takeaways_and_question(title, content, category, source):
    """Synthesize 3 crisp bullet points and an analytical essay question."""
    sentences = [s.strip() for s in re.split(r'[.!?]+', content) if len(s.strip()) > 30]
    
    takeaways = []
    if len(sentences) >= 3:
        takeaways = [
            sentences[0] + ".",
            (sentences[len(sentences)//2] if len(sentences) > 2 else sentences[1]) + ".",
            sentences[-1] + "."
        ]
    elif len(sentences) > 0:
        takeaways = [s + "." for s in sentences[:3]]
        while len(takeaways) < 3:
            takeaways.append(f"Emphasizes vital strategic considerations regarding {title}.")
    else:
        takeaways = [
            f"Highlights critical developments concerning {title}.",
            f"Examines underlying structural challenges within {category}.",
            "Emphasizes the need for timely institutional reform and evidence-based policy."
        ]

    # Practice question formulation based on topic
    clean_t = title.split('|')[0].split(':')[0].strip()
    if "Research" in category or "AI" in category:
        question = f"Critically assess how recent advancements in '{clean_t}' transform current computational paradigms. What technical, ethical, and societal challenges warrant proactive regulatory guardrails?"
        gs_tag = "GS Paper 3: Science & Technology, AI Ethics"
    elif "Economy" in category or any(w in title.lower() for w in ["bank", "inflation", "gdp", "tax", "trade", "budget"]):
        question = f"Analyze the macroeconomic and fiscal implications discussed in '{clean_t}'. Suggest practical policy interventions to foster inclusive and sustainable economic growth."
        gs_tag = "GS Paper 3: Indian Economy & Macroeconomic Stability"
    elif "Global" in category or any(w in title.lower() for w in ["war", "diplomacy", "treaty", "foreign", "un", "china", "us"]):
        question = f"In light of '{clean_t}', evaluate the shifting geopolitical equilibrium. How should modern democracies balance strategic autonomy with multilateral commitments?"
        gs_tag = "GS Paper 2: International Relations & Geopolitics"
    else:
        question = f"Discuss the core constitutional, legal, and administrative dimensions highlighted in '{clean_t}'. What institutional mechanisms are imperative to ensure democratic accountability?"
        gs_tag = "GS Paper 2: Governance, Constitution & Public Policy"

    return takeaways, question, gs_tag

def fetch_feed(feed_cfg):
    """Fetch an RSS feed and parse items safely."""
    articles = []
    url = feed_cfg["url"]
    source = feed_cfg["source"]
    default_cat = feed_cfg["category"]
    
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/rss+xml, application/xml, text/xml, */*"
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            xml_data = response.read()
            root = ET.fromstring(xml_data)

            items = root.findall(".//item")
            if not items:
                items = root.findall(".//{http://www.w3.org/2005/Atom}entry")

            for item in items[:8]:  # Up to 8 latest per feed
                title = get_text(item, ["title", "{http://www.w3.org/2005/Atom}title"])
                
                link_elem = find_first(item, ["link", "{http://www.w3.org/2005/Atom}link"])
                link = ""
                if link_elem is not None:
                    link = (link_elem.text or "").strip()
                    if not link:
                        link = link_elem.get("href", "").strip()

                desc = get_text(item, [
                    "description",
                    "{http://www.w3.org/2005/Atom}summary",
                    "{http://www.w3.org/2005/Atom}content",
                    "{http://purl.org/rss/1.0/modules/content/}encoded"
                ])

                pub_date_str = get_text(item, [
                    "pubDate",
                    "{http://www.w3.org/2005/Atom}published",
                    "{http://www.w3.org/2005/Atom}updated",
                    "{http://purl.org/dc/elements/1.1/}date"
                ])

                if not title or not link:
                    continue

                # Strip trailing publication tags if redundant
                clean_title = re.sub(r'\s*\|\s*(?:Editorial|The Hindu|Opinion).*$', '', title).strip()

                # Parse date to YYYY-MM-DD
                date_formatted = datetime.now(timezone.utc).strftime("%Y-%m-%d")
                if pub_date_str:
                    try:
                        # Normalize string
                        clean_dt_str = re.sub(r'\s+[A-Z]{3,4}$', '', pub_date_str.strip())
                        # Try RFC-822
                        if "," in clean_dt_str:
                            dt = datetime.strptime(clean_dt_str[:25].strip(), "%a, %d %b %Y %H:%M:%S")
                            date_formatted = dt.strftime("%Y-%m-%d")
                        elif "T" in clean_dt_str:
                            dt = datetime.fromisoformat(clean_dt_str.replace("Z", "+00:00"))
                            date_formatted = dt.strftime("%Y-%m-%d")
                    except Exception:
                        pass

                # Derive category from title or feed default
                category = default_cat
                lower_title = clean_title.lower()
                if any(w in lower_title for w in ["bank", "inflation", "gdp", "tax", "trade", "budget", "rbi", "rupee", "fiscal"]):
                    category = "Economy & Banking"
                elif any(w in lower_title for w in ["court", "bill", "election", "parliament", "law", "governance", "democracy", "judge", "justice"]):
                    category = "Polity & Governance"
                elif any(w in lower_title for w in ["climate", "green", "carbon", "water", "flood", "forest", "emission", "monsoon"]):
                    category = "Environment & Climate"
                elif any(w in lower_title for w in ["ai", "chip", "quantum", "tech", "digital", "cyber", "neural", "robot", "computing"]):
                    category = "Tech & AI Research"
                elif any(w in lower_title for w in ["war", "un", "treaty", "diplomacy", "china", "us", "border", "russia", "israel", "gaza", "nato"]):
                    category = "Global Affairs"

                reading_time = calculate_reading_time(desc if len(desc) > 300 else clean_title * 12)
                vocab = extract_vocab(desc + " " + clean_title)
                takeaways, question, gs_tag = generate_takeaways_and_question(clean_title, desc, category, source)

                slug = re.sub(r'[^a-zA-Z0-9]+', '-', f"{source}-{clean_title}").strip('-').lower()[:70]

                # Full readable content body
                full_content = desc
                if len(full_content) < 150:
                    full_content = (
                        f"This editorial analysis examines '{clean_title}', published in {source}. "
                        f"The piece delves into key structural challenges and emerging trends within the {category} domain. "
                        f"Readers are advised to study the critical takeaways and vocabulary definitions highlighted in this digest "
                        f"to enrich analytical comprehension and essay writing skills."
                    )

                articles.append({
                    "id": slug,
                    "title": clean_title,
                    "source": source,
                    "source_type": feed_cfg["type"],
                    "icon": feed_cfg["icon"],
                    "category": category,
                    "date": date_formatted,
                    "url": link,
                    "reading_time": reading_time,
                    "tone": feed_cfg["bias"],
                    "crux": takeaways[0] if takeaways else desc[:140] + "...",
                    "takeaways": takeaways,
                    "vocabulary": vocab,
                    "practice_question": question,
                    "relevance_tag": gs_tag,
                    "content": full_content
                })

    except Exception as e:
        print(f"Error fetching {source} ({url}): {e}")

    return articles

def update_dataset():
    """Update data/editorials.json preserving historical entries."""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_file = os.path.join(base_dir, "data", "editorials.json")

    existing_articles = []
    if os.path.exists(data_file):
        try:
            with open(data_file, "r", encoding="utf-8") as f:
                existing_data = json.load(f)
                if isinstance(existing_data, dict) and "articles" in existing_data:
                    existing_articles = existing_data["articles"]
                elif isinstance(existing_data, list):
                    existing_articles = existing_data
        except Exception as e:
            print(f"Error reading existing data: {e}")

    existing_ids = {a["id"] for a in existing_articles}
    existing_urls = {a.get("url") for a in existing_articles if a.get("url")}

    new_articles = []
    print(f"Starting daily feed fetch at {datetime.now(timezone.utc).isoformat()}...")
    for cfg in FEED_CONFIGS:
        print(f"Fetching {cfg['source']}...")
        fetched = fetch_feed(cfg)
        count = 0
        for art in fetched:
            if art["id"] not in existing_ids and art["url"] not in existing_urls:
                new_articles.append(art)
                existing_ids.add(art["id"])
                existing_urls.add(art["url"])
                count += 1
        print(f"  -> Added {count} new items from {cfg['source']}")

    all_articles = new_articles + existing_articles
    all_articles.sort(key=lambda x: x.get("date", "2000-01-01"), reverse=True)

    output = {
        "last_updated": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        "total_articles": len(all_articles),
        "articles": all_articles
    }

    os.makedirs(os.path.dirname(data_file), exist_ok=True)
    with open(data_file, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Successfully saved {len(all_articles)} articles ({len(new_articles)} new) to {data_file}")

if __name__ == "__main__":
    update_dataset()
