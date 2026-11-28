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
      badge: "Syllabus Sup & Spé CPGE",
      title: "Cours et TDs",
      subtitle: "Polycopiés de cours officiels de Physique-Chimie rédigés par Pr. Hassan EDDAMS, fiches de synthèse, séries de TD et vidéos d'application par filière.",
      icon: <BookOpen className="w-8 h-8 text-purple-700 dark:text-purple-400" />,
      count: "Cours, TDs & Vidéos",
    },
    {
      id: "concours",
      badge: "Annales Officielles par Filière",
      title: "Concours",
      subtitle: "Épreuves strictement classées par filière (MP, PSI, PC, TSI, PT) : CNC Maroc, Centrale-Supélec, Mines-Ponts, CCINP, X-ENS, e3a & Banque PT avec corrigés PDF et vidéos E-Learning Physique.",
      icon: <Trophy className="w-8 h-8 text-purple-700 dark:text-purple-400" />,
      count: "MP · PSI · PC · TSI · PT",
    },
    {
      id: "references",
      badge: "Bibliothèque & Formulaires",
      title: "Références",
      subtitle: "Programmes officiels complets des filières MP, PSI, PC et TSI avec inspection des couvertures, formulaire des constantes et collection recommandée.",
      icon: <BookmarkCheck className="w-8 h-8 text-purple-700 dark:text-purple-400" />,
      count: "Programmes & Ouvrages",
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
              {/* Carte Principale Minimaliste Premium */}
              <div className="relative h-full flex flex-col justify-between p-7 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0E1525] shadow-[0_2px_10px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-all duration-300 group-hover:border-[#5B21B6]/40 dark:group-hover:border-purple-400/50 overflow-hidden">
                {/* Trait supérieur discret au survol */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-[#162A4A] via-[#5B21B6] to-[#C6A15B] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* En-tête de carte : Icône + Badge */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="w-13 h-13 rounded-2xl bg-[#F3EEFD] dark:bg-purple-950/60 border border-purple-200/70 dark:border-purple-500/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      {card.icon}
                    </div>

                    <span className="text-[10.5px] font-bold font-mono tracking-wider uppercase px-3 py-1 rounded-full bg-[#F6F7FA] dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-700">
                      {card.count}
                    </span>
                  </div>

                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#9A7828] dark:text-[#D4B26A] mb-1.5">
                    {card.badge}
                  </span>

                  <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2.5 group-hover:text-[#5B21B6] dark:group-hover:text-purple-300 transition-colors">
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
