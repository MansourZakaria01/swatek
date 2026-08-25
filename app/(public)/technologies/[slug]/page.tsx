export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { Reveal } from '@/components/cinematic/Reveal'
import { AnimatedCounter } from '@/components/cinematic/AnimatedCounter'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

async function getTechnology(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/technologies/${slug}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) return null
  return (await res.json()).technology
}

export default async function TechnologyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tech = await getTechnology(slug)
  if (!tech) notFound()

  const metrics = [
    { label: 'Energy Savings', value: tech.energySavingsPct, suffix: '%', color: 'var(--accent)' },
    { label: 'Carbon Reduction', value: tech.carbonReductionPct, suffix: '%', color: 'var(--success)' },
    { label: 'ROI Period', value: tech.roiPeriodMonths, suffix: ' mo', color: 'var(--warning)' },
  ].filter((m) => m.value != null)

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-6">
      <Reveal direction="up">
        <Link href="/technologies" className="inline-flex items-center gap-1 text-sm text-[--text-muted] hover:text-[--accent] transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Technologies
        </Link>
      </Reveal>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main content */}
        <div className="lg:col-span-2">
          <Reveal direction="up">
            <span className="text-xs font-semibold uppercase tracking-widest text-[--accent]">
              {tech.domain?.nameEn}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-2 mb-4">{tech.nameEn}</h1>
            <p className="text-[--text-secondary] leading-relaxed mb-8">{tech.descEn}</p>
          </Reveal>

          {tech.benefitsEn?.length > 0 && (
            <Reveal direction="up" delay={0.1}>
              <h2 className="text-lg font-semibold mb-4">Key Benefits</h2>
              <ul className="space-y-2 mb-8">
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
              <div className="flex flex-wrap gap-2 mb-8">
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
              className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 rounded-lg bg-[--accent] text-[--background] font-semibold hover:bg-[--accent-dim] transition-colors"
            >
              Request a Consultation <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>

        {/* Metrics sidebar */}
        <div className="space-y-4">
          {metrics.map((m, i) => (
            <Reveal key={m.label} direction="right" delay={i * 0.1}>
              <div className="glass rounded-xl p-6 text-center border border-[--border]">
                <div className="text-4xl font-extrabold mb-1" style={{ color: m.color }}>
                  <AnimatedCounter value={m.value} suffix={m.suffix} />
                </div>
                <div className="text-sm text-[--text-muted]">{m.label}</div>
              </div>
            </Reveal>
          ))}

          <Reveal direction="right" delay={0.3}>
            <div className="glass rounded-xl p-6 border border-[--border]">
              <h3 className="text-sm font-semibold text-[--text-muted] uppercase tracking-widest mb-3">Domain</h3>
              <Link
                href={`/technologies?domain=${tech.domain?.slug}`}
                className="text-[--accent] font-medium hover:underline"
              >
                {tech.domain?.nameEn}
              </Link>
              <p className="text-xs text-[--text-muted] mt-2 leading-relaxed">{tech.domain?.descEn}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
