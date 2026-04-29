import type { AppSettings, SavedLocation } from "../types/weather";

const storageKey = "skypin-settings";

export const defaultLocation: SavedLocation = {
  id: "default",
  name: import.meta.env.VITE_DEFAULT_LOCATION_NAME || "Altoona, PA",
  latitude: Number(import.meta.env.VITE_DEFAULT_LATITUDE || 40.5187),
  longitude: Number(import.meta.env.VITE_DEFAULT_LONGITUDE || -78.3947),
};

export const defaultSettings: AppSettings = {
  activeLocationId: defaultLocation.id,
  locations: [defaultLocation],
  refreshMinutes: Number(import.meta.env.VITE_REFRESH_MINUTES || 15),
  temperatureUnit: "fahrenheit",
};

export function loadSettings(): AppSettings {
  const savedSettings = localStorage.getItem(storageKey);

  if (!savedSettings) {
    return defaultSettings;
  }

  try {
    return JSON.parse(savedSettings);
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(storageKey, JSON.stringify(settings));
}
