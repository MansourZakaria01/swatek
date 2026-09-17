export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { Reveal } from '@/components/cinematic/Reveal'
import { AnimatedCounter } from '@/components/cinematic/AnimatedCounter'
import { PageHero } from '@/components/cinematic/PageHero'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getTechnologyBySlug } from '@/lib/queries'

export default async function TechnologyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tech = await getTechnologyBySlug(slug)
  if (!tech) notFound()

  const metrics = [
    { label: 'Energy Savings', value: tech.energySavingsPct, suffix: '%', color: 'var(--accent)' },
    { label: 'Carbon Reduction', value: tech.carbonReductionPct, suffix: '%', color: 'var(--success)' },
    { label: 'ROI Period', value: tech.roiPeriodMonths, suffix: ' mo', color: 'var(--warning)' },
  ].filter((m): m is typeof m & { value: number } => m.value != null)

  return (
    <>
      <PageHero
        index="01"
        kicker={tech.domain?.nameEn ?? 'Technology'}
        title={tech.nameEn}
        description={tech.descEn}
        compact
      >
        <Reveal>
          <Link href="/technologies" className="inline-flex items-center gap-1.5 text-sm text-[--text-muted] hover:text-[--accent] transition-colors">
            <ArrowLeft size={14} /> Back to Technologies
          </Link>
        </Reveal>
      </PageHero>

      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {tech.benefitsEn?.length > 0 && (
              <Reveal direction="up" delay={0.1}>
                <h2 className="font-display text-xl font-semibold mb-5">Key Benefits</h2>
                <ul className="space-y-3 mb-10">
                  {tech.benefitsEn.map((b: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-[--text-secondary] text-sm">
                      <span className="text-[--accent] mt-0.5 flex-shrink-0">→</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {tech.tags?.length > 0 && (
              <Reveal direction="up" delay={0.15}>
                <div className="flex flex-wrap gap-2 mb-10">
                  {tech.tags.map((tag: string) => (
                    <Link key={tag} href={`/technologies?tag=${tag}`}
                      className="px-3 py-1 rounded-full text-xs border border-[--border] text-[--text-muted] hover:border-[--accent] hover:text-[--accent] transition-colors">
                      {tag}
                    </Link>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal direction="up" delay={0.2}>
              <Link
                href={`/contact?type=technical_consulting&tech=${tech.slug}`}
                className="btn-cinematic inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[--accent] text-[--background] font-semibold hover:bg-[--accent-dim] transition-colors shadow-[0_0_28px_var(--accent-glow)]"
              >
                Request a Consultation <ArrowRight size={16} />
              </Link>
            </Reveal>
          </div>

          <div className="space-y-4">
            {metrics.map((m, i) => (
              <Reveal key={m.label} direction="right" delay={i * 0.1}>
                <div className="cine-frame rounded-2xl p-7 text-center">
                  <div className="font-display text-4xl font-extrabold mb-1" style={{ color: m.color }}>
                    <AnimatedCounter value={m.value} suffix={m.suffix} />
                  </div>
                  <div className="kicker text-[--text-muted] mt-2">{m.label}</div>
                </div>
              </Reveal>
            ))}

            <Reveal direction="right" delay={0.3}>
              <div className="cine-frame rounded-2xl p-6">
                <h3 className="kicker text-[--text-muted] mb-3">Domain</h3>
                <Link
                  href={`/technologies?domain=${tech.domain?.slug}`}
                  className="text-[--accent] font-medium hover:text-[--accent-warm]"
                >
                  {tech.domain?.nameEn}
                </Link>
                <p className="text-xs text-[--text-muted] mt-2 leading-relaxed">{tech.domain?.descEn}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  )
}
