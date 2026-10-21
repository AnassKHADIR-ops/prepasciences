"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { CleanLightLanding } from "@/components/Landing/CleanLightLanding";
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
    <main className="min-h-screen bg-[#FFFDF9] text-[#17142D] selection:bg-purple-200 selection:text-purple-900 overflow-x-clip">
      {/* Sticky / Glass Navigation Bar (Light Theme) */}
      <Navbar />

      {/* Official Light Landing Experience:
          - Stage 1: Hero Section clair & épuré
          - Stage 2: Nos Professeurs Agrégés avec Contours de séances professionnels & Countdown
          - Stage 2.5: Carrousel continu du Syllabus Math & PC
          - Stage 3: Passer à l'entraînement (Maths & PC)
          - Stage 4: Tarifs & Inscriptions (Maths 300 DH, Double 600 DH, PC 300 DH)
      */}
      <CleanLightLanding />

      {/* Floating Quick Action Pill */}
      <QuickNavPill />
    </main>
  );
}
