-- Flux AI demo seed data
-- Run after migrations: supabase db reset OR supabase db push && psql -f supabase/seed.sql

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.clients WHERE id = '11111111-1111-1111-1111-111111111111') THEN
    INSERT INTO public.clients (
      id, company_name, primary_contact_name, primary_contact_email, lifecycle_stage, industry, website, notes, source, status, metadata
    ) VALUES
      (
        '11111111-1111-1111-1111-111111111111',
        'Northstar Atelier',
        'Ava Mensah',
        'ava@northstaratelier.com',
        'active',
        'Fashion',
        'https://northstaratelier.com',
        'Premium streetwear brand expanding into EU market.',
        'intake_form',
        'active',
        '{"plan":"growth","team_size":8}'::jsonb
      ),
      (
        '22222222-2222-2222-2222-222222222222',
        'Helio Home Labs',
        'Noah Carter',
        'noah@heliohome.io',
        'onboarding',
        'Home Technology',
        'https://heliohome.io',
        'D2C smart-home challenger brand.',
        'manual',
        'active',
        '{"plan":"starter","team_size":4}'::jsonb
      ),
      (
        '33333333-3333-3333-3333-333333333333',
        'Verde Motion Studio',
        'Lina Wu',
        'lina@verdemotion.studio',
        'at_risk',
        'Fitness',
        'https://verdemotion.studio',
        'Needs retention and reactivation campaign.',
        'imported',
        'active',
        '{"plan":"retainer","team_size":12}'::jsonb
      );
  END IF;
END $$;

