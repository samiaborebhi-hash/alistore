# متجر منتجات تجميلية - خطة تنفيذية كاملة

> **For Hermes:** استخدم هذه الخطة لبناء المشروع خطوة بخطوة. كل مهمة صغيرة ومحددة.

**الهدف:** بناء متجر إلكتروني لبيع منتجات التجميل الرجالية والنسائية مع دعم البيع بالجملة والتجزئة، طلب عبر واتساب، ولوحة تحكم إدارية كاملة مع نظام حماية قوي. تصميم متجاوب (RWD) مع انتقالات سينمائية تشبه الفيديو بين الصفحات.

**المعمارية:** Next.js 14+ App Router مع TypeScript، Prisma + PostgreSQL، NextAuth.js للمصادقة، Tailwind CSS + shadcn/ui للواجهة، Framer Motion + Locomotive Scroll للانتقالات السينمائية، نظام حماية متعدد الطبقات.

**التقنيات:**
- Frontend: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Animations: Framer Motion (AnimatePresence, layout animations, spring physics), Locomotive Scroll (smooth scrolling, parallax)
- Backend: Next.js API Routes, Prisma ORM, PostgreSQL
- Auth: NextAuth.js v5 (Auth.js) مع JWT + bcrypt
- Admin: لوحة تحكم مخصصة داخل `/admin`
- WhatsApp API: رابط wa.me المباشر
- Security: Helmet, rate limiting, CSRF, input validation (Zod), CSP headers
- RWD: Mobile-first, fluid typography (clamp), CSS Grid/Flexbox, breakpoints: 480/768/1024/1280
- Deployment: Vercel / VPS

---

## هيكل المشروع

```
alipro/
├── .env                          # متغيرات البيئة
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── prisma/
│   └── schema.prisma             # قاعدة البيانات
├── public/
│   └── uploads/                  # صور المنتجات
├── src/
│   ├── app/
│   │   ├── layout.tsx            # التخطيط الرئيسي
│   │   ├── page.tsx              # الصفحة الرئيسية
│   │   ├── (shop)/               # قسم المتجر العام
│   │   │   ├── men/              # منتجات رجالية
│   │   │   ├── women/            # منتجات نسائية
│   │   │   ├── wholesale/        # صفحة الجملة
│   │   │   └── product/[id]/     # صفحة المنتج
│   │   ├── admin/                # لوحة التحكم
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx          # الإحصائيات
│   │   │   ├── products/         # إدارة المنتجات
│   │   │   ├── orders/           # الطلبات
│   │   │   └── settings/         # الإعدادات
│   │   └── api/
│   │       ├── auth/             # NextAuth
│   │       ├── products/         # API المنتجات
│   │       ├── orders/           # API الطلبات
│   │       └── admin/            # API الإدارة
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── shop/                 # مكونات المتجر
│   │   ├── admin/                # مكونات لوحة التحكم
│   │   └── layout/               # الهيدر والفوتر
│   ├── lib/
│   │   ├── auth.ts               # إعدادات NextAuth
│   │   ├── db.ts                 # Prisma client
│   │   ├── validations.ts        # Zod schemas
│   │   ├── security.ts           # دوال الحماية
│   │   └── utils.ts              # دوال مساعدة
│   └── types/
│       └── index.ts              # TypeScript types
```

---

## المرحلة 1: إعداد المشروع والبنية التحتية

### Task 1: تهيئة مشروع Next.js

**الهدف:** إنشاء مشروع Next.js جديد مع جميع الإعدادات الأساسية

**ملفات:**
- إنشاء: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`

**الخطوات:**

```bash
npx create-next-app@latest alipro --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd alipro
```

**تثبيت الحزم الأساسية:**
```bash
npm install prisma @prisma/client next-auth@beta @auth/prisma-adapter bcryptjs zod
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label
npm install framer-motion clsx tailwind-merge class-variance-authority
npm install lucide-react react-hot-toast
npm install -D @types/bcryptjs
```

**التحقق:** `npm run dev` يعمل على `http://localhost:3000`

---

### Task 2: إعداد Prisma وقاعدة البيانات

**الهدف:** إنشاء schema قاعدة البيانات

