import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

# Load playlists dump
with open('scratch_playlists_dump.json', 'r', encoding='utf-8') as f:
    playlists_dump = json.load(f)

# Load channel videos
vids = []
for enc in ['utf-16', 'utf-8']:
    try:
        with open('scratch_videos.json', 'r', encoding=enc) as f:
            vids = json.load(f).get('entries', [])
            break
    except Exception:
        pass

# Collect all unique videos
all_videos = {}

# First, from playlists
for pid, pdata in playlists_dump.items():
    ptitle = pdata.get('title', '')
    for e in pdata.get('entries', []):
        vid_id = e.get('id')
        title_raw = e.get('title') or ''
        if not vid_id or not title_raw.strip() or title_raw == '[Private video]' or title_raw == '[Deleted video]':
            continue
        if vid_id not in all_videos:
            all_videos[vid_id] = {
                "id": vid_id,
                "title": title_raw.strip(),
                "duration": e.get('duration') or 0,
                "playlists": [ptitle],
            }
        else:
            if ptitle not in all_videos[vid_id]["playlists"]:
                all_videos[vid_id]["playlists"].append(ptitle)

# Second, from channel videos (covers standalone)
for v in vids:
    vid_id = v.get('id')
    title_raw = v.get('title') or ''
    if not vid_id or not title_raw.strip() or title_raw == '[Private video]' or title_raw == '[Deleted video]':
        continue
    if vid_id not in all_videos:
        all_videos[vid_id] = {
            "id": vid_id,
            "title": title_raw.strip(),
            "duration": v.get('duration') or 0,
            "playlists": [],
        }
    else:
        # update duration if 0
        if not all_videos[vid_id]["duration"] and v.get('duration'):
            all_videos[vid_id]["duration"] = v.get('duration')

print(f"Total valid unique videos collected: {len(all_videos)}")

