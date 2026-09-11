import type { FormEvent } from 'react'

import type { SearchMode } from '../hooks/useWeather'
import type { GeocodedPlace } from '../services/weatherApi'
import type { Country } from '../types/weather'

type SearchBarProps = {
  searchMode: SearchMode
  onModeChange: (mode: SearchMode) => void
  query: string
  onQueryChange: (value: string) => void
  countries: Country[]
  countriesError: string
  selectedCountryCode: string
  onCountryChange: (code: string) => void
  cityQuery: string
  onCityQueryChange: (value: string) => void
  citySuggestions: GeocodedPlace[]
  isSearchingCities: boolean
  onSelectCity: (place: GeocodedPlace) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onUseMyLocation: () => void
  isLoading: boolean
}

export function SearchBar({
  searchMode,
  onModeChange,
  query,
  onQueryChange,
  countries,
  countriesError,
  selectedCountryCode,
  onCountryChange,
  cityQuery,
  onCityQueryChange,
  citySuggestions,
  isSearchingCities,
  onSelectCity,
  onSubmit,
  onUseMyLocation,
  isLoading,
}: SearchBarProps) {
  const isLocationMode = searchMode === 'location'

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <div className="flex shrink-0 self-start overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => onModeChange('zipcode')}
            className={`px-4 py-2.5 text-sm font-medium transition ${
              searchMode === 'zipcode'
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            ZIP code
          </button>
          <button
            type="button"
            onClick={() => onModeChange('location')}
            className={`px-4 py-2.5 text-sm font-medium transition ${
              searchMode === 'location'
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Location
          </button>
        </div>

        {!isLocationMode ? (
          <label htmlFor="location" className="sr-only">
            City or ZIP code
          </label>
        ) : null}

        {searchMode === 'zipcode' ? (
          <input
            id="location"
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Enter city or ZIP code"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />
        ) : null}

        {searchMode === 'location' ? (
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <ViewModeLabel label="Country" htmlFor="country" />
            <select
              id="country"
              value={selectedCountryCode}
              onChange={(event) => onCountryChange(event.target.value)}
              disabled={countries.length === 0}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 sm:w-[45%]"
            >
              <option value="">
                {countries.length === 0 ? 'Loading countries…' : 'Select a country'}
              </option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>

            <div className="relative w-full sm:w-[55%]">
              <label htmlFor="city" className="sr-only">
                City
              </label>
              <input
                id="city"
                type="text"
                value={cityQuery}
                onChange={(event) => onCityQueryChange(event.target.value)}
                disabled={!selectedCountryCode}
                placeholder={
                  selectedCountryCode ? 'Start typing a city name…' : 'Select a country first'
                }
                autoComplete="off"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              />
              {citySuggestions.length > 0 ? (
                <ul className="absolute z-10 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  {citySuggestions.map((place) => {
                    const key = `${place.name}-${place.country}-${place.lat}-${place.lon}`
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => onSelectCity(place)}
                          className="w-full px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-sky-50"
                        >
                          <span className="font-medium text-slate-900">{place.name}</span>
                          <span className="ml-2 text-slate-500">
                            {[place.state, place.country].filter(Boolean).join(', ')}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : null}
              {isSearchingCities ? (
                <p className="mt-1 text-xs text-slate-500">Searching cities…</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {countriesError ? <p className="text-sm text-red-600">{countriesError}</p> : null}

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-xl bg-sky-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300 sm:w-auto"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={onUseMyLocation}
            disabled={isLoading}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            📍 Use my location
          </button>
        </div>
      </div>
    </form>
  )
}

type ViewModeLabelProps = {
  label: string
  htmlFor: string
}

function ViewModeLabel({ label, htmlFor }: ViewModeLabelProps) {
  return (
    <label htmlFor={htmlFor} className="sr-only">
      {label}
    </label>
  )
}