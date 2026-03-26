import OpenAI from 'openai'
import { SYSTEM_PROMPT } from './systemPrompt.js'
import { buildPrompt } from './prompts.js'
import { fileToBase64 } from './imageUtils.js'
import { parseReplies } from './parseReplies.js'

export async function generateOpenAI(apiKey, model, mode, formData, imageFiles) {
  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
  const hasImages = imageFiles && imageFiles.length > 0
  const userContent = []

  if (hasImages) {
    const imageData = await Promise.all(imageFiles.map(fileToBase64))
    for (const img of imageData) {
      userContent.push({ type: 'image_url', image_url: { url: `data:${img.mediaType};base64,${img.data}` } })
    }
  }

  userContent.push({ type: 'text', text: buildPrompt(mode, formData, hasImages) })

  const response = await client.chat.completions.create({
    model,
    temperature: 1.0,
    max_tokens: 1024,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
  })

  return parseReplies(response.choices[0].message.content)
}
