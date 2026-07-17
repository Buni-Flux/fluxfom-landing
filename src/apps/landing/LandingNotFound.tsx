import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export const LandingNotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent landing route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center bg-flux-void px-6">
      <div className="max-w-md rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_24px_90px_-48px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-flux-neon">404</p>
        <h1 className="heading-editorial mt-4 text-3xl font-semibold text-white sm:text-4xl">
          This page does not exist
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/70">
          The URL may have changed, or the link may be incomplete. Return to the studio home to continue.
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-flux-neon px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-flux-void transition hover:bg-[#b8ff33]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
};
