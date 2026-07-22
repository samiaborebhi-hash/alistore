import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Phone, User, Calendar, Tag, Package } from 'lucide-react'

export default async function AdminOrders() {
  const orders = await db.order.findMany({
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
    shipped: 'bg-purple-100 text-purple-700 border-purple-200',
    delivered: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  }

  const statusLabels: Record<string, string> = {
    pending: 'معلق', confirmed: 'مؤكد', shipped: 'تم الشحن', delivered: 'تم التوصيل', cancelled: 'ملغي',
  }

  const stats = [
    { label: 'الكل', count: orders.length, color: 'bg-gray-500' },
    { label: 'معلق', count: orders.filter(o => o.status === 'pending').length, color: 'bg-yellow-500' },
    { label: 'مؤكد', count: orders.filter(o => o.status === 'confirmed').length, color: 'bg-blue-500' },
    { label: 'مكتمل', count: orders.filter(o => o.status === 'delivered').length, color: 'bg-green-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">الطلبات</h1>
        <p className="text-gray-500 mt-1">إدارة ومتابعة جميع طلبات المتجر</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="card text-center">
            <div className={`w-3 h-3 ${s.color} rounded-full mx-auto mb-2`} />
            <p className="text-2xl font-bold text-gray-800">{s.count}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="card text-center py-12">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">لا توجد طلبات بعد</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="card">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="font-semibold text-gray-800">{order.customerName}</span>
                    </div>
                    <a href={`https://wa.me/${order.customerPhone}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm">
                      <Phone size={14} /> {order.customerPhone}
                    </a>
                    <span className="flex items-center gap-1 text-gray-400 text-sm">
                      <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.type === 'wholesale' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {order.type === 'wholesale' ? 'جملة' : 'تجزئة'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 text-sm">
                        <span className="font-medium text-gray-700">{item.product.nameAr}</span>
                        <span className="text-gray-400">×{item.quantity}</span>
                        <span className="text-gray-500">({item.price} ر.س)</span>
                      </div>
                    ))}
                  </div>

                  {order.notes && <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-2">📝 {order.notes}</p>}
                </div>

                <div className="flex items-center gap-3 lg:flex-shrink-0">
                  <span className="text-xl font-bold text-gray-800">{order.totalAmount.toLocaleString()} ر.س</span>
                  <form action={async (formData: FormData) => { 'use server'; await db.order.update({ where: { id: formData.get('id') as string }, data: { status: formData.get('status') as string } }); revalidatePath('/admin/orders') }} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={order.id} />
                    <select name="status" defaultValue={order.status} className="input-field !py-2 !text-sm w-auto">
                      {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <button type="submit" className="btn-primary !py-2 !text-sm">تحديث</button>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
