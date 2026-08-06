-- FluxFom admin reporting & VESPA.AI intelligence layer
-- Extends Flux AI core schema with pipeline fields, opportunities, reporting views, and RPC bundle.

-- ---------------------------------------------------------------------------
-- 1) Column extensions
-- ---------------------------------------------------------------------------

ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS revenue_stage text NOT NULL DEFAULT 'discovery',
  ADD COLUMN IF NOT EXISTS pipeline_value numeric(14,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS primary_service_type text,
  ADD COLUMN IF NOT EXISTS vespa_last_activity_at timestamptz,
  ADD COLUMN IF NOT EXISTS has_used_vespa boolean NOT NULL DEFAULT false;

ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_revenue_stage_check;
ALTER TABLE public.clients ADD CONSTRAINT clients_revenue_stage_check
  CHECK (revenue_stage IN ('discovery', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'));

ALTER TABLE public.client_submissions
  ADD COLUMN IF NOT EXISTS service_type text NOT NULL DEFAULT 'brand_strategy',
  ADD COLUMN IF NOT EXISTS qualified_lead_at timestamptz,
  ADD COLUMN IF NOT EXISTS paid_client_at timestamptz,
  ADD COLUMN IF NOT EXISTS turnaround_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS approval_blocked boolean NOT NULL DEFAULT false;

ALTER TABLE public.client_submissions DROP CONSTRAINT IF EXISTS client_submissions_submission_source_check;
ALTER TABLE public.client_submissions ADD CONSTRAINT client_submissions_submission_source_check
  CHECK (submission_source IN ('intake_form', 'manual', 'imported', 'survey', 'referral', 'vespa'));

ALTER TABLE public.ai_briefs
  ADD COLUMN IF NOT EXISTS impact_score numeric(6,2),
  ADD COLUMN IF NOT EXISTS regeneration_count int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_output_type text NOT NULL DEFAULT 'brief',
  ADD COLUMN IF NOT EXISTS ai_status text;

UPDATE public.ai_briefs SET ai_status = status WHERE ai_status IS NULL;
ALTER TABLE public.ai_briefs ALTER COLUMN ai_status SET DEFAULT 'draft';
UPDATE public.ai_briefs SET ai_status = 'draft' WHERE ai_status IS NULL;
ALTER TABLE public.ai_briefs ALTER COLUMN ai_status SET NOT NULL;

ALTER TABLE public.ai_briefs DROP CONSTRAINT IF EXISTS ai_briefs_ai_output_type_check;
ALTER TABLE public.ai_briefs ADD CONSTRAINT ai_briefs_ai_output_type_check
  CHECK (ai_output_type IN ('brief', 'recommendation', 'score_summary', 'segmentation'));

ALTER TABLE public.ai_briefs DROP CONSTRAINT IF EXISTS ai_briefs_ai_status_check;
ALTER TABLE public.ai_briefs ADD CONSTRAINT ai_briefs_ai_status_check
  CHECK (ai_status IN ('draft', 'ready', 'approved', 'archived', 'failed', 'regenerated'));

ALTER TABLE public.campaign_drafts
  ADD COLUMN IF NOT EXISTS impact_score numeric(6,2),
  ADD COLUMN IF NOT EXISTS ai_output_type text NOT NULL DEFAULT 'campaign_draft',
  ADD COLUMN IF NOT EXISTS ai_status text;

UPDATE public.campaign_drafts SET ai_status = status WHERE ai_status IS NULL;
ALTER TABLE public.campaign_drafts ALTER COLUMN ai_status SET DEFAULT 'draft';
UPDATE public.campaign_drafts SET ai_status = 'draft' WHERE ai_status IS NULL;
ALTER TABLE public.campaign_drafts ALTER COLUMN ai_status SET NOT NULL;

ALTER TABLE public.campaign_drafts DROP CONSTRAINT IF EXISTS campaign_drafts_ai_output_type_check;
ALTER TABLE public.campaign_drafts ADD CONSTRAINT campaign_drafts_ai_output_type_check
  CHECK (ai_output_type IN ('campaign_draft', 'social_copy', 'email_sequence'));

ALTER TABLE public.campaign_drafts DROP CONSTRAINT IF EXISTS campaign_drafts_ai_status_check;
ALTER TABLE public.campaign_drafts ADD CONSTRAINT campaign_drafts_ai_status_check
  CHECK (ai_status IN ('draft', 'reviewed', 'approved', 'published', 'rejected', 'failed', 'regenerated'));

ALTER TABLE public.surveys
  ADD COLUMN IF NOT EXISTS sent_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_clients_revenue_stage ON public.clients(revenue_stage);
CREATE INDEX IF NOT EXISTS idx_clients_vespa_activity ON public.clients(vespa_last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_client_submissions_service ON public.client_submissions(service_type);
CREATE INDEX IF NOT EXISTS idx_client_submissions_qualified ON public.client_submissions(qualified_lead_at);
CREATE INDEX IF NOT EXISTS idx_ai_briefs_ai_output_type ON public.ai_briefs(ai_output_type, created_at DESC);

-- ---------------------------------------------------------------------------
-- 2) Opportunities
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  stage text NOT NULL DEFAULT 'discovery' CHECK (stage IN ('discovery', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  value_estimate numeric(14,2) NOT NULL DEFAULT 0,
  probability_pct int NOT NULL DEFAULT 25 CHECK (probability_pct >= 0 AND probability_pct <= 100),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'won', 'lost', 'archived')),
  vespa_identified boolean NOT NULL DEFAULT false,
  impact_score numeric(6,2),
  recommended_service text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_opportunities_client ON public.opportunities(client_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status, created_at DESC);

DROP TRIGGER IF EXISTS update_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_opportunities" ON public.opportunities;
CREATE POLICY "admins_manage_opportunities" ON public.opportunities
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------------
-- 3) Reporting views
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.v_ai_output_history AS
SELECT
  ab.id,
  ab.client_id,
  ab.ai_output_type::text AS ai_output_type,
  COALESCE(ab.ai_status, ab.status) AS ai_status,
  ab.impact_score,
  ab.created_at,
  ab.updated_at,
  'ai_brief'::text AS source_table,
  ab.title AS label
FROM public.ai_briefs ab
UNION ALL
SELECT
  cd.id,
  cd.client_id,
  cd.ai_output_type::text,
  COALESCE(cd.ai_status, cd.status),
  cd.impact_score,
  cd.created_at,
  cd.updated_at,
  'campaign_draft',
  COALESCE(cd.title, cd.channel)
FROM public.campaign_drafts cd;

CREATE OR REPLACE VIEW public.v_reporting_client_health AS
SELECT
  c.id AS client_id,
  c.company_name,
  c.lifecycle_stage,
  c.revenue_stage,
  c.pipeline_value,
  c.primary_service_type,
  c.has_used_vespa,
  c.vespa_last_activity_at,
  h.score_value AS health_score,
  h.score_band AS health_band,
  h.calculated_at AS health_calculated_at,
  u.score_value AS upsell_score,
  u.calculated_at AS upsell_calculated_at
FROM public.clients c
LEFT JOIN LATERAL (
  SELECT cs.score_value, cs.score_band, cs.calculated_at
  FROM public.client_scores cs
  WHERE cs.client_id = c.id AND cs.score_type = 'health' AND cs.status = 'current'
  ORDER BY cs.calculated_at DESC
  LIMIT 1
) h ON true
LEFT JOIN LATERAL (
  SELECT cs.score_value, cs.calculated_at
  FROM public.client_scores cs
  WHERE cs.client_id = c.id AND cs.score_type = 'upsell' AND cs.status = 'current'
  ORDER BY cs.calculated_at DESC
  LIMIT 1
) u ON true
WHERE c.status = 'active';

CREATE OR REPLACE VIEW public.v_reporting_opportunity_list AS
SELECT
  o.*,
  c.company_name
FROM public.opportunities o
JOIN public.clients c ON c.id = o.client_id;

CREATE OR REPLACE VIEW public.v_automation_run_detail AS
SELECT
  ar.*,
  a.name AS automation_name,
  c.company_name AS client_company
FROM public.automation_runs ar
LEFT JOIN public.automations a ON a.id = ar.automation_id
LEFT JOIN public.clients c ON c.id = ar.client_id;

-- ---------------------------------------------------------------------------
-- 4) Admin gate for RPCs
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.assert_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.assert_admin_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assert_admin_user() TO authenticated;

-- ---------------------------------------------------------------------------
-- 5) Main reporting RPC (single round-trip JSON bundle)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.rpc_reporting_bundle(
  p_from timestamptz,
  p_to timestamptz,
  p_service_type text DEFAULT NULL,
  p_vespa_feature text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_len interval;
  p_prev_from timestamptz;
  p_prev_to timestamptz;
  v_svc text := NULLIF(trim(p_service_type), '');
  v_feat text := NULLIF(trim(lower(p_vespa_feature)), '');
BEGIN
  PERFORM public.assert_admin_user();

  IF p_to <= p_from THEN
    RAISE EXCEPTION 'invalid_range';
  END IF;

  v_len := p_to - p_from;
  p_prev_to := p_from;
  p_prev_from := p_from - v_len;

  RETURN jsonb_build_object(
    'range', jsonb_build_object('from', p_from, 'to', p_to, 'prev_from', p_prev_from, 'prev_to', p_prev_to),
    'kpis', (
      WITH
      sub_base AS (
        SELECT cs.*
        FROM public.client_submissions cs
        WHERE cs.created_at >= p_from AND cs.created_at < p_to
          AND (v_svc IS NULL OR cs.service_type = v_svc)
      ),
      sub_prev AS (
        SELECT cs.*
        FROM public.client_submissions cs
        WHERE cs.created_at >= p_prev_from AND cs.created_at < p_prev_to
          AND (v_svc IS NULL OR cs.service_type = v_svc)
      )
      SELECT jsonb_build_object(
        'new_submissions', (SELECT count(*)::int FROM sub_base),
        'new_submissions_prev', (SELECT count(*)::int FROM sub_prev),
        'qualified_leads', (SELECT count(*)::int FROM sub_base WHERE qualified_lead_at IS NOT NULL),
        'qualified_leads_prev', (SELECT count(*)::int FROM sub_prev WHERE qualified_lead_at IS NOT NULL),
        'active_clients', (SELECT count(*)::int FROM public.clients WHERE status = 'active' AND lifecycle_stage = 'active' AND (v_svc IS NULL OR primary_service_type = v_svc OR primary_service_type IS NULL)),
        'conversion_rate', (
          SELECT CASE WHEN count(*) FILTER (WHERE sb.id IS NOT NULL) = 0 THEN 0
            ELSE round(100.0 * count(*) FILTER (WHERE sb.paid_client_at IS NOT NULL) / count(*), 2)
          END
          FROM sub_base sb
        ),
        'conversion_rate_prev', (
          SELECT CASE WHEN count(*) FILTER (WHERE sb.id IS NOT NULL) = 0 THEN 0
            ELSE round(100.0 * count(*) FILTER (WHERE sb.paid_client_at IS NOT NULL) / count(*), 2)
          END
          FROM sub_prev sb
        ),
        'revenue_pipeline_total', (SELECT coalesce(sum(pipeline_value), 0) FROM public.clients WHERE status = 'active' AND revenue_stage NOT IN ('closed_won', 'closed_lost')),
        'pending_approvals', (
          SELECT (
            (SELECT count(*)::int FROM public.ai_briefs ab WHERE ab.status IN ('draft', 'ready') AND (v_feat IS NULL OR v_feat = 'brief' OR ab.ai_output_type = v_feat))
            + (SELECT count(*)::int FROM public.campaign_drafts cd WHERE cd.status = 'draft' AND (v_feat IS NULL OR v_feat = 'campaign_draft' OR cd.ai_output_type = v_feat))
            + (SELECT count(*)::int FROM public.client_submissions cs WHERE cs.approval_blocked = true AND (v_svc IS NULL OR cs.service_type = v_svc))
          )::int
        ),
        'avg_turnaround_hours', (
          SELECT round(avg(extract(epoch from (turnaround_completed_at - submitted_at)) / 3600.0)::numeric, 1)
          FROM sub_base
          WHERE turnaround_completed_at IS NOT NULL
        ),
        'avg_turnaround_hours_prev', (
          SELECT round(avg(extract(epoch from (turnaround_completed_at - submitted_at)) / 3600.0)::numeric, 1)
          FROM sub_prev
          WHERE turnaround_completed_at IS NOT NULL
        ),
        'return_client_rate', (
          SELECT CASE WHEN count(DISTINCT client_id) = 0 THEN 0
            ELSE round(100.0 * count(DISTINCT client_id) FILTER (WHERE sc > 1) / count(DISTINCT client_id), 2)
          END
          FROM (
            SELECT client_id, count(*) AS sc FROM sub_base GROUP BY client_id
          ) s
        ),
        'vespa_drafts', (SELECT count(*)::int FROM public.campaign_drafts cd WHERE cd.created_at >= p_from AND cd.created_at < p_to AND (v_feat IS NULL OR cd.ai_output_type = v_feat)),
        'vespa_drafts_prev', (SELECT count(*)::int FROM public.campaign_drafts cd WHERE cd.created_at >= p_prev_from AND cd.created_at < p_prev_to AND (v_feat IS NULL OR cd.ai_output_type = v_feat)),
        'vespa_automations', (SELECT count(*)::int FROM public.automation_runs ar WHERE ar.created_at >= p_from AND ar.created_at < p_to AND (v_feat IS NULL OR v_feat = 'automation')),
        'vespa_automations_prev', (SELECT count(*)::int FROM public.automation_runs ar WHERE ar.created_at >= p_prev_from AND ar.created_at < p_prev_to),
        'vespa_surveys_completed', (SELECT count(*)::int FROM public.survey_responses sr WHERE sr.submitted_at >= p_from AND sr.submitted_at < p_to),
        'vespa_surveys_completed_prev', (SELECT count(*)::int FROM public.survey_responses sr WHERE sr.submitted_at >= p_prev_from AND sr.submitted_at < p_prev_to),
        'vespa_opportunities', (SELECT count(*)::int FROM public.opportunities o WHERE o.vespa_identified AND o.created_at >= p_from AND o.created_at < p_to),
        'vespa_opportunities_prev', (SELECT count(*)::int FROM public.opportunities o WHERE o.vespa_identified AND o.created_at >= p_prev_from AND o.created_at < p_prev_to),
        'vespa_briefs', (SELECT count(*)::int FROM public.ai_briefs ab WHERE ab.created_at >= p_from AND ab.created_at < p_to AND (v_feat IS NULL OR v_feat = 'brief' OR ab.ai_output_type = v_feat)),
        'vespa_briefs_prev', (SELECT count(*)::int FROM public.ai_briefs ab WHERE ab.created_at >= p_prev_from AND ab.created_at < p_prev_to AND (v_feat IS NULL OR v_feat = 'brief' OR ab.ai_output_type = v_feat)),
        'ai_regenerations', (SELECT coalesce(sum(ab.regeneration_count), 0)::int FROM public.ai_briefs ab WHERE ab.updated_at >= p_from AND ab.updated_at < p_to)
          + (SELECT count(*)::int FROM public.campaign_drafts cd WHERE cd.version > 1 AND cd.updated_at >= p_from AND cd.updated_at < p_to),
        'surveys_sent', (SELECT count(*)::int FROM public.surveys s WHERE coalesce(s.sent_at, s.created_at) >= p_from AND coalesce(s.sent_at, s.created_at) < p_to)
      )
    ),
    'funnel', (
      SELECT jsonb_build_object(
        'cms_submissions', (SELECT count(*)::int FROM public.cms_submissions cms WHERE cms.created_at >= p_from AND cms.created_at < p_to),
        'client_submissions', (SELECT count(*)::int FROM public.client_submissions cs WHERE cs.submitted_at >= p_from AND cs.submitted_at < p_to AND (v_svc IS NULL OR cs.service_type = v_svc)),
        'qualified_leads', (SELECT count(*)::int FROM public.client_submissions cs WHERE cs.qualified_lead_at IS NOT NULL AND cs.qualified_lead_at >= p_from AND cs.qualified_lead_at < p_to AND (v_svc IS NULL OR cs.service_type = v_svc)),
        'paid_clients', (SELECT count(*)::int FROM public.client_submissions cs WHERE cs.paid_client_at IS NOT NULL AND cs.paid_client_at >= p_from AND cs.paid_client_at < p_to AND (v_svc IS NULL OR cs.service_type = v_svc))
      )
    ),
    'demand_by_service', (
      SELECT coalesce(jsonb_agg(jsonb_build_object('service_type', service_type, 'count', cnt) ORDER BY cnt DESC), '[]'::jsonb)
      FROM (
        SELECT cs.service_type, count(*)::int AS cnt
        FROM public.client_submissions cs
        WHERE cs.submitted_at >= p_from AND cs.submitted_at < p_to
        GROUP BY cs.service_type
      ) x
    ),
    'health_distribution', (
      SELECT coalesce(jsonb_agg(jsonb_build_object('band', score_band, 'count', cnt)), '[]'::jsonb)
      FROM (
        SELECT cs.score_band, count(*)::int AS cnt
        FROM public.client_scores cs
        WHERE cs.score_type = 'health' AND cs.status = 'current'
        GROUP BY cs.score_band
      ) h
    ),
    'pipeline_by_stage', (
      SELECT coalesce(jsonb_agg(jsonb_build_object('revenue_stage', revenue_stage, 'total_value', tot) ORDER BY revenue_stage), '[]'::jsonb)
      FROM (
        SELECT c.revenue_stage, round(sum(c.pipeline_value)::numeric, 2) AS tot
        FROM public.clients c
        WHERE c.status = 'active'
        GROUP BY c.revenue_stage
      ) p
    ),
    'heatmap', (
      SELECT coalesce(jsonb_agg(jsonb_build_object(
          'dow', extract(dow from al.created_at)::int,
          'hour', extract(hour from al.created_at)::int,
          'count', cnt
        )), '[]'::jsonb)
      FROM (
        SELECT extract(dow from al.created_at) AS dow, extract(hour from al.created_at) AS hour, count(*)::int AS cnt
        FROM public.activity_logs al
        WHERE al.created_at >= p_from AND al.created_at < p_to
        GROUP BY 1, 2
      ) al
    ),
    'series', (
      WITH days AS (
        SELECT generate_series(date_trunc('day', p_from)::date, (date_trunc('day', p_to) - interval '1 day')::date, interval '1 day')::date AS d
      )
      SELECT coalesce(jsonb_agg(jsonb_build_object(
          'day', d.d,
          'submissions', (SELECT count(*) FROM public.client_submissions cs WHERE cs.submitted_at >= d.d AND cs.submitted_at < d.d + 1 AND (v_svc IS NULL OR cs.service_type = v_svc)),
          'qualified', (SELECT count(*) FROM public.client_submissions cs WHERE cs.qualified_lead_at >= d.d AND cs.qualified_lead_at < d.d + 1 AND (v_svc IS NULL OR cs.service_type = v_svc)),
          'conversions', (SELECT count(*) FROM public.client_submissions cs WHERE cs.paid_client_at >= d.d AND cs.paid_client_at < d.d + 1 AND (v_svc IS NULL OR cs.service_type = v_svc))
        ) ORDER BY d.d), '[]'::jsonb)
      FROM days d
    ),
    'vespa_series', (
      WITH days AS (
        SELECT generate_series(date_trunc('day', p_from)::date, (date_trunc('day', p_to) - interval '1 day')::date, interval '1 day')::date AS d
      )
      SELECT coalesce(jsonb_agg(jsonb_build_object(
          'day', d.d,
          'outputs', (
            (SELECT count(*) FROM public.ai_briefs ab WHERE ab.created_at >= d.d AND ab.created_at < d.d + 1)
            + (SELECT count(*) FROM public.campaign_drafts cd WHERE cd.created_at >= d.d AND cd.created_at < d.d + 1)
          ),
          'automations', (SELECT count(*) FROM public.automation_runs ar WHERE ar.created_at >= d.d AND ar.created_at < d.d + 1),
          'volume', (
            (SELECT count(*) FROM public.ai_briefs ab WHERE ab.created_at >= d.d AND ab.created_at < d.d + 1)
            + (SELECT count(*) FROM public.campaign_drafts cd WHERE cd.created_at >= d.d AND cd.created_at < d.d + 1)
            + (SELECT count(*) FROM public.survey_responses sr WHERE sr.submitted_at >= d.d AND sr.submitted_at < d.d + 1)
          )
        ) ORDER BY d.d), '[]'::jsonb)
      FROM days d
    ),
    'ai_outputs_by_type', (
      SELECT jsonb_build_object(
        'brief', (SELECT count(*)::int FROM public.ai_briefs ab WHERE ab.created_at >= p_from AND ab.created_at < p_to),
        'campaign_draft', (SELECT count(*)::int FROM public.campaign_drafts cd WHERE cd.created_at >= p_from AND cd.created_at < p_to),
        'recommendation', (SELECT count(*)::int FROM public.ai_briefs ab WHERE ab.created_at >= p_from AND ab.created_at < p_to AND ab.ai_output_type = 'recommendation'),
        'survey', (SELECT count(*)::int FROM public.surveys s WHERE s.created_at >= p_from AND s.created_at < p_to)
      )
    ),
    'automation_outcomes', (
      SELECT coalesce(jsonb_agg(jsonb_build_object('outcome', outcome, 'count', cnt)), '[]'::jsonb)
      FROM (
        SELECT
          CASE ar.run_status
            WHEN 'completed' THEN 'success'
            WHEN 'failed' THEN 'failed'
            ELSE 'warning'
          END AS outcome,
          count(*)::int AS cnt
        FROM public.automation_runs ar
        WHERE ar.created_at >= p_from AND ar.created_at < p_to
        GROUP BY 1
      ) z
    ),
    'top_clients_vespa', (
      SELECT coalesce(jsonb_agg(row_to_json(x)::jsonb), '[]'::jsonb)
      FROM (
        SELECT c.company_name AS client_name, c.id AS client_id,
          (
            (SELECT count(*) FROM public.ai_briefs ab WHERE ab.client_id = c.id AND ab.created_at >= p_from AND ab.created_at < p_to)
            + (SELECT count(*) FROM public.campaign_drafts cd WHERE cd.client_id = c.id AND cd.created_at >= p_from AND cd.created_at < p_to)
            + (SELECT count(*) FROM public.automation_runs ar WHERE ar.client_id = c.id AND ar.created_at >= p_from AND ar.created_at < p_to)
          )::int AS usage_score
        FROM public.clients c
        WHERE c.status = 'active'
        ORDER BY usage_score DESC NULLS LAST
        LIMIT 12
      ) x
    ),
    'vespa_impact', (
      SELECT jsonb_build_object(
        'conversion_with_vespa', (
          SELECT round(100.0 * count(*) FILTER (WHERE cs.paid_client_at IS NOT NULL) / nullif(count(*), 0), 2)
          FROM public.client_submissions cs
          JOIN public.clients c ON c.id = cs.client_id
          WHERE cs.submitted_at >= p_from AND cs.submitted_at < p_to AND c.has_used_vespa
        ),
        'conversion_without_vespa', (
          SELECT round(100.0 * count(*) FILTER (WHERE cs.paid_client_at IS NOT NULL) / nullif(count(*), 0), 2)
          FROM public.client_submissions cs
          JOIN public.clients c ON c.id = cs.client_id
          WHERE cs.submitted_at >= p_from AND cs.submitted_at < p_to AND NOT c.has_used_vespa
        ),
        'avg_turnaround_vespa_hours', (
          SELECT round(avg(extract(epoch from (cs.turnaround_completed_at - cs.submitted_at)) / 3600.0)::numeric, 1)
          FROM public.client_submissions cs
          JOIN public.clients c ON c.id = cs.client_id
          WHERE cs.turnaround_completed_at IS NOT NULL AND cs.submitted_at >= p_from AND cs.submitted_at < p_to AND c.has_used_vespa
        ),
        'avg_turnaround_no_vespa_hours', (
          SELECT round(avg(extract(epoch from (cs.turnaround_completed_at - cs.submitted_at)) / 3600.0)::numeric, 1)
          FROM public.client_submissions cs
          JOIN public.clients c ON c.id = cs.client_id
          WHERE cs.turnaround_completed_at IS NOT NULL AND cs.submitted_at >= p_from AND cs.submitted_at < p_to AND NOT c.has_used_vespa
        ),
        'upsell_detected', (SELECT count(*)::int FROM public.opportunities o WHERE o.vespa_identified AND o.recommended_service IS NOT NULL AND o.created_at >= p_from AND o.created_at < p_to),
        'pipeline_influenced_value', (
          SELECT round(coalesce(sum(o.value_estimate), 0)::numeric, 2)
          FROM public.opportunities o
          WHERE o.vespa_identified AND o.created_at >= p_from AND o.created_at < p_to
        ),
        'survey_satisfaction_avg', (
          SELECT round(avg(sr.score)::numeric, 2) FROM public.survey_responses sr
          WHERE sr.submitted_at >= p_from AND sr.submitted_at < p_to AND sr.score IS NOT NULL
        ),
        'health_after_vespa_delta', (
          SELECT round(avg(cs.score_value)::numeric, 1)
          FROM public.client_scores cs
          JOIN public.clients c ON c.id = cs.client_id
          WHERE cs.score_type = 'health' AND cs.status = 'current' AND c.has_used_vespa
        ),
        'top_automation_trigger', (
          SELECT ar.trigger_event FROM public.automation_runs ar
          WHERE ar.created_at >= p_from AND ar.created_at < p_to AND ar.run_status = 'completed'
          GROUP BY ar.trigger_event ORDER BY count(*) DESC LIMIT 1
        ),
        'top_recommended_service', (
          SELECT o.recommended_service FROM public.opportunities o
          WHERE o.vespa_identified AND o.created_at >= p_from AND o.created_at < p_to AND o.recommended_service IS NOT NULL
          GROUP BY o.recommended_service ORDER BY count(*) DESC LIMIT 1
        )
      )
    ),
    'vespa_usage_totals', (
      SELECT jsonb_build_object(
        'briefs', (SELECT count(*)::int FROM public.ai_briefs),
        'campaign_drafts', (SELECT count(*)::int FROM public.campaign_drafts),
        'automation_runs', (SELECT count(*)::int FROM public.automation_runs),
        'surveys_sent', (SELECT count(*)::int FROM public.surveys WHERE sent_at IS NOT NULL OR status IN ('active', 'closed')),
        'survey_responses', (SELECT count(*)::int FROM public.survey_responses),
        'ai_regenerations', (SELECT coalesce(sum(regeneration_count), 0)::int FROM public.ai_briefs)
          + (SELECT count(*)::int FROM public.campaign_drafts WHERE version > 1),
        'avg_generations_per_client', (
          SELECT round((count(*)::numeric / nullif((SELECT count(*) FROM public.clients WHERE status = 'active'), 0)), 2)
          FROM (
            SELECT ab.client_id FROM public.ai_briefs ab
            UNION ALL
            SELECT cd.client_id FROM public.campaign_drafts cd
          ) g
        ),
        'most_used_feature', (
          SELECT feature FROM (
            SELECT 'briefs'::text AS feature, count(*) AS c FROM public.ai_briefs
            UNION ALL SELECT 'campaign_drafts', count(*) FROM public.campaign_drafts
            UNION ALL SELECT 'automations', count(*) FROM public.automation_runs
            UNION ALL SELECT 'surveys', count(*) FROM public.surveys
          ) s ORDER BY c DESC LIMIT 1
        )
      )
    ),
    'recent_activity', (
      SELECT coalesce(jsonb_agg(row_to_json(a)::jsonb), '[]'::jsonb)
      FROM (
        SELECT al.id, al.action, al.entity_type, al.status, al.source, al.created_at, al.client_id, c.company_name
        FROM public.activity_logs al
        LEFT JOIN public.clients c ON c.id = al.client_id
        ORDER BY al.created_at DESC
        LIMIT 40
      ) a
    ),
    'recent_vespa_outputs', (
      SELECT coalesce(jsonb_agg(row_to_json(v)::jsonb), '[]'::jsonb)
      FROM (
        SELECT * FROM public.v_ai_output_history
        ORDER BY created_at DESC
        LIMIT 20
      ) v
    ),
    'stalled', (
      SELECT jsonb_build_object(
        'overdue_submissions', (
          SELECT coalesce(jsonb_agg(jsonb_build_object(
            'id', cs.id, 'client_id', cs.client_id, 'company', cl.company_name,
            'submitted_at', cs.submitted_at, 'onboarding_status', cs.onboarding_status
          )), '[]'::jsonb)
          FROM public.client_submissions cs
          JOIN public.clients cl ON cl.id = cs.client_id
          WHERE cs.onboarding_status = 'in_progress' AND cs.submitted_at < now() - interval '14 days'
            AND (v_svc IS NULL OR cs.service_type = v_svc)
          LIMIT 20
        ),
        'stale_ai_briefs', (
          SELECT coalesce(jsonb_agg(jsonb_build_object(
            'id', ab.id, 'client_id', ab.client_id, 'company', cl.company_name, 'status', ab.status, 'updated_at', ab.updated_at
          )), '[]'::jsonb)
          FROM public.ai_briefs ab
          JOIN public.clients cl ON cl.id = ab.client_id
          WHERE ab.status = 'draft' AND ab.updated_at < now() - interval '7 days'
          LIMIT 15
        )
      )
    ),
    'operations', (
      SELECT jsonb_build_object(
        'latest_automation_runs', (
          SELECT coalesce(jsonb_agg(row_to_json(r)::jsonb), '[]'::jsonb)
          FROM (
            SELECT ar.id, ar.run_status, ar.trigger_event, ar.created_at, ar.client_id, ar.error_message, vd.automation_name, vd.client_company
            FROM public.automation_runs ar
            LEFT JOIN public.v_automation_run_detail vd ON vd.id = ar.id
            ORDER BY ar.created_at DESC
            LIMIT 25
          ) r
        ),
        'failed_automations', (
          SELECT coalesce(jsonb_agg(row_to_json(r)::jsonb), '[]'::jsonb)
          FROM (
            SELECT ar.id, ar.run_status, ar.trigger_event, ar.created_at, ar.client_id, ar.error_message, vd.client_company
            FROM public.automation_runs ar
            LEFT JOIN public.v_automation_run_detail vd ON vd.id = ar.id
            WHERE ar.run_status = 'failed'
            ORDER BY ar.created_at DESC
            LIMIT 15
          ) r
        ),
        'clients_no_recent_ai', (
          SELECT coalesce(jsonb_agg(jsonb_build_object(
            'client_id', c.id, 'company_name', c.company_name, 'vespa_last_activity_at', c.vespa_last_activity_at
          )), '[]'::jsonb)
          FROM public.clients c
          WHERE c.status = 'active' AND (c.vespa_last_activity_at IS NULL OR c.vespa_last_activity_at < now() - interval '30 days')
          ORDER BY c.company_name
          LIMIT 15
        ),
        'high_activity_low_conversion', (
          SELECT coalesce(jsonb_agg(jsonb_build_object(
            'client_id', c.id, 'company_name', c.company_name,
            'ai_events', evt.cnt,
            'conversion_flag', EXISTS (SELECT 1 FROM public.client_submissions s WHERE s.client_id = c.id AND s.paid_client_at IS NOT NULL)
          )), '[]'::jsonb)
          FROM public.clients c
          JOIN (
            SELECT client_id, count(*) AS cnt FROM (
              SELECT client_id FROM public.ai_briefs WHERE created_at >= p_from AND created_at < p_to
              UNION ALL
              SELECT client_id FROM public.campaign_drafts WHERE created_at >= p_from AND created_at < p_to
            ) u GROUP BY client_id
          ) evt ON evt.client_id = c.id
          WHERE evt.cnt >= 5
            AND NOT EXISTS (SELECT 1 FROM public.client_submissions s WHERE s.client_id = c.id AND s.paid_client_at IS NOT NULL)
          ORDER BY evt.cnt DESC
          LIMIT 12
        ),
        'upsell_recommended_clients', (
          SELECT coalesce(jsonb_agg(jsonb_build_object(
            'client_id', c.id, 'company_name', c.company_name, 'upsell_score', cs.score_value
          )), '[]'::jsonb)
          FROM public.clients c
          JOIN public.client_scores cs ON cs.client_id = c.id AND cs.score_type = 'upsell' AND cs.status = 'current'
          WHERE cs.score_band IN ('growth', 'healthy') AND cs.score_value >= 70
          ORDER BY cs.score_value DESC
          LIMIT 15
        ),
        'at_risk_clients', (
          SELECT coalesce(jsonb_agg(jsonb_build_object(
            'client_id', c.id, 'company_name', c.company_name, 'lifecycle_stage', c.lifecycle_stage
          )), '[]'::jsonb)
          FROM public.clients c
          WHERE c.lifecycle_stage = 'at_risk' AND c.status = 'active'
          LIMIT 20
        )
      )
    ),
    'highlights', (
      SELECT coalesce(jsonb_agg(h ORDER BY ord), '[]'::jsonb)
      FROM (
        SELECT 1 AS ord, jsonb_build_object(
          'kind', 'attention',
          'title', 'Approvals & blocks',
          'detail', (SELECT concat(count(*)::text, ' items need review') FROM public.client_submissions csb WHERE csb.approval_blocked)
        ) AS h
        UNION ALL
        SELECT 2, jsonb_build_object(
          'kind', 'growing',
          'title', 'Pipeline momentum',
          'detail', (SELECT concat('Pipeline value ', round(sum(pipeline_value)::numeric, 0)::text) FROM public.clients WHERE status = 'active' AND revenue_stage NOT IN ('closed_won', 'closed_lost'))
        )
        UNION ALL
        SELECT 3, jsonb_build_object(
          'kind', 'vespa',
          'title', 'VESPA output',
          'detail', (SELECT concat(
            (SELECT count(*)::text FROM public.ai_briefs WHERE created_at >= p_from AND created_at < p_to),
            ' briefs · ',
            (SELECT count(*)::text FROM public.campaign_drafts WHERE created_at >= p_from AND created_at < p_to),
            ' drafts in range'
          ))
        )
      ) z
    )
  );
END;
$$;

REVOKE ALL ON FUNCTION public.rpc_reporting_bundle(timestamptz, timestamptz, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.rpc_reporting_bundle(timestamptz, timestamptz, text, text) TO authenticated;

COMMENT ON FUNCTION public.rpc_reporting_bundle IS 'Admin-only JSON bundle for FluxFom intelligence dashboard (KPIs, charts, VESPA, operations).';

-- ---------------------------------------------------------------------------
-- 6) Demo seed (idempotent via clients.metadata seed tag)
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  seed_exists boolean;
  c1 uuid; c2 uuid; c3 uuid; c4 uuid; c5 uuid;
  camp uuid; surv uuid; auto_id uuid;
  d0 timestamptz := date_trunc('day', now()) - interval '120 days';
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.clients c WHERE (c.metadata ->> 'seed') = 'dashboard_demo' LIMIT 1
  ) INTO seed_exists;

  IF seed_exists THEN
    RETURN;
  END IF;

  INSERT INTO public.clients (company_name, primary_contact_name, primary_contact_email, lifecycle_stage, industry, revenue_stage, pipeline_value, primary_service_type, has_used_vespa, vespa_last_activity_at, metadata)
  VALUES
    ('Demo Northwind Labs', 'Avery Chen', 'avery@demo.fluxfom', 'active', 'Technology', 'negotiation', 128000, 'brand_strategy', true, now() - interval '2 days', '{"seed":"dashboard_demo"}'::jsonb),
    ('Demo Harbor & Co', 'Jordan Lee', 'jordan@demo.fluxfom', 'active', 'Retail', 'proposal', 54000, 'social_campaigns', true, now() - interval '20 days', '{"seed":"dashboard_demo"}'::jsonb),
    ('Demo Lumen Studio', 'Riley Park', 'riley@demo.fluxfom', 'onboarding', 'Creative', 'qualified', 22000, 'content_system', false, NULL, '{"seed":"dashboard_demo"}'::jsonb),
    ('Demo Atlas Freight', 'Morgan Blake', 'morgan@demo.fluxfom', 'at_risk', 'Logistics', 'discovery', 8000, 'brand_strategy', true, now() - interval '45 days', '{"seed":"dashboard_demo"}'::jsonb),
    ('Demo Cedar Health', 'Casey Ng', 'casey@demo.fluxfom', 'active', 'Healthcare', 'closed_won', 0, 'brand_strategy', true, now() - interval '1 day', '{"seed":"dashboard_demo"}'::jsonb);

  SELECT id INTO c1 FROM public.clients WHERE company_name = 'Demo Northwind Labs' LIMIT 1;
  SELECT id INTO c2 FROM public.clients WHERE company_name = 'Demo Harbor & Co' LIMIT 1;
  SELECT id INTO c3 FROM public.clients WHERE company_name = 'Demo Lumen Studio' LIMIT 1;
  SELECT id INTO c4 FROM public.clients WHERE company_name = 'Demo Atlas Freight' LIMIT 1;
  SELECT id INTO c5 FROM public.clients WHERE company_name = 'Demo Cedar Health' LIMIT 1;

  INSERT INTO public.client_submissions (client_id, submission_source, onboarding_status, submitted_at, service_type, qualified_lead_at, paid_client_at, turnaround_completed_at, approval_blocked, profile_data, ai_classification)
  SELECT c1, 'intake_form', 'completed', d0 + interval '10 days', 'brand_strategy', d0 + interval '11 days', d0 + interval '18 days', d0 + interval '19 days', false, '{}', '{}'
  WHERE c1 IS NOT NULL;

  INSERT INTO public.client_submissions (client_id, submission_source, onboarding_status, submitted_at, service_type, qualified_lead_at, paid_client_at, turnaround_completed_at, approval_blocked, profile_data, ai_classification)
  SELECT c2, 'referral', 'completed', d0 + interval '40 days', 'social_campaigns', d0 + interval '41 days', d0 + interval '55 days', d0 + interval '56 days', false, '{}', '{}'
  WHERE c2 IS NOT NULL;

  INSERT INTO public.client_submissions (client_id, submission_source, onboarding_status, submitted_at, service_type, qualified_lead_at, paid_client_at, turnaround_completed_at, approval_blocked, profile_data, ai_classification)
  SELECT c3, 'intake_form', 'in_progress', now() - interval '20 days', 'content_system', NULL, NULL, NULL, true, '{}', '{}'
  WHERE c3 IS NOT NULL;

  INSERT INTO public.client_submissions (client_id, submission_source, onboarding_status, submitted_at, service_type, qualified_lead_at, paid_client_at, turnaround_completed_at, approval_blocked, profile_data, ai_classification)
  SELECT c4, 'survey', 'abandoned', now() - interval '60 days', 'brand_strategy', NULL, NULL, NULL, false, '{}', '{}'
  WHERE c4 IS NOT NULL;

  INSERT INTO public.client_submissions (client_id, submission_source, onboarding_status, submitted_at, service_type, qualified_lead_at, paid_client_at, turnaround_completed_at, approval_blocked, profile_data, ai_classification)
  SELECT c5, 'vespa', 'completed', d0 + interval '90 days', 'brand_strategy', d0 + interval '91 days', d0 + interval '100 days', d0 + interval '102 days', false, '{}', '{}'
  WHERE c5 IS NOT NULL;

  -- Extra submissions spread over last 90 days for charts
  FOR i IN 1..28 LOOP
    INSERT INTO public.client_submissions (client_id, submission_source, onboarding_status, submitted_at, service_type, qualified_lead_at, paid_client_at, turnaround_completed_at, approval_blocked, profile_data, ai_classification)
    VALUES (
      (ARRAY[c1, c2, c3, c4, c5])[1 + (i % 5)],
      CASE WHEN i % 4 = 0 THEN 'intake_form' WHEN i % 4 = 1 THEN 'manual' WHEN i % 4 = 2 THEN 'referral' ELSE 'survey' END,
      CASE WHEN i % 7 = 0 THEN 'new' WHEN i % 7 = 1 THEN 'in_progress' ELSE 'completed' END,
      now() - (i * interval '3 days'),
      CASE WHEN i % 3 = 0 THEN 'brand_strategy' WHEN i % 3 = 1 THEN 'social_campaigns' ELSE 'content_system' END,
      CASE WHEN i % 2 = 0 THEN now() - (i * interval '3 days') + interval '1 day' ELSE NULL END,
      CASE WHEN i % 3 = 0 THEN now() - (i * interval '3 days') + interval '5 days' ELSE NULL END,
      CASE WHEN i % 3 = 0 THEN now() - (i * interval '3 days') + interval '6 days' ELSE NULL END,
      i % 11 = 0,
      '{}',
      '{}'
    );
  END LOOP;

  INSERT INTO public.ai_briefs (client_id, title, summary, status, ai_output_type, ai_status, impact_score, regeneration_count, is_latest)
  SELECT c1, 'VESPA Strategy Brief', 'Positioning refresh', 'ready', 'brief', 'ready', 82.5, 1, true WHERE c1 IS NOT NULL;

  INSERT INTO public.ai_briefs (client_id, title, summary, status, ai_output_type, ai_status, impact_score, regeneration_count, is_latest)
  SELECT c2, 'Retail uplift recommendations', 'Omnichannel plan', 'draft', 'recommendation', 'draft', 64.0, 0, true WHERE c2 IS NOT NULL;

  INSERT INTO public.campaigns (client_id, name, objective, status)
  SELECT c1, 'Demo Always-On Social', 'Awareness', 'active' WHERE c1 IS NOT NULL RETURNING id INTO camp;
  IF camp IS NULL THEN
    SELECT id INTO camp FROM public.campaigns WHERE client_id = c1 ORDER BY created_at DESC LIMIT 1;
  END IF;

  INSERT INTO public.campaign_drafts (campaign_id, client_id, channel, title, draft_text, status, version, impact_score, ai_output_type, ai_status)
  SELECT camp, c1, 'instagram', 'Launch carousel', 'Hook + CTA variants…', 'reviewed', 1, 71.0, 'campaign_draft', 'reviewed'
  WHERE camp IS NOT NULL AND c1 IS NOT NULL;

  INSERT INTO public.campaign_drafts (campaign_id, client_id, channel, title, draft_text, status, version, impact_score, ai_output_type, ai_status)
  SELECT camp, c1, 'email', 'Lifecycle nudge', 'Subject lines…', 'draft', 2, 55.0, 'campaign_draft', 'draft'
  WHERE camp IS NOT NULL AND c1 IS NOT NULL;

  INSERT INTO public.automations (name, description, trigger_event, status)
  VALUES ('Demo · New submission nurture', 'Sends welcome sequence', 'new_submission', 'active')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO auto_id;

  IF auto_id IS NULL THEN
    SELECT id INTO auto_id FROM public.automations WHERE name = 'Demo · New submission nurture' LIMIT 1;
  END IF;

  INSERT INTO public.automation_runs (automation_id, client_id, trigger_event, run_key, run_status, started_at, finished_at, output_context)
  SELECT auto_id, c1, 'new_submission', 'demo-run-' || gen_random_uuid()::text, 'completed', now() - interval '3 hours', now() - interval '3 hours' + interval '2 minutes', '{"sent":true}'::jsonb
  WHERE auto_id IS NOT NULL AND c1 IS NOT NULL;

  INSERT INTO public.automation_runs (automation_id, client_id, trigger_event, run_key, run_status, started_at, finished_at, error_message)
  SELECT auto_id, c4, 'inactivity_14d', 'demo-fail-' || gen_random_uuid()::text, 'failed', now() - interval '1 day', now() - interval '1 day', 'Webhook timeout'
  WHERE auto_id IS NOT NULL AND c4 IS NOT NULL;

  INSERT INTO public.surveys (client_id, title, status, sent_at)
  SELECT c2, 'Post-delivery NPS', 'active', now() - interval '5 days' WHERE c2 IS NOT NULL RETURNING id INTO surv;
  IF surv IS NULL THEN
    SELECT id INTO surv FROM public.surveys WHERE client_id = c2 ORDER BY created_at DESC LIMIT 1;
  END IF;

  INSERT INTO public.survey_responses (survey_id, client_id, respondent_email, responses, score, status, submitted_at)
  SELECT surv, c2, 'jordan@demo.fluxfom', '{"nps":9}'::jsonb, 88.0, 'submitted', now() - interval '4 days'
  WHERE surv IS NOT NULL;

  INSERT INTO public.client_scores (client_id, score_type, score_value, score_band, factors, recommendations, status)
  VALUES
    (c1, 'health', 78, 'healthy', '{}', '[]', 'current'),
    (c1, 'upsell', 72, 'growth', '{}', '[]', 'current'),
    (c2, 'health', 62, 'watch', '{}', '[]', 'current'),
    (c4, 'health', 34, 'critical', '{}', '[]', 'current'),
    (c5, 'health', 91, 'growth', '{}', '[]', 'current');

  INSERT INTO public.opportunities (client_id, title, stage, value_estimate, probability_pct, status, vespa_identified, impact_score, recommended_service)
  VALUES
    (c1, 'Annual creative retainer expansion', 'negotiation', 96000, 55, 'open', true, 88.0, 'content_system'),
    (c2, 'Retail media pilot', 'proposal', 24000, 40, 'open', true, 70.0, 'social_campaigns'),
    (c3, 'Studio ops automation', 'discovery', 12000, 25, 'open', true, 52.0, 'brand_strategy');

  FOR h IN 0..167 LOOP
    INSERT INTO public.activity_logs (client_id, action, entity_type, source, details, status, created_at)
    VALUES (
      (ARRAY[c1, c2, c3, c4, c5])[1 + (h % 5)],
      CASE WHEN h % 5 = 0 THEN 'touchpoint' WHEN h % 5 = 1 THEN 'brief_viewed' ELSE 'status_change' END,
      'client',
      CASE WHEN h % 8 = 0 THEN 'ai' ELSE 'admin' END,
      '{}'::jsonb,
      CASE WHEN h % 13 = 0 THEN 'warning' WHEN h % 17 = 0 THEN 'error' ELSE 'success' END,
      now() - (h * interval '90 minutes')
    );
  END LOOP;

END $$;
