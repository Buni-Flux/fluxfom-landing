-- Unified Mbuni Flux permission: one row (mbuni-flux) grants all DAGS / Flux AI areas.
-- Legacy rows (dags-social-statics, dags-brand-docs, dags-flux-ai) still work.

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
      AND up.can_view
      AND (
        up.section = p_section
        OR (
          p_section IN ('dags-social-statics', 'dags-brand-docs', 'dags-flux-ai', 'mbuni-flux')
          AND up.section IN ('mbuni-flux', 'dags-social-statics', 'dags-brand-docs', 'dags-flux-ai')
        )
      )
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
      AND up.can_edit
      AND (
        up.section = p_section
        OR (
          p_section IN ('dags-social-statics', 'dags-brand-docs', 'dags-flux-ai', 'mbuni-flux')
          AND up.section IN ('mbuni-flux', 'dags-social-statics', 'dags-brand-docs', 'dags-flux-ai')
        )
      )
  );
$$;

-- Flux AI tables: allow non-admin users with Mbuni Flux permission (admin policies unchanged).
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'clients', 'client_submissions', 'client_segments', 'ai_briefs', 'campaigns',
    'campaign_drafts', 'automations', 'automation_runs', 'surveys', 'survey_responses',
    'client_scores', 'activity_logs'
  ]
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "mbuni_flux_view_%1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "mbuni_flux_edit_%1$s" ON public.%1$I', t);
    EXECUTE format(
      'CREATE POLICY "mbuni_flux_view_%1$s" ON public.%1$I FOR SELECT TO authenticated USING (public.user_can_view_section(''dags-flux-ai''))',
      t
    );
    EXECUTE format(
      'CREATE POLICY "mbuni_flux_edit_%1$s" ON public.%1$I FOR ALL TO authenticated USING (public.user_can_edit_section(''dags-flux-ai'')) WITH CHECK (public.user_can_edit_section(''dags-flux-ai''))',
      t
    );
  END LOOP;
END $$;
