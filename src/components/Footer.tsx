import { Link } from "react-router-dom";
import { Facebook, Linkedin, Music2 } from "lucide-react";
import { FluxLogo } from "@/components/marketing/FluxLogo";

const footerLinks = [
  { label: "Terms", to: "/terms" },
  { label: "Privacy", to: "/terms" },
  { label: "Cookies", to: "/terms" },
];

const socialLinks = [
  { label: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { label: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { label: "Music", icon: Music2, href: "https://instagram.com" },
];

const Footer = () => (
  <footer className="border-t border-white/[0.06] bg-flux-void">
    <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-8 px-5 py-10 sm:px-8 md:flex-row lg:px-12">
      <FluxLogo size="sm" />

      <div className="flex flex-wrap items-center justify-center gap-8">
        {footerLinks.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="text-xs font-medium text-white/60 transition-colors hover:text-flux-neon"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-5">
        {socialLinks.map(({ label, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-white/50 transition hover:text-flux-neon"
          >
            <Icon size={16} strokeWidth={1.5} />
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
