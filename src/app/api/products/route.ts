import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { ProductSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 12

  const where: any = { isActive: true }
  if (category) {
    const cat = await db.category.findUnique({ where: { slug: category } })
    if (cat) where.categoryId = cat.id
  }
  if (featured === 'true') where.isFeatured = true

  const [products, total] = await Promise.all([
    db.product.findMany({ where, include: { category: true }, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
    db.product.count({ where }),
  ])

  return NextResponse.json({ products, total, pages: Math.ceil(total / limit), page })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'admin') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const body = await req.json()
  const parsed = ProductSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'بيانات غير صالحة', details: parsed.error.flatten() }, { status: 400 })

  const product = await db.product.create({ data: parsed.data as any })
  return NextResponse.json(product, { status: 201 })
}
