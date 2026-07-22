import { db } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await db.product.findUnique({ where: { id } })
  if (!product) notFound()
  const categories = await db.category.findMany()
  const tags = JSON.parse(product.tags || '[]')
  const images = JSON.parse(product.images || '[]')

  async function updateProduct(formData: FormData) {
    'use server'
    const data = {
      name: formData.get('name') as string,
      nameAr: formData.get('nameAr') as string,
      description: formData.get('description') as string || null,
      descriptionAr: formData.get('descriptionAr') as string || null,
      price: parseFloat(formData.get('price') as string),
      wholesalePrice: formData.get('wholesalePrice') ? parseFloat(formData.get('wholesalePrice') as string) : null,
      minWholesaleQty: formData.get('minWholesaleQty') ? parseInt(formData.get('minWholesaleQty') as string) : 10,
      stock: parseInt(formData.get('stock') as string) || 0,
      categoryId: formData.get('categoryId') as string,
      isActive: formData.get('isActive') === 'on',
      isFeatured: formData.get('isFeatured') === 'on',
      tags: JSON.stringify((formData.get('tags') as string || '').split(',').map(t => t.trim()).filter(Boolean)),
      images: JSON.stringify([formData.get('imageUrl') as string].filter(Boolean)),
    }
    await db.product.update({ where: { id }, data })
    revalidatePath('/admin/products')
    redirect('/admin/products')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">تعديل المنتج</h1>
      <form action={updateProduct} className="bg-white rounded-xl p-6 shadow-sm space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">الاسم (إنجليزي)</label><input name="name" defaultValue={product.name} required className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500" /></div>
          <div><label className="block text-sm font-medium mb-1">الاسم (عربي)</label><input name="nameAr" defaultValue={product.nameAr} required className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">الوصف (عربي)</label><textarea name="descriptionAr" defaultValue={product.descriptionAr || ''} rows={3} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500" /></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-1">السعر (ر.س)</label><input name="price" type="number" step="0.01" defaultValue={product.price} required className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500" /></div>
          <div><label className="block text-sm font-medium mb-1">سعر الجملة</label><input name="wholesalePrice" type="number" step="0.01" defaultValue={product.wholesalePrice || ''} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500" /></div>
          <div><label className="block text-sm font-medium mb-1">الحد الأدنى للجملة</label><input name="minWholesaleQty" type="number" defaultValue={product.minWholesaleQty || 10} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">المخزون</label><input name="stock" type="number" defaultValue={product.stock} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500" /></div>
          <div><label className="block text-sm font-medium mb-1">القسم</label><select name="categoryId" defaultValue={product.categoryId} required className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500">{categories.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}</select></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">رابط الصورة</label><input name="imageUrl" type="url" defaultValue={images[0] || ''} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500" /></div>
        <div><label className="block text-sm font-medium mb-1">تاغات</label><input name="tags" defaultValue={tags.join(', ')} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500" /></div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2"><input type="checkbox" name="isActive" defaultChecked={product.isActive} className="w-4 h-4" /><span>نشط</span></label>
          <label className="flex items-center gap-2"><input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} className="w-4 h-4" /><span>منتج مميز</span></label>
        </div>
        <button type="submit" className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">تحديث المنتج</button>
      </form>
    </div>
  )
}
