const LEVELS = [
  { value: 1, label: 'Banter', color: 'text-blue-400' },
  { value: 2, label: 'Flirty', color: 'text-yellow-400' },
  { value: 3, label: 'Tension', color: 'text-orange-400' },
  { value: 4, label: 'Spicy', color: 'text-red-400' },
]

export default function EnergySlider({ value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-[#666] mb-3">Energy level</label>
      <div className="grid grid-cols-4 gap-2">
        {LEVELS.map(level => (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={`py-2 px-1 rounded-lg text-xs font-medium border transition-all
              ${value === level.value
                ? `bg-[#222] border-[#444] ${level.color}`
                : 'bg-transparent border-[#2a2a2a] text-[#555] hover:border-[#3a3a3a] hover:text-[#888]'
              }`}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  )
}
