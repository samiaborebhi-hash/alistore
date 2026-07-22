import { db } from '@/lib/db'
import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { Plus, Pencil, Trash2, Percent, Calendar, Check, Tag, Package } from 'lucide-react'
import Link from 'next/link'

export default async function AdminPromotions({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams
  const promotions = await db.promotion.findMany({ orderBy: { createdAt: 'desc' } })
  const products = await db.product.findMany({ where: { isActive: true }, orderBy: { nameAr: 'asc' } })

  const promotionToEdit = edit ? promotions.find((p) => p.id === edit) : null

  async function createPromotion(formData: FormData) {
    'use server'
    const selected = formData.getAll('productIds') as string[]
    await db.promotion.create({
      data: {
        name: formData.get('name') as string,
        description: (formData.get('description') as string) || null,
        discountPercent: parseFloat(formData.get('discountPercent') as string),
        startDate: new Date(formData.get('startDate') as string),
        endDate: (formData.get('endDate') as string) ? new Date(formData.get('endDate') as string) : null,
        isActive: formData.get('isActive') === 'on',
        productIds: JSON.stringify(selected),
      },
    })
    revalidateTag('promotions')
    revalidatePath('/admin/promotions')
    redirect('/admin/promotions')
  }

  async function updatePromotion(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const selected = formData.getAll('productIds') as string[]
    await db.promotion.update({
      where: { id },
      data: {
        name: formData.get('name') as string,
        description: (formData.get('description') as string) || null,
        discountPercent: parseFloat(formData.get('discountPercent') as string),
        startDate: new Date(formData.get('startDate') as string),
        endDate: (formData.get('endDate') as string) ? new Date(formData.get('endDate') as string) : null,
        isActive: formData.get('isActive') === 'on',
        productIds: JSON.stringify(selected),
      },
    })
    revalidateTag('promotions')
    revalidatePath('/admin/promotions')
    redirect('/admin/promotions')
  }

  async function deletePromotion(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await db.promotion.delete({ where: { id } })
    revalidateTag('promotions', 'default')
    revalidatePath('/admin/promotions')
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة العروض</h1>
          <p className="text-gray-500 mt-1">إنشاء وتعديل العروض والتخفيضات على المنتجات</p>
        </div>
        {promotionToEdit && (
          <Link href="/admin/promotions" className="btn-secondary text-sm px-4 inline-flex items-center gap-2 self-start">
            إلغاء التعديل
          </Link>
        )}
      </div>

      {/* Form */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            {promotionToEdit ? <Pencil size={20} className="text-purple-600" /> : <Plus size={20} className="text-purple-600" />}
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{promotionToEdit ? 'تعديل العرض' : 'إضافة عرض جديد'}</h2>
        </div>
        <form action={promotionToEdit ? updatePromotion : createPromotion} className="space-y-4">
          {promotionToEdit && <input type="hidden" name="id" value={promotionToEdit.id} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم العرض</label>
              <input name="name" defaultValue={promotionToEdit?.name || ''} required className="input-field" placeholder="مثال: تخفيضات نهاية الأسبوع" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نسبة الخصم %</label>
              <div className="relative">
                <Percent size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="discountPercent" type="number" step="0.01" min="0" max="100" defaultValue={promotionToEdit?.discountPercent || ''} required className="input-field pr-10" placeholder="20" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الوصف (اختياري)</label>
            <textarea name="description" rows={3} defaultValue={promotionToEdit?.description || ''} className="input-field" placeholder="وصف مختصر للعرض..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ البداية</label>
              <div className="relative">
                <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="startDate" type="date" defaultValue={promotionToEdit?.startDate.toISOString().split('T')[0] || today} required className="input-field pr-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ النهاية (اختياري)</label>
              <div className="relative">
                <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="endDate"
                  type="date"
                  defaultValue={promotionToEdit?.endDate ? promotionToEdit.endDate.toISOString().split('T')[0] : ''}
                  className="input-field pr-10"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input id="isActive" type="checkbox" name="isActive" defaultChecked={promotionToEdit ? promotionToEdit.isActive : true} className="w-4 h-4 rounded" />
            <label htmlFor="isActive" className="text-sm text-gray-700">العرض نشط</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المنتجات المشمولة</label>
            <div className="border border-gray-200 rounded-xl p-4 max-h-64 overflow-y-auto bg-gray-50">
              {products.length === 0 ? (
                <p className="text-gray-400">لا توجد منتجات متاحة</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {products.map((product) => {
                    const selectedIds = promotionToEdit ? JSON.parse(promotionToEdit.productIds || '[]') : []
                    return (
                      <label key={product.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100 cursor-pointer hover:border-purple-200 transition-colors">
                        <input type="checkbox" name="productIds" value={product.id} defaultChecked={selectedIds.includes(product.id)} className="w-4 h-4 text-purple-600 rounded" />
                        <span className="text-sm text-gray-700 truncate">{product.nameAr}</span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary inline-flex items-center gap-2">
              {promotionToEdit ? <><Pencil size={18} /> تحديث العرض</> : <><Plus size={18} /> إنشاء العرض</>}
            </button>
          </div>
        </form>
      </div>

      {/* Promotions List */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
            <Tag size={20} className="text-rose-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">العروض الحالية</h2>
        </div>

        {promotions.length === 0 ? (
          <div className="text-center py-12">
            <Percent size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">لا توجد عروض بعد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-right py-3 px-4 font-medium text-gray-500">العرض</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">الخصم</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">الفترة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">الحالة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">المنتجات</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promo) => (
                  <tr key={promo.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-gray-800">{promo.name}</td>
                    <td className="py-3 px-4 text-purple-600 font-semibold">{promo.discountPercent}%</td>
                    <td className="py-3 px-4 text-gray-600">
                      {promo.startDate.toLocaleDateString('ar-SA')}
                      {promo.endDate && ` - ${promo.endDate.toLocaleDateString('ar-SA')}`}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${promo.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {promo.isActive ? <><Check size={12} /> نشط</> : 'معطل'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Package size={14} className="text-gray-400" />
                        {JSON.parse(promo.productIds || '[]').length} منتج
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/promotions?edit=${promo.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                          <Pencil size={16} />
                        </Link>
                        <form action={deletePromotion}>
                          <input type="hidden" name="id" value={promo.id} />
                          <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </div>
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
