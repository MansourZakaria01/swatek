import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth'
import { z } from 'zod'

const solutionSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  titleEn: z.string().min(2), titleFr: z.string().min(2), titleAr: z.string().min(2),
  descEn: z.string().min(10), descFr: z.string().min(10), descAr: z.string().min(10),
  sector: z.string().min(2),
  coverImage: z.string().optional(),
  published: z.boolean().optional().default(true),
  technologyIds: z.array(z.string().cuid()).optional().default([]),
})

export async function GET(_req: NextRequest) {
  const solutions = await prisma.solution.findMany({
    where: { published: true },
    include: {
      technologies: { include: { technology: { include: { domain: true } } } },
      _count: { select: { caseStudies: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return Response.json({ solutions })
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req)
  if (!auth) return unauthorized()
  if (auth.role === 'viewer') return forbidden()

  const body = await req.json()
  const parsed = solutionSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation error', issues: parsed.error.issues }, { status: 400 })
  }

  const { technologyIds, ...data } = parsed.data
  const solution = await prisma.solution.create({
    data: {
      ...data,
      technologies: {
        create: technologyIds.map((tid) => ({ technologyId: tid })),
      },
    },
    include: { technologies: { include: { technology: true } } },
  })
  return Response.json({ solution }, { status: 201 })
}
