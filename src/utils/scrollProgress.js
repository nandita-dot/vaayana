export function getScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  if (maxScroll <= 0) return 100
  return Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100))
}

export function isPassageComplete(progress) {
  return progress >= 100
}
