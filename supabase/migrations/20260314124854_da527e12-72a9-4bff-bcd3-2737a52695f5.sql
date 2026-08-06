
-- Works table for team collaboration on projects
CREATE TABLE public.cms_works (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  client_name text,
  category text NOT NULL DEFAULT 'Branding',
  status text NOT NULL DEFAULT 'draft',
  progress integer NOT NULL DEFAULT 0,
  public_token text UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  is_public boolean NOT NULL DEFAULT false,
  due_date timestamp with time zone,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Timeline / activity updates for each work
CREATE TABLE public.cms_work_updates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  work_id uuid NOT NULL REFERENCES public.cms_works(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cms_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_work_updates ENABLE ROW LEVEL SECURITY;

-- Admin full access to works
CREATE POLICY "admins_manage_works" ON public.cms_works
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Public read for shared works via token
CREATE POLICY "public_read_shared_works" ON public.cms_works
  FOR SELECT TO anon, authenticated
  USING (is_public = true);

-- Admin full access to work updates
CREATE POLICY "admins_manage_work_updates" ON public.cms_work_updates
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Public read updates for shared works
CREATE POLICY "public_read_shared_work_updates" ON public.cms_work_updates
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.cms_works w
      WHERE w.id = work_id AND w.is_public = true
    )
  );

-- Updated_at trigger
CREATE TRIGGER update_cms_works_updated_at
  BEFORE UPDATE ON public.cms_works
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
