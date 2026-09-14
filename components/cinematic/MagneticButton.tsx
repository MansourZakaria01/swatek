'use client'

import { useRef, ReactNode, MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  as?: 'button' | 'div' | 'span'
}

export function MagneticButton({ children, className, strength = 0.35, as: Tag = 'div' }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 18 })
  const springY = useSpring(y, { stiffness: 200, damping: 18 })

  const handleMove = (e: MouseEvent) => {
    if (reducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  if (reducedMotion) {
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY, display: 'inline-block' }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  )
}
