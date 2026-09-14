import Link from 'next/link'
import { MapPin, ExternalLink } from 'lucide-react'
import { Reveal } from '@/components/cinematic/Reveal'
import { CinematicDivider } from '@/components/cinematic/CinematicDivider'
import { AmbientBackdrop } from '@/components/cinematic/AmbientBackdrop'
import { MagneticButton } from '@/components/cinematic/MagneticButton'

const LAT = 35.85328723815884
const LNG = 10.608818758780973

const footerLinks = {
  Platform: [
    { href: '/technologies', label: 'Technologies' },
    { href: '/solutions',    label: 'Solutions' },
    { href: '/case-studies', label: 'Case Studies' },
    { href: '/knowledge',    label: 'Knowledge Library' },
  ],
  Company: [
    { href: '/partners', label: 'Partners' },
    { href: '/contact',  label: 'Contact Us' },
    { href: '/admin',    label: 'Admin Login' },
  ],
  Domains: [
    { href: '/technologies?domain=energy-hydrogen',      label: 'Energy & Hydrogen' },
    { href: '/technologies?domain=agriculture-40',       label: 'Agriculture 4.0' },
    { href: '/technologies?domain=smart-infrastructure', label: 'Smart Infrastructure' },
    { href: '/technologies?domain=industry-40',          label: 'Industry 4.0' },
  ],
}

export function Footer() {
  const googleMapsUrl = `https://www.google.com/maps?q=${LAT},${LNG}`

  return (
    <footer className="relative mt-24 border-t border-[--border] bg-[--surface] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <AmbientBackdrop />
      </div>
      <CinematicDivider className="relative z-10 max-w-7xl mx-auto px-6 pt-2" />

      <div className="absolute inset-0 z-0 pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(ellipse at bottom, rgba(94,234,212,0.08), transparent 55%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8">
        <p className="font-display text-[11vw] leading-none font-extrabold tracking-tighter text-white/[0.035] select-none text-center -mb-6 hidden md:block">
          SWATEK
        </p>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 items-start">
        <Reveal direction="up" className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-5">
            <span className="relative flex h-7 w-7 items-center justify-center">
              <span className="absolute inset-0 rounded-sm border border-[--accent]/50 rotate-45" />
              <span className="h-1.5 w-1.5 rounded-full bg-[--accent]" />
            </span>
            <span className="font-display font-extrabold tracking-[0.18em] text-gradient">SWATEK</span>
          </Link>
          <p className="text-sm text-[--text-muted] leading-relaxed mb-5">
            Smart Waves Technologies — Industry 4.0, AI, clean energy, and smart agriculture solutions for a sustainable future.
          </p>
          <MagneticButton>
            <Link
              href="/contact"
              className="btn-cinematic btn-primary inline-flex items-center justify-center px-5 py-2 rounded-full text-xs font-semibold tracking-wide"
            >
              Get in Touch
            </Link>
          </MagneticButton>
        </Reveal>

        <Reveal direction="up" delay={0.1} className="lg:col-span-1">
          <h3 className="kicker text-[--text-muted] mb-5">Platform</h3>
          <ul className="flex flex-col gap-2.5" role="list">
            {footerLinks.Platform.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-[--text-secondary] hover:text-[--accent] transition-colors relative group">
                  <span className="relative">
                    {link.label}
                    <span className="absolute -bottom-px left-0 w-0 h-px bg-[--accent] transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal direction="up" delay={0.2} className="lg:col-span-1">
          <h3 className="kicker text-[--text-muted] mb-5">Company</h3>
          <ul className="flex flex-col gap-2.5" role="list">
            {footerLinks.Company.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-[--text-secondary] hover:text-[--accent] transition-colors relative group">
                  <span className="relative">
                    {link.label}
                    <span className="absolute -bottom-px left-0 w-0 h-px bg-[--accent] transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal direction="up" delay={0.3} className="lg:col-span-1">
          <h3 className="kicker text-[--text-muted] mb-5">Domains</h3>
          <ul className="flex flex-col gap-2.5" role="list">
            {footerLinks.Domains.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-[--text-secondary] hover:text-[--accent] transition-colors relative group">
                  <span className="relative">
                    {link.label}
                    <span className="absolute -bottom-px left-0 w-0 h-px bg-[--accent] transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="lg:col-span-1 relative z-10">
          <h3 className="kicker text-[--text-muted] mb-5">Location</h3>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl overflow-hidden border border-[--border] bg-[--surface-2] hover:border-[--accent-dim] transition-colors duration-300 group"
            aria-label="Open SWATEK office location in Google Maps — Sousse, Tunisia"
          >
            <div className="relative h-[140px] w-full overflow-hidden bg-[#0a121c]">
              {/* Coastline / land silhouette — no external map dependency */}
              <svg
                className="absolute inset-0 h-full w-full opacity-40"
                viewBox="0 0 600 280"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden
              >
                <defs>
                  <linearGradient id="locLand" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(94,234,212,0.35)" />
                    <stop offset="100%" stopColor="rgba(240,180,90,0.15)" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#locLand)"
                  d="M0 180 C80 160 140 120 220 130 C300 140 340 90 420 100 C500 110 560 70 600 80 L600 280 L0 280 Z"
                />
                <path
                  fill="none"
                  stroke="rgba(94,234,212,0.45)"
                  strokeWidth="1.5"
                  d="M0 180 C80 160 140 120 220 130 C300 140 340 90 420 100 C500 110 560 70 600 80"
                />
                <circle cx="340" cy="118" r="3" fill="var(--accent)" />
                <circle cx="340" cy="118" r="18" fill="none" stroke="rgba(94,234,212,0.35)" strokeWidth="1" />
                <circle cx="340" cy="118" r="32" fill="none" stroke="rgba(94,234,212,0.18)" strokeWidth="1" />
              </svg>

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at 55% 42%, rgba(94,234,212,0.16), transparent 50%), linear-gradient(180deg, transparent 35%, rgba(7,11,18,0.7) 100%)',
                }}
                aria-hidden
              />
              <div
                className="absolute inset-0 opacity-35 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(94,234,212,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,0.28) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                  maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 78%)',
                }}
                aria-hidden
              />

              <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 pointer-events-none">
                <span className="relative flex h-8 w-8 items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-[--accent]/25 animate-ping" />
                  <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[--accent] bg-[--background]/85 shadow-[0_0_20px_var(--accent-glow)]">
                    <MapPin size={14} className="text-[--accent]" />
                  </span>
                </span>
                <span className="mt-1 rounded-full border border-[--border] bg-[--background]/80 px-2 py-0.5 text-[10px] tracking-widest text-[--accent] backdrop-blur-sm">
                  {LAT.toFixed(4)}°N · {LNG.toFixed(4)}°E
                </span>
              </div>
            </div>
            <div className="px-3 py-2 bg-[--surface-2] flex items-center justify-between gap-2 border-t border-[--border]">
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin size={12} className="text-[--accent] flex-shrink-0" />
                <p className="text-xs text-[--foreground] truncate">Sousse, Tunisia</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs text-[--accent] flex-shrink-0 group-hover:underline">
                <ExternalLink size={11} />
                Maps
              </span>
            </div>
          </a>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6 border-t border-[--border] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[--text-muted] tracking-wide">
        <span>© {new Date().getFullYear()} SWATEK — Smart Waves Technologies. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-[--accent] transition-colors">Privacy</Link>
          <Link href="/terms"   className="hover:text-[--accent] transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
