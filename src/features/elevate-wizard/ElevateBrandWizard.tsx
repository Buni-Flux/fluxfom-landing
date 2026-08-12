import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Loader2, Send, Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EMAIL_EVENTS } from "@/services/email/email.events";
import { sendEmail } from "@/services/email/sendEmail";
import { cn } from "@/lib/utils";
import { buildVerificationUrl } from "./verification";
import {
  BUSINESS_TYPES,
  CHALLENGES,
  GOAL_OPTIONS,
  MATURITY_OPTIONS,
  REASSURANCE,
  TEAM_OPTIONS,
  VISION_OPTIONS,
} from "./constants";
import { buildWizardSummary, opportunityAreas, suggestServices } from "./summary";
import { emptyAnswers, type ElevateWizardAnswers } from "./types";

type Option = string | { id: string; label: string; hint: string };

type WizardStep =
  | {
      kind: "start";
      title: string;
      description: string;
    }
  | {
      kind: "single";
      field: keyof ElevateWizardAnswers;
      title: string;
      description: string;
      options: readonly Option[];
    }
  | {
      kind: "multi";
      field: "challenges" | "goals";
      title: string;
      description: string;
      options: readonly string[];
    }
  | {
      kind: "final";
      title: string;
      description: string;
    };

const WIZARD_STEPS: readonly WizardStep[] = [
  {
    kind: "start",
    title: "A guided conversation for your brand.",
    description: "Answer one question at a time so FluxFom can build a sharper profile." ,
  },
  {
    kind: "single",
    field: "businessType",
    title: "What are you building?",
    description: "Choose the category that best describes your business.",
    options: BUSINESS_TYPES,
  },
  {
    kind: "multi",
    field: "challenges",
    title: "What’s slowing your brand down?",
    description: "Select the challenges that matter most right now.",
    options: CHALLENGES,
  },
  {
    kind: "single",
    field: "team",
    title: "How is your marketing managed today?",
    description: "Tell us who is running your marketing.",
    options: TEAM_OPTIONS,
  },
  {
    kind: "multi",
    field: "goals",
    title: "What matters most right now?",
    description: "Select the outcomes you want FluxFom to prioritize.",
    options: GOAL_OPTIONS,
  },
  {
    kind: "single",
    field: "maturity",
    title: "How established is your brand today?",
    description: "Choose the statement that best fits your current stage.",
    options: MATURITY_OPTIONS,
  },
  {
    kind: "single",
    field: "vision",
    title: "What kind of brand are you becoming?",
    description: "Pick the direction that feels most aligned with your next phase.",
    options: VISION_OPTIONS,
  },
  {
    kind: "final",
    title: "Finish with your brand name and email.",
    description: "We’ll use this to send your profile and next steps.",
  },
] as const;

function optionLabel(option: Option) {
  return typeof option === "string" ? option : option.label;
}

function optionHint(option: Option) {
  return typeof option === "string" ? undefined : option.hint;
}

function assistantBubble({ title, description }: { title: string; description: string }) {
  return (
    <div className="relative max-w-[90%] rounded-[2.25rem] border border-[#0B2B12]/10 bg-white px-6 py-6 shadow-[0_24px_80px_-48px_rgba(11,43,18,0.16)]">
      <div className="mb-4 inline-flex rounded-full bg-[#F4F7F1] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[#0B2B12]/70">
        Flux
      </div>
      <h3 className="text-xl font-semibold leading-tight tracking-tight text-[#0B2B12] sm:text-2xl">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-[#0B2B12]/75">{description}</p>
    </div>
  );
}

function userBubble({ text }: { text: string }) {
  return (
    <div className="relative ml-auto max-w-[80%] rounded-[2.25rem] bg-[#0B2B12] px-6 py-5 text-sm text-white shadow-[0_24px_60px_-30px_rgba(11,43,18,0.5)] ring-1 ring-white/10">
      <p className="whitespace-pre-wrap leading-6">{text}</p>
      <span className="absolute -right-4 bottom-2 h-4 w-4 rounded-tl-[1.5rem] bg-[#0B2B12]" />
    </div>
  );
}

function OptionButton({
  selected,
  onClick,
  label,
  hint,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl border px-5 py-4 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2B12]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        selected
          ? "border-[#0B2B12] bg-[#0B2B12] text-white shadow-[0_8px_30px_-10px_rgba(11,43,18,0.22)]"
          : "border-[#0B2B12]/10 bg-white text-[#0B2B12] hover:border-[#0B2B12]/30 hover:bg-[#F4F7F1]",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="block font-semibold">{label}</span>
          {hint ? <span className="mt-2 block text-[11px] text-[#0B2B12]/60">{hint}</span> : null}
        </div>
        {selected ? <span className="text-sm font-semibold">✓</span> : null}
      </div>
    </button>
  );
}

