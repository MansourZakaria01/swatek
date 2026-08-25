export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { Reveal } from '@/components/cinematic/Reveal'
import { AnimatedCounter } from '@/components/cinematic/AnimatedCounter'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react'

async function getCaseStudy(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/case-studies/${slug}`, { next: { revalidate: 60 } })
  if (!res.ok) return null
  return (await res.json()).caseStudy
}

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cs = await getCaseStudy(slug)
  if (!cs) notFound()

  const metrics = [
    { label: 'Carbon Reduction', value: cs.carbonReductionTons, suffix: ' t/yr', color: 'var(--success)' },
    { label: 'ROI', value: cs.roiPct, suffix: '%', color: 'var(--accent)' },
    { label: 'Productivity Gain', value: cs.productivityGainPct, suffix: '%', color: 'var(--warning)' },
    { label: 'Op. Cost Reduction', value: cs.opCostReductionPct, suffix: '%', color: '#a78bfa' },
    { label: 'Capacity', value: cs.capacityMW, suffix: ' MW', color: 'var(--accent)' },
  ].filter((m) => m.value != null)

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-6">
      <Reveal>
        <Link href="/case-studies" className="inline-flex items-center gap-1 text-sm text-[--text-muted] hover:text-[--accent] transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Case Studies
        </Link>
      </Reveal>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <Reveal direction="up">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold text-[--accent] uppercase tracking-widest">{cs.sector}</span>
              <span className="flex items-center gap-1 text-xs text-[--text-muted]"><MapPin size={11} /> {cs.geography}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{cs.titleEn}</h1>
            <p className="text-[--text-secondary] leading-relaxed mb-8">{cs.descEn}</p>
          </Reveal>

          {cs.tags?.length > 0 && (
            <Reveal direction="up" delay={0.1}>
              <div className="flex flex-wrap gap-2 mb-8">
                {cs.tags.map((t: string) => (
                  <Link key={t} href={`/case-studies?tag=${t}`}
                    className="px-3 py-1 rounded-full text-xs border border-[--border] text-[--text-muted] hover:border-[--accent] hover:text-[--accent] transition-colors">
                    {t}
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          {cs.solution && (
            <Reveal direction="up" delay={0.15}>
              <div className="glass rounded-xl p-5 border border-[--border] mb-8">
                <p className="text-xs text-[--text-muted] uppercase tracking-widest mb-1">Related Solution</p>
                <Link href={`/solutions/${cs.solution.slug}`}
                  className="font-semibold text-[--accent] hover:underline flex items-center gap-1">
                  {cs.solution.titleEn} <ArrowRight size={13} />
                </Link>
              </div>
            </Reveal>
          )}

          <Reveal direction="up" delay={0.2}>
            <Link href="/contact?type=project_development"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 rounded-lg bg-[--accent] text-[--background] font-semibold hover:bg-[--accent-dim] transition-colors">
              Start a Similar Project <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>

        {/* Metrics */}
        <div className="space-y-4">
          <Reveal direction="right">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[--text-muted] mb-4">Impact Metrics</h2>
          </Reveal>
          {metrics.map((m, i) => (
            <Reveal key={m.label} direction="right" delay={i * 0.08}>
              <div className="glass rounded-xl p-5 text-center border border-[--border]">
                <div className="text-3xl font-extrabold mb-1" style={{ color: m.color }}>
                  <AnimatedCounter value={m.value} suffix={m.suffix} decimals={m.suffix.includes('t') ? 0 : 0} />
                </div>
                <div className="text-xs text-[--text-muted]">{m.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
