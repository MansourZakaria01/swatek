export function CinematicDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`relative py-2 ${className}`} aria-hidden="true">
      <div className="letterbox-line" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rotate-45 bg-[--accent] shadow-[0_0_12px_var(--accent)]" />
    </div>
  )
}
