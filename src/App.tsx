import { useState } from 'react'

import { ErrorMessage } from './components/ErrorMessage'
import { LoadingSpinner } from './components/LoadingSpinner'
import { SearchBar } from './components/SearchBar'
import { TemperatureUnitToggle } from './components/TemperatureUnitToggle'
import { WeatherCard } from './components/WeatherCard'
import { useWeather } from './hooks'
import type { TemperatureUnit, WeatherApiResponse } from './types/weather'

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
  } = useWeather()

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-sky-50 to-indigo-100 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white/80 p-5 shadow-lg ring-1 ring-slate-200 backdrop-blur-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-600">
                Forecast
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                Weather Finder
              </h1>
            </div>

            <TemperatureUnitToggle
              value={temperatureUnit}
              onChange={setTemperatureUnit}
            />
          </div>

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

        {error && <ErrorMessage message={error} />}
        <WeatherResult
          isLoading={isLoading}
          temperatureUnit={temperatureUnit}
          weather={weather}
        />
      </div>
    </div>
  )
}

type WeatherResultProps = {
  isLoading: boolean
  temperatureUnit: TemperatureUnit
  weather: WeatherApiResponse | null
}

function WeatherResult({ isLoading, temperatureUnit, weather }: WeatherResultProps) {
  if (isLoading) {
    return <LoadingSpinner />
  }

  if (weather) {
    return <WeatherCard weather={weather} temperatureUnit={temperatureUnit} />
  }

  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-500 shadow-sm">
      Search by ZIP code, or select a country and city to see the current weather.
    </div>
  )
}

export default App
