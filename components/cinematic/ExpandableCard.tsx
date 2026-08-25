'use client'

import { useState, ReactNode, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExpandableCardProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  preview?: ReactNode
  children: ReactNode
  className?: string
  accentColor?: string
}

export function ExpandableCard({
  title,
  subtitle,
  icon,
  preview,
  children,
  className,
  accentColor = 'var(--accent)',
}: ExpandableCardProps) {
  const [open, setOpen] = useState(false)
  const reducedMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div
      className={cn(
        'glass rounded-xl overflow-hidden border transition-colors duration-300',
        open ? 'border-[--accent]' : 'border-[--border] hover:border-[--accent-dim]',
        className
      )}
      style={{ '--card-accent': accentColor } as React.CSSProperties}
    >
      <button
        type="button"
        className="w-full flex items-center gap-4 p-6 text-left cursor-pointer"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {icon && (
          <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg"
            style={{ background: 'var(--accent-glow)', color: accentColor }}>
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-[--foreground] leading-tight">{title}</h3>
          {subtitle && <p className="text-sm text-[--text-muted] mt-0.5">{subtitle}</p>}
          {!open && preview && <div className="mt-2 text-sm text-[--text-secondary]">{preview}</div>}
        </div>
        <motion.span
          animate={mounted ? { rotate: open ? 180 : 0 } : { rotate: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
          className="flex-shrink-0 text-[--text-muted]"
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={reducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-6 pb-6 pt-0 border-t border-[--border]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
