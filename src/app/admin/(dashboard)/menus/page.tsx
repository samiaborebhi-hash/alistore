import { db } from '@/lib/db'
import { revalidatePath, revalidateTag } from 'next/cache'
import { Plus, Pencil, Trash2, Link2, LayoutList, GripVertical } from 'lucide-react'

export default async function AdminMenus() {
  const allItems = await db.menuItem.findMany({ orderBy: [{ position: 'asc' }, { order: 'asc' }] })
  const grouped = allItems.reduce((acc, item) => {
    if (!acc[item.position]) acc[item.position] = []
    acc[item.position].push(item)
    return acc
  }, {} as Record<string, typeof allItems>)

  const positions = Object.keys(grouped).sort()

  async function createMenuItem(formData: FormData) {
    'use server'
    await db.menuItem.create({
      data: {
        label: formData.get('label') as string,
        labelAr: (formData.get('labelAr') as string) || null,
        url: formData.get('url') as string,
        position: (formData.get('position') as string).trim().toLowerCase(),
        order: parseInt(formData.get('order') as string) || 0,
      },
    })
    revalidateTag('menu-items')
    revalidatePath('/admin/menus')
  }

  async function updateMenuItem(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await db.menuItem.update({
      where: { id },
      data: {
        label: formData.get('label') as string,
        labelAr: (formData.get('labelAr') as string) || null,
        url: formData.get('url') as string,
        position: (formData.get('position') as string).trim().toLowerCase(),
        order: parseInt(formData.get('order') as string) || 0,
      },
    })
    revalidateTag('menu-items')
    revalidatePath('/admin/menus')
  }

  async function deleteMenuItem(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    await db.menuItem.delete({ where: { id } })
    revalidateTag('menu-items')
    revalidatePath('/admin/menus')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">إدارة القوائم</h1>
        <p className="text-gray-500 mt-1">إضافة وتعديل عناصر القوائم: الرأس، التذييل، القائمة الجانبية، أو أي موقع مخصص</p>
      </div>

      {/* Add Form */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <Plus size={20} className="text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">إضافة عنصر جديد</h2>
        </div>
        <form action={createMenuItem} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">التسمية (عربي)</label>
            <input name="labelAr" required className="input-field" placeholder="الرئيسية" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">التسمية (إنجليزي)</label>
            <input name="label" required className="input-field" dir="ltr" placeholder="Home" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">الرابط</label>
            <div className="relative">
              <Link2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input name="url" required className="input-field pr-10" dir="ltr" placeholder="/products" />
            </div>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">الموقع (header/footer/sidebar)</label>
            <input
              name="position"
              required
              className="input-field"
              dir="ltr"
              list="positions"
              defaultValue="header"
              placeholder="header"
            />
            <datalist id="positions">
              <option value="header"></option>
              <option value="footer"></option>
              <option value="sidebar"></option>
            </datalist>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">الترتيب</label>
            <input name="order" type="number" defaultValue={0} required className="input-field" />
          </div>
          <div className="md:col-span-6 flex justify-end">
            <button type="submit" className="btn-primary inline-flex items-center gap-2">
              <Plus size={18} /> إضافة العنصر
            </button>
          </div>
        </form>
      </div>

      {/* Dynamic Position Sections */}
      {positions.length === 0 ? (
        <div className="card text-center py-12">
          <LayoutList size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">لا توجد عناصر في القوائم بعد</p>
        </div>
      ) : (
        positions.map((position) => (
          <div key={position} className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <LayoutList size={20} className="text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">قائمة: {position}</h2>
            </div>
            <div className="space-y-3">
              {grouped[position].map((item) => (
                <MenuItemRow key={item.id} item={item} updateAction={updateMenuItem} deleteAction={deleteMenuItem} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function MenuItemRow({
  item,
  updateAction,
  deleteAction,
}: {
  item: { id: string; label: string; labelAr: string | null; url: string; position: string; order: number }
  updateAction: (formData: FormData) => void
  deleteAction: (formData: FormData) => void
}) {
  return (
    <form action={updateAction} className="flex flex-col md:flex-row gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 items-start md:items-center">
      <input type="hidden" name="id" value={item.id} />
      <GripVertical size={18} className="text-gray-300 hidden md:block" />
      <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-3 w-full">
        <div className="md:col-span-1">
          <label className="text-xs text-gray-500 mb-1 block">التسمية (عربي)</label>
          <input name="labelAr" defaultValue={item.labelAr || ''} required className="input-field text-sm" />
        </div>
        <div className="md:col-span-1">
          <label className="text-xs text-gray-500 mb-1 block">التسمية (إنجليزي)</label>
          <input name="label" defaultValue={item.label} required className="input-field text-sm" dir="ltr" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-gray-500 mb-1 block">الرابط</label>
          <input name="url" defaultValue={item.url} required className="input-field text-sm" dir="ltr" />
        </div>
        <div className="md:col-span-1">
          <label className="text-xs text-gray-500 mb-1 block">الموقع</label>
          <input
            name="position"
            defaultValue={item.position}
            required
            className="input-field text-sm"
            dir="ltr"
            list="positions"
          />
        </div>
        <div className="md:col-span-1">
          <label className="text-xs text-gray-500 mb-1 block">الترتيب</label>
          <input name="order" type="number" defaultValue={item.order} required className="input-field text-sm" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button type="submit" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="تحديث">
          <Pencil size={16} />
        </button>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={item.id} />
          <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
            <Trash2 size={16} />
          </button>
        </form>
      </div>
    </form>
  )
}
