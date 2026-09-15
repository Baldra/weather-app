const FAVOURITES_KEY = 'weather-app:favourites'

export type FavouriteLocation = {
  name: string
  country: string
  lat: number
  lon: number
}

function isValidFavourite(value: unknown): value is FavouriteLocation {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.name === 'string' &&
    typeof candidate.country === 'string' &&
    typeof candidate.lat === 'number' &&
    typeof candidate.lon === 'number'
  )
}

export function favouriteKey(favourite: FavouriteLocation): string {
  return [favourite.name, favourite.country, favourite.lat, favourite.lon].join('|')
}

export function loadFavourites(): FavouriteLocation[] {
  try {
    const raw = localStorage.getItem(FAVOURITES_KEY)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter(isValidFavourite)
  } catch {
    return []
  }
}

export function saveFavourites(favourites: FavouriteLocation[]): void {
  try {
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites))
  } catch {
    // Storage full or unavailable — favourites just won't persist this time.
  }
}

export function isFavourite(
  favourites: FavouriteLocation[],
  location: FavouriteLocation
): boolean {
  const key = favouriteKey(location)
  return favourites.some((favourite) => favouriteKey(favourite) === key)
}

export function toggleFavourite(
  favourites: FavouriteLocation[],
  location: FavouriteLocation
): FavouriteLocation[] {
  if (isFavourite(favourites, location)) {
    const key = favouriteKey(location)
    return favourites.filter((favourite) => favouriteKey(favourite) !== key)
  }
  return [...favourites, location]
}

export function removeFavourite(
  favourites: FavouriteLocation[],
  location: FavouriteLocation
): FavouriteLocation[] {
  const key = favouriteKey(location)
  return favourites.filter((favourite) => favouriteKey(favourite) !== key)
}