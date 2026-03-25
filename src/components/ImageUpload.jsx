import { useRef, useState } from 'react'

export default function ImageUpload({ images, onChange, label }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  function handleFiles(newFiles) {
    const valid = Array.from(newFiles).filter(f => f.type.startsWith('image/'))
    if (valid.length) onChange([...images, ...valid])
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  function removeImage(index) {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="block text-xs text-[#666] mb-2">{label || 'Screenshots'}</label>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors
          ${dragging ? 'border-[#555] bg-[#222]' : 'border-[#2a2a2a] hover:border-[#3a3a3a]'}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />

        {images.length === 0 ? (
          <div className="py-2">
            <div className="text-2xl mb-1">+</div>
            <p className="text-[#555] text-xs">Drop screenshots here or click to upload</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 justify-start" onClick={e => e.stopPropagation()}>
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(img)}
                  alt=""
                  className="w-16 h-16 object-cover rounded-lg border border-[#2a2a2a]"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#333] hover:bg-[#444] rounded-full text-xs flex items-center justify-center transition-colors border border-[#444]"
                >
                  ×
                </button>
              </div>
            ))}
            <div
              onClick={e => { e.stopPropagation(); inputRef.current?.click() }}
              className="w-16 h-16 border-2 border-dashed border-[#2a2a2a] hover:border-[#3a3a3a] rounded-lg flex items-center justify-center cursor-pointer transition-colors"
            >
              <span className="text-[#555] text-xl">+</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
