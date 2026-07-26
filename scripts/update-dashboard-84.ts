import { db } from '../src/lib/db'
import fs from 'fs'

async function updateDashboardWithAll84() {
  const dbProducts = await db.product.findMany()
  console.log('Fetched total products count:', dbProducts.length)

  const formattedProducts = dbProducts.map((p) => {
    let imgs: string[] = []
    try {
      imgs = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images as string[]) || []
    } catch {
      imgs = [p.images as string]
    }
    if (!imgs.length) imgs = ['/uploads/loose-eyeshadow-edited.jpg']

    return {
      id: p.id,
      name: p.name,
      status: 'جاهز للنشر',
      thumb: imgs[0],
      short_description: p.descriptionAr || (p.description ? p.description.substring(0, 100) : 'منتج تجميل وعناية ممتاز عالي الجودة متاح في قطاع غزة.'),
      long_description: p.description || p.descriptionAr || 'منتج تجميل عالي الجودة متوفر بخصم مميز وخدمة توصيل سريعة لجميع مناطق قطاع غزة.',
      features: ['ثبات جودة عالية', 'مناسب لجميع أنواع البشرة', 'منتج أصلي 100%', 'توصيل منزلي ل غزة'],
      uses: 'الاستخدام اليومي والمناسبات التجميلية.',
      target_audience: 'الصبايا والسيدات في قطاع غزة.',
      keywords: [p.name.split(' ')[0], 'مكياج غزة', 'عناية غزة', 'توصيل غزة'],
      original_images: imgs,
      designed_images: imgs,
      caption: `✨ ${p.name} ✨\n\n${p.description || p.descriptionAr || 'منتج تجميل عالي الجودة ومميز لمظهر أنيق وطبيعي!'}\n\n🚗 التوصيل السريع متوفر حتى باب المنزل في جميع مناطق قطاع غزة! 🇵🇸\n\n👇 اطلبي منتجكِ الآن عبر الموقع الرسمي:\nhttps://novapure.beauty\n\n#مكياج_غزة #تجميل_غزة #نوفا_بيور #توصيل_غزة #غزة`,
      facebook_post: `وصل حديثاً في متجر NOVA Cosmetics: ${p.name}!\nتوصيل سريع حتى باب المنزل في قطاع غزة. 🚚\nأطلبي الآن عبر الموقع الرسمي: https://novapure.beauty`,
      short_ad: `اكتشفي إشراقة ${p.name} اليوم! ✨ التوصيل متوفر ل باب بيتك بغزة 🚚`,
      cta: 'اطلبي الآن عبر موقعنا الرسمي ل يصلك ل باب منزلك في غزة!',
      hashtags: '#مكياج_غزة #تجميل_غزة #نوفا_بيور #توصيل_غزة #غزة',
      marketing_words: 'أصلي 100% • ثبات عالي • توصيل غزة • جودة ممتازة',
      selling_points: '• منتج أصلي عالي الجودة\n• توصيل منزلي لجميع مناطق غزة',
      offer_ideas: '• شراء 2 قطعة واحصلي على توصيل مجاني.',
      prompts: [{ name: 'صورة استوديو الفاخرة', prompt: `Professional commercial product photography of ${p.name} on white luxury podium under studio lights.` }],
      video: {
        prompt: `Ultra fast-paced 8s commercial video of ${p.name} bottle on marble surface with luxury cosmetics bokeh background.`,
        script_15s: '0-3ث: زوم مكبر للمنتج.\n3-6ث: إظهار الفعالية والثبات.\n6-8ث: التوصيل لباب بيتك بغزة 🚚',
        script_30s: '0-7ث: استعراض مميزات المنتج.\n7-18ث: نتائج تجربة الاستخدام.\n18-30ث: التوصيل لجميع مناطق غزة.',
        voiceover: `تألقي مع ${p.name} الأصلي! اطلبيه الآن والتوصيل حتى باب بيتك في غزة!`,
        screen_text: `أناقة وبشرة مشرقة ✨ • توصيل غزة 🇵🇸`,
        scenes: 'زوم المنتج • تجربة الاستخدام • صندوق التوصيل',
        music: 'موسيقى أنثوية وعصرية.'
      },
      schedule: [{ platform: 'Instagram Post', type: 'صورة فاخرة', date: '2026-08-01', time: '18:00', goal: 'إطلاق المنتج', status: 'جاهز للنشر' }]
    }
  })

  const desktopPath = 'C:\\Users\\zizo-\\OneDrive\\Desktop\\instagram-dashboard.html'
  if (fs.existsSync(desktopPath)) {
    let htmlContent = fs.readFileSync(desktopPath, 'utf8')
    const dbRegex = /const PRODUCTS_DB = \[[\s\S]*?\];/
    const newDbStr = 'const PRODUCTS_DB = ' + JSON.stringify(formattedProducts, null, 2) + ';'
    htmlContent = htmlContent.replace(dbRegex, newDbStr)
    fs.writeFileSync(desktopPath, htmlContent, 'utf8')
    console.log('Successfully updated Desktop instagram-dashboard.html with ALL 84 products!')
  }
}

updateDashboardWithAll84()
