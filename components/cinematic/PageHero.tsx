import { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { SplitHeading } from './SplitHeading'
import { SectionLabel } from './SectionLabel'
import { AmbientBackdrop } from './AmbientBackdrop'

interface PageHeroProps {
  index?: string
  kicker: string
  title: string
  description?: ReactNode
  children?: ReactNode
  compact?: boolean
}

export function PageHero({ index, kicker, title, description, children, compact }: PageHeroProps) {
  return (
    <section className={`relative overflow-hidden ${compact ? 'pt-28 pb-10 md:pt-32' : 'pt-32 pb-16 md:pt-40 md:pb-20'}`}>
      <AmbientBackdrop />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <Reveal direction="up">
          <SectionLabel index={index} label={kicker} />
        </Reveal>
        <SplitHeading
          text={title}
          as="h1"
          className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl"
          delay={0.08}
          stagger={0.05}
        />
        {description && (
          <Reveal direction="up" delay={0.28}>
            <p className="mt-6 text-base md:text-lg text-[--text-secondary] max-w-2xl leading-relaxed">
              {description}
            </p>
          </Reveal>
        )}
        {children && (
          <div className="mt-8 relative z-10">{children}</div>
        )}
      </div>
      <div className="letterbox-line mt-12 md:mt-16" />
    </section>
  )
}
