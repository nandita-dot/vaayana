import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import { exportLessonFile } from '../utils/lessonStorage.js'
import './StudentProgress.css'
import './TeacherPublished.css'

function TeacherPublished() {
  const lesson = useLocation().state?.lesson
  const [error, setError] = useState('')

  if (!lesson) {
    return (
      <main className="page">
        <Card className="page-card">
          <h1>No lesson yet</h1>
          <p className="page-copy">Publish a lesson from preview first.</p>
          <Button variant="primary" to="/teacher">
            Back to teacher home
          </Button>
        </Card>
      </main>
    )
  }

  return (
    <main className="progress-page">
      <Card className="progress-card">
        <p className="progress-kicker" aria-hidden="true">
          🎉
        </p>
        <h1 className="progress-title">Lesson published!</h1>
        <p className="progress-message">
          “{lesson.title}” is saved and ready to read. What a lovely lesson to share.
        </p>
        {error ? (
          <p className="teacher-error" role="alert">
            {error}
          </p>
        ) : null}
        <Button
          variant="primary"
          size="large"
          onClick={() => {
            try {
              exportLessonFile(lesson)
              setError('')
            } catch (caught) {
              setError(
                caught instanceof Error ? caught.message : 'This lesson could not be exported.',
              )
            }
          }}
        >
          Export as file
        </Button>
        <Button variant="secondary" to={`/student/read/${lesson.id}`}>
          Open as a student
        </Button>
        <Button variant="secondary" to="/teacher">
          Back to teacher home
        </Button>
      </Card>
    </main>
  )
}

export default TeacherPublished
