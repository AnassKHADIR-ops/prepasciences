"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  Lock,
  MessageCircle,
  Copy,
  Check,
  Clock,
  ArrowRight,
  ShieldAlert,
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
  studentEmail = "",
  defaultPole = "pc",
}: FreemiumLockModalProps) {
  const [selectedProf, setSelectedProf] = useState<"eddams" | "khadir">(
    defaultPole === "maths" ? "khadir" : "eddams"
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const profInfo = {
    eddams: {
      name: "Pr. Hassan EDDAMS",
      subject: "Physique-Chimie MP / MP*",
      phoneFormatted: "+212 721 729 799",
      phoneDigits: "212721729799",
    },
    khadir: {
      name: "Pr. Anass KHADIR",
      subject: "Mathématiques MP / MP* & TSI",
      phoneFormatted: "+212 659 041 407",
      phoneDigits: "212659041407",
    },
  }[selectedProf];

  // Message personnalisé pour étudiant inscrit en attente (Format exact demandé)
  const pendingMessage = `Bonjour ${profInfo.name},

Je suis l'étudiant(e) : ${studentName || "Étudiant CPGE"}
Email : ${studentEmail || "Non renseigné"}

Je me suis inscrit(e) sur la plateforme et mon compte est actuellement en attente d'approbation. Pourriez-vous s'il vous plaît valider mon accès aux cours ?
(Ressource concernée : ${resourceTitle || "Séance de cours / TD"})

Merci d'avance pour votre aide !`;

  // Message personnalisé pour visiteur non inscrit
  const visitorMessage = `Bonjour ${profInfo.name},

Je consulte actuellement la plateforme PrépaSciences et je souhaite accéder à la vidéo : ${resourceTitle || "Séance de cours"}.
Pourriez-vous s'il vous plaît m'indiquer la démarche pour débloquer mon accès aux cours ?

Merci d'avance pour votre aide !`;

  const finalMessage = isPendingStudent ? pendingMessage : visitorMessage;

  const handleCopy = () => {
    navigator.clipboard.writeText(finalMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const whatsappUrl = `https://wa.me/${profInfo.phoneDigits}?text=${encodeURIComponent(finalMessage)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#0e1424] text-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-purple-500/30 animate-scaleUp relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ligne d'accent lumineuse supérieure */}
        <div className="h-1.5 bg-gradient-to-r from-purple-500 via-emerald-400 to-indigo-500" />

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
          {/* En-tête Icone & Titre */}
          <div className="text-center space-y-2">
            <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden shadow-xl shadow-purple-950/60 border-2 border-purple-500/40 p-0.5 bg-slate-900 flex items-center justify-center">
              <Image
                src="/logo-pc.webp"
                alt="Logo Physique-Chimie CPGE"
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center border-2 border-[#0e1424] shadow-xs">
                {isPendingStudent ? (
                  <Clock className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                ) : (
                  <Lock className="w-3 h-3 text-white" />
                )}
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {isPendingStudent
                ? "Compte en Attente d'Approbation"
                : "Vidéo Réservée aux Membres"}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
              {isPendingStudent
                ? `Bonjour ${studentName || ""} ! Votre compte est bien créé mais doit être validé par votre professeur pour débloquer les vidéos.`
                : "Les documents et fiches sont en libre accès (Freemium). Les replays vidéos HD et corrigés filmés sont réservés aux étudiants inscrits."}
            </p>
          </div>

          {/* Badge Ressource ciblée */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-left">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-purple-300 mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Ressource demandée</span>
            </div>
            <p className="text-xs font-bold text-white line-clamp-2">
              {resourceTitle || "Séance de cours & Replay"}
            </p>
          </div>

          {/* Choix du professeur pour le contact WhatsApp */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 text-left">
              Professeur à contacter :
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedProf("eddams")}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedProf === "eddams"
                    ? "bg-purple-950/60 border-purple-400 text-white shadow-md shadow-purple-950/50"
                    : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <span className="text-xs font-bold block truncate">Pr. H. EDDAMS</span>
                <span className="text-[10px] text-purple-300 block truncate">Physique-Chimie</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedProf("khadir")}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedProf === "khadir"
                    ? "bg-cyan-950/60 border-cyan-400 text-white shadow-md shadow-cyan-950/50"
                    : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                <span className="text-xs font-bold block truncate">Pr. A. KHADIR</span>
                <span className="text-[10px] text-cyan-300 block truncate">Mathématiques</span>
              </button>
            </div>
          </div>

          {/* Aperçu du message WhatsApp pré-rempli */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Message pré-rempli WhatsApp :
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier le texte</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 font-mono text-[11px] text-slate-300 whitespace-pre-line leading-relaxed max-h-32 overflow-y-auto">
              {finalMessage}
            </div>
          </div>

          {/* Actions Principales */}
          <div className="space-y-3 pt-1">
            {/* Grand Bouton WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 shadow-lg shadow-emerald-950/70 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Contacter sur WhatsApp ({profInfo.phoneFormatted})</span>
            </a>

            {/* Si c'est un visiteur non connecté : boutons Inscription / Connexion */}
            {!isPendingStudent && (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/inscription"
                  onClick={onClose}
                  className="py-2.5 px-3 rounded-xl font-bold text-xs text-center bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>S&apos;inscrire Gratuitement</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/connexion"
                  onClick={onClose}
                  className="py-2.5 px-3 rounded-xl font-bold text-xs text-center bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors"
                >
                  <span>Se Connecter</span>
                </Link>
              </div>
            )}

            {/* Note de bas de modale */}
            <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
              <ShieldAlert className="w-3 h-3 text-emerald-400" />
              <span>Activation rapide par les professeurs agrégés 7j/7</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
