import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const partner = await prisma.partner.findUnique({ where: { id } })
  if (!partner) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ partner })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await getAuthUser(req)
  if (!auth) return unauthorized()
  if (auth.role === 'viewer') return forbidden()
  const { id } = await params
  const body = await req.json()
  const partner = await prisma.partner.update({ where: { id }, data: body })
  return Response.json({ partner })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await getAuthUser(_req)
  if (!auth) return unauthorized()
  if (auth.role !== 'admin') return forbidden()
  const { id } = await params
  await prisma.partner.delete({ where: { id } })
  return Response.json({ success: true })
}
