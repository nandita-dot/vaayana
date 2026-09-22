/**
 * V1 splitter: break on ., ?, or !. This is a known simplification,
 * not a robust NLP sentence splitter (abbreviations like "Dr." can split early).
 */
export function splitIntoSentences(text) {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim()
  if (!normalized) return []

  const matches = normalized.match(/[^.!?]+(?:[.!?]+|$)/g)
  return (matches || [normalized]).map((part) => part.trim()).filter(Boolean)
}

export function tokenizeSentence(sentence) {
  const tokens = []
  const pattern = /[A-Za-z]+(?:'[A-Za-z]+)?|[^A-Za-z]+/g
  let match

  while ((match = pattern.exec(sentence)) !== null) {
    const value = match[0]
    tokens.push({
      value,
      isWord: /^[A-Za-z]/.test(value),
    })
  }

  return tokens
}

export function wordAppearsInSentence(sentence, word) {
  if (!sentence || !word) return false
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\b${escaped}\\b`, 'i').test(sentence)
}
