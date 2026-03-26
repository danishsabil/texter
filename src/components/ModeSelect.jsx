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

export default function ModeSelect({ onSelect, onSettings }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Texter</h1>
            <p className="text-[#666] text-sm">What's the situation?</p>
          </div>
          <button
            onClick={onSettings}
            title="Settings"
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#2a2a2a] hover:border-[#3a3a3a] text-[#555] hover:text-[#888] transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
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
                  <div className="font-semibold text-white text-sm mb-0.5">{mode.label}</div>
                  <div className="text-white text-sm font-medium mb-1">{mode.tagline}</div>
                  <div className="text-[#555] text-xs">{mode.sub}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
