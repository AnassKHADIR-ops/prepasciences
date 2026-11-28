"use client";

import React, { useState, useMemo, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { PC_COURSES_DATA } from "./pcCoursesData";
import { ChapitreItem, CourseSession, CourseExercise, CourseFiche, CorrigeItem, SessionSupportItem } from "@/types/courses";
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
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  GripVertical,
  RotateCcw,
  Eye,
  ArrowRightLeft,
  Cloud,
  RefreshCw,
  AlertTriangle,
  LayoutGrid,
  List,
  Trophy,
  PenTool,
  Film,
  Bookmark,
} from "lucide-react";
import { getDriveImageUrls, extractDriveFileId, getYoutubeThumbnailCandidates } from "@/lib/driveUtils";
import { useCourses } from "@/context/CoursesContext";
import { useAuth } from "@/context/AuthContext";
import {
  ELEARNING_PHYSICS_VIDEOS,
  ElearningVideoItem,
  FiliereCPGE,
} from "@/data/elearningPhysiqueData";
import { VideothequeWidget } from "./VideothequeWidget";
import type { PdfDocOption } from "./PdfViewerModal";

interface CoursesWidgetProps {
  onOpenPdf: (url: string, title: string, docs?: PdfDocOption[], initialIndex?: number) => void;
  onOpenVideo: (url: string, title: string) => void;
  initialNiveau?: "sup" | "spe" | null;
  onSelectNiveau?: (niveau: "sup" | "spe" | null) => void;
}

const MODULE_ACCENT_PALETTE = [
  { stripe: "#162A4A", pillLight: "bg-[#EBF1F8] text-[#162A4A] border-[#162A4A]/15", pillDark: "dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-500/30" },
  { stripe: "#5B21B6", pillLight: "bg-[#F3EEFD] text-[#4C1D95] border-[#5B21B6]/15", pillDark: "dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-500/30" },
  { stripe: "#9A7828", pillLight: "bg-[#F8F3E6] text-[#7D601E] border-[#C6A15B]/35", pillDark: "dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-500/30" },
  { stripe: "#1E6B47", pillLight: "bg-[#EAF5EF] text-[#1E6B47] border-[#1E6B47]/20", pillDark: "dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-500/30" },
  { stripe: "#68436E", pillLight: "bg-[#F4ECF6] text-[#5B3561] border-[#68436E]/20", pillDark: "dark:bg-fuchsia-950/50 dark:text-fuchsia-200 dark:border-fuchsia-500/30" },
  { stripe: "#0F766E", pillLight: "bg-[#EAF6F5] text-[#0F766E] border-[#0F766E]/20", pillDark: "dark:bg-teal-950/50 dark:text-teal-200 dark:border-teal-500/30" },
];

function getModuleAccent(moduleId: string) {
  let hash = 0;
  for (let i = 0; i < moduleId.length; i++) {
    hash = (hash * 31 + moduleId.charCodeAt(i)) >>> 0;
  }
  return MODULE_ACCENT_PALETTE[hash % MODULE_ACCENT_PALETTE.length];
}

export interface ChapterVideoItem {
  id: string;
  titre: string;
  sous?: string;
  video: string;
  support?: string;
  supports?: SessionSupportItem[];
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
    url: "https://drive.google.com/file/d/1gTE1aj2ffdwHrro3-QIGcYLLnpmMlfUj/preview",
    titre: `Polycopié de Cours : ${chapter.titre}`,
    sous: "Cours de référence multi-filières CPGE · Pr. Hassan EDDAMS",
  };
}

// ── Détection des Vidéos d'Extraits de Concours & Oraux CPGE ──
export function isConcoursVideo(v: ElearningVideoItem): boolean {
  return v.moduleId === "concours" || Boolean(v.concoursTag);
}

