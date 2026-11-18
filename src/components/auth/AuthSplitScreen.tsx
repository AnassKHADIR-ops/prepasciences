"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { StudentOffer } from "@/types/auth";
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  Zap,
  PlayCircle,
  Trophy,
  KeyRound,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

interface AuthSplitScreenProps {
  initialMode?: "login" | "register" | "forgot";
}

export function AuthSplitScreen({ initialMode = "login" }: AuthSplitScreenProps) {
  const router = useRouter();
  const { login, registerUser, requestPasswordResetCode, confirmPasswordReset } = useAuth();

  const [mode, setMode] = useState<"login" | "register" | "forgot">(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [offer, setOffer] = useState<StudentOffer>("maths");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // État spécifique pour l'étudiant en attente d'approbation rencontré lors de la connexion
  const [pendingStudentInfo, setPendingStudentInfo] = useState<{
    name: string;
    email: string;
  } | null>(null);

  // États spécifiques pour la réinitialisation de mot de passe par validation WhatsApp
  const [resetCode, setResetCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetStep, setResetStep] = useState<1 | 2>(1);

  const handleModeSwitch = (newMode: "login" | "register" | "forgot") => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setPendingStudentInfo(null);
    if (newMode === "forgot") {
      setResetStep(1);
      setGeneratedCode(null);
    }
  };

  // Soumission Connexion / Inscription
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setPendingStudentInfo(null);
    setIsLoading(true);

    try {
      if (mode === "login") {
        if (!email.trim() || !password) {
          setErrorMessage("Veuillez renseigner votre email et mot de passe.");
          setIsLoading(false);
          return;
        }

        const res = login(email.trim(), password);

        if (res.success && res.user) {
          setSuccessMessage("Connexion réussie ! Redirection en cours...");
          const userEmail = res.user.email.toLowerCase();
          const isProfOrAdmin =
            res.user.role === "admin" ||
            res.user.role === "teacher" ||
            userEmail === "anass.khadir@usmba.ac.ma" ||
            userEmail === "khadir@prepasciences.ma" ||
            userEmail === "eddams@prepasciences.ma";

          setTimeout(() => {
            if (isProfOrAdmin) {
              router.push("/dashboard-prof");
            } else {
              router.push("/eddams");
            }
          }, 350);
        } else {
          setErrorMessage(res.error || "Email ou mot de passe incorrect.");
          if (res.user && res.user.status === "pending") {
            setPendingStudentInfo({
              name: res.user.fullName,
              email: res.user.email,
            });
          }
          setIsLoading(false);
        }
      } else if (mode === "register") {
        // Mode Inscription
        if (!fullName.trim() || !email.trim() || !password) {
          setErrorMessage("Veuillez renseigner votre nom, email et mot de passe.");
          setIsLoading(false);
          return;
        }

        if (password.length < 4) {
          setErrorMessage("Le mot de passe doit comporter au moins 4 caractères.");
          setIsLoading(false);
          return;
        }

        const cleanPhone = phone.trim() || "+212600000000";

        const res = registerUser({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: cleanPhone,
          password: password,
          offer: offer,
          center: "CPGE Maroc",
          filiere: "MP*",
        });

        if (res.success && res.user) {
          const userEmail = res.user.email.toLowerCase();
          const isProfOrAdmin =
            res.user.role === "admin" ||
            res.user.role === "teacher" ||
            userEmail === "anass.khadir@usmba.ac.ma" ||
            userEmail === "khadir@prepasciences.ma" ||
            userEmail === "eddams@prepasciences.ma";

          if (isProfOrAdmin) {
            setSuccessMessage("Compte administrateur actif ! Redirection...");
            setTimeout(() => router.push("/dashboard-prof"), 400);
          } else {
            setSuccessMessage(
              "Compte créé avec succès ! Votre demande d'accès a été transmise aux professeurs pour validation."
            );
            setPendingStudentInfo({
              name: res.user.fullName,
              email: res.user.email,
            });
            setIsLoading(false);
          }
        } else {
          setErrorMessage(res.error || "Une erreur est survenue lors de l'inscription.");
          setIsLoading(false);
        }
      }
    } catch {
      setErrorMessage("Une erreur imprévue est survenue. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  // Demande d'un code de réinitialisation sécurisé WhatsApp (Étape 1 Mot de passe oublié)
  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage("Veuillez renseigner votre adresse e-mail.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestPasswordResetCode(email.trim());
      setIsLoading(false);
      if (res.success && res.code) {
        setGeneratedCode(res.code);
        setResetStep(2);
        setSuccessMessage(
          `Code de sécurité généré avec succès (${res.code}). Envoyez-le à votre professeur via WhatsApp pour validation rapide.`
        );
      } else {
        setErrorMessage(res.error || "Impossible de générer le code pour cette adresse.");
      }
    } catch {
      setIsLoading(false);
      setErrorMessage("Erreur technique lors de la génération du code.");
    }
  };

  // Soumission du nouveau mot de passe avec le code à 6 chiffres (Étape 2 Mot de passe oublié)
  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!resetCode.trim()) {
      setErrorMessage("Veuillez renseigner le code de sécurité reçu ou affiché.");
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setErrorMessage("Le nouveau mot de passe doit comporter au moins 4 caractères.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await confirmPasswordReset(email.trim(), resetCode.trim(), newPassword);
      setIsLoading(false);

      if (res.success) {
        setSuccessMessage("Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.");
        setPassword(newPassword);
        setTimeout(() => {
          setMode("login");
        }, 1200);
      } else {
        setErrorMessage(res.error || "Code incorrect ou expiré.");
      }
    } catch {
      setIsLoading(false);
      setErrorMessage("Erreur lors de la validation du nouveau mot de passe.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050B1D] text-white flex flex-col lg:flex-row overflow-x-hidden font-sans selection:bg-[#18C7F3] selection:text-[#050B1D]">
      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* GAUCHE : PANNEAU IMMERSIF ET INSPIRANT — SCIENCES CPGE */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen flex-col justify-between p-8 xl:p-12 overflow-hidden border-r border-white/10 bg-[#08142b]">
        {/* Photographie esthétique de laboratoire et salle d'étude scientifique */}
        <div className="absolute inset-0">
          <Image
            src="/auth-physics-lab.jpg"
            alt="Laboratoire et Salle d'étude Sciences Physiques et Mathématiques CPGE"
            fill
            sizes="(max-width: 1024px) 0vw, 50vw"
            priority
            className="object-cover object-center scale-105 filter brightness-90 contrast-105"
          />
          {/* Overlays atmosphériques feutrés */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B1D] via-[#050B1D]/75 to-[#050B1D]/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B1D]/90 via-[#050B1D]/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(24,199,243,0.18),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.14),transparent_55%)]" />
        </div>

        {/* ── Haut : Badge étincelle & Monogramme ── */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold tracking-wide backdrop-blur-md shadow-[0_0_20px_rgba(24,199,243,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Portail E-learning CPGE</span>
            </div>

            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
              Maths & Physique-Chimie
            </span>
          </div>

          {/* Logo / Monogramme Hexagonal */}
          <div className="flex items-center gap-3.5 pt-2">
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_14px_rgba(24,199,243,0.5)]">
                <defs>
                  <linearGradient id="eddamsHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#18C7F3" />
                    <stop offset="50%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
                <polygon
                  points="50,5 93,27 93,73 50,95 7,73 7,27"
                  fill="#08142b"
                  stroke="url(#eddamsHexGrad)"
                  strokeWidth="3.5"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-gradient-to-br from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent font-mono font-black text-xl tracking-tighter">
                  P
                </span>
              </div>
            </div>

            <div>
              <div className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Prépasciences</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Excellence CPGE
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Pr. Anass KHADIR · Pr. Hassan EDDAMS
              </p>
            </div>
          </div>
        </div>

        {/* ── Milieu : Titre principal & Cartes statistiques ── */}
        <div className="relative z-10 my-auto py-8 space-y-6">
          <div className="space-y-3.5 max-w-xl">
            <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-black text-white tracking-tight leading-[1.12]">
              L&apos;Excellence en{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
                Maths & Physique
              </span>
            </h1>
            <p className="text-xs xl:text-sm text-slate-300/90 leading-relaxed font-normal">
              Polycopiés complets, cours magistraux, résolution filmée d&apos;annales de concours et fiches synthétiques pour intégrer les plus grandes écoles d&apos;ingénieurs.
            </p>
          </div>

          {/* 3 Cartes de Statistiques */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-xl">
            <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:border-cyan-400/40 transition-all duration-300 group shadow-lg shadow-black/40">
              <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                  Validation
                </span>
              </div>
              <div className="text-lg xl:text-xl font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                DIRECTE
              </div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 mt-0.5">
                PAR LES PROFS
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:border-purple-400/40 transition-all duration-300 group shadow-lg shadow-black/40">
              <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                <PlayCircle className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                  Vidéos
                </span>
              </div>
              <div className="text-lg xl:text-xl font-black text-white tracking-tight group-hover:text-purple-300 transition-colors">
                HD & 4K
              </div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400 mt-0.5">
                RÉSOLUTIONS
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:border-emerald-400/40 transition-all duration-300 group shadow-lg shadow-black/40">
              <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                <Trophy className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                  Concours
                </span>
              </div>
              <div className="text-lg xl:text-xl font-black text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                CNC / MP
              </div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 mt-0.5">
                RÉSULTATS A+
              </div>
            </div>
          </div>
        </div>

        {/* ── Bas : Mentions Concours ── */}
        <div className="relative z-10 pt-4 border-t border-white/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-300 backdrop-blur-md">
            <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-semibold">
              Préparation ciblée :{" "}
              <strong className="text-cyan-300 font-bold">CNC, CCINP, Mines-Ponts, Centrale-Supélec, X-ENS.</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* DROITE : FORMULAIRE D'ACCÈS, INSCRIPTION & RÉCUPÉRATION */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <div className="relative flex-1 min-h-screen flex flex-col justify-between bg-[#070c1d] p-4 sm:p-8 xl:p-12 overflow-y-auto">
        {/* Halos cosmiques d'arrière-plan */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 right-1/4 w-[420px] h-[420px] rounded-full bg-purple-600/10 blur-[130px]" />
          <div className="absolute -bottom-24 left-1/4 w-[420px] h-[420px] rounded-full bg-cyan-500/10 blur-[130px]" />
        </div>

        {/* Header supérieur avec retour accueil */}
        <div className="relative z-10 flex items-center justify-between w-full max-w-md mx-auto mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-1 px-2.5 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l&apos;accueil</span>
          </Link>

          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-cyan-400/90 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Accès Protégé CPGE</span>
          </div>
        </div>

        {/* Conteneur Formulaire */}
        <div className="relative z-10 w-full max-w-md mx-auto my-auto">
          <div className="bg-[#0b1228]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
            {/* Bascule fluide Connexion / Inscription (sauf en mode mot de passe oublié) */}
            {mode !== "forgot" ? (
              <div className="flex p-1 rounded-2xl bg-white/[0.04] border border-white/10 mb-6">
                <button
                  type="button"
                  onClick={() => handleModeSwitch("login")}
                  className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    mode === "login"
                      ? "bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md shadow-cyan-950/60"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Se connecter</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeSwitch("register")}
                  className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    mode === "register"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/60"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Demander l&apos;accès</span>
                </button>
              </div>
            ) : (
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <button
                  type="button"
                  onClick={() => handleModeSwitch("login")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Retour à la connexion</span>
                </button>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                  Validation WhatsApp
                </span>
              </div>
            )}

            {/* Titre & Description du Formulaire */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {mode === "login"
                  ? "Connexion au Portail"
                  : mode === "register"
                  ? "Inscription & Demande d'Accès"
                  : "Récupération du Mot de Passe"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {mode === "login"
                  ? "Accédez à vos cours, séries TD et vidéos d'annales corrigées"
                  : mode === "register"
                  ? "Votre demande sera transmise en temps réel aux professeurs pour validation"
                  : "Validation sécurisée en 1 clic via WhatsApp avec vos professeurs"}
              </p>
            </div>

            {/* Message d'Erreur */}
            {errorMessage && (
              <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-xs mb-4 flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {/* Message de Succès */}
            {successMessage && (
              <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 text-xs mb-4 flex items-start gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <p className="leading-relaxed">{successMessage}</p>
              </div>
            )}

            {/* ALERTE SPÉCIALE ÉTUDIANT EN ATTENTE : BOUTONS WHATSAPP DIRECTS */}
            {pendingStudentInfo && (
              <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-xs mb-5 space-y-3 animate-fadeIn">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-300">
                      Compte en attente de validation
                    </p>
                    <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                      Bonjour <strong>{pendingStudentInfo.name}</strong>. Cliquez ci-dessous pour notifier directement votre professeur sur WhatsApp et accélérer l&apos;activation :
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {/* WhatsApp Pr. Khadir (Maths) */}
                  <a
                    href={`https://wa.me/212659041407?text=${encodeURIComponent(
                      `Bonjour Pr. Anass Khadir,\n\nJe suis l'étudiant(e) : ${pendingStudentInfo.name}\nEmail : ${pendingStudentInfo.email}\n\nJe me suis inscrit(e) sur la plateforme et mon compte est en attente d'approbation. Pourriez-vous s'il vous plaît valider mon accès aux cours ?\n\nMerci d'avance pour votre aide !`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Pr. Khadir</span>
                  </a>

                  {/* WhatsApp Pr. Eddams (Physique) */}
                  <a
                    href={`https://wa.me/212721729799?text=${encodeURIComponent(
                      `Bonjour Pr. Hassan Eddams,\n\nJe suis l'étudiant(e) : ${pendingStudentInfo.name}\nEmail : ${pendingStudentInfo.email}\n\nJe me suis inscrit(e) sur la plateforme et mon compte est en attente d'approbation. Pourriez-vous s'il vous plaît valider mon accès aux cours ?\n\nMerci d'avance pour votre aide !`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Pr. Eddams</span>
                  </a>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* FORMULAIRE 1 : CONNEXION & INSCRIPTION                       */}
            {/* ═══════════════════════════════════════════════════════════ */}
            {mode !== "forgot" ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* CHAMP 1 : NOM & PRÉNOM (mode inscription) */}
                {mode === "register" && (
                  <div className="animate-fadeIn">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      Nom & Prénom <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="ex: Mohamed anas elmerkhi"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-hidden transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* CHAMP 2 : ADRESSE E-MAIL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                    Adresse e-mail <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="anas.elmerkhi@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-hidden transition-all"
                    />
                  </div>
                </div>

                {/* CHAMP 2 bis : NUMÉRO WHATSAPP (mode inscription) */}
                {mode === "register" && (
                  <div className="animate-fadeIn">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                        Téléphone WhatsApp <span className="text-cyan-400">*</span>
                      </label>
                      <span className="text-[10px] text-cyan-400/80 font-mono">
                        Activation rapide
                      </span>
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+212 6 XX XX XX XX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-hidden transition-all font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* CHAMP 2 ter : CHOIX DE L'OFFRE / PÔLE (mode inscription) */}
                {mode === "register" && (
                  <div className="animate-fadeIn">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      Matière / Programme souhaité
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setOffer("maths")}
                        className={`py-2 px-2 text-center rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                          offer === "maths"
                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                            : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        📐 Maths (Khadir)
                      </button>
                      <button
                        type="button"
                        onClick={() => setOffer("pc")}
                        className={`py-2 px-2 text-center rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                          offer === "pc"
                            ? "bg-purple-500/20 border-purple-400 text-purple-200"
                            : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        ⚛️ Physique (Eddams)
                      </button>
                      <button
                        type="button"
                        onClick={() => setOffer("integral")}
                        className={`py-2 px-2 text-center rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                          offer === "integral"
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                            : "bg-white/[0.03] border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        🚀 Pack Intégral
                      </button>
                    </div>
                  </div>
                )}

                {/* CHAMP 3 : MOT DE PASSE */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                      Mot de passe <span className="text-cyan-400">*</span>
                    </label>

                    {/* LIEN MOT DE PASSE OUBLIÉ */}
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => handleModeSwitch("forgot")}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
                      >
                        Mot de passe oublié ?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-2.5 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-hidden transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-xl font-black text-xs transition-all shadow-lg active:scale-98 cursor-pointer mt-3 disabled:opacity-50 disabled:cursor-not-allowed ${
                    mode === "login"
                      ? "bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-500 hover:brightness-110 text-slate-950 shadow-cyan-950/60"
                      : "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:brightness-110 text-white shadow-purple-950/60"
                  }`}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Traitement en cours...</span>
                    </span>
                  ) : mode === "login" ? (
                    "Accéder à mon espace"
                  ) : (
                    "Transmettre ma demande d'accès"
                  )}
                </button>
              </form>
            ) : (
              /* ═══════════════════════════════════════════════════════════ */
              /* FORMULAIRE 2 : RÉCUPÉRATION DU MOT DE PASSE (WHATSAPP)        */
              /* ═══════════════════════════════════════════════════════════ */
              <div className="space-y-4">
                {resetStep === 1 ? (
                  /* Étape 1 : Saisie de l'email pour générer le code */
                  <form onSubmit={handleRequestResetCode} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                        Adresse e-mail de votre compte <span className="text-cyan-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="votre-email@domaine.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-hidden transition-all"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                        Un code sécurisé à 6 chiffres sera généré pour vous permettre de réinitialiser votre mot de passe immédiatement avec vos professeurs.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-500 hover:brightness-110 text-slate-950 transition-all shadow-lg active:scale-98 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Génération du code...</span>
                        </span>
                      ) : (
                        "Générer le code de sécurité WhatsApp"
                      )}
                    </button>
                  </form>
                ) : (
                  /* Étape 2 : Affichage du code, boutons WhatsApp directs et saisie du nouveau mot de passe */
                  <form onSubmit={handleConfirmResetPassword} className="space-y-4 animate-fadeIn">
                    {/* Bloc Code généré */}
                    <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-400/40 text-center space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-300 font-bold">
                        Votre code de validation
                      </span>
                      <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-white selection:bg-cyan-400 selection:text-slate-950">
                        {generatedCode}
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Code valable pendant 15 minutes. Envoyez-le à votre professeur pour validation :
                      </p>

                      {/* Boutons WhatsApp Directs avec le message pré-rempli */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <a
                          href={`https://wa.me/212659041407?text=${encodeURIComponent(
                            `Bonjour Pr. Anass Khadir,\n\nJ'ai oublié mon mot de passe sur la plateforme Prépasciences CPGE.\nEmail : ${email.trim()}\nCode de validation : ${generatedCode}\n\nPourriez-vous s'il vous plaît valider ma réinitialisation ?\nMerci !`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Pr. Khadir</span>
                        </a>

                        <a
                          href={`https://wa.me/212721729799?text=${encodeURIComponent(
                            `Bonjour Pr. Hassan Eddams,\n\nJ'ai oublié mon mot de passe sur la plateforme Prépasciences CPGE.\nEmail : ${email.trim()}\nCode de validation : ${generatedCode}\n\nPourriez-vous s'il vous plaît valider ma réinitialisation ?\nMerci !`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Pr. Eddams</span>
                        </a>
                      </div>
                    </div>

                    {/* Saisie du Code à 6 chiffres */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                        Confirmer le code à 6 chiffres <span className="text-cyan-400">*</span>
                      </label>
                      <div className="relative">
                        <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder={generatedCode || "123456"}
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white font-mono tracking-widest placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-hidden transition-all"
                        />
                      </div>
                    </div>

                    {/* Nouveau mot de passe */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                        Nouveau mot de passe <span className="text-cyan-400">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          placeholder="Au moins 4 caractères"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-11 py-2.5 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-hidden transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirmer nouveau mot de passe */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                        Confirmer le mot de passe <span className="text-cyan-400">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          placeholder="Répétez le mot de passe"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-hidden transition-all"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-slate-950 transition-all shadow-lg active:scale-98 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Mise à jour du mot de passe...</span>
                        </span>
                      ) : (
                        <>
                          <span>Enregistrer mon nouveau mot de passe</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Bascule au bas du formulaire */}
            <div className="mt-5 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
              {mode === "login" ? (
                <span>
                  Vous n&apos;avez pas encore de compte ?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("register")}
                    className="font-bold text-cyan-400 hover:underline cursor-pointer ml-1"
                  >
                    Demander un accès
                  </button>
                </span>
              ) : mode === "register" ? (
                <span>
                  Vous avez déjà un compte ?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("login")}
                    className="font-bold text-cyan-400 hover:underline cursor-pointer ml-1"
                  >
                    Se connecter
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleModeSwitch("login")}
                  className="font-bold text-cyan-400 hover:underline cursor-pointer"
                >
                  Revenir à la page de connexion
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer discret */}
        <div className="relative z-10 py-3 text-center text-[11px] text-slate-500 font-mono">
          Prépasciences CPGE © 2026 · Pr. Anass Khadir & Pr. Hassan Eddams
        </div>
      </div>
    </div>
  );
}
