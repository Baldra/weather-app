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
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-stretch">
        <div
          role="group"
          aria-label="Search by"
          className="flex w-full items-stretch rounded-xl border border-haze bg-sky p-1 sm:w-auto sm:shrink-0"
        >
          <button
            type="button"
            onClick={() => onModeChange('zipcode')}
            aria-pressed={searchMode === 'zipcode'}
            className={`flex flex-1 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:py-0 sm:self-stretch ${
              searchMode === 'zipcode'
                ? 'bg-paper text-ink shadow-sm'
                : 'text-soft hover:text-ink'
            }`}
          >
            ZIP code
          </button>
          <button
            type="button"
            onClick={() => onModeChange('location')}
            aria-pressed={searchMode === 'location'}
            className={`flex flex-1 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:py-0 sm:self-stretch ${
              searchMode === 'location'
                ? 'bg-paper text-ink shadow-sm'
                : 'text-soft hover:text-ink'
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
            className="min-w-0 w-full rounded-xl border border-haze bg-paper px-4 py-3 text-base text-ink placeholder:text-fog sm:flex-1"
          />
        ) : null}

        {searchMode === 'location' ? (
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <select
              id="country"
              value={selectedCountryCode}
              onChange={(event) => onCountryChange(event.target.value)}
              disabled={countries.length === 0}
              className="w-full rounded-xl border border-haze bg-paper px-4 py-3 text-base text-ink disabled:cursor-not-allowed disabled:bg-sky disabled:text-fog sm:w-[45%]"
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
                className="w-full rounded-xl border border-haze bg-paper px-4 py-3 text-base text-ink placeholder:text-fog disabled:cursor-not-allowed disabled:bg-sky disabled:text-fog"
              />
              {citySuggestions.length > 0 ? (
                <ul className="absolute z-10 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-haze bg-paper py-1 shadow-md">
                  {citySuggestions.map((place) => {
                    const key = `${place.name}-${place.country}-${place.lat}-${place.lon}`
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => onSelectCity(place)}
                          className="w-full px-4 py-2.5 text-left text-sm text-soft transition-colors hover:bg-sky"
                        >
                          <span className="font-medium text-ink">{place.name}</span>
                          <span className="ml-2 text-fog">
                            {[place.state, place.country].filter(Boolean).join(', ')}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : null}
              {isSearchingCities ? (
                <p className="mt-1 text-xs text-fog">Searching cities…</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {countriesError ? <p className="text-sm text-red-700">{countriesError}</p> : null}

      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-sea px-5 py-3 font-semibold text-white transition-colors hover:bg-sea-deep disabled:cursor-not-allowed disabled:opacity-60 sm:px-6 sm:w-auto"
        >
          {isLoading ? 'Searching…' : 'Search'}
        </button>
        <button
          type="button"
          onClick={onUseMyLocation}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-haze bg-paper px-5 py-3 font-medium text-soft transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-60 sm:px-6"
        >
          <LocationPin />
          Use my location
        </button>
      </div>
    </form>
  )
}

function LocationPin() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-sea"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-7-5.3-7-11a7 7 0 0 1 14 0c0 5.7-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  )
}