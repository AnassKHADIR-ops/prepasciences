"use client";

import React, { useState } from "react";
import { CourseBookCard, LivreReference } from "./CourseBookCard";
import { Search, BookmarkCheck, X } from "lucide-react";

interface ReferencesWidgetProps {
  onOpenPdf: (url: string, title: string) => void;
}

const DEFAULT_LIVRES: LivreReference[] = [
  {
    id: "bo-pc",
    titre: "Programme Officiel CPGE MP / MP* — Physique-Chimie",
    auteur: "Ministère de l'Éducation Nationale (BO)",
    lien: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
    badge: "Officiel BO",
  },
  {
    id: "constantes-si",
    titre: "Mémento des Constantes Physiques Fondamentales & Unités SI",
    auteur: "Bureau International des Poids et Mesures",
    lien: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
    badge: "Indispensable",
  },
  {
    id: "classiques-pc",
    titre: "Les Grands Classiques de Physique en CPGE MP/MP*",
    auteur: "Pr. Hassan EDDAMS",
    lien: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
    badge: "Méthode Concours",
  },
  {
    id: "maxwell-guide",
    titre: "Électromagnétisme & Équations de Maxwell : Synthèse et Réflexes",
    auteur: "Pr. Hassan EDDAMS",
    lien: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
    badge: "Cœur MP*",
  },
  {
    id: "thermo-transf",
    titre: "Thermodynamique & Transferts Thermiques : Problèmes Corrigés",
    auteur: "Annales CPGE d'Élite",
    lien: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
    badge: "Mines / CNC",
  },
  {
    id: "rapports-jurys",
    titre: "Guide de Rédaction & Barèmes des Jurys (CNC, Mines, CCINP)",
    auteur: "Conseil Pédagogique CPGE",
    lien: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
    badge: "Conseils Jurys",
  },
];

export function ReferencesWidget({ onOpenPdf }: ReferencesWidgetProps) {
  const [livres, setLivres] = useState<LivreReference[]>(DEFAULT_LIVRES);
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Formulaire d'ajout rapide (réservé aux admins)
  const [newTitre, setNewTitre] = useState("");
  const [newAuteur, setNewAuteur] = useState("");
  const [newLien, setNewLien] = useState("");
  const [newBadge, setNewBadge] = useState("");

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitre.trim() || !newLien.trim()) return;

    const newBook: LivreReference = {
      id: "ref-" + Date.now(),
      titre: newTitre.trim(),
      auteur: newAuteur.trim() || "Pr. Hassan EDDAMS",
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

  const filteredLivres = livres.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      l.titre.toLowerCase().includes(q) ||
      (l.auteur && l.auteur.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full max-w-6xl mx-auto my-4 font-sans">

      {/* En-tête Prestigieux Lumineux — Décor comme des verres (Frosted Crystal Glassmorphism) */}
      <div className="relative rounded-3xl bg-white/70 dark:bg-[#0d1322]/80 backdrop-blur-2xl border border-white/80 dark:border-purple-500/25 shadow-[0_20px_50px_rgba(124,58,237,0.06),0_1px_2px_rgba(255,255,255,0.95)_inset] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 sm:p-12 mb-8 text-center sm:text-left overflow-hidden">
        {/* Halos lumineux iridescents sous le verre */}
        <div className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full bg-purple-300/30 dark:bg-purple-900/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-indigo-300/25 dark:bg-indigo-900/20 blur-3xl" />

        {/* Ligne spéculaire de réfraction du verre en haut */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white dark:via-purple-400/30 to-transparent" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-purple-800 dark:text-purple-300 bg-white/85 dark:bg-purple-950/60 backdrop-blur-md border border-purple-200/90 dark:border-purple-500/30 px-4 py-1.5 rounded-full mb-3 shadow-2xs">
            <BookmarkCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Bibliothèque de Référence CPGE
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-slate-900 dark:text-white">
            Références & <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 dark:from-purple-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">Formulaires Officiels</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Ouvrages recommandés, programme officiel de la filière MP, formulaires de constantes physiques universelles. Cliquez sur une couverture pour ouvrir directement le document PDF.
          </p>
        </div>
      </div>

      {/* Recherche */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
        <input
          type="text"
          placeholder="Rechercher par titre ou auteur..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d18] text-xs sm:text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-600 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-600/15 transition-all outline-hidden shadow-2xs"
        />
      </div>

      {/* Grille des Livres 3D */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-7 items-start">
        {filteredLivres.map((livre) => (
          <CourseBookCard key={livre.id} livre={livre} onOpenPdf={onOpenPdf} />
        ))}
      </div>

      {/* Modale d'ajout d'ouvrage */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div
            className="bg-white dark:bg-[#0d1322] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-800 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Ajouter un ouvrage / document</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBook} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Titre du livre / document *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Les Grands Classiques de Physique MP"
                  value={newTitre}
                  onChange={(e) => setNewTitre(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#090d18] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0d1322] focus:border-purple-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Auteur (affiché en gris)
                </label>
                <input
                  type="text"
                  placeholder="ex: Pr. Hassan EDDAMS"
                  value={newAuteur}
                  onChange={(e) => setNewAuteur(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#090d18] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0d1322] focus:border-purple-600 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Lien Google Drive (PDF) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={newLien}
                  onChange={(e) => setNewLien(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#090d18] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0d1322] focus:border-purple-600 outline-hidden"
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  La couverture est extraite automatiquement depuis Google Drive !
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Badge court (ex: BO, Mémento, Concours)
                </label>
                <input
                  type="text"
                  placeholder="ex: Référence"
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#090d18] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:bg-white dark:focus:bg-[#0d1322] focus:border-purple-600 outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs"
                >
                  Ajouter l&apos;ouvrage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
