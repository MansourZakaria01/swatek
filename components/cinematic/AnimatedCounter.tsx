'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  suffix?: string
  prefix?: string
  decimals?: number
  duration?: number
  className?: string
}

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration: reducedMotion ? 0 : duration * 1000, bounce: 0 })
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (inView && mounted) motionValue.set(value)
  }, [inView, mounted, motionValue, value])

  useEffect(() => {
    if (!mounted) return
    return spring.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent =
          prefix + latest.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix
      }
    })
  }, [spring, prefix, suffix, decimals, mounted])

  const displayValue = prefix + value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix

  return (
    <span ref={ref} className={className} aria-label={displayValue}>
      {mounted ? `${prefix}0${suffix}` : displayValue}
    </span>
  )
}
