import { forwardRef } from 'react'
import './Card.css'

const Card = forwardRef(function Card({ children, className = '', ...props }, ref) {
  const classNames = ['card', className].filter(Boolean).join(' ')

  return (
    <div ref={ref} className={classNames} {...props}>
      {children}
    </div>
  )
})

export default Card
