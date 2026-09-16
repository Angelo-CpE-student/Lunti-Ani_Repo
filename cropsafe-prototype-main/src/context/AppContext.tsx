import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  User,
  WeatherData,
  Prediction,
  AppNotification,
  NotificationSettings,
  RiskLevel,
} from "../data/types";
import * as storage from "../lib/storage";
import { predictDiseaseRisk } from "../data/predictions";
import { notificationForPrediction } from "../data/notifications";
import { RISK_COPY } from "../data/diseases";
import { DEMO_USERNAME, DEMO_PASSWORD } from "../data/users";
import { fetchLiveWeather } from "../lib/weatherApi";

interface SmsPreview {
  body: string;
  recipient: string;
  timestamp: string;
}

interface AppContextValue {
  loggedIn: boolean;
  user: User | null;
  weather: WeatherData;
  prediction: Prediction;
  history: Prediction[];
  notifications: AppNotification[];
  notificationSettings: NotificationSettings;
  testModeEnabled: boolean;
  lastSms: SmsPreview | null;
  online: boolean;
  dismissSms: () => void;

  login: (username: string, password: string) => boolean;
  logout: () => void;

  setNotificationSettings: (settings: NotificationSettings) => void;
  markNotificationRead: (id: string) => void;

  toggleTestMode: (value: boolean) => void;
  simulateRisk: (level: RiskLevel) => void;
  updateTestWeather: (weather: Partial<WeatherData>, disease?: string) => Promise<void>;
  simulateHighRiskSms: () => void;
  resetDemoData: () => void;
  clearAppData: () => void;
  refreshWeather: () => Promise<void>;
  weatherLoading: boolean;
  weatherError: string | null;
}

const AppContext = createContext<AppContextValue | null>(null);

const RISK_TARGET: Record<RiskLevel, number> = { LOW: 18, MEDIUM: 52, HIGH: 78 };

