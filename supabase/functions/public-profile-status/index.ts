import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const DEFAULT_FRONTEND_URL = "https://fluxfom.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") ?? url.searchParams.get("user_id");
    const clientId = url.searchParams.get("clientId") ?? url.searchParams.get("client_id");

    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: "Server misconfiguration" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("display_name")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileError) {
      return new Response(JSON.stringify({ error: profileError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let resolvedClientId = clientId;
    let status: string | null = null;

    if (!resolvedClientId) {
      const { data: clientData } = await adminClient
        .from("clients")
        .select("id")
        .eq("primary_contact_email", profile?.display_name ?? "")
        .maybeSingle();
      resolvedClientId = (clientData as { id?: string } | null)?.id ?? null;
    }

    if (resolvedClientId) {
      const { data: statusRow } = await adminClient
        .from("brand_manager_profiles")
        .select("profile_status")
        .eq("client_id", resolvedClientId)
        .maybeSingle();
      status = (statusRow as { profile_status?: string } | null)?.profile_status ?? null;
    }

    const frontendUrl = Deno.env.get("FRONTEND_URL") || DEFAULT_FRONTEND_URL;
    const profileUrl = `${frontendUrl.replace(/\/+$/, "")}/profile-status/${userId}${resolvedClientId ? `?client_id=${encodeURIComponent(resolvedClientId)}` : ""}`;

    return new Response(
      JSON.stringify({
        userId,
        clientId: resolvedClientId,
        clientName: profile?.display_name ?? null,
        status: status ? String(status).toLowerCase() : "review",
        profileUrl,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
