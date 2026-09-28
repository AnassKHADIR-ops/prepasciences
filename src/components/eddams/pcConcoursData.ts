export interface EpreuveItem {
  annee: number;
  filiere: "MP";
  label: string;
  enonce: string;
  correction: string;
  video: string | null;
}

export interface ConcoursBlock {
  id: string;
  titre: string;
  meta: string;
  icon: string;
  badgeClass: string;
  sujets: EpreuveItem[];
}

export const PC_CONCOURS_DATA: ConcoursBlock[] = [
  {
    id: "cnc",
    titre: "CNC — Concours National Commun",
    meta: "Maroc · Filière MP / MP* · Physique 1, Physique 2, Chimie",
    icon: "🇲🇦",
    badgeClass: "ci-cnc",
    sujets: [
      {
        annee: 2026,
        filiere: "MP",
        label: "Physique 1 (Électromagnétisme & Induction)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        annee: 2026,
        filiere: "MP",
        label: "Physique 2 (Thermodynamique & Ondes)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
      {
        annee: 2026,
        filiere: "MP",
        label: "Chimie (Solutions aqueuses & Cristallographie)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
      {
        annee: 2025,
        filiere: "MP",
        label: "Physique 1 (Ondes électromagnétiques & Guides d'ondes)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        annee: 2025,
        filiere: "MP",
        label: "Physique 2 (Mécanique des fluides & Acoustique)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
      {
        annee: 2025,
        filiere: "MP",
        label: "Chimie (Thermochimie & Courbes intensité-potentiel)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
      {
        annee: 2024,
        filiere: "MP",
        label: "Physique 1 (Couplage électromécanique & Freinage de Foucault)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        annee: 2024,
        filiere: "MP",
        label: "Physique 2 (Diffusion thermique stationnaire & dynamique)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
      {
        annee: 2024,
        filiere: "MP",
        label: "Chimie (Diagrammes d'Ellingham & Métallurgie)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
      {
        annee: 2023,
        filiere: "MP",
        label: "Physique 1 (Optique ondulatoire & Interféromètre de Michelson)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
      {
        annee: 2023,
        filiere: "MP",
        label: "Physique 2 (Magnétostatique & Matériaux ferromagnétiques)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
      {
        annee: 2022,
        filiere: "MP",
        label: "Physique 1 (Dipôle oscillant & Rayonnement dipolaire)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
      {
        annee: 2022,
        filiere: "MP",
        label: "Chimie (Cinétique chimique & Catalyse)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
    ],
  },
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
        label: "Physique 1 (Optique de Fourier & Cohérence)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
      {
        annee: 2025,
        filiere: "MP",
        label: "Physique 2 (Physique quantique & Puits de potentiel)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
      {
        annee: 2024,
        filiere: "MP",
        label: "Physique 1 (Transferts radiatifs & Corps noir)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
      {
        annee: 2024,
        filiere: "MP",
        label: "Physique 2 (Ondes élastiques dans les solides)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
      {
        annee: 2023,
        filiere: "MP",
        label: "Chimie (Thermodynamique des alliages métalliques)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
    ],
  },
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
        label: "Physique-Chimie (Électrodynamique & Équilibres chimiques)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
      {
        annee: 2024,
        filiere: "MP",
        label: "Physique (Lévitation magnétique & Supraconductivité)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
      {
        annee: 2023,
        filiere: "MP",
        label: "Physique (Acoustique sous-marine & Effet Doppler)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
    ],
  },
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
        label: "Physique-Chimie 1 (Laser & Émission stimulée)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
      {
        annee: 2024,
        filiere: "MP",
        label: "Physique-Chimie 2 (Plasmas & Équation de Vlasov)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
    ],
  },
  {
    id: "xens",
    titre: "Concours X-ENS",
    meta: "France · Polytechnique & Écoles Normales Supérieures · MP / MP*",
    icon: "🔬",
    badgeClass: "ci-xens",
    sujets: [
      {
        annee: 2025,
        filiere: "MP",
        label: "Physique (Mécanique statistique & Gaz de bosons)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
      {
        annee: 2024,
        filiere: "MP",
        label: "Physique (Gravitation & Ondes gravitationnelles)",
        enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        correction: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
        video: null,
      },
    ],
  },
];
