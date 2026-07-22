import { db } from '@/lib/db'
import { getActivePromotions, getDiscountPercent } from '@/lib/site-data'
import { CinematicSection } from '@/components/shop/CinematicSection'
import { CinematicProductCard } from '@/components/shop/CinematicProductCard'

export default async function WomenPage() {
  const [category, products, promotions] = await Promise.all([
    db.category.findUnique({ where: { slug: 'women' } }),
    db.product.findMany({
      where: { isActive: true, categoryId: (await db.category.findUnique({ where: { slug: 'women' } }))?.id },
      include: { category: true, reviews: { select: { rating: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    getActivePromotions(),
  ])

  return (
    <div className="pt-24">
      <CinematicSection title="منتجات نسائية" subtitle="أفضل منتجات العناية والتجميل للنساء" variant={1}>
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
