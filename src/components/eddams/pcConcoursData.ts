/**
 * Base de données exhaustive & purgée des annales officielles CPGE (2000-2019 + CNC)
 * Strictement différenciée par filière : MP, PSI, PC, TSI, PT
 * Physique & Chimie (CNC, Centrale-Supélec, Mines-Ponts, CCINP, X-ENS, e3a, Banque PT)
 * Avec vidéos de correction E-Learning Physique associées exactement par épreuve, session et filière.
 */

import RAW_CONCOURS_DATA from "@/data/concoursData.json";

export type FiliereConcours = "MP" | "PSI" | "PC" | "TSI" | "PT";

export interface FiliereConcoursInfo {
  id: FiliereConcours;
  label: string;
  shortLabel: string;
  subtitle: string;
  accent: string;
}

export const FILIERES_CONCOURS: FiliereConcoursInfo[] = [
  {
    id: "MP",
    label: "Filière MP / MP*",
    shortLabel: "MP / MP*",
    subtitle: "CNC · Centrale-Supélec · Mines-Ponts · CCINP · X-ENS · e3a",
    accent: "purple",
  },
  {
    id: "PSI",
    label: "Filière PSI / PSI*",
    shortLabel: "PSI / PSI*",
    subtitle: "CNC · Centrale-Supélec · Mines-Ponts · CCINP · X-ENS · e3a",
    accent: "indigo",
  },
  {
    id: "PC",
    label: "Filière PC / PC*",
    shortLabel: "PC / PC*",
    subtitle: "Centrale-Supélec · Mines-Ponts · CCINP · X-ENS / ESPCI · e3a",
    accent: "violet",
  },
  {
    id: "TSI",
    label: "Filière TSI",
    shortLabel: "TSI",
    subtitle: "Centrale-Supélec TSI · CCINP TSI · Oraux & TP",
    accent: "blue",
  },
  {
    id: "PT",
    label: "Filière PT / PT*",
    shortLabel: "PT / PT*",
    subtitle: "Banque PT (Physique A, B, C, Modélisation & Chimie) · Oraux & TP",
    accent: "emerald",
  },
];

export interface VideoPartItem {
  id?: string;
  title: string;
  url: string;
  duration?: string;
  chapitre?: string;
  themes?: string[];
}

export interface CorrigePartieItem {
  id: string;
  titre: string;
  url: string;
}

export interface EpreuveItem {
  id?: string;
  annee: number | string;
  filiere: string;
  filieres?: FiliereConcours[];
  matiere?: "Physique" | "Chimie" | "Physique-Chimie" | "Oral & TP" | "Méthodologie" | string;
  label: string;
  description?: string;
  themes?: string[];
  enonce: string;
  correction: string;
  corriges?: CorrigePartieItem[];
  video?: string | null;
  videos?: VideoPartItem[];
}

export interface ConcoursBlock {
  id: string;
  titre: string;
  meta: string;
  icon: string;
  badgeClass?: string;
  sujets: EpreuveItem[];
}

export interface ThemeModuleItem {
  id: string;
  label: string;
  icon: string;
}

export const THEMES_MODULES: ThemeModuleItem[] = [
  { id: "all", label: "Tous les thèmes", icon: "📚" },
  { id: "electronique", label: "Électronique & Signal", icon: "⚡" },
  { id: "electromagnetisme", label: "Électromagnétisme & Induction", icon: "🧲" },
  { id: "thermodynamique", label: "Thermodynamique & Transferts", icon: "🔥" },
  { id: "mecanique", label: "Mécanique & Solide", icon: "⚙️" },
  { id: "fluides", label: "Mécanique des Fluides", icon: "🌊" },
  { id: "optique_ondes", label: "Optique Ondulatoire & Acoustique", icon: "🌈" },
  { id: "quantique", label: "Physique Quantique & Atomique", icon: "⚛️" },
  { id: "chimie_orga", label: "Chimie Organique", icon: "🧪" },
  { id: "chimie_solutions", label: "Solutions & Électrochimie", icon: "⚗️" },
  { id: "chimie_archi", label: "Architecture Matière & Cristallo", icon: "💎" },
  { id: "tp_oraux", label: "TP & Planches d'Oraux", icon: "🔬" },
];

export const PC_CONCOURS_DATA: ConcoursBlock[] = RAW_CONCOURS_DATA as ConcoursBlock[];

/**
 * Normalise une chaîne de filière (ex: "MP*", "PSI / PC", "Toutes") en tableau strict de FiliereConcours.
 */
export function parseEpreuveFilieres(filiere?: string, filieres?: string[]): FiliereConcours[] {
  const valid: FiliereConcours[] = ["MP", "PSI", "PC", "TSI", "PT"];
  if (Array.isArray(filieres) && filieres.length > 0) {
    const cleaned = filieres.filter((f): f is FiliereConcours =>
      valid.includes(f as FiliereConcours)
    );
    if (cleaned.length > 0) return cleaned;
  }
  const raw = (filiere || "").toUpperCase();
  if (!raw || raw.includes("TOUTES") || raw.includes("ALL")) {
    return [...valid];
  }
  const matched = valid.filter((f) => new RegExp(`\\b${f}\\b`).test(raw.replace(/\*/g, "")));
  return matched.length > 0 ? matched : ["MP"];
}

/**
 * Déduit la filière concours par défaut à partir du profil utilisateur connecté.
 */
export function resolveUserDefaultFiliere(userFiliere?: string | null): FiliereConcours {
  if (!userFiliere) return "MP";
  const upper = userFiliere.toUpperCase().replace(/\*/g, "").trim();
  if (upper === "PSI") return "PSI";
  if (upper === "PC") return "PC";
  if (upper === "TSI") return "TSI";
  if (upper === "PT") return "PT";
  return "MP";
}
