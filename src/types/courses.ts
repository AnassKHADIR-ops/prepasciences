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
  correction?: string; // Rétrocompatibilité
  corriges?: CorrigeItem[]; // Support de multiples corrections pour un même TD
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

// Format pour l'insertion en masse (Batch Chapter Import)
export interface BatchDocumentEntry {
  type: "session" | "td" | "fiche";
  titre: string;
  driveSupportUrl?: string; // Lien Drive Énoncé ou Support
  driveCorrigeUrl1?: string; // Corrigé principal
  driveCorrigeUrl2?: string; // Corrigé alternatif / méthode 2
  corrige1Title?: string;
  corrige2Title?: string;
  videoUrl?: string; // YouTube ou Drive
}
