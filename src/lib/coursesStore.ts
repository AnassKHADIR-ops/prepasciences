"use client";

import {
  ModuleCoursBlock,
  ChapitreItem,
  CourseSession,
  CourseExercise,
  CourseFiche,
  CorrigeItem,
  BatchDocumentEntry,
  SessionSupportItem,
} from "@/types/courses";
import { PC_COURSES_DATA } from "@/components/eddams/pcCoursesData";
import { getDriveImageUrls, getYoutubeThumbnail } from "./driveUtils";
import { supabase } from "./supabase";

// IMPORTANT : On conserve strictement la clé v8 pour ne JAMAIS perdre les chapitres/séances
// déjà saisis localement par Pr. Eddams avant l'activation de la synchronisation Cloud.
const COURSES_STORAGE_KEY = "prepasciences_courses_db_v8";
const SYNC_META_CHAPTER_ID = "__prepasciences_sync_meta__";
const SYNC_META_MODULE_ID = "__meta__";

export type CloudSyncStatus = "idle" | "syncing" | "synced" | "offline" | "error";

export interface CloudSyncSnapshot {
  status: CloudSyncStatus;
  lastSyncedAt: string | null;
  lastError: string | null;
  pendingWrites: number;
  lastRecoveredCount: number;
}

interface CloudModuleMeta {
  id: string;
  titre: string;
  icon: string;
  description: string;
  niveau?: "sup" | "spe";
}

interface CloudChapterMeta {
  niveau?: "sup" | "spe";
  videoOrder?: string[];
  concoursVideoOrder?: string[];
  hiddenVideoIds?: string[];
  hiddenConcoursVideoIds?: string[];
}

interface CloudSessionMeta {
  supports?: SessionSupportItem[];
  isConcours?: boolean;
  badge?: string;
  thumbnail?: string;
  orderIndex?: number;
}

interface CoursesCloudMeta {
  version: number;
  updatedAt: string;
  customModules: Record<string, CloudModuleMeta>;
  deletedModuleIds: string[];
  deletedChapterIds: string[];
  deletedSessionIds: string[];
  deletedExerciseIds: string[];
  deletedFicheIds: string[];
  chapterMeta: Record<string, CloudChapterMeta>;
  sessionMeta: Record<string, CloudSessionMeta>;
}

function createEmptyCloudMeta(): CoursesCloudMeta {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    customModules: {},
    deletedModuleIds: [],
    deletedChapterIds: [],
    deletedSessionIds: [],
    deletedExerciseIds: [],
    deletedFicheIds: [],
    chapterMeta: {},
    sessionMeta: {},
  };
}

function parseCloudMeta(raw?: string | null): CoursesCloudMeta {
  const empty = createEmptyCloudMeta();
  if (!raw) return empty;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return empty;
    return {
      version: typeof parsed.version === "number" ? parsed.version : 1,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : empty.updatedAt,
      customModules: parsed.customModules && typeof parsed.customModules === "object" ? parsed.customModules : {},
      deletedModuleIds: Array.isArray(parsed.deletedModuleIds) ? parsed.deletedModuleIds : [],
      deletedChapterIds: Array.isArray(parsed.deletedChapterIds) ? parsed.deletedChapterIds : [],
      deletedSessionIds: Array.isArray(parsed.deletedSessionIds) ? parsed.deletedSessionIds : [],
      deletedExerciseIds: Array.isArray(parsed.deletedExerciseIds) ? parsed.deletedExerciseIds : [],
      deletedFicheIds: Array.isArray(parsed.deletedFicheIds) ? parsed.deletedFicheIds : [],
      chapterMeta: parsed.chapterMeta && typeof parsed.chapterMeta === "object" ? parsed.chapterMeta : {},
      sessionMeta: parsed.sessionMeta && typeof parsed.sessionMeta === "object" ? parsed.sessionMeta : {},
    };
  } catch {
    return empty;
  }
}

function cloneStaticCourses(): ModuleCoursBlock[] {
  return JSON.parse(JSON.stringify(PC_COURSES_DATA)) as ModuleCoursBlock[];
}

function addUnique(list: string[], id: string): string[] {
  return list.includes(id) ? list : [...list, id];
}

function removeItem(list: string[], id: string): string[] {
  return list.filter((x) => x !== id);
}

// ── État observable de synchronisation Cloud + File d'écriture séquentielle FIFO ──
let syncSnapshot: CloudSyncSnapshot = {
  status: supabase ? "idle" : "offline",
  lastSyncedAt: null,
  lastError: supabase ? null : "Variables Supabase non configurées sur cet environnement.",
  pendingWrites: 0,
  lastRecoveredCount: 0,
};

const syncListeners = new Set<(snap: CloudSyncSnapshot) => void>();

function emitSyncState(patch: Partial<CloudSyncSnapshot>): void {
  syncSnapshot = { ...syncSnapshot, ...patch };
  syncListeners.forEach((fn) => {
    try {
      fn(syncSnapshot);
    } catch {
      // Ignore listener errors
    }
  });
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabase);
}

export function getCloudSyncState(): CloudSyncSnapshot {
  return syncSnapshot;
}

export function subscribeCloudSyncState(listener: (snap: CloudSyncSnapshot) => void): () => void {
  syncListeners.add(listener);
  listener(syncSnapshot);
  return () => {
    syncListeners.delete(listener);
  };
}

// File d'exécution séquentielle pour éviter toute condition de concurrence entre
// création de chapitre, ajout de séance, réordonnancement et mise à jour des métadonnées.
let writeQueue: Promise<void> = Promise.resolve();

function enqueueCloudWrite(label: string, task: () => Promise<void>): Promise<boolean> {
  if (!supabase) {
    emitSyncState({
      status: "offline",
      lastError: "Connexion Supabase indisponible (modification enregistrée uniquement en local).",
    });
    return Promise.resolve(false);
  }

  emitSyncState({
    status: "syncing",
    pendingWrites: syncSnapshot.pendingWrites + 1,
    lastError: null,
  });

  let ok = false;
  const run = async () => {
    try {
      await task();
      ok = true;
      const remaining = Math.max(0, syncSnapshot.pendingWrites - 1);
      emitSyncState({
        status: remaining > 0 ? "syncing" : "synced",
        pendingWrites: remaining,
        lastSyncedAt: new Date().toISOString(),
        lastError: null,
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : String(err);
      console.error(`[Supabase Sync Error - ${label}]:`, err);
      const remaining = Math.max(0, syncSnapshot.pendingWrites - 1);
      emitSyncState({
        status: "error",
        pendingWrites: remaining,
        lastError: `${label} : ${message}`,
      });
    }
  };

  writeQueue = writeQueue.then(run, run);
  return writeQueue.then(() => ok);
}

// ── Helpers Bas Niveau Supabase (Toujours avec UPSERT + Garanties FK) ──
async function fetchCloudMetaFromSupabase(): Promise<CoursesCloudMeta> {
  if (!supabase) return createEmptyCloudMeta();
  const { data, error } = await supabase
    .from("chapters")
    .select("description")
    .eq("id", SYNC_META_CHAPTER_ID)
    .maybeSingle();
  if (error) {
    throw new Error(`Lecture métadonnées Cloud impossible: ${error.message}`);
  }
  return parseCloudMeta(data?.description);
}

async function mutateCloudMeta(mutator: (meta: CoursesCloudMeta) => void): Promise<void> {
  if (!supabase) return;
  const meta = await fetchCloudMetaFromSupabase();
  mutator(meta);
  meta.updatedAt = new Date().toISOString();

  const { error } = await supabase.from("chapters").upsert(
    [
      {
        id: SYNC_META_CHAPTER_ID,
        module_id: SYNC_META_MODULE_ID,
        num: -1,
        titre: "__sync_meta__",
        description: JSON.stringify(meta),
        badge: "system",
      },
    ],
    { onConflict: "id" }
  );
  if (error) {
    throw new Error(`Sauvegarde métadonnées Cloud impossible: ${error.message}`);
  }
}

async function ensureChapterInSupabase(moduleId: string, chapter: ChapitreItem): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("chapters").upsert(
    [
      {
        id: chapter.id,
        module_id: moduleId,
        num: typeof chapter.num === "number" && !Number.isNaN(chapter.num) ? chapter.num : 1,
        titre: chapter.titre || "Chapitre",
        description: chapter.description || "",
        badge: chapter.badge || "Spé MP / PSI / TSI",
      },
    ],
    { onConflict: "id" }
  );
  if (error) {
    throw new Error(`Impossible d'enregistrer le chapitre « ${chapter.titre} » : ${error.message}`);
  }
}

function findModuleAndChapter(
  data: ModuleCoursBlock[],
  moduleId: string,
  chapterId: string
): { moduleItem?: ModuleCoursBlock; chapter?: ChapitreItem } {
  const exactMod = data.find((m) => m.id === moduleId);
  const exactChap = exactMod?.chapitres.find((c) => c.id === chapterId);
  if (exactMod && exactChap) {
    return { moduleItem: exactMod, chapter: exactChap };
  }
  for (const m of data) {
    const c = m.chapitres.find((ch) => ch.id === chapterId);
    if (c) return { moduleItem: m, chapter: c };
  }
  return { moduleItem: exactMod, chapter: undefined };
}

function resolveSessionThumbnail(
  videoUrl?: string | null,
  supportUrl?: string | null,
  fallback?: string
): string | undefined {
  if (videoUrl && videoUrl.trim() !== "") {
    const yt = getYoutubeThumbnail(videoUrl);
    if (yt) return yt;
  }
  if (fallback && fallback.trim() !== "") return fallback;
  if (supportUrl && supportUrl.trim() !== "") {
    return getDriveImageUrls(supportUrl)[0];
  }
  return undefined;
}

// ── Stockage Local (Cache rapide navigateur) ──
export function getCoursesDB(): ModuleCoursBlock[] {
  if (typeof window === "undefined") return PC_COURSES_DATA;
  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(PC_COURSES_DATA));
      return cloneStaticCourses();
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : cloneStaticCourses();
  } catch {
    return cloneStaticCourses();
  }
}

