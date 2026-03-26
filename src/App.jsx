import { useState } from 'react'
import ApiKeySetup from './components/ApiKeySetup.jsx'
import ModeSelect from './components/ModeSelect.jsx'
import OpenerForm from './components/OpenerForm.jsx'
import ReplyForm from './components/ReplyForm.jsx'
import EscalateForm from './components/EscalateForm.jsx'
import ResultCards from './components/ResultCards.jsx'
import ProviderModelPicker from './components/ProviderModelPicker.jsx'
import SettingsPanel from './components/SettingsPanel.jsx'
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

function GearButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Settings"
      className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#2a2a2a] hover:border-[#3a3a3a] text-[#555] hover:text-[#888] transition-all flex-shrink-0"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    </button>
  )
}

export default function App() {
  const [{ settings, provider, model }, setState] = useState(initState)
  const [screen, setScreen] = useState(getActiveProvider(loadSettings()) ? 'mode' : 'apikey')
  const [settingsOpen, setSettingsOpen] = useState(false)
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
    if (activeProvider) setScreen('mode')
  }

  function handleSaveSettings(next) {
    const activeProvider = getActiveProvider(next)
    const activeModel = activeProvider ? getActiveModel(next, activeProvider) : null
    saveSettings(next)
    setState({ settings: next, provider: activeProvider, model: activeModel })
  }

  function handleProviderChange(p) {
    const m = getActiveModel(settings, p)
    const next = { ...settings, provider: p, models: { ...settings.models, [p]: m } }
    saveSettings(next)
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
      if (!apiKey) throw new Error(`No API key for ${PROVIDERS[provider]?.name}. Add one in Settings.`)
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

  function handleReset() {
    setScreen('mode')
    setMode(null)
    setFormData({})
    setImages([])
    setResults(null)
    setError('')
    setAvoid('')
  }

  const panel = (
    <SettingsPanel
      isOpen={settingsOpen}
      onClose={() => setSettingsOpen(false)}
      settings={settings}
      onSave={handleSaveSettings}
    />
  )

  if (screen === 'apikey') {
    return (
      <>
        <ApiKeySetup initialKeys={settings.keys || {}} onSave={handleSaveKeys} />
        {panel}
      </>
    )
  }

  if (screen === 'mode') {
    return (
      <>
        <ModeSelect onSelect={handleModeSelect} onSettings={() => setSettingsOpen(true)} />
        {panel}
      </>
    )
  }

  if (screen === 'results') {
    return (
      <>
        <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10">
          <div className="w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">Here's your ammo</h2>
                <p className="text-[#555] text-xs mt-0.5">Pick one. Don't overthink it.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setScreen('input')} className="text-[#444] text-xs hover:text-[#666] transition-colors">
                  ← Edit
                </button>
                <GearButton onClick={() => setSettingsOpen(true)} />
              </div>
            </div>
            {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
            <ResultCards
              replies={results}
              onReset={handleReset}
              onRegenerate={() => runGenerate(setRegenerating)}
              regenerating={regenerating}
              avoid={avoid}
              onAvoidChange={setAvoid}
            />
          </div>
        </div>
        {panel}
      </>
    )
  }

  const FormComponent = mode === 'opener' ? OpenerForm : mode === 'reply' ? ReplyForm : EscalateForm

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="mb-6">
            <button onClick={() => setScreen('mode')} className="text-[#444] text-xs hover:text-[#666] transition-colors mb-3 block">
              ← Back
            </button>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{MODE_LABELS[mode]}</h2>
              <div className="flex items-center gap-2">
                <ProviderModelPicker
                  keys={settings.keys || {}}
                  provider={provider}
                  model={model}
                  onProviderChange={handleProviderChange}
                  onModelChange={handleModelChange}
                />
                <GearButton onClick={() => setSettingsOpen(true)} />
              </div>
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
      {panel}
    </>
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
