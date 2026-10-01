"use client";

import { UserProfile, UserRole, StudentStatus, StudentOffer } from "@/types/auth";

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
  // ── Administrateur Principal Unique ──
  {
    id: "00000000-0000-0000-0000-000000000000",
    email: "anass.khadir@usmba.ac.ma",
    fullName: "Pr. Anass KHADIR",
    password: "admin",
    phone: "+212659041407",
    role: "admin",
    filiere: "MP*",
    center: "Centre CPGE ERRAZI — El Jadida",
    offer: "integral",
    status: "active",
    createdAt: "2026-09-01T08:00:00Z",
  },
  // ── Professeurs ──
  {
    id: "00000000-0000-0000-0000-000000000001",
    email: "eddams@prepasciences.ma",
    fullName: "Pr. Hassan EDDAMS",
    password: "eddams",
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
    password: "admin",
    phone: "+212659041407",
    role: "admin",
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
    password: "password123",
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
    password: "password123",
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
    password: "password123",
    phone: "+212634567890",
    role: "student",
    filiere: "MP",
    center: "Lycée Moulay Youssef — Rabat",
    offer: "pc",
    status: "pending",
    createdAt: "2026-09-27T19:45:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000014",
    email: "khadija.amrani@cpge.ma",
    fullName: "Khadija AMRANI",
    password: "password123",
    phone: "+212645678901",
    role: "student",
    filiere: "MP*",
    center: "Lycée Mohammed V — Casablanca",
    offer: "integral",
    status: "pending",
    createdAt: "2026-09-28T09:20:00Z",
  },
  {
    id: "00000000-0000-0000-0000-000000000015",
    email: "mehdi.chraibi@cpge.ma",
    fullName: "Mehdi CHRAIBI",
    password: "password123",
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
    let users: UserProfile[] = raw ? JSON.parse(raw) : INITIAL_USERS;

    // Enforce unique admin account anass.khadir@usmba.ac.ma
    const adminEmail = "anass.khadir@usmba.ac.ma";
    const adminIdx = users.findIndex((u) => u.email.toLowerCase() === adminEmail);
    if (adminIdx === -1) {
      users = [INITIAL_USERS[0], ...users];
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } else if (users[adminIdx].role !== "admin") {
      users[adminIdx].role = "admin";
      users[adminIdx].status = "active";
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    return users;
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
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = (pass || "").trim();
  const users = getUsersDB();

  // 1. Recherche par identifiant (email, phone, ou raccourcis admin/prof)
  let user = users.find(
    (u) =>
      u.email.toLowerCase() === cleanId ||
      (u.phone && u.phone.replace(/[\s-]/g, "") === cleanId.replace(/[\s-]/g, ""))
  );

  // Raccourcis pour Pr. Khadir (Admin) et Pr. Eddams
  if (!user) {
    if (
      cleanId === "anass.khadir@usmba.ac.ma" ||
      cleanId === "khadir" ||
      cleanId === "khadir@prepasciences.ma" ||
      cleanId === "+212659041407"
    ) {
      user =
        users.find((u) => u.email.toLowerCase() === "anass.khadir@usmba.ac.ma") ||
        users.find((u) => u.email.toLowerCase() === "khadir@prepasciences.ma") ||
        INITIAL_USERS[0];
    } else if (
      cleanId === "eddams" ||
      cleanId === "eddams@prepasciences.ma" ||
      cleanId === "+212721729799"
    ) {
      user =
        users.find((u) => u.email.toLowerCase() === "eddams@prepasciences.ma") ||
        INITIAL_USERS[1];
    }
  }

  if (!user) {
    return {
      success: false,
      error: "Identifiant introuvable. Avez-vous créé votre compte ?",
    };
  }

  // Garantir le rôle admin pour anass.khadir@usmba.ac.ma
  if (user.email.toLowerCase() === "anass.khadir@usmba.ac.ma") {
    user.role = "admin";
    user.status = "active";
  }

  // 2. Contrôle du mot de passe
  if (user.password) {
    if (!cleanPass) {
      return {
        success: false,
        error: "Veuillez renseigner votre mot de passe.",
      };
    }
    if (user.password !== cleanPass) {
      return {
        success: false,
        error: "Mot de passe incorrect. Veuillez vérifier votre saisie.",
      };
    }
  } else if (cleanPass) {
    // Si l'utilisateur n'avait pas encore de mot de passe, l'enregistrer
    user.password = cleanPass;
    saveUsersDB(users);
  }

  if (user.status === "suspended") {
    return {
      success: false,
      user,
      error: "Votre accès a été suspendu. Veuillez contacter un administrateur.",
    };
  }

  if (user.status === "pending" && user.role !== "admin" && user.role !== "teacher") {
    return {
      success: false,
      user,
      error:
        "Votre compte est actuellement en cours de validation. Vous recevrez une confirmation dès que l'accès sera activé.",
    };
  }

  setCurrentSession(user);
  return { success: true, user };
}

// ── Authentification : Inscription Épurée (3 champs : Nom, Email, Mot de passe) ──
export function registerUser(data: {
  fullName: string;
  email: string;
  password: string;
}): { success: boolean; user?: UserProfile; error?: string } {
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanName = data.fullName.trim();
  const cleanPassword = data.password.trim();

  if (!cleanName || !cleanEmail || !cleanPassword) {
    return {
      success: false,
      error: "Veuillez renseigner votre nom, adresse email et mot de passe.",
    };
  }

  if (cleanPassword.length < 4) {
    return {
      success: false,
      error: "Le mot de passe doit comporter au moins 4 caractères.",
    };
  }

  const users = getUsersDB();

  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return {
      success: false,
      error: "Un compte existe déjà avec cette adresse email. Veuillez vous connecter.",
    };
  }

  // Attribution automatique du rôle : anass.khadir@usmba.ac.ma est Administrateur Unique
  const isAdmin = cleanEmail === "anass.khadir@usmba.ac.ma";
  const isTeacher = cleanEmail === "eddams@prepasciences.ma" || cleanEmail === "khadir@prepasciences.ma";
  const role: UserRole = isAdmin ? "admin" : isTeacher ? "teacher" : "student";

  const newUser: UserProfile = {
    id: generateUUID(),
    email: cleanEmail,
    fullName: cleanName,
    password: cleanPassword,
    phone: "",
    role,
    status: "active", // Accès direct immédiat
    filiere: "MP*",
    center: "CPGE Maroc",
    offer: "pc",
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [newUser, ...users];
  saveUsersDB(updatedUsers);
  setCurrentSession(newUser);

  // Synchronisation Cloud Supabase
  if (supabase) {
    supabase
      .from("profiles")
      .insert([
        {
          id: newUser.id,
          full_name: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
          filiere: newUser.filiere,
          center: newUser.center,
          offer: newUser.offer,
        },
      ])
      .then(({ error }) => {
        if (error) console.error("Supabase insert user error:", error);
      });
  }

  return { success: true, user: newUser };
}

// ── Authentification : Inscription Étudiant avec options détaillées (Rétrocompatibilité Dashboard) ──
export function registerStudent(data: {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  filiere?: "MP" | "MP*" | "TSI" | "Autre";
  center?: string;
  offer?: StudentOffer;
  notes?: string;
}): { success: boolean; user?: UserProfile; error?: string } {
  const users = getUsersDB();
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanPhone = (data.phone || "").trim().replace(/[\s-]/g, "");

  const existing = users.find(
    (u) =>
      u.email.toLowerCase() === cleanEmail ||
      (cleanPhone && u.phone && u.phone.replace(/[\s-]/g, "") === cleanPhone)
  );

  if (existing) {
    return {
      success: false,
      error: "Un compte existe déjà avec cette adresse email ou ce numéro de téléphone.",
    };
  }

  const isAdmin = cleanEmail === "anass.khadir@usmba.ac.ma";
  const role: UserRole = isAdmin ? "admin" : "student";

  const newUser: UserProfile = {
    id: generateUUID(),
    email: cleanEmail,
    fullName: data.fullName.trim(),
    password: data.password?.trim() || "password123",
    phone: data.phone?.trim() || "",
    role,
    filiere: data.filiere || "MP*",
    center: data.center?.trim() || "Centre CPGE",
    offer: data.offer || "pc",
    status: isAdmin ? "active" : "pending",
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
