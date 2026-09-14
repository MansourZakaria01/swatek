import { ReactNode } from 'react'

interface AdminPageHeaderProps {
  kicker?: string
  title: string
  description?: string
  actions?: ReactNode
}

export function AdminPageHeader({
  kicker = 'Admin',
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <header className="admin-page-header">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="kicker mb-2">{kicker}</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-[--text-muted] mt-2 max-w-xl">{description}</p>
          )}
        </div>
        {actions}
      </div>
      <div className="letterbox-line" />
    </header>
  )
}
