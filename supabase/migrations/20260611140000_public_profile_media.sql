-- Create public profile upload metadata table
CREATE TABLE public.public_profile_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  title TEXT,
  description TEXT,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  is_public BOOLEAN NOT NULL DEFAULT false
);

-- Enable row-level security for uploads
ALTER TABLE public.public_profile_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_manage_public_profile_uploads"
ON public.public_profile_uploads
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "public_read_public_profile_uploads"
ON public.public_profile_uploads
FOR SELECT
TO anon, authenticated
USING (is_public = true);

CREATE INDEX IF NOT EXISTS idx_public_profile_uploads_status ON public.public_profile_uploads (status);

-- Create storage bucket for public profile media
INSERT INTO storage.buckets (id, name, public) VALUES ('public-profile-media', 'public-profile-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins can upload public profile media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'public-profile-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update public profile media"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'public-profile-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete public profile media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'public-profile-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view public profile media"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'public-profile-media');
