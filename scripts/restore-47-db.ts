import fs from 'fs';
import { db } from '../src/lib/db';

async function restore47DbFromHtml() {
  const dashPath = 'C:\\Users\\zizo-\\OneDrive\\Desktop\\instagram-dashboard.html';
  const html = fs.readFileSync(dashPath, 'utf8');

  const match = html.match(/const PRODUCTS_DB = (\[[\s\S]*?\]);/);
  if (!match) {
    console.error('Could not find const PRODUCTS_DB in restored dashboard HTML');
    return;
  }

  const products = JSON.parse(match[1]);
  console.log(`Found ${products.length} products in restored HTML file!`);

  // Delete all existing products in DB
  console.log('Clearing current database products...');
  await db.product.deleteMany({});

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const imgPath = p.thumb || p.original_images?.[0] || '/uploads/loose-eyeshadow-edited.jpg';

    await db.product.create({
      data: {
        id: p.id || `prod-47-${i+1}`,
        name: p.name,
        nameAr: p.name,
        description: p.long_description || p.caption || p.name,
        descriptionAr: p.long_description || p.caption || p.name,
        price: 50,
        stock: 50,
        images: JSON.stringify([imgPath]),
        isActive: true,
        isFeatured: false
      }
    });
  }

  console.log(`✅ Successfully restored database to the 47 original products!`);
}

restore47DbFromHtml();
