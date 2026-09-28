"use client";

import { UserProfile, StudentStatus, StudentOffer } from "@/types/auth";

const USERS_KEY = "prepasciences_users_db";
const SESSION_KEY = "prepasciences_session_user";
const TEACHER_VIEW_MODE_KEY = "prepasciences_teacher_view_mode";

import { supabase } from "./supabase";

export function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const INITIAL_USERS: UserProfile[] = [
  // ── Professeurs ──
  {
    id: "00000000-0000-0000-0000-000000000001",
    email: "eddams@prepasciences.ma",
    fullName: "Pr. Hassan EDDAMS",
    phone: "+212721729799",
    role: "teacher",
    filiere: "MP*",
    center: "CPGE Lycée Moulay Abdellah- Safi",
    offer: "pc",
    status: "active",
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    email: "khadir@prepasciences.ma",
    fullName: "Pr. Anass KHADIR",
    phone: "+212659041407",
    role: "teacher",
    filiere: "MP*",
    center: "Centre CPGE ERRAZI — El Jadida",
    offer: "maths",
    status: "active",
    createdAt: "2026-09-01T08:00:00Z",
  },
  // ── Étudiants pré-inscrits ──
  {
    id: "00000000-0000-0000-0000-000000000011",
    email: "yassine.benali@cpge.ma",
    fullName: "Yassine BENALI",
    phone: "+212612345678",
    role: "student",
    filiere: "MP*",
    center: "CPGE Moulay Abdellah — Safi",
    offer: "pc",
    status: "active",
    createdAt: "2026-09-15T10:30:00Z",
    approvedAt: "2026-09-16T09:00:00Z",
    approvedBy: "Pr. Hassan EDDAMS",
  },
  {
    id: "00000000-0000-0000-0000-000000000012",
    email: "salma.tazi@cpge.ma",
    fullName: "Salma TAZI",
    phone: "+212623456789",
    role: "student",
    filiere: "MP",
    center: "CPGE ERRAZI — El Jadida",
    offer: "integral",
    status: "active",
    createdAt: "2026-09-18T14:15:00Z",
    approvedAt: "2026-09-18T16:00:00Z",
    approvedBy: "Pr. Anass KHADIR",
  },
  {
    id: "00000000-0000-0000-0000-000000000013",
    email: "omar.elfassi@cpge.ma",
    fullName: "Omar EL FASSI",
    phone: "+212634567890",
    role: "student",
    filiere: "MP",
    center: "Lycée Moulay Youssef — Rabat",
    offer: "pc",
    status: "pending", // En attente de validation (Option A)
    createdAt: "2026-09-27T19:45:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000014",
    email: "khadija.amrani@cpge.ma",
    fullName: "Khadija AMRANI",
    phone: "+212645678901",
    role: "student",
    filiere: "MP*",
    center: "Lycée Mohammed V — Casablanca",
    offer: "integral",
    status: "pending", // En attente de validation (Option A)
    createdAt: "2026-09-28T09:20:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000015",
    email: "mehdi.chraibi@cpge.ma",
    fullName: "Mehdi CHRAIBI",
    phone: "+212656789012",
    role: "student",
    filiere: "TSI",
    center: "CPGE Ibn Ghazi — Rabat",
    offer: "maths",
    status: "suspended",
    createdAt: "2026-09-10T11:00:00Z",
  },
];

export function getUsersDB(): UserProfile[] {
  if (typeof window === "undefined") return INITIAL_USERS;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUsersDB(users: UserProfile[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // Ignore
  }
}

export function getCurrentSession(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentSession(user: UserProfile | null): void {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // Ignore
  }
}

export function getTeacherViewMode(): "teacher" | "preview-student" {
  if (typeof window === "undefined") return "teacher";
  try {
    const mode = localStorage.getItem(TEACHER_VIEW_MODE_KEY);
    return mode === "preview-student" ? "preview-student" : "teacher";
  } catch {
    return "teacher";
  }
}

export function setTeacherViewMode(mode: "teacher" | "preview-student"): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TEACHER_VIEW_MODE_KEY, mode);
  } catch {
    // Ignore
  }
}

// ── Authentification : Connexion ──
export function loginUser(
  identifier: string,
  pass?: string
): { success: boolean; user?: UserProfile; error?: string } {
  void pass;
  const cleanId = identifier.trim().toLowerCase();
  const users = getUsersDB();

  // 1. Accès rapides prédéfinis pour les 2 professeurs
  if (cleanId === "eddams" || cleanId === "eddams@prepasciences.ma" || cleanId === "+212721729799") {
    const prof = users.find((u) => u.email === "eddams@prepasciences.ma") || INITIAL_USERS[0];
    setCurrentSession(prof);
    return { success: true, user: prof };
  }

  if (cleanId === "khadir" || cleanId === "khadir@prepasciences.ma" || cleanId === "+212659041407") {
    const prof = users.find((u) => u.email === "khadir@prepasciences.ma") || INITIAL_USERS[1];
    setCurrentSession(prof);
    return { success: true, user: prof };
  }

  // 2. Recherche parmi les étudiants
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === cleanId ||
      u.phone.replace(/[\s-]/g, "") === cleanId.replace(/[\s-]/g, "")
  );

  if (!user) {
    return {
      success: false,
      error: "Identifiant introuvable. Avez-vous créé votre compte étudiant ?",
    };
  }

  // Règle Option A : si le compte est en attente
  if (user.status === "pending") {
    return {
      success: false,
      user,
      error:
        "Votre compte est actuellement en cours de validation par vos professeurs. Vous recevrez une confirmation sur WhatsApp dès que l'accès sera activé.",
    };
  }

  if (user.status === "suspended") {
    return {
      success: false,
      user,
      error:
        "Votre accès a été suspendu. Veuillez contacter le professeur de la matière via WhatsApp.",
    };
  }

  setCurrentSession(user);
  return { success: true, user };
}

