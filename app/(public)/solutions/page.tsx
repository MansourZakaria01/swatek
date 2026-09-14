export const dynamic = 'force-dynamic'
import { Reveal } from '@/components/cinematic/Reveal'
import { PageHero } from '@/components/cinematic/PageHero'
import { GlowCard } from '@/components/cinematic/GlowCard'
import { SectionLabel } from '@/components/cinematic/SectionLabel'
import { SplitHeading } from '@/components/cinematic/SplitHeading'
import { MagneticButton } from '@/components/cinematic/MagneticButton'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { fetchPublicJson } from '@/lib/public-fetch'

async function getSolutions() {
  const data = await fetchPublicJson<{ solutions: unknown[] }>('/api/solutions')
  return data?.solutions ?? []
}

export const metadata = { title: 'Solutions' }

export default async function SolutionsPage() {
  const solutions = await getSolutions()

  return (
    <>
      <PageHero
        index="02"
        kicker="What We Offer"
        title="Solutions"
        description="Business-oriented packages combining multiple technologies to address specific industry challenges."
      />

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {solutions.length === 0 ? (
          <p className="text-[--text-muted] text-center py-20">No solutions available yet.</p>
        ) : (
          <>
            <Reveal direction="up">
              <div className="mb-10">
                <SectionLabel index="01" label="Packages" />
                <SplitHeading
                  text="Solution Portfolio"
                  as="h2"
                  className="font-display text-2xl md:text-4xl font-bold"
                  stagger={0.06}
                />
              </div>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-6">
              {solutions.map((sol: {
                id: string; slug: string; titleEn: string; descEn: string; sector: string;
                technologies: { technology: { nameEn: string; slug: string } }[]
                _count: { caseStudies: number }
              }, i: number) => (
                <Reveal key={sol.id} direction="up" delay={i * 0.08}>
                  <GlowCard className="p-8 h-full flex flex-col card-hover">
                    <div className="flex items-center justify-between mb-4">
                      <span className="kicker">{sol.sector}</span>
                      <span className="font-display text-xs tracking-[0.28em] text-[--text-muted]">0{i + 1}</span>
                    </div>
                    <h2 className="font-display text-2xl font-bold mb-3">{sol.titleEn}</h2>
                    <p className="text-sm text-[--text-secondary] leading-relaxed flex-1 mb-6">{sol.descEn}</p>

                    {sol.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {sol.technologies.map(({ technology: t }) => (
                          <Link key={t.slug} href={`/technologies/${t.slug}`}
                            className="px-2.5 py-0.5 text-xs rounded-full border border-[--border] text-[--text-muted] hover:border-[--accent] hover:text-[--accent] transition-colors">
                            {t.nameEn}
                          </Link>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                      {sol._count.caseStudies > 0 && (
                        <span className="text-xs text-[--text-muted]">{sol._count.caseStudies} case {sol._count.caseStudies === 1 ? 'study' : 'studies'}</span>
                      )}
                      <MagneticButton>
                        <Link href={`/solutions/${sol.slug}`} className="inline-flex items-center gap-1.5 text-sm text-[--accent] hover:text-[--accent-warm] ml-auto tracking-wide">
                          View solution <ArrowRight size={13} />
                        </Link>
                      </MagneticButton>
                    </div>
                  </GlowCard>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
