import { PROVIDERS, PROVIDER_LIST } from '../utils/providerConfig.js'

export default function ProviderModelPicker({ keys, provider, model, onProviderChange, onModelChange }) {
  const availableProviders = PROVIDER_LIST.filter(p => keys[p.id])
  if (availableProviders.length === 0) return null

  const currentProvider = PROVIDERS[provider]
  const models = currentProvider?.models || []

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-[#444]">Using</span>

      <div className="flex gap-1.5">
        {availableProviders.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              onProviderChange(p.id)
              onModelChange(PROVIDERS[p.id].defaultModel)
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all
              ${provider === p.id
                ? 'bg-[#222] border-[#444] text-white'
                : 'bg-transparent border-[#2a2a2a] text-[#555] hover:border-[#3a3a3a] hover:text-[#777]'
              }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {models.length > 1 && (
        <select
          value={model}
          onChange={e => onModelChange(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#666] text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-[#444] transition-colors cursor-pointer"
        >
          {models.map(m => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </select>
      )}
    </div>
  )
}
