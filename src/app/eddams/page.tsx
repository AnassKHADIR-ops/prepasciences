"use client";

import React, { useState, useEffect, Suspense, useSyncExternalStore } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Atom, MessageCircle, AlertTriangle } from "lucide-react";
import { GateCards3D, SectionType } from "@/components/eddams/GateCards3D";
import { ConcoursWidget } from "@/components/eddams/ConcoursWidget";
import { FiliereConcours } from "@/components/eddams/pcConcoursData";
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
  const rawNiveau = searchParams.get("niveau");
  const niveauParam: "sup" | "spe" | null =
    rawNiveau === "sup" || rawNiveau === "spe" ? rawNiveau : null;
  const rawFiliere = searchParams.get("filiere")?.toUpperCase();
  const filiereParam: FiliereConcours | null =
    rawFiliere === "MP" ||
    rawFiliere === "PSI" ||
    rawFiliere === "PC" ||
    rawFiliere === "TSI" ||
    rawFiliere === "PT"
      ? rawFiliere
      : null;
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
    // Si l'utilisateur est un admin, un enseignant ou un étudiant actif validé : accès direct !
    const hasAccess =
      activeCurrentUser &&
      (activeCurrentUser.role === "admin" ||
        activeCurrentUser.role === "teacher" ||
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
      className={`min-h-screen transition-colors duration-200 font-sans flex flex-col relative ${
        theme === "dark"
          ? "dark bg-[#161513] text-[#F5F3EC]"
          : "bg-[#F4F1E6] text-[#1D1D1F]"
      }`}
    >
      {/* Notification Étudiant En Attente */}
      {activeCurrentUser && activeCurrentUser.role === "student" && activeCurrentUser.status === "pending" && (
        <div className="sticky top-0 z-50 bg-[#2C251D] border-b border-white/10 text-[#F4E6CE] px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#D4A977] shrink-0" strokeWidth={1.6} />
            <span>
              Bonjour <strong>{activeCurrentUser.fullName}</strong>. Votre compte est en cours de validation par vos professeurs.
            </span>
          </div>
          <a
            href="https://wa.me/212721729799?text=Bonjour%20Professeur,%20je%20viens%20de%20m'inscrire%20sur%20Pr%C3%A9pasciences%20et%20souhaite%20activer%20mon%20compte."
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-full bg-[#2E6F4E] hover:bg-[#255A3F] text-white font-medium text-[11px] flex items-center gap-1.5 transition-colors shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.6} />
            <span>Activer sur WhatsApp</span>
          </a>
        </div>
      )}

      {/* 1. Navbar minimaliste */}
      <EddamsNavbar
        activeTab={activeSection || "portail"}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* 2. Contenu Dynamique */}
      {/* CAS A : Portail d'accueil */}
      {activeSection === null && (
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 py-12 sm:py-16 animate-fadeIn">
          <div className="text-center max-w-3xl mx-auto mb-6 flex flex-col items-center">
            <div className="relative mb-5 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-black/10 dark:border-white/15 bg-white dark:bg-[#1F1E1B] flex items-center justify-center p-1 shadow-xs">
              <Image
                src="/logo-pc.webp"
                alt="Logo Physique-Chimie CPGE Pr. Hassan EDDAMS"
                width={96}
                height={96}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>

            <div className="ui-eyebrow mb-4">
              <Atom className="w-3.5 h-3.5 text-[#7A5230] dark:text-[#D4A977]" strokeWidth={1.6} />
              <span>Pôle Physique-Chimie CPGE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-semibold text-[#1D1D1F] dark:text-[#F5F3EC] tracking-[-0.03em] mb-3">
              Pr. Hassan EDDAMS
            </h1>

            <p className="text-sm sm:text-base text-[#57534E] dark:text-[#B8B2A6] font-normal">
              Professeur Agrégé de Physique-Chimie · Toutes Filières CPGE (MPSI, PCSI, TSI · MP, PSI, PC, PT)
            </p>
          </div>

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
              initialFiliere={filiereParam}
              onSelectFiliere={(fil) => {
                router.replace(`/eddams?rubrique=concours&filiere=${fil}`, { scroll: false });
              }}
            />
          )}

          {activeSection === "cours" && (
            <CoursesWidget
              onOpenPdf={handleOpenPdf}
              onOpenVideo={handleOpenVideo}
              initialNiveau={niveauParam}
              onSelectNiveau={(lvl) => {
                if (lvl) {
                  router.push(`/eddams?rubrique=cours&niveau=${lvl}`);
                } else {
                  router.push(`/eddams?rubrique=cours`);
                }
              }}
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
