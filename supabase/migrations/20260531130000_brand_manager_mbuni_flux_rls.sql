-- Brand Manager + physical assets: align RLS with Mbuni Flux section access (same as clients table).

DROP POLICY IF EXISTS "mbuni_flux_view_brand_manager_profiles" ON public.brand_manager_profiles;
CREATE POLICY "mbuni_flux_view_brand_manager_profiles"
  ON public.brand_manager_profiles
  FOR SELECT
  TO authenticated
  USING (public.user_can_view_section('mbuni-flux'));

DROP POLICY IF EXISTS "mbuni_flux_edit_brand_manager_profiles" ON public.brand_manager_profiles;
CREATE POLICY "mbuni_flux_edit_brand_manager_profiles"
  ON public.brand_manager_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (public.user_can_edit_section('mbuni-flux'));

DROP POLICY IF EXISTS "mbuni_flux_update_brand_manager_profiles" ON public.brand_manager_profiles;
CREATE POLICY "mbuni_flux_update_brand_manager_profiles"
  ON public.brand_manager_profiles
  FOR UPDATE
  TO authenticated
  USING (public.user_can_edit_section('mbuni-flux'))
  WITH CHECK (public.user_can_edit_section('mbuni-flux'));

DROP POLICY IF EXISTS "mbuni_flux_delete_brand_manager_profiles" ON public.brand_manager_profiles;
CREATE POLICY "mbuni_flux_delete_brand_manager_profiles"
  ON public.brand_manager_profiles
  FOR DELETE
  TO authenticated
  USING (public.user_can_edit_section('mbuni-flux'));
