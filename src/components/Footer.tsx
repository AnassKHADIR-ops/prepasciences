"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0b132b] via-[#091024] to-[#060a18] text-slate-300 py-16 border-t border-white/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Affiliations */}
          <div className="md:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-3 group inline-flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 p-0.5 shadow-md shadow-cyan-500/20">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950 font-mono font-bold text-cyan-400">
                  &Sigma;&Psi;
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-white">
                  Prépa<span className="text-cyan-400">sciences</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 -mt-1 font-semibold">
                  Excellence CPGE
                </span>
              </div>
            </a>

            <p className="text-sm text-slate-300 max-w-md leading-relaxed font-light">
              Plateforme académique d&apos;élite pour étudiants en CPGE 2e année (TSI 2e, MP / MP* 2e, CNC & France). Dirigée par <strong>Prof. Anass Khadir</strong> (Professeur Agrégé de Mathématiques — CPGE ERRAZI El Jadida) et <strong>Prof. Hassan Eddams</strong> (Professeur Agrégé de Physique-Chimie — CPGE Lycée Moulay Abdellah- Safi).
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <a
                href="https://wa.me/212716314673?text=Bonjour%20Pr%C3%A9pasciences,%20je%20souhaite%20des%20renseignements"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                <span>Contact WhatsApp direct</span>
              </a>
              <span>•</span>
              <span className="text-slate-400">Royaume du Maroc</span>
            </div>
          </div>

          {/* Navigation Rapide */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#hero" className="hover:text-cyan-400 transition-colors">
                  Plateforme CPGE
                </a>
              </li>
              <li>
                <a href="#professeurs" className="hover:text-cyan-400 transition-colors">
                  Nos Professeurs Agrégés
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-cyan-400 transition-colors">
                  Formule Maths (350 DH)
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-cyan-400 transition-colors">
                  Pack Excellence Maths + PC (550 DH)
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-cyan-400 transition-colors">
                  Formule Physique (350 DH)
                </a>
              </li>
            </ul>
          </div>

          {/* Concours Cibles */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
              Concours Cibles
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="text-slate-300 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span>Concours National Commun (CNC)</span>
              </li>
              <li className="text-slate-300 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>Concours Polytechnique (X)</span>
              </li>
              <li className="text-slate-300 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span>Concours Mines-Ponts</span>
              </li>
              <li className="text-slate-300 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span>Concours CentraleSupélec</span>
              </li>
              <li className="text-slate-300 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span>Concours CCINP</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Prépasciences. Tous droits réservés.</p>
          <p className="font-mono text-slate-400">
            CPGE ERRAZI El Jadida & Centre CPGE Safi
          </p>
        </div>
      </div>
    </footer>
  );
}
