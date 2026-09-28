"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";
import { QuickNavPill } from "@/components/ui/QuickNavPill";

export default function Home() {
  // Prevent browser from restoring intermediate scroll positions when returning from /eddams or external sites
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      // If no anchor hash is present, guarantee starting cleanly at top (0, 0)
      if (!window.location.hash) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }

      // Handle bfcache / back-forward navigation
      const handlePageShow = () => {
        if (!window.location.hash) {
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      };

      window.addEventListener("pageshow", handlePageShow);
      return () => {
        window.removeEventListener("pageshow", handlePageShow);
      };
    }
  }, []);
  return (
    <main className="min-h-screen bg-[#050B1D] text-white selection:bg-[#18C7F3] selection:text-[#050B1D] overflow-x-clip">
      {/* Sticky / Glass Navigation Bar */}
      <Navbar />

      {/* Cinematic Scroll-Linked Experience across all 150 frames:
          - Stage 1: Titre principal (frames 1 à 85)
          - Stage 2: Ouverture sur Nos Professeurs Agrégés (à frame 85)
          - Stage 3: Départ des profs & Commencer à s'exercer (frames 86 à 115) avec les 2 boutons
          - Stage 4: Affichage élégant des Prix & Tarifs sur l'étudiant en préparation (frames 115 à 150)
      */}
      <Hero />

      {/* Double Carrousel Infini de Logos Concours & Écoles (Inspiration Vidéo 8:19) */}
      <LogoMarquee />

      {/* Floating Quick Action Pill */}
      <QuickNavPill />
    </main>
  );
}
