import { useState } from 'react'
import Button from './Button.jsx'
import ActivityChoice from './ActivityChoice.jsx'
import { buildWordChallengeActivity } from '../utils/wordChallenge.js'
import './ActivityChoice.css'

function WordChallenge({ activity, lesson, onFinished, onResult }) {
  const [built] = useState(() => buildWordChallengeActivity({ activity, lesson }))

  if (built.empty) {
    return (
      <div className="choice-activity">
        <h1 className="choice-activity__prompt">Come back after learning more words!</h1>
        <p className="page-copy">
          Open a story and tap the highlighted words. This review will be waiting when you have a
          few favorites.
        </p>
        <Button variant="primary" size="large" onClick={onFinished}>
          Continue
        </Button>
      </div>
    )
  }

  return (
    <ActivityChoice
      activity={built.activity}
      vocabulary={built.vocabulary}
      onFinished={onFinished}
      onResult={onResult}
    />
  )
}

export default WordChallenge
