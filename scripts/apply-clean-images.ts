import fs from 'fs';
import path from 'path';
import { db } from '../src/lib/db';

async function processCleanProducts() {
  const srcDir = 'C:\\Users\\zizo-\\OneDrive\\Desktop\\منتجات';
  const destDir = './public/uploads';

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f) && !f.includes('Copy') && !f.includes('(1)'));
  console.log('Total unique raw product files found:', files.length);

  for (const file of files) {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    fs.copyFileSync(srcFile, destFile);
  }
  console.log('✅ Clean raw product photos copied to public/uploads');

  const dbProducts = await db.product.findMany();
  console.log('Database products count:', dbProducts.length);

  for (let i = 0; i < dbProducts.length; i++) {
    const p = dbProducts[i];
    const rawFile = files[i % files.length];
    const cleanImgPath = '/uploads/' + rawFile;

    const caption = `✨ ${p.name} ✨
  
🛍️ السعر الموحد: 50 شيكل فقط!
🚚 متوفر خدمة التوصيل السريع لجميع مناطق قطاع غزة 🇵🇸

💎 المميزات والمواصفات:
• منتج أصلي 100% يضمن لكِ أفضل عناية وجمال.
• جودة عالية ونتائج ملحوظة من أول استخدام.
• العرض لفترة محدودة، اطلبي الآن قبل نفاد الكمية!

📲 للطلب والاستفسار: اطلبي المباشر عبر الدايركت مسج أو واتساب!

#نوفا_كوزمتيكس #جمال #عناية #غزة #منتجات_تجميل #توصيل_غزة #مكياج #NOVA_COSMETICS`;

    await db.product.update({
      where: { id: p.id },
      data: {
        price: 50,
        images: JSON.stringify([cleanImgPath]),
        description: caption,
        descriptionAr: caption
      }
    });
  }

  console.log('✅ Updated all products in database with clean images and rich captions!');
}

processCleanProducts();
