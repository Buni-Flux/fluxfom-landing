import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { isLikelyDirectVideoUrl, videoUrlToIframeSrc } from "@/lib/videoEmbed";
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

const stepVariants = {
  enter: { opacity: 0, x: 28, filter: "blur(4px)" },
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: { opacity: 0, x: -20, filter: "blur(4px)" },
};

function Ambient() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -left-1/4 top-0 h-[70vh] w-[70vw] rounded-full bg-flux-growth/10 blur-[120px]"
        animate={{ x: [0, 36, 0], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-1/4 bottom-0 h-[55vh] w-[55vw] rounded-full bg-flux-amber/14 blur-[100px]"
        animate={{ x: [0, -28, 0], opacity: [0.3, 0.45, 0.3] }}
        transition={{ duration: 24, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,rgba(255,255,255,0.58),transparent_52%)]" />
      <div className="flux-grain absolute inset-0 opacity-20 mix-blend-multiply" />
    </div>
  );
}

function ProgressBar({ step, complete }: { step: number; complete: boolean }) {
  const pct = complete ? 100 : Math.min(100, (step / 7) * 100);
  return (
    <div className="relative z-20 h-0.5 w-full bg-flux-sand">
      <motion.div
        className="h-full bg-gradient-to-r from-flux-forest via-flux-green to-flux-growth"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
      />
    </div>
  );
}

function SelectTile({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        "rounded-2xl border px-5 py-4 text-left text-sm font-semibold text-flux-editorial transition-colors duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flux-clay/35 focus-visible:ring-offset-2 focus-visible:ring-offset-flux-ivory",
        selected
          ? "border-flux-green/50 bg-flux-sand/35 shadow-[0_0_0_1px_rgba(166,106,63,0.12)]"
          : "border-flux-sand bg-white/62 hover:border-flux-green/45 hover:bg-white/90",
        className,
      )}
    >
      <span className="flex items-center justify-between gap-3">
        <span>{children}</span>
        {selected ? <Check className="h-4 w-4 shrink-0 text-flux-clay" strokeWidth={2.5} aria-hidden /> : null}
      </span>
    </motion.button>
  );
}

type RecentVideoProject = {
  id: string;
  title: string;
  category: string;
  video_url: string | null;
  preview_image_url: string | null;
  image_url: string | null;
};

function withYouTubeParams(embedSrc: string): string {
  if (!embedSrc.includes("youtube.com/embed") && !embedSrc.includes("youtube-nocookie.com/embed")) {
    return embedSrc;
  }
  const sep = embedSrc.includes("?") ? "&" : "?";
  return `${embedSrc}${sep}modestbranding=1&rel=0`;
}

