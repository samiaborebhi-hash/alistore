import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function uploadProduct4() {
  console.log('🔄 جارٍ رفع وتعديل المنتجات بالصور المعدلة بصيغة JPG...')

  // 1. Update Product 1 with edited JPGs
  await db.product.update({
    where: { id: 'cms1ooqah00014yt82y3kxyoc' },
    data: {
      images: JSON.stringify([
        '/uploads/loose-eyeshadow-edited.jpg',
        '/uploads/loose-eyeshadow-luxury-edited.jpg',
      ]),
    },
  })

  // 2. Update Product 2 with edited JPGs
  await db.product.update({
    where: { id: 'cms1os43m0001131zsx4ww8rc' },
    data: {
      images: JSON.stringify([
        '/uploads/mayar-spray-edited.jpg',
        '/uploads/mayar-spray-luxury-edited.jpg',
      ]),
    },
  })

  // 3. Update Product 3 with edited JPGs
  await db.product.update({
    where: { id: 'cms1ouqs50001bddpsxm6lhiu' },
    data: {
      images: JSON.stringify([
        '/uploads/neutrogena-toner-edited.jpg',
      ]),
    },
  })

  // 4. Create Product 4 (Bioderma Sensibio Gel Moussant) with edited JPGs
  let category = await db.category.findUnique({ where: { slug: 'skincare' } })
  if (!category) category = await db.category.findFirst()

  const product4 = await db.product.create({
    data: {
      name: 'BIODERMA Sensibio Gel Moussant Cleansing Gel (200ml)',
      nameAr: 'غسول جل مهدئ ومطهر بيوديرما سينسيبيو للبشرة الحساسة (Bioderma Sensibio Gel Moussant)',
      descriptionAr: `اعتني ببشرتكِ الحساسة مع غسول الجل المهدئ والمطهر سينسيبيو من بيوديرما الفرنسية.
ينظف البشرة والعيون بفاعلية ولطف شديد، مهدئ للبشرة الحساسة والملتهبة، ومزود بتقنية الميسيلار الترطيبية التي تمنع الجفاف وتحافظ على رطوبة الجلد الطبيعية.

✨ المميزات الأساسية:
- ينظف الوجه والعينين بلطف ويقضي على الشوائب والمكياج.
- تركيبة مهدئة ومطهرة خالية من الصابون والعطور والبارابين.
- مرطب للبشرة ويحمي غشاء الرطوبة الطبيعي.
- ملائم جداً للبشرة الحساسة المعرضة للتهيج والاحمرار.`,
      description: 'BIODERMA Sensibio Gel Moussant soothing micellar cleansing foaming gel for sensitive skin 200ml',
      price: 0, // السعر متروك فارغاً حسب التعليمات
      wholesalePrice: null,
      stock: 45,
      categoryId: category!.id,
      isActive: true,
      isFeatured: true,
      images: JSON.stringify([
        '/uploads/bioderma-sensibio-edited.jpg',
        '/uploads/bioderma-sensibio-luxury-edited.jpg',
      ]),
      tags: JSON.stringify(['غسول', 'بيوديرما', 'سينسيبيو', 'بشرة حساسة', 'عناية بالوجه', 'غزة', 'توصيل منزلي']),
    },
  })

  console.log('✅ تم تحديث المنتجات 1 و 2 و 3 بالصور المعدلة JPG!')
  console.log('✅ تم رفع المنتج الرابع (بيوديرما سينسيبيو) بنجاح!')
  console.log('🆔 معرف المنتج 4:', product4.id)
  console.log('🔗 رابط المنتج 4:', `http://localhost:3000/product/${product4.id}`)
}

uploadProduct4()
  .catch(e => console.error('❌ خطأ في الرفع:', e.message))
  .finally(() => db.$disconnect())
