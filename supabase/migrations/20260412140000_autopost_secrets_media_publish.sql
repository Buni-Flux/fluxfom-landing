
-- Server-only credentials for social APIs (never exposed to the browser via RLS).
CREATE TABLE public.social_connection_secrets (
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  platform text NOT NULL,
  access_token text NOT NULL,
  refresh_token text,
  token_expires_at timestamptz,
  page_id text,
  extra jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, platform),
  CONSTRAINT social_connection_secrets_platform_check CHECK (
    platform IN ('instagram', 'facebook', 'x', 'linkedin', 'pinterest', 'tiktok')
  )
);

ALTER TABLE public.social_connection_secrets ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_social_connection_secrets_updated_at
  BEFORE UPDATE ON public.social_connection_secrets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Publishable image in Storage: path relative to bucket root, e.g. "{user_id}/{uuid}.png"
ALTER TABLE public.scheduled_social_posts
  ADD COLUMN IF NOT EXISTS media_storage_path text,
  ADD COLUMN IF NOT EXISTS publish_error text,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS external_post_id text;

CREATE INDEX IF NOT EXISTS idx_scheduled_social_posts_status_scheduled
  ON public.scheduled_social_posts (status, scheduled_at)
  WHERE status = 'scheduled';

-- Public URLs required by Meta "photos" publish by URL.
INSERT INTO storage.buckets (id, name, public)
VALUES ('social-publish', 'social-publish', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "social_publish_public_read" ON storage.objects;
CREATE POLICY "social_publish_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'social-publish');

DROP POLICY IF EXISTS "social_publish_insert_own_folder" ON storage.objects;
CREATE POLICY "social_publish_insert_own_folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'social-publish'
    AND split_part(name, '/', 1) = auth.uid()::text
  );

DROP POLICY IF EXISTS "social_publish_update_own_folder" ON storage.objects;
CREATE POLICY "social_publish_update_own_folder"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'social-publish'
    AND split_part(name, '/', 1) = auth.uid()::text
  );

DROP POLICY IF EXISTS "social_publish_delete_own_folder" ON storage.objects;
CREATE POLICY "social_publish_delete_own_folder"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'social-publish'
    AND split_part(name, '/', 1) = auth.uid()::text
  );
