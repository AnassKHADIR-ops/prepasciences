"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { StudentOffer, UserProfile } from "@/types/auth";
import {
  ArrowLeft,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Building2,
  Phone,
  Mail,
  User,
} from "lucide-react";

export default function InscriptionPage() {
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [filiere, setFiliere] = useState<"MP" | "MP*" | "TSI" | "Autre">("MP*");
  const [center, setCenter] = useState("");
  const [offer, setOffer] = useState<StudentOffer>("pc");
  const [notes, setNotes] = useState("");

  const [submittedUser, setSubmittedUser] = useState<UserProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires (*).");
      return;
    }

    const res = register({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      filiere,
      center: center.trim() || "CPGE Maroc",
      offer,
      notes: notes.trim(),
    });

    if (res.success && res.user) {
      setSubmittedUser(res.user);
    } else {
      setErrorMessage(res.error || "Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <div className="min-h-screen bg-[#070c1d] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Halos cosmiques */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/15 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#070c1d]/80 backdrop-blur-md">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l&apos;accueil</span>
        </Link>
        <span className="text-xs font-mono font-bold text-cyan-400 tracking-wider uppercase">
          Inscriptions Officielles CPGE 2026
        </span>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-10 shadow-2xl shadow-cyan-950/40">
          {!submittedUser ? (
            <>
              {/* En-tête */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  Espace Candidats
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Inscription aux Offres CPGE
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Rejoignez l&apos;encadrement d&apos;excellence avec les professeurs agrégés
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-xs mb-5 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Formulaire d'inscription */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nom complet */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                    Nom & Prénom de l&apos;étudiant *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="ex: Yassine BENALI"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-hidden transition-all"
                    />
                  </div>
                </div>

                {/* Email & Téléphone en grille */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      Adresse Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="etudiant@cpge.ma"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-400 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      Téléphone WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+212 6..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-400 outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Filière & Centre CPGE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      Filière CPGE *
                    </label>
                    <select
                      value={filiere}
                      onChange={(e) => setFiliere(e.target.value as "MP" | "MP*" | "TSI" | "Autre")}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white focus:border-cyan-400 outline-hidden cursor-pointer"
                    >
                      <option value="MP*">Filière MP* (Spé Math-Physique Étoile)</option>
                      <option value="MP">Filière MP (Spé Math-Physique)</option>
                      <option value="TSI">Filière TSI (Spé Technologies & SI)</option>
                      <option value="Autre">Autre filière CPGE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                      Centre / Lycée CPGE
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="ex: Lycée Moulay Abdellah Safi"
                        value={center}
                        onChange={(e) => setCenter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-400 outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Choix de l'offre */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                    Offre souhaitée *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setOffer("pc")}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        offer === "pc"
                          ? "bg-purple-950/80 border-purple-400 text-white shadow-md shadow-purple-950/60"
                          : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-black block">⚛️ Physique-Chimie</span>
                      <span className="text-[10px] text-purple-300 font-mono">Pr. Hassan Eddams</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOffer("maths")}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        offer === "maths"
                          ? "bg-cyan-950/80 border-cyan-400 text-white shadow-md shadow-cyan-950/60"
                          : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-black block">📐 Mathématiques</span>
                      <span className="text-[10px] text-cyan-300 font-mono">Pr. Anass Khadir</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOffer("integral")}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        offer === "integral"
                          ? "bg-indigo-950/90 border-indigo-400 text-white shadow-md shadow-indigo-950/60"
                          : "bg-slate-900/60 border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-black block">🚀 Pack Intégral MP</span>
                      <span className="text-[10px] text-indigo-300 font-mono">Maths + Physique</span>
                    </button>
                  </div>
                </div>

                {/* Remarque */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                    Besoins spécifiques / Message (optionnel)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="ex: Préparation spécifique Mines-Ponts / CNC, séances live du lundi..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm bg-slate-900/90 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-400 outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl font-black text-xs text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-500 hover:brightness-110 transition-all shadow-lg shadow-cyan-950/60 cursor-pointer active:scale-98"
                >
                  Valider mon inscription
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-slate-400">
                <span>Déjà inscrit ? </span>
                <Link href="/connexion" className="font-bold text-cyan-400 hover:underline">
                  Se connecter à mon espace
                </Link>
              </div>
            </>
          ) : (
            /* ÉCRAN DE CONFIRMATION (Option A : En attente de validation professeur) */
            <div className="text-center py-4 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/60">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                  Statut : En attente de validation
                </span>
                <h2 className="text-2xl font-black text-white">
                  Inscription Enregistrée !
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                  Merci <strong>{submittedUser.fullName}</strong>. Votre dossier pour l&apos;offre{" "}
                  <strong className="text-cyan-400">
                    {submittedUser.offer === "pc"
                      ? "Physique-Chimie"
                      : submittedUser.offer === "maths"
                      ? "Mathématiques"
                      : "Pack Intégral MP"}
                  </strong>{" "}
                  a été bien reçu.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-left text-xs space-y-2 text-slate-300">
                <p className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Prochaine étape pour activer votre accès :</span>
                </p>
                <p className="leading-relaxed">
                  Conformément au protocole de validation des professeurs agrégés, votre accès est débloqué après confirmation WhatsApp.
                </p>
              </div>

              {/* Bouton direct WhatsApp avec message pré-rempli */}
              <div className="pt-2 space-y-2.5">
                <a
                  href={`https://wa.me/212721729799?text=${encodeURIComponent(
                    `Bonjour Professeur, je m'appelle ${submittedUser.fullName} (Filière ${submittedUser.filiere} - ${submittedUser.center}). Je viens de m'inscrire pour l'offre ${submittedUser.offer.toUpperCase()} et je souhaite activer mon accès.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirmer mon inscription sur WhatsApp (+212 721729799)</span>
                </a>

                <Link
                  href="/connexion"
                  className="inline-block text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Retourner à la page de connexion
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-500 font-mono">
        Prépasciences © 2026 · Encadrement d&apos;Élite MP, MP* & TSI
      </footer>
    </div>
  );
}
