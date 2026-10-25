"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { PC_COURSES_DATA } from "./pcCoursesData";
import { ChapitreItem, CourseSession, CourseExercise, CourseFiche, CorrigeItem } from "@/types/courses";
import {
  Search,
  X,
  ChevronDown,
  FileText,
  CheckCircle2,
  PlayCircle,
  PlusCircle,
  Trash2,
  Lock,
  Layers,
  BookOpen,
  Edit2,
  Atom,
  Check,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Sparkles,
  GripVertical,
  RotateCcw,
  Eye,
  ArrowRightLeft,
} from "lucide-react";
import { getDriveImageUrls, extractDriveFileId, getYoutubeThumbnailCandidates, getYoutubeThumbnail } from "@/lib/driveUtils";
import { useCourses } from "@/context/CoursesContext";
import { useAuth } from "@/context/AuthContext";
import {
  ELEARNING_PHYSICS_VIDEOS,
  ElearningVideoItem,
  FiliereCPGE,
} from "@/data/elearningPhysiqueData";
import { VideothequeWidget } from "./VideothequeWidget";

interface CoursesWidgetProps {
  onOpenPdf: (url: string, title: string) => void;
  onOpenVideo: (url: string, title: string) => void;
  initialNiveau?: "sup" | "spe" | null;
  onSelectNiveau?: (niveau: "sup" | "spe" | null) => void;
}

export interface ChapterVideoItem {
  id: string;
  titre: string;
  sous?: string;
  video: string;
  support?: string;
  thumbnail?: string;
  durationFormatted?: string;
  badge?: string;
  isCustom?: boolean;
  rawSession?: CourseSession;
}

// ── Extraction Intelligente du Polycopié de Cours Officiel du Chapitre ──
function getChapterOfficialPdf(chapter: ChapitreItem & { moduleId?: string; moduleName?: string }): {
  url: string;
  titre: string;
  sous: string;
} {
  // 1. Chercher d'abord dans chapter.cours un support polycopié officiel
  const polySession = chapter.cours?.find(
    (c) =>
      c.support &&
      (c.titre.toLowerCase().includes("polycopié") ||
        c.titre.toLowerCase().includes("cours complet") ||
        c.sous?.toLowerCase().includes("officiel") ||
        c.sous?.toLowerCase().includes("support rédigé"))
  );
  if (polySession && polySession.support) {
    return {
      url: polySession.support,
      titre: polySession.titre,
      sous: polySession.sous || "Support officiel rédigé par Pr. Hassan EDDAMS",
    };
  }

  // 2. Chercher n'importe quel premier support de cours non vide
  const anySupport = chapter.cours?.find((c) => c.support && c.support.trim() !== "");
  if (anySupport && anySupport.support) {
    return {
      url: anySupport.support,
      titre: anySupport.titre.toLowerCase().includes("polycopié")
        ? anySupport.titre
        : `Polycopié de Cours : ${chapter.titre}`,
      sous: anySupport.sous || "Support officiel de cours CPGE · Pr. Hassan EDDAMS",
    };
  }

  // 3. Chercher dans les fiches de synthèse
  const polyFiche = chapter.fiches?.find(
    (f) =>
      f.url &&
      (f.titre.toLowerCase().includes("polycopié") || f.titre.toLowerCase().includes("cours"))
  );
  if (polyFiche && polyFiche.url) {
    return {
      url: polyFiche.url,
      titre: polyFiche.titre,
      sous: polyFiche.sous || "Polycopié officiel CPGE · Pr. Hassan EDDAMS",
    };
  }

  // 4. Mémento / Cours Résumé Général CPGE de référence par défaut
  return {
    url: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
    titre: `Polycopié de Cours : ${chapter.titre}`,
    sous: "Cours de référence multi-filières CPGE · Pr. Hassan EDDAMS",
  };
}

// ── Détection des Vidéos d'Extraits de Concours & Oraux CPGE ──
export function isConcoursVideo(v: ElearningVideoItem): boolean {
  if (v.moduleId === "concours" || Boolean(v.concoursTag)) return true;
  const p = (v.playlists || []).join(" ").toLowerCase();
  if (p.includes("concours")) return true;
  const title = (v.title || "").toLowerCase();
  return /\b(corrigé|corrigé|concours|centrale|mines-ponts|mines ponts|x-ens|x\/ens|ccp|ccinp|e3a|oral centrale|oral mines|planche|sujet)\b/i.test(title);
}

// ── Extraction des Séances & Replays Théoriques de Cours du Chapitre ──
export function getChapterCourseVideos(
  chapter: ChapitreItem & { moduleId?: string },
  selectedFiliere: FiliereCPGE | "ALL"
): ChapterVideoItem[] {
  const result: ChapterVideoItem[] = [];

  // 1. Séances créées par l'enseignant (Direct ou Custom)
  if (chapter.cours) {
    chapter.cours.forEach((s, idx) => {
      if (s.video && s.video.trim() !== "" && !s.isConcours) {
        result.push({
          id: s.id || `custom-sess-${idx}`,
          titre: s.titre,
          sous: s.sous || "Séance de cours & Replay interactif",
          video: s.video,
          support: s.support,
          thumbnail: s.thumbnail,
          badge: s.badge || "Séance du Professeur",
          isCustom: true,
          rawSession: s,
        });
      }
    });
  }

  // 2. Vidéos théoriques E-Learning Physique (non-concours)
  const modId = (chapter.moduleId || "").toLowerCase();
  const chapNum = chapter.num;
  const chapNiveau = chapter.niveau;

  const matchingElearningVideos = ELEARNING_PHYSICS_VIDEOS.filter((v) => {
    if (selectedFiliere !== "ALL" && !v.filieres.includes(selectedFiliere)) return false;
    if (isConcoursVideo(v)) return false; // Exclus ici car réservés à la rubrique Extraits de Concours

    const vTitle = (v.title || "").toLowerCase();
    const vChap = (v.chapitre || "").toLowerCase();
    const vPlaylists = (v.playlists || []).join(" ").toLowerCase();
    const vDom = (v.domaine || "").toLowerCase();
    const combined = `${vTitle} ${vChap} ${vPlaylists} ${vDom}`;
    const vMod = v.moduleId;
    const vNiv = v.niveau;

    let matched = false;
    if (modId.includes("elec-sup")) {
      if (vMod === "elec" && (vNiv === "sup" || vNiv === "tous")) {
        if (chapNum === 1 && /arqs|kirchhoff|nœud|noeud|maille|base|courant/.test(combined)) matched = true;
        else if (chapNum === 2 && /thévenin|thevenin|norton|millman|diviseur|pont/.test(combined)) matched = true;
        else if (chapNum === 3 && /transitoire|rc|rl|rlc|ordre/.test(combined)) matched = true;
        else if (chapNum === 4 && /rsf|sinusoïdal|sinusoidal|résonance|resonance|impédance|impedance/.test(combined)) matched = true;
        else if (chapNum === 5 && /bode|filtre|filtrage|passante|coupure|passe/.test(combined)) matched = true;
        else if (chapNum === 6 && /aop|ali|amplificateur|opérationnel|operationnel|comparateur/.test(combined)) matched = true;
        else if ([1, 2, 4].includes(chapNum) && /puissance|dipôle|dipole/.test(combined)) matched = true;
      }
    } else if (modId.includes("elec-spe")) {
      if (vMod === "elec") {
        if (chapNum === 1 && /harmonique|spectre|spectrale|fourier|filtrage/.test(combined)) matched = true;
        else if (chapNum === 2 && /numérique|numerique|échantillonnage|echantillonnage|shannon|can|cna|modulation/.test(combined)) matched = true;
      }
    } else if (modId.includes("thermo-sup")) {
      if (vMod === "thermo" || (vMod === "fluides" && combined.includes("statique"))) {
        if (chapNum === 1 && /équilibre|equilibre|cinétique|cinetique|gaz parfait|gaz réel|état|introduction/.test(combined)) matched = true;
        else if (chapNum === 2 && (/statique/.test(combined) || /pression|archimède|archimede|barométrique|océan|barometre/.test(combined))) matched = true;
        else if (chapNum === 3 && /premier principe|1er principe|travail|chaleur|enthalpie|énergie interne/.test(combined)) matched = true;
        else if (chapNum === 4 && /second principe|2ème principe|2nd principe|entropie/.test(combined)) matched = true;
        else if (chapNum === 5 && /machine|carnot|cycle|moteur|frigo|pompe|rendement/.test(combined)) matched = true;
        else if (chapNum === 6 && /phase|corps pur|clapeyron|saturation|vapeur|liquéfaction/.test(combined)) matched = true;
      }
    } else if (modId.includes("thermo-spe")) {
      if (vMod === "thermo" && /diffusion|conduction|fourier|thermique|résistance|resistance|ailette|chaleur/.test(combined)) {
        matched = true;
      }
    } else if (modId.includes("meca-sup")) {
      if (vMod === "meca") {
        if (chapNum === 1 && /cinématique|cinematique|polaire|cylindrique|sphérique|frenet|vitesse|accélération|coordonnées/.test(combined)) matched = true;
        else if (chapNum === 2 && /dynamique|newton|pfd|frottement|projection|coulomb|résume tout|important/.test(combined)) matched = true;
        else if (chapNum === 3 && /potentielle|mécanique|mecanique|énergétique|energetique|travail|puissance|pendule/.test(combined)) matched = true;
        else if (chapNum === 4 && /moment cinétique|moment cinetique|bras de levier|moment d/.test(combined)) matched = true;
        else if (chapNum === 5 && /centrale|kepler|binet|potentielle effective|potentielle efficace|gravitation/.test(combined)) matched = true;
        else if (chapNum === 6 && /non galiléen|non galileen|coriolis|inertie|marée|foucault|référentiel/.test(combined)) matched = true;
      }
    } else if (modId.includes("optique-sup")) {
      if (vMod === "optique" && (vNiv === "sup" || /descartes|réfraction|lentille|miroir|instrument|gauss/.test(combined))) {
        matched = true;
      }
    } else if (modId.includes("optique-spe")) {
      if (vMod === "optique") {
        matched = true;
      }
    } else if (modId.includes("em-sup")) {
      if (vMod === "em" && (vNiv === "sup" || /statique/.test(combined))) {
        if (chapNum === 1 && /électrostatique|electrostatique|gauss|coulomb|potentiel|dipôle/.test(combined)) matched = true;
        else if (chapNum === 2 && /magnétostatique|magnetostatique|ampère|ampere|biot|savart|courant|solénoïde/.test(combined)) matched = true;
      }
    } else if (modId.includes("em-spe")) {
      if (vMod === "em") {
        if (chapNum === 1 && /maxwell|opérateur|operateur|continuité|ohm|drude|charge/.test(combined)) matched = true;
        else if (chapNum === 2 && /induction|faraday|laplace|poynting|énergie|energie|machine|moteur|transformateur|synchrone|conversion/.test(combined)) matched = true;
      }
    } else if (modId.includes("ondes-spe")) {
      if (vMod === "ondes") {
        matched = true;
      }
    } else if (modId.includes("quantique-spe")) {
      if (vMod === "quantique") {
        matched = true;
      }
    } else if (modId.includes("fluides-spe")) {
      if (vMod === "fluides" && vNiv === "spe") {
        matched = true;
      }
    }

    return matched;
  });

  const existingUrls = new Set(result.map((r) => r.video));
  for (const ev of matchingElearningVideos) {
    if (!existingUrls.has(ev.youtubeUrl)) {
      existingUrls.add(ev.youtubeUrl);
      let filiereBadge = "Tronc Commun CPGE";
      if (ev.moduleId === "methodes") {
        filiereBadge = "Méthode CPGE";
      } else if (ev.isCommon) {
        filiereBadge = "Tronc Commun CPGE";
      } else if (ev.filieres.includes("PSI") && !ev.filieres.includes("MP")) {
        filiereBadge = "Spécifique PSI";
      } else if (ev.filieres.includes("MP") && !ev.filieres.includes("PSI")) {
        filiereBadge = "Spécifique MP";
      } else if (ev.filieres.includes("PC")) {
        filiereBadge = "Spécifique PC";
      }

      result.push({
        id: ev.id,
        titre: ev.title,
        sous: `${ev.domaine} · ${ev.chapitre}`,
        video: ev.youtubeUrl,
        thumbnail: ev.thumbnailUrl,
        durationFormatted: ev.durationFormatted,
        badge: filiereBadge,
        isCustom: false,
      });
    }
  }

  // Filtrer les vidéos masquées/retirées (notamment celles de Prépasciences)
  const hiddenIds = new Set(chapter.hiddenVideoIds || []);
  let finalResult = result.filter((r) => !hiddenIds.has(r.id) && !hiddenIds.has(r.video));

  // Réordonner selon chapter.videoOrder (Drag & Drop)
  if (chapter.videoOrder && chapter.videoOrder.length > 0) {
    const orderMap = new Map(chapter.videoOrder.map((id, index) => [id, index]));
    finalResult.sort((a, b) => {
      const idxA = orderMap.has(a.id) ? orderMap.get(a.id)! : 9999;
      const idxB = orderMap.has(b.id) ? orderMap.get(b.id)! : 9999;
      return idxA - idxB;
    });
  }

  return finalResult;
}

