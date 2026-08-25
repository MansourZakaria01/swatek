import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d'

export interface JwtPayload {
  sub: string    // user id
  email: string
  role: string
  iat?: number
  exp?: number
}

export function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions)
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload
}

/** Extract and verify the Bearer token from a request. Returns null if invalid. */
export async function getAuthUser(req: NextRequest): Promise<JwtPayload | null> {
  try {
    const header = req.headers.get('authorization') ?? ''
    if (!header.startsWith('Bearer ')) return null
    const token = header.slice(7)
    const payload = verifyToken(token)
    // Optionally verify user still exists in DB
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, role: true } })
    if (!user) return null
    return payload
  } catch {
    return null
  }
}

/** Shorthand guard — returns 401 response or the auth payload */
export function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}

export function forbidden() {
  return Response.json({ error: 'Forbidden' }, { status: 403 })
}
