"use client";

import {
  PC_CONCOURS_DATA,
  ConcoursBlock,
  EpreuveItem,
  CorrigePartieItem,
  parseEpreuveFilieres,
} from "@/components/eddams/pcConcoursData";

const CONCOURS_STORAGE_KEY = "prepasciences_concours_db_v5";
const LEGACY_STORAGE_KEYS = [
  "prepasciences_concours_db_v1",
  "prepasciences_concours_db_v2",
  "prepasciences_concours_db_v3",
  "prepasciences_concours_db_v4",
];

/**
 * Assure que chaque bloc et épreuve possède un identifiant unique stable et des filières normalisées
 */
function normalizeConcoursData(blocks: ConcoursBlock[]): ConcoursBlock[] {
  return blocks.map((block, bIdx) => ({
    ...block,
    id: block.id || `concours-${bIdx + 1}`,
    sujets: (block.sujets || []).map((s, sIdx) => {
      const eId = s.id || `${block.id || bIdx}-${s.annee}-${sIdx}`;
      const corriges: CorrigePartieItem[] =
        Array.isArray(s.corriges) && s.corriges.length > 0
          ? s.corriges.map((c, cIdx) => ({
              id: c.id || `${eId}-corr-${cIdx}`,
              titre: c.titre || `Corrigé Partie ${cIdx + 1}`,
              url: c.url || "",
            }))
          : s.correction && s.correction.trim() !== ""
          ? [
              {
                id: `${eId}-corr-0`,
                titre: "Corrigé Détaillé Officiel",
                url: s.correction.trim(),
              },
            ]
          : [];

      const filieres = parseEpreuveFilieres(s.filiere, s.filieres);

      return {
        ...s,
        id: eId,
        filiere: s.filiere || (filieres.length >= 5 ? "Toutes" : filieres.join(" / ")),
        filieres,
        matiere: s.matiere || (s.label.toLowerCase().startsWith("chimie") ? "Chimie" : "Physique"),
        description: s.description || "",
        themes: Array.isArray(s.themes) ? s.themes : [],
        videos: Array.isArray(s.videos) ? s.videos : [],
        correction: s.correction || (corriges[0]?.url ?? ""),
        corriges,
      };
    }),
  }));
}

let cachedDefaultDB: ConcoursBlock[] | null = null;
function getDefaultNormalizedDB(): ConcoursBlock[] {
  if (!cachedDefaultDB) {
    cachedDefaultDB = normalizeConcoursData(PC_CONCOURS_DATA);
  }
  return cachedDefaultDB;
}

/**
 * Récupère les données des concours (base purgée v4 par défaut, ou surcharge locale si éditée par un professeur)
 */
export function getConcoursDB(): ConcoursBlock[] {
  if (typeof window === "undefined") {
    return getDefaultNormalizedDB();
  }
  try {
    // Nettoyage des anciennes versions locales (v1/v2/v3 PC-only) pour éviter tout cache périmé
    for (const oldKey of LEGACY_STORAGE_KEYS) {
      if (localStorage.getItem(oldKey) !== null) {
        localStorage.removeItem(oldKey);
      }
    }

    const raw = localStorage.getItem(CONCOURS_STORAGE_KEY);
    if (!raw) {
      return getDefaultNormalizedDB();
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.removeItem(CONCOURS_STORAGE_KEY);
      return getDefaultNormalizedDB();
    }
    return normalizeConcoursData(parsed);
  } catch (err) {
    console.error("Error reading concours DB from localStorage:", err);
    return getDefaultNormalizedDB();
  }
}

/**
 * Sauvegarde les modifications professeur dans le stockage local
 */
export function saveConcoursDB(data: ConcoursBlock[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CONCOURS_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Error saving concours DB to localStorage:", err);
  }
}

/**
 * Réinitialise la banque de concours aux données d'origine purgées
 */
export function resetConcoursDB(): ConcoursBlock[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CONCOURS_STORAGE_KEY);
  }
  return getDefaultNormalizedDB();
}

/**
 * Ajoute une nouvelle banque de concours
 */
