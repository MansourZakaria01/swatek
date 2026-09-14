'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export function AmbientBackdrop({ className = '' }: { className?: string }) {
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const animateOrbs = mounted && !reducedMotion

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(94,234,212,0.08),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(94,234,212,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,0.35) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        }}
      />

      {animateOrbs && (
        <>
          <motion.div
            className="absolute -top-24 left-[8%] h-[28rem] w-[28rem] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(94,234,212,0.14) 0%, transparent 68%)' }}
            animate={{ x: [0, 40, 0], y: [0, 24, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-[30%] right-[4%] h-[24rem] w-[24rem] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(240,180,90,0.12) 0%, transparent 70%)' }}
            animate={{ x: [0, -30, 0], y: [0, 36, 0], scale: [1.1, 0.95, 1.1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
          />
          <motion.div
            className="absolute -bottom-16 left-1/3 h-[20rem] w-[20rem] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </>
      )}

      <div className="anamorphic top-[18%] left-0 right-0" />
      <div className="anamorphic bottom-[22%] left-[10%] right-[10%] opacity-30" />
    </div>
  )
}
