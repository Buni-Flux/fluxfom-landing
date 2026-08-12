export const SITE_URL =
  (import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined) || "https://fluxfom.com";
const GOOGLE_SITE_VERIFICATION =
  (import.meta.env.VITE_GOOGLE_SITE_VERIFICATION as string | undefined) || "";

const DEFAULT_KEYWORDS = [
  "FluxFom",
  "brand positioning",
  "growth studio",
  "Nairobi marketing agency",
  "African brand strategy",
  "creative growth studio",
  "brand strategy Nairobi",
];

export const updateSeoMeta = ({
  title,
  description,
  pathname = "/",
  image = `${SITE_URL}/favicon.ico`,
  type = "website",
  keywords = DEFAULT_KEYWORDS,
}: {
  title: string;
  description: string;
  pathname?: string;
  image?: string;
  type?: string;
  keywords?: string[];
}) => {
  const fullUrl = `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;

  document.title = title;

  const setMeta = (selector: string, attrs: Record<string, string>) => {
    let element = document.head.querySelector(selector) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement("meta");
      Object.entries(attrs).forEach(([key, value]) => element!.setAttribute(key, value));
      document.head.appendChild(element);
      return;
    }

    Object.entries(attrs).forEach(([key, value]) => element!.setAttribute(key, value));
  };

  const setLink = (selector: string, attrs: Record<string, string>) => {
    let element = document.head.querySelector(selector) as HTMLLinkElement | null;
    if (!element) {
      element = document.createElement("link");
      Object.entries(attrs).forEach(([key, value]) => element!.setAttribute(key, value));
      document.head.appendChild(element);
      return;
    }

    Object.entries(attrs).forEach(([key, value]) => element!.setAttribute(key, value));
  };

  setMeta('meta[name="description"]', { name: "description", content: description });
  setMeta('meta[name="keywords"]', { name: "keywords", content: keywords.join(", ") });
  setMeta('meta[name="robots"]', { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" });
  if (GOOGLE_SITE_VERIFICATION) {
    setMeta('meta[name="google-site-verification"]', {
      name: "google-site-verification",
      content: GOOGLE_SITE_VERIFICATION,
    });
  }
  setMeta('meta[property="og:title"]', { property: "og:title", content: title });
  setMeta('meta[property="og:description"]', { property: "og:description", content: description });
  setMeta('meta[property="og:type"]', { property: "og:type", content: type });
  setMeta('meta[property="og:url"]', { property: "og:url", content: fullUrl });
  setMeta('meta[property="og:image"]', { property: "og:image", content: image });
  setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
  setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
  setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
  setLink('link[rel="canonical"]', { rel: "canonical", href: fullUrl });

  const existingSchema = document.getElementById("fluxfom-organization-schema");
  const schema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "WebSite"],
    name: "FluxFom",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    description,
    areaServed: "Nairobi, Kenya",
    sameAs: ["https://www.linkedin.com", "https://www.instagram.com"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "hello@fluxfom.io",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  if (existingSchema) {
    existingSchema.textContent = JSON.stringify(schema);
    return;
  }

  const script = document.createElement("script");
  script.id = "fluxfom-organization-schema";
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
};
