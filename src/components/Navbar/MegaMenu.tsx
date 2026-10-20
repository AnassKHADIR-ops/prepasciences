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

        {/* Panel Container Light */}
        <div className="relative rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-xl shadow-slate-900/5 p-5 overflow-hidden text-slate-800">
          {/* Top specular highlight refraction line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          {/* Subtle Ambient Radial Lighting Glow */}
          <div
            className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-30"
            style={{
              background: isMaths
                ? "radial-gradient(circle, #CFFAFE 0%, transparent 70%)"
                : "radial-gradient(circle, #F3E8FF 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
            {/* COLONNE GAUCHE : "Parcours & Ressources" (7 cols) */}
            <div className="sm:col-span-7 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Parcours &amp; Ressources
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    isMaths
                      ? "bg-cyan-50 border-cyan-200 text-cyan-800"
                      : "bg-purple-50 border-purple-200 text-purple-800"
                  }`}
                >
                  {data.badge}
                </span>
              </div>

              {/* Tuile 1 : Programmes Officiels avec Badges cliquables */}
              <div className="group rounded-xl p-2.5 transition-all duration-200 bg-transparent hover:bg-slate-50 border border-transparent hover:border-slate-200/60">
                <a
                  href={data.programmes.href}
                  target={isMaths ? "_blank" : undefined}
                  rel={isMaths ? "noopener noreferrer" : undefined}
                  onClick={onClose}
                  className="flex items-center justify-between mb-1.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-transform duration-200 group-hover:scale-105 ${
                        isMaths
                          ? "bg-cyan-100 border-cyan-200 text-cyan-700"
                          : "bg-purple-100 border-purple-200 text-purple-700"
                      }`}
                    >
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <span className={`block text-xs font-bold text-slate-900 transition-colors ${
                        isMaths ? "group-hover:text-cyan-700" : "group-hover:text-purple-700"
                      }`}>
                        {data.programmes.title}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-mono">
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
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border transition-all ${
                        isMaths
                          ? "bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100"
                          : "bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100"
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
                className="group flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 bg-transparent hover:bg-slate-50 border border-transparent hover:border-slate-200/60"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 transition-transform duration-200 group-hover:scale-105 shrink-0">
                    <FileCheck2 className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {data.annales.title}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-mono">
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
                className="group flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 bg-transparent hover:bg-slate-50 border border-transparent hover:border-slate-200/60"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 transition-transform duration-200 group-hover:scale-105 shrink-0">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                      {data.pedagogie.title}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-mono">
                      {data.pedagogie.subtitle}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
              </a>
            </div>

            {/* COLONNE DROITE : "Le Professeur Référent" (5 cols) */}
            <div className="sm:col-span-5 flex flex-col items-center text-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3.5 relative overflow-hidden group/prof">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
                Professeur Référent
              </span>

              {/* Avatar circulaire */}
              <div
                className={`relative w-16 h-16 rounded-full overflow-hidden border-2 shadow-sm mb-2 transition-transform duration-300 group-hover/prof:scale-105 shrink-0 ${
                  isMaths
                    ? "border-cyan-400 shadow-cyan-100"
                    : "border-purple-400 shadow-purple-100"
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
                <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                  {data.professor.name}
                </h4>
                <p className="text-[10px] font-mono text-slate-500">
                  {data.professor.title}
                </p>
              </div>

              {/* Action 1 : Voir le profil complet → */}
              <a
                href={data.professor.profileHref}
                target={isMaths ? "_blank" : undefined}
                rel={isMaths ? "noopener noreferrer" : undefined}
                onClick={onClose}
                className={`inline-flex items-center gap-1 text-[11px] font-bold transition-colors mb-2.5 group/link ${
                  isMaths
                    ? "text-cyan-700 hover:text-cyan-800"
                    : "text-purple-700 hover:text-purple-800"
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
                className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-98"
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
