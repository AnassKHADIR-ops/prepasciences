"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import {
  ModuleCoursBlock,
  BatchDocumentEntry,
  SessionSupportItem,
  ChapitreItem,
} from "@/types/courses";
import { PC_COURSES_DATA } from "@/components/eddams/pcCoursesData";
import {
  getCoursesDB,
  addSessionToChapter,
  updateSessionInChapter,
  deleteSessionFromChapter,
  addExerciseToChapter,
  deleteExerciseFromChapter,
  addFicheToChapter,
  updateFicheInChapter,
  deleteFicheFromChapter,
  addBatchChapter,
  removeVideoFromChapter,
  reorderChapterVideos,
  restoreChapterVideos,
  transferVideoBetweenChapters,
  addModule,
  updateModule,
  deleteModule,
  addChapterToModule,
  updateChapter,
  deleteChapter,
  syncCoursesFromSupabase,
  pushLocalCoursesToSupabase,
  getCloudSyncState,
  subscribeCloudSyncState,
  CloudSyncSnapshot,
} from "@/lib/coursesStore";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

export interface SyncWithCloudResult {
  pushedChapters: number;
  pushedSessions: number;
  pushedExercises: number;
  pushedFiches: number;
  error?: string;
}

interface CoursesContextType {
  courses: ModuleCoursBlock[];
  cloudSync: CloudSyncSnapshot;
  refreshCourses: () => void;
  syncWithCloud: (options?: { pushLocal?: boolean }) => Promise<SyncWithCloudResult>;
  createSession: (
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
  ) => boolean;
  updateSession: (
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
  ) => boolean;
  deleteSession: (moduleId: string, chapterId: string, sessionId: string) => boolean;
  removeVideo: (
    moduleId: string,
    chapterId: string,
    videoId: string,
    isConcours?: boolean
  ) => boolean;
  reorderVideos: (
    moduleId: string,
    chapterId: string,
    newOrder: string[],
    isConcours?: boolean
  ) => boolean;
  restoreVideos: (moduleId: string, chapterId: string, isConcours?: boolean) => boolean;
  transferVideo: (
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
    insertAt?: "start" | "end" | number,
    targetIsConcours?: boolean,
    sourceIsConcours?: boolean
  ) => boolean;
  createExercise: (
    moduleId: string,
    chapterId: string,
    exercise: {
      titre: string;
      sous?: string;
      enonceUrl?: string;
      corriges: { titre: string; url: string; type?: "pdf" | "video" }[];
      videoUrl?: string;
    }
  ) => boolean;
  deleteExercise: (moduleId: string, chapterId: string, exerciseId: string) => boolean;
  createFiche: (
    moduleId: string,
    chapterId: string,
    fiche: { titre: string; sous?: string; drivePdfUrl: string }
  ) => boolean;
  updateFiche: (
    moduleId: string,
    chapterId: string,
    ficheId: string,
    updates: { titre?: string; sous?: string; url?: string }
  ) => boolean;
  deleteFiche: (moduleId: string, chapterId: string, ficheTitleOrId: string) => boolean;
  createBatchChapter: (
    moduleId: string,
    chapterData: { num: number; titre: string; description: string; badge?: string },
    documents: BatchDocumentEntry[]
  ) => boolean;
  createModule: (moduleData: {
    id?: string;
    titre: string;
    icon?: string;
    description?: string;
    niveau?: "sup" | "spe";
  }) => boolean;
  editModule: (
    moduleId: string,
    updates: { titre?: string; icon?: string; description?: string }
  ) => boolean;
  removeModule: (moduleId: string) => boolean;
  createChapter: (
    moduleId: string,
    chapterData: {
      id?: string;
      num?: number;
      titre: string;
      description: string;
      badge?: string;
    }
  ) => ChapitreItem | null;
  editChapter: (
    moduleId: string,
    chapterId: string,
    updates: { num?: number; titre?: string; description?: string; badge?: string }
  ) => boolean;
  removeChapter: (moduleId: string, chapterId: string) => boolean;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export function CoursesProvider({ children }: { children: ReactNode }) {
  const { currentUser, isTeacher, isAdmin } = useAuth();
  const canPublishToCloud = isTeacher || isAdmin;

  // Initialisation identique SSR/Client (zéro erreur d'hydratation React), puis synchronisation Cloud immédiate dans useEffect
  const [courses, setCourses] = useState<ModuleCoursBlock[]>(PC_COURSES_DATA);
  const [cloudSync, setCloudSync] = useState<CloudSyncSnapshot>(() => getCloudSyncState());

  const lastPullTsRef = useRef<number>(0);
  const syncInFlightRef = useRef<boolean>(false);

  const refreshCourses = useCallback(() => {
    setCourses(getCoursesDB());
  }, []);

  // Abonnement à l'état observable de synchronisation Cloud
  useEffect(() => {
    return subscribeCloudSyncState((snap) => {
      setCloudSync(snap);
    });
  }, []);

  const syncWithCloud = useCallback(
    async (options?: { pushLocal?: boolean }): Promise<SyncWithCloudResult> => {
      if (syncInFlightRef.current) {
        return { pushedChapters: 0, pushedSessions: 0, pushedExercises: 0, pushedFiches: 0 };
      }
      syncInFlightRef.current = true;
      let pushRes: SyncWithCloudResult = {
        pushedChapters: 0,
        pushedSessions: 0,
        pushedExercises: 0,
        pushedFiches: 0,
      };
      try {
        const shouldPush = options?.pushLocal ?? canPublishToCloud;
        if (shouldPush && canPublishToCloud) {
          pushRes = await pushLocalCoursesToSupabase();
        }
        const data = await syncCoursesFromSupabase();
        lastPullTsRef.current = Date.now();
        if (data && data.length > 0) {
          setCourses(data);
        }
        return pushRes;
      } finally {
        syncInFlightRef.current = false;
      }
    },
    [canPublishToCloud]
  );

  // 1. Synchronisation initiale & à chaque changement de compte (Professeur -> auto-publication locale + pull ; Étudiant -> pull Cloud)
  useEffect(() => {
    syncWithCloud({ pushLocal: canPublishToCloud });
  }, [currentUser?.id, canPublishToCloud, syncWithCloud]);

  // 2. Re-synchronisation automatique au retour sur l'onglet (évite tout cache périmé chez les étudiants & admins)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const triggerRefresh = () => {
      if (document.visibilityState === "hidden") return;
      if (Date.now() - lastPullTsRef.current < 6000) return;
      syncWithCloud({ pushLocal: false });
    };

