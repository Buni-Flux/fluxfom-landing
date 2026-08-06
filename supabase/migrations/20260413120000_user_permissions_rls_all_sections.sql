-- RLS aligned with public.user_permissions sections (see usePermissions SectionKey).
-- Defines helpers here too so this file is safe to run alone (e.g. SQL editor paste)
-- if 20260413100000_cms_works_user_permissions_rls.sql was not applied yet.

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

-- ---------------------------------------------------------------------------
-- CMS tables (section keys match frontend: projects, how-it-works, about, terms)
-- ---------------------------------------------------------------------------

CREATE POLICY "users_with_projects_view_select_projects"
  ON public.cms_projects FOR SELECT TO authenticated
  USING (public.user_can_view_section('projects'));

CREATE POLICY "users_with_projects_edit_insert_projects"
  ON public.cms_projects FOR INSERT TO authenticated
  WITH CHECK (public.user_can_edit_section('projects'));

CREATE POLICY "users_with_projects_edit_update_projects"
  ON public.cms_projects FOR UPDATE TO authenticated
  USING (public.user_can_edit_section('projects'))
  WITH CHECK (public.user_can_edit_section('projects'));

CREATE POLICY "users_with_projects_edit_delete_projects"
  ON public.cms_projects FOR DELETE TO authenticated
  USING (public.user_can_edit_section('projects'));

-- Publish-as-project from Works inserts a new cms_projects row before linking the work.
CREATE POLICY "users_with_works_edit_insert_projects"
  ON public.cms_projects FOR INSERT TO authenticated
  WITH CHECK (public.user_can_edit_section('works'));

-- Works UI links rows in cms_works.project_id → cms_projects; sync updates that project.
CREATE POLICY "users_with_works_view_select_linked_projects"
  ON public.cms_projects FOR SELECT TO authenticated
  USING (
    public.user_can_view_section('works')
    AND EXISTS (SELECT 1 FROM public.cms_works w WHERE w.project_id = cms_projects.id)
  );

CREATE POLICY "users_with_works_edit_update_linked_projects"
  ON public.cms_projects FOR UPDATE TO authenticated
  USING (
    public.user_can_edit_section('works')
    AND EXISTS (SELECT 1 FROM public.cms_works w WHERE w.project_id = cms_projects.id)
  )
  WITH CHECK (
    public.user_can_edit_section('works')
    AND EXISTS (SELECT 1 FROM public.cms_works w WHERE w.project_id = cms_projects.id)
  );

CREATE POLICY "users_with_how_it_works_view_select"
  ON public.cms_how_it_works FOR SELECT TO authenticated
  USING (public.user_can_view_section('how-it-works'));

CREATE POLICY "users_with_how_it_works_edit_insert"
  ON public.cms_how_it_works FOR INSERT TO authenticated
  WITH CHECK (public.user_can_edit_section('how-it-works'));

CREATE POLICY "users_with_how_it_works_edit_update"
  ON public.cms_how_it_works FOR UPDATE TO authenticated
  USING (public.user_can_edit_section('how-it-works'))
  WITH CHECK (public.user_can_edit_section('how-it-works'));

CREATE POLICY "users_with_how_it_works_edit_delete"
  ON public.cms_how_it_works FOR DELETE TO authenticated
  USING (public.user_can_edit_section('how-it-works'));

CREATE POLICY "users_with_about_view_select"
  ON public.cms_about FOR SELECT TO authenticated
  USING (public.user_can_view_section('about'));

CREATE POLICY "users_with_about_edit_insert"
  ON public.cms_about FOR INSERT TO authenticated
  WITH CHECK (public.user_can_edit_section('about'));

CREATE POLICY "users_with_about_edit_update"
  ON public.cms_about FOR UPDATE TO authenticated
  USING (public.user_can_edit_section('about'))
  WITH CHECK (public.user_can_edit_section('about'));

CREATE POLICY "users_with_about_edit_delete"
  ON public.cms_about FOR DELETE TO authenticated
  USING (public.user_can_edit_section('about'));

CREATE POLICY "users_with_terms_view_select"
  ON public.cms_terms FOR SELECT TO authenticated
  USING (public.user_can_view_section('terms'));

CREATE POLICY "users_with_terms_edit_insert"
  ON public.cms_terms FOR INSERT TO authenticated
  WITH CHECK (public.user_can_edit_section('terms'));

