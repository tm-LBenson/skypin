import { WeatherIcon } from "./WeatherIcon";
import type { DailyWeather } from "../types/weather";

type Props = {
  daily: DailyWeather[];
  onClose: () => void;
};

export function WeeklyForecastModal({ daily, onClose }: Props) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <strong>7 day forecast</strong>
          <button onClick={onClose}>x</button>
        </div>

        <div className="daily-list">
          {daily.map((day) => (
            <div
              className="daily-row"
              key={day.date}
            >
              <span>{new Date(`${day.date}T12:00:00`).toLocaleDateString([], { weekday: "short" })}</span>
              <WeatherIcon weatherCode={day.weatherCode} />
              <span>H {Math.round(day.high)}°</span>
              <span>L {Math.round(day.low)}°</span>
              <span>{day.precipitationProbability}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
