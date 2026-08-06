-- Explicitly recreate all policies AS PERMISSIVE

-- user_roles - critical for admin check
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;

CREATE POLICY "Users can read own roles" ON public.user_roles AS PERMISSIVE FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- cms_submissions
DROP POLICY IF EXISTS "Anyone can insert submissions" ON public.cms_submissions;
DROP POLICY IF EXISTS "Admins can read submissions" ON public.cms_submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON public.cms_submissions;
DROP POLICY IF EXISTS "Admins can delete submissions" ON public.cms_submissions;

CREATE POLICY "Anyone can insert submissions" ON public.cms_submissions AS PERMISSIVE FOR INSERT TO anon, authenticated WITH CHECK (company_name IS NOT NULL AND email IS NOT NULL);
CREATE POLICY "Admins can read submissions" ON public.cms_submissions AS PERMISSIVE FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update submissions" ON public.cms_submissions AS PERMISSIVE FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete submissions" ON public.cms_submissions AS PERMISSIVE FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- cms_projects
DROP POLICY IF EXISTS "Admins can manage projects" ON public.cms_projects;
DROP POLICY IF EXISTS "Public can read published projects" ON public.cms_projects;

CREATE POLICY "Public can read published projects" ON public.cms_projects AS PERMISSIVE FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins can manage projects" ON public.cms_projects AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- cms_about
DROP POLICY IF EXISTS "Admins can manage about" ON public.cms_about;
DROP POLICY IF EXISTS "Public can read about" ON public.cms_about;

CREATE POLICY "Public can read about" ON public.cms_about AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage about" ON public.cms_about AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- cms_terms
DROP POLICY IF EXISTS "Admins can manage terms" ON public.cms_terms;
DROP POLICY IF EXISTS "Public can read terms" ON public.cms_terms;

CREATE POLICY "Public can read terms" ON public.cms_terms AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage terms" ON public.cms_terms AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- cms_how_it_works
DROP POLICY IF EXISTS "Admins can manage how it works" ON public.cms_how_it_works;
DROP POLICY IF EXISTS "Public can read how it works" ON public.cms_how_it_works;

CREATE POLICY "Public can read how it works" ON public.cms_how_it_works AS PERMISSIVE FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage how it works" ON public.cms_how_it_works AS PERMISSIVE FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));