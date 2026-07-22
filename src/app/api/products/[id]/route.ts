import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await db.product.findUnique({ where: { id }, include: { category: true } })
  if (!product) return NextResponse.json({ error: 'غير موجود' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'admin') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const product = await db.product.update({ where: { id }, data: body })
  return NextResponse.json(product)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'admin') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const { id } = await params
  await db.product.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
