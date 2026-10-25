"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ConcoursBlock, EpreuveItem, CorrigePartieItem } from "./pcConcoursData";
import {
  Search,
  X,
  ChevronDown,
  FileText,
  CheckCircle2,
  Play,
  Trophy,
  Video,
  Sparkles,
  Edit2,
  Trash2,
  PlusCircle,
  Eye,
} from "lucide-react";
import { ELEARNING_PHYSICS_VIDEOS, ElearningVideoItem } from "@/data/elearningPhysiqueData";
import { useAuth } from "@/context/AuthContext";
import {
  getConcoursDB,
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
}

export function ConcoursWidget({ onOpenPdf, onOpenVideo }: ConcoursWidgetProps) {
  const { isTeacher, isAdmin, teacherViewMode, toggleTeacherViewMode } = useAuth();
  const isTeacherView = (isTeacher || isAdmin) && teacherViewMode === "teacher";

  const [concoursData, setConcoursData] = useState<ConcoursBlock[]>(() => getConcoursDB());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [openBlocks, setOpenBlocks] = useState<Record<string, boolean>>({
    cnc: true,
    xens: true,
    methodo: true,
    elearning: true,
  });

  const refreshConcours = () => {
    setConcoursData(getConcoursDB());
  };

  useEffect(() => {
    refreshConcours();
  }, []);

  const toggleBlock = (id: string) => {
    setOpenBlocks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ══════════════════════════════════════════════════════════════════════════
  // ÉTATS ET GESTIONNAIRES MODALS D'ADMINISTRATION
  // ══════════════════════════════════════════════════════════════════════════
  const [activeModal, setActiveModal] = useState<
    "create_concours" | "edit_concours" | "create_epreuve" | "edit_epreuve" | null
  >(null);

  // Formulaire Concours
  const [editingConcoursId, setEditingConcoursId] = useState<string | null>(null);
  const [concoursFormTitre, setConcoursFormTitre] = useState("");
  const [concoursFormMeta, setConcoursFormMeta] = useState("");
  const [concoursFormIcon, setConcoursFormIcon] = useState("🏆");

  // Formulaire Épreuve
  const [targetConcoursId, setTargetConcoursId] = useState<string | null>(null);
  const [editingEpreuveId, setEditingEpreuveId] = useState<string | null>(null);
  const [epreuveFormAnnee, setEpreuveFormAnnee] = useState("");
  const [epreuveFormFiliere, setEpreuveFormFiliere] = useState("MP / PC");
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
    setConcoursFormMeta(block.meta || "");
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

  const handleDeleteConcours = (blockId: string) => {
    deleteConcoursBlock(blockId);
    refreshConcours();
  };

  const openAddEpreuve = (blockId: string) => {
    setTargetConcoursId(blockId);
    setEditingEpreuveId(null);
    setEpreuveFormAnnee(new Date().getFullYear().toString());
    setEpreuveFormFiliere("MP / PC");
    setEpreuveFormLabel("");
    setEpreuveFormEnonce("");
    setEpreuveFormCorriges([
      {
        id: `corr-${Date.now()}`,
        titre: "Corrigé Détaillé Officiel",
        url: "",
      },
    ]);
    setEpreuveFormVideo("");
    setActiveModal("create_epreuve");
  };

  const openEditEpreuve = (blockId: string, epreuve: EpreuveItem) => {
    setTargetConcoursId(blockId);
    setEditingEpreuveId(epreuve.id || epreuve.label);
    setEpreuveFormAnnee(String(epreuve.annee));
    setEpreuveFormFiliere(epreuve.filiere || "MP / PC");
    setEpreuveFormLabel(epreuve.label || "");
    setEpreuveFormEnonce(epreuve.enonce || "");

    const parts: CorrigePartieItem[] = [];
    if (epreuve.corriges && Array.isArray(epreuve.corriges)) {
      epreuve.corriges.forEach((c) => {
        parts.push({
          id: c.id || `corr-${Math.random()}`,
          titre: c.titre || "Corrigé",
          url: c.url || "",
        });
      });
    }
    if (parts.length === 0 && epreuve.correction) {
      parts.push({
        id: `corr-${Date.now()}`,
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
        filiere: epreuveFormFiliere.trim(),
        label: epreuveFormLabel.trim(),
        enonce: epreuveFormEnonce.trim(),
        corriges: cleanCorriges,
        video: epreuveFormVideo.trim() || null,
      });
    } else if (activeModal === "edit_epreuve" && editingEpreuveId) {
      editEpreuveInConcours(targetConcoursId, editingEpreuveId, {
        annee: epreuveFormAnnee.trim(),
        filiere: epreuveFormFiliere.trim(),
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

  // Calcul des statistiques
  const stats = useMemo(() => {
    let sujetsCount = 0;
    let corrigesCount = 0;
    let videosCount = 0;

    concoursData.forEach((b) => {
      b.sujets.forEach((s) => {
        if (s.enonce && s.enonce.trim() !== "") sujetsCount++;
        const hasCorriges = (s.corriges && s.corriges.length > 0) || Boolean(s.correction && s.correction.trim() !== "");
        if (hasCorriges) corrigesCount++;
        if (s.video && s.video.trim() !== "") videosCount++;
      });
    });

    const elearningCount = ELEARNING_PHYSICS_VIDEOS.filter((v) => v.moduleId === "concours").length;

    return {
      concours: concoursData.length,
      sujets: sujetsCount,
      corriges: corrigesCount,
      videos: videosCount + elearningCount,
      elearningVideos: elearningCount,
    };
  }, [concoursData]);

  // Options dynamiques des filtres
  const filterOptions = useMemo(() => {
    const list = [{ id: "all", label: "Tous les concours" }];
    concoursData.forEach((b) => {
      list.push({
        id: b.id,
        label: `${b.icon || "🏆"} ${b.titre}`,
      });
    });
    return list;
  }, [concoursData]);

  // Filtrage
  const filteredBlocks = useMemo(() => {
    return concoursData.map((block) => {
      if (activeFilter !== "all" && block.id !== activeFilter) {
        return null;
      }

      const q = searchQuery.trim().toLowerCase();
      const filteredSujets = block.sujets.filter((s) => {
        if (!q) return true;
        return (
          s.annee.toString().includes(q) ||
          s.label.toLowerCase().includes(q) ||
          block.titre.toLowerCase().includes(q)
        );
      });

      if (filteredSujets.length === 0 && q) return null;

      return {
        ...block,
        sujets: filteredSujets,
      };
    }).filter(Boolean) as ConcoursBlock[];
  }, [concoursData, activeFilter, searchQuery]);

  const elearningConcoursVideos = useMemo(() => {
    return ELEARNING_PHYSICS_VIDEOS.filter((v) => {
      if (v.moduleId !== "concours") return false;

      if (activeFilter === "xens" && v.concoursTag !== "X-ENS") return false;
      if (activeFilter === "mp" && v.concoursTag !== "Mines-Ponts") return false;
      if (activeFilter === "cs" && v.concoursTag !== "Centrale-Supélec") return false;
      if (activeFilter === "ccinp" && v.concoursTag !== "CCINP / CCP") return false;
      if (activeFilter === "methodo" && v.concoursTag !== "TP Concours") return false;

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        return (
          v.title.toLowerCase().includes(q) ||
          v.chapitre.toLowerCase().includes(q) ||
          (v.concoursTag && v.concoursTag.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activeFilter, searchQuery]);

  return (
    <div className="w-full max-w-5xl mx-auto my-4 font-sans">
      {/* 1. En-tête Prestigieux Lumineux — Décor comme des verres */}
      <div className="relative rounded-3xl bg-white/70 dark:bg-[#0d1322]/80 backdrop-blur-2xl border border-white/80 dark:border-purple-500/25 shadow-[0_20px_50px_rgba(124,58,237,0.06),0_1px_2px_rgba(255,255,255,0.95)_inset] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 sm:p-12 mb-6 text-center overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full bg-purple-300/30 dark:bg-purple-900/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-indigo-300/25 dark:bg-indigo-900/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-white/60 dark:bg-purple-950/20 blur-2xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white dark:via-purple-400/30 to-transparent" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-purple-800 dark:text-purple-300 bg-white/85 dark:bg-purple-950/60 backdrop-blur-md border border-purple-200/90 dark:border-purple-500/30 px-4 py-1.5 rounded-full mb-4 shadow-2xs">
            <Trophy className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Excellence Concours CPGE · MP / MP* & PC
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            Concours de <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 dark:from-purple-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">Physique-Chimie</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
            Sujets officiels, énoncés PDF, corrigés rédigés détaillés et résolutions vidéo — organisés par concours et session.
          </p>

          <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-purple-500/20 text-slate-700 dark:text-slate-300 shadow-2xs">
              CNC Maroc
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-purple-500/20 text-slate-700 dark:text-slate-300 shadow-2xs">
              Mines-Ponts
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-purple-500/20 text-slate-700 dark:text-slate-300 shadow-2xs">
              Centrale-Supélec & CCINP
            </span>
          </div>
        </div>
      </div>

      {/* ── BARRE D'ADMINISTRATION ENSEIGNANT / ADMIN ── */}
      {(isTeacher || isAdmin) && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-purple-950/90 text-white border border-purple-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-200">
              <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-white">
                  Administration des Concours CPGE
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-purple-500 text-white shadow-2xs">
                  {isAdmin ? "Admin" : "Professeur"}
                </span>
              </div>
              <p className="text-xs text-purple-200/80 mt-0.5">
                {isTeacherView
                  ? "Mode édition actif : vous pouvez modifier les énoncés, ajouter des parties de corrigés et créer de nouveaux concours"
                  : "Aperçu étudiant actif : cliquez sur « Activer Mode Éditeur » pour modifier les épreuves"}
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
              <button
                type="button"
                onClick={openAddConcours}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white border border-purple-400 flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>+ Nouveau Concours</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Barre de Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-white dark:bg-[#0d1322] rounded-2xl border border-slate-200 dark:border-slate-800 divide-x divide-slate-100 dark:divide-slate-800 shadow-xs mb-6">
        <div className="p-4 sm:p-5 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 dark:text-purple-400">{stats.concours}</div>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Banques Concours</div>
        </div>
        <div className="p-4 sm:p-5 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{stats.sujets}</div>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Sujets PDF</div>
        </div>
        <div className="p-4 sm:p-5 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{stats.corriges}</div>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Corrigés Détaillés</div>
        </div>
        <div className="p-4 sm:p-5 text-center">
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 dark:text-purple-400">{stats.videos}</div>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">Vidéos Méthodes</div>
        </div>
      </div>

      {/* 3. Contrôles : Recherche & Filtres */}
      <div className="py-4 space-y-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            placeholder="Rechercher une année (ex: 2026, 2024), une épreuve (ex: induction, thermodynamique, Michelson)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d18] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0d1322] focus:border-purple-600 dark:focus:border-purple-400 focus:ring-3 focus:ring-purple-600/15 transition-all outline-hidden shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Boutons de filtres */}
        <div className="flex flex-wrap items-center gap-2">
          {filterOptions.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all duration-200 cursor-pointer ${
                activeFilter === f.id
                  ? "bg-purple-700 dark:bg-purple-600 text-white border-purple-700 dark:border-purple-600 shadow-md shadow-purple-700/20"
                  : "bg-white dark:bg-[#0d1322] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:border-purple-200 dark:hover:border-purple-500/40 hover:text-purple-700 dark:hover:text-purple-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Liste des Blocs Concours (Accordéon) */}
      <div className="space-y-4">
        {filteredBlocks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#0d1322] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            Aucune épreuve de concours ne correspond à votre recherche.
          </div>
        ) : (
          filteredBlocks.map((block) => {
            const isOpen = openBlocks[block.id] ?? false;

            const yearsMap: Record<string, EpreuveItem[]> = {};
            block.sujets.forEach((s) => {
              const anneeKey = String(s.annee);
              if (!yearsMap[anneeKey]) yearsMap[anneeKey] = [];
              yearsMap[anneeKey].push(s);
            });
            const sortedYears = Object.keys(yearsMap).sort((a, b) => {
              const numA = parseInt(a, 10);
              const numB = parseInt(b, 10);
              if (!isNaN(numA) && !isNaN(numB)) return numB - numA;
              if (!isNaN(numA)) return -1;
              if (!isNaN(numB)) return 1;
              return a.localeCompare(b);
            });

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
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                      {block.titre}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      {block.meta}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="hidden sm:inline-block text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-500/30">
                      {block.sujets.length} Épreuves
                    </span>

                    {/* Actions Administrateur / Enseignant sur le Concours */}
                    {isTeacherView && (
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
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
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:text-slate-400 dark:hover:text-purple-300 dark:hover:bg-purple-950/60 transition-colors cursor-pointer"
                          title="Modifier le nom et la description de ce concours"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Confirmez-vous la suppression du concours « ${block.titre} » et de ses épreuves ?`)) {
                              handleDeleteConcours(block.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors cursor-pointer"
                          title="Supprimer ce concours"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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

                {/* Corps de l'accordéon */}
                {isOpen && (
                  <div className="border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 bg-slate-50/40 dark:bg-[#090d18]/40">
                    {sortedYears.map((annee) => (
                      <div key={annee} className="p-4 sm:p-5 space-y-2.5">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-500/30 px-2.5 py-0.5 rounded-md min-w-[50px] text-center">
                            {annee}
                          </span>
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                            {isNaN(Number(annee)) ? annee : `Session ${annee}`} · Filière {yearsMap[annee][0]?.filiere || "MP / MP* & PC"}
                          </span>
                        </div>

                        <div className="space-y-2 pt-1 pl-0 sm:pl-2">
                          {yearsMap[annee].map((epreuve, idx) => (
                            <div
                              key={epreuve.id || idx}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all shadow-2xs group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {epreuve.label}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                {epreuve.enonce && epreuve.enonce.trim() !== "" ? (
                                  <button
                                    onClick={() =>
                                      onOpenPdf(
                                        epreuve.enonce,
                                        `${block.titre} ${annee} — ${epreuve.label} (Énoncé)`
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all cursor-pointer"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>Énoncé</span>
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-slate-400 dark:text-slate-500 italic px-2">Énoncé bientôt</span>
                                )}

                                {/* Corrigés multiples ou corrigé unique */}
                                {epreuve.corriges && epreuve.corriges.length > 0 ? (
                                  epreuve.corriges.map((corr, cIdx) => (
                                    <button
                                      key={corr.id || cIdx}
                                      onClick={() =>
                                        onOpenPdf(
                                          corr.url,
                                          `${block.titre} ${annee} — ${epreuve.label} (${corr.titre})`
                                        )
                                      }
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all cursor-pointer"
                                      title={corr.titre}
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span className="truncate max-w-[130px]">{corr.titre || `Corrigé P.${cIdx + 1}`}</span>
                                    </button>
                                  ))
                                ) : epreuve.correction && epreuve.correction.trim() !== "" ? (
                                  <button
                                    onClick={() =>
                                      onOpenPdf(
                                        epreuve.correction,
                                        `${block.titre} ${annee} — ${epreuve.label} (Corrigé)`
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Corrigé</span>
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-slate-400 dark:text-slate-500 italic px-2">Corrigé à venir</span>
                                )}

                                {epreuve.video && (
                                  <button
                                    onClick={() =>
                                      onOpenVideo(
                                        epreuve.video!,
                                        `${block.titre} ${annee} — ${epreuve.label}`
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30 hover:bg-red-100 dark:hover:bg-red-900/60 transition-all cursor-pointer"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                                    <span>Vidéo</span>
                                  </button>
                                )}

                                {/* Boutons Enseignant / Admin pour l'épreuve */}
                                {isTeacherView && (
                                  <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-800">
                                    <button
                                      type="button"
                                      onClick={() => openEditEpreuve(block.id, epreuve)}
                                      className="p-1.5 rounded-lg text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/50 transition-colors cursor-pointer"
                                      title="Modifier cette épreuve (énoncé, parties de corrigés, nom)"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm(`Confirmez-vous la suppression de l'épreuve « ${epreuve.label} » ?`)) {
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
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* 4. BLOC DES VIDÉOS E-LEARNING PHYSIQUE CONCOURS (144 Vidéos) */}
        {elearningConcoursVideos.length > 0 && (
          <div className="bg-white dark:bg-[#0d1322] rounded-2xl border-2 border-purple-200 dark:border-purple-600/40 overflow-hidden shadow-sm transition-all mt-4">
            <button
              onClick={() => toggleBlock("elearning")}
              className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white dark:from-purple-950/40 dark:via-indigo-950/20 dark:to-transparent border-b border-purple-100 dark:border-purple-900/30 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎬</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Corrigés Vidéos & Oraux CPGE (E-Learning Physique)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-600 text-white shadow-2xs">
                      {elearningConcoursVideos.length} Vidéos
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Résolutions pas à pas des planches d'oraux et épreuves écrites (X-ENS, Mines-Ponts, Centrale-Supélec, CCINP, TP)
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-purple-600 dark:text-purple-400 transition-transform duration-200 ${
                  openBlocks["elearning"] ? "rotate-180" : ""
                }`}
              />
            </button>

            {openBlocks["elearning"] && (
              <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {elearningConcoursVideos.map((v) => (
                  <div
                    key={v.id}
                    className="flex flex-col justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-500/50 transition-all group shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                          {v.concoursTag || "Concours CPGE"}
                        </span>
                        <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
                          {v.durationFormatted}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {v.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {v.chapitre}
                      </p>
                    </div>

                    <button
                      onClick={() => onOpenVideo(v.youtubeUrl, v.title)}
                      className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-2xs transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Visionner le corrigé</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
                    {activeModal === "create_concours" ? "Ajouter une Banque de Concours" : "Modifier la Banque de Concours"}
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
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
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
                    placeholder="ex: e3a-Polytech ou CNC TSI"
                    value={concoursFormTitre}
                    onChange={(e) => setConcoursFormTitre(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Sous-titre / Filières
                </label>
                <input
                  type="text"
                  placeholder="ex: France · Filière MP / PC / PSI · Épreuves officielles & Corrigés détaillés"
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
                  {activeModal === "create_concours" ? "Créer le concours" : "Enregistrer les modifications"}
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
                    {activeModal === "create_epreuve" ? "Ajouter une Épreuve" : "Modifier l'Épreuve & Corrigés"}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Dans : {concoursData.find((b) => b.id === targetConcoursId)?.titre || "Concours"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setEditingEpreuveId(null);
                  setTargetConcoursId(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEpreuve} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Année / Session *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: 2024, 2025 ou CNC Book"
                    value={epreuveFormAnnee}
                    onChange={(e) => setEpreuveFormAnnee(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Filière
                  </label>
                  <input
                    type="text"
                    placeholder="ex: MP / PC, TSI, MP*"
                    value={epreuveFormFiliere}
                    onChange={(e) => setEpreuveFormFiliere(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre / Libellé de l'épreuve *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: CNC 2024 · Physique-Chimie (Électrodynamique et Ondes)"
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
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={epreuveFormEnonce}
                  onChange={(e) => setEpreuveFormEnonce(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 font-mono"
                />
              </div>

              {/* Parties de Corrigés (Multi-parties de corrections) */}
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
                          id: `corr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                          titre: prev.length === 0 ? "Corrigé Détaillé Officiel" : `Corrigé Partie ${prev.length + 1}`,
                          url: "",
                        },
                      ]);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Ajouter une partie de corrigé</span>
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
                            id: `corr-${Date.now()}`,
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
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 space-y-2 relative group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            placeholder="Nom du corrigé (ex: Partie 1 : Mécanique, Corrigé Complet)"
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
                              setEpreuveFormCorriges((prev) => prev.filter((_, idx) => idx !== cIdx));
                            }}
                            className="p-1 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                            title="Supprimer cette partie"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/file/d/.../view"
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
                  Lien Vidéo Résolution (YouTube ou Google Drive - Optionnel)
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... ou Drive"
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
                  {activeModal === "create_epreuve" ? "Ajouter l'épreuve" : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
