import { useState } from 'react'
import { PROVIDER_LIST } from '../utils/providerConfig.js'

export default function ApiKeySetup({ initialKeys = {}, onSave, isSettings = false }) {
  const [keys, setKeys] = useState(initialKeys)
  const [active, setActive] = useState(PROVIDER_LIST[0].id)
  const [error, setError] = useState('')

  function handleSave() {
    const filled = PROVIDER_LIST.filter(p => keys[p.id]?.trim())
    if (filled.length === 0) {
      setError('Enter at least one API key to continue.')
      return
    }
    const clean = {}
    for (const p of filled) clean[p.id] = keys[p.id].trim()
    onSave(clean)
  }

  const provider = PROVIDER_LIST.find(p => p.id === active)

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {isSettings ? 'API Keys' : 'Texter'}
          </h1>
          <p className="text-[#666] text-sm">
            {isSettings
              ? 'Update your API keys. Fill in whichever you have.'
              : 'Add one or more AI provider keys. You only need one to get started.'}
          </p>
        </div>

        <div className="flex gap-2 mb-5">
          {PROVIDER_LIST.map(p => (
            <button
              key={p.id}
              onClick={() => { setActive(p.id); setError('') }}
              className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all relative
                ${active === p.id
                  ? 'bg-[#222] border-[#444] text-white'
                  : 'bg-transparent border-[#2a2a2a] text-[#555] hover:border-[#3a3a3a] hover:text-[#888]'
                }`}
            >
              {p.name}
              {keys[p.id]?.trim() && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-green-500" />
              )}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[#666] mb-2">{provider.company} API key</label>
            <input
              key={active}
              type="password"
              value={keys[active] || ''}
              onChange={e => { setKeys({ ...keys, [active]: e.target.value }); setError('') }}
              placeholder={provider.keyPlaceholder}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#444] transition-colors font-mono"
              autoFocus
            />
            <p className="text-[#3a3a3a] text-xs mt-2">{provider.keyHint}</p>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            onClick={handleSave}
            className="w-full bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-gray-100 transition-colors"
          >
            {isSettings ? 'Save' : "Let's go"}
          </button>
        </div>

        <p className="text-[#333] text-xs mt-6">
          Keys are stored in your browser only. Never leave this device.
        </p>
      </div>
    </div>
  )
}
