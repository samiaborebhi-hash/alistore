import { db } from '@/lib/db'
import { CinematicHero } from '@/components/shop/CinematicHero'
import { PromotionalBanner } from '@/components/shop/PromotionalBanner'
import { CinematicSection } from '@/components/shop/CinematicSection'
import { CinematicProductCard } from '@/components/shop/CinematicProductCard'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const products = await db.product.findMany({
    where: { isActive: true },
    include: { category: true, reviews: { select: { rating: true } } },
    take: 8,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <CinematicHero />

      <PromotionalBanner />

      <CinematicSection title="منتجات مميزة" subtitle="أفضل منتجات التجميل المختارة بعناية" variant={0}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <CinematicProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-center text-gray-500">لا توجد منتجات مميزة حالياً</p>
        )}
      </CinematicSection>

      <CinematicSection title="تسوق حسب القسم" subtitle="اختر القسم المناسب لك" variant={1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link href="/men" className="group relative h-64 rounded-2xl overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-3xl font-bold text-white group-hover:scale-110 transition-transform">رجالي</h3>
            </div>
          </Link>
          <Link href="/women" className="group relative h-64 rounded-2xl overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-rose-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-3xl font-bold text-white group-hover:scale-110 transition-transform">نسائي</h3>
            </div>
          </Link>
        </div>
      </CinematicSection>

      <CinematicSection title="البيع بالجملة" subtitle="أسعار خاصة للكميات الكبيرة" variant={2}>
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            نوفر أسعار جملة تنافسية للمحلات والموزعين. الحد الأدنى للطلب 10 قطع.
          </p>
          <Link href="/wholesale" className="inline-flex px-8 py-4 bg-gradient-to-r from-purple-600 to-rose-500 text-white rounded-full text-lg font-semibold hover:shadow-xl transition-shadow">
            تصفح عروض الجملة
          </Link>
        </div>
      </CinematicSection>
    </>
  )
}
