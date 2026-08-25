import { z } from 'zod'

export const createInquirySchema = z.object({
  fullName: z.string().min(2).max(100),
  organization: z.string().max(100).optional(),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  inquiryType: z.enum([
    'technology_partnership',
    'project_development',
    'investment',
    'government_relation',
    'technical_consulting',
    'other',
  ]),
  message: z.string().min(10).max(2000),
})

export const updateInquirySchema = z.object({
  status: z.enum(['new', 'in_review', 'assigned', 'in_progress', 'closed']).optional(),
  assignedToId: z.string().cuid().nullable().optional(),
})

export const addNoteSchema = z.object({
  content: z.string().min(1).max(1000),
})

export type CreateInquiryInput = z.infer<typeof createInquirySchema>
export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>
