'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Eye, EyeOff, Copy, Check, RefreshCw, Shield, Pencil, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminTableSkeleton } from '@/components/admin/AdminTableSkeleton'

interface User { id: string; name: string; email: string; role: string; createdAt: string }

const ROLE_COLORS: Record<string, string> = {
  admin:  'bg-red-900/60 text-red-300 border border-red-800',
  editor: 'bg-blue-900/60 text-blue-300 border border-blue-800',
  viewer: 'bg-gray-800/60 text-gray-400 border border-gray-700',
}

const ROLE_DESCRIPTIONS: Record<string, string> = {
  admin:  'Full access — manage users, content, and all settings',
  editor: 'Create and edit content, manage inquiries',
  viewer: 'Read-only access to assigned inquiries',
}

// Password strength scorer
function scorePassword(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score, label: 'Too weak', color: 'bg-red-500' }
  if (score === 2) return { score, label: 'Weak', color: 'bg-orange-500' }
  if (score === 3) return { score, label: 'Fair', color: 'bg-yellow-500' }
  if (score === 4) return { score, label: 'Strong', color: 'bg-blue-500' }
  return { score, label: 'Very strong', color: 'bg-green-500' }
}

function generatePassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lower = 'abcdefghjkmnpqrstuvwxyz'
  const digits = '23456789'
  const special = '@#!%&*'
  const all = upper + lower + digits + special
  let pw = upper[Math.floor(Math.random() * upper.length)]
    + lower[Math.floor(Math.random() * lower.length)]
    + digits[Math.floor(Math.random() * digits.length)]
    + special[Math.floor(Math.random() * special.length)]
  for (let i = 0; i < 8; i++) pw += all[Math.floor(Math.random() * all.length)]
  return pw.split('').sort(() => Math.random() - 0.5).join('')
}

