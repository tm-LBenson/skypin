import { useState } from "react";
import { loadSettings } from "./lib/settings";
import { WeatherWidget } from "./components/WeatherWidget";
import type { AppSettings } from "./types/weather";

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  return (
    <WeatherWidget
      settings={settings}
      onSettingsChange={setSettings}
    />
  );
}
