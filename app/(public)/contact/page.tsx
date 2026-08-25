import { Reveal } from '@/components/cinematic/Reveal'
import { ContactForm } from './ContactForm'

export const metadata = { title: 'Contact Us' }

export default function ContactPage() {
  return (
    <div className="pt-28 pb-20 max-w-3xl mx-auto px-6">
      <Reveal direction="up">
        <span className="text-xs font-semibold uppercase tracking-widest text-[--accent]">Reach Out</span>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-3">Contact & Inquiries</h1>
        <p className="text-[--text-secondary] mb-10 leading-relaxed">
          Whether you're exploring a partnership, seeking a technical assessment, or representing a municipality — tell us about your project and we'll be in touch within 48 hours.
        </p>
      </Reveal>
      <Reveal direction="up" delay={0.15}>
        <ContactForm />
      </Reveal>
    </div>
  )
}
