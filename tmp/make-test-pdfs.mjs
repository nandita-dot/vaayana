import { mkdirSync, writeFileSync } from 'node:fs'

function makePdf(text) {
  const escaped = String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
  const stream = text
    ? `BT\n/F1 16 Tf\n50 700 Td\n(${escaped}) Tj\nET\n`
    : 'BT\nET\n'
  const header = '%PDF-1.4\n'
  const bodyPieces = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}endstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
  ]
  let offset = Buffer.byteLength(header)
  const offsets = [0]
  let body = ''
  for (const piece of bodyPieces) {
    offsets.push(offset)
    body += piece
    offset += Buffer.byteLength(piece)
  }
  const xrefStart = Buffer.byteLength(header) + Buffer.byteLength(body)
  let xref = 'xref\n0 6\n0000000000 65535 f \n'
  for (let i = 1; i <= 5; i += 1) {
    xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }
  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`
  return header + body + xref + trailer
}

mkdirSync('tmp', { recursive: true })
writeFileSync('tmp/sparrow-text.pdf', makePdf('A small sparrow hopped along the garden path.'))
writeFileSync('tmp/scanned-empty.pdf', makePdf(''))
console.log('ok', Buffer.byteLength(makePdf('A small sparrow hopped along the garden path.')))
