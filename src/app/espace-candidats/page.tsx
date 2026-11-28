"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Atom, Sparkles, CheckCircle2, ShieldCheck, GraduationCap, Award } from "lucide-react";

export default function EspaceCandidatsPage() {
  return (
    <div className="min-h-screen bg-[#F6F7FA] text-[#0F172A] selection:bg-purple-200 selection:text-purple-950 relative overflow-hidden flex flex-col justify-between">
      {/* Dynamic Ambient Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Subtle Gold Glow (Maths side) */}
        <div className="absolute -top-40 -left-20 w-[520px] h-[520px] rounded-full bg-[#C6A15B]/12 blur-[130px]" />
        {/* Subtle Royal Indigo Glow (PC side) */}
        <div className="absolute -top-40 -right-20 w-[520px] h-[520px] rounded-full bg-[#5B21B6]/10 blur-[130px]" />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full bg-[#F6F7FA]/90 backdrop-blur-2xl border-b border-slate-200/85 px-4 sm:px-8 py-3.5 shadow-[0_1px_10px_rgba(15,23,42,0.04)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Officiel PrépaSciences */}
          <Link
            href="/"
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-transform duration-200 group-hover:scale-105 rounded-xl bg-white p-1 border border-slate-200/90 shadow-2xs">
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
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#162A4A] group-hover:text-[#5B21B6] transition-colors leading-none">
                PRÉPA<span className="text-[#5B21B6]">SCIENCES</span>
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mt-0.5 font-bold">
                Excellence CPGE
              </span>
            </div>
          </Link>

          {/* Lien Retour vers le site principal */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#162A4A] transition-all px-4 py-1.5 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 shadow-2xs"
          >
            <span>← Retour au site</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10 flex flex-col justify-center">
        {/* Titre Noble & Harmonieux */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-[#162A4A] text-xs font-mono font-bold tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#9A7828]" />
            <span>PORTAIL MULTI-FILIÈRES CPGE D&apos;EXCELLENCE</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Espace Candidats &amp; Étudiants
          </h1>

          <p className="text-slate-600 text-sm sm:text-base font-normal max-w-xl mx-auto leading-relaxed">
            Accédez à vos plateformes d&apos;apprentissage d&apos;élite en Mathématiques et Physique-Chimie, pensées pour toutes les filières des Classes Préparatoires.
          </p>
        </div>

        {/* 2 Cartes Prestigieuses (Maths & PC) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch max-w-5xl mx-auto w-full">
          {/* ========================================================================= */}
          {/* CARTE 1 : PLATEFORME DE MATHÉMATIQUES (PR. ANASS KHADIR)                  */}
          {/* ========================================================================= */}
          <div className="group relative rounded-3xl p-7 sm:p-9 bg-white border border-slate-200/90 hover:border-[#C6A15B] shadow-[0_8px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_50px_rgba(22,42,74,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden">
            {/* Top highlight bar */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent" />

            <div className="space-y-6 relative z-10">
              {/* Card Header & Badge */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F3E6] border border-[#C6A15B]/40 text-[#7D601E] text-xs font-mono font-bold uppercase tracking-wider">
                  <BookOpen className="h-3.5 w-3.5 text-[#9A7828]" />
                  <span>Pôle Mathématiques</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#162A4A] font-semibold bg-[#F6F7FA] px-2.5 py-1 rounded-full border border-slate-200/90">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                  </span>
                  <span>Plateforme Active</span>
                </div>
              </div>

              {/* Professor Info Row */}
              <div className="flex items-center gap-4 pt-1">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#C6A15B]/50 shadow-sm bg-slate-100 shrink-0">
                  <Image
                    src="/anas-khadir.webp"
                    alt="Pr. Anass Khadir"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                    Plateforme de Mathématiques
                  </h2>
                  <p className="text-[#9A7828] font-semibold text-xs sm:text-sm tracking-wide mt-0.5">
                    Pr. Anass KHADIR · Professeur Agrégé
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Centre CPGE ERRAZI — El Jadida
                  </p>
                </div>
              </div>

              {/* Filières Badges (Toutes les filières en CPGE) */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">
                    Filières :
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#F8F3E6] border border-[#C6A15B]/35 text-[#7D601E] text-xs font-mono font-bold">
                    Toutes les filières CPGE
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-mono font-semibold">
                    MP · PC · PSI · TSI · ECS · ECT
                  </span>
                </div>

                {/* Key Points */}
                <ul className="space-y-2 text-xs text-slate-600 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#9A7828] shrink-0" />
                    <span>Cours magistraux approfondis, résumés &amp; théorèmes fondamentaux</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#9A7828] shrink-0" />
                    <span>Annales des concours écrits &amp; oraux (CNC, Mines-Ponts, Centrale, X)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#9A7828] shrink-0" />
                    <span>Quiz interactifs d&apos;auto-évaluation &amp; suivi pédagogique</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Main Action Button */}
            <div className="pt-8 relative z-10">
              <a
                href="https://quiz.anasskhadir.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn relative overflow-hidden w-full py-3.5 px-6 rounded-full font-bold text-sm text-white bg-[#162A4A] hover:bg-[#223E6B] shadow-[0_10px_24px_rgba(22,42,74,0.22)] hover:shadow-[0_14px_30px_rgba(22,42,74,0.3)] active:translate-y-[1px] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5"
              >
                <BookOpen className="h-4 w-4 text-[#E3C789]" />
                <span>Entrer sur la Plateforme de Mathématiques</span>
                <ArrowRight className="h-4 w-4 text-white group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARTE 2 : PLATEFORME DE PHYSIQUE-CHIMIE (PR. HASSAN EDDAMS)               */}
          {/* ========================================================================= */}
          <div className="group relative rounded-3xl p-7 sm:p-9 bg-white border border-slate-200/90 hover:border-[#5B21B6]/50 shadow-[0_8px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_50px_rgba(91,33,182,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden">
            {/* Top highlight bar */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#5B21B6] to-transparent" />

            <div className="space-y-6 relative z-10">
              {/* Card Header & Badge */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EEFD] border border-purple-200/80 text-[#4C1D95] text-xs font-mono font-bold uppercase tracking-wider">
                  <Atom className="h-3.5 w-3.5 text-[#5B21B6]" />
                  <span>Pôle Physique-Chimie</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#162A4A] font-semibold bg-[#F6F7FA] px-2.5 py-1 rounded-full border border-slate-200/90">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                  </span>
                  <span>Plateforme Active</span>
                </div>
              </div>

              {/* Professor Info Row */}
              <div className="flex items-center gap-4 pt-1">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-purple-200 shadow-sm bg-slate-100 shrink-0">
                  <Image
                    src="/hassan-eddams.webp"
                    alt="Pr. Hassan Eddams"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                    Plateforme de Physique-Chimie
                  </h2>
                  <p className="text-[#5B21B6] font-semibold text-xs sm:text-sm tracking-wide mt-0.5">
                    Pr. Hassan EDDAMS · Professeur Agrégé
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    CPGE Lycée Moulay Abdellah — Safi
                  </p>
                </div>
              </div>

              {/* Filières Badges (Toutes les filières en CPGE) */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">
                    Filières :
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#F3EEFD] border border-purple-200/80 text-[#4C1D95] text-xs font-mono font-bold">
                    Toutes les filières CPGE
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-mono font-semibold">
                    MP · PC · PSI · TSI · PT
                  </span>
                </div>

                {/* Key Points */}
                <ul className="space-y-2 text-xs text-slate-600 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5B21B6] shrink-0" />
                    <span>Polycopiés officiels rédigés pour chaque chapitre &amp; fiches de synthèse</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5B21B6] shrink-0" />
                    <span>Séances théoriques, replays vidéo HD &amp; résolutions pas à pas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5B21B6] shrink-0" />
                    <span>Banque de concours CPGE (CNC, Mines, Centrale, CCINP, X)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Main Action Button */}
            <div className="pt-8 relative z-10">
              <Link
                href="/eddams"
                className="group/btn relative overflow-hidden w-full py-3.5 px-6 rounded-full font-bold text-sm text-white bg-[#5B21B6] hover:bg-[#4C1D95] shadow-[0_10px_24px_rgba(91,33,182,0.25)] hover:shadow-[0_14px_30px_rgba(91,33,182,0.34)] active:translate-y-[1px] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5"
              >
                <Atom className="h-4 w-4 text-purple-200" />
                <span>Entrer sur la Plateforme de Physique-Chimie</span>
                <ArrowRight className="h-4 w-4 text-white group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quality, Authenticity & Excellence Badges Footer */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-purple-700" />
            <span>Excellence académique CPGE Maroc &amp; France</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Accompagnement rigoureux &amp; sécurisé</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Professeurs Agrégés Référents</span>
          </div>
        </div>
      </main>
    </div>
  );
}
