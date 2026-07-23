import { db } from '@/lib/db'
import { CinematicHero } from '@/components/shop/CinematicHero'
import { PromotionalBanner } from '@/components/shop/PromotionalBanner'
import { CinematicSection } from '@/components/shop/CinematicSection'
import { CinematicProductCard } from '@/components/shop/CinematicProductCard'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

async function getContent(): Promise<Record<string, string>> {
  try {
    const blocks = await db.contentBlock.findMany()
    const map: Record<string, string> = {}
    blocks.forEach(b => { map[b.key] = b.value })
    return map
  } catch {
    return {}
  }
}

export default async function HomePage() {
  const [content, collections] = await Promise.all([
    getContent(),
    db.collection.findMany({
      where: { isActive: true, showOnHome: true },
      include: {
        products: {
          include: {
            product: { include: { category: true, reviews: { select: { rating: true } } } }
          }
        }
      },
      orderBy: { order: 'asc' },
    }),
  ])

  const c = (key: string, fallback: string) => content[key] || fallback

  return (
    <>
      <CinematicHero
        badge={c('hero_badge', 'منتجات أصلية 100% - جملة وتجزئة')}
        title={c('hero_title', 'متجر')}
        titleHighlight={c('hero_title_highlight', 'التجميل')}
        subtitle={c('hero_subtitle', 'وجهتك الأولى لمنتجات التجميل الرجالية والنسائية. نوفر أفضل الماركات العالمية بأسعار تنافسية للجملة والتجزئة')}
        btnMen={c('hero_btn_men', 'تسوق رجالي')}
        btnWomen={c('hero_btn_women', 'تسوق نسائي')}
      />

      <PromotionalBanner
        badge={c('promo_badge', 'عروض محدودة')}
        title={c('promo_title', 'خصم يصل إلى 30% على منتجات الجملة')}
        text={c('promo_text', 'استفد من الأسعار التنافسية للكميات الكبيرة. عرض ساري لفترة محدودة فقط!')}
        btn={c('promo_btn', 'تصفح عروض الجملة')}
      />

      {/* Collections from admin */}
      {collections.map((col, idx) => {
        const products = col.products.map(pc => pc.product).filter(p => p.isActive).slice(0, 8)
        if (products.length === 0) return null
        return (
          <CinematicSection
            key={col.id}
            title={col.nameAr}
            subtitle={col.descriptionAr || undefined}
            variant={idx % 3}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p, i) => (
                <CinematicProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </CinematicSection>
        )
      })}

      {/* Wholesale section */}
      <CinematicSection title={c('section_wholesale_title', 'البيع بالجملة')} subtitle={c('section_wholesale_subtitle', 'أسعار خاصة للكميات الكبيرة')} variant={2}>
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            {c('section_wholesale_text', 'نوفر أسعار جملة تنافسية للمحلات والموزعين. الحد الأدنى للطلب 10 قطع.')}
          </p>
          <Link href="/wholesale" className="inline-flex px-8 py-4 bg-gradient-to-r from-purple-600 to-rose-500 text-white rounded-full text-lg font-semibold hover:shadow-xl transition-shadow">
            {c('section_wholesale_btn', 'تصفح عروض الجملة')}
          </Link>
        </div>
      </CinematicSection>
    </>
  )
}