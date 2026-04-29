import type { LocationSearchResult, SavedLocation, WeatherForecast } from "../types/weather";

type OpenMeteoResponse = {
  current: {
    time: string;
    temperature_2m: number;
    weather_code: number;
    precipitation: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    weather_code: number[];
  };
};

export async function getWeather(location: SavedLocation, temperatureUnit: "fahrenheit" | "celsius"): Promise<WeatherForecast> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: "temperature_2m,weather_code,precipitation,is_day",
    hourly: "temperature_2m,precipitation_probability,precipitation,weather_code",
    daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code",
    temperature_unit: temperatureUnit,
    precipitation_unit: "inch",
    timezone: "auto",
    forecast_days: "7",
  });

  const response = await fetch(`${import.meta.env.VITE_OPEN_METEO_FORECAST_URL}?${params}`);

  if (!response.ok) {
    throw new Error("Weather request failed");
  }

  const data = (await response.json()) as OpenMeteoResponse;

  return {
    current: {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      weatherCode: data.current.weather_code,
      precipitation: data.current.precipitation,
      isDay: data.current.is_day === 1,
    },
    hourly: data.hourly.time.map((time, index) => ({
      time,
      temperature: data.hourly.temperature_2m[index],
      precipitationProbability: data.hourly.precipitation_probability[index],
      precipitation: data.hourly.precipitation[index],
      weatherCode: data.hourly.weather_code[index],
    })),
    daily: data.daily.time.map((date, index) => ({
      date,
      high: data.daily.temperature_2m_max[index],
      low: data.daily.temperature_2m_min[index],
      precipitationProbability: data.daily.precipitation_probability_max[index],
      weatherCode: data.daily.weather_code[index],
    })),
  };
}

export async function searchLocations(searchText: string): Promise<LocationSearchResult[]> {
  const params = new URLSearchParams({
    name: searchText,
    count: "6",
    language: "en",
    format: "json",
  });

  const response = await fetch(`${import.meta.env.VITE_OPEN_METEO_GEOCODING_URL}?${params}`);

  if (!response.ok) {
    throw new Error("Location search failed");
  }

  const data = await response.json();

  return data.results || [];
}
