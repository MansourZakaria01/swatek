'use client'

import { useRef, ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

interface ParallaxSectionProps {
  children: ReactNode
  speed?: number // 0 = no movement, 1 = full scroll speed
  className?: string
}

export function ParallaxSection({ children, speed = 0.3, className }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -60}px`, `${speed * 60}px`])

  return (
    <div ref={ref} className={className} style={{ overflow: 'hidden' }}>
      <motion.div style={{ y: reducedMotion ? 0 : y }}>
        {children}
      </motion.div>
    </div>
  )
}
