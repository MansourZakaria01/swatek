export const dynamic = 'force-dynamic'
import { Reveal } from '@/components/cinematic/Reveal'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

async function getSolutions() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/solutions`, { next: { revalidate: 60 } })
  if (!res.ok) return []
  return (await res.json()).solutions ?? []
}

export const metadata = { title: 'Solutions' }

export default async function SolutionsPage() {
  const solutions = await getSolutions()

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <Reveal direction="up">
        <span className="text-xs font-semibold uppercase tracking-widest text-[--accent]">What We Offer</span>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-3">Solutions</h1>
        <p className="text-[--text-secondary] max-w-xl mb-12">
          Business-oriented packages combining multiple technologies to address specific industry challenges.
        </p>
      </Reveal>

      {solutions.length === 0 ? (
        <p className="text-[--text-muted] text-center py-20">No solutions available yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {solutions.map((sol: {
            id: string; slug: string; titleEn: string; descEn: string; sector: string;
            technologies: { technology: { nameEn: string; slug: string } }[]
            _count: { caseStudies: number }
          }, i: number) => (
            <Reveal key={sol.id} direction="up" delay={i * 0.08}>
              <div className="glass rounded-xl p-7 border border-[--border] hover:border-[--accent-dim] transition-colors h-full flex flex-col">
                <span className="text-xs font-semibold text-[--accent] uppercase tracking-widest mb-2">{sol.sector}</span>
                <h2 className="text-xl font-bold mb-3">{sol.titleEn}</h2>
                <p className="text-sm text-[--text-secondary] leading-relaxed flex-1 mb-5">{sol.descEn}</p>

                {sol.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {sol.technologies.map(({ technology: t }) => (
                      <Link key={t.slug} href={`/technologies/${t.slug}`}
                        className="px-2 py-0.5 text-xs rounded border border-[--border] text-[--text-muted] hover:border-[--accent] hover:text-[--accent] transition-colors">
                        {t.nameEn}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  {sol._count.caseStudies > 0 && (
                    <span className="text-xs text-[--text-muted]">{sol._count.caseStudies} case {sol._count.caseStudies === 1 ? 'study' : 'studies'}</span>
                  )}
                  <Link href={`/solutions/${sol.slug}`} className="inline-flex items-center gap-1 text-sm text-[--accent] hover:underline ml-auto">
                    View solution <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
