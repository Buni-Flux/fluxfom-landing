import { Link } from "react-router-dom";
import { Globe, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FluxLogo } from "@/components/marketing/FluxLogo";

const navLinks = [
  { label: "Services", to: "/services", hash: "#service-offerings" },
  // { label: "About Us", to: "/about", hash: "#what-to-expect" },
  { label: "Portfolio", to: "/projects", hash: "#clients-index" },
  { label: "Get in touch", to: "/start", hash: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1100] border-b border-white/[0.06] bg-flux-void/90 backdrop-blur-xl">
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
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/80 transition hover:border-flux-neon/50 hover:text-flux-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flux-neon focus-visible:ring-offset-2 focus-visible:ring-offset-flux-void lg:hidden"
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
