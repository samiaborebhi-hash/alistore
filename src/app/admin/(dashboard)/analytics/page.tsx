import { db } from '@/lib/db'
import { BarChart3, TrendingUp, Users, Package, ShoppingBag, DollarSign, Star, ArrowUpRight } from 'lucide-react'
import { SalesChart } from '@/components/admin/SalesChart'

export default async function AnalyticsPage() {
  const [
    allOrders,
    products,
    reviews,
  ] = await Promise.all([
    db.order.findMany({
      select: { type: true, totalAmount: true, createdAt: true, status: true, customerPhone: true },
      orderBy: { createdAt: 'asc' },
    }),
    db.product.findMany({
      include: { orderItems: { select: { quantity: true, price: true } } },
    }),
    db.review.findMany({ select: { rating: true } }),
  ])

  // ── إحصائيات عامة ─────────────────────────────────────────────
  const totalRevenue = allOrders.reduce((s, o) => s + o.totalAmount, 0)
  const deliveredOrders = allOrders.filter(o => o.status === 'delivered')
  const deliveredRevenue = deliveredOrders.reduce((s, o) => s + o.totalAmount, 0)
  const uniqueCustomers = new Set(allOrders.map(o => o.customerPhone)).size
  const avgOrderValue = allOrders.length > 0 ? totalRevenue / allOrders.length : 0
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  // ── أفضل المنتجات مبيعاً ─────────────────────────────────────
  const productSales = products
    .map(p => ({
      id: p.id,
      nameAr: p.nameAr,
      totalQty: p.orderItems.reduce((s, i) => s + i.quantity, 0),
      totalRevenue: p.orderItems.reduce((s, i) => s + (i.price * i.quantity), 0),
      stock: p.stock,
    }))
    .sort((a, b) => b.totalQty - a.totalQty)
    .slice(0, 8)

  // ── مبيعات الأسبوع الحالي مقابل الأسبوع الماضي ────────────────
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
  const thisWeekOrders = allOrders.filter(o => new Date(o.createdAt) >= weekAgo)
  const lastWeekOrders = allOrders.filter(o => {
    const d = new Date(o.createdAt)
    return d >= twoWeeksAgo && d < weekAgo
  })
  const thisWeekRevenue = thisWeekOrders.reduce((s, o) => s + o.totalAmount, 0)
  const lastWeekRevenue = lastWeekOrders.reduce((s, o) => s + o.totalAmount, 0)
  const weekGrowth = lastWeekRevenue > 0
    ? Math.round(((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100)
    : thisWeekRevenue > 0 ? 100 : 0

  const stats = [
    {
      label: 'إجمالي الإيرادات', value: `${totalRevenue.toLocaleString()} ₪`,
      icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100',
      sub: `${deliveredRevenue.toLocaleString()} ₪ محصّل`,
    },
    {
      label: 'العملاء الفريدون', value: uniqueCustomers,
      icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100',
      sub: `${allOrders.length} طلب إجمالي`,
    },
    {
      label: 'متوسط قيمة الطلب', value: `${Math.round(avgOrderValue).toLocaleString()} ₪`,
      icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100',
      sub: `${weekGrowth >= 0 ? '+' : ''}${weekGrowth}% هذا الأسبوع`,
    },
    {
      label: 'متوسط التقييم', value: reviews.length > 0 ? `${avgRating.toFixed(1)} ⭐` : '–',
      icon: Star, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100',
      sub: `${reviews.length} تقييم`,
    },
  ]

  // ── توزيع حالات الطلبات ───────────────────────────────────────
  const statusMap = { pending: 'معلق', confirmed: 'مؤكد', shipped: 'مشحون', delivered: 'موصّل', cancelled: 'ملغي' }
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-400', confirmed: 'bg-blue-500',
    shipped: 'bg-purple-500', delivered: 'bg-green-500', cancelled: 'bg-red-400',
  }
  const ordersByStatus = Object.entries(statusMap).map(([key, label]) => ({
    key, label,
    count: allOrders.filter(o => o.status === key).length,
    color: statusColors[key],
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">التقارير والإحصائيات</h1>
        <p className="text-gray-500 mt-1">نظرة شاملة على أداء المتجر</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`stat-card border ${s.border}`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center`}>
                <s.icon size={22} className={s.color} />
              </div>
              <ArrowUpRight size={16} className="text-gray-300" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Chart - takes 2 cols */}
        <div className="lg:col-span-2">
          <SalesChart orders={allOrders} />
        </div>

        {/* Order Status distribution */}
        <div className="card border border-gray-100">
          <h3 className="font-semibold text-gray-700 mb-5 flex items-center gap-2 text-lg">
            <ShoppingBag size={20} className="text-purple-500" />
            حالات الطلبات
          </h3>
          <div className="space-y-3">
            {ordersByStatus.map((item) => (
              <div key={item.key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{item.count}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-700`}
                    style={{ width: `${allOrders.length > 0 ? Math.round((item.count / allOrders.length) * 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">هذا الأسبوع</span>
              <span className="font-bold text-purple-600">{thisWeekOrders.length} طلب</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="card border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-5 flex items-center gap-2 text-lg">
          <Package size={20} className="text-purple-500" />
          أفضل المنتجات مبيعاً
        </h3>
        {productSales.filter(p => p.totalQty > 0).length === 0 ? (
          <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl">
            <Package size={36} className="mx-auto mb-2 opacity-30" />
            <p>لا توجد مبيعات بعد</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">#</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">المنتج</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">الكمية المباعة</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">الإيرادات</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">المخزون</th>
                </tr>
              </thead>
              <tbody>
                {productSales.map((p, idx) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors">
                    <td className="py-3 px-4 text-gray-400 font-mono text-xs">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{p.nameAr}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold">
                        {p.totalQty} قطعة
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-green-600">{p.totalRevenue.toLocaleString()} ₪</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${p.stock > 10 ? 'bg-green-50 text-green-700' : p.stock > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-600'}`}>
                        {p.stock > 0 ? `${p.stock} متبقي` : 'نفد'}
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
