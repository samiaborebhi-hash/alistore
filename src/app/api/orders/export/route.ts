import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const orders = await db.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const statusLabels: Record<string, string> = {
    pending: 'معلق', confirmed: 'مؤكد', shipped: 'تم الشحن',
    delivered: 'تم التوصيل', cancelled: 'ملغي',
  }

  const rows: string[] = [
    // BOM for Excel Arabic support
    '\uFEFF' + ['رقم الطلب', 'اسم العميل', 'الهاتف', 'البريد', 'النوع', 'الحالة', 'المبلغ الكلي', 'المنتجات', 'ملاحظات', 'التاريخ'].join(','),
  ]

  for (const order of orders) {
    const products = order.items.map(i => `${i.product.nameAr}×${i.quantity}`).join(' | ')
    const row = [
      order.id.slice(-8),
      `"${order.customerName}"`,
      order.customerPhone,
      order.customerEmail || '',
      order.type === 'wholesale' ? 'جملة' : 'تجزئة',
      statusLabels[order.status] || order.status,
      order.totalAmount,
      `"${products}"`,
      `"${(order.notes || '').replace(/"/g, '""')}"`,
      new Date(order.createdAt).toLocaleDateString('ar-SA'),
    ]
    rows.push(row.join(','))
  }

  const csv = rows.join('\n')
  const date = new Date().toISOString().slice(0, 10)

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="orders-${date}.csv"`,
    },
  })
}
