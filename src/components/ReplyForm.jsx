import ImageUpload from './ImageUpload.jsx'
import EnergySlider from './EnergySlider.jsx'

export default function ReplyForm({ data, images, onChange, onImagesChange }) {
  return (
    <div className="space-y-4">
      <ImageUpload
        images={images}
        onChange={onImagesChange}
        label="Chat screenshots (optional — Claude will read the conversation)"
      />

      <div>
        <label className="block text-xs text-[#666] mb-2">
          Her last message
          <span className="ml-1 text-[#444]">(optional if you uploaded screenshots)</span>
        </label>
        <textarea
          value={data.lastMessage || ''}
          onChange={e => onChange({ ...data, lastMessage: e.target.value })}
          placeholder="What did she say?"
          rows={3}
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs text-[#666] mb-2">Conversation so far <span className="text-[#444]">(optional)</span></label>
        <textarea
          value={data.history || ''}
          onChange={e => onChange({ ...data, history: e.target.value })}
          placeholder="Paste the conversation history here..."
          rows={4}
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
        />
      </div>

      <EnergySlider
        value={data.energy || 2}
        onChange={val => onChange({ ...data, energy: val })}
      />
    </div>
  )
}
