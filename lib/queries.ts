/**
 * Direct Prisma queries for public pages.
 * Avoids internal HTTP fetch (fetchPublicJson) which can fail during SSR
 * when the Next.js server isn't ready to accept self-connections.
 */
import { prisma } from '@/lib/prisma'

// ── Technologies ──────────────────────────────────────────────────────────────

export async function getTechnologies(domain?: string, tag?: string) {
  return prisma.technology.findMany({
    where: {
      published: true,
      ...(domain ? { domain: { slug: domain } } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
    },
    include: { domain: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  })
}

export async function getTechnologyBySlug(slug: string) {
  return prisma.technology.findFirst({
    where: { OR: [{ slug }, { id: slug }], published: true },
    include: { domain: true, metrics: true },
  })
}

// ── Domains ───────────────────────────────────────────────────────────────────

export async function getDomains() {
  return prisma.technologyDomainRecord.findMany({
    include: { _count: { select: { technologies: true } } },
    orderBy: { nameEn: 'asc' },
  })
}

// ── Solutions ─────────────────────────────────────────────────────────────────

export async function getSolutions() {
  return prisma.solution.findMany({
    where: { published: true },
    include: {
      technologies: { include: { technology: { include: { domain: true } } } },
      _count: { select: { caseStudies: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getSolutionBySlug(slug: string) {
  return prisma.solution.findFirst({
    where: { OR: [{ slug }, { id: slug }], published: true },
    include: {
      technologies: { include: { technology: { include: { domain: true } } } },
      caseStudies: true,
    },
  })
}

// ── Case Studies ──────────────────────────────────────────────────────────────

export async function getCaseStudies(sector?: string, geography?: string) {
  return prisma.caseStudy.findMany({
    where: {
      published: true,
      ...(sector ? { sector: { contains: sector, mode: 'insensitive' } } : {}),
      ...(geography ? { geography: { contains: geography, mode: 'insensitive' } } : {}),
    },
    include: { solution: true, _count: { select: { metrics: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getCaseStudyBySlug(slug: string) {
  return prisma.caseStudy.findFirst({
    where: { OR: [{ slug }, { id: slug }], published: true },
    include: { solution: { include: { technologies: { include: { technology: true } } } }, metrics: true },
  })
}

// ── Knowledge ─────────────────────────────────────────────────────────────────

export async function getDocuments(category?: string, language?: string) {
  return prisma.knowledgeDocument.findMany({
    where: {
      published: true,
      ...(category ? { category: category as never } : {}),
      ...(language ? { language } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })
}

// ── Partners ──────────────────────────────────────────────────────────────────

export async function getPartners() {
  return prisma.partner.findMany({
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
  })
}
