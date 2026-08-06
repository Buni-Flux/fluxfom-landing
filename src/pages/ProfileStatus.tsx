import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle, Clock, Package, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const isValidUuid = (value: string | null) =>
  !!value && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(value);

const ProfileStatus = () => {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();

  const [clientName, setClientName] = useState("Future Brand Co.");
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let isMounted = true;

    const loadProfileName = async () => {
      if (!isValidUuid(userId)) {
        if (!isMounted) return;
        setLoadError("This profile link is not valid.");
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", userId)
        .maybeSingle();

      if (!isMounted) return;
      if (data?.display_name) setClientName(data.display_name);
      if (error) console.warn("ProfileStatus: failed to fetch profile display name", error.message);
    };

    void loadProfileName();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  useEffect(() => {
    let isMounted = true;

    const loadStatus = async () => {
      const statusParam = searchParams.get("status")?.toLowerCase();
      if (statusParam) {
        if (!isMounted) return;
        setProfileStatus(statusParam === "live" ? "ready" : statusParam);
        setIsLoading(false);
        return;
      }

      if (!userId) {
        if (!isMounted) return;
        setLoadError("This profile link is missing a user identifier.");
        setIsLoading(false);
        return;
      }

      if (!isValidUuid(userId)) {
        if (!isMounted) return;
        setLoadError("This profile link is not valid.");
        setIsLoading(false);
        return;
      }

      const clientIdParam = searchParams.get("client_id");
      let clientIdLocal: string | null = clientIdParam ?? null;

      if (clientIdLocal && !isValidUuid(clientIdLocal)) {
        if (!isMounted) return;
        setLoadError("This profile link contains an invalid client identifier.");
        setIsLoading(false);
        return;
      }

      if (!clientIdLocal) {
        const { data: sessionData } = await supabase.auth.getSession();
        const email = sessionData?.data?.session?.user?.email ?? null;
        if (email) {
          const { data: client, error: clientError } = await supabase
            .from("clients")
            .select("id")
            .eq("primary_contact_email", email)
            .maybeSingle();

          if (clientError) console.warn("ProfileStatus: failed to fetch client by email", clientError.message);
          clientIdLocal = (client as any)?.id ?? null;
        }
      }

      if (!clientIdLocal) {
        if (!isMounted) return;
        setLoadError("Unable to resolve the client profile. Please contact support if this persists.");
        setIsLoading(false);
        return;
      }

      setClientId(clientIdLocal);

      try {
        const { data: project } = await supabase
          .from("cms_projects")
          .select("id")
          .eq("client_id", clientIdLocal)
          .eq("published", true)
          .limit(1)
          .maybeSingle();
        if (project && (project as any).id) setProjectId((project as any).id);
      } catch (e) {
        console.warn("ProfileStatus: failed to resolve project preview", e);
      }

      const { data: bm, error: bmErr } = await supabase
        .from("brand_manager_profiles")
        .select("profile_status")
        .eq("client_id", clientIdLocal)
        .maybeSingle();

      if (!isMounted) return;
      if (bm?.profile_status) setProfileStatus(String(bm.profile_status).toLowerCase());
      if (bmErr) console.warn("ProfileStatus: failed to fetch brand_manager_profiles", bmErr.message);
      setIsLoading(false);
    };

    void loadStatus();
    return () => {
      isMounted = false;
    };
  }, [searchParams, userId]);

  useEffect(() => {
    document.title = "Profile status — FluxFom";
  }, []);

  const status = useMemo(() => {
    if (profileStatus) return profileStatus === "live" ? "ready" : profileStatus;
    const statusParam = searchParams.get("status")?.toLowerCase();
    if (statusParam === "ready" || statusParam === "live") return "ready";
    if (statusParam === "review" || statusParam === "in-review") return "review";
    return "review";
  }, [searchParams, profileStatus]);

  const projectName = useMemo(() => searchParams.get("project") ?? "Customer profile update", [searchParams]);
  const resolvedClientName = useMemo(() => searchParams.get("client") ?? clientName, [searchParams, clientName]);
  const userIdDisplay = useMemo(() => userId ?? "unknown user", [userId]);

  const title =
    status === "ready"
      ? "Your profile is ready for the final review"
      : status === "closed"
      ? "This profile has been closed"
      : "Your profile is in progress";

  const subtitle =
    status === "ready"
      ? "The FluxFom team has completed the asset pack and brand narrative. Review it here before launch."
      : status === "closed"
      ? "This project has been closed by the client. Contact support for questions."
      : "We’re finalizing your client profile and making sure every detail is polished for your brand launch.";

  const stepIndex = status === "ready" ? 3 : 2;

  const steps = [
    { label: "Brief received", description: "We have your project details and brand inputs.", icon: Clock },
    { label: "Profile in progress", description: "Design, copy, and audience positioning are being assembled.", icon: Package },
    { label: "Ready to review", description: "Your profile is finished and ready for customer review.", icon: CheckCircle },
  ];

  if (loadError) {
    return (
      <div className="bg-flux-cream min-h-screen text-flux-editorial">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-flux-clay/80">Profile status issue</p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-flux-editorial sm:text-5xl">Unable to load profile status</h1>
          <p className="mt-4 text-sm leading-7 text-flux-cool-gray sm:text-base">{loadError}</p>
          <Link to="/" className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-flux-editorial/15 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-flux-editorial transition hover:border-flux-editorial/30 hover:bg-flux-sand">
            Return to FluxFom
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-flux-cream text-flux-editorial">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-flux-clay/80">Profile status preview</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-flux-editorial sm:text-5xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-flux-cool-gray sm:text-base">{subtitle}</p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-flux-cool-gray sm:text-base">{resolvedClientName} · user ID {userIdDisplay} · track the current profile progress and view the latest version once it is ready.</p>
          </div>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-flux-editorial/15 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-flux-editorial transition hover:border-flux-editorial/30 hover:bg-flux-sand">
            Back to FluxFom
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.8fr_1fr]">
          <article className="overflow-hidden rounded-[2rem] border border-flux-sand/70 bg-white shadow-[0_28px_90px_-60px_rgba(27,43,34,0.45)]">
            <div className="relative overflow-hidden bg-flux-void px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_45%)]" />
              <div className="relative flex min-h-[320px] items-end justify-between rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-flux-void via-[#161f22] to-[#0c1315] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] sm:p-8">
                <div className="space-y-5 text-white">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90">{status === "ready" ? "Ready" : status === "closed" ? "Closed" : "In progress"}</div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/70">Customer profile</p>
                    <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{resolvedClientName}</h2>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-white/70">A polished overview of the brand story, services, and visual direction — built to launch with confidence.</p>
                  </div>
                </div>
                <div className="relative h-44 w-44 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)] sm:h-52 sm:w-52">
                  <div className="absolute inset-0 rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_55%)]" />
                  <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-3xl bg-flux-neon/15 text-flux-neon"><Sparkles size={22} aria-hidden /></div>
                  <div className="absolute bottom-4 left-4 right-4 rounded-[1.25rem] border border-white/10 bg-flux-sand/10 p-4 text-[11px] uppercase tracking-[0.24em] text-white/80">Live preview</div>
                </div>
              </div>
            </div>

            <div className="space-y-8 px-6 pb-8 pt-10 sm:px-8">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-flux-sand/60 bg-flux-cream/95 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-flux-clay">Status</p>
                  <p className="mt-3 text-2xl font-semibold text-flux-editorial">{status === "ready" ? "Ready to review" : "Review in progress"}</p>
                </div>
                <div className="rounded-[1.5rem] border border-flux-sand/60 bg-flux-cream/95 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-flux-clay">Timeline</p>
                  <p className="mt-3 text-2xl font-semibold text-flux-editorial">2–3 days</p>
                </div>
                <div className="rounded-[1.5rem] border border-flux-sand/60 bg-flux-cream/95 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-flux-clay">Review items</p>
                  <p className="mt-3 text-2xl font-semibold text-flux-editorial">Brand story, assets, deliverables</p>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-flux-sand/70 bg-flux-sand/10 p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-flux-clay">Project overview</p>
                <div className="mt-6 space-y-4 text-sm leading-7 text-flux-cool-gray">
                  <p>
                    This page is a dedicated status dashboard for your customer-facing profile. It mirrors the polished presentation of a Dribbble project page, with a visual hero, progress details, and clear next steps.
                  </p>
                  <p>
                    When the profile is complete, your customer can return to this page to review the final version and follow the launch guidance included in the completion email.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-flux-sand/65 bg-white/95 p-7 shadow-[0_24px_80px_-55px_rgba(27,43,34,0.35)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-flux-clay">Latest update</p>
                  <p className="mt-3 text-2xl font-semibold text-flux-editorial">{status === "ready" ? "Ready for your review" : "In progress"}</p>
                </div>
                <div className="rounded-full bg-flux-neon/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-flux-neon">{status === "ready" ? "Complete" : "Working"}</div>
              </div>
              <div className="mt-6 flex flex-col gap-4">
                <div className="rounded-3xl border border-flux-sand/50 bg-flux-cream/90 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-flux-clay/80">Next milestone</p>
                  <p className="mt-2 font-semibold text-flux-editorial">{status === "ready" ? "Final review and launch prep" : "Complete the profile narrative and visuals"}</p>
                </div>
                <div className="rounded-3xl border border-flux-sand/50 bg-flux-cream/90 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-flux-clay/80">Shared with</p>
                  <p className="mt-2 font-semibold text-flux-editorial">{resolvedClientName}</p>
                </div>
              </div>
              {status === "ready" ? (
                <Link to={projectId ? `/projects/${projectId}` : "/projects"} className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-flux-editorial px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-flux-neon">
                  View full profile
                </Link>
              ) : status === "closed" ? (
                <a href="/" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-flux-clay px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white/90 transition hover:bg-flux-clay/90">
                  Profile closed — contact support
                </a>
              ) : (
                <Link to="/" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-flux-editorial px-5 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-flux-neon">
                  Return to FluxFom
                </Link>
              )}
            </div>

            <div className="rounded-[2rem] border border-flux-sand/65 bg-white/95 p-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-flux-clay">Progress</p>
              <div className="mt-6 space-y-4">
                {steps.map((step, index) => {
                  const completed = index + 1 <= stepIndex;
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="flex items-start gap-4">
                      <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-flux-sand/80 text-flux-editorial"><Icon size={18} aria-hidden /></div>
                      <div>
                        <p className="font-semibold text-flux-editorial">{step.label}</p>
                        <p className="mt-1 text-sm leading-6 text-flux-cool-gray">{step.description}</p>
                      </div>
                      {completed && (
                        <div className="ml-auto mt-2 rounded-full bg-flux-neon/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-flux-neon">{index + 1 === stepIndex ? "Current" : "Done"}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProfileStatus;
