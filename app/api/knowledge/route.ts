import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth'
import { z } from 'zod'

const docSchema = z.object({
  titleEn: z.string().min(2), titleFr: z.string().min(2), titleAr: z.string().min(2),
  descEn: z.string().min(10), descFr: z.string().min(10), descAr: z.string().min(10),
  category: z.enum(['whitepaper', 'case_study', 'technical_spec', 'brochure', 'report']),
  language: z.enum(['en', 'fr', 'ar']),
  fileType: z.string().min(2),
  pageCount: z.number().int().positive().optional(),
  fileUrl: z.string().min(2),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(true),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const language = searchParams.get('language')
  const tag = searchParams.get('tag')
  const q = searchParams.get('q')

  const documents = await prisma.knowledgeDocument.findMany({
    where: {
      published: true,
      ...(category ? { category: category as never } : {}),
      ...(language ? { language } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
      ...(q ? {
        OR: [
          { titleEn: { contains: q, mode: 'insensitive' } },
          { titleFr: { contains: q, mode: 'insensitive' } },
        ],
      } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })
  return Response.json({ documents })
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req)
  if (!auth) return unauthorized()
  if (auth.role === 'viewer') return forbidden()

  const body = await req.json()
  const parsed = docSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation error', issues: parsed.error.issues }, { status: 400 })
  }

  const document = await prisma.knowledgeDocument.create({ data: parsed.data })
  return Response.json({ document }, { status: 201 })
}
