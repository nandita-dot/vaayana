const LESSON_PREFIX = 'vaayana-lessons:'
const INDEX_KEY = `${LESSON_PREFIX}index`

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function lessonKey(id) {
  return `${LESSON_PREFIX}${id}`
}

export function getLessonValidationError(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return 'This file does not look like a story we can open.'
  }

  if (typeof data.id !== 'string' || !data.id.trim()) {
    return 'This story is missing a name we can save.'
  }

  if (typeof data.title !== 'string' || !data.title.trim()) {
    return 'This story is missing a title.'
  }

  if (!Array.isArray(data.passage) || data.passage.length === 0) {
    return 'This story is missing its reading text.'
  }

  if (!Array.isArray(data.vocabulary) || data.vocabulary.length === 0) {
    return 'This story is missing words to learn.'
  }

  return null
}

function readIndex() {
  if (!canUseStorage()) return []

  try {
    const raw = window.localStorage.getItem(INDEX_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeIndex(entries) {
  if (!canUseStorage()) return
  try {
    window.localStorage.setItem(INDEX_KEY, JSON.stringify(entries))
  } catch {
    // Ignore quota / private-mode failures; callers still have the in-memory lesson.
  }
}

export function listLessons() {
  return readIndex().filter((entry) => entry && entry.id && entry.title)
}

export function getLesson(id) {
  if (!id || !canUseStorage()) return null

  try {
    const raw = window.localStorage.getItem(lessonKey(id))
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return getLessonValidationError(parsed) ? null : parsed
  } catch {
    return null
  }
}

export function getDefaultLesson() {
  const [first] = listLessons()
  return first ? getLesson(first.id) : null
}

export function assignLessonId(lesson) {
  if (lesson && typeof lesson.id === 'string' && lesson.id.trim()) {
    return lesson
  }

  const slug = safeFilename(lesson?.title || 'lesson')
  return {
    ...lesson,
    id: `lesson-${slug}-${Date.now().toString(36)}`,
  }
}

export function saveLesson(lesson) {
  const error = getLessonValidationError(lesson)
  if (error) {
    throw new Error(error)
  }

  if (canUseStorage()) {
    try {
      window.localStorage.setItem(lessonKey(lesson.id), JSON.stringify(lesson))
      const index = readIndex().filter((entry) => entry.id !== lesson.id)
      index.push({ id: lesson.id, title: lesson.title })
      writeIndex(index)
    } catch {
      // Keep going so export/import still works even if storage is blocked.
    }
  }

  return lesson
}

export function seedLessonsIfEmpty(sampleLesson) {
  if (listLessons().length > 0) return listLessons()
  if (sampleLesson) saveLesson(sampleLesson)
  return listLessons()
}

function safeFilename(name) {
  return String(name || 'lesson')
    .trim()
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'lesson'
}

export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.json') ? filename : `${filename}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function exportLessonFile(lesson) {
  const error = getLessonValidationError(lesson)
  if (error) {
    throw new Error(error)
  }
  downloadJson(`${safeFilename(lesson.id)}.json`, lesson)
}

export function exportProgressFile(progress, lessonId) {
  const payload = progress || {
    lessonId: lessonId || '',
    wordsViewed: [],
    activityResults: [],
    completedAt: null,
  }
  downloadJson(`${safeFilename(payload.lessonId || lessonId || 'progress')}-progress.json`, payload)
}

export function importLessonFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Please choose a story file.'))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || ''))
        const error = getLessonValidationError(parsed)
        if (error) {
          reject(new Error(error))
          return
        }
        resolve(saveLesson(parsed))
      } catch (caught) {
        if (caught instanceof SyntaxError) {
          reject(new Error('This file is not a story we can read. Please try another.'))
          return
        }
        reject(caught instanceof Error ? caught : new Error('We could not open that file as a story.'))
      }
    }
    reader.onerror = () => {
      reject(new Error('We could not read that file. Please try again.'))
    }
    reader.readAsText(file)
  })
}
