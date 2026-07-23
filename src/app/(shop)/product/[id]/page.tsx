import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { ProductImageGallery } from '@/components/shop/ProductImageGallery'
import { StarRating } from '@/components/ui/StarRating'
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { QuantityBreaksWidget } from '@/components/shop/QuantityBreaksWidget'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await db.product.findUnique({
    where: { id },
    include: { category: true, reviews: { orderBy: { createdAt: 'desc' } } },
  })
  if (!product) notFound()

  const images: string[] = JSON.parse(product.images || '[]')
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966500000000'
  const tags: string[] = JSON.parse(product.tags || '[]')
  const quantityBreaks: any[] = JSON.parse(product.quantityBreaks || '[]')
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0
  const discountPercent = product.wholesalePrice && product.wholesalePrice < product.price
    ? Math.round(((product.price - product.wholesalePrice) / product.price) * 100)
    : 0

  return (
    <div className="pt-20 md:pt-28 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-purple-600 transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link href={`/${product.category.slug || '#'}`} className="hover:text-purple-600 transition-colors">{product.category.nameAr}</Link>
          <span>/</span>
          <span className="text-gray-700 line-clamp-1">{product.nameAr}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="md:sticky md:top-28 self-start">
            <ProductImageGallery images={images} name={product.nameAr} />
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 text-sm font-medium rounded-full mb-3">{product.category.nameAr}</span>
              <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold text-gray-800 leading-tight">{product.nameAr}</h1>
              <p className="text-gray-400 text-sm mt-2">{product.name}</p>
            </div>

            {/* Rating */}
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <StarRating rating={Math.round(avgRating)} size={18} />
                <span className="text-sm font-bold text-amber-500">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({product.reviews.length} تقييم)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
              <span className="text-3xl sm:text-4xl font-bold text-purple-600">{formatPrice(product.price)}</span>
              {discountPercent > 0 && (
                <span className="px-3 py-1 bg-rose-500 text-white text-sm font-bold rounded-full">وفر {discountPercent}%</span>
              )}
            </div>

            {product.wholesalePrice && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-green-800 font-bold">سعر الجملة</span>
                  <span className="text-xl font-bold text-green-700">{formatPrice(product.wholesalePrice)}</span>
                </div>
                <p className="text-green-600 text-sm">الحد الأدنى للطلب: {product.minWholesaleQty} قطع</p>
              </div>
            )}

            {product.descriptionAr && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-2">الوصف</h3>
                <p className="text-gray-600 leading-relaxed">{product.descriptionAr}</p>
              </div>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm border border-purple-100">{tag}</span>
                ))}
              </div>
            )}

            {product.enableQuantityBreaks && quantityBreaks.length > 0 && (
              <QuantityBreaksWidget
                breaks={quantityBreaks}
                basePrice={product.price}
                onApply={(qty, finalPrice, brk) => {
                  // This will be handled by AddToCartButton's internal state
                }}
              />
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <AddToCartButton
                product={{
                  id: product.id,
                  nameAr: product.nameAr,
                  price: product.price,
                  originalPrice: product.price,
                  discountPercent,
                  image: images[0] || '',
                }}
              />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 md:mt-24 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">التقييمات والمراجعات</h2>
            {product.reviews.length > 0 && (
              <div className="flex items-center justify-center gap-2">
                <StarRating rating={Math.round(avgRating)} size={18} />
                <span className="font-bold text-amber-500">{avgRating.toFixed(1)}</span>
                <span className="text-gray-400">من {product.reviews.length} تقييم</span>
              </div>
            )}
          </div>

          <form
            action={async (formData: FormData) => {
              'use server'
              const name = formData.get('name') as string
              const rating = parseInt(formData.get('rating') as string)
              const comment = formData.get('comment') as string
              if (name && rating && comment) {
                await db.review.create({ data: { productId: id, name, rating, comment } })
                revalidatePath(`/product/${id}`)
              }
            }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-10"
          >
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm">✍️</span>
              أضف تقييمك
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <input name="name" required placeholder="اسمك" className="input-field" />
              <select name="rating" required defaultValue="5" className="input-field">
                <option value="5">⭐⭐⭐⭐⭐ - ممتاز</option>
                <option value="4">⭐⭐⭐⭐ - جيد جداً</option>
                <option value="3">⭐⭐⭐ - جيد</option>
                <option value="2">⭐⭐ - مقبول</option>
                <option value="1">⭐ - ضعيف</option>
              </select>
            </div>
            <textarea name="comment" required placeholder="اكتب تعليقك..." rows={4} className="input-field mb-4" />
            <button type="submit" className="btn-primary w-full sm:w-auto justify-center">إرسال التقييم</button>
          </form>

          {product.reviews.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white rounded-2xl border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarRating rating={0} size={28} />
              </div>
              <p className="text-gray-500 text-lg">لا توجد تقييمات بعد.</p>
              <p className="text-gray-400 text-sm mt-1">كن أول من يقيم هذا المنتج!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-purple-100 to-rose-100 rounded-full flex items-center justify-center">
                        <span className="text-base font-bold text-purple-600">{review.name[0]}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800 block">{review.name}</span>
                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size={14} showValue />
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-3">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
