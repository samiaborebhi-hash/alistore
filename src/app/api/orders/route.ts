import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { OrderSchema } from '@/lib/validations'

export async function GET() {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'admin') return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const orders = await db.order.findMany({ include: { items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = OrderSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 })

  const { items, ...orderData } = parsed.data
  let totalAmount = 0

  for (const item of items) {
    const product = await db.product.findUnique({ where: { id: item.productId } })
    if (!product) return NextResponse.json({ error: `المنتج غير موجود: ${item.productId}` }, { status: 400 })
    const price = orderData.type === 'wholesale' && product.wholesalePrice ? product.wholesalePrice : product.price
    totalAmount += price * item.quantity
  }

  const order = await db.order.create({
    data: {
      ...orderData,
      totalAmount,
      items: {
        create: await Promise.all(items.map(async (item) => {
          const product = await db.product.findUnique({ where: { id: item.productId } })
          const price = orderData.type === 'wholesale' && product!.wholesalePrice ? product!.wholesalePrice : product!.price
          return { productId: item.productId, quantity: item.quantity, price }
        })),
      },
    },
    include: { items: { include: { product: true } } },
  })

  return NextResponse.json(order, { status: 201 })
}
