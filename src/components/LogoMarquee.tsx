"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { BookOpen, Atom, ExternalLink, ArrowRight } from "lucide-react";
import { getActiveMathMarqueeItems, getActivePcCourses } from "@/data/platformCoursesSync";

interface LogoMarqueeProps {
  variant?: "dark" | "light";
}

export default function LogoMarquee({ variant = "light" }: LogoMarqueeProps) {
  const isLight = variant === "light";

  // Synchronisation dynamique : Détection automatique des cours avec ressources réelles
  const mathCourses = useMemo(() => getActiveMathMarqueeItems(), []);
  const pcCourses = useMemo(() => getActivePcCourses(), []);

  // Défilement continu sans à-coups : duplication équilibrée (4x)
  const duplicatedMathCourses = useMemo(
    () => [...mathCourses, ...mathCourses, ...mathCourses, ...mathCourses],
    [mathCourses]
  );

  const duplicatedPcCourses = useMemo(
    () => (pcCourses.length > 0 ? [...pcCourses, ...pcCourses] : []),
    [pcCourses]
  );

  return (
    <section 
      id="syllabus"
      className={`relative py-16 sm:py-20 overflow-hidden border-t ${
        isLight 
          ? "bg-[#FAF9F6] text-[#17142D] border-slate-200/80" 
          : "bg-gradient-to-b from-[#0b132b] via-[#0e1838] to-[#0b132b] text-white border-white/15"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center relative z-10">
        <h2 
          className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 ${
            isLight ? "text-[#17142D]" : "text-white"
          }`}
        >
          Explorez les Cours Travaillés en{" "}
          <span className={isLight ? "text-purple-900" : "text-[#C084FC]"}>
            Mathématiques &amp; Physique-Chimie
          </span>
        </h2>

        <p className={`text-sm sm:text-base max-w-2xl mx-auto font-normal ${isLight ? "text-slate-600" : "text-slate-300"}`}>
          {pcCourses.length > 0
            ? "Synchronisation directe avec nos espaces de travail d'excellence : cours officiels, travaux dirigés corrigés et méthodologie de concours assurés par nos professeurs agrégés permanents."
            : "Synchronisation directe avec nos espaces de travail d'excellence : cours complets et travaux dirigés de Mathématiques (Pr. Anass Khadir) et contenus de Physique-Chimie (Pr. Hassan Eddams)."}
        </p>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] space-y-4">
        
        {/* ROW 1 : Pôle Mathématiques */}
        {duplicatedMathCourses.length > 0 && (
          <div className="flex w-max gap-4 sm:gap-6 py-2 animate-marquee-left hover:[animation-play-state:paused]">
            {duplicatedMathCourses.map((course, index) => (
              <a
                key={`math-${course.id}-${index}`}
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl border transition-all duration-300 group select-none cursor-pointer ${
                  isLight
                    ? "bg-white hover:bg-amber-50/50 border-amber-200/90 hover:border-amber-400 shadow-2xs hover:shadow-md"
                    : "bg-[#1f1709]/75 hover:bg-[#2e2009] border-amber-500/30 hover:border-amber-400/80 shadow-lg shadow-amber-950/30 hover:shadow-amber-500/20 backdrop-blur-md"
                }`}
              >
                <div 
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all shrink-0 ${
                    isLight
                      ? "bg-amber-50 border-amber-200 text-amber-700 group-hover:scale-105"
                      : "bg-amber-950/90 border-amber-500/40 text-amber-400 group-hover:scale-105 group-hover:bg-amber-900/50"
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span 
                      className={`block text-sm font-bold transition-colors whitespace-nowrap ${
                        isLight ? "text-slate-900 group-hover:text-amber-800" : "text-slate-100 group-hover:text-amber-300"
                      }`}
                    >
                      {course.titre}
                    </span>
                    <ExternalLink className={`h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity shrink-0 ${isLight ? "text-amber-700" : "text-amber-400"}`} />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-mono ${isLight ? "text-slate-500" : "text-amber-300/80"}`}>
                      Pôle Maths · Pr. Anass Khadir
                    </span>
                    <span 
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isLight
                          ? "bg-amber-50 text-amber-900 border-amber-200"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {course.badge}
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* ROW 2 : Pôle Physique-Chimie */}
        {pcCourses.length > 0 && (
          <div className="flex w-max gap-4 sm:gap-6 py-2 animate-marquee-right hover:[animation-play-state:paused]">
            {duplicatedPcCourses.map((course, index) => (
              <Link
                key={`pc-${course.id}-${index}`}
                href={course.link}
                className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl border transition-all duration-300 group select-none cursor-pointer ${
                  isLight
                    ? "bg-white hover:bg-purple-50/50 border-purple-200/90 hover:border-purple-400 shadow-2xs hover:shadow-md"
                    : "bg-[#170e30]/75 hover:bg-[#1e1140] border-purple-500/30 hover:border-purple-400/80 shadow-lg shadow-purple-950/30 hover:shadow-purple-500/20 backdrop-blur-md"
                }`}
              >
                <div 
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all shrink-0 ${
                    isLight
                      ? "bg-purple-50 border-purple-200 text-purple-700 group-hover:scale-105"
                      : "bg-purple-950/90 border-purple-500/40 text-purple-300 group-hover:scale-105 group-hover:bg-purple-900/50"
                  }`}
                >
                  <Atom className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span 
                      className={`block text-sm font-bold transition-colors whitespace-nowrap ${
                        isLight ? "text-slate-900 group-hover:text-purple-800" : "text-slate-100 group-hover:text-purple-300"
                      }`}
                    >
                      {course.titre}
                    </span>
                    <ArrowRight className={`h-3.5 w-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ${isLight ? "text-purple-700" : "text-purple-400"}`} />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-mono ${isLight ? "text-slate-500" : "text-purple-300/80"}`}>
                      Pôle PC · Pr. Hassan Eddams
                    </span>
                    <span 
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isLight
                          ? "bg-purple-50 text-purple-800 border-purple-200"
                          : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                      }`}
                    >
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
