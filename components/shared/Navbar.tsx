'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass border-b border-[--border] py-3' : 'py-5'
      )}
      initial={reducedMotion ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between" aria-label="Main navigation">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
          <motion.span
            className="text-[--accent]"
            whileHover={reducedMotion ? {} : { rotate: 20, scale: 1.15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 12 }}
          >
            <Zap size={22} strokeWidth={2.5} />
          </motion.span>
          <span className="text-gradient">SWATEK</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium" role="list">
          {navLinks.map((link, i) => {
            const active = pathname.startsWith(link.href)
            return (
              <motion.li
                key={link.href}
                initial={reducedMotion ? false : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i + 0.2, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  className={cn(
                    'relative py-1 transition-colors hover:text-[--accent]',
                    active ? 'text-[--accent]' : 'text-[--text-secondary]'
                  )}
                >
                  {link.label}
                  {/* Animated underline */}
                  {mounted && (
                    <motion.span
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-[--accent] rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: active ? 1 : 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      style={{ originX: 'left' }}
                    />
                  )}
                </Link>
              </motion.li>
            )
          })}
        </ul>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center justify-center gap-2 px-4 py-2 h-9 rounded-lg text-sm font-medium bg-[--accent] text-[--background] hover:bg-[--accent-dim] transition-colors"
            >
              Get in Touch
            </Link>
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

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden glass border-t border-[--border] overflow-hidden"
          >
            <ul className="flex flex-col px-6 py-4 gap-1 text-sm font-medium" role="list">
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
                      'block py-2.5 transition-colors hover:text-[--accent]',
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
