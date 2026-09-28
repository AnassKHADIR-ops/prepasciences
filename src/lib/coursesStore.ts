"use client";

import {
  ModuleCoursBlock,
  ChapitreItem,
  CourseSession,
  CourseExercise,
  CourseFiche,
  CorrigeItem,
  BatchDocumentEntry,
} from "@/types/courses";
import { PC_COURSES_DATA } from "@/components/eddams/pcCoursesData";
import { getDriveImageUrls, getYoutubeThumbnail } from "./driveUtils";
import { supabase } from "./supabase";

const COURSES_STORAGE_KEY = "prepasciences_courses_db_v2";

export function getCoursesDB(): ModuleCoursBlock[] {
  if (typeof window === "undefined") return PC_COURSES_DATA;
  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(PC_COURSES_DATA));
      return PC_COURSES_DATA;
    }
    return JSON.parse(raw);
  } catch {
    return PC_COURSES_DATA;
  }
}

export function saveCoursesDB(data: ModuleCoursBlock[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore
  }
}

// ── 1. Ajout d'une Séance Vidéo / Support à un Chapitre ──
export function addSessionToChapter(
  moduleId: string,
  chapterId: string,
  session: {
    titre: string;
    sous?: string;
    videoUrl?: string;
    supportUrl?: string;
  }
): boolean {
  const data = getCoursesDB();
  const moduleItem = data.find((m) => m.id === moduleId);
  if (!moduleItem) return false;

  const chapter = moduleItem.chapitres.find((c) => c.id === chapterId);
  if (!chapter) return false;

  const newSession: CourseSession = {
    id: "sess-" + Date.now(),
    titre: session.titre.trim(),
    sous: session.sous?.trim() || "Séance de cours & Replay",
    video: session.videoUrl?.trim(),
    support: session.supportUrl?.trim(),
    thumbnail:
      (session.videoUrl ? getYoutubeThumbnail(session.videoUrl) || undefined : undefined) ||
      (session.supportUrl ? getDriveImageUrls(session.supportUrl)[0] : undefined),
  };

  chapter.cours = [newSession, ...(chapter.cours || [])];
  saveCoursesDB(data);

  // Synchronisation Cloud Supabase
  if (supabase) {
    supabase
      .from("sessions")
      .insert([
        {
          id: newSession.id,
          chapter_id: chapterId,
          titre: newSession.titre,
          sous: newSession.sous,
          support_url: newSession.support || null,
          video_url: newSession.video || null,
        },
      ])
      .then(({ error }) => {
        if (error) console.error("Supabase insert session error:", error);
      });
  }

  return true;
}

// ── 2. Ajout d'un TD / Exercice avec MULTI-CORRIGÉS ──
export function addExerciseToChapter(
  moduleId: string,
  chapterId: string,
  exercise: {
    titre: string;
    sous?: string;
    enonceUrl?: string;
    corriges: { titre: string; url: string; type?: "pdf" | "video" }[];
    videoUrl?: string;
  }
): boolean {
  const data = getCoursesDB();
  const moduleItem = data.find((m) => m.id === moduleId);
  if (!moduleItem) return false;

  const chapter = moduleItem.chapitres.find((c) => c.id === chapterId);
  if (!chapter) return false;

  const corrigesItems: CorrigeItem[] = (exercise.corriges || [])
    .filter((c) => c.url && c.url.trim() !== "")
    .map((c, idx) => ({
      id: "corr-" + Date.now() + "-" + idx,
      titre: c.titre.trim() || `Corrigé ${idx + 1}`,
      url: c.url.trim(),
      type: c.type || (c.url.includes("youtube.com") || c.url.includes("youtu.be") ? "video" : "pdf"),
    }));

  const newExercise: CourseExercise = {
    id: "td-" + Date.now(),
    titre: exercise.titre.trim(),
    sous: exercise.sous?.trim() || "",
    enonce: exercise.enonceUrl?.trim(),
    correction: corrigesItems.length > 0 ? corrigesItems[0].url : undefined, // Rétrocompatibilité
    corriges: corrigesItems,
    video: exercise.videoUrl?.trim(),
  };

  chapter.tds = [...(chapter.tds || []), newExercise];
  saveCoursesDB(data);

  // Synchronisation Cloud Supabase
  if (supabase) {
    supabase
      .from("exercises")
      .insert([
        {
          id: newExercise.id,
          chapter_id: chapterId,
          titre: newExercise.titre,
          sous: newExercise.sous || null,
          enonce_url: newExercise.enonce || null,
          video_url: newExercise.video || null,
        },
      ])
      .then(({ error }) => {
        if (error) console.error("Supabase insert exercise error:", error);
      });

    if (corrigesItems.length > 0) {
      const corrs = corrigesItems.map((c) => ({
        id: c.id,
        exercise_id: newExercise.id,
        titre: c.titre,
        url: c.url,
        type: c.type || "pdf",
      }));
      supabase
        .from("exercise_corrections")
        .insert(corrs)
        .then(({ error }) => {
          if (error) console.error("Supabase insert corrections error:", error);
        });
    }
  }

  return true;
}

