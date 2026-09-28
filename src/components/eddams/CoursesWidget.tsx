"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { PC_COURSES_DATA } from "./pcCoursesData";
import { ChapitreItem, CourseSession, CourseExercise, CourseFiche, CorrigeItem } from "@/types/courses";
import {
  Search,
  X,
  ChevronDown,
  FileText,
  CheckCircle2,
  PlayCircle,
  PlusCircle,
  Trash2,
  Lock,
  Layers,
  BookOpen,
  Edit2,
  Atom,
  Check,
  Filter,
} from "lucide-react";
import { getDriveImageUrls, extractDriveFileId, getYoutubeThumbnailCandidates, getYoutubeThumbnail } from "@/lib/driveUtils";
import { useCourses } from "@/context/CoursesContext";
import { useAuth } from "@/context/AuthContext";

interface CoursesWidgetProps {
  onOpenPdf: (url: string, title: string) => void;
  onOpenVideo: (url: string, title: string) => void;
}

// ── 1. Carte Séance de cours & Replay Vidéo (Colonne Gauche) ──
function CourseSessionCard({
  seance,
  index,
  chapTitre,
  onOpenPdf,
  onOpenVideo,
  isTeacherView,
  onEdit,
  onDelete,
}: {
  seance: CourseSession;
  index: number;
  chapTitre: string;
  onOpenPdf: (url: string, title: string) => void;
  onOpenVideo: (url: string, title: string) => void;
  isTeacherView?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const titre = seance.titre || `Séance ${index + 1}`;
  const sous = seance.sous || "Théorie & Replay interactif";
  const videoUrl = seance.video || "";
  const supportUrl = seance.support || "";
  const hasVideo = Boolean(videoUrl && videoUrl.trim() !== "");
  const hasSupport = Boolean(supportUrl && supportUrl.trim() !== "");

  // Héritage intelligent de la miniature de la vidéo (Miniature perso -> YouTube maxres -> YouTube hq -> YouTube mq)
  const thumbnailCandidates = useMemo(() => {
    const list: string[] = [];
    if (seance.thumbnail && seance.thumbnail.trim()) {
      list.push(seance.thumbnail.trim());
    }
    if (videoUrl) {
      const ytCandidates = getYoutubeThumbnailCandidates(videoUrl);
      list.push(...ytCandidates);
    }
    return list;
  }, [seance.thumbnail, videoUrl]);

  const [thumbIdx, setThumbIdx] = useState(0);
  const [thumbFailed, setThumbFailed] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);

  const handleThumbError = () => {
    if (thumbIdx + 1 < thumbnailCandidates.length) {
      setThumbIdx((prev) => prev + 1);
    } else {
      setThumbFailed(true);
    }
  };

  const hasValidThumb = thumbnailCandidates.length > 0 && !thumbFailed;

  return (
    <article className="group relative bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-purple-300 dark:hover:border-purple-500/40 transition-all flex flex-col justify-between">
      {/* Boutons d'édition & suppression enseignant */}
      {isTeacherView && (
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 rounded-lg bg-purple-700/90 hover:bg-purple-800 text-white shadow-xs transition-all cursor-pointer"
              title="Modifier le lien vidéo ou le support PDF"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Supprimer la séance "${titre}" ?`)) onDelete();
              }}
              className="p-1.5 rounded-lg bg-red-600/90 hover:bg-red-700 text-white shadow-xs transition-all cursor-pointer"
              title="Supprimer cette séance"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Vignette Vidéo / Support avec Héritage Miniature */}
      {hasVideo ? (
        <div
          className="relative w-full aspect-video bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden cursor-pointer select-none"
          onClick={() => onOpenVideo(videoUrl, `${titre} — ${chapTitre}`)}
          title={`Regarder : ${titre}`}
        >
          {hasValidThumb ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={thumbnailCandidates[thumbIdx]}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                thumbLoaded ? "opacity-100" : "opacity-0"
              }`}
              src={thumbnailCandidates[thumbIdx]}
              alt={titre}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              loading="lazy"
              onLoad={() => setThumbLoaded(true)}
              onError={handleThumbError}
            />
          ) : (
            /* Fallback Visuel Haute Qualité CPGE (Zéro icône cassée) */
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a1024] via-[#121b36] to-[#1c1236] flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-2 shadow-inner">
                <Atom className="w-6 h-6 animate-pulse text-purple-400" />
              </div>
              <span className="text-xs font-bold text-white line-clamp-1 max-w-[85%] drop-shadow-xs">
                {titre}
              </span>
              <span className="text-[10px] text-purple-300/90 font-mono mt-0.5">
                Replay HD · Physique-Chimie CPGE
              </span>
            </div>
          )}

          {/* Calque Sombre & Badge & Bouton Play */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-between p-2.5 sm:p-3 pointer-events-none">
            <span className="self-end inline-flex items-center gap-1 text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-xs">
              <Lock className="w-2.5 h-2.5" />
              ESPACE MEMBRE
            </span>
            <div className="self-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-red-600/90 group-hover:bg-red-600 group-hover:scale-110 flex items-center justify-center text-white shadow-xl shadow-red-950/50 transition-all">
              <PlayCircle className="w-7 h-7" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-white/90 font-medium">
              <span className="truncate max-w-[75%] drop-shadow-xs">{chapTitre}</span>
              <span className="bg-black/60 px-1.5 py-0.5 rounded font-mono text-[9px] text-purple-200">Replay 4K</span>
            </div>
          </div>
        </div>
      ) : hasSupport ? (
        <div
          className="relative w-full aspect-video bg-gradient-to-br from-indigo-900 to-purple-950 flex flex-col items-center justify-center p-3 cursor-pointer text-indigo-100"
          onClick={() => onOpenPdf(supportUrl, `Support : ${titre} — ${chapTitre}`)}
        >
          <FileText className="w-7 h-7 mb-1 opacity-90 text-indigo-300" />
          <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-100">
            Support de Cours PDF
          </span>
        </div>
      ) : null}

      {/* Informations de la séance */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
            {titre}
          </h4>
          {sous && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
              {sous}
            </p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          {hasSupport && (
            <button
              type="button"
              onClick={() => onOpenPdf(supportUrl, `Support : ${titre} — ${chapTitre}`)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-500/30 transition-colors cursor-pointer"
            >
              <FileText className="w-3 h-3" />
              <span>Support PDF</span>
            </button>
          )}

          {hasVideo && (
            <button
              type="button"
              onClick={() => onOpenVideo(videoUrl, `${titre} — ${chapTitre}`)}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer ml-auto shadow-2xs"
            >
              <PlayCircle className="w-3 h-3" />
              <span>Regarder</span>
              <Lock className="w-2.5 h-2.5 ml-0.5 opacity-80" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// ── 2. Carte Fiche de Synthèse (Colonne Droite) ──
function CourseFicheCard({
  fiche,
  chapTitre,
  onOpenPdf,
  isTeacherView,
  onEdit,
  onDelete,
}: {
  fiche: CourseFiche;
  chapTitre: string;
  onOpenPdf: (url: string, title: string) => void;
  isTeacherView?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const { titre, sous, url, thumbnail } = fiche;
  const isActif = Boolean(url && url.trim() !== "");

  const srcs = useMemo(() => {
    if (thumbnail) return getDriveImageUrls(thumbnail);
    if (url && extractDriveFileId(url)) return getDriveImageUrls(url);
    return [];
  }, [thumbnail, url]);

  const [imgIdx, setImgIdx] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleImgError = () => {
    if (imgIdx + 1 < srcs.length) setImgIdx((p) => p + 1);
    else setImgFailed(true);
  };

  return (
    <article
      className="group relative bg-white dark:bg-[#090d18] border border-amber-200/80 dark:border-slate-800 rounded-xl p-2.5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500/40 transition-all cursor-pointer"
      onClick={() => isActif && onOpenPdf(url, `${titre} — ${chapTitre}`)}
    >
      {/* Boutons d'édition & suppression enseignant */}
      {isTeacherView && (
        <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 rounded-md bg-amber-600/90 hover:bg-amber-700 text-white shadow-xs transition-all cursor-pointer"
              title="Modifier cette fiche (titre, lien PDF Drive)"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Supprimer la fiche "${titre}" ?`)) onDelete();
              }}
              className="p-1 rounded-md bg-red-600/90 hover:bg-red-700 text-white shadow-xs transition-all cursor-pointer"
              title="Supprimer cette fiche"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Mini aperçu du document style A4 / feuille */}
      <div className="relative w-full aspect-[4/5] bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center p-1.5 mb-2">
        {srcs.length > 0 && !imgFailed ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className={`w-full h-full object-cover rounded shadow-2xs transition-opacity duration-300 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            src={srcs[imgIdx]}
            alt=""
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={handleImgError}
          />
        ) : (
          <div className="text-center p-2 text-amber-700 dark:text-amber-400">
            <FileText className="w-8 h-8 mx-auto mb-1 opacity-70" />
            <span className="text-[9px] font-bold uppercase tracking-wider block">Fiche Synthèse</span>
          </div>
        )}
      </div>

      {/* Titre & Sous-titre */}
      <div>
        <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
          {titre}
        </h5>
        {sous && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
            {sous}
          </p>
        )}
      </div>
    </article>
  );
}

// ── 3. Ligne TD & Devoirs Libres (En bas, Pleine Largeur) ──
function CourseExerciseLine({
  item,
  index,
  chapTitre,
  onOpenPdf,
  onOpenVideo,
  isTeacherView,
  onDelete,
}: {
  item: CourseExercise;
  index: number;
  chapTitre: string;
  onOpenPdf: (url: string, title: string) => void;
  onOpenVideo: (url: string, title: string) => void;
  isTeacherView?: boolean;
  onDelete?: () => void;
}) {
  const titre = item.titre || `Exercice ${index + 1}`;
  const sous = item.sous || "";
  const enonceUrl = item.enonce || "";
  const videoUrl = item.video || "";

  // Support de multiples corrigés rédigés / vidéos
  const corrigesList: CorrigeItem[] = useMemo(() => {
    if (item.corriges && item.corriges.length > 0) {
      return item.corriges.filter((c: CorrigeItem) => c.url && c.url.trim() !== "");
    }
    if (item.correction && item.correction.trim() !== "") {
      return [
        {
          id: "corr-legacy",
          titre: "Corrigé PDF",
          url: item.correction,
          type: "pdf" as const,
        },
      ];
    }
    return [];
  }, [item.corriges, item.correction]);

  return (
    <div className="bg-white dark:bg-[#0d1322] rounded-xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 hover:border-purple-300 dark:hover:border-purple-500/40 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Côté Gauche : Icône cahier + Titre + Sous-titre plein format */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20">
          <BookOpen className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white leading-snug">
            {titre}
          </h4>
          {sous && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {sous}
            </p>
          )}
        </div>
      </div>

      {/* Côté Droit : Boutons Énoncé, Corrigés Multiples & Vidéo */}
      <div className="flex items-center flex-wrap gap-2 shrink-0 self-end md:self-auto">
        {enonceUrl && (
          <button
            type="button"
            onClick={() => onOpenPdf(enonceUrl, `Énoncé : ${titre} — ${chapTitre}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Énoncé</span>
          </button>
        )}

        {/* Corrigés multiples */}
        {corrigesList.map((corr: CorrigeItem, cIdx: number) => (
          <button
            key={corr.id || cIdx}
            type="button"
            onClick={() =>
              corr.type === "video"
                ? onOpenVideo(corr.url, `${corr.titre} : ${titre} — ${chapTitre}`)
                : onOpenPdf(corr.url, `${corr.titre} : ${titre} — ${chapTitre}`)
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-500/30 transition-colors cursor-pointer shadow-2xs"
            title={corr.titre}
          >
            {corr.type === "video" ? (
              <PlayCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            )}
            <span>
              {corr.titre || (corrigesList.length > 1 ? `Corrigé ${cIdx + 1}` : "Correction")}
            </span>
            <Lock className="w-2.5 h-2.5 opacity-60 ml-0.5" />
          </button>
        ))}

        {videoUrl && (
          <button
            type="button"
            onClick={() => onOpenVideo(videoUrl, `Vidéo : ${titre} — ${chapTitre}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shadow-2xs"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Vidéo</span>
            <Lock className="w-2.5 h-2.5 ml-0.5 opacity-80" />
          </button>
        )}

        {/* Suppression en mode enseignant */}
        {isTeacherView && onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Supprimer le TD "${titre}" ?`)) onDelete();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer ml-1"
            title="Supprimer ce TD"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Composant Principal : CoursesWidget ──
export function CoursesWidget({ onOpenPdf, onOpenVideo }: CoursesWidgetProps) {
  const {
    courses,
    createSession,
    updateSession,
    deleteSession,
    createExercise,
    deleteExercise,
    createFiche,
    updateFiche,
    deleteFiche,
    createChapter,
    removeChapter,
    createModule,
    editModule,
    removeModule,
  } = useCourses();

  const { isTeacher, teacherViewMode } = useAuth();
  const isTeacherView = isTeacher && teacherViewMode === "teacher";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeModule, setActiveModule] = useState<string>("all");
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
  const moduleDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moduleDropdownRef.current && !moduleDropdownRef.current.contains(event.target as Node)) {
        setIsModuleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCoursesData = courses && courses.length > 0 ? courses : PC_COURSES_DATA;

  // Aplatir tous les chapitres avec le nom du module associé
  const allChapters = useMemo(() => {
    const list: (ChapitreItem & { moduleIcon: string; moduleTitre: string; moduleId: string })[] = [];
    activeCoursesData.forEach((module) => {
      module.chapitres.forEach((ch) => {
        list.push({
          ...ch,
          moduleIcon: module.icon,
          moduleTitre: module.titre,
          moduleId: module.id,
        });
      });
    });
    return list;
  }, [activeCoursesData]);

  // Informations sur le module actuellement filtré
  const currentModuleItem = useMemo(() => {
    if (activeModule === "all") {
      return {
        id: "all",
        titre: "Tous les modules",
        icon: "📚",
        count: allChapters.length,
        description: "Programme complet de Spé MP / MP*",
      };
    }
    const found = activeCoursesData.find((m) => m.id === activeModule);
    return found
      ? {
          id: found.id,
          titre: found.titre,
          icon: found.icon || "⚛️",
          count: found.chapitres?.length || 0,
          description: found.description || "Module CPGE",
        }
      : {
          id: "all",
          titre: "Tous les modules",
          icon: "📚",
          count: allChapters.length,
          description: "Programme complet de Spé MP / MP*",
        };
  }, [activeModule, activeCoursesData, allChapters.length]);

  // Par défaut : Chapitre 1 ouvert au chargement
  const [openChapterIds, setOpenChapterIds] = useState<Set<string>>(new Set(["em-ch1"]));

  const toggleChapter = (id: string) => {
    setOpenChapterIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Options dynamiques des modules pour les filtres
  const moduleFilterOptions = useMemo(() => {
    const options = [{ id: "all", label: "Tous les modules" }];
    activeCoursesData.forEach((m) => {
      options.push({
        id: m.id,
        label: `${m.icon || "📚"} ${m.titre}`,
      });
    });
    return options;
  }, [activeCoursesData]);

  // Filtrage par module et recherche textuelle
  const filteredChapters = useMemo(() => {
    return allChapters.filter((ch) => {
      const matchesMod = activeModule === "all" || ch.moduleId === activeModule;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        ch.titre.toLowerCase().includes(q) ||
        ch.description.toLowerCase().includes(q) ||
        ch.moduleTitre.toLowerCase().includes(q) ||
        String(ch.num).includes(q);
      return matchesMod && matchesSearch;
    });
  }, [allChapters, activeModule, searchQuery]);

  // ══════════════════════════════════════════════════════════════════════════
  // MODALS D'AJOUT DIRECT PAR L'ENSEIGNANT SUR LA PAGE
  // ══════════════════════════════════════════════════════════════════════════
  const [activeModal, setActiveModal] = useState<
    "session" | "edit_session" | "exercise" | "fiche" | "edit_fiche" | "chapter" | "create_module" | "edit_module" | null
  >(null);
  const [targetChapter, setTargetChapter] = useState<{ moduleId: string; chapterId: string; chapterTitle: string } | null>(null);

  // Formulaire modal Créer / Modifier Module
  const [newModTitle, setNewModTitle] = useState("");
  const [newModIcon, setNewModIcon] = useState("⚡");
  const [newModDesc, setNewModDesc] = useState("");
  const [editingModData, setEditingModData] = useState<{ id: string; titre: string; icon: string; description: string } | null>(null);

  // Formulaire modal Séance
  const [newSessTitle, setNewSessTitle] = useState("");
  const [newSessSous, setNewSessSous] = useState("Séance théorique & Replay interactif");
  const [newSessVideo, setNewSessVideo] = useState("");
  const [newSessSupport, setNewSessSupport] = useState("");

  // État Édition Séance Enseignant
  const [editingSession, setEditingSession] = useState<{
    moduleId: string;
    chapterId: string;
    chapterTitle: string;
    sessionId: string;
    titre: string;
    sous: string;
    video: string;
    support: string;
  } | null>(null);

  // État Édition Fiche Enseignant
  const [editingFiche, setEditingFiche] = useState<{
    moduleId: string;
    chapterId: string;
    chapterTitle: string;
    ficheId: string;
    titre: string;
    sous: string;
    url: string;
  } | null>(null);

  // Formulaire modal TD
  const [newTdTitle, setNewTdTitle] = useState("");
  const [newTdSous, setNewTdSous] = useState("Exercices d'application concours");
  const [newTdEnonce, setNewTdEnonce] = useState("");
  const [newTdVideo, setNewTdVideo] = useState("");
  const [newTdCorriges, setNewTdCorriges] = useState<Array<{ titre: string; url: string }>>([
    { titre: "Corrigé officiel rédigé", url: "" },
  ]);

  // Formulaire modal Fiche
  const [newFicheTitle, setNewFicheTitle] = useState("");
  const [newFicheSous, setNewFicheSous] = useState("L'essentiel du chapitre & Formulaire");
  const [newFicheUrl, setNewFicheUrl] = useState("");

  // Formulaire modal Chapitre
  const [newChTitle, setNewChTitle] = useState("");
  const [newChDesc, setNewChDesc] = useState("");
  const [newChBadge, setNewChBadge] = useState("Spé MP / MP*");
  const [newChModuleId, setNewChModuleId] = useState(activeCoursesData[0]?.id || "em");

  const openAddSession = (ch: { moduleId: string; id: string; titre: string }) => {
    setTargetChapter({ moduleId: ch.moduleId, chapterId: ch.id, chapterTitle: ch.titre });
    setNewSessTitle("");
    setNewSessVideo("");
    setNewSessSupport("");
    setActiveModal("session");
  };

  const openEditSession = (ch: { moduleId: string; id: string; titre: string }, se: CourseSession) => {
    setEditingSession({
      moduleId: ch.moduleId,
      chapterId: ch.id,
      chapterTitle: ch.titre,
      sessionId: se.id || "",
      titre: se.titre || "",
      sous: se.sous || "",
      video: se.video || "",
      support: se.support || "",
    });
    setActiveModal("edit_session");
  };

  const handleSaveEditSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession || !editingSession.titre.trim()) return;
    updateSession(editingSession.moduleId, editingSession.chapterId, editingSession.sessionId, {
      titre: editingSession.titre.trim(),
      sous: editingSession.sous.trim(),
      videoUrl: editingSession.video.trim(),
      supportUrl: editingSession.support.trim(),
    });
    setActiveModal(null);
    setEditingSession(null);
  };

  const openAddExercise = (ch: { moduleId: string; id: string; titre: string }) => {
    setTargetChapter({ moduleId: ch.moduleId, chapterId: ch.id, chapterTitle: ch.titre });
    setNewTdTitle("");
    setNewTdEnonce("");
    setNewTdVideo("");
    setNewTdCorriges([{ titre: "Corrigé officiel rédigé", url: "" }]);
    setActiveModal("exercise");
  };

  const openAddFiche = (ch: { moduleId: string; id: string; titre: string }) => {
    setTargetChapter({ moduleId: ch.moduleId, chapterId: ch.id, chapterTitle: ch.titre });
    setNewFicheTitle("");
    setNewFicheUrl("");
    setActiveModal("fiche");
  };

  const openEditFiche = (ch: { moduleId: string; id: string; titre: string }, f: CourseFiche) => {
    setEditingFiche({
      moduleId: ch.moduleId,
      chapterId: ch.id,
      chapterTitle: ch.titre,
      ficheId: f.id || f.titre,
      titre: f.titre || "",
      sous: f.sous || "",
      url: f.url || "",
    });
    setActiveModal("edit_fiche");
  };

  const handleSaveEditFiche = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFiche || !editingFiche.titre.trim()) return;
    updateFiche(editingFiche.moduleId, editingFiche.chapterId, editingFiche.ficheId, {
      titre: editingFiche.titre.trim(),
      sous: editingFiche.sous.trim(),
      url: editingFiche.url.trim(),
    });
    setActiveModal(null);
    setEditingFiche(null);
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetChapter || !newSessTitle.trim()) return;
    createSession(targetChapter.moduleId, targetChapter.chapterId, {
      titre: newSessTitle.trim(),
      sous: newSessSous.trim(),
      videoUrl: newSessVideo.trim() || undefined,
      supportUrl: newSessSupport.trim() || undefined,
    });
    setActiveModal(null);
  };

  const handleSaveExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetChapter || !newTdTitle.trim()) return;
    createExercise(targetChapter.moduleId, targetChapter.chapterId, {
      titre: newTdTitle.trim(),
      sous: newTdSous.trim(),
      enonceUrl: newTdEnonce.trim() || undefined,
      corriges: newTdCorriges
        .filter((c) => c.url.trim() !== "")
        .map((c) => ({ titre: c.titre.trim(), url: c.url.trim(), type: "pdf" })),
      videoUrl: newTdVideo.trim() || undefined,
    });
    setActiveModal(null);
  };

  const handleSaveFiche = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetChapter || !newFicheTitle.trim() || !newFicheUrl.trim()) return;
    createFiche(targetChapter.moduleId, targetChapter.chapterId, {
      titre: newFicheTitle.trim(),
      sous: newFicheSous.trim(),
      drivePdfUrl: newFicheUrl.trim(),
    });
    setActiveModal(null);
  };

  const handleSaveChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChTitle.trim()) return;
    createChapter(newChModuleId, {
      titre: newChTitle.trim(),
      description: newChDesc.trim(),
      badge: newChBadge.trim(),
    });
    setActiveModal(null);
    setNewChTitle("");
    setNewChDesc("");
  };

  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModTitle.trim()) return;
    const created = createModule({
      titre: newModTitle.trim(),
      icon: newModIcon.trim() || "⚡",
      description: newModDesc.trim() || "Module de cours CPGE",
    });
    if (created) {
      setActiveModule("all");
    }
    setActiveModal(null);
    setNewModTitle("");
    setNewModDesc("");
  };

  const handleUpdateModuleInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModData || !editingModData.titre.trim()) return;
    editModule(editingModData.id, {
      titre: editingModData.titre.trim(),
      icon: editingModData.icon.trim() || "⚡",
      description: editingModData.description.trim(),
    });
    setActiveModal(null);
    setEditingModData(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-4 font-sans">
      {/* Bandeau Mode Enseignant */}
      {isTeacherView && (
        <div className="mb-6 p-4 rounded-2xl bg-purple-950/60 border border-purple-500/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-black text-purple-200 uppercase tracking-wider">
              Mode Édition Enseignant Actif
            </span>
            <span className="text-[11px] text-purple-300/80 hidden sm:inline">
              · Vous pouvez ajouter ou supprimer des séances, TD et fiches directement sur chaque chapitre
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setNewModTitle("");
                setNewModIcon("⚡");
                setNewModDesc("");
                setActiveModal("create_module");
              }}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-700 hover:bg-purple-600 text-white flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Nouveau Module</span>
            </button>

            {activeModule !== "all" && (
              <button
                type="button"
                onClick={() => {
                  const currentMod = activeCoursesData.find((m) => m.id === activeModule);
                  if (currentMod) {
                    setEditingModData({
                      id: currentMod.id,
                      titre: currentMod.titre,
                      icon: currentMod.icon || "📚",
                      description: currentMod.description || "",
                    });
                    setActiveModal("edit_module");
                  }
                }}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/40 flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                title="Modifier le titre et l'émoticône de ce module"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>✏️ Modifier ce Module</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveModal("chapter")}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Chapitre</span>
            </button>
            <Link
              href="/dashboard-prof"
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dashboard Prof</span>
            </Link>
          </div>
        </div>
      )}

      {/* 1. En-tête Prestigieux Lumineux */}
      <div className="relative rounded-3xl bg-white/70 dark:bg-[#0d1322]/80 backdrop-blur-2xl border border-white/80 dark:border-purple-500/25 shadow-[0_20px_50px_rgba(124,58,237,0.06),0_1px_2px_rgba(255,255,255,0.95)_inset] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 sm:p-10 mb-5 sm:mb-6 text-center overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full bg-purple-300/30 dark:bg-purple-900/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-indigo-300/25 dark:bg-indigo-900/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-white/60 dark:bg-purple-950/20 blur-2xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white dark:via-purple-400/30 to-transparent" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-purple-800 dark:text-purple-300 bg-white/85 dark:bg-purple-950/60 backdrop-blur-md border border-purple-200/90 dark:border-purple-500/30 px-3.5 sm:px-4 py-1.5 rounded-full mb-3 sm:mb-4 shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Programme Physique-Chimie CPGE · Spé MP / MP*
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-2.5 sm:mb-3 tracking-tight">
            Cours & <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 dark:from-purple-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">Travaux Dirigés</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
            Syllabus officiel, séances de cours avec replays vidéo, séries d&apos;entraînement avec corrigés rédigés et fiches de synthèse.
          </p>

          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-semibold bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-purple-500/20 text-slate-700 dark:text-slate-300 shadow-2xs">
              Syllabus Spé MP / MP*
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-semibold bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-purple-500/20 text-slate-700 dark:text-slate-300 shadow-2xs">
              Séances & Fiches de Synthèse
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-semibold bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-purple-500/20 text-slate-700 dark:text-slate-300 shadow-2xs">
              Entraînement Concours
            </span>
          </div>
        </div>
      </div>

      {/* 2. Filtres par Module & Recherche */}
      <div className="bg-white/90 dark:bg-[#0d1322]/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-purple-500/25 p-4 sm:p-5 shadow-xs mb-6 space-y-3.5">
        {/* Ligne 1 : Liste Déroulante des Modules + Actions Déplier/Replier */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Menu Déroulant (Liste Déroulante) Ergonomique */}
          <div className="relative flex-1" ref={moduleDropdownRef}>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-xl">
                <button
                  type="button"
                  onClick={() => setIsModuleDropdownOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-purple-500/30 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/90 dark:hover:bg-slate-900 text-slate-900 dark:text-white transition-all cursor-pointer shadow-2xs text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0 p-1 rounded-lg bg-white dark:bg-slate-800 shadow-2xs border border-slate-200 dark:border-slate-700">
                      {currentModuleItem.icon}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-purple-700 dark:text-purple-300 font-bold">
                        Module de Cours CPGE
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold truncate">
                        {currentModuleItem.titre}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                      {currentModuleItem.count} chapitres
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isModuleDropdownOpen ? "rotate-180 text-purple-600 dark:text-purple-400" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Popover de la Liste Déroulante */}
                {isModuleDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full max-h-80 overflow-y-auto rounded-2xl border border-slate-200 dark:border-purple-500/40 bg-white dark:bg-[#0c1224] p-1.5 shadow-2xl z-40 divide-y divide-slate-100 dark:divide-slate-800/80 animate-fadeIn">
                    {/* Option : Tous les modules */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModule("all");
                        setIsModuleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        activeModule === "all"
                          ? "bg-purple-600 text-white font-bold shadow-xs"
                          : "hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg shrink-0">📚</span>
                        <div className="text-left min-w-0">
                          <div className="font-bold">Tous les modules</div>
                          <div className={`text-[10px] truncate ${activeModule === "all" ? "text-purple-100" : "text-slate-400"}`}>
                            Voir l'intégralité du syllabus officiel Spé MP / MP*
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                          activeModule === "all"
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        }`}>
                          {allChapters.length} chap.
                        </span>
                        {activeModule === "all" && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </button>

                    {/* Liste des modules */}
                    {activeCoursesData.map((m) => {
                      const isSelected = activeModule === m.id;
                      const chCount = m.chapitres?.length || 0;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setActiveModule(m.id);
                            setIsModuleDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-purple-600 text-white font-bold shadow-xs"
                              : "hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-lg shrink-0">{m.icon || "⚛️"}</span>
                            <div className="text-left min-w-0">
                              <div className="font-bold truncate">{m.titre}</div>
                              <div className={`text-[10px] truncate max-w-sm ${isSelected ? "text-purple-100" : "text-slate-400"}`}>
                                {m.description || "Module CPGE"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            }`}>
                              {chCount} chap.
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bouton rapide "Tous les modules" si un filtre est actif */}
              {activeModule !== "all" && (
                <button
                  type="button"
                  onClick={() => setActiveModule("all")}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  title="Réinitialiser et afficher tous les modules"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Tout afficher</span>
                </button>
              )}
            </div>
          </div>

          {/* Boutons d'action Déplier / Replier & Compteur */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-800/80">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              <strong className="text-slate-900 dark:text-white font-bold">{filteredChapters.length}</strong> {filteredChapters.length > 1 ? "chapitres affichés" : "chapitre affiché"}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setOpenChapterIds(new Set(filteredChapters.map((c) => c.id)))}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-950/60 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer"
              >
                Tout déplier
              </button>
              <button
                type="button"
                onClick={() => setOpenChapterIds(new Set())}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-950/60 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer"
              >
                Tout replier
              </button>
            </div>
          </div>
        </div>

        {/* Barre de Recherche */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            placeholder="Rechercher un chapitre, concept ou formule (ex: Maxwell, Navier-Stokes, Fourier, Pourbaix)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090d18] text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0d1322] focus:border-purple-600 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-600/15 transition-all outline-hidden shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Liste des Chapitres avec la Mise en Page Exacte du Site de Référence */}
      <div className="space-y-5">
        {filteredChapters.map((chapter) => {
          const isOpen = openChapterIds.has(chapter.id);
          const seances = chapter.cours || [];
          const tds = chapter.tds || [];
          const fiches = chapter.fiches || [];
          const videoCount = seances.filter((s) => s.video && s.video.trim() !== "").length;

          return (
            <div
              key={chapter.id}
              className={`bg-white dark:bg-[#0d1322] rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "border-purple-300 dark:border-purple-500/50 shadow-md dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                  : "border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {/* Header de Chapitre (Clic pour déplier/replier) */}
              <div
                onClick={() => toggleChapter(chapter.id)}
                className="flex items-center gap-4 p-5 sm:p-6 cursor-pointer select-none hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-colors"
              >
                {/* Numéro de Chapitre dans Cercle Foncé */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-lg shrink-0 transition-all ${
                    isOpen
                      ? "bg-purple-700 text-white shadow-md shadow-purple-700/25"
                      : "bg-slate-900 dark:bg-purple-950 text-white border border-purple-200/80 dark:border-purple-500/30"
                  }`}
                >
                  {chapter.num}
                </div>

                {/* Info Chapitre : Titre + Description + Badges de contenu */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {chapter.titre}
                  </h3>
                  {chapter.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {chapter.description}
                    </p>
                  )}

                  {/* Résumé du contenu sous forme de Badges (comme dans le site de référence) */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-500/20">
                      📘 {seances.length} cours
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-500/20">
                      📑 {fiches.length} fiches
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-500/20">
                      ✍️ {tds.length} TD/DL
                    </span>
                    {videoCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-500/20">
                        🎥 {videoCount} vidéos 🔒
                      </span>
                    )}
                  </div>
                </div>

                {/* Étiquette Module à Droite & Flèche */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-block text-xs font-bold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-500/30">
                    {chapter.moduleName || chapter.badge}
                  </span>

                  {/* Actions directes enseignant sur le chapitre */}
                  {isTeacherView && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Supprimer définitivement le chapitre "${chapter.titre}" ?`)) {
                          removeChapter(chapter.moduleId, chapter.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Supprimer ce chapitre entier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div
                    className={`w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Contenu Déplié : MISE EN PAGE EXACTE DU SITE DE RÉFÉRENCE */}
              {isOpen && (
                <div className="border-t border-slate-100 dark:border-slate-800/80 bg-[#f8faff] dark:bg-[#090d18]/60 p-5 sm:p-7 space-y-7">
                  {/* HAUT : 2 COLONNES (SÉANCES À GAUCHE, FICHES DE SYNTHÈSE À DROITE) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Colonne Gauche (7 ou 8 cols) : SÉANCES DE COURS & REPLAYS VIDÉO */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-3.5">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                            🎬 SÉANCES DE COURS & REPLAYS VIDÉO
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {seances.length}
                          </span>
                        </div>

                        {/* Bouton Enseignant pour ajouter directement une vidéo/séance */}
                        {isTeacherView && (
                          <button
                            type="button"
                            onClick={() => openAddSession(chapter)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer shadow-xs"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>+ Séance / Vidéo</span>
                          </button>
                        )}
                      </div>

                      {seances.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {seances.map((se, sIdx) => (
                            <CourseSessionCard
                              key={se.id || sIdx}
                              seance={se}
                              index={sIdx}
                              chapTitre={chapter.titre}
                              onOpenPdf={onOpenPdf}
                              onOpenVideo={onOpenVideo}
                              isTeacherView={isTeacherView}
                              onEdit={
                                isTeacherView
                                  ? () => openEditSession(chapter, se)
                                  : undefined
                              }
                              onDelete={
                                isTeacherView && se.id
                                  ? () => deleteSession(chapter.moduleId, chapter.id, se.id!)
                                  : undefined
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center rounded-xl bg-white/60 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 text-xs text-slate-500">
                          Aucune séance pour ce chapitre pour le moment.
                        </div>
                      )}
                    </div>

                    {/* Colonne Droite (5 ou 4 cols) : FICHES DE SYNTHÈSE DANS BOÎTIER ÉLÉGANT */}
                    <div className="lg:col-span-5 xl:col-span-4 bg-[#fdfaf5] dark:bg-[#111827] border border-[#f2e7d7] dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-[#ebdccd] dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                            📑 FICHES DE SYNTHÈSE
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-slate-700">
                            {fiches.length}
                          </span>
                        </div>

                        {/* Bouton Enseignant pour ajouter directement une fiche */}
                        {isTeacherView && (
                          <button
                            type="button"
                            onClick={() => openAddFiche(chapter)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-700 hover:bg-amber-800 text-white transition-colors cursor-pointer shadow-xs"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>+ Fiche</span>
                          </button>
                        )}
                      </div>

                      {fiches.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {fiches.map((f, fIdx) => (
                            <CourseFicheCard
                              key={f.id || fIdx}
                              fiche={f}
                              chapTitre={chapter.titre}
                              onOpenPdf={onOpenPdf}
                              isTeacherView={isTeacherView}
                              onEdit={
                                isTeacherView
                                  ? () => openEditFiche(chapter, f)
                                  : undefined
                              }
                              onDelete={
                                isTeacherView
                                  ? () => deleteFiche(chapter.moduleId, chapter.id, f.id || f.titre)
                                  : undefined
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="p-5 text-center rounded-xl bg-white/60 dark:bg-slate-900/40 border border-dashed border-amber-200 dark:border-slate-800 text-xs text-amber-700/70 dark:text-amber-300/70">
                          Aucune fiche de synthèse pour le moment.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BAS : PLEINE LARGEUR TD & DEVOIRS LIBRES (DL) / S'ENTRAÎNER */}
                  <div className="space-y-3.5 pt-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                          ✍️ TD & DEVOIRS LIBRES (DL) · FICHES D&apos;EXERCICES & ANNALES
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {tds.length}
                        </span>
                      </div>

                      {/* Bouton Enseignant pour ajouter directement un TD */}
                      {isTeacherView && (
                        <button
                          type="button"
                          onClick={() => openAddExercise(chapter)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>+ Ajouter un TD / Énoncé / Corrigé</span>
                        </button>
                      )}
                    </div>

                    {tds.length > 0 ? (
                      <div className="space-y-2.5">
                        {tds.map((td, tIdx) => (
                          <CourseExerciseLine
                            key={td.id || tIdx}
                            item={td}
                            index={tIdx}
                            chapTitre={chapter.titre}
                            onOpenPdf={onOpenPdf}
                            onOpenVideo={onOpenVideo}
                            isTeacherView={isTeacherView}
                            onDelete={
                              isTeacherView && td.id
                                ? () => deleteExercise(chapter.moduleId, chapter.id, td.id!)
                                : undefined
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center rounded-xl bg-white/60 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 text-xs text-slate-500">
                        Aucun TD pour ce chapitre pour le moment.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredChapters.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-[#0d1322] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            Aucun chapitre ne correspond à votre recherche.
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 1 : AJOUTER UNE SÉANCE VIDÉO DIRECTEMENT                     */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeModal === "session" && targetChapter && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-purple-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Ajouter une Séance de Cours / Vidéo
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Dans : {targetChapter.chapterTitle}
                </p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre de la séance *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Séance 2 : Dipôles électrostatiques"
                  value={newSessTitle}
                  onChange={(e) => setNewSessTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sous-titre / Description
                </label>
                <input
                  type="text"
                  placeholder="ex: Théorie et replay interactif"
                  value={newSessSous}
                  onChange={(e) => setNewSessSous(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lien Vidéo (YouTube ou Google Drive)
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... ou Drive"
                  value={newSessVideo}
                  onChange={(e) => setNewSessVideo(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lien Support de Cours (Google Drive PDF)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={newSessSupport}
                  onChange={(e) => setNewSessSupport(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                >
                  Enregistrer la séance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 1b : MODIFIER UNE SÉANCE VIDÉO & SUPPORTS PDFS                */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeModal === "edit_session" && editingSession && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-purple-300 dark:border-purple-500/40 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Modifier la Séance & Supports</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Dans : {editingSession.chapterTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setEditingSession(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSession} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre de la séance *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Séance 1 : Fondements et Définitions"
                  value={editingSession.titre}
                  onChange={(e) =>
                    setEditingSession((prev) => (prev ? { ...prev, titre: e.target.value } : null))
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sous-titre / Description
                </label>
                <input
                  type="text"
                  placeholder="ex: Théorie et replay interactif"
                  value={editingSession.sous}
                  onChange={(e) =>
                    setEditingSession((prev) => (prev ? { ...prev, sous: e.target.value } : null))
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Lien Vidéo (YouTube ou Google Drive)
                  </label>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                    ✦ Miniature auto-héritée
                  </span>
                </div>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... ou Drive"
                  value={editingSession.video}
                  onChange={(e) =>
                    setEditingSession((prev) => (prev ? { ...prev, video: e.target.value } : null))
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                />
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  Modifier ce lien met automatiquement à jour la miniature YouTube en haute résolution.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lien Support de Cours (Google Drive PDF)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={editingSession.support}
                  onChange={(e) =>
                    setEditingSession((prev) => (prev ? { ...prev, support: e.target.value } : null))
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    setEditingSession(null);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 2 : AJOUTER UN TD AVEC MULTI-CORRIGÉS DIRECTEMENT            */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeModal === "exercise" && targetChapter && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-purple-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Ajouter un TD (Énoncé & Corrigés)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Dans : {targetChapter.chapterTitle}
                </p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExercise} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre du TD *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: TD 2 · Exercice Type Concours : Cylindre infini"
                  value={newTdTitle}
                  onChange={(e) => setNewTdTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sous-titre / Référence concours
                </label>
                <input
                  type="text"
                  placeholder="ex: Concours Commun Mines-Ponts MP"
                  value={newTdSous}
                  onChange={(e) => setNewTdSous(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lien Google Drive de l&apos;Énoncé (PDF)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={newTdEnonce}
                  onChange={(e) => setNewTdEnonce(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              {/* Multi-corrigés */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Corrigés multiples (PDF Drive)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setNewTdCorriges((p) => [
                        ...p,
                        { titre: `Corrigé méthode ${p.length + 1}`, url: "" },
                      ])
                    }
                    className="text-xs font-bold text-purple-600 hover:text-purple-700"
                  >
                    + Ajouter une alternative de corrigé
                  </button>
                </div>

                {newTdCorriges.map((corr, cIdx) => (
                  <div key={cIdx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <input
                      type="text"
                      placeholder="Intitulé (ex: Corrigé officiel / Méthode directe)"
                      value={corr.titre}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewTdCorriges((p) => p.map((c, i) => (i === cIdx ? { ...c, titre: val } : c)));
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="Lien Drive du Corrigé PDF"
                        value={corr.url}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewTdCorriges((p) => p.map((c, i) => (i === cIdx ? { ...c, url: val } : c)));
                        }}
                        className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      {newTdCorriges.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setNewTdCorriges((p) => p.filter((_, i) => i !== cIdx))}
                          className="p-1.5 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lien Vidéo Résolution (YouTube / Drive - optionnel)
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newTdVideo}
                  onChange={(e) => setNewTdVideo(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Enregistrer le TD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 3 : AJOUTER UNE FICHE DE SYNTHÈSE DIRECTEMENT                */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeModal === "fiche" && targetChapter && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-amber-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Ajouter une Fiche de Synthèse
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Dans : {targetChapter.chapterTitle}
                </p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFiche} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre de la fiche *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Fiche de résumé : Théorème de Gauss & Dipôles"
                  value={newFicheTitle}
                  onChange={(e) => setNewFicheTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sous-titre / Descriptif
                </label>
                <input
                  type="text"
                  placeholder="ex: L'essentiel du cours & formulaire de réflexes"
                  value={newFicheSous}
                  onChange={(e) => setNewFicheSous(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lien Google Drive du PDF *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={newFicheUrl}
                  onChange={(e) => setNewFicheUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-700 hover:bg-amber-800 text-white shadow-xs"
                >
                  Enregistrer la fiche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 3b : MODIFIER UNE FICHE DE SYNTHÈSE DIRECTEMENT               */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeModal === "edit_fiche" && editingFiche && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-amber-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Modifier la Fiche de Synthèse</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Dans : {editingFiche.chapterTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setEditingFiche(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditFiche} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre de la fiche *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Fiche de résumé : Théorème de Gauss & Dipôles"
                  value={editingFiche.titre}
                  onChange={(e) =>
                    setEditingFiche((prev) => (prev ? { ...prev, titre: e.target.value } : null))
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sous-titre / Descriptif
                </label>
                <input
                  type="text"
                  placeholder="ex: L'essentiel du cours & formulaire de réflexes"
                  value={editingFiche.sous}
                  onChange={(e) =>
                    setEditingFiche((prev) => (prev ? { ...prev, sous: e.target.value } : null))
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lien Google Drive du PDF *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={editingFiche.url}
                  onChange={(e) =>
                    setEditingFiche((prev) => (prev ? { ...prev, url: e.target.value } : null))
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    setEditingFiche(null);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-700 hover:bg-amber-800 text-white shadow-xs cursor-pointer"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 4 : AJOUTER UN SOUS-CHAPITRE DIRECTEMENT                     */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeModal === "chapter" && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-purple-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ajouter un Nouveau Chapitre au Syllabus
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChapter} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Module parent *
                </label>
                <select
                  value={newChModuleId}
                  onChange={(e) => setNewChModuleId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  {activeCoursesData.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.icon || "📚"} {m.titre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre du Chapitre *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Ondes Électromagnétiques dans les Milieux Conducteurs"
                  value={newChTitle}
                  onChange={(e) => setNewChTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description pédagogique
                </label>
                <input
                  type="text"
                  placeholder="ex: Effet de peau, réflexion sous incidence normale, bilan de Poynting"
                  value={newChDesc}
                  onChange={(e) => setNewChDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Badge filière
                </label>
                <input
                  type="text"
                  placeholder="Spé MP / MP*"
                  value={newChBadge}
                  onChange={(e) => setNewChBadge(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                >
                  Créer le chapitre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal Créer un Module */}
      {activeModal === "create_module" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 rounded-2xl bg-purple-50 dark:bg-purple-900/30">{newModIcon || "⚡"}</span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Nouveau Module de Cours</h3>
                  <p className="text-xs text-slate-500">Ajoutez une nouvelle matière ou domaine physique</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Titre du Module *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Électromagnétisme & Induction"
                  value={newModTitle}
                  onChange={(e) => setNewModTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Choisir une émoticône / Icône ({newModIcon})
                </label>
                <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/50 mb-2">
                  {["⚡", "🧲", "🌊", "🔭", "⚛️", "🔥", "💡", "🧪", "🚀", "🪐", "🌀", "📡", "📐", "🔬", "🛰️", "⚙️", "🔋", "🧬", "📊", "🎯", "🧮", "🏷️", "📚", "💎"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewModIcon(emoji)}
                      className={`text-xl p-1.5 rounded-lg transition-transform hover:scale-125 ${
                        newModIcon === emoji ? "bg-purple-500/20 ring-2 ring-purple-500 scale-110" : "hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Ou saisissez un emoji personnalisé..."
                  value={newModIcon}
                  onChange={(e) => setNewModIcon(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description succincte
                </label>
                <input
                  type="text"
                  placeholder="ex: Ondes électromagnétiques, équations de Maxwell, milieux diélectriques"
                  value={newModDesc}
                  onChange={(e) => setNewModDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                >
                  Créer le module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal Modifier le Module Actif */}
      {activeModal === "edit_module" && editingModData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 rounded-2xl bg-amber-50 dark:bg-amber-900/30">{editingModData.icon || "⚡"}</span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Rectifier le Module</h3>
                  <p className="text-xs text-slate-500">Modifiez le titre, l&apos;émoticône ou supprimez ce module</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateModuleInline} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Titre du Module *
                </label>
                <input
                  type="text"
                  required
                  value={editingModData.titre}
                  onChange={(e) => setEditingModData({ ...editingModData, titre: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Choisir une émoticône / Icône ({editingModData.icon})
                </label>
                <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/50 mb-2">
                  {["⚡", "🧲", "🌊", "🔭", "⚛️", "🔥", "💡", "🧪", "🚀", "🪐", "🌀", "📡", "📐", "🔬", "🛰️", "⚙️", "🔋", "🧬", "📊", "🎯", "🧮", "🏷️", "📚", "💎"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setEditingModData({ ...editingModData, icon: emoji })}
                      className={`text-xl p-1.5 rounded-lg transition-transform hover:scale-125 ${
                        editingModData.icon === emoji ? "bg-amber-500/20 ring-2 ring-amber-500 scale-110" : "hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={editingModData.icon}
                  onChange={(e) => setEditingModData({ ...editingModData, icon: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description succincte
                </label>
                <input
                  type="text"
                  value={editingModData.description}
                  onChange={(e) => setEditingModData({ ...editingModData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement le module "${editingModData.titre}" ?`)) {
                      removeModule(editingModData.id);
                      setActiveModal(null);
                      setActiveModule("all");
                    }
                  }}
                  className="px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                >
                  Supprimer ce module
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
