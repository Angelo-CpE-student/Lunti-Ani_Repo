import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { Card, ScreenHeader } from "../components/ui";
import { useApp } from "../context/AppContext";
import { DISEASES_BY_CROP } from "../data/crops";
import type { RiskLevel } from "../data/types";
import { BeakerIcon, MessageIcon } from "../components/Icons";

const RISK_LEVELS: RiskLevel[] = ["LOW", "MEDIUM", "HIGH"];

export default function DevMode() {
  const {
    user,
    weather,
    prediction,
    testModeEnabled,
    toggleTestMode,
    simulateRisk,
    updateTestWeather,
    simulateHighRiskSms,
    resetDemoData,
  } = useApp();
  const navigate = useNavigate();

  const cropId = user?.selectedCrop ?? "rice";
  const diseaseOptions = DISEASES_BY_CROP[cropId] ?? DISEASES_BY_CROP.other;

  const [temperature, setTemperature] = useState(weather.temperature);
  const [humidity, setHumidity] = useState(weather.humidity);
  const [rainProbability, setRainProbability] = useState(weather.rainProbability);
  const [windSpeed, setWindSpeed] = useState(weather.windSpeed);
  const [disease, setDisease] = useState(prediction.disease);

  function applyWeather() {
    updateTestWeather({ temperature, humidity, rainProbability, windSpeed }, disease);
  }

  if (!testModeEnabled) {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl px-5 md:px-8">
          <ScreenHeader title="Developer / Test Mode" onBack backTo="/settings" />
          <Card className="mt-2">
            <p className="text-ink-soft">
              Test Mode lets you simulate different weather and disease-risk scenarios so you can
              see how the app responds — without waiting for real conditions.
            </p>
            <button
              onClick={() => toggleTestMode(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-field py-3 font-semibold text-white"
            >
              <BeakerIcon size={18} />
              Enable Test Mode
            </button>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-5 pb-10 md:px-8">
        <ScreenHeader title="Developer / Test Mode" onBack backTo="/settings" />
        <p className="rounded-xl bg-medium-soft px-4 py-2 text-sm text-medium">
          Prototype tool — nothing here affects real data or sends a real SMS.
        </p>

        <section className="mt-5">
          <h2 className="font-display text-lg font-semibold text-ink">Test disease risk</h2>
          <p className="text-sm text-ink-soft">
            Current simulated risk: {prediction.riskPercentage}% ({prediction.riskLevel})
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {RISK_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => simulateRisk(level)}
                className={`rounded-xl border-2 py-3 font-semibold ${
                  prediction.riskLevel === level
                    ? "border-field bg-sage text-ink"
                    : "border-line bg-parchment text-ink-soft"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className="font-display text-lg font-semibold text-ink">Weather inputs</h2>
          <Card className="mt-3 space-y-4">
            <NumberField label="Temperature (°C)" value={temperature} onChange={setTemperature} />
            <NumberField label="Humidity (%)" value={humidity} onChange={setHumidity} max={100} />
            <NumberField
              label="Rain probability (%)"
              value={rainProbability}
              onChange={setRainProbability}
              max={100}
            />
            <NumberField label="Wind (km/h)" value={windSpeed} onChange={setWindSpeed} />

            <div>
              <label htmlFor="disease" className="text-sm font-medium text-ink-soft">
                Disease
              </label>
              <select
                id="disease"
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-ink"
              >
                {diseaseOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={applyWeather}
              className="w-full rounded-xl bg-field py-3 font-semibold text-white"
            >
              Update prediction
            </button>
          </Card>
        </section>

        <section className="mt-6">
          <h2 className="font-display text-lg font-semibold text-ink">SMS simulation</h2>
          <Card className="mt-3">
            <button
              onClick={simulateHighRiskSms}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-high py-3 font-semibold text-high"
            >
              <MessageIcon size={18} />
              Simulate HIGH-risk SMS
            </button>
            <p className="mt-2 text-xs text-ink-soft">This is only a prototype simulation.</p>
          </Card>
        </section>

        <section className="mt-6">
          <h2 className="font-display text-lg font-semibold text-ink">Demo data</h2>
          <Card className="mt-3 space-y-3">
            <button
              onClick={resetDemoData}
              className="w-full rounded-xl border border-line py-3 font-semibold text-ink"
            >
              Reset demo data
            </button>
            <button
              onClick={() => toggleTestMode(false)}
              className="w-full rounded-xl border border-line py-3 font-semibold text-ink-soft"
            >
              Disable Test Mode
            </button>
          </Card>
        </section>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 w-full text-center text-sm font-medium text-field"
        >
          Back to dashboard
        </button>
      </div>
    </AppShell>
  );
}

function NumberField({
  label,
  value,
  onChange,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-ink-soft">{label}</label>
      <input
        type="number"
        value={value}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 text-ink"
      />
    </div>
  );
}
