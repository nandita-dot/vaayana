import * as pdfjs from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker

function itemsToText(items) {
  const lines = []
  let current = ''
  let lastY

  for (const item of items) {
    if (!item || typeof item.str !== 'string' || !item.str) continue

    const y = Array.isArray(item.transform) ? item.transform[5] : undefined
    const jumped = lastY !== undefined && y !== undefined && Math.abs(y - lastY) > 4

    if (jumped && current.trim()) {
      lines.push(current.trim())
      current = item.str
    } else {
      if (current && !/\s$/.test(current) && !/^\s/.test(item.str)) {
        current += ' '
      }
      current += item.str
    }

    if (item.hasEOL) {
      if (current.trim()) lines.push(current.trim())
      current = ''
      lastY = undefined
    } else {
      lastY = y
    }
  }

  if (current.trim()) lines.push(current.trim())
  return lines.join('\n')
}

export function isNearEmptyText(text) {
  return (text || '').replace(/\s+/g, '').length < 12
}

async function loadPdf(file) {
  const bytes = new Uint8Array(await file.arrayBuffer())
  const loadingTask = pdfjs.getDocument({ data: bytes })
  return loadingTask.promise
}

async function closePdf(pdf) {
  if (pdf && typeof pdf.destroy === 'function') {
    await pdf.destroy()
  } else if (pdf && typeof pdf.cleanup === 'function') {
    await pdf.cleanup()
  }
}

export async function extractPdfText(file) {
  const pdf = await loadPdf(file)
  const pages = []

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber)
      const content = await page.getTextContent()
      const pageText = itemsToText(content.items)
      if (pageText) pages.push(pageText)
    }
  } finally {
    await closePdf(pdf)
  }

  return pages.join('\n\n')
}

export async function renderPdfPagesToCanvases(file) {
  const pdf = await loadPdf(file)
  const canvases = []

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber)
      const unscaled = page.getViewport({ scale: 1 })
      const scale = Math.min(2, 1600 / Math.max(unscaled.width, 1))
      const viewport = page.getViewport({ scale })
      const canvas = document.createElement('canvas')
      canvas.width = Math.ceil(viewport.width)
      canvas.height = Math.ceil(viewport.height)
      const canvasContext = canvas.getContext('2d', { alpha: false })
      await page.render({ canvasContext, viewport, canvas }).promise
      canvases.push(canvas)
    }
  } finally {
    await closePdf(pdf)
  }

  return canvases
}