// ── 3. Ajout d'une Fiche de Synthèse ──
export function addFicheToChapter(
  moduleId: string,
  chapterId: string,
  fiche: {
    titre: string;
    sous?: string;
    drivePdfUrl: string;
  }
): boolean {
  const data = getCoursesDB();
  const moduleItem = data.find((m) => m.id === moduleId);
  if (!moduleItem) return false;

  const chapter = moduleItem.chapitres.find((c) => c.id === chapterId);
  if (!chapter) return false;

  const newFiche: CourseFiche = {
    id: "fiche-" + Date.now(),
    titre: fiche.titre.trim(),
    sous: fiche.sous?.trim() || "Fiche de méthode & formulaire",
    url: fiche.drivePdfUrl.trim(),
    thumbnail: getDriveImageUrls(fiche.drivePdfUrl)[0],
  };

  chapter.fiches = [...(chapter.fiches || []), newFiche];
  saveCoursesDB(data);

  // Synchronisation Cloud Supabase
  if (supabase) {
    supabase
      .from("fiches")
      .insert([
        {
          id: newFiche.id,
          chapter_id: chapterId,
          titre: newFiche.titre,
          sous: newFiche.sous || null,
          url: newFiche.url,
        },
      ])
      .then(({ error }) => {
        if (error) console.error("Supabase insert fiche error:", error);
      });
  }

  return true;
}

