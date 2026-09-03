import { useRef, useState } from 'react'
import type { FormEvent } from 'react'

import { fetchWeather } from '../services/weatherApi'
import type { WeatherApiResponse } from '../types/weather'

const REQUEST_DELAY_MS = 1200

export function useWeather() {
  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState<WeatherApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const lastRequestTimeRef = useRef(0)

  const waitForRateLimit = async (): Promise<void> => {
    const elapsed = Date.now() - lastRequestTimeRef.current

    if (elapsed < REQUEST_DELAY_MS) {
      await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS - elapsed))
    }

    lastRequestTimeRef.current = Date.now()
  }

  const handleSearch = async (event?: FormEvent<HTMLFormElement>): Promise<void> => {
    event?.preventDefault()

    const trimmedQuery = query.trim()
    setError('')

    if (!trimmedQuery) {
      setError('Please enter a city name or ZIP code.')
      return
    }

    try {
      setIsLoading(true)
      await waitForRateLimit()
      const result = await fetchWeather(trimmedQuery)
      setWeather(result)
    } catch (searchError) {
      const message =
        searchError instanceof Error
          ? searchError.message
          : 'Something went wrong while fetching the weather.'
      setError(message)
      setWeather(null)
    } finally {
      setIsLoading(false)
    }
  }

  return { query, setQuery, weather, isLoading, error, handleSearch }
}
