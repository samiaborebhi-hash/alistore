import { db } from '@/lib/db'
import { revalidatePath, revalidateTag } from 'next/cache'
import { Save, Store, Phone, FileText, Mail, MapPin, Globe, ImageIcon } from 'lucide-react'

export default async function AdminSettings() {
  const settings = await db.siteSettings.findUnique({ where: { id: 'main' } })

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">الإعدادات</h1>
        <p className="text-gray-500 mt-1">تخصيص إعدادات المتجر العامة</p>
      </div>

      <form action={async (formData: FormData) => {
        'use server'
        await db.siteSettings.upsert({
          where: { id: 'main' },
          update: {
            siteName: formData.get('siteName') as string,
            siteNameEn: formData.get('siteNameEn') as string,
            whatsappNumber: formData.get('whatsappNumber') as string,
            email: (formData.get('email') as string) || null,
            address: (formData.get('address') as string) || null,
            instagramUrl: (formData.get('instagramUrl') as string) || null,
            logoUrl: (formData.get('logoUrl') as string) || null,
            aboutTextAr: (formData.get('aboutTextAr') as string) || null,
          },
          create: {
            id: 'main',
            siteName: formData.get('siteName') as string,
            siteNameEn: formData.get('siteNameEn') as string,
            whatsappNumber: formData.get('whatsappNumber') as string,
            email: (formData.get('email') as string) || null,
            address: (formData.get('address') as string) || null,
            instagramUrl: (formData.get('instagramUrl') as string) || null,
            logoUrl: (formData.get('logoUrl') as string) || null,
            aboutTextAr: (formData.get('aboutTextAr') as string) || null,
          },
        })
        revalidateTag('site-settings')
        revalidatePath('/')
        revalidatePath('/admin/settings')
      }} className="space-y-6">
        {/* Store Info */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Store size={20} className="text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">معلومات المتجر</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم المتجر (عربي)</label>
              <input name="siteName" defaultValue={settings?.siteName || 'متجر التجميل'} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم المتجر (إنجليزي)</label>
              <input name="siteNameEn" defaultValue={settings?.siteNameEn || 'Beauty Store'} required className="input-field" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">رابط شعار المتجر</label>
            <div className="relative">
              <ImageIcon size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input name="logoUrl" defaultValue={settings?.logoUrl || ''} className="input-field pr-10" dir="ltr" placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Phone size={20} className="text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">بيانات التواصل</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رقم الواتساب (مع مفتاح الدولة)</label>
              <div className="relative">
                <Phone size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="whatsappNumber" defaultValue={settings?.whatsappNumber || '966500000000'} required className="input-field pr-10" dir="ltr" placeholder="966500000000" />
              </div>
              <p className="text-xs text-gray-400 mt-1">مثال: 966500000000</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="email" type="email" defaultValue={settings?.email || ''} className="input-field pr-10" dir="ltr" placeholder="info@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رابط إنستقرام</label>
              <div className="relative">
                <Globe size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="instagramUrl" defaultValue={settings?.instagramUrl || ''} className="input-field pr-10" dir="ltr" placeholder="https://instagram.com/..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
              <div className="relative">
                <MapPin size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="address" defaultValue={settings?.address || ''} className="input-field pr-10" placeholder="عنوان المتجر" />
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <FileText size={20} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">عن المتجر</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نص تعريفي عن المتجر (عربي)</label>
            <textarea name="aboutTextAr" defaultValue={settings?.aboutTextAr || ''} rows={5} className="input-field" placeholder="اكتب نبذة عن متجرك..." />
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button type="submit" className="btn-primary inline-flex items-center gap-2">
            <Save size={18} /> حفظ الإعدادات
          </button>
        </div>
      </form>
    </div>
  )
}
