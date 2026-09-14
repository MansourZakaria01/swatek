export const dynamic = 'force-dynamic'

import { HeroSection }     from '@/components/cinematic/HeroSection'
import { Reveal }          from '@/components/cinematic/Reveal'
import { AnimatedCounter } from '@/components/cinematic/AnimatedCounter'
import { ExpandableCard }  from '@/components/cinematic/ExpandableCard'
import { SplitHeading }    from '@/components/cinematic/SplitHeading'
import { MagneticButton }  from '@/components/cinematic/MagneticButton'
import { GlowCard }        from '@/components/cinematic/GlowCard'
import { ParallaxSection } from '@/components/cinematic/ParallaxSection'
import Link from 'next/link'
import { ArrowRight, Brain, Factory, Recycle, Zap, Sprout, Building2 } from 'lucide-react'

async function getMetrics() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/metrics`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = await res.json()
    return data.metrics ?? []
  } catch { return [] }
}

async function getFeaturedTechnologies() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/technologies?featured=true`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = await res.json()
    return data.technologies ?? []
  } catch { return [] }
}

const domainCards = [
  { icon: Brain,     label: 'Artificial Intelligence', slug: 'artificial-intelligence', desc: 'Predictive analytics, computer vision, and intelligent automation.' },
  { icon: Factory,   label: 'Industry 4.0',            slug: 'industry-40',            desc: 'Connected factories, digital twins, and IIoT ecosystems.' },
  { icon: Recycle,   label: 'Circular Economy',        slug: 'circular-economy',       desc: 'Waste valorization and zero-waste production cycles.' },
  { icon: Zap,       label: 'Energy & Hydrogen',       slug: 'energy-hydrogen',        desc: 'Clean energy, smart grids, and green hydrogen production.' },
  { icon: Sprout,    label: 'Agriculture 4.0',         slug: 'agriculture-40',         desc: 'Precision farming, smart aquaculture, and yield optimization.' },
  { icon: Building2, label: 'Smart Infrastructure',    slug: 'smart-infrastructure',   desc: 'Smart buildings, BMS, HVAC optimization, and urban IoT.' },
]

