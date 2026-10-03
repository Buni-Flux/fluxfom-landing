import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, ArrowLeft, Loader2, Mic, Search, CheckCircle2, Building2, UserRound, type LucideIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { buildProjectDeliverables, buildProjectMilestones, buildProjectPayload, type CustomerType, type ProjectFormValues } from "./onboarding";

const serviceOptions: Record<CustomerType, string[]> = {
  creative: [
    "Brand positioning",
    "Digital presence",
    "Social media content",
    "Brand identity",
    "Campaign strategy",
    "Portfolio refresh",
  ],
  personal: [
    "Personal brand positioning",
    "Website or portfolio",
    "Social media strategy",
    "Launch support",
    "Brand refresh",
    "Content planning",
  ],
  business: [
    "Brand positioning",
    "Website & digital presence",
    "Marketing strategy",
    "Content systems",
    "Campaign planning",
    "Launch support",
  ],
};

const defaultValues: ProjectFormValues = {
  customerType: "",
  name: "",
  companyName: "",
  email: "",
  phone: "",
  preferredContactMethod: "",
  profession: "",
  profileUrl: "",
  primaryGoal: "",
  services: [],
  projectDescription: "",
  desiredOutcome: "",
  timeline: "",
  source: "start_page",
};

const customerTypeMeta: Record<CustomerType, { label: string; summary: string; icon: LucideIcon }> = {
  creative: { label: "I’m a Creative", summary: "Artist, creator, photographer, filmmaker, or independent professional.", icon: Mic },
  personal: { label: "I’m here for myself", summary: "Personal brand, portfolio, identity, event or next professional chapter.", icon: UserRound },
  business: { label: "I’m representing a business", summary: "Startup, SME, team, or organization with a clear growth need.", icon: Building2 },
};

