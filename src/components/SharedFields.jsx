export default function SharedFields({ data, onChange }) {
  return (
    <div className="space-y-3 pt-2 border-t border-[#1f1f1f]">
      <div>
        <label className="block text-xs text-[#666] mb-2">
          Style note <span className="text-[#444]">(optional — nudge the tone)</span>
        </label>
        <input
          type="text"
          value={data.styleNote || ''}
          onChange={e => onChange({ ...data, styleNote: e.target.value })}
          placeholder="e.g. keep it under one sentence, she's very dry and deadpan"
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs text-[#666] mb-2">
          Avoid <span className="text-[#444]">(optional — patterns you're tired of)</span>
        </label>
        <input
          type="text"
          value={data.avoid || ''}
          onChange={e => onChange({ ...data, avoid: e.target.value })}
          placeholder="e.g. stop starting with questions, avoid food references"
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
        />
      </div>
    </div>
  )
}
