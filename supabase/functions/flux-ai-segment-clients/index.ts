import {
  corsHeaders,
  generateAiJson,
  json,
  jsonError,
  logActivity,
  requireFluxAiAdmin,
} from "../_shared/flux-ai.ts";

function chooseRuleSegment(params: {
  lifecycleStage: string | null;
  onboardingStatus: string | null;
  industry: string | null;
}) {
  if (params.onboardingStatus === "abandoned") {
    return { segment_key: "reengage", segment_name: "Needs Re-Engagement", confidence: 82 };
  }
  if (params.lifecycleStage === "active") {
    return { segment_key: "growth", segment_name: "Growth Ready", confidence: 78 };
  }
  if (params.lifecycleStage === "at_risk") {
    return { segment_key: "retention", segment_name: "Retention Priority", confidence: 80 };
  }
  if (params.industry?.toLowerCase().includes("fashion")) {
    return { segment_key: "creative_brand", segment_name: "Creative Brand Accelerator", confidence: 72 };
  }
  return { segment_key: "onboarding_core", segment_name: "Onboarding Core", confidence: 68 };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const ctx = await requireFluxAiAdmin(req);
    if (ctx instanceof Response) return ctx;
    const { adminClient, userId, body } = ctx;

    const clientId = typeof body.client_id === "string" ? body.client_id : null;
    const onlyPending = body.only_pending === true;

    let submissionsQuery = adminClient
      .from("client_submissions")
      .select("id, client_id, onboarding_status, profile_data, status")
      .order("created_at", { ascending: false })
      .limit(100);
    if (clientId) submissionsQuery = submissionsQuery.eq("client_id", clientId);
    if (onlyPending) submissionsQuery = submissionsQuery.eq("status", "active");

    const { data: submissions, error: submissionsErr } = await submissionsQuery;
    if (submissionsErr) return jsonError(submissionsErr.message, 400);
    if (!submissions || submissions.length === 0) return json({ processed: 0, segments: [] });

    const clientIds = [...new Set(submissions.map((s) => s.client_id))];
    const { data: clients, error: clientsErr } = await adminClient
      .from("clients")
      .select("id, lifecycle_stage, industry, metadata, status")
      .in("id", clientIds);
    if (clientsErr) return jsonError(clientsErr.message, 400);

    const clientById = new Map((clients ?? []).map((c) => [c.id, c]));
    const resultRows: Record<string, unknown>[] = [];

    for (const submission of submissions) {
      const client = clientById.get(submission.client_id);
      if (!client) continue;

      const rule = chooseRuleSegment({
        lifecycleStage: client.lifecycle_stage as string | null,
        onboardingStatus: submission.onboarding_status as string | null,
        industry: client.industry as string | null,
      });

      const aiFallback = {
        segment_key: rule.segment_key,
        segment_name: rule.segment_name,
        confidence: rule.confidence,
        notes: "fallback_rules_only",
      };

      const ai = await generateAiJson({
        systemPrompt:
          "Classify brand strategy studio clients into segments. Return JSON with segment_key, segment_name, confidence (0-100), and notes.",
        userPrompt: JSON.stringify({
          client,
          submission,
          existing_rule_segment: rule,
        }),
        fallback: aiFallback,
      });

      const output = ai.output;
      const aiKey = typeof output.segment_key === "string" ? output.segment_key : rule.segment_key;
      const aiName = typeof output.segment_name === "string" ? output.segment_name : rule.segment_name;
      const aiConfidence =
        typeof output.confidence === "number"
          ? Math.max(0, Math.min(100, output.confidence))
          : rule.confidence;

      const rowPayload = {
        client_id: submission.client_id,
        client_submission_id: submission.id,
        segment_key: aiKey,
        segment_name: aiName,
        confidence: aiConfidence,
        source: ai.model_meta.usedFallback ? "rules" : "hybrid",
        rationale: {
          rule,
          ai_output: output,
          model_meta: ai.model_meta,
        },
        status: "active",
      };

      const { data: activeForSubmission, error: listErr } = await adminClient
        .from("client_segments")
        .select("id")
        .eq("client_submission_id", submission.id)
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (listErr) return jsonError(listErr.message, 400);

      const activeRows = activeForSubmission ?? [];
      if (activeRows.length > 1) {
        const dupIds = activeRows.slice(1).map((r) => r.id);
        const { error: supErr } = await adminClient.from("client_segments").update({ status: "superseded" }).in("id", dupIds);
        if (supErr) return jsonError(supErr.message, 400);
      }

      const existingId = activeRows[0]?.id;
      if (existingId) {
        const { data: updated, error: updErr } = await adminClient
          .from("client_segments")
          .update({
            segment_key: rowPayload.segment_key,
            segment_name: rowPayload.segment_name,
            confidence: rowPayload.confidence,
            source: rowPayload.source,
            rationale: rowPayload.rationale,
          })
          .eq("id", existingId)
          .select("id, client_id, segment_key, segment_name, confidence, source, created_at")
          .single();
        if (updErr || !updated) return jsonError(updErr?.message ?? "Failed to update segment", 400);
        resultRows.push(updated);
        await logActivity({
          adminClient,
          actorUserId: userId,
          clientId: updated.client_id,
          action: "flux_ai.segment.refreshed",
          entityType: "client_segment",
          entityId: updated.id,
          source: "ai",
          status: "success",
          details: {
            segment_key: updated.segment_key,
            segment_name: updated.segment_name,
            confidence: updated.confidence,
            source: updated.source,
          },
        });
      } else {
        const { data: inserted, error: insErr } = await adminClient
          .from("client_segments")
          .insert(rowPayload)
          .select("id, client_id, segment_key, segment_name, confidence, source, created_at")
          .single();
        if (insErr || !inserted) return jsonError(insErr?.message ?? "Failed to insert segment", 400);
        resultRows.push(inserted);
        await logActivity({
          adminClient,
          actorUserId: userId,
          clientId: inserted.client_id,
          action: "flux_ai.segment.created",
          entityType: "client_segment",
          entityId: inserted.id,
          source: "ai",
          status: "success",
          details: {
            segment_key: inserted.segment_key,
            segment_name: inserted.segment_name,
            confidence: inserted.confidence,
            source: inserted.source,
          },
        });
      }
    }

    return json({
      processed: resultRows.length,
      segments: resultRows,
    });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Unknown error", 500);
  }
});
