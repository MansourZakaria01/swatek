'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Domain { id: string; nameEn: string }

const inputClass = 'w-full bg-[--surface-2] border border-[--border] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[--accent] transition-colors'

export default function NewTechnologyPage() {
  const router = useRouter()
  const [domains, setDomains] = useState<Domain[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    slug: '', domainId: '',
    nameEn: '', nameFr: '', nameAr: '',
    descEn: '', descFr: '', descAr: '',
    benefitsEn: '', benefitsFr: '', benefitsAr: '',
    energySavingsPct: '', carbonReductionPct: '', roiPeriodMonths: '',
    tags: '', featured: false, published: true,
  })

  const token = () => localStorage.getItem('swatek_token') ?? ''

  useEffect(() => {
    fetch('/api/domains').then((r) => r.json()).then((d) => setDomains(d.domains ?? []))
  }, [])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const body = {
      ...form,
      benefitsEn: form.benefitsEn.split('\n').map((s) => s.trim()).filter(Boolean),
      benefitsFr: form.benefitsFr.split('\n').map((s) => s.trim()).filter(Boolean),
      benefitsAr: form.benefitsAr.split('\n').map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
      energySavingsPct: form.energySavingsPct ? parseFloat(form.energySavingsPct) : null,
      carbonReductionPct: form.carbonReductionPct ? parseFloat(form.carbonReductionPct) : null,
      roiPeriodMonths: form.roiPeriodMonths ? parseInt(form.roiPeriodMonths) : null,
    }
    const res = await fetch('/api/technologies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Save failed'); setSaving(false); return }
    router.push('/admin/technologies')
  }

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/technologies" className="inline-flex items-center gap-1 text-sm text-[--text-muted] hover:text-[--accent] transition-colors mb-6">
        <ArrowLeft size={14} /> Back
      </Link>
      <h1 className="text-2xl font-bold mb-8">Add Technology</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[--text-muted] mb-1">Slug *</label>
            <input className={inputClass} placeholder="smart-energy-management" value={form.slug} onChange={set('slug')} required />
          </div>
          <div>
            <label className="block text-xs text-[--text-muted] mb-1">Domain *</label>
            <select className={inputClass} value={form.domainId} onChange={set('domainId')} required>
              <option value="">Select domain...</option>
              {domains.map((d) => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
            </select>
          </div>
        </div>

        {(['En', 'Fr', 'Ar'] as const).map((lang) => (
          <div key={lang} className="glass rounded-xl p-5 border border-[--border] space-y-3">
            <h3 className="text-sm font-semibold text-[--text-muted] uppercase tracking-widest">{lang === 'En' ? 'English' : lang === 'Fr' ? 'French' : 'Arabic'}</h3>
            <div>
              <label className="block text-xs text-[--text-muted] mb-1">Name *</label>
              <input className={inputClass} value={(form as never)[`name${lang}`]} onChange={set(`name${lang}`)} required />
            </div>
            <div>
              <label className="block text-xs text-[--text-muted] mb-1">Description *</label>
              <textarea className={cn(inputClass, 'resize-none')} rows={3} value={(form as never)[`desc${lang}`]} onChange={set(`desc${lang}`)} required />
            </div>
            <div>
              <label className="block text-xs text-[--text-muted] mb-1">Benefits (one per line) *</label>
              <textarea className={cn(inputClass, 'resize-none')} rows={3} value={(form as never)[`benefits${lang}`]} onChange={set(`benefits${lang}`)} required />
            </div>
          </div>
        ))}

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-[--text-muted] mb-1">Energy Savings %</label>
            <input className={inputClass} type="number" min="0" max="100" step="0.1" value={form.energySavingsPct} onChange={set('energySavingsPct')} />
          </div>
          <div>
            <label className="block text-xs text-[--text-muted] mb-1">Carbon Reduction %</label>
            <input className={inputClass} type="number" min="0" max="100" step="0.1" value={form.carbonReductionPct} onChange={set('carbonReductionPct')} />
          </div>
          <div>
            <label className="block text-xs text-[--text-muted] mb-1">ROI Period (months)</label>
            <input className={inputClass} type="number" min="1" value={form.roiPeriodMonths} onChange={set('roiPeriodMonths')} />
          </div>
        </div>

        <div>
          <label className="block text-xs text-[--text-muted] mb-1">Tags (comma-separated)</label>
          <input className={inputClass} placeholder="energy, IoT, AI" value={form.tags} onChange={set('tags')} />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="accent-[--accent]" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} className="accent-[--accent]" />
            Published
          </label>
        </div>

        {error && <p className="text-sm text-[--danger]">{error}</p>}

        <button type="submit" disabled={saving}
          className="w-full py-3 rounded-lg bg-[--accent] text-[--background] font-semibold hover:bg-[--accent-dim] transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Technology'}
        </button>
      </form>
    </div>
  )
}
