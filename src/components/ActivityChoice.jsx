import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Button from './Button.jsx'
import './ActivityChoice.css'

function ActivityChoice({ activity, vocabulary = [], onFinished, onResult }) {
  const [selectedId, setSelectedId] = useState(null)
  const [status, setStatus] = useState(null)
  const finishedRef = useRef(false)
  const firstAttemptRef = useRef(false)
  const onFinishedRef = useRef(onFinished)
  const onResultRef = useRef(onResult)
  const reduce = useReducedMotion()
  const targetVocab = vocabulary.find((item) => item.id === activity.targetVocabId)

  onFinishedRef.current = onFinished
  onResultRef.current = onResult

  const finish = () => {
    if (finishedRef.current) return
    finishedRef.current = true
    onFinishedRef.current()
  }

  useEffect(() => {
    if (status !== 'correct') return undefined

    const timer = window.setTimeout(finish, 1200)
    return () => window.clearTimeout(timer)
  }, [status])

  const handleSelect = (option) => {
    if (status === 'correct') return

    if (!firstAttemptRef.current) {
      firstAttemptRef.current = true
      onResultRef.current?.({
        activityId: activity.id,
        correct: Boolean(option.correct),
      })
    }

    setSelectedId(option.id)
    setStatus(option.correct ? 'correct' : 'incorrect')
  }

  return (
    <div className="choice-activity">
      <h1 className="choice-activity__prompt">{activity.prompt}</h1>
      {targetVocab ? (
        <div className="choice-activity__target">
          <span className="choice-activity__emoji" aria-hidden="true">
            {targetVocab.emoji}
          </span>
          <p className="choice-activity__word">{targetVocab.word}</p>
        </div>
      ) : null}
      <div className="choice-activity__options" role="group" aria-label="Practice choices">
        {activity.options.map((option) => {
          const isSelected = selectedId === option.id
          const className = [
            'option-card',
            isSelected && status === 'correct' && 'option-card--correct',
            isSelected && status === 'incorrect' && 'option-card--try-again',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <motion.button
              key={option.id}
              type="button"
              className={className}
              disabled={status === 'correct'}
              onClick={() => handleSelect(option)}
              whileHover={reduce || status === 'correct' ? undefined : { y: -2, scale: 1.01 }}
              whileTap={reduce || status === 'correct' ? undefined : { scale: 0.97 }}
              animate={
                reduce
                  ? undefined
                  : isSelected && status === 'incorrect'
                    ? { x: [0, -7, 7, -4, 4, 0] }
                    : isSelected && status === 'correct'
                      ? { scale: [1, 1.03, 1] }
                      : { x: 0, scale: 1 }
              }
              transition={{ duration: 0.32, ease: 'easeOut' }}
            >
              {option.emoji ? (
                <span className="option-card__emoji" aria-hidden="true">
                  {option.emoji}
                </span>
              ) : null}
              <span>{option.text}</span>
              {isSelected && status === 'correct' ? (
                <span className="option-card__sparkles" aria-hidden="true">
                  ✦
                </span>
              ) : null}
            </motion.button>
          )
        })}
      </div>
      {status === 'correct' ? (
        <p className="activity-feedback activity-feedback--correct" role="status">
          🎉 Great!
        </p>
      ) : null}
      {status === 'incorrect' ? (
        <p className="activity-feedback activity-feedback--incorrect" role="status">
          Not quite — try again!
        </p>
      ) : null}
      {status === 'correct' ? (
        <Button variant="primary" size="large" onClick={finish}>
          Next
        </Button>
      ) : null}
    </div>
  )
}

export default ActivityChoice
