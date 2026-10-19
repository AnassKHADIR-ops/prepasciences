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
  // ── 1. ÉLECTRONIQUE & TRAITEMENT DU SIGNAL ──
  {
    id: "elec",
    titre: "Électronique & Traitement du Signal",
    icon: "⚡",
    description: "Circuits linéaires dans l'ARQS, ponts diviseurs, régimes transitoires, régime sinusoïdal forcé, filtrage analogique, amplificateur opérationnel et électronique numérique.",
    chapitres: [
      {
        id: "elec-ch1",
        num: 1,
        titre: "Circuits linéaires dans l'ARQS, Ponts Diviseurs & Théorèmes Généraux",
        badge: "Sup MPSI/PCSI",
        moduleName: "Électronique",
        description: "Lois de Kirchhoff, ponts diviseurs de tension et de courant, théorèmes de Thévenin, Norton, Millman et superposition.",
        cours: [
          {
            id: "sess-elec-poly-sup",
            titre: "Polycopié de Cours Complet : Électronique Sup",
            sous: "Support rédigé officiel par Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/13E4XVUfG_9qhKkPUHj22U0SZXcs-YkV6/preview",
          },
          {
            id: "sess-elec-resume",
            titre: "Cours Résumé Général : Formulaire & Mémento Transversal",
            sous: "Synthèse indispensable pour l'ensemble du programme CPGE",
            support: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-elec-sup",
            titre: "Polycopié Officiel : Électronique Sup MPSI/PCSI",
            sous: "Support intégral rédigé (Pr. Hassan EDDAMS)",
            url: "https://drive.google.com/file/d/13E4XVUfG_9qhKkPUHj22U0SZXcs-YkV6/preview",
          },
          {
            id: "fiche-elec-resume-gen",
            titre: "Fiche Synthèse : Cours Résumé Général CPGE",
            sous: "Formules clés & Réflexes pour les concours",
            url: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
          },
        ],
        tds: [
          {
            id: "td-elec-arqs",
            titre: "TD 1 · Circuits dans l'ARQS",
            sous: "Lois des nœuds, lois des mailles, potentiels de nœuds et bilans de puissance",
            enonce: "https://drive.google.com/file/d/1D2ZHT8AA9MuKc3C7w_W45dSDa9yuZogb/preview",
            correction: "https://drive.google.com/file/d/1Cxm5r_BtXbB3WzDmFhSMk6oz-qsGH0ck/preview",
            corriges: [
              {
                id: "corr-elec-arqs",
                titre: "Corrigé Détaillé : Circuits dans l'ARQS",
                url: "https://drive.google.com/file/d/1Cxm5r_BtXbB3WzDmFhSMk6oz-qsGH0ck/preview",
                type: "pdf",
              },
            ],
          },
          {
            id: "td-elec-ponts",
            titre: "TD 2 · Ponts Diviseurs & Théorèmes Généraux",
            sous: "Théorème de Thévenin, Norton, Millman et méthode des ponts diviseurs",
            enonce: "https://drive.google.com/file/d/1btgmDBTLrQeZzrt2UVDzQQMUQ2WEqGj0/preview",
            correction: "https://drive.google.com/file/d/1TSW-I3j7H1oZj5q8nslc4IHS00CH5B7B/preview",
            corriges: [
              {
                id: "corr-elec-ponts",
                titre: "Corrigé Détaillé : Ponts diviseurs & Théorèmes",
                url: "https://drive.google.com/file/d/1TSW-I3j7H1oZj5q8nslc4IHS00CH5B7B/preview",
                type: "pdf",
              },
            ],
          },
        ],
      },
      {
        id: "elec-ch2",
        num: 2,
        titre: "Régimes Transitoires & Régime Sinusoïdal Forcé (RSF)",
        badge: "Fondamental CPGE",
        moduleName: "Électronique",
        description: "Équations différentielles linéaires des 1er et 2nd ordres, régimes libre et forcé, impédances complexes, résonance en tension et en intensité.",
        cours: [
          {
            id: "sess-elec-spectrale",
            titre: "Séance 1 : Analyse spectrale",
            sous: "Replay vidéo : Décomposition en séries de Fourier & Spectre d'un signal périodique",
            video: "https://youtu.be/hY2cU-RNsSc",
            support: "https://drive.google.com/file/d/13E4XVUfG_9qhKkPUHj22U0SZXcs-YkV6/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-elec-transitoires",
            titre: "Formulaire : Régimes Transitoires & Impédances en RSF",
            sous: "Temps caractéristique tau, facteur de qualité Q et résonance",
            url: "https://drive.google.com/file/d/13E4XVUfG_9qhKkPUHj22U0SZXcs-YkV6/preview",
          },
        ],
        tds: [
          {
            id: "td-elec-transitoires",
            titre: "TD 3 · Régimes Transitoires du 1er et 2nd Ordre",
            sous: "Circuits RC, RL et RLC série/parallèle, conditions initiales et continuité",
            enonce: "https://drive.google.com/file/d/1b5cbAk5lO_6oQx85BH0qH98SS0JRmW1K/preview",
            correction: "https://drive.google.com/file/d/14Un7bcRT9R00TxaLqotS2mUGkT1dXEvf/preview",
            corriges: [
              {
                id: "corr-elec-transitoires",
                titre: "Corrigé Détaillé : Régimes transitoires",
                url: "https://drive.google.com/file/d/14Un7bcRT9R00TxaLqotS2mUGkT1dXEvf/preview",
                type: "pdf",
              },
            ],
          },
          {
            id: "td-elec-rsf",
            titre: "TD 4 · Régime Sinusoïdal Forcé & Résonance",
            sous: "Calculs d'admittances et impédances complexes, bande passante et déphasage",
            enonce: "https://drive.google.com/file/d/1Ruh1qrMyc35fdR4mAwZfXhlXaKwNteYd/preview",
            correction: "https://drive.google.com/file/d/1stqe72c06KKZKZNK7CoGpo50tVj5gG7L/preview",
            corriges: [
              {
                id: "corr-elec-rsf",
                titre: "Corrigé Détaillé : Régime sinusoïdal forcé",
                url: "https://drive.google.com/file/d/1stqe72c06KKZKZNK7CoGpo50tVj5gG7L/preview",
                type: "pdf",
              },
            ],
          },
        ],
      },
      {
        id: "elec-ch3",
        num: 3,
        titre: "Filtrage Linéaire, Amplificateur Opérationnel & Électronique Numérique",
        badge: "Cœur Concours Spé MP",
        moduleName: "Électronique",
        description: "Diagrammes de Bode, filtres actifs du 1er et 2nd ordre, AOP en régime linéaire et comparateur, transmission de signal et modulation AM.",
        cours: [
          {
            id: "sess-elec-filtre",
            titre: "Séance 2 : Effet d'un filtre sur un signal périodique non sinusoïdal",
            sous: "Replay vidéo : Filtrage harmonique, gain en décibels et distorsion de signal",
            video: "https://youtu.be/eMNgqbLxWEw",
            support: "https://drive.google.com/file/d/1WfX9-CoNGUvIQ1BCAH-YRBjwrSqvxTyN/preview",
          },
          {
            id: "sess-elec-numerique",
            titre: "Séance 3 : Électronique numérique",
            sous: "Replay vidéo : Échantillonnage, théorème de Shannon, quantification et convertisseurs CAN/CNA",
            video: "https://youtu.be/0bXfitifdIQ",
            support: "https://drive.google.com/file/d/1WfX9-CoNGUvIQ1BCAH-YRBjwrSqvxTyN/preview",
          },
          {
            id: "sess-elec-modulation",
            titre: "Séance 4 : Modulation et démodulation d'amplitude",
            sous: "Replay vidéo : Spectre d'un signal modulé en amplitude, indice de modulation et détection d'enveloppe",
            video: "https://youtu.be/gNlMZUam4Qk",
            support: "https://drive.google.com/file/d/1WfX9-CoNGUvIQ1BCAH-YRBjwrSqvxTyN/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-elec-spe",
            titre: "Polycopié Officiel : Électronique Spé MP / MP*",
            sous: "Cours complet de Spé par Pr. Hassan EDDAMS",
            url: "https://drive.google.com/file/d/1WfX9-CoNGUvIQ1BCAH-YRBjwrSqvxTyN/preview",
          },
        ],
        tds: [
          {
            id: "td-elec-filtrage",
            titre: "TD 5 · Filtrage Linéaire & Diagrammes de Bode",
            sous: "Filtres passe-bas, passe-haut, passe-bande, gabarits et fonctions de transfert",
            enonce: "https://drive.google.com/file/d/1z94tn8tbyvDwbyNaPrBt8fY4JQ8H8R1T/preview",
            correction: "https://drive.google.com/file/d/1UMigQjwpc9d-imuK-1h-Cubtvu1wx1Ii/preview",
            corriges: [
              {
                id: "corr-elec-filtrage",
                titre: "Corrigé Détaillé : Filtrage linéaire",
                url: "https://drive.google.com/file/d/1UMigQjwpc9d-imuK-1h-Cubtvu1wx1Ii/preview",
                type: "pdf",
              },
            ],
          },
          {
            id: "td-elec-aop",
            titre: "TD 6 · Amplificateur Opérationnel (AOP / ALI)",
            sous: "Montages amplificateurs inverseur, non inverseur, suiveur, sommateur et intégrateur",
            enonce: "https://drive.google.com/file/d/19M85Se07HPHA2KAfEmR4ntfMGJDrOFsr/preview",
            correction: "https://drive.google.com/file/d/1DpNpKTzYHaVEL_4xR4PrHje86knmSoDY/preview",
            corriges: [
              {
                id: "corr-elec-aop",
                titre: "Corrigé Détaillé : Amplificateur opérationnel",
                url: "https://drive.google.com/file/d/1DpNpKTzYHaVEL_4xR4PrHje86knmSoDY/preview",
                type: "pdf",
              },
            ],
          },
        ],
      },
    ],
  },

  // ── 2. ÉLECTROMAGNÉTISME & ÉQUATIONS DE MAXWELL ──
  {
    id: "em",
    titre: "Électromagnétisme & Équations de Maxwell",
    icon: "🧲",
    description: "Opérateurs vectoriels, électrostatique, magnétostatique, équations de Maxwell dans le vide et dans les milieux conducteurs, induction et énergie de Poynting.",
    chapitres: [
      {
        id: "em-ch1",
        num: 4,
        titre: "Opérateurs Vectoriels, Loi d'Ohm & Électrostatique",
        badge: "Fondamental MP*",
        moduleName: "Électromagnétisme",
        description: "Gradient, divergence, rotationnel, laplacien, conservation de la charge électrique, loi d'Ohm locale et théorèmes intégraux de Gauss.",
        cours: [
          {
            id: "sess-em-operateurs",
            titre: "Électromagnétisme : Opérateurs vectoriels",
            sous: "Replay vidéo : Analyse vectorielle, gradient, divergence, rotationnel et intégrales curvilignes/surfaciques",
            video: "https://youtu.be/dmTOvubS8YI",
            support: "https://drive.google.com/file/d/1cCXZC130ZRRkysF5U0bLjBEcwHImVRRp/preview",
          },
          {
            id: "sess-em-charge",
            titre: "Conservation de la charge",
            sous: "Replay vidéo : Densité de courant volumique, équation de continuité locale et flux conservatif",
            video: "https://youtu.be/leS6MU_6Ryw",
            support: "https://drive.google.com/file/d/1cCXZC130ZRRkysF5U0bLjBEcwHImVRRp/preview",
          },
          {
            id: "sess-em-ohm",
            titre: "Loi d'Ohm locale et intégrale",
            sous: "Replay vidéo : Conductivité électrique, modèle de Drude, dissipation par effet Joule et résistance d'un conducteur",
            video: "https://youtu.be/pLLrpWyzTDU",
            support: "https://drive.google.com/file/d/1cCXZC130ZRRkysF5U0bLjBEcwHImVRRp/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-em-sup",
            titre: "Polycopié Officiel : Électromagnétisme Sup MPSI/PCSI",
            sous: "Cours complet d'Électromagnétisme Sup par Pr. Hassan EDDAMS",
            url: "https://drive.google.com/file/d/1cCXZC130ZRRkysF5U0bLjBEcwHImVRRp/preview",
          },
          {
            id: "fiche-em-resume",
            titre: "Cours Résumé Général : Électromagnétisme & Formulaire CPGE",
            sous: "Constantes fondamentales, symétries et réflexes de concours",
            url: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
          },
        ],
        tds: [
          {
            id: "td-em-electrostatique",
            titre: "TD 1 · Électrostatique — Champ & Potentiel",
            sous: "Théorème de Gauss, distribution sphérique et cylindrique, dipôle électrostatique et énergie",
            enonce: "https://drive.google.com/file/d/1TyN8Nyfi_5V3haPG95gIJ39TGKO4AqsV/preview",
            correction: "https://drive.google.com/file/d/1Sf0OyjR2yPrn6MVmEOEJnR23tsT3u66c/preview",
            corriges: [
              {
                id: "corr-em-es",
                titre: "Corrigé Détaillé : Électrostatique",
                url: "https://drive.google.com/file/d/1Sf0OyjR2yPrn6MVmEOEJnR23tsT3u66c/preview",
                type: "pdf",
              },
            ],
          },
        ],
      },
      {
        id: "em-ch2",
        num: 5,
        titre: "Magnétostatique & Équations de Maxwell (Spé MP/MP*)",
        badge: "Cœur Concours Spé MP",
        moduleName: "Électromagnétisme",
        description: "Théorème d'Ampère, loi de Biot et Savart, formulation locale et intégrale des équations de Maxwell, induction de Faraday et vecteur de Poynting.",
        cours: [
          {
            id: "sess-em-poly-spe",
            titre: "Polycopié de Cours Complet : Électromagnétisme Spé",
            sous: "Support rédigé de référence CPGE Spé MP / MP* (Pr. Hassan EDDAMS)",
            support: "https://drive.google.com/file/d/1Cps5Q9bXojoRF-Px2rLMQtqunXz9pd7H/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-em-spe",
            titre: "Polycopié Officiel : Électromagnétisme Spé MP / MP*",
            sous: "Cours complet de Spé par Pr. Hassan EDDAMS",
            url: "https://drive.google.com/file/d/1Cps5Q9bXojoRF-Px2rLMQtqunXz9pd7H/preview",
          },
        ],
        tds: [
          {
            id: "td-em-magnetostatique",
            titre: "TD 2 · Magnétostatique — Champ Créé par les Courants",
            sous: "Théorème d'Ampère, bobines, solénoïde, nappe de courant et dipôle magnétique",
            enonce: "https://drive.google.com/file/d/1MPhYLRuchVRW7DpdK6RR9NoPAZvrm4gi/preview",
            correction: "https://drive.google.com/file/d/1E8g6asTIpylOuz6QhgxUDRp_kB5js0L4/preview",
            corriges: [
              {
                id: "corr-em-ms",
                titre: "Corrigé Détaillé : Magnétostatique",
                url: "https://drive.google.com/file/d/1E8g6asTIpylOuz6QhgxUDRp_kB5js0L4/preview",
                type: "pdf",
              },
            ],
          },
        ],
      },
    ],
  },

  // ── 3. THERMODYNAMIQUE & TRANSFERTS THERMIQUES ──
  {
    id: "thermo",
    titre: "Thermodynamique & Transferts Thermiques",
    icon: "🔥",
    description: "Équilibres thermodynamiques, statique des fluides, 1er et 2nd principes, cycles industriels et machines thermiques, changements de phase des corps purs.",
    chapitres: [
      {
        id: "th-ch1",
        num: 6,
        titre: "Équilibres Thermodynamiques, Statique des Fluides & 1er Principe",
        badge: "Sup MPSI/PCSI",
        moduleName: "Thermodynamique",
        description: "Variables d'état, gaz parfaits, équilibre hydrostatique et forces pressantes, premier principe en système fermé et ouvert.",
        cours: [
          {
            id: "sess-th-poly-sup",
            titre: "Polycopié de Cours Complet : Thermodynamique Sup",
            sous: "Support rédigé officiel par Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1bua37-sdAoCzxTZlZeDTrIdZ9NMyc-c-/preview",
          },
          {
            id: "sess-th-resume",
            titre: "Cours Résumé Général : Formulaire & Mémento Thermodynamique",
            sous: "Synthèse générale des principes et diagrammes thermodynamiques",
            support: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-th-sup",
            titre: "Polycopié Officiel : Thermodynamique Sup MPSI/PCSI",
            sous: "Cours complet par Pr. Hassan EDDAMS",
            url: "https://drive.google.com/file/d/1bua37-sdAoCzxTZlZeDTrIdZ9NMyc-c-/preview",
          },
          {
            id: "fiche-th-resume-gen",
            titre: "Résumé Général de Physique CPGE : Thermodynamique",
            sous: "Mémento complet des formules et réflexes de concours",
            url: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
          },
        ],
        tds: [
          {
            id: "td-th-equilibre",
            titre: "TD 1 · Équilibre Thermodynamique & Variables d'État",
            sous: "Coefficients thermoélastiques, équations d'état des gaz réels et température cinétique",
            enonce: "https://drive.google.com/file/d/1Wwb0NvfHGoxcE0BPfHISgiUIx262nKwm/preview",
            correction: "https://drive.google.com/file/d/1JXlkZoYWiHEvtJ7BkhiTRl3bmgQX99Hb/preview",
            corriges: [
              {
                id: "corr-th-equilibre",
                titre: "Corrigé Détaillé : Équilibre thermo",
                url: "https://drive.google.com/file/d/1JXlkZoYWiHEvtJ7BkhiTRl3bmgQX99Hb/preview",
                type: "pdf",
              },
            ],
          },
          {
            id: "td-th-statique",
            titre: "TD 2 · Statique des Fluides",
            sous: "Loi de Pascal, répartition barométrique de pression dans l'atmosphère et poussée d'Archimède",
            enonce: "https://drive.google.com/file/d/1yM2mXAWW2UJy3SZeJpcKYvGlbHV6SJTQ/preview",
            correction: "https://drive.google.com/file/d/1MCdBZp_6BjxiBH6kOKwdXcO1VIKziZrm/preview",
            corriges: [
              {
                id: "corr-th-statique",
                titre: "Corrigé Détaillé : Statique des fluides",
                url: "https://drive.google.com/file/d/1MCdBZp_6BjxiBH6kOKwdXcO1VIKziZrm/preview",
                type: "pdf",
              },
            ],
          },
          {
            id: "td-th-1erprincipe",
            titre: "TD 3 · 1er Principe de la Thermodynamique",
            sous: "Travail des forces de pression, transformations adiabatiques réversibles (Laplace) et bilans d'énergie",
            enonce: "https://drive.google.com/file/d/1WIPmbnh7VjcNL6loYL3iV74Fz7Rrt2zB/preview",
            correction: "https://drive.google.com/file/d/1Tb73ITXLgGEXhRmjPY26Z451I6vrWOAr/preview",
            corriges: [
              {
                id: "corr-th-1erprincipe",
                titre: "Corrigé Détaillé : 1er principe",
                url: "https://drive.google.com/file/d/1Tb73ITXLgGEXhRmjPY26Z451I6vrWOAr/preview",
                type: "pdf",
              },
            ],
          },
        ],
      },
      {
        id: "th-ch2",
        num: 7,
        titre: "Second Principe, Machines Thermiques & Changements de Phase",
        badge: "Incontournable Concours",
        moduleName: "Thermodynamique",
        description: "Entropie, création d'entropie, cycles moteurs et frigorifiques, théorème de Carnot, formule de Clapeyron et transitions liquide-vapeur.",
        cours: [
          {
            id: "sess-th-poly-spe",
            titre: "Polycopié de Cours Complet : Thermodynamique Spé",
            sous: "Support rédigé de référence CPGE Spé MP / MP* (Pr. Hassan EDDAMS)",
            support: "https://drive.google.com/file/d/1i-njaWdT6HN9uRRMXsfSHgz0vu21n_Pa/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-th-spe",
            titre: "Polycopié Officiel : Thermodynamique Spé MP / MP*",
            sous: "Cours complet de Spé par Pr. Hassan EDDAMS",
            url: "https://drive.google.com/file/d/1i-njaWdT6HN9uRRMXsfSHgz0vu21n_Pa/preview",
          },
        ],
        tds: [
          {
            id: "td-th-2ndprincipe",
            titre: "TD 4 · 2nd Principe de la Thermodynamique",
            sous: "Bilans d'entropie en système fermé et ouvert, irréversibilités thermique et mécanique",
            enonce: "https://drive.google.com/file/d/1Cf6iOMrsFTuchuW7kXpcKsSgrj6NXtEV/preview",
            correction: "https://drive.google.com/file/d/1AzRFM3w8tZF7VwX7sk62XtufNQvlrWu-/preview",
            corriges: [
              {
                id: "corr-th-2ndprincipe",
                titre: "Corrigé Détaillé : 2nd principe",
                url: "https://drive.google.com/file/d/1AzRFM3w8tZF7VwX7sk62XtufNQvlrWu-/preview",
                type: "pdf",
              },
            ],
          },
          {
            id: "td-th-machines",
            titre: "TD 5 · Machines Thermiques & Cycles Moteurs",
            sous: "Cycles de Carnot, Beau de Rochas, Diesel, Stirling, pompes à chaleur et efficacité thermodynamique",
            enonce: "https://drive.google.com/file/d/1z2vU1CzVpmT9VMda4sJFJv3WB18GA60O/preview",
            correction: "https://drive.google.com/file/d/1N8z0V68GxIhrQlpTGd0oII_mx_EwvRC_/preview",
            corriges: [
              {
                id: "corr-th-machines",
                titre: "Corrigé Détaillé : Machines thermiques",
                url: "https://drive.google.com/file/d/1N8z0V68GxIhrQlpTGd0oII_mx_EwvRC_/preview",
                type: "pdf",
              },
            ],
          },
          {
            id: "td-th-changementphase",
            titre: "TD 6 · Changement de Phase des Corps Purs",
            sous: "Formule de Clapeyron, diagrammes (P, T) et (P, v), isothermes d'Andrews et titre massique en vapeur",
            enonce: "https://drive.google.com/file/d/19EwT7Iwvjq4fn5h0ReXWJLcQmB_PsywF/preview",
            correction: "https://drive.google.com/file/d/1G5sqqfWXjsWPSTmr-uNfDxdFdaQV3ajQ/preview",
            corriges: [
              {
                id: "corr-th-changementphase",
                titre: "Corrigé Détaillé : Changement de phase",
                url: "https://drive.google.com/file/d/1G5sqqfWXjsWPSTmr-uNfDxdFdaQV3ajQ/preview",
                type: "pdf",
              },
            ],
          },
        ],
      },
    ],
  },

  // ── 4. MÉCANIQUE DU POINT & DES SOLIDES ──
  {
    id: "meca",
    titre: "Mécanique du Point & des Solides",
    icon: "⚙️",
    description: "Cinématique en coordonnées cylindriques et sphériques, dynamique newtonienne, théorèmes énergétiques, moment cinétique, forces centrales et référentiels non galiléens.",
    chapitres: [
      {
        id: "meca-ch1",
        num: 8,
        titre: "Cinématique, Dynamique Newtonienne & Théorèmes Énergétiques",
        badge: "Sup MPSI/PCSI",
        moduleName: "Mécanique",
        description: "Vecteurs vitesse et accélération en bases mobiles, principe fondamental de la dynamique, frottements solide et fluide, travail et puissance mécanique.",
        cours: [
          {
            id: "sess-meca-poly-sup",
            titre: "Polycopié de Cours Complet : Mécanique Sup",
            sous: "Support rédigé de référence CPGE par Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1zYe4Rhy3vnx8af57zkroLgGflWFCn0L4/preview",
          },
          {
            id: "sess-meca-resume",
            titre: "Cours Résumé Général : Formulaire de Mécanique CPGE",
            sous: "Synthèse transversale des lois fondamentales du mouvement",
            support: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-meca-sup",
            titre: "Polycopié Officiel : Mécanique Sup MPSI/PCSI",
            sous: "Cours complet rédigé par Pr. Hassan EDDAMS",
            url: "https://drive.google.com/file/d/1zYe4Rhy3vnx8af57zkroLgGflWFCn0L4/preview",
          },
          {
            id: "fiche-meca-resume-gen",
            titre: "Résumé Général de Physique CPGE : Mécanique",
            sous: "Mémento de cinématique et théorèmes généraux",
            url: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
          },
        ],
        tds: [
          {
            id: "td-meca-cinematique",
            titre: "TD 1 · Cinématique du Point Matériel",
            sous: "Coordonnées cartésiennes, polaires, cylindriques, sphériques et base de Frenet",
            enonce: "https://drive.google.com/file/d/1z6j35LrvGJSFjyhzFwvD-cGExgUKtSX7/preview",
          },
          {
            id: "td-meca-dynamique",
            titre: "TD 2 · Dynamique du Point & Lois de Newton",
            sous: "Principe fondamental de la dynamique, lois de frottement de Coulomb et équations du mouvement",
            enonce: "https://drive.google.com/file/d/1awu2xV3NtP9V7kAVsxNrZmBwpQ1D0P7O/preview",
          },
          {
            id: "td-meca-energie",
            titre: "TD 3 · Théorèmes Énergétiques & Énergie Mécanique",
            sous: "Théorème de l'énergie cinétique, énergie potentielle, puits de potentiel et petites oscillations",
            enonce: "https://drive.google.com/file/d/16V7hrpr3n7yRmvzc8wI9lD7UKF9hh1Ft/preview",
          },
        ],
      },
      {
        id: "meca-ch2",
        num: 9,
        titre: "Moment Cinétique, Forces Centrales & Changement de Référentiel",
        badge: "Fondamental Concours",
        moduleName: "Mécanique",
        description: "Théorème du moment cinétique, lois de Kepler et champ newtonien, composition des mouvements et forces d'inertie d'entraînement et de Coriolis.",
        cours: [
          {
            id: "sess-meca-poly-centrales",
            titre: "Cours Approfondi : Mouvement à Force Centrale & Référentiels Accélérés",
            sous: "Support rédigé de référence Mécanique Sup (Pr. Hassan EDDAMS)",
            support: "https://drive.google.com/file/d/1zYe4Rhy3vnx8af57zkroLgGflWFCn0L4/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-meca-centrales",
            titre: "Formulaire : Moment Cinétique, Binet & Lois de Kepler",
            sous: "Trajectoires coniques, énergie mécanique et vitesse de libération",
            url: "https://drive.google.com/file/d/1zYe4Rhy3vnx8af57zkroLgGflWFCn0L4/preview",
          },
        ],
        tds: [
          {
            id: "td-meca-moment",
            titre: "TD 4 · Moment Cinétique du Point Matériel",
            sous: "Théorème du moment cinétique en un point fixe et par rapport à un axe fixe",
            enonce: "https://drive.google.com/file/d/1yxB_dYYZJu9RnCfVRWALIbAvG4JRFB3C/preview",
          },
          {
            id: "td-meca-centrales",
            titre: "TD 5 · Mouvement dans un Champ de Forces Centrales",
            sous: "Loi des aires, formules de Binet, potentiel effectif, orbites fermées et satellites",
            enonce: "https://drive.google.com/file/d/1yOL0NVR3J_317ROACaQlqK3YR3ZY3PWj/preview",
          },
          {
            id: "td-meca-ref",
            titre: "TD 6 · Changement de Référentiel & Forces d'Inertie",
            sous: "Référentiels non galiléens, accélération d'entraînement, force de Coriolis et pendule de Foucault",
            enonce: "https://drive.google.com/file/d/1c7q1bi5OMAIay-f1_c_xqg4JCFNUw-mH/preview",
            correction: "https://drive.google.com/file/d/1iAGffnI1qbdxwGyTAi1JYuGFaKDLBsH4/preview",
            corriges: [
              {
                id: "corr-meca-ref",
                titre: "Corrigé Détaillé : Changement de référentiel",
                url: "https://drive.google.com/file/d/1iAGffnI1qbdxwGyTAi1JYuGFaKDLBsH4/preview",
                type: "pdf",
              },
            ],
          },
        ],
      },
    ],
  },

  // ── 5. OPTIQUE GÉOMÉTRIQUE & ONDULATOIRE ──
  {
    id: "optique",
    titre: "Optique Géométrique & Optique Ondulatoire",
    icon: "🌈",
    description: "Lois de Descartes, conditions de Gauss, miroirs et lentilles minces, modèle scalaire de la lumière, interférences lumineuses à 2 ondes et interféromètre de Michelson.",
    chapitres: [
      {
        id: "opt-ch1",
        num: 10,
        titre: "Optique Géométrique : Réfraction, Lentilles & Instruments",
        badge: "Sup MPSI/PCSI",
        moduleName: "Optique Géométrique",
        description: "Lois de Snell-Descartes, principe de Fermat, stigmatisme approché, lentilles minces convergentes et divergentes, miroirs sphériques et systèmes optiques centrés.",
        cours: [
          {
            id: "sess-opt-poly-sup",
            titre: "Polycopié de Cours Complet : Optique Géométrique Sup",
            sous: "Support rédigé officiel par Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1osVzESQuM2FeoF-gDTZova3nPuBdF0u3/preview",
          },
          {
            id: "sess-opt-resume",
            titre: "Cours Résumé Général : Formulaire d'Optique CPGE",
            sous: "Formules de Descartes et Newton, grandissement et foyers",
            support: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-opt-sup",
            titre: "Polycopié Officiel : Optique Géométrique Sup MPSI/PCSI",
            sous: "Cours complet rédigé par Pr. Hassan EDDAMS",
            url: "https://drive.google.com/file/d/1osVzESQuM2FeoF-gDTZova3nPuBdF0u3/preview",
          },
          {
            id: "fiche-opt-resume-gen",
            titre: "Résumé Général de Physique CPGE : Optique Géométrique",
            sous: "Mémento complet des formules et réflexes de concours",
            url: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
          },
        ],
        tds: [
          {
            id: "td-opt-lois",
            titre: "TD 1 · Lois de l'Optique Géométrique & Réfraction",
            sous: "Lois de Snell-Descartes, prisme, angle de déviation minimale et réflexion totale",
            enonce: "https://drive.google.com/file/d/11Ax0w7Eh5ZtHNl2DCKJEqnZUXve4qR9g/preview",
          },
          {
            id: "td-opt-images",
            titre: "TD 2 · Images & Instruments d'Optique",
            sous: "Conditions de Gauss, lentilles minces accollées, loupe, lunette astronomique et microscope",
            enonce: "https://drive.google.com/file/d/1XNI_L3JI3GIAXbG82uFpfmM86LIoJS-c/preview",
          },
        ],
      },
      {
        id: "opt-ch2",
        num: 11,
        titre: "Optique Ondulatoire : Interférences & Dispositifs Interférentiels",
        badge: "Cœur Concours Spé MP",
        moduleName: "Optique Ondulatoire",
        description: "Formule de Fresnel, cohérence spatiale et temporelle, trous d'Young, interféromètre de Michelson en lame d'air (anneaux d'égale inclinaison) et coin d'air (franges d'égale épaisseur).",
        cours: [
          {
            id: "sess-opt-poly-spe",
            titre: "Polycopié de Cours Complet : Optique Ondulatoire Spé",
            sous: "Support rédigé de référence CPGE Spé MP / MP* (Pr. Hassan EDDAMS)",
            support: "https://drive.google.com/file/d/14GnKieXWwiJ9BQowxkx1s36RQtCIGCNt/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-opt-spe",
            titre: "Polycopié Officiel : Optique Ondulatoire Spé MP / MP*",
            sous: "Cours complet de Spé par Pr. Hassan EDDAMS",
            url: "https://drive.google.com/file/d/14GnKieXWwiJ9BQowxkx1s36RQtCIGCNt/preview",
          },
        ],
        tds: [
          {
            id: "td-opt-interferences",
            titre: "TD 3 · Interférences Lumineuses & Michelson (Spé MP)",
            sous: "Calcul de différence de marche, interfrange, contraste, lame d'air et coin d'air",
            enonce: "https://drive.google.com/file/d/14GnKieXWwiJ9BQowxkx1s36RQtCIGCNt/preview",
          },
        ],
      },
    ],
  },

  // ── 6. PHYSIQUE DES ONDES & PHYSIQUE QUANTIQUE ──
  {
    id: "ondes-quantique",
    titre: "Physique des Ondes & Physique Quantique",
    icon: "⚛️",
    description: "Propagation d'ondes unidimensionnelles et tridimensionnelles, équation de d'Alembert, dispersion, ondes acoustiques, équation de Schrödinger et puits de potentiel.",
    chapitres: [
      {
        id: "ondes-ch1",
        num: 12,
        titre: "Physique des Ondes : Équation de d'Alembert & Phénomènes de Propagation",
        badge: "Spé MP / MP*",
        moduleName: "Physique des Ondes",
        description: "Équation de propagation d'Alembertienne, ondes progressives et stationnaires, relation de dispersion, vitesse de phase et de groupe, réflexion et transmission.",
        cours: [
          {
            id: "sess-ondes-poly-spe",
            titre: "Polycopié de Cours Complet : Physique des Ondes Spé",
            sous: "Support rédigé de référence CPGE Spé MP / MP* (Pr. Hassan EDDAMS)",
            support: "https://drive.google.com/file/d/1R5MSxKUKLu7DihUyi85FbYeOUjgAsOmY/preview",
          },
          {
            id: "sess-ondes-resume",
            titre: "Cours Résumé Général : Formulaire Ondes & Oscillateurs CPGE",
            sous: "Mémento transversal des phénomènes ondulatoires",
            support: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-ondes-spe",
            titre: "Polycopié Officiel : Physique des Ondes Spé MP / MP*",
            sous: "Cours complet de Spé par Pr. Hassan EDDAMS",
            url: "https://drive.google.com/file/d/1R5MSxKUKLu7DihUyi85FbYeOUjgAsOmY/preview",
          },
          {
            id: "fiche-ondes-resume-gen",
            titre: "Résumé Général de Physique CPGE : Ondes",
            sous: "Mémento complet des formules et réflexes de concours",
            url: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
          },
        ],
        tds: [
          {
            id: "td-ondes-propagation",
            titre: "TD 1 · Propagation d'Ondes & Équation de d'Alembert",
            sous: "Ondes sur une corde vibrante, ondes sonores dans les fluides et bilans de puissance",
            enonce: "https://drive.google.com/file/d/1R5MSxKUKLu7DihUyi85FbYeOUjgAsOmY/preview",
          },
        ],
      },
      {
        id: "quant-ch1",
        num: 13,
        titre: "Introduction à la Physique Quantique (Spé MP/MP*)",
        badge: "Spé MP / MP*",
        moduleName: "Physique Quantique",
        description: "Dualité onde-particule, relations d'Einstein-De Broglie, paquet d'ondes, inégalités de Heisenberg, équation de Schrödinger stationnaire, puits quantique et effet tunnel.",
        cours: [
          {
            id: "sess-quant-poly-spe",
            titre: "Polycopié de Cours Complet : Physique Quantique Spé",
            sous: "Support rédigé de référence CPGE Spé MP / MP* (Pr. Hassan EDDAMS)",
            support: "https://drive.google.com/file/d/16vt_GRsFEgrQzpRnOZIeyuD5uBdHuU2G/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-quant-spe",
            titre: "Polycopié Officiel : Physique Quantique Spé MP / MP*",
            sous: "Cours complet de Spé par Pr. Hassan EDDAMS",
            url: "https://drive.google.com/file/d/16vt_GRsFEgrQzpRnOZIeyuD5uBdHuU2G/preview",
          },
        ],
        tds: [
          {
            id: "td-quant-puits",
            titre: "TD 1 · Puits de Potentiel & Effet Tunnel",
            sous: "Puits infini et fini, quantification des niveaux d'énergie, densité de probabilité et coefficient de transmission par effet tunnel",
            enonce: "https://drive.google.com/file/d/16vt_GRsFEgrQzpRnOZIeyuD5uBdHuU2G/preview",
          },
        ],
      },
    ],
  },
];
