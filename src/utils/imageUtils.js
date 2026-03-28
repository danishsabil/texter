const MAX_BYTES = 4.5 * 1024 * 1024 // 4.5MB base64-decoded target (leaves headroom under 5MB)

function compressToCanvas(file, quality, maxDim) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height)
        width = Math.round(width * scale)
        height = Math.round(height * scale)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      resolve(canvas)
    }
    img.onerror = reject
    img.src = url
  })
}

async function compressImage(file) {
  // If already small enough, skip compression
  if (file.size <= MAX_BYTES) return file

  const mimeType = file.type === 'image/png' ? 'image/jpeg' : file.type
  let maxDim = 2048
  let quality = 0.85

  for (let attempt = 0; attempt < 6; attempt++) {
    const canvas = await compressToCanvas(file, quality, maxDim)
    const blob = await new Promise(res => canvas.toBlob(res, mimeType, quality))
    if (blob.size <= MAX_BYTES) {
      return new File([blob], file.name, { type: mimeType })
    }
    // Alternate between reducing quality and reducing dimensions
    if (attempt % 2 === 0) {
      quality = Math.max(0.4, quality - 0.15)
    } else {
      maxDim = Math.round(maxDim * 0.75)
    }
  }

  // Final fallback: aggressive settings
  const canvas = await compressToCanvas(file, 0.4, 1024)
  const blob = await new Promise(res => canvas.toBlob(res, mimeType, 0.4))
  return new File([blob], file.name, { type: mimeType })
}

export async function fileToBase64(file) {
  const compressed = await compressImage(file)
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve({ data: base64, mediaType: compressed.type })
    }
    reader.onerror = reject
    reader.readAsDataURL(compressed)
  })
}
