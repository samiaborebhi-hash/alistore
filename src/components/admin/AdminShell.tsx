'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Store, ChevronLeft, Tag, Menu, FileText, UserCog, X, PenSquare } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'الرئيسية', icon: LayoutDashboard, color: 'text-purple-600', bg: 'bg-purple-50' },
  { href: '/admin/products', label: 'المنتجات', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
  { href: '/admin/orders', label: 'الطلبات', icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50' },
  { href: '/admin/promotions', label: 'العروض', icon: Tag, color: 'text-rose-600', bg: 'bg-rose-50' },
  { href: '/admin/menus', label: 'القوائم', icon: Menu, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { href: '/admin/pages', label: 'الصفحات', icon: FileText, color: 'text-teal-600', bg: 'bg-teal-50' },
  { href: '/admin/content', label: 'محتوى الصفحات', icon: PenSquare, color: 'text-pink-600', bg: 'bg-pink-50' },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings, color: 'text-orange-600', bg: 'bg-orange-50' },
  { href: '/admin/account', label: 'الحساب', icon: UserCog, color: 'text-cyan-600', bg: 'bg-cyan-50' },
]

export function AdminShell({ children, userName, userEmail }: { children: React.ReactNode; userName: string; userEmail?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="فتح القائمة"
          >
            <Menu size={22} className="text-gray-700" />
          </button>
          <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-rose-500 rounded-xl flex items-center justify-center">
            <Store size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-sm md:text-base">لوحة التحكم</h1>
            <p className="text-xs text-gray-400 hidden md:block">متجر التجميل</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-purple-600 flex items-center gap-1 transition-colors">
            <ChevronLeft size={16} /> <span className="hidden md:inline">زيارة المتجر</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-700">{userName}</p>
              <p className="text-xs text-gray-400">{userEmail}</p>
            </div>
            <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-purple-600">{userName?.charAt(0) || 'م'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 right-0 bottom-0 w-64 bg-white border-l border-gray-200 overflow-y-auto z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4">
          {/* Close button (mobile only) */}
          <div className="flex items-center justify-between mb-3 md:hidden">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">القائمة الرئيسية</p>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="إغلاق"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3 hidden md:block">القائمة الرئيسية</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                    isActive ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg} transition-colors shrink-0`}>
                    <item.icon size={18} className={item.color} />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          <button
            onClick={() => { window.location.href = '/api/auth/signout' }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-16 md:pr-64 min-h-screen">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}