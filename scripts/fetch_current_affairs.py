#!/usr/bin/env python3
"""
Automated Exam Current Affairs Engine & 1-Year Master Vault (India & World)
Fetches daily news releases and RSS feeds from:
- PIB (Press Information Bureau - Government of India)
- The Hindu (National, International, Sci-Tech, Business, Sport)
- The Indian Express (India, World, Tech, Sports)
- LiveMint (Economy, Banking, Policy)
- BBC World News (World, Science & Environment)

Extracts, categorizes, generates 30-sec exam crux, key takeaways, prelims pointers,
practice MCQs, and maintains the 1-Year Comprehensive Current Affairs Master Vault.
"""

import os
import re
import json
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
import html

# ---------------------------------------------------------------------------
# High-Yield Categorization & Keyword Matchers
# ---------------------------------------------------------------------------
CATEGORY_KEYWORDS = {
    "Banking & Finance": [
        "rbi", "reserve bank", "monetary policy", "repo rate", "reverse repo", "sdf",
        "msf", "crr", "slr", "cbdc", "digital rupee", "upi", "npci", "sebi", "bad bank",
        "narcl", "ibc", "insolvency", "psl", "priority sector", "nbfc", "pmjdy",
        "jan dhan", "banking", "t+0", "fintech", "financial inclusion"
    ],
    "Polity & Governance": [
        "supreme court", "constitution", "article ", "judgment", "verdict", "high court",
        "election commission", "cec", "electoral", "bns", "bnss", "bsa", "criminal law",
        "bharatiya nyaya", "nari shakti", "amendment", "delimitation", "finance commission",
        "parliament", "bill", "ordinance", "governor", "affirmative action", "sub-classification"
    ],
    "Economy & Infrastructure": [
        "budget", "economic survey", "gdp", "fiscal deficit", "capex", "inflation", "cpi",
        "wpi", "trade pact", "fta", "tepa", "efta", "gati shakti", "logistics", "pli",
        "semiconductor", "dholera", "critical minerals", "lithium", "agristack", "pm-pranam",
        "export", "import", "current account"
    ],
    "Science, Tech & Defence": [
        "isro", "nasa", "gaganyaan", "aditya-l1", "chandrayaan", "spadex", "bas",
        "nisar", "ins arighaat", "ssbn", "brahmos", "drdo", "zorawar", "tejas", "prachand",
        "missile", "submarine", "indiaai", "quantum mission", "samudrayaan", "matsya 6000",
        "defence", "navy", "army", "air force", "artificial intelligence"
    ],
    "History, Art & Culture": [
        "unesco", "world heritage", "moidams", "ahom", "santiniketan", "hoysala",
        "garba", "intangible cultural", "archaeological", "asi", "excavation", "vadnagar",
        "keeladi", "gi tag", "geographical indication", "birsa munda", "janjatiya gaurav",
        "vaikom", "kakori", "temple", "statue", "monument", "sangam"
    ],
    "Sports & Games": [
        "olympics", "paralympics", "paris 2024", "medal", "neeraj chopra", "manu bhaker",
        "hockey", "chess olympiad", "fide", "gukesh", "erigaisi", "t20 world cup", "icc",
        "bopanna", "grand slam", "australian open", "wimbledon", "khel ratna", "arjuna award",
        "badminton", "satwik", "chirag", "cricket", "tennis"
    ],
    "National Affairs & Schemes": [
        "pm surya ghar", "muft bijli", "rooftop solar", "pm vishwakarma", "vibrant villages",
        "swachh survekshan", "aspirational blocks", "niti aayog", "appointment", "cag",
        "cabinet secretary", "jal jeevan", "ayushman bharat", "national scheme", "portal"
    ],
    "International & Global Affairs": [
        "g20", "brics", "sco", "g7", "asean", "united nations", "summit", "baku",
        "cop28", "cop29", "kazan", "rio de janeiro", "high seas treaty", "bbnj", "red sea",
        "operation sankalp", "military exercise", "tarang shakti", "desert cyclone",
        "bilateral", "foreign minister"
    ],
    "Environment & Ecology": [
        "cop29", "cop28", "climate", "ramsar", "wetland", "project tiger", "cheetah",
        "kuno", "big cat alliance", "ibca", "green hydrogen", "mission life", "pollution",
        "biodiversity", "renewable energy", "wildlife sanctuary", "national park"
    ]
}

# Import Comprehensive 1-Year Master Exam Vault & Fact Capsules from master_vault_data
import sys
_script_dir = os.path.dirname(os.path.abspath(__file__))
if _script_dir not in sys.path:
    sys.path.insert(0, _script_dir)
