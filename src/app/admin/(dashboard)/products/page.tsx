import { db } from '@/lib/db'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search, Filter, Package, Eye, EyeOff } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ q?: string; cat?: string }> }) {
  const { q, cat } = await searchParams
  const categories = await db.category.findMany()

  const where: any = {}
  if (q) where.OR = [{ nameAr: { contains: q } }, { name: { contains: q } }]
  if (cat) where.categoryId = cat

  const products = await db.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">المنتجات</h1>
          <p className="text-gray-500 mt-1">إدارة جميع منتجات المتجر</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary inline-flex items-center gap-2 self-start">
          <Plus size={18} /> إضافة منتج جديد
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <form>
              <input name="q" defaultValue={q || ''} placeholder="بحث عن منتج..." className="input-field pr-10" />
            </form>
          </div>
          <form className="flex gap-2">
            <select name="cat" defaultValue={cat || ''} className="input-field w-auto min-w-[140px]">
              <option value="">جميع الأقسام</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
            </select>
            <button type="submit" className="btn-secondary text-sm px-4">تصفية</button>
          </form>
        </div>
      </div>

      {/* Products Table */}
      <div className="card !p-0 overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-400 mb-4">ابدأ بإضافة أول منتج إلى متجرك</p>
            <Link href="/admin/products/new" className="btn-primary inline-flex items-center gap-2">
              <Plus size={18} /> إضافة منتج
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-right py-4 px-4 font-medium text-gray-500">المنتج</th>
                <th className="text-right py-4 px-4 font-medium text-gray-500">القسم</th>
                <th className="text-right py-4 px-4 font-medium text-gray-500">السعر</th>
                <th className="text-right py-4 px-4 font-medium text-gray-500">سعر الجملة</th>
                <th className="text-right py-4 px-4 font-medium text-gray-500">المخزون</th>
                <th className="text-right py-4 px-4 font-medium text-gray-500">الحالة</th>
                <th className="text-right py-4 px-4 font-medium text-gray-500">مميز</th>
                <th className="text-right py-4 px-4 font-medium text-gray-500">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {(() => { const imgs = JSON.parse(p.images || '[]'); return imgs[0] ? <img src={imgs[0]} alt="" className="w-full h-full object-cover" /> : <Package size={18} className="text-gray-400" /> })()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{p.nameAr}</p>
                        <p className="text-xs text-gray-400">{p.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">{p.category.nameAr}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-800">{p.price.toLocaleString()} ر.س</td>
                  <td className="py-3 px-4 text-gray-600">{p.wholesalePrice ? `${p.wholesalePrice.toLocaleString()} ر.س` : '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${p.stock === 0 ? 'text-red-500' : p.stock < 10 ? 'text-orange-500' : 'text-green-600'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${p.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {p.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                      {p.isActive ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {p.isFeatured ? <span className="text-yellow-500 text-lg">★</span> : <span className="text-gray-300 text-lg">☆</span>}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/products/${p.id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                        <Pencil size={16} />
                      </Link>
                      <form action={async () => { 'use server'; await db.product.delete({ where: { id: p.id } }); revalidatePath('/admin/products') }}>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Stats Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>إجمالي المنتجات: <strong className="text-gray-800">{products.length}</strong></span>
        <span>المنتجات النشطة: <strong className="text-green-600">{products.filter(p => p.isActive).length}</strong></span>
      </div>
    </div>
  )
}
