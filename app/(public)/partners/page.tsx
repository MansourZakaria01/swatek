export const dynamic = 'force-dynamic'
import { Reveal } from '@/components/cinematic/Reveal'
import { PageHero } from '@/components/cinematic/PageHero'
import { GlowCard } from '@/components/cinematic/GlowCard'
import { SectionLabel } from '@/components/cinematic/SectionLabel'
import { SplitHeading } from '@/components/cinematic/SplitHeading'
import { CinematicDivider } from '@/components/cinematic/CinematicDivider'
import { Marquee } from '@/components/cinematic/Marquee'
import { ExternalLink } from 'lucide-react'
import { fetchPublicJson } from '@/lib/public-fetch'

async function getPartners() {
  const data = await fetchPublicJson<{ partners: unknown[] }>('/api/partners')
  return data?.partners ?? []
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
  academic:   'text-[--accent-violet]',
  financial:  'text-[--accent-warm]',
  government: 'text-sky-400',
  industry:   'text-[--success]',
}

const marqueeItems = [
  'Technology Partners', 'Academic Research', 'Financial Institutions',
  'Government Bodies', 'Industry Leaders', 'Innovation Ecosystems',
]

export default async function PartnersPage() {
  const partners = await getPartners()

  const featured = partners.filter((p: { featured: boolean }) => p.featured)
  const others = partners.filter((p: { featured: boolean }) => !p.featured)

  return (
    <>
      <PageHero
        index="05"
        kicker="Ecosystem"
        title="Partners"
        description="A growing network of academic institutions, technology providers, financial partners, and government bodies working towards sustainable industry."
      />

      <Marquee items={marqueeItems} />

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {featured.length > 0 && (
          <>
            <Reveal direction="up" delay={0.05}>
              <div className="mb-8">
                <SectionLabel index="01" label="Featured" />
                <SplitHeading
                  text="Strategic Partners"
                  as="h2"
                  className="font-display text-2xl md:text-4xl font-bold"
                  stagger={0.06}
                />
              </div>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-5 mb-16">
              {featured.map((p: { id: string; name: string; descEn: string; type: string; website?: string }, i: number) => (
                <Reveal key={p.id} direction="up" delay={i * 0.08}>
                  <GlowCard className="p-8 h-full card-hover" glowColor="rgba(240,180,90,0.16)">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <span className={`kicker ${TYPE_COLORS[p.type] ?? ''}`}>
                        {TYPE_LABELS[p.type] ?? p.type}
                      </span>
                      {p.website && (
                        <a href={p.website} target="_blank" rel="noopener noreferrer"
                          className="text-[--text-muted] hover:text-[--accent] transition-colors">
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-xl mb-3">{p.name}</h3>
                    <p className="text-sm text-[--text-secondary] leading-relaxed">{p.descEn}</p>
                  </GlowCard>
                </Reveal>
              ))}
            </div>
          </>
        )}

        {featured.length > 0 && others.length > 0 && (
          <CinematicDivider className="mb-14" />
        )}

        {others.length > 0 && (
          <>
            <Reveal direction="up">
              <div className="mb-8">
                <SectionLabel index="02" label="Network" />
                <SplitHeading
                  text="All Partners"
                  as="h2"
                  className="font-display text-2xl md:text-4xl font-bold"
                  stagger={0.06}
                />
              </div>
            </Reveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {others.map((p: { id: string; name: string; descEn: string; type: string; website?: string }, i: number) => (
                <Reveal key={p.id} direction="up" delay={Math.min(i * 0.06, 0.3)}>
                  <GlowCard className="p-6 h-full card-hover">
                    <span className={`kicker block mb-3 ${TYPE_COLORS[p.type] ?? ''}`}>
                      {TYPE_LABELS[p.type] ?? p.type}
                    </span>
                    <h3 className="font-display font-semibold text-lg mb-2">{p.name}</h3>
                    <p className="text-xs text-[--text-muted] leading-relaxed mb-4">{p.descEn}</p>
                    {p.website && (
                      <a href={p.website} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[--accent] hover:text-[--accent-warm]">
                        Website <ExternalLink size={10} />
                      </a>
                    )}
                  </GlowCard>
                </Reveal>
              ))}
            </div>
          </>
        )}

        {partners.length === 0 && (
          <p className="text-[--text-muted] text-center py-20">No partners listed yet.</p>
        )}
      </div>
    </>
  )
}
