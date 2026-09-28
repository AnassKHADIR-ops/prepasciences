export interface ReferenceDoc {
  id: string;
  titre: string;
  category: "Programme" | "Formulaire" | "Méthodologie" | "Rapports";
  icon: string;
  description: string;
  pdfUrl: string;
  badge: string;
}

export const PC_REFERENCES_DATA: ReferenceDoc[] = [
  {
    id: "ref-bo",
    titre: "Programme Officiel CPGE MP / MP* — Physique-Chimie (BO)",
    category: "Programme",
    icon: "📜",
    description: "Bulletin Officiel complet : compétences exigibles, capacités mathématiques requises et liste des travaux pratiques obligatoires.",
    pdfUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
    badge: "Officiel MEN",
  },
  {
    id: "ref-constantes",
    titre: "Formulaire Universel des Constantes Physiques & Unités SI",
    category: "Formulaire",
    icon: "📐",
    description: "Constantes fondamentales indispensables : c, h, ℏ, e, ε₀, μ₀, R, k_B, constante de gravitation G, permittivités et valeurs numériques usuelles.",
    pdfUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
    badge: "Mémento Indispensable",
  },
  {
    id: "ref-redaction",
    titre: "Guide de Rédaction & Réflexes pour les Concours CPGE",
    category: "Méthodologie",
    icon: "✒️",
    description: "Comment structurer sa copie de concours, justifier les approximations, soigner les analyses dimensionnelles et les applications numériques.",
    pdfUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
    badge: "Méthode Khârré / 5/2",
  },
  {
    id: "ref-rapports",
    titre: "Synthèse des Rapports de Jurys (CNC, Mines-Ponts, CCINP)",
    category: "Rapports",
    icon: "⚖️",
    description: "Analyse critique des erreurs les plus fréquentes des candidats, pièges récurrents et conseils des examinateurs pour maximiser sa note.",
    pdfUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
    badge: "Conseils des Jurys",
  },
];
