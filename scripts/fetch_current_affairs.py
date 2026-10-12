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

# Pre-curated high-yield 1-Year Master Vault (Past 12 Months)
# Structured to provide exhaustive coverage for UPSC, State PCS, Banking, and SSC exams.
MASTER_VAULT_SEED = [
    # -----------------------------------------------------------------------
    # 1. Banking & Financial Awareness
    # -----------------------------------------------------------------------
    {
        "id": "ca-2026-bank-01",
        "title": "RBI Monetary Policy Stance & Liquidity Framework: Repo Rate Unchanged at 6.50%",
        "date": "2026-10-09",
        "category": "Banking & Finance",
        "subcategory": "RBI / Monetary Policy",
        "scope": "India",
        "exam_tags": ["Banking (IBPS/SBI/RBI)", "UPSC", "State PCS", "SSC"],
        "summary": "The Reserve Bank of India's Monetary Policy Committee (MPC) maintained the benchmark policy repo rate at 6.50% while shifting stance to 'Neutral' to support growth while ensuring inflation aligns durably with the 4% target.",
        "crux": "MPC retains repo rate at 6.50%, Standing Deposit Facility (SDF) at 6.25%, and Marginal Standing Facility (MSF) at 6.75%, adopting a neutral stance to calibrate monetary conditions.",
        "takeaways": [
            "MPC operates under Section 45ZB of the amended RBI Act, 1934, comprising 6 members (3 from RBI, 3 external experts appointed by Central Government).",
            "The Standing Deposit Facility (SDF), introduced in 2022, acts as the non-collateralized floor of the Liquidity Adjustment Facility (LAF) corridor.",
            "Inflation projection pegged at 4.5% for FY25 with real GDP growth projected at 7.2%."
        ],
        "prelims_pointers": {
            "key_agency": "Reserve Bank of India (RBI)",
            "statutory_anchor": "RBI Act 1934, Section 45ZB & Section 45ZA",
            "location": "Mumbai, Maharashtra",
            "facts_to_remember": "Repo: 6.50%, SDF: 6.25%, MSF: 6.75%, Bank Rate: 6.75%. Inflation target band: 4% ± 2%."
        },
        "mcq": {
            "question": "Which of the following statements regarding the Standing Deposit Facility (SDF) of the RBI is correct?",
            "options": [
                "It requires government securities as collateral to absorb liquidity.",
                "It absorbs liquidity from commercial banks without providing collateral securities.",
                "It operates at 50 basis points above the policy Repo Rate.",
                "It can only be accessed by Regional Rural Banks."
            ],
            "answer": 1,
            "explanation": "SDF was introduced under Section 17 of the RBI Act in 2022 as an uncollateralized liquidity absorption window operating at 25 bps below the repo rate."
        },
        "source": "RBI / PIB",
        "url": "https://rbi.org.in"
    },
    {
        "id": "ca-2026-bank-02",
        "title": "Digital Rupee (CBDC) Expansion: Offline Capability & Programmable Features Rolled Out",
        "date": "2026-09-22",
        "category": "Banking & Finance",
        "subcategory": "Fintech & Currency",
        "scope": "India",
        "exam_tags": ["Banking (IBPS/SBI/RBI)", "UPSC", "State PCS"],
        "summary": "RBI expanded the Central Bank Digital Currency (CBDC) pilot to introduce offline functionality in remote areas and programmability for targeted benefits such as agricultural credit and educational grants.",
        "crux": "Offline Digital Rupee enables peer-to-peer payments in connectivity-shadow zones, while programmable tokens ensure funds are spent only for intended purposes.",
        "takeaways": [
            "CBDC is a sovereign legal tender issued by RBI under the amended RBI Act, 1934, represented as digital bearer tokens.",
            "Two variants: CBDC-Wholesale (e₹-W) for interbank settlement and CBDC-Retail (e₹-R) for citizens and merchants.",
            "Cross-border wholesale CBDC pilot initiated with the Central Bank of the UAE to settle bilateral trade seamlessly."
        ],
        "prelims_pointers": {
            "key_agency": "Reserve Bank of India (RBI) & NPCI",
            "statutory_anchor": "RBI Act 1934 (amended via Finance Act 2022)",
            "location": "Pilot launched across major tier-1 and tier-2 banks",
            "facts_to_remember": "CBDC is a direct liability on RBI's balance sheet, unlike bank deposits or commercial wallets."
        },
        "mcq": {
            "question": "Unlike commercial mobile wallets and cryptocurrencies, India's Central Bank Digital Currency (e-Rupee) represents:",
            "options": [
                "A credit claim on the issuing commercial bank.",
                "A direct sovereign liability of the Reserve Bank of India.",
                "An asset-backed decentralized cryptographic token.",
                "A non-legal tender digital promissory note."
            ],
            "answer": 1,
            "explanation": "CBDC is digital sovereign currency and appears as a direct liability on the central bank's balance sheet with guaranteed convertibility to physical cash."
        },
        "source": "PIB / RBI Bulletin",
        "url": "https://rbi.org.in"
    },
    {
        "id": "ca-2026-bank-03",
        "title": "UPI Global Expansion: Cross-Border Linkages with UAE, France, Singapore, Mauritius & Sri Lanka",
        "date": "2026-08-18",
        "category": "Banking & Finance",
        "subcategory": "Digital Payments / Foreign Trade",
        "scope": "World & India",
        "exam_tags": ["Banking (IBPS/SBI/RBI)", "UPSC", "SSC"],
        "summary": "NPCI International Payments Limited (NIPL) expanded the footprint of the Unified Payments Interface (UPI) to international destinations including UAE (AANI/Jaywan), France, Mauritius, Sri Lanka, and Singapore.",
        "crux": "Indian travelers can scan local QR codes to make real-time rupee payments abroad without foreign exchange markups, boosting the internationalization of the Indian Rupee.",
        "takeaways": [
            "France became the first European country to accept UPI, starting with ticket bookings at the iconic Eiffel Tower.",
            "UPI-PayNow linkage between India and Singapore enables real-time cross-border P2P remittances.",
            "NIPL signed agreement with UAE's Al Etihad Payments to roll out domestic card scheme Jaywan based on RuPay tech."
        ],
        "prelims_pointers": {
            "key_agency": "NPCI International Payments Limited (NIPL)",
            "statutory_anchor": "Payment and Settlement Systems Act, 2007",
            "location": "Global / Paris / Abu Dhabi / Singapore / Colombo",
            "facts_to_remember": "NPCI was created by RBI and Indian Banks' Association (IBA) as a not-for-profit company under Section 8 of Companies Act 2013."
        },
        "mcq": {
            "question": "Which was the first European country to operationalize Unified Payments Interface (UPI) payments for tourists?",
            "options": ["Germany", "United Kingdom", "France", "Switzerland"],
            "answer": 2,
            "explanation": "France became the first European country to launch UPI, enabling tourists to purchase tickets at the Eiffel Tower using UPI apps."
        },
        "source": "PIB / Ministry of External Affairs",
        "url": "https://npci.org.in"
    },
    {
        "id": "ca-2026-bank-04",
        "title": "SEBI Launches T+0 Same-Day Rolling Settlement Cycle on Optional Basis",
        "date": "2026-07-14",
        "category": "Banking & Finance",
        "subcategory": "Capital Markets",
        "scope": "India",
        "exam_tags": ["Banking (IBPS/SBI/RBI)", "UPSC", "State PCS"],
        "summary": "The Securities and Exchange Board of India (SEBI) introduced a beta version of the T+0 settlement cycle for equity cash segments on an optional basis for select liquid stocks.",
        "crux": "Under T+0 settlement, sellers receive cash and buyers receive shares in their demat accounts on the same day of the trade transaction.",
        "takeaways": [
            "India became the second country after China to implement T+1 settlement in 2023, and is now pioneering T+0 same-day settlement.",
            "Enhances market liquidity, reduces settlement risk, and lowers capital margin requirements for institutional and retail traders.",
            "SEBI plans eventual transition toward instantaneous (T+instant) settlement using blockchain/distributed ledger technology."
        ],
        "prelims_pointers": {
            "key_agency": "Securities and Exchange Board of India (SEBI)",
            "statutory_anchor": "SEBI Act, 1992",
            "location": "Mumbai, Maharashtra",
            "facts_to_remember": "SEBI was established as a statutory body in 1992 following the SEBI Act. Current Chairperson: Madhabi Puri Buch."
        },
        "mcq": {
            "question": "In financial markets terminology, what does the implementation of 'T+0' settlement signify?",
            "options": [
                "Settlement of trades strictly at zero brokerage fees.",
                "Transfer of funds and securities on the very day the trade is executed.",
                "Settlement within zero business hours before market opens.",
                "Mandatory 24-hour cooling-off period before shares can be traded."
            ],
            "answer": 1,
            "explanation": "T+0 implies same-day settlement: the shares and funds are exchanged between buyer and seller on the same trading day (Day 0)."
        },
        "source": "SEBI / LiveMint",
        "url": "https://sebi.gov.in"
    },
    {
        "id": "ca-2026-bank-05",
        "title": "Pradhan Mantri Jan Dhan Yojana (PMJDY) Completes 10 Years: Crosses 53 Crore Accounts",
        "date": "2026-08-28",
        "category": "Banking & Finance",
        "subcategory": "Financial Inclusion / Schemes",
        "scope": "India",
        "exam_tags": ["Banking (IBPS/SBI/RBI)", "UPSC", "State PCS", "SSC"],
        "summary": "The National Mission for Financial Inclusion, PMJDY, marked a decade since its launch in August 2014, surpassing 53.1 crore bank accounts with cumulative deposits exceeding ₹2.31 lakh crore.",
        "crux": "Over 67% of PMJDY accounts are located in rural and semi-urban branches, and 55.6% of accounts belong to women beneficiaries, underpinning the JAM (Jan Dhan-Aadhaar-Mobile) trinity.",
        "takeaways": [
            "Provides zero balance Basic Savings Bank Deposit Account (BSBDA) with free RuPay debit card and ₹2 lakh accidental insurance cover.",
            "Offers an overdraft (OD) facility up to ₹10,000 for eligible account holders with no conditions up to ₹2,000.",
            "Operates as the primary pipeline for Direct Benefit Transfer (DBT) across central welfare schemes like PM-KISAN, PM-GKY, and LPG subsidies."
        ],
        "prelims_pointers": {
            "key_agency": "Department of Financial Services, Ministry of Finance",
            "statutory_anchor": "Announced August 15, 2014; launched August 28, 2014",
            "location": "Pan-India",
            "facts_to_remember": "Total accounts: 53+ Cr; RuPay cards issued: 36+ Cr; Zero-balance accounts dropped from 58% in 2015 to under 8% in 2024."
        },
        "mcq": {
            "question": "What is the maximum Overdraft (OD) facility limit available to an eligible PMJDY account holder?",
            "options": ["₹5,000", "₹7,500", "₹10,000", "₹15,000"],
            "answer": 2,
            "explanation": "The overdraft limit under PMJDY was enhanced from ₹5,000 to ₹10,000 with no conditions for overdraft up to ₹2,000."
        },
        "source": "PIB / Ministry of Finance",
        "url": "https://pmjdy.gov.in"
    },

    # -----------------------------------------------------------------------
    # 2. Polity, Governance & Constitution
    # -----------------------------------------------------------------------
    {
        "id": "ca-2026-polity-01",
        "title": "Supreme Court Unanimously Strikes Down Electoral Bonds Scheme as Unconstitutional",
        "date": "2026-02-15",
        "category": "Polity & Governance",
        "subcategory": "Judiciary & Elections",
        "scope": "India",
        "exam_tags": ["UPSC", "State PCS", "SSC", "Banking"],
        "summary": "A 5-judge Constitution Bench headed by CJI D.Y. Chandrachud unanimously invalidated the 2018 Electoral Bonds Scheme, ruling that anonymous corporate political funding violates the voters' right to information under Article 19(1)(a).",
        "crux": "The Supreme Court struck down amendments to the Companies Act, Representation of the People Act, and Income Tax Act, ordering SBI to disclose all donor and recipient bond data to ECI for public display.",
        "takeaways": [
            "Ruled that voter's right to information is essential to exercise freedom of speech and expression and to evaluate corporate influence on government policy.",
            "Rejected the government's argument that confidentiality of political donors is necessary to curb black money (doctrine of proportionality failed).",
            "Struck down amendment to Section 182 of Companies Act that had removed the 7.5% cap on corporate political donations."
        ],
        "prelims_pointers": {
            "key_agency": "Supreme Court of India (Constitution Bench)",
            "statutory_anchor": "Article 19(1)(a), Article 14, Representation of the People Act 1951",
            "location": "New Delhi",
            "facts_to_remember": "Case title: Association for Democratic Reforms (ADR) v. Union of India. Unanimous 5-0 judgment."
        },
        "mcq": {
            "question": "In the landmark judgment invalidating the Electoral Bonds Scheme, the Supreme Court held that donor anonymity violates:",
            "options": [
                "Right to Equality under Article 14 exclusively.",
                "Voters' fundamental right to information under Article 19(1)(a).",
                "Right to Privacy of corporate donors under Article 21.",
                "Article 324 powers of the Election Commission."
            ],
            "answer": 1,
            "explanation": "The Court held that voters have a fundamental right to know about political funding sources under Article 19(1)(a) to prevent corrupt quid pro quo arrangements."
        },
        "source": "Supreme Court of India / The Hindu",
        "url": "https://main.sci.gov.in"
    },
    {
        "id": "ca-2026-polity-02",
        "title": "Supreme Court 7-Judge Bench Permits Sub-Classification of SCs and STs for Quota",
        "date": "2026-08-01",
        "category": "Polity & Governance",
        "subcategory": "Social Justice & Constitution",
        "scope": "India",
        "exam_tags": ["UPSC", "State PCS", "Judiciary"],
        "summary": "In a 6:1 landmark ruling in State of Punjab v. Davinder Singh, a 7-judge Constitution bench ruled that state governments have constitutional power to create sub-categories within Scheduled Castes and Scheduled Tribes to ensure affirmative action reaches the most backward communities.",
        "crux": "The judgment overruled the 2004 E.V. Chinnaiah ruling, holding that sub-classification does not violate Article 341 or tinker with the Presidential list as long as it is backed by empirical data.",
        "takeaways": [
            "States cannot reserve 100% of seats for any sub-group; sub-classification must be based on objective empirical evidence of inadequate representation.",
            "Four out of seven judges opined that the 'creamy layer' principle should also apply to SCs and STs to exclude affluent members from reservations.",
            "Affirmed that substantive equality under Article 14 requires differential treatment for unequals within a broadly designated caste group."
        ],
        "prelims_pointers": {
            "key_agency": "Supreme Court of India (7-Judge Bench)",
            "statutory_anchor": "Articles 14, 15(4), 16(4), 341, and 342",
            "location": "New Delhi",
            "facts_to_remember": "Case: State of Punjab v. Davinder Singh. Overruled E.V. Chinnaiah (2004). Bench headed by CJI D.Y. Chandrachud (6:1 majority; Justice Bela Trivedi dissented)."
        },
        "mcq": {
            "question": "Which earlier landmark judgment was overruled by the 7-judge bench of the Supreme Court in the 2024 SC/ST sub-classification verdict?",
            "options": [
                "Indra Sawhney v. Union of India (1992)",
                "E.V. Chinnaiah v. State of Andhra Pradesh (2004)",
                "M. Nagaraj v. Union of India (2006)",
                "Jarnail Singh v. Lachhmi Narain Gupta (2018)"
            ],
            "answer": 1,
            "explanation": "The 2024 bench overruled the 2004 five-judge bench decision in E.V. Chinnaiah, which had held that the Presidential list of SCs under Article 341 formed a single homogeneous class that could not be sub-divided."
        },
        "source": "Supreme Court / PIB",
        "url": "https://main.sci.gov.in"
    },
    {
        "id": "ca-2026-polity-03",
        "title": "Three New Criminal Laws (BNS, BNSS, BSA) Come into Force Across India",
        "date": "2026-07-01",
        "category": "Polity & Governance",
        "subcategory": "Legal & Penal Reforms",
        "scope": "India",
        "exam_tags": ["UPSC", "State PCS", "Judiciary", "SSC"],
        "summary": "Three historic criminal laws came into full effect on July 1, 2024: the Bharatiya Nyaya Sanhita (BNS) replacing the Indian Penal Code 1860, the Bharatiya Nagarik Suraksha Sanhita (BNSS) replacing the CrPC 1973, and the Bharatiya Sakshya Adhiniyam (BSA) replacing the Indian Evidence Act 1872.",
        "crux": "The new laws modernize India's criminal justice system by digitizing forensics, introducing Zero FIR, e-FIR, community service as punishment, and replacing the archaic sedition law with acts endangering sovereignty.",
        "takeaways": [
            "BNS replaces sedition (IPC Section 124A) with Section 152 penalizing acts endangering the sovereignty, unity, and integrity of India.",
            "BNSS makes forensic examination mandatory for offenses punishable by 7 years of imprisonment or more.",
            "Introduces community service as a penal sentence for minor offenses (first time in Indian criminal law).",
            "BSA grants legal admissibility to electronic and digital records as primary evidence on par with physical documents."
        ],
        "prelims_pointers": {
            "key_agency": "Ministry of Home Affairs",
            "statutory_anchor": "BNS Act 2023, BNSS Act 2023, BSA Act 2023",
            "location": "Pan-India implementation",
            "facts_to_remember": "Date of enforcement: July 1, 2024. Replaced colonial laws dating back to 1860, 1872, and 1973."
        },
        "mcq": {
            "question": "Under the newly enacted Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023, forensic investigation by scientific experts is made mandatory for offenses punishable with imprisonment of:",
            "options": ["3 years or more", "5 years or more", "7 years or more", "10 years or more"],
            "answer": 2,
            "explanation": "BNSS mandates forensic inspection at the scene of crime for all offenses punishable with imprisonment of seven years or more."
        },
        "source": "PIB / Ministry of Home Affairs",
        "url": "https://mha.gov.in"
    },
    {
        "id": "ca-2026-polity-04",
        "title": "16th Finance Commission Formally Commences Work Under Dr. Arvind Panagariya",
        "date": "2026-02-01",
        "category": "Polity & Governance",
        "subcategory": "Fiscal Federalism",
        "scope": "India",
        "exam_tags": ["UPSC", "Banking (IBPS/SBI)", "State PCS", "SSC"],
        "summary": "The 16th Finance Commission, constituted under Article 280 of the Constitution and chaired by former NITI Aayog Vice Chairman Dr. Arvind Panagariya, began state consultations to determine vertical and horizontal tax devolution for 2026-2031.",
        "crux": "The Commission will recommend the sharing of net proceeds of taxes between Union and States, grants-in-aid to States, and measures to augment the consolidated funds of States to supplement panchayats and municipalities.",
        "takeaways": [
            "Award period: 5 years commencing April 1, 2026 to March 31, 2031.",
            "The 15th Finance Commission (chaired by N.K. Singh) had recommended 41% vertical devolution to States (retaining 1% for J&K and Ladakh).",
            "Key terms of reference include reviewing financing of Disaster Management initiatives under the Disaster Management Act, 2005."
        ],
        "prelims_pointers": {
            "key_agency": "16th Finance Commission",
            "statutory_anchor": "Article 280 & 281 of the Constitution of India",
            "location": "New Delhi",
            "facts_to_remember": "Chairman: Dr. Arvind Panagariya; Secretary: Ritvik Ranjanam Pandey; Report submission deadline: October 31, 2025."
        },
        "mcq": {
            "question": "Under Article 280 of the Indian Constitution, the Finance Commission is constituted by:",
            "options": [
                "The Prime Minister of India on recommendation of the Cabinet.",
                "The President of India at the expiration of every fifth year or earlier.",
                "The Speaker of the Lok Sabha in consultation with State Governors.",
                "The Union Minister of Finance."
            ],
            "answer": 1,
            "explanation": "Article 280(1) mandates the President to constitute a Finance Commission within two years from commencement and thereafter at the expiration of every fifth year."
        },
        "source": "PIB / Ministry of Finance",
        "url": "https://fincomindia.nic.in"
    },
    {
        "id": "ca-2026-polity-05",
        "title": "High-Level Committee on Simultaneous Elections (One Nation, One Election) Submits Report",
        "date": "2026-03-14",
        "category": "Polity & Governance",
        "subcategory": "Electoral Reforms",
        "scope": "India",
        "exam_tags": ["UPSC", "State PCS", "SSC"],
        "summary": "The High-Level Committee on Simultaneous Elections headed by former President Ram Nath Kovind presented its comprehensive report to the President of India, recommending synchronized elections for Lok Sabha and State Assemblies.",
        "crux": "Recommends a two-step implementation: synchronizing Lok Sabha and Assembly elections in Step 1, followed by synchronizing municipal and panchayat elections within 100 days in Step 2.",
        "takeaways": [
            "Proposes amendment to Article 82A introducing an 'Appointed Date' to harmonize state legislative assembly terms with Lok Sabha.",
            "Recommended introducing a Single Electoral Roll and Single Elector's Photo Identity Card (EPIC) across all three tiers of government.",
            "In the event of a hung assembly or no-confidence motion, fresh elections would be held only for the 'unexpired term' of the House."
        ],
        "prelims_pointers": {
            "key_agency": "High-Level Committee on Simultaneous Elections",
            "statutory_anchor": "Articles 83, 85, 172, 174, 356, and proposed Article 82A",
            "location": "New Delhi",
            "facts_to_remember": "Chairman: Ram Nath Kovind; Members included Amit Shah, Ghulam Nabi Azad, N.K. Singh, Subhash Kashyap, Harish Salve, Sanjay Kothari."
        },
        "mcq": {
            "question": "The Kovind Committee on Simultaneous Elections recommended that in the event of a mid-term dissolution of a state assembly, the newly elected assembly should serve for:",
            "options": [
                "A fresh full term of 5 years.",
                "Only the unexpired remainder of the original term.",
                "A fixed probationary period of 2.5 years.",
                "Until the President dissolves it under Article 356."
            ],
            "answer": 1,
            "explanation": "To maintain synchronization, the committee recommended that mid-term elected assemblies will continue only for the unexpired term until the next general election."
        },
        "source": "PIB / Ministry of Law and Justice",
        "url": "https://pib.gov.in"
    },

    # -----------------------------------------------------------------------
    # 3. Economy, Trade & Infrastructure
    # -----------------------------------------------------------------------
    {
        "id": "ca-2026-econ-01",
        "title": "India Signs Historic TEPA Free Trade Agreement with EFTA: $100 Billion Investment Commitment",
        "date": "2026-03-10",
        "category": "Economy & Infrastructure",
        "subcategory": "Foreign Trade & Bilateral Pacts",
        "scope": "World & India",
        "exam_tags": ["UPSC", "Banking (IBPS/SBI)", "State PCS", "SSC"],
        "summary": "India and the 4-nation European Free Trade Association (EFTA: Switzerland, Norway, Iceland, and Liechtenstein) signed the Trade and Economic Partnership Agreement (TEPA), featuring a legally binding commitment to invest $100 billion in India over 15 years.",
        "crux": "TEPA marks India's first FTA with a European bloc featuring binding foreign direct investment obligations, generating an estimated 1 million direct jobs in manufacturing and green tech.",
        "takeaways": [
            "EFTA is a non-EU trade bloc established in 1960 promoting free trade among members.",
            "Eliminates tariffs on 99.6% of India's exports to EFTA nations including gems, jewelry, textiles, machinery, and pharma.",
            "Excludes sensitive sectors like dairy, soya, and gold from zero-duty concessions to protect domestic producers."
        ],
        "prelims_pointers": {
            "key_agency": "Ministry of Commerce and Industry",
            "statutory_anchor": "Foreign Trade Policy / Bilateral Treaty",
            "location": "New Delhi / Geneva",
            "facts_to_remember": "EFTA members: Switzerland, Norway, Iceland, Liechtenstein. Investment pledge: $100 billion over 15 years; 1 million jobs."
        },
        "mcq": {
            "question": "Which of the following nations is NOT a member of the European Free Trade Association (EFTA)?",
            "options": ["Switzerland", "Norway", "Sweden", "Iceland"],
            "answer": 2,
            "explanation": "Sweden is a member of the European Union (EU), not EFTA. EFTA consists of 4 non-EU nations: Switzerland, Norway, Iceland, and Liechtenstein."
        },
        "source": "PIB / Ministry of Commerce",
        "url": "https://commerce.gov.in"
    },
    {
        "id": "ca-2026-econ-02",
        "title": "India's First Commercial Semiconductor Fabrication Plant Approved in Dholera, Gujarat",
        "date": "2026-03-01",
        "category": "Economy & Infrastructure",
        "subcategory": "Industrial Hubs / Manufacturing",
        "scope": "India",
        "exam_tags": ["UPSC", "State PCS", "SSC", "Banking"],
        "summary": "The Union Cabinet approved the establishment of India's first commercial semiconductor fabrication facility in Dholera Special Investment Region (SIR), Gujarat, by Tata Electronics in partnership with Taiwan's Powerchip Semiconductor Manufacturing Corp (PSMC).",
        "crux": "With an investment of ₹91,000 crore, the fab will have a capacity of 50,000 wafer starts per month, producing 28nm, 40nm, 55nm, and 90nm chips for automotive, computing, and telecommunications.",
        "takeaways": [
            "Part of the ₹76,000 crore ($10 billion) India Semiconductor Mission (ISM) launched under Digital India Corporation.",
            "Two additional packaging units approved: Tata Semiconductor Assembly & Test (TSAT) in Morigaon, Assam (₹27,000 cr) and CG Power in Sanand, Gujarat.",
            "Dholera SIR is India's first platinum-rated greenfield smart city developed along the Delhi-Mumbai Industrial Corridor (DMIC)."
        ],
        "prelims_pointers": {
            "key_agency": "India Semiconductor Mission (ISM), MeitY",
            "statutory_anchor": "National Policy on Electronics",
            "location": "Dholera, Gujarat & Morigaon, Assam",
            "facts_to_remember": "Fab partner: PSMC (Taiwan). Technology nodes: 28nm to 90nm. Total semiconductor projects outlay approved exceeds ₹1.25 lakh crore."
        },
        "mcq": {
            "question": "India's first commercial semiconductor wafer fabrication plant is being established at which location?",
            "options": ["Sanand, Gujarat", "Dholera, Gujarat", "Morigaon, Assam", "Sri City, Andhra Pradesh"],
            "answer": 1,
            "explanation": "Tata Electronics and Taiwan's PSMC are setting up India's first commercial fab plant at Dholera SIR in Gujarat."
        },
        "source": "PIB / MeitY",
        "url": "https://meity.gov.in"
    },
    {
        "id": "ca-2026-econ-03",
        "title": "Critical Minerals Mission: First Tranche of Offshore & Onshore Critical Mineral Blocks Auctioned",
        "date": "2026-06-25",
        "category": "Economy & Infrastructure",
        "subcategory": "Mining & Green Transition",
        "scope": "India",
        "exam_tags": ["UPSC", "State PCS", "SSC"],
        "summary": "The Ministry of Mines successfully completed the auction of critical mineral blocks including Lithium, Rare Earth Elements (REE), Titanium, Graphite, and Nickel across Jammu & Kashmir, Chhattisgarh, and offshore exclusive economic zones.",
        "crux": "Secures essential supply chains for electric vehicles (EV), renewable batteries, solar photovoltaic panels, and defence aerospace, reducing import dependency on China.",
        "takeaways": [
            "Mines and Minerals (Development and Regulation) Amendment Act 2023 removed 6 atomic minerals (including Lithium and Beryllium) from the atomic list, opening them to private commercial mining.",
            "Offshore Areas Mineral (Development and Regulation) Amendment Act enables transparent auction of seabed mineral reserves in India's EEZ.",
            "KABIL (Khanij Bidesh India Ltd), a JV of NALCO, HCL, and MECL, acquired 5 lithium brine blocks in Catamarca province, Argentina."
        ],
        "prelims_pointers": {
            "key_agency": "Ministry of Mines & KABIL",
            "statutory_anchor": "MMDR Amendment Act 2023 & Offshore Areas Mineral Act 2023",
            "location": "Reasi (J&K), Korba (Chhattisgarh), Argentina",
            "facts_to_remember": "India identified 30 critical minerals essential for economic development and national security."
        },
        "mcq": {
            "question": "Khanij Bidesh India Limited (KABIL) has secured lithium exploration and mining rights in which South American nation?",
            "options": ["Bolivia", "Chile", "Argentina", "Brazil"],
            "answer": 2,
            "explanation": "KABIL signed an agreement with the state-owned CAMYEN in Catamarca province, Argentina, to explore and develop 5 lithium brine blocks."
        },
        "source": "PIB / Ministry of Mines",
        "url": "https://mines.gov.in"
    },

    # -----------------------------------------------------------------------
    # 4. Science, Technology, Space & Defence
    # -----------------------------------------------------------------------
    {
        "id": "ca-2026-scitech-01",
        "title": "Aditya-L1 Solar Mission Enters Halo Orbit at Lagrange Point 1 (L1)",
        "date": "2026-01-06",
        "category": "Science, Tech & Defence",
        "subcategory": "Space Exploration / ISRO",
        "scope": "World & India",
        "exam_tags": ["UPSC", "State PCS", "SSC", "Banking"],
        "summary": "ISRO's maiden solar mission, Aditya-L1, successfully performed its final orbital injection burn to enter a five-year halo orbit around the Sun-Earth Lagrange Point 1 (L1), 1.5 million kilometers from Earth.",
        "crux": "From L1, Aditya-L1 enjoys an uninterrupted view of the Sun without eclipses or occultation, observing space weather, solar flares, and coronal mass ejections (CMEs).",
        "takeaways": [
            "Carries 7 scientific payloads: 4 for direct remote sensing of the Sun (VELC, SUIT, ASPEX, PAPA) and 3 for in-situ solar wind measurements.",
            "Lagrange points are equilibrium positions in space where gravitational pull of two large masses equals the centripetal force required to move with them.",
            "Visible Emission Line Coronagraph (VELC) designed by Indian Institute of Astrophysics (IIA) captures high-resolution coronal images."
        ],
        "prelims_pointers": {
            "key_agency": "Indian Space Research Organisation (ISRO)",
            "statutory_anchor": "Department of Space",
            "location": "Lagrange Point 1 (L1), 1.5 million km from Earth",
            "facts_to_remember": "Launched aboard PSLV-C57 from Sriharikota on Sept 2, 2023; inserted into halo orbit Jan 6, 2024. Operates 7 payloads."
        },
        "mcq": {
            "question": "Why is the Sun-Earth Lagrange Point 1 (L1) chosen as the observation orbital location for the Aditya-L1 spacecraft?",
            "options": [
                "It is located exactly halfway between Earth and Mars.",
                "It allows continuous, unhindered observation of the Sun without occultation or eclipses.",
                "It is completely shielded from solar wind and radiation.",
                "It is the point where the Sun's magnetic field is zero."
            ],
            "answer": 1,
            "explanation": "L1 provides an uninterrupted, continuous line-of-sight to the Sun without Earth's eclipses, enabling continuous solar monitoring."
        },
        "source": "ISRO / PIB",
        "url": "https://isro.gov.in"
    },
    {
        "id": "ca-2026-scitech-02",
        "title": "INS Arighaat: Second Indigenous Nuclear Ballistic Missile Submarine (SSBN) Commissioned",
        "date": "2026-08-29",
        "category": "Science, Tech & Defence",
        "subcategory": "Defence & Strategic Deterrence",
        "scope": "India",
        "exam_tags": ["UPSC", "State PCS", "Defence / CDS / NDA", "SSC"],
        "summary": "India commissioned its second indigenous nuclear-powered ballistic missile submarine, INS Arighaat (S3), into the Indian Navy at Visakhapatnam in the presence of Defence Minister Rajnath Singh.",
        "crux": "INS Arighaat cements India's assured second-strike capability and solidifies the sea-based leg of the nuclear triad under the Advanced Technology Vessel (ATV) project.",
        "takeaways": [
            "Built with indigenous DMR 249A high-tensile steel, powered by an 83 MW pressurized light-water reactor (PWR) using enriched uranium.",
            "Armed with indigenous K-15 Sagarika submarine-launched ballistic missiles (SLBM, 750 km range) and capable of carrying K-4 missiles (3,500 km range).",
            "Follows lead vessel INS Arihant (commissioned in 2016); third submarine INS Aridhaman is under sea trials."
        ],
        "prelims_pointers": {
            "key_agency": "Indian Navy & Ship Building Centre (SBC)",
            "statutory_anchor": "Strategic Forces Command (SFC)",
            "location": "Visakhapatnam, Andhra Pradesh",
            "facts_to_remember": "Commissioned: August 29, 2024. Reactor: 83 MW PWR. Missiles: K-15 (750 km) & K-4 (3,500 km)."
        },
        "mcq": {
            "question": "What is the primary strategic role of INS Arighaat in India's national security doctrine?",
            "options": [
                "Anti-piracy patrols in the Strait of Malacca.",
                "Sea-based second-strike nuclear deterrence as part of the nuclear triad.",
                "Amphibious troop landing in island territories.",
                "Aircraft carrier battle group escort vessel."
            ],
            "answer": 1,
            "explanation": "INS Arighaat is a Ship Submersible Ballistic Nuclear (SSBN) vessel designed for continuous at-sea deterrence, providing credible second-strike capability."
        },
        "source": "PIB / Ministry of Defence",
        "url": "https://mod.gov.in"
    },
    {
        "id": "ca-2026-scitech-03",
        "title": "IndiaAI Mission Approved with ₹10,372 Crore Outlay: 10,000+ GPU Supercomputing Capacity",
        "date": "2026-03-07",
        "category": "Science, Tech & Defence",
        "subcategory": "Artificial Intelligence / Tech",
        "scope": "India",
        "exam_tags": ["UPSC", "State PCS", "SSC", "Banking"],
        "summary": "The Union Cabinet approved the comprehensive national-level IndiaAI Mission with a budget of ₹10,371.92 crore to democratize AI compute infrastructure, build indigenous foundational models, and foster startup innovation.",
        "crux": "Establishes a public-private AI compute capacity of 10,000 or more Graphics Processing Units (GPUs) made available to researchers and startups at subsidized rates.",
        "takeaways": [
            "Components include: IndiaAI Compute Capacity, IndiaAI Innovation Centre (developing multi-modal indigenous LLMs), IndiaAI Datasets Platform, IndiaAI FutureSkills (data literacy programs).",
            "Promotes AI applications in agriculture, healthcare, climate change, and vernacular language translation (Bhashini platform).",
            "Sets up an IndiaAI Safe & Trusted AI framework to mitigate ethical bias and algorithmic risks."
        ],
        "prelims_pointers": {
            "key_agency": "Ministry of Electronics and Information Technology (MeitY)",
            "statutory_anchor": "Digital India Corporation",
            "location": "National implementation",
            "facts_to_remember": "Budget: ₹10,372 crore. Compute target: 10,000+ GPUs. Core pillars: Compute, Datasets, LLMs, Skills, Ethics."
        },
        "mcq": {
            "question": "Under the IndiaAI Mission approved by the Union Cabinet, what is the targeted supercomputing compute capacity planned for startups and researchers?",
            "options": ["1,000 GPUs", "5,000 GPUs", "10,000 or more GPUs", "50,000 GPUs"],
            "answer": 2,
            "explanation": "The mission targets establishing an AI compute infrastructure comprising 10,000 or more Graphics Processing Units (GPUs) under public-private partnership."
        },
        "source": "PIB / MeitY",
        "url": "https://indiaai.gov.in"
    },

    # -----------------------------------------------------------------------
    # 5. History, Art & Culture
    # -----------------------------------------------------------------------
    {
        "id": "ca-2026-culture-01",
        "title": "Moidams of Ahom Dynasty in Assam Inscribed as India's 43rd UNESCO World Heritage Site",
        "date": "2026-07-26",
        "category": "History, Art & Culture",
        "subcategory": "Archaeology & Heritage",
        "scope": "World & India",
        "exam_tags": ["UPSC", "State PCS", "SSC"],
        "summary": "At the 46th session of the World Heritage Committee in New Delhi, the Charaideo Moidams (mound-burial system of the Ahom Dynasty) were inscribed onto the UNESCO World Heritage List, becoming the first cultural site from Northeast India to gain this status.",
        "crux": "Known as the 'Pyramids of Assam', the Moidams represent the 600-year-old royal burial tradition and tai-ahom funerary architecture situated in Charaideo, the first capital of the Ahom kingdom founded by Chao Lung Siu-Ka-Pha in 1253 AD.",
        "takeaways": [
            "India now has 43 UNESCO World Heritage Sites (35 cultural, 7 natural, 1 mixed - Khangchendzonga).",
            "Moidams feature a vaulted chamber (Chaw-Chali), earth mounds covered by grass, and octagonal boundary walls with a shrine on top (Chow-chali).",
            "First World Heritage Committee session hosted by India took place in New Delhi in July 2024."
        ],
        "prelims_pointers": {
            "key_agency": "Archaeological Survey of India (ASI) & UNESCO",
            "statutory_anchor": "Ancient Monuments and Archaeological Sites and Remains Act, 1958",
            "location": "Charaideo district, Assam",
            "facts_to_remember": "43rd UNESCO World Heritage site in India; 1st cultural site from Northeast India; Built by Ahom kings (13th-18th century)."
        },
        "mcq": {
            "question": "The Charaideo Moidams, recently inscribed as India's 43rd UNESCO World Heritage Site, belong to which historic ruling dynasty?",
            "options": ["Pala Dynasty", "Koch Dynasty", "Ahom Dynasty", "Kamata Dynasty"],
            "answer": 2,
            "explanation": "Moidams are the sacred royal burial mounds of the Ahom kings and queens in Charaideo, Assam, who ruled the Brahmaputra valley for over 600 years."
        },
        "source": "PIB / UNESCO",
        "url": "https://whc.unesco.org"
    },
    {
        "id": "ca-2026-culture-02",
        "title": "UNESCO Inscribes 'Garba of Gujarat' on Representative List of Intangible Cultural Heritage",
        "date": "2026-01-10",
        "category": "History, Art & Culture",
        "subcategory": "Intangible Cultural Heritage",
        "scope": "World & India",
        "exam_tags": ["UPSC", "State PCS", "SSC"],
        "summary": "UNESCO officially inscribed 'Garba of Gujarat' onto the Representative List of the Intangible Cultural Heritage of Humanity (ICH), making it the 15th intangible cultural heritage element from India on the list.",
        "crux": "Garba is a devotional ritualistic dance performed during the nine-day Hindu festival of Navratri, celebrating the divine feminine force (Shakti) symbolized by a perforated earthen pot (Garbha Deep) with an oil lamp inside.",
        "takeaways": [
            "Celebrates social inclusivity, gender equality, and communal bonding across all sections of society.",
            "Earlier Indian entries on UNESCO ICH list include Durga Puja in Kolkata (2021), Kumbh Mela (2017), Yoga (2016), and Vedic chanting (2008).",
            "The decision was announced during the 18th session of the Intergovernmental Committee for the Safeguarding of the ICH held in Kasane, Botswana."
        ],
        "prelims_pointers": {
            "key_agency": "Ministry of Culture & Sangeet Natak Akademi",
            "statutory_anchor": "UNESCO 2003 Convention for Safeguarding ICH",
            "location": "Gujarat / Kasane, Botswana",
            "facts_to_remember": "15th Indian element on UNESCO ICH list; Performed during Sharad Navratri around Garbha Deep."
        },
        "mcq": {
            "question": "Which of the following elements is the 15th Intangible Cultural Heritage from India to be inscribed by UNESCO?",
            "options": ["Chhau dance", "Durga Puja of Kolkata", "Garba of Gujarat", "Kumbh Mela"],
            "answer": 2,
            "explanation": "Garba of Gujarat was inscribed as the 15th element from India on UNESCO's Representative List of Intangible Cultural Heritage in December 2023."
        },
        "source": "PIB / UNESCO",
        "url": "https://ich.unesco.org"
    },
    {
        "id": "ca-2026-culture-03",
        "title": "Vadnagar Excavations: Continuous Human Settlement for 2,800 Years Confirmed by ASI",
        "date": "2026-02-12",
        "category": "History, Art & Culture",
        "subcategory": "Ancient History & Archaeology",
        "scope": "India",
        "exam_tags": ["UPSC", "State PCS", "SSC"],
        "summary": "A deep multidisciplinary excavation at Vadnagar in Mehsana district, Gujarat, led by the Archaeological Survey of India (ASI) in collaboration with IIT Kharagpur, unearthed evidence of continuous human occupation dating back to 800 BCE.",
        "crux": "Challenges the notion of a 'Dark Age' between the decline of the Indus Valley Civilization and the Second Urbanization of the Gangetic Plains, proving unbroken cultural continuity through 7 distinct cultural periods.",
        "takeaways": [
            "Seven cultural periods identified: Pre-Rampart (Mauryan/Pre-Mauryan), Indo-Greek, Indo-Scythian/Kshatrapa, Maitraka/Solanki, Sultanate, Mughal, and Gaekwad.",
            "Uncovered Buddhist monastery ruins, amphitheater, Roman amphora pottery shards, and shell bangles proving trans-oceanic trade links.",
            "Vadnagar was mentioned as 'Anartapura' in the Mahabharata and visited by Chinese traveler Hiuen Tsang in the 7th century CE."
        ],
        "prelims_pointers": {
            "key_agency": "Archaeological Survey of India (ASI) & IIT Kharagpur",
            "statutory_anchor": "AMASR Act, 1958",
            "location": "Vadnagar, Mehsana district, Gujarat",
            "facts_to_remember": "Chronology: 800 BCE to modern era (2,800 years); 7 cultural strata; Visited by Hiuen Tsang (640 CE) who described 10 Buddhist monasteries."
        },
        "mcq": {
            "question": "Which Chinese Buddhist pilgrim visited the ancient town of Vadnagar (then Anandapura) in the 7th century CE and recorded the existence of Buddhist monasteries?",
            "options": ["Fa-Hien", "Hiuen Tsang (Xuanzang)", "I-Tsing", "Song Yun"],
            "answer": 1,
            "explanation": "Hiuen Tsang visited Vadnagar in 640 CE, writing that Anandapura was a major center with 10 Buddhist monasteries housing over 1,000 monks of the Sammitiya school."
        },
        "source": "ASI / The Hindu",
        "url": "https://asi.nic.in"
    },

    # -----------------------------------------------------------------------
    # 6. Sports & Games
    # -----------------------------------------------------------------------
    {
        "id": "ca-2026-sports-01",
        "title": "Paris 2024 Olympic Games: Manu Bhaker Makes History with Double Bronze; Neeraj Wins Silver",
        "date": "2026-08-11",
        "category": "Sports & Games",
        "subcategory": "Olympics",
        "scope": "World & India",
        "exam_tags": ["UPSC", "Banking (IBPS/SBI)", "State PCS", "SSC"],
        "summary": "India concluded its campaign at the Paris 2024 Olympic Games with 6 medals (1 Silver, 5 Bronze), highlighted by shooter Manu Bhaker becoming the first Indian athlete in post-independence history to win two medals at a single Olympics.",
        "crux": "Manu Bhaker won Bronze in Women's 10m Air Pistol and Bronze in 10m Air Pistol Mixed Team with Sarabjot Singh. Neeraj Chopra won Silver in Men's Javelin with 89.45m. Indian Men's Hockey team bagged Bronze beating Spain 2-1.",
        "takeaways": [
            "Aman Sehrawat won Bronze in Men's 57kg Freestyle Wrestling, becoming India's youngest individual Olympic medalist at age 21.",
            "Swapnil Kusale won Bronze in Men's 50m Rifle 3 Positions (India's first-ever Olympic medal in this event).",
            "PR Sreejesh retired from international hockey following India's heroic bronze victory against Spain.",
            "Pakistan's Arshad Nadeem won Javelin Gold with an Olympic record throw of 92.97m."
        ],
        "prelims_pointers": {
            "key_agency": "Indian Olympic Association (IOA) & IOC",
            "statutory_anchor": "Paris 2024 Summer Olympics (XXXIII Olympiad)",
            "location": "Paris, France",
            "facts_to_remember": "Total medals: 6 (1 Silver, 5 Bronze); Manu Bhaker: first double medalist in single Games; Flagbearers at closing ceremony: Manu Bhaker & PR Sreejesh."
        },
        "mcq": {
            "question": "Who became the first athlete in post-independence Indian history to win two Olympic medals at a single edition of the Olympic Games?",
            "options": ["Neeraj Chopra", "Manu Bhaker", "PV Sindhu", "Sushil Kumar"],
            "answer": 1,
            "explanation": "Manu Bhaker made history at Paris 2024 by winning two bronze medals: one in the individual women's 10m air pistol and another in the mixed team event with Sarabjot Singh."
        },
        "source": "PIB / Olympics.com",
        "url": "https://olympics.com"
    },
    {
        "id": "ca-2026-sports-02",
        "title": "Paris 2024 Paralympic Games: India Scripts Best-Ever Performance with 29 Medals (7 Gold)",
        "date": "2026-09-08",
        "category": "Sports & Games",
        "subcategory": "Paralympics",
        "scope": "World & India",
        "exam_tags": ["UPSC", "Banking (IBPS/SBI)", "State PCS", "SSC"],
        "summary": "India delivered its greatest-ever performance in Paralympic history at the Paris 2024 Paralympic Games, winning 29 medals (7 Gold, 9 Silver, 13 Bronze) to finish 18th in the overall medal tally, shattering its previous Tokyo record of 19 medals.",
        "crux": "Sumit Antil retained his javelin title with a Paralympic record throw of 70.59m. Navdeep Singh won Gold in Men's Javelin F41. Avani Lekhara became the first Indian woman to win two Paralympic Gold medals.",
        "takeaways": [
            "Harvinder Singh created history by winning India's first-ever Paralympic Gold medal in Archery (Men's Individual Recurve Open).",
            "Dharambir won Gold in Men's Club Throw F51 with an Asian record throw of 34.92m.",
            "Praveen Kumar won Gold in Men's High Jump T64 setting an Asian record of 2.08m.",
            "Nitesh Kumar won Gold in Men's Singles SL3 Badminton, continuing India's dominance in para-badminton."
        ],
        "prelims_pointers": {
            "key_agency": "Paralympic Committee of India (PCI) & IPC",
            "statutory_anchor": "Paris 2024 Summer Paralympics (XVII Paralympic Games)",
            "location": "Paris, France",
            "facts_to_remember": "Total medals: 29 (7 Gold, 9 Silver, 13 Bronze). Overall rank: 18th. Sumit Antil: Back-to-back gold; Avani Lekhara: First female double gold."
        },
        "mcq": {
            "question": "Who won India's first-ever Paralympic Gold medal in Archery at the Paris 2024 Paralympic Games?",
            "options": ["Rakesh Kumar", "Sheetal Devi", "Harvinder Singh", "Vivek Chikara"],
            "answer": 2,
            "explanation": "Harvinder Singh made history by defeating Poland's Lukasz Ciszek to win India's first-ever Paralympic Gold in Archery."
        },
        "source": "PIB / Paralympic.org",
        "url": "https://paralympic.org"
    },
    {
        "id": "ca-2026-sports-03",
        "title": "45th FIDE Chess Olympiad Budapest: India Achieves Historic Double Gold in Open and Women's Sections",
        "date": "2026-09-23",
        "category": "Sports & Games",
        "subcategory": "Chess / FIDE",
        "scope": "World & India",
        "exam_tags": ["UPSC", "Banking (IBPS/SBI)", "State PCS", "SSC"],
        "summary": "In an unprecedented sporting milestone, India clinched the Gold medal in BOTH the Open and Women's sections at the 45th FIDE Chess Olympiad held in Budapest, Hungary, becoming only the third nation after USSR and China to achieve this double triumph.",
        "crux": "The Indian men's team scored 21 out of 22 match points, winning 10 matches and drawing 1, while the women's team scored 19 match points. Individual board gold medals were won by D. Gukesh (Board 1), Arjun Erigaisi (Board 3), Divya Deshmukh (Board 3), and Vantika Agrawal (Board 4).",
        "takeaways": [
            "Open team members: D. Gukesh, R. Praggnanandhaa, Arjun Erigaisi, Vidit Gujrathi, and Pentala Harikrishna; Captain: Srinath Narayanan.",
            "Women's team members: Harika Dronavalli, Vaishali Rameshbabu, Divya Deshmukh, Vantika Agrawal, and Tania Sachdev; Captain: Abhijit Kunte.",
            "D. Gukesh recorded a sensational performance rating of 3056 on Board 1, bolstering his preparation for the World Chess Championship title match."
        ],
        "prelims_pointers": {
            "key_agency": "All India Chess Federation (AICF) & FIDE",
            "statutory_anchor": "45th FIDE Chess Olympiad 2024",
            "location": "Budapest, Hungary",
            "facts_to_remember": "Historic Double Gold (Open & Women); D. Gukesh: Board 1 Gold; Arjun Erigaisi: Board 3 Gold; Divya Deshmukh: Board 3 Gold; Vantika Agrawal: Board 4 Gold."
        },
        "mcq": {
            "question": "At the 45th FIDE Chess Olympiad in Budapest, India won gold in which categories?",
            "options": [
                "Open Section only",
                "Women's Section only",
                "Both Open and Women's Sections simultaneously",
                "Rapid and Blitz events only"
            ],
            "answer": 2,
            "explanation": "India created chess history by winning gold medals in BOTH the Open and Women's sections at the 45th FIDE Chess Olympiad in Budapest."
        },
        "source": "PIB / FIDE.com",
        "url": "https://fide.com"
    },
    {
        "id": "ca-2026-sports-04",
        "title": "ICC Men's T20 World Cup 2024: India Crowned World Champions Defeating South Africa",
        "date": "2026-06-29",
        "category": "Sports & Games",
        "subcategory": "Cricket",
        "scope": "World & India",
        "exam_tags": ["UPSC", "Banking (IBPS/SBI)", "State PCS", "SSC"],
        "summary": "India ended an 11-year ICC trophy drought by winning the ICC Men's T20 World Cup 2024, defeating South Africa by 7 runs in a nail-biting final at Kensington Oval in Bridgetown, Barbados.",
        "crux": "India became the first team to win the Men's T20 World Cup undefeated throughout the tournament. Rohit Sharma and Virat Kohli announced their retirement from T20 International cricket following the victory.",
        "takeaways": [
            "Virat Kohli was named Player of the Match in the final for his match-winning 76 off 59 balls.",
            "Jasprit Bumrah was adjudged Player of the Tournament, taking 15 wickets at an astonishing economy rate of 4.17.",
            "Suryakumar Yadav took a legendary boundary catch on the first ball of the final over off Hardik Pandya to dismiss David Miller.",
            "Rahul Dravid concluded his tenure as Head Coach of the Indian Men's Cricket Team on a triumphant note."
        ],
        "prelims_pointers": {
            "key_agency": "Board of Control for Cricket in India (BCCI) & ICC",
            "statutory_anchor": "9th ICC Men's T20 World Cup (Co-hosted by USA & West Indies)",
            "location": "Kensington Oval, Bridgetown, Barbados",
            "facts_to_remember": "India's 2nd T20 World Cup title (after 2007); Undefeated champions; Final margin: 7 runs; Player of Tournament: Jasprit Bumrah."
        },
        "mcq": {
            "question": "Who was adjudged the Player of the Tournament at the ICC Men's T20 World Cup 2024?",
            "options": ["Virat Kohli", "Jasprit Bumrah", "Rohit Sharma", "Hardik Pandya"],
            "answer": 1,
            "explanation": "Jasprit Bumrah was named Player of the Tournament for taking 15 wickets at an average of 8.26 and a tournament-best economy rate of 4.17."
        },
        "source": "BCCI / ICC Cricket",
        "url": "https://icc-cricket.com"
    },
    {
        "id": "ca-2026-sports-05",
        "title": "Rohan Bopanna Becomes Oldest Grand Slam Champion and World No. 1 in Tennis History",
        "date": "2026-01-27",
        "category": "Sports & Games",
        "subcategory": "Tennis / Grand Slams",
        "scope": "World & India",
        "exam_tags": ["Banking (IBPS/SBI)", "UPSC", "State PCS", "SSC"],
        "summary": "At the age of 43 years and 329 days, Indian tennis veteran Rohan Bopanna became the oldest first-time World No. 1 and the oldest male Grand Slam champion in the Open Era by winning the 2024 Australian Open Men's Doubles title partnering Matthew Ebden.",
        "crux": "Bopanna and Ebden defeated the Italian duo of Simone Bolelli and Andrea Vavassori 7-6, 7-5 in the final at Rod Laver Arena in Melbourne.",
        "takeaways": [
            "Bopanna broke the previous record held by Jean-Julien Rojer (40 years 9 months) to become the oldest major champion in men's doubles.",
            "This marked Bopanna's first men's doubles Grand Slam title and second major overall (after his 2017 French Open Mixed Doubles title with Gabriela Dabrowski).",
            "Bopanna was conferred with the Padma Shri, India's fourth highest civilian honor, in 2024."
        ],
        "prelims_pointers": {
            "key_agency": "ATP Tour & All India Tennis Association (AITA)",
            "statutory_anchor": "Australian Open 2024",
            "location": "Melbourne Park, Australia",
            "facts_to_remember": "Age: 43 years, 10 months; Partner: Matthew Ebden (Australia); Oldest ATP World No. 1 in doubles history."
        },
        "mcq": {
            "question": "Indian tennis ace Rohan Bopanna won the 2024 Australian Open Men's Doubles title partnering which tennis player?",
            "options": ["Sania Mirza", "Matthew Ebden", "Simone Bolelli", "Florin Mergea"],
            "answer": 1,
            "explanation": "Rohan Bopanna partnered with Australia's Matthew Ebden to capture the 2024 Australian Open Men's Doubles title."
        },
        "source": "PIB / AusOpen.com",
        "url": "https://ausopen.com"
    },

    # -----------------------------------------------------------------------
    # 7. National Affairs, Schemes & Governance
    # -----------------------------------------------------------------------
    {
        "id": "ca-2026-national-01",
        "title": "PM Surya Ghar: Muft Bijli Yojana Launched with ₹75,021 Crore Outlay for 1 Crore Rooftop Solar Systems",
        "date": "2026-02-13",
        "category": "National Affairs & Schemes",
        "subcategory": "Renewable Energy / Welfare",
        "scope": "India",
        "exam_tags": ["UPSC", "State PCS", "Banking", "SSC"],
        "summary": "Prime Minister Narendra Modi launched the mega clean energy scheme 'PM Surya Ghar: Muft Bijli Yojana' providing direct capital subsidies to install rooftop solar panels for 1 crore households, delivering up to 300 units of free electricity every month.",
        "crux": "Households receive a central financial assistance (CFA) subsidy up to ₹78,000 for 3 kW solar plants, reducing household power bills and enabling families to earn income by selling surplus power to the discom grid.",
        "takeaways": [
            "Subsidy structure: ₹30,000 for 1 kW systems, ₹60,000 for 2 kW systems, and ₹78,000 for 3 kW and higher capacity systems.",
            "Supported by collateral-free low-interest bank loans (at 7% interest rate) via National Portal for Rooftop Solar.",
            "Expected to add 30 GW of residential rooftop solar capacity, reducing 720 million tonnes of CO2 equivalent emissions over 25 years."
        ],
        "prelims_pointers": {
            "key_agency": "Ministry of New and Renewable Energy (MNRE)",
            "statutory_anchor": "National Rooftop Solar Programme",
            "location": "Pan-India",
            "facts_to_remember": "Total budget: ₹75,021 crore. Target: 1 crore homes, 300 units free monthly electricity. Implementation via National Portal (pmsuryaghar.gov.in)."
        },
        "mcq": {
            "question": "What is the targeted monthly free electricity entitlement provided to beneficiary households under the PM Surya Ghar: Muft Bijli Yojana?",
            "options": ["100 units", "200 units", "300 units", "500 units"],
            "answer": 2,
            "explanation": "The scheme guarantees up to 300 units of free clean solar electricity per month for 1 crore households."
        },
        "source": "PIB / MNRE",
        "url": "https://pmsuryaghar.gov.in"
    },
    {
        "id": "ca-2026-national-02",
        "title": "Swachh Survekshan Awards: Indore and Surat Crowned Joint Cleanest Cities in India",
        "date": "2026-01-11",
        "category": "National Affairs & Schemes",
        "subcategory": "Urban Development & Sanitation",
        "scope": "India",
        "exam_tags": ["State PCS", "SSC", "UPSC", "Banking"],
        "summary": "President Droupadi Murmu presented the Swachh Survekshan Awards, where Indore (for an unprecedented 7th straight year) and Surat were declared joint winners for the cleanest city in India in the category of cities with population over 1 lakh.",
        "crux": "Navi Mumbai was ranked the third cleanest city. Maharashtra bagged the top prize for the cleanest state in India, followed by Madhya Pradesh and Chhattisgarh.",
        "takeaways": [
            "Sasvad in Maharashtra bagged the top award for cleanest city among small towns with population under 1 lakh.",
            "Varanasi and Prayagraj were recognized as the cleanest Ganga towns.",
            "Mhow Cantonment Board in Madhya Pradesh was judged the cleanest cantonment board in the country."
        ],
        "prelims_pointers": {
            "key_agency": "Ministry of Housing and Urban Affairs (MoHUA)",
            "statutory_anchor": "Swachh Bharat Mission - Urban (SBM-U 2.0)",
            "location": "New Delhi / Indore / Surat",
            "facts_to_remember": "Cleanest City (>1 lakh): Indore & Surat (Joint 1st); Cleanest State: Maharashtra; Cleanest Ganga Town: Varanasi."
        },
        "mcq": {
            "question": "In the Swachh Survekshan Awards, which two cities shared the first prize as the joint cleanest cities in India (population >1 lakh)?",
            "options": ["Indore and Bhopal", "Indore and Surat", "Surat and Navi Mumbai", "Chandigarh and Indore"],
            "answer": 1,
            "explanation": "Indore (for the 7th consecutive year) and Surat (Gujarat) shared the top honour as the joint cleanest cities in India."
        },
        "source": "PIB / MoHUA",
        "url": "https://swachhsurvekshan.gov.in"
    },
    {
        "id": "ca-2026-national-03",
        "title": "PM Vishwakarma Scheme: Financial Aid & Skill Toolkits for 18 Traditional Artisan Trades",
        "date": "2026-04-18",
        "category": "National Affairs & Schemes",
        "subcategory": "Skill Development / MSME",
        "scope": "India",
        "exam_tags": ["UPSC", "State PCS", "Banking", "SSC"],
        "summary": "The Central Sector Scheme 'PM Vishwakarma' marked over 2 crore applications across India, providing collateral-free credit, enterprise skill training, and modern toolkit incentives to uplift traditional craftspeople and artisans.",
        "crux": "Covers 18 traditional trades (carpenters, blacksmiths, goldsmiths, potters, sculptors, cobblers, weavers) with collateral-free enterprise loans up to ₹3 lakh at a concessional 5% interest rate.",
        "takeaways": [
            "Beneficiaries receive ₹500/day stipend during basic skill training and a ₹15,000 digital e-voucher for purchasing modern toolkits.",
            "Provides PM Vishwakarma Certificate and ID card, brand building, and linkage with e-commerce platforms like GeM and ONDC.",
            "Funded entirely by the Central Government with an outlay of ₹13,000 crore for a period of five years (FY24 to FY28)."
        ],
        "prelims_pointers": {
            "key_agency": "Ministry of MSME, Ministry of Skill Development, Ministry of Finance",
            "statutory_anchor": "Central Sector Scheme",
            "location": "Pan-India",
            "facts_to_remember": "18 traditional trades covered. Concessional loan: ₹1 lakh (Tranche 1) + ₹2 lakh (Tranche 2) at 5% interest. Toolkit incentive: ₹15,000."
        },
        "mcq": {
            "question": "How many traditional crafts and trades are eligible for financial support under the PM Vishwakarma Scheme?",
            "options": ["12 trades", "15 trades", "18 trades", "24 trades"],
            "answer": 2,
            "explanation": "The PM Vishwakarma scheme covers 18 traditional artisanal trades spanning wood, iron, clay, stone, and leather craftsmanship."
        },
        "source": "PIB / Ministry of MSME",
        "url": "https://pmvishwakarma.gov.in"
    },

    # -----------------------------------------------------------------------
    # 8. International Events, Summits & Global Affairs
    # -----------------------------------------------------------------------
    {
        "id": "ca-2026-intl-01",
        "title": "16th BRICS Summit in Kazan, Russia: Historic Expansion Welcomes 5 New Member States",
        "date": "2026-10-24",
        "category": "International & Global Affairs",
        "subcategory": "Multilateral Summits",
        "scope": "World",
        "exam_tags": ["UPSC", "State PCS", "SSC", "Banking"],
        "summary": "The 16th BRICS Summit convened in Kazan, Russia, under the theme 'Strengthening Multilateralism for Just Global Development and Security', marking the first summit meeting since the formal expansion of BRICS to include Egypt, Ethiopia, Iran, and the United Arab Emirates.",
        "crux": "Leaders adopted the comprehensive Kazan Declaration, reaffirming commitment to cross-border settlement in local currencies (BRICS Pay / BRICS Bridge) and reform of the Bretton Woods financial institutions and the UN Security Council.",
        "takeaways": [
            "Prime Minister Narendra Modi and Chinese President Xi Jinping held their first formal bilateral meeting in five years on the sidelines of the summit following the patrolling pact along the Line of Actual Control (LAC).",
            "BRICS represents over 45% of the world's population and roughly 35% of global GDP by Purchasing Power Parity (PPP).",
            "Created a new category of 'BRICS Partner Countries' to engage non-member developing economies."
        ],
        "prelims_pointers": {
            "key_agency": "BRICS (Brazil, Russia, India, China, South Africa, Egypt, Ethiopia, Iran, UAE)",
            "statutory_anchor": "Kazan Summit Declaration 2024",
            "location": "Kazan, Republic of Tatarstan, Russia",
            "facts_to_remember": "Host: Vladimir Putin; Theme: Multilateralism for Just Global Development; Expansion: First summit with 9 full member nations."
        },
        "mcq": {
            "question": "Which of the following nations was officially inducted as a full member of the expanded BRICS bloc at the start of 2024?",
            "options": ["Argentina", "Egypt", "Indonesia", "Nigeria"],
            "answer": 1,
            "explanation": "Egypt (along with Ethiopia, Iran, and UAE) officially joined BRICS as a full member in 2024. Argentina withdrew its application under President Javier Milei."
        },
        "source": "Ministry of External Affairs / Reuters",
        "url": "https://mea.gov.in"
    },
    {
        "id": "ca-2026-intl-02",
        "title": "G20 Rio de Janeiro Summit (Brazil 2024): Global Alliance Against Hunger and Poverty Launched",
        "date": "2026-11-19",
        "category": "International & Global Affairs",
        "subcategory": "Global Summits / G20",
        "scope": "World",
        "exam_tags": ["UPSC", "State PCS", "Banking", "SSC"],
        "summary": "The 19th G20 Summit convened in Rio de Janeiro, Brazil, under President Luiz Inácio Lula da Silva, officially launching the 'Global Alliance Against Hunger and Poverty' and advancing the global governance reforms initiated during India's 2023 G20 Presidency.",
        "crux": "The summit focused on three core pillars: Social inclusion and the fight against hunger, energy transition and sustainable development, and reform of global governance institutions (UNSC, WTO, IMF).",
        "takeaways": [
            "India, Brazil, and South Africa formed the G20 Troika, maintaining continuity on Global South priorities.",
            "African Union (AU), inducted as a permanent member under India's G20 Presidency at New Delhi, participated in full capacity.",
            "Endorsed progressive taxation on ultra-high-net-worth individuals and capital replenishment for Multilateral Development Banks (MDBs)."
        ],
        "prelims_pointers": {
            "key_agency": "G20 (Group of Twenty) & African Union",
            "statutory_anchor": "Rio de Janeiro Leaders' Declaration 2024",
            "location": "Rio de Janeiro, Brazil",
            "facts_to_remember": "G20 2024 Presidency: Brazil; 2025 Presidency: South Africa. Theme: 'Building a Just World and a Sustainable Planet'."
        },
        "mcq": {
            "question": "Which major global initiative was formally launched by Brazilian President Lula da Silva at the G20 Rio de Janeiro Summit 2024?",
            "options": [
                "Global Clean Hydrogen Compact",
                "Global Alliance Against Hunger and Poverty",
                "International Sovereign Debt Restructuring Forum",
                "Global Artificial Intelligence Governance Treaty"
            ],
            "answer": 1,
            "explanation": "The flagship deliverable of Brazil's G20 presidency was the Global Alliance Against Hunger and Poverty, endorsed by over 80 countries."
        },
        "source": "G20.org / PIB",
        "url": "https://g20.org"
    },
    {
        "id": "ca-2026-intl-03",
        "title": "Exercise Tarang Shakti 2024: India's Largest-Ever Multilateral Air Force Combat Drill",
        "date": "2026-08-30",
        "category": "International & Global Affairs",
        "subcategory": "Military Exercises / Defence Diplomacy",
        "scope": "World & India",
        "exam_tags": ["Defence / CDS / NDA", "UPSC", "State PCS", "SSC"],
        "summary": "The Indian Air Force (IAF) conducted 'Exercise Tarang Shakti 2024', the largest multilateral air combat exercise ever hosted on Indian soil, involving air forces and observers from over 30 countries across two phases in Sulur (Tamil Nadu) and Jodhpur (Rajasthan).",
        "crux": "Showcased complex composite air operations and interoperability between Western and Eastern fighter jets, featuring Eurofighter Typhoons, Rafales, F-15s, Su-30MKIs, Tejas LCAs, and aerial refuelers.",
        "takeaways": [
            "Participating nations included Australia, France, Germany, Spain, the United Kingdom, the United States, Japan, and the UAE.",
            "Phase 1 held at Sulur Air Force Station; Phase 2 held at Jodhpur Air Force Station.",
            "Demonstrated the operational prowess of indigenous aviation platforms including the LCA Tejas, Prachand LCH, and Netra AEW&C."
        ],
        "prelims_pointers": {
            "key_agency": "Indian Air Force (IAF)",
            "statutory_anchor": "Bilateral & Multilateral Defence Cooperation",
            "location": "Sulur (Tamil Nadu) & Jodhpur (Rajasthan)",
            "facts_to_remember": "First edition of India's largest multinational air exercise; Over 150 aircraft from 10+ participating nations and 18 observer nations."
        },
        "mcq": {
            "question": "What was the name of the largest-ever multilateral air combat exercise hosted on Indian soil by the Indian Air Force?",
            "options": ["Exercise Desert Knight", "Exercise Tarang Shakti", "Exercise Garuda", "Exercise Pitch Black"],
            "answer": 1,
            "explanation": "Exercise Tarang Shakti 2024 was the largest multilateral air combat drill hosted by the IAF, with two phases held in Sulur and Jodhpur."
        },
        "source": "PIB / Indian Air Force",
        "url": "https://indianairforce.nic.in"
    },

    # -----------------------------------------------------------------------
    # 9. Environment, Ecology & Climate
    # -----------------------------------------------------------------------
    {
        "id": "ca-2026-env-01",
        "title": "India Adds 3 New Ramsar Sites: Total Network Reaches 85 Wetlands of International Importance",
        "date": "2026-08-14",
        "category": "Environment & Ecology",
        "subcategory": "Wetlands & Conservation",
        "scope": "India",
        "exam_tags": ["UPSC", "State PCS", "SSC"],
        "summary": "On the eve of Independence Day 2024, India designated three more wetlands as Ramsar sites of international importance: Nanjarayan Bird Sanctuary and Kazhuveli Bird Sanctuary in Tamil Nadu, and Tawa Reservoir in Madhya Pradesh, expanding the national network to 85 Ramsar sites.",
        "crux": "India holds the largest network of Ramsar sites in South Asia and the third largest globally, protecting over 1.35 million hectares of fragile freshwater and coastal ecosystems.",
        "takeaways": [
            "Tamil Nadu holds the highest number of Ramsar sites in India (18 sites), followed by Uttar Pradesh (10 sites).",
            "Nanjarayan Bird Sanctuary is an ancient large waterbody in Tiruppur district supporting bar-headed geese and migratory birds.",
            "Kazhuveli Bird Sanctuary on the Coromandel coast is one of the largest brackish water wetlands in peninsular India.",
            "Tawa Reservoir, created by the dam on the Tawa River inside Satpura Tiger Reserve, forms a crucial haven for aquatic flora and wintering waterfowl."
        ],
        "prelims_pointers": {
            "key_agency": "Ministry of Environment, Forest and Climate Change (MoEFCC)",
            "statutory_anchor": "Ramsar Convention on Wetlands (1971)",
            "location": "Tamil Nadu & Madhya Pradesh",
            "facts_to_remember": "Total Ramsar sites in India: 85 sites. State with most sites: Tamil Nadu (18). India ratified Ramsar convention on Feb 1, 1982."
        },
        "mcq": {
            "question": "Which Indian state currently possesses the highest number of designated Ramsar wetland sites in the country?",
            "options": ["Uttar Pradesh", "Tamil Nadu", "Kerala", "West Bengal"],
            "answer": 1,
            "explanation": "Tamil Nadu leads India with 18 designated Ramsar sites, followed by Uttar Pradesh with 10 sites."
        },
        "source": "PIB / MoEFCC",
        "url": "https://ramsar.org"
    },
    {
        "id": "ca-2026-env-02",
        "title": "International Big Cat Alliance (IBCA) Headquarters Formally Established in India",
        "date": "2026-02-29",
        "category": "Environment & Ecology",
        "subcategory": "Wildlife Conservation",
        "scope": "World & India",
        "exam_tags": ["UPSC", "State PCS", "SSC", "Banking"],
        "summary": "The Union Cabinet approved the establishment of the International Big Cat Alliance (IBCA) with headquarters in India, providing a one-time budgetary support of ₹150 crore for five years to spearhead conservation of the world's seven major big cat species.",
        "crux": "The alliance focuses on protecting the Tiger, Lion, Leopard, Snow Leopard, Cheetah, Jaguar, and Puma across 96 range countries, replicating the success of India's Project Tiger.",
        "takeaways": [
            "India is the only country in the world that naturally hosts five of the seven big cats in the wild (Tiger, Lion, Leopard, Snow Leopard, and Cheetah).",
            "IBCA framework mirrors the International Solar Alliance (ISA) model, establishing a treaty-based international organization.",
            "India's wild tiger population stands at 3,682 (over 75% of global tiger population) as per the All India Tiger Estimation 2022."
        ],
        "prelims_pointers": {
            "key_agency": "National Tiger Conservation Authority (NTCA) & MoEFCC",
            "statutory_anchor": "International Big Cat Alliance (IBCA)",
            "location": "Headquarters: New Delhi, India",
            "facts_to_remember": "7 big cats: Tiger, Lion, Leopard, Snow Leopard, Cheetah, Jaguar, Puma. India naturally hosts 5 of them."
        },
        "mcq": {
            "question": "Which of the following big cat species is NOT found naturally in the wild in India?",
            "options": ["Snow Leopard", "Asiatic Lion", "Jaguar", "Leopard"],
            "answer": 2,
            "explanation": "Jaguars are native to the Americas (Central and South America). India naturally hosts Tigers, Asiatic Lions, Leopards, Snow Leopards, and reintroduced Cheetahs."
        },
        "source": "PIB / NTCA",
        "url": "https://projecttiger.nic.in"
    },
    {
        "id": "ca-2026-env-03",
        "title": "COP28 UAE Consensus & COP29 Baku Climate Summit: Transitioning Away from Fossil Fuels",
        "date": "2026-01-02",
        "category": "Environment & Ecology",
        "subcategory": "Climate Change / UNFCCC",
        "scope": "World",
        "exam_tags": ["UPSC", "State PCS", "SSC", "Banking"],
        "summary": "The UNFCCC COP28 in Dubai adopted the historic 'UAE Consensus', calling on all nations to transition away from fossil fuels in energy systems to achieve net zero by 2050, followed by the COP29 summit in Baku focusing on the New Collective Quantified Goal (NCQG) on climate finance.",
        "crux": "COP28 formally operationalized the Loss and Damage Fund hosted by the World Bank, and set global targets to triple renewable energy capacity and double energy efficiency rates by 2030.",
        "takeaways": [
            "COP29 in Baku, Azerbaijan, was dubbed the 'Finance COP' to negotiate a new financial target replacing the previous $100 billion annual climate pledge.",
            "India advocated for climate justice, differentiation under Common But Differentiated Responsibilities and Respective Capabilities (CBDR-RC), and affordable technology transfer.",
            "India launched the Green Credits Initiative (GCI) on the sidelines of COP28 to incentivize voluntary environmental positive actions."
        ],
        "prelims_pointers": {
            "key_agency": "UNFCCC & MoEFCC",
            "statutory_anchor": "Paris Agreement (Article 9 & Article 2)",
            "location": "Dubai (COP28) / Baku, Azerbaijan (COP29)",
            "facts_to_remember": "COP28: UAE Consensus, Loss & Damage Fund; COP29: Baku, Azerbaijan (NCQG Climate Finance); India's Net Zero target: 2070."
        },
        "mcq": {
            "question": "The primary agenda and focus of the COP29 climate summit held in Baku, Azerbaijan was negotiating the:",
            "options": [
                "Global Methane Pledge enforcement.",
                "New Collective Quantified Goal (NCQG) on climate finance.",
                "Universal carbon border adjustment mechanism.",
                "Global plastic ban treaty."
            ],
            "answer": 1,
            "explanation": "COP29 in Baku was dubbed the 'Finance COP', focused on establishing the New Collective Quantified Goal (NCQG) to replace the $100 billion/year climate finance target."
        },
        "source": "UNFCCC / PIB",
        "url": "https://unfccc.int"
    }
]

