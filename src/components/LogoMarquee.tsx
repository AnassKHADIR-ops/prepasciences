"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { BookOpen, Atom, ExternalLink, ArrowRight } from "lucide-react";
import { getActiveMathMarqueeItems, getActivePcCourses } from "@/data/platformCoursesSync";

export default function LogoMarquee() {
  // Synchronisation dynamique : Détection automatique des cours avec ressources réelles
  const mathCourses = useMemo(() => getActiveMathMarqueeItems(), []);
  const pcCourses = useMemo(() => getActivePcCourses(), []);

  // Défilement continu sans à-coups : duplication équilibrée (4x)
  const duplicatedMathCourses = useMemo(
    () => [...mathCourses, ...mathCourses, ...mathCourses, ...mathCourses],
    [mathCourses]
  );

  const duplicatedPcCourses = useMemo(
    () => (pcCourses.length > 0 ? [...pcCourses, ...pcCourses, ...pcCourses, ...pcCourses] : []),
    [pcCourses]
  );

  return (
    <section className="relative py-20 bg-gradient-to-b from-[#0b132b] via-[#0e1838] to-[#0b132b] text-white overflow-hidden border-t border-white/15">
      {/* Ambient luminous glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-gradient-to-r from-blue-500/20 via-cyan-500/18 to-purple-500/18 rounded-full blur-[110px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-4 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md mb-4 shadow-sm shadow-cyan-500/10">
          <BookOpen className="h-4 w-4 text-cyan-400" />
          <span>Syllabus en Direct · Cours &amp; Séances Disponibles</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
          Explorez les Cours Travaillés en{" "}
          <span className="text-[#18C7F3]">Mathématiques</span>
          {" "}&amp;{" "}
          <span className="text-[#C084FC]">Physique-Chimie</span>
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light">
          {pcCourses.length > 0
            ? "Synchronisation directe avec nos espaces de travail d'excellence : cours officiels, travaux dirigés corrigés et méthodologie de concours assurés par nos professeurs agrégés permanents."
            : "Synchronisation directe avec nos espaces de travail d'excellence : cours complets et travaux dirigés de Mathématiques (Pr. Anass Khadir) et contenus de Physique-Chimie (Pr. Hassan Eddams)."}
        </p>
      </div>

      {/* Infinite Marquee Container with Left and Right Fade Masks */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] space-y-4">
        
        {/* ROW 1 : Moving Left (Glisse lente et apaisée ~85s) — Pôle Mathématiques (Cyan Électrique 🔷) */}
        {duplicatedMathCourses.length > 0 && (
          <div className="flex w-max gap-4 sm:gap-6 py-2 animate-marquee-left hover:[animation-play-state:paused]">
            {duplicatedMathCourses.map((course, index) => (
              <a
                key={`math-${course.id}-${index}`}
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-[#0c1630]/75 hover:bg-[#0f1c3f] border border-cyan-500/30 hover:border-cyan-400/80 shadow-lg shadow-cyan-950/30 hover:shadow-cyan-500/20 transition-all duration-300 backdrop-blur-md group select-none cursor-pointer"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/90 border border-cyan-500/40 text-cyan-400 group-hover:scale-105 group-hover:bg-cyan-900/50 transition-all shrink-0">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="block text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors whitespace-nowrap">
                      {course.titre}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-cyan-300/80">
                      Pôle Maths · Pr. Anass Khadir
                    </span>
                    <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {course.badge}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* ROW 2 : Moving Right (Glisse lente et apaisée ~90s) — Pôle Physique-Chimie (Mauve Impérial 👑) */}
        {/* Affiché UNIQUEMENT si l'enseignant a importé ou ajouté des documents réels */}
        {pcCourses.length > 0 && (
          <div className="flex w-max gap-4 sm:gap-6 py-3 animate-marquee-right hover:[animation-play-state:paused]">
            {duplicatedPcCourses.map((course, index) => (
              <Link
                key={`pc-${course.id}-${index}`}
                href={course.link}
                className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-[#170e30]/75 hover:bg-[#1e1140] border border-purple-500/30 hover:border-purple-400/80 shadow-lg shadow-purple-950/30 hover:shadow-purple-500/20 transition-all duration-300 backdrop-blur-md group select-none cursor-pointer"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-950/90 border border-purple-500/40 text-purple-300 group-hover:scale-105 group-hover:bg-purple-900/50 transition-all shrink-0">
                  <Atom className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="block text-sm font-bold text-slate-100 group-hover:text-purple-300 transition-colors whitespace-nowrap">
                      {course.titre}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-purple-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-purple-300/80">
                      Pôle PC · Pr. Hassan Eddams
                    </span>
                    <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {course.badge}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