// ── 4. IMPORTATION EN MASSE D'UN CHAPITRE ENTIER (BATCH MULTI-DOCS DRIVE) ──
export function addBatchChapter(
  moduleId: string,
  chapterData: {
    num: number;
    titre: string;
    description: string;
    badge?: string;
  },
  documents: BatchDocumentEntry[]
): boolean {
  const data = getCoursesDB();
  let moduleItem = data.find((m) => m.id === moduleId);

  if (!moduleItem) {
    // Si le module n'existe pas, on le crée
    moduleItem = {
      id: moduleId,
      titre: moduleId.toUpperCase(),
      icon: "📚",
      description: "Module de physique-chimie CPGE",
      chapitres: [],
    };
    data.push(moduleItem);
  }

  const chapterId = `${moduleId}-ch${Date.now()}`;
  const coursList: CourseSession[] = [];
  const tdsList: CourseExercise[] = [];
  const fichesList: CourseFiche[] = [];

  documents.forEach((doc, idx) => {
    if (!doc.titre || doc.titre.trim() === "") return;

    if (doc.type === "session") {
      coursList.push({
        id: `batch-sess-${Date.now()}-${idx}`,
        titre: doc.titre.trim(),
        sous: "Séance théorique & Replay",
        support: doc.driveSupportUrl?.trim(),
        video: doc.videoUrl?.trim(),
        thumbnail: doc.driveSupportUrl ? getDriveImageUrls(doc.driveSupportUrl)[0] : undefined,
      });
    } else if (doc.type === "td") {
      const corriges: CorrigeItem[] = [];
      if (doc.driveCorrigeUrl1 && doc.driveCorrigeUrl1.trim()) {
        corriges.push({
          id: `corr-1-${Date.now()}-${idx}`,
          titre: doc.corrige1Title?.trim() || "Corrigé officiel rédigé",
          url: doc.driveCorrigeUrl1.trim(),
          type: "pdf",
        });
      }
      if (doc.driveCorrigeUrl2 && doc.driveCorrigeUrl2.trim()) {
        corriges.push({
          id: `corr-2-${Date.now()}-${idx}`,
          titre: doc.corrige2Title?.trim() || "Corrigé méthode 2 / Alternative",
          url: doc.driveCorrigeUrl2.trim(),
          type: "pdf",
        });
      }

      tdsList.push({
        id: `batch-td-${Date.now()}-${idx}`,
        titre: doc.titre.trim(),
        sous: "Exercices d'application concours",
        enonce: doc.driveSupportUrl?.trim(),
        correction: corriges.length > 0 ? corriges[0].url : undefined,
        corriges,
        video: doc.videoUrl?.trim(),
      });
    } else if (doc.type === "fiche") {
      if (doc.driveSupportUrl && doc.driveSupportUrl.trim()) {
        fichesList.push({
          id: `batch-fiche-${Date.now()}-${idx}`,
          titre: doc.titre.trim(),
          sous: "Fiche formulaire & réflexes",
          url: doc.driveSupportUrl.trim(),
          thumbnail: getDriveImageUrls(doc.driveSupportUrl)[0],
        });
      }
    }
  });

  const newChapter: ChapitreItem = {
    id: chapterId,
    num: chapterData.num || moduleItem.chapitres.length + 1,
    titre: chapterData.titre.trim(),
    description: chapterData.description.trim(),
    badge: chapterData.badge?.trim() || "Nouveau Chapitre MP*",
    moduleName: moduleItem.titre,
    cours: coursList,
    tds: tdsList,
    fiches: fichesList,
  };

  moduleItem.chapitres.push(newChapter);
  saveCoursesDB(data);

  // Synchronisation Cloud Supabase pour le chapitre et ses ressources
  if (supabase) {
    // 1. Insertion Chapitre
    supabase
      .from("chapters")
      .insert([
        {
          id: chapterId,
          module_id: moduleId,
          num: newChapter.num,
          titre: newChapter.titre,
          description: newChapter.description,
          badge: newChapter.badge,
        },
      ])
      .then(({ error }) => {
        if (error) console.error("Supabase insert chapter error:", error);
      });

    // 2. Insertion Séances de cours
    if (coursList.length > 0) {
      const sRows = coursList.map((s) => ({
        id: s.id,
        chapter_id: chapterId,
        titre: s.titre,
        sous: s.sous || null,
        support_url: s.support || null,
        video_url: s.video || null,
      }));
      supabase
        .from("sessions")
        .insert(sRows)
        .then(({ error }) => {
          if (error) console.error("Supabase batch insert sessions error:", error);
        });
    }

    // 3. Insertion TDs et Corrigés multiples
    if (tdsList.length > 0) {
      const exRows = tdsList.map((td) => ({
        id: td.id,
        chapter_id: chapterId,
        titre: td.titre,
        sous: td.sous || null,
        enonce_url: td.enonce || null,
        video_url: td.video || null,
      }));
      supabase
        .from("exercises")
        .insert(exRows)
        .then(({ error }) => {
          if (error) console.error("Supabase batch insert exercises error:", error);
        });

      const allCorrs: { id: string; exercise_id: string; titre: string; url: string; type: string }[] = [];
      tdsList.forEach((td) => {
        if (td.corriges && td.corriges.length > 0) {
          td.corriges.forEach((c) => {
            allCorrs.push({
              id: c.id,
              exercise_id: td.id!,
              titre: c.titre,
              url: c.url,
              type: c.type || "pdf",
            });
          });
        }
      });

      if (allCorrs.length > 0) {
        supabase
          .from("exercise_corrections")
          .insert(allCorrs)
          .then(({ error }) => {
            if (error) console.error("Supabase batch insert corrections error:", error);
          });
      }
    }

    // 4. Insertion Fiches
    if (fichesList.length > 0) {
      const fRows = fichesList.map((f) => ({
        id: "fiche-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
        chapter_id: chapterId,
        titre: f.titre,
        sous: f.sous || null,
        url: f.url,
      }));
      supabase
        .from("fiches")
        .insert(fRows)
        .then(({ error }) => {
          if (error) console.error("Supabase batch insert fiches error:", error);
        });
    }
  }

  return true;
}

// ── 5. Suppression d'un élément ──
export function deleteExerciseFromChapter(
  moduleId: string,
  chapterId: string,
  exerciseId: string
): boolean {
  const data = getCoursesDB();
  const moduleItem = data.find((m) => m.id === moduleId);
  if (!moduleItem) return false;
  const chapter = moduleItem.chapitres.find((c) => c.id === chapterId);
  if (!chapter || !chapter.tds) return false;

  chapter.tds = chapter.tds.filter((td) => td.id !== exerciseId);
  saveCoursesDB(data);

  // Synchronisation Cloud Supabase
  if (supabase) {
    supabase
      .from("exercises")
      .delete()
      .eq("id", exerciseId)
      .then(({ error }) => {
        if (error) console.error("Supabase delete exercise error:", error);
      });
  }

  return true;
}

