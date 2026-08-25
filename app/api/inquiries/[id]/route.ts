import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth'
import { updateInquirySchema } from '@/lib/validation/inquiry'

type Params = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Params) {
  const auth = await getAuthUser(req)
  if (!auth) return unauthorized()

  const { id } = await params
  const inquiry = await prisma.inquiry.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
      notes: { include: { author: { select: { id: true, name: true } } }, orderBy: { createdAt: 'asc' } },
    },
  })
  if (!inquiry) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json({ inquiry })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await getAuthUser(req)
  if (!auth) return unauthorized()
  if (auth.role === 'viewer') return forbidden()

  const { id } = await params
  const body = await req.json()
  const parsed = updateInquirySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation error', issues: parsed.error.issues }, { status: 400 })
  }

  const inquiry = await prisma.inquiry.update({
    where: { id },
    data: parsed.data,
    include: { assignedTo: { select: { id: true, name: true, email: true } } },
  })
  return Response.json({ inquiry })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await getAuthUser(req)
  if (!auth) return unauthorized()
  if (auth.role !== 'admin') return forbidden()
  const { id } = await params
  await prisma.inquiry.delete({ where: { id } })
  return Response.json({ success: true })
}
