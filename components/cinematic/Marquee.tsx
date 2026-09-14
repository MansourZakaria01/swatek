export function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items]

  return (
    <div className="relative overflow-hidden border-y border-[--border] bg-[--surface]/80">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[--background] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[--background] to-transparent z-10" />
      <div className="marquee-track py-4">
        {loop.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center">
            <span className="px-8 font-display text-sm md:text-base tracking-[0.28em] uppercase text-[--text-secondary] whitespace-nowrap">
              {item}
            </span>
            <span className="text-[--accent] opacity-60">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