**ملف:** `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  passwordHash  String
  role          String    @default("admin") // admin only
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Category {
  id        String    @id @default(cuid())
  name      String    @unique // "men", "women"
  nameAr    String    // "رجالي", "نسائي"
  slug      String    @unique
  products  Product[]
  createdAt DateTime  @default(now())
}

model Product {
  id            String        @id @default(cuid())
  name          String
  nameAr        String
  description   String?
  descriptionAr String?
  price         Decimal       @db.Decimal(10, 2)
  wholesalePrice Decimal?     @db.Decimal(10, 2) // سعر الجملة
  minWholesaleQty Int?        @default(10) // الحد الأدنى للجملة
  stock         Int           @default(0)
  images        String[]      // مسارات الصور
  categoryId    String
  category      Category      @relation(fields: [categoryId], references: [id])
  isActive      Boolean       @default(true)
  isFeatured    Boolean       @default(false)
  tags          String[]      @default([])
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  orders        OrderItem[]
}

model Order {
  id            String      @id @default(cuid())
  customerName  String
  customerPhone String      // للواتساب
  customerEmail String?
  type          String      // "retail" | "wholesale"
  status        String      @default("pending") // pending, confirmed, shipped, delivered, cancelled
  totalAmount   Decimal     @db.Decimal(10, 2)
  notes         String?
  items         OrderItem[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id])
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int
  price     Decimal  @db.Decimal(10, 2)
}

model SiteSettings {
  id            String   @id @default("main")
  siteName      String   @default("متجر التجميل")
  siteNameEn    String   @default("Beauty Store")
  whatsappNumber String  @default("966500000000")
  aboutText     String?
  aboutTextAr   String?
  logo          String?
  socialLinks   Json     @default("{}")
  updatedAt     DateTime @updatedAt
}
```

**الخطوات:**
```bash
npx prisma generate
npx prisma db push
```

**التحقق:** `npx prisma studio` يفتح واجهة قاعدة البيانات

---

### Task 3: إعداد متغيرات البيئة

**ملف:** `.env.example` و `.env`

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/alipro"

# NextAuth
AUTH_SECRET="generate-with: openssl rand -base64 32"
AUTH_URL="http://localhost:3000"

# Admin
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="change-me-immediately"

# WhatsApp
WHATSAPP_NUMBER="966500000000"
WHATSAPP_API_KEY=""  # اختياري - WhatsApp Business API

# Upload
UPLOAD_DIR="./public/uploads"
MAX_UPLOAD_SIZE=5242880  # 5MB
```

---

### Task 4: إعداد Prisma Client وملفات المكتبة الأساسية

**ملف:** `src/lib/db.ts`
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

**ملف:** `src/lib/utils.ts`
```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
  }).format(price)
}

