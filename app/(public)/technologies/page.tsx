export const dynamic = 'force-dynamic'
import { Reveal } from '@/components/cinematic/Reveal'
import { ExpandableCard } from '@/components/cinematic/ExpandableCard'
import { PageHero } from '@/components/cinematic/PageHero'
import { MagneticButton } from '@/components/cinematic/MagneticButton'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getTechnologies, getDomains } from '@/lib/queries'

export default async function TechnologiesPage({
  searchParams,
}: {
  searchParams: Promise<{ domain?: string; tag?: string }>
}) {
  const { domain, tag } = await searchParams
  const [technologies, domains] = await Promise.all([getTechnologies(domain, tag), getDomains()])

  return (
    <>
      <PageHero
        index="01"
        kicker="Catalog"
        title="Technologies"
        description="Browse our full technology portfolio. Filter by domain or impact area to find the right solution."
      >
        <Reveal direction="up" delay={0.1}>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by domain">
            <Link
              href="/technologies"
              className={`inline-flex items-center justify-center px-4 py-1.5 h-8 rounded-full text-sm border transition-colors ${!domain ? 'bg-[--accent] text-[--background] border-[--accent]' : 'border-[--border] text-[--text-secondary] hover:border-[--accent] hover:text-[--accent]'}`}
            >
              All
            </Link>
            {domains.map((d: { slug: string; nameEn: string }) => (
              <Link
                key={d.slug}
                href={`/technologies?domain=${d.slug}`}
                className={`inline-flex items-center justify-center px-4 py-1.5 h-8 rounded-full text-sm border transition-colors ${domain === d.slug ? 'bg-[--accent] text-[--background] border-[--accent]' : 'border-[--border] text-[--text-secondary] hover:border-[--accent] hover:text-[--accent]'}`}
              >
                {d.nameEn}
              </Link>
            ))}
          </div>
        </Reveal>
      </PageHero>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {technologies.length === 0 ? (
          <Reveal><p className="text-[--text-muted] py-20 text-center tracking-wide">No technologies found for this filter.</p></Reveal>
        ) : (
          <div className="space-y-4">
            {technologies.map((tech: {
              id: string; slug: string; nameEn: string; domain: { nameEn: string };
              descEn: string; benefitsEn: string[]; energySavingsPct: number | null;
              carbonReductionPct: number | null; roiPeriodMonths: number | null; tags: string[]
            }, i: number) => (
              <Reveal key={tech.id} direction="up" delay={Math.min(i * 0.05, 0.3)}>
                <ExpandableCard
                  title={tech.nameEn}
                  subtitle={tech.domain?.nameEn}
                  preview={<p className="line-clamp-1 text-[--text-muted]">{tech.descEn}</p>}
                >
                  <div className="pt-5 grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <p className="text-[--text-secondary] text-sm leading-relaxed">{tech.descEn}</p>
                      {tech.benefitsEn?.length > 0 && (
                        <ul className="space-y-1.5">
                          {tech.benefitsEn.map((b: string) => (
                            <li key={b} className="flex items-start gap-2 text-sm text-[--text-secondary]">
                              <span className="text-[--accent] mt-0.5">→</span> {b}
                            </li>
                          ))}
                        </ul>
                      )}
                      {tech.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tech.tags.map((tag: string) => (
                            <Link key={tag} href={`/technologies?tag=${tag}`}
                              className="px-2.5 py-0.5 rounded-full text-xs bg-[--surface-2] text-[--text-muted] border border-[--border] hover:border-[--accent-dim]">
                              {tag}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      {[
                        { label: 'Energy savings', value: tech.energySavingsPct, suffix: '%', color: '--accent' },
                        { label: 'Carbon reduction', value: tech.carbonReductionPct, suffix: '%', color: '--success' },
                        { label: 'ROI period', value: tech.roiPeriodMonths, suffix: ' mo', color: '--warning' },
                      ].map((m) => m.value != null && (
                        <div key={m.label} className="cine-frame rounded-xl p-3 text-center">
                          <div className="font-display text-2xl font-bold" style={{ color: `var(${m.color})` }}>{m.value}{m.suffix}</div>
                          <div className="text-xs text-[--text-muted] tracking-widest uppercase mt-1">{m.label}</div>
                        </div>
                      ))}
                      <MagneticButton>
                        <Link href={`/technologies/${tech.slug}`}
                          className="btn-cinematic inline-flex items-center justify-center gap-1 py-2.5 rounded-full border border-[--accent] text-[--accent] text-sm hover:bg-[--accent] hover:text-[--background] transition-colors">
                          Full detail <ArrowRight size={14} />
                        </Link>
                      </MagneticButton>
                    </div>
                  </div>
                </ExpandableCard>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