export function AppProvider({ children }: { children: ReactNode }) {
  // loggedIn is plain React state — nothing is read from or written to
  // browser storage. Refreshing the page always returns to the login screen.
  const [loggedIn, setLoggedInState] = useState(false);
  const [user, setUser] = useState<User | null>(storage.getUser());
  const [weather, setWeather] = useState<WeatherData>(storage.getWeather());
  const [prediction, setPrediction] = useState<Prediction>(storage.getPrediction());
  const [history, setHistory] = useState<Prediction[]>(storage.getHistory());
  const [notifications, setNotifications] = useState<AppNotification[]>(
    storage.getNotifications()
  );
  const [notificationSettings, setNotificationSettingsState] = useState<NotificationSettings>(
    storage.getNotificationSettings()
  );
  const [testModeEnabled, setTestModeEnabledState] = useState(storage.isTestModeEnabled());
  const [lastSms, setLastSms] = useState<SmsPreview | null>(null);
  const [online] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const dismissSms = useCallback(() => setLastSms(null), []);

  const applyPrediction = useCallback((next: Prediction, contact: string) => {
    setPrediction(next);
    storage.savePrediction(next);
    const nextHistory = storage.addToHistory(next);
    setHistory(nextHistory);

    const { notification, sms } = notificationForPrediction(next, contact);
    const nextNotifications = storage.addNotification(notification);
    setNotifications(nextNotifications);

    if (sms.sent) {
      setLastSms({ body: sms.body, recipient: contact, timestamp: next.date });
    }
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    if (username.trim().toLowerCase() !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
      return false;
    }
    storage.setLoggedIn(true);
    setLoggedInState(true);
    setUser(storage.getUser());
    return true;
  }, []);

  const logout = useCallback(() => {
    storage.setLoggedIn(false);
    setLoggedInState(false);
  }, []);

  const setNotificationSettings = useCallback((settings: NotificationSettings) => {
    storage.saveNotificationSettings(settings);
    setNotificationSettingsState(settings);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((current) => {
      const next = current.map((n) => (n.id === id ? { ...n, status: "read" as const } : n));
      storage.saveNotifications(next);
      return next;
    });
  }, []);

  const toggleTestMode = useCallback((value: boolean) => {
    storage.setTestModeEnabled(value);
    setTestModeEnabledState(value);
  }, []);

  const simulateRisk = useCallback(
    (level: RiskLevel) => {
      const targetPct = RISK_TARGET[level];
      const nextWeather: WeatherData = {
        ...weather,
        temperature: level === "HIGH" ? 29 : level === "MEDIUM" ? 27 : 25,
        humidity: level === "HIGH" ? 85 : level === "MEDIUM" ? 70 : 55,
        rainProbability: level === "HIGH" ? 70 : level === "MEDIUM" ? 45 : 15,
        updatedAt: new Date().toISOString(),
      };
      setWeather(nextWeather);
      storage.saveWeather(nextWeather);

      const copy = RISK_COPY[level];
      const next: Prediction = {
        id: `pred-${Date.now()}`,
        date: new Date().toISOString(),
        crop: prediction.crop,
        disease: prediction.disease,
        riskPercentage: targetPct,
        riskLevel: level,
        reason: copy.reason,
        recommendedActions: copy.actions,
        weather: {
          temperature: nextWeather.temperature,
          humidity: nextWeather.humidity,
          rainProbability: nextWeather.rainProbability,
        },
      };
      applyPrediction(next, user?.contactNumber ?? "09XX XXX XXXX");
    },
    [weather, prediction.crop, prediction.disease, user?.contactNumber, applyPrediction]
  );

  const updateTestWeather = useCallback(
    async (patch: Partial<WeatherData>, disease?: string) => {
      const nextWeather: WeatherData = { ...weather, ...patch, updatedAt: new Date().toISOString() };
      setWeather(nextWeather);
      storage.saveWeather(nextWeather);

      try {
        const next = await predictDiseaseRisk(
          nextWeather,
          prediction.crop,
          disease ?? prediction.disease
        );
        applyPrediction(next, user?.contactNumber ?? "09XX XXX XXXX");
      } catch (err) {
        console.error("Prediction failed:", err);
      }
    },
    [weather, prediction.crop, prediction.disease, user?.contactNumber, applyPrediction]
  );

  const refreshWeather = useCallback(async () => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const liveWeather = await fetchLiveWeather();
      setWeather(liveWeather);
      storage.saveWeather(liveWeather);

      const next = await predictDiseaseRisk(liveWeather, prediction.crop, prediction.disease);
      applyPrediction(next, user?.contactNumber ?? "09XX XXX XXXX");
    } catch (err) {
      console.error("Failed to fetch live weather:", err);
      setWeatherError(err instanceof Error ? err.message : "Failed to fetch weather");
    } finally {
      setWeatherLoading(false);
    }
  }, [prediction.crop, prediction.disease, user?.contactNumber, applyPrediction]);

  // Automatically pull live weather + a fresh prediction right after login.
  useEffect(() => {
    if (loggedIn) {
      refreshWeather();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  const simulateHighRiskSms = useCallback(() => {
    const copy = RISK_COPY.HIGH;
    const next: Prediction = {
      ...prediction,
      id: `pred-${Date.now()}`,
      date: new Date().toISOString(),
      riskPercentage: 78,
      riskLevel: "HIGH",
      reason: copy.reason,
      recommendedActions: copy.actions,
    };
    applyPrediction(next, user?.contactNumber ?? "09XX XXX XXXX");
  }, [prediction, user?.contactNumber, applyPrediction]);

  const resetDemoData = useCallback(() => {
    storage.resetDemoData();
    setWeather(storage.getWeather());
    setPrediction(storage.getPrediction());
    setHistory(storage.getHistory());
    setNotifications(storage.getNotifications());
    setLastSms(null);
  }, []);

  const clearAppData = useCallback(() => {
    storage.clearAppData();
    setLoggedInState(false);
    setUser(storage.getUser());
    setWeather(storage.getWeather());
    setPrediction(storage.getPrediction());
    setHistory(storage.getHistory());
    setNotifications(storage.getNotifications());
    setNotificationSettingsState(storage.getNotificationSettings());
    setTestModeEnabledState(false);
    setLastSms(null);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      loggedIn,
      user,
      weather,
      prediction,
      history,
      notifications,
      notificationSettings,
      testModeEnabled,
      lastSms,
      online,
      dismissSms,
      login,
      logout,
      setNotificationSettings,
      markNotificationRead,
      toggleTestMode,
      simulateRisk,
      updateTestWeather,
      simulateHighRiskSms,
      resetDemoData,
      clearAppData,
      refreshWeather,
      weatherLoading,
      weatherError,
    }),
    [
      loggedIn,
      user,
      weather,
      prediction,
      history,
      notifications,
      notificationSettings,
      testModeEnabled,
      lastSms,
      online,
      dismissSms,
      login,
      logout,
      setNotificationSettings,
      markNotificationRead,
      toggleTestMode,
      simulateRisk,
      updateTestWeather,
      simulateHighRiskSms,
      resetDemoData,
      clearAppData,
      refreshWeather,
      weatherLoading,
      weatherError,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}