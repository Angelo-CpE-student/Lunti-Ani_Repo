import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { Card, PrimaryButton } from "../components/ui";
import RiskDial from "../components/RiskDial";
import { useApp } from "../context/AppContext";
import { RISK_STYLE } from "../lib/riskStyle";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ThermometerIcon,
  DropletIcon,
  CloudRainIcon,
  AlertTriangleIcon,
} from "../components/Icons";

const LOGO_IMAGE = "/logo.jpg"; // place your logo file in public/logo.png

export default function Dashboard() {
  const { user, prediction, weather, weatherLoading, weatherError, refreshWeather } = useApp();
  const navigate = useNavigate();
  const style = RISK_STYLE[prediction.riskLevel];

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-5 pt-6 md:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col md:hidden" style={{ fontFamily: '"Cardo", serif' }}>
            <div className="flex items-center gap-2 text-xl font-semibold">
              <img src={LOGO_IMAGE} alt="LuntiAni logo" className="h-7 w-7 object-contain" />
              <span style={{ color: '#23261f', letterSpacing: '0.02em' }}>
                Lunti
                <span style={{ color: '#c79c2d' }}>A</span>
                ni
              </span>
            </div>
            <p className="mt-0.5 pl-9 text-xs leading-4 text-ink-soft">
              {user?.farm.name ?? "My Farm"}
            </p>
          </div>
          <button
            onClick={() => navigate("/settings")}
            className="ml-auto mt-0.5 flex shrink-0 items-center gap-1 rounded-full border border-line bg-parchment px-3 py-1.5 text-sm font-medium text-ink"
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

        <section className="mt-7">
          <div className="mt-2 grid items-stretch gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(230px,0.7fr)]">
            <div className="flex min-h-[420px] h-full flex-col">
              <h2 id="risk-heading" className="flex items-center gap-1 text-lg font-bold uppercase tracking-wide text-ink-soft">
                Disease risk
              </h2>
              <Card className={`mt-2 flex flex-1 flex-col items-center justify-center ${style.bg} border-2 border-field/20 shadow-lg px-6 py-10 text-center`}>
                <RiskDial level={prediction.riskLevel} percentage={prediction.riskPercentage} size={300} />
                <p className="mt-6 font-display text-3xl font-bold text-ink">{prediction.disease}</p>
                <p className={`mt-3 flex max-w-md items-start justify-center gap-1.5 text-base font-medium ${style.text}`}>
                  <AlertTriangleIcon size={18} className="mt-0.5 shrink-0" />
                  {prediction.reason}
                </p>
              </Card>
            </div>

            <section className="flex min-h-[420px] flex-col" aria-labelledby="action-heading">
              <h2 id="action-heading" className="flex items-center gap-1 text-lg font-bold uppercase tracking-wide text-ink-soft">
                Recommended action
              </h2>
              <Card className="mt-2 flex-1">
                <ul className="space-y-4">
                  {prediction.recommendedActions.map((action) => (
                    <li key={action} className="flex items-start gap-3 text-ink">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-field" aria-hidden />
                      <span className="leading-6">{action}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
          </div>
        </section>

        <section className="mt-5" aria-labelledby="weather-heading">
          <button
            onClick={() => navigate("/weather")}
            className="flex items-center gap-1 text-lg font-bold uppercase tracking-wide text-ink-soft"
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

        <div className="mt-5 pb-6">
          <PrimaryButton onClick={() => navigate("/risk-details")}>View risk details</PrimaryButton>
        </div>
      </div>
    </AppShell>
  );
}
