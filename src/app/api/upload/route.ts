import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'لا يوجد ملف' }, { status: 400 })

  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: 'الملف كبير جداً (الحد 2MB)' }, { status: 400 })
  }

  // Convert to base64 data URL
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const base64 = buffer.toString('base64')
  const mimeType = file.type || 'image/jpeg'
  const dataUrl = `data:${mimeType};base64,${base64}`

  return NextResponse.json({ url: dataUrl })
}