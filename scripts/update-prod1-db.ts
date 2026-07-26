import { db } from '../src/lib/db';

async function updateProduct1InDb() {
  const images = [
    '/uploads/somebymi-clear-foam-white.png',
    '/uploads/somebymi-clear-foam-ad.png',
    '/uploads/00ef1b63-eb31-4aba-a1bf-e5d84249545e.jpg'
  ];

  const desc = `✨ غسول سوم باي مي الرغوي لعلاج حب الشباب وتصفية البشرة 🌿

الحل الكوري الفعّال لبشرة صافية ونقية خالية من الشوائب والدهون الزائدة! يحتوي على أحماض AHA, BHA, PHA مع خلاصة شجرة الشاي وخلاصة السنتيلا المهدئة.

🚚 متوفر خدمة التوصيل السريع حتى باب المنزل في جميع مناطق قطاع غزة 🇵🇸

#نوفا_كوزمتيكس #سوم_باي_مي #عناية_بالبشرة #حب_الشباب #غزة #توصيل_غزة`;

  let cat = await db.category.findFirst({ where: { slug: 'skincare' } });
  if (!cat) {
    cat = await db.category.create({
      data: { name: 'العناية بالبشرة', slug: 'skincare' }
    });
  }

  const existing = await db.product.findFirst({
    where: { name: { contains: 'سوم باي مي' } }
  });

  if (existing) {
    await db.product.update({
      where: { id: existing.id },
      data: {
        name: 'غسول سوم باي مي الرغوي لحب الشباب AHA BHA PHA 30 Days (100ml)',
        nameAr: 'غسول سوم باي مي الرغوي لحب الشباب AHA BHA PHA 30 Days (100ml)',
        description: desc,
        descriptionAr: desc,
        images: JSON.stringify(images),
        isActive: true,
        categoryId: cat.id
      }
    });
    console.log('✅ Updated Product #1 in Database:', existing.id);
  } else {
    const created = await db.product.create({
      data: {
        name: 'غسول سوم باي مي الرغوي لحب الشباب AHA BHA PHA 30 Days (100ml)',
        nameAr: 'غسول سوم باي مي الرغوي لحب الشباب AHA BHA PHA 30 Days (100ml)',
        description: desc,
        descriptionAr: desc,
        price: 0,
        images: JSON.stringify(images),
        isActive: true,
        categoryId: cat.id
      }
    });
    console.log('✅ Created Product #1 in Database:', created.id);
  }
}

updateProduct1InDb();