CREATE POLICY "users_with_terms_edit_update"
  ON public.cms_terms FOR UPDATE TO authenticated
  USING (public.user_can_edit_section('terms'))
  WITH CHECK (public.user_can_edit_section('terms'));

CREATE POLICY "users_with_terms_edit_delete"
  ON public.cms_terms FOR DELETE TO authenticated
  USING (public.user_can_edit_section('terms'));

-- Submissions: inbox uses section "submissions"; Brand Brain reads submissions under "dags-brand-docs"
CREATE POLICY "users_with_submissions_or_brand_view_select"
  ON public.cms_submissions FOR SELECT TO authenticated
  USING (
    public.user_can_view_section('submissions')
    OR public.user_can_view_section('dags-brand-docs')
  );

CREATE POLICY "users_with_submissions_edit_update"
  ON public.cms_submissions FOR UPDATE TO authenticated
  USING (public.user_can_edit_section('submissions'))
  WITH CHECK (public.user_can_edit_section('submissions'));

-- ---------------------------------------------------------------------------
-- Brand Docs / Brand Brain (section: dags-brand-docs)
-- ---------------------------------------------------------------------------

CREATE POLICY "users_with_brand_docs_view_select_profiles"
  ON public.brand_profiles FOR SELECT TO authenticated
  USING (public.user_can_view_section('dags-brand-docs'));

CREATE POLICY "users_with_brand_docs_edit_insert_profiles"
  ON public.brand_profiles FOR INSERT TO authenticated
  WITH CHECK (public.user_can_edit_section('dags-brand-docs'));

CREATE POLICY "users_with_brand_docs_edit_update_profiles"
  ON public.brand_profiles FOR UPDATE TO authenticated
  USING (public.user_can_edit_section('dags-brand-docs'))
  WITH CHECK (public.user_can_edit_section('dags-brand-docs'));

CREATE POLICY "users_with_brand_docs_edit_delete_profiles"
  ON public.brand_profiles FOR DELETE TO authenticated
  USING (public.user_can_edit_section('dags-brand-docs'));

CREATE POLICY "users_with_brand_docs_view_select_documents"
  ON public.brand_documents FOR SELECT TO authenticated
  USING (public.user_can_view_section('dags-brand-docs'));

CREATE POLICY "users_with_brand_docs_edit_insert_documents"
  ON public.brand_documents FOR INSERT TO authenticated
  WITH CHECK (public.user_can_edit_section('dags-brand-docs'));

CREATE POLICY "users_with_brand_docs_edit_update_documents"
  ON public.brand_documents FOR UPDATE TO authenticated
  USING (public.user_can_edit_section('dags-brand-docs'))
  WITH CHECK (public.user_can_edit_section('dags-brand-docs'));

CREATE POLICY "users_with_brand_docs_edit_delete_documents"
  ON public.brand_documents FOR DELETE TO authenticated
  USING (public.user_can_edit_section('dags-brand-docs'));

-- ---------------------------------------------------------------------------
-- dags_projects: tie own rows to the matching DAG section permission
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "Users can view own dags projects" ON public.dags_projects;
DROP POLICY IF EXISTS "Users can create own dags projects" ON public.dags_projects;
DROP POLICY IF EXISTS "Users can update own dags projects" ON public.dags_projects;
DROP POLICY IF EXISTS "Users can delete own dags projects" ON public.dags_projects;

CREATE POLICY "Users can view own dags projects"
  ON public.dags_projects FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    AND (
      (project_type = 'social_statics' AND public.user_can_view_section('dags-social-statics'))
      OR (project_type = 'brand_docs' AND public.user_can_view_section('dags-brand-docs'))
    )
  );

CREATE POLICY "Users can create own dags projects"
  ON public.dags_projects FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND (
      (project_type = 'social_statics' AND public.user_can_edit_section('dags-social-statics'))
      OR (project_type = 'brand_docs' AND public.user_can_edit_section('dags-brand-docs'))
    )
  );

