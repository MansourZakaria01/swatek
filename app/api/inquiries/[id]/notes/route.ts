import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, unauthorized } from '@/lib/auth'
import { addNoteSchema } from '@/lib/validation/inquiry'

type Params = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const auth = await getAuthUser(req)
  if (!auth) return unauthorized()

  const { id } = await params
  const body = await req.json()
  const parsed = addNoteSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation error', issues: parsed.error.issues }, { status: 400 })
  }

  const note = await prisma.inquiryNote.create({
    data: { content: parsed.data.content, inquiryId: id, authorId: auth.sub },
    include: { author: { select: { id: true, name: true } } },
  })
  return Response.json({ note }, { status: 201 })
}
