"use client";

import React, { forwardRef, useState } from "react";
import { Check, Star, ArrowRight, MessageCircle, ShieldCheck, GraduationCap, Radio } from "lucide-react";

export const Stage4Pricing = forwardRef<HTMLDivElement>(function Stage4Pricing(_, ref) {
  const [activePlan, setActivePlan] = useState<"double" | "maths" | "pc">("double");

  return (
    <div
      ref={ref}
      id="tarifs-card"
      style={{
        opacity: 0,
        transform: "translate3d(0, 25px, 0)",
        pointerEvents: "none",
      }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-16 sm:pt-20 md:pt-24 pb-4 px-3 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto will-change-[transform,opacity] overflow-hidden sm:overflow-visible"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-3 sm:mb-6 space-y-1 sm:space-y-1.5 shrink-0">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-3.5 py-1 text-xs font-semibold text-cyan-300 shadow-sm backdrop-blur-md">
          <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
          <span>Formules d&apos;Adhésion Spé 2026-2027</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
          Tarifs & Inscriptions
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm font-normal max-w-xl mx-auto drop-shadow-sm">
          Accompagnement hebdomadaire interactif, replays 4K illimités, fiches de synthèse et groupes d&apos;entraide 7j/7 avec nos professeurs agrégés permanents.
        </p>
      </div>

      {/* Sélecteur Mobile : Choix de formule sans débordement vertical */}
      <div className="flex md:hidden items-center justify-center p-1 rounded-xl bg-slate-900/90 border border-white/10 mb-3 w-full max-w-sm mx-auto shadow-lg shrink-0">
        <button
          type="button"
          data-plan="double"
          onClick={() => setActivePlan("double")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-black transition-all ${
            activePlan === "double"
              ? "bg-gradient-to-r from-cyan-400 to-purple-400 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          ★ Pack Double (600 DH)
        </button>
        <button
          type="button"
          data-plan="maths"
          onClick={() => setActivePlan("maths")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
            activePlan === "maths"
              ? "bg-cyan-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Maths (300 DH)
        </button>
        <button
          type="button"
          data-plan="pc"
          onClick={() => setActivePlan("pc")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all ${
            activePlan === "pc"
              ? "bg-purple-600 text-white shadow-md"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Physique (300 DH)
        </button>
      </div>

      {/* 3 Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 w-full items-stretch">
        {/* Card 1 : Maths Seule */}
        <div className={`rounded-2xl sm:rounded-3xl border border-white/15 bg-slate-900/60 backdrop-blur-2xl p-4 sm:p-6 flex-col justify-between shadow-2xl shadow-blue-950/30 hover:border-cyan-400/60 transition-all duration-300 group ${
          activePlan === "maths" ? "flex" : "hidden md:flex"
        }`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 text-[11px] font-mono font-bold uppercase border border-cyan-500/30">
                Pôle Maths · Anass Khadir
              </span>
              <span className="text-[10px] font-mono text-slate-400">Sans engagement</span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">Formule Maths Seule</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Filière TSI 2e année & MP / MP* 2e année.
              </p>
            </div>

            <div className="pt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                  300 DH
                </span>
                <span className="text-slate-400 text-xs font-mono">/ mois</span>
              </div>
            </div>

            <ul className="space-y-2 pt-2 text-xs text-slate-300 border-t border-white/10">
              <li className="flex items-center gap-2 text-white font-medium">
                <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>2 Séances Live / sem (Mardi & Jeudi 20h)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>Tous les modules Spé (Dunford, EVN, Séries)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>Résolution annales CNC & Concours Français</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>Replays 4K & fiches de lemmes téléchargeables</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>Groupe WhatsApp 7j/7 avec Anass Khadir</span>
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <a
              href="https://wa.me/212659041407?text=Bonjour%20Professeur%20Anass%20Khadir,%20je%20souhaite%20m'inscrire%20%C3%A0%20la%20Formule%20Maths%20(300%20DH)"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/30 transition-all shadow-md group-hover:scale-[1.01]"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>S&apos;inscrire en Maths (300 DH)</span>
            </a>
          </div>
        </div>

        {/* Card 2 : Pack Double Intégral (Recommandé - High Visibility) */}
        <div className={`rounded-2xl sm:rounded-3xl border-2 border-cyan-400/80 bg-gradient-to-b from-purple-900/40 via-slate-900/65 to-cyan-950/45 backdrop-blur-2xl p-4 sm:p-6 flex-col justify-between relative shadow-2xl shadow-cyan-500/20 lg:-translate-y-2 scale-[1.01] ${
          activePlan === "double" ? "flex" : "hidden md:flex"
        }`}>
          {/* Top Floating Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-500 via-sky-500 to-cyan-400 text-slate-950 font-black text-[10px] tracking-wide uppercase shadow-md flex items-center gap-1.5 whitespace-nowrap">
            <Star className="h-3 w-3 fill-slate-950" />
            <span>Formule Recommandée · 4 Séances / Semaine</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-200 text-[11px] font-mono font-bold uppercase border border-cyan-400/30">
                Pack Double Intégral (Maths + PC)
              </span>
              <span className="text-[10px] font-mono text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
                Formule Recommandée
              </span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">Pack Double Excellence</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                L&apos;encadrement total en Maths et Physique-Chimie pour le Top CNC.
              </p>
            </div>

            <div className="pt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-purple-300 font-mono">
                  600 DH
                </span>
                <span className="text-slate-400 text-xs font-mono">/ mois</span>
              </div>
            </div>

            <ul className="space-y-2 pt-2 text-xs text-slate-200 border-t border-white/10">
              <li className="flex items-center gap-2 text-white font-semibold">
                <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>4 Séances Live / sem (2x Maths + 2x PC)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>Pôle complet : Algèbre, Analyse, Méca, Thermo, Élec</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>Replays 4K illimités + Banque d&apos;exercices corrigés</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span>Les 2 Groupes WhatsApp d&apos;entraide 7j/7</span>
              </li>
              <li className="flex items-center gap-2 text-emerald-300 font-medium">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Échange prioritaire avec Anass Khadir & Hassan Eddams</span>
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <a
              href="https://wa.me/212716314673?text=Bonjour%20Pr%C3%A9pasciences,%20je%20souhaite%20m'inscrire%20au%20Pack%20Excellence%20Maths%20et%20Physique%20(600%20DH)"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-400 hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02]"
            >
              <span>Choisir le Pack Excellence (600 DH)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Card 3 : Physique Seule (Hassan Eddams - Mauve / Violet Impérial) */}
        <div className={`rounded-2xl sm:rounded-3xl border border-white/15 bg-slate-900/60 backdrop-blur-2xl p-4 sm:p-6 flex-col justify-between shadow-2xl shadow-purple-950/30 hover:border-purple-400/60 transition-all duration-300 group ${
          activePlan === "pc" ? "flex" : "hidden md:flex"
        }`}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 text-[11px] font-mono font-bold uppercase border border-purple-500/30">
                Pôle Physique · Hassan Eddams
              </span>
              <span className="text-[10px] font-mono text-slate-400">Sans engagement</span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">Formule Physique Seule</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Filière MP / MP* 2e année.
              </p>
            </div>

            <div className="pt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                  300 DH
                </span>
                <span className="text-slate-400 text-xs font-mono">/ mois</span>
              </div>
            </div>

            <ul className="space-y-2 pt-2 text-xs text-slate-300 border-t border-white/10">
              <li className="flex items-center gap-2 text-white font-medium">
                <Check className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span>2 Séances Live / sem (Lundi & Samedi 20h)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span>Tous les modules Spé (Électromag, Ondes, Thermo)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span>Méthodologie de modélisation CNC & Mines</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span>Replays 4K & synthèses cours téléchargeables</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                <span>Groupe WhatsApp 7j/7 avec Hassan Eddams</span>
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <a
              href="https://wa.me/212721729799?text=Bonjour%20Professeur%20Hassan%20Eddams,%20je%20souhaite%20m'inscrire%20%C3%A0%20la%20Formule%20Physique%20(300%20DH)"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-purple-600 hover:text-white text-purple-300 border border-purple-500/30 transition-all shadow-md group-hover:scale-[1.01]"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>S&apos;inscrire en Physique (300 DH)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Reassurance pills below cards */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] font-mono text-slate-300 shrink-0">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 backdrop-blur-md">
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
          <span>Sans engagement · Annulable à tout moment</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 backdrop-blur-md">
          <GraduationCap className="h-3.5 w-3.5 text-blue-400" />
          <span>Professeurs Agrégés d&apos;État en CPGE</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 backdrop-blur-md">
          <Radio className="h-3.5 w-3.5 text-emerald-400" />
          <span>Replays 4K & entraide WhatsApp 7j/7</span>
        </div>
      </div>
    </div>
  );
});