export function whatsappLink(phone: string, message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${phone}?text=${encoded}`
}
```

---

## المرحلة 2: نظام المصادقة والحماية

### Task 5: إعداد NextAuth.js

**ملف:** `src/lib/auth.ts`
```typescript
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { db } from './db'
import { LoginSchema } from './validations'

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data
        const user = await db.user.findUnique({ where: { email } })
        if (!user) return null

        const isValid = await compare(password, user.passwordHash)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
})
```

**ملف:** `src/lib/validations.ts`
```typescript
import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح').max(254),
  password: z.string().min(8, 'كلمة المرور قصيرة').max(128),
})

export const ProductSchema = z.object({
  name: z.string().min(2).max(200),
  nameAr: z.string().min(2).max(200),
  description: z.string().max(5000).optional(),
  descriptionAr: z.string().max(5000).optional(),
  price: z.number().positive('السعر يجب أن يكون أكبر من صفر'),
  wholesalePrice: z.number().positive().optional(),
  minWholesaleQty: z.number().int().positive().optional(),
  stock: z.number().int().min(0),
  categoryId: z.string().min(1),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
})

export const OrderSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().regex(/^\+?[0-9]{8,15}$/, 'رقم هاتف غير صالح'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  type: z.enum(['retail', 'wholesale']),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })).min(1),
  notes: z.string().max(1000).optional(),
})
```

**ملف:** `src/lib/security.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Rate limiting - استخدم Upstash Redis أو حل محلي
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '15 m'),
  analytics: true,
})

export async function rateLimit(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success, limit, reset, remaining } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'طلبات كثيرة جداً. حاول مرة أخرى لاحقاً.' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    )
  }
  return null
}

// CSRF protection helper
export function generateCsrfToken(): string {
  return crypto.randomUUID()
}

// Sanitize input
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 5000)
}

// Security headers
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}
```

---

### Task 6: إنشاء seed للادمن الأول

**ملف:** `prisma/seed.ts`
```typescript
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const passwordHash = await hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 12)
  
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@alipro.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@alipro.com',
      name: 'مدير النظام',
      passwordHash,
      role: 'admin',
    },
  })

  // Create categories
  await prisma.category.upsert({
    where: { slug: 'men' },
    update: {},
    create: { name: 'men', nameAr: 'رجالي', slug: 'men' },
  })

  await prisma.category.upsert({
    where: { slug: 'women' },
    update: {},
    create: { name: 'women', nameAr: 'نسائي', slug: 'women' },
  })

  // Create site settings
  await prisma.siteSettings.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      siteName: 'متجر التجميل',
      siteNameEn: 'Beauty Store',
      whatsappNumber: process.env.WHATSAPP_NUMBER || '966500000000',
    },
  })

  console.log('Seed completed!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
```

**تشغيل:**
```bash
npx tsx prisma/seed.ts
```

---

## المرحلة 3: واجهة المتجر العامة

### Task 7: التخطيط الرئيسي (Layout)

**ملف:** `src/app/layout.tsx`
```typescript
import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const cairo = Cairo({ subsets: ['arabic'] })

export const metadata: Metadata = {
  title: 'متجر التجميل - منتجات تجميل رجالية ونسائية',
  description: 'متجر متخصص في بيع منتجات التجميل الرجالية والنسائية - جملة وتجزئة',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
```

**ملف:** `src/components/layout/Header.tsx`
- شعار المتجر
- روابط: الرئيسية، رجالي، نسائي، جملة
- أيقونة واتساب
- زر لوحة التحكم (يظهر للادمن فقط)

**ملف:** `src/components/layout/Footer.tsx`
- معلومات المتجر
- روابط سريعة
- أيقونات التواصل الاجتماعي
- زر واتساب

---

### Task 8: الصفحة الرئيسية

**ملف:** `src/app/page.tsx`

المكونات:
- Hero section مع صورة جذابة وعبارة تسويقية
- قسم "المنتجات المميزة" (isFeatured)
- قسمين: "منتجات رجالية" و "منتجات نسائية" مع صور
- قسم "لماذا تختارنا" (مميزات المتجر)
- CTA للواتساب

---

### Task 9: صفحات المنتجات (رجالي / نسائي)

**ملف:** `src/app/(shop)/men/page.tsx`
**ملف:** `src/app/(shop)/women/page.tsx`

- عرض المنتجات في Grid
- فلترة حسب التاغات
- كل منتج: صورة، اسم، سعر، زر "اطلب عبر واتساب"
- Pagination

**ملف:** `src/app/(shop)/product/[id]/page.tsx`
- تفاصيل المنتج كاملة
- معرض صور
- السعر (تجزئة / جملة)
- الحد الأدنى للجملة
- زر "اطلب الآن عبر واتساب" مع رسالة مخصصة
- منتجات ذات صلة

---

### Task 10: صفحة الجملة

**ملف:** `src/app/(shop)/wholesale/page.tsx`

- شرح نظام الجملة
- عرض المنتجات المتاحة للجملة (التي لها wholesalePrice)
- جدول مقارنة: سعر التجزئة vs سعر الجملة
- الحد الأدنى للطلب
- CTA للواتساب

---

### Task 11: مكون طلب الواتساب

**ملف:** `src/components/shop/WhatsAppButton.tsx`

```typescript
'use client'

import { whatsappLink } from '@/lib/utils'
import { WhatsAppIcon } from './icons'

interface Props {
  productName?: string
  productId?: string
  type?: 'retail' | 'wholesale'
  className?: string
}

export function WhatsAppButton({ productName, productId, type = 'retail', className }: Props) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '966500000000'
  
  const message = productName
    ? `مرحباً، أريد طلب منتج: ${productName}${type === 'wholesale' ? ' (جملة)' : ''}`
    : 'مرحباً، أريد الاستفسار عن المنتجات'

  return (
    <a
      href={whatsappLink(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition ${className}`}
    >
      <WhatsAppIcon className="w-5 h-5" />
      اطلب عبر واتساب
    </a>
  )
}
```

---

## المرحلة 4: لوحة تحكم الأدمن

### Task 12: تخطيط لوحة التحكم مع الحماية

**ملف:** `src/app/admin/layout.tsx`

```typescript
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session || session.user.role !== 'admin') {
    redirect('/admin/login')
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  )
}
```

**ملف:** `src/components/admin/AdminSidebar.tsx`
- روابط: الرئيسية، المنتجات، الطلبات، الإعدادات
- أيقونات مع Lucide
- زر تسجيل الخروج

---

### Task 13: صفحة تسجيل الدخول

**ملف:** `src/app/admin/login/page.tsx`

- فورم تسجيل دخول (بريد + كلمة مرور)
- Validation مع Zod
- Rate limiting (5 محاولات كل 15 دقيقة)
- رسائل خطأ عامة (لا تكشف إذا كان البريد موجود)
- حماية CSRF
- توجيه للوحة التحكم بعد الدخول

---

### Task 14: الصفحة الرئيسية للوحة التحكم (الإحصائيات)

**ملف:** `src/app/admin/page.tsx`

- بطاقات إحصائية:
  - عدد المنتجات
  - عدد الطلبات (اليوم / الشهر / الكل)
  - إجمالي المبيعات
  - الطلبات المعلقة
- رسم بياني للمبيعات (اختياري - Recharts)
- آخر 5 طلبات
- المنتجات الأكثر طلباً

---

### Task 15: إدارة المنتجات (CRUD)

**ملف:** `src/app/admin/products/page.tsx` - قائمة المنتجات
**ملف:** `src/app/admin/products/new/page.tsx` - إضافة منتج
**ملف:** `src/app/admin/products/[id]/edit/page.tsx` - تعديل منتج

الميزات:
- جدول بجميع المنتجات مع بحث وتصفية
- فورم إضافة/تعديل:
  - اسم (عربي + إنجليزي)
  - وصف (عربي + إنجليزي)
  - سعر التجزئة
  - سعر الجملة (اختياري)
  - الحد الأدنى للجملة
  - المخزون
  - القسم (رجالي/نسائي)
  - رفع صور (حتى 5 صور)
  - تاغات
  - تفعيل/تعطيل
  - منتج مميز
- حذف مع تأكيد
- Toast notifications للنجاح/الفشل

---

### Task 16: إدارة الطلبات

**ملف:** `src/app/admin/orders/page.tsx`

- جدول الطلبات مع:
  - رقم الطلب
  - اسم العميل
  - رقم الهاتف (رابط واتساب)
  - النوع (جملة/تجزئة)
  - الحالة
  - المبلغ
  - التاريخ
- تغيير حالة الطلب (معلق → مؤكد → شحن → تم التوصيل → ملغي)
- تصفية حسب الحالة
- تصدير للطلبات (CSV)

---

### Task 17: صفحة الإعدادات

**ملف:** `src/app/admin/settings/page.tsx`

- تعديل اسم المتوقع (عربي + إنجليزي)
- رقم الواتساب
- نص "من نحن"
- روابط التواصل الاجتماعي
- رفع الشعار

---

## المرحلة 5: API Routes

### Task 18: API المنتجات

**ملف:** `src/app/api/products/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { ProductSchema } from '@/lib/validations'
import { auth } from '@/lib/auth'
import { rateLimit } from '@/lib/security'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 12

  const where: any = { isActive: true }
  if (category) where.category = { slug: category }
  if (featured === 'true') where.isFeatured = true

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    db.product.count({ where }),
  ])

  return NextResponse.json({
    products,
    total,
    pages: Math.ceil(total / limit),
    page,
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  }

  const ratelimit = await rateLimit(req)
  if (ratelimit) return ratelimit

  const body = await req.json()
  const parsed = ProductSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'بيانات غير صالحة', details: parsed.error.flatten() }, { status: 400 })
  }

  const product = await db.product.create({ data: parsed.data })
  return NextResponse.json(product, { status: 201 })
}
```

**ملف:** `src/app/api/products/[id]/route.ts` - GET, PUT, DELETE لمنتج واحد

---

### Task 19: API الطلبات

**ملف:** `src/app/api/orders/route.ts`

- GET: قائمة الطلبات (للأدمن فقط)
- POST: إنشاء طلب جديد (عام - من واتساب أو الفورم)

---

### Task 20: API الإعدادات

**ملف:** `src/app/api/settings/route.ts`

- GET: جلب الإعدادات (عام)
- PUT: تحديث الإعدادات (أدمن فقط)

---

## المرحلة 6: الحماية المتقدمة

### Task 21: Middleware الحماية

**ملف:** `src/middleware.ts`

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { securityHeaders } from '@/lib/security'

export default async function middleware(req: NextRequest) {
  const response = NextResponse.next()

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      if (req.nextUrl.pathname !== '/admin/login') {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
    }
  }

  // Rate limit API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('X-RateLimit-Limit', '100')
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
```

