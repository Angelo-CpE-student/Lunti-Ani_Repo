export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface CropOption {
  id: string;
  name: string;
}

export interface Farm {
  name: string;
  location: string;
}

export interface WeatherData {
  temperature: number; // C
  humidity: number; // %
  rainProbability: number; // %
  windSpeed: number; // km/h
  timeline: { label: string; temperature: number }[];
  updatedAt: string; // ISO

  // Added for the real model:
  rainfallMm: number; // actual rainfall in mm (not probability)
  leafWetnessHours: number; // hours leaves stayed wet today
  rainfall7dSum: number; // total rainfall over last 7 days
  humidity7dMean: number; // average humidity over last 7 days
  lwd7dMean: number; // average leaf wetness (hours) over last 7 days
  consecutiveWetDays: number; // how many days in a row it's been wet
}


export interface Prediction {
  id: string;
  date: string; // ISO
  crop: string;
  disease: string;
  riskPercentage: number;
  riskLevel: RiskLevel;
  reason: string;
  recommendedActions: string[];
  weather: {
    temperature: number;
    humidity: number;
    rainProbability: number;
  };
}

export type NotificationType = "sms" | "app";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // ISO
  status: "simulated-sms-sent" | "delivered" | "read" | "unread";
  riskLevel?: RiskLevel;
}

export interface User {
  contactNumber: string;
  selectedCrop: string;
  farm: Farm;
  plantedDate: string;
  growthStage: string;
}

export interface NotificationSettings {
  appNotifications: boolean;
  smsHighRiskAlerts: boolean;
}
