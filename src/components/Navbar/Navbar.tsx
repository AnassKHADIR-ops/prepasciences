"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, MessageCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import MegaMenu from "./MegaMenu";
import MobileNav from "./MobileNav";

const NAV_ITEMS = [
  { id: "hero", label: "Accueil", href: "#hero" },
  { id: "professeurs", label: "Nos Professeurs", href: "#professeurs" },
  { id: "tarifs", label: "Nos formations", href: "#tarifs" },
  { id: "syllabus", label: "Ressources", href: "#syllabus" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activePole, setActivePole] = useState<"maths" | "pc" | null>(null);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navContainerRef = useRef<HTMLElement | null>(null);

  // Scroll listener for sticky navbar opacity elevation & active section spy
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section active detection
      if (window.scrollY < 120) {
        setActiveSection("hero");
        return;
      }

      const scrollPosition = window.scrollY + 200;
      const sections = [
        { id: "tarifs", el: document.getElementById("tarifs") },
        { id: "syllabus", el: document.getElementById("syllabus") },
        { id: "professeurs", el: document.getElementById("professeurs") },
        { id: "hero", el: document.getElementById("hero") },
      ];

      for (const section of sections) {
        if (section.el) {
          const top = section.el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string, href: string) => {
    setActiveSection(id);
    if (window.location.pathname === "/") {
      e.preventDefault();
      if (id === "hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        try { window.history.pushState(null, "", "/"); } catch {}
      } else {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          try { window.history.pushState(null, "", href); } catch {}
        }
      }
    }
  };

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
        {/* LOGO GAUCHE : NOUVEAU LOGO OFFICIEL PRÉPASCIENCES */}
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
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/logo-icon.png"
              alt="Logo PrépaSciences"
              width={36}
              height={36}
              priority
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-black text-xl sm:text-2xl tracking-tight text-[#4C1D95] transition-colors leading-none">
            PRÉPASCIENCES
          </span>
        </Link>

        {/* DESKTOP NAV ITEMS DYNAMIQUES AVEC INDICATEUR MAUVE GLISSANT */}
        <nav
          className="hidden lg:flex items-center space-x-1 xl:space-x-2"
          aria-label="Navigation principale"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id, item.href)}
                className={`relative px-3.5 py-2 text-sm transition-colors duration-200 ${
                  isActive
                    ? "font-bold text-purple-950"
                    : "font-medium text-slate-700 hover:text-purple-900"
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-purple-700 rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 32,
                    }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* DESKTOP ACTIONS DROITE : EXACT BOUTON VIOLET DU MOCKUP */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/espace-candidats"
            className="group inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-purple-800 hover:bg-purple-900 rounded-xl shadow-xs hover:shadow transition-all duration-200 active:scale-98"
          >
            <span>Accéder à la plateforme</span>
            <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-0.5 transition-transform" />
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
