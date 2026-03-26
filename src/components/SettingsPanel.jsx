import { useState, useEffect } from 'react'
import { PROVIDER_LIST, PROVIDERS } from '../utils/providerConfig.js'

export default function SettingsPanel({ isOpen, onClose, settings, onSave }) {
  const [keys, setKeys] = useState(settings.keys || {})
  const [models, setModels] = useState(settings.models || {})
  const [activeTab, setActiveTab] = useState(PROVIDER_LIST[0].id)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setKeys(settings.keys || {})
      setModels(settings.models || {})
      setSaved(false)
    }
  }, [isOpen, settings])

  function handleSave() {
    const cleanKeys = {}
    for (const p of PROVIDER_LIST) {
      if (keys[p.id]?.trim()) cleanKeys[p.id] = keys[p.id].trim()
    }
    onSave({ ...settings, keys: cleanKeys, models })
    setSaved(true)
    setTimeout(() => { setSaved(false); onClose() }, 800)
  }

  const provider = PROVIDERS[activeTab]

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#111] border-l border-[#2a2a2a] z-50 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f1f]">
          <h2 className="text-sm font-semibold">Settings</h2>
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors text-lg leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          <div>
            <p className="text-xs text-[#555] mb-3">API Keys</p>
            <div className="flex gap-2 mb-4">
              {PROVIDER_LIST.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActiveTab(p.id)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all relative
                    ${activeTab === p.id
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

            <label className="block text-xs text-[#555] mb-2">{provider.company} API key</label>
            <input
              key={activeTab}
              type="password"
              value={keys[activeTab] || ''}
              onChange={e => setKeys({ ...keys, [activeTab]: e.target.value })}
              placeholder={provider.keyPlaceholder}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#444] transition-colors font-mono"
            />
            <p className="text-[#333] text-xs mt-1.5">{provider.keyHint}</p>
          </div>

          <div>
            <p className="text-xs text-[#555] mb-3">Default Models</p>
            <div className="space-y-3">
              {PROVIDER_LIST.filter(p => keys[p.id]?.trim()).map(p => (
                <div key={p.id} className="flex items-center justify-between">
                  <span className="text-xs text-[#666]">{p.name}</span>
                  <select
                    value={models[p.id] || p.defaultModel}
                    onChange={e => setModels({ ...models, [p.id]: e.target.value })}
                    className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#444] transition-colors cursor-pointer"
                  >
                    {PROVIDERS[p.id].models.map(m => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                </div>
              ))}
              {PROVIDER_LIST.filter(p => keys[p.id]?.trim()).length === 0 && (
                <p className="text-[#444] text-xs">Add a key above to set a default model.</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[#1f1f1f]">
          <button
            onClick={handleSave}
            className="w-full bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-gray-100 transition-colors"
          >
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </>
  )
}
