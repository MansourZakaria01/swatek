import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth'
import { z } from 'zod'

const partnerSchema = z.object({
  name: z.string().min(2).max(200),
  descEn: z.string().min(10), descFr: z.string().min(10), descAr: z.string().min(10),
  website: z.string().url().optional(),
  logo: z.string().optional(),
  type: z.enum(['technology', 'academic', 'financial', 'government', 'industry']),
  featured: z.boolean().optional().default(false),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  const featured = searchParams.get('featured')

  const partners = await prisma.partner.findMany({
    where: {
      ...(type ? { type: type as never } : {}),
      ...(featured === 'true' ? { featured: true } : {}),
    },
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
  })
  return Response.json({ partners })
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req)
  if (!auth) return unauthorized()
  if (auth.role === 'viewer') return forbidden()

  const body = await req.json()
  const parsed = partnerSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'Validation error', issues: parsed.error.issues }, { status: 400 })
  }

  const partner = await prisma.partner.create({ data: parsed.data })
  return Response.json({ partner }, { status: 201 })
}
