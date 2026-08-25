'use client'

import { useRef, ReactNode, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

interface HeroSectionProps {
  videoSrc?: string
  children: ReactNode
  className?: string
  overlay?: boolean
}

export function HeroSection({ videoSrc, children, className = '', overlay = true }: HeroSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05])

  return (
    <section ref={ref} className={`relative min-h-screen flex items-center overflow-hidden ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {videoSrc && !reducedMotion ? (
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            style={{ transform: 'scale(1.05)' }}
          />
        ) : (
          // Animated canvas fallback — gradient mesh
          <div className="w-full h-full bg-gradient-to-br from-[--background] via-[--surface] to-[--surface-2]" />
        )}
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-b from-[--background]/60 via-[--background]/40 to-[--background]" />
        )}
        {/* Animated particles/grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 w-full"
        style={mounted ? { opacity: reducedMotion ? 1 : opacity, scale: reducedMotion ? 1 : scale } : {}}
      >
        {children}
      </motion.div>

      {/* Scroll indicator */}
      {mounted && (
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-xs text-[--text-muted] tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[--accent] to-transparent" />
      </motion.div>
      )}
    </section>
  )
}
