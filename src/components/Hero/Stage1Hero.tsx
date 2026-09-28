"use client";

import React, { forwardRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

export const Stage1Hero = forwardRef<HTMLDivElement>(function Stage1Hero(_, ref) {
  return (
    <div
      ref={ref}
      style={{
        opacity: 1,
        transform: "translate3d(0, 0, 0)",
      }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-8 sm:pt-12 md:pt-16 pb-2 sm:pb-4 px-4 sm:px-6 lg:px-8 w-full max-w-5xl mx-auto text-center will-change-[transform,opacity] overflow-hidden"
    >
      <div className="my-auto w-full flex flex-col items-center py-1">
        {/* 1. BADGE : Compact, Sobre & Précis */}
        <div
          style={{
            background: "rgba(24, 199, 243, 0.08)",
            border: "1px solid rgba(24, 199, 243, 0.30)",
            color: "#67DDF7",
            borderRadius: "999px",
          }}
          className="inline-flex items-center gap-2 mb-2 sm:mb-3.5 backdrop-blur-md shadow-sm shadow-[#18C7F3]/10 px-3.5 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-[13px] font-bold max-w-[calc(100vw-2rem)]"
        >
          <span className="tracking-wide truncate">✦ EXCELLENCE CPGE · CNC &amp; CONCOURS</span>
        </div>

        {/* 2. TITRE PRINCIPAL H1 (Massif, Épuré, Zéro Métallique) */}
        <h1 className="text-[clamp(1.35rem,3.2vw,3.1rem)] font-black tracking-tight leading-[1.12] mb-2.5 sm:mb-4 max-w-4xl text-center px-1">
          <span className="block text-white">PrépaSciences,</span>
          <span className="block text-white">votre plateforme d’excellence</span>
          <span className="block text-[#18C7F3]">pour réussir en CPGE</span>
        </h1>

        {/* 3. SOUS-TITRE : Pôles Scientifiques & Démarche d'Entraînement */}
        <div className="max-w-[660px] mx-auto mb-3.5 sm:mb-5 space-y-1 sm:space-y-1.5 text-center px-2">
          <p className="text-xs sm:text-sm md:text-base font-semibold text-white tracking-wide">
            Mathématiques &amp; Physique-Chimie
          </p>
          <p className="text-xs sm:text-sm text-[#D9E4F2] font-normal leading-[1.45]">
            Des cours structurés, un entraînement régulier et un accompagnement personnalisé pour progresser en CPGE et préparer les concours.
          </p>
        </div>

        {/* 4. CTAS D'ACTION DIRECTE */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md sm:max-w-none">
          {/* Premier bouton : Découvrir nos professeurs (Primary Cyan) */}
          <a
            href="#professeurs"
            style={{
              background: "#18C7F3",
              color: "#050B1D",
              fontWeight: 800,
              height: "48px",
              borderRadius: "14px",
            }}
            className="inline-flex items-center justify-center gap-2 px-8 text-sm sm:text-base shadow-[0_8px_24px_rgba(24,199,243,0.3)] hover:bg-[#45D5F7] hover:shadow-[0_12px_32px_rgba(24,199,243,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 w-full sm:w-auto cursor-pointer"
          >
            <span>Découvrir nos professeurs</span>
            <ArrowRight className="h-4 w-4 text-[#050B1D]" />
          </a>

          {/* Deuxième bouton : Voir les tarifs (Secondary Glass) */}
          <a
            href="#tarifs"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.20)",
              color: "#FFFFFF",
              height: "48px",
              borderRadius: "14px",
            }}
            className="inline-flex items-center justify-center gap-2 px-8 text-sm sm:text-base font-semibold backdrop-blur-md hover:border-[#18C7F3] hover:text-[#18C7F3] hover:bg-white/[0.08] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 w-full sm:w-auto cursor-pointer"
          >
            <span>Voir les tarifs</span>
          </a>
        </div>

        {/* 5. BENEFITS : Ligne discrète d'engagements */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 mt-3 sm:mt-5 text-xs sm:text-[13px] md:text-sm font-medium text-[#91A4BA] max-w-xl mx-auto px-2">
          <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[#18C7F3] font-bold text-base leading-none">✓</span>
            <span>Cours structurés</span>
          </div>
          <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[#18C7F3] font-bold text-base leading-none">✓</span>
            <span>Suivi personnalisé</span>
          </div>
          <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="text-[#18C7F3] font-bold text-base leading-none">✓</span>
            <span>Préparation concours</span>
          </div>
        </div>

        {/* 6. INDICATEUR DE SCROLL DISCRET */}
        <a
          href="#professeurs"
          aria-label="Faire défiler vers nos professeurs"
          className="mt-3 sm:mt-5 inline-flex flex-col items-center gap-1 text-[11px] font-mono tracking-widest uppercase text-[#91A4BA] hover:text-[#18C7F3] transition-colors"
        >
          <span>Scrollez pour découvrir nos professeurs</span>
          <ChevronDown className="h-3.5 w-3.5 text-[#18C7F3] animate-bounce" />
        </a>
      </div>
    </div>
  );
});
