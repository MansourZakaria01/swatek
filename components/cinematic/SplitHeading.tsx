'use client'

import { motion, useReducedMotion, Variants } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SplitHeadingProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  className?: string
  delay?: number
  stagger?: number
}

const containerVariants: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 50, rotateX: -20 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
}

export function SplitHeading({
  text,
  as: Tag = 'h2',
  className,
  delay = 0,
  stagger = 0.06,
}: SplitHeadingProps) {
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const words = text.split(' ')

  if (!mounted || reducedMotion) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <Tag className={className} style={{ overflow: 'hidden' }}>
      <motion.span
        className="inline-flex flex-wrap gap-x-[0.25em]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        custom={stagger}
        variants={containerVariants}
        transition={{ delayChildren: delay }}
        style={{ perspective: '600px' }}
      >
        {words.map((word, i) => (
          <motion.span key={i} variants={wordVariants} style={{ display: 'inline-block' }}>
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  )
}
