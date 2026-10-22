import json
from collections import Counter, defaultdict

with open('src/data/elearningPhysiqueVideos.json', 'r', encoding='utf-8') as f:
    videos = json.load(f)

print(f"Total videos: {len(videos)}")

# Module breakdown
module_counter = Counter(v.get('moduleId') for v in videos)
print("\n=== REPARTITION PAR MODULE ===")
for mod, count in module_counter.most_common():
    print(f"  - {mod}: {count} vidéos")

# Domaine breakdown
domaine_counter = Counter(v.get('domaine') for v in videos)
print("\n=== REPARTITION PAR DOMAINE ===")
for dom, count in domaine_counter.most_common():
    print(f"  - {dom}: {count} vidéos")

# Niveau breakdown
niveau_counter = Counter(v.get('niveau') for v in videos)
print("\n=== REPARTITION PAR NIVEAU ===")
for niv, count in niveau_counter.items():
    print(f"  - {niv}: {count} vidéos")

# Filiere breakdown
filiere_counter = Counter(f for v in videos for f in v.get('filieres', []))
print("\n=== REPARTITION PAR FILIERE ===")
for fil, count in filiere_counter.items():
    print(f"  - {fil}: {count} vidéos")

# isCommon
common_counter = Counter(v.get('isCommon') for v in videos)
print("\n=== TRONC COMMUN (isCommon) ===")
for com, count in common_counter.items():
    print(f"  - isCommon={com}: {count} vidéos")

# Concours videos analysis
concours_vids = [v for v in videos if v.get('moduleId') == 'concours']
print(f"\n=== CONCOURS: {len(concours_vids)} vidéos ===")
concours_tags = Counter(v.get('concoursTag') for v in concours_vids)
for tag, count in concours_tags.most_common():
    print(f"  - Tag '{tag}': {count} vidéos")

# Methodes videos analysis
methodes_vids = [v for v in videos if v.get('moduleId') == 'methodes']
print(f"\n=== METHODES: {len(methodes_vids)} vidéos ===")
methodes_chaps = Counter(v.get('chapitre') for v in methodes_vids)
for chap, count in methodes_chaps.most_common():
    print(f"  - Chapitre '{chap}': {count} vidéos")

# For each theoretical module, show chapitres
theo_modules = ['meca', 'em', 'thermo', 'elec', 'optique', 'ondes', 'fluides', 'quantique', 'chimie']
print("\n=== MODULES THEORIQUES & LEURS CHAPITRES ===")
for m in theo_modules:
    mVids = [v for v in videos if v.get('moduleId') == m]
    print(f"\n-> Module: {m} ({len(mVids)} vidéos)")
    chaps = Counter(v.get('chapitre') for v in mVids)
    for c, cnt in chaps.most_common():
        print(f"     * [{cnt} vids] {c}")
