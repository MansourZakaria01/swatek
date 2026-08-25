import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, unauthorized } from '@/lib/auth'
import { createInquirySchema } from '@/lib/validation/inquiry'

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req)
  if (!auth) return unauthorized()

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const inquiryType = searchParams.get('type')
  const assignedTo = searchParams.get('assignedTo')
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'))
  const skip = (page - 1) * limit

  const where = {
    ...(status ? { status: status as never } : {}),
    ...(inquiryType ? { inquiryType: inquiryType as never } : {}),
    ...(assignedTo ? { assignedToId: assignedTo } : {}),
    // editors and viewers only see assigned inquiries
    ...(auth.role === 'viewer' ? { assignedToId: auth.sub } : {}),
  }

  const [inquiries, total] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        _count: { select: { notes: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.inquiry.count({ where }),
  ])

  return Response.json({ inquiries, meta: { total, page, limit, pages: Math.ceil(total / limit) } })
}

export async function POST(req: NextRequest) {
  // Public endpoint — no auth required
  const body = await req.json()
  const parsed = createInquirySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation error', issues: parsed.error.issues }, { status: 400 })
  }

  const inquiry = await prisma.inquiry.create({ data: parsed.data })

  // TODO: trigger email notification here (Nodemailer/Resend stub)
  // await sendNewInquiryEmail(inquiry)

  return Response.json({ inquiry, message: 'Your inquiry has been received.' }, { status: 201 })
}
