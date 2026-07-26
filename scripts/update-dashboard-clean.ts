import fs from 'fs';
import path from 'path';
import { db } from '../src/lib/db';

async function updateDashboardWithCleanImages() {
  const products = await db.product.findMany();
  console.log('Fetched total products count:', products.length);

  const dashPath = 'C:\\Users\\zizo-\\OneDrive\\Desktop\\instagram-dashboard.html';
  if (!fs.existsSync(dashPath)) {
    console.error('Dashboard file not found at:', dashPath);
    return;
  }

  let html = fs.readFileSync(dashPath, 'utf8');

  // Replace PRODUCTS_DB array in HTML
  const formattedProducts = products.map(p => {
    let imgList: string[] = [];
    try {
      imgList = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
    } catch {
      imgList = ['/uploads/loose-eyeshadow-edited.jpg'];
    }

    const relImg = imgList[0] || '/uploads/loose-eyeshadow-edited.jpg';
    const fullImgUrl = relImg.startsWith('http') ? relImg : `https://novapure.beauty${relImg}`;

    return {
      id: p.id,
      name: p.name,
      status: "جاهز للنشر",
      thumb: fullImgUrl,
      short_description: `منتج أصلي بسعر موحد 50 شيكل وتوصيل سريع حتى باب المنزل في قطاع غزة.`,
      long_description: p.description || p.name,
      features: [
        "منتج أصلي 100%",
        "سعر موحد 50 شيكل",
        "جودة عالية ونتائج مدهشة",
        "توصيل منزلي لجميع مناطق غزة 🇵🇸"
      ],
      uses: "الاستخدام اليومي والعناية الشخصية.",
      target_audience: "الصبايا والسيدات في قطاع غزة.",
      keywords: [p.name.split(' ')[0], "مكياج غزة", "عناية غزة", "توصيل غزة"],
      original_images: [fullImgUrl],
      designed_images: [fullImgUrl],
      caption: p.description || p.name,
      facebook_post: `وصل حديثاً في متجر NOVA Cosmetics: ${p.name}!\nتوصيل سريع حتى باب المنزل في قطاع غزة. 🚚\nأطلبي الآن عبر الموقع الرسمي: https://novapure.beauty`,
      short_ad: `اكتشفي إشراقة ${p.name} اليوم! ✨ التوصيل متوفر ل باب بيتك بغزة 🚚`,
      cta: "اطلبي الآن عبر الدايركت مسج ل يصلك ل باب منزلك في غزة!",
      hashtags: "#نوفا_كوزمتيكس #جمال #عناية #غزة #توصيل_غزة #مكياج",
      marketing_words: "أصلي 100% • ثبات عالي • توصيل غزة • 50 شيكل",
      selling_points: "• منتج أصلي عالي الجودة\n• توصيل منزلي لجميع مناطق غزة",
      offer_ideas: "• سعر موحد 50 شيكل فقط!",
      prompts: [
        {
          name: "صورة المنتج النظيفة",
          prompt: `Clean professional product photography of ${p.name} on light minimal background.`
        }
      ],
      video: {
        prompt: `Commercial video of ${p.name}`,
        script_15s: "0-3ث: زوم مكبر للمنتج.\n3-6ث: إظهار الفعالية والجمال.\n6-8ث: التوصيل لباب بيتك بغزة 🚚",
        script_30s: "0-7ث: استعراض مميزات المنتج.\n7-18ث: نتائج تجربة الاستخدام.\n18-30ث: التوصيل لجميع مناطق غزة.",
        voiceover: `تألقي مع ${p.name} الأصلي! اطلبيه الآن والتوصيل حتى باب بيتك في غزة!`,
        screen_text: "أناقة وبشرة مشرقة ✨ • توصيل غزة 🇵🇸",
        scenes: "زوم المنتج • تجربة الاستخدام • صندوق التوصيل",
        music: "موسيقى هادئة وعصرية."
      },
      schedule: [
        {
          platform: "Instagram Post",
          type: "صورة نظيفة",
          date: "2026-08-01",
          time: "18:00",
          goal: "إطلاق المنتج",
          status: "جاهز للنشر"
        }
      ]
    };
  });

  const productsJsonStr = JSON.stringify(formattedProducts, null, 2);
  
  // Replace const PRODUCTS_DB = [...];
  const regex = /const PRODUCTS_DB = \[[\s\S]*?\];/;
  if (regex.test(html)) {
    html = html.replace(regex, `const PRODUCTS_DB = ${productsJsonStr};`);
    fs.writeFileSync(dashPath, html, 'utf8');
    console.log('Successfully updated Desktop instagram-dashboard.html with clean raw image URLs!');
  } else {
    console.error('Could not find const PRODUCTS_DB in instagram-dashboard.html');
  }
}

updateDashboardWithCleanImages();
