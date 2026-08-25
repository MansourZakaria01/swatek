import { NextRequest } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getAuthUser, unauthorized, forbidden } from '@/lib/auth'

const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel']
const MAX_SIZE_BYTES = 20 * 1024 * 1024 // 20 MB

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req)
  if (!auth) return unauthorized()
  if (auth.role === 'viewer') return forbidden()

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json({ error: 'File type not allowed. Only PDF and Office documents.' }, { status: 415 })
  }

  if (file.size > MAX_SIZE_BYTES) {
    return Response.json({ error: 'File too large. Max 20 MB.' }, { status: 413 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents')
  await mkdir(uploadDir, { recursive: true })

  // Sanitize filename
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  const filePath = path.join(uploadDir, safeName)
  await writeFile(filePath, buffer)

  const fileUrl = `/uploads/documents/${safeName}`
  return Response.json({ fileUrl, fileName: safeName, size: file.size }, { status: 201 })
}
