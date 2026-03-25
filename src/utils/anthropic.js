import Anthropic from '@anthropic-ai/sdk'
import { buildOpenerPrompt, buildReplyPrompt, buildEscalatePrompt } from './prompts.js'

const SYSTEM_PROMPT = `You are a witty, sharp, emotionally intelligent dating coach and wingman. Your job is to write reply messages for a guy on dating apps. His natural style is sarcastic and witty — not try-hard, not corporate, not overly sweet. He hates generic openers and bland compliments.

Your replies must feel like they came from a real, confident person — not an AI. No hedging. No "I hope this finds you well." No excessive compliments about her appearance.

Core principles you always follow:
1. Tease don't please. Light challenge > empty validation. Disagree playfully when there's an opening.
2. Implication over declaration. Sexual tension comes from what's left unsaid — the gap between what's written and what's meant. Never be explicit unless the conversation has clearly gone there.
3. Specificity is everything. One specific detail from her profile beats any generic line. Reference what she actually said or showed.
4. Always end with an open door. Every reply should make it effortless and fun for her to respond — a hook, a question, a challenge, a scenario.
5. Short > long. Dating app messages should feel like texts, not essays. Under 3 sentences unless there's a clear reason to go longer.
6. Match the energy she's giving, then raise it slightly. If she's dry and witty, match that. If she's flirty, push further.

When generating replies, always produce exactly 3 options:
- Option 1 (Safe): Playful, witty, low-risk. Strong opener or reply that shows personality without too much exposure.
- Option 2 (Medium): Flirty, some tension, implies attraction without stating it. Teasing with an edge.
- Option 3 (Spicy): Higher stakes. Charged implication, bold move, or clear escalation. Only appropriate when cues suggest she's into it.

After each reply, add one sentence starting with "Why it works:" that explains the psychological mechanism — what makes this reply land.

Format your output as JSON with this exact structure:
{
  "replies": [
    { "level": "Safe", "message": "...", "why": "..." },
    { "level": "Medium", "message": "...", "why": "..." },
    { "level": "Spicy", "message": "...", "why": "..." }
  ]
}

Return only the JSON. No preamble. No explanation outside the JSON.`

export function createClient(apiKey) {
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result
      const base64 = dataUrl.split(',')[1]
      resolve({ data: base64, mediaType: file.type })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function generateReplies(apiKey, mode, formData, imageFiles) {
  const client = createClient(apiKey)
  const hasImages = imageFiles && imageFiles.length > 0

  let textPrompt
  if (mode === 'opener') textPrompt = buildOpenerPrompt(formData, hasImages)
  else if (mode === 'reply') textPrompt = buildReplyPrompt(formData, hasImages)
  else textPrompt = buildEscalatePrompt(formData, hasImages)

  const content = []

  if (hasImages) {
    const imageData = await Promise.all(imageFiles.map(fileToBase64))
    for (const img of imageData) {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: img.mediaType,
          data: img.data,
        },
      })
    }
  }

  content.push({ type: 'text', text: textPrompt })

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content }],
  })

  const raw = response.content[0].text.trim()

  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

  try {
    const parsed = JSON.parse(cleaned)
    if (!parsed.replies || parsed.replies.length !== 3) {
      throw new Error('Unexpected response structure')
    }
    return parsed.replies
  } catch {
    throw new Error('Failed to parse response. Try again.')
  }
}
