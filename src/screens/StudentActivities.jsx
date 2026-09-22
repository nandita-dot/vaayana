import { useCallback, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useNavigate, useParams } from 'react-router-dom'
import ActivityDispatcher from '../components/ActivityDispatcher.jsx'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import StorybookScene from '../components/StorybookScene.jsx'
import { markLessonComplete, recordActivityResult } from '../utils/progress.js'
import { getLesson } from '../utils/lessonStorage.js'
import './StudentActivities.css'

function StudentActivities({
  lesson: lessonProp,
  preview = false,
  onBackToReading,
  onComplete,
} = {}) {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const [activityIndex, setActivityIndex] = useState(0)
  const lesson = lessonProp || getLesson(lessonId)
  const activities = lesson?.activities ?? []
  const activity = activities[activityIndex]
  const reduce = useReducedMotion()

  const handleResult = useCallback(
    ({ activityId, correct }) => {
      if (preview) return
      recordActivityResult(lessonId, activityId, correct)
    },
    [lessonId, preview],
  )

  const handleFinished = useCallback(() => {
    if (activityIndex >= activities.length - 1) {
      if (preview) {
        onComplete?.()
        return
      }
      markLessonComplete(lessonId)
      navigate(`/student/complete/${lessonId}`)
      return
    }
    setActivityIndex((index) => index + 1)
  }, [activityIndex, activities.length, lessonId, navigate, onComplete, preview])

  if (!lesson) {
    return (
      <main className="page">
        <StorybookScene />
        <Card className="page-card">
          <h1>We could not find that story</h1>
          <p className="page-copy">Let&apos;s go back and pick a story that is ready.</p>
          <Button variant="secondary" to="/">
            Back to home
          </Button>
        </Card>
      </main>
    )
  }

  if (!activity) {
    return (
      <main className="page">
        <StorybookScene />
        <Card className="page-card">
          <h1>Nice reading!</h1>
          <p className="page-copy">You finished the story. A little practice will appear here when it is ready.</p>
          {onComplete ? (
            <Button variant="primary" onClick={onComplete}>
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              to={`/student/complete/${lessonId}`}
              onClick={() => markLessonComplete(lessonId)}
            >
              Continue
            </Button>
          )}
        </Card>
      </main>
    )
  }

  const progress = ((activityIndex + 1) / activities.length) * 100

  return (
    <main className="activity-page">
      <StorybookScene />
      <div className="activity-column">
        <div className="reading-toolbar">
          {onBackToReading ? (
            <Button variant="secondary" onClick={onBackToReading}>
              Back to story
            </Button>
          ) : (
            <Button variant="secondary" to={`/student/read/${lessonId}`}>
              Back to story
            </Button>
          )}
        </div>
        <ProgressBar
          value={progress}
          label={`Practice ${activityIndex + 1} of ${activities.length}`}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={activity.id}
            initial={reduce ? false : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -28 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          >
            <Card className="card--paper">
              <ActivityDispatcher
                activity={activity}
                lesson={lesson}
                vocabulary={lesson.vocabulary}
                onFinished={handleFinished}
                onResult={handleResult}
              />
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

export default StudentActivities
