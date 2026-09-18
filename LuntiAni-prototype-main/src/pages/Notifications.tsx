import AppShell from "../components/AppShell";
import { Card, ScreenHeader } from "../components/ui";
import { useApp } from "../context/AppContext";
import { formatDate } from "../lib/riskStyle";
import { RISK_STYLE } from "../lib/riskStyle";

export default function Notifications() {
  const { notifications, markNotificationRead } = useApp();

  function groupLabel(iso: string): string {
    const date = new Date(iso);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return formatDate(iso);
  }

  const groups = notifications.reduce<Record<string, typeof notifications>>((acc, n) => {
    const label = groupLabel(n.timestamp);
    acc[label] = acc[label] ? [...acc[label], n] : [n];
    return acc;
  }, {});

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-5 md:px-8">
        <ScreenHeader title="Notifications" onBack backTo="/dashboard" />

        {notifications.length === 0 ? (
          <Card className="mt-4">
            <p className="text-ink-soft">No notifications yet.</p>
          </Card>
        ) : (
          <div className="mt-4 space-y-6 pb-10">
            {Object.entries(groups).map(([label, items]) => (
              <section key={label}>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                  {label}
                </h2>
                <ul className="mt-2 space-y-2">
                  {items.map((n) => (
                    <li key={n.id}>
                      <button
                        onClick={() => markNotificationRead(n.id)}
                        className="w-full text-left"
                      >
                        <Card className={n.status === "unread" ? "border-field" : undefined}>
                          <div className="flex items-start gap-2.5">
                            {n.riskLevel && (
                              <span
                                className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${RISK_STYLE[n.riskLevel].dot}`}
                                aria-hidden
                              />
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-ink">{n.title}</p>
                              <p className="text-sm text-ink-soft">{n.message}</p>
                              <p className="mt-1 text-xs text-ink-soft">
                                {n.type === "sms" ? "SMS simulated" : "App notification"}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
