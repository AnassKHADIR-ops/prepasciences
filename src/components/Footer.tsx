"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

interface FooterProps {
  variant?: "dark" | "light";
}

export default function Footer({ variant = "light" }: FooterProps) {
  const isLight = variant === "light";

  return (
    <footer 
      className={`py-16 border-t relative overflow-hidden transition-colors ${
        isLight
          ? "bg-white text-slate-600 border-slate-200/80"
          : "bg-gradient-to-b from-[#0b132b] via-[#091024] to-[#060a18] text-slate-300 border-white/15"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Affiliations */}
          <div className="md:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-3 group inline-flex">
              <div 
                className={`flex h-10 w-10 items-center justify-center rounded-xl p-0.5 shadow-xs ${
                  isLight
                    ? "bg-purple-700"
                    : "bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 shadow-cyan-500/20"
                }`}
              >
                <div 
                  className={`flex h-full w-full items-center justify-center rounded-[10px] font-mono font-bold ${
                    isLight ? "bg-white text-purple-700" : "bg-slate-950 text-cyan-400"
                  }`}
                >
                  &Sigma;&Psi;
                </div>
              </div>
              <div className="flex flex-col">
                <span className={`font-extrabold text-xl ${isLight ? "text-slate-900" : "text-white"}`}>
                  Prépa<span className={isLight ? "text-purple-700" : "text-cyan-400"}>sciences</span>
                </span>
                <span className={`text-[10px] font-mono uppercase tracking-widest -mt-1 font-semibold ${
                  isLight ? "text-slate-500" : "text-slate-400"
                }`}>
                  Excellence CPGE
                </span>
              </div>
            </a>

            <p className={`text-sm max-w-md leading-relaxed ${isLight ? "text-slate-600" : "text-slate-300 font-light"}`}>
              Plateforme académique d&apos;élite pour étudiants en CPGE 2e année (TSI 2e, MP / MP* 2e, CNC &amp; France). Dirigée par <strong>Prof. Anass Khadir</strong> (Professeur Agrégé de Mathématiques — CPGE ERRAZI El Jadida) et <strong>Prof. Hassan Eddams</strong> (Professeur Agrégé de Physique-Chimie — CPGE Lycée Moulay Abdellah- Safi).
            </p>

            <div className={`flex items-center gap-4 text-xs font-mono pt-1 ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              <a
                href="https://wa.me/212716314673?text=Bonjour%20Pr%C3%A9pasciences,%20je%20souhaite%20des%20renseignements"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 transition-colors font-medium ${
                  isLight ? "text-emerald-700 hover:text-emerald-800" : "text-cyan-400 hover:text-cyan-300"
                }`}
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>Contact WhatsApp direct</span>
              </a>
              <span>•</span>
              <span>Royaume du Maroc</span>
            </div>
          </div>

          {/* Navigation Rapide */}
          <div>
            <h4 className={`text-xs font-mono font-bold uppercase tracking-wider mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#hero" className={`transition-colors ${isLight ? "hover:text-purple-700" : "hover:text-cyan-400"}`}>
                  Plateforme CPGE
                </a>
              </li>
              <li>
                <a href="#professeurs" className={`transition-colors ${isLight ? "hover:text-purple-700" : "hover:text-cyan-400"}`}>
                  Nos Professeurs Agrégés
                </a>
              </li>
              <li>
                <a href="#tarifs" className={`transition-colors ${isLight ? "hover:text-purple-700" : "hover:text-cyan-400"}`}>
                  Formule Maths (300 DH)
                </a>
              </li>
              <li>
                <a href="#tarifs" className={`transition-colors ${isLight ? "hover:text-purple-700" : "hover:text-cyan-400"}`}>
                  Pack Double Excellence (600 DH)
                </a>
              </li>
              <li>
                <a href="#tarifs" className={`transition-colors ${isLight ? "hover:text-purple-700" : "hover:text-cyan-400"}`}>
                  Formule Physique (300 DH)
                </a>
              </li>
            </ul>
          </div>

          {/* Concours Cibles */}
          <div>
            <h4 className={`text-xs font-mono font-bold uppercase tracking-wider mb-4 ${isLight ? "text-slate-900" : "text-white"}`}>
              Concours Cibles
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className={`flex items-center gap-2 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                <span>Concours National Commun (CNC)</span>
              </li>
              <li className={`flex items-center gap-2 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-600" />
                <span>Concours Polytechnique (X)</span>
              </li>
              <li className={`flex items-center gap-2 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                <span>Concours Mines-Ponts</span>
              </li>
              <li className={`flex items-center gap-2 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-600" />
                <span>Concours CentraleSupélec</span>
              </li>
              <li className={`flex items-center gap-2 ${isLight ? "text-slate-700" : "text-slate-300"}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                <span>Concours CCINP</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row justify-between items-center text-xs gap-4 ${
          isLight ? "border-slate-200 text-slate-500" : "border-slate-800 text-slate-400"
        }`}>
          <p>© {new Date().getFullYear()} Prépasciences. Tous droits réservés.</p>
          <p className="font-mono">
            CPGE ERRAZI El Jadida &amp; Centre CPGE Safi
          </p>
        </div>
      </div>
    </footer>
  );
}
