"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Atom } from "lucide-react";

export default function EspaceCandidatsPage() {
  return (
    <div className="min-h-screen bg-[#070c1d] text-white selection:bg-purple-500 selection:text-white relative overflow-hidden flex flex-col justify-between">
      {/* Dynamic Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top Radial Glow Blue (Maths side) */}
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[120px]" />
        {/* Top Radial Glow Purple (PC side) */}
        <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[120px]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full bg-[#070c1d]/80 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Officiel PrépaSciences */}
          <Link
            href="/"
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo-icon.png"
                alt="Logo PrépaSciences"
                width={36}
                height={36}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-purple-300 transition-colors leading-none">
                PRÉPASCIENCES
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 mt-0.5 font-semibold">
                Excellence CPGE
              </span>
            </div>
          </Link>

          {/* Lien Retour vers le site principal */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            <span>← Retour au site</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10 flex flex-col justify-center">
        {/* Titre Épuré & Essentiel */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2.5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Espace Candidats
          </h1>
          <p className="text-slate-400 text-sm sm:text-base font-normal">
            Accédez à votre plateforme d&apos;apprentissage dédiée.
          </p>
        </div>

        {/* 2 Cartes Épurées (Maths & PC) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch max-w-5xl mx-auto w-full">
          {/* ========================================================================= */}
          {/* CARTE 1 : PLATEFORME DE MATHÉMATIQUES (PR. ANASS KHADIR)                  */}
          {/* ========================================================================= */}
          <div className="group relative rounded-3xl p-7 sm:p-9 bg-[#0c142c]/90 backdrop-blur-2xl border border-cyan-500/30 hover:border-cyan-400/70 shadow-2xl shadow-cyan-950/50 hover:shadow-cyan-500/20 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            {/* Top highlight bar */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl group-hover:bg-cyan-500/25 transition-all" />

            <div className="space-y-6 relative z-10">
              {/* Card Header & Badge */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider">
                  <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Pôle Mathématiques</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 font-bold bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-500/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                  </span>
                  <span>Plateforme Active</span>
                </div>
              </div>

              {/* Professor Info Row */}
              <div className="flex items-center gap-4 pt-1">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-cyan-400/60 shadow-xl shadow-cyan-950/60 bg-slate-900 shrink-0">
                  <Image
                    src="/anas-khadir.webp"
                    alt="Pr. Anass Khadir"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Plateforme de Mathématiques
                  </h2>
                  <p className="text-cyan-400 font-bold text-xs sm:text-sm tracking-wide mt-0.5">
                    Pr. Anass KHADIR · Professeur Agrégé
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Centre CPGE ERRAZI — El Jadida
                  </p>
                </div>
              </div>

              {/* Filières Badges */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                  Filières :
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs font-mono font-bold">
                  MP / MP* 2e année
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs font-mono font-bold">
                  TSI 2e année
                </span>
              </div>
            </div>

            {/* Main Action Button */}
            <div className="pt-8 relative z-10">
              <a
                href="https://quiz.anasskhadir.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn relative overflow-hidden w-full py-4 px-6 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-b from-cyan-400 via-cyan-500 to-teal-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_6px_0_#0e7490,0_12px_24px_rgba(6,182,212,0.45)] active:translate-y-[3px] active:shadow-[0_2px_0_#0e7490] hover:brightness-105 transition-all flex items-center justify-center gap-2.5"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                <BookOpen className="h-4 w-4 text-slate-950" />
                <span>Entrer sur la Plateforme de Mathématiques</span>
                <ArrowRight className="h-4 w-4 text-slate-950 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARTE 2 : PLATEFORME DE PHYSIQUE-CHIMIE (PR. HASSAN EDDAMS)               */}
          {/* ========================================================================= */}
          <div className="group relative rounded-3xl p-7 sm:p-9 bg-[#0c142c]/90 backdrop-blur-2xl border border-purple-500/30 hover:border-purple-400/70 shadow-2xl shadow-purple-950/50 hover:shadow-purple-600/20 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            {/* Top highlight bar */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/80 to-transparent" />
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-purple-600/15 blur-3xl group-hover:bg-purple-600/25 transition-all" />

            <div className="space-y-6 relative z-10">
              {/* Card Header & Badge */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider">
                  <Atom className="h-3.5 w-3.5 text-purple-400" />
                  <span>Pôle Physique-Chimie</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-purple-400 font-bold bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-500/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                  </span>
                  <span>Plateforme Active</span>
                </div>
              </div>

              {/* Professor Info Row */}
              <div className="flex items-center gap-4 pt-1">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-purple-400/70 shadow-xl shadow-purple-950/60 bg-slate-900 shrink-0">
                  <Image
                    src="/hassan-eddams.webp"
                    alt="Pr. Hassan Eddams"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Plateforme de Physique-Chimie
                  </h2>
                  <p className="text-purple-400 font-bold text-xs sm:text-sm tracking-wide mt-0.5">
                    Pr. Hassan EDDAMS · Professeur Agrégé
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    CPGE Lycée Moulay Abdellah — Safi
                  </p>
                </div>
              </div>

              {/* Filières Badges */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                  Filière :
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs font-mono font-bold">
                  MP / MP* 2ème année (Unique)
                </span>
              </div>
            </div>

            {/* Main Action Button */}
            <div className="pt-8 relative z-10">
              <Link
                href="/eddams"
                className="group/btn relative overflow-hidden w-full py-4 px-6 rounded-2xl font-black text-sm text-white bg-gradient-to-b from-purple-500 via-purple-600 to-indigo-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_0_#581c87,0_12px_24px_rgba(147,51,234,0.45)] active:translate-y-[3px] active:shadow-[0_2px_0_#581c87] hover:brightness-110 transition-all flex items-center justify-center gap-2.5"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                <Atom className="h-4 w-4 text-purple-200" />
                <span>Entrer sur la Plateforme de Physique-Chimie</span>
                <ArrowRight className="h-4 w-4 text-white group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
