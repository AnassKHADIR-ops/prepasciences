"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, ArrowUp } from "lucide-react";

export function QuickNavPill() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 400px
      if (window.scrollY > 400) {
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
        className="group flex items-center gap-2 rounded-full border border-purple-200 bg-white/95 px-4 py-2.5 text-xs font-bold text-slate-900 shadow-lg shadow-purple-900/5 backdrop-blur-xl hover:border-purple-300 hover:bg-purple-50 transition-all hover:scale-105 active:scale-95"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <GraduationCap className="h-4 w-4 text-purple-700 group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Espace Candidats</span>
      </Link>

      {/* Bouton Remonter */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Remonter en haut de page"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-lg backdrop-blur-xl hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </aside>
  );
}
