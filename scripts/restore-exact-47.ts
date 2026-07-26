import { execSync } from 'child_process';
import fs from 'fs';
import { db } from '../src/lib/db';

async function restoreExact47Directly() {
  console.log('Extracting 47 products directly from Git commit af97e81...');
  
  const html = execSync('git show af97e81:public/instagram-dashboard.html', { 
    maxBuffer: 30 * 1024 * 1024 
  }).toString('utf8');

  const startTag = 'const PRODUCTS_DB = [';
  const startIdx = html.indexOf(startTag);
  if (startIdx === -1) {
    console.error('Could not find const PRODUCTS_DB in git commit af97e81!');
    return;
  }

  const endIdx = html.indexOf('];', startIdx);
  const jsonStr = html.substring(startIdx + 'const PRODUCTS_DB = '.length, endIdx + 1);
  const products = JSON.parse(jsonStr);

  console.log(`Successfully extracted ${products.length} original products!`);

  // 1. Clear database and restore products
  console.log('Clearing database products...');
  await db.product.deleteMany({});

  // Ensure default category exists
  let cat = await db.category.findFirst();
  if (!cat) {
    cat = await db.category.create({
      data: {
        name: 'عناية ومكياج',
        slug: 'beauty-care'
      }
    });
  }

  console.log('Inserting products into database...');
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const imgUrl = p.thumb || p.designed_images?.[0] || p.original_images?.[0] || '/uploads/loose-eyeshadow-edited.jpg';

    await db.product.create({
      data: {
        id: p.id || `prod-orig-${i + 1}`,
        name: p.name,
        nameAr: p.name,
        description: p.long_description || p.caption || p.name,
        descriptionAr: p.long_description || p.caption || p.name,
        price: 50,
        stock: 50,
        images: JSON.stringify([imgUrl]),
        isActive: true,
        isFeatured: false,
        categoryId: cat.id
      }
    });
  }
  console.log('✅ Successfully restored 47 products to Prisma Database!');

  // 2. Update Desktop Dashboard file
  const dashPath = 'C:\\Users\\zizo-\\OneDrive\\Desktop\\instagram-dashboard.html';
  if (fs.existsSync(dashPath)) {
    let dashHtml = fs.readFileSync(dashPath, 'utf8');

    dashHtml = dashHtml.replace(/قائمة المنتجات \(\d+\)/, 'قائمة المنتجات (47)');

    const regex = /const PRODUCTS_DB = \[[\s\S]*?\];/;
    const newDbStr = 'const PRODUCTS_DB = ' + JSON.stringify(products, null, 2) + ';';

    if (regex.test(dashHtml)) {
      dashHtml = dashHtml.replace(regex, newDbStr);
      fs.writeFileSync(dashPath, dashHtml, 'utf8');
      console.log('✅ Successfully restored Desktop instagram-dashboard.html with all 47 original designed products!');
    }
  }
}

restoreExact47Directly();
