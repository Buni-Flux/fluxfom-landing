-- Brand Manager: client-linked strategic brand profiles (Brand Profile Studio)
-- Distinct from submission-linked brand_profiles used by brand-docs DAG.

CREATE TABLE public.brand_manager_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  brand_name text,
  industry text,
  category text,
  audience jsonb NOT NULL DEFAULT '{}'::jsonb,
  brand_story text,
  brand_mission text,
  brand_vision text,
  brand_personality jsonb NOT NULL DEFAULT '[]'::jsonb,
  communication_style jsonb NOT NULL DEFAULT '{}'::jsonb,
  positioning_statement text,
  visual_identity jsonb NOT NULL DEFAULT '{}'::jsonb,
  primary_colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  secondary_colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  typography jsonb NOT NULL DEFAULT '{}'::jsonb,
  social_platforms jsonb NOT NULL DEFAULT '[]'::jsonb,
  website_url text,
  physical_assets jsonb NOT NULL DEFAULT '[]'::jsonb,
  digital_assets jsonb NOT NULL DEFAULT '[]'::jsonb,
  recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  growth_opportunities jsonb NOT NULL DEFAULT '[]'::jsonb,
  missing_assets jsonb NOT NULL DEFAULT '[]'::jsonb,
  brand_maturity_score integer NOT NULL DEFAULT 0 CHECK (brand_maturity_score >= 0 AND brand_maturity_score <= 100),
  profile_status text NOT NULL DEFAULT 'draft'
    CHECK (profile_status IN ('draft', 'review', 'approved', 'published')),
  published_snapshot jsonb,
  strategist_notes text,
  synthesis_meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT brand_manager_profiles_client_id_key UNIQUE (client_id)
);

CREATE INDEX idx_brand_manager_profiles_status ON public.brand_manager_profiles (profile_status);
CREATE INDEX idx_brand_manager_profiles_updated ON public.brand_manager_profiles (updated_at DESC);

ALTER TABLE public.brand_manager_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_manage_brand_manager_profiles"
  ON public.brand_manager_profiles FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_brand_manager_profiles_updated_at
  BEFORE UPDATE ON public.brand_manager_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Optional client_id on cms_works for published showcase linkage (future /works integration)
ALTER TABLE public.cms_works
  ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_cms_works_client_id ON public.cms_works (client_id);
