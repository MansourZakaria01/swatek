'use client'

import { useRef, MouseEvent, ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  tiltStrength?: number
}

export function GlowCard({ children, className, glowColor = 'rgba(0,212,255,0.15)', tiltStrength = 12 }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 })

  const rotateX = useTransform(springY, [0, 1], [tiltStrength, -tiltStrength])
  const rotateY = useTransform(springX, [0, 1], [-tiltStrength, tiltStrength])
  const glowX = useTransform(mouseX, [0, 1], ['0%', '100%'])
  const glowY = useTransform(mouseY, [0, 1], ['0%', '100%'])

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const handleLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  if (reducedMotion) {
    return <div className={cn('glass rounded-xl', className)}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={cn('glass rounded-xl relative overflow-hidden', className)}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ scale: { duration: 0.2 } }}
    >
      {/* Glow spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(300px circle at ${glowX.get()} ${glowY.get()}, ${glowColor}, transparent 70%)`,
          backgroundPosition: `${glowX}px ${glowY}px`,
        }}
        whileHover={{ opacity: 1 }}
      />
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </motion.div>
  )
}
