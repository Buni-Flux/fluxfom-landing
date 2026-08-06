
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- CMS: Projects table
CREATE TABLE public.cms_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Branding',
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published projects" ON public.cms_projects
  FOR SELECT USING (published = true);
CREATE POLICY "Admins can manage projects" ON public.cms_projects
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_cms_projects_updated_at BEFORE UPDATE ON public.cms_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CMS: How It Works steps
CREATE TABLE public.cms_how_it_works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'Search',
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_how_it_works ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read how it works" ON public.cms_how_it_works
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage how it works" ON public.cms_how_it_works
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_cms_how_it_works_updated_at BEFORE UPDATE ON public.cms_how_it_works
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CMS: About page content
CREATE TABLE public.cms_about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  content TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_about ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read about" ON public.cms_about
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage about" ON public.cms_about
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_cms_about_updated_at BEFORE UPDATE ON public.cms_about
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CMS: Terms of Service sections
CREATE TABLE public.cms_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_title TEXT NOT NULL,
  content TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read terms" ON public.cms_terms
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage terms" ON public.cms_terms
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_cms_terms_updated_at BEFORE UPDATE ON public.cms_terms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CMS: Brand onboarding submissions
CREATE TABLE public.cms_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  industry TEXT,
  email TEXT NOT NULL,
  website TEXT,
  brand_status TEXT,
  existing_assets TEXT,
  business_goals TEXT,
  tone_preferences TEXT,
  target_audience TEXT,
  competitors TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can read submissions" ON public.cms_submissions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can insert submissions" ON public.cms_submissions
  FOR INSERT WITH CHECK (true);

-- Storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-assets', 'cms-assets', true);
CREATE POLICY "Public can view cms assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms-assets');
CREATE POLICY "Admins can upload cms assets" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cms-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update cms assets" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'cms-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete cms assets" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'cms-assets' AND public.has_role(auth.uid(), 'admin'));
