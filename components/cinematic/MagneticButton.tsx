'use client'

import { useRef, ReactNode, MouseEvent, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
}

export function MagneticButton({ children, className, strength = 0.35 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 18 })
  const springY = useSpring(y, { stiffness: 200, damping: 18 })

  // Keep SSR and first client paint identical — enable magnetism only after mount
  const active = mounted && !reducedMotion

  const handleMove = (e: MouseEvent) => {
    if (!active || !ref.current) return
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

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        display: 'inline-block',
        x: active ? springX : 0,
        y: active ? springY : 0,
      }}
      onMouseMove={active ? handleMove : undefined}
      onMouseLeave={active ? handleLeave : undefined}
    >
      {children}
    </motion.div>
  )
}
