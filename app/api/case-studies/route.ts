import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth'
import { z } from 'zod'

const caseStudySchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  titleEn: z.string().min(2), titleFr: z.string().min(2), titleAr: z.string().min(2),
  descEn: z.string().min(10), descFr: z.string().min(10), descAr: z.string().min(10),
  sector: z.string().min(2),
  geography: z.string().min(2),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().optional(),
  solutionId: z.string().cuid().optional(),
  capacityMW: z.number().optional(),
  productivityGainPct: z.number().optional(),
  carbonReductionTons: z.number().optional(),
  roiPct: z.number().optional(),
  opCostReductionPct: z.number().optional(),
  published: z.boolean().default(true),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sector = searchParams.get('sector')
  const geography = searchParams.get('geography')
  const tag = searchParams.get('tag')

  const caseStudies = await prisma.caseStudy.findMany({
    where: {
      published: true,
      ...(sector ? { sector: { contains: sector, mode: 'insensitive' } } : {}),
      ...(geography ? { geography: { contains: geography, mode: 'insensitive' } } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
    },
    include: { solution: true, _count: { select: { metrics: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return Response.json({ caseStudies })
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req)
  if (!auth) return unauthorized()
  if (auth.role === 'viewer') return forbidden()

  const body = await req.json()
  const parsed = caseStudySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation error', issues: parsed.error.issues }, { status: 400 })
  }

  const caseStudy = await prisma.caseStudy.create({ data: parsed.data })
  return Response.json({ caseStudy }, { status: 201 })
}
