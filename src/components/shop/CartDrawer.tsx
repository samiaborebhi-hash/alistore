'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react'
import { useCart } from './CartContext'
import { formatPrice, whatsappLink } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, totalItems, total, totalDiscount, subtotal } = useCart()
  const [whatsapp, setWhatsapp] = useState(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966500000000')

  useEffect(() => {
    if (!isOpen) return
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.whatsappNumber) setWhatsapp(data.whatsappNumber)
      })
      .catch(() => {
        // keep fallback
      })
  }, [isOpen])

  const checkoutMessage = () => {
    if (items.length === 0) return ''
    const lines = items.map((item) =>
      `- ${item.nameAr} | ${formatPrice(item.price)} × ${item.quantity}`
    )
    return `مرحباً، أريد طلب:
${lines.join('\n')}

المجموع: ${formatPrice(total)}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-purple-600" size={22} />
                <h2 className="text-lg font-bold text-gray-800">السلة ({totalItems})</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="إغلاق">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={32} className="text-purple-300" />
                  </div>
                  <p className="text-gray-500 text-lg">السلة فارغة</p>
                  <p className="text-gray-400 text-sm mt-1">أضف بعض المنتجات للبدء</p>
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                  >
                    تصفح المنتجات
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.productId} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-white">
                      {item.image ? (
                        <Image src={item.image} alt={item.nameAr} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">🛍️</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.productId}`}
                        onClick={() => setIsOpen(false)}
                        className="font-semibold text-gray-800 line-clamp-1 hover:text-purple-600 transition-colors"
                      >
                        {item.nameAr}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-purple-600">{formatPrice(item.price)}</span>
                        {item.discountPercent > 0 && (
                          <span className="text-xs text-gray-400 line-through">{formatPrice(item.originalPrice)}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                            aria-label="تقليل"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors"
                            aria-label="زيادة"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          aria-label="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 space-y-3">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>المجموع الفرعي</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>الخصم</span>
                      <span>-{formatPrice(totalDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                    <span>الإجمالي</span>
                    <span className="text-purple-600">{formatPrice(total)}</span>
                  </div>
                </div>

                <a
                  href={whatsappLink(whatsapp, checkoutMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-500/25 transition-shadow"
                >
                  <MessageCircle size={20} />
                  إتمام الطلب عبر واتساب
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
