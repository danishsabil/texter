import ImageUpload from './ImageUpload.jsx'
import EnergySlider from './EnergySlider.jsx'
import SharedFields from './SharedFields.jsx'

export default function EscalateForm({ data, images, onChange, onImagesChange }) {
  return (
    <div className="space-y-4">
      <ImageUpload
        images={images}
        onChange={onImagesChange}
        label="Conversation screenshots (optional — Claude will read the full convo)"
      />

      <div>
        <label className="block text-xs text-[#666] mb-2">
          Full conversation
          <span className="ml-1 text-[#444]">(optional if you uploaded screenshots)</span>
        </label>
        <textarea
          value={data.fullConvo || ''}
          onChange={e => onChange({ ...data, fullConvo: e.target.value })}
          placeholder="Paste the full conversation..."
          rows={5}
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs text-[#666] mb-2">Where do you want to take it?</label>
        <input
          type="text"
          value={data.goal || ''}
          onChange={e => onChange({ ...data, goal: e.target.value })}
          placeholder="e.g. Get her number, suggest meeting up, keep the tension going..."
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
        />
      </div>

      <EnergySlider
        value={data.energy || 3}
        onChange={val => onChange({ ...data, energy: val })}
      />

      <SharedFields data={data} onChange={onChange} />
    </div>
  )
}
