import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function uploadAllRemaining() {
  console.log('🔄 جارٍ رفع وتفعيل جميع المنتجات الـ 15 المكتملة في المتجر الإلكتروني...')

  let skincareCat = await db.category.findUnique({ where: { slug: 'skincare' } })
  let makeupCat = await db.category.findUnique({ where: { slug: 'makeup' } })

  if (!skincareCat) skincareCat = await db.category.findFirst()
  if (!makeupCat) makeupCat = skincareCat

  const skincareId = skincareCat!.id
  const makeupId = makeupCat!.id

  const productsToUpload = [
    // Product 5: PanOxyl Exfoliant
    {
      name: 'PanOxyl Clarifying Exfoliant 2% Salicylic Acid (118ml)',
      nameAr: 'مقشر وتونر باناوكسيل 2% حمض الساليسيليك لعلاج حب الشباب (PanOxyl Clarifying Exfoliant)',
      descriptionAr: `تخلصي من حب الشباب والبثور السوداء واستعيدي نقاء بشرتك مع مقشر باناوكسيل المنظف بحمض الساليسيليك بتركيز 2%.
ينظف المسام بفتحات عميقة، يمنع انسدادها، ويحتوي على الطحالب الزرقاء ومضادات الأكسدة لتهدئة التهيج والاهتمام ببشرتك.

✨ المميزات:
- تركيبة خالية من الكحول (Gentle Alcohol-Free).
- يعالج ويمنع تكون حب الشباب ويقلل حجم المسام.
- يحتوي على 2% Salicylic Acid المثبت علمياً.
- يهدئ احمرار البشرة والتهابها.`,
      description: 'PanOxyl Clarifying Exfoliant 2% Salicylic Acid 118ml',
      price: 0,
      categoryId: skincareId,
      images: ['/uploads/panoxyl-toner-edited.jpg', '/uploads/panoxyl-toner-orig.jpg'],
      tags: ['باناوكسيل', 'حب الشباب', 'تقشير', 'ساليسيليك', 'غزة', 'توصيل منزلي']
    },
    // Product 6: La Roche-Posay Mela B3
    {
      name: 'La Roche-Posay MELA B3 Micro-Peeling Gel Cleanser (200ml)',
      nameAr: 'جل ومقشر لاروش بوزيه ميلا بي3 لتوحيد لون البشرة (La Roche-Posay Mela B3 Gel)',
      descriptionAr: `عالجي التصبغات والبقع الداكنة واحطلي على بشرة موحدة ومشرقة مع جل المقشر المصغر ميلا بي3 من لاروش بوزيه الفرنسية.
مزود بـ Niacinamide ومادة Melasyl المبتكرة لتقشير الخلايا الميتة ولطف توحيد لون البشرة.

✨ المميزات:
- يقضي على التصبغات والبقع الداكنة.
- غني بـ النياسيناميد (Vitamin B3) لترطيب وتفتيح البشرة.
- تركيبة طبية فرنسية فائقة الجودة لجميع أنواع البشرة.`,
      description: 'La Roche-Posay MELA B3 Micro-Peeling Clarifying Unifying Gel 200ml',
      price: 0,
      categoryId: skincareId,
      images: ['/uploads/laroche-mela-b3-edited.jpg', '/uploads/laroche-mela-b3-orig.jpg'],
      tags: ['لاروش بوزيه', 'تفتيح', 'تصبغات', 'ميلا بي3', 'غزة', 'توصيل منزلي']
    },
    // Product 7: La Roche-Posay Micellar Foaming Water
    {
      name: 'La Roche-Posay Cleansing Micellar Foaming Water (150ml)',
      nameAr: 'رغوة لاروش بوزيه ميسيلار المنظفة للبشرة الحساسة (La Roche-Posay Micellar Foam)',
      descriptionAr: `انتعاش ونظافة فائقة للوجه مع رغوة الميسيلار المهدئة من لاروش بوزيه.
تزيل الشوائب والمكياج بلطف، تحافظ على توازن PH الطبيعي، ومخصصة للبشرة الحساسة.

✨ المميزات:
- رغوة خفيفة وناعمة جداً على الجلد.
- خالية من الصابون والمواد الحافظة القاسية.
- تترك البشرة ناعمة ومنتعشة بدون جفاف.`,
      description: 'La Roche-Posay Cleansing Micellar Foaming Water for Sensitive Skin 150ml',
      price: 0,
      categoryId: skincareId,
      images: ['/uploads/laroche-micellar-foam-edited.jpg', '/uploads/laroche-micellar-foam-orig.jpg'],
      tags: ['لاروش بوزيه', 'رغوة ميسيلار', 'بشرة حساسة', 'غسول', 'غزة', 'توصيل منزلي']
    },
    // Product 8: Romantic Rain 3D Smoky Eyes Mascara
    {
      name: 'Romantic Rain 3D Smoky Eyes Mascara',
      nameAr: 'ماسكارا روماننيك رين ثلاثية الأبعاد 3D لتكثيف الرموش (Romantic Rain Mascara)',
      descriptionAr: `احصلي على رموش كثيفة وطويلة كأنها اصطناعية مع ماسكارا روماننيك رين ثلاثية الأبعاد 3D Smoky Eyes.
سواد فاحم، مقاومة للتكتل والماء، وتمنح عيونك إطلالة سموكي ساحرة طوال اليوم.

✨ المميزات:
- كثافة وطول مضاعف للرموش من أول مسحة.
- لون أسود كاحل وثبات عالي.
- فرشاة دقيقة تصل لكافة شعيرات الرموش.`,
      description: 'Romantic Rain 3D Smoky Eyes Mascara deep black waterproof',
      price: 0,
      categoryId: makeupId,
      images: ['/uploads/romantic-rain-mascara-edited.jpg', '/uploads/romantic-rain-mascara-orig.jpg'],
      tags: ['ماسكارا', 'روماننيك رين', 'مكياج عيون', 'تكثيف الرموش', 'غزة', 'توصيل منزلي']
    },
    // Product 9: Clean Queen Mascara Remover
    {
      name: 'Clean Queen Instant Mascara Remover',
      nameAr: 'مزيل ماسكارا كلين كوين السريع للرموش (Clean Queen Mascara Remover)',
      descriptionAr: `أزيلت أصعب أنواع الماسكارا والماسكارا المقاومة للماء في ثوانٍ معدودة وبدون أي تساقط لرموشكِ مع مزيل كلين كوين السريع!

✨ المميزات:
- إزالة فورية وسريعة للماسكارا والماسكارا الفاحمة.
- يحمي الرموش من التساقط والكسر أثناء إزالة المكياج.
- تركيبة مغذية ولطيفة جداً على محيط العينين.`,
      description: 'Clean Queen Instant Mascara Remover for waterproof mascaras',
      price: 0,
      categoryId: makeupId,
      images: ['/uploads/clean-queen-remover-orig.jpg'],
      tags: ['مزيل ماسكارا', 'كلين كوين', 'إزالة المكياج', 'عناية بالرموش', 'غزة', 'توصيل منزلي']
    },
    // Product 10: Jiabaiyusi Nail File Tool
    {
      name: 'Jiabaiyusi Professional Manicure & Nail File Tool',
      nameAr: 'مبرد ومقلم الأظافر الاحترافي المزدوج للمانيكير (Jiabaiyusi Nail File)',
      descriptionAr: `أداة المانيكير ومبرد الأظافر الاحترافية مزدوجة الجوانب لقص وتحديد وتقليم الأظافر بنعومة وجاذبية في المنزل.

✨ المميزات:
- جانبين للبرد والتقليم والتهذيب السريع.
- أداة لتنظيف الزوائد اللحمية بدقة.
- مقبض مريح وسهل الاستخدام.`,
      description: 'Jiabaiyusi Professional Manicure & Nail File Tool double with sharp',
      price: 0,
      categoryId: makeupId,
      images: ['/uploads/nail-file-orig.jpg'],
      tags: ['مبرد أظافر', 'مانيكير', 'عناية بالأظافر', 'أدوات تجميل', 'غزة', 'توصيل منزلي']
    },
    // Product 11: Sheglam Flutter Wink Mascara
    {
      name: 'SHEGLAM Flutter Wink Volumizing Mascara (8ml)',
      nameAr: 'ماسكارا شيجلام فلوتر وينك المكثفة للرموش (SHEGLAM Flutter Wink Mascara)',
      descriptionAr: `تألقي برموش مرفوعة ومكثفة بدرجة خيالية مع ماسكارا شيجلام فلوتر وينك الفاخرة!
تضمن لكِ ثباتاً طوال اليوم، لون أسود غني، وفرشاة مبتكرة لرفع كل رمش على حدة.

✨ المميزات:
- تكثيف ورفع درامي للرموش بدون تكتل.
- عبوة فضية وأرجوانية أنيقة جداً.
- مقاومة للماء واللطخات طوال اليوم.`,
      description: 'SHEGLAM Flutter Wink Volumizing Mascara 8ml',
      price: 0,
      categoryId: makeupId,
      images: ['/uploads/sheglam-mascara-edited.jpg', '/uploads/sheglam-mascara-orig.jpg'],
      tags: ['شيجلام', 'ماسكارا', 'فلوتر وينك', 'مكياج عيون', 'غزة', 'توصيل منزلي']
    },
    // Product 12: MN Eyebrow Pencil Set
    {
      name: 'MN MeNow Perfect Waterproof Eyebrow Pencil Set (12 Pcs)',
      nameAr: 'طقم أقلام تحديد الحواجب ضد الماء إم إن 12 قطعة (MN MeNow Eyebrow Pencils)',
      descriptionAr: `مجموعة أقلام رسم وتحديد الحواجب الاحترافية المقاومة للماء والعرَق من MeNow.
تأتي مع مشط وغطاء واقي لرسم شعر بالحواجب بدقة طبيعية وثبات يمتد لـ 24 ساعة.

✨ المميزات:
- 12 قلم تحديد حواجب بألوان طبيعية جذابة.
- ثبات ضد الماء ولا يسيل.
- سهل الرسم وتعبئة الفراغات بدقة.`,
      description: 'MN MeNow Perfect Waterproof & Longlasting Eyebrow Pencil Set 12 Pcs',
      price: 0,
      categoryId: makeupId,
      images: ['/uploads/mn-eyebrow-orig.jpg'],
      tags: ['قلم حواجب', 'إم إن', 'MeNow', 'مكياج حواجب', 'غزة', 'توصيل منزلي']
    },
    // Product 13: Romantic Rain Animal Soft Eyeliner
    {
      name: 'Romantic Rain Animal Soft Waterproof Eyeliner',
      nameAr: 'أيلاينر قلم تحديد العيون روماننيك رين مقاوم للماء (Romantic Rain Eyeliner)',
      descriptionAr: `ارسمي أيلاينر كحل العيون بدقة وسواد فاحم لا يُمحى مع قلم أيلاينر روماننيك رين الناعم.
فرشاة مدببة فائقة الدقة تحكم كامل في سمك الخط وثبات ضد الماء.

✨ المميزات:
- ريشة ناعمة سهلة التحكم للرسم الدقيق.
- ثبات عالي جداً وسواد فاحم بلمعة جافة.
- مناسب للمبتدئات والمحترفات.`,
      description: 'Romantic Rain Animal Soft Waterproof Eyeliner',
      price: 0,
      categoryId: makeupId,
      images: ['/uploads/romantic-rain-eyeliner-orig.jpg'],
      tags: ['أيلاينر', 'روماننيك رين', 'كحل عيون', 'مكياج عيون', 'غزة', 'توصيل منزلي']
    },
    // Product 14: Sheglam 2 in 1 Lipstick
    {
      name: 'SHEGLAM 2 in 1 Double Head Matte Lipstick & Lip Gloss',
      nameAr: 'أحمر شفاه وملمع 2 في 1 مزدوج من شيجلام (SHEGLAM 2 in 1 Lipstick)',
      descriptionAr: `منتج مزدوج يجمع بين الروج المات المطفي والملمع Gloss البراق في قلم واحد من شيجلام!
تغطية مخملية ثابته تدوم طويلاً وترطيب ناعم للشفتين.

✨ المميزات:
- 2 في 1: جانب مطفي Matte وجانب ملمع Gloss.
- ثبات عالي وألوان دافئة ومغرية.
- خفيف على الشفاه ولا يسبب تشققات.`,
      description: 'SHEGLAM 2 in 1 Double Head Matte Lipstick and Liquid Lip Gloss',
      price: 0,
      categoryId: makeupId,
      images: ['/uploads/sheglam-lipstick-orig.jpg'],
      tags: ['شيجلام', 'روج', 'أحمر شفاه', 'ملمع شفاه', 'غزة', 'توصيل منزلي']
    },
    // Product 15: Rare Beauty 6-Pcs Velvet Lipstick Set
    {
      name: 'Rare Beauty 6-Pcs Velvet Liquid Lipstick Set',
      nameAr: 'مجموعة أحمر شفاه وملمع رير بيوتي المخملي 6 ألوان (Rare Beauty Velvet Set)',
      descriptionAr: `طقم رير بيوتي الفاخر الذي يجمع 6 درجات أنثوية جذابة من الروج المخملي والملمع الزيتي المنعش.
تركيبة خالية من الزيوت الثقيلة (Oil-Free)، تمنح شفتيكِ مظهر ممتلئ وناعم بثبات خيالي.

✨ المميزات:
- 6 درجات متنوعة تلائم كل إطلالاتكِ ومناسباتكِ.
- ملمس مخملي خفيف ترطيب يدوم طوال اليوم.
- تصميم العبوة والغطاء الذهبي الجذاب والفاخر.`,
      description: 'Rare Beauty 6-Pcs Velvet Liquid Lipstick & Oil Free Gloss Set',
      price: 0,
      categoryId: makeupId,
      images: ['/uploads/rare-beauty-lipsticks-edited.jpg', '/uploads/rare-beauty-lipsticks-orig.jpg'],
      tags: ['رير بيوتي', 'Rare Beauty', 'طقم روج', 'أحمر شفاه', 'غزة', 'توصيل منزلي']
    }
  ]

  for (const p of productsToUpload) {
    const created = await db.product.create({
      data: {
        name: p.name,
        nameAr: p.nameAr,
        descriptionAr: p.descriptionAr,
        description: p.description,
        price: p.price,
        wholesalePrice: null,
        stock: 50,
        categoryId: p.categoryId,
        isActive: true,
        isFeatured: true,
        images: JSON.stringify(p.images),
        tags: JSON.stringify(p.tags),
      }
    })
    console.log(`✅ تم رفع: ${p.nameAr} | ID: ${created.id}`)
  }

  console.log('🎉 تم رفع وتفعيل جميع المنتجات الـ 15 بنجاح على المتجر الإلكتروني!')
}

uploadAllRemaining()
  .catch(e => console.error('❌ خطأ:', e.message))
  .finally(() => db.$disconnect())
