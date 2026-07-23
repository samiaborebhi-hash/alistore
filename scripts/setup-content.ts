import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const blocks = [
  { key: 'hero_badge', label: 'شارة الهيرو', value: 'منتجات أصلية 100% - جملة وتجزئة', type: 'text', page: 'home' },
  { key: 'hero_title', label: 'عنوان الصفحة الرئيسية', value: 'متجر التجميل', type: 'text', page: 'home' },
  { key: 'hero_title_highlight', label: 'جزء العنوان المميز', value: 'التجميل', type: 'text', page: 'home' },
  { key: 'hero_subtitle', label: 'وصف الصفحة الرئيسية', value: 'وجهتك الأولى لمنتجات التجميل الرجالية والنسائية. نوفر أفضل الماركات العالمية بأسعار تنافسية للجملة والتجزئة', type: 'textarea', page: 'home' },
  { key: 'hero_btn_men', label: 'زر تسوق رجالي', value: 'تسوق رجالي', type: 'text', page: 'home' },
  { key: 'hero_btn_women', label: 'زر تسوق نسائي', value: 'تسوق نسائي', type: 'text', page: 'home' },
  { key: 'promo_badge', label: 'شارة العروض', value: 'عروض محدودة', type: 'text', page: 'home' },
  { key: 'promo_title', label: 'عنوان قسم العروض', value: 'خصم يصل إلى 30% على منتجات الجملة', type: 'text', page: 'home' },
  { key: 'promo_text', label: 'نص قسم العروض', value: 'استفد من الأسعار التنافسية للكميات الكبيرة. عرض ساري لفترة محدودة فقط!', type: 'textarea', page: 'home' },
  { key: 'promo_btn', label: 'زر قسم العروض', value: 'تصفح عروض الجملة', type: 'text', page: 'home' },
  { key: 'section_products_title', label: 'عنوان قسم المنتجات', value: 'منتجات مميزة', type: 'text', page: 'home' },
  { key: 'section_products_subtitle', label: 'وصف قسم المنتجات', value: 'أفضل منتجات التجميل المختارة بعناية', type: 'text', page: 'home' },
  { key: 'section_categories_title', label: 'عنوان قسم الأقسام', value: 'تسوق حسب القسم', type: 'text', page: 'home' },
  { key: 'section_categories_subtitle', label: 'وصف قسم الأقسام', value: 'اختر القسم المناسب لك', type: 'text', page: 'home' },
  { key: 'section_wholesale_title', label: 'عنوان قسم الجملة', value: 'البيع بالجملة', type: 'text', page: 'home' },
  { key: 'section_wholesale_subtitle', label: 'وصف قسم الجملة', value: 'أسعار خاصة للكميات الكبيرة', type: 'text', page: 'home' },
  { key: 'section_wholesale_text', label: 'نص قسم الجملة', value: 'نوفر أسعار جملة تنافسية للمحلات والموزعين. الحد الأدنى للطلب 10 قطع.', type: 'textarea', page: 'home' },
  { key: 'section_wholesale_btn', label: 'زر قسم الجملة', value: 'تصفح عروض الجملة', type: 'text', page: 'home' },
]

async function main() {
  for (const block of blocks) {
    await db.contentBlock.upsert({
      where: { key: block.key },
      update: { label: block.label },
      create: block,
    })
    console.log(`  OK: ${block.key}`)
  }
  console.log(`\nSeeded ${blocks.length} content blocks`)
  await db.$disconnect()
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1) })