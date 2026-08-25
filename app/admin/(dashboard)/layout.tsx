'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Cpu, Lightbulb, FileText, Book, Users2,
  MessageSquare, LogOut, Zap, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/inquiries',    icon: MessageSquare,   label: 'Inquiries' },
  { href: '/admin/technologies', icon: Cpu,             label: 'Technologies' },
  { href: '/admin/solutions',    icon: Lightbulb,       label: 'Solutions' },
  { href: '/admin/case-studies', icon: FileText,        label: 'Case Studies' },
  { href: '/admin/knowledge',    icon: Book,            label: 'Knowledge' },
  { href: '/admin/users',        icon: Users2,          label: 'Users' },
]

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('swatek_token')
    const userData = localStorage.getItem('swatek_user')
    if (!token) { router.replace('/admin/login'); return }
    if (userData) setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('swatek_token')
    localStorage.removeItem('swatek_user')
    router.replace('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-[--background]">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-[--surface] border-r border-[--border] flex flex-col">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-[--border]">
          <Zap size={20} className="text-[--accent]" />
          <span className="font-bold text-gradient">SWATEK</span>
          <span className="text-xs text-[--text-muted] ml-auto">Admin</span>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto" aria-label="Admin navigation">
          <ul className="space-y-0.5 px-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                      active
                        ? 'bg-[--accent-glow] text-[--accent] font-medium'
                        : 'text-[--text-secondary] hover:bg-[--surface-2] hover:text-[--foreground]'
                    )}
                  >
                    <Icon size={16} />
                    {item.label}
                    {active && <ChevronRight size={12} className="ml-auto" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-[--border]">
          {user && (
            <div className="mb-3 px-1">
              <p className="text-sm font-medium text-[--foreground]">{user.name}</p>
              <p className="text-xs text-[--text-muted] capitalize">{user.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-[--text-muted] hover:text-[--danger] transition-colors w-full px-1"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-[--background]">
        {children}
      </main>
    </div>
  )
}