    window.addEventListener("focus", triggerRefresh);
    document.addEventListener("visibilitychange", triggerRefresh);
    return () => {
      window.removeEventListener("focus", triggerRefresh);
      document.removeEventListener("visibilitychange", triggerRefresh);
    };
  }, [syncWithCloud]);

  // 3. Abonnement Temps Réel Supabase (postgres_changes sur les tables de cours)
  useEffect(() => {
    if (!supabase) return;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const schedulePull = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        syncWithCloud({ pushLocal: false });
      }, 500);
    };

    const channel = supabase
      .channel("prepasciences-courses-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "chapters" }, schedulePull)
      .on("postgres_changes", { event: "*", schema: "public", table: "sessions" }, schedulePull)
      .on("postgres_changes", { event: "*", schema: "public", table: "exercises" }, schedulePull)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "exercise_corrections" },
        schedulePull
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "fiches" }, schedulePull)
      .subscribe();

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      supabase?.removeChannel(channel);
    };
  }, [syncWithCloud]);

  const createSession = (
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
  ) => {
    const res = addSessionToChapter(moduleId, chapterId, session);
    if (res) refreshCourses();
    return res;
  };

  const updateSession = (
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
  ) => {
    const res = updateSessionInChapter(moduleId, chapterId, sessionId, updates);
    if (res) refreshCourses();
    return res;
  };

  const deleteSession = (moduleId: string, chapterId: string, sessionId: string) => {
    const res = deleteSessionFromChapter(moduleId, chapterId, sessionId);
    if (res) refreshCourses();
    return res;
  };

  const removeVideo = (
    moduleId: string,
    chapterId: string,
    videoId: string,
    isConcours?: boolean
  ) => {
    const res = removeVideoFromChapter(moduleId, chapterId, videoId, isConcours);
    if (res) refreshCourses();
    return res;
  };

  const reorderVideos = (
    moduleId: string,
    chapterId: string,
    newOrder: string[],
    isConcours?: boolean
  ) => {
    const res = reorderChapterVideos(moduleId, chapterId, newOrder, isConcours);
    if (res) refreshCourses();
    return res;
  };

  const restoreVideos = (moduleId: string, chapterId: string, isConcours?: boolean) => {
    const res = restoreChapterVideos(moduleId, chapterId, isConcours);
    if (res) refreshCourses();
    return res;
  };

  const transferVideo = (
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
    insertAt?: "start" | "end" | number,
    targetIsConcours?: boolean,
    sourceIsConcours?: boolean
  ) => {
    const res = transferVideoBetweenChapters(
      sourceModuleId,
      sourceChapterId,
      targetModuleId,
      targetChapterId,
      videoData,
      insertAt,
      targetIsConcours,
      sourceIsConcours
    );
    if (res) refreshCourses();
    return res;
  };

  const createExercise = (
    moduleId: string,
    chapterId: string,
    exercise: {
      titre: string;
      sous?: string;
      enonceUrl?: string;
      corriges: { titre: string; url: string; type?: "pdf" | "video" }[];
      videoUrl?: string;
    }
  ) => {
    const res = addExerciseToChapter(moduleId, chapterId, exercise);
    if (res) refreshCourses();
    return res;
  };

  const deleteExercise = (moduleId: string, chapterId: string, exerciseId: string) => {
    const res = deleteExerciseFromChapter(moduleId, chapterId, exerciseId);
    if (res) refreshCourses();
    return res;
  };

  const createFiche = (
    moduleId: string,
    chapterId: string,
    fiche: { titre: string; sous?: string; drivePdfUrl: string }
  ) => {
    const res = addFicheToChapter(moduleId, chapterId, fiche);
    if (res) refreshCourses();
    return res;
  };

  const updateFiche = (
    moduleId: string,
    chapterId: string,
    ficheId: string,
    updates: { titre?: string; sous?: string; url?: string }
  ) => {
    const res = updateFicheInChapter(moduleId, chapterId, ficheId, updates);
    if (res) refreshCourses();
    return res;
  };

  const deleteFiche = (moduleId: string, chapterId: string, ficheTitleOrId: string) => {
    const res = deleteFicheFromChapter(moduleId, chapterId, ficheTitleOrId);
    if (res) refreshCourses();
    return res;
  };

  const createBatchChapter = (
    moduleId: string,
    chapterData: { num: number; titre: string; description: string; badge?: string },
    documents: BatchDocumentEntry[]
  ) => {
    const res = addBatchChapter(moduleId, chapterData, documents);
    if (res) refreshCourses();
    return res;
  };

  const createModule = (moduleData: {
    id?: string;
    titre: string;
    icon?: string;
    description?: string;
    niveau?: "sup" | "spe";
  }) => {
    const res = addModule(moduleData);
    if (res) refreshCourses();
    return Boolean(res);
  };

  const editModule = (
    moduleId: string,
    updates: { titre?: string; icon?: string; description?: string }
  ) => {
    const res = updateModule(moduleId, updates);
    if (res) refreshCourses();
    return res;
  };

  const removeModule = (moduleId: string) => {
    const res = deleteModule(moduleId);
    if (res) refreshCourses();
    return res;
  };

  const createChapter = (
    moduleId: string,
    chapterData: {
      id?: string;
      num?: number;
      titre: string;
      description: string;
      badge?: string;
    }
  ): ChapitreItem | null => {
    const res = addChapterToModule(moduleId, chapterData);
    if (res) refreshCourses();
    return res;
  };

  const editChapter = (
    moduleId: string,
    chapterId: string,
    updates: { num?: number; titre?: string; description?: string; badge?: string }
  ) => {
    const res = updateChapter(moduleId, chapterId, updates);
    if (res) refreshCourses();
    return res;
  };

  const removeChapter = (moduleId: string, chapterId: string) => {
    const res = deleteChapter(moduleId, chapterId);
    if (res) refreshCourses();
    return res;
  };

  return (
    <CoursesContext.Provider
      value={{
        courses,
        cloudSync,
        refreshCourses,
        syncWithCloud,
        createSession,
        updateSession,
        deleteSession,
        removeVideo,
        reorderVideos,
        restoreVideos,
        transferVideo,
        createExercise,
        deleteExercise,
        createFiche,
        updateFiche,
        deleteFiche,
        createBatchChapter,
        createModule,
        editModule,
        removeModule,
        createChapter,
        editChapter,
        removeChapter,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error("useCourses must be used within a CoursesProvider");
  }
  return context;
}
