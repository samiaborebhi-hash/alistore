import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // ============================================================
  // 1. ADMIN USER
  // ============================================================
  const passwordHash = await hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 12)
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@alipro.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@alipro.com',
      name: 'مدير النظام',
      passwordHash,
      role: 'admin',
    },
  })
  console.log('✅ Admin user created')

  // ============================================================
  // 2. CATEGORIES
  // ============================================================
  const menCategory = await prisma.category.upsert({
    where: { slug: 'men' },
    update: {},
    create: { name: 'men', nameAr: 'رجالي', slug: 'men' },
  })

  const womenCategory = await prisma.category.upsert({
    where: { slug: 'women' },
    update: {},
    create: { name: 'women', nameAr: 'نسائي', slug: 'women' },
  })

  const wholesaleCategory = await prisma.category.upsert({
    where: { slug: 'wholesale' },
    update: {},
    create: { name: 'wholesale', nameAr: 'جملة', slug: 'wholesale' },
  })
  console.log('✅ Categories created')

  // ============================================================
  // 3. SITE SETTINGS
  // ============================================================
  await prisma.siteSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      siteName: 'متجر التجميل الفاخر',
      siteNameEn: 'Luxury Beauty Store',
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966500000000',
      email: 'info@alipro.com',
      address: 'المملكة العربية السعودية',
      currency: 'SAR',
      aboutTextAr: 'متجر متخصص في أفخر منتجات التجميل والعناية الشخصية. نوفر أفضل الماركات العالمية بأسعار تنافسية للجملة والتجزئة. جميع منتجاتنا أصلية 100% ومضمونة.',
    },
  })
  console.log('✅ Site settings created')

  // ============================================================
  // 4. MENU ITEMS
  // ============================================================
  await prisma.menuItem.deleteMany({})
  await prisma.menuItem.createMany({
    data: [
      { label: 'الرئيسية', url: '/', position: 'header', order: 0 },
      { label: 'منتجات رجالية', url: '/men', position: 'header', order: 1 },
      { label: 'منتجات نسائية', url: '/women', position: 'header', order: 2 },
      { label: 'البيع بالجملة', url: '/wholesale', position: 'header', order: 3 },
      { label: 'الرئيسية', url: '/', position: 'footer', order: 0 },
      { label: 'منتجات رجالية', url: '/men', position: 'footer', order: 1 },
      { label: 'منتجات نسائية', url: '/women', position: 'footer', order: 2 },
      { label: 'البيع بالجملة', url: '/wholesale', position: 'footer', order: 3 },
    ],
  })
  console.log('✅ Menu items created')

  // ============================================================
  // 5. CMS PAGES (Privacy, Terms, etc.)
  // ============================================================
  await prisma.page.deleteMany({})
  await prisma.page.createMany({
    data: [
      {
        slug: 'privacy-policy',
        title: 'Privacy Policy',
        titleAr: 'سياسة الخصوصية',
        content: `نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.

المعلومات التي نجمعها:
- اسمك ورقم الهاتف عند إرسال طلب عبر واتساب
- بريدك الإلكتروني إذا قمت بإنشاء حساب
- عنوان الشحن عند الطلب

كيف نستخدم معلوماتك:
- لمعالجة طلباتك وتوصيل المنتجات
- للتواصل معك بخصوص طلباتك
- لتحسين تجربة التسوق

نحن لا نبيع أو نشارك بياناتك مع أي طرف ثالث.

لأي استفسار تواصل معنا عبر واتساب.`,
        contentType: 'text',
        isActive: true,
        showInFooter: true,
        footerLabel: 'سياسة الخصوصية',
        order: 0,
      },
      {
        slug: 'terms-and-conditions',
        title: 'Terms and Conditions',
        titleAr: 'الشروط والأحكام',
        content: `باستخدامك لهذا الموقع، فإنك توافق على الشروط التالية:

1. الأسعار المعروضة تشمل الضريبة المضافة.
2. الطلبات يتم تأكيدها عبر واتساب.
3. مدة التوصيل تتراوح بين 2-5 أيام عمل داخل المملكة.
4. يمكنك طلب استبدال أو استرجاع خلال 7 أيام من استلام المنتج.
5. المنتجات المعروضة أصلية 100%.

لأي استفسار، يسعدنا خدمتك عبر واتساب.`,
        contentType: 'text',
        isActive: true,
        showInFooter: true,
        footerLabel: 'الشروط والأحكام',
        order: 1,
      },
    ],
  })
  console.log('✅ CMS pages created')

  // ============================================================
  // 5. PRODUCTS - MEN (10 products)
  // ============================================================
  const menProducts = [
    {
      name: 'Premium Beard Oil - Royal Oud',
      nameAr: 'زيت العناية باللحية الفاخر - عود ملكي',
      description: 'A luxurious beard oil infused with rare Royal Oud essence, argan oil, and vitamin E. Deeply conditions facial hair, eliminates itchiness, and leaves a sophisticated long-lasting fragrance. Suitable for all beard types.',
      descriptionAr: 'زيت لحية فاخر غني بخلاصة العود الملكي النادر وزيت الأرغان وفيتامين E. يرطب شعر اللحية بعمق ويقضي على الحكة ويترك عطراً راقياً يدوم طويلاً. مناسب لجميع أنواع اللحى.',
      price: 129,
      wholesalePrice: 89,
      minWholesaleQty: 12,
      stock: 45,
      categoryId: menCategory.id,
      isFeatured: true,
      isActive: true,
      tags: JSON.stringify(['عناية باللحية', 'أكثر مبيعاً', 'عطور فاخرة', 'منتج طبيعي']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty1/600/600',
        'https://picsum.photos/seed/beauty2/600/600',
      ]),
    },
    {
      name: 'Vitamin C Face Serum - Anti Aging',
      nameAr: 'سيروم فيتامين سي للوجه - مضاد للتجاعيد',
      description: 'High-potency Vitamin C serum with 20% L-Ascorbic Acid, hyaluronic acid, and ferulic acid. Brightens skin tone, reduces dark spots, boosts collagen production, and provides powerful antioxidant protection against environmental damage.',
      descriptionAr: 'سيروم فيتامين سي عالي التركيز بنسبة 20% مع حمض الهيالورونيك وحمض الفيروليك. يفتح لون البشرة ويقلل البقع الداكنة ويعزز إنتاج الكولاجين ويوفر حماية قوية مضادة للأكسدة.',
      price: 159,
      wholesalePrice: 110,
      minWholesaleQty: 12,
      stock: 60,
      categoryId: menCategory.id,
      isFeatured: true,
      isActive: true,
      tags: JSON.stringify(['عناية بالبشرة', 'فيتامين سي', 'مضاد للتجاعيد', 'أكثر مبيعاً']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty3/600/600',
        'https://picsum.photos/seed/beauty4/600/600',
      ]),
    },
    {
      name: 'Charcoal Deep Cleansing Face Wash',
      nameAr: 'غسول وجه بالفحم للتنظيف العميق',
      description: 'Activated charcoal face wash that draws out impurities, excess oil, and toxins from deep within pores. Enriched with tea tree oil and salicylic acid to prevent breakouts and control shine. Leaves skin feeling fresh and matte all day.',
      descriptionAr: 'غسول وجه بالفحم النشط يسحب الشوائب والزيوت الزائدة والسموم من أعماق المسام. غني بزيت شجرة الشاي وحمض الساليسيليك لمنع الحبوب والتحكم باللمعان. يترك البشرة منتعشة ومطفية طوال اليوم.',
      price: 89,
      wholesalePrice: 59,
      minWholesaleQty: 12,
      stock: 80,
      categoryId: menCategory.id,
      isFeatured: false,
      isActive: true,
      tags: JSON.stringify(['عناية بالبشرة', 'تنظيف', 'فحم', 'منتج طبيعي']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty5/600/600',
        'https://picsum.photos/seed/beauty6/600/600',
      ]),
    },
    {
      name: 'Royal Oud Perfume - 100ml EDP',
      nameAr: 'عطر العود الملكي - 100 مل',
      description: 'An exquisite oriental fragrance opening with bergamot and saffron, heart notes of Bulgarian rose and Indian oud, resting on a base of amber, musk, and sandalwood. Long-lasting Eau de Parfum that commands presence.',
      descriptionAr: 'عطر شرقي فاخر يفتتح بالبرغموت والزعفران، قلب من الورد البلغاري والعود الهندي، وقاعدة من العنبر والمسك وخشب الصندل. عطر يدوم طويلاً ويفرض حضوره.',
      price: 299,
      wholesalePrice: 210,
      minWholesaleQty: 6,
      stock: 35,
      categoryId: menCategory.id,
      isFeatured: true,
      isActive: true,
      tags: JSON.stringify(['عطور', 'عود', 'أكثر مبيعاً', 'فاخر']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty7/600/600',
        'https://picsum.photos/seed/beauty8/600/600',
      ]),
    },
    {
      name: 'Hyaluronic Acid Moisturizer - 24H Hydration',
      nameAr: 'كريم ترطيب هيالورونيك أسيد - 24 ساعة',
      description: 'Ultra-lightweight gel-cream with triple hyaluronic acid complex, ceramides, and niacinamide. Provides intense 24-hour hydration without greasiness. Strengthens skin barrier and minimizes fine lines. Perfect for daily use under the harsh sun.',
      descriptionAr: 'كريم جل خفيف للغاية بتركيبة ثلاثية من حمض الهيالورونيك والسيراميد والنياسيناميد. يوفر ترطيباً مكثفاً لمدة 24 ساعة بدون دهنية. يقوي حاجز البشرة ويقلل الخطوط الدقيقة. مثالي للاستخدام اليومي.',
      price: 139,
      wholesalePrice: 95,
      minWholesaleQty: 12,
      stock: 55,
      categoryId: menCategory.id,
      isFeatured: false,
      isActive: true,
      tags: JSON.stringify(['ترطيب', 'هيالورونيك أسيد', 'عناية يومية']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty9/600/600',
        'https://picsum.photos/seed/beauty10/600/600',
      ]),
    },
    {
      name: 'Professional Hair Styling Pomade - Matte Finish',
      nameAr: 'بوماد تصفيف الشعر الاحترافي - مطفية',
      description: 'Professional-grade water-based pomade with strong hold and natural matte finish. Infused with keratin and biotin to nourish hair while styling. Washes out easily without residue. Perfect for classic and modern hairstyles.',
      descriptionAr: 'بوماد مائي بجودة احترافية مع تثبيت قوي ومظهر طبيعي مطفى. غني بالكيراتين والبيوتين لتغذية الشعر أثناء التصفيف. يغسل بسهولة بدون بقايا. مثالي للتسريحات الكلاسيكية والعصرية.',
      price: 79,
      wholesalePrice: 52,
      minWholesaleQty: 12,
      stock: 70,
      categoryId: menCategory.id,
      isFeatured: false,
      isActive: true,
      tags: JSON.stringify(['عناية بالشعر', 'تصفيف', 'احترافي']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty11/600/600',
        'https://picsum.photos/seed/beauty12/600/600',
      ]),
    },
    {
      name: 'Dead Sea Mud Mask - Deep Pore Cleansing',
      nameAr: 'قناع طين البحر الميت - تنظيف عميق للمسام',
      description: 'Mineral-rich Dead Sea mud mask that deeply purifies pores, absorbs excess oil, and exfoliates dead skin cells. Enriched with aloe vera and chamomile to soothe and calm the skin. Reveals a smoother, clearer complexion after every use.',
      descriptionAr: 'قناع طين البحر الميت الغني بالمعادن ينقي المسام بعمق ويمتص الزيوت الزائدة ويقشر خلايا الجلد الميتة. غني بالألوفيرا والبابونج لتهدئة البشرة. يكشف عن بشرة أنعم وأصفى بعد كل استخدام.',
      price: 99,
      wholesalePrice: 68,
      minWholesaleQty: 12,
      stock: 40,
      categoryId: menCategory.id,
      isFeatured: false,
      isActive: true,
      tags: JSON.stringify(['أقنعة', 'طين البحر الميت', 'تنظيف', 'منتج طبيعي']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty13/600/600',
        'https://picsum.photos/seed/beauty14/600/600',
      ]),
    },
    {
      name: 'Sandalwood & Amber Body Lotion - 400ml',
      nameAr: 'لوشن الجسم بخشب الصندل والعنبر - 400 مل',
      description: 'Rich body lotion with sandalwood and amber extracts, shea butter, and coconut oil. Provides deep 48-hour moisturization with a warm, masculine scent. Non-greasy formula absorbs quickly. Suitable for all skin types.',
      descriptionAr: 'لوشن جسم غني بخلاصة خشب الصندل والعنبر وزبدة الشيا وزيت جوز الهند. يوفر ترطيباً عميقاً لمدة 48 ساعة مع عطر دافئ ورجولي. تركيبة غير دهنية تمتص بسرعة. مناسب لجميع أنواع البشرة.',
      price: 109,
      wholesalePrice: 75,
      minWholesaleQty: 12,
      stock: 50,
      categoryId: menCategory.id,
      isFeatured: false,
      isActive: true,
      tags: JSON.stringify(['عناية بالجسم', 'ترطيب', 'خشب الصندل']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty15/600/600',
        'https://picsum.photos/seed/beauty16/600/600',
      ]),
    },
    {
      name: 'Under-Eye Serum - Dark Circles & Puffiness',
      nameAr: 'سيروم تحت العين - هالات سوداء وانتفاخ',
      description: 'Targeted under-eye treatment with caffeine, peptides, and vitamin K. Reduces dark circles, puffiness, and fine lines around the delicate eye area. Cooling metal applicator enhances absorption and provides instant depuffing effect.',
      descriptionAr: 'علاج مركز لمنطقة تحت العين بالكافيين والبيبتيدات وفيتامين K. يقلل الهالات السوداء والانتفاخ والخطوط الدقيقة حول منطقة العين الحساسة. أداة تطبيق معدنية مبردة تعزز الامتصاص وتوفر تأثيراً فورياً.',
      price: 119,
      wholesalePrice: 82,
      minWholesaleQty: 12,
      stock: 30,
      categoryId: menCategory.id,
      isFeatured: false,
      isActive: true,
      tags: JSON.stringify(['عناية بالعين', 'هالات سوداء', 'سيروم']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty17/600/600',
        'https://picsum.photos/seed/beauty18/600/600',
      ]),
    },
    {
      name: 'Complete Men Grooming Kit - 7 Pieces',
      nameAr: 'مجموعة العناية الرجالية الشاملة - 7 قطع',
      description: 'All-in-one grooming kit: beard oil (30ml), face wash (100ml), moisturizer (50ml), hair pomade (50g), under-eye serum (15ml), body lotion (100ml), and a premium leather toiletry bag. The perfect gift for the modern gentleman.',
      descriptionAr: 'مجموعة عناية متكاملة: زيت لحية (30 مل)، غسول وجه (100 مل)، مرطب (50 مل)، بوماد شعر (50 جم)، سيروم تحت العين (15 مل)، لوشن جسم (100 مل)، وحقيبة جلدية فاخرة. الهدية المثالية للرجل العصري.',
      price: 399,
      wholesalePrice: 280,
      minWholesaleQty: 6,
      stock: 20,
      categoryId: menCategory.id,
      isFeatured: true,
      isActive: true,
      tags: JSON.stringify(['مجموعة', 'هدية', 'أكثر مبيعاً', 'عناية شاملة']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty19/600/600',
        'https://picsum.photos/seed/beauty20/600/600',
      ]),
    },
  ]

  // ============================================================
  // 5. PRODUCTS - WOMEN (10 products)
  // ============================================================
  const womenProducts = [
    {
      name: 'Rose Gold Radiance Face Oil - 24K Gold',
      nameAr: 'زيت الوجه المشرق بالذهب والورد - 24 قيراط',
      description: 'Luxurious face oil infused with real 24K gold flakes, Damascus rose oil, and jojoba oil. Instantly brightens and illuminates the complexion. Rich in antioxidants that fight free radicals and premature aging. Gives a dewy, glass-skin glow.',
      descriptionAr: 'زيت وجه فاخر غني برقائق الذهب عيار 24 الحقيقية وزيت الورد الدمشقي وزيت الجوجوبا. يضيء البشرة فوراً ويمنحها توهجاً. غني بمضادات الأكسدة التي تحارب الجذور الحرة والشيخوخة المبكرة. يمنح توهج البشرة الزجاجية.',
      price: 189,
      wholesalePrice: 135,
      minWholesaleQty: 6,
      stock: 25,
      categoryId: womenCategory.id,
      isFeatured: true,
      isActive: true,
      tags: JSON.stringify(['عناية بالبشرة', 'ذهب', 'فاخر', 'أكثر مبيعاً']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty21/600/600',
        'https://picsum.photos/seed/beauty22/600/600',
      ]),
    },
    {
      name: 'Collagen Boost Night Cream - Retinol Complex',
      nameAr: 'كريم الليل المعزز بالكولاجين - مركب الريتينول',
      description: 'Intensive night cream with encapsulated retinol, collagen peptides, and squalane. Works overnight to boost collagen production, smooth fine lines, and even skin tone. Wake up to visibly firmer, more youthful-looking skin.',
      descriptionAr: 'كريم ليلي مكثف بالريتينول المغلف وبيبتيدات الكولاجين والسكوالين. يعمل طوال الليل لتعزيز إنتاج الكولاجين وتنعيم الخطوط الدقيقة وتوحيد لون البشرة. استيقظي على بشرة أكثر شباباً ومرونة.',
      price: 179,
      wholesalePrice: 125,
      minWholesaleQty: 6,
      stock: 35,
      categoryId: womenCategory.id,
      isFeatured: true,
      isActive: true,
      tags: JSON.stringify(['عناية بالبشرة', 'ريتينول', 'كولاجين', 'ليلي']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty23/600/600',
        'https://picsum.photos/seed/beauty24/600/600',
      ]),
    },
    {
      name: 'Moroccan Argan Oil Hair Elixir - 100ml',
      nameAr: 'إكسير الشعر بزيت الأرغان المغربي - 100 مل',
      description: 'Pure cold-pressed Moroccan argan oil blended with keratin and silk proteins. Repairs split ends, tames frizz, adds brilliant shine, and protects against heat styling up to 230°C. Lightweight formula that does not weigh hair down.',
      descriptionAr: 'زيت أرغان مغربي نقي معصور على البارد ممزوج بالكيراتين وبروتينات الحرير. يعالج الأطراف المتقصفة ويروض التجعد ويضيف لمعاناً رائعاً ويحمي من الحرارة حتى 230 درجة. تركيبة خفيفة لا تثقل الشعر.',
      price: 149,
      wholesalePrice: 105,
      minWholesaleQty: 12,
      stock: 55,
      categoryId: womenCategory.id,
      isFeatured: false,
      isActive: true,
      tags: JSON.stringify(['عناية بالشعر', 'زيت الأرغان', 'مغربي', 'منتج طبيعي']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty25/600/600',
        'https://picsum.photos/seed/beauty26/600/600',
      ]),
    },
    {
      name: 'Velvet Matte Lipstick Collection - 12 Shades',
      nameAr: 'مجموعة أحمر شفاه مخملي مطفى - 12 لون',
      description: 'Complete lipstick collection featuring 12 stunning shades from nude to bold red. Velvet matte finish that glides on smoothly and lasts up to 12 hours. Enriched with vitamin E and shea butter to keep lips hydrated and comfortable all day.',
      descriptionAr: 'مجموعة كاملة من أحمر الشفاه بـ 12 لوناً مذهلاً من النيود إلى الأحمر الجريء. ملمس مخملي مطفى ينزلق بسلاسة ويدوم حتى 12 ساعة. غني بفيتامين E وزبدة الشيا للحفاظ على ترطيب الشفاه وراحتها طوال اليوم.',
      price: 249,
      wholesalePrice: 175,
      minWholesaleQty: 6,
      stock: 30,
      categoryId: womenCategory.id,
      isFeatured: true,
      isActive: true,
      tags: JSON.stringify(['مكياج', 'أحمر شفاه', 'مجموعة', 'أكثر مبيعاً']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty27/600/600',
        'https://picsum.photos/seed/beauty28/600/600',
      ]),
    },
    {
      name: 'Snail Mucin Repair Essence - 96% Pure',
      nameAr: 'إسنس الحلزون المرطب والمجدد - 96% نقي',
      description: 'Korean beauty secret: 96% pure snail mucin essence that repairs damaged skin, fades acne scars, and restores elasticity. Packed with natural proteins, glycolic acid, and allantoin. Lightweight, fast-absorbing formula suitable for all skin types.',
      descriptionAr: 'سر الجمال الكوري: إسنس حلزون نقي بنسبة 96% يعالج البشرة التالفة ويخفف آثار الحبوب ويعيد المرونة. غني بالبروتينات الطبيعية وحمض الجليكوليك والألانتوين. تركيبة خفيفة سريعة الامتصاص مناسبة لجميع أنواع البشرة.',
      price: 169,
      wholesalePrice: 118,
      minWholesaleQty: 12,
      stock: 40,
      categoryId: womenCategory.id,
      isFeatured: false,
      isActive: true,
      tags: JSON.stringify(['عناية بالبشرة', 'كوري', 'حلزون', 'ترطيب']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty29/600/600',
        'https://picsum.photos/seed/beauty30/600/600',
      ]),
    },
    {
      name: 'Diamond Glow Highlighter Palette - 6 Shades',
      nameAr: 'باليت هايلايتر الألماس المتوهج - 6 ألوان',
      description: 'Ultra-buttery highlighter palette with 6 versatile shades from champagne to rose gold. Finely milled pearls create a multi-dimensional glow without emphasizing texture. Buildable formula for subtle day glow to intense night glam.',
      descriptionAr: 'باليت هايلايتر فائقة النعومة بـ 6 ألوان متعددة من الشمبانيا إلى الذهب الوردي. لآلئ مطحونة بدقة تخلق توهجاً متعدد الأبعاد بدون إبراز المسام. تركيبة قابلة للبناء من توهج نهاري ناعم إلى سحر ليلي مكثف.',
      price: 139,
      wholesalePrice: 95,
      minWholesaleQty: 6,
      stock: 45,
      categoryId: womenCategory.id,
      isFeatured: false,
      isActive: true,
      tags: JSON.stringify(['مكياج', 'هايلايتر', 'باليت', 'توهج']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty31/600/600',
        'https://picsum.photos/seed/beauty32/600/600',
      ]),
    },
    {
      name: 'Rose Water Toner - Organic & Alcohol-Free',
      nameAr: 'تونر ماء الورد الطبيعي - عضوي وخالي من الكحول',
      description: 'Pure organic rose water toner distilled from Damask rose petals. Gently balances skin pH, tightens pores, and refreshes the complexion. Alcohol-free and suitable for even the most sensitive skin. Can be used as a setting spray or midday refresher.',
      descriptionAr: 'تونر ماء ورد عضوي نقي مقطر من بتلات الورد الدمشقي. يوازن درجة حموضة البشرة بلطف ويشد المسام وينعش البشرة. خالي من الكحول ومناسب حتى للبشرة الأكثر حساسية. يمكن استخدامه كمثبت مكياج أو منعش خلال اليوم.',
      price: 79,
      wholesalePrice: 52,
      minWholesaleQty: 12,
      stock: 65,
      categoryId: womenCategory.id,
      isFeatured: false,
      isActive: true,
      tags: JSON.stringify(['عناية بالبشرة', 'تونر', 'عضوي', 'ماء ورد']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty33/600/600',
        'https://picsum.photos/seed/beauty34/600/600',
      ]),
    },
    {
      name: 'Silk Protein Hair Mask - Deep Repair',
      nameAr: 'ماسك الشعر بالبروتين والحرير - إصلاح عميق',
      description: 'Intensive hair mask with hydrolyzed silk protein, keratin, and argan oil. Deeply repairs damaged, color-treated, or heat-styled hair. Restores elasticity, prevents breakage, and leaves hair silky smooth with mirror-like shine. Use weekly for best results.',
      descriptionAr: 'ماسك شعر مكثف ببروتين الحرير المتحلل والكيراتين وزيت الأرغان. يعالج بعمق الشعر التالف أو المصبوغ أو المعالج بالحرارة. يعيد المرونة ويمنع التقصف ويترك الشعر حريرياً ناعماً بلمعان كالمرآة. يستخدم أسبوعياً للحصول على أفضل النتائج.',
      price: 119,
      wholesalePrice: 82,
      minWholesaleQty: 12,
      stock: 50,
      categoryId: womenCategory.id,
      isFeatured: false,
      isActive: true,
      tags: JSON.stringify(['عناية بالشعر', 'ماسك', 'بروتين', 'إصلاح']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty35/600/600',
        'https://picsum.photos/seed/beauty36/600/600',
      ]),
    },
    {
      name: 'Pearl Brightening Sheet Mask Set - 10 Pack',
      nameAr: 'مجموعة أقنعة اللؤلؤ المشرقة - 10 قطع',
      description: 'Set of 10 sheet masks infused with pearl extract, niacinamide, and hyaluronic acid. Each mask delivers intense brightening and hydration in just 15 minutes. Perfect for pre-event prep or weekly self-care ritual. Dermatologist tested.',
      descriptionAr: 'مجموعة 10 أقنعة قماشية غنية بخلاصة اللؤلؤ والنياسيناميد وحمض الهيالورونيك. كل قناع يوفر تفتيحاً وترطيباً مكثفاً في 15 دقيقة فقط. مثالي للتحضير قبل المناسبات أو كطقس أسبوعي للعناية الذاتية. مختبر من أطباء الجلد.',
      price: 99,
      wholesalePrice: 65,
      minWholesaleQty: 12,
      stock: 75,
      categoryId: womenCategory.id,
      isFeatured: false,
      isActive: true,
      tags: JSON.stringify(['أقنعة', 'لؤلؤ', 'تفتيح', 'مجموعة']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty37/600/600',
        'https://picsum.photos/seed/beauty38/600/600',
      ]),
    },
    {
      name: 'Luxury Body Butter - Vanilla & Coconut',
      nameAr: 'زبدة الجسم الفاخرة - فانيليا وجوز الهند',
      description: 'Whipped body butter with raw shea butter, coconut oil, and Madagascar vanilla. Intensely moisturizes and nourishes dry skin for up to 72 hours. The warm, sweet scent lingers delicately on the skin. 100% natural ingredients, no parabens.',
      descriptionAr: 'زبدة جسم مخفوقة بزبدة الشيا الخام وزيت جوز الهند وفانيليا مدغشقر. ترطب وتغذي البشرة الجافة بعمق لمدة تصل إلى 72 ساعة. العطر الدافئ الحلو يدوم برقة على البشرة. مكونات طبيعية 100%، خالية من البارابين.',
      price: 109,
      wholesalePrice: 75,
      minWholesaleQty: 12,
      stock: 60,
      categoryId: womenCategory.id,
      isFeatured: false,
      isActive: true,
      tags: JSON.stringify(['عناية بالجسم', 'زبدة', 'فانيليا', 'منتج طبيعي']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty39/600/600',
        'https://picsum.photos/seed/beauty40/600/600',
      ]),
    },
  ]

  // ============================================================
  // 6. PRODUCTS - WHOLESALE (5 products)
  // ============================================================
  const wholesaleProducts = [
    {
      name: 'Bulk Argan Oil - 1 Liter Pure Organic',
      nameAr: 'زيت الأرغان بالجملة - 1 لتر عضوي نقي',
      description: 'Pure organic cold-pressed Moroccan argan oil in bulk 1-liter packaging. Ideal for salons, spas, and beauty retailers. Certified organic by ECOCERT. Rich in vitamin E and essential fatty acids. Perfect for repackaging or professional use.',
      descriptionAr: 'زيت أرغان مغربي عضوي نقي معصور على البارد بعبوة 1 لتر. مثالي للصالونات والمنتجعات وتجار التجزئة. معتمد عضوياً من ECOCERT. غني بفيتامين E والأحماض الدهنية الأساسية. مثالي لإعادة التعبئة أو الاستخدام المهني.',
      price: 499,
      wholesalePrice: 350,
      minWholesaleQty: 6,
      stock: 100,
      categoryId: wholesaleCategory.id,
      isFeatured: true,
      isActive: true,
      tags: JSON.stringify(['جملة', 'زيت الأرغان', 'عضوي', '1 لتر']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty41/600/600',
        'https://picsum.photos/seed/beauty42/600/600',
      ]),
    },
    {
      name: 'Salon Professional Shampoo - 5 Liter',
      nameAr: 'شامبو احترافي للصالونات - 5 لتر',
      description: 'Professional-grade salon shampoo in economical 5-liter container. Gentle sulfate-free formula with keratin and panthenol. Suitable for all hair types. Perfect for high-volume salons, hotels, and beauty centers. pH balanced.',
      descriptionAr: 'شامبو بجودة احترافية للصالونات بعبوة اقتصادية 5 لتر. تركيبة لطيفة خالية من السلفات مع الكيراتين والبانثينول. مناسب لجميع أنواع الشعر. مثالي للصالونات والفنادق ومراكز التجميل عالية الاستهلاك. متوازن الحموضة.',
      price: 349,
      wholesalePrice: 240,
      minWholesaleQty: 6,
      stock: 80,
      categoryId: wholesaleCategory.id,
      isFeatured: false,
      isActive: true,
      tags: JSON.stringify(['جملة', 'صالونات', 'شامبو', '5 لتر']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty43/600/600',
        'https://picsum.photos/seed/beauty44/600/600',
      ]),
    },
    {
      name: 'Wholesale Face Mask Bundle - 100 Units Mixed',
      nameAr: 'باقة أقنعة وجه بالجملة - 100 وحدة متنوعة',
      description: 'Mixed bundle of 100 premium sheet masks: 25 collagen, 25 vitamin C, 25 hyaluronic acid, 25 charcoal. Individually wrapped. Perfect for beauty subscription boxes, retail stores, and spa giveaways. High margin resale product.',
      descriptionAr: 'باقة متنوعة من 100 قناع وجه فاخر: 25 كولاجين، 25 فيتامين سي، 25 هيالورونيك أسيد، 25 فحم. مغلفة بشكل فردي. مثالية لصناديق الاشتراك الشهرية ومتاجر التجزئة وهدايا المنتجعات. منتج بهامش ربح عالي لإعادة البيع.',
      price: 599,
      wholesalePrice: 420,
      minWholesaleQty: 6,
      stock: 50,
      categoryId: wholesaleCategory.id,
      isFeatured: true,
      isActive: true,
      tags: JSON.stringify(['جملة', 'أقنعة', 'باقة', '100 قطعة']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty45/600/600',
        'https://picsum.photos/seed/beauty46/600/600',
      ]),
    },
    {
      name: 'Essential Oils Collection - 12 x 100ml',
      nameAr: 'مجموعة الزيوت العطرية الأساسية - 12 × 100 مل',
      description: 'Complete essential oils collection: lavender, tea tree, peppermint, eucalyptus, rosemary, lemon, orange, frankincense, cedarwood, ylang-ylang, bergamot, and chamomile. 100% pure therapeutic grade. Perfect for aromatherapy, massage, and DIY beauty.',
      descriptionAr: 'مجموعة كاملة من الزيوت العطرية: لافندر، شجرة الشاي، نعناع، أوكالبتوس، روزماري، ليمون، برتقال، لبان، خشب الأرز، يلانج يلانج، برغموت، وبابونج. درجة علاجية نقية 100%. مثالية للعلاج بالروائح والمساج والجمال المنزلي.',
      price: 449,
      wholesalePrice: 310,
      minWholesaleQty: 6,
      stock: 40,
      categoryId: wholesaleCategory.id,
      isFeatured: false,
      isActive: true,
      tags: JSON.stringify(['جملة', 'زيوت عطرية', 'مجموعة', '12 قطعة']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty47/600/600',
        'https://picsum.photos/seed/beauty48/600/600',
      ]),
    },
    {
      name: 'Bulk Shea Butter - 5kg Raw Unrefined',
      nameAr: 'زبدة الشيا الخام بالجملة - 5 كجم غير مكررة',
      description: 'Raw unrefined Grade A shea butter from Ghana in bulk 5kg packaging. Perfect for soap making, cosmetics manufacturing, and DIY beauty products. Rich in vitamins A, E, and F. Naturally moisturizing and healing. Fair trade certified.',
      descriptionAr: 'زبدة شيا خام غير مكررة درجة أولى من غانا بعبوة 5 كجم. مثالية لصناعة الصابون ومستحضرات التجميل ومنتجات الجمال المنزلية. غنية بفيتامينات A و E و F. مرطبة وشافية طبيعياً. معتمدة من التجارة العادلة.',
      price: 299,
      wholesalePrice: 199,
      minWholesaleQty: 6,
      stock: 60,
      categoryId: wholesaleCategory.id,
      isFeatured: false,
      isActive: true,
      tags: JSON.stringify(['جملة', 'زبدة الشيا', 'خام', '5 كجم']),
      images: JSON.stringify([
        'https://picsum.photos/seed/beauty49/600/600',
        'https://picsum.photos/seed/beauty50/600/600',
      ]),
    },
  ]

  // ============================================================
  // 7. INSERT ALL PRODUCTS
  // ============================================================
  const allProducts = [...menProducts, ...womenProducts, ...wholesaleProducts]

  for (const product of allProducts) {
    await prisma.product.create({ data: product })
  }
  console.log(`✅ ${allProducts.length} products created (${menProducts.length} men, ${womenProducts.length} women, ${wholesaleProducts.length} wholesale)`)

  // ============================================================
  // 8. SAMPLE REVIEWS
  // ============================================================
  const allCreatedProducts = await prisma.product.findMany({ take: 10 })

  const sampleReviews = [
    { name: 'أحمد محمد', rating: 5, comment: 'منتج رائع! استخدمت زيت اللحية وكانت النتيجة مذهلة. اللحية أصبحت ناعمة ومرطبة.' },
    { name: 'سارة عبدالله', rating: 5, comment: 'أفضل سيروم فيتامين سي جربته. بشرتي أصبحت أكثر إشراقاً خلال أسبوعين فقط.' },
    { name: 'خالد العمري', rating: 4, comment: 'عطر جميل وثبات ممتاز. العبوة فاخرة وتليق كهدية.' },
    { name: 'نورة القحطاني', rating: 5, comment: 'الكريم الليلي رهيب! بشرتي أصبحت أنعم بشكل واضح. أنصح به بشدة.' },
    { name: 'محمد الشمري', rating: 4, comment: 'غسول الوجه بالفحم ممتاز للبشرة الدهنية. ينظف بعمق بدون جفاف.' },
    { name: 'فاطمة علي', rating: 5, comment: 'زيت الأرغان المغربي أصلي 100%. شعري أصبح أكثر لمعاناً وصحة.' },
    { name: 'عبدالعزيز الحربي', rating: 5, comment: 'مجموعة العناية الرجالية تستحق كل ريال. تغليف فاخر ومنتجات عالية الجودة.' },
    { name: 'مريم السعيد', rating: 4, comment: 'أحمر الشفاه ألوانه جميلة وثباته ممتاز. التوصيل كان سريعاً.' },
    { name: 'تركي المطيري', rating: 5, comment: 'تعاملت معهم في الجملة وكانت الأسعار منافسة جداً وجودة المنتجات ممتازة.' },
    { name: 'لطيفة الزهراني', rating: 5, comment: 'إسنس الحلزون الكوري غير بشرتي تماماً. أثر الحبوب اختفى تدريجياً.' },
    { name: 'سلطان القحطاني', rating: 4, comment: 'البوماد ممتاز للتصفيف اليومي. يثبت الشعر بدون ما يترك بقايا.' },
    { name: 'هند الشهري', rating: 5, comment: 'زبدة الجسم برائحة الفانيليا روعة. ترطب الجسم طول اليوم.' },
  ]

  for (let i = 0; i < sampleReviews.length; i++) {
    const product = allCreatedProducts[i % allCreatedProducts.length]
    await prisma.review.create({
      data: {
        productId: product.id,
        ...sampleReviews[i],
      },
    })
  }
  console.log(`✅ ${sampleReviews.length} sample reviews created`)

  // ============================================================
  // 9. SAMPLE ORDERS
  // ============================================================
  const sampleOrders = [
    {
      customerName: 'عبدالله العنزي',
      customerPhone: '966512345678',
      type: 'retail',
      status: 'delivered',
      items: [{ productId: allCreatedProducts[0].id, quantity: 2 }, { productId: allCreatedProducts[1].id, quantity: 1 }],
    },
    {
      customerName: 'منال الشمري',
      customerPhone: '966523456789',
      type: 'retail',
      status: 'confirmed',
      items: [{ productId: allCreatedProducts[3].id, quantity: 1 }, { productId: allCreatedProducts[5].id, quantity: 3 }],
    },
    {
      customerName: 'متجر أناقة للتجميل',
      customerPhone: '966534567890',
      type: 'wholesale',
      status: 'pending',
      items: [{ productId: allCreatedProducts[0].id, quantity: 12 }, { productId: allCreatedProducts[2].id, quantity: 24 }],
    },
    {
      customerName: 'فهد المالكي',
      customerPhone: '966545678901',
      type: 'retail',
      status: 'shipped',
      items: [{ productId: allCreatedProducts[4].id, quantity: 1 }],
    },
    {
      customerName: 'صالون روز للتجميل',
      customerPhone: '966556789012',
      type: 'wholesale',
      status: 'delivered',
      items: [{ productId: allCreatedProducts[6].id, quantity: 6 }, { productId: allCreatedProducts[7].id, quantity: 12 }],
    },
  ]

  for (const orderData of sampleOrders) {
    const { items, ...rest } = orderData
    let totalAmount = 0
    const orderItems: { productId: string; quantity: number; price: number }[] = []

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) continue
      const price = rest.type === 'wholesale' && product.wholesalePrice ? product.wholesalePrice : product.price
      totalAmount += price * item.quantity
      orderItems.push({ productId: item.productId, quantity: item.quantity, price })
    }

    await prisma.order.create({
      data: {
        ...rest,
        totalAmount,
        items: { create: orderItems },
      },
    })
  }
  console.log(`✅ ${sampleOrders.length} sample orders created`)

  console.log('\n🎉 Seed completed successfully!')
  console.log('   Admin: admin@alipro.com / Admin@123456')
  console.log(`   Products: ${allProducts.length} | Reviews: ${sampleReviews.length} | Orders: ${sampleOrders.length}`)
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
