import json
import sys
import subprocess
import os
import time

sys.stdout.reconfigure(encoding='utf-8')

COURSE_PLAYLISTS = [
    {"title": "Thermodynamique", "id": "PLIlsLCejddaN3SCgLfr9s62u-GGIrL9UD"},
    {"title": "Mécanique prépa", "id": "PLIlsLCejddaNCpM6eN9TuxQOqbMgvdqVZ"},
    {"title": "Magnétostatique/théorème d'Ampère", "id": "PLIlsLCejddaNWZiwSzr2MGfMXCaKlQvs_"},
    {"title": "Ondes électromagnétiques", "id": "PLIlsLCejddaNqB_DMiPbr_uJY6VRPAqCd"},
    {"title": "électrostatique", "id": "PLIlsLCejddaNVA1gzunLShpqAHDIVGluT"},
    {"title": "Mécanique en référentiel non galiléen", "id": "PLIlsLCejddaO71GH7RdIJ28QPj8vB2n9G"},
    {"title": "Electronique prépa", "id": "PLIlsLCejddaNEY-PdoQxvtAFK8cnixSf5"},
    {"title": "Ondes acoustiques - Propagation du son", "id": "PLIlsLCejddaNNf9G9acEmukYDTFY0HSn8"},
    {"title": "Mécanique quantique", "id": "PLIlsLCejddaOwPwC6--mB5JEjuFW_bPyg"},
    {"title": "Optique ondulatoire/Interférences lumineuses MP/PC/PT", "id": "PLIlsLCejddaM4czs3fZsSIYguEFxmiGR-"},
    {"title": "Diffusion/conduction thermique", "id": "PLIlsLCejddaNfr82Op_vY6v_-Do_E27fg"},
    {"title": "Electronique numérique", "id": "PLIlsLCejddaMFV7oTq6bj6lJliYNXkyxT"},
    {"title": "Mathématiques pour la physique", "id": "PLIlsLCejddaM_oPLFkg5y7qgi5l5JHYrR"},
    {"title": "Optique géométrique théorique et pratique MPSI/PCSI", "id": "PLIlsLCejddaMDkCQQWISNnek-CJ19Yuut"},
    {"title": "Vidéos de physique pour MPSI/PCSI", "id": "PLIlsLCejddaOqheD-9xNxhtdybfNPcKES"},
    {"title": "PC/PSI Bilans en mécanique des fluides", "id": "PLIlsLCejddaOXXlu7hpM2CVZaiVUbmYMH"},
    {"title": "Dynamique des fluides newtonien. PC/PSI/Licence", "id": "PLIlsLCejddaPgxxhvuHJi-xZ7YfUlyS1Y"},
    {"title": "Statique des fluides MPSI/PCSI/MP/PC/BCPST/PT", "id": "PLIlsLCejddaMEvT9_a781NoV0IrQvRHnZ"},
    {"title": "Cinétique chimique", "id": "PLIlsLCejddaMXYjDbzD0wqwooKZ9oVsFX"},
    {"title": "Ondes mécaniques", "id": "PLIlsLCejddaPaj9hQhmtR0tdtkXBmQjxk"},
    {"title": "Electrostatique/magnétostatique prépa MP/PC/PSI/PT", "id": "PLIlsLCejddaPPOPYYrvcMYPVk0283Bq9J"},
    {"title": "PC corrigés d'épreuves de physique aux concours X/ENS/Centrale/Mines /CCP/E3A", "id": "PLIlsLCejddaP6q5XrqSFRRZc6wNX7-98Y"},
    {"title": "les corrigés X/ENS/ESPCI", "id": "PLIlsLCejddaN8VqIOK5a5L7I6QCQaND4R"},
    {"title": "TP de physique/concours CPGE", "id": "PLIlsLCejddaNZ_1qLpHggFPFIT775WW4g"},
    {"title": "Diffusion de particules", "id": "PLIlsLCejddaMJYxV6_X-pjT-F-oArJgZJ"},
    {"title": "PSI : Corrigés d'épreuves de physique aux concours X/ENS/CCP/Centrale/Mines", "id": "PLIlsLCejddaPrZiWweXk8r-7uESBk1oGm"},
    {"title": "MP : Corrigés épreuves de physiques concours X/ENS/Centrale/Mines Ponts/CCP E3A", "id": "PLIlsLCejddaP53_WbofVaqjStjUFVAekR"},
    {"title": "Corrigés concours CCP", "id": "PLIlsLCejddaNo22GEgcXFgh7VoafQuE9I"},
    {"title": "corrigés de Centrale Supélec", "id": "PLIlsLCejddaOWvZ_JEZPKjfGBx-EG4CyR"},
    {"title": "Induction électromagnétique MPSI/PCSI", "id": "PLIlsLCejddaMTm6No50AEU_QxX5A4BaqR"},
    {"title": "physique statistique", "id": "PLIlsLCejddaPWj3z2KdvOoBmrq47J_klW"},
    {"title": "Modèle de Lewis de la liaison covalente", "id": "PLIlsLCejddaO1UiD723JV4kkwxbNKN5Ex"},
    {"title": "Puissance en régime sinusoïdal", "id": "PLIlsLCejddaMPSktEj8cYPs0frv5WyZDO"},
    {"title": "résolution de problème en physique/chimie", "id": "PLIlsLCejddaNGC0GSnTsLMd_DQvNHNtEi"},
    {"title": "Thermochimie", "id": "PLIlsLCejddaNM8oTSZN9X_dSnokcwHztu"},
    {"title": "Physique avec Python", "id": "PLIlsLCejddaPsFakCwZRa6nxH4sxPMPf0"},
    {"title": "Exercices oral centrale/mines/CCP/X", "id": "PLIlsLCejddaOdDg5EayFuOWiZYtQdde8I"},
    {"title": "Expérience de Stern et Gerlach", "id": "PLIlsLCejddaOdGtg91woxtoS-NCDuNuAy"},
    {"title": "réussir en prépa", "id": "PLIlsLCejddaPlV5qXIAqNSBCbLA5lh0BV"}
]

