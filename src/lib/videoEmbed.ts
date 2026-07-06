/**
 * Normalize common video URLs to a host we can safely embed in an iframe.
 * Returns null when the URL should be treated as a direct file or opened externally.
 */
export function videoUrlToIframeSrc(raw: string | null | undefined): string | null {
  const url = raw?.trim();
  if (!url) return null;

  if (url.includes("youtube-nocookie.com/embed/")) {
    return url;
  }

  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  try {
    const absolute = url.startsWith("http") ? url : `https://${url}`;
    const u = new URL(absolute);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (u.pathname.startsWith("/embed/")) return absolute;
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/").filter(Boolean)[1];
        if (id) return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
      }
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${encodeURIComponent(v)}`;
    }

    if (host === "player.vimeo.com") return absolute;

    if (host === "vimeo.com") {
      const seg = u.pathname.split("/").filter(Boolean).pop();
      if (seg && /^\d+$/.test(seg)) {
        return `https://player.vimeo.com/video/${encodeURIComponent(seg)}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function isLikelyDirectVideoUrl(raw: string | null | undefined): boolean {
  const url = raw?.trim();
  if (!url) return false;
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url) || url.includes("/storage/v1/object/public/");
}
