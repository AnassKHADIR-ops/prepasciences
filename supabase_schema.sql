-- ============================================================================
-- PRÉPASCIENCES CPGE · SCHÉMA SUPABASE POSTGRESQL (PRODUCTION)
-- Compatible avec les applications de Mathématiques et de Physique-Chimie
-- Option A : Inscription en attente de validation manuelle par les professeurs
-- ============================================================================

-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. Table des Profils Utilisateurs (Étudiants & Professeurs) ──
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
  filiere TEXT CHECK (filiere IN ('MP', 'MP*', 'TSI', 'Autre')) DEFAULT 'MP*',
  center TEXT NOT NULL DEFAULT 'CPGE Maroc',
  offer TEXT CHECK (offer IN ('pc', 'maths', 'integral')) DEFAULT 'pc',
  status TEXT CHECK (status IN ('pending', 'active', 'suspended')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  notes TEXT
);

-- Index pour accélérer les recherches et filtres
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_offer ON public.profiles(offer);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ── 2. Table des Chapitres de Cours ──
CREATE TABLE IF NOT EXISTS public.chapters (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL, -- 'em', 'thermo', 'meca', 'optique', 'chimie', 'maths_algebre', etc.
  num INT NOT NULL,
  titre TEXT NOT NULL,
  description TEXT,
  badge TEXT DEFAULT 'Spé MP / MP*',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chapters_module ON public.chapters(module_id);

-- ── 3. Table des Séances de Cours & Replays ──
CREATE TABLE IF NOT EXISTS public.sessions (
  id TEXT PRIMARY KEY,
  chapter_id TEXT REFERENCES public.chapters(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  sous TEXT,
  support_url TEXT, -- Lien Google Drive du support PDF
  video_url TEXT,   -- Lien YouTube ou Drive de la vidéo
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_chapter ON public.sessions(chapter_id);

-- ── 4. Table des Travaux Dirigés (TDs) ──
CREATE TABLE IF NOT EXISTS public.exercises (
  id TEXT PRIMARY KEY,
  chapter_id TEXT REFERENCES public.chapters(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  sous TEXT,
  enonce_url TEXT, -- Lien Google Drive de l'Énoncé
  video_url TEXT,  -- Lien YouTube ou Drive de la résolution vidéo
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercises_chapter ON public.exercises(chapter_id);

-- ── 5. Table des MULTI-CORRIGÉS (Plusieurs corrections possibles par TD) ──
CREATE TABLE IF NOT EXISTS public.exercise_corrections (
  id TEXT PRIMARY KEY,
  exercise_id TEXT REFERENCES public.exercises(id) ON DELETE CASCADE,
  titre TEXT NOT NULL, -- ex: 'Corrigé 1 : Méthode énergétique', 'Corrigé officiel rédigé'
  url TEXT NOT NULL,   -- Lien Google Drive du corrigé PDF ou lien vidéo
  type TEXT CHECK (type IN ('pdf', 'video')) DEFAULT 'pdf',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_corrections_exercise ON public.exercise_corrections(exercise_id);

-- ── 6. Table des Fiches de Synthèse & Formulaires ──
CREATE TABLE IF NOT EXISTS public.fiches (
  id TEXT PRIMARY KEY,
  chapter_id TEXT REFERENCES public.chapters(id) ON DELETE CASCADE,
  titre TEXT NOT NULL,
  sous TEXT,
  url TEXT NOT NULL, -- Lien Google Drive du formulaire PDF
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fiches_chapter ON public.fiches(chapter_id);

-- ── 7. Sécurité Row Level Security (RLS) ──
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiches ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique / étudiants actifs
CREATE POLICY "Public Read Active Profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Public Read Chapters" ON public.chapters
  FOR SELECT USING (true);

CREATE POLICY "Public Read Sessions" ON public.sessions
  FOR SELECT USING (true);

CREATE POLICY "Public Read Exercises" ON public.exercises
  FOR SELECT USING (true);

CREATE POLICY "Public Read Corrections" ON public.exercise_corrections
  FOR SELECT USING (true);

CREATE POLICY "Public Read Fiches" ON public.fiches
  FOR SELECT USING (true);

-- Politiques d'écriture pour les professeurs et administrateurs
CREATE POLICY "Teachers Full Access Chapters" ON public.chapters
  FOR ALL USING (auth.jwt() ->> 'role' IN ('teacher', 'admin') OR auth.jwt() ->> 'email' IN ('eddams@prepasciences.ma', 'khadir@prepasciences.ma'));

CREATE POLICY "Teachers Full Access Sessions" ON public.sessions
  FOR ALL USING (auth.jwt() ->> 'role' IN ('teacher', 'admin') OR auth.jwt() ->> 'email' IN ('eddams@prepasciences.ma', 'khadir@prepasciences.ma'));

CREATE POLICY "Teachers Full Access Exercises" ON public.exercises
  FOR ALL USING (auth.jwt() ->> 'role' IN ('teacher', 'admin') OR auth.jwt() ->> 'email' IN ('eddams@prepasciences.ma', 'khadir@prepasciences.ma'));

CREATE POLICY "Teachers Full Access Corrections" ON public.exercise_corrections
  FOR ALL USING (auth.jwt() ->> 'role' IN ('teacher', 'admin') OR auth.jwt() ->> 'email' IN ('eddams@prepasciences.ma', 'khadir@prepasciences.ma'));

CREATE POLICY "Teachers Full Access Fiches" ON public.fiches
  FOR ALL USING (auth.jwt() ->> 'role' IN ('teacher', 'admin') OR auth.jwt() ->> 'email' IN ('eddams@prepasciences.ma', 'khadir@prepasciences.ma'));

CREATE POLICY "Teachers Update Profiles" ON public.profiles
  FOR ALL USING (auth.jwt() ->> 'role' IN ('teacher', 'admin') OR auth.jwt() ->> 'email' IN ('eddams@prepasciences.ma', 'khadir@prepasciences.ma'));
