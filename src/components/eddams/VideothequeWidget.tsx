"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  PlayCircle,
  Clock,
  Layers,
  Sparkles,
  BookOpen,
  FileText,
  Filter,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Info,
  Download,
  Flame,
  Award,
} from "lucide-react";
import {
  ELEARNING_PHYSICS_VIDEOS,
  ElearningVideoItem,
  FiliereCPGE,
  NiveauCPGE,
  DomainePhysique,
  filterVideosByFiliere,
  getFiliereStats,
  OFFICIAL_SYLLABUS_FILES,
} from "@/data/elearningPhysiqueData";

interface VideothequeWidgetProps {
  onOpenVideo: (url: string, title: string) => void;
  onOpenPdf: (url: string, title: string) => void;
  initialFiliere?: FiliereCPGE | "ALL";
}

const DOMAINES_LIST: { id: string; label: string; icon: string }[] = [
  { id: "ALL", label: "Tous les domaines", icon: "📚" },
  { id: "Électromagnétisme & Induction", label: "Électromagnétisme & Induction", icon: "⚡" },
  { id: "Mécanique des Fluides", label: "Mécanique des Fluides", icon: "🌊" },
  { id: "Mécanique & Solide", label: "Mécanique & Solide", icon: "⚙️" },
  { id: "Thermodynamique & Transferts", label: "Thermodynamique & Transferts", icon: "🔥" },
  { id: "Électronique & Signal", label: "Électronique & Signal", icon: "📡" },
  { id: "Physique des Ondes", label: "Physique des Ondes", icon: "〰️" },
  { id: "Optique Ondulatoire & Géométrique", label: "Optique Ondulatoire & Géométrique", icon: "🔬" },
  { id: "Physique Quantique", label: "Physique Quantique", icon: "⚛️" },
  { id: "Électromagnétisme & Conversion", label: "Conversion Électromécanique", icon: "🔄" },
  { id: "Annales & Corrigés de Concours", label: "Annales & Corrigés de Concours", icon: "🏆" },
  { id: "Travaux Pratiques & Épreuves Orales", label: "TP & Travaux Pratiques", icon: "🧪" },
  { id: "Chimie CPGE", label: "Chimie CPGE", icon: "⚗️" },
  { id: "Outils & Méthodologie", label: "Outils & Méthodes", icon: "📐" },
];

