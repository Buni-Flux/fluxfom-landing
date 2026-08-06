
-- Drop all RESTRICTIVE policies and recreate as PERMISSIVE

-- cms_submissions
DROP POLICY IF EXISTS "Anyone can insert submissions" ON public.cms_submissions;
DROP POLICY IF EXISTS "Admins can read submissions" ON public.cms_submissions;
DROP POLICY IF EXISTS "Admins can update submissions" ON public.cms_submissions;
DROP POLICY IF EXISTS "Admins can delete submissions" ON public.cms_submissions;

CREATE POLICY "Anyone can insert submissions" ON public.cms_submissions FOR INSERT TO anon, authenticated WITH CHECK (company_name IS NOT NULL AND email IS NOT NULL);
CREATE POLICY "Admins can read submissions" ON public.cms_submissions FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update submissions" ON public.cms_submissions FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete submissions" ON public.cms_submissions FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- cms_projects
DROP POLICY IF EXISTS "Admins can manage projects" ON public.cms_projects;
DROP POLICY IF EXISTS "Public can read published projects" ON public.cms_projects;

CREATE POLICY "Admins can manage projects" ON public.cms_projects FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Public can read published projects" ON public.cms_projects FOR SELECT TO anon, authenticated USING (published = true);

-- cms_about
DROP POLICY IF EXISTS "Admins can manage about" ON public.cms_about;
DROP POLICY IF EXISTS "Public can read about" ON public.cms_about;

CREATE POLICY "Admins can manage about" ON public.cms_about FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Public can read about" ON public.cms_about FOR SELECT TO anon, authenticated USING (true);

-- cms_terms
DROP POLICY IF EXISTS "Admins can manage terms" ON public.cms_terms;
DROP POLICY IF EXISTS "Public can read terms" ON public.cms_terms;

CREATE POLICY "Admins can manage terms" ON public.cms_terms FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Public can read terms" ON public.cms_terms FOR SELECT TO anon, authenticated USING (true);

-- cms_how_it_works
DROP POLICY IF EXISTS "Admins can manage how it works" ON public.cms_how_it_works;
DROP POLICY IF EXISTS "Public can read how it works" ON public.cms_how_it_works;

CREATE POLICY "Admins can manage how it works" ON public.cms_how_it_works FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Public can read how it works" ON public.cms_how_it_works FOR SELECT TO anon, authenticated USING (true);

-- user_roles
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;

CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
