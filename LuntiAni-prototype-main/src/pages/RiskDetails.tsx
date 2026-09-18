import AppShell from "../components/AppShell";
import { Card, PrimaryButton, ScreenHeader } from "../components/ui";
import RiskDial from "../components/RiskDial";
import { useApp } from "../context/AppContext";
import { ThermometerIcon, DropletIcon, CloudRainIcon, CheckCircleIcon } from "../components/Icons";
import { useNavigate } from "react-router-dom";

export default function RiskDetails() {
  const { prediction } = useApp();
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-5 md:px-8">
        <ScreenHeader title="Disease risk details" onBack backTo="/dashboard" />

        <div className="mt-4 flex flex-col items-center text-center">
          <RiskDial level={prediction.riskLevel} percentage={prediction.riskPercentage} size={180} />
          <h2 className="mt-4 font-display text-2xl font-semibold text-ink">{prediction.disease}</h2>
        </div>

        <section className="mt-8">
          <h3 className="font-display text-lg font-semibold text-ink">
            Why is the risk {prediction.riskLevel.toLowerCase()}?
          </h3>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <Card className="text-center">
              <ThermometerIcon size={20} className="mx-auto text-field" />
              <p className="mt-1 font-display text-lg font-semibold text-ink">{prediction.weather.temperature}°C</p>
              <p className="text-xs text-ink-soft">Temperature</p>
            </Card>
            <Card className="text-center">
              <DropletIcon size={20} className="mx-auto text-field" />
              <p className="mt-1 font-display text-lg font-semibold text-ink">{prediction.weather.humidity}%</p>
              <p className="text-xs text-ink-soft">Humidity</p>
            </Card>
            <Card className="text-center">
              <CloudRainIcon size={20} className="mx-auto text-field" />
              <p className="mt-1 font-display text-lg font-semibold text-ink">{prediction.weather.rainProbability}%</p>
              <p className="text-xs text-ink-soft">Rain chance</p>
            </Card>
          </div>
          <p className="mt-4 text-ink">{prediction.reason}</p>
        </section>

        <section className="mt-8 pb-10">
          <h3 className="font-display text-lg font-semibold text-ink">What should I do?</h3>
          <Card className="mt-3">
            <ul className="space-y-3">
              {prediction.recommendedActions.map((action) => (
                <li key={action} className="flex items-start gap-2 text-ink">
                  <CheckCircleIcon size={18} className="mt-0.5 shrink-0 text-low" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        <div className="pb-10">
          <PrimaryButton onClick={() => navigate("/dashboard")}>Return to dashboard</PrimaryButton>
        </div>
      </div>
    </AppShell>
  );
}
