import { useState } from 'react'
import ApiKeySetup from './components/ApiKeySetup.jsx'
import ModeSelect from './components/ModeSelect.jsx'
import OpenerForm from './components/OpenerForm.jsx'
import ReplyForm from './components/ReplyForm.jsx'
import EscalateForm from './components/EscalateForm.jsx'
import ResultCards from './components/ResultCards.jsx'
import ProviderModelPicker from './components/ProviderModelPicker.jsx'
import { generateReplies } from './utils/generate.js'
import {
  loadSettings, saveSettings, getActiveProvider, getActiveModel, PROVIDERS
} from './utils/providerConfig.js'

const MODE_LABELS = { opener: 'Opener', reply: 'Reply', escalate: 'Escalate' }
const DEFAULT_FORM = { opener: { platform: 'Hinge' }, reply: { energy: 2 }, escalate: { energy: 3 } }

function initState() {
  const settings = loadSettings()
  const provider = getActiveProvider(settings)
  const model = provider ? getActiveModel(settings, provider) : null
  return { settings, provider, model }
}

export default function App() {
  const [{ settings, provider, model }, setState] = useState(initState)
  const [screen, setScreen] = useState(provider ? 'mode' : 'apikey')
  const [mode, setMode] = useState(null)
  const [formData, setFormData] = useState({})
  const [images, setImages] = useState([])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError] = useState('')
  const [avoid, setAvoid] = useState('')

  function handleSaveKeys(keys) {
    const next = { ...settings, keys }
    const activeProvider = getActiveProvider(next)
    const activeModel = activeProvider ? getActiveModel(next, activeProvider) : null
    saveSettings(next)
    setState({ settings: next, provider: activeProvider, model: activeModel })
    setScreen(activeProvider ? 'mode' : 'apikey')
  }

  function handleProviderChange(p) {
    const next = { ...settings, provider: p }
    const m = getActiveModel(next, p)
    saveSettings({ ...next, models: { ...settings.models, [p]: m } })
    setState({ settings: next, provider: p, model: m })
  }

  function handleModelChange(m) {
    const next = { ...settings, models: { ...settings.models, [provider]: m } }
    saveSettings(next)
    setState({ settings: next, provider, model: m })
  }

  function handleModeSelect(selectedMode) {
    setMode(selectedMode)
    setFormData(DEFAULT_FORM[selectedMode] || {})
    setImages([])
    setResults(null)
    setError('')
    setScreen('input')
  }

  function hasEnoughInput() {
    if (images.length > 0) return true
    if (mode === 'opener') return !!(formData.bio?.trim() || formData.photos?.trim())
    if (mode === 'reply') return !!(formData.lastMessage?.trim() || formData.history?.trim())
    if (mode === 'escalate') return !!(formData.fullConvo?.trim())
    return false
  }

  async function runGenerate(setLoadingFn) {
    setError('')
    setLoadingFn(true)
    try {
      const apiKey = settings.keys?.[provider]
      if (!apiKey) throw new Error(`No API key found for ${PROVIDERS[provider]?.name}.`)
      const replies = await generateReplies(provider, apiKey, model, mode, { ...formData, avoid }, images)
      setResults(replies)
      setScreen('results')
    } catch (err) {
      setError(err.message || 'Something went wrong. Check your API key and try again.')
    } finally {
      setLoadingFn(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!hasEnoughInput()) {
      setError('Add some context — upload a screenshot or fill in at least one field.')
      return
    }
    await runGenerate(setLoading)
  }

  async function handleRegenerate() {
    await runGenerate(setRegenerating)
  }

  function handleReset() {
    setScreen('mode')
    setMode(null)
    setFormData({})
    setImages([])
    setResults(null)
    setError('')
    setAvoid('')
  }

  if (screen === 'apikey') {
    return (
      <ApiKeySetup
        initialKeys={settings.keys || {}}
        onSave={handleSaveKeys}
        isSettings={false}
      />
    )
  }

  if (screen === 'settings') {
    return (
      <ApiKeySetup
        initialKeys={settings.keys || {}}
        onSave={handleSaveKeys}
        isSettings={true}
      />
    )
  }

  if (screen === 'mode') {
    return (
      <ModeSelect
        onSelect={handleModeSelect}
        onSettings={() => setScreen('settings')}
      />
    )
  }

  if (screen === 'results') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Here's your ammo</h2>
              <p className="text-[#555] text-xs mt-0.5">Pick one and send it. Don't overthink it.</p>
            </div>
            <button onClick={() => setScreen('input')} className="text-[#444] text-xs hover:text-[#666] transition-colors">
              ← Edit
            </button>
          </div>
          {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
          <ResultCards
            replies={results}
            onReset={handleReset}
            onRegenerate={handleRegenerate}
            regenerating={regenerating}
            avoid={avoid}
            onAvoidChange={setAvoid}
          />
        </div>
      </div>
    )
  }

  const FormComponent = mode === 'opener' ? OpenerForm : mode === 'reply' ? ReplyForm : EscalateForm

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <button onClick={() => setScreen('mode')} className="text-[#444] text-xs hover:text-[#666] transition-colors mb-3 block">
            ← Back
          </button>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{MODE_LABELS[mode]}</h2>
            <ProviderModelPicker
              keys={settings.keys || {}}
              provider={provider}
              model={model}
              onProviderChange={handleProviderChange}
              onModelChange={handleModelChange}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormComponent
            data={formData}
            images={images}
            onChange={setFormData}
            onImagesChange={setImages}
          />

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingDots />
                Reading the vibe...
              </span>
            ) : 'Generate replies'}
          </button>
        </form>
      </div>
    </div>
  )
}

function LoadingDots() {
  return (
    <span className="flex gap-1 items-center">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  )
}
