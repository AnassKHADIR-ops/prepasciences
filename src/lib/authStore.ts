"use client";

import { UserProfile, UserRole, StudentStatus, StudentOffer, ProfileNotesMeta } from "@/types/auth";

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

// ── Utilitaires pour le stockage structuré de métadonnées dans la colonne notes ──
export function parseNotesMeta(notesStr?: string | null): ProfileNotesMeta {
  if (!notesStr) return {};
  try {
    const parsed = JSON.parse(notesStr);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed;
    }
  } catch {
    // Si c'est du texte brut legacy
    return { rawNotes: notesStr };
  }
  return { rawNotes: notesStr };
}

export function stringifyNotesMeta(meta: ProfileNotesMeta): string {
  return JSON.stringify(meta);
}

export const INITIAL_USERS: UserProfile[] = [
  // ── Administrateurs & Professeurs CPGE (Pleins Droits de Modification) ──
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
    notes: JSON.stringify({ pwd: "admin" }),
  },
  {
    id: "00000000-0000-0000-0000-000000000001",
    email: "eddams@prepasciences.ma",
    fullName: "Pr. Hassan EDDAMS",
    password: "eddams",
    phone: "+212721729799",
    role: "admin",
    filiere: "MP*",
    center: "CPGE Lycée Moulay Abdellah- Safi",
    offer: "pc",
    status: "active",
    createdAt: "2026-09-01T08:00:00Z",
    notes: JSON.stringify({ pwd: "eddams" }),
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
    notes: JSON.stringify({ pwd: "admin" }),
  },
  // ── Mohamed anas elmerkhi (Étudiant en attente d'approbation) ──
  {
    id: "d0000000-0000-0000-0000-000000000001",
    email: "anas.elmerkhi@gmail.com",
    fullName: "Mohamed anas elmerkhi",
    password: "password123",
    phone: "+212600000000",
    role: "student",
    filiere: "MP*",
    center: "CPGE Maroc",
    offer: "maths",
    status: "pending",
    createdAt: "2026-11-18T12:00:00Z",
    notes: JSON.stringify({
      pwd: "password123",
      resourceRequested: "Séance 1 (Normes & EVN) — Topologie des espaces normés",
    }),
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

    // Garantir le rôle administrateur et le statut actif pour tous les comptes administrateurs
    const adminEmails = [
      "anass.khadir@usmba.ac.ma",
      "eddams@prepasciences.ma",
      "khadir@prepasciences.ma",
    ];
    let changed = false;

    // S'assurer que les administrateurs et Mohamed anas elmerkhi sont présents
    INITIAL_USERS.forEach((initUser) => {
      const idx = users.findIndex((u) => u.email.toLowerCase() === initUser.email.toLowerCase());
      if (idx === -1) {
        users.unshift(initUser);
        changed = true;
      } else {
        if (adminEmails.includes(initUser.email.toLowerCase())) {
          if (users[idx].role !== "admin" || users[idx].status !== "active") {
            users[idx].role = "admin";
            users[idx].status = "active";
            changed = true;
          }
          if (!users[idx].password) {
            users[idx].password = initUser.password;
            changed = true;
          }
        }
      }
    });

    // Restaurer les mots de passe stockés dans les métadonnées notes si manquant
    users.forEach((u) => {
      if (!u.password && u.notes) {
        const meta = parseNotesMeta(u.notes);
        if (meta.pwd) {
          u.password = meta.pwd;
          changed = true;
        }
      }
    });

    if (changed) {
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
    if (!raw) return null;
    const user: UserProfile = JSON.parse(raw);
    const adminEmails = [
      "anass.khadir@usmba.ac.ma",
      "eddams@prepasciences.ma",
      "khadir@prepasciences.ma",
    ];
    if (adminEmails.includes(user.email?.toLowerCase())) {
      user.role = "admin";
      user.status = "active";
    }
    return user;
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
      error: "Identifiant introuvable. Avez-vous créé votre compte sur la plateforme ?",
    };
  }

  // Garantir le rôle admin avec pleins droits pour tous les administrateurs et professeurs CPGE
  const adminEmails = ["anass.khadir@usmba.ac.ma", "eddams@prepasciences.ma", "khadir@prepasciences.ma"];
  if (adminEmails.includes(user.email.toLowerCase()) || user.role === "admin") {
    user.role = "admin";
    user.status = "active";
  }

  // Vérifier le mot de passe depuis l'objet ou les métadonnées
  const userEffectivePass = user.password || (user.notes ? parseNotesMeta(user.notes).pwd : undefined);

  // 2. Contrôle du mot de passe
  if (userEffectivePass) {
    if (!cleanPass) {
      return {
        success: false,
        error: "Veuillez renseigner votre mot de passe.",
      };
    }
    if (userEffectivePass !== cleanPass) {
      return {
        success: false,
        error: "Mot de passe incorrect. Vous pouvez utiliser le lien « Mot de passe oublié ? » pour le réinitialiser.",
      };
    }
  } else if (cleanPass) {
    // Si l'utilisateur n'avait pas encore de mot de passe, l'enregistrer
    user.password = cleanPass;
    const meta = parseNotesMeta(user.notes);
    meta.pwd = cleanPass;
    user.notes = stringifyNotesMeta(meta);
    saveUsersDB(users);
  }

  if (user.status === "suspended") {
    return {
      success: false,
      user,
      error: "Votre accès a été suspendu. Veuillez contacter vos professeurs via WhatsApp.",
    };
  }

  if (user.status === "pending" && user.role !== "admin" && user.role !== "teacher") {
    return {
      success: false,
      user,
      error:
        "Votre compte est actuellement en attente de validation par vos professeurs. Vous pouvez également cliquer sur « Contacter le Professeur » pour accélérer l'activation.",
    };
  }

  setCurrentSession(user);
  return { success: true, user };
}

