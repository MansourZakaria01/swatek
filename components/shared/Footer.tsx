import Link from 'next/link'
import { Zap, MapPin, ExternalLink } from 'lucide-react'
import { Reveal } from '@/components/cinematic/Reveal'

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
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${LNG - 0.008}%2C${LAT - 0.006}%2C${LNG + 0.008}%2C${LAT + 0.006}&layer=mapnik&marker=${LAT}%2C${LNG}`

  return (
    <footer className="border-t border-[--border] bg-[--surface] mt-20">

      {/* ── 5-column grid: brand | platform | company | domains | location ── */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 items-start">

        {/* Col 1 — Brand */}
        <Reveal direction="up" className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
            <span className="text-[--accent]"><Zap size={20} strokeWidth={2.5} /></span>
            <span className="text-gradient">SWATEK</span>
          </Link>
          <p className="text-sm text-[--text-muted] leading-relaxed">
            Smart Waves Technologies — Industry 4.0, AI, clean energy, and smart agriculture solutions for a sustainable future.
          </p>
        </Reveal>

        {/* Col 2 — Platform */}
        <Reveal direction="up" delay={0.1} className="lg:col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[--text-muted] mb-4">Platform</h3>
          <ul className="flex flex-col gap-2" role="list">
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

        {/* Col 3 — Company */}
        <Reveal direction="up" delay={0.2} className="lg:col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[--text-muted] mb-4">Company</h3>
          <ul className="flex flex-col gap-2" role="list">
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

        {/* Col 4 — Domains */}
        <Reveal direction="up" delay={0.3} className="lg:col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[--text-muted] mb-4">Domains</h3>
          <ul className="flex flex-col gap-2" role="list">
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

        {/* Col 5 — Location map */}
        <Reveal direction="up" delay={0.4} className="lg:col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[--text-muted] mb-4">Location</h3>
          <div className="rounded-xl overflow-hidden border border-[--border] hover:border-[--accent-dim] transition-colors duration-300">
            {/* Oversized iframe clipped to hide OSM attribution bar at bottom */}
            <div style={{ height: '140px', width: '100%', overflow: 'hidden', position: 'relative' }}>
              <iframe
                src={embedUrl}
                width="100%"
                height="175"
                style={{ border: 0, display: 'block', marginBottom: '-35px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SWATEK office location"
                aria-label="SWATEK office location map — Sousse, Tunisia"
              />
            </div>
            <div className="px-3 py-2 bg-[--surface-2] flex items-center justify-between gap-2 border-t border-[--border]">
              <div className="flex items-center gap-1.5 min-w-0">
                <MapPin size={12} className="text-[--accent] flex-shrink-0" />
                <p className="text-xs text-[--foreground] truncate">Sousse, Tunisia</p>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[--accent] hover:underline flex-shrink-0"
                aria-label="Open in Google Maps"
              >
                <ExternalLink size={11} />
                Maps
              </a>
            </div>
          </div>
        </Reveal>

      </div>

      {/* ── Bottom bar ── */}
      <Reveal direction="none">
        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-[--border] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[--text-muted]">
          <span>© {new Date().getFullYear()} SWATEK — Smart Waves Technologies. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-[--accent] transition-colors">Privacy</Link>
            <Link href="/terms"   className="hover:text-[--accent] transition-colors">Terms</Link>
          </div>
        </div>
      </Reveal>
    </footer>
  )
}
