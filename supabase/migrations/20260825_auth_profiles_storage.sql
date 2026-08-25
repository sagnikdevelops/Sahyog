-- Sahyog: auth-linked profiles, certifications, badges, storage, RLS
-- Run in Supabase SQL Editor after the base schema.

-- Link profiles to auth.users when possible (safe for existing rows with matching UUIDs)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_id_fk_auth_users'
  ) THEN
    ALTER TABLE profiles
      ADD CONSTRAINT profiles_id_fk_auth_users
      FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Could not add profiles FK to auth.users (existing non-auth IDs). Continue without it.';
END $$;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

ALTER TABLE certifications ADD COLUMN IF NOT EXISTS certification_number TEXT;
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS certification_status TEXT DEFAULT 'PENDING';
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS reviewed_by UUID;
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

DO $$
BEGIN
  ALTER TABLE certifications
    ADD CONSTRAINT certifications_status_check
    CHECK (certification_status IN ('PENDING', 'APPROVED', 'REJECTED'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS worker_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    badge_key TEXT NOT NULL,
    label TEXT NOT NULL,
    description TEXT,
    awarded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(worker_id, badge_key)
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles (email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);
CREATE INDEX IF NOT EXISTS idx_worker_skills_worker ON worker_skills (worker_id);
CREATE INDEX IF NOT EXISTS idx_certifications_worker ON certifications (worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_badges_worker ON worker_badges (worker_id);

-- Auto-create profile + worker row from auth metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_role TEXT;
BEGIN
  new_role := COALESCE(NEW.raw_user_meta_data->>'role', 'CUSTOMER');
  IF new_role NOT IN ('CUSTOMER', 'WORKER', 'SOCIETY_ADMIN', 'FEDERATION_ADMIN', 'SUPER_ADMIN') THEN
    new_role := 'CUSTOMER';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, 'member'), '@', 1)),
    new_role,
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(profiles.full_name, EXCLUDED.full_name),
        role = COALESCE(profiles.role, EXCLUDED.role);

  IF new_role = 'WORKER' THEN
    INSERT INTO public.workers (id)
    VALUES (NEW.id)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', false)
ON CONFLICT (id) DO NOTHING;