export function ElevateBrandWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ElevateWizardAnswers>(() => emptyAnswers());
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [micro, setMicro] = useState(() => REASSURANCE[Math.floor(Math.random() * REASSURANCE.length)]);

  useEffect(() => {
    document.title = "Start Profile — FluxFom";
  }, []);

  const currentStep = WIZARD_STEPS[step];

  const setSingle = useCallback(<K extends keyof ElevateWizardAnswers>(key: K, value: ElevateWizardAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleMulti = useCallback((key: "challenges" | "goals", value: string) => {
    setAnswers((prev) => {
      const current = prev[key];
      return {
        ...prev,
        [key]: current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value],
      };
    });
  }, []);

  const canContinue = useCallback(() => {
    switch (currentStep.kind) {
      case "start":
        return true;
      case "single":
        return Boolean(answers[currentStep.field]);
      case "multi":
        return answers[currentStep.field].length > 0;
      case "final":
        return answers.companyName.trim().length > 1 && answers.email.trim().length > 3 && answers.email.includes("@");
      default:
        return false;
    }
  }, [answers, currentStep]);

  const next = useCallback(() => {
    if (!canContinue() || step >= WIZARD_STEPS.length - 1) return;
    setMicro(REASSURANCE[(step + 1) % REASSURANCE.length]);
    setStep((current) => current + 1);
  }, [canContinue, step]);

  const back = useCallback(() => {
    if (step > 0) setStep((current) => current - 1);
  }, [step]);

  const submit = useCallback(async () => {
    if (!canContinue()) return;
    setSubmitting(true);

    try {
      const email = answers.email.trim();
      const summary = buildWizardSummary(answers);

      const { error } = await supabase.from("cms_submissions").insert({
        company_name: answers.companyName.trim(),
        industry: answers.businessType,
        email,
        website: null,
        brand_status: [answers.maturity, answers.vision, answers.team].filter(Boolean).join(" · ") || null,
        existing_assets: answers.challenges.join("; ") || null,
        business_goals: summary,
        tone_preferences: answers.goals.join("; ") || null,
        target_audience: opportunityAreas(answers).join("; "),
        competitors: suggestServices(answers).join("; "),
      });

      if (error) throw error;

      const baseUrl = import.meta.env.VITE_PUBLIC_SITE_URL || "https://fluxfom.com";
      const verificationUrl = buildVerificationUrl(baseUrl, email);
      const temporaryPassword = `fluxfom-${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;

      const { error: authError } = await supabase.auth.signUp({
        email,
        password: temporaryPassword,
        options: { emailRedirectTo: verificationUrl },
      });

      if (authError && !/already|registered|exists/i.test(authError.message)) {
        console.warn("Supabase account creation was skipped", authError.message);
      }

      await sendEmail({
        to: email,
        event: EMAIL_EVENTS.VERIFY_EMAIL,
        props: {
          clientName: answers.companyName.trim() || "there",
          verificationUrl,
        },
        preview: !import.meta.env.VITE_RESEND_API_KEY,
      });

      setDone(true);
    } catch (error) {
      console.error("Failed to submit start profile", error);
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  }, [answers, canContinue]);

  const clearAnswer = useCallback(
    (stepIndex: number) => {
      const stepItem = WIZARD_STEPS[stepIndex];
      if (stepItem.kind === "single") {
        setSingle(stepItem.field, null);
      }

      if (stepItem.kind === "multi") {
        setSingle(stepItem.field, []);
      }

      if (stepItem.kind === "final") {
        setSingle("companyName", "");
        setSingle("email", "");
      }

      if (step > stepIndex) {
        setStep(stepIndex);
      }
    },
    [setSingle, step],
  );

  const history = useMemo(() => {
    return WIZARD_STEPS.slice(1, step).map((stepItem, index) => {
      const answer =
        stepItem.kind === "multi"
          ? answers[stepItem.field].join(" · ")
          : stepItem.kind === "single"
          ? `${answers[stepItem.field] ?? ""}`
          : "";

      return {
        id: `${index + 1}-${stepItem.kind}`,
        stepIndex: index + 1,
        question: stepItem.title,
        answer: answer || "Not answered yet",
      };
    });
  }, [answers, step]);

  if (done) {
    return (
      <div className="min-h-screen bg-[#0B2B12] text-[#0B2B12]">
        <div className="fixed inset-x-0 top-0 z-20 border-b border-white/10 bg-[#0B2B12]/95 px-4 py-3 backdrop-blur-lg sm:px-6">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition hover:bg-white/10"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Home
            </Link>
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">Flux Chat</p>
              <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl">Conversation complete</h1>
            </div>
            <div className="w-16" aria-hidden />
          </div>
        </div>

        <main className="relative mx-auto min-h-screen max-w-[1400px] px-4 pt-24 pb-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-3xl rounded-[2rem] border border-white/10 bg-white/95 px-8 py-14 shadow-[0_40px_120px_-45px_rgba(5,16,5,0.28)] backdrop-blur-lg">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.28em] text-[#0B2B12]/70">All set</p>
              <h2 className="mt-4 text-3xl font-semibold text-[#0B2B12]">Your Flux profile is started.</h2>
              <p className="mt-4 text-sm leading-6 text-[#0B2B12]/70">
                We received your answers. A strategist will turn them into a marketing overview and the next aligned steps.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-full bg-[#0B2B12] px-8 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Return to FluxFom
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#C9FF6B]">
      <div className="fixed inset-x-0 top-0 z-20 border-b border-white/10 bg-[#C9FF6B] px-4 py-3 backdrop-blur-lg sm:px-6">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/90 shadow-sm">
            <Search className="h-4 w-4" />
            <span className="font-semibold uppercase tracking-[0.24em]">New Chat</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 bg-white/10 px-4 text-sm text-white/90 transition hover:bg-white/20">
              Share
            </button>
            <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/90 transition hover:bg-white/20">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {currentStep.kind === "start" ? (
        <main className="relative mx-auto min-h-screen max-w-[1400px] px-4 pt-24 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto flex min-h-[calc(80vh-5rem)] max-w-5xl flex-col justify-between gap-5">
            <div className="rounded-[2rem] px-10 py-12 backdrop-blur-lg">
              <div className="text-center">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B2B12] text-white shadow-sm">
                  <Plus className="h-6 w-6" />
                </div>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[#0B2B12]">Hello there!</h1>
                <p className="mt-3 text-sm leading-6 text-[#0B2B12]/70">I'm Fom AI, <br/>I basically help you get started marketing your brand. What can we do to market your brand today?</p>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.75rem] border border-[#0B2B12]/10 p-6 shadow-sm">
                  <h2 className="mt-6 text-base font-semibold text-[#0B2B12]">Get noticed</h2>
                  <p className="mt-3 text-sm leading-6 text-[#0B2B12]/70">Increase your visibility and attract more attention to your brand.</p>
                  <button
                    type="button"
                    onClick={next}
                    className="mt-6 w-fit inline-flex w-full items-center justify-center rounded-full bg-transparent px-4 py-3 text-sm font-semibold border border-[#0B2B12] text-[#0B2B12] transition hover:brightness-110"
                  >
                    {/* View Report */}
                  </button>
                </div>

                <div className="rounded-[1.75rem] border border-[#0B2B12]/10 p-6 shadow-sm">
                  <h2 className="mt-6 text-base font-semibold text-[#0B2B12]">Go digital</h2>
                  <p className="mt-3 text-sm leading-6 text-[#0B2B12]/70">Engage with your audience more effectively with digital marketing.</p>
                  <button
                    type="button"
                    onClick={next}
                    className="mt-6 w-fit inline-flex w-full items-center justify-center rounded-full bg-transparent px-4 py-3 text-sm font-semibold border border-[#0B2B12] text-[#0B2B12] transition hover:brightness-110"
                  >
                    {/* Analyze Budget */}
                  </button>
                </div>

                <div className="rounded-[1.75rem] border border-[#0B2B12]/10 p-6 shadow-sm">
                  <h2 className="mt-6 text-base font-semibold text-[#0B2B12]">Build a Brand</h2>
                  <p className="mt-3 text-sm leading-6 text-[#0B2B12]/70">Create a strong, recognizable brand for your target audience.</p>
                  <button
                    type="button"
                    onClick={next}
                    className="mt-6 w-fit inline-flex w-full items-center justify-center rounded-full bg-transparent px-4 py-3 text-sm font-semibold border border-[#0B2B12] text-[#0B2B12] transition hover:brightness-110"
                  >
                    
                  </button>
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-3xl">
              <div className="flex items-center gap-4 rounded-full border border-white/70 bg-white px-4 py-4 shadow-[0_25px_80px_-45px_rgba(5,16,5,0.18)]">
                <button className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0B2B12] text-white shadow-sm">
                  <Plus className="h-5 w-5" />
                </button>
                <div className="flex-1 text-sm text-[#0B2B12]/70">Write a message here...</div>
                <button className="inline-flex items-center gap-2 rounded-full bg-[#0B2B12] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110">
                  Send
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <main className="relative mx-auto min-h-screen max-w-[1400px] px-4 pt-24 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto flex min-h-[calc(80vh-5rem)] max-w-3xl flex-col justify-between gap-6">
            <div className="mx-auto w-full rounded-[2rem] border border-white/20 bg-[#C9FF6B]/90 px-8 py-10 backdrop-blur-lg">
              <h2 className="text-2xl font-semibold text-[#0B2B12]">{currentStep.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#0B2B12]/75">{currentStep.description}</p>

              {currentStep.kind === "final" ? (
                <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="mt-8 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.24em] text-[#0B2B12]/60">Brand or company name</span>
                      <input
                        value={answers.companyName}
                        onChange={(event) => setSingle("companyName", event.target.value)}
                        placeholder="Your brand or business name"
                        className="w-full rounded-2xl border border-[#0B2B12]/10 bg-white px-4 py-3 text-sm text-[#0B2B12] outline-none focus:border-[#0B2B12]/30 focus:ring-2 focus:ring-[#0B2B12]/10"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.24em] text-[#0B2B12]/60">Work email</span>
                      <input
                        type="email"
                        value={answers.email}
                        onChange={(event) => setSingle("email", event.target.value)}
                        placeholder="you@company.com"
                        className="w-full rounded-2xl border border-[#0B2B12]/10 bg-white px-4 py-3 text-sm text-[#0B2B12] outline-none focus:border-[#0B2B12]/30 focus:ring-2 focus:ring-[#0B2B12]/10"
                      />
                    </label>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <button
                      type="button"
                      onClick={back}
                      className="inline-flex items-center justify-center rounded-full border border-[#0B2B12]/10 bg-white px-6 py-3.5 text-sm font-semibold text-[#0B2B12] transition hover:border-[#0B2B12]/30"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!canContinue() || submitting}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B2B12] px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : "Submit profile"}
                      <Send className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {currentStep.options.map((option) => (
                    <OptionButton
                      key={optionLabel(option)}
                      selected={currentStep.kind === "single" ? answers[currentStep.field] === optionLabel(option) : answers[currentStep.field].includes(option)}
                      onClick={() =>
                        currentStep.kind === "single"
                          ? setSingle(currentStep.field, optionLabel(option))
                          : toggleMulti(currentStep.field, option)
                      }
                      label={optionLabel(option)}
                      hint={currentStep.kind === "single" ? optionHint(option) : undefined}
                    />
                  ))}
                </div>
              )}

              {currentStep.kind !== "final" ? (
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={next}
                    disabled={!canContinue()}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B2B12] px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              ) : null}
            </div>

            {history.length > 0 ? (
              <div className="mx-auto w-full max-w-2xl">
                <div className="rounded-[1.75rem] bg-[#0B2B12] px-6 py-4 text-white shadow-[0_25px_80px_-45px_rgba(5,16,5,0.3)]">
                  <p className="text-sm font-semibold">{history[history.length - 1].answer}</p>
                </div>
              </div>
            ) : null}

            <div className="mx-auto w-full max-w-3xl">
              <div className="flex items-center gap-4 rounded-full border border-white/80 bg-white px-4 py-4 shadow-[0_25px_80px_-45px_rgba(5,16,5,0.18)]">
                <button className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0B2B12] text-white shadow-sm">
                  <Plus className="h-5 w-5" />
                </button>
                <div className="flex-1 text-sm text-[#0B2B12]/70">Write a message here...</div>
                <button className="inline-flex items-center gap-2 rounded-full bg-[#0B2B12] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110">
                  Send
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