---

### Task 22: حماية إضافية

- **CSP Header**: منع XSS
- **Input Sanitization**: تنظيف كل المدخلات
- **File Upload Validation**: التحقق من نوع وحجم الملفات المرفوعة
- **SQL Injection Prevention**: Prisma يستخدم parameterized queries تلقائياً
- **CSRF Tokens**: للفورمات الحساسة
- **Secure Cookies**: httpOnly, secure, sameSite
- **Error Handling**: عدم كشف تفاصيل الأخطاء للعميل

---

## المرحلة 7: النشر والتحسينات النهائية

### Task 23: تحسين SEO والأداء

- Metadata ديناميكي لكل صفحة
- Sitemap
- robots.txt
- تحسين الصور (next/image)
- Lazy loading للمكونات الثقيلة
- PWA (اختياري)

### Task 24: اختبارات شاملة

- اختبار وحدات للـ validations
- اختبار API endpoints
- اختبار تدفق المستخدم:
  - تصفح المنتجات
  - الضغط على واتساب
  - تسجيل دخول الأدمن
  - إضافة منتج
  - تغيير حالة طلب

### Task 25: النشر

```bash
# Vercel (مستحسن)
npm run build
# اربط مع GitHub و Vercel للنشر التلقائي

# أو VPS
npm run build
npm run start
```

