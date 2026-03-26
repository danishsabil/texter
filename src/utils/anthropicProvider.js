import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from './systemPrompt.js'
import { buildPrompt } from './prompts.js'
import { fileToBase64 } from './imageUtils.js'
import { parseReplies } from './parseReplies.js'

export async function generateAnthropic(apiKey, model, mode, formData, imageFiles) {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
  const hasImages = imageFiles && imageFiles.length > 0
  const content = []

  if (hasImages) {
    const imageData = await Promise.all(imageFiles.map(fileToBase64))
    for (const img of imageData) {
      content.push({ type: 'image', source: { type: 'base64', media_type: img.mediaType, data: img.data } })
    }
  }

  content.push({ type: 'text', text: buildPrompt(mode, formData, hasImages) })

  const response = await client.messages.create({
    model,
    max_tokens: 1024,
    temperature: 1.0,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content }],
  })

  return parseReplies(response.content[0].text)
}
