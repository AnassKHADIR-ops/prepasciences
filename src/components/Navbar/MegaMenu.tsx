"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  FileCheck2,
  GraduationCap,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { POLES_DATA, PoleData } from "./navData";

interface MegaMenuProps {
  activePole: "maths" | "pc" | null;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function MegaMenu({
  activePole,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuProps) {
  if (!activePole) return null;

  const data: PoleData = POLES_DATA[activePole];
  const isMaths = activePole === "maths";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activePole}
        initial={{ opacity: 0, y: 8, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.985 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 z-50 w-[540px] max-w-[calc(100vw-2rem)] pointer-events-auto"
      >
        {/* Invisible Hover Bridge between trigger and dropdown */}
        <div className="absolute -top-2.5 left-0 right-0 h-3 bg-transparent" />

        {/* Glassmorphic Panel Container (520px - 560px compact) */}
        <div className="relative rounded-2xl bg-[#08142B]/95 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-blue-950/40 p-5 overflow-hidden">
          {/* Top specular highlight refraction line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          {/* Subtle Ambient Radial Lighting Glow */}
          <div
            className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-20"
            style={{
              background: isMaths
                ? "radial-gradient(circle, #06B6D4 0%, transparent 70%)"
                : "radial-gradient(circle, #9333EA 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
            {/* ========================================================================= */}
            {/* COLONNE GAUCHE : "Parcours & Ressources" (7 cols) */}
            {/* ========================================================================= */}
            <div className="sm:col-span-7 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Parcours & Ressources
                </span>
                <span
                  className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                    isMaths
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                      : "bg-purple-500/10 border-purple-500/30 text-purple-300"
                  }`}
                >
                  {data.badge}
                </span>
              </div>

              {/* Tuile 1 : Programmes Officiels avec Badges cliquables */}
              <div className="group rounded-xl p-2.5 transition-all duration-200 bg-transparent hover:bg-white/5 border border-transparent hover:border-white/5">
                <a
                  href={data.programmes.href}
                  target={isMaths ? "_blank" : undefined}
                  rel={isMaths ? "noopener noreferrer" : undefined}
                  onClick={onClose}
                  className="flex items-center justify-between mb-1.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-transform duration-200 group-hover:scale-110 ${
                        isMaths
                          ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                          : "bg-purple-500/15 border-purple-500/30 text-purple-400"
                      }`}
                    >
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <span className={`block text-xs font-bold text-white transition-colors ${
                        isMaths ? "group-hover:text-cyan-300" : "group-hover:text-purple-300"
                      }`}>
                        {data.programmes.title}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-mono">
                        {data.programmes.subtitle}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                </a>

                {/* Badges cliquables */}
                <div className="flex items-center gap-1.5 pl-10.5">
                  {data.filiereBadges.map((badge, idx) => (
                    <a
                      key={idx}
                      href={badge.href}
                      target={isMaths ? "_blank" : undefined}
                      rel={isMaths ? "noopener noreferrer" : undefined}
                      onClick={onClose}
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border transition-all ${
                        isMaths
                          ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 hover:border-cyan-400/50"
                          : "bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/25 hover:border-purple-400/50"
                      }`}
                    >
                      {badge.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Tuile 2 : Sujets & Annales Corrigées */}
              <a
                href={data.annales.href}
                target={isMaths ? "_blank" : undefined}
                rel={isMaths ? "noopener noreferrer" : undefined}
                onClick={onClose}
                className="group flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 bg-transparent hover:bg-white/5 border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 transition-transform duration-200 group-hover:scale-110 shrink-0">
                    <FileCheck2 className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {data.annales.title}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono">
                      {data.annales.subtitle}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
              </a>

              {/* Tuile 3 : Notre Pédagogie */}
              <a
                href={data.pedagogie.href}
                target={isMaths ? "_blank" : undefined}
                rel={isMaths ? "noopener noreferrer" : undefined}
                onClick={onClose}
                className="group flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 bg-transparent hover:bg-white/5 border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 transition-transform duration-200 group-hover:scale-110 shrink-0">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {data.pedagogie.title}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono">
                      {data.pedagogie.subtitle}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
              </a>
            </div>

            {/* ========================================================================= */}
            {/* COLONNE DROITE : "Le Professeur Référent" (5 cols) */}
            {/* ========================================================================= */}
            <div className="sm:col-span-5 flex flex-col items-center text-center justify-between rounded-xl bg-white/[0.02] border border-white/5 p-3.5 relative overflow-hidden group/prof">
              {/* Reflet verre interne */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
                Professeur Référent
              </span>

              {/* Avatar circulaire 64x64px */}
              <div
                className={`relative w-16 h-16 rounded-full overflow-hidden border-2 shadow-lg mb-2 transition-transform duration-300 group-hover/prof:scale-105 shrink-0 ${
                  isMaths
                    ? "border-cyan-500/50 shadow-cyan-500/20"
                    : "border-purple-500/50 shadow-purple-500/20"
                }`}
              >
                <Image
                  src={data.professor.photoUrl}
                  alt={data.professor.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Nom & Titre */}
              <div className="space-y-0.5 mb-2">
                <h4 className="text-xs font-bold text-white tracking-tight">
                  {data.professor.name}
                </h4>
                <p className="text-[10px] font-mono text-slate-400">
                  {data.professor.title}
                </p>
              </div>

              {/* Action 1 : Voir le profil complet → */}
              <a
                href={data.professor.profileHref}
                target={isMaths ? "_blank" : undefined}
                rel={isMaths ? "noopener noreferrer" : undefined}
                onClick={onClose}
                className={`inline-flex items-center gap-1 text-[11px] font-medium transition-colors mb-2.5 group/link ${
                  isMaths
                    ? "text-cyan-400 hover:text-cyan-300"
                    : "text-purple-400 hover:text-purple-300"
                }`}
              >
                <span>Voir le profil complet</span>
                <ArrowRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
              </a>

              {/* Action 2 : Bouton compact Échanger sur WhatsApp */}
              <a
                href={data.professor.whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Échanger sur WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
