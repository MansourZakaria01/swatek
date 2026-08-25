'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Trash2 } from 'lucide-react'

interface Doc { id: string; titleEn: string; category: string; language: string; fileType: string; fileUrl: string }

const CAT_LABELS: Record<string, string> = {
  whitepaper: 'White Paper', case_study: 'Case Study', technical_spec: 'Tech Spec', brochure: 'Brochure', report: 'Report',
}

export default function AdminKnowledgePage() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const token = () => localStorage.getItem('swatek_token') ?? ''

  useEffect(() => {
    fetch('/api/knowledge', { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => r.json())
      .then((d) => { setDocs(d.documents ?? []); setLoading(false) })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document?')) return
    setDeleting(id)
    await fetch(`/api/knowledge/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } })
    setDocs((prev) => prev.filter((d) => d.id !== id))
    setDeleting(null)
  }

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold mb-8">Knowledge Library</h1>
      {loading ? <p className="text-[--text-muted]">Loading...</p> : docs.length === 0 ? (
        <p className="text-[--text-muted] py-12 text-center">No documents yet.</p>
      ) : (
        <div className="glass rounded-xl border border-[--border] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[--border] text-[--text-muted] text-xs uppercase tracking-widest">
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Language</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr key={doc.id} className="border-b border-[--border] last:border-0 hover:bg-[--surface-2] transition-colors">
                  <td className="px-4 py-3 font-medium">{doc.titleEn}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-[--text-muted]">{CAT_LABELS[doc.category] ?? doc.category}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[--text-muted] uppercase">{doc.language}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[--text-muted] hover:text-[--accent] transition-colors">
                        <ExternalLink size={14} />
                      </a>
                      <button onClick={() => handleDelete(doc.id)} disabled={deleting === doc.id}
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
