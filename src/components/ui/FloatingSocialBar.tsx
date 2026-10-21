"use client";

import React, { useState } from "react";

export function FloatingSocialBar() {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <>
      {/* Barre Flottante Latérale Droite conforme au code officiel www.anasskhadir.com */}
      <aside 
        className="social-bar-container fixed right-3.5 sm:right-7 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center select-none"
        aria-label="Réseaux sociaux et contact"
      >
        <div className="social-bar">
          {/* 1. Instagram Pr. Khadir */}
          <a
            href="https://www.instagram.com/elearning.mathematics/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link instagram group"
            aria-label="Instagram Pr. Khadir Mathématiques"
            onMouseEnter={() => setActiveTooltip("insta")}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span className="social-tooltip">Instagram Maths</span>
          </a>

          {/* 2. Facebook Pr. Khadir */}
          <a
            href="https://www.facebook.com/profile.php?id=100064798488374"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link facebook group"
            aria-label="Facebook Pr. Khadir Mathématiques"
            onMouseEnter={() => setActiveTooltip("fb")}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            <span className="social-tooltip">Facebook Maths</span>
          </a>

          {/* 3. WhatsApp Pr. Khadir (Mathématiques) */}
          <a
            href="https://wa.me/212659041407?text=Bonjour%20Professeur%20Anass%20Khadir,%20je%20souhaite%20des%20informations%20sur%20les%20cours%20de%20Math%C3%A9matiques%20CPGE"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link whatsapp group"
            aria-label="WhatsApp Pr. Khadir (Mathématiques)"
            onMouseEnter={() => setActiveTooltip("wa-maths")}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span className="social-tooltip">WhatsApp Maths (Pr. Khadir)</span>
          </a>

          {/* 4. WhatsApp Pr. Eddams (Physique-Chimie) */}
          <a
            href="https://wa.me/212721729799?text=Bonjour%20Professeur%20Hassan%20Eddams,%20je%20souhaite%20des%20informations%20sur%20les%20cours%20de%20Physique-Chimie%20CPGE"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link whatsapp-pc group"
            aria-label="WhatsApp Pr. Eddams (Physique-Chimie)"
            onMouseEnter={() => setActiveTooltip("wa-pc")}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            <div className="relative flex items-center justify-center">
              <svg 
                className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span className="absolute -bottom-1 -right-1 text-[8px] font-black font-mono leading-none px-0.5 bg-purple-900 text-white rounded">
                PC
              </span>
            </div>
            <span className="social-tooltip">WhatsApp PC (Pr. Eddams)</span>
          </a>
        </div>
      </aside>

      {/* Styles Inclus Exacts (www.anasskhadir.com + support Next.js) */}
      <style jsx global>{`
        .social-bar {
          width: 58px;
          padding: 16px 0;
          background: rgba(255, 248, 232, 0.72);
          border: 2px solid rgba(210, 160, 55, 0.45);
          border-radius: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1);
          animation: floatBar 4s ease-in-out infinite;
        }

        .social-link {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #fffaf0;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 21px;
          text-decoration: none;
          position: relative;
          overflow: visible;
          transition: transform 0.35s ease, color 0.35s ease, box-shadow 0.35s ease, background 0.35s ease;
        }

        .social-link::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          transform: scale(0);
          transition: transform 0.35s ease;
          z-index: 0;
        }

        .social-link svg {
          position: relative;
          z-index: 1;
        }

        .social-link:hover {
          transform: translateX(-6px) scale(1.1);
          color: #ffffff;
          box-shadow: 0 8px 22px rgba(0, 0, 0, 0.18);
        }

        .social-link:hover::before {
          transform: scale(1);
        }

        .instagram::before {
          background: linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4);
        }

        .facebook::before {
          background: #1877f2;
        }

        .whatsapp::before {
          background: #25d366;
        }

        .whatsapp-pc::before {
          background: linear-gradient(135deg, #7c3aed, #25d366);
        }

        .social-tooltip {
          position: absolute;
          right: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%) translateX(6px);
          background: #0f172a;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          padding: 6px 12px;
          border-radius: 10px;
          pointer-events: none;
          opacity: 0;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);
          transition: opacity 0.25s ease, transform 0.25s ease;
          z-index: 50;
        }

        .social-tooltip::after {
          content: "";
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-left-color: #0f172a;
        }

        .social-link:hover .social-tooltip {
          opacity: 1;
          transform: translateY(-50%) translateX(0);
        }

        @keyframes floatBar {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @media (max-width: 768px) {
          .social-bar-container {
            right: 8px;
          }
          .social-bar {
            width: 48px;
            padding: 12px 0;
            gap: 10px;
            border-radius: 30px;
          }
          .social-link {
            width: 36px;
            height: 36px;
          }
          .social-link svg {
            width: 17px;
            height: 17px;
          }
          .social-tooltip {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .social-bar {
            animation: none;
          }
          .social-link, .social-link::before {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
