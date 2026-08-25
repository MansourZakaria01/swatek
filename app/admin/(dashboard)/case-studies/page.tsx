'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Trash2 } from 'lucide-react'

interface CaseStudy {
  id: string; slug: string; titleEn: string; sector: string; geography: string; published: boolean
}

export default function AdminCaseStudiesPage() {
  const [items, setItems] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const token = () => localStorage.getItem('swatek_token') ?? ''

  useEffect(() => {
    fetch('/api/case-studies', { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => r.json())
      .then((d) => { setItems(d.caseStudies ?? []); setLoading(false) })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this case study?')) return
    setDeleting(id)
    await fetch(`/api/case-studies/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } })
    setItems((prev) => prev.filter((c) => c.id !== id))
    setDeleting(null)
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Case Studies</h1>
      </div>
      {loading ? <p className="text-[--text-muted]">Loading...</p> : items.length === 0 ? (
        <p className="text-[--text-muted] py-12 text-center">No case studies yet.</p>
      ) : (
        <div className="glass rounded-xl border border-[--border] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[--border] text-[--text-muted] text-xs uppercase tracking-widest">
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Sector</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Geography</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((cs) => (
                <tr key={cs.id} className="border-b border-[--border] last:border-0 hover:bg-[--surface-2] transition-colors">
                  <td className="px-4 py-3 font-medium">{cs.titleEn}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-[--text-muted]">{cs.sector}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[--text-muted]">
                    <span className="flex items-center gap-1"><MapPin size={11} /> {cs.geography}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/case-studies/${cs.slug}`} target="_blank" className="text-xs text-[--text-muted] hover:text-[--accent] transition-colors">View</Link>
                      <button onClick={() => handleDelete(cs.id)} disabled={deleting === cs.id}
                        className="text-[--text-muted] hover:text-[--danger] transition-colors disabled:opacity-40">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
