"use client";

import React, { useState, useMemo } from "react";
import { CourseBookCard, LivreReference } from "./CourseBookCard";
import { PC_REFERENCES_DATA, COLLECTIONS_LIST } from "./pcReferencesData";
import { Search, BookmarkCheck, BookOpen, Layers, X, Plus, Filter } from "lucide-react";

interface ReferencesWidgetProps {
  onOpenPdf: (url: string, title: string) => void;
}

export function ReferencesWidget({ onOpenPdf }: ReferencesWidgetProps) {
  const [livres, setLivres] = useState<LivreReference[]>(PC_REFERENCES_DATA);
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
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

  // Filtrage combiné : Collection + Recherche textuelle
  const filteredLivres = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return livres.filter((l) => {
      const matchesCollection =
        selectedCollection === "all" || l.collection === selectedCollection;
      const matchesSearch =
        !q ||
        l.titre.toLowerCase().includes(q) ||
        (l.auteur && l.auteur.toLowerCase().includes(q)) ||
        (l.description && l.description.toLowerCase().includes(q)) ||
        (l.badge && l.badge.toLowerCase().includes(q));
      return matchesCollection && matchesSearch;
    });
  }, [livres, selectedCollection, searchQuery]);

  const activeCollectionMeta = useMemo(() => {
    return (
      collectionsWithCounts.find((c) => c.id === selectedCollection) ||
      collectionsWithCounts[0]
    );
  }, [collectionsWithCounts, selectedCollection]);

  return (
    <div className="w-full max-w-6xl mx-auto my-4 font-sans">
      {/* 1. En-tête Prestigieux Lumineux — Frosted Crystal Glassmorphism */}
      <div className="relative rounded-3xl bg-white/70 dark:bg-[#0d1322]/80 backdrop-blur-2xl border border-white/80 dark:border-purple-500/25 shadow-[0_20px_50px_rgba(124,58,237,0.06),0_1px_2px_rgba(255,255,255,0.95)_inset] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 sm:p-12 mb-8 text-center sm:text-left overflow-hidden">
        {/* Halos lumineux iridescents sous le verre */}
        <div className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full bg-purple-300/30 dark:bg-purple-900/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-indigo-300/25 dark:bg-indigo-900/20 blur-3xl" />

        {/* Ligne spéculaire de réfraction */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white dark:via-purple-400/30 to-transparent" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-purple-800 dark:text-purple-300 bg-white/85 dark:bg-purple-950/60 backdrop-blur-md border border-purple-200/90 dark:border-purple-500/30 px-4 py-1.5 rounded-full mb-3 shadow-2xs">
            <BookmarkCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Bibliothèque de Référence CPGE MP / MP*
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-slate-900 dark:text-white">
            Livres de Référence &{" "}
            <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 dark:from-purple-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
              Grandes Collections
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Ouvrages majeurs de la filière MP classés par collections reconnues : Tout-en-un Dunod, Pérez, Précis Bréal, H-Prépa, Nathan, Lumbroso, Flammes, Grécias, Garing et Belin Sup. Cliquez sur un livre pour l&apos;ouvrir dans la liseuse PDF.
          </p>

          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-purple-500/20 text-slate-700 dark:text-slate-300 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <strong>{livres.length}</strong> Ouvrages
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-purple-500/20 text-slate-700 dark:text-slate-300 shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <strong>{COLLECTIONS_LIST.length - 1}</strong> Collections CPGE
            </span>
          </div>
        </div>
      </div>

      {/* 2. Filtres par Collections (Pills Défilants / Flex) */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Filtrer par Collection
          </span>
          <span className="text-xs text-purple-700 dark:text-purple-300 font-semibold">
            {filteredLivres.length} livre{filteredLivres.length > 1 ? "s" : ""} affiché{filteredLivres.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {collectionsWithCounts.map((col) => {
            const isActive = selectedCollection === col.id;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => setSelectedCollection(col.id)}
                className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-purple-700 dark:bg-purple-600 text-white border-purple-700 dark:border-purple-600 shadow-md shadow-purple-700/20"
                    : "bg-white dark:bg-[#0d1322] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:border-purple-200 dark:hover:border-purple-500/40 hover:text-purple-700 dark:hover:text-purple-300"
                }`}
              >
                <span>{col.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full transition-colors ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/60 group-hover:text-purple-700 dark:group-hover:text-purple-300"
                  }`}
                >
                  {col.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Barre de Recherche & Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            placeholder="Rechercher par titre, auteur, collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d18] text-xs sm:text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-600/15 transition-all outline-hidden shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedCollection !== "all" && (
            <button
              type="button"
              onClick={() => setSelectedCollection("all")}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors cursor-pointer"
            >
              Réinitialiser le filtre ({activeCollectionMeta.label})
            </button>
          )}

          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter un ouvrage</span>
          </button>
        </div>
      </div>

      {/* 4. Grille des Livres 3D */}
      {filteredLivres.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#0d1322] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-400/60" />
          <p className="font-semibold text-sm">Aucun ouvrage ne correspond à votre recherche.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCollection("all");
            }}
            className="mt-3 text-xs text-purple-600 dark:text-purple-400 underline font-semibold"
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

      {/* 5. Modale d'ajout d'ouvrage */}
      {addModalOpen && (
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
