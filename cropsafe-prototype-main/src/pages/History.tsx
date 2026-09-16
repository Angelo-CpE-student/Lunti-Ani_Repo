import { useState } from "react";
import AppShell from "../components/AppShell";
import { Card, ScreenHeader } from "../components/ui";
import { useApp } from "../context/AppContext";
import { RISK_STYLE, formatDate, formatDateFull } from "../lib/riskStyle";

export default function History() {
  const { history } = useApp();
  const [openId, setOpenId] = useState<string | null>(history[0]?.id ?? null);

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-5 md:px-8">
        <ScreenHeader title="Prediction history" />

        {history.length === 0 ? (
          <Card className="mt-4">
            <p className="text-ink-soft">No disease prediction available yet. Check again later.</p>
          </Card>
        ) : (
          <ul className="mt-4 space-y-3 pb-10">
            {history.map((item) => {
              const style = RISK_STYLE[item.riskLevel];
              const open = openId === item.id;
              return (
                <li key={item.id}>
                  <Card className="p-0 overflow-hidden">
                    <button
                      className="flex w-full items-center gap-4 p-4 text-left"
                      onClick={() => setOpenId(open ? null : item.id)}
                      aria-expanded={open}
                    >
                      <span className="w-14 shrink-0 text-sm font-medium text-ink-soft">
                        {formatDate(item.date)}
                      </span>
                      <span className={`flex items-center gap-1.5 text-sm font-semibold ${style.text}`}>
                        <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                        {style.label}
                      </span>
                      <span className="flex-1 truncate text-ink">{item.disease}</span>
                      <span className="font-display text-lg font-semibold text-ink">
                        {item.riskPercentage}%
                      </span>
                    </button>
                    {open && (
                      <div className="border-t border-line px-4 pb-4 pt-3 text-sm text-ink-soft">
                        <p className="text-ink">{formatDateFull(item.date)}</p>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          <span>{item.weather.temperature}°C</span>
                          <span>{item.weather.humidity}% humidity</span>
                          <span>{item.weather.rainProbability}% rain</span>
                        </div>
                        <p className="mt-2">{item.reason}</p>
                      </div>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
