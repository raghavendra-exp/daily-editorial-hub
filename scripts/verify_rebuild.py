import sys
import os
import json
from collections import Counter

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ca_path = os.path.join(project_root, 'data', 'current_affairs.json')

with open(ca_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

items = data.get('items', [])
print(f"Total items in current_affairs.json: {len(items)}")
print(f"Last updated: {data.get('last_updated')}")

dates = [it['date'] for it in items]
min_date = min(dates)
max_date = max(dates)
print(f"Earliest date: {min_date}")
print(f"Latest date:   {max_date}")

# Year breakdown
year_counts = Counter([d[:4] for d in dates])
print("\n--- Year Distribution ---")
for y, c in sorted(year_counts.items()):
    print(f"  Year {y}: {c} items")

# Monthly breakdown
month_counts = Counter([d[:7] for d in dates])
print("\n--- Monthly Distribution ---")
for m, c in sorted(month_counts.items()):
    print(f"  {m}: {c} items")

# Violations checks
future_items = [it for it in items if it['date'] > '2026-10-13']
old_2024_items = [it for it in items if it['date'].startswith('2024')]
pre_1year_items = [it for it in items if it['date'] < '2025-10-13']

print("\n--- Strict Verification Checks ---")
print(f"Items with future dates (> 2026-10-13): {len(future_items)}")
print(f"Items with 2024 dates:                 {len(old_2024_items)}")
print(f"Items older than 1 year (< 2025-10-13): {len(pre_1year_items)}")

# Vault verification
vault_items = [it for it in items if it.get('is_vault') or it.get('id', '').startswith('ca-vault-')]
print(f"\nVault items count: {len(vault_items)}")

# Sources breakdown
source_counts = Counter([it.get('source', 'Unknown') for it in items])
print("\n--- Source Breakdown ---")
for s, c in source_counts.most_common():
    print(f"  {s}: {c}")

# Categories breakdown
cat_counts = Counter([it.get('category', 'Unknown') for it in items])
print("\n--- Category Breakdown ---")
for cat, c in sorted(cat_counts.items()):
    print(f"  {cat}: {c}")

assert len(future_items) == 0, f"FAIL: Found {len(future_items)} future items!"
assert len(old_2024_items) == 0, f"FAIL: Found {len(old_2024_items)} 2024 items!"
assert len(pre_1year_items) == 0, f"FAIL: Found {len(pre_1year_items)} items older than 1 year!"
assert len(vault_items) == 74, f"FAIL: Expected 74 vault items, found {len(vault_items)}"

print("\n>>> ALL CHECKS PASSED PERFECTLY! ZERO 2024 DATES, ZERO FUTURE DATES! <<<")
