const rainyCodes = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]);
const snowyCodes = new Set([71, 73, 75, 77, 85, 86]);
const fogCodes = new Set([45, 48]);
const cloudyCodes = new Set([1, 2, 3]);

export function getWeatherIconName(weatherCode: number) {
  if (rainyCodes.has(weatherCode)) return "rain";
  if (snowyCodes.has(weatherCode)) return "snow";
  if (fogCodes.has(weatherCode)) return "fog";
  if (cloudyCodes.has(weatherCode)) return "cloudy";
  return "clear";
}

export function getWeatherLabel(weatherCode: number) {
  if (rainyCodes.has(weatherCode)) return "Rain";
  if (snowyCodes.has(weatherCode)) return "Snow";
  if (fogCodes.has(weatherCode)) return "Fog";
  if (cloudyCodes.has(weatherCode)) return "Cloudy";
  return "Clear";
}
