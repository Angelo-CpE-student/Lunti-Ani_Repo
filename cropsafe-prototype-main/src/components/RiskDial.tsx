import type { RiskLevel } from "../data/types";
import { RISK_STYLE } from "../lib/riskStyle";

const RING_COLOR: Record<RiskLevel, string> = {
  LOW: "var(--color-low)",
  MEDIUM: "var(--color-medium)",
  HIGH: "var(--color-high)",
};

export default function RiskDial({
  level,
  percentage,
  size = 148,
}: {
  level: RiskLevel;
  percentage: number;
  size?: number;
}) {
  const style = RISK_STYLE[level];
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Disease risk ${percentage} percent, ${style.label}`}
    >
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--color-line)" strokeWidth="12" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={RING_COLOR[level]}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-semibold text-ink">{percentage}%</span>
        <span className={`mt-1 flex items-center gap-1 text-sm font-semibold ${style.text}`}>
          <span className={`h-2 w-2 rounded-full ${style.dot}`} />
          {style.label}
        </span>
      </div>
    </div>
  );
}
