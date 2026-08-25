import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const solution = await prisma.solution.findFirst({
    where: { OR: [{ id }, { slug: id }], published: true },
    include: {
      technologies: { include: { technology: { include: { domain: true } } } },
      caseStudies: true,
    },
  })
  if (!solution) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ solution })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await getAuthUser(_req)
  if (!auth) return unauthorized()
  if (auth.role !== 'admin') return forbidden()
  const { id } = await params
  await prisma.solution.delete({ where: { id } })
  return Response.json({ success: true })
}
