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
  const compact = size < 120;
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
        <span className={`font-display font-semibold text-ink ${compact ? "text-xl" : "text-4xl"}`}>
          {percentage}%
        </span>
        <span className={`mt-1 flex items-center gap-1 font-semibold ${compact ? "text-[10px]" : "text-sm"} ${style.text}`}>
          <span className={`rounded-full ${compact ? "h-1.5 w-1.5" : "h-2 w-2"} ${style.dot}`} />
          {style.label}
        </span>
      </div>
    </div>
  );
}
