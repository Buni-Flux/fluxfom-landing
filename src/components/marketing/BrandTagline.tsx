import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** `light` = green on ivory (default). `on-dark` = ivory with gold midpoint. */
  tone?: "light" | "on-dark";
};

/** Official FluxFom tagline from the brand style guide. */
export function BrandTagline({ className, tone = "light" }: Props) {
  return (
    <p
      className={cn(
        "text-[10px] font-bold uppercase tracking-[0.34em]",
        tone === "light" ? "text-flux-green" : "text-flux-ivory/92",
        className,
      )}
    >
      Brand intelligence
      <span className={tone === "light" ? "text-flux-gold" : "text-flux-gold/90"} aria-hidden>
        {" "}
        ·{" "}
      </span>
      Creative growth
    </p>
  );
}
