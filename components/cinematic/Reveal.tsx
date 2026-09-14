'use client'

import { motion, useReducedMotion, useInView, Variants } from 'framer-motion'
import { ReactNode, useEffect, useRef, useState } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface RevealProps {
  children: ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

const variants: Record<Direction, Variants> = {
  up:    { hidden: { opacity: 0, y: 40 },  visible: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 },  visible: { opacity: 1, x: 0 } },
  none:  { hidden: { opacity: 0 },          visible: { opacity: 1 } },
}

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className,
  once = true,
}: RevealProps) {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const inView = useInView(ref, { once, margin: '0px 0px -40px 0px', amount: 0.15 })

  useEffect(() => { setMounted(true) }, [])

  // Plain div on SSR + hydration — Framer variant styles (opacity:"1" + transform)
  // serialize differently on server vs client and cause attribute mismatches.
  if (!mounted) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  const visible = !!reducedMotion || inView

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={visible ? false : 'hidden'}
      animate={visible ? 'visible' : 'hidden'}
      variants={reducedMotion ? variants.none : variants[direction]}
      transition={{
        duration: reducedMotion ? 0.01 : duration,
        delay: reducedMotion ? 0 : delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  )
}
