/**
 * FluxFom marketing imagery — one narrative “world” (Nairobi-rooted creative operations).
 *
 * Interim sources: editorial Unsplash selections with aligned warm / documentary tone.
 * For true single-character continuity across every frame, replace `src` values with
 * commissioned stills (see `generationPrompt` on each slot) under `/public/marketing/`.
 */
const q = "ixlib=rb-4.0.3&auto=format&fit=crop&q=82";

const img = (id: string, w: number, h: number) => `https://images.unsplash.com/${id}?${q}&w=${w}&h=${h}`;

/** Shared for briefs / Midjourney / SD — paste into your generation tool. */
export const MARKETING_VISUAL_BASE_TAGS =
  "cinematic Nairobi creative agency, Afro-futurist editorial photography, Kenyan startup operators, premium documentary-style lighting, creative technologists in Africa, realistic urban African workspace, high-end magazine photography, subtle cyberpunk Nairobi atmosphere, shallow depth of field, tungsten practicals, deep blacks, muted neutrals, emerald accent rim light, subtle 35mm grain";

export const MARKETING_VISUAL_NEGATIVE_PROMPT =
  "floating holograms, fake neon overload, exaggerated sci-fi UI, generic SaaS illustration, western-only corporate stock, uncanny AI faces, stock-photo smiles, plastic skin, low-detail environments, meaningless abstract graphics, deformed hands, watermark";

export type MarketingImageSlot = {
  id: string;
  /** Narrative chapter this frame belongs to (scroll journey). */
  chapter:
    | "signal"
    | "fragmentation"
    | "systems"
    | "collaboration"
    | "clarity"
    | "scale"
    | "horizon";
  src: string;
  alt: string;
  generationPrompt: string;
};

const slots = {
  /** Hero — dominant; duo at laptop (introduces operator + collaborator energy). */
  heroReveal: {
    id: "hero-reveal",
    chapter: "signal",
    src: img("photo-1641759191629-cc107016e78a", 2400, 1600),
    alt: "Two Black creative professionals reviewing work together on a laptop in a modern workspace.",
    generationPrompt: `${MARKETING_VISUAL_BASE_TAGS}. Two Kenyan creative operators at a laptop, natural candid moment, warm side light, editorial crop.`,
  },
  /** Recurring operator portrait — same face used across inner pages & hero collage. */
  operatorPortrait: {
    id: "operator-portrait",
    chapter: "signal",
    src: img("photo-1636144896336-b056be4a8dfe", 1400, 1750),
    alt: "Black creative director in a tailored black suit, calm confident expression, editorial portrait.",
    generationPrompt: `${MARKETING_VISUAL_BASE_TAGS}. Single recurring Afro-human creative director character, modern African fashion, natural unposed portrait, Nairobi studio background softly blurred.`,
  },
  /** Approach page hero — partnership in motion (same frame as home hero; distinct from “Inside the work” workspace shot). */
  approachWorkspace: {
    id: "approach-workspace",
    chapter: "signal",
    src: img("photo-1641759191629-cc107016e78a", 1400, 1750),
    alt: "Two Black colleagues collaborating over a laptop in a bright workspace—partnership, strategy, and shared focus.",
    generationPrompt: `${MARKETING_VISUAL_BASE_TAGS}. Two Kenyan creative operators leaning in over one laptop, natural candid moment, warm daylight, documentary feel—visual for “how we partner,” not a solo stock portrait.`,
  },
  /** Trust band — many voices / market gravity. */
  collectiveSignal: {
    id: "collective-signal",
    chapter: "collaboration",
    src: img("photo-1739298061740-5ed03045b280", 2400, 1200),
    alt: "Diverse team seated around a conference table in discussion, documentary overhead angle.",
    generationPrompt: `${MARKETING_VISUAL_BASE_TAGS}. Founders and operators in a rooftop meeting in Nairobi, candid dialogue, warm tungsten, not posed for camera.`,
  },
  /** Fragmented workflows / noise (transformation “before”). */
  creativeFriction: {
    id: "creative-friction",
    chapter: "fragmentation",
    src: img("photo-1739302750695-31a8c978c770", 1800, 1200),
    alt: "Creative team gathered around a table with laptops and notes, energetic working session.",
    generationPrompt: `${MARKETING_VISUAL_BASE_TAGS}. Creative chaos: sticky notes, laptops, overlapping conversations, documentary handheld feel, slight motion.`,
  },
  /** Systems / solo deep work — operator at machine. */
  operatorSystems: {
    id: "operator-systems",
    chapter: "clarity",
    src: img("photo-1612299273045-362a39972259", 1800, 1200),
    alt: "Black creative technologist focused on a laptop in a minimal studio environment.",
    generationPrompt: `${MARKETING_VISUAL_BASE_TAGS}. Same recurring operator reviewing dashboards and timelines, emerald monitor glow on face, night session, intelligent concentration.`,
  },
  /** Craft desk — collaboration, editorial documentary. */
  craftSurface: {
    id: "craft-surface",
    chapter: "systems",
    src: img("photo-1641759261047-de431b849bd5", 1800, 1200),
    alt: "Two Black colleagues side by side at a laptop, focused collaborative moment in a bright workspace.",
    generationPrompt: `${MARKETING_VISUAL_BASE_TAGS}. Kenyan creative operators co-editing at one screen, natural posture, warm daylight, magazine crop.`,
  },
  /** Launch / live energy — concert haze (verified Unsplash asset). */
  livePresence: {
    id: "live-presence",
    chapter: "scale",
    src: img("photo-1514525253161-7a46d19cd819", 1800, 1200),
    alt: "Crowd and stage lights at a live music performance, warm haze and cinematic atmosphere.",
    generationPrompt: `${MARKETING_VISUAL_BASE_TAGS}. Afro-human performer or DJ mid-set, volumetric haze, single spotlight, A24-style contrast, no crowd CGI.`,
  },
  /** City horizon — future-facing ecosystem. */
  cityHorizon: {
    id: "city-horizon",
    chapter: "horizon",
    src: img("photo-1605885074285-0e73895391db", 2400, 1600),
    alt: "Urban skyline at dusk with warm amber light along the horizon.",
    generationPrompt: `${MARKETING_VISUAL_BASE_TAGS}. Nairobi skyline at blue hour, warm window tungsten mixed with cool sky, subtle grain, cinematic letterbox mood.`,
  },
  /** Wide editorial strip — night urban grid (distinct from sunset skyline slot). */
  editorialWide: {
    id: "editorial-wide",
    chapter: "horizon",
    src: img("photo-1449824913935-59a10b8d2000", 2400, 900),
    alt: "Wide aerial view of a city at night with street lights and deep blue atmosphere.",
    generationPrompt: `${MARKETING_VISUAL_BASE_TAGS}. Ultra-wide Nairobi horizon, slow shutter light trails optional, magazine double-page spread composition.`,
  },
  /** Intelligence / editorial sidebar — distinct from recurring operator portrait. */
  insightsEdge: {
    id: "insights-edge",
    chapter: "clarity",
    src: img("photo-1573497019940-1c28c88b4f3e", 1400, 1750),
    alt: "Black professional woman at a laptop in a bright office, focused editorial portrait.",
    generationPrompt: `${MARKETING_VISUAL_BASE_TAGS}. Creative operator reviewing strategy docs on laptop, daylight, Kinfolk editorial calm, not stock-smile.`,
  },
} as const satisfies Record<string, MarketingImageSlot>;

