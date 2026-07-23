import { db } from '@/lib/db'
import { ProductsGrid } from '@/components/shop/ProductsGrid'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: { isActive: true },
      include: { category: true, reviews: { select: { rating: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    db.category.findMany(),
  ])

  return (
    <div className="pt-20 md:pt-28 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-6 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">كل المنتجات</h1>
          <p className="text-gray-500">تصفح مجموعتنا الكاملة من منتجات التجميل</p>
        </div>
        <ProductsGrid products={JSON.parse(JSON.stringify(products))} categories={categories} />
      </div>
    </div>
  )
}