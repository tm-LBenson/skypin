import type { HourlyWeather } from "../types/weather";

type Props = {
  hourly: HourlyWeather[];
  onClose: () => void;
};

function getCurrentHourTime() {
  const currentHour = new Date();
  currentHour.setMinutes(0, 0, 0);
  return currentHour.getTime();
}

function getNextTwelveHours(hourly: HourlyWeather[]) {
  const currentHourTime = getCurrentHourTime();
  const startIndex = hourly.findIndex((hour) => new Date(hour.time).getTime() >= currentHourTime);

  if (startIndex === -1) {
    return hourly.slice(0, 12);
  }

  return hourly.slice(startIndex, startIndex + 12);
}

export function HourlyPopover({ hourly, onClose }: Props) {
  const nextHours = getNextTwelveHours(hourly);

  return (
    <div className="popover expanded-popover">
      <div className="popover-header">
        <strong>Next 12 hours</strong>
        <button onClick={onClose}>x</button>
      </div>

      <div className="hourly-list">
        {nextHours.map((hour) => (
          <div className="hour-row" key={hour.time}>
            <span>{new Date(hour.time).toLocaleTimeString([], { hour: "numeric" })}</span>
            <span>{Math.round(hour.temperature)}°</span>
            <span>{hour.precipitationProbability}% rain</span>
          </div>
        ))}
      </div>
    </div>
  );
}
