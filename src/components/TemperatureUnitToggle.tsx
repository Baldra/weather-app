import type { TemperatureUnit } from '../types/weather'

type TemperatureUnitToggleProps = {
  value: TemperatureUnit
  onChange: (unit: TemperatureUnit) => void
}

export function TemperatureUnitToggle({ value, onChange }: TemperatureUnitToggleProps) {
  return (
    <div className="inline-flex rounded-full bg-slate-100 p-1 shadow-inner">
      {(['metric', 'imperial'] as const).map((unit) => (
        <button
          key={unit}
          type="button"
          onClick={() => onChange(unit)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            value === unit
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {unit === 'metric' ? '°C' : '°F'}
        </button>
      ))}
    </div>
  )
}
