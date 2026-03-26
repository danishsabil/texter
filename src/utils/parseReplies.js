export function parseReplies(raw) {
  const cleaned = raw.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
  try {
    const parsed = JSON.parse(cleaned)
    if (!parsed.replies || parsed.replies.length !== 3) throw new Error('Unexpected structure')
    return parsed.replies
  } catch {
    throw new Error('Failed to parse response. Try again.')
  }
}
