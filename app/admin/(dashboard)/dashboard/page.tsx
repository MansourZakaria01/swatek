'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, Cpu, FileText, TrendingUp } from 'lucide-react'

interface Analytics {
  totalInquiries: number
  totalTechnologies: number
  totalCaseStudies: number
  inquiriesByStatus: { status: string; count: number }[]
  inquiriesByType: { type: string; count: number }[]
  recentInquiries: { id: string; fullName: string; organization?: string; inquiryType: string; status: string; createdAt: string }[]
}

const STATUS_COLORS: Record<string, string> = {
  new: 'text-[--accent]',
  in_review: 'text-[--warning]',
  assigned: 'text-purple-400',
  in_progress: 'text-blue-400',
  closed: 'text-[--text-muted]',
}

export default function DashboardPage() {
  const [data, setData] = useState<Analytics | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('swatek_token')
    fetch('/api/admin/analytics', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError('Failed to load analytics'))
  }, [])

  if (error) return <div className="p-8 text-[--danger]">{error}</div>
  if (!data) return <div className="p-8 text-[--text-muted]">Loading...</div>

  const statCards = [
    { icon: MessageSquare, label: 'Total Inquiries', value: data.totalInquiries, color: 'text-[--accent]' },
    { icon: Cpu,           label: 'Technologies',   value: data.totalTechnologies, color: 'text-purple-400' },
    { icon: FileText,      label: 'Case Studies',   value: data.totalCaseStudies, color: 'text-blue-400' },
    { icon: TrendingUp,    label: 'New Leads',      value: data.inquiriesByStatus.find((s) => s.status === 'new')?.count ?? 0, color: 'text-[--success]' },
  ]

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="glass rounded-xl p-5 border border-[--border]">
              <div className="flex items-center justify-between mb-3">
                <Icon size={18} className={s.color} />
                <span className="text-xs text-[--text-muted]">total</span>
              </div>
              <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-[--text-muted] mt-1">{s.label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inquiries by status */}
        <div className="glass rounded-xl border border-[--border] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[--text-muted] mb-5">Leads by Status</h2>
          <div className="space-y-3">
            {data.inquiriesByStatus.map((s) => (
              <div key={s.status} className="flex items-center justify-between">
                <span className={`text-sm capitalize ${STATUS_COLORS[s.status] ?? ''}`}>{s.status.replace('_', ' ')}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-1.5 bg-[--surface-2] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[--accent] rounded-full"
                      style={{ width: `${Math.round((s.count / data.totalInquiries) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-5 text-right">{s.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent inquiries */}
        <div className="glass rounded-xl border border-[--border] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[--text-muted] mb-5">Recent Inquiries</h2>
          <div className="space-y-3">
            {data.recentInquiries.map((inq) => (
              <div key={inq.id} className="flex items-start justify-between gap-3 py-2 border-b border-[--border] last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{inq.fullName}</p>
                  <p className="text-xs text-[--text-muted] truncate">{inq.organization ?? inq.inquiryType.replace('_', ' ')}</p>
                </div>
                <span className={`text-xs capitalize flex-shrink-0 ${STATUS_COLORS[inq.status] ?? ''}`}>{inq.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
