import { db } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { ImageUpload } from '@/components/admin/ImageUpload'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await db.product.findUnique({ where: { id } })
  if (!product) notFound()
  
  const categories = await db.category.findMany()
  const tags = JSON.parse(product.tags || '[]')
  const images = JSON.parse(product.images || '[]')

  async function updateProduct(formData: FormData) {
    'use server'
    
    // Parse uploaded / existing images from form
    let formImages = images
    const rawImagesForm = formData.get('images') as string
    if (rawImagesForm) {
      try {
        const parsed = JSON.parse(rawImagesForm)
        if (Array.isArray(parsed) && parsed.length > 0) {
          formImages = parsed
        }
      } catch {
        // Fallback to existing product images
      }
    }

    const data = {
      name: formData.get('name') as string,
      nameAr: formData.get('nameAr') as string,
      description: (formData.get('description') as string) || null,
      descriptionAr: (formData.get('descriptionAr') as string) || null,
      price: parseFloat(formData.get('price') as string) || 0,
      wholesalePrice: formData.get('wholesalePrice') ? parseFloat(formData.get('wholesalePrice') as string) : null,
      minWholesaleQty: formData.get('minWholesaleQty') ? parseInt(formData.get('minWholesaleQty') as string) : 10,
      stock: parseInt(formData.get('stock') as string) || 0,
      categoryId: formData.get('categoryId') as string,
      isActive: formData.get('isActive') === 'on',
      isFeatured: formData.get('isFeatured') === 'on',
      tags: JSON.stringify(((formData.get('tags') as string) || '').split(',').map(t => t.trim()).filter(Boolean)),
      images: JSON.stringify(formImages),
    }

    await db.product.update({ where: { id }, data })
    revalidatePath('/admin/products')
    revalidatePath('/products')
    revalidatePath(`/product/${id}`)
    redirect('/admin/products')
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">تعديل المنتج</h1>
        <p className="text-gray-500 mt-1">تحديث السعر والمخزون والصور دون فقدان أي بيانات</p>
      </div>

      <form action={updateProduct} className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">معلومات أساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">الاسم (إنجليزي)</label>
              <input name="name" defaultValue={product.name} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">الاسم (عربي)</label>
              <input name="nameAr" defaultValue={product.nameAr} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">الوصف (عربي)</label>
            <textarea name="descriptionAr" defaultValue={product.descriptionAr || ''} rows={4} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">التسعير والمخزون</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">السعر (₪)</label>
              <input name="price" type="number" step="0.01" defaultValue={product.price} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">سعر الجملة (₪)</label>
              <input name="wholesalePrice" type="number" step="0.01" defaultValue={product.wholesalePrice || ''} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">الحد الأدنى للجملة</label>
              <input name="minWholesaleQty" type="number" defaultValue={product.minWholesaleQty || 10} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">المخزون</label>
              <input name="stock" type="number" defaultValue={product.stock} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">القسم</label>
              <select name="categoryId" defaultValue={product.categoryId} required className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500">
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.nameAr}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">صور المنتج المرفوعة</h2>
          <ImageUpload existingImages={images} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">تاغات وخيارات العرض</h2>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">تاغات (مفصولة بفواصل)</label>
            <input name="tags" defaultValue={tags.join(', ')} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div className="flex gap-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isActive" defaultChecked={product.isActive} className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500" />
              <span className="text-sm font-medium text-gray-700">نشط</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500" />
              <span className="text-sm font-medium text-gray-700">منتج مميز</span>
            </label>
          </div>
        </div>

        <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/25 transition-all">
          حفظ التعديلات والتحديث
        </button>
      </form>
    </div>
  )
}
