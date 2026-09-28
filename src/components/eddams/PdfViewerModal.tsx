"use client";

import React, { useEffect, useState } from "react";
import { X, Download, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { getEmbedUrl, getDownloadUrl } from "@/lib/driveUtils";

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string | null;
  title: string;
}

export function PdfViewerModal({ isOpen, onClose, url, title }: PdfViewerModalProps) {
  const [loading, setLoading] = useState(true);

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

  const embedUrl = getEmbedUrl(url);
  const downloadUrl = getDownloadUrl(url);
  const isCorrige = title.toLowerCase().includes("corrigé");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 rounded-2xl sm:rounded-3xl shadow-[0_32px_75px_rgba(0,0,0,0.6)] w-full max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col overflow-hidden border border-purple-500/30 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header de la modale — Thème Mauve Royal & Ardoise Prestigieuse */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-950 border-b border-purple-500/25 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white shrink-0 ${
                isCorrige ? "bg-emerald-600 shadow-xs shadow-emerald-900/40" : "bg-purple-600 shadow-xs shadow-purple-900/40"
              }`}
            >
              {isCorrige ? "Corrigé" : "Document"}
            </span>

            <div className="truncate">
              <h3 className="font-sans text-sm sm:text-base font-bold text-white truncate">
                {title || "Document CPGE"}
              </h3>
              <p className="text-[11px] text-purple-300/80 hidden sm:block">
                Physique-Chimie MP / MP* · Pr. Hassan EDDAMS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {downloadUrl && (
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-full shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Télécharger</span>
              </a>
            )}

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 text-xs font-semibold text-purple-200 bg-slate-800 hover:bg-slate-700 border border-purple-500/30 rounded-full transition-all"
              title="Ouvrir dans Google Drive"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Drive</span>
            </a>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Corps iframe avec indicateur de chargement & bandeau d'assistance */}
        <div className="flex-1 bg-[#12141c] relative overflow-hidden flex flex-col">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#12141c] text-slate-300 z-10">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              <span className="text-xs font-medium text-slate-400">Chargement sécurisé du document PDF...</span>
            </div>
          )}
          <iframe
            src={embedUrl}
            className="w-full flex-1 border-0"
            title={title}
            allow="autoplay"
            onLoad={() => setLoading(false)}
          />

          {/* Bandeau d'aide au bas au cas où Drive restreint l'iframe */}
          <div className="bg-slate-950/90 border-t border-purple-500/20 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="hidden sm:inline">
                Si Google Drive restreint la prévisualisation intégrée, ouvrez le document directement :
              </span>
              <span className="sm:hidden">Un souci d&apos;affichage ?</span>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-purple-400 hover:text-purple-300 underline inline-flex items-center gap-1"
            >
              <span>Ouvrir sur Drive</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
