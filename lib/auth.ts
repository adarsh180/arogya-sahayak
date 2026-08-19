import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

const inferredAuthUrl = process.env.NEXTAUTH_URL?.trim() || process.env.URL?.trim()
if (!process.env.NEXTAUTH_URL && inferredAuthUrl) process.env.NEXTAUTH_URL = inferredAuthUrl

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim()
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    ...(googleClientId && googleClientSecret
      ? [GoogleProvider({ clientId: googleClientId, clientSecret: googleClientSecret })]
      : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) return null

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin'
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Fetch fresh user data from database
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            age: true,
            gender: true,
            location: true,
            preferredLanguage: true,
            userType: true,
            onboardingCompleted: true
          }
        })
        
        if (dbUser) {
          session.user = {
            ...session.user,
            ...dbUser
          }
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url === `${baseUrl}/auth/signin` || url === `${baseUrl}/auth/signup`) {
        return `${baseUrl}/dashboard`
      }
      if (url.startsWith('/')) return `${baseUrl}${url}`
      try {
        return new URL(url).origin === new URL(baseUrl).origin ? url : baseUrl
      } catch {
        return baseUrl
      }
    }
  }
}
