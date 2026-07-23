import Link from 'next/link'
import { getMenuItems, getSiteSettings } from '@/lib/site-data'
import { CartButton } from '@/components/shop/CartButton'
import { ClientHeader } from './ClientHeader'

export async function Header() {
  const [settings, menuItems] = await Promise.all([getSiteSettings(), getMenuItems('header')])

  const headerMenu = menuItems.length > 0 ? menuItems : [
    { id: '1', label: 'الرئيسية', url: '/', position: 'header', order: 0 },
    { id: '2', label: 'المنتجات', url: '/products', position: 'header', order: 1 },
    { id: '3', label: 'الجملة', url: '/wholesale', position: 'header', order: 2 },
  ]

  return (
    <ClientHeader
      siteName={settings.siteName}
      whatsappNumber={settings.whatsappNumber}
      menuItems={headerMenu}
    >
      <CartButton />
    </ClientHeader>
  )
}
