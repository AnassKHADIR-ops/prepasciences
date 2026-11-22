"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";
import {
  ConcoursBlock,
  EpreuveItem,
  CorrigePartieItem,
  THEMES_MODULES,
  ThemeModuleItem,
  FILIERES_CONCOURS,
  FiliereConcours,
  parseEpreuveFilieres,
  resolveUserDefaultFiliere,
} from "./pcConcoursData";
import {
  Search,
  X,
  ChevronDown,
  FileText,
  CheckCircle2,
  Play,
  Trophy,
  Sparkles,
  Edit2,
  Trash2,
  PlusCircle,
  Eye,
  GraduationCap,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getConcoursDB,
  resetConcoursDB,
  addConcoursBlock,
  editConcoursBlock,
  deleteConcoursBlock,
  addEpreuveToConcours,
  editEpreuveInConcours,
  deleteEpreuveFromConcours,
} from "@/lib/concoursStore";

interface ConcoursWidgetProps {
  onOpenPdf: (url: string, title: string) => void;
  onOpenVideo: (url: string, title: string) => void;
  initialFiliere?: FiliereConcours | null;
  onSelectFiliere?: (filiere: FiliereConcours) => void;
}

type MatiereFilter = "all" | "physique" | "chimie";

let corrigePartSeq = 0;
function nextCorrigePartId(): string {
  corrigePartSeq += 1;
  return `corr-${corrigePartSeq}`;
}

