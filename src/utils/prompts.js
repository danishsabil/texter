const ENERGY_LABELS = {
  1: 'Banter',
  2: 'Flirty',
  3: 'Tension',
  4: 'Spicy',
}

function sharedSuffix({ avoid, styleNote }) {
  const parts = []
  if (styleNote?.trim()) parts.push(`Style note: ${styleNote.trim()}`)
  if (avoid?.trim()) parts.push(`Avoid these patterns in your replies: ${avoid.trim()}`)
  return parts.length ? '\n\n' + parts.join('\n') : ''
}

export function buildOpenerPrompt({ platform, bio, photos, avoid, styleNote }, hasImages) {
  const imageNote = hasImages
    ? 'The user has uploaded screenshot(s) of her dating app profile. Analyze the images to extract her bio, prompts, photos, and any relevant details. Use these details as the basis for the openers.'
    : ''

  const bioSection = bio ? `Her prompts/bio: ${bio}` : ''
  const photoSection = photos ? `Photo descriptions: ${photos}` : ''
  const platformSection = `Platform: ${platform || 'Dating App'}`

  return `${imageNote}

${platformSection}
${bioSection}
${photoSection}

Generate 3 opening messages for this profile. No "hey" or generic greetings. Reference something specific from her profile. Make it feel like it came from a real, confident person.${sharedSuffix({ avoid, styleNote })}`.trim()
}

export function buildReplyPrompt({ history, lastMessage, energy, avoid, styleNote }, hasImages) {
  const imageNote = hasImages
    ? 'The user has uploaded screenshot(s) of the conversation. Analyze the images to extract the full conversation history and her last message. Use these as the basis for your replies.'
    : ''

  const historySection = history ? `Conversation so far:\n${history}` : ''
  const lastSection = lastMessage ? `Her last message: ${lastMessage}` : ''
  const energyLabel = ENERGY_LABELS[energy] || 'Flirty'

  return `${imageNote}

${historySection}
${lastSection}
Desired energy: ${energy} (${energyLabel}) — 1=banter, 2=flirty, 3=tension, 4=spicy

Generate 3 replies. Match her energy and raise it slightly based on the desired energy level.${sharedSuffix({ avoid, styleNote })}`.trim()
}

export function buildEscalatePrompt({ fullConvo, goal, energy, avoid, styleNote }, hasImages) {
  const imageNote = hasImages
    ? 'The user has uploaded screenshot(s) of the conversation. Analyze the images to extract the full conversation. Use this as the basis for your replies.'
    : ''

  const convoSection = fullConvo ? `Full conversation:\n${fullConvo}` : ''
  const goalSection = goal ? `Goal: ${goal}` : ''
  const energyLabel = ENERGY_LABELS[energy] || 'Tension'

  return `${imageNote}

${convoSection}
${goalSection}
Escalation energy: ${energy} (${energyLabel}) — 1=banter, 2=flirty, 3=tension, 4=spicy

The vibe is good. Generate 3 replies that escalate the conversation in the direction of the goal. Match the energy level specified. Read her cues carefully before going spicy.${sharedSuffix({ avoid, styleNote })}`.trim()
}
