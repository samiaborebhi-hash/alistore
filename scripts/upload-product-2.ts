import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const db = new PrismaClient()

async function uploadProduct2() {
  console.log('🔄 جارٍ رفع المنتج الثاني (معطر ومزيل عرق ميار) إلى المتجر...')

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

  // Copy original image
  const origImageSrc = 'C:\\Users\\zizo-\\OneDrive\\Desktop\\منتجات\\WhatsApp Image 2026-07-25 at 3.13.51 PM.jpeg'
  const origImageDest = path.join(uploadsDir, 'mayar-spray-orig.jpeg')
  if (fs.existsSync(origImageSrc)) fs.copyFileSync(origImageSrc, origImageDest)

  // Copy generated AI images
  const aiMainSrc = 'C:\\Users\\zizo-\\.\\gemini\\antigravity\\brain\\88a88524-2feb-428f-adf9-abab67861dd8\\mayar_spray_main_1785063578017.png'
  const aiMainDest = path.join(uploadsDir, 'mayar-spray-main.png')
  if (fs.existsSync(aiMainSrc)) fs.copyFileSync(aiMainSrc, aiMainDest)

  const aiLuxSrc = 'C:\\Users\\zizo-\\.\\gemini\\antigravity\\brain\\88a88524-2feb-428f-adf9-abab67861dd8\\mayar_spray_luxury_1785063590739.png'
  const aiLuxDest = path.join(uploadsDir, 'mayar-spray-luxury.png')
  if (fs.existsSync(aiLuxSrc)) fs.copyFileSync(aiLuxSrc, aiLuxDest)

  const imagesList = [
    '/uploads/mayar-spray-main.png',
    '/uploads/mayar-spray-luxury.png',
    '/uploads/mayar-spray-orig.jpeg',
  ]

  let category = await db.category.findUnique({ where: { slug: 'skincare' } })
  if (!category) category = await db.category.findFirst()

  const product = await db.product.create({
    data: {
      name: 'MAYAR Deodorant & Fragrance Spray',
      nameAr: 'سبراي معطر ومزيل عرق ميار الفاخر (MAYAR Deodorant Spray)',
      descriptionAr: `استمتعي برائحة أنثوية ساحرة وانتعاش فريد يدوم طوال اليوم مع سبراي معطر ومزيل العرق "ميار" (MAYAR).
يمنحكِ حماية فائقة ورائحة عطرية جذابة تجمع بين نفحات الأزهور الرقيقة واللمسات العطرية الناعمة.

✨ المميزات الأساسية:
- حماية وعطر يمنحكِ ثقة وانتعاشاً يدوم طويلاً.
- يمنع روائح العرق الكريهة بلطف ودون تهيج البشرة.
- تركيبة خفيفة آمنة للاستخدام اليومي المباشر.
- عبوة أنيقة بلمسات وردية وذهبية فاخرة.`,
      description: 'MAYAR Deodorant Body Spray by Lattafa',
      price: 0,
      wholesalePrice: null,
      stock: 40,
      categoryId: category!.id,
      isActive: true,
      isFeatured: true,
      images: JSON.stringify(imagesList),
      tags: JSON.stringify(['عطور', 'مزيل عرق', 'سبراي ميار', 'عناية نسائية', 'غزة', 'توصيل منزلي']),
    },
  })

  console.log('✅ تم رفع المنتج الثاني بنجاح إلى المتجر!')
  console.log('🆔 معرف المنتج:', product.id)
  console.log('🔗 رابط المنتج:', `http://localhost:3000/product/${product.id}`)
}

uploadProduct2()
  .catch(e => console.error('❌ خطأ في الرفع:', e.message))
  .finally(() => db.$disconnect())
