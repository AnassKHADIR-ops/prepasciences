"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronDown, MessageCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import MegaMenu from "./MegaMenu";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activePole, setActivePole] = useState<"maths" | "pc" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLElement | null>(null);

  // Scroll listener for sticky navbar opacity elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard accessibility: Escape key closes all dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePole(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside listener for desktop mega-menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(e.target as Node)
      ) {
        setActivePole(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Intelligent hover bridge debouncing (180ms)
  const handleMouseEnter = useCallback((pole: "maths" | "pc") => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActivePole(pole);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setActivePole(null);
    }, 180);
  }, []);

  return (
    <header
      ref={navContainerRef}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled || activePole || mobileMenuOpen
          ? "bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-xs py-2.5"
          : "bg-white/80 backdrop-blur-md border-b border-slate-200/60 py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 relative w-full">
        {/* LOGO GAUCHE : [ΣΨ] PRÉPASCIENCES · EXCELLENCE CPGE */}
        <Link
          href="/"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              try {
                window.history.pushState(null, "", "/");
              } catch {}
            }
          }}
          className="flex items-center gap-2.5 sm:gap-3 group shrink-0"
        >
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-purple-700 p-0.5 shadow-xs transition-transform duration-200 group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white font-mono font-black text-purple-700 text-sm sm:text-lg">
              &Sigma;&Psi;
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base sm:text-xl tracking-tight text-[#17142D] group-hover:text-purple-700 transition-colors leading-tight">
              Prépa<span className="text-purple-700">sciences</span>
            </span>
            <span className="text-[8px] sm:text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
              Excellence CPGE
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV ITEMS : MEGA-MENU TRIGGERS */}
        <nav
          className="hidden lg:flex items-center space-x-1"
          aria-label="Navigation principale"
        >
          {/* Item 1 : Pôle Mathématiques */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("maths")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() =>
                setActivePole((prev) => (prev === "maths" ? null : "maths"))
              }
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activePole === "maths"
                  ? "bg-cyan-50 text-cyan-800 shadow-inner"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
              aria-expanded={activePole === "maths"}
            >
              <span>Pôle Mathématiques</span>
              <motion.div
                animate={{ rotate: activePole === "maths" ? 180 : 0 }}
                transition={{ duration: 0.18 }}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.div>
            </button>
          </div>

          {/* Item 2 : Pôle Physique-Chimie */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("pc")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() =>
                setActivePole((prev) => (prev === "pc" ? null : "pc"))
              }
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activePole === "pc"
                  ? "bg-purple-50 text-purple-800 shadow-inner"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/70"
              }`}
              aria-expanded={activePole === "pc"}
            >
              <span>Pôle Physique-Chimie</span>
              <motion.div
                animate={{ rotate: activePole === "pc" ? 180 : 0 }}
                transition={{ duration: 0.18 }}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.div>
            </button>
          </div>

          {/* Item 3 : Tarifs & Inscriptions (Lien direct) */}
          <a
            href="#tarifs"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
          >
            Tarifs &amp; Inscriptions
          </a>
        </nav>

        {/* DESKTOP ACTIONS DROITE */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Bouton Pilule WhatsApp CPGE */}
          <a
            href="https://wa.me/212716314673?text=Bonjour%20Pr%C3%A9pasciences,%20je%20souhaite%20des%20informations%20sur%20les%20programmes%20CPGE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all shadow-2xs active:scale-98"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>WhatsApp CPGE</span>
          </a>

          {/* Bouton Principal Espace Candidats */}
          <Link
            href="/espace-candidats"
            className="group relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs hover:shadow transition-all duration-200 active:scale-98"
          >
            <span>Espace Candidats</span>
            <ArrowRight className="h-3.5 w-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* BOUTON HAMBURGER MOBILE ANIMÉ */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="relative flex h-10 w-10 flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700 hover:bg-slate-100 lg:hidden focus:outline-none"
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileMenuOpen}
        >
          <motion.span
            animate={
              mobileMenuOpen
                ? { rotate: 45, y: 6 }
                : { rotate: 0, y: 0 }
            }
            transition={{ duration: 0.2 }}
            className="block h-0.5 w-5 rounded-full bg-slate-800 mb-1"
          />
          <motion.span
            animate={
              mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }
            }
            transition={{ duration: 0.15 }}
            className="block h-0.5 w-5 rounded-full bg-slate-800 mb-1"
          />
          <motion.span
            animate={
              mobileMenuOpen
                ? { rotate: -45, y: -6 }
                : { rotate: 0, y: 0 }
            }
            transition={{ duration: 0.2 }}
            className="block h-0.5 w-5 rounded-full bg-slate-800"
          />
        </button>

        {/* DESKTOP MEGA-MENU FLOTTANT */}
        <MegaMenu
          activePole={activePole}
          onClose={() => setActivePole(null)}
          onMouseEnter={() => {
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current);
              closeTimeoutRef.current = null;
            }
          }}
          onMouseLeave={handleMouseLeave}
        />
      </div>

      {/* MOBILE NAV DRAWER */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
