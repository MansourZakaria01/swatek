export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { Reveal } from '@/components/cinematic/Reveal'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

async function getSolution(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/solutions/${slug}`, { next: { revalidate: 60 } })
  if (!res.ok) return null
  return (await res.json()).solution
}

export default async function SolutionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const solution = await getSolution(slug)
  if (!solution) notFound()

  return (
    <div className="pt-24 pb-20 max-w-5xl mx-auto px-6">
      <Reveal>
        <Link href="/solutions" className="inline-flex items-center gap-1 text-sm text-[--text-muted] hover:text-[--accent] transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Solutions
        </Link>
      </Reveal>

      <Reveal direction="up">
        <span className="text-xs font-semibold uppercase tracking-widest text-[--accent]">{solution.sector}</span>
        <h1 className="text-3xl md:text-4xl font-extrabold mt-2 mb-4">{solution.titleEn}</h1>
        <p className="text-[--text-secondary] leading-relaxed max-w-3xl mb-10">{solution.descEn}</p>
      </Reveal>

      {solution.technologies?.length > 0 && (
        <Reveal direction="up" delay={0.1}>
          <h2 className="text-lg font-semibold mb-4">Technologies Included</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {solution.technologies.map(({ technology: t }: { technology: { id: string; slug: string; nameEn: string; descEn: string; domain: { nameEn: string } } }) => (
              <Link key={t.id} href={`/technologies/${t.slug}`}
                className="glass rounded-lg p-4 border border-[--border] hover:border-[--accent] transition-colors">
                <span className="text-xs text-[--accent] uppercase tracking-widest">{t.domain?.nameEn}</span>
                <h3 className="font-semibold mt-1 mb-1">{t.nameEn}</h3>
                <p className="text-xs text-[--text-muted] line-clamp-2">{t.descEn}</p>
                <span className="inline-flex items-center gap-1 text-xs text-[--accent] mt-3">Details <ArrowRight size={11} /></span>
              </Link>
            ))}
          </div>
        </Reveal>
      )}

      {solution.caseStudies?.length > 0 && (
        <Reveal direction="up" delay={0.2}>
          <h2 className="text-lg font-semibold mb-4">Related Case Studies</h2>
          <div className="space-y-3">
            {solution.caseStudies.map((cs: { id: string; slug: string; titleEn: string; sector: string; geography: string; roiPct: number | null }) => (
              <Link key={cs.id} href={`/case-studies/${cs.slug}`}
                className="flex items-center justify-between glass rounded-lg px-5 py-4 border border-[--border] hover:border-[--accent] transition-colors">
                <div>
                  <h3 className="font-medium text-sm">{cs.titleEn}</h3>
                  <p className="text-xs text-[--text-muted]">{cs.sector} · {cs.geography}</p>
                </div>
                {cs.roiPct != null && (
                  <span className="text-sm font-bold text-[--accent] flex-shrink-0 ml-4">{cs.roiPct}% ROI</span>
                )}
              </Link>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal direction="up" delay={0.25}>
        <div className="mt-12">
          <Link href={`/contact?type=project_development`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 rounded-lg bg-[--accent] text-[--background] font-semibold hover:bg-[--accent-dim] transition-colors">
            Discuss This Solution <ArrowRight size={16} />
          </Link>
        </div>
      </Reveal>
    </div>
  )
}
