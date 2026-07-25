import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'المفضلة',
  description: 'منتجاتك المحفوظة في المفضلة',
}

import { WishlistPage } from '@/components/shop/WishlistPage'

export default function Wishlist() {
  return <WishlistPage />
}
