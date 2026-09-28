import { Link } from "react-router-dom";
import logoOnDark from "@/assets/fluxfom-logo-on-dark.svg";
import logoOnLight from "@/assets/fluxfom-logo-on-light.svg";

type FluxLogoVariantProps = {
  className?: string;
};

export function FluxLogoOnLight({ className = "" }: FluxLogoVariantProps) {
  return (
    <Link to="/" className={`inline-flex shrink-0 items-center ${className}`}>
      <img src={logoOnLight} alt="FluxFom" className="h-6 w-auto" />
    </Link>
  );
}

export function FluxLogoOnDark({ className = "" }: FluxLogoVariantProps) {
  return (
    <Link to="/" className={`inline-flex shrink-0 items-center ${className}`}>
      <img src={logoOnDark} alt="FluxFom" className="h-6 w-auto" />
    </Link>
  );
}