// ── Authentification : Inscription Simplifiée avec Synchronisation Cloud Garantie ──
export function registerUser(data: {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  offer?: StudentOffer;
  filiere?: "MP" | "MP*" | "TSI" | "Autre";
  center?: string;
  resourceRequested?: string;
}): { success: boolean; user?: UserProfile; error?: string } {
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanName = data.fullName.trim();
  const cleanPassword = data.password.trim();
  // Sécuriser le numéro de téléphone pour satisfaire la contrainte NOT NULL de Supabase
  const rawPhone = (data.phone || "").trim();
  const cleanPhone = rawPhone.length > 3 ? rawPhone : "+212600000000";

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

  // Attribution automatique du rôle : Administrateurs avec pleins pouvoirs
  const adminEmails = ["anass.khadir@usmba.ac.ma", "eddams@prepasciences.ma", "khadir@prepasciences.ma"];
  const isAdmin = adminEmails.includes(cleanEmail);
  const role: UserRole = isAdmin ? "admin" : "student";
  // Option A : les étudiants créés sont 'pending' en attente de validation par les professeurs
  const status: StudentStatus = isAdmin ? "active" : "pending";

  const notesMeta: ProfileNotesMeta = {
    pwd: cleanPassword,
    resourceRequested: data.resourceRequested || undefined,
  };
  const notesString = stringifyNotesMeta(notesMeta);

  const newUser: UserProfile = {
    id: generateUUID(),
    email: cleanEmail,
    fullName: cleanName,
    password: cleanPassword,
    phone: cleanPhone,
    role,
    status,
    filiere: data.filiere || "MP*",
    center: data.center?.trim() || "CPGE Maroc",
    offer: data.offer || "pc",
    createdAt: new Date().toISOString(),
    notes: notesString,
  };

  const updatedUsers = [newUser, ...users];
  saveUsersDB(updatedUsers);

  // Synchronisation Cloud Supabase immédiate avec upsert pour garantir la persistance
  if (supabase) {
    supabase
      .from("profiles")
      .upsert([
        {
          id: newUser.id,
          full_name: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone, // Toujours garanti non-nul pour respecter PostgreSQL
          role: newUser.role,
          status: newUser.status,
          filiere: newUser.filiere,
          center: newUser.center,
          offer: newUser.offer,
          notes: notesString,
        },
      ])
      .then(({ error }) => {
        if (error) console.error("Erreur de synchronisation Supabase à l'inscription:", error);
      });
  }

  if (status === "active") {
    setCurrentSession(newUser);
  }

  return { success: true, user: newUser };
}

