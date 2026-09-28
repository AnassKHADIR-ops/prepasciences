"use client";

import React, { useState, useMemo } from "react";
import { PC_CONCOURS_DATA, ConcoursBlock, EpreuveItem } from "./pcConcoursData";
import { Search, X, ChevronDown, FileText, CheckCircle2, Play, Trophy } from "lucide-react";

interface ConcoursWidgetProps {
  onOpenPdf: (url: string, title: string) => void;
  onOpenVideo: (url: string, title: string) => void;
}

export function ConcoursWidget({ onOpenPdf, onOpenVideo }: ConcoursWidgetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [openBlocks, setOpenBlocks] = useState<Record<string, boolean>>({
    cnc: true,
    mp: true,
  });

  const toggleBlock = (id: string) => {
    setOpenBlocks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Calcul des statistiques
  const stats = useMemo(() => {
    let sujetsCount = 0;
    let corrigesCount = 0;
    let videosCount = 0;

    PC_CONCOURS_DATA.forEach((b) => {
      b.sujets.forEach((s) => {
        if (s.enonce) sujetsCount++;
        if (s.correction) corrigesCount++;
        if (s.video) videosCount++;
      });
    });

    return {
      concours: PC_CONCOURS_DATA.length,
      sujets: sujetsCount,
      corriges: corrigesCount,
      videos: videosCount,
    };
  }, []);

  // Filtrage
  const filteredBlocks = useMemo(() => {
    return PC_CONCOURS_DATA.map((block) => {
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
  }, [activeFilter, searchQuery]);

  return (
    <div className="w-full max-w-5xl mx-auto my-4 font-sans">
      {/* 1. En-tête Prestigieux Lumineux — Décor comme des verres (Frosted Crystal Glassmorphism) */}
      <div className="relative rounded-3xl bg-white/70 dark:bg-[#0d1322]/80 backdrop-blur-2xl border border-white/80 dark:border-purple-500/25 shadow-[0_20px_50px_rgba(124,58,237,0.06),0_1px_2px_rgba(255,255,255,0.95)_inset] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 sm:p-12 mb-6 text-center overflow-hidden">
        {/* Halos lumineux iridescents sous le verre */}
        <div className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full bg-purple-300/30 dark:bg-purple-900/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-indigo-300/25 dark:bg-indigo-900/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-white/60 dark:bg-purple-950/20 blur-2xl" />

        {/* Ligne spéculaire de réfraction du verre en haut */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white dark:via-purple-400/30 to-transparent" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-purple-800 dark:text-purple-300 bg-white/85 dark:bg-purple-950/60 backdrop-blur-md border border-purple-200/90 dark:border-purple-500/30 px-4 py-1.5 rounded-full mb-4 shadow-2xs">
            <Trophy className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Excellence Concours CPGE · MP / MP*
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
            Concours de <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 dark:from-purple-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">Physique-Chimie</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
            Sujets officiels, corrigés rédigés détaillés et résolutions vidéo — filière MP / MP*, organisés par concours et session.
          </p>

          {/* Facettes en verre */}
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
          {[
            { id: "all", label: "Tous les concours" },
            { id: "cnc", label: "🇲🇦 CNC Maroc" },
            { id: "mp", label: "⛏️ Mines-Ponts" },
            { id: "ccinp", label: "🎯 CCINP" },
            { id: "cs", label: "⚡ Centrale-Supélec" },
            { id: "xens", label: "🔬 X-ENS" },
          ].map((f) => (
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

            const yearsMap: Record<number, EpreuveItem[]> = {};
            block.sujets.forEach((s) => {
              if (!yearsMap[s.annee]) yearsMap[s.annee] = [];
              yearsMap[s.annee].push(s);
            });
            const sortedYears = Object.keys(yearsMap)
              .map(Number)
              .sort((a, b) => b - a);

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
                            Session {annee} · Filière MP / MP*
                          </span>
                        </div>

                        <div className="space-y-2 pt-1 pl-0 sm:pl-2">
                          {yearsMap[annee].map((epreuve, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all shadow-2xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {epreuve.label}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {epreuve.enonce ? (
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

                                {epreuve.correction ? (
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
      </div>
    </div>
  );
}