const inputClass = 'cine-input'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [createdUser, setCreatedUser] = useState<{ name: string; email: string; password: string; role: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'viewer' })

  const token = () => localStorage.getItem('swatek_token') ?? ''
  const strength = scorePassword(form.password)

  const load = useCallback(() => {
    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => r.json())
      .then((d) => { setUsers(d.users ?? []); setLoading(false) })
  }, [])

  useEffect(() => { load() }, [load])

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', role: 'viewer' })
    setError('')
    setShowPw(false)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'Failed'); setSaving(false); return }
    setUsers((prev) => [data.user, ...prev])
    setCreatedUser({ name: form.name, email: form.email, password: form.password, role: form.role })
    setShowForm(false)
    resetForm()
    setSaving(false)
  }

  const copyCredentials = async () => {
    if (!createdUser) return
    const text = `SWATEK Admin Access\n\nName: ${createdUser.name}\nEmail: ${createdUser.email}\nPassword: ${createdUser.password}\nRole: ${createdUser.role}\n\nLogin at: ${window.location.origin}/admin/login`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="p-8 max-w-4xl">
      <AdminPageHeader
        kicker="Access"
        title="Users"
        description="Manage who has access to the admin panel."
        actions={
          <button
            onClick={() => { setShowForm((s) => !s); setCreatedUser(null); resetForm() }}
            className="btn-cinematic btn-primary inline-flex items-center gap-2 px-4 py-2 h-9 rounded-full text-sm font-semibold"
          >
            <Plus size={15} /> Add User
          </button>
        }
      />

      {/* Success banner — copy credentials */}
      {createdUser && (
        <div className="glass rounded-xl p-5 border border-[--success] mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[--success] mb-1">User created successfully</p>
              <p className="text-xs text-[--text-muted] mb-3">
                Share these credentials with <strong className="text-[--foreground]">{createdUser.name}</strong>. The password won't be shown again.
              </p>
              <div className="font-mono text-xs bg-[--surface-2] rounded-lg px-4 py-3 space-y-1 border border-[--border]">
                <p><span className="text-[--text-muted]">Email:</span> <span className="text-[--foreground]">{createdUser.email}</span></p>
                <p><span className="text-[--text-muted]">Password:</span> <span className="text-[--foreground]">{createdUser.password}</span></p>
                <p><span className="text-[--text-muted]">Role:</span> <span className="text-[--foreground] capitalize">{createdUser.role}</span></p>
              </div>
            </div>
            <button
              onClick={() => setCreatedUser(null)}
              className="text-[--text-muted] hover:text-[--foreground] flex-shrink-0"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
          <button
            onClick={copyCredentials}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 h-9 rounded-lg border border-[--success] text-[--success] text-sm font-medium hover:bg-[--success]/10 transition-colors"
          >
            {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Credentials</>}
          </button>
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="glass rounded-xl p-6 border border-[--border] mb-8 space-y-5">
          <h2 className="text-sm font-semibold text-[--text-muted] uppercase tracking-widest">New User</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[--text-muted] mb-1.5">Full Name *</label>
              <input
                required className={inputClass} placeholder="Jane Smith"
                value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs text-[--text-muted] mb-1.5">Email *</label>
              <input
                required type="email" className={inputClass} placeholder="jane@swatek.tech"
                value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
          </div>

          {/* Password with strength + generate */}
          <div>
            <label className="block text-xs text-[--text-muted] mb-1.5">Password *</label>
            <div className="relative">
              <input
                required
                type={showPw ? 'text' : 'password'}
                className={cn(inputClass, 'pr-20')}
                placeholder="Min. 8 chars, 1 uppercase, 1 number"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, password: generatePassword() }))}
                  title="Generate password"
                  className="p-1.5 text-[--text-muted] hover:text-[--accent] transition-colors"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  title={showPw ? 'Hide password' : 'Show password'}
                  className="p-1.5 text-[--text-muted] hover:text-[--accent] transition-colors"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Strength meter */}
            {form.password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1 flex-1 rounded-full transition-all duration-300',
                        i <= strength.score ? strength.color : 'bg-[--border]'
                      )}
                    />
                  ))}
                </div>
                <p className="text-xs text-[--text-muted]">
                  Strength: <span className={cn(
                    strength.score <= 1 ? 'text-red-400' :
                    strength.score === 2 ? 'text-orange-400' :
                    strength.score === 3 ? 'text-yellow-400' :
                    strength.score === 4 ? 'text-blue-400' : 'text-green-400'
                  )}>{strength.label}</span>
                </p>
              </div>
            )}
          </div>

          {/* Role with descriptions */}
          <div>
            <label className="block text-xs text-[--text-muted] mb-1.5">Role *</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['viewer', 'editor', 'admin'] as const).map((r) => (
                <label
                  key={r}
                  className={cn(
                    'flex flex-col gap-1 p-3 rounded-lg border cursor-pointer transition-colors',
                    form.role === r
                      ? 'border-[--accent] bg-[--accent-glow]'
                      : 'border-[--border] hover:border-[--accent-dim]'
                  )}
                >
                  <input
                    type="radio" name="role" value={r} checked={form.role === r}
                    onChange={() => setForm((f) => ({ ...f, role: r }))}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-2">
                    <Shield size={12} className={form.role === r ? 'text-[--accent]' : 'text-[--text-muted]'} />
                    <span className={cn('text-xs font-semibold capitalize', form.role === r ? 'text-[--accent]' : 'text-[--foreground]')}>
                      {r}
                    </span>
                  </div>
                  <p className="text-xs text-[--text-muted] leading-snug">{ROLE_DESCRIPTIONS[r]}</p>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-[--danger]">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit" disabled={saving || strength.score < 2}
              className="btn-cinematic btn-primary inline-flex items-center justify-center gap-2 px-5 py-2 h-9 rounded-full text-sm font-semibold disabled:opacity-40"
            >
              {saving ? 'Creating...' : 'Create User'}
            </button>
            <button
              type="button" onClick={() => { setShowForm(false); resetForm() }}
              className="inline-flex items-center justify-center px-4 py-2 h-9 rounded-lg border border-[--border] text-sm text-[--text-muted] hover:border-[--accent] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Users table */}
      {loading ? (
        <AdminTableSkeleton />
      ) : users.length === 0 ? (
        <p className="text-[--text-muted] py-12 text-center">No users yet.</p>
      ) : (
        <div className="glass rounded-xl border border-[--border] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[--border] text-[--text-muted] text-xs uppercase tracking-widest">
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-[--border] last:border-0 hover:bg-[--surface-2] transition-colors">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-[--text-muted] text-xs">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded text-xs capitalize', ROLE_COLORS[u.role] ?? '')}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-[--text-muted]">
                    {new Date(u.createdAt).toLocaleDateString()}
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
