/**
 * AliStore - Full Database Backup Script (JSON + SQL-style INSERT)
 * يقوم بتصدير جميع بيانات قاعدة البيانات إلى JSON + SQL INSERTs
 * Run: npx tsx scripts/backup-db.ts
 */

import { PrismaClient } from '@prisma/client'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const db = new PrismaClient()

function toSQLValue(val: unknown): string {
  if (val === null || val === undefined) return 'NULL'
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE'
  if (typeof val === 'number') return String(val)
  if (val instanceof Date) return `'${val.toISOString()}'`
  const str = String(val).replace(/'/g, "''")
  return `'${str}'`
}

function toInsertSQL(table: string, rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return `-- ${table}: no data\n`
  const cols = Object.keys(rows[0])
  const lines = rows.map(row => {
    const vals = cols.map(c => toSQLValue(row[c])).join(', ')
    return `INSERT INTO "${table}" (${cols.map(c => `"${c}"`).join(', ')}) VALUES (${vals});`
  })
  return `-- Table: ${table} (${rows.length} rows)\n` + lines.join('\n') + '\n'
}

async function main() {
  console.log('🔄 جارٍ تصدير قاعدة البيانات الكاملة...\n')

  const [
    users,
    categories,
    products,
    reviews,
    orders,
    orderItems,
    siteSettings,
    menuItems,
    promotions,
    carts,
    cartItems,
    pages,
    contentBlocks,
    collections,
    productCollections,
  ] = await Promise.all([
    db.user.findMany(),
    db.category.findMany(),
    db.product.findMany(),
    db.review.findMany(),
    db.order.findMany(),
    db.orderItem.findMany(),
    db.siteSettings.findMany(),
    db.menuItem.findMany(),
    db.promotion.findMany(),
    db.cart.findMany(),
    db.cartItem.findMany(),
    db.page.findMany(),
    db.contentBlock.findMany(),
    db.collection.findMany(),
    db.productCollection.findMany(),
  ])

  const tableMap = {
    User: users,
    Category: categories,
    Product: products,
    Review: reviews,
    Order: orders,
    OrderItem: orderItems,
    SiteSettings: siteSettings,
    MenuItem: menuItems,
    Promotion: promotions,
    Cart: carts,
    CartItem: cartItems,
    Page: pages,
    ContentBlock: contentBlocks,
    Collection: collections,
    ProductCollection: productCollections,
  }

  const backupDir = join(process.cwd(), 'backups')
  mkdirSync(backupDir, { recursive: true })

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)

  // ─── 1. JSON Backup ───────────────────────────────────────────────
  const jsonBackup = {
    exportedAt: new Date().toISOString(),
    version: '2.0.0',
    project: 'AliStore / alipro',
    host: 'ep-frosty-flower-autbbgzy-pooler.c-10.us-east-1.aws.neon.tech',
    database: 'neondb',
    tables: Object.fromEntries(
      Object.entries(tableMap).map(([name, data]) => [
        name,
        { count: data.length, data },
      ])
    ),
  }

  const jsonFile = join(backupDir, `backup-${timestamp}.json`)
  writeFileSync(jsonFile, JSON.stringify(jsonBackup, null, 2), 'utf-8')

  // ─── 2. SQL Backup ────────────────────────────────────────────────
  const sqlLines: string[] = [
    `-- ============================================================`,
    `-- AliStore Database Backup`,
    `-- Exported: ${new Date().toISOString()}`,
    `-- Database: neondb @ Neon PostgreSQL`,
    `-- ============================================================`,
    ``,
    `-- Disable triggers during restore`,
    `SET session_replication_role = 'replica';`,
    ``,
  ]

  // Ordered by FK dependencies
  const sqlOrder: [string, Record<string, unknown>[]][] = [
    ['User', users as Record<string, unknown>[]],
    ['Category', categories as Record<string, unknown>[]],
    ['SiteSettings', siteSettings as Record<string, unknown>[]],
    ['MenuItem', menuItems as Record<string, unknown>[]],
    ['Promotion', promotions as Record<string, unknown>[]],
    ['Collection', collections as Record<string, unknown>[]],
    ['Page', pages as Record<string, unknown>[]],
    ['ContentBlock', contentBlocks as Record<string, unknown>[]],
    ['Product', products as Record<string, unknown>[]],
    ['Review', reviews as Record<string, unknown>[]],
    ['ProductCollection', productCollections as Record<string, unknown>[]],
    ['Order', orders as Record<string, unknown>[]],
    ['OrderItem', orderItems as Record<string, unknown>[]],
    ['Cart', carts as Record<string, unknown>[]],
    ['CartItem', cartItems as Record<string, unknown>[]],
  ]

  for (const [table, rows] of sqlOrder) {
    sqlLines.push(toInsertSQL(table, rows))
  }

  sqlLines.push(`SET session_replication_role = 'origin';`)
  sqlLines.push(`-- ============================================================`)
  sqlLines.push(`-- Backup complete`)
  sqlLines.push(`-- ============================================================`)

  const sqlFile = join(backupDir, `backup-${timestamp}.sql`)
  writeFileSync(sqlFile, sqlLines.join('\n'), 'utf-8')

  // ─── 3. Summary ───────────────────────────────────────────────────
  console.log('✅ تم التصدير بنجاح!\n')
  console.log(`📄 JSON: backups/backup-${timestamp}.json`)
  console.log(`📄 SQL:  backups/backup-${timestamp}.sql\n`)

  console.log('📊 إحصائيات البيانات:')
  let totalRecords = 0
  for (const [table, data] of Object.entries(tableMap)) {
    if (data.length > 0) {
      console.log(`  ✓ ${table.padEnd(20)} ${data.length} سجل`)
      totalRecords += data.length
    } else {
      console.log(`  - ${table.padEnd(20)} فارغ`)
    }
  }
  console.log(`\n  TOTAL: ${totalRecords} سجل عبر ${Object.keys(tableMap).length} جدول`)
  console.log('\n💡 لاستعادة البيانات: قم بتشغيل محتوى ملف .sql على قاعدة بياناتك')
}

main()
  .catch((e) => {
    console.error('❌ خطأ:', e.message)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
