import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useParams } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import StorybookScene from '../components/StorybookScene.jsx'
import WordCard from '../components/WordCard.jsx'
import { getDefaultLesson, getLesson } from '../utils/lessonStorage.js'
import { recordWordViewed } from '../utils/progress.js'
import { getScrollProgress, isPassageComplete } from '../utils/scrollProgress.js'
import { splitTextByVocab } from '../utils/splitTextByVocab.js'
import './StudentReading.css'

function PassageSentence({ sentence, vocabById, onVocabTap, delay, reduce }) {
  const vocabItems = (sentence.vocabRefs || [])
    .map((id) => vocabById.get(id))
    .filter(Boolean)
  const parts = splitTextByVocab(sentence.text, vocabItems)

  return (
    <motion.p
      className="passage__sentence"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay, ease: 'easeOut' }}
    >
      {parts.map((part, index) => {
        if (part.type !== 'vocab' || !part.vocab) {
          return <span key={`${sentence.id}-${index}`}>{part.value}</span>
        }

        return (
          <motion.button
            key={`${sentence.id}-${index}`}
            type="button"
            className="vocab-word"
            onClick={() => onVocabTap(part.vocab.id)}
            whileHover={reduce ? undefined : { scale: 1.04, y: -1 }}
            whileTap={reduce ? undefined : { scale: 0.96 }}
            transition={{ duration: 0.16 }}
          >
            {part.value}
          </motion.button>
        )
      })}
    </motion.p>
  )
}

function StudentReading({ lesson: lessonProp, preview = false, onContinue } = {}) {
  const { lessonId } = useParams()
  const storedLesson = useMemo(() => {
    if (lessonProp) return null
    return lessonId ? getLesson(lessonId) : getDefaultLesson()
  }, [lessonId, lessonProp])
  const lesson = lessonProp || storedLesson
  const [progress, setProgress] = useState(0)
  const [activeVocab, setActiveVocab] = useState(null)
  const reduce = useReducedMotion()

  const vocabById = useMemo(() => {
    return new Map((lesson?.vocabulary || []).map((item) => [item.id, item]))
  }, [lesson])

  useEffect(() => {
    const updateProgress = () => {
      setProgress(getScrollProgress())
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [lesson?.id])

  if (!lesson) {
    const lookingUp = Boolean(lessonId)
    return (
      <main className="page">
        <StorybookScene />
        <Card className="page-card">
          <h1>{lookingUp ? 'We could not find that story' : 'No stories yet'}</h1>
          <p className="page-copy">
            {lookingUp
              ? 'It may have been moved. Ask a grown-up for another story, or go back home.'
              : 'Ask a grown-up to add a story, then come back when you are ready to read.'}
          </p>
          <Button variant="primary" to="/">
            Back to home
          </Button>
        </Card>
      </main>
    )
  }

  const enter = reduce ? 0 : 0.08

  return (
    <main className="reading-page">
      <StorybookScene />
      <div className="reading-column">
        {preview ? null : (
          <motion.div
            className="reading-toolbar"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            <Button variant="secondary" to="/">
              Back to home
            </Button>
          </motion.div>
        )}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: enter }}
        >
          <ProgressBar value={progress} label="Reading progress" />
        </motion.div>
        <motion.div
          className="reading-paper-wrap"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: enter * 2 }}
        >
          <Card className="reading-paper">
            <motion.h1
              className="reading-title"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, delay: enter * 2 }}
            >
              {lesson.title}
            </motion.h1>
            <div className="passage">
              {lesson.passage.map((sentence, index) => (
                <PassageSentence
                  key={sentence.id || `sentence-${index}`}
                  sentence={sentence}
                  vocabById={vocabById}
                  delay={reduce ? 0 : 0.22 + index * 0.07}
                  reduce={reduce}
                  onVocabTap={(id) => {
                    const vocab = lesson.vocabulary.find((item) => item.id === id)
                    if (vocab) {
                      if (!preview) recordWordViewed(lesson.id, id)
                      setActiveVocab(vocab)
                    }
                  }}
                />
              ))}
            </div>
          </Card>
        </motion.div>
        {isPassageComplete(progress) ? (
          onContinue ? (
            <Button variant="primary" size="large" onClick={onContinue}>
              Continue
            </Button>
          ) : (
            <Button variant="primary" size="large" to={`/student/activity/${lesson.id}`}>
              Continue
            </Button>
          )
        ) : null}
      </div>
      <AnimatePresence>
        {activeVocab ? (
          <WordCard
            key={activeVocab.id}
            vocabulary={activeVocab}
            onClose={() => setActiveVocab(null)}
          />
        ) : null}
      </AnimatePresence>
    </main>
  )
}

export default StudentReading
