'use client'

import { useEffect, useState } from 'react'
import { MessageSquare, Cpu, FileText, TrendingUp } from 'lucide-react'
import { AnimatedCounter } from '@/components/cinematic/AnimatedCounter'
import { Reveal } from '@/components/cinematic/Reveal'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

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

function DashboardSkeleton() {
  return (
    <div className="p-8 max-w-6xl space-y-8">
      <div className="space-y-3">
        <div className="h-3 w-16 shimmer rounded" />
        <div className="h-8 w-48 shimmer rounded" />
        <div className="letterbox-line" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-xl p-5 border border-[--border] h-28 shimmer" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-xl border border-[--border] h-64 shimmer" />
        <div className="glass rounded-xl border border-[--border] h-64 shimmer" />
      </div>
    </div>
  )
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
  if (!data) return <DashboardSkeleton />

  const statCards = [
    { icon: MessageSquare, label: 'Total Inquiries', value: data.totalInquiries, color: 'text-[--accent]' },
    { icon: Cpu,           label: 'Technologies',   value: data.totalTechnologies, color: 'text-purple-400' },
    { icon: FileText,      label: 'Case Studies',   value: data.totalCaseStudies, color: 'text-blue-400' },
    { icon: TrendingUp,    label: 'New Leads',      value: data.inquiriesByStatus.find((s) => s.status === 'new')?.count ?? 0, color: 'text-[--success]' },
  ]

  return (
    <div className="p-8 max-w-6xl">
      <AdminPageHeader
        kicker="Overview"
        title="Dashboard"
        description="Live snapshot of inquiries, technologies, and case study activity."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {statCards.map((s, i) => {
          const Icon = s.icon
          return (
            <Reveal key={s.label} direction="up" delay={i * 0.06}>
              <div className="glass rounded-xl p-5 border border-[--border]">
                <div className="flex items-center justify-between mb-3">
                  <Icon size={18} className={s.color} />
                  <span className="text-xs text-[--text-muted]">total</span>
                </div>
                <div className={`text-3xl font-extrabold font-display tabular-nums ${s.color}`}>
                  <AnimatedCounter value={s.value} />
                </div>
                <div className="text-sm text-[--text-muted] mt-1">{s.label}</div>
              </div>
            </Reveal>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Reveal direction="up" delay={0.1}>
          <div className="glass rounded-xl border border-[--border] p-6 h-full">
            <h2 className="kicker text-[--text-muted] mb-5">Leads by Status</h2>
            <div className="space-y-3">
              {data.inquiriesByStatus.map((s) => (
                <div key={s.status} className="flex items-center justify-between">
                  <span className={`text-sm capitalize ${STATUS_COLORS[s.status] ?? ''}`}>{s.status.replace('_', ' ')}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-1.5 bg-[--surface-2] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[--accent] rounded-full transition-[width] duration-500"
                        style={{ width: `${Math.round((s.count / Math.max(data.totalInquiries, 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-5 text-right tabular-nums">{s.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.16}>
          <div className="glass rounded-xl border border-[--border] p-6 h-full">
            <h2 className="kicker text-[--text-muted] mb-5">Recent Inquiries</h2>
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
        </Reveal>
      </div>
    </div>
  )
}
