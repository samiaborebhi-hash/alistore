'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { BarChart3 } from 'lucide-react'

interface Order {
  type: string
  totalAmount: number
  createdAt: Date
}

export function SalesChart({ orders }: { orders: Order[] }) {
  // Group by month
  const monthlyData: Record<string, { month: string; retail: number; wholesale: number }> = {}
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

  orders.forEach((order) => {
    const d = new Date(order.createdAt)
    const key = `${months[d.getMonth()]} ${d.getFullYear()}`
    if (!monthlyData[key]) monthlyData[key] = { month: key, retail: 0, wholesale: 0 }
    if (order.type === 'wholesale') monthlyData[key].wholesale += order.totalAmount
    else monthlyData[key].retail += order.totalAmount
  })

  const barData = Object.values(monthlyData)

  // Pie data
  const totalRetail = orders.filter(o => o.type === 'retail').reduce((s, o) => s + o.totalAmount, 0)
  const totalWholesale = orders.filter(o => o.type === 'wholesale').reduce((s, o) => s + o.totalAmount, 0)
  const pieData = [
    { name: 'تجزئة', value: totalRetail },
    { name: 'جملة', value: totalWholesale },
  ]
  const COLORS = ['#a855f7', '#f43f5e']

  return (
    <div className="card border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-700 text-lg flex items-center gap-2">
          <BarChart3 size={20} className="text-purple-500" />
          المبيعات الشهرية (ر.س)
        </h3>
      </div>
      {barData.length === 0 ? (
        <div className="text-center py-10 text-gray-400 bg-gray-50/50 rounded-xl">لا توجد بيانات كافية بعد</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(value: any) => [`${Number(value).toLocaleString()} ر.س`, '']}
              />
              <Bar dataKey="retail" name="تجزئة" fill="#a855f7" radius={[6, 6, 0, 0]} />
              <Bar dataKey="wholesale" name="جملة" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend formatter={(value) => <span className="text-sm text-gray-600">{value}</span>} />
                <Tooltip formatter={(value: any) => [`${Number(value).toLocaleString()} ر.س`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