export function addConcoursBlock(blockData: {
  id?: string;
  titre: string;
  meta?: string;
  icon?: string;
}): boolean {
  try {
    const data = structuredClone(getConcoursDB());
    const slugId = (blockData.id || blockData.titre)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const finalId = slugId || `concours-${Date.now()}`;
    if (data.some((b) => b.id === finalId)) {
      return false;
    }

    const newBlock: ConcoursBlock = {
      id: finalId,
      titre: blockData.titre.trim(),
      meta: blockData.meta?.trim() || "Épreuves officielles & Corrigés détaillés",
      icon: blockData.icon?.trim() || "🏆",
      badgeClass: `ci-${finalId}`,
      sujets: [],
    };

    data.push(newBlock);
    saveConcoursDB(data);
    return true;
  } catch (err) {
    console.error("Error adding concours block:", err);
    return false;
  }
}

/**
 * Modifie les métadonnées d'une banque de concours
 */
export function editConcoursBlock(
  blockId: string,
  updates: {
    titre?: string;
    meta?: string;
    icon?: string;
  }
): boolean {
  try {
    const data = structuredClone(getConcoursDB());
    const block = data.find((b) => b.id === blockId);
    if (!block) return false;

    if (updates.titre && updates.titre.trim()) {
      block.titre = updates.titre.trim();
    }
    if (updates.meta !== undefined) {
      block.meta = updates.meta.trim();
    }
    if (updates.icon && updates.icon.trim()) {
      block.icon = updates.icon.trim();
    }

    saveConcoursDB(data);
    return true;
  } catch (err) {
    console.error("Error editing concours block:", err);
    return false;
  }
}

/**
 * Supprime une banque de concours
 */
export function deleteConcoursBlock(blockId: string): boolean {
  try {
    const data = structuredClone(getConcoursDB());
    const filtered = data.filter((b) => b.id !== blockId);
    if (filtered.length === data.length) return false;

    saveConcoursDB(filtered);
    return true;
  } catch (err) {
    console.error("Error deleting concours block:", err);
    return false;
  }
}

/**
 * Ajoute une nouvelle épreuve à un concours
 */
export function addEpreuveToConcours(
  blockId: string,
  epreuve: {
    annee: number | string;
    filiere?: string;
    matiere?: string;
    label: string;
    description?: string;
    enonce?: string;
    correction?: string;
    corriges?: CorrigePartieItem[];
    video?: string | null;
  }
): boolean {
  try {
    const data = structuredClone(getConcoursDB());
    const block = data.find((b) => b.id === blockId);
    if (!block) return false;

    const eId = `${blockId}-ep-${Date.now()}`;
    const cleanCorriges: CorrigePartieItem[] = [];

    if (epreuve.corriges && Array.isArray(epreuve.corriges)) {
      epreuve.corriges.forEach((c, idx) => {
        if (c.url && c.url.trim()) {
          cleanCorriges.push({
            id: c.id || `${eId}-corr-${idx}`,
            titre: c.titre.trim() || `Corrigé Partie ${idx + 1}`,
            url: c.url.trim(),
          });
        }
      });
    }

    if (cleanCorriges.length === 0 && epreuve.correction && epreuve.correction.trim()) {
      cleanCorriges.push({
        id: `${eId}-corr-0`,
        titre: "Corrigé Détaillé",
        url: epreuve.correction.trim(),
      });
    }

    const firstCorrigeUrl =
      cleanCorriges.length > 0 ? cleanCorriges[0].url : epreuve.correction?.trim() || "";
    const filiereStr = epreuve.filiere?.trim() || "MP";
    const filieres = parseEpreuveFilieres(filiereStr);

    const newEpreuve: EpreuveItem = {
      id: eId,
      annee: epreuve.annee,
      filiere: filiereStr,
      filieres,
      matiere: epreuve.matiere?.trim() || (epreuve.label.toLowerCase().includes("chimie") ? "Chimie" : "Physique"),
      label: epreuve.label.trim(),
      description: epreuve.description?.trim() || "",
      themes: [],
      enonce: epreuve.enonce?.trim() || "",
      correction: firstCorrigeUrl,
      corriges: cleanCorriges,
      video: epreuve.video?.trim() || null,
      videos: epreuve.video?.trim()
        ? [{ id: `${eId}-v0`, title: epreuve.label.trim(), url: epreuve.video.trim() }]
        : [],
    };

    block.sujets.unshift(newEpreuve);
    saveConcoursDB(data);
    return true;
  } catch (err) {
    console.error("Error adding epreuve to concours:", err);
    return false;
  }
}

/**
 * Modifie une épreuve existante
 */
