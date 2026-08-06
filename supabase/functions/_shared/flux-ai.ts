import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

type AnyJson = Record<string, unknown>;

export { corsHeaders };

export type FluxAiContext = {
  authHeader: string;
  userId: string;
  adminClient: SupabaseClient;
  body: AnyJson;
};

export async function requireFluxAiAdmin(req: Request): Promise<FluxAiContext | Response> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonError("Unauthorized", 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
  if (!supabaseUrl || !serviceRoleKey || !anonKey) {
    return jsonError("Server misconfiguration for Supabase keys", 500);
  }

  const callerClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user } } = await callerClient.auth.getUser();
  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: roleData, error: roleErr } = await adminClient
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  if (roleErr || !roleData) {
    return jsonError("Forbidden", 403);
  }

  let body: AnyJson = {};
  try {
    const raw = await req.json();
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      body = raw as AnyJson;
    }
  } catch {
    body = {};
  }

  return {
    authHeader,
    userId: user.id,
    adminClient,
    body,
  };
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function jsonError(message: string, status = 500, extra?: AnyJson): Response {
  return json({ error: message, ...(extra ?? {}) }, status);
}

export async function logActivity(args: {
  adminClient: SupabaseClient;
  clientId?: string | null;
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  source?: "system" | "admin" | "automation" | "ai";
  status?: "info" | "success" | "warning" | "error";
  details?: Record<string, unknown>;
}) {
  await args.adminClient.from("activity_logs").insert({
    client_id: args.clientId ?? null,
    actor_user_id: args.actorUserId ?? null,
    action: args.action,
    entity_type: args.entityType,
    entity_id: args.entityId ?? null,
    source: args.source ?? "system",
    status: args.status ?? "info",
    details: args.details ?? {},
  });
}

type AiMessage = { role: "system" | "user"; content: string };

export async function generateAiJson(args: {
  systemPrompt: string;
  userPrompt: string;
  fallback: Record<string, unknown>;
}) {
  const provider = (Deno.env.get("AI_PROVIDER") ?? "mock").toLowerCase();
  const apiKey = Deno.env.get("AI_API_KEY");
  const model = Deno.env.get("AI_MODEL") ?? "gpt-4o-mini";
  const baseUrl = Deno.env.get("AI_BASE_URL");

  if (provider === "mock" || !apiKey) {
    return {
      output: args.fallback,
      model_meta: { provider: "mock", model: "mock-v1", usedFallback: true },
    };
  }

  const messages: AiMessage[] = [
    { role: "system", content: args.systemPrompt },
    { role: "user", content: args.userPrompt },
  ];

  const endpoint = provider === "openrouter"
    ? "https://openrouter.ai/api/v1/chat/completions"
    : provider === "openai"
    ? "https://api.openai.com/v1/chat/completions"
    : (baseUrl ?? "").replace(/\/+$/, "") + "/chat/completions";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return {
      output: args.fallback,
      model_meta: {
        provider,
        model,
        usedFallback: true,
        error: `provider_error_${res.status}`,
        details: text.slice(0, 500),
      },
    };
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text || typeof text !== "string") {
    return {
      output: args.fallback,
      model_meta: { provider, model, usedFallback: true, error: "invalid_content" },
    };
  }

  try {
    return {
      output: JSON.parse(text) as Record<string, unknown>,
      model_meta: {
        provider,
        model,
        usedFallback: false,
      },
    };
  } catch {
    return {
      output: args.fallback,
      model_meta: { provider, model, usedFallback: true, error: "invalid_json" },
    };
  }
}

export function compact<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter((v): v is T => v != null);
}
