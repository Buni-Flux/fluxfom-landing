-- App-level sign-in disable (admin toggle) — works without auth admin / edge function deploy.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS sign_in_disabled boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profiles.sign_in_disabled IS
  'When true, the user is signed out and cannot access the app until an admin re-enables sign-in.';
