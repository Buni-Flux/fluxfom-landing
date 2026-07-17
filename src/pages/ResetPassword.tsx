import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { KeyRound } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);
  const [requestMode, setRequestMode] = useState(false);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get("type");
    if (type === "recovery") {
      setRequestMode(false);
      setReady(true);
    } else {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) setReady(true);
        else {
          setRequestMode(true);
          setReady(true);
        }
      });
    }
  }, []);

  const handleSendResetLink = async () => {
    if (!email) {
      toast({ title: "Please enter your email", variant: "destructive" });
      return;
    }

    const resetPath = "/reset-password";
    const appBaseUrl =
      window.location.hostname === "fluxfom-clarity-engine.vercel.app"
        ? "https://fluxfom-clarity-engine.vercel.app"
        : window.location.origin;

    setSaving(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appBaseUrl}${resetPath}`,
    });
    setSaving(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Reset link sent", description: "Check your email for a password reset link." });
  };

  const handleReset = async () => {
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated successfully" });
      navigate("/fom-core", { replace: true });
    }
  };

  if (!ready) {
    return (
      <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center bg-flux-void">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-flux-neon/50 border-t-transparent" aria-label="Loading" />
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/45 transition-colors focus:border-flux-neon/55 focus:outline-none focus:ring-1 focus:ring-flux-neon/25";

  if (requestMode) {
    return (
      <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center bg-flux-void px-6">
        <div className="w-full max-w-sm space-y-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_90px_-48px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-flux-neon/20 bg-flux-neon/10 text-flux-neon">
              <KeyRound size={24} aria-hidden />
            </div>
            <h1 className="heading-editorial mt-5 text-2xl font-semibold text-white">Forgot password</h1>
            <p className="mt-2 text-sm text-white/70">Enter your email and we will send a reset link.</p>
          </div>
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={inputClass}
              autoComplete="email"
            />
            <button
              type="button"
              onClick={handleSendResetLink}
              disabled={saving || !email}
              className="w-full rounded-full bg-flux-neon px-6 py-3 text-sm font-semibold text-flux-void transition hover:bg-[#b8ff33] disabled:opacity-50"
            >
              {saving ? "Sending..." : "Send reset link"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center bg-flux-void px-6">
      <div className="w-full max-w-sm space-y-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_24px_90px_-48px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-flux-neon/20 bg-flux-neon/10 text-flux-neon">
            <KeyRound size={24} aria-hidden />
          </div>
          <h1 className="heading-editorial mt-5 text-2xl font-semibold text-white">Reset password</h1>
          <p className="mt-2 text-sm text-white/70">Choose a new password for your account.</p>
        </div>
        <div className="space-y-4">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className={inputClass}
            autoComplete="new-password"
          />
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className={inputClass}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={handleReset}
            disabled={saving || !password}
            className="w-full rounded-full bg-flux-neon px-6 py-3 text-sm font-semibold text-flux-void transition hover:bg-[#b8ff33] disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
