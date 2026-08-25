'use client'

import { useState } from 'react'
import { Send, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const INQUIRY_TYPES = [
  { value: 'technology_partnership', label: 'Technology Partnership' },
  { value: 'project_development',   label: 'Project Development' },
  { value: 'investment',            label: 'Investment' },
  { value: 'government_relation',   label: 'Government / Municipal' },
  { value: 'technical_consulting',  label: 'Technical Consulting' },
  { value: 'other',                 label: 'Other' },
]

export function ContactForm() {
  const [form, setForm] = useState({
    fullName: '', organization: '', email: '', phone: '', inquiryType: '', message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.fullName.trim()) e.fullName = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.inquiryType) e.inquiryType = 'Please select an inquiry type'
    if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    setServerError('')
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Submission failed')
      setSuccess(true)
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="glass rounded-2xl p-10 text-center border border-[--success]">
        <CheckCircle size={48} className="mx-auto text-[--success] mb-4" />
        <h2 className="text-2xl font-bold mb-2">Message Received</h2>
        <p className="text-[--text-secondary]">Thank you for reaching out. We'll get back to you within 48 hours.</p>
      </div>
    )
  }

  const field = (name: keyof typeof form) => ({
    value: form[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [name]: e.target.value }))
      if (errors[name]) setErrors((er) => { const n = { ...er }; delete n[name]; return n })
    },
  })

  const inputClass = (name: string) => cn(
    'w-full bg-[--surface-2] border rounded-lg px-4 py-3 text-sm outline-none transition-colors focus:border-[--accent]',
    errors[name] ? 'border-[--danger]' : 'border-[--border]'
  )

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 md:p-10 space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[--text-secondary] mb-1.5" htmlFor="fullName">Full Name *</label>
          <input id="fullName" type="text" className={inputClass('fullName')} placeholder="Your name" {...field('fullName')} />
          {errors.fullName && <p className="text-xs text-[--danger] mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[--text-secondary] mb-1.5" htmlFor="organization">Organization</label>
          <input id="organization" type="text" className={inputClass('organization')} placeholder="Company / institution" {...field('organization')} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[--text-secondary] mb-1.5" htmlFor="email">Email *</label>
          <input id="email" type="email" className={inputClass('email')} placeholder="you@example.com" {...field('email')} />
          {errors.email && <p className="text-xs text-[--danger] mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[--text-secondary] mb-1.5" htmlFor="phone">Phone</label>
          <input id="phone" type="tel" className={inputClass('phone')} placeholder="+213 ..." {...field('phone')} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[--text-secondary] mb-1.5" htmlFor="inquiryType">Inquiry Type *</label>
        <select id="inquiryType" className={inputClass('inquiryType')} {...field('inquiryType')}>
          <option value="">Select a type...</option>
          {INQUIRY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        {errors.inquiryType && <p className="text-xs text-[--danger] mt-1">{errors.inquiryType}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-[--text-secondary] mb-1.5" htmlFor="message">Message *</label>
        <textarea
          id="message"
          rows={5}
          className={cn(inputClass('message'), 'resize-none')}
          placeholder="Describe your project, challenge, or question..."
          {...field('message')}
        />
        {errors.message && <p className="text-xs text-[--danger] mt-1">{errors.message}</p>}
      </div>

      {serverError && <p className="text-sm text-[--danger] text-center">{serverError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[--accent] text-[--background] font-semibold hover:bg-[--accent-dim] transition-colors disabled:opacity-50"
      >
        {submitting ? 'Sending...' : (<><Send size={16} /> Send Message</>)}
      </button>
    </form>
  )
}
