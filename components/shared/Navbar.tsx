'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MagneticButton } from '@/components/cinematic/MagneticButton'

const navLinks = [
  { href: '/technologies', label: 'Technologies' },
  { href: '/solutions',    label: 'Solutions' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/knowledge',   label: 'Knowledge' },
  { href: '/partners',    label: 'Partners' },
  { href: '/contact',     label: 'Contact' },
]

export function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [mounted, setMounted]     = useState(false)
  const pathname                  = usePathname()
  const reducedMotion             = useReducedMotion()

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled ? 'glass border-b border-[--border] py-3' : 'py-5 bg-gradient-to-b from-black/50 to-transparent'
      )}
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="relative flex h-8 w-8 items-center justify-center">
            <span className="absolute inset-0 rounded-sm border border-[--accent]/50 rotate-45 group-hover:rotate-90 transition-transform duration-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-[--accent] shadow-[0_0_12px_var(--accent)]" />
          </span>
          <span className="font-display font-extrabold text-lg tracking-[0.18em] text-gradient">SWATEK</span>
        </Link>

        <ul className="hidden md:flex items-center gap-7 text-[13px] font-medium tracking-wide" role="list">
          {navLinks.map((link, i) => {
            const active = pathname.startsWith(link.href)
            return (
              <motion.li
                key={link.href}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i + 0.2, duration: 0.45 }}
              >
                <Link
                  href={link.href}
                  className={cn(
                    'relative py-1 transition-colors hover:text-[--accent]',
                    active ? 'text-[--accent]' : 'text-[--text-secondary]'
                  )}
                >
                  {link.label}
                  {mounted && (
                    <motion.span
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-[--accent] to-[--accent-warm] rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: active ? 1 : 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                      style={{ originX: 'left' }}
                    />
                  )}
                </Link>
              </motion.li>
            )
          })}
        </ul>

        <div className="flex items-center gap-3">
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: mounted && !reducedMotion ? 0.35 : 0, duration: 0.4 }}
          >
            <MagneticButton>
              <Link
                href="/contact"
                className="btn-cinematic btn-primary hidden md:inline-flex items-center justify-center gap-2 px-5 py-2 h-9 rounded-full text-xs font-semibold tracking-wide transition-colors"
              >
                Get in Touch
              </Link>
            </MagneticButton>
          </motion.div>

          <button
            type="button"
            className="md:hidden text-[--text-secondary] hover:text-[--foreground]"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{   rotate:  90,  opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden glass border-t border-[--border] overflow-hidden"
          >
            <ul className="flex flex-col px-6 py-5 gap-1 text-sm font-medium" role="list">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'block py-2.5 tracking-wide transition-colors hover:text-[--accent]',
                      pathname.startsWith(link.href) ? 'text-[--accent]' : 'text-[--text-secondary]'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