// ── 6. Suppression d'une séance vidéo / replay ──
export function deleteSessionFromChapter(
  moduleId: string,
  chapterId: string,
  sessionId: string
): boolean {
  const data = getCoursesDB();
  const moduleItem = data.find((m) => m.id === moduleId);
  if (!moduleItem) return false;
  const chapter = moduleItem.chapitres.find((c) => c.id === chapterId);
  if (!chapter || !chapter.cours) return false;

  chapter.cours = chapter.cours.filter((s) => s.id !== sessionId);
  saveCoursesDB(data);

  if (supabase) {
    supabase
      .from("sessions")
      .delete()
      .eq("id", sessionId)
      .then(({ error }) => {
        if (error) console.error("Supabase delete session error:", error);
      });
  }

  return true;
}

// ── 6b. Modification d'une séance (titre, sous-titre, lien vidéo, support PDF) ──
export function updateSessionInChapter(
  moduleId: string,
  chapterId: string,
  sessionId: string,
  updates: {
    titre?: string;
    sous?: string;
    videoUrl?: string;
    supportUrl?: string;
  }
): boolean {
  const data = getCoursesDB();
  const moduleItem = data.find((m) => m.id === moduleId);
  if (!moduleItem) return false;
  const chapter = moduleItem.chapitres.find((c) => c.id === chapterId);
  if (!chapter || !chapter.cours) return false;

  const session = chapter.cours.find((s) => s.id === sessionId);
  if (!session) return false;

  if (updates.titre !== undefined) session.titre = updates.titre.trim();
  if (updates.sous !== undefined) session.sous = updates.sous.trim();
  if (updates.videoUrl !== undefined) {
    session.video = updates.videoUrl.trim() || undefined;
    if (session.video) {
      session.thumbnail = getYoutubeThumbnail(session.video) || session.thumbnail;
    }
  }
  if (updates.supportUrl !== undefined) {
    session.support = updates.supportUrl.trim() || undefined;
    if (!session.video && session.support) {
      session.thumbnail = getDriveImageUrls(session.support)[0] || session.thumbnail;
    }
  }

  saveCoursesDB(data);

  if (supabase) {
    supabase
      .from("sessions")
      .update({
        titre: session.titre,
        sous: session.sous,
        video_url: session.video || null,
        support_url: session.support || null,
      })
      .eq("id", sessionId)
      .then(({ error }) => {
        if (error) console.error("Supabase update session error:", error);
      });
  }

  return true;
}

// ── 6c. Modification d'une fiche de synthèse (titre, sous-titre, lien Drive PDF) ──
export function updateFicheInChapter(
  moduleId: string,
  chapterId: string,
  ficheId: string,
  updates: {
    titre?: string;
    sous?: string;
    url?: string;
  }
): boolean {
  const data = getCoursesDB();
  const moduleItem = data.find((m) => m.id === moduleId);
  if (!moduleItem) return false;
  const chapter = moduleItem.chapitres.find((c) => c.id === chapterId);
  if (!chapter || !chapter.fiches) return false;

  const fiche = chapter.fiches.find((f) => f.id === ficheId || f.titre === ficheId);
  if (!fiche) return false;

  if (updates.titre !== undefined) fiche.titre = updates.titre.trim();
  if (updates.sous !== undefined) fiche.sous = updates.sous.trim();
  if (updates.url !== undefined) {
    fiche.url = updates.url.trim();
    fiche.thumbnail = getDriveImageUrls(fiche.url)[0];
  }

  saveCoursesDB(data);

  if (supabase) {
    supabase
      .from("fiches")
      .update({
        titre: fiche.titre,
        sous: fiche.sous,
        url: fiche.url,
      })
      .eq("id", fiche.id)
      .then(({ error }) => {
        if (error) console.error("Supabase update fiche error:", error);
      });
  }

  return true;
}

// ── 7. Suppression d'une fiche de synthèse ──
export function deleteFicheFromChapter(
  moduleId: string,
  chapterId: string,
  ficheTitleOrId: string
): boolean {
  const data = getCoursesDB();
  const moduleItem = data.find((m) => m.id === moduleId);
  if (!moduleItem) return false;
  const chapter = moduleItem.chapitres.find((c) => c.id === chapterId);
  if (!chapter || !chapter.fiches) return false;

  chapter.fiches = chapter.fiches.filter(
    (f) => f.id !== ficheTitleOrId && f.titre !== ficheTitleOrId
  );
  saveCoursesDB(data);

  if (supabase) {
    supabase
      .from("fiches")
      .delete()
      .or(`id.eq.${ficheTitleOrId},titre.eq.${ficheTitleOrId}`)
      .then(({ error }) => {
        if (error) console.error("Supabase delete fiche error:", error);
      });
  }

  return true;
}

