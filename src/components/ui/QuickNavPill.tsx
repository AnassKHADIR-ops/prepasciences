"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, ArrowUp } from "lucide-react";

export function QuickNavPill() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 600px
      if (window.scrollY > 600) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Navigation rapide"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 animate-fadeIn"
    >
      {/* Bouton Espace Candidats */}
      <Link
        href="/espace-candidats"
        className="group flex items-center gap-2 rounded-full border border-cyan-500/40 bg-[#0c142c]/90 px-4 py-2.5 text-xs font-bold text-white shadow-xl shadow-cyan-950/60 backdrop-blur-xl hover:border-cyan-400 hover:bg-cyan-950/80 transition-all hover:scale-105 active:scale-95"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
        </span>
        <GraduationCap className="h-4 w-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Espace Candidats</span>
      </Link>

      {/* Bouton Remonter */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Remonter en haut de page"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 text-slate-300 shadow-xl backdrop-blur-xl hover:border-white/40 hover:bg-slate-800 hover:text-white transition-all hover:scale-105 active:scale-95"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </aside>
  );
}
