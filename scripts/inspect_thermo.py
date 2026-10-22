import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/elearningPhysiqueVideos.json', 'r', encoding='utf-8') as f:
    vids = json.load(f)

for v in vids:
    if v['moduleId'] == 'thermo':
        print(f"[{v['niveau']}] {v['id']} | {v['chapitre']} | {v['title']}")
