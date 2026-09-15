import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

import { fetchCountries } from '../services/countriesApi'
import {
  fetchForecast,
  fetchWeather,
  fetchWeatherByCoordinates,
  fetchWeatherByLocation,
  reverseGeocode,
  searchCities,
  type GeocodedPlace,
} from '../services/weatherApi'
import type { Country, ForecastDay, WeatherApiResponse } from '../types/weather'
import {
  isFavourite,
  loadFavourites,
  removeFavourite,
  saveFavourites,
  toggleFavourite,
  type FavouriteLocation,
} from '../utils/favourites'
import { groupForecastByDay } from '../utils/forecast'

const REQUEST_DELAY_MS = 1200

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    })
  })
}

function getPositionErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return 'Location access was denied. Please allow location access and try again.'
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      return 'Your location is currently unavailable.'
    case GeolocationPositionError.TIMEOUT:
      return 'Timed out while retrieving your location.'
    default:
      return 'Unable to determine your location.'
  }
}

export type SearchMode = 'zipcode' | 'location'

export function useWeather() {
  const [searchMode, setSearchMode] = useState<SearchMode>('zipcode')
  const [query, setQuery] = useState('')

  const [countries, setCountries] = useState<Country[]>([])
  const [countriesError, setCountriesError] = useState('')
  const [selectedCountryCode, setSelectedCountryCode] = useState('')
  const [cityQuery, setCityQuery] = useState('')
  const [citySuggestions, setCitySuggestions] = useState<GeocodedPlace[]>([])
  const [selectedCity, setSelectedCity] = useState<GeocodedPlace | null>(null)
  const [isSearchingCities, setIsSearchingCities] = useState(false)

  const [weather, setWeather] = useState<WeatherApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [favourites, setFavourites] = useState<FavouriteLocation[]>(() => loadFavourites())
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [forecastError, setForecastError] = useState('')
  const lastRequestTimeRef = useRef(0)
  const skipCitySearchRef = useRef(false)

  useEffect(() => {
    let isMounted = true

    const loadCountries = async () => {
      try {
        const result = await fetchCountries()
        if (isMounted) {
          setCountries(result)
        }
      } catch (loadError) {
        if (isMounted) {
          setCountriesError(
            loadError instanceof Error
              ? loadError.message
              : 'Failed to load countries.'
          )
        }
      }
    }

    loadCountries()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (skipCitySearchRef.current) {
      skipCitySearchRef.current = false
      return
    }

    if (searchMode !== 'location') {
      return
    }

    const trimmed = cityQuery.trim()

    if (!selectedCountryCode || trimmed.length < 3) {
      return
    }

    let cancelled = false

    const timeoutId = setTimeout(async () => {
      setIsSearchingCities(true)
      try {
        const results = await searchCities(trimmed, selectedCountryCode)
        if (!cancelled) {
          setCitySuggestions(results)
        }
      } catch {
        if (!cancelled) {
          setCitySuggestions([])
        }
      } finally {
        if (!cancelled) {
          setIsSearchingCities(false)
        }
      }
    }, 400)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [cityQuery, selectedCountryCode, searchMode])

  useEffect(() => {
    saveFavourites(favourites)
  }, [favourites])

  const waitForRateLimit = async (): Promise<void> => {
    const elapsed = Date.now() - lastRequestTimeRef.current

    if (elapsed < REQUEST_DELAY_MS) {
      await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS - elapsed))
    }

    lastRequestTimeRef.current = Date.now()
  }

  const submitSearch = async (searchFn: () => Promise<WeatherApiResponse>): Promise<void> => {
    setError('')
    setForecast([])
    setForecastError('')

    try {
      setIsLoading(true)
      await waitForRateLimit()
      const result = await searchFn()
      setWeather(result)

      try {
        await waitForRateLimit()
        const forecastResult = await fetchForecast(result.coord.lat, result.coord.lon)
        setForecast(groupForecastByDay(forecastResult))
      } catch {
        setForecastError('Forecast is currently unavailable.')
      }
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

  const handleSearch = async (event?: FormEvent<HTMLFormElement>): Promise<void> => {
    event?.preventDefault()

    if (searchMode === 'location') {
      if (!selectedCity) {
        setError('Please select a city from the suggestions.')
        return
      }
      await submitSearch(() => fetchWeatherByLocation(selectedCity.name, selectedCity.country))
      return
    }

    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setError('Please enter a city name or ZIP code.')
      return
    }

    await submitSearch(() => fetchWeather(trimmedQuery))
  }

  const handleUseMyLocation = async (): Promise<void> => {
    setError('')
    setSearchMode('location')

    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    try {
      const position = await getCurrentPosition()
      const { latitude, longitude } = position.coords
      const place = await reverseGeocode(latitude, longitude)

      skipCitySearchRef.current = true
      if (place) {
        setSelectedCountryCode(place.country)
        setCityQuery(place.name)
        setSelectedCity(place)
      }

      await submitSearch(async () => {
        const weatherResult = await fetchWeatherByCoordinates(latitude, longitude)
        if (place) {
          weatherResult.name = place.name
        }
        return weatherResult
      })
    } catch (locationError) {
      setError(
        locationError instanceof GeolocationPositionError
          ? getPositionErrorMessage(locationError)
          : locationError instanceof Error
            ? locationError.message
            : 'Unable to determine your location.'
      )
    }
  }

  const handleSelectCity = (place: GeocodedPlace): void => {
    skipCitySearchRef.current = true
    setSelectedCity(place)
    setCityQuery(place.name)
    setCitySuggestions([])
  }

  const handleCountryChange = (code: string): void => {
    skipCitySearchRef.current = false
    setSelectedCountryCode(code)
    setCityQuery('')
    setSelectedCity(null)
    setCitySuggestions([])
    setIsSearchingCities(false)
  }

  const handleCityQueryChange = (value: string): void => {
    skipCitySearchRef.current = false
    setCityQuery(value)
    setSelectedCity(null)
    setCitySuggestions([])
  }

  const handleModeChange = (mode: SearchMode): void => {
    skipCitySearchRef.current = false
    setSearchMode(mode)
    setError('')
    setCitySuggestions([])
    setSelectedCity(null)
    setIsSearchingCities(false)
  }

  const favouriteLocation: FavouriteLocation | null =
    weather?.coord != null
      ? {
          name: weather.name,
          country: weather.sys.country,
          lat: weather.coord.lat,
          lon: weather.coord.lon,
        }
      : null

  const isLocationFavourite =
    favouriteLocation != null && isFavourite(favourites, favouriteLocation)

  const handleToggleFavourite = (): void => {
    if (favouriteLocation == null) {
      return
    }
    setFavourites((current) => toggleFavourite(current, favouriteLocation))
  }

  const handleSelectFavourite = async (favourite: FavouriteLocation): Promise<void> => {
    await submitSearch(() =>
      fetchWeatherByCoordinates(favourite.lat, favourite.lon)
    )
  }

  const handleRemoveFavourite = (favourite: FavouriteLocation): void => {
    setFavourites((current) => removeFavourite(current, favourite))
  }

  return {
    searchMode,
    handleModeChange,
    query,
    setQuery,
    countries,
    countriesError,
    selectedCountryCode,
    handleCountryChange,
    cityQuery,
    handleCityQueryChange,
    citySuggestions,
    isSearchingCities,
    selectedCity,
    handleSelectCity,
    weather,
    isLoading,
    error,
    handleSearch,
    handleUseMyLocation,
    favourites,
    isLocationFavourite,
    handleToggleFavourite,
    handleSelectFavourite,
    handleRemoveFavourite,
    forecast,
    forecastError,
  }
}