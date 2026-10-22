import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/elearningPhysiqueVideos.json', 'r', encoding='utf-8') as f:
    vids = json.load(f)

print("=== THERMO VIDEOS ===")
thermo_vids = [v for v in vids if v['moduleId'] == 'thermo']
for v in thermo_vids:
    print(f"[{v['niveau']}] [{v['chapitre']}] [{','.join(v['filieres'])}] {v['title']}")

print("\n=== MECA VIDEOS ===")
meca_vids = [v for v in vids if v['moduleId'] == 'meca']
for v in meca_vids:
    print(f"[{v['niveau']}] [{v['chapitre']}] [{','.join(v['filieres'])}] {v['title']}")

print("\n=== FLUIDES VIDEOS ===")
fluides_vids = [v for v in vids if v['moduleId'] == 'fluides']
for v in fluides_vids:
    print(f"[{v['niveau']}] [{v['chapitre']}] [{','.join(v['filieres'])}] {v['title']}")

print("\n=== QUANTIQUE VIDEOS ===")
q_vids = [v for v in vids if v['moduleId'] == 'quantique']
for v in q_vids:
    print(f"[{v['niveau']}] [{v['chapitre']}] [{','.join(v['filieres'])}] {v['title']}")
