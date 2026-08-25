'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const STATUSES = ['all', 'new', 'in_review', 'assigned', 'in_progress', 'closed']
const STATUS_COLORS: Record<string, string> = {
  new: 'bg-cyan-900 text-cyan-300',
  in_review: 'bg-yellow-900 text-yellow-300',
  assigned: 'bg-purple-900 text-purple-300',
  in_progress: 'bg-blue-900 text-blue-300',
  closed: 'bg-gray-800 text-gray-400',
}

interface Inquiry {
  id: string; fullName: string; organization?: string; email: string;
  inquiryType: string; status: string; createdAt: string;
  assignedTo?: { name: string }
  _count: { notes: number }
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('swatek_token')
    const params = statusFilter !== 'all' ? `?status=${statusFilter}` : ''
    fetch(`/api/inquiries${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setInquiries(d.inquiries ?? []); setLoading(false) })
  }, [statusFilter])

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Inquiries / Leads</h1>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-xs capitalize border transition-colors ${statusFilter === s ? 'bg-[--accent] text-[--background] border-[--accent]' : 'border-[--border] text-[--text-muted] hover:border-[--accent]'}`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[--text-muted]">Loading...</p>
      ) : inquiries.length === 0 ? (
        <p className="text-[--text-muted] py-12 text-center">No inquiries found.</p>
      ) : (
        <div className="glass rounded-xl border border-[--border] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[--border] text-[--text-muted] text-xs uppercase tracking-widest">
                <th className="text-left px-4 py-3">Name / Org</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Assigned</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr key={inq.id} className="border-b border-[--border] last:border-0 hover:bg-[--surface-2] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{inq.fullName}</p>
                    <p className="text-xs text-[--text-muted]">{inq.organization ?? inq.email}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-[--text-secondary] capitalize">
                    {inq.inquiryType.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs capitalize ${STATUS_COLORS[inq.status] ?? ''}`}>
                      {inq.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[--text-muted] text-xs">
                    {inq.assignedTo?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-[--text-muted] text-xs">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/inquiries/${inq.id}`} className="text-xs text-[--accent] hover:underline">
                      View
                    </Link>
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
