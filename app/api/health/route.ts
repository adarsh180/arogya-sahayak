import { NextResponse } from 'next/server'
import { getAIConfiguration } from '@/lib/ai'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function databaseIsReachable() {
  let timeout: ReturnType<typeof setTimeout> | undefined
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error('Database health check timed out')), 4_000)
      })
    ])
    return true
  } catch (error) {
    console.error('[health:database]', error instanceof Error ? error.message : 'Unknown error')
    return false
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}

export async function GET() {
  const [database, ai] = await Promise.all([
    databaseIsReachable(),
    Promise.resolve(getAIConfiguration())
  ])
  const auth = {
    secretConfigured: Boolean(process.env.NEXTAUTH_SECRET?.trim()),
    urlConfigured: Boolean((process.env.NEXTAUTH_URL || process.env.URL)?.trim())
  }
  const ready = database && ai.configured && auth.secretConfigured && auth.urlConfigured

  return NextResponse.json({
    status: ready ? 'ready' : 'degraded',
    checks: {
      database: database ? 'ok' : 'unavailable',
      authentication: auth,
      ai: {
        configured: ai.configured,
        provider: ai.provider,
        model: ai.model
      }
    },
    deployment: process.env.SITE_ID ? 'netlify' : process.env.NODE_ENV === 'production' ? 'production' : 'development',
    timestamp: new Date().toISOString()
  }, {
    status: ready ? 200 : 503,
    headers: { 'Cache-Control': 'no-store, max-age=0' }
  })
}
