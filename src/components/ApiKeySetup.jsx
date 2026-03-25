import { useState } from 'react'

export default function ApiKeySetup({ onSave }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = key.trim()
    if (!trimmed.startsWith('sk-ant-')) {
      setError('That doesn\'t look like an Anthropic API key. It should start with sk-ant-')
      return
    }
    onSave(trimmed)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Texter</h1>
          <p className="text-[#666] text-sm">Your AI wingman. Enter your Anthropic API key to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={key}
              onChange={e => { setKey(e.target.value); setError('') }}
              placeholder="sk-ant-api03-..."
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#444] transition-colors font-mono"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={!key.trim()}
            className="w-full bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Let's go
          </button>
        </form>

        <p className="text-[#444] text-xs mt-6 leading-relaxed">
          Your key is stored locally in your browser. Nothing leaves your device except the API calls to Anthropic.
          Get a key at <span className="text-[#666]">console.anthropic.com</span>
        </p>
      </div>
    </div>
  )
}
