import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth'
import { technologySchema } from '@/lib/validation/technology'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const domain = searchParams.get('domain')
  const tag = searchParams.get('tag')
  const featured = searchParams.get('featured')
  const q = searchParams.get('q')

  const technologies = await prisma.technology.findMany({
    where: {
      published: true,
      ...(domain ? { domain: { slug: domain } } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
      ...(featured === 'true' ? { featured: true } : {}),
      ...(q ? {
        OR: [
          { nameEn: { contains: q, mode: 'insensitive' } },
          { nameFr: { contains: q, mode: 'insensitive' } },
          { tags: { has: q } },
        ],
      } : {}),
    },
    include: { domain: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  })

  return Response.json({ technologies })
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req)
  if (!auth) return unauthorized()
  if (auth.role === 'viewer') return forbidden()

  const body = await req.json()
  const parsed = technologySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation error', issues: parsed.error.issues }, { status: 400 })
  }

  const technology = await prisma.technology.create({
    data: parsed.data,
    include: { domain: true },
  })

  return Response.json({ technology }, { status: 201 })
}
