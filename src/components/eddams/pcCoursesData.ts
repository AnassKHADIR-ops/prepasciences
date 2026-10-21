import { ModuleCoursBlock } from "@/types/courses";
export type { ChapitreItem, ModuleCoursBlock } from "@/types/courses";

// =========================================================================
// 1. PÔLE 1ère ANNÉE : SUP (MPSI / PCSI / TSI)
// =========================================================================
export const PC_COURSES_DATA_SUP: ModuleCoursBlock[] = [
  // ── 1.1 ÉLECTRONIQUE & ÉLECTROCINÉTIQUE (SUP) ──
  {
    id: "elec-sup",
    niveau: "sup",
    titre: "Électronique & Électrocinétique",
    icon: "⚡",
    description: "Circuits dans l'ARQS, ponts diviseurs, régimes transitoires (RC, RL, RLC), régime sinusoïdal forcé, filtrage linéaire et amplificateur opérationnel (AOP).",
    chapitres: [
      {
        id: "elec-sup-ch1",
        num: 1,
        niveau: "sup",
        titre: "Circuits électriques dans l'ARQS",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Électronique Sup",
        description: "Lois des nœuds, lois des mailles, potentiels de nœuds, dipôles et bilans de puissance.",
        cours: [
          {
            id: "sess-elec-sup-poly",
            titre: "Polycopié de Cours Complet : Électronique Sup",
            sous: "Support rédigé officiel par Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/13E4XVUfG_9qhKkPUHj22U0SZXcs-YkV6/preview",
          },
          {
            id: "sess-elec-sup-resume",
            titre: "Cours Résumé Général : Formulaire CPGE",
            sous: "Mémento transversal pour les concours",
            support: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-elec-sup-poly",
            titre: "Polycopié Officiel : Électronique Sup MPSI/PCSI/TSI",
            sous: "Support intégral rédigé (Pr. Hassan EDDAMS)",
            url: "https://drive.google.com/file/d/13E4XVUfG_9qhKkPUHj22U0SZXcs-YkV6/preview",
          },
          {
            id: "fiche-elec-sup-resume",
            titre: "Fiche Synthèse : Cours Résumé Général CPGE",
            sous: "Formules clés & Réflexes pour les concours",
            url: "https://drive.google.com/file/d/1iM7YxwyBKkIDLv1SBYmfJHc7QgSNHxjf/preview",
          },
        ],
        tds: [
          {
            id: "td-elec-arqs",
            titre: "TD 1 · Circuits dans l'ARQS",
            sous: "Lois fondamentales, calculs de résistances équivalentes et bilans",
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
        ],
      },
      {
        id: "elec-sup-ch2",
        num: 2,
        niveau: "sup",
        titre: "Ponts diviseurs & Théorèmes généraux en électrocinétique",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Électronique Sup",
        description: "Diviseurs de tension et de courant, théorèmes de Thévenin, Norton, Millman et superposition.",
        cours: [
          {
            id: "sess-elec-sup-poly-2",
            titre: "Polycopié de Cours Complet : Électronique Sup",
            sous: "Support rédigé officiel par Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/13E4XVUfG_9qhKkPUHj22U0SZXcs-YkV6/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-elec-ponts",
            titre: "Fiche Théorèmes : Thévenin, Norton, Millman & Ponts Diviseurs",
            sous: "Méthodes de résolution rapide des réseaux",
            url: "https://drive.google.com/file/d/13E4XVUfG_9qhKkPUHj22U0SZXcs-YkV6/preview",
          },
        ],
        tds: [
          {
            id: "td-elec-ponts",
            titre: "TD 2 · Ponts Diviseurs & Théorèmes Généraux",
            sous: "Théorème de Thévenin, Norton, Millman et méthode des ponts",
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
        id: "elec-sup-ch3",
        num: 3,
        niveau: "sup",
        titre: "Régime transitoire (RC, RL, RLC)",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Électronique Sup",
        description: "Équations différentielles du 1er et 2nd ordre, réponse à un échelon, temps caractéristique et facteur de qualité Q.",
        cours: [
          {
            id: "sess-elec-transitoires",
            titre: "Polycopié de Cours : Régimes Transitoires",
            sous: "Support officiel Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/13E4XVUfG_9qhKkPUHj22U0SZXcs-YkV6/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-elec-transitoires",
            titre: "Mémento Régimes Transitoires 1er et 2nd Ordre",
            sous: "Formules, continuités et portraits de phase",
            url: "https://drive.google.com/file/d/13E4XVUfG_9qhKkPUHj22U0SZXcs-YkV6/preview",
          },
        ],
        tds: [
          {
            id: "td-elec-transitoires",
            titre: "TD 3 · Régimes Transitoires (RC, RL, RLC)",
            sous: "Échelons de tension, réponses oscillatoires, amorties et critiques",
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
        ],
      },
      {
        id: "elec-sup-ch4",
        num: 4,
        niveau: "sup",
        titre: "Circuits linéaires en régime sinusoïdal forcé (RSF)",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Électronique Sup",
        description: "Impédances et admittances complexes, résonance en intensité et en charge, bande passante.",
        cours: [
          {
            id: "sess-elec-rsf",
            titre: "Polycopié de Cours : Régime Sinusoïdal Forcé",
            sous: "Support officiel Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/13E4XVUfG_9qhKkPUHj22U0SZXcs-YkV6/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-elec-rsf",
            titre: "Formulaire : Impédances complexes & Résonance",
            sous: "Méthodes de calcul rapide en RSF",
            url: "https://drive.google.com/file/d/13E4XVUfG_9qhKkPUHj22U0SZXcs-YkV6/preview",
          },
        ],
        tds: [
          {
            id: "td-elec-rsf",
            titre: "TD 4 · Régime Sinusoïdal Forcé",
            sous: "Calculs d'admittances complexes, résonances et déphasages",
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
        id: "elec-sup-ch5",
        num: 5,
        niveau: "sup",
        titre: "Filtrage linéaire",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Électronique Sup",
        description: "Fonctions de transfert harmoniques, diagrammes de Bode (gain et phase), filtres passifs du 1er et 2nd ordre.",
        cours: [
          {
            id: "sess-elec-filtrage",
            titre: "Polycopié de Cours : Filtrage Linéaire",
            sous: "Support officiel Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/13E4XVUfG_9qhKkPUHj22U0SZXcs-YkV6/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-elec-filtrage",
            titre: "Synthèse : Diagrammes de Bode & Types de Filtres",
            sous: "Gabarits, pulsations de coupure et asymptotes",
            url: "https://drive.google.com/file/d/13E4XVUfG_9qhKkPUHj22U0SZXcs-YkV6/preview",
          },
        ],
        tds: [
          {
            id: "td-elec-filtrage",
            titre: "TD 5 · Filtrage Linéaire",
            sous: "Filtres passe-bas, passe-haut, passe-bande et diagrammes de Bode",
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
        ],
      },
      {
        id: "elec-sup-ch6",
        num: 6,
        niveau: "sup",
        titre: "Amplificateur opérationnel (AOP / ALI)",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Électronique Sup",
        description: "Modèle de l'AOP idéal, fonctionnement en régime linéaire et non linéaire (comparateur), montages amplificateurs fondamentaux.",
        cours: [
          {
            id: "sess-elec-aop",
            titre: "Polycopié de Cours : Amplificateur Opérationnel",
            sous: "Support officiel Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/13E4XVUfG_9qhKkPUHj22U0SZXcs-YkV6/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-elec-aop",
            titre: "Montages Types à AOP : Inverseur, Suiveur, Intégrateur",
            sous: "Règles du court-circuit virtuel et de contre-réaction",
            url: "https://drive.google.com/file/d/13E4XVUfG_9qhKkPUHj22U0SZXcs-YkV6/preview",
          },
        ],
        tds: [
          {
            id: "td-elec-aop",
            titre: "TD 6 · Amplificateur Opérationnel",
            sous: "Montages à contre-réaction négative, filtres actifs et stabilité",
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

  // ── 1.2 THERMODYNAMIQUE (SUP) ──
  {
    id: "thermo-sup",
    niveau: "sup",
    titre: "Thermodynamique Sup",
    icon: "🔥",
    description: "Systèmes à l'équilibre, statique des fluides, 1er et 2nd principes, cycles thermiques, machines motrices et changement d'état d'un corps pur.",
    chapitres: [
      {
        id: "thermo-sup-ch1",
        num: 1,
        niveau: "sup",
        titre: "Système thermodynamique à l'équilibre",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Thermodynamique Sup",
        description: "Grandeurs macroscopiques, équation d'état des gaz parfaits, équilibre thermique et mécanique.",
        cours: [
          {
            id: "sess-thermo-poly",
            titre: "Polycopié de Cours Complet : Thermodynamique Sup",
            sous: "Support rédigé officiel par Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1bua37-sdAoCzxTZlZeDTrIdZ9NMyc-c-/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-thermo-equilibre",
            titre: "Formulaire : Variables d'état & Gaz parfaits",
            sous: "Lois de Joule, capacités thermiques et équations d'état",
            url: "https://drive.google.com/file/d/1bua37-sdAoCzxTZlZeDTrIdZ9NMyc-c-/preview",
          },
        ],
        tds: [
          {
            id: "td-thermo-equilibre",
            titre: "TD 1 · Système Thermodynamique à l'Équilibre",
            sous: "Variables d'état, gaz parfait et mélanges",
            enonce: "https://drive.google.com/file/d/1Wwb0NvfHGoxcE0BPfHISgiUIx262nKwm/preview",
            correction: "https://drive.google.com/file/d/1JXlkZoYWiHEvtJ7BkhiTRl3bmgQX99Hb/preview",
            corriges: [
              {
                id: "corr-thermo-equilibre",
                titre: "Corrigé Détaillé : Système thermodynamique",
                url: "https://drive.google.com/file/d/1JXlkZoYWiHEvtJ7BkhiTRl3bmgQX99Hb/preview",
                type: "pdf",
              },
            ],
          },
        ],
      },
      {
        id: "thermo-sup-ch2",
        num: 2,
        niveau: "sup",
        titre: "Statique des fluides",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Thermodynamique Sup",
        description: "Loi fondamentale de la statique des fluides, poussée d'Archimède, atmosphère isotherme et polytropique.",
        cours: [
          {
            id: "sess-thermo-statique",
            titre: "Polycopié de Cours : Statique des Fluides",
            sous: "Support officiel Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1bua37-sdAoCzxTZlZeDTrIdZ9NMyc-c-/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-thermo-statique",
            titre: "Synthèse : Pression, Champ de pesanteur & Archimède",
            sous: "Bilans de forces sur un élément de fluide",
            url: "https://drive.google.com/file/d/1bua37-sdAoCzxTZlZeDTrIdZ9NMyc-c-/preview",
          },
        ],
        tds: [
          {
            id: "td-thermo-statique",
            titre: "TD 2 · Statique des Fluides",
            sous: "Loi fondamentale de l'hydrostatique et calculs de résultantes",
            enonce: "https://drive.google.com/file/d/1yM2mXAWW2UJy3SZeJpcKYvGlbHV6SJTQ/preview",
            correction: "https://drive.google.com/file/d/1MCdBZp_6BjxiBH6kOKwdXcO1VIKziZrm/preview",
            corriges: [
              {
                id: "corr-thermo-statique",
                titre: "Corrigé Détaillé : Statique des fluides",
                url: "https://drive.google.com/file/d/1MCdBZp_6BjxiBH6kOKwdXcO1VIKziZrm/preview",
                type: "pdf",
              },
            ],
          },
        ],
      },
      {
        id: "thermo-sup-ch3",
        num: 3,
        niveau: "sup",
        titre: "Premier principe de la thermodynamique",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Thermodynamique Sup",
        description: "Énergie interne U, enthalpie H, travail des forces de pression, transferts thermiques et bilans d'énergie.",
        cours: [
          {
            id: "sess-thermo-1er",
            titre: "Polycopié de Cours : Premier Principe",
            sous: "Support officiel Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1bua37-sdAoCzxTZlZeDTrIdZ9NMyc-c-/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-thermo-1er",
            titre: "Formulaire : Bilans du 1er Principe en Système Fermé",
            sous: "Transformations isochores, isobares, isothermes et adiabatiques",
            url: "https://drive.google.com/file/d/1bua37-sdAoCzxTZlZeDTrIdZ9NMyc-c-/preview",
          },
        ],
        tds: [
          {
            id: "td-thermo-1er",
            titre: "TD 3 · Premier Principe de la Thermodynamique",
            sous: "Transformations thermodynamiques, loi de Laplace et bilans",
            enonce: "https://drive.google.com/file/d/1WIPmbnh7VjcNL6loYL3iV74Fz7Rrt2zB/preview",
            correction: "https://drive.google.com/file/d/1Tb73ITXLgGEXhRmjPY26Z451I6vrWOAr/preview",
            corriges: [
              {
                id: "corr-thermo-1er",
                titre: "Corrigé Détaillé : Premier principe",
                url: "https://drive.google.com/file/d/1Tb73ITXLgGEXhRmjPY26Z451I6vrWOAr/preview",
                type: "pdf",
              },
            ],
          },
        ],
      },
      {
        id: "thermo-sup-ch4",
        num: 4,
        niveau: "sup",
        titre: "Second principe de la thermodynamique",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Thermodynamique Sup",
        description: "Entropie S, création d'entropie, échange d'entropie, irréversibilité et équilibre thermodynamique.",
        cours: [
          {
            id: "sess-thermo-2nd",
            titre: "Polycopié de Cours : Second Principe",
            sous: "Support officiel Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1bua37-sdAoCzxTZlZeDTrIdZ9NMyc-c-/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-thermo-2nd",
            titre: "Formulaire : Entropie & Bilans Entropiques",
            sous: "Différentielles dU, dH et identités thermodynamiques",
            url: "https://drive.google.com/file/d/1bua37-sdAoCzxTZlZeDTrIdZ9NMyc-c-/preview",
          },
        ],
        tds: [
          {
            id: "td-thermo-2nd",
            titre: "TD 4 · Second Principe de la Thermodynamique",
            sous: "Calculs d'entropie échangée et d'entropie créée sur des cycles",
            enonce: "https://drive.google.com/file/d/1Cf6iOMrsFTuchuW7kXpcKsSgrj6NXtEV/preview",
            correction: "https://drive.google.com/file/d/1AzRFM3w8tZF7VwX7sk62XtufNQvlrWu-/preview",
            corriges: [
              {
                id: "corr-thermo-2nd",
                titre: "Corrigé Détaillé : Second principe",
                url: "https://drive.google.com/file/d/1AzRFM3w8tZF7VwX7sk62XtufNQvlrWu-/preview",
                type: "pdf",
              },
            ],
          },
        ],
      },
      {
        id: "thermo-sup-ch5",
        num: 5,
        niveau: "sup",
        titre: "Machines thermiques",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Thermodynamique Sup",
        description: "Cycles dithermes et polythermes, théorème de Carnot, rendement moteur, efficacité frigorifique et pompe à chaleur.",
        cours: [
          {
            id: "sess-thermo-machines",
            titre: "Polycopié de Cours : Machines Thermiques",
            sous: "Support officiel Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1bua37-sdAoCzxTZlZeDTrIdZ9NMyc-c-/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-thermo-machines",
            titre: "Synthèse : Rendement et Éfficacités des Machines Thermiques",
            sous: "Diagrammes de Clapeyron (P,V) et d'Amagat",
            url: "https://drive.google.com/file/d/1bua37-sdAoCzxTZlZeDTrIdZ9NMyc-c-/preview",
          },
        ],
        tds: [
          {
            id: "td-thermo-machines",
            titre: "TD 5 · Machines Thermiques",
            sous: "Moteurs thermiques, réfrigérateurs, pompes à chaleur et cycle de Stirling",
            enonce: "https://drive.google.com/file/d/1z2vU1CzVpmT9VMda4sJFJv3WB18GA60O/preview",
            correction: "https://drive.google.com/file/d/1N8z0V68GxIhrQlpTGd0oII_mx_EwvRC_/preview",
            corriges: [
              {
                id: "corr-thermo-machines",
                titre: "Corrigé Détaillé : Machines thermiques",
                url: "https://drive.google.com/file/d/1N8z0V68GxIhrQlpTGd0oII_mx_EwvRC_/preview",
                type: "pdf",
              },
            ],
          },
        ],
      },
      {
        id: "thermo-sup-ch6",
        num: 6,
        niveau: "sup",
        titre: "Changement de phase d'un corps pur",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Thermodynamique Sup",
        description: "Équilibres liquide-vapeur, solide-liquide, diagrammes (P,T) et (P,v), formule de Clapeyron et enthalpie de transition.",
        cours: [
          {
            id: "sess-thermo-phase",
            titre: "Polycopié de Cours : Changement de Phase",
            sous: "Support officiel Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1bua37-sdAoCzxTZlZeDTrIdZ9NMyc-c-/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-thermo-phase",
            titre: "Formulaire : Changements d'état & Clapeyron",
            sous: "Courbe de saturation et titre massique en vapeur",
            url: "https://drive.google.com/file/d/1bua37-sdAoCzxTZlZeDTrIdZ9NMyc-c-/preview",
          },
        ],
        tds: [
          {
            id: "td-thermo-phase",
            titre: "TD 6 · Changement de Phase d'un Corps Pur",
            sous: "Ébullition, vaporisation, théorème des moments et calculs d'entropie",
            enonce: "https://drive.google.com/file/d/19EwT7Iwvjq4fn5h0ReXWJLcQmB_PsywF/preview",
            correction: "https://drive.google.com/file/d/1G5sqqfWXjsWPSTmr-uNfDxdFdaQV3ajQ/preview",
            corriges: [
              {
                id: "corr-thermo-phase",
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

  // ── 1.3 MÉCANIQUE DU POINT MATÉRIEL (SUP) ──
  {
    id: "meca-sup",
    niveau: "sup",
    titre: "Mécanique du Point Matériel",
    icon: "🎯",
    description: "Cinématique en coordonnées cartésiennes, cylindriques et sphériques, dynamique newtonienne, théorèmes énergétiques, moment cinétique et forces centrales.",
    chapitres: [
      {
        id: "meca-sup-ch1",
        num: 1,
        niveau: "sup",
        titre: "Cinématique du point matériel",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Mécanique Sup",
        description: "Vecteur position, vitesse, accélération, repères cartésien, polaire, cylindrique et repère de Frenet.",
        cours: [
          {
            id: "sess-meca-poly",
            titre: "Polycopié de Cours Complet : Mécanique Sup",
            sous: "Support rédigé officiel par Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1zYe4Rhy3vnx8af57zkroLgGflWFCn0L4/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-meca-cinematique",
            titre: "Formulaire : Systèmes de Coordonnées & Dérivées Vectorielles",
            sous: "Composantes de la vitesse et de l'accélération dans tous les repères",
            url: "https://drive.google.com/file/d/1zYe4Rhy3vnx8af57zkroLgGflWFCn0L4/preview",
          },
        ],
        tds: [
          {
            id: "td-meca-cinematique",
            titre: "TD 1 · Cinématique du Point Matériel",
            sous: "Trajectoires, coordonnées polaires et base de Frenet",
            enonce: "https://drive.google.com/file/d/1z6j35LrvGJSFjyhzFwvD-cGExgUKtSX7/preview",
          },
        ],
      },
      {
        id: "meca-sup-ch2",
        num: 2,
        niveau: "sup",
        titre: "Dynamique du point matériel & Lois de Newton",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Mécanique Sup",
        description: "Principe fondamental de la dynamique (PFD), frottements solides (Coulomb) et fluides, pendule simple.",
        cours: [
          {
            id: "sess-meca-dynamique",
            titre: "Polycopié de Cours : Dynamique du Point",
            sous: "Support officiel Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1zYe4Rhy3vnx8af57zkroLgGflWFCn0L4/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-meca-dynamique",
            titre: "Mémento PFD & Frottements de Coulomb",
            sous: "Conditions de glissement et d'adhérence",
            url: "https://drive.google.com/file/d/1zYe4Rhy3vnx8af57zkroLgGflWFCn0L4/preview",
          },
        ],
        tds: [
          {
            id: "td-meca-dynamique",
            titre: "TD 2 · Dynamique du Point Matériel",
            sous: "Lois de Newton, frottement fluide et équations du mouvement",
            enonce: "https://drive.google.com/file/d/1awu2xV3NtP9V7kAVsxNrZmBwpQ1D0P7O/preview",
          },
        ],
      },
      {
        id: "meca-sup-ch3",
        num: 3,
        niveau: "sup",
        titre: "Aspect énergétique de la dynamique du point matériel",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Mécanique Sup",
        description: "Énergie cinétique, travail d'une force, forces conservatives et énergie potentielle, conservation de l'énergie mécanique.",
        cours: [
          {
            id: "sess-meca-energie",
            titre: "Polycopié de Cours : Théorèmes Énergétiques",
            sous: "Support officiel Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1zYe4Rhy3vnx8af57zkroLgGflWFCn0L4/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-meca-energie",
            titre: "Formulaire : Théorème de l'Énergie Cinétique & Mécanique",
            sous: "Courbes d'énergie potentielle et positions d'équilibre stable/instable",
            url: "https://drive.google.com/file/d/1zYe4Rhy3vnx8af57zkroLgGflWFCn0L4/preview",
          },
        ],
        tds: [
          {
            id: "td-meca-energie",
            titre: "TD 3 · Aspect Énergétique de la Dynamique",
            sous: "Calculs de travaux, intégrales premières de l'énergie et petits mouvements",
            enonce: "https://drive.google.com/file/d/16V7hrpr3n7yRmvzc8wI9lD7UKF9hh1Ft/preview",
          },
        ],
      },
      {
        id: "meca-sup-ch4",
        num: 4,
        niveau: "sup",
        titre: "Théorème du moment cinétique",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Mécanique Sup",
        description: "Moment d'une force par rapport à un point et à un axe, théorème du moment cinétique pour un point matériel.",
        cours: [
          {
            id: "sess-meca-moment",
            titre: "Polycopié de Cours : Moment Cinétique",
            sous: "Support officiel Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1zYe4Rhy3vnx8af57zkroLgGflWFCn0L4/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-meca-moment",
            titre: "Synthèse : Moment d'une force & Théorème du Moment Cinétique",
            sous: "Conservation du moment cinétique et applications",
            url: "https://drive.google.com/file/d/1zYe4Rhy3vnx8af57zkroLgGflWFCn0L4/preview",
          },
        ],
        tds: [
          {
            id: "td-meca-moment",
            titre: "TD 4 · Théorème du Moment Cinétique",
            sous: "Mouvements plans, pendules et applications du TMC",
            enonce: "https://drive.google.com/file/d/1yxB_dYYZJu9RnCfVRWALIbAvG4JRFB3C/preview",
          },
        ],
      },
      {
        id: "meca-sup-ch5",
        num: 5,
        niveau: "sup",
        titre: "Mouvement dans un champ de forces centrales",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Mécanique Sup",
        description: "Conservation du moment cinétique, constante des aires, potentiel effectif, mouvement newtonien et lois de Kepler.",
        cours: [
          {
            id: "sess-meca-centrales",
            titre: "Polycopié de Cours : Forces Centrales Conservatrices",
            sous: "Support officiel Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1zYe4Rhy3vnx8af57zkroLgGflWFCn0L4/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-meca-centrales",
            titre: "Formulaire : Formules de Binet & Lois de Kepler",
            sous: "Trajectoires elliptiques, hyperboliques et paraboles",
            url: "https://drive.google.com/file/d/1zYe4Rhy3vnx8af57zkroLgGflWFCn0L4/preview",
          },
        ],
        tds: [
          {
            id: "td-meca-centrales",
            titre: "TD 5 · Mouvement dans un Champ de Forces Centrales",
            sous: "Loi de gravitation, satellites et orbites de transfert de Hohmann",
            enonce: "https://drive.google.com/file/d/1yOL0NVR3J_317ROACaQlqK3YR3ZY3PWj/preview",
          },
        ],
      },
      {
        id: "meca-sup-ch6",
        num: 6,
        niveau: "sup",
        titre: "Changement de référentiel & Forces d'inertie",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Mécanique Sup",
        description: "Lois de composition des vitesses et accélérations, accélération d'entraînement et de Coriolis, PFD en référentiel non galiléen.",
        cours: [
          {
            id: "sess-meca-ref",
            titre: "Polycopié de Cours : Référentiels Non Galiléens",
            sous: "Support officiel Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1zYe4Rhy3vnx8af57zkroLgGflWFCn0L4/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-meca-ref",
            titre: "Synthèse : Force d'Inertie d'Entraînement & de Coriolis",
            sous: "Pesanteur apparente et déviation vers l'Est",
            url: "https://drive.google.com/file/d/1zYe4Rhy3vnx8af57zkroLgGflWFCn0L4/preview",
          },
        ],
        tds: [
          {
            id: "td-meca-ref",
            titre: "TD 6 · Changement de Référentiel",
            sous: "Forces d'inertie en translation et rotation, équilibre relatif",
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

  // ── 1.4 OPTIQUE GÉOMÉTRIQUE (SUP) ──
  {
    id: "optique-sup",
    niveau: "sup",
    titre: "Optique Géométrique",
    icon: "🔬",
    description: "Lois de Snell-Descartes, réflexion totale, miroirs plans, approximation de Gauss, lentilles minces convergentes et divergentes, instruments d'optique.",
    chapitres: [
      {
        id: "optique-sup-ch1",
        num: 1,
        niveau: "sup",
        titre: "Les lois de l'optique géométrique & Réfraction",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Optique Sup",
        description: "Indice de réfraction, principe de Fermat, lois de Snell-Descartes et phénomène de réflexion totale.",
        cours: [
          {
            id: "sess-optique-poly",
            titre: "Polycopié de Cours Complet : Optique Géométrique",
            sous: "Support rédigé officiel par Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1osVzESQuM2FeoF-gDTZova3nPuBdF0u3/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-optique-lois",
            titre: "Mémento : Lois de Descartes & Fibre Optique",
            sous: "Angle limite, réflexion totale et prisme",
            url: "https://drive.google.com/file/d/1osVzESQuM2FeoF-gDTZova3nPuBdF0u3/preview",
          },
        ],
        tds: [
          {
            id: "td-optique-lois",
            titre: "TD 1 · Lois de l'Optique Géométrique",
            sous: "Réfraction, réflexion totale, prisme et fibres à saut d'indice",
            enonce: "https://drive.google.com/file/d/11Ax0w7Eh5ZtHNl2DCKJEqnZUXve4qR9g/preview",
          },
        ],
      },
      {
        id: "optique-sup-ch2",
        num: 2,
        niveau: "sup",
        titre: "Formation des images & Instruments d'optique",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Optique Sup",
        description: "Conditions de Gauss, stigmatisme, formules de conjugaison de Descartes et Newton, loupe, microscope et lunette astronomique.",
        cours: [
          {
            id: "sess-optique-instruments",
            titre: "Polycopié de Cours : Lentilles & Instruments",
            sous: "Support officiel Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1osVzESQuM2FeoF-gDTZova3nPuBdF0u3/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-optique-lentilles",
            titre: "Formulaire : Relations de Conjugaison & Grossissement",
            sous: "Constructions géométriques et accommodation de l'œil",
            url: "https://drive.google.com/file/d/1osVzESQuM2FeoF-gDTZova3nPuBdF0u3/preview",
          },
        ],
        tds: [
          {
            id: "td-optique-instruments",
            titre: "TD 2 · Images & Instruments d'Optique",
            sous: "Associations de lentilles minces, lunette afocale et pouvoir séparateur",
            enonce: "https://drive.google.com/file/d/1XNI_L3JI3GIAXbG82uFpfmM86LIoJS-c/preview",
          },
        ],
      },
    ],
  },

  // ── 1.5 ÉLECTROMAGNÉTISME SUP (SUP) ──
  {
    id: "em-sup",
    niveau: "sup",
    titre: "Électromagnétisme Sup",
    icon: "🧲",
    description: "Électrostatique, champ et potentiel créés par des distributions de charges, théorème de Gauss, dipôle électrostatique et magnétostatique élémentaire.",
    chapitres: [
      {
        id: "em-sup-ch1",
        num: 1,
        niveau: "sup",
        titre: "Électrostatique - Champ & Potentiel",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Électromagnétisme Sup",
        description: "Loi de Coulomb, symétries et invariances, théorème de Gauss sous forme intégrale et locale, équation de Poisson.",
        cours: [
          {
            id: "sess-em-sup-poly",
            titre: "Polycopié de Cours Complet : Électromagnétisme Sup",
            sous: "Support rédigé officiel par Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1cCXZC130ZRRkysF5U0bLjBEcwHImVRRp/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-em-sup-gauss",
            titre: "Méthode : Théorème de Gauss & Calculs de Champ",
            sous: "Plans de symétrie, d'antisymétrie et surfaces fermées de Gauss",
            url: "https://drive.google.com/file/d/1cCXZC130ZRRkysF5U0bLjBEcwHImVRRp/preview",
          },
        ],
        tds: [
          {
            id: "td-em-sup-electrostatique",
            titre: "TD 1 · Électrostatique",
            sous: "Distributions de charges sphériques, cylindriques et planes, calcul du potentiel",
            enonce: "https://drive.google.com/file/d/1TyN8Nyfi_5V3haPG95gIJ39TGKO4AqsV/preview",
            correction: "https://drive.google.com/file/d/1Sf0OyjR2yPrn6MVmEOEJnR23tsT3u66c/preview",
            corriges: [
              {
                id: "corr-em-sup-electrostatique",
                titre: "Corrigé Détaillé : Électrostatique",
                url: "https://drive.google.com/file/d/1Sf0OyjR2yPrn6MVmEOEJnR23tsT3u66c/preview",
                type: "pdf",
              },
            ],
          },
        ],
      },
      {
        id: "em-sup-ch2",
        num: 2,
        niveau: "sup",
        titre: "Magnétostatique - Champ Créé par les Courants",
        badge: "Sup MPSI/PCSI/TSI",
        moduleName: "Électromagnétisme Sup",
        description: "Courant électrique, loi de Biot-Savart, théorème d'Ampère, solénoïde et bobines de Helmholtz.",
        cours: [
          {
            id: "sess-em-sup-magneto",
            titre: "Polycopié de Cours : Magnétostatique",
            sous: "Support officiel Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1cCXZC130ZRRkysF5U0bLjBEcwHImVRRp/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-em-sup-ampere",
            titre: "Méthode : Théorème d'Ampère & Lignes de Champ",
            sous: "Invariances, contours d'Ampère et symétries magnétiques",
            url: "https://drive.google.com/file/d/1cCXZC130ZRRkysF5U0bLjBEcwHImVRRp/preview",
          },
        ],
        tds: [
          {
            id: "td-em-sup-magnetostatique",
            titre: "TD 2 · Magnétostatique",
            sous: "Loi de Biot et Savart, fil infini, spire circulaire et théorème d'Ampère",
            enonce: "https://drive.google.com/file/d/1MPhYLRuchVRW7DpdK6RR9NoPAZvrm4gi/preview",
            correction: "https://drive.google.com/file/d/1E8g6asTIpylOuz6QhgxUDRp_kB5js0L4/preview",
            corriges: [
              {
                id: "corr-em-sup-magnetostatique",
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
];

// =========================================================================
// 2. PÔLE 2ème ANNÉE : SPÉ (MP / PSI / TSI)
// =========================================================================
export const PC_COURSES_DATA_SPE: ModuleCoursBlock[] = [
  // ── 2.1 ÉLECTRONIQUE SPÉ (MP) ──
  {
    id: "elec-spe",
    niveau: "spe",
    titre: "Électronique Spé & Traitement Numérique",
    icon: "⚡",
    description: "Analyse spectrale avancée, filtrage analogique des signaux périodiques, électronique numérique CAN/CNA et modulation d'amplitude.",
    chapitres: [
      {
        id: "elec-spe-ch1",
        num: 1,
        niveau: "spe",
        titre: "Analyse Spectrale & Filtrage Linéaire Harmonique",
        badge: "Spé MP / PSI / TSI",
        moduleName: "Électronique Spé",
        description: "Décomposition de Fourier, spectre d'un signal non sinusoïdal, effet d'un filtre et distorsion.",
        cours: [
          {
            id: "sess-elec-spe-1",
            titre: "Séance 1 : Analyse spectrale",
            sous: "Replay vidéo : Décomposition en séries de Fourier & Spectre d'un signal périodique",
            video: "https://youtu.be/hY2cU-RNsSc",
            support: "https://drive.google.com/file/d/1WfX9-CoNGUvIQ1BCAH-YRBjwrSqvxTyN/preview",
          },
          {
            id: "sess-elec-spe-2",
            titre: "Séance 2 : Effet d'un filtre sur un signal non sinusoïdal",
            sous: "Replay vidéo : Filtrage harmonique, gain en dB et distorsion",
            video: "https://youtu.be/eMNgqbLxWEw",
            support: "https://drive.google.com/file/d/1WfX9-CoNGUvIQ1BCAH-YRBjwrSqvxTyN/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-elec-spe-poly",
            titre: "Polycopié Officiel : Électronique Spé MP / PSI / TSI",
            sous: "Cours complet rédigé par Pr. Hassan EDDAMS",
            url: "https://drive.google.com/file/d/1WfX9-CoNGUvIQ1BCAH-YRBjwrSqvxTyN/preview",
          },
        ],
        tds: [],
      },
      {
        id: "elec-spe-ch2",
        num: 2,
        niveau: "spe",
        titre: "Électronique Numérique, CAN/CNA & Modulation",
        badge: "Spé MP / PSI / TSI",
        moduleName: "Électronique Spé",
        description: "Échantillonnage, théorème de Shannon, quantification, modulation et démodulation d'amplitude (AM).",
        cours: [
          {
            id: "sess-elec-spe-3",
            titre: "Séance 3 : Électronique numérique (CAN / CNA)",
            sous: "Replay vidéo : Échantillonnage, Shannon et convertisseurs",
            video: "https://youtu.be/0bXfitifdIQ",
            support: "https://drive.google.com/file/d/1WfX9-CoNGUvIQ1BCAH-YRBjwrSqvxTyN/preview",
          },
          {
            id: "sess-elec-spe-4",
            titre: "Séance 4 : Modulation et démodulation d'amplitude",
            sous: "Replay vidéo : Spectre d'un signal modulé et détection d'enveloppe",
            video: "https://youtu.be/gNlMZUam4Qk",
            support: "https://drive.google.com/file/d/1WfX9-CoNGUvIQ1BCAH-YRBjwrSqvxTyN/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-elec-spe-num",
            titre: "Synthèse : Numérisation & Modulation AM",
            sous: "Résolution CAN, rapport signal sur bruit et spectre AM",
            url: "https://drive.google.com/file/d/1WfX9-CoNGUvIQ1BCAH-YRBjwrSqvxTyN/preview",
          },
        ],
        tds: [],
      },
    ],
  },

  // ── 2.2 ÉLECTROMAGNÉTISME & ÉQUATIONS DE MAXWELL (SPÉ) ──
  {
    id: "em-spe",
    niveau: "spe",
    titre: "Électromagnétisme & Équations de Maxwell",
    icon: "🧲",
    description: "Opérateurs différentiels (grad, div, rot, laplacien), conservation de la charge, loi d'Ohm locale, équations de Maxwell, vecteur de Poynting et induction.",
    chapitres: [
      {
        id: "em-spe-ch1",
        num: 1,
        niveau: "spe",
        titre: "Opérateurs Vectoriels, Loi d'Ohm & Conservation de la Charge",
        badge: "Cœur Spé MP",
        moduleName: "Électromagnétisme Spé",
        description: "Gradient, divergence, rotationnel, courant de déplacement, conservation de la charge et conduction locale.",
        cours: [
          {
            id: "sess-em-spe-op",
            titre: "Séance 1 : Opérateurs vectoriels",
            sous: "Replay vidéo : Analyse vectorielle appliquée à l'électromagnétisme",
            video: "https://youtu.be/dmTOvubS8YI",
            support: "https://drive.google.com/file/d/1Cps5Q9bXojoRF-Px2rLMQtqunXz9pd7H/preview",
          },
          {
            id: "sess-em-spe-charge",
            titre: "Séance 2 : Conservation de la charge",
            sous: "Replay vidéo : Équation de continuité locale et intégrale",
            video: "https://youtu.be/leS6MU_6Ryw",
            support: "https://drive.google.com/file/d/1Cps5Q9bXojoRF-Px2rLMQtqunXz9pd7H/preview",
          },
          {
            id: "sess-em-spe-ohm",
            titre: "Séance 3 : Loi d'Ohm locale et intégrale",
            sous: "Replay vidéo : Modèle de Drude, conductivité et résistance",
            video: "https://youtu.be/pLLrpWyzTDU",
            support: "https://drive.google.com/file/d/1Cps5Q9bXojoRF-Px2rLMQtqunXz9pd7H/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-em-spe-poly",
            titre: "Polycopié Officiel : Électromagnétisme Spé MP / PSI / TSI",
            sous: "Cours complet de 2ème année rédigé par Pr. Hassan EDDAMS",
            url: "https://drive.google.com/file/d/1Cps5Q9bXojoRF-Px2rLMQtqunXz9pd7H/preview",
          },
        ],
        tds: [],
      },
      {
        id: "em-spe-ch2",
        num: 2,
        niveau: "spe",
        titre: "Équations de Maxwell & Énergie Électromagnétique",
        badge: "Cœur Spé MP",
        moduleName: "Électromagnétisme Spé",
        description: "Maxwell-Gauss, Maxwell-Thomson, Maxwell-Faraday, Maxwell-Ampère, vecteur de Poynting et bilans énergétiques.",
        cours: [
          {
            id: "sess-em-spe-maxwell",
            titre: "Polycopié de Cours : Équations de Maxwell",
            sous: "Support officiel Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1Cps5Q9bXojoRF-Px2rLMQtqunXz9pd7H/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-em-spe-maxwell",
            titre: "Formulaire : Équations de Maxwell & Théorème de Poynting",
            sous: "Densité volumique d'énergie et vecteur de Poynting",
            url: "https://drive.google.com/file/d/1Cps5Q9bXojoRF-Px2rLMQtqunXz9pd7H/preview",
          },
        ],
        tds: [],
      },
    ],
  },

  // ── 2.3 OPTIQUE ONDULATOIRE (SPÉ) ──
  {
    id: "optique-spe",
    niveau: "spe",
    titre: "Optique Ondulatoire (Spé MP / PSI / TSI)",
    icon: "🌈",
    description: "Modèle scalaire des ondes lumineuses, cohérence spatiale et temporelle, interférences à deux ondes, division du front d'onde et interféromètre de Michelson.",
    chapitres: [
      {
        id: "optique-spe-ch1",
        num: 1,
        niveau: "spe",
        titre: "Interférences Lumineuses & Interféromètre de Michelson",
        badge: "Spé MP / PSI / TSI",
        moduleName: "Optique Ondulatoire Spé",
        description: "Formule de Fresnel, contraste, franges d'égale inclinaison et d'égale épaisseur au Michelson.",
        cours: [
          {
            id: "sess-optique-spe-poly",
            titre: "Polycopié de Cours Complet : Optique Ondulatoire Spé",
            sous: "Support officiel rédigé par Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/14GnKieXWwiJ9BQowxkx1s36RQtCIGCNt/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-optique-spe",
            titre: "Formulaire : Michelson (Lame d'air & Coin d'air)",
            sous: "Ordre d'interférence, contraste et localisation des franges",
            url: "https://drive.google.com/file/d/14GnKieXWwiJ9BQowxkx1s36RQtCIGCNt/preview",
          },
        ],
        tds: [],
      },
    ],
  },

  // ── 2.4 THERMODYNAMIQUE SPÉ & TRANSFERTS THERMIQUES (SPÉ) ──
  {
    id: "thermo-spe",
    niveau: "spe",
    titre: "Thermodynamique Spé & Transferts Thermiques",
    icon: "♨️",
    description: "Conduction thermique, loi de Fourier, équation de diffusion de la chaleur, bilans en régime stationnaire et instationnaire, rayonnement thermique.",
    chapitres: [
      {
        id: "thermo-spe-ch1",
        num: 1,
        niveau: "spe",
        titre: "Diffusion Thermique & Conduction de la Chaleur",
        badge: "Spé MP / PSI / TSI",
        moduleName: "Thermodynamique Spé",
        description: "Vecteur densité de courant thermique, loi de Fourier, équation de la chaleur en géométries cartésienne et cylindrique.",
        cours: [
          {
            id: "sess-thermo-spe-poly",
            titre: "Polycopié de Cours Complet : Thermodynamique Spé",
            sous: "Support rédigé officiel par Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1i-njaWdT6HN9uRRMXsfSHgz0vu21n_Pa/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-thermo-spe",
            titre: "Formulaire : Loi de Fourier & Résistance Thermique",
            sous: "Profils de température et temps de diffusion",
            url: "https://drive.google.com/file/d/1i-njaWdT6HN9uRRMXsfSHgz0vu21n_Pa/preview",
          },
        ],
        tds: [],
      },
    ],
  },

  // ── 2.5 PHYSIQUE DES ONDES (SPÉ) ──
  {
    id: "ondes-spe",
    niveau: "spe",
    titre: "Physique des Ondes (Spé MP / PSI / TSI)",
    icon: "🌊",
    description: "Équation de d'Alembert, ondes sonores dans les fluides, impédance acoustique, dispersion, absorption et réflexion/transmission sous incidence normale.",
    chapitres: [
      {
        id: "ondes-spe-ch1",
        num: 1,
        niveau: "spe",
        titre: "Propagation des Ondes Mécaniques & Sonores",
        badge: "Spé MP / PSI / TSI",
        moduleName: "Physique des Ondes Spé",
        description: "Vitesse du son, ondes planes progressives harmoniques (OPPH), ondes stationnaires et coefficients de réflexion.",
        cours: [
          {
            id: "sess-ondes-spe-poly",
            titre: "Polycopié de Cours Complet : Physique des Ondes Spé",
            sous: "Support rédigé officiel par Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1R5MSxKUKLu7DihUyi85FbYeOUjgAsOmY/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-ondes-spe",
            titre: "Synthèse : Ondes Sonores, D'Alembert & Impédance",
            sous: "Vecteur vitesse acoustique, surpression et intensité sonore",
            url: "https://drive.google.com/file/d/1R5MSxKUKLu7DihUyi85FbYeOUjgAsOmY/preview",
          },
        ],
        tds: [],
      },
    ],
  },

  // ── 2.6 PHYSIQUE QUANTIQUE (SPÉ) ──
  {
    id: "quantique-spe",
    niveau: "spe",
    titre: "Physique Quantique (Spé MP / PC)",
    icon: "⚛️",
    description: "Dualité onde-corpuscule, relations de de Broglie et Planck-Einstein, paquet d'ondes, fonction d'onde, équation de Schrödinger à 1D, puits de potentiel et effet tunnel.",
    chapitres: [
      {
        id: "quantique-spe-ch1",
        num: 1,
        niveau: "spe",
        titre: "Dualité Onde-Corpuscule & Équation de Schrödinger",
        badge: "Spé MP / PC",
        moduleName: "Physique Quantique Spé",
        description: "Inégalités d'Heisenberg, probabilité de présence, états stationnaires et quantification de l'énergie.",
        cours: [
          {
            id: "sess-quantique-spe-poly",
            titre: "Polycopié de Cours Complet : Physique Quantique Spé",
            sous: "Support rédigé officiel par Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/16vt_GRsFEgrQzpRnOZIeyuD5uBdHuU2G/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-quantique-spe",
            titre: "Formulaire : Équation de Schrödinger & Puits Infini",
            sous: "Niveaux d'énergie, densité de probabilité et effet tunnel",
            url: "https://drive.google.com/file/d/16vt_GRsFEgrQzpRnOZIeyuD5uBdHuU2G/preview",
          },
        ],
        tds: [],
      },
    ],
  },

  // ── 2.7 MÉCANIQUE DES FLUIDES SPÉ (NAVİER-STOKES & BILANS) ──
  {
    id: "fluides-spe",
    niveau: "spe",
    titre: "Mécanique des Fluides Spé & Dynamique (Navier-Stokes)",
    icon: "🌊",
    description: "Écoulements parfaits et visqueux newtoniens, équations de Navier-Stokes, écoulements de Poiseuille et Couette, analyse dimensionnelle, bilans de quantité de mouvement et pertes de charge (Cœur PSI / PC).",
    chapitres: [
      {
        id: "fluides-spe-ch1",
        num: 1,
        niveau: "spe",
        titre: "Dynamique des Fluides Incompressibles & Navier-Stokes",
        badge: "Cœur PSI / PC",
        moduleName: "Mécanique des Fluides Spé",
        description: "Dérivée particulaire, viscosité dynamique, équation de Navier-Stokes, écoulements unidirectionnels de Poiseuille et bilans de forces.",
        cours: [
          {
            id: "sess-fluides-spe-poly",
            titre: "Polycopié de Cours : Mécanique des Fluides Spé (PSI / PC)",
            sous: "Support officiel de référence CPGE · Pr. Hassan EDDAMS",
            support: "https://drive.google.com/file/d/1NPZxjL3QCNWkQtUfyeoOVhfB7nXqk4Sx/preview",
          },
        ],
        fiches: [
          {
            id: "fiche-fluides-spe",
            titre: "Formulaire : Navier-Stokes, Nombre de Reynolds & Profils de Vitesse",
            sous: "Formulaire de synthèse pour concours écrits et oraux",
            url: "https://drive.google.com/file/d/1NPZxjL3QCNWkQtUfyeoOVhfB7nXqk4Sx/preview",
          },
        ],
        tds: [
          {
            id: "td-fluides-spe-poiseuille",
            titre: "TD · Écoulements Visqueux & Équation de Navier-Stokes",
            sous: "Écoulement plan de Poiseuille, profil parabolique et débit volumique",
            enonce: "https://drive.google.com/file/d/1NPZxjL3QCNWkQtUfyeoOVhfB7nXqk4Sx/preview",
          },
        ],
      },
    ],
  },
];

// =========================================================================
// ENSEMBLE COMPLET DES COURS PC (RÉTROCOMPATIBILITÉ & STORE UNIFIÉ)
// =========================================================================
export const PC_COURSES_DATA: ModuleCoursBlock[] = [
  ...PC_COURSES_DATA_SUP,
  ...PC_COURSES_DATA_SPE,
];
