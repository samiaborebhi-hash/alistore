import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const db = new PrismaClient()

async function uploadProduct3() {
  console.log('🔄 جارٍ رفع المنتج الثالث (تونر نيتروجينا للبشرة الحساسة) إلى المتجر...')

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

  // Copy original image directly
  const origImageSrc = 'C:\\Users\\zizo-\\OneDrive\\Desktop\\منتجات\\WhatsApp Image 2026-07-25 at 3.14.01 PM.jpeg'
  const origImageDest = path.join(uploadsDir, 'neutrogena-toner.jpeg')
  if (fs.existsSync(origImageSrc)) fs.copyFileSync(origImageSrc, origImageDest)

  const imagesList = ['/uploads/neutrogena-toner.jpeg']

  let category = await db.category.findUnique({ where: { slug: 'skincare' } })
  if (!category) category = await db.category.findFirst()

  const product = await db.product.create({
    data: {
      name: 'Neutrogena Ultra Gentle Alcohol-Free Toner (150ml)',
      nameAr: 'تونر نيتروجينا الترا جينتل الخالي من الكحول للبشرة الحساسة (Neutrogena Ultra Gentle Toner)',
      descriptionAr: `استعيدي توازن ونقاء بشرتكِ مع تونر نيتروجينا الفائق النعومة والخالي تماماً من الكحول.
مطور باختبار أطباء الجلدية ومزود بـ 5% جليسرين لترطيب البشرة الحساسة وتنظيف المسام دون تجريد الجلد من حاجز الرطوبة الطبيعي.

✨ المميزات الأساسية:
- خالي 100% من الكحول ولا يسبب أي جفاف أو تهيج.
- يتكون من 5% جليسرين مرطب لإنعاش البشرة الحساسة.
- ينقي المسام وينعش البشرة ويحمي حاجز الترطيب الطبيعي.
- تركيبة غير معطرة (Fragrance-Free) مخصصة للبشرة الأكثر حساسية.`,
      description: 'Neutrogena Ultra Gentle Alcohol-Free Toner with 5% Glycerin for sensitive skin 150ml',
      price: 0,
      wholesalePrice: null,
      stock: 35,
      categoryId: category!.id,
      isActive: true,
      isFeatured: true,
      images: JSON.stringify(imagesList),
      tags: JSON.stringify(['تونر', 'نيتروجينا', 'عناية بالبشرة', 'بشرة حساسة', 'غزة', 'توصيل منزلي']),
    },
  })

  console.log('✅ تم رفع المنتج الثالث بنجاح إلى المتجر!')
  console.log('🆔 معرف المنتج:', product.id)
  console.log('🔗 رابط المنتج:', `http://localhost:3000/product/${product.id}`)
}

uploadProduct3()
  .catch(e => console.error('❌ خطأ في الرفع:', e.message))
  .finally(() => db.$disconnect())