all_playlists = {c['id']: c['title'] for c in COURSE_PLAYLISTS}
print(f"Total playlists to inspect: {len(all_playlists)}")

cache_file = "scratch_playlists_dump.json"
cached_data = {}
if os.path.exists(cache_file):
    try:
        with open(cache_file, 'r', encoding='utf-8') as cf:
            cached_data = json.load(cf)
        print(f"Loaded {len(cached_data)} playlists from cache.")
    except Exception as e:
        print(f"Cache load error: {e}")

for pid, ptitle in all_playlists.items():
    if pid in cached_data and len(cached_data[pid].get('entries', [])) > 0:
        print(f"Playlist [{ptitle}] already cached ({len(cached_data[pid]['entries'])} vids)")
        continue

    print(f"Fetching playlist: {ptitle} ({pid})...")
    url = f"https://www.youtube.com/playlist?list={pid}"
    try:
        cmd = ["python", "-m", "yt_dlp", "--flat-playlist", "-J", url]
        res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
        if res.returncode == 0 and res.stdout.strip():
            pdata = json.loads(res.stdout)
            cached_data[pid] = {
                "id": pid,
                "title": ptitle,
                "entries": pdata.get('entries', [])
            }
            print(f" -> Found {len(pdata.get('entries', []))} videos")
            with open(cache_file, 'w', encoding='utf-8') as cf:
                json.dump(cached_data, cf, ensure_ascii=False, indent=2)
        else:
            print(f" -> Error or empty: {res.stderr[:200]}")
    except Exception as err:
        print(f" -> Exception: {err}")
    time.sleep(0.3)

print("Harvest completed! Total cached playlists:", len(cached_data))
