/**
 * Base de données exhaustive des annales officielles Filière PC / PC*
 * Physique & Chimie (CNC, Centrale-Supélec, Mines-Ponts, CCINP, X-ENS, e3a)
 * Avec Vidéos de correction E-Learning Physique intégrées par concours & session
 * Et Indexation thématique avancée par module / chapitre CPGE
 */

export interface VideoPartItem {
  id?: string;
  title: string;
  url: string;
  duration?: string;
  chapitre?: string;
  themes?: string[];
}

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
  description?: string;
  themes?: string[];
  enonce: string;
  correction: string;
  corriges?: CorrigePartieItem[];
  video?: string | null;
  videos?: VideoPartItem[];
}

export interface ConcoursBlock {
  id: string;
  titre: string;
  meta: string;
  icon: string;
  badgeClass?: string;
  sujets: EpreuveItem[];
}

export interface ThemeModuleItem {
  id: string;
  label: string;
  icon: string;
}

export const THEMES_MODULES: ThemeModuleItem[] = [
  { id: "all", label: "Tous les thèmes", icon: "📚" },
  { id: "electronique", label: "Électronique & Signal", icon: "⚡" },
  { id: "electromagnetisme", label: "Électromagnétisme & Induction", icon: "🧲" },
  { id: "thermodynamique", label: "Thermodynamique & Transferts", icon: "🔥" },
  { id: "mecanique", label: "Mécanique & Solide", icon: "⚙️" },
  { id: "fluides", label: "Mécanique des Fluides", icon: "🌊" },
  { id: "optique_ondes", label: "Optique Ondulatoire & Acoustique", icon: "🌈" },
  { id: "quantique", label: "Physique Quantique & Atomique", icon: "⚛️" },
  { id: "chimie_orga", label: "Chimie Organique", icon: "🧪" },
  { id: "chimie_solutions", label: "Solutions & Électrochimie", icon: "⚗️" },
  { id: "chimie_archi", label: "Architecture Matière & Cristallo", icon: "💎" },
  { id: "tp_oraux", label: "TP & Planches d'Oraux", icon: "🔬" },
];

