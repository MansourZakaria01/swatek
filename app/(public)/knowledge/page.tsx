export const dynamic = 'force-dynamic'
import { Reveal } from '@/components/cinematic/Reveal'
import { PageHero } from '@/components/cinematic/PageHero'
import { GlowCard } from '@/components/cinematic/GlowCard'
import { AmbientBackdrop } from '@/components/cinematic/AmbientBackdrop'
import { SectionLabel } from '@/components/cinematic/SectionLabel'
import { SplitHeading } from '@/components/cinematic/SplitHeading'
import Link from 'next/link'
import { ExternalLink, FileText, FileSpreadsheet, File } from 'lucide-react'
import { getDocuments } from '@/lib/queries'

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
    <>
      <PageHero
        index="04"
        kicker="Resources"
        title="Knowledge Library"
        description="White papers, technical specs, implementation guides, and reports — all downloadable."
      >
        <Reveal direction="up" delay={0.1}>
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="kicker text-[--text-muted]">Type</span>
              <LinkChip href={`/knowledge${language ? `?language=${language}` : ''}`} active={!category}>All</LinkChip>
              {CATEGORIES.map((c) => (
                <LinkChip key={c} href={`/knowledge?category=${c}${language ? `&language=${language}` : ''}`} active={category === c}>
                  {CATEGORY_LABELS[c]}
                </LinkChip>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="kicker text-[--text-muted]">Lang</span>
              {LANGUAGES.map((l) => (
                <LinkChip key={l.value} href={`/knowledge?language=${l.value}${category ? `&category=${category}` : ''}`} active={language === l.value}>
                  {l.label}
                </LinkChip>
              ))}
            </div>
          </div>
        </Reveal>
      </PageHero>

      <section className="relative overflow-hidden">
        <AmbientBackdrop />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
          {documents.length === 0 ? (
            <p className="text-[--text-muted] text-center py-20">No documents found for this filter.</p>
          ) : (
            <>
              <Reveal direction="up">
                <div className="mb-10">
                  <SectionLabel index="01" label="Library" />
                  <SplitHeading
                    text="Browse Documents"
                    as="h2"
                    className="font-display text-2xl md:text-4xl font-bold"
                    stagger={0.06}
                  />
                </div>
              </Reveal>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {documents.map((doc: {
                  id: string; titleEn: string; descEn: string; category: string;
                  language: string; fileType: string; pageCount: number | null; fileUrl: string; tags: string[]
                }, i: number) => {
                  const Icon = FILE_ICONS[doc.fileType] ?? File
                  return (
                    <Reveal key={doc.id} direction="up" delay={Math.min(i * 0.06, 0.3)}>
                      <GlowCard className="p-6 h-full flex flex-col card-hover">
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-[--border]" style={{ background: 'var(--accent-glow)' }}>
                            <Icon size={16} className="text-[--accent]" />
                          </div>
                          <div className="flex gap-1.5">
                            <span className="px-2 py-0.5 rounded-full text-xs bg-[--surface-2] text-[--text-muted] border border-[--border]">
                              {CATEGORY_LABELS[doc.category] ?? doc.category}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs bg-[--surface-2] text-[--text-muted] border border-[--border] uppercase">
                              {doc.language}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-display font-semibold text-base mb-2">{doc.titleEn}</h3>
                        <p className="text-xs text-[--text-muted] line-clamp-3 flex-1 mb-5">{doc.descEn}</p>

                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-xs text-[--text-muted] uppercase tracking-widest">{doc.fileType}{doc.pageCount ? ` · ${doc.pageCount}p` : ''}</span>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[--accent] hover:text-[--accent-warm]"
                          >
                            Open <ExternalLink size={11} />
                          </a>
                        </div>
                      </GlowCard>
                    </Reveal>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}

function LinkChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-3 py-1 rounded-full text-xs border transition-colors ${active ? 'bg-[--accent] text-[--background] border-[--accent]' : 'border-[--border] text-[--text-muted] hover:border-[--accent]'}`}
    >
      {children}
    </Link>
  )
}
