export const PROVIDERS = {
  anthropic: {
    id: 'anthropic',
    name: 'Claude',
    company: 'Anthropic',
    keyPlaceholder: 'sk-ant-api03-...',
    keyHint: 'console.anthropic.com',
    models: [
      { id: 'claude-sonnet-4-6', label: 'Sonnet 4.6' },
      { id: 'claude-opus-4-6', label: 'Opus 4.6' },
    ],
    defaultModel: 'claude-sonnet-4-6',
  },
  openai: {
    id: 'openai',
    name: 'ChatGPT',
    company: 'OpenAI',
    keyPlaceholder: 'sk-proj-...',
    keyHint: 'platform.openai.com/api-keys',
    models: [
      { id: 'gpt-4o', label: 'GPT-4o' },
      { id: 'gpt-4o-mini', label: 'GPT-4o mini' },
    ],
    defaultModel: 'gpt-4o',
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    company: 'Google',
    keyPlaceholder: 'AIzaSy...',
    keyHint: 'aistudio.google.com/apikey',
    models: [
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    ],
    defaultModel: 'gemini-2.0-flash',
  },
}

export const PROVIDER_LIST = Object.values(PROVIDERS)

export function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem('texter_settings') || '{}')
  } catch {
    return {}
  }
}

export function saveSettings(settings) {
  localStorage.setItem('texter_settings', JSON.stringify(settings))
}

export function getActiveProvider(settings) {
  const { provider, keys = {} } = settings
  if (provider && keys[provider]) return provider
  return PROVIDER_LIST.find(p => keys[p.id])?.id || null
}

export function getActiveModel(settings, providerId) {
  return settings.models?.[providerId] || PROVIDERS[providerId]?.defaultModel
}
