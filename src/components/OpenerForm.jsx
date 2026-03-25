import ImageUpload from './ImageUpload.jsx'
import SharedFields from './SharedFields.jsx'

const PLATFORMS = ['Hinge', 'Bumble', 'Tinder', 'Other']

export default function OpenerForm({ data, images, onChange, onImagesChange }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-[#666] mb-2">Platform</label>
        <div className="flex gap-2 flex-wrap">
          {PLATFORMS.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => onChange({ ...data, platform: p })}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium border transition-all
                ${data.platform === p
                  ? 'bg-[#222] border-[#444] text-white'
                  : 'bg-transparent border-[#2a2a2a] text-[#555] hover:border-[#3a3a3a] hover:text-[#888]'
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ImageUpload
        images={images}
        onChange={onImagesChange}
        label="Profile screenshots (optional — Claude will extract her bio)"
      />

      <div>
        <label className="block text-xs text-[#666] mb-2">
          Her prompts / bio
          <span className="ml-1 text-[#444]">(optional if you uploaded screenshots)</span>
        </label>
        <textarea
          value={data.bio || ''}
          onChange={e => onChange({ ...data, bio: e.target.value })}
          placeholder="e.g. 'Two truths and a lie: I've been to 30 countries, I make my own pasta, I've never seen The Office'"
          rows={4}
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs text-[#666] mb-2">Photo descriptions <span className="text-[#444]">(optional)</span></label>
        <textarea
          value={data.photos || ''}
          onChange={e => onChange({ ...data, photos: e.target.value })}
          placeholder="e.g. 'One photo at a ski resort, one at a concert, one with a dog'"
          rows={2}
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#444] transition-colors"
        />
      </div>

      <SharedFields data={data} onChange={onChange} />
    </div>
  )
}
