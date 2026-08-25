import Link from 'next/link'
import { Zap } from 'lucide-react'

const footerLinks = {
  Platform: [
    { href: '/technologies', label: 'Technologies' },
    { href: '/solutions', label: 'Solutions' },
    { href: '/case-studies', label: 'Case Studies' },
    { href: '/knowledge', label: 'Knowledge Library' },
  ],
  Company: [
    { href: '/partners', label: 'Partners' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/admin', label: 'Admin Login' },
  ],
  Domains: [
    { href: '/technologies?domain=energy-hydrogen', label: 'Energy & Hydrogen' },
    { href: '/technologies?domain=agriculture-40', label: 'Agriculture 4.0' },
    { href: '/technologies?domain=smart-infrastructure', label: 'Smart Infrastructure' },
    { href: '/technologies?domain=industry-40', label: 'Industry 4.0' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-[--border] bg-[--surface] mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
            <span className="text-[--accent]"><Zap size={20} strokeWidth={2.5} /></span>
            <span className="text-gradient">SWATEK</span>
          </Link>
          <p className="text-sm text-[--text-muted] leading-relaxed">
            Smart Waves Technologies — Industry 4.0, AI, clean energy, and smart agriculture solutions for a sustainable future.
          </p>
        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([group, links]) => (
          <div key={group}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[--text-muted] mb-4">{group}</h3>
            <ul className="flex flex-col gap-2" role="list">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[--text-secondary] hover:text-[--accent] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-[--border] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[--text-muted]">
        <span>© {new Date().getFullYear()} SWATEK — Smart Waves Technologies. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-[--accent] transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-[--accent] transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
