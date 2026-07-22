'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from './CartContext'

export function CartButton() {
  const { totalItems, setIsOpen } = useCart()

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors"
      aria-label="السلة"
    >
      <ShoppingCart size={22} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </button>
  )
}
