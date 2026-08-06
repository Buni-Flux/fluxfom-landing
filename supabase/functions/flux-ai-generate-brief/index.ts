import {
  corsHeaders,
  generateAiJson,
  json,
  jsonError,
  logActivity,
  requireFluxAiAdmin,
} from "../_shared/flux-ai.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const ctx = await requireFluxAiAdmin(req);
    if (ctx instanceof Response) return ctx;
    const { adminClient, userId, body } = ctx;

    const clientId = typeof body.client_id === "string" ? body.client_id : null;
    if (!clientId) return jsonError("client_id is required", 400);

    const { data: client, error: clientErr } = await adminClient
      .from("clients")
      .select("*")
      .eq("id", clientId)
      .single();
    if (clientErr || !client) return jsonError("Client not found", 404);

    const requestedSubmissionId = typeof body.client_submission_id === "string" ? body.client_submission_id : null;
    let submissionQuery = adminClient
      .from("client_submissions")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(1);
    if (requestedSubmissionId) submissionQuery = submissionQuery.eq("id", requestedSubmissionId);
    const { data: submissionRows, error: subErr } = await submissionQuery;
    if (subErr) return jsonError(subErr.message, 400);
    const submission = submissionRows?.[0] ?? null;

    const fallback = {
      title: `${client.company_name} Growth Brief`,
      summary:
        "Client requires a focused brand-growth campaign across social, email, and conversion touchpoints. Prioritize clarity and conversion outcomes.",
      segments: ["onboarding_core"],
      opportunities: [
        "Build a stronger recurring content loop",
        "Improve onboarding handoff messages",
        "Create survey-driven nurture funnel",
      ],
      recommended_channels: ["instagram", "linkedin", "email", "website"],
      next_14_day_plan: [
        "Finalize positioning statement and tone guardrails",
        "Ship one high-intent lead magnet and email sequence",
        "Launch 3 cross-channel campaign draft variants",
      ],
    };

    const ai = await generateAiJson({
      systemPrompt:
        "You are Flux AI for a brand strategy studio. Return JSON with title, summary, segments, opportunities, recommended_channels, next_14_day_plan.",
      userPrompt: JSON.stringify({ client, submission }),
      fallback,
    });

    const aiOutput = ai.output;
    const title = typeof aiOutput.title === "string" ? aiOutput.title : fallback.title;
    const summary = typeof aiOutput.summary === "string" ? aiOutput.summary : fallback.summary;

    const { data: existingBrief, error: existErr } = await adminClient
      .from("ai_briefs")
      .select("id, regeneration_count")
      .eq("client_id", clientId)
      .eq("is_latest", true)
      .maybeSingle();
    if (existErr) return jsonError(existErr.message, 400);

    const prevRegen = typeof existingBrief?.regeneration_count === "number" ? existingBrief.regeneration_count : 0;
    const briefRow = {
      client_submission_id: submission?.id ?? null,
      title,
      summary,
      input_context: { client, submission },
      ai_output: aiOutput,
      model_meta: ai.model_meta,
      review_notes: {},
      is_latest: true,
      status: "ready" as const,
      ai_status: "ready" as const,
    };

    let brief: Record<string, unknown> | null = null;
    let briefErr: { message: string } | null = null;

    if (existingBrief?.id) {
      const res = await adminClient
        .from("ai_briefs")
        .update({
          ...briefRow,
          regeneration_count: prevRegen + 1,
        })
        .eq("id", existingBrief.id)
        .select("*")
        .single();
      brief = res.data as Record<string, unknown> | null;
      briefErr = res.error;
    } else {
      const res = await adminClient
        .from("ai_briefs")
        .insert({
          client_id: clientId,
          ...briefRow,
          regeneration_count: 0,
        })
        .select("*")
        .single();
      brief = res.data as Record<string, unknown> | null;
      briefErr = res.error;
    }

    if (briefErr || !brief) return jsonError(briefErr?.message ?? "Failed to save brief", 400);

    await logActivity({
      adminClient,
      actorUserId: userId,
      clientId,
      action: existingBrief?.id ? "flux_ai.brief.refreshed" : "flux_ai.brief.generated",
      entityType: "ai_brief",
      entityId: brief.id as string,
      source: "ai",
      status: "success",
      details: { title: brief.title, model_meta: ai.model_meta },
    });

    return json({ brief });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Unknown error", 500);
  }
});