// ── Authentification : Inscription Étudiant avec options détaillées ──
export function registerStudent(data: {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  filiere?: "MP" | "MP*" | "TSI" | "Autre";
  center?: string;
  offer?: StudentOffer;
  notes?: string;
  resourceRequested?: string;
}): { success: boolean; user?: UserProfile; error?: string } {
  const users = getUsersDB();
  const cleanEmail = data.email.trim().toLowerCase();
  const rawPhone = (data.phone || "").trim();
  const cleanPhone = rawPhone.length > 3 ? rawPhone : "+212600000000";

  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return {
      success: false,
      error: "Un compte existe déjà avec cette adresse email.",
    };
  }

  const adminEmails = ["anass.khadir@usmba.ac.ma", "eddams@prepasciences.ma", "khadir@prepasciences.ma"];
  const isAdmin = adminEmails.includes(cleanEmail);
  const role: UserRole = isAdmin ? "admin" : "student";
  const password = data.password?.trim() || "password123";

  const notesMeta: ProfileNotesMeta = {
    pwd: password,
    rawNotes: data.notes?.trim() || undefined,
    resourceRequested: data.resourceRequested || undefined,
  };
  const notesString = stringifyNotesMeta(notesMeta);

  const newUser: UserProfile = {
    id: generateUUID(),
    email: cleanEmail,
    fullName: data.fullName.trim(),
    password,
    phone: cleanPhone,
    role,
    filiere: data.filiere || "MP*",
    center: data.center?.trim() || "Centre CPGE",
    offer: data.offer || "pc",
    status: isAdmin ? "active" : "pending",
    createdAt: new Date().toISOString(),
    notes: notesString,
  };

  const updatedUsers = [newUser, ...users];
  saveUsersDB(updatedUsers);

  // Synchronisation Cloud Supabase
  if (supabase) {
    supabase
      .from("profiles")
      .upsert([
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
          notes: notesString,
        },
      ])
      .then(({ error }) => {
        if (error) console.error("Erreur d'insertion étudiant Supabase:", error);
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

// ── Validation Rapide ou Création Directe par le Professeur (ex: suite à message WhatsApp) ──
export async function quickApproveOrAddStudent(data: {
  email: string;
  fullName?: string;
  phone?: string;
  offer?: StudentOffer;
  approvedBy?: string;
}): Promise<{ success: boolean; user?: UserProfile; message: string }> {
  const cleanEmail = data.email.trim().toLowerCase();
  const users = getUsersDB();
  const index = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
  const nowIso = new Date().toISOString();
  const approver = data.approvedBy || "Professeur CPGE";

  if (index !== -1) {
    users[index].status = "active";
    users[index].approvedAt = nowIso;
    users[index].approvedBy = approver;
    if (data.fullName && (!users[index].fullName || users[index].fullName === cleanEmail)) {
      users[index].fullName = data.fullName.trim();
    }
    if (data.phone && (!users[index].phone || users[index].phone === "+212600000000")) {
      users[index].phone = data.phone.trim();
    }
    if (data.offer) {
      users[index].offer = data.offer;
    }
    saveUsersDB(users);

    if (supabase) {
      await supabase
        .from("profiles")
        .update({
          status: "active",
          approved_at: nowIso,
          approved_by: approver,
          full_name: users[index].fullName,
          phone: users[index].phone,
          offer: users[index].offer,
        })
        .eq("id", users[index].id);
    }

    return {
      success: true,
      user: users[index],
      message: `Accès validé avec succès pour ${users[index].fullName} (${users[index].email}) !`,
    };
  } else {
    // Si l'étudiant n'était pas encore enregistré, créer et activer son profil
    const cleanPhone = (data.phone || "").trim() || "+212600000000";
    const newUser: UserProfile = {
      id: generateUUID(),
      email: cleanEmail,
      fullName: data.fullName?.trim() || cleanEmail.split("@")[0],
      phone: cleanPhone,
      role: "student",
      filiere: "MP*",
      center: "CPGE Maroc",
      offer: data.offer || "integral",
      status: "active",
      createdAt: nowIso,
      approvedAt: nowIso,
      approvedBy: approver,
      password: "password123",
      notes: JSON.stringify({ pwd: "password123" }),
    };

    const updated = [newUser, ...users];
    saveUsersDB(updated);

    if (supabase) {
      await supabase.from("profiles").upsert([
        {
          id: newUser.id,
          full_name: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          status: newUser.status,
          filiere: newUser.filiere,
          center: newUser.center,
          offer: newUser.offer,
          approved_at: nowIso,
          approved_by: approver,
          notes: newUser.notes,
        },
      ]);
    }

    return {
      success: true,
      user: newUser,
      message: `Compte créé et validé immédiatement pour ${newUser.fullName} !`,
    };
  }
}

// ── Récupération de Mot de Passe & Validation Sécurisée par WhatsApp ──
export async function requestPasswordReset(email: string): Promise<{
  success: boolean;
  code?: string;
  student?: UserProfile;
  error?: string;
}> {
  const cleanEmail = email.trim().toLowerCase();
  const users = getUsersDB();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return {
      success: false,
      error: "Aucun compte trouvé avec cette adresse email. Vérifiez l'adresse ou créez un compte.",
    };
  }

  // Génération d'un code de sécurité à 6 chiffres
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 15 * 60 * 1000; // Valide 15 minutes

  const meta = parseNotesMeta(user.notes);
  meta.resetCode = code;
  meta.resetExpires = expires;
  user.notes = stringifyNotesMeta(meta);

  saveUsersDB(users);

  // Sauvegarde dans Supabase
  if (supabase) {
    try {
      await supabase
        .from("profiles")
        .update({ notes: user.notes })
        .eq("id", user.id);
    } catch (err) {
      console.error("Erreur mise à jour code de réinitialisation Supabase:", err);
    }
  }

  return { success: true, code, student: user };
}

export async function resetPasswordWithCode(
  email: string,
  code: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = code.trim();
  const cleanPass = newPassword.trim();

  if (cleanPass.length < 4) {
    return { success: false, error: "Le mot de passe doit comporter au moins 4 caractères." };
  }

  const users = getUsersDB();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return { success: false, error: "Utilisateur introuvable." };
  }

  const meta = parseNotesMeta(user.notes);

  if (!meta.resetCode || meta.resetCode !== cleanCode) {
    return { success: false, error: "Code de sécurité incorrect. Veuillez vérifier le code reçu ou renvoyer une demande." };
  }

  if (meta.resetExpires && Date.now() > meta.resetExpires) {
    return { success: false, error: "Ce code de sécurité a expiré (validité 15 min). Veuillez générer un nouveau code." };
  }

  // Validation du code -> Réinitialisation du mot de passe
  user.password = cleanPass;
  meta.pwd = cleanPass;
  meta.resetCode = undefined;
  meta.resetExpires = undefined;
  user.notes = stringifyNotesMeta(meta);

  saveUsersDB(users);

  if (supabase) {
    try {
      await supabase
        .from("profiles")
        .update({ notes: user.notes })
        .eq("id", user.id);
    } catch (err) {
      console.error("Erreur mise à jour nouveau mot de passe Supabase:", err);
    }
  }

  return { success: true };
}

