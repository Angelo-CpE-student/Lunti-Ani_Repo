import type { RiskLevel } from "../data/types";

export const RISK_STYLE: Record<
  RiskLevel,
  { label: string; text: string; bg: string; dot: string }
> = {
  LOW: {
    label: "Low",
    text: "text-low",
    bg: "bg-low-soft",
    dot: "bg-low",
  },
  MEDIUM: {
    label: "Moderate",
    text: "text-medium",
    bg: "bg-medium-soft",
    dot: "bg-medium",
  },
  HIGH: {
    label: "High",
    text: "text-high",
    bg: "bg-high-soft",
    dot: "bg-high",
  },
};

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatDateFull(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
