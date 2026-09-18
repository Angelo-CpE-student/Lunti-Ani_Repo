import type {
  User,
  WeatherData,
  Prediction,
  AppNotification,
  NotificationSettings,
} from "../data/types";
import { DEMO_WEATHER } from "../data/weather";
import { DEMO_PREDICTION, DEMO_HISTORY } from "../data/predictions";
import { DEMO_NOTIFICATIONS, DEFAULT_NOTIFICATION_SETTINGS } from "../data/notifications";
import { DEMO_USER } from "../data/users";

/**
 * All LuntiAni application state lives here, in memory only.
 * This is a frontend-only prototype: no localStorage, sessionStorage, or
 * backend is used, and nothing survives a page refresh. Every value starts
 * from the mock data in `src/data/`. Swapping this for a real backend later
 * only means editing this one module.
 */

interface AppState {
  user: User;
  loggedIn: boolean;
  weather: WeatherData;
  prediction: Prediction;
  history: Prediction[];
  notifications: AppNotification[];
  notificationSettings: NotificationSettings;
  testMode: boolean;
}

function initialState(): AppState {
  return {
    user: DEMO_USER,
    loggedIn: false,
    weather: DEMO_WEATHER,
    prediction: DEMO_PREDICTION,
    history: DEMO_HISTORY,
    notifications: DEMO_NOTIFICATIONS,
    notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
    testMode: false,
  };
}

let state: AppState = initialState();

// ---- User / auth ----

export function getUser(): User | null {
  return state.user;
}

export function saveUser(user: User): void {
  state.user = user;
}

export function updateUser(patch: Partial<User>): User | null {
  state.user = { ...state.user, ...patch };
  return state.user;
}

export function isLoggedIn(): boolean {
  return state.loggedIn;
}

export function setLoggedIn(value: boolean): void {
  state.loggedIn = value;
}

// ---- Weather ----

export function getWeather(): WeatherData {
  return state.weather;
}

export function saveWeather(weather: WeatherData): void {
  state.weather = weather;
}

// ---- Current prediction ----

export function getPrediction(): Prediction {
  return state.prediction;
}

export function savePrediction(prediction: Prediction): void {
  state.prediction = prediction;
}

// ---- History ----

export function getHistory(): Prediction[] {
  return state.history;
}

export function saveHistory(history: Prediction[]): void {
  state.history = history;
}

export function addToHistory(prediction: Prediction): Prediction[] {
  state.history = [prediction, ...state.history].slice(0, 30);
  return state.history;
}

// ---- Notifications ----

export function getNotifications(): AppNotification[] {
  return state.notifications;
}

export function saveNotifications(notifications: AppNotification[]): void {
  state.notifications = notifications;
}

export function addNotification(notification: AppNotification): AppNotification[] {
  state.notifications = [notification, ...state.notifications].slice(0, 50);
  return state.notifications;
}

export function getNotificationSettings(): NotificationSettings {
  return state.notificationSettings;
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  state.notificationSettings = settings;
}

// ---- Developer / test mode ----

export function isTestModeEnabled(): boolean {
  return state.testMode;
}

export function setTestModeEnabled(value: boolean): void {
  state.testMode = value;
}

// ---- Reset / clear ----

export function resetDemoData(): void {
  state.weather = DEMO_WEATHER;
  state.prediction = DEMO_PREDICTION;
  state.history = DEMO_HISTORY;
  state.notifications = DEMO_NOTIFICATIONS;
}

export function clearAppData(): void {
  state = initialState();
}
