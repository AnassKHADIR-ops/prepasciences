"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Award, 
  MapPin, 
  MessageCircle, 
  Atom, 
  Check, 
  Star, 
  GraduationCap, 
  Quote,
  Phone,
  Trophy,
  Crown,
  ArrowRight
} from "lucide-react";
import { SessionCountdown } from "@/components/ui/SessionCountdown";
import LogoMarquee from "@/components/LogoMarquee";

export function CleanLightLanding() {
  const [activeTeacherMobile, setActiveTeacherMobile] = useState<"pc" | "maths">("pc");
  const [activePlanMobile, setActivePlanMobile] = useState<"double" | "maths" | "pc">("double");

  return (
    <div className="w-full bg-[#FFFDF9] text-[#17142D]">

      {/* ========================================================================= */}
      {/* 1. HERO SECTION HAUTE ÉDITION (INSPIRÉE DE L'AFFICHE HEC / MAJOR PRÉPA)    */}
      {/* ========================================================================= */}
      <section 
        id="hero"
        className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        {/* Lueur d'ambiance très douce en arrière-plan (Pêche poudrée & lavande douce HEC) */}
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[550px] bg-gradient-to-b from-[#FCEEE6]/80 via-[#F7E7E2]/50 to-transparent rounded-full blur-3xl -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* COLONNE GAUCHE (7 cols) : HERO HEADLINE, SUBTITLE, CTAS & FILIÈRES */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Titre Principal exact du mockup */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900 font-sans">
              <span>L&apos;excellence </span>
              <span className="text-purple-800">CPGE,</span>
              <br />
              <span>à portée de </span>
              <span className="text-purple-800">méthode.</span>
            </h1>

            {/* Sous-titre exact du mockup */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal max-w-xl leading-relaxed">
              Des cours rigoureux, des exercices ciblés et un accompagnement pour réussir les concours.
            </p>

            {/* Deux Boutons CTA exacts du mockup */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <a
                href="#tarifs"
                className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl font-bold text-white bg-purple-800 hover:bg-purple-900 transition-all duration-200 shadow-md hover:shadow-lg active:scale-98 text-sm sm:text-base group"
              >
                <span>Découvrir les formations</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#syllabus"
                className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl font-bold text-purple-900 bg-white border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200 shadow-2xs text-sm sm:text-base group"
              >
                <span>Explorer les ressources</span>
                <ArrowRight className="w-4 h-4 text-purple-900 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Trait d'accentuation Orange & Liste des Filières exacts du mockup */}
            <div className="pt-2 space-y-3">
              <div className="w-16 h-1.5 bg-[#F5A623] rounded-full" />
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-bold text-slate-700 font-mono tracking-wide">
                <span>MP</span>
                <span className="text-[#F5A623] text-base leading-none">•</span>
                <span>PSI</span>
                <span className="text-[#F5A623] text-base leading-none">•</span>
                <span>TSI</span>
                <span className="text-[#F5A623] text-base leading-none">•</span>
                <span>MPSI</span>
                <span className="text-[#F5A623] text-base leading-none">•</span>
                <span>PCSI</span>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE (5 cols) : PODIUM D'EXCELLENCE 3D AVEC LOGO OFFICIEL */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center pt-8 lg:pt-0">
            <div className="relative w-full max-w-md flex flex-col items-center">
              
              {/* CARTE / MONOLITHE FLOTTANT D'EXCELLENCE AVEC LE LOGO */}
              <div className="relative z-20 mb-4 px-6 py-4 rounded-3xl bg-white/95 border-2 border-slate-200/80 shadow-[0_20px_45px_rgba(15,23,42,0.12)] text-center backdrop-blur-md animate-floatBar">
                <div className="flex items-center justify-center gap-2.5 mb-1">
                  <Image
                    src="/logo-icon.png"
                    alt="Logo PrépaSciences"
                    width={28}
                    height={28}
                    className="w-7 h-7 object-contain"
                  />
                  <span className="text-xl sm:text-2xl font-black text-purple-900 tracking-tight">
                    PRÉPASCIENCES
                  </span>
                </div>
                <div className="text-[11px] font-mono font-bold text-purple-700 tracking-widest uppercase">
                  — EXCELLENCE CPGE —
                </div>
              </div>

              {/* LE PODIUM DES 3 MARCHES (Inspiré du mockup) */}
              <div className="relative z-10 w-full flex items-end justify-center gap-3 sm:gap-4 px-2">
                
                {/* Marche 2 : PHYSIQUE */}
                <div className="flex-1 max-w-[120px] flex flex-col items-center">
                  <div className="w-full h-28 sm:h-32 rounded-t-2xl bg-gradient-to-b from-white via-slate-50 to-slate-100 border-t-2 border-x-2 border-purple-200 shadow-md flex flex-col items-center justify-between py-3">
                    <span className="text-3xl sm:text-4xl font-black text-[#0F172A] font-mono">2</span>
                    <div className="text-center px-1">
                      <span className="block text-[11px] font-mono font-bold text-purple-800 uppercase leading-tight tracking-wider">
                        PHYSIQUE
                      </span>
                    </div>
                  </div>
                </div>

                {/* Marche 1 : 👑 1 MAJOR CNC (La plus haute, au centre) */}
                <div className="flex-1 max-w-[140px] flex flex-col items-center">
                  <div className="w-full h-36 sm:h-44 rounded-t-2xl bg-gradient-to-b from-white via-amber-50/40 to-slate-100 border-t-2 border-x-2 border-amber-300 shadow-lg flex flex-col items-center justify-between py-3">
                    <div className="flex flex-col items-center">
                      <Crown className="w-5 h-5 text-amber-500 mb-0.5" />
                      <span className="text-4xl sm:text-5xl font-black text-[#0F172A] font-mono">1</span>
                    </div>
                    <div className="text-center px-1">
                      <span className="block text-[11px] font-mono font-black text-amber-950 uppercase leading-tight tracking-wider">
                        MAJOR CNC
                      </span>
                    </div>
                  </div>
                </div>

                {/* Marche 3 : MATHS */}
                <div className="flex-1 max-w-[120px] flex flex-col items-center">
                  <div className="w-full h-20 sm:h-24 rounded-t-2xl bg-gradient-to-b from-white via-amber-50/30 to-slate-100 border-t-2 border-x-2 border-amber-300 shadow-md flex flex-col items-center justify-between py-2">
                    <span className="text-2xl sm:text-3xl font-black text-[#0F172A] font-mono">3</span>
                    <div className="text-center px-1">
                      <span className="block text-[11px] font-mono font-bold text-amber-900 uppercase leading-tight tracking-wider">
                        MATHS
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Ombre de sol du podium (Teinte prestigieuse violette et ambrée) */}
              <div className="w-full max-w-[340px] h-6 bg-gradient-to-r from-purple-200/40 via-amber-200/40 to-orange-200/40 rounded-full blur-md -mt-1" />

              {/* Signature sous le podium */}
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-mono">
                <Image
                  src="/logo-icon.png"
                  alt="PrépaSciences"
                  width={16}
                  height={16}
                  className="w-4 h-4 object-contain"
                />
                <span className="font-bold text-slate-700">PrépaSciences</span>
                <span className="text-slate-400">· L&apos;Excellence CPGE</span>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 2. NOS PROFESSEURS AGRÉGÉS AVEC CONTOURS DE SÉANCES PROFESSIONNELS       */}
      {/* ========================================================================= */}
      <section 
        id="professeurs" 
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200/70"
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
                ? "bg-amber-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📐 Pr. Khadir (Maths)
          </button>
        </div>

        {/* Conteneur des Profils Enseignants - Sans cadre, élégance pure Apple */}
        <div className="space-y-20 sm:space-y-28">
          
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* 1. PROFESSEUR PHYSIQUE-CHIMIE : PR. HASSAN EDDAMS                  */}
          {/*    PHOTO SANS CADRE NI FOND À GAUCHE — TEXTE — RÉSEAUX À DROITE (MAUVE) */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className={`w-full ${activeTeacherMobile === "pc" ? "block" : "hidden md:block"}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* COLONNE GAUCHE : PHOTO OFFICIELLE DÉTOURÉE SANS CADRE NI ARRIÈRE-PLAN */}
              <div className="lg:col-span-5 flex items-end justify-center lg:justify-start">
                <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[430px]">
                  <Image
                    src="/profs/prof-pc.png"
                    alt="Pr. Hassan Eddams - Professeur Agrégé de Physique-Chimie CPGE"
                    width={1086}
                    height={1448}
                    priority
                    className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-sm"
                  />
                </div>
              </div>

              {/* COLONNE CENTRALE : BIO, CITATION, SÉANCES & ACTIONS */}
              <div className="lg:col-span-6 space-y-5">
                {/* Badges d'En-tête */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-purple-100/90 text-purple-800 text-xs font-mono font-bold uppercase tracking-wider border border-purple-200">
                      Pôle Physique-Chimie
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-medium border border-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      Centre CPGE Moulay Abdellah · Safi
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight">
                    Hassan Eddams
                  </h3>
                  <p className="text-purple-700 font-semibold text-sm sm:text-base">
                    Professeur Agrégé de Physique et Chimie
                  </p>
                </div>

                {/* Présentation / Bio (Style Apple épuré sans cadre) */}
                <div className="space-y-2.5 text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                  <p>
                    Je suis Professeur Agrégé de Physiques et chimie au Centre des Classes Préparatoires aux Grandes Écoles d’Ingénieurs Moulay Abdellah à Safi.
                  </p>
                  <p>
                    Depuis plusieurs années, j’accompagne des étudiants de classes préparatoires (MP, PSI, TSI), de prépas intégrées, d’écoles d’ingénieurs et d’universités dans leur parcours académique.
                  </p>
                </div>

                {/* Bloc Citation Épuré (Ligne d'accent gauche élégante, sans boîte) */}
                <div className="relative pl-4 sm:pl-5 border-l-2 border-purple-600 py-1 my-3">
                  <p className="text-xs sm:text-sm text-slate-700 italic font-medium leading-relaxed">
                    « Nous les profs, on a créé le portail PREPASCIENCES afin de mettre à disposition des ressources pédagogiques de qualité : cours, exercices corrigés, problèmes classiques, méthodes de résolution, vidéos et conseils de préparation aux concours. »
                  </p>
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
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF7FF] border border-purple-200/90 shadow-2xs">
                  <div className="flex items-center justify-between mb-2.5">
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


                {/* Version Mobile des Réseaux Sociaux (Mauve) */}
                <div className="flex lg:hidden items-center justify-center gap-3 pt-3">
                  <span className="text-xs font-mono text-purple-700 font-bold">Réseaux &amp; Contact :</span>
                  <a
                    href="https://wa.me/212721729799?text=Bonjour%20Professeur%20Hassan%20Eddams,%20je%20souhaite%20des%20informations%20sur%20les%20cours%20de%20Physique-Chimie%20CPGE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center hover:bg-purple-200 transition-colors"
                    aria-label="WhatsApp Pr. Eddams"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <Link
                    href="/eddams"
                    className="w-9 h-9 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center hover:bg-purple-200 transition-colors"
                    aria-label="Espace PC"
                  >
                    <Atom className="w-4 h-4" />
                  </Link>
                  <a
                    href="tel:+212721729799"
                    className="w-9 h-9 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center hover:bg-purple-200 transition-colors"
                    aria-label="Téléphone Pr. Eddams"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

              </div>

              {/* COLONNE DROITE : CODE DES RÉSEAUX SOCIAUX EN COULEURS MAUVES */}
              <aside className="hidden lg:flex lg:col-span-1 justify-center" aria-label="Réseaux sociaux Pr. Eddams">
                <div className="w-[54px] py-4 rounded-full bg-purple-50/80 border-2 border-purple-300/60 shadow-lg shadow-purple-950/5 flex flex-col items-center gap-3 backdrop-blur-md animate-floatBar">
                  {/* WhatsApp Pr. Eddams */}
                  <a
                    href="https://wa.me/212721729799?text=Bonjour%20Professeur%20Hassan%20Eddams,%20je%20souhaite%20des%20informations%20sur%20les%20cours%20de%20Physique-Chimie%20CPGE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-10 h-10 rounded-full bg-white border border-purple-200 flex items-center justify-center text-purple-700 hover:bg-purple-700 hover:text-white hover:border-purple-700 transition-all duration-300 shadow-2xs hover:scale-110"
                    aria-label="WhatsApp Pr. Eddams"
                  >
                    <MessageCircle className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                      WhatsApp Pr. Eddams
                    </span>
                  </a>

                  {/* Espace PC */}
                  <Link
                    href="/eddams"
                    className="group relative w-10 h-10 rounded-full bg-white border border-purple-200 flex items-center justify-center text-purple-700 hover:bg-purple-700 hover:text-white hover:border-purple-700 transition-all duration-300 shadow-2xs hover:scale-110"
                    aria-label="Espace Physique-Chimie"
                  >
                    <Atom className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-180" />
                    <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                      Espace PC &amp; Cours
                    </span>
                  </Link>

                  {/* Téléphone Direct */}
                  <a
                    href="tel:+212721729799"
                    className="group relative w-10 h-10 rounded-full bg-white border border-purple-200 flex items-center justify-center text-purple-700 hover:bg-purple-700 hover:text-white hover:border-purple-700 transition-all duration-300 shadow-2xs hover:scale-110"
                    aria-label="Appeler Pr. Eddams"
                  >
                    <Phone className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                      Appel : +212 721 729 799
                    </span>
                  </a>
                </div>
              </aside>

            </div>
          </div>


          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* LIGNE DE SÉPARATION DISCRÈTE ENTRE LES DEUX PROFESSEURS             */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="hidden md:block border-t border-slate-200/60 max-w-4xl mx-auto" />


          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* 2. PROFESSEUR MATHÉMATIQUES : PR. ANASS KHADIR                     */}
          {/*    TEXTE À GAUCHE — PHOTO SANS CADRE NI FOND — RÉSEAUX À DROITE (BLEU CIEL) */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className={`w-full ${activeTeacherMobile === "maths" ? "block" : "hidden md:block"}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* COLONNE GAUCHE (Desktop) : BIO, CITATION, SÉANCES & ACTIONS */}
              <div className="lg:col-span-6 space-y-5 order-2 lg:order-1">
                {/* Badges d'En-tête */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-100/90 text-amber-950 text-xs font-mono font-bold uppercase tracking-wider border border-amber-300/80">
                      Pôle Mathématiques
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-medium border border-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      Centre CPGE ERRAZI · El Jadida
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] tracking-tight">
                    Anass Khadir
                  </h3>
                  <p className="text-amber-700 font-semibold text-sm sm:text-base">
                    Professeur Agrégé de Mathématiques
                  </p>
                </div>

                {/* Présentation / Bio (Style Apple épuré sans cadre) */}
                <div className="space-y-2.5 text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                  <p>
                    Je suis Professeur Agrégé de Mathématiques au Centre des Classes Préparatoires aux Grandes Écoles d’Ingénieurs ERRAZI à El Jadida.
                  </p>
                  <p>
                    Depuis plusieurs années, j’accompagne des étudiants de classes préparatoires (MP, PSI, TSI, ECS, ECT), de prépas intégrées, d’écoles d’ingénieurs et d’universités dans leur parcours académique.
                  </p>
                </div>

                {/* Bloc Citation Épuré (Ligne d'accent gauche élégante, sans boîte) */}
                <div className="relative pl-4 sm:pl-5 border-l-2 border-amber-500 py-1 my-3">
                  <p className="text-xs sm:text-sm text-slate-700 italic font-medium leading-relaxed">
                    « Nous les profs, on a créé le portail PREPASCIENCES afin de mettre à disposition des ressources pédagogiques de qualité : cours, exercices corrigés, problèmes classiques, méthodes de résolution, vidéos et conseils de préparation aux concours. »
                  </p>
                </div>

                {/* Filières Préparées */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Filières préparées :
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-xs font-mono font-bold shadow-2xs">
                    TSI 2e année
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-950 text-xs font-mono font-bold shadow-2xs">
                    MP / PSI / TSI
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-medium">
                    ECS / ECT
                  </span>
                </div>

                {/* Contour de Séance Professionnel */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 via-orange-50/40 to-amber-50/70 border border-amber-200/90 shadow-2xs">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-emerald-300" />
                      </span>
                      <span className="text-xs font-mono font-bold tracking-wide text-slate-800">
                        Prochaine séance Live
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-amber-950 bg-white border border-amber-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                      Mardi &amp; Jeudi 20h
                    </span>
                  </div>

                  <SessionCountdown 
                    targetDays={[2, 4]} 
                    targetHour={20} 
                    colorClass="text-amber-900" 
                    variant="light"
                  />
                </div>


                {/* Version Mobile des Réseaux Sociaux (Ambre & Orange) */}
                <div className="flex lg:hidden items-center justify-center gap-3 pt-3">
                  <span className="text-xs font-mono text-amber-950 font-bold">Réseaux &amp; Contact :</span>
                  <a
                    href="https://www.instagram.com/elearning.mathematics/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-amber-100/90 text-amber-900 border border-amber-200 flex items-center justify-center hover:bg-amber-200 transition-colors"
                    aria-label="Instagram Pr. Khadir"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=100064798488374"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-amber-100/90 text-amber-900 border border-amber-200 flex items-center justify-center hover:bg-amber-200 transition-colors"
                    aria-label="Facebook Pr. Khadir"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/212659041407?text=Bonjour%20Professeur%20Anass%20Khadir,%20je%20souhaite%20des%20informations%20sur%20les%20cours%20de%20Math%C3%A9matiques%20CPGE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-amber-100/90 text-amber-900 border border-amber-200 flex items-center justify-center hover:bg-amber-200 transition-colors"
                    aria-label="WhatsApp Pr. Khadir"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <a
                    href="https://quiz.anasskhadir.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white border border-amber-300 flex items-center justify-center overflow-hidden hover:bg-amber-50 transition-colors shadow-2xs"
                    aria-label="Espace de maths"
                    title="Espace de maths"
                  >
                    <div className="relative w-7 h-7 rounded-full overflow-hidden flex items-center justify-center">
                      <Image
                        src="/logo-espace-maths.png"
                        alt="Espace de maths"
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </a>
                </div>

              </div>

              {/* COLONNE DROITE : PHOTO OFFICIELLE ÉTIRÉE TOUT À DROITE SANS CADRE NI ARRIÈRE-PLAN */}
              <div className="lg:col-span-5 flex items-end justify-center lg:justify-end order-1 lg:order-2">
                <div className="relative w-full max-w-[380px] sm:max-w-[460px] lg:max-w-none flex justify-center lg:justify-end items-end">
                  <Image
                    src="/profs/prof-maths.png"
                    alt="Pr. Anass Khadir - Professeur Agrégé de Mathématiques CPGE"
                    width={1085}
                    height={1450}
                    priority
                    className="w-full max-h-[560px] sm:max-h-[620px] object-contain object-bottom select-none pointer-events-none drop-shadow-sm"
                  />
                </div>
              </div>

              {/* COLONNE DROITE : CODE DES RÉSEAUX SOCIAUX EN COULEURS AMBRE & ORANGE */}
              <aside className="hidden lg:flex lg:col-span-1 justify-center order-3" aria-label="Réseaux sociaux Pr. Khadir">
                <div className="w-[54px] py-4 rounded-full bg-amber-50/80 border-2 border-amber-300/70 shadow-lg shadow-amber-950/5 flex flex-col items-center gap-3 backdrop-blur-md animate-floatBar">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/elearning.mathematics/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center text-amber-800 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all duration-300 shadow-2xs hover:scale-110"
                    aria-label="Instagram Pr. Khadir"
                  >
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                      Instagram Maths
                    </span>
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/profile.php?id=100064798488374"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center text-amber-800 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all duration-300 shadow-2xs hover:scale-110"
                    aria-label="Facebook Pr. Khadir"
                  >
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                    <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                      Facebook Maths
                    </span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/212659041407?text=Bonjour%20Professeur%20Anass%20Khadir,%20je%20souhaite%20des%20informations%20sur%20les%20cours%20de%20Math%C3%A9matiques%20CPGE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-10 h-10 rounded-full bg-white border border-amber-200 flex items-center justify-center text-amber-800 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all duration-300 shadow-2xs hover:scale-110"
                    aria-label="WhatsApp Pr. Khadir"
                  >
                    <MessageCircle className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                      WhatsApp Pr. Khadir
                    </span>
                  </a>

                  {/* Espace de maths */}
                  <a
                    href="https://quiz.anasskhadir.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-10 h-10 rounded-full bg-white border-2 border-amber-400 flex items-center justify-center overflow-hidden hover:border-amber-600 hover:scale-110 transition-all duration-300 shadow-2xs"
                    aria-label="Espace de maths"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                      <Image
                        src="/logo-espace-maths.png"
                        alt="Espace de maths"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
                      Espace de maths
                    </span>
                  </a>
                </div>
              </aside>

            </div>
          </div>

        </div>
      </section>

      {/* Carrousel Continu du Syllabus en Direct */}
      <LogoMarquee variant="light" />

      {/* ========================================================================= */}
      {/* 3. TARIFS & INSCRIPTIONS (STAGE 3 ÉPURÉ)                                  */}
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
                ? "bg-amber-600 text-white shadow-xs"
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
          <div className={`rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 flex-col justify-between shadow-xs hover:shadow-md hover:border-amber-300 transition-all ${
            activePlanMobile === "maths" ? "flex" : "hidden md:flex"
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-950 text-xs font-mono font-bold uppercase border border-amber-200">
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
                  <Check className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>2 Séances Live / sem (Mardi &amp; Jeudi 20h)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Tous les modules Spé (Dunford, EVN, Séries)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Résolution annales CNC &amp; Concours Français</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Replays 4K &amp; fiches de lemmes téléchargeables</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Groupe WhatsApp 7j/7 avec Anass Khadir</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <a
                href="https://wa.me/212659041407?text=Bonjour%20Professeur%20Anass%20Khadir,%20je%20souhaite%20m'inscrire%20%C3%A0%20la%20Formule%20Maths%20(300%20DH)"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 transition-all shadow-2xs"
              >
                <MessageCircle className="h-4 w-4 text-amber-700" />
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
