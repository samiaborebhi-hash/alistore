import { db } from '@/lib/db'
import { revalidatePath, revalidateTag } from 'next/cache'
import { Plus, Pencil, Trash2, FileText, Globe, Check, Eye } from 'lucide-react'
import Link from 'next/link'

export default async function AdminPages({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams
  const pages = await db.page.findMany({ orderBy: { createdAt: 'desc' } })
  const pageToEdit = edit ? pages.find((p) => p.id === edit) : null

  async function createPage(formData: FormData) {
    'use server'
    const slug = (formData.get('slug') as string).trim().toLowerCase().replace(/\s+/g, '-')
    await db.page.create({
      data: {
        slug,
        title: formData.get('title') as string,
        titleAr: (formData.get('titleAr') as string) || null,
        content: formData.get('content') as string,
        contentType: (formData.get('contentType') as string) || 'text',
        isActive: formData.get('isActive') === 'on',
        showInFooter: formData.get('showInFooter') === 'on',
        footerLabel: (formData.get('footerLabel') as string) || null,
        order: parseInt(formData.get('order') as string) || 0,
      },
    })
    revalidateTag('pages')
    revalidatePath('/admin/pages')
    revalidatePath('/')
  }

  async function updatePage(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const slug = (formData.get('slug') as string).trim().toLowerCase().replace(/\s+/g, '-')
    await db.page.update({
      where: { id },
      data: {
        slug,
        title: formData.get('title') as string,
        titleAr: (formData.get('titleAr') as string) || null,
        content: formData.get('content') as string,
        contentType: (formData.get('contentType') as string) || 'text',
        isActive: formData.get('isActive') === 'on',
        showInFooter: formData.get('showInFooter') === 'on',
        footerLabel: (formData.get('footerLabel') as string) || null,
        order: parseInt(formData.get('order') as string) || 0,
      },
    })
    revalidateTag('pages')
    revalidatePath('/admin/pages')
    revalidatePath('/')
  }

  async function deletePage(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await db.page.delete({ where: { id } })
    revalidateTag('pages')
    revalidatePath('/admin/pages')
    revalidatePath('/')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الصفحات</h1>
          <p className="text-gray-500 mt-1">إنشاء وتعديل صفحات الموقع (سياسة الخصوصية، الشروط، إلخ)</p>
        </div>
        {pageToEdit && (
          <Link href="/admin/pages" className="btn-secondary text-sm px-4 inline-flex items-center gap-2 self-start">
            إلغاء التعديل
          </Link>
        )}
      </div>

      {/* Form */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            {pageToEdit ? <Pencil size={20} className="text-purple-600" /> : <Plus size={20} className="text-purple-600" />}
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{pageToEdit ? 'تعديل الصفحة' : 'إضافة صفحة جديدة'}</h2>
        </div>

        <form action={pageToEdit ? updatePage : createPage} className="space-y-4">
          {pageToEdit && <input type="hidden" name="id" value={pageToEdit.id} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العنوان (عربي)</label>
              <input
                name="titleAr"
                defaultValue={pageToEdit?.titleAr || ''}
                required
                className="input-field"
                placeholder="مثال: سياسة الخصوصية"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العنوان (إنجليزي)</label>
              <input
                name="title"
                defaultValue={pageToEdit?.title || ''}
                required
                className="input-field"
                dir="ltr"
                placeholder="Privacy Policy"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الرابط (slug)</label>
              <div className="relative">
                <Globe size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="slug"
                  defaultValue={pageToEdit?.slug || ''}
                  required
                  className="input-field pr-10"
                  dir="ltr"
                  placeholder="privacy-policy"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">الصفحة ستكون متاحة على /page/privacy-policy</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع المحتوى</label>
              <select name="contentType" defaultValue={pageToEdit?.contentType || 'text'} className="input-field">
                <option value="text">نص عادي</option>
                <option value="html">HTML</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الترتيب في الفوتر</label>
              <input
                name="order"
                type="number"
                defaultValue={pageToEdit?.order || 0}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                id="isActive"
                type="checkbox"
                name="isActive"
                defaultChecked={pageToEdit ? pageToEdit.isActive : true}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">الصفحة نشطة</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="showInFooter"
                type="checkbox"
                name="showInFooter"
                defaultChecked={pageToEdit ? pageToEdit.showInFooter : true}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="showInFooter" className="text-sm text-gray-700">إظهار في الفوتر</label>
            </div>
          </div>

          {pageToEdit?.showInFooter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم الرابط في الفوتر</label>
              <input
                name="footerLabel"
                defaultValue={pageToEdit?.footerLabel || ''}
                className="input-field"
                placeholder="سياسة الخصوصية"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المحتوى</label>
            <textarea
              name="content"
              rows={12}
              defaultValue={pageToEdit?.content || ''}
              className="input-field font-mono text-sm"
              placeholder={pageToEdit?.contentType === 'html' ? '<p>اكتب HTML هنا...</p>' : 'اكتب محتوى الصفحة هنا...'}
            />
            <p className="text-xs text-gray-400 mt-1">إذا اخترت HTML، يمكنك إضافة أكواد HTML كاملة.</p>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary inline-flex items-center gap-2">
              {pageToEdit ? <><Pencil size={18} /> تحديث الصفحة</> : <><Plus size={18} /> إنشاء الصفحة</>}
            </button>
          </div>
        </form>
      </div>

      {/* Pages List */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <FileText size={20} className="text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">الصفحات الحالية</h2>
        </div>

        {pages.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">لا توجد صفحات بعد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-right py-3 px-4 font-medium text-gray-500">الصفحة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">الرابط</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">النوع</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">الحالة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">الفوتر</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-gray-800">{page.titleAr || page.title}</td>
                    <td className="py-3 px-4 text-gray-600" dir="ltr">
                      /page/{page.slug}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium border border-gray-200">
                        {page.contentType === 'html' ? 'HTML' : 'نص'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${page.isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {page.isActive ? <><Check size={12} /> نشطة</> : 'معطلة'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {page.showInFooter ? (
                        <span className="text-green-600 text-xs">نعم {page.footerLabel ? `(${page.footerLabel})` : ''}</span>
                      ) : (
                        <span className="text-gray-400 text-xs">لا</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/page/${page.slug}`}
                          target="_blank"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="عرض"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/admin/pages?edit=${page.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Pencil size={16} />
                        </Link>
                        <form action={deletePage}>
                          <input type="hidden" name="id" value={page.id} />
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
