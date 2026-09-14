import { Reveal } from '@/components/cinematic/Reveal'
import { PageHero } from '@/components/cinematic/PageHero'
import { AmbientBackdrop } from '@/components/cinematic/AmbientBackdrop'
import { ContactForm } from './ContactForm'

export const metadata = { title: 'Contact Us' }

export default function ContactPage() {
  return (
    <>
      <PageHero
        index="06"
        kicker="Reach Out"
        title="Contact & Inquiries"
        description="Whether you're exploring a partnership, seeking a technical assessment, or representing a municipality — tell us about your project and we'll be in touch within 48 hours."
      />
      <section className="relative overflow-hidden">
        <AmbientBackdrop />
        <div className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
          <Reveal direction="up" delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  )
}
