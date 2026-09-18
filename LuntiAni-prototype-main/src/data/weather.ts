import type { WeatherData } from "./types";

export const DEMO_WEATHER: WeatherData = {
  temperature: 29,
  humidity: 85,
  rainProbability: 70,
  windSpeed: 12,
  timeline: [
    { label: "Morning", temperature: 28 },
    { label: "Afternoon", temperature: 30 },
    { label: "Evening", temperature: 27 },
  ],
  updatedAt: new Date().toISOString(),

  rainfallMm: 15,
  leafWetnessHours: 8,
  rainfall7dSum: 60,
  humidity7dMean: 78,
  lwd7dMean: 7,
  consecutiveWetDays: 3,
};