export function editEpreuveInConcours(
  blockId: string,
  epreuveIdOrIndex: string | number,
  updates: {
    annee?: number | string;
    filiere?: string;
    matiere?: string;
    label?: string;
    description?: string;
    enonce?: string;
    correction?: string;
    corriges?: CorrigePartieItem[];
    video?: string | null;
  }
): boolean {
  try {
    const data = structuredClone(getConcoursDB());
    const block = data.find((b) => b.id === blockId);
    if (!block) return false;

    const targetEpreuve =
      typeof epreuveIdOrIndex === "number"
        ? block.sujets[epreuveIdOrIndex]
        : block.sujets.find((s) => s.id === epreuveIdOrIndex);
    if (!targetEpreuve) return false;

    if (updates.annee !== undefined) {
      targetEpreuve.annee = updates.annee;
    }
    if (updates.filiere !== undefined) {
      const fStr = updates.filiere.trim() || "MP";
      targetEpreuve.filiere = fStr;
      targetEpreuve.filieres = parseEpreuveFilieres(fStr);
    }
    if (updates.matiere !== undefined) {
      targetEpreuve.matiere = updates.matiere.trim();
    }
    if (updates.label !== undefined && updates.label.trim()) {
      targetEpreuve.label = updates.label.trim();
    }
    if (updates.description !== undefined) {
      targetEpreuve.description = updates.description.trim();
    }
    if (updates.enonce !== undefined) {
      targetEpreuve.enonce = updates.enonce.trim();
    }
    if (updates.video !== undefined) {
      const cleanVid = updates.video?.trim() || null;
      targetEpreuve.video = cleanVid;
      if (!cleanVid) {
        targetEpreuve.videos = [];
      } else if (!targetEpreuve.videos || targetEpreuve.videos.length === 0) {
        targetEpreuve.videos = [{ id: `${targetEpreuve.id}-v0`, title: targetEpreuve.label, url: cleanVid }];
      } else {
        targetEpreuve.videos[0] = { ...targetEpreuve.videos[0], url: cleanVid };
      }
    }

    if (updates.corriges !== undefined) {
      const cleanCorriges: CorrigePartieItem[] = [];
      updates.corriges.forEach((c, idx) => {
        if (c.url && c.url.trim()) {
          cleanCorriges.push({
            id: c.id || `${targetEpreuve.id || Date.now()}-corr-${idx}`,
            titre: c.titre.trim() || `Corrigé Partie ${idx + 1}`,
            url: c.url.trim(),
          });
        }
      });
      targetEpreuve.corriges = cleanCorriges;
      targetEpreuve.correction = cleanCorriges.length > 0 ? cleanCorriges[0].url : "";
    } else if (updates.correction !== undefined) {
      targetEpreuve.correction = updates.correction.trim();
      if (!targetEpreuve.corriges || targetEpreuve.corriges.length === 0) {
        if (targetEpreuve.correction) {
          targetEpreuve.corriges = [
            {
              id: `${targetEpreuve.id || Date.now()}-corr-0`,
              titre: "Corrigé Détaillé",
              url: targetEpreuve.correction,
            },
          ];
        }
      } else if (targetEpreuve.corriges.length > 0 && targetEpreuve.correction) {
        targetEpreuve.corriges[0].url = targetEpreuve.correction;
      }
    }

    saveConcoursDB(data);
    return true;
  } catch (err) {
    console.error("Error editing epreuve in concours:", err);
    return false;
  }
}

/**
 * Supprime une épreuve d'un concours
 */
export function deleteEpreuveFromConcours(
  blockId: string,
  epreuveIdOrIndex: string | number
): boolean {
  try {
    const data = structuredClone(getConcoursDB());
    const block = data.find((b) => b.id === blockId);
    if (!block) return false;

    if (typeof epreuveIdOrIndex === "number") {
      if (epreuveIdOrIndex < 0 || epreuveIdOrIndex >= block.sujets.length) return false;
      block.sujets.splice(epreuveIdOrIndex, 1);
    } else {
      const initLen = block.sujets.length;
      block.sujets = block.sujets.filter((s) => s.id !== epreuveIdOrIndex);
      if (block.sujets.length === initLen) return false;
    }

    saveConcoursDB(data);
    return true;
  } catch (err) {
    console.error("Error deleting epreuve from concours:", err);
    return false;
  }
}
