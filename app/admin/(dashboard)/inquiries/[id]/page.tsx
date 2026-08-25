'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'

const STATUSES = ['new', 'in_review', 'assigned', 'in_progress', 'closed'] as const
type Status = typeof STATUSES[number]

const STATUS_COLORS: Record<Status, string> = {
  new: 'bg-cyan-900 text-cyan-300',
  in_review: 'bg-yellow-900 text-yellow-300',
  assigned: 'bg-purple-900 text-purple-300',
  in_progress: 'bg-blue-900 text-blue-300',
  closed: 'bg-gray-800 text-gray-400',
}

interface Note { id: string; content: string; createdAt: string; author: { name: string } }
interface Inquiry {
  id: string; fullName: string; organization?: string; email: string; phone?: string;
  inquiryType: string; message: string; status: Status; createdAt: string;
  assignedTo?: { id: string; name: string; email: string }
  notes: Note[]
}

export default function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [inquiry, setInquiry] = useState<Inquiry | null>(null)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [addingNote, setAddingNote] = useState(false)

  const token = () => typeof window !== 'undefined' ? localStorage.getItem('swatek_token') ?? '' : ''

  useEffect(() => {
    fetch(`/api/inquiries/${id}`, { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => r.json())
      .then((d) => setInquiry(d.inquiry))
  }, [id])

  const updateStatus = async (status: Status) => {
    setSaving(true)
    const res = await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ status }),
    })
    const data = await res.json()
    if (res.ok) setInquiry((prev) => prev ? { ...prev, status: data.inquiry.status } : prev)
    setSaving(false)
  }

  const submitNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!note.trim()) return
    setAddingNote(true)
    const res = await fetch(`/api/inquiries/${id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ content: note }),
    })
    const data = await res.json()
    if (res.ok) {
      setInquiry((prev) => prev ? { ...prev, notes: [...prev.notes, data.note] } : prev)
      setNote('')
    }
    setAddingNote(false)
  }

  if (!inquiry) return <div className="p-8 text-[--text-muted]">Loading...</div>

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/inquiries" className="inline-flex items-center gap-1 text-sm text-[--text-muted] hover:text-[--accent] transition-colors mb-6">
        <ArrowLeft size={14} /> Back to Inquiries
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-xl p-6 border border-[--border]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl font-bold">{inquiry.fullName}</h1>
                {inquiry.organization && <p className="text-sm text-[--text-muted]">{inquiry.organization}</p>}
                <p className="text-sm text-[--text-muted]">{inquiry.email}{inquiry.phone && ` · ${inquiry.phone}`}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs capitalize flex-shrink-0 ${STATUS_COLORS[inquiry.status]}`}>
                {inquiry.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-[--text-muted] uppercase tracking-widest mb-2">
              {inquiry.inquiryType.replace(/_/g, ' ')} · {new Date(inquiry.createdAt).toLocaleString()}
            </p>
            <div className="border-t border-[--border] pt-4 mt-4">
              <p className="text-sm text-[--text-secondary] leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
            </div>
          </div>

          {/* Notes */}
          <div className="glass rounded-xl p-6 border border-[--border]">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[--text-muted] mb-4">Internal Notes</h2>
            {inquiry.notes.length === 0 ? (
              <p className="text-sm text-[--text-muted] mb-4">No notes yet.</p>
            ) : (
              <div className="space-y-3 mb-4">
                {inquiry.notes.map((n) => (
                  <div key={n.id} className="bg-[--surface-2] rounded-lg p-3">
                    <p className="text-sm text-[--text-secondary]">{n.content}</p>
                    <p className="text-xs text-[--text-muted] mt-1">{n.author.name} · {new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={submitNote} className="flex gap-2">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add an internal note..."
                className="flex-1 bg-[--surface-2] border border-[--border] rounded-lg px-3 py-2 text-sm outline-none focus:border-[--accent] transition-colors"
              />
              <button type="submit" disabled={addingNote || !note.trim()}
                className="px-3 py-2 rounded-lg bg-[--accent] text-[--background] hover:bg-[--accent-dim] transition-colors disabled:opacity-50">
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="glass rounded-xl p-5 border border-[--border]">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[--text-muted] mb-4">Update Status</h2>
            <div className="space-y-2">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => updateStatus(s)} disabled={saving || inquiry.status === s}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize transition-colors ${inquiry.status === s ? STATUS_COLORS[s] + ' font-medium' : 'text-[--text-muted] hover:bg-[--surface-2]'}`}>
                  {s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {inquiry.assignedTo && (
            <div className="glass rounded-xl p-5 border border-[--border]">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[--text-muted] mb-2">Assigned To</h2>
              <p className="text-sm font-medium">{inquiry.assignedTo.name}</p>
              <p className="text-xs text-[--text-muted]">{inquiry.assignedTo.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
