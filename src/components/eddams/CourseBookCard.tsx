"use client";

import React, { useState, useMemo } from "react";
import { getDriveImageUrls, extractDriveFileId } from "@/lib/driveUtils";
import { Eye } from "lucide-react";

export interface LivreReference {
  id: string;
  titre: string;
  auteur?: string;
  lien: string;
  cover?: string;
  badge?: string;
  description?: string;
}

const LEATHER_PALETTES = [
  ["#2e1065", "#17063b"], // Mauve / Violet impérial profond
  ["#1e1b4b", "#0f0e26"], // Indigo nuit
  ["#312e81", "#1e1b4b"], // Royal violet
  ["#4c1d95", "#2e1065"], // Améthyste
  ["#1e293b", "#0f172a"], // Ardoise foncée
  ["#14532d", "#052e16"], // Émeraude académique
];

function getLeatherPalette(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return LEATHER_PALETTES[hash % LEATHER_PALETTES.length];
}

interface CourseBookCardProps {
  livre: LivreReference;
  onOpenPdf: (url: string, title: string) => void;
}

export function CourseBookCard({ livre, onOpenPdf }: CourseBookCardProps) {
  const { titre, auteur, lien, cover, badge } = livre;
  const hasLink = Boolean(lien && lien.trim() !== "");

  const srcs = useMemo(() => {
    if (cover) return getDriveImageUrls(cover);
    if (lien && extractDriveFileId(lien)) return getDriveImageUrls(lien);
    return [];
  }, [cover, lien]);

  const [imgIdx, setImgIdx] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleImgError = () => {
    if (imgIdx + 1 < srcs.length) {
      setImgIdx((prev) => prev + 1);
    } else {
      setImgFailed(true);
    }
  };

  const palette = useMemo(() => getLeatherPalette(titre), [titre]);

  const handleClick = () => {
    if (!hasLink) return;
    onOpenPdf(lien, `${titre} ${auteur ? `— ${auteur}` : ""}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group flex flex-col gap-3 w-full max-w-[190px] cursor-pointer select-none transition-all duration-300"
    >
      {/* 3D Book Cover Container */}
      <div
        className="relative w-full aspect-[1/1.45] rounded-r-xl rounded-l-[3px] overflow-hidden shadow-[0_10px_24px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.08)] group-hover:shadow-[0_20px_35px_rgba(109,40,217,0.22)] group-hover:-translate-y-1.5 transition-all duration-300 transform-gpu bg-slate-900"
      >
        {/* Leather Spine Gradient (Reliure livre 3D) */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[10px] z-20 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.02) 100%)",
          }}
        />
        <div
          className="absolute left-[10px] top-0 bottom-0 w-[1.5px] z-20 pointer-events-none"
          style={{
            background: "rgba(230, 200, 140, 0.65)",
          }}
        />

        {/* Fallback Leather Typography Cover (En cas d'absence d'image) */}
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-between text-center p-4 pl-5 text-white"
          style={{
            background: `linear-gradient(150deg, ${palette[0]}, ${palette[1]})`,
          }}
        >
          <div className="w-6 h-0.5 bg-[#d9a13a] my-1" />

          <div className="font-serif font-bold text-sm leading-snug line-clamp-4 px-1 drop-shadow-xs">
            {titre}
          </div>

          {auteur && (
            <div className="text-[10px] uppercase font-mono tracking-widest text-slate-300 line-clamp-1 mt-auto pt-2">
              {auteur}
            </div>
          )}
        </div>

        {/* Real Cover Image (Google Drive Thumbnail direct) */}
        {!imgFailed && srcs.length > 0 && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={srcs[imgIdx]}
            alt=""
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onLoad={() => setImgLoaded(true)}
            onError={handleImgError}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover z-15 transition-all duration-300 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Badge 'Bientôt' si pas de lien */}
        {!hasLink && (
          <span className="absolute top-2.5 right-0 z-30 text-[9px] font-bold uppercase tracking-wider text-white bg-amber-600 px-2 py-0.5 rounded-l-md shadow-xs">
            Bientôt
          </span>
        )}

        {/* Badge catégorie en haut à gauche */}
        {badge && (
          <span className="absolute top-2.5 left-3.5 z-30 text-[9px] font-bold uppercase tracking-wider text-purple-200 bg-purple-950/80 backdrop-blur-xs px-2 py-0.5 rounded-md border border-purple-400/30">
            {badge}
          </span>
        )}

        {/* Hover Eye Overlay */}
        {hasLink && (
          <div className="absolute right-2.5 bottom-2.5 z-30 w-8 h-8 rounded-full bg-purple-950/80 backdrop-blur-xs text-purple-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md">
            <Eye className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Book Metadata Under Cover (Titre & Auteur en gris comme spécifié) */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
          {titre}
        </h4>
        {auteur && (
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
            {auteur}
          </p>
        )}
      </div>
    </div>
  );
}
