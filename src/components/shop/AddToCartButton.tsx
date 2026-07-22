'use client'

import { useState } from 'react'
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react'
import { useCart } from './CartContext'

interface AddToCartButtonProps {
  product: {
    id: string
    nameAr: string
    price: number
    originalPrice: number
    discountPercent: number
    image: string
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.nameAr,
      nameAr: product.nameAr,
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercent: product.discountPercent,
      image: product.image,
    }, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-gray-600 font-medium">الكمية:</span>
        <div className="flex items-center bg-white border border-gray-200 rounded-xl">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-3 hover:bg-gray-100 rounded-r-xl transition-colors"
            aria-label="تقليل"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-bold">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="p-3 hover:bg-gray-100 rounded-l-xl transition-colors"
            aria-label="زيادة"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <button
        onClick={handleAdd}
        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
          added
            ? 'bg-green-500 text-white'
            : 'bg-gradient-to-r from-purple-600 to-rose-500 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5'
        }`}
      >
        {added ? <><Check size={22} /> تمت الإضافة</> : <><ShoppingCart size={22} /> أضف للسلة</>}
      </button>
    </div>
  )
}
