import type { Prediction, WeatherData } from "./types";
import { RISK_COPY, riskLevelForPercentage } from "./diseases";

interface InterpretResponse {
  explanation: string;
  why: string;
  actions: string[];
}

/**
 * Calls the /interpret endpoint (Gemini-powered) for a dynamic, plain-language
 * explanation. Returns null on any failure — missing API key, rate limit,
 * network issue — so callers can fall back to the static RISK_COPY text
 * instead of breaking the app.
 */
async function fetchInterpretation(params: {
  predicted_disease: string;
  crop: string;
  risk_level: string;
  risk_percentage: number;
  weather: Record<string, number>;
}): Promise<InterpretResponse | null> {
  try {
    const res = await fetch("http://localhost:5000/interpret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      console.warn("LLM interpretation unavailable, using static text:", data.error);
      return null;
    }

    return { explanation: data.explanation, why: data.why, actions: data.actions };
  } catch (err) {
    console.warn("LLM interpretation request failed, using static text:", err);
    return null;
  }
}

export async function predictDiseaseRisk(
  weather: WeatherData,
  crop: string,
  disease: string
): Promise<Prediction> {
  const featurePayload = {
    temp_mean_c: weather.temperature,
    relative_humidity_pct: weather.humidity,
    rainfall_mm: weather.rainfallMm,
    wind_speed_kmh: weather.windSpeed,
    leaf_wetness_hours: weather.leafWetnessHours,
    rainfall_7d_sum: weather.rainfall7dSum,
    humidity_7d_mean: weather.humidity7dMean,
    lwd_7d_mean: weather.lwd7dMean,
    consecutive_wet_days: weather.consecutiveWetDays,
  };

  const res = await fetch("http://localhost:5000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(featurePayload),
  });

  if (!res.ok) throw new Error("Prediction request failed");
  const data = await res.json(); // { risk: 0 | 1, probability: number }

  const riskPercentage = Math.round(data.probability * 100);
  const riskLevel = riskLevelForPercentage(riskPercentage);
  const fallback = RISK_COPY[riskLevel];

  const interpretation = await fetchInterpretation({
    predicted_disease: disease,
    crop,
    risk_level: riskLevel,
    risk_percentage: riskPercentage,
    weather: featurePayload,
  });

  const reason = interpretation
    ? `${interpretation.explanation} ${interpretation.why}`.trim()
    : fallback.reason;
  const recommendedActions =
    interpretation && interpretation.actions.length > 0
      ? interpretation.actions
      : fallback.actions;

  return {
    id: `pred-${Date.now()}`,
    date: new Date().toISOString(),
    crop,
    disease,
    riskPercentage,
    riskLevel,
    reason,
    recommendedActions,
    weather: {
      temperature: weather.temperature,
      humidity: weather.humidity,
      rainProbability: weather.rainProbability,
    },
  };
}

export const DEMO_PREDICTION: Prediction = {
  id: "pred-demo-0",
  date: new Date().toISOString(),
  crop: "Rice",
  disease: "Rice Blast",
  riskPercentage: 78,
  riskLevel: "HIGH",
  reason: RISK_COPY.HIGH.reason,
  recommendedActions: RISK_COPY.HIGH.actions,
  weather: { temperature: 29, humidity: 85, rainProbability: 70 },
};

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const DEMO_HISTORY: Prediction[] = [
  DEMO_PREDICTION,
  {
    id: "pred-demo-1",
    date: daysAgoIso(1),
    crop: "Rice",
    disease: "Rice Blast",
    riskPercentage: 54,
    riskLevel: "MEDIUM",
    reason: RISK_COPY.MEDIUM.reason,
    recommendedActions: RISK_COPY.MEDIUM.actions,
    weather: { temperature: 27, humidity: 74, rainProbability: 50 },
  },
  {
    id: "pred-demo-2",
    date: daysAgoIso(2),
    crop: "Rice",
    disease: "Rice Blast",
    riskPercentage: 23,
    riskLevel: "LOW",
    reason: RISK_COPY.LOW.reason,
    recommendedActions: RISK_COPY.LOW.actions,
    weather: { temperature: 25, humidity: 60, rainProbability: 20 },
  },
];
