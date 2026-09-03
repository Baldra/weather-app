export type TemperatureUnit = 'metric' | 'imperial'

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
