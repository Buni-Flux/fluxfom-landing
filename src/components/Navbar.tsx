import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FluxLogoOnDark, FluxLogoOnLight } from "@/components/marketing/FluxLogoVariants";

const navLinks = [
  { label: "BRAND POSITIONING", to: "/brand-positioning" },
  { label: "SERVICES", to: "/services", hash: "#service-offerings" },
  { label: "PORTFOLIO", to: "/projects", hash: "#clients-index" },
  { label: "BLOG", to: "/blog" },
  { label: "TALK TO US", to: "/contact", hash: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isBrightBackground, setIsBrightBackground] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const completionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let frameId: number | null = null;

    const detectBackground = () => {
      frameId = null;
      const nav = navRef.current;
      if (!nav) return;

      const previousVisibility = nav.style.visibility;
      nav.style.visibility = "hidden";
      let element = document.elementFromPoint(window.innerWidth / 2, 36);
      nav.style.visibility = previousVisibility;

      let bright = false;
      if (!element?.closest("#hero")) {
        while (element) {
          const color = window.getComputedStyle(element).backgroundColor;
          const channels = color.match(/[\d.]+/g)?.map(Number);

          if (channels && channels.length >= 3 && (channels[3] ?? 1) > 0.85) {
            const luminance = (0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]) / 255;
            bright = luminance > 0.62;
            break;
          }

          element = element.parentElement;
        }
      }

      setIsBrightBackground(bright);
    };

    const scheduleDetection = () => {
      if (frameId === null) frameId = requestAnimationFrame(detectBackground);
    };

    scheduleDetection();
    window.addEventListener("scroll", scheduleDetection, { passive: true });
    window.addEventListener("resize", scheduleDetection);

    return () => {
      window.removeEventListener("scroll", scheduleDetection);
      window.removeEventListener("resize", scheduleDetection);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

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
    <nav ref={navRef} className="fixed left-4 right-4 top-3 z-[1100] md:left-14 md:right-14">
      <div className="mx-auto flex h-12 max-w-[1400px] items-center justify-between rounded-full border border-white/20 bg-transparent px-3 backdrop-blur-xl sm:px-5 lg:px-6">
        {isBrightBackground ? <FluxLogoOnLight /> : <FluxLogoOnDark />}

        <div className="hidden flex-1 items-center justify-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to || location.pathname.startsWith(`${link.to}/`);

            return (
              <Link
                key={link.label}
                to={link.to}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex h-12 items-center text-[11px] font-medium tracking-[0.04em] transition-colors ${isBrightBackground ? "text-[#051005] hover:text-black" : "text-white/75 hover:text-white"}`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="active-nav-dot"
                    className={`absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${isBrightBackground ? "bg-[#219C2B]" : "bg-flux-neon"}`}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
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
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flux-neon focus-visible:ring-offset-2 focus-visible:ring-offset-flux-void lg:hidden ${isBrightBackground ? "border-[#051005]/20 text-[#051005] hover:border-[#051005]/50 hover:text-black" : "border-white/20 text-white/80 hover:border-flux-neon/50 hover:text-flux-neon"}`}
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
            className="mx-2 mt-2 overflow-hidden rounded-2xl border border-white/20 bg-transparent backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4 sm:px-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to || location.pathname.startsWith(`${link.to}/`);

                return (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-2 px-2 py-3 text-sm font-medium transition ${isBrightBackground ? "text-[#051005]/80 hover:text-black" : "text-white/80 hover:text-flux-neon"}`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="active-mobile-nav-dot"
                        className={`h-1.5 w-1.5 rounded-full ${isBrightBackground ? "bg-[#219C2B]" : "bg-flux-neon"}`}
                      />
                    )}
                  </Link>
                );
              })}
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