// ── Extraction Spécifique des Extraits de Concours & Problèmes Types pour le Chapitre ──
export function getChapterConcoursVideos(
  chapter: ChapitreItem & { moduleId?: string },
  selectedFiliere: FiliereCPGE | "ALL"
): ChapterVideoItem[] {
  const result: ChapterVideoItem[] = [];
  const modId = (chapter.moduleId || "").toLowerCase();
  const chapNum = chapter.num;
  const chapterId = (chapter.id || "").toLowerCase();

  // 1. Extraits de concours personnalisés ou transférés vers ce chapitre
  if (chapter.cours) {
    chapter.cours.forEach((s, idx) => {
      if (s.video && s.video.trim() !== "" && s.isConcours) {
        result.push({
          id: s.id || `custom-concours-${idx}`,
          titre: s.titre,
          sous: s.sous || "Extrait de Concours CPGE",
          video: s.video,
          support: s.support,
          thumbnail: s.thumbnail,
          badge: s.badge || "Concours CPGE",
          isCustom: true,
          rawSession: s,
        });
      }
    });
  }

  const matchingConcoursVideos = ELEARNING_PHYSICS_VIDEOS.filter((v) => {
    if (!isConcoursVideo(v)) return false;
    if (selectedFiliere !== "ALL" && v.filieres && !v.filieres.includes(selectedFiliere)) {
      return false;
    }

    const t = ` ${v.title || ""} ${v.chapitre || ""} ${(v.playlists || []).join(" ")} ${v.domaine || ""} `.toLowerCase();

    // 1. Physique Quantique
    if (chapterId.includes("quantique") || modId.includes("quantique")) {
      return /\b(quantique|schrödinger|schrodinger|bohr|stern|gerlach|heisenberg|photoélectrique|photoélectrique|photoelectrique|effet tunnel|ammoniac|radioactivité|alpha)\b/i.test(t);
    }
    // 2. Mécanique des Fluides Spé
    if (chapterId.includes("fluides") || modId.includes("fluides")) {
      return /\b(poiseuille|navier|stokes|viscosité|viscosite|mascaret|éolienne|eolienne|circulation sanguine|vaisseaux|reynolds|pression négative|pression negative|traînée|trainee)\b/i.test(t) ||
        (t.includes("espci") && !t.includes("quantique"));
    }
    // 3. Diffusion Thermique Spé
    if (chapterId.includes("thermo-spe") || modId.includes("thermo-spe")) {
      return /\b(diffusion|conduction|fourier|ailette|ailettes|croissance de la glace|ondes thermiques)\b/i.test(t);
    }
    // 4. Thermodynamique Sup
    if (chapterId.includes("thermo-sup") || modId.includes("thermo-sup")) {
      if (chapNum === 5) return /\b(1er principe|premier principe|machines? thermiques?|moteurs?|pompe à chaleur|pseudo sources|tuyère|tuyere|effet de serre|carnot|cycle)\b/i.test(t);
      if (chapNum === 2) return /\b(statique des fluides|archimède|archimede|barométrique|barometrique)\b/i.test(t);
      if (chapNum === 6) return /\b(clapeyron|changement de phase|corps pur|vapeur)\b/i.test(t);
      if (chapNum === 3) return /\b(1er principe|premier principe|enthalpie|énergie interne)\b/i.test(t);
    }
    // 5. Ondes Spé & Acoustique
    if (chapterId.includes("ondes-spe") || modId.includes("ondes-spe")) {
      return /\b(acoustique|ultra sons|ultrasons|coaxial|modes propres|sonore|d'alembert|dalembert|dispersion-absorption|haut parleur|système élastique|poutre|millenium bridge|ondes sismiques)\b/i.test(t);
    }
    // 6. Optique Ondulatoire Spé
    if (chapterId.includes("optique-spe") || modId.includes("optique-spe")) {
      return /\b(michelson|diffraction|réseau|reseau|cohérence|coherence|doublet du sodium|télémétrie|telemetrie|biréfringence|birefringence|polarisation|malus|laser|gladstone)\b/i.test(t);
    }
    // 7. Électronique Spé
    if (chapterId.includes("elec-spe") || modId.includes("elec-spe")) {
      if (chapNum === 2) return /\b(modulation|démodulation|demodulation|porteuse|échantillonnage|echantillonnage|shannon|bloqueur|repliement)\b/i.test(t);
      if (chapNum === 1) return /\b(séries de fourier|series de fourier|analyse de fourier|spectre|harmonique)\b/i.test(t);
    }
    // 8. Électromagnétisme Spé
    if (chapterId.includes("em-spe") || modId.includes("em-spe")) {
      if (chapNum === 2) return /\b(induction|effet de peau|plaque à induction|plaque a induction|maxwell|rayonnement|poynting|laplace|actionneur|oem|onde électromagnétique|plasma)\b/i.test(t);
      if (chapNum === 1) return /\b(conductivité|conductivite|memristor|loi d'ohm|drude|continuité)\b/i.test(t);
    }
    // 9. Électromagnétisme Sup
    if (chapterId.includes("em-sup") || modId.includes("em-sup")) {
      if (chapNum === 2) return /\b(rmn|résonance magnétique|resonance magnetique|meissner|supraconducteur|magnétique terrestre|magnetique terrestre|pôles géographiques|poles geographiques|champ magnétique|particule chargée)\b/i.test(t);
      if (chapNum === 1) return /\b(électrostatique|electrostatique|théorème de gauss|coulomb|potentiel électrostatique)\b/i.test(t);
    }
    // 10. Mécanique Sup
    if (chapterId.includes("meca-sup") || modId.includes("meca-sup")) {
      if (chapNum === 5) return /\b(gravitation|orbite|satellite|rosetta|mars|rutherford|kepler|gravimètre|gravimetre|fléau)\b/i.test(t);
      if (chapNum === 6) return /\b(coriolis|non galiléen|non galileen|géophysique|geophysique|déviation vers l'est|deviation vers l'est)\b/i.test(t);
      if ([2, 3, 4].includes(chapNum)) return /\b(pendule|richter|ressort|traîneau|traineau|cartouche|fusée|fusee|chute|énergétique|energetique|newton|pfd|frottement)\b/i.test(t);
    }
    // 11. Électronique Sup
    if (chapterId.includes("elec-sup") || modId.includes("elec-sup")) {
      if (chapNum === 6) return /\b(ali|aop|amplificateur|comparateur|wien|intégrateur|integrateur|générateur de signaux)\b/i.test(t);
      if (chapNum === 5) return /\b(filtrage|passe bas|passe haut|fréquence de coupure|bode|lissajous)\b/i.test(t);
      if ([3, 4].includes(chapNum)) return /\b(rlc|transitoire|transitoires|oscillo|oscilloscope|tension moitié|tension moitie|impédance|impedance|circuits couplés)\b/i.test(t);
      if ([1, 2].includes(chapNum)) return /\b(redressement|diode|kirchhoff|thévenin|thevenin|norton|millman)\b/i.test(t);
    }
    // 12. Optique Géométrique Sup
    if (chapterId.includes("optique-sup") || modId.includes("optique-sup")) {
      return /\b(goniomètre|goniometre|prisme|faisceau laser|appareil photo|descartes|lentille|miroir)\b/i.test(t);
    }

    return false;
  });

  const existingUrls = new Set<string>();
  for (const ev of matchingConcoursVideos) {
    if (!existingUrls.has(ev.youtubeUrl)) {
      existingUrls.add(ev.youtubeUrl);
      const tag = ev.concoursTag || "Concours CPGE";
      result.push({
        id: ev.id,
        titre: ev.title,
        sous: `${ev.domaine} · ${ev.chapitre}`,
        video: ev.youtubeUrl,
        thumbnail: ev.thumbnailUrl,
        durationFormatted: ev.durationFormatted,
        badge: tag,
        isCustom: false,
      });
    }
  }

  // Filtrer les vidéos de concours masquées/retirées
  const hiddenConcoursIds = new Set(chapter.hiddenConcoursVideoIds || []);
  let finalResult = result.filter((r) => !hiddenConcoursIds.has(r.id) && !hiddenConcoursIds.has(r.video));

  // Réordonner selon chapter.concoursVideoOrder (Drag & Drop)
  if (chapter.concoursVideoOrder && chapter.concoursVideoOrder.length > 0) {
    const orderMap = new Map(chapter.concoursVideoOrder.map((id, index) => [id, index]));
    finalResult.sort((a, b) => {
      const idxA = orderMap.has(a.id) ? orderMap.get(a.id)! : 9999;
      const idxB = orderMap.has(b.id) ? orderMap.get(b.id)! : 9999;
      return idxA - idxB;
    });
  }

  return finalResult;
}

// ── BANDEAU MAJESTUEUX : POLYCOPIÉ DE COURS OFFICIEL (EN HAUT DU CHAPITRE) ──
function ChapterOfficialPdfBanner({
  pdf,
  chapterTitre,
  selectedFiliere,
  onOpenPdf,
}: {
  pdf: { url: string; titre: string; sous: string };
  chapterTitre: string;
  selectedFiliere: FiliereCPGE | "ALL";
  onOpenPdf: (url: string, title: string) => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-transparent dark:from-purple-950/50 dark:via-indigo-950/35 dark:to-[#0d1322] border-2 border-purple-200/90 dark:border-purple-500/40 p-4 sm:p-5 shadow-sm transition-all hover:shadow-md">
      <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-purple-500/15 blur-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Côté Gauche : Icône Polycopié + Titres + Note Pédagogique */}
        <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 text-white flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/25 border border-white/20">
            <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                <BookOpen className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span>Polycopié de Cours Officiel · Pr. Hassan EDDAMS</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                <span>Multi-Filières CPGE (MP · PSI · PC · TSI)</span>
              </span>
            </div>

            <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
              {pdf.titre}
            </h4>

            {pdf.sous && (
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {pdf.sous}
              </p>
            )}

            {/* Note pédagogique explicite du professeur */}
            <div className="mt-2 p-2.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-500/20 text-[11px] sm:text-xs text-purple-900 dark:text-purple-200 leading-relaxed font-medium flex items-start gap-2">
              <span className="text-sm shrink-0">📌</span>
              <span>
                <strong>Repères Filières du Professeur :</strong> Dans ce polycopié complet, le professeur signale directement dans le cours les paragraphes et compléments exigibles selon votre filière ({selectedFiliere === "ALL" ? "MP, PSI, PC, TSI" : `filière active : ${selectedFiliere}`}).
              </span>
            </div>
          </div>
        </div>

        {/* Côté Droit : Bouton d'accès au document PDF */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-purple-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onOpenPdf(pdf.url, `${pdf.titre} — ${chapterTitre}`)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/25 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Consulter le Polycopié (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CARTE VIDÉO UNIFIÉE (JUSTE EN BAS DU POLYCOPIÉ) ──
function UnifiedChapterVideoCard({
  vid,
  index,
  totalCount,
  chapTitre,
  onOpenPdf,
  onOpenVideo,
  isTeacherView,
  onEdit,
  onDelete,
  onTransfer,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  isDragging,
  isDragOver,
}: {
  vid: ChapterVideoItem;
  index: number;
  totalCount?: number;
  chapTitre: string;
  onOpenPdf: (url: string, title: string) => void;
  onOpenVideo: (url: string, title: string) => void;
  isTeacherView?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onTransfer?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onDrop?: (e: React.DragEvent) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
}) {
  const titre = vid.titre || `Vidéo ${index + 1}`;
  const sous = vid.sous || "Replay de cours & Résolution méthodique";
  const videoUrl = vid.video || "";
  const supportUrl = vid.support || "";
  const hasVideo = Boolean(videoUrl && videoUrl.trim() !== "");
  const hasSupport = Boolean(supportUrl && supportUrl.trim() !== "");

  const thumbnailCandidates = useMemo(() => {
    const list: string[] = [];
    if (vid.thumbnail && vid.thumbnail.trim()) {
      list.push(vid.thumbnail.trim());
    }
    if (videoUrl) {
      const ytCandidates = getYoutubeThumbnailCandidates(videoUrl);
      list.push(...ytCandidates);
    }
    return list;
  }, [vid.thumbnail, videoUrl]);

  const [thumbIdx, setThumbIdx] = useState(0);
  const [thumbFailed, setThumbFailed] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);

  const handleThumbError = () => {
    if (thumbIdx + 1 < thumbnailCandidates.length) {
      setThumbIdx((prev) => prev + 1);
    } else {
      setThumbFailed(true);
    }
  };

  const hasValidThumb = thumbnailCandidates.length > 0 && !thumbFailed;

  return (
    <article
      draggable={isTeacherView}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      className={`group relative bg-white dark:bg-[#0d1322] border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
        isDragging
          ? "opacity-40 scale-95 border-purple-500 ring-2 ring-purple-500 shadow-xl"
          : isDragOver
          ? "border-purple-500 ring-4 ring-purple-400/50 scale-[1.02] shadow-xl"
          : "border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/40"
      }`}
    >
      {/* Barre d'actions & Drag and Drop Enseignant/Admin */}
      {isTeacherView && (
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
          {/* Poignée Drag & Drop avec numéro d'ordre */}
          <div
            className="cursor-grab active:cursor-grabbing p-1 rounded-lg text-purple-300 hover:text-white flex items-center gap-0.5 select-none"
            title="Glisser-déposer (Drag & Drop) pour réordonner cette vidéo"
          >
            <GripVertical className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono font-bold">#{index + 1}</span>
          </div>

          {/* Boutons flèches rapides pour réordonner */}
          {onMoveUp && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Déplacer vers la gauche (précédent)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Déplacer vers la droite (suivant)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Bouton Édition (si séance personnalisée) */}
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 rounded-lg text-purple-300 hover:text-white hover:bg-purple-600/50 transition-colors cursor-pointer"
              title="Modifier les liens de cette séance"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Bouton Transférer vers un autre module / chapitre */}
          {onTransfer && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTransfer();
              }}
              className="p-1 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-600 transition-colors cursor-pointer"
              title="Transférer cette vidéo vers un autre module ou chapitre"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Bouton Retrait / Suppression (pour TOUTES les vidéos : catalogue Prépasciences ou perso) */}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Confirmez-vous le retrait de la vidéo "${titre}" de ce chapitre ?`)) {
                  onDelete();
                }
              }}
              className="p-1 rounded-lg text-red-400 hover:text-white hover:bg-red-600 transition-colors cursor-pointer"
              title="Retirer cette vidéo du chapitre"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Vignette Vidéo / Support avec Héritage Miniature */}
      {hasVideo ? (
        <div
          className="relative w-full aspect-video bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden cursor-pointer select-none"
          onClick={() => onOpenVideo(videoUrl, `${titre} — ${chapTitre}`)}
          title={`Regarder : ${titre}`}
        >
          {hasValidThumb ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={thumbnailCandidates[thumbIdx]}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                thumbLoaded ? "opacity-100" : "opacity-0"
              }`}
              src={thumbnailCandidates[thumbIdx]}
              alt={titre}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              loading="lazy"
              onLoad={() => setThumbLoaded(true)}
              onError={handleThumbError}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a1024] via-[#121b36] to-[#1c1236] flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-2 shadow-inner">
                <Atom className="w-6 h-6 animate-pulse text-purple-400" />
              </div>
              <span className="text-xs font-bold text-white line-clamp-1 max-w-[85%] drop-shadow-xs">
                {titre}
              </span>
              <span className="text-[10px] text-purple-300/90 font-mono mt-0.5">
                Replay HD · Physique-Chimie CPGE
              </span>
            </div>
          )}

          {/* Calque Sombre & Badge Filière & Bouton Play */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-transparent flex flex-col justify-between p-2.5 sm:p-3 pointer-events-none">
            <div className="flex items-center justify-between gap-1 w-full">
              {vid.badge && (
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-900/90 text-purple-200 border border-purple-400/30 shadow-xs">
                  {vid.badge}
                </span>
              )}
              {!vid.isCustom && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-indigo-900/80 text-indigo-200 border border-indigo-400/30 shadow-xs">
                  Prépasciences
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-xs ml-auto">
                <Lock className="w-2.5 h-2.5" />
                MEMBRE
              </span>
            </div>

            <div className="self-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-red-600/90 group-hover:bg-red-600 group-hover:scale-110 flex items-center justify-center text-white shadow-xl shadow-red-950/50 transition-all pointer-events-auto">
              <PlayCircle className="w-7 h-7" />
            </div>

            <div className="flex items-center justify-between text-[10px] text-white/90 font-medium">
              <span className="truncate max-w-[70%] drop-shadow-xs">{chapTitre}</span>
              {vid.durationFormatted && (
                <span className="bg-black/70 px-1.5 py-0.5 rounded font-mono text-[9px] text-purple-200 border border-white/10">
                  {vid.durationFormatted}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : hasSupport ? (
        <div
          className="relative w-full aspect-video bg-gradient-to-br from-indigo-900 to-purple-950 flex flex-col items-center justify-center p-3 cursor-pointer text-indigo-100"
          onClick={() => onOpenPdf(supportUrl, `Support : ${titre} — ${chapTitre}`)}
        >
          <FileText className="w-7 h-7 mb-1 opacity-90 text-indigo-300" />
          <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-100">
            Support de Cours PDF
          </span>
        </div>
      ) : null}

      {/* Informations de la séance */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
            {titre}
          </h4>
          {sous && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {sous}
            </p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          {hasSupport && (
            <button
              type="button"
              onClick={() => onOpenPdf(supportUrl, `Support : ${titre} — ${chapTitre}`)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-500/30 transition-colors cursor-pointer"
            >
              <FileText className="w-3 h-3" />
              <span>Support PDF</span>
            </button>
          )}

          {hasVideo && (
            <button
              type="button"
              onClick={() => onOpenVideo(videoUrl, `${titre} — ${chapTitre}`)}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer ml-auto shadow-2xs"
            >
              <PlayCircle className="w-3 h-3" />
              <span>Regarder</span>
              <Lock className="w-2.5 h-2.5 ml-0.5 opacity-80" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// ── CARTE EXTRAIT DE CONCOURS & PROBLÈME TYPE (SPÉCIFIQUE AUX ANNALES CPGE) ──
function ConcoursExtractCard({
  vid,
  index,
  totalCount,
  chapTitre,
  onOpenVideo,
  isTeacherView,
  onDelete,
  onTransfer,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  isDragging,
  isDragOver,
}: {
  vid: ChapterVideoItem;
  index: number;
  totalCount?: number;
  chapTitre: string;
  onOpenVideo: (url: string, title: string) => void;
  isTeacherView?: boolean;
  onDelete?: () => void;
  onTransfer?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onDrop?: (e: React.DragEvent) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
}) {
  const titre = vid.titre;
  const sous = vid.sous || "Extrait de Concours CPGE";
  const videoUrl = vid.video || "";
  const hasVideo = Boolean(videoUrl && videoUrl.trim() !== "");

  const thumbnailCandidates = useMemo(() => {
    const list: string[] = [];
    if (vid.thumbnail && vid.thumbnail.trim()) {
      list.push(vid.thumbnail.trim());
    }
    if (videoUrl) {
      const ytCandidates = getYoutubeThumbnailCandidates(videoUrl);
      list.push(...ytCandidates);
    }
    return list;
  }, [vid.thumbnail, videoUrl]);

  const [thumbIdx, setThumbIdx] = useState(0);
  const [thumbFailed, setThumbFailed] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);

  const handleThumbError = () => {
    if (thumbIdx + 1 < thumbnailCandidates.length) {
      setThumbIdx((prev) => prev + 1);
    } else {
      setThumbFailed(true);
    }
  };

  const hasValidThumb = thumbnailCandidates.length > 0 && !thumbFailed;

  // Style de badge selon le concours
  const badgeStyle = useMemo(() => {
    const b = (vid.badge || "").toLowerCase();
    if (b.includes("x-ens") || b.includes("polytechnique")) {
      return "bg-rose-950/90 text-rose-200 border-rose-500/40";
    }
    if (b.includes("mines")) {
      return "bg-sky-950/90 text-sky-200 border-sky-500/40";
    }
    if (b.includes("centrale")) {
      return "bg-amber-950/90 text-amber-200 border-amber-500/40";
    }
    if (b.includes("ccp") || b.includes("ccinp")) {
      return "bg-emerald-950/90 text-emerald-200 border-emerald-500/40";
    }
    if (b.includes("tp")) {
      return "bg-indigo-950/90 text-indigo-200 border-indigo-500/40";
    }
    return "bg-purple-950/90 text-purple-200 border-purple-500/40";
  }, [vid.badge]);

  return (
    <article
      draggable={isTeacherView}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      className={`group relative bg-white dark:bg-[#0c1222] border-2 rounded-xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between ${
        isDragging
          ? "opacity-40 scale-95 border-amber-500 ring-2 ring-amber-500 shadow-xl"
          : isDragOver
          ? "border-amber-500 ring-4 ring-amber-400/50 scale-[1.02] shadow-xl"
          : "border-amber-200/70 dark:border-amber-500/30 hover:border-amber-400 dark:hover:border-amber-400/70"
      }`}
    >
      {/* Barre d'actions & Drag and Drop Enseignant/Admin */}
      {isTeacherView && (
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
          {/* Poignée Drag & Drop avec numéro d'ordre */}
          <div
            className="cursor-grab active:cursor-grabbing p-1 rounded-lg text-amber-300 hover:text-white flex items-center gap-0.5 select-none"
            title="Glisser-déposer (Drag & Drop) pour réordonner cet extrait de concours"
          >
            <GripVertical className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono font-bold">#{index + 1}</span>
          </div>

          {/* Boutons flèches rapides pour réordonner */}
          {onMoveUp && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Déplacer vers la gauche (précédent)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Déplacer vers la droite (suivant)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Bouton Transférer vers un autre module / chapitre */}
          {onTransfer && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTransfer();
              }}
              className="p-1 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-600 transition-colors cursor-pointer"
              title="Transférer cet extrait de concours vers un autre module ou chapitre"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Bouton Retrait / Suppression de concours */}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Confirmez-vous le retrait de cet extrait de concours "${titre}" de ce chapitre ?`)) {
                  onDelete();
                }
              }}
              className="p-1 rounded-lg text-red-400 hover:text-white hover:bg-red-600 transition-colors cursor-pointer"
              title="Retirer cet extrait de concours du chapitre"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Vignette Vidéo avec badge concours et bouton Play */}
      {hasVideo && (
        <div
          className="relative w-full aspect-video bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900 overflow-hidden cursor-pointer select-none"
          onClick={() => onOpenVideo(videoUrl, `${titre} — ${chapTitre}`)}
          title={`Résolution Concours : ${titre}`}
        >
          {hasValidThumb ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={thumbnailCandidates[thumbIdx]}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                thumbLoaded ? "opacity-100" : "opacity-0"
              }`}
              src={thumbnailCandidates[thumbIdx]}
              alt={titre}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              loading="lazy"
              onLoad={() => setThumbLoaded(true)}
              onError={handleThumbError}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#120a1c] via-[#221330] to-[#0d1424] flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-2 shadow-inner">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-xs font-bold text-white line-clamp-1 max-w-[85%]">
                {titre}
              </span>
              <span className="text-[10px] text-amber-300/90 font-mono mt-0.5">
                Extrait Concours · CPGE
              </span>
            </div>
          )}

          {/* Calque Sombre & Badge Concours */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent flex flex-col justify-between p-2.5 sm:p-3 pointer-events-none">
            <div className="flex items-center justify-between gap-1 w-full">
              <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border shadow-xs ${badgeStyle}`}>
                🏆 {vid.badge || "Concours CPGE"}
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 shadow-xs ml-auto">
                <Lock className="w-2.5 h-2.5" />
                MEMBRE
              </span>
            </div>

            <div className="self-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-amber-600 to-red-600 group-hover:from-amber-500 group-hover:to-red-500 group-hover:scale-110 flex items-center justify-center text-white shadow-xl shadow-amber-950/60 transition-all pointer-events-auto">
              <PlayCircle className="w-7 h-7" />
            </div>

            <div className="flex items-center justify-between text-[10px] text-white/90 font-medium">
              <span className="truncate max-w-[70%] text-amber-200/90 drop-shadow-xs font-semibold">{chapTitre}</span>
              {vid.durationFormatted && (
                <span className="bg-black/80 px-1.5 py-0.5 rounded font-mono text-[9px] text-amber-300 border border-amber-500/30">
                  {vid.durationFormatted}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Titre & Description */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3 bg-gradient-to-b from-amber-500/[0.02] to-transparent">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
            {titre}
          </h4>
          {sous && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {sous}
            </p>
          )}
        </div>

        {/* Bouton d'action */}
        <div className="flex items-center justify-between pt-2 border-t border-amber-100 dark:border-slate-800/80">
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
            Résolution guidée
          </span>
          <button
            type="button"
            onClick={() => onOpenVideo(videoUrl, `${titre} — ${chapTitre}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white transition-colors cursor-pointer shadow-xs"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Voir le Corrigé</span>
          </button>
        </div>
      </div>
    </article>
  );
}

// ── 1. Carte Séance de cours & Replay Vidéo (Colonne Gauche) ──
function CourseSessionCard({
  seance,
  index,
  chapTitre,
  onOpenPdf,
  onOpenVideo,
  isTeacherView,
  onEdit,
  onDelete,
}: {
  seance: CourseSession;
  index: number;
  chapTitre: string;
  onOpenPdf: (url: string, title: string) => void;
  onOpenVideo: (url: string, title: string) => void;
  isTeacherView?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const titre = seance.titre || `Séance ${index + 1}`;
  const sous = seance.sous || "Théorie & Replay interactif";
  const videoUrl = seance.video || "";
  const supportUrl = seance.support || "";
  const hasVideo = Boolean(videoUrl && videoUrl.trim() !== "");
  const hasSupport = Boolean(supportUrl && supportUrl.trim() !== "");

  // Héritage intelligent de la miniature de la vidéo (Miniature perso -> YouTube maxres -> YouTube hq -> YouTube mq)
  const thumbnailCandidates = useMemo(() => {
    const list: string[] = [];
    if (seance.thumbnail && seance.thumbnail.trim()) {
      list.push(seance.thumbnail.trim());
    }
    if (videoUrl) {
      const ytCandidates = getYoutubeThumbnailCandidates(videoUrl);
      list.push(...ytCandidates);
    }
    return list;
  }, [seance.thumbnail, videoUrl]);

  const [thumbIdx, setThumbIdx] = useState(0);
  const [thumbFailed, setThumbFailed] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(false);

  const handleThumbError = () => {
    if (thumbIdx + 1 < thumbnailCandidates.length) {
      setThumbIdx((prev) => prev + 1);
    } else {
      setThumbFailed(true);
    }
  };

  const hasValidThumb = thumbnailCandidates.length > 0 && !thumbFailed;

  return (
    <article className="group relative bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-purple-300 dark:hover:border-purple-500/40 transition-all flex flex-col justify-between">
      {/* Boutons d'édition & suppression enseignant */}
      {isTeacherView && (
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 rounded-lg bg-purple-700/90 hover:bg-purple-800 text-white shadow-xs transition-all cursor-pointer"
              title="Modifier le lien vidéo ou le support PDF"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Supprimer la séance "${titre}" ?`)) onDelete();
              }}
              className="p-1.5 rounded-lg bg-red-600/90 hover:bg-red-700 text-white shadow-xs transition-all cursor-pointer"
              title="Supprimer cette séance"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Vignette Vidéo / Support avec Héritage Miniature */}
      {hasVideo ? (
        <div
          className="relative w-full aspect-video bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden cursor-pointer select-none"
          onClick={() => onOpenVideo(videoUrl, `${titre} — ${chapTitre}`)}
          title={`Regarder : ${titre}`}
        >
          {hasValidThumb ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={thumbnailCandidates[thumbIdx]}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
                thumbLoaded ? "opacity-100" : "opacity-0"
              }`}
              src={thumbnailCandidates[thumbIdx]}
              alt={titre}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              loading="lazy"
              onLoad={() => setThumbLoaded(true)}
              onError={handleThumbError}
            />
          ) : (
            /* Fallback Visuel Haute Qualité CPGE (Zéro icône cassée) */
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a1024] via-[#121b36] to-[#1c1236] flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-2 shadow-inner">
                <Atom className="w-6 h-6 animate-pulse text-purple-400" />
              </div>
              <span className="text-xs font-bold text-white line-clamp-1 max-w-[85%] drop-shadow-xs">
                {titre}
              </span>
              <span className="text-[10px] text-purple-300/90 font-mono mt-0.5">
                Replay HD · Physique-Chimie CPGE
              </span>
            </div>
          )}

          {/* Calque Sombre & Badge & Bouton Play */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-between p-2.5 sm:p-3 pointer-events-none">
            <span className="self-end inline-flex items-center gap-1 text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow-xs">
              <Lock className="w-2.5 h-2.5" />
              ESPACE MEMBRE
            </span>
            <div className="self-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-red-600/90 group-hover:bg-red-600 group-hover:scale-110 flex items-center justify-center text-white shadow-xl shadow-red-950/50 transition-all">
              <PlayCircle className="w-7 h-7" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-white/90 font-medium">
              <span className="truncate max-w-[75%] drop-shadow-xs">{chapTitre}</span>
              <span className="bg-black/60 px-1.5 py-0.5 rounded font-mono text-[9px] text-purple-200">Replay 4K</span>
            </div>
          </div>
        </div>
      ) : hasSupport ? (
        <div
          className="relative w-full aspect-video bg-gradient-to-br from-indigo-900 to-purple-950 flex flex-col items-center justify-center p-3 cursor-pointer text-indigo-100"
          onClick={() => onOpenPdf(supportUrl, `Support : ${titre} — ${chapTitre}`)}
        >
          <FileText className="w-7 h-7 mb-1 opacity-90 text-indigo-300" />
          <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-100">
            Support de Cours PDF
          </span>
        </div>
      ) : null}

      {/* Informations de la séance */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
            {titre}
          </h4>
          {sous && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
              {sous}
            </p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          {hasSupport && (
            <button
              type="button"
              onClick={() => onOpenPdf(supportUrl, `Support : ${titre} — ${chapTitre}`)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-500/30 transition-colors cursor-pointer"
            >
              <FileText className="w-3 h-3" />
              <span>Support PDF</span>
            </button>
          )}

          {hasVideo && (
            <button
              type="button"
              onClick={() => onOpenVideo(videoUrl, `${titre} — ${chapTitre}`)}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer ml-auto shadow-2xs"
            >
              <PlayCircle className="w-3 h-3" />
              <span>Regarder</span>
              <Lock className="w-2.5 h-2.5 ml-0.5 opacity-80" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// ── 2. Carte Fiche de Synthèse (Colonne Droite) ──
function CourseFicheCard({
  fiche,
  chapTitre,
  onOpenPdf,
  isTeacherView,
  onEdit,
  onDelete,
}: {
  fiche: CourseFiche;
  chapTitre: string;
  onOpenPdf: (url: string, title: string) => void;
  isTeacherView?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const { titre, sous, url, thumbnail } = fiche;
  const isActif = Boolean(url && url.trim() !== "");

  const srcs = useMemo(() => {
    if (thumbnail) return getDriveImageUrls(thumbnail);
    if (url && extractDriveFileId(url)) return getDriveImageUrls(url);
    return [];
  }, [thumbnail, url]);

  const [imgIdx, setImgIdx] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleImgError = () => {
    if (imgIdx + 1 < srcs.length) setImgIdx((p) => p + 1);
    else setImgFailed(true);
  };

  return (
    <article
      className="group relative bg-white dark:bg-[#090d18] border border-amber-200/80 dark:border-slate-800 rounded-xl p-2.5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500/40 transition-all cursor-pointer"
      onClick={() => isActif && onOpenPdf(url, `${titre} — ${chapTitre}`)}
    >
      {/* Boutons d'édition & suppression enseignant */}
      {isTeacherView && (
        <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1 rounded-md bg-amber-600/90 hover:bg-amber-700 text-white shadow-xs transition-all cursor-pointer"
              title="Modifier cette fiche (titre, lien PDF Drive)"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Supprimer la fiche "${titre}" ?`)) onDelete();
              }}
              className="p-1 rounded-md bg-red-600/90 hover:bg-red-700 text-white shadow-xs transition-all cursor-pointer"
              title="Supprimer cette fiche"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Mini aperçu du document style A4 / feuille */}
      <div className="relative w-full aspect-[4/5] bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center p-1.5 mb-2">
        {srcs.length > 0 && !imgFailed ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className={`w-full h-full object-cover rounded shadow-2xs transition-opacity duration-300 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            src={srcs[imgIdx]}
            alt=""
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={handleImgError}
          />
        ) : (
          <div className="text-center p-2 text-amber-700 dark:text-amber-400">
            <FileText className="w-8 h-8 mx-auto mb-1 opacity-70" />
            <span className="text-[9px] font-bold uppercase tracking-wider block">Fiche Synthèse</span>
          </div>
        )}
      </div>

      {/* Titre & Sous-titre */}
      <div>
        <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
          {titre}
        </h5>
        {sous && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
            {sous}
          </p>
        )}
      </div>
    </article>
  );
}

// ── 3. Ligne TD & Devoirs Libres (En bas, Pleine Largeur) ──
function CourseExerciseLine({
  item,
  index,
  chapTitre,
  onOpenPdf,
  onOpenVideo,
  isTeacherView,
  onDelete,
}: {
  item: CourseExercise;
  index: number;
  chapTitre: string;
  onOpenPdf: (url: string, title: string) => void;
  onOpenVideo: (url: string, title: string) => void;
  isTeacherView?: boolean;
  onDelete?: () => void;
}) {
  const titre = item.titre || `Exercice ${index + 1}`;
  const sous = item.sous || "";
  const enonceUrl = item.enonce || "";
  const videoUrl = item.video || "";

  // Support de multiples corrigés rédigés / vidéos
  const corrigesList: CorrigeItem[] = useMemo(() => {
    if (item.corriges && item.corriges.length > 0) {
      return item.corriges.filter((c: CorrigeItem) => c.url && c.url.trim() !== "");
    }
    if (item.correction && item.correction.trim() !== "") {
      return [
        {
          id: "corr-legacy",
          titre: "Corrigé PDF",
          url: item.correction,
          type: "pdf" as const,
        },
      ];
    }
    return [];
  }, [item.corriges, item.correction]);

  return (
    <div className="bg-white dark:bg-[#0d1322] rounded-xl border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 hover:border-purple-300 dark:hover:border-purple-500/40 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Côté Gauche : Icône cahier + Titre + Sous-titre plein format */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20">
          <BookOpen className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white leading-snug">
            {titre}
          </h4>
          {sous && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {sous}
            </p>
          )}
        </div>
      </div>

      {/* Côté Droit : Boutons Énoncé, Corrigés Multiples & Vidéo */}
      <div className="flex items-center flex-wrap gap-2 shrink-0 self-end md:self-auto">
        {enonceUrl && (
          <button
            type="button"
            onClick={() => onOpenPdf(enonceUrl, `Énoncé : ${titre} — ${chapTitre}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Énoncé</span>
          </button>
        )}

        {/* Corrigés multiples */}
        {corrigesList.map((corr: CorrigeItem, cIdx: number) => (
          <button
            key={corr.id || cIdx}
            type="button"
            onClick={() =>
              corr.type === "video"
                ? onOpenVideo(corr.url, `${corr.titre} : ${titre} — ${chapTitre}`)
                : onOpenPdf(corr.url, `${corr.titre} : ${titre} — ${chapTitre}`)
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-500/30 transition-colors cursor-pointer shadow-2xs"
            title={corr.titre}
          >
            {corr.type === "video" ? (
              <PlayCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            )}
            <span>
              {corr.titre || (corrigesList.length > 1 ? `Corrigé ${cIdx + 1}` : "Correction")}
            </span>
            <Lock className="w-2.5 h-2.5 opacity-60 ml-0.5" />
          </button>
        ))}

        {videoUrl && (
          <button
            type="button"
            onClick={() => onOpenVideo(videoUrl, `Vidéo : ${titre} — ${chapTitre}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shadow-2xs"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Vidéo</span>
            <Lock className="w-2.5 h-2.5 ml-0.5 opacity-80" />
          </button>
        )}

        {/* Suppression en mode enseignant */}
        {isTeacherView && onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Supprimer le TD "${titre}" ?`)) onDelete();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer ml-1"
            title="Supprimer ce TD"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function CoursesWidget({
  onOpenPdf,
  onOpenVideo,
  initialNiveau,
  onSelectNiveau,
}: CoursesWidgetProps) {
  const {
    courses,
    createSession,
    updateSession,
    deleteSession,
    removeVideo,
    reorderVideos,
    restoreVideos,
    transferVideo,
    createExercise,
    deleteExercise,
    createFiche,
    updateFiche,
    deleteFiche,
    createChapter,
    removeChapter,
    createModule,
    editModule,
    removeModule,
  } = useCourses();

  const { isTeacher, isAdmin, teacherViewMode, toggleTeacherViewMode } = useAuth();
  const isTeacherView = (isTeacher || isAdmin) && teacherViewMode === "teacher";

  // État et gestionnaires pour le Drag & Drop et réordonnancement des vidéos
  const [draggedVideo, setDraggedVideo] = useState<{
    moduleId: string;
    chapterId: string;
    videoId: string;
    isConcours: boolean;
    videoItem: ChapterVideoItem;
  } | null>(null);

  const [dragOverVideo, setDragOverVideo] = useState<{
    chapterId: string;
    videoId?: string;
    isConcours: boolean;
    isChapterDropZone?: boolean;
  } | null>(null);

  // Toast de confirmation et notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Modal interactif de transfert de vidéo vers un autre module / chapitre
  const [transferModalData, setTransferModalData] = useState<{
    video: ChapterVideoItem;
    sourceChapter: ChapitreItem & { moduleId?: string; moduleTitre?: string };
    isConcours: boolean;
  } | null>(null);

  const [transferTargetModuleId, setTransferTargetModuleId] = useState<string>("");
  const [transferTargetChapterId, setTransferTargetChapterId] = useState<string>("");
  const [transferTargetSection, setTransferTargetSection] = useState<"cours" | "concours">("cours");
  const [transferPosition, setTransferPosition] = useState<"start" | "end">("end");

  const openTransferModal = (
    video: ChapterVideoItem,
    sourceChapter: ChapitreItem & { moduleId?: string; moduleTitre?: string },
    isConcours: boolean
  ) => {
    const allMods = courses && courses.length > 0 ? courses : PC_COURSES_DATA;
    const srcModId = sourceChapter.moduleId || allMods[0]?.id || "";
    setTransferModalData({ video, sourceChapter, isConcours });
    setTransferTargetModuleId(srcModId);
    const targetMod = allMods.find((m) => m.id === srcModId) || allMods[0];
    const otherChap = targetMod?.chapitres.find((c) => c.id !== sourceChapter.id) || targetMod?.chapitres[0];
    setTransferTargetChapterId(otherChap?.id || "");
    setTransferTargetSection(isConcours ? "concours" : "cours");
    setTransferPosition("end");
  };

  const handleTransferModuleChange = (modId: string) => {
    setTransferTargetModuleId(modId);
    const allMods = courses && courses.length > 0 ? courses : PC_COURSES_DATA;
    const mod = allMods.find((m) => m.id === modId);
    if (mod && mod.chapitres.length > 0) {
      const otherChap = mod.chapitres.find((c) => c.id !== transferModalData?.sourceChapter.id) || mod.chapitres[0];
      setTransferTargetChapterId(otherChap.id);
    } else {
      setTransferTargetChapterId("");
    }
  };

  const handleConfirmTransfer = () => {
    if (!transferModalData || !transferTargetChapterId) return;
    const { video, sourceChapter, isConcours } = transferModalData;
    const allMods = courses && courses.length > 0 ? courses : PC_COURSES_DATA;
    const success = transferVideo(
      sourceChapter.moduleId || activeModule,
      sourceChapter.id,
      transferTargetModuleId,
      transferTargetChapterId,
      {
        id: video.id,
        titre: video.titre,
        sous: video.sous,
        video: video.video,
        support: video.support,
        thumbnail: video.thumbnail,
        isCustom: video.isCustom,
        badge: video.badge,
      },
      transferPosition,
      transferTargetSection === "concours",
      isConcours
    );
    if (success) {
      const targetMod = allMods.find((m) => m.id === transferTargetModuleId);
      const targetChap = targetMod?.chapitres.find((c) => c.id === transferTargetChapterId);
      setToastMessage(`✓ Vidéo transférée vers « ${targetChap?.titre || "le chapitre cible"} » avec succès !`);
      setOpenChapterIds((prev) => new Set([...Array.from(prev), transferTargetChapterId]));
    }
    setTransferModalData(null);
  };

  const handleDragStart = (
    moduleId: string,
    chapterId: string,
    videoId: string,
    isConcours: boolean,
    videoItem: ChapterVideoItem,
    e: React.DragEvent
  ) => {
    e.dataTransfer.setData("text/plain", videoId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedVideo({ moduleId, chapterId, videoId, isConcours, videoItem });
  };

  const handleDragOver = (
    chapterId: string,
    videoId: string | undefined,
    isConcours: boolean,
    e: React.DragEvent,
    isChapterDropZone: boolean = false
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (
      dragOverVideo?.chapterId !== chapterId ||
      dragOverVideo?.videoId !== videoId ||
      dragOverVideo?.isConcours !== isConcours ||
      dragOverVideo?.isChapterDropZone !== isChapterDropZone
    ) {
      setDragOverVideo({ chapterId, videoId, isConcours, isChapterDropZone });
    }
  };

  const handleDragEnd = () => {
    setDraggedVideo(null);
    setDragOverVideo(null);
  };

  const handleDrop = (chapter: ChapitreItem, targetVideoId: string, isConcours: boolean) => {
    if (!draggedVideo) {
      setDraggedVideo(null);
      setDragOverVideo(null);
      return;
    }

    if (draggedVideo.chapterId === chapter.id && draggedVideo.isConcours === isConcours) {
      if (draggedVideo.videoId === targetVideoId) {
        setDraggedVideo(null);
        setDragOverVideo(null);
        return;
      }
      const currentVideos = isConcours
        ? getChapterConcoursVideos(chapter, selectedFiliere)
        : getChapterCourseVideos(chapter, selectedFiliere);
      const ids = currentVideos.map((v) => v.id);
      const fromIndex = ids.indexOf(draggedVideo.videoId);
      const toIndex = ids.indexOf(targetVideoId);
      if (fromIndex !== -1 && toIndex !== -1) {
        const newOrder = [...ids];
        const [moved] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, moved);
        reorderVideos(chapter.moduleId || activeModule, chapter.id, newOrder, isConcours);
      }
    } else {
      // Transfert cross-chapitre ou cross-section par Drag & Drop
      const currentVideos = isConcours
        ? getChapterConcoursVideos(chapter, selectedFiliere)
        : getChapterCourseVideos(chapter, selectedFiliere);
      const toIndex = targetVideoId ? currentVideos.findIndex((v) => v.id === targetVideoId) : -1;
      const insertPosition = toIndex !== -1 ? toIndex : "end";

      transferVideo(
        draggedVideo.moduleId,
        draggedVideo.chapterId,
        chapter.moduleId || activeModule,
        chapter.id,
        {
          id: draggedVideo.videoId,
          titre: draggedVideo.videoItem.titre,
          sous: draggedVideo.videoItem.sous,
          video: draggedVideo.videoItem.video,
          support: draggedVideo.videoItem.support,
          thumbnail: draggedVideo.videoItem.thumbnail,
          isCustom: draggedVideo.videoItem.isCustom,
          badge: draggedVideo.videoItem.badge,
        },
        insertPosition,
        isConcours,
        draggedVideo.isConcours
      );
      setOpenChapterIds((prev) => new Set([...Array.from(prev), chapter.id]));
      setToastMessage(`✓ Vidéo « ${draggedVideo.videoItem.titre} » transférée vers « ${chapter.titre} » avec succès !`);
    }
    setDraggedVideo(null);
    setDragOverVideo(null);
  };

  const handleDropOnChapter = (chapter: ChapitreItem, targetIsConcours: boolean = false) => {
    if (!draggedVideo) return;
    if (draggedVideo.chapterId === chapter.id && draggedVideo.isConcours === targetIsConcours) {
      setDraggedVideo(null);
      setDragOverVideo(null);
      return;
    }
    transferVideo(
      draggedVideo.moduleId,
      draggedVideo.chapterId,
      chapter.moduleId || activeModule,
      chapter.id,
      {
        id: draggedVideo.videoId,
        titre: draggedVideo.videoItem.titre,
        sous: draggedVideo.videoItem.sous,
        video: draggedVideo.videoItem.video,
        support: draggedVideo.videoItem.support,
        thumbnail: draggedVideo.videoItem.thumbnail,
        isCustom: draggedVideo.videoItem.isCustom,
        badge: draggedVideo.videoItem.badge,
      },
      "end",
      targetIsConcours,
      draggedVideo.isConcours
    );
    setOpenChapterIds((prev) => new Set([...Array.from(prev), chapter.id]));
    setToastMessage(`✓ Vidéo « ${draggedVideo.videoItem.titre} » transférée vers « ${chapter.titre} » avec succès !`);
    setDraggedVideo(null);
    setDragOverVideo(null);
  };

  const handleMoveVideo = (chapter: ChapitreItem, videoId: string, direction: "prev" | "next", isConcours: boolean) => {
    const currentVideos = isConcours
      ? getChapterConcoursVideos(chapter, selectedFiliere)
      : getChapterCourseVideos(chapter, selectedFiliere);
    const ids = currentVideos.map((v) => v.id);
    const index = ids.indexOf(videoId);
    if (index === -1) return;
    const targetIndex = direction === "prev" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= ids.length) return;
    const newOrder = [...ids];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);
    reorderVideos(chapter.moduleId || activeModule, chapter.id, newOrder, isConcours);
  };

  const [selectedNiveau, setSelectedNiveau] = useState<"sup" | "spe" | null>(() => {
    if (initialNiveau) return initialNiveau;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const n = params.get("niveau");
      if (n === "sup" || n === "spe") return n as "sup" | "spe";
    }
    return null;
  });

  useEffect(() => {
    if (initialNiveau !== undefined) {
      setSelectedNiveau(initialNiveau);
    }
  }, [initialNiveau]);

  const handleLevelChange = (lvl: "sup" | "spe" | null) => {
    setSelectedNiveau(lvl);
    setActiveModule("all");
    if (onSelectNiveau) {
      onSelectNiveau(lvl);
    } else if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (lvl) {
        url.searchParams.set("niveau", lvl);
      } else {
        url.searchParams.delete("niveau");
      }
      window.history.pushState(null, "", url.toString());
    }
  };

  // Filière active (PSI par défaut, MP, PC, TSI, Toutes)
  const [selectedFiliere, setSelectedFiliere] = useState<FiliereCPGE | "ALL">("PSI");
  const [courseViewMode, setCourseViewMode] = useState<"chapitres" | "videotheque">("chapitres");
  const [expandedVideoChapters, setExpandedVideoChapters] = useState<Set<string>>(new Set());
  const [expandedConcoursChapters, setExpandedConcoursChapters] = useState<Set<string>>(new Set());

  const toggleExpandVideos = (chapId: string) => {
    setExpandedVideoChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapId)) next.delete(chapId);
      else next.add(chapId);
      return next;
    });
  };

  const toggleExpandConcours = (chapId: string) => {
    setExpandedConcoursChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapId)) next.delete(chapId);
      else next.add(chapId);
      return next;
    });
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [activeModule, setActiveModule] = useState<string>("all");
  const [isModuleDropdownOpen, setIsModuleDropdownOpen] = useState(false);
  const moduleDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moduleDropdownRef.current && !moduleDropdownRef.current.contains(event.target as Node)) {
        setIsModuleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCoursesData = useMemo(() => {
    const base = courses && courses.length > 0 ? courses : PC_COURSES_DATA;
    if (!selectedNiveau) return base;
    return base.filter((m) => m.niveau === selectedNiveau);
  }, [courses, selectedNiveau]);

  // Aplatir tous les chapitres avec le nom du module associé (retirer les chapitres vides sans document)
  const allChapters = useMemo(() => {
    const list: (ChapitreItem & { moduleIcon: string; moduleTitre: string; moduleId: string })[] = [];
    activeCoursesData.forEach((module) => {
      module.chapitres.forEach((ch) => {
        const hasCours = ch.cours && ch.cours.some((c) => (c.support && c.support.trim() !== "") || (c.video && c.video.trim() !== ""));
        const hasTds = ch.tds && ch.tds.some((t) => (t.enonce && t.enonce.trim() !== "") || (t.correction && t.correction.trim() !== "") || (t.corriges && t.corriges.length > 0));
        const hasFiches = ch.fiches && ch.fiches.some((f) => f.url && f.url.trim() !== "");
        const hasLegacy = Boolean(ch.ficheUrl || ch.enonceTdUrl || ch.corrigeTdUrl || ch.videoUrl);

        if (hasCours || hasTds || hasFiches || hasLegacy) {
          list.push({
            ...ch,
            moduleIcon: module.icon,
            moduleTitre: module.titre,
            moduleId: module.id,
          });
        }
      });
    });
    return list;
  }, [activeCoursesData]);

  // Informations sur le module actuellement filtré
  const currentModuleItem = useMemo(() => {
    const defaultDesc =
      selectedNiveau === "sup"
        ? "Programme complet 1ère Année (MPSI / PCSI / TSI)"
        : "Programme complet 2ème Année (MP / PSI / TSI)";

    if (activeModule === "all") {
      return {
        id: "all",
        titre: "Tous les modules",
        icon: "📚",
        count: allChapters.length,
        description: defaultDesc,
      };
    }
    const found = activeCoursesData.find((m) => m.id === activeModule);
    return found
      ? {
          id: found.id,
          titre: found.titre,
          icon: found.icon || "⚛️",
          count: found.chapitres?.length || 0,
          description: found.description || "Module CPGE",
        }
      : {
          id: "all",
          titre: "Tous les modules",
          icon: "📚",
          count: allChapters.length,
          description: defaultDesc,
        };
  }, [activeModule, activeCoursesData, allChapters.length, selectedNiveau]);

  // Par défaut : premier chapitre ouvert
  const [openChapterIds, setOpenChapterIds] = useState<Set<string>>(() => {
    if (selectedNiveau === "sup") return new Set(["elec-sup-ch1"]);
    return new Set(["elec-spe-ch1"]);
  });

  useEffect(() => {
    if (selectedNiveau === "sup") {
      setOpenChapterIds(new Set(["elec-sup-ch1"]));
    } else if (selectedNiveau === "spe") {
      setOpenChapterIds(new Set(["elec-spe-ch1"]));
    }
  }, [selectedNiveau]);

  const toggleChapter = (id: string) => {
    setOpenChapterIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Options dynamiques des modules pour les filtres
  const moduleFilterOptions = useMemo(() => {
    const options = [{ id: "all", label: "Tous les modules" }];
    activeCoursesData.forEach((m) => {
      options.push({
        id: m.id,
        label: `${m.icon || "📚"} ${m.titre}`,
      });
    });
    return options;
  }, [activeCoursesData]);

  // Filtrage par module et recherche textuelle
  const filteredChapters = useMemo(() => {
    return allChapters.filter((ch) => {
      const matchesMod = activeModule === "all" || ch.moduleId === activeModule;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        ch.titre.toLowerCase().includes(q) ||
        ch.description.toLowerCase().includes(q) ||
        ch.moduleTitre.toLowerCase().includes(q) ||
        String(ch.num).includes(q);
      return matchesMod && matchesSearch;
    });
  }, [allChapters, activeModule, searchQuery]);

  // ══════════════════════════════════════════════════════════════════════════
  // MODALS D'AJOUT DIRECT PAR L'ENSEIGNANT SUR LA PAGE
  // ══════════════════════════════════════════════════════════════════════════
  const [activeModal, setActiveModal] = useState<
    "session" | "edit_session" | "exercise" | "fiche" | "edit_fiche" | "chapter" | "create_module" | "edit_module" | null
  >(null);
  const [targetChapter, setTargetChapter] = useState<{ moduleId: string; chapterId: string; chapterTitle: string } | null>(null);

  // Formulaire modal Créer / Modifier Module
  const [newModTitle, setNewModTitle] = useState("");
  const [newModIcon, setNewModIcon] = useState("⚡");
  const [newModDesc, setNewModDesc] = useState("");
  const [editingModData, setEditingModData] = useState<{ id: string; titre: string; icon: string; description: string } | null>(null);

  // Formulaire modal Séance
  const [newSessTitle, setNewSessTitle] = useState("");
  const [newSessSous, setNewSessSous] = useState("Séance théorique & Replay interactif");
  const [newSessVideo, setNewSessVideo] = useState("");
  const [newSessSupport, setNewSessSupport] = useState("");

  // État Édition Séance Enseignant
  const [editingSession, setEditingSession] = useState<{
    moduleId: string;
    chapterId: string;
    chapterTitle: string;
    sessionId: string;
    titre: string;
    sous: string;
    video: string;
    support: string;
  } | null>(null);

  // État Édition Fiche Enseignant
  const [editingFiche, setEditingFiche] = useState<{
    moduleId: string;
    chapterId: string;
    chapterTitle: string;
    ficheId: string;
    titre: string;
    sous: string;
    url: string;
  } | null>(null);

  // Formulaire modal TD
  const [newTdTitle, setNewTdTitle] = useState("");
  const [newTdSous, setNewTdSous] = useState("Exercices d'application concours");
  const [newTdEnonce, setNewTdEnonce] = useState("");
  const [newTdVideo, setNewTdVideo] = useState("");
  const [newTdCorriges, setNewTdCorriges] = useState<Array<{ titre: string; url: string }>>([
    { titre: "Corrigé officiel rédigé", url: "" },
  ]);

  // Formulaire modal Fiche
  const [newFicheTitle, setNewFicheTitle] = useState("");
  const [newFicheSous, setNewFicheSous] = useState("L'essentiel du chapitre & Formulaire");
  const [newFicheUrl, setNewFicheUrl] = useState("");

  // Formulaire modal Chapitre
  const [newChTitle, setNewChTitle] = useState("");
  const [newChDesc, setNewChDesc] = useState("");
  const [newChBadge, setNewChBadge] = useState("Spé MP / PSI / TSI");
  const [newChModuleId, setNewChModuleId] = useState(activeCoursesData[0]?.id || "em");

  const openAddSession = (ch: { moduleId: string; id: string; titre: string }) => {
    setTargetChapter({ moduleId: ch.moduleId, chapterId: ch.id, chapterTitle: ch.titre });
    setNewSessTitle("");
    setNewSessVideo("");
    setNewSessSupport("");
    setActiveModal("session");
  };

  const openEditSession = (ch: { moduleId: string; id: string; titre: string }, se: CourseSession) => {
    setEditingSession({
      moduleId: ch.moduleId,
      chapterId: ch.id,
      chapterTitle: ch.titre,
      sessionId: se.id || "",
      titre: se.titre || "",
      sous: se.sous || "",
      video: se.video || "",
      support: se.support || "",
    });
    setActiveModal("edit_session");
  };

  const handleSaveEditSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession || !editingSession.titre.trim()) return;
    updateSession(editingSession.moduleId, editingSession.chapterId, editingSession.sessionId, {
      titre: editingSession.titre.trim(),
      sous: editingSession.sous.trim(),
      videoUrl: editingSession.video.trim(),
      supportUrl: editingSession.support.trim(),
    });
    setActiveModal(null);
    setEditingSession(null);
  };

  const openAddExercise = (ch: { moduleId: string; id: string; titre: string }) => {
    setTargetChapter({ moduleId: ch.moduleId, chapterId: ch.id, chapterTitle: ch.titre });
    setNewTdTitle("");
    setNewTdEnonce("");
    setNewTdVideo("");
    setNewTdCorriges([{ titre: "Corrigé officiel rédigé", url: "" }]);
    setActiveModal("exercise");
  };

  const openAddFiche = (ch: { moduleId: string; id: string; titre: string }) => {
    setTargetChapter({ moduleId: ch.moduleId, chapterId: ch.id, chapterTitle: ch.titre });
    setNewFicheTitle("");
    setNewFicheUrl("");
    setActiveModal("fiche");
  };

  const openEditFiche = (ch: { moduleId: string; id: string; titre: string }, f: CourseFiche) => {
    setEditingFiche({
      moduleId: ch.moduleId,
      chapterId: ch.id,
      chapterTitle: ch.titre,
      ficheId: f.id || f.titre,
      titre: f.titre || "",
      sous: f.sous || "",
      url: f.url || "",
    });
    setActiveModal("edit_fiche");
  };

  const handleSaveEditFiche = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFiche || !editingFiche.titre.trim()) return;
    updateFiche(editingFiche.moduleId, editingFiche.chapterId, editingFiche.ficheId, {
      titre: editingFiche.titre.trim(),
      sous: editingFiche.sous.trim(),
      url: editingFiche.url.trim(),
    });
    setActiveModal(null);
    setEditingFiche(null);
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetChapter || !newSessTitle.trim()) return;
    createSession(targetChapter.moduleId, targetChapter.chapterId, {
      titre: newSessTitle.trim(),
      sous: newSessSous.trim(),
      videoUrl: newSessVideo.trim() || undefined,
      supportUrl: newSessSupport.trim() || undefined,
    });
    setActiveModal(null);
  };

  const handleSaveExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetChapter || !newTdTitle.trim()) return;
    createExercise(targetChapter.moduleId, targetChapter.chapterId, {
      titre: newTdTitle.trim(),
      sous: newTdSous.trim(),
      enonceUrl: newTdEnonce.trim() || undefined,
      corriges: newTdCorriges
        .filter((c) => c.url.trim() !== "")
        .map((c) => ({ titre: c.titre.trim(), url: c.url.trim(), type: "pdf" })),
      videoUrl: newTdVideo.trim() || undefined,
    });
    setActiveModal(null);
  };

  const handleSaveFiche = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetChapter || !newFicheTitle.trim() || !newFicheUrl.trim()) return;
    createFiche(targetChapter.moduleId, targetChapter.chapterId, {
      titre: newFicheTitle.trim(),
      sous: newFicheSous.trim(),
      drivePdfUrl: newFicheUrl.trim(),
    });
    setActiveModal(null);
  };

  const handleSaveChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChTitle.trim()) return;
    createChapter(newChModuleId, {
      titre: newChTitle.trim(),
      description: newChDesc.trim(),
      badge: newChBadge.trim(),
    });
    setActiveModal(null);
    setNewChTitle("");
    setNewChDesc("");
  };

  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModTitle.trim()) return;
    const created = createModule({
      titre: newModTitle.trim(),
      icon: newModIcon.trim() || "⚡",
      description: newModDesc.trim() || "Module de cours CPGE",
    });
    if (created) {
      setActiveModule("all");
    }
    setActiveModal(null);
    setNewModTitle("");
    setNewModDesc("");
  };

  const handleUpdateModuleInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModData || !editingModData.titre.trim()) return;
    editModule(editingModData.id, {
      titre: editingModData.titre.trim(),
      icon: editingModData.icon.trim() || "⚡",
      description: editingModData.description.trim(),
    });
    setActiveModal(null);
    setEditingModData(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-4 font-sans">
      {/* Bandeau Mode Édition Enseignant & Administrateur */}
      {(isTeacher || isAdmin) && (
        <div className="mb-6 p-4 rounded-2xl bg-purple-950/60 border border-purple-500/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${isTeacherView ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-purple-200 uppercase tracking-wider">
                  {isTeacherView ? "Mode Édition Administrateur Actif" : "Aperçu : Vue Étudiant"}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/80 text-purple-200 border border-purple-400/30">
                  Pleins Droits de Modification
                </span>
              </div>
              <p className="text-[11px] text-purple-300/80">
                {isTeacherView
                  ? "Drag & Drop actif pour réordonner les vidéos · Retrait et modification autorisés sur toutes les vidéos"
                  : "Vous visualisez l'espace exactement tel que le voient vos étudiants"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={toggleTeacherViewMode}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isTeacherView
                  ? "bg-slate-800 hover:bg-slate-700 text-purple-200 border-purple-500/40"
                  : "bg-purple-600 hover:bg-purple-500 text-white border-purple-400 shadow-purple-600/30"
              }`}
              title={isTeacherView ? "Passer en vue étudiant" : "Activer les outils de modification"}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isTeacherView ? "Aperçu Étudiant" : "Activer Mode Éditeur"}</span>
            </button>

            {isTeacherView && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setNewModTitle("");
                    setNewModIcon("⚡");
                    setNewModDesc("");
                    setActiveModal("create_module");
                  }}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-700 hover:bg-purple-600 text-white flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Nouveau Module</span>
                </button>

                {activeModule !== "all" && (
                  <button
                    type="button"
                    onClick={() => {
                      const currentMod = activeCoursesData.find((m) => m.id === activeModule);
                      if (currentMod) {
                        setEditingModData({
                          id: currentMod.id,
                          titre: currentMod.titre,
                          icon: currentMod.icon || "📚",
                          description: currentMod.description || "",
                        });
                        setActiveModal("edit_module");
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/40 flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    title="Modifier le titre et l'émoticône de ce module"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>✏️ Modifier ce Module</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveModal("chapter")}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Chapitre</span>
                </button>
              </>
            )}

            <Link
              href="/dashboard-prof"
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Dashboard Prof</span>
            </Link>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* CAS 1 : PAS DE NIVEAU SÉLECTIONNÉ => AFFICHAGE DES 2 CARTES 3D    */}
      {/* ================================================================= */}
      {selectedNiveau === null ? (
        <div className="space-y-8 animate-fadeIn">
          {/* En-tête Prestigieux du Portail Cours */}
          <div className="relative rounded-3xl bg-white/70 dark:bg-[#0d1322]/80 backdrop-blur-2xl border border-white/80 dark:border-purple-500/25 shadow-[0_20px_50px_rgba(124,58,237,0.06),0_1px_2px_rgba(255,255,255,0.95)_inset] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 sm:p-10 text-center overflow-hidden">
            <div className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full bg-purple-300/30 dark:bg-purple-900/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-indigo-300/25 dark:bg-indigo-900/20 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-white/60 dark:bg-purple-950/20 blur-2xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white dark:via-purple-400/30 to-transparent" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-purple-800 dark:text-purple-300 bg-white/85 dark:bg-purple-950/60 backdrop-blur-md border border-purple-200/90 dark:border-purple-500/30 px-3.5 sm:px-4 py-1.5 rounded-full mb-3 sm:mb-4 shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                Pôle d'Excellence Physique-Chimie CPGE
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-2.5 sm:mb-3 tracking-tight">
                Cours & <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 dark:from-purple-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">Travaux Dirigés</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                Veuillez sélectionner votre promotion ci-dessous pour accéder directement aux polycopiés complets, fiches de synthèse, séries de TD avec corrigés rédigés et séances vidéo adaptés à votre programme officiel.
              </p>
            </div>
          </div>

          {/* Les Deux Cartes : 1ère Année SUP (MPSI/PCSI/TSI) & 2ème Année SPÉ (MP/PSI/TSI) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* ── CARTE 1 : SUP (MPSI / PCSI / TSI) ── */}
            <div
              onClick={() => handleLevelChange("sup")}
              className="group relative cursor-pointer rounded-3xl bg-white/80 dark:bg-[#0c101e]/85 backdrop-blur-xl border border-slate-200/90 dark:border-purple-500/30 hover:border-purple-500/70 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_rgba(124,58,237,0.18)] hover:-translate-y-1.5 overflow-hidden text-left"
            >
              {/* Effet Halo Décoratif */}
              <div className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full bg-purple-400/15 dark:bg-purple-600/15 blur-3xl group-hover:bg-purple-400/25 transition-all" />

              <div>
                {/* Badge promotion */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                    <span>⚛️</span>
                    <span>1ère Année CPGE · SUP (MPSI / PCSI / TSI)</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                    5 Modules · 22 Chapitres
                  </span>
                </div>

                {/* Titre & Sous-titre */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-purple-500/30 shrink-0 group-hover:scale-110 transition-transform">
                    ⚛️
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      MPSI / PCSI / TSI
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-400">
                      Fondements & Consolidation Méthodologique
                    </p>
                  </div>
                </div>

                {/* Description du programme */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-medium">
                  Programme officiel de Sup : Électronique dans l&apos;ARQS, Thermodynamique, Mécanique du Point, Optique Géométrique, Électrostatique & Magnétostatique.
                </p>

                {/* Points forts */}
                <ul className="space-y-2.5 mb-6 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Polycopiés de cours officiels rédigés par Pr. H. Eddams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Séries de TD complètes avec corrigés rédigés détaillés</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Fiches méthodologiques & formulaires synthétiques CPGE</span>
                  </li>
                </ul>
              </div>

              {/* Bouton d'entrée */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center justify-center gap-2 shadow-md shadow-purple-600/25 transition-all group-hover:gap-3 cursor-pointer"
                >
                  <span>Accéder aux cours MPSI / PCSI / TSI</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* ── CARTE 2 : SPÉ (MP / PSI / TSI) ── */}
            <div
              onClick={() => handleLevelChange("spe")}
              className="group relative cursor-pointer rounded-3xl bg-white/80 dark:bg-[#0c101e]/85 backdrop-blur-xl border border-slate-200/90 dark:border-purple-500/30 hover:border-indigo-500/70 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_rgba(99,102,241,0.18)] hover:-translate-y-1.5 overflow-hidden text-left"
            >
              {/* Effet Halo Décoratif */}
              <div className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full bg-indigo-400/15 dark:bg-indigo-600/15 blur-3xl group-hover:bg-indigo-400/25 transition-all" />

              <div>
                {/* Badge promotion */}
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                    <span>⚡</span>
                    <span>2ème Année CPGE · SPÉ (MP / PSI / TSI)</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                    6 Modules · Séances & Vidéos
                  </span>
                </div>

                {/* Titre & Sous-titre */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-indigo-500/30 shrink-0 group-hover:scale-110 transition-transform">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      MP / PSI / TSI
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-400">
                      Approfondissement & Préparation Concours
                    </p>
                  </div>
                </div>

                {/* Description du programme */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-medium">
                  Programme officiel de Spé : Électronique & Numérisation, Électromagnétisme & Ondes, Thermodynamique & Diffusion, Optique Ondulatoire, Physique Quantique.
                </p>

                {/* Points forts */}
                <ul className="space-y-2.5 mb-6 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Séances de cours interactives avec Replays Vidéo HD</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Polycopiés de cours officiels rédigés par Pr. H. Eddams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Préparation ciblée aux concours : CNC, CCINP, Mines, Centrale, X-ENS</span>
                  </li>
                </ul>
              </div>

              {/* Bouton d'entrée */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 transition-all group-hover:gap-3 cursor-pointer"
                >
                  <span>Accéder aux cours MP / PSI / TSI</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================================================================= */
        /* CAS 2 : NIVEAU SÉLECTIONNÉ (SUP OU SPÉ) => COURS, TDS, FICHES     */
        /* ================================================================= */
        <div className="space-y-6 animate-fadeIn">
          {/* Barre de Bascule & Navigation Sup / Spé */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/80 dark:bg-[#0d1322]/80 backdrop-blur-xl border border-slate-200/90 dark:border-purple-500/25 shadow-xs">
            <button
              type="button"
              onClick={() => handleLevelChange(null)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Changer de promotion (Sup / Spé)</span>
            </button>

            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleLevelChange("sup")}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedNiveau === "sup"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>⚛️</span>
                <span>MPSI / PCSI / TSI (Sup)</span>
              </button>
              <button
                type="button"
                onClick={() => handleLevelChange("spe")}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  selectedNiveau === "spe"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>⚡</span>
                <span>MP / PSI / TSI (Spé)</span>
              </button>
            </div>
          </div>

          {/* 1. En-tête Prestigieux Lumineux Dynamique */}
          <div className="relative rounded-3xl bg-white/70 dark:bg-[#0d1322]/80 backdrop-blur-2xl border border-white/80 dark:border-purple-500/25 shadow-[0_20px_50px_rgba(124,58,237,0.06),0_1px_2px_rgba(255,255,255,0.95)_inset] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 sm:p-10 text-center overflow-hidden">
            <div className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full bg-purple-300/30 dark:bg-purple-900/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-indigo-300/25 dark:bg-indigo-900/20 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-white/60 dark:bg-purple-950/20 blur-2xl" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white dark:via-purple-400/30 to-transparent" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-purple-800 dark:text-purple-300 bg-white/85 dark:bg-purple-950/60 backdrop-blur-md border border-purple-200/90 dark:border-purple-500/30 px-3.5 sm:px-4 py-1.5 rounded-full mb-3 sm:mb-4 shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                {selectedNiveau === "sup"
                  ? "Programme Physique-Chimie CPGE · 1ère Année (MPSI / PCSI / TSI)"
                  : "Programme Physique-Chimie CPGE · 2ème Année (MP / PSI / TSI)"}
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-2.5 sm:mb-3 tracking-tight">
                Cours & <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 dark:from-purple-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">Travaux Dirigés</span>
                <span className="block text-xl sm:text-2xl text-purple-600 dark:text-purple-400 mt-1 font-bold">
                  {selectedNiveau === "sup" ? "MPSI / PCSI / TSI (Sup)" : "MP / PSI / TSI (Spé)"}
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
                {selectedNiveau === "sup"
                  ? "Syllabus officiel 1ère année : polycopiés de cours officiels, fiches méthodologiques, séries de TD et corrigés détaillés rédigés par Pr. Hassan EDDAMS."
                  : "Syllabus officiel Spé : séances de cours avec replays vidéo, séries d'entraînement avec corrigés rédigés et fiches de synthèse."}
              </p>

              <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-semibold bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-purple-500/20 text-slate-700 dark:text-slate-300 shadow-2xs">
                  {selectedNiveau === "sup" ? "Syllabus MPSI / PCSI / TSI" : "Syllabus Spé MP / PSI / TSI"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-semibold bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-purple-500/20 text-slate-700 dark:text-slate-300 shadow-2xs">
                  {selectedNiveau === "sup" ? "5 Modules · 22 Chapitres" : "Séances & Fiches de Synthèse"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-semibold bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/80 dark:border-purple-500/20 text-slate-700 dark:text-slate-300 shadow-2xs">
                  {selectedNiveau === "sup" ? "TD & Corrigés Détaillés" : "Entraînement Concours"}
                </span>
              </div>
            </div>
          </div>

          {/* 1 bis. Barre de Bascule Filières CPGE (PSI / MP / PC / TSI) & Mode de Vue */}
          <div className="bg-white/90 dark:bg-[#0d1322]/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-purple-500/25 p-3.5 sm:p-4 shadow-xs mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Sélecteur de Filière */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>🎯</span>
                <span>Filière CPGE :</span>
              </span>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                {(["PSI", "MP", "PC", "TSI", "ALL"] as const).map((fil) => {
                  const isSel = selectedFiliere === fil;
                  const label = fil === "ALL" ? "Toutes filières" : fil;
                  return (
                    <button
                      key={fil}
                      type="button"
                      onClick={() => setSelectedFiliere(fil)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        isSel
                          ? "bg-purple-600 text-white shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <span className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold hidden lg:inline">
                {selectedFiliere === "PSI" && "✨ Mode PSI : Tronc commun (partagé avec MP) + Spécificités (Navier-Stokes, Poiseuille, bilans)"}
                {selectedFiliere === "MP" && "✨ Mode MP : Tronc commun + Spécificités (Physique quantique, Boltzmann)"}
                {selectedFiliere === "PC" && "✨ Mode PC : Tronc commun + Spécificités (Mécanique des fluides & Chimie)"}
                {selectedFiliere === "TSI" && "✨ Mode TSI : Programme officiel des Sciences Physiques"}
                {selectedFiliere === "ALL" && "✨ Mode Global : Toutes les filières CPGE"}
              </span>
            </div>

            {/* Bascule Vue par Chapitre vs Catalogue Vidéothèque */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 self-end md:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setCourseViewMode("chapitres")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  courseViewMode === "chapitres"
                    ? "bg-white dark:bg-purple-950 text-purple-700 dark:text-purple-200 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Vue par Chapitre (PDF + Vidéos)</span>
              </button>
              <button
                type="button"
                onClick={() => setCourseViewMode("videotheque")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  courseViewMode === "videotheque"
                    ? "bg-white dark:bg-purple-950 text-purple-700 dark:text-purple-200 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Vidéothèque Complète</span>
              </button>
            </div>
          </div>

          {courseViewMode === "videotheque" ? (
            <VideothequeWidget
              onOpenVideo={onOpenVideo}
              onOpenPdf={onOpenPdf}
              initialFiliere={selectedFiliere}
            />
          ) : (
            <>
              {/* 2. Filtres par Module & Recherche */}
      <div className="bg-white/90 dark:bg-[#0d1322]/90 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-purple-500/25 p-4 sm:p-5 shadow-xs mb-6 space-y-3.5">
        {/* Ligne 1 : Liste Déroulante des Modules + Actions Déplier/Replier */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Menu Déroulant (Liste Déroulante) Ergonomique */}
          <div className="relative flex-1" ref={moduleDropdownRef}>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-xl">
                <button
                  type="button"
                  onClick={() => setIsModuleDropdownOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-purple-500/30 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/90 dark:hover:bg-slate-900 text-slate-900 dark:text-white transition-all cursor-pointer shadow-2xs text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0 p-1 rounded-lg bg-white dark:bg-slate-800 shadow-2xs border border-slate-200 dark:border-slate-700">
                      {currentModuleItem.icon}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-purple-700 dark:text-purple-300 font-bold">
                        Module de Cours CPGE
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold truncate">
                        {currentModuleItem.titre}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                      {currentModuleItem.count} chapitres
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isModuleDropdownOpen ? "rotate-180 text-purple-600 dark:text-purple-400" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Popover de la Liste Déroulante */}
                {isModuleDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full max-h-80 overflow-y-auto rounded-2xl border border-slate-200 dark:border-purple-500/40 bg-white dark:bg-[#0c1224] p-1.5 shadow-2xl z-40 divide-y divide-slate-100 dark:divide-slate-800/80 animate-fadeIn">
                    {/* Option : Tous les modules */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModule("all");
                        setIsModuleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        activeModule === "all"
                          ? "bg-purple-600 text-white font-bold shadow-xs"
                          : "hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg shrink-0">📚</span>
                        <div className="text-left min-w-0">
                          <div className="font-bold">Tous les modules</div>
                          <div className={`text-[10px] truncate ${activeModule === "all" ? "text-purple-100" : "text-slate-400"}`}>
                            {selectedNiveau === "sup"
                              ? "Voir l'intégralité du syllabus officiel MPSI / PCSI / TSI"
                              : "Voir l'intégralité du syllabus officiel Spé MP / PSI / TSI"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                          activeModule === "all"
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        }`}>
                          {allChapters.length} chap.
                        </span>
                        {activeModule === "all" && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </button>

                    {/* Liste des modules */}
                    {activeCoursesData.map((m) => {
                      const isSelected = activeModule === m.id;
                      const chCount = m.chapitres?.length || 0;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setActiveModule(m.id);
                            setIsModuleDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-purple-600 text-white font-bold shadow-xs"
                              : "hover:bg-purple-50 dark:hover:bg-purple-950/50 text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-lg shrink-0">{m.icon || "⚛️"}</span>
                            <div className="text-left min-w-0">
                              <div className="font-bold truncate">{m.titre}</div>
                              <div className={`text-[10px] truncate max-w-sm ${isSelected ? "text-purple-100" : "text-slate-400"}`}>
                                {m.description || "Module CPGE"}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            }`}>
                              {chCount} chap.
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bouton rapide "Tous les modules" si un filtre est actif */}
              {activeModule !== "all" && (
                <button
                  type="button"
                  onClick={() => setActiveModule("all")}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  title="Réinitialiser et afficher tous les modules"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Tout afficher</span>
                </button>
              )}
            </div>
          </div>

          {/* Boutons d'action Déplier / Replier & Compteur */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60 dark:border-slate-800/80">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              <strong className="text-slate-900 dark:text-white font-bold">{filteredChapters.length}</strong> {filteredChapters.length > 1 ? "chapitres affichés" : "chapitre affiché"}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setOpenChapterIds(new Set(filteredChapters.map((c) => c.id)))}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-950/60 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer"
              >
                Tout déplier
              </button>
              <button
                type="button"
                onClick={() => setOpenChapterIds(new Set())}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-950/60 hover:text-purple-700 dark:hover:text-purple-300 transition-colors cursor-pointer"
              >
                Tout replier
              </button>
            </div>
          </div>
        </div>

        {/* Barre de Recherche */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            type="text"
            placeholder="Rechercher un chapitre, concept ou formule (ex: Maxwell, Navier-Stokes, Fourier, Pourbaix)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090d18] text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-[#0d1322] focus:border-purple-600 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-600/15 transition-all outline-hidden shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Liste des Chapitres avec la Mise en Page Exacte du Site de Référence */}
      <div className="space-y-5">
        {filteredChapters.map((chapter) => {
          const isOpen = openChapterIds.has(chapter.id);
          const seances = chapter.cours || [];
          const tds = chapter.tds || [];
          const fiches = chapter.fiches || [];
          const videoCount = seances.filter((s) => s.video && s.video.trim() !== "").length;

          return (
            <div
              key={chapter.id}
              onDragOver={(e) => {
                if (draggedVideo && draggedVideo.chapterId !== chapter.id) {
                  handleDragOver(chapter.id, undefined, false, e, true);
                }
              }}
              onDrop={(e) => {
                if (draggedVideo && draggedVideo.chapterId !== chapter.id) {
                  e.preventDefault();
                  handleDropOnChapter(chapter, draggedVideo.isConcours);
                }
              }}
              className={`bg-white dark:bg-[#0d1322] rounded-2xl border transition-all duration-200 overflow-hidden ${
                dragOverVideo?.chapterId === chapter.id && dragOverVideo.isChapterDropZone
                  ? "border-emerald-500 ring-4 ring-emerald-400/40 shadow-xl scale-[1.005]"
                  : isOpen
                  ? "border-purple-300 dark:border-purple-500/50 shadow-md dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                  : "border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {/* Header de Chapitre (Clic pour déplier/replier) */}
              <div
                onClick={() => toggleChapter(chapter.id)}
                className="flex items-center gap-4 p-5 sm:p-6 cursor-pointer select-none hover:bg-purple-50/30 dark:hover:bg-purple-950/20 transition-colors"
              >
                {/* Numéro de Chapitre dans Cercle Foncé */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-lg shrink-0 transition-all ${
                    isOpen
                      ? "bg-purple-700 text-white shadow-md shadow-purple-700/25"
                      : "bg-slate-900 dark:bg-purple-950 text-white border border-purple-200/80 dark:border-purple-500/30"
                  }`}
                >
                  {chapter.num}
                </div>

                {/* Info Chapitre : Titre + Description + Badges de contenu */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {chapter.titre}
                  </h3>
                  {chapter.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {chapter.description}
                    </p>
                  )}

                  {/* Résumé du contenu sous forme de Badges (comme dans le site de référence) */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-500/20">
                      📘 {seances.length} cours
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-500/20">
                      📑 {fiches.length} fiches
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-500/20">
                      ✍️ {tds.length} TD/DL
                    </span>
                    {videoCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-500/20">
                        🎥 {videoCount} vidéos 🔒
                      </span>
                    )}
                  </div>
                </div>

                {/* Étiquette Module à Droite & Flèche */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="hidden sm:inline-block text-xs font-bold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-500/30">
                    {chapter.moduleName || chapter.badge}
                  </span>

                  {/* Actions directes enseignant sur le chapitre */}
                  {isTeacherView && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Supprimer définitivement le chapitre "${chapter.titre}" ?`)) {
                          removeChapter(chapter.moduleId, chapter.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Supprimer ce chapitre entier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div
                    className={`w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Zone d'indication de drop pour transfert inter-chapitres */}
              {draggedVideo && draggedVideo.chapterId !== chapter.id && (
                <div
                  onDragOver={(e) => handleDragOver(chapter.id, undefined, false, e, true)}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDropOnChapter(chapter, draggedVideo.isConcours);
                  }}
                  className={`mx-5 mb-4 p-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-copy select-none ${
                    dragOverVideo?.chapterId === chapter.id && dragOverVideo.isChapterDropZone
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-300 scale-[1.01]"
                      : "bg-purple-500/10 border-purple-400/50 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20"
                  }`}
                >
                  <ArrowRightLeft className="w-4 h-4 animate-pulse text-emerald-500" />
                  <span>
                    Déposer ici pour transférer « {draggedVideo.videoItem.titre} » dans ce chapitre ({chapter.titre})
                  </span>
                </div>
              )}

              {/* Contenu Déplié : Polycopié officiel en haut, Séances de cours, Extraits de concours en parallèle, puis Fiches et TDs */}
              {isOpen && (() => {
                const chapterPdf = getChapterOfficialPdf(chapter);
                const courseVideos = getChapterCourseVideos(chapter, selectedFiliere);
                const concoursVideos = getChapterConcoursVideos(chapter, selectedFiliere);
                const isVideosExpanded = expandedVideoChapters.has(chapter.id);
                const displayedCourseVideos = isVideosExpanded ? courseVideos : courseVideos.slice(0, 6);
                const isConcoursExpanded = expandedConcoursChapters.has(chapter.id);
                const displayedConcoursVideos = isConcoursExpanded ? concoursVideos : concoursVideos.slice(0, 6);

                return (
                  <div className="border-t border-slate-100 dark:border-slate-800/80 bg-[#f8faff] dark:bg-[#090d18]/60 p-5 sm:p-7 space-y-7">
                    {/* ── 1. EN HAUT : POLYCOPIÉ DE COURS OFFICIEL (STYLE & PRÉSENTABLE) ── */}
                    <ChapterOfficialPdfBanner
                      pdf={chapterPdf}
                      chapterTitre={chapter.titre}
                      selectedFiliere={selectedFiliere}
                      onOpenPdf={onOpenPdf}
                    />

                    {/* ── 2. JUSTE EN BAS : SÉANCES & REPLAYS VIDÉO DU COURS ── */}
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                            🎬 SÉANCES DE COURS & REPLAYS VIDÉO
                          </span>
                          {selectedFiliere !== "ALL" && (
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              · Programme {selectedFiliere} (Tronc commun + Spécificités)
                            </span>
                          )}
                        </div>

                        {/* Boutons Enseignant/Admin pour ajouter directement une vidéo ou restaurer les vidéos masquées */}
                        {isTeacherView && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {chapter.hiddenVideoIds && chapter.hiddenVideoIds.length > 0 && (
                              <button
                                type="button"
                                onClick={() => restoreVideos(chapter.moduleId || activeModule, chapter.id, false)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 transition-colors cursor-pointer shadow-xs"
                                title="Rétablir les vidéos du catalogue Prépasciences masquées"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Restaurer ({chapter.hiddenVideoIds.length})</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => openAddSession(chapter)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer shadow-xs"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              <span>+ Séance / Vidéo</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {courseVideos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {displayedCourseVideos.map((vid, vIdx) => (
                            <UnifiedChapterVideoCard
                              key={vid.id || vIdx}
                              vid={vid}
                              index={vIdx}
                              totalCount={displayedCourseVideos.length}
                              chapTitre={chapter.titre}
                              onOpenPdf={onOpenPdf}
                              onOpenVideo={onOpenVideo}
                              isTeacherView={isTeacherView}
                              onEdit={
                                isTeacherView && vid.isCustom && vid.rawSession
                                  ? () => openEditSession(chapter, vid.rawSession!)
                                  : undefined
                              }
                              onDelete={
                                isTeacherView
                                  ? () => removeVideo(chapter.moduleId || activeModule, chapter.id, vid.id, false)
                                  : undefined
                              }
                              onTransfer={
                                isTeacherView
                                  ? () => openTransferModal(vid, chapter, false)
                                  : undefined
                              }
                              onMoveUp={
                                isTeacherView && vIdx > 0
                                  ? () => handleMoveVideo(chapter, vid.id, "prev", false)
                                  : undefined
                              }
                              onMoveDown={
                                isTeacherView && vIdx < displayedCourseVideos.length - 1
                                  ? () => handleMoveVideo(chapter, vid.id, "next", false)
                                  : undefined
                              }
                              onDragStart={(e) => handleDragStart(chapter.moduleId || activeModule, chapter.id, vid.id, false, vid, e)}
                              onDragOver={(e) => handleDragOver(chapter.id, vid.id, false, e)}
                              onDragEnd={handleDragEnd}
                              onDrop={() => handleDrop(chapter, vid.id, false)}
                              isDragging={
                                draggedVideo?.chapterId === chapter.id &&
                                draggedVideo?.videoId === vid.id &&
                                !draggedVideo?.isConcours
                              }
                              isDragOver={
                                dragOverVideo?.chapterId === chapter.id &&
                                dragOverVideo?.videoId === vid.id &&
                                !dragOverVideo?.isConcours
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-dashed border-purple-200/70 dark:border-purple-500/20 text-xs text-purple-900 dark:text-purple-300">
                          {selectedFiliere === "PSI" && chapter.id.includes("quantique") ? (
                            <span>
                              ℹ️ La Physique Quantique est spécifique aux filières MP et PC (hors programme pour la filière PSI).
                            </span>
                          ) : (
                            <span>Aucune séance vidéo théorique enregistrée pour ce filtre de filière.</span>
                          )}
                        </div>
                      )}

                      {courseVideos.length > 6 && (
                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={() => toggleExpandVideos(chapter.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-500/30 transition-all cursor-pointer shadow-2xs"
                          >
                            <span>
                              {isVideosExpanded
                                ? "Afficher moins"
                                : "Afficher l'intégralité des séances de cours"}
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isVideosExpanded ? "rotate-180" : ""}`} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ── 3. NOUVELLE RUBRIQUE : EXTRAITS DE CONCOURS & PROBLÈMES TYPES (TRAVAIL EN PARALLÈLE DU COURS) ── */}
                    {concoursVideos.length > 0 && (
                      <div className="space-y-3.5 pt-2">
                        <div className="flex items-center justify-between pb-2 border-b border-amber-200/80 dark:border-amber-500/30">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                              🎯 EXTRAITS DE CONCOURS & PROBLÈMES TYPES
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              · Annales écrites & Oraux X-ENS · Mines-Ponts · Centrale-Supélec · CCINP
                            </span>
                          </div>

                          {isTeacherView && chapter.hiddenConcoursVideoIds && chapter.hiddenConcoursVideoIds.length > 0 && (
                            <button
                              type="button"
                              onClick={() => restoreVideos(chapter.moduleId || activeModule, chapter.id, true)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-colors cursor-pointer shadow-xs"
                              title="Rétablir les extraits de concours masqués"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restaurer concours ({chapter.hiddenConcoursVideoIds.length})</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {displayedConcoursVideos.map((cVid, cIdx) => (
                            <ConcoursExtractCard
                              key={cVid.id || cIdx}
                              vid={cVid}
                              index={cIdx}
                              totalCount={displayedConcoursVideos.length}
                              chapTitre={chapter.titre}
                              onOpenVideo={onOpenVideo}
                              isTeacherView={isTeacherView}
                              onDelete={
                                isTeacherView
                                  ? () => removeVideo(chapter.moduleId || activeModule, chapter.id, cVid.id, true)
                                  : undefined
                              }
                              onTransfer={
                                isTeacherView
                                  ? () => openTransferModal(cVid, chapter, true)
                                  : undefined
                              }
                              onMoveUp={
                                isTeacherView && cIdx > 0
                                  ? () => handleMoveVideo(chapter, cVid.id, "prev", true)
                                  : undefined
                              }
                              onMoveDown={
                                isTeacherView && cIdx < displayedConcoursVideos.length - 1
                                  ? () => handleMoveVideo(chapter, cVid.id, "next", true)
                                  : undefined
                              }
                              onDragStart={(e) => handleDragStart(chapter.moduleId || activeModule, chapter.id, cVid.id, true, cVid, e)}
                              onDragOver={(e) => handleDragOver(chapter.id, cVid.id, true, e)}
                              onDragEnd={handleDragEnd}
                              onDrop={() => handleDrop(chapter, cVid.id, true)}
                              isDragging={
                                draggedVideo?.chapterId === chapter.id &&
                                draggedVideo?.videoId === cVid.id &&
                                draggedVideo?.isConcours
                              }
                              isDragOver={
                                dragOverVideo?.chapterId === chapter.id &&
                                dragOverVideo?.videoId === cVid.id &&
                                dragOverVideo?.isConcours
                              }
                            />
                          ))}
                        </div>

                        {concoursVideos.length > 6 && (
                          <div className="text-center pt-2">
                            <button
                              type="button"
                              onClick={() => toggleExpandConcours(chapter.id)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-500/30 transition-all cursor-pointer shadow-2xs"
                            >
                              <span>
                                {isConcoursExpanded
                                  ? "Afficher moins"
                                  : "Afficher tous les extraits de concours de ce chapitre"}
                              </span>
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isConcoursExpanded ? "rotate-180" : ""}`} />
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── 4. FICHES DE SYNTHÈSE DANS BOÎTIER ÉLÉGANT ── */}
                    {fiches.length > 0 && (
                      <div className="bg-[#fdfaf5] dark:bg-[#111827] border border-[#f2e7d7] dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-[#ebdccd] dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                              📑 FICHES DE SYNTHÈSE
                            </span>
                          </div>

                          {isTeacherView && (
                            <button
                              type="button"
                              onClick={() => openAddFiche(chapter)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-700 hover:bg-amber-800 text-white transition-colors cursor-pointer shadow-xs"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              <span>+ Fiche</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {fiches.map((f, fIdx) => (
                            <CourseFicheCard
                              key={f.id || fIdx}
                              fiche={f}
                              chapTitre={chapter.titre}
                              onOpenPdf={onOpenPdf}
                              isTeacherView={isTeacherView}
                              onEdit={
                                isTeacherView
                                  ? () => openEditFiche(chapter, f)
                                  : undefined
                              }
                              onDelete={
                                isTeacherView
                                  ? () => deleteFiche(chapter.moduleId, chapter.id, f.id || f.titre)
                                  : undefined
                              }
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── 4. PLEINE LARGEUR TD & DEVOIRS LIBRES (DL) ── */}
                    <div className="space-y-3.5 pt-2">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                            ✍️ TD & DEVOIRS LIBRES (DL) · FICHES D&apos;EXERCICES & ANNALES
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {tds.length}
                          </span>
                        </div>

                        {isTeacherView && (
                          <button
                            type="button"
                            onClick={() => openAddExercise(chapter)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            <span>+ Ajouter un TD / Énoncé / Corrigé</span>
                          </button>
                        )}
                      </div>

                      {tds.length > 0 ? (
                        <div className="space-y-2.5">
                          {tds.map((td, tIdx) => (
                            <CourseExerciseLine
                              key={td.id || tIdx}
                              item={td}
                              index={tIdx}
                              chapTitre={chapter.titre}
                              onOpenPdf={onOpenPdf}
                              onOpenVideo={onOpenVideo}
                              isTeacherView={isTeacherView}
                              onDelete={
                                isTeacherView && td.id
                                  ? () => deleteExercise(chapter.moduleId, chapter.id, td.id!)
                                  : undefined
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center rounded-xl bg-white/60 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-800 text-xs text-slate-500">
                          Aucun TD pour ce chapitre pour le moment.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })}

        {filteredChapters.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-[#0d1322] rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400">
            Aucun chapitre ne correspond à votre recherche.
          </div>
        )}
      </div>
            </>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 1 : AJOUTER UNE SÉANCE VIDÉO DIRECTEMENT                     */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeModal === "session" && targetChapter && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-purple-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Ajouter une Séance de Cours / Vidéo
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Dans : {targetChapter.chapterTitle}
                </p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre de la séance *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Séance 2 : Dipôles électrostatiques"
                  value={newSessTitle}
                  onChange={(e) => setNewSessTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sous-titre / Description
                </label>
                <input
                  type="text"
                  placeholder="ex: Théorie et replay interactif"
                  value={newSessSous}
                  onChange={(e) => setNewSessSous(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lien Vidéo (YouTube ou Google Drive)
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... ou Drive"
                  value={newSessVideo}
                  onChange={(e) => setNewSessVideo(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lien Support de Cours (Google Drive PDF)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={newSessSupport}
                  onChange={(e) => setNewSessSupport(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                >
                  Enregistrer la séance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 1b : MODIFIER UNE SÉANCE VIDÉO & SUPPORTS PDFS                */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeModal === "edit_session" && editingSession && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-purple-300 dark:border-purple-500/40 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Modifier la Séance & Supports</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Dans : {editingSession.chapterTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setEditingSession(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSession} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre de la séance *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Séance 1 : Fondements et Définitions"
                  value={editingSession.titre}
                  onChange={(e) =>
                    setEditingSession((prev) => (prev ? { ...prev, titre: e.target.value } : null))
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sous-titre / Description
                </label>
                <input
                  type="text"
                  placeholder="ex: Théorie et replay interactif"
                  value={editingSession.sous}
                  onChange={(e) =>
                    setEditingSession((prev) => (prev ? { ...prev, sous: e.target.value } : null))
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Lien Vidéo (YouTube ou Google Drive)
                  </label>
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                    ✦ Miniature auto-héritée
                  </span>
                </div>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=... ou Drive"
                  value={editingSession.video}
                  onChange={(e) =>
                    setEditingSession((prev) => (prev ? { ...prev, video: e.target.value } : null))
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                />
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  Modifier ce lien met automatiquement à jour la miniature YouTube en haute résolution.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lien Support de Cours (Google Drive PDF)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={editingSession.support}
                  onChange={(e) =>
                    setEditingSession((prev) => (prev ? { ...prev, support: e.target.value } : null))
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    setEditingSession(null);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 2 : AJOUTER UN TD AVEC MULTI-CORRIGÉS DIRECTEMENT            */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeModal === "exercise" && targetChapter && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-purple-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Ajouter un TD (Énoncé & Corrigés)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Dans : {targetChapter.chapterTitle}
                </p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExercise} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre du TD *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: TD 2 · Exercice Type Concours : Cylindre infini"
                  value={newTdTitle}
                  onChange={(e) => setNewTdTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sous-titre / Référence concours
                </label>
                <input
                  type="text"
                  placeholder="ex: Concours Commun Mines-Ponts MP"
                  value={newTdSous}
                  onChange={(e) => setNewTdSous(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lien Google Drive de l&apos;Énoncé (PDF)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={newTdEnonce}
                  onChange={(e) => setNewTdEnonce(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              {/* Multi-corrigés */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Corrigés multiples (PDF Drive)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setNewTdCorriges((p) => [
                        ...p,
                        { titre: `Corrigé méthode ${p.length + 1}`, url: "" },
                      ])
                    }
                    className="text-xs font-bold text-purple-600 hover:text-purple-700"
                  >
                    + Ajouter une alternative de corrigé
                  </button>
                </div>

                {newTdCorriges.map((corr, cIdx) => (
                  <div key={cIdx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <input
                      type="text"
                      placeholder="Intitulé (ex: Corrigé officiel / Méthode directe)"
                      value={corr.titre}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewTdCorriges((p) => p.map((c, i) => (i === cIdx ? { ...c, titre: val } : c)));
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        placeholder="Lien Drive du Corrigé PDF"
                        value={corr.url}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewTdCorriges((p) => p.map((c, i) => (i === cIdx ? { ...c, url: val } : c)));
                        }}
                        className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      {newTdCorriges.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setNewTdCorriges((p) => p.filter((_, i) => i !== cIdx))}
                          className="p-1.5 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lien Vidéo Résolution (YouTube / Drive - optionnel)
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newTdVideo}
                  onChange={(e) => setNewTdVideo(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Enregistrer le TD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 3 : AJOUTER UNE FICHE DE SYNTHÈSE DIRECTEMENT                */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeModal === "fiche" && targetChapter && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-amber-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Ajouter une Fiche de Synthèse
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Dans : {targetChapter.chapterTitle}
                </p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFiche} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre de la fiche *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Fiche de résumé : Théorème de Gauss & Dipôles"
                  value={newFicheTitle}
                  onChange={(e) => setNewFicheTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sous-titre / Descriptif
                </label>
                <input
                  type="text"
                  placeholder="ex: L'essentiel du cours & formulaire de réflexes"
                  value={newFicheSous}
                  onChange={(e) => setNewFicheSous(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lien Google Drive du PDF *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={newFicheUrl}
                  onChange={(e) => setNewFicheUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-700 hover:bg-amber-800 text-white shadow-xs"
                >
                  Enregistrer la fiche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 3b : MODIFIER UNE FICHE DE SYNTHÈSE DIRECTEMENT               */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeModal === "edit_fiche" && editingFiche && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-amber-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Modifier la Fiche de Synthèse</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Dans : {editingFiche.chapterTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setEditingFiche(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditFiche} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre de la fiche *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Fiche de résumé : Théorème de Gauss & Dipôles"
                  value={editingFiche.titre}
                  onChange={(e) =>
                    setEditingFiche((prev) => (prev ? { ...prev, titre: e.target.value } : null))
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sous-titre / Descriptif
                </label>
                <input
                  type="text"
                  placeholder="ex: L'essentiel du cours & formulaire de réflexes"
                  value={editingFiche.sous}
                  onChange={(e) =>
                    setEditingFiche((prev) => (prev ? { ...prev, sous: e.target.value } : null))
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lien Google Drive du PDF *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/file/d/.../view"
                  value={editingFiche.url}
                  onChange={(e) =>
                    setEditingFiche((prev) => (prev ? { ...prev, url: e.target.value } : null))
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveModal(null);
                    setEditingFiche(null);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-700 hover:bg-amber-800 text-white shadow-xs cursor-pointer"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 4 : AJOUTER UN SOUS-CHAPITRE DIRECTEMENT                     */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeModal === "chapter" && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border border-slate-200 dark:border-purple-500/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ajouter un Nouveau Chapitre au Syllabus
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChapter} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Module parent *
                </label>
                <select
                  value={newChModuleId}
                  onChange={(e) => setNewChModuleId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  {activeCoursesData.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.icon || "📚"} {m.titre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre du Chapitre *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Ondes Électromagnétiques dans les Milieux Conducteurs"
                  value={newChTitle}
                  onChange={(e) => setNewChTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description pédagogique
                </label>
                <input
                  type="text"
                  placeholder="ex: Effet de peau, réflexion sous incidence normale, bilan de Poynting"
                  value={newChDesc}
                  onChange={(e) => setNewChDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Badge filière
                </label>
                <input
                  type="text"
                  placeholder="Spé MP / PSI / TSI"
                  value={newChBadge}
                  onChange={(e) => setNewChBadge(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                >
                  Créer le chapitre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal Créer un Module */}
      {activeModal === "create_module" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 rounded-2xl bg-purple-50 dark:bg-purple-900/30">{newModIcon || "⚡"}</span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Nouveau Module de Cours</h3>
                  <p className="text-xs text-slate-500">Ajoutez une nouvelle matière ou domaine physique</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Titre du Module *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Électromagnétisme & Induction"
                  value={newModTitle}
                  onChange={(e) => setNewModTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Choisir une émoticône / Icône ({newModIcon})
                </label>
                <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/50 mb-2">
                  {["⚡", "🧲", "🌊", "🔭", "⚛️", "🔥", "💡", "🧪", "🚀", "🪐", "🌀", "📡", "📐", "🔬", "🛰️", "⚙️", "🔋", "🧬", "📊", "🎯", "🧮", "🏷️", "📚", "💎"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewModIcon(emoji)}
                      className={`text-xl p-1.5 rounded-lg transition-transform hover:scale-125 ${
                        newModIcon === emoji ? "bg-purple-500/20 ring-2 ring-purple-500 scale-110" : "hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Ou saisissez un emoji personnalisé..."
                  value={newModIcon}
                  onChange={(e) => setNewModIcon(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description succincte
                </label>
                <input
                  type="text"
                  placeholder="ex: Ondes électromagnétiques, équations de Maxwell, milieux diélectriques"
                  value={newModDesc}
                  onChange={(e) => setNewModDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
                >
                  Créer le module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Modal Modifier le Module Actif */}
      {activeModal === "edit_module" && editingModData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-2 rounded-2xl bg-amber-50 dark:bg-amber-900/30">{editingModData.icon || "⚡"}</span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Rectifier le Module</h3>
                  <p className="text-xs text-slate-500">Modifiez le titre, l&apos;émoticône ou supprimez ce module</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateModuleInline} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Titre du Module *
                </label>
                <input
                  type="text"
                  required
                  value={editingModData.titre}
                  onChange={(e) => setEditingModData({ ...editingModData, titre: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Choisir une émoticône / Icône ({editingModData.icon})
                </label>
                <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/50 mb-2">
                  {["⚡", "🧲", "🌊", "🔭", "⚛️", "🔥", "💡", "🧪", "🚀", "🪐", "🌀", "📡", "📐", "🔬", "🛰️", "⚙️", "🔋", "🧬", "📊", "🎯", "🧮", "🏷️", "📚", "💎"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setEditingModData({ ...editingModData, icon: emoji })}
                      className={`text-xl p-1.5 rounded-lg transition-transform hover:scale-125 ${
                        editingModData.icon === emoji ? "bg-amber-500/20 ring-2 ring-amber-500 scale-110" : "hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={editingModData.icon}
                  onChange={(e) => setEditingModData({ ...editingModData, icon: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Description succincte
                </label>
                <input
                  type="text"
                  value={editingModData.description}
                  onChange={(e) => setEditingModData({ ...editingModData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement le module "${editingModData.titre}" ?`)) {
                      removeModule(editingModData.id);
                      setActiveModal(null);
                      setActiveModule("all");
                    }
                  }}
                  className="px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                >
                  Supprimer ce module
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL : TRANSFÉRER UNE VIDÉO VERS UN AUTRE MODULE OU CHAPITRE     */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {transferModalData && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0d1322] border-2 border-emerald-500/40 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Transférer la vidéo
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Déplacer vers un autre module ou un autre chapitre
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTransferModalData(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aperçu de la vidéo à transférer */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <div className="w-14 h-10 rounded-lg bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center">
                {transferModalData.video.thumbnail ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={transferModalData.video.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PlayCircle className="w-5 h-5 text-purple-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {transferModalData.video.titre}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
                  <span>Source : {transferModalData.sourceChapter.moduleTitre || transferModalData.sourceChapter.badge}</span>
                  <span>·</span>
                  <span className="truncate">{transferModalData.sourceChapter.titre}</span>
                </div>
              </div>
            </div>

            {/* Formulaire de sélection de destination */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleConfirmTransfer();
              }}
              className="space-y-4 pt-1"
            >
              {/* 1. Sélection du Module */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  1. Module de destination *
                </label>
                <select
                  value={transferTargetModuleId}
                  onChange={(e) => handleTransferModuleChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                >
                  {(courses && courses.length > 0 ? courses : PC_COURSES_DATA).map((mod) => (
                    <option key={mod.id} value={mod.id}>
                      {mod.icon || "📚"} {mod.titre} ({mod.chapitres?.length || 0} chapitres)
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Sélection du Chapitre */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  2. Chapitre de destination *
                </label>
                {(() => {
                  const allMods = courses && courses.length > 0 ? courses : PC_COURSES_DATA;
                  const currentMod = allMods.find((m) => m.id === transferTargetModuleId);
                  const chaps = currentMod?.chapitres || [];

                  if (chaps.length === 0) {
                    return (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300">
                        Aucun chapitre disponible dans ce module.
                      </div>
                    );
                  }

                  return (
                    <select
                      value={transferTargetChapterId}
                      onChange={(e) => setTransferTargetChapterId(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                    >
                      {chaps.map((ch) => (
                        <option key={ch.id} value={ch.id}>
                          Ch {ch.num} : {ch.titre} {ch.id === transferModalData.sourceChapter.id ? "(Chapitre actuel)" : ""}
                        </option>
                      ))}
                    </select>
                  );
                })()}
              </div>

              {/* 3. Section de destination (Cours ou Concours) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  3. Rubrique de destination
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransferTargetSection("cours")}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer ${
                      transferTargetSection === "cours"
                        ? "bg-purple-600/15 border-purple-500 text-purple-700 dark:text-purple-300 ring-2 ring-purple-500/30"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <span>🎬</span>
                    <span>Séances de Cours</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransferTargetSection("concours")}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer ${
                      transferTargetSection === "concours"
                        ? "bg-amber-600/15 border-amber-500 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/30"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <span>🎯</span>
                    <span>Extraits Concours</span>
                  </button>
                </div>
              </div>

              {/* 4. Position dans le chapitre cible */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  4. Position dans la liste
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransferPosition("end")}
                    className={`p-2 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                      transferPosition === "end"
                        ? "bg-emerald-600/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/30"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    En fin de liste (recommandé)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferPosition("start")}
                    className={`p-2 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                      transferPosition === "start"
                        ? "bg-emerald-600/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/30"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    En début de liste (prioritaire)
                  </button>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setTransferModalData(null)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!transferTargetChapterId}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Confirmer le transfert</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification Flottante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium leading-relaxed">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="p-1 text-slate-400 hover:text-white ml-auto cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
