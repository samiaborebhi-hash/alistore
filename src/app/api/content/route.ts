import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const blocks = await db.contentBlock.findMany({ orderBy: { key: 'asc' } })
  return NextResponse.json(blocks)
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, value } = body

  if (!id || value === undefined) {
    return NextResponse.json({ error: 'id and value required' }, { status: 400 })
  }

  await db.contentBlock.update({
    where: { id },
    data: { value },
  })

  return NextResponse.json({ success: true })
}