// ── 8. Gestion des Modules : Ajouter, Rectifier, Supprimer ──
export function addModule(moduleData: {
  id?: string;
  titre: string;
  icon?: string;
  description?: string;
}): ModuleCoursBlock {
  const data = getCoursesDB();
  const safeId = moduleData.id?.trim() || "mod-" + Date.now();
  const newMod: ModuleCoursBlock = {
    id: safeId,
    titre: moduleData.titre.trim(),
    icon: moduleData.icon?.trim() || "📚",
    description: moduleData.description?.trim() || "Module de cours CPGE",
    chapitres: [],
  };
  data.push(newMod);
  saveCoursesDB(data);
  return newMod;
}

export function updateModule(
  moduleId: string,
  updates: { titre?: string; icon?: string; description?: string }
): boolean {
  const data = getCoursesDB();
  const index = data.findIndex((m) => m.id === moduleId);
  if (index === -1) return false;

  if (updates.titre !== undefined) data[index].titre = updates.titre.trim();
  if (updates.icon !== undefined) data[index].icon = updates.icon.trim();
  if (updates.description !== undefined) data[index].description = updates.description.trim();

  saveCoursesDB(data);
  return true;
}

export function deleteModule(moduleId: string): boolean {
  const data = getCoursesDB();
  const filtered = data.filter((m) => m.id !== moduleId);
  if (filtered.length === data.length) return false;

  saveCoursesDB(filtered);

  if (supabase) {
    supabase
      .from("chapters")
      .delete()
      .eq("module_id", moduleId)
      .then(({ error }) => {
        if (error) console.error("Supabase delete module chapters error:", error);
      });
  }

  return true;
}

// ── 9. Gestion des Sous-Chapitres : Ajouter, Rectifier, Supprimer ──
export function addChapterToModule(
  moduleId: string,
  chapterData: {
    id?: string;
    num?: number;
    titre: string;
    description: string;
    badge?: string;
  }
): ChapitreItem | null {
  const data = getCoursesDB();
  const moduleItem = data.find((m) => m.id === moduleId);
  if (!moduleItem) return null;

  const chapterId = chapterData.id || `${moduleId}-ch${Date.now()}`;
  const num = chapterData.num || (moduleItem.chapitres.length + 1);

  const newChapter: ChapitreItem = {
    id: chapterId,
    num,
    titre: chapterData.titre.trim(),
    description: chapterData.description.trim(),
    badge: chapterData.badge?.trim() || "Spé MP / MP*",
    moduleName: moduleItem.titre,
    cours: [],
    tds: [],
    fiches: [],
  };

  moduleItem.chapitres.push(newChapter);
  saveCoursesDB(data);

  if (supabase) {
    supabase
      .from("chapters")
      .insert([
        {
          id: chapterId,
          module_id: moduleId,
          num: newChapter.num,
          titre: newChapter.titre,
          description: newChapter.description,
          badge: newChapter.badge,
        },
      ])
      .then(({ error }) => {
        if (error) console.error("Supabase insert chapter error:", error);
      });
  }

  return newChapter;
}

export function updateChapter(
  moduleId: string,
  chapterId: string,
  updates: {
    num?: number;
    titre?: string;
    description?: string;
    badge?: string;
  }
): boolean {
  const data = getCoursesDB();
  const moduleItem = data.find((m) => m.id === moduleId);
  if (!moduleItem) return false;

  const chapter = moduleItem.chapitres.find((c) => c.id === chapterId);
  if (!chapter) return false;

  if (updates.num !== undefined) chapter.num = updates.num;
  if (updates.titre !== undefined) chapter.titre = updates.titre.trim();
  if (updates.description !== undefined) chapter.description = updates.description.trim();
  if (updates.badge !== undefined) chapter.badge = updates.badge.trim();

  saveCoursesDB(data);

  if (supabase) {
    supabase
      .from("chapters")
      .update({
        ...(updates.num !== undefined ? { num: updates.num } : {}),
        ...(updates.titre !== undefined ? { titre: updates.titre.trim() } : {}),
        ...(updates.description !== undefined ? { description: updates.description.trim() } : {}),
        ...(updates.badge !== undefined ? { badge: updates.badge.trim() } : {}),
      })
      .eq("id", chapterId)
      .then(({ error }) => {
        if (error) console.error("Supabase update chapter error:", error);
      });
  }

  return true;
}