from master_vault_data import MASTER_VAULT_SEED, FACT_CAPSULES

# ---------------------------------------------------------------------------
# RSS Live Scraping Feeds for Daily Auto-Updates via GitHub Actions
# ---------------------------------------------------------------------------
LIVE_CA_FEEDS = [
    {
        "source": "PIB National Releases",
        "url": "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1",
        "default_cat": "National Affairs & Schemes",
        "scope": "India"
    },
    {
        "source": "PIB Prime Minister & Cabinet",
        "url": "https://pib.gov.in/RssMain.aspx?ModId=3&Lang=1",
        "default_cat": "Polity & Governance",
        "scope": "India"
    },
    {
        "source": "The Hindu National News",
        "url": "https://www.thehindu.com/news/national/feeder/default.rss",
        "default_cat": "National Affairs & Schemes",
        "scope": "India"
    },
    {
        "source": "The Hindu International",
        "url": "https://www.thehindu.com/news/international/feeder/default.rss",
        "default_cat": "International & Global Affairs",
        "scope": "World"
    },
    {
        "source": "The Hindu Sci-Tech",
        "url": "https://www.thehindu.com/sci-tech/science/feeder/default.rss",
        "default_cat": "Science, Tech & Defence",
        "scope": "World & India"
    },
    {
        "source": "The Hindu Business & Economy",
        "url": "https://www.thehindu.com/business/feeder/default.rss",
        "default_cat": "Economy & Infrastructure",
        "scope": "India"
    },
    {
        "source": "The Hindu Sports",
        "url": "https://www.thehindu.com/sport/feeder/default.rss",
        "default_cat": "Sports & Games",
        "scope": "World & India"
    },
    {
        "source": "LiveMint Economy",
        "url": "https://www.livemint.com/rss/economy",
        "default_cat": "Economy & Infrastructure",
        "scope": "India"
    },
    {
        "source": "Economic Times Banking",
        "url": "https://economictimes.indiatimes.com/industry/banking/finance/banking/rssfeeds/13358319.cms",
        "default_cat": "Banking & Finance",
        "scope": "India"
    },
    {
        "source": "The Indian Express Explained",
        "url": "https://indianexpress.com/section/explained/feed/",
        "default_cat": "Polity & Governance",
        "scope": "India"
    },
    {
        "source": "The Indian Express India",
        "url": "https://indianexpress.com/section/india/feed/",
        "default_cat": "National Affairs & Schemes",
        "scope": "India"
    },
    {
        "source": "The Indian Express World",
        "url": "https://indianexpress.com/section/world/feed/",
        "default_cat": "International & Global Affairs",
        "scope": "World"
    },
    {
        "source": "BBC World News",
        "url": "https://feeds.bbci.co.uk/news/world/rss.xml",
        "default_cat": "International & Global Affairs",
        "scope": "World"
    },
    {
        "source": "BBC Science & Environment",
        "url": "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
        "default_cat": "Environment & Ecology",
        "scope": "World"
    }
]

def clean_html(text: str) -> str:
    if not text:
        return ""
    text = text.replace("\u2018", "'").replace("\u2019", "'").replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2013", "-").replace("\u2014", "-").replace("\ufffd", "'").replace("\x92", "'")
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def classify_category(title: str, content: str, default_cat: str) -> str:
    combined = (title + " " + content).lower()
    for cat, keywords in CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw in combined:
                return cat
    return default_cat

def infer_scope(title: str, content: str, default_scope: str) -> str:
    combined = (title + " " + content).lower()
    india_cues = ["india", "delhi", "rbi", "isro", "pib", "bengaluru", "mumbai", "modi", "tamil nadu", "gujarat", "assam"]
    world_cues = ["un", "united nations", "g20", "brics", "baku", "washington", "ukraine", "russia", "china", "olympics"]
    
    india_matches = sum(1 for c in india_cues if c in combined)
    world_matches = sum(1 for c in world_cues if c in combined)
    
    if india_matches > 0 and world_matches > 0:
        return "World & India"
    elif india_matches > 0:
        return "India"
    elif world_matches > 0:
        return "World"
    return default_scope

def generate_exam_crux(title: str, summary: str, category: str) -> str:
    if not summary:
        summary = title
    sentences = re.split(r"(?<=[.!?]) +", summary)
    first_two = " ".join(sentences[:2]).strip()
    return f"Key Exam Focus: {first_two if len(first_two) > 40 else summary}"

