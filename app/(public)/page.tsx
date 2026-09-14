export const dynamic = 'force-dynamic'

import { HeroSection }     from '@/components/cinematic/HeroSection'
import { Reveal }          from '@/components/cinematic/Reveal'
import { AnimatedCounter } from '@/components/cinematic/AnimatedCounter'
import { ExpandableCard }  from '@/components/cinematic/ExpandableCard'
import { SplitHeading }    from '@/components/cinematic/SplitHeading'
import { MagneticButton }  from '@/components/cinematic/MagneticButton'
import { GlowCard }        from '@/components/cinematic/GlowCard'
import { SectionLabel }    from '@/components/cinematic/SectionLabel'
import { Marquee }         from '@/components/cinematic/Marquee'
import { CinematicDivider } from '@/components/cinematic/CinematicDivider'
import { AmbientBackdrop } from '@/components/cinematic/AmbientBackdrop'
import { ParallaxSection } from '@/components/cinematic/ParallaxSection'
import Link from 'next/link'
import { ArrowRight, Brain, Factory, Recycle, Zap, Sprout, Building2 } from 'lucide-react'
import { fetchPublicJson } from '@/lib/public-fetch'

async function getMetrics() {
  const data = await fetchPublicJson<{ metrics: unknown[] }>('/api/metrics')
  return data?.metrics ?? []
}

async function getFeaturedTechnologies() {
  const data = await fetchPublicJson<{ technologies: unknown[] }>('/api/technologies?featured=true')
  return data?.technologies ?? []
}

const domainCards = [
  { icon: Brain,     label: 'Artificial Intelligence', slug: 'artificial-intelligence', desc: 'Predictive analytics, computer vision, and intelligent automation.' },
  { icon: Factory,   label: 'Industry 4.0',            slug: 'industry-40',            desc: 'Connected factories, digital twins, and IIoT ecosystems.' },
  { icon: Recycle,   label: 'Circular Economy',        slug: 'circular-economy',       desc: 'Waste valorization and zero-waste production cycles.' },
  { icon: Zap,       label: 'Energy & Hydrogen',       slug: 'energy-hydrogen',        desc: 'Clean energy, smart grids, and green hydrogen production.' },
  { icon: Sprout,    label: 'Agriculture 4.0',         slug: 'agriculture-40',         desc: 'Precision farming, smart aquaculture, and yield optimization.' },
  { icon: Building2, label: 'Smart Infrastructure',    slug: 'smart-infrastructure',   desc: 'Smart buildings, BMS, HVAC optimization, and urban IoT.' },
]

