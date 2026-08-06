import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type VerifyState = "verifying" | "success" | "ready" | "error";

const VerifyEmailPage = () => {
  const location = useLocation();
  const [verifyState, setVerifyState] = useState<VerifyState>("verifying");
  const [verifiedEmail, setVerifiedEmail] = useState("");

  useEffect(() => {
    document.title = "Verify your email — FluxFom";
  }, []);

  const email = useMemo(() => new URLSearchParams(location.search).get("email") ?? "", [location.search]);

  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams(location.search);
    const hasAuthParams = ["token_hash", "token", "type", "code", "access_token", "refresh_token"].some((key) => params.has(key));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === "SIGNED_IN" || session?.user) {
        setVerifiedEmail(session.user?.email ?? email);
        setVerifyState("success");
      } else if (event === "SIGNED_OUT") {
        setVerifyState("ready");
      }
    });

    void supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!isMounted) return;
      if (error) {
        setVerifyState("error");
        return;
      }

      if (session?.user) {
        setVerifiedEmail(session.user.email ?? email);
        setVerifyState("success");
        return;
      }

      if (hasAuthParams) {
        setVerifyState("ready");
      } else {
        setVerifyState("ready");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [email, location.search]);

  const title = verifyState === "success"
    ? "Your account is verified"
    : verifyState === "error"
      ? "We couldn’t confirm that link"
      : "Confirming your account";

  const description = verifyState === "success"
    ? `Your account is now ready and we’ll keep updates flowing to ${verifiedEmail || email || "your email"}.`
    : verifyState === "error"
      ? "That verification link may have expired, already been used, or been opened from the wrong place."
      : "We’re confirming the account link now. This usually finishes in a moment.";

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-6rem)] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center text-flux-editorial">
      <div className="rounded-[1.75rem] border border-flux-sand bg-white/80 p-8 shadow-[0_24px_80px_-55px_rgba(27,43,34,0.48)] sm:p-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-flux-clay">Email verification</p>
        <h1 className="heading-editorial mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-flux-cool-gray">{description}</p>
        <p className="mt-4 text-sm leading-relaxed text-flux-cool-gray">
          {verifyState === "success"
            ? "You can now continue with FluxFom updates and follow-up messages."
            : "If you opened this from the onboarding email, the confirmation will finish automatically once Supabase finishes processing it."}
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center rounded-full border border-flux-clay/30 bg-flux-sand/40 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-flux-editorial transition hover:border-flux-green/55"
        >
          Back to FluxFom
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
