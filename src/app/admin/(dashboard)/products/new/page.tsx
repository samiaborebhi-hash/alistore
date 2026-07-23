import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { ImageUploadWrapper } from '@/components/admin/ImageUploadWrapper'
import { QuantityBreaksEditor } from '@/components/admin/QuantityBreaksEditor'

export default async function NewProductPage() {
  const categories = await db.category.findMany()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">إضافة منتج جديد</h1>
        <p className="text-gray-500 mt-1">أدخل بيانات المنتج الجديد</p>
      </div>

      <form
        action={async (formData: FormData) => {
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
            images: formData.get('images') as string || '[]',
            enableQuantityBreaks: formData.get('enableQuantityBreaks') === 'true',
            quantityBreaks: formData.get('quantityBreaks') as string || '[]',
          }
          await db.product.create({ data })
          revalidatePath('/admin/products')
          redirect('/admin/products')
        }}
        className="space-y-6"
      >
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">معلومات أساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">الاسم (إنجليزي)</label><input name="name" required className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">الاسم (عربي)</label><input name="nameAr" required className="input-field" /></div>
          </div>
          <div className="mt-4"><label className="block text-sm font-medium text-gray-700 mb-2">الوصف (عربي)</label><textarea name="descriptionAr" rows={4} className="input-field" /></div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">التسعير والمخزون</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">السعر (ر.س)</label><input name="price" type="number" step="0.01" required className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">سعر الجملة (اختياري)</label><input name="wholesalePrice" type="number" step="0.01" className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">الحد الأدنى للجملة</label><input name="minWholesaleQty" type="number" defaultValue={10} className="input-field" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">المخزون</label><input name="stock" type="number" defaultValue={0} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">القسم</label><select name="categoryId" required className="input-field">{categories.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}</select></div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">الصور</h2>
          <ImageUploadWrapper />
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">عروض الكميات والأسعار المتدرجة</h2>
          <QuantityBreaksEditor />
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">تصنيفات إضافية</h2>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">تاغات (مفصولة بفواصل)</label><input name="tags" placeholder="جديد, مميز, تخفيضات" className="input-field" /></div>
          <div className="flex gap-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isActive" defaultChecked className="w-4 h-4 rounded" /><span className="text-sm">نشط</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="isFeatured" className="w-4 h-4 rounded" /><span className="text-sm">منتج مميز</span></label>
          </div>
        </div>

        <button type="submit" className="btn-primary">حفظ المنتج</button>
      </form>
    </div>
  )
}