export const PC_CONCOURS_DATA: ConcoursBlock[] = [
  {
    "id": "cnc",
    "titre": "CNC — Concours National Commun",
    "meta": "Maroc · Filière PC · Épreuves officielles & Corrigés détaillés",
    "icon": "🇲🇦",
    "badgeClass": "ci-cnc",
    "sujets": [
      {
        "id": "cnc-book-1",
        "annee": "CNC Book",
        "filiere": "PC",
        "label": "CNC Book · Recueil Pédagogique Fondamental & Méthodes Concours",
        "description": "Recueil méthodologique fondamental pour réussir le CNC : astuces de calcul, rigueur et méthodes types.",
        "enonce": "https://drive.google.com/file/d/1MTTxkiilaYG05WVf-bLHdyVcbjD7ThLr/preview",
        "correction": "https://drive.google.com/file/d/1MTTxkiilaYG05WVf-bLHdyVcbjD7ThLr/preview",
        "themes": [
          "tp_oraux"
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cnc-annales-2000-2010",
        "annee": "2000-2010",
        "filiere": "PC",
        "label": "Annales CNC 2000-2010 · Compilation Décennale Complète des Sujets et Corrigés",
        "description": "Dix années complètes d'épreuves du Concours National Commun avec corrigés détaillés.",
        "enonce": "https://drive.google.com/file/d/1Ti5J4RMGunMWpj3ghJPpEjW8qabDFcrU/preview",
        "correction": "https://drive.google.com/file/d/1Ti5J4RMGunMWpj3ghJPpEjW8qabDFcrU/preview",
        "themes": [
          "mecanique",
          "electromagnetisme",
          "thermodynamique",
          "chimie_orga"
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cnc-2022-pc-1",
        "annee": 2022,
        "filiere": "PC",
        "label": "CNC 2022 · Épreuve de Physique-Chimie (Énoncé & Corrigé Officiel)",
        "description": "Épreuve complète de Physique-Chimie : thermodynamique, transferts et cinétique chimique.",
        "enonce": "https://drive.google.com/file/d/1O3EBKl1tJkhISsp_MR7o4pdjEqOdQkzL/preview",
        "correction": "https://drive.google.com/file/d/1O3EBKl1tJkhISsp_MR7o4pdjEqOdQkzL/preview",
        "themes": [
          "thermodynamique",
          "chimie_solutions"
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cnc-2020-pc-1",
        "annee": 2020,
        "filiere": "PC",
        "label": "CNC 2020 · Épreuve de Physique-Chimie (Énoncé & Corrigé Officiel)",
        "description": "Épreuve officielle de Physique-Chimie : ondes, électromagnétisme et synthèse organique.",
        "enonce": "https://drive.google.com/file/d/14MHtG6ZsJ34CL5Opav2O18jCyqdD6jA3/preview",
        "correction": "https://drive.google.com/file/d/14MHtG6ZsJ34CL5Opav2O18jCyqdD6jA3/preview",
        "themes": [
          "electromagnetisme",
          "chimie_orga"
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cnc-2019-pc-1",
        "annee": 2019,
        "filiere": "PC",
        "label": "CNC 2019 · Épreuve de Physique-Chimie (Énoncé & Corrigé Officiel)",
        "description": "Épreuve officielle de Physique-Chimie : mécanique du solide, solutions aqueuses et diagramme E-pH.",
        "enonce": "https://drive.google.com/file/d/16VlQXpsT8PkcqwPi9D37SuKTED0n-EIP/preview",
        "correction": "https://drive.google.com/file/d/16VlQXpsT8PkcqwPi9D37SuKTED0n-EIP/preview",
        "themes": [
          "mecanique",
          "chimie_solutions"
        ],
        "video": null,
        "videos": []
      }
    ]
  },
  {
    "id": "cs",
    "titre": "Centrale-Supélec",
    "meta": "France · Filière PC · Physique-Chimie 1, Physique-Chimie 2 & Chimie",
    "icon": "⚡",
    "badgeClass": "ci-cs",
    "sujets": [
      {
        "id": "cs-vid--BDwdBKIOW4",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Corrigé (3) Centrale MP Physique 2 : gravimètre à fléau",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés X-ENS.",
        "themes": [
          "mecanique"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=-BDwdBKIOW4",
        "videos": [
          {
            "id": "-BDwdBKIOW4",
            "title": "Corrigé (3) Centrale MP Physique 2 : gravimètre à fléau",
            "url": "https://www.youtube.com/watch?v=-BDwdBKIOW4",
            "duration": "16:04",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-EXvereDRg1I",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · TP électronique centrale-supélec (1/2)- Amplificateur (ALI) inverseur",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés Mines-Ponts.",
        "themes": [
          "electronique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=EXvereDRg1I",
        "videos": [
          {
            "id": "EXvereDRg1I",
            "title": "TP électronique centrale-supélec (1/2)- Amplificateur (ALI) inverseur",
            "url": "https://www.youtube.com/watch?v=EXvereDRg1I",
            "duration": "09:58",
            "chapitre": "Corrigés Mines-Ponts",
            "themes": [
              "electronique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-nIaz5DauQWA",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Caractéristiques d'une inductance-Filtrage- Oral Centrale avec Python",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés X-ENS.",
        "themes": [
          "electronique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=nIaz5DauQWA",
        "videos": [
          {
            "id": "nIaz5DauQWA",
            "title": "Caractéristiques d'une inductance-Filtrage- Oral Centrale avec Python",
            "url": "https://www.youtube.com/watch?v=nIaz5DauQWA",
            "duration": "30:25",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "electronique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-mRPfT7rnTpE",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Comment choisir tes concours X-Mines-Centrale-CCP-E3A ?",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés Mines-Ponts.",
        "themes": [
          "mecanique"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=mRPfT7rnTpE",
        "videos": [
          {
            "id": "mRPfT7rnTpE",
            "title": "Comment choisir tes concours X-Mines-Centrale-CCP-E3A ?",
            "url": "https://www.youtube.com/watch?v=mRPfT7rnTpE",
            "duration": "17:31",
            "chapitre": "Corrigés Mines-Ponts",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-Av0Dg5ZaAdE",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Pince ampèremétrique- induction/magnétostatique-Oral centrale/Supélec",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés X-ENS.",
        "themes": [
          "electromagnetisme",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=Av0Dg5ZaAdE",
        "videos": [
          {
            "id": "Av0Dg5ZaAdE",
            "title": "Pince ampèremétrique- induction/magnétostatique-Oral centrale/Supélec",
            "url": "https://www.youtube.com/watch?v=Av0Dg5ZaAdE",
            "duration": "22:48",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "electromagnetisme",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-20gHaeEiV4k",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Diffusion thermique/pb à symétrie cylindrique-Centrale TSI physique 1 (3/5)",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés X-ENS.",
        "themes": [
          "thermodynamique"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=20gHaeEiV4k",
        "videos": [
          {
            "id": "20gHaeEiV4k",
            "title": "Diffusion thermique/pb à symétrie cylindrique-Centrale TSI physique 1 (3/5)",
            "url": "https://www.youtube.com/watch?v=20gHaeEiV4k",
            "duration": "11:06",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "thermodynamique"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-e0_hmSHNWY4",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Appareil photo jetable- Oral physique centrale MP-PSI-PC",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés X-ENS.",
        "themes": [
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=e0_hmSHNWY4",
        "videos": [
          {
            "id": "e0_hmSHNWY4",
            "title": "Appareil photo jetable- Oral physique centrale MP-PSI-PC",
            "url": "https://www.youtube.com/watch?v=e0_hmSHNWY4",
            "duration": "11:59",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-I8IaHCXs-JE",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · TP électronique Centrale (2/2) : Intégrateur à ALI",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "electronique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=I8IaHCXs-JE",
        "videos": [
          {
            "id": "I8IaHCXs-JE",
            "title": "TP électronique Centrale (2/2) : Intégrateur à ALI",
            "url": "https://www.youtube.com/watch?v=I8IaHCXs-JE",
            "duration": "09:10",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "electronique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-5h_wdG14tXk",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Gravitation - \"Voyage vers Mars\" - Oral Centrale MP",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés Mines-Ponts.",
        "themes": [
          "mecanique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=5h_wdG14tXk",
        "videos": [
          {
            "id": "5h_wdG14tXk",
            "title": "Gravitation - \"Voyage vers Mars\" - Oral Centrale MP",
            "url": "https://www.youtube.com/watch?v=5h_wdG14tXk",
            "duration": "20:33",
            "chapitre": "Corrigés Mines-Ponts",
            "themes": [
              "mecanique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-XKyapPtB83s",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Constante  de gravitation- Oral Centrale MP/PSI/PC",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés X-ENS.",
        "themes": [
          "mecanique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=XKyapPtB83s",
        "videos": [
          {
            "id": "XKyapPtB83s",
            "title": "Constante  de gravitation- Oral Centrale MP/PSI/PC",
            "url": "https://www.youtube.com/watch?v=XKyapPtB83s",
            "duration": "11:43",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-N_rJf7x4vyQ",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Comment voir la caractéristique d'une diode à l'oscillo? TP Mines-Ponts/Centrale/CCP/X/ENS",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés X-ENS.",
        "themes": [
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=N_rJf7x4vyQ",
        "videos": [
          {
            "id": "N_rJf7x4vyQ",
            "title": "Comment voir la caractéristique d'une diode à l'oscillo? TP Mines-Ponts/Centrale/CCP/X/ENS",
            "url": "https://www.youtube.com/watch?v=N_rJf7x4vyQ",
            "duration": "13:39",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-_6SXhV1TT5w",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MP-PSI-PC Où trouver des corrigés gratuits de physique X/Centrale/Mines/CCP/E3A sur internet ?",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés Mines-Ponts.",
        "themes": [
          "mecanique"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=_6SXhV1TT5w",
        "videos": [
          {
            "id": "_6SXhV1TT5w",
            "title": "MP-PSI-PC Où trouver des corrigés gratuits de physique X/Centrale/Mines/CCP/E3A sur internet ?",
            "url": "https://www.youtube.com/watch?v=_6SXhV1TT5w",
            "duration": "10:34",
            "chapitre": "Corrigés Mines-Ponts",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-bLu4qqJKWq4",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MP/PC -  Quantique- L' effet photoélectrique/mesure de la constante de Planck - Centrale MP",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés X-ENS.",
        "themes": [
          "quantique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=bLu4qqJKWq4",
        "videos": [
          {
            "id": "bLu4qqJKWq4",
            "title": "MP/PC -  Quantique- L' effet photoélectrique/mesure de la constante de Planck - Centrale MP",
            "url": "https://www.youtube.com/watch?v=bLu4qqJKWq4",
            "duration": "25:50",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "quantique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-_caf1ADM3xk",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MP/PC- Mécanique quantique- Inégalités d'Heisenberg - Einstein vs Bohr-Centrale MP",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés X-ENS.",
        "themes": [
          "mecanique",
          "quantique"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=_caf1ADM3xk",
        "videos": [
          {
            "id": "_caf1ADM3xk",
            "title": "MP/PC- Mécanique quantique- Inégalités d'Heisenberg - Einstein vs Bohr-Centrale MP",
            "url": "https://www.youtube.com/watch?v=_caf1ADM3xk",
            "duration": "19:52",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique",
              "quantique"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-EBbx_gslKBM",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Mécanique - Freinage d'un satellite circulaire - oral Centrale",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés Mines-Ponts.",
        "themes": [
          "mecanique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=EBbx_gslKBM",
        "videos": [
          {
            "id": "EBbx_gslKBM",
            "title": "Mécanique - Freinage d'un satellite circulaire - oral Centrale",
            "url": "https://www.youtube.com/watch?v=EBbx_gslKBM",
            "duration": "20:08",
            "chapitre": "Corrigés Mines-Ponts",
            "themes": [
              "mecanique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-fHAb1ZxdBCI",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Neige artificielle- Oral physique Centrale PSI-MP-PC",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés X-ENS.",
        "themes": [
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=fHAb1ZxdBCI",
        "videos": [
          {
            "id": "fHAb1ZxdBCI",
            "title": "Neige artificielle- Oral physique Centrale PSI-MP-PC",
            "url": "https://www.youtube.com/watch?v=fHAb1ZxdBCI",
            "duration": "15:06",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-lmoMQsmAZ-s",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Oral Centrale physique avec Python- Redressement-Accumulateur-",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés X-ENS.",
        "themes": [
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=lmoMQsmAZ-s",
        "videos": [
          {
            "id": "lmoMQsmAZ-s",
            "title": "Oral Centrale physique avec Python- Redressement-Accumulateur-",
            "url": "https://www.youtube.com/watch?v=lmoMQsmAZ-s",
            "duration": "40:18",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-P2kOesxe73g",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Oral Centrale Supélec physique avec python : effet de peau- MP-PSI-PC",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés X-ENS.",
        "themes": [
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=P2kOesxe73g",
        "videos": [
          {
            "id": "P2kOesxe73g",
            "title": "Oral Centrale Supélec physique avec python : effet de peau- MP-PSI-PC",
            "url": "https://www.youtube.com/watch?v=P2kOesxe73g",
            "duration": "28:56",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-z-W5S_LPRyM",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · PSI-PC-MP TP concours CCP/Centrale-Mesure d'une impédance inconnue",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés Centrale-Supélec.",
        "themes": [
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=z-W5S_LPRyM",
        "videos": [
          {
            "id": "z-W5S_LPRyM",
            "title": "PSI-PC-MP TP concours CCP/Centrale-Mesure d'une impédance inconnue",
            "url": "https://www.youtube.com/watch?v=z-W5S_LPRyM",
            "duration": "10:29",
            "chapitre": "Corrigés Centrale-Supélec",
            "themes": [
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-_p31dPJBvRw",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · TP Physique Mines/CCP/Centrale : Banc à ultra sons-ondes acoustiques",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés Mines-Ponts.",
        "themes": [
          "optique_ondes",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=_p31dPJBvRw",
        "videos": [
          {
            "id": "_p31dPJBvRw",
            "title": "TP Physique Mines/CCP/Centrale : Banc à ultra sons-ondes acoustiques",
            "url": "https://www.youtube.com/watch?v=_p31dPJBvRw",
            "duration": "14:07",
            "chapitre": "Corrigés Mines-Ponts",
            "themes": [
              "optique_ondes",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-THpMG7V9LR8",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Quelques conseils avant les écrits des concours X/ENS/Mines/Centrale CCP/E3A",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés X-ENS.",
        "themes": [
          "mecanique"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=THpMG7V9LR8",
        "videos": [
          {
            "id": "THpMG7V9LR8",
            "title": "Quelques conseils avant les écrits des concours X/ENS/Mines/Centrale CCP/E3A",
            "url": "https://www.youtube.com/watch?v=THpMG7V9LR8",
            "duration": "05:10",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "cs-vid--3ol-CafkAc",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Redressement simple et double alternance- Oral Centrale/Supélec",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés Mines-Ponts.",
        "themes": [
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=-3ol-CafkAc",
        "videos": [
          {
            "id": "-3ol-CafkAc",
            "title": "Redressement simple et double alternance- Oral Centrale/Supélec",
            "url": "https://www.youtube.com/watch?v=-3ol-CafkAc",
            "duration": "12:14",
            "chapitre": "Corrigés Mines-Ponts",
            "themes": [
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-Nw78jcbbXzA",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Réseau de diffraction - Oral Centrale Physique 1 MP/PC/PSI",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés X-ENS.",
        "themes": [
          "optique_ondes",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=Nw78jcbbXzA",
        "videos": [
          {
            "id": "Nw78jcbbXzA",
            "title": "Réseau de diffraction - Oral Centrale Physique 1 MP/PC/PSI",
            "url": "https://www.youtube.com/watch?v=Nw78jcbbXzA",
            "duration": "28:46",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "optique_ondes",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-vid-s6n0WQpI7Uw",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Diffusion thermique- Oral Centrale - Nombre d'ailettes",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés Mines-Ponts.",
        "themes": [
          "thermodynamique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=s6n0WQpI7Uw",
        "videos": [
          {
            "id": "s6n0WQpI7Uw",
            "title": "Diffusion thermique- Oral Centrale - Nombre d'ailettes",
            "url": "https://www.youtube.com/watch?v=s6n0WQpI7Uw",
            "duration": "21:53",
            "chapitre": "Corrigés Mines-Ponts",
            "themes": [
              "thermodynamique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "cs-2019-phys-0",
        "annee": 2019,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Odyssée vers la condensation de Bose-Einstein.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1ftuzReMZjXr63ISufvuLzrgJ4-R1wrAC/preview",
        "correction": "https://drive.google.com/file/d/1qkiDVpYo4xyX7W9XJoNAkhty4szYKu1D/preview",
        "corriges": [
          {
            "id": "cs-2019-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1qkiDVpYo4xyX7W9XJoNAkhty4szYKu1D/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2019-phys-1",
        "annee": 2019,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Acoustique des mousses. Formation et drainage d'un film de savon plan. Film noir.",
        "themes": [
          "optique_ondes"
        ],
        "enonce": "https://drive.google.com/file/d/1iUJsnOMYVnNTWD_lkx6FILjMmku0xlM-/preview",
        "correction": "https://drive.google.com/file/d/1VjLTUAD11K7EOfUZW39TAuHtv0bHHeDf/preview",
        "corriges": [
          {
            "id": "cs-2019-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1VjLTUAD11K7EOfUZW39TAuHtv0bHHeDf/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2019-chim-33",
        "annee": 2019,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Avancées récentes dans le traitement de l'hépatite CPremière partie-- Détection électrochimique du virus de l’hépatite C [diagramme binaire, diagramme E-pH, courbe i-E]Deuxième partie-- Synthèse d’un antiviral utilisé dans le traitement de l’hépatite C [chimie organique, orbitales moléculaires, cinétique]",
        "themes": [
          "chimie_solutions",
          "chimie_archi",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1nwlBAUA7CK152Co2KK-tiX2N_XhCb3Zh/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2018-phys-2",
        "annee": 2018,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Océans, atmosphère et communications. Particules chargées dans l'atmosphère. Ondes acoustiques sous-marines.",
        "themes": [
          "optique_ondes",
          "quantique",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/1NprhTC-wOpzAfa7SGvFj4qQrE4mHr927/preview",
        "correction": "https://drive.google.com/file/d/1qeiY4dUFsHisAki9dHPzcyE0YxcCVfEf/preview",
        "corriges": [
          {
            "id": "cs-2018-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1qeiY4dUFsHisAki9dHPzcyE0YxcCVfEf/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=UsYBCng1WtM",
        "videos": [
          {
            "id": "UsYBCng1WtM",
            "title": "Corrigé Centrale Physique 2018 MP- Thermodynamique : Effet de serre",
            "url": "https://www.youtube.com/watch?v=UsYBCng1WtM",
            "duration": "06:25",
            "chapitre": "Corrigés Centrale-Supélec",
            "themes": [
              "thermodynamique"
            ]
          },
          {
            "id": "v962yKSrR6A",
            "title": "Corrigé (1) Centrale Phys 1 PC 2018 : Particules chargées dans l'atmosphère/siffleurs",
            "url": "https://www.youtube.com/watch?v=v962yKSrR6A",
            "duration": "27:05",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "quantique"
            ]
          }
        ]
      },
      {
        "id": "cs-2018-phys-3",
        "annee": 2018,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "De l'atome d'hydrogène aux galaxies. La raie HI à 21 cm. Étude de l'émission et de l'absorption entre les deux niveaux hyperfins.",
        "themes": [
          "optique_ondes",
          "quantique",
          "mecanique"
        ],
        "enonce": "https://drive.google.com/file/d/1tHwI3ImHC4gaKJ0_l4iVPAEdcMn_AbR4/preview",
        "correction": "https://drive.google.com/file/d/1My6C3RG8ZHH9PA2s2ANxcLw7QIJVbuOh/preview",
        "corriges": [
          {
            "id": "cs-2018-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1My6C3RG8ZHH9PA2s2ANxcLw7QIJVbuOh/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=_1ohXZN1c4A",
        "videos": [
          {
            "id": "_1ohXZN1c4A",
            "title": "Corrigé Centrale PC 2018 Phys 2. partie 1. Atome de Bohr et structure hyperfine",
            "url": "https://www.youtube.com/watch?v=_1ohXZN1c4A",
            "duration": "23:07",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "quantique"
            ]
          },
          {
            "id": "vqQ-bEJEQ8c",
            "title": "Corrigé(2/4)  Centrale MP 2018 Physique 2 : le pendule de Richter",
            "url": "https://www.youtube.com/watch?v=vqQ-bEJEQ8c",
            "duration": "15:55",
            "chapitre": "Corrigés Centrale-Supélec",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "w6PaExN7wXY",
            "title": "Corrigé (1/4) Centrale MP Phys 2  2018: Géophysique de la Terre",
            "url": "https://www.youtube.com/watch?v=w6PaExN7wXY",
            "duration": "17:48",
            "chapitre": "Corrigés Centrale-Supélec",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "cs-2018-chim-34",
        "annee": 2018,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Catalyse asymétriquePremière partie-- Catalyse asymétrique par les métaux de transition : Orbitales moléculaires d’un complexe de géométrie plan-carré, Hydrogénation énantiosélective en présence d’un complexe à ligands chiraux ;Deuxième partie-- Catalyse asymétrique par des acidesα-aminés et organocatalyse asymétrique : À propos de la(S)-proline, Etude préliminaire sur le groupe alcool, Synthèse du caryophyllène avec énantiosélective en présence de(S)-proline ;Troisième partie-- Catalyse asymétrique par des enzymes : Suivi cinétique de l’hydrolyse d’un amide catalysée par l’acylase, Dosage d’un exhausteur de goût mettant en œuvre deux enzymes ;Quatrième partie-- Catalyse asymétrique acido-basique : Synthèse de la résine « Amberlyst 15 dry », Suivi cinétique de l'isomérisation de la (-)-menthone en (+)-isomenthone",
        "themes": [
          "chimie_solutions",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/128ZkZTUdCmq6lJQMwfRYWV6vZ17IxtlD/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2017-phys-4",
        "annee": 2017,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Éléments de communication par fibre optique. Transmission, amplification. Fibre accordable.",
        "themes": [
          "electronique",
          "optique_ondes"
        ],
        "enonce": "https://drive.google.com/file/d/1kKzN72BvzlsilE2-0P7dogpPsPdb2n9Q/preview",
        "correction": "https://drive.google.com/file/d/1e737iQtXKtL0xYXPIlBD8ILFnN_cjQKG/preview",
        "corriges": [
          {
            "id": "cs-2017-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1e737iQtXKtL0xYXPIlBD8ILFnN_cjQKG/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2017-phys-5",
        "annee": 2017,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Interférométrie atomique. Caractérisation de la source atomique. Diffraction du jet atomique par une onde stationnaire. Interféromètre de Mach-Zehnder.",
        "themes": [
          "optique_ondes",
          "mecanique"
        ],
        "enonce": "https://drive.google.com/file/d/1Rp8W9VVEWoVr7q_oKmSOaTqu-DH-C8O6/preview",
        "correction": "https://drive.google.com/file/d/1Y_1aK2_WB4wUcBERm4tM1KZDNhTT_Jr8/preview",
        "corriges": [
          {
            "id": "cs-2017-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1Y_1aK2_WB4wUcBERm4tM1KZDNhTT_Jr8/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=PdnXQdx9abk",
        "videos": [
          {
            "id": "PdnXQdx9abk",
            "title": "Corrigé Centrale Physique 2 MP 2017 : biréfringence d'un rouleau de scotch (III.B)",
            "url": "https://www.youtube.com/watch?v=PdnXQdx9abk",
            "duration": "27:54",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "cs-2017-chim-35",
        "annee": 2017,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Autour du méthacrylate de méthyle : procédé de production en continu de méthacrylate de méthyle ; voie de synthèse du méthacrylate de méthyle par catalyse homogène ; propriétés du polyméthacrylate de méthyle ; synthèse d'une hormone juvénile.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1PRzNhYO6OQjUjR5s8gvf7jDBDVzeBw-8/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2017-chim-36",
        "annee": 2017,
        "filiere": "PC",
        "label": "Chimie · Document annexe",
        "description": "Autour du méthacrylate de méthyle : procédé de production en continu de méthacrylate de méthyle ; voie de synthèse du méthacrylate de méthyle par catalyse homogène ; propriétés du polyméthacrylate de méthyle ; synthèse d'une hormone juvénile.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1W2DpUdx1DuJTas7CpiVvfAcFlu_An9h7/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2016-phys-6",
        "annee": 2016,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "L'effet dynamo, origine du champ géomagnétique ?",
        "themes": [
          "mecanique",
          "quantique",
          "thermodynamique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1zVZrGcQY0uCKJ7wMWieAxNOoY-z-IEiV/preview",
        "correction": "https://drive.google.com/file/d/1vgxeY5iqhczVX7COX2kDnYAy0np4tPVf/preview",
        "corriges": [
          {
            "id": "cs-2016-p-0",
            "titre": "Corrigé A",
            "url": "https://drive.google.com/file/d/1vgxeY5iqhczVX7COX2kDnYAy0np4tPVf/preview"
          },
          {
            "id": "cs-2016-p-1",
            "titre": "Corrigé B",
            "url": "https://drive.google.com/file/d/1Gf4BNmzNtd9TtqM7PUZIGalbkBJaOpRX/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=7oTwo4_Fn1o",
        "videos": [
          {
            "id": "7oTwo4_Fn1o",
            "title": "1er principe industriel-Centrale TSI 2016 Physique 1 (4/5)",
            "url": "https://www.youtube.com/watch?v=7oTwo4_Fn1o",
            "duration": "25:22",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "urrUaRwNiy0",
            "title": "Corrigé (2/4) Concours Centrale Physique 2016",
            "url": "https://www.youtube.com/watch?v=urrUaRwNiy0",
            "duration": "45:31",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "ro_GfGfRxkk",
            "title": "Machines thermiques/thermodynamique- Corrigé Centrale Physique 1 2016 TSI (1/5)",
            "url": "https://www.youtube.com/watch?v=ro_GfGfRxkk",
            "duration": "17:23",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "thermodynamique"
            ]
          },
          {
            "id": "Qm8FaiSxNLA",
            "title": "Machine thermique avec pseudo sources- Corrigé Centrale TSI Physique 1 2016 (2/5)",
            "url": "https://www.youtube.com/watch?v=Qm8FaiSxNLA",
            "duration": "24:44",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "thermodynamique"
            ]
          },
          {
            "id": "KKe8oe7xTKo",
            "title": "Pompe à chaleur/ diagramme enthalpique-Centrale TSI 2016 (5/5)",
            "url": "https://www.youtube.com/watch?v=KKe8oe7xTKo",
            "duration": "27:57",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "thermodynamique"
            ]
          },
          {
            "id": "5RQSoc04sjA",
            "title": "MP/PC Mécanique quantique-Oscillations de la molécule d'ammoniac- Centrale Physique 2016 PC",
            "url": "https://www.youtube.com/watch?v=5RQSoc04sjA",
            "duration": "39:48",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "quantique"
            ]
          }
        ]
      },
      {
        "id": "cs-2016-phys-7",
        "annee": 2016,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Vers une nouvelle définition du kelvin.",
        "themes": [
          "mecanique",
          "electromagnetisme",
          "optique_ondes"
        ],
        "enonce": "https://drive.google.com/file/d/1db4SByMGA2SeXOHvQNdyaGDgCnihsyl1/preview",
        "correction": "https://drive.google.com/file/d/1xw09ivX9jozxNmaaWwecuwR-QYCpmwBt/preview",
        "corriges": [
          {
            "id": "cs-2016-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1xw09ivX9jozxNmaaWwecuwR-QYCpmwBt/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=uEuTAovp-7Q",
        "videos": [
          {
            "id": "uEuTAovp-7Q",
            "title": "Corrigé Concours centrale 2016 Physique 2  PC (1/4)",
            "url": "https://www.youtube.com/watch?v=uEuTAovp-7Q",
            "duration": "16:41",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "I91XOsBIkbw",
            "title": "Corrigé (3/4) concours Centrale supélec Physique 2 PC 2016. Acoustique",
            "url": "https://www.youtube.com/watch?v=I91XOsBIkbw",
            "duration": "43:57",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "optique_ondes"
            ]
          }
        ]
      },
      {
        "id": "cs-2016-chim-37",
        "annee": 2016,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Chimie verte. Autour des biopiles enzymatiques : cinétique de la réaction d'oxydation du glucose catalysée par la glucose oxydase ; biopile glucose-dioxygène ; biopile glucose-urée à gradient de pH. Autour des flavonoïdes : propriétés antioxydantes (cinétique) ; synthèse de flavonoïdes glycosylés (attention, des erreurs dans l'énoncé). Document réponse ajouté à la fin du sujet proprement dit.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1LUjRo2Vi_Fp5q2KEA18miTPFryqDEDgi/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2015-phys-8",
        "annee": 2015,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Son et audition. Ondes acoustiques et oreille externe. Le rôle de l'oreille moyenne. L'oreille interne. L'influx nerveux.",
        "themes": [
          "optique_ondes"
        ],
        "enonce": "https://drive.google.com/file/d/1I7XoJJ-rajqUfCuPNAx2vf8GT8gvWYi-/preview",
        "correction": "https://drive.google.com/file/d/1uhR-CfNLpCKRTkB0W1Xlnn_9amvd0r5s/preview",
        "corriges": [
          {
            "id": "cs-2015-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1uhR-CfNLpCKRTkB0W1Xlnn_9amvd0r5s/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2015-phys-9",
        "annee": 2015,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Traitement des eaux usées. Débitmètre pour eaux usées, dessablage, déshuilage, décantation des boues résiduelles.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/18tOdsL9vO0fHpji6XniHiKjy2o6vFcjc/preview",
        "correction": "https://drive.google.com/file/d/15ACYtdMvp_zWxiG8hGKdYoHE_vIlN3S_/preview",
        "corriges": [
          {
            "id": "cs-2015-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/15ACYtdMvp_zWxiG8hGKdYoHE_vIlN3S_/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2015-chim-38",
        "annee": 2015,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Wacker,Heck,Tsujiet le palladium. Étude du palladium métallique. Le procédéWacker: analyse du procédé, influence des ligands chlorure sur les propriétés oxydoréductrices du cuivre et du palladium, structure et réactivité du complexe de palladium impliqué dans le procédé. La formation de liaisons carbone carbone et la réaction deHeck(analyse documentaire). Synthèse du nakamurol-A. Document réponse ajouté à la fin du sujet proprement dit.",
        "themes": [
          "chimie_orga",
          "chimie_solutions",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1d9ii4Nk3eTOyaTueONltZhh4vTKIeQN0/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2014-phys-10",
        "annee": 2014,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Physique dans un parc d'attraction. Freinage électromagnétique, mesure de la fréquence cardiaque, holographie.",
        "themes": [
          "tp_oraux"
        ],
        "enonce": "https://drive.google.com/file/d/1v9sBfbjWTLWUlH51iWRCY9gR458_RxSa/preview",
        "correction": "https://drive.google.com/file/d/1doywpqBhz4v7gf0D3ZV90aKxrN7rT9qP/preview",
        "corriges": [
          {
            "id": "cs-2014-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1doywpqBhz4v7gf0D3ZV90aKxrN7rT9qP/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2014-phys-11",
        "annee": 2014,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Véhicule de transfert automatique. Phases du voyage et autodestruction.",
        "themes": [
          "electronique"
        ],
        "enonce": "https://drive.google.com/file/d/1_yxDeluG2vhilvJXV_JXPowAiJGpyZii/preview",
        "correction": "https://drive.google.com/file/d/1xZCTDsEhlBqdTp7P-_RN4BPD7H5t22eh/preview",
        "corriges": [
          {
            "id": "cs-2014-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1xZCTDsEhlBqdTp7P-_RN4BPD7H5t22eh/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2014-chim-39",
        "annee": 2014,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Autour du glycérol. Synthèse du glycérol à partir de corps gras : protocole de saponification, mécanisme de l'hydrolyse basique des esters. Quelques utilisations du glycérol : formulation de liquides antigel (diagramme isobare liquide-solide du mélange binaire eau-glycérol), utilisation du glycérol en analyse chimique (complexation des ions borate, acidobasicité). Voies de valorisation du glycérol : thermodynamique et cinétique de la conversion du glycérol en acroléine, utilisation de l'acroléine en synthèse organique : réactions deDiels-Alder, de l'acide acrylique aux polymères (cinétique), du glycérol aux éthers de glycérol. En annexe : document réponse -- Mécanismes de l'hydrolyse basique des esters et diagramme d'énergie potentielle.",
        "themes": [
          "chimie_orga",
          "chimie_solutions",
          "mecanique",
          "chimie_archi",
          "electromagnetisme",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/1R93qeeE9DYX79HHZVf3I8DqII9I0_Sap/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2014-chim-40",
        "annee": 2014,
        "filiere": "PC",
        "label": "Chimie · Document annexe",
        "description": "Autour du glycérol. Synthèse du glycérol à partir de corps gras : protocole de saponification, mécanisme de l'hydrolyse basique des esters. Quelques utilisations du glycérol : formulation de liquides antigel (diagramme isobare liquide-solide du mélange binaire eau-glycérol), utilisation du glycérol en analyse chimique (complexation des ions borate, acidobasicité). Voies de valorisation du glycérol : thermodynamique et cinétique de la conversion du glycérol en acroléine, utilisation de l'acroléine en synthèse organique : réactions deDiels-Alder, de l'acide acrylique aux polymères (cinétique), du glycérol aux éthers de glycérol. En annexe : document réponse -- Mécanismes de l'hydrolyse basique des esters et diagramme d'énergie potentielle.",
        "themes": [
          "chimie_orga",
          "chimie_solutions",
          "mecanique",
          "chimie_archi",
          "electromagnetisme",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/15u_ws_jqkqGmlNcmv1Fpr-Fl-HxvWWPI/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2013-phys-12",
        "annee": 2013,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Rayonnement synchrotron : rayonnement d'une particule chargée accélérée, injecteur, anneau de stockage, spectre du rayonnement émis, onduleurs et wigglers.",
        "themes": [
          "electronique",
          "thermodynamique",
          "quantique"
        ],
        "enonce": "https://drive.google.com/file/d/19IMphPtrN4Pvil6Andth4iAp-LC9HTaj/preview",
        "correction": "https://drive.google.com/file/d/1y8x3I5hj7dGHsI60KUPndTHHIPx8w498/preview",
        "corriges": [
          {
            "id": "cs-2013-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1y8x3I5hj7dGHsI60KUPndTHHIPx8w498/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2013-phys-13",
        "annee": 2013,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Les diélectriques dans la nature et au laboratoire.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1IfaTzgc5xE_mWfaN2iOXK4stGU98pQWI/preview",
        "correction": "https://drive.google.com/file/d/1ZBuvdGC7D4OHwSGzNoCixfkbrcQEn2Rw/preview",
        "corriges": [
          {
            "id": "cs-2013-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1ZBuvdGC7D4OHwSGzNoCixfkbrcQEn2Rw/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2013-chim-41",
        "annee": 2013,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Première partie-- À propos des énamines. Modélisation de la structure, réactivité nucléophile (méthode deHückel), synthèse d'énamines, intérêt des énamines en synthèse organique : alkylation d'aldéhydes, synthèse d'une allomone.Seconde partie-- Interactions physicochimiques. Interactions faibles : températures de changement d'état de composés hydrogénés, polymères du fluorure d'hydrogène. La liaison ionique (!) : structures modèles AB, limites du modèle. La liaison métallique : nickelage chimique à l'hypophosphite (diagramme potentiel-pH du phosphore, en annexe), thermodynamique du frittage du nickel, cinétique de décomposition du nickeltétracarbonyle.",
        "themes": [
          "thermodynamique",
          "chimie_orga",
          "chimie_solutions",
          "electromagnetisme",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1t2IcmN5_7Y9A1Z8N8Bijf14FkCpkQr4h/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2012-phys-14",
        "annee": 2012,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Physique du golf. Mouvement du club, vol de la balle, vibrations de la tête du club.",
        "themes": [
          "mecanique"
        ],
        "enonce": "https://drive.google.com/file/d/1NQnOUQMM8r9lufKr1usWSRtH-Ro1YZ3v/preview",
        "correction": "https://drive.google.com/file/d/1Rg5AggivU_DDOAtQYmIarLlt34ucn62r/preview",
        "corriges": [
          {
            "id": "cs-2012-p-0",
            "titre": "Corrigé A",
            "url": "https://drive.google.com/file/d/1Rg5AggivU_DDOAtQYmIarLlt34ucn62r/preview"
          },
          {
            "id": "cs-2012-p-1",
            "titre": "Corrigé B",
            "url": "https://drive.google.com/file/d/1RX5R2bm093vHXtOfruPdHXp5We1GOMHs/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2012-phys-15",
        "annee": 2012,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Trajectoires électroniques dans un atome. Traitement du rayonnement Zeeman. Étude d'un atome placé dans un champ magnétique, étude des ondes électromagnétiques émises.",
        "themes": [
          "optique_ondes",
          "electronique",
          "electromagnetisme",
          "thermodynamique",
          "mecanique"
        ],
        "enonce": "https://drive.google.com/file/d/1viXDJmblfQbhBwKCWUURP0WAdsQfH-t9/preview",
        "correction": "https://drive.google.com/file/d/1jSpPX2Kw9YNsv40qtjhcZq1FT3-wC_A-/preview",
        "corriges": [
          {
            "id": "cs-2012-p-0",
            "titre": "Corrigé A",
            "url": "https://drive.google.com/file/d/1jSpPX2Kw9YNsv40qtjhcZq1FT3-wC_A-/preview"
          },
          {
            "id": "cs-2012-p-1",
            "titre": "Corrigé B",
            "url": "https://drive.google.com/file/d/18Q6tijZ04UOHA-DDrlXG_SV5uuQkLlHC/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2012-chim-42",
        "annee": 2012,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- Stéréo-isomérie en chimie organique : excès énantiomérique et pureté optique ; augmentation de l'excès énantiomérique ; synthèse du phaséate de méthyle ; chiralité axiale et synthèse asymétrique.Second problème-- Étude de deux diastéréo-isomères, l'acide maléique et l'acide fumarique : propriétés acidobasiques ; solubilités comparées ; propriétés complexantes, application au dépôt de cuivre sur une microélectrode et anodisation du cuivre.",
        "themes": [
          "chimie_orga",
          "chimie_solutions",
          "optique_ondes"
        ],
        "enonce": "https://drive.google.com/file/d/1gFBvXHuOBQOEA8ZScwmkDBj6KYApgxG6/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2011-phys-16",
        "annee": 2011,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Étude dynamique de la couche limite. Cas d'un écoulement de Poiseuille plan. Équation du mouvement dans le couche limite. Autosimilitude des profils de vitesse dans la couche limite dans le cas d'une vitesse extérieure uniforme. Résolution approchée de l'équation de Blasius. Force de frottement subie par la plaque plane dans l'écoulement uniforme. Approche de la force de traînée par des bilans dynamiques.",
        "themes": [
          "mecanique",
          "fluides"
        ],
        "enonce": "https://drive.google.com/file/d/1eu4vkwFtmCPmBbQ1Frot3Rw0RDumn-Ss/preview",
        "correction": "https://drive.google.com/file/d/1IZ5_YsBxR8VtYrji3Iwb3_A3wb6ay2CX/preview",
        "corriges": [
          {
            "id": "cs-2011-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1IZ5_YsBxR8VtYrji3Iwb3_A3wb6ay2CX/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2011-chim-43",
        "annee": 2011,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- Quelques propriétés de l'iode. Propriétés de l'ion triiodure, dosage des ions sulfite d'un vin blanc : étude de la réaction des ions hydrogénosulfite avec les aldéhydes, synthèse électrochimique des ions triiodure, étude des diagrammesE-pH simplifiés de l'iode et du soufre, dosage total des ions hydrogénosulfite d'un vin blanc. Étude de quelques propriétés de l'ion iodure : solubilité de l'iodure de potassium, étude du diagramme de phase eau-iodure de potassium.Second problème-- Synthèse de la dihydrocallitrisine racémique",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1Y2zir3R7IbqF2TbcpmatXYtBAqKlil1D/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2010-phys-17",
        "annee": 2010,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Vibrations musicales. Claviers à percussion, vibrations d'une anche libre.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1Sfxkk7SeVZU3Jq65Q7WPzNEnOpRewxWg/preview",
        "correction": "https://drive.google.com/file/d/1CbN-bJ1pYkk-X0zPh35BTuHZgEemMeJ5/preview",
        "corriges": [
          {
            "id": "cs-2010-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1CbN-bJ1pYkk-X0zPh35BTuHZgEemMeJ5/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=4isWLegtGoY",
        "videos": [
          {
            "id": "4isWLegtGoY",
            "title": "Electromagnétisme- Corrigé extrait  Centrale PSI 2010",
            "url": "https://www.youtube.com/watch?v=4isWLegtGoY",
            "duration": "28:38",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "cs-2010-phys-18",
        "annee": 2010,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Quelques situations physiques liées aux phénomènes nucléaires. La désintégration de l'uranium 235, principe de séparation isotopique par diffusion gazeuse, blindage par une feuille métallique, de la difficulté de blinder efficacement.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1l9mvmz7Qf1d9XXng0piKwhe1g1rQLkBd/preview",
        "correction": "https://drive.google.com/file/d/1qwyqZpbXHcueqxgjHH8klN_GXaaYfqcj/preview",
        "corriges": [
          {
            "id": "cs-2010-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1qwyqZpbXHcueqxgjHH8klN_GXaaYfqcj/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2010-chim-44",
        "annee": 2010,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Première partie-- L'acide oxalique : électrosynthèses autour du dioxyde de carbone, solutions aqueuses d'acide oxalique.Deuxième partie-- Thermodynamique de quelques réactions de dissociation d'acides dans l'eau : grandeurs thermodynamiques associées aux réactions, influence de la température.Troisième partie-- Quelques aspects de la chimie des composés du furane : aromaticité du furane, quelques synthèses du furane, quelques utilisations classiques du furane (synthèse duthf, nitration du furane, réaction deDiels-Alder), synthèse de polyesters furaniques.",
        "themes": [
          "chimie_orga",
          "thermodynamique",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/10O6hWkwCxcdiE4Gn6bQnID7ACFr1a9nL/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2010-chim-45",
        "annee": 2010,
        "filiere": "PC",
        "label": "Chimie · Document annexe",
        "description": "Première partie-- L'acide oxalique : électrosynthèses autour du dioxyde de carbone, solutions aqueuses d'acide oxalique.Deuxième partie-- Thermodynamique de quelques réactions de dissociation d'acides dans l'eau : grandeurs thermodynamiques associées aux réactions, influence de la température.Troisième partie-- Quelques aspects de la chimie des composés du furane : aromaticité du furane, quelques synthèses du furane, quelques utilisations classiques du furane (synthèse duthf, nitration du furane, réaction deDiels-Alder), synthèse de polyesters furaniques.",
        "themes": [
          "chimie_orga",
          "thermodynamique",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1lTlJpgivVmmDiSqLL_bNm1AePuK7dxHb/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2009-phys-19",
        "annee": 2009,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Détection pyroélectrique d'interférences d'ondes thermiques. Étude de la diffusion thermique. Analogie électrocinétique et discrétisation de l'équation de diffusion. Étude d'un détecteur pyroélectrique. Interférences d'ondes thermiques.",
        "themes": [
          "optique_ondes",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/1lPK0-K9by9tGsAlG-YOG_-tzWA0qH3jR/preview",
        "correction": "https://drive.google.com/file/d/1BQtgFzvoUu2v9pZHmnTqDu74tUF96qzR/preview",
        "corriges": [
          {
            "id": "cs-2009-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1BQtgFzvoUu2v9pZHmnTqDu74tUF96qzR/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2009-phys-20",
        "annee": 2009,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Ruissellement d'eau sur une stalactite. Formation d'une stalactite dans une grotte. Formation d'un germe de stalactite sur une main courante cylindrique en bois. Croissance d'une stalactite de bois. Ondulations à la surface des stalactites.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1IpJg1ZZv09505YX9PB8_WJo1mh4i7jLV/preview",
        "correction": "https://drive.google.com/file/d/10QKYkI7tfV23msPW9NvzRI8DEPTYHnqS/preview",
        "corriges": [
          {
            "id": "cs-2009-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/10QKYkI7tfV23msPW9NvzRI8DEPTYHnqS/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2009-chim-46",
        "annee": 2009,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- diagrammes carrés et azéotropie : équilibres liquide-vapeur des systèmes binaires, copolymérisation statistique.Second problème-- synthèse de l'indinavir.",
        "themes": [
          "chimie_orga",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/12p_QWL7_zf8q-g5nOpAVdH1gi3ikj_qC/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2008-phys-21",
        "annee": 2008,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Biophysique de la bactérie Escherichia coli. Taille critique d'une bactérie aérobie. Propriétés électrostatiques de la membrane de la bactérie. Propulsion d'un micro-organisme par flagelle. Moteur rotatif biologique.",
        "themes": [
          "electromagnetisme",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/11zb2Py7kcROqMMp8Ag839hxeixJ84__5/preview",
        "correction": "https://drive.google.com/file/d/18YC6633erhNv1HY9eSFbZN2wykmW643B/preview",
        "corriges": [
          {
            "id": "cs-2008-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/18YC6633erhNv1HY9eSFbZN2wykmW643B/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2008-phys-22",
        "annee": 2008,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "À propos du débitmètre à effet Coriolis. Principe du débitmètre. Étude d'un capteur de vitesse. Filtrage du signal et mesure du déphasage.",
        "themes": [
          "electronique",
          "mecanique",
          "tp_oraux"
        ],
        "enonce": "https://drive.google.com/file/d/18tKwOUMKCgxVkHHTu27GeHPRvP477Qi8/preview",
        "correction": "https://drive.google.com/file/d/1dFwo6e4FiH0VY4WnMwr9C24ws1_1LymH/preview",
        "corriges": [
          {
            "id": "cs-2008-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1dFwo6e4FiH0VY4WnMwr9C24ws1_1LymH/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2008-chim-47",
        "annee": 2008,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- Propriétés et utilisations des ions cyanure : étude structurale (diagramme d'orbitales moléculaires), propriétés basiques et complexantes, diagramme potentiel-pCN de l'argent en solution ; propriétés nucléophiles des ions cyanure, formation de cyanhydrines (étude cinétique).Second problème-- Synthèse partielle du cholestérol (d'après R.B.Woodward).",
        "themes": [
          "electromagnetisme",
          "chimie_orga",
          "chimie_solutions",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1cLmXkISe2ze_S5kasJWVqsIU5S5Exh4L/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2007-phys-23",
        "annee": 2007,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Couleurs par transparence, par diffusion, interférentielles et par diffraction.",
        "themes": [
          "optique_ondes"
        ],
        "enonce": "https://drive.google.com/file/d/101P0xlIxYyRzbPoYabwByyWLuHE9bfdM/preview",
        "correction": "https://drive.google.com/file/d/1V6Nh8AFyTt82tWBxaQy92U1MVkL5Ea9Q/preview",
        "corriges": [
          {
            "id": "cs-2007-p-0",
            "titre": "Corrigé A",
            "url": "https://drive.google.com/file/d/1V6Nh8AFyTt82tWBxaQy92U1MVkL5Ea9Q/preview"
          },
          {
            "id": "cs-2007-p-1",
            "titre": "Corrigé B",
            "url": "https://drive.google.com/file/d/1lIUZGfzEj4TJYDZasXnJyuomRsyZ4TAL/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2007-phys-24",
        "annee": 2007,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Navigation côtière. Ondes dans les fluides.",
        "themes": [
          "fluides",
          "optique_ondes"
        ],
        "enonce": "https://drive.google.com/file/d/188dtIjLdkdufRsv5xO2fYq108sqH_dEK/preview",
        "correction": "https://drive.google.com/file/d/1hN-O8DulqSMTFYSWsMYVfVMc605KwV_r/preview",
        "corriges": [
          {
            "id": "cs-2007-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1hN-O8DulqSMTFYSWsMYVfVMc605KwV_r/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2007-chim-48",
        "annee": 2007,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Monomères, polymères et polymérisations. Étude de quelques polymères formés à partir du styrène ; synthèse peptidique avec la résine deMerrifield. Le polyacétylène : étude d'un modèle orbitalaire de conduction, synthèse. Synthèse industrielle de deux monomères : le chlorure de vinyle (aspects thermodynamiques) et l'adiponitrile par voie électrochimique.",
        "themes": [
          "thermodynamique",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/17aiJRXw8ZsKSX2Mh7XRXoS7P22efbI_V/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2006-phys-25",
        "annee": 2006,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "La neige (Formation de la neige dans l'atmosphère. À propos des avalanches. Appareil de recherche des victimes d'avalanche).",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1jLJGcqbvjU76KTpMyyAqMQoiY1U58iNK/preview",
        "correction": "https://drive.google.com/file/d/1Es0t7dcqMLwNmab8WHlpHgQAU5eS22KN/preview",
        "corriges": [
          {
            "id": "cs-2006-p-0",
            "titre": "Corrigé A",
            "url": "https://drive.google.com/file/d/1Es0t7dcqMLwNmab8WHlpHgQAU5eS22KN/preview"
          },
          {
            "id": "cs-2006-p-1",
            "titre": "Corrigé B",
            "url": "https://drive.google.com/file/d/1BjcWZkgjtVYKeixGA6ljWZ3p5Z5nhCFC/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2006-phys-26",
        "annee": 2006,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Étude d'un variomètre. Préliminaires (Étude de l'atmosphère. Étude de l'écoulement dans un capillaire). Variomètre à tube capillaire (Principe de fonctionnement. Variomètre mécanique). Variomètre à affichage électronique (Étude du système de capacités différentielles. Oscillateur à pont de Wien. Étude globale du capteur).",
        "themes": [
          "electronique",
          "mecanique",
          "fluides"
        ],
        "enonce": "https://drive.google.com/file/d/1q_M8XT5HcbYCB-Gsh6RyUQuHS69QTgwS/preview",
        "correction": "https://drive.google.com/file/d/1VTuZtqKg8HqhsZ0EkGKH0EQoVWim0Hye/preview",
        "corriges": [
          {
            "id": "cs-2006-p-0",
            "titre": "Corrigé A",
            "url": "https://drive.google.com/file/d/1VTuZtqKg8HqhsZ0EkGKH0EQoVWim0Hye/preview"
          },
          {
            "id": "cs-2006-p-1",
            "titre": "Corrigé B",
            "url": "https://drive.google.com/file/d/1R8FRKsWCq5TtjhdgsH7_vMkenbDK0X1d/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2006-chim-49",
        "annee": 2006,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Deux parties : étude de solutions d'électrons solvatés ; étude de la pénicilline V.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1KbrkY06KDawskSRYXl-HqQX10OMljacx/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2005-phys-27",
        "annee": 2005,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Étude d'un capteur interférométrique de déplacement ou de déformation.",
        "themes": [
          "mecanique",
          "quantique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1Hm9ZjurVo1PiieyMCPqb-CY3C8E6ewIw/preview",
        "correction": "https://drive.google.com/file/d/1bJYozMKjDp2hSW3XbkN3YpL3vkLFrv5j/preview",
        "corriges": [
          {
            "id": "cs-2005-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1bJYozMKjDp2hSW3XbkN3YpL3vkLFrv5j/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=_-e7510F0nA",
        "videos": [
          {
            "id": "_-e7510F0nA",
            "title": "MP/PC/PSI Etude du champ magnétique terrestre- concours centrale TSI 2005 (2/2)",
            "url": "https://www.youtube.com/watch?v=_-e7510F0nA",
            "duration": "22:29",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "uUl6Q5Qedns",
            "title": "MPSI/PCSI Particule chargée dans un champ magnétique uniforme- centrale TSI 2005 (1/2)",
            "url": "https://www.youtube.com/watch?v=uUl6Q5Qedns",
            "duration": "36:28",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "quantique"
            ]
          }
        ]
      },
      {
        "id": "cs-2005-phys-28",
        "annee": 2005,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Bulles de champagne (formation, croissance et ascension, explosion).",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1RJFxLoGSuyjvyp3u6ZwtrAEhgu5qmkYq/preview",
        "correction": "https://drive.google.com/file/d/1w1lATDaRBPL841xkuacXqAhfoDLkS-nD/preview",
        "corriges": [
          {
            "id": "cs-2005-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1w1lATDaRBPL841xkuacXqAhfoDLkS-nD/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2005-chim-50",
        "annee": 2005,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Trois parties : titrage d'ions métalliques par l'EDTA ; préparation du dioxyde de titane ; synthèse de quinoléines et applications.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1wq1GDAk29lmO_XKB8mlLbJbSUara8-r3/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2004-phys-29",
        "annee": 2004,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Différents aspects du phénomène des marées océaniques.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1S4PIM87cbdc-TxacFGVwzBbFB45rCEXr/preview",
        "correction": "https://drive.google.com/file/d/122udWXgEIM53K0oJHdY1p-CevYi9S74v/preview",
        "corriges": [
          {
            "id": "cs-2004-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/122udWXgEIM53K0oJHdY1p-CevYi9S74v/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2004-phys-30",
        "annee": 2004,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Mesure de la viscosité de l'air. Mesure de la vitesse d'un fluide conducteur. Étude des ondes acoustiques dans un tuyau crénelé.",
        "themes": [
          "optique_ondes",
          "fluides",
          "tp_oraux"
        ],
        "enonce": "https://drive.google.com/file/d/1KqSMAy1kI1GO65dqfjZLUARvAeZY5_E3/preview",
        "correction": "https://drive.google.com/file/d/1-yQbchI2Ex8BR7HcOH7MAwzIzZ5S_Bx0/preview",
        "corriges": [
          {
            "id": "cs-2004-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1-yQbchI2Ex8BR7HcOH7MAwzIzZ5S_Bx0/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2004-chim-51",
        "annee": 2004,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Deux problèmes : réactions de polyaddition (seule partie dans les fichiers .doc) ; synthèse du furanéol.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1VoUCZYrDbm-5hYglPa5vU3jxT9ZUuV_q/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2003-phys-31",
        "annee": 2003,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Bulles et gouttes.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1bMSWl6zjKpXmd_wCsVX1gfW-Y1_6_8Hp/preview",
        "correction": "https://drive.google.com/file/d/1I1FvXYuJOATpQ8MBbCANvAL6mV3Jg8GN/preview",
        "corriges": [
          {
            "id": "cs-2003-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1I1FvXYuJOATpQ8MBbCANvAL6mV3Jg8GN/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2003-phys-32",
        "annee": 2003,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Polarisation de la lumière.",
        "themes": [
          "optique_ondes"
        ],
        "enonce": "https://drive.google.com/file/d/1Y0D6ugQBEuvZ2AHH61N6XpmRI7VIaXfl/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2003-chim-52",
        "annee": 2003,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Synthèse de la Nootkatone ; À propos de l'iode : thermodynamique du partage du diiode entre deux solvants, oxydoréduction thermodynamique et cinétique.",
        "themes": [
          "chimie_solutions",
          "thermodynamique",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1Jrj-gMtRCaJmvRSQHablYXfs5QiacQ6d/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2002-chim-53",
        "annee": 2002,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Cristallographie (spinelle avec champ cristallin), thermodynamique de l'oxydation du carbone, étude de quelques composés issus de l'huile essentielle de Sassafras.",
        "themes": [
          "chimie_archi",
          "thermodynamique",
          "quantique"
        ],
        "enonce": "https://drive.google.com/file/d/1p69JPigamebQwG8EqgFdUixLFKeD5tk2/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2001-chim-54",
        "annee": 2001,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Stabilité des ions du cuivre en solution aqueuse, influence des ions chlorure et de l'ammoniac ; Diagrammes de phases de céramiques contenant du silicium ; synthèse d'une essence d'iris.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1C6KeUqTvr6inhzHmdlmCT6gWZ4dZMiQW/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2001-chim-55",
        "annee": 2001,
        "filiere": "PC",
        "label": "Chimie · Document annexe",
        "description": "Stabilité des ions du cuivre en solution aqueuse, influence des ions chlorure et de l'ammoniac ; Diagrammes de phases de céramiques contenant du silicium ; synthèse d'une essence d'iris.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/112FTu4AzhhHLLkpNy3EA0PnUW4Fspja8/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "cs-2000-chim-56",
        "annee": 2000,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Les éther-couronne, ligands sélectifs pour les cations (sélectivité, synthèse, application en chromatographie) ; quelques propriétés du nickel et de ses composés (diagramme potentiel-pH, déposition électrolytique du métal, diagrammes binaires nickel-bore et cuivre-nickel) ; synthèse de la Sirénine.",
        "themes": [
          "electromagnetisme",
          "chimie_orga",
          "chimie_solutions",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1PKuK9M5B5u5IDAj6G5mNoF92jW59unJe/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      }
    ]
  },
  {
    "id": "mp",
    "titre": "Mines-Ponts",
    "meta": "France · Filière PC · Physique 1, Physique 2 & Chimie",
    "icon": "⛏️",
    "badgeClass": "ci-mp",
    "sujets": [
      {
        "id": "mp-vid-ftiglAwHsv4",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · 4 étapes pour aborder une \"résolution de problème\" en physique/chimie",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés Mines-Ponts.",
        "themes": [
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=ftiglAwHsv4",
        "videos": [
          {
            "id": "ftiglAwHsv4",
            "title": "4 étapes pour aborder une \"résolution de problème\" en physique/chimie",
            "url": "https://www.youtube.com/watch?v=ftiglAwHsv4",
            "duration": "20:07",
            "chapitre": "Corrigés Mines-Ponts",
            "themes": [
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "mp-vid-qGK2r4qWwQI",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Force de Coriolis- déviation vers l'Est et autres tirs",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés Mines-Ponts.",
        "themes": [
          "mecanique"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=qGK2r4qWwQI",
        "videos": [
          {
            "id": "qGK2r4qWwQI",
            "title": "Force de Coriolis- déviation vers l'Est et autres tirs",
            "url": "https://www.youtube.com/watch?v=qGK2r4qWwQI",
            "duration": "22:51",
            "chapitre": "Corrigés Mines-Ponts",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "mp-vid-Tkfsy4PL4jM",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Le mascaret- bilans de quantité de mouvement et d'énergie (2)",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés Mines-Ponts.",
        "themes": [
          "mecanique",
          "fluides"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=Tkfsy4PL4jM",
        "videos": [
          {
            "id": "Tkfsy4PL4jM",
            "title": "Le mascaret- bilans de quantité de mouvement et d'énergie (2)",
            "url": "https://www.youtube.com/watch?v=Tkfsy4PL4jM",
            "duration": "25:06",
            "chapitre": "Corrigés Mines-Ponts",
            "themes": [
              "mecanique",
              "fluides"
            ]
          }
        ]
      },
      {
        "id": "mp-vid-I7iNFh7fMsI",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MPSI/PCSI Elargisseur de faisceau Laser- Optique géométrique",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés Mines-Ponts.",
        "themes": [
          "optique_ondes"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=I7iNFh7fMsI",
        "videos": [
          {
            "id": "I7iNFh7fMsI",
            "title": "MPSI/PCSI Elargisseur de faisceau Laser- Optique géométrique",
            "url": "https://www.youtube.com/watch?v=I7iNFh7fMsI",
            "duration": "12:45",
            "chapitre": "Corrigés Mines-Ponts",
            "themes": [
              "optique_ondes"
            ]
          }
        ]
      },
      {
        "id": "mp-vid-ltIWqsyZBsQ",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MPSI/PCSI/PTSI - Le secret des régimes transitoires en électricité- Résolution de Problème",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés Mines-Ponts.",
        "themes": [
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=ltIWqsyZBsQ",
        "videos": [
          {
            "id": "ltIWqsyZBsQ",
            "title": "MPSI/PCSI/PTSI - Le secret des régimes transitoires en électricité- Résolution de Problème",
            "url": "https://www.youtube.com/watch?v=ltIWqsyZBsQ",
            "duration": "23:09",
            "chapitre": "Corrigés Mines-Ponts",
            "themes": [
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "mp-2019-phys-0",
        "annee": 2019,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Physique en Arctique. Pôles géographiques et magnétiques. La glace de la banquise (un traîneau sur la glace, croissance hivernale de l'épaisseur de glace). La spirale d'Ekman.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/171XyjV3MKqN8AmyqLvAiUSP0iukuDFB8/preview",
        "correction": "https://drive.google.com/file/d/1GOeHTXape5kELrzlCcNBHCzHDgh1PHqY/preview",
        "corriges": [
          {
            "id": "mp-2019-p-0",
            "titre": "Corrigé A",
            "url": "https://drive.google.com/file/d/1GOeHTXape5kELrzlCcNBHCzHDgh1PHqY/preview"
          },
          {
            "id": "mp-2019-p-1",
            "titre": "Corrigé B",
            "url": "https://drive.google.com/file/d/1z0_-Iw3nKC3D54VEAFrR2QAQWWJ9JrLy/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=FNvOXxxeudM",
        "videos": [
          {
            "id": "FNvOXxxeudM",
            "title": "Corrigé Mines Physique 1 2019 MP/PSI/PC (2/3) : croissance de la glace",
            "url": "https://www.youtube.com/watch?v=FNvOXxxeudM",
            "duration": "31:40",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "81nXa4CKbck",
            "title": "Corrigé Mines Physique 1 2019 MP/PSI/PC (1/3) : pôles géographiques et magnétiques",
            "url": "https://www.youtube.com/watch?v=81nXa4CKbck",
            "duration": "20:37",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "WMU1pkEJJF0",
            "title": "Corrigé Mines Physique 1 2019 MP/PSI/PC (3/3) : Un traîneau sur la glace",
            "url": "https://www.youtube.com/watch?v=WMU1pkEJJF0",
            "duration": "19:42",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "WSDI0hZSyXU",
            "title": "Mines Ponts Physique II MP 2019 - Loi de Gladstone Dale",
            "url": "https://www.youtube.com/watch?v=WSDI0hZSyXU",
            "duration": "35:28",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "mp-2019-phys-1",
        "annee": 2019,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Physique des arbres. Physique du cavitron (pressions négatives, conductance hydraulique, cavitron). Chutes d'arbres (chute d'un arbre mort, chute d'un arbre vivant sous l'effet du vent).",
        "themes": [
          "fluides"
        ],
        "enonce": "https://drive.google.com/file/d/1LtnGJGA4AfasG11ye-ZiOzhLyT7YSlGi/preview",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=Z7TlFiSLWCA",
        "videos": [
          {
            "id": "Z7TlFiSLWCA",
            "title": "Corrigé Mines Physique 2 2019 PSI/PC (1/4) : Pression négative",
            "url": "https://www.youtube.com/watch?v=Z7TlFiSLWCA",
            "duration": "13:26",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "fluides"
            ]
          },
          {
            "id": "gyrFK316ZJY",
            "title": "Mines Physique 2 PSI PC 2019 (2) : écoulement de Poiseuille",
            "url": "https://www.youtube.com/watch?v=gyrFK316ZJY",
            "duration": "16:41",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "fluides"
            ]
          }
        ]
      },
      {
        "id": "mp-2019-chim-28",
        "annee": 2019,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Première partie-- Synthèse énantiosélective du Trifariénol B.Deuxième partie-- La caféine [potentiel chimique, cristallographie, réaction de complexation]",
        "themes": [
          "chimie_orga",
          "electromagnetisme",
          "chimie_solutions",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/19a0whUY43c46zxDgKDwKMVEAIIL2I_Kq/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2018-phys-2",
        "annee": 2018,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Interaction laser-plasma à haut éclairement. Génération d'harmoniques dans les gaz, sur un miroir plasma. Interaction d'une impulsion avec une feuille mince.",
        "themes": [
          "optique_ondes",
          "electronique",
          "mecanique"
        ],
        "enonce": "https://drive.google.com/file/d/1Es54tXyx93Gpznsy8MI05VCHMD-IjENE/preview",
        "correction": "https://drive.google.com/file/d/17EXVhsUktA1qWrc-Jz9d5xemtEZXe9rt/preview",
        "corriges": [
          {
            "id": "mp-2018-p-0",
            "titre": "Corrigé A",
            "url": "https://drive.google.com/file/d/17EXVhsUktA1qWrc-Jz9d5xemtEZXe9rt/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=Vct9A8PoU3g",
        "videos": [
          {
            "id": "Vct9A8PoU3g",
            "title": "MP PSI PC Corrigé Mines Ponts Physique 1 2018",
            "url": "https://www.youtube.com/watch?v=Vct9A8PoU3g",
            "duration": "30:59",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "mp-2018-phys-3",
        "annee": 2018,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Électrons et atomes par l'expérience. Modèle classique de Thomson de l'atome. Émission et absorption par rayonnement. Expérience de Faget et Fert. Déviation du césium par un faisceau lumineux. Mesures expérimentales de la durée de vie de certains états excités de l'hélium. Irradiation d'une vapeur d'hydrogène atomique.",
        "themes": [
          "thermodynamique",
          "optique_ondes",
          "tp_oraux"
        ],
        "enonce": "https://drive.google.com/file/d/1sW6cXMz7Deo16744VUcp3ahEDU1Gw2yA/preview",
        "correction": "https://drive.google.com/file/d/1-pIS9TJ2fhgiHpo__Ev6ANo6Uk1vbL60/preview",
        "corriges": [
          {
            "id": "mp-2018-p-0",
            "titre": "Corrigé A",
            "url": "https://drive.google.com/file/d/1-pIS9TJ2fhgiHpo__Ev6ANo6Uk1vbL60/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2018-chim-29",
        "annee": 2018,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Première partie-- Synthèse du fragment C1–C13 du Leucascandrolide A : Généralités structurales ; Analyse conformationnelle de 1,7-dioxaspiro[5.5]undécanes ; Synthèse de l’intermédiaire spirannique 4 ; Synthèse et caractérisation de la pyrone de départ.Deuxième partie-- l'iodure d'argent [diagramme potentiel-pH, dosage, cristallographie, potentiel chimique, thermodynamique avec tension de surface, pile, cinétique électrochimique].",
        "themes": [
          "chimie_solutions",
          "electromagnetisme",
          "thermodynamique",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1HaqXhxjkaC8N-W4bYLbBUQZ7w_-C0ng3/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2017-phys-4",
        "annee": 2017,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Les memristors. Généralités, conductivité, écoulement, caractéristique i(u).",
        "themes": [
          "electromagnetisme",
          "fluides",
          "electronique",
          "mecanique",
          "quantique"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/1Rmdfk8UkrhgMTSZLEFgBW1rM3-x8NCKR/preview",
        "corriges": [
          {
            "id": "mp-2017-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1Rmdfk8UkrhgMTSZLEFgBW1rM3-x8NCKR/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=rFG6xngmzZw",
        "videos": [
          {
            "id": "rFG6xngmzZw",
            "title": "Corrigé Mines Physique 2 MP 2017 : l'oscillateur harmonique quantique (partie 3)",
            "url": "https://www.youtube.com/watch?v=rFG6xngmzZw",
            "duration": "14:25",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "electronique",
              "quantique"
            ]
          },
          {
            "id": "lpHZXfIFXDE",
            "title": "Corrigé Mines-Ponts 2017 physique 1 MP : La falaise de potentiel",
            "url": "https://www.youtube.com/watch?v=lpHZXfIFXDE",
            "duration": "13:56",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "electromagnetisme"
            ]
          },
          {
            "id": "BSfrBawYAmM",
            "title": "Corrigé Mines 2017 Physique 1 PC  Ecoulement de Poiseuille cylindrique/résistance hydraulique",
            "url": "https://www.youtube.com/watch?v=BSfrBawYAmM",
            "duration": "33:35",
            "chapitre": "Corrigés Mines-Ponts",
            "themes": [
              "fluides"
            ]
          },
          {
            "id": "OIFdXBZz0jQ",
            "title": "Corrigé(1) Mines 2017 PSI Physique 2 : la mission spatiale Rosetta",
            "url": "https://www.youtube.com/watch?v=OIFdXBZz0jQ",
            "duration": "28:42",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "TW7F1aRXFrc",
            "title": "Mines 2017 Physique 1-les memristors- Conductivité- corrigé (2/3) partie 1B",
            "url": "https://www.youtube.com/watch?v=TW7F1aRXFrc",
            "duration": "18:10",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "_XJMqPcBXfg",
            "title": "Mines 2017 Physique 1. Corrigé (1/3) . Toutes  filières MP-PC-PSI.  Les memristors. Partie 1.A.",
            "url": "https://www.youtube.com/watch?v=_XJMqPcBXfg",
            "duration": "24:20",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "BKl8WerFLDM",
            "title": "Corrigé (2)  Mines PSI 2017 Physique 2 : l'assistance gravitationnelle de Rosetta",
            "url": "https://www.youtube.com/watch?v=BKl8WerFLDM",
            "duration": "05:09",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "mp-2017-chim-30",
        "annee": 2017,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Première partie-- L'ITO : Structure ; lixiviat de « e-déchets »; extraction par solvant ; récupération de l'indium métallique ; procédé pyrométallurgique.Deuxième partie-- Synthèse du tétrahydrogestrinone (THG) (utilisant une annélation deRobinson)",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1imiCkdHCqioGeGPepmKUD_ToqOME--PZ/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2016-phys-5",
        "annee": 2016,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Le Millennium Bridge.",
        "themes": [
          "thermodynamique",
          "electromagnetisme",
          "electronique",
          "mecanique",
          "quantique",
          "optique_ondes"
        ],
        "enonce": "https://drive.google.com/file/d/1TbIrZU_SPMUVSy8VJLgt9eKdRkaLmZCj/preview",
        "correction": "https://drive.google.com/file/d/1gogq6D0F2ZjUg07rtUpxNFcqypOaizvs/preview",
        "corriges": [
          {
            "id": "mp-2016-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1gogq6D0F2ZjUg07rtUpxNFcqypOaizvs/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=KH0MnxkVRsE",
        "videos": [
          {
            "id": "KH0MnxkVRsE",
            "title": "MP-PSI-PC : La poutre en résonance- Mines 2016 Physique 1-Corrigé (3/4)",
            "url": "https://www.youtube.com/watch?v=KH0MnxkVRsE",
            "duration": "20:45",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "electronique"
            ]
          },
          {
            "id": "Q8YbQsNusEg",
            "title": "MP/PC  Effet tunnel (2/3) - corrigé Mines Ponts PC 2016",
            "url": "https://www.youtube.com/watch?v=Q8YbQsNusEg",
            "duration": "33:01",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "quantique"
            ]
          },
          {
            "id": "piYViYx0Q0I",
            "title": "MP/PC/PSI Ondes thermiques- Diffusion thermique-Mines Ponts physique PC 2016 (2/4)",
            "url": "https://www.youtube.com/watch?v=piYViYx0Q0I",
            "duration": "15:58",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "optique_ondes",
              "thermodynamique"
            ]
          },
          {
            "id": "Rt4kG7CgjKk",
            "title": "MP/PC/PSI- Système élastique continu -Corrigé Mines Ponts  Physique 1 2016",
            "url": "https://www.youtube.com/watch?v=Rt4kG7CgjKk",
            "duration": "17:50",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "DlU5Lm21Ch4",
            "title": "MP/PC : radioactivité alpha/effet tunnel (3/3) , corrigé Mines Ponts physique 2016  PC",
            "url": "https://www.youtube.com/watch?v=DlU5Lm21Ch4",
            "duration": "25:57",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "quantique"
            ]
          },
          {
            "id": "4osW4Pzr2Qc",
            "title": "MP/PSI/PC- Diffusion thermique (4/4)- Corrigé Concours Mines Ponts 2016 Physique PC",
            "url": "https://www.youtube.com/watch?v=4osW4Pzr2Qc",
            "duration": "14:45",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "thermodynamique"
            ]
          },
          {
            "id": "dFIo79GHnjc",
            "title": "MP/PSI/PC- Diffusion thermique (3/4)- Corrigé Concours Mines Ponts 2016 Physique PC",
            "url": "https://www.youtube.com/watch?v=dFIo79GHnjc",
            "duration": "22:49",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "thermodynamique"
            ]
          },
          {
            "id": "nGQaoxICkaI",
            "title": "Corrigé Mines-Ponts 2016 physique 1 MP-PSI-PC (1/4) : les oscillations du Millenium Bridge",
            "url": "https://www.youtube.com/watch?v=nGQaoxICkaI",
            "duration": "44:30",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "mVRcFRgOiVo",
            "title": "échantillonnage/critère de Shannon. Corrigé Mines-Ponts 2016 physique 1 MP-PSI-PC (2/4)",
            "url": "https://www.youtube.com/watch?v=mVRcFRgOiVo",
            "duration": "18:21",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "electronique"
            ]
          }
        ]
      },
      {
        "id": "mp-2016-phys-6",
        "annee": 2016,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "De la physique dans le tunnel de Fréjus.",
        "themes": [
          "mecanique",
          "quantique",
          "thermodynamique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1NconKbEgaPBk1fICGurpAuOLPwiFyvA-/preview",
        "correction": "https://drive.google.com/file/d/1zoM_jkSCC7JBpV9K96G0uWh1427525WN/preview",
        "corriges": [
          {
            "id": "mp-2016-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1zoM_jkSCC7JBpV9K96G0uWh1427525WN/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=NGLUL7aLhbU",
        "videos": [
          {
            "id": "NGLUL7aLhbU",
            "title": "MP/PC Mécanique quantique (1/3) : l'effet tunnel. Corrigé Mines Ponts Physique 2  PC  2016",
            "url": "https://www.youtube.com/watch?v=NGLUL7aLhbU",
            "duration": "21:32",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "quantique",
              "mecanique"
            ]
          },
          {
            "id": "ylSRc8qsf3w",
            "title": "MP/PC/PSI Diffusion thermique-Mines Ponts 2016 physique 2 PC (1/4)",
            "url": "https://www.youtube.com/watch?v=ylSRc8qsf3w",
            "duration": "17:10",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "thermodynamique"
            ]
          }
        ]
      },
      {
        "id": "mp-2016-chim-31",
        "annee": 2016,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Première partie-- L'urée : structure ; thermodynamique de la réaction de formation de l'urée ; cinétique de la décomposition de l'urée dans l'eau ; conversion électrolytique de l'urée en dihydrogène ; production de dihydrogène par reformage de l'urée en phase vapeur (étude de documents).Deuxième partie-- Synthèse du (±)-2-thiocyanatoneopupukeanane (avec le cycle catalytique du procédéWacker).",
        "themes": [
          "chimie_orga",
          "thermodynamique",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1VCj5YYV0rdb6xQfvktfN_-AxCRbKC83g/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2015-phys-7",
        "annee": 2015,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Propulsion d'engins spatiaux. Loi de vitesse, rendement propulsif du moteur fusée. Limites de la propulsion chimique. Moteur plasma micro-ondes. Moteur ionique pour le maintien d'un satellite en orbite basse.",
        "themes": [
          "mecanique",
          "thermodynamique",
          "electromagnetisme",
          "optique_ondes"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/1Hv5YPram_SFXUTcwDf-4YqxBMN-i_49A/preview",
        "corriges": [
          {
            "id": "mp-2015-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1Hv5YPram_SFXUTcwDf-4YqxBMN-i_49A/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=kscmcs1_QII",
        "videos": [
          {
            "id": "kscmcs1_QII",
            "title": "Bilan d'énergie/tuyère- Mines Ponts physique 1 2015 (2/5)- Toutes filières MP/PSI/PC",
            "url": "https://www.youtube.com/watch?v=kscmcs1_QII",
            "duration": "12:40",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "thermodynamique"
            ]
          },
          {
            "id": "if0CcSZFH_A",
            "title": "La fusée- Corrigé (1/5) Mines Ponts 2015 physique 1 toutes filières MP/PSI/PC",
            "url": "https://www.youtube.com/watch?v=if0CcSZFH_A",
            "duration": "39:29",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "thermodynamique"
            ]
          },
          {
            "id": "G6w5Akgl3qg",
            "title": "Propagation d'une onde électromagnétique dans un plasma-Mines Physique 1 2015-Toutes filières",
            "url": "https://www.youtube.com/watch?v=G6w5Akgl3qg",
            "duration": "37:42",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "electromagnetisme",
              "optique_ondes"
            ]
          },
          {
            "id": "MajnfmAi8Ic",
            "title": "Poussée de la fusée- Corrigé mines 2015 Physique 1 (4/5) toutes filières",
            "url": "https://www.youtube.com/watch?v=MajnfmAi8Ic",
            "duration": "15:06",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "thermodynamique"
            ]
          },
          {
            "id": "7GtEhYKNJFM",
            "title": "Satellite en orbite basse- Corrigé Mines Ponts physique 1 2015 (5/5) toutes filières",
            "url": "https://www.youtube.com/watch?v=7GtEhYKNJFM",
            "duration": "15:13",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "mp-2015-chim-32",
        "annee": 2015,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Première partie-- Chimie atmosphérique : structure de l'ozone et de la molécule d'acide nitreux ; études cinétiques.Deuxième partie-- La bétadine (autour du diiode).Troisième partie-- Synthèse totale du (-)-FR182877.",
        "themes": [
          "chimie_solutions",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/11FO-cmhWJgnYy6Cib7Qi84q4fukNc67O/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2014-phys-8",
        "annee": 2014,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Interactions microscopiques. Polarisabilité, interaction entre molécules polaires, polaire-polarisable, non polaires. Étude des liquides.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1ccup-G4USBCNUE903BCfWT22NbAUMWqa/preview",
        "correction": "https://drive.google.com/file/d/1bbMym373TRQPjhLdPrTGTNOEXmgUfEy-/preview",
        "corriges": [
          {
            "id": "mp-2014-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1bbMym373TRQPjhLdPrTGTNOEXmgUfEy-/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2014-phys-9",
        "annee": 2014,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Autour du magnétisme. Expérience d'Ørsted. Lévitation magnétique. Sonde de Hall.",
        "themes": [
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1CGWE5KWG1wwG1hqL0QrGj_3uUs_-EmF-/preview",
        "correction": "https://drive.google.com/file/d/1ddUklruozj0ekqayiprzuygpx_A6QFfe/preview",
        "corriges": [
          {
            "id": "mp-2014-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1ddUklruozj0ekqayiprzuygpx_A6QFfe/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2014-chim-33",
        "annee": 2014,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- Étude de quelques composés du cuivre : le cuivre et ses alliages, dosage du cuivre dans un laiton (oxydoréduction), diagramme binaire liquide -- solide du système cuivre - argent, thermodynamique de la stabilité de l'oxyde de cuivre(I), stabilité du cuivre(I) en solution aqueuse, cinétique d'évolution de complexes du cuivre(I) et du dioxygène.Second problème-- Synthèse de la (+)-bakkenolide-A.",
        "themes": [
          "chimie_solutions",
          "chimie_archi",
          "thermodynamique",
          "mecanique",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1FmipFg48StaoUGEuqTiJYimVId3UdtBQ/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2013-phys-10",
        "annee": 2013,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Autour d'un dragster à réaction. Mesure de l'accélération, du déplacement. Propulsion par un réacteur d'avion. Contrôle d'épaisseur.",
        "themes": [
          "chimie_orga",
          "tp_oraux"
        ],
        "enonce": "https://drive.google.com/file/d/1ldrQtaFQ_bbFsnNc-fusUJwu5xXshkaZ/preview",
        "correction": "https://drive.google.com/file/d/1TiPuTd8iKBb7LcaxhfkzCNsu3npL-L63/preview",
        "corriges": [
          {
            "id": "mp-2013-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1TiPuTd8iKBb7LcaxhfkzCNsu3npL-L63/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2013-phys-11",
        "annee": 2013,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Rebonds d'une goutte d'eau. Forme d'une goutte, modèle mécanique du rebond, modèle ondulatoire du rebond, pertes lors du rebond, pertes dans l'air.",
        "themes": [
          "mecanique"
        ],
        "enonce": "https://drive.google.com/file/d/1eJXbo5Lus8lDM7d70q0CzFoFixUV81Iw/preview",
        "correction": "https://drive.google.com/file/d/19RzTla_I-iR6VOrytp-9IwlQmAMBw6bx/preview",
        "corriges": [
          {
            "id": "mp-2013-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/19RzTla_I-iR6VOrytp-9IwlQmAMBw6bx/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2013-chim-34",
        "annee": 2013,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- Quelques propriétés du ruthénium. L'atome et le métal, corrosion sèche du ruthénium, alliages métalliques (diagrammes binaires liquide-solide), cinétique de substitution de ligands dans des complexes.Second problème-- Synthèse d'antidépresseurs, la sertraline et la paroxétine.",
        "themes": [
          "chimie_orga",
          "chimie_solutions",
          "chimie_archi",
          "mecanique"
        ],
        "enonce": "https://drive.google.com/file/d/1Q_5QsJE9jWZC6Xz5ncDUFrdCynrtYRA1/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2012-phys-12",
        "annee": 2012,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Propagation de la lumière, approche géométrique, ondulatoire, corpusculaire.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/13Pto5dK01vB7AgeRs2F6eD9KPvM0XS6G/preview",
        "correction": "https://drive.google.com/file/d/1aC7AJaoB1YGq7tTU7DIbnv9ScLJyKITY/preview",
        "corriges": [
          {
            "id": "mp-2012-p-0",
            "titre": "Corrigé A",
            "url": "https://drive.google.com/file/d/1aC7AJaoB1YGq7tTU7DIbnv9ScLJyKITY/preview"
          },
          {
            "id": "mp-2012-p-1",
            "titre": "Corrigé B",
            "url": "https://drive.google.com/file/d/1uoOqIEcAtYEaaSH2Wx-FWnFh65oQGxi2/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2012-phys-13",
        "annee": 2012,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Ondes sonores à l'interface air-eau. Ondes aquatiques de surface. Modélisation d'une toile d'araignée. Vol des papillons.",
        "themes": [
          "optique_ondes"
        ],
        "enonce": "https://drive.google.com/file/d/1hMo-H96vFksF3LDRu0XUYgIjJpo-A31J/preview",
        "correction": "https://drive.google.com/file/d/1-MZe0xh3_PLEcD4ayK4kcvUL97TrkoIe/preview",
        "corriges": [
          {
            "id": "mp-2012-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1-MZe0xh3_PLEcD4ayK4kcvUL97TrkoIe/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2012-chim-35",
        "annee": 2012,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- Quelques propriétés du bore et de ses dérivés : le bore et ses voisins, structure et thermodynamique de l'élaboration du nitrure de bore, l'acide borique en solution aqueuse, le borohydrure de sodium (réaction avec l'eau, dosage indirect par oxydoréduction, réduction des acides carboxyliques), le borax.Second problème-- Synthèse et activité anti-oxydante du resvératrol.",
        "themes": [
          "chimie_solutions",
          "chimie_orga",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/1L3kIPwk3NF_Ph3fR8QhXBwp_EWnFM6Ik/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2011-phys-14",
        "annee": 2011,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Les premiers avions. La propulsion des avions contemporains. Le guidage des avions, un instrument essentiel : l'altimètre.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1IzEtRKEUnH5WCwcWMonFSkCPrzYAnu8l/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2011-phys-15",
        "annee": 2011,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Fibre optique à saut d'indice. Approche géométrique de la propagation. Approche ondulatoire de la propagation. Phénomène optique non linéaire : effet Kerr.",
        "themes": [
          "optique_ondes"
        ],
        "enonce": "https://drive.google.com/file/d/1t7_LP8X3kPgE-ms65hH6ufLhPK6-lNKb/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2011-chim-36",
        "annee": 2011,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- l'hydroxylamine : Tracé d'une courbe densité de courant -- potentiel ; synthèse en pile à combustible ; étude cinétique du traitement des gaz de dissolution du procédéPurex.Second problème-- Synthèse d'un clérodane de type jodrelline à activité antiappétente.",
        "themes": [
          "chimie_solutions",
          "electromagnetisme",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1Qa8JYyBi_WBqXu7KUWaswHOoQiJEwxVC/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2010-phys-16",
        "annee": 2010,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Éléments d'astrophysique. Étude physique des étoiles (énergie potentielle d'une étoile sphérique, théorème du viriel ; pression et température dans une étoile, réactions de fusion ; phénomènes convectifs ; puissance émise et durée de vie du Soleil). Quelques problèmes d'astrophysique (orientation de la queue d'une comète ; la planète Osiris ; le réseau échelette).",
        "themes": [
          "electromagnetisme",
          "thermodynamique",
          "mecanique",
          "fluides",
          "optique_ondes",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1JMFZ4Owwyx7E3I200JWngGiqHCMiD9g5/preview",
        "correction": "https://drive.google.com/file/d/1E2y7AGec4THAKklLHJZ8H_x63l4Wk07U/preview",
        "corriges": [
          {
            "id": "mp-2010-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1E2y7AGec4THAKklLHJZ8H_x63l4Wk07U/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2010-phys-17",
        "annee": 2010,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Lutte contre les incendies de forêts. La lutte au sol (étude du réservoir, vidange du réservoir, fonctionnement de la lance à incendie). La lutte aérienne (étude de l'écopage, aérodynamique du Canadair, caractéristiques de la mission).",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1xPsHIpBcwZ93YqcrCYmD8xkh0rGpJe8Q/preview",
        "correction": "https://drive.google.com/file/d/1jq92W4KFuveHtVLUVFguCm2hqQxa-WhT/preview",
        "corriges": [
          {
            "id": "mp-2010-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1jq92W4KFuveHtVLUVFguCm2hqQxa-WhT/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2010-chim-37",
        "annee": 2010,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- zircon et zirconium : structure du zircon, Enthalpie libre de formation du zircon à partir des oxydes et mesure de solubilité, incorporation d'impuretés dans les zircons naturels, désintégrations radioactives de l'uranium et datation du zircon, amorphisation du zircon par auto-irradiation et aspects thermodynamiques.Deuxième problème-- synthèse de la fluviricine B1.Troisième problème-- Le polyméthacrylate de méthyle (PMAM).",
        "themes": [
          "thermodynamique",
          "chimie_orga",
          "chimie_solutions",
          "chimie_archi",
          "tp_oraux"
        ],
        "enonce": "https://drive.google.com/file/d/1v-j0OBIcyb3itLhrKoiF7uGJ98Jf4WIO/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2009-phys-18",
        "annee": 2009,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Le rayonnement fossile. Expansion de l'univers. La sonde Planck. Pression de radiation.",
        "themes": [
          "thermodynamique",
          "fluides"
        ],
        "enonce": "https://drive.google.com/file/d/1aJG_pQpc5GFSOxWIfIvPg0STQIdrrEoX/preview",
        "correction": "https://drive.google.com/file/d/1ixseNXooOKqRCnQ-t10ojAIrLYJDgXdl/preview",
        "corriges": [
          {
            "id": "mp-2009-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1ixseNXooOKqRCnQ-t10ojAIrLYJDgXdl/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2009-phys-19",
        "annee": 2009,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Le rayon vert. L'atmosphère terrestre. La réfraction atmosphérique. Diffusion atmosphérique. Formation du rayon vert.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1NdiAE5aD6KSqpK0u7OXCRDzwq-_SJeYg/preview",
        "correction": "https://drive.google.com/file/d/1HKEyECRx4DIAmDbC9IXIBcSfYYZ3w0JK/preview",
        "corriges": [
          {
            "id": "mp-2009-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1HKEyECRx4DIAmDbC9IXIBcSfYYZ3w0JK/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2009-chim-38",
        "annee": 2009,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- l'arsenic : propriétés de l'élément, structure et cinétique de décomposition de l'arsine, structure NiAs, changements d'état de l'anhydride arsénieux. NB. Le fichier c09mp1w.doc (le premier dans la liste) a une figure lisible sous windows, le fichier c09mp1e.doc (le second) possède la même figure lisible sous MacOS.Second problème-- différentes synthèses de la frontaline.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1Z-9xEZmRBZ4C8ymDnukdXCwZdCnLkgqx/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2008-phys-20",
        "annee": 2008,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Quelques oscillations. Rail fixe, rail suspendu. Oscillations électriques.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1udUrHb47NH3YvIhrM_mAv14H2Lx85rrz/preview",
        "correction": "https://drive.google.com/file/d/1ciZqBLnmRuMI_N7Tlk-LSH2qpaqVGVVa/preview",
        "corriges": [
          {
            "id": "mp-2008-p-0",
            "titre": "Corrigé A",
            "url": "https://drive.google.com/file/d/1ciZqBLnmRuMI_N7Tlk-LSH2qpaqVGVVa/preview"
          },
          {
            "id": "mp-2008-p-1",
            "titre": "Corrigé B",
            "url": "https://drive.google.com/file/d/1pm8fESMZwjkbDetJ8lKck5C7Pvijkrnh/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2008-phys-21",
        "annee": 2008,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Dispositifs magnétiques. Création de champs magnétiques (bobines de Helmholtz, Mholtzhel). Expérience de Stern et Gerlach. Identification des particules dans une chambre à projection temporelle.",
        "themes": [
          "electromagnetisme",
          "quantique"
        ],
        "enonce": "https://drive.google.com/file/d/1FKnXlSNIA4u3nv5ruJCTKduhXAXeiSgY/preview",
        "correction": "https://drive.google.com/file/d/1JH_K64xCb9_Xvx21aw9eRnLSeMW-RTQh/preview",
        "corriges": [
          {
            "id": "mp-2008-p-0",
            "titre": "Corrigé A",
            "url": "https://drive.google.com/file/d/1JH_K64xCb9_Xvx21aw9eRnLSeMW-RTQh/preview"
          },
          {
            "id": "mp-2008-p-1",
            "titre": "Corrigé B",
            "url": "https://drive.google.com/file/d/1XeND3t1KXqZ3Xxwgx82oa4Chb3EL0A0q/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2008-chim-39",
        "annee": 2008,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- quelques propriétés physicochimiques des dérivés oxygénés de l'azote : thermodynamique, cinétique chimique, titrage du monoxyde d'azote par oxydoréduction en solution aqueuse, diagramme d'orbitales moléculaires et propriétés complexantes du monoxyde d'azote.Second problème-- Synthèse de prostaglandines (d'après E.J.Corey).",
        "themes": [
          "chimie_solutions",
          "thermodynamique",
          "chimie_orga",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1k8m_85cJ3NBdgDepwx4x_756UhuzFn2Q/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2007-phys-22",
        "annee": 2007,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Corde pesante et vibrante.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1Q6mVzJ4scxnWT6ZuIn6vuZlCaYrReZEQ/preview",
        "correction": "https://drive.google.com/file/d/1KmoEKYBVpQhUfNmqWLXRkrZNOae9IIu5/preview",
        "corriges": [
          {
            "id": "mp-2007-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1KmoEKYBVpQhUfNmqWLXRkrZNOae9IIu5/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2007-phys-23",
        "annee": 2007,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Atome hydrogénoïde. Absorption, dispersion. Lame polarisante. Interféromètre.",
        "themes": [
          "optique_ondes"
        ],
        "enonce": "https://drive.google.com/file/d/1Ss3By4XAmohCatMeqH-4A8Iq06-U-u6Z/preview",
        "correction": "https://drive.google.com/file/d/16aB1whcuVwR5LjF92srw4otHNqJt7pom/preview",
        "corriges": [
          {
            "id": "mp-2007-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/16aB1whcuVwR5LjF92srw4otHNqJt7pom/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2007-chim-40",
        "annee": 2007,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Deux problèmes : 1 -- Étude structurale et cinétique d'une enzyme ; 2 -- synthèse de la sphingofungine.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1mp3itCDQsGDdBuNxuwE45FQRCEk4HtYP/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2006-phys-24",
        "annee": 2006,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Propagation d'ondes dans les fluides. Ondes acoustiques dans un tuyau élastique (Ondes acoustiques dans un tuyau rigide. Onde acoustique dans un tuyau élastique. Analyse quantitative d'un changement de tuyau. Application à la circulation sanguine). Ondes de grande longueur d'onde à la surface de l'eau.",
        "themes": [
          "optique_ondes",
          "fluides"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/1UgLftLApQfaNH_8PP0OEIoAlyR8i9oLK/preview",
        "corriges": [
          {
            "id": "mp-2006-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1UgLftLApQfaNH_8PP0OEIoAlyR8i9oLK/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2006-phys-25",
        "annee": 2006,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "La météorologie radar. Principe de la télémétrie radar (Directivité de l'antenne et du faisceau émis. Puissance reçue. Étude des échos. Cible mobile et effet Doppler). Trajet du faisceau électromagnétique. Détection de formations pluvieuses (Précipitation pluvieuse. Absorption et diffusion par la pluie). Détermination de la vitesse de la cible. Radarmétéorologie.",
        "themes": [
          "optique_ondes",
          "chimie_solutions"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/1_6n0x1C17G7Zbg0YH5sHmA7VIigtAcfM/preview",
        "corriges": [
          {
            "id": "mp-2006-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1_6n0x1C17G7Zbg0YH5sHmA7VIigtAcfM/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2006-chim-41",
        "annee": 2006,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Deux problèmes : structure, réactivité et propriétés de quelques alcalins ; synthèse de l'androstérone.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/11EYuEyS3ca6gWqUsJ0p0zJP0n7wT3Lle/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2005-chim-42",
        "annee": 2005,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Deux problèmes : astrochimie ; synthèse de la morphine.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1FLR-VGOba3Xr5AOPZMKEVgbyyeWV7Fi4/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2004-phys-26",
        "annee": 2004,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Quelques aspects de la circulation sanguine et des échanges transmembranaires.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/1By8JL4EFQohShZuAMcHMH82_DfHd-5Hd/preview",
        "corriges": [
          {
            "id": "mp-2004-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1By8JL4EFQohShZuAMcHMH82_DfHd-5Hd/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2004-phys-27",
        "annee": 2004,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Oscillations mécaniques de moments magnétiques.",
        "themes": [
          "mecanique"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/1pPLbeQhewv-hOjUqpyeXOh3sYLGW0hYk/preview",
        "corriges": [
          {
            "id": "mp-2004-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1pPLbeQhewv-hOjUqpyeXOh3sYLGW0hYk/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2004-chim-43",
        "annee": 2004,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Deux problèmes : autour du cobalt ; synthèse du 7,20-diisocyanoadociane.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1JBbQw00tAhEmYvnUAPuhwNXdAa3g48cW/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2003-chim-44",
        "annee": 2003,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Deux parties : étude de quelques métaux de transition ; synthèse de l'aspartame.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1__xinUpz6H57fO7x53j7ngSOrBQvtxcN/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2002-chim-45",
        "annee": 2002,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Deux parties : introduction au génie de la réaction chimique (cinétique chimique) ; synthèse de l'occidentalol.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1nS-7pn9JCNxLUIjNbUaSMol3sR9oGb8y/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2001-chim-46",
        "annee": 2001,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Chimie inorganique -- quelques propriétés du nickel et de ses alliages (thermodynamique, cristallographie). Chimie organique -- synthèse de la cortisone.",
        "themes": [
          "chimie_orga",
          "thermodynamique",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/15ZmRYkrsoGqcZ-krDJYhSj2H8-CPTfLH/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "mp-2000-chim-47",
        "annee": 2000,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Chimie inorganique -- atomistique, chimie des solutions (neutralisation d'effluents cationiques), complexes du mercure(II). Chimie organique -- synthèse du lilial.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1xPkHj3TQl3-oGcNl8VhG00kG3C-KjZWl/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      }
    ]
  },
  {
    "id": "ccinp",
    "titre": "CCINP — Concours Communs INP",
    "meta": "France · Filière PC · Physique, Modélisation & Chimie",
    "icon": "🎯",
    "badgeClass": "ci-ccinp",
    "sujets": [
      {
        "id": "ccinp-vid-FEglMZ1uxDo",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Les épreuves et coefficients aux Concours Communs Polytechniques CCP Physique et Chimie (PC)",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés X-ENS.",
        "themes": [
          "mecanique"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=FEglMZ1uxDo",
        "videos": [
          {
            "id": "FEglMZ1uxDo",
            "title": "Les épreuves et coefficients aux Concours Communs Polytechniques CCP Physique et Chimie (PC)",
            "url": "https://www.youtube.com/watch?v=FEglMZ1uxDo",
            "duration": "04:06",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "ccinp-2019-phys-0",
        "annee": 2019,
        "filiere": "PC",
        "label": "Physique · Physique",
        "description": "De l'évolution du concept d'atome au cours du XXe siècle. Limite du modèle de Thomson à travers l'expérience de Rutherford. Limite du modèle planétaire. Postulats de Bohr. Expérience de Stern et Gerlach. L'effet Zeeman normal. Orbitales atomiques.",
        "themes": [
          "mecanique",
          "quantique",
          "thermodynamique",
          "electromagnetisme"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/1JS3CfJ5Y9oY4ZKr1mQjSv_WnZFK9hXy7/preview",
        "corriges": [
          {
            "id": "ccinp-2019-p-0",
            "titre": "Corrigé A",
            "url": "https://drive.google.com/file/d/1JS3CfJ5Y9oY4ZKr1mQjSv_WnZFK9hXy7/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=hKInxroik7k",
        "videos": [
          {
            "id": "hKInxroik7k",
            "title": "Corrigé CCINP Physique PC 2019 (1/4) : expérience de Rutherford.",
            "url": "https://www.youtube.com/watch?v=hKInxroik7k",
            "duration": "23:39",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "quantique"
            ]
          },
          {
            "id": "wVIKwl084pQ",
            "title": "Corrigé CCP MP Physique 2019 (1/4)",
            "url": "https://www.youtube.com/watch?v=wVIKwl084pQ",
            "duration": "23:43",
            "chapitre": "Corrigés CCINP / CCP",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "YE-nbGPg6GM",
            "title": "Rayonnement du dipôle CCINP 2019 MP Physique",
            "url": "https://www.youtube.com/watch?v=YE-nbGPg6GM",
            "duration": "12:05",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "electromagnetisme",
              "thermodynamique"
            ]
          }
        ]
      },
      {
        "id": "ccinp-2019-chim-16",
        "annee": 2019,
        "filiere": "PC",
        "label": "Chimie · Chimie,",
        "description": "Premier problème-- La serricornine [chimie organique].Second problème-- Le rhodium : Extraction du rhodium [Lewis, réaction de complexaton] ; Utilisation de complexes de rhodium en tant que catalyseur [cycle catalytique hydrofomylation] ; Propriétés des alliages platine-rhodium [cristallographie, diagramme binaire, thermodynamique, cinétique]",
        "themes": [
          "chimie_orga",
          "chimie_archi",
          "thermodynamique",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/14GqAAE9dPv9SYh6B-u-IelEzf31NH9kA/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2018-phys-1",
        "annee": 2018,
        "filiere": "PC",
        "label": "Physique · Physique",
        "description": "Procédés physiques de transmission d'un signal. Le câble coaxial. La fibre optique.",
        "themes": [
          "optique_ondes",
          "electronique",
          "mecanique"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/1m5ncZU1Fb01E0Tz-AysRYpE_EvldFXnH/preview",
        "corriges": [
          {
            "id": "ccinp-2018-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1m5ncZU1Fb01E0Tz-AysRYpE_EvldFXnH/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=sRiocO3mk1A",
        "videos": [
          {
            "id": "sRiocO3mk1A",
            "title": "Corrigé (2) CCP Physique PC 2018 : dispersion-absorption",
            "url": "https://www.youtube.com/watch?v=sRiocO3mk1A",
            "duration": "22:15",
            "chapitre": "Corrigés CCINP / CCP",
            "themes": [
              "optique_ondes"
            ]
          },
          {
            "id": "6AgOVWwH2pw",
            "title": "Electronique- générateur de signaux - corrigé CCP Physique TSI 2018",
            "url": "https://www.youtube.com/watch?v=6AgOVWwH2pw",
            "duration": "27:56",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "electronique"
            ]
          },
          {
            "id": "FbyROi3heq8",
            "title": "Corrigé (1) CCP PC Physique  2018",
            "url": "https://www.youtube.com/watch?v=FbyROi3heq8",
            "duration": "20:49",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "ccinp-2018-chim-17",
        "annee": 2018,
        "filiere": "PC",
        "label": "Chimie · Chimie,",
        "description": "Premier problème-- Le monoxyde de carbone : Toxicité du monoxyde de carbone (Fixation du monoxyde de carbone par l’hémoglobine [orbitales moléculaires], Intoxication au monoxyde de carbone) ; Synthèse du monoxyde de carbone [thermochimie] ; Synthèse du phosgène à partir du monoxyde de carbone [cinétique].Second problème-- Synthèse de la (+)-­lupinine et du (–)-­épiquinamide : Synthèse de la (+)-­lupinine ; ­Synthèse du (–)-­épiquinamide.",
        "themes": [
          "mecanique",
          "chimie_archi",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1BWCbUUwBHVcSjwYJKMgO7qBiAfgYLLNM/preview",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=flv6T2SCZqw",
        "videos": [
          {
            "id": "flv6T2SCZqw",
            "title": "Corrigé (1) CCP MP Physique Chimie 2018",
            "url": "https://www.youtube.com/watch?v=flv6T2SCZqw",
            "duration": "22:25",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "98lNEeJpQrk",
            "title": "Corrigé (2) CCP MP 2018 Physique chimie",
            "url": "https://www.youtube.com/watch?v=98lNEeJpQrk",
            "duration": "20:41",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "ccinp-2018-chim-18",
        "annee": 2018,
        "filiere": "PC",
        "label": "Chimie · Modélisation de systèmes physiques ou chimiques, Enoncé",
        "description": "Étude d’une réaction exothermique : stabilité thermique en réacteur fermé",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/10cofhY3jow7BlxZyKNENUPa9SwTE89Az/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2017-phys-2",
        "annee": 2017,
        "filiere": "PC",
        "label": "Physique · Physique",
        "description": "La circulation sanguine : généralités, loi de Poiseuille, loi de Murray, élasticité des vaisseaux, effet Doppler. Enrichissement de l'uranium.",
        "themes": [
          "electromagnetisme",
          "fluides",
          "electronique",
          "optique_ondes",
          "quantique",
          "mecanique"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/1g57sQCVxSktTyo8RnJnOp2DpeEXU_Tf1/preview",
        "corriges": [
          {
            "id": "ccinp-2017-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1g57sQCVxSktTyo8RnJnOp2DpeEXU_Tf1/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=83cWpynrON8",
        "videos": [
          {
            "id": "83cWpynrON8",
            "title": "Corrigé (2) CCP Physique MP 2017 : la RMN- Précession",
            "url": "https://www.youtube.com/watch?v=83cWpynrON8",
            "duration": "15:20",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "quantique"
            ]
          },
          {
            "id": "ZdcNCt-0WwE",
            "title": "Corrigé (3) CCP MP 2017 physique - Les champs magnétiques (La RMN)",
            "url": "https://www.youtube.com/watch?v=ZdcNCt-0WwE",
            "duration": "15:20",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "quantique"
            ]
          },
          {
            "id": "gY7vT1DeYSo",
            "title": "Corrigé CCP MP 2017 Physique : Trajectoires des plombs d'une cartouche",
            "url": "https://www.youtube.com/watch?v=gY7vT1DeYSo",
            "duration": "22:56",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "WEkcl_U4Yl4",
            "title": "Corrigé CCP PSI 2017 PartieA Physique : actionneur électromagnétique",
            "url": "https://www.youtube.com/watch?v=WEkcl_U4Yl4",
            "duration": "48:34",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "hk7S4QJujT8",
            "title": "Corrigé (1)  CCP Physique MP 2017 - La résonance magnétique nucléaire",
            "url": "https://www.youtube.com/watch?v=hk7S4QJujT8",
            "duration": "17:36",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "electronique",
              "quantique"
            ]
          },
          {
            "id": "pU-oQORhDBs",
            "title": "Corrigé (4) RMN CCP MP physique 2017 : champ magnétique créé dans un supra conducteur-effet Meissner",
            "url": "https://www.youtube.com/watch?v=pU-oQORhDBs",
            "duration": "12:24",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "electromagnetisme",
              "quantique"
            ]
          },
          {
            "id": "dBrXD17alH8",
            "title": "Corrigé CCP 2017 Physique PC :  partie 4 : le rôle de l'élasticité des vaisseaux",
            "url": "https://www.youtube.com/watch?v=dBrXD17alH8",
            "duration": "41:20",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "Y9zVOKPRKH0",
            "title": "Corrigé CCP Physique PC 2017 : la circulation sanguine",
            "url": "https://www.youtube.com/watch?v=Y9zVOKPRKH0",
            "duration": "44:21",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "ccinp-2017-chim-19",
        "annee": 2017,
        "filiere": "PC",
        "label": "Chimie · Chimie,",
        "description": "Premier problème-- Le sodium : Étude du noyau du sodium, Propriétés physico-chimiques du sodium, Élaboration industrielle du sodium métallique, Utilisation du sodium métallique, Polarité de la liaison Na-H.Second problème-- Synthèse du fragment Nord-Est de la griséoviridine (dont réaction deMitsunobu).",
        "themes": [
          "chimie_orga",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/16HHfzv7z83eL36SXt8IHUjWehVWHmxpa/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2016-chim-20",
        "annee": 2016,
        "filiere": "PC",
        "label": "Chimie · Chimie,",
        "description": "Premier problème-- Autour du radical hydroxyle : Approche théorique (diagramme d'orbitales moléculaires) et détection expérimentale, réactivité en milieu biologique (oxydoréduction), génération par radiolyse de l'eau (analyse documentaire), production en photocatalyse (cristallochimie).Second problème-- Synthèse de l'oseltamivir (seule partie présente dans le fichier doc(x) du corrigé).",
        "themes": [
          "chimie_orga",
          "chimie_solutions",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1FLsatJokF4ra0YcWQ61_e0lad_R1ybF_/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2016-chim-21",
        "annee": 2016,
        "filiere": "PC",
        "label": "Chimie · Modélisation de systèmes physiques ou chimiques, Enoncé",
        "description": "Détermination du coefficient de transfert d'un polluant dans une colonne d'absorption : modélisation des phénomènes (bilans de matière, cinétique chimique) ; traitement numérique des données expérimentales (à l'aide de Python ou Scilab).",
        "themes": [
          "electronique",
          "optique_ondes",
          "tp_oraux",
          "mecanique",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/17uW5-0dtzVY-1SQvw43WDYotMx4kcTj8/preview",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=BLQwE4scMxs",
        "videos": [
          {
            "id": "BLQwE4scMxs",
            "title": "MP/PC Expérience de Stern et Gerlach (1/2) - CCP Physique TPC 2016",
            "url": "https://www.youtube.com/watch?v=BLQwE4scMxs",
            "duration": "22:28",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "9N3YSDzRBlg",
            "title": "Rendement d'un haut parleur - CCP 2016 PC (2/2)",
            "url": "https://www.youtube.com/watch?v=9N3YSDzRBlg",
            "duration": "18:58",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "DLHFj2SEdzs",
            "title": "Expérience de Stern et Gerlach (2/2) CCP physique 2016 TPC",
            "url": "https://www.youtube.com/watch?v=DLHFj2SEdzs",
            "duration": "41:43",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "ccinp-2015-chim-22",
        "annee": 2015,
        "filiere": "PC",
        "label": "Chimie · Chimie,",
        "description": "Premier problème-- Propriétés physico-chimiques du calcium et de ses dérivés : atomistique, radioactivité et datation, cristallochimie, diagramme de phases solide-liquide, solubilité du carbonate de calcium, thermodynamique de la calcination du carbonate de calcium.Second problème-- Synthèses de fragments de l'amphidinidol 3.",
        "themes": [
          "thermodynamique",
          "mecanique",
          "chimie_orga",
          "chimie_solutions",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1T08l-vK0PgpXPFs6BKUXvwdF6q3qccJJ/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2014-phys-3",
        "annee": 2014,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Un vol en ballon. Évolution d'un ballon dans une atmosphère isotherme. Diffusion thermique, convection.",
        "themes": [
          "thermodynamique"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/13cPmOSD1kfUC9a4AMd-cehPmiIbs4TQL/preview",
        "corriges": [
          {
            "id": "ccinp-2014-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/13cPmOSD1kfUC9a4AMd-cehPmiIbs4TQL/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2014-phys-4",
        "annee": 2014,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Thermodynamique dans un réacteur à eau pressurisée. Rayonnement dans un cyclotron. Modèle de l'électron élastiquement lié.",
        "themes": [
          "thermodynamique"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/12Bp3Xr0EFd2vb3o_CCRMf_t4v7Tfseh2/preview",
        "corriges": [
          {
            "id": "ccinp-2014-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/12Bp3Xr0EFd2vb3o_CCRMf_t4v7Tfseh2/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2014-chim-23",
        "annee": 2014,
        "filiere": "PC",
        "label": "Chimie · Chimie 1,",
        "description": "Premier problème-- Quelques utilisations du plomb. Atomistique. La galène, étude cristallographique, thermodynamique du grillage. Alliages plomb -- étain, diagramme binaire solide -- liquide. Le plomb en solution aqueuse, diagramme potentiel -- pH, l'accumulateur au plomb, l'électrode de plomb.Second problème-- Trois synthèses du jasmonate de méthyle.",
        "themes": [
          "chimie_archi",
          "chimie_solutions",
          "electromagnetisme",
          "thermodynamique",
          "mecanique",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1sP4K8FRnUx7i85HOohV_1dhZK4221g-7/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2014-chim-24",
        "annee": 2014,
        "filiere": "PC",
        "label": "Chimie · Chimie 2,",
        "description": "Premier problème-- Quelques applications de la chimie des complexes des métaux de transition. Géométrie, stéréochimie et chimie en solution aqueuse de quelques complexes du cobalt. Thermodynamique et cinétique de la réaction d'hydroformylation du propène. Diagramme potentiel -- pH du fer. Régulation du pH sanguin.Second problème-- Approche synthétique de l'andrastine C.",
        "themes": [
          "chimie_solutions",
          "chimie_orga",
          "electromagnetisme",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/1FnEzxjBqeEYZ6CfnXAsXAFlvw4Au7NwX/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2013-phys-5",
        "annee": 2013,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Contraste interférentiel. Une balançoire.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/1GUoQmtmKo0D8Fh8fBqOoZqRNCB8kYtkd/preview",
        "corriges": [
          {
            "id": "ccinp-2013-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1GUoQmtmKo0D8Fh8fBqOoZqRNCB8kYtkd/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=4AmdmiTzpFY",
        "videos": [
          {
            "id": "4AmdmiTzpFY",
            "title": "Corrigé CCP PSI 2013 : bilans de quantité de mvt et d'énergie sur une éolienne",
            "url": "https://www.youtube.com/watch?v=4AmdmiTzpFY",
            "duration": "40:59",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "ccinp-2013-chim-25",
        "annee": 2013,
        "filiere": "PC",
        "label": "Chimie · Chimie 1,",
        "description": "Premier problème-- L'iode : atomistique, le diiode solide, thermodynamique de la solubilité du diiode dans l'eau pure et en présence d'ions iodure, cinétique de l'iodation de la propanone, diagramme potentiel-pH de l'iode, formation des ions triiodure par électrolyse.Second problème-- Synthèse du laulimalide.",
        "themes": [
          "chimie_solutions",
          "electromagnetisme",
          "thermodynamique",
          "mecanique",
          "chimie_orga",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1RkwHLLeOuwxZxmEHgKDtI6PEcG4V8P9W/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2013-chim-26",
        "annee": 2013,
        "filiere": "PC",
        "label": "Chimie · Chimie 2,",
        "description": "Premier problème-- L'électron en chimie, de l'atome au métal. De l'atome à la molécule : diagramme d'orbitales moléculaires de HF. L'électron solvaté dans l'ammoniac : étude cinétique. Réactions de transfert d'électrons : piles à combustible, étude thermodynamique. Les métaux : alliage or-argent, cristallographie, diagramme binaire liquide-solide.Second problème-- Synthèse de la citréoviridine.",
        "themes": [
          "chimie_archi",
          "chimie_orga",
          "chimie_solutions",
          "electronique",
          "thermodynamique",
          "mecanique"
        ],
        "enonce": "https://drive.google.com/file/d/18HSvhehvg2VAWdJJhWMoNFzIk1YSjUkQ/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2012-phys-6",
        "annee": 2012,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Étude d'une lentille épaisse. Modèle d'électron élastiquement lié. Pouvoir rotatoire d'un milieu.",
        "themes": [
          "mecanique",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1yt8Rq3WOQrLe3konVH_z0Y3SfydcPmNb/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2012-phys-7",
        "annee": 2012,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Spectroscope à prisme, spectroscope à réseau, métrologie par opposition.",
        "themes": [
          "optique_ondes"
        ],
        "enonce": "https://drive.google.com/file/d/1k4sQqeltR5pIg6onHluCs_J3Mbla4XZH/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2012-chim-27",
        "annee": 2012,
        "filiere": "PC",
        "label": "Chimie · Chimie 1,",
        "description": "Premier problème-- Étude comparative de quelques propriétés de l'aluminium et du magnésium : atomistique, énergie de première ionisation, étude cristallographique de l'aluminium et du magnésium, diagramme de phases aluminium/magnésium, étude thermodynamique de la réduction de l'alumine, analyse de la teneur en aluminium d'un minerai, électrolyse de l'alumine.Second problème-- Synthèse du taxol.",
        "themes": [
          "thermodynamique",
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1gwFyt-hNUumH_-zTEc7UYjapfvCyDjmE/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2012-chim-28",
        "annee": 2012,
        "filiere": "PC",
        "label": "Chimie · Chimie 2,",
        "description": "Premier problème-- Autour de l'élément fer : l'ion cyanure et le monoxyde de carbone, ligands du fer ; métallothermie du fer ; chimie du fer et du cyanure en solution (complexation, précipitation, oxydoréduction) ; cinétique d'oxydation de l'acide ascorbique.Second problème-- Synthèse diastéréosélective d'un précurseur de l'acide berkelique.",
        "themes": [
          "chimie_solutions",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1jEVl9KsBxqKi9NelpWFX0mFjXqDuX18j/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2011-phys-8",
        "annee": 2011,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Phénomène d'écrantage dans un électrolyte faiblement concentré. Moment cinétique intrinsèque de la lumière.",
        "themes": [
          "mecanique",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1Ecp3CJ4Rxf482Fa-D6Gi89SlnT2y4Lxg/preview",
        "correction": "https://drive.google.com/file/d/1sZxDYXhGVS0rt0e4dMCPIOxOHsGu6X52/preview",
        "corriges": [
          {
            "id": "ccinp-2011-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1sZxDYXhGVS0rt0e4dMCPIOxOHsGu6X52/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2011-phys-9",
        "annee": 2011,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Propagation le long d'une ligne électrique, effet d'échos, reproduction retardée d'un signal. Déconvenues expérimentales dans les domaines électrique, électronique et optique.",
        "themes": [
          "electronique",
          "optique_ondes"
        ],
        "enonce": "https://drive.google.com/file/d/1hI5NWYacCiUu80BNvfdVjJNK5DJHzy90/preview",
        "correction": "https://drive.google.com/file/d/1291REt1w_3kyQy2llNNFaXFDDKWvPW4L/preview",
        "corriges": [
          {
            "id": "ccinp-2011-p-0",
            "titre": "Corrigé A",
            "url": "https://drive.google.com/file/d/1291REt1w_3kyQy2llNNFaXFDDKWvPW4L/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2011-chim-29",
        "annee": 2011,
        "filiere": "PC",
        "label": "Chimie · Chimie 1,",
        "description": "Autour des liquides ioniques : étude thermodynamique (mélange binaire liquide solide) et cristallographique de cristaux ioniques ; étude structurale d'ions organiques (méthode deHückel) ; synthèse de liquides ioniques, dosage d'ions chlorure ; utilisation des liquides ioniques : thermodynamique, électrochimie cinétique, chimie organique.",
        "themes": [
          "chimie_orga",
          "chimie_solutions",
          "chimie_archi",
          "thermodynamique",
          "mecanique"
        ],
        "enonce": "https://drive.google.com/file/d/11qBnEsCbEvrzeHYrFtQ18csvOjs0tf_5/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2011-chim-30",
        "annee": 2011,
        "filiere": "PC",
        "label": "Chimie · Chimie 2,",
        "description": "Premier problème-- L'argent dans tous ses états : configuration électronique et géométrie des complexes d'argent, dosage conductimétrique des ions chlorure, étude de la synthèse et de la formation de nanostructures d'argent, oxyde et sulfure d'argent (thermodynamique).Second problème-- Synthèse totale de l'acide(-)-trans-3-hydroxypipécolique et de la(-)-swainsonine.",
        "themes": [
          "chimie_solutions",
          "electronique",
          "thermodynamique",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1K-n_4CxV3gUR2urbwVjmYsMTuG3Cr98u/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2010-phys-10",
        "annee": 2010,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Oscillateurs à relaxation (vidange d'un réservoir, influence du siphon, réservoir alimenté, analogie électronique). Effet Doppler et ondes sonores (Approche heuristique de l'effet Doppler, thermodynamique des ondes sonores, ondes longitudinales dans un tube, vélocimétrie).",
        "themes": [
          "optique_ondes",
          "thermodynamique",
          "electronique"
        ],
        "enonce": "https://drive.google.com/file/d/1EPVtrtaJvTP9wlirmk3HlyRJkhpy17Xt/preview",
        "correction": "https://drive.google.com/file/d/1RYDVv9gSDx9SkXjlAXetAHBK_YxM5c85/preview",
        "corriges": [
          {
            "id": "ccinp-2010-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1RYDVv9gSDx9SkXjlAXetAHBK_YxM5c85/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=O7BjVatk-uc",
        "videos": [
          {
            "id": "O7BjVatk-uc",
            "title": "Corrigé  CCP physique 1 psi 2010 (1/2) acoustique",
            "url": "https://www.youtube.com/watch?v=O7BjVatk-uc",
            "duration": "26:16",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "optique_ondes"
            ]
          },
          {
            "id": "1XnpQUBtWOk",
            "title": "PC/PSI: Corrigé (2/2) CCP physique 1 acoustique psi 2010",
            "url": "https://www.youtube.com/watch?v=1XnpQUBtWOk",
            "duration": "37:22",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "optique_ondes"
            ]
          }
        ]
      },
      {
        "id": "ccinp-2010-phys-11",
        "annee": 2010,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Interférométrie à deux ondes (ondes électromagnétiques dans le vide, superposition d'ondes et conditions d'interférences, dispositif interférentiel de Mach-Zehnder). Gain de temps et économie d'énergie (gestion de la régulation thermique d'un logement, analogie électrique, pompe à chaleur à cycle Stirling).",
        "themes": [
          "optique_ondes",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/1oLipjF-WExyMp_P8rAXotH_MaNIAKspW/preview",
        "correction": "https://drive.google.com/file/d/1Zh493tpEv2shMktbKvOkH3PHbjbep8-R/preview",
        "corriges": [
          {
            "id": "ccinp-2010-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1Zh493tpEv2shMktbKvOkH3PHbjbep8-R/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2010-chim-31",
        "annee": 2010,
        "filiere": "PC",
        "label": "Chimie · Chimie 1,",
        "description": "Autour de la forskoline 1 .Première partie-- Quelques propriétés physicochimiques de l'élément mercure et de ses dérivés : Atomistique, chlorure mercurique, structure cristallographique du sulfure de mercure, étude de la réaction de grillage du cinabre, étude thermodynamique d'un amalgame sodium-mercure, solubilité de l'oxyde mercurique HgO dans l'eau et en milieu ammoniacal, étude du diagramme E-pH du mercure, réaction d'électrolyse sur électrode de mercure .Deuxième partie-- Étude de différentes étapes de l'élaboration d'un intermédiaire-clé dans la synthèse de la forskoline 1.",
        "themes": [
          "chimie_solutions",
          "chimie_orga",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/1IbUE3-XQkJ6uI7cv8VaytnGQYECFjP0t/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2010-chim-32",
        "annee": 2010,
        "filiere": "PC",
        "label": "Chimie · Chimie 2,",
        "description": "Première partie-- Différents aspects de la préparation et des propriétés thermodynamiques des métaux : pyrométallurgie du nickel, approche thermodynamique des solutions solides, procédé de dépôt électrochimique.Seconde partie-- Chimie organique : synthèse de la 11-acétoxy-4-déoxyasbestinine, d'après M.T.Crimmins(J. Org. Chem. 2008, 73, 1649-1660).",
        "themes": [
          "chimie_orga",
          "thermodynamique",
          "mecanique",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1NJA9fvGtz7WyfqGQECqghclAuQWJczoK/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2009-phys-12",
        "annee": 2009,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Voile solaire : orbites héliocentriques ; une voile solaire ; temps de transit. Vibrations transverses : ondes stationnaires le long d'une corde tendue ; perturbation par une masse ; microbalance à quartz.",
        "themes": [
          "optique_ondes",
          "mecanique"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/1SwR5sEzNUZty8BGmcGKrbhRzOzgmv3Br/preview",
        "corriges": [
          {
            "id": "ccinp-2009-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1SwR5sEzNUZty8BGmcGKrbhRzOzgmv3Br/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2009-chim-33",
        "annee": 2009,
        "filiere": "PC",
        "label": "Chimie · Chimie 1,",
        "description": "Autour de la pseudoptérosine A . Étude de quelques propriétés du soufre : Atomistique, structure cristallographique de la blende, thermodynamique de la solubilité du dioxyde de soufre dans l'eau, acidobasicité, thermodynamique de l'oxydation du dioxyde de soufre en phase vapeur, binaire liquide solide trioxyde de soufre -- acide sulfurique. Étude de différentes étapes de la synthèse de la pseudoptérosine A.",
        "themes": [
          "chimie_solutions",
          "chimie_archi",
          "thermodynamique",
          "mecanique",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1WMceD3LnRa_cMnciZkDzkIp9AtdzL6pY/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2009-chim-34",
        "annee": 2009,
        "filiere": "PC",
        "label": "Chimie · Chimie 2,",
        "description": "Premier problème-- chimie inorganique, autour de la pile à combustible : étude thermodynamique et cinétique de la synthèse de l'eau, propriétés électrochimiques de l'eau (aspects cinétiques et thermodynamiques), principe thermodynamique de fonctionnement d'une pile à combustible, diagramme de phase liquide -- solide du système fer -- titane.Second problème-- chimie organique : synthèse totale d'épothilones hypermodifiées.",
        "themes": [
          "chimie_orga",
          "chimie_solutions",
          "thermodynamique",
          "mecanique",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1FE4shKQUCRoKhVLxZ9wcPbMuY7xYgurd/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2008-chim-35",
        "annee": 2008,
        "filiere": "PC",
        "label": "Chimie · Chimie 1,",
        "description": "Autour de la synthèse du linderol A : étude stéréochimique ; étude thermodynamique de la formation de l'éthanol par hydratation de l'éthène ; diagramme binaire liquide-vapeur eau-éthanol ; utilisation de l'éthène dans la synthèse de polymères (cinétique de polymérisation) ; synthèse du lindérol A ; le cuivre et sa chimie en solution aqueuse (structure électronique, cristallochimie, oxydoréduction en solution ammoniacale).",
        "themes": [
          "chimie_solutions",
          "chimie_orga",
          "chimie_archi",
          "electronique",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/1mat74f9dYkTQgmZFf94zEa-oo9CdJAm9/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2008-chim-36",
        "annee": 2008,
        "filiere": "PC",
        "label": "Chimie · Chimie 2,",
        "description": "Premier problème-- Chimie inorganique, autour de l'azote et de l'oxygène : structure électronique, diagrammes d'orbitales moléculaires des molécules diatomiques, structure du peroxyde d'hydrogène ; distillation de l'air liquide ; thermodynamique de la synthèse de l'ammoniac ; étude cristallographique d'oxydes de fer (spinelles direct et inverse).Second problème-- Chimie organique : synthèse de l'érythronolide B (d'après E.J.Corey).",
        "themes": [
          "chimie_orga",
          "electronique",
          "thermodynamique",
          "quantique",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1FjKauisyYzdW4sdwfvUbL5Q31Wj4BF1d/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2007-phys-13",
        "annee": 2007,
        "filiere": "PC",
        "label": "Physique · Physique 1",
        "description": "Jeux d'eau et de lumière. Mesure et étude de la propagation des vibrations sismiques.",
        "themes": [
          "tp_oraux"
        ],
        "enonce": "https://drive.google.com/file/d/1l4O55Sg_Ce7rVwKBwOJW0ifVRni5MI_3/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2007-phys-14",
        "annee": 2007,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Fentes de Young (goniomètre, diffraction). Mise en équilibre thermique.",
        "themes": [
          "optique_ondes"
        ],
        "enonce": "https://drive.google.com/file/d/16jqKzmCjn-swgStFm5QHBxPs-oQCIv6g/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2007-chim-37",
        "annee": 2007,
        "filiere": "PC",
        "label": "Chimie · Chimie 1,",
        "description": "Autour des éphédradines : synthèse organique ; structures électroniques, diagrammes d'OM ; cinétique chimique et électrochimique ; thermodynamique chimique ; étude d'un diagramme binaire ; chimie des solutions.",
        "themes": [
          "chimie_archi",
          "electronique",
          "thermodynamique",
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1lv0rJWoFGqv4BI_pGVMxtdlQhN0-bkwv/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2007-chim-38",
        "annee": 2007,
        "filiere": "PC",
        "label": "Chimie · Chimie 2,",
        "description": "Premier problème-- Chimie de l'uranium et de ses composés (les principaux minerais, métallurgie thermique, cristallochimie du dioxyde d'uranium, l'uranium en solution aqueuse -- diagramme potentiel-pH).Second problème-- synthèse totale du (-)-dactylolide.",
        "themes": [
          "chimie_solutions",
          "electromagnetisme",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1MwHy9MnCr8EMRgWDV5woBK0-2D6SuYDB/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2006-chim-39",
        "annee": 2006,
        "filiere": "PC",
        "label": "Chimie · Chimie 1,",
        "description": "Autour de la ouabaine : synthèse organique, cinétique de décomposition thermique du DMSO, diagramme binaire eau-benzène, structure cristallographique du silicium et de la silice.",
        "themes": [
          "chimie_archi",
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1JGpneE7CvoesJjPg7phatn7RVi2iauOd/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2006-chim-40",
        "annee": 2006,
        "filiere": "PC",
        "label": "Chimie · Chimie 2,",
        "description": "Trois problèmes : chimie du fer et des oxy-hydroxydes de fer ; polymérisation du styrène ; synthèse de sesquiterpènes.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/182CPfBDvvL3cozX5B6mOHlQFiHhYXUYx/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2005-phys-15",
        "annee": 2005,
        "filiere": "PC",
        "label": "Physique · Physique 2",
        "description": "Filtrage optique, effets chromatiques (arc en ciel, lames minces) ; table à induction.",
        "themes": [
          "optique_ondes",
          "electronique",
          "electromagnetisme"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/1CPh3tjZyVw3WXwLrIFv9NuXA0U1jihxe/preview",
        "corriges": [
          {
            "id": "ccinp-2005-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1CPh3tjZyVw3WXwLrIFv9NuXA0U1jihxe/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=NOg1lIgxAro",
        "videos": [
          {
            "id": "NOg1lIgxAro",
            "title": "Effet de peau/plaque à induction (1/2) CCP physique 2 2005 PC",
            "url": "https://www.youtube.com/watch?v=NOg1lIgxAro",
            "duration": "38:08",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "electromagnetisme"
            ]
          },
          {
            "id": "T1ev9YWCIY4",
            "title": "MP/PSI/PC : Plaque à induction (2/2)/ couplage de l'inducteur et de l'induit CCP physique PC 2005",
            "url": "https://www.youtube.com/watch?v=T1ev9YWCIY4",
            "duration": "41:42",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "electromagnetisme"
            ]
          }
        ]
      },
      {
        "id": "ccinp-2005-chim-41",
        "annee": 2005,
        "filiere": "PC",
        "label": "Chimie · Chimie 1,",
        "description": "Synthèse du kalihinol C : synthèse du composé, dosage d'une solution de dichromate de potassium, préparation du nickel deSabatier.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1Y63bvLdMbIZ0GpP-IWyL9BpGfuSqz3DI/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2005-chim-42",
        "annee": 2005,
        "filiere": "PC",
        "label": "Chimie · Chimie 2,",
        "description": "Partie A -- étude de l'eau : structure de la molécule, étude thermodynamique du corps pur, cinétique de formation, électrolyse. Partie B : tension interfaciale. Partie C : synthèse de l'impéranène.",
        "themes": [
          "chimie_solutions",
          "thermodynamique",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1VAv7L8Krd4PdtgIUvzBeofmp6D45QQUc/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2004-chim-43",
        "annee": 2004,
        "filiere": "PC",
        "label": "Chimie · Chimie 1,",
        "description": "Autour du sildénafil : synthèse du composé, étude de la solution d'acide nitrique, oxydoréduction de l'étain, solution d'hydrogénophosphate de calcium, structure du dioxyde de titane.",
        "themes": [
          "chimie_solutions",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1IYAsSoyKraUK-AChI5VqjE34cKtH3rjN/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2004-chim-44",
        "annee": 2004,
        "filiere": "PC",
        "label": "Chimie · Chimie 2,",
        "description": "Deux problèmes : le silicium et ses dérivés ; synthèse organique.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/12LPANoub8-73WBbkNcMaW4t1zbyBrBzJ/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2003-chim-45",
        "annee": 2003,
        "filiere": "PC",
        "label": "Chimie · Chimie 1,",
        "description": "Synthèse d'un antibiotique ; diagramme d'OM pour une molécule diatomique ; étude électrocinétique et théorique d'un complexe cuivre-ammoniac ; étude d'un mélange binaire liquide-solide.",
        "themes": [
          "chimie_archi",
          "mecanique",
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1_9lrLUemdBuq6QJofNueqn4p9TvdjxPe/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2003-chim-46",
        "annee": 2003,
        "filiere": "PC",
        "label": "Chimie · Chimie 2,",
        "description": "Séparation des radionucléides (acidobasicité, oxydoréduction en milieu non aqueux) ; synthèse du bulnésol.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1QSuUduMYP2f9uXzLbTlGtx34bU_iIWtT/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2002-chim-47",
        "annee": 2002,
        "filiere": "PC",
        "label": "Chimie · Chimie 1,",
        "description": "Autour de la synthèse de l'équilénine. Cinétique de nitration d'un aromatique ; complexes octaédriques en théorie du champ cristallin (hors programme depuis 2005) ; structure cristalline de la glace diamant ; thermodynamique des équilibres liquide-solide, application à la recristallisation et à la cryoscopie ; dismutation de l'acide nitreux en solution aqueuse ; chimie organique, théorie de Hückel, déterminant séculaire.",
        "themes": [
          "chimie_solutions",
          "chimie_orga",
          "chimie_archi",
          "thermodynamique",
          "mecanique"
        ],
        "enonce": "https://drive.google.com/file/d/1P1LFfJxgbp_QdnlEEerdVjJjPrIE2n17/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2002-chim-48",
        "annee": 2002,
        "filiere": "PC",
        "label": "Chimie · Chimie 2,",
        "description": "Partie A : étude d'ultramicroélectrodes. Courbes intensité potentiel, étude du stress oxydatif d'une cellule, autour de l'adrénaline (erreur d'énoncé, la courbe fournie ne correspond pas aux données). Partie B : synthèse de la progestérone, d'après W.S.Johnson.",
        "themes": [
          "electromagnetisme",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1MA9MslLcKxk_7aztAMHop5SWoNmLeaZK/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2001-chim-49",
        "annee": 2001,
        "filiere": "PC",
        "label": "Chimie · Chimie 1,",
        "description": "Synthèse en série aromatique. Le magnésium et le zinc : les éléments, l'alliage, complexation des ions magnésium(II), étude électrochimique du couple Zn(II)/Zn(0), binaire liquide solide Zn/As, cristallographie de la blende, non-stoechiométrie de ZnO, pyrométallurgie du zinc.",
        "themes": [
          "chimie_archi",
          "mecanique",
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/14_bG-KD8a8z_5_BYB5Bz6RYo6eliG5l2/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2001-chim-50",
        "annee": 2001,
        "filiere": "PC",
        "label": "Chimie · Chimie 2,",
        "description": "Premier problème-- Autour de l'acide tartrique.Second problème-- Chimie inorganique. Solubilité de HCl dans l'eau. Membranes sélectives et application à l'électrodialyse.",
        "themes": [
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1VZ7HGsKRxeK61nNsco-bUwCByq01drUZ/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2000-chim-51",
        "annee": 2000,
        "filiere": "PC",
        "label": "Chimie · Chimie 1,",
        "description": "Réactions deDiels-Alderet dérivés du cyclopentadiène. Ammoniac et ammoniaque : thermodynamique chimique et acidobasicité.",
        "themes": [
          "chimie_orga",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/1PhJGxfOcJjY12jDzTm2AdXltEdI6J0fz/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2000-chim-52",
        "annee": 2000,
        "filiere": "PC",
        "label": "Chimie · Chimie 2,",
        "description": "Premier problème-- Synthèse du vertinolide.Second problème-- Cristaux de chlorure d'argent et verres photochromes. En annexe, document réponse, avec une énorme erreur sur la maille élémentaire du chlorure d'argent !. NB -- Le fichier .doc reprend uniquement le problème de chimie organique.",
        "themes": [
          "chimie_orga",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/179hTJcam83aGIVgyb_idMwFAfHEYvgtg/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "ccinp-2000-chim-53",
        "annee": 2000,
        "filiere": "PC",
        "label": "Chimie · Document réponse",
        "description": "Premier problème-- Synthèse du vertinolide.Second problème-- Cristaux de chlorure d'argent et verres photochromes. En annexe, document réponse, avec une énorme erreur sur la maille élémentaire du chlorure d'argent !. NB -- Le fichier .doc reprend uniquement le problème de chimie organique.",
        "themes": [
          "chimie_orga",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1MvhxbjTA93JpBsFwzF-Wit6uKYIrcg_H/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      }
    ]
  },
  {
    "id": "xens",
    "titre": "Concours X-ENS",
    "meta": "France · Polytechnique & Écoles Normales Supérieures · Filière PC · Écrits & Oraux",
    "icon": "🔬",
    "badgeClass": "ci-xens",
    "sujets": [
      {
        "id": "xens-2019-phys-0",
        "annee": 2019,
        "filiere": "PC",
        "label": "Physique · Physique A",
        "description": "Étude de la mécanique de l'audition humaine. L'oreille externe : un pavillon acoustique. L'oreille moyenne. La cochlée : un spectromètre acoustique.",
        "themes": [
          "mecanique",
          "quantique",
          "optique_ondes"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/19kTiizzNkzubgML3uquQUX9F797ZaSly/preview",
        "corriges": [
          {
            "id": "xens-2019-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/19kTiizzNkzubgML3uquQUX9F797ZaSly/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=qzz-CBY854A",
        "videos": [
          {
            "id": "qzz-CBY854A",
            "title": "Corrigé X-ENS Physique  B 2019 PC : quantique",
            "url": "https://www.youtube.com/watch?v=qzz-CBY854A",
            "duration": "27:33",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "quantique"
            ]
          },
          {
            "id": "E0t6FCtlYbE",
            "title": "Corrigé X/ESPCI Physique A 2019",
            "url": "https://www.youtube.com/watch?v=E0t6FCtlYbE",
            "duration": "27:29",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "xens-2019-chim-6",
        "annee": 2019,
        "filiere": "PC",
        "label": "Chimie · Composition de Chimie A -- XEULCCommune X, ESPCI, ENS Paris-Saclay, ENS Lyon, ENS Par",
        "description": "Le monoxyde de carbone :Première partie-- Structure électronique du monoxyde de carbone [Lewis, orbitales moléculaires];Deuxième partie--  Liaison entre monoxyde de carbone et métal de transition [orbitales moléculaires] ;Troisième partie-- Libération de monoxyde de carbone dans l'organisme [cinétique, spectroscopies] ;Quatrième partie-- Le monoxyde de carbone dans des procédés industriels et en chimie verte [cycle catalytique Cativa, chimie organique]",
        "themes": [
          "chimie_archi",
          "chimie_orga",
          "electronique",
          "thermodynamique",
          "quantique",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1rvIg5xBh3ADD_S9zNSOfV8Mx2Sk-7bMC/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2019-chim-7",
        "annee": 2019,
        "filiere": "PC",
        "label": "Chimie · Composition de Chimie B -- USpécifiqueensParis, option chimie",
        "description": "Première partie-- Synthèse de l'atropurpurane [chimie organique].Deuxième partie-- Synthèse et propriétés d'adsorption de solides hybrides poreux [orbitales moléculaires, cristallographie, cinétique, thermodynamique]",
        "themes": [
          "chimie_archi",
          "chimie_orga",
          "thermodynamique",
          "mecanique",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1uYKah67IoWm-0fAyW4WTvwrWmjvGmwYt/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2019-chim-8",
        "annee": 2019,
        "filiere": "PC",
        "label": "Chimie · Composition de Physique-Chimie -- LSpécifiqueensLyon",
        "description": "Stabilité et métastabilité des composés du chlorePremière partie-- Étude de la stabilité des ions diatomiques du chlore en phase gaz [orbitales moléculaires].Deuxième partie-- Étude de la stabilité des degrés d'oxydations du chlore en solution aqueuse [diagramme de Frost-Ebsworth].Troisième partie-- Cinétiques de décoloration impliquant l'hypochlorite de sodium [cinétique, RPAC].Quatrième partie-- Utilisation de l'hypochlorite de sodium en chimie organique",
        "themes": [
          "chimie_solutions",
          "chimie_orga",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1VJOlckQ1GX09yky6d3ztlPOFBZYb2Nzc/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2018-chim-9",
        "annee": 2018,
        "filiere": "PC",
        "label": "Chimie · Composition de Chimie A -- XEULCCommune X, ESPCI, ENS Paris-Saclay, ENS Lyon, ENS Par",
        "description": "Première partie-- Les oxydes d’azote : Formation anthropique des oxydes d’azote NOx[thermochimie]; Étude de la réaction entre le monoxyde d’azote NO et le dioxyde d’azote NO2[Lewis, orbitales moléculaires, cristallographie] ; Les oxydes d’azote NOx: des polluants troposphériques [cinétique].Seconde partie-- Synthèse d’un depsipeptide : Synthèse de l’acide isopalmitique ; Oxydation des alcools activée par SO3.",
        "themes": [
          "chimie_archi",
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1uyJSIvinaN7UPnoSAyzEJ6fanbsMluSL/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2018-chim-10",
        "annee": 2018,
        "filiere": "PC",
        "label": "Chimie · Composition de Chimie B -- USpécifiqueensParis, option chimie",
        "description": "Première partie-- Moteur moléculaire : Synthèse du rotor ; Synthèse du stator ; Synthèse du moteur [cycle catalytique de Suzuki].Deuxième partie-- Étude de la réactivité de systèmes biologiques par catalyse redox [cinétique électrochimique] : Étude du médiateur seul ; Étude de la catalyse redox.Troisième partie-- Étude d’une cellule photovoltaïque à colorant : Étude des composants de la cellule à colorant ; Vitesse de transfert d’électron, modèle de Marcus simplifié ; Application à la cellule photovoltaïque à colorant.",
        "themes": [
          "chimie_orga",
          "thermodynamique",
          "chimie_solutions",
          "electronique"
        ],
        "enonce": "https://drive.google.com/file/d/1kzdxAmCXyG02AqKGWJ6wPYVlZtIxesjj/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2018-chim-11",
        "annee": 2018,
        "filiere": "PC",
        "label": "Chimie · Composition de Physique-Chimie -- LSpécifiqueensLyon",
        "description": "Les nitrures de ferPremière partie-- Composition des nitrures de fer : Étude du diagramme binaire ; Micro-structure des nitrures de fer [cristallographie].Deuxième partie-- Nitruration en phase gaz : Diagramme de Lehrer [potentiel chimique]; Résultats expérimentaux ; Cinétique de nitruration [réacteur ouvert].Troisième partie-- Nitruration en milieu non aqueux : Diagramme E-pN3-; Électrolyse.",
        "themes": [
          "mecanique",
          "chimie_archi",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1vaelms5kImbdcWQFDjyO7hh9wgrcBS8E/preview",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=EitExAdhZw4",
        "videos": [
          {
            "id": "EitExAdhZw4",
            "title": "Corrigé (1/2) X-ENS 2018 PC Physique B",
            "url": "https://www.youtube.com/watch?v=EitExAdhZw4",
            "duration": "15:30",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "CoIWZ8wgtmk",
            "title": "Corrigé (2) X-ENS Physique B PC 2018",
            "url": "https://www.youtube.com/watch?v=CoIWZ8wgtmk",
            "duration": "21:03",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "3pgOnUmexI0",
            "title": "Corrigé (1) X-ESPCI Phys. A PC 2018",
            "url": "https://www.youtube.com/watch?v=3pgOnUmexI0",
            "duration": "19:39",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "42xngVt2pEg",
            "title": "Gros Bug au Concours Polytechnique X/ENS 2018. Report Maths B MP au 5 Mai 9H",
            "url": "https://www.youtube.com/watch?v=42xngVt2pEg",
            "duration": "02:41",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          }
        ]
      },
      {
        "id": "xens-2017-chim-12",
        "annee": 2017,
        "filiere": "PC",
        "label": "Chimie · Composition de Chimie -- XEULCCommune X, ESPCI, ENS Cachan, ENS Lyon, ENS Paris optio",
        "description": "Première problème-- Le glucose en synthèse et chimie des polymères : étude du glucose ; utilisation du glucose comme précurseur en chimie organique ; un polymère naturel du glucose - la cellulose.Seconde partie-- Intérêt des tensioactifs en analyse et synthèse : définition et formation de micelles ; applications des tensioactifs comme stabilisants d'émulsions ; utilisation des tensioactifs en catalyse (procédé Wacker).",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/11X-Q3EEj94zdsQBlT9WCCZngLqJD_Wct/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2017-chim-13",
        "annee": 2017,
        "filiere": "PC",
        "label": "Chimie · Composition de Chimie B -- USpécifiqueensParis, option chimie",
        "description": "Première partie-- Synthèse de la (+)-Gelsemine : synthèse énantiosélective d'un 2-azabicyclo[2.2.2]octane ; synthèse totale de la (+)-Gelsemine.Seconde partie-- Couplages scalaires, du dihydrogène aux protéines : couplage scalaire spin-spin dans la molécule HD ; couplage scalaire spin-spin et conformations ; du couplage scalaire spin-spin à la thermodynamique dans les protéines.",
        "themes": [
          "thermodynamique",
          "quantique",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1MYNKcMISn6U54vu74vq3Kk6iv8LqRdYC/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2017-chim-14",
        "annee": 2017,
        "filiere": "PC",
        "label": "Chimie · Composition de Physique-Chimie -- LSpécifiqueensLyon",
        "description": "Elaboration de polymères pour les cellules photovoltaïques : élaboration de la matrice de la cellule photovoltaïque ; préparation des cellules et principe de fonctionnement ; résultats des tests des cellules photovoltaïques et caractérisation de la performance.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1hvgB9yPN16LWCQMhDdkVNNgGL1I_HHxe/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2016-phys-1",
        "annee": 2016,
        "filiere": "PC",
        "label": "Physique · Physique A",
        "description": "Miroir à atomes.",
        "themes": [
          "mecanique",
          "electromagnetisme",
          "optique_ondes"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/1KHOyAaQIc6O5kx-8haWce-LTRgeG57U9/preview",
        "corriges": [
          {
            "id": "xens-2016-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1KHOyAaQIc6O5kx-8haWce-LTRgeG57U9/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=gU4_XhZpET0",
        "videos": [
          {
            "id": "gU4_XhZpET0",
            "title": "Diffraction/réseau sinusoïdal/à fentes/ fente simple - Corrigé  E3A physique PC 2016",
            "url": "https://www.youtube.com/watch?v=gU4_XhZpET0",
            "duration": "29:29",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "optique_ondes"
            ]
          }
        ]
      },
      {
        "id": "xens-2016-chim-15",
        "annee": 2016,
        "filiere": "PC",
        "label": "Chimie · Composition de Chimie -- XEULCCommune X, ESPCI, ENS Cachan, ENS Lyon, ENS Paris optio",
        "description": "Première problème-- Stockage de l'énergie : Extraction et préparation du lithium ; les batteries au lithium (analyse de documents).Seconde partie-- Autour des allènes : structure et réactivité (étude orbitalaire dans la méthode des fragments) ; synthèse de l'aplysiallène (dont un cycle catalytique).",
        "themes": [
          "chimie_orga",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/1Swp4qjSvrJ1rr21vTYNueaUUk36QwLU-/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2016-chim-16",
        "annee": 2016,
        "filiere": "PC",
        "label": "Chimie · Composition de Chimie B -- USpécifiqueensParis, option chimie",
        "description": "Première partie-- Interaction de déplétion : Potentiel chimique d'un soluté non chargé en solution -- Pression osmotique ; interaction de déplétion ; soluté soumis à un potentiel extérieur ; système clé-serrure.Seconde partie-- Les acides boroniques, réactivité et utilisations en synthèse organique : structure, réactivité et caractéristiques spectroscopiques ; utilisation en synthèse : couplage deSuzuki. ATTENTION -- les fichiers source ne sont fournis par l'ENS que pour une utilisation non commerciale, certaines figures sont soumises à droit d'auteur réglés auprès de la revue Nature.",
        "themes": [
          "electromagnetisme",
          "fluides",
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1sMXmM8tpVtU6lamWu7YcaeUQ8HUgkxQ-/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2016-chim-17",
        "annee": 2016,
        "filiere": "PC",
        "label": "Chimie · Composition de Physique-Chimie -- LSpécifiqueensLyon",
        "description": "Partie Physique-- Étude d'une éolienne.Partie Chimie-- Une nouvelle génération de batteries, les batteries brome/anthraquinone. Synthèse des espèces chimiques correspondantes (thermodynamique des systèmes, étude de binaires) ; étude du fonctionnement de l'accumulateur ; évolution temporelle de la concentration dans l'accumulateur.",
        "themes": [
          "thermodynamique",
          "chimie_orga",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1vnqp_aJ8vifZs-p-qzH-TyBEwWxJGwx8/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2015-phys-2",
        "annee": 2015,
        "filiere": "PC",
        "label": "Physique · Physique A",
        "description": "Objectif Lune. Traversée de l'atmosphère. Trajet Terre-Lune. Mesure de la distance Terre-Lune. Variation de la constante de gravitation.",
        "themes": [
          "mecanique",
          "tp_oraux",
          "electronique",
          "optique_ondes"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/1UW_kUghm7ZR6pgWk1lUJYSA--C3SInOM/preview",
        "corriges": [
          {
            "id": "xens-2015-p-0",
            "titre": "Corrigé A",
            "url": "https://drive.google.com/file/d/1UW_kUghm7ZR6pgWk1lUJYSA--C3SInOM/preview"
          }
        ],
        "video": "https://www.youtube.com/watch?v=pE6mtb8b7hY",
        "videos": [
          {
            "id": "pE6mtb8b7hY",
            "title": "Corrigé E3A PSI 2015 : adaptation d'impédance en puissance",
            "url": "https://www.youtube.com/watch?v=pE6mtb8b7hY",
            "duration": "38:51",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "electronique"
            ]
          },
          {
            "id": "K1weEsLGFT4",
            "title": "MP/PSI/PC- Télémétrie laser- Mesure de la distance Terre Lune- X/ENS 2015",
            "url": "https://www.youtube.com/watch?v=K1weEsLGFT4",
            "duration": "17:41",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "optique_ondes",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "xens-2015-chim-18",
        "annee": 2015,
        "filiere": "PC",
        "label": "Chimie · Composition de Chimie -- XEULCCommune X, ESPCI, ENS Cachan, ENS Lyon, ENS Paris optio",
        "description": "Première partie-- Les relations quantitatives entre structures moléculaires et propriétés physico-chimiques : constantes deHammett, corrélations deHammettet équilibres acidobasiques, corrélations deHammettet mécanismes réactionnels, propriétés physico-chimiques de médiateurs rédox (attention, nombreuses erreurs dans l'énoncé).Seconde partie-- Alcaloïdes - Biosynthèse et synthèse totale : de la lysine aux pipéridines substituées, synthèses de l'allosédamine et de la fawcettimine.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/10jddJCIzzuZy9C4d8vAEncwCs_bsA2qY/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2015-chim-19",
        "annee": 2015,
        "filiere": "PC",
        "label": "Chimie · Composition de Chimie B -- USpécifiqueensParis, option chimie",
        "description": "Première partie-- Vers une pompe à chaleur chimique : étude cinétique de l'équilibre chimique de dépolymérisation du paraldéhyde, étude thermodynamique ; application au concept d'une pompe à chaleur chimique (attention, nombreuses erreurs et incohérences dans l'énoncé).Seconde partie-- Synthèse de la 17-déoxyprovidencine.",
        "themes": [
          "thermodynamique",
          "chimie_orga",
          "chimie_solutions",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1YZ09roBkzc7ZWYR56c3Y5gOiWKtfQ1cr/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2015-chim-20",
        "annee": 2015,
        "filiere": "PC",
        "label": "Chimie · Composition de Physique-Chimie -- LSpécifiqueensLyon",
        "description": "Parfums et couleurs.Première partie-- Chimie. La fenchone, un composé terpénique odorant : étude stéréochimique, hydrodistillation ; synthèse non stéréosélective ; application en synthèse stéréosélective (coquilles du sujet original partiellement corrigées dans cette version).Seconde partie-- Physique. Transition électronique et couleur (dernière partie élémentaire sur la spectroscopie UV-visible).",
        "themes": [
          "electronique",
          "quantique",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1di85WVliyHl6gjEdpu5Hh-mgOCesBcnF/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2014-chim-21",
        "annee": 2014,
        "filiere": "PC",
        "label": "Chimie · Composition de Chimie -- XEULCCommune X, ESPCI, ENS Cachan, ENS Lyon, ENS Paris optio",
        "description": "Première partie-- Dissolution des gaz dans les liquides ioniques. Dosages dans les liquides ioniques : ions halogénures (Charpentier-Volhard), eau (Karl-Fischer), analyse spectroscopique ; solubilité des gaz ; modélisation des interactions solvant -- soluté.Seconde partie-- Lesppas: synthèse de la clusianone et de l'hyperibone-K.",
        "themes": [
          "chimie_solutions",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1ZndxmgqFboE-yo8b_phbzgg0dddu0YaG/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2014-chim-22",
        "annee": 2014,
        "filiere": "PC",
        "label": "Chimie · Composition de Chimie B -- USpécifiqueensParis, option chimie",
        "description": "Première partie-- Synthèse stéréocontrôlée du Trichodermatide A.Seconde partie-- Quelques aspects de la réaction-diffusion en solution.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1QYrKq8J41RK-KAdUy-VkgKvjnV5leIYk/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2014-chim-23",
        "annee": 2014,
        "filiere": "PC",
        "label": "Chimie · Composition de Physique-Chimie -- LSpécifiqueensLyon",
        "description": "Modification et étude des propriétés physiques d'un matériau : fonctionnalisation photochimique.Première partie-- Chimie : composés aromatiques polycycliques (problème infaisable, énoncé honteux, indigne, truffé d'erreurs).Seconde partie-- Physique : réponse d'un système physique à une excitation.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1QoKRNaTcm68rkrNPDpqoxCvmLOJKNm6r/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2013-phys-3",
        "annee": 2013,
        "filiere": "PC",
        "label": "Physique · Physique A",
        "description": "Le rayonnement solaire pour la navigation spatiale. Pression de rayonnement. Satellite en orbite héliocentrique. Satellite statique.",
        "themes": [
          "mecanique",
          "thermodynamique",
          "fluides"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/1QTXYECJXoJORGYLqR5-H93-4UEoFY0wq/preview",
        "corriges": [
          {
            "id": "xens-2013-p-0",
            "titre": "Corrigé Officiel",
            "url": "https://drive.google.com/file/d/1QTXYECJXoJORGYLqR5-H93-4UEoFY0wq/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2013-chim-24",
        "annee": 2013,
        "filiere": "PC",
        "label": "Chimie · ChimieCommuneens,x,espci: Chimie",
        "description": "Premier problème-- Chimie générale -- Les zéolithes, des solides microporeux. Les oxoacides, exemples, l'acide borique ; des monoacides aux polyacides ; modèle électrostatique ; les zéolithes : surface spécifique, propriétés ; les zéolithes, des acides solides.Second problème-- Synthèse du rippertenol.",
        "themes": [
          "electromagnetisme",
          "mecanique",
          "chimie_orga",
          "chimie_solutions",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/18ElILXGbm0TgmuGp7ttO44hcj5Yvmq3I/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2013-chim-25",
        "annee": 2013,
        "filiere": "PC",
        "label": "Chimie · Physique-ChimieensLyon : Physique-Chimie",
        "description": "Quelques aspects physiques et chimiques des cristaux liquides.Première partie-- Physique : optique anisotrope dans un cristal liquide.Seconde partie-- Chimie : étude de cristaux liquides conducteurs ioniques utilisés comme membrane électrolytique.",
        "themes": [
          "optique_ondes"
        ],
        "enonce": "https://drive.google.com/file/d/1P23uTYUa99qCoVYLfNwQxwo1-TLvvB6b/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2012-phys-4",
        "annee": 2012,
        "filiere": "PC",
        "label": "Physique · Physique B",
        "description": "Phénomènes non linéaires dans les milieux diélectriques. Réponses linéaire, non linéaire, doublement de fréquence, effet Kerr optique, autofocalisation.",
        "themes": [
          "optique_ondes"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/1P8edR8C0j9N0h-pb-UJcGTg0I1X0JsqC/preview",
        "corriges": [
          {
            "id": "xens-2012-p-0",
            "titre": "Corrigé A",
            "url": "https://drive.google.com/file/d/1P8edR8C0j9N0h-pb-UJcGTg0I1X0JsqC/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2012-chim-26",
        "annee": 2012,
        "filiere": "PC",
        "label": "Chimie · Chimie (annulée)Communeens,x,espci: chimie",
        "description": "Premier problèmeLes estersα,β-insaturés en synthèse : le propénoate de méthyle, addition de nucléophiles carbonés, réaction deMorita-Baylis-Hillman, couplages à trois composants (seule partie disposant d'une proposition de corrigé).Second problème-- La réaction deHeck: étude de l'acétate de palladium dans le cadre de la théorie du champ cristallin, étude mécanistique de la réaction deHeckpar voltamétrie cyclique.",
        "themes": [
          "chimie_orga",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1bLiSWztkjAAmamSUznM2Ws_XVxjIqCi3/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2012-chim-27",
        "annee": 2012,
        "filiere": "PC",
        "label": "Chimie · ChimieCommuneens,x,espci: Chimie",
        "description": "Premier problèmeÉtude de l'efficacité d'une réaction photochrome : structure cristalline et processus de solubilisation, détermination des rendements quantiques.Second problème-- La Chimie Click : étude et applications de la réaction deHuisgen: la réaction deHuisgen(mécanisme, étude orbitalaire), synthèse d'un composé polycyclique par Chimie Click, utilisations de diazides (synthèse de polymères et d'un macrocycle).",
        "themes": [
          "chimie_orga",
          "quantique",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1_RlerISVRTr5u1Xs9Enni0wU_EhM1q4n/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2012-chim-28",
        "annee": 2012,
        "filiere": "PC",
        "label": "Chimie · Physique-ChimieensLyon : Physique-Chimie",
        "description": "Application de la résonance magnétique nucléaire à la caractérisation de composés chimiques.Première partie-- Physique : principe de la résonance magnétique nucléaire : relation moment magnétique -- moment cinétique, relaxation nucléaire, résonance magnétique en irradiation continue, en irradiation pulsée, effet d'une inhomogénéité de champ, aspect expérimental de la résonance magnétique.Seconde partie-- Chimie : application de la résonance magnétique nucléaire du proton à l'analyse structurale de phtalates : étude structurale préliminaire, synthèse et analyse d'un phtalate, synthèse d'un isomère d'icelui, dosage d'un mélange de phtalates.",
        "themes": [
          "chimie_solutions",
          "electronique",
          "mecanique",
          "quantique",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1K8d0JnCHGnhdVfyicXmQoe6KIxdP99zt/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2011-phys-5",
        "annee": 2011,
        "filiere": "PC",
        "label": "Physique · Physique B",
        "description": "Activité Optique. Théorie de Fresnel : notion de biréfringence circulaire. Biréfringence circulaire induite ou effet Faraday. Biréfringence circulaire naturelle : du microscopique au macroscopique. Mise en évidence et mesure de rotations faibles.",
        "themes": [
          "mecanique",
          "optique_ondes",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "https://drive.google.com/file/d/166WMDkjLC_kPas06xdTDeeLjt9lE350l/preview",
        "corriges": [
          {
            "id": "xens-2011-p-0",
            "titre": "Corrigé A",
            "url": "https://drive.google.com/file/d/166WMDkjLC_kPas06xdTDeeLjt9lE350l/preview"
          }
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2011-chim-29",
        "annee": 2011,
        "filiere": "PC",
        "label": "Chimie · ChimieCommuneens,x,espci: chimie",
        "description": "Premier problèmeLe dioxyde de titane et la photocatalyse : purification du tétrachlorure de titane, détermination de la surface spécifique du matériau, principe simplifié de la photocatalyse, cinétique de dégradation.Second problème-- Utilisation de l'acide deMosheren synthèse organique : acide deMosheret détermination de configurations absolues ; synthèse totale de l'amphidinolide T1.",
        "themes": [
          "chimie_solutions",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1prcxkXAXDWnwoRJXM3XOtJhyxJFAulsq/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2011-chim-30",
        "annee": 2011,
        "filiere": "PC",
        "label": "Chimie · Physique-ChimieensLyon : Physique-Chimie",
        "description": "Étude du phénomène de transition de spin.Première partie-- Physique : transition de comportement dans un système mécanique ; transition de spin (préliminaires, enthalpie libre du mélange en version statistique).Seconde partie-- Chimie. Bistabilité magnétique, étude du ligand bipyridine, synthèse d'un ligand, étude de la transition de spin d'un complexe, étude de porphyrines, du dioxygène et de ses dérivés. Contribution de l'entropie vibrationnelle à la transition de spin.",
        "themes": [
          "thermodynamique",
          "mecanique",
          "quantique",
          "chimie_orga",
          "chimie_solutions",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1tHotA4yJRrpAbIfC2n4eW_BGR10uVsbG/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2010-chim-31",
        "annee": 2010,
        "filiere": "PC",
        "label": "Chimie · Chimie",
        "description": "Modélisation physicochimique des polymères. Synthèse de la sténine.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1-YHmjHs_YdlC754hr9PdFTpsTpoutyNj/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2010-chim-42",
        "annee": 2010,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- Les molécules fluorescentes pour l'étude des phénomènes biologiques : synthèse, propriétés optiques de ces molécules.Second problème-- Synthèse, caractérisation et étude de la réactivité d'un complexe de cobalt.",
        "themes": [
          "optique_ondes",
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1Yn4T6YMaekvRe6i0Pn4P-GVdoxpuHrff/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2009-chim-32",
        "annee": 2009,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Quelques aspects de la chimie médicale. Les agents de contraste enirm; synthèse de l'amphotéricine B. NB -- le fichier c09lc1wo.doc est l'énoncé .doc de la partie orga, renuméroté et remis en forme par notre collègue AnneCurk.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1PETE2i9CEHRFV2QxQk7rHUr_QaYBTndS/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2009-chim-43",
        "annee": 2009,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- synthèse et propriétés d'un hydrocarbure polyénique ; aromatique ou non aromatique ?Second problème-- le cuivre : corrosion, affinage en milieu ammoniacal et complexes Cu(II)--oligopeptide. Note : Le dossier c09xp1c-2 contient un rectificatif aux fichiers fournis.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/14k8c-tjlDH_4Ha2JF4MPhWDtPRRcq0JU/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2008-chim-33",
        "annee": 2008,
        "filiere": "PC",
        "label": "Chimie · Commune PC et MP/PC groupe I, Ulm",
        "description": "Expression et calcul du potentiel chimique chimique d'une espèce physicochimique dans différents milieux. Réactions deDiels-Alder.",
        "themes": [
          "chimie_orga",
          "electromagnetisme"
        ],
        "enonce": "https://drive.google.com/file/d/1mXmEP8P5Cl6YoUmp1oWBExqWOc46-nNP/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2008-chim-44",
        "annee": 2008,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- Vers la synthèse de composés hétérocycliques : les nitriles (structure, propriétés, synthèse, réactions d'addition, réaction deRitter) ; les isonitriles (structure, réactivité, hydrolyse acide, réaction dePasserini).Second problème-- Corrosion sèche, protection des métaux vis-à-vis de l'oxydation : aspects thermodynamiques, cinétique de diffusion.",
        "themes": [
          "chimie_orga",
          "chimie_solutions",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/1fH5aobDKcrl7V8HiFpfrnFGlY9VI5ZWf/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2007-chim-34",
        "annee": 2007,
        "filiere": "PC",
        "label": "Chimie · Commune PC et MP/PC groupe I, Ulm",
        "description": "Formation de particules à partir de précurseurs en solution aqueuse. Chimie organique et parfumerie (structure de la civétone, synthèses de la muscone et de l'ambre gris).",
        "themes": [
          "chimie_orga",
          "quantique",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1qDlQgYzCOGHXjiExDfFdQjDLkqvrWS3-/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2007-chim-45",
        "annee": 2007,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- Synthèse de l'arborone.Second problème-- Autour du titane : étude thermodynamique (diagramme potentiel-pH) et cinétique (courbe intensité potentiel) de la corrosion humide du titane ; étude thermodynamique d'un alliage à mémoire de forme.",
        "themes": [
          "chimie_solutions",
          "electromagnetisme",
          "thermodynamique",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1-Ee7yZn9mbQkB-zhimCAoGPylb742lAx/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2006-chim-35",
        "annee": 2006,
        "filiere": "PC",
        "label": "Chimie · Commune PC et MP/PC groupe I, Ulm",
        "description": "Les carbohydrates : 7 parties consacrées à de la stéréochimie, de la chimie organique structurale, de la synthèse organique, l'étude thermodynamique et cinétique de la complexation par les cyclodextrines.",
        "themes": [
          "chimie_orga",
          "chimie_solutions",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/1ifFSKZ8nU-fAHEj4LUOPiVBZIoNk7xZY/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2006-chim-46",
        "annee": 2006,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Deux parties : étude d'un polymère fluoré ; synthèse du clovène.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1mlmEwyi1kcIJc-VWZQqpUsv4aAjD5-Ax/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2005-chim-36",
        "annee": 2005,
        "filiere": "PC",
        "label": "Chimie · Commune PC et MP/PC groupe I, Ulm",
        "description": "Deux parties : protéines et enzymes ; synthèse stéréocontrôlée de la (+)-iridomyrmécine.",
        "themes": [
          "optique_ondes",
          "chimie_orga",
          "mecanique"
        ],
        "enonce": "https://drive.google.com/file/d/1auZXES3JFVTPFDJ_n3trLAUsexjjHTdQ/preview",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=etCfHg2wf68",
        "videos": [
          {
            "id": "etCfHg2wf68",
            "title": "MP/PC/PSI -Corrigé E3A physique PC 2005 (2/3) - le modèle gaussien du laser",
            "url": "https://www.youtube.com/watch?v=etCfHg2wf68",
            "duration": "27:12",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "optique_ondes"
            ]
          },
          {
            "id": "I4uIaxBcTVw",
            "title": "MP/PC/PSI Propagation d'une OEM dans un métal. Corrigé E3A physique PC 2005 (3/3)",
            "url": "https://www.youtube.com/watch?v=I4uIaxBcTVw",
            "duration": "22:15",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "mecanique"
            ]
          },
          {
            "id": "HB8P6Btl8iY",
            "title": "Ondes électromagnétiques dans le vide- corrigé E3A Physique PC 2005 (1/3)",
            "url": "https://www.youtube.com/watch?v=HB8P6Btl8iY",
            "duration": "21:09",
            "chapitre": "Corrigés X-ENS",
            "themes": [
              "optique_ondes"
            ]
          }
        ]
      },
      {
        "id": "xens-2005-chim-47",
        "annee": 2005,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Deux parties : préparation des aimants cobalt-samarium ; synthèse stéréocontrôlée du (±)-O-méthylpodocarpate de méthyle.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1OUjyGG2kWMdUginYYVavWDlhDYWLxaVL/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2004-chim-37",
        "annee": 2004,
        "filiere": "PC",
        "label": "Chimie · Commune PC et MP/PC groupe I",
        "description": "Deux problèmes : étude de formes allotropiques du carbone ; les cryptophanes en chimie supramoléculaire.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1BZTUQOHHRWmYB1y-R-GqsZPdcHbuX4_O/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2004-chim-48",
        "annee": 2004,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Deux problèmes : du magnésium au chauffe-plat chimique ; le furane, propriétés et réactivité.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1_hNrl70fA1eD-ZE5ZKeOeM7Teiqp01WF/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2003-chim-38",
        "annee": 2003,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Dendrimères ; nanoparticules.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1YM7gf8FoetW_97d9HBRkRiqnKMLYDG_t/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2003-chim-49",
        "annee": 2003,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Deux problèmes : étude d'une source chimique de dioxygène singulet : le système molybdate-peroxyde d'hydrogène ; caractérisation et synthèse de l'acide shikimique.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1_x9Gn_V1j5tVcoCuKXagZrHK-Q_CjIJP/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2002-chim-39",
        "annee": 2002,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Production de l'oxyde d'éthylène ; chimie organique : synthèse du FK 506 (énoncé truffé d'erreurs).",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1jwB9qq_4A-nN2r2iGCT-oR6zAT1JwPc9/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2002-chim-50",
        "annee": 2002,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- Silicium, silice et silicates ; structures, thermodynamique et solutions aqueuses.Second problème-- Synthèse stéréosélective d'une phéromone.",
        "themes": [
          "thermodynamique",
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/14F3snlXYJwrIkAxvmtnvRtFlwXJob07l/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2001-chim-40",
        "annee": 2001,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Chimie organique du fluor ; catalyse en phase perfluorée.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1IkkiBkTP8MJelJ1_KMEP_xxp60bFQBux/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2001-chim-51",
        "annee": 2001,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- Synthèse de l'oestrone.Second problème-- Des diagrammes d'enthalpie libre aux diagrammes binaires isobares.",
        "themes": [
          "chimie_archi",
          "thermodynamique",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1l1NYPq3Y9L5GeIZxgo-DnIyJ20HIoYx7/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2000-chim-41",
        "annee": 2000,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Catalyse homogène par les métaux de transition : métaux carbonyles ; réaction deHeck: mécanisme de l'addition oxydante, mécanisme de laβ-élimination d'hydrure ; application à la synthèse de la désoxypodophyllotoxine. Étude cinétique d'un système chimique ouvert.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1gg--2PJxUiFtF4VbbwvemBs8hQN0Uf3H/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "xens-2000-chim-52",
        "annee": 2000,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Premier problème-- Synthèse biomimétique d'un précurseur de la progestérone.Second problème-- Dosages par spectrophotométrie UV-visible (acido-basicité).",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/17uHMroT0YV4KaL-hXQft1LX10HgZZCrO/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      }
    ]
  },
  {
    "id": "e3a",
    "titre": "Concours e3a / Polytech",
    "meta": "France · Filière PC · Physique & Chimie",
    "icon": "📘",
    "badgeClass": "ci-e3a",
    "sujets": [
      {
        "id": "e3a-2019-chim-0",
        "annee": 2019,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Première partie-- Utilisation des composés du soufre en chimie générale : Généralités sur quelques composés de l'élément soufre [diagramme E-pH] ; Précipitation sélective à l'aide du sulfure d'hydrogène ; Un dérivé soufré dans une permanente capillaire [dosages] ; Un dérivé soufré dans une boisson énergisante [dosage HPLC] ; Le dioxyde de soufre, un gaz polluant [potentiel chimique, cinétique]Deuxième partie-- Utilisation de l'élément soufre en chimie organique : Synthèse stéréosélective de la (-)-indolizidine 223AB ; Étude de différentes réactions de méthylénation [cycle catalytique hydroboration] ; Étude des molécules AH6[orbitales moléculaires]",
        "themes": [
          "chimie_solutions",
          "chimie_orga",
          "electromagnetisme",
          "thermodynamique",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1BPVXflUW-v1grHBN4Uaj5969xwnX7n3-/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2019-chim-1",
        "annee": 2019,
        "filiere": "PC",
        "label": "Chimie · avec document réponse",
        "description": "Première partie-- Utilisation des composés du soufre en chimie générale : Généralités sur quelques composés de l'élément soufre [diagramme E-pH] ; Précipitation sélective à l'aide du sulfure d'hydrogène ; Un dérivé soufré dans une permanente capillaire [dosages] ; Un dérivé soufré dans une boisson énergisante [dosage HPLC] ; Le dioxyde de soufre, un gaz polluant [potentiel chimique, cinétique]Deuxième partie-- Utilisation de l'élément soufre en chimie organique : Synthèse stéréosélective de la (-)-indolizidine 223AB ; Étude de différentes réactions de méthylénation [cycle catalytique hydroboration] ; Étude des molécules AH6[orbitales moléculaires]",
        "themes": [
          "chimie_solutions",
          "chimie_orga",
          "electromagnetisme",
          "thermodynamique",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1cjCD8SAerkpFqRW79hFOR2UEVlaWwsS5/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2018-chim-2",
        "annee": 2018,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Première partie-- Autour du cuivre : Hydrométallurgie du cuivre [Diagramme E-pH, Cinétique électrochimique], structure du cuivre métallique et alliages du cuivre [Cristallochimie, diagramme binaire] ;Deuxième partie-- Synthèse du (-)-diversonol : Formation d'un composé intermédiaire, A propos du procédé Wacker [cycle catalytique, orbitales moléculaires], Suite de la synthèse du (-)-diversonol",
        "themes": [
          "chimie_solutions",
          "chimie_archi",
          "chimie_orga",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/1fXUSjkNyJ3Sd4wlkg4eKybja70UMrfOx/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2018-chim-3",
        "annee": 2018,
        "filiere": "PC",
        "label": "Chimie · avec document réponse",
        "description": "Première partie-- Autour du cuivre : Hydrométallurgie du cuivre [Diagramme E-pH, Cinétique électrochimique], structure du cuivre métallique et alliages du cuivre [Cristallochimie, diagramme binaire] ;Deuxième partie-- Synthèse du (-)-diversonol : Formation d'un composé intermédiaire, A propos du procédé Wacker [cycle catalytique, orbitales moléculaires], Suite de la synthèse du (-)-diversonol",
        "themes": [
          "chimie_solutions",
          "chimie_archi",
          "chimie_orga",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/1JwrF9qAfnzRZ7-YqsTFqrWxCdr3rzkSf/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2017-chim-4",
        "annee": 2017,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Première partie-- Utilisation de l'élément manganèse en chimie générale : le manganèse et ses nombres d'oxydation ; dosage spectrophotométrique de l'élément manganèse ; titrage manganimétrique ; étude thermodynamique de la décomposition de l'eau oxygénée ; étude cinétique de la décomposition de l'eau oxygénée.Deuxième partie-- Utilisation de l'élément manganèse en chimie organique : la sélectivité grâce à l'élément manganèse ; l'oxydation par l'élément manganèse. Document réponse inclus.",
        "themes": [
          "chimie_solutions",
          "thermodynamique",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1nwNMjWsVZxn2GLbG6BuZq1_D-8Hoil0p/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2017-chim-5",
        "annee": 2017,
        "filiere": "PC",
        "label": "Chimie · Document réponse",
        "description": "Première partie-- Utilisation de l'élément manganèse en chimie générale : le manganèse et ses nombres d'oxydation ; dosage spectrophotométrique de l'élément manganèse ; titrage manganimétrique ; étude thermodynamique de la décomposition de l'eau oxygénée ; étude cinétique de la décomposition de l'eau oxygénée.Deuxième partie-- Utilisation de l'élément manganèse en chimie organique : la sélectivité grâce à l'élément manganèse ; l'oxydation par l'élément manganèse. Document réponse inclus.",
        "themes": [
          "chimie_solutions",
          "thermodynamique",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/19fi9d0kxWxGydXH2ANLn2KTdjevWjCcd/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2016-chim-6",
        "annee": 2016,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Première partie-- L'ammoniac et l'ion ammonium : synthèse industrielle de l'ammoniac (étude thermodynamique, structure cristallographique du catalyseur) ; diagramme d'orbitales moléculaires de l'ion ammonium (méthode des fragments) ; mélange eau/ammoniac (binaire liquide-solide, dosage de l'ammoniac dans le Destop -- résolution de problème).Deuxième partie-- Synthèses organiques : formation de liaisons carbone-azote par catalyse au palladium (cycle catalytique) ; synthèse totale de la (±)-culmorine. Document réponse inclus.",
        "themes": [
          "chimie_archi",
          "chimie_orga",
          "thermodynamique",
          "mecanique",
          "chimie_solutions",
          "tp_oraux"
        ],
        "enonce": "https://drive.google.com/file/d/1yfUfhlJVYkYraAwYeDmzpHTAHLXoxYd-/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2015-chim-7",
        "annee": 2015,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Le zinc.Première partie-- L'oxyde de zinc ZnO : le cristal, détermination de grandeurs thermodynamiques à l'aide d'une pile.Deuxième partie-- Le zinc en solution aqueuse : détermination de l'épaisseur de zinc déposé sur une rondelle, intérêt du zinc utilisé comme anode sacrificielle.Troisième partie-- Synthèse et utilisation d'organozinciques en chimie organique : présentation et synthèse, réaction deReformatsky, synthèse de l'hinesol. Document réponse inclus.",
        "themes": [
          "chimie_orga",
          "chimie_solutions",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/1GsHM0_bLNYMod0_bax3PgkUUoHco5qAq/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2014-chim-8",
        "annee": 2014,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Autour du platine. Le platine en solution : oxydoréduction, complexes du platine(II) ; synthèse de l'acide nitrique, aspects cinétiques et thermodynamiques. Étude structurale du platine : cristallographie, alliage platine / rhodium (diagramme binaire liquide solide). Synthèse de la coccinelline.",
        "themes": [
          "chimie_solutions",
          "chimie_archi",
          "thermodynamique",
          "mecanique",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1x17gHYDd-9yJq9s_-hWd6hsZpG9QHbhp/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2013-chim-9",
        "annee": 2013,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Chimie du phosphore. L'élément, l'ion phosphate. Le phosphore dans les eaux naturelles : dosage du phosphore dans un effluent urbain par spectrophotométrie, déphosphatation chimique des effluents par précipitation. Thermodynamique de la préparation de OPCl3. Synthèse de l'acide(-)-acanthoïque : réaction deMichael, chimie du groupe carbonyle, réaction deDiels-Alder, réaction deWittig, desestérification.",
        "themes": [
          "chimie_orga",
          "chimie_solutions",
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/1M5oII5lrqpKfF68hnFcBCR7SFgLfJxL8/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2012-chim-10",
        "annee": 2012,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "L'épreuve, focalisée sur la chimie de l'étain, comporte trois parties indépendantes. La première est consacrée à l'étain en solution avec l'application à l'étamage. La deuxième est centrée sur l'étude de l'alliage bismuth-étain, remplaçant récent de l'alliage de soudure à base d'étain-plomb. La troisième propose une synthèse du chloramphénicol, suivie d'une étude sur la réalisation de liaisons entre noyaux aromatiques.",
        "themes": [
          "chimie_orga",
          "chimie_solutions",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1nR29mIH_CeQzdkDIcjWOwhbE0rMZ1rp0/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2011-chim-11",
        "annee": 2011,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "L'épreuve, focalisée sur la chimie du vanadium, comporte quatre parties indépendantes. La première est consacrée au vanadium métallique (structure, propriétés cristallographiques, métallurgie). La deuxième est centrée sur l'étude thermodynamique (binaire solide liquide) de deux alliages à base de vanadium. La troisième s'intéresse à la copolymérisation de l'éthène et du propène catalysée par le trichlorure de vanadyle (facteurs de réactivité, équation deMayo-Lewis. Enfin, la dernière partie propose une synthèse de la(-)-mésembrine.",
        "themes": [
          "chimie_archi",
          "thermodynamique",
          "mecanique",
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/18On86PhfEcMkWYa--Mevtjtq51ZhsUJQ/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2010-chim-12",
        "annee": 2010,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Autour du dihydrogène. Thermodynamique de la production de dihydrogène par reformage du méthane. Stockage du dihydrogène dans les hydrures métalliques. Pile à combustible «pemfc» fonctionnant au dihydrogène. Synthèse des acides ricinoléique et ruménique. Synthèse de la quinopyrrolonaphthyridine.",
        "themes": [
          "chimie_solutions",
          "thermodynamique",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1_yEKz2H6pGYgLeNh6356B4ki2lp-pscu/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2009-chim-13",
        "annee": 2009,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Autour du fluor. Thermodynamique de l'obtention de l'acide fluorhydrique (en fait, du fluorure d'hydrogène...). Obtention du fluor : étude de l'acide fluorhydrique comme solvant (en fait du fluorure d'hydrogène liquide...), binaire HF -- KF, obtention du fluor (en fait, du difluor...) par électrolyse. Dosage des ions fluorure à l'aide d'une électrode sélective. Le fluor en chimie organique : éléments de synthèse de l'efavirenz.",
        "themes": [
          "chimie_solutions",
          "chimie_orga",
          "thermodynamique",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1bJi3pVCeSxHoaTXKtRrS30XuZ8hM0pYD/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2008-chim-14",
        "annee": 2008,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Trois parties indépendantes -- Métallurgie du cobalt : thermodynamique du grillage sulfatant du sulfure de cobalt, électrolyse de la solution acide de sulfate de cobalt. Cinétique de polymérisation du butadiène. Synthèse partielle de la cortisone (d'après R.B.Woodward).",
        "themes": [
          "chimie_solutions",
          "thermodynamique",
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/19mzeaAYbB5F1vBHbrn5OgHZbUFYonZdF/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2007-chim-15",
        "annee": 2007,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Étude du bore et de ses voisins. Élaboration du carbure de bore (thermodynamique, mélange binaire). Utilisation du bore dans un agent de blanchiment (oxydoréduction). Utilisation du bore en synthèse organique.",
        "themes": [
          "thermodynamique",
          "chimie_orga",
          "chimie_solutions",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1Q6YUlfIcktVdFFDnXv061vq0zGhdvtNu/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2006-chim-16",
        "annee": 2006,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Autour du nickel : phénomènes d'adsorption et de croissance d'une couche d'oxyde ; synthèse de l'ibuprofène et de la cantharidine.",
        "themes": [
          "chimie_orga"
        ],
        "enonce": "https://drive.google.com/file/d/1mquxacL70iHlSs6DqbUk106G2TWLqefa/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2005-chim-17",
        "annee": 2005,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Le titane. Partie A -- étude de l'oxydation du titane : étude structurale, thermodynamique de l'oxydation par voie sèche, oxydoréduction en solution. Partie B -- utilisation du titane en chimie organique : polymérisationZiegler-Natta, synthèse énantiosélective du disparlure.",
        "themes": [
          "chimie_orga",
          "thermodynamique",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1SxB47PIUP94AonijyaguLWKjEIgkZ2Em/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2004-chim-18",
        "annee": 2004,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Composés carbonylés : chimie organique et inorganique (thermodynamique, oxydoréduction).",
        "themes": [
          "thermodynamique",
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/10m6yrRJQ4fJO67Zp4ssOfvyJHVi635Ws/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2003-chim-19",
        "annee": 2003,
        "filiere": "PC",
        "label": "Chimie · Épreuve de Chimie",
        "description": "Étude comparée des éléments oxygène et soufre.",
        "themes": [
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1vE-ZTRMVX7e6YNWnBNc7Q0JonaBh0qZr/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2002-chim-20",
        "annee": 2002,
        "filiere": "PC",
        "label": "Chimie · Chimie (3h),",
        "description": "Autour de l'azote. Propriétés de l'élément ; étude du diazote (représentation deLewis, diagramme d'orbitales moléculaires) ; structure de l'ammoniac, réactivité en solution aqueuse ; les acidesα-aminés, acidobasicité, formation d'amides, spectroscopie infrarouge ; synthèse du Jaune de beurre (utilise les diazoïques).",
        "themes": [
          "chimie_solutions",
          "quantique",
          "chimie_orga",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1d8h5QqgHhs7za-MHYwIetwOTrJMBM7tT/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2002-chim-21",
        "annee": 2002,
        "filiere": "PC",
        "label": "Chimie · Physique-Chimie (4h),",
        "description": "Les larmes du vin (chimie, parties A et D). Étude du binaire liquide-vapeur eau / éthanol ; dosage de l'alcool du vin par oxydoréduction.",
        "themes": [
          "chimie_solutions",
          "chimie_orga",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1SwOzgpmfOyb8HvYxPp2xmbkkYCYenray/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2001-chim-22",
        "annee": 2001,
        "filiere": "PC",
        "label": "Chimie · Chimie (3h),",
        "description": "Autour du silicium. Structure (atomistique, cristallographie), propriétés physiques (conductivité électrique) et élaboration par métallothermie (diagramme d'Ellingham). Propriétés chimiques des dérivés du silicium : utilisation des oxydes de silicium en catalyse (reformage catalytique) ; utilisation du silicium en chimie organique : hétérochimie des éthers d'énols silylés, réaction d'élimination dePedersen.",
        "themes": [
          "chimie_orga",
          "chimie_archi"
        ],
        "enonce": "https://drive.google.com/file/d/1BwMkABSTE3dkKOFW-cDPLrFXHWO9_g_6/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2001-chim-23",
        "annee": 2001,
        "filiere": "PC",
        "label": "Chimie · Physique-Chimie (4h),",
        "description": "Trois exemples de création d'entropie en thermodynamique chimique.",
        "themes": [
          "thermodynamique"
        ],
        "enonce": "https://drive.google.com/file/d/1QR0nootq7pXKmwB2RslrWGQ2B83T8uGm/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      },
      {
        "id": "e3a-2000-chim-24",
        "annee": 2000,
        "filiere": "PC",
        "label": "Chimie · Chimie (3h),",
        "description": "Quelques aspects de la chimie du cuivre. Étude structurale du cuivre solide et de la cuprite Cu2O. Étude isobare (changement d'état solide / liquide) d'un alliage binaire Cu-Ni. Corrosion du cuivre par voie humide. Les ions du cuivre en solution aqueuse et ammoniacale. Le cuivre en chimie organique.",
        "themes": [
          "chimie_archi",
          "thermodynamique",
          "mecanique",
          "chimie_orga",
          "chimie_solutions"
        ],
        "enonce": "https://drive.google.com/file/d/1IUUPInIbihbRQdeL6dO_05R-DZdDRtkS/preview",
        "correction": "",
        "corriges": [],
        "video": null,
        "videos": []
      }
    ]
  },
  {
    "id": "methodo",
    "titre": "Méthodologie & TP Concours (Oraux & Travaux Pratiques)",
    "meta": "Pr. Hassan EDDAMS & E-Learning Physique · Préparation des épreuves pratiques et oraux",
    "icon": "📐",
    "badgeClass": "ci-methodo",
    "sujets": [
      {
        "id": "methodo-ecrit-1",
        "annee": "Méthode",
        "filiere": "Toutes",
        "label": "Méthodologie Écrit Concours · Conseils de Rédaction, Gestion du Temps & Rigueur CPGE",
        "description": "Conseils pratiques pour aborder une résolution de problème et optimiser ses points le jour J.",
        "enonce": "https://drive.google.com/file/d/15BqxITz4p0sHyz1gaZEpTlAKm_r5vlMp/preview",
        "correction": "https://drive.google.com/file/d/15BqxITz4p0sHyz1gaZEpTlAKm_r5vlMp/preview",
        "themes": [
          "tp_oraux"
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "methodo-sup-1",
        "annee": "Problèmes Sup",
        "filiere": "PC",
        "label": "Problèmes de Physique Sup Corrigés & Rédigés · Entraînement Type Concours",
        "description": "Entraînement approfondi sur des problèmes types écrits et oraux.",
        "enonce": "https://drive.google.com/file/d/1QdaTgO4r_X8TJ7xwB_iMv-qZ-GIrv4Yc/preview",
        "correction": "https://drive.google.com/file/d/1QdaTgO4r_X8TJ7xwB_iMv-qZ-GIrv4Yc/preview",
        "themes": [
          "mecanique",
          "thermodynamique",
          "electromagnetisme"
        ],
        "video": null,
        "videos": []
      },
      {
        "id": "methodo-vid-RohgxH6yzRM",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Modulation d'amplitude (2/4),  avec ou sans porteuse",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "electronique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=RohgxH6yzRM",
        "videos": [
          {
            "id": "RohgxH6yzRM",
            "title": "Modulation d'amplitude (2/4),  avec ou sans porteuse",
            "url": "https://www.youtube.com/watch?v=RohgxH6yzRM",
            "duration": "18:21",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "electronique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-0UzCmX7dTsg",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Electronique numérique- échantillonnage (2/4)- échantillonneur bloqueur",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "electronique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=0UzCmX7dTsg",
        "videos": [
          {
            "id": "0UzCmX7dTsg",
            "title": "Electronique numérique- échantillonnage (2/4)- échantillonneur bloqueur",
            "url": "https://www.youtube.com/watch?v=0UzCmX7dTsg",
            "duration": "14:30",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "electronique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-OURAK1ciyuk",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Electronique (théorie et pratique) : Oscillateur à pont de Wien (1/3)",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "electronique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=OURAK1ciyuk",
        "videos": [
          {
            "id": "OURAK1ciyuk",
            "title": "Electronique (théorie et pratique) : Oscillateur à pont de Wien (1/3)",
            "url": "https://www.youtube.com/watch?v=OURAK1ciyuk",
            "duration": "20:39",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "electronique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-4F1vOIy6FZU",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Electronique : ALI en régime non linéaire  (1/3) : comparateurs simple et à mémoire",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "electronique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=4F1vOIy6FZU",
        "videos": [
          {
            "id": "4F1vOIy6FZU",
            "title": "Electronique : ALI en régime non linéaire  (1/3) : comparateurs simple et à mémoire",
            "url": "https://www.youtube.com/watch?v=4F1vOIy6FZU",
            "duration": "19:27",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "electronique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-C3uzEHzWInY",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Electronique prépa  : Oscillateur à pont de Wien (3/3), bouclage du système",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "electronique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=C3uzEHzWInY",
        "videos": [
          {
            "id": "C3uzEHzWInY",
            "title": "Electronique prépa  : Oscillateur à pont de Wien (3/3), bouclage du système",
            "url": "https://www.youtube.com/watch?v=C3uzEHzWInY",
            "duration": "23:54",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "electronique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-WUgGxmJfIO8",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Cours : réseaux de diffraction (3) - Minimum de déviation- intérêt",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "optique_ondes",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=WUgGxmJfIO8",
        "videos": [
          {
            "id": "WUgGxmJfIO8",
            "title": "Cours : réseaux de diffraction (3) - Minimum de déviation- intérêt",
            "url": "https://www.youtube.com/watch?v=WUgGxmJfIO8",
            "duration": "14:57",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "optique_ondes",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-GBkfj1baSJo",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MP-PSI-PC Analyse de Fourier (1) : théorie et pratique des séries de Fourier",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "electronique",
          "optique_ondes",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=GBkfj1baSJo",
        "videos": [
          {
            "id": "GBkfj1baSJo",
            "title": "MP-PSI-PC Analyse de Fourier (1) : théorie et pratique des séries de Fourier",
            "url": "https://www.youtube.com/watch?v=GBkfj1baSJo",
            "duration": "23:11",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "electronique",
              "optique_ondes",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-jE3ZOvFNyRo",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MP-PSI-PC Electricité-Mesure d'une inductance mutuelle (2/3) par effet de transformateur",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "tp_oraux",
          "electronique"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=jE3ZOvFNyRo",
        "videos": [
          {
            "id": "jE3ZOvFNyRo",
            "title": "MP-PSI-PC Electricité-Mesure d'une inductance mutuelle (2/3) par effet de transformateur",
            "url": "https://www.youtube.com/watch?v=jE3ZOvFNyRo",
            "duration": "08:53",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "tp_oraux",
              "electronique"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-bNFHWU8SxZg",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MP-PSI-PC TP: Oscillations libres et forcées de deux circuits couplés (3)",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "electronique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=bNFHWU8SxZg",
        "videos": [
          {
            "id": "bNFHWU8SxZg",
            "title": "MP-PSI-PC TP: Oscillations libres et forcées de deux circuits couplés (3)",
            "url": "https://www.youtube.com/watch?v=bNFHWU8SxZg",
            "duration": "16:10",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "electronique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-K76Ao8EHPc4",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MP/PC-Optique ondulatoire-Michelson en lumière blanche/blanc d'ordre supérieur",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "optique_ondes",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=K76Ao8EHPc4",
        "videos": [
          {
            "id": "K76Ao8EHPc4",
            "title": "MP/PC-Optique ondulatoire-Michelson en lumière blanche/blanc d'ordre supérieur",
            "url": "https://www.youtube.com/watch?v=K76Ao8EHPc4",
            "duration": "06:16",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "optique_ondes",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-LMWJB8pvXks",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MP/PC/PSI Comment rédiger efficacement une copie de concours ? 2ème partie",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés Concours CPGE.",
        "themes": [
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=LMWJB8pvXks",
        "videos": [
          {
            "id": "LMWJB8pvXks",
            "title": "MP/PC/PSI Comment rédiger efficacement une copie de concours ? 2ème partie",
            "url": "https://www.youtube.com/watch?v=LMWJB8pvXks",
            "duration": "16:06",
            "chapitre": "Corrigés Concours CPGE",
            "themes": [
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid--x_v2Q7r218",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MP/PC/PSI-Cours optique physique - Polarisation(3/10).  Loi de Malus (2). Photodiode",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "optique_ondes",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=-x_v2Q7r218",
        "videos": [
          {
            "id": "-x_v2Q7r218",
            "title": "MP/PC/PSI-Cours optique physique - Polarisation(3/10).  Loi de Malus (2). Photodiode",
            "url": "https://www.youtube.com/watch?v=-x_v2Q7r218",
            "duration": "14:42",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "optique_ondes",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-8sUHOglKU44",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MP/PC/PT : Optique ondulatoire. Longueur de cohérence temporelle",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "optique_ondes",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=8sUHOglKU44",
        "videos": [
          {
            "id": "8sUHOglKU44",
            "title": "MP/PC/PT : Optique ondulatoire. Longueur de cohérence temporelle",
            "url": "https://www.youtube.com/watch?v=8sUHOglKU44",
            "duration": "07:38",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "optique_ondes",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-itEGBUTNcVI",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MP/PC/PT Rôles et réglage des lames séparatrice et compensatrice pour un interféromètre de Michelson",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "optique_ondes",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=itEGBUTNcVI",
        "videos": [
          {
            "id": "itEGBUTNcVI",
            "title": "MP/PC/PT Rôles et réglage des lames séparatrice et compensatrice pour un interféromètre de Michelson",
            "url": "https://www.youtube.com/watch?v=itEGBUTNcVI",
            "duration": "06:48",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "optique_ondes",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-fXPOvN6gT3Q",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MP/PC/PT : Présentation du michelson",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "optique_ondes",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=fXPOvN6gT3Q",
        "videos": [
          {
            "id": "fXPOvN6gT3Q",
            "title": "MP/PC/PT : Présentation du michelson",
            "url": "https://www.youtube.com/watch?v=fXPOvN6gT3Q",
            "duration": "05:58",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "optique_ondes",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-fY_MF5CrPOM",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MP/PC/PT:  Optique ondulatoire. Mesure du doublet du sodium avec un Michelson",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "optique_ondes",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=fY_MF5CrPOM",
        "videos": [
          {
            "id": "fY_MF5CrPOM",
            "title": "MP/PC/PT:  Optique ondulatoire. Mesure du doublet du sodium avec un Michelson",
            "url": "https://www.youtube.com/watch?v=fY_MF5CrPOM",
            "duration": "17:16",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "optique_ondes",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-Q52Rc4WjxXc",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MPSI-PCSI-PTSI-Circuit RLC série- mesure de L et de M",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "tp_oraux",
          "electronique"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=Q52Rc4WjxXc",
        "videos": [
          {
            "id": "Q52Rc4WjxXc",
            "title": "MPSI-PCSI-PTSI-Circuit RLC série- mesure de L et de M",
            "url": "https://www.youtube.com/watch?v=Q52Rc4WjxXc",
            "duration": "21:31",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "tp_oraux",
              "electronique"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-iaxNL6HWJqA",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MPSI/PCSI-Filtrage linéaire(2/5)-analyse qualitative-comment mesurer une fréquence de coupure",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "tp_oraux",
          "electronique"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=iaxNL6HWJqA",
        "videos": [
          {
            "id": "iaxNL6HWJqA",
            "title": "MPSI/PCSI-Filtrage linéaire(2/5)-analyse qualitative-comment mesurer une fréquence de coupure",
            "url": "https://www.youtube.com/watch?v=iaxNL6HWJqA",
            "duration": "06:01",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "tp_oraux",
              "electronique"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-x5T7H7BYCl0",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MPSI/PCSI-Filtrage linéaire(3/5)-fonction de transfert-diagramme de Bode",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "electronique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=x5T7H7BYCl0",
        "videos": [
          {
            "id": "x5T7H7BYCl0",
            "title": "MPSI/PCSI-Filtrage linéaire(3/5)-fonction de transfert-diagramme de Bode",
            "url": "https://www.youtube.com/watch?v=x5T7H7BYCl0",
            "duration": "11:33",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "electronique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-oj9gK-VMGg8",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MPSI/PCSI Réglage d'un goniomètre/mesure de l'angle d'un prisme",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=oj9gK-VMGg8",
        "videos": [
          {
            "id": "oj9gK-VMGg8",
            "title": "MPSI/PCSI Réglage d'un goniomètre/mesure de l'angle d'un prisme",
            "url": "https://www.youtube.com/watch?v=oj9gK-VMGg8",
            "duration": "09:49",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-v2OBa0FTZbE",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MPSI/PCSI-Electronique -Filtre passe bas d'ordre 2 (1/5). Comment faire le montage?",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "electronique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=v2OBa0FTZbE",
        "videos": [
          {
            "id": "v2OBa0FTZbE",
            "title": "MPSI/PCSI-Electronique -Filtre passe bas d'ordre 2 (1/5). Comment faire le montage?",
            "url": "https://www.youtube.com/watch?v=v2OBa0FTZbE",
            "duration": "07:35",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "electronique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-tfSov0bGGzg",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MPSI/PCSI-Filtrage linéaire(4/5)-Mesure de déphasage-Lissajous",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "tp_oraux",
          "electronique"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=tfSov0bGGzg",
        "videos": [
          {
            "id": "tfSov0bGGzg",
            "title": "MPSI/PCSI-Filtrage linéaire(4/5)-Mesure de déphasage-Lissajous",
            "url": "https://www.youtube.com/watch?v=tfSov0bGGzg",
            "duration": "10:46",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "tp_oraux",
              "electronique"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-0WqqLtnMdj0",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MPSI/PCSI. Optique géométrique. Prisme/Minimum de déviation",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "optique_ondes",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=0WqqLtnMdj0",
        "videos": [
          {
            "id": "0WqqLtnMdj0",
            "title": "MPSI/PCSI. Optique géométrique. Prisme/Minimum de déviation",
            "url": "https://www.youtube.com/watch?v=0WqqLtnMdj0",
            "duration": "22:28",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "optique_ondes",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-ok-qm2fvWSE",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · MPSI/PCSI/PTSI comment utiliser un oscilloscope numérique?",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=ok-qm2fvWSE",
        "videos": [
          {
            "id": "ok-qm2fvWSE",
            "title": "MPSI/PCSI/PTSI comment utiliser un oscilloscope numérique?",
            "url": "https://www.youtube.com/watch?v=ok-qm2fvWSE",
            "duration": "09:03",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-SSzp6CEa0fo",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Mesure de l'impédance d'un oscillo AC/DC(1/3)-Méthode de tension moitiée",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "tp_oraux",
          "electronique"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=SSzp6CEa0fo",
        "videos": [
          {
            "id": "SSzp6CEa0fo",
            "title": "Mesure de l'impédance d'un oscillo AC/DC(1/3)-Méthode de tension moitiée",
            "url": "https://www.youtube.com/watch?v=SSzp6CEa0fo",
            "duration": "12:42",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "tp_oraux",
              "electronique"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-gNElaD4iHqc",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · PC/MP- Optique ondulatoire- 5 minutes pour régler un Michelson !",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "optique_ondes",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=gNElaD4iHqc",
        "videos": [
          {
            "id": "gNElaD4iHqc",
            "title": "PC/MP- Optique ondulatoire- 5 minutes pour régler un Michelson !",
            "url": "https://www.youtube.com/watch?v=gNElaD4iHqc",
            "duration": "06:45",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "optique_ondes",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-lOvs3K_IX90",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · PC/PSI Ondes stationnaires dans un câble coaxial, modes propres",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "optique_ondes",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=lOvs3K_IX90",
        "videos": [
          {
            "id": "lOvs3K_IX90",
            "title": "PC/PSI Ondes stationnaires dans un câble coaxial, modes propres",
            "url": "https://www.youtube.com/watch?v=lOvs3K_IX90",
            "duration": "07:21",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "optique_ondes",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-5lCQCcgIIXw",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · PC/PSI Propagation d'une impulsion dans un câble coaxial",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=5lCQCcgIIXw",
        "videos": [
          {
            "id": "5lCQCcgIIXw",
            "title": "PC/PSI Propagation d'une impulsion dans un câble coaxial",
            "url": "https://www.youtube.com/watch?v=5lCQCcgIIXw",
            "duration": "12:24",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-wFs3XlzLLqc",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Démodulation par détecteur de crête-modulation/démodulation d'amplitude (3/4)",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "electronique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=wFs3XlzLLqc",
        "videos": [
          {
            "id": "wFs3XlzLLqc",
            "title": "Démodulation par détecteur de crête-modulation/démodulation d'amplitude (3/4)",
            "url": "https://www.youtube.com/watch?v=wFs3XlzLLqc",
            "duration": "14:52",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "electronique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-6-thwSfD87s",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Electronique prépa  : Oscillateur à pont de Wien (2/3), étude du filtre de Wien",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "electronique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=6-thwSfD87s",
        "videos": [
          {
            "id": "6-thwSfD87s",
            "title": "Electronique prépa  : Oscillateur à pont de Wien (2/3), étude du filtre de Wien",
            "url": "https://www.youtube.com/watch?v=6-thwSfD87s",
            "duration": "14:27",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "electronique",
              "tp_oraux"
            ]
          }
        ]
      },
      {
        "id": "methodo-vid-QpqnHPh3Q9Q",
        "annee": "Oral & Méthode",
        "filiere": "PC",
        "label": "Corrigé Vidéo · Repliement de spectre- échantillonnage (4/4)",
        "description": "Résolution détaillée en vidéo par E-Learning Physique. Chapitre : Corrigés TP Concours.",
        "themes": [
          "electronique",
          "tp_oraux"
        ],
        "enonce": "",
        "correction": "",
        "corriges": [],
        "video": "https://www.youtube.com/watch?v=QpqnHPh3Q9Q",
        "videos": [
          {
            "id": "QpqnHPh3Q9Q",
            "title": "Repliement de spectre- échantillonnage (4/4)",
            "url": "https://www.youtube.com/watch?v=QpqnHPh3Q9Q",
            "duration": "07:54",
            "chapitre": "Corrigés TP Concours",
            "themes": [
              "electronique",
              "tp_oraux"
            ]
          }
        ]
      }
    ]
  }
];
