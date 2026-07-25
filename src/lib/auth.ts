import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { db } from './db'
import { LoginSchema } from './validations'

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || 'aaAA1232!@!#ASD',
  pages: { signIn: '/admin/login', error: '/admin/login' },
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials)
        if (!parsed.success) return null
        const { email, password } = parsed.data
        const cleanEmail = email.toLowerCase().trim()
        const user = await db.user.findFirst({
          where: {
            email: { equals: cleanEmail, mode: 'insensitive' }
          }
        })
        if (!user) return null
        const isValid = await compare(password, user.passwordHash)
        if (!isValid) return null
        return { id: user.id, email: user.email, name: user.name, role: user.role } as any
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) { token.role = user.role; token.id = user.id }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) { session.user.role = token.role; session.user.id = token.id }
      return session
    },
  },
})
