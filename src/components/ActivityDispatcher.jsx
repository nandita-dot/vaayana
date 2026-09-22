import ActivityChoice from './ActivityChoice.jsx'
import WordChallenge from './WordChallenge.jsx'

const activityViews = {
  meaning_choice: ActivityChoice,
  find_the_word: ActivityChoice,
  comprehension: ActivityChoice,
  word_challenge: WordChallenge,
}

function ActivityDispatcher({ activity, vocabulary, lesson, onFinished, onResult }) {
  if (!activity) return null

  const View = activityViews[activity.type]
  if (!View) {
    return (
      <p className="page-copy">
        A little practice is coming soon.
      </p>
    )
  }

  return (
    <View
      activity={activity}
      vocabulary={vocabulary}
      lesson={lesson}
      onFinished={onFinished}
      onResult={onResult}
    />
  )
}

export default ActivityDispatcher
