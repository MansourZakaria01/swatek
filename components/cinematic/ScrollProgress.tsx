'use client'

import { useScroll, useSpring, motion, useReducedMotion } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const reducedMotion = useReducedMotion()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  if (reducedMotion) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, var(--accent), #7b5cfa)',
        boxShadow: '0 0 8px var(--accent), 0 0 16px rgba(0,212,255,0.4)',
      }}
    />
  )
}
