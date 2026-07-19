import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type NeonPlayFrameProps = {
  visible?: boolean;
  className?: string;
  size?: "sm" | "lg";
  label?: string;
  onClick?: () => void;
};

export function NeonPlayFrame({ visible, className, size = "lg", label, onClick }: NeonPlayFrameProps) {
  const isLarge = size === "lg";
  const isVisible = visible ?? true;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label ?? "Play video"}
      className={cn(
        `group [display-${isVisible ? "flex" : "none"}] relative overflow-hidden rounded-2xl border-[5px] border-flux-neon neon-glow transition-transform hover:scale-[1.01]`,
        isLarge ? "aspect-[16/9] w-full" : "aspect-[4/3] w-full max-w-[140px]",
        className,
      )}
    >
      <div className="liquid-green absolute inset-0" aria-hidden />
      <div className="flux-grain absolute inset-0 opacity-40 mix-blend-overlay" aria-hidden />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={cn(
            "flex items-center justify-center rounded-full bg-black/25 backdrop-blur-sm transition group-hover:scale-110",
            isLarge ? "h-16 w-16 md:h-20 md:w-20" : "h-10 w-10",
          )}
        >
          <Play
            className={cn("fill-white text-white", isLarge ? "ml-1 h-7 w-7 md:h-9 md:w-9" : "ml-0.5 h-4 w-4")}
            strokeWidth={0}
            aria-hidden
          />
        </span>
      </div>
    </button>
  );
}
