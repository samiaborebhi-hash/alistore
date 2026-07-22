import { db } from '@/lib/db'
import { getActivePromotions, getDiscountPercent } from '@/lib/site-data'
import { CinematicSection } from '@/components/shop/CinematicSection'
import { CinematicProductCard } from '@/components/shop/CinematicProductCard'

export default async function MenPage() {
  const [category, products, promotions] = await Promise.all([
    db.category.findUnique({ where: { slug: 'men' } }),
    db.product.findMany({
      where: { isActive: true, categoryId: (await db.category.findUnique({ where: { slug: 'men' } }))?.id },
      include: { category: true, reviews: { select: { rating: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    getActivePromotions(),
  ])

  if (!category) {
    return (
      <div className="pt-24">
        <CinematicSection title="منتجات رجالية" subtitle="أفضل منتجات العناية والتجميل للرجال" variant={0}>
          <p className="text-center text-gray-500 py-12">لا يوجد قسم رجالي حالياً</p>
        </CinematicSection>
      </div>
    )
  }

  return (
    <div className="pt-24">
      <CinematicSection title="منتجات رجالية" subtitle="أفضل منتجات العناية والتجميل للرجال" variant={0}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <CinematicProductCard
              key={p.id}
              product={p}
              index={i}
              discountPercent={getDiscountPercent(promotions, p.id)}
            />
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-center text-gray-500 py-12">لا توجد منتجات في هذا القسم حالياً</p>
        )}
      </CinematicSection>
    </div>
  )
}