function RecentWorkVideoCard({ project }: { project: RecentVideoProject }) {
  const raw = project.video_url?.trim() ?? "";
  const embedSrc = videoUrlToIframeSrc(raw);
  const iframeSrc = embedSrc ? withYouTubeParams(embedSrc) : null;
  const poster = project.preview_image_url?.trim() || project.image_url?.trim() || undefined;
  const native = !iframeSrc && isLikelyDirectVideoUrl(raw);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-flux-sand bg-white/70 text-left shadow-sm">
      <div className="relative aspect-video w-full bg-flux-sand">
        {iframeSrc ? (
          <iframe
            title={`${project.title} — showreel`}
            src={iframeSrc}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : native ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster={poster}
          >
            <source src={raw} />
          </video>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="text-xs text-flux-cool-gray">Open this reel in a new tab.</p>
            <a
              href={raw}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-flux-clay transition hover:text-flux-editorial"
            >
              Watch video
            </a>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-flux-clay">{project.category}</p>
        <h3 className="heading-editorial mt-1.5 text-lg font-semibold leading-snug text-flux-editorial">{project.title}</h3>
        <Link
          to={`/projects/${project.id}`}
          className="mt-4 inline-flex text-[10px] font-semibold uppercase tracking-[0.2em] text-flux-cool-gray transition hover:text-flux-editorial"
        >
          Case study →
        </Link>
      </div>
    </article>
  );
}

export function ElevateBrandWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ElevateWizardAnswers>(() => emptyAnswers());
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [recentVideos, setRecentVideos] = useState<RecentVideoProject[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [micro, setMicro] = useState(() => REASSURANCE[Math.floor(Math.random() * REASSURANCE.length)]);

  const reassurance = useMemo(() => micro, [micro]);

  useEffect(() => {
    document.title = "Start Profile — FluxFom";
  }, []);

  useEffect(() => {
    if (!done) return;
    let cancelled = false;
    setVideosLoading(true);
    void supabase
      .from("cms_projects")
      .select("id, title, category, video_url, preview_image_url, image_url")
      .eq("published", true)
      .not("video_url", "is", null)
      .order("updated_at", { ascending: false })
      .limit(3)
      .then(({ data, error }) => {
        if (cancelled) return;
        setVideosLoading(false);
        if (error || !data) {
          setRecentVideos([]);
          return;
        }
        const withVideo = (data as RecentVideoProject[]).filter((p) => p.video_url?.trim());
        setRecentVideos(withVideo.slice(0, 3));
      });
    return () => {
      cancelled = true;
    };
  }, [done]);

  const setSingle = useCallback(<K extends keyof ElevateWizardAnswers>(key: K, value: ElevateWizardAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleMulti = useCallback((key: "challenges" | "goals", value: string) => {
    setAnswers((prev) => {
      const arr = prev[key];
      const has = arr.includes(value);
      return { ...prev, [key]: has ? arr.filter((x) => x !== value) : [...arr, value] };
    });
  }, []);

  const canContinue = useCallback(() => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return Boolean(answers.businessType);
      case 2:
        return answers.challenges.length > 0;
      case 3:
        return Boolean(answers.team);
      case 4:
        return answers.goals.length > 0;
      case 5:
        return Boolean(answers.maturity);
      case 6:
        return Boolean(answers.vision);
      case 7:
        return answers.email.trim().length > 3 && answers.email.includes("@") && answers.companyName.trim().length > 1;
      default:
        return false;
    }
  }, [step, answers]);

  const next = useCallback(() => {
    if (step < 7 && canContinue()) {
      setMicro(REASSURANCE[(step + 1) % REASSURANCE.length]);
      setStep((s) => s + 1);
    }
  }, [step, canContinue]);

  const back = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  const submit = useCallback(async () => {
    if (!canContinue()) return;
    setSubmitting(true);
    const summary = buildWizardSummary(answers);
    await supabase.from("cms_submissions").insert({
      company_name: answers.companyName.trim(),
      industry: answers.businessType,
      email: answers.email.trim(),
      website: null,
      brand_status: [answers.maturity, answers.vision, answers.team].filter(Boolean).join(" · ") || null,
      existing_assets: answers.challenges.join("; ") || null,
      business_goals: summary,
      tone_preferences: answers.goals.join("; ") || null,
      target_audience: opportunityAreas(answers).join("; "),
      competitors: suggestServices(answers).join("; "),
    });
    setSubmitting(false);
    setDone(true);
  }, [answers, canContinue]);

  const modules = useMemo(() => suggestServices(answers), [answers]);
  const opportunities = useMemo(() => opportunityAreas(answers), [answers]);

  return (
    <div className="relative flex min-h-[calc(100dvh-5rem)] flex-col overflow-hidden bg-flux-ivory text-flux-editorial">
      <Ambient />
      <ProgressBar step={step} complete={done} />

      <header className="relative z-20 flex items-center justify-between px-5 py-4 sm:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-flux-cool-gray transition hover:text-flux-editorial"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Home
        </Link>
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-flux-gold">Start Profile</span>
        <span className="w-14" aria-hidden />
      </header>

      <div
        className={cn(
          "relative z-10 flex flex-1 flex-col items-center justify-center px-5 pt-4 sm:px-8",
          done ? "pb-24" : "pb-36",
        )}
      >
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-5xl text-center"
            >
              <div className="mx-auto max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-flux-green/35 bg-flux-sand/35 text-flux-clay">
                  <Sparkles className="h-7 w-7" aria-hidden />
                </div>
                <h2 className="heading-editorial mt-8 text-3xl font-semibold text-flux-editorial">Your Flux profile is started.</h2>
                <p className="mt-4 text-sm leading-relaxed text-flux-cool-gray">
                  We received your profile. A strategist will turn your answers into a marketing overview and follow up
                  with clear next steps.
                </p>
                <Link
                  to="/"
                  className="mt-10 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-flux-clay transition hover:text-flux-editorial"
                >
                  Back to FluxFom
                </Link>
              </div>

              <div className="mt-16 border-t border-flux-sand pt-14 text-left">
                <p className="text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-flux-clay">
                  Recent work
                </p>
                <h3 className="heading-editorial mt-3 text-center text-2xl font-semibold text-flux-editorial sm:text-3xl">
                  Recent creative proof from the studio
                </h3>
                <p className="mx-auto mt-3 max-w-xl text-center text-sm text-flux-cool-gray">
                  Watch how we translate strategy into campaign, motion, and brand surfaces.
                </p>

                {videosLoading ? (
                  <div className="mt-10 flex justify-center py-8">
                    <div
                      className="h-8 w-8 animate-spin rounded-full border-2 border-flux-green/40 border-t-transparent"
                      aria-label="Loading videos"
                    />
                  </div>
                ) : recentVideos.length === 0 ? (
                  <p className="mt-10 text-center text-sm text-flux-cool-gray">
                    <Link to="/projects" className="text-flux-clay underline-offset-4 transition hover:text-flux-editorial hover:underline">
                      Browse all projects
                    </Link>{" "}
                    — new motion pieces will land here as we publish them.
                  </p>
                ) : (
                  <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {recentVideos.map((p) => (
                      <RecentWorkVideoCard key={p.id} project={p} />
                    ))}
                  </div>
                )}

                {recentVideos.length > 0 ? (
                  <div className="mt-10 flex justify-center">
                    <Link
                      to="/projects"
                      className="rounded-full border border-flux-clay/30 bg-white/55 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-flux-editorial transition hover:border-flux-green/55"
                    >
                      View all work
                    </Link>
                  </div>
                ) : null}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-lg"
            >
              <div className="rounded-[1.65rem] border border-flux-sand bg-flux-ivory/88 p-8 shadow-[0_24px_80px_-55px_rgba(27,43,34,0.48)] backdrop-blur-sm sm:p-10">
                {step === 0 ? (
                  <>
                    <p className="text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-flux-clay">
                      Start profile
                    </p>
                    <h1 className="heading-editorial mt-5 text-center text-3xl font-semibold leading-[1.12] text-flux-editorial sm:text-4xl">
                      Let&apos;s map the brand system you need next.
                    </h1>
                    <p className="mt-5 text-center text-sm leading-relaxed text-flux-cool-gray">
                      A few guided questions so FluxFom can understand your identity, audience, channels, campaign needs,
                      and growth goals before shaping your marketing overview.
                    </p>
                  </>
                ) : null}

                {step === 1 ? (
                  <>
                    <p className="text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-flux-clay">
                      Step 1 of 7
                    </p>
                    <h2 className="heading-editorial mt-4 text-center text-2xl font-semibold text-flux-editorial sm:text-3xl">
                      What are you building?
                    </h2>
                    <p className="mt-3 text-center text-xs font-medium text-flux-cool-gray">{reassurance}</p>
                    <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
                      {BUSINESS_TYPES.map((t) => (
                        <SelectTile
                          key={t}
                          selected={answers.businessType === t}
                          onClick={() => setSingle("businessType", t)}
                          className="sm:col-span-1"
                        >
                          {t}
                        </SelectTile>
                      ))}
                    </div>
                  </>
                ) : null}

                {step === 2 ? (
                  <>
                    <p className="text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-flux-clay">
                      Step 2 of 7
                    </p>
                    <h2 className="heading-editorial mt-4 text-center text-2xl font-semibold text-flux-editorial sm:text-3xl">
                      What&apos;s slowing your brand down?
                    </h2>
                    <p className="mt-3 text-center text-xs font-medium text-flux-cool-gray">Select all that apply.</p>
                    <div className="mt-8 grid max-h-[min(52vh,420px)] gap-2.5 overflow-y-auto pr-1 sm:max-h-none sm:grid-cols-2">
                      {CHALLENGES.map((c) => (
                        <SelectTile
                          key={c}
                          selected={answers.challenges.includes(c)}
                          onClick={() => toggleMulti("challenges", c)}
                        >
                          {c}
                        </SelectTile>
                      ))}
                    </div>
                  </>
                ) : null}

                {step === 3 ? (
                  <>
                    <p className="text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-flux-clay">
                      Step 3 of 7
                    </p>
                    <h2 className="heading-editorial mt-4 text-center text-2xl font-semibold text-flux-editorial sm:text-3xl">
                      How is your marketing managed today?
                    </h2>
                    <p className="mt-3 text-center text-xs font-medium text-flux-cool-gray">{reassurance}</p>
                    <div className="mt-8 grid gap-2.5">
                      {TEAM_OPTIONS.map((t) => (
                        <SelectTile key={t} selected={answers.team === t} onClick={() => setSingle("team", t)}>
                          {t}
                        </SelectTile>
                      ))}
                    </div>
                  </>
                ) : null}

                {step === 4 ? (
                  <>
                    <p className="text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-flux-clay">
                      Step 4 of 7
                    </p>
                    <h2 className="heading-editorial mt-4 text-center text-2xl font-semibold text-flux-editorial sm:text-3xl">
                      What matters most right now?
                    </h2>
                    <p className="mt-3 text-center text-xs font-medium text-flux-cool-gray">Select all that apply.</p>
                    <div className="mt-8 grid max-h-[min(52vh,420px)] gap-2.5 overflow-y-auto pr-1 sm:max-h-none sm:grid-cols-2">
                      {GOAL_OPTIONS.map((g) => (
                        <SelectTile
                          key={g}
                          selected={answers.goals.includes(g)}
                          onClick={() => toggleMulti("goals", g)}
                        >
                          {g}
                        </SelectTile>
                      ))}
                    </div>
                  </>
                ) : null}

                {step === 5 ? (
                  <>
                    <p className="text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-flux-clay">
                      Step 5 of 7
                    </p>
                    <h2 className="heading-editorial mt-4 text-center text-2xl font-semibold text-flux-editorial sm:text-3xl">
                      How established is your brand today?
                    </h2>
                    <div className="mt-8 grid gap-2.5">
                      {MATURITY_OPTIONS.map((m) => (
                        <SelectTile key={m} selected={answers.maturity === m} onClick={() => setSingle("maturity", m)}>
                          {m}
                        </SelectTile>
                      ))}
                    </div>
                  </>
                ) : null}

                {step === 6 ? (
                  <>
                    <p className="text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-flux-clay">
                      Step 6 of 7
                    </p>
                    <h2 className="heading-editorial mt-4 text-center text-2xl font-semibold text-flux-editorial sm:text-3xl">
                      What kind of brand are you becoming?
                    </h2>
                    <div className="mt-8 grid gap-3">
                      {VISION_OPTIONS.map((v) => (
                        <SelectTile
                          key={v.id}
                          selected={answers.vision === v.label}
                          onClick={() => setSingle("vision", v.label)}
                          className="py-5"
                        >
                          <span className="block font-semibold text-flux-editorial">{v.label}</span>
                          <span className="mt-1 block text-xs font-normal text-flux-cool-gray">{v.hint}</span>
                        </SelectTile>
                      ))}
                    </div>
                  </>
                ) : null}

                {step === 7 ? (
                  <>
                    <p className="text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-flux-clay">
                      Your snapshot
                    </p>
                    <h2 className="heading-editorial mt-4 text-center text-2xl font-semibold text-flux-editorial sm:text-3xl">
                      FluxFom can help you build a clearer, more scalable brand system.
                    </h2>
                    <div className="mt-8 space-y-5 rounded-xl border border-flux-sand bg-white/62 p-5 text-left text-sm">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-flux-clay">Goals</p>
                        <p className="mt-1 text-flux-editorial">{answers.goals.join(" · ") || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-flux-clay">
                          Opportunity areas
                        </p>
                        <p className="mt-1 text-flux-editorial">{opportunities.join(" · ")}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-flux-clay">
                          Suggested modules
                        </p>
                        <ul className="mt-2 list-inside list-disc text-flux-editorial/78">
                          {modules.map((m) => (
                            <li key={m}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-8 space-y-4">
                      <div>
                        <label htmlFor="elevate-brand" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-flux-clay">
                          Brand or company name
                        </label>
                        <input
                          id="elevate-brand"
                          type="text"
                          autoComplete="organization"
                          value={answers.companyName}
                          onChange={(e) => setSingle("companyName", e.target.value)}
                          placeholder="How we’ll address you"
                          className="w-full rounded-xl border border-flux-sand/90 bg-white/70 px-4 py-3.5 text-sm text-flux-editorial placeholder:text-flux-cool-gray focus:border-flux-green/55 focus:outline-none focus:ring-1 focus:ring-flux-clay/20"
                        />
                      </div>
                      <div>
                        <label htmlFor="elevate-email" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-flux-clay">
                          Work email
                        </label>
                        <input
                          id="elevate-email"
                          type="email"
                          autoComplete="email"
                          value={answers.email}
                          onChange={(e) => setSingle("email", e.target.value)}
                          placeholder="you@company.com"
                          className="w-full rounded-xl border border-flux-sand/90 bg-white/70 px-4 py-3.5 text-sm text-flux-editorial placeholder:text-flux-cool-gray focus:border-flux-green/55 focus:outline-none focus:ring-1 focus:ring-flux-clay/20"
                        />
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!done ? (
        <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-flux-sand bg-flux-ivory/92 px-5 py-4 backdrop-blur-md sm:px-8">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className={cn(
                "min-w-[5rem] text-[11px] font-semibold uppercase tracking-[0.2em] transition",
                step === 0 ? "pointer-events-none text-flux-cool-gray/50" : "text-flux-cool-gray hover:text-flux-editorial",
              )}
            >
              Back
            </button>
            {step < 7 ? (
              <button
                type="button"
                onClick={next}
                disabled={!canContinue()}
                className="inline-flex min-w-[8.5rem] items-center justify-center gap-2 rounded-full bg-flux-green px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_20px_50px_-30px_rgba(43,170,54,0.45)] transition hover:bg-[#24932E] disabled:cursor-not-allowed disabled:opacity-35"
              >
                {step === 0 ? "Start" : "Continue"}
                {step > 0 ? <ArrowRight className="h-3.5 w-3.5" aria-hidden /> : null}
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={!canContinue() || submitting}
                className="inline-flex min-w-[10rem] items-center justify-center gap-2 rounded-full bg-flux-green px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_20px_50px_-30px_rgba(43,170,54,0.45)] transition hover:bg-[#24932E] disabled:cursor-not-allowed disabled:opacity-35"
              >
                {submitting ? "Sending..." : "Submit profile"}
              </button>
            )}
          </div>
        </footer>
      ) : null}
    </div>
  );
}
