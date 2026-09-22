import { motion, useReducedMotion } from 'motion/react'
import './ProgressBar.css'

function ProgressBar({ value = 0, label }) {
  const clamped = Math.min(100, Math.max(0, Number(value) || 0))
  const reduce = useReducedMotion()

  return (
    <div className="progress">
      {label ? <div className="progress__label">{label}</div> : null}
      <div
        className="progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        aria-label={label || 'Progress'}
      >
        <motion.div
          className="progress__fill"
          initial={false}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: reduce ? 0.01 : 0.28, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