def generate_takeaways(title: str, summary: str, category: str) -> list:
    sentences = [s.strip() for s in re.split(r"(?<=[.!?]) +", summary) if len(s.strip()) > 30]
    if len(sentences) >= 3:
        return sentences[:3]
    elif len(sentences) == 2:
        return [
            sentences[0],
            sentences[1],
            f"Exam Relevance: High-priority topic under {category} for UPSC Prelims and Banking Mains revision."
        ]
    elif len(sentences) == 1:
        return [
            sentences[0],
            f"Core Context: Recent institutional policy development concerning {category}.",
            f"Exam Relevance: High-priority topic for prelims factual questions and mains analytical answers."
        ]
    return [
        f"Significant development reported under {category} with direct bearing on national policy.",
        f"Policy implication: Highlights active governmental regulatory intervention and governance frameworks.",
        "Candidate takeaway: Revise statutory provisions, constitutional articles, and key organizations involved."
    ]

def generate_prelims_pointers(title: str, category: str, scope: str) -> dict:
    agencies = {
        "Banking & Finance": ("Reserve Bank of India (RBI)", "RBI Act 1934 / Banking Regulation Act 1949"),
        "Polity & Governance": ("Supreme Court of India / ECI", "Constitution of India / RP Act 1951"),
        "Economy & Infrastructure": ("Ministry of Finance / NITI Aayog", "Fiscal Responsibility and Budget Management (FRBM) Act"),
        "Science, Tech & Defence": ("ISRO / DRDO / Ministry of Defence", "Department of Space / Armed Forces Act"),
        "History, Art & Culture": ("Archaeological Survey of India (ASI)", "AMASR Act 1958 / UNESCO Convention"),
        "Sports & Games": ("Ministry of Youth Affairs and Sports", "National Sports Code / Olympic Charter"),
        "National Affairs & Schemes": ("Central Government Ministry", "Flagship Centrally Sponsored / Central Sector Scheme"),
        "International & Global Affairs": ("Ministry of External Affairs / UN", "Bilateral / Multilateral Treaty Framework"),
        "Environment & Ecology": ("MoEFCC / NTCA", "Wildlife Protection Act 1972 / Environment Protection Act 1986")
    }
    agency, statute = agencies.get(category, ("Government of India", "National Regulatory Framework"))
    return {
        "key_agency": agency,
        "statutory_anchor": statute,
        "location": "India / International" if scope == "World & India" else ("India" if scope == "India" else "Global"),
        "facts_to_remember": f"Key prelims concept under {category}: Note associated constitutional articles, nodal ministry, and quantifiable targets."
    }

def generate_mcq(title: str, category: str) -> dict:
    return {
        "question": f"With reference to recent developments regarding '{title[:75]}...', consider the following statements: Which is most accurate?",
        "options": [
            f"It represents an initiative led by the designated nodal agency under {category}.",
            "It is restricted entirely to municipal administration without central involvement.",
            "It supersedes constitutional fundamental rights under all circumstances.",
            "It has been repealed by the Supreme Court with retrospective effect."
        ],
        "answer": 0,
        "explanation": f"Statement A is correct: This recent development falls directly under {category} and is administered by the respective central or international regulatory bodies."
    }

