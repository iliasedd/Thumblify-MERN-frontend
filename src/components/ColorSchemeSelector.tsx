import { colorSchemes } from "../data/data"
import type { ColorScheme } from "../types"

export default function ColorSchemeSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (value: ColorScheme) => void
}) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-200">
        Color Scheme
      </label>

      <div className="grid grid-cols-6 gap-3">
        {colorSchemes.map(({ id, name, colors }) => (
          <div
            key={id}
            onClick={() => onChange(id)}
            className={`relative rounded-lg transition-all cursor-pointer ${value === id && "ring-2 ring-pink-500"}`}
            title={name}
          >
            <div className="flex h-10 rounded-lg overflow-hidden">
              {colors.map((color, i) => (
                <div
                  key={i}
                  className="flex-1"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-zinc-400">
        Selected: {colorSchemes.find(({ id }) => id === value)?.name}
      </p>
    </div>
  )
}
