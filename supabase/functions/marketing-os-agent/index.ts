import {
  corsHeaders,
  generateAiJson,
  json,
  jsonError,
  logActivity,
  requireFluxAiAdmin,
} from "../_shared/flux-ai.ts";

const AGENT_PROMPTS: Record<string, string> = {
  "discovery-analyst":
    "You are a discovery analyst for a marketing operating system. Return JSON with summary, insights (string array), recommendations (string array), and risks (string array).",
  strategist:
    "You are a brand strategist. Return JSON with summary, positioning_statement (string), key_messages (string array), and next_steps (string array).",
  "content-planner":
    "You are a content strategist. Return JSON with summary, themes (string array), calendar_items (object array with title and channel), and seo_notes (string array).",
  "journey-architect":
    "You are a customer journey architect. Return JSON with summary, touchpoints (string array), emotions (string array), friction_points (string array), opportunities (string array), and recommendations (string array).",
  "growth-analyst":
    "You are a growth analyst. Return JSON with summary, opportunities (string array), experiments (object array with hypothesis and priority), and metrics (string array).",
  "campaign-manager":
    "You are a campaign manager. Return JSON with summary, milestones (object array with title and date), channel_plan (string array), and checklist (string array).",
  "brand-designer":
    "You are a brand designer. Return JSON with summary, guidelines (string array), examples (string array), and consistency_notes (string array).",
  "analytics-analyst":
    "You are a marketing analytics analyst. Return JSON with summary, kpis (object array with name and value), insights (string array), and recommendations (string array).",
  copilot:
    "You are FluxFom Marketing OS Co-Pilot. Return JSON with reply (string, conversational, under 120 words), suggested_path (string URL path like /fom-core/strategy/positioning), and optional insights (string array). Be specific to the user's question and workflow context.",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const ctx = await requireFluxAiAdmin(req);
    if (ctx instanceof Response) return ctx;
    const { adminClient, userId, body } = ctx;

    const agentId =
      (typeof body.marketing_os_agent === "string" ? body.marketing_os_agent : null) ??
      (typeof body.agent_id === "string" ? body.agent_id : null) ??
      "strategist";
    const section = typeof body.section === "string" ? body.section : "strategy";
    const module = typeof body.module === "string" ? body.module : "general";
    const inputContext =
      body.input_context && typeof body.input_context === "object" && !Array.isArray(body.input_context)
        ? (body.input_context as Record<string, unknown>)
        : {};
    const clientId = typeof body.client_id === "string" ? body.client_id : null;

    let client: Record<string, unknown> | null = null;
    if (clientId) {
      const { data } = await adminClient.from("clients").select("*").eq("id", clientId).maybeSingle();
      client = (data as Record<string, unknown> | null) ?? null;
    }

    const fallback = {
      summary: `Generated output for ${section}/${module} via ${agentId}.`,
      recommendations: [
        "Review and refine inputs in the workflow module",
        "Share with stakeholders for feedback",
        "Export to Vault for downstream campaigns",
      ],
      ...Object.fromEntries(
        Object.entries(inputContext).map(([key, value]) => [
          key,
          typeof value === "string" && value.includes("\n") ? value.split("\n").filter(Boolean) : value,
        ]),
      ),
    };

    const systemPrompt =
      AGENT_PROMPTS[agentId] ??
      "You are FluxFom Marketing OS. Return JSON with summary, insights (string array), and recommendations (string array).";

    const ai = await generateAiJson({
      systemPrompt,
      userPrompt: JSON.stringify({ agent: agentId, section, module, client, input: inputContext }),
      fallback,
    });

    const content = ai.output;

    await logActivity({
      adminClient,
      actorUserId: userId,
      clientId,
      action: "marketing_os.agent.run",
      entityType: "marketing_os_agent",
      entityId: `${section}:${module}`,
      source: "ai",
      status: "success",
      details: { agentId, section, module, model_meta: ai.model_meta },
    });

    return json({
      content,
      ai_output: content,
      agent: agentId,
      section,
      module,
      model_meta: ai.model_meta,
    });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Unknown error", 500);
  }
});
