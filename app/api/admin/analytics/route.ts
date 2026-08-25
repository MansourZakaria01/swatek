import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser, unauthorized } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req)
  if (!auth) return unauthorized()

  const [
    totalInquiries,
    byStatus,
    byType,
    recentInquiries,
    totalTechnologies,
    totalCaseStudies,
  ] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.inquiry.groupBy({ by: ['inquiryType'], _count: { _all: true } }),
    prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, fullName: true, organization: true, inquiryType: true, status: true, createdAt: true },
    }),
    prisma.technology.count({ where: { published: true } }),
    prisma.caseStudy.count({ where: { published: true } }),
  ])

  return Response.json({
    totalInquiries,
    totalTechnologies,
    totalCaseStudies,
    inquiriesByStatus: byStatus.map((s) => ({ status: s.status, count: s._count._all })),
    inquiriesByType: byType.map((t) => ({ type: t.inquiryType, count: t._count._all })),
    recentInquiries,
  })
}
