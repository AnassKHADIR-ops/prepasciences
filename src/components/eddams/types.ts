export type ModulePC =
  | "Tous les modules"
  | "Électromagnétisme"
  | "Thermodynamique"
  | "Mécanique & Ondes"
  | "Optique Ondulatoire"
  | "Chimie des Solutions";

export type SessionType =
  | "Tous"
  | "Concours"
  | "Cours"
  | "TD & Exercices"
  | "Synthèse";

export interface SeancePC {
  id: string;
  titre: string;
  module: ModulePC;
  type: SessionType;
  concoursName?: "CNC" | "Mines-Ponts" | "CCINP" | "X-ENS";
  date: string;
  description: string;
  enonceUrl: string;
  corrigeUrl?: string;
  videoUrl?: string;
  isPinned?: boolean;
}
