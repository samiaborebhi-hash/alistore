'use client'

import { useWishlist } from './WishlistContext'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from './CartContext'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice } from '@/lib/utils'

export function WishlistPage() {
  const { items, removeItem, clear } = useWishlist()
  const { addItem } = useCart()

  return (
    <div className="pt-20 md:pt-28 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">المفضلة</h1>
            <p className="text-gray-500">{items.length} منتج محفوظ</p>
          </div>
          {items.length > 0 && (
            <button onClick={clear} className="text-sm text-red-400 hover:text-red-600 flex items-center gap-1">
              <Trash2 size={14} /> مسح الكل
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-rose-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">المفضلة فارغة</h2>
            <p className="text-gray-400 mb-8">أضف منتجات إلى المفضلة لتجدها هنا لاحقاً</p>
            <Link href="/products" className="btn-primary">تصفح المنتجات</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all"
                >
                  <Link href={`/product/${item.id}`} className="block relative aspect-square bg-gray-50">
                    {item.image ? (
                      <Image src={item.image} alt={item.nameAr} fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-4xl">🛍️</div>
                    )}
                  </Link>
                  <div className="p-4">
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-semibold text-gray-800 mb-1 hover:text-purple-600 line-clamp-1">{item.nameAr}</h3>
                    </Link>
                    <p className="text-purple-600 font-bold mb-3">{formatPrice(item.price)}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addItem({ productId: item.id, name: item.nameAr, nameAr: item.nameAr, price: item.price, originalPrice: item.price, discountPercent: 0, image: item.image })}
                        className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-rose-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1"
                      >
                        <ShoppingBag size={14} /> سلة
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 border border-gray-200 rounded-xl transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
