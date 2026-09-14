export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { Reveal } from '@/components/cinematic/Reveal'
import { PageHero } from '@/components/cinematic/PageHero'
import { GlowCard } from '@/components/cinematic/GlowCard'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { fetchPublicJson } from '@/lib/public-fetch'

async function getSolution(slug: string) {
  const data = await fetchPublicJson<{ solution: unknown }>(`/api/solutions/${slug}`)
  return data?.solution ?? null
}

export default async function SolutionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const solution = await getSolution(slug)
  if (!solution) notFound()

  return (
    <>
      <PageHero
        index="02"
        kicker={solution.sector}
        title={solution.titleEn}
        description={solution.descEn}
        compact
      >
        <Reveal>
          <Link href="/solutions" className="inline-flex items-center gap-1.5 text-sm text-[--text-muted] hover:text-[--accent] transition-colors">
            <ArrowLeft size={14} /> Back to Solutions
          </Link>
        </Reveal>
      </PageHero>

      <div className="max-w-5xl mx-auto px-6 pb-24">
        {solution.technologies?.length > 0 && (
          <Reveal direction="up" delay={0.1}>
            <h2 className="font-display text-xl font-semibold mb-5">Technologies Included</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-14">
              {solution.technologies.map(({ technology: t }: { technology: { id: string; slug: string; nameEn: string; descEn: string; domain: { nameEn: string } } }) => (
                <Link key={t.id} href={`/technologies/${t.slug}`}>
                  <GlowCard className="p-5 h-full">
                    <span className="kicker">{t.domain?.nameEn}</span>
                    <h3 className="font-display font-semibold mt-2 mb-1">{t.nameEn}</h3>
                    <p className="text-xs text-[--text-muted] line-clamp-2">{t.descEn}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-[--accent] mt-3">Details <ArrowRight size={11} /></span>
                  </GlowCard>
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        {solution.caseStudies?.length > 0 && (
          <Reveal direction="up" delay={0.2}>
            <h2 className="font-display text-xl font-semibold mb-5">Related Case Studies</h2>
            <div className="space-y-3">
              {solution.caseStudies.map((cs: { id: string; slug: string; titleEn: string; sector: string; geography: string; roiPct: number | null }) => (
                <Link key={cs.id} href={`/case-studies/${cs.slug}`}
                  className="flex items-center justify-between cine-frame rounded-xl px-5 py-4 hover:border-[--accent] transition-colors">
                  <div>
                    <h3 className="font-medium text-sm">{cs.titleEn}</h3>
                    <p className="text-xs text-[--text-muted] mt-0.5">{cs.sector} · {cs.geography}</p>
                  </div>
                  {cs.roiPct != null && (
                    <span className="font-display text-sm font-bold text-[--accent] flex-shrink-0 ml-4">{cs.roiPct}% ROI</span>
                  )}
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal direction="up" delay={0.25}>
          <div className="mt-14">
            <Link href={`/contact?type=project_development`}
              className="btn-cinematic inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[--accent] text-[--background] font-semibold hover:bg-[--accent-dim] transition-colors shadow-[0_0_28px_var(--accent-glow)]">
              Discuss This Solution <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  )
}
