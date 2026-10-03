import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, CircleDashed, Clock3, Mail, Phone, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { getProgressStageForStatus, projectProgressStages } from "@/features/elevate-wizard/onboarding";

type ProjectRecord = {
  id: string;
  title: string;
  status?: string | null;
  created_at?: string | null;
  display_name?: string | null;
  company_name?: string | null;
  customer_type?: string | null;
  email?: string | null;
  phone?: string | null;
  preferred_contact_method?: string | null;
  primary_goal?: string | null;
  project_description?: string | null;
  services?: string[] | null;
};

type ProjectDeliverable = {
  id?: string;
  title: string;
  description?: string | null;
  status?: string | null;
  display_order?: number;
};

const formatDate = (value?: string | null) => {
  if (!value) return "Today";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Today";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const statusLabelMap: Record<string, string> = {
  request_received: "Request received",
  reviewing: "Reviewing",
  strategy: "Strategy",
  in_progress: "In production",
  awaiting_client: "Awaiting client",
  review: "Final review",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function ProjectWorkspace() {
  const { projectId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [deliverables, setDeliverables] = useState<ProjectDeliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const loadProject = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase.from("project_requests").select("*").eq("id", projectId);
        const token = new URLSearchParams(location.search).get("token") || localStorage.getItem(`fluxfom-project-token:${projectId}`);

        if (user?.id) {
          query = query.eq("user_id", user.id);
        } else if (token) {
          query = query.eq("access_token", token);
        } else {
          setError("This project is not available yet. Please start from the onboarding flow again.");
          setLoading(false);
          return;
        }

        const { data, error: projectError } = await query.maybeSingle();
        if (projectError) throw projectError;
        if (!data) {
          setError("We could not find your project. Please check the link or start a new request.");
          setLoading(false);
          return;
        }

        const [, deliverablesResult] = await Promise.all([
          supabase.from("project_milestones").select("*").eq("project_id", data.id).order("display_order", { ascending: true }),
          supabase.from("project_deliverables").select("*").eq("project_id", data.id).order("display_order", { ascending: true }),
        ]);

        if (deliverablesResult.error) throw deliverablesResult.error;

        setProject(data);
        setDeliverables(deliverablesResult.data ?? []);
      } catch (loadError) {
        console.error("Failed to load project workspace", loadError);
        setError("Something went wrong while loading your project. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void loadProject();
  }, [location.search, projectId, user?.id]);

  const currentStage = useMemo(() => getProgressStageForStatus(project?.status), [project?.status]);
  const waitingForFlux = project?.status === "request_received" || project?.status === "reviewing" || project?.status === "strategy" || project?.status === "in_progress";
  const waitingForClient = project?.status === "awaiting_client";
  const contactDetail = project?.email || project?.phone || "No contact details shared yet.";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F6F1] px-4 py-10 text-[#0B2B12]">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#0B2B12]/10 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(15,23,16,0.28)]">
          <div className="flex items-center gap-3 text-sm font-medium text-[#0B2B12]/70">
            <Clock3 className="h-4 w-4 animate-pulse" />
            Loading your project workspace…
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#F5F6F1] px-4 py-10 text-[#0B2B12]">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#0B2B12]/10 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(15,23,16,0.28)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0B2B12]/60">Project access</p>
          <h1 className="mt-4 text-3xl font-semibold">We couldn’t open your project.</h1>
          <p className="mt-3 text-sm leading-6 text-[#0B2B12]/70">
            {error || "Your project could not be found."}
          </p>
          <Link to="/start" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0B2B12] px-5 py-3 text-sm font-semibold text-white">
            <ArrowLeft className="h-4 w-4" />
            Start a project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F1] text-[#0B2B12]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[2rem] border border-[#0B2B12]/10 bg-[#C9FF6B] p-6 shadow-[0_25px_70px_-40px_rgba(15,23,16,0.25)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#0B2B12]/60">FluxFom</p>
              <h1 className="mt-2 text-2xl font-semibold md:text-3xl">{project.title || "Your project"}</h1>
            </div>
            <div className="flex flex-col items-start gap-2 md:items-end">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#0B2B12]/10 bg-white/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B2B12]">
                <Sparkles className="h-3.5 w-3.5" />
                {statusLabelMap[project.status] || "Request received"}
              </span>
              <span className="text-xs uppercase tracking-[0.18em] text-[#0B2B12]/60">Started {formatDate(project.created_at)}</span>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-[#0B2B12]/10 bg-white p-6 shadow-[0_25px_70px_-40px_rgba(15,23,16,0.25)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B2B12]/60">About you</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#0B2B12]/55">Name</p>
                  <p className="mt-2 text-lg font-semibold">{project.display_name || project.company_name || "Client"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#0B2B12]/55">Customer type</p>
                  <p className="mt-2 text-lg font-semibold capitalize">{project.customer_type || "Personal"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#0B2B12]/55">Goal</p>
                  <p className="mt-2 text-sm leading-6 text-[#0B2B12]/75">{project.primary_goal || "We are clarifying the next steps."}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#0B2B12]/55">Preferred contact</p>
                  <p className="mt-2 text-sm font-medium">{project.preferred_contact_method || "Email"}</p>
                </div>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-[#0B2B12]/10 bg-[#F8F9F4] p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-[#0B2B12]">
                  {project.email ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                  {contactDetail}
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#0B2B12]/10 bg-white p-6 shadow-[0_25px_70px_-40px_rgba(15,23,16,0.25)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B2B12]/60">What you asked for</p>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#0B2B12]/55">Services</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(Array.isArray(project.services) ? project.services : []).length > 0 ? (
                      (Array.isArray(project.services) ? project.services : []).map((service: string) => (
                        <span key={service} className="rounded-full border border-[#0B2B12]/10 bg-[#F5F7F1] px-3 py-1.5 text-xs font-medium text-[#0B2B12]">
                          {service}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-[#0B2B12]/70">No specific services selected yet.</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#0B2B12]/55">Project goal</p>
                  <p className="mt-2 text-sm leading-6 text-[#0B2B12]/75">{project.primary_goal || "We are refining your brief."}</p>
                </div>

                {project.project_description ? (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#0B2B12]/55">Project description</p>
                    <p className="mt-2 text-sm leading-6 text-[#0B2B12]/75">{project.project_description}</p>
                  </div>
                ) : null}
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#0B2B12]/10 bg-white p-6 shadow-[0_25px_70px_-40px_rgba(15,23,16,0.25)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B2B12]/60">Project progress</p>
              <div className="mt-5 space-y-4">
                {projectProgressStages.map((stage, index) => {
                  const isCurrent = stage.key === currentStage.key;
                  const isPast = projectProgressStages.findIndex((item) => item.key === project.status) >= index;
                  const Icon = isPast ? CheckCircle2 : CircleDashed;

                  return (
                    <div key={stage.key} className="flex items-start gap-3 rounded-[1.25rem] border border-[#0B2B12]/10 bg-[#F8F9F4] p-3">
                      <Icon className={`mt-0.5 h-5 w-5 ${isCurrent ? "text-[#0B2B12]" : isPast ? "text-[#0B2B12]" : "text-[#0B2B12]/35"}`} />
                      <div>
                        <p className={`text-sm font-semibold ${isCurrent ? "text-[#0B2B12]" : "text-[#0B2B12]/70"}`}>
                          {stage.label}
                        </p>
                        {stage.key === "request_received" ? (
                          <p className="mt-1 text-xs leading-5 text-[#0B2B12]/60">We’ve received your request and are reviewing the information you provided.</p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#0B2B12]/10 bg-white p-6 shadow-[0_25px_70px_-40px_rgba(15,23,16,0.25)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B2B12]/60">Expected outputs</p>
              <div className="mt-5 space-y-3">
                {(deliverables.length > 0 ? deliverables : []).map((item) => (
                  <div key={item.id || item.title} className="rounded-[1.25rem] border border-[#0B2B12]/10 bg-[#F8F9F4] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#0B2B12]">{item.title}</p>
                      <span className="rounded-full bg-[#EAF7D7] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0B2B12]">
                        {item.status || "Upcoming"}
                      </span>
                    </div>
                    {item.description ? <p className="mt-2 text-sm leading-6 text-[#0B2B12]/70">{item.description}</p> : null}
                  </div>
                ))}

                {deliverables.length === 0 ? (
                  <p className="text-sm leading-6 text-[#0B2B12]/65">We’ll share the expected outputs here once the project has started.</p>
                ) : null}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-[#0B2B12]/10 bg-white p-6 shadow-[0_25px_70px_-40px_rgba(15,23,16,0.25)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B2B12]/60">Next up</p>
              <h2 className="mt-3 text-xl font-semibold">{waitingForFlux ? "Project review" : waitingForClient ? "Waiting for you" : "Your next steps"}</h2>
              <p className="mt-3 text-sm leading-6 text-[#0B2B12]/70">
                {waitingForFlux
                  ? "We’ll review your information and share the next steps once we’re ready to begin."
                  : waitingForClient
                  ? "We’re waiting on the information or file you need to share before we continue."
                  : "We’ll share the next milestone here as soon as it’s ready."}
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#0B2B12]/10 bg-[#0B2B12] p-6 text-white shadow-[0_25px_70px_-40px_rgba(15,23,16,0.25)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">Waiting for FluxFom</p>
              <p className="mt-3 text-sm leading-6 text-white/80">
                {waitingForFlux
                  ? "Your project is currently being reviewed by our team."
                  : "There is nothing urgent from FluxFom right now."}
              </p>
            </div>

            {waitingForClient ? (
              <div className="rounded-[2rem] border border-[#0B2B12]/10 bg-[#F8F9F4] p-6 shadow-[0_25px_70px_-40px_rgba(15,23,16,0.25)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B2B12]/60">Waiting for you</p>
                <p className="mt-3 text-sm leading-6 text-[#0B2B12]/75">We need the final information or files required before we can continue.</p>
              </div>
            ) : null}

            <div className="rounded-[2rem] border border-[#0B2B12]/10 bg-white p-6 shadow-[0_25px_70px_-40px_rgba(15,23,16,0.25)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B2B12]/60">Client actions</p>
              <div className="mt-4 space-y-3">
                <Link to="/contact" className="block rounded-full border border-[#0B2B12]/10 bg-[#F8F9F4] px-4 py-3 text-center text-sm font-semibold text-[#0B2B12]">
                  Talk to FluxFom
                </Link>
                <Link to="/start" className="block rounded-full border border-[#0B2B12]/10 bg-white px-4 py-3 text-center text-sm font-semibold text-[#0B2B12]">
                  Update contact information
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
