import type { ClientProfileData, ClientWorkRow, ResolvedClientProfile } from "@/types/clientProfile";

const stripHtml = (value: string | null) =>
  (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const defaultStrategy = (name: string, tagline: string) => ({
  left: ["Purpose", "Mission", "Vision", "Visual competitor analysis", "Target audience"],
  right: ["Personality", "Brand values", "Tone of voice", "Key USP"],
  header: { client: name, subtitle: tagline },
});

const defaultCreativeNotes = (tagline: string) => [
  { title: "Palette", body: "Warm earth tones with sage and olive accents for calm authority." },
  { title: "Visual tone", body: "Minimal interiors, natural textures, and soft architectural light." },
  { title: "Vibe & feel", body: "Grounded, welcoming, and premium without feeling distant." },
  { title: "Target audience", body: tagline || "Urban professionals seeking clarity, balance, and craft." },
  { title: "Welcoming", body: "Every touchpoint should feel approachable from first glance to repeat visit." },
  { title: "Uniqueness", body: "A distinct voice in a crowded category through restraint and rhythm." },
];

const defaultColors = () => [
  { name: "Gentle sunrise", hex: "#F3E9D2" },
  { name: "Soft glow", hex: "#FAF7F2" },
  { name: "Grounded earth", hex: "#6F5137" },
  { name: "Golden amber", hex: "#C4A574" },
  { name: "Olive lands", hex: "#3D4A32" },
  { name: "Zen moss", hex: "#B8C4A8" },
  { name: "Mother earth", hex: "#3A2A1F" },
];

const defaultFonts = () => [
  { role: "subtitle", label: "Subtitle", sample: "Subtitle goes here" },
  { role: "heading", label: "Heading", sample: "Heading goes here" },
  { role: "body", label: "Body", sample: "Clean sans-serif for legible long-form brand storytelling." },
];

const defaultLogoRows = (name: string) => [
  { label: "Primary logo / wordmark", text: name.toLowerCase() },
  { label: "Primary logo with slogan", text: `${name.toLowerCase()} studio` },
  { label: "Icon + wordmark", text: name.charAt(0).toUpperCase() },
  { label: "Icon", text: "Standalone mark variations" },
  { label: "Social icons", text: "Circular avatars across brand palette" },
];

export function buildClientProfile(row: ClientWorkRow): ResolvedClientProfile {
  const name = row.title.trim();
  const tagline = row.client_tagline?.trim() || row.category || "Brand identity";
  const location = row.client_location?.trim() || "East Africa";
  const timeline = row.timeline?.trim() || "4 weeks";
  const coverImage = row.preview_image_url?.trim() || row.image_url?.trim() || null;
  const summary = stripHtml(row.description);

  const base: ClientProfileData = {
    brandBrief: {
      summary:
        summary ||
        `${name} needed a cohesive identity system that could carry from first impression through launch campaigns.`,
      html: row.description ?? undefined,
    },
    brandStrategy: defaultStrategy(name, tagline),
    creativeDirection: {
      palette: defaultColors().slice(0, 5),
      moodImages: coverImage ? [coverImage] : [],
      notes: defaultCreativeNotes(tagline),
    },
    logoSuite: { rows: defaultLogoRows(name) },
    colorsAndFonts: {
      colors: defaultColors(),
      fonts: defaultFonts(),
    },
    applications: {
      images: coverImage ? Array.from({ length: 9 }, () => coverImage) : [],
    },
    launchTemplates: {
      images: coverImage ? Array.from({ length: 9 }, () => coverImage) : [],
    },
  };

  const stored = (row.profile_data ?? {}) as ClientProfileData;

  return {
    id: row.id,
    name,
    tagline,
    location,
    timeline,
    coverImage,
    data: {
      ...base,
      ...stored,
      brandBrief: { ...base.brandBrief, ...stored.brandBrief },
      brandStrategy: { ...base.brandStrategy, ...stored.brandStrategy },
      creativeDirection: { ...base.creativeDirection, ...stored.creativeDirection },
      logoSuite: { ...base.logoSuite, ...stored.logoSuite },
      colorsAndFonts: { ...base.colorsAndFonts, ...stored.colorsAndFonts },
      applications: { ...base.applications, ...stored.applications },
      launchTemplates: { ...base.launchTemplates, ...stored.launchTemplates },
    },
  };
}

export const clientCardSubtitle = (row: ClientWorkRow) =>
  row.client_tagline?.trim() || row.category || "Brand identity";
