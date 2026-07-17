import { Link } from "react-router-dom";
import { Globe, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FluxLogo } from "@/components/marketing/FluxLogo";

const navLinks = [
  { label: "What is FluxFom", to: "/about", hash: "#what-is-fluxfom" },
  { label: "What to expect", to: "/how-it-works", hash: "#what-to-expect" },
  { label: "Get in touch", to: "/start", hash: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-flux-void/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <FluxLogo />

        <div className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-[13px] font-medium text-white/80 transition-colors hover:text-flux-neon"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Language"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:border-flux-neon/50 hover:text-flux-neon"
          >
            <Globe size={16} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:border-flux-neon/50 hover:text-flux-neon lg:hidden"
          >
            {open ? <X size={16} strokeWidth={1.5} /> : <Menu size={16} strokeWidth={1.5} />}
          </button>
          <button
            type="button"
            aria-label="Menu"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:border-flux-neon/50 hover:text-flux-neon lg:flex"
          >
            <Menu size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/[0.06] bg-flux-void lg:hidden"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
