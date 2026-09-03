import type { TemperatureUnit, WeatherApiResponse } from '../types/weather'
import {
  formatTemperature,
  formatWindSpeed,
  getWeatherIconUrl,
} from '../utils/weather'

type WeatherCardProps = {
  weather: WeatherApiResponse
  temperatureUnit: TemperatureUnit
}

export function WeatherCard({ weather, temperatureUnit }: WeatherCardProps) {
  const condition = weather.weather[0]

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200">
      <div className="bg-linear-to-r from-sky-600 via-cyan-500 to-indigo-500 px-6 py-8 text-white sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-100">Weather</p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
              {weather.name}, {weather.sys.country}
            </h2>
          </div>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
            <img
              src={getWeatherIconUrl(condition?.icon ?? '02d')}
              alt={condition?.description ?? 'Weather icon'}
              className="h-16 w-16"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6 sm:px-8">
        <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Now</p>
            <p className="mt-2 text-5xl font-bold text-slate-900">
              {formatTemperature(weather.main.temp, temperatureUnit)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Condition</p>
            <p className="mt-2 capitalize text-lg font-medium text-slate-700">
              {condition?.description ?? 'Unavailable'}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <WeatherMetric label="Humidity" value={`${weather.main.humidity}%`} />
          <WeatherMetric
            label="Wind"
            value={formatWindSpeed(weather.wind.speed, temperatureUnit)}
          />
          <WeatherMetric
            label="Feels like"
            value={formatTemperature(weather.main.feels_like, temperatureUnit)}
          />
        </div>
      </div>
    </div>
  )
}

type WeatherMetricProps = {
  label: string
  value: string
}

function WeatherMetric({ label, value }: WeatherMetricProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 shadow-sm ring-1 ring-slate-200">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-800">{value}</p>
    </div>
  )
}
