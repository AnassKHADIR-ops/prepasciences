"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Moon, Sun, LogOut, LayoutDashboard, User, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface EddamsNavbarProps {
  activeTab?: "portail" | "cours" | "concours" | "references" | "dashboard";
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function EddamsNavbar({ activeTab = "portail", theme, onToggleTheme }: EddamsNavbarProps) {
  const router = useRouter();
  const { currentUser, isTeacher, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Nom d'affichage et initiales
  const displayName = currentUser?.fullName?.trim() || "Invité";
  const firstName = currentUser?.fullName ? currentUser.fullName.split(" ")[0] : "Invité";

  const getInitials = (name: string) => {
    if (!name || name === "Invité") return "CP";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = isTeacher ? "HE" : getInitials(displayName);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-colors duration-200 border-b ${
        theme === "dark"
          ? "bg-[#090e1c]/95 border-purple-500/20 text-slate-200"
          : "bg-white/95 border-slate-200/80 shadow-xs text-slate-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* ── Gauche : Logo Officiel Physique-Chimie & Titre ── */}
        <div className="flex items-center gap-2 sm:gap-6 min-w-0">
          <Link
            href="/eddams"
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 focus:outline-hidden"
          >
            {/* Logo Officiel Physique-Chimie (Atome 3D) */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform shrink-0 border border-purple-500/30 bg-white dark:bg-slate-900 flex items-center justify-center p-0.5">
              <Image
                src="/logo-pc.webp"
                alt="Logo Physique-Chimie H. Eddams"
                width={40}
                height={40}
                className="w-full h-full object-cover rounded-xl"
                priority
              />
            </div>

            <div className="flex flex-col min-w-0">
              <span
                className={`font-black text-xs sm:text-base leading-tight tracking-tight truncate ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}
              >
                H. Eddams
              </span>
              <span className="font-bold text-[8px] sm:text-[9px] tracking-wider uppercase text-slate-400 hidden xs:inline-block sm:inline-block truncate">
                CPGE MP / MP*
              </span>
            </div>
          </Link>

          {/* Navigation Liens (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            <Link
              href="/eddams"
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "portail"
                  ? theme === "dark"
                    ? "bg-purple-950/70 border border-purple-500/40 text-purple-300 font-bold"
                    : "bg-blue-50 border border-blue-200 text-blue-700 font-bold shadow-2xs"
                  : theme === "dark"
                  ? "text-slate-400 hover:text-white hover:bg-white/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Portail
            </Link>

            <Link
              href="/eddams?rubrique=cours"
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "cours"
                  ? theme === "dark"
                    ? "bg-purple-950/70 border border-purple-500/40 text-purple-300 font-bold"
                    : "bg-blue-50 border border-blue-200 text-blue-700 font-bold shadow-2xs"
                  : theme === "dark"
                  ? "text-slate-400 hover:text-white hover:bg-white/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Espace Cours
            </Link>

            <Link
              href="/eddams?rubrique=concours"
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "concours"
                  ? theme === "dark"
                    ? "bg-purple-950/70 border border-purple-500/40 text-purple-300 font-bold"
                    : "bg-blue-50 border border-blue-200 text-blue-700 font-bold shadow-2xs"
                  : theme === "dark"
                  ? "text-slate-400 hover:text-white hover:bg-white/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Concours CPGE
            </Link>

            <Link
              href="/eddams?rubrique=references"
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === "references"
                  ? theme === "dark"
                    ? "bg-purple-950/70 border border-purple-500/40 text-purple-300 font-bold"
                    : "bg-blue-50 border border-blue-200 text-blue-700 font-bold shadow-2xs"
                  : theme === "dark"
                  ? "text-slate-400 hover:text-white hover:bg-white/5"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Références
            </Link>

            {isTeacher && (
              <Link
                href="/dashboard-prof"
                className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === "dashboard"
                    ? theme === "dark"
                      ? "bg-purple-600 text-white font-black shadow-md shadow-purple-950/60"
                      : "bg-blue-600 text-white font-black shadow-md shadow-blue-500/20"
                    : theme === "dark"
                    ? "text-purple-300 hover:text-white hover:bg-purple-950/50"
                    : "text-blue-700 hover:bg-blue-50"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Tableau de bord</span>
              </Link>
            )}
          </nav>
        </div>

        {/* ── Droite : Bascule Mode Naturel / Sombre + Nom Utilisateur + Déconnexion ── */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Bouton de bascule Mode Naturel (Clair) <-> Mode Sombre */}
          <button
            type="button"
            onClick={onToggleTheme}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              theme === "dark"
                ? "bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-white/10 shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/90 shadow-2xs"
            }`}
            title={
              theme === "dark"
                ? "Passer en Mode Naturel (Clair)"
                : "Passer en Mode Sombre"
            }
            aria-label="Basculer le thème"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Pilule Utilisateur (Professeur ou Étudiant) */}
          {currentUser ? (
            <div
              className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                theme === "dark"
                  ? isTeacher
                    ? "bg-purple-950/60 border-purple-500/40 text-purple-200"
                    : "bg-slate-900 border-white/10 text-slate-200"
                  : isTeacher
                  ? "bg-blue-50 border-blue-200 text-blue-950"
                  : "bg-slate-100 border-slate-200 text-slate-800"
              }`}
            >
              {/* Cercle avec Logo ou Initiales */}
              <div
                className={`w-7 h-7 rounded-full overflow-hidden flex items-center justify-center shadow-xs shrink-0 ${
                  isTeacher ? "border border-purple-500/40 bg-slate-900" : "bg-emerald-600 text-white font-black text-[11px]"
                }`}
              >
                {isTeacher ? (
                  <Image
                    src="/logo-pc.webp"
                    alt="Pr. Eddams"
                    width={28}
                    height={28}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              {/* Prénom */}
              <span className="truncate max-w-[100px] sm:max-w-[140px]">
                {firstName}
              </span>
            </div>
          ) : (
            <Link
              href="/connexion"
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                theme === "dark"
                  ? "bg-purple-950/60 border-purple-500/40 text-purple-300 hover:bg-purple-900"
                  : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 shadow-2xs"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Connexion</span>
            </Link>
          )}

          {/* Bouton Déconnexion */}
          {currentUser && (
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/connexion");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                theme === "dark"
                  ? "border-white/15 text-slate-300 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10"
                  : "border-slate-300 text-slate-700 hover:text-red-600 hover:border-red-400 hover:bg-red-50"
              }`}
              title="Se déconnecter"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          )}

          {/* Bouton Hamburger Mobile (< lg) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`lg:hidden w-9 h-9 rounded-xl flex items-center justify-center border transition-colors cursor-pointer ${
              theme === "dark"
                ? "border-white/10 text-slate-300 hover:bg-slate-800"
                : "border-slate-300 text-slate-700 hover:bg-slate-100"
            }`}
            aria-label="Menu de navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-purple-500" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Menu Mobile Déroulant (< lg) ── */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-t px-4 py-3 space-y-2 animate-fadeIn transition-colors ${
            theme === "dark"
              ? "bg-[#0b1020] border-purple-500/20 text-slate-200"
              : "bg-white border-slate-200 shadow-md text-slate-800"
          }`}
        >
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/eddams"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                activeTab === "portail"
                  ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                  : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/50"
              }`}
            >
              <span className="text-base">🏛️</span>
              <span>Portail</span>
            </Link>

            <Link
              href="/eddams?rubrique=cours"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                activeTab === "cours"
                  ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                  : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/50"
              }`}
            >
              <span className="text-base">📚</span>
              <span>Espace Cours</span>
            </Link>

            <Link
              href="/eddams?rubrique=concours"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                activeTab === "concours"
                  ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                  : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/50"
              }`}
            >
              <span className="text-base">🏆</span>
              <span>Concours CPGE</span>
            </Link>

            <Link
              href="/eddams?rubrique=references"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                activeTab === "references"
                  ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                  : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/50"
              }`}
            >
              <span className="text-base">📖</span>
              <span>Références</span>
            </Link>
          </div>

          {isTeacher && (
            <Link
              href="/dashboard-prof"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full mt-2 p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Accéder au Tableau de bord Professeur</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
