'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'

interface Solution { id: string; slug: string; titleEn: string; sector: string; _count: { caseStudies: number } }

export default function AdminSolutionsPage() {
  const [items, setItems] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const token = () => localStorage.getItem('swatek_token') ?? ''

  useEffect(() => {
    fetch('/api/solutions', { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => r.json())
      .then((d) => { setItems(d.solutions ?? []); setLoading(false) })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this solution?')) return
    setDeleting(id)
    await fetch(`/api/solutions/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } })
    setItems((prev) => prev.filter((s) => s.id !== id))
    setDeleting(null)
  }

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-8">Solutions</h1>
      {loading ? <p className="text-[--text-muted]">Loading...</p> : items.length === 0 ? (
        <p className="text-[--text-muted] py-12 text-center">No solutions yet.</p>
      ) : (
        <div className="glass rounded-xl border border-[--border] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[--border] text-[--text-muted] text-xs uppercase tracking-widest">
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Sector</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Case Studies</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((sol) => (
                <tr key={sol.id} className="border-b border-[--border] last:border-0 hover:bg-[--surface-2] transition-colors">
                  <td className="px-4 py-3 font-medium">{sol.titleEn}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-[--text-muted]">{sol.sector}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[--text-muted]">{sol._count?.caseStudies ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/solutions/${sol.slug}`} target="_blank" className="text-xs text-[--text-muted] hover:text-[--accent] transition-colors">View</Link>
                      <button onClick={() => handleDelete(sol.id)} disabled={deleting === sol.id}
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
