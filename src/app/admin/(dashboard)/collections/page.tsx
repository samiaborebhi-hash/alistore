import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2, Edit } from 'lucide-react'

export default async function CollectionsPage() {
  const collections = await db.collection.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { order: 'asc' },
  })
  const products = await db.product.findMany({ select: { id: true, nameAr: true } })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الكولكشنز</h1>
          <p className="text-gray-500 mt-1 text-sm">أنشئ مجموعات من المنتجات تظهر في الصفحة الرئيسية</p>
        </div>
      </div>

      {/* Create form */}
      <form
        action={async (formData: FormData) => {
          'use server'
          const name = formData.get('name') as string
          const nameAr = formData.get('nameAr') as string
          const descriptionAr = formData.get('descriptionAr') as string || null
          const productIds = (formData.getAll('productIds') as string[]).filter(Boolean)

          const col = await db.collection.create({
            data: { name, nameAr, descriptionAr },
          })

          if (productIds.length > 0) {
            await db.productCollection.createMany({
              data: productIds.map(pid => ({ productId: pid, collectionId: col.id })),
            })
          }

          revalidatePath('/')
          revalidatePath('/admin/collections')
          redirect('/admin/collections')
        }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 space-y-4"
      >
        <h2 className="font-bold text-gray-800">إضافة كولكشن جديد</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم (إنجليزي)</label>
            <input name="name" required className="input-field" placeholder="Summer Collection" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم (عربي)</label>
            <input name="nameAr" required className="input-field" placeholder="مجموعة الصيف" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">الوصف (عربي)</label>
          <textarea name="descriptionAr" rows={2} className="input-field" placeholder="وصف الكولكشن..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">المنتجات</label>
          <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-3 space-y-2">
            {products.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">لا توجد منتجات. أضف منتجات أولاً.</p>
            ) : products.map(p => (
              <label key={p.id} className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 p-2 rounded-lg transition-colors">
                <input type="checkbox" name="productIds" value={p.id} className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-700">{p.nameAr}</span>
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="btn-primary">إنشاء الكولكشن</button>
      </form>

      {/* Existing collections */}
      <div className="space-y-3">
        {collections.map(col => (
          <div key={col.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800">{col.nameAr}</h3>
              <p className="text-sm text-gray-500">{col.descriptionAr || col.name}</p>
              <span className="text-xs text-purple-500 font-medium mt-1 inline-block">{col._count.products} منتج</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/collections/${col.id}`}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit size={18} />
              </Link>
              <form
                action={async () => {
                  'use server'
                  await db.collection.delete({ where: { id: col.id } })
                  revalidatePath('/')
                  revalidatePath('/admin/collections')
                  redirect('/admin/collections')
                }}
              >
                <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </form>
            </div>
          </div>
        ))}
        {collections.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-400">لا توجد كولكشنز بعد</p>
          </div>
        )}
      </div>
    </div>
  )
}