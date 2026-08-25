import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest) {
  const metrics = await prisma.impactMetric.findMany({
    where: { technologyId: null, caseStudyId: null }, // global metrics
    orderBy: { createdAt: 'asc' },
  })
  return Response.json({ metrics })
}
