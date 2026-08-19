import { NextRequest, NextResponse } from 'next/server'
import { ZodSchema } from 'zod'

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()
const MAX_BODY_BYTES = 256 * 1024

export function getRequestKey(request: NextRequest, userId?: string) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return userId || forwarded || request.headers.get('x-real-ip') || 'anonymous'
}

export function checkRateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now()
  const current = buckets.get(key)

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, retryAfter: 0 }
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) }
  }

  current.count += 1
  return { allowed: true, remaining: limit - current.count, retryAfter: 0 }
}

export function rateLimitResponse(retryAfter: number) {
  return NextResponse.json(
    { error: 'Too many requests. Please wait briefly and try again.' },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  )
}

export async function parseJson<T>(request: NextRequest, schema: ZodSchema<T>) {
  const declaredLength = Number(request.headers.get('content-length') || 0)
  if (declaredLength > MAX_BODY_BYTES) {
    return { ok: false as const, response: NextResponse.json({ error: 'Request is too large.' }, { status: 413 }) }
  }

  try {
    const parsed = schema.safeParse(await request.json())
    if (!parsed.success) {
      return {
        ok: false as const,
        response: NextResponse.json(
          { error: 'Invalid request.', details: parsed.error.flatten().fieldErrors },
          { status: 400 }
        )
      }
    }
    return { ok: true as const, data: parsed.data }
  } catch {
    return { ok: false as const, response: NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 }) }
  }
}
