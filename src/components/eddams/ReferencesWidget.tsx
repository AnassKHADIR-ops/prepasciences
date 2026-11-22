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
      {/* 1. En-tête Éditorial Épuré */}
      <div className="max-w-2xl mb-8 py-4 space-y-3">
        <div className="ui-eyebrow">
          <BookmarkCheck className="w-3.5 h-3.5 text-[#7A5230] dark:text-[#D4A977]" strokeWidth={1.6} />
          <span>Bibliothèque Toutes Filières CPGE</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-[#1D1D1F] dark:text-[#F5F3EC]">
          Livres de Référence &amp; Grandes Collections
        </h2>

        <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#B8B2A6] leading-relaxed">
          Ouvrages majeurs des filières scientifiques CPGE classés par collections : Dunod, Pérez, Précis Bréal, H-Prépa, Nathan, Lumbroso, Grécias, Garing et Belin Sup.
        </p>

        <div className="flex items-center gap-2.5 pt-1 flex-wrap">
          <span className="ui-pill">
            <BookOpen className="w-3.5 h-3.5 text-[#7A5230] dark:text-[#D4A977]" strokeWidth={1.6} />
            <strong className="text-[#1D1D1F] dark:text-[#F5F3EC]">{livres.length}</strong> Ouvrages
          </span>
          <span className="ui-pill">
            <Layers className="w-3.5 h-3.5 text-[#57534E] dark:text-[#B8B2A6]" strokeWidth={1.6} />
            <strong className="text-[#1D1D1F] dark:text-[#F5F3EC]">{COLLECTIONS_LIST.length - 1}</strong> Collections
          </span>
        </div>
      </div>

      {/* 2. Filtres par Collections */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#57534E] dark:text-[#B8B2A6] flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#7A5230] dark:text-[#D4A977]" strokeWidth={1.6} />
            <span>Collection</span>
          </span>
          <span className="text-xs text-[#6E6A63] dark:text-[#9A9488] font-medium">
            {filteredLivres.length} livre{filteredLivres.length > 1 ? "s" : ""}
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
                className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#1D1D1F] dark:bg-[#F5F3EC] text-[#FAF8F2] dark:text-[#161513] border-transparent font-semibold"
                    : "bg-white dark:bg-[#1F1E1B] text-[#57534E] dark:text-[#B8B2A6] border-black/12 dark:border-white/12 hover:border-black/30 dark:hover:border-white/30 hover:text-[#1D1D1F] dark:hover:text-[#F5F3EC]"
                }`}
              >
                <span>{col.label}</span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? "bg-white/20 dark:bg-black/15"
                      : "bg-[#F4F1E6] dark:bg-[#282622] text-[#6E6A63] dark:text-[#9A9488]"
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
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A63]" strokeWidth={1.6} />
          <input
            type="text"
            placeholder="Rechercher par titre, auteur, collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ui-input pl-10 pr-9 py-2.5 text-xs sm:text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6A63] hover:text-[#1D1D1F] dark:hover:text-[#F5F3EC] cursor-pointer"
              aria-label="Effacer la recherche"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.6} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedCollection !== "all" && (
            <button
              type="button"
              onClick={() => setSelectedCollection("all")}
              className="ui-btn-secondary px-3.5 py-2 text-xs"
            >
              Réinitialiser ({activeCollectionMeta.label})
            </button>
          )}

          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="ui-btn-primary px-4 py-2 text-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={1.6} />
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
