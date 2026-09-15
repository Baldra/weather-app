import type { ForecastDay, TemperatureUnit } from '../types/weather'
import { formatTemperature, getWeatherIconUrl } from '../utils/weather'

type ForecastSectionProps = {
  days: ForecastDay[]
  temperatureUnit: TemperatureUnit
  error: string
}

export function ForecastSection({ days, temperatureUnit, error }: ForecastSectionProps) {
  if (days.length === 0 && !error) {
    return null
  }

  return (
    <section
      aria-label="5-day forecast"
      className="rounded-2xl border border-haze bg-paper p-4 sm:p-5"
    >
      <h2 className="text-sm font-semibold text-soft">5-day forecast</h2>

      {error ? (
        <p role="status" className="mt-3 text-sm text-soft">
          {error}
        </p>
      ) : (
        <ol className="mt-2 grid grid-cols-5 gap-1">
          {days.map((day) => {
            const high = formatTemperature(day.tempHigh, temperatureUnit)
            const low = formatTemperature(day.tempLow, temperatureUnit)
            const label = `${day.label}: ${day.condition}, high ${high}, low ${low}`

            return (
              <li
                key={day.key}
                aria-label={label}
                className="flex min-w-0 flex-col items-center rounded-xl px-1 py-2 text-center"
              >
                <p className="text-xs font-medium text-soft">{day.label}</p>
                <img
                  src={getWeatherIconUrl(day.icon)}
                  alt=""
                  className="my-1.5 h-10 w-10 sm:h-12 sm:w-12"
                />
                <p className="text-sm font-semibold">{high}</p>
                <p className="text-xs text-fog">{low}</p>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}