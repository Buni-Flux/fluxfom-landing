import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logoPng from "@/assets/fluxfom-logo-full.png";
import logoSvg from "@/assets/fluxfom-logo.svg";

type FluxLogoProps = {
  className?: string;
  size?: "sm" | "md";
};

export function FluxLogo({ className, size = "md" }: FluxLogoProps) {
  const isSmall = size === "sm";
  return (
    <Link to="/" className={cn("inline-flex items-center gap-3 leading-none", className)}>
      {/*/replaced SVG for PNG*/}
      <img src={logoPng} alt="FluxFom" className={isSmall ? "h-6 w-auto" : "h-8 w-auto"} />
      {/* {logoSvg ? (
        <img src={logoSvg} alt="FluxFom" className={isSmall ? "h-6 w-auto" : "h-8 w-auto"} />
      ) : logoPng ? (
      ) : (
        <span className="inline-flex flex-col">
          <span
            className={cn(
              "font-monument font-normal tracking-tight text-flux-neon",
              isSmall ? "text-sm" : "text-base md:text-lg",
            )}
          >
            Flux
          </span>
          <span
            className={cn(
              "font-monument font-black tracking-tight text-white",
              isSmall ? "text-base" : "text-xl md:text-2xl",
            )}
          >
            Fom
          </span>
        </span>
      )} */}
    </Link>
  );
}
