import { listLessons, getLesson } from './lessonStorage.js'
import { listAllViewedWordIds } from './progress.js'

function shuffle(items) {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swap]] = [next[swap], next[index]]
  }
  return next
}

export function collectViewedVocabulary(currentLesson) {
  const byId = new Map()

  for (const item of currentLesson?.vocabulary || []) {
    if (item?.id) byId.set(item.id, item)
  }

  for (const entry of listLessons()) {
    const lesson = getLesson(entry.id)
    for (const item of lesson?.vocabulary || []) {
      if (item?.id) byId.set(item.id, item)
    }
  }

  return listAllViewedWordIds()
    .map((id) => byId.get(id))
    .filter(Boolean)
}

const FALLBACK_DISTRACTORS = [
  { text: 'A kind of weather', emoji: '🌧️' },
  { text: 'A tool for writing', emoji: '✏️' },
]

export function buildWordChallengeActivity({ activity, lesson }) {
  const viewed = collectViewedVocabulary(lesson)
  if (viewed.length === 0) {
    return { empty: true }
  }

  const target = viewed[viewed.length - 1]
  const meaning = target.explanation?.en
  if (!meaning) {
    return { empty: true }
  }

  const distractorPool = [...(lesson?.vocabulary || []), ...viewed].filter(
    (item) => item.id !== target.id && item.explanation?.en,
  )
  const uniqueMeanings = new Map()
  for (const item of distractorPool) {
    if (!uniqueMeanings.has(item.explanation.en)) {
      uniqueMeanings.set(item.explanation.en, item)
    }
  }

  const distractors = [...uniqueMeanings.values()].slice(0, 2)
  while (distractors.length < 2) {
    const fallback = FALLBACK_DISTRACTORS[distractors.length]
    distractors.push({ id: `fallback-${distractors.length}`, emoji: fallback.emoji, explanation: { en: fallback.text } })
  }

  const options = shuffle([
    {
      id: `${activity.id}-${target.id}-correct`,
      text: meaning,
      emoji: target.emoji,
      correct: true,
    },
    ...distractors.slice(0, 2).map((item, index) => ({
      id: `${activity.id}-d${index}`,
      text: item.explanation.en,
      emoji: item.emoji || '⭐',
      correct: false,
    })),
  ])

  return {
    empty: false,
    activity: {
      id: activity.id,
      type: 'word_challenge',
      prompt: activity.prompt || 'Do you remember this word?',
      targetVocabId: target.id,
      options,
    },
    vocabulary: [target, ...distractors],
  }
}
