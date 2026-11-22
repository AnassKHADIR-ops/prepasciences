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
      subtitle:
        "Polycopiés de cours officiels de Physique-Chimie rédigés par Pr. Hassan EDDAMS, fiches de synthèse, séries de TD et vidéos d'application par filière.",
      icon: <BookOpen className="w-5 h-5" strokeWidth={1.6} />,
      count: "Cours, TDs & Vidéos",
    },
    {
      id: "concours",
      badge: "Annales Officielles par Filière",
      title: "Concours",
      subtitle:
        "Épreuves classées par filière (MP, PSI, PC, TSI, PT) : CNC Maroc, Centrale-Supélec, Mines-Ponts, CCINP, X-ENS, e3a & Banque PT avec corrigés PDF et vidéos.",
      icon: <Trophy className="w-5 h-5" strokeWidth={1.6} />,
      count: "MP · PSI · PC · TSI · PT",
    },
    {
      id: "references",
      badge: "Bibliothèque & Formulaires",
      title: "Références",
      subtitle:
        "Programmes officiels complets des filières MP, PSI, PC et TSI, formulaires des constantes et ouvrages de référence recommandés.",
      icon: <BookmarkCheck className="w-5 h-5" strokeWidth={1.6} />,
      count: "Programmes & Ouvrages",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectSection(card.id)}
            className="ui-card ui-card-hover group text-left p-7 flex flex-col justify-between cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D1D1F] dark:focus-visible:outline-[#F5F3EC]"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="ui-icon-tile w-11 h-11 rounded-xl group-hover:scale-105">
                  {card.icon}
                </div>

                <span className="ui-pill text-[11px]">
                  {card.count}
                </span>
              </div>

              <span className="block text-[11px] font-semibold uppercase tracking-[0.09em] text-[#7A5230] dark:text-[#D4A977] mb-1.5">
                {card.badge}
              </span>

              <h3 className="text-xl font-semibold tracking-[-0.02em] text-[#1D1D1F] dark:text-[#F5F3EC] mb-2.5">
                {card.title}
              </h3>

              <p className="text-sm text-[#57534E] dark:text-[#B8B2A6] leading-relaxed">
                {card.subtitle}
              </p>
            </div>

            <div className="pt-5 mt-6 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F3EC]">
              <span>Ouvrir la rubrique</span>
              <span className="w-8 h-8 rounded-full bg-[#F4F1E6] dark:bg-[#282622] flex items-center justify-center transition-all group-hover:bg-[#1D1D1F] group-hover:text-[#FAF8F2] dark:group-hover:bg-[#F5F3EC] dark:group-hover:text-[#161513] group-hover:translate-x-0.5">
                <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
