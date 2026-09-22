import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import { assignLessonId, saveLesson } from '../utils/lessonStorage.js'
import StudentActivities from './StudentActivities.jsx'
import StudentReading from './StudentReading.jsx'
import './TeacherPreview.css'

function TeacherPreview() {
  const navigate = useNavigate()
  const location = useLocation()
  const lesson = location.state?.lesson
  const [phase, setPhase] = useState('reading')
  const [publishError, setPublishError] = useState('')

  const backToEdit = () => {
    navigate('/teacher/edit', {
      state: {
        text: location.state?.text,
        title: location.state?.title,
        vocabItems: location.state?.vocabItems,
        comprehension: location.state?.comprehension,
        fileName: location.state?.fileName,
        kind: location.state?.kind,
      },
    })
  }

  if (!lesson) {
    return (
      <main className="page">
        <Card className="page-card">
          <h1>No lesson yet</h1>
          <p className="page-copy">Choose vocabulary first, then continue to preview.</p>
          <Button variant="primary" to="/teacher">
            Back to upload
          </Button>
        </Card>
      </main>
    )
  }

  return (
    <div className="teacher-preview">
      <p className="teacher-preview-banner" role="status">
        This is what the student will see
      </p>
      {phase === 'reading' ? (
        <StudentReading
          lesson={lesson}
          preview
          onContinue={() => setPhase('activities')}
        />
      ) : (
        <StudentActivities
          lesson={lesson}
          preview
          onBackToReading={() => setPhase('reading')}
          onComplete={() => setPhase('reading')}
        />
      )}
      <div className="teacher-preview-footer">
        {publishError ? (
          <p className="teacher-error" role="alert">
            {publishError}
          </p>
        ) : null}
        <Button
          variant="primary"
          size="large"
          onClick={() => {
            try {
              const saved = saveLesson(assignLessonId(lesson))
              setPublishError('')
              navigate('/teacher/published', { state: { lesson: saved } })
            } catch (caught) {
              setPublishError(
                caught instanceof Error
                  ? caught.message
                  : 'This lesson could not be saved. Please go back and check the vocabulary.',
              )
            }
          }}
        >
          Publish lesson
        </Button>
        <Button variant="secondary" onClick={backToEdit}>
          Back to edit
        </Button>
      </div>
    </div>
  )
}

export default TeacherPreview
