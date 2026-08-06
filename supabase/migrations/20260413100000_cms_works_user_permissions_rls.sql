-- Align cms_works / work updates / work media / storage with user_permissions("works")
-- so editors (can_edit) can create and manage works, not only admins.

CREATE OR REPLACE FUNCTION public.user_can_view_section(p_section text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_permissions up
    WHERE up.user_id = auth.uid()
      AND up.section = p_section
      AND up.can_view
  );
$$;

CREATE OR REPLACE FUNCTION public.user_can_edit_section(p_section text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_permissions up
    WHERE up.user_id = auth.uid()
      AND up.section = p_section
      AND up.can_edit
  );
$$;

REVOKE ALL ON FUNCTION public.user_can_view_section(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.user_can_edit_section(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.user_can_view_section(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_can_edit_section(text) TO authenticated;

-- cms_works
CREATE POLICY "users_with_works_view_select_works"
  ON public.cms_works
  FOR SELECT
  TO authenticated
  USING (public.user_can_view_section('works'));

CREATE POLICY "users_with_works_edit_insert_works"
  ON public.cms_works
  FOR INSERT
  TO authenticated
  WITH CHECK (public.user_can_edit_section('works'));

CREATE POLICY "users_with_works_edit_update_works"
  ON public.cms_works
  FOR UPDATE
  TO authenticated
  USING (public.user_can_edit_section('works'))
  WITH CHECK (public.user_can_edit_section('works'));

CREATE POLICY "users_with_works_edit_delete_works"
  ON public.cms_works
  FOR DELETE
  TO authenticated
  USING (public.user_can_edit_section('works'));

-- cms_work_updates
CREATE POLICY "users_with_works_view_select_updates"
  ON public.cms_work_updates
  FOR SELECT
  TO authenticated
  USING (public.user_can_view_section('works'));

CREATE POLICY "users_with_works_edit_insert_updates"
  ON public.cms_work_updates
  FOR INSERT
  TO authenticated
  WITH CHECK (public.user_can_edit_section('works'));

CREATE POLICY "users_with_works_edit_update_updates"
  ON public.cms_work_updates
  FOR UPDATE
  TO authenticated
  USING (public.user_can_edit_section('works'))
  WITH CHECK (public.user_can_edit_section('works'));

CREATE POLICY "users_with_works_edit_delete_updates"
  ON public.cms_work_updates
  FOR DELETE
  TO authenticated
  USING (public.user_can_edit_section('works'));

-- cms_work_media
CREATE POLICY "users_with_works_view_select_work_media"
  ON public.cms_work_media
  FOR SELECT
  TO authenticated
  USING (public.user_can_view_section('works'));

CREATE POLICY "users_with_works_edit_insert_work_media"
  ON public.cms_work_media
  FOR INSERT
  TO authenticated
  WITH CHECK (public.user_can_edit_section('works'));

CREATE POLICY "users_with_works_edit_update_work_media"
  ON public.cms_work_media
  FOR UPDATE
  TO authenticated
  USING (public.user_can_edit_section('works'))
  WITH CHECK (public.user_can_edit_section('works'));

CREATE POLICY "users_with_works_edit_delete_work_media"
  ON public.cms_work_media
  FOR DELETE
  TO authenticated
  USING (public.user_can_edit_section('works'));

-- work-media bucket: allow editors to upload / replace / delete files
CREATE POLICY "Users with works edit can upload work media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'work-media'
    AND public.user_can_edit_section('works')
  );

CREATE POLICY "Users with works edit can update work media"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'work-media' AND public.user_can_edit_section('works'));

CREATE POLICY "Users with works edit can delete work media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'work-media' AND public.user_can_edit_section('works'));
