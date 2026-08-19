import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  errorFormat: 'minimal'
})

// A warm serverless function can serve many requests. Reusing one client avoids
// opening a fresh database pool every time Netlify reuses the function isolate.
globalForPrisma.prisma = prisma
