"use client";

import React, { useState, useEffect, useRef, useCallback, useId } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Shield,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { extractYouTubeId } from "@/lib/driveUtils";
import { useAntiInspection, deobfuscateVideoToken } from "@/lib/videoSecurity";

interface AnonymousPlayerProps {
  url: string;
  title: string;
  onEnded?: () => void;
}

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setPlaybackRate: (rate: number) => void;
  destroy: () => void;
}

interface YTReadyEvent {
  target: YTPlayerInstance;
}

interface YTStateChangeEvent {
  data: number;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: Record<string, unknown>
      ) => YTPlayerInstance;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export function AnonymousPlayer({ url, title, onEnded }: AnonymousPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const rawId = useId();
  const playerElementId = "yt-player-" + rawId.replace(/[^a-zA-Z0-9]/g, "");

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(90);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Détection & neutralisation anti-DevTools / F12
  const { isDevToolsDetected, dismissWarning } = useAntiInspection(true);

  // Déchiffrement sécurisé du jeton en mémoire
  const resolvedUrl = deobfuscateVideoToken(url);
  const youtubeId = extractYouTubeId(resolvedUrl);

  // Pause immédiate si DevTools est ouvert
  useEffect(() => {
    if (isDevToolsDetected && playerRef.current) {
      try {
        playerRef.current.pauseVideo();
      } catch {
        // Ignore
      }
    }
  }, [isDevToolsDetected]);

  // Initialisation du script YouTube IFrame API
  useEffect(() => {
    if (!youtubeId) return;

    let isMounted = true;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      // Nettoyer l'instance précédente si elle existe
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignore
        }
      }

      playerRef.current = new window.YT.Player(playerElementId, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0, // DÉSACTIVE TOUS LES CONTRÔLES YOUTUBE (Total Anonymat)
          disablekb: 1, // Désactive les raccourcis natifs YouTube
          fs: 0, // Désactive le bouton plein écran YouTube
          iv_load_policy: 3, // Masque les annotations
          modestbranding: 1, // Masque le logo YouTube
          rel: 0, // Ne suggère aucune vidéo tierce
          showinfo: 0, // Masque le titre YouTube
          playsinline: 1,
          origin: typeof window !== "undefined" ? window.location.origin : undefined,
        },
        events: {
          onReady: (event: YTReadyEvent) => {
            if (!isMounted) return;
            setIsBuffering(false);
            try {
              event.target.playVideo();
              event.target.setVolume(90);
              const dur = event.target.getDuration();
              if (dur && !isNaN(dur)) setDuration(dur);
            } catch {
              // Ignore
            }
          },
          onStateChange: (event: YTStateChangeEvent) => {
            if (!isMounted) return;
            // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
            if (event.data === 1) {
              setIsPlaying(true);
              setIsBuffering(false);
            } else if (event.data === 2) {
              setIsPlaying(false);
              setIsBuffering(false);
            } else if (event.data === 3) {
              setIsBuffering(true);
            } else if (event.data === 0) {
              setIsPlaying(false);
              setIsBuffering(false);
              if (onEnded) onEnded();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };

      if (!document.getElementById("youtube-iframe-api-script")) {
        const script = document.createElement("script");
        script.id = "youtube-iframe-api-script";
        script.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(script);
      }
    }

    return () => {
      isMounted = false;
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignore
        }
      }
    };
  }, [youtubeId, onEnded]);

  // Boucle de mise à jour du temps et de la durée
  useEffect(() => {
    const timer = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
        try {
          const cur = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          if (cur !== undefined && !isNaN(cur)) setCurrentTime(cur);
          if (dur !== undefined && !isNaN(dur) && dur > 0) setDuration(dur);
        } catch {
          // Ignore
        }
      }
    }, 250);

    return () => clearInterval(timer);
  }, []);

  // Gestion du masquage automatique des contrôles
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSpeedMenu(false);
      }, 3000);
    }
  }, [isPlaying]);

  // Actions de lecture / pause
  const togglePlay = () => {
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } catch {
      // Ignore
    }
  };

  // Saut de +/- 10 secondes
  const seekDelta = (seconds: number) => {
    if (!playerRef.current) return;
    try {
      const cur = playerRef.current.getCurrentTime() || currentTime;
      const target = Math.max(0, Math.min(duration, cur + seconds));
      playerRef.current.seekTo(target, true);
      setCurrentTime(target);
    } catch {
      // Ignore
    }
  };

  // Clic sur la barre de progression
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const target = pos * duration;
    try {
      playerRef.current.seekTo(target, true);
      setCurrentTime(target);
    } catch {
      // Ignore
    }
  };

  // Volume
  const changeVolume = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (playerRef.current) {
      try {
        playerRef.current.setVolume(newVol);
        if (newVol > 0 && playerRef.current.isMuted()) {
          playerRef.current.unMute();
        }
      } catch {
        // Ignore
      }
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume || 80);
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch {
      // Ignore
    }
  };

  // Vitesse de lecture
  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
    if (playerRef.current && typeof playerRef.current.setPlaybackRate === "function") {
      try {
        playerRef.current.setPlaybackRate(rate);
      } catch {
        // Ignore
      }
    }
  };

  // Plein écran
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Formatage du temps mm:ss ou hh:mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Si l'URL n'est pas YouTube (ex: Google Drive Preview direct)
  if (!youtubeId) {
    return (
      <div className="w-full aspect-video bg-black relative rounded-2xl overflow-hidden">
        <iframe
          src={url}
          className="w-full h-full border-0"
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden select-none group shadow-2xl"
    >
      {/* 0. Écran Bouclier Anti-Inspection / DevTools Détecté */}
      {isDevToolsDetected && (
        <div className="absolute inset-0 z-50 bg-[#090d1a] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 sm:mb-4 shadow-xl shadow-amber-950/40">
            <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h4 className="text-base sm:text-lg font-black text-white mb-2">
            Mode Développeur Détecté · Flux Vidéo Protégé
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-5 leading-relaxed">
            Par mesure de protection de la propriété intellectuelle des cours PrépaSciences, l&apos;inspection du code source et l&apos;extraction du flux vidéo sont protégées.
            <br className="hidden sm:inline" />
            Veuillez <strong className="text-white">fermer les outils de développement (F12)</strong> pour reprendre votre cours.
          </p>
          <button
            type="button"
            onClick={dismissWarning}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer shadow-lg shadow-purple-950/60"
          >
            J&apos;ai fermé l&apos;inspecteur · Reprendre la lecture
          </button>
        </div>
      )}

      {/* 1. Iframe YouTube Masqué et Anonymisé (Échelle 102% pour rogner les bordures YT) */}
      <div className="absolute -inset-[2px] pointer-events-none scale-[1.02]">
        <div id={playerElementId} className="w-full h-full" />
      </div>

      {/* 2. Bandeau Supérieur de Sécurité : Masque le logo de chaîne et titre YouTube */}
      <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent px-4 py-2 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-mono font-bold text-[10px] tracking-wider uppercase flex items-center gap-1.5 shadow-md shadow-purple-950/60 shrink-0">
            <Shield className="w-3 h-3 text-purple-200" />
            <span>PREPASCIENCES PLAYER</span>
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] font-mono font-bold text-emerald-400">
            HD 1080p
          </span>
        </div>
      </div>

      {/* 3. Surface de Clic Centrale : Play / Pause au clic & Bouton Central */}
      <div
        onClick={togglePlay}
        className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center"
      >
        {(!isPlaying || isBuffering) && (
          <div className="relative group/playbtn">
            <div className="absolute -inset-3 bg-blue-500/30 rounded-full blur-xl animate-pulse" />
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:scale-110 active:scale-95 transition-all">
              {isBuffering ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <Play className="w-9 h-9 fill-white ml-1" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Barre de Contrôle Personnalisée (Inspirée du lecteur Ak-Math / Image 4) */}
      <div
        className={`absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent pt-8 pb-3 px-4 transition-opacity duration-300 pointer-events-auto ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Timeline / Barre de Progression Interactive */}
        <div
          onClick={handleSeek}
          className="relative w-full h-1.5 hover:h-2.5 bg-white/20 rounded-full mb-3 cursor-pointer group/bar transition-all"
        >
          {/* Ligne de progression dynamique */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Tête de lecture */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg shadow-black/50 -ml-1.5 opacity-0 group-hover/bar:opacity-100 transition-opacity"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* Ligne des Contrôles : Play, -10s, +10s, Volume, Timer, Vitesse, Plein Écran */}
        <div className="flex items-center justify-between text-white text-xs">
          {/* Groupe Gauche */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Bouton Play / Pause */}
            <button
              type="button"
              onClick={togglePlay}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
              title={isPlaying ? "Mettre en pause (Espace)" : "Lire"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
            </button>

            {/* Reculer de 10s */}
            <button
              type="button"
              onClick={() => seekDelta(-10)}
              className="flex items-center gap-0.5 px-2 py-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer font-mono text-[11px] font-bold"
              title="Reculer de 10 secondes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>10s</span>
            </button>

            {/* Avancer de 10s */}
            <button
              type="button"
              onClick={() => seekDelta(10)}
              className="flex items-center gap-0.5 px-2 py-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer font-mono text-[11px] font-bold"
              title="Avancer de 10 secondes"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>10s</span>
            </button>

            {/* Volume & Curseur */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? "Activer le son" : "Couper le son"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => changeVolume(Number(e.target.value))}
                className="w-14 sm:w-18 h-1 accent-indigo-500 bg-white/20 rounded-full cursor-pointer"
                title={`Volume : ${isMuted ? 0 : volume}%`}
              />
            </div>

            {/* Horodatage : 00:01 / 1:29:31 */}
            <span className="font-mono text-[11px] text-slate-300 ml-1">
              <span className="text-white font-bold">{formatTime(currentTime)}</span>
              <span className="opacity-60 mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </span>
          </div>

          {/* Groupe Droit : Vitesse & Plein Écran */}
          <div className="flex items-center gap-2">
            {/* Sélecteur de Vitesse */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-[11px] transition-colors cursor-pointer"
                title="Vitesse de lecture"
              >
                {playbackRate}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 py-1.5 bg-slate-900/95 backdrop-blur-md border border-white/15 rounded-xl shadow-2xl text-center min-w-[76px] z-30">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5 border-b border-white/10 mb-1">
                    Vitesse
                  </div>
                  {[0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => changePlaybackRate(rate)}
                      className={`w-full px-3 py-1 text-xs font-mono transition-colors block text-left cursor-pointer ${
                        playbackRate === rate
                          ? "bg-indigo-600 text-white font-black"
                          : "text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {rate}x {rate === 1 && <span className="text-[10px] opacity-70">(Normal)</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton Plein Écran */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
