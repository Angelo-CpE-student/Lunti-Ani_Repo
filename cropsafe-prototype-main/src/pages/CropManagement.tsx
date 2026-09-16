import AppShell from "../components/AppShell";
import { Card, ScreenHeader } from "../components/ui";
import RiskDial from "../components/RiskDial";
import { useApp } from "../context/AppContext";
import { CROPS } from "../data/crops";
import { CropIcon } from "../components/Icons";

export default function CropManagement() {
  const { user, prediction } = useApp();
  const crop = CROPS.find((c) => c.id === user?.selectedCrop) ?? CROPS[0];

  const plantedLabel = user
    ? new Date(user.plantedDate).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-5 md:px-8">
        <ScreenHeader title="My crop" />

        <Card className="mt-2 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sage text-field">
            <CropIcon size={28} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">{crop.name}</p>
            <p className="text-sm text-ink-soft">{user?.farm.name ?? "My Farm"}</p>
          </div>
          <div className="ml-auto">
            <RiskDial level={prediction.riskLevel} percentage={prediction.riskPercentage} size={72} />
          </div>
        </Card>

        <Card className="mt-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-ink-soft">Crop planted</span>
            <span className="font-medium text-ink">{plantedLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Growth stage</span>
            <span className="font-medium text-ink">{user?.growthStage ?? "Vegetative"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Farm</span>
            <span className="font-medium text-ink">{user?.farm.name ?? "My Farm"}</span>
          </div>
        </Card>

        <section className="mt-6 pb-10">
          <h2 className="font-display text-lg font-semibold text-ink">Upcoming</h2>
          <Card className="mt-3 divide-y divide-line">
            <div className="flex items-center justify-between py-2 first:pt-0">
              <span className="text-ink">Inspect crops</span>
              <span className="text-sm text-ink-soft">Today</span>
            </div>
            <div className="flex items-center justify-between py-2 last:pb-0">
              <span className="text-ink">Monitor disease symptoms</span>
              <span className="text-sm text-ink-soft">Tomorrow</span>
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
