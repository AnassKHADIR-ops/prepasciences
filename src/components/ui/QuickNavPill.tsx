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
        className="ui-btn-primary px-4 py-2.5 text-xs shadow-md"
      >
        <GraduationCap className="h-4 w-4" strokeWidth={1.6} />
        <span className="hidden sm:inline">Espace Candidats</span>
      </Link>

      {/* Bouton Remonter */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Remonter en haut de page"
        className="ui-btn-secondary h-10 w-10 shadow-md"
      >
        <ArrowUp className="h-4 w-4" strokeWidth={1.6} />
      </button>
    </aside>
  );
}
