import { cn } from "@/lib/utils";

type SectionDividerProps = {
  className?: string;
  variant?: "dark" | "light";
};

export function SectionDivider({ className, variant = "dark" }: SectionDividerProps) {
  const lineColor = variant === "light" ? "bg-flux-void/30" : "bg-white/20";
  const diamondColor = variant === "light" ? "border-flux-void/40 bg-flux-neon" : "border-white/30 bg-flux-neon";

  return (
    <div className={cn("flex items-center gap-0", className)} aria-hidden>
      <span className={cn("h-2 w-2 rotate-45 border", diamondColor)} />
      <span className={cn("h-px flex-1", lineColor)} />
      <span className={cn("h-2 w-2 rotate-45 border", diamondColor)} />
    </div>
  );
}
