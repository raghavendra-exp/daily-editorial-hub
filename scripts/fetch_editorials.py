#!/usr/bin/env python3
"""
Daily Editorial & Paper Fetcher (Resourceful Edition)
Fetches RSS feeds from top newspapers (The Indian Express, The Hindu, The Guardian,
LiveMint) and research repositories (arXiv, Nature), extracts content, generates
30-second crux, 3 key takeaways, 360-degree analytical dimensions, actionable
way-forward policy recommendations, vocabulary, and daily MCQ review questions.
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
    "imperative": {"def": "Of vital importance; crucial or an essential priority", "pos": "Adjective / Noun", "synonyms": ["vital", "essential", "crucial"], "antonyms": ["optional", "negligible"]},
    "tenuous": {"def": "Very weak or slight; insubstantial", "pos": "Adjective", "synonyms": ["flimsy", "fragile", "shaky"], "antonyms": ["strong", "robust", "firm"]},
    "scrutiny": {"def": "Critical observation or thorough examination", "pos": "Noun", "synonyms": ["inspection", "examination", "audit"], "antonyms": ["neglect", "glance"]},
    "unprecedented": {"def": "Never done or known before", "pos": "Adjective", "synonyms": ["unparalleled", "novel", "groundbreaking"], "antonyms": ["common", "customary"]},
    "bipartisan": {"def": "Involving agreement or cooperation between opposing political parties", "pos": "Adjective", "synonyms": ["two-party", "coalition", "non-partisan"], "antonyms": ["partisan", "sectarian"]},
    "fiscal": {"def": "Relating to government revenue, taxes, and public spending", "pos": "Adjective", "synonyms": ["monetary", "financial", "budgetary"], "antonyms": []},
    "paradigm": {"def": "A typical example or pattern of something; a framework of ideas", "pos": "Noun", "synonyms": ["model", "archetype", "framework"], "antonyms": []},
    "complacency": {"def": "A feeling of smug or uncritical self-satisfaction with current conditions", "pos": "Noun", "synonyms": ["smugness", "self-satisfaction", "inertia"], "antonyms": ["vigilance", "alertness"]},
    "disparity": {"def": "A great difference or inequality", "pos": "Noun", "synonyms": ["imbalance", "discrepancy", "gap"], "antonyms": ["parity", "equality", "similarity"]},
    "judicious": {"def": "Having, showing, or done with good judgment or sense", "pos": "Adjective", "synonyms": ["prudent", "wise", "discreet"], "antonyms": ["foolish", "imprudent", "rash"]},
    "calamitous": {"def": "Catastrophic or disastrous", "pos": "Adjective", "synonyms": ["disastrous", "ruinous", "dire"], "antonyms": ["beneficial", "advantageous"]},
    "ubiquitous": {"def": "Present, appearing, or found everywhere", "pos": "Adjective", "synonyms": ["omnipresent", "pervasive", "everywhere"], "antonyms": ["rare", "scarce"]},
    "mitigate": {"def": "Make less severe, serious, or painful", "pos": "Verb", "synonyms": ["alleviate", "reduce", "diminish"], "antonyms": ["aggravate", "intensify"]},
    "conundrum": {"def": "A confusing and difficult problem or dilemma", "pos": "Noun", "synonyms": ["dilemma", "puzzle", "quandary"], "antonyms": ["solution", "clarity"]},
    "sovereignty": {"def": "Supreme authority; self-governing authority of a state", "pos": "Noun", "synonyms": ["autonomy", "independence", "self-governance"], "antonyms": ["dependence", "subjugation"]},
    "resilience": {"def": "The capacity to recover quickly from difficulties; systemic toughness", "pos": "Noun", "synonyms": ["toughness", "adaptability", "endurance"], "antonyms": ["fragility", "vulnerability"]},
    "substantive": {"def": "Having a firm basis in reality; meaningful, considerable", "pos": "Adjective", "synonyms": ["significant", "meaningful", "tangible"], "antonyms": ["trivial", "inconsequential"]},
    "benchmark": {"def": "A standard or point of reference against which things may be compared", "pos": "Noun / Verb", "synonyms": ["standard", "criterion", "gauge"], "antonyms": []},
    "equitable": {"def": "Fair, impartial, and just to all parties", "pos": "Adjective", "synonyms": ["fair", "just", "unbiased"], "antonyms": ["unfair", "inequitable", "biased"]},
    "stagnation": {"def": "Prolonged period of little or no growth or progress", "pos": "Noun", "synonyms": ["slump", "downturn", "inactivity"], "antonyms": ["growth", "boom", "vitality"]},
    "rigorous": {"def": "Extremely thorough, exhaustive, and exacting", "pos": "Adjective", "synonyms": ["meticulous", "exacting", "stringent"], "antonyms": ["lax", "careless", "superficial"]},
    "institutional": {"def": "Relating to an established organization, law, or custom", "pos": "Adjective", "synonyms": ["formal", "established", "systemic"], "antonyms": ["individual", "informal"]},
    "consensus": {"def": "A general agreement among a group of people", "pos": "Noun", "synonyms": ["accord", "harmony", "unity"], "antonyms": ["discord", "disagreement"]},
    "equilibrium": {"def": "A state in which opposing forces or influences are balanced", "pos": "Noun", "synonyms": ["balance", "symmetry", "stability"], "antonyms": ["imbalance", "instability"]},
    "hegemony": {"def": "Leadership or dominance, especially by one state or group over others", "pos": "Noun", "synonyms": ["dominance", "supremacy", "ascendancy"], "antonyms": ["subordination", "equality"]},
    "ostensible": {"def": "Stated or appearing to be true, but not necessarily so", "pos": "Adjective", "synonyms": ["apparent", "superficial", "professed"], "antonyms": ["genuine", "actual"]},
    "salient": {"def": "Most noticeable, prominent, or important", "pos": "Adjective", "synonyms": ["striking", "notable", "vital"], "antonyms": ["minor", "inconsequential"]}
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
        "source": "The Hindu",
        "category": "National Affairs",
        "url": "https://www.thehindu.com/opinion/editorial/feeder/default.rss",
        "icon": "🇮🇳",
        "bias": "Balanced / Formal",
        "type": "Newspaper Editorial"
    },
    {
        "source": "LiveMint",
        "category": "Economy & Banking",
        "url": "https://www.livemint.com/rss/opinion",
        "icon": "📊",
        "bias": "Economic / Analytical",
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
        "source": "Nature Research",
        "category": "Science & Tech Digest",
        "url": "https://www.nature.com/nature.rss",
        "icon": "🔬",
        "bias": "Scientific / Peer-Reviewed",
        "type": "Research Journal"
    },
    {
        "source": "arXiv AI & CS",
        "category": "Tech & AI Research",
        "url": "https://rss.arxiv.org/rss/cs.AI",
        "icon": "🤖",
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
    """Safely find first element among multiple tag names."""
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
                
    if len(found) < 3:
        backup_keys = list(VOCAB_DATABASE.keys())
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

def generate_analytical_dimensions(title, category):
    """Synthesize 360-degree analytical dimensions (Economic, Governance, Social, Global)."""
    clean_t = title.split('|')[0].split(':')[0].strip()
    
    if "Economy" in category or "Bank" in category:
        return {
            "economic": f"Examines macroeconomic stability, fiscal consolidation, inflationary pressures, and monetary policy transmission related to {clean_t}.",
            "governance": "Requires institutional agility from financial regulators (RBI, SEBI) and transparent corporate governance frameworks.",
            "social": "Direct bearing on purchasing power, livelihood security, and financial inclusion for underserved demographics.",
            "global": "Influenced by global supply chains, cross-border capital flows, currency volatility, and commodity benchmarks."
        }
    elif "Polity" in category or "National" in category:
        return {
            "economic": "Fiscal federalism considerations and public expenditure priorities necessary to support statutory mandates.",
            "governance": f"Checks and balances between executive action and legislative oversight, ensuring constitutional fidelity in {clean_t}.",
            "social": "Protection of fundamental civil liberties, citizen-centric administrative delivery, and participatory democracy.",
            "global": "Upholding international democratic norms, human rights treaties, and global governance rankings."
        }
    elif "Science" in category or "Tech" in category or "AI" in category:
        return {
            "economic": "Productivity multipliers, technological capital investments, intellectual property rights, and potential labor displacement.",
            "governance": f"Regulatory sandbox models, algorithmic accountability, data privacy laws, and ethical guardrails around {clean_t}.",
            "social": "Bridging digital divides, democratizing access to innovations, and safeguarding societal trust.",
            "global": "Strategic tech diplomacy, international standards consensus, and mitigating cross-border cyber/algorithmic vulnerabilities."
        }
    else:
        return {
            "economic": "Resource mobilization and equitable burden-sharing between public and private stakeholders.",
            "governance": f"Institutional reforms, policy predictability, and transparent coordination across federal machinery concerning {clean_t}.",
            "social": "Human development index impact, inclusivity, and sustainable intergenerational outcomes.",
            "global": "Multilateral engagement, strategic autonomy, and compliance with rules-based international frameworks."
        }

def generate_way_forward(title, category):
    """Generate 3 actionable, structured policy recommendations."""
    clean_t = title.split('|')[0].split(':')[0].strip()
    
    if "Economy" in category or "Bank" in category:
        return [
            f"Institutionalize countercyclical fiscal measures and maintain prudent liquidity buffers to safeguard against external market volatility.",
            f"Accelerate structural reforms aimed at enhancing formal credit access and lowering the cost of doing business.",
            f"Strengthen inter-regulatory coordination to ensure early detection of stressed assets and foster financial innovation."
        ]
    elif "Science" in category or "Tech" in category or "AI" in category:
        return [
            f"Establish agile, multi-stakeholder advisory bodies to regularly update regulatory codes as technology evolves.",
            f"Incentivize domestic R&D public-private partnerships while enforcing stringent data sovereignty and algorithmic safety.",
            f"Invest proactively in workforce reskilling programs to address technological transitions and mitigate societal frictions."
        ]
    else:
        return [
            f"Adopt an evidence-based consultative process with civil society and sub-national authorities prior to policy rollouts.",
            f"Deploy digital monitoring and transparent audit mechanisms to eliminate administrative leakages and bolster accountability.",
            f"Balance short-term crisis mitigation with long-term institutional capacity building to ensure lasting systemic resilience."
        ]

def generate_quiz_question(title, vocab, category):
    """Generate interactive multiple-choice review question for daily testing."""
    clean_t = title.split('|')[0].split(':')[0].strip()
    if vocab and len(vocab) > 0:
        target_word = vocab[0]["word"]
        definition = vocab[0]["definition"]
        synonyms = vocab[0].get("synonyms", ["appropriate", "suitable"])
        antonyms = vocab[0].get("antonyms", ["unrelated", "irrelevant"])
        
        correct_syn = synonyms[0] if len(synonyms) > 0 else "proper"
        distractor1 = antonyms[0] if len(antonyms) > 0 else "negligible"
        distractor2 = "unrelated"
        distractor3 = "temporary"
        
        return {
            "question": f"In the context of the discussion on '{clean_t}', what is the primary meaning of the term '{target_word}'?",
            "options": [
                definition,
                f"A state of total indifference or neglect",
                f"An informal verbal agreement without legal force",
                f"A short-term tactical concession"
            ],
            "answer": 0,
            "explanation": f"'{target_word}' is defined as: {definition}. Synonyms include {', '.join(synonyms)}."
        }
    else:
        return {
            "question": f"What is the central focus of the analysis regarding '{clean_t}'?",
            "options": [
                f"Examining structural bottlenecks and advocating institutional reforms",
                f"Recommending immediate complete privatization of the sector",
                f"Calling for the dissolution of existing regulatory oversight",
                f"Restricting multilateral trade agreements entirely"
            ],
            "answer": 0,
            "explanation": f"The editorial primarily examines underlying structural challenges within {category} and underscores the imperative for evidence-based policy reform."
        }

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

    clean_t = title.split('|')[0].split(':')[0].strip()
    if "Science" in category or "Tech" in category or "AI" in category:
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

            # Handle RSS 2.0, RSS 1.0 (RDF), and Atom namespaces
            items = root.findall(".//item")
            if not items:
                items = root.findall(".//{http://purl.org/rss/1.0/}item")
            if not items:
                items = root.findall(".//{http://www.w3.org/2005/Atom}entry")

            for item in items[:8]:
                title = get_text(item, ["title", "{http://www.w3.org/2005/Atom}title", "{http://purl.org/rss/1.0/}title"])
                
                link_elem = find_first(item, ["link", "{http://www.w3.org/2005/Atom}link", "{http://purl.org/rss/1.0/}link"])
                link = ""
                if link_elem is not None:
                    link = (link_elem.text or "").strip()
                    if not link:
                        link = link_elem.get("href", "").strip()

                desc = get_text(item, [
                    "description",
                    "{http://www.w3.org/2005/Atom}summary",
                    "{http://www.w3.org/2005/Atom}content",
                    "{http://purl.org/rss/1.0/}description",
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

                clean_title = re.sub(r'\s*\|\s*(?:Editorial|The Hindu|Opinion|LiveMint).*$', '', title).strip()

                date_formatted = datetime.now(timezone.utc).strftime("%Y-%m-%d")
                if pub_date_str:
                    try:
                        clean_dt_str = re.sub(r'\s+[A-Z]{3,4}$', '', pub_date_str.strip())
                        if "," in clean_dt_str:
                            dt = datetime.strptime(clean_dt_str[:25].strip(), "%a, %d %b %Y %H:%M:%S")
                            date_formatted = dt.strftime("%Y-%m-%d")
                        elif "T" in clean_dt_str:
                            dt = datetime.fromisoformat(clean_dt_str.replace("Z", "+00:00"))
                            date_formatted = dt.strftime("%Y-%m-%d")
                    except Exception:
                        pass

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
                dimensions = generate_analytical_dimensions(clean_title, category)
                way_forward = generate_way_forward(clean_title, category)
                quiz = generate_quiz_question(clean_title, vocab, category)

                slug = re.sub(r'[^a-zA-Z0-9]+', '-', f"{source}-{clean_title}").strip('-').lower()[:70]

                full_content = desc
                if len(full_content) < 150:
                    full_content = (
                        f"This editorial analysis examines '{clean_title}', published in {source}. "
                        f"The piece delves into key structural challenges and emerging trends within the {category} domain. "
                        f"Readers are advised to study the critical takeaways, 360-degree analytical dimensions, and vocabulary definitions "
                        f"highlighted in this digest to enrich analytical comprehension and essay writing skills."
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
                    "dimensions": dimensions,
                    "way_forward": way_forward,
                    "vocabulary": vocab,
                    "quiz": quiz,
                    "practice_question": question,
                    "relevance_tag": gs_tag,
                    "content": full_content
                })

    except Exception as e:
        print(f"Error fetching {source} ({url}): {e}")

    return articles

def update_dataset():
    """Update data/editorials.json preserving historical entries and enriching them."""
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

    # Backfill dimensions, way_forward, and quiz for any existing articles that lack them
    for art in existing_articles:
        if "dimensions" not in art:
            art["dimensions"] = generate_analytical_dimensions(art.get("title", ""), art.get("category", "General"))
        if "way_forward" not in art:
            art["way_forward"] = generate_way_forward(art.get("title", ""), art.get("category", "General"))
        if "quiz" not in art:
            art["quiz"] = generate_quiz_question(art.get("title", ""), art.get("vocabulary", []), art.get("category", "General"))

    existing_ids = {a["id"] for a in existing_articles}
    existing_urls = {a.get("url") for a in existing_articles if a.get("url")}

    new_articles = []
    print(f"Starting resourceful feed fetch at {datetime.now(timezone.utc).isoformat()}...")
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
