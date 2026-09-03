import type { FormEvent } from 'react'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export function SearchBar({ value, onChange, onSubmit, isLoading }: SearchBarProps) {
  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
      <label htmlFor="location" className="sr-only">
        City or ZIP code
      </label>
      <input
        id="location"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter city or ZIP code"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-xl bg-sky-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-300"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}
