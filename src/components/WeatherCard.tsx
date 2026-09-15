import type { TemperatureUnit, WeatherApiResponse } from '../types/weather'
import { getLocalHour, skyToneFor } from '../utils/sky'
import {
  formatTemperature,
  formatWindSpeed,
  getWeatherIconUrl,
} from '../utils/weather'

type WeatherCardProps = {
  weather: WeatherApiResponse
  temperatureUnit: TemperatureUnit
  isFavourite: boolean
  onToggleFavourite: () => void
}

export function WeatherCard({
  weather,
  temperatureUnit,
  isFavourite,
  onToggleFavourite,
}: WeatherCardProps) {
  const condition = weather.weather[0]
  const skyTone = skyToneFor(condition?.main, getLocalHour(weather))

  return (
    <article
      className={`weather-rise overflow-hidden rounded-2xl bg-linear-to-br text-white ${skyTone}`}
    >
      <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-7 sm:pt-7">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight [overflow-wrap:anywhere] sm:text-3xl">
            {weather.name}
          </h2>
          <p className="mt-0.5 text-sm text-white/75">{weather.sys.country}</p>
        </div>
        <button
          type="button"
          onClick={onToggleFavourite}
          aria-pressed={isFavourite}
          aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
        >
          <Star filled={isFavourite} />
        </button>
      </div>

      <div className="px-5 pb-6 sm:px-7 sm:pb-7">
        <div className="flex items-end justify-between gap-4">
          <p aria-live="polite" className="font-display text-[clamp(4rem,22vw,8rem)] font-light leading-[0.9] tracking-tight tabular-nums">
            {formatTemperature(weather.main.temp, temperatureUnit)}
          </p>
          {condition ? (
            <img
              src={getWeatherIconUrl(condition.icon)}
              alt=""
              className="h-16 w-16 shrink-0 rounded-full bg-white/10 p-1.5 sm:h-20 sm:w-20"
            />
          ) : null}
        </div>

        <p className="mt-2 text-lg capitalize text-white/90">
          {condition?.description ?? 'Conditions unavailable'}
        </p>

        <dl className="mt-6 grid grid-cols-3 divide-x divide-white/15 rounded-xl bg-white/10">
          <WeatherMetric label="Feels like" value={formatTemperature(weather.main.feels_like, temperatureUnit)} />
          <WeatherMetric label="Wind" value={formatWindSpeed(weather.wind.speed, temperatureUnit)} />
          <WeatherMetric label="Humidity" value={`${weather.main.humidity}%`} />
        </dl>
      </div>
    </article>
  )
}

function WeatherMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 px-3 py-3 first:pl-4 last:pr-4">
      <dt className="truncate text-[0.7rem] font-medium text-white/70">{label}</dt>
      <dd className="mt-0.5 truncate text-base font-semibold">{value}</dd>
    </div>
  )
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill={filled ? 'var(--color-sun)' : 'none'}
      stroke={filled ? 'var(--color-sun)' : 'currentColor'}
      strokeWidth="1.8"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2.9l2.9 5.8 6.4.95-4.6 4.5 1.1 6.4L12 17.2l-5.8 3.05 1.1-6.4-4.6-4.5 6.4-.95z" />
    </svg>
  )
}