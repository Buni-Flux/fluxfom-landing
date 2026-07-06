import { supabase } from "@/integrations/supabase/client";

export const AUTH_DISABLED_STORAGE_KEY = "auth_block_reason";

/** Returns true when the user's profile has sign-in disabled by an admin. */
export async function isSignInDisabled(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("sign_in_disabled")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    // Column missing until migration is applied — treat as not disabled.
    if (error.message.includes("sign_in_disabled")) return false;
    throw error;
  }

  return data?.sign_in_disabled === true;
}

export function markAuthDisabledAndSignOut(): void {
  sessionStorage.setItem(AUTH_DISABLED_STORAGE_KEY, "disabled");
  void supabase.auth.signOut();
}
