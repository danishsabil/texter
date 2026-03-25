const MODES = [
  {
    id: 'opener',
    label: 'Opener',
    tagline: 'She has no idea you exist yet.',
    sub: 'Paste her profile or drop a screenshot.',
    icon: '👁',
  },
  {
    id: 'reply',
    label: 'Reply',
    tagline: 'She just texted. Don\'t fumble this.',
    sub: 'Paste her message or upload the chat.',
    icon: '💬',
  },
  {
    id: 'escalate',
    label: 'Escalate',
    tagline: 'Vibe is good. Take it further.',
    sub: 'Push the conversation where you want it to go.',
    icon: '🔥',
  },
]

export default function ModeSelect({ onSelect, onChangeKey }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Texter</h1>
          <p className="text-[#666] text-sm">What's the situation?</p>
        </div>

        <div className="space-y-3">
          {MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => onSelect(mode.id)}
              className="w-full text-left bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#444] rounded-2xl px-5 py-4 transition-all group"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-0.5">{mode.icon}</span>
                <div>
                  <div className="font-semibold text-white group-hover:text-white text-sm mb-0.5">
                    {mode.label}
                  </div>
                  <div className="text-white text-sm font-medium mb-1">{mode.tagline}</div>
                  <div className="text-[#555] text-xs">{mode.sub}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onChangeKey}
          className="mt-8 text-[#444] text-xs hover:text-[#666] transition-colors"
        >
          Change API key
        </button>
      </div>
    </div>
  )
}
