import { motion, useReducedMotion } from 'motion/react'
import { useParams } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import StorybookScene from '../components/StorybookScene.jsx'
import { getLesson, exportLessonFile, exportProgressFile } from '../utils/lessonStorage.js'
import { getProgress } from '../utils/progress.js'
import './StudentProgress.css'
import './Lessons.css'

function StudentProgress() {
  const { lessonId } = useParams()
  const lesson = getLesson(lessonId)
  const progress = getProgress(lessonId)
  const wordsLearned = progress.wordsViewed.length
  const totalActivities = lesson?.activities?.length ?? 0
  const correctCount = progress.activityResults.filter((item) => item.correct).length
  const storyDone = Boolean(progress.completedAt)
  const reduce = useReducedMotion()
  const item = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  if (!lesson) {
    return (
      <main className="page">
        <StorybookScene />
        <Card className="page-card">
          <h1>We could not find that story</h1>
          <p className="page-copy">The reading path may have changed. Home is a good place to start again.</p>
          <Button variant="primary" to="/">
            Back to home
          </Button>
        </Card>
      </main>
    )
  }

  return (
    <main className="progress-page">
      <StorybookScene />
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.08 } } }}
      >
        <Card className="progress-card card--paper">
          <motion.div
            className="progress-sparkles"
            aria-hidden="true"
            variants={item}
            initial={reduce ? false : { scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={
              reduce ? { duration: 0.01 } : { type: 'spring', stiffness: 280, damping: 16 }
            }
          >
            <span>✦</span>
            <span className="progress-hero">{storyDone ? '🌟' : '📖'}</span>
            <span>✦</span>
          </motion.div>
          <motion.p className="progress-kicker" variants={item}>
            {storyDone ? 'Nice work today' : 'Your story so far'}
          </motion.p>
          <motion.h1 className="progress-title" variants={item}>
            {storyDone ? 'You did it!' : 'Keep going!'}
          </motion.h1>
          <motion.p className="progress-message" variants={item}>
            {storyDone
              ? 'What a lovely time with this story. Come back whenever you want to read again.'
              : 'Nothing is lost if you are just starting. Open the story and explore at your own pace.'}
          </motion.p>
          <motion.ul className="progress-stats" variants={item}>
            <li className="progress-stat">
              <span className="progress-stat__icon" aria-hidden="true">
                ⭐
              </span>
              <span className="progress-stat__value">{wordsLearned}</span>
              <span className="progress-stat__label">words learned</span>
            </li>
            <li className="progress-stat">
              <span className="progress-stat__icon" aria-hidden="true">
                📖
              </span>
              <span className="progress-stat__value">{storyDone ? 'Yes' : 'Not yet'}</span>
              <span className="progress-stat__label">Story completed</span>
            </li>
            <li className="progress-stat">
              <span className="progress-stat__icon" aria-hidden="true">
                🎯
              </span>
              <span className="progress-stat__value">
                {correctCount}/{totalActivities}
              </span>
              <span className="progress-stat__label">correct</span>
            </li>
          </motion.ul>
          <motion.div variants={item} style={{ width: '100%' }}>
            <Button variant="primary" size="large" to="/lessons">
              Choose another story
            </Button>
          </motion.div>
          <motion.div variants={item} style={{ width: '100%' }}>
            <Button variant="secondary" to="/">
              Back to home
            </Button>
          </motion.div>
          <motion.div className="utility-actions" variants={item}>
            <Button
              variant="secondary"
              className="btn--utility"
              onClick={() => {
                if (lesson) exportLessonFile(lesson)
              }}
            >
              Export lesson
            </Button>
            <Button
              variant="secondary"
              className="btn--utility"
              onClick={() => exportProgressFile(progress, lessonId)}
            >
              Export progress
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </main>
  )
}

export default StudentProgress