# Classification rules based on official CPGE syllabus
def classify_video(v):
    title = v['title']
    playlists = v['playlists']
    p_str = " ".join(playlists).lower()
    combined = (title + " " + p_str).lower()

    # Default values
    domaine = "Physique Générale"
    module_id = "general"
    chapitre = "Généralités"
    niveau = "spe"
    filieres = ["MP", "PSI", "PC", "TSI"]
    is_common = True
    concours = None

    # 1. CONCOURS & CORRIGÉS D'ÉPREUVES
    if "concours" in combined or "corrigé" in combined or "corriges" in combined or "épreuve" in combined or "epreuve" in combined or "answer key" in combined or "oral" in combined:
        domaine = "Annales & Corrigés de Concours"
        module_id = "concours"
        niveau = "spe"
        
        # Concours school
        if "x/ens" in combined or "x-ens" in combined or "espci" in combined or "polytechnique" in combined:
            concours = "X-ENS"
        elif "mines" in combined:
            concours = "Mines-Ponts"
        elif "centrale" in combined or "supélec" in combined:
            concours = "Centrale-Supélec"
        elif "ccp" in combined or "ccinp" in combined:
            concours = "CCINP / CCP"
        elif "e3a" in combined:
            concours = "E3A"
        elif "tp" in combined:
            concours = "TP Concours"
        else:
            concours = "Concours CPGE"

        chapitre = f"Corrigés {concours}"

        # Filière for concours
        if "psi" in combined and "mp" not in combined and "pc" not in combined:
            filieres = ["PSI"]
            is_common = False
        elif "mp" in combined and "psi" not in combined and "pc" not in combined:
            filieres = ["MP"]
            is_common = False
        elif "pc" in combined and "mp" not in combined and "psi" not in combined:
            filieres = ["PC"]
            is_common = False
        elif "mp/pc/psi" in combined or "mp/pc" in combined or "pc/psi" in combined or "mp/psi" in combined:
            filieres = ["MP", "PSI", "PC"]
            is_common = True
        else:
            # Common to all Spé concours
            filieres = ["MP", "PSI", "PC", "TSI"]
            is_common = True

        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 2. TP & FORMATION EXPÉRIMENTALE
    if "tp" in combined or "tp de physique" in combined or "goniomètre" in combined or "focométrie" in combined:
        domaine = "Travaux Pratiques & Épreuves Orales"
        module_id = "tp"
        chapitre = "TP & Formation Expérimentale"
        niveau = "spe"
        filieres = ["MP", "PSI", "PC", "TSI"]
        is_common = True
        concours = "TP Concours"
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 3. PHYSIQUE QUANTIQUE (Exclusif MP & PC, ABSENT en PSI)
    if "quantique" in combined or "schrödinger" in combined or "schrodinger" in combined or "puits" in combined or "stern" in combined or "effet tunnel" in combined or "dualité" in combined:
        domaine = "Physique Quantique"
        module_id = "quantique"
        chapitre = "Mécanique Quantique & Effet Tunnel"
        niveau = "spe"
        filieres = ["MP", "PC"]
        is_common = False
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 4. STATISTIQUE & BOLTZMANN (Exclusif MP & PC, ABSENT en PSI)
    if "physique statistique" in combined or "statistique" in combined or "boltzmann" in combined:
        domaine = "Thermodynamique"
        module_id = "thermo"
        chapitre = "Thermodynamique Statistique & Facteur de Boltzmann"
        niveau = "spe"
        filieres = ["MP", "PC"]
        is_common = False
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 5. MÉCANIQUE DES FLUIDES (Écoulements visqueux / Poiseuille / Reynolds / Navier-Stokes / Bilans)
    # Requis en PSI et PC, ABSENT en MP (sauf Statique des fluides qui est commune)
    if "fluide" in combined or "poiseuille" in combined or "bernoulli" in combined or "reynolds" in combined or "viscosité" in combined or "visqueux" in combined or "traînée" in combined or "portance" in combined or "couche limite" in combined or "venturi" in combined:
        domaine = "Mécanique des Fluides"
        module_id = "fluides"
        if "statique des fluides" in combined or "statique" in combined:
            chapitre = "Statique des Fluides (MPSI / PCSI / Spé)"
            niveau = "sup"
            filieres = ["MP", "PSI", "PC", "TSI"]
            is_common = True
        else:
            chapitre = "Dynamique des Fluides & Bilans (PSI / PC)"
            niveau = "spe"
            filieres = ["PSI", "PC", "TSI"]
            is_common = False
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 6. MACHINES TOURNANTES, PUISSANCE & CONVERSION ÉLECTROMÉCANIQUE
    # Requis en PSI et TSI, hors MP
    if "synchrone" in combined or "asynchrone" in combined or "machine" in combined or "ferromagnétique" in combined or "hystérésis" in combined or "transformateur" in combined or "électroaimant" in combined:
        domaine = "Électromagnétisme & Conversion"
        module_id = "em"
        chapitre = "Conversion Électromécanique & Matériaux Magnétiques"
        niveau = "spe"
        filieres = ["PSI", "TSI", "PC"]
        is_common = False
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 7. ÉLECTROMAGNÉTISME & INDUCTION (Tronc Commun MP / PSI / PC / TSI)
    if "électromagnétisme" in combined or "electromagnetisme" in combined or "maxwell" in combined or "magnétostatique" in combined or "ampère" in combined or "ampere" in combined or "électrostatique" in combined or "electrostatique" in combined or "induction" in combined or "faraday" in combined or "laplace" in combined or "dipôle" in combined or "poynting" in combined:
        domaine = "Électromagnétisme"
        module_id = "em"
        if "induction" in combined or "faraday" in combined:
            chapitre = "Induction Électromagnétique & Forces de Laplace"
            niveau = "sup" if ("mpsi" in combined or "pcsi" in combined) else "spe"
        elif "magnétostatique" in combined or "ampère" in combined:
            chapitre = "Magnétostatique dans le vide & Théorème d'Ampère"
            niveau = "sup" if ("mpsi" in combined or "pcsi" in combined) else "spe"
        elif "électrostatique" in combined:
            chapitre = "Électrostatique dans le vide & Théorème de Gauss"
            niveau = "sup" if ("mpsi" in combined or "pcsi" in combined) else "spe"
        else:
            chapitre = "Équations de Maxwell & Énergie Électromagnétique"
            niveau = "spe"
        filieres = ["MP", "PSI", "PC", "TSI"]
        is_common = True
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 8. ONDES ÉLECTROMAGNÉTIQUES & ACOUSTIQUES (Tronc Commun MP / PSI / PC / TSI)
    if "onde" in combined or "ondes" in combined or "acoustique" in combined or "son" in combined or "corde" in combined or "d'alembert" in combined or "dispersion" in combined:
        domaine = "Physique des Ondes"
        module_id = "ondes"
        if "électromagnétique" in combined:
            chapitre = "Propagation des Ondes Électromagnétiques dans le Vide"
            niveau = "spe"
        elif "acoustique" in combined or "son" in combined:
            chapitre = "Ondes Acoustiques & Propagation Sonore dans les Fluides"
            niveau = "spe"
        elif "corde" in combined or "mécanique" in combined:
            chapitre = "Ondes Mécaniques & Cordes Vibrantes"
            niveau = "sup"
        else:
            chapitre = "Physique des Ondes & Phénomènes de Propagation"
            niveau = "spe"
        filieres = ["MP", "PSI", "PC", "TSI"]
        is_common = True
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 9. OPTIQUE GÉOMÉTRIQUE & ONDULATOIRE (Tronc Commun MP / PSI / PC / TSI)
    if "optique" in combined or "interférence" in combined or "interferences" in combined or "diffraction" in combined or "michelson" in combined or "young" in combined or "réseau" in combined or "polarisation" in combined or "laser" in combined:
        domaine = "Optique"
        module_id = "optique"
        if "géométrique" in combined or "miroir" in combined or "lentille" in combined:
            chapitre = "Optique Géométrique & Instruments d'Optique"
            niveau = "sup"
            filieres = ["MP", "PSI", "PC", "TSI"]
            is_common = True
        elif "polarisation" in combined or "laser" in combined or "fourier" in combined:
            chapitre = "Polarisation de la Lumière & Optique de Fourier"
            niveau = "spe"
            filieres = ["MP", "PSI", "PC"]
            is_common = True
        else:
            chapitre = "Optique Ondulatoire, Interférences & Réseaux"
            niveau = "spe"
            filieres = ["MP", "PSI", "PC", "TSI"]
            is_common = True
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 10. THERMODYNAMIQUE & CONDUCTION THERMIQUE (Tronc Commun MP / PSI / PC / TSI)
    if "thermo" in combined or "thermodynamique" in combined or "chaleur" in combined or "conduction" in combined or "diffusion" in combined or "fourier" in combined or "entropie" in combined or "premier principe" in combined or "second principe" in combined or "gaz" in combined or "cycle" in combined:
        domaine = "Thermodynamique"
        module_id = "thermo"
        if "conduction" in combined or "diffusion" in combined or "ailette" in combined:
            chapitre = "Transferts Thermiques & Conduction (Loi de Fourier)"
            niveau = "spe"
        else:
            chapitre = "Thermodynamique Phénoménologique & Principes"
            niveau = "sup" if ("mpsi" in combined or "pcsi" in combined or "gaz" in combined) else "spe"
        filieres = ["MP", "PSI", "PC", "TSI"]
        is_common = True
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 11. ÉLECTRONIQUE & TRAITEMENT DU SIGNAL (Tronc Commun MP / PSI / PC / TSI)
    if "électronique" in combined or "electronique" in combined or "signal" in combined or "filtre" in combined or "circuit" in combined or "diode" in combined or "arqs" in combined or "oscillateur" in combined or "bode" in combined:
        domaine = "Électronique"
        module_id = "elec"
        if "numérique" in combined or "échantillonnage" in combined or "echantillonnage" in combined or "can" in combined:
            chapitre = "Électronique Numérique & Échantillonnage"
            niveau = "spe"
        elif "oscillateur" in combined or "stabilité" in combined:
            chapitre = "Oscillateurs & Systèmes Linéaires Asservis"
            niveau = "spe"
        else:
            chapitre = "Électrocinétique & Filtrage Linéaire"
            niveau = "sup"
        filieres = ["MP", "PSI", "PC", "TSI"]
        is_common = True
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 12. MÉCANIQUE DU POINT & DU SOLIDE (Tronc Commun MP / PSI / PC / TSI)
    if "mécanique" in combined or "mecanique" in combined or "solide" in combined or "référentiel" in combined or "galiléen" in combined or "newton" in combined or "kepler" in combined or "pendule" in combined or "moment" in combined:
        domaine = "Mécanique"
        module_id = "meca"
        if "solide" in combined or "koenig" in combined:
            chapitre = "Mécanique du Solide Indéformable"
            niveau = "spe"
        elif "non galiléen" in combined:
            chapitre = "Mécanique en Référentiel Non Galiléen"
            niveau = "sup"
        else:
            chapitre = "Cinématique & Dynamique du Point Matériel"
            niveau = "sup"
        filieres = ["MP", "PSI", "PC", "TSI"]
        is_common = True
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 13. CHIMIE CPGE
    if "chimie" in combined or "cinétique" in combined or "lewis" in combined or "thermochimie" in combined or "liaison" in combined:
        domaine = "Chimie"
        module_id = "chimie"
        chapitre = "Chimie Physique, Cinétique & Liaisons Chimiques"
        niveau = "sup"
        filieres = ["PC", "PCSI", "MPSI"]
        is_common = False
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 14. OUTILS MATHÉMATIQUES & PYTHON
    if "math" in combined or "python" in combined or "réussir en prépa" in combined or "méthode" in combined:
        domaine = "Outils Mathématiques, Python & Méthodologie"
        module_id = "methodes"
        chapitre = "Outils Numériques & Méthodologie CPGE"
        niveau = "sup"
        filieres = ["MP", "PSI", "PC", "TSI"]
        is_common = True
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    return domaine, module_id, chapitre, niveau, filieres, is_common, concours

# Test classification on all videos
domaine_counts = {}
filiere_counts = {"MP": 0, "PSI": 0, "PC": 0, "TSI": 0}
common_count = 0

for vid_id, v in all_videos.items():
    dom, mid, chap, niv, fils, is_c, conc = classify_video(v)
    for fil in fils:
        if fil in filiere_counts:
            filiere_counts[fil] += 1
    if is_c:
        common_count += 1
    domaine_counts[dom] = domaine_counts.get(dom, 0) + 1

print("\n--- Domaine breakdown ---")
for d, cnt in sorted(domaine_counts.items(), key=lambda x: -x[1]):
    print(f"  {d:45s}: {cnt:3d} vidéos")

print("\n--- Filière availability breakdown ---")
for f, cnt in filiere_counts.items():
    print(f"  Si un étudiant clique sur [{f:3s}] -> {cnt:3d} vidéos s'affichent !")
print(f"  Total vidéos en Tronc Commun (MP / PSI / PC partagés): {common_count}")
