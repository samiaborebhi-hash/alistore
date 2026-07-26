import { db } from '../src/lib/db'

async function publishAll47Live() {
  const token = 'EAAX3rnZBMIP4BSPoChu1AjWwjx4DBykQ2yONLZBmEm2CF1RbhfKY9y795LTt2nYCqvrXZAXDUvZAFNowzwZBvc4Xj5ofUP70mF6tuthlFe758Ib4qvEUZAyMkfZAgXKkL1a9PwJa99FC1ZCEkK6biu8dzsZBeYJt2Pj7o8ep4tpY4dl39BPOkUj8GGqx83CxSUBkSdKHMZAvdQCf5DJP0EZAIiNwiZAtoJxSPELen6oiDw7nyvQRX92AtjwVsAPj6bhdDmI1NMfcOkzX67MK6nJ1bI4ZA5u8PznWk2KTd8Is4kgZDZD'
  const instaId = '17841403614375396'
  const siteUrl = 'https://novapure.beauty'

  const products = await db.product.findMany()
  console.log('Total products in database to publish:', products.length)

  for (let i = 0; i < products.length; i++) {
    const p = products[i]
    let imgs: string[] = []
    try {
      imgs = typeof p.images === 'string' ? JSON.parse(p.images) : (p.images as string[]) || []
    } catch {
      imgs = [p.images as string]
    }
    if (!imgs.length) imgs = ['/uploads/loose-eyeshadow-edited.jpg']

    let fullImgUrl = imgs[0]
    if (fullImgUrl.startsWith('/')) fullImgUrl = siteUrl + fullImgUrl

    const caption = `✨ ${p.name} ✨\n\n${p.description || p.shortDescription || 'منتج تجميل وعناية ممتاز عالي الجودة متوفر بخصم مميز!'}\n\n🚗 التوصيل السريع متوفر حتى باب المنزل في جميع مناطق قطاع غزة! 🇵🇸\n\n👇 اطلبي الآن عبر موقعنا الرسمي:\nhttps://novapure.beauty\n\n#مكياج_غزة #تجميل_غزة #نوفا_بيور #توصيل_غزة #غزة`

    console.log(`[ ${i + 1} / ${products.length} ] جارٍ نشر: ${p.name} ...`)

    try {
      const cRes = await fetch(`https://graph.facebook.com/v18.0/${instaId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: fullImgUrl, caption: caption, access_token: token })
      })
      const cData = await cRes.json()

      if (cData.id) {
        const pRes = await fetch(`https://graph.facebook.com/v18.0/${instaId}/media_publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ creation_id: cData.id, access_token: token })
        })
        const pData = await pRes.json()
        console.log(`✅ تم نشر: ${p.name} | Post ID: ${pData.id}`)
      } else {
        console.log(`⚠️ تنبيه لنشر ${p.name}:`, cData.error?.message || cData)
      }
    } catch (e: any) {
      console.log(`❌ خطأ أثناء النشر:`, e.message)
    }

    await new Promise((r) => setTimeout(r, 2000))
  }

  console.log('🎉 اكتمل نشر جميع المنتجات الـ 47 على إنستغرام!')
}

publishAll47Live()
