"use client";

import React, { useRef, useState, useCallback } from "react";

interface GlassTiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  accentBorder?: string;
}

export function GlassTiltCard({
  children,
  className = "",
  glowColor = "rgba(56, 189, 248, 0.15)",
  accentBorder = "hover:border-cyan-500/40",
}: GlassTiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transformStyle, setTransformStyle] = useState<string>("rotateX(0deg) rotateY(0deg) translateZ(0px)");
  const [sheenPos, setSheenPos] = useState<{ x: number; y: number; opacity: number }>({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    const rotX = -((y / rect.height) - 0.5) * 8; // subtle 8deg tilt
    const rotY = ((x / rect.width) - 0.5) * 8;
    setTransformStyle(`rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(8px)`);
    setSheenPos({ x: xPercent, y: yPercent, opacity: 1 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransformStyle("rotateX(0deg) rotateY(0deg) translateZ(0px)");
    setSheenPos((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
      }}
      className="group/tilt h-full w-full will-change-transform"
    >
      <div
        style={{
          transform: transformStyle,
          transition: "transform 0.18s cubic-bezier(0.2, 0, 0, 1)",
          transformStyle: "preserve-3d",
        }}
        className={`relative h-full rounded-3xl bg-slate-900/40 border border-white/15 backdrop-blur-2xl shadow-2xl shadow-blue-950/40 transition-all duration-300 overflow-hidden flex flex-col justify-between ${accentBorder} ${className}`}
      >
        {/* Top specular highlight creating glass refraction */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />

        {/* Dynamic interactive light sheen tracking cursor */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
          style={{
            opacity: sheenPos.opacity,
            background: `radial-gradient(circle 350px at ${sheenPos.x}% ${sheenPos.y}%, ${glowColor}, transparent 70%)`,
          }}
        />

        {children}
      </div>
    </div>
  );
}
