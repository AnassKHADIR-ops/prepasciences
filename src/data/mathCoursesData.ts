export interface MathCourseItem {
  id: string;
  titre: string;
  cat: "algebre" | "analyse" | "geometrie" | "probabilites";
  desc: string;
  coursCount: number;
  tdsCount: number;
  badge?: string;
  hasResources: boolean;
}

/**
 * Chapitres RÉELS synchronisés avec la plateforme de Mathématiques de Pr. Anas Khadir (quiz.anasskhadir.com)
 * Règle de détection stricte : uniquement les chapitres effectivement traités
 * et disposant de ressources effectives (supports de cours, fiches, énoncés de TD ou vidéos).
 */
export const MATH_COURSES_DATA: MathCourseItem[] = [
  {
    id: "m-alglin",
    titre: "Algèbre linéaire",
    cat: "algebre",
    desc: "Espaces vectoriels, applications linéaires, matrices, rang, sous-espaces stables et projecteurs.",
    coursCount: 1, // 1 fiche de cours synthétique
    tdsCount: 9,   // 9 exercices et problèmes d'entraînement
    badge: "Fondamental MP",
    hasResources: true,
  },
  {
    id: "m-revanalyse",
    titre: "Révision d'analyse",
    cat: "analyse",
    desc: "Suites réelles, limites, continuité, dérivabilité, formules de Taylor et développements limités.",
    coursCount: 3, // 3 séances de cours / méthodologie
    tdsCount: 1,   // 1 entraînement guidé
    badge: "Analyse Sup/Spé",
    hasResources: true,
  },
  {
    id: "m-det",
    titre: "Calcul des déterminants",
    cat: "algebre",
    desc: "Formes multilinéaires alternées, déterminants d'endomorphismes et de matrices, calculs par blocs et comatrices.",
    coursCount: 1, // 1 séance support
    tdsCount: 1,   // 1 exercice approfondi
    badge: "Algèbre MP",
    hasResources: true,
  },
  {
    id: "m-suites-series",
    titre: "Suites & séries numériques",
    cat: "analyse",
    desc: "Convergence, séries à termes positifs, critères de comparaison, règle d'Abel et séries alternées.",
    coursCount: 1, // 1 séance support
    tdsCount: 5,   // 5 exercices d'entraînement
    badge: "Analyse MP/TSI",
    hasResources: true,
  },
  {
    id: "m-integration",
    titre: "Intégration sur un segment & Généralisées",
    cat: "analyse",
    desc: "Intégrale de Riemann, convergence des intégrales impropres, critères de comparaison et intégrales de référence.",
    coursCount: 3, // 2 séances + 1 fiche
    tdsCount: 8,   // 8 exercices et problèmes
    badge: "Majeur Concours",
    hasResources: true,
  },
  {
    id: "m-proba",
    titre: "Probabilités",
    cat: "probabilites",
    desc: "Espaces probabilisés, probabilités conditionnelles, variables aléatoires discrètes et lois usuelles.",
    coursCount: 0,
    tdsCount: 5,   // 5 exercices d'entraînement
    badge: "Probabilités MP",
    hasResources: true,
  },
  {
    id: "m-euclidiens",
    titre: "Espaces Euclidiens",
    cat: "geometrie",
    desc: "Produit scalaire, orthogonalité, procédé de Gram-Schmidt, projecteurs orthogonaux et isométries vectorielles.",
    coursCount: 5, // 4 séances + 1 fiche
    tdsCount: 6,   // 6 exercices approfondis
    badge: "Géométrie MP/TSI",
    hasResources: true,
  },
  {
    id: "m-polynomes",
    titre: "Polynômes & fractions rationnelles",
    cat: "algebre",
    desc: "Arithmétique des polynômes, racines et multiplicité, factorisation dans R et C, décomposition en éléments simples.",
    coursCount: 0,
    tdsCount: 4,   // 4 exercices types
    badge: "Algèbre MP",
    hasResources: true,
  },
  {
    id: "m-calcul-mat",
    titre: "Calcul matriciel",
    cat: "algebre",
    desc: "Opérations sur les matrices, inversion par pivot de Gauss, puissances de matrices et systèmes linéaires.",
    coursCount: 0,
    tdsCount: 7,   // 7 exercices d'application directe
    badge: "Algèbre & Méthodes",
    hasResources: true,
  },
];

// Fonction d'extraction dynamique des cours de maths actifs ayant des ressources réelles
export function getActiveMathCourses(): MathCourseItem[] {
  return MATH_COURSES_DATA.filter(
    (c) => c.hasResources && (c.coursCount > 0 || c.tdsCount > 0)
  );
}
