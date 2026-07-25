'use client'

import { CartProvider } from '@/components/shop/CartContext'
import { WishlistProvider } from '@/components/shop/WishlistContext'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { ReactNode } from 'react'

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
        <CartDrawer />
      </WishlistProvider>
    </CartProvider>
  )
}
