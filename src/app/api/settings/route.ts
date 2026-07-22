import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET() {
  const settings = await db.siteSettings.findUnique({ where: { id: 'main' } })
  return NextResponse.json(settings || { siteName: 'متجر التجميل', siteNameEn: 'Beauty Store', whatsappNumber: '966500000000' })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'admin') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const body = await req.json()
  const settings = await db.siteSettings.upsert({
    where: { id: 'main' },
    update: body,
    create: { id: 'main', ...body },
  })
  return NextResponse.json(settings)
}
