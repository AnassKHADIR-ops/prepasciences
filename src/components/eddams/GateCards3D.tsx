"use client";

import React from "react";
import { BookOpen, Trophy, BookmarkCheck, ArrowRight } from "lucide-react";

export type SectionType = "cours" | "concours" | "references";

interface GateCards3DProps {
  onSelectSection: (section: SectionType) => void;
}

export function GateCards3D({ onSelectSection }: GateCards3DProps) {
  const cards: {
    id: SectionType;
    badge: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    count: string;
  }[] = [
    {
      id: "cours",
      badge: "Syllabus MP / MP*",
      title: "Cours et TDs",
      subtitle: "5 modules fondamentaux de Physique-Chimie, fiches de méthode théoriques, séries d'exercices d'entraînement et vidéos d'application.",
      icon: <BookOpen className="w-8 h-8 text-purple-700 dark:text-purple-400" />,
      count: "5 Modules",
    },
    {
      id: "concours",
      badge: "Annales Officielles",
      title: "Concours",
      subtitle: "Banques d'épreuves officielles écrites CNC Maroc, Mines-Ponts, CCINP, Centrale-Supélec, X-ENS avec corrigés rédigés détaillés et vidéos.",
      icon: <Trophy className="w-8 h-8 text-purple-700 dark:text-purple-400" />,
      count: "5 Banques d'Épreuves",
    },
    {
      id: "references",
      badge: "Bibliothèque & Formulaires",
      title: "Références",
      subtitle: "Collection d'ouvrages recommandés, programme officiel de la filière MP, formulaire des constantes physiques universelles SI et méthodes de jurys.",
      icon: <BookmarkCheck className="w-8 h-8 text-purple-700 dark:text-purple-400" />,
      count: "Programme & Formulaires",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 [perspective:1200px]">
        {cards.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => onSelectSection(card.id)}
              className="group relative cursor-pointer rounded-2xl transition-all duration-300 transform-gpu hover:-translate-y-2.5 select-none hover:shadow-[0_20px_40px_rgba(124,58,237,0.12)] dark:hover:shadow-[0_20px_40px_rgba(168,85,247,0.18)]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Carte Principale 3D Prestigieuse */}
              <div className="relative h-full flex flex-col justify-between p-7 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-purple-500/20 bg-white dark:bg-[#0d1322]/90 shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:border-purple-300 dark:group-hover:border-purple-400/50">
                {/* Lueur supérieure discrète */}
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-tr from-transparent via-purple-500/5 dark:via-purple-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* En-tête de carte : Icône + Badge */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-500/30 flex items-center justify-center shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/60">
                      {card.icon}
                    </div>

                    <span className="text-[11px] font-bold font-mono tracking-wider uppercase px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-500/30">
                      {card.count}
                    </span>
                  </div>

                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
                    {card.badge}
                  </span>

                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                    {card.subtitle}
                  </p>
                </div>

                {/* Pied de carte : Bouton interactif */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-400">
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    Ouvrir la rubrique
                  </span>

                  <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center transition-all duration-300 group-hover:bg-purple-600 dark:group-hover:bg-purple-500 group-hover:text-white group-hover:translate-x-1 shadow-xs">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
