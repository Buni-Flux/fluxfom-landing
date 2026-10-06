BEGIN;

CREATE TABLE IF NOT EXISTS public.project_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  access_token text UNIQUE,
  customer_type text NOT NULL CHECK (customer_type IN ('creative', 'personal', 'business')),
  display_name text NOT NULL,
  company_name text,
  email text,
  phone text,
  preferred_contact_method text CHECK (preferred_contact_method IN ('email', 'phone', 'whatsapp', 'text')),
  profession text,
  profile_url text,
  primary_goal text,
  services text[] NOT NULL DEFAULT '{}',
  project_description text,
  desired_outcome text,
  timeline text,
  title text NOT NULL,
  source text NOT NULL DEFAULT 'start_page',
  status text NOT NULL DEFAULT 'request_received' CHECK (status IN ('request_received', 'reviewing', 'strategy', 'in_progress', 'awaiting_client', 'review', 'completed', 'cancelled')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.project_requests(id) ON DELETE CASCADE,
  key text NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('received', 'reviewing', 'strategy', 'in_progress', 'awaiting_client', 'review', 'completed', 'upcoming')),
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.project_requests(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'review', 'completed')),
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_requests_user_id
  ON public.project_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_project_requests_status
  ON public.project_requests(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id
  ON public.project_milestones(project_id, display_order);
CREATE INDEX IF NOT EXISTS idx_project_deliverables_project_id
  ON public.project_deliverables(project_id, display_order);

DROP TRIGGER IF EXISTS update_project_requests_updated_at ON public.project_requests;
CREATE TRIGGER update_project_requests_updated_at
  BEFORE UPDATE ON public.project_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_project_milestones_updated_at ON public.project_milestones;
CREATE TRIGGER update_project_milestones_updated_at
  BEFORE UPDATE ON public.project_milestones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_project_deliverables_updated_at ON public.project_deliverables;
CREATE TRIGGER update_project_deliverables_updated_at
  BEFORE UPDATE ON public.project_deliverables
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_deliverables ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_can_view_own_projects ON public.project_requests;
CREATE POLICY users_can_view_own_projects ON public.project_requests
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS users_can_insert_own_projects ON public.project_requests;
CREATE POLICY users_can_insert_own_projects ON public.project_requests
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS users_can_update_own_projects ON public.project_requests;
CREATE POLICY users_can_update_own_projects ON public.project_requests
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS admins_manage_all_projects ON public.project_requests;
CREATE POLICY admins_manage_all_projects ON public.project_requests
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS users_can_view_own_project_milestones ON public.project_milestones;
CREATE POLICY users_can_view_own_project_milestones ON public.project_milestones
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.project_requests pr
    WHERE pr.id = project_milestones.project_id AND pr.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS users_can_insert_own_project_milestones ON public.project_milestones;
CREATE POLICY users_can_insert_own_project_milestones ON public.project_milestones
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.project_requests pr
    WHERE pr.id = project_milestones.project_id AND pr.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS users_can_update_own_project_milestones ON public.project_milestones;
CREATE POLICY users_can_update_own_project_milestones ON public.project_milestones
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.project_requests pr
    WHERE pr.id = project_milestones.project_id AND pr.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.project_requests pr
    WHERE pr.id = project_milestones.project_id AND pr.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS admins_manage_all_project_milestones ON public.project_milestones;
CREATE POLICY admins_manage_all_project_milestones ON public.project_milestones
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS users_can_view_own_project_deliverables ON public.project_deliverables;
CREATE POLICY users_can_view_own_project_deliverables ON public.project_deliverables
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.project_requests pr
    WHERE pr.id = project_deliverables.project_id AND pr.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS users_can_insert_own_project_deliverables ON public.project_deliverables;
CREATE POLICY users_can_insert_own_project_deliverables ON public.project_deliverables
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.project_requests pr
    WHERE pr.id = project_deliverables.project_id AND pr.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS users_can_update_own_project_deliverables ON public.project_deliverables;
CREATE POLICY users_can_update_own_project_deliverables ON public.project_deliverables
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.project_requests pr
    WHERE pr.id = project_deliverables.project_id AND pr.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.project_requests pr
    WHERE pr.id = project_deliverables.project_id AND pr.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS admins_manage_all_project_deliverables ON public.project_deliverables;
CREATE POLICY admins_manage_all_project_deliverables ON public.project_deliverables
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

GRANT SELECT, INSERT, UPDATE ON public.project_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.project_milestones TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.project_deliverables TO authenticated;
GRANT ALL ON public.project_requests TO service_role;
GRANT ALL ON public.project_milestones TO service_role;
GRANT ALL ON public.project_deliverables TO service_role;

COMMIT;