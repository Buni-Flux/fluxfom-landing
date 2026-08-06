import { corsHeaders, json, jsonError, logActivity, requireFluxAiAdmin } from "../_shared/flux-ai.ts";

function band(score: number) {
  if (score < 35) return "critical";
  if (score < 60) return "watch";
  if (score < 80) return "healthy";
  return "growth";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const ctx = await requireFluxAiAdmin(req);
    if (ctx instanceof Response) return ctx;
    const { adminClient, userId, body } = ctx;

    const clientId = typeof body.client_id === "string" ? body.client_id : null;
    let query = adminClient.from("clients").select("id, lifecycle_stage, status, updated_at").neq("status", "archived");
    if (clientId) query = query.eq("id", clientId);
    const { data: clients, error: clientsErr } = await query;
    if (clientsErr) return jsonError(clientsErr.message, 400);
    if (!clients || clients.length === 0) return json({ scored: 0, scores: [] });

    const now = new Date();
    const clientIds = clients.map((c) => c.id);
    const { data: currentScores, error: curErr } = await adminClient
      .from("client_scores")
      .select("id, client_id, score_type")
      .in("client_id", clientIds)
      .eq("status", "current");
    if (curErr) return jsonError(curErr.message, 400);

    const currentByKey = new Map((currentScores ?? []).map((r) => [`${r.client_id}:${r.score_type}`, r.id]));
    const inserts: Record<string, unknown>[] = [];
    type ScoreLog = {
      id: string;
      client_id: string;
      score_type: string;
      score_value: number;
      score_band: string;
    };
    const logEntries: ScoreLog[] = [];

    for (const client of clients) {
      const { count: openDrafts } = await adminClient
        .from("campaign_drafts")
        .select("id", { count: "exact", head: true })
        .eq("client_id", client.id)
        .in("status", ["draft", "reviewed"]);

      const { count: completedRuns } = await adminClient
        .from("automation_runs")
        .select("id", { count: "exact", head: true })
        .eq("client_id", client.id)
        .eq("run_status", "completed");

      const { count: surveyResponses } = await adminClient
        .from("survey_responses")
        .select("id", { count: "exact", head: true })
        .eq("client_id", client.id);

      const lifecycleBoost =
        client.lifecycle_stage === "active" ? 20 : client.lifecycle_stage === "completed" ? 15 : 8;
      const healthScore = Math.max(
        0,
        Math.min(100, 40 + lifecycleBoost + Math.min(20, (completedRuns ?? 0) * 4) - Math.min(15, (openDrafts ?? 0) * 2)),
      );
      const upsellScore = Math.max(
        0,
        Math.min(100, 35 + Math.min(25, (surveyResponses ?? 0) * 5) + Math.min(30, (completedRuns ?? 0) * 3)),
      );

      const healthPayload = {
        score_value: Math.round(healthScore),
        score_band: band(healthScore),
        factors: {
          open_drafts: openDrafts ?? 0,
          completed_automations: completedRuns ?? 0,
          lifecycle_stage: client.lifecycle_stage,
        },
        recommendations: [
          "Close open campaign drafts for momentum",
          "Schedule a strategy review checkpoint this week",
        ],
        status: "current",
        calculated_at: now.toISOString(),
      };

      const upsellPayload = {
        score_value: Math.round(upsellScore),
        score_band: band(upsellScore),
        factors: {
          survey_responses: surveyResponses ?? 0,
          completed_automations: completedRuns ?? 0,
          lifecycle_stage: client.lifecycle_stage,
        },
        recommendations: [
          "Offer cross-channel expansion package",
          "Propose quarterly performance roadmap",
        ],
        status: "current",
        calculated_at: now.toISOString(),
      };

      const healthId = currentByKey.get(`${client.id}:health`);
      if (healthId) {
        const { error: u1 } = await adminClient.from("client_scores").update(healthPayload).eq("id", healthId);
        if (u1) return jsonError(u1.message, 400);
        logEntries.push({
          id: healthId,
          client_id: client.id,
          score_type: "health",
          score_value: healthPayload.score_value,
          score_band: healthPayload.score_band,
        });
      } else {
        inserts.push({ client_id: client.id, score_type: "health", ...healthPayload });
      }

      const upsellId = currentByKey.get(`${client.id}:upsell`);
      if (upsellId) {
        const { error: u2 } = await adminClient.from("client_scores").update(upsellPayload).eq("id", upsellId);
        if (u2) return jsonError(u2.message, 400);
        logEntries.push({
          id: upsellId,
          client_id: client.id,
          score_type: "upsell",
          score_value: upsellPayload.score_value,
          score_band: upsellPayload.score_band,
        });
      } else {
        inserts.push({ client_id: client.id, score_type: "upsell", ...upsellPayload });
      }
    }

    if (inserts.length) {
      const { data: insertedScores, error: scoreErr } = await adminClient.from("client_scores").insert(inserts).select("*");
      if (scoreErr) return jsonError(scoreErr.message, 400);
      for (const r of insertedScores ?? []) {
        logEntries.push({
          id: r.id,
          client_id: r.client_id,
          score_type: r.score_type,
          score_value: r.score_value,
          score_band: r.score_band,
        });
      }
    }

    for (const full of logEntries) {
      await logActivity({
        adminClient,
        actorUserId: userId,
        clientId: full.client_id,
        action: `flux_ai.score.${full.score_type}`,
        entityType: "client_score",
        entityId: full.id,
        source: "system",
        status: "success",
        details: { score_value: full.score_value, score_band: full.score_band },
      });
    }

    const { data: refreshedScores, error: listErr } = await adminClient
      .from("client_scores")
      .select("*")
      .in("client_id", clientIds)
      .eq("status", "current");
    if (listErr) return jsonError(listErr.message, 400);

    return json({ scored: logEntries.length, scores: refreshedScores ?? [] });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Unknown error", 500);
  }
});
