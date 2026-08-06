
-- Drop ALL existing policies on user_roles
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "users_read_own_roles" ON public.user_roles;
DROP POLICY IF EXISTS "admins_manage_roles" ON public.user_roles;

-- Drop ALL existing policies on cms_submissions
DROP POLICY IF EXISTS "Anyone can insert submissions" ON public.cms_submissions;
DROP POLICY IF EXISTS "Admins can read submissions" ON public.cms_submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON public.cms_submissions;
DROP POLICY IF EXISTS "Admins can delete submissions" ON public.cms_submissions;

-- Drop ALL existing policies on cms_projects
DROP POLICY IF EXISTS "Public can read published projects" ON public.cms_projects;
DROP POLICY IF EXISTS "Admins can manage projects" ON public.cms_projects;

-- Drop ALL existing policies on cms_about
DROP POLICY IF EXISTS "Public can read about" ON public.cms_about;
DROP POLICY IF EXISTS "Admins can manage about" ON public.cms_about;

-- Drop ALL existing policies on cms_terms
DROP POLICY IF EXISTS "Public can read terms" ON public.cms_terms;
DROP POLICY IF EXISTS "Admins can manage terms" ON public.cms_terms;

-- Drop ALL existing policies on cms_how_it_works
DROP POLICY IF EXISTS "Public can read how it works" ON public.cms_how_it_works;
DROP POLICY IF EXISTS "Admins can manage how it works" ON public.cms_how_it_works;

-- === user_roles: PERMISSIVE ===
CREATE POLICY "users_read_own_roles" ON public.user_roles
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admins_manage_roles" ON public.user_roles
  AS PERMISSIVE FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- === cms_submissions: PERMISSIVE ===
CREATE POLICY "anyone_insert_submissions" ON public.cms_submissions
  AS PERMISSIVE FOR INSERT TO anon, authenticated
  WITH CHECK (company_name IS NOT NULL AND email IS NOT NULL);

CREATE POLICY "admins_read_submissions" ON public.cms_submissions
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins_update_submissions" ON public.cms_submissions
  AS PERMISSIVE FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins_delete_submissions" ON public.cms_submissions
  AS PERMISSIVE FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- === cms_projects: PERMISSIVE ===
CREATE POLICY "public_read_projects" ON public.cms_projects
  AS PERMISSIVE FOR SELECT TO anon, authenticated
  USING (published = true);

CREATE POLICY "admins_manage_projects" ON public.cms_projects
  AS PERMISSIVE FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- === cms_about: PERMISSIVE ===
CREATE POLICY "public_read_about" ON public.cms_about
  AS PERMISSIVE FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "admins_manage_about" ON public.cms_about
  AS PERMISSIVE FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- === cms_terms: PERMISSIVE ===
CREATE POLICY "public_read_terms" ON public.cms_terms
  AS PERMISSIVE FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "admins_manage_terms" ON public.cms_terms
  AS PERMISSIVE FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- === cms_how_it_works: PERMISSIVE ===
CREATE POLICY "public_read_how_it_works" ON public.cms_how_it_works
  AS PERMISSIVE FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "admins_manage_how_it_works" ON public.cms_how_it_works
  AS PERMISSIVE FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