INSERT INTO public.client_submissions (
  id, client_id, submission_source, onboarding_status, submitted_at, profile_data, ai_classification, status
) VALUES
  (
    'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    '11111111-1111-1111-1111-111111111111',
    'intake_form',
    'completed',
    now() - interval '21 days',
    '{"audience":"Gen Z creatives","goals":"Brand awareness + conversion","tone":"Bold, premium"}'::jsonb,
    '{"intent":"scale","confidence":84}'::jsonb,
    'active'
  ),
  (
    'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    '22222222-2222-2222-2222-222222222222',
    'intake_form',
    'in_progress',
    now() - interval '6 days',
    '{"audience":"Young homeowners","goals":"Improve onboarding completion"}'::jsonb,
    '{"intent":"optimize","confidence":76}'::jsonb,
    'active'
  ),
  (
    'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    '33333333-3333-3333-3333-333333333333',
    'imported',
    'abandoned',
    now() - interval '18 days',
    '{"audience":"Busy professionals","goals":"Reactivate trial users"}'::jsonb,
    '{"intent":"recover","confidence":81}'::jsonb,
    'active'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.client_segments (
  id, client_id, client_submission_id, segment_key, segment_name, confidence, source, rationale, status
) VALUES
  (
    'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'growth',
    'Growth Ready',
    86,
    'hybrid',
    '{"rule":"active_lifecycle","ai":"high growth potential"}'::jsonb,
    'active'
  ),
  (
    'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    '33333333-3333-3333-3333-333333333333',
    'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    'reengage',
    'Needs Re-Engagement',
    89,
    'rules',
    '{"rule":"abandoned_onboarding"}'::jsonb,
    'active'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.ai_briefs (
  id, client_id, client_submission_id, title, summary, input_context, ai_output, model_meta, review_notes, is_latest, status
) VALUES
  (
    'ccccccc1-cccc-cccc-cccc-ccccccccccc1',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'Northstar Q2 Expansion Brief',
    'Position Northstar as the premium identity brand for creators in EU metro markets.',
    '{"source":"submission + segment"}'::jsonb,
    '{"channels":["instagram","tiktok","email"],"pillars":["identity","drops","community"]}'::jsonb,
    '{"provider":"mock","model":"mock-v1"}'::jsonb,
    '{"reviewed_by":"creative_lead"}'::jsonb,
    true,
    'ready'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.campaigns (
  id, client_id, ai_brief_id, name, objective, channels, target_segment, status
) VALUES
  (
    'ddddddd1-dddd-dddd-dddd-ddddddddddd1',
    '11111111-1111-1111-1111-111111111111',
    'ccccccc1-cccc-cccc-cccc-ccccccccccc1',
    'Northstar Creator Momentum',
    'Increase lead quality and first purchase conversion over 30 days.',
    '["instagram","linkedin","email"]'::jsonb,
    '{"segment":"growth"}'::jsonb,
    'active'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.campaign_drafts (
  id, campaign_id, client_id, channel, title, draft_text, draft_payload, generation_context, model_meta, status
) VALUES
  (
    'eeeeeee1-eeee-eeee-eeee-eeeeeeeeeee1',
    'ddddddd1-dddd-dddd-dddd-ddddddddddd1',
    '11111111-1111-1111-1111-111111111111',
    'instagram',
    'Build your brand uniform',
    'A swipe carousel introducing 3 identity rules and one CTA for a strategy call.',
    '{"hook":"identity-first","cta":"Book a strategy call"}'::jsonb,
    '{"brief_id":"ccccccc1-cccc-cccc-cccc-ccccccccccc1"}'::jsonb,
    '{"provider":"mock","model":"mock-v1"}'::jsonb,
    'reviewed'
  ),
  (
    'eeeeeee2-eeee-eeee-eeee-eeeeeeeeeee2',
    'ddddddd1-dddd-dddd-dddd-ddddddddddd1',
    '11111111-1111-1111-1111-111111111111',
    'email',
    'Your next 30-day brand growth sprint',
    'A 4-step nurture sequence that transitions from awareness to proposal request.',
    '{"sequence_length":4}'::jsonb,
    '{"brief_id":"ccccccc1-cccc-cccc-cccc-ccccccccccc1"}'::jsonb,
    '{"provider":"mock","model":"mock-v1"}'::jsonb,
    'draft'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.automations (
  id, name, description, trigger_event, conditions, actions, status
) VALUES
  (
    'fffffff1-ffff-ffff-ffff-fffffffffff1',
    'Submission Welcome Sequence',
    'Kick off intake follow-up and discovery prep.',
    'new_submission',
    '{"min_fields":3}'::jsonb,
    '{"action":"queue_welcome_email"}'::jsonb,
    'active'
  ),
  (
    'fffffff2-ffff-ffff-ffff-fffffffffff2',
    '14-Day Inactivity Nudge',
    'Nudge inactive clients with value reminders.',
    'inactivity_14d',
    '{"days":14}'::jsonb,
    '{"action":"queue_reactivation_email"}'::jsonb,
    'active'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.automation_runs (
  id, automation_id, client_id, client_submission_id, trigger_event, run_key, input_context, output_context, run_status, started_at, finished_at
) VALUES
  (
    '99999991-9999-9999-9999-999999999991',
    'fffffff1-ffff-ffff-ffff-fffffffffff1',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'new_submission',
    'new_submission:11111111-1111-1111-1111-111111111111:2026-04-14',
    '{"source":"seed"}'::jsonb,
    '{"queued_actions":[{"type":"email","provider":"future_email_provider"}]}'::jsonb,
    'completed',
    now() - interval '2 days',
    now() - interval '2 days' + interval '3 minutes'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.surveys (
  id, client_id, campaign_id, title, description, questions, delivery_channels, status, metadata
) VALUES
  (
    '12121212-1212-1212-1212-121212121212',
    '11111111-1111-1111-1111-111111111111',
    'ddddddd1-dddd-dddd-dddd-ddddddddddd1',
    'Northstar Post-Campaign Pulse',
    'Short sentiment pulse after week-two rollout.',
    '[{"id":"q1","type":"rating","prompt":"How clear is your message?"},{"id":"q2","type":"text","prompt":"What would you improve?"}]'::jsonb,
    '["email","notion"]'::jsonb,
    'active',
    '{"owner":"strategy-team"}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.survey_responses (
  id, survey_id, client_id, respondent_name, respondent_email, responses, sentiment, score, status
) VALUES
  (
    '13131313-1313-1313-1313-131313131313',
    '12121212-1212-1212-1212-121212121212',
    '11111111-1111-1111-1111-111111111111',
    'Ava Mensah',
    'ava@northstaratelier.com',
    '{"q1":8,"q2":"Need tighter CTA language on paid creative."}'::jsonb,
    '{"tone":"positive","priority":"cta_clarity"}'::jsonb,
    8,
    'reviewed'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.client_scores (
  id, client_id, score_type, score_value, score_band, factors, recommendations, status
) VALUES
  (
    '14141414-1414-1414-1414-141414141414',
    '11111111-1111-1111-1111-111111111111',
    'health',
    82,
    'growth',
    '{"completed_runs":4,"open_drafts":1}'::jsonb,
    '["Maintain weekly optimization cadence","Push referral flow"]'::jsonb,
    'current'
  ),
  (
    '15151515-1515-1515-1515-151515151515',
    '11111111-1111-1111-1111-111111111111',
    'upsell',
    76,
    'healthy',
    '{"survey_signal":"positive","retainer_fit":"high"}'::jsonb,
    '["Pitch cross-channel expansion", "Offer quarterly planning package"]'::jsonb,
    'current'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.activity_logs (
  id, client_id, action, entity_type, entity_id, source, details, status
) VALUES
  (
    '16161616-1616-1616-1616-161616161616',
    '11111111-1111-1111-1111-111111111111',
    'flux_ai.segment.created',
    'client_segment',
    'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'ai',
    '{"segment":"growth","confidence":86}'::jsonb,
    'success'
  ),
  (
    '17171717-1717-1717-1717-171717171717',
    '11111111-1111-1111-1111-111111111111',
    'flux_ai.campaign.generated',
    'campaign',
    'ddddddd1-dddd-dddd-dddd-ddddddddddd1',
    'ai',
    '{"drafts_created":2}'::jsonb,
    'info'
  )
ON CONFLICT (id) DO NOTHING;