export function VideothequeWidget({
  onOpenVideo,
  onOpenPdf,
  initialFiliere = "PSI",
}: VideothequeWidgetProps) {
  const [selectedFiliere, setSelectedFiliere] = useState<FiliereCPGE | "ALL">(initialFiliere);
  const [selectedNiveau, setSelectedNiveau] = useState<NiveauCPGE>("tous");
  const [selectedDomaine, setSelectedDomaine] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [syllabusModalOpen, setSyllabusModalOpen] = useState(false);

  // Statistiques globales
  const stats = useMemo(() => getFiliereStats(ELEARNING_PHYSICS_VIDEOS), []);

  // Filtrage ultra-précis selon les règles pédagogiques officielles
  const filteredVideos = useMemo(() => {
    return filterVideosByFiliere(ELEARNING_PHYSICS_VIDEOS, selectedFiliere, {
      niveau: selectedNiveau,
      domaine: selectedDomaine,
      searchQuery: searchQuery,
    });
  }, [selectedFiliere, selectedNiveau, selectedDomaine, searchQuery]);

  // Regroupement par Domaine
  const groupedVideos = useMemo(() => {
    const map = new Map<string, ElearningVideoItem[]>();
    for (const v of filteredVideos) {
      if (!map.has(v.domaine)) {
        map.set(v.domaine, []);
      }
      map.get(v.domaine)!.push(v);
    }
    return Array.from(map.entries());
  }, [filteredVideos]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* ── EN-TÊTE PRINCIPAL ── */}
      <div className="bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/20 dark:from-[#0d1322] dark:via-[#111827] dark:to-[#0f172a] rounded-3xl border border-slate-200/90 dark:border-purple-500/20 p-6 sm:p-10 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/80 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 text-xs font-bold font-mono tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              VIDÉOTHÈQUE OFFICIELLE CPGE · E-LEARNING PHYSIQUE
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Catalogue Pédagogique Intégral & Replays
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong className="text-purple-700 dark:text-purple-400">Catalogue complet de cours et replays</strong> ordonnés
              par discipline, chapitre et filière selon les programmes officiels CPGE (MPSI, PCSI, MP, PSI, PC, TSI). Les ressources sont enrichies régulièrement chaque semaine.
            </p>
          </div>

          {/* Bouton Programmes Officiels CPGE */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setSyllabusModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Programmes Officiels (PDF)</span>
            </button>
          </div>
        </div>

        {/* ── SÉLECTEUR DE FILIÈRE RÉVOLUTIONNAIRE ── */}
        <div className="mt-8 pt-8 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-600" />
              Filtrer par Filière CPGE
            </span>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
              Mise à jour continue
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {/* TOUTES */}
            <button
              type="button"
              onClick={() => setSelectedFiliere("ALL")}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedFiliere === "ALL"
                  ? "bg-purple-600 text-white border-purple-600 shadow-md scale-[1.02]"
                  : "bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold">Toutes filières</span>
                {selectedFiliere === "ALL" && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <span
                className={`text-[11px] leading-snug line-clamp-1 ${
                  selectedFiliere === "ALL" ? "text-purple-100" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                Intégralité du catalogue
              </span>
            </button>

            {/* PSI */}
            <button
              type="button"
              onClick={() => setSelectedFiliere("PSI")}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedFiliere === "PSI"
                  ? "bg-purple-600 text-white border-purple-600 shadow-md scale-[1.02]"
                  : "bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold flex items-center gap-1.5">
                  PSI / PSI*
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                </span>
                {selectedFiliere === "PSI" && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <span
                className={`text-[11px] leading-snug line-clamp-1 ${
                  selectedFiliere === "PSI" ? "text-purple-100" : "text-purple-600 dark:text-purple-400"
                }`}
              >
                PSI + Tronc Commun MP
              </span>
            </button>

            {/* MP */}
            <button
              type="button"
              onClick={() => setSelectedFiliere("MP")}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedFiliere === "MP"
                  ? "bg-purple-600 text-white border-purple-600 shadow-md scale-[1.02]"
                  : "bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold">MP / MP*</span>
                {selectedFiliere === "MP" && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <span
                className={`text-[11px] leading-snug line-clamp-1 ${
                  selectedFiliere === "MP" ? "text-purple-100" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                MP + Tronc Commun PSI
              </span>
            </button>

            {/* PC */}
            <button
              type="button"
              onClick={() => setSelectedFiliere("PC")}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedFiliere === "PC"
                  ? "bg-purple-600 text-white border-purple-600 shadow-md scale-[1.02]"
                  : "bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold">PC / PC*</span>
                {selectedFiliere === "PC" && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <span
                className={`text-[11px] leading-snug line-clamp-1 ${
                  selectedFiliere === "PC" ? "text-purple-100" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                PC + Tronc Commun
              </span>
            </button>

            {/* TSI */}
            <button
              type="button"
              onClick={() => setSelectedFiliere("TSI")}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedFiliere === "TSI"
                  ? "bg-purple-600 text-white border-purple-600 shadow-md scale-[1.02]"
                  : "bg-white dark:bg-[#111827] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold">TSI</span>
                {selectedFiliere === "TSI" && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <span
                className={`text-[11px] leading-snug line-clamp-1 ${
                  selectedFiliere === "TSI" ? "text-purple-100" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                TSI + Tronc Commun
              </span>
            </button>
          </div>

          {/* Bandeau d'explication pédagogique pour la filière sélectionnée */}
          {selectedFiliere === "PSI" && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <strong className="font-bold">Filière PSI active :</strong> Vous avez accès à l&apos;intégralité des
                cours du programme de PSI, incluant les{" "}
                <span className="underline font-semibold">cours communs avec MP</span> (Électromagnétisme, Thermodynamique,
                Mécanique du solide, Ondes, Optique, Électronique) ainsi que les cours{" "}
                <span className="underline font-semibold">spécifiques à la PSI</span> (Mécanique des fluides en écoulement,
                Bilans industriels, Machines synchrones et régulation). La Physique Quantique (hors programme en PSI) est
                automatiquement masquée.
              </div>
            </div>
          )}

          {selectedFiliere === "MP" && (
            <div className="mt-4 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
              <Info className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <strong className="font-bold">Filière MP active :</strong> Affichage de tous les cours du programme de MP
                (Physique Quantique, Thermodynamique statistique de Boltzmann, Mécanique du solide, Électromagnétisme,
                Optique, Ondes) et exclusion des écoulements visqueux de fluides (qui ne sont pas au programme de MP).
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── BARRE D'OUTILS ET FILTRES SECONDAIRES ── */}
      <div className="bg-white dark:bg-[#0d1322] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Recherche textuelle */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un cours, un chapitre, un concours (ex: Bernoulli, Maxwell, Centrale, Ondes)..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Filtre Niveau (Sup / Spé) */}
        <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedNiveau("tous")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedNiveau === "tous"
                ? "bg-white dark:bg-[#1a2333] text-purple-700 dark:text-purple-300 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Tous niveaux
          </button>
          <button
            type="button"
            onClick={() => setSelectedNiveau("sup")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedNiveau === "sup"
                ? "bg-white dark:bg-[#1a2333] text-purple-700 dark:text-purple-300 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            1ère Année (Sup)
          </button>
          <button
            type="button"
            onClick={() => setSelectedNiveau("spe")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedNiveau === "spe"
                ? "bg-white dark:bg-[#1a2333] text-purple-700 dark:text-purple-300 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            2ème Année (Spé)
          </button>
        </div>

        {/* Sélecteur de Domaine */}
        <div className="relative shrink-0">
          <select
            value={selectedDomaine}
            onChange={(e) => setSelectedDomaine(e.target.value)}
            className="w-full sm:w-auto appearance-none pl-3.5 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            {DOMAINES_LIST.map((d) => (
              <option key={d.id} value={d.id}>
                {d.icon} {d.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
        </div>
      </div>

      {/* ── LISTE DES COURS REGROUPÉS PAR DOMAINE ── */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0d1322] rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <Filter className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Aucune vidéo ne correspond à ce filtre</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Essayez de modifier votre recherche textuelle ou de réinitialiser le filtre de niveau et de filière.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedDomaine("ALL");
              setSelectedNiveau("tous");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedVideos.map(([domaineName, videosInDomaine]) => (
            <div key={domaineName} className="space-y-4">
              {/* En-tête du Domaine */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-base">
                    {DOMAINES_LIST.find((d) => d.id === domaineName)?.icon || "⚛️"}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {domaineName}
                    </h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {videosInDomaine.length} vidéo{videosInDomaine.length > 1 ? "s" : ""} disponible
                      {videosInDomaine.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grille des Cartes Vidéo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {videosInDomaine.map((video) => {
                  const isPSI = video.filieres.includes("PSI");
                  const isMP = video.filieres.includes("MP");

                  return (
                    <article
                      key={video.id}
                      onClick={() => onOpenVideo(video.youtubeUrl, video.title)}
                      className="group relative bg-white dark:bg-[#0d1322] rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                    >
                      {/* Vignette Vidéo YouTube HD avec Play Button */}
                      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Voile sombre & Durée */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-2.5">
                          {/* Badges supérieurs */}
                          <div className="flex items-center justify-between gap-1">
                            {video.isCommon ? (
                              <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-600/90 text-white shadow-xs backdrop-blur-xs">
                                Tronc Commun MP / PSI
                              </span>
                            ) : video.filieres.length === 1 ? (
                              <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-xs">
                                Spécifique {video.filieres[0]}
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-200 backdrop-blur-xs">
                                {video.filieres.join(" · ")}
                              </span>
                            )}

                            {video.concoursTag && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-rose-600 text-white">
                                {video.concoursTag}
                              </span>
                            )}
                          </div>

                          {/* Bouton Play Central */}
                          <div className="self-center w-11 h-11 rounded-full bg-red-600/90 group-hover:bg-red-600 group-hover:scale-110 flex items-center justify-center text-white shadow-xl transition-all">
                            <PlayCircle className="w-7 h-7" />
                          </div>

                          {/* Durée */}
                          <div className="flex items-center justify-between text-[10px] text-white/90">
                            <span className="truncate max-w-[70%] text-slate-300 font-mono text-[9px]">
                              {video.niveau === "sup" ? "1ère Année (Sup)" : "2ème Année (Spé)"}
                            </span>
                            <span className="inline-flex items-center gap-1 font-mono font-bold bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-white">
                              <Clock className="w-2.5 h-2.5" />
                              {video.durationFormatted}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Informations Textuelles */}
                      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                        <div>
                          <span className="inline-block text-[10px] font-bold text-purple-700 dark:text-purple-400 mb-1 line-clamp-1">
                            {video.chapitre}
                          </span>
                          <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                            {video.title}
                          </h3>
                        </div>

                        {/* Pied de Carte : Filières & Actions */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1">
                            {video.filieres.map((f) => (
                              <span
                                key={f}
                                className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                              >
                                {f}
                              </span>
                            ))}
                          </div>

                          <span className="text-[11px] font-bold text-purple-700 dark:text-purple-400 group-hover:underline inline-flex items-center gap-1">
                            Regarder
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODALE PROGRAMMES OFFICIELS CPGE (PDFs) ── */}
      {syllabusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0d1322] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Programmes Officiels de Physique CPGE
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Syllabus officiel conforme aux concours d&apos;entrée aux Grandes Écoles
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSyllabusModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {OFFICIAL_SYLLABUS_FILES.map((syll) => (
                <div
                  key={syll.code}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 hover:border-purple-300 dark:hover:border-purple-500/40 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-10 h-10 rounded-xl bg-purple-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {syll.filiere}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {syll.title}
                      </h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {syll.annee} · Format PDF officiel
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSyllabusModalOpen(false);
                        onOpenPdf(syll.pdfUrl, syll.title);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Consulter
                    </button>
                    <a
                      href={syll.pdfUrl}
                      download
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      title="Télécharger le PDF"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
