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

export interface OrderDetails {
  customerName: string
  customerPhone: string
  type: 'retail' | 'wholesale'
  items: { name: string; quantity: number; price: number }[]
  totalAmount: number
  notes?: string
}

export function generateWhatsAppOrderMessage(order: OrderDetails): string {
  const typeLabel = order.type === 'wholesale' ? 'جملة' : 'تجزئة'
  const itemsList = order.items
    .map((item, i) => `${i + 1}. ${item.name} ×${item.quantity} (${item.price} ر.س) = ${item.price * item.quantity} ر.س`)
    .join('\n')

  return `🛍️ *طلب جديد - ${typeLabel}*

👤 *العميل:* ${order.customerName}
📱 *الهاتف:* ${order.customerPhone}

📦 *المنتجات:*
${itemsList}

💰 *الإجمالي:* ${order.totalAmount.toLocaleString()} ر.س
${order.notes ? `\n📝 *ملاحظات:* ${order.notes}` : ''}

---
شكراً لثقتكم 🤍`
}

export function generateWhatsAppProductInquiry(productName: string, price: number, wholesalePrice?: number | null): string {
  return `👋 مرحباً،

أرغب في الاستفسار عن:
🛍️ *${productName}*
💰 السعر: ${price} ر.س${wholesalePrice ? `\n📦 سعر الجملة: ${wholesalePrice} ر.س` : ''}

هل يمكنكم تزويدي بمزيد من التفاصيل؟`
}