// Réinitialisation directe d'un mot de passe par le professeur depuis son tableau de bord
export async function adminSetStudentPassword(
  studentId: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const cleanPass = newPassword.trim();
  if (cleanPass.length < 4) {
    return { success: false, error: "Le mot de passe doit comporter au moins 4 caractères." };
  }

  const users = getUsersDB();
  const user = users.find((u) => u.id === studentId);
  if (!user) {
    return { success: false, error: "Étudiant introuvable." };
  }

  user.password = cleanPass;
  const meta = parseNotesMeta(user.notes);
  meta.pwd = cleanPass;
  meta.resetCode = undefined;
  meta.resetExpires = undefined;
  user.notes = stringifyNotesMeta(meta);

  saveUsersDB(users);

  if (supabase) {
    try {
      await supabase
        .from("profiles")
        .update({ notes: user.notes })
        .eq("id", user.id);
    } catch (err) {
      console.error("Erreur modification mot de passe par le professeur Supabase:", err);
    }
  }

  return { success: true };
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

    const mapped: UserProfile[] = data.map((row) => {
      const meta = parseNotesMeta(row.notes);
      return {
        id: row.id,
        email: row.email,
        fullName: row.full_name,
        phone: row.phone || "+212600000000",
        role: row.role as UserRole,
        filiere: row.filiere,
        center: row.center,
        offer: row.offer as StudentOffer,
        status: row.status as StudentStatus,
        createdAt: row.created_at,
        approvedAt: row.approved_at,
        approvedBy: row.approved_by,
        notes: row.notes,
        password: meta.pwd || undefined,
      };
    });

    // Fusionner intelligemment avec les profils locaux pour ne perdre aucun mot de passe
    const localUsers = getUsersDB();
    const merged = mapped.map((remoteUser) => {
      const local = localUsers.find((l) => l.email.toLowerCase() === remoteUser.email.toLowerCase());
      if (local && local.password && !remoteUser.password) {
        remoteUser.password = local.password;
      }
      return remoteUser;
    });

    // S'assurer que les administrateurs initiaux existent toujours
    INITIAL_USERS.forEach((initUser) => {
      const exists = merged.some((u) => u.email.toLowerCase() === initUser.email.toLowerCase());
      if (!exists) {
        merged.unshift(initUser);
      }
    });

    saveUsersDB(merged);
    return merged;
  } catch (err) {
    console.error("Error syncing profiles from Supabase:", err);
    return getUsersDB();
  }
}
