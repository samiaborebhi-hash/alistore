import { db } from '@/lib/db'
import Link from 'next/link'
import { Package, ShoppingBag, DollarSign, Clock, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { SalesChart } from '@/components/admin/SalesChart'

export default async function AdminDashboard() {
  const [productCount, orderCount, revenue, pendingOrders, confirmedOrders, deliveredOrders] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.order.aggregate({ _sum: { totalAmount: true } }),
    db.order.count({ where: { status: 'pending' } }),
    db.order.count({ where: { status: 'confirmed' } }),
    db.order.count({ where: { status: 'delivered' } }),
  ])

  const recentOrders = await db.order.findMany({
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
  })

  // Get all orders for chart data
  const allOrders = await db.order.findMany({
    select: { type: true, totalAmount: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  const totalRevenue = revenue._sum.totalAmount || 0

  const stats = [
    { label: 'إجمالي المنتجات', value: productCount, icon: Package, bg: 'bg-gradient-to-br from-purple-50 to-purple-100', text: 'text-purple-600', border: 'border-purple-100', change: '+12%', up: true },
    { label: 'إجمالي الطلبات', value: orderCount, icon: ShoppingBag, bg: 'bg-gradient-to-br from-blue-50 to-blue-100', text: 'text-blue-600', border: 'border-blue-100', change: '+8%', up: true },
    { label: 'إجمالي المبيعات', value: `${totalRevenue.toLocaleString()} ر.س`, icon: DollarSign, bg: 'bg-gradient-to-br from-green-50 to-green-100', text: 'text-green-600', border: 'border-green-100', change: '+15%', up: true },
    { label: 'طلبات معلقة', value: pendingOrders, icon: Clock, bg: 'bg-gradient-to-br from-orange-50 to-orange-100', text: 'text-orange-600', border: 'border-orange-100', change: '-3%', up: false },
  ]

  const quickActions = [
    { href: '/admin/products/new', label: 'إضافة منتج', color: 'bg-purple-600 hover:bg-purple-700' },
    { href: '/admin/orders', label: 'الطلبات', color: 'bg-blue-600 hover:bg-blue-700' },
    { href: '/admin/settings', label: 'الإعدادات', color: 'bg-gray-600 hover:bg-gray-700' },
  ]

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">لوحة التحكم</h1>
          <p className="text-gray-500 mt-1">مرحباً بك، إليك ملخص أداء متجرك</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className={`px-4 py-2 ${action.color} text-white rounded-xl text-sm font-semibold transition-colors`}>
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`stat-card group cursor-pointer border ${stat.border} hover:-translate-y-1 transition-transform duration-300`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center shadow-sm`}>
                <stat.icon size={22} className={stat.text} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SalesChart orders={allOrders} />
        <div className="card border border-gray-100 hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-gray-700 mb-5 flex items-center gap-2 text-lg">
            <TrendingUp size={20} className="text-purple-500" />
            ملخص الطلبات
          </h3>
          <div className="space-y-5">
            {[
              { label: 'معلق', count: pendingOrders, color: 'bg-yellow-500', bg: 'bg-yellow-50' },
              { label: 'مؤكد', count: confirmedOrders, color: 'bg-blue-500', bg: 'bg-blue-50' },
              { label: 'تم التوصيل', count: deliveredOrders, color: 'bg-green-500', bg: 'bg-green-50' },
              { label: 'الكل', count: orderCount, color: 'bg-purple-500', bg: 'bg-purple-50' },
            ].map((item) => (
              <div key={item.label} className={`p-3 rounded-xl ${item.bg}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${item.color} rounded-full`} />
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-800">{item.count}</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${orderCount > 0 ? Math.round((item.count / orderCount) * 100) : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-700 text-lg">آخر الطلبات</h3>
          <Link href="/admin/orders" className="text-sm text-purple-600 hover:text-purple-700 font-medium">عرض الكل</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <ShoppingBag size={40} className="mx-auto mb-3 opacity-50" />
            <p>لا توجد طلبات بعد</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-100">
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">العميل</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">الهاتف</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">النوع</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">المنتجات</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">المبلغ</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-800 whitespace-nowrap">{order.customerName}</td>
                    <td className="py-4 px-4 text-gray-500 whitespace-nowrap" dir="ltr">{order.customerPhone}</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.type === 'wholesale' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        {order.type === 'wholesale' ? 'جملة' : 'تجزئة'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-xs max-w-[200px] truncate">
                      {order.items.map(i => i.product.nameAr).join('، ')}
                    </td>
                    <td className="py-4 px-4 font-bold text-gray-800 whitespace-nowrap">{order.totalAmount.toLocaleString()} ر.س</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
