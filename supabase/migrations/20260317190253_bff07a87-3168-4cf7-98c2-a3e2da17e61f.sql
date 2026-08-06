
-- Create work media table
CREATE TABLE public.cms_work_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_id UUID NOT NULL REFERENCES public.cms_works(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL CHECK (media_type IN ('shared', 'delivered')),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT, -- mime type
  file_size INTEGER, -- bytes
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cms_work_media ENABLE ROW LEVEL SECURITY;

-- Admins can manage all media
CREATE POLICY "admins_manage_work_media"
ON public.cms_work_media
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public can view media for public works
CREATE POLICY "public_read_shared_work_media"
ON public.cms_work_media
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM cms_works w
    WHERE w.id = cms_work_media.work_id AND w.is_public = true
  )
);

-- Create storage bucket for work media
INSERT INTO storage.buckets (id, name, public) VALUES ('work-media', 'work-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Admins can upload work media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'work-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update work media"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'work-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete work media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'work-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view work media"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'work-media');