def fetch_rss_feed(feed_cfg: dict) -> list:
    url = feed_cfg["url"]
    source = feed_cfg["source"]
    default_cat = feed_cfg["default_cat"]
    default_scope = feed_cfg["scope"]
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/rss+xml, application/xml, text/xml, */*"
    }
    
    req = urllib.request.Request(url, headers=headers)
    items = []
    
    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            xml_bytes = response.read()
            raw_text = xml_bytes.decode("utf-8", errors="replace")
            # Strip invalid XML 1.0 control characters
            clean_xml = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F]", "", raw_text)
            root = ET.fromstring(clean_xml.encode("utf-8"))
            
            channel = root.find("channel")
            if channel is not None:
                entries = channel.findall("item")
            else:
                # Atom feed fallback
                entries = root.findall("{http://www.w3.org/2005/Atom}entry")
            
            for elem in entries[:15]:
                # Extract Title
                title_elem = elem.find("title") if channel is not None else elem.find("{http://www.w3.org/2005/Atom}title")
                title = clean_html(title_elem.text if title_elem is not None else "")
                if not title or len(title) < 15:
                    continue
                
                # Extract Link
                link = ""
                if channel is not None:
                    link_elem = elem.find("link")
                    if link_elem is not None:
                        link = (link_elem.text or "").strip()
                else:
                    link_elem = elem.find("{http://www.w3.org/2005/Atom}link")
                    if link_elem is not None:
                        link = link_elem.attrib.get("href", "")
                
                # Extract Description / Summary
                desc_elem = elem.find("description") if channel is not None else elem.find("{http://www.w3.org/2005/Atom}summary")
                desc = clean_html(desc_elem.text if desc_elem is not None else "")
                
                # Date
                pub_elem = elem.find("pubDate") if channel is not None else elem.find("{http://www.w3.org/2005/Atom}updated")
                pub_str = pub_elem.text if pub_elem is not None else ""
                today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
                
                # Classify
                category = classify_category(title, desc, default_cat)
                scope = infer_scope(title, desc, default_scope)
                crux = generate_exam_crux(title, desc, category)
                takeaways = generate_takeaways(title, desc, category)
                prelims = generate_prelims_pointers(title, category, scope)
                mcq = generate_mcq(title, category)
                
                safe_slug = re.sub(r"[^a-zA-Z0-9]+", "-", title.lower()).strip("-")[:45]
                item_id = f"ca-{today_str}-{safe_slug}"
                
                items.append({
                    "id": item_id,
                    "title": title,
                    "date": today_str,
                    "category": category,
                    "subcategory": f"{category} Brief",
                    "scope": scope,
                    "exam_tags": ["UPSC", "State PCS", "Banking", "SSC"],
                    "summary": desc or title,
                    "crux": crux,
                    "takeaways": takeaways,
                    "prelims_pointers": prelims,
                    "mcq": mcq,
                    "source": source,
                    "url": link,
                    "is_vault": False
                })
    except Exception as e:
        print(f"  [Notice] Skipping feed '{source}': {e}")
        
    return items

def fetch_newsonair_news():
    """
    Fetches official Government of India news broadcasts from Akashvani / News On AIR (newsonair.gov.in)
    covering National, International, Business/Economy, and Sports categories.
    """
    categories = [
        ("https://newsonair.gov.in/category/national/", "National Affairs & Schemes", "India"),
        ("https://newsonair.gov.in/category/international/", "International & Global Affairs", "World"),
        ("https://newsonair.gov.in/category/business/", "Economy & Infrastructure", "India"),
        ("https://newsonair.gov.in/category/sports/", "Sports & Games", "World & India"),
    ]
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }
    
    items = []
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    
    for url, default_cat, default_scope in categories:
        cat_name = url.strip("/").split("/")[-1].title()
        print(f"Querying News On AIR (newsonair.gov.in): {cat_name}...")
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=12) as response:
                raw_html = response.read().decode("utf-8", errors="ignore")
                article_blocks = re.findall(r'<article[^>]*>(.*?)</article>', raw_html, re.DOTALL)
                
                count = 0
                for block in article_blocks[:12]:
                    title_match = re.search(r'<h[2-4][^>]*>\s*<a[^>]+href=["\'](https://newsonair\.gov\.in/[^"\']+)["\'][^>]*>(.*?)</a>', block, re.DOTALL)
                    if not title_match:
                        title_match = re.search(r'<a[^>]+href=["\'](https://newsonair\.gov\.in/[^"\']+)["\'][^>]*class="[^"]*entry-title[^"]*"[^>]*>(.*?)</a>', block, re.DOTALL)
                    
                    if not title_match:
                        continue
                        
                    link = title_match.group(1).strip()
                    title = clean_html(title_match.group(2))
                    
                    if len(title) < 15 or '/category/' in link or link.endswith(('/feedback/', '/about-us/')):
                        continue
                        
                    desc_match = re.search(r'<p[^>]+class=["\'][^"\']*blogDisc[^"\']*["\'][^>]*>(.*?)</p>', block, re.DOTALL)
                    desc = clean_html(desc_match.group(1)) if desc_match else title
                    
                    date_match = re.search(r'<p[^>]+class=["\'][^"\']*colorPrimary[^"\']*["\'][^>]*>(.*?)</p>', block, re.DOTALL)
                    date_str = today_str
                    if date_match:
                        raw_date = html.unescape(re.sub(r'<[^>]+>', '', date_match.group(1))).strip()
                        m = re.search(r'([A-Za-z]+ \d{1,2}, \d{4})', raw_date)
                        if m:
                            try:
                                dt = datetime.strptime(m.group(1), "%B %d, %Y")
                                date_str = dt.strftime("%Y-%m-%d")
                            except Exception:
                                pass
                                
                    category = classify_category(title, desc, default_cat)
                    scope = infer_scope(title, desc, default_scope)
                    crux = generate_exam_crux(title, desc, category)
                    takeaways = generate_takeaways(title, desc, category)
                    prelims = generate_prelims_pointers(title, category, scope)
                    mcq = generate_mcq(title, category)
                    
                    safe_slug = re.sub(r"[^a-zA-Z0-9]+", "-", title.lower()).strip("-")[:45]
                    item_id = f"ca-air-{date_str}-{safe_slug}"
                    
                    items.append({
                        "id": item_id,
                        "title": title,
                        "date": date_str,
                        "category": category,
                        "subcategory": f"{category} (AIR Broadcast)",
                        "scope": scope,
                        "exam_tags": ["UPSC", "State PCS", "Banking", "SSC"],
                        "summary": desc,
                        "crux": crux,
                        "takeaways": takeaways,
                        "prelims_pointers": prelims,
                        "mcq": mcq,
                        "source": "News On AIR (Akashvani)",
                        "url": link,
                        "is_vault": False
                    })
                    count += 1
                print(f"  -> Extracted {count} broadcast items from News On AIR {cat_name}")
        except Exception as e:
            print(f"  [Notice] Skipping News On AIR ({cat_name}): {e}")
            
    return items

def update_current_affairs_dataset():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    data_file = os.path.join(project_root, "data", "current_affairs.json")
    
    print(f"=== Daily Exam Current Affairs Fetcher starting at {datetime.now(timezone.utc).isoformat()} ===")
    
    existing_items = []
    if os.path.exists(data_file):
        try:
            with open(data_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict) and "items" in data:
                    existing_items = data["items"]
                elif isinstance(data, list):
                    existing_items = data
        except Exception as e:
            print(f"Error reading existing current affairs data: {e}")
            
    existing_ids = {item["id"] for item in existing_items}
    existing_titles = {item.get("title", "").strip().lower() for item in existing_items}
    
    # 1. Merge Seed items if not present and ensure is_vault flag is set
    seed_map = {seed["id"]: seed for seed in MASTER_VAULT_SEED}
    for item in existing_items:
        if item.get("id") in seed_map:
            item.update(seed_map[item["id"]])
            item["is_vault"] = True
        else:
            item["is_vault"] = False

    seed_added = 0
    for seed in MASTER_VAULT_SEED:
        if seed["id"] not in existing_ids and seed["title"].strip().lower() not in existing_titles:
            existing_items.append(seed)
            existing_ids.add(seed["id"])
            existing_titles.add(seed["title"].strip().lower())
            seed_added += 1
            
    print(f"Master Vault Seed: verified {len(MASTER_VAULT_SEED)} high-yield core dossiers ({seed_added} new).")
    
    # 2. Fetch live daily items from RSS feeds
    new_daily_items = []
    for cfg in LIVE_CA_FEEDS:
        print(f"Querying RSS: {cfg['source']} ({cfg['default_cat']})...")
        fetched = fetch_rss_feed(cfg)
        count = 0
        for item in fetched:
            t_norm = item["title"].strip().lower()
            if item["id"] not in existing_ids and t_norm not in existing_titles:
                new_daily_items.append(item)
                existing_ids.add(item["id"])
                existing_titles.add(t_norm)
                count += 1
        print(f"  -> Extracted {count} fresh daily items from {cfg['source']}")
        
    # 2b. Fetch official news from News On AIR (Akashvani / newsonair.gov.in)
    print("Querying News On AIR (newsonair.gov.in) official broadcasts...")
    air_items = fetch_newsonair_news()
    air_count = 0
    for item in air_items:
        t_norm = item["title"].strip().lower()
        if item["id"] not in existing_ids and t_norm not in existing_titles:
            new_daily_items.append(item)
            existing_ids.add(item["id"])
            existing_titles.add(t_norm)
            air_count += 1
    print(f"  -> Extracted {air_count} fresh items from News On AIR (newsonair.gov.in)")
        
    # 3. Combine and sort
    all_items = new_daily_items + existing_items
    all_items.sort(key=lambda x: x.get("date", "2000-01-01"), reverse=True)
    
    # 4. Save formatted JSON
    output = {
        "last_updated": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        "total_records": len(all_items),
        "categories": [
            "Banking & Finance",
            "Polity & Governance",
            "Economy & Infrastructure",
            "Science, Tech & Defence",
            "History, Art & Culture",
            "Sports & Games",
            "National Affairs & Schemes",
            "International & Global Affairs",
            "Environment & Ecology"
        ],
        "fact_capsules": FACT_CAPSULES,
        "items": all_items
    }
    
    os.makedirs(os.path.dirname(data_file), exist_ok=True)
    with open(data_file, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
        
    print(f"=== Successfully updated Current Affairs Vault: {len(all_items)} total items ({len(new_daily_items)} new daily) to {data_file} ===")

if __name__ == "__main__":
    update_current_affairs_dataset()
