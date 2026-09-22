const PDF_TYPES = new Set(['application/pdf'])
const IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png'])

function extensionOf(file) {
  const name = file?.name || ''
  const dot = name.lastIndexOf('.')
  return dot >= 0 ? name.slice(dot).toLowerCase() : ''
}

export function detectSourceFile(file) {
  if (!file) return null

  const type = String(file.type || '').toLowerCase()
  const extension = extensionOf(file)

  if (PDF_TYPES.has(type) || extension === '.pdf') {
    return { kind: 'pdf', label: 'PDF' }
  }

  if (IMAGE_TYPES.has(type) || extension === '.jpg' || extension === '.jpeg' || extension === '.png') {
    return { kind: 'image', label: 'Image' }
  }

  return null
}

export const SOURCE_FILE_ACCEPT = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png'
