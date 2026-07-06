import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  /** Tailwind aspect ratio, e.g. aspect-[4/3] */
  aspectClassName?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Editorial grade for public marketing photography. */
  treatment?: "default" | "cinema" | "editorial" | "portrait";
};

export function MarketingStoryImage({
  src,
  alt,
  aspectClassName = "aspect-[4/3]",
  className,
  imgClassName,
  priority,
  treatment = "default",
}: Props) {
  return (
    <figure
      className={cn(
        "group relative overflow-hidden",
        treatment === "cinema"
          ? "rounded-[clamp(1rem,2vw,1.5rem)] border border-flux-sand bg-flux-sand shadow-[0_28px_90px_-48px_rgba(16,59,27,0.28)]"
          : treatment === "portrait"
            ? "rounded-[2rem] border border-white/60 bg-flux-sand shadow-[0_30px_80px_-48px_rgba(16,59,27,0.24)]"
            : "rounded-[1.5rem] border border-flux-sand bg-flux-sand/60 shadow-[0_22px_70px_-54px_rgba(16,59,27,0.22)]",
        className,
      )}
    >
      {(treatment === "portrait" || treatment === "cinema") && (
        <div
          className="pointer-events-none absolute right-4 top-4 z-10 h-8 w-8 rounded-full border border-flux-gold/35 bg-flux-gold/12 shadow-[0_0_24px_rgba(244,180,0,0.2)]"
          aria-hidden
        />
      )}
      <div className={cn("relative w-full", aspectClassName)}>
        <img
          src={src}
          alt={alt}
          width={1600}
          height={1200}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={cn("absolute inset-0 h-full w-full object-cover saturate-[0.92] contrast-[1.02]", imgClassName)}
        />
        {treatment === "cinema" ? (
          <>
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-flux-forest/45 via-transparent to-flux-ivory/10"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-flux-green/10 via-transparent to-flux-growth/10"
              aria-hidden
            />
            <div className="flux-grain pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay" aria-hidden />
            <div
              className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_rgba(16,59,27,0.18)]"
              aria-hidden
            />
          </>
        ) : treatment === "portrait" ? (
          <>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-flux-forest/28 via-transparent to-transparent" aria-hidden />
            <div className="flux-grain pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay" aria-hidden />
          </>
        ) : null}
      </div>
    </figure>
  );
}
