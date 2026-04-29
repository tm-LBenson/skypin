import { Cloud, CloudFog, CloudRain, CloudSnow, Sun } from "lucide-react";
import { getWeatherIconName } from "../lib/weatherCodes";

type Props = {
  weatherCode: number;
};

export function WeatherIcon({ weatherCode }: Props) {
  const iconName = getWeatherIconName(weatherCode);

  if (iconName === "rain") return <CloudRain size={42} />;
  if (iconName === "snow") return <CloudSnow size={42} />;
  if (iconName === "fog") return <CloudFog size={42} />;
  if (iconName === "cloudy") return <Cloud size={42} />;

  return <Sun size={42} />;
}
