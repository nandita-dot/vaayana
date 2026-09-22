import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import { isWeakOcrResult, recognizeImages } from '../utils/extractOcr.js'
import { extractPdfText, isNearEmptyText, renderPdfPagesToCanvases } from '../utils/extractPdfText.js'
import './TeacherExtract.css'

const PDF_REVIEW =
  'Please review this text carefully — automatic extraction can make mistakes.'
const OCR_REVIEW =
  'Please check and fix this text. Photo reading often needs correction, especially for handwriting or a blurry or dim photo.'
const OCR_LOADING = 'Reading the page… this can take a moment.'
const OCR_FAIL =
  'We could not read this photo. Please try another image, or a clearer photo of the printed page.'
const OCR_WEAK =
  'This photo did not give us enough clear text. Please try a clearer, well-lit photo of the printed page.'

function DraftArea({ text, onChange, variant }) {
  const isOcr = variant === 'ocr'

  return (
    <>
      <p className={isOcr ? 'extract-banner extract-banner--ocr' : 'extract-banner'}>
        {isOcr ? OCR_REVIEW : PDF_REVIEW}
      </p>
      <label className="extract-meta" htmlFor="extracted-text">
        Draft text — you can fix it
      </label>
      <textarea
        id="extracted-text"
        className="extract-textarea"
        value={text}
        onChange={(event) => onChange(event.target.value)}
      />
    </>
  )
}

function TeacherExtract() {
  const navigate = useNavigate()
  const location = useLocation()
  const source = location.state
  const kind = source?.kind
  const file = source?.file
  const fileName = source?.name || file?.name || 'Untitled file'
  const [status, setStatus] = useState(() => {
    if (kind === 'pdf') return 'loading'
    if (kind === 'image') return 'ocr'
    return 'idle'
  })
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [textSource, setTextSource] = useState(kind === 'image' ? 'ocr' : 'pdf')
  const [ocrPercent, setOcrPercent] = useState(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const runOcr = async (images, cancelledRef) => {
    setTextSource('ocr')
    setStatus('ocr')
    setOcrPercent(0)
    setError('')

    const result = await recognizeImages(images, {
      isCancelled: () => cancelledRef.current || !mountedRef.current,
      onProgress: ({ percent }) => {
        if (!cancelledRef.current && mountedRef.current) setOcrPercent(percent)
      },
    })

    if (cancelledRef.current || !mountedRef.current || result.cancelled) return

    setText(result.text)
    if (isWeakOcrResult(result.text, result.confidence)) {
      setStatus('weak')
      return
    }
    setStatus('ready')
  }

  useEffect(() => {
    if (!file || kind !== 'pdf') return undefined

    const cancelledRef = { current: false }
    setStatus('loading')
    setError('')
    setText('')
    setTextSource('pdf')

    extractPdfText(file)
      .then((extracted) => {
        if (cancelledRef.current) return
        if (isNearEmptyText(extracted)) {
          setText('')
          setStatus('empty')
          return
        }
        setText(extracted)
        setStatus('ready')
      })
      .catch(() => {
        if (cancelledRef.current) return
        setError(
          'We could not read this PDF. It may be damaged or use a format we cannot open yet. Try another file, or a photo of the page.',
        )
        setStatus('error')
      })

    return () => {
      cancelledRef.current = true
    }
  }, [file, kind])

  useEffect(() => {
    if (!file || kind !== 'image') return undefined

    const cancelledRef = { current: false }
    runOcr([file], cancelledRef).catch(() => {
      if (cancelledRef.current || !mountedRef.current) return
      setError(OCR_FAIL)
      setStatus('error')
    })

    return () => {
      cancelledRef.current = true
    }
  }, [file, kind])

  const handlePdfImageFallback = async () => {
    const cancelledRef = { current: false }
    setStatus('ocr')
    setOcrPercent(0)
    setError('')
    try {
      const canvases = await renderPdfPagesToCanvases(file)
      await runOcr(canvases, cancelledRef)
    } catch {
      if (!mountedRef.current) return
      setError(OCR_FAIL)
      setStatus('error')
    }
  }

  if (!file) {
    return (
      <main className="page">
        <Card className="page-card">
          <h1>No file yet</h1>
          <p className="page-copy">Please choose a page or photo first, then we can read the words.</p>
          <Button variant="primary" to="/teacher">
            Back to upload
          </Button>
        </Card>
      </main>
    )
  }

  return (
    <main className="extract-page">
      <div className="extract-column">
        <Card className="extract-card">
          <h1>Check the text</h1>
          <p className="extract-meta">
            {source.label || kind} · {fileName}
          </p>

          {status === 'loading' ? (
            <div className="extract-loading" role="status">
              <div className="extract-loading__dot" aria-hidden="true" />
              <p>Reading the PDF… this can take a moment.</p>
            </div>
          ) : null}

          {status === 'ocr' ? (
            <div className="extract-loading" role="status">
              <ProgressBar value={ocrPercent} label={`${ocrPercent}%`} />
              <p>{OCR_LOADING}</p>
            </div>
          ) : null}

          {status === 'error' ? (
            <p className="teacher-error" role="alert">
              {error}
            </p>
          ) : null}

          {status === 'empty' ? (
            <>
              <p className="page-copy" role="status">
                This PDF looks like a picture of a page, with no typed words we can copy. We can
                try reading it as an image instead.
              </p>
              <Button variant="secondary" onClick={handlePdfImageFallback}>
                Try image extraction
              </Button>
            </>
          ) : null}

          {status === 'weak' ? (
            <>
              <p className="page-copy" role="status">
                {OCR_WEAK}
              </p>
              {text.trim() ? (
                <DraftArea text={text} onChange={setText} variant="ocr" />
              ) : null}
            </>
          ) : null}

          {status === 'ready' ? (
            <DraftArea text={text} onChange={setText} variant={textSource} />
          ) : null}

          <div className="extract-actions">
            <Button
              variant="primary"
              size="large"
              disabled={!text.trim() || (status !== 'ready' && status !== 'weak')}
              onClick={() =>
                navigate('/teacher/edit', {
                  state: {
                    text: text.trim(),
                    fileName,
                    kind,
                  },
                })
              }
            >
              Continue
            </Button>
            <Button variant="secondary" onClick={() => navigate('/teacher')}>
              Choose a different file
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}

export default TeacherExtract
