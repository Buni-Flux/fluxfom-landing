import type { ElevateWizardAnswers } from "./types";

export function buildWizardSummary(a: ElevateWizardAnswers): string {
  const lines: string[] = ["— FluxFom profile marketing overview —"];
  if (a.businessType) lines.push(`Business type: ${a.businessType}`);
  if (a.challenges.length) lines.push(`Challenges: ${a.challenges.join("; ")}`);
  if (a.team) lines.push(`Team: ${a.team}`);
  if (a.goals.length) lines.push(`Goals: ${a.goals.join("; ")}`);
  if (a.maturity) lines.push(`Maturity: ${a.maturity}`);
  if (a.vision) lines.push(`Vision: ${a.vision}`);
  return lines.join("\n");
}

export function suggestServices(a: ElevateWizardAnswers): string[] {
  const out = new Set<string>();
  if (a.challenges.some((c) => c.includes("identity") || c.includes("content"))) out.add("Brand positioning & content system");
  if (a.challenges.some((c) => c.includes("execution") || c.includes("Scaling"))) out.add("Managed marketing execution");
  if (a.goals.some((g) => g.includes("identity") || g.includes("content"))) out.add("Creative production: content, motion & digital assets");
  if (a.goals.some((g) => g.includes("Automation") || g.includes("analytics"))) out.add("Growth systems & measurement");
  if (a.goals.some((g) => g.includes("Campaign") || g.includes("market") || g.includes("Audience"))) out.add("Campaign architecture & market penetration");
  if (out.size === 0) out.add("Marketing overview & roadmap");
  return [...out].slice(0, 5);
}

export function opportunityAreas(a: ElevateWizardAnswers): string[] {
  const areas: string[] = [];
  if (a.challenges.includes("Weak brand identity")) areas.push("Perception & differentiation");
  if (a.challenges.includes("Inconsistent content") || a.goals.includes("More content output"))
    areas.push("Editorial cadence & channel logic");
  if (a.challenges.includes("Poor marketing reporting") || a.goals.includes("Better analytics")) areas.push("Signal, reporting & decision hygiene");
  if (a.challenges.includes("Weak market penetration") || a.goals.includes("Faster market entry")) areas.push("Market entry & campaign traction");
  if (a.challenges.includes("Scaling marketing execution")) areas.push("Execution cadence & managed rollout");
  if (areas.length === 0) areas.push("Narrative clarity", "Launch sequencing", "Marketing overview");
  return [...new Set(areas)].slice(0, 4);
}
