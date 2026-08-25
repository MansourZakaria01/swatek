import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth'
import { technologySchema } from '@/lib/validation/technology'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const technology = await prisma.technology.findFirst({
    where: { OR: [{ id }, { slug: id }], published: true },
    include: { domain: true, metrics: true },
  })
  if (!technology) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ technology })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await getAuthUser(req)
  if (!auth) return unauthorized()
  if (auth.role === 'viewer') return forbidden()

  const { id } = await params
  const body = await req.json()
  const parsed = technologySchema.partial().safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation error', issues: parsed.error.issues }, { status: 400 })
  }

  const technology = await prisma.technology.update({
    where: { id },
    data: parsed.data,
    include: { domain: true },
  })
  return Response.json({ technology })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await getAuthUser(_req)
  if (!auth) return unauthorized()
  if (auth.role !== 'admin') return forbidden()

  const { id } = await params
  await prisma.technology.delete({ where: { id } })
  return Response.json({ success: true })
}
