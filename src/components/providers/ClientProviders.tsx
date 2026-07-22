'use client'

import { CartProvider } from '@/components/shop/CartContext'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { ReactNode } from 'react'

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  )
}
