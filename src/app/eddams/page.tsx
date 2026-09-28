"use client";

import React, { useState, useEffect, Suspense, useSyncExternalStore } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Atom, MessageCircle, AlertTriangle } from "lucide-react";
import { GateCards3D, SectionType } from "@/components/eddams/GateCards3D";
import { ConcoursWidget } from "@/components/eddams/ConcoursWidget";
import { CoursesWidget } from "@/components/eddams/CoursesWidget";
import { ReferencesWidget } from "@/components/eddams/ReferencesWidget";
import { PdfViewerModal } from "@/components/eddams/PdfViewerModal";
import { VideoPlayerModal } from "@/components/eddams/VideoPlayerModal";
import { FreemiumLockModal } from "@/components/video/FreemiumLockModal";
import { EddamsNavbar } from "@/components/eddams/EddamsNavbar";
import { useAuth } from "@/context/AuthContext";

function EddamsPortal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rubriqueParam = searchParams.get("rubrique") as SectionType | null;
  const { currentUser } = useAuth();

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const activeCurrentUser = isMounted ? currentUser : null;

  const activeSection =
    rubriqueParam && ["cours", "concours", "references"].includes(rubriqueParam)
      ? rubriqueParam
      : null;

  // Thème Sombre optionnel (Mode Clair conservé par défaut)
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("eddams_theme");
      if (saved === "dark" || saved === "light") {
        const timer = setTimeout(() => {
          setTheme(saved);
        }, 0);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore if localStorage unavailable
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("eddams_theme", nextTheme);
    } catch {
      // Ignore
    }
  };

  // Modales universelles
  const [pdfModal, setPdfModal] = useState<{ isOpen: boolean; url: string | null; title: string }>({
    isOpen: false,
    url: null,
    title: "",
  });

  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; url: string | null; title: string }>({
    isOpen: false,
    url: null,
    title: "",
  });

  const handleSelectSection = (sec: SectionType) => {
    router.push(`/eddams?rubrique=${sec}`);
  };

  // État de la modale Freemium / Verrouillage Vidéo & WhatsApp
  const [freemiumModal, setFreemiumModal] = useState<{
    isOpen: boolean;
    resourceTitle: string;
    isPending: boolean;
  }>({
    isOpen: false,
    resourceTitle: "",
    isPending: false,
  });

  const handleOpenPdf = (url: string, title: string) => {
    setPdfModal({ isOpen: true, url, title });
  };

  const handleOpenVideo = (url: string, title: string) => {
    // Si l'utilisateur est un enseignant ou un étudiant actif validé : accès direct !
    const hasAccess =
      activeCurrentUser &&
      (activeCurrentUser.role === "teacher" ||
        (activeCurrentUser.role === "student" && activeCurrentUser.status === "active"));

    if (hasAccess) {
      setVideoModal({ isOpen: true, url, title });
    } else {
      // Freemium verrouillé pour les visiteurs non connectés ou étudiants en attente
      const isPending =
        activeCurrentUser?.role === "student" && activeCurrentUser.status === "pending";

      setFreemiumModal({
        isOpen: true,
        resourceTitle: title,
        isPending: !!isPending,
      });
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans flex flex-col relative ${
        theme === "dark"
          ? "dark bg-[#070a13] text-slate-100 selection:bg-purple-900 selection:text-purple-100"
          : "bg-[#f4f6ff] text-slate-900 selection:bg-purple-100 selection:text-purple-900"
      }`}
    >

      {/* 0 bis. Notification Étudiant En Attente (Option A) */}
      {activeCurrentUser && activeCurrentUser.role === "student" && activeCurrentUser.status === "pending" && (
        <div className="sticky top-0 z-50 bg-amber-950/95 border-b border-amber-500/40 text-amber-200 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Bonjour <strong>{activeCurrentUser.fullName}</strong>. Votre compte est en cours de validation par vos professeurs.
            </span>
          </div>
          <a
            href="https://wa.me/212721729799?text=Bonjour%20Professeur,%20je%20viens%20de%20m'inscrire%20sur%20Pr%C3%A9pasciences%20et%20souhaite%20activer%20mon%20compte."
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Activer sur WhatsApp</span>
          </a>
        </div>
      )}

      {/* Halos cosmiques élégants en mode sombre pour l'immersion physique/chimie */}
      {theme === "dark" && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-900/15 blur-[120px]" />
          <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-indigo-900/15 blur-[120px]" />
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-cyan-950/15 blur-[120px]" />
        </div>
      )}

      {/* 1. Navbar Professionnelle conforme à la maquette (Logo H. Eddams, Thème Naturel/Sombre, Nom Utilisateur, Déconnexion) */}
      <EddamsNavbar
        activeTab={activeSection || "portail"}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* 2. Contenu Dynamique */}
      {/* CAS A : Page d'accueil avec les 3 Cartes 3D */}
      {activeSection === null && (
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 py-12 sm:py-16 animate-fadeIn">
          {/* En-tête Noble & Épuré du Professeur */}
          <div className="text-center max-w-3xl mx-auto mb-6 flex flex-col items-center">
            {/* Logo Officiel Physique-Chimie (Atome 3D) */}
            <div className="relative mb-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-2xl shadow-purple-500/30 border-2 border-purple-500/40 ring-4 ring-purple-500/10 hover:scale-105 transition-transform duration-300 bg-white dark:bg-slate-900 flex items-center justify-center p-1">
              <Image
                src="/logo-pc.webp"
                alt="Logo Physique-Chimie CPGE Pr. Hassan EDDAMS"
                width={96}
                height={96}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>

            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-purple-700 dark:text-purple-300 bg-purple-100/70 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-500/30 px-4 py-1.5 rounded-full mb-3 shadow-2xs">
              <Atom className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              Pôle Physique-Chimie CPGE
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2.5 transition-colors">
              Pr. Hassan EDDAMS
            </h1>

            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium transition-colors">
              Professeur Agrégé de Physique-Chimie · CPGE Spé MP / MP*
            </p>
          </div>

          {/* Les 3 Cartes 3D Fondamentales */}
          <div className="w-full">
            <GateCards3D onSelectSection={handleSelectSection} />
          </div>
        </div>
      )}

      {/* CAS B : Contenu de la section sélectionnée (Historique navigateur natif) */}
      {activeSection !== null && (
        <main className="relative z-10 flex-1 px-4 sm:px-6 py-8 animate-fadeIn">
          {activeSection === "concours" && (
            <ConcoursWidget
              onOpenPdf={handleOpenPdf}
              onOpenVideo={handleOpenVideo}
            />
          )}

          {activeSection === "cours" && (
            <CoursesWidget
              onOpenPdf={handleOpenPdf}
              onOpenVideo={handleOpenVideo}
            />
          )}

          {activeSection === "references" && (
            <ReferencesWidget
              onOpenPdf={handleOpenPdf}
            />
          )}
        </main>
      )}

      {/* 4. Modales Universelles Drive PDF, YouTube & Freemium Lock */}
      <PdfViewerModal
        isOpen={pdfModal.isOpen}
        onClose={() => setPdfModal({ isOpen: false, url: null, title: "" })}
        url={pdfModal.url}
        title={pdfModal.title}
      />

      <VideoPlayerModal
        isOpen={videoModal.isOpen}
        onClose={() => setVideoModal({ isOpen: false, url: null, title: "" })}
        url={videoModal.url}
        title={videoModal.title}
      />

      <FreemiumLockModal
        isOpen={freemiumModal.isOpen}
        onClose={() =>
          setFreemiumModal({ isOpen: false, resourceTitle: "", isPending: false })
        }
        resourceTitle={freemiumModal.resourceTitle}
        isPendingStudent={freemiumModal.isPending}
        studentName={activeCurrentUser?.fullName || ""}
        studentEmail={activeCurrentUser?.email || ""}
        defaultPole="pc"
      />
    </div>
  );
}

export default function EddamsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f6ff] dark:bg-[#070a13]" />}>
      <EddamsPortal />
    </Suspense>
  );
}
