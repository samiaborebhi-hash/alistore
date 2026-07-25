'use client'

import { Heart } from 'lucide-react'
import { useWishlist } from './WishlistContext'
import Link from 'next/link'

export function WishlistButton() {
  const { count } = useWishlist()
  return (
    <Link
      href="/wishlist"
      className="relative p-2 text-gray-600 hover:text-rose-500 transition-colors"
      aria-label="المفضلة"
    >
      <Heart size={22} className={count > 0 ? 'fill-rose-500 text-rose-500' : ''} />
      {count > 0 && (
        <span className="absolute -top-1 -left-1 w-4 h-4 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}
