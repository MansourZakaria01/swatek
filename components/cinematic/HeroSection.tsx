'use client'

import { useRef, ReactNode, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { FloatingParticles } from './FloatingParticles'

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
  const scale  = useTransform(scrollYProgress, [0, 1], [1, 1.07])
  const y      = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])

  return (
    <section ref={ref} className={`relative min-h-screen flex items-center overflow-hidden ${className}`}>
      {/* ── Background ── */}
      <div className="absolute inset-0 z-0">
        {videoSrc && !reducedMotion ? (
          <motion.video
            src={videoSrc}
            autoPlay muted loop playsInline
            className="w-full h-full object-cover"
            style={mounted ? { scale } : {}}
          />
        ) : (
          <motion.div
            className="w-full h-full bg-gradient-to-br from-[--background] via-[--surface] to-[--surface-2]"
            style={mounted && !reducedMotion ? { scale } : {}}
          />
        )}

        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-b from-[--background]/60 via-[--background]/40 to-[--background]" />
        )}

        {/* Animated grid */}
        <motion.div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
          animate={!reducedMotion ? { backgroundPosition: ['0px 0px', '60px 60px'] } : {}}
          transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
        />

        {/* Floating particles canvas */}
        <FloatingParticles count={70} />

        {/* Ambient glow orbs */}
        {!reducedMotion && (
          <>
            <motion.div
              className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(123,92,250,0.12) 0%, transparent 70%)' }}
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
            <motion.div
              className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,230,118,0.07) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            />
          </>
        )}
      </div>

      {/* ── Content ── */}
      <motion.div
        className="relative z-10 w-full"
        style={mounted ? {
          opacity: reducedMotion ? 1 : opacity,
          y:       reducedMotion ? 0  : y,
        } : {}}
      >
        {children}
      </motion.div>

      {/* ── Scroll indicator ── */}
      {mounted && !reducedMotion && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span className="text-xs text-[--text-muted] tracking-widest uppercase">Scroll</span>
          <motion.div
            className="w-px h-10 bg-gradient-to-b from-[--accent] to-transparent"
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originY: 0 }}
          />
        </motion.div>
      )}
    </section>
  )
}
