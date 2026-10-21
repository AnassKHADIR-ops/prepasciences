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

for pid, pdata in playlists_dump.items():
    ptitle = pdata.get('title', '')
    for e in pdata.get('entries', []):
        vid_id = e.get('id')
        title_raw = e.get('title') or ''
        if not vid_id or not title_raw.strip() or title_raw in ['[Private video]', '[Deleted video]']:
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

for v in vids:
    vid_id = v.get('id')
    title_raw = v.get('title') or ''
    if not vid_id or not title_raw.strip() or title_raw in ['[Private video]', '[Deleted video]']:
        continue
    if vid_id not in all_videos:
        all_videos[vid_id] = {
            "id": vid_id,
            "title": title_raw.strip(),
            "duration": v.get('duration') or 0,
            "playlists": [],
        }
    else:
        if not all_videos[vid_id]["duration"] and v.get('duration'):
            all_videos[vid_id]["duration"] = v.get('duration')

print(f"Total valid unique videos to process: {len(all_videos)}")

def format_duration(seconds):
    sec = int(seconds or 0)
    m, s = divmod(sec, 60)
    h, m = divmod(m, 60)
    if h > 0:
        return f"{h:d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"

def classify_video(v):
    title = v['title']
    playlists = v['playlists']
    p_str = " ".join(playlists).lower()
    combined = (title + " " + p_str).lower()

    domaine = "Physique Générale"
    module_id = "general"
    chapitre = "Généralités CPGE"
    niveau = "spe"
    filieres = ["MP", "PSI", "PC", "TSI"]
    is_common = True
    concours = None

    # 1. ANNALES & CONCOURS
    if any(k in combined for k in ["concours", "corrigé", "corriges", "épreuve", "epreuve", "answer key", "oral"]):
        domaine = "Annales & Corrigés de Concours"
        module_id = "concours"
        niveau = "spe"
        
        if any(k in combined for k in ["x/ens", "x-ens", "espci", "polytechnique"]):
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

        if "psi" in combined and "mp" not in combined and "pc" not in combined:
            filieres = ["PSI"]
            is_common = False
        elif "mp" in combined and "psi" not in combined and "pc" not in combined:
            filieres = ["MP"]
            is_common = False
        elif "pc" in combined and "mp" not in combined and "psi" not in combined:
            filieres = ["PC"]
            is_common = False
        elif any(k in combined for k in ["mp/pc/psi", "mp/pc", "pc/psi", "mp/psi"]):
            filieres = ["MP", "PSI", "PC"]
            is_common = True
        else:
            filieres = ["MP", "PSI", "PC", "TSI"]
            is_common = True

        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 2. TP & PRATIQUE EXPÉRIMENTALE
    if any(k in combined for k in ["tp", "tp de physique", "goniomètre", "focométrie", "incertitude"]):
        domaine = "Travaux Pratiques & Épreuves Orales"
        module_id = "tp"
        chapitre = "TP & Formation Expérimentale"
        niveau = "spe"
        filieres = ["MP", "PSI", "PC", "TSI"]
        is_common = True
        concours = "TP Concours"
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 3. PHYSIQUE QUANTIQUE
    if any(k in combined for k in ["quantique", "schrödinger", "schrodinger", "puits", "stern", "effet tunnel", "dualité"]):
        domaine = "Physique Quantique"
        module_id = "quantique"
        chapitre = "Mécanique Quantique & Effet Tunnel"
        niveau = "spe"
        filieres = ["MP", "PC"]
        is_common = False
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 4. STATISTIQUE & BOLTZMANN
    if any(k in combined for k in ["physique statistique", "statistique", "boltzmann"]):
        domaine = "Thermodynamique & Transferts"
        module_id = "thermo"
        chapitre = "Thermodynamique Statistique & Facteur de Boltzmann"
        niveau = "spe"
        filieres = ["MP", "PC"]
        is_common = False
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 5. MÉCANIQUE DES FLUIDES
    if any(k in combined for k in ["fluide", "poiseuille", "bernoulli", "reynolds", "viscosité", "visqueux", "traînée", "portance", "couche limite", "venturi"]):
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

    # 6. MACHINES TOURNANTES, CONVERSION DE PUISSANCE & MILIEUX FERROMAGNÉTIQUES
    if any(k in combined for k in ["synchrone", "asynchrone", "machine", "ferromagnétique", "hystérésis", "transformateur", "électroaimant", "ferromagnetic", "iron-core", "power conversion", "hysteresis"]):
        domaine = "Électromagnétisme & Conversion"
        module_id = "em"
        chapitre = "Conversion Électromécanique & Matériaux Magnétiques"
        niveau = "spe"
        filieres = ["PSI", "TSI", "PC"]
        is_common = False
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 7. ÉLECTROMAGNÉTISME & INDUCTION
    if any(k in combined for k in ["électromagnétisme", "electromagnetisme", "maxwell", "magnétostatique", "ampère", "ampere", "électrostatique", "electrostatique", "induction", "faraday", "laplace", "dipôle", "poynting"]):
        domaine = "Électromagnétisme & Induction"
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

    # 8. ONDES ÉLECTROMAGNÉTIQUES & ACOUSTIQUES
    if any(k in combined for k in ["onde", "ondes", "acoustique", "son", "corde", "d'alembert", "dispersion", "absorption"]):
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

    # 9. OPTIQUE
    if any(k in combined for k in ["optique", "interférence", "interferences", "diffraction", "michelson", "young", "réseau", "polarisation", "laser", "brewster", "wave optics"]):
        domaine = "Optique Ondulatoire & Géométrique"
        module_id = "optique"
        if "géométrique" in combined or "miroir" in combined or "lentille" in combined:
            chapitre = "Optique Géométrique & Instruments d'Optique"
            niveau = "sup"
            filieres = ["MP", "PSI", "PC", "TSI"]
            is_common = True
        elif "laser" in combined:
            chapitre = "Physique des Lasers & Optique Moderne"
            niveau = "spe"
            filieres = ["PC"]
            is_common = False
        elif "polarisation" in combined or "brewster" in combined:
            chapitre = "Polarisation de la Lumière (Lames & Réflexion)"
            niveau = "spe"
            filieres = ["MP", "PSI", "PC"]
            is_common = True
        elif "fourier" in combined:
            chapitre = "Diffraction & Optique de Fourier"
            niveau = "spe"
            filieres = ["MP", "PC"]
            is_common = False
        else:
            chapitre = "Optique Ondulatoire, Interférences & Réseaux"
            niveau = "spe"
            filieres = ["MP", "PSI", "PC", "TSI"]
            is_common = True
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 10. THERMODYNAMIQUE & CONDUCTION THERMIQUE
    if any(k in combined for k in ["thermo", "thermodynamique", "chaleur", "conduction", "diffusion", "fourier", "entropie", "premier principe", "second principe", "gaz", "cycle", "effusion", "ailette"]):
        domaine = "Thermodynamique & Transferts"
        module_id = "thermo"
        if "ailette" in combined or "cooling fin" in combined:
            chapitre = "Transferts Thermiques & Ailettes de Refroidissement"
            niveau = "spe"
            filieres = ["PSI", "PC"]
            is_common = False
        elif "conduction" in combined or "diffusion" in combined:
            chapitre = "Transferts Thermiques & Conduction (Loi de Fourier)"
            niveau = "spe"
            filieres = ["MP", "PSI", "PC", "TSI"]
            is_common = True
        else:
            chapitre = "Thermodynamique Phénoménologique & Principes"
            niveau = "sup" if any(k in combined for k in ["mpsi", "pcsi", "gaz", "effusion"]) else "spe"
            filieres = ["MP", "PSI", "PC", "TSI"]
            is_common = True
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 11. ÉLECTRONIQUE & TRAITEMENT DU SIGNAL
    if any(k in combined for k in ["électronique", "electronique", "signal", "filtre", "circuit", "diode", "arqs", "oscillateur", "bode", "puissance en régime sinusoïdal", "sinusoidal", "électricité"]):
        domaine = "Électronique & Signal"
        module_id = "elec"
        if any(k in combined for k in ["numérique", "échantillonnage", "echantillonnage", "can"]):
            chapitre = "Électronique Numérique & Échantillonnage"
            niveau = "spe"
        elif any(k in combined for k in ["oscillateur", "stabilité"]):
            chapitre = "Oscillateurs & Systèmes Linéaires Asservis"
            niveau = "spe"
        else:
            chapitre = "Électrocinétique, Puissance & Filtrage Linéaire"
            niveau = "sup"
        filieres = ["MP", "PSI", "PC", "TSI"]
        is_common = True
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 12. MÉCANIQUE DU POINT & DU SOLIDE
    if any(k in combined for k in ["mécanique", "mecanique", "solide", "référentiel", "galiléen", "newton", "kepler", "pendule", "moment"]):
        domaine = "Mécanique & Solide"
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
    if any(k in combined for k in ["chimie", "cinétique", "lewis", "thermochimie", "liaison"]):
        domaine = "Chimie CPGE"
        module_id = "chimie"
        chapitre = "Chimie Physique, Cinétique & Liaisons Chimiques"
        niveau = "sup"
        filieres = ["PC", "PCSI", "MPSI"]
        is_common = False
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # 14. OUTILS MATHÉMATIQUES & PYTHON & MÉTHODE
    if any(k in combined for k in ["math", "python", "réussir en prépa", "méthode", "analyse dimensionnelle", "internet"]):
        domaine = "Outils & Méthodologie"
        module_id = "methodes"
        chapitre = "Outils Numériques & Méthodologie CPGE"
        niveau = "sup"
        filieres = ["MP", "PSI", "PC", "TSI"]
        is_common = True
        return domaine, module_id, chapitre, niveau, filieres, is_common, concours

    # Catch-all
    domaine = "Outils & Méthodologie"
    module_id = "methodes"
    chapitre = "Méthodes CPGE Transversales"
    niveau = "sup"
    filieres = ["MP", "PSI", "PC", "TSI"]
    is_common = True
    return domaine, module_id, chapitre, niveau, filieres, is_common, concours

