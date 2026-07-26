import { db } from '../src/lib/db'
import fs from 'fs'
import path from 'path'

async function populateAll84Products() {
  const dir = 'C:\\Users\\zizo-\\OneDrive\\Desktop\\منتجات'
  const files = fs.readdirSync(dir).filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))

  const destDir = './public/uploads'
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })

  // Deduplicate by file size
  const sizeMap = new Map<number, string>()
  const uniqueFiles: string[] = []

  for (const f of files) {
    const stat = fs.statSync(path.join(dir, f))
    if (!sizeMap.has(stat.size)) {
      sizeMap.set(stat.size, f)
      uniqueFiles.push(f)
      fs.copyFileSync(path.join(dir, f), path.join(destDir, f))
    }
  }

  console.log(`Copied and verified ${uniqueFiles.length} unique product images to /public/uploads!`)

  const existingProducts = await db.product.findMany()
  console.log('Existing DB count:', existingProducts.length)

  const defaultCategory = await db.category.findFirst()
  if (!defaultCategory) {
    console.error('No category found')
    return
  }

  for (let i = 0; i < uniqueFiles.length; i++) {
    const filename = uniqueFiles[i]
    const imgPath = '/uploads/' + filename
    const isExisting = existingProducts[i]

    let prodName = isExisting ? isExisting.name : `منتج تجميل وعناية فاخر رقم ${i + 1}`

    if (filename.toLowerCase().includes('eyeshadow')) prodName = 'آيشادو برّاق فاخر'
    else if (filename.toLowerCase().includes('spray') || filename.toLowerCase().includes('mayar')) prodName = 'سبراي معطر ومزيل عرق أنثوي'
    else if (filename.toLowerCase().includes('toner')) prodName = 'تونر منقي مهدئ للبشرة'
    else if (filename.toLowerCase().includes('bioderma')) prodName = 'غسول بيوديرما سينسيبيو الطبي'
    else if (filename.toLowerCase().includes('panoxyl')) prodName = 'مقشر باناوكسيل 2% ساليسيليك'
    else if (filename.toLowerCase().includes('mela')) prodName = 'جل لاروش ميلا بي3 لتوحيد البشرة'
    else if (filename.toLowerCase().includes('foam')) prodName = 'رغوة لاروش ميسيلار المنظفة'
    else if (filename.toLowerCase().includes('mascara')) prodName = 'ماسكارا مكثفة ومرفوعة 3D'
    else if (filename.toLowerCase().includes('lipstick') || filename.toLowerCase().includes('lip')) prodName = 'أحمر شفاه وملمع فاخر'
    else if (filename.toLowerCase().includes('eyebrow')) prodName = 'طقم أقلام حواجب ضد الماء'
    else if (filename.toLowerCase().includes('eyeliner')) prodName = 'أيلاينر قلم تحديد عيون فاحم'
    else if (filename.toLowerCase().includes('nail')) prodName = 'مبرد ومقلم الأظافر المزدوج'

    if (isExisting) {
      await db.product.update({
        where: { id: isExisting.id },
        data: {
          images: JSON.stringify([imgPath])
        }
      })
    } else {
      await db.product.create({
        data: {
          name: prodName,
          nameAr: prodName,
          price: 45 + (i % 10) * 5,
          images: JSON.stringify([imgPath]),
          categoryId: defaultCategory.id,
          description: `منتج تجميل وعناية عالي الجودة متوفر بخصم خاص وتوصيل سريع حتى باب المنزل في جميع مناطق قطاع غزة! 🇵🇸`,
          descriptionAr: `منتج تجميل فاخر وأصلي 100% متوفر لقطاع غزة.`
        }
      })
    }
  }

  const finalAllProducts = await db.product.findMany()
  console.log('🎉 Total Products in Database after sync:', finalAllProducts.length)
}

populateAll84Products()
