"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Award, 
  MapPin, 
  MessageCircle, 
  Atom, 
  BookOpen, 
  Check, 
  Star, 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  Globe 
} from "lucide-react";
import { SessionCountdown } from "@/components/ui/SessionCountdown";
import LogoMarquee from "@/components/LogoMarquee";

export function CleanLightLanding() {
  const [activeTeacherMobile, setActiveTeacherMobile] = useState<"pc" | "maths">("pc");
  const [activePlanMobile, setActivePlanMobile] = useState<"double" | "maths" | "pc">("double");

  return (
    <div className="w-full bg-[#FFFDF9] text-[#17142D]">

      {/* ========================================================================= */}
      {/* 1. HERO SECTION CLAIRE & ÉPURÉE (ZÉRO NOIRCEUR, ZÉRO TOURNEMENT D'IMAGES) */}
      {/* ========================================================================= */}
      <section 
        id="hero"
        className="relative pt-16 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center"
      >
        {/* Lueur d'ambiance très douce en arrière-plan */}
        <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-purple-100/60 via-amber-100/50 to-cyan-100/60 rounded-full blur-3xl -z-10" />

        {/* Badge Compact Sobre */}
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/90 px-4 py-1.5 text-xs font-bold text-purple-800 shadow-2xs backdrop-blur-md mb-6">
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
          <span className="tracking-wide">✦ EXCELLENCE CPGE · CNC &amp; CONCOURS</span>
        </div>

        {/* Titre H1 Massif & Lisible */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-[#17142D] mb-6 max-w-4xl mx-auto">
          PrépaSciences, <br />
          <span className="text-[#17142D]">votre plateforme d’excellence</span> <br />
          <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            pour réussir en CPGE
          </span>
        </h1>

        {/* Sous-titre aéré */}
        <div className="max-w-2xl mx-auto mb-10 space-y-2">
          <p className="text-base sm:text-lg font-bold text-purple-900 tracking-wide">
            Mathématiques &amp; Physique-Chimie
          </p>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            Des cours structurés, un entraînement régulier et un accompagnement personnalisé par nos professeurs agrégés permanents pour dominer les concours CPGE.
          </p>
        </div>

        {/* Boutons d'Action Directe */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-14">
          <a
            href="#professeurs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm sm:text-base shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <span>Découvrir nos professeurs</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <Link
            href="/eddams?rubrique=cours"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-[#17142D] border border-slate-200 font-bold text-sm sm:text-base shadow-2xs hover:border-purple-300 transition-all cursor-pointer"
          >
            <span>Accéder aux cours</span>
          </Link>
        </div>

        {/* 4 Chiffres Clés de Confiance */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-slate-200/80 max-w-3xl mx-auto text-center">
          <div className="p-3 bg-white/70 rounded-2xl border border-slate-200/60 shadow-2xs">
            <div className="text-2xl sm:text-3xl font-black text-purple-800 font-mono">2</div>
            <div className="text-xs text-slate-600 mt-1 font-medium">Professeurs Agrégés d&apos;État</div>
          </div>
          <div className="p-3 bg-white/70 rounded-2xl border border-slate-200/60 shadow-2xs">
            <div className="text-2xl sm:text-3xl font-black text-cyan-800 font-mono">100%</div>
            <div className="text-xs text-slate-600 mt-1 font-medium">Programme CNC &amp; France</div>
          </div>
          <div className="p-3 bg-white/70 rounded-2xl border border-slate-200/60 shadow-2xs">
            <div className="text-2xl sm:text-3xl font-black text-indigo-800 font-mono">MP / TSI</div>
            <div className="text-xs text-slate-600 mt-1 font-medium">Filières d&apos;Élite Préparées</div>
          </div>
          <div className="p-3 bg-white/70 rounded-2xl border border-slate-200/60 shadow-2xs">
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">7j / 7</div>
            <div className="text-xs text-slate-600 mt-1 font-medium">Suivi WhatsApp Continu</div>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 2. NOS PROFESSEURS AGRÉGÉS AVEC CONTOURS DE SÉANCES PROFESSIONNELS       */}
      {/* ========================================================================= */}
      <section 
        id="professeurs" 
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/70"
      >
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-bold text-purple-800 shadow-2xs">
            <Award className="h-3.5 w-3.5 text-purple-600" />
            <span className="tracking-wide">Encadrement d&apos;Élite en CPGE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#17142D] tracking-tight">
            Nos Professeurs Agrégés
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-normal max-w-lg mx-auto">
            Deux professeurs agrégés permanents dans les centres publics au Maroc
          </p>
        </div>

        {/* Sélecteur Mobile : Choix Enseignant */}
        <div className="flex md:hidden items-center justify-center p-1 rounded-xl bg-slate-100 border border-slate-200 mb-6 w-full max-w-xs mx-auto shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTeacherMobile("pc")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTeacherMobile === "pc"
                ? "bg-purple-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ⚛️ Pr. Eddams (PC)
          </button>
          <button
            type="button"
            onClick={() => setActiveTeacherMobile("maths")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTeacherMobile === "maths"
                ? "bg-cyan-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📐 Pr. Khadir (Maths)
          </button>
        </div>

        {/* Grid des Deux Cartes Professeurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* ── CARTE 1 : PR. HASSAN EDDAMS (PHYSIQUE-CHIMIE) ── */}
          <div className={`w-full ${activeTeacherMobile === "pc" ? "block" : "hidden md:block"}`}>
            <div className="h-full rounded-3xl bg-white border border-purple-200/90 shadow-[0_8px_30px_rgba(124,58,237,0.06)] hover:shadow-[0_16px_45px_rgba(124,58,237,0.12)] hover:border-purple-300 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between">
              
              <div className="space-y-5">
                {/* En-tête : Photo + Identité */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden shadow-md border-2 border-purple-300/80 bg-purple-50 flex items-center justify-center">
                      <Image
                        src="/logo-pc.webp"
                        alt="Hassan Eddams - Professeur Agrégé de Physique-Chimie"
                        width={96}
                        height={112}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] sm:text-[11px] font-mono font-bold uppercase border border-purple-200">
                      Pôle Physique-Chimie
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#17142D] tracking-tight">
                      Hassan Eddams
                    </h3>
                    <p className="text-purple-700 font-bold text-xs sm:text-sm">
                      Professeur Agrégé de Physique-Chimie
                    </p>
                    <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5 pt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                      <span>CPGE Lycée Moulay Abdellah- Safi</span>
                    </p>
                  </div>
                </div>

                {/* Filière enseignée badge */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1.5">
                    Filière enseignée actuellement :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 text-xs font-mono font-bold shadow-2xs">
                      MP / MP* 2ème année
                    </span>
                  </div>
                </div>

                {/* ══ LE CONTOUR DE SÉANCE PROFESSIONNEL (FLIGHT-BOARD) ══ */}
                <div className="p-4 rounded-2xl bg-[#FAF7FF] border-2 border-purple-200/90 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-emerald-300" />
                      </span>
                      <span className="text-xs font-mono font-bold tracking-wide text-slate-800">
                        Prochaine séance Live
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-purple-700 bg-white border border-purple-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                      Lundi &amp; Samedi 20h
                    </span>
                  </div>

                  <SessionCountdown 
                    targetDays={[1, 6]} 
                    targetHour={20} 
                    colorClass="text-purple-700" 
                    variant="light"
                  />
                </div>
              </div>

              {/* Boutons d'Action : Espace PC & WhatsApp Direct */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 border-t border-slate-100">
                <Link
                  href="/eddams"
                  className="py-3 px-3 rounded-xl font-bold text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 hover:border-purple-300 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Atom className="h-4 w-4 text-purple-700 shrink-0" />
                  <span>Ouvrir l&apos;espace PC</span>
                </Link>

                <a
                  href="https://wa.me/212721729799?text=Bonjour%20Professeur%20Hassan%20Eddams,%20je%20souhaite%20des%20informations%20sur%20la%20fili%C3%A8re%20MP%20Physique-Chimie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 text-white shrink-0" />
                  <span>WhatsApp Direct</span>
                </a>
              </div>

            </div>
          </div>


          {/* ── CARTE 2 : PR. ANASS KHADIR (MATHÉMATIQUES) ── */}
          <div className={`w-full ${activeTeacherMobile === "maths" ? "block" : "hidden md:block"}`}>
            <div className="h-full rounded-3xl bg-white border border-cyan-200/90 shadow-[0_8px_30px_rgba(6,182,212,0.06)] hover:shadow-[0_16px_45px_rgba(6,182,212,0.12)] hover:border-cyan-300 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between">
              
              <div className="space-y-5">
                {/* En-tête : Photo + Identité */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden shadow-md border-2 border-cyan-300/80 bg-cyan-50">
                      <Image
                        src="/anas-khadir.webp"
                        alt="Anass Khadir - Professeur Agrégé de Mathématiques"
                        width={96}
                        height={112}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 text-[10px] sm:text-[11px] font-mono font-bold uppercase border border-cyan-200">
                      Pôle Mathématiques
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#17142D] tracking-tight">
                      Anass Khadir
                    </h3>
                    <p className="text-cyan-800 font-bold text-xs sm:text-sm">
                      Professeur Agrégé de Mathématiques
                    </p>
                    <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5 pt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
                      <span>Centre CPGE ERRAZI – El Jadida</span>
                    </p>
                  </div>
                </div>

                {/* Filières enseignées badges */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block mb-1.5">
                    Filières enseignées actuellement :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-mono font-bold shadow-2xs">
                      Filière TSI 2e année
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-mono font-bold shadow-2xs">
                      MP / MP* 2e année
                    </span>
                  </div>
                </div>

                {/* ══ LE CONTOUR DE SÉANCE PROFESSIONNEL (FLIGHT-BOARD) ══ */}
                <div className="p-4 rounded-2xl bg-[#F0F9FF] border-2 border-cyan-200/90 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-emerald-300" />
                      </span>
                      <span className="text-xs font-mono font-bold tracking-wide text-slate-800">
                        Prochaine séance Live
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-cyan-800 bg-white border border-cyan-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                      Mardi &amp; Jeudi 20h
                    </span>
                  </div>

                  <SessionCountdown 
                    targetDays={[2, 4]} 
                    targetHour={20} 
                    colorClass="text-cyan-800" 
                    variant="light"
                  />
                </div>
              </div>

              {/* Boutons d'Action : Site Anass Khadir & WhatsApp Direct */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 border-t border-slate-100">
                <a
                  href="https://quiz.anasskhadir.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-xl font-bold text-xs text-cyan-800 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 hover:border-cyan-300 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Globe className="h-4 w-4 text-cyan-700 shrink-0" />
                  <span>Site Anass Khadir</span>
                </a>

                <a
                  href="https://wa.me/212659041407?text=Bonjour%20Professeur%20Anass%20Khadir,%20je%20souhaite%20des%20informations%20sur%20les%20cours%20de%20Math%C3%A9matiques%20CPGE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-700 to-teal-600 hover:from-cyan-800 hover:to-teal-700 shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4 text-white shrink-0" />
                  <span>WhatsApp Direct</span>
                </a>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Carrousel Continu du Syllabus en Direct */}
      <LogoMarquee variant="light" />

      {/* ========================================================================= */}
      {/* 3. PASSER À L'ENTRAÎNEMENT (STAGE 3 ÉPURÉ)                               */}
      {/* ========================================================================= */}
      <section 
        id="entrainement"
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center border-t border-slate-200/70"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-mono font-bold text-purple-800 mb-4 shadow-2xs">
          <GraduationCap className="h-4 w-4 text-purple-600" />
          <span>Métamorphose &amp; Maîtrise des Épreuves</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#17142D] mb-4">
          Passez à l&apos;entraînement.
        </h2>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          Le savoir des agrégés appliqué aux épreuves types Concours. Séances interactives en direct, fiches méthodes éprouvées et résolution des problèmes types CNC &amp; concours français. Choisissez votre matière pour débuter :
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-5 max-w-xl mx-auto">
          {/* Bouton Maths */}
          <a
            href="https://quiz.anasskhadir.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex-1 inline-flex items-center justify-center gap-3 rounded-2xl bg-white hover:bg-cyan-50/50 border-2 border-cyan-300 text-cyan-900 px-7 py-4 text-sm sm:text-base font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <BookOpen className="h-5 w-5 text-cyan-700 shrink-0" />
            <span>Préparer les Mathématiques</span>
            <ArrowRight className="h-4 w-4 text-cyan-700 group-hover:translate-x-1 transition-transform shrink-0" />
          </a>

          {/* Bouton PC */}
          <Link
            href="/eddams"
            className="group flex-1 inline-flex items-center justify-center gap-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white px-7 py-4 text-sm sm:text-base font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Atom className="h-5 w-5 text-purple-200 shrink-0" />
            <span>Préparer Physique-Chimie</span>
            <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform shrink-0" />
          </Link>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. TARIFS & INSCRIPTIONS (STAGE 4 ÉPURÉ)                                  */}
      {/* ========================================================================= */}
      <section 
        id="tarifs" 
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/70"
      >
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-bold text-purple-800 shadow-2xs">
            <GraduationCap className="h-3.5 w-3.5 text-purple-600" />
            <span>Formules d&apos;Adhésion Spé 2026-2027</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#17142D] tracking-tight">
            Tarifs &amp; Inscriptions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-normal max-w-xl mx-auto">
            Accompagnement hebdomadaire interactif, replays 4K illimités, fiches de synthèse et groupes d&apos;entraide 7j/7 avec nos professeurs agrégés permanents.
          </p>
        </div>

        {/* Sélecteur Mobile : Choix Formule */}
        <div className="flex md:hidden items-center justify-center p-1 rounded-xl bg-slate-100 border border-slate-200 mb-6 w-full max-w-sm mx-auto shadow-2xs">
          <button
            type="button"
            onClick={() => setActivePlanMobile("double")}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
              activePlanMobile === "double"
                ? "bg-purple-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ★ Pack Double (600 DH)
          </button>
          <button
            type="button"
            onClick={() => setActivePlanMobile("maths")}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
              activePlanMobile === "maths"
                ? "bg-cyan-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Maths (300 DH)
          </button>
          <button
            type="button"
            onClick={() => setActivePlanMobile("pc")}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
              activePlanMobile === "pc"
                ? "bg-purple-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Physique (300 DH)
          </button>
        </div>

        {/* 3 Cartes Tarifaires */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Card 1 : Maths Seule */}
          <div className={`rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 flex-col justify-between shadow-xs hover:shadow-md hover:border-cyan-300 transition-all ${
            activePlanMobile === "maths" ? "flex" : "hidden md:flex"
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-900 text-xs font-mono font-bold uppercase border border-cyan-200">
                  Pôle Maths · Anass Khadir
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-semibold">Sans engagement</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Formule Maths Seule</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Filière TSI 2e année &amp; MP / MP* 2e année.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-slate-900 font-mono">
                    300 DH
                  </span>
                  <span className="text-slate-500 text-xs font-mono font-bold">/ mois</span>
                </div>
              </div>

              <ul className="space-y-2.5 pt-4 text-xs text-slate-700 border-t border-slate-100">
                <li className="flex items-center gap-2 font-semibold text-slate-900">
                  <Check className="h-4 w-4 text-cyan-600 shrink-0" />
                  <span>2 Séances Live / sem (Mardi &amp; Jeudi 20h)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-600 shrink-0" />
                  <span>Tous les modules Spé (Dunford, EVN, Séries)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-600 shrink-0" />
                  <span>Résolution annales CNC &amp; Concours Français</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-600 shrink-0" />
                  <span>Replays 4K &amp; fiches de lemmes téléchargeables</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-600 shrink-0" />
                  <span>Groupe WhatsApp 7j/7 avec Anass Khadir</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <a
                href="https://wa.me/212659041407?text=Bonjour%20Professeur%20Anass%20Khadir,%20je%20souhaite%20m'inscrire%20%C3%A0%20la%20Formule%20Maths%20(300%20DH)"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 transition-all shadow-2xs"
              >
                <MessageCircle className="h-4 w-4 text-cyan-700" />
                <span>S&apos;inscrire en Maths (300 DH)</span>
              </a>
            </div>
          </div>

          {/* Card 2 : Pack Double Intégral (Recommandé) */}
          <div className={`rounded-3xl border-2 border-purple-500 bg-white p-6 sm:p-7 flex-col justify-between relative shadow-lg hover:shadow-xl transition-all ${
            activePlanMobile === "double" ? "flex" : "hidden md:flex"
          }`}>
            {/* Top Floating Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700 text-white font-extrabold text-[11px] tracking-wide uppercase shadow-sm flex items-center gap-1.5 whitespace-nowrap">
              <Star className="h-3.5 w-3.5 fill-white" />
              <span>Formule Recommandée · 4 Séances / Semaine</span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-mono font-bold uppercase border border-purple-200">
                  Pack Double Intégral (Maths + PC)
                </span>
                <span className="text-[10px] font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  Économie de 100 DH
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Pack Double Excellence</h3>
                <p className="text-xs text-purple-800 font-semibold mt-0.5">
                  Préparation simultanée aux 2 matières clés des écrits et oraux.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-purple-800 font-mono">
                    600 DH
                  </span>
                  <span className="text-slate-500 text-xs font-mono font-bold">/ mois</span>
                </div>
              </div>

              <ul className="space-y-2.5 pt-4 text-xs text-slate-700 border-t border-slate-100">
                <li className="flex items-center gap-2 font-bold text-purple-900">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>4 Séances Live interactives / semaine</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Accompagnement direct par les 2 professeurs agrégés</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Maths (Khadir) + Physique-Chimie (Eddams)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Préparation écrits CNC + Mines-Ponts + CCINP + Centrale</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>2 Groupes WhatsApp d&apos;entraide 7j/7</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <a
                href="https://wa.me/212716314673?text=Bonjour,%20je%20souhaite%20m'inscrire%20au%20Pack%20Double%20Int%C3%A9gral%20(Maths%20%2B%20PC%20%C3%A0%20600%20DH)"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-purple-700 hover:bg-purple-800 text-white shadow-xs transition-all"
              >
                <MessageCircle className="h-4 w-4 text-white" />
                <span>Rejoindre le Pack Double (600 DH)</span>
              </a>
            </div>
          </div>

          {/* Card 3 : Physique Seule */}
          <div className={`rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 flex-col justify-between shadow-xs hover:shadow-md hover:border-purple-300 transition-all ${
            activePlanMobile === "pc" ? "flex" : "hidden md:flex"
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 text-xs font-mono font-bold uppercase border border-purple-200">
                  Pôle PC · Hassan Eddams
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-semibold">Sans engagement</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Formule Physique Seule</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Filière MP / MP* 2ème année.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-black text-slate-900 font-mono">
                    300 DH
                  </span>
                  <span className="text-slate-500 text-xs font-mono font-bold">/ mois</span>
                </div>
              </div>

              <ul className="space-y-2.5 pt-4 text-xs text-slate-700 border-t border-slate-100">
                <li className="flex items-center gap-2 font-semibold text-slate-900">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>2 Séances Live / sem (Lundi &amp; Samedi 20h)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Ondes, Quantique, Électromagnétisme, Thermodynamique</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Polycopiés officiels rédigés par Hassan Eddams</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Correction des devoirs surveillés et sessions CNC</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Groupe WhatsApp 7j/7 avec Hassan Eddams</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <a
                href="https://wa.me/212721729799?text=Bonjour%20Professeur%20Hassan%20Eddams,%20je%20souhaite%20m'inscrire%20%C3%A0%20la%20Formule%20Physique%20(300%20DH)"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition-all shadow-2xs"
              >
                <MessageCircle className="h-4 w-4 text-purple-700" />
                <span>S&apos;inscrire en Physique (300 DH)</span>
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
