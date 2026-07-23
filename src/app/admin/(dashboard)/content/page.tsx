'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Save, Loader2 } from 'lucide-react'

interface ContentBlock {
  id: string
  key: string
  label: string
  value: string
  type: string
  page: string
}

export default function ContentPage() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(data => {
        setBlocks(data)
        const vals: Record<string, string> = {}
        data.forEach((b: ContentBlock) => { vals[b.id] = b.value })
        setValues(vals)
      })
      .finally(() => setLoading(false))
  }, [])

  async function save(id: string) {
    setSaving(id)
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, value: values[id] }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('تم الحفظ')
    } catch {
      toast.error('فشل الحفظ')
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" size={32} /></div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">محتوى الصفحات</h1>
      <p className="text-gray-500 mb-6">عدّل النصوص الظاهرة في الموقع. كل تغيير يُحفظ فوراً.</p>

      <div className="space-y-4">
        {blocks.map(block => (
          <div key={block.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">{block.label}</label>
            <div className="flex gap-2">
              {block.type === 'textarea' ? (
                <textarea
                  value={values[block.id] || ''}
                  onChange={e => setValues({ ...values, [block.id]: e.target.value })}
                  rows={3}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              ) : (
                <input
                  type="text"
                  value={values[block.id] || ''}
                  onChange={e => setValues({ ...values, [block.id]: e.target.value })}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
              )}
              <button
                onClick={() => save(block.id)}
                disabled={saving === block.id}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-rose-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 shrink-0"
              >
                {saving === block.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                حفظ
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-mono">{block.key}</p>
          </div>
        ))}
      </div>
    </div>
  )
}