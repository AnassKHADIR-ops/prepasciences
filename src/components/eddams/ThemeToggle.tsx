"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
  className?: string;
}

export function ThemeToggle({ theme, onToggle, className = "" }: ThemeToggleProps) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer select-none backdrop-blur-md ${
        isDark
          ? "bg-slate-900/80 border-purple-500/30 text-purple-200 hover:border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
          : "bg-white/80 border-slate-200/90 text-slate-700 hover:border-purple-300 hover:text-purple-700 shadow-sm hover:shadow-[0_4px_16px_rgba(124,58,237,0.1)]"
      } ${className}`}
    >
      {/* Dynamic Ambient Glow Behind Switch */}
      <span
        className={`absolute -inset-0.5 rounded-full blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
          isDark
            ? "bg-gradient-to-r from-purple-600/30 via-cyan-500/20 to-purple-600/30"
            : "bg-gradient-to-r from-purple-400/20 via-indigo-300/20 to-purple-400/20"
        }`}
      />

      {/* Track / Pill Indicator */}
      <div
        className={`relative w-9 h-5 rounded-full transition-colors duration-300 flex items-center p-0.5 ${
          isDark ? "bg-purple-950/80 border border-purple-400/40" : "bg-slate-200/80 border border-slate-300/80"
        }`}
      >
        <span
          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transform transition-transform duration-300 shadow-sm ${
            isDark
              ? "translate-x-4 bg-gradient-to-tr from-purple-500 to-indigo-400 text-white shadow-purple-900/60"
              : "translate-x-0 bg-white text-amber-500 shadow-slate-400/40"
          }`}
        >
          {isDark ? (
            <Moon className="w-2.5 h-2.5 fill-current" />
          ) : (
            <Sun className="w-2.5 h-2.5 fill-current" />
          )}
        </span>
      </div>

      {/* Label Text */}
      <span className="text-xs font-semibold tracking-wide">
        {isDark ? "Mode Sombre" : "Mode Clair"}
      </span>
    </button>
  );
}
