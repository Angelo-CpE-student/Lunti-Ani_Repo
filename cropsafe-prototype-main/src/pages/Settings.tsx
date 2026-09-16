import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import { Card, ScreenHeader } from "../components/ui";
import { useApp } from "../context/AppContext";
import { CROPS } from "../data/crops";
import {
  UserIcon,
  PhoneIcon,
  CropIcon,
  MapPinIcon,
  BellIcon,
  MessageIcon,
  DatabaseIcon,
  BeakerIcon,
  ChevronRightIcon,
  LogOutIcon,
} from "../components/Icons";

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${on ? "bg-field" : "bg-line"}`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const { user, notificationSettings, setNotificationSettings, logout, clearAppData } = useApp();
  const navigate = useNavigate();
  const [confirmingClear, setConfirmingClear] = useState(false);
  const crop = CROPS.find((c) => c.id === user?.selectedCrop);

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleClearData() {
    clearAppData();
    navigate("/");
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-5 md:px-8">
        <ScreenHeader title="Settings" />

        <section className="mt-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">Account</h2>
          <Card className="mt-2 divide-y divide-line">
            <div className="flex justify-between py-2 first:pt-0">
              <span className="flex items-center gap-2 text-ink-soft">
                <UserIcon size={16} /> Farm name
              </span>
              <span className="font-medium text-ink">{user?.farm.name}</span>
            </div>
            <div className="flex justify-between py-2 last:pb-0">
              <span className="flex items-center gap-2 text-ink-soft">
                <PhoneIcon size={16} /> Contact number
              </span>
              <span className="font-medium text-ink">{user?.contactNumber}</span>
            </div>
          </Card>
        </section>

        <section className="mt-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">Farm</h2>
          <Card className="mt-2 divide-y divide-line">
            <div className="flex justify-between py-2 first:pt-0">
              <span className="flex items-center gap-2 text-ink-soft">
                <CropIcon size={16} /> Crop
              </span>
              <span className="font-medium text-ink">{crop?.name}</span>
            </div>
            <div className="flex justify-between py-2 last:pb-0">
              <span className="flex items-center gap-2 text-ink-soft">
                <MapPinIcon size={16} /> Farm location
              </span>
              <span className="font-medium text-ink">{user?.farm.location}</span>
            </div>
          </Card>
        </section>

        <section className="mt-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">Notifications</h2>
          <Card className="mt-2 divide-y divide-line">
            <div className="flex items-center justify-between py-2 first:pt-0">
              <span className="flex items-center gap-2 text-ink">
                <BellIcon size={16} /> App notifications
              </span>
              <Toggle
                on={notificationSettings.appNotifications}
                label="App notifications"
                onChange={(v) =>
                  setNotificationSettings({ ...notificationSettings, appNotifications: v })
                }
              />
            </div>
            <div className="flex items-center justify-between py-2 last:pb-0">
              <span className="flex items-center gap-2 text-ink">
                <MessageIcon size={16} /> High-risk SMS alerts
              </span>
              <Toggle
                on={notificationSettings.smsHighRiskAlerts}
                label="High-risk SMS alerts"
                onChange={(v) =>
                  setNotificationSettings({ ...notificationSettings, smsHighRiskAlerts: v })
                }
              />
            </div>
          </Card>
        </section>

        <section className="mt-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">Data &amp; storage</h2>
          <Card className="mt-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-ink-soft">
                <DatabaseIcon size={16} /> Storage used
              </span>
              <span className="font-medium text-ink">In-memory only</span>
            </div>
            <p className="mt-3 text-sm text-ink-soft">
              This prototype keeps data in memory only. Nothing is saved to this device, and
              refreshing the page returns to the login screen.
            </p>
            <button
              onClick={() => setConfirmingClear(true)}
              className="mt-4 w-full rounded-xl border-2 border-high px-4 py-3 font-semibold text-high"
            >
              Reset session
            </button>
          </Card>
        </section>

        <section className="mt-5 pb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">Developer</h2>
          <Card className="mt-2">
            <button
              onClick={() => navigate("/dev-mode")}
              className="flex w-full items-center justify-between text-ink"
            >
              <span className="flex items-center gap-2">
                <BeakerIcon size={16} /> Developer / Test Mode
              </span>
              <ChevronRightIcon size={16} />
            </button>
          </Card>

          <button
            onClick={handleLogout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-line py-3 font-semibold text-ink"
          >
            <LogOutIcon size={18} />
            Log out
          </button>
        </section>
      </div>

      {confirmingClear && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 md:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-5">
            <h2 id="clear-title" className="font-display text-xl font-semibold text-ink">
              Reset this session?
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              This clears the current in-memory session — weather, risk history, notifications,
              and test data — and returns you to the login screen.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-ink-soft">
              <li>Session login state</li>
              <li>Prediction history</li>
              <li>Notifications</li>
              <li>Saved test data</li>
            </ul>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmingClear(false)}
                className="flex-1 rounded-xl border border-line py-3 font-semibold text-ink"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 rounded-xl bg-high py-3 font-semibold text-white"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
