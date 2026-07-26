import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const db = new PrismaClient()

async function fixImages() {
  console.log('🛠️ جارٍ فحص وتصليح جميع مسارات وصور المنتجات...')

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }

  // 1. Fix Product 1 (Loose Eyeshadow)
  const p1ImageSrc = 'C:\\Users\\zizo-\\OneDrive\\Desktop\\منتجات\\WhatsApp Image 2026-07-25 at 3.12.41 PM.jpeg'
  const p1ImageDest = path.join(uploadsDir, 'loose-eyeshadow.jpeg')
  if (fs.existsSync(p1ImageSrc)) {
    fs.copyFileSync(p1ImageSrc, p1ImageDest)
    console.log('✅ تم نسخ صورة المنتج الأول إلى public/uploads/loose-eyeshadow.jpeg')
  }

  await db.product.update({
    where: { id: 'cms1ooqah00014yt82y3kxyoc' },
    data: {
      images: JSON.stringify(['/uploads/loose-eyeshadow.jpeg']),
    },
  })

  // 2. Fix Product 2 (MAYAR Spray)
  const p2ImageSrc = 'C:\\Users\\zizo-\\OneDrive\\Desktop\\منتجات\\WhatsApp Image 2026-07-25 at 3.13.51 PM.jpeg'
  const p2ImageDest = path.join(uploadsDir, 'mayar-spray.jpeg')
  if (fs.existsSync(p2ImageSrc)) {
    fs.copyFileSync(p2ImageSrc, p2ImageDest)
    console.log('✅ تم نسخ صورة المنتج الثاني إلى public/uploads/mayar-spray.jpeg')
  }

  await db.product.update({
    where: { id: 'cms1os43m0001131zsx4ww8rc' },
    data: {
      images: JSON.stringify(['/uploads/mayar-spray.jpeg']),
    },
  })

  console.log('🎉 تم إصلاح الصور وتأكيد وجودها في مجلد public/uploads بنجاح!')
}

fixImages()
  .catch(e => console.error('❌ خطأ:', e.message))
  .finally(() => db.$disconnect())
