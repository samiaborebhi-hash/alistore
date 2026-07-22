import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('بريد إلكتروني غير صالح').max(254),
  password: z.string().min(8, 'كلمة المرور قصيرة').max(128),
})

export const ProductSchema = z.object({
  name: z.string().min(2).max(200),
  nameAr: z.string().min(2).max(200),
  description: z.string().max(5000).optional().nullable(),
  descriptionAr: z.string().max(5000).optional().nullable(),
  price: z.number().positive('السعر يجب أن يكون أكبر من صفر'),
  wholesalePrice: z.number().positive().optional().nullable(),
  minWholesaleQty: z.number().int().positive().optional().nullable(),
  stock: z.number().int().min(0),
  categoryId: z.string().min(1),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  tags: z.string().default('[]'),
  images: z.string().default('[]'),
})

export const OrderSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().regex(/^\+?[0-9]{8,15}$/, 'رقم هاتف غير صالح'),
  customerEmail: z.string().email().optional().nullable().or(z.literal('')),
  type: z.enum(['retail', 'wholesale']),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })).min(1),
  notes: z.string().max(1000).optional().nullable(),
})
