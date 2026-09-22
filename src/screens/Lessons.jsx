import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import StorybookScene from '../components/StorybookScene.jsx'
import {
  exportLessonFile,
  getLesson,
  importLessonFromFile,
  listLessons,
} from '../utils/lessonStorage.js'
import './Lessons.css'

function Lessons() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [lessons, setLessons] = useState(() => listLessons())
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setError('')
    setMessage('')

    try {
      const lesson = await importLessonFromFile(file)
      setLessons(listLessons())
      setMessage(`Imported “${lesson.title}”.`)
      navigate(`/student/read/${lesson.id}`)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not open that file as a story.')
    }
  }

  const handleExport = (lessonId) => {
    const lesson = getLesson(lessonId)
    if (!lesson) {
      setError('That story could not be saved as a file. Please try again.')
      return
    }

    try {
      exportLessonFile(lesson)
      setError('')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not save that story as a file.')
    }
  }

  return (
    <main className="page">
      <StorybookScene />
      <Card className="page-card lessons-card">
        <h1>Story files</h1>
        <p className="page-copy">
          Bring in a story file, or save one you already have. This page is for grown-ups, not for
          reading together.
        </p>
        <input
          ref={fileInputRef}
          className="lessons-file-input"
          type="file"
          accept="application/json,.json"
          aria-hidden="true"
          tabIndex={-1}
          onChange={handleImport}
        />
        <Button variant="secondary" className="btn--utility" onClick={() => fileInputRef.current?.click()}>
          Import a story file
        </Button>
        {error ? (
          <p className="lessons-status lessons-status--error" role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="lessons-status" role="status">
            {message}
          </p>
        ) : null}
        {lessons.length === 0 ? (
          <p className="lessons-status" role="status">
            No stories are saved yet. Import a file, or create one as a teacher.
          </p>
        ) : (
          <ul className="lessons-list">
            {lessons.map((lesson) => (
              <li key={lesson.id} className="lessons-item">
                <p className="lessons-item__title">{lesson.title}</p>
                <div className="lessons-item__actions">
                  <Link className="lessons-item__link" to={`/student/read/${lesson.id}`}>
                    Open story
                  </Link>
                  <button type="button" className="lessons-item__link" onClick={() => handleExport(lesson.id)}>
                    Export
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Button variant="secondary" to="/">
          Back to home
        </Button>
      </Card>
    </main>
  )
}

export default Lessons
