import type { TemperatureUnit } from '../types/weather'

export const convertCelsiusToFahrenheit = (celsius: number): number =>
  (celsius * 9) / 5 + 32

export const convertWindSpeedToMph = (speedKmh: number): number => speedKmh * 0.621371

export const getWeatherIconUrl = (iconCode: string): string =>
  `https://openweathermap.org/img/wn/${iconCode}@2x.png`

export const formatTemperature = (temperature: number, unit: TemperatureUnit): string =>
  unit === 'metric'
    ? `${Math.round(temperature)}°C`
    : `${Math.round(convertCelsiusToFahrenheit(temperature))}°F`

export const formatWindSpeed = (speedKmh: number, unit: TemperatureUnit): string =>
  unit === 'metric'
    ? `${Math.round(speedKmh)} km/h`
    : `${Math.round(convertWindSpeedToMph(speedKmh))} mph`
