import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type FluxLogoProps = {
  className?: string;
  size?: "sm" | "md";
};

export function FluxLogo({ className, size = "md" }: FluxLogoProps) {
  const isSmall = size === "sm";

  return (
    <Link to="/" className={cn("inline-flex flex-col leading-none", className)}>
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
    </Link>
  );
}
