import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // For demo purposes, we'll use hardcoded credentials
        // In production, you'd verify against your user database
        const validUsers = [
          {
            id: "admin-1",
            email: "admin@flyover.com",
            password: "admin123",
            name: "Admin User",
            role: "ADMIN" as Role
          },
          {
            id: "support-1",
            email: "support@flyover.com",
            password: "support123",
            name: "Support User",
            role: "SUPPORT" as Role
          }
        ]

        const user = validUsers.find(u => u.email === credentials.email)
        
        if (user && user.password === credentials.password) {
          // Update or create user in database
          const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {
              name: user.name,
              role: user.role
            },
            create: {
              email: user.email,
              name: user.name,
              role: user.role
            }
          })

          return {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as Role
      }
      return session
    }
  },
  pages: {
    signIn: "/admin/login"
  }
}

// Type augmentation for NextAuth
declare module "next-auth" {
  interface User {
    role: Role
  }
  
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: Role
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role
  }
}