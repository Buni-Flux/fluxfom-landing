import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import logo from "@/assets/fluxfom-logo.png";

const navLinks = [
  { label: "Work", to: "/projects" },
  { label: "Approach", to: "/how-it-works" },
  { label: "About", to: "/about" },
];

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = (to: string) =>
    cn(
      "relative pb-1 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors",
      location.pathname === to
        ? "text-flux-forest after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-gradient-to-r after:from-flux-gold after:to-flux-amber"
        : "text-flux-cool-gray hover:text-flux-forest",
    );

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-flux-sand bg-flux-ivory/92 text-flux-editorial backdrop-blur-xl"
          : "border-b border-transparent bg-flux-ivory/80 text-flux-editorial backdrop-blur-md",
      )}
    >
      <div className="container mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-flux-forest">
          <img src={logo} alt="FluxFom" className="h-8 w-8 rounded-lg" width={32} height={32} />
          <span>
            Flux<span className="text-flux-green">Fom</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex md:gap-10">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className={linkClass(link.to)}>
              {link.label}
            </Link>
          ))}
          <Link
            to="/start"
            className="rounded-full bg-flux-green px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#24932E]"
          >
            Start Profile
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="rounded-full p-2 text-flux-cool-gray transition-colors hover:text-flux-forest"
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <span className="hidden w-8 md:block" aria-hidden />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-flux-sand bg-flux-ivory md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4 sm:px-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={cn("px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em]", linkClass(link.to))}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/start"
                onClick={() => setOpen(false)}
                className="mx-4 mt-2 rounded-full bg-flux-green py-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
              >
                Start Profile
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