export function ElevateBrandWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState<ProjectFormValues>(defaultValues);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.title = "Start a project — FluxFom";
  }, []);

  const customerType = form.customerType as CustomerType | "";

  const totalSteps = 6;
  const questionsLeft = Math.max(totalSteps - currentStep - 1, 0);
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  const stepIsValid = () => {
    switch (currentStep) {
      case 0:
        return Boolean(customerType);
      case 1:
        return Boolean(form.name.trim() || form.companyName.trim());
      case 2:
        return Boolean(form.email.trim() || form.phone.trim());
      case 3:
        return Boolean(form.primaryGoal.trim());
      case 4:
        return form.services.length > 0;
      case 5:
        return Boolean(form.projectDescription.trim() || form.desiredOutcome.trim() || form.timeline.trim());
      default:
        return true;
    }
  };

  const advanceStep = () => {
    if (!stepIsValid()) return;
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const goBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const currentQuestion = (() => {
    const isBusiness = customerType === "business";
    switch (currentStep) {
      case 0:
        return {
          title: "What best describes you?",
          helper: "Start with the option that fits best.",
        };
      case 1:
        return {
          title: isBusiness ? "Who should we contact?" : "What’s your name?",
          helper: isBusiness ? "Tell us the main contact and their business." : "We’ll use this to personalize your project brief.",
        };
      case 2:
        return {
          title: "How can we reach you?",
          helper: "Leave whichever contact details are easiest for us to use.",
        };
      case 3:
        return {
          title: "What are you hoping to achieve?",
          helper: "Keep it simple and specific.",
        };
      case 4:
        return {
          title: "Which services fit your goal?",
          helper: "Pick the areas you want us to help with.",
        };
      case 5:
        return {
          title: "Tell us a little more about the project.",
          helper: "Add the context that will help us shape the right approach.",
        };
      default:
        return { title: "Complete your project brief", helper: "Almost there." };
    }
  })();

  const renderStepInput = () => {
    if (currentStep === 0) {
      return (
        <div className="grid gap-3 md:grid-cols-3">
          {(Object.keys(customerTypeMeta) as CustomerType[]).map((type) => {
            const meta = customerTypeMeta[type];
            const Icon = meta.icon;

            return (
              <button
                type="button"
                key={type}
                onClick={() => {
                  updateField("customerType", type);
                  setCurrentStep(1);
                }}
                className={`rounded-[1.75rem] border p-4 text-left transition ${form.customerType === type ? "border-[#0B2B12] bg-[#0B2B12] text-white shadow-[0_20px_50px_-28px_rgba(11,43,18,0.75)]" : "border-[#0B2B12]/10 bg-[#F7F8F2] text-[#0B2B12] hover:border-[#0B2B12]/30 hover:bg-white"}`}
              >
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${form.customerType === type ? "bg-white text-[#0B2B12]" : "bg-[#0B2B12] text-white"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">{meta.label}</h2>
                <p className={`mt-2 text-sm leading-6 ${form.customerType === type ? "text-white/75" : "text-[#0B2B12]/70"}`}>{meta.summary}</p>
              </button>
            );
          })}
        </div>
      );
    }

    if (currentStep === 1) {
      return (
        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B2B12]/60">{customerType === "business" ? "Contact person" : "Your name"}</span>
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder={customerType === "business" ? "Jane Doe" : "Your name"}
              className="w-full rounded-2xl border border-[#0B2B12]/10 bg-white px-4 py-3.5 text-base text-[#0B2B12] outline-none transition focus:border-[#0B2B12]/30 focus:ring-2 focus:ring-[#0B2B12]/10"
            />
          </label>

          {customerType === "business" ? (
            <label className="block space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B2B12]/60">Business name</span>
              <input
                value={form.companyName}
                onChange={(event) => updateField("companyName", event.target.value)}
                placeholder="Northline Studio"
                className="w-full rounded-2xl border border-[#0B2B12]/10 bg-white px-4 py-3.5 text-base text-[#0B2B12] outline-none transition focus:border-[#0B2B12]/30 focus:ring-2 focus:ring-[#0B2B12]/10"
              />
            </label>
          ) : (
            <label className="block space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B2B12]/60">Profession / discipline</span>
              <input
                value={form.profession}
                onChange={(event) => updateField("profession", event.target.value)}
                placeholder="Photographer, founder, strategist..."
                className="w-full rounded-2xl border border-[#0B2B12]/10 bg-white px-4 py-3.5 text-base text-[#0B2B12] outline-none transition focus:border-[#0B2B12]/30 focus:ring-2 focus:ring-[#0B2B12]/10"
              />
            </label>
          )}
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-4">
          <label className="block space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B2B12]/60">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="hello@example.com"
              className="w-full rounded-2xl border border-[#0B2B12]/10 bg-white px-4 py-3.5 text-base text-[#0B2B12] outline-none transition focus:border-[#0B2B12]/30 focus:ring-2 focus:ring-[#0B2B12]/10"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B2B12]/60">Phone</span>
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="+254 712 345 678"
              className="w-full rounded-2xl border border-[#0B2B12]/10 bg-white px-4 py-3.5 text-base text-[#0B2B12] outline-none transition focus:border-[#0B2B12]/30 focus:ring-2 focus:ring-[#0B2B12]/10"
            />
          </label>

          <div className="space-y-3 pt-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B2B12]/60">Preferred contact method</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {(["email", "phone", "whatsapp"] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => updateField("preferredContactMethod", method)}
                  className={`rounded-2xl border px-3 py-3 text-sm font-medium capitalize transition ${form.preferredContactMethod === method ? "border-[#0B2B12] bg-[#0B2B12] text-white" : "border-[#0B2B12]/10 bg-white text-[#0B2B12]"}`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div className="space-y-4">
          <textarea
            value={form.primaryGoal}
            onChange={(event) => updateField("primaryGoal", event.target.value)}
            rows={4}
            placeholder="We want a clearer brand story and more consistent demand generation."
            className="w-full rounded-[1.75rem] border border-[#0B2B12]/10 bg-white px-4 py-3.5 text-base text-[#0B2B12] outline-none transition focus:border-[#0B2B12]/30 focus:ring-2 focus:ring-[#0B2B12]/10"
          />
        </div>
      );
    }

    if (currentStep === 4) {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {serviceOptions[customerType].map((service) => (
            <button
              key={service}
              type="button"
              onClick={() => toggleService(service)}
              className={`flex items-center justify-between rounded-2xl border p-3 text-left text-sm transition ${form.services.includes(service) ? "border-[#0B2B12] bg-[#0B2B12] text-white" : "border-[#0B2B12]/10 bg-white text-[#0B2B12]"}`}
            >
              <span>{service}</span>
              {form.services.includes(service) ? <CheckCircle2 className="h-4 w-4" /> : null}
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <textarea
          value={form.projectDescription}
          onChange={(event) => updateField("projectDescription", event.target.value)}
          rows={5}
          placeholder="Tell us a bit more about your current situation, what’s already in motion, and what success should look like."
          className="w-full rounded-[1.75rem] border border-[#0B2B12]/10 bg-white px-4 py-3.5 text-base text-[#0B2B12] outline-none transition focus:border-[#0B2B12]/30 focus:ring-2 focus:ring-[#0B2B12]/10"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B2B12]/60">Desired outcome</span>
            <input
              value={form.desiredOutcome}
              onChange={(event) => updateField("desiredOutcome", event.target.value)}
              placeholder="A clearer offer and stronger positioning"
              className="w-full rounded-2xl border border-[#0B2B12]/10 bg-white px-4 py-3 text-base text-[#0B2B12] outline-none transition focus:border-[#0B2B12]/30 focus:ring-2 focus:ring-[#0B2B12]/10"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B2B12]/60">Approximate timeline</span>
            <input
              value={form.timeline}
              onChange={(event) => updateField("timeline", event.target.value)}
              placeholder="Within the next 4–6 weeks"
              className="w-full rounded-2xl border border-[#0B2B12]/10 bg-white px-4 py-3 text-base text-[#0B2B12] outline-none transition focus:border-[#0B2B12]/30 focus:ring-2 focus:ring-[#0B2B12]/10"
            />
          </label>
        </div>
      </div>
    );
  };

  const updateField = (field: keyof ProjectFormValues, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (service: string) => {
    setForm((prev) => {
      const services = prev.services.includes(service)
        ? prev.services.filter((item) => item !== service)
        : [...prev.services, service];
      return { ...prev, services };
    });
  };

  const formReady = useMemo(() => {
    if (!customerType) return false;
    if (!form.name.trim() && !form.companyName.trim()) return false;
    if (!form.email.trim() && !form.phone.trim()) return false;
    if (!form.primaryGoal.trim() && !form.projectDescription.trim()) return false;
    return true;
  }, [customerType, form.companyName, form.email, form.name, form.phone, form.primaryGoal, form.projectDescription]);

  const submitProject = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const payload = buildProjectPayload(form);
      setSubmitting(true);

      let userId = user?.id ?? null;
      if (!userId) {
        if (payload.email) {
          const temporaryPassword = `fluxfom-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
          const { data, error: signUpError } = await supabase.auth.signUp({
            email: payload.email,
            password: temporaryPassword,
          });

          if (signUpError && !/already|registered|exists/i.test(signUpError.message)) {
            throw signUpError;
          }

          userId = data.user?.id ?? null;
        }

        if (!userId) {
          const { data, error: anonymousError } = await supabase.auth.signInAnonymously();
          if (anonymousError) throw anonymousError;
          userId = data.user?.id ?? null;
        }
      }

      if (!userId) {
        throw new Error("We could not create your secure project record. Please try again.");
      }

      const projectInsert = {
        user_id: userId,
        customer_type: payload.customerType,
        display_name: payload.name,
        company_name: payload.companyName || null,
        email: payload.email || null,
        phone: payload.phone || null,
        preferred_contact_method: payload.preferredContactMethod,
        profession: payload.profession || null,
        profile_url: payload.profileUrl || null,
        primary_goal: payload.primaryGoal || null,
        services: payload.services,
        project_description: payload.projectDescription || null,
        desired_outcome: payload.desiredOutcome || null,
        timeline: payload.timeline || null,
        source: form.source || "start_page",
        status: "request_received",
        title: payload.title,
        access_token: crypto.randomUUID(),
        metadata: {
          customer_type: payload.customerType,
          preferred_contact_method: payload.preferredContactMethod,
          source: form.source || "start_page",
        },
      };

      const { data: project, error: projectError } = await supabase
        .from("project_requests")
        .insert(projectInsert)
        .select("id, access_token")
        .single();

      if (projectError) throw projectError;

      const milestones = buildProjectMilestones(project.id).map((milestone) => ({
        ...milestone,
        status: milestone.status,
      }));

      const deliverables = buildProjectDeliverables(project.id, payload.services).map((deliverable) => ({
        ...deliverable,
      }));

      const [milestonesResult, deliverablesResult] = await Promise.all([
        supabase.from("project_milestones").insert(milestones),
        supabase.from("project_deliverables").insert(deliverables),
      ]);

      if (milestonesResult.error) throw milestonesResult.error;
      if (deliverablesResult.error) throw deliverablesResult.error;

      const projectToken = project.access_token;
      if (projectToken) {
        localStorage.setItem(`fluxfom-project-token:${project.id}`, projectToken);
      }

      if (payload.email) {
        const safeName = payload.name || "there";
        try {
          await supabase.from("cms_submissions").insert({
            company_name: payload.companyName || safeName,
            industry: payload.customerType,
            email: payload.email,
            website: payload.profileUrl || null,
            brand_status: payload.primaryGoal || null,
            existing_assets: payload.services.join("; ") || null,
            business_goals: payload.summary,
            tone_preferences: payload.desiredOutcome || null,
            target_audience: payload.profession || null,
            competitors: payload.projectDescription || null,
            status: "new",
          });
        } catch (submissionError) {
          console.warn("Project intake was created without a matching cms_submission record.", submissionError);
        }
      }

      setSuccess(true);
      navigate(`/projects/${project.id}?token=${encodeURIComponent(projectToken)}`);
    } catch (submitError) {
      console.error("Failed to create project request", submitError);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while creating your project. Your information has not been lost. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#C9FF6B] px-4 py-10 text-[#0B2B12]">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-[#0B2B12]/10 bg-white/95 p-8 text-center shadow-[0_30px_80px_-40px_rgba(15,23,16,0.25)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0B2B12]/60">Project started</p>
          <h2 className="mt-4 text-3xl font-semibold">Your project is in motion.</h2>
          <p className="mt-3 text-sm leading-6 text-[#0B2B12]/70">We’ve received your request and are setting up your workspace.</p>
          <Link to="/" className="mt-8 inline-flex items-center justify-center rounded-full bg-[#0B2B12] px-6 py-3 text-sm font-semibold text-white">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#C9FF6B] text-[#0B2B12]">
      <div className="fixed inset-x-0 top-0 z-20 border-b border-[#0B2B12]/10 bg-[#C9FF6B]/95 px-4 py-3 backdrop-blur-lg sm:px-6">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0B2B12]/10 bg-white/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#0B2B12]">
            <Search className="h-3.5 w-3.5" />
            Start a project
          </div>
          <Link to="/" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0B2B12]/70">
            FluxFom
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-12 pt-12 sm:px-6 lg:px-8">
        <div className="border-none bg-transparent sm:p-8 lg:p-10">
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between gap-3">
              {/* <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0B2B12]/60">
                {currentStep === 0 ? "Question 1 of 6" : `Question ${Math.min(currentStep + 1, totalSteps)} of ${totalSteps}`}
              </div> */}
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0B2B12]/60">
                Just {questionsLeft} {questionsLeft === 1 ? "step" : "steps"} left
              </div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#0B2B12]/5">
              <div className="h-full rounded-full bg-[#0B2B12] transition-all duration-300" style={{ width: `${Math.min(progressPercent, 100)}%` }} />
            </div>
          </div>

          {!customerType && currentStep === 0 ? (
            <div className="space-y-6">
              <div className="max-w-2xl">
                <h1 className="text-4xl font-semibold tracking-tight text-[#0B2B12] sm:text-5xl">{currentQuestion.title}</h1>
                <p className="mt-3 text-base text-[#0B2B12]/70">{currentQuestion.helper}</p>
              </div>

              {renderStepInput()}
            </div>
          ) : (
            <form onSubmit={submitProject} className="space-y-8">
              {/* <div className="border-b border-[#0B2B12]/30 bg-transaparent p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="mt-2 text-xl font-semibold">{customerTypeMeta[customerType].label}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      updateField("customerType", "");
                      setCurrentStep(0);
                    }}
                    className="rounded-full border border-[#0B2B12]/10 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0B2B12]"
                  >
                    Change
                  </button>
                </div>
              </div> */}

              <div className="space-y-6">
                <div className="max-w-2xl">
                  <h1 className="text-4xl font-semibold tracking-tight text-[#0B2B12] sm:text-5xl">{currentQuestion.title}</h1>
                  <p className="mt-3 text-base text-[#0B2B12]/70">{currentQuestion.helper}</p>
                </div>

                {renderStepInput()}
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                {currentStep > 0 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0B2B12]/10 bg-white px-5 py-3 text-sm font-semibold text-[#0B2B12]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < totalSteps - 1 ? (
                  <button
                    type="button"
                    onClick={advanceStep}
                    disabled={!stepIsValid()}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B2B12] px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!formReady || submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B2B12] px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start my project"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
