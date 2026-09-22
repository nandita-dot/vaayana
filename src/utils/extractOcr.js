import { createWorker } from 'tesseract.js'
import workerPath from 'tesseract.js/dist/worker.min.js?url'
import { isNearEmptyText } from './extractPdfText.js'

export function isWeakOcrResult(text, confidence) {
  const compact = (text || '').replace(/\s+/g, '')
  if (isNearEmptyText(text)) return true

  const letters = (compact.match(/[A-Za-z]/g) || []).length
  const letterRatio = compact.length ? letters / compact.length : 0
  if (compact.length < 80 && letterRatio < 0.35) return true

  if (typeof confidence === 'number' && confidence < 40 && compact.length < 80) {
    return true
  }

  return false
}

function percentFromLogger(message) {
  if (!message || typeof message.progress !== 'number') return 0
  return Math.round(Math.min(1, Math.max(0, message.progress)) * 100)
}

export async function recognizeImages(images, { onProgress, isCancelled } = {}) {
  const worker = await createWorker('eng', 1, {
    workerPath,
    logger: (message) => {
      onProgress?.({
        percent: percentFromLogger(message),
        status: message.status,
      })
    },
  })

  try {
    const pages = []
    const confidences = []

    for (let index = 0; index < images.length; index += 1) {
      if (isCancelled?.()) {
        return { text: '', confidence: 0, cancelled: true }
      }

      onProgress?.({
        percent: Math.round((index / images.length) * 100),
        status: 'recognizing text',
      })

      const { data } = await worker.recognize(images[index])
      const pageText = (data.text || '').trim()
      if (pageText) pages.push(pageText)
      if (typeof data.confidence === 'number') confidences.push(data.confidence)
    }

    const confidence = confidences.length
      ? confidences.reduce((sum, value) => sum + value, 0) / confidences.length
      : undefined

    return {
      text: pages.join('\n\n'),
      confidence,
      cancelled: false,
    }
  } finally {
    await worker.terminate()
  }
}
