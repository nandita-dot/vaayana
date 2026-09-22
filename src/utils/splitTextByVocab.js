function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function splitTextByVocab(text, vocabItems) {
  if (!text) return []
  if (!vocabItems.length) return [{ type: 'text', value: text }]

  const sorted = [...vocabItems].sort((a, b) => b.word.length - a.word.length)
  const pattern = new RegExp(`\\b(${sorted.map((item) => escapeRegExp(item.word)).join('|')})\\b`, 'gi')
  const parts = []
  let lastIndex = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) })
    }

    const value = match[0]
    const vocab = sorted.find((item) => item.word.toLowerCase() === value.toLowerCase())
    parts.push({ type: 'vocab', value, vocab })
    lastIndex = match.index + value.length
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) })
  }

  return parts
}
