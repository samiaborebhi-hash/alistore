import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  console.log('🔄 جارٍ التحديث لتخصيص المتجر بالكامل لمنتجات التجميل النسائية...')

  // 1. تحديث الأقسام (Categories)
  const menCat = await db.category.findUnique({ where: { slug: 'men' } })
  const womenCat = await db.category.findUnique({ where: { slug: 'women' } })

  if (menCat) {
    await db.category.update({
      where: { id: menCat.id },
      data: {
        name: 'skincare',
        nameAr: 'عناية بالشعر والبشرة',
        slug: 'skincare',
      },
    })
    console.log('✅ تم تعديل قسم "رجالي" إلى "عناية بالشعر والبشرة"')
  }

  if (womenCat) {
    await db.category.update({
      where: { id: womenCat.id },
      data: {
        name: 'makeup',
        nameAr: 'مكياج وتجميل',
        slug: 'makeup',
      },
    })
    console.log('✅ تم تعديل قسم "نسائي" إلى "مكياج وتجميل"')
  }

  // 2. تحديث إعدادات الموقع العامة (SiteSettings)
  await db.siteSettings.upsert({
    where: { id: 'main' },
    update: {
      siteName: 'نوفا بيور للتجميل',
      siteNameEn: 'Nova Pure Beauty',
      aboutTextAr: 'متجر مخصص لأرقى منتجات التجميل والعناية النسائية، نوفر ماركات عالمية أصلية 100% بسعر الجملة والتجزئة.',
    },
    create: {
      id: 'main',
      siteName: 'نوفا بيور للتجميل',
      siteNameEn: 'Nova Pure Beauty',
      whatsappNumber: '201070830698',
      aboutTextAr: 'متجر مخصص لأرقى منتجات التجميل والعناية النسائية، نوفر ماركات عالمية أصلية 100% بسعر الجملة والتجزئة.',
    },
  })
  console.log('✅ تم تحديث إعدادات المتجر العامة')

  // 3. تحديث عناصر القوائم (MenuItem)
  await db.menuItem.deleteMany({})
  await db.menuItem.createMany({
    data: [
      { label: 'الرئيسية', labelAr: 'الرئيسية', url: '/', position: 'header', order: 0 },
      { label: 'كل المنتجات', labelAr: 'كل المنتجات', url: '/products', position: 'header', order: 1 },
      { label: 'مكياج وتجميل', labelAr: 'مكياج وتجميل', url: '/products?category=makeup', position: 'header', order: 2 },
      { label: 'عناية بالشعر والبشرة', labelAr: 'عناية بالشعر والبشرة', url: '/products?category=skincare', position: 'header', order: 3 },
      { label: 'عروض الجملة', labelAr: 'عروض الجملة', url: '/wholesale', position: 'header', order: 4 },

      { label: 'كل المنتجات', labelAr: 'كل المنتجات', url: '/products', position: 'footer', order: 0 },
      { label: 'عروض الجملة', labelAr: 'عروض الجملة', url: '/wholesale', position: 'footer', order: 1 },
      { label: 'المفضلة', labelAr: 'المفضلة', url: '/wishlist', position: 'footer', order: 2 },
    ],
  })
  console.log('✅ تم تحديث القوائم الرئيسية والفوتر')

  // 4. تحديث كتل المحتوى الديناميكي (ContentBlock)
  const blocks = [
    { key: 'hero_badge', value: 'منتجات تجميل نسائية أصلية 100%' },
    { key: 'hero_title', value: 'نوفا بيور' },
    { key: 'hero_title_highlight', value: 'للتجميل' },
    { key: 'hero_subtitle', value: 'وجهتك الأولى لأرقى منتجات التجميل والعناية النسائية. نوفر أفضل الماركات العالمية بأسعار تنافسية للجملة والتجزئة' },
    { key: 'hero_btn_men', value: 'تصفح المنتجات' },
    { key: 'hero_btn_women', value: 'عروض الجملة' },
    { key: 'promo_badge', value: 'عروض محدودة' },
    { key: 'promo_title', value: 'خصم يصل إلى 30% على منتجات التجميل بالجملة' },
    { key: 'promo_text', value: 'استفيدي من الأسعار التنافسية للكميات الكبيرة من منتجات المكياج والعناية.' },
    { key: 'promo_btn', value: 'تصفح عروض الجملة' },
    { key: 'section_wholesale_title', value: 'البيع بالجملة' },
    { key: 'section_wholesale_subtitle', value: 'أسعار خاصة للكميات الكبيرة من مستحضرات التجميل' },
    { key: 'section_wholesale_text', value: 'نوفر أسعار جملة تنافسية للصالونات، المحلات والموزعين. الحد الأدنى للطلب 10 قطع.' },
    { key: 'section_wholesale_btn', value: 'تصفح عروض الجملة' },
  ]

  for (const b of blocks) {
    await db.contentBlock.upsert({
      where: { key: b.key },
      update: { value: b.value },
      create: { key: b.key, label: b.key, value: b.value },
    })
  }
  console.log('✅ تم تحديث النصوص والعبارات الترحيبية النسائية')
}

main()
  .catch(e => console.error('❌ خطأ:', e.message))
  .finally(() => db.$disconnect())
