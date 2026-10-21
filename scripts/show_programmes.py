import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch_programmes_analysis.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for fname, d in data.items():
    print(f"\n==========================================")
    print(f"FILE: {fname}")
    print(f"==========================================")
    for h in d['detected_headings']:
        print(f"  • {h}")
