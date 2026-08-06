import { corsHeaders, json, jsonError, logActivity, requireFluxAiAdmin } from "../_shared/flux-ai.ts";

type TriggerEvent =
  | "new_submission"
  | "abandoned_onboarding"
  | "proposal_sent"
  | "project_completed"
  | "inactivity_14d";

const DEFAULT_AUTOMATIONS: { name: string; trigger_event: TriggerEvent; description: string }[] = [
  { name: "Submission Welcome Sequence", trigger_event: "new_submission", description: "Kick off welcome and intake follow-up workflow." },
  { name: "Abandoned Onboarding Recovery", trigger_event: "abandoned_onboarding", description: "Re-engage leads who abandon onboarding." },
  { name: "Proposal Follow-Up Sequence", trigger_event: "proposal_sent", description: "Nurture and objection-handling after proposal delivery." },
  { name: "Project Completion Growth Sequence", trigger_event: "project_completed", description: "Collect feedback, request referrals, and propose expansion." },
  { name: "14-Day Inactivity Nudge", trigger_event: "inactivity_14d", description: "Restart momentum for inactive accounts." },
];

function isoDay(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function runKey(event: TriggerEvent, clientId: string, day = isoDay()) {
  return `${event}:${clientId}:${day}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const ctx = await requireFluxAiAdmin(req);
    if (ctx instanceof Response) return ctx;
    const { adminClient, userId, body } = ctx;

    const triggerFilter = typeof body.trigger_event === "string" ? body.trigger_event as TriggerEvent : null;
    const now = new Date();
    const inactiveBefore = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();

    // Ensure baseline automations exist
    await adminClient.from("automations").upsert(
      DEFAULT_AUTOMATIONS.map((a) => ({
        name: a.name,
        trigger_event: a.trigger_event,
        description: a.description,
        status: "active",
      })),
      { onConflict: "name" },
    );

    let automationsQuery = adminClient
      .from("automations")
      .select("id, name, trigger_event, status, conditions, actions")
      .eq("status", "active");
    if (triggerFilter) automationsQuery = automationsQuery.eq("trigger_event", triggerFilter);

    const { data: automations, error: autoErr } = await automationsQuery;
    if (autoErr) return jsonError(autoErr.message, 400);
    if (!automations || automations.length === 0) return json({ processed_runs: 0, runs: [] });

    const { data: clients, error: clientsErr } = await adminClient
      .from("clients")
      .select("id, company_name, lifecycle_stage, status, updated_at")
      .neq("status", "archived");
    if (clientsErr) return jsonError(clientsErr.message, 400);

    const { data: submissions, error: submissionsErr } = await adminClient
      .from("client_submissions")
      .select("id, client_id, onboarding_status, status, created_at, updated_at")
      .order("created_at", { ascending: false });
    if (submissionsErr) return jsonError(submissionsErr.message, 400);

    const latestSubmissionByClient = new Map<string, (typeof submissions)[number]>();
    for (const sub of submissions ?? []) {
      if (!latestSubmissionByClient.has(sub.client_id)) latestSubmissionByClient.set(sub.client_id, sub);
    }

    const createdRuns: Record<string, unknown>[] = [];
    for (const automation of automations) {
      const event = automation.trigger_event as TriggerEvent;
      for (const client of clients ?? []) {
        const latestSubmission = latestSubmissionByClient.get(client.id);
        let shouldRun = false;

        if (event === "new_submission") {
          shouldRun = latestSubmission?.status === "active";
        } else if (event === "abandoned_onboarding") {
          shouldRun = latestSubmission?.onboarding_status === "abandoned";
        } else if (event === "proposal_sent") {
          shouldRun = client.lifecycle_stage === "onboarding";
        } else if (event === "project_completed") {
          shouldRun = client.lifecycle_stage === "completed";
        } else if (event === "inactivity_14d") {
          const lastTouch = client.updated_at ?? latestSubmission?.updated_at ?? latestSubmission?.created_at;
          shouldRun = typeof lastTouch === "string" && lastTouch < inactiveBefore;
        }

        if (!shouldRun) continue;

        const key = runKey(event, client.id);
        const basePayload = {
          automation_id: automation.id,
          client_id: client.id,
          client_submission_id: latestSubmission?.id ?? null,
          trigger_event: event,
          run_key: key,
          input_context: {
            automation_name: automation.name,
            client,
            latest_submission: latestSubmission ?? null,
            email_provider_ready: false,
          },
          output_context: {
            planned_actions: [
              { action: "queue_message", provider: "future_email_provider", status: "pending" },
            ],
          },
          run_status: "completed",
          started_at: now.toISOString(),
          finished_at: new Date().toISOString(),
        };

        const { data: inserted, error: runErr } = await adminClient
          .from("automation_runs")
          .upsert(basePayload, { onConflict: "automation_id,run_key" })
          .select("*")
          .single();

        if (runErr) continue;
        createdRuns.push(inserted);

        await logActivity({
          adminClient,
          actorUserId: userId,
          clientId: client.id,
          action: `flux_ai.automation.${event}`,
          entityType: "automation_run",
          entityId: inserted.id,
          source: "automation",
          status: "success",
          details: {
            automation_id: automation.id,
            run_key: key,
          },
        });
      }
    }

    return json({ processed_runs: createdRuns.length, runs: createdRuns });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Unknown error", 500);
  }
});
