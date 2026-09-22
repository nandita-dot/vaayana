import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import starterDictionary from '../data/starterDictionary.json'
import { buildLesson, emptyComprehensionDraft, suggestTitle } from '../utils/buildLesson.js'
import { getLessonValidationError } from '../utils/lessonStorage.js'
import { splitIntoSentences, tokenizeSentence } from '../utils/splitSentences.js'
import './TeacherEdit.css'

const EMOJI_CHOICES = [
  '🐦',
  '🌿',
  '🌱',
  '🪶',
  '🌼',
  '🌸',
  '🌳',
  '🍃',
  '🌞',
  '🌙',
  '⭐',
  '❤️',
  '😊',
  '🎉',
  '📚',
  '✏️',
  '🍎',
  '🦋',
  '🐝',
  '🐟',
  '🐸',
  '🌈',
  '💧',
  '🏡',
  '👧',
  '👦',
  '🎵',
  '🐇',
  '🪟',
  '💨',
]

function WordButton({ token, selected, onToggle }) {
  return (
    <button
      type="button"
      className={selected ? 'vocab-word' : 'edit-word'}
      aria-pressed={selected}
      onClick={onToggle}
    >
      {token}
    </button>
  )
}

function VocabEditorCard({ item, onChange }) {
  return (
    <Card className="vocab-editor-card">
      <h2 className="vocab-editor-card__word">{item.word}</h2>
      <fieldset className="emoji-field">
        <legend>Emoji</legend>
        <div className="emoji-grid">
          {EMOJI_CHOICES.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className={
                item.emoji === emoji ? 'emoji-choice emoji-choice--selected' : 'emoji-choice'
              }
              onClick={() => onChange({ emoji })}
              aria-label={`Choose ${emoji}`}
              aria-pressed={item.emoji === emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="edit-field">
        English explanation
        <input
          type="text"
          value={item.explanationEn}
          onChange={(event) => onChange({ explanationEn: event.target.value })}
        />
      </label>
      <label className="edit-field">
        Malayalam meaning
        <input
          type="text"
          lang="ml"
          className="edit-field__ml"
          value={item.meaningMl}
          onChange={(event) => onChange({ meaningMl: event.target.value })}
        />
      </label>
      <label className="edit-field">
        Example sentence
        <input
          type="text"
          value={item.example}
          onChange={(event) => onChange({ example: event.target.value })}
        />
      </label>
    </Card>
  )
}

function TeacherEdit() {
  const navigate = useNavigate()
  const location = useLocation()
  const text = String(location.state?.text || '').trim()
  const sourceName = location.state?.fileName || location.state?.kind || 'teacher-extract'
  const sentences = useMemo(() => splitIntoSentences(text), [text])
  const [title, setTitle] = useState(
    () => location.state?.title || suggestTitle(text),
  )
  const [vocabItems, setVocabItems] = useState(() =>
    Array.isArray(location.state?.vocabItems) ? location.state.vocabItems : [],
  )
  const [comprehension, setComprehension] = useState(
    () => location.state?.comprehension || emptyComprehensionDraft(),
  )
  const [assembleError, setAssembleError] = useState('')

  const selectedWords = useMemo(
    () => new Set(vocabItems.map((item) => item.word)),
    [vocabItems],
  )

  const toggleWord = (rawWord, sentence) => {
    const word = rawWord.toLowerCase()
    setVocabItems((current) => {
      if (current.some((item) => item.word === word)) {
        return current.filter((item) => item.word !== word)
      }

      const dict = starterDictionary[word]
      return [
        ...current,
        {
          word,
          emoji: dict?.emoji || '⭐',
          explanationEn: dict?.en || '',
          meaningMl: '',
          example: sentence,
          pronunciationHint: '',
        },
      ]
    })
  }

  const updateVocab = (word, patch) => {
    setVocabItems((current) =>
      current.map((item) => (item.word === word ? { ...item, ...patch } : item)),
    )
  }

  const handleContinue = () => {
    const lesson = buildLesson({
      title,
      text,
      vocabItems,
      sourceName,
      comprehensionDraft: comprehension,
    })
    const error = getLessonValidationError(lesson)
    if (error) {
      setAssembleError(error)
      return
    }
    setAssembleError('')
    console.log('Vaayana lesson', lesson)
    window.__vaayanaLastLesson = lesson
    navigate('/teacher/preview', {
      state: {
        lesson,
        text,
        title,
        vocabItems,
        comprehension,
        fileName: location.state?.fileName,
        kind: location.state?.kind,
      },
    })
  }

  if (!text) {
    return (
      <main className="page">
        <Card className="page-card">
          <h1>No text yet</h1>
          <p className="page-copy">Review extracted text first, then choose vocabulary.</p>
          <Button variant="primary" to="/teacher">
            Back to upload
          </Button>
        </Card>
      </main>
    )
  }

  const canContinue = vocabItems.length > 0 && title.trim()

  return (
    <main className="edit-page">
      <div className="edit-column">
        <Card className="edit-intro">
          <h1>Choose vocabulary</h1>
          <p className="page-copy">
            Tap a word in the story to add it. Tap again to remove it. Selected words use the same
            highlight students will see.
          </p>
          <p className="extract-meta">
            Sentences are split on periods, question marks, and exclamation points — a simple V1
            rule, not a full grammar check.
          </p>
          <label className="edit-field">
            Lesson title
            <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
        </Card>

        <Card className="edit-passage-card">
          <div className="passage">
            {sentences.map((sentence, sentenceIndex) => (
              <p key={`s-${sentenceIndex}`} className="passage__sentence">
                {tokenizeSentence(sentence).map((token, tokenIndex) => {
                  if (!token.isWord) {
                    return <span key={`t-${sentenceIndex}-${tokenIndex}`}>{token.value}</span>
                  }

                  const selected = selectedWords.has(token.value.toLowerCase())
                  return (
                    <WordButton
                      key={`t-${sentenceIndex}-${tokenIndex}`}
                      token={token.value}
                      selected={selected}
                      onToggle={() => toggleWord(token.value, sentence)}
                    />
                  )
                })}
              </p>
            ))}
          </div>
        </Card>

        <section className="vocab-editor-list" aria-label="Vocabulary editors">
          <h2 className="vocab-editor-list__title">
            {vocabItems.length ? `Word cards (${vocabItems.length})` : 'Word cards'}
          </h2>
          {vocabItems.length === 0 ? (
            <p className="page-copy">Tap words above to start a card for each one.</p>
          ) : (
            vocabItems.map((item) => (
              <VocabEditorCard
                key={item.word}
                item={item}
                onChange={(patch) => updateVocab(item.word, patch)}
              />
            ))
          )}
        </section>

        <Card className="vocab-editor-card">
          <h2 className="vocab-editor-list__title">Comprehension question</h2>
          <p className="extract-meta">
            Optional. A question about the story, with up to three answers. Leave it blank to skip.
          </p>
          <label className="edit-field">
            Question
            <input
              type="text"
              value={comprehension.prompt}
              onChange={(event) =>
                setComprehension((current) => ({ ...current, prompt: event.target.value }))
              }
            />
          </label>
          {comprehension.options.map((option, index) => (
            <label key={`option-${index}`} className="edit-field comprehension-option">
              <span className="comprehension-option__row">
                <input
                  type="radio"
                  name="comprehension-correct"
                  checked={comprehension.correctIndex === index}
                  onChange={() =>
                    setComprehension((current) => ({ ...current, correctIndex: index }))
                  }
                />
                Answer {index + 1}
                {comprehension.correctIndex === index ? ' (correct)' : ''}
              </span>
              <input
                type="text"
                value={option}
                onChange={(event) =>
                  setComprehension((current) => {
                    const options = [...current.options]
                    options[index] = event.target.value
                    return { ...current, options }
                  })
                }
              />
            </label>
          ))}
        </Card>

        {assembleError ? (
          <p className="teacher-error" role="alert">
            {assembleError}
          </p>
        ) : null}

        <div className="extract-actions">
          <Button variant="primary" size="large" disabled={!canContinue} onClick={handleContinue}>
            Continue to preview
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back to text
          </Button>
        </div>
      </div>
    </main>
  )
}

export default TeacherEdit
