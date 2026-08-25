export const dynamic = 'force-dynamic'
import { Reveal } from '@/components/cinematic/Reveal'
import Link from 'next/link'
import { ExternalLink, FileText, FileSpreadsheet, File } from 'lucide-react'

async function getDocuments(category?: string, language?: string) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (language) params.set('language', language)
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/knowledge?${params}`, { next: { revalidate: 60 } })
  if (!res.ok) return []
  return (await res.json()).documents ?? []
}

export const metadata = { title: 'Knowledge Library' }

const CATEGORIES = ['whitepaper', 'case_study', 'technical_spec', 'brochure', 'report']
const LANGUAGES = [{ value: 'en', label: 'English' }, { value: 'fr', label: 'Français' }, { value: 'ar', label: 'العربية' }]

const FILE_ICONS: Record<string, React.ElementType> = {
  pdf: FileText,
  xlsx: FileSpreadsheet,
  docx: File,
}

const CATEGORY_LABELS: Record<string, string> = {
  whitepaper: 'White Paper',
  case_study: 'Case Study',
  technical_spec: 'Technical Spec',
  brochure: 'Brochure',
  report: 'Report',
}

export default async function KnowledgePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; language?: string }>
}) {
  const { category, language } = await searchParams
  const documents = await getDocuments(category, language)

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <Reveal direction="up">
        <span className="text-xs font-semibold uppercase tracking-widest text-[--accent]">Resources</span>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-2 mb-3">Knowledge Library</h1>
        <p className="text-[--text-secondary] max-w-xl mb-10">
          White papers, technical specs, implementation guides, and reports — all downloadable.
        </p>
      </Reveal>

      {/* Filters */}
      <Reveal direction="up" delay={0.1}>
        <div className="flex flex-wrap gap-6 mb-10">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-[--text-muted] uppercase tracking-widest">Type:</span>
            <Link href={`/knowledge${language ? `?language=${language}` : ''}`}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${!category ? 'bg-[--accent] text-[--background] border-[--accent]' : 'border-[--border] text-[--text-muted] hover:border-[--accent]'}`}>All</Link>
            {CATEGORIES.map((c) => (
              <Link key={c} href={`/knowledge?category=${c}${language ? `&language=${language}` : ''}`}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${category === c ? 'bg-[--accent] text-[--background] border-[--accent]' : 'border-[--border] text-[--text-muted] hover:border-[--accent]'}`}>
                {CATEGORY_LABELS[c]}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-[--text-muted] uppercase tracking-widest">Lang:</span>
            {LANGUAGES.map((l) => (
              <Link key={l.value} href={`/knowledge?language=${l.value}${category ? `&category=${category}` : ''}`}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${language === l.value ? 'bg-[--accent] text-[--background] border-[--accent]' : 'border-[--border] text-[--text-muted] hover:border-[--accent]'}`}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </Reveal>

      {documents.length === 0 ? (
        <p className="text-[--text-muted] text-center py-20">No documents found for this filter.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc: {
            id: string; titleEn: string; descEn: string; category: string;
            language: string; fileType: string; pageCount: number | null; fileUrl: string; tags: string[]
          }, i: number) => {
            const Icon = FILE_ICONS[doc.fileType] ?? File
            return (
              <Reveal key={doc.id} direction="up" delay={Math.min(i * 0.06, 0.3)}>
                <div className="glass rounded-xl p-6 border border-[--border] hover:border-[--accent-dim] transition-colors h-full flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent-glow)' }}>
                      <Icon size={16} className="text-[--accent]" />
                    </div>
                    <div className="flex gap-1.5">
                      <span className="px-2 py-0.5 rounded text-xs bg-[--surface-2] text-[--text-muted] border border-[--border]">
                        {CATEGORY_LABELS[doc.category] ?? doc.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs bg-[--surface-2] text-[--text-muted] border border-[--border] uppercase">
                        {doc.language}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-sm mb-2">{doc.titleEn}</h3>
                  <p className="text-xs text-[--text-muted] line-clamp-3 flex-1 mb-4">{doc.descEn}</p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-[--text-muted] uppercase">{doc.fileType}{doc.pageCount ? ` · ${doc.pageCount}p` : ''}</span>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[--accent] hover:underline"
                    >
                      Open <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      )}
    </div>
  )
}
