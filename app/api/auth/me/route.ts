import { NextRequest } from 'next/server'
import { getAuthUser, unauthorized } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req)
  if (!auth) return unauthorized()

  const user = await prisma.user.findUnique({
    where: { id: auth.sub },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })
  if (!user) return unauthorized()

  return Response.json({ user })
}
