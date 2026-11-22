"use client";

import React, { useState, useMemo, useSyncExternalStore } from "react";
import { CourseBookCard, LivreReference } from "./CourseBookCard";
import { PC_REFERENCES_DATA, COLLECTIONS_LIST } from "./pcReferencesData";
import { Search, BookmarkCheck, BookOpen, X, Plus, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ReferencesWidgetProps {
  onOpenPdf: (url: string, title: string) => void;
}

type DisciplineFilter = "all" | "physique" | "chimie" | "officiels";

function getBookDiscipline(l: LivreReference): "physique" | "chimie" | "officiels" {
  if (l.collection === "programmes-officiels" || l.collection === "eddams") {
    return "officiels";
  }
  const haystack = `${l.titre} ${l.badge || ""} ${l.description || ""} ${l.collection}`.toLowerCase();
  if (l.collection === "grecias" || haystack.includes("chimie") || haystack.includes("organique") || haystack.includes("cristallo")) {
    return "chimie";
  }
  return "physique";
}

const COLLECTION_ICONS: Record<string, string> = {
  all: "📚",
  "programmes-officiels": "📋",
  eddams: "🎓",
  "annales-concours": "🏆",
  "tout-en-un": "📘",
  perez: "📗",
  precis: "📙",
  "h-prepa": "📕",
  nathan: "📓",
  lumbroso: "📔",
  flammes: "🔥",
  grecias: "🧪",
  garing: "⚡",
  "belin-sup": "📖",
  "elec-specialisee": "🔌",
};

export function ReferencesWidget({ onOpenPdf }: ReferencesWidgetProps) {
  const { isTeacher, isAdmin, teacherViewMode } = useAuth();
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  // L'ajout d'un ouvrage est strictement réservé aux membres autorisés (professeur / admin)
  const canManageBooks = isMounted && (isTeacher || isAdmin) && teacherViewMode === "teacher";

  const [livres, setLivres] = useState<LivreReference[]>(PC_REFERENCES_DATA);
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Formulaire d'ajout rapide
  const [newTitre, setNewTitre] = useState("");
  const [newAuteur, setNewAuteur] = useState("");
  const [newCollection, setNewCollection] = useState("tout-en-un");
  const [newLien, setNewLien] = useState("");
  const [newBadge, setNewBadge] = useState("");

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageBooks) return;
    if (!newTitre.trim() || !newLien.trim()) return;

    const newBook: LivreReference = {
      id: "ref-" + Date.now(),
      titre: newTitre.trim(),
      auteur: newAuteur.trim() || "Pr. Hassan EDDAMS",
      collection: newCollection,
      lien: newLien.trim(),
      badge: newBadge.trim() || "Référence",
    };

    setLivres([newBook, ...livres]);
    setNewTitre("");
    setNewAuteur("");
    setNewLien("");
    setNewBadge("");
    setAddModalOpen(false);
  };

  // Décomptes par discipline
  const disciplineCounts = useMemo(() => {
    let physique = 0;
    let chimie = 0;
    let officiels = 0;
    livres.forEach((l) => {
      const d = getBookDiscipline(l);
      if (d === "officiels") officiels += 1;
      else if (d === "chimie") chimie += 1;
      else physique += 1;
    });
    return { all: livres.length, physique, chimie, officiels };
  }, [livres]);

  // Calcul du nombre d'ouvrages par collection
  const collectionsWithCounts = useMemo(() => {
    return COLLECTIONS_LIST.map((col) => {
      const count =
        col.id === "all"
          ? livres.length
          : livres.filter((l) => l.collection === col.id).length;
      return {
        ...col,
        count,
      };
    });
  }, [livres]);

  // Filtrage combiné : Collection + Discipline + Recherche textuelle
  const filteredLivres = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return livres.filter((l) => {
      const matchesCollection =
        selectedCollection === "all" || l.collection === selectedCollection;
      const matchesDiscipline =
        selectedDiscipline === "all" || getBookDiscipline(l) === selectedDiscipline;
      const matchesSearch =
        !q ||
        l.titre.toLowerCase().includes(q) ||
        (l.auteur && l.auteur.toLowerCase().includes(q)) ||
        (l.description && l.description.toLowerCase().includes(q)) ||
        (l.badge && l.badge.toLowerCase().includes(q));
      return matchesCollection && matchesDiscipline && matchesSearch;
    });
  }, [livres, selectedCollection, selectedDiscipline, searchQuery]);

  const activeCollectionMeta = useMemo(() => {
    return (
      collectionsWithCounts.find((c) => c.id === selectedCollection) ||
      collectionsWithCounts[0]
    );
  }, [collectionsWithCounts, selectedCollection]);

  const hasActiveFilter =
    selectedCollection !== "all" ||
    selectedDiscipline !== "all" ||
    searchQuery.trim() !== "";

  const resetAllFilters = () => {
    setSelectedCollection("all");
    setSelectedDiscipline("all");
    setSearchQuery("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto font-sans space-y-4">
      {/* 1. Bandeau compact & prestigieux (sans texte superflu) */}
      <div className="rounded-2xl bg-white/85 dark:bg-[#0d1322]/85 border border-purple-200/70 dark:border-purple-500/25 px-5 py-3.5 sm:px-6 sm:py-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100/80 dark:bg-purple-950/70 border border-purple-200/80 dark:border-purple-500/30 flex items-center justify-center shrink-0">
            <BookmarkCheck className="w-4 h-4 text-purple-700 dark:text-purple-300" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Bibliothèque de{" "}
            <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 dark:from-purple-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
              Référence
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100/80 dark:bg-purple-950/70 text-purple-800 dark:text-purple-200 border border-purple-200/90 dark:border-purple-500/30">
            <span>📚</span>
            <span>
              {filteredLivres.length} / {livres.length} ouvrages
            </span>
          </span>

          {canManageBooks && (
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un ouvrage</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Barre de Filtres Organisée en Listes Déroulantes (style grand portail éducatif) */}
      <div className="bg-white/95 dark:bg-[#0d1322] rounded-2xl border border-purple-200/70 dark:border-purple-500/25 p-3 sm:p-3.5 shadow-xs space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
          {/* Champ Recherche */}
          <div className="relative sm:col-span-2 lg:col-span-5 min-w-0">
            <label htmlFor="references-search-input" className="sr-only">
              Rechercher un ouvrage
            </label>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500 dark:text-purple-400" />
            <input
              id="references-search-input"
              type="text"
              placeholder="Rechercher un livre, auteur, collection (Dunod, Pérez, Chimie...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[2.625rem] pl-10 pr-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090d18] text-[13px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0d1322] focus:border-purple-600 dark:focus:border-purple-400 focus:ring-3 focus:ring-purple-600/15 transition-all outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Effacer la recherche"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Liste déroulante : Collection */}
          <div className="concours-select-wrap lg:col-span-4">
            <label htmlFor="references-collection-select" className="sr-only">
              Collection d&apos;ouvrages
            </label>
            <select
              id="references-collection-select"
              name="collection"
              value={selectedCollection}
              data-active={selectedCollection !== "all"}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="concours-select"
            >
              {collectionsWithCounts.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.id === "all"
                    ? `📚 Collection : Toutes (${col.count})`
                    : `${COLLECTION_ICONS[col.id] || "📖"} ${col.label} (${col.count})`}
                </option>
              ))}
            </select>
            <ChevronDown className="concours-select-chevron w-4 h-4" aria-hidden="true" />
          </div>

          {/* Liste déroulante : Discipline / Catégorie */}
          <div className="concours-select-wrap lg:col-span-3">
            <label htmlFor="references-discipline-select" className="sr-only">
              Discipline
            </label>
            <select
              id="references-discipline-select"
              name="discipline"
              value={selectedDiscipline}
              data-active={selectedDiscipline !== "all"}
              onChange={(e) => setSelectedDiscipline(e.target.value as DisciplineFilter)}
              className="concours-select"
            >
              <option value="all">🎯 Catégorie : Toutes ({disciplineCounts.all})</option>
              <option value="officiels">📋 Programmes &amp; Polycopiés ({disciplineCounts.officiels})</option>
              <option value="physique">⚛️ Physique CPGE ({disciplineCounts.physique})</option>
              <option value="chimie">🧪 Chimie CPGE ({disciplineCounts.chimie})</option>
            </select>
            <ChevronDown className="concours-select-chevron w-4 h-4" aria-hidden="true" />
          </div>
        </div>

        {/* Bandeau discret des filtres actifs */}
        {hasActiveFilter && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>
                  {filteredLivres.length} résultat{filteredLivres.length > 1 ? "s" : ""}
                </span>
              </span>

              {selectedCollection !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedCollection("all")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200 border border-purple-200/80 dark:border-purple-500/30 font-semibold text-[11px] hover:bg-purple-100 dark:hover:bg-purple-900/60 cursor-pointer"
                >
                  <span>
                    {COLLECTION_ICONS[selectedCollection] || "📖"} {activeCollectionMeta.label}
                  </span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {selectedDiscipline !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedDiscipline("all")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-200 border border-indigo-200/80 dark:border-indigo-500/30 font-semibold text-[11px] hover:bg-indigo-100 dark:hover:bg-indigo-900/60 cursor-pointer"
                >
                  <span>
                    {selectedDiscipline === "officiels"
                      ? "📋 Programmes & Polycopiés"
                      : selectedDiscipline === "physique"
                      ? "⚛️ Physique"
                      : "🧪 Chimie"}
                  </span>
                  <X className="w-3 h-3" />
                </button>
              )}

              {searchQuery.trim() !== "" && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-[11px] hover:bg-slate-200 cursor-pointer"
                >
                  <span>« {searchQuery.trim()} »</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[11px] font-bold text-purple-700 dark:text-purple-400 hover:underline shrink-0 cursor-pointer"
            >
              Tout réinitialiser
            </button>
          </div>
        )}
      </div>

      {/* 3. Grille des Livres 3D */}
      {filteredLivres.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#0d1322] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-400/60" />
          <p className="font-semibold text-sm">Aucun ouvrage ne correspond à votre recherche.</p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="mt-3 text-xs text-purple-600 dark:text-purple-400 underline font-semibold cursor-pointer"
          >
            Afficher tous les livres de la bibliothèque
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-7 items-start">
          {filteredLivres.map((livre) => (
            <CourseBookCard key={livre.id} livre={livre} onOpenPdf={onOpenPdf} />
          ))}
        </div>
      )}

      {/* 5. Modale d'ajout d'ouvrage (réservée aux membres autorisés) */}
      {canManageBooks && addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn"
          onClick={() => setAddModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#0d1322] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-800 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ajouter un ouvrage / document
              </h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBook} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre du livre *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Électromagnétisme — Fondements et applications"
                  value={newTitre}
                  onChange={(e) => setNewTitre(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d18] text-slate-900 dark:text-white focus:border-purple-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Auteur(s)
                </label>
                <input
                  type="text"
                  placeholder="Ex : José-Philippe Pérez"
                  value={newAuteur}
                  onChange={(e) => setNewAuteur(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d18] text-slate-900 dark:text-white focus:border-purple-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Collection *
                </label>
                <select
                  value={newCollection}
                  onChange={(e) => setNewCollection(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d18] text-slate-900 dark:text-white focus:border-purple-600 outline-hidden"
                >
                  {COLLECTIONS_LIST.filter((c) => c.id !== "all").map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lien Google Drive du PDF *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/..."
                  value={newLien}
                  onChange={(e) => setNewLien(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d18] text-slate-900 dark:text-white focus:border-purple-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Badge (Optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex : Cours & Exercices"
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d18] text-slate-900 dark:text-white focus:border-purple-600 outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors cursor-pointer"
                >
                  Ajouter à la bibliothèque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
