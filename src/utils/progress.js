const STORAGE_PREFIX = 'vaayana-progress:'

export function emptyProgress(lessonId) {
  return {
    lessonId: lessonId || '',
    wordsViewed: [],
    activityResults: [],
    completedAt: null,
  }
}

function storageKey(lessonId) {
  return `${STORAGE_PREFIX}${lessonId}`
}

export function getProgress(lessonId) {
  const fallback = emptyProgress(lessonId)

  if (!lessonId || typeof window === 'undefined' || !window.localStorage) {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(storageKey(lessonId))
    if (!raw) return fallback

    const parsed = JSON.parse(raw)
    return {
      lessonId: parsed.lessonId || lessonId,
      wordsViewed: Array.isArray(parsed.wordsViewed) ? parsed.wordsViewed : [],
      activityResults: Array.isArray(parsed.activityResults) ? parsed.activityResults : [],
      completedAt: parsed.completedAt || null,
    }
  } catch {
    return fallback
  }
}

export function saveProgress(lessonId, progress) {
  if (!lessonId || typeof window === 'undefined' || !window.localStorage) {
    return emptyProgress(lessonId)
  }

  const next = {
    ...emptyProgress(lessonId),
    ...progress,
    lessonId,
  }

  try {
    window.localStorage.setItem(storageKey(lessonId), JSON.stringify(next))
  } catch {
    return next
  }

  return next
}

export function recordWordViewed(lessonId, wordId) {
  if (!wordId) return getProgress(lessonId)

  const progress = getProgress(lessonId)
  if (progress.wordsViewed.includes(wordId)) return progress

  return saveProgress(lessonId, {
    ...progress,
    wordsViewed: [...progress.wordsViewed, wordId],
  })
}

export function recordActivityResult(lessonId, activityId, correct) {
  if (!activityId) return getProgress(lessonId)

  const progress = getProgress(lessonId)
  const activityResults = progress.activityResults.filter((item) => item.activityId !== activityId)
  activityResults.push({ activityId, correct: Boolean(correct) })

  return saveProgress(lessonId, {
    ...progress,
    activityResults,
  })
}

export function markLessonComplete(lessonId) {
  const progress = getProgress(lessonId)
  return saveProgress(lessonId, {
    ...progress,
    completedAt: new Date().toISOString(),
  })
}

export function listAllViewedWordIds() {
  if (typeof window === 'undefined' || !window.localStorage) return []

  const ids = []
  const seen = new Set()

  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index)
      if (!key || !key.startsWith(STORAGE_PREFIX)) continue

      const lessonId = key.slice(STORAGE_PREFIX.length)
      for (const wordId of getProgress(lessonId).wordsViewed) {
        if (!wordId || seen.has(wordId)) continue
        seen.add(wordId)
        ids.push(wordId)
      }
    }
  } catch {
    return ids
  }

  return ids
}
