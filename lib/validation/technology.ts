import { z } from 'zod'

export const technologySchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  domainId: z.string().cuid(),
  nameEn: z.string().min(2).max(200),
  nameFr: z.string().min(2).max(200),
  nameAr: z.string().min(2).max(200),
  descEn: z.string().min(10),
  descFr: z.string().min(10),
  descAr: z.string().min(10),
  benefitsEn: z.array(z.string()).min(1),
  benefitsFr: z.array(z.string()).min(1),
  benefitsAr: z.array(z.string()).min(1),
  energySavingsPct: z.number().min(0).max(100).nullable().optional(),
  carbonReductionPct: z.number().min(0).max(100).nullable().optional(),
  roiPeriodMonths: z.number().int().positive().nullable().optional(),
  images: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
})

export type TechnologyInput = z.infer<typeof technologySchema>
