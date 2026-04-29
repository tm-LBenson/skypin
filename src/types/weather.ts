export type SavedLocation = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export type AppSettings = {
  activeLocationId: string;
  locations: SavedLocation[];
  refreshMinutes: number;
  temperatureUnit: "fahrenheit" | "celsius";
};

export type CurrentWeather = {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitation: number;
  isDay: boolean;
};

export type HourlyWeather = {
  time: string;
  temperature: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
};

export type DailyWeather = {
  date: string;
  high: number;
  low: number;
  precipitationProbability: number;
  weatherCode: number;
};

export type WeatherForecast = {
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
};

export type LocationSearchResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
};
