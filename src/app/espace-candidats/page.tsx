"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  BookOpen,
  Atom,
  CheckCircle2,
  MessageCircle,
  GraduationCap,
} from "lucide-react";

export default function EspaceCandidatsPage() {
  return (
    <div className="min-h-screen bg-[#070c1d] text-white selection:bg-cyan-400 selection:text-slate-950 relative overflow-hidden flex flex-col justify-between">
      {/* Dynamic Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top Radial Glow Blue (Maths side) */}
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[120px]" />
        {/* Top Radial Glow Cyan (PC side) */}
        <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[120px]" />
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
          {/* Logo */}
          <Link
            href="/"
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950 font-mono font-bold text-cyan-400 text-base">
                &Sigma;&Psi;
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                Prépa<span className="text-cyan-400">sciences</span>
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 -mt-1 font-semibold">
                Excellence CPGE
              </span>
            </div>
          </Link>

          {/* Center Title pill */}
          <div className="hidden md:inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-mono font-semibold text-cyan-300 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span>Espace Candidats Officiel</span>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10 flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-gradient-to-r from-blue-950/60 to-cyan-950/60 px-4 py-1.5 text-xs font-mono font-semibold text-cyan-300 shadow-sm backdrop-blur-md">
            <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
            <span>PORTAIL DES PLATEFORMES NUMÉRIQUES CPGE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight [text-shadow:0_4px_30px_rgba(56,189,248,0.2)]">
            Espace Candidats{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-300">
              Excellence CPGE
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base font-normal max-w-2xl mx-auto leading-relaxed">
            Choisissez votre discipline pour accéder à votre plateforme d&apos;apprentissage dédiée : cours officiels, fiches de synthèse, séries de TD et banques d&apos;annales corrigées par vos professeurs agrégés.
          </p>
        </div>

        {/* 2 Big Prestigious Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch max-w-6xl mx-auto w-full">
          {/* ========================================================================= */}
          {/* CARTE 1 : PLATEFORME DE MATHÉMATIQUES (PR. ANASS KHADIR) - CYAN ÉLECTRIQUE */}
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
              <div className="flex items-center gap-2">
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

              {/* Features List */}
              <ul className="space-y-2.5 pt-2 border-t border-white/10 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Programmes & Fiches Méthodes :</strong> Synthèses complètes, lemmes essentiels d&apos;algèbre et d&apos;analyse.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Annales CNC & Concours Français :</strong> Corrigés détaillés Mines-Ponts, Centrale, CCINP et CNC Maroc.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Séances & Réflexes de Concours :</strong> Démarche rigoureuse pour aborder les problèmes d&apos;écrits et d&apos;oraux.
                  </span>
                </li>
              </ul>

              {/* Direct Quick-Links Section */}
              <div className="pt-2 border-t border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2 font-semibold">
                  Accès direct par rubrique :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <a
                    href="https://anasskhadir.com/programmes-maroc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.03] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 text-left transition-all group/sublink flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-white group-hover/sublink:text-cyan-300 flex items-center justify-between">
                      <span>Programmes</span>
                      <ExternalLink className="h-3 w-3 opacity-60 group-hover/sublink:opacity-100" />
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1">
                      Syllabus officiel
                    </span>
                  </a>

                  <a
                    href="https://anasskhadir.com/concours-annales/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.03] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 text-left transition-all group/sublink flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-white group-hover/sublink:text-cyan-300 flex items-center justify-between">
                      <span>Annales & CNC</span>
                      <ExternalLink className="h-3 w-3 opacity-60 group-hover/sublink:opacity-100" />
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1">
                      Sujets & corrigés
                    </span>
                  </a>

                  <a
                    href="https://anasskhadir.com/cours-exo-mp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.03] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 text-left transition-all group/sublink flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-white group-hover/sublink:text-cyan-300 flex items-center justify-between">
                      <span>Cours & Exos</span>
                      <ExternalLink className="h-3 w-3 opacity-60 group-hover/sublink:opacity-100" />
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1">
                      Méthodes & réflexes
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* Main Action Button 3D Cyan Électrique */}
            <div className="pt-6 relative z-10">
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
          {/* CARTE 2 : PLATEFORME DE PHYSIQUE-CHIMIE (PR. HASSAN EDDAMS) - MAUVE IMPÉRIAL */}
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
                    CPGE Lycée Moulay Abdellah- Safi
                  </p>
                </div>
              </div>

              {/* Filières Badges */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                  Filière :
                </span>
                <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs font-mono font-bold">
                  MP / MP* 2ème année (Unique)
                </span>
              </div>

              {/* Features List */}
              <ul className="space-y-2.5 pt-2 border-t border-white/10 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Cours & Travaux Dirigés :</strong> Séances complètes, fiches de synthèse et TD résolus pas à pas.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Annales & Concours :</strong> Sujets CNC, Mines-Ponts et CCINP avec corrigés détaillés et vidéos.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Références & Formulaires :</strong> Manuels de référence, formulaires officiels et rapports de jury.
                  </span>
                </li>
              </ul>

              {/* Direct Quick-Links Section */}
              <div className="pt-2 border-t border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2 font-semibold">
                  Accès direct par rubrique :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Link
                    href="/eddams?rubrique=cours"
                    className="p-2 rounded-xl bg-white/[0.03] hover:bg-purple-500/15 border border-white/10 hover:border-purple-400/40 text-left transition-all group/sublink flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-white group-hover/sublink:text-purple-300 flex items-center justify-between">
                      <span>Cours & TDs</span>
                      <ArrowRight className="h-3 w-3 opacity-60 group-hover/sublink:opacity-100 group-hover/sublink:translate-x-0.5 transition-transform" />
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1">
                      Séances & Fiches
                    </span>
                  </Link>

                  <Link
                    href="/eddams?rubrique=concours"
                    className="p-2 rounded-xl bg-white/[0.03] hover:bg-purple-500/15 border border-white/10 hover:border-purple-400/40 text-left transition-all group/sublink flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-white group-hover/sublink:text-purple-300 flex items-center justify-between">
                      <span>Concours</span>
                      <ArrowRight className="h-3 w-3 opacity-60 group-hover/sublink:opacity-100 group-hover/sublink:translate-x-0.5 transition-transform" />
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1">
                      Annales & Corrigés
                    </span>
                  </Link>

                  <Link
                    href="/eddams?rubrique=references"
                    className="p-2 rounded-xl bg-white/[0.03] hover:bg-purple-500/15 border border-white/10 hover:border-purple-400/40 text-left transition-all group/sublink flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-white group-hover/sublink:text-purple-300 flex items-center justify-between">
                      <span>Références</span>
                      <ArrowRight className="h-3 w-3 opacity-60 group-hover/sublink:opacity-100 group-hover/sublink:translate-x-0.5 transition-transform" />
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1">
                      Livres & Formulaires
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Action Button 3D Mauve Impérial */}
            <div className="pt-6 relative z-10">
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

        {/* Reassurance & Support Bar */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto w-full rounded-2xl bg-white/[0.02] border border-white/10 p-5 sm:p-6 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center shrink-0">
              <GraduationCap className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                Besoin d&apos;informations ou d&apos;une inscription ?
              </h4>
              <p className="text-[11px] text-slate-400 font-mono">
                Échangez directement avec les professeurs et le secrétariat pédagogique CPGE.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/212716314673?text=Bonjour%20Pr%C3%A9pasciences,%20je%20souhaite%20des%20informations%20sur%20les%20acc%C3%A8s%20aux%20plateformes%20CPGE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/40 px-4 py-2.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-all shrink-0 shadow-sm"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Assistance WhatsApp CPGE</span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-6 px-4 text-center text-xs font-mono text-slate-500 relative z-10">
        <p>&copy; {new Date().getFullYear()} PrépaSciences · Tous droits réservés · Pôle d&apos;Excellence CPGE Mathématiques & Physique-Chimie</p>
      </footer>
    </div>
  );
}
