import type { TemperatureUnit } from '../types/weather'

type TemperatureUnitToggleProps = {
  value: TemperatureUnit
  onChange: (unit: TemperatureUnit) => void
}

export function TemperatureUnitToggle({ value, onChange }: TemperatureUnitToggleProps) {
  return (
    <div
      role="group"
      aria-label="Temperature unit"
      className="inline-flex shrink-0 rounded-full border border-haze bg-sky p-1"
    >
      {(['metric', 'imperial'] as const).map((unit) => (
        <button
          key={unit}
          type="button"
          onClick={() => onChange(unit)}
          aria-pressed={value === unit}
          className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
            value === unit
              ? 'bg-paper text-ink shadow-sm'
              : 'text-fog hover:text-ink'
          }`}
        >
          {unit === 'metric' ? '°C' : '°F'}
        </button>
      ))}
    </div>
  )
}