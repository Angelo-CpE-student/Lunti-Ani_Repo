import type { WeatherData } from "../data/types";

const METEOSTAT_API_KEY = import.meta.env.VITE_METEOSTAT_API_KEY as string;
const METEOSTAT_HOST = "meteostat.p.rapidapi.com";

// Hardcoded farm location for this POC (Legazpi City, Bicol).
// Swap with the real farm's coordinates whenever you have them.
export const FARM_LAT = 13.1391;
export const FARM_LON = 123.7438;

interface MeteostatHourlyRecord {
  time: string; // "YYYY-MM-DD HH:mm:ss"
  temp: number | null;
  rhum: number | null;
  prcp: number | null;
  wspd: number | null;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const mean = (nums: number[]) =>
  nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
const sum = (nums: number[]) => nums.reduce((a, b) => a + b, 0);

/**
 * Fetches the last 7 days of hourly weather from Meteostat for the given
 * location and shapes it into the app's WeatherData format, including the
 * rolling 7-day features the model expects.
 *
 * Note: Meteostat provides observed/historical data, not a forecast, and
 * has no "rain probability" or "leaf wetness" field — those two are
 * approximated below as a reasonable stand-in for this POC.
 */
export async function fetchLiveWeather(
  lat: number = FARM_LAT,
  lon: number = FARM_LON
): Promise<WeatherData> {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);

  const url = `https://meteostat.p.rapidapi.com/point/hourly?lat=${lat}&lon=${lon}&start=${formatDate(
    start
  )}&end=${formatDate(end)}&tz=Asia/Manila`;

  const res = await fetch(url, {
    headers: {
      "X-RapidAPI-Key": METEOSTAT_API_KEY,
      "X-RapidAPI-Host": METEOSTAT_HOST,
    },
  });

  if (!res.ok) {
    throw new Error(`Meteostat request failed: ${res.status}`);
  }

  const json = await res.json();
  const records: MeteostatHourlyRecord[] = json.data ?? [];
  const clean = records.filter((r) => r.temp != null && r.rhum != null);

  if (clean.length === 0) {
    throw new Error("No usable weather data returned for this location");
  }

  const last24 = clean.slice(-24);
  const latest = clean[clean.length - 1];

  // --- "today" / last 24h values, matching the model's daily features ---
  const temp_mean_c = mean(last24.map((r) => r.temp as number));
  const relative_humidity_pct = latest.rhum as number;
  const rainfall_mm = sum(last24.map((r) => r.prcp ?? 0));
  const wind_speed_kmh = latest.wspd ?? 0;

  // Leaf wetness isn't measured by Meteostat. POC heuristic: count hours
  // in the last 24h where humidity stayed at/above 90%, a common proxy
  // for leaf surfaces remaining wet.
  const leaf_wetness_hours = last24.filter((r) => (r.rhum ?? 0) >= 90).length;

  // --- 7-day rolling values ---
  const rainfall_7d_sum = sum(clean.map((r) => r.prcp ?? 0));
  const humidity_7d_mean = mean(clean.map((r) => r.rhum as number));

  const byDay = new Map<string, MeteostatHourlyRecord[]>();
  for (const r of clean) {
    const day = r.time.slice(0, 10);
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(r);
  }
  const days = Array.from(byDay.entries()).sort(([a], [b]) => a.localeCompare(b));

  const dailyLeafWetness = days.map(
    ([, hrs]) => hrs.filter((r) => (r.rhum ?? 0) >= 90).length
  );
  const lwd_7d_mean = mean(dailyLeafWetness);

  const dailyRain = days.map(([, hrs]) => sum(hrs.map((r) => r.prcp ?? 0)));
  let consecutive_wet_days = 0;
  for (let i = dailyRain.length - 1; i >= 0; i--) {
    if (dailyRain[i] > 1) consecutive_wet_days++;
    else break;
  }

  // Rough "today" timeline for the dashboard chart, using the closest
  // available hours to morning/afternoon/evening.
  const findClosest = (hour: number) =>
    last24.reduce((best, r) => {
      const h = Number(r.time.slice(11, 13));
      const bestH = Number(best.time.slice(11, 13));
      return Math.abs(h - hour) < Math.abs(bestH - hour) ? r : best;
    }, last24[0]);

  const timeline = [
    { label: "Morning", temperature: findClosest(8).temp ?? temp_mean_c },
    { label: "Afternoon", temperature: findClosest(14).temp ?? temp_mean_c },
    { label: "Evening", temperature: findClosest(20).temp ?? temp_mean_c },
  ];

  return {
    temperature: Math.round(temp_mean_c * 10) / 10,
    humidity: Math.round(relative_humidity_pct),
    // Meteostat has no probability field — this is a rough placeholder
    // based on whether it's been raining, not a real forecast probability.
    rainProbability: rainfall_mm > 0 ? 60 : 20,
    windSpeed: Math.round(wind_speed_kmh),
    timeline,
    updatedAt: new Date().toISOString(),

    rainfallMm: Math.round(rainfall_mm * 10) / 10,
    leafWetnessHours: leaf_wetness_hours,
    rainfall7dSum: Math.round(rainfall_7d_sum * 10) / 10,
    humidity7dMean: Math.round(humidity_7d_mean),
    lwd7dMean: Math.round(lwd_7d_mean * 10) / 10,
    consecutiveWetDays: consecutive_wet_days,
  };
}
