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
        'cine-frame overflow-hidden transition-all duration-300',
        open ? 'border-[--accent] shadow-[0_0_40px_var(--accent-glow)]' : 'hover:border-[rgba(94,234,212,0.32)]',
        className
      )}
      style={{ '--card-accent': accentColor } as React.CSSProperties}
    >
      <button
        type="button"
        className="w-full flex items-center gap-4 p-6 md:p-7 text-left cursor-pointer relative z-10"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {icon && (
          <span className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-xl border border-[--border]"
            style={{ background: 'var(--accent-glow)', color: accentColor }}>
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-lg md:text-xl text-[--foreground] leading-tight">{title}</h3>
          {subtitle && <p className="kicker text-[10px] text-[--text-muted] mt-2">{subtitle}</p>}
          {!open && preview && <div className="mt-2 text-sm text-[--text-secondary]">{preview}</div>}
        </div>
        <motion.span
          animate={mounted ? { rotate: open ? 180 : 0 } : { rotate: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.25 }}
          className="flex-shrink-0 text-[--accent]"
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
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="px-6 md:px-7 pb-7 pt-0 border-t border-[--border] relative z-10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
