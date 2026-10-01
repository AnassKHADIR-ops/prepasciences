"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  Lock,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";

interface FreemiumLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceTitle: string;
  isPendingStudent?: boolean;
  studentName?: string;
  studentEmail?: string;
  defaultPole?: "pc" | "maths";
}

export function FreemiumLockModal({
  isOpen,
  onClose,
  resourceTitle,
  isPendingStudent = false,
  studentName = "",
}: FreemiumLockModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#0b1228] text-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/10 animate-scaleUp relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ligne d'accent lumineuse supérieure */}
        <div className="h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-indigo-500" />

        {/* Bouton de fermeture */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer z-10"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* En-tête Icône & Titre */}
          <div className="text-center space-y-3">
            <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden shadow-xl shadow-purple-950/60 border-2 border-purple-500/40 p-0.5 bg-slate-900 flex items-center justify-center">
              <Image
                src="/logo-pc.webp"
                alt="Logo Physique-Chimie CPGE"
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center border-2 border-[#0b1228] shadow-sm">
                {isPendingStudent ? (
                  <Clock className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-white" />
                )}
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Portail E-learning Physics</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {isPendingStudent
                  ? "Validation en cours"
                  : "Vidéo Réservée aux Membres"}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-300/90 max-w-sm mx-auto leading-relaxed">
              {isPendingStudent
                ? `Bonjour ${studentName || ""} ! Votre compte est en cours d'activation prioritaire pour débloquer les replays vidéos et corrigés complets.`
                : "Les documents de cours sont en libre accès. Les replays vidéo HD et les corrigés filmés sont réservés aux étudiants inscrits."}
            </p>
          </div>

          {/* Badge Ressource demandée */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-left">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300 mb-1">
              <Lock className="w-3 h-3" />
              <span>Ressource sélectionnée</span>
            </div>
            <p className="text-xs font-bold text-white line-clamp-2">
              {resourceTitle || "Séance de cours & Replay HD"}
            </p>
          </div>

          {/* Actions : S'inscrire / Se connecter */}
          <div className="space-y-3 pt-1">
            {!isPendingStudent ? (
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/inscription"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-center bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:brightness-110 text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-950/60 transition-all cursor-pointer"
                >
                  <span>S&apos;inscrire Gratuitement</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/connexion"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-center bg-white/[0.05] hover:bg-white/10 text-slate-200 border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Déjà membre ? Se Connecter</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-center justify-center gap-2 font-mono">
                  <Clock className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Activation en cours (délai moyen : &lt; 1h)</span>
                </div>

                <Link
                  href="/connexion"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-center text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Changer de compte / Se reconnecter</span>
                </Link>
              </div>
            )}

            {/* Note de bas de modale */}
            <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Accès immédiat et sécurisé aux fiches et résolutions</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
