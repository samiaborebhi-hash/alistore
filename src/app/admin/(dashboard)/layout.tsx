import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Store, ChevronLeft, Tag, Menu, FileText, UserCog } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'admin') redirect('/admin/login')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-rose-500 rounded-xl flex items-center justify-center">
            <Store size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800">لوحة التحكم</h1>
            <p className="text-xs text-gray-400">متجر التجميل</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-purple-600 flex items-center gap-1 transition-colors">
            <ChevronLeft size={16} /> زيارة المتجر
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">{session.user?.name || 'مدير النظام'}</p>
              <p className="text-xs text-gray-400">{session.user?.email}</p>
            </div>
            <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-purple-600">م</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed top-16 right-0 bottom-0 w-64 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">القائمة الرئيسية</p>
          <nav className="space-y-1">
            {[
              { href: '/admin', label: 'الرئيسية', icon: LayoutDashboard, color: 'text-purple-600', bg: 'bg-purple-50' },
              { href: '/admin/products', label: 'المنتجات', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
              { href: '/admin/orders', label: 'الطلبات', icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
              { href: '/admin/promotions', label: 'العروض', icon: Tag, color: 'text-rose-600', bg: 'bg-rose-50' },
              { href: '/admin/menus', label: 'القوائم', icon: Menu, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { href: '/admin/pages', label: 'الصفحات', icon: FileText, color: 'text-teal-600', bg: 'bg-teal-50' },
              { href: '/admin/settings', label: 'الإعدادات', icon: Settings, color: 'text-orange-600', bg: 'bg-orange-50' },
              { href: '/admin/account', label: 'الحساب', icon: UserCog, color: 'text-cyan-600', bg: 'bg-cyan-50' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  item.href === '/admin' ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg} transition-colors`}>
                  <item.icon size={18} className={item.color} />
                </div>
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <form action={async () => { 'use server'; const { signOut } = await import('@/lib/auth'); await signOut() }}>
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
              <LogOut size={18} />
              <span className="font-medium text-sm">تسجيل الخروج</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-16 pr-64 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
