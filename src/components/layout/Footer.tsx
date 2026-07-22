import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { whatsappLink } from '@/lib/utils'
import { getMenuItems, getPages, getSiteSettings } from '@/lib/site-data'

export async function Footer() {
  const [settings, footerMenu, cmsPages] = await Promise.all([
    getSiteSettings(),
    getMenuItems('footer'),
    getPages(),
  ])

  const phone = settings.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966500000000'
  const whatsapp = whatsappLink(phone, 'مرحباً، أريد الاستفسار عن منتجاتكم')

  const quickLinks = footerMenu.length > 0
    ? footerMenu
    : [
        { id: 'home', label: 'الرئيسية', url: '/', position: 'footer', order: 0 },
        { id: 'men', label: 'منتجات رجالية', url: '/men', position: 'footer', order: 1 },
        { id: 'women', label: 'منتجات نسائية', url: '/women', position: 'footer', order: 2 },
        { id: 'wholesale', label: 'البيع بالجملة', url: '/wholesale', position: 'footer', order: 3 },
      ]

  return (
    <footer className="relative bg-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%25" height="100%25" fill="url(%23dotPattern)" />
        </svg>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-rose-400 to-amber-400 bg-clip-text text-transparent mb-4">
                {settings.siteName}
              </h3>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6">
              {settings.aboutTextAr || 'منتجات تجميل أصلية رجالية ونسائية - جملة وتجزئة بأسعار مميزة وتوصيل سريع.'}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded-full flex items-center justify-center transition-all"
                aria-label="واتساب"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white rounded-full flex items-center justify-center transition-all"
                aria-label="انستقرام"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href={`tel:+${phone}`}
                className="w-10 h-10 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded-full flex items-center justify-center transition-all"
                aria-label="هاتف"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-white">روابط سريعة</h4>
            <ul className="space-y-3 text-gray-400">
              {quickLinks.map((link, i) => (
                <li key={link.id}>
                  <Link
                    href={link.url}
                    className={`hover:text-${['purple', 'rose', 'amber', 'green'][i % 4]}-400 transition-colors flex items-center gap-2`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-white">خدماتنا</h4>
            <ul className="space-y-3 text-gray-400">
              <li><span className="hover:text-purple-400 transition-colors">توصيل سريع</span></li>
              <li><span className="hover:text-purple-400 transition-colors">منتجات أصلية</span></li>
              <li><span className="hover:text-purple-400 transition-colors">أسعار الجملة</span></li>
              <li><span className="hover:text-purple-400 transition-colors">استشارات مجانية</span></li>
              <li><span className="hover:text-purple-400 transition-colors">ضمان الجودة</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-white">تواصل معنا</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-purple-400 shrink-0 mt-0.5" />
                <span>{settings.address || 'المملكة العربية السعودية'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-purple-400 shrink-0 mt-0.5" />
                <a href={`tel:+${phone}`} className="hover:text-purple-400 transition-colors" dir="ltr">+{phone}</a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={20} className="text-purple-400 shrink-0 mt-0.5" />
                <a href={`mailto:${settings.email || 'info@alipro.com'}`} className="hover:text-purple-400 transition-colors">{settings.email || 'info@alipro.com'}</a>
              </li>
            </ul>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
              تواصل عبر واتساب
            </a>
          </div>
        </div>

        <div className="relative border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
            <p>جميع الحقوق محفوظة © {new Date().getFullYear()} {settings.siteName}</p>
            <div className="flex items-center gap-6">
              <Link href="/admin/login" className="hover:text-purple-400 transition-colors">لوحة التحكم</Link>
              {cmsPages.filter((p) => p.showInFooter && p.isActive).map((page) => (
                <Link
                  key={page.id}
                  href={`/page/${page.slug}`}
                  className="hover:text-purple-400 transition-colors"
                >
                  {page.footerLabel || page.titleAr || page.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
