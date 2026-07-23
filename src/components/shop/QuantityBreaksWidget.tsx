'use client'

import { useState } from 'react'
import { Check, Tag } from 'lucide-react'

interface Break {
  quantity: number
  discountType: 'percentage' | 'fixed'
  discountValue: number
}

interface Props {
  breaks: Break[]
  basePrice: number
  productId: string
  productName: string
}

export function QuantityBreaksWidget({ breaks, basePrice, productId, productName }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  // Sort breaks by quantity ascending
  const sorted = [...breaks].sort((a, b) => a.quantity - b.quantity)

  function getFinalPrice(brk: Break): number {
    if (brk.discountType === 'percentage') {
      return Math.round(basePrice * (1 - brk.discountValue / 100) * 100) / 100
    }
    return Math.max(0, Math.round((basePrice - brk.discountValue) * 100) / 100)
  }

  function selectBreak(brk: Break, idx: number) {
    const finalPrice = getFinalPrice(brk)
    setSelected(idx)
    // Dispatch custom event for AddToCartButton to pick up
    window.dispatchEvent(new CustomEvent('quantity-break-selected', {
      detail: { productId, quantity: brk.quantity, finalPrice, breakInfo: brk }
    }))
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-rose-50 rounded-2xl p-4 md:p-5 border border-purple-100">
      <div className="flex items-center gap-2 mb-4">
        <Tag size={18} className="text-purple-600" />
        <h3 className="font-bold text-gray-800 text-sm md:text-base">عروض الكمية — وفّر أكثر عند شراء المزيد</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
        {sorted.map((brk, i) => {
          const finalPrice = getFinalPrice(brk)
          const savings = basePrice * brk.quantity - finalPrice * brk.quantity
          const isSelected = selected === i

          return (
            <button
              key={i}
              type="button"
              onClick={() => selectBreak(brk, i)}
              className={`relative text-right p-3 md:p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-purple-500 bg-white shadow-md'
                  : 'border-gray-200 bg-white/60 hover:border-purple-300 hover:bg-white'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 left-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{brk.quantity} قطعة</p>
                <p className="text-xl font-bold text-purple-600 mt-1">
                  {finalPrice} <span className="text-sm font-normal">ر.س</span>
                </p>
                <p className="text-xs text-gray-400 line-through mt-0.5">
                  {(basePrice * brk.quantity).toFixed(2)} ر.س
                </p>
                {savings > 0 && (
                  <p className="text-xs text-green-600 font-medium mt-1">
                    وفّر {savings.toFixed(2)} ر.س
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}