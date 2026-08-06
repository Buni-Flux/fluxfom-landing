-- Flux AI core schema for Vespa-style growth operations
-- Admin-only tables and workflows, layered on top of existing Supabase auth.

CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  primary_contact_name text,
  primary_contact_email text NOT NULL,
  lifecycle_stage text NOT NULL DEFAULT 'lead' CHECK (lifecycle_stage IN ('lead', 'onboarding', 'active', 'at_risk', 'completed', 'churned')),
  industry text,
  website text,
  notes text,
  source text NOT NULL DEFAULT 'manual',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.client_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  cms_submission_id uuid REFERENCES public.cms_submissions(id) ON DELETE SET NULL,
  submission_source text NOT NULL DEFAULT 'intake_form' CHECK (submission_source IN ('intake_form', 'manual', 'imported', 'survey')),
  onboarding_status text NOT NULL DEFAULT 'new' CHECK (onboarding_status IN ('new', 'in_progress', 'abandoned', 'completed')),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  profile_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_classification jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'reviewed', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.client_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  client_submission_id uuid REFERENCES public.client_submissions(id) ON DELETE SET NULL,
  segment_key text NOT NULL,
  segment_name text NOT NULL,
  confidence numeric(5,2) NOT NULL DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 100),
  source text NOT NULL DEFAULT 'rules' CHECK (source IN ('rules', 'ai', 'hybrid', 'manual')),
  rationale jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'superseded')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.ai_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  client_submission_id uuid REFERENCES public.client_submissions(id) ON DELETE SET NULL,
  title text NOT NULL,
  summary text,
  input_context jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_output jsonb NOT NULL DEFAULT '{}'::jsonb,
  model_meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  review_notes jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_latest boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'approved', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  ai_brief_id uuid REFERENCES public.ai_briefs(id) ON DELETE SET NULL,
  name text NOT NULL,
  objective text,
  start_date date,
  end_date date,
  channels jsonb NOT NULL DEFAULT '[]'::jsonb,
  target_segment jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_review', 'ready', 'active', 'completed', 'archived')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.campaign_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  channel text NOT NULL,
  title text,
  draft_text text,
  draft_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  generation_context jsonb NOT NULL DEFAULT '{}'::jsonb,
  model_meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  version int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'reviewed', 'approved', 'published', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  trigger_event text NOT NULL CHECK (trigger_event IN ('new_submission', 'abandoned_onboarding', 'proposal_sent', 'project_completed', 'inactivity_14d')),
  conditions jsonb NOT NULL DEFAULT '{}'::jsonb,
  actions jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_automations_name_unique ON public.automations(name);

CREATE TABLE public.automation_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id uuid NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  client_submission_id uuid REFERENCES public.client_submissions(id) ON DELETE SET NULL,
  trigger_event text NOT NULL CHECK (trigger_event IN ('new_submission', 'abandoned_onboarding', 'proposal_sent', 'project_completed', 'inactivity_14d')),
  run_key text NOT NULL,
  input_context jsonb NOT NULL DEFAULT '{}'::jsonb,
  output_context jsonb NOT NULL DEFAULT '{}'::jsonb,
  error_message text,
  run_status text NOT NULL DEFAULT 'queued' CHECK (run_status IN ('queued', 'running', 'completed', 'failed', 'skipped')),
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (automation_id, run_key)
);

