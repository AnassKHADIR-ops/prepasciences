export interface CorrigeItem {
  id: string;
  titre: string;
  url: string;
  type?: "pdf" | "video";
}

export interface CourseSession {
  id?: string;
  titre: string;
  sous?: string;
  video?: string;
  support?: string;
  thumbnail?: string;
}

export interface CourseExercise {
  id?: string;
  titre: string;
  sous?: string;
  enonce?: string;
  correction?: string;
  corriges?: CorrigeItem[];
  video?: string;
}

export interface CourseFiche {
  id?: string;
  titre: string;
  sous?: string;
  url: string;
  thumbnail?: string;
}

export interface ChapitreItem {
  id: string;
  num: number;
  titre: string;
  badge: string;
  moduleName?: string;
  description: string;
  cours: CourseSession[];
  tds: CourseExercise[];
  fiches: CourseFiche[];
  // Rétrocompatibilité
  ficheUrl?: string | null;
  enonceTdUrl?: string | null;
  corrigeTdUrl?: string | null;
  videoUrl?: string | null;
}

export interface ModuleCoursBlock {
  id: string;
  titre: string;
  icon: string;
  description: string;
  chapitres: ChapitreItem[];
}

export const PC_COURSES_DATA: ModuleCoursBlock[] = [
  {
    id: "em",
    titre: "Électromagnétisme & Équations de Maxwell",
    icon: "⚡",
    description: "Théorème de Gauss, Ampère, induction de Faraday, équations de Maxwell dans le vide et en milieu conducteur, énergie électromagnétique (Poynting).",
    chapitres: [
      {
        id: "em-ch1",
        num: 1,
        titre: "Équations de Maxwell & Potentiels scalaire et vecteur",
        badge: "Fondamental MP*",
        moduleName: "Électromagnétisme",
        description: "Formulation locale et intégrale, jauge de Lorenz, équations de propagation d'Alembertiennes.",
        cours: [
          {
            id: "sess-em1-1",
            titre: "Séance 1 : Équations de Maxwell & Jauge de Lorenz",
            sous: "Replay intégral HD + Support de cours rédigé",
            support: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
          {
            id: "sess-em1-2",
            titre: "Séance 2 : Potentiels scalaire et vecteur & Propagation",
            sous: "Approximation dipolaire et champ créé à grande distance",
            support: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
        ],
        fiches: [
          {
            id: "fiche-em1-1",
            titre: "Fiche de synthèse : Équations de Maxwell",
            sous: "L'essentiel du chapitre & Formulaire",
            url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
          },
          {
            id: "fiche-em1-2",
            titre: "Fiche de réflexes : Symétries & Invariances",
            sous: "Méthodes pour les oraux et écrits",
            url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
          },
        ],
        tds: [
          {
            id: "ex-em1-1",
            titre: "TD 1 · Exercice Type Concours : Distribution sphérique de charge",
            sous: "Mines-Ponts MP — Calcul du champ intérieur et extérieur",
            enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
            corriges: [
              {
                id: "corr-1",
                titre: "Corrigé Officiel Rédigé (Méthode de Gauss)",
                url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
                type: "pdf",
              },
              {
                id: "corr-2",
                titre: "Corrigé Alternatif (Méthode directe d'intégration)",
                url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
                type: "pdf",
              },
            ],
          },
          {
            id: "ex-em1-2",
            titre: "TD 2 · Exercice Type Concours : Dipôle oscillant & Bilan de Poynting",
            sous: "Centrale-Supélec MP — Rayonnement dipolaire et puissance rayonnée",
            enonce: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
            video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            corriges: [
              {
                id: "corr-3",
                titre: "Corrigé Rédigé Concours (Méthode des potentiels)",
                url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
                type: "pdf",
              },
            ],
          },
        ],
      },
      {
        id: "em-ch2",
        num: 2,
        titre: "Propagation des OEM dans le vide & Onde plane progressive (OPPH)",
        badge: "Cœur de concours",
        moduleName: "Électromagnétisme",
        description: "Structure transverse, polarisation rectiligne et circulaire, vecteur de Poynting et densité volumique d'énergie.",
        cours: [],
        tds: [],
        fiches: [],
      },
      {
        id: "em-ch3",
        num: 3,
        titre: "Dispersion, absorption & Ondes dans les conducteurs (Effet de peau)",
        badge: "Classique CNC/Mines",
        moduleName: "Électromagnétisme",
        description: "Modèle de Drude, épaisseur de peau métrique, réflexion sur un conducteur parfait et guides d'ondes métalliques.",
        cours: [],
        tds: [],
        fiches: [],
      },
    ],
  },
  {
    id: "thermo",
    titre: "Thermodynamique & Transferts Thermiques",
    icon: "🔥",
    description: "Diffusion thermique (loi de Fourier), bilans d'énergie et d'entropie en système ouvert, machines thermiques réelles et transferts radiatifs.",
    chapitres: [
      {
        id: "th-ch1",
        num: 4,
        titre: "Diffusion thermique : Équation de la chaleur & Loi de Fourier",
        badge: "Incontournable",
        moduleName: "Thermodynamique",
        description: "Établissement du bilan thermique infinitésimal, régimes stationnaires et instationnaires, résistance thermique.",
        cours: [],
        tds: [],
        fiches: [],
      },
      {
        id: "th-ch2",
        num: 5,
        titre: "Thermodynamique industrielle : Écoulements & Turbomachines",
        badge: "Épreuve CNC MP",
        moduleName: "Thermodynamique",
        description: "Premier principe en écoulement stationnaire, tuyères, compresseurs, turbines et cycles moteurs à vapeur.",
        cours: [],
        tds: [],
        fiches: [],
      },
    ],
  },
  {
    id: "meca",
    titre: "Mécanique des Fluides & Phénomènes Ondulatoires",
    icon: "🌊",
    description: "Cinématique des fluides, équations d'Euler et de Navier-Stokes, écoulements parfaits et visqueux, ondes sonores et chocs.",
    chapitres: [
      {
        id: "mf-ch1",
        num: 6,
        titre: "Cinématique & Dynamique des fluides parfaits (Euler & Bernoulli)",
        badge: "Fondamental",
        moduleName: "Mécanique des Fluides",
        description: "Dérivée particulaire, équation de continuité, théorème de Bernoulli stationnaire et instationnaire, tube de Pitot.",
        cours: [],
        tds: [],
        fiches: [],
      },
      {
        id: "mf-ch2",
        num: 7,
        titre: "Fluides visqueux : Navier-Stokes & Écoulement de Poiseuille",
        badge: "CNC / CCINP",
        moduleName: "Mécanique des Fluides",
        description: "Tenseur des contraintes visqueuses, nombre de Reynolds, écoulements laminaires et turbulents, force de traînée.",
        cours: [],
        tds: [],
        fiches: [],
      },
    ],
  },
  {
    id: "optique",
    titre: "Optique Ondulatoire & Interférences",
    icon: "🌈",
    description: "Interférences à deux ondes (trous d'Young, coin d'air, anneaux de Newton), interféromètre de Michelson, diffraction de Fraunhofer et réseaux.",
    chapitres: [
      {
        id: "opt-ch1",
        num: 8,
        titre: "Interférences à deux ondes & Cohérence lumineuse",
        badge: "Cœur MP*",
        moduleName: "Optique Ondulatoire",
        description: "Formule de Fresnel, interfrange, cohérence temporelle et spatiale, contraste des franges d'interférence.",
        cours: [],
        tds: [],
        fiches: [],
      },
    ],
  },
  {
    id: "chimie",
    titre: "Chimie des Solutions, Thermochimie & Cristallographie",
    icon: "🧪",
    description: "Équilibres acido-basiques, précipitation, complexation, oxydoréduction, diagrammes E-pH (Pourbaix), courbes i-E et mailles cubiques.",
    chapitres: [
      {
        id: "ch-ch1",
        num: 9,
        titre: "Diagrammes Potentiel-pH (Pourbaix) & Corrosion humide",
        badge: "Fondamental Chimie MP*",
        moduleName: "Chimie MP*",
        description: "Tracé conventionnel, domaines de stabilité, d'immunité, de corrosion et de passivation des métaux.",
        cours: [],
        tds: [],
        fiches: [],
      },
    ],
  },
];
