export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass rounded-xl border border-[--border] overflow-hidden">
      <div className="border-b border-[--border] px-4 py-3 flex gap-4">
        <div className="h-3 w-24 shimmer rounded" />
        <div className="h-3 w-20 shimmer rounded hidden md:block" />
        <div className="h-3 w-16 shimmer rounded hidden lg:block" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-[--border] last:border-0 px-4 py-4 flex gap-4 items-center">
          <div className="h-4 flex-1 shimmer rounded" />
          <div className="h-4 w-24 shimmer rounded hidden md:block" />
          <div className="h-4 w-16 shimmer rounded hidden lg:block" />
        </div>
      ))}
    </div>
  )
}
