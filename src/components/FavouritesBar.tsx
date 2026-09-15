import type { FavouriteLocation } from '../utils/favourites'

type FavouritesBarProps = {
  favourites: FavouriteLocation[]
  onSelect: (favourite: FavouriteLocation) => void
  onRemove: (favourite: FavouriteLocation) => void
}

export function FavouritesBar({ favourites, onSelect, onRemove }: FavouritesBarProps) {
  if (favourites.length === 0) {
    return null
  }

  return (
    <section
      aria-label="Favourite locations"
      className="rounded-2xl border border-haze bg-paper p-4 sm:p-5"
    >
      <h2 className="text-sm font-semibold text-soft">Favourites</h2>
      <ul className="mt-3 space-y-2">
        {favourites.map((favourite) => (
          <li
            key={`${favourite.name}|${favourite.country}|${favourite.lat}|${favourite.lon}`}
            className="flex items-center gap-2 rounded-xl border border-haze px-3 py-2"
          >
            <button
              type="button"
              onClick={() => onSelect(favourite)}
              className="min-w-0 flex-1 truncate text-left text-sm font-medium text-ink transition-colors hover:text-sea"
            >
              {favourite.name}, {favourite.country}
            </button>
            <button
              type="button"
              onClick={() => onRemove(favourite)}
              aria-label={`Remove ${favourite.name} from favourites`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-fog transition-colors hover:bg-sky hover:text-ink"
            >
              <CloseMark />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function CloseMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}