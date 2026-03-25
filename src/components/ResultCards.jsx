import { useState } from 'react'

const CARD_CONFIG = {
  Safe: {
    dot: 'bg-yellow-400',
    border: 'border-yellow-400/20',
    label: 'Safe',
    labelColor: 'text-yellow-400',
  },
  Medium: {
    dot: 'bg-orange-400',
    border: 'border-orange-400/20',
    label: 'Medium',
    labelColor: 'text-orange-400',
  },
  Spicy: {
    dot: 'bg-red-400',
    border: 'border-red-400/20',
    label: 'Spicy',
    labelColor: 'text-red-400',
  },
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs px-3 py-1 rounded-lg border border-[#2a2a2a] hover:border-[#3a3a3a] text-[#555] hover:text-[#888] transition-all"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export default function ResultCards({ replies, onReset }) {
  return (
    <div className="space-y-4">
      {replies.map((reply) => {
        const config = CARD_CONFIG[reply.level] || CARD_CONFIG.Safe
        return (
          <div
            key={reply.level}
            className={`bg-[#1a1a1a] border ${config.border} rounded-2xl p-5`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                <span className={`text-xs font-semibold ${config.labelColor}`}>{config.label}</span>
              </div>
              <CopyButton text={reply.message} />
            </div>

            <p className="text-white text-sm leading-relaxed mb-3">{reply.message}</p>

            <p className="text-[#444] text-xs leading-relaxed italic border-t border-[#222] pt-3">
              {reply.why}
            </p>
          </div>
        )
      })}

      <button
        onClick={onReset}
        className="w-full border border-[#2a2a2a] hover:border-[#3a3a3a] text-[#555] hover:text-[#888] rounded-xl py-3 text-sm transition-all"
      >
        Start over
      </button>
    </div>
  )
}
