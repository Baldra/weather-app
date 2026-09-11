import { useEffect, useRef, useState } from 'react'
import type { GeocodedPlace } from '../services/weatherApi'

import { searchCities } from '../services/weatherApi'

export function useCities() {
  const [citySuggestions, setCitySuggestions] = useState<GeocodedPlace[]>([])
  const [isSearchingCities, setIsSearchingCities] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestIdRef = useRef(0)

  useEffect(() => {
    return () => {
      requestIdRef.current += 1
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const debouncedSearchCities = (query: string, countryCode?: string): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const requestId = ++requestIdRef.current

    if (query.trim().length < 3 || !countryCode) {
      setCitySuggestions([])
      setIsSearchingCities(false)
      return
    }

    setIsSearchingCities(true)
    timeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchCities(query, countryCode)
        if (requestId === requestIdRef.current) {
          setCitySuggestions(results)
        }
      } catch {
        if (requestId === requestIdRef.current) {
          setCitySuggestions([])
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsSearchingCities(false)
        }
      }
    }, 400)
  }

  const handleCityQueryChange = (value: string, countryCode?: string): void => {
    debouncedSearchCities(value, countryCode)
  }

  const selectCity = (): void => {
    setCitySuggestions([])
  }

  return {
    citySuggestions,
    isSearchingCities,
    handleCityQueryChange,
    selectCity,
  }
}