CREATE TABLE public.surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  delivery_channels jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed', 'archived')),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.survey_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  respondent_name text,
  respondent_email text,
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  sentiment jsonb NOT NULL DEFAULT '{}'::jsonb,
  score numeric(5,2),
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'flagged')),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.client_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  score_type text NOT NULL CHECK (score_type IN ('health', 'upsell')),
  score_value int NOT NULL CHECK (score_value >= 0 AND score_value <= 100),
  score_band text NOT NULL CHECK (score_band IN ('critical', 'watch', 'healthy', 'growth')),
  factors jsonb NOT NULL DEFAULT '{}'::jsonb,
  recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'current' CHECK (status IN ('current', 'superseded', 'archived')),
  calculated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  source text NOT NULL DEFAULT 'system' CHECK (source IN ('system', 'admin', 'automation', 'ai')),
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'info' CHECK (status IN ('info', 'success', 'warning', 'error')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- useful indexes
CREATE INDEX idx_clients_status ON public.clients(status);
CREATE INDEX idx_clients_lifecycle_stage ON public.clients(lifecycle_stage);
CREATE INDEX idx_client_submissions_client_id ON public.client_submissions(client_id);
CREATE INDEX idx_client_submissions_status ON public.client_submissions(onboarding_status, status);
CREATE INDEX idx_client_segments_client_id ON public.client_segments(client_id);
CREATE INDEX idx_client_segments_segment_key ON public.client_segments(segment_key, status);
CREATE INDEX idx_ai_briefs_client_id ON public.ai_briefs(client_id);
CREATE INDEX idx_ai_briefs_status ON public.ai_briefs(status, is_latest);
CREATE INDEX idx_campaigns_client_id ON public.campaigns(client_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaign_drafts_campaign_id ON public.campaign_drafts(campaign_id);
CREATE INDEX idx_campaign_drafts_status ON public.campaign_drafts(status, channel);
CREATE INDEX idx_automations_status ON public.automations(status, trigger_event);
CREATE INDEX idx_automation_runs_status ON public.automation_runs(run_status, trigger_event, created_at DESC);
CREATE INDEX idx_automation_runs_client_id ON public.automation_runs(client_id);
CREATE INDEX idx_surveys_client_id ON public.surveys(client_id);
CREATE INDEX idx_surveys_status ON public.surveys(status);
CREATE INDEX idx_survey_responses_survey_id ON public.survey_responses(survey_id);
CREATE INDEX idx_survey_responses_status ON public.survey_responses(status, submitted_at DESC);
CREATE INDEX idx_client_scores_client_id ON public.client_scores(client_id);
CREATE INDEX idx_client_scores_type_status ON public.client_scores(score_type, status, calculated_at DESC);
CREATE INDEX idx_activity_logs_client_id ON public.activity_logs(client_id, created_at DESC);
CREATE INDEX idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_status ON public.activity_logs(status, created_at DESC);

CREATE INDEX idx_ai_briefs_ai_output_gin ON public.ai_briefs USING gin (ai_output);
CREATE INDEX idx_campaign_drafts_payload_gin ON public.campaign_drafts USING gin (draft_payload);
CREATE INDEX idx_automation_runs_output_gin ON public.automation_runs USING gin (output_context);
CREATE INDEX idx_client_scores_factors_gin ON public.client_scores USING gin (factors);
CREATE INDEX idx_activity_logs_details_gin ON public.activity_logs USING gin (details);

-- updated_at triggers
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_submissions_updated_at
  BEFORE UPDATE ON public.client_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_segments_updated_at
  BEFORE UPDATE ON public.client_segments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_briefs_updated_at
  BEFORE UPDATE ON public.ai_briefs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaign_drafts_updated_at
  BEFORE UPDATE ON public.campaign_drafts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_automations_updated_at
  BEFORE UPDATE ON public.automations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_automation_runs_updated_at
  BEFORE UPDATE ON public.automation_runs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_surveys_updated_at
  BEFORE UPDATE ON public.surveys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_survey_responses_updated_at
  BEFORE UPDATE ON public.survey_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_scores_updated_at
  BEFORE UPDATE ON public.client_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activity_logs_updated_at
  BEFORE UPDATE ON public.activity_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- only one active latest brief per client
CREATE UNIQUE INDEX idx_ai_briefs_latest_per_client
  ON public.ai_briefs(client_id)
  WHERE is_latest = true;

CREATE OR REPLACE FUNCTION public.enforce_single_latest_ai_brief()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.is_latest THEN
    UPDATE public.ai_briefs
    SET is_latest = false
    WHERE client_id = NEW.client_id
      AND id <> NEW.id
      AND is_latest = true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_single_latest_ai_brief_trigger
  BEFORE INSERT OR UPDATE ON public.ai_briefs
  FOR EACH ROW EXECUTE FUNCTION public.enforce_single_latest_ai_brief();

-- RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_manage_clients" ON public.clients
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_client_submissions" ON public.client_submissions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_client_segments" ON public.client_segments
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_ai_briefs" ON public.ai_briefs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_campaigns" ON public.campaigns
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_campaign_drafts" ON public.campaign_drafts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_automations" ON public.automations
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_automation_runs" ON public.automation_runs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_surveys" ON public.surveys
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_survey_responses" ON public.survey_responses
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_client_scores" ON public.client_scores
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_manage_activity_logs" ON public.activity_logs
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
