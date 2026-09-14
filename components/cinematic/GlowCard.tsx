'use client'

import { useRef, MouseEvent, ReactNode, useEffect, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  tiltStrength?: number
}

export function GlowCard({
  children,
  className,
  glowColor = 'rgba(94,234,212,0.18)',
  tiltStrength = 8,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const springX = useSpring(mouseX, { stiffness: 140, damping: 22 })
  const springY = useSpring(mouseY, { stiffness: 140, damping: 22 })

  const rotateX = useTransform(springY, [0, 1], [tiltStrength, -tiltStrength])
  const rotateY = useTransform(springX, [0, 1], [-tiltStrength, tiltStrength])
  const glowX = useTransform(springX, [0, 1], ['0%', '100%'])
  const glowY = useTransform(springY, [0, 1], ['0%', '100%'])
  const spotlight = useMotionTemplate`radial-gradient(340px circle at ${glowX} ${glowY}, ${glowColor}, transparent 62%)`

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!mounted || reducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const handleLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  if (!mounted || reducedMotion) {
    return <div className={cn('cine-frame', className)}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={cn('cine-frame group relative', className)}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 900 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.015 }}
      transition={{ scale: { duration: 0.25 } }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: spotlight }}
      />
      <div className="relative z-10" style={{ transform: 'translateZ(18px)' }}>{children}</div>
    </motion.div>
  )
}
