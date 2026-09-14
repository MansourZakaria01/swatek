'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Trash2 } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton'

interface Technology {
  id: string; slug: string; nameEn: string; domain: { nameEn: string };
  energySavingsPct: number | null; featured: boolean; published: boolean
}

export default function AdminTechnologiesPage() {
  const [techs, setTechs] = useState<Technology[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const token = () => localStorage.getItem('swatek_token') ?? ''

  const load = () => {
    fetch('/api/technologies', { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => r.json())
      .then((d) => { setTechs(d.technologies ?? []); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this technology? This cannot be undone.')) return
    setDeleting(id)
    await fetch(`/api/technologies/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } })
    setTechs((prev) => prev.filter((t) => t.id !== id))
    setDeleting(null)
  }

  return (
    <div className="p-8 max-w-5xl">
      <AdminPageHeader
        kicker="Catalog"
        title="Technologies"
        description="Manage the public technology portfolio and featured listings."
        actions={
          <Link href="/admin/technologies/new"
            className="btn-cinematic btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold">
            <Plus size={15} /> Add Technology
          </Link>
        }
      />

      {loading ? (
        <AdminTableSkeleton />
      ) : techs.length === 0 ? (
        <p className="text-[--text-muted] py-12 text-center">No technologies yet.</p>
      ) : (
        <div className="glass rounded-xl border border-[--border] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[--border] text-[--text-muted] text-xs uppercase tracking-widest">
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Domain</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Energy Saving</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {techs.map((t) => (
                <tr key={t.id} className="border-b border-[--border] last:border-0 hover:bg-[--surface-2] transition-colors">
                  <td className="px-4 py-3 font-medium">{t.nameEn}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-[--text-muted]">{t.domain?.nameEn}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[--accent]">
                    {t.energySavingsPct != null ? `${t.energySavingsPct}%` : '—'}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex gap-1.5">
                      {t.featured && <span className="px-2 py-0.5 rounded text-xs bg-yellow-900 text-yellow-300">Featured</span>}
                      <span className={`px-2 py-0.5 rounded text-xs ${t.published ? 'bg-green-900 text-green-300' : 'bg-gray-800 text-gray-400'}`}>
                        {t.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/technologies/${t.slug}`} target="_blank"
                        className="text-xs text-[--text-muted] hover:text-[--accent] transition-colors">View</Link>
                      <button onClick={() => handleDelete(t.id)} disabled={deleting === t.id}
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
