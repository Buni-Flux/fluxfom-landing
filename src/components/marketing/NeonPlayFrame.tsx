import { Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { isLikelyDirectVideoUrl, videoUrlToIframeSrc } from "@/lib/videoEmbed";

type NeonPlayFrameProps = {
  visible?: boolean;
  className?: string;
  size?: "sm" | "lg";
  label?: string;
  onClick?: () => void;
  onClose?: () => void;
  projectUrl?: string;
};

type CmsProjectRecord = {
  id?: string;
  title?: string | null;
  video_url?: string | null;
};

const DEFAULT_PROJECT_URL = "https://aeiwxzdygbrvmfeurref.supabase.co/rest/v1/cms_projects?select=*&id=eq.b93d4d88-4e5c-4995-a8f2-8b555780c84f&published=eq.true";

export function NeonPlayFrame({ visible, className, size = "lg", label, onClick, onClose, projectUrl }: NeonPlayFrameProps) {
  const isLarge = size === "lg";
  const isVisible = visible ?? true;
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string>("Featured project video");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    setVideoUrl(null);
    setVideoTitle("Featured project video");
    setIsLoading(true);

    let isActive = true;
    const controller = new AbortController();

    const loadVideo = async () => {
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      if (!supabaseKey) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(projectUrl ?? DEFAULT_PROJECT_URL, {
          method: "GET",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to load hero video (${response.status})`);
        }

        const data = (await response.json()) as CmsProjectRecord[];
        const project = data?.[0];

        if (!isActive) {
          return;
        }

        setVideoUrl(project?.video_url?.trim() ?? null);
        setVideoTitle(project?.title?.trim() || "Featured project video");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Failed to load hero video", error);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadVideo();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [isVisible, projectUrl]);

  const iframeSrc = videoUrlToIframeSrc(videoUrl);
  const isDirectVideo = !!videoUrl && isLikelyDirectVideoUrl(videoUrl);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="group"
      aria-label={label ?? "Play video"}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl border-[5px] border-flux-neon neon-glow transition-transform hover:scale-[1.01]",
        isLarge ? "aspect-[16/9] w-full" : "aspect-[4/3] w-full max-w-[140px]",
        className,
      )}
    >
      <div className="liquid-green absolute inset-0" aria-hidden />
      <div className="flux-grain absolute inset-0 opacity-40 mix-blend-overlay" aria-hidden />
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClose?.();
        }}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/70"
        aria-label="Close video"
      >
        <X className="h-4 w-4" strokeWidth={2} aria-hidden />
      </button>

      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-flux-ivory/90">
          Loading video…
        </div>
      ) : iframeSrc ? (
        <iframe
          title={videoTitle}
          src={iframeSrc}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : isDirectVideo ? (
        <video
          title={videoTitle}
          src={videoUrl ?? undefined}
          className="absolute inset-0 h-full w-full object-cover"
          controls
          autoPlay
          playsInline
          muted
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-flux-ivory/90">
          <Play className="h-4 w-4" strokeWidth={2} aria-hidden />
          <span>Coming Soon</span>
        </div>
      )}
    </div>
  );
}
