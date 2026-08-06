ALTER TABLE public.cms_projects 
  ADD COLUMN IF NOT EXISTS preview_image_url text,
  ADD COLUMN IF NOT EXISTS preview_gif_url text;