-- Marketing OS core tables: workflow inputs, deliverables vault, next actions

CREATE TABLE public.workflow_inputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  section text NOT NULL,
  module text NOT NULL,
  input_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  completeness_score int NOT NULL DEFAULT 0 CHECK (completeness_score >= 0 AND completeness_score <= 100),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (brand_id, section, module)
);

CREATE TABLE public.deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  section text NOT NULL,
  module text,
  category text NOT NULL CHECK (category IN (
    'reports', 'brand-assets', 'strategy', 'research',
    'campaigns', 'presentations', 'calendars', 'exports'
  )),
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  format text NOT NULL DEFAULT 'document',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published')),
  source_agent text,
  version int NOT NULL DEFAULT 1,
  parent_id uuid REFERENCES public.deliverables(id) ON DELETE SET NULL,
  storage_paths text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

CREATE TABLE public.next_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  rationale text,
  priority text NOT NULL DEFAULT 'soon' CHECK (priority IN ('now', 'soon', 'watch')),
  section text,
  module text,
  path text NOT NULL,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'done', 'dismissed')),
  due_at timestamptz,
  created_by_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_workflow_inputs_brand ON public.workflow_inputs(brand_id);
CREATE INDEX idx_deliverables_brand ON public.deliverables(brand_id);
CREATE INDEX idx_deliverables_section ON public.deliverables(section);
CREATE INDEX idx_next_actions_brand_status ON public.next_actions(brand_id, status);

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS health_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS onboarding_progress jsonb NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.workflow_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.next_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mbuni_read_workflow_inputs"
  ON public.workflow_inputs FOR SELECT
  USING (public.user_can_view_section('mbuni-flux'));

CREATE POLICY "mbuni_write_workflow_inputs"
  ON public.workflow_inputs FOR ALL
  USING (public.user_can_edit_section('mbuni-flux'))
  WITH CHECK (public.user_can_edit_section('mbuni-flux'));

CREATE POLICY "mbuni_read_deliverables"
  ON public.deliverables FOR SELECT
  USING (public.user_can_view_section('mbuni-flux'));

CREATE POLICY "mbuni_write_deliverables"
  ON public.deliverables FOR ALL
  USING (public.user_can_edit_section('mbuni-flux'))
  WITH CHECK (public.user_can_edit_section('mbuni-flux'));

CREATE POLICY "mbuni_read_next_actions"
  ON public.next_actions FOR SELECT
  USING (public.user_can_view_section('mbuni-flux'));

CREATE POLICY "mbuni_write_next_actions"
  ON public.next_actions FOR ALL
  USING (public.user_can_edit_section('mbuni-flux'))
  WITH CHECK (public.user_can_edit_section('mbuni-flux'));
