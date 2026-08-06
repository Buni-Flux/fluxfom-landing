import { Play, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type NeonPlayFrameStaticProps = {
  visible?: boolean;
  className?: string;
  size?: "sm" | "lg";
  label?: string;
  onClick?: () => void;
  videoUrls?: string[];
};

export function NeonPlayFrameStatic({
  visible,
  className,
  size = "lg",
  label,
  onClick,
  videoUrls = [],
}: NeonPlayFrameStaticProps) {
  const isLarge = size === "lg";
  const isVisible = visible ?? true;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    if (isPlaying) {
      void videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, currentIndex]);

  const handleTogglePlay = () => {
    if (videoUrls.length === 0) {
      return;
    }

    if (currentIndex >= videoUrls.length) {
      setCurrentIndex(0);
    }

    setIsPlaying((current) => !current);
    onClick?.();
  };

  const handleVideoEnd = () => {
    if (currentIndex < videoUrls.length - 1) {
      setCurrentIndex((index) => index + 1);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  const hasPlaylist = videoUrls.length > 0;
  const currentVideoLabel = hasPlaylist ? `Video ${currentIndex + 1} of ${videoUrls.length}` : "Video coming soon";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border-[5px] border-flux-neon neon-glow transition-transform hover:scale-[1.01]",
        isLarge ? "aspect-[16/9] w-full" : "aspect-[4/3] w-full max-w-[140px]",
        className,
      )}
    >
      <div className="liquid-green absolute inset-0" aria-hidden />
      <div className="flux-grain absolute inset-0 opacity-40 mix-blend-overlay" aria-hidden />

      {hasPlaylist ? (
        <video
          ref={videoRef}
          src={videoUrls[currentIndex]}
          className="absolute inset-0 h-full w-full object-cover"
          controls
          onEnded={handleVideoEnd}
          muted
        />
      ) : (
        <button
          type="button"
          onClick={handleTogglePlay}
          aria-label={label ?? "Video coming soon"}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-flux-ivory/90">
            <Play className="h-5 w-5" strokeWidth={2} aria-hidden />
            <span>Video coming soon</span>
          </div>
        </button>
      )}

      {hasPlaylist && (
        <button
          type="button"
          onClick={handleTogglePlay}
          aria-label={label ?? (isPlaying ? "Pause playlist" : "Play playlist")}
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/70"
        >
          {isPlaying ? <Pause className="h-4 w-4" strokeWidth={2} aria-hidden /> : <Play className="h-4 w-4" strokeWidth={2} aria-hidden />}
        </button>
      )}

      {hasPlaylist && (
        <div className="absolute left-2 top-2 z-10 rounded-full bg-black/50 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-flux-ivory/90">
          {currentVideoLabel}
        </div>
      )}
    </div>
  );
}
