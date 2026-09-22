import { motion, useReducedMotion } from 'motion/react'
import './StorybookScene.css'

function float(reduce, duration, distance = 6) {
  if (reduce) return undefined
  return {
    y: [0, -distance, 0],
    transition: { duration, repeat: Infinity, ease: 'easeInOut' },
  }
}

function StorybookScene() {
  const reduce = useReducedMotion()

  return (
    <div className="storybook" aria-hidden="true">
      <span className="storybook__blob storybook__blob--tl" />
      <span className="storybook__blob storybook__blob--br" />
      <span className="storybook__dots" />
      <motion.span className="storybook__shape storybook__cloud storybook__cloud--1" animate={float(reduce, 10, 7)} />
      <motion.span className="storybook__shape storybook__cloud storybook__cloud--2" animate={float(reduce, 12, 5)} />
      <span className="storybook__shape storybook__leaf storybook__leaf--1" />
      <span className="storybook__shape storybook__leaf storybook__leaf--2" />
      <motion.span className="storybook__shape storybook__star storybook__star--1" animate={float(reduce, 9, 4)} />
      <span className="storybook__shape storybook__star storybook__star--2" />
      <span className="storybook__shape storybook__flower storybook__flower--1" />
      <span className="storybook__shape storybook__bird storybook__bird--1" />
      <span className="storybook__shape storybook__flower storybook__flower--2" />
    </div>
  )
}

export default StorybookScene