export function deleteChapter(moduleId: string, chapterId: string): boolean {
  const data = getCoursesDB();
  const moduleItem = data.find((m) => m.id === moduleId);
  if (!moduleItem) return false;

  const initialLen = moduleItem.chapitres.length;
  moduleItem.chapitres = moduleItem.chapitres.filter((c) => c.id !== chapterId);
  if (moduleItem.chapitres.length === initialLen) return false;

  saveCoursesDB(data);

  if (supabase) {
    supabase
      .from("chapters")
      .delete()
      .eq("id", chapterId)
      .then(({ error }) => {
        if (error) console.error("Supabase delete chapter error:", error);
      });
  }

  return true;
}

// ── 6. Synchronisation ascendante depuis Supabase (Temps réel) ──
export async function syncCoursesFromSupabase(): Promise<ModuleCoursBlock[]> {
  if (!supabase) return getCoursesDB();
  try {
    const [chRes, sessRes, exRes, corrRes, fichesRes] = await Promise.all([
      supabase.from("chapters").select("*").order("num", { ascending: true }),
      supabase.from("sessions").select("*"),
      supabase.from("exercises").select("*"),
      supabase.from("exercise_corrections").select("*"),
      supabase.from("fiches").select("*"),
    ]);

    if (chRes.error || !chRes.data || chRes.data.length === 0) {
      return getCoursesDB();
    }

    const currentBlocks = getCoursesDB();
    const chaptersData = chRes.data;
    const sessionsData = sessRes.data || [];
    const exercisesData = exRes.data || [];
    const correctionsData = corrRes.data || [];
    const fichesData = fichesRes.data || [];

    const dbChapters: { [moduleId: string]: ChapitreItem[] } = {};

    chaptersData.forEach((ch) => {
      const mId = ch.module_id;
      if (!dbChapters[mId]) dbChapters[mId] = [];

      const chapterSessions: CourseSession[] = sessionsData
        .filter((s) => s.chapter_id === ch.id)
        .map((s) => ({
          id: s.id,
          titre: s.titre,
          sous: s.sous || "Séance de cours & Replay",
          support: s.support_url || undefined,
          video: s.video_url || undefined,
          thumbnail: s.support_url ? getDriveImageUrls(s.support_url)[0] : undefined,
        }));

      const chapterExercises: CourseExercise[] = exercisesData
        .filter((e) => e.chapter_id === ch.id)
        .map((e) => {
          const corrs: CorrigeItem[] = correctionsData
            .filter((c) => c.exercise_id === e.id)
            .map((c) => ({
              id: c.id,
              titre: c.titre,
              url: c.url,
              type: (c.type as "pdf" | "video") || "pdf",
            }));

          return {
            id: e.id,
            titre: e.titre,
            sous: e.sous || "",
            enonce: e.enonce_url || undefined,
            correction: corrs.length > 0 ? corrs[0].url : undefined,
            corriges: corrs,
            video: e.video_url || undefined,
          };
        });

      const chapterFiches: CourseFiche[] = fichesData
        .filter((f) => f.chapter_id === ch.id)
        .map((f) => ({
          titre: f.titre,
          sous: f.sous || "Fiche de méthode & formulaire",
          url: f.url,
          thumbnail: f.url ? getDriveImageUrls(f.url)[0] : undefined,
        }));

      dbChapters[mId].push({
        id: ch.id,
        num: ch.num,
        titre: ch.titre,
        badge: ch.badge || "Spé MP / MP*",
        description: ch.description || "",
        cours: chapterSessions,
        tds: chapterExercises,
        fiches: chapterFiches,
      });
    });

    const updated = currentBlocks.map((block) => {
      if (dbChapters[block.id]) {
        const mergedChapitres = [...block.chapitres];
        dbChapters[block.id].forEach((dbCh) => {
          const idx = mergedChapitres.findIndex((c) => c.id === dbCh.id);
          if (idx >= 0) {
            mergedChapitres[idx] = { ...mergedChapitres[idx], ...dbCh };
          } else {
            mergedChapitres.push(dbCh);
          }
        });
        return { ...block, chapitres: mergedChapitres };
      }
      return block;
    });

    saveCoursesDB(updated);
    return updated;
  } catch (err) {
    console.error("Error syncing courses from Supabase:", err);
    return getCoursesDB();
  }
}
