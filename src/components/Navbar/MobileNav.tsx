"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  BookOpen,
  Atom,
  FileCheck2,
  GraduationCap,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { POLES_DATA, PoleData } from "./navData";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const emptySubscribe = () => () => {};

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [openAccordion, setOpenAccordion] = useState<"maths" | "pc" | null>(
    null
  );
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setOpenAccordion(null);
    }
  }

  // Background body scroll lock when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const toggleAccordion = (id: "maths" | "pc") => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  const renderPoleContent = (data: PoleData) => {
    const isMaths = data.id === "maths";

    return (
      <div className="space-y-2.5 pt-2">
        {/* Tuile 1 : Programmes Officiels avec Badges */}
        <div className="rounded-xl p-3 bg-white/[0.03] border border-white/5 space-y-2">
          <a
            href={data.programmes.href}
            target={isMaths ? "_blank" : undefined}
            rel={isMaths ? "noopener noreferrer" : undefined}
            onClick={onClose}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                  isMaths
                    ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                    : "bg-purple-500/15 border-purple-500/30 text-purple-400"
                }`}
              >
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">
                  {data.programmes.title}
                </span>
                <span className="block text-[10px] text-slate-400 font-mono">
                  {data.programmes.subtitle}
                </span>
              </div>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          </a>

          <div className="flex items-center gap-2 pl-9.5">
            {data.filiereBadges.map((badge, idx) => (
              <a
                key={idx}
                href={badge.href}
                target={isMaths ? "_blank" : undefined}
                rel={isMaths ? "noopener noreferrer" : undefined}
                onClick={onClose}
                className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border ${
                  isMaths
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                    : "bg-purple-500/10 border-purple-500/30 text-purple-300"
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
          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
              <FileCheck2 className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-white">
                {data.annales.title}
              </span>
              <span className="block text-[10px] text-slate-400 font-mono">
                {data.annales.subtitle}
              </span>
            </div>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        </a>

        {/* Tuile 3 : Notre Pédagogie */}
        <a
          href={data.pedagogie.href}
          target={isMaths ? "_blank" : undefined}
          rel={isMaths ? "noopener noreferrer" : undefined}
          onClick={onClose}
          className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 ${
              isMaths
                ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400"
                : "bg-purple-500/15 border border-purple-500/30 text-purple-400"
            }`}>
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-white">
                {data.pedagogie.title}
              </span>
              <span className="block text-[10px] text-slate-400 font-mono">
                {data.pedagogie.subtitle}
              </span>
            </div>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        </a>

        {/* Carte compacte Professeur Référent */}
        <div className="rounded-xl p-3 bg-white/[0.02] border border-white/5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`relative w-12 h-12 rounded-full overflow-hidden border-2 shrink-0 ${
                  isMaths ? "border-cyan-500/40" : "border-purple-500/40"
                }`}
              >
                <Image
                  src={data.professor.photoUrl}
                  alt={data.professor.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  {data.professor.name}
                </h4>
                <p className="text-[10px] font-mono text-slate-400">
                  {data.professor.title}
                </p>
              </div>
            </div>

            <a
              href={data.professor.profileHref}
              target={isMaths ? "_blank" : undefined}
              rel={isMaths ? "noopener noreferrer" : undefined}
              onClick={onClose}
              className={`text-[11px] font-medium flex items-center gap-1 shrink-0 ${
                isMaths
                  ? "text-cyan-400 hover:text-cyan-300"
                  : "text-purple-400 hover:text-purple-300"
              }`}
            >
              <span>Profil</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          </div>

          <a
            href={data.professor.whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 transition-colors flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Échanger sur WhatsApp</span>
          </a>
        </div>
      </div>
    );
  };

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed inset-x-0 top-[60px] bottom-0 z-40 bg-[#050B1D]/98 backdrop-blur-2xl flex flex-col justify-between overflow-hidden lg:hidden"
        >
          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {/* Accordion 1 : Pôle Mathématiques */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-lg">
              <button
                onClick={() => toggleAccordion("maths")}
                className="w-full flex items-center justify-between p-3.5 text-left font-bold text-white hover:bg-white/5 transition-colors"
                aria-expanded={openAccordion === "maths"}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        Pôle Mathématiques
                      </span>
                      <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                        MP/MP* & TSI
                      </span>
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: openAccordion === "maths" ? 180 : 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openAccordion === "maths" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden border-t border-white/5 bg-slate-950/40 px-3 pb-3"
                  >
                    {renderPoleContent(POLES_DATA.maths)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2 : Pôle Physique-Chimie */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden shadow-lg">
              <button
                onClick={() => toggleAccordion("pc")}
                className="w-full flex items-center justify-between p-3.5 text-left font-bold text-white hover:bg-white/5 transition-colors"
                aria-expanded={openAccordion === "pc"}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400">
                    <Atom className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        Pôle Physique-Chimie
                      </span>
                      <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300">
                        MP / MP*
                      </span>
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: openAccordion === "pc" ? 180 : 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openAccordion === "pc" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden border-t border-white/5 bg-slate-950/40 px-3 pb-3"
                  >
                    {renderPoleContent(POLES_DATA.pc)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Direct Navigation Links */}
            <div className="pt-2 border-t border-white/10 space-y-1">
              <a
                href="#hero"
                onClick={onClose}
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                Accueil & Présentation
              </a>
              <a
                href="#professeurs"
                onClick={onClose}
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                Nos Professeurs Agrégés
              </a>
              <a
                href="#tarifs"
                onClick={onClose}
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                Tarifs & Inscriptions
              </a>
            </div>
          </div>

          {/* Fixed Bottom Action Bar */}
          <div className="p-3.5 bg-[#050B1D]/98 border-t border-white/10 backdrop-blur-xl flex gap-2">
            <a
              href="https://wa.me/212716314673?text=Bonjour%20Pr%C3%A9pasciences,%20je%20souhaite%20des%20informations%20sur%20les%20programmes%20CPGE"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "rgba(32, 201, 151, 0.06)",
                border: "1px solid rgba(32, 201, 151, 0.30)",
                color: "#20C997",
              }}
              className="flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[#20C997]" />
              <span>WhatsApp CPGE</span>
            </a>

            <a
              href="/espace-candidats"
              onClick={onClose}
              style={{
                background: "#18C7F3",
                color: "#050B1D",
                borderRadius: "12px",
              }}
              className="flex-1 py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#18C7F3]/25 active:scale-98 transition-all"
            >
              <span>Espace Candidats</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#050B1D]" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
