import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { Card, PrimaryButton } from "../components/ui";
import RiskDial from "../components/RiskDial";
import { useApp } from "../context/AppContext";
import { RISK_STYLE } from "../lib/riskStyle";
import {
  LeafIcon,
  BellIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ThermometerIcon,
  DropletIcon,
  CloudRainIcon,
  AlertTriangleIcon,
} from "../components/Icons";

export default function Dashboard() {
  const { user, prediction, weather, weatherLoading, weatherError, refreshWeather } = useApp();
  const navigate = useNavigate();
  const style = RISK_STYLE[prediction.riskLevel];

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-5 pt-6 md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl font-semibold text-ink md:hidden">
            <LeafIcon size={22} className="text-field" /> CropSafe
          </div>
          <button
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
            className="rounded-full p-2 text-ink hover:bg-black/5"
          >
            <BellIcon size={22} />
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-1 rounded-full border border-line bg-parchment px-3 py-1.5 text-sm font-medium text-ink"
          >
            {user?.farm.name ?? "My Farm"} <ChevronDownIcon size={14} />
          </button>
        </div>

        {weatherLoading && (
          <div className="mt-4 rounded-lg border border-line bg-parchment px-3 py-2 text-sm text-ink-soft">
            Fetching live weather…
          </div>
        )}
        {!weatherLoading && weatherError && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <span>Couldn't fetch live weather: {weatherError}</span>
            <button
              onClick={() => refreshWeather()}
              className="shrink-0 rounded-md border border-red-300 px-2 py-1 text-xs font-medium hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        )}

        <section className="mt-6" aria-labelledby="risk-heading">
          <h2 id="risk-heading" className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
            Disease risk
          </h2>
          <Card className={`mt-2 ${style.bg} border-transparent`}>
            <div className="flex items-center gap-5">
              <RiskDial level={prediction.riskLevel} percentage={prediction.riskPercentage} />
              <div className="min-w-0">
                <p className="font-display text-xl font-semibold text-ink">{prediction.disease}</p>
                <p className={`mt-2 flex items-start gap-1.5 text-sm font-medium ${style.text}`}>
                  <AlertTriangleIcon size={16} className="mt-0.5 shrink-0" />
                  {prediction.reason}
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-5" aria-labelledby="weather-heading">
          <button
            onClick={() => navigate("/weather")}
            className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-ink-soft"
          >
            <span id="weather-heading">Weather</span>
            <ChevronRightIcon size={14} />
          </button>
          <Card className="mt-2">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <ThermometerIcon size={18} className="mx-auto text-ink-soft" />
                <p className="mt-1 font-display text-2xl font-semibold text-ink">{weather.temperature}°C</p>
                <p className="text-xs text-ink-soft">Temperature</p>
              </div>
              <div>
                <DropletIcon size={18} className="mx-auto text-ink-soft" />
                <p className="mt-1 font-display text-2xl font-semibold text-ink">{weather.humidity}%</p>
                <p className="text-xs text-ink-soft">Humidity</p>
              </div>
              <div>
                <CloudRainIcon size={18} className="mx-auto text-ink-soft" />
                <p className="mt-1 font-display text-2xl font-semibold text-ink">{weather.rainProbability}%</p>
                <p className="text-xs text-ink-soft">Rain chance</p>
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-5" aria-labelledby="action-heading">
          <h2 id="action-heading" className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
            Recommended action
          </h2>
          <Card className="mt-2">
            <ul className="space-y-2">
              {prediction.recommendedActions.map((action) => (
                <li key={action} className="flex items-start gap-2 text-ink">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-field" aria-hidden />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <div className="mt-5 pb-6">
          <PrimaryButton onClick={() => navigate("/risk-details")}>View risk details</PrimaryButton>
        </div>
      </div>
    </AppShell>
  );
}
