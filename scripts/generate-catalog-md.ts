import fs from 'fs';
import path from 'path';

async function generateCatalogMarkdown() {
  const catalogPath = './scripts/products-catalog.json';
  if (!fs.existsSync(catalogPath)) {
    console.error('Catalog JSON not found!');
    return;
  }

  const files: string[] = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  console.log('Generating Catalog Markdown for', files.length, 'products...');

  let md = `# 📦 فهرس المنتجات المرقّم (1 - ${files.length})\n\n`;
  md += `إجمالي عدد المنتجات النظيفة والمستقلة: **${files.length} منتجاً**\n\n`;
  md += `| الرقم | اسم الملف | حالة التحليل | مسار الصورة |\n`;
  md += `| :---: | :--- | :---: | :--- |\n`;

  files.forEach((file, index) => {
    const num = index + 1;
    const absPath = `C:/Users/zizo-/OneDrive/Desktop/منتجات/${file}`;
    md += `| **المنتج #${num}** | \`${file}\` | ⏳ بانتظار التحليل والتصميم | [معاينة الصورة](file:///${absPath}) |\n`;
  });

  md += `\n---\n\n### 🚀 كيفية البدء:\n- يمكنكِ إبلاغي بالبدء بالمنتج **#1** مباشرة، أو اختيار أي رقم منتج تريدين العمل عليه بالترتيب!\n`;

  const targetFile = 'C:\\Users\\zizo-\\.gemini\\antigravity\\brain\\88a88524-2feb-428f-adf9-abab67861dd8\\product_catalog.md';
  fs.writeFileSync(targetFile, md, 'utf8');
  console.log('✅ Generated product_catalog.md artifact!');
}

generateCatalogMarkdown();
