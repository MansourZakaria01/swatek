'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    <div className="relative min-h-screen flex items-center justify-center bg-[--background] px-4 overflow-hidden">
      <div className="film-grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(94,234,212,0.08), transparent 60%)' }} />
      <div className="cine-frame relative z-10 rounded-2xl p-8 w-full max-w-sm">
        <div className="flex items-center gap-3 font-display font-bold text-xl mb-8">
          <span className="relative flex h-8 w-8 items-center justify-center">
            <span className="absolute inset-0 rounded-sm border border-[--accent]/50 rotate-45" />
            <span className="h-1.5 w-1.5 rounded-full bg-[--accent]" />
          </span>
          <span className="text-gradient tracking-[0.14em]">SWATEK Admin</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium tracking-widest uppercase text-[--text-muted] mb-2" htmlFor="email">Email</label>
            <input
              id="email" type="email" required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="cine-input"
              placeholder="admin@swatek.tech"
            />
          </div>
          <div>
            <label className="block text-xs font-medium tracking-widest uppercase text-[--text-muted] mb-2" htmlFor="password">Password</label>
            <input
              id="password" type="password" required
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              className="cine-input"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-[--danger] text-center">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="btn-cinematic btn-primary w-full py-3 rounded-full font-semibold transition-colors disabled:opacity-50"
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
