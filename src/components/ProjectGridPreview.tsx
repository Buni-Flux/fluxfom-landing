import { useState } from "react";

type Props = {
  title: string;
  previewImageUrl?: string | null;
  previewGifUrl?: string | null;
  imageUrl?: string | null;
  /** Tailwind height classes etc., e.g. h-72 */
  frameClassName: string;
};

/**
 * Card media for project grids: prefers preview_image_url, then image_url.
 * When preview_gif_url is set with a still source, the GIF loads and plays on hover (no controls).
 */
export function ProjectGridPreview({
  title,
  previewImageUrl,
  previewGifUrl,
  imageUrl,
  frameClassName,
}: Props) {
  const still =
    (previewImageUrl?.trim() || imageUrl?.trim() || "") || null;
  const gif = (previewGifUrl?.trim() || "") || null;
  const [hover, setHover] = useState(false);
  const [gifKey, setGifKey] = useState(0);

  if (!still && !gif) return null;

  const onEnter = () => {
    if (!gif) return;
    setHover(true);
    setGifKey((k) => k + 1);
  };
  const onLeave = () => setHover(false);

  if (gif && still) {
    return (
      <div
        className={`relative w-full overflow-hidden bg-flux-sand transition-transform duration-500 group-hover:scale-105 ${frameClassName}`}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <img
          src={still}
          alt={title}
          className={`absolute inset-0 h-full w-full object-cover saturate-[0.92] transition-opacity duration-300 ease-out ${hover ? "opacity-0" : "opacity-100"}`}
          draggable={false}
        />
        <img
          key={gifKey}
          src={hover ? gif : undefined}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover saturate-[0.92] transition-opacity duration-300 ease-out ${hover ? "opacity-100" : "opacity-0"}`}
          draggable={false}
          aria-hidden
        />
      </div>
    );
  }

  /* GIF without a still: no poster to freeze on; show GIF only while hovered. */
  if (gif && !still) {
    return (
      <div
        className={`relative w-full overflow-hidden bg-flux-sand transition-transform duration-500 group-hover:scale-105 ${frameClassName}`}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {hover ? (
          <img
            key={gifKey}
            src={gif}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        ) : null}
      </div>
    );
  }

  return (
    <img
      src={still!}
      alt={title}
      className={`w-full object-cover saturate-[0.92] transition-transform duration-500 group-hover:scale-105 ${frameClassName}`}
      loading="lazy"
      draggable={false}
    />
  );
}
