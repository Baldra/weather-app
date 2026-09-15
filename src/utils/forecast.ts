import type { ForecastApiResponse, ForecastDay, WeatherCondition } from '../types/weather'

function toDayKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function dayLabel(key: string): string {
  const [year, month, day] = key.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const today = new Date()
  const todayKey = toDayKey(today)

  if (key === todayKey) {
    return 'Today'
  }

  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

type DayAccumulator = {
  low: number
  high: number
  condition: WeatherCondition | null
  representativeHour: number
}

export function groupForecastByDay(forecast: ForecastApiResponse): ForecastDay[] {
  const byDay = new Map<string, DayAccumulator>()

  for (const entry of forecast.list) {
    const date = new Date(entry.dt * 1000)
    const key = toDayKey(date)
    const hour = date.getHours()
    const condition = entry.weather[0] ?? null
    const existing = byDay.get(key)

    if (!existing) {
      byDay.set(key, {
        low: entry.main.temp_min,
        high: entry.main.temp_max,
        condition,
        representativeHour: hour,
      })
      continue
    }

    existing.low = Math.min(existing.low, entry.main.temp_min)
    existing.high = Math.max(existing.high, entry.main.temp_max)
    if (Math.abs(hour - 13) < Math.abs(existing.representativeHour - 13)) {
      existing.representativeHour = hour
      existing.condition = condition
    }
  }

  return Array.from(byDay.entries())
    .slice(0, 5)
    .map(([key, day]) => ({
      key,
      label: dayLabel(key),
      tempHigh: day.high,
      tempLow: day.low,
      icon: day.condition?.icon ?? '02d',
      condition: day.condition?.description ?? 'Unavailable',
    }))
}