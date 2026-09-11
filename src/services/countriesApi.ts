import type { Country } from '../types/weather'

const COUNTRIES_API_URL = 'https://cdn.jsdelivr.net/npm/world-countries@5/countries.json'

type WorldCountry = {
  name: {
    common: string
  }
  cca2: string
}

let cachedCountries: Country[] | null = null

export async function fetchCountries(): Promise<Country[]> {
  if (cachedCountries) {
    return cachedCountries
  }

  const response = await fetch(COUNTRIES_API_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to load the list of countries. Please try again later.')
  }

  const worldCountries = (await response.json()) as WorldCountry[]

  cachedCountries = worldCountries
    .map(({ name, cca2 }) => ({ name: name.common, code: cca2 }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return cachedCountries
}