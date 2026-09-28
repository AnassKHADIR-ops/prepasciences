"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Lock,
  Mail,
  ArrowLeft,
  GraduationCap,
  ShieldAlert,
  AlertCircle,
  MessageCircle,
} from "lucide-react";

export default function ConnexionPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState<"student" | "teacher">("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingStudent, setPendingStudent] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setPendingStudent(false);

    if (!identifier.trim()) {
      setErrorMessage("Veuillez renseigner votre email ou numéro de téléphone.");
      return;
    }

    const res = login(identifier.trim(), password);

    if (res.success && res.user) {
      if (res.user.role === "teacher" || res.user.role === "admin") {
        router.push("/dashboard-prof");
      } else {
        router.push("/eddams");
      }
    } else {
      if (res.user?.status === "pending") {
        setPendingStudent(true);
      }
      setErrorMessage(res.error || "Identifiant ou mot de passe incorrect.");
    }
  };

  const handleQuickTeacherLogin = (profId: "eddams" | "khadir") => {
    setErrorMessage(null);
    const res = login(profId);
    if (res.success) {
      router.push("/dashboard-prof");
    }
  };

  return (
    <div className="min-h-screen bg-[#070c1d] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Halos cosmiques d'arrière-plan */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#070c1d]/80 backdrop-blur-md">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l&apos;accueil</span>
        </Link>
        <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase">
          Plateforme Prépasciences CPGE
        </span>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-purple-950/40">
          {/* Logo & Titre */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3.5 rounded-full overflow-hidden border-2 border-purple-500/40 shadow-xl shadow-purple-500/25 bg-slate-900 p-0.5 ring-4 ring-purple-500/10">
              <Image
                src="/logo-pc.webp"
                alt="Logo Physique-Chimie CPGE"
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              Espace Sécurisé
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Connexion CPGE
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Accédez à vos cours, séries de TD et résolutions d&apos;annales
            </p>
          </div>

          {/* Onglets Étudiant vs Professeur */}
          <div className="flex p-1 rounded-2xl bg-white/[0.05] border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab("student");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "student"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Étudiant</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("teacher");
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "teacher"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-950/50"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Professeur</span>
            </button>
          </div>

          {/* Message d'erreur ou d'attente */}
          {errorMessage && (
            <div
              className={`p-3.5 rounded-xl border mb-5 text-xs flex items-start gap-2.5 ${
                pendingStudent
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                  : "bg-red-500/10 border-red-500/30 text-red-200"
              }`}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="leading-relaxed">{errorMessage}</p>
                {pendingStudent && (
                  <a
                    href="https://wa.me/212721729799?text=Bonjour%20Professeur,%20je%20viens%20de%20m'inscrire%20sur%20Pr%C3%A9pasciences%20et%20souhaite%20activer%20mon%20compte."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Contacter sur WhatsApp pour activation</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* CAS PROFESSEUR : Accès Rapide & Simple pour Pr. Eddams & Pr. Khadir */}
          {activeTab === "teacher" && (
            <div className="space-y-4 mb-6">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold text-center">
                Connexion directe Enseignant :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickTeacherLogin("eddams")}
                  className="p-3 rounded-xl bg-purple-950/70 hover:bg-purple-900/90 border border-purple-500/40 text-left transition-all group cursor-pointer"
                >
                  <span className="text-xs font-black text-white group-hover:text-purple-300 block">
                    ⚛️ Pr. Hassan EDDAMS
                  </span>
                  <span className="text-[10px] text-purple-300 font-mono">
                    Pôle Physique-Chimie
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickTeacherLogin("khadir")}
                  className="p-3 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/90 border border-cyan-500/40 text-left transition-all group cursor-pointer"
                >
                  <span className="text-xs font-black text-white group-hover:text-cyan-300 block">
                    📐 Pr. Anass KHADIR
                  </span>
                  <span className="text-[10px] text-cyan-300 font-mono">
                    Pôle Mathématiques
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Formulaire de Connexion Standard */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                {activeTab === "student" ? "Email ou Numéro WhatsApp" : "Email Enseignant"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder={
                    activeTab === "student"
                      ? "ex: yassine.benali@cpge.ma ou 0612345678"
                      : "eddams@prepasciences.ma"
                  }
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-hidden transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-hidden transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-xl font-black text-xs transition-all shadow-lg active:scale-98 cursor-pointer mt-2 ${
                activeTab === "student"
                  ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/60"
                  : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-950/60"
              }`}
            >
              {activeTab === "student" ? "Accéder à mon espace Étudiant" : "Connexion au Dashboard Professeur"}
            </button>
          </form>

          {/* Lien Inscription pour les Étudiants */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-slate-400">
            <span>Vous n&apos;avez pas encore de compte étudiant ? </span>
            <Link
              href="/inscription"
              className="font-bold text-cyan-400 hover:underline"
            >
              Créer mon inscription CPGE
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-500 font-mono">
        Prépasciences © 2026 · Encadrement d&apos;Élite MP, MP* & TSI
      </footer>
    </div>
  );
}
