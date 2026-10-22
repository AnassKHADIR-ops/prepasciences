import json
import re

with open('src/data/elearningPhysiqueVideos.json', 'r', encoding='utf-8') as f:
    videos = json.load(f)

# Chapters from pcCoursesData.ts
with open('src/components/eddams/pcCoursesData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

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

print(f"Testing matching for {len(chapitres)} chapters against {len(videos)} videos:")

def get_matching_videos(chap, filiere="ALL"):
    chap_id = chap['id']
    chap_num = chap['num']
    chap_niveau = chap['niveau']
    chap_titre = chap['titre'].lower()
    
    matches = []
    
    for v in videos:
        # Filiere check
        if filiere != "ALL" and filiere not in v.get('filieres', []):
            continue
            
        v_title = v.get('title', '').lower()
        v_chap = v.get('chapitre', '').lower()
        v_mod = v.get('moduleId', '')
        v_niv = v.get('niveau', '')
        v_dom = v.get('domaine', '').lower()
        v_playlists = " ".join(v.get('playlists', [])).lower()
        combined = f"{v_title} {v_chap} {v_playlists} {v_dom}"
        
        # 1. THEORETICAL MATCHING
        matched = False
        
        # Niveau check for theoretical courses (methodes and concours can be cross-level)
        if v_mod not in ['concours', 'methodes']:
            if chap_niveau and v_niv != 'tous' and v_niv != chap_niveau:
                continue
                
        # Module-specific matching
        if 'elec-sup' in chap_id:
            if v_mod == 'elec' and v_niv == 'sup':
                if chap_num == 1 and any(k in combined for k in ['arqs', 'kirchhoff', 'nœud', 'noeud', 'maille', 'base', 'courant']):
                    matched = True
                elif chap_num == 2 and any(k in combined for k in ['thévenin', 'thevenin', 'norton', 'millman', 'diviseur', 'pont']):
                    matched = True
                elif chap_num == 3 and any(k in combined for k in ['transitoire', 'rc', 'rl', 'rlc', 'ordre']):
                    matched = True
                elif chap_num == 4 and any(k in combined for k in ['rsf', 'sinusoïdal', 'sinusoidal', 'résonance', 'resonance', 'impédance', 'impedance']):
                    matched = True
                elif chap_num == 5 and any(k in combined for k in ['bode', 'filtre', 'filtrage', 'passante', 'coupure', 'passe']):
                    matched = True
                elif chap_num == 6 and any(k in combined for k in ['aop', 'ali', 'amplificateur', 'opérationnel', 'operationnel', 'comparateur']):
                    matched = True
                elif not matched and chap_num in [1, 2, 4]:
                    # General electrics
                    if any(k in combined for k in ['puissance', 'dipôle', 'dipole', 'thévenin']):
                        matched = True
                        
        elif 'elec-spe' in chap_id:
            if v_mod == 'elec':
                if chap_num == 1 and any(k in combined for k in ['harmonique', 'spectre', 'spectrale', 'fourier', 'filtrage']):
                    matched = True
                elif chap_num == 2 and any(k in combined for k in ['numérique', 'numerique', 'échantillonnage', 'echantillonnage', 'shannon', 'can', 'cna', 'modulation']):
                    matched = True
                    
        elif 'thermo-sup' in chap_id:
            if v_mod == 'thermo' or (v_mod == 'fluides' and 'statique' in combined):
                if chap_num == 1 and any(k in combined for k in ['équilibre', 'equilibre', 'cinétique', 'cinetique', 'gaz parfait', 'gaz réel', 'état', 'introduction']):
                    matched = True
                elif chap_num == 2 and (('statique' in combined and 'fluide' in combined) or any(k in combined for k in ['pression', 'archimède', 'archimede', 'barométrique', 'océan', 'barometre'])):
                    matched = True
                elif chap_num == 3 and any(k in combined for k in ['premier principe', '1er principe', 'travail', 'chaleur', 'enthalpie', 'énergie interne']):
                    matched = True
                elif chap_num == 4 and any(k in combined for k in ['second principe', '2ème principe', '2nd principe', 'entropie']):
                    matched = True
                elif chap_num == 5 and any(k in combined for k in ['machine', 'carnot', 'cycle', 'moteur', 'frigo', 'pompe', 'rendement']):
                    matched = True
                elif chap_num == 6 and any(k in combined for k in ['phase', 'corps pur', 'clapeyron', 'saturation', 'vapeur', 'liquéfaction']):
                    matched = True
                    
        elif 'thermo-spe' in chap_id:
            if v_mod == 'thermo':
                if any(k in combined for k in ['diffusion', 'conduction', 'fourier', 'thermique', 'résistance', 'resistance', 'ailette', 'chaleur']):
                    matched = True
                    
        elif 'meca-sup' in chap_id:
            if v_mod == 'meca':
                if chap_num == 1 and any(k in combined for k in ['cinématique', 'cinematique', 'polaire', 'cylindrique', 'sphérique', 'frenet', 'vitesse', 'accélération', 'coordonnées']):
                    matched = True
                elif chap_num == 2 and any(k in combined for k in ['dynamique', 'newton', 'pfd', 'frottement', 'projection', 'coulomb', 'résume tout', 'important']):
                    matched = True
                elif chap_num == 3 and any(k in combined for k in ['potentielle', 'mécanique', 'mecanique', 'énergétique', 'energetique', 'travail', 'puissance', 'pendule']):
                    matched = True
                elif chap_num == 4 and any(k in combined for k in ['moment cinétique', 'moment cinetique', 'bras de levier', 'moment d']):
                    matched = True
                elif chap_num == 5 and any(k in combined for k in ['centrale', 'kepler', 'binet', 'potentielle effective', 'potentielle efficace', 'gravitation']):
                    matched = True
                elif chap_num == 6 and any(k in combined for k in ['non galiléen', 'non galileen', 'coriolis', 'inertie', 'marée', 'foucault', 'référentiel']):
                    matched = True
                    
        elif 'optique-sup' in chap_id:
            if v_mod == 'optique' and v_niv == 'sup':
                matched = True
                
        elif 'optique-spe' in chap_id:
            if v_mod == 'optique':
                matched = True
                
        elif 'em-sup' in chap_id:
            if v_mod == 'em' and (v_niv == 'sup' or 'statique' in combined):
                if chap_num == 1 and any(k in combined for k in ['électrostatique', 'electrostatique', 'gauss', 'coulomb', 'potentiel', 'dipôle']):
                    matched = True
                elif chap_num == 2 and any(k in combined for k in ['magnétostatique', 'magnetostatique', 'ampère', 'ampere', 'biot', 'savart', 'courant', 'solénoïde']):
                    matched = True
                    
        elif 'em-spe' in chap_id:
            if v_mod == 'em':
                if chap_num == 1 and any(k in combined for k in ['maxwell', 'opérateur', 'operateur', 'continuité', 'ohm', 'drude', 'charge']):
                    matched = True
                elif chap_num == 2 and any(k in combined for k in ['induction', 'faraday', 'laplace', 'poynting', 'énergie', 'energie', 'machine', 'moteur', 'transformateur', 'synchrone', 'conversion']):
                    matched = True
                    
        elif 'ondes-spe' in chap_id:
            if v_mod == 'ondes':
                matched = True
                
        elif 'quantique-spe' in chap_id:
            if v_mod == 'quantique':
                matched = True
                
        elif 'fluides-spe' in chap_id:
            if v_mod == 'fluides' and v_niv == 'spe':
                matched = True
                
        # 2. CONCOURS & METHODES INJECTION
        if not matched and v_mod in ['concours', 'methodes']:
            # Check if relevant to chapter topic
            if 'meca' in chap_id and any(k in combined for k in ['mécanique', 'mecanique', 'chute', 'pendule', 'orbite', 'satellite', 'newton']):
                matched = True
            elif 'em' in chap_id and any(k in combined for k in ['induction', 'laplace', 'maxwell', 'magnétique', 'magnetique', 'électrique']):
                matched = True
            elif 'thermo' in chap_id and any(k in combined for k in ['thermodynamique', 'thermo', 'carnot', 'diffusion thermique', 'fourier']):
                matched = True
            elif 'ondes' in chap_id and any(k in combined for k in ['onde', 'acoustique', 'sonore', 'corde']):
                matched = True
            elif 'optique' in chap_id and any(k in combined for k in ['optique', 'interférence', 'interference', 'michelson', 'diffraction']):
                matched = True
            elif 'fluides' in chap_id and any(k in combined for k in ['fluide', 'viscosité', 'viscosite', 'navier', 'stokes']):
                matched = True
            elif 'quantique' in chap_id and any(k in combined for k in ['quantique', 'tunnel', 'schrödinger', 'schrodinger']):
                matched = True
                
        if matched:
            matches.append(v)
            
    return matches

total_matches = 0
for c in chapitres:
    mv = get_matching_videos(c)
    total_matches += len(mv)
    print(f"[{c['id']}] {c['titre']}: {len(mv)} vidéos")

print(f"\nTotal video-chapter links created: {total_matches}")
