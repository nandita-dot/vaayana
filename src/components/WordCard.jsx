import { useEffect, useId, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Button from './Button.jsx'
import Card from './Card.jsx'
import {
  findVoiceByLangPrefix,
  isSpeechSupported,
  speakText,
  stopSpeech,
} from '../utils/speech.js'
import './WordCard.css'

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22 } },
}

function WordCard({ vocabulary, onClose }) {
  const titleId = useId()
  const cardRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const [canSpeak, setCanSpeak] = useState(false)
  const [malayalamVoice, setMalayalamVoice] = useState(null)
  const reduce = useReducedMotion()

  onCloseRef.current = onClose

  useEffect(() => {
    if (!isSpeechSupported()) {
      setCanSpeak(false)
      setMalayalamVoice(null)
      return undefined
    }

    setCanSpeak(true)

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      setMalayalamVoice(findVoiceByLangPrefix(voices, 'ml'))
    }

    updateVoices()
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices)

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', updateVoices)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cardRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      stopSpeech()
    }
  }, [])

  if (!vocabulary) return null

  const malayalamWord = vocabulary.translations?.ml
  const malayalamMeaning = vocabulary.explanation?.ml
  const pronunciation = vocabulary.pronunciationHint
  const englishVoiceLang = 'en-US'
  const stagger = reduce ? 0 : 0.06

  return (
    <motion.div
      className="word-card-overlay"
      onClick={onClose}
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.01 : 0.22 }}
    >
      <Card
        className="word-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={cardRef}
        onClick={(event) => event.stopPropagation()}
      >
        <motion.div
          className="word-card__motion"
          initial={reduce ? false : { opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
          transition={
            reduce
              ? { duration: 0.01 }
              : { type: 'spring', stiffness: 320, damping: 26, mass: 0.8 }
          }
        >
          <motion.div
            className="word-card__inner"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: stagger } },
            }}
          >
            <motion.div className="word-card__emoji" aria-hidden="true" variants={item}>
              {vocabulary.emoji}
            </motion.div>
            <motion.h2 id={titleId} className="word-card__word" variants={item}>
              {vocabulary.word}
            </motion.h2>
            {malayalamWord || malayalamMeaning ? (
              <motion.p className="word-card__malayalam" lang="ml" variants={item}>
                {malayalamWord ? (
                  <span className="word-card__malayalam-word">{malayalamWord}</span>
                ) : null}
                {malayalamMeaning}
              </motion.p>
            ) : null}
            {pronunciation ? (
              <motion.p className="word-card__pronunciation" variants={item}>
                Sounds like {pronunciation}
              </motion.p>
            ) : null}
            <motion.p className="word-card__explanation" variants={item}>
              {vocabulary.explanation?.en}
            </motion.p>
            {vocabulary.example ? (
              <motion.p className="word-card__example" variants={item}>
                {vocabulary.example}
              </motion.p>
            ) : null}
            <motion.div className="word-card__actions" variants={item}>
              {canSpeak ? (
                <Button
                  variant="secondary"
                  onClick={() => speakText(vocabulary.word, { lang: englishVoiceLang })}
                >
                  🔊 Listen
                </Button>
              ) : null}
              {canSpeak && malayalamVoice && malayalamWord ? (
                <Button
                  variant="secondary"
                  onClick={() =>
                    speakText(malayalamWord, { lang: malayalamVoice.lang, voice: malayalamVoice })
                  }
                >
                  🔊 Malayalam
                </Button>
              ) : null}
              {malayalamWord && canSpeak && !malayalamVoice ? (
                <p className="word-card__voice-note">
                  Malayalam sound isn&apos;t available on this device, but you can still read the
                  words.
                </p>
              ) : null}
              {!canSpeak ? (
                <p className="word-card__voice-note">Listening isn&apos;t available on this device.</p>
              ) : null}
              <Button variant="primary" onClick={onClose}>
                Got it
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  )
}

export default WordCard
