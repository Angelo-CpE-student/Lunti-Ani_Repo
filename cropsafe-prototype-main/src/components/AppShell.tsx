import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  LeafIcon,
  HomeIcon,
  HistoryIcon,
  CropIcon,
  SettingsIcon,
  AlertTriangleIcon,
  MessageIcon,
  CheckCircleIcon,
} from "./Icons";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Home", Icon: HomeIcon },
  { to: "/history", label: "History", Icon: HistoryIcon },
  { to: "/crop", label: "Crop", Icon: CropIcon },
  { to: "/settings", label: "Settings", Icon: SettingsIcon },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, online, lastSms, dismissSms } = useApp();

  return (
    <div className="min-h-dvh flex flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:shrink-0 bg-field text-white p-6">
        <div className="flex items-center gap-2 font-display text-xl font-semibold">
          <LeafIcon size={24} />
          CropSafe
        </div>
        {user && <p className="mt-1 text-sm text-white/70">{user.farm.name}</p>}
        <nav className="mt-10 flex flex-col gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors ${
                  isActive ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {!online && (
          <div className="flex items-center justify-center gap-2 bg-medium-soft text-medium text-sm px-4 py-2 text-center">
            <AlertTriangleIcon size={16} />
            Connection unavailable — showing the latest saved information.
          </div>
        )}
        <main className="flex-1 pb-24 md:pb-8">{children}</main>

        {/* Mobile bottom nav */}
        <nav
          className="md:hidden fixed bottom-0 inset-x-0 bg-parchment border-t border-line flex items-stretch"
          aria-label="Main navigation"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
                  isActive ? "text-field" : "text-ink-soft"
                }`
              }
            >
              <Icon size={22} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {lastSms && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 md:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sms-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-5">
            <p id="sms-title" className="flex items-center gap-2 font-display text-lg font-semibold text-high">
              <MessageIcon size={20} />
              SMS alert
            </p>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-high">
              High-risk warning
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-ink-soft">Status</p>
                <p className="flex items-center gap-1 font-medium text-low">
                  <CheckCircleIcon size={16} />
                  Simulated SMS sent
                </p>
              </div>
              <div>
                <p className="text-ink-soft">Recipient</p>
                <p className="font-medium text-ink">{lastSms.recipient}</p>
              </div>
              <div className="rounded-xl bg-sage p-3 whitespace-pre-line text-ink">
                {lastSms.body}
              </div>
            </div>
            <p className="mt-4 text-xs text-ink-soft">
              Prototype — no real SMS was sent.
            </p>
            <button
              onClick={dismissSms}
              className="mt-5 w-full rounded-xl bg-field py-3 font-semibold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
