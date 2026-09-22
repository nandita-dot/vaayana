export function isSpeechSupported() {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance === 'function'
  )
}

export function findVoiceByLangPrefix(voices, prefix) {
  const needle = prefix.toLowerCase()
  return voices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith(needle)) || null
}

export function speakText(text, { lang, voice } = {}) {
  if (!isSpeechSupported() || !text) return

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  if (lang) utterance.lang = lang
  if (voice) {
    utterance.voice = voice
    utterance.lang = voice.lang || lang || utterance.lang
  }
  window.speechSynthesis.speak(utterance)
}

export function stopSpeech() {
  if (!isSpeechSupported()) return
  window.speechSynthesis.cancel()
}
