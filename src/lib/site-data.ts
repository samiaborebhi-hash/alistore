import { db } from '@/lib/db'
import { unstable_cache } from 'next/cache'

// Helper: safely query DB, return fallback if DB is unavailable (e.g. during build)
async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

export const getSiteSettings = unstable_cache(
  async () => {
    return safeQuery(
      async () => {
        const settings = await db.siteSettings.findUnique({ where: { id: 'main' } })
        return settings || {
          id: 'main',
          siteName: 'متجر التجميل',
          siteNameEn: 'Beauty Store',
          whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966500000000',
          email: 'info@alipro.com',
          address: 'المملكة العربية السعودية',
          currency: 'SAR',
          aboutTextAr: 'منتجات تجميل أصلية رجالية ونسائية - جملة وتجزئة',
          aboutText: 'Authentic beauty products for men and women.',
          logo: null,
          socialLinks: '{}',
          updatedAt: new Date(),
        }
      },
      {
        id: 'main',
        siteName: 'متجر التجميل',
        siteNameEn: 'Beauty Store',
        whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966500000000',
        email: 'info@alipro.com',
        address: 'المملكة العربية السعودية',
        currency: 'SAR',
        aboutTextAr: 'منتجات تجميل أصلية رجالية ونسائية - جملة وتجزئة',
        aboutText: 'Authentic beauty products for men and women.',
        logo: null,
        socialLinks: '{}',
        updatedAt: new Date(),
      }
    )
  },
  ['site-settings'],
  { revalidate: 3600, tags: ['site-settings'] }
)

export const getMenuItems = unstable_cache(
  async (position?: string) => {
    return safeQuery(
      async () => {
        const where = position ? { position } : {}
        return db.menuItem.findMany({
          where,
          orderBy: [{ position: 'asc' }, { order: 'asc' }],
        })
      },
      [] as never[]
    )
  },
  ['menu-items'],
  { revalidate: 60, tags: ['menu-items'] }
)

export const getActivePromotions = unstable_cache(
  async () => {
    return safeQuery(
      async () => {
        const now = new Date()
        return db.promotion.findMany({
          where: {
            isActive: true,
            startDate: { lte: now },
            OR: [{ endDate: null }, { endDate: { gte: now } }],
          },
        })
      },
      [] as never[]
    )
  },
  ['active-promotions'],
  { revalidate: 60, tags: ['promotions'] }
)

export function getDiscountPercent(promotions: { productIds: string; discountPercent: number }[], productId: string) {
  for (const promo of promotions) {
    try {
      const ids = JSON.parse(promo.productIds || '[]')
      if (ids.includes(productId)) return promo.discountPercent
    } catch {
      return 0
    }
  }
  return 0
}

export function getDiscountedPrice(price: number, discountPercent: number) {
  if (!discountPercent || discountPercent <= 0) return price
  return Math.round(price * (1 - discountPercent / 100) * 100) / 100
}

export const getPages = unstable_cache(
  async (includeInactive = false) => {
    return safeQuery(
      async () => {
        return db.page.findMany({
          where: includeInactive ? {} : { isActive: true },
          orderBy: [{ showInFooter: 'desc' }, { order: 'asc' }],
        })
      },
      [] as never[]
    )
  },
  ['pages'],
  { revalidate: 3600, tags: ['pages'] }
)

export const getPageBySlug = unstable_cache(
  async (slug: string) => {
    return safeQuery(
      async () => {
        return db.page.findUnique({ where: { slug } })
      },
      null
    )
  },
  ['page-by-slug'],
  { revalidate: 3600, tags: ['pages'] }
)