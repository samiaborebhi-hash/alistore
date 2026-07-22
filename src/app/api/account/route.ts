import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { compare, hash } from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { email, currentPassword, newPassword } = body

    // Get current user from DB
    const userId = (session.user as any).id
    const user = await db.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify current password
    const isValid = await compare(currentPassword, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    // Build update data
    const updateData: { email?: string; passwordHash?: string } = {}

    // Update email if provided and different
    if (email && email.trim() !== '' && email !== user.email) {
      // Check if email is already taken
      const existing = await db.user.findUnique({ where: { email } })
      if (existing && existing.id !== userId) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
      }
      updateData.email = email
    }

    // Update password if provided
    if (newPassword && newPassword.trim() !== '') {
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
      }
      updateData.passwordHash = await hash(newPassword, 10)
    }

    // If nothing to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    await db.user.update({
      where: { id: userId },
      data: updateData,
    })

    return NextResponse.json({ success: true, message: 'Account updated successfully' })
  } catch (error) {
    console.error('Account update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}