"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  Award,
  BookOpen,
  Check,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

export default function EspaceCandidatsPage() {
  return (
    <div className="min-h-screen bg-[#F4F1E6] text-[#1D1D1F] flex flex-col justify-between">
      {/* Header minimaliste */}
      <header className="sticky top-0 z-50 w-full bg-[#F4F1E6]/85 backdrop-blur-xl border-b border-black/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-black/10 flex items-center justify-center p-1">
              <Image
                src="/logo-icon.png"
                alt="Logo PrépaSciences"
                width={32}
                height={32}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base sm:text-lg tracking-tight text-[#1D1D1F] leading-none">
                PrépaSciences
              </span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-[#6E6A63] mt-0.5 font-medium">
                Excellence CPGE
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="ui-btn-secondary px-4 py-2 text-xs sm:text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.6} />
            <span>Retour au site</span>
          </Link>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex flex-col justify-center">
        {/* En-tête éditorial sobre */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="ui-eyebrow">
            <GraduationCap className="w-3.5 h-3.5 text-[#7A5230]" strokeWidth={1.6} />
            <span>Portail Multi-Filières CPGE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#1D1D1F]">
            Espace Candidats
          </h1>

          <p className="text-[#57534E] text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Accédez à votre plateforme dédiée en Mathématiques ou Physique-Chimie, conçue pour accompagner toutes les filières des Classes Préparatoires.
          </p>
        </div>

        {/* Deux cartes minimalistes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* Carte 1 : Mathématiques */}
          <article className="ui-card ui-card-hover p-7 sm:p-9 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#57534E]">
                  <BookOpen className="w-3.5 h-3.5 text-[#1D1D1F]" strokeWidth={1.6} />
                  <span>Pôle Mathématiques</span>
                </span>

                <span className="ui-pill text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E6F4E]" aria-hidden="true" />
                  <span>Plateforme active</span>
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl overflow-hidden border border-black/10 bg-[#F4F1E6] shrink-0">
                  <Image
                    src="/anas-khadir.webp"
                    alt="Pr. Anass Khadir"
                    width={72}
                    height={72}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                    Mathématiques
                  </h2>
                  <p className="text-sm font-medium text-[#7A5230] mt-0.5">
                    Pr. Anass KHADIR · Professeur Agrégé
                  </p>
                  <p className="text-xs text-[#6E6A63] mt-0.5">
                    Centre CPGE ERRAZI — El Jadida
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t border-black/10 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="ui-pill font-semibold text-[#1D1D1F]">
                    Toutes les filières CPGE
                  </span>
                  <span className="text-xs text-[#6E6A63]">
                    MP · PC · PSI · TSI · BCPST
                  </span>
                </div>

                <ul className="space-y-2.5 text-sm text-[#57534E]">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7A5230] mt-0.5 shrink-0" strokeWidth={1.75} />
                    <span>Cours magistraux approfondis, résumés et théorèmes clés</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7A5230] mt-0.5 shrink-0" strokeWidth={1.75} />
                    <span>Annales corrigées CNC, Mines-Ponts, Centrale et X-ENS</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7A5230] mt-0.5 shrink-0" strokeWidth={1.75} />
                    <span>Quiz interactifs d&apos;auto-évaluation et suivi pédagogique</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <a
                href="https://quiz.anasskhadir.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="ui-btn-primary w-full py-3.5 px-6 text-sm group"
              >
                <span>Accéder aux Mathématiques</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.6}
                />
              </a>
            </div>
          </article>

          {/* Carte 2 : Physique-Chimie */}
          <article className="ui-card ui-card-hover p-7 sm:p-9 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#57534E]">
                  <Atom className="w-3.5 h-3.5 text-[#1D1D1F]" strokeWidth={1.6} />
                  <span>Pôle Physique-Chimie</span>
                </span>

                <span className="ui-pill text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E6F4E]" aria-hidden="true" />
                  <span>Plateforme active</span>
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl overflow-hidden border border-black/10 bg-[#F4F1E6] shrink-0">
                  <Image
                    src="/hassan-eddams.webp"
                    alt="Pr. Hassan Eddams"
                    width={72}
                    height={72}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-semibold tracking-[-0.02em] text-[#1D1D1F]">
                    Physique-Chimie
                  </h2>
                  <p className="text-sm font-medium text-[#7A5230] mt-0.5">
                    Pr. Hassan EDDAMS · Professeur Agrégé
                  </p>
                  <p className="text-xs text-[#6E6A63] mt-0.5">
                    CPGE Lycée Moulay Abdellah — Safi
                  </p>
                </div>
              </div>

              <div className="pt-5 border-t border-black/10 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="ui-pill font-semibold text-[#1D1D1F]">
                    Toutes les filières CPGE
                  </span>
                  <span className="text-xs text-[#6E6A63]">
                    MP · PC · PSI · TSI · PT
                  </span>
                </div>

                <ul className="space-y-2.5 text-sm text-[#57534E]">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7A5230] mt-0.5 shrink-0" strokeWidth={1.75} />
                    <span>Polycopiés de cours officiels rédigés et fiches de synthèse</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7A5230] mt-0.5 shrink-0" strokeWidth={1.75} />
                    <span>Séances de cours structurées, replays HD et séries de TD</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#7A5230] mt-0.5 shrink-0" strokeWidth={1.75} />
                    <span>Banque complète d&apos;annales CPGE Maroc et France</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/eddams"
                className="ui-btn-primary w-full py-3.5 px-6 text-sm group"
              >
                <span>Accéder à la Physique-Chimie</span>
                <ArrowRight
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.6}
                />
              </Link>
            </div>
          </article>
        </div>

        {/* Bandeau discret de confiance */}
        <footer className="mt-14 pt-8 border-t border-black/10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-[#6E6A63]">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#1D1D1F]" strokeWidth={1.5} />
            <span>Excellence académique CPGE Maroc &amp; France</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1D1D1F]" strokeWidth={1.5} />
            <span>Espace sécurisé et synchronisé</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#1D1D1F]" strokeWidth={1.5} />
            <span>Professeurs Agrégés référents</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
