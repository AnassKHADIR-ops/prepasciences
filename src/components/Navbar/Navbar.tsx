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
          ? "bg-[#050B1D]/90 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2.5"
          : "bg-[#050B1D]/60 backdrop-blur-md border-b border-white/[0.07] py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 relative w-full">
        {/* ========================================================================= */}
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
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0D1D38] via-[#08142B] to-[#050B1D] p-0.5 border border-[#18C7F3]/40 shadow-sm shadow-[#18C7F3]/10 transition-transform duration-200 group-hover:scale-105">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#050B1D] font-mono font-black text-[#18C7F3] text-sm sm:text-lg">
              &Sigma;&Psi;
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base sm:text-xl tracking-tight text-white group-hover:text-[#45D5F7] transition-colors leading-tight">
              Prépa<span className="text-[#18C7F3]">sciences</span>
            </span>
            <span className="text-[8px] sm:text-[10px] font-mono uppercase tracking-widest text-[#91A4BA] font-semibold">
              Excellence CPGE
            </span>
          </div>
        </Link>

        {/* ========================================================================= */}
        {/* DESKTOP NAV ITEMS : MEGA-MENU TRIGGERS */}
        {/* ========================================================================= */}
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
                  ? "bg-white/[0.08] text-[#18C7F3] shadow-inner"
                  : "text-[#D9E4F2] hover:text-white hover:bg-white/[0.05]"
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
                  ? "bg-white/[0.08] text-[#18C7F3] shadow-inner"
                  : "text-[#D9E4F2] hover:text-white hover:bg-white/[0.05]"
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
            className="px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide text-[#D9E4F2] hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Tarifs &amp; Inscriptions
          </a>
        </nav>

        {/* ========================================================================= */}
        {/* DESKTOP ACTIONS DROITE */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Bouton Pilule WhatsApp CPGE (Accent Vert #20C997 Subordonné) */}
          <a
            href="https://wa.me/212716314673?text=Bonjour%20Pr%C3%A9pasciences,%20je%20souhaite%20des%20informations%20sur%20les%20programmes%20CPGE"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "rgba(32, 201, 151, 0.06)",
              border: "1px solid rgba(32, 201, 151, 0.30)",
              color: "#20C997",
            }}
            className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold hover:bg-[rgba(32,201,151,0.12)] hover:border-[rgba(32,201,151,0.50)] transition-all shadow-sm active:scale-98"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#20C997]" />
            <span>WhatsApp CPGE</span>
          </a>

          {/* Bouton Principal Espace Candidats (CTA Cyan #18C7F3 Majeur) */}
          <a
            href="/espace-candidats"
            style={{
              background: "#18C7F3",
              color: "#050B1D",
              borderRadius: "12px",
            }}
            className="group relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold shadow-[0_4px_16px_rgba(24,199,243,0.3)] hover:bg-[#45D5F7] hover:shadow-[0_6px_22px_rgba(24,199,243,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-200"
          >
            <span>Espace Candidats</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#050B1D] group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* ========================================================================= */}
        {/* BOUTON HAMBURGER MOBILE ANIMÉ */}
        {/* ========================================================================= */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="relative flex h-10 w-10 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#08142B] p-2 text-slate-200 hover:bg-white/10 lg:hidden focus:outline-none"
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
            className="block h-0.5 w-5 rounded-full bg-white mb-1"
          />
          <motion.span
            animate={
              mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }
            }
            transition={{ duration: 0.15 }}
            className="block h-0.5 w-5 rounded-full bg-white mb-1"
          />
          <motion.span
            animate={
              mobileMenuOpen
                ? { rotate: -45, y: -6 }
                : { rotate: 0, y: 0 }
            }
            transition={{ duration: 0.2 }}
            className="block h-0.5 w-5 rounded-full bg-white"
          />
        </button>

        {/* ========================================================================= */}
        {/* DESKTOP MEGA-MENU FLOTTANT */}
        {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* MOBILE NAV DRAWER */}
      {/* ========================================================================= */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
