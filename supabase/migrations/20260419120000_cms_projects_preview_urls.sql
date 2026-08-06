-- Landing / grid previews: optional static poster + optional GIF shown on hover
ALTER TABLE public.cms_projects
  ADD COLUMN IF NOT EXISTS preview_image_url TEXT,
  ADD COLUMN IF NOT EXISTS preview_gif_url TEXT;

COMMENT ON COLUMN public.cms_projects.preview_image_url IS 'Static image (or poster) for project cards and Selected Work; falls back to image_url when null.';
COMMENT ON COLUMN public.cms_projects.preview_gif_url IS 'Optional animated GIF for cards; shown on hover when preview_image_url or image_url provides a still.';
