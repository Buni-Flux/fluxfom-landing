import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isSignInDisabled, markAuthDisabledAndSignOut } from "@/lib/signInDisabled";
import type { User, Session } from "@supabase/supabase-js";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx>({} as AuthCtx);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);
  };

  const finishSession = async (session: Session | null) => {
    setSession(session);
    setUser(session?.user ?? null);
    if (!session?.user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      if (await isSignInDisabled(session.user.id)) {
        markAuthDisabledAndSignOut();
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      await checkAdmin(session.user.id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer async work to avoid Supabase auth lock deadlock
      setTimeout(() => {
        void finishSession(session);
      }, 0);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      void finishSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error as Error };

    if (data.user && (await isSignInDisabled(data.user.id))) {
      markAuthDisabledAndSignOut();
      return { error: new Error("Your account has been disabled. Contact an administrator.") };
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
