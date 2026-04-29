import { CalendarDays, Clock3, EyeOff, RefreshCw, Settings } from "lucide-react";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import { getWeatherLabel } from "../lib/weatherCodes";
import { saveSettings } from "../lib/settings";
import { useWeather } from "../hooks/useWeather";
import { HourlyPopover } from "./HourlyPopover";
import { SettingsModal } from "./SettingsModal";
import { WeatherIcon } from "./WeatherIcon";
import { WeeklyForecastModal } from "./WeeklyForecastModal";
import type { AppSettings } from "../types/weather";

type Props = {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
};

const compactSize = new LogicalSize(310, 190);
const hourlySize = new LogicalSize(340, 620);
const weeklySize = new LogicalSize(380, 470);
const settingsSize = new LogicalSize(430, 700);

export function WeatherWidget({ settings, onSettingsChange }: Props) {
  const [isHourlyOpen, setIsHourlyOpen] = useState(false);
  const [isWeeklyOpen, setIsWeeklyOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const activeLocation = settings.locations.find((location) => location.id === settings.activeLocationId) || settings.locations[0];
  const { forecast, isLoading, errorMessage, refreshWeather } = useWeather(activeLocation, settings.refreshMinutes, settings.temperatureUnit);
  const today = forecast?.daily[0];

  async function resizeWindow(size: LogicalSize) {
    try {
      await getCurrentWindow().setSize(size);
    } catch (error) {
      console.error("Could not resize SkyPin window", error);
    }
  }

  useEffect(() => {
    if (isSettingsOpen) {
      resizeWindow(settingsSize);
      return;
    }

    if (isHourlyOpen) {
      resizeWindow(hourlySize);
      return;
    }

    if (isWeeklyOpen) {
      resizeWindow(weeklySize);
      return;
    }

    resizeWindow(compactSize);
  }, [isHourlyOpen, isWeeklyOpen, isSettingsOpen]);

  function openHourly() {
    setIsWeeklyOpen(false);
    setIsSettingsOpen(false);
    setIsHourlyOpen(true);
  }

  function openWeekly() {
    setIsHourlyOpen(false);
    setIsSettingsOpen(false);
    setIsWeeklyOpen(true);
  }

  function openSettings() {
    setIsHourlyOpen(false);
    setIsWeeklyOpen(false);
    setIsSettingsOpen(true);
  }

  function closeExpandedView() {
    setIsHourlyOpen(false);
    setIsWeeklyOpen(false);
    setIsSettingsOpen(false);
  }

  function handleSettingsSave(nextSettings: AppSettings) {
    saveSettings(nextSettings);
    onSettingsChange(nextSettings);
  }

  async function hideWindow() {
    await getCurrentWindow().hide();
  }

  if (isLoading) {
    return <div className="widget">Loading SkyPin...</div>;
  }

  if (errorMessage || !forecast || !today) {
    return (
      <div className="widget">
        <div className="widget-header">
          <strong>SkyPin</strong>
          <button onClick={refreshWeather}><RefreshCw size={16} /></button>
        </div>
        <p>{errorMessage || "No weather data"}</p>
      </div>
    );
  }

  return (
    <div className="widget">
      <div className="widget-header">
        <button className="location-name" onClick={openSettings}>{activeLocation.name}</button>
        <div className="drag-handle" data-tauri-drag-region />
        <button onClick={hideWindow}><EyeOff size={16} /></button>
        <button onClick={openSettings}><Settings size={16} /></button>
      </div>

      <div className="current-weather">
        <div>
          <div className="temperature">{Math.round(forecast.current.temperature)}°</div>
          <div className="condition">{getWeatherLabel(forecast.current.weatherCode)}</div>
        </div>
        <WeatherIcon weatherCode={forecast.current.weatherCode} />
      </div>

      <div className="summary-row">
        <span>H {Math.round(today.high)}°</span>
        <span>L {Math.round(today.low)}°</span>
        <span>{today.precipitationProbability}% rain</span>
      </div>

      <div className="actions-row">
        <button onClick={openHourly}><Clock3 size={15} /> Hourly</button>
        <button onClick={openWeekly}><CalendarDays size={15} /> Week</button>
        <button onClick={refreshWeather}><RefreshCw size={15} /> Refresh</button>
      </div>

      {isHourlyOpen && <HourlyPopover hourly={forecast.hourly} onClose={closeExpandedView} />}
      {isWeeklyOpen && <WeeklyForecastModal daily={forecast.daily} onClose={closeExpandedView} />}
      {isSettingsOpen && <SettingsModal settings={settings} onSave={handleSettingsSave} onClose={closeExpandedView} />}
    </div>
  );
}
