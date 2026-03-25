import { useState } from 'react'
import ApiKeySetup from './components/ApiKeySetup.jsx'
import ModeSelect from './components/ModeSelect.jsx'
import OpenerForm from './components/OpenerForm.jsx'
import ReplyForm from './components/ReplyForm.jsx'
import EscalateForm from './components/EscalateForm.jsx'
import ResultCards from './components/ResultCards.jsx'
import { generateReplies } from './utils/anthropic.js'

const MODE_LABELS = {
  opener: 'Opener',
  reply: 'Reply',
  escalate: 'Escalate',
}

const DEFAULT_FORM = {
  opener: { platform: 'Hinge' },
  reply: { energy: 2 },
  escalate: { energy: 3 },
}

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('texter_api_key') || '')
  const [screen, setScreen] = useState(apiKey ? 'mode' : 'apikey')
  const [mode, setMode] = useState(null)
  const [formData, setFormData] = useState({})
  const [images, setImages] = useState([])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleSaveKey(key) {
    localStorage.setItem('texter_api_key', key)
    setApiKey(key)
    setScreen('mode')
  }

  function handleChangeKey() {
    localStorage.removeItem('texter_api_key')
    setApiKey('')
    setScreen('apikey')
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

  async function handleSubmit(e) {
    e.preventDefault()
    if (!hasEnoughInput()) {
      setError('Add some context — upload a screenshot or fill in at least one field.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const replies = await generateReplies(apiKey, mode, formData, images)
      setResults(replies)
      setScreen('results')
    } catch (err) {
      setError(err.message || 'Something went wrong. Check your API key and try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setScreen('mode')
    setMode(null)
    setFormData({})
    setImages([])
    setResults(null)
    setError('')
  }

  if (screen === 'apikey') {
    return <ApiKeySetup onSave={handleSaveKey} />
  }

  if (screen === 'mode') {
    return <ModeSelect onSelect={handleModeSelect} onChangeKey={handleChangeKey} />
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
            <button
              onClick={handleReset}
              className="text-[#444] text-xs hover:text-[#666] transition-colors"
            >
              ← Back
            </button>
          </div>
          <ResultCards replies={results} onReset={handleReset} />
        </div>
      </div>
    )
  }

  // Input screen
  const FormComponent = mode === 'opener' ? OpenerForm : mode === 'reply' ? ReplyForm : EscalateForm

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => setScreen('mode')}
              className="text-[#444] text-xs hover:text-[#666] transition-colors mb-2 block"
            >
              ← Back
            </button>
            <h2 className="text-lg font-semibold">{MODE_LABELS[mode]}</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormComponent
            data={formData}
            images={images}
            onChange={setFormData}
            onImagesChange={setImages}
          />

          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

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
            ) : (
              'Generate replies'
            )}
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
        <span
          key={i}
          className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}
