-- Brand References: design, campaign, photography, packaging, competitor inspiration per profile

CREATE TABLE public.brand_profile_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.brand_manager_profiles(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (
    category IN (
      'design_inspiration',
      'campaign_inspiration',
      'photography_direction',
      'packaging_reference',
      'competitor_reference'
    )
  ),
  title text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  source_url text,
  notes text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_brand_profile_references_profile ON public.brand_profile_references (profile_id);
CREATE INDEX idx_brand_profile_references_category ON public.brand_profile_references (profile_id, category);

ALTER TABLE public.brand_profile_references ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_manage_brand_profile_references"
  ON public.brand_profile_references FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "mbuni_flux_view_brand_profile_references"
  ON public.brand_profile_references FOR SELECT
  TO authenticated
  USING (public.user_can_view_section('mbuni-flux'));

CREATE POLICY "mbuni_flux_edit_brand_profile_references"
  ON public.brand_profile_references FOR INSERT
  TO authenticated
  WITH CHECK (public.user_can_edit_section('mbuni-flux'));

CREATE POLICY "mbuni_flux_update_brand_profile_references"
  ON public.brand_profile_references FOR UPDATE
  TO authenticated
  USING (public.user_can_edit_section('mbuni-flux'))
  WITH CHECK (public.user_can_edit_section('mbuni-flux'));

CREATE POLICY "mbuni_flux_delete_brand_profile_references"
  ON public.brand_profile_references FOR DELETE
  TO authenticated
  USING (public.user_can_edit_section('mbuni-flux'));

CREATE TRIGGER update_brand_profile_references_updated_at
  BEFORE UPDATE ON public.brand_profile_references
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
