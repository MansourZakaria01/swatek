export const dynamic = 'force-dynamic'
import { Reveal } from '@/components/cinematic/Reveal'
import Link from 'next/link'
import { ArrowRight, MapPin, Tag } from 'lucide-react'

async function getCaseStudies(sector?: string, geography?: string) {
  const params = new URLSearchParams()
  if (sector) params.set('sector', sector)
  if (geography) params.set('geography', geography)
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/case-studies?${params}`, { next: { revalidate: 60 } })
  if (!res.ok) return []
  return (await res.json()).caseStudies ?? []
}

export const metadata = { title: 'Case Studies' }

export default async function CaseStudiesPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string; geography?: string }>
}) {
  const { sector, geography } = await searchParams
  const caseStudies = await getCaseStudies(sector, geography)

  const allSectors = ['Heavy Industry', 'Aquaculture', 'Waste Management', 'Agriculture', 'Energy', 'Smart Cities']
  const allGeographies = ['Algeria', 'Morocco', 'Tunisia', 'France', 'Germany']

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <Reveal direction="up">
        <span className="text-xs font-semibold uppercase tracking-widest text-[--accent]">Proof of Impact</span>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-3">Case Studies</h1>
        <p className="text-[--text-secondary] max-w-xl mb-10">
          Real deployments with measurable results — from steel plants to fish farms to municipal waste facilities.
        </p>
      </Reveal>

      {/* Filters */}
      <Reveal direction="up" delay={0.1}>
        <div className="flex flex-wrap gap-3 mb-10">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-[--text-muted] uppercase tracking-widest">Sector:</span>
            <Link href="/case-studies" className={`px-3 py-1 rounded-full text-xs border transition-colors ${!sector ? 'bg-[--accent] text-[--background] border-[--accent]' : 'border-[--border] text-[--text-muted] hover:border-[--accent]'}`}>All</Link>
            {allSectors.map((s) => (
              <Link key={s} href={`/case-studies?sector=${encodeURIComponent(s)}${geography ? `&geography=${encodeURIComponent(geography)}` : ''}`}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${sector === s ? 'bg-[--accent] text-[--background] border-[--accent]' : 'border-[--border] text-[--text-muted] hover:border-[--accent]'}`}>
                {s}
              </Link>
            ))}
          </div>
        </div>
      </Reveal>

      {caseStudies.length === 0 ? (
        <p className="text-[--text-muted] text-center py-20">No case studies found for this filter.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((cs: {
            id: string; slug: string; titleEn: string; descEn: string; sector: string; geography: string;
            tags: string[]; carbonReductionTons: number | null; roiPct: number | null;
            productivityGainPct: number | null; opCostReductionPct: number | null
          }, i: number) => (
            <Reveal key={cs.id} direction="up" delay={Math.min(i * 0.07, 0.3)}>
              <Link href={`/case-studies/${cs.slug}`} className="block group h-full">
                <div className="glass rounded-xl p-6 border border-[--border] group-hover:border-[--accent-dim] transition-colors h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold text-[--accent] uppercase tracking-widest">{cs.sector}</span>
                    <span className="flex items-center gap-1 text-xs text-[--text-muted]">
                      <MapPin size={10} /> {cs.geography}
                    </span>
                  </div>
                  <h2 className="font-bold text-base mb-2 group-hover:text-[--accent] transition-colors leading-snug">{cs.titleEn}</h2>
                  <p className="text-sm text-[--text-muted] line-clamp-3 flex-1 mb-4">{cs.descEn}</p>

                  {/* Key metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {cs.carbonReductionTons != null && (
                      <div className="glass rounded-lg p-2 text-center">
                        <div className="text-sm font-bold text-[--success]">{cs.carbonReductionTons.toLocaleString()}</div>
                        <div className="text-xs text-[--text-muted]">t CO₂/yr</div>
                      </div>
                    )}
                    {cs.roiPct != null && (
                      <div className="glass rounded-lg p-2 text-center">
                        <div className="text-sm font-bold text-[--accent]">{cs.roiPct}%</div>
                        <div className="text-xs text-[--text-muted]">ROI</div>
                      </div>
                    )}
                    {cs.productivityGainPct != null && (
                      <div className="glass rounded-lg p-2 text-center">
                        <div className="text-sm font-bold text-purple-400">+{cs.productivityGainPct}%</div>
                        <div className="text-xs text-[--text-muted]">Productivity</div>
                      </div>
                    )}
                    {cs.opCostReductionPct != null && (
                      <div className="glass rounded-lg p-2 text-center">
                        <div className="text-sm font-bold text-[--warning]">{cs.opCostReductionPct}%</div>
                        <div className="text-xs text-[--text-muted]">Cost reduction</div>
                      </div>
                    )}
                  </div>

                  {cs.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {cs.tags.slice(0, 3).map((t: string) => (
                        <span key={t} className="flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-[--surface-2] text-[--text-muted]">
                          <Tag size={9} /> {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="inline-flex items-center gap-1 text-xs text-[--accent] mt-auto">
                    Read full case study <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
