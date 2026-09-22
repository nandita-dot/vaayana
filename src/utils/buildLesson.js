import { splitIntoSentences, wordAppearsInSentence } from './splitSentences.js'

function slugify(value) {
  return (
    String(value || 'lesson')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'lesson'
  )
}

function vocabId(word) {
  return `v-${slugify(word)}`
}

export function emptyComprehensionDraft() {
  return {
    prompt: '',
    options: ['', '', ''],
    correctIndex: 0,
  }
}

export function buildComprehensionActivity(draft) {
  const prompt = String(draft?.prompt || '').trim()
  const options = (draft?.options || [])
    .map((text, index) => ({
      id: `act-comprehension-${index + 1}`,
      text: String(text || '').trim(),
      emoji: ['🌼', '🌿', '🐦'][index] || '⭐',
      correct: Number(draft?.correctIndex) === index,
    }))
    .filter((option) => option.text)

  if (!prompt || options.length < 2 || !options.some((option) => option.correct)) {
    return null
  }

  return {
    id: 'act-comprehension',
    type: 'comprehension',
    prompt,
    options,
  }
}

export function suggestTitle(text) {
  const [first] = splitIntoSentences(text)
  if (!first) return 'Untitled lesson'
  const withoutEnd = first.replace(/[.!?]+$/g, '').trim()
  return withoutEnd.length > 60 ? `${withoutEnd.slice(0, 57).trim()}…` : withoutEnd
}

export function buildLesson({ title, text, vocabItems, sourceName, comprehensionDraft }) {
  const passageText = String(text || '').trim()
  const sentences = splitIntoSentences(passageText)
  const vocabulary = (vocabItems || []).map((item) => {
    const word = String(item.word || '').trim()
    const meaningMl = String(item.meaningMl || '').trim()
    return {
      id: vocabId(word),
      word,
      emoji: item.emoji || '⭐',
      explanation: {
        en: String(item.explanationEn || '').trim(),
        ml: meaningMl,
      },
      translations: {
        ml: meaningMl,
      },
      example: String(item.example || '').trim(),
      pronunciationHint: String(item.pronunciationHint || ''),
    }
  })

  const passage = sentences.map((sentence, index) => ({
    id: `s${index + 1}`,
    text: sentence,
    vocabRefs: vocabulary
      .filter((item) => wordAppearsInSentence(sentence, item.word))
      .map((item) => item.id),
  }))

  const wordCount = passageText ? passageText.split(/\s+/).length : 0
  const activities = []
  const comprehension = buildComprehensionActivity(comprehensionDraft)
  if (comprehension) activities.push(comprehension)
  activities.push({
    id: 'act-word-challenge',
    type: 'word_challenge',
    prompt: 'Do you remember this word?',
  })

  return {
    id: `lesson-${slugify(title)}-${Date.now().toString(36)}`,
    title: String(title || 'Untitled lesson').trim() || 'Untitled lesson',
    grade: 2,
    language: {
      primary: 'en',
      supportLanguages: ['ml'],
    },
    passage,
    vocabulary,
    activities,
    meta: {
      source: sourceName || 'teacher-extract',
      estimatedMinutes: Math.max(3, Math.min(12, Math.ceil(wordCount / 70) || 3)),
      theme: 'teacher-created',
    },
  }
}