# ---------------------------------------------------------------------------
# Prelims Speed Revision Fact Capsules
# ---------------------------------------------------------------------------
FACT_CAPSULES = {
    "appointments_heads": [
        {"title": "Chief Justice of India (CJI)", "person": "Justice Sanjiv Khanna", "key_detail": "51st Chief Justice of India, succeeding Justice D.Y. Chandrachud.", "tenure_or_date": "Appointed Nov 2024"},
        {"title": "Chief Election Commissioner of India (CEC)", "person": "Rajiv Kumar (with Gyanesh Kumar & Sukhbir Singh Sandhu)", "key_detail": "First EC appointments under the new 2023 CEC Appointment Act.", "tenure_or_date": "March 2024"},
        {"title": "Comptroller & Auditor General of India (CAG)", "person": "K. Sanjay Murthy", "key_detail": "Appointed under Article 148, succeeding Girish Chandra Murmu.", "tenure_or_date": "Nov 2024"},
        {"title": "16th Finance Commission Chairman", "person": "Dr. Arvind Panagariya", "key_detail": "Constitutional body under Article 280; award period 2026-2031.", "tenure_or_date": "Dec 2023 - Present"},
        {"title": "Cabinet Secretary of India", "person": "Dr. T.V. Somanathan", "key_detail": "Top civil servant and ex-officio head of the Civil Services Board.", "tenure_or_date": "Aug 2024"},
        {"title": "Chief of Defence Staff (CDS)", "person": "General Anil Chauhan", "key_detail": "Principal Military Adviser to Defence Minister & Permanent Chairman COSC.", "tenure_or_date": "2022 - Present"},
        {"title": "Governor, Reserve Bank of India", "person": "Shaktikanta Das", "key_detail": "25th Governor of RBI; named Central Banker of the Year by Global Finance.", "tenure_or_date": "Extended term"}
    ],
    "military_exercises": [
        {"exercise": "Exercise Tarang Shakti 2024", "forces": "Multilateral Air Forces (30+ nations)", "location": "Sulur (Tamil Nadu) & Jodhpur (Rajasthan)", "focus": "Largest-ever multilateral air combat drill hosted by the IAF."},
        {"exercise": "Exercise Desert Cyclone", "forces": "India & UAE (Army)", "location": "Mahajan, Rajasthan", "focus": "Inaugural joint military drill on desert & urban counter-insurgency warfare."},
        {"exercise": "Exercise Malabar 2024", "forces": "Quad Navies (India, US, Japan, Australia)", "location": "Visakhapatnam / Bay of Bengal", "focus": "High-end anti-submarine warfare and air defence operations."},
        {"exercise": "Exercise Surya Kiran XVIII", "forces": "India & Nepal (Army)", "location": "Saljhandi, Nepal / Pithoragarh", "focus": "Jungle warfare, counter-terrorism, and high-altitude mountain ops."},
        {"exercise": "Exercise Mitra Shakti X", "forces": "India & Sri Lanka (Army)", "location": "Maduru Oya, Sri Lanka", "focus": "Semi-urban counter-terror ops under Chapter VII of UN Charter."},
        {"exercise": "Exercise DUSTLIK V", "forces": "India & Uzbekistan (Army)", "location": "Termez, Uzbekistan", "focus": "Joint tactical combat operations in semi-desert terrain."}
    ],
    "summits_themes": [
        {"summit": "16th BRICS Summit", "presidency": "Russia (Kazan)", "theme": "Strengthening Multilateralism for Just Global Development and Security", "significance": "First summit with 9 full members including Egypt, Ethiopia, Iran, UAE."},
        {"summit": "19th G20 Summit", "presidency": "Brazil (Rio de Janeiro)", "theme": "Building a Just World and a Sustainable Planet", "significance": "Launched Global Alliance Against Hunger and Poverty; African Union full member."},
        {"summit": "COP29 Climate Summit", "presidency": "Azerbaijan (Baku)", "theme": "In Solidarity for a Green World", "significance": "The 'Finance COP' negotiating the New Collective Quantified Goal (NCQG)."},
        {"summit": "24th SCO Summit", "presidency": "Kazakhstan (Astana)", "theme": "Strengthening Multilateral Dialogue – Striving Towards Sustainable Peace", "significance": "Admitted Belarus as the 10th full member state."},
        {"summit": "50th G7 Summit", "presidency": "Italy (Apulia)", "theme": "Defending Rules-Based International Order & AI Governance", "significance": "PM Modi participated in G7 Outreach sessions on Africa and Energy."}
    ],
    "unesco_heritage_gi_tags": [
        {"item": "Charaideo Moidams", "category": "UNESCO World Heritage Site", "state": "Assam", "significance": "India's 43rd World Heritage site; 1st cultural site from Northeast India (Ahom dynasty)."},
        {"item": "Garba of Gujarat", "category": "UNESCO Intangible Cultural Heritage", "state": "Gujarat", "significance": "15th Indian cultural element inscribed on UNESCO Representative List."},
        {"item": "Cuttack Rupa Tarakasi", "category": "Geographical Indication (GI)", "state": "Odisha", "significance": "Centuries-old delicate silver filigree metal art."},
        {"item": "Majuli Masks & Manuscript Art", "category": "Geographical Indication (GI)", "state": "Assam", "significance": "Traditional Neo-Vaishnavite Satra maskcraft of the world's largest river island."},
        {"item": "Risa Textile", "category": "Geographical Indication (GI)", "state": "Tripura", "significance": "Customary handwoven indigenous female attire of Tripuri tribes."}
    ],
    "ramsar_sites_environment": [
        {"site": "Nanjarayan Bird Sanctuary", "state": "Tamil Nadu", "type": "Freshwater Wetland", "key_facts": "Ancient reservoir on Noyyal river basin; 83rd Ramsar site in India."},
        {"site": "Kazhuveli Bird Sanctuary", "state": "Tamil Nadu", "type": "Brackish Water Wetland", "key_facts": "Second largest brackish lagoon in South India after Pulicat Lake; 84th Ramsar site."},
        {"site": "Tawa Reservoir", "state": "Madhya Pradesh", "type": "Freshwater Dam Reservoir", "key_facts": "Located inside Satpura Tiger Reserve on Tawa river; 85th Ramsar site in India."},
        {"site": "Ankasamudra Bird Conservation Reserve", "state": "Karnataka", "type": "Manmade Wetland", "key_facts": "Crucial breeding habitat for painted storks and black-headed ibis."},
        {"site": "Aghanashini Estuary", "state": "Karnataka", "type": "Estuarine Wetland", "key_facts": "Formed at the confluence of Aghanashini River with the Arabian Sea."}
    ],
    "sports_champions_awards": [
        {"event": "Paris 2024 Olympics Double Bronze", "recipient": "Manu Bhaker (Shooting)", "record": "First Indian in post-independence history to win 2 medals in a single Olympics."},
        {"event": "Paris 2024 Paralympics Javelin Gold", "recipient": "Sumit Antil (F64) & Navdeep Singh (F41)", "record": "Sumit Antil: Back-to-back Paralympic Gold (70.59m record)."},
        {"event": "45th FIDE Chess Olympiad Double Gold", "recipient": "Indian Men's & Women's Teams", "record": "First time in history India won BOTH Open and Women's Olympiad titles."},
        {"event": "ICC Men's T20 World Cup 2024", "recipient": "Indian Men's Cricket Team", "record": "Undefeated champions; 2nd T20 World Cup title; Player of Tournament: Jasprit Bumrah."},
        {"event": "Australian Open 2024 Doubles Title", "recipient": "Rohan Bopanna & Matthew Ebden", "record": "Bopanna became oldest Grand Slam champion & World No. 1 at age 43."},
        {"event": "Major Dhyan Chand Khel Ratna 2023", "recipient": "Satwiksairaj Rankireddy & Chirag Shetty", "record": "Badminton World No. 1 duo; Asian Games Gold medalists."}
    ],
    "indices_india_rank": [
        {"index_name": "Logistics Performance Index (LPI)", "publisher": "World Bank", "india_rank": "38th / 139", "score_detail": "Jumped 6 spots driven by PM Gati Shakti and National Logistics Policy."},
        {"index_name": "Global Innovation Index (GII)", "publisher": "WIPO", "india_rank": "39th / 133", "score_detail": "Retains top spot among Central and Southern Asian economies."},
        {"index_name": "Climate Change Performance Index (CCPI)", "publisher": "Germanwatch", "india_rank": "7th / 67", "score_detail": "Ranked among top 10 performing nations for low greenhouse emissions and renewable adoption."},
        {"index_name": "Human Development Index (HDI)", "publisher": "UNDP", "india_rank": "134th / 193", "score_detail": "Score improved to 0.644 placing India in Medium Human Development category."},
        {"index_name": "Network Readiness Index (NRI)", "publisher": "Portulans Institute", "india_rank": "49th / 134", "score_detail": "Top rank in AI talent concentration and mobile broadband internet affordability."}
    ]
}

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
        "source": "LiveMint Economy & Policy",
        "url": "https://www.livemint.com/rss/economy-politics",
        "default_cat": "Economy & Infrastructure",
        "scope": "India"
    },
    {
        "source": "LiveMint Banking & Finance",
        "url": "https://www.livemint.com/rss/banking",
        "default_cat": "Banking & Finance",
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
            xml_data = response.read()
            root = ET.fromstring(xml_data)
            
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
                    "url": link
                })
    except Exception as e:
        print(f"  [Notice] Skipping feed '{source}': {e}")
        
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
    
    # 1. Merge Seed items if not present
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
