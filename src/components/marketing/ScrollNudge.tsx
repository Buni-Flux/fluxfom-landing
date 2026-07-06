import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** Element id to scroll into view (without #) */
  targetId: string;
  /** `hero` = overlay at bottom of a full-bleed hero (parent must be `relative`). `section` = in-flow between sections. */
  variant?: "hero" | "section";
  tone?: "dark" | "warm";
  className?: string;
};

const scrollToTarget = (targetId: string) => {
  document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export function ScrollNudge({ targetId, variant = "section", tone = "warm", className }: Props) {
  const inner = (
    <>
      <button
        type="button"
        onClick={() => scrollToTarget(targetId)}
        className={cn(
          "group flex flex-col items-center gap-1.5 rounded-full px-3 py-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          tone === "warm"
            ? "text-flux-cool-gray hover:text-flux-forest focus-visible:ring-flux-green/45 focus-visible:ring-offset-flux-ivory"
            : "text-flux-ivory/80 hover:text-flux-ivory focus-visible:ring-flux-growth/45 focus-visible:ring-offset-flux-forest",
        )}
        aria-label="Scroll to the next section"
      >
        <span
          className={cn(
            "font-semibold uppercase tracking-[0.26em] transition",
            variant === "hero" ? "text-[10px]" : "text-[9px] sm:text-[10px]",
            tone === "warm" ? "text-flux-cool-gray group-hover:text-flux-forest" : "text-flux-ivory/80 group-hover:text-flux-ivory",
          )}
        >
          Scroll
        </span>
        <motion.span
          aria-hidden
          className="flex flex-col items-center"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <ChevronDown
            className={cn("opacity-70", variant === "hero" ? "h-5 w-5" : "h-4 w-4 sm:h-5 sm:w-5")}
            strokeWidth={1.75}
          />
        </motion.span>
      </button>
      <div
        className={cn(
          "w-px bg-gradient-to-b to-transparent",
          variant === "hero" ? "mt-0.5 h-10" : "mt-0.5 h-8 sm:h-10",
          tone === "warm"
            ? "from-flux-gold/70 via-flux-amber/35 to-transparent"
            : "from-flux-gold/80 via-flux-growth/35 to-transparent",
        )}
        aria-hidden
      />
    </>
  );

  if (variant === "hero") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "pointer-events-none absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center sm:bottom-8",
          className,
        )}
      >
        <div className="pointer-events-auto flex flex-col items-center">{inner}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className={cn("flex justify-center pt-6 pb-2 sm:pt-8", className)}
    >
      <div className="flex flex-col items-center">{inner}</div>
    </motion.div>
  );
}
