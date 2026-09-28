"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import { GraduationCap, BookOpen, Atom, ArrowRight } from "lucide-react";

export const Stage3Training = forwardRef<HTMLDivElement>(function Stage3Training(_, ref) {
  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: "translate3d(0, 25px, 0)",
        pointerEvents: "none",
      }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-16 sm:pt-20 md:pt-24 pb-4 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto will-change-[transform,opacity,filter] overflow-hidden sm:overflow-visible"
    >
      {/* Badge étape */}
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-4 py-1.5 text-xs font-mono font-bold text-cyan-300 mb-6 backdrop-blur-md shadow-sm shadow-cyan-500/10">
        <GraduationCap className="h-4 w-4 text-cyan-400" />
        <span>Métamorphose & Maîtrise des Épreuves</span>
      </div>

      {/* Titre Stage 3 Prestige Editorial */}
      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4 [text-shadow:0_2px_15px_rgba(0,0,0,0.7),0_4px_30px_rgba(56,189,248,0.25)]">
        <span className="text-white">Passez à </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-[#38BDF8] [filter:drop-shadow(0_4px_30px_rgba(56,189,248,0.25))]">
          l&apos;entraînement.
        </span>
      </h2>

      {/* Sous-titre avec micro-vignette de netteté */}
      <p className="text-base sm:text-xl text-slate-100 max-w-2xl font-normal leading-relaxed mb-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
        Le savoir des agrégés appliqué aux épreuves types Concours. Séances interactives en direct, fiches méthodes éprouvées et résolution des problèmes types CNC & concours français. Choisissez votre matière pour débuter :
      </p>

      {/* LES DEUX BOUTONS TACTILES 3D HARMONISÉS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-5 w-full max-w-xl">
        {/* Bouton 1 : Préparer les mathématiques (Tactile 3D Cyan Électrique -> quiz.anasskhadir.com) */}
        <a
          href="https://quiz.anasskhadir.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden flex-1 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-b from-cyan-400 via-cyan-500 to-teal-600 hover:from-cyan-300 hover:to-cyan-500 text-slate-950 px-7 py-4 text-sm sm:text-base font-black shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_6px_0_#0e7490,0_12px_24px_rgba(6,182,212,0.4)] active:translate-y-[4px] active:shadow-[0_2px_0_#0e7490] transition-all"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
          <BookOpen className="h-5 w-5 text-slate-950 shrink-0" />
          <span>Préparer les Mathématiques</span>
          <ArrowRight className="h-4 w-4 text-slate-950 group-hover:translate-x-1 transition-transform shrink-0" />
        </a>

        {/* Bouton 2 : Préparer Physique-Chimie (Tactile 3D Mauve / Violet Impérial -> /eddams) */}
        <Link
          href="/eddams"
          className="group relative overflow-hidden flex-1 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-b from-purple-500 via-purple-600 to-indigo-700 hover:from-purple-400 hover:to-purple-600 text-white px-7 py-4 text-sm sm:text-base font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_0_#581c87,0_12px_24px_rgba(147,51,234,0.4)] active:translate-y-[4px] active:shadow-[0_2px_0_#581c87] transition-all"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
          <Atom className="h-5 w-5 text-purple-200 shrink-0" />
          <span>Préparer Physique-Chimie</span>
          <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>
      </div>

      {/* Lien Pack Double */}
      <a
        href="#tarifs"
        className="mt-6 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-cyan-300 transition-colors group"
      >
        <span>Ou optez pour le Pack Double Excellence (Maths + PC)</span>
        <ArrowRight className="h-3.5 w-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  );
});
