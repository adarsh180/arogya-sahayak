import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      phone?: string | null
      age?: number | null
      gender?: string | null
      location?: string | null
      preferredLanguage?: string | null
      userType?: string | null
    }
  }

  interface User {
    id: string
    phone?: string | null
    age?: number | null
    gender?: string | null
    location?: string | null
    preferredLanguage?: string | null
    userType?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}