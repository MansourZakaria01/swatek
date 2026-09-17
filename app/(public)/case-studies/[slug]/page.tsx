export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { Reveal } from '@/components/cinematic/Reveal'
import { AnimatedCounter } from '@/components/cinematic/AnimatedCounter'
import { PageHero } from '@/components/cinematic/PageHero'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react'
import { getCaseStudyBySlug } from '@/lib/queries'

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cs = await getCaseStudyBySlug(slug)
  if (!cs) notFound()

  const metrics = [
    { label: 'Carbon Reduction', value: cs.carbonReductionTons, suffix: ' t/yr', color: 'var(--success)' },
    { label: 'ROI', value: cs.roiPct, suffix: '%', color: 'var(--accent)' },
    { label: 'Productivity Gain', value: cs.productivityGainPct, suffix: '%', color: 'var(--warning)' },
    { label: 'Op. Cost Reduction', value: cs.opCostReductionPct, suffix: '%', color: 'var(--accent-violet)' },
    { label: 'Capacity', value: cs.capacityMW, suffix: ' MW', color: 'var(--accent)' },
  ].filter((m): m is typeof m & { value: number } => m.value != null)

  return (
    <>
      <PageHero
        index="03"
        kicker={cs.sector}
        title={cs.titleEn}
        description={cs.descEn}
        compact
      >
        <Reveal>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/case-studies" className="inline-flex items-center gap-1.5 text-sm text-[--text-muted] hover:text-[--accent] transition-colors">
              <ArrowLeft size={14} /> Back to Case Studies
            </Link>
            <span className="flex items-center gap-1 text-xs text-[--text-muted]"><MapPin size={11} /> {cs.geography}</span>
          </div>
        </Reveal>
      </PageHero>

      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
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
                <div className="cine-frame rounded-2xl p-6 mb-10">
                  <p className="kicker text-[--text-muted] mb-2">Related Solution</p>
                  <Link href={`/solutions/${cs.solution.slug}`}
                    className="font-display font-semibold text-[--accent] hover:text-[--accent-warm] flex items-center gap-1.5">
                    {cs.solution.titleEn} <ArrowRight size={13} />
                  </Link>
                </div>
              </Reveal>
            )}

            <Reveal direction="up" delay={0.2}>
              <Link href="/contact?type=project_development"
                className="btn-cinematic inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[--accent] text-[--background] font-semibold hover:bg-[--accent-dim] transition-colors shadow-[0_0_28px_var(--accent-glow)]">
                Start a Similar Project <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>

          <div className="space-y-4">
            <Reveal direction="right">
              <h2 className="kicker text-[--text-muted] mb-4">Impact Metrics</h2>
            </Reveal>
            {metrics.map((m, i) => (
              <Reveal key={m.label} direction="right" delay={i * 0.08}>
                <div className="cine-frame rounded-2xl p-6 text-center">
                  <div className="font-display text-3xl font-extrabold mb-1" style={{ color: m.color }}>
                    <AnimatedCounter value={m.value} suffix={m.suffix} />
                  </div>
                  <div className="text-xs text-[--text-muted] tracking-widest uppercase mt-1">{m.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
