import fs from 'fs';
import { db } from '../src/lib/db';

async function restoreOriginal47FromJSON() {
  const file = './backups/backup-2026-07-25T20-54-33.json';
  if (!fs.existsSync(file)) {
    console.error('Backup JSON not found:', file);
    return;
  }

  const raw = fs.readFileSync(file, 'utf8');
  const json = JSON.parse(raw);

  const productData = json.tables?.Product?.data || [];
  console.log(`Found ${productData.length} original products in JSON backup!`);

  if (!productData.length) {
    console.error('No products found in json.tables.Product.data!');
    return;
  }

  console.log('Clearing database products...');
  await db.product.deleteMany({});

  console.log('Restoring products to database...');
  for (const p of productData) {
    await db.product.create({
      data: {
        id: p.id,
        name: p.name,
        nameAr: p.nameAr || p.name,
        description: p.description,
        descriptionAr: p.descriptionAr || p.description,
        price: p.price || 50,
        wholesalePrice: p.wholesalePrice,
        minWholesaleQty: p.minWholesaleQty || 1,
        stock: p.stock || 50,
        images: typeof p.images === 'string' ? p.images : JSON.stringify(p.images),
        isActive: p.isActive ?? true,
        isFeatured: p.isFeatured ?? false,
        tags: p.tags,
        categoryId: p.categoryId,
        createdAt: p.createdAt ? new Date(p.createdAt) : undefined,
        updatedAt: p.updatedAt ? new Date(p.updatedAt) : undefined
      }
    });
  }

  console.log(`🎉 Successfully restored all ${productData.length} original products to the database!`);
}

restoreOriginal47FromJSON();
