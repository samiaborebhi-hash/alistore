# AliStore - Next.js Beauty E-commerce

A modern beauty e-commerce store built with Next.js 16, TypeScript, Tailwind CSS, Prisma, and NextAuth.

## Features

- 🛍️ Product catalog with categories (Men, Women, Wholesale)
- 🛒 Full shopping cart with WhatsApp checkout
- 🏷️ Promotions and discount system
- 📄 CMS pages (Privacy Policy, Terms, custom pages)
- 📑 Dynamic menus (header, footer, sidebar, custom positions)
- ⚙️ Admin dashboard for managing products, orders, settings, menus, promotions, and pages
- 🔐 Admin authentication with NextAuth v5

## Tech Stack

- Next.js 16 (Turbopack)
- TypeScript
- Tailwind CSS v4
- Prisma v5
- PostgreSQL (via Neon)
- NextAuth.js v5
- Framer Motion

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values.

3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Seed the database:
   ```bash
   npx tsx prisma/seed.ts
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Admin Credentials

- Email: `admin@alipro.com`
- Password: `Admin@123456`

## Deployment

This project is configured for deployment on Cloudflare Pages with Neon PostgreSQL.
