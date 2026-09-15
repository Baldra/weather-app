export const TEMP_UNITS = ['metric', 'imperial'] as const
export type TemperatureUnit = typeof TEMP_UNITS[number]

export interface Country {
  code: string
  name: string
}

export type GeoCoordinates = {
  lat: number
  lon: number
}

export type WeatherCondition = {
  id: number
  main: string
  description: string
  icon: string
}

export type WeatherApiResponse = {
  name: string
  coord: {
    lat: number
    lon: number
  }
  sys: {
    country: string
  }
  main: {
    temp: number
    feels_like: number
    humidity: number
  }
  weather: WeatherCondition[]
  wind: {
    speed: number
  }
  timezone?: number
  dt: number
}

export type ForecastEntry = {
  dt: number
  main: {
    temp: number
    temp_min: number
    temp_max: number
  }
  weather: WeatherCondition[]
}

export type ForecastApiResponse = {
  city: {
    name: string
    country: string
  }
  list: ForecastEntry[]
}

export type ForecastDay = {
  key: string
  label: string
  tempHigh: number
  tempLow: number
  icon: string
  condition: string
}
