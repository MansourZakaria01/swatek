export function SectionLabel({
  index,
  label,
  className = '',
}: {
  index?: string
  label: string
  className?: string
}) {
  return (
    <div className={`flex items-center gap-4 mb-5 ${className}`}>
      {index && (
        <span className="font-display text-[--accent] text-xs tracking-[0.32em] tabular-nums">{index}</span>
      )}
      <span className="h-px w-10 bg-gradient-to-r from-[--accent] to-transparent" />
      <span className="kicker text-[--accent]">{label}</span>
    </div>
  )
}
