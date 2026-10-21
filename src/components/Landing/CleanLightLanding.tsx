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
  Globe,
  Quote
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
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

        {/* Conteneur des Profils Enseignants en Mode Alterné Apple */}
        <div className="space-y-12 sm:space-y-16">
          
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* 1. PROFESSEUR PHYSIQUE-CHIMIE : PR. HASSAN EDDAMS                  */}
          {/*    Layout : PHOTO À GAUCHE — TEXTE À DROITE                       */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className={`w-full ${activeTeacherMobile === "pc" ? "block" : "hidden md:block"}`}>
            <article className="rounded-3xl bg-white border border-purple-200/80 shadow-[0_12px_45px_rgba(124,58,237,0.06)] hover:shadow-[0_18px_55px_rgba(124,58,237,0.1)] hover:border-purple-300 transition-all duration-300 p-6 sm:p-10 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* COLONNE GAUCHE : PHOTO OFFICIELLE */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_36px_rgba(124,58,237,0.12)] border-2 border-purple-200/90 bg-purple-50 group">
                    <Image
                      src="/profs/prof-pc.png"
                      alt="Hassan Eddams - Professeur Agrégé de Physique-Chimie CPGE"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 420px"
                      className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-950/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md py-2.5 px-3.5 rounded-xl border border-purple-200/80 shadow-md flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
                        <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">Pr. Hassan Eddams</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                        CPGE Safi
                      </span>
                    </div>
                  </div>
                </div>

                {/* COLONNE DROITE : BIO, CITATION, SÉANCES & ACTIONS */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Badges d'En-tête */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-purple-100/90 text-purple-800 text-xs font-mono font-bold uppercase tracking-wider border border-purple-200">
                        Pôle Physique-Chimie
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-medium border border-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        Centre CPGE Moulay Abdellah · Safi
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight">
                      Hassan Eddams
                    </h3>
                    <p className="text-purple-700 font-semibold text-sm sm:text-base">
                      Professeur Agrégé de Physique et Chimie
                    </p>
                  </div>

                  {/* Présentation / Bio (Style Apple épuré) */}
                  <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                    <p>
                      Je suis Professeur Agrégé de Physiques et chimie au Centre des Classes Préparatoires aux Grandes Écoles d’Ingénieurs Moulay Abdellah à Safi.
                    </p>
                    <p>
                      Depuis plusieurs années, j’accompagne des étudiants de classes préparatoires (MP, PSI, TSI), de prépas intégrées, d’écoles d’ingénieurs et d’universités dans leur parcours académique.
                    </p>
                  </div>

                  {/* Bloc Citation Inspirante PrépaSciences */}
                  <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-50/70 to-slate-50 border-l-4 border-purple-600 border border-purple-100/80 shadow-2xs">
                    <div className="flex gap-3">
                      <Quote className="w-5 h-5 text-purple-600 shrink-0 mt-0.5 rotate-180 opacity-80" />
                      <p className="text-xs sm:text-sm text-slate-700 italic font-medium leading-relaxed">
                        « Nous les profs, on a créé le portail PREPASCIENCES afin de mettre à disposition des ressources pédagogiques de qualité : cours, exercices corrigés, problèmes classiques, méthodes de résolution, vidéos et conseils de préparation aux concours. »
                      </p>
                    </div>
                  </div>

                  {/* Filières Préparées */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                      Filières préparées :
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 text-xs font-mono font-bold shadow-2xs">
                      MPSI / PCSI / TSI
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-purple-100 border border-purple-300 text-purple-900 text-xs font-mono font-bold shadow-2xs">
                      MP / PSI / TSI
                    </span>
                  </div>

                  {/* Contour de Séance Professionnel */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7FF] border-2 border-purple-200/90 shadow-2xs">
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

                  {/* Boutons d'Action */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <Link
                      href="/eddams"
                      className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 hover:border-purple-300 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Atom className="h-4 w-4 text-purple-700 shrink-0" />
                      <span>Ouvrir l&apos;espace PC</span>
                    </Link>

                    <a
                      href="https://wa.me/212721729799?text=Bonjour%20Professeur%20Hassan%20Eddams,%20je%20souhaite%20des%20informations%20sur%20les%20cours%20de%20Physique-Chimie%20CPGE"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-800 hover:to-indigo-700 shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4 text-white shrink-0" />
                      <span>WhatsApp Direct</span>
                    </a>
                  </div>

                </div>
              </div>
            </article>
          </div>


          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* 2. PROFESSEUR MATHÉMATIQUES : PR. ANASS KHADIR                     */}
          {/*    Layout : TEXTE À GAUCHE — PHOTO À DROITE (Comme www.anasskhadir.com) */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className={`w-full ${activeTeacherMobile === "maths" ? "block" : "hidden md:block"}`}>
            <article className="rounded-3xl bg-white border border-cyan-200/80 shadow-[0_12px_45px_rgba(6,182,212,0.06)] hover:shadow-[0_18px_55px_rgba(6,182,212,0.1)] hover:border-cyan-300 transition-all duration-300 p-6 sm:p-10 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* COLONNE GAUCHE (Sur Desktop) : BIO, CITATION, SÉANCES & ACTIONS */}
                <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
                  {/* Badges d'En-tête */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-cyan-100/90 text-cyan-900 text-xs font-mono font-bold uppercase tracking-wider border border-cyan-200">
                        Pôle Mathématiques
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-medium border border-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                        Centre CPGE ERRAZI · El Jadida
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight">
                      Anass Khadir
                    </h3>
                    <p className="text-cyan-800 font-semibold text-sm sm:text-base">
                      Professeur Agrégé de Mathématiques
                    </p>
                  </div>

                  {/* Présentation / Bio (Style Apple épuré) */}
                  <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                    <p>
                      Je suis Professeur Agrégé de Mathématiques au Centre des Classes Préparatoires aux Grandes Écoles d’Ingénieurs ERRAZI à El Jadida.
                    </p>
                    <p>
                      Depuis plusieurs années, j’accompagne des étudiants de classes préparatoires (MP, PSI, TSI, ECS, ECT), de prépas intégrées, d’écoles d’ingénieurs et d’universités dans leur parcours académique.
                    </p>
                  </div>

                  {/* Bloc Citation Inspirante PrépaSciences */}
                  <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-50/70 to-slate-50 border-l-4 border-cyan-600 border border-cyan-100/80 shadow-2xs">
                    <div className="flex gap-3">
                      <Quote className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5 rotate-180 opacity-80" />
                      <p className="text-xs sm:text-sm text-slate-700 italic font-medium leading-relaxed">
                        « Nous les profs, on a créé le portail PREPASCIENCES afin de mettre à disposition des ressources pédagogiques de qualité : cours, exercices corrigés, problèmes classiques, méthodes de résolution, vidéos et conseils de préparation aux concours. »
                      </p>
                    </div>
                  </div>

                  {/* Filières Préparées */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                      Filières préparées :
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-mono font-bold shadow-2xs">
                      TSI 2e année
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-cyan-100 border border-cyan-300 text-cyan-950 text-xs font-mono font-bold shadow-2xs">
                      MP / PSI / TSI
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-medium">
                      ECS / ECT
                    </span>
                  </div>

                  {/* Contour de Séance Professionnel */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F0F9FF] border-2 border-cyan-200/90 shadow-2xs">
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

                  {/* Boutons d'Action & Socials */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <a
                      href="https://quiz.anasskhadir.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-cyan-900 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 hover:border-cyan-300 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Globe className="h-4 w-4 text-cyan-700 shrink-0" />
                      <span>Site Anass Khadir</span>
                    </a>

                    <a
                      href="https://wa.me/212659041407?text=Bonjour%20Professeur%20Anass%20Khadir,%20je%20souhaite%20des%20informations%20sur%20les%20cours%20de%20Math%C3%A9matiques%20CPGE"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-cyan-700 to-teal-600 hover:from-cyan-800 hover:to-teal-700 shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4 text-white shrink-0" />
                      <span>WhatsApp Direct</span>
                    </a>
                  </div>

                </div>

                {/* COLONNE DROITE (Sur Desktop) : PHOTO OFFICIELLE */}
                <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
                  <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_36px_rgba(6,182,212,0.12)] border-2 border-cyan-200/90 bg-cyan-50 group">
                    <Image
                      src="/profs/prof-maths.png"
                      alt="Anass Khadir - Professeur Agrégé de Mathématiques CPGE"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 420px"
                      className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md py-2.5 px-3.5 rounded-xl border border-cyan-200/80 shadow-md flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 animate-pulse" />
                        <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">Pr. Anass Khadir</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                        CPGE El Jadida
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </article>
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