processed_videos = []
for vid_id, v in sorted(all_videos.items(), key=lambda x: x[1]['title']):
    dom, mid, chap, niv, fils, is_c, conc = classify_video(v)
    processed_videos.append({
        "id": vid_id,
        "title": v['title'],
        "duration": v['duration'],
        "durationFormatted": format_duration(v['duration']),
        "youtubeUrl": f"https://www.youtube.com/watch?v={vid_id}",
        "embedUrl": f"https://www.youtube.com/embed/{vid_id}",
        "thumbnailUrl": f"https://i.ytimg.com/vi/{vid_id}/hqdefault.jpg",
        "domaine": dom,
        "moduleId": mid,
        "chapitre": chap,
        "niveau": niv,
        "filieres": fils,
        "isCommon": is_c,
        "concoursTag": conc,
        "playlists": v['playlists']
    })

print(f"Processed {len(processed_videos)} videos.")

# Save JSON
with open('src/data/elearningPhysiqueVideos.json', 'w', encoding='utf-8') as jf:
    json.dump(processed_videos, jf, ensure_ascii=False, indent=2)

print("Saved JSON to src/data/elearningPhysiqueVideos.json")

# Generate TypeScript file
ts_content = '''/**
 * CATALOGUE OFFICIEL E-LEARNING PHYSIQUE CPGE
 * Chaîne : E-Learning Physique (@e-learningphysique4910)
 * Structuré selon les programmes officiels CPGE (MPSI, PCSI, MP, PSI, PC, TSI)
 * Total : %d Vidéos vérifiées sans liens manquants
 */

export type FiliereCPGE = "MP" | "PSI" | "PC" | "TSI";
export type NiveauCPGE = "sup" | "spe" | "tous";

export type DomainePhysique =
  | "Électromagnétisme & Induction"
  | "Électromagnétisme & Conversion"
  | "Mécanique & Solide"
  | "Thermodynamique & Transferts"
  | "Électronique & Signal"
  | "Physique des Ondes"
  | "Optique Ondulatoire & Géométrique"
  | "Mécanique des Fluides"
  | "Physique Quantique"
  | "Chimie CPGE"
  | "Outils & Méthodologie"
  | "Travaux Pratiques & Épreuves Orales"
  | "Annales & Corrigés de Concours";

export interface ElearningVideoItem {
  id: string;
  title: string;
  duration: number; // en secondes
  durationFormatted: string; // "14:22"
  youtubeUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  domaine: DomainePhysique;
  moduleId: string;
  chapitre: string;
  niveau: NiveauCPGE;
  filieres: FiliereCPGE[];
  isCommon: boolean; // Tronc commun MP / PSI / PC / TSI
  concoursTag?: string | null;
  playlists: string[];
}

export interface OfficialSyllabusFile {
  filiere: FiliereCPGE | "MPSI" | "PCSI";
  annee: "1ère année (Sup)" | "2ème année (Spé)";
  title: string;
  pdfUrl: string;
  code: string;
}

export const OFFICIAL_SYLLABUS_FILES: OfficialSyllabusFile[] = [
  {
    filiere: "PSI",
    annee: "2ème année (Spé)",
    title: "Programme Officiel de Physique — PSI (2ème année)",
    pdfUrl: "/programmes/programme-psi-2.pdf",
    code: "PSI-2",
  },
  {
    filiere: "MP",
    annee: "2ème année (Spé)",
    title: "Programme Officiel de Physique — MP (2ème année)",
    pdfUrl: "/programmes/programme-mp-2.pdf",
    code: "MP-2",
  },
  {
    filiere: "TSI",
    annee: "2ème année (Spé)",
    title: "Programme Officiel de Physique — TSI (2ème année)",
    pdfUrl: "/programmes/programme-tsi-2.pdf",
    code: "TSI-2",
  },
  {
    filiere: "MPSI",
    annee: "1ère année (Sup)",
    title: "Programme Officiel de Physique — MPSI (1ère année)",
    pdfUrl: "/programmes/programme-mpsi-1.pdf",
    code: "MPSI-1",
  },
  {
    filiere: "PCSI",
    annee: "1ère année (Sup)",
    title: "Programme Officiel de Physique — PCSI (1ère année)",
    pdfUrl: "/programmes/programme-pcsi-1.pdf",
    code: "PCSI-1",
  },
  {
    filiere: "TSI",
    annee: "1ère année (Sup)",
    title: "Programme Officiel de Physique — TSI (1ère année)",
    pdfUrl: "/programmes/programme-tsi-1.pdf",
    code: "TSI-1",
  },
];

import RAW_VIDEOS from "./elearningPhysiqueVideos.json";

export const ELEARNING_PHYSICS_VIDEOS: ElearningVideoItem[] = RAW_VIDEOS as ElearningVideoItem[];

/**
 * Filtre les vidéos pour une filière donnée (ex: 'PSI').
 * REGLE PÉDAGOGIQUE STRICTE :
 * Si un étudiant clique sur PSI, il voit :
 * 1. Tous les cours du tronc commun partagés avec MP, PC, TSI (isCommon: true).
 * 2. Tous les cours spécifiques de PSI (Mécanique des fluides visqueux, bilans industriels, machines synchrones, asservissements, corrigés PSI).
 * 3. Les cours strictement spécifiques à MP (Physique quantique, Thermodynamique statistique, corrigés MP purs) sont masqués pour respecter son programme.
 */
export function filterVideosByFiliere(
  videos: ElearningVideoItem[],
  filiere: FiliereCPGE | "ALL",
  options?: {
    niveau?: NiveauCPGE;
    domaine?: string;
    searchQuery?: string;
  }
): ElearningVideoItem[] {
  let list = videos;

  if (filiere !== "ALL") {
    list = list.filter((v) => v.filieres.includes(filiere));
  }

  if (options?.niveau && options.niveau !== "tous") {
    list = list.filter((v) => v.niveau === options.niveau || v.niveau === "tous");
  }

  if (options?.domaine && options.domaine !== "ALL") {
    list = list.filter((v) => v.domaine === options.domaine || v.moduleId === options.domaine);
  }

  if (options?.searchQuery && options.searchQuery.trim() !== "") {
    const q = options.searchQuery.toLowerCase().trim();
    list = list.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.chapitre.toLowerCase().includes(q) ||
        v.domaine.toLowerCase().includes(q) ||
        (v.concoursTag && v.concoursTag.toLowerCase().includes(q))
    );
  }

  return list;
}

/**
 * Statistiques instantanées par filière
 */
export function getFiliereStats(videos: ElearningVideoItem[]) {
  const stats = {
    total: videos.length,
    common: 0,
    mp: 0,
    psi: 0,
    pc: 0,
    tsi: 0,
    domaines: {} as Record<string, number>,
  };

  for (const v of videos) {
    if (v.isCommon) stats.common++;
    if (v.filieres.includes("MP")) stats.mp++;
    if (v.filieres.includes("PSI")) stats.psi++;
    if (v.filieres.includes("PC")) stats.pc++;
    if (v.filieres.includes("TSI")) stats.tsi++;
    stats.domaines[v.domaine] = (stats.domaines[v.domaine] || 0) + 1;
  }

  return stats;
}
''' % len(processed_videos)

with open('src/data/elearningPhysiqueData.ts', 'w', encoding='utf-8') as tsf:
    tsf.write(ts_content)

print("Saved TypeScript file to src/data/elearningPhysiqueData.ts")
