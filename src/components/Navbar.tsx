import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FluxLogo } from "@/components/marketing/FluxLogo";

const navLinks = [
  { label: "SERVICES", to: "/services", hash: "#service-offerings" },
  // { label: "About Us", to: "/about", hash: "#what-to-expect" },
  { label: "PORTFOLIO", to: "/projects", hash: "#clients-index" },
  { label: "TALK TO US", to: "/contact", hash: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const animationFrameRef = useRef<number | null>(null);
  const completionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setProgress(18);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
    }

    let nextProgress = 18;

    const step = () => {
      nextProgress = Math.min(nextProgress + Math.random() * 16 + 10, 92);
      setProgress(nextProgress);

      if (nextProgress < 92) {
        animationFrameRef.current = requestAnimationFrame(step);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);

    completionTimeoutRef.current = window.setTimeout(() => {
      setProgress(100);
      window.setTimeout(() => {
        setProgress(0);
        setIsLoading(false);
      }, 220);
    }, 420);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
    };
  }, [location.pathname]);

  return (
    <nav className="fixed left-4 right-4 top-3 z-[1100] md:left-14 md:right-14">
      <div className="mx-auto flex h-12 max-w-[1400px] items-center justify-between rounded-full border border-white/[0.13] bg-[#071321]/90 px-3 shadow-[0_8px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:px-5 lg:px-6">
        <FluxLogo size="sm" />

        <div className="hidden flex-1 items-center justify-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-[11px] font-medium tracking-[0.04em] text-white/75 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/start"
            className="hidden items-center gap-3 rounded-full bg-flux-neon py-1.5 pl-4 pr-1.5 text-[11px] font-semibold tracking-[0.04em] text-[#10170a] transition-colors hover:bg-[#d5ff35] lg:flex"
          >
            START HERE
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#10170a] text-white">
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-flux-neon/50 hover:text-flux-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flux-neon focus-visible:ring-offset-2 focus-visible:ring-offset-flux-void lg:hidden"
          >
            {open ? <X size={16} strokeWidth={1.5} /> : <Menu size={16} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-2 mt-2 overflow-hidden rounded-2xl border border-white/[0.13] bg-[#071321]/95 shadow-xl backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4 sm:px-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="px-2 py-3 text-sm font-medium text-white/80 transition hover:text-flux-neon"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/start"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-between rounded-full bg-flux-neon py-2 pl-4 pr-2 text-sm font-semibold text-[#10170a] transition-colors hover:bg-[#d5ff35]"
              >
                START HERE
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10170a] text-white">
                  <ArrowUpRight size={15} strokeWidth={2.5} />
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-0 left-6 right-6 h-px overflow-hidden bg-white/10">
        <div
          className={`h-full bg-gradient-to-r from-flux-neon via-white to-flux-neon transition-[width] duration-200 ease-out ${isLoading ? "opacity-100" : "opacity-0"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
