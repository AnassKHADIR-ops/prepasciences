export interface BadgeItem {
  label: string;
  href: string;
}

export interface PoleData {
  id: "maths" | "pc";
  title: string;
  shortTitle: string;
  badge: string;
  accentColor: "cyan" | "purple";
  programmes: {
    title: string;
    href: string;
    subtitle: string;
  };
  filiereBadges: BadgeItem[];
  annales: {
    title: string;
    href: string;
    subtitle: string;
  };
  pedagogie: {
    title: string;
    href: string;
    subtitle: string;
  };
  professor: {
    name: string;
    title: string;
    center: string;
    photoUrl: string;
    profileHref: string;
    whatsAppUrl: string;
  };
}

export const POLES_DATA: Record<"maths" | "pc", PoleData> = {
  maths: {
    id: "maths",
    title: "Pôle Mathématiques",
    shortTitle: "Mathématiques",
    badge: "MP/MP* & TSI",
    accentColor: "cyan",
    programmes: {
      title: "Programmes Officiels",
      href: "https://anasskhadir.com/programmes-maroc/",
      subtitle: "Syllabus officiel MP/MP* & TSI",
    },
    filiereBadges: [
      { label: "MP / MP*", href: "https://anasskhadir.com/programmes-maroc/" },
      { label: "TSI 2e", href: "https://anasskhadir.com/programmes-maroc/" },
    ],
    annales: {
      title: "Annales CNC & Concours Français",
      href: "https://anasskhadir.com/concours-annales/",
      subtitle: "Sujets & corrigés types détaillés",
    },
    pedagogie: {
      title: "Méthode & Réflexes de Concours",
      href: "https://anasskhadir.com/cours-exo-mp/",
      subtitle: "Approche, astuces & méthodologie",
    },
    professor: {
      name: "Anass KHADIR",
      title: "Professeur Agrégé",
      center: "Centre CPGE ERRAZI — El Jadida",
      photoUrl: "/anas-khadir.webp",
      profileHref: "https://anasskhadir.com",
      whatsAppUrl:
        "https://wa.me/212659041407?text=Bonjour%20Professeur%20Anass%20Khadir,%20je%20souhaite%20des%20informations%20sur%20le%20P%C3%B4le%20Math%C3%A9matiques%20CPGE",
    },
  },

  pc: {
    id: "pc",
    title: "Pôle Physique-Chimie",
    shortTitle: "Physique-Chimie",
    badge: "MP / MP* Unique",
    accentColor: "purple",
    programmes: {
      title: "Programmes Officiels",
      href: "/eddams?rubrique=references",
      subtitle: "Références & Formulaires Officiels",
    },
    filiereBadges: [
      { label: "MP / MP*", href: "/eddams?rubrique=references" },
    ],
    annales: {
      title: "Annales CNC, Mines, CCINP",
      href: "/eddams?rubrique=concours",
      subtitle: "Sujets & corrigés officiels",
    },
    pedagogie: {
      title: "Méthode & Séances MP/MP*",
      href: "/eddams?rubrique=cours",
      subtitle: "Cours complets & Travaux Dirigés",
    },
    professor: {
      name: "Hassan EDDAMS",
      title: "Professeur Agrégé",
      center: "CPGE Lycée Moulay Abdellah- Safi",
      photoUrl: "/hassan-eddams.webp",
      profileHref: "/eddams",
      whatsAppUrl:
        "https://wa.me/212721729799?text=Bonjour%20Professeur%20Hassan%20Eddams,%20je%20souhaite%20des%20informations%20sur%20le%20P%C3%B4le%20Physique-Chimie%20CPGE",
    },
  },
};
