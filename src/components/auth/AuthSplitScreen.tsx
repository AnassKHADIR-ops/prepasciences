"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Lock,
  Mail,
  User,
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
} from "lucide-react";

interface AuthSplitScreenProps {
  initialMode?: "login" | "register";
}

export function AuthSplitScreen({ initialMode = "login" }: AuthSplitScreenProps) {
  const router = useRouter();
  const { login, registerUser } = useAuth();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleModeSwitch = (newMode: "login" | "register") => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
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
          setIsLoading(false);
        }
      } else {
        // Register Mode
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

        const res = registerUser({
          fullName: fullName.trim(),
          email: email.trim(),
          password: password,
        });

        if (res.success && res.user) {
          setSuccessMessage("Compte créé avec succès ! Redirection en cours...");
          const userEmail = res.user.email.toLowerCase();
          const isProfOrAdmin =
            res.user.role === "admin" ||
            res.user.role === "teacher" ||
            userEmail === "anass.khadir@usmba.ac.ma" ||
            userEmail === "eddams@prepasciences.ma";

          setTimeout(() => {
            if (isProfOrAdmin) {
              router.push("/dashboard-prof");
            } else {
              router.push("/eddams");
            }
          }, 400);
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

  return (
    <div className="min-h-screen w-full bg-[#050B1D] text-white flex flex-col lg:flex-row overflow-x-hidden font-sans selection:bg-[#18C7F3] selection:text-[#050B1D]">
      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* GAUCHE : PANNEAU IMMERSIF ET INSPIRANT — SCIENCES PHYSIQUES EDDAMS */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen flex-col justify-between p-8 xl:p-12 overflow-hidden border-r border-white/10 bg-[#08142b]">
        {/* Photographie esthétique de laboratoire et salle d'étude scientifique */}
        <div className="absolute inset-0">
          <Image
            src="/auth-physics-lab.jpg"
            alt="Laboratoire et Salle d'étude Sciences Physiques CPGE"
            fill
            priority
            className="object-cover object-center scale-105 filter brightness-90 contrast-105"
          />
          {/* Overlays atmosphériques feutrés : dégradés nuit, cyan et bleu profond */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B1D] via-[#050B1D]/75 to-[#050B1D]/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B1D]/90 via-[#050B1D]/40 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(24,199,243,0.18),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(168,85,247,0.14),transparent_55%)]" />
        </div>

        {/* ── Haut : Badge étincelle & Monogramme Hexagonal Eddams ── */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            {/* Badge étincelle */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold tracking-wide backdrop-blur-md shadow-[0_0_20px_rgba(24,199,243,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Portail E-learning Physics</span>
            </div>

            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest">
              CPGE MP · MP* · TSI
            </span>
          </div>

          {/* Logo / Monogramme Hexagonal Eddams */}
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
                  E
                </span>
              </div>
            </div>

            <div>
              <div className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Eddams</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Physique-Chimie
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Pr. Hassan Eddams · Agrégé d&apos;État en CPGE
              </p>
            </div>
          </div>
        </div>

        {/* ── Milieu : Titre principal, Sous-titre & 3 Cartes de Statistiques ── */}
        <div className="relative z-10 my-auto py-8 space-y-6">
          <div className="space-y-3.5 max-w-xl">
            <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-black text-white tracking-tight leading-[1.12]">
              Préparez vos Concours{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
                en Sciences Physiques
              </span>
            </h1>
            <p className="text-xs xl:text-sm text-slate-300/90 leading-relaxed font-normal">
              Annales de concours rigoureusement décortiquées, résolutions filmées en HD et fiches de synthèse pour maximiser vos chances aux concours (CNC, CCINP, Mines, Centrale).
            </p>
          </div>

          {/* 3 Cartes de Statistiques */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-xl">
            {/* Carte 1 : 100% DISPONIBLE */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:border-cyan-400/40 transition-all duration-300 group shadow-lg shadow-black/40">
              <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                  Accès
                </span>
              </div>
              <div className="text-lg xl:text-xl font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                100%
              </div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 mt-0.5">
                DISPONIBLE
              </div>
            </div>

            {/* Carte 2 : ILLIMITÉ REPLAYS */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:border-purple-400/40 transition-all duration-300 group shadow-lg shadow-black/40">
              <div className="flex items-center gap-1.5 text-purple-400 mb-1">
                <PlayCircle className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                  Vidéos
                </span>
              </div>
              <div className="text-lg xl:text-xl font-black text-white tracking-tight group-hover:text-purple-300 transition-colors">
                ILLIMITÉ
              </div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400 mt-0.5">
                REPLAYS
              </div>
            </div>

            {/* Carte 3 : A+ RÉSULTATS */}
            <div className="p-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/10 hover:border-emerald-400/40 transition-all duration-300 group shadow-lg shadow-black/40">
              <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                <Trophy className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400">
                  Succès
                </span>
              </div>
              <div className="text-lg xl:text-xl font-black text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                A+
              </div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 mt-0.5">
                RÉSULTATS
              </div>
            </div>
          </div>
        </div>

        {/* ── Bas : Badge inférieur & Mentions Concours ── */}
        <div className="relative z-10 pt-4 border-t border-white/10">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-300 backdrop-blur-md">
            <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-semibold">
              Préparation ciblée aux concours :{" "}
              <strong className="text-cyan-300 font-bold">CNC, ENSAM, ENSA, Mines, Centrale.</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* DROITE : FORMULAIRE SOBRE, ULTRA-MODERNE ET SOMBRE (#070c1d) */}
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
            <span>Accès Protégé</span>
          </div>
        </div>

        {/* Conteneur Formulaire */}
        <div className="relative z-10 w-full max-w-md mx-auto my-auto">
          {/* Version mobile : en-tête avec Monogramme Eddams */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold tracking-wide mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Portail E-learning Physics</span>
            </div>
            <div className="flex items-center justify-center gap-2.5">
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(24,199,243,0.5)]">
                  <polygon
                    points="50,5 93,27 93,73 50,95 7,73 7,27"
                    fill="#08142b"
                    stroke="#18C7F3"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-cyan-300 font-mono font-black text-lg">E</span>
                </div>
              </div>
              <div className="text-left">
                <div className="text-xl font-black text-white tracking-tight">Eddams</div>
                <div className="text-[10px] text-slate-400 font-mono">Pr. Hassan Eddams · CPGE</div>
              </div>
            </div>
          </div>

          <div className="bg-[#0b1228]/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
            {/* Bascule fluide Connexion / Inscription (Unified Switcher) */}
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
                <span>Créer un compte</span>
              </button>
            </div>

            {/* Titre & Description du Formulaire */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {mode === "login" ? "Connexion au Portail" : "Inscription Rapide"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {mode === "login"
                  ? "Accédez à vos cours, séries TD et vidéos d'annales corrigées"
                  : "Formulaire unifié sans friction · Accès direct immédiat"}
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

            {/* Formulaire Simplifié à 3 Champs Uniquement */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* CHAMP 1 : NOM & PRÉNOM (uniquement en mode inscription) */}
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
                      placeholder="ex: Yassine Benali"
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
                    placeholder="etudiant@cpge.ma"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* CHAMP 3 : MOT DE PASSE AVEC BOUTON AFFICHER / MASQUER */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                    Mot de passe <span className="text-cyan-400">*</span>
                  </label>
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
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
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
                  "Créer mon compte immédiatement"
                )}
              </button>
            </form>

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
                    Créer un compte
                  </button>
                </span>
              ) : (
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
              )}
            </div>
          </div>
        </div>

        {/* Footer discret */}
        <div className="relative z-10 py-3 text-center text-[11px] text-slate-500 font-mono">
          Prépasciences CPGE © 2026 · Portail E-learning Pr. Hassan Eddams
        </div>
      </div>
    </div>
  );
}
