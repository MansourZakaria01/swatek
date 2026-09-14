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
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const scale  = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const y      = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <section ref={ref} className={`relative min-h-screen flex items-center overflow-hidden ${className}`}>
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
            className="w-full h-full"
            style={{
              background:
                'radial-gradient(ellipse 90% 70% at 50% 0%, #0e1a28 0%, #010409 55%), linear-gradient(180deg, #010409 0%, #071018 100%)',
              ...(mounted && !reducedMotion ? { scale } : {}),
            }}
          />
        )}

        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-b from-[--background]/30 via-[--background]/20 to-[--background]" />
        )}

        <motion.div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(94,234,212,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,0.28) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 72%)',
          }}
          animate={mounted && !reducedMotion ? { backgroundPosition: ['0px 0px', '80px 80px'] } : undefined}
          transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
        />

        <FloatingParticles count={58} />

        {mounted && !reducedMotion && (
          <>
            <motion.div
              className="absolute top-[8%] left-[12%] w-[720px] h-[720px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(94,234,212,0.16) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.22, 1], opacity: [0.55, 1, 0.55], x: [0, 30, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-[8%] right-[8%] w-[560px] h-[560px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(240,180,90,0.14) 0%, transparent 70%)' }}
              animate={{ scale: [1.15, 0.95, 1.15], opacity: [0.45, 0.9, 0.45] }}
              transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[380px] h-[380px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)' }}
              animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            />
          </>
        )}

        <div className="anamorphic top-[22%] left-0 right-0 opacity-70" />
        <div className="anamorphic top-[58%] left-[15%] right-[15%] opacity-25" />
        <div className="absolute inset-0 scanlines opacity-40" />
      </div>

      <motion.div
        className="relative z-10 w-full"
        style={mounted ? {
          opacity: reducedMotion ? 1 : opacity,
          y:       reducedMotion ? 0  : y,
        } : {}}
      >
        {children}
      </motion.div>

      {mounted && !reducedMotion && (
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <span className="kicker text-[--text-muted] text-[10px]">Scroll</span>
          <motion.div
            className="w-px h-14 bg-gradient-to-b from-[--accent] via-[--accent-warm] to-transparent"
            animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originY: 0 }}
          />
        </motion.div>
      )}
    </section>
  )
}
