'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Login failed')
      localStorage.setItem('swatek_token', data.token)
      localStorage.setItem('swatek_user', JSON.stringify(data.user))
      router.push('/admin/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[--background] px-4">
      <div className="glass rounded-2xl p-8 w-full max-w-sm border border-[--border]">
        <div className="flex items-center gap-2 font-bold text-xl mb-8">
          <Zap size={22} className="text-[--accent]" />
          <span className="text-gradient">SWATEK Admin</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[--text-secondary] mb-1.5" htmlFor="email">Email</label>
            <input
              id="email" type="email" required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full bg-[--surface-2] border border-[--border] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[--accent] transition-colors"
              placeholder="admin@swatek.tech"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[--text-secondary] mb-1.5" htmlFor="password">Password</label>
            <input
              id="password" type="password" required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="w-full bg-[--surface-2] border border-[--border] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[--accent] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-[--danger] text-center">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[--accent] text-[--background] font-semibold hover:bg-[--accent-dim] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-[--text-muted] text-center mt-6">
          Default: admin@swatek.tech / Admin@123
        </p>
      </div>
    </div>
  )
}
