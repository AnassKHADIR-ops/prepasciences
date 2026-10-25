export interface CorrigePartieItem {
  id: string;
  titre: string;
  url: string;
}

export interface EpreuveItem {
  id?: string;
  annee: number | string;
  filiere: "MP" | "PC" | "MP / PC" | "Toutes" | string;
  label: string;
  enonce: string;
  correction: string;
  corriges?: CorrigePartieItem[];
  video: string | null;
}

export interface ConcoursBlock {
  id: string;
  titre: string;
  meta: string;
  icon: string;
  badgeClass?: string;
  sujets: EpreuveItem[];
}

export const PC_CONCOURS_DATA: ConcoursBlock[] = [
  // ── 1. CNC (Concours National Commun) ──
  {
    id: "cnc",
    titre: "CNC — Concours National Commun",
    meta: "Maroc · Filière MP / MP* & PC · Épreuves officielles & Corrigés détaillés",
    icon: "🇲🇦",
    badgeClass: "ci-cnc",
    sujets: [
      {
        annee: 2022,
        filiere: "MP / PC",
        label: "CNC 2022 · Épreuve de Physique-Chimie (Énoncé & Corrigé Officiel)",
        enonce: "https://drive.google.com/file/d/1O3EBKl1tJkhISsp_MR7o4pdjEqOdQkzL/preview",
        correction: "https://drive.google.com/file/d/1O3EBKl1tJkhISsp_MR7o4pdjEqOdQkzL/preview",
        video: null,
      },
      {
        annee: 2020,
        filiere: "MP / PC",
        label: "CNC 2020 · Épreuve de Physique-Chimie (Énoncé & Corrigé Officiel)",
        enonce: "https://drive.google.com/file/d/14MHtG6ZsJ34CL5Opav2O18jCyqdD6jA3/preview",
        correction: "https://drive.google.com/file/d/14MHtG6ZsJ34CL5Opav2O18jCyqdD6jA3/preview",
        video: null,
      },
      {
        annee: 2019,
        filiere: "MP / PC",
        label: "CNC 2019 · Épreuve de Physique-Chimie (Énoncé & Corrigé Officiel)",
        enonce: "https://drive.google.com/file/d/16VlQXpsT8PkcqwPi9D37SuKTED0n-EIP/preview",
        correction: "https://drive.google.com/file/d/16VlQXpsT8PkcqwPi9D37SuKTED0n-EIP/preview",
        video: null,
      },
      {
        annee: "CNC Book",
        filiere: "MP / MP*",
        label: "CNC Book · Recueil Pédagogique Fondamental & Méthodes Concours",
        enonce: "https://drive.google.com/file/d/1MTTxkiilaYG05WVf-bLHdyVcbjD7ThLr/preview",
        correction: "https://drive.google.com/file/d/1MTTxkiilaYG05WVf-bLHdyVcbjD7ThLr/preview",
        video: null,
      },
      {
        annee: "2000-2010",
        filiere: "MP / PC",
        label: "Annales CNC 2000-2010 · Compilation Décennale Complète des Sujets et Corrigés",
        enonce: "https://drive.google.com/file/d/1Ti5J4RMGunMWpj3ghJPpEjW8qabDFcrU/preview",
        correction: "https://drive.google.com/file/d/1Ti5J4RMGunMWpj3ghJPpEjW8qabDFcrU/preview",
        video: null,
      },
    ],
  },

  // ── 2. CONCOURS X-ENS ──
  {
    id: "xens",
    titre: "Concours X-ENS",
    meta: "France · Polytechnique & Écoles Normales Supérieures · MP & PC · Écrits & Planches d'Oral",
    icon: "🔬",
    badgeClass: "ci-xens",
    sujets: [
      {
        annee: "2019-2021",
        filiere: "MP / PC",
        label: "Renaud Pochet X-ENS 2019-2021 · Recueil d'Épreuves de Haut Niveau Résolues & Commentées",
        enonce: "https://drive.google.com/file/d/1edQiseNvBnqzyekKAx7vhJFwXmgqrF8B/preview",
        correction: "https://drive.google.com/file/d/1edQiseNvBnqzyekKAx7vhJFwXmgqrF8B/preview",
        video: null,
      },
      {
        annee: 2019,
        filiere: "MP",
        label: "Oral École Polytechnique (X) 2019 · Planches de Physique Filière MP",
        enonce: "https://drive.google.com/file/d/1rVuH5aDnoC7u8WMo5I4RhGj59-6rNawU/preview",
        correction: "https://drive.google.com/file/d/1rVuH5aDnoC7u8WMo5I4RhGj59-6rNawU/preview",
        video: null,
      },
      {
        annee: 2019,
        filiere: "PC",
        label: "Oral École Polytechnique (X) 2019 · Planches de Physique-Chimie Filière PC",
        enonce: "https://drive.google.com/file/d/1FbZ-Xi5T-DAmshXK6tUoRw0_OmZIXNQQ/preview",
        correction: "https://drive.google.com/file/d/1FbZ-Xi5T-DAmshXK6tUoRw0_OmZIXNQQ/preview",
        video: null,
      },
    ],
  },

  // ── 3. MÉTHODOLOGIE & PROBLÈMES FONDAMENTAUX ──
  {
    id: "methodo",
    titre: "Méthodologie & Problèmes Concours Sup/Spé",
    meta: "Pr. Hassan EDDAMS · Méthodes de rédaction, rigueur d'analyse et annales fondamentales",
    icon: "📐",
    badgeClass: "ci-methodo",
    sujets: [
      {
        annee: "Méthode",
        filiere: "Toutes",
        label: "Méthodologie Écrit Concours · Conseils de Rédaction, Gestion du Temps & Rigueur CPGE",
        enonce: "https://drive.google.com/file/d/15BqxITz4p0sHyz1gaZEpTlAKm_r5vlMp/preview",
        correction: "https://drive.google.com/file/d/15BqxITz4p0sHyz1gaZEpTlAKm_r5vlMp/preview",
        video: null,
      },
      {
        annee: "Problèmes Sup",
        filiere: "MP / PC",
        label: "Problèmes de Physique Sup Corrigés & Rédigés · Entraînement Type Concours",
        enonce: "https://drive.google.com/file/d/1QdaTgO4r_X8TJ7xwB_iMv-qZ-GIrv4Yc/preview",
        correction: "https://drive.google.com/file/d/1QdaTgO4r_X8TJ7xwB_iMv-qZ-GIrv4Yc/preview",
        video: null,
      },
    ],
  },

  // ── 4. MINES-PONTS ──
  {
    id: "mp",
    titre: "Mines-Ponts",
    meta: "France · Filière MP / MP* · Physique 1, Physique 2, Chimie",
    icon: "⛏️",
    badgeClass: "ci-mp",
    sujets: [
      {
        annee: 2025,
        filiere: "MP",
        label: "Physique 1 (Optique de Fourier, Filtrage Spatial & Cohérence)",
        enonce: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
        correction: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
        video: null,
      },
      {
        annee: 2024,
        filiere: "MP",
        label: "Physique 1 (Transferts Radiatifs, Corps Noir & Bilan Énergétique)",
        enonce: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
        correction: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
        video: null,
      },
    ],
  },

  // ── 5. CCINP ──
  {
    id: "ccinp",
    titre: "CCINP — Concours Communs INP",
    meta: "France · Filière MP / MP* · Physique & Chimie",
    icon: "🎯",
    badgeClass: "ci-ccinp",
    sujets: [
      {
        annee: 2025,
        filiere: "MP",
        label: "Physique-Chimie (Électrodynamique & Équilibres Chimiques en Solution)",
        enonce: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
        correction: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
        video: null,
      },
      {
        annee: 2024,
        filiere: "MP",
        label: "Physique (Lévitation Magnétique, Induction & Supraconductivité)",
        enonce: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
        correction: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
        video: null,
      },
    ],
  },

  // ── 6. CENTRALE-SUPÉLEC ──
  {
    id: "cs",
    titre: "Centrale-Supélec",
    meta: "France · Filière MP / MP* · Physique & Chimie",
    icon: "⚡",
    badgeClass: "ci-cs",
    sujets: [
      {
        annee: 2025,
        filiere: "MP",
        label: "Physique-Chimie 1 (Laser, Émission Stimulée & Cavité Fabry-Pérot)",
        enonce: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
        correction: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
        video: null,
      },
      {
        annee: 2024,
        filiere: "MP",
        label: "Physique-Chimie 2 (Plasmas, Gaz Ionisés & Équation de Vlasov)",
        enonce: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
        correction: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
        video: null,
      },
    ],
  },
];
