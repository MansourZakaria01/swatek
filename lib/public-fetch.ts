/** Server-side fetch for public pages — always fresh in force-dynamic routes. */
export async function fetchPublicJson<T = unknown>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://127.0.0.1:3000'
  try {
    const res = await fetch(`${base}${path}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
      ...init,
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}