// ── Extraction de l'identifiant YouTube canonique pour dé-duplication garantie ──
export function extractYoutubeId(url?: string | null): string {
  if (!url) return "";
  const match = url.match(/(?:v=|\/embed\/|youtu\.be\/|\/v\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : url.trim();
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
          supports: s.supports,
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
      const cTit = (chapter.titre || "").toLowerCase();
      const cId = (chapter.id || "").toLowerCase();
      const isOscChapter = cId.includes("osc") || /oscillat|harmonique/.test(cTit) || chapNum === 4;

      if (isOscChapter) {
        if (/oscillat|harmonique|ressort|borda|équa diff|equa diff|amorti/.test(combined)) matched = true;
      } else if (vMod === "meca") {
        if (chapNum === 1 && /cinématique|cinematique|polaire|cylindrique|sphérique|frenet|vitesse|accélération|coordonnées/.test(combined)) matched = true;
        else if (chapNum === 2 && /dynamique|newton|pfd|frottement|projection|coulomb|résume tout|important/.test(combined)) matched = true;
        else if (chapNum === 3 && /potentielle|mécanique|mecanique|énergétique|energetique|travail|puissance/.test(combined) && !/oscillat|ressort|borda/.test(combined)) matched = true;
        else if ((chapNum === 4 || chapNum === 5) && /moment cinétique|moment cinetique|bras de levier|moment d/.test(combined)) matched = true;
        else if ((chapNum === 5 || chapNum === 6) && /centrale|kepler|binet|potentielle effective|potentielle efficace|gravitation/.test(combined)) matched = true;
        else if ((chapNum === 6 || chapNum === 7) && /non galiléen|non galileen|coriolis|inertie|marée|foucault|référentiel/.test(combined)) matched = true;
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

  const existingKeys = new Set<string>();
  for (const r of result) {
    const yid = extractYoutubeId(r.video);
    if (yid) existingKeys.add(yid);
    if (r.video) existingKeys.add(r.video.trim());
    if (r.id) existingKeys.add(r.id);
  }

  for (const ev of matchingElearningVideos) {
    const yid = extractYoutubeId(ev.youtubeUrl) || ev.id;
    if (!existingKeys.has(yid) && !existingKeys.has(ev.youtubeUrl) && !existingKeys.has(ev.id)) {
      existingKeys.add(yid);
      existingKeys.add(ev.youtubeUrl);
      existingKeys.add(ev.id);
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
  const finalResult = result.filter((r) => !hiddenIds.has(r.id) && !hiddenIds.has(r.video));

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
          supports: s.supports,
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
      const cTit = (chapter.titre || "").toLowerCase();
      const isOscChapter = chapterId.includes("osc") || /oscillat|harmonique/.test(cTit) || chapNum === 4;

      if (isOscChapter) {
        return /\b(pendule|richter|ressort|millenium|millennium|oscillat|harmonique|borda)\b/i.test(t);
      }
      if (chapNum === 5 || chapNum === 6) return /\b(gravitation|orbite|satellite|rosetta|mars|rutherford|kepler|gravimètre|gravimetre|fléau)\b/i.test(t);
      if (chapNum === 6 || chapNum === 7) return /\b(coriolis|non galiléen|non galileen|géophysique|geophysique|déviation vers l'est|deviation vers l'est)\b/i.test(t);
      if ([2, 3].includes(chapNum)) return /\b(traîneau|traineau|cartouche|fusée|fusee|chute|énergétique|energetique|newton|pfd|frottement)\b/i.test(t);
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

  const existingKeys = new Set<string>();
  for (const r of result) {
    const yid = extractYoutubeId(r.video);
    if (yid) existingKeys.add(yid);
    if (r.video) existingKeys.add(r.video.trim());
    if (r.id) existingKeys.add(r.id);
  }

  for (const ev of matchingConcoursVideos) {
    const yid = extractYoutubeId(ev.youtubeUrl) || ev.id;
    if (!existingKeys.has(yid) && !existingKeys.has(ev.youtubeUrl) && !existingKeys.has(ev.id)) {
      existingKeys.add(yid);
      existingKeys.add(ev.youtubeUrl);
      existingKeys.add(ev.id);
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
  const finalResult = result.filter((r) => !hiddenConcoursIds.has(r.id) && !hiddenConcoursIds.has(r.video));

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

// ── BANDEAU MINIMALISTE : POLYCOPIÉ DE COURS OFFICIEL (EN HAUT DU CHAPITRE) ──
function ChapterOfficialPdfBanner({
  pdf,
  chapterTitre,
  selectedFiliere,
  onOpenPdf,
}: {
  pdf: { url: string; titre: string; sous: string };
  chapterTitre: string;
  selectedFiliere: FiliereCPGE | "ALL";
  onOpenPdf: (url: string, title: string, docs?: PdfDocOption[], initialIndex?: number) => void;
}) {
  return (
    <div className="group relative rounded-2xl bg-white dark:bg-[#0E1525] border border-slate-200/90 dark:border-slate-800 hover:border-[#162A4A]/35 dark:hover:border-purple-500/40 px-4 py-3.5 sm:px-5 sm:py-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)] transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        {/* Côté Gauche : Icône sobre + Titre + Repères filières */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#162A4A] dark:bg-purple-900/70 text-white flex items-center justify-center shrink-0 shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EBF1F8] dark:bg-blue-950/60 text-[#162A4A] dark:text-blue-200 border border-[#162A4A]/10 dark:border-blue-500/25">
                Polycopié Officiel · Pr. H. Eddams
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Repères {selectedFiliere === "ALL" ? "MP · PSI · PC · TSI" : `filière ${selectedFiliere}`} inclus
              </span>
            </div>

            <h4 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
              {pdf.titre}
            </h4>

            {pdf.sous && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {pdf.sous}
              </p>
            )}
          </div>
        </div>

        {/* Côté Droit : Bouton PDF sobre & net */}
        <div className="flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={() => onOpenPdf(pdf.url, `${pdf.titre} — ${chapterTitre}`)}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#162A4A] hover:bg-[#5B21B6] dark:bg-purple-600 dark:hover:bg-purple-500 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Consulter le polycopié</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CARTE VIDÉO UNIFIÉE (GRILLE OU LISTE COMPACTE + TIROIR MULTI-PDF FLUIDE) ──
function UnifiedChapterVideoCard({
  vid,
  index,
  chapTitre,
  viewMode = "grid",
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
  viewMode?: "grid" | "list";
  onOpenPdf: (url: string, title: string, docs?: PdfDocOption[], initialIndex?: number) => void;
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
  const sous = vid.sous || "Replay de cours & résolution méthodique";
  const videoUrl = vid.video || "";
  const attachedPdfs: SessionSupportItem[] = useMemo(() => {
    const list: SessionSupportItem[] = [];
    if (vid.supports && Array.isArray(vid.supports)) {
      vid.supports.forEach((s) => {
        if (s && s.url && s.url.trim()) {
          list.push(s);
        }
      });
    }
    if (vid.support && vid.support.trim()) {
      const already = list.some((s) => s.url.trim() === vid.support!.trim());
      if (!already) {
        list.unshift({
          id: "support-legacy",
          titre: "Support PDF",
          url: vid.support.trim(),
        });
      }
    }
    return list;
  }, [vid.supports, vid.support]);

  const pdfDocsOptions: PdfDocOption[] = useMemo(
    () =>
      attachedPdfs.map((p, idx) => ({
        label: p.titre || `Support ${idx + 1}`,
        url: p.url,
      })),
    [attachedPdfs]
  );

  const hasVideo = Boolean(videoUrl && videoUrl.trim() !== "");
  const hasSupport = attachedPdfs.length > 0;
  const hasMultiplePdfs = attachedPdfs.length > 1;
  const firstSupportUrl = hasSupport ? attachedPdfs[0].url : "";

  const [pdfsDrawerOpen, setPdfsDrawerOpen] = useState(false);

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

  const teacherBar = isTeacherView ? (
    <div className="flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
      <div
        className="cursor-grab active:cursor-grabbing p-1 rounded-lg text-purple-300 hover:text-white flex items-center gap-0.5 select-none"
        title="Glisser-déposer pour réordonner"
      >
        <GripVertical className="w-3.5 h-3.5" />
        <span className="text-[10px] font-mono font-bold">#{index + 1}</span>
      </div>
      {onMoveUp && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Déplacer précédent"
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
          title="Déplacer suivant"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1 rounded-lg text-purple-300 hover:text-white hover:bg-purple-600/60 transition-colors cursor-pointer"
          title="Modifier cette séance"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      )}
      {onTransfer && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTransfer();
          }}
          className="p-1 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-600 transition-colors cursor-pointer"
          title="Transférer vers un autre chapitre"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </button>
      )}
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
          title="Retirer cette vidéo"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  ) : null;

  // ── MODE LISTE COMPACTE (style #cours-mp-w .v-list) ──
  if (viewMode === "list") {
    return (
      <article
        draggable={isTeacherView}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDrop={onDrop}
        className={`group rounded-xl bg-white dark:bg-[#0E1525] border transition-all ${
          isDragging
            ? "opacity-40 scale-[0.99] border-[#5B21B6] ring-2 ring-[#5B21B6]/40"
            : isDragOver
            ? "border-[#5B21B6] ring-2 ring-purple-400/40"
            : "border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 py-2.5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="w-7 h-7 rounded-lg bg-[#F6F7FA] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-[11px] font-display font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">
                  {titre}
                </h4>
                {vid.durationFormatted && (
                  <span className="text-[10.5px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {vid.durationFormatted}
                  </span>
                )}
              </div>
              {sous && (
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {sous}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-1.5 shrink-0 self-end sm:self-auto">
            {attachedPdfs.length === 1 && (
              <button
                type="button"
                onClick={() =>
                  onOpenPdf(
                    attachedPdfs[0].url,
                    `${attachedPdfs[0].titre || "Support PDF"} : ${titre} — ${chapTitre}`
                  )
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11.5px] font-semibold rounded-full bg-[#EBF1F8] dark:bg-blue-950/60 text-[#162A4A] dark:text-blue-200 hover:bg-[#dce7f4] dark:hover:bg-blue-900/60 border border-[#162A4A]/15 dark:border-blue-500/30 transition-colors cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                <span>Support PDF</span>
              </button>
            )}

            {hasMultiplePdfs && (
              <button
                type="button"
                aria-expanded={pdfsDrawerOpen}
                onClick={() => setPdfsDrawerOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11.5px] font-semibold rounded-full bg-[#EBF1F8] dark:bg-blue-950/60 text-[#162A4A] dark:text-blue-200 hover:bg-[#dce7f4] border border-[#162A4A]/15 dark:border-blue-500/30 transition-colors cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                <span>Supports ({attachedPdfs.length})</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${pdfsDrawerOpen ? "rotate-180" : ""}`}
                />
              </button>
            )}

            {hasVideo && (
              <button
                type="button"
                onClick={() => onOpenVideo(videoUrl, `${titre} — ${chapTitre}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-[11.5px] font-semibold rounded-full bg-[#B82924] hover:bg-[#941D19] text-white transition-colors cursor-pointer"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Regarder</span>
                <Lock className="w-2.5 h-2.5 opacity-80" />
              </button>
            )}

            {teacherBar}
          </div>
        </div>

        {/* Tiroir fluide multi-PDF */}
        {hasMultiplePdfs && (
          <div className="ps-drawer" data-open={pdfsDrawerOpen ? "true" : "false"} inert={!pdfsDrawerOpen}>
            <div className="ps-drawer-inner">
              <div className="px-3.5 pb-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-1.5 bg-[#FAFBFD] dark:bg-[#0A101E]">
                {attachedPdfs.map((pdf, pIdx) => (
                  <button
                    key={pdf.id || pIdx}
                    type="button"
                    onClick={() =>
                      onOpenPdf(pdf.url, `${titre} — ${chapTitre}`, pdfDocsOptions, pIdx)
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11.5px] font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 hover:border-[#162A4A] dark:hover:border-purple-400 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-[#162A4A] dark:text-purple-300" />
                    <span className="truncate max-w-[180px]">{pdf.titre || `Support ${pIdx + 1}`}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>
    );
  }

  // ── MODE GRILLE MINIMALISTE 16:9 ──
  return (
    <article
      draggable={isTeacherView}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      className={`group relative bg-white dark:bg-[#0E1525] border rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.09)] transition-all duration-200 flex flex-col justify-between ${
        isDragging
          ? "opacity-40 scale-95 border-[#5B21B6] ring-2 ring-[#5B21B6]"
          : isDragOver
          ? "border-[#5B21B6] ring-4 ring-purple-400/40 scale-[1.01]"
          : "border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-purple-500/40 hover:-translate-y-0.5"
      }`}
    >
      {/* Barre d'actions Enseignant/Admin */}
      {teacherBar && <div className="absolute top-2 right-2 z-20">{teacherBar}</div>}

      {/* Vignette 16:9 */}
      {hasVideo ? (
        <div
          className="relative w-full aspect-video bg-slate-900 overflow-hidden cursor-pointer select-none"
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
              loading="lazy"
              onLoad={() => setThumbLoaded(true)}
              onError={handleThumbError}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B1224] via-[#162A4A] to-[#1E1438] flex flex-col items-center justify-center p-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white/85 mb-2">
                <Film className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-white line-clamp-1 max-w-[85%]">
                {titre}
              </span>
            </div>
          )}

          {/* Scrim minimaliste & Play centré */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent flex flex-col justify-between p-2.5 pointer-events-none">
            <div className="flex items-center justify-between gap-1 w-full">
              {vid.badge ? (
                <span className="text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950/75 text-white/95 backdrop-blur-xs border border-white/15">
                  {vid.badge}
                </span>
              ) : (
                <span />
              )}
              <span className="inline-flex items-center gap-1 text-[9.5px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-950/75 text-[#E3C789] backdrop-blur-xs border border-[#C6A15B]/35">
                <Lock className="w-2.5 h-2.5" />
                Membre
              </span>
            </div>

            <div className="self-center w-11 h-11 rounded-full bg-[#B82924]/95 group-hover:bg-[#941D19] group-hover:scale-105 flex items-center justify-center text-white shadow-lg transition-all pointer-events-auto">
              <PlayCircle className="w-6 h-6" />
            </div>

            <div className="flex items-center justify-between text-[10px] text-white/90 font-medium">
              <span className="truncate max-w-[72%] opacity-90">{chapTitre}</span>
              {vid.durationFormatted && (
                <span className="bg-black/75 px-1.5 py-0.5 rounded font-mono text-[9.5px] text-white/95">
                  {vid.durationFormatted}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : hasSupport ? (
        <div
          className="relative w-full aspect-video bg-gradient-to-br from-[#162A4A] to-[#223E6B] flex flex-col items-center justify-center p-3 cursor-pointer text-white"
          onClick={() => onOpenPdf(firstSupportUrl, `Support : ${titre} — ${chapTitre}`, pdfDocsOptions, 0)}
        >
          <FileText className="w-7 h-7 mb-1.5 opacity-90" />
          <span className="text-[10.5px] font-semibold tracking-wider uppercase">
            {attachedPdfs[0]?.titre || "Support de Cours PDF"}
          </span>
        </div>
      ) : null}

      {/* Corps de carte épuré */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <h4 className="font-display text-[13.5px] font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
            {titre}
          </h4>
          {sous && (
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {sous}
            </p>
          )}
        </div>

        {/* Actions + Tiroir multi-PDF */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {attachedPdfs.length === 1 && (
              <button
                type="button"
                onClick={() =>
                  onOpenPdf(
                    attachedPdfs[0].url,
                    `${attachedPdfs[0].titre || "Support PDF"} : ${titre} — ${chapTitre}`
                  )
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11.5px] font-semibold rounded-full bg-[#EBF1F8] dark:bg-blue-950/60 text-[#162A4A] dark:text-blue-200 hover:bg-[#dce7f4] dark:hover:bg-blue-900/60 border border-[#162A4A]/15 dark:border-blue-500/30 transition-colors cursor-pointer"
                title={attachedPdfs[0].titre || "Support PDF"}
              >
                <FileText className="w-3 h-3" />
                <span className="truncate max-w-[110px]">
                  {attachedPdfs[0].titre || "Support PDF"}
                </span>
              </button>
            )}

            {hasMultiplePdfs && (
              <button
                type="button"
                aria-expanded={pdfsDrawerOpen}
                onClick={() => setPdfsDrawerOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11.5px] font-semibold rounded-full bg-[#EBF1F8] dark:bg-blue-950/60 text-[#162A4A] dark:text-blue-200 hover:bg-[#dce7f4] border border-[#162A4A]/15 dark:border-blue-500/30 transition-colors cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                <span>Supports ({attachedPdfs.length})</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${pdfsDrawerOpen ? "rotate-180" : ""}`}
                />
              </button>
            )}

            {hasVideo && (
              <button
                type="button"
                onClick={() => onOpenVideo(videoUrl, `${titre} — ${chapTitre}`)}
                className="inline-flex items-center gap-1 px-3 py-1 text-[11.5px] font-semibold rounded-full bg-[#B82924] hover:bg-[#941D19] text-white transition-colors cursor-pointer ml-auto"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Regarder</span>
              </button>
            )}
          </div>

          {hasMultiplePdfs && (
            <div className="ps-drawer" data-open={pdfsDrawerOpen ? "true" : "false"} inert={!pdfsDrawerOpen}>
              <div className="ps-drawer-inner">
                <div className="pt-1.5 flex flex-col gap-1">
                  {attachedPdfs.map((pdf, pIdx) => (
                    <button
                      key={pdf.id || pIdx}
                      type="button"
                      onClick={() =>
                        onOpenPdf(pdf.url, `${titre} — ${chapTitre}`, pdfDocsOptions, pIdx)
                      }
                      className="w-full text-left flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-[11.5px] font-medium bg-[#F6F7FA] dark:bg-slate-900 hover:bg-[#EBF1F8] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer"
                    >
                      <span className="inline-flex items-center gap-1.5 min-w-0">
                        <FileText className="w-3 h-3 text-[#162A4A] dark:text-purple-300 shrink-0" />
                        <span className="truncate">{pdf.titre || `Support PDF ${pIdx + 1}`}</span>
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// ── CARTE EXTRAIT DE CONCOURS & PROBLÈME TYPE (ACCENT OR PRESTIGE SOBRE) ──
function ConcoursExtractCard({
  vid,
  index,
  chapTitre,
  viewMode = "grid",
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
  viewMode?: "grid" | "list";
  onOpenPdf?: (url: string, title: string, docs?: PdfDocOption[], initialIndex?: number) => void;
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
  const titre = vid.titre;
  const sous = vid.sous || "Extrait de Concours CPGE";
  const videoUrl = vid.video || "";
  const hasVideo = Boolean(videoUrl && videoUrl.trim() !== "");

  const attachedPdfs: SessionSupportItem[] = useMemo(() => {
    const list: SessionSupportItem[] = [];
    if (vid.supports && Array.isArray(vid.supports)) {
      vid.supports.forEach((s) => {
        if (s && s.url && s.url.trim()) {
          list.push(s);
        }
      });
    }
    if (vid.support && vid.support.trim()) {
      const already = list.some((s) => s.url.trim() === vid.support!.trim());
      if (!already) {
        list.unshift({
          id: "support-concours-legacy",
          titre: "Support PDF",
          url: vid.support.trim(),
        });
      }
    }
    return list;
  }, [vid.supports, vid.support]);

  const pdfDocsOptions: PdfDocOption[] = useMemo(
    () =>
      attachedPdfs.map((p, idx) => ({
        label: p.titre || `Sujet / Corrigé ${idx + 1}`,
        url: p.url,
      })),
    [attachedPdfs]
  );

  const hasMultiplePdfs = attachedPdfs.length > 1;
  const [pdfsDrawerOpen, setPdfsDrawerOpen] = useState(false);

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

  const teacherBar = isTeacherView ? (
    <div className="flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
      <div
        className="cursor-grab active:cursor-grabbing p-1 rounded-lg text-[#E3C789] hover:text-white flex items-center gap-0.5 select-none"
        title="Glisser-déposer pour réordonner"
      >
        <GripVertical className="w-3.5 h-3.5" />
        <span className="text-[10px] font-mono font-bold">#{index + 1}</span>
      </div>
      {onMoveUp && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Déplacer précédent"
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
          title="Déplacer suivant"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1 rounded-lg text-[#E3C789] hover:text-white hover:bg-amber-600/50 transition-colors cursor-pointer"
          title="Modifier cet extrait"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      )}
      {onTransfer && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTransfer();
          }}
          className="p-1 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-600 transition-colors cursor-pointer"
          title="Transférer cet extrait"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
        </button>
      )}
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
          title="Retirer cet extrait"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  ) : null;

  if (viewMode === "list") {
    return (
      <article
        draggable={isTeacherView}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDrop={onDrop}
        className={`group rounded-xl bg-white dark:bg-[#0E1525] border transition-all ${
          isDragging
            ? "opacity-40 scale-[0.99] border-[#9A7828] ring-2 ring-[#C6A15B]/50"
            : isDragOver
            ? "border-[#9A7828] ring-2 ring-[#C6A15B]/50"
            : "border-[#C6A15B]/35 dark:border-amber-500/25 hover:border-[#9A7828]/60"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 py-2.5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="w-7 h-7 rounded-lg bg-[#F8F3E6] dark:bg-amber-950/50 border border-[#C6A15B]/35 text-[#7D601E] dark:text-[#E3C789] flex items-center justify-center shrink-0">
              <Trophy className="w-3.5 h-3.5" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">
                  {titre}
                </h4>
                {vid.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F8F3E6] dark:bg-amber-950/50 text-[#7D601E] dark:text-[#E3C789] border border-[#C6A15B]/30">
                    {vid.badge}
                  </span>
                )}
              </div>
              {sous && (
                <p className="text-[11.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {sous}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-1.5 shrink-0 self-end sm:self-auto">
            {attachedPdfs.length === 1 && onOpenPdf && (
              <button
                type="button"
                onClick={() =>
                  onOpenPdf(
                    attachedPdfs[0].url,
                    `${attachedPdfs[0].titre || "Support Concours"} : ${titre} — ${chapTitre}`
                  )
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11.5px] font-semibold rounded-full bg-[#F8F3E6] dark:bg-amber-950/60 text-[#7D601E] dark:text-[#E3C789] hover:bg-[#efe6cf] border border-[#C6A15B]/35 transition-colors cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                <span>Sujet / Corrigé</span>
              </button>
            )}

            {hasMultiplePdfs && onOpenPdf && (
              <button
                type="button"
                aria-expanded={pdfsDrawerOpen}
                onClick={() => setPdfsDrawerOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11.5px] font-semibold rounded-full bg-[#F8F3E6] dark:bg-amber-950/60 text-[#7D601E] dark:text-[#E3C789] border border-[#C6A15B]/35 transition-colors cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                <span>Docs ({attachedPdfs.length})</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${pdfsDrawerOpen ? "rotate-180" : ""}`}
                />
              </button>
            )}

            {hasVideo && (
              <button
                type="button"
                onClick={() => onOpenVideo(videoUrl, `${titre} — ${chapTitre}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-[11.5px] font-semibold rounded-full bg-[#9A7828] hover:bg-[#7D601E] text-white transition-colors cursor-pointer"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Corrigé vidéo</span>
              </button>
            )}

            {teacherBar}
          </div>
        </div>

        {hasMultiplePdfs && onOpenPdf && (
          <div className="ps-drawer" data-open={pdfsDrawerOpen ? "true" : "false"} inert={!pdfsDrawerOpen}>
            <div className="ps-drawer-inner">
              <div className="px-3.5 pb-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5 bg-[#FAFBFD] dark:bg-[#0A101E]">
                {attachedPdfs.map((pdf, pIdx) => (
                  <button
                    key={pdf.id || pIdx}
                    type="button"
                    onClick={() =>
                      onOpenPdf(pdf.url, `${titre} — ${chapTitre}`, pdfDocsOptions, pIdx)
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11.5px] font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-[#C6A15B]/35 hover:border-[#9A7828] transition-colors cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-[#9A7828]" />
                    <span className="truncate max-w-[180px]">{pdf.titre || `Document ${pIdx + 1}`}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>
    );
  }

  return (
    <article
      draggable={isTeacherView}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      className={`group relative bg-white dark:bg-[#0E1525] border rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_12px_28px_rgba(15,23,42,0.09)] transition-all duration-200 flex flex-col justify-between ${
        isDragging
          ? "opacity-40 scale-95 border-[#9A7828] ring-2 ring-[#C6A15B]"
          : isDragOver
          ? "border-[#9A7828] ring-4 ring-[#C6A15B]/40 scale-[1.01]"
          : "border-[#C6A15B]/35 dark:border-amber-500/25 hover:border-[#9A7828]/70 hover:-translate-y-0.5"
      }`}
    >
      {teacherBar && <div className="absolute top-2 right-2 z-20">{teacherBar}</div>}

      {hasVideo && (
        <div
          className="relative w-full aspect-video bg-slate-900 overflow-hidden cursor-pointer select-none"
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
              loading="lazy"
              onLoad={() => setThumbLoaded(true)}
              onError={handleThumbError}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#120e1c] via-[#1b182e] to-[#0f172a] flex flex-col items-center justify-center p-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#C6A15B]/15 border border-[#C6A15B]/35 flex items-center justify-center text-[#E3C789] mb-2">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-white line-clamp-1 max-w-[85%]">
                {titre}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-between p-2.5 pointer-events-none">
            <div className="flex items-center justify-between gap-1 w-full">
              <span className="inline-flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950/80 text-[#E3C789] border border-[#C6A15B]/40 backdrop-blur-xs">
                <Trophy className="w-2.5 h-2.5" />
                {vid.badge || "Concours"}
              </span>
              <span className="inline-flex items-center gap-1 text-[9.5px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-950/75 text-white/90 border border-white/15">
                <Lock className="w-2.5 h-2.5" />
                Membre
              </span>
            </div>

            <div className="self-center w-11 h-11 rounded-full bg-[#9A7828]/95 group-hover:bg-[#7D601E] group-hover:scale-105 flex items-center justify-center text-white shadow-lg transition-all pointer-events-auto">
              <PlayCircle className="w-6 h-6" />
            </div>

            <div className="flex items-center justify-between text-[10px] text-white/90 font-medium">
              <span className="truncate max-w-[72%] text-[#E3C789]">{chapTitre}</span>
              {vid.durationFormatted && (
                <span className="bg-black/75 px-1.5 py-0.5 rounded font-mono text-[9.5px] text-white">
                  {vid.durationFormatted}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <h4 className="font-display text-[13.5px] font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
            {titre}
          </h4>
          {sous && (
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {sous}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {attachedPdfs.length === 1 && onOpenPdf && (
              <button
                type="button"
                onClick={() =>
                  onOpenPdf(
                    attachedPdfs[0].url,
                    `${attachedPdfs[0].titre || "Support Concours"} : ${titre} — ${chapTitre}`
                  )
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11.5px] font-semibold rounded-full bg-[#F8F3E6] dark:bg-amber-950/60 text-[#7D601E] dark:text-[#E3C789] hover:bg-[#efe6cf] border border-[#C6A15B]/35 transition-colors cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                <span className="truncate max-w-[115px]">{attachedPdfs[0].titre || "Sujet / Corrigé"}</span>
              </button>
            )}

            {hasMultiplePdfs && onOpenPdf && (
              <button
                type="button"
                aria-expanded={pdfsDrawerOpen}
                onClick={() => setPdfsDrawerOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11.5px] font-semibold rounded-full bg-[#F8F3E6] dark:bg-amber-950/60 text-[#7D601E] dark:text-[#E3C789] border border-[#C6A15B]/35 transition-colors cursor-pointer"
              >
                <FileText className="w-3 h-3" />
                <span>Docs ({attachedPdfs.length})</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${pdfsDrawerOpen ? "rotate-180" : ""}`}
                />
              </button>
            )}

            {hasVideo && (
              <button
                type="button"
                onClick={() => onOpenVideo(videoUrl, `${titre} — ${chapTitre}`)}
                className="inline-flex items-center gap-1 px-3 py-1 text-[11.5px] font-semibold rounded-full bg-[#9A7828] hover:bg-[#7D601E] text-white transition-colors cursor-pointer ml-auto"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Corrigé</span>
              </button>
            )}
          </div>

          {hasMultiplePdfs && onOpenPdf && (
            <div className="ps-drawer" data-open={pdfsDrawerOpen ? "true" : "false"} inert={!pdfsDrawerOpen}>
              <div className="ps-drawer-inner">
                <div className="pt-1.5 flex flex-col gap-1">
                  {attachedPdfs.map((pdf, pIdx) => (
                    <button
                      key={pdf.id || pIdx}
                      type="button"
                      onClick={() =>
                        onOpenPdf(pdf.url, `${titre} — ${chapTitre}`, pdfDocsOptions, pIdx)
                      }
                      className="w-full text-left flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-[11.5px] font-medium bg-[#F6F7FA] dark:bg-slate-900 hover:bg-[#F8F3E6] dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-[#C6A15B]/30 transition-colors cursor-pointer"
                    >
                      <span className="inline-flex items-center gap-1.5 min-w-0">
                        <FileText className="w-3 h-3 text-[#9A7828] shrink-0" />
                        <span className="truncate">{pdf.titre || `Document ${pIdx + 1}`}</span>
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
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

// ── 2. Carte Fiche de Synthèse (Étagère Horizontale Minimaliste) ──
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
  onOpenPdf: (url: string, title: string, docs?: PdfDocOption[], initialIndex?: number) => void;
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
      className="group relative bg-white dark:bg-[#0E1525] border border-slate-200/90 dark:border-slate-800 hover:border-[#C6A15B] dark:hover:border-amber-500/45 rounded-xl p-2.5 flex items-center gap-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_20px_rgba(15,23,42,0.07)] transition-all cursor-pointer"
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
              className="p-1 rounded-md bg-[#9A7828] hover:bg-[#7D601E] text-white shadow-xs transition-all cursor-pointer"
              title="Modifier cette fiche"
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

      {/* Mini aperçu A4 */}
      <div className="relative w-12 h-16 bg-[#F8F3E6] dark:bg-slate-900 rounded-lg overflow-hidden border border-[#C6A15B]/35 dark:border-slate-700 flex items-center justify-center shrink-0">
        {srcs.length > 0 && !imgFailed ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            src={srcs[imgIdx]}
            alt=""
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={handleImgError}
          />
        ) : (
          <Bookmark className="w-5 h-5 text-[#9A7828] dark:text-[#D4B26A]" />
        )}
      </div>

      {/* Titre & Sous-titre */}
      <div className="min-w-0 flex-1 pr-2">
        <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#9A7828] dark:text-[#D4B26A]">
          Fiche synthèse
        </span>
        <h5 className="font-display text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#162A4A] dark:group-hover:text-purple-200 transition-colors">
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

// ── 3. Ligne TD & Devoirs Libres (Minimaliste + Tiroir Fluide Multi-Corrigés) ──
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
  onOpenPdf: (url: string, title: string, docs?: PdfDocOption[], initialIndex?: number) => void;
  onOpenVideo: (url: string, title: string) => void;
  isTeacherView?: boolean;
  onDelete?: () => void;
}) {
  const titre = item.titre || `Exercice ${index + 1}`;
  const sous = item.sous || "";
  const enonceUrl = item.enonce || "";
  const videoUrl = item.video || "";

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

  // Liste combinée PDF pour le sélecteur multi-documents du lecteur <dialog>
  const pdfDocBundle: PdfDocOption[] = useMemo(() => {
    const docs: PdfDocOption[] = [];
    if (enonceUrl) {
      docs.push({ label: "Énoncé", url: enonceUrl });
    }
    corrigesList.forEach((c, idx) => {
      if (c.type !== "video") {
        docs.push({ label: c.titre || `Corrigé ${idx + 1}`, url: c.url });
      }
    });
    return docs;
  }, [enonceUrl, corrigesList]);

  const hasMultipleCorriges = corrigesList.length > 1;
  const [corrDrawerOpen, setCorrDrawerOpen] = useState(false);

  const openPdfWithBundle = (targetUrl: string, fallbackTitle: string) => {
    const idx = pdfDocBundle.findIndex((d) => d.url === targetUrl);
    if (pdfDocBundle.length > 1 && idx !== -1) {
      onOpenPdf(targetUrl, `${titre} — ${chapTitre}`, pdfDocBundle, idx);
    } else {
      onOpenPdf(targetUrl, fallbackTitle);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0E1525] rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-purple-500/40 transition-all overflow-hidden">
      <div className="p-3.5 sm:px-4 sm:py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Côté Gauche : Numéro + Titre + Sous-titre */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-[#F6F7FA] dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-[#162A4A] dark:text-purple-300 flex items-center justify-center shrink-0 font-display font-bold text-xs tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white leading-snug">
              {titre}
            </h4>
            {sous && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {sous}
              </p>
            )}
          </div>
        </div>

        {/* Côté Droit : Énoncé, Corrigé unique ou Tiroir Multi-Corrigés, Vidéo */}
        <div className="flex items-center flex-wrap gap-1.5 shrink-0 self-end md:self-auto">
          {enonceUrl && (
            <button
              type="button"
              onClick={() => openPdfWithBundle(enonceUrl, `Énoncé : ${titre} — ${chapTitre}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[#EBF1F8] dark:bg-blue-950/60 text-[#162A4A] dark:text-blue-200 hover:bg-[#dce7f4] dark:hover:bg-blue-900/60 border border-[#162A4A]/15 dark:border-blue-500/30 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Énoncé</span>
            </button>
          )}

          {corrigesList.length === 1 && (
            <button
              type="button"
              onClick={() =>
                corrigesList[0].type === "video"
                  ? onOpenVideo(corrigesList[0].url, `${corrigesList[0].titre} : ${titre} — ${chapTitre}`)
                  : openPdfWithBundle(corrigesList[0].url, `${corrigesList[0].titre} : ${titre} — ${chapTitre}`)
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[#EAF5EF] dark:bg-emerald-950/60 text-[#1E6B47] dark:text-emerald-300 hover:bg-[#daf0e4] dark:hover:bg-emerald-900/60 border border-[#1E6B47]/20 dark:border-emerald-500/30 transition-colors cursor-pointer"
            >
              {corrigesList[0].type === "video" ? (
                <PlayCircle className="w-3.5 h-3.5" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>{corrigesList[0].titre || "Corrigé"}</span>
              <Lock className="w-2.5 h-2.5 opacity-60" />
            </button>
          )}

          {hasMultipleCorriges && (
            <button
              type="button"
              aria-expanded={corrDrawerOpen}
              onClick={() => setCorrDrawerOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[#EAF5EF] dark:bg-emerald-950/60 text-[#1E6B47] dark:text-emerald-300 hover:bg-[#daf0e4] dark:hover:bg-emerald-900/60 border border-[#1E6B47]/20 dark:border-emerald-500/30 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Corrigés ({corrigesList.length})</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${corrDrawerOpen ? "rotate-180" : ""}`}
              />
            </button>
          )}

          {videoUrl && (
            <button
              type="button"
              onClick={() => onOpenVideo(videoUrl, `Vidéo : ${titre} — ${chapTitre}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-[#B82924] hover:bg-[#941D19] text-white transition-colors cursor-pointer"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Vidéo</span>
              <Lock className="w-2.5 h-2.5 opacity-80" />
            </button>
          )}

          {isTeacherView && onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Supprimer le TD "${titre}" ?`)) onDelete();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer ml-1"
              title="Supprimer ce TD"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tiroir fluide multi-corrigés (0fr -> 1fr) */}
      {hasMultipleCorriges && (
        <div className="ps-drawer" data-open={corrDrawerOpen ? "true" : "false"} inert={!corrDrawerOpen}>
          <div className="ps-drawer-inner">
            <div className="px-4 pb-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 bg-[#FAFBFD] dark:bg-[#0A101E] flex flex-wrap items-center gap-2">
              {corrigesList.map((corr: CorrigeItem, cIdx: number) => (
                <button
                  key={corr.id || cIdx}
                  type="button"
                  onClick={() =>
                    corr.type === "video"
                      ? onOpenVideo(corr.url, `${corr.titre} : ${titre} — ${chapTitre}`)
                      : openPdfWithBundle(corr.url, `${corr.titre} : ${titre} — ${chapTitre}`)
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 text-[#1E6B47] dark:text-emerald-300 border border-[#1E6B47]/20 dark:border-emerald-500/30 hover:border-[#1E6B47] transition-colors cursor-pointer"
                >
                  {corr.type === "video" ? (
                    <PlayCircle className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>{corr.titre || `Corrigé ${cIdx + 1}`}</span>
                  <Lock className="w-2.5 h-2.5 opacity-60" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
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
    cloudSync,
    syncWithCloud,
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

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const { isTeacher, isAdmin, teacherViewMode, toggleTeacherViewMode } = useAuth();
  const activeIsTeacher = isMounted && isTeacher;
  const activeIsAdmin = isMounted && isAdmin;
  const isTeacherView = (activeIsTeacher || activeIsAdmin) && teacherViewMode === "teacher";

  const [localNiveau, setLocalNiveau] = useState<"sup" | "spe" | null>(() => {
    if (initialNiveau) return initialNiveau;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const n = params.get("niveau");
      if (n === "sup" || n === "spe") return n as "sup" | "spe";
    }
    return null;
  });

  const selectedNiveau = initialNiveau !== undefined ? initialNiveau : localNiveau;

  // Filière active (PSI par défaut, MP, PC, TSI, Toutes)
  const [selectedFiliere, setSelectedFiliere] = useState<FiliereCPGE | "ALL">("PSI");
  const [courseViewMode, setCourseViewMode] = useState<"chapitres" | "videotheque">("chapitres");
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleSelection, setModuleSelection] = useState<{
    niveau: "sup" | "spe" | null;
    moduleId: string;
  }>({ niveau: selectedNiveau, moduleId: "all" });

  const activeModule =
    moduleSelection.niveau === selectedNiveau ? moduleSelection.moduleId : "all";
  const setActiveModule = (moduleId: string) => {
    setModuleSelection({ niveau: selectedNiveau, moduleId });
  };

  // Par défaut : tous les chapitres sont repliés à l'entrée sur la plateforme (demande utilisateur)
  const [openState, setOpenState] = useState<{
    niveau: "sup" | "spe" | null;
    ids: Set<string>;
  }>(() => ({ niveau: selectedNiveau, ids: new Set() }));

  const openChapterIds =
    openState.niveau === selectedNiveau ? openState.ids : new Set<string>();

  const setOpenChapterIds = (
    updater: Set<string> | ((prev: Set<string>) => Set<string>)
  ) => {
    setOpenState((prev) => {
      const current = prev.niveau === selectedNiveau ? prev.ids : new Set<string>();
      const nextIds = typeof updater === "function" ? updater(current) : updater;
      return { niveau: selectedNiveau, ids: nextIds };
    });
  };

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

  const handleLevelChange = (lvl: "sup" | "spe" | null) => {
    setLocalNiveau(lvl);
    setModuleSelection({ niveau: lvl, moduleId: "all" });
    setOpenState({ niveau: lvl, ids: new Set() });
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

  const activeCoursesData = useMemo(() => {
    const base = courses && courses.length > 0 ? courses : PC_COURSES_DATA;
    if (!selectedNiveau) return base;
    return base.filter((m) => m.niveau === selectedNiveau);
  }, [courses, selectedNiveau]);

  // Aplatir tous les chapitres avec le nom du module associé
  const allChapters = useMemo(() => {
    const list: (ChapitreItem & { moduleIcon: string; moduleTitre: string; moduleId: string })[] = [];
    activeCoursesData.forEach((module) => {
      (module.chapitres || []).forEach((ch) => {
        list.push({
          ...ch,
          moduleIcon: module.icon,
          moduleTitre: module.titre,
          moduleId: module.id,
        });
      });
    });
    return list;
  }, [activeCoursesData]);

  const toggleChapter = (id: string) => {
    setOpenChapterIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filtrage par module et recherche textuelle
  const filteredChapters = useMemo(() => {
    return allChapters.filter((ch) => {
      const matchesMod = activeModule === "all" || ch.moduleId === activeModule;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        ch.titre.toLowerCase().includes(q) ||
        (ch.description ? ch.description.toLowerCase().includes(q) : false) ||
        (ch.moduleTitre ? ch.moduleTitre.toLowerCase().includes(q) : false) ||
        String(ch.num).includes(q);
      return matchesMod && matchesSearch;
    });
  }, [allChapters, activeModule, searchQuery]);

  // États UI minimalistes inspirés de #cours-mp-w : onglets internes & bascule Grille/Liste
  type ChapterTabId = "all" | "fiches" | "videos" | "concours" | "td";
  const [chapterTabs, setChapterTabs] = useState<Record<string, ChapterTabId>>({});
  const [chapterVideoView, setChapterVideoView] = useState<Record<string, "grid" | "list">>({});
  const [chapterConcoursView, setChapterConcoursView] = useState<Record<string, "grid" | "list">>({});

  // Compteurs 6 KPI réactifs aux filtres actifs (module, filière, recherche)
  const heroStats = useMemo(() => {
    let polyAndCours = 0;
    let fiches = 0;
    let videos = 0;
    let concours = 0;
    let tds = 0;

    filteredChapters.forEach((ch) => {
      polyAndCours += Math.max(1, ch.cours?.length || 0);
      fiches += ch.fiches?.length || 0;
      videos += getChapterCourseVideos(ch, selectedFiliere).length;
      concours += getChapterConcoursVideos(ch, selectedFiliere).length;
      tds += ch.tds?.length || 0;
    });

    return {
      chapters: filteredChapters.length,
      polyAndCours,
      fiches,
      videos,
      concours,
      tds,
    };
  }, [filteredChapters, selectedFiliere]);

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
  const [newSessSupports, setNewSessSupports] = useState<SessionSupportItem[]>([]);

  // État Édition Séance Enseignant
  const [editingSession, setEditingSession] = useState<{
    moduleId: string;
    chapterId: string;
    chapterTitle: string;
    videoId: string;
    titre: string;
    sous: string;
    video: string;
    support: string;
    supports: SessionSupportItem[];
    isConcours?: boolean;
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

  const openAddSession = (ch: { moduleId?: string; id: string; titre: string }, isConcours?: boolean) => {
    setTargetChapter({ moduleId: ch.moduleId || activeCoursesData[0]?.id || "em", chapterId: ch.id, chapterTitle: ch.titre });
    setNewSessTitle("");
    setNewSessSous(isConcours ? "Extrait de Concours CPGE" : "Séance théorique & Replay interactif");
    setNewSessVideo("");
    setNewSessSupport("");
    setNewSessSupports([]);
    setActiveModal("session");
  };

  const openEditSession = (
    ch: { moduleId?: string; id: string; titre: string },
    vid: ChapterVideoItem,
    isConcours?: boolean
  ) => {
    const initialSupports: SessionSupportItem[] = [];
    if (vid.supports && Array.isArray(vid.supports)) {
      vid.supports.forEach((s, idx) => {
        if (s && s.url && s.url.trim()) {
          initialSupports.push({
            id: s.id || `sup-${vid.id}-${idx}`,
            titre: s.titre || "Support PDF",
            url: s.url.trim(),
          });
        }
      });
    }
    if (vid.support && vid.support.trim()) {
      const already = initialSupports.some((s) => s.url === vid.support!.trim());
      if (!already) {
        initialSupports.unshift({
          id: `sup-${vid.id}-legacy`,
          titre: "Support PDF",
          url: vid.support.trim(),
        });
      }
    }

    setEditingSession({
      moduleId: ch.moduleId || activeCoursesData[0]?.id || "em",
      chapterId: ch.id,
      chapterTitle: ch.titre,
      videoId: vid.id,
      titre: vid.titre || "",
      sous: vid.sous || "",
      video: vid.video || "",
      support: vid.support || "",
      supports: initialSupports,
      isConcours: isConcours ?? Boolean(vid.rawSession?.isConcours),
    });
    setActiveModal("edit_session");
  };

  const handleSaveEditSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession || !editingSession.titre.trim()) return;
    const cleanSupports = editingSession.supports
      .map((s) => ({ ...s, titre: s.titre.trim(), url: s.url.trim() }))
      .filter((s) => s.url !== "");
    const primarySupport = cleanSupports.length > 0 ? cleanSupports[0].url : (editingSession.support.trim() || undefined);

    updateSession(editingSession.moduleId, editingSession.chapterId, editingSession.videoId, {
      titre: editingSession.titre.trim(),
      sous: editingSession.sous.trim(),
      videoUrl: editingSession.video.trim() || undefined,
      supportUrl: primarySupport,
      supports: cleanSupports,
      isConcours: editingSession.isConcours,
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
    const cleanSupports = newSessSupports
      .map((s) => ({ ...s, titre: s.titre.trim(), url: s.url.trim() }))
      .filter((s) => s.url !== "");
    const primarySupport = cleanSupports.length > 0 ? cleanSupports[0].url : (newSessSupport.trim() || undefined);

    createSession(targetChapter.moduleId, targetChapter.chapterId, {
      titre: newSessTitle.trim(),
      sous: newSessSous.trim(),
      videoUrl: newSessVideo.trim() || undefined,
      supportUrl: primarySupport,
      supports: cleanSupports.length > 0 ? cleanSupports : undefined,
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
    const targetModuleId =
      newChModuleId || (activeCoursesData[0]?.id || "em-spe");
    const created = createChapter(targetModuleId, {
      titre: newChTitle.trim(),
      description: newChDesc.trim(),
      badge: newChBadge.trim(),
    });
    if (created && typeof created === "object" && "id" in created) {
      setOpenChapterIds((prev) => new Set([...Array.from(prev), created.id]));
      if (activeModule !== "all" && activeModule !== targetModuleId) {
        setActiveModule(targetModuleId);
      }
      setToastMessage(`✓ Chapitre « ${created.titre} » créé avec succès et ajouté au syllabus !`);
    } else {
      setToastMessage(`✓ Chapitre « ${newChTitle.trim()} » créé avec succès !`);
    }
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
      niveau: selectedNiveau || "spe",
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
      {(activeIsTeacher || activeIsAdmin) && (
        <div className="mb-6 p-4 rounded-2xl bg-purple-950/60 border border-purple-500/40 backdrop-blur-md space-y-2.5 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isTeacherView ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-black text-purple-200 uppercase tracking-wider">
                    {isTeacherView ? "Mode Édition Administrateur Actif" : "Aperçu : Vue Étudiant"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/80 text-purple-200 border border-purple-400/30">
                    Pleins Droits de Modification
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                      cloudSync.status === "synced"
                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                        : cloudSync.status === "syncing"
                        ? "bg-amber-950/80 text-amber-200 border-amber-500/40"
                        : cloudSync.status === "error" || cloudSync.status === "offline"
                        ? "bg-red-950/90 text-red-200 border-red-500/50"
                        : "bg-slate-900/80 text-slate-300 border-slate-600/40"
                    }`}
                  >
                    {cloudSync.status === "syncing" ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : cloudSync.status === "error" || cloudSync.status === "offline" ? (
                      <AlertTriangle className="w-3 h-3" />
                    ) : (
                      <Cloud className="w-3 h-3" />
                    )}
                    <span>
                      {cloudSync.status === "synced"
                        ? "Cloud Synchronisé"
                        : cloudSync.status === "syncing"
                        ? "Synchronisation Cloud..."
                        : cloudSync.status === "offline"
                        ? "Cloud Hors-Ligne"
                        : cloudSync.status === "error"
                        ? "Erreur Sync Cloud"
                        : "Prêt Cloud"}
                    </span>
                  </span>
                </div>
                <p className="text-[11px] text-purple-300/80">
                  {isTeacherView
                    ? "Toute création, modification ou réordonnancement est synchronisé en temps réel pour tous les étudiants et professeurs."
                    : "Vous visualisez l'espace exactement tel que le voient vos étudiants"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                disabled={cloudSync.status === "syncing"}
                onClick={async () => {
                  const res = await syncWithCloud({ pushLocal: true });
                  if (res.error) {
                    setToastMessage(`⚠️ Erreur de synchronisation Cloud : ${res.error}`);
                  } else {
                    const total =
                      res.pushedChapters +
                      res.pushedSessions +
                      res.pushedExercises +
                      res.pushedFiches;
                    if (total > 0) {
                      setToastMessage(
                        `☁️ Publié dans le Cloud (${res.pushedChapters} chap., ${res.pushedSessions} séances, ${res.pushedExercises} TDs, ${res.pushedFiches} fiches) — visible par tous !`
                      );
                    } else {
                      setToastMessage(
                        "☁️ Synchronisation Cloud terminée — vos cours sont à jour pour tous les étudiants et professeurs."
                      );
                    }
                  }
                }}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white border border-emerald-400/50 flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                title="Publier les ajouts locaux et synchroniser avec Supabase Cloud"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${cloudSync.status === "syncing" ? "animate-spin" : ""}`}
                />
                <span>Synchroniser Cloud</span>
              </button>

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
                    onClick={() => {
                      if (activeModule && activeModule !== "all") {
                        setNewChModuleId(activeModule);
                      } else if (activeCoursesData.length > 0) {
                        setNewChModuleId(activeCoursesData[0].id);
                      }
                      setActiveModal("chapter");
                    }}
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

          {cloudSync.lastError && (
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="truncate">{cloudSync.lastError}</span>
              </div>
              <button
                type="button"
                onClick={() => syncWithCloud({ pushLocal: true })}
                className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] shrink-0 cursor-pointer"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* CAS 1 : PAS DE NIVEAU SÉLECTIONNÉ => CHOIX SUP / SPÉ MINIMALISTE  */}
      {/* ================================================================= */}
      {selectedNiveau === null ? (
        <div className="space-y-6 animate-fadeIn">
          {/* En-tête académique minimaliste */}
          <div className="ps-course-hero px-6 py-8 sm:px-10 sm:py-10 text-center">
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-display font-bold uppercase tracking-[0.14em] text-[#7D601E] dark:text-[#E3C789] bg-white/85 dark:bg-slate-900/80 border border-[#C6A15B]/35 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" />
                CPGE Physique-Chimie · Pr. Hassan Eddams
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Cours, Synthèses &amp;{" "}
                <span className="text-[#5B21B6] dark:text-purple-400">Travaux Dirigés</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-lg mx-auto">
                Sélectionnez votre année CPGE pour explorer les polycopiés officiels, fiches de synthèse, replays vidéo et TD corrigés.
              </p>
            </div>
          </div>

          {/* Les Deux Cartes : 1ère Année SUP & 2ème Année SPÉ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* ── CARTE 1 : SUP (MPSI / PCSI / TSI) ── */}
            <div
              onClick={() => handleLevelChange("sup")}
              className="group relative cursor-pointer rounded-3xl bg-white dark:bg-[#0E1525] border border-slate-200/90 dark:border-slate-800 hover:border-[#162A4A]/45 dark:hover:border-purple-500/50 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-[0_2px_12px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_44px_rgba(15,23,42,0.1)] hover:-translate-y-1 overflow-hidden text-left"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#162A4A] to-transparent opacity-80" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#EBF1F8] dark:bg-blue-950/60 text-[#162A4A] dark:text-blue-200 border border-[#162A4A]/15 dark:border-blue-500/30">
                    1ère Année · SUP
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                    5 Modules · 22 Chapitres
                  </span>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#162A4A] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Atom className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-[#162A4A] dark:group-hover:text-blue-300 transition-colors">
                      MPSI / PCSI / TSI
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-[#5B21B6] dark:text-purple-300">
                      Fondements &amp; Consolidation Méthodologique
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Programme officiel de Sup : Électronique dans l&apos;ARQS, Thermodynamique, Mécanique du Point, Optique Géométrique, Électrostatique &amp; Magnétostatique.
                </p>

                <ul className="space-y-2 mb-6 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1E6B47] dark:text-emerald-400 shrink-0" />
                    <span>Polycopiés de cours officiels rédigés par Pr. H. Eddams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1E6B47] dark:text-emerald-400 shrink-0" />
                    <span>Séries de TD complètes avec corrigés rédigés détaillés</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1E6B47] dark:text-emerald-400 shrink-0" />
                    <span>Fiches méthodologiques &amp; formulaires synthétiques CPGE</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-full font-semibold text-xs sm:text-sm bg-[#162A4A] hover:bg-[#5B21B6] text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Accéder aux cours Sup</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* ── CARTE 2 : SPÉ (MP / PSI / TSI) ── */}
            <div
              onClick={() => handleLevelChange("spe")}
              className="group relative cursor-pointer rounded-3xl bg-white dark:bg-[#0E1525] border border-slate-200/90 dark:border-slate-800 hover:border-[#5B21B6]/50 dark:hover:border-purple-500/50 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-[0_2px_12px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_44px_rgba(91,33,182,0.12)] hover:-translate-y-1 overflow-hidden text-left"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#5B21B6] to-transparent opacity-90" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#F3EEFD] dark:bg-purple-950/60 text-[#4C1D95] dark:text-purple-200 border border-[#5B21B6]/15 dark:border-purple-500/30">
                    2ème Année · SPÉ
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                    6 Modules · Séances &amp; Vidéos
                  </span>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#5B21B6] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-[#5B21B6] dark:group-hover:text-purple-300 transition-colors">
                      MP / PSI / TSI
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-[#9A7828] dark:text-[#D4B26A]">
                      Approfondissement &amp; Préparation Concours
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  Programme officiel de Spé : Électronique &amp; Numérisation, Électromagnétisme &amp; Ondes, Thermodynamique &amp; Diffusion, Optique Ondulatoire, Physique Quantique.
                </p>

                <ul className="space-y-2 mb-6 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1E6B47] dark:text-emerald-400 shrink-0" />
                    <span>Séances de cours interactives avec Replays Vidéo HD</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1E6B47] dark:text-emerald-400 shrink-0" />
                    <span>Polycopiés de cours officiels rédigés par Pr. H. Eddams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1E6B47] dark:text-emerald-400 shrink-0" />
                    <span>Préparation ciblée : CNC, CCINP, Mines, Centrale, X-ENS</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-full font-semibold text-xs sm:text-sm bg-[#5B21B6] hover:bg-[#4C1D95] text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Accéder aux cours Spé</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================================================================= */
        /* CAS 2 : EXPLORATEUR DE COURS MINIMALISTE PREMIUM (STYLE #cours-mp-w) */
        /* ================================================================= */
        <div className="space-y-5 animate-fadeIn">
          {/* 1. HERO ACADÉMIQUE + BASCULES INTÉGRÉES */}
          <section className="relative">
            <div className="ps-course-hero px-5 pt-7 pb-11 sm:px-8 sm:pt-9 sm:pb-12 text-center">
              <div className="relative z-10 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-display font-bold uppercase tracking-[0.14em] text-[#7D601E] dark:text-[#E3C789] bg-white/85 dark:bg-slate-900/80 border border-[#C6A15B]/35 mb-3 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]" />
                  <span>
                    {selectedNiveau === "sup"
                      ? "CPGE 1ère Année · MPSI / PCSI / TSI"
                      : "CPGE 2ème Année · MP / PSI / PC / TSI"}
                  </span>
                </div>

                <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight">
                  Cours, Synthèses &amp;{" "}
                  <span className="text-[#5B21B6] dark:text-purple-400">TD Corrigés</span>
                </h1>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                  Polycopiés officiels rédigés par <strong className="font-semibold text-slate-800 dark:text-slate-200">Pr. Hassan Eddams</strong>, fiches de synthèse, séances vidéo et extraits de concours classés par chapitre.
                </p>

                {/* Sélecteur de Filière + Vue Par Chapitre / Vidéothèque intégrés sobrement */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                  <div
                    role="group"
                    aria-label="Filtrer par filière CPGE"
                    className="inline-flex items-center flex-wrap gap-1 p-1 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700 shadow-2xs"
                  >
                    {(["PSI", "MP", "PC", "TSI", "ALL"] as const).map((fil) => {
                      const isSel = selectedFiliere === fil;
                      const label = fil === "ALL" ? "Toutes" : fil;
                      return (
                        <button
                          key={fil}
                          type="button"
                          aria-pressed={isSel}
                          onClick={() => setSelectedFiliere(fil)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            isSel
                              ? "bg-[#162A4A] dark:bg-purple-600 text-white shadow-2xs"
                              : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  <div
                    role="group"
                    aria-label="Mode d'affichage"
                    className="inline-flex items-center gap-1 p-1 rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-700 shadow-2xs"
                  >
                    <button
                      type="button"
                      aria-pressed={courseViewMode === "chapitres"}
                      onClick={() => setCourseViewMode("chapitres")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        courseViewMode === "chapitres"
                          ? "bg-[#5B21B6] text-white shadow-2xs"
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Par chapitre</span>
                    </button>
                    <button
                      type="button"
                      aria-pressed={courseViewMode === "videotheque"}
                      onClick={() => setCourseViewMode("videotheque")}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        courseViewMode === "videotheque"
                          ? "bg-[#5B21B6] text-white shadow-2xs"
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                      }`}
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Vidéothèque</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. BARRE DE STATISTIQUES FLOTTANTE (6 KPI LIVE) */}
            {courseViewMode === "chapitres" && (
              <div className="ps-stats-bar -mt-6 mx-2 sm:mx-6">
                <div className="ps-stat-cell">
                  <div className="font-display text-lg sm:text-xl font-extrabold text-[#162A4A] dark:text-white tabular-nums leading-none">
                    {heroStats.chapters}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                    Chapitres
                  </div>
                </div>
                <div className="ps-stat-cell">
                  <div className="font-display text-lg sm:text-xl font-extrabold text-[#5B21B6] dark:text-purple-300 tabular-nums leading-none">
                    {heroStats.polyAndCours}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                    Polycopiés
                  </div>
                </div>
                <div className="ps-stat-cell">
                  <div className="font-display text-lg sm:text-xl font-extrabold text-[#9A7828] dark:text-[#E3C789] tabular-nums leading-none">
                    {heroStats.fiches}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                    Fiches
                  </div>
                </div>
                <div className="ps-stat-cell">
                  <div className="font-display text-lg sm:text-xl font-extrabold text-[#B82924] dark:text-rose-400 tabular-nums leading-none">
                    {heroStats.videos}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                    Replays
                  </div>
                </div>
                <div className="ps-stat-cell">
                  <div className="font-display text-lg sm:text-xl font-extrabold text-[#7D601E] dark:text-amber-300 tabular-nums leading-none">
                    {heroStats.concours}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                    Concours
                  </div>
                </div>
                <div className="ps-stat-cell">
                  <div className="font-display text-lg sm:text-xl font-extrabold text-[#1E6B47] dark:text-emerald-400 tabular-nums leading-none">
                    {heroStats.tds}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                    TD &amp; DL
                  </div>
                </div>
              </div>
            )}
          </section>

          {courseViewMode === "videotheque" ? (
            <VideothequeWidget
              onOpenVideo={onOpenVideo}
              onOpenPdf={onOpenPdf}
              initialFiliere={selectedFiliere}
            />
          ) : (
            <>
              {/* 3. BARRE DE FILTRES MODULES (PILLS HORIZONTALES) & RECHERCHE */}
              <div className="space-y-3 pt-1">
                {/* Pilules de Modules — 1 clic, sans menu déroulant lourd */}
                <div
                  role="group"
                  aria-label="Filtrer par module"
                  className="ps-h-scroll items-center gap-2 pb-0.5"
                >
                  <button
                    type="button"
                    aria-pressed={activeModule === "all"}
                    onClick={() => setActiveModule("all")}
                    className={`flex-none inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      activeModule === "all"
                        ? "bg-[#162A4A] dark:bg-purple-600 text-white border-[#162A4A] dark:border-purple-600 shadow-xs"
                        : "bg-white dark:bg-[#0E1525] text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <span>Tous les modules</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                        activeModule === "all"
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {allChapters.length}
                    </span>
                  </button>

                  {activeCoursesData.map((m) => {
                    const isSelected = activeModule === m.id;
                    const chCount = m.chapitres?.length || 0;
                    const accent = getModuleAccent(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setActiveModule(m.id)}
                        className={`flex-none inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#162A4A] dark:bg-purple-600 text-white border-[#162A4A] dark:border-purple-600 shadow-xs"
                            : "bg-white dark:bg-[#0E1525] text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: isSelected ? "#E3C789" : accent.stripe }}
                          aria-hidden="true"
                        />
                        <span className="whitespace-nowrap">{m.titre}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          {chCount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Ligne Recherche + Actions Déplier / Replier */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="relative flex-1 max-w-xl">
                    <label htmlFor="ps-courses-search" className="sr-only">
                      Rechercher un chapitre
                    </label>
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="ps-courses-search"
                      type="text"
                      placeholder="Rechercher un chapitre, concept ou formule (Maxwell, Fourier, Navier-Stokes)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-9 py-2.5 rounded-full border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0E1525] text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#5B21B6] dark:focus:border-purple-400 focus:ring-2 focus:ring-[#5B21B6]/15 transition-all outline-hidden shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        aria-label="Effacer la recherche"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium tabular-nums">
                      <strong className="text-slate-900 dark:text-white font-bold">
                        {filteredChapters.length}
                      </strong>{" "}
                      {filteredChapters.length > 1 ? "chapitres" : "chapitre"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setOpenChapterIds(new Set(filteredChapters.map((c) => c.id)))}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-[#0E1525] text-slate-700 dark:text-slate-200 hover:border-[#162A4A] dark:hover:border-purple-400 transition-colors cursor-pointer"
                      >
                        Tout déplier
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenChapterIds(new Set())}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-[#0E1525] text-slate-700 dark:text-slate-200 hover:border-[#162A4A] dark:hover:border-purple-400 transition-colors cursor-pointer"
                      >
                        Tout replier
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. LISTE DES CHAPITRES ACCORDÉON MINIMALISTE (STYLE #cours-mp-w) */}
              <div className="space-y-3.5">
                {filteredChapters.map((chapter) => {
                  const isOpen = openChapterIds.has(chapter.id);
                  const tds = chapter.tds || [];
                  const fiches = chapter.fiches || [];
                  const courseVideos = getChapterCourseVideos(chapter, selectedFiliere);
                  const concoursVideos = getChapterConcoursVideos(chapter, selectedFiliere);
                  const accent = getModuleAccent(chapter.moduleId);
                  const activeTab: ChapterTabId = chapterTabs[chapter.id] || "all";
                  const videoViewMode = chapterVideoView[chapter.id] || "grid";
                  const concoursViewMode = chapterConcoursView[chapter.id] || "grid";

                  return (
                    <article
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
                      className={`relative bg-white dark:bg-[#0E1525] rounded-2xl border transition-all duration-200 overflow-hidden ${
                        dragOverVideo?.chapterId === chapter.id && dragOverVideo.isChapterDropZone
                          ? "border-emerald-500 ring-4 ring-emerald-400/35 shadow-xl"
                          : isOpen
                          ? "border-slate-300 dark:border-purple-500/45 shadow-[0_8px_28px_rgba(15,23,42,0.07)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
                          : "border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      {/* Filet latéral discret d'identité module */}
                      <div
                        className="pointer-events-none absolute inset-y-0 left-0 w-[3.5px]"
                        style={{ backgroundColor: accent.stripe }}
                        aria-hidden="true"
                      />

                      {/* En-tête accordéon accessible : <h3> enveloppant le <button aria-expanded> */}
                      <div className="flex items-center gap-2 pr-4 sm:pr-5">
                        <h3 className="flex-1 min-w-0 m-0">
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() => toggleChapter(chapter.id)}
                            className="w-full text-left flex items-center gap-3.5 sm:gap-4 pl-5 pr-2 py-4 sm:py-5 cursor-pointer hover:bg-[#F6F7FA]/70 dark:hover:bg-slate-800/30 transition-colors"
                          >
                            {/* Numéro de chapitre épuré */}
                            <span
                              className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm shrink-0 transition-all tabular-nums ${
                                isOpen
                                  ? "bg-[#162A4A] dark:bg-purple-600 text-white shadow-xs"
                                  : "bg-[#F6F7FA] dark:bg-slate-900 text-[#162A4A] dark:text-slate-200 border border-slate-200/90 dark:border-slate-700"
                              }`}
                            >
                              {String(chapter.num).padStart(2, "0")}
                            </span>

                            {/* Titre, description 1 ligne & chips Lucide sobres */}
                            <span className="flex-1 min-w-0 block">
                              <span className="font-display block text-[15px] sm:text-[17px] font-bold text-slate-900 dark:text-white leading-snug">
                                {chapter.titre}
                              </span>
                              {chapter.description && (
                                <span className="block text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-normal">
                                  {chapter.description}
                                </span>
                              )}

                              {/* Chips minimalistes avec icônes Lucide (zéro emoji bruyant) */}
                              <span className="flex items-center gap-1.5 mt-2 flex-wrap">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md bg-[#EBF1F8]/90 dark:bg-blue-950/50 text-[#162A4A] dark:text-blue-200">
                                  <BookOpen className="w-3 h-3" />
                                  Polycopié
                                </span>
                                {fiches.length > 0 && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md bg-[#F8F3E6] dark:bg-amber-950/50 text-[#7D601E] dark:text-[#E3C789]">
                                    <Bookmark className="w-3 h-3" />
                                    {fiches.length} {fiches.length > 1 ? "fiches" : "fiche"}
                                  </span>
                                )}
                                {courseVideos.length > 0 && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md bg-[#F3EEFD] dark:bg-purple-950/50 text-[#5B21B6] dark:text-purple-200">
                                    <PlayCircle className="w-3 h-3" />
                                    {courseVideos.length} {courseVideos.length > 1 ? "vidéos" : "vidéo"}
                                  </span>
                                )}
                                {concoursVideos.length > 0 && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md bg-[#F8F3E6] dark:bg-amber-950/50 text-[#9A7828] dark:text-amber-300">
                                    <Trophy className="w-3 h-3" />
                                    {concoursVideos.length} concours
                                  </span>
                                )}
                                {tds.length > 0 && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md bg-[#EAF5EF] dark:bg-emerald-950/50 text-[#1E6B47] dark:text-emerald-300">
                                    <PenTool className="w-3 h-3" />
                                    {tds.length} TD
                                  </span>
                                )}
                              </span>
                            </span>

                            {/* Étiquette module + chevron */}
                            <span className="flex items-center gap-2.5 shrink-0">
                              <span
                                className={`hidden md:inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full border ${accent.pillLight} ${accent.pillDark}`}
                              >
                                {chapter.moduleName || chapter.moduleTitre || chapter.badge}
                              </span>
                              <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                                  isOpen
                                    ? "rotate-180 bg-[#162A4A] dark:bg-purple-600 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                                }`}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </span>
                            </span>
                          </button>
                        </h3>

                        {/* Bouton suppression chapitre (en dehors du <button> accordéon) */}
                        {isTeacherView && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Supprimer définitivement le chapitre "${chapter.titre}" ?`)) {
                                removeChapter(chapter.moduleId, chapter.id);
                              }
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                            title="Supprimer ce chapitre entier"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Zone de dépôt Drag & Drop inter-chapitres */}
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
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-300"
                              : "bg-purple-500/10 border-purple-400/50 text-purple-700 dark:text-purple-300"
                          }`}
                        >
                          <ArrowRightLeft className="w-4 h-4 text-emerald-500" />
                          <span>
                            Déposer ici pour transférer « {draggedVideo.videoItem.titre} » dans ({chapter.titre})
                          </span>
                        </div>
                      )}

                      {/* Contenu déplié : Onglets internes + Polycopié & Fiches + Vidéos + Concours + TD */}
                      {isOpen && (() => {
                        const chapterPdf = getChapterOfficialPdf(chapter);
                        const isVideosExpanded = expandedVideoChapters.has(chapter.id);
                        const displayedCourseVideos = isVideosExpanded ? courseVideos : courseVideos.slice(0, 8);
                        const isConcoursExpanded = expandedConcoursChapters.has(chapter.id);
                        const displayedConcoursVideos = isConcoursExpanded ? concoursVideos : concoursVideos.slice(0, 8);

                        const showFiches = activeTab === "all" || activeTab === "fiches";
                        const showVideos = activeTab === "all" || activeTab === "videos";
                        const showConcours = (activeTab === "all" || activeTab === "concours") && concoursVideos.length > 0;
                        const showTd = activeTab === "all" || activeTab === "td";

                        return (
                          <div className="ps-ch-body border-t border-slate-200/80 dark:border-slate-800/90 bg-[#F6F7FA]/85 dark:bg-[#0A101E]">
                            {/* Onglets rapides internes de chapitre (une seule ligne, indicateur souligné WCAG) */}
                            <div
                              role="tablist"
                              aria-label={`Sections du chapitre ${chapter.titre}`}
                              className="ps-ch-tabs px-4 sm:px-6 bg-white/80 dark:bg-[#0E1525]/90"
                            >
                              <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === "all"}
                                onClick={() =>
                                  setChapterTabs((prev) => ({ ...prev, [chapter.id]: "all" }))
                                }
                                className="ps-ch-tab"
                              >
                                <span>Tout voir</span>
                              </button>
                              <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === "fiches"}
                                onClick={() =>
                                  setChapterTabs((prev) => ({ ...prev, [chapter.id]: "fiches" }))
                                }
                                className="ps-ch-tab"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Cours &amp; Fiches</span>
                                <span className="text-[10.5px] opacity-70 tabular-nums">
                                  ({1 + fiches.length})
                                </span>
                              </button>
                              <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === "videos"}
                                onClick={() =>
                                  setChapterTabs((prev) => ({ ...prev, [chapter.id]: "videos" }))
                                }
                                className="ps-ch-tab"
                              >
                                <PlayCircle className="w-3.5 h-3.5" />
                                <span>Vidéos</span>
                                <span className="text-[10.5px] opacity-70 tabular-nums">
                                  ({courseVideos.length})
                                </span>
                              </button>
                              {concoursVideos.length > 0 && (
                                <button
                                  type="button"
                                  role="tab"
                                  aria-selected={activeTab === "concours"}
                                  onClick={() =>
                                    setChapterTabs((prev) => ({ ...prev, [chapter.id]: "concours" }))
                                  }
                                  className="ps-ch-tab"
                                >
                                  <Trophy className="w-3.5 h-3.5" />
                                  <span>Concours</span>
                                  <span className="text-[10.5px] opacity-70 tabular-nums">
                                    ({concoursVideos.length})
                                  </span>
                                </button>
                              )}
                              <button
                                type="button"
                                role="tab"
                                aria-selected={activeTab === "td"}
                                onClick={() =>
                                  setChapterTabs((prev) => ({ ...prev, [chapter.id]: "td" }))
                                }
                                className="ps-ch-tab"
                              >
                                <PenTool className="w-3.5 h-3.5" />
                                <span>TD &amp; DL</span>
                                <span className="text-[10.5px] opacity-70 tabular-nums">
                                  ({tds.length})
                                </span>
                              </button>
                            </div>

                            <div className="p-4 sm:p-6 space-y-6">
                              {/* ── SECTION 1 : POLYCOPIÉ OFFICIEL + ÉTAGÈRE COMPACTE FICHES ── */}
                              {showFiches && (
                                <div className="space-y-3.5">
                                  <ChapterOfficialPdfBanner
                                    pdf={chapterPdf}
                                    chapterTitre={chapter.titre}
                                    selectedFiliere={selectedFiliere}
                                    onOpenPdf={onOpenPdf}
                                  />

                                  {(fiches.length > 0 || isTeacherView) && (
                                    <div className="space-y-2.5">
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                          <Bookmark className="w-3.5 h-3.5 text-[#9A7828] dark:text-[#D4B26A]" />
                                          <span className="font-display text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                            Fiches de synthèse
                                          </span>
                                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                                            ({fiches.length})
                                          </span>
                                        </div>

                                        {isTeacherView && (
                                          <button
                                            type="button"
                                            onClick={() => openAddFiche(chapter)}
                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#9A7828] hover:bg-[#7D601E] text-white transition-colors cursor-pointer"
                                          >
                                            <PlusCircle className="w-3.5 h-3.5" />
                                            <span>Ajouter une fiche</span>
                                          </button>
                                        )}
                                      </div>

                                      {fiches.length > 0 ? (
                                        <div className="ps-fiches-shelf">
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
                                      ) : (
                                        <div className="p-3.5 text-center rounded-xl bg-white/70 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500">
                                          Aucune fiche de synthèse pour ce chapitre.
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* ── SECTION 2 : SÉANCES & REPLAYS VIDÉO DU COURS (GRILLE / LISTE) ── */}
                              {showVideos && (
                                <div className="space-y-3">
                                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <PlayCircle className="w-4 h-4 text-[#5B21B6] dark:text-purple-400" />
                                      <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                        Séances de cours &amp; Replays
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-700 tabular-nums">
                                        {courseVideos.length}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                      {/* Bascule Grille / Liste compacte */}
                                      {courseVideos.length > 0 && (
                                        <div
                                          role="group"
                                          aria-label="Disposition des vidéos"
                                          className="inline-flex items-center p-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700"
                                        >
                                          <button
                                            type="button"
                                            aria-pressed={videoViewMode === "grid"}
                                            onClick={() =>
                                              setChapterVideoView((prev) => ({ ...prev, [chapter.id]: "grid" }))
                                            }
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                                              videoViewMode === "grid"
                                                ? "bg-[#162A4A] dark:bg-purple-600 text-white"
                                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                            }`}
                                          >
                                            <LayoutGrid className="w-3 h-3" />
                                            <span className="hidden sm:inline">Grille</span>
                                          </button>
                                          <button
                                            type="button"
                                            aria-pressed={videoViewMode === "list"}
                                            onClick={() =>
                                              setChapterVideoView((prev) => ({ ...prev, [chapter.id]: "list" }))
                                            }
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                                              videoViewMode === "list"
                                                ? "bg-[#162A4A] dark:bg-purple-600 text-white"
                                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                            }`}
                                          >
                                            <List className="w-3 h-3" />
                                            <span className="hidden sm:inline">Liste</span>
                                          </button>
                                        </div>
                                      )}

                                      {isTeacherView && (
                                        <>
                                          {chapter.hiddenVideoIds && chapter.hiddenVideoIds.length > 0 && (
                                            <button
                                              type="button"
                                              onClick={() => restoreVideos(chapter.moduleId || activeModule, chapter.id, false)}
                                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-800 hover:bg-slate-700 text-purple-200 border border-purple-500/30 transition-colors cursor-pointer"
                                            >
                                              <RotateCcw className="w-3 h-3" />
                                              <span>Restaurer ({chapter.hiddenVideoIds.length})</span>
                                            </button>
                                          )}
                                          <button
                                            type="button"
                                            onClick={() => openAddSession(chapter)}
                                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-[#5B21B6] hover:bg-[#4C1D95] text-white transition-colors cursor-pointer"
                                          >
                                            <PlusCircle className="w-3.5 h-3.5" />
                                            <span>Séance</span>
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {courseVideos.length > 0 ? (
                                    <div className={videoViewMode === "list" ? "space-y-2" : "ps-vid-grid"}>
                                      {displayedCourseVideos.map((vid, vIdx) => (
                                        <UnifiedChapterVideoCard
                                          key={vid.id || vIdx}
                                          vid={vid}
                                          index={vIdx}
                                          totalCount={displayedCourseVideos.length}
                                          chapTitre={chapter.titre}
                                          viewMode={videoViewMode}
                                          onOpenPdf={onOpenPdf}
                                          onOpenVideo={onOpenVideo}
                                          isTeacherView={isTeacherView}
                                          onEdit={
                                            isTeacherView
                                              ? () => openEditSession(chapter, vid, false)
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
                                    <div className="p-4 text-center rounded-xl bg-white/70 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                                      {selectedFiliere === "PSI" && chapter.id.includes("quantique")
                                        ? "La Physique Quantique est spécifique aux filières MP et PC (hors programme PSI)."
                                        : "Aucune séance vidéo enregistrée pour cette filière."}
                                    </div>
                                  )}

                                  {courseVideos.length > 8 && (
                                    <div className="text-center pt-1">
                                      <button
                                        type="button"
                                        onClick={() => toggleExpandVideos(chapter.id)}
                                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#0E1525] hover:border-[#162A4A] dark:hover:border-purple-400 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 transition-colors cursor-pointer"
                                      >
                                        <span>
                                          {isVideosExpanded
                                            ? "Afficher moins"
                                            : `Afficher les ${courseVideos.length} séances`}
                                        </span>
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isVideosExpanded ? "rotate-180" : ""}`} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* ── SECTION 3 : EXTRAITS DE CONCOURS & PROBLÈMES TYPES ── */}
                              {showConcours && (
                                <div className="space-y-3">
                                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Trophy className="w-4 h-4 text-[#9A7828] dark:text-[#D4B26A]" />
                                      <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                        Extraits de concours &amp; Problèmes types
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F8F3E6] dark:bg-amber-950/60 text-[#7D601E] dark:text-[#E3C789] border border-[#C6A15B]/35 tabular-nums">
                                        {concoursVideos.length}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap">
                                      <div
                                        role="group"
                                        aria-label="Disposition des extraits concours"
                                        className="inline-flex items-center p-0.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700"
                                      >
                                        <button
                                          type="button"
                                          aria-pressed={concoursViewMode === "grid"}
                                          onClick={() =>
                                            setChapterConcoursView((prev) => ({ ...prev, [chapter.id]: "grid" }))
                                          }
                                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                                            concoursViewMode === "grid"
                                              ? "bg-[#9A7828] text-white"
                                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                          }`}
                                        >
                                          <LayoutGrid className="w-3 h-3" />
                                          <span className="hidden sm:inline">Grille</span>
                                        </button>
                                        <button
                                          type="button"
                                          aria-pressed={concoursViewMode === "list"}
                                          onClick={() =>
                                            setChapterConcoursView((prev) => ({ ...prev, [chapter.id]: "list" }))
                                          }
                                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                                            concoursViewMode === "list"
                                              ? "bg-[#9A7828] text-white"
                                              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                          }`}
                                        >
                                          <List className="w-3 h-3" />
                                          <span className="hidden sm:inline">Liste</span>
                                        </button>
                                      </div>

                                      {isTeacherView && chapter.hiddenConcoursVideoIds && chapter.hiddenConcoursVideoIds.length > 0 && (
                                        <button
                                          type="button"
                                          onClick={() => restoreVideos(chapter.moduleId || activeModule, chapter.id, true)}
                                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-800 hover:bg-slate-700 text-[#E3C789] border border-[#C6A15B]/35 transition-colors cursor-pointer"
                                        >
                                          <RotateCcw className="w-3 h-3" />
                                          <span>Restaurer ({chapter.hiddenConcoursVideoIds.length})</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <div className={concoursViewMode === "list" ? "space-y-2" : "ps-vid-grid"}>
                                    {displayedConcoursVideos.map((cVid, cIdx) => (
                                      <ConcoursExtractCard
                                        key={cVid.id || cIdx}
                                        vid={cVid}
                                        index={cIdx}
                                        totalCount={displayedConcoursVideos.length}
                                        chapTitre={chapter.titre}
                                        viewMode={concoursViewMode}
                                        onOpenPdf={onOpenPdf}
                                        onOpenVideo={onOpenVideo}
                                        isTeacherView={isTeacherView}
                                        onEdit={
                                          isTeacherView
                                            ? () => openEditSession(chapter, cVid, true)
                                            : undefined
                                        }
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

                                  {concoursVideos.length > 8 && (
                                    <div className="text-center pt-1">
                                      <button
                                        type="button"
                                        onClick={() => toggleExpandConcours(chapter.id)}
                                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#0E1525] hover:border-[#9A7828] text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 transition-colors cursor-pointer"
                                      >
                                        <span>
                                          {isConcoursExpanded
                                            ? "Afficher moins"
                                            : `Afficher les ${concoursVideos.length} extraits`}
                                        </span>
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isConcoursExpanded ? "rotate-180" : ""}`} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* ── SECTION 4 : TD & DEVOIRS LIBRES (DL) ── */}
                              {showTd && (
                                <div className="space-y-3">
                                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                      <PenTool className="w-4 h-4 text-[#1E6B47] dark:text-emerald-400" />
                                      <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                        TD &amp; Devoirs Libres (DL)
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-700 tabular-nums">
                                        {tds.length}
                                      </span>
                                    </div>

                                    {isTeacherView && (
                                      <button
                                        type="button"
                                        onClick={() => openAddExercise(chapter)}
                                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-[#1E6B47] hover:bg-[#165236] text-white transition-colors cursor-pointer"
                                      >
                                        <PlusCircle className="w-3.5 h-3.5" />
                                        <span>Ajouter un TD</span>
                                      </button>
                                    )}
                                  </div>

                                  {tds.length > 0 ? (
                                    <div className="space-y-2">
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
                                    <div className="p-4 text-center rounded-xl bg-white/70 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500">
                                      Aucun TD enregistré pour ce chapitre pour le moment.
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </article>
                  );
                })}

                {filteredChapters.length === 0 && (
                  <div className="p-12 text-center bg-white dark:bg-[#0E1525] rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 space-y-2">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Aucun chapitre ne correspond à votre recherche.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setActiveModule("all");
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#162A4A] text-white hover:bg-[#5B21B6] transition-colors cursor-pointer"
                    >
                      Réinitialiser les filtres
                    </button>
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

              {/* Supports de cours / Fichiers Drive (PDF) */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Fichiers Google Drive (PDF / Polycopiés / Corrigés)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setNewSessSupports((prev) => [
                        ...prev,
                        {
                          id: `sup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                          titre: `Support PDF ${prev.length + 1}`,
                          url: "",
                        },
                      ]);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Ajouter un fichier Drive</span>
                  </button>
                </div>

                {newSessSupports.length === 0 ? (
                  <div>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/.../view"
                      value={newSessSupport}
                      onChange={(e) => setNewSessSupport(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                      Ou cliquez sur « + Ajouter un fichier Drive » ci-dessus pour associer plusieurs PDFs.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {newSessSupports.map((sup, sIdx) => (
                      <div
                        key={sup.id || sIdx}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 space-y-2 relative group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            placeholder="Nom du fichier (ex: Support de cours, Corrigé)"
                            value={sup.titre}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewSessSupports((prev) => {
                                const updated = [...prev];
                                updated[sIdx] = { ...updated[sIdx], titre: val };
                                return updated;
                              });
                            }}
                            className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-purple-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setNewSessSupports((prev) => prev.filter((_, idx) => idx !== sIdx));
                            }}
                            className="p-1 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                            title="Supprimer ce fichier"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/file/d/.../view"
                          value={sup.url}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewSessSupports((prev) => {
                              const updated = [...prev];
                              updated[sIdx] = { ...updated[sIdx], url: val };
                              return updated;
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
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
          <div className="bg-white dark:bg-[#0d1322] border border-purple-300 dark:border-purple-500/40 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Modifier la Vidéo & Supports</span>
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
                  Titre de la vidéo / séance *
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
                  Sous-titre / Description / Référence
                </label>
                <input
                  type="text"
                  placeholder="ex: Théorie et replay interactif ou Extrait Concours"
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
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 font-mono"
                />
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  Modifier ce lien met automatiquement à jour la miniature YouTube en haute résolution.
                </p>
              </div>

              {/* Supports de cours / Fichiers Drive (PDF) */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Fichiers Google Drive (PDF / Supports / Corrigés)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSession((prev) => {
                        if (!prev) return null;
                        const newId = `sup-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
                        return {
                          ...prev,
                          supports: [
                            ...prev.supports,
                            {
                              id: newId,
                              titre: `Support PDF ${prev.supports.length + 1}`,
                              url: "",
                            },
                          ],
                        };
                      });
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Ajouter un fichier Drive</span>
                  </button>
                </div>

                {editingSession.supports.length === 0 ? (
                  <div className="p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-900/50">
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">
                      Aucun fichier Google Drive (PDF) rattaché à cette vidéo.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSession((prev) => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            supports: [
                              {
                                id: `sup-${Date.now()}`,
                                titre: "Support de Cours PDF",
                                url: prev.support || "",
                              },
                            ],
                          };
                        });
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 hover:bg-purple-100 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Ajouter un fichier Drive (PDF)</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {editingSession.supports.map((sup, sIdx) => (
                      <div
                        key={sup.id || sIdx}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 space-y-2 relative group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            placeholder="Nom du fichier (ex: Support de cours, Corrigé détaillé)"
                            value={sup.titre}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditingSession((prev) => {
                                if (!prev) return null;
                                const updated = [...prev.supports];
                                updated[sIdx] = { ...updated[sIdx], titre: val };
                                return { ...prev, supports: updated };
                              });
                            }}
                            className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-purple-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSession((prev) => {
                                if (!prev) return null;
                                const updated = prev.supports.filter((_, idx) => idx !== sIdx);
                                return { ...prev, supports: updated };
                              });
                            }}
                            className="p-1 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                            title="Supprimer ce fichier"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/file/d/.../view"
                          value={sup.url}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingSession((prev) => {
                              if (!prev) return null;
                              const updated = [...prev.supports];
                              updated[sIdx] = { ...updated[sIdx], url: val };
                              return { ...prev, supports: updated };
                            });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
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
                  value={
                    activeCoursesData.some((m) => m.id === newChModuleId)
                      ? newChModuleId
                      : activeCoursesData[0]?.id || ""
                  }
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
