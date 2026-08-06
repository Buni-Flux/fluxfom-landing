import {
  corsHeaders,
  generateAiJson,
  json,
  jsonError,
  logActivity,
  requireFluxAiAdmin,
} from "../_shared/flux-ai.ts";

type CampaignDraft = {
  channel: string;
  title: string;
  body: string;
  cta: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const ctx = await requireFluxAiAdmin(req);
    if (ctx instanceof Response) return ctx;
    const { adminClient, userId, body } = ctx;

    const clientId = typeof body.client_id === "string" ? body.client_id : null;
    if (!clientId) return jsonError("client_id is required", 400);

    const channels = Array.isArray(body.channels)
      ? body.channels.filter((v): v is string => typeof v === "string" && v.trim().length > 0)
      : ["instagram", "linkedin", "email"];

    const { data: client, error: clientErr } = await adminClient
      .from("clients")
      .select("*")
      .eq("id", clientId)
      .single();
    if (clientErr || !client) return jsonError("Client not found", 404);

    const { data: latestBrief, error: briefErr } = await adminClient
      .from("ai_briefs")
      .select("*")
      .eq("client_id", clientId)
      .eq("is_latest", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (briefErr) return jsonError(briefErr.message, 400);
    if (!latestBrief) return jsonError("No latest brief found for this client", 400);

    const campaignName = typeof body.campaign_name === "string"
      ? body.campaign_name
      : `${client.company_name} ${new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })} Growth Sprint`;

    let campaignId = typeof body.campaign_id === "string" ? body.campaign_id : null;
    let campaignExistedBefore = !!campaignId;

    if (!campaignId) {
      const { data: existingCampaign, error: campLookupErr } = await adminClient
        .from("campaigns")
        .select("id")
        .eq("client_id", clientId)
        .eq("ai_brief_id", latestBrief.id)
        .in("status", ["planning", "in_review"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (campLookupErr) return jsonError(campLookupErr.message, 400);

      if (existingCampaign?.id) {
        campaignId = existingCampaign.id;
        campaignExistedBefore = true;
        const { error: campUpdErr } = await adminClient
          .from("campaigns")
          .update({ channels, name: campaignName })
          .eq("id", campaignId);
        if (campUpdErr) return jsonError(campUpdErr.message, 400);
      } else {
        const { data: newCampaign, error: campaignErr } = await adminClient
          .from("campaigns")
          .insert({
            client_id: clientId,
            ai_brief_id: latestBrief.id,
            name: campaignName,
            objective: "Increase awareness and qualified leads across primary channels",
            channels,
            target_segment: { from_latest_brief: true },
            status: "in_review",
          })
          .select("id, name")
          .single();
        if (campaignErr || !newCampaign) return jsonError(campaignErr?.message ?? "Failed to create campaign", 400);
        campaignId = newCampaign.id;
      }
    }

    const fallbackDrafts = channels.map((channel): CampaignDraft => ({
      channel,
      title: `${client.company_name}: ${channel} growth draft`,
      body: `Introduce ${client.company_name}'s core value proposition with a clear proof point and one actionable next step.`,
      cta: "Book a strategy call",
    }));

    const ai = await generateAiJson({
      systemPrompt:
        "Create campaign drafts for each requested channel. Return JSON: { drafts: [{ channel, title, body, cta }] }.",
      userPrompt: JSON.stringify({
        client,
        latest_brief: latestBrief.ai_output,
        channels,
      }),
      fallback: { drafts: fallbackDrafts },
    });

    const outputDraftsRaw = Array.isArray(ai.output.drafts) ? ai.output.drafts : fallbackDrafts;
    const outputDrafts: CampaignDraft[] = outputDraftsRaw.map((d, idx) => ({
      channel: typeof d?.channel === "string" ? d.channel : channels[idx] ?? "general",
      title: typeof d?.title === "string" ? d.title : fallbackDrafts[idx]?.title ?? "Campaign draft",
      body: typeof d?.body === "string" ? d.body : fallbackDrafts[idx]?.body ?? "",
      cta: typeof d?.cta === "string" ? d.cta : "Book a strategy call",
    }));

    const genCtx = { brief_id: latestBrief.id, channels };
    const draftResults: Record<string, unknown>[] = [];

    for (const d of outputDrafts) {
      const { data: existingDraftRows, error: draftListErr } = await adminClient
        .from("campaign_drafts")
        .select("id, version")
        .eq("campaign_id", campaignId)
        .eq("channel", d.channel)
        .in("status", ["draft", "reviewed"])
        .order("created_at", { ascending: false })
        .limit(2);
      if (draftListErr) return jsonError(draftListErr.message, 400);

      const existingDraftList = existingDraftRows ?? [];
      if (existingDraftList.length > 1) {
        const dupIds = existingDraftList.slice(1).map((r) => r.id);
        const { error: dupErr } = await adminClient.from("campaign_drafts").update({ status: "rejected" }).in("id", dupIds);
        if (dupErr) return jsonError(dupErr.message, 400);
      }

      const existingDraft = existingDraftList[0];
      if (existingDraft) {
        const { data: updated, error: updErr } = await adminClient
          .from("campaign_drafts")
          .update({
            title: d.title,
            draft_text: d.body,
            draft_payload: d,
            generation_context: genCtx,
            model_meta: ai.model_meta,
            version: existingDraft.version + 1,
          })
          .eq("id", existingDraft.id)
          .select("*")
          .single();
        if (updErr || !updated) return jsonError(updErr?.message ?? "Failed to update campaign draft", 400);
        draftResults.push(updated);
      } else {
        const { data: inserted, error: insErr } = await adminClient
          .from("campaign_drafts")
          .insert({
            campaign_id: campaignId,
            client_id: clientId,
            channel: d.channel,
            title: d.title,
            draft_text: d.body,
            draft_payload: d,
            generation_context: genCtx,
            model_meta: ai.model_meta,
            status: "draft",
          })
          .select("*")
          .single();
        if (insErr || !inserted) return jsonError(insErr?.message ?? "Failed to insert campaign draft", 400);
        draftResults.push(inserted);
      }
    }

    await logActivity({
      adminClient,
      actorUserId: userId,
      clientId,
      action: campaignExistedBefore ? "flux_ai.campaign.refreshed" : "flux_ai.campaign.generated",
      entityType: "campaign",
      entityId: campaignId,
      source: "ai",
      status: "success",
      details: {
        brief_id: latestBrief.id,
        drafts_touched: draftResults.length,
        model_meta: ai.model_meta,
      },
    });

    return json({
      campaign_id: campaignId,
      drafts: draftResults,
    });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Unknown error", 500);
  }
});