export function saveCoursesDB(data: ModuleCoursBlock[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore quota errors
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
    supports?: SessionSupportItem[];
    isConcours?: boolean;
  }
): boolean {
  const data = getCoursesDB();
  const { moduleItem, chapter } = findModuleAndChapter(data, moduleId, chapterId);
  if (!moduleItem || !chapter) return false;

  const actualModuleId = moduleItem.id;
  const cleanSupports: SessionSupportItem[] = (session.supports || [])
    .filter((s) => s.url && s.url.trim() !== "")
    .map((s, idx) => ({
      id: s.id || `supp-${Date.now()}-${idx}`,
      titre: s.titre?.trim() || `Support PDF ${idx + 1}`,
      url: s.url.trim(),
    }));

  const primarySupport =
    cleanSupports.length > 0 ? cleanSupports[0].url : session.supportUrl?.trim() || undefined;

  const newSession: CourseSession = {
    id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    titre: session.titre.trim(),
    sous:
      session.sous?.trim() ||
      (session.isConcours ? "Extrait de Concours CPGE" : "Séance de cours & Replay"),
    video: session.videoUrl?.trim() || undefined,
    support: primarySupport,
    supports: cleanSupports,
    thumbnail: resolveSessionThumbnail(session.videoUrl, primarySupport),
    isConcours: session.isConcours,
  };

  chapter.cours = [newSession, ...(chapter.cours || [])];
  if (chapter.videoOrder && !session.isConcours) {
    chapter.videoOrder = [newSession.id!, ...chapter.videoOrder];
  } else if (chapter.concoursVideoOrder && session.isConcours) {
    chapter.concoursVideoOrder = [newSession.id!, ...chapter.concoursVideoOrder];
  }

  saveCoursesDB(data);

  const chapterSnapshot: ChapitreItem = { ...chapter };
  const sessionSnapshot: CourseSession = { ...newSession };
  const currentVideoOrder = chapter.videoOrder ? [...chapter.videoOrder] : undefined;
  const currentConcoursOrder = chapter.concoursVideoOrder ? [...chapter.concoursVideoOrder] : undefined;

  enqueueCloudWrite(`Ajout séance « ${sessionSnapshot.titre} »`, async () => {
    if (!supabase) return;
    await ensureChapterInSupabase(actualModuleId, chapterSnapshot);
    const { error } = await supabase.from("sessions").upsert(
      [
        {
          id: sessionSnapshot.id,
          chapter_id: chapterSnapshot.id,
          titre: sessionSnapshot.titre,
          sous: sessionSnapshot.sous || null,
          support_url: sessionSnapshot.support || null,
          video_url: sessionSnapshot.video || null,
        },
      ],
      { onConflict: "id" }
    );
    if (error) throw new Error(error.message);

    await mutateCloudMeta((meta) => {
      meta.deletedChapterIds = removeItem(meta.deletedChapterIds, chapterSnapshot.id);
      meta.deletedSessionIds = removeItem(meta.deletedSessionIds, sessionSnapshot.id!);
      meta.sessionMeta[sessionSnapshot.id!] = {
        supports: sessionSnapshot.supports && sessionSnapshot.supports.length > 0 ? sessionSnapshot.supports : undefined,
        isConcours: sessionSnapshot.isConcours || undefined,
        badge: sessionSnapshot.badge || undefined,
        thumbnail: sessionSnapshot.thumbnail || undefined,
      };
      meta.chapterMeta[chapterSnapshot.id] = {
        ...meta.chapterMeta[chapterSnapshot.id],
        niveau: chapterSnapshot.niveau || moduleItem.niveau,
        ...(currentVideoOrder ? { videoOrder: currentVideoOrder } : {}),
        ...(currentConcoursOrder ? { concoursVideoOrder: currentConcoursOrder } : {}),
      };
    });
  });

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
  const { moduleItem, chapter } = findModuleAndChapter(data, moduleId, chapterId);
  if (!moduleItem || !chapter) return false;

  const actualModuleId = moduleItem.id;
  const ts = Date.now();
  const corrigesItems: CorrigeItem[] = (exercise.corriges || [])
    .filter((c) => c.url && c.url.trim() !== "")
    .map((c, idx) => ({
      id: `corr-${ts}-${idx}-${Math.random().toString(36).substring(2, 5)}`,
      titre: c.titre.trim() || `Corrigé ${idx + 1}`,
      url: c.url.trim(),
      type: c.type || (c.url.includes("youtube.com") || c.url.includes("youtu.be") ? "video" : "pdf"),
    }));

  const newExercise: CourseExercise = {
    id: `td-${ts}-${Math.random().toString(36).substring(2, 5)}`,
    titre: exercise.titre.trim(),
    sous: exercise.sous?.trim() || "",
    enonce: exercise.enonceUrl?.trim() || undefined,
    correction: corrigesItems.length > 0 ? corrigesItems[0].url : undefined,
    corriges: corrigesItems,
    video: exercise.videoUrl?.trim() || undefined,
  };

  chapter.tds = [...(chapter.tds || []), newExercise];
  saveCoursesDB(data);

  const chapterSnapshot: ChapitreItem = { ...chapter };
  const exerciseSnapshot: CourseExercise = { ...newExercise };

  enqueueCloudWrite(`Ajout TD « ${exerciseSnapshot.titre} »`, async () => {
    if (!supabase) return;
    await ensureChapterInSupabase(actualModuleId, chapterSnapshot);
    const { error: exErr } = await supabase.from("exercises").upsert(
      [
        {
          id: exerciseSnapshot.id,
          chapter_id: chapterSnapshot.id,
          titre: exerciseSnapshot.titre,
          sous: exerciseSnapshot.sous || null,
          enonce_url: exerciseSnapshot.enonce || null,
          video_url: exerciseSnapshot.video || null,
        },
      ],
      { onConflict: "id" }
    );
    if (exErr) throw new Error(exErr.message);

    if (corrigesItems.length > 0) {
      const corrs = corrigesItems.map((c) => ({
        id: c.id,
        exercise_id: exerciseSnapshot.id,
        titre: c.titre,
        url: c.url,
        type: c.type || "pdf",
      }));
      const { error: cErr } = await supabase
        .from("exercise_corrections")
        .upsert(corrs, { onConflict: "id" });
      if (cErr) throw new Error(cErr.message);
    }

    await mutateCloudMeta((meta) => {
      meta.deletedChapterIds = removeItem(meta.deletedChapterIds, chapterSnapshot.id);
      meta.deletedExerciseIds = removeItem(meta.deletedExerciseIds, exerciseSnapshot.id!);
    });
  });

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
  const { moduleItem, chapter } = findModuleAndChapter(data, moduleId, chapterId);
  if (!moduleItem || !chapter) return false;

  const actualModuleId = moduleItem.id;
  const newFiche: CourseFiche = {
    id: `fiche-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    titre: fiche.titre.trim(),
    sous: fiche.sous?.trim() || "Fiche de méthode & formulaire",
    url: fiche.drivePdfUrl.trim(),
    thumbnail: getDriveImageUrls(fiche.drivePdfUrl)[0],
  };

  chapter.fiches = [...(chapter.fiches || []), newFiche];
  saveCoursesDB(data);

  const chapterSnapshot: ChapitreItem = { ...chapter };
  const ficheSnapshot: CourseFiche = { ...newFiche };

  enqueueCloudWrite(`Ajout fiche « ${ficheSnapshot.titre} »`, async () => {
    if (!supabase) return;
    await ensureChapterInSupabase(actualModuleId, chapterSnapshot);
    const { error } = await supabase.from("fiches").upsert(
      [
        {
          id: ficheSnapshot.id,
          chapter_id: chapterSnapshot.id,
          titre: ficheSnapshot.titre,
          sous: ficheSnapshot.sous || null,
          url: ficheSnapshot.url,
        },
      ],
      { onConflict: "id" }
    );
    if (error) throw new Error(error.message);

    await mutateCloudMeta((meta) => {
      meta.deletedChapterIds = removeItem(meta.deletedChapterIds, chapterSnapshot.id);
      meta.deletedFicheIds = removeItem(meta.deletedFicheIds, ficheSnapshot.id!);
    });
  });

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
  let createdNewModule = false;

  if (!moduleItem) {
    moduleItem = {
      id: moduleId,
      titre: moduleId.toUpperCase(),
      icon: "📚",
      description: "Module de physique-chimie CPGE",
      niveau: moduleId.includes("sup") ? "sup" : "spe",
      chapitres: [],
    };
    data.push(moduleItem);
    createdNewModule = true;
  }

  const ts = Date.now();
  const chapterId = `${moduleId}-ch${ts}`;
  const coursList: CourseSession[] = [];
  const tdsList: CourseExercise[] = [];
  const fichesList: CourseFiche[] = [];

  documents.forEach((doc, idx) => {
    if (!doc.titre || doc.titre.trim() === "") return;

    if (doc.type === "session") {
      coursList.push({
        id: `batch-sess-${ts}-${idx}`,
        titre: doc.titre.trim(),
        sous: "Séance théorique & Replay",
        support: doc.driveSupportUrl?.trim() || undefined,
        video: doc.videoUrl?.trim() || undefined,
        thumbnail: resolveSessionThumbnail(doc.videoUrl, doc.driveSupportUrl),
      });
    } else if (doc.type === "td") {
      const corriges: CorrigeItem[] = [];
      if (doc.driveCorrigeUrl1 && doc.driveCorrigeUrl1.trim()) {
        corriges.push({
          id: `corr-1-${ts}-${idx}`,
          titre: doc.corrige1Title?.trim() || "Corrigé officiel rédigé",
          url: doc.driveCorrigeUrl1.trim(),
          type: "pdf",
        });
      }
      if (doc.driveCorrigeUrl2 && doc.driveCorrigeUrl2.trim()) {
        corriges.push({
          id: `corr-2-${ts}-${idx}`,
          titre: doc.corrige2Title?.trim() || "Corrigé méthode 2 / Alternative",
          url: doc.driveCorrigeUrl2.trim(),
          type: "pdf",
        });
      }

      tdsList.push({
        id: `batch-td-${ts}-${idx}`,
        titre: doc.titre.trim(),
        sous: "Exercices d'application concours",
        enonce: doc.driveSupportUrl?.trim() || undefined,
        correction: corriges.length > 0 ? corriges[0].url : undefined,
        corriges,
        video: doc.videoUrl?.trim() || undefined,
      });
    } else if (doc.type === "fiche") {
      if (doc.driveSupportUrl && doc.driveSupportUrl.trim()) {
        fichesList.push({
          id: `batch-fiche-${ts}-${idx}`,
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
    moduleId,
    num: chapterData.num || moduleItem.chapitres.length + 1,
    titre: chapterData.titre.trim(),
    description: chapterData.description.trim(),
    badge: chapterData.badge?.trim() || "Nouveau Chapitre MP*",
    niveau: moduleItem.niveau,
    moduleName: moduleItem.titre,
    cours: coursList,
    tds: tdsList,
    fiches: fichesList,
  };

  moduleItem.chapitres.push(newChapter);
  saveCoursesDB(data);

  const moduleSnapshot = { ...moduleItem };

  // Synchronisation séquentielle garantie : Chapitre d'abord (await), puis enfants !
  enqueueCloudWrite(`Création groupée « ${newChapter.titre} »`, async () => {
    if (!supabase) return;
    await ensureChapterInSupabase(moduleId, newChapter);

    if (coursList.length > 0) {
      const sRows = coursList.map((s) => ({
        id: s.id,
        chapter_id: chapterId,
        titre: s.titre,
        sous: s.sous || null,
        support_url: s.support || null,
        video_url: s.video || null,
      }));
      const { error } = await supabase.from("sessions").upsert(sRows, { onConflict: "id" });
      if (error) throw new Error(error.message);
    }

    if (tdsList.length > 0) {
      const exRows = tdsList.map((td) => ({
        id: td.id,
        chapter_id: chapterId,
        titre: td.titre,
        sous: td.sous || null,
        enonce_url: td.enonce || null,
        video_url: td.video || null,
      }));
      const { error: exErr } = await supabase.from("exercises").upsert(exRows, { onConflict: "id" });
      if (exErr) throw new Error(exErr.message);

      const allCorrs: { id: string; exercise_id: string; titre: string; url: string; type: string }[] = [];
      tdsList.forEach((td) => {
        (td.corriges || []).forEach((c) => {
          allCorrs.push({
            id: c.id,
            exercise_id: td.id!,
            titre: c.titre,
            url: c.url,
            type: c.type || "pdf",
          });
        });
      });

      if (allCorrs.length > 0) {
        const { error: cErr } = await supabase
          .from("exercise_corrections")
          .upsert(allCorrs, { onConflict: "id" });
        if (cErr) throw new Error(cErr.message);
      }
    }

    if (fichesList.length > 0) {
      const fRows = fichesList.map((f) => ({
        id: f.id!,
        chapter_id: chapterId,
        titre: f.titre,
        sous: f.sous || null,
        url: f.url,
      }));
      const { error: fErr } = await supabase.from("fiches").upsert(fRows, { onConflict: "id" });
      if (fErr) throw new Error(fErr.message);
    }

    await mutateCloudMeta((meta) => {
      if (createdNewModule) {
        meta.customModules[moduleSnapshot.id] = {
          id: moduleSnapshot.id,
          titre: moduleSnapshot.titre,
          icon: moduleSnapshot.icon,
          description: moduleSnapshot.description,
          niveau: moduleSnapshot.niveau,
        };
      }
      meta.chapterMeta[chapterId] = {
        ...meta.chapterMeta[chapterId],
        niveau: newChapter.niveau,
        videoOrder: coursList.map((s) => s.id!).filter(Boolean),
      };
    });
  });

  return true;
}

// ── 5. Suppression d'un TD ──
export function deleteExerciseFromChapter(
  moduleId: string,
  chapterId: string,
  exerciseId: string
): boolean {
  const data = getCoursesDB();
  const { chapter } = findModuleAndChapter(data, moduleId, chapterId);
  if (!chapter || !chapter.tds) return false;

  chapter.tds = chapter.tds.filter((td) => td.id !== exerciseId);
  saveCoursesDB(data);

  enqueueCloudWrite("Suppression TD", async () => {
    if (!supabase) return;
    const { error } = await supabase.from("exercises").delete().eq("id", exerciseId);
    if (error) throw new Error(error.message);
    await mutateCloudMeta((meta) => {
      meta.deletedExerciseIds = addUnique(meta.deletedExerciseIds, exerciseId);
    });
  });

  return true;
}

// ── 6. Suppression d'une séance vidéo / replay (Personnalisée ou Catalogue Prépasciences) ──
export function deleteSessionFromChapter(
  moduleId: string,
  chapterId: string,
  sessionId: string
): boolean {
  const data = getCoursesDB();
  const { chapter } = findModuleAndChapter(data, moduleId, chapterId);
  if (!chapter) return false;

  if (chapter.cours) {
    chapter.cours = chapter.cours.filter((s) => s.id !== sessionId);
  }

  if (!chapter.hiddenVideoIds) chapter.hiddenVideoIds = [];
  if (!chapter.hiddenVideoIds.includes(sessionId)) {
    chapter.hiddenVideoIds.push(sessionId);
  }
  if (chapter.videoOrder) {
    chapter.videoOrder = chapter.videoOrder.filter((id) => id !== sessionId);
  }

  saveCoursesDB(data);

  const hiddenSnap = [...chapter.hiddenVideoIds];
  const orderSnap = chapter.videoOrder ? [...chapter.videoOrder] : undefined;

  enqueueCloudWrite("Suppression séance", async () => {
    if (!supabase) return;
    const { error } = await supabase.from("sessions").delete().eq("id", sessionId);
    if (error) throw new Error(error.message);
    await mutateCloudMeta((meta) => {
      meta.deletedSessionIds = addUnique(meta.deletedSessionIds, sessionId);
      delete meta.sessionMeta[sessionId];
      meta.chapterMeta[chapter.id] = {
        ...meta.chapterMeta[chapter.id],
        hiddenVideoIds: hiddenSnap,
        ...(orderSnap ? { videoOrder: orderSnap } : {}),
      };
    });
  });

  return true;
}

// ── 6a bis. Retrait d'une vidéo (Prépasciences catalogue ou personnalisée, cours ou concours) ──
export function removeVideoFromChapter(
  moduleId: string,
  chapterId: string,
  videoId: string,
  isConcours: boolean = false
): boolean {
  const data = getCoursesDB();
  const { chapter } = findModuleAndChapter(data, moduleId, chapterId);
  if (!chapter) return false;

  if (isConcours) {
    if (!chapter.hiddenConcoursVideoIds) chapter.hiddenConcoursVideoIds = [];
    if (!chapter.hiddenConcoursVideoIds.includes(videoId)) {
      chapter.hiddenConcoursVideoIds.push(videoId);
    }
    if (chapter.concoursVideoOrder) {
      chapter.concoursVideoOrder = chapter.concoursVideoOrder.filter((id) => id !== videoId);
    }
  } else {
    if (chapter.cours) {
      chapter.cours = chapter.cours.filter((s) => s.id !== videoId);
    }
    if (!chapter.hiddenVideoIds) chapter.hiddenVideoIds = [];
    if (!chapter.hiddenVideoIds.includes(videoId)) {
      chapter.hiddenVideoIds.push(videoId);
    }
    if (chapter.videoOrder) {
      chapter.videoOrder = chapter.videoOrder.filter((id) => id !== videoId);
    }
  }

  saveCoursesDB(data);

  const hiddenSnap = isConcours
    ? [...(chapter.hiddenConcoursVideoIds || [])]
    : [...(chapter.hiddenVideoIds || [])];
  const orderSnap = isConcours
    ? chapter.concoursVideoOrder
      ? [...chapter.concoursVideoOrder]
      : undefined
    : chapter.videoOrder
    ? [...chapter.videoOrder]
    : undefined;

  enqueueCloudWrite("Retrait vidéo", async () => {
    if (!supabase) return;
    if (!isConcours) {
      const { error } = await supabase.from("sessions").delete().eq("id", videoId);
      if (error) throw new Error(error.message);
    }
    await mutateCloudMeta((meta) => {
      if (!isConcours) {
        meta.deletedSessionIds = addUnique(meta.deletedSessionIds, videoId);
        delete meta.sessionMeta[videoId];
      }
      meta.chapterMeta[chapter.id] = {
        ...meta.chapterMeta[chapter.id],
        ...(isConcours
          ? {
              hiddenConcoursVideoIds: hiddenSnap,
              ...(orderSnap ? { concoursVideoOrder: orderSnap } : {}),
            }
          : {
              hiddenVideoIds: hiddenSnap,
              ...(orderSnap ? { videoOrder: orderSnap } : {}),
            }),
      };
    });
  });

  return true;
}

// ── 6a ter. Réordonnancement Drag & Drop des vidéos d'un chapitre ──
export function reorderChapterVideos(
  moduleId: string,
  chapterId: string,
  newOrder: string[],
  isConcours: boolean = false
): boolean {
  const data = getCoursesDB();
  const { chapter } = findModuleAndChapter(data, moduleId, chapterId);
  if (!chapter) return false;

  if (isConcours) {
    chapter.concoursVideoOrder = [...newOrder];
  } else {
    chapter.videoOrder = [...newOrder];
    if (chapter.cours && chapter.cours.length > 0) {
      const coursMap = new Map(chapter.cours.map((s) => [s.id || "", s]));
      const sortedCours: CourseSession[] = [];
      newOrder.forEach((id) => {
        const item = coursMap.get(id);
        if (item) sortedCours.push(item);
      });
      chapter.cours.forEach((s) => {
        if (!sortedCours.some((sc) => sc.id === s.id)) {
          sortedCours.push(s);
        }
      });
      chapter.cours = sortedCours;
    }
  }

  saveCoursesDB(data);

  const orderSnapshot = [...newOrder];
  enqueueCloudWrite("Réordonnancement vidéos", async () => {
    await mutateCloudMeta((meta) => {
      meta.chapterMeta[chapter.id] = {
        ...meta.chapterMeta[chapter.id],
        ...(isConcours ? { concoursVideoOrder: orderSnapshot } : { videoOrder: orderSnapshot }),
      };
    });
  });

  return true;
}

// ── 6a quater. Restauration des vidéos retirées du catalogue pour un chapitre ──
export function restoreChapterVideos(
  moduleId: string,
  chapterId: string,
  isConcours: boolean = false
): boolean {
  const data = getCoursesDB();
  const { chapter } = findModuleAndChapter(data, moduleId, chapterId);
  if (!chapter) return false;

  if (isConcours) {
    chapter.hiddenConcoursVideoIds = [];
    chapter.concoursVideoOrder = undefined;
  } else {
    chapter.hiddenVideoIds = [];
    chapter.videoOrder = undefined;
  }

  saveCoursesDB(data);

  enqueueCloudWrite("Restauration vidéos", async () => {
    await mutateCloudMeta((meta) => {
      const prev = meta.chapterMeta[chapter.id] || {};
      meta.chapterMeta[chapter.id] = isConcours
        ? { ...prev, hiddenConcoursVideoIds: [], concoursVideoOrder: undefined }
        : { ...prev, hiddenVideoIds: [], videoOrder: undefined };
    });
  });

  return true;
}

// ── 6a quinquies. Transfert d'une vidéo vers un autre module ou chapitre ──
export function transferVideoBetweenChapters(
  sourceModuleId: string,
  sourceChapterId: string,
  targetModuleId: string,
  targetChapterId: string,
  videoData: {
    id: string;
    titre: string;
    sous?: string;
    video: string;
    support?: string;
    supports?: SessionSupportItem[];
    thumbnail?: string;
    isCustom?: boolean;
    badge?: string;
  },
  insertAt: "start" | "end" | number = "end",
  targetIsConcours: boolean = false,
  sourceIsConcours: boolean = false
): boolean {
  const data = getCoursesDB();
  const { chapter: sourceChap } = findModuleAndChapter(data, sourceModuleId, sourceChapterId);
  const { moduleItem: targetMod, chapter: targetChap } = findModuleAndChapter(
    data,
    targetModuleId,
    targetChapterId
  );

  if (!targetMod || !targetChap) return false;

  if (sourceChap) {
    if (sourceIsConcours) {
      if (!sourceChap.hiddenConcoursVideoIds) sourceChap.hiddenConcoursVideoIds = [];
      if (!sourceChap.hiddenConcoursVideoIds.includes(videoData.id)) {
        sourceChap.hiddenConcoursVideoIds.push(videoData.id);
      }
      if (sourceChap.concoursVideoOrder) {
        sourceChap.concoursVideoOrder = sourceChap.concoursVideoOrder.filter(
          (id) => id !== videoData.id
        );
      }
    } else {
      if (!sourceChap.hiddenVideoIds) sourceChap.hiddenVideoIds = [];
      if (!sourceChap.hiddenVideoIds.includes(videoData.id)) {
        sourceChap.hiddenVideoIds.push(videoData.id);
      }
      if (sourceChap.videoOrder) {
        sourceChap.videoOrder = sourceChap.videoOrder.filter((id) => id !== videoData.id);
      }
    }

    if (sourceChap.cours) {
      sourceChap.cours = sourceChap.cours.filter((s) => s.id !== videoData.id);
    }
  }

  const newSessionId = `transferred-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newSession: CourseSession = {
    id: newSessionId,
    titre: videoData.titre.trim(),
    sous:
      videoData.sous?.trim() ||
      (targetIsConcours ? "Extrait de Concours CPGE" : "Séance de cours transférée"),
    video: videoData.video.trim(),
    support: videoData.support?.trim() || undefined,
    supports: videoData.supports,
    thumbnail: resolveSessionThumbnail(videoData.video, videoData.support, videoData.thumbnail),
    isConcours: targetIsConcours,
    badge: videoData.badge || (targetIsConcours ? "Concours CPGE" : "Séance transférée"),
  };

  if (!targetChap.cours) targetChap.cours = [];

  if (targetChap.hiddenVideoIds) {
    targetChap.hiddenVideoIds = targetChap.hiddenVideoIds.filter(
      (id) => id !== videoData.id && id !== newSessionId
    );
  }
  if (targetChap.hiddenConcoursVideoIds) {
    targetChap.hiddenConcoursVideoIds = targetChap.hiddenConcoursVideoIds.filter(
      (id) => id !== videoData.id && id !== newSessionId
    );
  }

  if (insertAt === "start" || insertAt === 0) {
    targetChap.cours = [newSession, ...targetChap.cours];
  } else if (typeof insertAt === "number" && insertAt > 0 && insertAt < targetChap.cours.length) {
    targetChap.cours.splice(insertAt, 0, newSession);
  } else {
    targetChap.cours.push(newSession);
  }

  if (targetIsConcours) {
    if (targetChap.concoursVideoOrder) {
      if (insertAt === "start" || insertAt === 0) {
        targetChap.concoursVideoOrder.unshift(newSessionId);
      } else if (typeof insertAt === "number") {
        targetChap.concoursVideoOrder.splice(insertAt, 0, newSessionId);
      } else {
        targetChap.concoursVideoOrder.push(newSessionId);
      }
    }
  } else if (targetChap.videoOrder) {
    if (insertAt === "start" || insertAt === 0) {
      targetChap.videoOrder.unshift(newSessionId);
    } else if (typeof insertAt === "number") {
      targetChap.videoOrder.splice(insertAt, 0, newSessionId);
    } else {
      targetChap.videoOrder.push(newSessionId);
    }
  }

  saveCoursesDB(data);

  const targetChapterSnap = { ...targetChap };
  const sourceChapterSnap = sourceChap ? { ...sourceChap } : null;

  enqueueCloudWrite(`Transfert vidéo « ${newSession.titre} »`, async () => {
    if (!supabase) return;
    await ensureChapterInSupabase(targetMod.id, targetChapterSnap);

    if (videoData.isCustom) {
      await supabase.from("sessions").delete().eq("id", videoData.id);
    }

    const { error } = await supabase.from("sessions").upsert(
      [
        {
          id: newSession.id,
          chapter_id: targetChapterSnap.id,
          titre: newSession.titre,
          sous: newSession.sous || null,
          support_url: newSession.support || null,
          video_url: newSession.video || null,
        },
      ],
      { onConflict: "id" }
    );
    if (error) throw new Error(error.message);

    await mutateCloudMeta((meta) => {
      if (videoData.isCustom) {
        meta.deletedSessionIds = addUnique(meta.deletedSessionIds, videoData.id);
        delete meta.sessionMeta[videoData.id];
      }
      meta.sessionMeta[newSessionId] = {
        supports: newSession.supports,
        isConcours: newSession.isConcours,
        badge: newSession.badge,
        thumbnail: newSession.thumbnail,
      };
      if (sourceChapterSnap) {
        meta.chapterMeta[sourceChapterSnap.id] = {
          ...meta.chapterMeta[sourceChapterSnap.id],
          hiddenVideoIds: sourceChapterSnap.hiddenVideoIds,
          hiddenConcoursVideoIds: sourceChapterSnap.hiddenConcoursVideoIds,
          videoOrder: sourceChapterSnap.videoOrder,
          concoursVideoOrder: sourceChapterSnap.concoursVideoOrder,
        };
      }
      meta.chapterMeta[targetChapterSnap.id] = {
        ...meta.chapterMeta[targetChapterSnap.id],
        hiddenVideoIds: targetChapterSnap.hiddenVideoIds,
        hiddenConcoursVideoIds: targetChapterSnap.hiddenConcoursVideoIds,
        videoOrder: targetChapterSnap.videoOrder,
        concoursVideoOrder: targetChapterSnap.concoursVideoOrder,
      };
    });
  });

  return true;
}

// ── 6b. Modification d'une vidéo / séance (titre, sous-titre, lien vidéo, fichiers Drive PDF) ──
export function updateSessionInChapter(
  moduleId: string,
  chapterId: string,
  sessionId: string,
  updates: {
    titre?: string;
    sous?: string;
    videoUrl?: string;
    supportUrl?: string;
    supports?: SessionSupportItem[];
    isConcours?: boolean;
  }
): boolean {
  const data = getCoursesDB();
  const { moduleItem, chapter } = findModuleAndChapter(data, moduleId, chapterId);
  if (!moduleItem || !chapter) return false;
  if (!chapter.cours) chapter.cours = [];

  const actualModuleId = moduleItem.id;
  const cleanSupports: SessionSupportItem[] = (updates.supports || [])
    .filter((s) => s.url && s.url.trim() !== "")
    .map((s, idx) => ({
      id: s.id || `supp-${Date.now()}-${idx}`,
      titre: s.titre?.trim() || `Support PDF ${idx + 1}`,
      url: s.url.trim(),
    }));

  const primarySupport =
    cleanSupports.length > 0 ? cleanSupports[0].url : updates.supportUrl?.trim() || undefined;

  const session = chapter.cours.find((s) => s.id === sessionId);

  if (session) {
    if (updates.titre !== undefined) session.titre = updates.titre.trim();
    if (updates.sous !== undefined) session.sous = updates.sous.trim();
    if (updates.videoUrl !== undefined) {
      session.video = updates.videoUrl.trim() || undefined;
      session.thumbnail = resolveSessionThumbnail(session.video, session.support, session.thumbnail);
    }
    if (primarySupport !== undefined) {
      session.support = primarySupport;
    }
    if (updates.supports !== undefined) {
      session.supports = cleanSupports;
    }
    if (updates.isConcours !== undefined) {
      session.isConcours = updates.isConcours;
    }

    saveCoursesDB(data);

    const chapterSnap = { ...chapter };
    const sessionSnap = { ...session };

    // UPSERT (et non update) pour garantir la synchronisation même si la séance était statique ou locale !
    enqueueCloudWrite(`Modification séance « ${sessionSnap.titre} »`, async () => {
      if (!supabase) return;
      await ensureChapterInSupabase(actualModuleId, chapterSnap);
      const { error } = await supabase.from("sessions").upsert(
        [
          {
            id: sessionId,
            chapter_id: chapterSnap.id,
            titre: sessionSnap.titre,
            sous: sessionSnap.sous || null,
            video_url: sessionSnap.video || null,
            support_url: sessionSnap.support || null,
          },
        ],
        { onConflict: "id" }
      );
      if (error) throw new Error(error.message);

      await mutateCloudMeta((meta) => {
        meta.sessionMeta[sessionId] = {
          supports: sessionSnap.supports && sessionSnap.supports.length > 0 ? sessionSnap.supports : undefined,
          isConcours: sessionSnap.isConcours || undefined,
          badge: sessionSnap.badge || undefined,
          thumbnail: sessionSnap.thumbnail || undefined,
        };
      });
    });
  } else {
    const isConcours = Boolean(updates.isConcours);
    if (isConcours) {
      if (!chapter.hiddenConcoursVideoIds) chapter.hiddenConcoursVideoIds = [];
      if (!chapter.hiddenConcoursVideoIds.includes(sessionId)) {
        chapter.hiddenConcoursVideoIds.push(sessionId);
      }
    } else {
      if (!chapter.hiddenVideoIds) chapter.hiddenVideoIds = [];
      if (!chapter.hiddenVideoIds.includes(sessionId)) {
        chapter.hiddenVideoIds.push(sessionId);
      }
    }

    const newSessionId = `custom-vid-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    const videoVal = updates.videoUrl?.trim() || undefined;
    const thumbnailVal = resolveSessionThumbnail(videoVal, primarySupport);

    const newSession: CourseSession = {
      id: newSessionId,
      titre: updates.titre?.trim() || "Vidéo sans titre",
      sous: updates.sous?.trim() || "",
      video: videoVal,
      support: primarySupport,
      supports: cleanSupports,
      thumbnail: thumbnailVal,
      isConcours,
    };

    chapter.cours = [newSession, ...chapter.cours];

    if (isConcours && chapter.concoursVideoOrder) {
      chapter.concoursVideoOrder = chapter.concoursVideoOrder.map((id) =>
        id === sessionId ? newSessionId : id
      );
    } else if (chapter.videoOrder) {
      chapter.videoOrder = chapter.videoOrder.map((id) =>
        id === sessionId ? newSessionId : id
      );
    }

    saveCoursesDB(data);

    const chapterSnap = { ...chapter };
    const newSessionSnap = { ...newSession };

    enqueueCloudWrite(`Personnalisation vidéo « ${newSessionSnap.titre} »`, async () => {
      if (!supabase) return;
      await ensureChapterInSupabase(actualModuleId, chapterSnap);
      const { error } = await supabase.from("sessions").upsert(
        [
          {
            id: newSessionSnap.id,
            chapter_id: chapterSnap.id,
            titre: newSessionSnap.titre,
            sous: newSessionSnap.sous || null,
            video_url: newSessionSnap.video || null,
            support_url: newSessionSnap.support || null,
          },
        ],
        { onConflict: "id" }
      );
      if (error) throw new Error(error.message);

      await mutateCloudMeta((meta) => {
        meta.sessionMeta[newSessionId] = {
          supports: newSessionSnap.supports && newSessionSnap.supports.length > 0 ? newSessionSnap.supports : undefined,
          isConcours: newSessionSnap.isConcours || undefined,
          thumbnail: newSessionSnap.thumbnail || undefined,
        };
        meta.chapterMeta[chapterSnap.id] = {
          ...meta.chapterMeta[chapterSnap.id],
          hiddenVideoIds: chapterSnap.hiddenVideoIds,
          hiddenConcoursVideoIds: chapterSnap.hiddenConcoursVideoIds,
          videoOrder: chapterSnap.videoOrder,
          concoursVideoOrder: chapterSnap.concoursVideoOrder,
        };
      });
    });
  }

  return true;
}

// ── 6c. Modification d'une fiche de synthèse ──
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
  const { moduleItem, chapter } = findModuleAndChapter(data, moduleId, chapterId);
  if (!moduleItem || !chapter || !chapter.fiches) return false;

  const fiche = chapter.fiches.find((f) => f.id === ficheId || f.titre === ficheId);
  if (!fiche) return false;

  if (!fiche.id) {
    fiche.id = `fiche-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
  }
  if (updates.titre !== undefined) fiche.titre = updates.titre.trim();
  if (updates.sous !== undefined) fiche.sous = updates.sous.trim();
  if (updates.url !== undefined) {
    fiche.url = updates.url.trim();
    fiche.thumbnail = getDriveImageUrls(fiche.url)[0];
  }

  saveCoursesDB(data);

  const chapterSnap = { ...chapter };
  const ficheSnap = { ...fiche };

  enqueueCloudWrite(`Modification fiche « ${ficheSnap.titre} »`, async () => {
    if (!supabase) return;
    await ensureChapterInSupabase(moduleItem.id, chapterSnap);
    const { error } = await supabase.from("fiches").upsert(
      [
        {
          id: ficheSnap.id!,
          chapter_id: chapterSnap.id,
          titre: ficheSnap.titre,
          sous: ficheSnap.sous || null,
          url: ficheSnap.url,
        },
      ],
      { onConflict: "id" }
    );
    if (error) throw new Error(error.message);
  });

  return true;
}

// ── 7. Suppression d'une fiche de synthèse ──
export function deleteFicheFromChapter(
  moduleId: string,
  chapterId: string,
  ficheTitleOrId: string
): boolean {
  const data = getCoursesDB();
  const { chapter } = findModuleAndChapter(data, moduleId, chapterId);
  if (!chapter || !chapter.fiches) return false;

  const matched = chapter.fiches.find(
    (f) => f.id === ficheTitleOrId || f.titre === ficheTitleOrId
  );
  chapter.fiches = chapter.fiches.filter(
    (f) => f.id !== ficheTitleOrId && f.titre !== ficheTitleOrId
  );
  saveCoursesDB(data);

  const targetId = matched?.id || ficheTitleOrId;
  enqueueCloudWrite("Suppression fiche", async () => {
    if (!supabase) return;
    if (matched?.id) {
      const { error } = await supabase.from("fiches").delete().eq("id", matched.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("fiches").delete().eq("titre", ficheTitleOrId);
      if (error) throw new Error(error.message);
    }
    await mutateCloudMeta((meta) => {
      meta.deletedFicheIds = addUnique(meta.deletedFicheIds, targetId);
      if (matched?.titre) {
        meta.deletedFicheIds = addUnique(meta.deletedFicheIds, matched.titre);
      }
    });
  });

  return true;
}

// ── 8. Gestion des Modules : Ajouter, Rectifier, Supprimer ──
export function addModule(moduleData: {
  id?: string;
  titre: string;
  icon?: string;
  description?: string;
  niveau?: "sup" | "spe";
}): ModuleCoursBlock {
  const data = getCoursesDB();
  const safeId = moduleData.id?.trim() || `mod-${Date.now()}`;
  const newMod: ModuleCoursBlock = {
    id: safeId,
    titre: moduleData.titre.trim(),
    icon: moduleData.icon?.trim() || "📚",
    description: moduleData.description?.trim() || "Module de cours CPGE",
    niveau: moduleData.niveau || "spe",
    chapitres: [],
  };
  data.push(newMod);
  saveCoursesDB(data);

  enqueueCloudWrite(`Création module « ${newMod.titre} »`, async () => {
    await mutateCloudMeta((meta) => {
      meta.deletedModuleIds = removeItem(meta.deletedModuleIds, newMod.id);
      meta.customModules[newMod.id] = {
        id: newMod.id,
        titre: newMod.titre,
        icon: newMod.icon,
        description: newMod.description,
        niveau: newMod.niveau,
      };
    });
  });

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

  const modSnap = { ...data[index] };
  enqueueCloudWrite(`Modification module « ${modSnap.titre} »`, async () => {
    await mutateCloudMeta((meta) => {
      meta.customModules[modSnap.id] = {
        id: modSnap.id,
        titre: modSnap.titre,
        icon: modSnap.icon,
        description: modSnap.description,
        niveau: modSnap.niveau,
      };
    });
  });

  return true;
}

export function deleteModule(moduleId: string): boolean {
  const data = getCoursesDB();
  const filtered = data.filter((m) => m.id !== moduleId);
  if (filtered.length === data.length) return false;

  saveCoursesDB(filtered);

  enqueueCloudWrite("Suppression module", async () => {
    if (!supabase) return;
    const { error } = await supabase.from("chapters").delete().eq("module_id", moduleId);
    if (error) throw new Error(error.message);
    await mutateCloudMeta((meta) => {
      meta.deletedModuleIds = addUnique(meta.deletedModuleIds, moduleId);
      delete meta.customModules[moduleId];
    });
  });

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
  const maxNum = moduleItem.chapitres.reduce((max, c) => Math.max(max, c.num || 0), 0);
  const num = chapterData.num || maxNum + 1;

  const newChapter: ChapitreItem = {
    id: chapterId,
    moduleId,
    num,
    titre: chapterData.titre.trim(),
    description: chapterData.description.trim(),
    badge: chapterData.badge?.trim() || "Spé MP / PSI / TSI",
    niveau: moduleItem.niveau,
    moduleName: moduleItem.titre,
    cours: [],
    tds: [],
    fiches: [],
  };

  moduleItem.chapitres.push(newChapter);
  saveCoursesDB(data);

  enqueueCloudWrite(`Création chapitre « ${newChapter.titre} »`, async () => {
    await ensureChapterInSupabase(moduleId, newChapter);
    await mutateCloudMeta((meta) => {
      meta.deletedChapterIds = removeItem(meta.deletedChapterIds, chapterId);
      meta.chapterMeta[chapterId] = {
        ...meta.chapterMeta[chapterId],
        niveau: newChapter.niveau,
      };
    });
  });

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
  const { moduleItem, chapter } = findModuleAndChapter(data, moduleId, chapterId);
  if (!moduleItem || !chapter) return false;

  if (updates.num !== undefined) chapter.num = updates.num;
  if (updates.titre !== undefined) chapter.titre = updates.titre.trim();
  if (updates.description !== undefined) chapter.description = updates.description.trim();
  if (updates.badge !== undefined) chapter.badge = updates.badge.trim();

  saveCoursesDB(data);

  const chapterSnap = { ...chapter };
  enqueueCloudWrite(`Modification chapitre « ${chapterSnap.titre} »`, async () => {
    await ensureChapterInSupabase(moduleItem.id, chapterSnap);
  });

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

  enqueueCloudWrite("Suppression chapitre", async () => {
    if (!supabase) return;
    const { error } = await supabase.from("chapters").delete().eq("id", chapterId);
    if (error) throw new Error(error.message);
    await mutateCloudMeta((meta) => {
      meta.deletedChapterIds = addUnique(meta.deletedChapterIds, chapterId);
      delete meta.chapterMeta[chapterId];
    });
  });

  return true;
}

// ── 10. PUBLICATION AUTOMATIQUE DES DONNÉES LOCALES NON SYNCHRONISÉES (RÉCUPÉRATION PR. EDDAMS) ──
// Détecte tout chapitre, séance, TD, fiche, module ou ordre vidéo créé dans le localStorage d'un
// professeur/admin avant la correction Cloud et les pousse dans Supabase sans jamais ressusciter
// ce qui a été supprimé (tombstones deleted*Ids).
export async function pushLocalCoursesToSupabase(): Promise<{
  pushedChapters: number;
  pushedSessions: number;
  pushedExercises: number;
  pushedFiches: number;
  error?: string;
}> {
  if (!supabase || typeof window === "undefined") {
    return { pushedChapters: 0, pushedSessions: 0, pushedExercises: 0, pushedFiches: 0 };
  }

  let pushedChapters = 0;
  let pushedSessions = 0;
  let pushedExercises = 0;
  let pushedFiches = 0;

  try {
    await writeQueue;
    emitSyncState({ status: "syncing", lastError: null });

    const localData = getCoursesDB();

    // Indexation du catalogue statique de référence
    const staticModuleMap = new Map<string, ModuleCoursBlock>();
    const staticChapterMap = new Map<string, ChapitreItem>();
    const staticSessionMap = new Map<string, CourseSession>();
    const staticExerciseMap = new Map<string, CourseExercise>();
    const staticFicheMap = new Map<string, CourseFiche>();

    PC_COURSES_DATA.forEach((m) => {
      staticModuleMap.set(m.id, m);
      (m.chapitres || []).forEach((c) => {
        staticChapterMap.set(c.id, c);
        (c.cours || []).forEach((s) => {
          if (s.id) staticSessionMap.set(s.id, s);
        });
        (c.tds || []).forEach((td) => {
          if (td.id) staticExerciseMap.set(td.id, td);
        });
        (c.fiches || []).forEach((f) => {
          if (f.id) staticFicheMap.set(f.id, f);
          staticFicheMap.set(f.titre, f);
        });
      });
    });

    // Lecture de l'état Cloud actuel
    const [chRes, sessRes, exRes, fichesRes] = await Promise.all([
      supabase.from("chapters").select("*"),
      supabase.from("sessions").select("*"),
      supabase.from("exercises").select("*"),
      supabase.from("fiches").select("*"),
    ]);

    if (chRes.error) throw new Error(chRes.error.message);

    const metaRow = (chRes.data || []).find((r) => r.id === SYNC_META_CHAPTER_ID);
    const cloudMeta = parseCloudMeta(metaRow?.description);

    const cloudChapterIds = new Set(
      (chRes.data || []).filter((c) => c.id !== SYNC_META_CHAPTER_ID).map((c) => c.id)
    );
    const cloudSessionIds = new Set((sessRes.data || []).map((s) => s.id));
    const cloudExerciseIds = new Set((exRes.data || []).map((e) => e.id));
    const cloudFicheIds = new Set((fichesRes.data || []).map((f) => f.id));

    const deletedModules = new Set(cloudMeta.deletedModuleIds);
    const deletedChapters = new Set(cloudMeta.deletedChapterIds);
    const deletedSessions = new Set(cloudMeta.deletedSessionIds);
    const deletedExercises = new Set(cloudMeta.deletedExerciseIds);
    const deletedFiches = new Set(cloudMeta.deletedFicheIds);

    let metaChanged = false;

    for (const mod of localData) {
      if (deletedModules.has(mod.id)) continue;

      const staticMod = staticModuleMap.get(mod.id);
      if (
        !staticMod ||
        staticMod.titre !== mod.titre ||
        staticMod.icon !== mod.icon ||
        staticMod.description !== mod.description
      ) {
        if (!cloudMeta.customModules[mod.id]) {
          cloudMeta.customModules[mod.id] = {
            id: mod.id,
            titre: mod.titre,
            icon: mod.icon,
            description: mod.description,
            niveau: mod.niveau,
          };
          metaChanged = true;
        }
      }

      for (const chap of mod.chapitres || []) {
        if (deletedChapters.has(chap.id)) continue;

        const staticChap = staticChapterMap.get(chap.id);
        const chapterModified =
          !staticChap ||
          staticChap.titre !== chap.titre ||
          staticChap.description !== chap.description ||
          staticChap.badge !== chap.badge ||
          staticChap.num !== chap.num;

        const unsyncedSessions = (chap.cours || [])
          .map((s, idx) => ({
            ...s,
            id: s.id || `rec-sess-${chap.id}-${idx}`,
          }))
          .filter((s) => {
            const sid = s.id;
            if (!sid || deletedSessions.has(sid) || cloudSessionIds.has(sid)) return false;
            const staticSess = staticSessionMap.get(sid);
            if (!staticSess) return true;
            return (
              staticSess.titre !== s.titre ||
              (staticSess.sous || "") !== (s.sous || "") ||
              (staticSess.video || "") !== (s.video || "") ||
              (staticSess.support || "") !== (s.support || "")
            );
          });

        const unsyncedExercises = (chap.tds || []).filter((td) => {
          const tid = td.id || "";
          if (!tid || deletedExercises.has(tid) || cloudExerciseIds.has(tid)) return false;
          return !staticExerciseMap.has(tid);
        });

        const unsyncedFiches = (chap.fiches || []).filter((f) => {
          const fid = f.id || "";
          if (deletedFiches.has(fid) || deletedFiches.has(f.titre)) return false;
          if (fid && cloudFicheIds.has(fid)) return false;
          return !staticFicheMap.has(fid || f.titre);
        });

        const hasLocalChapterMeta =
          (chap.videoOrder && chap.videoOrder.length > 0 && !cloudMeta.chapterMeta[chap.id]?.videoOrder) ||
          (chap.concoursVideoOrder &&
            chap.concoursVideoOrder.length > 0 &&
            !cloudMeta.chapterMeta[chap.id]?.concoursVideoOrder) ||
          (chap.hiddenVideoIds &&
            chap.hiddenVideoIds.length > 0 &&
            !cloudMeta.chapterMeta[chap.id]?.hiddenVideoIds) ||
          (chap.hiddenConcoursVideoIds &&
            chap.hiddenConcoursVideoIds.length > 0 &&
            !cloudMeta.chapterMeta[chap.id]?.hiddenConcoursVideoIds);

        const needsChapterUpsert =
          (!cloudChapterIds.has(chap.id) &&
            (chapterModified ||
              unsyncedSessions.length > 0 ||
              unsyncedExercises.length > 0 ||
              unsyncedFiches.length > 0)) ||
          (!staticChap && !cloudChapterIds.has(chap.id));

        if (needsChapterUpsert) {
          await ensureChapterInSupabase(mod.id, chap);
          cloudChapterIds.add(chap.id);
          if (!staticChap) pushedChapters++;
        }

        if (unsyncedSessions.length > 0) {
          const sRows = unsyncedSessions.map((s) => ({
            id: s.id!,
            chapter_id: chap.id,
            titre: s.titre,
            sous: s.sous || null,
            support_url: s.support || null,
            video_url: s.video || null,
          }));
          const { error } = await supabase.from("sessions").upsert(sRows, { onConflict: "id" });
          if (error) throw new Error(error.message);
          unsyncedSessions.forEach((s, idx) => {
            cloudSessionIds.add(s.id!);
            cloudMeta.sessionMeta[s.id!] = {
              supports: s.supports && s.supports.length > 0 ? s.supports : undefined,
              isConcours: s.isConcours || undefined,
              badge: s.badge || undefined,
              thumbnail: s.thumbnail || resolveSessionThumbnail(s.video, s.support),
              orderIndex: idx,
            };
          });
          // Conserver l'ordre exact des séances personnalisées du chapitre
          if (!cloudMeta.chapterMeta[chap.id]?.videoOrder) {
            cloudMeta.chapterMeta[chap.id] = {
              ...cloudMeta.chapterMeta[chap.id],
              niveau: chap.niveau || mod.niveau,
              videoOrder:
                chap.videoOrder && chap.videoOrder.length > 0
                  ? chap.videoOrder
                  : (chap.cours || []).map((s) => s.id!).filter(Boolean),
            };
          }
          pushedSessions += unsyncedSessions.length;
          metaChanged = true;
        }

        if (unsyncedExercises.length > 0) {
          const exRows = unsyncedExercises.map((td) => ({
            id: td.id!,
            chapter_id: chap.id,
            titre: td.titre,
            sous: td.sous || null,
            enonce_url: td.enonce || null,
            video_url: td.video || null,
          }));
          const { error: exErr } = await supabase
            .from("exercises")
            .upsert(exRows, { onConflict: "id" });
          if (exErr) throw new Error(exErr.message);

          const allCorrs: { id: string; exercise_id: string; titre: string; url: string; type: string }[] = [];
          unsyncedExercises.forEach((td) => {
            (td.corriges || []).forEach((c) => {
              allCorrs.push({
                id: c.id,
                exercise_id: td.id!,
                titre: c.titre,
                url: c.url,
                type: c.type || "pdf",
              });
            });
          });
          if (allCorrs.length > 0) {
            const { error: cErr } = await supabase
              .from("exercise_corrections")
              .upsert(allCorrs, { onConflict: "id" });
            if (cErr) throw new Error(cErr.message);
          }
          pushedExercises += unsyncedExercises.length;
        }

        if (unsyncedFiches.length > 0) {
          const fRows = unsyncedFiches.map((f, idx) => ({
            id: f.id || `fiche-rec-${Date.now()}-${idx}`,
            chapter_id: chap.id,
            titre: f.titre,
            sous: f.sous || null,
            url: f.url,
          }));
          const { error: fErr } = await supabase.from("fiches").upsert(fRows, { onConflict: "id" });
          if (fErr) throw new Error(fErr.message);
          pushedFiches += unsyncedFiches.length;
        }

        if (hasLocalChapterMeta) {
          cloudMeta.chapterMeta[chap.id] = {
            ...cloudMeta.chapterMeta[chap.id],
            niveau: chap.niveau || mod.niveau,
            ...(chap.videoOrder ? { videoOrder: chap.videoOrder } : {}),
            ...(chap.concoursVideoOrder ? { concoursVideoOrder: chap.concoursVideoOrder } : {}),
            ...(chap.hiddenVideoIds ? { hiddenVideoIds: chap.hiddenVideoIds } : {}),
            ...(chap.hiddenConcoursVideoIds
              ? { hiddenConcoursVideoIds: chap.hiddenConcoursVideoIds }
              : {}),
          };
          metaChanged = true;
        }
      }
    }

    if (metaChanged) {
      cloudMeta.updatedAt = new Date().toISOString();
      const { error: metaErr } = await supabase.from("chapters").upsert(
        [
          {
            id: SYNC_META_CHAPTER_ID,
            module_id: SYNC_META_MODULE_ID,
            num: -1,
            titre: "__sync_meta__",
            description: JSON.stringify(cloudMeta),
            badge: "system",
          },
        ],
        { onConflict: "id" }
      );
      if (metaErr) throw new Error(metaErr.message);
    }

    const totalRecovered = pushedChapters + pushedSessions + pushedExercises + pushedFiches;
    emitSyncState({
      status: "synced",
      lastSyncedAt: new Date().toISOString(),
      lastError: null,
      lastRecoveredCount: totalRecovered,
    });

    return { pushedChapters, pushedSessions, pushedExercises, pushedFiches };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("pushLocalCoursesToSupabase error:", err);
    emitSyncState({
      status: "error",
      lastError: `Publication Cloud échouée : ${msg}`,
    });
    return {
      pushedChapters,
      pushedSessions,
      pushedExercises,
      pushedFiches,
      error: msg,
    };
  }
}

// ── 11. SYNCHRONISATION DESCENDANTE DEPUIS SUPABASE (SOURCE DE VÉRITÉ PARTAGÉE) ──
export async function syncCoursesFromSupabase(): Promise<ModuleCoursBlock[]> {
  if (!supabase) {
    emitSyncState({
      status: "offline",
      lastError: "Supabase non configuré sur cet environnement.",
    });
    return getCoursesDB();
  }

  try {
    await writeQueue;
    const [chRes, sessRes, exRes, corrRes, fichesRes] = await Promise.all([
      supabase.from("chapters").select("*").order("num", { ascending: true }),
      supabase.from("sessions").select("*").order("created_at", { ascending: true }),
      supabase.from("exercises").select("*").order("created_at", { ascending: true }),
      supabase.from("exercise_corrections").select("*").order("created_at", { ascending: true }),
      supabase.from("fiches").select("*").order("created_at", { ascending: true }),
    ]);

    if (chRes.error) {
      throw new Error(chRes.error.message);
    }

    const rawChapters = chRes.data || [];
    const sessionsData = sessRes.data || [];
    const exercisesData = exRes.data || [];
    const correctionsData = corrRes.data || [];
    const fichesData = fichesRes.data || [];

    const metaRow = rawChapters.find((c) => c.id === SYNC_META_CHAPTER_ID);
    const cloudMeta = parseCloudMeta(metaRow?.description);

    const chaptersData = rawChapters.filter((c) => c.id !== SYNC_META_CHAPTER_ID);

    const deletedModuleSet = new Set(cloudMeta.deletedModuleIds);
    const deletedChapterSet = new Set(cloudMeta.deletedChapterIds);
    const deletedSessionSet = new Set(cloudMeta.deletedSessionIds);
    const deletedExerciseSet = new Set(cloudMeta.deletedExerciseIds);
    const deletedFicheSet = new Set(cloudMeta.deletedFicheIds);

    // 1. Partir du syllabus statique officiel (jamais du localStorage périmé !)
    const mergedModules: ModuleCoursBlock[] = cloneStaticCourses()
      .filter((m) => !deletedModuleSet.has(m.id))
      .map((m) => {
        const override = cloudMeta.customModules[m.id];
        return {
          ...m,
          ...(override
            ? {
                titre: override.titre,
                icon: override.icon,
                description: override.description,
                niveau: override.niveau || m.niveau,
              }
            : {}),
          chapitres: (m.chapitres || [])
            .filter((ch) => !deletedChapterSet.has(ch.id))
            .map((ch) => ({
              ...ch,
              moduleId: m.id,
              moduleName: override?.titre || m.titre,
              niveau: ch.niveau || m.niveau,
              cours: (ch.cours || []).filter((s) => !s.id || !deletedSessionSet.has(s.id)),
              tds: (ch.tds || []).filter((td) => !td.id || !deletedExerciseSet.has(td.id)),
              fiches: (ch.fiches || []).filter(
                (f) => !deletedFicheSet.has(f.id || "") && !deletedFicheSet.has(f.titre)
              ),
            })),
        };
      });

    // 2. Ajouter les modules personnalisés créés dans le Cloud
    Object.values(cloudMeta.customModules).forEach((cm) => {
      if (deletedModuleSet.has(cm.id)) return;
      if (!mergedModules.some((m) => m.id === cm.id)) {
        mergedModules.push({
          id: cm.id,
          titre: cm.titre,
          icon: cm.icon || "📚",
          description: cm.description || "Module de cours CPGE",
          niveau: cm.niveau || "spe",
          chapitres: [],
        });
      }
    });

    // 3. Regrouper les ressources Cloud par chapter_id
    const sessionsByChapter = new Map<string, CourseSession[]>();
    sessionsData.forEach((s) => {
      if (deletedSessionSet.has(s.id)) return;
      const sm = cloudMeta.sessionMeta[s.id] || {};
      const item: CourseSession = {
        id: s.id,
        titre: s.titre,
        sous: s.sous || "Séance de cours & Replay",
        support: s.support_url || undefined,
        supports: sm.supports,
        video: s.video_url || undefined,
        thumbnail: resolveSessionThumbnail(s.video_url, s.support_url, sm.thumbnail),
        isConcours: sm.isConcours,
        badge: sm.badge,
      };
      const arr = sessionsByChapter.get(s.chapter_id) || [];
      arr.push(item);
      sessionsByChapter.set(s.chapter_id, arr);
    });

    const exercisesByChapter = new Map<string, CourseExercise[]>();
    exercisesData.forEach((e) => {
      if (deletedExerciseSet.has(e.id)) return;
      const corrs: CorrigeItem[] = correctionsData
        .filter((c) => c.exercise_id === e.id)
        .map((c) => ({
          id: c.id,
          titre: c.titre,
          url: c.url,
          type: (c.type as "pdf" | "video") || "pdf",
        }));
      const item: CourseExercise = {
        id: e.id,
        titre: e.titre,
        sous: e.sous || "",
        enonce: e.enonce_url || undefined,
        correction: corrs.length > 0 ? corrs[0].url : undefined,
        corriges: corrs,
        video: e.video_url || undefined,
      };
      const arr = exercisesByChapter.get(e.chapter_id) || [];
      arr.push(item);
      exercisesByChapter.set(e.chapter_id, arr);
    });

    const fichesByChapter = new Map<string, CourseFiche[]>();
    fichesData.forEach((f) => {
      if (deletedFicheSet.has(f.id) || deletedFicheSet.has(f.titre)) return;
      const item: CourseFiche = {
        id: f.id,
        titre: f.titre,
        sous: f.sous || "Fiche de méthode & formulaire",
        url: f.url,
        thumbnail: f.url ? getDriveImageUrls(f.url)[0] : undefined,
      };
      const arr = fichesByChapter.get(f.chapter_id) || [];
      arr.push(item);
      fichesByChapter.set(f.chapter_id, arr);
    });

    // Helper de fusion sans écraser les éléments statiques existants
    const mergeById = <T extends { id?: string }>(baseList: T[], cloudList: T[]): T[] => {
      const result = [...baseList];
      cloudList.forEach((cloudItem) => {
        const idx = cloudItem.id ? result.findIndex((b) => b.id === cloudItem.id) : -1;
        if (idx >= 0) {
          result[idx] = { ...result[idx], ...cloudItem };
        } else {
          result.push(cloudItem);
        }
      });
      return result;
    };

    // 4. Fusionner les chapitres Supabase dans leurs modules cibles
    const dbChaptersByModule = new Map<string, typeof chaptersData>();
    chaptersData.forEach((ch) => {
      if (deletedChapterSet.has(ch.id)) return;
      const list = dbChaptersByModule.get(ch.module_id) || [];
      list.push(ch);
      dbChaptersByModule.set(ch.module_id, list);
    });

    const updated = mergedModules.map((block) => {
      const mergedChapitres = [...block.chapitres];
      const cloudChaps = dbChaptersByModule.get(block.id) || [];

      cloudChaps.forEach((ch) => {
        const cSessions = sessionsByChapter.get(ch.id) || [];
        const cExercises = exercisesByChapter.get(ch.id) || [];
        const cFiches = fichesByChapter.get(ch.id) || [];
        const chMeta = cloudMeta.chapterMeta[ch.id] || {};

        const idx = mergedChapitres.findIndex((c) => c.id === ch.id);
        if (idx >= 0) {
          const baseCh = mergedChapitres[idx];
          mergedChapitres[idx] = {
            ...baseCh,
            num: ch.num ?? baseCh.num,
            titre: ch.titre || baseCh.titre,
            description: ch.description !== null && ch.description !== undefined ? ch.description : baseCh.description,
            badge: ch.badge || baseCh.badge,
            moduleId: block.id,
            moduleName: block.titre,
            niveau: chMeta.niveau || baseCh.niveau || block.niveau,
            cours: mergeById(baseCh.cours || [], cSessions),
            tds: mergeById(baseCh.tds || [], cExercises),
            fiches: mergeById(baseCh.fiches || [], cFiches),
            ...(chMeta.videoOrder ? { videoOrder: chMeta.videoOrder } : {}),
            ...(chMeta.concoursVideoOrder ? { concoursVideoOrder: chMeta.concoursVideoOrder } : {}),
            ...(chMeta.hiddenVideoIds ? { hiddenVideoIds: chMeta.hiddenVideoIds } : {}),
            ...(chMeta.hiddenConcoursVideoIds
              ? { hiddenConcoursVideoIds: chMeta.hiddenConcoursVideoIds }
              : {}),
          };
        } else {
          mergedChapitres.push({
            id: ch.id,
            moduleId: block.id,
            moduleName: block.titre,
            niveau: chMeta.niveau || block.niveau,
            num: ch.num,
            titre: ch.titre,
            badge: ch.badge || "Spé MP / PSI / TSI",
            description: ch.description || "",
            cours: cSessions,
            tds: cExercises,
            fiches: cFiches,
            ...(chMeta.videoOrder ? { videoOrder: chMeta.videoOrder } : {}),
            ...(chMeta.concoursVideoOrder ? { concoursVideoOrder: chMeta.concoursVideoOrder } : {}),
            ...(chMeta.hiddenVideoIds ? { hiddenVideoIds: chMeta.hiddenVideoIds } : {}),
            ...(chMeta.hiddenConcoursVideoIds
              ? { hiddenConcoursVideoIds: chMeta.hiddenConcoursVideoIds }
              : {}),
          });
        }
      });

      // Appliquer aussi les métadonnées Cloud (videoOrder, hiddenVideoIds) aux chapitres statiques
      // qui n'ont pas encore de ligne dédiée dans `chapters`
      mergedChapitres.forEach((chap, i) => {
        const chMeta = cloudMeta.chapterMeta[chap.id];
        if (!chMeta) return;
        const nextChap = {
          ...chap,
          ...(chMeta.videoOrder ? { videoOrder: chMeta.videoOrder } : {}),
          ...(chMeta.concoursVideoOrder ? { concoursVideoOrder: chMeta.concoursVideoOrder } : {}),
          ...(chMeta.hiddenVideoIds ? { hiddenVideoIds: chMeta.hiddenVideoIds } : {}),
          ...(chMeta.hiddenConcoursVideoIds
            ? { hiddenConcoursVideoIds: chMeta.hiddenConcoursVideoIds }
            : {}),
        };
        if (nextChap.videoOrder && nextChap.cours && nextChap.cours.length > 1) {
          const orderIdx = new Map(nextChap.videoOrder.map((id, pos) => [id, pos]));
          nextChap.cours = [...nextChap.cours].sort((a, b) => {
            const pa = a.id && orderIdx.has(a.id) ? orderIdx.get(a.id)! : 9999;
            const pb = b.id && orderIdx.has(b.id) ? orderIdx.get(b.id)! : 9999;
            return pa - pb;
          });
        }
        mergedChapitres[i] = nextChap;
      });

      mergedChapitres.sort((a, b) => (a.num || 0) - (b.num || 0));
      return { ...block, chapitres: mergedChapitres };
    });

    saveCoursesDB(updated);
    emitSyncState({
      status: syncSnapshot.pendingWrites > 0 ? "syncing" : "synced",
      lastSyncedAt: new Date().toISOString(),
      lastError: null,
    });
    return updated;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Error syncing courses from Supabase:", err);
    emitSyncState({
      status: "error",
      lastError: `Erreur de synchronisation Cloud : ${msg}`,
    });
    return getCoursesDB();
  }
}
