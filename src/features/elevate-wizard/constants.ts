export const BUSINESS_TYPES = [
  "Startup",
  "Creative agency",
  "E-commerce brand",
  "Personal brand",
  "Fintech",
  "Media company",
  "Other",
] as const;

export const CHALLENGES = [
  "Inconsistent content",
  "Weak brand identity",
  "Low engagement",
  "Unclear campaign plan",
  "Weak market penetration",
  "Poor marketing reporting",
  "Scaling marketing execution",
] as const;

export const TEAM_OPTIONS = [
  "Solo founder",
  "Small team",
  "Internal marketing team",
  "Agency-supported",
  "Hybrid setup",
] as const;

export const GOAL_OPTIONS = [
  "Marketing overview",
  "More content output",
  "Stronger brand identity",
  "Campaign management",
  "Better analytics",
  "Faster market entry",
  "Audience growth",
] as const;

export const MATURITY_OPTIONS = ["Just starting", "Growing steadily", "Scaling aggressively", "Enterprise-ready"] as const;

export const VISION_OPTIONS = [
  { id: "culture", label: "Culture-defining", hint: "Shape how people feel the category" },
  { id: "luxury", label: "Premium / luxury", hint: "Quiet confidence, editorial restraint" },
  { id: "tech", label: "Tech-forward", hint: "Product-led narrative and systems" },
  { id: "community", label: "Community-driven", hint: "Belonging, rituals, shared language" },
  { id: "social", label: "Viral / social-first", hint: "Velocity without losing taste" },
  { id: "thought", label: "Thought leadership", hint: "Authority that compounds trust" },
] as const;

export const REASSURANCE = [
  "Most growing brands struggle with this.",
  "You're growing faster than your marketing system.",
  "Clarity scales execution.",
  "Positioning is the quiet multiplier.",
  "A good profile turns ambition into a plan.",
] as const;
