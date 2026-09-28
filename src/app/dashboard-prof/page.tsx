"use client";

import React, { useState, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCourses } from "@/context/CoursesContext";
import { StudentStatus, StudentOffer, UserProfile } from "@/types/auth";
import { BatchDocumentEntry } from "@/types/courses";
import { EddamsNavbar } from "@/components/eddams/EddamsNavbar";
import {
  Users,
  PlusCircle,
  FolderPlus,
  Database,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageCircle,
  Trash2,
  ExternalLink,
  FileText,
  PlayCircle,
  Layers,
  Search,
  Check,
  Eye,
  Copy,
} from "lucide-react";

export default function DashboardProfPage() {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const {
    currentUser,
    students,
    updateStatus,
    deleteStudentById,
    register,
    teacherViewMode,
    toggleTeacherViewMode,
  } = useAuth();

  const {
    courses,
    createSession,
    createExercise,
    createFiche,
    createBatchChapter,
    createModule,
    editModule,
    removeModule,
    createChapter,
    editChapter,
    removeChapter,
  } = useCourses();

  // Navigation par onglets
  const [activeTab, setActiveTab] = useState<"students" | "single_add" | "batch_add" | "modules_mgmt" | "supabase">("students");

  // Thème Sombre / Mode Naturel
  const [theme, setTheme] = useState<"light" | "dark">("light");

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("eddams_theme");
      if (saved === "dark" || saved === "light") {
        const timer = setTimeout(() => {
          setTheme(saved);
        }, 0);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try {
      localStorage.setItem("eddams_theme", next);
    } catch {}
  };

  // Notifications
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // TAB 1 : GESTION DES ÉTUDIANTS (OPTION A)
  // ══════════════════════════════════════════════════════════════════════════
  const [studentSearch, setStudentSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | StudentStatus>("all");
  const [offerFilter, setOfferFilter] = useState<"all" | StudentOffer>("all");

  const pendingCount = useMemo(() => students.filter((s) => s.status === "pending").length, [students]);
  const activeCount = useMemo(() => students.filter((s) => s.status === "active").length, [students]);
  const suspendedCount = useMemo(() => students.filter((s) => s.status === "suspended").length, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      const matchOffer = offerFilter === "all" || s.offer === offerFilter;
      const q = studentSearch.trim().toLowerCase();
      const matchQuery =
        !q ||
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.center.toLowerCase().includes(q) ||
        s.filiere.toLowerCase().includes(q);
      return matchStatus && matchOffer && matchQuery;
    });
  }, [students, statusFilter, offerFilter, studentSearch]);

  const handleApprove = (student: UserProfile) => {
    updateStatus(student.id, "active");
    showToast("success", `Accès activé avec succès pour ${student.fullName} !`);
  };

  const handleSuspend = (student: UserProfile) => {
    updateStatus(student.id, "suspended");
    showToast("error", `Accès suspendu pour ${student.fullName}.`);
  };

  const handleDelete = (student: UserProfile) => {
    if (confirm(`Confirmez-vous la suppression définitive du compte de ${student.fullName} ?`)) {
      deleteStudentById(student.id);
      showToast("success", `Étudiant ${student.fullName} supprimé.`);
    }
  };

  // Formulaire d'ajout manuel rapide d'un étudiant par le professeur
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualFiliere, setManualFiliere] = useState<"MP" | "MP*" | "TSI" | "Autre">("MP*");
  const [manualCenter, setManualCenter] = useState("");
  const [manualOffer, setManualOffer] = useState<StudentOffer>("pc");

  const handleManualAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualEmail.trim()) {
      showToast("error", "Nom et email obligatoires.");
      return;
    }
    const res = register({
      fullName: manualName.trim(),
      email: manualEmail.trim(),
      phone: manualPhone.trim() || "+212",
      filiere: manualFiliere,
      center: manualCenter.trim() || "CPGE",
      offer: manualOffer,
    });
    if (res.success && res.user) {
      updateStatus(res.user.id, "active"); // Activer immédiatement si créé par le professeur
      showToast("success", `Étudiant ${res.user.fullName} inscrit et activé immédiatement.`);
      setShowAddStudentModal(false);
      setManualName("");
      setManualEmail("");
      setManualPhone("");
      setManualCenter("");
    } else {
      showToast("error", res.error || "Erreur lors de l'ajout.");
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // TAB 2 : INSERTION UNITAIRE (TD avec MULTI-CORRIGÉS, SÉANCES, FICHES)
  // ══════════════════════════════════════════════════════════════════════════
  const [singleType, setSingleType] = useState<"td" | "session" | "fiche">("td");
  const [selectedModuleId, setSelectedModuleId] = useState<string>(courses[0]?.id || "em");
  const currentModule = useMemo(() => courses.find((m) => m.id === selectedModuleId), [courses, selectedModuleId]);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(courses[0]?.chapitres[0]?.id || "");

  const handleModuleSelect = (modId: string) => {
    setSelectedModuleId(modId);
    const mod = courses.find((m) => m.id === modId);
    if (mod && mod.chapitres.length > 0) {
      setSelectedChapterId(mod.chapitres[0].id);
    }
  };

  // Formulaire TD
  const [tdTitle, setTdTitle] = useState("");
  const [tdSous, setTdSous] = useState("Problème type Concours");
  const [tdEnonceUrl, setTdEnonceUrl] = useState("");
  const [tdCorriges, setTdCorriges] = useState<Array<{ titre: string; url: string; type: "pdf" | "video" }>>([
    { titre: "Corrigé officiel rédigé", url: "", type: "pdf" },
  ]);
  const [tdVideoUrl, setTdVideoUrl] = useState("");

  const handleAddCorrigeRow = () => {
    setTdCorriges((prev) => [
      ...prev,
      { titre: `Corrigé méthode ${prev.length + 1}`, url: "", type: "pdf" },
    ]);
  };

  const handleRemoveCorrigeRow = (index: number) => {
    if (tdCorriges.length <= 1) return;
    setTdCorriges((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateCorrigeRow = (index: number, field: "titre" | "url" | "type", val: string) => {
    setTdCorriges((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: val } : c))
    );
  };

  const handleSubmitExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tdTitle.trim()) {
      showToast("error", "Veuillez renseigner le titre du TD.");
      return;
    }
    const success = createExercise(selectedModuleId, selectedChapterId, {
      titre: tdTitle.trim(),
      sous: tdSous.trim(),
      enonceUrl: tdEnonceUrl.trim() || undefined,
      corriges: tdCorriges.filter((c) => c.url.trim() !== ""),
      videoUrl: tdVideoUrl.trim() || undefined,
    });
    if (success) {
      showToast("success", `TD "${tdTitle}" ajouté avec succès au chapitre !`);
      setTdTitle("");
      setTdEnonceUrl("");
      setTdCorriges([{ titre: "Corrigé officiel rédigé", url: "", type: "pdf" }]);
      setTdVideoUrl("");
    } else {
      showToast("error", "Impossible d'ajouter le TD. Vérifiez le module et chapitre.");
    }
  };

  // Formulaire Séance
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionSous, setSessionSous] = useState("Séance théorique & Replay");
  const [sessionSupportUrl, setSessionSupportUrl] = useState("");
  const [sessionVideoUrl, setSessionVideoUrl] = useState("");

  const handleSubmitSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionTitle.trim()) {
      showToast("error", "Veuillez renseigner le titre de la séance.");
      return;
    }
    const success = createSession(selectedModuleId, selectedChapterId, {
      titre: sessionTitle.trim(),
      sous: sessionSous.trim(),
      supportUrl: sessionSupportUrl.trim() || undefined,
      videoUrl: sessionVideoUrl.trim() || undefined,
    });
    if (success) {
      showToast("success", `Séance "${sessionTitle}" ajoutée avec succès !`);
      setSessionTitle("");
      setSessionSupportUrl("");
      setSessionVideoUrl("");
    } else {
      showToast("error", "Erreur lors de l'ajout de la séance.");
    }
  };

  // Formulaire Fiche
  const [ficheTitle, setFicheTitle] = useState("");
  const [ficheSous, setFicheSous] = useState("Fiche formulaire & réflexes");
  const [ficheDriveUrl, setFicheDriveUrl] = useState("");

  const handleSubmitFiche = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ficheTitle.trim() || !ficheDriveUrl.trim()) {
      showToast("error", "Veuillez renseigner le titre et l'URL Drive de la fiche.");
      return;
    }
    const success = createFiche(selectedModuleId, selectedChapterId, {
      titre: ficheTitle.trim(),
      sous: ficheSous.trim(),
      drivePdfUrl: ficheDriveUrl.trim(),
    });
    if (success) {
      showToast("success", `Fiche "${ficheTitle}" ajoutée avec succès !`);
      setFicheTitle("");
      setFicheDriveUrl("");
    } else {
      showToast("error", "Erreur lors de l'ajout de la fiche.");
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // TAB 3 : IMPORTATION GROUPÉE DE CHAPITRE (BATCH DRIVE UPLOAD)
  // ══════════════════════════════════════════════════════════════════════════
  const [batchModuleId, setBatchModuleId] = useState<string>("em");
  const [batchChapterNum, setBatchChapterNum] = useState<number>(5);
  const [batchChapterTitle, setBatchChapterTitle] = useState("");
  const [batchChapterDesc, setBatchChapterDesc] = useState("");
  const [batchBadge, setBatchBadge] = useState("Spé MP / MP*");

  const [batchDocs, setBatchDocs] = useState<BatchDocumentEntry[]>([
    {
      type: "session",
      titre: "Séance 1 : Fondements & Replay interactif",
      driveSupportUrl: "",
      videoUrl: "",
    },
    {
      type: "td",
      titre: "TD 1 : Entraînement Concours & Applications directes",
      driveSupportUrl: "",
      driveCorrigeUrl1: "",
      corrige1Title: "Corrigé officiel rédigé (PDF)",
      driveCorrigeUrl2: "",
      corrige2Title: "Corrigé méthode 2 (Alternative)",
    },
    {
      type: "td",
      titre: "TD 2 : Problème d'annales Mines-Ponts / CNC",
      driveSupportUrl: "",
      driveCorrigeUrl1: "",
      corrige1Title: "Corrigé détaillé pas à pas",
    },
    {
      type: "fiche",
      titre: "Fiche Synthèse : Formulaire & Réflexes essentiels",
      driveSupportUrl: "",
    },
  ]);

  const handleAddBatchDoc = () => {
    setBatchDocs((prev) => [
      ...prev,
      {
        type: "td",
        titre: `Nouveau document ${prev.length + 1}`,
        driveSupportUrl: "",
        driveCorrigeUrl1: "",
        corrige1Title: "Corrigé rédigé",
      },
    ]);
  };

  const handleRemoveBatchDoc = (index: number) => {
    setBatchDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateBatchDoc = (index: number, field: keyof BatchDocumentEntry, value: string) => {
    setBatchDocs((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
  };

  const handlePresetFullChapter = () => {
    setBatchChapterTitle("Ondes Électromagnétiques & Énergie");
    setBatchChapterDesc("Équations de Maxwell dans le vide, onde plane progressive harmonique, vecteur de Poynting et bilan de puissance.");
    setBatchDocs([
      {
        type: "session",
        titre: "Séance 1 : Équations de Maxwell & Onde plane",
        driveSupportUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      },
      {
        type: "td",
        titre: "TD 1 : Réflexion sur conducteur parfait (Mines MP)",
        driveSupportUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
        driveCorrigeUrl1: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
        corrige1Title: "Corrigé 1 : Méthode des potentiels",
        driveCorrigeUrl2: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
        corrige2Title: "Corrigé 2 : Méthode énergétique",
      },
      {
        type: "td",
        titre: "TD 2 : Propagation en milieu dispersif & Effet Doppler (CNC)",
        driveSupportUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
        driveCorrigeUrl1: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
        corrige1Title: "Corrigé officiel rédigé",
      },
      {
        type: "fiche",
        titre: "Fiche Synthèse : Réflexes & Formulaire Poynting",
        driveSupportUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OGvE2upms/view",
      },
    ]);
    showToast("success", "Modèle complet de chapitre pré-rempli ! Vous pouvez ajuster les liens Drive.");
  };

  const handleSubmitBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchChapterTitle.trim()) {
      showToast("error", "Veuillez renseigner le titre du chapitre.");
      return;
    }
    const success = createBatchChapter(
      batchModuleId,
      {
        num: Number(batchChapterNum) || 1,
        titre: batchChapterTitle.trim(),
        description: batchChapterDesc.trim(),
        badge: batchBadge.trim(),
      },
      batchDocs
    );
    if (success) {
      showToast("success", `Chapitre "${batchChapterTitle}" et ses ${batchDocs.length} documents créés avec succès !`);
      setBatchChapterTitle("");
      setBatchChapterDesc("");
    } else {
      showToast("error", "Erreur lors de la création groupée du chapitre.");
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // GESTION DES MODULES ET SOUS-CHAPITRES (TAB 4)
  // ══════════════════════════════════════════════════════════════════════════
  const [showCreateModModal, setShowCreateModModal] = useState(false);
  const [newModTitre, setNewModTitre] = useState("");
  const [newModIcon, setNewModIcon] = useState("📚");
  const [newModDesc, setNewModDesc] = useState("");

  const [editingMod, setEditingMod] = useState<{ id: string; titre: string; icon: string; description: string } | null>(null);

  const [targetModForNewChap, setTargetModForNewChap] = useState<string>("");
  const [newChapNum, setNewChapNum] = useState<number>(1);
  const [newChapTitle, setNewChapTitle] = useState("");
  const [newChapDesc, setNewChapDesc] = useState("");
  const [newChapBadge, setNewChapBadge] = useState("Spé MP / MP*");

  const [editingChap, setEditingChap] = useState<{
    moduleId: string;
    chapterId: string;
    num: number;
    titre: string;
    description: string;
    badge: string;
  } | null>(null);

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModTitre.trim()) {
      showToast("error", "Le titre du module est requis.");
      return;
    }
    createModule({
      titre: newModTitre.trim(),
      icon: newModIcon.trim() || "📚",
      description: newModDesc.trim() || "Module de cours CPGE",
    });
    showToast("success", `Module "${newModTitre}" créé avec succès !`);
    setShowCreateModModal(false);
    setNewModTitre("");
    setNewModDesc("");
  };

  const handleUpdateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMod || !editingMod.titre.trim()) return;
    editModule(editingMod.id, {
      titre: editingMod.titre.trim(),
      icon: editingMod.icon.trim() || "📚",
      description: editingMod.description.trim(),
    });
    showToast("success", `Module "${editingMod.titre}" mis à jour avec succès !`);
    setEditingMod(null);
  };

  const handleDeleteModule = (modId: string, titre: string) => {
    if (confirm(`Confirmez-vous la suppression du module "${titre}" et de tous ses chapitres ?`)) {
      removeModule(modId);
      showToast("success", `Module "${titre}" supprimé.`);
    }
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetModForNewChap || !newChapTitle.trim()) {
      showToast("error", "Le titre du chapitre est requis.");
      return;
    }
    createChapter(targetModForNewChap, {
      num: Number(newChapNum) || 1,
      titre: newChapTitle.trim(),
      description: newChapDesc.trim(),
      badge: newChapBadge.trim(),
    });
    showToast("success", `Sous-chapitre "${newChapTitle}" créé avec succès !`);
    setTargetModForNewChap("");
    setNewChapTitle("");
    setNewChapDesc("");
  };

  const handleUpdateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChap || !editingChap.titre.trim()) return;
    editChapter(editingChap.moduleId, editingChap.chapterId, {
      num: Number(editingChap.num) || 1,
      titre: editingChap.titre.trim(),
      description: editingChap.description.trim(),
      badge: editingChap.badge.trim(),
    });
    showToast("success", `Chapitre "${editingChap.titre}" mis à jour avec succès !`);
    setEditingChap(null);
  };

  const handleDeleteChapter = (moduleId: string, chapterId: string, titre: string) => {
    if (confirm(`Confirmez-vous la suppression du chapitre "${titre}" ?`)) {
      removeChapter(moduleId, chapterId);
      showToast("success", `Chapitre "${titre}" supprimé.`);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // TAB 5 : GUIDE SUPABASE & SQL
  // ══════════════════════════════════════════════════════════════════════════
  const [copiedSql, setCopiedSql] = useState(false);
  const sqlCode = `-- ============================================================================
-- PRÉPASCIENCES CPGE · SCHÉMA SUPABASE POSTGRESQL (PRODUCTION)
-- Compatible avec l'application existante de Mathématiques et de Physique-Chimie
-- ============================================================================

-- 1. Table des Utilisateurs & Profils
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
  filiere TEXT CHECK (filiere IN ('MP', 'MP*', 'TSI', 'Autre')) DEFAULT 'MP*',
  center TEXT NOT NULL,
  offer TEXT CHECK (offer IN ('pc', 'maths', 'integral')) DEFAULT 'pc',
  status TEXT CHECK (status IN ('pending', 'active', 'suspended')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  notes TEXT
);

-- 2. Table des Chapitres de Cours
CREATE TABLE IF NOT EXISTS public.chapters (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL, -- 'em', 'thermo', 'meca', 'optique', 'chimie', 'maths_algebre', etc.
  num INT NOT NULL,
  titre TEXT NOT NULL,
  description TEXT,
  badge TEXT DEFAULT 'Spé MP / MP*',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table des Séances de Cours & Replays
CREATE TABLE IF NOT EXISTS public.sessions (
  id TEXT PRIMARY KEY,
  chapter_id TEXT REFERENCES public.chapters(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  sous TEXT,
  support_url TEXT, -- Lien Google Drive du PDF
  video_url TEXT,   -- Lien YouTube ou Drive
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table des Travaux Dirigés (TDs)
CREATE TABLE IF NOT EXISTS public.exercises (
  id TEXT PRIMARY KEY,
  chapter_id TEXT REFERENCES public.chapters(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  sous TEXT,
  enonce_url TEXT, -- Lien Google Drive de l'Énoncé
  video_url TEXT,  -- Lien YouTube de la correction vidéo
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table des MULTI-CORRIGÉS par TD (Chaque TD peut avoir plusieurs méthodes de résolution)
CREATE TABLE IF NOT EXISTS public.exercise_corrections (
  id TEXT PRIMARY KEY,
  exercise_id TEXT REFERENCES public.exercises(id) ON DELETE CASCADE,
  titre TEXT NOT NULL, -- ex: 'Méthode énergétique', 'Corrigé officiel rédigé'
  url TEXT NOT NULL,   -- Lien Google Drive ou PDF
  type TEXT DEFAULT 'pdf',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table des Fiches de Synthèse
CREATE TABLE IF NOT EXISTS public.fiches (
  id TEXT PRIMARY KEY,
  chapter_id TEXT REFERENCES public.chapters(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  sous TEXT,
  url TEXT NOT NULL, -- Lien Google Drive du formulaire
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sécurité Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiches ENABLE ROW LEVEL SECURITY;

-- Les étudiants actifs peuvent lire les cours
CREATE POLICY "Public Read Active Students" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Public Read Sessions" ON public.sessions FOR SELECT USING (true);
CREATE POLICY "Public Read Exercises" ON public.exercises FOR SELECT USING (true);
CREATE POLICY "Public Read Corrections" ON public.exercise_corrections FOR SELECT USING (true);
CREATE POLICY "Public Read Fiches" ON public.fiches FOR SELECT USING (true);
`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-[#070b19]" />;
  }

  return (
    <div
      className={`min-h-screen font-sans flex flex-col transition-colors duration-200 ${
        theme === "dark" ? "dark bg-[#070b19] text-white" : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl border shadow-2xl flex items-center gap-3 animate-fadeIn ${
            toastMessage.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-emerald-950/50"
              : "bg-red-950/90 border-red-500/50 text-red-200 shadow-red-950/50"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* 1. Navbar Officielle (Logo H. Eddams, Thème Naturel/Sombre, Nom Enseignant/Étudiant, Déconnexion) */}
      <EddamsNavbar
        activeTab="dashboard"
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Titre & Sous-titre officiels du Tableau de bord (Conforme à la maquette) */}
        <div className="pt-2 pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider font-mono shadow-2xs border ${
                theme === "dark"
                  ? "bg-purple-950/60 border-purple-500/30 text-purple-300"
                  : "bg-blue-50 border-blue-200 text-blue-700"
              }`}
            >
              <span>⏱ ESPACE PROFESSEUR / ADMIN</span>
            </div>
            <h1
              className={`text-2xl sm:text-4xl font-black tracking-tight ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              Tableau de bord
            </h1>
            <p
              className={`text-xs sm:text-sm ${
                theme === "dark" ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Gestion des accès à la plateforme privée, suivi des inscriptions et organisation des modules & cours
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Bascule Mode Édition / Aperçu Étudiant */}
            <button
              type="button"
              onClick={toggleTeacherViewMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                teacherViewMode === "teacher"
                  ? theme === "dark"
                    ? "bg-purple-600/20 border-purple-500/40 text-purple-300 hover:bg-purple-600/30"
                    : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  : "bg-emerald-500/20 border-emerald-400/50 text-emerald-700 dark:text-emerald-300"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>
                {teacherViewMode === "teacher" ? "Mode Éditeur Actif" : "Aperçu : Vue Étudiant"}
              </span>
            </button>

            <Link
              href="/eddams"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                theme === "dark"
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/10"
                  : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-2xs"
              }`}
            >
              <span>Voir le cours</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Navigation des Onglets du Dashboard */}
        <div
          className={`flex p-1.5 rounded-2xl overflow-x-auto gap-1 border transition-colors ${
            theme === "dark"
              ? "bg-white/[0.04] border-white/10"
              : "bg-slate-200/70 border-slate-300/80 shadow-xs"
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab("students")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "students"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                : theme === "dark"
                ? "text-slate-400 hover:text-white"
                : "text-slate-700 hover:text-slate-950 hover:bg-white/80"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Étudiants inscrits</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px]">
                {pendingCount} en attente
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("single_add")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "single_add"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                : theme === "dark"
                ? "text-slate-400 hover:text-white"
                : "text-slate-700 hover:text-slate-950 hover:bg-white/80"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Insertion Rapide (TD Multi-corrigés / Séance)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("batch_add")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "batch_add"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                : theme === "dark"
                ? "text-slate-400 hover:text-white"
                : "text-slate-700 hover:text-slate-950 hover:bg-white/80"
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Importation Groupée de Chapitre (Batch)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("modules_mgmt")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "modules_mgmt"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                : theme === "dark"
                ? "text-slate-400 hover:text-white"
                : "text-slate-700 hover:text-slate-950 hover:bg-white/80"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Gérer Modules & Chapitres</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("supabase")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "supabase"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                : theme === "dark"
                ? "text-slate-400 hover:text-white"
                : "text-slate-700 hover:text-slate-950 hover:bg-white/80"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Guide Supabase & SQL</span>
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ONGLET 1 : GESTION DES ÉTUDIANTS (OPTION A)                         */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "students" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Statistiques en cartes */}
            {/* Statistiques en cartes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-xs">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
                  Total Inscrits
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white mt-1.5 block">
                  {students.length}
                </span>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 shadow-xs">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block uppercase tracking-wider">
                  En attente de validation
                </span>
                <span className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1.5 block">
                  {pendingCount}
                </span>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 shadow-xs">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block uppercase tracking-wider">
                  Comptes Actifs
                </span>
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1.5 block">
                  {activeCount}
                </span>
              </div>
              <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/80 dark:bg-red-500/10 border border-rose-200 dark:border-red-500/30 shadow-xs">
                <span className="text-xs font-bold text-rose-800 dark:text-red-300 block uppercase tracking-wider">
                  Comptes Suspendus
                </span>
                <span className="text-3xl font-black text-rose-600 dark:text-red-400 mt-1.5 block">
                  {suspendedCount}
                </span>
              </div>
            </div>

            {/* Barre de Filtre & Recherche */}
            <div className="p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Filtre Statut */}
                <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 text-xs font-bold">
                  {(["all", "pending", "active", "suspended"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        statusFilter === st
                          ? "bg-purple-600 text-white shadow-xs font-bold"
                          : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      }`}
                    >
                      {st === "all"
                        ? "Tous"
                        : st === "pending"
                        ? `En attente (${pendingCount})`
                        : st === "active"
                        ? `Actifs (${activeCount})`
                        : "Suspendus"}
                    </button>
                  ))}
                </div>

                {/* Filtre Offre */}
                <select
                  value={offerFilter}
                  onChange={(e) => setOfferFilter(e.target.value as "all" | StudentOffer)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white outline-hidden cursor-pointer focus:border-purple-500 shadow-2xs"
                >
                  <option value="all">Toutes les offres</option>
                  <option value="pc">⚛️ Physique-Chimie</option>
                  <option value="maths">📐 Mathématiques</option>
                  <option value="integral">🚀 Pack Intégral MP</option>
                </select>
              </div>

              <div className="flex items-center gap-2 flex-1 sm:max-w-xs">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Chercher un étudiant..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-purple-500 focus:bg-white outline-hidden shadow-2xs"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ajout Manuel</span>
                </button>
              </div>
            </div>

            {/* Liste des Étudiants */}
            {/* Liste des Étudiants */}
            <div className="space-y-3">
              {filteredStudents.map((std) => {
                const isPending = std.status === "pending";
                const isActive = std.status === "active";
                const isSuspended = std.status === "suspended";

                return (
                  <div
                    key={std.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs ${
                      isPending
                        ? "bg-amber-50/70 border-amber-300/80 hover:border-amber-400 dark:bg-amber-950/20 dark:border-amber-500/40 dark:hover:border-amber-500/60"
                        : isActive
                        ? "bg-white border-slate-200/90 hover:border-purple-300 dark:bg-white/[0.02] dark:border-white/10 dark:hover:border-purple-500/30"
                        : "bg-rose-50/50 border-rose-200/80 dark:bg-red-950/15 dark:border-red-500/30 opacity-75"
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-2xs ${
                          isPending
                            ? "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40"
                            : isActive
                            ? "bg-purple-100 text-purple-800 border border-purple-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40"
                            : "bg-rose-100 text-rose-800 border border-rose-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/40"
                        }`}
                      >
                        {std.fullName.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{std.fullName}</h4>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                              isPending
                                ? "bg-amber-100 text-amber-800 border border-amber-300/80 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30"
                                : isActive
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300/80 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30"
                                : "bg-rose-100 text-rose-800 border border-rose-300/80 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30"
                            }`}
                          >
                            {isPending
                              ? "⏳ En attente"
                              : isActive
                              ? "✓ Actif"
                              : "✕ Suspendu"}
                          </span>

                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30">
                            {std.offer === "pc"
                              ? "⚛️ Offre PC"
                              : std.offer === "maths"
                              ? "📐 Offre Maths"
                              : "🚀 Pack Intégral"}
                          </span>
                        </div>

                        <div className="flex items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400 mt-1.5 flex-wrap font-medium">
                          <span>📧 {std.email}</span>
                          <span>📱 {std.phone}</span>
                          <span>🎓 Filière {std.filiere}</span>
                          <span>🏛️ {std.center}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions sur l'étudiant */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap pt-2 md:pt-0">
                      {/* Bouton WhatsApp direct pour contacter l'étudiant */}
                      <a
                        href={`https://wa.me/${std.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Bonjour ${std.fullName}, ici ${currentUser?.fullName || "votre professeur"} de Prépasciences CPGE.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                        title="Ouvrir WhatsApp avec cet étudiant"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      {/* Action Option A : Valider l'accès en 1 clic */}
                      {isPending && (
                        <button
                          type="button"
                          onClick={() => handleApprove(std)}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-black flex items-center gap-1.5 shadow-sm shadow-emerald-600/30 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Valider l&apos;accès</span>
                        </button>
                      )}

                      {/* Suspendre / Réactiver */}
                      {isActive && (
                        <button
                          type="button"
                          onClick={() => handleSuspend(std)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Suspendre
                        </button>
                      )}

                      {isSuspended && (
                        <button
                          type="button"
                          onClick={() => handleApprove(std)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 dark:text-emerald-300 dark:border-emerald-500/40 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Réactiver
                        </button>
                      )}

                      {/* Supprimer définitivement */}
                      <button
                        type="button"
                        onClick={() => handleDelete(std)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Supprimer cet étudiant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredStudents.length === 0 && (
                <div className="p-10 text-center rounded-2xl border border-dashed border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400 text-xs bg-white dark:bg-transparent">
                  Aucun étudiant ne correspond aux critères de recherche.
                </div>
              )}
            </div>

            {/* Modal Ajout Manuel d'un Étudiant */}
            {showAddStudentModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
                <div className="w-full max-w-lg bg-white dark:bg-[#0c1224] border border-slate-200 dark:border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Inscrire un étudiant manuellement
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddStudentModal(false)}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleManualAddStudent} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ex: Omar TAZI"
                        value={manualName}
                        onChange={(e) => setManualName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="etudiant@cpge.ma"
                          value={manualEmail}
                          onChange={(e) => setManualEmail(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Téléphone WhatsApp
                        </label>
                        <input
                          type="tel"
                          placeholder="+212 6..."
                          value={manualPhone}
                          onChange={(e) => setManualPhone(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Filière
                        </label>
                        <select
                          value={manualFiliere}
                          onChange={(e) => setManualFiliere(e.target.value as "MP" | "MP*" | "TSI" | "Autre")}
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-purple-600 focus:bg-white"
                        >
                          <option value="MP*">MP*</option>
                          <option value="MP">MP</option>
                          <option value="TSI">TSI</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Offre
                        </label>
                        <select
                          value={manualOffer}
                          onChange={(e) => setManualOffer(e.target.value as StudentOffer)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-purple-600 focus:bg-white"
                        >
                          <option value="pc">Physique-Chimie</option>
                          <option value="maths">Mathématiques</option>
                          <option value="integral">Pack Intégral</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Lycée / Centre CPGE
                      </label>
                      <input
                        type="text"
                        placeholder="ex: Moulay Abdellah Safi"
                        value={manualCenter}
                        onChange={(e) => setManualCenter(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600 focus:bg-white"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddStudentModal(false)}
                        className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 text-xs font-black rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow-sm"
                      >
                        Inscrire & Activer
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ONGLET 2 : INSERTION UNITAIRE (TD MULTI-CORRIGÉS, SÉANCE, FICHE)    */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "single_add" && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Ajout d&apos;une ressource à un chapitre existant
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Donnez simplement le lien Google Drive du document (ou YouTube). Il sera immédiatement accessible aux étudiants.
                </p>
              </div>

              {/* Sélection Module & Chapitre */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                    Module cible
                  </label>
                  <select
                    value={selectedModuleId}
                    onChange={(e) => handleModuleSelect(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-hidden cursor-pointer focus:border-purple-600 focus:bg-white shadow-2xs"
                  >
                    {courses.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.icon} {m.titre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                    Chapitre
                  </label>
                  <select
                    value={selectedChapterId}
                    onChange={(e) => setSelectedChapterId(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-hidden cursor-pointer focus:border-purple-600 focus:bg-white shadow-2xs"
                  >
                    {currentModule?.chapitres.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        Ch {ch.num} : {ch.titre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Choix du type de ressource */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                  Type de document à ajouter
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSingleType("td")}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      singleType === "td"
                        ? "bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-600/30"
                        : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
                    }`}
                  >
                    <FileText className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-bold block">TD & Exercices</span>
                    <span className="text-[10px] opacity-75 font-mono">Multi-corrigés</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSingleType("session")}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      singleType === "session"
                        ? "bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-600/30"
                        : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
                    }`}
                  >
                    <PlayCircle className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-bold block">Séance de cours</span>
                    <span className="text-[10px] opacity-75 font-mono">Support & Replay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSingleType("fiche")}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      singleType === "fiche"
                        ? "bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-600/30"
                        : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
                    }`}
                  >
                    <Layers className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-xs font-bold block">Fiche Synthèse</span>
                    <span className="text-[10px] opacity-75 font-mono">Formulaire Drive</span>
                  </button>
                </div>
              </div>

              {/* SOUS-FORMULAIRE : TD avec MULTI-CORRIGÉS */}
              {singleType === "td" && (
                <form onSubmit={handleSubmitExercise} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Titre du TD / Exercice *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: TD 03 — Induction dans un conducteur en mouvement"
                      value={tdTitle}
                      onChange={(e) => setTdTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600 focus:bg-white shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Sous-titre / Concours ciblé
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Écrit Mines-Ponts MP / Centrale-Supélec"
                      value={tdSous}
                      onChange={(e) => setTdSous(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600 focus:bg-white shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Lien Google Drive de l&apos;Énoncé (PDF)
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/.../view"
                      value={tdEnonceUrl}
                      onChange={(e) => setTdEnonceUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600 focus:bg-white shadow-2xs"
                    />
                  </div>

                  {/* SECTION MULTI-CORRIGÉS DYNAMIQUE */}
                  <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-purple-900 dark:text-purple-300 flex items-center gap-1.5 uppercase font-mono">
                        <FileText className="w-3.5 h-3.5" />
                        Corrigés du TD (Multi-méthodes possibles)
                      </span>
                      <button
                        type="button"
                        onClick={handleAddCorrigeRow}
                        className="text-[11px] font-bold text-purple-700 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                      >
                        + Ajouter un autre corrigé
                      </button>
                    </div>

                    {tdCorriges.map((corr, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-purple-200/80 dark:border-white/10 space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            placeholder="Titre du corrigé (ex: Corrigé 1 : Méthode énergétique)"
                            value={corr.titre}
                            onChange={(e) => handleUpdateCorrigeRow(idx, "titre", e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600"
                          />
                          {tdCorriges.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCorrigeRow(idx)}
                              className="p-1 text-slate-400 hover:text-rose-600"
                              title="Retirer ce corrigé"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            placeholder="Lien Drive du corrigé PDF ou lien vidéo"
                            value={corr.url}
                            onChange={(e) => handleUpdateCorrigeRow(idx, "url", e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600"
                          />
                          <select
                            value={corr.type}
                            onChange={(e) => handleUpdateCorrigeRow(idx, "type", e.target.value as "pdf" | "video")}
                            className="px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-lg text-slate-900 dark:text-slate-300 outline-hidden"
                          >
                            <option value="pdf">PDF</option>
                            <option value="video">Vidéo</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Lien Vidéo de résolution (optionnel — YouTube ou Drive)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={tdVideoUrl}
                      onChange={(e) => setTdVideoUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600 focus:bg-white shadow-2xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-black text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 cursor-pointer active:scale-98 transition-all"
                  >
                    Publier ce TD dans le chapitre
                  </button>
                </form>
              )}

              {/* SOUS-FORMULAIRE : SÉANCE DE COURS */}
              {singleType === "session" && (
                <form onSubmit={handleSubmitSession} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Titre de la Séance *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Séance 04 — Théorème de Gauss & Potentiel électrostatique"
                      value={sessionTitle}
                      onChange={(e) => setSessionTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600 focus:bg-white shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Sous-titre
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Théorie, démonstrations et calculs de champs"
                      value={sessionSous}
                      onChange={(e) => setSessionSous(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600 focus:bg-white shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Lien Google Drive du Support de cours (PDF)
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/.../view"
                      value={sessionSupportUrl}
                      onChange={(e) => setSessionSupportUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600 focus:bg-white shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Lien Vidéo (YouTube ou Google Drive)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={sessionVideoUrl}
                      onChange={(e) => setSessionVideoUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600 focus:bg-white shadow-2xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-black text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 cursor-pointer active:scale-98 transition-all"
                  >
                    Publier cette Séance
                  </button>
                </form>
              )}

              {/* SOUS-FORMULAIRE : FICHE SYNTHÈSE */}
              {singleType === "fiche" && (
                <form onSubmit={handleSubmitFiche} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Titre de la Fiche de Synthèse *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Formulaire & Réflexes — Équations de Maxwell"
                      value={ficheTitle}
                      onChange={(e) => setFicheTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600 focus:bg-white shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Sous-titre
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Synthèse des relations de passage et bilans énergétiques"
                      value={ficheSous}
                      onChange={(e) => setFicheSous(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600 focus:bg-white shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Lien Google Drive du document PDF *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/file/d/.../view"
                      value={ficheDriveUrl}
                      onChange={(e) => setFicheDriveUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600 focus:bg-white shadow-2xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-black text-xs bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 cursor-pointer active:scale-98 transition-all"
                  >
                    Publier cette Fiche
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ONGLET 3 : IMPORTATION GROUPÉE DE CHAPITRE (BATCH DRIVE UPLOAD)     */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "batch_add" && (
          <div className="space-y-6 animate-fadeIn">
            <form onSubmit={handleSubmitBatch} className="space-y-6">
              {/* En-tête Chapitre */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      Créer un Chapitre Entier avec tous ses Documents Drive
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Insérez en une seule fois le cours, les séries de TD (avec énoncés et multi-corrigés) et la fiche de synthèse.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handlePresetFullChapter}
                    className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 dark:bg-purple-500/15 dark:hover:bg-purple-500/25 dark:border-purple-500/40 dark:text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Pré-remplir avec un modèle type</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Module
                    </label>
                    <select
                      value={batchModuleId}
                      onChange={(e) => setBatchModuleId(e.target.value)}
                      className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-hidden cursor-pointer focus:border-purple-600 focus:bg-white shadow-2xs"
                    >
                      {courses.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.icon} {m.titre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      N° du Chapitre
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={batchChapterNum}
                      onChange={(e) => setBatchChapterNum(Number(e.target.value))}
                      className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-purple-600 focus:bg-white shadow-2xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Titre du Chapitre *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Ondes Électromagnétiques & Énergie"
                      value={batchChapterTitle}
                      onChange={(e) => setBatchChapterTitle(e.target.value)}
                      className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-purple-600 focus:bg-white shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Description du syllabus
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Équations de d'Alembert, vecteur de Poynting, réflexion sous incidence normale..."
                      value={batchChapterDesc}
                      onChange={(e) => setBatchChapterDesc(e.target.value)}
                      className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-purple-600 focus:bg-white shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Badge / Niveau
                    </label>
                    <input
                      type="text"
                      value={batchBadge}
                      onChange={(e) => setBatchBadge(e.target.value)}
                      className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-purple-600 focus:bg-white shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Liste des Documents à inclure */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Documents Drive & Vidéos du Chapitre</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 text-xs font-mono font-bold">
                      {batchDocs.length} fichiers
                    </span>
                  </h4>

                  <button
                    type="button"
                    onClick={handleAddBatchDoc}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Ajouter une ligne de document</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {batchDocs.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                          <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </span>
                          <select
                            value={doc.type}
                            onChange={(e) => handleUpdateBatchDoc(idx, "type", e.target.value)}
                            className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-purple-950/70 border border-slate-300 dark:border-purple-500/40 text-slate-900 dark:text-purple-300 outline-hidden"
                          >
                            <option value="session">🎥 Séance de Cours</option>
                            <option value="td">📝 TD / Exercice (Multi-corrigés)</option>
                            <option value="fiche">📑 Fiche Synthèse</option>
                          </select>
                          <input
                            type="text"
                            required
                            placeholder="Titre du document..."
                            value={doc.titre}
                            onChange={(e) => handleUpdateBatchDoc(idx, "titre", e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveBatchDoc(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Supprimer cette ligne"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Liens Drive selon le type */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            {doc.type === "td" ? "Lien Drive Énoncé (PDF)" : "Lien Drive Support (PDF)"}
                          </label>
                          <input
                            type="url"
                            placeholder="https://drive.google.com/file/d/..."
                            value={doc.driveSupportUrl || ""}
                            onChange={(e) => handleUpdateBatchDoc(idx, "driveSupportUrl", e.target.value)}
                            className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600"
                          />
                        </div>

                        {doc.type === "session" && (
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Lien Vidéo Replay (YouTube ou Drive)
                            </label>
                            <input
                              type="url"
                              placeholder="https://www.youtube.com/watch?v=..."
                              value={doc.videoUrl || ""}
                              onChange={(e) => handleUpdateBatchDoc(idx, "videoUrl", e.target.value)}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600"
                            />
                          </div>
                        )}

                        {doc.type === "td" && (
                          <div>
                            <label className="block text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                              Lien Drive Corrigé 1 (Officiel)
                            </label>
                            <input
                              type="url"
                              placeholder="https://drive.google.com/file/d/..."
                              value={doc.driveCorrigeUrl1 || ""}
                              onChange={(e) => handleUpdateBatchDoc(idx, "driveCorrigeUrl1", e.target.value)}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-500/30 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600"
                            />
                          </div>
                        )}
                      </div>

                      {/* Si TD : Corrigé 2 facultatif (Deuxième méthode) */}
                      {doc.type === "td" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-200 dark:border-white/5">
                          <div>
                            <label className="block text-[11px] font-semibold text-purple-700 dark:text-purple-300 mb-1">
                              Lien Drive Corrigé 2 (Méthode alternative - optionnel)
                            </label>
                            <input
                              type="url"
                              placeholder="https://drive.google.com/file/d/..."
                              value={doc.driveCorrigeUrl2 || ""}
                              onChange={(e) => handleUpdateBatchDoc(idx, "driveCorrigeUrl2", e.target.value)}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-500/30 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                              Lien Vidéo de résolution (optionnel)
                            </label>
                            <input
                              type="url"
                              placeholder="https://www.youtube.com/watch?v=..."
                              value={doc.videoUrl || ""}
                              onChange={(e) => handleUpdateBatchDoc(idx, "videoUrl", e.target.value)}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Tous les documents seront organisés automatiquement dans le syllabus de l&apos;étudiant.
                  </span>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl font-black text-xs bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white shadow-lg shadow-purple-600/30 cursor-pointer active:scale-98 transition-all flex items-center gap-2"
                  >
                    <FolderPlus className="w-4 h-4" />
                    <span>Créer et Publier Tout le Chapitre</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ONGLET 4 : GESTION DES MODULES ET SOUS-CHAPITRES                    */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "modules_mgmt" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header de l'onglet */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <span>Organisation des Modules & Sous-Chapitres</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Créez de nouveaux modules, rectifiez les titres ou icônes, et organisez vos sous-chapitres en toute liberté.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateModModal(true)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-lg shadow-purple-950/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Créer un Nouveau Module</span>
              </button>
            </div>

            {/* Liste des Modules avec leurs Sous-Chapitres */}
            <div className="space-y-6">
              {courses.map((mod) => (
                <div
                  key={mod.id}
                  className="rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 overflow-hidden shadow-xs"
                >
                  {/* Header du module */}
                  <div className="p-5 sm:p-6 bg-slate-50/80 dark:bg-white/[0.03] border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                        {mod.icon || "📚"}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                            {mod.titre}
                          </h4>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                            {mod.chapitres.length} sous-chapitre{mod.chapitres.length > 1 ? "s" : ""}
                          </span>
                        </div>
                        {mod.description && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                            {mod.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTargetModForNewChap(mod.id);
                          setNewChapNum(mod.chapitres.length + 1);
                          setNewChapTitle("");
                          setNewChapDesc("");
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-600/10 hover:bg-purple-600/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>+ Sous-chapitre</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setEditingMod({
                            id: mod.id,
                            titre: mod.titre,
                            icon: mod.icon || "📚",
                            description: mod.description || "",
                          })
                        }
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Rectifier le module"
                      >
                        <span>✏️ Rectifier</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteModule(mod.id, mod.titre)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Supprimer ce module"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Formulaire d'ajout rapide de sous-chapitre (si ce module est ciblé) */}
                  {targetModForNewChap === mod.id && (
                    <div className="p-5 bg-purple-50/80 dark:bg-purple-950/30 border-b border-purple-200 dark:border-purple-500/30 animate-fadeIn">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-purple-900 dark:text-purple-300">
                          Nouveau sous-chapitre dans {mod.titre}
                        </span>
                        <button
                          type="button"
                          onClick={() => setTargetModForNewChap("")}
                          className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                          ✕ Annuler
                        </button>
                      </div>

                      <form onSubmit={handleCreateChapter} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                        <div className="sm:col-span-1">
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Numéro
                          </label>
                          <input
                            type="number"
                            value={newChapNum}
                            onChange={(e) => setNewChapNum(Number(e.target.value))}
                            className="w-full px-2.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white outline-hidden focus:border-purple-600 shadow-2xs"
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Titre du sous-chapitre *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="ex: Dipôles et développements multipolaires"
                            value={newChapTitle}
                            onChange={(e) => setNewChapTitle(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600 shadow-2xs"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            placeholder="ex: Calculs de potentiels"
                            value={newChapDesc}
                            onChange={(e) => setNewChapDesc(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden focus:border-purple-600 shadow-2xs"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Badge
                          </label>
                          <input
                            type="text"
                            placeholder="Spé MP / MP*"
                            value={newChapBadge}
                            onChange={(e) => setNewChapBadge(e.target.value)}
                            className="w-full px-2.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white outline-hidden focus:border-purple-600 shadow-2xs"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <button
                            type="submit"
                            className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-xs cursor-pointer"
                          >
                            Ajouter
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Liste des sous-chapitres */}
                  <div className="p-4 sm:p-6 space-y-3">
                    {mod.chapitres.length > 0 ? (
                      mod.chapitres.map((ch) => (
                        <div
                          key={ch.id}
                          className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 hover:border-purple-300 dark:hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className="w-8 h-8 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 dark:border-purple-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                              {ch.num}
                            </span>
                            <div className="min-w-0 flex-1">
                              <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {ch.titre}
                              </h5>
                              {ch.description && (
                                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                  {ch.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span className="text-[10px] text-blue-600 dark:text-blue-300 font-semibold">
                                  📘 {(ch.cours || []).length} séance{(ch.cours || []).length > 1 ? "s" : ""}
                                </span>
                                <span className="text-slate-400">·</span>
                                <span className="text-[10px] text-amber-600 dark:text-amber-300 font-semibold">
                                  📑 {(ch.fiches || []).length} fiche{(ch.fiches || []).length > 1 ? "s" : ""}
                                </span>
                                <span className="text-slate-400">·</span>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-300 font-semibold">
                                  ✍️ {(ch.tds || []).length} TD{(ch.tds || []).length > 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() =>
                                setEditingChap({
                                  moduleId: mod.id,
                                  chapterId: ch.id,
                                  num: ch.num,
                                  titre: ch.titre,
                                  description: ch.description || "",
                                  badge: ch.badge || "Spé MP / MP*",
                                })
                              }
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-200/80 hover:bg-slate-300/80 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
                            >
                              ✏️ Modifier
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteChapter(mod.id, ch.id, ch.titre)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                              title="Supprimer ce chapitre"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                        Ce module ne contient pas encore de sous-chapitres.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ONGLET 5 : GUIDE SUPABASE & SQL                                    */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {activeTab === "supabase" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Connexion Supabase PostgreSQL
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Votre compte Supabase existant peut être connecté directement en 2 étapes rapides.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 space-y-2">
                  <span className="font-bold text-purple-700 dark:text-purple-300 block">Étape 1 : Exécuter le SQL</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Dans votre console Supabase (SQL Editor), collez et exécutez le script ci-dessous pour créer les tables de profils, chapitres, TDs et multi-corrigés.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 space-y-2">
                  <span className="font-bold text-cyan-700 dark:text-cyan-300 block">Étape 2 : Variables d&apos;environnement</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Ajoutez vos clés dans votre fichier <code className="text-slate-900 dark:text-white bg-slate-200/80 dark:bg-slate-800 px-1 rounded">.env.local</code> :
                  </p>
                  <pre className="p-2 rounded bg-slate-950 font-mono text-[10px] text-cyan-300 overflow-x-auto">
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co&#10;NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
                  </pre>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    supabase_schema.sql
                  </span>
                  <button
                    type="button"
                    onClick={copySqlToClipboard}
                    className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? "Copié !" : "Copier le code SQL"}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 dark:border-white/10 font-mono text-xs text-slate-200 max-h-96 overflow-y-auto leading-relaxed shadow-xs">
                  {sqlCode}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-white/10 text-center text-xs text-slate-500 font-mono">
        Dashboard Enseignant Prépasciences © 2026 · Pr. Hassan EDDAMS & Pr. Anass KHADIR
      </footer>

      {/* MODAL CRÉER UN MODULE */}
      {showCreateModModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Créer un Nouveau Module
              </h3>
              <button onClick={() => setShowCreateModModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateModule} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Icône Émoticône / Emoji
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-600/20 border border-purple-200 dark:border-purple-500/40 text-2xl flex items-center justify-center shrink-0">
                    {newModIcon || "📚"}
                  </span>
                  <input
                    type="text"
                    value={newModIcon}
                    onChange={(e) => setNewModIcon(e.target.value)}
                    placeholder="Emoji"
                    className="w-20 px-3 py-2 text-center text-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-mono outline-hidden focus:border-purple-600"
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Cliquez sur un émoticône ou collez le vôtre.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 flex items-center gap-1.5 flex-wrap max-h-28 overflow-y-auto">
                  {["⚡", "🔥", "🌊", "🌈", "🧪", "⚛️", "💡", "📐", "🔬", "🧲", "📊", "🚀", "🎯", "💻", "📈", "📚", "⚙️", "🌟", "📝", "🎓", "🔭", "📡", "🪐", "🗂️"].map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setNewModIcon(emoji)}
                      className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all cursor-pointer ${
                        newModIcon === emoji
                          ? "bg-purple-600 text-white scale-110 shadow-md shadow-purple-600/40"
                          : "bg-white hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre du Module *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Mécanique Quantique"
                  value={newModTitre}
                  onChange={(e) => setNewModTitre(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description du Module
                </label>
                <textarea
                  rows={2}
                  placeholder="ex: Notions fondamentales, puits de potentiel, oscillateur harmonique"
                  value={newModDesc}
                  onChange={(e) => setNewModDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-purple-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow-xs"
                >
                  Créer le Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MODIFIER UN MODULE */}
      {editingMod && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Rectifier le Module & son Émoticône
              </h3>
              <button onClick={() => setEditingMod(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateModule} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Icône Émoticône / Emoji
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-600/20 border border-purple-200 dark:border-purple-500/40 text-2xl flex items-center justify-center shrink-0">
                    {editingMod.icon || "📚"}
                  </span>
                  <input
                    type="text"
                    value={editingMod.icon}
                    onChange={(e) => setEditingMod({ ...editingMod, icon: e.target.value })}
                    placeholder="Emoji"
                    className="w-20 px-3 py-2 text-center text-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-mono outline-hidden focus:border-purple-600"
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Cliquez sur un émoticône ci-dessous.
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 flex items-center gap-1.5 flex-wrap max-h-28 overflow-y-auto">
                  {["⚡", "🔥", "🌊", "🌈", "🧪", "⚛️", "💡", "📐", "🔬", "🧲", "📊", "🚀", "🎯", "💻", "📈", "📚", "⚙️", "🌟", "📝", "🎓", "🔭", "📡", "🪐", "🗂️"].map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setEditingMod({ ...editingMod, icon: emoji })}
                      className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all cursor-pointer ${
                        editingMod.icon === emoji
                          ? "bg-purple-600 text-white scale-110 shadow-md shadow-purple-600/40"
                          : "bg-white hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre du Module *
                </label>
                <input
                  type="text"
                  required
                  value={editingMod.titre}
                  onChange={(e) => setEditingMod({ ...editingMod, titre: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingMod.description}
                  onChange={(e) => setEditingMod({ ...editingMod, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-purple-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingMod(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow-xs"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MODIFIER UN SOUS-CHAPITRE */}
      {editingChap && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/15 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Rectifier le Sous-Chapitre
              </h3>
              <button onClick={() => setEditingChap(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateChapter} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Numéro d&apos;ordre
                </label>
                <input
                  type="number"
                  value={editingChap.num}
                  onChange={(e) => setEditingChap({ ...editingChap, num: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Titre du Chapitre *
                </label>
                <input
                  type="text"
                  required
                  value={editingChap.titre}
                  onChange={(e) => setEditingChap({ ...editingChap, titre: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingChap.description}
                  onChange={(e) => setEditingChap({ ...editingChap, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Badge filière
                </label>
                <input
                  type="text"
                  value={editingChap.badge}
                  onChange={(e) => setEditingChap({ ...editingChap, badge: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-white/10 rounded-xl text-slate-900 dark:text-white outline-hidden focus:border-purple-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingChap(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white cursor-pointer shadow-xs"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
