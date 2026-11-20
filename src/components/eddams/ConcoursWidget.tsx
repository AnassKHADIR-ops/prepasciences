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
  Filter,
  GraduationCap,
  Video,
  FlaskConical,
  Atom,
  Layers,
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

type MatiereFilter = "all" | "physique" | "chimie" | "videos";

let corrigePartSeq = 0;
function nextCorrigePartId(): string {
  corrigePartSeq += 1;
  return `corr-${corrigePartSeq}`;
}

function getDefaultOpenBlocks(filiere: FiliereConcours): Record<string, boolean> {
  if (filiere === "PT") {
    return { banquept: true, methodo: false };
  }
  if (filiere === "TSI") {
    return { cs: true, ccinp: true, methodo: false };
  }
  if (filiere === "PC") {
    return { cs: true, mp: true, ccinp: false, xens: false, e3a: false, methodo: false };
  }
  return {
    cnc: true,
    cs: true,
    mp: false,
    ccinp: false,
    xens: false,
    e3a: false,
    methodo: false,
  };
}

export function ConcoursWidget({
  onOpenPdf,
  onOpenVideo,
  initialFiliere = null,
  onSelectFiliere,
}: ConcoursWidgetProps) {
  const { currentUser, isTeacher, isAdmin, teacherViewMode, toggleTeacherViewMode } = useAuth();
  const isTeacherView = (isTeacher || isAdmin) && teacherViewMode === "teacher";

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [concoursData, setConcoursData] = useState<ConcoursBlock[]>(() => getConcoursDB());
  const [localFiliere, setLocalFiliere] = useState<FiliereConcours | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [activeMatiere, setActiveMatiere] = useState<MatiereFilter>("all");
  const [activeTheme, setActiveTheme] = useState<string>("all");
  const [openBlocksByFiliere, setOpenBlocksByFiliere] = useState<
    Partial<Record<FiliereConcours, Record<string, boolean>>>
  >({});
  const [filteredOpenOverrides, setFilteredOpenOverrides] = useState<Record<string, boolean>>({});

  const defaultUserFiliere = resolveUserDefaultFiliere(
    isMounted ? currentUser?.filiere : undefined
  );
  const selectedFiliere: FiliereConcours =
    initialFiliere ?? localFiliere ?? defaultUserFiliere;

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
      setFilteredOpenOverrides({});
      setOpenBlocksByFiliere((prev) => ({
        ...prev,
        [fil]: getDefaultOpenBlocks(fil),
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
    let epreuvesWithVideoCount = 0;

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
        if (vLen > 0) epreuvesWithVideoCount++;

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
      epreuvesWithVideoCount,
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
          // 1. Filtrage par matière / vidéo
          if (activeMatiere === "physique") {
            const mat = (s.matiere || "").toLowerCase();
            if (!mat.includes("physique")) return false;
          } else if (activeMatiere === "chimie") {
            const mat = (s.matiere || "").toLowerCase();
            if (mat !== "chimie" && !mat.includes("chimie")) return false;
          } else if (activeMatiere === "videos") {
            const hasVid =
              (s.videos && s.videos.length > 0) || Boolean(s.video && s.video.trim() !== "");
            if (!hasVid) return false;
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
    () => openBlocksByFiliere[selectedFiliere] ?? getDefaultOpenBlocks(selectedFiliere),
    [openBlocksByFiliere, selectedFiliere]
  );

  const isBlockOpen = (id: string) => {
    if (hasActiveSearchOrFilter) {
      return filteredOpenOverrides[id] ?? true;
    }
    return Boolean(currentOpenBlocks[id]);
  };

  const toggleBlock = (id: string) => {
    if (hasActiveSearchOrFilter) {
      setFilteredOpenOverrides((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
      return;
    }
    setOpenBlocksByFiliere((prev) => {
      const base = prev[selectedFiliere] ?? getDefaultOpenBlocks(selectedFiliere);
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
    <div className="w-full max-w-5xl mx-auto my-4 font-sans">
      {/* 1. En-tête Prestigieux Dynamique par Filière */}
      <div className="relative rounded-3xl bg-white/75 dark:bg-[#0d1322]/85 backdrop-blur-2xl border border-white/80 dark:border-purple-500/25 shadow-[0_20px_50px_rgba(124,58,237,0.06),0_1px_2px_rgba(255,255,255,0.95)_inset] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-7 sm:p-10 mb-5 text-center overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full bg-purple-300/30 dark:bg-purple-900/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-indigo-300/25 dark:bg-indigo-900/20 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white dark:via-purple-400/30 to-transparent" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-purple-800 dark:text-purple-300 bg-white/85 dark:bg-purple-950/60 backdrop-blur-md border border-purple-200/90 dark:border-purple-500/30 px-4 py-1.5 rounded-full mb-3.5 shadow-2xs">
            <Trophy className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Annales Officielles CPGE · {activeFiliereInfo.label}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-2.5 tracking-tight">
            Concours{" "}
            <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 dark:from-purple-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
              {activeFiliereInfo.shortLabel}
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Épreuves strictement dédiées à votre filière {activeFiliereInfo.shortLabel} : énoncés PDF, corrigés officiels et vidéos E-Learning Physique classées session par session.
          </p>

          <p className="text-[11px] font-bold text-purple-700/90 dark:text-purple-300/90 mt-3 tracking-wide">
            {activeFiliereInfo.subtitle}
          </p>
        </div>
      </div>

      {/* 1 bis. SÉLECTEUR DE FILIÈRE CPGE (Single-Row Accessible Tablist) */}
      <div className="bg-white dark:bg-[#0d1322] rounded-2xl border border-slate-200/90 dark:border-purple-500/25 shadow-xs p-2 sm:p-2.5 mb-5">
        <div className="flex items-center gap-2 px-2 pb-1.5 sm:pb-2 border-b border-slate-100 dark:border-slate-800/80 mb-1.5">
          <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Choisissez votre filière CPGE :
          </span>
          <span className="ml-auto hidden sm:inline-block text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Affichage strictement filtré (zéro hors-filière)
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
                className={`filiere-tab flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 ${
                  isSelected
                    ? "bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-200"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/70 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>{fil.shortLabel}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isSelected
                      ? "bg-purple-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
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
      {(isTeacher || isAdmin) && (
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
                  {isAdmin ? "Admin" : "Professeur"}
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
        {/* 2. Barre de Statistiques (Dynamique pour la Filière active) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-white dark:bg-[#0d1322] rounded-2xl border border-slate-200 dark:border-slate-800 divide-x divide-slate-100 dark:divide-slate-800 shadow-xs mb-5">
          <div className="p-4 sm:p-5 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 dark:text-purple-400">
              {stats.concours}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
              Banques {selectedFiliere}
            </div>
          </div>
          <div className="p-4 sm:p-5 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.sujets}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
              Énoncés PDF
            </div>
          </div>
          <div className="p-4 sm:p-5 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {stats.corriges}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
              Corrigés PDF
            </div>
          </div>
          <div className="p-4 sm:p-5 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {stats.videos}
            </div>
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">
              Vidéos Intégrées
            </div>
          </div>
        </div>

        {/* 3. Contrôles : Recherche, Matière, Banques & Thèmes */}
        <div className="py-3 space-y-3.5 mb-2">
          {/* Barre de Recherche + Filtres Rapides Matière / Vidéo */}
          <div className="flex flex-col md:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type="text"
                placeholder={`Rechercher en ${activeFiliereInfo.shortLabel} (ex: 2019, induction, RMN, Rosetta, Michelson, Poiseuille)...`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setFilteredOpenOverrides({});
                }}
                className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d18] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0d1322] focus:border-purple-600 dark:focus:border-purple-400 focus:ring-3 focus:ring-purple-600/15 transition-all outline-hidden shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setFilteredOpenOverrides({});
                  }}
                  aria-label="Effacer la recherche"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filtre Matière / Vidéo */}
            <div className="flex items-center gap-1.5 flex-wrap shrink-0">
              {(
                [
                  { id: "all", label: "Tout", icon: Layers, count: stats.totalEpreuves },
                  { id: "physique", label: "Physique", icon: Atom, count: stats.physiqueCount },
                  { id: "chimie", label: "Chimie", icon: FlaskConical, count: stats.chimieCount },
                  {
                    id: "videos",
                    label: "Avec Vidéo",
                    icon: Video,
                    count: stats.epreuvesWithVideoCount,
                  },
                ] as const
              ).map((m) => {
                if (m.id !== "all" && m.count === 0) return null;
                const Icon = m.icon;
                const isAct = activeMatiere === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setActiveMatiere(m.id);
                      setFilteredOpenOverrides({});
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      isAct
                        ? m.id === "videos"
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/25"
                          : "bg-slate-900 dark:bg-purple-600 text-white border-slate-900 dark:border-purple-600 shadow-xs"
                        : "bg-white dark:bg-[#0d1322] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/40"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 rounded-md ${
                        isAct
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {m.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtres par Banque de Concours (uniquement les banques de la filière active) */}
          <div className="flex flex-wrap items-center gap-2">
            {filterOptions.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setActiveFilter(f.id);
                  setFilteredOpenOverrides({});
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${
                  effectiveFilter === f.id
                    ? "bg-purple-700 dark:bg-purple-600 text-white border-purple-700 dark:border-purple-600 shadow-md shadow-purple-700/20"
                    : "bg-white dark:bg-[#0d1322] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:border-purple-200 dark:hover:border-purple-500/40 hover:text-purple-700 dark:hover:text-purple-300"
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 rounded-md ${
                    effectiveFilter === f.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Filtre par Thèmes / Modules CPGE */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Filtrer par thème ({activeFiliereInfo.shortLabel}) :</span>
              </span>
              {activeTheme !== "all" && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveTheme("all");
                    setFilteredOpenOverrides({});
                  }}
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 hover:underline cursor-pointer"
                >
                  Réinitialiser le thème
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {THEMES_MODULES.map((thm) => {
                const count = thm.id === "all" ? stats.totalEpreuves : themeCounts[thm.id] || 0;
                if (thm.id !== "all" && count === 0) return null;
                const isActive = activeTheme === thm.id;
                return (
                  <button
                    key={thm.id}
                    type="button"
                    onClick={() => {
                      setActiveTheme(thm.id);
                      setFilteredOpenOverrides({});
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "bg-purple-700 dark:bg-purple-600 text-white border-purple-700 shadow-sm shadow-purple-700/30 font-bold"
                        : "bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/40"
                    }`}
                  >
                    <span>{thm.icon}</span>
                    <span>{thm.label}</span>
                    <span
                      className={`ml-0.5 px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
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
                  setFilteredOpenOverrides({});
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
                  className="bg-white dark:bg-[#0d1322] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-500/50"
                >
                  {/* Header de bloc */}
                  <div
                    onClick={() => toggleBlock(block.id)}
                    className="flex items-center gap-4 p-5 sm:p-6 cursor-pointer select-none hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-500/30 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                      {block.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                          {block.titre}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200/80 dark:border-purple-500/30">
                          {selectedFiliere}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                        <span className="truncate">{block.meta}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      {blockVideoCount > 0 && (
                        <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-500/30">
                          <Play className="w-3 h-3 fill-current" />
                          <span>{blockVideoCount} vidéos</span>
                        </span>
                      )}

                      <span className="hidden sm:inline-block text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-500/30">
                        {block.sujets.length} Épreuves
                      </span>

                      {isTeacherView && (
                        <div
                          className="flex items-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => openAddEpreuve(block.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors shadow-2xs cursor-pointer"
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

                      <ChevronDown
                        className={`w-5 h-5 text-purple-600 dark:text-purple-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Contenu Dépliable par Session / Année */}
                  {isOpen && (
                    <div className="border-t border-slate-100 dark:border-slate-800/80 divide-y divide-slate-100 dark:divide-slate-800/80 bg-slate-50/30 dark:bg-[#070b14]/40">
                      {sortedYears.map((annee) => (
                        <div key={annee} className="p-4 sm:p-5 space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-500/30 px-2.5 py-0.5 rounded-md min-w-[56px] text-center">
                              {annee}
                            </span>
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                              {/^\d{4}$/.test(annee) ? `Session ${annee}` : annee} · Filière{" "}
                              {activeFiliereInfo.shortLabel}
                            </span>
                          </div>

                          <div className="space-y-2.5 pt-1 pl-0 sm:pl-2">
                            {yearsMap[annee].map((epreuve, idx) => {
                              const isChimie = (epreuve.matiere || "").toLowerCase() === "chimie";
                              const isOral =
                                (epreuve.matiere || "").toLowerCase().includes("oral") ||
                                (epreuve.matiere || "").toLowerCase().includes("méthod");

                              return (
                                <div
                                  key={epreuve.id || idx}
                                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all shadow-2xs group"
                                >
                                  {/* Colonne Gauche : Titre, Badges, Description, Thèmes */}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span
                                        className={`w-2 h-2 rounded-full shrink-0 ${
                                          isChimie
                                            ? "bg-teal-500"
                                            : isOral
                                            ? "bg-indigo-500"
                                            : "bg-purple-500"
                                        }`}
                                      />
                                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                                        {epreuve.label}
                                      </span>
                                      <span
                                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
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

                                    {epreuve.description && (
                                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed pl-4">
                                        {epreuve.description}
                                      </p>
                                    )}

                                    {epreuve.themes && epreuve.themes.length > 0 && (
                                      <div className="flex flex-wrap items-center gap-1.5 mt-2 pl-4">
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
                                              }}
                                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-500/30 hover:bg-purple-100 hover:border-purple-400 transition-colors cursor-pointer"
                                              title={`Filtrer par le module ${thInfo.label}`}
                                            >
                                              <span>{thInfo.icon}</span>
                                              <span>{thInfo.label}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>

                                  {/* Colonne Droite : Boutons Énoncé, Corrigés & Vidéos E-Learning Physique */}
                                  <div className="flex items-center gap-2 shrink-0 flex-wrap pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                                    {/* Bouton Énoncé PDF */}
                                    {epreuve.enonce && epreuve.enonce.trim() !== "" && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          onOpenPdf(
                                            epreuve.enonce,
                                            `${block.titre} ${annee} (${selectedFiliere}) — ${epreuve.label} (Énoncé)`
                                          )
                                        }
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all cursor-pointer shadow-2xs"
                                      >
                                        <FileText className="w-3.5 h-3.5" />
                                        <span>Énoncé</span>
                                      </button>
                                    )}

                                    {/* Boutons Corrigés PDF */}
                                    {epreuve.corriges && epreuve.corriges.length > 0 ? (
                                      epreuve.corriges.map((corr, cIdx) => (
                                        <button
                                          key={corr.id || cIdx}
                                          type="button"
                                          onClick={() =>
                                            onOpenPdf(
                                              corr.url,
                                              `${block.titre} ${annee} (${selectedFiliere}) — ${epreuve.label} (${corr.titre})`
                                            )
                                          }
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all cursor-pointer shadow-2xs"
                                          title={corr.titre}
                                        >
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                          <span className="truncate max-w-[130px]">
                                            {corr.titre || `Corrigé P.${cIdx + 1}`}
                                          </span>
                                        </button>
                                      ))
                                    ) : epreuve.correction && epreuve.correction.trim() !== "" ? (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          onOpenPdf(
                                            epreuve.correction,
                                            `${block.titre} ${annee} (${selectedFiliere}) — ${epreuve.label} (Corrigé)`
                                          )
                                        }
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all cursor-pointer shadow-2xs"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Corrigé</span>
                                      </button>
                                    ) : null}

                                    {/* Vidéos E-Learning Physique associées exactement à cette épreuve */}
                                    {epreuve.videos && epreuve.videos.length > 0 ? (
                                      epreuve.videos.map((vid, vIdx) => (
                                        <button
                                          key={vid.id || vIdx}
                                          type="button"
                                          onClick={() =>
                                            onOpenVideo(
                                              vid.url,
                                              `${block.titre} ${annee} (${selectedFiliere}) — ${vid.title}`
                                            )
                                          }
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/70 dark:hover:bg-purple-900/80 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-500/40 transition-all cursor-pointer shadow-2xs"
                                          title={vid.title}
                                        >
                                          <Play className="w-3.5 h-3.5 fill-purple-700 dark:fill-purple-300 text-purple-700 dark:text-purple-300 shrink-0" />
                                          <span className="truncate max-w-[175px]">
                                            {epreuve.videos!.length > 1
                                              ? `Vidéo ${vIdx + 1}/${epreuve.videos!.length}`
                                              : "Corrigé Vidéo"}
                                            {vid.duration ? ` · ${vid.duration}` : ""}
                                          </span>
                                        </button>
                                      ))
                                    ) : epreuve.video ? (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          onOpenVideo(
                                            epreuve.video!,
                                            `${block.titre} ${annee} (${selectedFiliere}) — ${epreuve.label}`
                                          )
                                        }
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/70 dark:hover:bg-purple-900/80 text-purple-800 dark:text-purple-200 border border-purple-300 dark:border-purple-500/40 transition-all cursor-pointer shadow-2xs"
                                      >
                                        <Play className="w-3.5 h-3.5 fill-purple-700 dark:fill-purple-300 text-purple-700 dark:text-purple-300" />
                                        <span>Corrigé Vidéo</span>
                                      </button>
                                    ) : null}

                                    {/* Boutons Enseignant / Admin */}
                                    {isTeacherView && (
                                      <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-800">
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
                                  </div>
                                </div>
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
