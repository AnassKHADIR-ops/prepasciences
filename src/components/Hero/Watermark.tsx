"use client";

import React from "react";

export function Watermark() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[96vw] px-4 text-center z-[4] flex justify-center items-center overflow-hidden"
    >
      <span className="block font-black text-[clamp(2.5rem,8.5vw,9.5rem)] tracking-[0.05em] leading-none uppercase text-transparent bg-clip-text bg-gradient-to-r from-white/[0.035] via-[#18C7F3]/[0.025] to-transparent whitespace-nowrap">
        PRÉPASCIENCES
      </span>
    </div>
  );
}
