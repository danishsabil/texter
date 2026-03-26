import { generateAnthropic } from './anthropicProvider.js'
import { generateOpenAI } from './openaiProvider.js'
import { generateGemini } from './geminiProvider.js'

export async function generateReplies(provider, apiKey, model, mode, formData, imageFiles) {
  if (provider === 'anthropic') return generateAnthropic(apiKey, model, mode, formData, imageFiles)
  if (provider === 'openai') return generateOpenAI(apiKey, model, mode, formData, imageFiles)
  if (provider === 'gemini') return generateGemini(apiKey, model, mode, formData, imageFiles)
  throw new Error('Unknown provider selected.')
}
