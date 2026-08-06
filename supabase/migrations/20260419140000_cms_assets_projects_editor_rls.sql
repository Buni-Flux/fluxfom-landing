-- Allow users with CMS "projects" edit permission to manage files in cms-assets
-- (admins already have separate policies on this bucket).
CREATE POLICY "users_with_projects_edit_insert_cms_assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'cms-assets'
    AND public.user_can_edit_section('projects')
  );

CREATE POLICY "users_with_projects_edit_update_cms_assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'cms-assets' AND public.user_can_edit_section('projects'));

CREATE POLICY "users_with_projects_edit_delete_cms_assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'cms-assets' AND public.user_can_edit_section('projects'));
