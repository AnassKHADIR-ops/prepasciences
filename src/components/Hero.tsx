"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { Watermark } from "./Hero/Watermark";
import { Stage1Hero } from "./Hero/Stage1Hero";
import { Stage2Teachers } from "./Hero/Stage2Teachers";
import { Stage3Training } from "./Hero/Stage3Training";
import { Stage4Pricing } from "./Hero/Stage4Pricing";

const TOTAL_FRAMES = 150;

// Persistent module-level cache to keep loaded WebP frames in memory across page navigations (e.g. / -> /eddams -> /)
const globalFrameCache: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);

// High-efficiency WebP format frame URL
function getFrameUrl(index: number): string {
  const frameNumber = String(index + 1).padStart(3, "0");
  return `/frames/frame_${frameNumber}.webp`;
}

// Smooth Hermite interpolation for silky-smooth S-curve transitions without sudden linear breaks
function smoothstep(min: number, max: number, value: number): number {
  if (value <= min) return 0;
  if (value >= max) return 1;
  const t = (value - min) / (max - min);
  return t * t * (3 - 2 * t);
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(globalFrameCache);

  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const animationFrameIdRef = useRef<number | null>(null);

  // High-performance DOM refs for zero-jank GPU composite transitions
  const stage1Ref = useRef<HTMLDivElement | null>(null);
  const stage2Ref = useRef<HTMLDivElement | null>(null);
  const stage3Ref = useRef<HTMLDivElement | null>(null);
  const stage4Ref = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef<number>(0);

  // Find nearest loaded frame to guarantee zero flicker or blank flashes
  const getNearestLoadedImage = useCallback((targetIndex: number): HTMLImageElement | null => {
    const direct = imagesRef.current[targetIndex];
    if (direct && direct.complete && direct.naturalWidth > 0) {
      return direct;
    }

    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = targetIndex - offset;
      if (prev >= 0) {
        const imgPrev = imagesRef.current[prev];
        if (imgPrev && imgPrev.complete && imgPrev.naturalWidth > 0) return imgPrev;
      }
      const next = targetIndex + offset;
      if (next < TOTAL_FRAMES) {
        const imgNext = imagesRef.current[next];
        if (imgNext && imgNext.complete && imgNext.naturalWidth > 0) return imgNext;
      }
    }
    return null;
  }, []);

  // Draw frame on canvas with aspect ratio cover & retina sharpness
  const renderFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = ctxRef.current || canvas.getContext("2d", { alpha: false });
      if (!ctx) return;
      ctxRef.current = ctx;

      const img = getNearestLoadedImage(frameIndex);
      if (!img) return;

      const width = canvas.width;
      const height = canvas.height;

      const hRatio = width / img.naturalWidth;
      const vRatio = height / img.naturalHeight;
      const ratio = Math.max(hRatio, vRatio);

      const drawWidth = img.naturalWidth * ratio;
      const drawHeight = img.naturalHeight * ratio;
      const shiftX = (width - drawWidth) / 2;
      const shiftY = (height - drawHeight) / 2;

      ctx.drawImage(
        img,
        0,
        0,
        img.naturalWidth,
        img.naturalHeight,
        shiftX,
        shiftY,
        drawWidth,
        drawHeight
      );

      lastDrawnFrameRef.current = frameIndex;
    },
    [getNearestLoadedImage]
  );

  // Resize canvas with DPR support
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctxRef.current = canvas.getContext("2d", { alpha: false });
    renderFrame(Math.round(currentFrameRef.current));
  }, [renderFrame]);

  // Windowed Progressive Preloading of WebP frames (with persistent globalFrameCache & adaptive mobile subsampling)
  useEffect(() => {
    const images = globalFrameCache;
    imagesRef.current = images;

    // Adaptive subsampling: load every 2nd frame on mobile devices (<768px) to cut data transfer by 50% (~9.4 MB saved)
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const frameStep = isMobile ? 2 : 1;

    // If frame 0 or any frame is already cached (e.g. navigation back to page), draw immediately!
    if (images[0] && images[0].complete) {
      resizeCanvas();
      renderFrame(Math.round(currentFrameRef.current));
    }

    // 1. Frame 0 loaded immediately for instant render (LCP)
    if (!images[0]) {
      const firstImg = new window.Image();
      firstImg.fetchPriority = "high";
      firstImg.src = getFrameUrl(0);
      firstImg.onload = () => {
        images[0] = firstImg;
        resizeCanvas();
        renderFrame(Math.round(currentFrameRef.current));
      };
      images[0] = firstImg;
    }

    // 2. High priority batch: First 20 frames for immediate scroll responsiveness
    for (let i = frameStep; i <= 20 && i < TOTAL_FRAMES; i += frameStep) {
      if (images[i] && images[i]?.complete) continue;
      const img = new window.Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        images[i] = img;
        if (Math.round(currentFrameRef.current) === i) {
          renderFrame(i);
        }
      };
      images[i] = img;
    }

    // 3. Background windowed loading for remaining frames using requestIdleCallback / chunks
    let backgroundBatchIdx = 21;
    const loadNextBatch = () => {
      if (backgroundBatchIdx >= TOTAL_FRAMES) return;
      const end = Math.min(backgroundBatchIdx + 15, TOTAL_FRAMES);
      for (let i = backgroundBatchIdx; i < end; i += frameStep) {
        if (!images[i]) {
          const img = new window.Image();
          img.src = getFrameUrl(i);
          img.onload = () => {
            images[i] = img;
            if (Math.round(currentFrameRef.current) === i) {
              renderFrame(i);
            }
          };
          images[i] = img;
        }
      }
      backgroundBatchIdx = end;
      if (backgroundBatchIdx < TOTAL_FRAMES) {
        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(loadNextBatch);
        } else {
          setTimeout(loadNextBatch, 80);
        }
      }
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(loadNextBatch);
    } else {
      setTimeout(loadNextBatch, 100);
    }

    window.addEventListener("resize", resizeCanvas, { passive: true });
    resizeCanvas();
    renderFrame(Math.round(currentFrameRef.current));

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas, renderFrame]);

  // Direct GPU style update function running in RAF (Zero React Re-renders!)
  const updateStages = useCallback((progress: number) => {
    // Stage 1: Hero (0 to ~0.18)
    const fadeOut1 = smoothstep(0.06, 0.18, progress);
    const s1 = 1 - fadeOut1;
    const float1 = -(fadeOut1 * 18);
    if (stage1Ref.current) {
      stage1Ref.current.style.opacity = s1.toFixed(3);
      stage1Ref.current.style.transform = `translate3d(0, ${float1.toFixed(2)}px, 0)`;
      stage1Ref.current.style.pointerEvents = s1 > 0.3 ? "auto" : "none";
    }

    // Stage 2: Professeurs (0.08 to ~0.52)
    const fadeIn2 = smoothstep(0.08, 0.20, progress);
    const fadeOut2 = smoothstep(0.44, 0.54, progress);
    const s2 = fadeIn2 * (1 - fadeOut2);
    const float2 = (1 - fadeIn2) * 25 - fadeOut2 * 25;
    const blur2 = fadeOut2 * 4;
    if (stage2Ref.current) {
      stage2Ref.current.style.opacity = s2.toFixed(3);
      stage2Ref.current.style.transform = `translate3d(0, ${float2.toFixed(2)}px, 0)`;
      stage2Ref.current.style.filter = blur2 > 0.1 ? `blur(${blur2.toFixed(1)}px)` : "none";
      stage2Ref.current.style.pointerEvents = s2 > 0.3 ? "auto" : "none";
    }

    // Stage 3: Entraînement (0.44 to ~0.78)
    const fadeIn3 = smoothstep(0.44, 0.54, progress);
    const fadeOut3 = smoothstep(0.70, 0.80, progress);
    const s3 = fadeIn3 * (1 - fadeOut3);
    const float3 = (1 - fadeIn3) * 20 - fadeOut3 * 20;
    const blur3 = fadeOut3 * 4;
    if (stage3Ref.current) {
      stage3Ref.current.style.opacity = s3.toFixed(3);
      stage3Ref.current.style.transform = `translate3d(0, ${float3.toFixed(2)}px, 0)`;
      stage3Ref.current.style.filter = blur3 > 0.1 ? `blur(${blur3.toFixed(1)}px)` : "none";
      stage3Ref.current.style.pointerEvents = s3 > 0.3 ? "auto" : "none";
    }

    // Stage 4: Tarifs & Formules (0.72 to 1.0)
    const fadeIn4 = smoothstep(0.72, 0.82, progress);
    const s4 = fadeIn4;
    const float4 = (1 - fadeIn4) * 20;
    if (stage4Ref.current) {
      stage4Ref.current.style.opacity = s4.toFixed(3);
      stage4Ref.current.style.transform = `translate3d(0, ${float4.toFixed(2)}px, 0)`;
      stage4Ref.current.style.pointerEvents = s4 > 0.3 ? "auto" : "none";
    }

  }, []);

  // Frame Interpolation & RAF Loop
  useEffect(() => {
    let isRunning = true;

    const renderLoop = () => {
      if (!isRunning) return;

      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.04) {
        currentFrameRef.current += diff * 0.28;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      const frameToDraw = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrameRef.current)));
      if (frameToDraw !== lastDrawnFrameRef.current) {
        renderFrame(frameToDraw);
      }

      updateStages(scrollProgressRef.current);
      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [renderFrame, updateStages]);

  // Scroll listener tracking scroll percentage
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollableDistance = container.offsetHeight - window.innerHeight;

      if (totalScrollableDistance <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollableDistance));
      scrollProgressRef.current = progress;

      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("popstate", handleScroll, { passive: true });
    window.addEventListener("pageshow", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handleScroll);
      window.removeEventListener("pageshow", handleScroll);
    };
  }, []);

  // Smooth scroll handler for anchor links (#tarifs, #professeurs, #entrainement, #hero)
  useEffect(() => {
    const scrollToTarget = (targetProgress: number) => {
      const container = containerRef.current;
      if (!container) return;
      if (targetProgress === 0) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const totalScrollableDistance = container.offsetHeight - window.innerHeight;
      const targetY = container.offsetTop + totalScrollableDistance * targetProgress;
      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: "smooth",
      });
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;

      if (href === "#tarifs" || href.endsWith("/#tarifs")) {
        e.preventDefault();
        scrollToTarget(0.86);
        try {
          window.history.pushState(null, "", "#tarifs");
        } catch {}
      } else if (href === "#professeurs" || href.endsWith("/#professeurs")) {
        e.preventDefault();
        scrollToTarget(0.30);
        try {
          window.history.pushState(null, "", "#professeurs");
        } catch {}
      } else if (href === "#hero" || href.endsWith("/#hero")) {
        e.preventDefault();
        scrollToTarget(0);
        try {
          window.history.pushState(null, "", "#hero");
        } catch {}
      } else if (href === "#entrainement" || href.endsWith("/#entrainement")) {
        e.preventDefault();
        scrollToTarget(0.62);
        try {
          window.history.pushState(null, "", "#entrainement");
        } catch {}
      }
    };

    document.addEventListener("click", handleAnchorClick);

    // Deep-link auto-scroll on mount if URL contains hash
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      const timer = setTimeout(() => {
        if (hash === "#tarifs") scrollToTarget(0.86);
        else if (hash === "#professeurs") scrollToTarget(0.30);
        else if (hash === "#entrainement") scrollToTarget(0.62);
        else if (hash === "#hero") scrollToTarget(0);
      }, 150);
      return () => {
        document.removeEventListener("click", handleAnchorClick);
        clearTimeout(timer);
      };
    }

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="experience-3d"
      className="relative h-[400vh] bg-[#050B1D] text-white selection:bg-[#18C7F3] selection:text-[#050B1D] overflow-x-clip"
    >
      {/* Deep-linking anchor milestones along the 400vh container */}
      <div id="hero" className="absolute top-0 left-0 w-px h-px pointer-events-none" />
      <div id="professeurs" className="absolute top-[30%] left-0 w-px h-px pointer-events-none" />
      <div id="entrainement" className="absolute top-[62%] left-0 w-px h-px pointer-events-none" />
      <div id="tarifs" className="absolute top-[86%] left-0 w-px h-px pointer-events-none" />

      {/* Sticky Full-Screen Canvas Viewport using 100dvh for mobile stability */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* HTML5 Canvas pinned full-screen */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />

        {/* 1. Directional Navy Background Overlay : Deep Navy at left/center for crystal-clear readability, revealing 3D scene at right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,11,29,0.96)_0%,rgba(5,11,29,0.88)_38%,rgba(5,11,29,0.55)_70%,rgba(5,11,29,0.72)_100%)]"
        />

        {/* 2. Top & Bottom Subtle Seamless Fades */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,29,0.85)_0%,transparent_16%,transparent_84%,rgba(5,11,29,0.95)_100%)]"
        />

        {/* 3. Refined Atmospheric Cyan Glow (Subtle & Academic) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_42%_45%,rgba(24,199,243,0.13),transparent_32%)]"
        />

        {/* Large Calibrated Brand Watermark */}
        <Watermark />

        {/* ========================================================================= */}
        {/* STAGES CHORÉGRAPHIÉS EN ACCORD AVEC L'ANIMATION 3D */}
        {/* ========================================================================= */}
        <Stage1Hero ref={stage1Ref} />
        <Stage2Teachers ref={stage2Ref} />
        <Stage3Training ref={stage3Ref} />
        <Stage4Pricing ref={stage4Ref} />

      </div>
    </div>
  );
}