---

## ملخص الأوامر للتشغيل

```bash
# التطوير
npm run dev

# بناء قاعدة البيانات
npx prisma generate
npx prisma db push
npx prisma db seed

# بناء للإنتاج
npm run build
npm run start

# فتح Prisma Studio
npx prisma studio
```

---

## المرحلة 8: التصميم المتجاوب (RWD) والانتقالات السينمائية

### Task 26: نظام التصميم المتجاوب (RWD)

**الهدف:** ضمان تجربة ممتازة على جميع الأجهزة (موبايل، تابلت، ديسكتوب)

**ملف:** `src/app/globals.css` - إضافة نظام RWD

```css
/* ===== RWD Breakpoints System ===== */
/* Mobile-first approach */

/* Fluid Typography */
:root {
  --font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --font-size-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --font-size-base: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
  --font-size-lg: clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem);
  --font-size-xl: clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem);
  --font-size-2xl: clamp(2.5rem, 2rem + 2.5vw, 4rem);
  --font-size-3xl: clamp(3.5rem, 2.5rem + 5vw, 6rem);

  /* Fluid Spacing */
  --space-section: clamp(3rem, 2rem + 5vw, 8rem);
  --space-container: clamp(1rem, 0.5rem + 2.5vw, 5rem);

  /* Grid */
  --grid-cols: 1; /* Mobile: 1 column */
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
  :root {
    --grid-cols: 2;
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  :root {
    --grid-cols: 3;
  }
}

/* Wide: 1280px+ */
@media (min-width: 1280px) {
  :root {
    --grid-cols: 4;
  }
}

/* ===== Responsive Grid System ===== */
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-cols, 1), 1fr);
  gap: var(--space-md);
}

/* ===== Responsive Images ===== */
.responsive-img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* ===== Mobile Navigation ===== */
@media (max-width: 767px) {
  .desktop-nav { display: none; }
  .mobile-nav { display: flex; }
  .hero-title { font-size: var(--font-size-2xl); }
  .product-card { width: 100%; }
}

@media (min-width: 768px) {
  .desktop-nav { display: flex; }
  .mobile-nav { display: none; }
}

/* ===== Touch-friendly ===== */
@media (max-width: 1024px) {
  button, a, .clickable {
    min-height: 44px;
    min-width: 44px;
  }
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**ملف:** `tailwind.config.ts` - إضافة breakpoints مخصصة

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.25rem)',
        'fluid-lg': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem)',
        'fluid-xl': 'clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem)',
        'fluid-2xl': 'clamp(2.5rem, 2rem + 2.5vw, 4rem)',
        'fluid-3xl': 'clamp(3.5rem, 2.5rem + 5vw, 6rem)',
      },
    },
  },
}
```

