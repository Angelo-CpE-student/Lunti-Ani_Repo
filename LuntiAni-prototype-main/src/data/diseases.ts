import type { RiskLevel } from "./types";

export const RISK_COPY: Record<
  RiskLevel,
  { headline: string; reason: string; actions: string[] }
> = {
  LOW: {
    headline: "Conditions are currently less favorable for disease development.",
    reason:
      "Current weather is not creating the warm, wet conditions this disease needs to spread.",
    actions: ["Continue normal crop checks", "Keep watching the weather"],
  },
  MEDIUM: {
    headline: "Some conditions may support disease development. Monitor your crop closely.",
    reason:
      "Warmth and moisture are starting to build up. Disease risk could increase if this continues.",
    actions: [
      "Inspect leaves for early symptoms",
      "Avoid extra irrigation for now",
      "Check again tomorrow",
    ],
  },
  HIGH: {
    headline: "Conditions are favorable for disease development. Take action and inspect your crop.",
    reason:
      "The current combination of warm, humid and wet conditions can increase the likelihood of disease development.",
    actions: [
      "Inspect leaves for symptoms",
      "Avoid unnecessary irrigation",
      "Monitor the crop over the next 48 hours",
    ],
  },
};

export function riskLevelForPercentage(pct: number): RiskLevel {
  if (pct >= 65) return "HIGH";
  if (pct >= 35) return "MEDIUM";
  return "LOW";
}
