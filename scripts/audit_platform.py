import json
import re

# Load elearningPhysiqueVideos.json
with open('src/data/elearningPhysiqueVideos.json', 'r', encoding='utf-8') as f:
    videos = json.load(f)

print(f"Total videos in elearningPhysiqueVideos.json: {len(videos)}")

# Load pcCoursesData.ts
with open('src/components/eddams/pcCoursesData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Parse modules and chapters
# Each module has id, niveau, titre, icon, description, chapitres
# Each chapitre has id, num, niveau, titre, badge, moduleName, description, cours, fiches, tds

module_pattern = re.compile(
    r'\{\s*id:\s*"(?P<mod_id>[^"]+)",\s*niveau:\s*"(?P<mod_niveau>[^"]+)",\s*titre:\s*"(?P<mod_titre>[^"]+)"',
    re.MULTILINE
)

modules = []
for match in module_pattern.finditer(content):
    modules.append({
        'id': match.group('mod_id'),
        'niveau': match.group('mod_niveau'),
        'titre': match.group('mod_titre')
    })

print(f"\nFound {len(modules)} modules in pcCoursesData.ts:")
for m in modules:
    print(f"  - [{m['niveau']}] {m['id']}: {m['titre']}")

# Parse chapitres
chapitre_pattern = re.compile(
    r'id:\s*"(?P<chap_id>[^"]+)",\s*num:\s*(?P<num>\d+),\s*niveau:\s*"(?P<chap_niveau>[^"]+)",\s*titre:\s*"(?P<chap_titre>[^"]+)"',
    re.MULTILINE
)

chapitres = []
for match in chapitre_pattern.finditer(content):
    chapitres.append({
        'id': match.group('chap_id'),
        'num': int(match.group('num')),
        'niveau': match.group('chap_niveau'),
        'titre': match.group('chap_titre')
    })

print(f"\nFound {len(chapitres)} chapitres in pcCoursesData.ts:")
for c in chapitres:
    print(f"  - [{c['niveau']}] {c['id']} (ch.{c['num']}): {c['titre']}")

