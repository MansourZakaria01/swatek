import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest) {
  const domains = await prisma.technologyDomainRecord.findMany({
    include: { _count: { select: { technologies: true } } },
    orderBy: { nameEn: 'asc' },
  })
  return Response.json({ domains })
}
