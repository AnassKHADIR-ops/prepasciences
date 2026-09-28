"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { ModuleCoursBlock, BatchDocumentEntry } from "@/types/courses";
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
  addModule,
  updateModule,
  deleteModule,
  addChapterToModule,
  updateChapter,
  deleteChapter,
  syncCoursesFromSupabase,
} from "@/lib/coursesStore";

interface CoursesContextType {
  courses: ModuleCoursBlock[];
  refreshCourses: () => void;
  createSession: (
    moduleId: string,
    chapterId: string,
    session: { titre: string; sous?: string; videoUrl?: string; supportUrl?: string }
  ) => boolean;
  updateSession: (
    moduleId: string,
    chapterId: string,
    sessionId: string,
    updates: { titre?: string; sous?: string; videoUrl?: string; supportUrl?: string }
  ) => boolean;
  deleteSession: (moduleId: string, chapterId: string, sessionId: string) => boolean;
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
  // Gestion dynamique des modules
  createModule: (moduleData: { id?: string; titre: string; icon?: string; description?: string }) => boolean;
  editModule: (moduleId: string, updates: { titre?: string; icon?: string; description?: string }) => boolean;
  removeModule: (moduleId: string) => boolean;
  // Gestion dynamique des sous-chapitres
  createChapter: (moduleId: string, chapterData: { id?: string; num?: number; titre: string; description: string; badge?: string }) => boolean;
  editChapter: (moduleId: string, chapterId: string, updates: { num?: number; titre?: string; description?: string; badge?: string }) => boolean;
  removeChapter: (moduleId: string, chapterId: string) => boolean;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<ModuleCoursBlock[]>(() => getCoursesDB());

  const refreshCourses = useCallback(() => {
    setCourses(getCoursesDB());
  }, []);

  useEffect(() => {
    syncCoursesFromSupabase().then((data) => {
      if (data && data.length > 0) {
        setCourses(data);
      }
    });
  }, []);

  const createSession = (
    moduleId: string,
    chapterId: string,
    session: { titre: string; sous?: string; videoUrl?: string; supportUrl?: string }
  ) => {
    const res = addSessionToChapter(moduleId, chapterId, session);
    if (res) refreshCourses();
    return res;
  };

  const updateSession = (
    moduleId: string,
    chapterId: string,
    sessionId: string,
    updates: { titre?: string; sous?: string; videoUrl?: string; supportUrl?: string }
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

  const createModule = (moduleData: { id?: string; titre: string; icon?: string; description?: string }) => {
    const res = addModule(moduleData);
    if (res) refreshCourses();
    return Boolean(res);
  };

  const editModule = (moduleId: string, updates: { titre?: string; icon?: string; description?: string }) => {
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
    chapterData: { id?: string; num?: number; titre: string; description: string; badge?: string }
  ) => {
    const res = addChapterToModule(moduleId, chapterData);
    if (res) refreshCourses();
    return Boolean(res);
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
        refreshCourses,
        createSession,
        updateSession,
        deleteSession,
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
