ALTER TABLE public.cms_projects
  ADD COLUMN IF NOT EXISTS client_tagline text,
  ADD COLUMN IF NOT EXISTS client_location text,
  ADD COLUMN IF NOT EXISTS timeline text,
  ADD COLUMN IF NOT EXISTS profile_data jsonb;

COMMENT ON COLUMN public.cms_projects.client_tagline IS 'Short descriptor shown on client cards and profile header.';
COMMENT ON COLUMN public.cms_projects.client_location IS 'City/region line for client profile header.';
COMMENT ON COLUMN public.cms_projects.timeline IS 'Engagement timeline label, e.g. 4 weeks.';
COMMENT ON COLUMN public.cms_projects.profile_data IS 'Structured JSON for tabbed client profile sections.';