CREATE POLICY "Users can update own dags projects"
  ON public.dags_projects FOR UPDATE TO authenticated
  USING (
    auth.uid() = user_id
    AND (
      (project_type = 'social_statics' AND public.user_can_edit_section('dags-social-statics'))
      OR (project_type = 'brand_docs' AND public.user_can_edit_section('dags-brand-docs'))
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    AND (
      (project_type = 'social_statics' AND public.user_can_edit_section('dags-social-statics'))
      OR (project_type = 'brand_docs' AND public.user_can_edit_section('dags-brand-docs'))
    )
  );

CREATE POLICY "Users can delete own dags projects"
  ON public.dags_projects FOR DELETE TO authenticated
  USING (
    auth.uid() = user_id
    AND (
      (project_type = 'social_statics' AND public.user_can_edit_section('dags-social-statics'))
      OR (project_type = 'brand_docs' AND public.user_can_edit_section('dags-brand-docs'))
    )
  );

-- ---------------------------------------------------------------------------
-- Scheduled social + connections + storage: require Social Statics permission
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "scheduled_social_posts_select_own" ON public.scheduled_social_posts;
DROP POLICY IF EXISTS "scheduled_social_posts_insert_own" ON public.scheduled_social_posts;
DROP POLICY IF EXISTS "scheduled_social_posts_update_own" ON public.scheduled_social_posts;
DROP POLICY IF EXISTS "scheduled_social_posts_delete_own" ON public.scheduled_social_posts;

CREATE POLICY "scheduled_social_posts_select_own"
  ON public.scheduled_social_posts FOR SELECT TO authenticated
  USING (auth.uid() = user_id AND public.user_can_view_section('dags-social-statics'));

CREATE POLICY "scheduled_social_posts_insert_own"
  ON public.scheduled_social_posts FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND public.user_can_edit_section('dags-social-statics')
    AND EXISTS (
      SELECT 1 FROM public.dags_projects dp
      WHERE dp.id = dags_project_id
        AND dp.user_id = auth.uid()
        AND dp.project_type = 'social_statics'
    )
  );

CREATE POLICY "scheduled_social_posts_update_own"
  ON public.scheduled_social_posts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND public.user_can_edit_section('dags-social-statics'))
  WITH CHECK (auth.uid() = user_id AND public.user_can_edit_section('dags-social-statics'));

CREATE POLICY "scheduled_social_posts_delete_own"
  ON public.scheduled_social_posts FOR DELETE TO authenticated
  USING (auth.uid() = user_id AND public.user_can_edit_section('dags-social-statics'));

DROP POLICY IF EXISTS "social_connections_select_own" ON public.social_connections;
DROP POLICY IF EXISTS "social_connections_insert_own" ON public.social_connections;
DROP POLICY IF EXISTS "social_connections_update_own" ON public.social_connections;
DROP POLICY IF EXISTS "social_connections_delete_own" ON public.social_connections;

CREATE POLICY "social_connections_select_own"
  ON public.social_connections FOR SELECT TO authenticated
  USING (auth.uid() = user_id AND public.user_can_view_section('dags-social-statics'));

CREATE POLICY "social_connections_insert_own"
  ON public.social_connections FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND public.user_can_edit_section('dags-social-statics'));

CREATE POLICY "social_connections_update_own"
  ON public.social_connections FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND public.user_can_edit_section('dags-social-statics'))
  WITH CHECK (auth.uid() = user_id AND public.user_can_edit_section('dags-social-statics'));

CREATE POLICY "social_connections_delete_own"
  ON public.social_connections FOR DELETE TO authenticated
  USING (auth.uid() = user_id AND public.user_can_edit_section('dags-social-statics'));

DROP POLICY IF EXISTS "social_publish_insert_own_folder" ON storage.objects;
DROP POLICY IF EXISTS "social_publish_update_own_folder" ON storage.objects;
DROP POLICY IF EXISTS "social_publish_delete_own_folder" ON storage.objects;

CREATE POLICY "social_publish_insert_own_folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'social-publish'
    AND split_part(name, '/', 1) = auth.uid()::text
    AND public.user_can_edit_section('dags-social-statics')
  );

CREATE POLICY "social_publish_update_own_folder"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'social-publish'
    AND split_part(name, '/', 1) = auth.uid()::text
    AND public.user_can_edit_section('dags-social-statics')
  );

CREATE POLICY "social_publish_delete_own_folder"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'social-publish'
    AND split_part(name, '/', 1) = auth.uid()::text
    AND public.user_can_edit_section('dags-social-statics')
  );
