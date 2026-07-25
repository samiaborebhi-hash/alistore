import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  // 1. فحص المستخدمين الموجودين
  const users = await db.user.findMany({ select: { email: true, role: true, name: true } })
  console.log('👤 المستخدمون في قاعدة البيانات:', JSON.stringify(users, null, 2))

  if (users.length === 0) {
    console.log('\n⚠️ لا يوجد مستخدمين! جاري إنشاء مستخدم أدمن...')
    
    const hash = await bcrypt.hash('Admin@123456', 12)
    const admin = await db.user.create({
      data: {
        email: 'admin@alipro.com',
        name: 'Admin',
        passwordHash: hash,
        role: 'admin',
      },
    })
    console.log('✅ تم إنشاء الأدمن:', admin.email)
  } else {
    // 2. اختبار كلمة المرور المتوقعة
    const adminUser = await db.user.findFirst({ where: { role: 'admin' } })
    if (adminUser) {
      const passwords = ['Admin@123456', 'aaAA1232!@!#ASD', 'admin123', '123456']
      for (const pass of passwords) {
        const ok = await bcrypt.compare(pass, adminUser.passwordHash)
        console.log(`🔑 كلمة المرور "${pass}": ${ok ? '✅ صحيحة' : '❌ خاطئة'}`)
        if (ok) break
      }
    }
  }
}

main()
  .catch(e => console.error('❌ خطأ:', e.message))
  .finally(() => db.$disconnect())
