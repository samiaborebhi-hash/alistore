import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const db = new PrismaClient()

async function uploadProduct1() {
  console.log('🔄 جارٍ تجهيز ورفع المنتج الأول إلى المتجر...')

  // Ensure public/uploads folder exists
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }

  // Copy original image
  const origImageSrc = 'C:\\Users\\zizo-\\OneDrive\\Desktop\\منتجات\\WhatsApp Image 2026-07-25 at 3.12.41 PM.jpeg'
  const origImageDest = path.join(uploadsDir, 'loose-eyeshadow-orig.jpeg')
  if (fs.existsSync(origImageSrc)) {
    fs.copyFileSync(origImageSrc, origImageDest)
  }

  // Copy generated AI images if existing
  const aiMainSrc = 'C:\\Users\\zizo-\\.\\gemini\\antigravity\\brain\\88a88524-2feb-428f-adf9-abab67861dd8\\loose_eyeshadow_main_1785063416558.png'
  const aiMainDest = path.join(uploadsDir, 'loose-eyeshadow-main.png')
  if (fs.existsSync(aiMainSrc)) {
    fs.copyFileSync(aiMainSrc, aiMainDest)
  }

  const aiLuxSrc = 'C:\\Users\\zizo-\\.\\gemini\\antigravity\\brain\\88a88524-2feb-428f-adf9-abab67861dd8\\loose_eyeshadow_luxury_1785063430013.png'
  const aiLuxDest = path.join(uploadsDir, 'loose-eyeshadow-luxury.png')
  if (fs.existsSync(aiLuxSrc)) {
    fs.copyFileSync(aiLuxSrc, aiLuxDest)
  }

  const imagesList = [
    '/uploads/loose-eyeshadow-main.png',
    '/uploads/loose-eyeshadow-luxury.png',
    '/uploads/loose-eyeshadow-orig.jpeg',
  ]

  // Find or use category "makeup"
  let category = await db.category.findUnique({ where: { slug: 'makeup' } })
  if (!category) {
    category = await db.category.findFirst()
  }

  if (!category) {
    throw new Error('No category found!')
  }

  // Insert product
  const product = await db.product.create({
    data: {
      name: 'Ffiomror Loose Eyeshadow Magic Colour Shiner',
      nameAr: 'آيشادو وبرايل اآيشاينر السائب Magic Colour Shiner (ثبات 12 ساعة)',
      descriptionAr: `امنحي عينيك إشراقة ساحرة ولفتة أنثوية لا تُقاوم مع آيشادو واآيشاينر Ffiomror السائب.
تركيبة مميزة غنية بـ فيتامين E و C تضمن لكِ لمعة ماسية براقة تدوم حتى 12 ساعة متواصلة بدون أي تكتل.

✨ المميزات الأساسية:
- ثبات عالي يصل إلى 12 ساعة.
- غني بالفيتامينات المغذية لحماية بشرة الجفون.
- متعدد الاستخدامات: للجفون، مدمع العين، أو كهايلايتر للإضاءة.
- جزيئات ناعمة جداً وسهلة الدمج والتوزيع.`,
      description: 'Loose Eyeshadow Magic Colour Shiner 12Hrs with Vitamin E/C',
      price: 0, // السعر متروك فارغاً حسب التعليمات
      wholesalePrice: null,
      stock: 50,
      categoryId: category.id,
      isActive: true,
      isFeatured: true,
      images: JSON.stringify(imagesList),
      tags: JSON.stringify(['آيشادو', 'هايلايتر', 'مكياج عيون', 'شاينر', 'غزة', 'توصيل منزلي']),
    },
  })

  console.log('✅ تم رفع المنتج بنجاح إلى المتجر!')
  console.log('🆔 معرف المنتج:', product.id)
  console.log('🔗 رابط المنتج:', `http://localhost:3000/product/${product.id}`)
}

uploadProduct1()
  .catch(e => console.error('❌ خطأ في الرفع:', e.message))
  .finally(() => db.$disconnect())
