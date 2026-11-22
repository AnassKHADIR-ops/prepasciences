"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  BookmarkCheck,
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  Trophy,
  User,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface EddamsNavbarProps {
  activeTab?: "portail" | "cours" | "concours" | "references" | "dashboard";
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function EddamsNavbar({ activeTab = "portail", theme, onToggleTheme }: EddamsNavbarProps) {
  const router = useRouter();
  const { currentUser, isTeacher, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const activeTeacher = isMounted && (isTeacher || isAdmin);
  const activeUser = isMounted ? currentUser : null;

  const displayName = activeUser?.fullName?.trim() || "Invité";
  const firstName = activeUser?.fullName ? activeUser.fullName.split(" ")[0] : "Invité";

  const getInitials = (name: string) => {
    if (!name || name === "Invité") return "CP";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = activeTeacher ? "HE" : getInitials(displayName);

  const navLinkClass = (isActive: boolean) =>
    `px-3.5 py-1.5 rounded-full text-xs transition-colors ${
      isActive
        ? "bg-[#1D1D1F] text-[#FAF8F2] dark:bg-[#F5F3EC] dark:text-[#161513] font-semibold"
        : "text-[#57534E] dark:text-[#B8B2A6] hover:text-[#1D1D1F] dark:hover:text-[#F5F3EC] hover:bg-black/5 dark:hover:bg-white/8 font-medium"
    }`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#F4F1E6]/85 dark:bg-[#161513]/85 border-b border-black/10 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Gauche : Logo & Navigation */}
        <div className="flex items-center gap-3 sm:gap-8 min-w-0">
          <Link
            href="/eddams"
            className="flex items-center gap-2.5 shrink-0 focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-black/10 dark:border-white/15 bg-white dark:bg-[#1F1E1B] flex items-center justify-center p-0.5">
              <Image
                src="/logo-pc.webp"
                alt="Logo Physique-Chimie H. Eddams"
                width={36}
                height={36}
                className="w-full h-full object-cover rounded-lg"
                priority
              />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm sm:text-base leading-tight tracking-tight text-[#1D1D1F] dark:text-[#F5F3EC] truncate">
                H. Eddams
              </span>
              <span className="font-medium text-[9px] tracking-[0.12em] uppercase text-[#6E6A63] dark:text-[#9A9488] hidden sm:inline-block truncate">
                Toutes Filières CPGE
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Navigation portail">
            <Link href="/eddams" className={navLinkClass(activeTab === "portail")}>
              Portail
            </Link>
            <Link href="/eddams?rubrique=cours" className={navLinkClass(activeTab === "cours")}>
              Cours &amp; TDs
            </Link>
            <Link href="/eddams?rubrique=concours" className={navLinkClass(activeTab === "concours")}>
              Concours CPGE
            </Link>
            <Link href="/eddams?rubrique=references" className={navLinkClass(activeTab === "references")}>
              Références
            </Link>
            {activeTeacher && (
              <Link
                href="/dashboard-prof"
                className={`${navLinkClass(activeTab === "dashboard")} inline-flex items-center gap-1.5`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" strokeWidth={1.6} />
                <span>Tableau de bord</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Droite : Thème, Profil & Déconnexion */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-[#1F1E1B] border border-black/15 dark:border-white/15 text-[#1D1D1F] dark:text-[#F5F3EC] hover:bg-[#ECE7D8] dark:hover:bg-[#282622] transition-colors cursor-pointer"
            title={theme === "dark" ? "Passer en thème clair" : "Passer en thème sombre"}
            aria-label="Basculer le thème"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" strokeWidth={1.6} />
            ) : (
              <Moon className="w-4 h-4" strokeWidth={1.6} />
            )}
          </button>

          {activeUser ? (
            <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-[#1F1E1B] border border-black/12 dark:border-white/15 text-[#1D1D1F] dark:text-[#F5F3EC]">
              <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-[#1D1D1F] dark:bg-[#F5F3EC] text-[#FAF8F2] dark:text-[#161513] text-[11px] font-semibold">
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
              <span className="truncate max-w-[100px] sm:max-w-[140px]">{firstName}</span>
              {activeUser?.role === "admin" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#EFE7D9] dark:bg-[#282622] text-[#7A5230] dark:text-[#D4A977]">
                  Admin
                </span>
              )}
            </div>
          ) : (
            <Link href="/connexion" className="ui-btn-secondary px-4 py-1.5 text-xs">
              <User className="w-3.5 h-3.5" strokeWidth={1.6} />
              <span>Connexion</span>
            </Link>
          )}

          {activeUser && (
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/connexion");
              }}
              className="ui-btn-secondary px-3 py-1.5 text-xs hover:text-[#9B2C2C] dark:hover:text-[#F28B82]"
              title="Se déconnecter"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.6} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center bg-white dark:bg-[#1F1E1B] border border-black/15 dark:border-white/15 text-[#1D1D1F] dark:text-[#F5F3EC] cursor-pointer"
            aria-label="Menu de navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" strokeWidth={1.6} />
            ) : (
              <Menu className="w-4 h-4" strokeWidth={1.6} />
            )}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-black/10 dark:border-white/10 bg-[#F4F1E6] dark:bg-[#161513] px-4 py-3 space-y-2 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/eddams"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 border transition-colors ${
                activeTab === "portail"
                  ? "bg-[#1D1D1F] text-[#FAF8F2] dark:bg-[#F5F3EC] dark:text-[#161513] border-transparent"
                  : "bg-white dark:bg-[#1F1E1B] border-black/10 dark:border-white/10 text-[#1D1D1F] dark:text-[#F5F3EC]"
              }`}
            >
              <Compass className="w-4 h-4" strokeWidth={1.6} />
              <span>Portail</span>
            </Link>

            <Link
              href="/eddams?rubrique=cours"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 border transition-colors ${
                activeTab === "cours"
                  ? "bg-[#1D1D1F] text-[#FAF8F2] dark:bg-[#F5F3EC] dark:text-[#161513] border-transparent"
                  : "bg-white dark:bg-[#1F1E1B] border-black/10 dark:border-white/10 text-[#1D1D1F] dark:text-[#F5F3EC]"
              }`}
            >
              <BookOpen className="w-4 h-4" strokeWidth={1.6} />
              <span>Cours &amp; TDs</span>
            </Link>

            <Link
              href="/eddams?rubrique=concours"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 border transition-colors ${
                activeTab === "concours"
                  ? "bg-[#1D1D1F] text-[#FAF8F2] dark:bg-[#F5F3EC] dark:text-[#161513] border-transparent"
                  : "bg-white dark:bg-[#1F1E1B] border-black/10 dark:border-white/10 text-[#1D1D1F] dark:text-[#F5F3EC]"
              }`}
            >
              <Trophy className="w-4 h-4" strokeWidth={1.6} />
              <span>Concours CPGE</span>
            </Link>

            <Link
              href="/eddams?rubrique=references"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 border transition-colors ${
                activeTab === "references"
                  ? "bg-[#1D1D1F] text-[#FAF8F2] dark:bg-[#F5F3EC] dark:text-[#161513] border-transparent"
                  : "bg-white dark:bg-[#1F1E1B] border-black/10 dark:border-white/10 text-[#1D1D1F] dark:text-[#F5F3EC]"
              }`}
            >
              <BookmarkCheck className="w-4 h-4" strokeWidth={1.6} />
              <span>Références</span>
            </Link>
          </div>

          {activeTeacher && (
            <Link
              href="/dashboard-prof"
              onClick={() => setMobileMenuOpen(false)}
              className="ui-btn-primary w-full py-2.5 text-xs"
            >
              <LayoutDashboard className="w-4 h-4" strokeWidth={1.6} />
              <span>Tableau de bord Professeur</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
