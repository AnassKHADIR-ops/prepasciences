"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, Play } from "lucide-react";
import { AnonymousPlayer } from "@/components/video/AnonymousPlayer";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string | null;
  title: string;
}

export function VideoPlayerModal({ isOpen, onClose, url, title }: VideoPlayerModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !url) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div
        className="bg-[#0b101e] rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-white/10 dark:border-purple-500/25 animate-scaleUp flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* 1. Header Supérieur avec Logo Physique-Chimie */}
        <div className="px-4 sm:px-6 py-3 bg-[#0d1426] border-b border-white/10 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Logo Officiel Physique-Chimie */}
            <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500/40 shrink-0 shadow-md shadow-purple-950/50 p-0.5 bg-slate-900 flex items-center justify-center">
              <Image
                src="/logo-pc.webp"
                alt="Logo PC"
                width={32}
                height={32}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Badge Espace Membre */}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
              Espace Membre
            </span>

            {/* Titre de la Séance */}
            <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md md:max-w-lg">
              {title || "Séance de Cours CPGE"}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              aria-label="Fermer"
              title="Fermer (Échap)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Lecteur Anonyme Haute Performance (Zéro YouTube Branding) */}
        <div className="w-full bg-black">
          <AnonymousPlayer url={url} title={title} />
        </div>

        {/* 3. Pied de page du Modal (Inspiré de l'Image 4) */}
        <div className="px-4 sm:px-6 py-3 bg-[#0a0f1d] border-t border-white/10 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-purple-400">🎓</span>
            <span className="text-[11px] sm:text-xs">
              Séance de cours & révision approfondie · Plateforme PrépaSciences
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 transition-colors cursor-pointer shadow-xs"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
