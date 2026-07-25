import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function resetAuth() {
  console.log('🔄 جارٍ ضبط وتحديث حسابات الأدمن...')

  const hash1 = await bcrypt.hash('Admin@123456', 12)
  const hash2 = await bcrypt.hash('aaAA1232!@!#ASD', 12)

  // 1. تحديث أو إنشاء rebhi9964@gmail.com كلمة المرور: Admin@123456
  await db.user.upsert({
    where: { email: 'rebhi9964@gmail.com' },
    update: { passwordHash: hash1, role: 'admin', name: 'مدير النظام' },
    create: { email: 'rebhi9964@gmail.com', passwordHash: hash1, role: 'admin', name: 'مدير النظام' },
  })

  // 2. تحديث أو إنشاء admin@alipro.com كلمة المرور: Admin@123456
  await db.user.upsert({
    where: { email: 'admin@alipro.com' },
    update: { passwordHash: hash1, role: 'admin', name: 'الأدمن' },
    create: { email: 'admin@alipro.com', passwordHash: hash1, role: 'admin', name: 'الأدمن' },
  })

  console.log('✅ تم التحديث بنجاح!')
  console.log('الحسابات المتاحة الآن لـ Login:')
  console.log('1. البريد: rebhi9964@gmail.com  | كلمة المرور: Admin@123456')
  console.log('2. البريد: admin@alipro.com      | كلمة المرور: Admin@123456')
}

resetAuth()
  .catch(e => console.error('❌ خطأ:', e.message))
  .finally(() => db.$disconnect())
