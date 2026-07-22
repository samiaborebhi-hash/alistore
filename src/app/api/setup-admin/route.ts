import { db } from '@/lib/db'
import { hash } from 'bcryptjs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const password = searchParams.get('password')

  if (!email || !password) {
    return Response.json({ error: 'email and password required' }, { status: 400 })
  }

  try {
    const passwordHash = await hash(password, 10)
    const user = await db.user.update({
      where: { email: 'admin@alipro.com' },
      data: { email, passwordHash },
    })
    return Response.json({ success: true, message: 'Admin updated', email: user.email })
  } catch (error) {
    // Try create if update fails
    try {
      const passwordHash = await hash(password, 10)
      const user = await db.user.create({
        data: { email, passwordHash, name: 'Admin', role: 'ADMIN' },
      })
      return Response.json({ success: true, message: 'Admin created', email: user.email })
    } catch (e) {
      return Response.json({ error: String(e) }, { status: 500 })
    }
  }
}