export function ConcoursWidget({
  onOpenPdf,
  onOpenVideo,
  initialFiliere = null,
  onSelectFiliere,
}: ConcoursWidgetProps) {
  const { currentUser, isTeacher, isAdmin, teacherViewMode, toggleTeacherViewMode } = useAuth();

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const activeIsTeacher = isMounted && isTeacher;
  const activeIsAdmin = isMounted && isAdmin;
  const isTeacherView = (activeIsTeacher || activeIsAdmin) && teacherViewMode === "teacher";

  const [concoursData, setConcoursData] = useState<ConcoursBlock[]>(() => getConcoursDB());
  const [localFiliere, setLocalFiliere] = useState<FiliereConcours | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [activeMatiere, setActiveMatiere] = useState<MatiereFilter>("all");
  const [activeTheme, setActiveTheme] = useState<string>("all");
  const [openBlocksByFiliere, setOpenBlocksByFiliere] = useState<
    Partial<Record<FiliereConcours, Record<string, boolean>>>
  >({});

  const defaultUserFiliere = resolveUserDefaultFiliere(
    isMounted ? currentUser?.filiere : undefined
  );
  const selectedFiliere: FiliereConcours =
    initialFiliere ?? localFiliere ?? defaultUserFiliere;

  const collapseCurrentFiliere = useCallback(() => {
    setOpenBlocksByFiliere((prev) => ({
      ...prev,
      [selectedFiliere]: {},
    }));
  }, [selectedFiliere]);

  const tablistRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Fallback IntersectionObserver pour les fondus de défilement des onglets quand scroll-driven animations ne sont pas supportés
  useEffect(() => {
    const scroller = tablistRef.current;
    if (!scroller || typeof window === "undefined") return;
    if (typeof CSS !== "undefined" && CSS.supports("animation-timeline", "scroll()")) return;

    const first = scroller.firstElementChild;
    const last = scroller.lastElementChild;
    if (!first || !last) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, intersectionRatio } of entries) {
          scroller.classList.toggle(
            target === first ? "more-start" : "more-end",
            intersectionRatio < 1
          );
        }
      },
      { root: scroller, threshold: 1, rootMargin: "1px" }
    );

    observer.observe(first);
    observer.observe(last);
    return () => observer.disconnect();
  }, []);

  const refreshConcours = useCallback(() => {
    setConcoursData(getConcoursDB());
  }, []);

  const handleSelectFiliere = useCallback(
    (fil: FiliereConcours) => {
      setLocalFiliere(fil);
      setActiveFilter("all");
      setActiveMatiere("all");
      setActiveTheme("all");
      setOpenBlocksByFiliere((prev) => ({
        ...prev,
        [fil]: {},
      }));
      onSelectFiliere?.(fil);

      const tabEl = tabRefs.current[fil];
      if (tabEl) {
        tabEl.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    },
    [onSelectFiliere]
  );

  // Navigation clavier WAI-ARIA sur la barre d'onglets Filières (selection follows focus)
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    const count = FILIERES_CONCOURS.length;
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % count;
    else if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + count) % count;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = count - 1;

    if (nextIndex !== null) {
      e.preventDefault();
      const targetFil = FILIERES_CONCOURS[nextIndex].id;
      handleSelectFiliere(targetFil);
      tabRefs.current[targetFil]?.focus();
    }
  };

  const activeFiliereInfo = useMemo(
    () => FILIERES_CONCOURS.find((f) => f.id === selectedFiliere) || FILIERES_CONCOURS[0],
    [selectedFiliere]
  );

  // Map des thèmes pour consultation rapide
  const themeMap = useMemo(() => {
    const m: Record<string, ThemeModuleItem> = {};
    THEMES_MODULES.forEach((t) => {
      m[t.id] = t;
    });
    return m;
  }, []);

  // Décompte global d'épreuves par filière (affiché dans les onglets Filières)
  const filiereTotals = useMemo(() => {
    const counts: Record<FiliereConcours, number> = {
      MP: 0,
      PSI: 0,
      PC: 0,
      TSI: 0,
      PT: 0,
    };
    concoursData.forEach((block) => {
      block.sujets.forEach((s) => {
        const fils = parseEpreuveFilieres(s.filiere, s.filieres);
        fils.forEach((f) => {
          counts[f] += 1;
        });
      });
    });
    return counts;
  }, [concoursData]);

  // ── FILTRAGE STRICT PAR FILIÈRE (BASE PURGÉE DE LA FILIÈRE ACTIVE) ──
  const filiereBlocks = useMemo(() => {
    return concoursData
      .map((block) => {
        const matchingSujets = block.sujets.filter((s) => {
          const fils = parseEpreuveFilieres(s.filiere, s.filieres);
          return fils.includes(selectedFiliere);
        });
        if (matchingSujets.length === 0) return null;
        return {
          ...block,
          sujets: matchingSujets,
        };
      })
      .filter(Boolean) as ConcoursBlock[];
  }, [concoursData, selectedFiliere]);

  // ══════════════════════════════════════════════════════════════════════════
  // ÉTATS ET GESTIONNAIRES MODALS D'ADMINISTRATION
  // ══════════════════════════════════════════════════════════════════════════
  const [activeModal, setActiveModal] = useState<
    "create_concours" | "edit_concours" | "create_epreuve" | "edit_epreuve" | null
  >(null);

  const [editingConcoursId, setEditingConcoursId] = useState<string | null>(null);
  const [concoursFormTitre, setConcoursFormTitre] = useState("");
  const [concoursFormMeta, setConcoursFormMeta] = useState("");
  const [concoursFormIcon, setConcoursFormIcon] = useState("🏆");

  const [targetConcoursId, setTargetConcoursId] = useState<string | null>(null);
  const [editingEpreuveId, setEditingEpreuveId] = useState<string | null>(null);
  const [epreuveFormAnnee, setEpreuveFormAnnee] = useState("");
  const [epreuveFormFiliere, setEpreuveFormFiliere] = useState<string>("MP");
  const [epreuveFormMatiere, setEpreuveFormMatiere] = useState<string>("Physique");
  const [epreuveFormLabel, setEpreuveFormLabel] = useState("");
  const [epreuveFormEnonce, setEpreuveFormEnonce] = useState("");
  const [epreuveFormCorriges, setEpreuveFormCorriges] = useState<CorrigePartieItem[]>([]);
  const [epreuveFormVideo, setEpreuveFormVideo] = useState("");

  const openAddConcours = () => {
    setEditingConcoursId(null);
    setConcoursFormTitre("");
    setConcoursFormMeta("Épreuves officielles & Corrigés détaillés");
    setConcoursFormIcon("🏆");
    setActiveModal("create_concours");
  };

  const openEditConcours = (block: ConcoursBlock) => {
    setEditingConcoursId(block.id);
    setConcoursFormTitre(block.titre);
    setConcoursFormMeta(block.meta);
    setConcoursFormIcon(block.icon || "🏆");
    setActiveModal("edit_concours");
  };

  const handleSaveConcours = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concoursFormTitre.trim()) return;

    if (activeModal === "create_concours") {
      addConcoursBlock({
        titre: concoursFormTitre.trim(),
        meta: concoursFormMeta.trim(),
        icon: concoursFormIcon.trim() || "🏆",
      });
    } else if (activeModal === "edit_concours" && editingConcoursId) {
      editConcoursBlock(editingConcoursId, {
        titre: concoursFormTitre.trim(),
        meta: concoursFormMeta.trim(),
        icon: concoursFormIcon.trim() || "🏆",
      });
    }

    refreshConcours();
    setActiveModal(null);
    setEditingConcoursId(null);
  };

  const handleDeleteConcours = (blockId: string, titre: string) => {
    if (confirm(`Confirmez-vous la suppression du concours « ${titre} » et de tous ses sujets ?`)) {
      deleteConcoursBlock(blockId);
      refreshConcours();
    }
  };

  const openAddEpreuve = (blockId: string) => {
    setTargetConcoursId(blockId);
    setEditingEpreuveId(null);
    setEpreuveFormAnnee(new Date().getFullYear().toString());
    setEpreuveFormFiliere(selectedFiliere);
    setEpreuveFormMatiere("Physique");
    setEpreuveFormLabel("");
    setEpreuveFormEnonce("");
    setEpreuveFormCorriges([
      {
        id: nextCorrigePartId(),
        titre: "Corrigé Détaillé Officiel",
        url: "",
      },
    ]);
    setEpreuveFormVideo("");
    setActiveModal("create_epreuve");
  };

  const openEditEpreuve = (blockId: string, epreuve: EpreuveItem) => {
    setTargetConcoursId(blockId);
    setEditingEpreuveId(epreuve.id || null);
    setEpreuveFormAnnee(epreuve.annee.toString());
    setEpreuveFormFiliere(epreuve.filiere);
    setEpreuveFormMatiere(epreuve.matiere || "Physique");
    setEpreuveFormLabel(epreuve.label);
    setEpreuveFormEnonce(epreuve.enonce);

    let parts: CorrigePartieItem[] = [];
    if (epreuve.corriges && epreuve.corriges.length > 0) {
      parts = [...epreuve.corriges];
    } else if (epreuve.correction && epreuve.correction.trim() !== "") {
      parts.push({
        id: nextCorrigePartId(),
        titre: "Corrigé Détaillé Officiel",
        url: epreuve.correction,
      });
    }

    setEpreuveFormCorriges(parts);
    setEpreuveFormVideo(epreuve.video || "");
    setActiveModal("edit_epreuve");
  };

  const handleSaveEpreuve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetConcoursId || !epreuveFormLabel.trim()) return;

    const cleanCorriges = epreuveFormCorriges
      .map((c) => ({ ...c, titre: c.titre.trim(), url: c.url.trim() }))
      .filter((c) => c.url !== "");

    if (activeModal === "create_epreuve") {
      addEpreuveToConcours(targetConcoursId, {
        annee: epreuveFormAnnee.trim() || new Date().getFullYear().toString(),
        filiere: epreuveFormFiliere.trim() || selectedFiliere,
        matiere: epreuveFormMatiere.trim(),
        label: epreuveFormLabel.trim(),
        enonce: epreuveFormEnonce.trim(),
        corriges: cleanCorriges,
        video: epreuveFormVideo.trim() || null,
      });
    } else if (activeModal === "edit_epreuve" && editingEpreuveId) {
      editEpreuveInConcours(targetConcoursId, editingEpreuveId, {
        annee: epreuveFormAnnee.trim(),
        filiere: epreuveFormFiliere.trim(),
        matiere: epreuveFormMatiere.trim(),
        label: epreuveFormLabel.trim(),
        enonce: epreuveFormEnonce.trim(),
        corriges: cleanCorriges,
        video: epreuveFormVideo.trim() || null,
      });
    }

    refreshConcours();
    setActiveModal(null);
    setTargetConcoursId(null);
    setEditingEpreuveId(null);
  };

  const handleDeleteEpreuve = (blockId: string, epreuveId: string | number) => {
    deleteEpreuveFromConcours(blockId, epreuveId);
    refreshConcours();
  };

  // Calcul des statistiques strictement pour la filière active
  const stats = useMemo(() => {
    let totalEpreuves = 0;
    let enoncesCount = 0;
    let corrigesCount = 0;
    let videosCount = 0;
    let physiqueCount = 0;
    let chimieCount = 0;

    filiereBlocks.forEach((b) => {
      b.sujets.forEach((s) => {
        totalEpreuves++;
        if (s.enonce && s.enonce.trim() !== "") enoncesCount++;
        const hasCorriges =
          (s.corriges && s.corriges.length > 0) ||
          Boolean(s.correction && s.correction.trim() !== "");
        if (hasCorriges) corrigesCount++;

        const vLen =
          s.videos && s.videos.length > 0
            ? s.videos.length
            : s.video && s.video.trim() !== ""
            ? 1
            : 0;
        videosCount += vLen;

        const mat = (s.matiere || "").toLowerCase();
        if (mat === "chimie") chimieCount++;
        else if (mat.includes("physique")) physiqueCount++;
      });
    });

    return {
      concours: filiereBlocks.length,
      totalEpreuves,
      sujets: enoncesCount,
      corriges: corrigesCount,
      videos: videosCount,
      physiqueCount,
      chimieCount,
    };
  }, [filiereBlocks]);

  // Options dynamiques des filtres par banque de concours (uniquement celles présentes dans la filière!)
  const filterOptions = useMemo(() => {
    const list = [{ id: "all", label: "Toutes les banques", count: stats.totalEpreuves }];
    filiereBlocks.forEach((b) => {
      list.push({
        id: b.id,
        label: `${b.icon || "🏆"} ${b.titre.split("—")[0].trim()}`,
        count: b.sujets.length,
      });
    });
    return list;
  }, [filiereBlocks, stats.totalEpreuves]);

  // Décompte dynamique des épreuves par thème (strictement dans la filière active)
  const themeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filiereBlocks.forEach((b) => {
      b.sujets.forEach((s) => {
        (s.themes || []).forEach((tId) => {
          counts[tId] = (counts[tId] || 0) + 1;
        });
      });
    });
    return counts;
  }, [filiereBlocks]);

  const effectiveFilter = useMemo(() => {
    if (activeFilter === "all") return "all";
    return filiereBlocks.some((b) => b.id === activeFilter) ? activeFilter : "all";
  }, [activeFilter, filiereBlocks]);

  // Filtrage combiné (Filière active + Banque Concours + Matière/Vidéo + Thème + Recherche)
  const filteredBlocks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return filiereBlocks
      .map((block) => {
        if (effectiveFilter !== "all" && block.id !== effectiveFilter) {
          return null;
        }

        const filteredSujets = block.sujets.filter((s) => {
          // 1. Filtrage par matière
          if (activeMatiere === "physique") {
            const mat = (s.matiere || "").toLowerCase();
            if (!mat.includes("physique")) return false;
          } else if (activeMatiere === "chimie") {
            const mat = (s.matiere || "").toLowerCase();
            if (mat !== "chimie" && !mat.includes("chimie")) return false;
          }

          // 2. Filtrage par thème
          if (activeTheme !== "all") {
            const hasTheme = Array.isArray(s.themes) && s.themes.includes(activeTheme);
            if (!hasTheme) return false;
          }

          // 3. Filtrage par recherche textuelle
          if (q) {
            const matchLabel = s.label.toLowerCase().includes(q);
            const matchAnnee = s.annee.toString().toLowerCase().includes(q);
            const matchDesc = (s.description || "").toLowerCase().includes(q);
            const matchConcours = block.titre.toLowerCase().includes(q);
            const matchVideos = (s.videos || []).some(
              (v) =>
                v.title.toLowerCase().includes(q) ||
                (v.chapitre || "").toLowerCase().includes(q)
            );
            if (!matchLabel && !matchAnnee && !matchDesc && !matchConcours && !matchVideos) {
              return false;
            }
          }

          return true;
        });

        if (filteredSujets.length === 0) return null;

        return {
          ...block,
          sujets: filteredSujets,
        };
      })
      .filter(Boolean) as ConcoursBlock[];
  }, [filiereBlocks, effectiveFilter, activeMatiere, activeTheme, searchQuery]);

  const hasActiveSearchOrFilter =
    effectiveFilter !== "all" ||
    activeMatiere !== "all" ||
    activeTheme !== "all" ||
    searchQuery.trim() !== "";

  const currentOpenBlocks = useMemo(
    () => openBlocksByFiliere[selectedFiliere] ?? {},
    [openBlocksByFiliere, selectedFiliere]
  );

  // Tout est replié par défaut : l'étudiant clique sur la banque qu'il souhaite consulter
  const isBlockOpen = (id: string) => Boolean(currentOpenBlocks[id]);

  const toggleBlock = (id: string) => {
    setOpenBlocksByFiliere((prev) => {
      const base = prev[selectedFiliere] ?? {};
      return {
        ...prev,
        [selectedFiliere]: { ...base, [id]: !base[id] },
      };
    });
  };

  const sortSessionKeys = (keys: string[]) => {
    const featured = new Set(["CNC Book", "2000-2010", "2019-2021", "Méthodologie", "Problèmes Sup"]);
    return keys.sort((a, b) => {
      const fa = featured.has(a);
      const fb = featured.has(b);
      if (fa && !fb) return -1;
      if (!fa && fb) return 1;
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      const isNumA = !isNaN(numA) && String(numA) === a;
      const isNumB = !isNaN(numB) && String(numB) === b;
      if (isNumA && isNumB) return numB - numA;
      if (isNumA && !isNumB) return -1;
      if (!isNumA && isNumB) return 1;
      return a.localeCompare(b);
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-2 sm:my-4 font-sans">
      {/* 1. En-tête Éditorial Épuré */}
      <div className="text-center max-w-2xl mx-auto py-4 sm:py-6 mb-4 space-y-3">
        <div className="ui-eyebrow">
          <Trophy className="w-3.5 h-3.5 text-[#7A5230] dark:text-[#D4A977]" strokeWidth={1.6} />
          <span>Annales Officielles CPGE · {activeFiliereInfo.label}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-semibold text-[#1D1D1F] dark:text-[#F5F3EC] tracking-[-0.03em]">
          Concours {activeFiliereInfo.shortLabel}
        </h2>

        <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#B8B2A6] leading-relaxed">
          Épreuves dédiées à la filière {activeFiliereInfo.shortLabel} : énoncés PDF, corrigés officiels et vidéos classées session par session.
        </p>

        <p className="text-xs font-medium text-[#7A5230] dark:text-[#D4A977]">
          {activeFiliereInfo.subtitle}
        </p>
      </div>

      {/* 1 bis. SÉLECTEUR DE FILIÈRE CPGE */}
      <div className="ui-card p-2.5 mb-4">
        <div className="flex items-center gap-2 px-2 pb-2 border-b border-black/8 dark:border-white/8 mb-2">
          <GraduationCap className="w-4 h-4 text-[#7A5230] dark:text-[#D4A977] shrink-0" strokeWidth={1.6} />
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#57534E] dark:text-[#B8B2A6]">
            Filière CPGE
          </span>
          <span className="ml-auto hidden sm:inline-block text-[11px] text-[#6E6A63] dark:text-[#9A9488]">
            Affichage strictement filtré
          </span>
        </div>

        <div
          ref={tablistRef}
          role="tablist"
          aria-label="Filières CPGE"
          className="filiere-tablist gap-1.5 pb-0.5"
        >
          {FILIERES_CONCOURS.map((fil, idx) => {
            const isSelected = selectedFiliere === fil.id;
            const totalForFil = filiereTotals[fil.id] || 0;
            return (
              <button
                key={fil.id}
                ref={(el) => {
                  tabRefs.current[fil.id] = el;
                }}
                id={`filiere-tab-${fil.id}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleSelectFiliere(fil.id)}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                className={`filiere-tab flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D1D1F] dark:focus-visible:outline-[#F5F3EC] ${
                  isSelected
                    ? "bg-[#F4F1E6] dark:bg-[#282622] text-[#1D1D1F] dark:text-[#F5F3EC] font-semibold"
                    : "text-[#57534E] dark:text-[#B8B2A6] hover:bg-[#F9F7F1] dark:hover:bg-[#252320] hover:text-[#1D1D1F] dark:hover:text-[#F5F3EC]"
                }`}
              >
                <span>{fil.shortLabel}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                    isSelected
                      ? "bg-[#1D1D1F] text-[#FAF8F2] dark:bg-[#F5F3EC] dark:text-[#161513]"
                      : "bg-[#ECE7D8] dark:bg-[#282622] text-[#57534E] dark:text-[#B8B2A6]"
                  }`}
                >
                  {totalForFil}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── BARRE D'ADMINISTRATION ENSEIGNANT / ADMIN ── */}
      {(activeIsTeacher || activeIsAdmin) && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-purple-950/90 text-white border border-purple-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-200">
              <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white">
                  Administration des Concours ({activeFiliereInfo.shortLabel})
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-purple-500 text-white shadow-2xs">
                  {activeIsAdmin ? "Admin" : "Professeur"}
                </span>
              </div>
              <p className="text-xs text-purple-200/80 mt-0.5">
                {isTeacherView
                  ? "Mode édition actif : gérez les énoncés, corrigés multi-parties et vidéos par filière"
                  : "Aperçu étudiant actif : cliquez sur « Activer Mode Éditeur » pour modifier"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={toggleTeacherViewMode}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isTeacherView
                  ? "bg-slate-800 hover:bg-slate-700 text-purple-200 border-purple-500/40"
                  : "bg-purple-600 hover:bg-purple-500 text-white border-purple-400 shadow-purple-600/30"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isTeacherView ? "Aperçu Étudiant" : "Activer Mode Éditeur"}</span>
            </button>

            {isTeacherView && (
              <>
                <button
                  type="button"
                  onClick={openAddConcours}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white border border-purple-400 flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Nouveau Concours</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Réinitialiser la base locale vers le catalogue officiel purgé ?")) {
                      setConcoursData(resetConcoursDB());
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/15 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Restaurer le catalogue officiel purgé"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Réinitialiser</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── TABPANEL DE LA FILIÈRE SÉLECTIONNÉE ── */}
      <div role="tabpanel" aria-labelledby={`filiere-tab-${selectedFiliere}`}>
        {/* 2. Barre de Statistiques Compacte */}
        <div className="ui-card grid grid-cols-2 sm:grid-cols-4 mb-4 overflow-hidden">
          <div className="py-3.5 px-2 sm:py-4 sm:px-4 text-center border-r border-b sm:border-b-0 border-black/8 dark:border-white/8">
            <div className="text-xl sm:text-2xl font-semibold text-[#1D1D1F] dark:text-[#F5F3EC]">
              {stats.concours}
            </div>
            <div className="text-[10px] sm:text-[11px] font-medium text-[#6E6A63] dark:text-[#9A9488] uppercase tracking-[0.08em] mt-0.5">
              Banques {selectedFiliere}
            </div>
          </div>
          <div className="py-3.5 px-2 sm:py-4 sm:px-4 text-center sm:border-r border-b sm:border-b-0 border-black/8 dark:border-white/8">
            <div className="text-xl sm:text-2xl font-semibold text-[#1D1D1F] dark:text-[#F5F3EC]">
              {stats.sujets}
            </div>
            <div className="text-[10px] sm:text-[11px] font-medium text-[#6E6A63] dark:text-[#9A9488] uppercase tracking-[0.08em] mt-0.5">
              Énoncés PDF
            </div>
          </div>
          <div className="py-3.5 px-2 sm:py-4 sm:px-4 text-center border-r border-black/8 dark:border-white/8">
            <div className="text-xl sm:text-2xl font-semibold text-[#7A5230] dark:text-[#D4A977]">
              {stats.corriges}
            </div>
            <div className="text-[10px] sm:text-[11px] font-medium text-[#6E6A63] dark:text-[#9A9488] uppercase tracking-[0.08em] mt-0.5">
              Corrigés PDF
            </div>
          </div>
          <div className="py-3.5 px-2 sm:py-4 sm:px-4 text-center">
            <div className="text-xl sm:text-2xl font-semibold text-[#1D1D1F] dark:text-[#F5F3EC]">
              {stats.videos}
            </div>
            <div className="text-[10px] sm:text-[11px] font-medium text-[#6E6A63] dark:text-[#9A9488] uppercase tracking-[0.08em] mt-0.5">
              Vidéos
            </div>
          </div>
        </div>

        {/* 3. Barre de Filtrage Minimaliste */}
        <div className="ui-card p-3 sm:p-3.5 mb-4 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
            {/* Champ Recherche */}
            <div className="relative sm:col-span-2 lg:col-span-4 min-w-0">
              <label htmlFor="concours-search-input" className="sr-only">
                Rechercher une épreuve en {activeFiliereInfo.shortLabel}
              </label>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A63]" strokeWidth={1.6} />
              <input
                id="concours-search-input"
                type="text"
                placeholder={`Rechercher en ${activeFiliereInfo.shortLabel} (2019, induction, RMN...)`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  collapseCurrentFiliere();
                }}
                className="ui-input h-[2.625rem] pl-10 pr-9 text-[13px]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    collapseCurrentFiliere();
                  }}
                  aria-label="Effacer la recherche"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Liste déroulante : Banque de Concours */}
            <div className="concours-select-wrap lg:col-span-3">
              <label htmlFor="concours-bank-select" className="sr-only">
                Banque de concours
              </label>
              <select
                id="concours-bank-select"
                name="banque"
                value={effectiveFilter}
                data-active={effectiveFilter !== "all"}
                onChange={(e) => {
                  setActiveFilter(e.target.value);
                  collapseCurrentFiliere();
                }}
                className="concours-select"
              >
                {filterOptions.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.id === "all"
                      ? `Banque : Toutes (${f.count})`
                      : `${f.label} (${f.count})`}
                  </option>
                ))}
              </select>
              <ChevronDown className="concours-select-chevron w-4 h-4" aria-hidden="true" />
            </div>

            {/* Liste déroulante : Matière */}
            <div className="concours-select-wrap lg:col-span-2">
              <label htmlFor="concours-matiere-select" className="sr-only">
                Matière
              </label>
              <select
                id="concours-matiere-select"
                name="matiere"
                value={activeMatiere}
                data-active={activeMatiere !== "all"}
                onChange={(e) => {
                  setActiveMatiere(e.target.value as MatiereFilter);
                  collapseCurrentFiliere();
                }}
                className="concours-select"
              >
                <option value="all">Matière : Tout ({stats.totalEpreuves})</option>
                {stats.physiqueCount > 0 && (
                  <option value="physique">Physique ({stats.physiqueCount})</option>
                )}
                {stats.chimieCount > 0 && (
                  <option value="chimie">Chimie ({stats.chimieCount})</option>
                )}
              </select>
              <ChevronDown className="concours-select-chevron w-4 h-4" aria-hidden="true" />
            </div>

            {/* Liste déroulante : Thème / Module CPGE */}
            <div className="concours-select-wrap sm:col-span-2 lg:col-span-3">
              <label htmlFor="concours-theme-select" className="sr-only">
                Thème ou module du programme
              </label>
              <select
                id="concours-theme-select"
                name="theme"
                value={activeTheme}
                data-active={activeTheme !== "all"}
                onChange={(e) => {
                  setActiveTheme(e.target.value);
                  collapseCurrentFiliere();
                }}
                className="concours-select"
              >
                {THEMES_MODULES.map((thm) => {
                  const count = thm.id === "all" ? stats.totalEpreuves : themeCounts[thm.id] || 0;
                  if (thm.id !== "all" && count === 0) return null;
                  return (
                    <option key={thm.id} value={thm.id}>
                      {thm.id === "all"
                        ? "Thème : Tous les modules"
                        : `${thm.icon} ${thm.label} (${count})`}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="concours-select-chevron w-4 h-4" aria-hidden="true" />
            </div>
          </div>

          {/* Bandeau discret des filtres actifs (visible UNIQUEMENT lorsqu'un filtre est appliqué) */}
          {hasActiveSearchOrFilter && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>
                    {filteredBlocks.reduce((acc, b) => acc + b.sujets.length, 0)} résultat
                    {filteredBlocks.reduce((acc, b) => acc + b.sujets.length, 0) > 1 ? "s" : ""}
                  </span>
                </span>

                {effectiveFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveFilter("all");
                      collapseCurrentFiliere();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 border border-purple-200/80 dark:border-purple-500/30 font-semibold text-[11px] hover:bg-purple-100 dark:hover:bg-purple-900/60 cursor-pointer"
                  >
                    <span>{filterOptions.find((f) => f.id === effectiveFilter)?.label}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}

                {activeMatiere !== "all" && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMatiere("all");
                      collapseCurrentFiliere();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 border border-indigo-200/80 dark:border-indigo-500/30 font-semibold text-[11px] hover:bg-indigo-100 dark:hover:bg-indigo-900/60 cursor-pointer"
                  >
                    <span>{activeMatiere === "physique" ? "Physique" : "Chimie"}</span>
                    <X className="w-3 h-3" />
                  </button>
                )}

                {activeTheme !== "all" && themeMap[activeTheme] && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTheme("all");
                      collapseCurrentFiliere();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 border border-purple-200/80 dark:border-purple-500/30 font-semibold text-[11px] hover:bg-purple-100 dark:hover:bg-purple-900/60 cursor-pointer"
                  >
                    <span>
                      {themeMap[activeTheme].icon} {themeMap[activeTheme].label}
                    </span>
                    <X className="w-3 h-3" />
                  </button>
                )}

                {searchQuery.trim() !== "" && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      collapseCurrentFiliere();
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-[11px] hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <span>« {searchQuery.trim()} »</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveFilter("all");
                  setActiveMatiere("all");
                  setActiveTheme("all");
                  setSearchQuery("");
                  collapseCurrentFiliere();
                }}
                className="text-[11px] font-bold text-purple-700 dark:text-purple-400 hover:underline shrink-0 cursor-pointer"
              >
                Tout réinitialiser
              </button>
            </div>
          )}
        </div>

        {/* 4. Liste des Blocs Concours de la Filière Active */}
        <div className="space-y-4">
          {filteredBlocks.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#0d1322] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400 space-y-3">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Aucune épreuve de concours ({activeFiliereInfo.shortLabel}) ne correspond à ces critères.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter("all");
                  setActiveMatiere("all");
                  setActiveTheme("all");
                  setSearchQuery("");
                  collapseCurrentFiliere();
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 text-white shadow-xs cursor-pointer"
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          ) : (
            filteredBlocks.map((block) => {
              const isOpen = isBlockOpen(block.id);

              const yearsMap: Record<string, EpreuveItem[]> = {};
              let blockVideoCount = 0;
              block.sujets.forEach((s) => {
                const anneeKey = String(s.annee);
                if (!yearsMap[anneeKey]) yearsMap[anneeKey] = [];
                yearsMap[anneeKey].push(s);
                if (s.videos && s.videos.length > 0) blockVideoCount += s.videos.length;
                else if (s.video) blockVideoCount += 1;
              });
              const sortedYears = sortSessionKeys(Object.keys(yearsMap));

              return (
                <div
                  key={block.id}
                  className="ui-card overflow-hidden hover:border-black/25 dark:hover:border-white/25"
                >
                  {/* Header de bloc */}
                  <div
                    onClick={() => toggleBlock(block.id)}
                    className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 cursor-pointer select-none hover:bg-[#F9F7F1] dark:hover:bg-[#252320] transition-colors"
                  >
                    <div className="ui-icon-tile w-10 h-10 sm:w-11 sm:h-11 rounded-xl shrink-0">
                      <Trophy className="w-4 h-4 text-[#7A5230] dark:text-[#D4A977]" strokeWidth={1.6} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <h3 className="text-base sm:text-[17px] font-semibold text-[#1D1D1F] dark:text-[#F5F3EC] tracking-tight truncate">
                          {block.titre}
                        </h3>
                        <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-[#EFE7D9] dark:bg-[#282622] text-[#7A5230] dark:text-[#D4A977]">
                          {selectedFiliere}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-[#57534E] dark:text-[#B8B2A6] mt-0.5 truncate">
                        {block.meta}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {blockVideoCount > 0 && (
                        <span className="ui-pill hidden md:inline-flex text-[11px] whitespace-nowrap">
                          <Play className="w-3 h-3" strokeWidth={1.6} />
                          <span>
                            {blockVideoCount} {blockVideoCount > 1 ? "vidéos" : "vidéo"}
                          </span>
                        </span>
                      )}

                      <span className="ui-pill text-[11px] font-semibold text-[#1D1D1F] dark:text-[#F5F3EC] whitespace-nowrap">
                        <span>{block.sujets.length}</span>
                        <span className="hidden sm:inline">
                          {block.sujets.length > 1 ? "Épreuves" : "Épreuve"}
                        </span>
                      </span>

                      {isTeacherView && (
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => openAddEpreuve(block.id)}
                            className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors shadow-2xs cursor-pointer"
                            title="Ajouter une nouvelle épreuve à ce concours"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">+ Épreuve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditConcours(block)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors cursor-pointer"
                            title="Modifier les informations du concours"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteConcours(block.id, block.titre)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                            title="Supprimer ce concours"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ${
                          isOpen
                            ? "rotate-180 bg-[#1D1D1F] text-[#FAF8F2] dark:bg-[#F5F3EC] dark:text-[#161513]"
                            : "bg-[#F4F1E6] dark:bg-[#282622] text-[#57534E] dark:text-[#B8B2A6]"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" strokeWidth={1.6} />
                      </div>
                    </div>
                  </div>

                  {/* Contenu Dépliable par Session / Année */}
                  {isOpen && (
                    <div className="border-t border-black/8 dark:border-white/8 divide-y divide-black/8 dark:divide-white/8 bg-[#F9F7F1] dark:bg-[#1A1916]">
                      {sortedYears.map((annee) => (
                        <div key={annee} className="p-3.5 sm:p-5 space-y-3">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F3EC] bg-[#EFE7D9] dark:bg-[#282622] px-2.5 py-0.5 rounded-full min-w-[52px] text-center">
                              {annee}
                            </span>
                            <span className="text-xs font-medium text-[#57534E] dark:text-[#B8B2A6]">
                              {/^\d{4}$/.test(annee) ? `Session ${annee}` : annee} · Filière{" "}
                              {activeFiliereInfo.shortLabel}
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            {yearsMap[annee].map((epreuve, idx) => {
                              const isChimie = (epreuve.matiere || "").toLowerCase() === "chimie";
                              const isOral =
                                (epreuve.matiere || "").toLowerCase().includes("oral") ||
                                (epreuve.matiere || "").toLowerCase().includes("méthod");

                              const hasEnonce = Boolean(epreuve.enonce && epreuve.enonce.trim() !== "");
                              const corrigesList =
                                epreuve.corriges && epreuve.corriges.length > 0
                                  ? epreuve.corriges
                                  : epreuve.correction && epreuve.correction.trim() !== ""
                                  ? [{ id: "legacy-c", titre: "Corrigé", url: epreuve.correction }]
                                  : [];
                              const videosList =
                                epreuve.videos && epreuve.videos.length > 0
                                  ? epreuve.videos
                                  : epreuve.video
                                  ? [{ id: "legacy-v", title: epreuve.label, url: epreuve.video }]
                                  : [];

                              const pdfCount = (hasEnonce ? 1 : 0) + corrigesList.length;
                              const videoCount = videosList.length;
                              const totalActions = pdfCount + videoCount;
                              const hasVideoPlaylist = videoCount >= 2 && pdfCount > 0;
                              const isCompactActions =
                                totalActions <= 3 && !hasVideoPlaylist && !isTeacherView;
                              const hasBodyContent = Boolean(
                                epreuve.description ||
                                  (epreuve.themes && epreuve.themes.length > 0)
                              );

                              const renderPdfButtons = () => (
                                <>
                                  {hasEnonce && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onOpenPdf(
                                          epreuve.enonce,
                                          `${block.titre} ${annee} (${selectedFiliere}) — ${epreuve.label} (Énoncé)`
                                        )
                                      }
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[32px] text-xs font-medium rounded-full bg-[#F4F1E6] dark:bg-[#282622] text-[#1D1D1F] dark:text-[#F5F3EC] border border-black/15 dark:border-white/15 hover:bg-[#E5DFCE] dark:hover:bg-[#322F2A] transition-colors cursor-pointer whitespace-nowrap"
                                    >
                                      <FileText className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} />
                                      <span>Énoncé</span>
                                    </button>
                                  )}

                                  {corrigesList.map((corr, cIdx) => (
                                    <button
                                      key={corr.id || cIdx}
                                      type="button"
                                      onClick={() =>
                                        onOpenPdf(
                                          corr.url,
                                          `${block.titre} ${annee} (${selectedFiliere}) — ${epreuve.label} (${corr.titre})`
                                        )
                                      }
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[32px] text-xs font-medium rounded-full bg-[#EFE7D9] dark:bg-[#282622] text-[#7A5230] dark:text-[#D4A977] border border-[#7A5230]/20 dark:border-[#D4A977]/25 hover:bg-[#E6D9C3] dark:hover:bg-[#322F2A] transition-colors cursor-pointer whitespace-nowrap max-w-full"
                                      title={corr.titre}
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} />
                                      <span className="truncate max-w-[140px]">
                                        {corr.titre || `Corrigé P.${cIdx + 1}`}
                                      </span>
                                    </button>
                                  ))}
                                </>
                              );

                              const renderVideoButtons = () =>
                                videosList.map((vid, vIdx) => (
                                  <button
                                    key={vid.id || vIdx}
                                    type="button"
                                    onClick={() =>
                                      onOpenVideo(
                                        vid.url,
                                        `${block.titre} ${annee} (${selectedFiliere}) — ${vid.title}`
                                      )
                                    }
                                    className="ui-btn-primary px-3.5 py-1.5 min-h-[32px] text-xs whitespace-nowrap max-w-full"
                                    title={vid.title}
                                  >
                                    <Play className="w-3 h-3 shrink-0" strokeWidth={1.75} />
                                    <span className="truncate max-w-[180px]">
                                      {videosList.length > 1
                                        ? `Vidéo ${vIdx + 1}/${videosList.length}`
                                        : "Corrigé Vidéo"}
                                      {vid.duration ? ` · ${vid.duration}` : ""}
                                    </span>
                                  </button>
                                ));

                              return (
                                <article
                                  key={epreuve.id || idx}
                                  data-compact-actions={isCompactActions ? "true" : "false"}
                                  className="epreuve-card p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#1F1E1B] border border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/25 transition-colors"
                                >
                                  {/* Région 1 : En-tête de l'épreuve */}
                                  <header className="flex items-start justify-between gap-2">
                                    <div className="flex items-center flex-wrap gap-2 min-w-0">
                                      <span
                                        className={`w-2 h-2 rounded-full shrink-0 ${
                                          isChimie
                                            ? "bg-teal-500"
                                            : isOral
                                            ? "bg-indigo-500"
                                            : "bg-purple-500"
                                        }`}
                                      />
                                      <h4 className="text-[13px] sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug break-words">
                                        {epreuve.label}
                                      </h4>
                                      <span
                                        className={`shrink-0 whitespace-nowrap px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                                          isChimie
                                            ? "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200/80 dark:border-teal-500/30"
                                            : isOral
                                            ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-500/30"
                                            : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                                        }`}
                                      >
                                        {epreuve.filiere || selectedFiliere}
                                      </span>
                                    </div>

                                    {isTeacherView && (
                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          type="button"
                                          onClick={() => openEditEpreuve(block.id, epreuve)}
                                          className="p-1.5 rounded-lg text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/50 transition-colors cursor-pointer"
                                          title="Modifier cette épreuve"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (
                                              confirm(
                                                `Confirmez-vous la suppression de l'épreuve « ${epreuve.label} » ?`
                                              )
                                            ) {
                                              handleDeleteEpreuve(block.id, epreuve.id || idx);
                                            }
                                          }}
                                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                                          title="Supprimer cette épreuve"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    )}
                                  </header>

                                  {/* Région 2 : Description & Modules du programme */}
                                  {hasBodyContent && (
                                    <div className="epreuve-body space-y-2 pl-0 sm:pl-4">
                                      {epreuve.description && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                          {epreuve.description}
                                        </p>
                                      )}

                                      {epreuve.themes && epreuve.themes.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-1.5">
                                          {epreuve.themes.map((thId) => {
                                            const thInfo = themeMap[thId];
                                            if (!thInfo) return null;
                                            return (
                                              <button
                                                key={thId}
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setActiveTheme(thId);
                                                  collapseCurrentFiliere();
                                                }}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-300 dark:hover:bg-purple-950/60 dark:hover:text-purple-200 transition-colors cursor-pointer whitespace-nowrap"
                                                title={`Filtrer par le module ${thInfo.label}`}
                                              >
                                                <span aria-hidden="true">{thInfo.icon}</span>
                                                <span>{thInfo.label}</span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Région 3 : Pied de carte — Documents PDF & Vidéos E-Learning Physique */}
                                  {totalActions > 0 && (
                                    <footer>
                                      {hasVideoPlaylist ? (
                                        <>
                                          <div className="flex flex-wrap items-center gap-2">
                                            {renderPdfButtons()}
                                          </div>
                                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700/80 dark:text-purple-300/80 mr-0.5">
                                              Vidéos :
                                            </span>
                                            {renderVideoButtons()}
                                          </div>
                                        </>
                                      ) : (
                                        <div
                                          className={`flex flex-wrap items-center gap-2 ${
                                            isCompactActions ? "sm:justify-end" : ""
                                          }`}
                                        >
                                          {renderPdfButtons()}
                                          {renderVideoButtons()}
                                        </div>
                                      )}
                                    </footer>
                                  )}
                                </article>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── MODAL CONCOURS : CRÉER / MODIFIER UN CONCOURS ── */}
      {(activeModal === "create_concours" || activeModal === "edit_concours") && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-purple-300 dark:border-purple-500/40 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>
                    {activeModal === "create_concours"
                      ? "Ajouter une Banque de Concours"
                      : "Modifier la Banque de Concours"}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Organisez les épreuves et sujets de concours CPGE
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setEditingConcoursId(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConcours} className="space-y-3.5">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Icône / Emoji
                  </label>
                  <input
                    type="text"
                    required
                    value={concoursFormIcon}
                    onChange={(e) => setConcoursFormIcon(e.target.value)}
                    className="w-full px-3 py-2 text-center text-lg rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                    placeholder="🏆"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nom du Concours *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: e3a-Polytech ou Banque PT"
                    value={concoursFormTitre}
                    onChange={(e) => setConcoursFormTitre(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Sous-titre
                </label>
                <input
                  type="text"
                  placeholder="ex: France · Épreuves officielles & Corrigés détaillés"
                  value={concoursFormMeta}
                  onChange={(e) => setConcoursFormMeta(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    setEditingConcoursId(null);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  {activeModal === "create_concours"
                    ? "Créer le concours"
                    : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL ÉPREUVE : CRÉER / MODIFIER UNE ÉPREUVE & MULTI-CORRIGÉS ── */}
      {(activeModal === "create_epreuve" || activeModal === "edit_epreuve") && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-purple-300 dark:border-purple-500/40 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>
                    {activeModal === "create_epreuve"
                      ? "Ajouter une Épreuve"
                      : "Modifier l'Épreuve & Corrigés"}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Dans :{" "}
                  {concoursData.find((b) => b.id === targetConcoursId)?.titre || "Concours"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setEditingEpreuveId(null);
                  setTargetConcoursId(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEpreuve} className="space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Année *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: 2024"
                    value={epreuveFormAnnee}
                    onChange={(e) => setEpreuveFormAnnee(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Filière *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MP, PSI, PC, TSI, PT"
                    value={epreuveFormFiliere}
                    onChange={(e) => setEpreuveFormFiliere(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Matière
                  </label>
                  <select
                    value={epreuveFormMatiere}
                    onChange={(e) => setEpreuveFormMatiere(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="Physique">Physique</option>
                    <option value="Chimie">Chimie</option>
                    <option value="Physique-Chimie">Physique-Chimie</option>
                    <option value="Oral & TP">Oral & TP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre / Libellé de l&apos;épreuve *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Physique · Physique-Chimie 1"
                  value={epreuveFormLabel}
                  onChange={(e) => setEpreuveFormLabel(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lien PDF Énoncé (Google Drive)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/.../preview"
                  value={epreuveFormEnonce}
                  onChange={(e) => setEpreuveFormEnonce(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 font-mono"
                />
              </div>

              {/* Parties de Corrigés */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Parties de Corrigés (PDF Google Drive)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setEpreuveFormCorriges((prev) => [
                        ...prev,
                        {
                          id: nextCorrigePartId(),
                          titre:
                            prev.length === 0
                              ? "Corrigé Détaillé Officiel"
                              : `Corrigé Partie ${prev.length + 1}`,
                          url: "",
                        },
                      ]);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Ajouter une partie</span>
                  </button>
                </div>

                {epreuveFormCorriges.length === 0 ? (
                  <div className="p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-900/50">
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
                      Aucun fichier de corrigé rattaché.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setEpreuveFormCorriges([
                          {
                            id: nextCorrigePartId(),
                            titre: "Corrigé Détaillé Officiel",
                            url: "",
                          },
                        ]);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Ajouter un corrigé PDF</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {epreuveFormCorriges.map((corr, cIdx) => (
                      <div
                        key={corr.id || cIdx}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            placeholder="Nom du corrigé"
                            value={corr.titre}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEpreuveFormCorriges((prev) => {
                                const next = [...prev];
                                next[cIdx] = { ...next[cIdx], titre: val };
                                return next;
                              });
                            }}
                            className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-purple-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setEpreuveFormCorriges((prev) =>
                                prev.filter((_, idx) => idx !== cIdx)
                              );
                            }}
                            className="p-1 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                            title="Supprimer cette partie"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/file/d/.../preview"
                          value={corr.url}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEpreuveFormCorriges((prev) => {
                              const next = [...prev];
                              next[cIdx] = { ...next[cIdx], url: val };
                              return next;
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lien Vidéo Résolution (YouTube)
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={epreuveFormVideo}
                  onChange={(e) => setEpreuveFormVideo(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    setEditingEpreuveId(null);
                    setTargetConcoursId(null);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  {activeModal === "create_epreuve"
                    ? "Ajouter l'épreuve"
                    : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