export const MARKETING_NARRATIVE_SLOTS = slots;

/** Ordered chapters for scroll-story tooling / CMS hints. */
export const MARKETING_NARRATIVE_ORDER = [
  "signal",
  "fragmentation",
  "systems",
  "clarity",
  "collaboration",
  "scale",
  "horizon",
] as const;

// ——— Legacy & page-level exports (stable names for imports site-wide) ———

export const HOME_HERO_IMAGE = slots.heroReveal.src;
export const HOME_HERO_IMAGE_ALT = slots.heroReveal.alt;
export const HOME_HERO_GENERATION_PROMPT = slots.heroReveal.generationPrompt;

export const HOME_HERO_OPERATOR_CARD_SRC = slots.operatorPortrait.src;
export const HOME_HERO_OPERATOR_CARD_ALT = slots.operatorPortrait.alt;

export const HOME_TRUST_IMAGE = slots.collectiveSignal.src;
export const HOME_TRUST_IMAGE_ALT = slots.collectiveSignal.alt;

export const HOME_TRANSFORMATION_BEFORE_IMAGE = slots.creativeFriction.src;
export const HOME_TRANSFORMATION_BEFORE_ALT = slots.creativeFriction.alt;
export const HOME_TRANSFORMATION_AFTER_IMAGE = slots.operatorSystems.src;
export const HOME_TRANSFORMATION_AFTER_ALT = slots.operatorSystems.alt;

export const HOME_PROCESS_MID_IMAGE = slots.craftSurface.src;
export const HOME_PROCESS_MID_ALT = slots.craftSurface.alt;

export const HOME_INSIGHTS_EDGE_IMAGE = slots.insightsEdge.src;
export const HOME_INSIGHTS_EDGE_ALT = slots.insightsEdge.alt;

export const HOME_FINAL_CTA_IMAGE = slots.cityHorizon.src;
export const HOME_FINAL_CTA_IMAGE_ALT = slots.cityHorizon.alt;

export const PAGE_STRATEGY_PORTRAIT = slots.operatorPortrait.src;
export const PAGE_STRATEGY_PORTRAIT_ALT = slots.operatorPortrait.alt;

export const PAGE_APPROACH_HERO = slots.approachWorkspace.src;
export const PAGE_APPROACH_HERO_ALT = slots.approachWorkspace.alt;

export const PAGE_CREATIVE_WORKSPACE = slots.craftSurface.src;
export const PAGE_CREATIVE_WORKSPACE_ALT = slots.craftSurface.alt;

export const PAGE_CREATIVE_PERFORMANCE = slots.livePresence.src;
export const PAGE_CREATIVE_PERFORMANCE_ALT = slots.livePresence.alt;

export const PAGE_EDITORIAL_WIDE = slots.editorialWide.src;
export const PAGE_EDITORIAL_WIDE_ALT = slots.editorialWide.alt;

/** Public client portal hero — in-flight creative rhythm, distinct from home trust table. */
export const PAGE_PUBLIC_WORK_STRIP = slots.creativeFriction.src;
export const PAGE_PUBLIC_WORK_STRIP_ALT = slots.creativeFriction.alt;

/** Callout blocks where “live performance” would repeat another page — use deep-work instead. */
export const PAGE_DEEP_WORK_STILL = slots.operatorSystems.src;
export const PAGE_DEEP_WORK_STILL_ALT = slots.operatorSystems.alt;

/** Book session sticky column — same frame as deep-work stills; alt tuned to “what you’re building.” */
export const PAGE_START_BRAND_STICKY_IMAGE = slots.operatorSystems.src;
export const PAGE_START_BRAND_STICKY_ALT =
  "Black creative technologist at a laptop in a focused workspace—building brand systems, narrative, and the next chapter you are bringing to market.";
