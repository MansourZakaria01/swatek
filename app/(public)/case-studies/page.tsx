export const dynamic = 'force-dynamic'
import { Reveal } from '@/components/cinematic/Reveal'
import { PageHero } from '@/components/cinematic/PageHero'
import { GlowCard } from '@/components/cinematic/GlowCard'
import { AnimatedCounter } from '@/components/cinematic/AnimatedCounter'
import { ParallaxSection } from '@/components/cinematic/ParallaxSection'
import Link from 'next/link'
import { ArrowRight, MapPin, Tag } from 'lucide-react'
import { getCaseStudies } from '@/lib/queries'

export const metadata = { title: 'Case Studies' }

export default async function CaseStudiesPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string; geography?: string }>
}) {
  const { sector, geography } = await searchParams
  const caseStudies = await getCaseStudies(sector, geography)

  const allSectors = ['Heavy Industry', 'Aquaculture', 'Waste Management', 'Agriculture', 'Energy', 'Smart Cities']

  return (
    <>
      <PageHero
        index="03"
        kicker="Proof of Impact"
        title="Case Studies"
        description="Real deployments with measurable results — from steel plants to fish farms to municipal waste facilities."
      >
        <Reveal direction="up" delay={0.1}>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="kicker text-[--text-muted]">Sector</span>
            <Link href="/case-studies" className={`px-3 py-1 rounded-full text-xs border transition-colors ${!sector ? 'bg-[--accent] text-[--background] border-[--accent]' : 'border-[--border] text-[--text-muted] hover:border-[--accent]'}`}>All</Link>
            {allSectors.map((s) => (
              <Link key={s} href={`/case-studies?sector=${encodeURIComponent(s)}${geography ? `&geography=${encodeURIComponent(geography)}` : ''}`}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${sector === s ? 'bg-[--accent] text-[--background] border-[--accent]' : 'border-[--border] text-[--text-muted] hover:border-[--accent]'}`}>
                {s}
              </Link>
            ))}
          </div>
        </Reveal>
      </PageHero>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {caseStudies.length === 0 ? (
          <p className="text-[--text-muted] text-center py-20">No case studies found for this filter.</p>
        ) : (
          <ParallaxSection speed={0.12}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies.map((cs: {
                id: string; slug: string; titleEn: string; descEn: string; sector: string; geography: string;
                tags: string[]; carbonReductionTons: number | null; roiPct: number | null;
                productivityGainPct: number | null; opCostReductionPct: number | null
              }, i: number) => (
                <Reveal key={cs.id} direction="up" delay={Math.min(i * 0.07, 0.3)}>
                  <Link href={`/case-studies/${cs.slug}`} className="block group h-full">
                    <GlowCard className="p-6 h-full flex flex-col card-hover">
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <span className="kicker">{cs.sector}</span>
                        <span className="flex items-center gap-1 text-xs text-[--text-muted]">
                          <MapPin size={10} /> {cs.geography}
                        </span>
                      </div>
                      <h2 className="font-display font-bold text-lg mb-3 group-hover:text-[--accent] transition-colors leading-snug">{cs.titleEn}</h2>
                      <p className="text-sm text-[--text-muted] line-clamp-3 flex-1 mb-5">{cs.descEn}</p>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {cs.carbonReductionTons != null && (
                          <div className="cine-frame rounded-lg p-2.5 text-center">
                            <div className="text-sm font-bold text-[--success] tabular-nums">
                              <AnimatedCounter value={cs.carbonReductionTons} />
                            </div>
                            <div className="text-[10px] text-[--text-muted] tracking-widest uppercase">t CO₂/yr</div>
                          </div>
                        )}
                        {cs.roiPct != null && (
                          <div className="cine-frame rounded-lg p-2.5 text-center">
                            <div className="text-sm font-bold text-[--accent] tabular-nums">
                              <AnimatedCounter value={cs.roiPct} suffix="%" />
                            </div>
                            <div className="text-[10px] text-[--text-muted] tracking-widest uppercase">ROI</div>
                          </div>
                        )}
                        {cs.productivityGainPct != null && (
                          <div className="cine-frame rounded-lg p-2.5 text-center">
                            <div className="text-sm font-bold text-[--accent-violet] tabular-nums">
                              <AnimatedCounter value={cs.productivityGainPct} prefix="+" suffix="%" />
                            </div>
                            <div className="text-[10px] text-[--text-muted] tracking-widest uppercase">Productivity</div>
                          </div>
                        )}
                        {cs.opCostReductionPct != null && (
                          <div className="cine-frame rounded-lg p-2.5 text-center">
                            <div className="text-sm font-bold text-[--accent-warm] tabular-nums">
                              <AnimatedCounter value={cs.opCostReductionPct} suffix="%" />
                            </div>
                            <div className="text-[10px] text-[--text-muted] tracking-widest uppercase">Cost reduction</div>
                          </div>
                        )}
                      </div>

                      {cs.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {cs.tags.slice(0, 3).map((t: string) => (
                            <span key={t} className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-[--surface-2] text-[--text-muted] border border-[--border]">
                              <Tag size={9} /> {t}
                            </span>
                          ))}
                        </div>
                      )}

                      <span className="inline-flex items-center gap-1.5 text-xs text-[--accent] mt-auto tracking-wide">
                        Read full case study <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </GlowCard>
                  </Link>
                </Reveal>
              ))}
            </div>
          </ParallaxSection>
        )}
      </div>
    </>
  )
}
