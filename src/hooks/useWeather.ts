import { useEffect, useState } from "react";
import { getWeather } from "../lib/openMeteo";
import type { SavedLocation, WeatherForecast } from "../types/weather";

export function useWeather(location: SavedLocation, refreshMinutes: number, temperatureUnit: "fahrenheit" | "celsius") {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function refreshWeather() {
    try {
      setErrorMessage("");
      const nextForecast = await getWeather(location, temperatureUnit);
      setForecast(nextForecast);
    } catch {
      setErrorMessage("Could not load weather");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    refreshWeather();

    const refreshInterval = window.setInterval(refreshWeather, refreshMinutes * 60 * 1000);

    return () => window.clearInterval(refreshInterval);
  }, [location.id, refreshMinutes, temperatureUnit]);

  return { forecast, isLoading, errorMessage, refreshWeather };
}
