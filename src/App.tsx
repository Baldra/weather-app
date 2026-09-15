import { useState } from 'react'

import { ErrorMessage } from './components/ErrorMessage'
import { FavouritesBar } from './components/FavouritesBar'
import { ForecastSection } from './components/ForecastSection'
import { LoadingSpinner } from './components/LoadingSpinner'
import { SearchBar } from './components/SearchBar'
import { TemperatureUnitToggle } from './components/TemperatureUnitToggle'
import { WeatherCard } from './components/WeatherCard'
import { useWeather } from './hooks'
import type { ForecastDay, TemperatureUnit, WeatherApiResponse } from './types/weather'
import type { FavouriteLocation } from './utils/favourites'

function App() {
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('metric')
  const {
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
  } = useWeather()

  return (
    <div className="min-h-dvh bg-linear-to-b from-sky via-sky to-[#dfe9f2]">
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-12">
        <header className="mb-5 flex items-center justify-between gap-4 sm:mb-7">
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-sun">
              <SunMark />
            </span>
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
              Weather Finder
            </h1>
          </div>
          <TemperatureUnitToggle value={temperatureUnit} onChange={setTemperatureUnit} />
        </header>

        <div className="rounded-2xl border border-haze bg-paper p-4 sm:p-5">
          <SearchBar
            searchMode={searchMode}
            onModeChange={handleModeChange}
            query={query}
            onQueryChange={setQuery}
            countries={countries}
            countriesError={countriesError}
            selectedCountryCode={selectedCountryCode}
            onCountryChange={handleCountryChange}
            cityQuery={cityQuery}
            onCityQueryChange={handleCityQueryChange}
            citySuggestions={citySuggestions}
            isSearchingCities={isSearchingCities}
            onSelectCity={handleSelectCity}
            onSubmit={handleSearch}
            onUseMyLocation={handleUseMyLocation}
            isLoading={isLoading}
          />
        </div>

        {error ? <ErrorMessage message={error} /> : null}

        <WeatherResult
          isLoading={isLoading}
          temperatureUnit={temperatureUnit}
          weather={weather}
          favourites={favourites}
          isLocationFavourite={isLocationFavourite}
          onToggleFavourite={handleToggleFavourite}
          onSelectFavourite={handleSelectFavourite}
          onRemoveFavourite={handleRemoveFavourite}
          forecast={forecast}
          forecastError={forecastError}
        />
      </div>
    </div>
  )
}

function SunMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
      <path d="M12 2v2.5M12 19.5V22M2.8 12h2.5M18.7 12h2.5M5.5 5.5l1.8 1.8M16.7 16.7l1.8 1.8M5.5 18.5l1.8-1.8M16.7 7.3l1.8-1.8" strokeLinecap="round" />
    </svg>
  )
}

type WeatherResultProps = {
  isLoading: boolean
  temperatureUnit: TemperatureUnit
  weather: WeatherApiResponse | null
  favourites: FavouriteLocation[]
  isLocationFavourite: boolean
  onToggleFavourite: () => void
  onSelectFavourite: (favourite: FavouriteLocation) => void
  onRemoveFavourite: (favourite: FavouriteLocation) => void
  forecast: ForecastDay[]
  forecastError: string
}

function WeatherResult({
  isLoading,
  temperatureUnit,
  weather,
  favourites,
  isLocationFavourite,
  onToggleFavourite,
  onSelectFavourite,
  onRemoveFavourite,
  forecast,
  forecastError,
}: WeatherResultProps) {
  if (isLoading) {
    return <LoadingSpinner />
  }

  if (weather) {
    const hasFavourites = favourites.length > 0

    return (
      <div className="mt-5 grid gap-4 sm:mt-6 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:items-start">
        <div className={`min-w-0 ${hasFavourites ? 'lg:col-start-2' : 'lg:col-span-2'}`}>
          <WeatherCard
            key={weather.dt}
            weather={weather}
            temperatureUnit={temperatureUnit}
            isFavourite={isLocationFavourite}
            onToggleFavourite={onToggleFavourite}
          />
        </div>

        {hasFavourites ? (
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <FavouritesBar
              favourites={favourites}
              onSelect={onSelectFavourite}
              onRemove={onRemoveFavourite}
            />
          </div>
        ) : null}

        <div className="lg:col-span-2">
          <ForecastSection
            days={forecast}
            temperatureUnit={temperatureUnit}
            error={forecastError}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="mt-5 rounded-2xl border border-dashed border-haze bg-paper/70 px-6 py-10 text-center text-soft sm:mt-6 sm:py-14">
      Enter a city or ZIP code to see the current conditions and 5-day forecast.
    </div>
  )
}

export default App