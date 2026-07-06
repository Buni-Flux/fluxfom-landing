import { Link } from "react-router-dom";
import logo from "@/assets/fluxfom-logo.png";
import { BrandTagline } from "@/components/marketing/BrandTagline";

const Footer = () => (
  <footer className="relative border-t border-flux-sand bg-flux-ivory text-flux-cool-gray before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-flux-gold/55 before:to-transparent">
    <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-5 py-12 sm:px-6 md:flex-row">
      <div className="flex flex-col items-center gap-2 md:items-start">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-flux-forest">
          <img src={logo} alt="" className="h-6 w-6 rounded-md" width={24} height={24} />
          <span>
            Flux<span className="text-flux-green">Fom</span>
          </span>
        </Link>
        <BrandTagline />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-8">
        {[
          { label: "Work", to: "/projects" },
          { label: "Approach", to: "/how-it-works" },
          { label: "About", to: "/about" },
          { label: "Terms", to: "/terms" },
          { label: "Start profile", to: "/start" },
        ].map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="text-[11px] font-medium uppercase tracking-[0.18em] text-flux-cool-gray transition-colors hover:text-flux-forest"
          >
            {l.label}
          </Link>
        ))}
      </div>
      <p className="text-xs text-flux-cool-gray">© {new Date().getFullYear()} FluxFom · Nairobi</p>
    </div>
  </footer>
);

export default Footer;
