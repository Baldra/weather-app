import type { WeatherApiResponse } from '../types/weather'

const OPENWEATHER_API_KEY =
  import.meta.env.VITE_OPENWEATHER_API_KEY ?? 'YOUR_OPENWEATHER_API_KEY'
const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

export async function fetchWeather(location: string): Promise<WeatherApiResponse> {
  const trimmedLocation = location.trim()

  if (!trimmedLocation) {
    throw new Error('Please enter a city name or ZIP code.')
  }

  if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
    throw new Error(
      'Missing OpenWeather API key. Add VITE_OPENWEATHER_API_KEY to your .env file.'
    )
  }

  const endpoint = `${WEATHER_API_BASE_URL}?q=${encodeURIComponent(trimmedLocation)}&appid=${OPENWEATHER_API_KEY}&units=metric`
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Location not found. Please try a different city or ZIP code.')
    }

    const detail = await response.text()
    throw new Error(
      `Weather request failed (${response.status}). ${detail || 'Please try again later.'}`
    )
  }

  return (await response.json()) as WeatherApiResponse
}
