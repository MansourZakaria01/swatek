'use client'

import { useEffect, useState } from 'react'
import { useScroll, useSpring, motion, useReducedMotion } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const reducedMotion = useReducedMotion()
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 32 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Keep SSR and first client paint identical — useReducedMotion differs across them.
  if (!mounted || reducedMotion) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, var(--accent), var(--accent-warm), var(--accent-violet))',
        boxShadow: '0 0 12px var(--accent), 0 0 24px rgba(240,180,90,0.35)',
      }}
    />
  )
}
