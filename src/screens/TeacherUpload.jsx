import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import { SOURCE_FILE_ACCEPT, detectSourceFile } from '../utils/sourceFile.js'
import './TeacherUpload.css'

const UNSUPPORTED_MESSAGE =
  'Please choose a PDF or a photo (JPG or PNG). Other file types cannot be used yet.'

function TeacherUpload() {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file) => {
    if (!file) return

    const detected = detectSourceFile(file)
    if (!detected) {
      setError(UNSUPPORTED_MESSAGE)
      return
    }

    setError('')
    navigate('/teacher/extract', {
      state: {
        file,
        kind: detected.kind,
        label: detected.label,
        name: file.name,
      },
    })
  }

  return (
    <main className="page">
      <Card className="page-card teacher-upload">
        <h1>Create a lesson</h1>
        <p className="page-copy">
          Upload a textbook page or worksheet — we&apos;ll help you turn it into a lesson.
        </p>
        <input
          ref={inputRef}
          className="teacher-file-input"
          type="file"
          accept={SOURCE_FILE_ACCEPT}
          aria-hidden="true"
          tabIndex={-1}
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            handleFile(file)
          }}
        />
        <button
          type="button"
          className={['teacher-dropzone', isDragging && 'teacher-dropzone--active'].filter(Boolean).join(' ')}
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragOver={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setIsDragging(false)
            handleFile(event.dataTransfer.files?.[0])
          }}
        >
          <p className="teacher-dropzone__title">Drop a file here, or choose one</p>
          <p className="teacher-dropzone__hint">PDF, JPG, or PNG</p>
          <span className="btn btn--secondary">Choose file</span>
        </button>
        {error ? (
          <p className="teacher-error" role="alert">
            {error}
          </p>
        ) : null}
        <Button variant="secondary" to="/">
          Back to home
        </Button>
      </Card>
    </main>
  )
}

export default TeacherUpload
