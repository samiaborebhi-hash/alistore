'use client'

import { useState } from 'react'
import { Plus, Trash2, Percent, DollarSign } from 'lucide-react'

interface Break {
  quantity: number
  discountType: 'percentage' | 'fixed'
  discountValue: number
}

export function QuantityBreaksEditor({ initial }: { initial?: string }) {
  const [enabled, setEnabled] = useState(false)
  const [breaks, setBreaks] = useState<Break[]>(() => {
    try { return initial ? JSON.parse(initial) : [] } catch { return [] }
  })

  function addBreak() {
    setBreaks([...breaks, { quantity: 2, discountType: 'percentage', discountValue: 10 }])
  }

  function removeBreak(i: number) {
    setBreaks(breaks.filter((_, idx) => idx !== i))
  }

  function updateBreak(i: number, field: keyof Break, value: string | number) {
    setBreaks(breaks.map((b, idx) => idx === i ? { ...b, [field]: value } : b))
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="enableQuantityBreaks" value={enabled ? 'true' : 'false'} />
      <input type="hidden" name="quantityBreaks" value={JSON.stringify(breaks)} />

      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => setEnabled(!enabled)}
          className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-purple-600' : 'bg-gray-300'}`}
        >
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'left-6' : 'left-0.5'}`} />
        </div>
        <span className="font-medium text-sm text-gray-700">تفعيل عروض الكميات والأسعار المتدرجة</span>
      </label>

      {enabled && (
        <div className="space-y-3 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">شرائح الخصم</p>
            <button type="button" onClick={addBreak} className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700">
              <Plus size={14} /> إضافة شريحة
            </button>
          </div>

          {breaks.map((brk, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">الكمية</label>
                <input
                  type="number"
                  min={1}
                  value={brk.quantity}
                  onChange={e => updateBreak(i, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">نوع الخصم</label>
                <select
                  value={brk.discountType}
                  onChange={e => updateBreak(i, 'discountType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="percentage">نسبة مئوية %</option>
                  <option value="fixed">مبلغ ثابت</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 block mb-1">قيمة الخصم</label>
                <input
                  type="number"
                  step="0.01"
                  value={brk.discountValue}
                  onChange={e => updateBreak(i, 'discountValue', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button type="button" onClick={() => removeBreak(i)} className="mt-5 p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {breaks.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-4">لا توجد شرائح خصم. اضغط "إضافة شريحة" للبدء.</p>
          )}
        </div>
      )}
    </div>
  )
}