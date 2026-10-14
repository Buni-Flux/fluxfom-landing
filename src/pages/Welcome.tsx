import { useEffect, useLayoutEffect } from "react";
import { ArrowRight, ArrowUpRight, Check, CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { updateSeoMeta } from "@/lib/seo";

type WelcomeLocationState = {
  projectId?: string;
  projectToken?: string | null;
};

const Welcome = () => {
  const location = useLocation();
  const state = location.state as WelcomeLocationState | null;
  const projectId = typeof state?.projectId === "string" ? state.projectId : null;
  const projectToken = typeof state?.projectToken === "string" ? state.projectToken : null;
  const projectPath = projectId
    ? `/projects/${projectId}${projectToken ? `?token=${encodeURIComponent(projectToken)}` : ""}`
    : null;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    updateSeoMeta({
      title: "Thank You | FluxFom",
      description:
        "Thanks for getting started with FluxFom. We’ve received your project brief and will be in touch about the next steps.",
      pathname: "/welcome",
    });
  }, []);

  return (
    <div className="-mt-[72px] min-h-screen bg-[#C9FF6B] pt-[72px] text-[#0B2B12]">
      <div className="fixed inset-x-0 top-0 z-20 border-b border-[#0B2B12]/10 bg-[#C9FF6B]/95 px-4 py-3 backdrop-blur-lg sm:px-6">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0B2B12]/10 bg-white/20 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#0B2B12]">
            <Check className="h-3.5 w-3.5" />
            Project received
          </div>
          <Link to="/" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0B2B12]/70">
            FluxFom
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 pb-12 pt-12 sm:px-6 lg:px-8">
        <div className="border-none bg-transparent py-8 sm:p-8 lg:p-10">
          <div className="mb-10 space-y-4">
            <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0B2B12]/60">
              <span>Request complete</span>
              <span>100%</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-[#0B2B12]/5"
              role="progressbar"
              aria-label="Project request"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={100}
            >
              <div className="h-full w-full rounded-full bg-[#0B2B12]" />
            </div>
          </div>

          <div className="max-w-2xl">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B2B12] text-[#C9FF6B]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-[#0B2B12] sm:text-5xl">
              Your project is in motion.
            </h1>
            <p className="mt-3 text-base leading-relaxed text-[#0B2B12]/70 sm:text-lg">
              Thank you for sharing what you&apos;re working toward. We&apos;ve received your brief and our team will
              review it before getting in touch using your preferred contact method.
            </p>

            <div className="mt-10 border-t border-[#0B2B12]/10 pt-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0B2B12]/60">
                What happens next
              </p>
              <ol className="mt-5 grid gap-5 sm:grid-cols-2">
                <li className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/60 text-xs font-semibold">
                    01
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold">We review your brief</h2>
                    <p className="mt-1 text-sm leading-relaxed text-[#0B2B12]/65">
                      We&apos;ll get familiar with your goals and the support you need.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/60 text-xs font-semibold">
                    02
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold">We reach out</h2>
                    <p className="mt-1 text-sm leading-relaxed text-[#0B2B12]/65">
                      Keep an eye on your inbox or phone for a note from our team.
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {projectPath ? (
                <Link
                  to={projectPath}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B2B12] px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  View your project
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : null}
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0B2B12]/10 bg-white px-6 py-3.5 text-sm font-semibold text-[#0B2B12] transition hover:border-[#0B2B12]/30"
              >
                Back to FluxFom
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