// ── Authentification : Inscription Étudiant (Option A : En attente par défaut) ──
export function registerStudent(data: {
  fullName: string;
  email: string;
  phone: string;
  filiere: "MP" | "MP*" | "TSI" | "Autre";
  center: string;
  offer: StudentOffer;
  notes?: string;
}): { success: boolean; user?: UserProfile; error?: string } {
  const users = getUsersDB();

  const existing = users.find(
    (u) =>
      u.email.toLowerCase() === data.email.trim().toLowerCase() ||
      u.phone.replace(/[\s-]/g, "") === data.phone.trim().replace(/[\s-]/g, "")
  );

  if (existing) {
    return {
      success: false,
      error: "Un compte existe déjà avec cette adresse email ou ce numéro de téléphone.",
    };
  }

  const newUser: UserProfile = {
    id: generateUUID(),
    email: data.email.trim(),
    fullName: data.fullName.trim(),
    phone: data.phone.trim(),
    role: "student",
    filiere: data.filiere,
    center: data.center.trim() || "Centre CPGE",
    offer: data.offer,
    status: "pending", // Option A validée : En attente de confirmation professeur
    createdAt: new Date().toISOString(),
    notes: data.notes?.trim(),
  };

  const updatedUsers = [newUser, ...users];
  saveUsersDB(updatedUsers);

  // Synchronisation Cloud Supabase
  if (supabase) {
    supabase
      .from("profiles")
      .insert([
        {
          id: newUser.id,
          full_name: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          filiere: newUser.filiere,
          center: newUser.center,
          offer: newUser.offer,
          status: newUser.status,
          notes: newUser.notes || null,
        },
      ])
      .then(({ error }) => {
        if (error) console.error("Supabase insert student error:", error);
      });
  }

  return { success: true, user: newUser };
}

// ── Gestion Enseignants : Valider, Suspendre ou Mettre à jour un étudiant ──
export function updateStudentStatus(
  studentId: string,
  newStatus: StudentStatus,
  approvedBy?: string
): boolean {
  const users = getUsersDB();
  const index = users.findIndex((u) => u.id === studentId);
  if (index === -1) return false;

  users[index].status = newStatus;
  const nowIso = new Date().toISOString();
  if (newStatus === "active") {
    users[index].approvedAt = nowIso;
    if (approvedBy) users[index].approvedBy = approvedBy;
  }

  saveUsersDB(users);

  // Synchronisation Cloud Supabase
  if (supabase) {
    supabase
      .from("profiles")
      .update({
        status: newStatus,
        approved_at: newStatus === "active" ? nowIso : null,
        approved_by: approvedBy || null,
      })
      .eq("id", studentId)
      .then(({ error }) => {
        if (error) console.error("Supabase update student status error:", error);
      });
  }

  return true;
}

// ── Suppression d'un étudiant ──
export function deleteStudent(studentId: string): boolean {
  const users = getUsersDB();
  const filtered = users.filter((u) => u.id !== studentId);
  if (filtered.length === users.length) return false;

  saveUsersDB(filtered);

  // Synchronisation Cloud Supabase
  if (supabase) {
    supabase
      .from("profiles")
      .delete()
      .eq("id", studentId)
      .then(({ error }) => {
        if (error) console.error("Supabase delete student error:", error);
      });
  }

  return true;
}

// ── Synchronisation ascendante depuis Supabase (Temps réel / Au chargement) ──
export async function syncProfilesFromSupabase(): Promise<UserProfile[]> {
  if (!supabase) return getUsersDB();
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return getUsersDB();

    const mapped: UserProfile[] = data.map((row) => ({
      id: row.id,
      email: row.email,
      fullName: row.full_name,
      phone: row.phone,
      role: row.role,
      filiere: row.filiere,
      center: row.center,
      offer: row.offer,
      status: row.status,
      createdAt: row.created_at,
      approvedAt: row.approved_at,
      approvedBy: row.approved_by,
      notes: row.notes,
    }));

    saveUsersDB(mapped);
    return mapped;
  } catch (err) {
    console.error("Error syncing profiles from Supabase:", err);
    return getUsersDB();
  }
}
