"use client";

import React from "react";
import { useCountdown } from "@/hooks/useCountdown";

interface SessionCountdownProps {
  targetDays: number[];
  targetHour?: number;
  colorClass: string;
  variant?: "dark" | "light";
}

export const SessionCountdown = React.memo(function SessionCountdown({
  targetDays,
  targetHour = 20,
  colorClass,
  variant = "dark",
}: SessionCountdownProps) {
  const timeLeft = useCountdown(targetDays, targetHour);
  const isLight = variant === "light";

  const tileClass = isLight
    ? "bg-white border border-slate-200/90 rounded-xl py-2 px-1 shadow-2xs"
    : "bg-slate-950/80 border border-white/10 rounded-xl py-2 px-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]";

  const labelClass = isLight
    ? "text-[8px] font-mono tracking-widest text-slate-500 font-bold uppercase"
    : "text-[8px] font-mono tracking-widest text-slate-400 uppercase";

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      <div className={tileClass}>
        <span className={`block font-mono font-extrabold text-sm sm:text-base tracking-wider ${colorClass}`}>
          {String(timeLeft.days).padStart(2, "0")}
        </span>
        <span className={labelClass}>Jours</span>
      </div>
      <div className={tileClass}>
        <span className={`block font-mono font-extrabold text-sm sm:text-base tracking-wider ${colorClass}`}>
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span className={labelClass}>H</span>
      </div>
      <div className={tileClass}>
        <span className={`block font-mono font-extrabold text-sm sm:text-base tracking-wider ${colorClass}`}>
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span className={labelClass}>Min</span>
      </div>
      <div className={tileClass}>
        <span className={`block font-mono font-extrabold text-sm sm:text-base tracking-wider ${colorClass}`}>
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
        <span className={labelClass}>Sec</span>
      </div>
    </div>
  );
});
