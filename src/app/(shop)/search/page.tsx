import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { SearchBox } from '@/components/shop/SearchBox'
import { CinematicProductCard } from '@/components/shop/CinematicProductCard'
import { Search } from 'lucide-react'
import Link from 'next/link'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `نتائج البحث: "${q}"` : 'بحث المنتجات',
    description: q ? `نتائج البحث عن "${q}" في متجر نوفا بيور` : 'ابحث عن منتجات التجميل',
  }
}

export const dynamic = 'force-dynamic'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const query = q?.trim() || ''

  const products = query.length >= 2
    ? await db.product.findMany({
        where: {
          isActive: true,
          OR: [
            { nameAr: { contains: query, mode: 'insensitive' } },
            { name: { contains: query, mode: 'insensitive' } },
            { descriptionAr: { contains: query, mode: 'insensitive' } },
            { tags: { contains: query, mode: 'insensitive' } },
          ],
        },
        include: { category: true, reviews: { select: { rating: true } } },
        orderBy: { isFeatured: 'desc' },
        take: 40,
      })
    : []

  return (
    <div className="pt-20 md:pt-28 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {query ? `نتائج: "${query}"` : 'بحث المنتجات'}
          </h1>
          <SearchBox initialQuery={query} />
        </div>

        {/* Results */}
        {!query ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-purple-400" />
            </div>
            <p className="text-gray-500 text-lg">ابحث عن أي منتج...</p>
            <p className="text-gray-400 text-sm mt-2">اكتب اسم المنتج أو وصفه</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-600 text-lg font-medium">لا توجد نتائج لـ "{query}"</p>
            <p className="text-gray-400 text-sm mt-2 mb-6">جرب كلمات مختلفة أو تصفح المنتجات</p>
            <Link href="/products" className="btn-primary">
              تصفح كل المنتجات
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-6 text-center">
              تم العثور على <span className="font-bold text-purple-600">{products.length}</span> نتيجة
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p, i) => (
                <CinematicProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
