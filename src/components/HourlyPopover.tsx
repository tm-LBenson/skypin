import type { HourlyWeather } from "../types/weather";

type Props = {
  hourly: HourlyWeather[];
  onClose: () => void;
};

export function HourlyPopover({ hourly, onClose }: Props) {
  return (
    <div className="popover">
      <div className="popover-header">
        <strong>Next 12 hours</strong>
        <button onClick={onClose}>x</button>
      </div>

      <div className="hourly-list">
        {hourly.slice(0, 12).map((hour) => (
          <div
            className="hour-row"
            key={hour.time}
          >
            <span>{new Date(hour.time).toLocaleTimeString([], { hour: "numeric" })}</span>
            <span>{Math.round(hour.temperature)}°</span>
            <span>{hour.precipitationProbability}% rain</span>
          </div>
        ))}
      </div>
    </div>
  );
}
