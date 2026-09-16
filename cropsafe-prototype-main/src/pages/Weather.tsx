import AppShell from "../components/AppShell";
import { Card, ScreenHeader } from "../components/ui";
import { useApp } from "../context/AppContext";
import { ThermometerIcon, DropletIcon, CloudRainIcon, WindIcon } from "../components/Icons";

export default function Weather() {
  const { weather, user } = useApp();

  const stats = [
    { Icon: ThermometerIcon, value: `${weather.temperature}°C`, label: "Temperature" },
    { Icon: DropletIcon, value: `${weather.humidity}%`, label: "Humidity" },
    { Icon: CloudRainIcon, value: `${weather.rainProbability}%`, label: "Rain probability" },
    { Icon: WindIcon, value: `${weather.windSpeed} km/h`, label: "Wind" },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-5 md:px-8">
        <ScreenHeader title="Weather" onBack backTo="/dashboard" />
        <p className="px-1 text-ink-soft">{user?.farm.name ?? "My Farm"}</p>

        <div className="mt-5 grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="text-center">
              <s.Icon size={20} className="mx-auto text-field" />
              <p className="mt-1 font-display text-2xl font-semibold text-ink">{s.value}</p>
              <p className="text-xs text-ink-soft">{s.label}</p>
            </Card>
          ))}
        </div>

        <section className="mt-8 pb-10">
          <h2 className="font-display text-lg font-semibold text-ink">Today's conditions</h2>
          <Card className="mt-3">
            <div className="grid grid-cols-3 divide-x divide-line text-center">
              {weather.timeline.map((slot) => (
                <div key={slot.label} className="px-2">
                  <p className="text-sm text-ink-soft">{slot.label}</p>
                  <p className="mt-1 font-display text-xl font-semibold text-ink">
                    {slot.temperature}°C
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
