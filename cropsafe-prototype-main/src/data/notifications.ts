import type { AppNotification, Prediction, NotificationSettings } from "./types";

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  appNotifications: true,
  smsHighRiskAlerts: true,
};

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-demo-0",
    type: "sms",
    title: "High disease risk",
    message: "Rice Blast — 78%",
    timestamp: new Date().toISOString(),
    status: "simulated-sms-sent",
    riskLevel: "HIGH",
  },
  {
    id: "notif-demo-1",
    type: "app",
    title: "Moderate disease risk",
    message: "Rice Blast — 54%",
    timestamp: daysAgoIso(1),
    status: "read",
    riskLevel: "MEDIUM",
  },
  {
    id: "notif-demo-2",
    type: "app",
    title: "Crop monitoring reminder",
    message: "Check your rice crop for early symptoms.",
    timestamp: daysAgoIso(1),
    status: "read",
  },
];

export function notificationForPrediction(
  prediction: Prediction,
  contactNumber: string
): { notification: AppNotification; sms: { sent: boolean; body: string } } {
  const isHigh = prediction.riskLevel === "HIGH";

  const notification: AppNotification = {
    id: `notif-${prediction.id}`,
    type: isHigh ? "sms" : "app",
    title: isHigh
      ? "High disease risk"
      : prediction.riskLevel === "MEDIUM"
      ? "Moderate disease risk"
      : "Low disease risk",
    message: `${prediction.disease} — ${prediction.riskPercentage}%`,
    timestamp: prediction.date,
    status: isHigh ? "simulated-sms-sent" : "unread",
    riskLevel: prediction.riskLevel,
  };

  const smsBody = `CropSafe Alert\n\nHigh disease risk detected for your ${prediction.crop.toLowerCase()} crop.\n\nRisk: ${prediction.riskPercentage}%\nDisease: ${prediction.disease}\n\nInspect your plants today.`;

  return {
    notification,
    sms: { sent: isHigh, body: isHigh ? smsBody.replace("09XX XXX XXXX", contactNumber) : "" },
  };
}
