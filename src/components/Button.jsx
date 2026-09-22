import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import './Button.css'

const MotionLink = motion.create(Link)
const MotionButton = motion.button

function Button({
  children,
  variant = 'primary',
  size,
  to,
  type = 'button',
  className = '',
  disabled,
  ...props
}) {
  const reduce = useReducedMotion()
  const classNames = ['btn', `btn--${variant}`, size === 'large' && 'btn--large', className]
    .filter(Boolean)
    .join(' ')
  const motionProps = reduce || disabled
    ? {}
    : {
        whileHover: { y: -2, scale: 1.015 },
        whileTap: { scale: 0.97 },
        transition: { duration: 0.18, ease: 'easeOut' },
      }

  if (to) {
    return (
      <MotionLink className={classNames} to={to} {...motionProps} {...props}>
        {children}
      </MotionLink>
    )
  }

  return (
    <MotionButton type={type} className={classNames} disabled={disabled} {...motionProps} {...props}>
      {children}
    </MotionButton>
  )
}

export default Button
