import type { ForecastApiResponse, WeatherApiResponse } from '../types/weather'

const OPENWEATHER_API_KEY =
  import.meta.env.VITE_OPENWEATHER_API_KEY ?? 'YOUR_OPENWEATHER_API_KEY'
const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_API_BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast'
const GEOCODING_API_BASE_URL = 'https://api.openweathermap.org/geo/1.0'

export type GeocodedPlace = {
  name: string
  state?: string
  country: string
  lat: number
  lon: number
}

function assertApiKey(): void {
  if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
    throw new Error(
      'Missing OpenWeather API key. Add VITE_OPENWEATHER_API_KEY to your .env file.'
    )
  }
}

async function getWeather(endpoint: string): Promise<WeatherApiResponse> {
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

async function getJson<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(
      `Request failed (${response.status}). ${detail || 'Please try again later.'}`
    )
  }

  return (await response.json()) as T
}

export async function fetchWeather(location: string): Promise<WeatherApiResponse> {
  const trimmedLocation = location.trim()

  if (!trimmedLocation) {
    throw new Error('Please enter a city name or ZIP code.')
  }

  assertApiKey()

  const endpoint = `${WEATHER_API_BASE_URL}?q=${encodeURIComponent(trimmedLocation)}&appid=${OPENWEATHER_API_KEY}&units=metric`
  return getWeather(endpoint)
}

export async function fetchWeatherByLocation(
  city: string,
  countryCode: string
): Promise<WeatherApiResponse> {
  const trimmedCity = city.trim()
  const trimmedCountry = countryCode.trim().toUpperCase()

  if (!trimmedCity || !trimmedCountry) {
    throw new Error('Please select both a country and a city.')
  }

  assertApiKey()

  const query = `${trimmedCity},${trimmedCountry}`
  const endpoint = `${WEATHER_API_BASE_URL}?q=${encodeURIComponent(query)}&appid=${OPENWEATHER_API_KEY}&units=metric`
  return getWeather(endpoint)
}

export async function fetchWeatherByCoordinates(
  lat: number,
  lon: number
): Promise<WeatherApiResponse> {
  assertApiKey()

  const endpoint = `${WEATHER_API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
  return getWeather(endpoint)
}

export async function fetchForecast(
  lat: number,
  lon: number
): Promise<ForecastApiResponse> {
  assertApiKey()

  const endpoint = `${FORECAST_API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
  return getJson<ForecastApiResponse>(endpoint)
}

export async function searchCities(
  query: string,
  countryCode: string
): Promise<GeocodedPlace[]> {
  assertApiKey()

  const q = encodeURIComponent(
    countryCode ? `${query},${countryCode}` : query
  )
  const endpoint = `${GEOCODING_API_BASE_URL}/direct?q=${q}&limit=8&appid=${OPENWEATHER_API_KEY}`
  return getJson<GeocodedPlace[]>(endpoint)
}

export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<GeocodedPlace | null> {
  assertApiKey()

  const endpoint = `${GEOCODING_API_BASE_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`
  const places = await getJson<GeocodedPlace[]>(endpoint)
  return places[0] ?? null
}