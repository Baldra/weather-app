import type { WeatherApiResponse } from '../types/weather'

type SkyTone = string

const CLEAR_DAY = 'from-[#2e6fa3] to-[#5f94bd]'
const CLEAR_NIGHT = 'from-[#233f63] to-[#40597e]'
const CLOUDS_DAY = 'from-[#5c7a93] to-[#86a0b5]'
const CLOUDS_NIGHT = 'from-[#303e55] to-[#485a73]'
const RAIN_DAY = 'from-[#4a6279] to-[#6e859a]'
const RAIN_NIGHT = 'from-[#222e3e] to-[#37465a]'
const STORM_DAY = 'from-[#3d4665] to-[#5b5073]'
const STORM_NIGHT = 'from-[#161c2c] to-[#2b2740]'
const SNOW_DAY = 'from-[#6e8a9f] to-[#94a9ba]'
const SNOW_NIGHT = 'from-[#335069] to-[#4e6b84]'
const HAZE = 'from-[#6e7f8e] to-[#93a2b0]'
const NEUTRAL = 'from-[#3f7181] to-[#6f9cab]'

const SKY_BY_CONDITION: Record<string, { day: SkyTone; night: SkyTone }> = {
  Clear: { day: CLEAR_DAY, night: CLEAR_NIGHT },
  Clouds: { day: CLOUDS_DAY, night: CLOUDS_NIGHT },
  Rain: { day: RAIN_DAY, night: RAIN_NIGHT },
  Drizzle: { day: RAIN_DAY, night: RAIN_NIGHT },
  Thunderstorm: { day: STORM_DAY, night: STORM_NIGHT },
  Squall: { day: STORM_DAY, night: STORM_NIGHT },
  Tornado: { day: STORM_DAY, night: STORM_NIGHT },
  Snow: { day: SNOW_DAY, night: SNOW_NIGHT },
  Fog: { day: HAZE, night: HAZE },
  Mist: { day: HAZE, night: HAZE },
  Haze: { day: HAZE, night: HAZE },
  Smoke: { day: HAZE, night: HAZE },
  Dust: { day: HAZE, night: HAZE },
  Sand: { day: HAZE, night: HAZE },
  Ash: { day: HAZE, night: HAZE },
}

export function getLocalHour(weather: Pick<WeatherApiResponse, 'dt' | 'timezone'>): number {
  const offsetSeconds = weather.timezone ?? 0
  return new Date((weather.dt + offsetSeconds) * 1000).getUTCHours()
}

export function skyToneFor(main: string | undefined, hour: number): SkyTone {
  const tone = main != null ? SKY_BY_CONDITION[main] : undefined
  if (!tone) {
    return NEUTRAL
  }
  const isNight = hour < 6 || hour >= 20
  return isNight ? tone.night : tone.day
}