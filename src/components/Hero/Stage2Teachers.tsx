"use client";

import React, { forwardRef, useState } from "react";
import Image from "next/image";
import { Award, MapPin, MessageCircle, ChevronDown, Atom, Globe } from "lucide-react";
import { GlassTiltCard } from "@/components/ui/GlassTiltCard";
import { SessionCountdown } from "@/components/ui/SessionCountdown";

export const Stage2Teachers = forwardRef<HTMLDivElement>(function Stage2Teachers(_, ref) {
  const [activeTeacher, setActiveTeacher] = useState<"pc" | "maths">("pc");

  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: "translate3d(0, 30px, 0)",
        pointerEvents: "none",
      }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-16 sm:pt-20 md:pt-24 pb-4 px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto will-change-[transform,opacity,filter] overflow-hidden sm:overflow-visible"
    >
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-3 sm:mb-8 space-y-1.5 sm:space-y-2 shrink-0">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-3.5 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-cyan-300 shadow-sm backdrop-blur-md shadow-cyan-500/10">
          <Award className="h-3.5 w-3.5 text-cyan-400" />
          <span className="tracking-wide">Encadrement d&apos;Élite en CPGE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-shadow:0_4px_30px_rgba(56,189,248,0.25)]">
          Nos Professeurs Agrégés
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm font-normal max-w-lg mx-auto leading-relaxed">
          Deux professeurs agrégés permanents dans les centres publics au Maroc
        </p>
      </div>

      {/* Sélecteur Mobile : Pr. Hassan Eddams (PC) / Pr. Anas Khadir (Maths) */}
      <div className="flex md:hidden items-center justify-center p-1 rounded-xl bg-slate-900/90 border border-white/10 mb-3 w-full max-w-xs mx-auto shadow-lg shrink-0">
        <button
          type="button"
          data-teacher="pc"
          onClick={() => setActiveTeacher("pc")}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTeacher === "pc"
              ? "bg-purple-600 text-white shadow-md shadow-purple-950/50"
              : "text-slate-400 hover:text-white"
          }`}
        >
          ⚛️ Pr. Eddams (PC)
        </button>
        <button
          type="button"
          data-teacher="maths"
          onClick={() => setActiveTeacher("maths")}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTeacher === "maths"
              ? "bg-[#18C7F3] text-[#050B1D] shadow-md shadow-cyan-950/50"
              : "text-slate-400 hover:text-white"
          }`}
        >
          📐 Pr. Khadir (Maths)
        </button>
      </div>

      {/* Grid 2 Professeurs: PC à GAUCHE | MATHS à DROITE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full items-stretch">
        {/* GAUCHE : PROFESSEUR DE PHYSIQUE-CHIMIE (HASSAN EDDAMS) - MAUVE / VIOLET IMPÉRIAL */}
        <div className={`w-full ${activeTeacher === "pc" ? "block" : "hidden md:block"}`}>
          <GlassTiltCard
            glowColor="rgba(168, 85, 247, 0.22)"
            accentBorder="hover:border-purple-400/60"
            className="p-4 sm:p-7"
          >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden shadow-xl border-2 border-purple-400/70 bg-slate-900">
                  <Image
                    src="/hassan-eddams.webp"
                    alt="Hassan Eddams - Professeur Agrégé de Physique-Chimie"
                    width={96}
                    height={112}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 text-[10px] font-mono font-bold uppercase border border-purple-500/30">
                  Pôle Physique-Chimie
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Hassan Eddams
                </h3>
                <p className="text-purple-400 font-bold text-xs tracking-wide">
                  Professeur Agrégé de Physique-Chimie
                </p>
                <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                  <span>CPGE Lycée Moulay Abdellah- Safi</span>
                </p>
              </div>
            </div>

            {/* Filière enseignée badge */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5">
                Filière enseignée actuellement :
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs font-mono font-bold">
                  MP / MP* 2ème année
                </span>
              </div>
            </div>

            {/* Countdown Prochaine Séance Flight-board */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ring-2 ring-emerald-400/50" />
                  </span>
                  <span className="text-[11px] font-mono font-semibold tracking-wide text-slate-300">
                    Prochaine séance Live
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                  Lundi & Samedi 20h
                </span>
              </div>

              <SessionCountdown targetDays={[1, 6]} targetHour={20} colorClass="text-purple-400" />
            </div>
          </div>

          {/* Boutons d'Action : Espace Physique-Chimie & WhatsApp Direct */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href="/eddams"
              className="group relative overflow-hidden py-3 px-3 rounded-xl font-bold text-xs text-purple-200 bg-purple-950/80 border border-purple-500/40 hover:border-purple-400 hover:text-white shadow-md active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
            >
              <Atom className="h-4 w-4 text-purple-400 shrink-0" />
              <span>Ouvrir l&apos;espace PC</span>
            </a>

            <a
              href="https://wa.me/212721729799?text=Bonjour%20Professeur%20Hassan%20Eddams,%20je%20souhaite%20des%20informations%20sur%20la%20fili%C3%A8re%20MP%20Physique-Chimie"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden py-3 px-3 rounded-xl font-bold text-xs text-white bg-gradient-to-b from-purple-500 via-purple-600 to-indigo-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_4px_0_#581c87] active:translate-y-[2px] active:shadow-[0_2px_0_#581c87] hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4 text-white shrink-0" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </GlassTiltCard>
        </div>

        {/* DROITE : PROFESSEUR DE MATHÉMATIQUES (ANASS KHADIR) - BLEU CYAN ÉLECTRIQUE */}
        <div className={`w-full ${activeTeacher === "maths" ? "block" : "hidden md:block"}`}>
          <GlassTiltCard
            glowColor="rgba(6, 182, 212, 0.22)"
            accentBorder="hover:border-cyan-400/60"
            className="p-4 sm:p-7"
          >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden shadow-xl border-2 border-cyan-400/60 bg-slate-900">
                  <Image
                    src="/anas-khadir.webp"
                    alt="Anass Khadir - Professeur Agrégé de Mathématiques"
                    width={96}
                    height={112}
                    loading="lazy"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-[10px] font-mono font-bold uppercase border border-cyan-500/30">
                  Pôle Mathématiques
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Anass Khadir
                </h3>
                <p className="text-cyan-400 font-bold text-xs tracking-wide">
                  Professeur Agrégé de Mathématiques
                </p>
                <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                  <span>Centre CPGE ERRAZI — El Jadida</span>
                </p>
              </div>
            </div>

            {/* Filières enseignées badges */}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5">
                Filières enseignées actuellement :
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs font-mono font-bold">
                  Filière TSI 2e année
                </span>
                <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs font-mono font-bold">
                  MP / MP* 2e année
                </span>
              </div>
            </div>

            {/* Countdown Prochaine Séance Flight-board */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ring-2 ring-emerald-400/50" />
                  </span>
                  <span className="text-[11px] font-mono font-semibold tracking-wide text-slate-300">
                    Prochaine séance Live
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                  Mardi & Jeudi 20h
                </span>
              </div>

              <SessionCountdown targetDays={[2, 4]} targetHour={20} colorClass="text-cyan-400" />
            </div>
          </div>

          {/* Boutons d'Action : Site Web & WhatsApp Direct */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href="https://anasskhadir.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden py-3 px-3 rounded-xl font-bold text-xs text-cyan-200 bg-cyan-950/80 border border-cyan-500/40 hover:border-cyan-400 hover:text-white shadow-md active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
            >
              <Globe className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>Site Anass Khadir</span>
            </a>

            <a
              href="https://wa.me/212659041407?text=Bonjour%20Professeur%20Anass%20Khadir,%20je%20souhaite%20des%20informations%20sur%20les%20fili%C3%A8res%20TSI%20et%20MP%20Maths"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden py-3 px-3 rounded-xl font-black text-xs text-slate-950 bg-gradient-to-b from-cyan-400 via-cyan-500 to-teal-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_0_#0e7490] active:translate-y-[2px] active:shadow-[0_2px_0_#0e7490] hover:brightness-105 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4 text-slate-950 shrink-0" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </GlassTiltCard>
        </div>
      </div>

      {/* Micro indicator prompt to continue to exercise */}
      <div className="mt-6 text-center text-xs font-mono text-slate-400 flex items-center gap-1.5 drop-shadow">
        <span>Scrollez pour passer à l&apos;entraînement</span>
        <ChevronDown className="h-3.5 w-3.5 text-cyan-400 animate-bounce" />
      </div>
    </div>
  );
});
