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
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-flux-neon">COMING SOON</p>
        <h1 className="heading-editorial mt-4 text-3xl font-semibold text-white sm:text-4xl">
          Something new is taking shape.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/70">
          This FluxFom experience is not available yet. We are preparing the next part of the journey.
        </p>
        <p className="mt-4 truncate text-xs text-white/40" title={location.pathname}>
          {location.pathname}
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-flux-neon px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-flux-void transition hover:bg-[#b8ff33]"
        >
          Explore FluxFom
        </Link>
      </div>
    </div>
  );
};
