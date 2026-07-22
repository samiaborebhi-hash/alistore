'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { StarRating } from '@/components/ui/StarRating'
import { useCart } from './CartContext'

interface Product {
  id: string; nameAr: string; price: number; wholesalePrice?: number | null
  images: string; category: { nameAr: string }; isFeatured: boolean; isNew?: boolean
  tags?: string
  reviews?: { rating: number }[]
}

export function CinematicProductCard({
  product,
  index,
  discountPercent = 0,
}: {
  product: Product
  index: number
  discountPercent?: number
}) {
  const [isLiked, setIsLiked] = useState(false)
  const { addItem } = useCart()
  const images = JSON.parse(product.images || '[]')
  const avgRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0

  const isNew = product.isNew || (typeof product.tags === 'string' ? product.tags.includes('جديد') : false)
  const hasWholesaleDiscount = product.wholesalePrice && product.wholesalePrice < product.price
  const hasPromo = discountPercent > 0

  const finalPrice = hasPromo
    ? Math.round(product.price * (1 - discountPercent / 100) * 100) / 100
    : product.price

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:border-purple-200 hover:-translate-y-1 transition-all duration-500"
    >
      {/* Image container - NOT a link wrapper */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-50 to-rose-50">
        <Link href={`/product/${product.id}`} className="block relative w-full h-full" aria-label={product.nameAr}>
          {images[0] ? (
            <Image src={images[0]} alt={product.nameAr} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300 text-4xl">🛍️</div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
          {isNew && (
            <div className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg shadow-green-500/20">
              جديد
            </div>
          )}
          {(hasPromo || hasWholesaleDiscount) && (
            <div className="bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg shadow-rose-500/20">
              {hasPromo ? `خصم ${discountPercent}%` : 'خصم'}
            </div>
          )}
          {product.isFeatured && !hasPromo && !isNew && (
            <div className="bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
              ⭐ مميز
            </div>
          )}
        </div>

        {/* Category badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm z-10 pointer-events-none">
          {product.category.nameAr}
        </div>

        {/* Action buttons - outside main link */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300 z-20">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked) }}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors ${isLiked ? 'bg-rose-500 text-white' : 'bg-white text-gray-600 hover:text-rose-500'}`}
            aria-label="المفضلة"
          >
            <Heart size={16} className={isLiked ? 'fill-current' : ''} />
          </button>
          <Link
            href={`/product/${product.id}`}
            className="w-9 h-9 rounded-full bg-white text-gray-600 hover:text-purple-600 flex items-center justify-center shadow-lg transition-colors"
            aria-label="عرض المنتج"
          >
            <Eye size={16} />
          </Link>
        </div>

        {/* Add to cart button - outside main link */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              addItem({
                productId: product.id,
                name: product.nameAr,
                nameAr: product.nameAr,
                price: finalPrice,
                originalPrice: product.price,
                discountPercent: hasPromo ? discountPercent : 0,
                image: images[0] || '',
              })
            }}
            className="block w-full py-3 bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white rounded-xl text-center font-semibold text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} /> أضف للسلة
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-800 mb-1.5 line-clamp-1 hover:text-purple-600 transition-colors">{product.nameAr}</h3>
        </Link>

        {avgRating > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <StarRating rating={avgRating} size={13} />
            <span className="text-xs text-gray-400">({product.reviews?.length || 0})</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-purple-600">{formatPrice(finalPrice)}</span>
            {hasPromo && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          {product.wholesalePrice && (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              جملة {formatPrice(product.wholesalePrice)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
