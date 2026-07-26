import { db } from '../src/lib/db'
import fs from 'fs'
import path from 'path'

async function redesignAndUnifyAll84() {
  const products = await db.product.findMany()
  console.log('Total products count to review and redesign:', products.length)

  const UNIFIED_PRICE = 50.0 // 50 شيكل موحد لجميع المنتجات

  // Sequential luxury cosmetic product templates
  const sequentialCatalog = [
    { name: 'آيشادو Ffiomror برّاق كريستالي فاخر', category: 'عيون', tag: 'Studio Glitter Edition' },
    { name: 'سبراي معطر ومزيل عرق ميار الفوّاح', category: 'عطور', tag: 'Fresh Rose Mist' },
    { name: 'تونر نيتروجينا مهدئ للبشرة الحساسة (0% كحول)', category: 'عناية', tag: 'Alcohol-Free Medical' },
    { name: 'غسول بيوديرما سينسيبيو رغوة مهدئة', category: 'غسول', tag: 'French Micellar Gel' },
    { name: 'مقشر وتونر باناوكسيل 2% ساليسيليك', category: 'علاج بثور', tag: 'Acne Exfoliant Care' },
    { name: 'جل لاروش ميلا بي3 لتوحيد لون البشرة', category: 'سيروم', tag: 'Mela B3 Niacinamide' },
    { name: 'رغوة لاروش بوزيه الميسيلار المنظفة', category: 'غسول', tag: 'Soothing Micellar Foam' },
    { name: 'ماسكارا روماننيك رين 3D الكثافة وسواد 3D', category: 'رموش', tag: '3D Smoky Eyes' },
    { name: 'مزيل ماسكارا كلين كوين السريع للرموش', category: 'عناية عيون', tag: 'Instant Mascara Remover' },
    { name: 'مبرد ومقلم الأظافر المزدوج للمانيكير', category: 'أظافر', tag: 'Professional Manicure' },
    { name: 'ماسكارا شيجلام فلوتر وينك المكثفة', category: 'رموش', tag: 'SHEGLAM Flutter Wink' },
    { name: 'طقم أقلام تحديد الحواجب MN (12 قطعة)', category: 'حواجب', tag: 'MN Waterproof 24H' },
    { name: 'أيلاينر قلم تحديد العيون فاحم روماننيك رين', category: 'عيون', tag: 'Precision Animal Eyeliner' },
    { name: 'أحمر شفاه وملمع 2 في 1 من شيجلام', category: 'شفاه', tag: 'SHEGLAM 2in1 Matte Gloss' },
    { name: 'طقم روج وملمع رير بيوتي المخملي (6 قطع)', category: 'شفاه', tag: 'Rare Beauty Velvet Set' }
  ]

  for (let i = 0; i < products.length; i++) {
    const p = products[i]
    const catTpl = sequentialCatalog[i % sequentialCatalog.length]

    const seqNum = i + 1
    const refinedName = `${catTpl.name} - الوجبة ${seqNum}`

    let imgs: string[] = []
    try {
      imgs = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images as string[]) || []
    } catch {
      imgs = [p.images as string]
    }
    if (!imgs.length) imgs = ['/uploads/loose-eyeshadow-edited.jpg']

    // Ensure unified price and clean Gaza delivery description
    const unifiedDescription = `✨ ${refinedName} ✨\n\n💎 منتج تجميل وعناية أصلي 100% يمنحكِ نتائج مدهشة وإشراقة طبيعية ساحرة.\n🌿 مناسب تماماً لجميع أنواع البشرة.\n🏷️ السعر الموحد المميز: 50 شيكل فقط! 🏷️\n\n🚗 التوصيل السريع متوفر حتى باب المنزل في جميع مناطق قطاع غزة! 🇵🇸\n\n👇 اطلبي منتجكِ الآن عبر الموقع الرسمي:\nhttps://novapure.beauty\n\n#مكياج_غزة #تجميل_غزة #نوفا_بيور #توصيل_غزة #غزة`

    await db.product.update({
      where: { id: p.id },
      data: {
        name: refinedName,
        nameAr: refinedName,
        price: UNIFIED_PRICE,
        description: unifiedDescription,
        descriptionAr: `منتج أصلي بسعر موحد 50 شيكل وتوصيل سريع حتى باب المنزل في قطاع غزة.`
      }
    })
  }

  console.log('✅ Updated all 84 DB products with UNIFIED PRICE (50 NIS) and sequential luxury titles!')
}

redesignAndUnifyAll84()
