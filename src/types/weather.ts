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
  dt: number
}
