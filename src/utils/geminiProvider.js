import { GoogleGenerativeAI } from '@google/generative-ai'
import { SYSTEM_PROMPT } from './systemPrompt.js'
import { buildPrompt } from './prompts.js'
import { fileToBase64 } from './imageUtils.js'
import { parseReplies } from './parseReplies.js'

export async function generateGemini(apiKey, model, mode, formData, imageFiles) {
  const genAI = new GoogleGenerativeAI(apiKey)
  const geminiModel = genAI.getGenerativeModel({
    model,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 1.0,
      maxOutputTokens: 1024,
    },
  })

  const hasImages = imageFiles && imageFiles.length > 0
  const parts = []

  if (hasImages) {
    const imageData = await Promise.all(imageFiles.map(fileToBase64))
    for (const img of imageData) {
      parts.push({ inlineData: { data: img.data, mimeType: img.mediaType } })
    }
  }

  parts.push({ text: buildPrompt(mode, formData, hasImages) })

  const result = await geminiModel.generateContent({ contents: [{ role: 'user', parts }] })
  return parseReplies(result.response.text())
}
