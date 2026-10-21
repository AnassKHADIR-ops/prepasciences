/**
 * CATALOGUE OFFICIEL E-LEARNING PHYSIQUE CPGE
 * Chaîne : E-Learning Physique (@e-learningphysique4910)
 * Structuré selon les programmes officiels CPGE (MPSI, PCSI, MP, PSI, PC, TSI)
 * Total : 387 Vidéos vérifiées sans liens manquants
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
