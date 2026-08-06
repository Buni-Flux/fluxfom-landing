import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
    if (!anonKey) {
      return new Response(
        JSON.stringify({ error: "Server misconfiguration: SUPABASE_ANON_KEY is not set." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return new Response(JSON.stringify({ error: "Expected a JSON object body." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = body as Record<string, unknown>;

    const user_id = typeof payload.user_id === "string" ? payload.user_id : undefined;
    const new_password = typeof payload.new_password === "string" ? payload.new_password : undefined;
    const new_email = typeof payload.new_email === "string" ? payload.new_email : undefined;
    const newRole = typeof payload.role === "string" ? payload.role : undefined;
    const banned = typeof payload.banned === "boolean" ? payload.banned : undefined;

    let actionRaw: unknown =
      payload.action ??
      payload.operation ??
      payload.Operation ??
      payload.op ??
      req.headers.get("x-admin-action");

    const actionMissing =
      actionRaw === undefined ||
      actionRaw === null ||
      (typeof actionRaw === "string" && !String(actionRaw).trim());

    if (actionMissing && user_id) {
      if (new_password && new_password.length >= 8) {
        actionRaw = "set_password";
      } else if (new_email && String(new_email).trim()) {
        actionRaw = "set_email";
      } else if (newRole && ["admin", "editor", "viewer"].includes(String(newRole))) {
        actionRaw = "set_role";
      } else if (typeof banned === "boolean") {
        actionRaw = "set_banned";
      } else if (payload.delete_user === true) {
        actionRaw = "delete_user";
      }
    }

    const action =
      typeof actionRaw === "string" ? String(actionRaw).trim().toLowerCase().replace(/\s+/g, "_") : "";

    if (!user_id && action !== "list_users") {
      return new Response(JSON.stringify({ error: "user_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const APP_ROLES = ["admin", "editor", "viewer"] as const;
    type AppRole = (typeof APP_ROLES)[number];

    const countAdmins = async () => {
      const { data, error } = await adminClient.from("user_roles").select("user_id").eq("role", "admin");
      if (error) throw new Error(error.message);
      const ids = new Set((data ?? []).map((r) => r.user_id));
      return ids.size;
    };

    if (action === "reset_password") {
      const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://fluxfom-clarity-engine.vercel.app";
      const resetRedirectTo = `${frontendUrl.replace(/\/+$/, "")}/reset-password`;

      const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(user_id);
      if (userError || !userData?.user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const recoveryEmail = userData.user.email?.trim();
      if (!recoveryEmail) {
        return new Response(
          JSON.stringify({
            error:
              "This account has no email on file, so a recovery email cannot be sent. Use “Set password” under Edit details & access, or add an email for this user in Supabase Auth.",
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const { error: linkError } = await adminClient.auth.admin.generateLink({
        type: "recovery",
        email: recoveryEmail,
        options: { redirectTo: resetRedirectTo },
      });

      if (linkError) {
        return new Response(JSON.stringify({ error: linkError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true, message: "Password reset link generated" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get_user") {
      const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(user_id);
      if (userError) {
        return new Response(JSON.stringify({ error: userError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const u = userData.user;
      return new Response(
        JSON.stringify({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          email_confirmed_at: u.email_confirmed_at,
          banned_until: u.banned_until ?? null,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (action === "set_password") {
      const pwd = typeof new_password === "string" ? new_password : "";
      if (pwd.length < 8) {
        return new Response(JSON.stringify({ error: "Password must be at least 8 characters" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: targetUser, error: targetErr } = await adminClient.auth.admin.getUserById(user_id);
      if (targetErr || !targetUser?.user) {
        return new Response(JSON.stringify({ error: targetErr?.message ?? "User not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error: updErr } = await adminClient.auth.admin.updateUserById(user_id, { password: pwd });
      if (updErr) {
        return new Response(JSON.stringify({ error: updErr.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "set_email") {
      const raw = typeof new_email === "string" ? new_email.trim() : "";
      if (!raw) {
        return new Response(JSON.stringify({ error: "Email is required." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (raw.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
        return new Response(JSON.stringify({ error: "Invalid email address." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: targetData, error: getErr } = await adminClient.auth.admin.getUserById(user_id);
      if (getErr || !targetData?.user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const current = targetData.user.email?.trim().toLowerCase() ?? "";
      if (current === raw.toLowerCase()) {
        return new Response(JSON.stringify({ success: true, unchanged: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: updErr } = await adminClient.auth.admin.updateUserById(user_id, {
        email: raw,
        email_confirm: true,
      });
      if (updErr) {
        return new Response(JSON.stringify({ error: updErr.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "set_role") {
      if (!newRole || !APP_ROLES.includes(newRole as AppRole)) {
        return new Response(JSON.stringify({ error: "Invalid role. Use admin, editor, or viewer." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: targetRoles } = await adminClient.from("user_roles").select("role").eq("user_id", user_id);
      const wasAdmin = (targetRoles ?? []).some((r) => r.role === "admin");
      if (wasAdmin && newRole !== "admin") {
        const n = await countAdmins();
        if (n <= 1) {
          return new Response(JSON.stringify({ error: "Cannot remove the last admin account." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
      await adminClient.from("user_roles").delete().eq("user_id", user_id);
      const { error: insErr } = await adminClient.from("user_roles").insert({ user_id, role: newRole });
      if (insErr) {
        return new Response(JSON.stringify({ error: insErr.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "set_banned") {
      if (caller.id === user_id) {
        return new Response(JSON.stringify({ error: "You cannot ban your own account." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const ban = banned === true;
      const { error: banErr } = await adminClient.auth.admin.updateUserById(user_id, {
        ban_duration: ban ? "876600h" : "none",
      });
      if (banErr) {
        return new Response(JSON.stringify({ error: banErr.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      await adminClient.from("profiles").upsert(
        { user_id, sign_in_disabled: ban },
        { onConflict: "user_id" },
      );
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete_user") {
      if (caller.id === user_id) {
        return new Response(JSON.stringify({ error: "You cannot delete your own account." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: targetRoles } = await adminClient.from("user_roles").select("role").eq("user_id", user_id);
      const targetIsAdmin = (targetRoles ?? []).some((r) => r.role === "admin");
      if (targetIsAdmin) {
        const n = await countAdmins();
        if (n <= 1) {
          return new Response(JSON.stringify({ error: "Cannot delete the last admin account." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
      await adminClient.from("user_permissions").delete().eq("user_id", user_id);
      await adminClient.from("user_roles").delete().eq("user_id", user_id);
      await adminClient.from("profiles").delete().eq("user_id", user_id);
      const { error: delErr } = await adminClient.auth.admin.deleteUser(user_id);
      if (delErr) {
        return new Response(JSON.stringify({ error: delErr.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list_users") {
      const { data: usersData, error: usersError } = await adminClient.auth.admin.listUsers();
      if (usersError) {
        return new Response(JSON.stringify({ error: usersError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify(
          (usersData.users ?? []).map((u) => ({
            id: u.id,
            email: u.email ?? null,
            phone: u.phone ?? null,
          })),
        ),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        error:
          `Invalid action (normalized: ${JSON.stringify(action)}, raw: ${JSON.stringify(actionRaw)}). ` +
          "Deploy admin-manage-users from this repo to the Supabase project matching VITE_SUPABASE_URL.",
      }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