---

### Task 27: Locomotive Scroll - التمرير السينمائي

**الهدف:** تفعيل التمرير السلس مع تأثيرات parallax على كامل الموقع

**تثبيت:**
```bash
npm install locomotive-scroll
```

**ملف:** `src/components/providers/SmoothScrollProvider.tsx`

```typescript
'use client'

import { useEffect, useRef } from 'react'
import LocomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.css'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<LocomotiveScroll | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768

    scrollRef.current = new LocomotiveScroll({
      el: containerRef.current,
      smooth: !prefersReducedMotion,
      lerp: 0.08, // نعومة التمرير (0-1، أقل = أنعم)
      multiplier: 0.8,
      class: 'is-inview',
      smartphone: {
        smooth: false, // تعطيل على الموبايل للأداء
        breakpoint: 768,
      },
      tablet: {
        smooth: true,
        breakpoint: 1024,
      },
    })

    // تحديث عند تغيير حجم النافذة
    const handleResize = () => scrollRef.current?.update()
    window.addEventListener('resize', handleResize)

    return () => {
      scrollRef.current?.destroy()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div ref={containerRef} data-scroll-container>
      {children}
    </div>
  )
}
```

**ملف:** `src/app/layout.tsx` - إضافة المزود

```typescript
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <SmoothScrollProvider>
          <Header />
          <main data-scroll-section>{children}</main>
          <Footer />
        </SmoothScrollProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
```

**استخدام data attributes للـ parallax:**

```html
<!-- عنصر يتحرك أبطأ من التمرير (خلفية) -->
<div data-scroll data-scroll-speed="0.5">خلفية بطيئة</div>

<!-- عنصر يتحرك أسرع (أمامي) -->
<div data-scroll data-scroll-speed="2">عنصر أمامي</div>

<!-- عنصر يتحرك بالاتجاه المعاكس -->
<div data-scroll data-scroll-speed="-1.5">حركة عكسية</div>

<!-- عنصر يتحرك أفقياً -->
<div data-scroll data-scroll-speed="1.5" data-scroll-direction="horizontal">أفقي</div>

<!-- عنصر مثبت -->
<div data-scroll data-scroll-sticky data-scroll-target="#section">مثبت</div>
```

---

### Task 28: Framer Motion - انتقالات سينمائية بين الصفحات

**الهدف:** انتقالات تشبه الفيديو عند التنقل بين الصفحات

**تثبيت:**
```bash
npm install framer-motion
```

**ملف:** `src/components/providers/PageTransitionProvider.tsx`

```typescript
'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

// متغيرات الانتقالات السينمائية
const pageVariants = {
  // دخول الصفحة - من الأسفل مع fade
  enter: {
    opacity: 0,
    y: 60,
    scale: 0.98,
    filter: 'blur(8px)',
  },
  // الحالة الطبيعية
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
  },
  // خروج الصفحة - للأعلى مع fade
  exit: {
    opacity: 0,
    y: -40,
    scale: 0.98,
    filter: 'blur(8px)',
    transition: { duration: 0.3 },
  },
}

// انتقالات سينمائية مختلفة حسب نوع الصفحة
const cinematicTransitions = {
  default: {
    enter: { opacity: 0, y: 60, scale: 0.98, filter: 'blur(8px)' },
    center: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -40, scale: 0.98, filter: 'blur(8px)' },
  },
  // انتقال أفقي للتنقل بين الأقسام
  slideHorizontal: {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  },
  // انتقال zoom للصفحات المهمة
  zoomIn: {
    enter: { opacity: 0, scale: 0.8, filter: 'blur(4px)' },
    center: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.1, filter: 'blur(4px)' },
  },
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1], // cubic-bezier سينمائي
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

**ملف:** `src/app/layout.tsx` - إضافة مزود الانتقالات

```typescript
import { PageTransitionProvider } from '@/components/providers/PageTransitionProvider'

// داخل body
<PageTransitionProvider>
  {children}
</PageTransitionProvider>
```

---

### Task 29: تأثيرات سينمائية للمكونات

**الهدف:** إضافة حركات سينمائية لكل مكونات المتجر

**ملف:** `src/components/shop/CinematicHero.tsx`

```typescript
'use client'

import { motion } from 'framer-motion'
import { WhatsAppButton } from './WhatsAppButton'

const heroTextVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const letterVariants = {
  hidden: { opacity: 0, y: 80, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
}

export function CinematicHero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* خلفية متحركة */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-rose-100 via-purple-50 to-amber-50"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* جزيئات زخرفية */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-300 rounded-full blur-3xl" />
      </motion.div>

      {/* المحتوى */}
      <motion.div
        className="relative z-10 text-center px-4"
        variants={heroTextVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-fluid-3xl font-bold mb-6"
          variants={letterVariants}
        >
          <span className="bg-gradient-to-r from-purple-600 to-rose-500 bg-clip-text text-transparent">
            متجر التجميل
          </span>
        </motion.h1>

        <motion.p
          className="text-fluid-lg text-gray-600 mb-8 max-w-2xl mx-auto"
          variants={letterVariants}
        >
          منتجات تجميل رجالية ونسائية - جملة وتجزئة
        </motion.p>

        <motion.div
          variants={letterVariants}
          className="flex gap-4 justify-center flex-wrap"
        >
          <motion.a
            href="/men"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-purple-600 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            تسوق رجالي
          </motion.a>
          <motion.a
            href="/women"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-rose-500 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            تسوق نسائي
          </motion.a>
        </motion.div>
      </motion.div>

      {/* مؤشر التمرير */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <motion.div
            className="w-1.5 h-3 bg-gray-400 rounded-full mt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
```

**ملف:** `src/components/shop/CinematicProductCard.tsx`

```typescript
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { WhatsAppButton } from './WhatsAppButton'

interface Props {
  product: {
    id: string
    nameAr: string
    price: number
    wholesalePrice?: number | null
    images: string[]
    category: { nameAr: string }
  }
  index: number
}

export function CinematicProductCard({ product, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1, // stagger effect
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
    >
      {/* صورة المنتج مع zoom على hover */}
      <div className="relative aspect-square overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full h-full"
        >
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.nameAr}
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Overlay على hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4"
        >
          <WhatsAppButton
            productName={product.nameAr}
            className="w-full justify-center"
          />
        </motion.div>

        {/* شارة القسم */}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
          {product.category.nameAr}
        </span>
      </div>

      {/* معلومات المنتج */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.nameAr}</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-purple-600">
            {formatPrice(Number(product.price))}
          </span>
          {product.wholesalePrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(Number(product.wholesalePrice))}
            </span>
          )}
        </div>
        {product.wholesalePrice && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
          >
            سعر الجملة: {formatPrice(Number(product.wholesalePrice))}
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}
```

**ملف:** `src/components/shop/CinematicSection.tsx` - قالب للأقسام

```typescript
'use client'

import { motion } from 'framer-motion'

interface Props {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export function CinematicSection({ title, subtitle, children, className }: Props) {
  return (
    <section className={`py-16 md:py-24 ${className || ''}`} data-scroll-section>
      <div className="container mx-auto px-4">
        {/* عنوان القسم مع حركة دخول */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-fluid-2xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-fluid-base text-gray-500 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          {/* خط زخرفي متحرك */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '80px' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-purple-500 to-rose-500 rounded-full mx-auto mt-4"
          />
        </motion.div>

        {children}
      </div>
    </section>
  )
}
```

---

### Task 30: تأثيرات التمرير المتقدمة (Parallax + Reveal)

**الهدف:** تأثيرات بصرية متقدمة أثناء التمرير

**ملف:** `src/components/shop/ParallaxSection.tsx`

```typescript
'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function ParallaxSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // تأثيرات parallax متعددة
  const y1 = useTransform(scrollYProgress, [0, 1], ['-20%', '20%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9])

  return (
    <div ref={ref} className="relative h-screen overflow-hidden">
      {/* طبقة خلفية - تتحرك ببطء */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-900 to-rose-900"
        style={{ y: y1 }}
      />

      {/* طبقة وسطى */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ y: y2, opacity, scale }}
      >
        <div className="text-center text-white">
          <h2 className="text-fluid-3xl font-bold mb-4">تجربة تسوق فريدة</h2>
          <p className="text-fluid-lg opacity-80">منتجات أصلية بأسعار تنافسية</p>
        </div>
      </motion.div>

      {/* طبقة أمامية - تتحرك أسرع */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"
        style={{ y: useTransform(scrollYProgress, [0, 1], ['10%', '-10%']) }}
      />
    </div>
  )
}
```

**ملف:** `src/components/shop/StaggerReveal.tsx` - كشف متدرج للعناصر

```typescript
'use client'

import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

interface Props {
  children: React.ReactNode
  className?: string
}

export function StaggerReveal({ children, className }: Props) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={i} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  )
}
```

---

### Task 31: Mobile Navigation - قائمة متحركة للموبايل

**الهدف:** قائمة جانبية سينمائية للموبايل

**ملف:** `src/components/layout/MobileNav.tsx`

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const menuVariants = {
  closed: {
    x: '100%',
    transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
  },
  open: {
    x: 0,
    transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
  },
}

const linkVariants = {
  closed: { opacity: 0, x: 40 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.4 },
  }),
}

const links = [
  { href: '/', label: 'الرئيسية' },
  { href: '/men', label: 'رجالي' },
  { href: '/women', label: 'نسائي' },
  { href: '/wholesale', label: 'جملة' },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      {/* زر القائمة */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-700 hover:text-purple-600 transition-colors"
        aria-label="فتح القائمة"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* خلفية معتمة */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* القائمة الجانبية */}
            <motion.nav
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 shadow-2xl"
            >
              {/* هيدر القائمة */}
              <div className="flex items-center justify-between p-4 border-b">
                <span className="text-lg font-bold text-purple-600">القائمة</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="إغلاق القائمة"
                >
                  <X size={20} />
                </button>
              </div>

              {/* روابط القائمة */}
              <div className="p-4">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    variants={linkVariants}
                    custom={i}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-4 px-4 text-lg font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* زر واتساب */}
                <motion.div
                  variants={linkVariants}
                  custom={links.length}
                  className="mt-6"
                >
                  <a
                    href={`https://wa.me/966500000000`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    تواصل واتساب
                  </a>
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
```

---

### Task 32: تحسينات RWD للمكونات الأساسية

**ملف:** `src/components/layout/Header.tsx` - تحديث للـ RWD

```typescript
'use client'

import Link from 'next/link'
import { MobileNav } from './MobileNav'
import { motion } from 'framer-motion'

export function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* الشعار */}
          <Link href="/" className="text-xl md:text-2xl font-bold">
            <span className="bg-gradient-to-r from-purple-600 to-rose-500 bg-clip-text text-transparent">
              متجر التجميل
            </span>
          </Link>

          {/* قائمة سطح المكتب */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '/', label: 'الرئيسية' },
              { href: '/men', label: 'رجالي' },
              { href: '/women', label: 'نسائي' },
              { href: '/wholesale', label: 'جملة' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* أزرار سطح المكتب */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`https://wa.me/966500000000`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
              </svg>
              واتساب
            </a>
          </div>

          {/* قائمة الموبايل */}
          <MobileNav />
        </div>
      </div>
    </motion.header>
  )
}
```

---

## ملخص الأوامر الإضافية

```bash
# تثبيت حزم الانتقالات والتمرير
npm install framer-motion locomotive-scroll

# تثبيت أيقونات
npm install lucide-react
```

---

## ملاحظات هامة

1. **اللغة:** الواجهة بالعربية بشكل افتراضي (RTL)، مع دعم الإنجليزية
2. **الواتساب:** الطلب يتم عبر رابط wa.me المباشر - لا حاجة لـ API معقد
3. **الجملة:** المنتجات التي لها `wholesalePrice` تظهر في قسم الجملة مع حد أدنى للكمية
4. **الأدمن:** مستخدم واحد (admin) - لا حاجة لتسجيل مستخدمين عاديين
5. **الحماية:** جميع المدخلات تخضع للتحقق عبر Zod، كلمات المرور مشفرة بـ bcrypt (12 round)
6. **الصور:** تخزين محلي في `public/uploads/` مع حد أقصى 5MB للصورة
7. **RWD:** تصميم Mobile-first مع 4 breakpoints (480/768/1024/1280)، fluid typography باستخدام clamp()
8. **الانتقالات:** Framer Motion AnimatePresence للانتقالات بين الصفحات، Locomotive Scroll للتمرير السينمائي
9. **الأداء:** تعطيل smooth scroll على الموبايل، احترام prefers-reduced-motion، lazy loading للصور
10. **الـ Parallax:** استخدام data-scroll-speed من Locomotive + useScroll/useTransform من Framer Motion
