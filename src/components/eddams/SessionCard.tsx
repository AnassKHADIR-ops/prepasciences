"use client";

import React from "react";
import { SeancePC } from "./types";
import {
  FileText,
  CheckCircle2,
  Play,
  Calendar,
  Star,
  Trash2,
} from "lucide-react";

interface SessionCardProps {
  seance: SeancePC;
  isAdmin: boolean;
  onOpenPdf: (url: string, title: string) => void;
  onOpenVideo: (url: string, title: string) => void;
  onDelete?: (id: string) => void;
}

const moduleBadges: Record<string, { bg: string; text: string; border: string }> = {
  "Électromagnétisme": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200/80",
  },
  "Thermodynamique": {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200/80",
  },
  "Mécanique & Ondes": {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200/80",
  },
  "Optique Ondulatoire": {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200/80",
  },
  "Chimie des Solutions": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200/80",
  },
};

export function SessionCard({
  seance,
  isAdmin,
  onOpenPdf,
  onOpenVideo,
  onDelete,
}: SessionCardProps) {
  const badgeStyle = moduleBadges[seance.module] || {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
  };

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden">
      {/* Ligne supérieure : Badges & Métadonnées */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Badge Module */}
            <span
              className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
            >
              {seance.module}
            </span>

            {/* Badge Type ou Concours */}
            <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              {seance.concoursName ? `Épreuve ${seance.concoursName}` : seance.type}
            </span>

            {seance.isPinned && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                <Star className="w-3 h-3 text-blue-600 fill-blue-600" />
                Séance Clé
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{seance.date}</span>
            {isAdmin && onDelete && (
              <button
                onClick={() => onDelete(seance.id)}
                className="ml-2 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Supprimer la séance"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Titre & Description */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug mb-2">
          {seance.titre}
        </h3>
        {seance.description && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
            {seance.description}
          </p>
        )}
      </div>

      {/* Ligne d'actions directes (Drive PDF & YouTube) */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 sm:gap-2.5 mt-2">
        {/* Bouton Énoncé */}
        {seance.enonceUrl && (
          <button
            onClick={() => onOpenPdf(seance.enonceUrl, `${seance.titre} — Énoncé`)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/80 transition-colors shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Énoncé (Drive)</span>
          </button>
        )}

        {/* Bouton Corrigé */}
        {seance.corrigeUrl ? (
          <button
            onClick={() => onOpenPdf(seance.corrigeUrl!, `${seance.titre} — Corrigé`)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 transition-colors shadow-2xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Corrigé (Drive)</span>
          </button>
        ) : (
          <span className="text-[11px] text-slate-400 italic px-2">Corrigé à venir</span>
        )}

        {/* Bouton Vidéo YouTube */}
        {seance.videoUrl && (
          <button
            onClick={() => onOpenVideo(seance.videoUrl!, seance.titre)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/80 transition-colors shadow-2xs ml-auto"
          >
            <Play className="w-3.5 h-3.5 text-red-600 fill-red-600" />
            <span>Vidéo YouTube</span>
          </button>
        )}
      </div>
    </article>
  );
}
