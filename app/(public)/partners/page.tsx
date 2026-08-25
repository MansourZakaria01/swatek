export const dynamic = 'force-dynamic'
import { Reveal } from '@/components/cinematic/Reveal'
import { ExternalLink } from 'lucide-react'

async function getPartners() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/partners`, { next: { revalidate: 3600 } })
  if (!res.ok) return []
  return (await res.json()).partners ?? []
}

export const metadata = { title: 'Partners' }

const TYPE_LABELS: Record<string, string> = {
  technology: 'Technology',
  academic: 'Academic / Research',
  financial: 'Financial',
  government: 'Government',
  industry: 'Industry',
}

const TYPE_COLORS: Record<string, string> = {
  technology: 'text-[--accent]',
  academic:   'text-purple-400',
  financial:  'text-[--warning]',
  government: 'text-blue-400',
  industry:   'text-[--success]',
}

export default async function PartnersPage() {
  const partners = await getPartners()

  const featured = partners.filter((p: { featured: boolean }) => p.featured)
  const others = partners.filter((p: { featured: boolean }) => !p.featured)

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <Reveal direction="up">
        <span className="text-xs font-semibold uppercase tracking-widest text-[--accent]">Ecosystem</span>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-3">Partners</h1>
        <p className="text-[--text-secondary] max-w-xl mb-14">
          A growing network of academic institutions, technology providers, financial partners, and government bodies working towards sustainable industry.
        </p>
      </Reveal>

      {featured.length > 0 && (
        <>
          <Reveal direction="up" delay={0.05}>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[--text-muted] mb-5">Strategic Partners</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5 mb-14">
            {featured.map((p: { id: string; name: string; descEn: string; type: string; website?: string }, i: number) => (
              <Reveal key={p.id} direction="up" delay={i * 0.08}>
                <div className="glass rounded-xl p-7 border border-[--accent-dim] h-full">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className={`text-xs font-semibold uppercase tracking-widest ${TYPE_COLORS[p.type] ?? ''}`}>
                      {TYPE_LABELS[p.type] ?? p.type}
                    </span>
                    {p.website && (
                      <a href={p.website} target="_blank" rel="noopener noreferrer"
                        className="text-[--text-muted] hover:text-[--accent] transition-colors">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{p.name}</h3>
                  <p className="text-sm text-[--text-secondary] leading-relaxed">{p.descEn}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </>
      )}

      {others.length > 0 && (
        <>
          <Reveal direction="up">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[--text-muted] mb-5">All Partners</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {others.map((p: { id: string; name: string; descEn: string; type: string; website?: string }, i: number) => (
              <Reveal key={p.id} direction="up" delay={Math.min(i * 0.06, 0.3)}>
                <div className="glass rounded-xl p-6 border border-[--border] hover:border-[--accent-dim] transition-colors h-full">
                  <span className={`text-xs font-semibold uppercase tracking-widest block mb-2 ${TYPE_COLORS[p.type] ?? ''}`}>
                    {TYPE_LABELS[p.type] ?? p.type}
                  </span>
                  <h3 className="font-semibold mb-2">{p.name}</h3>
                  <p className="text-xs text-[--text-muted] leading-relaxed mb-3">{p.descEn}</p>
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[--accent] hover:underline">
                      Website <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </>
      )}

      {partners.length === 0 && (
        <p className="text-[--text-muted] text-center py-20">No partners listed yet.</p>
      )}
    </div>
  )
}