export default async function HomePage() {
  const [metrics, technologies] = await Promise.all([getMetrics(), getFeaturedTechnologies()])

  const displayMetrics = metrics.length > 0 ? metrics : [
    { labelEn: 'CO₂ Avoided',    value: 125000, unit: 'tonnes/year' },
    { labelEn: 'Energy Saved',   value: 380,    unit: 'GWh/year' },
    { labelEn: 'Clients Served', value: 47,     unit: 'organizations' },
    { labelEn: 'Waste Valorized',value: 95000,  unit: 'tonnes/year' },
  ]

  return (
    <>
      {/* ── Hero ── */}
      <HeroSection>
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
          <Reveal direction="up">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[--accent] border border-[--accent-dim] rounded-full px-4 py-1 mb-6">
              Industry 4.0 · AI · Sustainability
            </span>
          </Reveal>

          <SplitHeading
            text="Intelligent Solutions for a Sustainable Industry"
            as="h1"
            className="text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 max-w-4xl"
            delay={0.1}
            stagger={0.06}
          />

          <Reveal direction="up" delay={0.4}>
            <p className="text-lg md:text-xl text-[--text-secondary] max-w-2xl mb-10 leading-relaxed">
              SWATEK delivers AI, IoT, and clean energy technologies that reduce costs, cut emissions, and future-proof industrial and agricultural operations across North Africa and beyond.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.55}>
            <div className="flex flex-wrap items-center gap-4">
              <MagneticButton>
                <Link
                  href="/technologies"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 rounded-lg bg-[--accent] text-[--background] font-semibold hover:bg-[--accent-dim] transition-colors"
                >
                  Explore Technologies <ArrowRight size={18} />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="/solutions"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 rounded-lg border border-[--border] text-[--foreground] font-semibold hover:border-[--accent] hover:text-[--accent] transition-colors"
                >
                  Our Solutions
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 h-12 rounded-lg border border-[--border] text-[--foreground] font-semibold hover:border-[--accent] hover:text-[--accent] transition-colors"
                >
                  Contact Us
                </Link>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </HeroSection>

      {/* ── Impact Metrics ── */}
      <ParallaxSection speed={0.15}>
        <section className="py-20 bg-[--surface] border-y border-[--border]" aria-label="Impact statistics">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal direction="none">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {displayMetrics.slice(0, 4).map((m: { labelEn: string; value: number; unit: string }, i: number) => (
                  <Reveal key={i} direction="up" delay={i * 0.1}>
                    <div className="text-center group cursor-default">
                      <div className="text-4xl md:text-5xl font-extrabold text-gradient tabular-nums transition-transform duration-300 group-hover:scale-110">
                        <AnimatedCounter value={m.value} suffix={m.unit.includes('%') ? '%' : '+'} />
                      </div>
                      <p className="text-sm text-[--text-muted] mt-2">{m.labelEn}</p>
                      <p className="text-xs text-[--text-muted] opacity-60">{m.unit}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      </ParallaxSection>

      {/* ── Technology Domains ── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <Reveal direction="up">
          <div className="mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[--accent]">Technology Domains</span>
            <SplitHeading
              text="Six Pillars of Innovation"
              as="h2"
              className="text-3xl md:text-4xl font-bold mt-2"
              stagger={0.08}
            />
            <p className="text-[--text-secondary] mt-3 max-w-xl">
              From clean energy to smart cities — our solutions span the full spectrum of sustainable industrial transformation.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {domainCards.map((domain, i) => {
            const Icon = domain.icon
            return (
              <Reveal key={domain.slug} direction="up" delay={i * 0.07}>
                <Link href={`/technologies?domain=${domain.slug}`} className="block group h-full">
                  <GlowCard className="p-6 h-full border border-[--border] hover:border-[--accent] transition-colors duration-300 cursor-pointer">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: 'var(--accent-glow)' }}>
                      <Icon size={20} className="text-[--accent]" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-[--accent] transition-colors">{domain.label}</h3>
                    <p className="text-sm text-[--text-muted]">{domain.desc}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-[--accent] mt-4 font-medium">
                      Explore <ArrowRight size={12} />
                    </span>
                  </GlowCard>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ── Featured Technologies ── */}
      {technologies.length > 0 && (
        <section className="py-24 bg-[--surface] border-y border-[--border]">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal direction="up">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[--accent]">Featured</span>
                  <SplitHeading text="Key Technologies" as="h2" className="text-3xl md:text-4xl font-bold mt-2" stagger={0.1} />
                </div>
                <Link href="/technologies" className="text-sm text-[--accent] hover:underline hidden md:flex items-center gap-1">
                  View all <ArrowRight size={14} />
                </Link>
              </div>
            </Reveal>

            <div className="space-y-3">
              {technologies.slice(0, 4).map((tech: {
                id: string; nameEn: string; domain: { nameEn: string }; descEn: string;
                energySavingsPct: number | null; carbonReductionPct: number | null; tags: string[]
              }, i: number) => (
                <Reveal key={tech.id} direction="up" delay={i * 0.08}>
                  <ExpandableCard
                    title={tech.nameEn}
                    subtitle={tech.domain?.nameEn}
                    preview={<p className="line-clamp-1">{tech.descEn}</p>}
                  >
                    <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <p className="text-[--text-secondary] text-sm leading-relaxed">{tech.descEn}</p>
                        {tech.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {tech.tags.map((tag: string) => (
                              <span key={tag} className="px-2 py-0.5 rounded text-xs bg-[--surface-2] text-[--text-muted] border border-[--border]">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        {tech.energySavingsPct != null && (
                          <div className="glass rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-[--accent]">{tech.energySavingsPct}%</div>
                            <div className="text-xs text-[--text-muted]">Energy savings</div>
                          </div>
                        )}
                        {tech.carbonReductionPct != null && (
                          <div className="glass rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold text-[--success]">{tech.carbonReductionPct}%</div>
                            <div className="text-xs text-[--text-muted]">Carbon reduction</div>
                          </div>
                        )}
                        <Link
                          href={`/technologies/${tech.id}`}
                          className="inline-flex items-center justify-center py-2 rounded-lg border border-[--accent] text-[--accent] text-sm hover:bg-[--accent] hover:text-[--background] transition-colors"
                        >
                          Learn more
                        </Link>
                      </div>
                    </div>
                  </ExpandableCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal direction="up">
            <SplitHeading
              text="Ready to Transform Your Operations?"
              as="h2"
              className="text-3xl md:text-5xl font-extrabold mb-6"
              stagger={0.05}
            />
            <p className="text-[--text-secondary] text-lg mb-10 max-w-2xl mx-auto">
              Whether you&apos;re an industrial operator, municipality, investor, or research institution — we have a solution tailored for your context.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: 'Industrial Operator',     href: '/contact?type=technical_consulting' },
                { label: 'Municipality / Government',href: '/contact?type=government_relation' },
                { label: 'Investor',                href: '/contact?type=investment' },
                { label: 'Technology Partner',      href: '/contact?type=technology_partnership' },
              ].map((cta, i) => (
                <Reveal key={cta.href} direction="up" delay={i * 0.07}>
                  <MagneticButton>
                    <Link
                      href={cta.href}
                      className="inline-flex items-center justify-center px-5 py-3 h-11 rounded-lg border border-[--border] text-sm font-medium text-[--text-secondary] hover:border-[--accent] hover:text-[--accent] transition-colors"
                    >
                      {cta.label}
                    </Link>
                  </MagneticButton>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