const marqueeItems = [
  'Industry 4.0', 'Artificial Intelligence', 'Green Hydrogen', 'Circular Economy',
  'Smart Agriculture', 'Digital Twins', 'IIoT', 'Clean Energy', 'Smart Cities', 'Zero Waste',
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
      <HeroSection>
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-3 mb-8">
              <span className="h-px w-10 bg-[--accent]" />
              <span className="kicker">Industry 4.0 · AI · Sustainability</span>
            </div>
          </Reveal>

          <SplitHeading
            text="Intelligent Solutions for a Sustainable Industry"
            as="h1"
            className="font-display text-5xl md:text-7xl lg:text-[5.4rem] font-extrabold leading-[0.98] tracking-tight mb-8 max-w-5xl"
            delay={0.08}
            stagger={0.06}
          />

          <Reveal direction="up" delay={0.38}>
            <p className="text-lg md:text-xl text-[--text-secondary] max-w-2xl mb-12 leading-relaxed font-light">
              SWATEK delivers AI, IoT, and clean energy technologies that reduce costs, cut emissions, and future-proof industrial and agricultural operations across North Africa and beyond.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.52}>
            <div className="flex flex-wrap items-center gap-4">
              <MagneticButton>
                <Link
                  href="/technologies"
                  className="btn-cinematic btn-primary pulse-ring inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold transition-colors"
                >
                  Explore Technologies <ArrowRight size={18} />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="/solutions"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-[--border] text-[--foreground] font-medium hover:border-[--accent] hover:text-[--accent] transition-colors backdrop-blur-sm"
                >
                  Our Solutions
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-[--border] text-[--foreground] font-medium hover:border-[--accent-warm] hover:text-[--accent-warm] transition-colors backdrop-blur-sm"
                >
                  Contact Us
                </Link>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </HeroSection>

      <Marquee items={marqueeItems} />

      <section className="relative py-24 overflow-hidden" aria-label="Impact statistics">
        <div className="absolute inset-0 bg-[--surface]" />
        <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse at center, rgba(240,180,90,0.08), transparent 70%)' }} />
        <ParallaxSection speed={0.2} className="relative">
          <div className="relative max-w-7xl mx-auto px-6">
            <Reveal direction="up">
              <SectionLabel index="01" label="Measured Impact" />
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-[--border] rounded-2xl overflow-hidden cine-frame">
              {displayMetrics.slice(0, 4).map((m: { labelEn: string; value: number; unit: string }, i: number) => (
                <Reveal key={i} direction="up" delay={i * 0.08}>
                  <div className={`text-center px-6 py-10 md:py-14 group border-[--border] ${i < 3 ? 'lg:border-r' : ''} ${i % 2 === 0 ? 'max-lg:border-r' : ''} ${i < 2 ? 'max-lg:border-b' : ''}`}>
                    <p className="kicker text-[--text-muted] mb-5">0{i + 1}</p>
                    <div className="font-display text-4xl md:text-5xl font-extrabold text-gradient tabular-nums transition-transform duration-500 group-hover:scale-105">
                      <AnimatedCounter value={m.value} suffix={m.unit.includes('%') ? '%' : '+'} />
                    </div>
                    <p className="text-sm text-[--foreground] mt-3 tracking-wide">{m.labelEn}</p>
                    <p className="text-xs text-[--text-muted] mt-1 tracking-widest uppercase">{m.unit}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </ParallaxSection>
      </section>

      <CinematicDivider className="max-w-7xl mx-auto px-6" />

      <section className="relative py-28 overflow-hidden">
        <AmbientBackdrop />
        <ParallaxSection speed={0.15} className="relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <Reveal direction="up">
              <div className="mb-14 max-w-2xl">
                <SectionLabel index="02" label="Technology Domains" />
                <SplitHeading
                  text="Six Pillars of Innovation"
                  as="h2"
                  className="font-display text-3xl md:text-5xl font-bold"
                  stagger={0.06}
                />
                <p className="text-[--text-secondary] mt-5 max-w-xl leading-relaxed">
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
                      <GlowCard className="p-7 h-full cursor-pointer card-hover">
                        <div className="flex items-start justify-between mb-8">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-[--border]" style={{ background: 'var(--accent-glow)' }}>
                            <Icon size={20} className="text-[--accent]" />
                          </div>
                          <span className="font-display text-xs tracking-[0.28em] text-[--text-muted]">0{i + 1}</span>
                        </div>
                        <h3 className="font-display font-semibold text-xl mb-2 group-hover:text-[--accent] transition-colors">{domain.label}</h3>
                        <p className="text-sm text-[--text-muted] leading-relaxed">{domain.desc}</p>
                        <span className="inline-flex items-center gap-1.5 text-xs text-[--accent] mt-6 font-medium tracking-wide">
                          Explore <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                        </span>
                      </GlowCard>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </ParallaxSection>
      </section>

      {technologies.length > 0 && (
        <section className="relative py-28 bg-[--surface] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(94,234,212,0.07), transparent 50%)' }} />
          <div className="relative max-w-7xl mx-auto px-6">
            <Reveal direction="up">
              <div className="flex items-end justify-between mb-14">
                <div>
                  <SectionLabel index="03" label="Featured" />
                  <SplitHeading text="Key Technologies" as="h2" className="font-display text-3xl md:text-5xl font-bold" stagger={0.06} />
                </div>
                <MagneticButton>
                  <Link href="/technologies" className="text-sm text-[--accent] hover:text-[--accent-warm] hidden md:flex items-center gap-1.5 tracking-wide">
                    View all <ArrowRight size={14} />
                  </Link>
                </MagneticButton>
              </div>
            </Reveal>

            <div className="space-y-4">
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
                    <div className="pt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <p className="text-[--text-secondary] text-sm leading-relaxed">{tech.descEn}</p>
                        {tech.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {tech.tags.map((tag: string) => (
                              <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs bg-[--surface-2] text-[--text-muted] border border-[--border] tracking-wide">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        {tech.energySavingsPct != null && (
                          <div className="cine-frame rounded-xl p-4 text-center">
                            <div className="font-display text-2xl font-bold text-[--accent]">{tech.energySavingsPct}%</div>
                            <div className="text-xs text-[--text-muted] tracking-widest uppercase mt-1">Energy savings</div>
                          </div>
                        )}
                        {tech.carbonReductionPct != null && (
                          <div className="cine-frame rounded-xl p-4 text-center">
                            <div className="font-display text-2xl font-bold text-[--success]">{tech.carbonReductionPct}%</div>
                            <div className="text-xs text-[--text-muted] tracking-widest uppercase mt-1">Carbon reduction</div>
                          </div>
                        )}
                        <MagneticButton>
                          <Link
                            href={`/technologies/${tech.id}`}
                            className="btn-cinematic inline-flex items-center justify-center py-2.5 rounded-full border border-[--accent] text-[--accent] text-sm hover:bg-[--accent] hover:text-[--background] transition-colors"
                          >
                            Learn more
                          </Link>
                        </MagneticButton>
                      </div>
                    </div>
                  </ExpandableCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CinematicDivider className="max-w-7xl mx-auto px-6" />

      <section className="relative py-28 overflow-hidden">
        <AmbientBackdrop />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <Reveal direction="up">
            <SectionLabel index="04" label="Begin" className="justify-center" />
            <SplitHeading
              text="Ready to Transform Your Operations?"
              as="h2"
              className="font-display text-3xl md:text-6xl font-extrabold mb-7"
              stagger={0.05}
            />
            <p className="text-[--text-secondary] text-lg mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Whether you&apos;re an industrial operator, municipality, investor, or research institution — we have a solution tailored for your context.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
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
                      className="inline-flex items-center justify-center px-6 py-3 h-12 rounded-full border border-[--border] text-sm font-medium text-[--text-secondary] hover:border-[--accent] hover:text-[--accent] hover:shadow-[0_0_24px_var(--accent-glow)] transition-all"
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
