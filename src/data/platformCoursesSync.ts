import { PC_COURSES_DATA, ChapitreItem } from "@/components/eddams/pcCoursesData";
import { getActiveMathCourses, MathCourseItem } from "./mathCoursesData";

export interface MarqueeCourseItem {
  id: string;
  titre: string;
  pole: "maths" | "pc";
  poleLabel: string;
  badge: string;
  link: string;
  isExternal: boolean;
  resourcesCount: number;
}

/**
 * Détecte si une URL de document ou de vidéo est réelle et exploitable
 * (exclut les chaînes vides, ancres dièses, et identifiants templates/placeholders).
 */
export function isValidDocumentUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (
    trimmed === "" ||
    trimmed === "#" ||
    trimmed === "javascript:void(0)" ||
    trimmed.includes("dQw4w9WgXcQ") || // ID template Rickroll
    trimmed.includes("1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs") // ID template Google Drive
  ) {
    return false;
  }
  return true;
}

/**
 * Vérifie si un chapitre contient au moins une ressource / document réel.
 * Calcule le nombre exact de documents valides.
 */
export function countChapterValidDocuments(chap: ChapitreItem): number {
  let count = 0;

  if (chap.cours && Array.isArray(chap.cours)) {
    for (const session of chap.cours) {
      if (isValidDocumentUrl(session.support) || isValidDocumentUrl(session.video)) {
        count++;
      }
    }
  }

  if (chap.tds && Array.isArray(chap.tds)) {
    for (const td of chap.tds) {
      if (isValidDocumentUrl(td.enonce) || isValidDocumentUrl(td.correction) || isValidDocumentUrl(td.video)) {
        count++;
      }
    }
  }

  if (chap.fiches && Array.isArray(chap.fiches)) {
    for (const fiche of chap.fiches) {
      if (isValidDocumentUrl(fiche.url)) {
        count++;
      }
    }
  }

  if (
    isValidDocumentUrl(chap.ficheUrl) ||
    isValidDocumentUrl(chap.enonceTdUrl) ||
    isValidDocumentUrl(chap.corrigeTdUrl) ||
    isValidDocumentUrl(chap.videoUrl)
  ) {
    count++;
  }

  return count;
}

// Extraction dynamique des cours de Physique-Chimie ayant des documents RÉELS dans la plateforme (Pr. Eddams)
// Si aucun document n'a été téléversé / ajouté pour un chapitre, ce chapitre n'est PAS affiché dans le carrousel.
export function getActivePcCourses(): MarqueeCourseItem[] {
  const items: MarqueeCourseItem[] = [];

  for (const moduleItem of PC_COURSES_DATA) {
    for (const chap of moduleItem.chapitres) {
      const realDocsCount = countChapterValidDocuments(chap);

      // Détection stricte : uniquement les chapitres disposant de documents effectifs
      if (realDocsCount > 0) {
        items.push({
          id: chap.id,
          titre: chap.titre,
          pole: "pc",
          poleLabel: "Physique-Chimie",
          badge: chap.badge || "Physique MP*",
          link: "/eddams?rubrique=cours",
          isExternal: false,
          resourcesCount: realDocsCount,
        });
      }
    }
  }

  return items;
}

// Extraction automatique des cours de Mathématiques ayant des ressources (Pr. Anas Khadir)
export function getActiveMathMarqueeItems(): MarqueeCourseItem[] {
  const maths = getActiveMathCourses();
  return maths.map((m: MathCourseItem) => ({
    id: m.id,
    titre: m.titre,
    pole: "maths",
    poleLabel: "Mathématiques",
    badge: m.badge || "Maths MP/TSI",
    link: "https://quiz.anasskhadir.com/",
    isExternal: true,
    resourcesCount: m.coursCount + m.tdsCount,
  }));
}
